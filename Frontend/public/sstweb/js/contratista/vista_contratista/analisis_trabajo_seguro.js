var objAnalisisTraSeg = {};
var indexAnalisisTraSeg;
var listAnalisisTraSeg = [];
var listTrabajadores = [];
var listTipoExamenContratista = [];
var mensajeUx;

function toggleMenuOpcionAnalisisTrabajoSeguro(obj,pindex){
   objAnalisisTraSeg = listAnalisisTraSeg[pindex];
   indexAnalisisTraSeg = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesAnalisisTrabajoSeguro=[
   {id: "opcEditarAnaTraSeg",
    nombre: "<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick: function(data){rellenarAnalisisTrabajoSeguro()}},
   {id: "opcEliminarAnaTraSeg",
    nombre: "<i class='fa fa-trash-o'></i> Eliminar ",
    functionClick: function(data){eliminarAnalisisTrabajoSeguro()}}
];

function marcarSubOpcionAnalisisTrabajoSeguro(pindex){
   funcionalidadesAnalisisTrabajoSeguro[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarAnalisisTrabajoSeguro(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/contratista/analisis_trabajo_seguro',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textTotal = "";
  	    listAnalisisTraSeg = data.listAnalisisTraSeg;
  	    listTrabajadores = data.listTrabajadores;
  	    listTipoExamenContratista = data.listTipoExamenContratista;
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listAnalisisTraSeg.forEach(function(val,index){
  	       var menuOpcion="",btnOpcion="";
  	       var textDescarga="------";
  	       
  	       menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
		    
  	       funcionalidadesAnalisisTrabajoSeguro.forEach(function(val1,index1){
	          menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionAnalisisTrabajoSeguro("+index1+")'>" +
			            val1.nombre +
			        "</li>";
  	       });
			    
  	       menuOpcion += "</ul>";
			    
               btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionAnalisisTrabajoSeguro(this,"+index+")'>" +
		              "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		           "</a>";
  	       
  	       if(val.evidenciaNombre != ""){
	          textDescarga =
		     "<a class='efectoLink' target='_blank' " +
		        "href='"+URL+"/contratista/analisis_trabajo_seguro/evidencia?id="+val.id+"'>"+
		        "<i class='fa fa-download'></i> "+val.evidenciaNombre + 
		     "</a>";
  	       }
  	           
  	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                   label:"<span style='font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
                   label:"<i class='fa fa-calendar'></i> Fecha inicio:",
  		   inputForm:val.fechaInicioTexto},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-calendar'></i> Fecha fin:",
  		   inputForm:val.fechaFinTexto},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-list-alt'></i> Descripción de la actividad:",
  	           inputForm:val.descripcion},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-list-alt'></i> Ubicación exacta de la actividad:",
  	           inputForm:val.ubicacion},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	 	   label:"<i class='fa fa-user'></i> Solicitado por ",
  	 	   inputForm:val.solicitante},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-file'></i> Evidencia - Formato ATS:",
  	 	   inputForm:textDescarga},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:"<i class='fa fa-calendar'></i> Registrado el ",
  	           inputForm:val.fechaRegistroTexto},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
  	           label:"<span style='font-size:18px;font-weight:bolder;'>*** PARTICIPANTES ***</span>"},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	 	   label:"<i class='fa fa-users'></i> N° de participantes registrados:",
  	 	   inputForm:val.numTrabajadoresRegistrados},
  	 	  {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",
  	  	   label:"",inputForm:
  	  	      "<a class='efectoLink' id='idLinkListTrabConAnaTraSeg"+index+"' " +
		         "onclick='cambiarContLinkListTrabConAnaTraSeg("+index+",0);'>" +
	                 "Ver lista trabajadores <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	              "</a><br>" +
	              "<div id='idDivListTrabConAnaTraSeg"+index+"' style='display:none;font-weight:bold;background:#E4DCDC;'>"+
		          val.listTrabajadoresNombre.replace(/;/gi,"<br>")+
	              "</div>"},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	           label:"<span style='font-size:18px;font-weight:bolder;'>*** ACTIVIDADES DE ALTO RIESGO ***</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
	 	   label:"<i class='fa fa-list-alt'></i> N° de actividades de alto riesgo registradas:",
	 	   inputForm:val.numActividadesAltoRiesgoRegistrados},
	 	  {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",
	  	   label:"",inputForm:
	  	      "<a class='efectoLink' id='idLinkListTipExaConAnaTraSeg"+index+"' " +
			 "onclick='cambiarContLinkListTipExaConAnaTraSeg("+index+",0);'>" +
		         "Ver lista actividades de alto riesgo <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
		      "</a><br>" +
		      "<div id='idDivListTipExaConAnaTraSeg"+index+"' style='display:none;font-weight:bold;background:#E4DCDC;'>"+
		          val.listTipoExamenesConNombre.replace(/;/gi,"<br>")+
		      "</div>"},
	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	           label:"<span style='font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  	   label:val.evaluacion.nota.icono+" Estado:",
	  	   inputForm:val.evaluacion.nota.nombre}
  	       ]; 
  	       
  	       if(val.evaluacion.nota.id != 3){
  		  if(val.evaluacion.nota.id == 1){
  		     listTotal.push(
  	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
  	  	         inputForm:val.evaluacion.fechaTexto+" (Por "+val.evaluacion.usuario.nombre+")"});  
  		     
  		  }else{
  		     listTotal.push(
  	                {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	         label:"<i class='fa fa-exclamation-circle'></i> Observación:",
  	  	         inputForm:val.evaluacion.observacion},
  	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	    	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
  	    	         inputForm:val.evaluacion.fechaTexto+" (Por "+val.evaluacion.usuario.nombre+")"});
  		 }
  	       }
  				
  	       textTotal+="<div class='eventoGeneral'>";	
  		   
  	          listTotal.forEach(function(val,index){
  	   	     textTotal+=""+obtenerSubPanelModuloVersionDos(val);
  	          });
  		   
  	       textTotal+="</div>"
  		   
  	       textTotal+="<div class='divMovilAnalisisTraSeg' id='divAnalisisTraSeg"+val.id+"'></div>";
  	    });
  	    
  	    var textNuevo = "";
     	     
  	    textNuevo = 
               "<div id='estadoMovilAnalisisTraSeg'>" +
     	          "<div class='tituloSubList'>" +
     	             "<i class='fa fa-plus-square'></i> Nuevo Análisis de Trabajo Seguro (ATS) " +
     	             "<button style='font-size:15px' title='Registrar un nuevo ATS' " +
     	                     "class='btn btn-success' onclick='nuevoAnalisisTrabajoSeguro()'>" +
     	                "<i class='fa fa-pencil'></i> Registrar" +
     	             "</button>" +
     	          "</div>" +
     	          "<div class='contenidoSubList' style='display:none'>" +
     	          "</div>" +
     	       "</div>";
  	       
  	    $(".divListPrincipal").append(textNuevo);   
  	       
     	    listPanelesPrincipal.push({
     	       id:"infoMovilAnalisisTraSeg",clase:"",styleContenido:"display:none",
     	       nombre:"<i class='fa fa-hand-o-right'></i> " +
     	       	         "Reportes Registrados ("+listAnalisisTraSeg.length+")",
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

function cambiarContLinkListTrabConAnaTraSeg(pindex,val){
   if(val == 0){
      document.getElementById("idDivListTrabConAnaTraSeg"+pindex).style.display = "";
        
      document.getElementById("idLinkListTrabConAnaTraSeg"+pindex)
         .innerHTML = "Ocultar lista trabajadores <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListTrabConAnaTraSeg"+pindex).onclick = function(){cambiarContLinkListTrabConAnaTraSeg(pindex,1);}
   }else{
      document.getElementById("idDivListTrabConAnaTraSeg"+pindex).style.display = "none";
        
      document.getElementById("idLinkListTrabConAnaTraSeg"+pindex)
         .innerHTML = "Ver lista trabajadores <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListTrabConAnaTraSeg"+pindex).onclick = function(){cambiarContLinkListTrabConAnaTraSeg(pindex,0);}
   }
}

function cambiarContLinkListTipExaConAnaTraSeg(pindex,val){
   if(val == 0){
      document.getElementById("idDivListTipExaConAnaTraSeg"+pindex).style.display = "";
         
      document.getElementById("idLinkListTipExaConAnaTraSeg"+pindex)
         .innerHTML = "Ocultar lista actividades de alto riesgo <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
     
      document.getElementById("idLinkListTipExaConAnaTraSeg"+pindex).onclick = function(){cambiarContLinkListTipExaConAnaTraSeg(pindex,1);}
   }else{
      document.getElementById("idDivListTipExaConAnaTraSeg"+pindex).style.display = "none";
         
      document.getElementById("idLinkListTipExaConAnaTraSeg"+pindex)
         .innerHTML = "Ver lista actividades de alto riesgo <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
     
      document.getElementById("idLinkListTipExaConAnaTraSeg"+pindex).onclick = function(){cambiarContLinkListTipExaConAnaTraSeg(pindex,0);}
   }
}

function nuevoAnalisisTrabajoSeguro(){
   objAnalisisTraSeg={id: 0};
   
   rellenarAnalisisTrabajoSeguro();
}

function rellenarAnalisisTrabajoSeguro(){
   $("#modalRellenarAnalisisTraSeg").remove();
   
   var listTrabajadoresAux = [];
   var listTipoExamenContratistaAux = []; 
   
   listTrabajadores.forEach(function(val){
      val.selected = 0;
   });
    
   listTipoExamenContratista.forEach(function(val){
      val.selected = 0;
   });
   
   listTrabajadoresAux = listTrabajadores;
   listTipoExamenContratistaAux = listTipoExamenContratista;
   
   var linkAnalisisTrabajoSeguro = 
      "<a class='efectoLink' target='_blank' " +
	 "href='"+URL+"/empresa/documento/evidencia?tipoId=14&id="+getSession("gestopcompanyid")+"'>" +
	 "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
      "</a>";
    
   var listItems=[
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Fecha inicio",
       inputForm:"<input type='date' id='inputFechaInicioAnaTraSeg' class='form-control'>"},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Fecha fin",
       inputForm:"<input type='date' id='inputFechaFinAnaTraSeg' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Descripción de la actividad",
       inputForm:"<textarea class='form-control' id='textDescripcionActAnaTraSeg' rows='3'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Participantes",
       inputForm:"",divContainer:"divParticipantesAnaTraSeg"},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Actividades de alto riesgo",
       inputForm:"",divContainer:"divActividadesAltRieAnaTraSeg"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8", 
       label:"Ubicación exacta de la actividad",
       inputForm:"<textarea class='form-control' id='textUbicacionActAnaTraSeg' rows='3'></textarea>"},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8", 
       label:"Solicitado por",
       inputForm:"<input class='form-control' id='inputSolicitanteAnaTraSeg'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8", 
       label:"Formato Análisis de Trabajo Seguro (ATS)",
       inputForm:linkAnalisisTrabajoSeguro},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Evidencia",
       inputForm:"",divContainer:"divEvidenciaAnaTraSeg"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",anchoLabel:"",anchoDiv:"",
       inputForm:"<button type='submit' class='btn btn-success'style='float:right;font-size:18px;'>" +
		    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
		 "</button>"} 
   ];
    
   var textForm = "";
   
   listItems.forEach(function(val,index){
      textForm += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalRellenarAnalisisTraSeg",
      nombre: "<i class='fa fa-pencil'></i> Registro Análisis de Trabajo Seguro (ATS)",
      contenido: "<form id='formRellenarAnalisisTraSeg' class='eventoGeneral'>" +
                     textForm +
                 "</form>"
   };
   
   crearModalPrincipalUsuario(opciones,function(){
      if($("#selMulTrabajadoresAnaTraSeg").length > 0){
	 return;	
      } 
       
      if(objAnalisisTraSeg.id > 0){
	 var trabsId = objAnalisisTraSeg.listTrabajadoresId.split(",");       	                               			
	 listTrabajadoresAux.forEach(function(val1){
	    val1.selected = 0;
	                		
	    trabsId.forEach(function(val,index){
	       if(val == val1.id){
	          val1.selected = 1;
	       }
	    });
	 });
	        
	 var tipExamsConId = objAnalisisTraSeg.listTipoExamenesConId.split(",");
	 listTipoExamenContratistaAux.forEach(function(val1,index1){
	    val1.selected = 0;
	         
	    tipExamsConId.forEach(function(val,index){
	       if(val == val1.id){
	   	  val1.selected = 1;
	       }
	    });
	 });
      }
      
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadoresAnaTraSeg","",listTrabajadoresAux,
	 "id","nombre","#divParticipantesAnaTraSeg","Todos");
       
      crearSelectOneMenuObligMultipleCompleto("selMulTipoExamConAnaTraSeg","",listTipoExamenContratistaAux,
         "id","nombre","#divActividadesAltRieAnaTraSeg","Todos");
   },true,true);
   
   var options={
      container: "#divEvidenciaAnaTraSeg",
      functionCall: function(){},
      descargaUrl: (objAnalisisTraSeg.id == 0?"":
	            "/contratista/analisis_trabajo_seguro/evidencia?id="+objAnalisisTraSeg.id),
      esNuevo: (objAnalisisTraSeg.id == 0),
      idAux: "DocAnaTraSeg",
      evidenciaNombre: (objAnalisisTraSeg.id == 0?"":objAnalisisTraSeg.evidenciaNombre)
   };

   crearFormEvidenciaCompleta(options);
   
   if(objAnalisisTraSeg.id > 0){
      $("#inputFechaInicioAnaTraSeg").val(convertirFechaInput(objAnalisisTraSeg.fechaInicio));
      $("#inputFechaFinAnaTraSeg").val(convertirFechaInput(objAnalisisTraSeg.fechaFin));
      $("#textDescripcionActAnaTraSeg").val(objAnalisisTraSeg.descripcion);
      
      $("#textUbicacionActAnaTraSeg").val(objAnalisisTraSeg.ubicacion);
      $("#inputSolicitanteAnaTraSeg").val(objAnalisisTraSeg.solicitante);
   }
    
   var editarDiv = $("#formRellenarAnalisisTraSeg");
 	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarAnalisisTraSeg();
   });
}

function guardarAnalisisTraSeg(){
   var formDiv = $("#formRellenarAnalisisTraSeg");
   var campoVacio = true;
   
   var fechaInicio = convertirFechaTexto($("#inputFechaInicioAnaTraSeg").val());
   var inputFechaInicio;

   if(!fechaInicio){
      inputFechaInicio = null;
   }else{
      inputFechaInicio = fechaInicio;
   }
   
   var fechaFin = convertirFechaTexto($("#inputFechaFinAnaTraSeg").val());
   var inputFechaFin;

   if(!fechaFin){
      inputFechaFin = null;
   }else{
      inputFechaFin = fechaFin;
   }
   
   if(inputFechaInicio != null && inputFechaFin != null){
      var numDiasVigencia = 0;
      
      numDiasVigencia = restaFechas($("#inputFechaInicioAnaTraSeg").val(),$("#inputFechaFinAnaTraSeg").val());
      
      if(numDiasVigencia > 0){
         var textDescripcion = $("#textDescripcionActAnaTraSeg").val();
   
         var listTrabajadoresId = [];
         var trabajadoresId = $("#selMulTrabajadoresAnaTraSeg").val();
         
         if(trabajadoresId != null){
            trabajadoresId.forEach(function(val){
               listTrabajadoresId.push({
                  id: parseInt(val)
               });
            });
         }
  
         var listTipoExamConId = [];
         var tipoExamConId = $("#selMulTipoExamConAnaTraSeg").val();
         
         if(tipoExamConId != null){
            tipoExamConId.forEach(function(val){
               listTipoExamConId.push({
                  id: parseInt(val)
               });
            });
         }
         
         var textUbicacion = $("#textUbicacionActAnaTraSeg").val();
   
         var inputSolicitante = $("#inputSolicitanteAnaTraSeg").val();
   
         var nombreEvidencia = $("#inputEviDocAnaTraSeg").val();
   
         if(textDescripcion.length == 0 || listTrabajadoresId.length == 0 || listTipoExamConId.length == 0 ||
            textUbicacion.length == 0 || inputSolicitante.length == 0 || nombreEvidencia.length == 0){
            mensajeUx = "<label>Debe completar todos los campos activos.</label>";
            campoVacio = false;
         }
      }else{
	 mensajeUx = "<label>La fecha fin no puede ser menor o igual a la fecha inicio.</label>";
	 campoVacio = false;  
      }
   }else{
      mensajeUx = "<label>Los campos Fecha inicio y Fecha fin son obligatorios.</label>";
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: objAnalisisTraSeg.id,
         fechaInicio: inputFechaInicio,
         fechaFin: inputFechaFin,
         descripcion: textDescripcion,
         listTrabajadores: listTrabajadoresId,
         listTipoExamenesCon: listTipoExamConId,
         ubicacion: textUbicacion,
         solicitante: inputSolicitante,
         contratistaId: parseInt(getSession("contratistaGosstId"))
      };
	 
      callAjaxPost(URL+'/contratista/analisis_trabajo_seguro/save',dataParam,procesarGuardarEvidenciaAnalisisTraSeg);
   }else{
      $("#modalRellenarAnalisisTraSeg").modal("hide");
 	
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposAnaTraSeg");

      $("#modalMensajeUxAvisoCompletarCamposAnaTraSeg").on("hidden.bs.modal",function(){
         $("#modalRellenarAnalisisTraSeg").modal("show");
      });
   }
}

function procesarGuardarEvidenciaAnalisisTraSeg(data){
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevoId,"fileEviDocAnaTraSeg",bitsMega*10,
            "/contratista/analisis_trabajo_seguro/evidencia/save",function(){
	       $("#modalRellenarAnalisisTraSeg").modal("hide");  
	    	
	       mensajeUx = "<label>El Análisis de Trabajo Seguro (ATS) fue registrado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarAnaTraSeg");
		    	 
	       $("#modalMensajeUxActualizarAnaTraSeg").on("hidden.bs.modal",function(){
	          habilitarAnalisisTrabajoSeguro();     
	       });
            });
         break;

      default:
         alert("Ocurrió un error al guardar la evidencia!");
   }
}

function eliminarAnalisisTrabajoSeguro(){
   $("#modalRellenarAnalisisTraSeg").modal("hide");
 	
   mensajeUx="<label>¿Está seguro de eliminar el Análisis de Trabajo Seguro (ATS) seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","RegAnaTraSeg");

   $("#btnDevolverValorRegAnaTraSeg").on("click",function(){
      var dataParam={
 	 id: objAnalisisTraSeg.id
      };
 		     
      callAjaxPost(URL+'/contratista/analisis_trabajo_seguro/delete',dataParam,function(data){
 	 switch(data.CODE_RESPONSE){
            case "05":
 	       mensajeUx="<label>El Análisis de Trabajo Seguro (ATS) seleccionado " +
 		         "se ha eliminado correctamente.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarAnaTraSeg");
 		       
 	       $("#modalMensajeUxActualizarAnaTraSeg").on("hidden.bs.modal",function(){
 	          habilitarAnalisisTrabajoSeguro(); 
 	       });
 	       break;
 							
            default:
 	       alert("Ocurrió un error al eliminar el Análisis de Trabajo Seguro (ATS)!");
 	 }
       });
    });
    
    $("#btnRegresarPrevioRegAnaTraSeg").on("click",function(){
       $("#modalRellenarAnalisisTraSeg").modal("show");  
    });
 }
