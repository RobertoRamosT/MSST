var listFullConsolidadoResumenCovid=[];
var listUnidadesId = [];
var listDivisionesId = [];
var listAreasId = [];
var listTiposConfirmacionCovidId = [];
var mensajeUx;
var fechaHoyTextoVal;

function ocultarFiltroConsolidadoSeguimientoCovid(){
   $("#modalFiltroConsolidadoSeguimientoCovid").modal("hide");
}

function verFiltroConsolidadoSeguimientoCovid(){
   $("#modalFiltroConsolidadoSeguimientoCovid").modal("show");
}

function crearFiltroConsolidadoSeguimientoCovid(functionCallBack){
      
   var dataParam={
	   empresaId: getSession("gestopcompanyid"),
	   idCompany: getSession("gestopcompanyid"),
	   valFiltroTipoCon: 1
		 }; 
		
   callAjaxPost(URL + '/covid/trabajadores/filtro',dataParam,function(data){
       
      var listUnidades= data.listUnidades;
      var listDivisiones= data.listDivisiones;
      var listAreas= data.listAreas;
      var listTiposConfirmacionCovid= data.listTiposConfirmacionCovid;
      fechaHoyTextoVal = data.fechaHoyTextoVal;
      var hoy=fechaHoyTextoVal;
      
      var contenido = "";
				
      var listContenido=[
              {sugerencia:"",label:"Fecha Inicio",inputForm:"<input type='date' id='fechaInicioConSegCov' class='form-control'>"},
              {sugerencia:"",label:"Fecha Fin",inputForm:"<input type='date' id='fechaFinConSegCov' class='form-control'>"},
              {sugerencia:"",label:"Unidad",inputForm:"",divContainer: "divFiltroUnidadesConsolidadoSeguimientoCovid"},
 	      {sugerencia:"",label:"División",inputForm:"",divContainer: "divFiltroDivisionesConsolidadoSeguimientoCovid"},
 	      {sugerencia:"",label:"Área",inputForm:"",divContainer: "divFiltroAreasConsolidadoSeguimientoCovid"},
	      {sugerencia:"",label:"Resultado de la observación",inputForm:"",divContainer:"divFiltroResultadosObservacionConsolidadoSeguimientoCovid"},
	      {sugerencia:"",label:"",inputForm:"",divContainer:""},
	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroConsolidadoSeguimientoCovid()'>" +
	      		              "<i class='fa fa-times'></i>Cancelar" +
	      		           "</button>",
	       inputForm:"<button id='btnAplicarFiltroConsolidadoSeguimientoCovid' class='btn btn-success' type='submit' " +
	       		         "onclick='cargarConsolidadoSeguimientoCovid()' style='float:right;'>" +
	       		    "<i class='fa fa-filter'></i>Aplicar filtro" +
	       		 "</button>"},
	                ];
				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
				
      var modalOptionsCov={
	     id: "modalFiltroConsolidadoSeguimientoCovid",
	     nombre: "<i class='fa fa-filter'></i>Filtros",
             contenido: "<div class='eventoGeneral'>"+contenido+"</form>"
                          };
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroUnidadesConsolidadoSeguimientoCovid").length > 0){
	    return;
         }
         
         crearSelectOneMenuObligMultipleCompleto("filtroUnidadesConsolidadoSeguimientoCovid","",listUnidades,"matrixId",
      	    "matrixName","#divFiltroUnidadesConsolidadoSeguimientoCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroDivisionesConsolidadoSeguimientoCovid","",listDivisiones,"divisionId",
      	    "divisionName","#divFiltroDivisionesConsolidadoSeguimientoCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroAreasConsolidadoSeguimientoCovid","",listAreas,"areaId",
      	    "areaName","#divFiltroAreasConsolidadoSeguimientoCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroResultadosObservacionConsolidadoSeguimientoCovid","",listTiposConfirmacionCovid,"id",
     	    	    "nombre","#divFiltroResultadosObservacionConsolidadoSeguimientoCovid","Todos");
      },false);
      
      $("#fechaInicioConSegCov").val(hoy);
      $("#fechaFinConSegCov").val(hoy);
				
      $("#btnAplicarFiltroConsolidadoSeguimientoCovid").on("click",function(){
         ocultarFiltroConsolidadoSeguimientoCovid() 
      });
				
      $("#modalFiltroConsolidadoSeguimientoCovid").modal("hide");
      functionCallBack();
   });
}

function valoresFiltroConsolidadoSeguimientoCovid(){
    
    listUnidadesId = [];
    var unidadId = $("#filtroUnidadesConsolidadoSeguimientoCovid").val();
    if(unidadId != null){
       unidadId.forEach(function(val){
          listUnidadesId.push(parseInt(val));
       });
    }
     
    listDivisionesId = [];
    var divisionId = $("#filtroDivisionesConsolidadoSeguimientoCovid").val();
    if(divisionId != null){
       divisionId.forEach(function(val){
          listDivisionesId.push(parseInt(val));
       });
    }
     
    listAreasId = [];
    var areaId = $("#filtroAreasConsolidadoSeguimientoCovid").val();
    if(areaId != null){
       areaId.forEach(function(val){
 	 listAreasId.push(parseInt(val));
       });
    }
    
   listTiposConfirmacionCovidId = [];
   var tipoConfirmacionCovidId = $("#filtroResultadosObservacionConsolidadoSeguimientoCovid").val();
   if(tipoConfirmacionCovidId != null){
      tipoConfirmacionCovidId.forEach(function(val){
	 listTiposConfirmacionCovidId.push(parseInt(val));
      });
    }
    
}

function verTablaConsolidadoSeguimientoCovid(){
    
   $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
   $("#wrapperConsolidadoSeguimientoCovid").remove();
   $(".divContainerGeneral").hide();  
   
   var buttonVolver="<button type='button' id='btnVolverVistaMedicoCovidConSegCov' class='btn btn-success ' style='margin-right:10px'" +
                           " onclick='volverVistaMedicoCovidConSegCov()' title='Regresar a la vista anterior'>" +
                       "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
                    "</button>";
   
   var buttonFiltro = "<button id='btnActivarFiltroConsolidadoSeguimientoCovid' type='button' onclick='verFiltroConsolidadoSeguimientoCovid()'"+
			      "style='margin-right:10px' title='Filtro' class='btn btn-success'>"+
		         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
		      "</button>";
   
   var buttonClip = "<button id='btnClipConsolidadoSeguimientoCovid' type='button' onclick='copiarConsolidadoSeguimientoCovid()'"+
                              "title='Copiar la información de la tabla actual' class='btn btn-success'>"+
                         "<i class='fa fa-2x fa-clipboard' aria-hidden='true'></i>"+
                      "</button>";
   
   $("body")
   .append("<div id='divConsolidadoSeguimientoCovidTabla' style='padding-left: 40px;'>" +
	         "<form class='form-inline' id='formBtnGeneral'>"+
		    buttonVolver+buttonFiltro+buttonClip+
		 "</form>"+
		 
		"<div class='wrapper' id='wrapperConsolidadoSeguimientoCovid'>" +
		   "<table style='min-width:100%' id='tblConsolidadoSeguimientoCovid' " +
		          "class='table table-striped table-bordered table-hover table-fixed'>" +
		      "<thead>" +
		         "<tr>" +
		            "<th class='tb-acc' rowspan='3' style='width:250px'>Fecha y hora de registro</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:250px'>Unidad</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:250px'>División</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:250px'>Área</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:400px'>Nombre</th>" +
			    "<th class='tb-acc' colspan='13' style='width:2750px'>Observación Médica COVID-19</th>" +
		         "</tr>"+
		         "<tr>"+
		            "<th class='tb-acc' rowspan='2'>Indicaciones al trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Comentario médico del trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Comentario del entorno familiar</th>" +
			    "<th class='tb-acc' colspan='7'>Prueba COVID-19</th>" +
			    "<th class='tb-acc' rowspan='2'>Estado del trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Resultado de la observación</th>" +
			    "<th class='tb-acc' rowspan='2'>Registrado por</th>" +
		         "</tr>"+
		         "<tr>"+
		            "<th class='tb-acc'>¿Se realizó la prueba?</th>" +
		            "<th class='tb-acc'>Fecha de la prueba</th>" +
		            "<th class='tb-acc'>Fecha del resultado</th>" +
		            "<th class='tb-acc'>Tipo de prueba</th>" +
		            "<th class='tb-acc'>Resultado de la prueba</th>" +
		            "<th class='tb-acc'>Comentario de la prueba</th>" +
		            "<th class='tb-acc'>Lugar de prueba</th>" +
		         "</tr>"+
		      "</thead>" +
		      "<tbody></tbody>" +
		   "</table>" +
	        "</div>" +
	     "</div>");
   
   crearFiltroConsolidadoSeguimientoCovid(cargarConsolidadoSeguimientoCovid);
   
   tituloAnteriorColaborador=$(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html(" Ver Consolidado - Seguimiento COVID-19");
   resizeDivWrapper("wrapperConsolidadoSeguimientoCovid",190);	
}

function cargarConsolidadoSeguimientoCovid(){
     
   valoresFiltroConsolidadoSeguimientoCovid();
    
   var hoy = fechaHoyTextoVal;
    
   var dataParam2={
	   empresaId:getSession("gestopcompanyid"),
	   trabajadorConRiesgo:2, //TODOS LOS TRABAJADORES
	   fechaObservacionMedicaInicio:($("#fechaInicioConSegCov").val() == undefined ?sumaFechaDias(-30,hoy):$("#fechaInicioConSegCov").val()),
	   fechaObservacionMedicaFin:($("#fechaFinConSegCov").val() == undefined ?hoy:$("#fechaFinConSegCov").val()),
	   listUnidadesIdFiltro : (listUnidadesId.length==0?null:listUnidadesId),
 	   listDivisionesIdFiltro : (listDivisionesId.length==0?null:listDivisionesId),
 	   listAreasIdFiltro : (listAreasId.length==0?null:listAreasId),
	   listResultadosDiaIdFiltro : (listTiposConfirmacionCovidId.length==0?null:listTiposConfirmacionCovidId)
   	    	  }

   callAjaxPost(URL+'/covid/consolidado_seguimiento_covid',dataParam2,function(data){
      listFullConsolidadoResumenCovid = data.trabajadores;
      $("#tblConsolidadoSeguimientoCovid tbody tr").remove();
	
      listFullConsolidadoResumenCovid.forEach(function(val){
         $("#tblConsolidadoSeguimientoCovid tbody")
	 .append("<tr>" +
		    "<td>"+val.fechaObservacionMedicaTexto+"</td>" +
		    "<td>"+val.area.matrixName+"</td>" +
		    "<td>"+val.area.divisionName+"</td>" +
		    "<td>"+val.area.areaName+"</td>" +
		    "<td>"+val.nombre+"</td>" +
		    "<td>"+val.diaObservacionMedica.indicaciones+"</td>" +
		    "<td>"+val.diaObservacionMedica.comentario+"</td>" +
		    "<td>"+val.diaObservacionMedica.comentarioEntornoFamiliar+"</td>" +
		    "<td>"+(val.diaObservacionMedica.resultadoPruebaCovid.id == -1?"No":"Sí")+"</td>" +
		    "<td>"+val.diaObservacionMedica.fechaPruebaTexto+"</td>" +
		    "<td>"+val.diaObservacionMedica.fechaResultadoTexto+"</td>" +
		    "<td>"+val.diaObservacionMedica.tipoPruebaCovid.nombre+"</td>" +
		    "<td>"+val.diaObservacionMedica.resultadoPruebaCovid.nombre+"</td>" +
		    "<td>"+val.diaObservacionMedica.comentarioPrueba+"</td>" +
		    "<td>"+val.diaObservacionMedica.lugarPrueba+"</td>" +
		    "<td>"+val.diaObservacionMedica.estadoMedicoCovid.nombre+"</td>" +
		    "<td>"+val.diaObservacionMedica.tipoConfirmacionCovid.nombre+"</td>" +
		    "<td>"+val.diaObservacionMedica.usuario.nombre+"</td>" +
	         "</tr>")
      });
	
      goheadfixedY("#tblConsolidadoSeguimientoCovid","#wrapperConsolidadoSeguimientoCovid");
   });
}

function copiarConsolidadoSeguimientoCovid(){
   var list=obtenerDatosBodyTablaEstandar("tblConsolidadoSeguimientoCovid");
   copiarAlPortapapeles(list,"btnClipConsolidadoSeguimientoCovid");
   mensajeUx="Se han copiado todas las filas del Consolidado Seguimiento - Trabajadores COVID-19.";
   mensajesUx(mensajeUx,1,"");
}

function volverVistaMedicoCovidConSegCov(){
   $("#divConsolidadoSeguimientoCovidTabla").remove();
   $("#modalFiltroConsolidadoSeguimientoCovid").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   //$("#subConsolidado").hide();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
//   numModificaciones = 0;
//   verLateralesFijosMedicoCovid();
 }
