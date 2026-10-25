
var listFullInduccionesVirtualesEmpresa = [];
var listFullInduccionesVirtualesVisitanteEmpresa = [];
var listFullInduccionesVirtualesCapacitacionEmpresa  = [];
var listEvaluacionInduccionesVirtualesEmpresa = [];
var listTipoNotaInduccionVirtual = [],listTipoInduccionVirtual = [];
var listEstadosEvaluacionId=[],listTiposInduccionVirtualId=[];

function ocultarFiltroInduccionesVirtualesGeneral(){
   $("#modalFiltroInduccionVirtualGeneral").modal("hide");
}

function verFiltroInduccionesVirtualesGeneral(){
   $("#modalFiltroInduccionVirtualGeneral").modal("show");
}

function crearFiltroInduccionesVirtualesGeneral(functionCallBack){
   $("#modalFiltroInduccionVirtualGeneral").remove();
	
   var dataParam={}; 
	  		
   callAjaxPost(URL+'/contratista/inducciones_virtuales/contratista/filtro',dataParam,function(data){
      listTipoNotaInduccionVirtual = data.listTipoNota;listTipoInduccionVirtual = data.listTipoInduccionVirtual;
      
      if(personalizarUsuarioDocumento == 1 && usuarioConfig.tiposInduccionVirtualHabilitadosId.length != 0){
	 var listTipoInduccionVirtualAux = [];
	  
	 listTipoInduccionVirtual.forEach(function(val){
	    if(hashTipoInduccVirtualHabUsuario.get(val.id) != undefined){
	       val.selected = 1;listTipoInduccionVirtualAux.push(val);
	    } 
	 });
	 
	 listTipoInduccionVirtual = listTipoInduccionVirtualAux;
      }
      
      listTipoNotaInduccionVirtual.forEach(function(val){
         if([3,4].includes(val.id)){ 
	    val.selected = 1;
	 }
      });
	        
      var listBooleanSiNo = listBoolean.sort(function(val,val2){
	 return val2.id - val.id;
      });

      var selHasCargoInduccVirtual = crearSelectOneMenuOblig("selHasCargoInduccVirtual","",
	 listBooleanSiNo,1,"id","nombre");

      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",label:"Fecha - Inicio",inputForm:"<input type='date' id='fechaInicioInduccVirtual' class='form-control'>"},
         {sugerencia:"",label:"Fecha - Fin",inputForm:"<input type='date' id='fechaFinInduccVirtual' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"¿Ver solo registros con cargo?",inputForm:selHasCargoInduccVirtual,divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Tipo",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<span></span>",divContainer:"divFiltroTiposInduccVirtual"},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Estado de la evaluación del cargo",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<span></span>",divContainer:"divFiltroEstadosEvalInduccVirtual"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}, 
  	 {sugerencia:"",label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		              "onclick='ocultarFiltroInduccionesVirtualesGeneral()'>" +
               	                 "<i class='fa fa-times'></i> Cancelar" +
               	              "</button>",
  	  inputForm:"<button id='btnAplicarFiltroExamContratista' class='btn btn-success' type='submit' " +
  	      		    "onclick='valoresFiltroInduccionesVirtualesGeneral()' style='float:right;font-size:18px;'>" +
  	               "<i class='fa fa-filter'></i> Aplicar" +
  	            "</button>"}
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   
      var modalOptionsDocPerExt={
 	     id: "modalFiltroInduccionVirtualGeneral",
 	     nombre: "<i class='fa fa-filter'></i> Filtros",
  	     contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){
	 if($("#filtroEstadosEvalInduccVirtual").length > 0){
	    return;
	 }
	            
	 crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvalInduccVirtual","",listTipoNotaInduccionVirtual,
	    "id","nombre","#divFiltroEstadosEvalInduccVirtual","Todos");
	 
	 crearSelectOneMenuObligMultipleCompleto("filtroTiposInduccVirtual","",listTipoInduccionVirtual,
	    "id","nombre","#divFiltroTiposInduccVirtual","Todos");
      },true,true);
   
      var hoy = getSession("fechaHoyOrdenInversoTexto");
   
      $("#fechaInicioInduccVirtual").val(sumaFechaDias(-360,hoy));
      $("#fechaFinInduccVirtual").val(sumaFechaDias(90,hoy));
  				
      functionCallBack();
   });
}

function valoresFiltroInduccionesVirtualesGeneral(){
   ocultarFiltroInduccionesVirtualesGeneral();
   
   if($("#fechaInicioInduccVirtual").val().length > 0 && $("#fechaFinInduccVirtual").val().length > 0){
       listEstadosEvaluacionId = [];
       
       var estadoEvaluacionId = $("#filtroEstadosEvalInduccVirtual").val(); 
       
       if(estadoEvaluacionId != null){
          estadoEvaluacionId.forEach(function(val){
             listEstadosEvaluacionId.push(parseInt(val));
          });
       }

       listTiposInduccionVirtualId = [];
        
       var tipoInduccionVirtualId = $("#filtroTiposInduccVirtual").val(); 
       
       if(tipoInduccionVirtualId != null){
          tipoInduccionVirtualId.forEach(function(val){
             listTiposInduccionVirtualId.push(parseInt(val));
          });
       }
       
       cargarInduccionesVirtualesContratista();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha - Inicio' y 'Fecha - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroInduccionVirtualGeneral").modal("show");
	});
   }
}

// P-A00027 fase 3: la lista se pide al servidor por páginas de 100 filas, en una sola lista (primero los trabajadores de contratistas y después
// los visitantes). La búsqueda también la hace el servidor, al pulsar la lupa. Las listas listFullInduccionesVirtualesEmpresa y
// listFullInduccionesVirtualesVisitanteEmpresa contienen solo la página actual: las funciones que identifican la fila por su posición
// (observación del cargo, evaluación del cargo, vista previa de evidencias, eliminar) siguen valiendo porque se arman con esa misma página.
var paginaInduccVirtual = 1,totalPaginasInduccVirtual = 1,busquedaInduccVirtual = "";

function cargarInduccionesVirtualesContratista(pagina,despues){
   $("#containerInduccionesVirtuales").show();
   resizeDivWrapper("wrapInduccionVirtual",180);

   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),fechaInicioRegistro:$("#fechaInicioInduccVirtual").val(),
      fechaFinRegistro:$("#fechaFinInduccVirtual").val(),listTipoNotaId:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),
      listTipoInduccionVirtualId:(listTiposInduccionVirtualId.length == 0?null:listTiposInduccionVirtualId),
      hasCargoRegistrado: ($("#selHasCargoInduccVirtual").val() != null?$("#selHasCargoInduccVirtual").val():0),
      pagina:(typeof pagina == "number" && pagina > 0?pagina:1),busqueda:busquedaInduccVirtual
   };

   callAjaxPost(URL+'/contratista/inducciones_virtuales/vista_admin',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listFullInduccionesVirtualesEmpresa = data.list;
	 listFullInduccionesVirtualesVisitanteEmpresa = data.listIndVirVisitante;
	 listEvaluacionInduccionesVirtualesEmpresa = data.listEvaluacion;

	 $("#tblInduccionVirtual tbody tr").remove();

	 cargarListConexionesVisorEvidencia(1);

	 listFullInduccionesVirtualesEmpresa.forEach(agregarFilaInduccionVirtual);
	 listFullInduccionesVirtualesVisitanteEmpresa.forEach(agregarFilaInduccionVirtualVisitante);

	 goheadfixedY("#tblInduccionVirtual","#wrapInduccionVirtual");
	 $("#wrapInduccionVirtual").scrollTop(0);

	 actualizarPaginadorInduccionVirtual(data);

	 if(typeof despues == "function"){
	    despues();
	 }
      }else{
	 console.log("NOPNPO")
      }
   });
}

// Muestra "N de M (X registros)" y las flechas que correspondan. Si el servidor no trae datos de paginación (versión anterior),
// el paginador se oculta y la lista se ve completa, como antes.
function actualizarPaginadorInduccionVirtual(data){
   if(data.totalPaginas == undefined){
      $("#indicadorPaginaInduccVirtual").hide();
      return;
   }

   paginaInduccVirtual = data.pagina;
   totalPaginasInduccVirtual = data.totalPaginas;

   $("#labelFlechasInduccVirtual").html("<label>"+data.pagina+" de "+data.totalPaginas+" ("+(data.totalTrabajadores + data.totalVisitantes)+" registros)</label>");

   $("#flechaIzquierdaInduccVirtual").off("click").on("click",function(){
      cambiarPaginaInduccionVirtual(-1);
   }).toggle(data.pagina > 1);

   $("#flechaDerechaInduccVirtual").off("click").on("click",function(){
      cambiarPaginaInduccionVirtual(1);
   }).toggle(data.pagina < data.totalPaginas);

   $("#indicadorPaginaInduccVirtual").show();
}

function cambiarPaginaInduccionVirtual(salto){
   var nuevaPagina = paginaInduccVirtual + salto;

   if(nuevaPagina < 1 || nuevaPagina > totalPaginasInduccVirtual){
      return;
   }

   cargarInduccionesVirtualesContratista(nuevaPagina);
}
/*Inducciones*/
function agregarFilaInduccionVirtual(val,index){
    var nombreEvi = (val.evidenciaCargoNombre.length == 0?"------":
        "<a href='"+URL+"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+val.id+"' target='_blank' class='efectoLink'>" +
            "<i class='fa fa-download'></i> "+val.evidenciaCargoNombre +
        "</a>"+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaCargoNombre.replace(/['"]/g,''),val.evidenciaCargoUrl,1,0)) +
        (val.evidenciaCargoFechaTexto.length == 0?"":"<br><br>*Registrado el "+val.evidenciaCargoFechaTexto);
	
    var selEvaluacionCargoInduccionVirtual= crearSelectOneMenuOblig("selEvaluacionCargoInduccionVirtual"+val.id,
        "guardarEvaluacionCargoInduccionVirtual("+val.id+")",listEvaluacionInduccionesVirtualesEmpresa,val.evaluacionCargo.id,"id","nombre");
   
    var evaluacionEstado = selEvaluacionCargoInduccionVirtual+"<label id='labelAux"+val.id+"'>"+val.evaluacionCargo.icono+"</label>";
   
    var evaluacionObs = (val.evaluacionCargo.observacion.length == 0?"------":val.evaluacionCargo.observacion) +
        "<br>"+"<button class='btn btn-success' onclick='verEditarObsCargo("+index+")'>"+"<i class='fa fa-pencil'></i> Editar"+"</button>" +
        "<label id='labelObsAux"+val.id+"'></label>";
   
    var evaluacionDetalle = (val.fechaEvaluacionTexto.length == 0?"------":val.fechaEvaluacionTexto+"<br>(Por "+val.evaluacionCargo.usuario.userName+")");

    var columnaTrabajador = "<label>*Perfil:</label> "+val.perfil+"<br><label>*Nombres y apellidos:</label> "+val.trabajador.nombre +
        "<br><label>*Tipo - N° del documento:</label> "+val.trabajador.tipoDocumento.nombre+" - "+val.trabajador.nroDocumento +
        "<br><label>*Empresa donde trabaja:</label> "+val.trabajador.contratista.nombre+(val.trabajador.cliente.length == 0?"":" ("+val.trabajador.cliente+")");

    var columnaInduccionVirtual = "<label>*Tipo:</label> "+val.examen.tipo.nombre+"<br><label>*Tema:</label> "+val.examen.tema +
        "<br><label>*Fecha y hora:</label> "+val.diaRegistroTexto+" "+val.horaRegistroTexto+"<br><label>*Evaluación - nota:</label> " +
        val.evaluacion.icono+val.evaluacion.nombre+" - "+pasarDecimalPorcentaje(val.puntajeAlcanzado)+" ("+val.puntajeAlcanzadoSobreVeinte+")";
   
    $("#tblInduccionVirtual tbody").append(
        "<tr id='trInduccionVirtual"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+columnaTrabajador+"</td>" +
            "<td style='text-align:left;word-break:break-all;'>"+columnaInduccionVirtual+"</td>" +
	        "<td style='word-break:break-all;'>"+nombreEvi+"</td>" +
	        "<td>"+evaluacionEstado+"</td>" +
	        "<td id='tdObsCargo"+val.id+"' style='word-break:break-all;'>"+evaluacionObs+"</td>" +
	        "<td>"+evaluacionDetalle+"</td>" +
	        "<td style='text-align:center;'>"+botonEliminarInduccionVirtual(index,0)+"</td>" +
        "</tr>");
}

function verEditarObsCargo(pindex){
    var evalObj = listFullInduccionesVirtualesEmpresa[pindex];
	
    $("#tdObsCargo"+evalObj.id).html(
        "<textarea id='textObsCargo"+evalObj.id+"' class='form-control' rows='4'></textarea>" +
        "<button style='margin-right:10px;' class='btn btn-danger' onclick='cancelarEditarObsCargo("+pindex+")'>" +
            "<i class='fa fa-times'></i> Cancelar" +
        "</button>" +
        "<button class='btn btn-success' onclick='guardarObsCargo("+pindex+")'>" +
            "<i class='fa fa-floppy-o'></i> Guardar" +
        "</button>");
   
    $("#textObsCargo"+evalObj.id).val(evalObj.evaluacionCargo.observacion).focus();
}

function cancelarEditarObsCargo(pindex){
    var evalObj = listFullInduccionesVirtualesEmpresa[pindex];
	
    $("#tdObsCargo"+evalObj.id).html(
        (evalObj.evaluacionCargo.observacion.length == 0?"------":evalObj.evaluacionCargo.observacion) +
        "<br>"+"<button class='btn btn-success' onclick='verEditarObsCargo("+pindex+")'>" +
                   "<i class='fa fa-pencil'></i> Editar" +
               "</button>" +
        "<br><label id='labelObsAux"+evalObj.id+"'></label>");
}

function guardarObsCargo(pindex){
    var evalObj = listFullInduccionesVirtualesEmpresa[pindex];
    var pidEval = evalObj.id;
    var textObsCargo = $("#textObsCargo"+pidEval).val();

    var dataParam={
        id:pidEval,evaluacionCargo:{observacion:textObsCargo}
    };
   
    $("#labelObsAux"+pidEval).html("Guardando...");
   
    callAjaxPost(URL+'/contratista/induccion_virtual/observacion_cargo/save',dataParam,function(data){
        evalObj.evaluacionCargo.observacion = textObsCargo;
        cancelarEditarObsCargo(pindex);
        $("#labelObsAux"+pidEval).html("Guardado");
    });
}

function guardarEvaluacionCargoInduccionVirtual(pidEval){
   var evalId = parseInt($("#selEvaluacionCargoInduccionVirtual"+pidEval).val());
	
   var dataParam={
      id: pidEval,
      evaluacionCargo: {id: evalId}
   };
   
   $("#labelAux"+pidEval).html("Guardando...");
	
   callAjaxPost(URL+'/contratista/induccion_virtual/evaluacion_cargo/save',dataParam,function(data){
      listEvaluacionInduccionesVirtualesEmpresa.forEach(function(val){
         if(val.id == evalId){
	    $("#labelAux"+pidEval).html(val.icono+"<br>Evaluación guardada");
         }
      });
   });	
}

/*Capcaitaionces*/
//function agregarFilaInduccionVirtualCapacitacion(val,index){
//   var nombreEvi = "<a href='"+URL+"/contratista/capacitacion/trabajador/evidencia/cargo?id="+val.id+"' " +
//   		      "target='_blank' class='efectoLink'>Descargar</a>";
//	
//   if(val.evidenciaCargoNombre ==""){
//      nombreEvi = "-----";
//   }
//   
//   var selEvaluacionCargoInduccionVirtual= crearSelectOneMenuOblig("selEvaluacionCargoInduccionVirtualCap"+val.id,
//          "guardarEvaluacionCargoInduccionVirtualCapacitacion("+val.id+")",listEvaluacionInduccionesVirtualesEmpresa,
//          val.evaluacionCargo.id,"id","nombre");
//   
//   $("#tblInduccionVirtual tbody")
//   .append("<tr>" +
//	      "<td>"+val.trabajador.nombre+"</td>" +
//	      "<td>"+val.trabajador.tipoDocumento.nombre+"</td>" +
//	      "<td>"+val.trabajador.nroDocumento+"</td>" +
//	      "<td>"+val.trabajador.contratista.nombre+"</td>" + 
//	      "<td>"+val.examen.tema +"</td>" +
//	      "<td>"+val.diaRegistroTexto +"</td>" +
//	      "<td>"+val.horaRegistroTexto +"</td>" +
//	      "<td>"+val.evaluacion.icono+val.evaluacion.nombre+"</td>" +
//	      "<td>"+pasarDecimalPorcentaje(val.puntajeAlcanzado)+"<br> ("+val.puntajeAlcanzadoSobreVeinte+")" +"</td>" + 
//	      "<td>"+selEvaluacionCargoInduccionVirtual +
//	         "<label id='labelAuxCap"+val.id+"'>"+val.evaluacionCargo.icono+"</label>"+
//	      "</td>" +
//	      "<td id='tdObsCargoCap"+val.id+"'>"+val.evaluacionCargo.observacion+"<br>" +
//	         "<button class='btn btn-success' onclick='verEditarObsCargoCapacitacion("+index+")'>" +
//	            "<i class='fa fa-pencil'></i> Editar" +
//	         "</button>" +
//	         "<label id='labelObsAuxCap"+val.id+"'></label>"+
//	      "</td>" +
//	      "<td>"+nombreEvi+"</td>" + 
//	      "<td>"+val.evidenciaCargoFechaTexto +"</td>" + 
//	   "</tr>");
//}
//
//function verEditarObsCargoCapacitacion(pindex){
//   var evalObj = listFullInduccionesVirtualesCapacitacionEmpresa[pindex];
//	
//   $("#tdObsCargoCap"+evalObj.id)
//   .html("<input type='text' class='form-control' id='inputObsCargoCap"+evalObj.id+"'>" +
//	 "<button style='margin-right:10px;' class='btn btn-danger' onclick='cancelarEditarObsCargoCapacitacion("+pindex+")'>" +
//	    "<i class='fa fa-times'></i> Cancelar" +
//	 "</button>" +
//	 "<button class='btn btn-success' onclick='guardarObsCargoCapacitacion("+pindex+")'>" +
//	    "<i class='fa fa-floppy-o'></i> Guardar" +
//	 "</button>");
//	
//   $("#inputObsCargoCap"+evalObj.id).val(evalObj.evaluacionCargo.observacion).focus();
//}
//
//function cancelarEditarObsCargoCapacitacion(pindex){
//   var evalObj = listFullInduccionesVirtualesCapacitacionEmpresa[pindex];
//	
//   $("#tdObsCargoCap"+evalObj.id)
//   .html(evalObj.evaluacionCargo.observacion+"<br>" +
//	 "<button class='btn btn-success' onclick='verEditarObsCargoCapacitacion("+pindex+")'>" +
//	    "<i class='fa fa-pencil'></i> Editar" +
//	 "</button>" +
//         "<label id='labelObsAuxCap"+evalObj.id+"'></label>");
//}
//
//function guardarObsCargoCapacitacion(pindex){
//   var evalObj = listFullInduccionesVirtualesCapacitacionEmpresa[pindex];
//   var pidEval = evalObj.id;
//   var evalId = $("#inputObsCargoCap"+pidEval).val() ;
//	
//   var dataParam={
//          id : pidEval,
//          evaluacionCargo : {observacion : evalId}
//	         }
//  
//   $("#labelObsAuxCap"+pidEval).html("Guardando...");
//	
//   callAjaxPost(URL+'/contratista/capacitacion/observacion_cargo/save',dataParam,function(data){
//      evalObj.evaluacionCargo.observacion = evalId;
//      cancelarEditarObsCargoCapacitacion(pindex);
//      $("#labelObsAuxCap"+pidEval).html("Guardado");
//   });	
//}
//
//function guardarEvaluacionCargoInduccionVirtualCapacitacion(pidEval){
//   var evalId = parseInt($("#selEvaluacionCargoInduccionVirtualCap"+pidEval).val());
//	
//   var dataParam={
//	  id: pidEval,
//	  evaluacionCargo: {id: evalId}
//   		 }
//	
//   $("#labelAuxCap"+pidEval).html("Guardando...");
//	
//   callAjaxPost(URL+'/contratista/capacitacion/evaluacion_cargo/save',dataParam, function(data){
//      listEvaluacionInduccionesVirtualesEmpresa.forEach(function(val){
//         if(val.id == evalId){
//	    $("#labelAuxCap"+pidEval).html(val.icono+"Evaluación guardada");
//         }
//      });
//   });	
//}

function agregarFilaInduccionVirtualVisitante(val,index){
    cargarListConexionesVisorEvidencia(0,"/public/visitante/induccion_virtual/evidencia/cargo/url",val.evidenciaCargoNombre);
    
    var nombreEvi = (val.evidenciaCargoNombre.length == 0?"------":
        "<a href='"+URL+"/public/visitante/induccion_virtual/evidencia/cargo?id="+val.id+"' target='_blank' class='efectoLink'>" +
            "<i class='fa fa-download'></i> "+val.evidenciaCargoNombre +
        "</a>"+getButtonVisorEvidencia(val.evidenciaCargoNombre,val.id,1,0)) +
        (val.evidenciaCargoFechaTexto.length == 0?"":"<br><br>*Registrado el "+val.evidenciaCargoFechaTexto);
 	
    var selEvaluacionCargoInduccionVirtual= crearSelectOneMenuOblig("selEvaluacionCargoInduccionVirtual"+val.id,
        "guardarEvaluacionCargoInduccionVirtualVisitante("+val.id+")",listEvaluacionInduccionesVirtualesEmpresa,val.evaluacionCargo.id,"id","nombre");
   
    var evaluacionEstado = selEvaluacionCargoInduccionVirtual+"<label id='labelAuxVis"+val.id+"'>"+val.evaluacionCargo.icono+"</label>";
   
    var evaluacionObs =
        (val.evaluacionCargo.observacion.length == 0?"------":val.evaluacionCargo.observacion) +
        "<br>"+"<button class='btn btn-success' onclick='verEditarObsCargoVisitante("+index+")'>"+"<i class='fa fa-pencil'></i> Editar"+"</button>" +
        "<label id='labelObsAuxVis"+val.id+"'></label>";
   
    var evaluacionDetalle = (val.fechaEvaluacionTexto.length == 0?"------":val.fechaEvaluacionTexto+"<br>(Por "+val.evaluacionCargo.usuario.userName+")");

    var columnaTrabajador = "<label>*Perfil:</label> "+val.perfil+"<br><label>*Nombres y apellidos:</label> "+val.trabajador.nombre +
        "<br><label>*Tipo - N° del documento:</label> "+val.trabajador.tipoDocumento+" - "+val.trabajador.dni +
        "<br><label>*Empresa donde trabaja:</label> "+val.trabajador.empresaTrabajaNombre;

    var columnaInduccionVirtual = "<label>*Tipo:</label> "+"------"+"<br><label>*Tema:</label> "+val.nombreCapacitacion +
        "<br><label>*Fecha y hora:</label> "+val.diaRegistroTexto+" "+val.horaRegistroTexto+"<br><label>*Evaluación - nota:</label> " +
        val.evaluacion.icono+val.evaluacion.nombre+" - "+pasarDecimalPorcentaje(val.puntajeAlcanzado)+" ("+val.puntajeAlcanzadoSobreVeinte+")";

    $("#tblInduccionVirtual tbody").append(
        "<tr id='trInduccionVirtualVisitante"+val.id+"'>" +
            "<td style='text-align:left;word-break:break-all;'>"+columnaTrabajador+"</td>" +
            "<td style='text-align:left;word-break:break-all;'>"+columnaInduccionVirtual+"</td>" +
            "<td style='word-break:break-all;'>"+nombreEvi+"</td>" +
 	        "<td>"+evaluacionEstado+"</td>" +
 	        "<td id='tdObsCargoVis"+val.id+"' style='word-break:break-all;'>"+evaluacionObs+"</td>" +
 	        "<td>"+evaluacionDetalle+"</td>" +
 	        "<td style='text-align:center;'>"+botonEliminarInduccionVirtual(index,1)+"</td>" +
        "</tr>");
}

function verEditarObsCargoVisitante(pindex){
    var evalObj = listFullInduccionesVirtualesVisitanteEmpresa[pindex];
 	
    $("#tdObsCargoVis"+evalObj.id).html(
        "<textarea id='textObsCargoVis"+evalObj.id+"' class='form-control' rows='4'></textarea>" +
        "<button style='margin-right:10px;' class='btn btn-danger' onclick='cancelarEditarObsCargoVisitante("+pindex+")'>" +
            "<i class='fa fa-times'></i> Cancelar" +
        "</button>" +
        "<button class='btn btn-success' onclick='guardarObsCargoVisitante("+pindex+")'>" +
            "<i class='fa fa-floppy-o'></i> Guardar" +
        "</button>");
    
    $("#textObsCargoVis"+evalObj.id).val(evalObj.evaluacionCargo.observacion).focus();
}

function cancelarEditarObsCargoVisitante(pindex){
    var evalObj = listFullInduccionesVirtualesVisitanteEmpresa[pindex];
 	
    $("#tdObsCargoVis"+evalObj.id).html(
        (evalObj.evaluacionCargo.observacion.length == 0?"------":evalObj.evaluacionCargo.observacion) +
        "<br>"+"<button class='btn btn-success' onclick='verEditarObsCargoVisitante("+pindex+")'>" +
                   "<i class='fa fa-pencil'></i> Editar" +
               "</button>" +
        "<br><label id='labelObsAuxVis"+evalObj.id+"'></label>");
}

function guardarObsCargoVisitante(pindex){
    var evalObj = listFullInduccionesVirtualesVisitanteEmpresa[pindex];
    var pidEval = evalObj.id;
    var textObsCargoVis = $("#textObsCargoVis"+pidEval).val();

    var dataParam={
        id:pidEval,evaluacionCargo:{observacion:textObsCargoVis}
    };
    
    $("#labelObsAuxVis"+pidEval).html("Guardando...");
    
    callAjaxPost(URL+'/public/visitante/induccion_virtual/observacion_cargo/save',dataParam,function(data){
        evalObj.evaluacionCargo.observacion = textObsCargoVis;
        cancelarEditarObsCargoVisitante(pindex);
        $("#labelObsAuxVis"+pidEval).html("Guardado");
    });
}

function guardarEvaluacionCargoInduccionVirtualVisitante(pidEval){
   var evalId = parseInt($("#selEvaluacionCargoInduccionVirtual"+pidEval).val());
 	
   var dataParam={
      id: pidEval,
      evaluacionCargo: {id: evalId}
   }
    
   $("#labelAuxVis"+pidEval).html("Guardando...");
 	
   callAjaxPost(URL+'/public/visitante/induccion_virtual/evaluacion_cargo/save',dataParam, function(data){
      listEvaluacionInduccionesVirtualesEmpresa.forEach(function(val){
         if(val.id == evalId){
 	    $("#labelAuxVis"+pidEval).html(val.icono+"<br>Evaluación guardada");
         }
      });
   });	
}

/*P-A00022: eliminar un registro de inducción virtual (se archiva en un historial y la persona puede volver a llevarla)*/
// El botón solo se ofrece al administrador de la empresa (tipo de cuenta 1, como en otros módulos). Es solo comodidad de la
// pantalla: el servidor vuelve a comprobar el tipo de cuenta, la empresa y el tipo de registro, y responde 403 si no corresponde.
function puedeEliminarInduccionVirtual(){
   return parseInt(sessionStorage.getItem("accesoUsuarios")) == 1;
}

// Los textos que vienen de la base se escapan antes de pintarse (SEC-027).
function escaparTextoInduccionVirtual(texto){
   return $("<div>").text(texto == null?"":String(texto)).html();
}

// esVisitante: 0 = trabajador de contratista (lista listFullInduccionesVirtualesEmpresa), 1 = visitante. El botón solo lleva el
// índice de la fila; el registro y sus textos se leen de la lista al confirmar.
function botonEliminarInduccionVirtual(pindex,esVisitante){
   if(!puedeEliminarInduccionVirtual()){
      return "------";
   }

   return "<button class='btn btn-danger' type='button' title='Eliminar el registro de la inducción virtual' " +
              "onclick='eliminarRegistroInduccionVirtual("+pindex+","+esVisitante+")'>" +
              "<i class='fa fa-times'></i>" +
          "</button>";
}

function eliminarRegistroInduccionVirtual(pindex,esVisitante){
   var val = (esVisitante == 1?listFullInduccionesVirtualesVisitanteEmpresa[pindex]:listFullInduccionesVirtualesEmpresa[pindex]);

   if(val == undefined){
      return;
   }

   var detalle = "*Perfil: "+escaparTextoInduccionVirtual(val.perfil) +
      "<br>*Nombres y apellidos: "+escaparTextoInduccionVirtual(val.trabajador.nombre) +
      (esVisitante == 1?"":"<br>*Tipo: "+escaparTextoInduccionVirtual(val.examen.tipo.nombre)) +
      "<br>*Tema: "+escaparTextoInduccionVirtual(esVisitante == 1?val.nombreCapacitacion:val.examen.tema) +
      "<br>*Fecha y hora: "+escaparTextoInduccionVirtual(val.diaRegistroTexto)+" "+escaparTextoInduccionVirtual(val.horaRegistroTexto);

   var mensajeEliminarInducc = "<label>¿Está seguro de eliminar este registro de inducción virtual?</label>" +
      "<br><br><div style='text-align:left;font-size:14px;'>"+detalle+"</div>" +
      "<br><label>El registro se guardará en un historial y la persona podrá volver a llevar la inducción.</label>";

   mensajesUx(mensajeEliminarInducc,3,"","EliminarInduccVirtual");

   $("#btnDevolverValorEliminarInduccVirtual").html("<i class='fa fa-trash'></i> Eliminar");

   $("#btnDevolverValorEliminarInduccVirtual").on("click",function(){
      $("#modalMensajeUxEliminarInduccVirtual").modal("hide");

      var dataParam={
         id: val.id
      };

      callAjaxPost(URL+(esVisitante == 1?'/contratista/induccion_virtual/visitante/eliminar':'/contratista/induccion_virtual/eliminar'),
         dataParam,function(data){
            if(data.CODE_RESPONSE == "05"){
               // P-A00027: con paginación se recarga la página actual (se rellena y cambian los totales); si era la última fila de la
               // última página, el servidor devuelve la última página que exista. El aviso sale cuando la lista ya se recargó.
               cargarInduccionesVirtualesContratista(paginaInduccVirtual,function(){
                  mensajesUx("<label>El registro fue eliminado. La persona ya puede volver a llevar la inducción virtual.</label>",
                     1,"","EliminarInduccVirtualAviso");
               });
            }else{
               mensajesUx("<label>Ocurrió un error al eliminar el registro. No se hizo ningún cambio.</label>",
                  2,"","EliminarInduccVirtualError");
            }
         });
   });
}

// P-A00027 fase 3: la búsqueda (empresa, nombre o N° de documento) la hace el servidor al pulsar la lupa, sobre todas las páginas, y vuelve a
// la página 1. La tecla Enter sigue bloqueada (bloquearBotonEnter), como antes. Si el filtro todavía no se creó, no hay nada cargado que buscar.
function buscarInduccionVirtualCampos(){
   if($("#fechaInicioInduccVirtual").length == 0){
      return;
   }

   busquedaInduccVirtual = $.trim($("#valBuscarInduccionVirtualCampos").val());

   cargarInduccionesVirtualesContratista(1);
}

// Refresh: borra el texto de búsqueda y vuelve a pedir la página 1 con el filtro actual.
function reiniciarFiltroInduccionVirtual(){
   $("#valBuscarInduccionVirtualCampos").val("").focus();

   if($("#fechaInicioInduccVirtual").length == 0){
      return;
   }

   busquedaInduccVirtual = "";

   cargarInduccionesVirtualesContratista(1);
}


var listOpcConsolidadoInduccionVirtual=[
   {id:1,nombre:"Inducciones virtuales - Trabajador contratista"},
   {id:2,nombre:"Estado de los trabajos de alto riesgo - Trabajador contratista"}
];

function ocultarConsolidadosExcelInduccionVirtual(){
   $("#modalConsolidadosExcelInduccionVirtual").modal("hide");
}

function verConsolidadosExcelInduccionVirtual(){
   $("#modalConsolidadosExcelInduccionVirtual").remove();

   var selOpcConExcelInduccVirtual = crearSelectOneMenuOblig("selOpcConExcelInduccVirtual",
      "verAcordeConsolidadosExcelInduccionVirtual()",listOpcConsolidadoInduccionVirtual,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelInduccVirtual,divContainer:"divSelConExcelInduccVirtual"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelInduccionVirtual()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelInduccionVirtual()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions = {
      id:"modalConsolidadosExcelInduccionVirtual",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelInduccionVirtual();
}

function verAcordeConsolidadosExcelInduccionVirtual(){
   $(".atributo-consolidadoExcelInduccVirtual").remove(); 
   var listContenidoDivSelConExcelInduccVirtual = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelInduccVirtual").val());
   
   if([1].includes(opcConsolidadoExcel)){
      listContenidoDivSelConExcelInduccVirtual=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
          inputForm:"<input type='date' id='fechaInicioConsolidadoInduccVirtual' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
          inputForm:"<input type='date' id='fechaFinConsolidadoInduccVirtual' class='form-control'>"}                                        
      ]; 
   }
   
   if([1].includes(opcConsolidadoExcel)){
      var listBooleanSiNo = listBoolean.sort(function(val,val2){
 	 return val2.id - val.id;
      });

      var selHasCargoInduccVirtualAux = crearSelectOneMenuOblig("selHasCargoInduccVirtualAux","",
 	 listBooleanSiNo,1,"id","nombre"); 
       
      listContenidoDivSelConExcelInduccVirtual.push(
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",label:"¿Ver solo registros con cargo?",inputForm:selHasCargoInduccVirtualAux,divContainer:""},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Tipo",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<span></span>",divContainer:"divFiltroTiposInduccVirtualAux"},
	 {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Estado de la evaluación del cargo",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<span></span>",divContainer:"divFiltroEstadosEvalInduccVirtualAux"});
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelInduccVirtual.forEach(function(val){
      val.clase = "atributo-consolidadoExcelInduccVirtual";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelConExcelInduccVirtual").parent().after(contenido);
   
   if([1].includes(opcConsolidadoExcel)){
      var hoy = getSession("fechaHoyOrdenInversoTexto");
      
      $("#fechaInicioConsolidadoInduccVirtual").val(sumaFechaDias(-360,hoy));
      $("#fechaFinConsolidadoInduccVirtual").val(sumaFechaDias(90,hoy));
   }
   
   if(opcConsolidadoExcel == 1){
      listTipoInduccionVirtual.forEach(function(val){
         val.selected = (personalizarUsuarioDocumento == 1 && usuarioConfig.tiposInduccionVirtualHabilitadosId.length != 0?1:0);
      }); 
       
      listTipoNotaInduccionVirtual.forEach(function(val){
         val.selected = 0;
      }); 
       
      crearSelectOneMenuObligMultipleCompleto("selTiposInduccVirtualAux","",listTipoInduccionVirtual,
 	 "id","nombre","#divFiltroTiposInduccVirtualAux","Todos");
       
      crearSelectOneMenuObligMultipleCompleto("selEstadosEvalInduccVirtualAux","",listTipoNotaInduccionVirtual,
         "id","nombre","#divFiltroEstadosEvalInduccVirtualAux","Todos");
   }
}

function descargarConsolidadosExcelInduccionVirtual(){
   var campoVacio = true;
   
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelInduccVirtual").val());
   var fechaInicioConsolidado = $("#fechaInicioConsolidadoInduccVirtual").val();
   var fechaFinConsolidado = $("#fechaFinConsolidadoInduccVirtual").val();
    
   if([1].includes(opcConsolidadoExcel)){
      if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
	 campoVacio = false;mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
      } 
   }
    
   if(campoVacio){
      var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
      var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
   
      if([1].includes(opcConsolidadoExcel)){
	 var listTiposInduccionVirtualIdAux = [];
	    
	 var tipoInduccionVirtualIdAux = $("#selTiposInduccVirtualAux").val(); 
	   
	 if(tipoInduccionVirtualIdAux != null){
	    tipoInduccionVirtualIdAux.forEach(function(val){
	       listTiposInduccionVirtualIdAux.push(parseInt(val));
	    });
	 }
	 
         var listEstadosEvaluacionIdAux = [];
	    
	 var estadoEvaluacionIdAux = $("#selEstadosEvalInduccVirtualAux").val(); 
	   
	 if(estadoEvaluacionIdAux != null){
	    estadoEvaluacionIdAux.forEach(function(val){
	       listEstadosEvaluacionIdAux.push(parseInt(val));
	    });
	 }
	 
         window.open(URL+"/contratista/inducciones_virtuales/excel/lista/consolidado?" +
            "empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel +
            "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
            "&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText +
            "&listTipoInduccionVirtualId="+(tipoInduccionVirtualIdAux.length == 0?"-1":tipoInduccionVirtualIdAux) +
            "&listTipoNotaId="+(listEstadosEvaluacionIdAux.length == 0?"-1":listEstadosEvaluacionIdAux) +
            "&hasCargoRegistrado="+($("#selHasCargoInduccVirtualAux").val() != null?$("#selHasCargoInduccVirtualAux").val():0));
      }else if(opcConsolidadoExcel == 2){
	 window.open(URL+"/contratista/inducciones_virtuales/excel/lista/consolidado?" +
	    "empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel);
      }
   }else{
      $("#modalConsolidadosExcelInduccionVirtual").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
      
      $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelInduccionVirtual").modal("show");
      });
   }
}
