
function habilitarAceptarTerminosCondiciones(){
   $("#modalAceptarTerminosCondiciones").remove();
    
   var nombreAchivo = "Descargar Términos y Condiciones de protección de datos ASWAN",
       vinculoLink = "../documentos/T^0C Aswan-Colaboradores vAL 010223.pdf";
   
   if(parseInt(getSession("gestopcompanyid")) == 616){
      nombreAchivo = "Descargar Términos y Condiciones - Política de privacidad Estudiantes";  
      vinculoLink = "../documentos/T&C-Wiener_Estudiantes.docx";
   }
    
   var contenido = "";
	
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
       inputForm:"<label style='display:block;text-align:center;font-size:20px;'>"+
                    "TÉRMINOS Y CONDICIONES / POLÍTICA DE PRIVACIDAD" +
                 "</label>"},
      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
       inputForm:
          "<div style='overflow-y:scroll;max-height:250px;border:1px solid #ccc;padding:10px;'>" +
             "<p style='text-align:justify;font-weight:bold;'>" +
                "Los TÉRMINOS Y CONDICIONES (en adelante “T&C”) constituyen el contrato válido que regulará la relación " +
	        "entre ASWAN (según esta queda identificada en el GLOSARIO) y usted como USUARIO, sin perjuicio de otras " +
	        "condiciones e instrucciones que se comuniquen oportuna y previamente. Por ser un contrato, la aceptación de " +
	        "los T&C es requisito indispensable para el ACCESO, conforme este se define en el GLOSARIO. Su no aceptación " +
	        "implica que no deberá ni podrá acceder a él." + 
	        "<br><br>Los T&C sustituyen cualquier acuerdo o contrato celebrado anteriormente relacionado al ACCESO. En " +
	        "consecuencia, todo lo que ocurra o se realice a través de la PLATAFORMA, así como sus efectos jurídicos, " +
	        "quedarán regidos por estas reglas y sometido a la legislación en Perú." +                      
	        "<br><br>La POLÍTICA DE PRIVACIDAD forma parte de los T&C y regula la forma en que se tratarán los datos " +
	        "personales. Recomendamos enfáticamente leerla antes de aceptar los T&C, porque a través de su aceptación " +
	        "estará brindando consentimiento para el tratamiento de datos personales." +
	        "<br><br>El USUARIO declara haber leído, entendido y aceptado todas las condiciones establecidas en los T&C " +
	        "de forma previa al ACCESO, uso y registro de información." +
	        "<br><br>(Todo el contenido del documento está en el archivo adjunto)" +
	     "</p>" +
	  "</div>"},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"Para continuar es necesario aceptar los términos y condiciones." +
             "<br><a id='archivoDescarga' target='_blank' href='"+vinculoLink+"' " +
                    "style='text-decoration:none;'>" +
                    "<i class='fa fa-download' aria-hidden='true'></i> "+nombreAchivo +
                 "</a>",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",
       label:"<input id='checkAceptarTerCond' type='checkbox' class='form-control' onchange='estadoBtnContinuarAcepTerCond()'>",
       inputForm:"<label>*Acepto los términos y condiciones después de haber leído todo detenidamente.</label>"},    
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
       inputForm:"<button id='btnAceptarTerCond' class='btn btn-success' style='float:right;font-size:18px;' " +
  	  	      	 "onclick='guardarAceptarTerminosCondiciones()' disabled>" +
  	  	    "<i class='fa fa-check-circle'></i> Continuar" +
  	  	 "</button>"}
   ];
  	  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  	  				
   var modalOptions={
      id: "modalAceptarTerminosCondiciones",btnCerrarHabilitado:0,
      nombre: "<i class='fa fa-bell'></i> Notificación",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
  	  				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function estadoBtnContinuarAcepTerCond(){
   var aceptarTerminosCond = ($("#checkAceptarTerCond").prop("checked")?1:0);
   var btnAceptarTerminosCond = document.getElementById("btnAceptarTerCond");
   
   btnAceptarTerminosCond.disabled = (aceptarTerminosCond == 1?false:true); 
}

function guardarAceptarTerminosCondiciones(){
    var dataParam={
        tipoAccesoId:tipoUsuario
    };
   
    if(tipoUsuario == 0){
        dataParam.trabajadorId = parseInt(getSession("trabajadorGosstId"));
    }else if(tipoUsuario == 2){
	dataParam.contratistaId = parseInt(getSession("contratistaGosstId"));
    }

   callAjaxPostSimple(URL+'/login/aceptar_terminos_condiciones/save',dataParam,1,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            $("#modalAceptarTerminosCondiciones").modal("hide");
            $.unblockUI();

            if(getSession("isAzure") != null){
                $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
                document.location.href = (pathRedireccion);
            }else{
                mensajePrevioActualizarClave(1);
            }

            break;
							
	 default:
            alert("Ocurrió un error al guardar la aceptación de los términos y condiciones!");
      }    
   });
}
