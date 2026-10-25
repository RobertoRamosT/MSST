var listFullConsolidadoResumenCovid=[];
var listAreasId = [];
var listDivisionesId = [];
var listEstadosMedicoId = [];
var listTiposConfirmacionCovidId = [];
var listResponsableCovidId = [];
var listSitesId = [];
var listDivisionesTotales = [];
var numCasosRevisados;
var mensajeUx;

function ocultarFiltroConsolidadoResumenCovid(){
   $("#modalFiltroConsolidadoResumenCovid").modal("hide");
}

function verFiltroConsolidadoResumenCovid(){
   $("#modalFiltroConsolidadoResumenCovid").modal("show");
}

function crearFiltroConsolidadoResumenCovid(){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      idCompany: getSession("gestopcompanyid"),
      valFiltroTipoCon: 2
   }; 
		
   callAjaxPost(URL+'/covid/trabajadores/filtro',dataParam,function(data){  
      var listAreas = data.listAreas;
      var listDivisiones = data.listDivisiones;
      listDivisionesTotales = data.listDivisiones;
      var listEstadosMedico = data.listEstadosMedico;
      var listTiposConfirmacionCovid= data.listTiposConfirmacionCovid;
      var listAccesoMedicoCovid= data.listAccesoMedicoCovid;
      
      if(parseInt(getSession("gestopcompanyid")) == 524){
	 var listSites= data.listSites; 
      }
      
      var contenido = "";
				
      var listContenido=[
              {sugerencia:"",label:"Fecha Inicio",inputForm:"<input type='date' id='fechaInicioConResCov' class='form-control'>"},
              {sugerencia:"",label:"Fecha Fin",inputForm:"<input type='date' id='fechaFinConResCov' class='form-control'>"},
              (parseInt(getSession("gestopcompanyid")) == 524?
        	 {sugerencia:"",label:"Site",inputForm:"",divContainer:"divFiltroSitesConsolidadoResumenCovid"}:
                 {sugerencia:"",label:"",inputForm:""}),
              {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroAreasConsolidadoResumenCovid"},
              {sugerencia:"",label:"División",inputForm:"",divContainer:"divFiltroDivisionesConsolidadoResumenCovid"},
	      {sugerencia:"",label:"Último estado del trabajador",inputForm:"",divContainer:"divFiltroEstadosConsolidadoResumenCovid"},
	      {sugerencia:"",label:"Último resultado de la observación",inputForm:"",divContainer:"divFiltroResultadosObservacionConsolidadoResumenCovid"},
	      {sugerencia:"",label:"Responsable médico COVID-19",inputForm:"",divContainer:"divFiltroResponsableCovidConsolidadoResumenCovid"},
	      {sugerencia:"",label:"N° de días desde la última observación médica",
		             inputForm:"<input type='number' id='numDiasUltObsConResCov' class='form-control' min='0'>"},
	      {sugerencia:"",label:"Fecha estimada de retorno",inputForm:"<input type='date' id='fechaRetornoConResCov' class='form-control'>"},
	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroConsolidadoResumenCovid()'><i class='fa fa-times'></i>Cancelar</button>",
	            	 inputForm:"<button id='btnAplicarFiltroConsolidadoResumenCovid' class='btn btn-success' style='float:right;' " +
	            	 		   "type='submit' onclick='cargarConsolidadoResumenCovid()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
	                ];
				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
				
      var modalOptionsCov={id:"modalFiltroConsolidadoResumenCovid",nombre:"<i class='fa fa-filter'></i>Filtros",
		           contenido: contenido};
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroAreasConsolidadoResumenCovid").length > 0){
	    return;
         }
         
         crearSelectOneMenuObligMultipleCompleto("filtroAreasConsolidadoResumenCovid","",listAreas,"areaId",
        	    "areaName","#divFiltroAreasConsolidadoResumenCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroDivisionesConsolidadoResumenCovid","",listDivisiones,"divisionId",
          	    "divisionName","#divFiltroDivisionesConsolidadoResumenCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosConsolidadoResumenCovid","",listEstadosMedico,"id",
  	    	    "nombre","#divFiltroEstadosConsolidadoResumenCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroResultadosObservacionConsolidadoResumenCovid","",listTiposConfirmacionCovid,"id",
     	    	    "nombre","#divFiltroResultadosObservacionConsolidadoResumenCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroResponsableCovidConsolidadoResumenCovid","",listAccesoMedicoCovid,"userId",
      	            "nombrePersonal","#divFiltroResponsableCovidConsolidadoResumenCovid","Todos");
         
         if(parseInt(getSession("gestopcompanyid")) == 524){
            crearSelectOneMenuObligMultipleCompleto("filtroSitesConsolidadoResumenCovid","",listSites,"id",
            	 "nombre","#divFiltroSitesConsolidadoResumenCovid","Todos");
         }
      },false);
				
      $("#btnAplicarFiltroConsolidadoResumenCovid").on("click",function(){
         ocultarFiltroConsolidadoResumenCovid() 
      });
      
      $('#btnAplicarFiltroConsolidadoResumenCovid').click();
      
      $("#modalFiltroConsolidadoResumenCovid").modal("hide");
   });
}

function valoresFiltroConsolidadoResumenCovid(){
    
   listAreasId = [];
   var areaId = $("#filtroAreasConsolidadoResumenCovid").val();
   if(areaId != null){
      areaId.forEach(function(val){
	 listAreasId.push(parseInt(val));
      });
   }
   
   listDivisionesId = [];
   var divisionId = $("#filtroDivisionesConsolidadoResumenCovid").val();
   if(divisionId != null){
      divisionId.forEach(function(val){
         listDivisionesId.push(parseInt(val));
      });
   }
    
   listEstadosMedicoId = [];
   var estadoMedicoId = $("#filtroEstadosConsolidadoResumenCovid").val();
   if(estadoMedicoId != null){
      estadoMedicoId.forEach(function(val){
	 listEstadosMedicoId.push(parseInt(val));
      });
   }
    
   listTiposConfirmacionCovidId = [];
   var tipoConfirmacionCovidId = $("#filtroResultadosObservacionConsolidadoResumenCovid").val();
   if(tipoConfirmacionCovidId != null){
      tipoConfirmacionCovidId.forEach(function(val){
	 listTiposConfirmacionCovidId.push(parseInt(val));
      });
    }
    
   listResponsableCovidId = [];
   var responsableCovidId = $("#filtroResponsableCovidConsolidadoResumenCovid").val();
   if(responsableCovidId != null){
      responsableCovidId.forEach(function(val){
	  listResponsableCovidId.push(parseInt(val));
      });
   }
   
   if(parseInt(getSession("gestopcompanyid")) == 524){
      listSitesId = [];
      var siteId = $("#filtroSitesConsolidadoResumenCovid").val();
      if(siteId != null){
         siteId.forEach(function(val){
            listSitesId.push(parseInt(val));
         });
      } 
   }
}

function verTablaConsolidadoResumenCovid(){
    
   $("#fsBotones").remove();
   $("#divConsolidadoResumenCovidTabla").remove();
   $("#wrapperConsolidadoResumenCovid").remove();
   $(".divContainerGeneral").hide();  
   
   var buttonVolver="<button type='button' id='btnVolverVistaMedicoCovidConResCov' class='btn btn-success ' style='margin-right:5px'" +
                           " onclick='volverVistaMedicoCovidConResCov()' title='Regresar a la vista anterior'>" +
                       "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
                    "</button>";
   
   var buttonFiltro = "<button id='btnActivarFiltroConsolidadoResumenCovid' type='button' onclick='verFiltroConsolidadoResumenCovid()'"+
			      "style='margin-right:5px' title='Filtro' class='btn btn-success'>"+
		         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
		      "</button>";
   
   var buttonClip = "<button id='btnClipConsolidadoResumenCovid' type='button' onclick='copiarConsolidadoResumenCovid()'"+
                              "title='Copiar la información de la tabla actual' class='btn btn-success' style='margin-right:5px'>"+
                         "<i class='fa fa-2x fa-clipboard' aria-hidden='true'></i>"+
                      "</button>";
   
   var buttonIndCasActDivision = 
      "<button id='btnConsolidadoIndCasActDivision' type='button' onclick='verConsolidadoIndCasActDivision()'"+
              "title='Ver Consolidado Número trabajadores - Estado específico (Por División)' " +
              "class='btn btn-success' style='margin-right:5px'>"+
         "<i class='fa fa-2x fa-table' aria-hidden='true'></i>"+
      "</button>";
   
   $("body")
      .append("<div id='fsBotones'></div>"+
	      "<div id='divConsolidadoResumenCovidTabla' style='padding-left: 10px;'>" +
	         "<div class='table-responsive'>"+
	            "<table class='table table-bordered' style='width: 650px;' id='indicadorResumenTbl'>"+ 
		       "<thead>"+
		          "<tr>"+
			     "<th class='tb-acc'>Casos Totales</th>"+
			     "<th class='tb-acc'>Casos Pendientes</th>"+
			     "<th class='tb-acc'>Casos Revisados</th>"+
			  "</tr>"+
		       "</thead>"+
		       "<tbody>"+
		          "<tr>"+
			     "<td id='indicadorConResCov1' style='background-color:white' class='success'></td>"+
			     "<td id='indicadorConResCov2' style='background-color:white' class='success'></td>"+
			     "<td id='indicadorConResCov3' style='background-color:white' class='success'></td>"+
			  "</tr>"+
		       "</tbody>"+
		    "</table>"+
		"</div>"+ 
		"<div class='wrapper' id='wrapperConsolidadoResumenCovid'>" +
		   "<table style='min-width:100%' id='tblConsolidadoResumenCovid' " +
		          "class='table table-striped table-bordered table-hover table-fixed'>" +
		      "<thead>" +
		         "<tr>" +
		            "<th class='tb-acc' rowspan='3' style='width:200px'>Observación del día</th>" +
		            "<th class='tb-acc' rowspan='3' style='width:320px'>Observación del trabajador de hoy</th>" +
		            "<th class='tb-acc' rowspan='3' style='width:200px'>Carné de vacunación</th>" +
		            "<th class='tb-acc' rowspan='3' style='width:200px'>Parte frontal - DNI</th>" +
		            "<th class='tb-acc' rowspan='3' style='width:150px'>DNI</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:250px'>Nombre del trabajador</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:150px'>Teléfono</th>" +
			    "<th class='tb-acc' colspan='18' style='width:4500px'>Observación Médica COVID-19 - Último registro</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:200px'>Área</th>" +
			    (parseInt(getSession("gestopcompanyid")) == 524?
		               "<th class='tb-acc' rowspan='3' style='width:200px'>Site</th>":"") +
			    "<th class='tb-acc' rowspan='3' style='width:150px'>Días con síntoma(s) / posible contacto</th>" +
			    "<th class='tb-acc' colspan='4' style='width:680px'>Grupo de riesgo</th>" +
			    "<th class='tb-acc' colspan='8' style='width:1520px'>Formulario Renovable COVID-19</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:200px'>Médico(s) COVID-19  responsable(s)</th>" +
			    "<th class='tb-acc' rowspan='3' style='width:200px'>Fecha estimada de retorno</th>" +
		         "</tr>"+
		         "<tr>"+
		            "<th class='tb-acc' rowspan='2'>Añadir observación médica</th>" +
			    "<th class='tb-acc' rowspan='2'>Ver historial de observaciones</th>" +
			    "<th class='tb-acc' rowspan='2'>Fecha y hora</th>" +
			    "<th class='tb-acc' rowspan='2'>N° de días desde la última observación médica</th>" +
			    "<th class='tb-acc' rowspan='2'>Indicaciones al trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Comentario médico del trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Comentario del entorno familiar</th>" +
			    "<th class='tb-acc' rowspan='2'>Reporte contactos directos o estrechos</th>" +
			    "<th class='tb-acc' colspan='7'>Prueba COVID-19</th>" +
			    "<th class='tb-acc' rowspan='2'>Estado del trabajador</th>" +
			    "<th class='tb-acc' rowspan='2'>Resultado de la observación</th>" +
			    "<th class='tb-acc' rowspan='2'>Registrado por</th>" +
		            "<th class='tb-acc' rowspan='2'>Enfermedade(s) según su antedecente</th>" +
		            "<th class='tb-acc' rowspan='2'>Edad</th>" +
		            "<th class='tb-acc' rowspan='2'>¿Está embarazada?</th>" +
		            "<th class='tb-acc' rowspan='2'>IMC (Índice de Masa Corporal)</th>" +
		            "<th class='tb-acc' rowspan='2'>Fecha y hora de registro</td>" +
		            "<th class='tb-acc' rowspan='2'>Ver historial de formularios</th>" +
		            "<th class='tb-acc' rowspan='2'>Síntomas</th>" +
		            "<th class='tb-acc' rowspan='2'>Fecha de inicio de síntomas</th>" +
		            "<th class='tb-acc' rowspan='2'>Contacto con caso COVID-19 confirmado</th>" +
		            "<th class='tb-acc' rowspan='2'>Visita a centro médico</th>" +
		            "<th class='tb-acc' rowspan='2'>Ha realizado un viaje</th>" +
		            "<th class='tb-acc' rowspan='2'>Fecha de contacto</th>" +
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
   
   crearFiltroConsolidadoResumenCovid();
   
   $("#fsBotones").append(buttonVolver);
   $("#fsBotones").append(buttonFiltro);
   $("#fsBotones").append(buttonClip);
   $("#fsBotones").append(buttonIndCasActDivision);
   
   tituloAnteriorColaborador=$(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Consolidado Resumen - Casos activos COVID-19");
   resizeDivWrapper("wrapperConsolidadoResumenCovid",230);	
}

function cargarConsolidadoResumenCovid(){
    
   numCasosRevisados=0; 
   valoresFiltroConsolidadoResumenCovid();
   
   if(parseInt(getSession("gestopcompanyid")) == 524){
       var dataParam2={
	       empresaId:getSession("gestopcompanyid"),
	       trabajadorConRiesgo:2, //TODOS LOS TRABAJADORES
	       revisarRegistroDiarioCovid:1,
	       numDiasUltimaObservacion:($("#numDiasUltObsConResCov").val() == "" ?null:$("#numDiasUltObsConResCov").val()),
	       fechaFormularioCovidInicio:($("#fechaInicioConResCov").val() == "" ?null:$("#fechaInicioConResCov").val()),
	       fechaFormularioCovidFin:($("#fechaFinConResCov").val() == "" ?null:$("#fechaFinConResCov").val()),
	       fechaEstimadaRetornoFiltro:($("#fechaRetornoConResCov").val() == "" ?null:$("#fechaRetornoConResCov").val()),
	       listSitesIdFiltro : (listSitesId.length==0?null:listSitesId),
	       listAreasIdFiltro : (listAreasId.length==0?null:listAreasId),
	       listDivisionesIdFiltro : (listDivisionesId.length==0?null:listDivisionesId),
	       listEstadosMedicoIdFiltro : (listEstadosMedicoId.length==0?null:listEstadosMedicoId),
	       listResultadosIdFiltro : (listTiposConfirmacionCovidId.length==0?null:listTiposConfirmacionCovidId),
	       listResponsableCovidIdFiltro : (listResponsableCovidId.length==0?null:listResponsableCovidId)
	   	      } 
   }else{
      var dataParam2={
	      empresaId:getSession("gestopcompanyid"),
	      trabajadorConRiesgo:2, //TODOS LOS TRABAJADORES
	      revisarRegistroDiarioCovid:1,
	      numDiasUltimaObservacion:($("#numDiasUltObsConResCov").val() == "" ?null:$("#numDiasUltObsConResCov").val()),
	      fechaFormularioCovidInicio:($("#fechaInicioConResCov").val() == "" ?null:$("#fechaInicioConResCov").val()),
	      fechaFormularioCovidFin:($("#fechaFinConResCov").val() == "" ?null:$("#fechaFinConResCov").val()),
	      fechaEstimadaRetornoFiltro:($("#fechaRetornoConResCov").val() == "" ?null:$("#fechaRetornoConResCov").val()),
	      listAreasIdFiltro : (listAreasId.length==0?null:listAreasId),
	      listDivisionesIdFiltro : (listDivisionesId.length==0?null:listDivisionesId),
	      listEstadosMedicoIdFiltro : (listEstadosMedicoId.length==0?null:listEstadosMedicoId),
	      listResultadosIdFiltro : (listTiposConfirmacionCovidId.length==0?null:listTiposConfirmacionCovidId),
	      listResponsableCovidIdFiltro : (listResponsableCovidId.length==0?null:listResponsableCovidId)
	   	     }
   }

   callAjaxPost(URL+'/covid/covid_casos_activos/revisar',dataParam2,function(data){
       
      $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
       
      listFullConsolidadoResumenCovid = data.trabajadores;
      $("#tblConsolidadoResumenCovid tbody tr").remove();
	
      listFullConsolidadoResumenCovid.forEach(function(val,index){
	 var enlaceDescargaCarVacCov = (val.fechaRegistroEvidenciaVacunacionTexto == ""?
	    "<label style='color:#D1D619;'>Pendiente</label>":
	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/vacunacion/evidencia?trabajadorId="+val.trabajadorId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>");
	   	 	    
	 var enlaceDescargaDni = (val.fechaRegistroEvidenciaVacunacionTexto == ""?
	    "<label style='color:#D1D619;'>Pendiente</label>":
	    "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
	       "href='"+URL+"/covid/trabajador_dni/evidencia?trabajadorId="+val.trabajadorId+"'>" +
	       "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	    "</a>");
	  
         $("#tblConsolidadoResumenCovid tbody")
	 .append("<tr>" +
		    "<td>"+(val.hasSeguimientoMedicoHoy == 1?"<span style='color:blue;font-weight:bolder;'>Revisado</span>"
				                            :"<span style='color:red;font-weight:bolder;'>Pendiente</span>")+
	            "</td>" +
	            "<td>"+(val.estadoDiarioCovid.fechaGuardadoTexto != ''?
	                "<strong>*Trabajador: </strong>"+val.estadoDiarioCovid.estadoTrabajadorCovid.nombre+"<br>"+
	                "<strong>*Entorno: </strong>"+val.estadoDiarioCovid.estadoEntornoCovid.nombre+"":"")+
	            "</td>" +
	            "<td>"+enlaceDescargaCarVacCov+"</td>" +
	            "<td>"+enlaceDescargaDni+"</td>" +
		    "<td>"+val.dni+"</td>" +
		    "<td>"+val.nombre+"</td>" +
		    "<td>"+val.ultimoAntecedente.telefonoContacto+"</td>" +
		    "<td>" +
		       "<button type='button' id='btnAgregarObsMedConResCov' class='btn btn-success ' style='margin-right:10px'" +
                              " onclick='agregarObservacionMedica(2,"+index+")' " +
                              "title='Agregar una nueva observación médica al trabajador de esta fila'>" +
                          "<i class='fa fa-pencil-square-o fa-2x'></i>" +
                       "</button>" +
                    "</td>" +
                    "<td>" +
		       "<button type='button' id='btnVerHistorialObsMedConResCov' class='btn btn-success ' style='margin-right:10px' " +
                               "onclick='verHistorialObservacionMedica("+val.trabajadorId+")' " +
                               "title='Ver el historial de todas sus observaciones médicas del trabajador de esta fila'>" +
                          "<i class='fa fa-eye fa-2x'></i>" +
                       "</button>" +
                    "</td>" +
                    "<td>"+val.ultimaObservacionMedica.fechaTexto+"</td>" +
                    "<td>"+val.diferenciaDiasUltimaObservacion+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.indicaciones+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.comentario+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.comentarioEntornoFamiliar+"</td>" +
                    "<td>"+(val.ultimaObservacionMedica.reportaContactoDirectoEstrecho.length == 0?"------":
                	    val.ultimaObservacionMedica.reportaContactoDirectoEstrecho)+"</td>" +
                    "<td>"+val.hasPruebaCovid+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.fechaPruebaTexto+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.fechaResultadoTexto+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.tipoPruebaCovid.nombre+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.resultadoPruebaCovid.nombre+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.comentarioPrueba+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.lugarPrueba+"</td>" +
                    "<td>"+val.ultimaObservacionMedica.estadoMedicoCovid.nombre+"</td>" +
		    "<td>"+val.ultimaObservacionMedica.tipoConfirmacionCovid.nombre+"</td>" +
		    "<td>"+val.ultimaObservacionMedica.usuario.nombre+"</td>" +
		    "<td>"+val.area.areaName+"</td>" +
		    (parseInt(getSession("gestopcompanyid")) == 524?"<td>"+
		       "<sup><a>" +
		          "<i class='fa fa-building-o fa-2x' onclick='asignarSiteConResCov("+index+")'></i>" +
		       "</a></sup> " +
                           val.site.nombre+
                    "</td>":"") +
		    "<td>"+val.numDiasAislamiento+"</td>" +
		    "<td>"+val.ultimoAntecedente.listEnfermedadesNombre+"</td>" +
		    "<td>"+val.edad+"</td>" +
		    "<td>"+val.ultimoAntecedente.trimestreEmbarazo.nombre+"</td>" +
		    "<td>"+val.ultimoAntecedente.imc+"</td>" +
		    "<td>"+val.ultimoFormulario.fechaActualizacionTexto+"</td>" +
		    "<td>" +
		       "<button type='button' id='btnVerHistorialForRenConResCov' class='btn btn-success ' style='margin-right:10px'" +
                        " onclick='verHistorialFormularioCovid(2,"+index+")' title='Ver el historial de todas sus formularios renovables del trabajador de esta fila'>" +
                       "<i class='fa fa-eye fa-2x'></i>" +
                    "</button>" +
                 "</td>" +
                    "<td>"+val.ultimoFormulario.listSintomasNombre+"</td>" +
                    "<td>"+val.ultimoFormulario.fechaInicioSintomaTexto+"</td>" +
                    "<td>"+val.ultimoFormulario.respuestaUno.nombre+"</td>" +
		    "<td>"+val.ultimoFormulario.respuestaDos.nombre+"</td>" +
		    "<td>"+val.ultimoFormulario.respuestaTres.nombre+"</td>" +
		    "<td>"+val.ultimoFormulario.fechaInicioContactoTexto+"</td>" +
                    "<td>"+
		       "<sup><a>" +
		          "<i class='fa fa-user-md fa-2x' onclick='asignarResponsableVistaMedCov(2,"+index+")'" +
		            " title='Asignar al/a los médico(s) responsable(s) del trabajador en esta fila'></i>" +
		       "</a></sup> " +
                        val.listMedicosCovidNombre+
                    "</td>"+
                    "<td>"+val.fechaEstimadaRetornoTexto+"</td>" +
	         "</tr>");
         
         if(val.hasSeguimientoMedicoHoy == 1){
            numCasosRevisados++;
         }
      });
       
      $("#indicadorConResCov1").html("<strong>"+listFullConsolidadoResumenCovid.length+"</strong>");
      $("#indicadorConResCov2").html("<strong>"+(listFullConsolidadoResumenCovid.length - numCasosRevisados)+"</strong>");
      $("#indicadorConResCov3").html("<strong>"+numCasosRevisados+"</strong>");
      
      goheadfixedY("#tblConsolidadoResumenCovid","#wrapperConsolidadoResumenCovid");
   });
}

var objAuxTrabajadorCovidRevisar = {};
var listSite = [];

function ocultarAsignarSiteConResCov(){
   $("#modalAsignarSiteConResCov").modal("hide");
}

function asignarSiteConResCov(pindex){
   
   objAuxTrabajadorCovidRevisar = listFullConsolidadoResumenCovid[pindex]; 
   
   $("#modalAsignarSiteConResCov").remove(); 
   
   var dataParam={
 	   empresaId:getSession("gestopcompanyid")
 		 }; 
 		
   callAjaxPost(URL + '/covid/asignar/site',dataParam,function(data){
      var listSite= data.listSite;
      
      var selSite = crearSelectOneMenu("selSite","",listSite,
	      objAuxTrabajadorCovidRevisar.site.id,"id","nombre");
      
      var contenido = "";
 				
      var listContenido=[
 	      {sugerencia:"",label:"Site",inputForm:selSite},
 	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarAsignarSiteConResCov()'>" +
 	      		              "<i class='fa fa-times'></i>Cancelar" +
 	      		           "</button>",
 	                     inputForm:"<button id='btnAsignarSiteConResCov' style='float:right;' class='btn btn-success' type='submit'>" +
 	       		                  "<i class='fa fa-floppy-o'></i>Guardar" +
 	       		               "</button>"},
 	                ];
 				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
 				
      var modalOptionsCov={
	       id:"modalAsignarSiteConResCov",
	       nombre:"<i class='fa fa-building-o'></i> Asignar Site - Trabajador "+objAuxTrabajadorCovidRevisar.nombre,
	       contenido:contenido};
 				
      crearModalPrincipalUsuario(modalOptionsCov,function(){},false); 
 				
      $("#btnAsignarSiteConResCov").on("click",function(){
          guardarSiteAsignadoConResCov();
       });
 				
       $("#modalAsignarSiteConResCov").modal("show");
    });    
}

function guardarSiteAsignadoConResCov(){
   var campoVacio = true;
   
   var siteId = parseInt($("#selSite").val());
   
   if(campoVacio){
      var dataParam = {
       	      trabajadorId:objAuxTrabajadorCovidRevisar.trabajadorId,
       	      site:{id:siteId}
                      };
       
      callAjaxPost(URL+'/covid/asignar/site/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":	    
   	        $("#modalAsignarSiteConResCov").modal("hide");
   	        mensajeUx="El site fue asignado al trabajador con éxito.";
   	        mensajesUx(mensajeUx,1,"","MensajeExitoAsignarSiteConResCov");
   		
   	        $("#modalMensajeUxMensajeExitoAsignarSiteConResCov").on("hidden.bs.modal",function(){
   		   verTablaConsolidadoResumenCovid();
 		}); 
   	        break;
   	        
   	    default:
   	       console.log("Ocurrió un error al asignar el site al trabajador!");
         }
      });	
   }else{
      $("#modalAsignarSiteConResCov").modal("hide");
      
      mensajeUx="Debe asignar uno de los site al trabajador para continuar.";
      mensajesUx(mensajeUx,2,"","MensajeExitoAsignarSiteConResCov");
      
      $("#modalMensajeUxMensajeExitoAsignarSiteConResCov").on("hidden.bs.modal",function(){
         $("#modalAsignarSiteConResCov").modal("show");
      });
   }	
}

function copiarConsolidadoResumenCovid(){
   var list=obtenerDatosBodyTablaEstandar("tblConsolidadoResumenCovid");
   copiarAlPortapapeles(list,"btnClipConsolidadoResumenCovid");
   mensajeUx="Se han copiado todas las filas del Consolidado Resumen - Trabajadores COVID-19 (Pendientes/Revisados).";
   mensajesUx(mensajeUx,1,"");
}

function volverVistaMedicoCovidConResCov(){
   $("#divConsolidadoResumenCovidTabla").remove();
   $("#modalFiltroConsolidadoResumenCovid").remove();
   $("#fsBotones").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   //$("#subConsolidado").hide();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
   numModificaciones = 0;
   verLateralesFijosMedicoCovid();
}

function ocultarConsolidadoIndCasActDivision(){
   $("#modalConsolIndCasActDivision").modal("hide");
}

function verConsolidadoIndCasActDivision(){
   $("#modalConsolIndCasActDivision").remove(); 
   var listIndicadoresCasActDivision = [];
   
   var numInfecRespFinal=0,numSospechaSinFinal=0,numSospechaConFinal=0,
       numConCovidFinal=0,numRecupeEnObsFinal=0,numTotalFinal=0;

   listDivisionesTotales.forEach(function(val,index){
      var numInfecResp=0,numSospechaSin=0,numSospechaCon=0,
          numConCovid=0,numRecupeEnObs=0,numTotal=0;
       
      listFullConsolidadoResumenCovid.forEach(function(val1,index1){
	 if(val.divisionId == val1.area.divisionId){
	    if(val1.estadoEspecificoCovid.id == 10){
	       numInfecResp++;
	       numInfecRespFinal++;
	    }else if(val1.estadoEspecificoCovid.id == 11){
	       numSospechaSin++;
	       numSospechaSinFinal++;
	    }else if(val1.estadoEspecificoCovid.id == 9){
	       numSospechaCon++;
	       numSospechaConFinal++;
	    }else if(val1.estadoEspecificoCovid.id == 5){
	       numConCovid++;
	       numConCovidFinal++;
	    }else if(val1.estadoEspecificoCovid.id == 6){
	       numRecupeEnObs++;
	       numRecupeEnObsFinal++;
	    }
	    
	    numTotal++;
	    numTotalFinal++;
	 }
      });
      
      if(numTotal > 0){
	 listIndicadoresCasActDivision.push(
            {nombreDivision:val.divisionName,numInfecResp:numInfecResp,numSospechaSin:numSospechaSin,
             numSospechaCon:numSospechaCon,numConCovid:numConCovid,numRecupeEnObs:numRecupeEnObs,
             numTotal:numTotal}); 
      }
   });
   
   listIndicadoresCasActDivision.push(
      {nombreDivision:"Totales",numInfecResp:numInfecRespFinal,numSospechaSin:numSospechaSinFinal,
       numSospechaCon:numSospechaConFinal,numConCovid:numConCovidFinal,numRecupeEnObs:numRecupeEnObsFinal,
       numTotal:numTotalFinal});
   
   var listModal={
      id: "modalConsolIndCasActDivision",
      maxWidth: "1000px",
      nombre: "Consolidado Número trabajadores - Estado específico (Por División) ",
      contenido:
         "<button class='btn btn-info' id='btnVolverConIndCasActDiv' title='Regresar a la vista anterior.' " +
		 "onclick='ocultarConsolidadoIndCasActDivision()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnClipConIndCasActDiv' title='Copiar la información de la tabla actual.' " +
                 "onclick='copiarConsolidadoIndCasActDivision()' style='margin-left: 5px'>" +
            "<i class='fa fa fa-clipboard fa-2x'></i>" +
         "</button>" +
	 "<div class='wrapper' id='wrapConIndCasActDiv'>" +
            "<table id='tblConIndCasActDiv' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' style='width:250px'>División</td>" +
		     "<td class='tb-acc' style='width:200px'>Trabajadores con infección respiratoria</td>" +
		     "<td class='tb-acc' style='width:200px'>Trabajadores con sospecha de COVID-19 por síntomas</td>" +
		     "<td class='tb-acc' style='width:200px'>Trabajadores con sospecha de COVID-19 por contacto</td>" +
		     "<td class='tb-acc' style='width:200px'>Trabajadores con COVID-19</td>" +
		     "<td class='tb-acc' style='width:200px'>Trabajadores recuperados – En observación </td>" +
		     "<td class='tb-acc' style='width:200px'>Totales</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"
   };
		
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConIndCasActDiv",200);
	    
   $("#tblConIndCasActDiv tbody tr").remove();
		
   listIndicadoresCasActDivision.forEach(function(val,index){
      $("#tblConIndCasActDiv tbody").append(
         "<tr id='trConIndCasActDiv"+(index+1)+"'>" +
	    "<td>"+val.nombreDivision+"</td>" +
	    "<td>"+val.numInfecResp+"</td>" +
	    "<td>"+val.numSospechaSin+"</td>" +
	    "<td>"+val.numSospechaCon+"</td>" +
	    "<td>"+val.numConCovid+"</td>" +
	    "<td>"+val.numRecupeEnObs+"</td>" +
	    "<td>"+val.numTotal+"</td>" + 
	 "</tr>");
   });
		
   goheadfixedY("#tblConIndCasActDiv","#wrapConIndCasActDiv");
}

function copiarConsolidadoIndCasActDivision(){
   var list = obtenerDatosTablaEstandar("tblConIndCasActDiv");
   copiarAlPortapapeles(list,"btnClipConIndCasActDiv");
   
   $("#modalConsolIndCasActDivision").modal("hide");
    
   mensajeUx = "<label>Se han copiado todas las filas de la tabla Consolidado " +
   	       "Número trabajadores - Estado específico (Por División).</label>";
   mensajesUx(mensajeUx,1,"","MensajeExitoFilasCopiadas");  
   
   $("#modalMensajeUxMensajeExitoFilasCopiadas").on("hidden.bs.modal",function(){
      $("#modalConsolIndCasActDivision").modal("show");
   });
}
