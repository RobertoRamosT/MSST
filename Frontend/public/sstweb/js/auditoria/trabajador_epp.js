
var mensajeUx;

function descargarExcelTrabajadoresEppEvaluadosInspeccion(){
   if(numAreas == 0){
      alert("No hay áreas asignadas a la inspección");
   }else{
      window.open(URL+"/auditoria/inspeccion_trabajador_epp/excel?id="+auditoriaId +
	          "&empresaId="+getSession("gestopcompanyid"));	
   }    
}

var banderaEdicionTrabEppAsocInspecc;
var listEvalInspeccTrabajadoresEpp=[];
var listCategoriasPreguntaTrabEpp=[];
var trabEppAsocInspeccId;
var trabEppAsocInspeccObj={};

function regresarInspeccDesdeTrabajadoresEppAsocInspecc(){
   $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("hide");
}

function consolidadoTrabajadoresEppAsociadosInspeccion(){
   $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").remove();
	    
   var listModal={
      id: "modalConsolidadoTrabajadoresEppAsociadosInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-table'></i> Trabajadores asociados a la inspección",
      contenido:
         "<button class='btn btn-info' id='btnVolverTrabEppAsocInspecc' title='Regresar a la vista anterior.' " +
		 "onclick='regresarInspeccDesdeTrabajadoresEppAsocInspecc()' style='margin-left: 5px'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"+" " +
            "<i class='fa fa-table fa-2x'></i>" +
         "</button>" +
         "<button class='btn btn-success' id='btnNuevaTrabEppAsocInspecc' style='margin-left: 5px' " +
		 "title='Nuevo registro de trabajador asociado.' onclick='nuevaConsolidadoTrabajadoresEppAsociadosInspeccion()'>" +
	    "<i class='fa fa-file-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnCancelarTrabEppAsocInspecc' style='margin-left: 5px' " +
	         "title='Cancelar acción.' onclick='cancelarConsolidadoTrabajadoresEppAsociadosInspeccion()'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnGuardarTrabEppAsocInspecc' style='margin-left: 5px' " +
	         "title='Guardar el registro de trabajador asociado.' onclick='guardarConsolidadoTrabajadoresEppAsociadosInspeccion()'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-danger' id='btnEliminarTrabEppAsocInspecc' style='margin-left: 5px' " +
	         "title='Eliminar el registro de trabajador asociado.' onclick='eliminarConsolidadoTrabajadoresEppAsociadosInspeccion()'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapConTrabEppAsocInspecc'>" +
	    "<table id='tblConTrabEppAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:320px'>Trabajador</td>" +
		     "<td class='tb-acc' style='width:280px'>Puesto de trabajo</td>" +
		     "<td class='tb-acc' style='width:250px'>EPPs asignados a su evaluación</td>" +
		     "<td class='tb-acc' style='width:200px'>Estado de la evaluación</td>" +
		     "<td class='tb-acc' style='width:200px'>Estado de la(s) medida(s) correctiva(s)</td>" +
		     "<td class='tb-acc' style='width:200px'>Registrado el</td>" +
		     "<td class='tb-acc' style='width:200px'>Modificado el</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
         "</div>"
   };
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConTrabEppAsocInspecc",200);
	   
   cargarConsolidadoTrabajadoresEppAsociadosInspeccion();
}

function cargarConsolidadoTrabajadoresEppAsociadosInspeccion(){
   $("#btnVolverTrabEppAsocInspecc").show();
   $("#btnNuevaTrabEppAsocInspecc").show();
   $("#btnCancelarTrabEppAsocInspecc").hide();
   $("#btnGuardarTrabEppAsocInspecc").hide();
   $("#btnEliminarTrabEppAsocInspecc").hide();
    
   banderaEdicionTrabEppAsocInspecc = false;
    
   var dataParam={
      auditoriaId: auditoriaObj.auditoriaId,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
 	   
   callAjaxPost(URL+'/auditoria/inspeccion_trabajador_epp',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listEvalInspeccTrabajadoresEpp = data.listEvalInspeccTrabajadoresEpp;
            listCategoriasPreguntaTrabEpp = data.listCategoriasPregunta;
 		  
 	    $("#tblConTrabEppAsocInspecc tbody tr").remove();
 		    
 	    listEvalInspeccTrabajadoresEpp.forEach(function(val,index){
 	       var numPreguntasMarcadas=0,numPreguntasAplican=0,estadoMedCor="",actualizadoPor="";
 	       
 	       listCategoriasPreguntaTrabEpp.forEach(function(val1){
 		  if(val.listCategoriasPreguntaId.indexOf(val1.id) != -1){
 		     numPreguntasAplican++;   
 		  }
 	       });
 		
 	       numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
 	       
 	       estadoMedCor = (val.numRespuestasMarcadasNo > 0?val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasNo:"0 / 0");
 	       
 	       actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
 		                 val.fechaActualizacionTexto+"<br>(por "+val.actualizadoPor+")");
 		
 	       $("#tblConTrabEppAsocInspecc tbody").append(
 	          "<tr id='trTrabEppAsocInspecc"+val.id+"' onclick='editarConsolidadoTrabajadoresEppAsociadosInspeccion("+index+")'>" +
 	             "<td id='tdTrabajadorTrabEppAsoInsp"+val.id+"'>"+val.trabajador.nombre+"</td>" +
 	             "<td id='tdPuestoTrabajoTrabEppAsoInsp"+val.id+"'>"+val.trabajador.puesto.positionName+"</td>" +
 	             "<td id='tdEppAplicanTrabEppAsoInsp"+val.id+"'>"+val.listCategoriasPreguntaNombre+"</td>" +
 	             "<td id='tdEstEvalTrabEppAsoInsp"+val.id+"'>"+numPreguntasMarcadas+" / "+numPreguntasAplican+"</td>" +
 	             "<td id='tdMedCorEvalTrabEppAsoInsp"+val.id+"'>"+estadoMedCor+"</td>" +
 	             "<td id='tdFecCretTrabEppAsoInsp"+val.id+"'>"+val.fechaCreacionTexto+"<br>(por "+val.registradoPor+")"+"</td>" +
 	             "<td id='tdFecActTrabEppAsoInsp"+val.id+"'>"+actualizadoPor+"</td>" +
 		  "</tr>");
 	    }); 
 		     
 	    formatoCeldaSombreableTabla(true,"tblConTrabEppAsocInspecc");
 	    break;
 		     
         default:
            alert("nop");
            break;
      }
 	      
      goheadfixedY("#tblConTrabEppAsocInspecc","#wrapConTrabEppAsocInspecc");
   });   
}

function cancelarConsolidadoTrabajadoresEppAsociadosInspeccion(){
   cargarConsolidadoTrabajadoresEppAsociadosInspeccion();
}

function editarConsolidadoTrabajadoresEppAsociadosInspeccion(pindex){
   if(!banderaEdicionTrabEppAsocInspecc){
      banderaEdicionTrabEppAsocInspecc = true;
      formatoCeldaSombreableTabla(false,"tblConTrabEppAsocInspecc");
        
      trabEppAsocInspeccId = listEvalInspeccTrabajadoresEpp[pindex].id;
      trabEppAsocInspeccObj = listEvalInspeccTrabajadoresEpp[pindex];
  	
      $("#trTrabEppAsocInspecc"+trabEppAsocInspeccId).addClass("fila-edicion");
          
      $("#tdTrabajadorTrabEppAsoInsp"+trabEppAsocInspeccId)
         .html("<input class='form-control' id='inputBuscarTrabajadorEppInspecc'>" +
 	       "<div id='divSelTrabajadorEppInspecc'></div>" +
 	       "<label>*Buscar Trabajador por DNI y/o nombres/apellidos " +
 	       "(debe ingresar 3 caracteres como mínimo).</label>");
      
      $("#inputBuscarTrabajadorEppInspecc").val(trabEppAsocInspeccObj.trabajador.nombre);
      
      $("#tdPuestoTrabajoTrabEppAsoInsp"+trabEppAsocInspeccId)
         .html("<span id='puestoTrabajoInfoTrabEpp' style='font-weight:bolder;'></span>");
      
      var listCategoriasPreguntaAd = trabEppAsocInspeccObj.listCategoriasPreguntaId.split(",");
      
      listCategoriasPreguntaTrabEpp.forEach(function(val){
         val.selected = 0;
	    
         listCategoriasPreguntaAd.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected= 1;
	    }
         });
      });
	
      crearSelectOneMenuObligMultipleCompleto("selMulCategoriasPregForm"," ",listCategoriasPreguntaTrabEpp,
         "id","nombre","#tdEppAplicanTrabEppAsoInsp"+trabEppAsocInspeccId,"sin asignar");
       
      var numPreguntasMarcadas = 
	 trabEppAsocInspeccObj.numRespuestasMarcadasSi + trabEppAsocInspeccObj.numRespuestasMarcadasNo;
      
      var numPreguntasAplican = 0;
      
      listCategoriasPreguntaTrabEpp.forEach(function(val1){
         if(trabEppAsocInspeccObj.listCategoriasPreguntaId.indexOf(val1.id) != -1){
	    numPreguntasAplican++;   
         }
      });
       
      $("#tdEstEvalTrabEppAsoInsp"+trabEppAsocInspeccId)
         .html("<a class='efectoLink' title='Enlace Evaluación trabajador asociado a la inspección' " +
              	  "onclick='evaluarTrabajadorEppAsociadoInspeccion()'>" +
                  "<i class='fa fa-list-ul'></i> "+numPreguntasMarcadas+" / "+numPreguntasAplican + 
               "</a>" );
      
      $("#tdFecActTrabEppAsoInsp"+trabEppAsocInspeccId).html("<label>*Automático</label>");
      
      buscarDisponibleTrabajadorEppInspecc();
 	  
      $("#btnVolverTrabEppAsocInspecc").hide();
      $("#btnNuevaTrabEppAsocInspecc").hide();
      $("#btnCancelarTrabEppAsocInspecc").show();
      $("#btnGuardarTrabEppAsocInspecc").show();
      $("#btnEliminarTrabEppAsocInspecc").show();
   }
}

function nuevaConsolidadoTrabajadoresEppAsociadosInspeccion(){
   if(!banderaEdicionTrabEppAsocInspecc){
      banderaEdicionTrabEppAsocInspecc = true;
      trabEppAsocInspeccId = 0;
       
      formatoCeldaSombreableTabla(false,"tblConTrabEppAsocInspecc");
      
      $("#tblConTrabEppAsocInspecc tbody").prepend(
         "<tr id='trTrabEppAsocInspecc0'>" +
 	    "<td>"+"<input class='form-control' id='inputBuscarTrabajadorEppInspecc'>" +
 	           "<div id='divSelTrabajadorEppInspecc'></div>" +
 	           "<label>*Buscar Trabajador por DNI y/o nombres/apellidos " +
 	           "(debe ingresar 3 caracteres como mínimo).</label></td>" +
 	    "<td><span id='puestoTrabajoInfoTrabEpp' style='font-weight:bolder;'></span></td>" +
 	    "<td id='tdEppAplicanTrabEppAsoInsp0'></td>" +
 	    "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>*Automático</label></td>" +
            "<td><label>------</label></td>" +
 	 "</tr>");
      
      crearSelectOneMenuObligMultipleCompleto("selMulCategoriasPregForm"," ",listCategoriasPreguntaTrabEpp,
         "id","nombre","#tdEppAplicanTrabEppAsoInsp0","sin asignar");
      
      buscarDisponibleTrabajadorEppInspecc();
       
      $("#btnVolverTrabEppAsocInspecc").hide();
      $("#btnNuevaTrabEppAsocInspecc").hide();
      $("#btnCancelarTrabEppAsocInspecc").show();
      $("#btnGuardarTrabEppAsocInspecc").show();
      $("#btnEliminarTrabEppAsocInspecc").hide();
   }
}

var listTrabajadoresEppBuscador=[],listTrabajadoresEppBuscadorAux=[];

function buscarDisponibleTrabajadorEppInspecc(){
   var nombre = $("#inputBuscarTrabajadorEppInspecc").val().trim();
   	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid")),
         auditoriaId: auditoriaObj.auditoriaId
      };
   		
      callAjaxPostNoLoad(URL+"/auditoria/auditoria_trabajador_epp/trabajador/buscar",dataParam,function(data){
         listTrabajadoresEppBuscador = [];
         listTrabajadoresEppBuscadorAux = data.trabajadores;
          
         if(listTrabajadoresEppBuscadorAux.length == 0){
   	    listTrabajadoresEppBuscador.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
   	    });
         }else{
   	    listTrabajadoresEppBuscadorAux.forEach(function(val){
   	       if(trabEppAsocInspeccId == 0){
   	          if(val.hasInspeccTrabEppAsociada == 0){
   	             listTrabajadoresEppBuscador.push(val);  
   	          }
   	       }else{
   		  if(val.hasInspeccTrabEppAsociada == 0 || 
   	             trabEppAsocInspeccObj.trabajador.trabajadorId == val.trabajadorId){
   		     listTrabajadoresEppBuscador.push(val);  
   	          }
   	       }
   	    });
   	  
   	    if(listTrabajadoresEppBuscador.length == 0){
   	       listTrabajadoresEppBuscador.push({
   	          trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
   	       }); 
   	    }
         }
   			
         var selTrabajadorEppInspeccionar = crearSelectOneMenuOblig("selTrabajadorEppInspeccionar",
            "informacionTrabajadorEppSeleccionado()",listTrabajadoresEppBuscador,"","trabajadorId","nombre");
   	       
         $("#divSelTrabajadorEppInspecc").html(selTrabajadorEppInspeccionar);
         $("#inputBuscarTrabajadorEppInspecc").attr("onkeyup","buscarDisponibleTrabajadorEppInspecc()");
         
         informacionTrabajadorEppSeleccionado();
      });
   }else{
      listTrabajadoresEppBuscador = [];
         
      listTrabajadoresEppBuscador.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
          
      var selTrabajadorEppInspeccionar = crearSelectOneMenuOblig("selTrabajadorEppInspeccionar","",
         listTrabajadoresEppBuscador,"","trabajadorId","nombre");
   		       
      $("#divSelTrabajadorEppInspecc").html(selTrabajadorEppInspeccionar);
      $("#inputBuscarTrabajadorEppInspecc").attr("onkeyup","buscarDisponibleTrabajadorEppInspecc()");
   	      
      informacionTrabajadorEppSeleccionado();
   }
}

function informacionTrabajadorEppSeleccionado(){
   var trabajadorId = parseInt($("#selTrabajadorEppInspeccionar").val());
      
   if(trabajadorId != -1){
      listTrabajadoresEppBuscador.forEach(function(val){
  	 if(val.trabajadorId == trabajadorId){
  	    document.querySelector('#puestoTrabajoInfoTrabEpp').innerText = val.puesto.positionName;   
  	    document.getElementById('puestoTrabajoInfoTrabEpp').style.color = "black";
  	 }
      });
   }else{
      document.querySelector('#puestoTrabajoInfoTrabEpp').innerText = "------";
      document.getElementById('puestoTrabajoInfoTrabEpp').style.color = "black";
   } 
}

function guardarConsolidadoTrabajadoresEppAsociadosInspeccion(){
   var campoVacio = true; 
     
   var trabajadorEppId = parseInt($("#selTrabajadorEppInspeccionar").val());
   
   var listCatPreTrabEpp = $("#selMulCategoriasPregForm").val();
   var listCategoriasPreguntaTrabEppAd = [];
   
   if(listCatPreTrabEpp != null){
      listCatPreTrabEpp.forEach(function(val,index){
	 listCategoriasPreguntaTrabEppAd.push(
            {id: parseInt(val)});
      });
   }
   
   var countAux = listCategoriasPreguntaTrabEppAd.length;
   var idRespAux = "";
     
   listCategoriasPreguntaTrabEppAd.forEach(function(val,index){
      if(countAux == (index+1)){
	 idRespAux += val.id;
      }else{
	 idRespAux += val.id+", "; 
      }	 
   });
     
   if(trabajadorEppId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el trabajador a inspeccionar.</label>";
   }else if(listCategoriasPreguntaTrabEppAd.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar al menos un EPP para la evaluación.</label>";  
   }
     
   if(campoVacio){
      var dataParam={
 	 id: trabEppAsocInspeccId,
  	 auditoria: {auditoriaId: auditoriaObj.auditoriaId},
  	 trabajador: {trabajadorId: trabajadorEppId},
  	 listCategoriasPregunta: listCategoriasPreguntaTrabEppAd
      }; 
         
      callAjaxPost(URL+'/auditoria/auditoria_trabajador_epp/save',dataParam,function(data){
	 $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("hide");
 	 
 	 if(trabEppAsocInspeccId == 0){ 
 	    mensajeUx="<label>El trabajador se asoció a la inspección con éxito.<br><br>" +
 	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
 	 }else{
 	    mensajeUx="<label>El registro del trabajador se actualizó con éxito.</label>"; 
 	 }
 	 
 	 mensajesUx(mensajeUx,1,"","ActualizarTrabEppAsoInspecc");
 	       
 	 $("#modalMensajeUxActualizarTrabEppAsoInspecc").on("hidden.bs.modal",function(){ 
 	    if(trabEppAsocInspeccId == 0){ 
 	       trabEppAsocInspeccObj.id = data.nuevoId;
 	       trabEppAsocInspeccObj.listCategoriasPreguntaId = idRespAux;
 	      
 	       evaluarTrabajadorEppAsociadoInspeccion();
 	    }else{
 	       $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
 	       cargarConsolidadoTrabajadoresEppAsociadosInspeccion();
 	    }
 	 });
      });
   }else{
      $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("hide");
        
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposTrabEppAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposTrabEppAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
      });
   }   
}

function eliminarConsolidadoTrabajadoresEppAsociadosInspeccion(){
   $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar este registro de trabajador " +
     	     "<br>(DNI: "+trabEppAsocInspeccObj.trabajador.dni+") seleccionado?" +
     	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarTrabEppAsoInspecc");

   $("#btnDevolverValorRespEliminarTrabEppAsoInspecc").on("click",function(){
      var dataParam={
  	 id: trabEppAsocInspeccId
      };

      callAjaxPost(URL+'/auditoria/auditoria_trabajador_epp/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El registro del trabajador se ha eliminado correctamente.</label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarTrabEppAsoInspecc");
  		
  	       $("#modalMensajeUxActualizarTrabEppAsoInspecc").on("hidden.bs.modal",function(){
  		  $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
  	          cargarConsolidadoTrabajadoresEppAsociadosInspeccion();
  	       });
  	       break;
  		
  	    default:	
  	       alert("Ocurrió un error al eliminar el registro!");
         }
      });
   });
   
   $("#btnRegresarPrevioRespEliminarTrabEppAsoInspecc").on("click",function(){
      $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
   });  
}

function regresarTrabajadoresEppAsocInspeccDesdeEvaluacionTrabajadorEpp(){
   $("#modalEvaluarTrabajadorEppAsociadoInspecc").modal("hide");
   $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
   cargarConsolidadoTrabajadoresEppAsociadosInspeccion();
}

var listFullEvaluacionesTrabajadorEppInspecc=[];
var listRespuestasInspeccTrabEpp=[{id:0,nombre:"No cumple"},{id:1,nombre:"Cumple"}];
var listNoAplicaInspeccTrabEpp=[{id:-1,nombre:"No aplica"}];
var listOpcionesObsInspeccTrabEpp=[
   {id:0,nombre:"Entrega"},{id:1,nombre:"Uso"},{id:2,nombre:"Estado"}
];

function evaluarTrabajadorEppAsociadoInspeccion(){
   $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("hide");
   $("#modalEvaluarTrabajadorEppAsociadoInspecc").remove();
 	    
   var listModal={
      id: "modalEvaluarTrabajadorEppAsociadoInspecc",
      maxWidth: "1500px",
      nombre: "<i class='fa fa-list-ul'></i> Evaluación del trabajador asociado a la inspección",
      contenido:
 	 "<button class='btn btn-success' id='btnCancelarEvalTrabEppAsocInspecc' style='margin-left: 5px' " +
 	         "title='Cancelar acción.' onclick='regresarTrabajadoresEppAsocInspeccDesdeEvaluacionTrabajadorEpp()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
 	 "<button class='btn btn-success' id='btnGuardarEvalTrabEppAsocInspecc' style='margin-left: 5px' " +
 	         "title='Guardar el registro de trabajador asociado.' onclick='validarEvaluacionTrabajadorEppAsociadoInspeccion()'>" +
 	    "<i class='fa fa-floppy-o fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapEvaluarTrabEppAsocInspecc'>" +
 	    "<table id='tblEvaluarTrabEppAsocInspecc' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 	             "<th class='tb-acc' colspan='5' style='width:1400px'>Evaluación</th>" +
 	             "<th class='tb-acc' colspan='5' style='width:1750px'>Medida correctiva</th>" +
 	             "<td class='tb-acc' rowspan='3' style='width:200px'>Actualizado por</td>" +
 	          "</tr>" +
 	          "<tr>" +
 		     "<td class='tb-acc' rowspan='2'>Pregunta</td>" +
 		     "<td class='tb-acc' rowspan='2'>Respuesta</td>" +
 		     "<td class='tb-acc' rowspan='2'>Observación</td>" +
 		     "<td class='tb-acc' rowspan='2'>Evidencia - Observación</td>" +
 		     "<td class='tb-acc' rowspan='2'>¿Qué aspectos están asociados a la observación?</td>" +
 		     "<td class='tb-acc' rowspan='2'>Descripción</td>" +
 		     "<td class='tb-acc' rowspan='2'>Fecha planificada</td>" +
 		     "<td class='tb-acc' rowspan='2'>Responsable</td>" +
 		     "<td class='tb-acc' rowspan='2'>Evidencia</td>" +
 		     "<td class='tb-acc' rowspan='2'>Estado</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
         "</div>"
   };
 	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapEvaluarTrabEppAsocInspecc",200);
 	  
   var dataParamAux={
      id: trabEppAsocInspeccObj.id,
      tipoAuditoriaId: auditoriaObj.auditoriaTipo
   };
    
   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/auditoria_trabajador_epp/evaluacion',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listFullEvaluacionesTrabajadorEppInspecc = data.listEvaluacionesTrabajadorEpp;
	
            listFullEvaluacionesTrabajadorEppInspecc.forEach(function(val,index){
               var listBooleanResp;
               
               var listBooleanResp = listRespuestasInspeccTrabEpp.sort(function(val1,val2){
        	      return val2.id - val1.id;
        	   });
               
               if(trabEppAsocInspeccObj.listCategoriasPreguntaId.indexOf(val.categoriaPreguntaId) == -1){
        	      listBooleanResp = listNoAplicaInspeccTrabEpp;
        	   }
        	   
               var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsTrabEppMovil"+val.verificacionId,
        	  listBooleanResp,"","id","nombre","habilitarCamposPreguntaInspeccionTrabajadorEppMovil",val.verificacionId);
               
               var radiosDetalleObs = crearCheckAutoOpcionesMultiple("radioDetalleObsInspeccTrabEpp"+val.verificacionId,
        	  listOpcionesObsInspeccTrabEpp,"","id","nombre","10px","left");
	       
	       var actualizadoPor = (val.actualizadoPor.length == 0?val.fechaActualizacionTexto:
	                             val.fechaActualizacionTexto+" (por "+val.actualizadoPor+")");
	    
	       $("#tblEvaluarTrabEppAsocInspecc tbody").append(
	          "<tr id='trHerrInspeccTrabEpp"+val.verificacionId+"'>" +
	             "<td>"+val.verificacion+"</td>" +
	             "<td>"+radiosPregInsMovil+"</td>" +
	             "<td>"+"<textarea rows='4' class='form-control' " +
	             	              "id='textObsAudiTrabEppMovil"+val.verificacionId+"'></textarea>" +
	                    "<span id='auxInfoTextObsAudiTrabEppMovil"+val.verificacionId+"' " +
	                    	  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
	             "<td id='tdEviPregTrabEpp"+val.verificacionId+"'></td>" +
	             "<td>"+radiosDetalleObs +
		          "<span id='auxInfoTextDetObscAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
	  	                "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" + 
	             "<td>"+"<textarea rows='4' class='form-control' " +
	                              "id='textDescAudiTrabEppMedCorMovil"+val.verificacionId+"'></textarea>" +
	                    "<span id='auxInfoTextDescAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
		                  "style='float:right;color:red;font-weight:bold;'></span>" +"</td>" +
		     "<td>"+"<input type='date' id='inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
	  	                   "class='form-control'>" +
	  	            "<span id='auxInfoTextFecPlanAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
	  		  	  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" + 
	             "<td>"+"<input class='form-control' id='inputBuscarResponsableTrabEppMedCorrMovil"+val.verificacionId+"'>" +
	        	    "<div id='divSelResponsableTrabEppMedCorrMovil"+val.verificacionId+"'></div>" +
	        	    "<label>*Buscar Responsable por DNI y/o nombres/apellidos " +
	        	           "(debe ingresar 3 caracteres como mínimo).</label>" +
	        	    "<span id='auxInfoTextRespAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
		  		  "style='float:right;color:red;font-weight:bold;'></span>"+"</td>" +
		     "<td id='tdEviMedCorTrabEpp"+val.verificacionId+"'></td>" +
	             "<td>"+"<span id='auxInfoEstadoAudiTrabEppMedCorMovil"+val.verificacionId+"' " +
		                  "style='color:red;font-weight:bold;font-size:18px;'></span>"+"</td>" + 
	             "<td>"+actualizadoPor+"</td>" +
		  "</tr>");
	       
	       var options={
	 	  container: "#tdEviPregTrabEpp"+val.verificacionId,
	 	  functionCall: function(){},
	 	  descargaUrl: (val.respuestaSimple == 1 || val.respuestaSimple == 2?"":
	 	     "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/evidencia?" +
	 	     "detalleAuditoriaTrabajadorEppId="+val.detalleAuditoriaTrabajadorEppId),
	 	  esNuevo: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaNombre == ""?true:false),
	 	  idAux: "PregInspeccTrabEpp"+val.verificacionId,
	 	  evidenciaNombre: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaNombre == ""?
	 		            "":val.evidenciaNombre),
	 	  mensajeAux: "<span id='auxInfoTextEviPregTrabEpp"+val.verificacionId+"' " +
	 			    "style='float:right;color:blue;font-weight:bold;'></span>"
	       }; 
	       
	       crearFormEvidenciaCompleta(options);
	               
	       var optionsMedCor={
	      	  container: "#tdEviMedCorTrabEpp"+val.verificacionId,
	      	  functionCall: function(){
	      	     estadoAccionCorrectivaInspeccTrabEpp(val.verificacionId);
	      	  },
	      	  descargaUrl: (val.respuestaSimple == 1 || val.respuestaSimple == 2?"":
	      	     "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia?" +
	      	     "detalleAuditoriaTrabajadorEppId="+val.detalleAuditoriaTrabajadorEppId),
	      	  esNuevo: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaAccCorNombre == ""?true:false),
	      	  idAux: "MedCorInspeccTrabEpp"+val.verificacionId,
	      	  evidenciaNombre: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaAccCorNombre == ""?
	      		            "":val.evidenciaAccCorNombre),
	      	  mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
	       }; 
	            
	       crearFormEvidenciaCompleta(optionsMedCor);
	 	        
	       $("#textObsAudiTrabEppMovil"+val.verificacionId).val(val.comentario);
	       
	       if(trabEppAsocInspeccObj.listCategoriasPreguntaId.indexOf(val.categoriaPreguntaId) == -1){
		  document.getElementById("-1radioPreguntaInsTrabEppMovil"+val.verificacionId).checked = true;
		  $("#trHerrInspeccTrabEpp"+val.verificacionId).hide();
	       }else if(val.detalleAuditoriaTrabajadorEppId > 0 && val.respuestaSimple != -1){
	          document.getElementById(val.respuestaSimple+"radioPreguntaInsTrabEppMovil"+val.verificacionId).checked = true;
	       }
	       
	       habilitarCamposPreguntaInspeccionTrabajadorEppMovil(val.respuestaSimple,val.verificacionId);
	       
	       if(val.respuestaSimple == 0){
		  $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
		        	  
		  var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
		  $("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
		          
		  listOpcionesObsInspeccTrabEpp.forEach(function(val1){
	             if((val1.id == 0 && val.hasObservacionEntrega == 1) || (val1.id == 1 && val.hasObservacionUso == 1) ||
		        (val1.id == 2 && val.hasObservacionEstado == 1)){
		        document.getElementById(val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).checked = true;  
	             }
		  });
		  
		  $("#inputBuscarResponsableTrabEppMedCorrMovil"+val.verificacionId).val(val.responsable);
    	          buscarResponsableAccionCorrectivaInspeccTrabEpp(val.verificacionId);
	       }
	    });
	    
	    break;
	
         default:
            alert("nop");
            break;
      }
	      
      goheadfixedY("#tblEvaluarTrabEppAsocInspecc","#wrapEvaluarTrabEppAsocInspecc");
   });
}

function habilitarCamposPreguntaInspeccionTrabajadorEppMovil(valResp,auxId){
   var valRespVisita = valResp;

   if(valRespVisita == 0){
      document.getElementById("textObsAudiTrabEppMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiTrabEppMovil'+auxId).innerText = "(obligatorio)";
         
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).disabled = false;
      document.querySelector('#auxInfoTextEviPregTrabEpp'+auxId).innerText = "(opcional)";
        
      document.getElementById("textDescAudiTrabEppMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextDescAudiTrabEppMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      listOpcionesObsInspeccTrabEpp.forEach(function(val){
         document.getElementById(val.id+"radioDetalleObsInspeccTrabEpp"+auxId).disabled = false;
      });
	      
      document.querySelector('#auxInfoTextDetObscAudiTrabEppMedCorMovil'+auxId).innerText = "(obligatorio)";
       
      document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextFecPlanAudiTrabEppMedCorMovil'+auxId).innerText = "(obligatorio)";
       
      document.getElementById("fileEviMedCorInspeccTrabEpp"+auxId).disabled = false;
      
      $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableTrabEppMedCorrMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextRespAudiTrabEppMedCorMovil'+auxId).innerText = "(obligatorio)";
      
      buscarResponsableAccionCorrectivaInspeccTrabEpp(auxId);
      estadoAccionCorrectivaInspeccTrabEpp(auxId);
   }else{
      document.getElementById("textObsAudiTrabEppMovil"+auxId).disabled = true;
      document.getElementById("textObsAudiTrabEppMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextObsAudiTrabEppMovil'+auxId).innerText = "";
         
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).disabled = true;
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).value = null;
      document.getElementById("inputEviPregInspeccTrabEpp"+auxId).value = null;
      document.querySelector('#auxInfoTextEviPregTrabEpp'+auxId).innerText = "";
      
      document.getElementById("textDescAudiTrabEppMedCorMovil"+auxId).disabled = true;
      document.getElementById("textDescAudiTrabEppMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextDescAudiTrabEppMedCorMovil'+auxId).innerText = "";
      
      listOpcionesObsInspeccTrabEpp.forEach(function(val){
         document.getElementById(val.id+"radioDetalleObsInspeccTrabEpp"+auxId).disabled = true;
         document.getElementById(val.id+"radioDetalleObsInspeccTrabEpp"+auxId).checked = false;  
      });
	      
      document.querySelector('#auxInfoTextDetObscAudiTrabEppMedCorMovil'+auxId).innerText = "";
       
      document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+auxId).disabled = true;
      document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextFecPlanAudiTrabEppMedCorMovil'+auxId).innerText = "";
       
      document.getElementById("fileEviMedCorInspeccTrabEpp"+auxId).disabled = true;
      document.getElementById("fileEviMedCorInspeccTrabEpp"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccTrabEpp"+auxId).value = null;
      
      document.querySelector('#auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).innerText = "------";   
      document.getElementById('auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).style.color = "black";
      
      $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId).val("");
      document.getElementById("inputBuscarResponsableTrabEppMedCorrMovil"+auxId).disabled = true;
      document.querySelector('#divSelResponsableTrabEppMedCorrMovil'+auxId).innerText = "";
      document.querySelector('#auxInfoTextRespAudiTrabEppMedCorMovil'+auxId).innerText = "";
   }
}

function estadoAccionCorrectivaInspeccTrabEpp(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccTrabEpp"+auxId).val();
    
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsTrabEpp=[];

function buscarResponsableAccionCorrectivaInspeccTrabEpp(auxId){
   var nombre = $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId).val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
 		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
	 listResponsablesAccCorInsTrabEpp = data.listResponsablesAccCorIns;
        
         if(listResponsablesAccCorInsTrabEpp.length == 0){
            listResponsablesAccCorInsTrabEpp.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
 	    });
         }
 			
         var selResponsableAccCorInsTrabEpp = crearSelectOneMenuOblig("selResponsableAccCorInsTrabEpp"+auxId,
            "",listResponsablesAccCorInsTrabEpp,"","trabajadorId","nombre");
 	       
         $("#divSelResponsableTrabEppMedCorrMovil"+auxId).html(selResponsableAccCorInsTrabEpp);
         $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccTrabEpp("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsTrabEpp = [];
       
      listResponsablesAccCorInsTrabEpp.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
        
      var selResponsableAccCorInsTrabEpp = crearSelectOneMenuOblig("selResponsableAccCorInsTrabEpp"+auxId,
	 "",listResponsablesAccCorInsTrabEpp,"","trabajadorId","nombre");
 		       
      $("#divSelResponsableTrabEppMedCorrMovil"+auxId).html(selResponsableAccCorInsTrabEpp);
      $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccTrabEpp("+auxId+")");
   }
}

var indiceActualEvaIndTrabEpp;

function validarEvaluacionTrabajadorEppAsociadoInspeccion(){
   var campoVacio = true; 
   
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
    
   listFullEvaluacionesTrabajadorEppInspecc.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
      observacion = $("#textObsAudiTrabEppMovil"+val.verificacionId).val();
      medidaCorrectiva = $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val();
      
      listCategoriasPreguntaTrabEpp.forEach(function(val2){
         if(val.categoriaPreguntaId == val2.id){
            nombrePregunta = val2.nombre;
         }
      });
      
      if(isNaN(bitRespuesta) && campoVacio){
	 campoVacio = false;
	 mensajeUx = "<label>Falta la respuesta en "+nombrePregunta+".</label>";
	 
	 document.getElementById("1radioPreguntaInsTrabEppMovil"+val.verificacionId).focus();
      }else if(bitRespuesta == 0 && campoVacio){
	 var respuestaEntrega,respuestaUso,respuestaEstado;

	 listOpcionesObsInspeccTrabEpp.forEach(function(val1){
            if(val1.id == 0){
	       respuestaEntrega = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
            }else if(val1.id == 1){
	       respuestaUso = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
            }else if(val1.id == 2){
	       respuestaEstado = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
            }
	 });
	  
	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val());
	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 
	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccTrabEpp"+val.verificacionId).val();
	 
	 var responsableId = parseInt($("#selResponsableAccCorInsTrabEpp"+val.verificacionId).val());
	 
	 if(observacion.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
	    
	    document.getElementById("textObsAudiTrabEppMovil"+val.verificacionId).focus();
	 }else if(respuestaEntrega == 0 && respuestaUso == 0 && respuestaEstado == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe seleccionar algunos(s) de los aspectos asociados a " +
        	        "la observación - "+nombrePregunta+".</label>";
				    
	    document.getElementById("0radioDetalleObsInspeccTrabEpp"+val.verificacionId).focus();
	 }else if(medidaCorrectiva.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
		         nombrePregunta+".</label>";  
	    
	    document.getElementById("textDescAudiTrabEppMedCorMovil"+val.verificacionId).focus();
	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
                        "medida correctiva - "+nombrePregunta+".</label>"; 
	    
	    document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).focus();
	 }else if(responsableId == -1){
            campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
			        nombrePregunta+".</label>";  
	            
            document.getElementById("inputBuscarResponsableTrabEppMedCorrMovil"+val.verificacionId).focus();
	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaIndTrabEpp = 1;
      guardarEvaluacionTrabajadorEppAsociadoInspeccion(guardarEvaluacionTrabajadorEppAsociadoInspeccion);
   }else{
      $("#modalEvaluarTrabajadorEppAsociadoInspecc").modal("hide");
      
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposEvalTrabEppAsoInspecc");

      $("#modalMensajeUxAvisoCompletarCamposEvalTrabEppAsoInspecc").on("hidden.bs.modal",function(){
	 $("#modalEvaluarTrabajadorEppAsociadoInspecc").modal("show");
      });
   }
}

function guardarEvaluacionTrabajadorEppAsociadoInspeccion(functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       respuestaEntrega,respuestaUso,respuestaEstado,responsableId;
   var dataParam;
    
   listFullEvaluacionesTrabajadorEppInspecc.forEach(function(val,index){
      if((index + 1) == indiceActualEvaIndTrabEpp){
         respuesta = parseFloat($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
         respAux = parseInt($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
         observacion = $("#textObsAudiTrabEppMovil"+val.verificacionId).val();
         validacionId = val.verificacionId;
       //var nombreEvi = $("#inputEviPregInspeccTrabEpp"+val.verificacionId).val();
         if(respAux == 0){
            medidaCorrectiva =  $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val();
            responsableId = parseInt($("#selResponsableAccCorInsTrabEpp"+val.verificacionId).val());
             
            var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val());
    	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
    	    
    	    listOpcionesObsInspeccTrabEpp.forEach(function(val1){
	       if(val1.id == 0){
	          respuestaEntrega = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }else if(val1.id == 1){
	          respuestaUso = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }else if(val1.id == 2){
	          respuestaEstado = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }
    	    });
         }else{
            medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
            respuestaEntrega = null;respuestaUso = null;respuestaEstado = null;
         }
         
         dataParam={
            detalleAuditoriaTrabajadorEppId: val.detalleAuditoriaTrabajadorEppId,
            auditoriaTrabajadorEppId: trabEppAsocInspeccObj.id, 
            verificacionId: val.verificacionId,
            respuestaSimple: respuesta,
            comentario: observacion,
            trabajadorId: parseInt(getSession("trabajadorGosstId")),
            accionCorrectiva: medidaCorrectiva,
            hasObservacionEntrega: respuestaEntrega,
            hasObservacionUso: respuestaUso,
            hasObservacionEstado: respuestaEstado,
            fechaPlanificacion: inputFechaPlanificada,
            responsableId: responsableId
         };
      }
   });  
   
   callAjaxPostNoUnlock(URL+'/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/save',dataParam,function(data){
      guardarEvidenciaAuto(data.nuevoId,"fileEviPregInspeccTrabEpp"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/evidencia/save",function(){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviMedCorInspeccTrabEpp"+validacionId,bitsEvidenciaVerificacion,
	 "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaIndTrabEpp == listFullEvaluacionesTrabajadorEppInspecc.length){
               $.unblockUI();
               $("#modalEvaluarTrabajadorEppAsociadoInspecc").modal("hide");
               
               mensajeUx = "<label>Inspección guardada con éxito.</label>";
               mensajesUx(mensajeUx,1,"","EvaluacionCompletadaInsTrabEpp");
					
               $("#modalMensajeUxEvaluacionCompletadaInsTrabEpp").on("hidden.bs.modal",function(){
        	  $("#modalConsolidadoTrabajadoresEppAsociadosInspecc").modal("show");
        	  cargarConsolidadoTrabajadoresEppAsociadosInspeccion();    
               });
            }else{
               indiceActualEvaIndTrabEpp++;
               functionCallBack(guardarEvaluacionTrabajadorEppAsociadoInspeccion);
            }
	 },"detalleAuditoriaTrabajadorEppId");
      },"detalleAuditoriaTrabajadorEppId");
   });
}
