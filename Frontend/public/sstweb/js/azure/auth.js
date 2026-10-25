// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;

let signInType;

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js

// Register Callbacks for Redirect flow

// P128 bloque A (SEC-049): si la constancia guardada venció, el login va a Microsoft y, al volver, sigue el ingreso
// con la constancia nueva sin pedir otro clic. Esta marca dice que el viaje a Microsoft fue para eso.
var CLAVE_CONTINUAR_INGRESO_MICROSOFT = "gosstContinuarIngresoMicrosoft";

function authRedirectCallBack(error, response) {
  if (error) {
    console.log(error);
    sessionStorage.removeItem(CLAVE_CONTINUAR_INGRESO_MICROSOFT);
  } else {
    if (response.tokenType === "id_token" && myMSALObj.getAccount() && !myMSALObj.isCallback(window.location.hash)) {
      console.log('id_token acquired at: ' + new Date().toString());
      if (sessionStorage.getItem(CLAVE_CONTINUAR_INGRESO_MICROSOFT) === "1") {
        sessionStorage.removeItem(CLAVE_CONTINUAR_INGRESO_MICROSOFT);
        if (response.idToken && response.idToken.rawIdToken) {
          enviarLoginDirectorioActivo(myMSALObj.getAccount(), response.idToken.rawIdToken);
          return;
        }
      }
      showWelcomeMessage(myMSALObj.getAccount());
      getTokenRedirect(loginRequest);
    } else if (response.tokenType === "access_token") {
      console.log('access_token acquired at: ' + new Date().toString());
    } else {
      console.log("token type is:" + response.tokenType);
    }
  }
}

// Redirect: once login is successful and redirects with tokens, call Graph API
var myMSALObj,btnLogoutActivo;

$(function(){
    myMSALObj = new Msal.UserAgentApplication(msalConfig); 
    myMSALObj.handleRedirectCallback(authRedirectCallBack);

    btnLogoutActivo = 0;
    
    if(document.location.href.includes(URLCorto+"/pages/login.html")){
	    if(myMSALObj.getAccount() && !myMSALObj.isCallback(window.location.hash)){
            $("#btnLoginDirectorioActivo").html("<i class='fa fa-window-maximize' style='margin-right:10px'></i> Acceso '"+myMSALObj.getAccount().userName+"'");
	        $("#btnLoginDirectorioActivo").attr("onclick","loginDirectorioActivoPrevio()");$("#btnLogoutAzure").show().attr("onclick","signOutAzure()");btnLogoutActivo = 1;
	    }
    }else{
	    if(parseInt(getSession("isAzureClosed")) == 1){
	        alert("Usuario no reconocido");removeAllSession();
            document.location.href = ("login.html");
	    }
    }
});

function loginDirectorioActivoPrevio(){
    loginDirectorioActivo(myMSALObj.getAccount());
}

// P128 bloque A (SEC-049): el servidor exige la constancia (id_token) que Microsoft entrega al ingresar. Con la librería
// 1.x, pedir un token con el identificador de la aplicación como único alcance devuelve un id_token vigente.
function loginDirectorioActivo(cuenta){
    myMSALObj.acquireTokenSilent({scopes:[msalConfig.auth.clientId]}).then(function(respuesta){
        var idToken = (respuesta && respuesta.idToken ? respuesta.idToken.rawIdToken : null);

        // P128 (15-oct): si la librería responde sin constancia (por ejemplo, con la página abierta varias horas), no se
        // envía un ingreso vacío, que el servidor rechazaría en modo bloqueo: se pasa por Microsoft como cuando falla.
        if(!idToken){
            pedirIngresoMicrosoft();
            return;
        }
        enviarLoginDirectorioActivo(cuenta,idToken);
    }).catch(function(error){
        // La constancia guardada venció y el navegador no deja renovarla en silencio (AADSTS50058, cookies de terceros):
        // se vuelve a pedir el ingreso a Microsoft y, al volver, authRedirectCallBack sigue el ingreso solo.
        console.log(error);
        pedirIngresoMicrosoft();
    });
}

function pedirIngresoMicrosoft(){
    sessionStorage.setItem(CLAVE_CONTINUAR_INGRESO_MICROSOFT,"1");
    signIn("Redirect");
}

function enviarLoginDirectorioActivo(cuenta,idToken){
    var dataParam={
        userName:cuenta.userName,isAzure:1,idToken:idToken
    };
	
    callAjaxPost(URL+'/login/validated',dataParam,function(data){
        $("#msj").html("");

        if(data.mensajeRespuesta.length > 0){
            mensajeUx = data.mensajeRespuesta;
            mensajesUx(mensajeUx,2,"","");
        }else if(data.CODE_RESPONSE == "15"){
	        $("#btnLoginDirectorioActivo").html("Cambiar cuenta");
	        $("#btnLoginDirectorioActivo").attr("onclick","signOutAzure()");
	        $("#msj").html("No se ha podido encontrar el correo: "+cuenta.userName);

            return;
        }else if(data.CODE_RESPONSE == "01"){
            pathRedireccion = data.PATH;hasAceptarTerminosCondiciones = data.hasAceptarTerminosCondiciones;tipoUsuario = data.accesoUsuarios;

            createSession("modulo","Modulos");createSession("isAzure","1");createSession("isAzureClosed","0");
            createSession("fechaHoyTexto",data.fechaHoyTexto);createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);

            var clasifs = data.listaClasificaciones,pels = data.mapPeligros,riesgos = data.mapRiesgos;

            createSession("moduloGosstId",data.moduloId);createSession("gestopcompanyid",data.empresaId);createSession("gestopcompanyname",data.empresaNombre);
            createSession("clasifs",JSON.stringify(clasifs));createSession("peligros",JSON.stringify(pels));createSession("riesgos",JSON.stringify(riesgos));
            createSession("gestopusername",data.usuarioNombre);createSession("numEmpresas",data.numEmpresas);createSession("numUnidades",data.numUnidades);
            createSession("trabajadorGosstId",data.trabajadorId);createSession("unidadGosstId",data.trabajadorUnidadId);createSession("areaGosstId",data.trabajadorAreaId);
            createSession("areaGosstNombre",data.trabajadorAreaNombre);createSession("puestoGosstId",data.trabajadorPuestoId);createSession("fechaActualizacionPuesto",data.trabajadorFechaPuesto);
            createSession("accesoGerencia",data.accesoGerencia);createSession("accesoUsuarios",data.accesoUsuarios);createSession("gestopInicio",0);
            createSession("habilitarValidacion",data.habilitarValidacion);
            createSession("cambioUsuarioDirecto",data.cambioUsuarioDirecto);

            // if(data.accesoUsuarios == 1){
            //     document.location.href = "inspeccion.html";
	        // }else{
	        //     document.location.href = (data.PATH);
	        // }
        }else{
            $("#msj").append("<b>Usuario incorrecto.</b>");
        }
    },null,{},function(){console.log("eror")},function(){
        if(pathRedireccion){
            if(hasAceptarTerminosCondiciones == 0){
                habilitarAceptarTerminosCondiciones();
            }else{
                document.location.href = (pathRedireccion);
            }
        }
    });
}

function signIn(method) {
  
  signInType = isIE ? "Redirect" : method;

  if (signInType === "Popup") {
    myMSALObj.loginPopup(loginRequest)
      .then(loginResponse => {  
        console.log('id_token acquired at: ' + new Date().toString());
        if (myMSALObj.getAccount()) {
          showWelcomeMessage(myMSALObj.getAccount());
        }
    }).catch(function (error) {
      console.log(error);
    });

  } else if (signInType === "Redirect") {
    myMSALObj.loginRedirect(loginRequest)
  }
}

function signOutAzure() {
  myMSALObj.logout();
}

function getTokenPopup(request) {
  return myMSALObj.acquireTokenSilent(request)
      .catch(error => {
        console.log("silent token acquisition fails. acquiring token using popup");
          // fallback to interaction when silent call fails
          return myMSALObj.acquireTokenPopup(request)
              .then(tokenResponse => {
              }).catch(error => {
                  console.log(error);
              });
      });
}

// This function can be removed if you do not need to support IE
function getTokenRedirect(request) {
  return myMSALObj.acquireTokenSilent(request)
      .then((response) => {
      }).catch(error => {
          console.log("silent token acquisition fails. acquiring token using redirect");
          // fallback to interaction when silent call fails
          return myMSALObj.acquireTokenRedirect(request)
      });
}
