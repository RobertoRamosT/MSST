
var pathRedireccion;
var aceptarTerminos_condiciones;
var tipoUsuario;
var hasAceptarTerminosCondiciones,hasActualizarClave,diasRenovacionClave;
var mfaPendiente,mfaCorreo; // P115: la sesion espera el codigo de verificacion
var paramUrlLogin,mensajeUx;
var accesoColaborador,accesoContratista;

var listEmpresaPersonalizado=[
   {codigo:"GVODSHSQT9076",contenido:"<img src='../imagenes/conelsur.png' style='height:320px;padding-left:0px;" +
    (isMobile.any()?"width:350px;margin:-20px 0px -100px -20px":"width:600px;margin:0px 0px -100px 0px;")+"'>"}, 
   {codigo:"GWOGSBSCT3422",contenido:"<img src='../imagenes/virtualcare2.png' style='height:100px;padding-left:15px'>"},    
   {codigo:"GYOHSFGFD6473",contenido:"<img src='../imagenes/wiener.png' style='height:190px;width:400px;padding-left:35px;'>"},  
   {codigo:"GBOHSJSFT8634",contenido:"<img src='../imagenes/ach.png' style='height:200px;width:450px;padding-left:20px;'>"},  
   {codigo:"GQOESRSTT9125",contenido:"<img src='../imagenes/westernunion.png' style='height:160px;padding-left:15px;'>"},  
   {codigo:"GXGTVQHUJ7359",contenido:"<img src='../imagenes/smi.png' style='height:300px;padding-left:30px;"+
    (isMobile.any()?"width:350px;margin:-40px 0px -90px -20px;":"width:550px;margin:-20px 0px -50px 0px;")+"'>"},
   {codigo:"GYXGNQTII2951",contenido:"<img src='../imagenes/modasa.png' style='height:230px;padding-left:30px;"+ 
    (isMobile.any()?"width:350px;margin:-20px 0px -70px -20px;":"width:550px;margin:10px 0px -50px 0px;")+"'>"},
   {codigo:"GWJSNTGBB7223",contenido:"<img src='../imagenes/realplaza.png' style='height:200px;padding-left:0px;" +
    (isMobile.any()?"width:350px;margin:-20px 0px -100px -20px":"width:300px;margin:30px 0px 0px 0px;")+"'>"}
];

$(function(){
    if(window.location.href.includes("/realplaza")){
        $("#btnLoginDirectorioActivo").html("<i class='fa fa-building' style='margin-right:10px'></i> Acceso Real Plaza");
        $("#btnVerLoginContratista").html("<i class='fa fa-globe' style='margin-right:10px'></i> Acceso contratista");
        $("#btnVerLoginEstandar").html("<i class='fa fa-user' style='margin-right:10px'></i> Acceso externo");
        $("#btnLogin").html("<i class='fa fa-window-maximize' style='margin-right:10px'></i> Acceso cuenta GOSST");

        $("#tituloLogin").show();$("#logoVistaLoginRealPlaza").show();$(".campos-login_directorio_activo").show();
        $("#btnLoginDirectorioActivo").attr("onclick","verificarLoginDirectorioActivo()");
    }else if(window.location.href.includes("/centenario")){
        $("#btnLoginDirectorioActivo").html("<i class='fa fa-building' style='margin-right:10px'></i> Acceso Centenario");
        $("#btnVerLoginEstandar").html("<i class='fa fa-user' style='margin-right:10px'></i> Acceso externo");
        $("#btnLogin").html("<i class='fa fa-window-maximize' style='margin-right:10px'></i> Acceso cuenta GOSST");

        $("#tituloLogin").show();$("#logoVistaLoginCentenario").show();
        $("#btnLoginDirectorioActivo").show();$("#btnVerLoginEstandar").show();$("#btnVerLoginContratista").hide();
        $("#btnLoginDirectorioActivo").attr("onclick","verificarLoginDirectorioActivo()");
    }else{
        $("#btnLogin").html("<i class='fa fa-window-maximize' style='margin-right:10px'></i> Ingresar");
        $("#tituloLogin").show();$("#logoVistaLogin").show();$("#tituloPrevioUsuario").show();$(".campos-login").show();$("#enlaceAswan").show();
    }

   paramUrlLogin = window.location.href.split('?')[1]; 
   
   if(!are_cookies_enabled()){
      alert("Se ha detectado que las cookies están deshabilitadas en este navegador.");

      $("#msj").append("<b>Estimado usuario para su seguridad, nuestro aplicativo requiere que " +
      		       "habilite las cookies en su navegador.</b>");
   }

   if(parseInt(getSession("perfilGosstId")) > 0){
      removeAllSession();
   }else{
      if(getUrlParameter("verPendientes")){
	 removeAllSession();
	 $("#msj").append("<b>Ingrese al sistema para ver sus Pendientes</b>");
      }
   }
   
   var cookies = document.cookie.split(";");
   
   for(var i = 0;i < cookies.length;i++){
      var cookie = cookies[i].split("=");
      var name = cookie[0].trim();
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   }

   $('#inputUser').keyup(function(e){
      if(e.keyCode == 13){
	 $(this).trigger("enterKey");
      }
   });
   
   $('#inputUser').bind("enterKey",function(e){
      login(e);
   });

   $('#inputPassword').keyup(function(e){
      if(e.keyCode == 13){
	 $(this).trigger("enterKey");
      }
   });
   
   $('#inputPassword').bind("enterKey",function(e){
      login(e);
   });

   $('#inputUser').attr("autofocus",true);

   $("#btnLogin").on("click",function(event){
      login(event);
   });
    
   var nombreUsuario = (getUrlParameter("nombreUsuario")?getUrlParameter("nombreUsuario"):null),
       codigo = (getUrlParameter("codigo")?getUrlParameter("codigo"):null);
  
   if(nombreUsuario != null){
      $("#inputUser").val(nombreUsuario);
   }
   
   if(codigo != null){
      listEmpresaPersonalizado.forEach(function(val){
         if(codigo == val.codigo){
            $("#logoVistaPersonalizada").html(val.contenido);
         } 
      }); 
   }
   
   accesoColaborador = (window.location.pathname.split('/').pop() == "login_personalizado.html"?1:0);
   accesoContratista = (window.location.pathname.split('/').pop() == "login_personalizado_contratista.html"?1:0);
});

function login(event){
    event.preventDefault();
    var acceso = (accesoColaborador == 1?validarLogueoColaborador():(accesoContratista == 1?validarLogueoContratista():validarLogueo()));

    if(acceso){
        var dataParam={
            userName: $("#inputUser").val().trim(),password: $("#inputPassword").val().trim()
        };

        if(accesoColaborador == 1){
	    dataParam.passCorreo = $("#inputUserCorreo").val().trim();
        }else if(accesoContratista == 1){
	    dataParam.ruc = $("#inputRucEmpresa").val().trim();
        }

        callAjaxPost(URL+'/login/validated',dataParam,procesarRespuesta,null,{},function(){console.log("error")},function(){
            if(pathRedireccion){
                // P115: primero el codigo de verificacion; el servidor no deja pasar a nada mas hasta validarlo.
                if(mfaPendiente == 1){
                    solicitarCodigoVerificacion(mfaCorreo,continuarIngreso,true);
                }else{
                    continuarIngreso();
                }
            }
        });
    }else{
        mensajeUx="<label>Debe completar todos los campos activos.</label>";
        mensajesUx(mensajeUx,2,"","");
    }
}

// Lo que sigue al ingreso: terminos y condiciones, cambio de clave obligatorio o la pagina de inicio.
function continuarIngreso(){
	        if(tipoUsuario == 0){
	            if(accesoColaborador == 1){
	        	if(hasAceptarTerminosCondiciones == 0){
	        	    habilitarAceptarTerminosCondiciones();
	        	}else if(hasActualizarClave == 1){
	        	    mensajePrevioActualizarClave(0);
	        	}else{
	        	    document.location.href = (pathRedireccion);
	        	}
	            }else{
	        	if(aceptarTerminos_condiciones == 0){
	        	    habilitarTerminosCondiciones(aceptarTerminos_condiciones);

	        	    $('#btnDevolverValor'+parteFinalModal).attr("onclick","aceptaTerminosCondiciones()");
	        	    $('#cerrar').attr("onclick","cerrarTerminosCondiciones()");
	        	}else{
	        	    document.location.href = (pathRedireccion);
	        	}
	            }
	        }else if(tipoUsuario == 2){
	            if(accesoContratista == 1){
	        	if(hasAceptarTerminosCondiciones == 0){
	        	    habilitarAceptarTerminosCondiciones();
	        	}else if(hasActualizarClave == 1){
	        	    mensajePrevioActualizarClave(0);
	        	}else{
	        	    document.location.href = (pathRedireccion);
	        	}
	            }else{
	        	document.location.href = (pathRedireccion);
	            }
	        }else{
	            document.location.href = (pathRedireccion);
	        }
}

function cerrarTerminosCondiciones(){
   aceptarTerminos_condiciones = 0;

   var parametro={
      terminosCondiciones: aceptarTerminos_condiciones,
      userName: $("#inputUser").val(),
      password: $("#inputPassword").val()
   };

   callAjaxPost(URL+'/login/validated/cerrarTerminosCondiciones',parametro,function(){
      console.log("NO ACEPTO LOS TERMINOS Y CONDICIONES JEJE ");
   });
}

function aceptaTerminosCondiciones(){
   aceptarTerminos_condiciones = 1;

   var parametro={
      terminosCondiciones: aceptarTerminos_condiciones,
      userName: $("#inputUser").val(),
      password: $("#inputPassword").val()
   };

   callAjaxPost(URL+'/login/validated/terminosCondiciones',parametro,function(){
      console.log("ACEPTÓ LOS TERMINOS Y CONDICIONES");
   });

   document.location.href = (pathRedireccion);
}

function validarLogueo(){
   var user = $("#inputUser").val();
   var psw = $("#inputPassword").val();

   if(user.length == 0 || psw.length == 0){
      return false;
   }else{
      return true;
   }
}

function validarLogueoColaborador(){
   var user = $("#inputUser").val();
   var userCorreo = $("#inputUserCorreo").val();
   var psw = $("#inputPassword").val();

   if(user.length == 0 || psw.length == 0 || userCorreo.length == 0){
      return false;
   }else{
      return true;
   }
}

function validarLogueoContratista(){
    var user = $("#inputUser").val().trim();
    var rucEmpresa = $("#inputRucEmpresa").val().trim();
    var psw = $("#inputPassword").val().trim();

    if(user.length == 0 || rucEmpresa.length == 0 || psw.length == 0){
        return false;
    }else{
        return true;
    }
}

function procesarRespuesta(data){
   $("#msj").html("");

   if(data.CODE_RESPONSE == "02" && data.mensajeRespuesta.length == 0){
      $("#msj").append("<b>Usuario y/o contraseña incorrectos.</b>");
   }else if(data.CODE_RESPONSE == "03" && data.mensajeRespuesta.length == 0){
      $("#msj").append("<b>El usuario está bloqueado, inténtelo dentro de 2 minutos.</b>");
   }else if(data.CODE_RESPONSE == "11" && data.mensajeRespuesta.length == 0){
      $("#msj").append("<b>Usuario no existe</b>");
   }else if(data.CODE_RESPONSE == "13" && data.mensajeRespuesta.length == 0){
      $("#msj").append("<b>Contratista no activo en la empresa</b>");
   }else if(data.CODE_RESPONSE == "14" && data.mensajeRespuesta.length == 0){
      $("#msj").append("<b>Trabajador retirado de la empresa</b>");
   }else if(data.CODE_RESPONSE == "01" && data.mensajeRespuesta.length == 0){
      var clasifs = data.listaClasificaciones,pels = data.mapPeligros,riesgos = data.mapRiesgos;

      pathRedireccion = data.PATH;aceptarTerminos_condiciones = data.VALIDAR_TERMINOS_CONDICION;tipoUsuario = data.accesoUsuarios;
      hasActualizarClave = data.hasActualizarClave;hasAceptarTerminosCondiciones = data.hasAceptarTerminosCondiciones;
      diasRenovacionClave = data.diasRenovacionClave;
      mfaPendiente = data.mfaPendiente;mfaCorreo = data.mfaCorreo;
      
      createSession("moduloGosstId",data.moduloId);createSession("gestopcompanyid",data.empresaId);
      createSession("actPlanillaTrabAuto",data.actPlanillaTrabAuto);
      createSession("gestopcompanyname",data.empresaNombre);createSession("habilitarValidacion",data.habilitarValidacion);
      createSession("cambioUsuarioDirecto",data.cambioUsuarioDirecto);

      createSession("clasifs",JSON.stringify(clasifs));createSession("peligros",JSON.stringify(pels));
      createSession("riesgos",JSON.stringify(riesgos));/*createSession("gestopusername",data.usuarioNombre);*/

      createSession("numEmpresas",data.numEmpresas);createSession("numUnidades",data.numUnidades);
      createSession("trabajadorGosstId",data.trabajadorId);createSession("contratistaGosstId",data.contratistaId);
      createSession("tipoContratistaGosstId",data.tipoContratistaId);createSession("perfilContratistaGosstId",data.perfilContratistaId);
      createSession("unidadGosstId",data.trabajadorUnidadId);createSession("areaGosstId",data.trabajadorAreaId);
      createSession("puestoGosstId",data.trabajadorPuestoId);createSession("fechaActualizacionPuesto",data.trabajadorFechaPuesto);
      createSession("accesoGerencia", data.accesoGerencia);createSession("contratistaGosstRuc",data.contratistaRuc);

      createSession("fechaHoyTexto",data.fechaHoyTexto);createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);
      createSession("trabajadorSiteId",data.trabajadorSiteId);createSession("accesoUsuarios",data.accesoUsuarios);
      createSession("hasTutorialCap",data.hasTutorialCap);createSession("gestopInicio",0);
      createSession("modulo","Modulos");

      createSession("paramUrlLogin",(paramUrlLogin != undefined?paramUrlLogin:""));

      var numDiasRestantes = restaFechas(obtenerFechaActual(),data.fechaVencimientoLicencia);

      if(numDiasRestantes <= 0){
         $("#modalFechaLimite").modal('show');

         $("#modalFechaLimite .modal-body").html(
	    "Estimado usuario:" +
	    "<br>Su licencia expir&oacute; hace "+(numDiasRestantes * -1)+" día(s), comun&iacute;quese con " +
	    "ventas@aswan.pe para solicitar una nueva licencia" +
	    "<br>Atentamente," +
	    "<br><br> El Equipo Aswan.");

         pathRedireccion = false
         setTimeout(cerrarSesion,2500);
      }
   }else if(data.mensajeRespuesta.length > 0){
      mensajeUx = data.mensajeRespuesta;
      mensajesUx(mensajeUx,2,"","");
   }else{
      $("#msj").append("<b>Usuario incorrecto.</b>");
   }
}

function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');

   for(var i = 0;i < ca.length;i++){
      var c = ca[i];

      while(c.charAt(0) == ' ')
         c = c.substring(1);
	 if(c.indexOf(name) == 0)
	    return c.substring(name.length, c.length);
   }

   return "";
}

function crearOverlaySobreDiv(divObject){
   $("body").find(".overlayGosst").remove();
   $("body").append("<div class='overlayGosst'></div>");

   if(divObject != null){
      var cuerpoTexto = divObject.cuerpo;
      var tituloTexto = divObject.titulo;

      $("body").append("<div class='mensajeBienvenida'></div>");

      var tituloTutorial =
	 "<div class='tituloTutorial'>"+tituloTexto+"</div>";

      var cuerpoTutorial =
	 "<div class='cuerpoTutorial'>"+cuerpoTexto+"</div>";

      var imagenUrl = "<img src='../imagenes/logo3.png'>";

      $(".mensajeBienvenida").append(tituloTutorial).append(imagenUrl).append(cuerpoTutorial);
   }
}

function verLoginEstandar(){
    $("#tituloPrevioUsuario").show();$(".campos-login").show();$(".campos-login_directorio_activo").hide();
    $("#regresarOpcIniciales").show();$("#btnLogoutAzure").hide();
}

function verLoginDirectorioActivo(){
    $("#tituloPrevioUsuario").hide();$(".campos-login").hide();$(".campos-login_directorio_activo").show();
    $("#regresarOpcIniciales").hide();

    if(window.location.href.includes("/centenario")){
        $("#btnVerLoginContratista").hide();
    }

    if(btnLogoutActivo == 1){
        $("#btnLogoutAzure").show();
    }
}

function verificarLoginDirectorioActivo(){
    if(myMSALObj && myMSALObj.getAccount()){
        loginDirectorioActivoPrevio();
    }else{
        signIn("Redirect");
    }
}

function verContraseniaLogin(){
    var input = document.getElementById("inputPassword"),enlace = document.getElementById("enlaceVerContrasenia");

    if(input.type === "password"){
        input.type = "text";enlace.innerHTML = '<i class="fa fa-eye-slash"></i> Ocultar contraseña';
    }else{
        input.type = "password";enlace.innerHTML = '<i class="fa fa-eye"></i> Ver contraseña';
    }
}
