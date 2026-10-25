
var conductorId,indexConductor,conductorObj = {};
var listConductores = [],listTipoLicencias = [];
var mapTipoLicenciaCondHabilitada;
var numTipoLicCondHabilitados;
var mensajeUx;

// P-A00013: si "Consolidado conductores" se abrio desde el detalle de "Indicadores de la contratista"
// (verEstadoConductorDesdeIndTrab, en proyectos_indicadores.js), "Volver" regresa ahi en vez de a la
// vista principal -- ahorra tener que volver a buscar al trabajador. null = abierto normalmente,
// desde la pestana "Conductores".
var origenConsolidadoConductorEstadoActual = null;

function toggleMenuOpcionRegistrosConductores(obj,pindex){
   conductorObj = listConductores[pindex];
   indexConductor = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosConductores=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroHabilitarConductor(1);}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroHabilitarConductor();}}
];

function marcarSubOpcionRegistrosConductores(pindex){
   funcionalidadesRegistrosConductores[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function verRegistrosConductores(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
    
   callAjaxPost(URL+'/contratista/conductor',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listConductores = data.listConductores;listTipoLicencias = data.listTipoLicencias;
            
            mapTipoLicenciaCondHabilitada = new Map();
            
            numTipoLicCondHabilitados = listTipoLicencias.length;
            
            listTipoLicencias.forEach(function(val,index){
               mapTipoLicenciaCondHabilitada.set(val.id,1);
            });
            
  	    var listPanelesPrincipal = [],textConductores = "";
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listConductores.forEach(function(val,index){
 	       var btnOpcion = "",menuOpcion = "";
 	       
	       menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	          funcionalidadesRegistrosConductores.forEach(function(val1,index1){
		     menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosConductores("+index1+")'>" +
				       val1.nombre +
				   "</li>";
	          });		    
	       menuOpcion += "</ul>";
				    
	       btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosConductores(this,"+index+")'>" +
			      "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			   "</a>";
	       
	       var enlaceVerEstado =
                  "<a class='efectoLink' target='_blank' onclick='verEstadoActualConductor("+index+")'>"+
                     "<i class='fa fa-eye' aria-hidden='true'></i> Ver detalle" +
		  "</a>";
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Conductor:",inputForm:val.trabContratista.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-id-card'></i> Tipos de licencia:",inputForm:val.tiposLicenciaConductorNombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info-circle'></i> Estado actual:",inputForm:enlaceVerEstado},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",styleAux:"margin:0px 0px 0px -15px;",
 		   label:"<small style='font-weight:bolder;'>*Registrado el "+val.fechaCreacionTexto+"</small>",inputForm:""}
 	       ];  
 	       		
 	       textConductores += "<div class='eventoGeneral'>" +
 	                             "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textConductores += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textConductores+=     "</form>" +
 		                  "</div>";   
 	    });
  	    
  	    var btnConsolidadoAux = 
	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
	               "onclick='verConsolidadoConductoresEstadoActual()' title='Ver consolidado con el estado actual de todos los conductores.'>" +
	          "<i class='fa fa-table fa-4x'></i>" +
	       "</button>";

    	    var btnDescargaConsolidadoAux = 
  	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
  	               "onclick='verValoresPdfConsolidadoConductoresEstadoActual()' title='Descargar consolidado con el estado actual de todos los conductores.'>" +
  	          "<i class='fa fa-file-text-o fa-4x'></i>" +
  	       "</button>";
    	    	  				
     	    listPanelesPrincipal.push(
     	       {id: "registroMovilHabilitarConductor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroHabilitarConductor(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro de conductor",nombre:"Registrar nuevo conductor",contenido:""},
               {id: "infoMovilHabilitarConductor",clase:"",styleAux:"",buttonAd:btnConsolidadoAux+btnDescargaConsolidadoAux,btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Conductores registrados ("+listConductores.length+")",
    		contenido:textConductores});

	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   });
}

function ocultarRegistroHabilitarConductor(){
   $("#modalRegistroHabilitarConductor").modal("hide");
}

function registroHabilitarConductor(opcionId){
   $("#modalRegistroHabilitarConductor").remove();  
   
   conductorId = (parseInt(opcionId) == 0?0:conductorObj.id);

   var radiosTipoLicenciasConductor = crearRadiosAutoOpcionesV2("radiosTipoLicenciasConductor",listTipoLicencias,
       (conductorId == 0?"":conductorObj.tiposLicenciaConductorId),"id","nombre","checkbox","left");
 	     
   var contenido = "",listContenido = [];
				
   if(conductorId == 0){
      listContenido.push(
         {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Trabajador",
	  inputForm:"<input type='text' id='inputTrabajadorRegHabCon' class='form-control'>" +
	            "<div id='divAutoCompletarTrabajadorRegHabCon'></div>" +
	 	    "<label>*Buscar trabajador por número de documento y/o nombre " +
	 		   "(debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"}); 
   }else{
      listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Conductor",inputForm:conductorObj.trabContratista.nombre});  
   }
   
   listContenido.push(
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Tipo de licencia",inputForm:""},
      {sugerencia:"",inputForm:radiosTipoLicenciasConductor,anchoLabel:"",anchoDiv:"",
       label:"",divContainer:"",fullRow:1,clase:"containerCheckbox"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroHabilitarConductor()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroHabilitarConductor()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"});
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalRegistroHabilitarConductor",
      nombre: "<i class='fa fa-pencil'></i> Registro habilitar conductor",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   if(conductorId == 0){
      $("#inputTrabajadorRegHabCon").attr("onkeyup","verAutoCompletarTrabajadorRegHabCon()");
      verAutoCompletarTrabajadorRegHabCon();
   }
}

var listTrabajadorBuscadorAux = [];

function verAutoCompletarTrabajadorRegHabCon(){
   var trabajador = $("#inputTrabajadorRegHabCon").val().trim();

   if(trabajador.length >= 3){
      var dataParam={
	 nombre: "%"+trabajador+"%",isBuscador: 1,contratistaId: parseInt(getSession("contratistaGosstId")),esConductor: 0
      };

      callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
    	 listTrabajadorBuscadorAux = (data.trabajadores.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.trabajadores);
    	  
    	 var selAutoTrabajadorRegHabCon = crearSelectOneMenuOblig("selAutoTrabajadorRegHabCon","",
            listTrabajadorBuscadorAux,"","id","nombre");
	
    	 $("#divAutoCompletarTrabajadorRegHabCon").html(selAutoTrabajadorRegHabCon);
	 $("#inputTrabajadorRegHabCon").attr("onkeyup","verAutoCompletarTrabajadorRegHabCon()");
      });
   }else{
      listTrabajadorBuscadorAux = [{id:-1,nombre:"Sin asignar"}];
	     
      var selAutoTrabajadorRegHabCon = crearSelectOneMenuOblig("selAutoTrabajadorRegHabCon","",
         listTrabajadorBuscadorAux,"","id","nombre");
	    		       
      $("#divAutoCompletarTrabajadorRegHabCon").html(selAutoTrabajadorRegHabCon);
      $("#inputTrabajadorRegHabCon").attr("onkeyup","verAutoCompletarTrabajadorRegHabCon()");
   }
}

function eliminarRegistroHabilitarConductor(){
   if(conductorObj.hasDocumentoAsociado == 0 ){ 
      $("#modalRegistroHabilitarConductor").modal("hide");
    
      mensajeUx="<label>¿Está seguro de eliminar el registro conductor seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","EliminarConductor");

      $("#btnDevolverValorEliminarConductor").on("click",function(){
         var dataParam={
            id:conductorObj.id,trabContratista: {id:conductorObj.trabContratista.id} 
         };

         callAjaxPost(URL+'/contratista/conductor/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
               case "05":
                  $("#modalRegistroHabilitarConductor").modal("hide");	
		
                  mensajeUx = "<label>El registro del conductor fue eliminado con éxito.</label>";
                  mensajesUx(mensajeUx,1,"","ActualizarConductor"); 
 								   
                  $("#modalMensajeUxActualizarConductor").on("hidden.bs.modal",function(){
 		     verRegistrosConductores();  
                  });
 	       
                  break;
			
               default:
                  alert("Ocurrió un error al eliminar la entrevista!");
            }
         });
      });
   }else{
      mensajeUx="<label>No se puede eliminar este registro conductor porque tiene documentos asociados.</label>";
      mensajesUx(mensajeUx,2,"","");
   }
}

function guardarRegistroHabilitarConductor(){
   var campoVacio = true;
   
   var trabContratistaId = parseInt($("#selAutoTrabajadorRegHabCon").val());
   
   var listTipoLicenciasHabilitadas = [],textoTipoLicenciasHabilitadas = "";

   listTipoLicencias.forEach(function(val,index){
      if(($("#"+val.id+"radiosTipoLicenciasConductor").prop("checked")?1:0) == 1){
	 listTipoLicenciasHabilitadas.push({id: parseInt(val.id)});
	 
	 textoTipoLicenciasHabilitadas += (textoTipoLicenciasHabilitadas.length == 0?val.id:","+val.id);
      }
   });
   
   if(conductorId == 0 && trabContratistaId == -1){
      mensajeUx = "<label>Debe seleccionar a un trabajador.</label>";campoVacio = false;  
   }else if(listTipoLicenciasHabilitadas.length == 0){
      mensajeUx = "<label>Debe seleccionar al menos un tipo de licencia.</label>";campoVacio = false;   
   }
    
   if(campoVacio){
      var dataParam={
	 id: conductorId,listTipoLicenciasHabilitadas: listTipoLicenciasHabilitadas,textoTipoLicHabilitadas: textoTipoLicenciasHabilitadas
      };
      
      dataParam.trabContratista = (conductorId == 0?{id: trabContratistaId}:null);
      dataParam.contratistaId = (conductorId == 0?parseInt(getSession("contratistaGosstId")):null);
	        
      callAjaxPostSimple(URL+'/contratista/conductor/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalRegistroHabilitarConductor").modal("hide");	
		
	       mensajeUx = "<label>El registro del conductor fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarConductor"); 
								   
	       $("#modalMensajeUxActualizarConductor").on("hidden.bs.modal",function(){
		  verRegistrosConductores();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro del conductor");
	 }
      });	
   }else{
      $("#modalRegistroHabilitarConductor").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionConductor");
      
      $("#modalMensajeUxValidacionConductor").on("hidden.bs.modal",function(){
	 $("#modalRegistroHabilitarConductor").modal("show");
      });
   }	
}

function volverEstadoActualConductor(){
   $("#modalEstadoActualConductor").modal("hide");
}

function verEstadoActualConductor(pIndexConductor){
   $("#modalEstadoActualConductor").remove();
   
   conductorObj = listConductores[pIndexConductor];
   
   var contenidoColumnaTipoLicCond = "";
   
   listTipoLicencias.forEach(function(val,index){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:300px'>"+val.nombre+"</th>";
   });
   
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverEstadoActualConductor()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   
   var modalOptions={
      maxWidth:"90%",id:"modalEstadoActualConductor",
      nombre:"<i class='fa fa-user'></i> Conductor "+conductorObj.trabContratista.nombre+" <span id='spanConductorEstadoActual'></span>",
      contenido: 
	  buttonVolver +
         "<div class='wrapper' id='wrapperEstadoActualConductor'>" +
            "<table id='tblEstadoActualConductor' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' rowspan='2' style='width:400px'>Documento a nivel conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitados+"' style='width:"+(numTipoLicCondHabilitados*300)+"px'>Tipo de licencia conductor</th>" +
		  "</tr>" +
		  "<tr>" +
		      contenidoColumnaTipoLicCond +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperEstadoActualConductor",190);
   cargarEstadoActualConductor();
}

function cargarEstadoActualConductor(){
   callAjaxPost(URL+'/contratista/conductor/estado_actual',conductorObj,function(data){
      if(data.CODE_RESPONSE == "05"){
	 var listDocumentosConductor = data.listDocumentosConductor;
 	 var numTipoLicenciaCondHabilitadosTotal = 0,numTipoLicenciaCondAprobadosTotal = 0;
	 
 	 $("#tblEstadoActualConductor tbody tr").remove();
 	 
 	 listDocumentosConductor.forEach(function(val,index){
 	    $("#tblEstadoActualConductor tbody").append(
 	       "<tr>" +
 	          "<td>"+val.nombre+"</td>" +
 	           (mapTipoLicenciaCondHabilitada.get(1) == 1?"<td>"+val.estadoActualVehiculoCiudad+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(2) == 1?"<td>"+val.estadoActualVehiculo4x4+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(3) == 1?"<td>"+val.estadoActualCamionCisterna+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(4) == 1?"<td>"+val.estadoActualMaquinariaGrua+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(5) == 1?"<td>"+val.estadoActualLineaAmarilla+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(6) == 1?"<td>"+val.estadoActualVehiculosLivianos+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(7) == 1?"<td>"+val.estadoActualVehiculosPesados+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(8) == 1?"<td>"+val.estadoActualCamionesGruas+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(9) == 1?"<td>"+val.estadoActualVehiculosIndustriales+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(10) == 1?"<td>"+val.estadoActualMaquinariaPesada+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(11) == 1?"<td>"+val.estadoActualTipoLicCond11+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(12) == 1?"<td>"+val.estadoActualTipoLicCond12+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(13) == 1?"<td>"+val.estadoActualTipoLicCond13+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(14) == 1?"<td>"+val.estadoActualTipoLicCond14+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(15) == 1?"<td>"+val.estadoActualTipoLicCond15+"</td>":"") +
 	           (mapTipoLicenciaCondHabilitada.get(16) == 1?"<td>"+val.estadoActualTipoLicCond16+"</td>":"") +
 	       "</tr>");
 	    
 	    numTipoLicenciaCondHabilitadosTotal = numTipoLicenciaCondHabilitadosTotal + val.numTipoLicenciaCondHabilitados;
 	    numTipoLicenciaCondAprobadosTotal = numTipoLicenciaCondAprobadosTotal + val.numTipoLicenciaCondAprobados;
 	 });
 	 
 	 var habilitado = (numTipoLicenciaCondHabilitadosTotal == numTipoLicenciaCondAprobadosTotal &&
            (numTipoLicenciaCondHabilitadosTotal > 0 || (conductorObj.tiposLicenciaConductorId != null && conductorObj.tiposLicenciaConductorId.length > 0))?"Sí":"No");
 	 
 	 $("#spanConductorEstadoActual").html("- ¿Habilitado? "+habilitado +
 	    " ("+numTipoLicenciaCondAprobadosTotal +"/"+numTipoLicenciaCondHabilitadosTotal+")");
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblEstadoActualConductor","#wrapperEstadoActualConductor");
   });
}

function volverConsolidadoConductoresEstadoActual(){
   $("#modalConsolidadoConductorEstadoActual").modal("hide");

}

var listConsolidadoConductoresEstado = [];

function verConsolidadoConductoresEstadoActual(prefiltroConductor,origen){
   $("#modalConsolidadoConductorEstadoActual").remove();

   // Se fija en cada apertura (no solo al volver): si se cierra con la "X" en vez de "Volver", no deja
   // un origen viejo que desvie la proxima apertura normal desde la pestana "Conductores".
   origenConsolidadoConductorEstadoActual = (origen || null);

   var contenidoColumnaTipoLicCond = "";

   listTipoLicencias.forEach(function(val,index){
      contenidoColumnaTipoLicCond += "<th class='tb-acc' style='width:430px'>"+val.nombre+"</th>";
   });

   var contenido = "";

   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoConductoresEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";

   var buscadorOpciones =
      "<button type='button' class='btn btn-success' title='Refresh' style='float:right;' " +
              "onclick='reiniciarBuscadorConductoresEstadoActual()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>" +
      "<button type='button' class='btn btn-success' onclick='aplicarBuscadorConductoresEstadoActual()' " +
              "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° documento, nombre o apellido " +
	      "del conductor coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='N° documento, nombre o apellido' class='form-control' id='valBuscarValorConductoresEstadoActual' " +
             "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoConductorEstadoActual",
      nombre:"<i class='fa fa-table'></i> Consolidado conductores - Estado actual",
      contenido:
	  "<form class='form-inline'>" +
	      buttonVolver+buscadorOpciones +
	  "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoConductorEstadoActual'>" +
            "<table id='tblConsolidadoConductorEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>Cumple (nivel conductor)</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:300px'>Conductor</th>" +
		     "<th class='tb-acc' colspan='"+numTipoLicCondHabilitados+"' style='width:"+(numTipoLicCondHabilitados*430)+"px'>Tipo de licencia conductor</th>" +
	          "</tr>" +
	          "<tr>" +
		      contenidoColumnaTipoLicCond +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   // Si se abrio desde el detalle de "Indicadores de la contratista", CUALQUIER forma de cerrar este modal (Volver, la X de la esquina o Esc)
   // regresa a ese detalle ya cargado, en vez de dejar al usuario en la primera pantalla de indicadores.
   if(origenConsolidadoConductorEstadoActual == "indicadorTrabContratista"){
      $("#modalConsolidadoConductorEstadoActual").on("hidden.bs.modal",function(){
         $("#modalConsolidadoTrabContAsig").modal("show");
      });
   }

   resizeDivWrapper("wrapperConsolidadoConductorEstadoActual",190);
   cargarConsolidadoConductoresEstadoActual(prefiltroConductor);
}

function cargarConsolidadoConductoresEstadoActual(prefiltroConductor){
   var dataParam={
      conductoresInfoAux: listConductores
   };

   callAjaxPost(URL+'/contratista/conductor/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listConsolidadoConductoresEstado = data.listConsolidadoConductoresEstado;

 	 $("#tblConsolidadoConductorEstadoActual tbody tr").remove();

 	 listConsolidadoConductoresEstado.forEach(function(val,index){
 	    var styleVehiculoCiudad = (val.estadoActualVehiculoCiudadTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculo4x4 = (val.estadoActualVehiculo4x4Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleCamionCisterna = (val.estadoActualCamionCisternaTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleMaquinariaGrua = (val.estadoActualMaquinariaGruaTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleLineaAmarilla = (val.estadoActualLineaAmarillaTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculosLivianos = (val.estadoActualVehiculosLivianosTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculosPesados = (val.estadoActualVehiculosPesadosTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleCamionesGruas = (val.estadoActualCamionesGruasTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleVehiculosIndustriales = (val.estadoActualVehiculosIndustrialesTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleMaquinariaPesada = (val.estadoActualMaquinariaPesadaTotal == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond11 = (val.estadoActualTipoLicCond11Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond12 = (val.estadoActualTipoLicCond12Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond13 = (val.estadoActualTipoLicCond13Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond14 = (val.estadoActualTipoLicCond14Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond15 = (val.estadoActualTipoLicCond15Total == "No aplica"?"":"style='text-align:left;'"),
 	        styleTipoLicCond16 = (val.estadoActualTipoLicCond16Total == "No aplica"?"":"style='text-align:left;'");
 	     
 	    $("#tblConsolidadoConductorEstadoActual tbody").append(
 	       "<tr id='trConductor"+val.id+"'>" +
 	          "<td>"+val.habilitado+"</td>" +
 	          "<td>"+val.trabContratista.nombre+"</td>" +
 	           (mapTipoLicenciaCondHabilitada.get(1) == 1?"<td "+styleVehiculoCiudad+">"+val.estadoActualVehiculoCiudadTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(2) == 1?"<td "+styleVehiculo4x4+">"+val.estadoActualVehiculo4x4Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(3) == 1?"<td "+styleCamionCisterna+">"+val.estadoActualCamionCisternaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(4) == 1?"<td "+styleMaquinariaGrua+">"+val.estadoActualMaquinariaGruaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(5) == 1?"<td "+styleLineaAmarilla+">"+val.estadoActualLineaAmarillaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(6) == 1?"<td "+styleVehiculosLivianos+">"+val.estadoActualVehiculosLivianosTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(7) == 1?"<td "+styleVehiculosPesados+">"+val.estadoActualVehiculosPesadosTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(8) == 1?"<td "+styleCamionesGruas+">"+val.estadoActualCamionesGruasTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(9) == 1?"<td "+styleVehiculosIndustriales+">"+val.estadoActualVehiculosIndustrialesTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(10) == 1?"<td "+styleMaquinariaPesada+">"+val.estadoActualMaquinariaPesadaTotal+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(11) == 1?"<td "+styleTipoLicCond11+">"+val.estadoActualTipoLicCond11Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(12) == 1?"<td "+styleTipoLicCond12+">"+val.estadoActualTipoLicCond12Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(13) == 1?"<td "+styleTipoLicCond13+">"+val.estadoActualTipoLicCond13Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(14) == 1?"<td "+styleTipoLicCond14+">"+val.estadoActualTipoLicCond14Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(15) == 1?"<td "+styleTipoLicCond15+">"+val.estadoActualTipoLicCond15Total+"</td>":"") +
	           (mapTipoLicenciaCondHabilitada.get(16) == 1?"<td "+styleTipoLicCond16+">"+val.estadoActualTipoLicCond16Total+"</td>":"") +
 	       "</tr>");
 	 });

 	 if(prefiltroConductor != null && prefiltroConductor.length > 0){
 	    $("#valBuscarValorConductoresEstadoActual").val(prefiltroConductor);
 	    aplicarBuscadorConductoresEstadoActual();
 	 }
      }else{
         console.log("NOPNPO");
      }

      goheadfixedY("#tblConsolidadoConductorEstadoActual","#wrapperConsolidadoConductorEstadoActual");
   });
}

function aplicarBuscadorConductoresEstadoActual(){
   var valorBuscador = igualarStringBuscar($("#valBuscarValorConductoresEstadoActual").val());

   listConsolidadoConductoresEstado.forEach(function(val,index){
      if(igualarStringBuscar(val.trabContratista.nombre).indexOf(valorBuscador) != -1){
         $("#trConductor"+val.id).show();
      }else{
         $("#trConductor"+val.id).hide();
      }
   });
}

function reiniciarBuscadorConductoresEstadoActual(){
   $("#valBuscarValorConductoresEstadoActual").val("").focus();

   listConsolidadoConductoresEstado.forEach(function(val,index){
      $("#trConductor"+val.id).show();
   });
}

var listConductoresFiltroPdf = [];

function ocultarValoresPdfConsolidadoConductoresEstadoActual(){
    $("#modalConsolidadoPdfCondEstadoActual").modal("hide");
}

function verValoresPdfConsolidadoConductoresEstadoActual(){
    $("#modalConsolidadoPdfCondEstadoActual").remove();  
    
   	var dataParam={ 
        contratistaId:parseInt(getSession("contratistaGosstId"))
   	};
   
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/conductor/descarga_pdf/filtro',dataParam,1,1,function(data){
        listConductoresFiltroPdf = data.listConductoresSimple;
	  
	  	if(!listConductoresFiltroPdf || listConductoresFiltroPdf.length === 0){
	        alert("No hay conductores seleccionados para generar el PDF.");
	      	return;
	  	}
   
      	var contenido = "";
		
		var listContenido=[
			{label:"Conductores",inputForm:"",idDivContainer:"divPdfCond"},
			{label:"Detalle de la actividad",inputForm:"<textarea class='form-control' id='textAreaDetallePdfCond' rows='5'></textarea>"},
			{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
			{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarValoresPdfConsolidadoConductoresEstadoActual()'>" +
			           "<i class='fa fa-times'></i> Cancelar" +
			       "</button>",
		     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarPdfConsolidadoConductoresEstadoActual()'>" +
		           	       "<i class='fa fa-download'></i> Descargar" +
		           	   "</button>"}
		];
			    
		listContenido.forEach(function(val){
		    contenido += obtenerSubPanelModuloVersionTres(val);
		});
		
		var modalOptions={
			id:"modalConsolidadoPdfCondEstadoActual",nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado conductores - Estado actual",
			contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
		};
			
      	crearModalPrincipalUsuario(modalOptions,function(){
	 		crearSelectOneMenuObligMultipleCompleto("selMulConductoresPdf","",listConductoresFiltroPdf,"id","nombre","#divPdfCond","Todos");
     	},true,true);
    });
}

function descargarPdfConsolidadoConductoresEstadoActual(){
    var detalleActividad = $("#textAreaDetallePdfCond").val();
   
   	var listConductoresId = [];
   	var condAsigId = $("#selMulConductoresPdf").val();
   
   	if(condAsigId != null && condAsigId.length > 0){
        condAsigId.forEach(function(val){
	 	    listConductoresId.push(parseInt(val));
      	});
   	}else{
        listConductoresFiltroPdf.forEach(function(val){
	        listConductoresId.push(parseInt(val.id));
      	});
   	}
   
	var dataParam={
	    contratistaId:getSession("contratistaGosstId"),detalleActividad:encodeURIComponent(detalleActividad || ""),listConductoresId:listConductoresId.join(",")
	};

	descargarArchivoPost(URL+"/contratista/conductor/descarga_pdf/consolidado_estado_actual",dataParam);
   
    $("#modalConsolidadoPdfCondEstadoActual").modal("hide");
}
