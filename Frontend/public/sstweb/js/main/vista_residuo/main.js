/**
 * 
 */
var listFullProyectosResiduo=[];
var menuFuncionesIzquierdaResiduo=[

                 {moduloId:24,icono:"fa-trash",ident:"icioLoaa",
                	 funcionClick:function(){habilitarLocatariosResiduo()},
                	 titulo:"Áreas",adicional:""},
                	 {moduloId:24,icono:"fa-trash",ident:"icioGen",
                    	 funcionClick:function(){habilitarGeneracionsResiduo()},
                    	 titulo:"Generación de residuos",adicional:""},
                    	 {moduloId:24,icono:"fa-trash",ident:"icioTra",
                        	 funcionClick:function(){habilitarTransportistasResiduo()},
                        	 titulo:"Transportistas",adicional:""},
                        	 {moduloId:24,icono:"fa-trash",ident:"icioSal",
                            	 funcionClick:function(){habilitarSalidasResiduo()},
                            	 titulo:"Salida de residuos",adicional:""},  
                            	 {moduloId:24,icono:"fa-trash",ident:"icoInd",
                                	 funcionClick:function(){habilitarIndicadoresResiduo()},
                                	 titulo:"Indicadores",adicional:""},  
                        	 
                            	 
                 ];
var menuDerechaResiduo=[
                 
                 {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"marcarIconoModuloContratista(0)",
                	 titulo:"Perfil",adicional:""}];
function marcarIconoModuloSeleccionadoResiduo(menuIndex){
	 $("#menuExplicativo").hide();
	 $(".divContainerGeneral").show();
		$(".divListModulos").find("li").removeClass("activeMenu");
		$(".divListPrincipal").html("");
		$(".gosst-aviso").remove();
		var menuObject=menuFuncionesIzquierdaResiduo[menuIndex];
		$(".divListModulos #"+menuObject.ident).addClass("activeMenu");
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
			menuObject.funcionClick();
		}else{
			verSeccionRestringida();
		}
		
		$(".divTituloFull").find("h4").html(menuObject.titulo)
		
}
function verLateralesFijosResiduo(){
	$("#menuPrincipal").html("" +
			"<input placeholder='Buscar ' type='text' class='buscadorGosst' style='width:280px'>" +
			"Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida")
	.css({color:"white"});
	$(".navbar").css({"min-height": "48px","margin-bottom": "0px","top":"0px"});
	var logo=$("#logoMenu");
	logo.css({"background-color":"#2e9e8f","margin-top":"-18px"})
	.attr("onclick","volverMenuInicio()");
	$("#barraMenu").css({"position": "fixed",
    "width": "100%"});
	$("#barraMenu").find(".navbar-right").html("<ul></ul> ");
	 
	
	menuDerechaResiduo.forEach(function(val,index){
		var claseSub="class='iconoLink dropdown-toggle' data-toggle='dropdown'";
		if(val.ident!="icoPerfil"){
			claseSub="class='iconoLink'";
		}else{
			val.adicional=getSession("gestopusername").substr(0,12)+".";
			val.onclick="";
		}
		$("#barraMenu").find(".navbar-right").append("" +
				"<li id='"+val.ident+"' title='"+val.titulo+"'><a onclick='"+val.onclick+"'"+ 
				claseSub+"	>"+
				"<i class='fa "+val.icono+" fa-2x' aria-hidden='true'>"+
				"</i> "+val.adicional+"</a></li>"+
				"")
	});
	$("#icoPerfil").append(
			"<ul class='dropdown-menu' style='color :white'>" +
			//"<li onclick='marcarIconoModuloSeleccionado(0)'> <a><i class='fa fa-user-o ' aria-hidden='true'></i>Perfil</a></li>" +
			//"<li onclick='marcarIconoModuloSeleccionado(0)'> <a> <i class='fa fa-exchange ' aria-hidden='true'></i>Cambiar Contraseña</a></li>" +
			"<li class='dropdown-divider' role='presentation'></li>" +
			"<li onclick='cerrarSesion()'> <a> <i class='fa fa-power-off ' aria-hidden='true'></i>Salir</a></li>" +
			"" +
			"</ul>" +
			"" +
			"" +
			"</div>");
	$(".buscadorGosst").css({"margin-top": "8px",
    "border-radius": "21px","color":"black",
    "background-color": "#ffffff"});
	$("body").find("table").remove();
	$("body").find("#divCompletarActividad").remove();
	$("body").find("h4").remove();
	$("body").find(".divTituloFull").remove();
	$("body").find(".divContainerGeneral").remove();
	$("body").append("" +
			"<div class='divTituloFull'><div class='divTituloGeneral'><h4>Mis Actividades SST</h4></div></div>" +
			"<div class='divContainerGeneral'>" +
			"" +
			"<div class='divListModulos'><ul class='list-group'></ul></div>" +
			"<div class='divListPrincipal'></div>" +
			"<div class='divListSecundaria'>" +
				
				"<div id='divObjetivos' style='height:120px'>" +
				"<div class='subDivTitulo'>Objetivos </div><div class='subDivContenido'></div>" +
				"</div>" +
				"<div id='divNoticiaDiaria' style='height:250px'>" +
				"<div class='subDivTitulo'>Noticia del día </div><div class='subDivContenido'></div>" +
				"</div>" +
				"<div id='divPiramide' >" +
				"<div class='subDivTitulo'>Accidentabilidad </div><div class='subDivContenido'></div>" +
				"</div>" +
			"" +
			"</div>"+
			"</div>"  ); 
	$("#menuFigureti").html("<ul class='list-group'></ul>")
menuFuncionesIzquierdaResiduo.forEach(function(val,index){
		$(".divListModulos").find("ul").append("" +
				"<li class='list-group-item' id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoResiduo("+index+")'>" +
				"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
		$("#menuFigureti").find("ul").append("" +
				"<li class='list-group-item' style='color: #2e9e8f'  id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoResiduo("+index+")'>" +
				"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
	}); 
	$("#menuMovilGosst").on("click",function(){
		$(".divContainerGeneral").toggle();
	});
$(".divListSecundaria").html("");
completarBarraCarga();
}
