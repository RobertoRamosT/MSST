
var mensajeUx;

function mensajePrevioActualizarClave(opcionMensaje){
   var opcionMensajeAcceso = parseInt(opcionMensaje); 
    
   mensajeUx = (opcionMensajeAcceso == 1?"<label>Términos y condiciones aceptados.</label>" +
      "<br>":"")+"<label>Debe actualizar su contraseña antes de poder acceder a la plataforma.</label>";
   mensajesUx(mensajeUx,4,"","ActualizarClave");
   
   $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
      habilitarActualizarClave();  
   });  
}  

function habilitarActualizarClave(){
   $("#modalActualizarClave").remove();   

   var contenido = "";
	
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Anterior contraseña",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
       inputForm:"<input id='inputAnteriorClaveAcceso' type='password' class='form-control' autofocus>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Nueva contraseña",inputForm:""}, 
      {sugerencia:"<label>*Debe incluir una letra minúscula, una letra mayúscula, un número " +
          "y un caracter especial (mínimo 8 caracteres).</label>",
       anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
       inputForm:"<input id='inputNuevaClaveAcceso' type='password' class='form-control'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Confirmación nueva contraseña",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
       inputForm:"<input id='inputConfirmarNuevaClaveAcceso' type='password' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
       inputForm:"<button type='button' class='btn btn-success' onclick='guardarActualizarClave()' " +
       		         "style='float:right;font-size:18px;'>" +
  	  	    "<i class='fa fa-floppy-o'></i> Guardar" +
  	  	 "</button>"}
   ];
  	  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  	  				
   var modalOptions={
      id: "modalActualizarClave",btnCerrarHabilitado:0,
      nombre: "<i class='fa fa-refresh'></i> Actualizar contraseña",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
   	  				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function guardarActualizarClave(){
   var campoVacio = true;
    
   var psw1 = $("#inputAnteriorClaveAcceso").val().trim();
   var psw2 = $("#inputNuevaClaveAcceso").val().trim();
   var psw3 = $("#inputConfirmarNuevaClaveAcceso").val().trim();
   var pswActual = $("#inputPassword").val().trim();
 
   var valMinVerifNewPass = /[a-z]/.test(psw2);
   var valMayVerifNewPass = /[A-Z]/.test(psw2);
   var valNumVerifNewPass = /[0-9]/.test(psw2);
   var valCaracterEspecialVerifNewPass = /[^A-Za-z0-9\s]/.test(psw2);
   	
   if(psw1.length == 0 || psw2.length == 0 || psw3.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
   }else if(psw1 !== pswActual){
      campoVacio = false;
      mensajeUx = "<label>La anterior contraseña no es correcta.</label>";
   }else if(psw2.length < 8){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
   }else if(!valMinVerifNewPass || !valMayVerifNewPass || !valNumVerifNewPass || !valCaracterEspecialVerifNewPass){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, una letra minúscula, una letra mayúscula, " +
         "un número y un caracter especial entre sus caracteres.</label>"; 
   }else if(psw2 !== psw3){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña y la confirmación, de la nueva contraseña, no coinciden.</label>"; 
   }else if(psw1 === psw2){
      campoVacio = false;
      mensajeUx = "<label>No puede utilizar la anterior contraseña como nueva contraseña.</label>";  
   }  
    	
   if(campoVacio){
      var dataParam={
	 tipoAccesoId:tipoUsuario,password:psw2
      };
	    
      if(tipoUsuario == 0){
	  dataParam.trabajadorId = parseInt(getSession("trabajadorGosstId"));	
      }else if(tipoUsuario == 2){
	  dataParam.contratistaId = parseInt(getSession("contratistaGosstId"));
      }

      callAjaxPostSimple(URL+'/login/actualizar_clave/save',dataParam,1,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
               $.unblockUI();$("#modalActualizarClave").modal("hide"); 
	       
	       mensajeUx = "<label>Contraseña actualizada.</label>" +
	          "<br><label>Recuerde que la misma es válida durante "+diasRenovacionClave+" días</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarClave");
		    
	       $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
		   // P115: el codigo de verificacion se valida antes del cambio de clave.
		   document.location.href = (pathRedireccion);
	       });  
	 		       
	       break;
	 							
	    default:
	       alert("Ocurrió un error al actualizar la contraseña!");
         }    	
      });
   }else{
      $("#modalActualizarClave").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ActualizarClave");
      
      $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
	 $("#modalActualizarClave").modal("show");
      });  
   }    
}

var opcionCampoId;

function ocultarSolicitudCambiarClave(){
   $("#modalSolicitudCambiarClave").modal("hide");
}

function habilitarSolicitudCambiarClave(pOpcionCampoid){
    $("#modalSolicitudCambiarClave").remove();
   
    opcionCampoId = parseInt(pOpcionCampoid);

   var contenido = "";
	
   var listContenido=[];
   
   if(opcionCampoId == 0){
       listContenido.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Correo*",inputForm:""},
           {sugerencia:"<label>*Se le enviará los pasos a seguir para cambiar la contraseña actual.</label>",anchoLabel:"col-sm-0",
            anchoDiv:"col-sm-12",label:"",inputForm:"<input id='inputCorreoSolicitudCamCla' class='form-control' autofocus>"});
   }else if(opcionCampoId == 2){
       listContenido.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"RUC*",inputForm:""},
           {sugerencia:"<label>*Se le enviará los pasos a seguir, al correo de la persona de contacto/contacto " +
           	       "extra, para cambiar la contraseña actual.</label>",anchoLabel:"col-sm-0",
	    anchoDiv:"col-sm-12",label:"",inputForm:"<input id='inputRucSolicitudCamCla' class='form-control' autofocus>"});
   }
   
   listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarSolicitudCambiarClave()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button type='button' class='btn btn-success' onclick='solicitarCambiarClave()' style='float:right;font-size:18px;'>" +
  	  	    "<i class='fa fa-paper-plane'></i> Enviar" +
  	  	 "</button>"});
  	  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  	  				
   var modalOptions={
      id:"modalSolicitudCambiarClave",nombre:"<i class='fa fa-book'></i> Solicitar cambio contraseña",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
   	  				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function solicitarCambiarClave(){
   var campoVacio = true;
   var correo,ruc;
    
    if(opcionCampoId == 0){
        correo = $("#inputCorreoSolicitudCamCla").val().trim();
    	
        if(correo.length == 0){
            campoVacio = false;mensajeUx = "<label>Debe completar el campo activo.</label>";
        }else if(!correo.includes("@")){
            campoVacio = false;
            mensajeUx = "<label>Debe ingresar un correo.</label>";
        }
    }else if(opcionCampoId == 2){
	ruc = $("#inputRucSolicitudCamCla").val().trim();
   	
        if(ruc.length == 0){
            campoVacio = false;mensajeUx = "<label>Debe completar el campo activo.</label>";
        }
    }
     	
   if(campoVacio){
      var dataParam={
	 userName:$("#inputUser").val().trim()
      };
      
      if(opcionCampoId == 0){
	  dataParam.passCorreo = correo;
      }else if(opcionCampoId == 2){
	  dataParam.ruc = ruc;
      }
 	    
      callAjaxPostSimple(URL+'/public/solicitud_cambiar_clave',dataParam,1,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
               $.unblockUI();$("#modalSolicitudCambiarClave").modal("hide"); 
 	       
 	       var iconoMensajeFinal = (data.mensaje.includes("éxito")?1:2);
	       
	       mensajeUx = data.mensaje;
	       mensajesUx(mensajeUx,iconoMensajeFinal,"","");
 	 		       
 	       break;
 	 							
 	    default:
 	       alert("Ocurrió un error al actualizar la contraseña!");
         }    	
      });
   }else{
      $("#modalSolicitudCambiarClave").modal("hide"); 
      mensajesUx(mensajeUx,2,"","SolicitudCambiarClave");
       
      $("#modalMensajeUxSolicitudCambiarClave").on("hidden.bs.modal",function(){
         $("#modalSolicitudCambiarClave").modal("show");
      });  
   }        
}
