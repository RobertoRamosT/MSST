var banderaEdicion;
var mensajeUx="";

$(document).ready(function(){
   insertMenu();
   verConfiguracionEmpresa();
});

function verConfiguracionEmpresa(){
   var dataParam={
      idCompany: getSession("gestopcompanyid")
   };

   callAjaxPost(URL+'/empresa/id',dataParam,function(data){
      $("#inputColor").val(data.empresa.color);
   });
}

function cambiarConfiguracion(){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      color: $("#inputColor").val()
   };

   callAjaxPost(URL+'/empresa/configuracion/save',dataParam,function(data){
      alert("Configuración guardada");
      cambiarConfiguracionEmpresa();
   });
}

function cambiarPassword(){
   var campoVacio = true;
	    
   var psw1 = $("#inputPassword1").val();
   var psw2 = $("#inputPassword2").val();
   var psw3 = $("#inputPassword3").val();
	   
   var valMinVerifNewPass = /[a-z]/.test(psw2);
   var valMayVerifNewPass = /[A-Z]/.test(psw2);
   var valNumVerifNewPass = /[0-9]/.test(psw2);
   var validacionNewNewPass = (psw3 == psw2?1:0);
		    	
   if(psw1.length == 0 || psw2.length == 0 || psw3.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
   }else if(psw2.length < 8){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
   }else if(!valMinVerifNewPass || !valMayVerifNewPass || !valNumVerifNewPass){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, una letra " +
         "minúscula, una letra mayúscula y un número entre sus caracteres.</label>"; 
   }else if(validacionNewNewPass == 0){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña y la confirmación, de la nueva contraseña, " +
         "no coinciden.</label>"; 
   }
		    	
   if(campoVacio){
      var dataParam={
	 userId: sessionStorage.getItem("gestopUi"),
	 userName: sessionStorage.getItem("gestopusername"),
	 sessionId: sessionStorage.getItem("gestopsessionId"),
	 psw1: psw1,psw2: psw2,psw3: psw3
      };
	      
      callAjaxPost(URL+'/login/password/save',dataParam,function(data){
         $("#inputPassword1").val("");$("#inputPassword2").val("");$("#inputPassword3").val("");
		 
         var iconoMensajeFinal = 2;
		 	
         switch(data.CODE_RESPONSE){
	    case "02":
	       mensajeUx = "<label>La contraseña actual es incorrecta.</label>";
		    
	       break;
		    				
	    case "03":
	       mensajeUx = "<label>La contraseña se ha bloqueado por demasiados intentos fallidos.</label>";
		    	 
	       break;
		    				
	    case "05":
	       mensajeUx = "<label>La contraseña se guardo correctamente.</label>";
	       iconoMensajeFinal = 1;  
		       
	       break;
		    				
	    case "17":
	       mensajeUx = "<label>La confirmacion de la nueva contraseña es incorrecta.</label>";
		       
	       break;
		    				
	    case "11":
	       mensajeUx = "<label>La anterior contraseña no es correcta. Ingrese nuevamente.</label>";
		       
	       break;
		    					
	    default:
	       mensajeUx = "<label>Ocurrió un error al guardar la contraseña.</label>";
         }
		 
         mensajesUx(mensajeUx,iconoMensajeFinal,"");
      });	
   }else{
      mensajesUx(mensajeUx,2,"");
   }    
}
