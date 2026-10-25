/**
 * 
 */

var listFullProyectosVigilante=[];
var listContratistaVigilante;
var listTrabajadoresVigilante;
var menuDerechaVigilante=[
                                
    {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"",
    	titulo:"Perfil",adicional:"Vigilancia <label id='empresaActual'> </label>"}
    ];

var menuFuncionesIzquierdaVigilante=[

 {moduloId:22,icono:"fa-users",ident:"icoContra",funcionClick:function(){habilitarProyectosContratistaVigilante()},titulo:"Contratistas",adicional:""},
 {moduloId:22,icono:"fa-arrow-circle-o-down ",ident:"icoInduc",funcionClick:function(){habilitarInduccionesVigilante()},titulo:"Inducciones",adicional:""},

 {moduloId:22,icono:"fa-times-circle",ident:"icoCerrar",funcionClick:function(){cerrarSesion()},titulo:"Cerrar Sesión",adicional:""}
 ];
function marcarIconoModuloSeleccionadoVigilante(menuIndex){
	 $("#menuExplicativo").hide();
	 $(".divContainerGeneral").show();
		$(".divListModulos").find("li").removeClass("activeMenu");
		$(".divListPrincipal").html("");
		$(".gosst-aviso").remove();
		var menuObject=menuFuncionesIzquierdaVigilante[menuIndex];
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
		
		$(".divTituloFull").find("h4").html(menuObject.titulo);
}
function verLateralesFijosVigilante(){
	var dataParamAux = {
			mdfId:getSession("unidadGosstId"),
			empresaId:getSession("gestopcompanyid"),
			trabajadorId:parseInt(getSession("trabajadorGosstId"))
		};
	$("#menuPrincipal")
	.html("Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida")
	.css({color:"white","margin-top": "12px"});
	
	$(".navbar").css({"min-height": "48px","margin-bottom": "0px","top":"0px"});
	
	var logo=$("#logoMenu");
	logo.css({"background-color":"#2e9e8f","margin-top":"-18px"})
	.attr("onclick","volverMenuInicio()");
	$("#barraMenu").css({"position": "fixed",
    "width": "100%"});
	$("#barraMenu").find(".navbar-right").html("<ul></ul> ");
	menuDerechaVigilante.forEach(function(val,index){
		var claseSub="class='iconoLink dropdown-toggle' data-toggle='dropdown'";
		if(val.ident!="icoPerfil"){
			claseSub="class='iconoLink'";
			
		}else{
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
	 $("#icoPerfil a #empresaActual").html(getSession("gestopcompanyname").substr(0,12))
 
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
menuFuncionesIzquierdaVigilante.forEach(function(val,index){
		$(".divListModulos").find("ul").append("" +
				"<li class='list-group-item' id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoVigilante("+index+")'>" +
				"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
		$("#menuFigureti").find("ul").append("" +
				"<li class='list-group-item' style='color: #2e9e8f'  id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoVigilante("+index+")'>" +
				"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
	}); 
	$("#menuMovilGosst").on("click",function(){
		$(".divContainerGeneral").toggle();
	});
$(".divListSecundaria").html("");
}
function habilitarProyectosContratistaVigilante(){
	callAjaxPost(URL + '/contratista/vigilante', {empresaId:getSession("gestopcompanyid")}, 
			function(data){
		listContratistaVigilante=data.contratistas;
		listContratistaVigilante.forEach(function(val){
			val.nombreCompleto=val.nombre+"  (RUC: "+val.ruc+" )"
		});
		var objTodo=[{nombreCompleto:"TODOS",id:0 ,trabajadores:[]}];
		listContratistaVigilante = objTodo.concat(listContratistaVigilante);
		var	listPanelesPrincipalResumen=
			[{id:"subBuscador",clase:"divProyectoGeneral",proyectoId:null,
				nombre:"",contenido:""},
				{id:"subResult",clase:"",proyectoId:null,nombre:"",contenido:""},
				{id:"subDetalle",clase:"",proyectoId:null,nombre:"Trabajadores del contratista (Lista Completa)",contenido:""}
				];
	agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);
	completarBarraCarga();
	var textoForm="";
	var listItemsForm=[
	{sugerencia:"",label:"Empresa",inputForm:"... ",divContainer:"divSelEmpresa"},
	{sugerencia:" ",label:"Trabajador",inputForm:"...",divContainer:"divSelTrabajador"}
	];
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModulo(val); 
	});
	///
	//$(".divListPrincipal").find("#subDetalle .tituloSubList")
	//.html("Resumen de Contratista");
	$(".divListPrincipal").find("#subResult .tituloSubList")
	.html("Resultado de búsqueda");
	$(".divListPrincipal").find("#subBuscador .tituloSubList")
	.html("Buscar Trabajadores");
	$("#subBuscador").find(".contenidoSubList").show().html(
			"<form class='eventoGeneral' id='buscadorVigilante'>"+
			textoForm+
			 "<button type='submit' class='btn btn-success' >" +
			 "<i aria-hidden='true' class='fa fa-search'></i>Buscar</button>"+
			"</form>"
	);
	crearSelectOneMenuObligUnitarioCompleto("selEmpresaVigilante", "verAcordeContratistaVigilante()", listContratistaVigilante, "id",
			"nombreCompleto","#divSelEmpresa","Empresa",null);
	verAcordeContratistaVigilante();
	$('#buscadorVigilante').on('submit', function(e) {
	    e.preventDefault();verAcordeTrabajadorContratistaVigilante();
	}); 
});
}
function verAcordeContratistaVigilante(){
	var contratistaId=parseInt($("#selEmpresaVigilante").val());
	listTrabajadoresVigilante=[];
	listContratistaVigilante.forEach(function(val){
		if(val.id==contratistaId   ||  contratistaId==0){
			//
			$("#subDetalle").find(".contenidoSubList")
			.html("");
			
			//
			listTrabajadoresVigilante=listTrabajadoresVigilante.concat(val.trabajadores);
			listTrabajadoresVigilante.forEach(function(val){
				val.nombreCompleto=val.nombre+" ("+val.tipoDocumento.nombre+": "+val.nroDocumento+")";
				var verificacionObj=verificarTrabajadorContratistaHabilitado(val);
				
				var infoArray=[
				               {campo:"Nombre",descripcion:"<strong>"+val.nombre+"</strong>"},
				               {campo:val.tipoDocumento.nombre,descripcion:"<strong>"+val.nroDocumento+"</strong>"},
				              // {campo:"Certificado Médico",descripcion:""+verificacionObj.textoExamenVigilante.replace("<br>","")},
				               {campo:"SCTR",descripcion:""+verificacionObj.textoSctrVigilante.replace("<br>","")},
				               {campo:"Inducción",descripcion:""+verificacionObj.textoInduccionVigilante.replace("<br>","")}];
				var informacionTexto="";
				infoArray.forEach(function(val,index){
					informacionTexto+="<tr>" +
					"<td style='width:177px;'>"+val.campo+"</td>" +
					"<td>"+val.descripcion+"</td>" +
					"</tr>" ;
				});
				$("#subDetalle").find(".contenidoSubList")
				.append("<div class='eventoGeneral'><table class='table table-user-information'>" +
						"<tbody>" +
						informacionTexto+
						"</tbody>" +
						"</table>" +
						"</div>");
				
				
			});
		}
	});
	crearSelectOneMenuObligUnitarioCompleto("selTrabajadoresEmpresaVigilante", 
			"verAcordeTrabajadorContratistaVigilante()", listTrabajadoresVigilante, "id",
			"nombreCompleto","#divSelTrabajador","Trabajador",null);
	verAcordeTrabajadorContratistaVigilante();
	$('#selTrabajadoresEmpresaVigilante_chosen').trigger('mousedown');
	
}
function obtenerHoraFechaActual(){
	var ahora=new Date();
	var minutes = (ahora.getMinutes()<10 ? "0"+ahora.getMinutes():  ahora.getMinutes() );
	var hour = ahora.getHours();
	return obtenerFechaActualNormal()+"  "+ hour+":"+minutes;
}
function verAcordeTrabajadorContratistaVigilante(){
	var trabajadorId=$("#selTrabajadoresEmpresaVigilante").val();
	var trabajadorObj=null;
	listTrabajadoresVigilante.forEach(function(val){
		if(val.id==trabajadorId){
			trabajadorObj=val;
		}
	});
	if(trabajadorObj!=null){
	callAjaxPost(URL + '/contratista/trabajador/info', {id:trabajadorId}, 
			function(data){
		$("#subResult .tituloSubList").html("Resultado de búsqueda<br> <h5 style='margin-bottom:0px'>Actualizado  "+obtenerHoraFechaActual()+" </h5>")
		var textFoto="Sin Registrar";
		if(data.trab!=null){
			textFoto=insertarImagenParaTablaMovil(data.trab.evidenciaFoto,"","100%")
		}
		
		var verificacionObj=verificarTrabajadorContratistaHabilitado(trabajadorObj);
		var infoArray=[
		               {campo:"Nombre",descripcion:"<strong>"+trabajadorObj.nombre+"</strong>"},
		               {campo:trabajadorObj.tipoDocumento.nombre,descripcion:"<strong>"+trabajadorObj.nroDocumento+"</strong>"},
		              
		              // {campo:"Certificado Médico",descripcion:""+verificacionObj.textoExamenVigilante.replace("<br>","")},
		               {campo:"SCTR",descripcion:""+verificacionObj.textoSctrVigilante.replace("<br>","")},
		               {campo:"Inducción",descripcion:""+verificacionObj.textoInduccionVigilante.replace("<br>","")},
		               {campo:"Foto",descripcion:textFoto}];
		var informacionTexto="";
		infoArray.forEach(function(val,index){
			informacionTexto+="<tr>" +
			"<td style='width:177px;'>"+val.campo+"</td>" +
			"<td>"+val.descripcion+"</td>" +
			"</tr>" ;
		});
		$("#subResult").find(".contenidoSubList")
		.html("<div class='eventoGeneral'><table class='table table-user-information'>" +
				"<tbody>" +
				informacionTexto+
				"</tbody>" +
				"</table>" +
				"</div>");
	})
	}else{
		$("#subResult").find(".contenidoSubList")
		.html("<div class='eventoGeneral'>Sin Trabajadores"+
				"</div>");
	}
	
	
}






