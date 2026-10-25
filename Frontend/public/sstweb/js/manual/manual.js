var listaModulosPermitidos;
$(function(){
	insertMenu();
	$("#logoMenu span img").attr("src","../../imagenes/logoVertical.png");
	$.blockUI({message:'<img src="../../imagenes/gif/ruedita.gif"></img>cargando...'});
	
	$("head").append(
	"<link href='../../imagenes/logoIcono.ico' rel='shortcut icon' type='image/x-icon'> "		
	);
	$(".navbar-right").css("margin-top","-15px")
	$("#icoManual a").attr("href","manual.html");
	$("#logoMenu").attr("href","../main.html")

	 $.unblockUI();
    
	
})
function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}
function insertMenu(functionCallback) {
	$("#barraMenu").html(CABECERA);
	cargarEmpresasxUsuario(functionCallback);
	
	llamarModulosPermitidosUsuario();
	

}
function cargarEmpresasxUsuario() {
	var dataParam = {
		
	};

	callAjaxPost(URL + '/empresa/usuario', dataParam, procesarMenu);
}

function procesarMenu(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		
		$("#loginUser").html(sessionStorage.getItem("gestopusername") + "<span class='caret'></span>");
		if (sessionStorage.getItem("modulo") != null) {
			
			
		}

		var list = data.list;
		listAyuda=data.listAyuda;
		
		
		for (index = 0; index < list.length; index++) {
			$("#menuEmpresa").append(
					"<li><a href='#' onclick='javascript:seleccionaEmpresa("
					+ list[index].idCompany + ", &#34;"		
					+ list[index].name + "&#34;, &#34;"
							+ list[index].ruc + "&#34;);'>" + list[index].name
							+ "</a></li>");
		}
		if (sessionStorage.getItem("gestopcompanyid") == null) {
			if (list.length > 0) {
				seleccionaEmpresa(list[0].idCompany, list[0].name,list[0].ruc);
				$("#companySelected").html(list[0].name);
			} else {
				createSession("gestopcompanyid", 0);
				$("#companySelected").html("¡No existen empresas!");
			}

		} else {
			$("#companySelected").html(
					sessionStorage.getItem("gestopcompanyname")
							+ " <span class='caret'></span>");
		}
		
		break;
	default:
		alert("Ocurrió un error al traer las empresas!");
	}

}

function callAjaxPost(pUrl, dataParam, funcionRespuesta,funcionBefore,dataBefore) {
	
	$.ajax({
		url : pUrl,
		type : 'post',
		async : true,
//		crossDomain: true,
		xhrFields: {
            withCredentials: true
        },
		data : JSON.stringify(dataParam),
		contentType : "application/json",
		beforeSend:
function(){
			if(funcionBefore==null){
				$.blockUI({message:'<img src="../../imagenes/gif/ruedita.gif"></img>cargando...'});
					
			}else{
				funcionBefore(dataBefore);
			};
			
			
		},
		success : function(data, textStatus, jqXHR) {
			
		
			switch (data.CODE_RESPONSE) {
			case "06":
				sessionStorage.clear();
				document.location.replace(data.PATH);
				break;
			case "07":
				//sessionStorage.clear();
				alert("Sesion expirada");
				//document.location.replace(data.PATH);
				break;
			default:
				funcionRespuesta(data);
			$.unblockUI();
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.unblockUI();
			console.log("Ups, tenemos problemas tecnicos. Intente más tarde. Error: "
					+ errorThrown);
			//console.log('xhRequest: ' + jqXHR + "\n");
			//console.log('ErrorText: ' + textStatus + "\n");
			//console.log('thrownError: ' + errorThrown + "\n");
			//console.log('funcion de respuesta: ' + funcionRespuesta);
			
			var responseText = jQuery.parseJSON(jqXHR.responseText);
			if(responseText.CODE_RESPONSE == "07")
				alert("No tiene permiso!!!");
			//document.location.replace(responseText.PATH);
		}
	});
	
}

function llamarModulosPermitidosUsuario(){
	
	callAjaxPost(URL + '/login/manual', "", procesarLlamadaModulos);
}
function procesarLlamadaModulos(data){
	 listaModulosPermitidos= data.licencia;
	var listaModulos="";
	
	$("#barraMenu").after(
			"<div id='wrapperList' class=''>"+
	        "<!-- Sidebar -->"+
	        "<div id='sidebar-manual'>"+
	         "   <ul class='sidebar-nav-manual nav-pills nav-stacked' id='menu'>"+
	            "</ul>"+
	      "  </div> </div><div id='graficoResumenModulo' class='graficoModulo'>" +
	      "<div id='subDivResumenManual1'></div>" +
	      "<div id='subDivResumen2'></div>" +
	      "</div>"		
	);
	
	$("#subDivResumenManual1").css({"width":"100%"});
	
	
	$("#sidebar-manual").css({"height":$(window).height()-$("nav").height()-3+"px","z-index":"200"});
	
	$(".sidebar-nav").css("width","290px");
      $("#subDivResumen2").css({"max-width":$(window).width()+"px","z-index":"503",
    	  "height":$(window).height()-85+"px","float":"left","overflow-y":"scroll","overflow-x":"scroll"});
      $("#subDivResumen2").css({"padding-left":"20px","padding-right":"80px"})
		
    
	$("#moduloSelected").html(
			sessionStorage.getItem("modulo")
					+ " <span class='caret'></span>");

    
     $("#wrapperList #menu li").remove();
	for(var i=0;i<listaModulosPermitidos.length;i++){
		
		var idModulo=listaModulosPermitidos[i].menuOpcionId;
		var nombreModulo=listaModulosPermitidos[i].menuOpcionNombre;
		var numerSubModulos=listaModulosPermitidos[i].subMenus;
		var icono=listaModulosPermitidos[i].icono;
	var iconoSubFlecha="";
		switch(idModulo){
		case 4:
			iconoSubFlecha='<i class="fa fa-arrow-down" aria-hidden="true"></i>'
			break;
		
		}
			$("#wrapperList #menu").append(
					"<li id='listaModulo"+idModulo+"'>" +
							"<a href='#' " +
							"><span class='fa-stack fa-lg pull-left '><i aria-hidden='true' class='"+icono+" fa-stack-1x'></i></span>"+nombreModulo+iconoSubFlecha+"</a></li>");
			
			if(numerSubModulos.length>0){
			$("#listaModulo"+idModulo).append(
					"<ul class='nav-pills nav-stacked' style='list-style-type:none;margin-left:-10px'>");
		for(var i2=0;i2<numerSubModulos.length;i2++){
			var idSubModulo=numerSubModulos[i2].menuOpcionId;
			var nombreSubModulo=numerSubModulos[i2].menuOpcionNombre;
			var subIcono=numerSubModulos[i2].icono;
			$("#listaModulo"+idModulo+" ul").append(
					"<li id='listaModulo"+idSubModulo+"' >" +
							"<a href='#' ><span class='fa-stack fa-lg pull-left'><i aria-hidden='true' class='"+subIcono+" fa-stack-1x '></i></span>"+nombreSubModulo+"</a></li>"	
			);

		
		};
		$("#listaModulo"+idModulo).append("</ul>");
			}
		
	};

	//crearSubMenu(9, 10, "Puesto de Trabajo");
	
	//crearSubMenu(11, 21, "Trabajador");

	//crearSubMenu(15, 16, "A/C Subest&aacute;ndar");
	
	
	$("#graficoResumenModulo").css({"width":$(window).width()-322+19+"px",
		"max-height":$(window).height()-$("nav").height()-23+"px","left":"313px"});
	
	var subUrl=getUrlParameter("actividadManualId");
	console.log(subUrl);
	if(subUrl!=null){
		var  listMdf;
		for(var index1=0;index1<listaModulosPermitidos.length;index1++){
			
				  listMdf =listaModulosPermitidos[index1].subActivities ;
					for (var index = 0; index < listMdf.length; index++) {
					if(subUrl==listMdf[index].id){
						$("#subDivResumenManual1").html(listMdf[index].titulo);
						$("#subDivResumen2").load(listMdf[index].direccionHtml);
						$("#graficoResumenModulo").css("z-index","201");
					}
						
					}
		}
	}
	
	
	 initMenu();
}

function initMenu() {
     $('#menu ul').hide(); 
     $('#menu ul').children('.current').parent().show();
     //$('#menu ul:first').show();
       
     $('#menu li a').on("click",
   	        function() {
   	          var checkElement = $(this).next();
   	          if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
   	        	  checkElement.slideUp('normal');
   	            return false;
   	            }
   	          if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
   	            $('#menu ul:visible').slideUp('normal');
   	            checkElement.slideDown('normal');
   	            return false;
   	            }
   	          }
   	        );
     $('#menu li a').on("mouseover",
    	        function() {
    	 var aux=$(this).parent().prop("id").split("listaModulo")
    	 verSubMenuActividades(aux[1])}
    	        );
     }
function verSubMenuActividades(idModulo) {
	var  listMdf;
	if(idModulo==4){
		return true
	}
	for(index=0;index<listaModulosPermitidos.length;index++){
		var subModulos=listaModulosPermitidos[index].subMenus;
		for(index2=0;index2<subModulos.length;index2++){
			if(subModulos[index2].menuOpcionId==idModulo){
				  listMdf =subModulos[index2].subActivities ;
		
			}
		}
		if(listaModulosPermitidos[index].menuOpcionId==idModulo){
			
			  listMdf =listaModulosPermitidos[index].subActivities ;
			
		}
	}
	$("#graficoResumenModulo").css("z-index","199");
				console.log($("#listaModulo"+idModulo).position().top)
					$(".activityModulo").remove();
						$("#listaModulo"+idModulo).append(
								"<div class='activityModulo' style='top:"+$("#listaModulo"+idModulo).position().top+"px;left:"+$("#listaModulo"+idModulo).width()+"px;" +
										"position:absolute;" +
										"width:750px;display:block'>" +
										"<ul class='nav-pills nav-stacked' id='subUnidades" +idModulo+"'"+
								"style='list-style-type:none;margin-left:-35px;'>");
						for (var index = 0; index < listMdf.length; index++) {
							$("#listaModulo"+idModulo+" ul").append(
									" <li id='subAct"+listMdf[index].id+"'><a href='#' " +
											"><span class='fa-stack fa-lg pull-left '>" +
											"<i  class='fa fa-industry fa-stack-1x' aria-hidden='true' ></i></span>"
											+ listMdf[index].titulo
											+ "</a></li>");
							var data=listMdf[index];
							$("#listaModulo"+idModulo+" ul li#subAct"+listMdf[index].id).on("click",data,function(event){
								$(this).parent().remove();
								$("#subDivResumenManual1").html(event.data.titulo);
								$("#subDivResumen2").load(event.data.direccionHtml,function(){
									console.log("se trajo: "+event.data.direccionHtml);
								});
								$("#graficoResumenModulo").css("z-index","201");
							});
						}
					$("#listaModulo"+idModulo).append("</ul>");
					
		
		
	
	
}