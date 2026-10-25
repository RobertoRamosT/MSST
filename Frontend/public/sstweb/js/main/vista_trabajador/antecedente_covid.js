var objAntecedenteCovid={};
var listAntecedenteCovid=[];
var listRespuestaSimple=[];
var listTrimestreEmbarazo=[];
var listNumeroConviviente=[];
var listEnfermedad=[];
var hasAntecedenteModificado;
var accesoDirectoAntCov;
var fechaNacimiento;
var edad;
var whoModificaAntCov;
var mensajeUx;
var mensajeInicial,declaracionJurada;

function habilitarAntecedenteCovid(){
   accesoDirectoAntCov = 1;
    
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      trabajadorId: getSession("trabajadorGosstId")
   };
    
   var listPanelesPrincipal=[];
   
   if(parseInt(getSession("gestopcompanyid")) == 616){
      mensajeInicial = 
         "<label>Estimado(a) estudiante "+getSession("gestopusername")+", debe completar el siguiente " +
         "formulario sobre antecedentes médicos y datos del entorno para continuar.</label>";
       
      declaracionJurada = 
         "Todos los datos expresados en este formulario constituye una DECLARACIÓN JURADA de mi parte. <br>" +
	 "He sido informado que, de omitir o falsificar información, puedo perjudicar mi salud y la de mis " +
	 "compañeros, lo cual puede constituir una falta grave a la salud pública, por lo cual asumo las consecuencias.";
   }else{
      mensajeInicial = 
         "<label>Estimado(a) "+getSession("gestopusername")+", debe completar el siguiente " +
         "formulario sobre antecedentes médicos y datos del entorno para continuar.</label>";
       
      declaracionJurada = 
         "Todos los datos expresados en esta ficha constituye una declaración jurada de mi parte. <br>" +
         "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
         "y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias."; 
   }
 	
   callAjaxPost(URL+'/covid/antecedente_covid',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn = "";
 	    var fechaUltimaActualizacion = "";
 			
 	    listAntecedenteCovid = data.listAntecedenteCovid;
 	    $(".divListPrincipal").html(""); 
 	    listEnfermedad = data.listEnfermedad;
 	    listRespuestaSimple = data.listRespuestaSimple;
 	    listTrimestreEmbarazo = data.listTrimestreEmbarazo;
 	    listNumeroConviviente = data.listNumeroConviviente;
 	    hasAntecedenteModificado = data.trabajadorCovid.hasAntecedenteModificado;
 	    fechaNacimiento = data.trabajadorCovid.fechaNacimientoTexto;
 	    edad = data.trabajadorCovid.edad;
 	     
 	    var textTotal="";
 	     
 	    if(listAntecedenteCovid == ''){
 	       mensajesUx(mensajeInicial,4,"","AvisoNuevoRegistro");
  		    
 	       $('#modalMensajeUxAvisoNuevoRegistro').on("hidden.bs.modal", function(e) {
  	          objAntecedenteCovid={
  	             id:0,respuestaUno:{id:""},respuestaDos:{id:""},
  	             respuestaCuatro:{id:""},listEnfermedadesId:""
  			              };
  	          
 		  rellenarAntecedenteCovid(1);
 		  fechaUltimaActualizacion = "<strong style='color:red'>Sin registro</strong>"; 
 	       });
 	    }else{
 	       listAntecedenteCovid.forEach(function(val,index){
 	          fechaUltimaActualizacion = "<strong style='color:blue'>"+val.fechaActualizacionTexto+"</strong>";
 		 	
 		  var listTotal=[
 		     {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",
 		      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 		            "*** DATOS PERSONALES ***</span>"},
 		     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	             {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	              label:"<i class='fa fa-check-square-o'></i> ¿Usted sufre de alguna enfermedad crónica?",
 		      inputForm:"<div style='text-align:right;'>"+val.respuestaUno.nombre+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 		      label:"<i class='fa fa-list-ol'></i> *Enfermedad(es): ",
 		      inputForm:"<div style='text-align:right;'>"+val.listEnfermedadesNombre+"</div>"},
 	          ];
 		  
 		  if(parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649){
 		     listTotal.push({sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	        label:"<i class='fa fa-check-square-o'></i> Fecha de nacimiento",
 	 	        inputForm:"<div style='text-align:right;'>"+fechaNacimiento+" ("+edad+" años)"+"</div>"});
 	          }
 			
 		  listTotal.push( 
 	             {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 		      label:"<i class='fa fa-check-square-o'></i> ¿Está embarazada?",
 		      inputForm:"<div style='text-align:right;'>"+val.trimestreEmbarazo.nombre+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      label:"<i class='fa fa-check-square-o'></i> Altura",
 	 	      inputForm:"<div style='text-align:right;'>"+val.altura+" cm"+"</div>"},
 	             {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      label:"<i class='fa fa-check-square-o'></i> Peso",
 	 	      inputForm:"<div style='text-align:right;'>"+val.peso+" kg"+"</div>"},
 	 	     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      label:"<i class='fa fa-check-square-o'></i> Imc (Índice de masa corporal)",
 	 	      inputForm:"<div style='text-align:right;'>"+val.imc+"</div>"},
 	 	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 		     {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",
 	 	      label:"<span style='color:blue;font-size:10px;font-size:18px;font-weight:bolder;'>" +
 	 		    "*** DATOS DEL ENTORNO ***</span>"},
 	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	             {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      label:"<i class='fa fa-check-square-o'></i> Direccion",
 	 	      inputForm:"<div style='text-align:right;'>"+val.direccion+"</div>"},
 	 	     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      clase:"campoConvivePersonaEnfCro-AntecedenteCovid",
 	 	      label:"<i class='fa fa-check-square-o'></i> ¿Convive con algún adulto mayor, niño, " +
 	 	            "gestante o familiar con enfermedad crónica?",
 	 	      inputForm:"<div style='text-align:right;'>"+val.respuestaDos.nombre+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 	 	      clase:"campoNumPersonasDom-AntecedenteCovid",
 		      label:"<i class='fa fa-check-square-o'></i> ¿Cuántas personas comparten el mismo " +
 			    "domicilio que usted?",
 		      inputForm:"<div style='text-align:right;'>"+val.numeroConviviente.cantidad+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 		      label:"<i class='fa fa-check-square-o'></i> Teléfono personal: ",
 		      inputForm:"<div style='text-align:right;'>"+val.telefonoContacto+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 		      label:"<i class='fa fa-check-square-o'></i> " +
 			    "Nombre de la persona de contacto en caso de emergencia: ",
 		      inputForm:"<div style='text-align:right;'>"+val.personaContacto+"</div>"},
 		     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
 		      label:"<i class='fa fa-check-square-o'></i> Teléfono de la persona de contacto: ",
 		      inputForm:"<div style='text-align:right;'>"+val.telefonoPersonaContacto+"</div>"});
 				
 		  textTotal+= "<div class='eventoGeneral'>" +
 		                 "<form class='eventoGeneral'>";	 
 		     listTotal.forEach(function(val,index){
 	   	        textTotal += ""+obtenerSubPanelModuloVersionDos(val);
 	   	     });
 		  textTotal+=    "</form>" +
 		              "</div>";
 		      
 		  textTotal+="<div class='divMovilAntecedenteCovid' id='divAntecedenteCovid"+val.id+"'></div>";
 		   	
 		  objAntecedenteCovid = listAntecedenteCovid[index];
 	       });
 	    }
    	     
 	    var textNuevo ="";
    	     
    	    textNuevo ="<div id='estadoMovilFechaActualizacionAntMed'>" +
    	                  "<div class='tituloSubList'>Última fecha de actualización: " +fechaUltimaActualizacion+
    	                     "<button style='font-size:15px' title='Editar antecedentes del trabajador' " +
    	                             "class='btn btn-success' onclick="+(hasAntecedenteModificado == 0?
    	                        	                                 "'rellenarAntecedenteCovid(1)'":
    	                        	                                 "mensajeBloqueoAntecedente()")+">" +
    	                        "<i class='fa fa-pencil'></i> Modificar" +
    	                     "</button>" +
    	                  "</div>" +
    	                  "<div class='contenidoSubList' style='display:none'>" +
    	                  "</div>" +
    	               "</div>";
    	     
    	    $(".divListPrincipal").append(textNuevo);
    	 
    	    listPanelesPrincipal.push(
 	       {id: "infoMovilAntecedenteCovid",clase:"",
 	 	nombre: ""+"Antecedente médico y datos del entorno ",
 	        contenido: ""+textTotal}
    	    );
 			
    	    agregarPanelesDivPrincipalCovid(listPanelesPrincipal,"");
    	    
    	    if(parseInt(getSession("gestopcompanyid")) == 670){
    	       $(".campoConvivePersonaEnfCro-AntecedenteCovid").hide();
    	       $(".campoNumPersonasDom-AntecedenteCovid").hide();
    	    }
 			
 	    $(".listaFinalGestionGosst").hide();
 	    $(".contenidoFormVisible").hide();
 	    break;
 	     
         default:
 	    alert("nop");
 	    break;
      }
   });
}

function mensajeBloqueoAntecedente(){
   mensajeUx="<br><label>Usted ya ha modificado su antecedente el día de hoy.</label>" +
  	     "<label style='color:red;'>*Solo puede modificarlo una vez al día.</label>"  
   mensajesUx(mensajeUx,8,""); 
}

function registroAntecedenteCovidDesdeFormCovid(){
   accesoDirectoAntCov = 0;
    
   if(hasAntecedenteModificado == 0){
      var dataParam={
	 empresaId: getSession("gestopcompanyid"),
	 trabajadorId: getSession("trabajadorGosstId")
      };
	 	
      callAjaxPost(URL+'/covid/antecedente_covid',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       listAntecedenteCovid = data.listAntecedenteCovid;
	       listEnfermedad = data.listEnfermedad;
	       listRespuestaSimple = data.listRespuestaSimple;
	       listTrimestreEmbarazo = data.listTrimestreEmbarazo;
	       listNumeroConviviente = data.listNumeroConviviente;
	       hasAntecedenteModificado = data.trabajadorCovid.hasAntecedenteModificado;
	       fechaNacimiento = data.trabajadorCovid.fechaNacimientoTexto;
	       edad = data.trabajadorCovid.edad;
	       
	       listAntecedenteCovid.forEach(function(val,index){
	          objAntecedenteCovid = listAntecedenteCovid[index];
	       });
	       
	       rellenarAntecedenteCovid(1);
	    break;
	 	     
	    default:
	       alert("nop");
	       break;
         }
      });
   }else{
      mensajeBloqueoAntecedente();
   }
}

function rellenarAntecedenteCovid(who){
   whoModificaAntCov = who;
    
   var selTrimestreEmbarazo = crearSelectOneMenu("selTrimestreEmbarazo","",listTrimestreEmbarazo,
      (objAntecedenteCovid.id > 0?objAntecedenteCovid.trimestreEmbarazo.id:"-1"),"id","nombre","No / No Aplica");
    
   var selNumeroConviviente = crearSelectOneMenu("selNumeroConviviente","",listNumeroConviviente,
      (objAntecedenteCovid.id > 0?objAntecedenteCovid.numeroConviviente.id:"-1"),"id","cantidad");
    
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id -val.id;
   });
    
   var radiosPregunta1 = crearRadiosAuto("radioPreguntaCovid1",listBooleanSiNo,objAntecedenteCovid.respuestaUno.id,
      "id","nombre","habilitarCheckBoxEnfermedades");
   var radiosPregunta2 = crearRadiosAuto("radioPreguntaCovid2",listBooleanSiNo,objAntecedenteCovid.respuestaDos.id,
      "id","nombre","");
   //var radiosPregunta4 = crearRadiosAuto("radioPreguntaCovid4",listBooleanSiNo,objAntecedenteCovid.respuestaCuatro.id,"id","nombre","");
   var radiosPreguntaEnfermedad01 = crearRadiosAutoForCovAntecedente("radioPreguntaForAntCov1",listEnfermedad,
      objAntecedenteCovid.listEnfermedadesId,"id","nombre","checkbox","left");;
    
   var listItemsExam=[
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"<span style='color:blue;,font-size:10px;font-size:20px;font-weight:bolder;'>*** DATOS PERSONALES ***</span>",
       inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"¿Usted sufre de alguna enfermedad crónica?",
       inputForm: radiosPregunta1,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-11",anchoDiv:"col-sm-1",
       label:"En caso haya respondido Sí en la pregunta anterior, seleccionar la(s) enfermedad(es)",
       inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",inputForm:radiosPreguntaEnfermedad01,
       label:"",divContainer:"",fullRow:1,clase:"containerCheckbox"},
      /* {sugerencia:"",label:"*En caso de haber respondido sí en la pregunta anterior, especifique la(s) enfermedades(s)."
                         ,inputForm:"<br><input class='form-control' id='inputDetalleRespuestaUnoAntCov'>"},*/
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
   ];
     
   if(parseInt(getSession("gestopcompanyid")) != 648 && parseInt(getSession("gestopcompanyid")) != 649){
      listItemsExam.push(
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"Fecha de nacimiento",
          inputForm:"<span style='font-weight:bolder;'>"+fechaNacimiento+" ("+edad+" años)</span>",
          divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
   }
      
   listItemsExam.push(
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"¿Está embarazada? ",inputForm:selTrimestreEmbarazo,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"Ingrese su altura en centímetros. Por ejemplo, 160 cm <span style='color:blue;'>(No decimales)</span>",
       inputForm:"<input type='number' class='form-control' id='inputAlturaAntCov' min='100' max='250'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"Ingrese su peso en kilogramos. Por ejemplo, 60 kg <span style='color:blue;'>(No decimales)</span>",
       inputForm:"<input type='number' class='form-control' id='inputPesoAntCov' min='30' max='200'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>*** DATOS DEL ENTORNO ***</span>",
       inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
       label:"Ingrese su dirección",inputForm:"<input class='form-control' id='inputDireccionAntCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",clase:"campoConvivePersonaEnfCro-AntecedenteCovid",
       label:"¿Convive con algún adulto mayor, niño, gestante o familiar con enfermedad crónica?",
       inputForm:radiosPregunta2,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoConvivePersonaEnfCro-AntecedenteCovid",
       label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",clase:"campoNumPersonasDom-AntecedenteCovid",
       label:"¿Cuántas personas comparten el mismo domicilio que usted?",
       inputForm:selNumeroConviviente,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoNumPersonasDom-AntecedenteCovid",
       label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"Coloque su teléfono personal (revisar que el número sea de 9 dígitos)",
       inputForm:"<input type='number' class='form-control' id='inputTelefonoContactoAntCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"Ingrese el nombre de la persona de contacto en caso de emergencia",
       inputForm:"<input class='form-control' id='inputPersonaContactoAntCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
       label:"Coloque el teléfono de la persona de contacto (revisar que el número sea de 7 o 9 dígitos)",
       inputForm:"<input type='number' class='form-control' id='inputTelefonoPersonaContactoAntCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
 	     "<span style='font-size:10px;font-weight:bolder;'>"+declaracionJurada+"</span>",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
       inputForm:"<button type='submit' class='btn btn-success'style='float:right;font-size:18px;'>" +
       		    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>"});
    
   var textFormExamen="";
 	
   listItemsExam.forEach(function(val,index){
      textFormExamen += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalEditarAntecedenteCovid",
      nombre:"Registro antedecentes médicos - COVID-19",
      contenido:"<form id='formEditarAntecedenteCovid' class='eventoGeneral'>"+textFormExamen+"</form>"
   }
    
   if(objAntecedenteCovid.id == 0){
      crearModalPrincipalUsuarioObligatorio(opciones,function(){},true,true);   
   }else{
      crearModalPrincipalUsuario(opciones,function(){},false,true);
   }	
   
   var editarDiv = $("#formEditarAntecedenteCovid");
 	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarAntecedenteCovid();
   });
    
   if(objAntecedenteCovid.id > 0){
      editarDiv.find("#inputDetalleRespuestaUnoAntCov").val(objAntecedenteCovid.detalleRespuestaUno);
      editarDiv.find("#inputTelefonoContactoAntCov").val(objAntecedenteCovid.telefonoContacto);
      editarDiv.find("#inputPersonaContactoAntCov").val(objAntecedenteCovid.personaContacto);
      editarDiv.find("#inputTelefonoPersonaContactoAntCov").val(objAntecedenteCovid.telefonoPersonaContacto);
      editarDiv.find("#inputAlturaAntCov").val(objAntecedenteCovid.altura);
      editarDiv.find("#inputPesoAntCov").val(objAntecedenteCovid.peso);
      editarDiv.find("#inputDireccionAntCov").val(objAntecedenteCovid.direccion);
       
       /*if(objAntecedenteCovid.respuestaUno.id==0){
	  habilitarInputDetalleRespuestaUno(0);
       }*/
       
      if(objAntecedenteCovid.respuestaUno.id == 0){
	 habilitarCheckBoxEnfermedades(0);
      }
   }
   
   if(parseInt(getSession("gestopcompanyid")) == 670){
      $(".campoConvivePersonaEnfCro-AntecedenteCovid").hide();
      $(".campoNumPersonasDom-AntecedenteCovid").hide();
   }
}

/*function habilitarInputDetalleRespuestaUno(value){

   if(value==true){
      // habilitamos
      document.getElementById("inputDetalleRespuestaUnoAntCov").disabled=false;
   }else{
      // deshabilitamos
      document.getElementById("inputDetalleRespuestaUnoAntCov").disabled=true;
      document.getElementById("inputDetalleRespuestaUnoAntCov").value="";
   }
}*/

function habilitarCheckBoxEnfermedades(value){

    if(value==true){
       // habilitamos
	listEnfermedad.forEach(function(val,index){
           document.getElementById(val.id+"radioPreguntaForAntCov1").disabled=false;
	})
    }else{
       // deshabilitamos
       listEnfermedad.forEach(function(val,index){
          document.getElementById(val.id+"radioPreguntaForAntCov1").disabled=true;
          document.getElementById(val.id+"radioPreguntaForAntCov1").checked=false;
       })
    }
 }

function guardarAntecedenteCovid(){
   var textDiv = "#formEditarAntecedenteCovid";
    
   var formDiv = $(textDiv);
    
   var campoVacio = true;
 	
   var radioValueUno = formDiv.find("input[name='radioPreguntaCovid1']:checked").val();
   var detalleRespuestaUno = formDiv.find("#inputDetalleRespuestaUnoAntCov").val();
   
   var radioValueDos = (parseInt(getSession("gestopcompanyid")) == 670?0:
      formDiv.find("input[name='radioPreguntaCovid2']:checked").val());
   
   var valListTrimestreEmbarazo = parseInt(formDiv.find("#selTrimestreEmbarazo").val());
   var valAltura = formDiv.find("#inputAlturaAntCov").val();
   var valPeso = formDiv.find("#inputPesoAntCov").val();
   var direccion = formDiv.find("#inputDireccionAntCov").val(); 
    //var radioValueCuatro = formDiv.find("input[name='radioPreguntaCovid4']:checked").val();
   var radioValueCuatro = (edad >= 65?1:0);
   
   var valListNumeroConviviente = (parseInt(getSession("gestopcompanyid")) == 670?1:
      parseInt(formDiv.find("#selNumeroConviviente").val()));
   
   var telefonoContacto = formDiv.find("#inputTelefonoContactoAntCov").val();
   var personaContacto = formDiv.find("#inputPersonaContactoAntCov").val();
   var telefonoPersonaContacto = formDiv.find("#inputTelefonoPersonaContactoAntCov").val();
    
   var listEnfermedadesId = [];
	
   listEnfermedad.forEach(function(val,index){
      if(($("#"+val.id+"radioPreguntaForAntCov1").prop("checked")?1:0) == 1){
         listEnfermedadesId.push({id:parseInt(val.id)});  
      }   
   });
    
   if(radioValueUno == null ||  radioValueDos == null || radioValueCuatro == null || 
      valListNumeroConviviente == '-1' || personaContacto.length == 0 || valAltura < 1 || 
      valPeso < 1 || direccion.length == 0){
      campoVacio = false;
      mensajeUx="<label>Debe ingresar la información respectiva en todos los campos.</label>";
   }
   
   if(telefonoContacto.length != 9){
      campoVacio = false;
      mensajeUx="<label>El número de teléfono personal deben tener 9 dígitos.</label>"; 
   }
   
   if(telefonoPersonaContacto.length < 7){
      campoVacio = false;
      mensajeUx="<label>El número de teléfono de la persona de contacto deben tener, " +
      		"como mínimo, 7 dígitos.</label>"; 
   }
    
    /*if(radioValueUno == 1 && detalleRespuestaUno.length == 0){
       campoVacio = false;
    }*/
    
   if(radioValueUno == 1 && listEnfermedadesId.length == 0){
      campoVacio = false;
      mensajeUx="<label>Como ha respondido Sí a la pregunta #01, debe seleccionar las enfermedades.</label>";
   }
    
   if(campoVacio){
      var dataParam={
 	 id: objAntecedenteCovid.id,
 	 respuestaUno: {id: radioValueUno},
 	 listEnfermedades: listEnfermedadesId,
 	 detalleRespuestaUno: detalleRespuestaUno,
 	 respuestaDos: {id: radioValueDos},
 	 trimestreEmbarazo: {id: valListTrimestreEmbarazo},
 	 respuestaCuatro: {id: radioValueCuatro},
 	 altura: valAltura,
 	 peso: valPeso,
 	 direccion: direccion,
 	 numeroConviviente: {id: valListNumeroConviviente},
 	 telefonoContacto: telefonoContacto,
 	 personaContacto: personaContacto,
 	 telefonoPersonaContacto: telefonoPersonaContacto,
 	 trabajadorId: (whoModificaAntCov == 1?getSession("trabajadorGosstId"):registroTrabajadorIdVistaMedCov),
 	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/covid/antecedente_covid/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":  
 	       $("#modalEditarAntecedenteCovid").remove();
 		    
 	       mensajeUx="<label>El antecedente fue registrado con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarVista");
 		    
 	       if(whoModificaAntCov == 1){
 	 	  $("#modalMensajeUxActualizarVista").on("hidden.bs.modal",function(){
 	 	     $("#modalMensajeUxCompletarObligatorio").modal("hide");
 	 	     $("#modalMensajeUxCompletarObligatorio").remove();
 	  		  
 	 	     if(objAntecedenteCovid.id != 0){
 	  	        if(accesoDirectoAntCov == 1){
 	  		   habilitarAntecedenteCovid(); 
 	  	        }else{
 	   	    	   habilitarFormularioCovid();
 	  	        } 
 	 	     }else{
 	  		primerForCovRegistro++;
 	  		marcarIconoModuloSeleccionado(18);  
 	 	     }
 	 	  });
 	       }else{
 	          $("#modalMensajeUxActualizarVista").on("hidden.bs.modal",function(){
 	 	     $("#modalMensajeUxCompletarObligatorio").modal("hide");
 	 	     $("#modalMensajeUxCompletarObligatorio").remove();
 	 	     numModificaciones++;
 		     verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);
 	          });
 	       }
 		    
 	       break;
 		   
 	    default:
               alert("Ocurrió un error al guardar!");
         }
      }); 
   }else{
      $("#modalEditarAntecedenteCovid").modal("hide");
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
	 $("#modalMensajeUxCompletarObligatorio").modal("hide");
	 $("#modalEditarAntecedenteCovid").modal("show");    
      });
   }
}

function obtenerSubPanelModuloEncuesta(val,count){
	
    var estiloDefault="";
 	
    if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
       estiloDefault="    border-top: 1px solid #a5aaae;"
    }
    
    if(val.fullRow == 1){
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	 "<div class='col-sm-14' id='"+val.divContainer+"'>"+
	 val.inputForm+
	 "</div>"+
	  "</div>"+
	"";
    }
 	
    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
               (count==2 || count == 7 || count==8 || count==11?"<div class='col-sm-8 col-form-label'><p align='justify' style='font-weight:bolder;'>"+val.label+"</p></div>":
                  (count==3 || count== 16?"<div class='col-sm-11 col-form-label'><p align='justify' style='font-weight:bolder;'>"+val.label+"</p></div>":
                      (count==4 ?"<div class='col-sm-1 col-form-label'><p align='justify' style='font-weight:bolder;'>"+val.label+"</p></div>" :    
                         "<div class='col-sm-6 col-form-label'><p align='justify' style='font-weight:bolder;'>"+val.label+"</p></div>")))+
               (count==2 || count == 7 || count==8 || count==11?"<div class='col-sm-4' id='"+val.divContainer+"'>":
        	  (count==3 || count== 16?"<div class='col-sm-1' id='"+val.divContainer+"'>":
        	      (count == 4?"<div class='col-sm-11' id='"+val.divContainer+"'>":
        	                  "<div class='col-sm-6' id='"+val.divContainer+"'>")))+
 	             " "+val.inputForm+
 	             "<small>"+val.sugerencia+" </small>"+
 	          "</div>"+
 	   "</div>";
}

function obtenerSubPanelModuloEncuestaDatos(val,count){
	
    var estiloDefault="";
 	
    if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
       estiloDefault="    border-top: 1px solid #a5aaae;"
    }
 	
    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
              (count==2 || count==5 || count==7 || count == 8 || count == 11 ?
        	            "<div for='colFormLabel' class='col-sm-9 col-form-label' style='text-align:justify;font-weight:bolder;'>"+val.label+"</div>":
        	  (count==3 ? "<div for='colFormLabel' class='col-sm-4 col-form-label' style='text-align:justify;font-weight:bolder;'>"+val.label+"</div>":
        	     (count == 4?"<div for='colFormLabel' class='col-sm-6 col-form-label' style='text-align:justify;font-weight:bolder;'>"+val.label+"</div>":
        	  	         "<div for='colFormLabel' class='col-sm-7 col-form-label' style='text-align:justify;font-weight:bolder;'>"+val.label+"</div>")))+
              (count==2 || count==5 || count==7 || count == 8 || count == 11 ?
        	            "<div style='text-align:right;font-weight:bold;' class='col-sm-3' id='"+val.divContainer+"'>"+val.inputForm+"":
        	  (count ==3 ? "<div style='text-align:right;font-weight:bold;' class='col-sm-8' id='"+val.divContainer+"'>"+val.inputForm+"":
        	      (count == 4?"<div style='text-align:right;font-weight:bold;' class='col-sm-6' id='"+val.divContainer+"'>"+val.inputForm+"":
        	                  "<div style='text-align:right;font-weight:bold;' class='col-sm-5' id='"+val.divContainer+"'>"+val.inputForm+"")))+
 	         "<small>"+val.sugerencia+" </small>"+
 	      "</div>"+
 	   "</div>";
}

function agregarPanelesDivPrincipalCovid(listPanelesPrincipal,style){
    if(listPanelesPrincipal.length == 0){
       $(".divListPrincipal")
 	  .append("<div id='divNoResultados'>" +
 			     "<div class='tituloSubList'></div>" +
 				 "<div class='contenidoSubList' style='"+style+"'></div>" +
 			  "</div>");
       
       $("#divNoResultados").find(".tituloSubList")
       .html(//"<i aria-hidden='true' class='fa fa-list'></i>"+ 
 			"Sin resultados"); 
    }
    
    listPanelesPrincipal.forEach(function(val,index){
       $(".divListPrincipal")
       .append("<div id='"+val.id+"' class='"+val.clase+"'>" +
 			     "<div class='tituloSubList'></div>" +
 				 "<div class='contenidoSubList' style='"+style+"'></div>" +
 		      "</div>");
       
       var textoBtn="<button class='btn btn-success' style= 'padding:0px 8px 0px 8px' " +
       		               "onclick='cambiarDivSubContenido(this,"+val.proyectoId+")'>" +
 	                  "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
 	               "</button>";
 		
       $("#"+val.id).find(".tituloSubList")
       .html(textoBtn
 	  //	+"<i aria-hidden='true' class='fa fa-list'></i>"
 	  +val.nombre); 
 		
       $("#"+val.id).find(".contenidoSubList")
       .html(val.contenido);
    });
 }

function crearRadiosAutoForCovAntecedente(nameId,listOptions,radioSelected,idValue,nombreValue,choice,align){
    var textoOpcionesRadio = "<div class='containerCenter' >";
    listOptions.forEach(function(val){	
	  textoOpcionesRadio+="<div class='"+(choice=="checkbox"?"containerInputRadioChecbox":"")+"' style='"+(choice=="checkbox"?"padding-left : 20px":"width : 50%")+";display: inline-block; text-align: "+align+";  '>" +
	       "<label for = '"+val[idValue] +nameId+"'>"+	
	           "<input type='"+choice+"' id='"+val[idValue] +nameId+"' name='"+nameId+"' value='"+val[idValue]+"' "+
			(choice=="radio"?(parseInt(radioSelected)==parseInt(val[idValue])?"checked":"")
				        :(radioSelected.includes(val[idValue])==true?"checked":""))+">" +
	          val[nombreValue]+"</label></div>" 
    });
    textoOpcionesRadio+="</div>"
   return textoOpcionesRadio;
}