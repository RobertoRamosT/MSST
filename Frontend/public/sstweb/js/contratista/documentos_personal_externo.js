/**
 * 
 */
var listFullDocTrabContratista = [];
var listFullDocVisitante = [];
var listEvaluacionDocPersonalExt = [];
var listTipoDocPersonalExt = [];
var listEstadosEvaluacionId = [];
var listPerfilTrabajadorId = [];
var listTiposDocPerExtId = [];

var listPerfilTrabajador=[
   {id:1,nombre:"Trabajador del contratista"},
   {id:2,nombre:"Visitante"}
];

var mensajeUx;

function ocultarFiltroDocPersonalExt(){
   $("#modalFiltroDocPersonalExt").modal("hide");
}

function verFiltroDocPersonalExt(){
   $("#modalFiltroDocPersonalExt").modal("show");
}

function crearFiltroDocPersonalExterno(functionCallBack){      
   $("#modalFiltroDocPersonalExt").remove();
   
   var dataParam = {}; 
 		
   callAjaxPost(URL+'/contratista/documento_personal_externo/empresa/filtro',dataParam,function(data){
      listEvaluacionDocPersonalExt = data.listEvaluacion;
      listTipoDocPersonalExt = data.listTipoDocPerExt;
       
      var contenido = "";
 				
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	  label:"<span style='font-size:18px;font-weight:bolder;'>Fecha de registro</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Inicio",
          inputForm:"<input type='date' id='fechaInicioDocPerExt' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fin",
          inputForm:"<input type='date' id='fechaFinDocPerExt' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	 {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvaluacionDocPerExt"},
         {sugerencia:"",label:"Perfil",inputForm:"",
          divContainer:"divFiltroPerfilDocPerExt"},
         {sugerencia:"",label:"Tipo documento",inputForm:"",
          divContainer:"divFiltroTipoDocPerExt"},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroDocPersonalExt()'>" +
              	   "<i class='fa fa-times'></i> Cancelar" +
              	"</button>",
 	  inputForm:"<button id='btnAplicarFiltroDocPerExt' class='btn btn-success' type='submit' " +
 	      		    "onclick='valoresFiltroDocPersonalExt()' style='float:right;font-size:18px;'>" +
 	               "<i class='fa fa-filter'></i> Aplicar filtro" +
 	      	    "</button>"},
      ];
 				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
 				
      var modalOptionsDocPerExt={
	 id:"modalFiltroDocPersonalExt",
	 nombre:"<i class='fa fa-filter'></i> Filtros",
 	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
 				
      crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){
         if($("#filtroEstadosEvaluacionDocPerExt").length > 0){
 	    return;
         }
         
         listEvaluacionDocPersonalExt.forEach(function(val){
            if(val.id == 3 || val.id == 4){
               val.selected = 1;
            }    
         });
          
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionDocPerExt","",listEvaluacionDocPersonalExt,
            "id","nombre","#divFiltroEstadosEvaluacionDocPerExt","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroPerfilDocPerExt","",listPerfilTrabajador,
            "id","nombre","#divFiltroPerfilDocPerExt","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroTipoDocPerExt","",listTipoDocPersonalExt,
            "id","nombre","#divFiltroTipoDocPerExt","Todos");
      },true,true);
      
      var hoy = getSession("fechaHoyOrdenInversoTexto");
      
      $("#fechaInicioDocPerExt").val(sumaFechaDias(-365,hoy));
      $("#fechaFinDocPerExt").val(sumaFechaDias(30,hoy));
 				
      functionCallBack();completarBarraCarga();
   });
}

function valoresFiltroDocPersonalExt(){
   ocultarFiltroDocPersonalExt();
    
   if($("#fechaInicioDocPerExt").val().length > 0 && $("#fechaFinDocPerExt").val().length > 0){
       listEstadosEvaluacionId = [];
       var estadoEvaluacionId = $("#filtroEstadosEvaluacionDocPerExt").val();
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }
       
       listPerfilTrabajadorId = [];
       var perfilTrabajadorId = $("#filtroPerfilDocPerExt").val();
       
       if(perfilTrabajadorId != null){
          perfilTrabajadorId.forEach(function(val){
             listPerfilTrabajadorId.push(parseInt(val));
          });
       }
       
       listTiposDocPerExtId = [];
       var tipoId = $("#filtroTipoDocPerExt").val();
       
       if(tipoId != null){
          tipoId.forEach(function(val){
    	 listTiposDocPerExtId.push(parseInt(val));
          });
       }
       
       cargarDocumentosPersonalExterno();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroDocPersonalExt").modal("show");
	});
   }
}

function cargarDocumentosPersonalExterno(){
//   $("#containerInduccionesVirtuales").show();
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      fechaRegistroInicio: $("#fechaInicioDocPerExt").val(),
      fechaRegistroFin: $("#fechaFinDocPerExt").val(),
      listEstadosEvaluacionIdFiltro: (listEstadosEvaluacionId.length == 0?
         null:listEstadosEvaluacionId),
      listPerfilTrabajadorIdFiltro: (listPerfilTrabajadorId.length == 0?
	 null:listPerfilTrabajadorId),
      listTipoDocumentoIdFiltro: (listTiposDocPerExtId.length == 0?
         null:listTiposDocPerExtId)
   };
	
   callAjaxPost(URL+'/contratista/documento_personal_externo/empresa',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         //banderaEdicion88=false;
	 listFullDocTrabContratista = data.listDocTrabContratista;
	 listFullDocVisitante = data.listDocVisitante;
	 
	 $("#tblDocPersonalExt tbody tr").remove();
	 
	 resizeDivWrapper("wrapperDocPersonalExt",200);
	 
	 listFullDocTrabContratista.forEach(agregarFilaDocumentoTrabContratista);
	 listFullDocVisitante.forEach(agregarFilaDocumentoVisitante);
	 
	 goheadfixedY("#tblDocPersonalExt","#wrapperDocPersonalExt");
      }else{
	 console.log("NOPNPO")
      }
   });
}

function agregarFilaDocumentoTrabContratista(val,index){
   var nombreEvi = (val.evidenciaNombre == ""?"------":
      "<a href='"+URL+"/contratista/trabajador_contratista/documento/evidencia?id="+val.id+"' " +
         "target='_blank' class='efectoLink'>" +
          val.evidenciaNombre +
      "</a>");
	
   var selEvaluacionDocTrabContratista = crearSelectOneMenuOblig("selEvaluacionDocTrabContratista"+val.id,
      "guardarEvaluacionDocTrabContratista("+val.id+")",listEvaluacionDocPersonalExt,
      val.evaluacionDoc.id,"id","nombre");
   
   if(val.tipoDocPersonalExterno.id == 1){
      val.detalle = "¿Pertenece al grupo de riesgo - COVID-19? - "+val.respuestaGrupoRiesgo.nombre+"<br>"+
                    "*Detalle: "+val.detalleGrupoRiesgo;
   }else if(val.tipoDocPersonalExterno.id == 2){
      val.detalle = "*Tipo - prueba COVID-19: "+val.tipoPrueba.nombre+"<br>"+
                    "*Resultado - prueba COVID-19: "+val.resultadoPrueba.nombre+"<br>"+
                    "*Fecha del resultado: "+val.fechaPruebaRealizadaTexto+"<br>"+
                    "*Fecha fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>";
   }else if(val.tipoDocPersonalExterno.id == 3){
      val.detalle = "*¿Tiene síntomas asociados al COVID-19? - "+val.respuestaSintomas.nombre+"<br>"+
                    "*¿Ha tenido contacto con algún caso confirmado o " +
                    "sospechoso de COVID-19 en los últimos días? - "+val.respuestaContacto.nombre+"<br>"+
                    "*Fecha de registro de la ficha:"+val.fechaRegistroTexto+"<br>"+
                    "*Fecha fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>"
   }
   
   var btnEliminar = (val.evaluacionDoc.id == 1?"<label>*No aplica</label>":
      "<button type='button' class='btn btn-danger' title='Eliminar' " +
              "onclick='eliminarFilaDocumentoTrabContratista("+index+")'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>");

   $("#tblDocPersonalExt tbody").append(
      "<tr id='trDocTrabCon"+val.id+"'>" +
         "<td>"+val.trabajadorContratista.nombre+"</td>" + 
	 "<td>"+val.trabajadorContratista.nroDocumento+"</td>" +
	 "<td>"+val.perfilTrabajador+"</td>" +
	 "<td>"+val.trabajadorContratista.contratista.nombre+"</td>" + 
	 "<td>"+val.fechaActualizacionTexto+"</td>" +
	 "<td>"+val.tipoDocPersonalExterno.nombre+"</td>" + 
	 "<td style='text-align:left;'><label>"+val.detalle+"</label></td>" + 
	 "<td>"+nombreEvi+"</td>" +
	 "<td>"+selEvaluacionDocTrabContratista +
	    "<label id='labelAuxTraCon"+val.id+"'>"+val.evaluacionDoc.icono+"</label>" +
	 "</td>" +
	 "<td id='tdObsDocTrabCon"+val.id+"'>"+val.evaluacionDoc.observacion+"<br><br>" +
	    "<button class='btn btn-success' onclick='verDocObsTrabContratista("+index+")'>" +
	       "<i class='fa fa-pencil'></i> Editar" +
	    "</button>" +
	    "<label id='labelObsAuxTraCon"+val.id+"'></label>" +
	 "</td>" +	
	 "<td>"+val.fechaDocEvaluacionTexto+"</td>" + 
	 "<td style='border-left:3px solid #afb5bb'>"+btnEliminar+"</td>" +
      "</tr>");
}

function eliminarFilaDocumentoTrabContratista(pindex){
   var tipoDocumento = listFullDocTrabContratista[pindex].tipoDocPersonalExterno.nombre;
    
   mensajeUx="<label>¿Está seguro de eliminar este documento " +
      tipoDocumento+"?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocTrabContratista");

   $("#btnDevolverValorEliminarDocTrabContratista").on("click",function(){
      var dataParam={
         id: parseInt(listFullDocTrabContratista[pindex].id)
      };

      callAjaxPost(URL+'/public/visitante/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El documento "+tipoDocumento+" seleccionado " +
                  "se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarDocTrabContratista");

               $("#modalMensajeUxActualizarDocTrabContratista").on("hidden.bs.modal",function(){
        	  cargarDocumentosPersonalExterno();  
               });

               break;
				
            default:
               alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });    
}

function verDocObsTrabContratista(pindex){
   var evalDocTraConObj = listFullDocTrabContratista[pindex];
	
   $("#tdObsDocTrabCon"+evalDocTraConObj.id)
   .html("<textarea rows='3' class='form-control' id='textObsDocTraCon"+evalDocTraConObj.id+"'></textarea>" +
	 "<button style='margin-right:10px;' class='btn btn-danger' " +
	         "onclick='cancelarEditarDocObsTrabContratista("+pindex+")'>" +
	    "<i class='fa fa-times'></i> Cancelar" +
	 "</button>" +
	 "<button class='btn btn-success' onclick='guardarDocObsTrabContratista("+pindex+")'>" +
	    "<i class='fa fa-floppy-o'></i> Guardar" +
	 "</button>");
   
   $("#textObsDocTraCon"+evalDocTraConObj.id)
   .val(evalDocTraConObj.evaluacionDoc.observacion).focus();
}

function cancelarEditarDocObsTrabContratista(pindex){
   var evalDocTraConObj = listFullDocTrabContratista[pindex];
	
   $("#tdObsDocTrabCon"+evalDocTraConObj.id)
   .html(evalDocTraConObj.evaluacionDoc.observacion+"<br><br>" +
	 "<button class='btn btn-success' onclick='verDocObsTrabContratista("+pindex+")'>" +
	    "<i class='fa fa-pencil'></i> Editar" +
	 "</button>" +
	 "<br>" +
	 "<label id='labelObsAuxTraCon"+evalDocTraConObj.id+"'></label>");
}

function guardarDocObsTrabContratista(pindex){
   var evalDocTraConObj = listFullDocTrabContratista[pindex];
   var pidEvalTraCon = evalDocTraConObj.id;
   var evalIdTraCon = $("#textObsDocTraCon"+pidEvalTraCon).val();
   
   var esDistinto = (listFullDocTrabContratista[pindex].evaluacionDoc.observacion != evalIdTraCon?1:0);

   var dataParam={
	  id: pidEvalTraCon,
	  evaluacionDoc: {observacion: evalIdTraCon},
	  esDistinto: esDistinto
	         }
   
   $("#labelObsAuxTraCon"+pidEvalTraCon).html("Guardando...");
   
   callAjaxPost(URL+'/contratista/documento_personal_externo/observacion_doc/save',dataParam,function(data){
      evalDocTraConObj.evaluacionDoc.observacion = evalIdTraCon;
      cancelarEditarDocObsTrabContratista(pindex);
      $("#labelObsAuxTraCon"+pidEvalTraCon).html("Guardado");
   });		
}

function guardarEvaluacionDocTrabContratista(pidEval){
   var evalId = parseInt($("#selEvaluacionDocTrabContratista"+pidEval).val());
	
   var dataParam={
          id: pidEval,
          evaluacionDoc: {id: evalId}
                 }
   
   $("#labelAuxTraCon"+pidEval).html("Guardando...");
	
   callAjaxPost(URL+'/contratista/documento_personal_externo/evaluacion_doc/save',dataParam, function(data){
      listEvaluacionDocPersonalExt.forEach(function(val){
         if(val.id == evalId){
	    $("#labelAuxTraCon"+pidEval).html(val.icono+" Evaluación guardada");
         }
      });
   });	
}

function agregarFilaDocumentoVisitante(val,index){
   var nombreEvi = "------";
    
   if(val.tipoDocPersonalExterno.id != 4 && val.tipoDocPersonalExterno.id != 5){
      if(val.evidenciaNombre != ""){
         nombreEvi = 
            "<a href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"' " +
    	       "target='_blank' class='efectoLink'>" +
    		val.evidenciaNombre +
    	    "</a>";
      }
   }if(val.tipoDocPersonalExterno.id == 4){
      if(val.respuestaVisitaLugarRiesgo.id == 1){
	 var enlaceSctr =  
	    "<a href='"+URL+"/public/visitante/documento/evidencia?id="+val.id+"' " +
	       "target='_blank' class='efectoLink'>" +
   		val.evidenciaNombre +
   	    "</a>";
	  
	 nombreEvi = "*SCTR: "+enlaceSctr;
      }
       
      if(val.respuestaVisitaSap.id == 1){
	 var enlaceSap =  
	    "<a href='"+URL+"/public/visitante/documento_sap/evidencia?id="+val.id+"' " +
	       "target='_blank' class='efectoLink'>" +
	        val.evidenciaSapNombre +
	    "</a>";
		
	 if(val.respuestaVisitaLugarRiesgo.id == 1){
	    nombreEvi += "<br>*Seguro de Accidente Personal: "+enlaceSap;
	 }else{
	    nombreEvi = "*Seguro de Accidente Personal: "+enlaceSap; 
	 }
      }
   }else if(val.tipoDocPersonalExterno.id == 5){
      var enlaceVacunacion = (val.evidenciaVacunacionNombre == ""?"------":
	 "<a class='efectoLink' target='_blank' " +
            "href='"+URL+"/public/visitante/documento/vacunacion/evidencia?id="+val.id+"'>" +
             val.evidenciaVacunacionNombre +
         "</a>");
      
      var enlaceDni = (val.evidenciaDniNombre == ""?"------":
	 "<a class='efectoLink' target='_blank' " +
            "href='"+URL+"/public/visitante/documento/trabajador_dni/evidencia?id="+val.id+"'>" +
             val.evidenciaDniNombre +
         "</a>");
      
      nombreEvi = 
         "*Carné de vacunación: "+enlaceVacunacion+"<br>" +
         "*DNI (Parte frontal): "+enlaceDni;
   }
 	
   var selEvaluacionDocVisitante = crearSelectOneMenuOblig("selEvaluacionDocVisitante"+val.id,
          "guardarEvaluacionDocVisitante("+val.id+")",listEvaluacionDocPersonalExt,
          val.evaluacionDoc.id,"id","nombre");
    
   if(val.tipoDocPersonalExterno.id == 1){
      val.detalle = "¿Pertenece al grupo de riesgo - COVID-19? - "+val.respuestaGrupoRiesgo.nombre+"<br>"+
                    "*Detalle: "+val.detalleGrupoRiesgo;
   }else if(val.tipoDocPersonalExterno.id == 2){
      val.detalle = "*Tipo - prueba COVID-19: "+val.tipoPrueba.nombre+"<br>"+
                     "*Resultado - prueba COVID-19: "+val.resultadoPrueba.nombre+"<br>"+
                     "*Fecha del resultado: "+val.fechaPruebaRealizadaTexto+"<br>"+
                     "*Fecha fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>";
   }else if(val.tipoDocPersonalExterno.id == 3){
      val.detalle = "*¿Tiene síntomas asociados al COVID-19? - "+val.respuestaSintomas.nombre+"<br>"+
                     "*¿Ha tenido contacto con algún caso confirmado o " +
                     "sospechoso de COVID-19 en los últimos días? - "+val.respuestaContacto.nombre+"<br>"+
                     "*Fecha de registro de la ficha:"+val.fechaRegistroTexto+"<br>"+
                     "*Fecha fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>"
   }else if(val.tipoDocPersonalExterno.id == 4){
      val.detalle = 
         "*Fecha de la visita: "+val.fechaVisitaTexto+"<br>"+
         "*Fecha fin de la visita: "+val.fechaFinVisitaTexto+"<br>"+
         "*¿Requiere de un SCTR? - "+val.respuestaVisitaLugarRiesgo.nombre+"<br>";
       
      if(val.respuestaVisitaLugarRiesgo.id == 1){
	 val.detalle += 
	    "*** SCTR ***<br>" +
	    "*Fecha inicio de vigencia: "+val.fechaInicioVigenciaSctrTexto+"<br>"+
	    "*Fecha fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>"+
	    "******<br>";  
      }
      
      val.detalle += 
	 "*¿Requiere de un Seguro de Accidente Personal? - "+val.respuestaVisitaSap.nombre+"<br>";
      
      if(val.respuestaVisitaSap.id == 1){
         val.detalle += 
            "*** Seguro de Accidente Personal ***<br>" +
            "*Fecha inicio de vigencia: "+val.fechaInicioVigenciaSapTexto+"<br>"+
            "*Fecha fin de vigencia: "+val.fechaFinVigenciaSapTexto+"<br>"+
            "******<br>";  
      }
      
      val.detalle +=
         "*Número de contacto personal: "+val.numeroContactoPersonal+"<br>"+
         "*Contacto - Empresa: "+val.contactoEmpresa+"<br>"+
         "*Detalle de la actividad: "+val.detalleVisitaActividad+"<br>";  
   }else if(val.tipoDocPersonalExterno.id == 5){
      val.detalle = "*Fecha última dosis: "+val.fechaUltimaDosisTexto+"<br>"+
                    "*Tipo de vacuna: "+val.tipoVacunaCovid.nombre;
   }
   
   var btnEliminar = (val.evaluacionDoc.id == 1?"<label>*No aplica</label>":
      "<button type='button' class='btn btn-danger' title='Eliminar' " +
              "onclick='eliminarFilaDocumentoVisitante("+index+")'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>");
   
   $("#tblDocPersonalExt tbody").append(
      "<tr id='trDocVis"+val.id+"'>" +
         "<td>"+val.visitante.nombre+"</td>" + 
 	 "<td>"+val.visitante.dni+"</td>" +
 	 "<td>"+val.perfilTrabajador+"</td>" +
 	 "<td>"+val.visitante.empresaTrabajaNombre+"</td>" + 
 	 "<td>"+val.fechaActualizacionTexto+"</td>" + 
 	 "<td>"+val.tipoDocPersonalExterno.nombre+"</td>" + 
 	 "<td style='text-align:left;'><label>"+val.detalle+"</label></td>" + 
 	 "<td>"+nombreEvi+"</td>" +
 	 "<td>"+selEvaluacionDocVisitante +
 	    "<label id='labelAuxVis"+val.id+"'>"+val.evaluacionDoc.icono+"</label>" +
 	 "</td>" +
 	 "<td id='tdObsDocVis"+val.id+"'>"+val.evaluacionDoc.observacion+"<br><br>" +
 	    "<button class='btn btn-success' onclick='verDocObsVisitante("+index+")'>" +
 	       "<i class='fa fa-pencil'></i> Editar" +
 	    "</button>" +
 	    "<label id='labelObsAuxVis"+val.id+"'></label>" +
 	 "</td>" +	
	 "<td>"+val.fechaDocEvaluacionTexto+"</td>" + 
	 "<td style='border-left:3px solid #afb5bb'>"+btnEliminar+"</td>" + 
      "</tr>");
}

function eliminarFilaDocumentoVisitante(pindex){
   var tipoDocumento = listFullDocVisitante[pindex].tipoDocPersonalExterno.nombre;
    
   mensajeUx="<label>¿Está seguro de eliminar este documento " +
      tipoDocumento+"?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocVisitante");

   $("#btnDevolverValorEliminarDocVisitante").on("click",function(){
      var dataParam={
         id: parseInt(listFullDocVisitante[pindex].id)
      };

      callAjaxPost(URL+'/public/visitante/documento/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El documento "+tipoDocumento+" seleccionado " +
                  "se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarDocVisitante");

               $("#modalMensajeUxActualizarDocVisitante").on("hidden.bs.modal",function(){
        	  cargarDocumentosPersonalExterno();  
               });

               break;
				
            default:
               alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });    
}

function verDocObsVisitante(pindex){
   var evalDocVisObj = listFullDocVisitante[pindex];
 	
   $("#tdObsDocVis"+evalDocVisObj.id)
   .html("<textarea rows='3' class='form-control' id='textObsDocVis"+evalDocVisObj.id+"'></textarea>" +
 	 "<button style='margin-right:10px;' class='btn btn-danger' " +
 	         "onclick='cancelarEditarDocObsVisitante("+pindex+")'>" +
 	    "<i class='fa fa-times'></i> Cancelar" +
 	 "</button>" +
 	 "<button class='btn btn-success' onclick='guardarDocObsVisitante("+pindex+")'>" +
 	    "<i class='fa fa-floppy-o'></i> Guardar" +
 	 "</button>");
    
   $("#textObsDocVis"+evalDocVisObj.id)
   .val(evalDocVisObj.evaluacionDoc.observacion).focus();
}

function cancelarEditarDocObsVisitante(pindex){
   var evalDocVisObj = listFullDocVisitante[pindex];
 	
   $("#tdObsDocVis"+evalDocVisObj.id)
   .html(evalDocVisObj.evaluacionDoc.observacion+"<br><br>" +
 	 "<button class='btn btn-success' onclick='verDocObsVisitante("+pindex+")'>" +
 	    "<i class='fa fa-pencil'></i> Editar" +
 	 "</button>" +
 	 "<br>" +
 	 "<label id='labelObsAuxVis"+evalDocVisObj.id+"'></label>");
}

function guardarDocObsVisitante(pindex){
   var evalDocVisObj = listFullDocVisitante[pindex];
   var pidEvalVis = evalDocVisObj.id;
   var evalIdVis = $("#textObsDocVis"+pidEvalVis).val();

   var dataParam={
 	  id: pidEvalVis,
 	  evaluacionDoc: {observacion: evalIdVis}
 	         }
    
   $("#labelObsAuxVis"+pidEvalVis).html("Guardando...");
    
   callAjaxPost(URL+'/public/documento_personal_externo/observacion_doc/save',dataParam,function(data){
      evalDocVisObj.evaluacionDoc.observacion = evalIdVis;
      cancelarEditarDocObsVisitante(pindex);
      $("#labelObsAuxVis"+pidEvalVis).html("Guardado");
   });		
}

 function guardarEvaluacionDocVisitante(pidEval){
    var evalId = parseInt($("#selEvaluacionDocVisitante"+pidEval).val());
 	
    var dataParam={
           id: pidEval,
           evaluacionDoc: {id: evalId}
                  }
    
    $("#labelAuxVis"+pidEval).html("Guardando...");
 	
    callAjaxPost(URL+'/public/documento_personal_externo/evaluacion_doc/save',dataParam, function(data){
       listEvaluacionDocPersonalExt.forEach(function(val){
          if(val.id == evalId){
 	    $("#labelAuxVis"+pidEval).html(val.icono+" Evaluación guardada");
          }
       });
    });	
}
 
function buscarDocumentoPersonalExternoCampos(){
   var docPerExtRegistro = igualarStringBuscar($("#valBuscarDocPerExtCampos").val());
  	
   listFullDocTrabContratista.forEach(function(val,index){
      if(igualarStringBuscar(val.trabajadorContratista.contratista.nombre).indexOf(docPerExtRegistro) != -1 || 
   	 igualarStringBuscar(val.trabajadorContratista.nombre).indexOf(docPerExtRegistro) != -1){
         $("#trDocTrabCon"+val.id).show();
      }else{
   	 $("#trDocTrabCon"+val.id).hide();
      }
   }); 
   
   listFullDocVisitante.forEach(function(val,index){
      if(igualarStringBuscar(val.visitante.empresaTrabajaNombre).indexOf(docPerExtRegistro) != -1 || 
    	 igualarStringBuscar(val.visitante.nombre).indexOf(docPerExtRegistro) != -1){
         $("#trDocVis"+val.id).show();
      }else{
    	 $("#trDocVis"+val.id).hide();
      }
   }); 
}

function reiniciarFiltroDocumentoPersonalExterno(){
//   $("#wrapperDocPersonalExt").show();
//    $("#btnVerFiltroProy").show();
//    $("#btnAplicFiltroProy").hide();
  
   $("#valBuscarDocPerExtCampos").val("").focus();
    
   listFullDocTrabContratista.forEach(function(val,index){
      $("#trDocTrabCon"+val.id).show();
   });
   
   listFullDocVisitante.forEach(function(val,index){
      $("#trDocVis"+val.id).show();
   });
}

//*** YA NO SE UTILIZA ***
var exoDocPerExtId,exoDocPerExtObj;
var listFullDocTrabConExonerados=[];
var listContratistasExoDocPerExt=[];
var listTrabajadoresConExoDocPerExt=[];
var banderaEdicionExo1;

function verTablaTrabContratistasExonerado(){
   banderaEdicionExo1 = false;
   $("#wrapTrabConExoneracion").remove();
    
   var listModal={
	  id:"modalTrabConExoneracion",
	  nombre:"Lista de trabajadores de la contratista - exonerados",
	  contenido:
	     "<button class='btn btn-info' id='btnVolverTablaTrabConExo' " +
	             "title='Regresar a la tabla anterior.' onclick='volverTablaPrincipalDocPerExt()'>" +
	        "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	     "</button>" +
	     "<button class='btn btn-success' id='btnCancelarAccTrabConExo' " +
                     "title='Deshacer los cambios realizados.' onclick='verTablaTrabContratistasExonerado()'>" +
                "<i class='fa fa-arrow-left fa-2x'></i>" +
             "</button>" +
	     "<button class='btn btn-success' id='btnNuevoTrabConExo' style='margin-left: 5px' " +
                     "title='Ingresar un nuevo registro a la tabla.' onclick='nuevoRegExoneracionDocPerExt()'>" +
                "<i class='fa fa-file-o fa-2x'></i>" +
             "</button>" +
	     "<button class='btn btn-success' id='btnSaveTrabConExo' style='margin-left: 5px' " +
	             "title='Guardar el registro de datos completados.' onclick='guardarRegExoneracionDocPerExt()'>" +
	        "<i class='fa fa-floppy-o fa-2x'></i>" +
	     "</button>" +
	     "<button class='btn btn-danger' id='btnEliminarTrabConExo' style='margin-left: 5px' " +
                     "title='Eliminar el registro de datos seleccionado.' onclick='eliminarRegExoneracionDocPerExt()'>" +
                "<i class='fa fa-times fa-2x'></i>" +
             "</button>" +
	     "<button class='btn btn-success' id='btnFiltroTrabConExo' style='margin-left: 5px' " +
	             "title='Permite filtrar los registros según ...'>" +
	        "<i class='fa fa-filter fa-2x'></i>" +
	     "</button>" +
	     "<div class='wrapper' id='wrapTrabConExoneracion'>" +
	        "<table id='tblTrabConExoneracion' style='width:2000px' " +
		       "class='table table-striped table-bordered table-hover table-fixed'>" +
	           "<thead>" +
		      "<tr>" +
		         "<td class='tb-acc' style='width:350px'>Contratista</td>" +
		         "<td class='tb-acc' style='width:350px'>Trabajador</td>" +
		         "<td class='tb-acc' style='width:400px'>Evidencia</td>" +
		         "<td class='tb-acc' style='width:200px'>Fecha inicio de exoneración</td>" +
		         "<td class='tb-acc' style='width:200px'>Fecha fin de exoneración</td>" +
		         "<td class='tb-acc' style='width:250px'>Registrado/Actualizado el</td>" +
		         "<td class='tb-acc' style='width:250px'>Registrado/Actualizado por</td>" +
		      "</tr>" +
		   "</thead>"+
		 "<tbody></tbody>" +
	      "</table>"};
	
   agregarModalPrincipalUsuario(listModal);
   
   cargarTablaTrabContratistasExonerado();
   
   resizeDivWrapper("wrapTrabConExoneracion",200);
   $("#btnCancelarAccTrabConExo").hide();
   $("#btnSaveTrabConExo").hide();
   $("#btnEliminarTrabConExo").hide();
   $("#btnFiltroTrabConExo").hide();
//   goheadfixedY("#tblTrabConExoneracion","#wrapTrabConExoneracion");
}

function cargarTablaTrabContratistasExonerado(){
   var dataParam={    
	  empresaId: getSession("gestopcompanyid")
                 }
   
   callAjaxPost(URL+'/contratista/exoneracion_documento_personal_externo/empresa',dataParam,function(data){
      listFullDocTrabConExonerados = data.listDocTrabConExonerados;
      $("#tblTrabConExoneracion tbody tr").remove();
      
      listFullDocTrabConExonerados.forEach(function(val,index){
         $("#tblTrabConExoneracion tbody")
         .append("<tr id='trExoDocPerExt"+val.id+"' onclick='editarRegExoneracionDocPerExt("+index+")'>" +
        	    "<td id='tdConExoDocPerExt"+val.id+"'>"+val.contratista.nombre+"</td>" +
                    "<td id='tdTrabExoDocPerExt"+val.id+"'>"+val.trabajador.nombre+"</td>" +
                    "<td id='tdEviExoneracion"+val.id+"'>"+val.evidenciaExoneracionNombre+"</td>" +
                    "<td id='tdFechaInicioExoDocPerExt"+val.id+"'>"+val.fechaInicioExoneracionTexto+"</td>" +
                    "<td id='tdFechaFinExoDocPerExt"+val.id+"'>"+val.fechaFinExoneracionTexto+"</td>" +
                    "<td id='tdFechaActExoDocPerExt"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +
                    "<td id='tdUsuExoDocPerExt"+val.id+"'>"+val.usuario.nombre+"</td>" +
	         "</tr>");
      });
      
      goheadfixedY("#tblTrabConExoneracion","#wrapTrabConExoneracion");
   });
}

function nuevoRegExoneracionDocPerExt(){
   if(!banderaEdicionExo1){
      formatoCeldaSombreableTabla(false,"tblTrabConExoneracion");
      exoDocPerExtObj = {id: 0};
      exoDocPerExtId = 0;  
      
      $("#tblTrabConExoneracion tbody")
      .prepend("<tr id='trExoDocPerExt0'>"+ 
	          "<td>" +
	             "<input type='text' id='inputContratistaExoDocPerExt' class='form-control' placeholder='Contratista'>" +
	             "<div id='divAutoCompletarConExoDocPerExt'></div>" +
	          "</td>" +
	          "<td>" +
	             "<input type='text' id='inputTrabContratistaExoDocPerExt' class='form-control' " +
	                    "placeholder='Trabajador de la contratista'>" +
	             "<div id='divAutoCompletarTrabConExoDocPerExt'></div>" +
	          "</td>"+
	          "<td id='tdEviExoneracion0'></td>"+
	          "<td>" +
	             "<input type='date' id='inputFechaInicioExoDocPerExt' class='form-control'>" +
	          "</td>"+
	          "<td>" +
	             "<input type='date' id='inputFechaFinExoDocPerExt' class='form-control'>" +
	          "</td>"+
	          "<td>*Automático</td>"+
	          "<td>*Automático</td>"+
	       "</tr>");
      
      var optionEvidencia={
             isImage: false,
             container:"#tdEviExoneracion"+exoDocPerExtId,
             idAux:"ExoDocPerExt",
             esNuevo:true,
             evidenciaNombre:"",
             functionCall:function(){},
             descargaUrl:"",
		          }
		
      crearFormEvidenciaCompleta(optionEvidencia);
      
      $("#inputContratistaExoDocPerExt").attr("onkeyup","verAutoCompletarConExoDocPerExt()");
      $("#inputTrabContratistaExoDocPerExt").attr("onkeyup","verAutoCompletarTrabConExoDocPerExt()");
      
      $("#btnVolverTablaTrabConExo").hide();
      $("#btnNuevoTrabConExo").hide();
      $("#btnCancelarAccTrabConExo").show();
      $("#btnSaveTrabConExo").show();
      banderaEdicionExo1 = true;
   }else{
      alert("Guarde primero.");
   }
}

function verAutoCompletarConExoDocPerExt(){ 
   var nombre = $("#inputContratistaExoDocPerExt").val().trim();
	
   if(nombre == ""){
      nombre = null
   }
	
   var dataParam={
	  nombre: "%"+nombre+"%",
	  empresaId: getSession("gestopcompanyid"),
	  isBuscador: 1
	         }
		
   callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
      if(data.contratistas.length == 0){
         data.contratistas.push({
            id: -1,nombre:"Sin asignar"
         });
         
         $("#inputTrabContratistaExoDocPerExt").val("");
      }
		
      listContratistasExoDocPerExt = data.contratistas;
		
      crearSelectOneMenuObligUnitarioCompleto("selAutoContratistaDocPerExt","verAutoCompletarTrabConExoDocPerExt()",
	 listContratistasExoDocPerExt,"id","nombre","#divAutoCompletarConExoDocPerExt","");
		
      $("#inputContratistaExoDocPerExt").attr("onkeyup","verAutoCompletarConExoDocPerExt()");
//      $("#inputTrabContratistaExoDocPerExt").val("");
      verAutoCompletarTrabConExoDocPerExt();
   });
}

function verAutoCompletarTrabConExoDocPerExt(){ 
   var contratistaId = parseInt($("#selAutoContratistaDocPerExt").val());
   console.log(contratistaId);
   
   if(!isNaN(contratistaId)){
      var nombre = $("#inputTrabContratistaExoDocPerExt").val().trim();
 	
      if(nombre == ""){
         nombre = null
      }
 	
      var dataParam={
 	     nombre: "%"+nombre+"%",
 	     contratistaId: contratistaId,
 	     isBuscador: 1
 	            }
 		
      callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
         if(data.trabajadores.length == 0){
            data.trabajadores.push({
               id: -1,nombre:"Sin asignar"
            });
         }
 		
         listTrabajadoresConExoDocPerExt = data.trabajadores;
 		
         crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajadorConDocPerExt","",listTrabajadoresConExoDocPerExt,
            "id","nombre","#divAutoCompletarTrabConExoDocPerExt","");
 		
         $("#inputTrabContratistaExoDocPerExt").attr("onkeyup","verAutoCompletarTrabConExoDocPerExt()");
      });
   }
}

function editarRegExoneracionDocPerExt(pindex){
   if(!banderaEdicionExo1){
      formatoCeldaSombreableTabla(false,"tblTrabConExoneracion");
      exoDocPerExtId = listFullDocTrabConExonerados[pindex].id;
      exoDocPerExtObj = listFullDocTrabConExonerados[pindex];
		
      $("#trExoDocPerExt"+exoDocPerExtId).addClass("fila-edicion");
      
      $("#tdFechaActExoDocPerExt"+exoDocPerExtId).html("*Automático");
      $("#tdUsuExoDocPerExt"+exoDocPerExtId).html("*Automático");
			
      $("#tdFechaInicioExoDocPerExt"+exoDocPerExtId)
      .html("<input type='date' id='inputFechaInicioExoDocPerExt'>");
      $("#inputFechaInicioExoDocPerExt").val(convertirFechaInput(exoDocPerExtObj.fechaInicioExoneracion));
      
      $("#tdFechaFinExoDocPerExt"+exoDocPerExtId)
      .html("<input type='date' id='inputFechaFinExoDocPerExt'>");
      $("#inputFechaFinExoDocPerExt").val(convertirFechaInput(exoDocPerExtObj.fechaFinExoneracion));
		
      $("#tdConExoDocPerExt"+exoDocPerExtId)
      .html("<input type='text' id='inputContratistaExoDocPerExt' class='form-control' placeholder='Contratista'>" +
	    "<div id='divAutoCompletarConExoDocPerExt'></div>");
      
      $("#inputContratistaExoDocPerExt").val(exoDocPerExtObj.contratista.nombre);
      verAutoCompletarConExoDocPerExt();
      $("#selAutoContratistaDocPerExt").val(exoDocPerExtObj.contratista.id);
      
      $("#tdTrabExoDocPerExt"+exoDocPerExtId)
      .html("<input type='text' id='inputTrabContratistaExoDocPerExt' class='form-control' " +
                   "placeholder='Trabajador de la contratista'>" +
	    "<div id='divAutoCompletarTrabConExoDocPerExt'></div>");
		
      $("#inputTrabContratistaExoDocPerExt").val(exoDocPerExtObj.trabajador.nombre);
      verAutoCompletarTrabConExoDocPerExt();
      $("#selAutoTrabajadorConDocPerExt").val(exoDocPerExtObj.trabajador.id);
	
      var optionEvidencia={
	     isImage: false,
	     container: "#tdEviExoneracion"+exoDocPerExtId,
	     idAux: "ExoDocPerExt",
	     esNuevo: false,
	     functionCall: function(){},
	     evidenciaNombre: exoDocPerExtObj.evidenciaExoneracionNombre,
	     descargaUrl: "/contratista/exoneracion_documento_personal_externo/evidencia?id="+exoDocPerExtId+"",
			  }
		
      crearFormEvidenciaCompleta(optionEvidencia);
		
      $("#btnVolverTablaTrabConExo").hide();
      $("#btnNuevoTrabConExo").hide();
      $("#btnCancelarAccTrabConExo").show();
      $("#btnSaveTrabConExo").show();
      $("#btnEliminarTrabConExo").show();
      banderaEdicionExo1 = true;
   }
} 

function eliminarRegExoneracionDocPerExt(){	
   $("#modalTrabConExoneracion").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar el registro de exoneración "+
             "seleccionado?</label>";
 	
   mensajesUx(mensajeUx,3,"","EliminarExoDocPerExt");
 	 
   $("#btnDevolverValorEliminarExoDocPerExt").on("click",function(){
      var dataParam={
 	     id:exoDocPerExtId
 		    };

      callAjaxPost(URL+'/contratista/exoneracion_documento_personal_externo/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalTrabConExoneracion").remove();
		    
	       mensajeUx = "<label>El registro fue eliminado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarExoDocPerExt");
	               
	       $("#modalMensajeUxActualizarExoDocPerExt").on("hidden.bs.modal",function(){
	          verTablaTrabContratistasExonerado();
	       });
	       break;
		
	    default:
	       alert("Ocurrió un error al eliminar la actividad.");
         }
      });
   });
   
   $("#btnRegresarPrevioEliminarExoDocPerExt").on("click",function(){
      $("#modalTrabConExoneracion").modal("show"); 
   });
}

function guardarRegExoneracionDocPerExt(){
   var campoVacio = true;
   
   var contratistaId = parseInt($("#selAutoContratistaDocPerExt").val());
   var trabajadorId = parseInt($("#selAutoTrabajadorConDocPerExt").val());
   var nombreEvi = $("#inputEviExoDocPerExt").val();
   
   var fechaInicioExoneracion = convertirFechaTexto($("#inputFechaInicioExoDocPerExt").val());
   var inputFechaInicioExoneracion;
   
   if(!fechaInicioExoneracion){  
      inputFechaInicioExoneracion = null;
   }else{
      inputFechaInicioExoneracion = fechaInicioExoneracion;
   }
   
   var fechaFinExoneracion = convertirFechaTexto($("#inputFechaFinExoDocPerExt").val());
   var inputFechaFinExoneracion;
   
   if(!fechaFinExoneracion){  
      inputFechaFinExoneracion = null;
   }else{
      inputFechaFinExoneracion = fechaFinExoneracion;
   }
   
   if(contratistaId == -1 || trabajadorId == -1 || nombreEvi.length == 0 ||
      inputFechaInicioExoneracion == null || inputFechaFinExoneracion == null){
      campoVacio = false; 
   }
   
   if(campoVacio){
      var dataParam={
             id: exoDocPerExtObj.id,
             contratista: {id: contratistaId},
             trabajador: {id: trabajadorId},
             fechaInicioExoneracion: inputFechaInicioExoneracion,
             fechaFinExoneracion: inputFechaFinExoneracion,
             tipoDocPerExtId: 2
   		    };
       
      callAjaxPost(URL+'/contratista/exoneracion_documento_personal_externo/save',dataParam,
         procesarResultadoGuardarEvidenciaExoneracion);	
   }else{
      $("#modalTrabConExoneracion").modal("hide");
      
      mensajeUx = "<label>Debe ingresar/seleccionar la información respectiva " +
      		  "en los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposExoDocPerExt");

      $("#modalMensajeUxAvisoCompletarCamposExoDocPerExt").on("hidden.bs.modal",function(){
         $("#modalTrabConExoneracion").modal("show");
      });
   }   
}

function procesarResultadoGuardarEvidenciaExoneracion(data){
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevaExoneracionId,"fileEviExoDocPerExt",bitsMega*10, 
            "/contratista/exoneracion_documento_personal_externo/evidencia/save",function(){
             
            $("#modalTrabConExoneracion").remove();
		    
            mensajeUx = "<label>La exoneración fue registrada con éxito.</label>";
            mensajesUx(mensajeUx,1,"","ActualizarExoDocPerExt");
               
            $("#modalMensajeUxActualizarExoDocPerExt").on("hidden.bs.modal",function(){
               verTablaTrabContratistasExonerado();
            });
	 });
         break;

      default:
         alert("Ocurrió un error al guardar la evidencia!");
   }
}

function cancelarRegExoneracionDocPerExt(){
   verTablaTrabContratistasExonerado();
}

function volverTablaPrincipalDocPerExt(){
   $("#modalTrabConExoneracion").modal("hide");  
}
// ******
