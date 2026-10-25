
var listFullConsolidadoHistorialVacCov=[];
var listTipoVacunaCovidId = [];
var mensajeUx;

var listEstadosActualConHisVacCov=[
   {id:1,nombre:"Vacunación incompleta"},
   {id:2,nombre:"Vacunación completa"}
];

function ocultarFiltroHistorialVacunaCovid(){
   $("#modalFiltroHistorialVacunaCovid").modal("hide");
}

function verFiltroHistorialVacunaCovid(){
   $("#modalFiltroHistorialVacunaCovid").modal("show");
}

function crearFiltroHistorialVacunaCovid(functionCallBack){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
   }; 
		
   callAjaxPost(URL+'/covid/historial_vacuna/trabajadores/filtro',dataParam,function(data){  
      var listTiposVacunaCovid = data.listTipoVacunaCovid;
      
      var selEstadoActualConHisVacCov = crearSelectOneMenu("selEstadoActualConHisVacCov","",
         listEstadosActualConHisVacCov,"","id","nombre","Todos los registros");
      
//      var selDentroRangoFechaVacCov = crearSelectOneMenu("selDentroRangoFechaVacCov","",
//    	 listBoolean,"-1","id","nombre","Todos");
      
      var selDentroGrupoRiesgoCov = crearSelectOneMenu("selDentroGrupoRiesgoCov","",
    	 listBoolean,"-1","id","nombre","Todos");
      
      var contenido = "";
				
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
          label:"Estado actual",inputForm:selEstadoActualConHisVacCov}
//       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
//        label:"¿Está dentro del rango de edad para vacunarse? (>= 18 años)",
//        inputForm:selDentroRangoFechaVacCov}
      ];
      
      if(isNaN(parseInt(getSession("trabajadorGosstId"))) == true){
         listContenido.push(
    	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
             label:"¿Pertenece al grupo de riesgo?",inputForm:selDentroGrupoRiesgoCov}); 
      }
      
      listContenido.push(
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipos de vacuna",inputForm:"",
	  divContainer:"divFiltroTipoVacunaCovidHisVacCov"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	                "onclick='ocultarFiltroHistorialVacunaCovid()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	        "</button>",
	  inputForm:"<button id='btnAplicarFiltroHisVacCov' class='btn btn-success' type='submit' " +
	          	    "style='float:right;font-size:18px;'>" +
	               "<i class='fa fa-filter'></i> Aplicar filtro" +
	            "</button>"}); 
      
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
				
      var modalOptionsCov={
         id: "modalFiltroHistorialVacunaCovid",
         nombre: "<i class='fa fa-filter'></i> Filtro - Historial de vacunas",
         contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroTipoVacunaCovidHisVacCov").length > 0){
	    return;
         }
         
         crearSelectOneMenuObligMultipleCompleto("filtroTipoVacunaCovidHisVacCov","",listTiposVacunaCovid,
            "id","nombre","#divFiltroTipoVacunaCovidHisVacCov","Todos");
      },false);
				
      $("#btnAplicarFiltroHisVacCov").on("click",function(){
    	 ocultarFiltroHistorialVacunaCovid(); 
    	 functionCallBack(cargarConsolidadoHistorialVacunaCovid);
      });
				
      $("#modalFiltroHistorialVacunaCovid").modal("hide");
      functionCallBack(cargarConsolidadoHistorialVacunaCovid);
   });
}

function valoresFiltroHistorialVacunaCovid(functionCallBack){
   listTipoVacunaCovidId = [];
   var tipoVacunaCovidId = $("#filtroTipoVacunaCovidHisVacCov").val();
   
   if(tipoVacunaCovidId != null){
      tipoVacunaCovidId.forEach(function(val){
         listTipoVacunaCovidId.push(parseInt(val));
      });
   }
   
   functionCallBack();
}

function verTablaConsolidadoHistorialVacunaCovid(){  
   $("#wrapperConsolidadoHistorialVacunaCovid").remove();
   $(".divContainerGeneral").hide();  
   
   var buttonVolver=
      "<button type='button' id='btnVolverVistaMedicoCovid' class='btn btn-success' style='margin-right:10px' " +
              "onclick='volverVistaMedicoCovidConHisVacCov()' title='Regresar a la vista anterior'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonFiltro = 
      "<button id='btnActivarFiltroConHisVacCov' type='button' onclick='verFiltroHistorialVacunaCovid()' "+
	      "style='margin-right:10px' title='Filtro' class='btn btn-success'>"+
         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
      "</button>";
   
   var buttonClip = 
      "<button id='btnClipConsolidadoConHisVacCov' type='button' onclick='copiarConsolidadoHistorialVacunaCovid()' "+
	      "style='margin-right:10px' title='Copiar la información de la tabla actual' class='btn btn-success'>"+
         "<i class='fa fa-2x fa-clipboard' aria-hidden='true'></i>"+
      "</button>";
   
   var buttonGrafico = 
      "<button id='btnGraficoConHisVacCov' type='button' onclick='verGraficoEstadoActualVacunasCovid()' "+
	      "style='margin-right:10px' title='Ver gráfico con los valores de la tabla actual' class='btn btn-success'>"+
         "<i class='fa fa-2x fa-bar-chart' aria-hidden='true'></i>"+
      "</button>";
   
   var buttonExcel = 
      (isNaN(parseInt(getSession("trabajadorGosstId"))) == false?"":
       "<button id='btnExcelConsolidadoConHisVacCov' type='button' onclick='descargarConsolidadoHistorialVacunaCovid()' "+
	       "title='Descargar consolidado Historial de vacunas COVID-19' class='btn btn-success'>"+
          "<i class='fa fa-2x fa-file-excel-o' aria-hidden='true'></i>"+
       "</button>");
   
   $("body").append(
      "<div id='divHistorialVacunaCovidTabla' style='padding-left:40px;'>" +
         "<form class='form-inline' id='formBtnGeneral'>"+
             buttonVolver+buttonFiltro+buttonClip+buttonGrafico+buttonExcel+
	 "</form>"+
	 "<div class='wrapper' id='wrapperConsolidadoHistorialVacunaCovid'>" +
            "<table style='min-width:100%' id='tblConsolidadoHistorialVacunaCovid' " +
		   "class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
		   (isNaN(parseInt(getSession("trabajadorGosstId"))) == false?
		    "<tr>" +
		       "<th class='tb-acc' rowspan='3' style='width:250px'>Estado actual</th>" +
//			      "<th class='tb-acc' rowspan='3' style='width:180px'>" +
//		                 "¿Está dentro del rango de edad para vacunarse? <br> (>= 18 años)</th>" +
		       "<th class='tb-acc' colspan='4' style='width:600px'>Documentos</th>" +
		       "<th class='tb-acc' colspan='2' style='width:600px'>Trabajador</th>" +
		    "</tr>"+
		    "<tr>"+
		       "<th class='tb-acc' rowspan='2'>Carné de vacunación</th>" +
		       "<th class='tb-acc' rowspan='2'>Parte frontal - DNI</th>" +
		       "<th class='tb-acc' rowspan='2'>Estado</th>" +
		       "<th class='tb-acc' rowspan='2'>Historial de evaluación</th>" +
		       "<th class='tb-acc' rowspan='2'>Nombre</th>" +
		       "<th class='tb-acc' rowspan='2'>Área</th>" +
		    "</tr>"
		    :  
		    "<tr>" +
		       "<th class='tb-acc' rowspan='3' style='width:250px'>Estado actual</th>" +
//		              "<th class='tb-acc' rowspan='3' style='width:180px'>" +
//		                 "¿Está dentro del rango de edad para vacunarse? <br> (>= 18 años)</th>" +
		       "<th class='tb-acc' colspan='4' style='width:600px'>Documentos</th>" +
		       "<th class='tb-acc' rowspan='3' style='width:150px'>¿Pertenece al grupo de riesgo?</th>" +
	               "<th class='tb-acc' colspan='5' style='width:1250px'>Trabajador</th>" +
	               "<th class='tb-acc' rowspan='3' style='width:250px'>Tipo de vacuna</th>" +
	               "<th class='tb-acc' colspan='2' style='width:500px'>Primera Dosis</th>" +
	               "<th class='tb-acc' colspan='2' style='width:500px'>Segunda Dosis</th>" +
	               "<th class='tb-acc' colspan='2' style='width:500px'>Tercera Dosis</th>" +
	               "<th class='tb-acc' colspan='2' style='width:500px'>Cuarta Dosis</th>" +
	               "<th class='tb-acc' rowspan='3' style='width:250px'>Registrado el</th>" +
	   	    "</tr>"+
                    "<tr>"+
                       "<th class='tb-acc' rowspan='2'>Carné de vacunación</th>" +
		       "<th class='tb-acc' rowspan='2'>Parte frontal - DNI</th>" +
		       "<th class='tb-acc' rowspan='2'>Estado</th>" +
		       "<th class='tb-acc' rowspan='2'>Historial de evaluación</th>" +
		       "<th class='tb-acc' rowspan='2'>DNI</th>" +
		       "<th class='tb-acc' rowspan='2'>Nombre</th>" +
		       "<th class='tb-acc' rowspan='2'>Edad</th>" +
		       "<th class='tb-acc' rowspan='2'>División</th>" +
		       "<th class='tb-acc' rowspan='2'>Área</th>" +
		       "<th class='tb-acc' rowspan='2'>Fecha</th>" +
		       "<th class='tb-acc' rowspan='2'>Observación</th>" +
		       "<th class='tb-acc' rowspan='2'>Fecha</th>" +
		       "<th class='tb-acc' rowspan='2'>Observación</th>" +
		       "<th class='tb-acc' rowspan='2'>Fecha</th>" +
		       "<th class='tb-acc' rowspan='2'>Observación</th>" +
		       "<th class='tb-acc' rowspan='2'>Fecha</th>" +
		       "<th class='tb-acc' rowspan='2'>Observación</th>" +
                    "</tr>")+
	       "</thead>" +
	       "<tbody></tbody>" +
            "</table>" +
	 "</div>" +
      "</div>");
   
   crearFiltroHistorialVacunaCovid(valoresFiltroHistorialVacunaCovid);
   tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Consolidado Historial de vacunas COVID-19");
   resizeDivWrapper("wrapperConsolidadoHistorialVacunaCovid",190);	
}

var numVacunacionIncompleta,numVacunacionCompleta;

function cargarConsolidadoHistorialVacunaCovid(){
   var estadoActualId = parseInt($("#selEstadoActualConHisVacCov").val());
//   var dentroRangoFechaId = parseInt($("#selDentroRangoFechaVacCov").val());
   var dentroGrupoRiesgoId;
   
   if(isNaN(parseInt(getSession("trabajadorGosstId"))) == true){
      dentroGrupoRiesgoId = parseInt($("#selDentroGrupoRiesgoCov").val());
   }
	
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      listTipoVacunaCovidIdFiltro: (listTipoVacunaCovidId == 0?null:listTipoVacunaCovidId),	
      estadoActualIdFiltro: (estadoActualId == -1?null:estadoActualId)
//      dentroRanFecVacIdFiltro: (dentroRangoFechaId == -1?null:dentroRangoFechaId)
   };
   
   if(isNaN(parseInt(getSession("trabajadorGosstId"))) == false){
      dataParam.trabajadorResponsableId = parseInt(getSession("trabajadorGosstId"));
   }else{
      dataParam.dentroGrupoRiesgoIdFiltro = (dentroGrupoRiesgoId == -1?null:dentroGrupoRiesgoId);
   }
   
   numVacunacionIncompleta=0,numVacunacionCompleta=0;
   
   callAjaxPost(URL+'/covid/historial_vacuna/trabajadores',dataParam,function(data){
      listFullConsolidadoHistorialVacCov = data.valoresConsolidado;
      
      $("#tblConsolidadoHistorialVacunaCovid tbody tr").remove();
	
      listFullConsolidadoHistorialVacCov.forEach(function(val,index){
         var estadoActualRegistro = "",colorAsociado = "";
         var intervaloPrimeraDosis,intervaloSegundaDosis,edadSegundaDosis,
             intervaloTerceraDosis,edadTerceraDosis;
         
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
            if(val.fechaSegundaDosisTexto != "------"){
               if(val.fechaTerceraDosisTexto != "------"){
        	  if(val.fechaCuartaDosisTexto != "------"){
        	     estadoActualRegistro = "Vacunación completa";
      		     colorAsociado = "blue;"; 
      		     numVacunacionCompleta++;  
        	  }else{
        	     if(val.diferenciaDiasTerceraDosis >= intervaloTerceraDosis && val.trabajador.edad > edadTerceraDosis){
        		estadoActualRegistro = "Vacunación incompleta";
        		colorAsociado = "red;"; 
        		numVacunacionIncompleta++; 
        	     }else{
        		estadoActualRegistro = "Vacunación completa";
        		colorAsociado = "blue;"; 
        		numVacunacionCompleta++; 
        	     }   
        	  }  
               }else{
        	  if(val.diferenciaDiasSegundaDosis >= intervaloSegundaDosis){
        	     estadoActualRegistro = "Vacunación incompleta";
             	     colorAsociado = "red;"; 
             	     numVacunacionIncompleta++; 
                  }else{
                     estadoActualRegistro = "Vacunación completa";
            	     colorAsociado = "blue;"; 
            	     numVacunacionCompleta++; 
                  } 
               }
            }else{
               if(val.diferenciaDiasPrimeraDosis >= intervaloPrimeraDosis){
        	  estadoActualRegistro = "Vacunación incompleta";
         	  colorAsociado = "red;"; 
         	  numVacunacionIncompleta++; 
               }else{
        	  estadoActualRegistro = "Vacunación completa";
        	  colorAsociado = "blue;"; 
        	  numVacunacionCompleta++; 
               }   
            }	 
         }else if(val.tipoVacunaCovid.numDosis == 3){
            if(val.fechaSegundaDosisTexto != "------"){
               if(val.fechaTerceraDosisTexto != "------"){
        	  estadoActualRegistro = "Vacunación completa";
         	  colorAsociado = "blue;"; 
         	  numVacunacionCompleta++;  
               }else{
          	  if(val.diferenciaDiasTerceraDosis >= intervaloSegundaDosis && val.trabajador.edad > edadSegundaDosis){
          	     estadoActualRegistro = "Vacunación incompleta";
           	     colorAsociado = "red;"; 
           	     numVacunacionIncompleta++; 
          	  }else{
          	     estadoActualRegistro = "Vacunación completa";
          	     colorAsociado = "blue;"; 
          	     numVacunacionCompleta++; 
          	  } 
               }
            }else{
               if(val.diferenciaDiasPrimeraDosis >= intervaloPrimeraDosis){
        	  estadoActualRegistro = "Vacunación incompleta";
          	  colorAsociado = "red;"; 
          	  numVacunacionIncompleta++; 
               }else{
        	  estadoActualRegistro = "Vacunación completa";
         	  colorAsociado = "blue;"; 
         	  numVacunacionCompleta++; 
               }   
            }	  
         }else{
            estadoActualRegistro = "Vacunación incompleta";
            colorAsociado = "red;";
            numVacunacionIncompleta++;
         }
       
         var enlaceDescargaCarVacCov = (val.trabajador.fechaRegistroEvidenciaVacunacionTexto == ""?
            "<label style='color:#D1D619;'>Pendiente</label>":
 	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
 	       "href='"+URL+"/covid/vacunacion/evidencia?trabajadorId="+val.trabajador.trabajadorId+"'>" +
 	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
 	    "</a>");
 	 	    
         var enlaceDescargaDni = (val.trabajador.fechaRegistroEvidenciaVacunacionTexto == ""?
 	    "<label style='color:#D1D619;'>Pendiente</label>":
 	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
 	       "href='"+URL+"/covid/trabajador_dni/evidencia?trabajadorId="+val.trabajador.trabajadorId+"'>" +
 	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
 	    "</a>");
     
         var btnHistorialEvalVac = (val.numRegHistoriaEvaCarVac == 0?"------":
            "<button class='btn btn-success' onclick='verHistorialEvaluacionCarneVacunacion("+index+")'>" +
  	       "<i class='fa fa-eye fa-2x'></i>" +
  	    "</button>");
         
         var textEstadoRevision = 
            (val.evaluacionVacunacion.id == -1?"------":
              val.evaluacionVacunacion.icono+" "+val.evaluacionVacunacion.nombre);
    	  
         $("#tblConsolidadoHistorialVacunaCovid tbody").append(
            "<tr>" +
                (isNaN(parseInt(getSession("trabajadorGosstId"))) == false?
                 "<td><label style='color:"+colorAsociado+"'>"+estadoActualRegistro+"</label></td>" +
//                 "<td><label>"+(val.trabajador.edad >= 18?"Sí":"No")+"</label></td>" +
                 "<td>"+enlaceDescargaCarVacCov+"</td>" +
                 "<td>"+enlaceDescargaDni+"</td>" +
                 "<td>"+textEstadoRevision+"</td>" +
                 "<td>"+btnHistorialEvalVac+"</td>" +
     		 "<td>"+val.trabajador.nombre+"</td>" +
     		 "<td>"+val.trabajador.areaNombre+"</td>"
     		 :
                 "<td><label style='color:"+colorAsociado+"'>"+estadoActualRegistro+"</label></td>" +
//                 "<td><label>"+(val.trabajador.edad >= 18?"Sí":"No")+"</label></td>" +
                 "<td>"+enlaceDescargaCarVacCov+"</td>" +
                 "<td>"+enlaceDescargaDni+"</td>" +
                 "<td>"+textEstadoRevision+"</td>" +
                 "<td>"+btnHistorialEvalVac+"</td>" +
                 "<td><label>"+(val.dentroGrupoRiesgoCovid == 1?"Sí":"No")+"</label></td>" +
		 "<td>"+val.trabajador.dni+"</td>" +
		 "<td>"+val.trabajador.nombre+"</td>" +
		 "<td>"+val.trabajador.edad+"</td>" +
		 "<td>"+val.trabajador.divisionNombre+"</td>" +
		 "<td>"+val.trabajador.areaNombre+"</td>" +
		 "<td>"+val.tipoVacunaCovid.nombre+"</td>" +
		 "<td>"+val.fechaPrimeraDosisTexto+"</td>" +
		 "<td>"+(val.observacionPrimeraDosis == ""?
		         "------":val.observacionPrimeraDosis)+"</td>" +
		 "<td>"+val.fechaSegundaDosisTexto+"</td>" +
		 "<td>"+(val.observacionSegundaDosis == ""?
		         "------":val.observacionSegundaDosis)+"</td>" +
		 "<td>"+val.fechaTerceraDosisTexto+"</td>" +
	         "<td>"+(val.observacionTerceraDosis == ""?
			 "------":val.observacionTerceraDosis)+"</td>" +
	         "<td>"+val.fechaCuartaDosisTexto+"</td>" +
	         "<td>"+(val.observacionCuartaDosis == ""?
			 "------":val.observacionCuartaDosis)+"</td>" +
		 "<td>"+val.fechaRegistroTexto+"</td>") +
	    "</tr>");
      });
	
      goheadfixedY("#tblConsolidadoHistorialVacunaCovid","#wrapperConsolidadoHistorialVacunaCovid");
   });
}

function copiarConsolidadoHistorialVacunaCovid(){
   var list = obtenerDatosBodyTablaEstandar("tblConsolidadoHistorialVacunaCovid");
   copiarAlPortapapeles(list,"btnClipConsolidadoConHisVacCov");
   
   mensajeUx="<label>Se han copiado todas las filas del Consolidado " +
   		            "Historial de vacunas COVID-19.</label>";
   mensajesUx(mensajeUx,1,"");
}

function descargarConsolidadoHistorialVacunaCovid(){
   window.open(URL+"/covid/historial_vacuna/excel?empresaId="+parseInt(getSession("gestopcompanyid")));
}

function verHistorialEvaluacionCarneVacunacion(pindex){
   $("#wrapHistorialEvalCarVac").remove();
     
   var listModal={
      id: "modalHistorialEvalCarVac",
      nombre: "Historial evaluación carné de vacunación - "+listFullConsolidadoHistorialVacCov[pindex].trabajador.nombre,
      contenido:
         "<button class='btn btn-info' id='btnVolverTablaTrabConExo' " +
 	         "title='Regresar al consolidado' onclick='volverTablaPrincipalConHisVacCov()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapHistorialEvalCarVac'>" +
 	    "<table id='tblTrabConExoneracion' style='width:950px' " +
 		   "class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 		     "<td class='tb-acc' style='width:200px'>Carné de vacunación</td>" +
 		     "<td class='tb-acc' style='width:200px'>Parte frontal - DNI</td>" +
 		     "<td class='tb-acc' style='width:150px'>Evaluación</td>" +
 		     "<td class='tb-acc' style='width:200px'>Observación realizada</td>" +
 		     "<td class='tb-acc' style='width:200px'>Fecha de evaluación</td>" +
 		  "</tr>" +
 	       "</thead>"+
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 	
   agregarModalPrincipalUsuario(listModal);
    
   cargarTablaHistorialEvaluacionCarneVacunacion(pindex);
    
   resizeDivWrapper("wrapHistorialEvalCarVac",200);
 //   goheadfixedY("#tblTrabConExoneracion","#wrapTrabConExoneracion");
}

function cargarTablaHistorialEvaluacionCarneVacunacion(pindex){
   var dataParam={    
      id: listFullConsolidadoHistorialVacCov[pindex].id
   }
	   
   var listFullHistorialEvalCarVac = [];
   
   callAjaxPost(URL+'/covid/historial_evaluacion_carne_vacunacion',dataParam,function(data){
      listFullHistorialEvalCarVac = data.listFullHistorialEvalCarVac;
      $("#tblTrabConExoneracion tbody tr").remove();
	      
      listFullHistorialEvalCarVac.forEach(function(val,index){
	 var enlaceDescargaCarVacCov = 
	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/historial_evaluacion_carne_vacunacion/vacunacion/evidencia?" +
	       	      "historialEvaCarVacId="+val.historialEvaCarVacId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>";
	 	 	    
	 var enlaceDescargaDni = 
	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/historial_evaluacion_carne_vacunacion/trabajador_dni/evidencia?" +
	       	      "historialEvaCarVacId="+val.historialEvaCarVacId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>";
	 
	 var textEstadoRevision = val.evaluacionVacunacion.icono+" "+val.evaluacionVacunacion.nombre;
	 var evalVacunacionUsuario = val.evaluacionVacunacion.usuario.nombre;
	 var evalVacunacionFecha = val.evaluacionVacunacion.fechaTexto;
	   
         $("#tblTrabConExoneracion tbody").append(
            "<tr>" +
               "<td>"+enlaceDescargaCarVacCov+"</td>" +
	       "<td>"+enlaceDescargaDni+"</td>" +
	       "<td>"+textEstadoRevision+"</td>" +
	       "<td>"+val.evaluacionVacunacion.observacion+"</td>" +
	       "<td>"+evalVacunacionFecha+" <br> (Por "+evalVacunacionUsuario+")"+"</td>" +
            "</tr>");
      });
	      
      goheadfixedY("#tblTrabConExoneracion","#wrapHistorialEvalCarVac");
   });    
}

function volverTablaPrincipalConHisVacCov(){
   $("#modalHistorialEvalCarVac").modal("hide");  
}

function verGraficoEstadoActualVacunasCovid(){
   $("#modalGraficoEstadoVacCovTra").remove();
    
   var modalOptions={
      id: "modalGraficoEstadoVacCovTra",
      maxWidth: "900px",
      nombre: "Gráfico Estado Actual vacunas COVID-19 - Número de trabajadores",
      dontRemoveBack: true,
      contenido: "<div id='divGraficoEstadoVacCovTra'></div>"
   };
	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
	 	
   Highcharts.chart('divGraficoEstadoVacCovTra',{
      chart: {
	 type: 'column'},
	 title: {
	    text: "Gráfico Estado Actual vacunas COVID-19 - Número de trabajadores"},
	 xAxis: {
	    categories: ["Vacunación incompleta","Vacunación completa"]},
	 yAxis: {
	    title: {
	    text: "Número de trabajadores"}},
	 plotOptions: {
	    column: {
               dataLabels: {
	 	  enabled: true},
	       enableMouseTracking: false}},
	 series: [{
	    name: "Número de trabajadores",
	    data: [numVacunacionIncompleta,numVacunacionCompleta]}]
   });
}

function volverVistaMedicoCovidConHisVacCov(){
   $("#divHistorialVacunaCovidTabla").remove();
   $("#modalFiltroHistorialVacunaCovid").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   //$("#subConsolidado").hide();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
}
