
$(document).ready(function(){
   $("#btnRecuperar").on("click",function(){
      enviarCorreoRecuperacion(); 
   });
   
   $('form').unbind('submit');
 
   $('form input').on('keypress',function(e){
      return e.which !== 13;
   });
   
   $('#inputEmail').keyup(function(e){
      if(e.keyCode == 13){
         $(this).trigger("enterKey");
      }
   });
	
   $('#inputEmail').bind("enterKey",function(e){
      enviarCorreoRecuperacion();
   });
});
 
function enviarCorreoRecuperacion(){	
   var userObj={
      correo: $("#inputEmail").val()
   }
	 
   // P128 bloque C: el servidor responde siempre el mismo mensaje, exista o no el correo (no revela cuentas).
   callAjaxPost(URL+'/public/recuperar/',userObj,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            alert(data.mensaje || "Si el correo está registrado, recibirá un enlace para recuperar su cuenta.");
            $("#inputEmail").val("");
            break;
         default:
            alert("No se pudo procesar el pedido. Intente nuevamente en unos minutos.");
      }
   });	 
}
