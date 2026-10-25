
var objHistorialVacunaCovid={};
var listHistorialVacunaCovid=[];
var listTipoVacunaCovid=[];
var indexHistorialVacunaCovid;
var sizeLetter;
var accesoDirectoHisVacCov;
var evidenciaVacunacionNombre,evidenciaDniNombre,fechaActualizacionCarVacCov,
    evalVacunacionNombre,evalVacunacionId,evalVacunacionObs,evalVacunacionIcono,
    evalVacunacionUsuario,evalVacunacionFecha,edadTrabajador;
var mensajeUx;

function toggleMenuOpcionHistorialVacunaCovid(obj,pindex){
   objHistorialVacunaCovid = listHistorialVacunaCovid[pindex]; 
   indexHistorialVacunaCovid = pindex;
//   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
//   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesHistorialVacunaCovid=[ 
   {id:"opcSegundaDosisVacCov",
    nombre:"<img src='../imagenes/iconos/fa-syringe.png' width='20px' height='20px'> Segunda dosis ",
    functionClick:function(data){previoCrearSegundaFormDosisVacunaCovid();}}
];

function marcarSubOpcionHistorialVacunaCovid(pindex){
   funcionalidadesHistorialVacunaCovid[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarHistorialVacunaCovid(){
   accesoDirectoHisVacCov = 1;
   var userAgent = isMobile.any(); //se encuentra en el util.js
   var listPanelesPrincipal=[];
	
   var dataParam={
      trabajadorId: getSession("trabajadorGosstId")
   };
	   
   callAjaxPost(URL+'/covid/vacuna',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05": 
            listHistorialVacunaCovid = data.listVacunaCovid;
            listTipoVacunaCovid = data.listTipoVacunaCovid;
	 	    
            sizeLetter = (userAgent == true?"13px;":"18px;");
	 	    
            $(".divListPrincipal").html("");
            var textTotal = "",textDocRegistrados = "";
            var intervaloPrimeraDosis,intervaloSegundaDosis,edadSegundaDosis,
                intervaloTerceraDosis,edadTerceraDosis;
                
            listHistorialVacunaCovid.forEach(function(val,index){
	       var menuOpcion = "";
	       var btnOpcion = "";
	       
	       evidenciaVacunacionNombre = val.trabajador.evidenciaVacunacionNombre;
	       evidenciaDniNombre = val.trabajador.evidenciaDniNombre;
	       fechaActualizacionCarVacCov = val.trabajador.fechaRegistroEvidenciaVacunacionTexto;
	       evalVacunacionId = val.evaluacionVacunacion.id;
	       evalVacunacionNombre = val.evaluacionVacunacion.nombre;
	       evalVacunacionObs = val.evaluacionVacunacion.observacion;
	       evalVacunacionIcono = val.evaluacionVacunacion.icono;
	       evalVacunacionUsuario = val.evaluacionVacunacion.usuario.nombre;
	       evalVacunacionFecha = val.evaluacionVacunacion.fechaTexto;
	       edadTrabajador = val.trabajador.edad;
	       
	       //Entre la primera y segunda dosis, no hay alguna restricción. Recién a partir de la 3ra dosis. 	
	       var nombreEnlace="",funcionEnlace="";
	       
	       if(parseInt(getSession("gestopcompanyid")) == 649){
	 	  if(val.tipoVacunaCovid.numDosis == 4){
	             intervaloPrimeraDosis = 0;intervaloSegundaDosis = 0;
	 	     intervaloTerceraDosis = 180;edadTerceraDosis = 0;
	 	  }else if(val.tipoVacunaCovid.numDosis == 3){
	 	     intervaloPrimeraDosis = 0;intervaloSegundaDosis = 180;
	 	     edadSegundaDosis = 0; 
	 	  }
	       }else{
	 	  if(val.tipoVacunaCovid.numDosis == 4){
	 	     intervaloPrimeraDosis = 21;intervaloSegundaDosis = 90;
	 	     intervaloTerceraDosis = 150;edadTerceraDosis = 30;
	 	  }else if(val.tipoVacunaCovid.numDosis == 3){
	 	     intervaloPrimeraDosis = 90;intervaloSegundaDosis = 150;
	 	     edadSegundaDosis = 30; 
	 	  }
	       }
	       
	       if(val.tipoVacunaCovid.numDosis == 4){
		  if(val.diferenciaDiasPrimeraDosis >= intervaloPrimeraDosis){
		     nombreEnlace="Registrar 2da dosis";
		     funcionEnlace="previoCrearSegundaFormDosisVacunaCovid();";  
		  }else if(val.diferenciaDiasSegundaDosis >= intervaloSegundaDosis){
		     nombreEnlace="Registrar 3ra dosis";
		     funcionEnlace="previoCrearTerceraFormDosisVacunaCovid();";  
		  }else if(val.diferenciaDiasTerceraDosis >= intervaloTerceraDosis && 
			   val.trabajador.edad > edadTerceraDosis){
		     nombreEnlace="Registrar 4ta dosis";
		     funcionEnlace="previoCrearCuartoFormDosisVacunaCovid();"; 
		  }
	       }else if(val.tipoVacunaCovid.numDosis == 3){
		  if(val.diferenciaDiasPrimeraDosis >= intervaloPrimeraDosis){
		     nombreEnlace="Registrar 2da dosis";
		     funcionEnlace="previoCrearSegundaFormDosisVacunaCovid();";   
		  }else if(val.diferenciaDiasSegundaDosis >= intervaloSegundaDosis && 
			   val.trabajador.edad > edadSegundaDosis){
		     nombreEnlace="Registrar 3ra dosis";
		     funcionEnlace="previoCrearTerceraFormDosisVacunaCovid();"; 
		  }
	       }
	       
	       if(nombreEnlace.length != 0){
	          btnOpcion = 
	             "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionHistorialVacunaCovid(this,"+index+");" +
	                                                         funcionEnlace+"'>" +
                        "<img src='../imagenes/iconos/fa-syringe.png' width='20px' height='20px'> "+nombreEnlace +
                     "</a>";
	       }
	 	    	
	       var listTotal=[
	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	 	   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	 	            "Fecha de registro: "+val.fechaRegistroTexto+
	 	         "</span>"},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	   label:"<img src='../imagenes/iconos/fa-syringe.png' width='20px' height='20px'> Tipo de vacuna",
	           inputForm:val.tipoVacunaCovid.nombre},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	  	   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Primera dosis</span>"},
	  	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	   label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
	 	   inputForm:val.fechaPrimeraDosisTexto},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
		   label:"<i class='fa fa-pencil'></i> Observación",
		   inputForm:val.observacionPrimeraDosis}
	       ];
	 	       
	       if(val.fechaSegundaDosisTexto != ''){
	          listTotal.push(
	 	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	     {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	  	      label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Segunda dosis</span>"},
	  	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	     {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	      label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
	 	      inputForm:val.fechaSegundaDosisTexto},
	 	     {sugerencia:"",anchoLabel:"",anchoDiv:"",
		      label:"<i class='fa fa-pencil'></i> Observación",
		      inputForm:val.observacionSegundaDosis});  
	          
	          if(val.fechaTerceraDosisTexto != ''){
		     listTotal.push(
		        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		        {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		  	 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Tercera dosis</span>"},
		  	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		 	{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 	 label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
		 	 inputForm:val.fechaTerceraDosisTexto},
		 	{sugerencia:"",anchoLabel:"",anchoDiv:"",
			 label:"<i class='fa fa-pencil'></i> Observación",
			 inputForm:val.observacionTerceraDosis});  
		     
		     if(val.fechaCuartaDosisTexto != ''){
			listTotal.push(
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			   {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
			    label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Cuarta dosis</span>"},
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",
			    label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
			    inputForm:val.fechaCuartaDosisTexto},
			   {sugerencia:"",anchoLabel:"",anchoDiv:"",
			    label:"<i class='fa fa-pencil'></i> Observación",
			    inputForm:val.observacionCuartaDosis});  
		     }
	          }
	       }
	 	       
	       textTotal+="<div class='eventoGeneral'>";	   		   
	          listTotal.forEach(function(val,index){
  	             textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	          });
	       textTotal+="</div>";
            });
            
            var textNuevo = "",colorFondo = "";
	 	
            if(listHistorialVacunaCovid.length == 0){
	       textNuevo = 
	          "<div id='estadoMovilHistorialVacunaCovid'>" +
	             "<div class='tituloSubList'> " +
	                "<img src='../imagenes/iconos/fa-syringe.png' " +
	                     "width='25px' height='25px'> Registrar dosis recibida(s) " +
	                "<button style='font-size:15px' title='Registrar la(s) dosis de vacuna(s) recibida(s)' " +
	                        "class='btn btn-success' onclick='confirmacionNumDosisVacunaCovid()'>" +
	                   "<i class='fa fa-plus-square'></i> Empezar" +
	                "</button>" +
	             "</div>" +
	             "<div class='contenidoSubList' style='display:none'>" +
	             "</div>" +
	          "</div>";
	       
	       $(".divListPrincipal").append(textNuevo); 
            }else{
               var btnActualizar = (evalVacunacionId == 1?"":
                  "<a class='btn-gestion efectoLink' title='Actualizar la evidencia del carné de vacunación' " +
                     "onclick='actualizarCarneVacunaCovid();'>" +
                     "<i class='fa fa-pencil-square-o'></i> "+(evalVacunacionId == -1?"Registrar":"Modificar")+
                  "</a>");
        	
	       var enlaceDescargaCarVacCov = (fechaActualizacionCarVacCov == ""?"<span>Pendiente</span>":
		  "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
		     "href='"+URL+"/covid/vacunacion/evidencia?trabajadorId="+getSession("trabajadorGosstId")+"'>" +
		     "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
		  "</a>");
		 	    
	       var enlaceDescargaDni = (fechaActualizacionCarVacCov == ""?"Pendiente":
	          "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
		     "href='"+URL+"/covid/trabajador_dni/evidencia?trabajadorId="+getSession("trabajadorGosstId")+"'>" +
		     "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
		  "</a>");
		 	    
	       var textoActCarne = (fechaActualizacionCarVacCov == ""?"":"*Modificado el "+fechaActualizacionCarVacCov);
	       
	       var listDocRegistrados=[
	    	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnActualizar,
	    	   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	    	 	    "Fecha de registro: "+fechaActualizacionCarVacCov+
	    	 	 "</span>"},
	    	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	    	   label:"<i class='fa fa-id-card'></i> Carné de vacunación",
	    	   inputForm:enlaceDescargaCarVacCov},
	    	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	    	   label:"<i class='fa fa-id-card-o'></i> Parte frontal - DNI",
	    	   inputForm:enlaceDescargaDni}
	       ];
	       
	       colorFondo = 
	          (evalVacunacionId == -1?"gray":
		   (evalVacunacionId == 1?"#9BBB59":(evalVacunacionId == 2?"#C0504D":"#df9226")));
	       
	       if(evalVacunacionId != -1){
		  listDocRegistrados.push(
			  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
		          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		          {sugerencia:"",anchoLabel:"",anchoDiv:"",
		  	   label:evalVacunacionIcono+" Estado:",
		  	   inputForm:evalVacunacionNombre});
		   
		  if(evalVacunacionId != 3){
	             if(evalVacunacionId == 1){
	                listDocRegistrados.push(
	  	           {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  	  	    label:"<i class='fa fa-calendar'></i> Evaluado el ",
	  	  	    inputForm:evalVacunacionFecha+"<br>(Por "+evalVacunacionUsuario+")"});  
	             }else{
	  	        listDocRegistrados.push(
	  	           {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  	  	    label:"<i class='fa fa-exclamation-circle'></i> Observación:",
	  	  	    inputForm:evalVacunacionObs},
	  	  	   {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  	    	    label:"<i class='fa fa-calendar'></i> Evaluado el ",
	  	    	    inputForm:evalVacunacionFecha+"<br>(Por "+evalVacunacionUsuario+")"});
	             }
		  }
	       }
	       
	       textDocRegistrados+="<div class='eventoGeneral' style='border-left:10px solid "+colorFondo+";'>";	
	          listDocRegistrados.forEach(function(val,index){
	             textDocRegistrados+=""+obtenerSubPanelModuloVersionDos(val);
	          });
	       textDocRegistrados+="</div>";
	       
	       listPanelesPrincipal.push({
	     	  id:"infoMovilDocRegistradosCovid",clase:"",styleContenido:"",
	     	  nombre:""+"Documentos registrados - COVID-19",
	     	  contenido:""+textDocRegistrados});
            }
                
            listPanelesPrincipal.push({
	       id:"infoMovilHistorialVacunaCovid",clase:"",styleContenido:"",
	       nombre:""+"Vacunas registradas ("+listHistorialVacunaCovid.length+")",
	       contenido:""+textTotal});
	 			
            agregarPanelesDivPrincipalStyle(listPanelesPrincipal,"");
	 			
            $(".listaFinalGestionGosst").hide();
            $(".contenidoFormVisible").hide();
            break;
	 	     
         default:
	    alert("nop");
            break;
      }
   });
}

function registroVacunaCovidDesdeFormCovid(){
   accesoDirectoHisVacCov = 0;
   
   if(accesoDirectoHisVacCov == 0 && listHistorialVacunaCovid.length == 0){
      confirmacionNumDosisVacunaCovid();
   }else if(accesoDirectoHisVacCov == 0 && listHistorialVacunaCovid.length == 1){
      toggleMenuOpcionHistorialVacunaCovid(this,0);
      
      if(objHistorialVacunaCovid.fechaSegundaDosisTexto == ""){
         previoCrearSegundaFormDosisVacunaCovid();
      }else if(objHistorialVacunaCovid.fechaTerceraDosisTexto == ""){
	 previoCrearTerceraFormDosisVacunaCovid(); 
      }else{
	 previoCrearCuartoFormDosisVacunaCovid(); 
      }
   }
}

var listOpcNumDosisVacCov=[
   {id:1,nombre:"Primera dosis"},
   {id:2,nombre:"Segunda dosis"},
   {id:3,nombre:"Tercera dosis"},
   {id:4,nombre:"Cuarta dosis"}
];

var numFomPorCompletarVacCov;
var crearPrimerFormDosisVacCov;
var existePrimerFormDosisVacCov;
var crearSegundoFormDosisVacCov;
var existeSegundoFormDosisVacCov;
var crearTercerFormDosisVacCov;
var existeTercerFormDosisVacCov;
var crearCuartoFormDosisVacCov;
var existeCuartoFormDosisVacCov;

function ocultarConfirmacionNumDosisVacunaCovid(){
   $("#modalConfNumDosisVacCov").modal("hide");
}

function confirmacionNumDosisVacunaCovid(){
   objHistorialVacunaCovid = {id: 0};
   $("#modalConfNumDosisVacCov").remove();
   $("#modalEditarPrimerFormVacCov").remove();
   $("#modalEditarSegundoFormVacCov").remove();
   $("#modalEditarTercerFormVacCov").remove();
   $("#modalEditarResumenFormVacCov").remove();
	    
   var selOpcNumDosisVacCov = crearSelectOneMenuOblig("selOpcNumDosisVacCov",
      "valorCambioDosisIndicada()",listOpcNumDosisVacCov,"1","id","nombre");
	        
   var contenido = "";
	   
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
       label:"¿Cuántas dosis va a registrar?",inputForm:selOpcNumDosisVacCov},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	   	     "onclick='ocultarConfirmacionNumDosisVacunaCovid()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='submit'>" +
	   	    "<i class='fa fa-arrow-circle-right'></i> Siguiente" +
	   	 "</button>"}
   ];
	   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
	   	
   var modalOptions={
      id: "modalConfNumDosisVacCov",
      nombre: "<i class='fa fa-book'></i> Confirmación previa - Número formularios vacunación",
      contenido: "<form id='formConfNumDosisVacCov' class='eventoGeneral'>"+contenido+"</form>"
   };
	   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   valorCambioDosisIndicada();
   
   var editarDiv = $("#formConfNumDosisVacCov");
	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validarNumFormVacunaCovid();
   });
  
   $("#modalConfNumDosisVacCov").modal("show");
}

function valorCambioDosisIndicada(){
   existePrimerFormDosisVacCov = 0;
   existeSegundoFormDosisVacCov = 0;
   existeTercerFormDosisVacCov = 0;
   existeCuartoFormDosisVacCov = 0;
}

function validarNumFormVacunaCovid(){
   $("#modalConfNumDosisVacCov").modal("hide");
   
   numFomPorCompletarVacCov = parseInt($("#selOpcNumDosisVacCov").val());
   
   if(existePrimerFormDosisVacCov == 0){
      $("#modalEditarPrimerFormVacCov").remove();	
      $("#modalEditarSegundoFormVacCov").remove();
      $("#modalEditarTercerFormVacCov").remove();
	  		  
      if(numFomPorCompletarVacCov == 1){
         crearPrimerFormDosisVacCov = 1;
	 crearSegundoFormDosisVacCov = 0; 
	 crearTercerFormDosisVacCov = 0; 
	 crearCuartoFormDosisVacCov = 0; 
      }else if(numFomPorCompletarVacCov == 2){
	 crearPrimerFormDosisVacCov = 1;
	 crearSegundoFormDosisVacCov = 1;
	 crearTercerFormDosisVacCov = 0;
	 crearCuartoFormDosisVacCov = 0; 
      }else if(numFomPorCompletarVacCov == 3){
         crearPrimerFormDosisVacCov = 1;
         crearSegundoFormDosisVacCov = 1;
         crearTercerFormDosisVacCov = 1;
         crearCuartoFormDosisVacCov = 0; 
      }else{
	 crearPrimerFormDosisVacCov = 1;
	 crearSegundoFormDosisVacCov = 1;
	 crearTercerFormDosisVacCov = 1;
	 crearCuartoFormDosisVacCov = 1;  
      }
	  
      crearPrimerFormDosisVacunaCovid();
   }else{
      $("#modalConfNumDosisVacCov").modal("hide"); 
      $("#modalEditarPrimerFormVacCov").modal("show");  
   }
}

function crearPrimerFormDosisVacunaCovid(){
   var listTipoVacunaCovidAux=[];
   
   if(numFomPorCompletarVacCov == 4){
      listTipoVacunaCovidAux = listTipoVacunaCovid.filter( x => x.id != 7);
   }else{
      listTipoVacunaCovidAux = listTipoVacunaCovid;
   }
    
   var selTipoVacunaCov = crearSelectOneMenu("selTipoVacunaCov",
      "indicarValorTipoVacunaCovid()",listTipoVacunaCovidAux,"-1","id","nombre");
		        
   var contenido = "";
		   
   var listContenido=[
      {sugerencia:"",inputForm:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>Primera dosis</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de vacuna",inputForm:selTipoVacunaCov},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de aplicación",
       inputForm:"<input type='date' id='fechaPrimeraDosisVacCov' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Observación",
       inputForm:"<textarea rows='3' class='form-control' id='textObsPrimeraDosisVacCov'></textarea>" +
		 "<label style='float:right;'>(opcional)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button type='button' class='btn btn-success' style='float:left;font-size:18px;' " +
		     "onclick='regresarFormNumDosisVacunaCovid()'>" +
	        "<i aria-hidden='true' class='fa fa-arrow-circle-left'></i> Anterior" +
	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
	            "<i aria-hidden='true' class='fa fa-arrow-circle-right'></i> Siguiente" +
		 "</button>"} 
   ];
		   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
		   	
   var modalOptions={
      id: "modalEditarPrimerFormVacCov",
      nombre: "<i class='fa fa-pencil-square'></i> Registro de vacunación - 1ra dosis",
      contenido: "<form id='formEditarPrimerFormVacCov' class='eventoGeneral'>"+contenido+"</form>"
   };
		   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   existePrimerFormDosisVacCov = 1;
		
   var editarDiv = $("#formEditarPrimerFormVacCov");
	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validarPrimerFormDosisVacunaCovid();
   });
   
   $("#modalEditarPrimerFormVacCov").modal("show");
}

function regresarFormNumDosisVacunaCovid(){
   $("#modalEditarPrimerFormVacCov").modal("hide"); 
   $("#modalConfNumDosisVacCov").modal("show"); 
}

function validarPrimerFormDosisVacunaCovid(){
   var campoVacio = true;
		
   var tipoVacCovId = parseInt($("#selTipoVacunaCov").val());
   var fechaPrimeraDosisVacCov = $("#fechaPrimeraDosisVacCov").val();
   
   if(tipoVacCovId == -1 || fechaPrimeraDosisVacCov.length == 0){
      campoVacio = false;
   }
	   
   $("#modalEditarPrimerFormVacCov").modal("hide");
	   
   if(campoVacio){
      if(crearSegundoFormDosisVacCov == 1){
         if(existeSegundoFormDosisVacCov == 0){
	    crearSegundaFormDosisVacunaCovid();
         }else{
            $("#modalEditarSegundoFormVacCov").modal("show"); 
         }
      }else{
	 $("#modalEditarResumenFormVacCov").remove();
		   
	 crearResumenFormDosisVacunaCovid();
      }
   }else{
      mensajeUx="<label>Debe completar todos los campos obligatorios del " +
		"formulario actual para poder pasar al siguiente.<label>";
      mensajesUx(mensajeUx,2,"","CompletarObligatorioVacCov");
			   
      $("#modalMensajeUxCompletarObligatorioVacCov").on("hidden.bs.modal",function(){
         $("#modalEditarPrimerFormVacCov").modal("show");
      }); 
   }
}

function previoCrearSegundaFormDosisVacunaCovid(){
   existePrimerFormDosisVacCov = 0;	
   existeSegundoFormDosisVacCov = 0;
   existeTercerFormDosisVacCov = 0;
   existeCuartoFormDosisVacCov = 0;
   
   crearSegundaFormDosisVacunaCovid();
}

function crearSegundaFormDosisVacunaCovid(){
   var contenido = "";
			   
   var listContenido=[
      {sugerencia:"",inputForm:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>Segunda dosis</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de vacuna",
       inputForm:"",divContainer:"divValorSegDosisTipoVacunaCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de aplicación",
       inputForm:"<input type='date' id='fechaSegundaDosisVacCov' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Observación",
       inputForm:"<textarea rows='3' class='form-control' id='textObsSegundaDosisVacCov'></textarea>" + 
		 "<label style='float:right;'>(opcional)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:(objHistorialVacunaCovid.id > 0?"":
	      "<button type='button' class='btn btn-success' style='float:left;font-size:18px;' " +
		      "onclick='regresarPrimerFormDosisVacunaCovid()'>" +
	         "<i aria-hidden='true' class='fa fa-arrow-circle-left'></i> Anterior" +
	      "</button>"),
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
		    "<i aria-hidden='true' class='fa fa-arrow-circle-right'></i> Siguiente" +
		 "</button>"} 
   ];
			   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
			   	
   var modalOptions={
      id: "modalEditarSegundoFormVacCov",
      nombre: "<i class='fa fa-pencil-square'></i> Registro de vacunación - 2da dosis",
      contenido: "<form id='formEditarSegundoFormVacCov' class='eventoGeneral'>"+contenido+"</form>"
   };
			   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	   
   existeSegundoFormDosisVacCov = 1;
   indicarValorTipoVacunaCovid(2);
			
   var editarDiv = $("#formEditarSegundoFormVacCov");
		
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validarSegundoFormDosisVacunaCovid();
   });
	   
   $("#modalEditarSegundoFormVacCov").modal("show");
}

function indicarValorTipoVacunaCovid(numOrdenDosis){
   var valTempTipVacCov;

   if(objHistorialVacunaCovid.id > 0){
      valTempTipVacCov = listTipoVacunaCovid.find(x => x.id == parseInt(objHistorialVacunaCovid.tipoVacunaCovid.id)); 
   }else{
      valTempTipVacCov = listTipoVacunaCovid.find(x => x.id == parseInt($("#selTipoVacunaCov").val())); 
   }
	
   if(numOrdenDosis == 2){
      var divValorTipVacCov = document.querySelector("#divValorSegDosisTipoVacunaCov");
      divValorTipVacCov.innerHTML = valTempTipVacCov.nombre;	
   }
   
   if(numOrdenDosis == 3){
      var divValorTipVacCov = document.querySelector("#divValorTerDosisTipoVacunaCov");
      divValorTipVacCov.innerHTML = valTempTipVacCov.nombre;	
   }
   
   if(numOrdenDosis == 4){
      var divValorTipVacCov = document.querySelector("#divValorCuaDosisTipoVacunaCov");
      divValorTipVacCov.innerHTML = valTempTipVacCov.nombre;	
   }
}

function regresarPrimerFormDosisVacunaCovid(){
   $("#modalEditarSegundoFormVacCov").modal("hide"); 
   $("#modalEditarPrimerFormVacCov").modal("show"); 
}

function validarSegundoFormDosisVacunaCovid(){
   var campoVacio = true;
			
   var fechaSegundaDosisVacCov = $("#fechaSegundaDosisVacCov").val();
	   
   if(fechaSegundaDosisVacCov.length == 0){
      campoVacio = false;
   }
   
   $("#modalEditarSegundoFormVacCov").modal("hide");
		     
   if(campoVacio){
      if(crearTercerFormDosisVacCov == 1){
	 if(existeTercerFormDosisVacCov == 0){
            crearTerceraFormDosisVacunaCovid();
	 }else{
	    $("#modalEditarTercerFormVacCov").modal("show"); 
	 } 
      }else{
         $("#modalEditarResumenFormVacCov").remove();
	   
         crearResumenFormDosisVacunaCovid();
      }
   }else{
      mensajeUx="<label>Debe completar todos los campos obligatorios del " +
	        "formulario actual para poder pasar al siguiente.<label>";
      mensajesUx(mensajeUx,2,"","CompletarObligatorioVacCov");
				   
      $("#modalMensajeUxCompletarObligatorioVacCov").on("hidden.bs.modal",function(){
         $("#modalEditarSegundoFormVacCov").modal("show");
      }); 
   }
}

function previoCrearTerceraFormDosisVacunaCovid(){
   existePrimerFormDosisVacCov = 0;	
   existeSegundoFormDosisVacCov = 0;
   existeTercerFormDosisVacCov = 0;
   existeCuartoFormDosisVacCov = 0;
    
   crearTerceraFormDosisVacunaCovid();
}

function crearTerceraFormDosisVacunaCovid(){
   var contenido = "";
 			   
   var listContenido=[
      {sugerencia:"",inputForm:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>Tercera dosis</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<label style='color:blue;'>*Si ha recibido otro tipo de vacuna, regístrelo " +
	     "en el campo observación.</label>",
       inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de vacuna",
       inputForm:"",divContainer:"divValorTerDosisTipoVacunaCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de aplicación",
       inputForm:"<input type='date' id='fechaTerceraDosisVacCov' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Observación",
       inputForm:"<textarea rows='3' class='form-control' id='textObsTerceraDosisVacCov'></textarea>" + 
 		 "<label style='float:right;'>(opcional)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:(objHistorialVacunaCovid.id > 0?"":
 	      "<button type='button' class='btn btn-success' style='float:left;font-size:18px;' " +
 		      "onclick='regresarSegundoFormDosisVacunaCovid()'>" +
 	         "<i aria-hidden='true' class='fa fa-arrow-circle-left'></i> Anterior" +
 	      "</button>"),
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
 		    "<i aria-hidden='true' class='fa fa-arrow-circle-right'></i> Siguiente" +
 		 "</button>"} 
   ];
 			   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 			   	
   var modalOptions={
      id: "modalEditarTercerFormVacCov",
      nombre: "<i class='fa fa-pencil-square'></i> Registro de vacunación - 3ra dosis",
      contenido: "<form id='formEditarTercerFormVacCov' class='eventoGeneral'>"+contenido+"</form>"
   };
 			   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
 	   
   existeTercerFormDosisVacCov = 1;
   indicarValorTipoVacunaCovid(3);
 			
   var editarDiv = $("#formEditarTercerFormVacCov");
 		
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validarTercerFormDosisVacunaCovid();
   });
 	   
   $("#modalEditarTercerFormVacCov").modal("show");
}

function regresarSegundoFormDosisVacunaCovid(){
   $("#modalEditarTercerFormVacCov").modal("hide"); 
   $("#modalEditarSegundoFormVacCov").modal("show"); 
}

function validarTercerFormDosisVacunaCovid(){
   var campoVacio = true;
 			
   var fechaTerceraDosisVacCov = $("#fechaTerceraDosisVacCov").val();
	   
   if(fechaTerceraDosisVacCov.length == 0){
      campoVacio = false;
   }
    
   $("#modalEditarTercerFormVacCov").modal("hide");
 		     
   if(campoVacio){
      if(crearCuartoFormDosisVacCov == 1){
 	 if(existeCuartoFormDosisVacCov == 0){
 	    crearCuartoFormDosisVacunaCovid();
 	 }else{
 	    $("#modalEditarCuartoFormVacCov").modal("show"); 
 	 } 
      }else{
         $("#modalEditarResumenFormVacCov").remove();
 	   
         crearResumenFormDosisVacunaCovid();
      }
   }else{
      mensajeUx="<label>Debe completar todos los campos obligatorios del " +
 	        "formulario actual para poder pasar al siguiente.<label>";
      mensajesUx(mensajeUx,2,"","CompletarObligatorioVacCov");
 				   
      $("#modalMensajeUxCompletarObligatorioVacCov").on("hidden.bs.modal",function(){
         $("#modalEditarTercerFormVacCov").modal("show");
      }); 
   }
}

function previoCrearCuartoFormDosisVacunaCovid(){
   existePrimerFormDosisVacCov = 0;	
   existeSegundoFormDosisVacCov = 0;
   existeTercerFormDosisVacCov = 0;
   existeCuartoFormDosisVacCov = 0;
     
   crearCuartoFormDosisVacunaCovid();
}

function crearCuartoFormDosisVacunaCovid(){
   var contenido = "";
  			   
   var listContenido=[
      {sugerencia:"",inputForm:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>Cuarta dosis</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<label style='color:blue;'>*Si ha recibido otro tipo de vacuna, regístrelo " +
 	     "en el campo observación.</label>",
       inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de vacuna",
       inputForm:"",divContainer:"divValorCuaDosisTipoVacunaCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de aplicación",
       inputForm:"<input type='date' id='fechaCuartaDosisVacCov' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Observación",
       inputForm:"<textarea rows='3' class='form-control' id='textObsCuartaDosisVacCov'></textarea>" + 
  		 "<label style='float:right;'>(opcional)</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:(objHistorialVacunaCovid.id > 0?"":
  	      "<button type='button' class='btn btn-success' style='float:left;font-size:18px;' " +
  		      "onclick='regresarTercerFormDosisVacunaCovid()'>" +
  	         "<i aria-hidden='true' class='fa fa-arrow-circle-left'></i> Anterior" +
  	      "</button>"),
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
  		    "<i aria-hidden='true' class='fa fa-arrow-circle-right'></i> Siguiente" +
  		 "</button>"} 
   ];
  			   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  			   	
   var modalOptions={
      id: "modalEditarCuartoFormVacCov",
      nombre: "<i class='fa fa-pencil-square'></i> Registro de vacunación - 4ta dosis",
      contenido: "<form id='formEditarCuartoFormVacCov' class='eventoGeneral'>"+contenido+"</form>"
   };
  			   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
  	   
   existeCuartoFormDosisVacCov = 1;
   indicarValorTipoVacunaCovid(4);
  			
   var editarDiv = $("#formEditarCuartoFormVacCov");
  		
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      validarCuartoFormDosisVacunaCovid();
   });
  	   
   $("#modalEditarCuartoFormVacCov").modal("show");
}

function regresarTercerFormDosisVacunaCovid(){
   $("#modalEditarCuartoFormVacCov").modal("hide"); 
   $("#modalEditarTercerFormVacCov").modal("show"); 
}

function validarCuartoFormDosisVacunaCovid(){
   var campoVacio = true;
  			
   var fechaCuartaDosisVacCov = $("#fechaCuartaDosisVacCov").val();
  	   
   if(fechaCuartaDosisVacCov.length == 0){
      campoVacio = false;
   }
     
   $("#modalEditarCuartoFormVacCov").modal("hide");
  		     
   if(campoVacio){
      $("#modalEditarResumenFormVacCov").remove();
  	   
      crearResumenFormDosisVacunaCovid();
   }else{
      mensajeUx="<label>Debe completar todos los campos obligatorios del " +
  	        "formulario actual para poder pasar al siguiente.<label>";
      mensajesUx(mensajeUx,2,"","CompletarObligatorioVacCov");
  				   
      $("#modalMensajeUxCompletarObligatorioVacCov").on("hidden.bs.modal",function(){
         $("#modalEditarCuartoFormVacCov").modal("show");
      }); 
   }
}

function crearResumenFormDosisVacunaCovid(){
   var valTempTipVacCov;

   if(objHistorialVacunaCovid.id > 0){
      valTempTipVacCov = listTipoVacunaCovid.find(x => x.id == parseInt(objHistorialVacunaCovid.tipoVacunaCovid.id)); 
   }else{
      valTempTipVacCov = listTipoVacunaCovid.find(x => x.id == parseInt($("#selTipoVacunaCov").val())); 
   }
   
   var contenido = "";
   
   var listContenido=[
      {sugerencia:"",inputForm:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",
       label:"<span style='color:blue;font-size:20px;font-weight:bolder;'>Resumen</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de vacuna",inputForm:""+valTempTipVacCov.nombre},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
   ];   
   
   if(existePrimerFormDosisVacCov == 1){
      listContenido.push(
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	  label:"<span style='font-size:18px;font-weight:bolder;'> " +
                   "<i class='fa fa-pencil-square'></i> Primera dosis" +
                "</span>",inputForm:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"Fecha de aplicación",inputForm:""+convertirFechaNormal($("#fechaPrimeraDosisVacCov").val())},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"Observación",inputForm:""+$("#textObsPrimeraDosisVacCov").val()}); 
      
      if(existeSegundoFormDosisVacCov == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
      }
   }
   
   if(existeSegundoFormDosisVacCov == 1){
      listContenido.push(
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	  label:"<span style='font-size:18px;font-weight:bolder;'> " +
                   "<i class='fa fa-pencil-square'></i> Segunda dosis" +
                "</span>",inputForm:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"Fecha de aplicación",inputForm:""+convertirFechaNormal($("#fechaSegundaDosisVacCov").val())},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"Observación",inputForm:""+$("#textObsSegundaDosisVacCov").val()}); 
      
      if(existeTercerFormDosisVacCov == 1){
         listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
      }
   }
   
   if(existeTercerFormDosisVacCov == 1){
      listContenido.push( 
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	  label:"<span style='font-size:18px;font-weight:bolder;'> " +
		   "<i class='fa fa-pencil-square'></i> Tercera dosis" +
		"</span>",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"Fecha de aplicación",inputForm:""+convertirFechaNormal($("#fechaTerceraDosisVacCov").val())},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"Observación",inputForm:""+$("#textObsTerceraDosisVacCov").val()});
      
      if(existeCuartoFormDosisVacCov == 1){
         listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
      }
   }
   
   if(existeCuartoFormDosisVacCov == 1){
      listContenido.push( 
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	  label:"<span style='font-size:18px;font-weight:bolder;'> " +
 		   "<i class='fa fa-pencil-square'></i> Cuarta dosis" +
 		"</span>",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	  label:"Fecha de aplicación",inputForm:""+convertirFechaNormal($("#fechaCuartaDosisVacCov").val())},
 	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	  label:"Observación",inputForm:""+$("#textObsCuartaDosisVacCov").val()});
   }
   
   listContenido.push(
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-1",anchoDiv:"col-sm-11",
       label:"<i class='fa fa-hand-o-right' style='font-size:40px;'></i>",
       inputForm:"<label style='color:red;'>Recordatorio: Asegúrese de que la información ingresada es correcta " +
		 "porque, una vez guardado el reporte, no podrá ser modificado.</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button type='button' class='btn btn-success' style='float:left;font-size:18px;' " +
		     "onclick='regresarAnteriorFormDosisVacunaCovid()'>" +
	        "<i aria-hidden='true' class='fa fa-arrow-circle-left'></i> Anterior" +
	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
	            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"});
			    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
			 	
   var opciones={
      id: "modalEditarResumenFormVacCov",
      nombre: "<i class='fa fa-book'></i> Registro de vacunación - Verificación de datos",
      contenido: "<form id='formEditarResumenFormVacCov' class='eventoGeneral'>" +
		  contenido+"</form>"
   };
			    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
					
   var editarDiv = $("#formEditarResumenFormVacCov");
			 	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarRegistroVacunaCovid();
   });
   
   $("#modalEditarResumenFormVacCov").modal("show");
}

function regresarAnteriorFormDosisVacunaCovid(){
   if(existePrimerFormDosisVacCov == 1 && existeSegundoFormDosisVacCov == 0 && existeTercerFormDosisVacCov == 0 &&
      existeCuartoFormDosisVacCov == 0){
      $("#modalEditarResumenFormVacCov").modal("hide"); 
      $("#modalEditarPrimerFormVacCov").modal("show");  
   }else if(existeSegundoFormDosisVacCov == 1 && existeTercerFormDosisVacCov == 0 && existeCuartoFormDosisVacCov == 0){
      $("#modalEditarResumenFormVacCov").modal("hide"); 
      $("#modalEditarSegundoFormVacCov").modal("show"); 
   }else if(existeTercerFormDosisVacCov == 1 && existeCuartoFormDosisVacCov == 0){
      $("#modalEditarResumenFormVacCov").modal("hide"); 
      $("#modalEditarTercerFormVacCov").modal("show"); 
   }else{
      $("#modalEditarResumenFormVacCov").modal("hide"); 
      $("#modalEditarCuartoFormVacCov").modal("show");  
   }  
}

function guardarRegistroVacunaCovid(){
   if(existePrimerFormDosisVacCov == 1 && existeSegundoFormDosisVacCov == 0 && existeTercerFormDosisVacCov == 0 &&
      existeCuartoFormDosisVacCov == 0){
      var dataParam={
	 id: objHistorialVacunaCovid.id,
	 tipoVacunaCovid: {id: parseInt($("#selTipoVacunaCov").val())},
	 fechaPrimeraDosis: convertirFechaTexto($("#fechaPrimeraDosisVacCov").val()),
	 observacionPrimeraDosis: $("#textObsPrimeraDosisVacCov").val(),
	 trabajadorId: getSession("trabajadorGosstId")
      };
   }else if(existePrimerFormDosisVacCov == 0 && existeSegundoFormDosisVacCov == 1 && existeTercerFormDosisVacCov == 0 && 
	    existeCuartoFormDosisVacCov == 0){
      var dataParam={
	 id: objHistorialVacunaCovid.id,
	 fechaSegundaDosis: convertirFechaTexto($("#fechaSegundaDosisVacCov").val()),
	 observacionSegundaDosis: $("#textObsSegundaDosisVacCov").val(),
	 trabajadorId: getSession("trabajadorGosstId"),
	 isUpdateSegundaDosis: 1
      }; 
   }else if(existePrimerFormDosisVacCov == 0 && existeSegundoFormDosisVacCov == 0 && existeTercerFormDosisVacCov == 1 && 
	    existeCuartoFormDosisVacCov == 0){
      var dataParam={
	 id: objHistorialVacunaCovid.id,
	 fechaTerceraDosis: convertirFechaTexto($("#fechaTerceraDosisVacCov").val()),
	 observacionTerceraDosis: $("#textObsTerceraDosisVacCov").val(),
	 trabajadorId: getSession("trabajadorGosstId"),
	 isUpdateTerceraDosis: 1
      };    
   }else if(existePrimerFormDosisVacCov == 0 && existeSegundoFormDosisVacCov == 0 && existeTercerFormDosisVacCov == 0 && 
	    existeCuartoFormDosisVacCov == 1){
      var dataParam={  
	 id: objHistorialVacunaCovid.id,
	 fechaCuartaDosis: convertirFechaTexto($("#fechaCuartaDosisVacCov").val()),
	 observacionCuartaDosis: $("#textObsCuartaDosisVacCov").val(),
	 trabajadorId: getSession("trabajadorGosstId"),
	 isUpdateCuartaDosis: 1
      };    
   }else{
      var dataParam={
         id: objHistorialVacunaCovid.id,
         tipoVacunaCovid: {id: parseInt($("#selTipoVacunaCov").val())},
         fechaPrimeraDosis: (existePrimerFormDosisVacCov == 1?convertirFechaTexto($("#fechaPrimeraDosisVacCov").val()):null),
         observacionPrimeraDosis: (existePrimerFormDosisVacCov == 1?$("#textObsPrimeraDosisVacCov").val():null),
         fechaSegundaDosis: (existeSegundoFormDosisVacCov == 1?convertirFechaTexto($("#fechaSegundaDosisVacCov").val()):null),
         observacionSegundaDosis: (existeSegundoFormDosisVacCov == 1?$("#textObsSegundaDosisVacCov").val():null),
         fechaTerceraDosis: (existeTercerFormDosisVacCov == 1?convertirFechaTexto($("#fechaTerceraDosisVacCov").val()):null),
	 observacionTerceraDosis: (existeTercerFormDosisVacCov == 1?$("#textObsTerceraDosisVacCov").val():null),
	 fechaCuartaDosis: (existeCuartoFormDosisVacCov == 1?convertirFechaTexto($("#fechaCuartaDosisVacCov").val()):null),
	 observacionCuartaDosis: (existeCuartoFormDosisVacCov == 1?$("#textObsCuartaDosisVacCov").val():null),
         trabajadorId: getSession("trabajadorGosstId")
      };  
   }
   
   callAjaxPost(URL+'/covid/vacuna/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
   	    $("#modalEditarResumenFormVacCov").modal("hide");
   	    	 
   	    mensajeUx="<label>La vacuna fue registrada con éxito.</label>";
   	    mensajesUx(mensajeUx,1,"","ActualizarVacCovMain");
		    	 
   	    $("#modalMensajeUxActualizarVacCovMain").on("hidden.bs.modal",function(){
   	       if(accesoDirectoHisVacCov == 1){
   	          habilitarHistorialVacunaCovid(); 
   	       }else{
   	    	  habilitarFormularioCovid();
   	       } 
   	    });		
   	    
   	    break;
   	
   	 default:
            console.log("Ocurrió un error al guardar la vacuna registrada.");
      }
   });
}

function ocultarActualizarCarneVacunaCovid(){
   $("#modalActualizarVacunacionCovid").modal("hide");
}

function actualizarCarneVacunaCovid(){
   $("#modalActualizarVacunacionCovid").remove();	

   var listItems=[
      {sugerencia:"",inputForm:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-file-o'></i> Certificado de vacunación <br> (archivo o foto)",
       inputForm:"",divContainer:"tdEvidenciaCarneVacCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",inputForm:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-file-o'></i> Cara frontal - DNI <br> (archivo o foto)",
       inputForm:"",divContainer:"tdEvidenciaDniVacCov"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
 	             "onclick='ocultarActualizarCarneVacunaCovid()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
 	            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
 	         "</button>"} 
   ];
 	                  	                       
   var textForm = "";
 	                  	                    	
   listItems.forEach(function(val,index){
      textForm += obtenerSubPanelModuloVersionDos(val);
   });
 	                  	                    	
   var opciones={
      id: "modalActualizarVacunacionCovid",
      nombre: "<i class='fa fa-id-card'></i> Actualizar - Carné de vacunación",
      contenido: "<form id='formActualizarVacunacionCovid' class='eventoGeneral'>"+textForm+"</form>"
   };
 	                  	                       
   crearModalPrincipalUsuario(opciones,function(){},true,true);
 	                  	                      
   var optionEvidenciaCarVacCov={
      isImage: false,
      container: "#tdEvidenciaCarneVacCov",
      idAux: "CarneVacCov",
      esNuevo: (fechaActualizacionCarVacCov == ""),
      evidenciaNombre: (fechaActualizacionCarVacCov == ""?"":evidenciaVacunacionNombre),
      functionCall: function(){},
      descargaUrl: (fechaActualizacionCarVacCov == ""?"":
                    "/covid/vacunacion/evidencia?trabajadorId="+getSession("trabajadorGosstId"))
   };
 	                  	                   			
   crearFormEvidenciaCompleta(optionEvidenciaCarVacCov);
    
   var optionEvidenciaDniVacCov={
      isImage: false,
      container: "#tdEvidenciaDniVacCov",
      idAux: "DniVacCov",
      esNuevo: (fechaActualizacionCarVacCov == ""),
      evidenciaNombre: (fechaActualizacionCarVacCov == ""?"":evidenciaDniNombre),
      functionCall: function(){},
      descargaUrl: (fechaActualizacionCarVacCov == ""?"":
 		    "/covid/trabajador_dni/evidencia?trabajadorId="+getSession("trabajadorGosstId")),
      mensajeAux: "*El DNI se solicita para poder verificar en el MINSA " +
 		  "la validez del certificado de vacunación."
   };
 			                  	                   			
   crearFormEvidenciaCompleta(optionEvidenciaDniVacCov);
 	                     
   var editarDiv = $("#formActualizarVacunacionCovid");
 	                  	                    	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarCarneVacunaCovid();
   });		
}

function guardarCarneVacunaCovid(){
   var campoVacio = true;
 		
   var inputEviCarneVacCov = $("#inputEviCarneVacCov").val();
   var inputEviDniVacCov = $("#inputEviDniVacCov").val();
    
   if(inputEviCarneVacCov.length == 0 || inputEviDniVacCov.length == 0){
      campoVacio = false; 
   }
 	    
   if(campoVacio){
      var trabajadorId = parseInt(getSession("trabajadorGosstId"));
 	  
      guardarEvidenciaAuto(trabajadorId,"fileEviCarneVacCov",bitsMega*10,
         "/covid/vacunacion/evidencia/save",function(){
            guardarEvidenciaAuto(trabajadorId,"fileEviDniVacCov",bitsMega*10,
 	       "/covid/trabajador_dni/evidencia/save",function(){
 	          $("#modalActualizarVacunacionCovid").modal("hide");
 	          
 	          if(accesoDirectoHisVacCov == 1){
 	             mensajeUx="<label>Los datos se actualizaron correctamente.</label>";
 	             mensajesUx(mensajeUx,1,"","ActualizarVacCovMain");
 	 			    	 
 	 	     $("#modalMensajeUxActualizarVacCovMain").on("hidden.bs.modal",function(){
 	 		habilitarHistorialVacunaCovid();   
 	 	     }); 
 	          }else{
 	             var dataParam={
 	        	trabajadorId: trabajadorId     
 	             };
 	              
 	             callAjaxPost(URL+'/covid/evaluacion_carne_vacunacion/actualizar',dataParam,function(data){
 	                switch(data.CODE_RESPONSE){
 	                   case "05":
 	                      mensajeUx="<label>Los datos se actualizaron correctamente.</label>";
 	 	              mensajesUx(mensajeUx,1,"","ActualizarVacCovMain");
 	 	 			    	 
 	 	 	      $("#modalMensajeUxActualizarVacCovMain").on("hidden.bs.modal",function(){
 	 	 		 habilitarFormularioCovid(); 
 	 	 	      }); 
 	 	 	      break;
 	               	
 	            	   default:
 	                      console.log("Ocurrió un error al actualizar la evaluación del carné.");
 	                }
 	             });
 	          }
               });
         });
   }else{
      $("#modalActualizarVacunacionCovid").modal("hide");
 	   
      mensajeUx="<label>Debe completar todos los campos del formulario.<label>";
      mensajesUx(mensajeUx,2,"","CompletarObligatorioVacCov");
 					   
      $("#modalMensajeUxCompletarObligatorioVacCov").on("hidden.bs.modal",function(){
         $("#modalActualizarVacunacionCovid").modal("show");
      }); 
   }	
}

function actualizarCarneVacunaCovidDesdeFormCovid(){
   accesoDirectoHisVacCov = 0;
 	
   listHistorialVacunaCovid.forEach(function(val,index){
      evidenciaVacunacionNombre = val.trabajador.evidenciaVacunacionNombre;
      evidenciaDniNombre = val.trabajador.evidenciaDniNombre;
      fechaActualizacionCarVacCov = val.trabajador.fechaRegistroEvidenciaVacunacionTexto;
       
      actualizarCarneVacunaCovid();
   });
}
