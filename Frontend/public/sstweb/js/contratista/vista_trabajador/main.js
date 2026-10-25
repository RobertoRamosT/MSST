var menuDerechaTrabContratista=[
                 
                 {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"marcarIconoModuloContratista(0)",titulo:"Perfil",adicional:""}];

var menuIzquierdaTrabContratista=[
{moduloId:22,icono:"fa-book",ident:"icoCurso",
funcionClick:function(){habilitarObservacionesTrabajador()},titulo:"Observaciones",adicional:""},
{moduloId:22,icono:"fa-user",ident:"icoPerfil",
	funcionClick:function(){habilitarPerfilContratistaTrabajador()},titulo:"",adicional:""}
				];


 
function marcarIconoModuloContratistaTrabajador(menuIndex,variableAux){
	$(document).scrollTop(0);
	var menuObject=menuIzquierdaTrabContratista[menuIndex];
	 $("#menuExplicativo").hide();
	 $(".gosst-aviso").remove();
	 $(".divContainerGeneral").show();
		$(".divListModulos").find("li").removeClass("activeMenu");
		$(".divListPrincipal").html("");
		$(".divTituloFull").find("h4").html(menuObject.titulo)
		
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
			menuObject.funcionClick(variableAux);
		}else{
			verSeccionRestringida();
		}
		
		
		
}

 
function verLateralesFijosContratistaTrabajador(){
 $("#wrapperList").remove();$("#divListaTabs").remove();
	$("#menuPrincipal").html("" +
			"<input placeholder='Buscar ' type='text' class='buscadorGosst' style='width:280px'>" +
			"Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida")
	.css({color:"white"});
	$(".buscadorGosst").css({"margin-top": "8px",
	    "border-radius": "21px","color":"black",
	    "background-color": "#ffffff"});
	$(".navbar").css({"min-height": "48px","margin-bottom": "0px","top":"0px"});
	var logo=$("#logoMenu");
	logo.css({"background-color":"#2e9e8f","margin-top":"-18px"})
	.attr("onclick","volverMenuInicio()");
	$("#barraMenu").css({"position": "fixed",
    "width": "100%"});
	$("#barraMenu").find(".navbar-right").html("<ul></ul> ");
	menuDerechaTrabContratista.forEach(function(val,index){
		var claseSub="class='iconoLink dropdown-toggle' data-toggle='dropdown'";
		if(val.ident!="icoPerfil"){
			claseSub="class='iconoLink'";
			
		}else{
			val.onclick="";
			val.adicional = "Perfil "+getSession("gestopusername").substr(0,20);
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
	var listInfoAdicional=[
{id:"infoTrabs",nombre:"Trabajadores",faIcon:"users",infoAyuda:"info de ayuda 123"},
                   {id:"infoDoc",nombre:"Documentos",faIcon:"files-o",infoAyuda:"Documentos que necesita revisar el contratante antes de aprobar el proyecto al contratista"},
                   {id:"infoPlan",nombre:"Programa ",faIcon:"sort-amount-asc",infoAyuda:"info de ayuda 2"},
                   {id:"infoForm",nombre:"Capacitaciones Online",faIcon:"graduation-cap",infoAyuda:"info de ayuda 3"},
                   {id:"infoObs",nombre:"Observaciones",faIcon:"eye",infoAyuda:"info de ayuda 7"},
                   {id:"infoAudi",nombre:"Auditorías",faIcon:"check-square-o",infoAyuda:"info de ayuda 4"},
                   {id:"infoIncid1",nombre:"Incidentes",faIcon:"warning",infoAyuda:"info de ayuda 6"},
                   {id:"infoIncid2",nombre:"Matriz de riesgos",faIcon:"crosshair",infoAyuda:"info de ayuda 612"},
                   {id:"infoIncid3",nombre:"Cargo RISST",faIcon:"warning",infoAyuda:"info de ayuda 62"}];
	var textInfoAdicional="";
	listInfoAdicional.forEach(function(val,index){
		textInfoAdicional+="<div class='panel panel-default'>"+
	      "<div class='panel-heading' data-toggle='collapse' data-parent='#accordion' href='#"+val.id+"'>"+
	        "<h4 class='panel-title' >"+
	          "<i aria-hidden='true' class='fa fa-"+val.faIcon+"'></i>"+val.nombre+
	        "</h4>"+
	      "</div>"+
	      "<div id='"+val.id+"' class='panel-collapse collapse'>"+
	        "<div class='panel-body'>"+
	        val.infoAyuda+
	        "</div>"+
	      "</div>"+
	    "</div>"
	});
	$("body").find("#tabProyectos").remove();
	$("body").append("" +
			"<div class='divTituloFull'><div class='divTituloGeneral'><h4>Mis Actividades SST</h4></div></div>" +
			"<div class='divContainerGeneral'>" +
			"" +
			"<div class='divListModulos'><ul class='list-group'></ul></div>" +
			"<div class='divListPrincipal'></div>" +
			"<div class='divListSecundaria'>" +
			
			
			"</div>"  );
	$("#menuFigureti").html("<ul class='list-group'></ul>");
	menuIzquierdaTrabContratista.forEach(function(val,index){
	$(".divListModulos").find("ul").append("" +
			"<li class='list-group-item' id='"+val.ident+"' onclick='marcarIconoModuloContratistaTrabajador("+index+")'>" +
			"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
			"<span  ></span></i> "+val.titulo+
			"</li>");
	$("#menuFigureti").find("ul").append("" +
			"<li class='list-group-item' style='color: #2e9e8f'  id='"+val.ident+"' onclick='marcarIconoModuloContratistaTrabajador("+index+")'>" +
			"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
			"<span  ></span></i> "+val.titulo+
			"</li>");
});
	completarBarraCarga();

}
 
 

function habilitarPerfilContratistaTrabajador(){

	var textoForm="";
	var listItemsForm=[
	{sugerencia:"",label:"Anterior Contraseña",inputForm:"<input type='password' class='form-control' id='inputOldPass' placeholder=' ' autofocus>"},
	{sugerencia:" ",label:"Nueva Contraseña",inputForm:"<input type='password' class='form-control' id='inpuNewPass' placeholder=' '>"}, 
	{sugerencia:" ",label:"Repetir Contraseña",inputForm:"<input type='password' class='form-control' id='inpuNewNewPass' placeholder=' '>"}, 
	{sugerencia:" ",label:" ",
		inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Cambiar</button>"} 
	];
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModulo(val);
	});
	var listPerfilPrincipal=[
		//	{id:"subListPassword" ,clase:"contenidoFormVisible",
			//nombre:"Cambiar Contraseña",
		//	contenido:"<form class='eventoGeneral' id='nuevoPassTrabajador'>"+textoForm+"</form>"},
			{id:"subListInfoExtra" ,clase:"contenidoFormVisible",
				nombre:"Información General",
				contenido:" "},
			{id:"subListCerrarSession" ,clase:"contenidoFormVisible",
				nombre:"Cerrar Sesión ",contenido:""}
 							];
	agregarPanelesDivPrincipal(listPerfilPrincipal);
	$("#subListCerrarSession").find("button")
	.css({"background-color":"rgb(188, 63, 72)"})
	.html("<i class='fa fa-times fa-2x' aria-hidden='true'></i>")
	.on("click",function(){
		cerrarSesion();
	});
	$('#nuevoPassTrabajador').on('submit', function(e) {
        e.preventDefault();
    	var psw1 = $("#inputOldPass").val();
    	var psw2 = $("#inpuNewPass").val();
    	var psw3 = $("#inpuNewNewPass").val();
    	var band = true;
    	
    	if(psw3.length == 0 || psw2.length == 0 || psw1.length == 0){
    		band = false;
    	}
    	
    	if(band){
    		var dataParam = {
    				contratistaId : getSession("contratistaGosstId"),
    				userName : sessionStorage.getItem("gestopusername"),
    				sessionId : sessionStorage.getItem("gestopsessionId"),
    				accesoUsuarios:getSession("accesoUsuarios"),
    				psw1 : psw1.trim(),
    				psw2 : psw2.trim(),
    				psw3 : psw3.trim()
    			};

    			callAjaxPost(URL + '/login/password/save', dataParam,
    					function(data){
    				$("#inputOldPass").val("");
    				$("#inpuNewPass").val("");
    				$("#inpuNewNewPass").val("");
    				$("#subListPassword").find(".contenidoSubList").hide();
    				switch (data.CODE_RESPONSE) {
    				case "02":
    					alert("El password actual es incorrecto.!");
    					break;
    				case "03":
    					alert("El password se ha bloqueado por demasiados intentos fallidos.!");
    					break;
    				case "05":
    					alert("El password se guardo correctamente.!");
    					break;
    				case "07":
    					alert("La confirmacion del nuevo password es incorrecta.!");
    					break;
    				case "11":
    					alert("La contraseña no es correcta. Ingrese nuevamente");
    					break;
					default:
    					
    					alert("La contraseña ya es usada por otro contratista, por favor ingresa una diferente");
    				}
    			});		
    	} else {
    		alert("Debe ingresar todos los campos.");
    	}
	});
	callAjaxPost(URL + '/login/licencia', {},
			function(data){
		var licencia = data.licencia;
		var infoArray=[
		               {campo:"Usuario",descripcion:getSession("gestopusername")},
		               {campo:"Cargo",descripcion:licencia.puesto},
		               {campo:"Área",descripcion:licencia.area},
			             //   {campo:"Fecha de vigencia de cuenta",descripcion:licencia.fechaVencimiento},
		              {campo:"Empresa Cliente",descripcion:licencia.empresaNombre},
		               {campo:"Logo ",descripcion:insertarImagenParaTablaMovil(licencia.logo,"","100%")},
		               {campo:"Mi Empresa",descripcion:licencia.contratistaNombre},
			               {campo:"Logo",descripcion:insertarImagenParaTablaMovil(licencia.logoContratista,"","100%")}
		               ];
		var informacionTexto="";
		infoArray.forEach(function(val,index){
			informacionTexto+="<tr>" +
			"<td>"+val.campo+"</td>" +
			"<td>"+val.descripcion+"</td>" +
			"</tr>" ;
		}); 
		$("#subListInfoExtra").find(".contenidoSubList")
		.html("<div class='eventoGeneral'><table class='table table-user-information'>" +
				"<tbody>" +
				informacionTexto+
				"</tbody>" +
				"</table>" +
				"</div>");
	});
	
}
 
 
   