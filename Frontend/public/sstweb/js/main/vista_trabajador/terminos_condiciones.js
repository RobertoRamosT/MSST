/**
 * http://usejsdoc.org/
 */
/**
 * http://usejsdoc.org/
 */
/* TERMINOS Y CONDICIONES */
// ///// Colaborador mediante azure y normal
function habilitarTerminosCondiciones(inputTerminosCondiciones){
   var nombreAchivo = "Descargar Términos y Condiciones de protección de datos ASWAN";
   
   if(parseInt(getSession("gestopcompanyid")) == 616){
      nombreAchivo = "Descargar Términos y Condiciones - Política de privacidad Estudiantes";  
   }
    
   if(inputTerminosCondiciones == 0){
      mensajeUx = 
         "<h3 style='text-align:center;'>TÉRMINOS Y CONDICIONES / POLÍTICA DE PRIVACIDAD</h3>" +
            "<div class='contenedor-general' style='margin:0 auto !important;'>" +
               "<div class='contenedor' style='font-weight:bold;width:80%;margin:0 auto !important;'>" +
//	          "<span><p style='text-align:center;'>Protección de Datos Personales ASWAN</p></span>" +
		  "<span><p style='text-align:justify;'>" +
//		     "De conformidad con la Ley N°29733, Ley de Protección de Datos Personales, el titular da su " +
//		     "consentimiento para el tratamiento de los datos personales que por cualquier medio desde el " +
//		     "momento de su ingreso o utilización del extranet del Comité de Operaciones Económicas del " +
//		     "Sistema Interconectado Nacional (ASWAN).<br> " +
//		     "ASWAN utilizará estos datos personales para realizar las gestiones que resulten necesarias en " +
//		     "el marco de proceso de seleccion en el cual esté participando. que incluye, entre otras " +
//		     "actividades como la evaluacion de aptitudes, pruebas psicológicas y/o por competencias " +
//		     "verificacion y cotejo de antecedentes y de los datos proporcionados, evaluaciones médicas, " +
//		     "pre-ocupacionales. <br> " +
//		     "Asimismo, ASWAN le informa que el tratamiento podrá ser realizado por ASWAN o a travez de un " +
//		     "agente designado por ASWAN, unicamente para las finalidades descritas precedentemente.<br>" +
//		     "Para llevar a Cabo el tratamiento de sus datos personales, la Organizacion tiene implementadas " +
//		     "implementadas medidas de seguridad organizativas, jurídicas y técnicas, que permiten la " +
//		     "disponibilidad, integridad, confidencialidad y uso autorizado de sus datos personales, mismas " +
//		     "que son igualmente exigibles a nuestros proveedores de servicios. <br>" +
//		     "Usted puede ejercer los derechos de acceso, rectificación, cancelación y oposición de los " +
//		     "datos personales escribiendo a datospersonales@ASWAN.org.pe, indicando su nombre completoo, " +
//		     "datos de contacto y especificando la revocación que solicita." +
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
		  "</p></span>" +
	       "</div>" +
	       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
	          "<span style='font-weight:bold;'>Para continuar es necesario aceptar los términos y condiciones.</span>" +
	       "</div>" +
	       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
 	          "<a id='archivoDescarga' target='_blank' onclick='descargaPDFTerminosCondicionesAdmCol()' " +
 	             "style='text-decoration:none;'>" +
 	             "<i class='fa fa-download' aria-hidden='true'></i> "+nombreAchivo +
 	          "</a>" +
	       "</div>" +
	       "<div class='contenedor1' style='font-weight:bold;width100%;margin: 0 auto !important;text-align:justify;'>" +
	          "<div class='centerCheck contenedor1'>" +
		     "<label class='label'>" +
		        "<input id='c1' class='label__checkbox' type='checkbox' onclick='habilitarBotonAceptarTerminos();'/>" +
		        "<span class='label__text'>" +
		           "<span class='label__check'>" +
		              "<i class='fa fa-check icon'></i>" +
		           "</span>" +
		        "</span>" +
		     "</label>" +
		  "<div>" +
		  "<span style='font-weight:bold;text-align:justify;'>" +
		     "* Acepto los términos y condiciones después de haber leído detenidamente." +
		  "</span>" +
	       "</div>" +
	    "</div>" + 
	 "</div>" + 
      "</div>";
	
      mensajesUxTerminosCondiciones(mensajeUx,4,"cambiarValor()","mensajeInicialForCov");
   }else{
	mensajeUx = "<h1>Ya aceptaste los terminos y condiciones, si no puedes ingresar comunicate al " +
		    "administrador del sistema</h1>";
   }
}

function habilitarBotonAceptarTerminos(){
   if($('#c1').is(':checked')){
      $('#btnDevolverValor'+parteFinalModal).attr("disabled",false);
   }else{
      $('#btnDevolverValor'+parteFinalModal).attr("disabled",true);
   }
}

function descargaPDFTerminosCondicionesAdmCol(){
   $(document).on('ready',function(){
      var check={
	 'text-decoration': 'none'
      }

      $('#archivoDescarga:link').css(check);
   });

   var vinculoLink = "../documentos/T^0C Aswan-Colaboradores vAL 010223.pdf";
   
   if(parseInt(getSession("gestopcompanyid")) == 616){
      vinculoLink = "../documentos/T&C-Wiener_Estudiantes.docx";
   }
   
   $("#archivoDescarga").attr("href",vinculoLink);
}

function obtenerSubPanelModuloGeneralMensajesUxTerminosCondiciones(val,count){
   var estiloDefault = "";
    
   if(val.inputForm == "" && val.sugerencia == "" && val.label == ""){
      estiloDefault = "border-top: 1px solid #a5aaae;";
   }

   if(count == 1){
      return "<div class='form-group column "+val.clase+"' style='"+estiloDefault+"'>" +
                "<div class='col-sm-14' id='"+val.divContainer+"'>" + 
		    val.inputForm+"<small>"+val.sugerencia+"</small>" +
		"</div>" + 
             "</div>";
   }else{
      return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>" +
	        "<label for='colFormLabel' class='col-sm-2 col-form-label'>" +
		    val.label +
		"</label>" + 
		"<div class='col-sm-8' id='"+val.divContainer+"'>" + 
		    val.inputForm+"<small>"+val.sugerencia+"</small>" + 
		"</div>" + 
             "</div>";
   }
}

// //////////autor: (AntoniTito2) Tema: validar Terminos y condiciones.// ///// Colaborador mediante azure y normal
// ////Comunicado administrador

function habilitarCominicadoEntrada(){
   if(true){
      mensajeUx = 
         "<span style='font-weight:bold;text-align:justify;'>" +
            "<p style='text-align:justify;'> " +
               "Estimado(a), Al ingresar a la plataforma estará aceptando el compromiso de proteger " +
               "los datos mostrados en : Documentos, Registros, Formularios, Usuarios, Configuraciones, etc." +
            "</p>" +
         "</span>" +
         "<br><br>" +
         "<span style='font-weight:bold;'>Atentamente la administración.</span>";

      mensajesUxNotificacionCompromiso(mensajeUx,4,"cambiarValor()","mensajeInicialForCov");
   }else{
      mensajeUx = 
         "<h1>Ya aceptaste los terminos y condiciones, si no puedes ingresar comunicate al " +
         "administrador del sistema</h1>";
   }
}

// //////////Fin2 de terminos y condiciones
//////FinComunicado administrador
// //////////autor: (AntoniTito2) Tema: validar Terminos y condiciones
// /// Contratista

var mensajeUx;

function habilitarTerminosCondicionesContratista(inputTerminosCondiciones) {
   if(true){
	     mensajeUx = 
	         "<h3 style='text-align:center;'>TÉRMINOS Y CONDICIONES / POLÍTICA DE PRIVACIDAD</h3>" +
	            "<div class='contenedor-general' style='margin:0 auto !important;'>" +
	               "<div class='contenedor' style='font-weight:bold;width:80%;margin:0 auto !important;'>" +
//		          "<span><p style='text-align:center;'>Protección de Datos Personales ASWAN</p></span>" +
			  "<span><p style='text-align:justify;'>" +
//			     "De conformidad con la Ley N°29733, Ley de Protección de Datos Personales, el titular da su " +
//			     "consentimiento para el tratamiento de los datos personales que por cualquier medio desde el " +
//			     "momento de su ingreso o utilización del extranet del Comité de Operaciones Económicas del " +
//			     "Sistema Interconectado Nacional (ASWAN).<br> " +
//			     "ASWAN utilizará estos datos personales para realizar las gestiones que resulten necesarias en " +
//			     "el marco de proceso de seleccion en el cual esté participando. que incluye, entre otras " +
//			     "actividades como la evaluacion de aptitudes, pruebas psicológicas y/o por competencias " +
//			     "verificacion y cotejo de antecedentes y de los datos proporcionados, evaluaciones médicas, " +
//			     "pre-ocupacionales. <br> " +
//			     "Asimismo, ASWAN le informa que el tratamiento podrá ser realizado por ASWAN o a travez de un " +
//			     "agente designado por ASWAN, unicamente para las finalidades descritas precedentemente.<br>" +
//			     "Para llevar a Cabo el tratamiento de sus datos personales, la Organizacion tiene implementadas " +
//			     "implementadas medidas de seguridad organizativas, jurídicas y técnicas, que permiten la " +
//			     "disponibilidad, integridad, confidencialidad y uso autorizado de sus datos personales, mismas " +
//			     "que son igualmente exigibles a nuestros proveedores de servicios. <br>" +
//			     "Usted puede ejercer los derechos de acceso, rectificación, cancelación y oposición de los " +
//			     "datos personales escribiendo a datospersonales@ASWAN.org.pe, indicando su nombre completoo, " +
//			     "datos de contacto y especificando la revocación que solicita." +
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
			  "</p></span>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
		          "<span style='font-weight:bold;'>Para continuar es necesario aceptar los términos y condiciones.</span>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
	 	          "<a id='archivoDescarga' target='_blank' onclick='descargaPDFTerminosCondiciones()' " +
	 	             "style='text-decoration:none;'>" +
	 	             "<i class='fa fa-download' aria-hidden='true'></i> Descargar Términos y Condiciones de protección de datos ASWAN" +
	 	          "</a>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width100%;margin: 0 auto !important;text-align:justify;'>" +
		          "<div class='centerCheck contenedor1'>" +
			     "<label class='label'>" +
			        "<input id='c1' class='label__checkbox' type='checkbox' onclick='habilitarBotonAceptarTerminos();'/>" +
			        "<span class='label__text'>" +
			           "<span class='label__check'>" +
			              "<i class='fa fa-check icon'></i>" +
			           "</span>" +
			        "</span>" +
			     "</label>" +
			  "<div>" +
			  "<span style='font-weight:bold;text-align:justify;'>" +
			     "* Acepto los términos y condiciones después de haber leído detenidamente." +
			  "</span>" +
		       "</div>" +
		    "</div>" + 
		 "</div>" + 
	      "</div>";
		
      mensajesUxTerminosCondiciones(mensajeUx,4,"cambiarValor()","mensajeInicialForCov");
   }else{
      mensajeUx = "<h1>Ya aceptaste los terminos y condiciones, si no puedes ingresar comunicate al administrador del sistema</h1>";
   }
}

function habilitarBotonAceptarTerminos() {

    if ($('#c1').is(':checked')) {

	$('#btnDevolverValor' + parteFinalModal).attr("disabled", false);
    } else {
	$('#btnDevolverValor' + parteFinalModal).attr("disabled", true);
    }

}

function descargaPDFTerminosCondiciones(){
   $(document).on('ready',function(){
      var check={
	 'text-decoration':'none',
      };

      $('#archivoDescarga:link').css(check);
   });

   var vinculoLink = "../documentos/T^0C Aswan-Colaboradores vAL 010223.pdf";
   
   $("#archivoDescarga").attr("href", vinculoLink);
}
// //////////Fin2 de terminos y condiciones

///// VISITANTE

function habilitarTerminosCondicionesVisitante(inputTerminosCondiciones) {
   if(true){
	     mensajeUx = 
	         "<h3 style='text-align:center;'>TÉRMINOS Y CONDICIONES / POLÍTICA DE PRIVACIDAD</h3>" +
	            "<div class='contenedor-general' style='margin:0 auto !important;'>" +
	               "<div class='contenedor' style='font-weight:bold;width:80%;margin:0 auto !important;'>" +
//		          "<span><p style='text-align:center;'>Protección de Datos Personales ASWAN</p></span>" +
			  "<span><p style='text-align:justify;'>" +
//			     "De conformidad con la Ley N°29733, Ley de Protección de Datos Personales, el titular da su " +
//			     "consentimiento para el tratamiento de los datos personales que por cualquier medio desde el " +
//			     "momento de su ingreso o utilización del extranet del Comité de Operaciones Económicas del " +
//			     "Sistema Interconectado Nacional (ASWAN).<br> " +
//			     "ASWAN utilizará estos datos personales para realizar las gestiones que resulten necesarias en " +
//			     "el marco de proceso de seleccion en el cual esté participando. que incluye, entre otras " +
//			     "actividades como la evaluacion de aptitudes, pruebas psicológicas y/o por competencias " +
//			     "verificacion y cotejo de antecedentes y de los datos proporcionados, evaluaciones médicas, " +
//			     "pre-ocupacionales. <br> " +
//			     "Asimismo, ASWAN le informa que el tratamiento podrá ser realizado por ASWAN o a travez de un " +
//			     "agente designado por ASWAN, unicamente para las finalidades descritas precedentemente.<br>" +
//			     "Para llevar a Cabo el tratamiento de sus datos personales, la Organizacion tiene implementadas " +
//			     "implementadas medidas de seguridad organizativas, jurídicas y técnicas, que permiten la " +
//			     "disponibilidad, integridad, confidencialidad y uso autorizado de sus datos personales, mismas " +
//			     "que son igualmente exigibles a nuestros proveedores de servicios. <br>" +
//			     "Usted puede ejercer los derechos de acceso, rectificación, cancelación y oposición de los " +
//			     "datos personales escribiendo a datospersonales@ASWAN.org.pe, indicando su nombre completoo, " +
//			     "datos de contacto y especificando la revocación que solicita." +
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
			  "</p></span>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
		          "<span style='font-weight:bold;'>Para continuar es necesario aceptar los términos y condiciones.</span>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width:80%;margin: 0 auto !important;text-align:justify;'>" +
	 	          "<a id='archivoDescarga' target='_blank' onclick='descargaPDFTerminosCondiciones()' " +
	 	             "style='text-decoration:none;'>" +
	 	             "<i class='fa fa-download' aria-hidden='true'></i> Descargar Términos y Condiciones de protección de datos ASWAN" +
	 	          "</a>" +
		       "</div>" +
		       "<div class='contenedor1' style='font-weight:bold;width100%;margin: 0 auto !important;text-align:justify;'>" +
		          "<div class='centerCheck contenedor1'>" +
			     "<label class='label'>" +
			        "<input id='c1' class='label__checkbox' type='checkbox' onclick='habilitarBotonAceptarTerminos();'/>" +
			        "<span class='label__text'>" +
			           "<span class='label__check'>" +
			              "<i class='fa fa-check icon'></i>" +
			           "</span>" +
			        "</span>" +
			     "</label>" +
			  "<div>" +
			  "<span style='font-weight:bold;text-align:justify;'>" +
			     "* Acepto los términos y condiciones después de haber leído detenidamente." +
			  "</span>" +
		       "</div>" +
		    "</div>" + 
		 "</div>" + 
	      "</div>";
		
      mensajesUxTerminosCondiciones(mensajeUx,4,"cambiarValor()","mensajeInicialForCov");
   }else{
      mensajeUx = "<h1>Ya aceptaste los terminos y condiciones, si no puedes ingresar comunicate al administrador del sistema</h1>";
   }
}

// //////////Fin2 de terminos y condiciones VISITANTE


