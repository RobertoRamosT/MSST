/**
 * 
 */
var listFullStatusDocumentos=[];
var listFullStatusExamenes=[];
var listEvaluacionStatusTotal=[];
var listFullStatusHojasVida=[];
var listEstadosEvalDocProColId=[];
var indexFunctionStatus=0;
var mensajeUx;

function toggleMenuOpcionStatus(obj,pindex,menu){
   indexFunctionStatus = pindex;
   $(obj).parent("#opciones"+menu).find("ul").toggle();
   $(obj).parent("#opciones"+menu).siblings().find("ul").hide();
}

var funcionalidadesStatus=[
   {menu:"0",
    opcion:[
       {id:"opcEvalDocumentosAux0",
	nombre:"<i class='fa fa-table'></i> Consolidado Evaluación general",
        functionClick:function(data){verConsolidadoEvaluacionDocumentosProyectoVisCol()}},
       {id:"opcShow",
	nombre:"<i class='fa fa fa-eye'></i> Ver",
        functionClick:function(data){showDivStatusDocumentos(indexFunctionStatus);}}]
   },
   {menu:"1",
    opcion:[
       {id:"opcEvalDocumentosAux1",
	nombre:"<i class='fa fa-table'></i> Consolidado Evaluación general",
        functionClick:function(data){verConsolidadoEvaluacionDocumentosProyectoVisCol()}},    
       {id:"opcHide",
	nombre:"<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar",
	functionClick:function(data){hideDivStatusDocumentos(indexFunctionStatus);}},
       {id:"opcTabla",
	nombre:"<i class='fa fa-table' aria-hidden='true'></i> Ver Tabla",
        functionClick:function(data){tablaResumenStatusDocumentos(indexFunctionStatus);}}]
   } 
];

function marcarSubOpcionStatus(pindex,pindex1){
   $("#opcioneshide .listaGestionGosst").hide();
   funcionalidadesStatus[pindex].opcion[pindex1].functionClick(); 
}

var menuOpcionStatus = [];

function ListarOpcionesStatus(){ 
   funcionalidadesStatus.forEach(function(val1,index1){
      var opciones = val1.opcion;
			
      menuOpcionStatus[index1]=
         "<ul class='list-group listaGestionGosst' style='width: 110px;top: 25px; display:none;'>";
	     
      opciones.forEach(function(val2,index2){
         menuOpcionStatus[index1]+=
	    "<li class='list-group-item' onclick='marcarSubOpcionStatus("+index1+","+index2+")'>" +
	        val2.nombre +
	    "</li>";
      });
	     
      menuOpcionStatus[index1]+="</ul>";
   });	
}

function cargarStatusDocumentosProyectoColaborador(indexProy){
   ListarOpcionesStatus();
   showDivStatusDocumentos();
   
   listEstadosEvalDocProColId = [];
   
   var estadoEvaluacionId = ($("#filtroEstadosEvaluacionEvaDocProCol").val() == undefined?
      [3,4,5,6]:$("#filtroEstadosEvaluacionEvaDocProCol").val()); 
	   
   if(estadoEvaluacionId != null){
      estadoEvaluacionId.forEach(function(val){
         listEstadosEvalDocProColId.push(parseInt(val));
      });
   }
 
   var numAprob = 0,numTotal = 0;
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador").html("<td colspan='3'></td>");
  
   var dataParamAct={
      id: proyectoObj.id,
      listEstadoId: (listEstadosEvalDocProColId.length == 0?null:listEstadosEvalDocProColId),
   };
   
   callAjaxPostNoUnlock(URL+'/contratista/proyecto/actividades',dataParamAct,function(data){
      listFullStatusDocumentos = data.list;
				
      listFullStatusDocumentos.sort(function(a,b){
         return -a.id+b.id;
      }).sort(function(a,b){
         return -a.evaluacion.nota.id+b.evaluacion.nota.id;
      });
      
      $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
	 .append("<div id='divEncabezadoProy01' style='background-color:#17E9E3;'>" +
		       "<i class='fa fa-info'></i> ACTIVIDADES " +
		 "</div>");
				
      listFullStatusDocumentos.forEach(function(val,index){
         var claseNotaDocumento = "gosst-neutral";
         numTotal++;
         
         val.observacion = (val.observacion == ""?"------":val.observacion);
         val.categoria.nombre = (val.tipo.id == 5?"------":val.categoria.nombre);
         val.descripcion = (val.descripcion == ""?"------":val.descripcion);
					
         if(val.evaluacion.nota.id == 1){
	    numAprob++;
	    claseNotaDocumento = "gosst-aprobado";
         }else if(val.evaluacion.nota.id == 2){
            claseNotaDocumento = "gosst-desaprobado"; 
         }else{
            claseNotaDocumento = "gosst-advertencia";  
         }
				
         var textoBotonDescarga = 
            (val.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
             "<a class='efectoLink' href='"+URL+"/contratista/proyecto/actividad/evidencia?id="+val.id+"' " +
                "target='_blank'>" +
                 val.evidenciaNombre +
             "</a>");
         
	 var textoBotonAgregar = "<a onclick='evaluarStatusDocumentoColaborador("+index+")'>Evaluar</a>";
	 
         var textoBotonConfirm = "";
         
         $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td").append(
            "<div id='divMovilActProy"+val.id+"'>" +
	       "<div class='detalleAccion "+claseNotaDocumento+"'>" +
	          "<label>*** DATOS GENERALES ***</label><br>" +
	          "<i class='fa fa-info'></i> Descripción: "+val.descripcion+"<br>" +
	          "<i class='fa fa-list'></i> Tipo: "+val.tipo.nombre+"<br>" +
	          "<i class='fa fa-list'></i> Categoría: "+val.categoria.nombre+"<br>" +
	          "<i class='fa fa-exclamation-circle'></i> Observacion del contratista: "+val.observacion+"<br>" +
	          "<label>*** DOCUMENTO ***</label><br>" +
	          "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>" +
	          "<i class='fa fa-calendar'></i> Fecha de registro: "+val.evidenciaFechaTexto+"<br>" +
	          "<label>*** EVALUACIÓN ***</label><br>" +
	          val.evaluacion.nota.icono+" Estado: "+val.evaluacion.nota.nombre +
	          (val.evaluacion.nota.id == 3?"":"<br>" +
	           (val.evaluacion.nota.id == 1?"":
	            "<i class='fa fa-exclamation-circle'></i> Observación: "+val.evaluacion.observacion+"<br>") +
	           "<i class='fa fa-calendar'></i> Evaluado el "+val.evaluacion.fechaTexto +
	           (val.evaluacion.usuario.nombre == ""?"":" (Por "+val.evaluacion.usuario.nombre+")")) +
	       "</div>" +
	       "<div class='opcionesAccion'>"+ 
		   textoBotonAgregar+
	       "</div>" +
	       "<div class='subOpcionAccion'></div>" +
	    "</div>");
      });
      
      //IPERC
      var claseNotaDocumento = "gosst-neutral";
      numTotal++;
      
      if(proyectoObj.evaluacionIperc == null){
   	 proyectoObj.evaluacionIperc = {fechaTexto:"",
   		                        nota:{icono:"",
   		                              id:3,
   		                              nombre:"Sin Evaluar"},
   		                        observacion:"" };
      }
      
      if(proyectoObj.evaluacionIperc.nota.id == 1){
	 claseNotaDocumento = "gosst-aprobado";
	 numAprob++;
      }else if(proyectoObj.evaluacionIperc.nota.id == 2){
	 claseNotaDocumento = "gosst-desaprobado"; 
      }else{
	 claseNotaDocumento = "gosst-advertencia";  
      }
      
      var textoBotonDescarga = "";
      
      var textoBotonAgregar = "<a onclick='evaluarStatusIpercColaborador()'>Evaluar</a>";
      
      var textoBotonConfirm = "";
      			
      $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td").prepend(
         "<div id='divMovilIpercEvalProy'>" +
   	    "<div class='detalleAccion "+claseNotaDocumento+"'> " +
   	       "<label>*** DATOS GENERALES ***</label><br>" +
   	       "<i class='fa fa-info'></i> Detalle:<br>" +
   	       "*Matriz de riesgos"+"<br>" +
   	       "*Evaluaciones no significativas"+"<br>" +
   	       "*"+proyectoObj.postulante.indicadorIperc+"<br>" +
   	       "<label>*** EVALUACIÓN ***</label><br>" +
   		proyectoObj.evaluacionIperc.nota.icono+" Estado: "+proyectoObj.evaluacionIperc.nota.nombre +
	        (proyectoObj.evaluacionIperc.nota.id == 3?"":"<br>" +
	         (proyectoObj.evaluacionIperc.nota.id == 1?"":
	          "<i class='fa fa-exclamation-circle'></i> Observación: "+proyectoObj.evaluacionIperc.observacion+"<br>") +
	         "<i class='fa fa-calendar'></i> Evaluado el "+proyectoObj.evaluacionIperc.fechaTexto) +
	    "</div>" +
	    "<div class='opcionesAccion'>" +
   	        textoBotonDescarga+textoBotonAgregar+textoBotonConfirm +
            "</div>" +
            "<div class='subOpcionAccion'></div>" +
   	 "</div>");
      
      $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   	 .prepend("<div id='divEncabezadoProy02' style='background-color:#17E9E3;'>" +
   		       "<i class='fa fa-info'></i> IPERC " +
   		 "</div>");
      
      var dataParamExam={
	 id: (proyectoObj.postulante.contratista.id),
	 examen:{ tipo: {id: null}},
	 perfil: {id: null},
	 listEstadoId: (listEstadosEvalDocProColId.length == 0?null:listEstadosEvalDocProColId)
      };
					
      callAjaxPostNoUnlock(URL+'/contratista/examenes',dataParamExam,function(data){
         listFullStatusExamenes = data.examenes;
						
         listFullStatusExamenes.sort(function(a,b){
	    return -a.id+b.id;
         }).sort(function(a,b){
	    return -a.evaluacion.nota.id+b.evaluacion.nota.id;
         });
         
         $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
	 .append("<div id='divEncabezadoProy03' style='background-color:#17E9E3;'>" +
		       "<i class='fa fa-info'></i> EXÁMENES " +
		 "</div>");
         				
         listFullStatusExamenes.forEach(function(val,index){
            agregarFilaExamenesColaborador(val,index);
            numTotal++;
            
            if(val.evaluacion.nota.id == 1){
               numAprob++;
            }
         });
         
         var dataParamHojasVida={
            tipo: {id: 4},   
            listTrabAsignadosActivosId: proyectoObj.listTrabAsignadosActivosIdAux,   
            listEstadoId: (listEstadosEvalDocProColId.length == 0?null:listEstadosEvalDocProColId)
         };
         
         callAjaxPost(URL+"/contratista/trabajador/hojavidas/proyecto",dataParamHojasVida,function(data){
            listFullStatusHojasVida = data.list; 
             
            listFullStatusHojasVida.sort(function(a,b){
     	       return -a.id+b.id;
            }).sort(function(a,b){
     	       return -a.evaluacion.nota.id+b.evaluacion.nota.id;
            });
             
            $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
    	    .append("<div id='divEncabezadoProy04' style='background-color:#17E9E3;'>" +
    		       "<i class='fa fa-info'></i> HOJA DE VIDA " +
    		    "</div>");
             
            listFullStatusHojasVida.forEach(function(val,index){
               agregarFilaHojasVidaColaborador(val,index);
               numTotal++;
                
               if(val.evaluacion.nota.id == 1){
                  numAprob++;
               }
            });
             
            $("#trStatusColab"+proyectoObj.id).find(".celdaIndicadorProyecto").html(numAprob+" / "+numTotal);
            
            $("#trStatusColab"+proyectoObj.id).find(".barraIndicadorProyecto")
            .css({"width":pasarDecimalPorcentaje(numAprob/numTotal),
       	          "background-color":colorPuntajeGosst(numAprob/numTotal)});
         }); 
      });
   });
}

function agregarFilaExamenesColaborador(val,index){
   var textoBotonAgregar = "<a onclick='evaluarStatusExamenColaborador("+index+")'>Evaluar</a>";
   
   var textoBotonConfirm = "";
   
   var claseNotaDocumento = "gosst-neutral";
	
   if(val.evaluacion.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(val.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
   
   var detalle = "";
	
   if(val.tipo.id == 5){
      detalle = "------";
   }else if(val.tipo.id == 14){
      detalle = "*Trabajadores: "+val.trabajadoresNombre;
   }else if(val.tipo.id == 16){
      detalle = "*Año: "+val.anio+" || Mes: "+val.mes.nombre+"<br>" +
                "*N° de trabajadores: "+val.numTrabajadoresIndicador+"<br>" + 
                "*Total de HH (Horas Hombres) trabajadas: "+val.numHorasHombres;
   }else if(val.tipo.id == 24){
      detalle = "*Fin de vigencia: "+val.fechaFinVigenciaTexto;
   }else if(val.tipo.id == 34){
      detalle = "*Trabajador: "+val.trabajadoresNombre+"<br>" +
                "*Fecha última dosis: "+val.fechaUltimaDosisTexto+"<br>" +
                "*Tipo de vacuna: "+val.tipoVacunaCovid.nombre;
   }else{
      detalle = (val.tipo.id == 15?"*Tipo documento: "+val.tipoCertificado.nombre+"<br>":"")+
	         "*Trabajadores: "+val.trabajadoresNombre+"<br>" +
	         "*Fin de vigencia: "+val.fechaFinVigenciaTexto;
   } 
   
   val.detalle = detalle;
   
   var evidenciaFechaTotal;
   
   if(val.tipo.id == 34){
      var enlaceVacunacion = 
         (val.evidenciaVacunacionNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaVacunacionUrl)+"'>" +
	      val.evidenciaVacunacionNombre +
	  "</a>");
	      
      var enlaceDni =
	 (val.evidenciaDniNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaDniUrl)+"'>" +
	      val.evidenciaDniNombre +
	  "</a>");
	      
      evidenciaFechaTotal = val.fechaRegistroVacunacionTexto;
   }else{
      var textoBotonDescarga = 
	 (val.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
	  "<a class='efectoLink' href='"+urlArchivo(val.evidenciaUrl)+"' " +
	     "target='_blank'>" +
	      val.evidenciaNombre +
	  "</a>");
       
      evidenciaFechaTotal = val.evidenciaFechaTexto;
   }
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td").append(
      "<div id='divMovilExamProy"+val.id+"'>" +
         "<div class='detalleAccion "+claseNotaDocumento+"'>" +
            "<label>*** DATOS GENERALES ***</label><br>" +
	    "<i class='fa fa-list'></i> Tipo: "+val.tipo.nombre+"<br>" +
	    "<i class='fa fa-info'></i> Detalle: <br>"+val.detalle+"<br>" +
	    "<label>*** DOCUMENTO ***</label><br>" +
	    (val.tipo.id != 34?
             "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>":
             "<i class='fa fa-download'></i> Evidencia - Carné de vacunación: "+enlaceVacunacion+"<br>" +
             "<i class='fa fa-download'></i> Evidencia - DNI (Parte frontal): "+ enlaceDni+"<br>") +
	    "<i class='fa fa-calendar'></i> Fecha de registro: "+evidenciaFechaTotal+"<br>" +
	    "<label>*** EVALUACIÓN ***</label><br>" +
	     val.evaluacion.nota.icono+" Estado: "+val.evaluacion.nota.nombre +
	     (val.evaluacion.nota.id == 3?"":"<br>" +
	      (val.evaluacion.nota.id == 1?"":
	       "<i class='fa fa-exclamation-circle'></i> Observación: "+val.evaluacion.observacion+"<br>") +
	      "<i class='fa fa-calendar'></i> Evaluado el "+val.evaluacion.fechaTexto +
	      (val.evaluacion.usuario.nombre == ""?"":" (Por "+val.evaluacion.usuario.nombre+")")) +
	 "</div>" +
	 "<div class='opcionesAccion'>" +
	     textoBotonAgregar +
	 "</div>" +
	 "<div class='subOpcionAccion'></div>" +
      "</div>");
}

function agregarFilaHojasVidaColaborador(val,index){
   var textoBotonDescarga = 
      (val.evidenciaNombre == ""?"------":
       "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/examen/hojavida/evidencia?id="+val.id+"' " +
	  "target='_blank'>" +
	   val.evidenciaNombre +
       "</a>");
         
   var textoBotonAgregar = "<a onclick='evaluarStatusHojaVidaColaborador("+index+")'>Evaluar</a>";
            
   var textoBotonConfirm = "";
    
   var claseNotaDocumento = "gosst-neutral";
 	
   if(val.evaluacion.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(val.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
 	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td").append(
      "<div id='divMovilHojVidProy"+val.id+"'>" +
         "<div class='detalleAccion "+claseNotaDocumento+"'>" +
            "<label>*** DATOS GENERALES ***</label><br>" +
	    "<i class='fa fa-list'></i> Tipo: "+val.tipo.nombre+"<br>" +
	    "<i class='fa fa-user'></i> Trabajador: "+val.trabajador.nombreCompleto+"<br>" +
	    "<label>*** DOCUMENTO ***</label><br>" +
            "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>" +
	    "<i class='fa fa-calendar'></i> Fecha de registro: "+val.fechaRegistroTexto+"<br>" +
	    "<label>*** EVALUACIÓN ***</label><br>" +
	     val.evaluacion.nota.icono+" Estado: "+val.evaluacion.nota.nombre +
	     (val.evaluacion.nota.id == 3?"":"<br>" +
	      (val.evaluacion.nota.id == 1?"":
	       "<i class='fa fa-exclamation-circle'></i> Observación: "+val.evaluacion.observacion+"<br>") +
	      "<i class='fa fa-calendar'></i> Evaluado el "+val.evaluacion.fechaTexto +
	      (val.evaluacion.usuario.nombre == ""?"":" (Por "+val.evaluacion.usuario.nombre+")")) +
 	 "</div>" +
 	 "<div class='opcionesAccion'>" +
 	     textoBotonAgregar +
 	 "</div>" +
 	 "<div class='subOpcionAccion'></div>" +
      "</div>");
}

function evaluarStatusHojaVidaColaborador(indexHojVid){
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusDocColaborador td").find(".opcionesAccion").hide();
 	
   var objDoc = listFullStatusHojasVida[indexHojVid];
   
   var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","",
      listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
   
   var textoBotonVolver = 
      "<a onclick='cancelarEvaluacionStatusHojaVidaColaborador("+indexHojVid+")'>" +
         "Cancelar" +
      "</a>";
   
   var textoBotonDescarga = 
      (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
       "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/examen/hojavida/evidencia?id="+objDoc.id+"' " +
 	  "target='_blank'>" +
 	   objDoc.evidenciaNombre +
       "</a>");
   
   var textoBotonConfirm = "";
   
   var claseNotaDocumento = "gosst-neutral";
 	
   if(objDoc.evaluacion.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
 	
   var btnGuardar = 
      "<button class='btn btn-success' onclick='guardarEvalStatusHojaVidaColaborador("+indexHojVid+")'>" +
         "<i class='fa fa-save'></i> Guardar" +
      "</button>";
    
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilHojVidProy"+objDoc.id).html(
      "<div class='detalleAccion "+claseNotaDocumento+"'>" +
         "<label>*** DATOS GENERALES ***</label><br>" +
	 "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
	 "<i class='fa fa-user'></i> Trabajador: "+objDoc.trabajador.nombreCompleto+"<br>" +
	 "<label>*** DOCUMENTO ***</label><br>" +
         "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>" +
	 "<i class='fa fa-calendar'></i> Fecha de registro: "+objDoc.fechaRegistroTexto+"<br>" +
	 "<label>*** EVALUACIÓN ***</label><br>" +
	 "<i class='fa fa-pencil'></i> Estado: <br>"+selEstadoObsTotal+"<br>" +
         "<i class='fa fa-exclamation-circle'></i> Observación: <br>" +
	 "<input class='form-control' id='inputObsEvalTotal'><br>" +   
          btnGuardar+
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonVolver+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
 	 
   $("#divMovilHojVidProy"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion);	
}

function cancelarEvaluacionStatusHojaVidaColaborador(indexHojVid){
   var objDoc = listFullStatusHojasVida[indexHojVid];
 	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td").find(".opcionesAccion").show();
    
   var claseNotaDocumento = "gosst-neutral";
    
   if(objDoc.evaluacionEvidenciaHojaVida.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacionEvidenciaHojaVida.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
 	
   var textoBotonDescarga = 
       (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
        "<a class='efectoLink' href='"+URL+"/contratista/amazon_s3/examen/hojavida/evidencia?id="+objDoc.ultimaHojaId+"' " +
  	  "target='_blank'>" +
  	   objDoc.evidenciaNombre +
        "</a>");
                          
   var textoBotonAgregar = "<a onclick='evaluarStatusHojaVidaColaborador("+indexHojVid+")'>Evaluar</a>";
                           
   var textoBotonConfirm = "";
 	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilHojVidProy"+objDoc.id).html(
      "<div class='detalleAccion "+claseNotaDocumento+"'> " +
         "<label>*** DATOS GENERALES ***</label><br>" +
	 "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
	 "<i class='fa fa-user'></i> Trabajador: "+objDoc.trabajador.nombreCompleto+"<br>" +
	 "<label>*** DOCUMENTO ***</label><br>" +
         "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>" +
	 "<i class='fa fa-calendar'></i> Fecha de registro: "+objDoc.fechaRegistroTexto+"<br>" +
	 "<label>*** EVALUACIÓN ***</label><br>" +
	  objDoc.evaluacionEvidenciaHojaVida.icono+" Estado: "+objDoc.evaluacionEvidenciaHojaVida.nombre +
	  (objDoc.evaluacionEvidenciaHojaVida.id == 3?"":"<br>" +
	   (objDoc.evaluacionEvidenciaHojaVida.id == 1?"":
	    "<i class='fa fa-exclamation-circle'></i> Observación: "+objDoc.evaluacionEvidenciaHojaVida.observacion+"<br>") +
	   "<i class='fa fa-calendar'></i> Evaluado el "+objDoc.evaluacionEvidenciaHojaVida.fechaTexto +
	   (objDoc.evaluacionEvidenciaHojaVida.usuario.nombre == ""?"":" (Por "+objDoc.evaluacionEvidenciaHojaVida.usuario.nombre+")")) +
      "</div>" +
      "<div class='opcionesAccion'>"+
          textoBotonAgregar+
      "</div>" +
      "<div class='subOpcionAccion'></div>");
}

function guardarEvalStatusHojaVidaColaborador(indexDoc){
   var objDoc = listFullStatusHojasVida[indexDoc];
   var evalId = $("#selEvalTotalAct").val();
   var obs = $("#inputObsEvalTotal").val();
   
   var objAct={
      id: objDoc.id,tipo: {id: evalId},observacion: obs,
      trabajadorId: parseInt(getSession("trabajadorGosstId"))
   };
 	
   callAjaxPost(URL+'/contratista/proyecto/evaluacion_hoja_vida/unitaria/save',objAct,function(data){
      if(data.CODE_RESPONSE == "05"){
	 mensajeUx="<label>La evaluación de la hoja de vida se guardó con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActEvalHojVidSecConVistaCol"); 
	 
         $("#modalMensajeUxActEvalHojVidSecConVistaCol").on("hidden.bs.modal",function(){
            cargarStatusDocumentosProyectoColaborador(); 
         });		
      }
   });
}

function verIconoAcuerdoEvalColaborador(obj){
   var notaId = parseInt($(obj).val());
	
   listEvaluacionStatusTotal.every(function(val){
      if(val.id == notaId){
         $(obj).parent().find("label").html(val.icono)
         return false;
      }
		
      return true;
   });
}

function guardarEvalStatusDocumentoColaborador(indexDoc){
   var objDoc = listFullStatusDocumentos[indexDoc];	
   var evalId = $("#selEvalTotalAct").val();
   var obs = $("#inputObsEvalTotal").val();
	
   var objAct={
      id: objDoc.id,
      evaluacion: {nota: {id: evalId},
	           observacion: obs},
      trabajadorId: parseInt(getSession("trabajadorGosstId"))
   };
	
   callAjaxPost(URL+'/contratista/proyecto/evaluacion_doc/unitaria/save',objAct,function(data){
      if(data.CODE_RESPONSE == "05"){
	 mensajeUx="<label>La evaluación de la actividad se guardó con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActEvalActivSecConVistaCol"); 
		 
	 $("#modalMensajeUxActEvalActivSecConVistaCol").on("hidden.bs.modal",function(){
	    cargarStatusDocumentosProyectoColaborador(); 
	 });	
      }
   });
}

function guardarEvalStatusExamenColaborador(indexDoc){
   var objDoc = listFullStatusExamenes[indexDoc];
   var evalId = $("#selEvalTotalAct").val();
   var obs = $("#inputObsEvalTotal").val();
   
   var objAct={
      id: objDoc.id,
      evaluacion: {nota: {id: evalId},
	           observacion: obs},
      trabajadorId: parseInt(getSession("trabajadorGosstId"))
   };
	
   callAjaxPost(URL+'/contratista/proyecto/evaluacion_exam/unitaria/save',objAct,function(data){
      if(data.CODE_RESPONSE == "05"){
         mensajeUx="<label>La evaluación del examen se guardó con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActEvalExamSecConVistaCol"); 
		 
	 $("#modalMensajeUxActEvalExamSecConVistaCol").on("hidden.bs.modal",function(){
	    cargarStatusDocumentosProyectoColaborador(); 
	 });	
      }
   });
}

function guardarEvalStatusIpercColaborador(){ 
	var evalId=$("#selEvalTotalAct").val(); 
	var obs=$("#inputObsEvalTotal").val();
	var objAct={id:proyectoObj.id,
			evaluacionIperc:{nota:{id:evalId},fechaTexto:obtenerFechaActualNormal(),observacion:obs,proyecto:{id:proyectoObj.id}}};
	
	callAjaxPost(URL + '/contratista/proyecto/evaluacion_iperc/save', 
			objAct
			, function(data){
				if(data.CODE_RESPONSE=="05"){
					proyectoObj.evaluacionIperc=objAct.evaluacionIperc;
					listEvaluacionStatusTotal.forEach(function(val){
						if(val.id==proyectoObj.evaluacionIperc.nota.id){
							proyectoObj.evaluacionIperc.nota=val
						}
					})
					cargarStatusDocumentosProyectoColaborador();
				}
			})
}

function cancelarEvaluacionStatusDocumentacion(indexDoc){
   var objDoc = listFullStatusDocumentos[indexDoc];
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td")
   .find(".opcionesAccion").show();
	
   var claseNotaDocumento = "gosst-neutral";
	
   if(objDoc.evaluacion.nota.id == 1){
      claseNotaDocumento="gosst-aprobado"
   }else if(objDoc.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
	
   var textoBotonDescarga = 
      (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
       "<a class='efectoLink' href='"+URL+"/contratista/proyecto/actividad/evidencia?id="+objDoc.id+"' " +
          "target='_blank'>" +
           objDoc.evidenciaNombre +
       "</a>");
      
   var textoBotonAgregar = "<a onclick='evaluarStatusDocumentoColaborador("+indexDoc+")'>Evaluar</a>";
     
   var textoBotonConfirm = "";
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilActProy"+objDoc.id).html( 
      "<div class='detalleAccion "+claseNotaDocumento+"'> " +
         "<label>*** DATOS GENERALES ***</label><br>" +
         "<i class='fa fa-info'></i> Descripción: "+objDoc.descripcion+"<br>" +
         "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
         "<i class='fa fa-list'></i> Categoría: "+objDoc.categoria.nombre+"<br>" +
         "<i class='fa fa-info'></i> Observacion del contratista: "+objDoc.observacion+"<br>" +
         "<label>*** DOCUMENTO ***</label><br>" +
         "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>"+
         "<i class='fa fa-calendar'></i> Fecha de registro: "+objDoc.evidenciaFechaTexto+"<br>" +
         "<label>*** EVALUACIÓN ***</label><br>" +
         objDoc.evaluacion.nota.icono+" Estado: "+objDoc.evaluacion.nota.nombre +
         (objDoc.evaluacion.nota.id == 3?"":"<br>" +
          (objDoc.evaluacion.nota.id == 1?"":
           "<i class='fa fa-exclamation-circle'></i> Observación: "+objDoc.evaluacion.observacion+"<br>") +
          "<i class='fa fa-calendar'></i> Evaluado el "+objDoc.evaluacion.fechaTexto +
          (objDoc.evaluacion.usuario.nombre == ""?"":" (Por "+objDoc.evaluacion.usuario.nombre+")")) + 
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonAgregar+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
}

function evaluarStatusExamenColaborador(indexExam){
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusDocColaborador td").find(".opcionesAccion").hide();
	
   var objDoc = listFullStatusExamenes[indexExam];
   var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","",
      listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
   
   var textoBotonVolver = "<a onclick='cancelarEvaluacionStatusExamenColaborador("+indexExam+")'>Cancelar</a>";
   
   var textoBotonConfirm = "";
   
   var claseNotaDocumento = "gosst-neutral";
	
   if(objDoc.evaluacion.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
   
   var evidenciaFechaTotal;
   
   if(objDoc.tipo.id == 34){
      var enlaceVacunacion = 
         (objDoc.evidenciaVacunacionNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(objDoc.evidenciaVacunacionUrl)+"'>" +
	      objDoc.evidenciaVacunacionNombre +
	  "</a>");
	      
      var enlaceDni =
	 (objDoc.evidenciaDniNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(objDoc.evidenciaDniUrl)+"'>" +
	      objDoc.evidenciaDniNombre +
	  "</a>");
	      
      evidenciaFechaTotal = objDoc.fechaRegistroVacunacionTexto;
   }else{
      var textoBotonDescarga = 
	 (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
	  "<a class='efectoLink' href='"+urlArchivo(objDoc.evidenciaUrl)+"' " +
	     "target='_blank'>" +
	      objDoc.evidenciaNombre +
	  "</a>");
       
      evidenciaFechaTotal = objDoc.evidenciaFechaTexto;
   }
	
   var btnGuardar = 
      "<button class='btn btn-success' onclick='guardarEvalStatusExamenColaborador("+indexExam+")'>" +
         "<i class='fa fa-save'></i> Guardar" +
      "</button>";
   
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td")
   .find("#divMovilExamProy"+objDoc.id).html(
      "<div class='detalleAccion "+claseNotaDocumento+"'>" +
         "<label>*** DATOS GENERALES ***</label><br>" +
	 "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
	 "<i class='fa fa-info'></i> Detalle: <br>"+objDoc.detalle+"<br>" +
	 "<label>*** DOCUMENTO ***</label><br>" +
	 (objDoc.tipo.id != 34?
          "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>":
          "<i class='fa fa-download'></i> Evidencia - Carné de vacunación: "+enlaceVacunacion+"<br>" +
          "<i class='fa fa-download'></i> Evidencia - DNI (Parte frontal): "+ enlaceDni+"<br>") +
         "<i class='fa fa-calendar'></i> Fecha de registro: "+evidenciaFechaTotal+"<br>" +
         "<label>*** EVALUACIÓN ***</label><br>" +
	 "<i class='fa fa-pencil'></i> Estado: <br>"+selEstadoObsTotal+"<br>" +
	 "<i class='fa fa-exclamation-circle'></i> Observación: <br>" +
	 "<input class='form-control' id='inputObsEvalTotal'><br>" +   
	  btnGuardar +
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonVolver+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
	 
   $("#divMovilExamProy"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion);	
}

function cancelarEvaluacionStatusExamenColaborador(indexExam){
   var objDoc = listFullStatusExamenes[indexExam];
	
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusDocColaborador td").find(".opcionesAccion").show();
   
   var claseNotaDocumento = "gosst-neutral";
   
   if(objDoc.evaluacion.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacion.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
	
   var evidenciaFechaTotal;
   
   if(objDoc.tipo.id == 34){
      var enlaceVacunacion = 
         (objDoc.evidenciaVacunacionNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(objDoc.evidenciaVacunacionUrl)+"'>" +
	      objDoc.evidenciaVacunacionNombre +
	  "</a>");
	      
      var enlaceDni =
	 (objDoc.evidenciaDniNombre == ""?"------":
	  "<a class='efectoLink' target='_blank' href='"+urlArchivo(objDoc.evidenciaDniUrl)+"'>" +
	      objDoc.evidenciaDniNombre +
	  "</a>");
	      
      evidenciaFechaTotal = objDoc.fechaRegistroVacunacionTexto;
   }else{
      var textoBotonDescarga = 
	 (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
	  "<a class='efectoLink' href='"+urlArchivo(objDoc.evidenciaUrl)+"' " +
	     "target='_blank'>" +
	      objDoc.evidenciaNombre +
	  "</a>");
       
      evidenciaFechaTotal = objDoc.evidenciaFechaTexto;
   }
                          
   var textoBotonAgregar = "<a onclick='evaluarStatusExamenColaborador("+indexExam+")'>Evaluar</a>";
   
   var textoBotonConfirm = "";
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilExamProy"+objDoc.id).html(
      "<div class='detalleAccion "+claseNotaDocumento+"'> " +
         "<label>*** DATOS GENERALES ***</label><br>" +
	 "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
	 "<i class='fa fa-info'></i> Detalle: <br>"+objDoc.detalle+"<br>" +
	 "<label>*** DOCUMENTO ***</label><br>" +
	 (objDoc.tipo.id != 34?
          "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>":
          "<i class='fa fa-download'></i> Evidencia - Carné de vacunación: "+enlaceVacunacion+"<br>" +
          "<i class='fa fa-download'></i> Evidencia - DNI (Parte frontal): "+ enlaceDni+"<br>") +
	 "<i class='fa fa-calendar'></i> Fecha de registro: "+evidenciaFechaTotal+"<br>" +
	 "<label>*** EVALUACIÓN ***</label><br>" +
	  objDoc.evaluacion.nota.icono+" Estado: "+objDoc.evaluacion.nota.nombre +
	  (objDoc.evaluacion.nota.id == 3?"":"<br>" +
	   (objDoc.evaluacion.nota.id == 1?"":
	    "<i class='fa fa-exclamation-circle'></i> Observación: "+objDoc.evaluacion.observacion+"<br>") +
	   "<i class='fa fa-calendar'></i> Evaluado el "+objDoc.evaluacion.fechaTexto +
	    (objDoc.evaluacion.usuario.nombre == ""?"":" (Por "+objDoc.evaluacion.usuario.nombre+")")) +
      "</div>" +
      "<div class='opcionesAccion'>"+
          textoBotonAgregar +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
}

function evaluarStatusDocumentoColaborador(indexDoc){
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td")
   .find(".opcionesAccion").hide();
	
   var objDoc = listFullStatusDocumentos[indexDoc];
	
   var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","",
      listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
	
   var claseNotaDocumento = "gosst-neutral";
   
   if(objDoc.evaluacion.nota.id == 1){
       claseNotaDocumento="gosst-aprobado"
    }else if(objDoc.evaluacion.nota.id == 2){
       claseNotaDocumento = "gosst-desaprobado"; 
    }else{
       claseNotaDocumento = "gosst-advertencia";  
    }
	
   var textoBotonDescarga = 
       (objDoc.evidenciaNombre == ""?"<strong style='color:red'>No hay evidencia</strong>":
        "<a class='efectoLink' href='"+URL+"/contratista/proyecto/actividad/evidencia?id="+objDoc.id+"' " +
           "target='_blank'>" +
            objDoc.evidenciaNombre +
        "</a>");
   
   var textoBotonVolver = "<a onclick='cancelarEvaluacionStatusDocumentacion("+indexDoc+")'>Cancelar</a>";
   
   var textoBotonConfirm = "";
	
   var btnGuardar = 
      "<button class='btn btn-success' onclick='guardarEvalStatusDocumentoColaborador("+indexDoc+")'>" +
         "<i class='fa fa-save'></i> Guardar" +
      "</button>";
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilActProy"+objDoc.id).html( 
      "<div class='detalleAccion "+claseNotaDocumento+"'>" +
         "<label>*** DATOS GENERALES ***</label><br>" +
         "<i class='fa fa-info'></i> Descripción: "+objDoc.descripcion+"<br>" +
         "<i class='fa fa-list'></i> Tipo: "+objDoc.tipo.nombre+"<br>" +
         "<i class='fa fa-list'></i> Categoría: "+objDoc.categoria.nombre+"<br>" +
         "<i class='fa fa-info'></i> Observacion del contratista: "+objDoc.observacion+"<br>" +
         "<label>*** DOCUMENTO ***</label><br>" +
         "<i class='fa fa-download'></i> Evidencia: "+textoBotonDescarga+"<br>" +
         "<i class='fa fa-calendar'></i> Fecha de registro: "+objDoc.evidenciaFechaTexto+"<br>" +
         "<label>*** EVALUACIÓN ***</label><br>" +
         "<i class='fa fa-pencil'></i> Estado: <br>"+selEstadoObsTotal+"<br>" +
         "<i class='fa fa-exclamation-circle'></i> Observación: <br>" +
         "<input class='form-control' id='inputObsEvalTotal'><br>" +
          btnGuardar +
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonVolver+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
   
   $("#divMovilActProy"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion);	
}

function evaluarStatusIpercColaborador(){
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td")
   .find(".opcionesAccion").hide();
	
   var objDoc = proyectoObj;
	
   var selEstadoObsTotal = crearSelectOneMenuOblig("selEvalTotalAct","",
      listEvaluacionStatusTotal,objDoc.evaluacionIperc.nota.id,"id","nombre");
	
   var textoBotonVolver = "<a onclick='cancelarStatusIpercColaborador()'>Cancelar</a>";	
   
   var textoBotonConfirm = "";
	
   var claseNotaDocumento = "gosst-neutral";
	
   if(objDoc.evaluacionIperc.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacionIperc.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
	
   var btnGuardar = 
      "<button class='btn btn-success' onclick='guardarEvalStatusIpercColaborador()'>" +
         "<i class='fa fa-save'></i> Guardar" +
      "</button>";
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilIpercEvalProy").html( 
      "<div class='detalleAccion "+claseNotaDocumento+"'> " +
         "<label>*** DATOS GENERALES ***</label><br>" +
         "<i class='fa fa-info'></i> Detalle:<br>" +
	 "*Matriz de riesgos"+"<br>" +
	 "*Evaluaciones no significativas"+"<br>" +
	 "*"+objDoc.postulante.indicadorIperc+"<br>" +
	 "<label>*** EVALUACIÓN ***</label><br>" +
	 "<i class='fa fa-pencil'></i> Estado: <br>"+selEstadoObsTotal+"<br>" +
	 "<i class='fa fa-exclamation-circle'></i> Observación: <br>" +
	 "<input class='form-control' id='inputObsEvalTotal'><br>" +
          btnGuardar +
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonVolver+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>");
	 
   $("#divMovilIpercEvalProy").find("#inputObsEvalTotal").val(objDoc.evaluacionIperc.observacion);
}

function cancelarStatusIpercColaborador(){
   var textoBotonDescarga = "";
   
   var textoBotonAgregar = "<a onclick='evaluarStatusIpercColaborador()'>Evaluar</a>";
   
   var textoBotonConfirm = "";
   
   var claseNotaDocumento = "gosst-neutral";
   
   var objDoc = proyectoObj;
	
   if(objDoc.evaluacionIperc.nota.id == 1){
      claseNotaDocumento = "gosst-aprobado";
   }else if(objDoc.evaluacionIperc.nota.id == 2){
      claseNotaDocumento = "gosst-desaprobado"; 
   }else{
      claseNotaDocumento = "gosst-advertencia";  
   }
     
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador td") 
   .find("#divMovilIpercEvalProy").html( "<div id='divMovilIpercEvalProy'>" +
      "<div class='detalleAccion "+claseNotaDocumento+"'> " +
         "<label>*** DATOS GENERALES ***</label><br>" +
         "<i class='fa fa-info'></i> Detalle:<br>" +
	 "*Matriz de riesgos"+"<br>" +
	 "*Evaluaciones no significativas"+"<br>" +
	 "*"+objDoc.postulante.indicadorIperc+"<br>" +
	 "<label>*** EVALUACIÓN ***</label><br>" +
	  objDoc.evaluacionIperc.nota.icono+" Estado: "+objDoc.evaluacionIperc.nota.nombre +
          (objDoc.evaluacionIperc.nota.id == 3?"":"<br>" +
           (objDoc.evaluacionIperc.nota.id == 1?"":
            "<i class='fa fa-exclamation-circle'></i> Observación: "+objDoc.evaluacionIperc.observacion+"<br>") +
           "<i class='fa fa-calendar'></i> Evaluado el "+objDoc.evaluacionIperc.fechaTexto) +
      "</div>" +
      "<div class='opcionesAccion'>" +
          textoBotonDescarga+textoBotonAgregar+textoBotonConfirm +
      "</div>" +
      "<div class='subOpcionAccion'></div>" +
      "</div>");
}

function showDivStatusDocumentos(){
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador").show();
	
   $("#trStatusColab"+proyectoObj.id).find(".celdaBotonAccion")
   .html(
	 /*"<button class='btn btn-success' onclick='hideDivStatusDocumentos("+proyectoObj.id+")'>" +
	   "<i class='fa fa-eye'></i>Ocultar</button>" +
	   "<br><br>" +
	   "<button class='btn btn-success' onclick='tablaResumenStatusDocumentos("+proyectoObj.id+")'>" +
	   "<i class='fa fa-table'></i>Ver Tabla</button>" + 
	 */
	 "<div classs='row'>" +
	    "<section id='opcioneshide' class='col col-xs-12'>" +
	       "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionStatus(this,"+proyectoObj.id+",\"hide\")'>" +
	          "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	       "</a>"+menuOpcionStatus[1]+
	    "</section>"+
         "</div>");
}

function hideDivStatusDocumentos(){
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusDocColaborador").hide();
   
   $("#trStatusColab"+proyectoObj.id).find(".celdaBotonAccion")
   .html(/*"<button class='btn btn-success' onclick='showDivStatusDocumentos("+proyectoObj.id+")'>" +
	 "<i class='fa fa-eye'></i>Ver </button>"+*/
         "<div classs='row'>" +
	    "<section id='opcioneshide' class='col col-xs-12'>" +
	       "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionStatus(this,"+proyectoObj.id+",\"hide\")'>" +
	          "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	       "</a>"+menuOpcionStatus[0]+
	    "</section>"+
         "</div>");
}

function tablaResumenStatusDocumentos(){
   $(".divContainerGeneral").hide();
   tituloAnteriorContratista = $(".divTituloGeneral h4").text();
	
   var buttonClip = 
      "<button type='button' id='btnClipboardTrabProy' style='margin-right:10px' " +
	      "class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()'>" +
         "<i class='fa fa-clipboard'></i> Clipboard" +
      "</button>";
   
   var buttonVolver = 
      "<button type='button' class='btn btn-success' style='margin-right:10px' " +
	      "onclick='volverVistaMovil()'>" +
         "<i class='fa fa-sign-out fa-rotate-180'></i> Volver" +
      "</button>";
	
   var listAct=[
      {id:1,nombre:"Programa SASS",numAplica:0,numConEvidencia:0,numSinEvidencia:0,
       numEvaluarAprobado:0,numEvaluarDesaprobado:0,numSinEvaluar:0},
      {id:2,nombre:"Plan de Emergencia",numAplica:0,numConEvidencia:0,numSinEvidencia:0,
       numEvaluarAprobado:0,numEvaluarDesaprobado:0,numSinEvaluar:0},
      {id:4,nombre:"Plan de Manejo de Residuos",numAplica:0,numConEvidencia:0,numSinEvidencia:0,
       numEvaluarAprobado:0,numEvaluarDesaprobado:0,numSinEvaluar:0},
      {id:5,nombre:"Documentos Asociados",numAplica:0,numConEvidencia:0,numSinEvidencia:0,
       numEvaluarAprobado:0,numEvaluarDesaprobado:0,numSinEvaluar:0}
   ];
	
   buttonClip = "";
	
   $("body").append(
      "<div id='divStatDocTabla' style='padding-left: 40px;'>" +
       //"<form class='form-inline'>"+
	     buttonVolver+buttonClip+
       //"</form>"+
         "<div class='wrapper' id='wrapperTrabProy'>" +
            "<table style='' id='tblStatusDocs' class='table table-striped table-bordered table-hover'>" +
	       "<thead>" +
	          "<tr>" + 
		     "<td class='tb-acc'>Estado Documento / Tipo</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody>" +
	          "<tr id='trApl'>" +
		     "<td>Aplicables</td>" +
		  "</tr>" +
		  "<tr id='trevic'>" +
		     "<td>Evidenciados por el contratista</td>" +
		  "</tr>" +
		  "<tr id='trnoevi'>" +
		     "<td>No evidenciados</td>" +
		  "</tr>" +
		  "<tr id='traprob'>" +
		     "<td>Validados</td>" +
		  "</tr>" +
		  "<tr id='trdesa'>" +
		     "<td>Observados</td>" +
		  "</tr>" +
		  "<tr id='trsineva'>" +
		     "<td>Sin evaluar</td>" +
		  "</tr>" +
		  "<tr id='trindica'>" +
		     "<td>Indicador (Validados / Aplicables)</td>" +
		  "</tr>" +
	       "</tbody>" +
	    "</table>" +
	 "</div>" +
      "</div>");
	
   listAct.forEach(function(val,index){
      $("#tblStatusDocs thead tr").append("<td class='tb-acc' style='width:190px'>"+val.nombre+"</td>");
		
      listFullStatusDocumentos.forEach(function(val1){
         if(val1.tipo.id == val.id){
	    val.numAplica++;
				
	    if(val1.evidenciaNombre == null || val1.evidenciaNombre == ""){
	       val.numSinEvidencia++;
	    }else{
	       val.numConEvidencia++;
	    }
				
	    if(val1.evaluacion.nota.id == 0 || val1.evaluacion.nota.id == 3){
	       val.numSinEvaluar++;
	    }
				
	    if(val1.evaluacion.nota.id == 1){
	       val.numEvaluarAprobado++;
	    }
				
	    if(val1.evaluacion.nota.id == 2){
	       val.numEvaluarDesaprobado++;
	    }
         }
      });
		
      $("#tblStatusDocs tbody #trApl").append(
         "<td style='border-bottom:2px solid #abadaf'>"+val.numAplica+"</td>");
      
      $("#tblStatusDocs tbody #trevic").append("<td>"+val.numConEvidencia+"</td>")
		
      $("#tblStatusDocs tbody #trnoevi").append(
         "<td style='border-bottom:2px solid #abadaf'>"+val.numSinEvidencia+"</td>");
      
      $("#tblStatusDocs tbody #traprob").append("<td>"+val.numEvaluarAprobado+"</td>")
		
      $("#tblStatusDocs tbody #trdesa").append("<td>"+val.numEvaluarDesaprobado+"</td>")
		
      $("#tblStatusDocs tbody #trsineva").append(
         "<td style='border-bottom:2px solid #abadaf'>"+val.numSinEvaluar+"</td>")
		
      $("#tblStatusDocs tbody #trindica").append(
         "<td>"+pasarDecimalPorcentaje(val.numEvaluarAprobado/val.numAplica,2)+"</td>")
   });
	
   var evalIperc={
      nombre:"Matriz de riesgos",numAplica:1,numConEvidencia:0,numSinEvidencia:0,
      numEvaluarAprobado:0,numEvaluarDesaprobado:0,numSinEvaluar:0
   };
	
   if(parseInt(proyectoObj.indicadorIperc) > 0){
      evalIperc.numConEvidencia = 1;
   }else{
      evalIperc.numSinEvidencia=1;
   }
	
   if(proyectoObj.evaluacionIperc == null){
      evalIperc.numSinEvaluar = 1;
   }else if(proyectoObj.evaluacionIperc.nota.id == 1){
      evalIperc.numEvaluarAprobado = 1;
   }else if(proyectoObj.evaluacionIperc.nota.id == 2){
      evalIperc.numEvaluarDesaprobado = 1;
   }else if(proyectoObj.evaluacionIperc.nota.id == 3){
      evalIperc.numSinEvaluar = 1;
   }
	
   $("#tblStatusDocs thead tr").append(
      "<td class='tb-acc' style='width:190px'>"+evalIperc.nombre+"</td>");
	
   $("#tblStatusDocs tbody #trApl").append(
      "<td style='border-bottom:2px solid #abadaf'>"+evalIperc.numAplica+"</td>");
	
   $("#tblStatusDocs tbody #trevic").append("<td>"+evalIperc.numConEvidencia+"</td>");
	
   $("#tblStatusDocs tbody #trnoevi").append(
      "<td  style='border-bottom:2px solid #abadaf'>"+evalIperc.numSinEvidencia+"</td>");
	
   $("#tblStatusDocs tbody #traprob").append("<td>"+evalIperc.numEvaluarAprobado+"</td>");
	
   $("#tblStatusDocs tbody #trdesa").append("<td>"+evalIperc.numEvaluarDesaprobado+"</td>");
	
   $("#tblStatusDocs tbody #trsineva").append(
      "<td style='border-bottom:2px solid #abadaf'>"+evalIperc.numSinEvaluar+"</td>");
   
   $("#tblStatusDocs tbody #trindica").append(
      "<td>"+pasarDecimalPorcentaje(evalIperc.numEvaluarAprobado/evalIperc.numAplica,2)+"</td>");
}
