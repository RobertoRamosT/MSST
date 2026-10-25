var objFormularioCovid = {};
var listFormularioCovid = [];
var listSintoma = [];
var listModalidadTrabajo = [];
var mensajeFinalFormulario;
var indexFormularioCovid;
var hasFactorRiesgo;
var hasFormularioVigente;
var edad,telefonoActual;
var fechaUltimoPaseTrabajo;
var hasSeguimientoMedicoHoy;
var hasConstanciaTrabajo;
var hasPaseTrabajoHabilitadoMedico;
var hasAntecedenteModificado;
var hasPrimeraDosisVacunaCovid,hasSegundaDosisVacunaCovid,hasVacunaCovidUnaSolaDosis,hasFechaSegundaDosisPendiente,
    hasActualizarCarneVacunaCovid,hasEstadoEvalCarneVacunaCovid,hasRespEvalCarneVacunaCovid,hasFechaTerceraDosisPendiente,
    habilitarBtnDosis,habilitarBtnCarne,hasTerceraDosisVacunaCovid,hasDiferenciaDiasPrimeraDosis,hasDiferenciaDiasSegundaDosis,
    hasDiferenciaDiasTerceraDosis,hasCuartaDosisVacunaCovid,isNecesarioActCarVacCov;
var numDosisVacunaCovid;
var listHistorialVacunaCovid=[],listTipoVacunaCovid=[];
var mensajeInicialEstado = true;
var encabezadoUx,tituloUx,mensajeUx,piePaginaUx;
var whoCompletaForCov;
var fechaHoyTexto;
var primerForCovRegistro=0;
var preguntaDos,preguntaTres,preguntaCuatro,
    preguntaCinco,declaracionJurada,mensajePrevioFormCov,
    nombrePase,mensajeAccesoFormCov;
var listTipoPruebaCovidAux=[],listResultadoPruebaCovidAux=[];

var intervaloPrimeraDosisForCov,intervaloSegundaDosisForCov,edadSegundaDosisForCov,intervaloTerceraDosisForCov,edadTerceraDosisForCov;

function toggleMenuOpcionFormularioCovid(obj, pindex) {
    objFormularioCovid = listFormularioCovid[pindex];
    indexFormularioCovid = pindex;
    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul")
	    .hide();
}

var funcionalidadesFormularioCovid=[{
   id: "opcPase",nombre: "<i class='fa fa-thumbs-up'></i> Pase de trabajo ",
   functionClick: function(data){verPaseTrabajoCovid()}}
// {id:"opcEditar", nombre:"<i class='fa fa-pencil-square-o'></i> Editar
// ",functionClick:function(data){rellenarFormularioCovid("2")}},
// {id:"opcElimnar", nombre:"<i class='fa fa-times'></i>
// Eliminar",functionClick:function(data){eliminarFormularioCovid()}}
];

function marcarSubOpcionFormularioCovid(pindex){
   funcionalidadesFormularioCovid[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function ocultarFiltroFormCovidTrab(){
   $("#modalFiltroFormCovidTrab").modal("hide");
}

function verFiltroFormCovidTrab(){
   $("#modalFiltroFormCovidTrab").modal("show");
}

function crearFiltroFormCovidTrab(functionCallBack){ 
   var contenido = "";
 	  				
   var listContenido=[
 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha Inicio - Registro",
 	   inputForm:"<input type='date' id='fechaInicioFormCovTrab' class='form-control'>"},
 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha Fin - Registro",
 	   inputForm:"<input type='date' id='fechaFinFormCovTrab' class='form-control'>"},
 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	   label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
 	   		 "onclick='ocultarFiltroFormCovidTrab()'>" +
 	            "<i class='fa fa-times'></i> Cancelar" +
 	         "</button>",
 	   inputForm:"<button id='btnAplicarFiltroFormCovidTrab' class='btn btn-success' type='submit' " +
 	  	      	     "onclick='habilitarFormularioCovid()' style='float:right;font-size:18px;'>" +
 	  	        "<i class='fa fa-filter'></i> Aplicar filtro" +
 	  	     "</button>"}
 	  	     ];
 	  				
   listContenido.forEach(function(val){
      contenido +=obtenerSubPanelModuloVersionDos(val);
   });
 	  				
   var modalOptionsEvaDocPro={
 	  id: "modalFiltroFormCovidTrab",
 	  nombre: "<i class='fa fa-filter'></i> Filtros",
 	  contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
 	  	             };
 	  				
   crearModalPrincipalUsuario(modalOptionsEvaDocPro,function(){},false);
    
   var hoy = getSession("fechaHoyOrdenInversoTexto");
    
   $("#fechaInicioFormCovTrab").val(sumaFechaDias(-7,hoy));
   $("#fechaFinFormCovTrab").val(hoy);
 	
 	  				
   $("#btnAplicarFiltroFormCovidTrab").on("click",function(){
      ocultarFiltroFormCovidTrab();
   });
 	  	
   $("#modalFiltroFormCovidTrab").modal("hide");
   functionCallBack();
}

function habilitarFormularioCovid(){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      trabajadorId: getSession("trabajadorGosstId"),
      fechaInicioRegistro: $("#fechaInicioFormCovTrab").val(),
      fechaFinRegistro: $("#fechaFinFormCovTrab").val()
   };

   var listPanelesPrincipal = [];
 
   if(parseInt(getSession("gestopcompanyid")) == 616){
      mensajeAccesoFormCov = 
         "<span style='font-weight:bold;'>Estimado(a) estudiante, en caso tenga los siguientes síntomas:</span>" +
	 "<br><br><label style='color:red;'>*Fiebre superior a 37.5°C.</label>" +
	 "<br><br><label style='color:red;'>*Tos.</label>" +
	 "<br><br><label style='color:red;'>*Dificultad respiratoria.</label>" +
	 "<br><br><span style='font-weight:bold;'>Llame inmediatamente al 113 (MINSA) o al 117 (ESSALUD). " +
	 "Además, notifique a la brevedad a Servicios Médicos de la Universidad, para el seguimiento respectivo " +
	 "de su caso, por medio de los siguientes canales de comunicación:</span>" +
	 "<br><br><label style='color:blue;'>*Whatsapp: 943 508 297 / 960 274 416 / 994 612 473</label>" +
	 "<br><br><label style='color:blue;'>*Correo: servicios.medicos@uwiener.edu.pe.</label>";
       
      mensajePrevioFormCov = 
         "<label style='color:black;'>Estimado(a) estudiante "+ getSession("gestopusername")+",</label>" +
         "<br><br><label style='color:black;'>Recuerde que, de sus respuestas, depende la salud de su familia y " +
         "la salud de la familia de cada uno de sus compañeros.</label>";
      nombrePase = "Pase de acceso";
      preguntaDos = 
	 "2.- En los últimos 14 días, ¿ha tenido contacto con un caso confirmado de COVID-19?";
      preguntaTres = 
	 "3.- En los últimos 14 días, ¿usted ha participado en algún evento masivo?";
      preguntaCuatro = 
	 "4.- En los últimos 14 días, ¿usted ha viajado a nivel nacional o internacional donde " +
	 "<span style='color:blue;font-weight:bold;'>NO se hayan cumplido con las medidas de " +
	 "bioseguridad?</span>";
      preguntaCinco = 
	 "¿Cuál es su modalidad de estudios?";
      declaracionJurada =
         "Todos los datos expresados en este formulario constituye una DECLARACIÓN JURADA de mi parte. <br>" +
         "He sido informado que, de omitir o falsificar información, puedo perjudicar mi salud y la de mis " +
         "compañeros, lo cual puede constituir una falta grave a la salud pública, por lo cual asumo las consecuencias.";
   }else{
       mensajeAccesoFormCov = 
         "<span style='font-weight:bold;'>Estimado colaborador(a), en caso tenga los siguientes síntomas:</span>" +
	 "<br><br><label style='color:red'>*Fiebre superior a 37.5°C.</label>" +
	 "<br><br><label style='color:red'>*Tos.</label>" +
	 "<br><br><label style='color:red'>*Dificultad respiratoria.</label>" +
	 "<br><br><span style='font-weight:bold;'>Llame inmediatamente al 106 (SAMU) o al 117 (Essalud). " +
	 "Además notifique a la brevedad al departamento médico de su empresa.</span>";
       
      mensajePrevioFormCov = 
         "<label style='color:black;'>Estimado(a) "+ getSession("gestopusername")+",</label>" +
         "<br><br><label style='color:black;'>Recuerde que, de tus respuestas, depende la salud de tu familia y " +
         "también la salud de la familia de cada uno de tus compañeros.</label>";
      nombrePase = "Pase de trabajo";
      
      if(parseInt(getSession("gestopcompanyid")) == 646){
	 preguntaDos = 
	    "2.- En los últimos 10 días, ¿ha tenido contacto con un caso confirmado de COVID-19?";
	 preguntaTres = 
	    "3.- En los últimos 10 días, ¿usted asistió a un centro médico donde se atendieron a pacientes " +
	    "confirmados o sospechosos de infección por COVID-19?";
      }else if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649){
         preguntaDos = 
            "2.- En los últimos 7 días, ¿ha tenido contacto con un caso confirmado de COVID-19?";
	 preguntaTres = "";
      }else if(parseInt(getSession("gestopcompanyid")) == 670){
	 preguntaDos = 
	    "2.- En los últimos 7 días, ¿ha tenido contacto con un caso confirmado " +
	    "de COVID-19 <span style='color:blue;font-weight:bold;'>que NO haya comunicado a su jefe inmediato?</span>";
	 preguntaTres = "";      
      }else{
         preguntaDos = 
            "2.- En los últimos 14 días, ¿ha tenido contacto con un caso confirmado " +
       	    "de COVID-19 <span style='color:blue;font-weight:bold;'>que NO haya comunicado a su jefe inmediato?</span>";
         preguntaTres = 
            "3.- En los últimos 14 días, ¿usted trabajó o asistió a un centro médico donde se atendieron a pacientes " +
            "confirmados o sospechosos de infección por COVID-19 <span style='color:blue;font-weight:bold;'>que NO haya " +
            "comunicado a su jefe inmediato?</span>";
      }
      
      if(parseInt(getSession("gestopcompanyid")) == 646 ||parseInt(getSession("gestopcompanyid")) == 648 || 
	 parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670){
         preguntaCuatro = "";      
      }else{
	 preguntaCuatro = 
            "4.- Durante los últimos 14 días, ¿usted ha viajado a nivel nacional o internacional donde NO se " +
	    "hayan cumplido con las medidas de bioseguridad?"; 
      }
      
      preguntaCinco = 
	 "Modalidad de trabajo actual";
      declaracionJurada =
	 "Todos los datos expresados en esta ficha constituye una declaración jurada de mi parte. <br>" +
	 "He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros, " +
	 "y la mía propia, lo cual, de constituir una falta grave a la salud pública, asumo sus consecuencias.";
   }
   
   if(mensajeInicialEstado == true){
      mensajesUx(mensajeAccesoFormCov,5,"","MensajeInicialForCov");
       
      if(primerForCovRegistro != 0){
 	 $("#modalMensajeUxMensajeInicialForCov").on("hidden.bs.modal",function(){
 	    primerForCovRegistro++;
 	    mensajePrevioFormulario();
 	 });
      }
   }
   
   var textoInputFechaAux = (parseInt(getSession("gestopcompanyid")) == 524 || parseInt(getSession("gestopcompanyid")) == 648 || 
      parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670?"* Fecha de contacto:":
         (parseInt(getSession("gestopcompanyid")) == 646?"*Fecha de contacto o trabajo/asistencia":"*Fecha de contacto, trabajo/asistencia o viaje:"));

   mensajeInicialEstado = false;

   callAjaxPost(URL+'/covid/formulario_covid',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var textIn = "";
	    var fechaUltimaActualizacion = "";
	    var estadoUltimaActualizacion = "";
	    var opcionPaseNotificacionCovid;
	    var valModTrabajoUltimo;
	    var validacionPrimerFormulario;

	    listFormularioCovid = data.listFormularioCovid;
	    $(".divListPrincipal").html("");

	    listSintoma = data.listSintoma;
	    listModalidadTrabajo = data.listModalidadTrabajo;
	    hasFormularioVigente = data.trabajadorCovid.hasFormularioVigente;
	    hasFactorRiesgo = data.trabajadorCovid.condicionAntecedentePersonal;
	    validacionPrimerFormulario = data.trabajadorCovid.ultimoFormulario.respuestaUno.id;
	    fechaUltimoPaseTrabajo = data.trabajadorCovid.ultimoFormulario.soloFechaActualizacionTexto;
	    hasSeguimientoMedicoHoy = data.trabajadorCovid.hasSeguimientoMedicoHoy;
	    hasPaseTrabajoHabilitadoMedico = data.trabajadorCovid.ultimaObservacionMedica.tipoConfirmacionCovid.id;
	    hasConstanciaTrabajo = data.trabajadorCovid.hasConstanciaTrabajo;
	    mensajeFinalFormulario = data.mensajeCovid.mensajeCompletarFormulario;
	    edad = data.trabajadorCovid.edad; 
	    telefonoActual = data.trabajadorCovid.ultimoAntecedente.telefonoContacto;
	    fechaHoyTexto = data.fechaHoyTexto;
	    
	    hasAntecedenteModificado = data.trabajadorCovid.hasAntecedenteModificado;
	    
	    if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649){
	       listTipoPruebaCovidAux = data.listTipoPruebaCovid;
	       listResultadoPruebaCovidAux = data.listResultadoPruebaCovid;
	    }
	    
	    listHistorialVacunaCovid = data.listVacunaCovid;
 	    listTipoVacunaCovid = data.listTipoVacunaCovid;
	        
 	    hasPrimeraDosisVacunaCovid = data.trabajadorHistoriaVacuna.hasPrimeraDosisVacunaCovid;
 	    hasSegundaDosisVacunaCovid = data.trabajadorHistoriaVacuna.hasSegundaDosisVacunaCovid;
 	    hasTerceraDosisVacunaCovid = data.trabajadorHistoriaVacuna.hasTerceraDosisVacunaCovid;
 	    hasCuartaDosisVacunaCovid = data.trabajadorHistoriaVacuna.hasCuartaDosisVacunaCovid;
 	    hasVacunaCovidUnaSolaDosis = data.trabajadorHistoriaVacuna.hasVacunaCovidUnaSolaDosis;
	    hasFechaSegundaDosisPendiente = data.trabajadorHistoriaVacuna.hasFechaSegundaDosisPendiente;
	    hasFechaTerceraDosisPendiente = data.trabajadorHistoriaVacuna.hasFechaTerceraDosisPendiente;
	    
	    hasDiferenciaDiasPrimeraDosis = data.trabajadorHistoriaVacuna.diferenciaDiasPrimeraDosis;
	    hasDiferenciaDiasSegundaDosis = data.trabajadorHistoriaVacuna.diferenciaDiasSegundaDosis;
	    hasDiferenciaDiasTerceraDosis = data.trabajadorHistoriaVacuna.diferenciaDiasTerceraDosis;
	    
	    numDosisVacunaCovid = data.trabajadorHistoriaVacuna.numDosisVacunaCovid;
	    isNecesarioActCarVacCov = data.trabajadorHistoriaVacuna.isNecesarioActCarVacCov;
	    
	    hasActualizarCarneVacunaCovid = 
	       (hasPrimeraDosisVacunaCovid == 1?data.trabajadorCarneVacunacion.isHabilitadoBtnCarVacCov:0);
	    
 	    hasEstadoEvalCarneVacunaCovid = 
 	       (hasPrimeraDosisVacunaCovid == 1?data.trabajadorCarneVacunacion.evaluacionVacunacion.id:-1);
 	    
	    hasRespEvalCarneVacunaCovid = 
	       (hasPrimeraDosisVacunaCovid == 1?data.trabajadorCarneVacunacion.evaluacionVacunacion.usuario.nombre:"");
	    
	    if(parseInt(getSession("gestopcompanyid")) == 649){
	       if(numDosisVacunaCovid == 4){
		  intervaloPrimeraDosisForCov = 0;intervaloSegundaDosisForCov = 0;
		  intervaloTerceraDosisForCov = 180;edadTerceraDosisForCov = 0;
	       }else if(numDosisVacunaCovid == 3){
		  intervaloPrimeraDosisForCov = 0;intervaloSegundaDosisForCov = 180;
	          edadSegundaDosisForCov = 0; 
	       }
	    }else{
	       if(numDosisVacunaCovid == 4){
	          intervaloPrimeraDosisForCov = 21;intervaloSegundaDosisForCov = 90;
	          intervaloTerceraDosisForCov = 150;edadTerceraDosisForCov = 30;
	       }else if(numDosisVacunaCovid == 3){
	          intervaloPrimeraDosisForCov = 90;intervaloSegundaDosisForCov = 150;
	          edadSegundaDosisForCov = 30; 
	       }
	    }
	    
	    if(numDosisVacunaCovid == 4){
	       habilitarBtnDosis = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov || 
		  hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov || 
	          (hasDiferenciaDiasTerceraDosis >= intervaloTerceraDosisForCov && edad > edadTerceraDosisForCov)?1:0);
	          
	       habilitarBtnCarne = (habilitarBtnDosis == 0 && isNecesarioActCarVacCov == 1?1:0);
	    }else if(numDosisVacunaCovid == 3){
	       habilitarBtnDosis = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov || 
	          (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov && edad > edadSegundaDosisForCov)?1:0);
		          
	       habilitarBtnCarne = (habilitarBtnDosis == 0 && isNecesarioActCarVacCov == 1?1:0);
	    }else{
	       habilitarBtnDosis = 1;
	       habilitarBtnCarne = 0;
	    }	    
	    
	    var textTotal = "";

	    if(listFormularioCovid == ''){
	       fechaUltimaActualizacion = "<strong style='color:red'>Sin Registro</strong>";
	       estadoUltimaActualizacion = "<strong style='color:red'>No vigente</strong>";
	    }

	    var registroEncabezado = 0;
	    
	    listFormularioCovid.forEach(function(val,index){
	       registroEncabezado++;
	       var menuOpcion = "";
	       var btnOpcion = "";

	       if(registroEncabezado == 1){
		  fechaUltimaActualizacion = "<strong style='color:blue'>"+val.fechaActualizacionTexto+"</strong>";

		  if(hasFormularioVigente == 1){
		     estadoUltimaActualizacion = "<strong style='color:blue'>Vigente</strong>";
		  }else{
		     estadoUltimaActualizacion = "<strong style='color:red'>No vigente</strong>";
		  }
	       }
	       
	       if((val.respuestaUno.id == 0 && val.respuestaDos.id == 0 && val.respuestaTres.id == 0 && 
		   val.listSintomasId.length < 2) && (val.hasFactorRiesgo == 0 || val.hasConstanciaTrabajo == 1)) {
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
				    
	             funcionalidadesFormularioCovid.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionFormularioCovid("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });
				    
	          menuOpcion += "</ul>";
				    
	          var btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionFormularioCovid(this,"+index+")'>" +
			             "<i class='fa  fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			          "</a>";
	       }
				
	       var listTotal=[
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
		            "Fecha de registro: "+val.fechaActualizacionTexto +
		         "</span>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
		   label:"<i class='fa fa-list-ol'></i> 1.- Síntoma(s) :",
		   inputForm:"<div style='"+(val.listSintomasNombre == "Ninguno"?"color:blue;":"color:red;") +
		                         "font-weight:bold;text-align:right;'>"+val.listSintomasNombre+"</div>"},
		  {sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",
	 	   label:"<i class='fa fa-calendar'></i> *Fecha de inicio de síntoma(s) :",
	 	   inputForm:"<div style='"+(val.fechaInicioSintomaTexto == "------"?"color:blue;":"color:red;")+
	 		                 "font-weight:bold;text-align:right;'>"+val.fechaInicioSintomaTexto+"</div>"},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	   label:"<i class='fa fa-stethoscope'></i> *Otro síntoma(s) :",
	 	   inputForm:"<div style='"+(val.otroSintoma == "Ninguno"?"color:blue;":"color:red;")+
                                         "font-weight:bold;text-align:right;'>"+val.otroSintoma+"</div>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	   label:"<i class='fa fa-medkit'></i> *Medicamento(s) :",
	 	   inputForm:"<div style='"+(val.medicamento == "Ninguno"?"color:blue;":"color:red;")+
                                         "font-weight:bold;text-align:right;'>"+val.medicamento+"</div>"},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
		   label:"<i class='fa fa-check-square-o'></i> "+preguntaDos,
		   inputForm:"<div style='"+(val.respuestaUno.nombre == "No"?"color:blue;":"color:red;")+
			    	         "font-weight:bold;text-align:center;'>"+val.respuestaUno.nombre+"</div>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",clase:"campoPreguntaCentroMed-FormularioCovid",
		   label:"<i class='fa fa-check-square-o'></i> "+preguntaTres,
		   inputForm:"<div style='"+(val.respuestaDos.nombre == "No"?"color:blue;":"color:red;")+
                                         "font-weight:bold;text-align:center;'>"+val.respuestaDos.nombre+"</div>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoPreguntaCentroMed-FormularioCovid",
                   label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",clase:"campoPreguntaViaje-FormularioCovid",
		   label:"<i class='fa fa-check-square-o'></i> "+preguntaCuatro,
		   inputForm:"<div style='"+(val.respuestaTres.nombre == "No"?"color:blue;":"color:red;")+
                                         "font-weight:bold;text-align:center;'>"+val.respuestaTres.nombre+"</div>"},
		  {sugerencia:"",anchoLabel:"col-sm-9",anchoDiv:"col-sm-3",
		   label:"<i class='fa fa-calendar'></i> "+textoInputFechaAux,
		   inputForm:"<div style='"+(val.fechaInicioContactoTexto == "------"?"color:blue;":"color:red;")+
                                         "font-weight:bold;text-align:right;'>"+val.fechaInicioContactoTexto+"</div>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
		   label:"<i class='fa fa-check-square-o'></i> "+preguntaCinco,
		   inputForm:"<div style='color:blue;font-weight:bold;text-align:right;'>"+val.modalidadTrabajo.nombre+"</div>"}
	       /* {sugerencia:"",label:" ",fullRow:1,
		   inputForm:""+insertarImagenParaTablaMovil(val.evidenciaFirma,"160px","100%")}*/
	       ];
	       
	       if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649){
		  var enlacePruebaCovid = 
		     (val.evidenciaPruebaCovidNombre.length == 0?"------":
		      "<a class='efectoLink' target='blank' " +
			 "href='"+URL+"/covid/formulario_covid/prueba_covid/evidencia?id="+val.id+"'>"+
		          val.evidenciaPruebaCovidNombre+
		      "</a>");
		   
		  listTotal.push(
	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	             {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	    	      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	    	 	       "*** Prueba COVID-19 ***" +
	    	 	    "</span>"},
	    	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    	     {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	    	      label:"<i class='fa fa-list-ol'></i> *Tipo:",
	    	      inputForm:"<div style='color:blue;font-weight:bold;'>"+val.tipoPruebaCovid.nombre+"</div>"},
	    	     {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	    	      label:"<i class='fa fa-calendar'></i> *Fecha:",
	    	      inputForm:"<div style='color:blue;font-weight:bold;'>"+val.fechaPruebaCovidTexto+"</div>"},
	             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	             {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	    	      label:"<i class='fa fa-list-ol'></i> *Resultado:",
	    	      inputForm:"<div style='"+(val.resultadoPruebaCovid.id != 2?"color:blue;":"color:red;") +
	    		    		    "font-weight:bold;'>"+val.resultadoPruebaCovid.nombre+"</div>"},
//	    	     {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
//	    	      label:"<i class='fa fa-calendar'></i> *Fecha del resultado:",
//	    	      inputForm:"<div style='color:blue;font-weight:bold;'>" +
//	    		            val.fechaResultadoPruebaCovidTexto +
//	    		        "</div>"},
	    	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	             {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	    	      label:"<i class='fa fa-file-o'></i> *Evidencia:",
	    	      inputForm:enlacePruebaCovid});  
	       }

	       textTotal += "<div class='eventoGeneral'>" +
	                       "<form class='eventoGeneral'>";
	          listTotal.forEach(function(val,index){
		     textTotal += ""+obtenerSubPanelModuloVersionDos(val);
	          });
	       textTotal +=    "</form>" +
		            "</div>";
				
//	       textTotal += "<div class='divMovilFormularioCovid' id='divFormularioCovid"+val.id+"'></div>";
	    });

	    if(validacionPrimerFormulario != null){
	       opcionPaseNotificacionCovid = obtenerTipoMensajeTrabajo(data.trabajadorCovid.ultimoFormulario.respuestaUno.id,
	          data.trabajadorCovid.ultimoFormulario.respuestaDos.id,data.trabajadorCovid.ultimoFormulario.respuestaTres.id,
		  data.trabajadorCovid.ultimoFormulario.listSintomasId,data.trabajadorCovid.ultimoFormulario.resultadoPruebaCovid.id);
	       
	       valModTrabajoUltimo = data.trabajadorCovid.ultimoFormulario.modalidadTrabajo.id;
	    }

	    var userAgent = isMobile.any(); // se encuentra en el util.js
	    
	    var sizeLetter = "19px;";
	    var sizeLetterAux = "14px;";
   	     
	    if(userAgent == true){
               sizeLetter = "14px;";
               sizeLetterAux = "10px;";
	    }

	    var textNuevo = "";
    	    
	    var encabezadoSeccion=[
               {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
                label:"<label style='font-size:"+sizeLetter+"'>" +
                      "Fecha de registro del último formulario: "+"</label>" + 
                       (userAgent == true?"<br>":"")+" "+fechaUltimaActualizacion +
                      "<label style='font-size:"+sizeLetter+"margin-top:10px;'>" +
                      "Estado del último formulario renovable: "+"</label>" +
                       (userAgent == true?"<br>":"")+" "+estadoUltimaActualizacion+
                      "<br><label style='color:red;margin-top:5px;margin-bottom:-5px;'>" +
                      "*Recuerde que debe renovarlo cada día.</label>",
                inputForm:""},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
        	styleAux:(userAgent == true?"margin-top:-25px;":"margin-top:-15px;"),
                label:"<label style='font-size:"+sizeLetterAux+"'>" +
                      "Teléfono personal actual: "+telefonoActual+"</label>" + 
                      "<br><label style='color:red;margin-top:5px;margin-bottom:-5px;font-size:"+sizeLetterAux+"'>" +
                      "(Para modificarlo, dar click en el botón 'Actualizar antecedente covid').</label>",
                inputForm:""},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
            ];
	    
	    if(userAgent == true){
	       encabezadoSeccion.push(
	          {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
	  	   label:"<button style='font-size:"+sizeLetter+"float:left;margin-top:-25px;' title='Nuevo formulario renovable' " +
	  	                 "class='btn btn-success' onclick='"+(hasFormularioVigente == 0?"mensajePrevioFormulario()":
	  	                                                                                "mensajeBloqueoFormulario()")+"'>"+
	  	            "<i class='fa fa-pencil'></i> Registrar formulario" +
	  	         "</button>" +
	  	          (validacionPrimerFormulario != null && hasFormularioVigente == 1?
	 	           "<button style='font-size:"+sizeLetter+"margin-left:15px;margin-top:-25px;' " +
	 	  	           "title='"+(opcionPaseNotificacionCovid == 1 ?"Ver pase de trabajo de hoy":
	 	  			  				        "Ver notificación del formulario de hoy")+"' " +
	 	  		   "onclick='mostrarMensajeResultadoFormularioCovidVersionDos("+opcionPaseNotificacionCovid+
	 	  		                                                              ",2,"+valModTrabajoUltimo+")' " +
	 	  	           "class='btn btn-success'>"+
	 	  	      "<i class='fa "+(opcionPaseNotificacionCovid == 1 ?"fa-thumb-tack'></i> "+nombrePase:
	 	  	                    	 			         "fa-envelope-o'></i> Notificación")+
	 	  	   "</button>":""),
                   inputForm:"<button style='font-size:"+sizeLetter+"float:left;margin-bottom:-25px;" +
		                     "background-color:#1A992A;color:white;' class='btn' " +
                                     "title='Actualizar antecedente covid (máximo una vez al día)' " +
                                     "onclick='registroAntecedenteCovidDesdeFormCovid()'>"+
                                "<i class='fa fa-history'></i> Actualizar antecedente covid" +
                             "</button>" +
                             (habilitarBtnDosis == 0?
 	        	      (habilitarBtnCarne == 0?"":
	  	               "<button style='font-size:"+sizeLetter+"float:left;margin-top:40px;" +
 	          		              "background-color:black;color:white;' " +
                                       "title='Actualizar la evidencia del carné de vacunación.' class='btn' " +
                                       "onclick='actualizarCarneVacunaCovidDesdeFormCovid()'>"+
                                  "<i class='fa fa-id-card'></i> Actualizar carné vacunación" +
                               "</button>"):
 	        	      "<button style='font-size:"+sizeLetter+"float:left;margin-top:40px;" +
 	        	                     "background-color:#1A992A;color:white;' " +
                                      "title='Registrar la(s) vacuna(s) covid recibida(s).' class='btn' " +
                                      "onclick='registroVacunaCovidDesdeFormCovid()'>" +
                                 "<img src='../imagenes/iconos/fa-syringe-blanco.png' width='20px' height='20px'> " +
                                 "Registrar vacuna(s) covid" +
                              "</button>")}); 
	    }else{
	       encabezadoSeccion.push(
	          {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",
	           label:"<button style='font-size:"+sizeLetter+"float:left;margin-top:-10px;' title='Nuevo formulario renovable' " +
	                         "class='btn btn-success' onclick='"+(hasFormularioVigente == 0?"mensajePrevioFormulario()":
	                                                                                        "mensajeBloqueoFormulario()")+"'>"+
	                    "<i class='fa fa-pencil'></i> Registrar formulario" +
	                 "</button>" +
	                 "<button style='font-size:"+sizeLetter+"float:left;margin-top:15px;margin-bottom:-25px;" +
	                         "background-color:#1A992A;color:white;' class='btn' " +
                                 "title='Actualizar antecedente covid (máximo una vez al día)' " +
                                 "onclick='registroAntecedenteCovidDesdeFormCovid()'>"+
                            "<i class='fa fa-history'></i> Actualizar antecedente covid" +
                         "</button>",
	           inputForm:(validacionPrimerFormulario != null && hasFormularioVigente == 1?
	 	              "<button style='font-size:"+sizeLetter+"float:left;margin-top:-10px;' " +
	                              "title='"+(opcionPaseNotificacionCovid == 1 ?"Ver pase de trabajo de hoy":
			  					                   "Ver notificación del formulario de hoy")+"' " +
			  	      "onclick='mostrarMensajeResultadoFormularioCovidVersionDos("+opcionPaseNotificacionCovid+
			  	                                                              ",2,"+valModTrabajoUltimo+")' " +
	                    	      "class='btn btn-success'>"+
	                         "<i class='fa "+(opcionPaseNotificacionCovid == 1 ?"fa-thumb-tack'></i> "+nombrePase:
	                    	 				  	            "fa-envelope-o'></i> Notificación")+
	                      "</button>":"") +
	                     (habilitarBtnDosis == 0?
	      	              (habilitarBtnCarne == 0?"":
	 	               "<button style='font-size:"+sizeLetter+"float:left;" +
	 	                              "margin-top:"+(validacionPrimerFormulario != null && 
               			                             hasFormularioVigente == 1?"15px;":"35px;") +
	               		              "margin-left:-55px;margin-bottom:-30px;background-color:black;color:white;' " +
	                               "title='Actualizar la evidencia del carné de vacunación.' class='btn' " +
	                               "onclick='actualizarCarneVacunaCovidDesdeFormCovid()'>"+
	                          "<i class='fa fa-id-card'></i> Actualizar carné vacunación" +
	                       "</button>"):
	      	              "<button style='font-size:"+sizeLetter+"float:left;" +
	      	               		     "margin-top:"+(validacionPrimerFormulario != null && 
	      	               			            hasFormularioVigente == 1?"15px;":"35px;") +
	      	                             "margin-left:-30px;background-color:#1A992A;color:white;' " +
	      	                      "title='Registrar la(s) vacuna(s) covid recibida(s).' class='btn' " +
	      	                      "onclick='registroVacunaCovidDesdeFormCovid()'>" +
	      	                 "<img src='../imagenes/iconos/fa-syringe-blanco.png' width='20px' height='20px'> " +
	      	                 "Registrar vacuna(s) covid" +
	      	              "</button>")}); 
	    }
	    
	    textNuevo += "<div id='estadoMovilFechaActualizacionForCov'>" +
                            "<div style='font-size:"+sizeLetter+"' class='tituloSubList'>";
	       encabezadoSeccion.forEach(function(val,index){
	          textNuevo+=""+obtenerSubPanelModuloVersionDos(val);
	       });
	    textNuevo +=    "</div>"+
	                    "<div class='contenidoSubList' style='display:none'></div>" +
	                 "</div>";

	    $(".divListPrincipal").append(textNuevo);

	    listPanelesPrincipal.push({
	       id: "infoMovilFormularioCovid",clase:"",styleAux:"display:none",
	       buttonAd: "<button type='button' id='btnFiltroFormCovidTrab' class='btn btn-success' " +
                                 "style='padding:2px 8px 2px 8px;margin-right:10px' onclick='verFiltroFormCovidTrab()' " +
                                 "title='Ver valores del filtro para aplicarlo a esta sección.'>" +
                            "<i class='fa fa-filter fa-4x'></i>" +
                         "</button>",
	       nombre: ""+"Formularios COVID-19 registrados ("+listFormularioCovid.length+")",
	       contenido: ""+textTotal
	    });

	    agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
	    
	    if(parseInt(getSession("gestopcompanyid")) == 524 || parseInt(getSession("gestopcompanyid")) == 648 || 
	       parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670){
	       $(".campoPreguntaCentroMed-FormularioCovid").hide();$(".campoPreguntaViaje-FormularioCovid").hide();
	       $(".campoPreguntaViajeDetalle-FormularioCovid").hide();
	    }else if(parseInt(getSession("gestopcompanyid")) == 646){
	       $(".campoPreguntaViaje-FormularioCovid").hide();$(".campoPreguntaViajeDetalle-FormularioCovid").hide();
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

function mensajePrevioFormulario(){
   mensajesUx(mensajePrevioFormCov,7,"","MensajePrevioForCov");

   $("#modalMensajeUxMensajePrevioForCov").on("hidden.bs.modal",function(){
      rellenarFormularioCovid(1);
   });
}

function mensajeBloqueoFormulario(){
   var valIcono;
   
   if(hasSeguimientoMedicoHoy == 1 && hasPaseTrabajoHabilitadoMedico == 1){
      mensajeUx = 
         "<label>El staff médico le ha dado el alta médica respectiva el día de hoy ("+getSession("fechaHoyTexto")+").</label>" +
         "<br><label style='color:red;'>*Su formulario diario de sintomatología estará disponible a partir de mañana.</label>"
      
      valIcono = 7;
   }else{
      mensajeUx = 
         "<br><label>Usted ya ha completado un formulario el día de hoy.</label>" +
	 "<label style='color:red;'>*Recuerde que el formulario debe ser renovado cada día.</label>"

      valIcono = 8;    
   }
   
   mensajesUx(mensajeUx,valIcono,"");
}

var segundoFormAdiForCov;

function rellenarFormularioCovid(who){
   $("#modalRellenarFormularioCovid").remove();
   
   var textoInputFechaAux = (parseInt(getSession("gestopcompanyid")) == 524 || parseInt(getSession("gestopcompanyid")) == 648 || 
      parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670?
      "* En caso haya respondido Sí en la pregunta #02, ingresar la fecha de contacto.":
       (parseInt(getSession("gestopcompanyid")) == 646?"* En caso haya respondido Sí en la pregunta #02 o #03, " +
        "ingresar la fecha de contacto o trabajo/asistencia":"* En caso haya respondido " +
        "Sí en la pregunta #02, #03 o #04, ingresar la fecha de contacto, trabajo/asistencia o viaje."));
    
   if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649){
      $("#modalFormCovidFormAdicionalPruebaCovid").remove();
      segundoFormAdiForCov = 0;
   }
   // 1 = nuevo y 2 = editar || 1 = colaborador y 2 = médico covid
   whoCompletaForCov = who;

   // var funcionBasica = val;
   var checkRespuestaUnoSi = "", checkRespuestaUnoNo = "";
   var checkRespuestaDosSi = "", checkRespuestaDosNo = "";
   var checkRespuestaTresSi = "", checkRespuestaTresNo = "";

   // if(funcionBasica == 1){
   objFormularioCovid={
      id: 0,listSintomasId : "",
      respuestaUno: {id: ""},respuestaDos: {id: ""},
      respuestaTres: {id: ""},respuestaSintoma: {id: ""}};
    // }
    
   if(parseInt(getSession("gestopcompanyid")) == 588 ||
      parseInt(getSession("gestopcompanyid")) == 589){
      listSintoma = listSintoma.filter(function(val,index){
         if(val.id == 1 || val.id == 3 || val.id == 4 ||
            val.id == 5 || val.id == 6){
	    return true; 
	 }else{
	    return false;
	 }	
      });
   }else if(parseInt(getSession("gestopcompanyid")) == 646){
      listSintoma = listSintoma.filter(function(val,index){
         if(val.id == 1){
	    val.nombre = "Sensación de alza térmica, fiebre y malestar";
	 }else if(val.id == 3){
	    val.nombre = "Dificultad para respirar";
	 }else if(val.id == 4){
            val.nombre = "Tos y/o estornudo";
	 }else if(val.id == 6){
	    val.nombre = "Pérdida del olfato o pérdida del gusto";
	 }else if(val.id == 7){
            val.nombre = "Desorientación o confusión";
	 }else if(val.id == 8){
	    val.nombre = "Dolor abdomen";
	 }else if(val.id == 10){
	    val.nombre = "Coloración azul de los labios";
	 }else if(val.id == 11){
	    val.nombre = "Nauseas";
	 }
		 
         return true;
      }); 
   }else if(parseInt(getSession("gestopcompanyid")) == 648 || 
	    parseInt(getSession("gestopcompanyid")) == 649){ //LAP
      listSintoma = listSintoma.filter(function(val,index){
         if(val.id == 1){
            val.nombre = (parseInt(getSession("gestopcompanyid")) == 648?
        	          "Fiebre (T > 37.5°C)":"Fiebre (T > 37.8°C)");
         }else if(val.id == 7){
	    val.nombre = "Cansancio o fatiga";
         }
			 
         return true;
      });   
   }else if(parseInt(getSession("gestopcompanyid")) == 670){
      listSintoma = listSintoma.filter(function(val,index){ 
         if(val.id == 1 || val.id == 2 || val.id == 3 || val.id == 4 || val.id == 6 ||
            val.id == 12 || val.id == 13){
            return true; 
         }else{
	    return false;
         }	
      });
   }

   var selModalidadTrabajo = crearSelectOneMenu("selModalidadTrabajo","",
      listModalidadTrabajo,(objFormularioCovid.id > 0?objFormularioCovid.modalidadTrabajo.id
		                                     :"-1"),"id","nombre");

   // Orden del sí y no en el formulario.
   var listBooleanSiNo = listBoolean.sort(function(val,val2){
      return val2.id - val.id;
   });
    
   var radiosPregunta01 = crearRadiosAuto("radioPreguntaForCov1",listBooleanSiNo,
      objFormularioCovid.respuestaUno.id,"id","nombre","habilitarFechaConTraAsiVia");
   var radiosPregunta02 = crearRadiosAuto("radioPreguntaForCov2",listBooleanSiNo,
      objFormularioCovid.respuestaDos.id,"id","nombre","habilitarFechaConTraAsiVia");
   var radiosPregunta03 = crearRadiosAuto("radioPreguntaForCov3",listBooleanSiNo,
      objFormularioCovid.respuestaTres.id,"id","nombre","habilitarFechaConTraAsiVia");
   var radiosPregunta04 = crearRadiosAutoForCov("radioPreguntaForCov4",listSintoma,
      objFormularioCovid.listSintomasId,"id","nombre","checkbox","left");
   var radiosPreguntaSintoma = crearRadiosAuto("radioPreguntaForCovSintoma",listBooleanSiNo,
      objFormularioCovid.respuestaSintoma.id,"id","nombre","habilitarCheckBoxSintomas");
     
   var listItemsExam=[
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"1.- ¿Está experimentando algún malestar que afecte su salud? (no considerar síntomas de enfermedades " +
             "que padezca de forma crónica, por ejemplo, congestión nasal causada por alergias)",
       inputForm:radiosPreguntaSintoma+"<br><label style='float:right;color:blue;'>(obligatorio)</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"<p id='parrafoFormularioCovid2' align='justify'>" +
                "*En caso haya respondido Sí en la pregunta anterior, seleccionar el (los) síntoma(s) respectivo(s):" +
             "</p>",
       inputForm:"<span id='auxParrafoFormularioCovid2' style='float:right;color:blue;font-weight:bold;'></span>",divContainer:""},   
      {sugerencia:"",inputForm:radiosPregunta04,anchoLabel:"",anchoDiv:"",
       label:"",divContainer:"",fullRow:1,clase:"containerCheckbox"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<p id='parrafoFormularioCovid4' align='justify'>" +
                "*En caso haya respondido Sí en la pregunta #01, ingresar la fecha de inicio de síntoma(s). " +
             "</p>",
       inputForm:"<input type='date' id='inputFechaInicioSintomaForCov' class='form-control' " +
           		"max='"+getSession("fechaHoyOrdenInversoTexto")+"'>" +
                 "<br><span id='auxParrafoFormularioCovid4' style='float:right;color:blue;font-weight:bold;'></span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"*Si tiene algún otro síntoma, detallarlo",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       inputForm:"<input class='form-control' id='inputOtroSintomaForCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"*Si está tomando algún medicamento, detallarlo",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       inputForm:"<input class='form-control' id='inputMedicamentoForCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<p id='parrafoFormularioCovid7' align='justify'>"+preguntaDos+"</p>",
       inputForm:radiosPregunta01+"<br><label style='float:right;color:blue;'>(obligatorio)</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",clase:"campoPreguntaCentroMed-FormularioCovid",
       label:"<p id='parrafoFormularioCovid8' align='justify'>"+preguntaTres+"</p> " ,
       inputForm:radiosPregunta02+"<br><label style='float:right;color:blue;'>(obligatorio)</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoPreguntaCentroMed-FormularioCovid",
       label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",clase:"campoPreguntaViaje-FormularioCovid",
       label:"<p id='parrafoFormularioCovid9' align='justify'>"+preguntaCuatro+"</p>",
       inputForm:radiosPregunta03+"<br><label style='float:right;color:blue;'>(obligatorio)</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoPreguntaViaje-FormularioCovid",
       label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",clase:"campoPreguntaViajeDetalle-FormularioCovid",divContainer:"",
       label:"<p id='parrafoFormularioCovid10' align='justify'>" +
                "*En caso haya respondido Sí a la pregunta anterior, indicar los detalles del viaje." +
             "</p>",
       inputForm:"<textarea class='form-control' id='textDetalleViajeForCov' rows='3'></textarea>" +
    	            "<br><span id='auxParrafoFormularioCovid10' style='float:right;color:blue;font-weight:bold;'></span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"campoPreguntaViajeDetalle-FormularioCovid",
       label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<p id='parrafoFormularioCovid11' align='justify'>"+textoInputFechaAux+"</p>",
       inputForm:"<input type='date' id='inputFechaInicioContactoForCov' class='form-control' " +
           		"max='"+getSession("fechaHoyOrdenInversoTexto")+"'>" +
		 "<br><span id='auxParrafoFormularioCovid11' style='float:right;color:blue;font-weight:bold;'></span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<p id='parrafoFormularioCovid12' align='justify'>"+preguntaCinco+"</p>",
       inputForm:selModalidadTrabajo+"<label style='float:right;color:blue;'>(obligatorio)</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
	     "<span style='font-size:10px;font-weight:bolder;'>"+declaracionJurada+"</span>",inputForm:""},
//    {sugerencia:"",label:"",fullRow:1, inputForm:"Firma",divContainer:""},
//    {sugerencia:"",label:"",fullRow:1,
//     inputForm:"<canvas style='border: 1px solid black; width : 100%; height: 160px' id='canvasFirma'></canvas>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"",anchoLabel:"",anchoDiv:"",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
           	     (parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649?
           	      "<i aria-hidden='true' class='fa fa-arrow-right'></i> Siguiente":
           	      "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar") +
           	 "</button>"}
   ];
    
   var textFormExamen="";
 	
   listItemsExam.forEach(function(val,index){
      textFormExamen += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalRellenarFormularioCovid",
      nombre: "Registro formulario renovable - COVID-19 "+
         (parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649?"(Página 1 de 2)":""),
      contenido: "<form id='formRellenarFormularioCovid' class='eventoGeneral'>"+textFormExamen+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   if(parseInt(getSession("gestopcompanyid")) == 524 || parseInt(getSession("gestopcompanyid")) == 648 || 
      parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670){
      $(".campoPreguntaCentroMed-FormularioCovid").hide();$(".campoPreguntaViaje-FormularioCovid").hide();
      $(".campoPreguntaViajeDetalle-FormularioCovid").hide();
   }else if(parseInt(getSession("gestopcompanyid")) == 646){
      $(".campoPreguntaViaje-FormularioCovid").hide();$(".campoPreguntaViajeDetalle-FormularioCovid").hide();
   }
    
   var editarDiv = $("#formRellenarFormularioCovid");
 	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validacionPreviaFormularioCovid();
   });
     
   habilitarCheckBoxSintomas(0);
   habilitarFechaConTraAsiVia(0);
// initCanvas();
}

/*var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black",
y = 2;

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}
/*
 * var canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0,
 * dot_flag = false;
 * 
 * var x = "black", y = 2;
 * 
 * function draw() { ctx.beginPath(); ctx.moveTo(prevX, prevY);
 * ctx.lineTo(currX, currY); ctx.strokeStyle = x; ctx.lineWidth = y;
 * ctx.stroke(); ctx.closePath(); } function initCanvas() { canvas =
 * document.getElementById('canvasFirma'); ctx = canvas.getContext("2d");
 * 
 * 
 * canvas.addEventListener("mousemove", function (e) { findxy('move', e) },
 * false); canvas.addEventListener("mousedown", function (e) { findxy('down', e) },
 * false); canvas.addEventListener("mouseup", function (e) { findxy('up', e) },
 * false); canvas.addEventListener("mouseout", function (e) { findxy('out', e) },
 * false); } function findxy(res, e) { var eventDoc = (e.target &&
 * e.target.ownerDocument) || document; var doc = eventDoc.documentElement; var
 * body = eventDoc.body; e.pageX = e.clientX + (doc && doc.scrollLeft || body &&
 * body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft ||
 * 0); var canvasLeft = canvas.offsetLeft; var canvasTop= canvas.offsetTop;
 * canvasLeft = canvas.getBoundingClientRect().left+ window.pageXOffset;
 * canvasTop = canvas.getBoundingClientRect().top+ window.pageYOffset if (res ==
 * 'down') { prevX = currX; prevY = currY; currX = e.pageX/2 - canvasLeft/2;
 * currY = e.pageY - canvasTop;
 * 
 * flag = true; dot_flag = true; if (dot_flag) { ctx.beginPath(); ctx.fillStyle =
 * x; ctx.fillRect(currX, currY, 2, 2); ctx.closePath(); dot_flag = false; } }
 * if (res == 'up' || res == "out") { flag = false; } if (res == 'move') { if
 * (flag) { prevX = currX; prevY = currY; currX = e.pageX/2 - canvasLeft/2;
 * currY = e.pageY - canvasTop; draw(); } } }
 */

function habilitarCheckBoxSintomas(value) {
   if(value == true){
      // habilitamos
      listSintoma.forEach(function(val,index){
         document.getElementById(val.id + "radioPreguntaForCov4").disabled = false;
      });

      document.getElementById("inputFechaInicioSintomaForCov").disabled = false;
      document.querySelector('#auxParrafoFormularioCovid2').innerText = "(obligatorio)";
      document.querySelector('#auxParrafoFormularioCovid4').innerText = "(obligatorio)";
   }else{
      // deshabilitamos
      listSintoma.forEach(function(val,index){
         document.getElementById(val.id+"radioPreguntaForCov4").disabled = true;
         document.getElementById(val.id+"radioPreguntaForCov4").checked = false;
      });

      document.getElementById("inputFechaInicioSintomaForCov").disabled = true;
      document.getElementById("inputFechaInicioSintomaForCov").value = null;

      document.querySelector('#auxParrafoFormularioCovid2').innerText = "";
      document.querySelector('#auxParrafoFormularioCovid4').innerText = "";

      document.getElementById('parrafoFormularioCovid2').style.background = "#FFFFFF";
      document.getElementById('parrafoFormularioCovid4').style.background = "#FFFFFF";
   }
}

function habilitarFechaConTraAsiVia(value) {
   var textDiv = "#formRellenarFormularioCovid";
    
   var formDiv=$(textDiv);
    
   var radioValUno = formDiv.find("input[name='radioPreguntaForCov1']:checked").val();
   var radioValDos = formDiv.find("input[name='radioPreguntaForCov2']:checked").val();
   var radioValTres = formDiv.find("input[name='radioPreguntaForCov3']:checked").val();
    
   if((radioValUno == 1 || radioValDos == 1 || radioValTres == 1) && value != 2){
      // habilitamos
      document.getElementById("inputFechaInicioContactoForCov").disabled=false;
        
      document.querySelector('#auxParrafoFormularioCovid11').innerText = "(obligatorio)";
   }else{
      // deshabilitamos
      document.getElementById("inputFechaInicioContactoForCov").disabled=true;
      document.getElementById("inputFechaInicioContactoForCov").value=null;
       
      document.querySelector('#auxParrafoFormularioCovid11').innerText = "";
       
      document.getElementById('parrafoFormularioCovid11').style.background = "#FFFFFF";
   }
  
   habilitarDetalleViaje(radioValTres);
}

function habilitarDetalleViaje(radioValTres){
   if(radioValTres == 1){
      // habilitamos
      document.getElementById("textDetalleViajeForCov").disabled = false;
	       
      document.querySelector('#auxParrafoFormularioCovid10').innerText = "(obligatorio)";
   }else{
      // deshabilitamos
      document.getElementById("textDetalleViajeForCov").disabled = true;
      document.getElementById("textDetalleViajeForCov").value = "";
	       
      document.querySelector('#auxParrafoFormularioCovid10').innerText = "";	
      document.getElementById('parrafoFormularioCovid10').style.background = "#FFFFFF";
   }
}

var radioValueUno,radioValueDos,radioValueTres,textDetalleViaje,inputFechaInicioContacto,
    valListModalidadTrabajo,listSintomasId,otroSintoma,inputFechaInicioSintoma,
    detalleMedicamento,tipoMensajeCovid;

function validacionPreviaFormularioCovid(){
   var textDiv = "#formRellenarFormularioCovid";

   var formDiv = $(textDiv);

   var campoVacio = true;
     
   radioValueUno = formDiv.find("input[name='radioPreguntaForCov1']:checked").val();
   resaltarCampoObligatorio(7,radioValueUno,1);
   
   radioValueDos = (parseInt(getSession("gestopcompanyid")) == 524 || parseInt(getSession("gestopcompanyid")) == 648 || 
      parseInt(getSession("gestopcompanyid")) == 649 || parseInt(getSession("gestopcompanyid")) == 670?0:
      formDiv.find("input[name='radioPreguntaForCov2']:checked").val());
   resaltarCampoObligatorio(8,radioValueDos,1);
   
   radioValueTres = (parseInt(getSession("gestopcompanyid")) == 646 || parseInt(getSession("gestopcompanyid")) == 524 || 
      parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649 || 
      parseInt(getSession("gestopcompanyid")) == 670?0:
      formDiv.find("input[name='radioPreguntaForCov3']:checked").val());
   resaltarCampoObligatorio(9,radioValueTres,1);
   
   textDetalleViaje = $("#textDetalleViajeForCov").val();
    
   if(radioValueTres == 1){
      resaltarCampoObligatorio(10,textDetalleViaje,1);
   }
     
   if(radioValueTres == 1 && textDetalleViaje.length == 0){
      campoVacio = false;
   }
     
   //var radioValueCuatro = formDiv.find("input[name='radioPreguntaForCov4']:checked").val();
   valListModalidadTrabajo = parseInt(formDiv.find("#selModalidadTrabajo").val());
   resaltarCampoObligatorio(12,valListModalidadTrabajo,2);
     
   if(radioValueUno == null ||  radioValueDos == null || radioValueTres == null || 
      valListModalidadTrabajo == '-1'){
      campoVacio = false;
   }

   otroSintoma = formDiv.find("#inputOtroSintomaForCov").val();
   detalleMedicamento = formDiv.find("#inputMedicamentoForCov").val();

   listSintomasId = [];

   listSintoma.forEach(function(val,index){
      if(($("#"+val.id+"radioPreguntaForCov4").prop("checked")?1:0) == 1){
         listSintomasId.push({
 	    id: parseInt(val.id)
         });
      }
   });

   var radioValueSintoma = formDiv.find("input[name='radioPreguntaForCovSintoma']:checked").val();
   resaltarCampoObligatorio(2,radioValueSintoma,3,listSintomasId);

   var fechaInicioSintoma = convertirFechaTexto($("#inputFechaInicioSintomaForCov").val());

   if(!fechaInicioSintoma){
      inputFechaInicioSintoma = null;
   }else{
      inputFechaInicioSintoma = fechaInicioSintoma;
   }
     
   if(radioValueSintoma == 1){
      resaltarCampoObligatorio(4,inputFechaInicioSintoma,1);
   }
 	   	
   if(radioValueSintoma == 1 && (listSintomasId.length == 0 || inputFechaInicioSintoma == null)){
      campoVacio = false;
   }

   var fechaInicioContacto = convertirFechaTexto($("#inputFechaInicioContactoForCov").val());
    
   if(!fechaInicioContacto){  
      inputFechaInicioContacto = null;
   }else{
      inputFechaInicioContacto = fechaInicioContacto;
   }
    
   if(radioValueUno == 1 || radioValueDos == 1 || radioValueTres == 1){
      resaltarCampoObligatorio(11,fechaInicioContacto,1);
   }
    
   if((radioValueUno == 1 || radioValueDos == 1 || radioValueTres == 1) && inputFechaInicioContacto==null){
       campoVacio = false;
   }
     
   if(campoVacio){
      if(parseInt(getSession("gestopcompanyid")) == 648 || parseInt(getSession("gestopcompanyid")) == 649){
	 $("#modalRellenarFormularioCovid").modal("hide");
	  
	 mensajeUx="<label>¿Requiere registrar prueba descarte COVID por viaje o ingreso a central?</label>";
         mensajesUx(mensajeUx,9,"","ConfirmRegPruebaCovid");

         $("#btnDevolverValorConfirmRegPruebaCovid").on("click",function(){
            validarCreacionFormAdiFormularioCovid();
         });
      
         $("#btnRegresarPrevioConfirmRegPruebaCovid").on("click",function(){
            guardarFormularioCovid();
         });  
      }else{
         guardarFormularioCovid();  
      }
   }else{
      $("#modalRellenarFormularioCovid").modal("hide");
 	
      mensajeUx = "<label>Debe ingresar la información respectiva en los campos obligatorios.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposForCov");

      $("#modalMensajeUxAvisoCompletarCamposForCov").on("hidden.bs.modal",function(){
         $("#modalRellenarFormularioCovid").modal("show");
      });
   }
}

var segundoFormAdiForCov;

function validarCreacionFormAdiFormularioCovid(){
   if(segundoFormAdiForCov == 0){
      segundoFormAdiForCov = 1;
      registroPruebaCovidFormAdiPruebaCovid();
   }else{
      $("#modalRellenarFormularioCovid").modal("hide");
      $("#modalFormCovidFormAdicionalPruebaCovid").modal("show");
   }
}

function guardarFormularioCovid(){
   tipoMensajeCovid = obtenerTipoMensajeTrabajo(radioValueUno,radioValueDos,radioValueTres,listSintomasId,-1); 
    
   var dataParam={
      id: objFormularioCovid.id,
      respuestaUno: {id: radioValueUno},
      respuestaDos: {id: radioValueDos},
      respuestaTres: {id: radioValueTres},
      detalleViaje: textDetalleViaje,
      fechaInicioContacto: inputFechaInicioContacto,
      modalidadTrabajo: {id: valListModalidadTrabajo},
      listSintomas: listSintomasId,
      otroSintoma: otroSintoma,
      fechaInicioSintoma: inputFechaInicioSintoma,
      medicamento: detalleMedicamento,
      resultadoPruebaCovid: {id: null},
      trabajadorId: (whoCompletaForCov == 1 ?getSession("trabajadorGosstId"):registroTrabajadorIdVistaMedCov),
      empresaId: getSession("gestopcompanyid")
   };

   callAjaxPost(URL+'/covid/formulario_covid/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	         /*   var dataURL = canvas.toDataURL();
 	           var blobBin = atob(dataURL.split(',')[1]);
 	          var array = [];
 	          for(var i = 0; i < blobBin.length; i++) {
 	              array.push(blobBin.charCodeAt(i));
 	          }
 	          var file=new Blob([new Uint8Array(array)], {type: 'image/png'});


 	          var formdata = new FormData();
 	         formdata.append("id", data.nuevoId);
 	          formdata.append("fileEvi", file);
 	          $.ajax({
 	             url: URL+"/covid/formulario_covid/firma/save",
 	             type: "POST",
 	             data: formdata,
 	             processData: false,
 	             contentType: false,
 	          }).before(function(data){
 	             $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
 	          }).done(function(respond){
 	             $("#modalRellenarFormularioCovid").remove();
  		    
  		    mensajeUx="<label>El formulario fue registrado con éxito.</label>";
  		    mensajesUx(mensajeUx,1,"","ActualizarVistaForCov");
  		    
  		    if(whoCompletaForCov == 1){
  		       $("#btnDevolverValorActualizarVistaForCov").on("click",function(){
  		          //$("#modalMensajeUxCompletarObligatorio").modal("hide");
  		          //$("#modalMensajeUxCompletarObligatorio").remove();
  		          mostrarMensajeResultadoFormularioCovid(tipoMensajeCovid,0);
  		          habilitarFormularioCovid();   
  		       });
  		    
  		       $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
  		          //$("#modalMensajeUxCompletarObligatorio").modal("hide");
   		          //$("#modalMensajeUxCompletarObligatorio").remove();
  		          mostrarMensajeResultadoFormularioCovid(tipoMensajeCovid,0);
   		          habilitarFormularioCovid();     
  		       });
  		    }else{
  	               $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
  	        	  verLateralesFijosMedicoCovid();
  	                  numModificaciones++;
  	                  habilitarTrabajadoresMedicoCovid(estadoEspecificoCovidGlobalId);
  	               });
  		    }
 	          });
 	          */
 	    $("#modalRellenarFormularioCovid").remove();
		    
 	    mensajeUx="<label>El formulario fue registrado con éxito.</label>";
 	    mensajesUx(mensajeUx,1,"","ActualizarVistaForCov");
		    
 	    if(whoCompletaForCov == 1){
	       $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
	          mostrarMensajeResultadoFormularioCovidVersionDos(tipoMensajeCovid,0,valListModalidadTrabajo);
		  habilitarFormularioCovid();     
	       });
 	    }else{
	       $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
	          numModificaciones++;
	          verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);
	       });
 	    }
      }
   });
}

function regresarFormCovidPrincipalDesdeFormAduPruCov(){
   $("#modalFormCovidFormAdicionalPruebaCovid").modal("hide");
   $("#modalRellenarFormularioCovid").modal("show");
}

function registroPruebaCovidFormAdiPruebaCovid(){
   var userAgent = isMobile.any();
   
   var selTipoPruebaCovidAux = crearSelectOneMenu("selTipoPruebaCovidAux","",
      listTipoPruebaCovidAux,"-1","id","nombre");
    
   var selResultadoPruebaCovidAux = crearSelectOneMenu("selResultadoPruebaCovidAux","",
      listResultadoPruebaCovidAux,"-1","id","nombre");
    
   var listItemsRegistroAux=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Tipo de prueba COVID-19:",
       inputForm:selTipoPruebaCovidAux +
                 "<label style='float:right;color:blue;'>(obligatorio)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Fecha de la prueba "+(userAgent == true?"":"<br>")+"COVID-19:",
       inputForm:"<input type='date' class='form-control' id='inputPruebaCovidForCov' " +
                        "min='"+sumaFechaDias(-2,getSession("fechaHoyOrdenInversoTexto"))+"' " +
       		        "max='"+getSession("fechaHoyOrdenInversoTexto")+"'>" +
                 "<label style='float:right;color:blue;'>(obligatorio)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Resultado de la prueba COVID-19:",
       inputForm:selResultadoPruebaCovidAux +
                 "<label style='float:right;color:blue;'>(obligatorio)</label>"},
//      {sugerencia:"",anchoLabel:"",anchoDiv:"",
//       label:"Fecha del resultado "+(userAgent == true?"":"<br>")+"de la prueba COVID-19:",
//       inputForm:"<input type='date' class='form-control' id='inputFechaResultadoPruebaCovidForCov'>" +
//                 "<label style='float:right;color:blue;'>(obligatorio)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Evidencia - "+(userAgent == true?"":"<br>") +"Resultado de la prueba COVID-19:",
       inputForm:"",divContainer:"divEvidenciaFormAdiPruCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-success' style='font-size:18px;' type='button' " +
	             "onclick='regresarFormCovidPrincipalDesdeFormAduPruCov()'>" +
	        "<i class='fa fa-arrow-left'></i> Regresar" +
	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
	            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
  
   var textFormRegistroAux = "";
	
   listItemsRegistroAux.forEach(function(val){
      textFormRegistroAux += obtenerSubPanelModuloVersionDos(val);
   });
	
   var opciones={
      id: "modalFormCovidFormAdicionalPruebaCovid",
      nombre: "Registro formulario renovable - COVID-19 (Página 2 de 2)",
      contenido: "<form id='formRegistroPruCovFormAdiPruCov' class='eventoGeneral'>"+textFormRegistroAux+"</form>"
   };
  
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   $("#inputPruebaCovidForCov").val(getSession("fechaHoyOrdenInversoTexto"));
 	
   var options={
      container: "#divEvidenciaFormAdiPruCov",
      functionCall: function(){},
      descargaUrl: "",
      esNuevo: true,
      idAux: "FormAdiPruCov",
      evidenciaNombre: "",
      mensajeAux: "<label style='color:blue;'>(obligatorio)</label>"
   };

   crearFormEvidenciaCompleta(options);
 
   var editarDiv = $("#formRegistroPruCovFormAdiPruCov");
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarFormularioCovidFormAdiPruebaCovid();
   });    
}

function guardarFormularioCovidFormAdiPruebaCovid(){
   var formDiv = $("#formRegistroPruCovFormAdiPruCov");
   var campoVacio = true; 
   
   var tipoPruebaCovidId = parseInt(formDiv.find("#selTipoPruebaCovidAux").val());
   
   var fechaPruebaCovid = convertirFechaTexto($("#inputPruebaCovidForCov").val());
   var inputFechaPruebaCovid = (!fechaPruebaCovid?null:fechaPruebaCovid);
   
   var resultadoPruebaCovidId = parseInt(formDiv.find("#selResultadoPruebaCovidAux").val());
   
//   var fechaResultadoPruebaCovid = convertirFechaTexto($("#inputFechaResultadoPruebaCovidForCov").val());
//   var inputFechaResultadoPruebaCovid = (!fechaResultadoPruebaCovid?null:fechaResultadoPruebaCovid);
   
   var evidenciaNombre = $("#inputEviFormAdiPruCov").val();
   
   if(tipoPruebaCovidId == -1 || inputFechaPruebaCovid == null || resultadoPruebaCovidId == -1 ||
      evidenciaNombre.length == 0){
      campoVacio = false;  
   }
   
   if(campoVacio){
      tipoMensajeCovid = obtenerTipoMensajeTrabajo(radioValueUno,radioValueDos,radioValueTres,listSintomasId,resultadoPruebaCovidId);
       
      var dataParam={
         id: objFormularioCovid.id,
         respuestaUno: {id: radioValueUno},
         respuestaDos: {id: radioValueDos},
         respuestaTres: {id: radioValueTres},
         detalleViaje: textDetalleViaje,
         fechaInicioContacto: inputFechaInicioContacto,
         modalidadTrabajo: {id: valListModalidadTrabajo},
         listSintomas: listSintomasId,
         otroSintoma: otroSintoma,
         fechaInicioSintoma: inputFechaInicioSintoma,
         medicamento: detalleMedicamento,
         tipoPruebaCovid: {id: tipoPruebaCovidId},
         fechaPruebaCovid: inputFechaPruebaCovid,
         resultadoPruebaCovid: {id: resultadoPruebaCovidId},
//         fechaResultadoPruebaCovid: inputFechaResultadoPruebaCovid,
         trabajadorId: (whoCompletaForCov == 1?getSession("trabajadorGosstId"):registroTrabajadorIdVistaMedCov),
         empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/covid/formulario_covid/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               guardarEvidenciaAuto(data.nuevoId,"fileEviFormAdiPruCov",bitsMega*15,
               "/covid/formulario_covid/prueba_covid/evidencia/save",function(){
  	          $("#modalFormCovidFormAdicionalPruebaCovid").modal("hide");
 		    
  	          mensajeUx="<label>El formulario fue registrado con éxito.</label>";
  	          mensajesUx(mensajeUx,1,"","ActualizarVistaForCov");
 		    
  	          if(whoCompletaForCov == 1){
 	             $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
 	                mostrarMensajeResultadoFormularioCovidVersionDos(tipoMensajeCovid,0,valListModalidadTrabajo);
 	                habilitarFormularioCovid();     
 	             });
  	          }else{
 	             $("#modalMensajeUxActualizarVistaForCov").on("hidden.bs.modal",function(){
 	                numModificaciones++;
 	                verLateralesFijosMedicoCovid(habilitarTrabajadoresMedicoCovid);
 	             });
  	          }
               }); 
  	    
               break;
	   
            default:
               alert("Ocurrió un error al guardar!");
         }
      });
   }else{
      $("#modalFormCovidFormAdicionalPruebaCovid").modal("hide");
  	
      mensajeUx="<label>Debe ingresar la información respectiva en los campos obligatorios.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposFormAdiForCov");

      $("#modalMensajeUxAvisoCompletarCamposFormAdiForCov").on("hidden.bs.modal",function(){
         $("#modalFormCovidFormAdicionalPruebaCovid").modal("show");
      });
   }
}

function obtenerTipoMensajeTrabajo(radioValueUno,radioValueDos,radioValueTres,listSintomasId,resultadoPruebaCovidId){
   var tipo;
    
   if(radioValueUno == 0 && radioValueDos == 0 && radioValueTres == 0 && listSintomasId.length == 0 &&
      resultadoPruebaCovidId != 6){
      if(hasFactorRiesgo == "No" || hasConstanciaTrabajo == 1) {
         tipo = 1; //HABILITADO
      }else{
 	 tipo = 3; //GRUPO DE RIESGO
      }
   }else{
      if(hasSeguimientoMedicoHoy == 1 && hasPaseTrabajoHabilitadoMedico == 1) {
	 if(hasFactorRiesgo == "No" || hasConstanciaTrabajo == 1) {
	    tipo = 1; //HABILITADO
	 }else{
	    tipo = 3; //GRUPO DE RIESGO
	 }
      }else{
	 tipo = 2;
      }
   }
   
   return tipo;
}

function resaltarCampoObligatorio(num,valorCampo,tipo,valorList){
   var idParrafo = "parrafoFormularioCovid"+num;
   
   if(tipo == 1){
      if(valorCampo == null || valorCampo == ""){
	  document.getElementById(idParrafo).style.background = "#FFFF00";
      }else{
	  document.getElementById(idParrafo).style.background = "#FFFFFF";
      }
   }else if(tipo == 2){
      if(valorCampo == -1){
	  document.getElementById(idParrafo).style.background = "#FFFF00";
      }else{
	  document.getElementById(idParrafo).style.background = "#FFFFFF";
      }
   }else if(tipo == 3){
      if(valorCampo == 1){    
         if(valorList.length == 0){
            document.getElementById(idParrafo).style.background = "#FFFF00";
         }else{ 
	    document.getElementById(idParrafo).style.background = "#FFFFFF";
	}
    } else if (tipo == 3) {
	if (valorCampo == 1) {
	    if (valorList.length == 0) {
		document.getElementById(idParrafo).style.background = "#FFFF00";
	    } else {
		document.getElementById(idParrafo).style.background = "#FFFFFF";
	    }
	}
    }
}
}

function mostrarMensajeResultadoFormularioCovidVersionDos(tipoMensajeCovid,fechaDisponible,valModTrabajo){
   //fechaDisponible -> 0=nuevo, editar , 1= pase de trabajo     
   if(tipoMensajeCovid == 1){
      var imagenPrimeraDosis,imagenSegundaDosis,imagenTerceraDosis,imagenCuartaDosis;
      var hasAlerta,hasCarneVacunacion,mensajeAlerta;
   
      if(numDosisVacunaCovid == 4){
         if(hasSegundaDosisVacunaCovid == 1){
	    if(hasTerceraDosisVacunaCovid == 1){
	       if(hasCuartaDosisVacunaCovid == 1){
		  imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
		  imagenSegundaDosis = "fa-syringe-relleno-verde.png";
		  imagenTerceraDosis = "fa-syringe-relleno-verde.png";
		  imagenCuartaDosis = "fa-syringe-relleno-verde.png";   
		  mensajeAlerta = 
		     (isNecesarioActCarVacCov == 1?
	              "Se le informa que debe actualizar el registro de su carné de vacunación.":
		      (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:""));
		  hasAlerta = (isNecesarioActCarVacCov == 1?1:0);
		  hasCarneVacunacion = 1;
	       }else{
		  imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
		  imagenSegundaDosis = "fa-syringe-relleno-verde.png";
		  imagenTerceraDosis = "fa-syringe-relleno-verde.png";
		  imagenCuartaDosis = (hasDiferenciaDiasTerceraDosis >= intervaloTerceraDosisForCov && 
			               edad > edadTerceraDosisForCov?"fa-syringe-relleno-amarillo.png":"fa-syringe.png");
		  mensajeAlerta = 
		     (hasDiferenciaDiasTerceraDosis >= intervaloTerceraDosisForCov && 
		      edad > edadTerceraDosisForCov?
		      "Se le informa que han pasado "+intervaloTerceraDosisForCov+" días o más desde su tercera dosis.":
		      (isNecesarioActCarVacCov == 1?
		       "Se le informa que debe actualizar el registro de su carné de vacunación.":
		       (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:"")));
		  hasAlerta = (hasDiferenciaDiasTerceraDosis >= intervaloTerceraDosisForCov && 
			       edad > edadTerceraDosisForCov?1:(isNecesarioActCarVacCov == 1?1:0));
		  hasCarneVacunacion = (hasDiferenciaDiasTerceraDosis < intervaloTerceraDosisForCov ||
			                edad <= edadTerceraDosisForCov?1:0);
	       }
	    }else{
	       imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
	       imagenSegundaDosis = "fa-syringe-relleno-verde.png";
	       imagenTerceraDosis = (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov?
			             "fa-syringe-relleno-amarillo.png":"fa-syringe.png");
	       imagenCuartaDosis = "fa-syringe.png";  
	       mensajeAlerta = 
	          (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov?
		   "Se le informa que han pasado "+intervaloSegundaDosisForCov+" días o más desde su segunda dosis.":
		   (isNecesarioActCarVacCov == 1?
		    "Se le informa que debe actualizar el registro de su carné de vacunación.":
		    (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:"")));
	       hasAlerta = (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov?1:(isNecesarioActCarVacCov == 1?1:0));
	       hasCarneVacunacion = (hasDiferenciaDiasSegundaDosis < intervaloSegundaDosisForCov?1:0);
	    }	
         }else{
	    imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
	    imagenSegundaDosis = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?
		                  "fa-syringe-relleno-amarillo.png":"fa-syringe.png");
	    imagenTerceraDosis = "fa-syringe.png";
	    imagenCuartaDosis = "fa-syringe.png";  
	    mensajeAlerta = 
	       (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?
	        "Se le informa que han pasado "+intervaloPrimeraDosisForCov+" días o más desde su primera dosis.":
	        (isNecesarioActCarVacCov == 1?
	         "Se le informa que debe actualizar el registro de su carné de vacunación.":
	         (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:"")));
	    hasAlerta = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?1:(isNecesarioActCarVacCov == 1?1:0));
	    hasCarneVacunacion = (hasDiferenciaDiasPrimeraDosis < intervaloPrimeraDosisForCov?1:0);
         }
      }else if(numDosisVacunaCovid == 3){
         if(hasSegundaDosisVacunaCovid == 1){
            if(hasTerceraDosisVacunaCovid == 1){
  	       imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
  	       imagenSegundaDosis = "fa-syringe-relleno-verde.png";
  	       imagenTerceraDosis = "fa-syringe-relleno-verde.png";
  	       imagenCuartaDosis = "fa-syringe-relleno-verde.png";
  	       mensajeAlerta = 
  	          (isNecesarioActCarVacCov == 1?
  		   "Se le informa que debe actualizar el registro de su carné de vacunación.":
  		   (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:""));
  	       hasAlerta = (isNecesarioActCarVacCov == 1?1:0);
  	       hasCarneVacunacion = 1;
            }else{
  	       imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
  	       imagenSegundaDosis = "fa-syringe-relleno-verde.png";
  	       imagenTerceraDosis = "fa-syringe-relleno-verde.png";
  	       imagenCuartaDosis = (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov && 
  			            edad > edadSegundaDosisForCov?"fa-syringe-relleno-amarillo.png":"fa-syringe.png");
  	       mensajeAlerta = 
  	          (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov && edad > edadSegundaDosisForCov?
  		   "Se le informa que han pasado "+intervaloSegundaDosisForCov+" días o más desde su segunda dosis.":
  		   (isNecesarioActCarVacCov == 1?
  		    "Se le informa que debe actualizar el registro de su carné de vacunación.":
  		    (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:"")));
  	       hasAlerta = (hasDiferenciaDiasSegundaDosis >= intervaloSegundaDosisForCov && 
  			    edad > edadSegundaDosisForCov?1:(isNecesarioActCarVacCov == 1?1:0));
  	       hasCarneVacunacion = (hasDiferenciaDiasSegundaDosis < intervaloSegundaDosisForCov ||
  			             edad <= edadSegundaDosisForCov?1:0);
            }	
         }else{
  	    imagenPrimeraDosis = "fa-syringe-relleno-verde.png";
  	    imagenSegundaDosis = "fa-syringe-relleno-verde.png";
  	    imagenTerceraDosis = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?
  		                  "fa-syringe-relleno-amarillo.png":"fa-syringe.png");
  	    imagenCuartaDosis = "fa-syringe.png";  
  	    mensajeAlerta = 
               (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?
  	        "Se le informa que han pasado "+intervaloPrimeraDosisForCov+" días o más desde su primera dosis.":
  	        (isNecesarioActCarVacCov == 1?
  	         "Se le informa que debe actualizar el registro de su carné de vacunación.":
  	         (hasEstadoEvalCarneVacunaCovid == 1?"Carné de vacunación aprobado por "+hasRespEvalCarneVacunaCovid:"")));
  	    hasAlerta = (hasDiferenciaDiasPrimeraDosis >= intervaloPrimeraDosisForCov?1:(isNecesarioActCarVacCov == 1?1:0));
  	    hasCarneVacunacion = (hasDiferenciaDiasPrimeraDosis < intervaloPrimeraDosisForCov?1:0);
         }
      }else{
         imagenPrimeraDosis = "fa-syringe-relleno-amarillo.png";
         imagenSegundaDosis = "fa-syringe.png";
         imagenTerceraDosis = "fa-syringe.png";
         imagenCuartaDosis = "fa-syringe.png";
         mensajeAlerta = "Está pendiente el registro de la(s) vacuna(s) COVID-19";
         hasAlerta = 1;
         hasCarneVacunacion = 0; 
      }
      
      encabezadoUx = 
         "<label style='float:right;'>"+
            "<img src='../imagenes/iconos/"+imagenPrimeraDosis+"' width='50px' height='50px'>"+
            "<img src='../imagenes/iconos/"+imagenSegundaDosis+"' width='50px' height='50px'>" +
            "<img src='../imagenes/iconos/"+imagenTerceraDosis+"' width='50px' height='50px'>" +
            "<img src='../imagenes/iconos/"+imagenCuartaDosis+"' width='50px' height='50px'>" +
            (hasCarneVacunacion == 1?"<img src='../imagenes/iconos/fa-carne-vacunacion.png' width='65px' height='50px'>":"") +
            (hasAlerta == 1?"<img src='../imagenes/iconos/fa-exclamacion-con-asterisco.png' width='35px' height='50px'>":"") +
         "</label>";
       
      tituloUx = 
         "<label style='color:blue;font-size:18px;font-weight:bolder;float:right;'>Fecha: "+
         (fechaDisponible == 0 || (hasSeguimientoMedicoHoy == 1 && hasPaseTrabajoHabilitadoMedico == 1)?
	  getSession("fechaHoyTexto"):
           (fechaDisponible == 1?objFormularioCovid.soloFechaActualizacionTexto:fechaUltimoPaseTrabajo))+
         (parseInt(getSession("gestopcompanyid")) == 616?"":"<br>"+"Modalidad de trabajo: "+(valModTrabajo == 1?"Remoto":"Presencial"))+
         "</label>" +
         "<br><br><br><br><label style='color:blue;float:left;'>"+getSession("gestopusername")+", </label>";
      
      if(parseInt(getSession("gestopcompanyid")) == 524){
	 mensajeUx = 
	    "<label style='color:blue'>" +
	       "Gracias por el reporte. Puedes ingresar a tu unidad / oficina." +
	    "</label> "+
	    "<br><br>" +
	    "<label style='color:blue'>" +
	       "Recuerda que el formulario se rellena diariamente, y antes de ir a tu unidad / oficina, " +
	       "ya que nos permite saber tu estado de salud actual." +
	    "</label> "+
	    "<br><br>" +
	    "<label style='color:red'>" +
	       "Continúe con el uso de doble mascarilla, distanciamiento social de al menos 1 metro y lavado de " +
	       "manos frecuente por al menos 20 segundos." +
            "</label>";
      }else if(parseInt(getSession("gestopcompanyid")) == 616){
	 mensajeUx = 
	    "<label style='color:blue'>" +
               "Usted está habilitado(a) para ingresar a las instalaciones el día de hoy, dado " +
	       "que no presenta sintomatología de COVID-19." +
	    "</label> "+
            "<br><br>" +
	    "<label style='color:red'>" +
               "Continúe con su lavado de manos, evitar sitios concurridos, mantener el distanciamiento social " +
               "mínimo de 1.5 metros, utilizar doble mascarilla y protector facial durante toda la jornada de " +
               "estudio y llenar esta declaración jurada de forma DIARIA." +
	    "</label>";
      }else if(parseInt(getSession("gestopcompanyid")) == 647){
	 mensajeUx = 
	    "<label style='color:blue'>" +
                (valModTrabajo == 1?
		 "gracias por su reporte.":
		 "usted está habilitado(a) para ingresar a las instalaciones el día de hoy dado " +
		 "que no presenta sintomatología de COVID-19.") +
	    "</label> "+
	    "<br><br>" +
	    "<label style='color:red'>" +
	       "Continúe con su lavado de manos, evitar sitios concurridos, mantener el distanciamiento " +
	       "social mínimo de 1.5 metros, utilizar mascarilla y protector facial (cuando se requiera) " +
	       "durante toda la jornada de trabajo y llenar esta encuesta de forma DIARIA."
	    "</label>";
      }else if(parseInt(getSession("gestopcompanyid")) == 648 || 
	       parseInt(getSession("gestopcompanyid")) == 649){
         mensajeUx = 
	    "<label style='color:blue'>" +
	        (valModTrabajo == 1?
		 "gracias por su reporte.":
                 "Usted está habilitado(a) para ingresar a las instalaciones a partir del día de hoy hasta " +
                 "lo que perdure la burbuja social, dado que no presenta sintomatología de COVID-19 y/o tiene " +
                 "prueba COVID negativa.") +
	    "</label> "+
	    "<br><br>" +
            "<label style='color:red'>" +
	       "Continúe con las medidas preventivas: uso adecuado de la mascarilla, lavado de manos, " +
	       "mantener ambientes ventilados y/o distanciamiento físico y reporte inmediato en caso de " +
	       "inicio de síntomas asociados a COVID." +
	    "</label>";
      }else{
         mensajeUx = 
            "<label style='color:blue'>" +
	        (valModTrabajo == 1?
	         "gracias por su reporte.":
	         "usted está habilitado(a) para ingresar a las instalaciones el día de hoy dado " +
	         "que no presenta sintomatología de COVID-19.") +
            "</label> "+
            "<br><br>" +
            "<label style='color:red'>" +
	       "Continúe con su lavado de manos, evitar sitios concurridos, mantener el distanciamiento " +
	       "social mínimo de 1.5 metros y llenar esta encuesta de forma DIARIA." +
	    "</label>";
      }
      
      piePaginaUx = mensajeAlerta;
	          
      mensajesUxVersionDos(1,encabezadoUx,tituloUx,mensajeUx,piePaginaUx,"fa-thumbs-up","color:green","","");
   }else if(tipoMensajeCovid == 2){
      encabezadoUx = "<label style='color:blue;float:right;'>Fecha: "+getSession("fechaHoyTexto")+"</label>";
       
      tituloUx = "<label style='color:black'>"+getSession("gestopusername")+", </label>";
       
      mensajeUx = "<label>"+mensajeFinalFormulario+"</label>";
      
      mensajeUx = mensajeUx.replace(/&salto&/gi,"<br><br>");
      
      piePaginaUx = "";

      mensajesUxVersionDos(1,encabezadoUx,tituloUx,mensajeUx,piePaginaUx,"fa-hand-paper-o","color:red","","");   
   }else if(tipoMensajeCovid == 3){
      encabezadoUx = "<label style='color:blue;float:right;'>Fecha: "+getSession("fechaHoyTexto")+"</label>";
       
      tituloUx = "<label style='color:black'>"+getSession("gestopusername")+", </label>";
       
      if(parseInt(getSession("gestopcompanyid")) == 524){
	 mensajeUx=
	    "<label>" +
	       "Usted no presenta síntomas, sin embargo está considerado(a) dentro del " +
	       "<span style='color:red;font-weight:bolder;'>grupo de factor de riesgo</span>, " +
	       "por lo que <span style='color:red;font-weight:bolder;'>NO</span> puede asistir " +
	       "a su unidad / oficina el día de hoy ("+getSession("fechaHoyTexto")+")." +
	    "</label>"+
            "<br><br>" +
            "<label style='color:red'>" +
               "Continúe con el uso de doble mascarilla, distanciamiento social de al menos 1 metro y lavado de " +
	       "manos frecuente por al menos 20 segundos." +
            "</label>";  
      }else if(parseInt(getSession("gestopcompanyid")) == 616){
	 mensajeUx = 
            "<label>" +
	       "Usted no presenta síntomas, sin embargo, está considerado(a) dentro del grupo de factor de riesgo, " +
	       "por lo que <span style='color:red;font-weight:bolder;'>NO puede asistir a la universidad.</span>" +
	    "</label> "+
	    "<br><br>" +
	    "<label>" +
	       "Por favor, comunicarse con Servicios Médicos de la Universidad, para el seguimiento respectivo de su caso, " +
	       "por medio de los siguientes canales de comunicación:" +
	    "</label>" +
	    "<br><br>" +
	       "<label>*Whatsapp: 943 508 297 / 960 274 416 / 994 612 473</label>" +
	    "<br>" +
	       "<label>*Correo:  servicios.medicos@uwiener.edu.pe</label>" +
	    "<br><br>" +
            "<label style='color:red'>" +
               "Continúe con su lavado de manos, evitar sitios concurridos y utilizar mascarilla." +
            "</label>";
      }else{
         mensajeUx=
            "<label>" +
               "Usted no presenta síntomas, sin embargo está considerado(a) dentro del " +
               "<span style='color:red;font-weight:bolder;'>grupo de factor de riesgo</span>, " +
               "por lo que <span style='color:red;font-weight:bolder;'>NO</span> puede asistir " +
               "al centro laboral el día de hoy ("+obtenerFechaActualNormal()+")." +
            "</label>"+
            "<br><br>" +
            "<label style='color:red'>" +
               "Continúe con su lavado de manos, evitar sitios concurridos y utilizar " +
               "mascarilla." +
            "</label>";
      }
      
      piePaginaUx = "";
      
      mensajesUxVersionDos(1,encabezadoUx,tituloUx,mensajeUx,piePaginaUx,"fa-hand-paper-o","color:red","","");
   }
}

function verPaseTrabajoCovid(){
   var valModTrabajo = objFormularioCovid.modalidadTrabajo.id;
    
   if(objFormularioCovid.listSintomasId.length == 0){
      mostrarMensajeResultadoFormularioCovidVersionDos(1,1,valModTrabajo);
   }else{
      mostrarMensajeResultadoFormularioCovidVersionDos(2,1,valModTrabajo);
   }
}

function eliminarFormularioCovid() {

   mensajeUx = "<label>¿Está seguro de eliminar el formulario renovable seleccionado?</label>";

   mensajesUx(mensajeUx,3,"", "EliminarForCov");

   $("#btnDevolverValorEliminarForCov").on("click",function(){
      var dataParam={
	     id: objFormularioCovid.id
		    };

      callAjaxPost(URL+'/covid/formulario_covid/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>El formulario se eliminó con éxito.</label>";
	       
	       mensajesUx(mensajeUx,1,"","EliminarVistaForCov");

	       $("#modalMensajeUxEliminarVistaForCov").on("hidden.bs.modal",function(){
	          habilitarFormularioCovid();
	       });
	       break;

	    default:
	       alert("Ocurrió un error al eliminar el formulario!");
         }
      });
   });
}

function crearRadiosAutoForCov(nameId,listOptions,radioSelected,idValue,
	                       nombreValue,choice,align){
   var textoOpcionesRadio = "<div class='containerCenter'>";
    
   listOptions.forEach(function(val){
      textoOpcionesRadio += 
         "<div class='"+(choice == "checkbox"?"containerInputRadioChecbox":"")+"' style='"+
               (choice == "checkbox"?"padding-left:20px":"width:50%")+";display:inline-block;text-align:"+align+";'>" +
            "<label for='"+val[idValue]+nameId+"'>" +
	       "<input type='"+choice+"' id='"+val[idValue]+nameId+"' name='"+nameId+"' value='"+val[idValue]+"' " +
	               (choice == "radio"?(parseInt(radioSelected) == parseInt(val[idValue])?"checked":"")
		        : (radioSelected.includes(val[idValue]) == true?"checked":""))+">" + 
	        val[nombreValue] +
            "</label>" +
         "</div>"
   });
    
   textoOpcionesRadio += "</div>"
    
   return textoOpcionesRadio;
}

function obtenerSubPanelModuloFormularioRenovable(val, count) {

    var estiloDefault = "";

    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
	estiloDefault = "    border-top: 1px solid #a5aaae;"
    }
    if (val.fullRow == 1) {
	return "<div class='form-group row " + val.clase + "' style='"
		+ estiloDefault + "'>" + "<div class='col-sm-14' id='"
		+ val.divContainer + "'>" + val.inputForm + "</div>" + "</div>"
		+ "";
    }
    
    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
               (count==1 || (count > 3 && count < 13)?
                  "<label for='colFormLabel' class='"+(count == 5 || count ==6 ?"col-sm-6":
                                                      (count == 10?"col-sm-5":"col-sm-8"))+" col-form-label'>" +
         	     "<p id='parrafoFormularioCovid"+count+"' align='justify'>"+val.label+"</p>" +
         	         (count == 4 || count == 10 || count == 11?
         	         "<span id='auxParrafoFormularioCovid"+count+"' style='color:blue;font-weight:bold;'></span>":"")+
         	  "</label>":
              (count == 2 ?
        	  "<label for='colFormLabel' class='col-sm-10 col-form-label'>" +
              	     "<p id='parrafoFormularioCovid"+count+"' align='justify'>"+val.label+"</p>" +
                  "</label>":
              (count == 3 ?
                  "<label for='colFormLabel' class='col-sm-7 col-form-label'>" +
                     "<p id='parrafoFormularioCovid"+count+"' align='justify'>"+val.label+"</p>" +
                  "</label>":
                  "<label for='colFormLabel' class='col-sm-11 col-form-label'>" +
                     "<p id='parrafoFormularioCovid"+count+"' align='justify'>"+val.label+"</p>" +
                  "</label>")))+
 	      (count == 1 || (count > 3 && count < 13)?
 	          "<div class='"+(count == 5 || count == 6?"col-sm-6":
 	                         (count == 10?"col-sm-7":"col-sm-4"))+"' id='"+val.divContainer+"'>":
 	      (count == 2 ?
 		  "<div class='col-sm-2' id='"+val.divContainer+"'>" +
 		     "<span id='auxParrafoFormularioCovid"+count+"' style='color:blue;font-weight:bold;'></span>":
 	      (count == 3 ?
 		  "<div class='col-sm-5' id='"+val.divContainer+"'>":
 	          "<div class='col-sm-1' id='"+val.divContainer+"'>")))+
 	             " "+val.inputForm+
 	          "<small>"+val.sugerencia+" </small>"+
 	          "</div>"+
 	  "</div>";
}

function obtenerSubPanelModuloFormularioRenovableDatos(val, count) {

    var estiloDefault = "";

    if (val.inputForm == "" && val.sugerencia == "" && val.label == "") {
	estiloDefault = "    border-top: 1px solid #a5aaae;"
    }

    if (val.fullRow == 1) {
	return "<div class='form-group row " + val.clase
		+ "' style='text-align:center; " + estiloDefault + "'>"
		+ "<div class='col-sm-14' id='" + val.divContainer + "'>"
		+ val.inputForm + "</div>" + "</div>" + "";
    }
    
    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
               (count == 1 ?
                "<label style='color:blue;' for='colFormLabel' class='col-sm-9 col-form-label'>"+val.label+"</label>":
               (count == 2 || count == 4 || count == 5 || count == 9?
        	"<label for='colFormLabel' class='"+(count == 2?'col-sm-3':'col-sm-4')+" col-form-label'>"+val.label+"</label>":
               (count == 3 || count == 10 ?
        	"<label for='colFormLabel' class='col-sm-8 col-form-label'>"+val.label+"</label>":
        	"<label for='colFormLabel' class='col-sm-10 col-form-label'>"+val.label+"</label>")))+
 	       (count == 1 ?
 		"<div class='col-sm-3' id='"+val.divContainer+"'>"+val.inputForm+"":
 	       (count == 2 || count == 4 || count == 5 || count == 9?
 		"<div "+(val.inputForm=="Ninguno"?
 			 "style='color:blue;font-weight:bold;text-align:right;'":
 			 "style='color:red;font-weight:bold;text-align:right;'")+
 		        " class='"+(count == 2?'col-sm-9':'col-sm-8')+"' id='"+val.divContainer+"'>"+val.inputForm:
 	       (count == 3 || count == 10 ?
 	       "<div style='color:blue;font-weight:bold;text-align:right;' "+
 		    "class='col-sm-4' id='"+val.divContainer+"'>"+val.inputForm:
 	       "<div "+(val.inputForm=="No"?
 		        "style='color:blue;font-weight:bold;text-align:right;'":
 		        "style='color:red;font-weight:bold;text-align:right;'")+
 		       " class='col-sm-2' id='"+val.divContainer+"'>"+val.inputForm)))+
 	          "<small>"+val.sugerencia+" </small>"+
 	     "</div>"+
 	  "</div>";
}
