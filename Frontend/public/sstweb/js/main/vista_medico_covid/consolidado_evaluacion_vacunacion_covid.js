
var listFullConsolidadoEvalCarVacCov=[];
var listTiposNotaCarVacCov = [];
var listTiposNotaId = [];
var mensajeUx;


function ocultarFiltroEvaluacionVacunacionCovid(){
   $("#modalFiltroEvaluacionVacunacionCovid").modal("hide");
}

function verFiltroEvaluacionVacunacionCovid(){
   $("#modalFiltroEvaluacionVacunacionCovid").modal("show");
}

function crearFiltroEvaluacionVacunacionCovid(functionCallBack){
   var dataParam={}; 
		
   callAjaxPost(URL+'/covid/vacuna/trabajadores/filtro',dataParam,function(data){  
      var listTiposNotaEval = data.listTiposNota;
      
      var contenido = "";
				
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroTipoNotaEvaCarVacCov"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	                "onclick='ocultarFiltroEvaluacionVacunacionCovid()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	        "</button>",
	  inputForm:"<button id='btnAplicarFiltroHisVacCov' class='btn btn-success' type='submit' " +
	                    "style='float:right;font-size:18px;'>" +
	               "<i class='fa fa-filter'></i> Aplicar filtro" +
	            "</button>"}
      ];
    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
				
      var modalOptionsCov={
         id:"modalFiltroEvaluacionVacunacionCovid",
         nombre:"<i class='fa fa-filter'></i> Filtro - Evaluación carné vacunación COVID-19",
         contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroTipoNotaEvaCarVacCov").length > 0){
	    return;
         }
         
         listTiposNotaEval.forEach(function(val){
            if(val.id == 3 || val.id == 4){
               val.selected = 1;
            }    
         });
         
         crearSelectOneMenuObligMultipleCompleto("filtroTipoNotaEvaCarVacCov","",listTiposNotaEval,
            "id","nombre","#divFiltroTipoNotaEvaCarVacCov","Todos");
      },false);
				
      $("#btnAplicarFiltroHisVacCov").on("click",function(){
    	 ocultarFiltroEvaluacionVacunacionCovid(); 
    	 functionCallBack(cargarConsolidadoEvaluacionVacunacionCovid);
      });
				
      $("#modalFiltroEvaluacionVacunacionCovid").modal("hide");
      functionCallBack(cargarConsolidadoEvaluacionVacunacionCovid);
   });
}

function valoresFiltroEvaluacionVacunacionCovid(functionCallBack){
   listTiposNotaId = [];
   
   var tipoNotaEvalId = 
      ($("#filtroTipoNotaEvaCarVacCov").val() == undefined?
       [3,4]:$("#filtroTipoNotaEvaCarVacCov").val());
   
   if(tipoNotaEvalId != null){
      tipoNotaEvalId.forEach(function(val){
	 listTiposNotaId.push(parseInt(val));
      });
   }
   
   functionCallBack();
}

function verTablaConsolidadoEvaluacionVacunacionCovid(){  
   $("#wrapperConsolidadoEvaluacionVacunacionCovid").remove();
   $(".divContainerGeneral").hide();  
   
   var buttonVolver=
      "<button type='button' id='btnVolverVistaMedicoCovid' class='btn btn-success' style='margin-right:10px' " +
              "onclick='volverVistaMedicoCovidConEvalCarVacCov()' title='Regresar a la vista anterior'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonFiltro = 
      "<button id='btnActivarFiltroConHisVacCov' type='button' onclick='verFiltroEvaluacionVacunacionCovid()' "+
			      "style='margin-right:10px' title='Filtro' class='btn btn-success'>"+
         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
      "</button>";
   
   $("body").append(
      "<div id='divEvaluacionVacunacionCovidTabla' style='padding-left:40px;'>" +
         "<form class='form-inline' id='formBtnGeneral'>"+
	     buttonVolver+buttonFiltro+
	 "</form>"+
         "<div class='wrapper' id='wrapperConsolidadoEvaluacionVacunacionCovid'>" +
            "<table style='min-width:100%' id='tblConsolidadoEvaluacionVacunacionCovid' " +
		   "class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:150px'>Registrado el</th>" +
		     "<th class='tb-acc' style='width:250px'>Detalle</th>" +
	             "<th class='tb-acc' style='width:150px'>Evaluación</th>" +
	             "<th class='tb-acc' style='width:200px'>Última observación realizada</th>" +
	             "<th class='tb-acc' style='width:200px'>Fecha de evaluación</th>" +
	          "</tr>"+
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" + 
      "</div>");
   
   crearFiltroEvaluacionVacunacionCovid(valoresFiltroEvaluacionVacunacionCovid);
   tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Evaluación - Carné vacunación COVID-19");
   resizeDivWrapper("wrapperConsolidadoEvaluacionVacunacionCovid",190);	
}

function cargarConsolidadoEvaluacionVacunacionCovid(){
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      listTipoNotaEvalIdFiltro : (listTiposNotaId == 0?null:listTiposNotaId),
   };
   
   if(isNaN(parseInt(getSession("trabajadorGosstId"))) == false){
      dataParam.trabajadorResponsableId = parseInt(getSession("trabajadorGosstId"));
   }
   
   callAjaxPost(URL+'/covid/vacuna/trabajadores',dataParam,function(data){
      listFullConsolidadoEvalCarVacCov = data.valoresConsolidadoEval;
      listTiposNotaCarVacCov = data.listTiposNota;
      
      $("#tblConsolidadoEvaluacionVacunacionCovid tbody tr").remove();
	
      listFullConsolidadoEvalCarVacCov.forEach(function(val,index){
	 var selEvaluacionCarneVacCov = crearSelectOneMenuOblig("selEvaluacionCarneVacCov"+val.id,
	    "guardarEvaluacionCarneVacunacionCovid("+val.id+")",listTiposNotaCarVacCov,
	    val.evaluacionVacunacion.id,"id","nombre");
	  
	 var enlaceDescargaCarVacCov = (val.trabajador.fechaRegistroEvidenciaVacunacionTexto == ""?"Pendiente":
            "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/vacunacion/evidencia?trabajadorId="+val.trabajador.trabajadorId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>");
		 	    
	 var enlaceDescargaDni = (val.trabajador.fechaRegistroEvidenciaVacunacionTexto == ""?"Pendiente":
	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/trabajador_dni/evidencia?trabajadorId="+val.trabajador.trabajadorId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>");
	  
         var textDetalle =  
            "*Trabajador: "+val.trabajador.nombre+"<br>" +
            "*DNI: "+val.trabajador.dni+"<br>" +
            "*Carné de vacunación: "+enlaceDescargaCarVacCov+"<br>" +
            "*Parte frontal - DNI: "+enlaceDescargaDni;
         
         var textEvaluacion = 
            val.evaluacionVacunacion.fechaTexto+"<br>" +
            (val.evaluacionVacunacion.usuario.nombre == ""?"":
             "(Revisado por "+val.evaluacionVacunacion.usuario.nombre+")");
         
         var textObservacion = 
            (val.evaluacionVacunacion.observacion == ""?"------":
             val.evaluacionVacunacion.observacion);
        
         $("#tblConsolidadoEvaluacionVacunacionCovid tbody").append(
            "<tr>" +
               "<td>"+val.trabajador.fechaRegistroEvidenciaVacunacionTexto+"</td>" +
	       "<td style='text-align:left;'>"+textDetalle+"</td>" +
	       "<td>"+selEvaluacionCarneVacCov + 
	              "<label id='labelAuxEvaCarVacCov"+val.id+"'>"+val.evaluacionVacunacion.icono+"</label>" +
	       "</td>" +
	       "<td id='tdObsEvaCarVacCov"+val.id+"'>"+textObservacion+"<br><br>" +
	         "<button class='btn btn-success' onclick='verEvalObsCarneVacunacionCovid("+index+","+val.id+")'>" +
	            "<i class='fa fa-pencil'></i> Editar" +
	         "</button>" +
	         "<label id='labelObsEvaCarVacCov"+val.id+"'></label>"+
	      "</td>" +	
	      "<td>"+textEvaluacion+"</td>" +
	      "</tr>");
      });
	
      goheadfixedY("#tblConsolidadoEvaluacionVacunacionCovid","#wrapperConsolidadoEvaluacionVacunacionCovid");
   });
}

function verEvalObsCarneVacunacionCovid(pindex,pidEval){
   var evalCarVacCovidObj = listFullConsolidadoEvalCarVacCov[pindex];
 	
   $("#tdObsEvaCarVacCov"+evalCarVacCovidObj.id).html(
      "<textarea rows='3' class='form-control' id='textObsEvaCarVacCov"+evalCarVacCovidObj.id+"'></textarea>" +
      "<button style='margin-right:10px;' class='btn btn-danger' " +
 	      "onclick='cancelarEditarEvalObsCarneVacunacionCovid("+pindex+","+pidEval+")'>" +
         "<i class='fa fa-times'></i> Cancelar" +
      "</button>" +
      "<button class='btn btn-success' onclick='guardarEvalObsCarneVacunacionCovid("+pindex+","+pidEval+")'>" +
         "<i class='fa fa-floppy-o'></i> Guardar" +
      "</button>");
    
   $("#textObsEvaCarVacCov"+evalCarVacCovidObj.id)
   .val(evalCarVacCovidObj.evaluacionVacunacion.observacion).focus();
}

function cancelarEditarEvalObsCarneVacunacionCovid(pindex,pidEval){
   var evalCarVacCovidObj = listFullConsolidadoEvalCarVacCov[pindex];
   
   var textObservacion = 
      (evalCarVacCovidObj.evaluacionVacunacion.observacion == ""?"------":
       evalCarVacCovidObj.evaluacionVacunacion.observacion);
 	
   $("#tdObsEvaCarVacCov"+evalCarVacCovidObj.id).html(
      textObservacion+"<br><br>" +
      "<button class='btn btn-success' onclick='verEvalObsCarneVacunacionCovid("+pindex+","+pidEval+")'>" +
         "<i class='fa fa-pencil'></i> Editar" +
      "</button>" +
      "<br>" +
      "<label id='labelObsEvaCarVacCov"+evalCarVacCovidObj.id+"'></label>");
}

function guardarEvalObsCarneVacunacionCovid(pindex,pidEval){
   var evalCarVacCovidObj = listFullConsolidadoEvalCarVacCov[pindex];
   var pidEvalCarVacCov = evalCarVacCovidObj.id;
   var evalObsCarVacCov = $("#textObsEvaCarVacCov"+pidEvalCarVacCov).val();
  
   var evalId = parseInt($("#selEvaluacionCarneVacCov"+pidEval).val());
   var esDistinto = (evalCarVacCovidObj.evaluacionVacunacion.observacion != evalObsCarVacCov?1:0);

   var dataParam={
      id: pidEvalCarVacCov,
      evaluacionVacunacion: {observacion: evalObsCarVacCov,
	                     id: evalId}
//      esDistinto: esDistinto
   }
 
   $("#labelObsEvaCarVacCov"+pidEvalCarVacCov).html("Guardando...");
    
   callAjaxPost(URL+'/covid/vacuna/carne_vacunacion/observacion/save',dataParam,function(data){
      evalCarVacCovidObj.evaluacionVacunacion.observacion = evalObsCarVacCov;
      cancelarEditarEvalObsCarneVacunacionCovid(pindex,pidEval);
      $("#labelObsEvaCarVacCov"+pidEvalCarVacCov).html("Guardado");
   });		
}

function guardarEvaluacionCarneVacunacionCovid(pidEval){
   var evalId = parseInt($("#selEvaluacionCarneVacCov"+pidEval).val());
 	
   var dataParam={
      id: pidEval,
      evaluacionVacunacion: {id: evalId}
   };
   
   if(isNaN(parseInt(getSession("trabajadorGosstId"))) == false){
      dataParam.trabajadorResponsableId = parseInt(getSession("trabajadorGosstId"));
   }
    
   $("#labelAuxEvaCarVacCov"+pidEval).html("Guardando...");
 	
   callAjaxPost(URL+'/covid/vacuna/carne_vacunacion/evaluacion/save',dataParam, function(data){
      listTiposNotaCarVacCov.forEach(function(val){
         if(val.id == evalId){
 	    $("#labelAuxEvaCarVacCov"+pidEval).html(val.icono+" Evaluación guardada");
         }
      });
   });	
}

function volverVistaMedicoCovidConEvalCarVacCov(){
   $("#divEvaluacionVacunacionCovidTabla").remove();
   $("#modalFiltroEvaluacionVacunacionCovid").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
}
