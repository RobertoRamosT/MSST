
var textoConfiguracion="<li><a href='#' onclick='javascript:irConfiguracion();'>Configuraci&oacute;n</a></li>" +
	(parseInt(getSession("accesoUsuarios")) == 1?"<li><a href='#' onclick='javascript:irLicencia();'>Licencia</a></li>":"") +
	(parseInt(getSession("cambioUsuarioDirecto")) == 0?"":"<li onclick='verCambioUsuarioDirecto()'><a><i class='fa fa-exchange'></i> Cambiar de vista</a></li>");

   if(sessionStorage.getItem("trabajadorGosstId")>0){
      textoConfiguracion="";
   }

var textoMovil= "<div class='dropdown'> " +
		   "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false' id='companySelected'>Empresas <span class='caret'></span></a>"+
		   "<ul class='dropdown-menu' role='menu' id='menuEmpresa'>"+"</ul>"+
		"</div>"+
		"<div class='dropdown'>" +
		   "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false' id='loginUser'>Usuario<span class='caret'></span></a>"+
	           "<ul class='dropdown-menu'>"+
	               textoConfiguracion+
		      "<li><a href='#' onclick='javascript:cerrarSesion();'>Cerrar Sesi&oacute;n</a></li>"+
		   "</ul>" +
		"</div>";

   if($(window).width()>768){
      textoMovil="";
   }
 
var CABECERA="<div class='container-fluid'>"+
                "<div class='navbar-header'>"+" "+
                   "<a href='#' class='navbar-brand' onclick='verOpcionesGosst()' id='logoMenu' style='margin-top:-18px'>" +
                      "<img src='../imagenes/logoVerticalSel.png' style='width:100px;heigth:50px;'>" +
                   "</a>"+ 
                    textoMovil+
                   "<button id='menuMovilGosst' type='button' class='navbar-toggle collapsed' data-toggle='collapse'>"+ 
                      "<span class='icon-bar'></span>"+
                      "<span class='icon-bar'></span>"+
                      "<span class='icon-bar'></span>"+
                   "</button>"+
                "</div>"+
                "<div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>"+
                   "<ul class='nav navbar-nav' id='menuPrincipal'></ul>"+
                   "<ul class='nav navbar-nav navbar-right'>" +
                      "<span id='icoSolicitud' title='Solicitudes'>" +
                         "<a onclick='verSolicitudesGosst()' class='iconoLink'>" +
		            "<i class='fa fa-comments fa-2x' aria-hidden='true'>" +
		               "<span style='font-size:18px'></span>" +
		            "</i>" +
		         "</a>" +
		      "</span>"+
     	              "<span id='icoManual' title='Guía del Usuario'>" +
     	                 "<a href='manual/manual.html' class='iconoLink'>" +
	                    "<i class='fa fa-book fa-2x' aria-hidden='true'>" +
	                       "<span style='font-size:18px'></span>" +
	                    "</i>" +
	                 "</a>" +
	              "</span>"+
	              "<li class='dropdown'>" +
                         "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false' id='companySelected'>Empresas<span class='caret'></span></a>"+
                         "<ul class='dropdown-menu' role='menu' id='menuEmpresa'></ul>"+
                      "</li>"+
                      "<li class='dropdown'>"+
                         "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false' id='loginUser'>Usuario<span class='caret'></span></a>"+
        	         "<ul class='dropdown-menu'>"+
        	             textoConfiguracion+
        		    "<li><a href='#' onclick='javascript:cerrarSesion();'>Cerrar Sesi&oacute;n</a></li>"+
        	         "</ul>" +
                      "</li>" +
                   "</ul>"+
                "</div>"+
     	     "</div>"+
     	
             "<div class='modal fade' id='modalAyuda' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>"+
                "<div class='modal-dialog'>"+
                   "<div class='modal-content'>"+
                      "<div class='modal-header'>"+
                         "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                            "<span aria-hidden='true'>&times;</span>"+
                         "</button>"+
                         "<h4 class='modal-title' id='exampleModalLabel'>Ayuda Adicional</h4>"+
                      "</div>"+
                      "<div class='modal-body'>"+
                      "<div id='divAyuda'>"+		
                      "</div>"+
                   "</div>"
                   "<div class='modal-footer'>"+
                      "<button type='button' class='btn btn-primary' data-dismiss='modal' id='btnOkConf'>Ok</button>"+
                   "</div>"+
                "</div>"+
             "</div>"+
          "</div>";

var specialKeys = new Array();
specialKeys.push(8); //Backspace

var CELDA_ESTILO_PAR = "class='ipc-active ipcont'";
var CELDA_ESTILO_IMPAR = "class='ipcont'";
