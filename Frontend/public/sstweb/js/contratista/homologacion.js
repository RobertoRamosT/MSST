/**
 * 
 */
var eventoHomologacionId,eventoHomologacionObj = {};
var banderaEdicionEv = false;
var listEventosHomologacionContratista = [],listListaHomologacionContratista = [],
    listTipoNotaHomologacionContratista = [];

var mensajeUx;

function verModalGraficoSeccionPregunta(){
   var modalOptions={
      id:"testContainer",
      contenido:
         "<div id='divGraficoEventoHomologacionTotal'></div>" +
		 "<div id='divGraficoEventoHomologacion'></div>",
      nombre:"Gráfico"
   };
   
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
	
   var dataParam={
      id: eventoHomologacionId
   };
	
   callAjaxPost(URL+"/contratista/evento_homologacion/indicador",dataParam,function(data){
      var secciones = data.secciones;
      var listSecciones = [],listDataSecciones=[];
		
      secciones.forEach(function(val){
         listSecciones.push(val.nombre);
         listDataSecciones.push(val.porcentajeAprobado.toFixed(2)*100);
      });
		
      Highcharts.chart('divGraficoEventoHomologacion',{
         chart: {type: 'column'},
		 title: {text: 'DESEMPEÑO POR CRITERIO'},
      // subtitle: {text: 'Source: WorldClimate.com'},
		 xAxis: {
		    categories: listSecciones,
		    crosshair: true},
		 yAxis: {
		    min: 0,max: 100,
		    title: {text: 'Aprobado (%)'}},
		 tooltip: {
		    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                 '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
		    footerFormat: '</table>',
		    shared: true,useHTML: true},
		 plotOptions: {
		    column: {
		       pointPadding: 0.2,borderWidth: 0}},
		 series: [{
		    name: 'CRITERIO',data: listDataSecciones}]});
      
      Highcharts.chart('divGraficoEventoHomologacionTotal',{
	     chart: {type: 'column'},
		 title: {text: 'DESEMPEÑO TOTAL'},
	  // subtitle: {text: 'Source: WorldClimate.com'},
		 xAxis: {
		    categories: ["Total"],
		    crosshair: true},
		 yAxis: {
		    min: 0,max: 100,
		    title: {text: 'Aprobado (%)'}},
		 tooltip: {
		    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                 '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
		    footerFormat: '</table>',
		    shared: true,useHTML: true},
		 plotOptions: {
		    column: {
		       pointPadding: 0.2,borderWidth: 0}},
		 series: [{
		    name: 'TOTAL',data: [eventoHomologacionObj.porcentajeAprobacion*100]}]
      });
   });
}

function verHomologacionContratistaPrincipal(){
   $("#tabHomologaciones").find(".container-fluid").hide();
   $("#tabHomologaciones").find("#divEventosHomologacion").show();   
    
   $("#tabHomologaciones").find("h2").html("<label>Homologación</label>"); 
}

function cargarEventosHomologacionContratista(){
   verHomologacionContratistaPrincipal();
   
   $("#btnCancelarEventoHomologacion").hide();$("#btnNuevoEventoHomologacion").show();
   $("#btnEliminarEventoHomologacion").hide();$("#btnGuardarEventoHomologacion").hide();
   $("#btnGraficoEventoHomologacion").hide();
   
   resizeDivWrapper("wrapEventoHomologacion",170);
//   $("#tabContratistas").find("h2").html("<a onclick='volverDivContratista();'> Contratistas</a> " +
//   "> Eventos homologación"); 
   banderaEdicionEv = false;
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))   
   };
	
   callAjaxPost(URL+'/contratista/evento_homologacion',dataParam,function(data){
      listEventosHomologacionContratista = data.list;
      listListaHomologacionContratista = data.listLista;
      listTipoNotaHomologacionContratista = data.listTipoNota;
				
      $("#tblEventoHomologacion tbody tr").remove();
				
      listEventosHomologacionContratista.forEach(function(val,index){
	 var valorPorcentajeAprobacion = 
	    (val.numPreguntasAprobadas+(val.numPreguntasAprobadasParcialmente)*0.5) / val.numPreguntas;
	  
	 var iconoAlerta = (val.numPreguntasPorRevisar > 0 && val.numPreguntasRespondidas > 0?
            "<i class='fa fa-exclamation-circle' style='font-size:19px;color:#df9226;'></i>":"");
         
         var estadoActualTexto = 
            (val.estadoActual == 1?"Futuro":(val.estadoActual == 2?"En curso":"Finalizado"));
					
         $("#tblEventoHomologacion tbody").append(
	    "<tr id='trevho"+val.id+"' onclick='editarEventoHomologacion("+index+")'>" +
	       "<td id='tdevhoConNom"+val.id+"'>"+val.contratista.nombre+"</td>" +
	       "<td id='tdevhofi"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
	       "<td id='tdevhohi"+val.id+"'>"+val.horaInicioTexto+"</td>" +
	       "<td id='tdevhoff"+val.id+"'>"+val.fechaFinTexto+"</td>" +
	       "<td id='tdevhohf"+val.id+"'>"+val.horaFinTexto+"</td>" +
	       "<td id='tdevhoEstAct"+val.id+"'><label>"+estadoActualTexto+"</label></td>" +
	       "<td id='tdevholis"+val.id+"'>"+val.lista.nombre+"</td>" +
	       "<td id='tdevhotv"+val.id+"'>"+val.lista.tipoVigencia.nombre+"</td>" +
	       "<td id='tdevhotr"+val.id+"'>"+val.trabajador.nombre+"</td>" +
	       "<td id='tdevhopr"+val.id+"'>"+iconoAlerta+" " +
		   (val.numPreguntasAprobadas+val.numPreguntasAprobadasParcialmente)+" / "+val.numPreguntas +
		  "<br><label>(Porcentaje aprobación: " +
		   pasarDecimalPorcentaje(valorPorcentajeAprobacion)+")</label></td>" +
	       "<td id='tdevhoEvaTotal"+val.id+"'>"+val.evaluacion.nombre+"</td>" +
	       "<td id='tdevhoevi"+val.id+"'>"+(val.evidenciaNombre.length == 0?"------":
		                                val.evidenciaNombre)+"</td>" +
	       "<td id='tdevhofecCre"+val.id+"'>"+val.fechaCreacionTexto+"</td>" +
	       "<td id='tdevhofecAct"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +
	    "</tr>");
      });
		    	
      formatoCeldaSombreableTabla(true,"tblEventoHomologacion"); 
      goheadfixedY("#tblEventoHomologacion","#wrapEventoHomologacion");
   });
}

function editarEventoHomologacion(pindex){
   if(!banderaEdicionEv){
      formatoCeldaSombreableTabla(false,"tblEventoHomologacion"); 
      eventoHomologacionObj = listEventosHomologacionContratista[pindex];
      eventoHomologacionId = eventoHomologacionObj.id;
      
      $("#trevho"+eventoHomologacionId).addClass("fila-edicion");
      
      $("#tdevhoConNom"+eventoHomologacionId).html(
         "<input class='form-control' id='inputBuscarContratistaEventoHomologacion'>" +
	 "<div id='divSelContratistaEventoHomologacion'></div>" +
	 "<label>*Buscar contratista por RUC y/o nombre " +
	        "(debe ingresar 3 caracteres como mínimo).</label>");
      $("#inputBuscarContratistaEventoHomologacion").val(eventoHomologacionObj.contratista.nombre);
	
      $("#tdevhofi"+eventoHomologacionId).html(
         "<input type='date' id='dateInicioEventoHomologacion' class='form-control'>");
      $("#dateInicioEventoHomologacion").val(convertirFechaInput(eventoHomologacionObj.fechaInicio));
	
      $("#tdevhohi"+eventoHomologacionId).html(
         "<input type='time' id='timeInicioEventoHomologacion' class='form-control'>");
      $("#timeInicioEventoHomologacion").val(eventoHomologacionObj.horaInicio);
	
      $("#tdevhoff"+eventoHomologacionId).html(
         "<input type='date' id='dateFinEventoHomologacion' class='form-control'>");
      $("#dateFinEventoHomologacion").val(convertirFechaInput(eventoHomologacionObj.fechaFin));
	
      $("#tdevhohf"+eventoHomologacionId).html(
         "<input type='time' id='timeFinEventoHomologacion' class='form-control'>");
      $("#timeFinEventoHomologacion").val(eventoHomologacionObj.horaFin);
      
      $("#tdevhoEstAct"+eventoHomologacionId).html("<label>*Automático.</label>");
      
      $("#tdevhotr"+eventoHomologacionId).html(
         "<input class='form-control' id='inputBuscarResponsableEventoHomologacion'>" +
	 "<div id='divSelResponsableEventoHomologacion'></div>" +
	 "<label>*Buscar trabajador por DNI y/o nombre " +
	        "(debe ingresar 3 caracteres como mínimo).</label>");
      $("#inputBuscarResponsableEventoHomologacion").val(eventoHomologacionObj.trabajador.nombre);

      if(eventoHomologacionObj.numPreguntas != 0){
         $("#tdevhopr"+eventoHomologacionId).html(
            "<a class='efectoLink' onclick='verPreguntasEventoHomologacion()'>" +
               "<i class='fa fa-list'></i> " +
                (eventoHomologacionObj.numPreguntasAprobadas+eventoHomologacionObj.numPreguntasAprobadasParcialmente) +
                 " / "+eventoHomologacionObj.numPreguntas +
            "</a>");
      }
      
      var selEvalEventoHomologacion = crearSelectOneMenuOblig("selEvalEventoHomologacion","",
	 listTipoNotaHomologacionContratista,eventoHomologacionObj.evaluacion.id,"id","nombre");
      $("#tdevhoEvaTotal"+eventoHomologacionObj.id).html(selEvalEventoHomologacion);
      
      $("#tdevhofecAct"+eventoHomologacionId).html("<label>*Automático.</label>");
      
      buscarContratistaEventoHomologacion();buscarResponsableEventoHomologacion();

      var options={
    	 container:"#tdevhoevi"+eventoHomologacionId,
    	 functionCall:function(){},
    	 descargaUrl:"/contratista/evento_homologacion/evidencia?id="+eventoHomologacionId,
    	 esNuevo:(eventoHomologacionObj.evidenciaNombre.length == 0?true:false),
    	 idAux:"EventoHomologacion",
         evidenciaNombre:eventoHomologacionObj.evidenciaNombre,mensajeAux:"*Opcional"
      };

      crearFormEvidenciaCompleta(options); 
	
      banderaEdicionEv = true;
	
      $("#btnCancelarEventoHomologacion").show();$("#btnNuevoEventoHomologacion").hide();
      $("#btnEliminarEventoHomologacion").show();$("#btnGuardarEventoHomologacion").show();
      $("#btnGraficoEventoHomologacion").hide();
   }
}

function nuevoEventoHomologacion(){
   if(!banderaEdicionEv){
      formatoCeldaSombreableTabla(false,"tblEventoHomologacion");
      eventoHomologacionId = 0;

      var selListaEventoHomologacion = crearSelectOneMenuOblig("selListaEventoHomologacion",
    	 "verAcordeVigenciaListaEventoHomologacion()",listListaHomologacionContratista,"","id","nombre");
		
      $("#tblEventoHomologacion tbody").prepend(
         "<tr>" +
	    "<td><input class='form-control' id='inputBuscarContratistaEventoHomologacion'>" +
	        "<div id='divSelContratistaEventoHomologacion'></div>" +
	        "<label>*Buscar contratista por RUC y/o nombre " +
	               "(debe ingresar 3 caracteres como mínimo).</label></td>" +
            "<td><input type='date' id='dateInicioEventoHomologacion' class='form-control'></td>" +
            "<td><input type='time' id='timeInicioEventoHomologacion' class='form-control'></td>" +
            "<td><input type='date' id='dateFinEventoHomologacion' class='form-control'></td>" +
            "<td><input type='time' id='timeFinEventoHomologacion' class='form-control'></td>" +
            "<td><label>*Automático.</label></td>" +
	    "<td>"+selListaEventoHomologacion+"</td>" +
	    "<td id='tdvigevho0'></td>" +
	    "<td><input class='form-control' id='inputBuscarResponsableEventoHomologacion'>" +
	        "<div id='divSelResponsableEventoHomologacion'></div>" +
	        "<label>*Buscar trabajador por DNI y/o nombre " +
	               "(debe ingresar 3 caracteres como mínimo).</label></td>" +
	    "<td><label>...</label></td>" +
	    "<td><label>...</label></td>" +
	    "<td id='tdevhoevi0'></td>" +
	    "<td><label>*Automático.</label></td>" +
	    "<td><label>...</label></td>" +
         "</tr>");
		
      verAcordeVigenciaListaEventoHomologacion();
      buscarContratistaEventoHomologacion();buscarResponsableEventoHomologacion();
		
      var options={
    	 container:"#tdevhoevi"+eventoHomologacionId,
    	 functionCall:function(){},descargaUrl:"",
    	 esNuevo:true,idAux:"EventoHomologacion",
    	 evidenciaNombre:"",mensajeAux:"*Opcional"
      };
		
      crearFormEvidenciaCompleta(options); 
		
      $("#btnCancelarEventoHomologacion").show();$("#btnNuevoEventoHomologacion").hide();
      $("#btnEliminarEventoHomologacion").hide();$("#btnGuardarEventoHomologacion").show();
		
      banderaEdicionEv = true;
   }else{
      alert("Guarde primero.");
   }
}

function verAcordeVigenciaListaEventoHomologacion(){
   var vigenciaId = parseInt($("#selListaEventoHomologacion").val());
	
   listListaHomologacionContratista.forEach(function(val){
      if(val.id == vigenciaId){
         $("#tdvigevho"+eventoHomologacionId).html(val.tipoVigencia.nombre);
      }
   });
}

var listContratistaBuscadorAux=[];

function buscarContratistaEventoHomologacion(){
   var nombre = $("#inputBuscarContratistaEventoHomologacion").val().trim();
	
   if(nombre.length >= 3){
      var dataParam={
         nombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid")),
         isBuscador: 1
      };
    		
      callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
	 listContratistaBuscadorAux = [];
	 listContratistaBuscadorAux = data.contratistas;
           
         if(listContratistaBuscadorAux.length == 0){
            listContratistaBuscadorAux.push({id: -1,nombre:"Sin asignar"});
         }
    			
         var selContratistaEventoHomologacion = crearSelectOneMenuOblig("selContratistaEventoHomologacion",
   	    "",listContratistaBuscadorAux,"","id","nombre");
       		       
         $("#divSelContratistaEventoHomologacion").html(selContratistaEventoHomologacion);
         $("#inputBuscarContratistaEventoHomologacion").attr("onkeyup","buscarContratistaEventoHomologacion()");
      });
   }else{
      listContratistaBuscadorAux = [];
          
      listContratistaBuscadorAux.push({id: -1,nombre:"Sin asignar"});
           
      var selContratistaEventoHomologacion = crearSelectOneMenuOblig("selContratistaEventoHomologacion",
	 "",listContratistaBuscadorAux,"","id","nombre");
    		       
      $("#divSelContratistaEventoHomologacion").html(selContratistaEventoHomologacion);
      $("#inputBuscarContratistaEventoHomologacion").attr("onkeyup","buscarContratistaEventoHomologacion()");
   }    
}

var listResponsableBuscadorAux=[];

function buscarResponsableEventoHomologacion(){
   var nombre = $("#inputBuscarResponsableEventoHomologacion").val().trim();
	
   if(nombre.length >= 3){
      var dataParam={
	 trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid")),
         isBuscador: 1
      };
    		
      callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
	 listResponsableBuscadorAux = [];
	 listResponsableBuscadorAux = data.trabajadores;
           
         if(listResponsableBuscadorAux.length == 0){
            listResponsableBuscadorAux.push({
               trabajadorId: -1,nombre:"Sin asignar"
            });
         }
    			
         var selResponsableEventoHomologacion = crearSelectOneMenuOblig("selResponsableEventoHomologacion",
   	    "",listResponsableBuscadorAux,"","trabajadorId","nombre");
       		       
         $("#divSelResponsableEventoHomologacion").html(selResponsableEventoHomologacion);
         $("#inputBuscarResponsableEventoHomologacion").attr("onkeyup","buscarResponsableEventoHomologacion()");
      });
   }else{
      listResponsableBuscadorAux = [];
          
      listResponsableBuscadorAux.push({
         trabajadorId: -1,nombre:"Sin asignar"
      });
           
      var selResponsableEventoHomologacion = crearSelectOneMenuOblig("selResponsableEventoHomologacion",
	 "",listResponsableBuscadorAux,"","trabajadorId","nombre");
    		       
      $("#divSelResponsableEventoHomologacion").html(selResponsableEventoHomologacion);
      $("#inputBuscarResponsableEventoHomologacion").attr("onkeyup","buscarResponsableEventoHomologacion()");
   }    
}

function cancelarEventoHomologacion(){
   cargarEventosHomologacionContratista();
}

function eliminarEventoHomologacion(){
   mensajeUx="<label>¿Está seguro de eliminar la homologación seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","EventoHom");

   $("#btnDevolverValorEventoHom").on("click",function(){
      var dataParam={
         id: eventoHomologacionId,
      };
		
      callAjaxPost(URL+'/contratista/evento_homologacion/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx = "<label>La homologación fue eliminada con éxito.</label>"; 
  	       mensajesUx(mensajeUx,1,"","ActualizarEventoHom");
               
  	       $("#modalMensajeUxActualizarEventoHom").on("hidden.bs.modal",function(){
  	          cargarEventosHomologacionContratista();   
  	       });
  	       
	       break;
					
            default:
	       alert("Ocurrió un error al eliminar la plantilla!");
         }
      });
   });
}

function guardarEventoHomologacion(){
   var campoVacio = true;
   
   var contratistaId = parseInt($("#selContratistaEventoHomologacion").val());

   var fechaInicioTexto = $("#dateInicioEventoHomologacion").val();
   var fechaInicio = convertirFechaTexto(fechaInicioTexto);
   var inputFechaInicio = (!fechaInicio?null:fechaInicio);
   var horaInicio = $("#timeInicioEventoHomologacion").val();
   
   var fechaFinTexto = $("#dateFinEventoHomologacion").val();
   var fechaFin = convertirFechaTexto(fechaFinTexto);
   var inputFechaFin = (!fechaFin?null:fechaFin);
   var horaFin = $("#timeFinEventoHomologacion").val();
     
   var listaId = $("#selListaEventoHomologacion").val(); 
   var trabajadorId = parseInt($("#selResponsableEventoHomologacion").val());
   var evaluacionId = (eventoHomologacionId == 0?3:parseInt($("#selEvalEventoHomologacion").val()));

   if(contratistaId == -1 || inputFechaInicio == null || inputFechaFin == null || horaInicio == "" || 
      horaFin == "" || trabajadorId == -1){
      mensajeUx = "<label>Debe ingresar la información en todos los campos activos.</label>"; 
      campoVacio = false;
   }else if(restaDatetimes(fechaInicioTexto,horaInicio,fechaFinTexto,horaFin) <= 0){
      mensajeUx = "<label>La 'fecha y hora fin' de la homologación es menor o igual que la 'fecha y " +
      		  "hora inicio'. Debe modificar alguno de los campos mencionados.</label>"; 
      campoVacio = false; 
   }

   if(campoVacio){
      var dataParam = {
    	 id: eventoHomologacionId,contratistaId: contratistaId,fechaInicio: fechaInicio,
    	 fechaFin: fechaFin,horaInicio: horaInicio,horaFin: horaFin,lista: {id: listaId},
    	 evaluacion:{id: evaluacionId},trabajadorId: trabajadorId,
    	 empresaId: parseInt(getSession("gestopcompanyid"))
      };
        
      callAjaxPost(URL+'/contratista/evento_homologacion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
    	    case "05":
    	       guardarEvidenciaAuto(data.nuevoId,"fileEviEventoHomologacion",bitsEvidenciaHomologacion,
    	       "/contratista/evento_homologacion/evidencia/save",function(){ 			
    	          mensajeUx = "<label>La homologación fue registrada con éxito.</label>"; 
    	          mensajesUx(mensajeUx,1,"","ActualizarEventoHom");
		    
    	          $("#modalMensajeUxActualizarEventoHom").on("hidden.bs.modal",function(){
   	             cargarEventosHomologacionContratista();
    	          });
    	       });
    		 
    	       break;
    			
    	    default:
    	       console.log("Ocurrió un error al guardar la homologacion!");
         }
      });	
   }else{
      mensajesUx(mensajeUx,2,"");
   }
} 

var listPreguntasHomologacionContratistaEval= [],listTipoCumplimientoHomConEva= [];

function verPreguntasEventoHomologacion(){
   $("#tabHomologaciones").find(".container-fluid").hide();
   $("#tabHomologaciones").find("#divPreguntasEventosHomologacion").show();
   
   $("#tabHomologaciones").find("h2").html(
      "<label><a onclick='verHomologacionContratistaPrincipal();'>Homologación</a> " +
      "> Evaluación de las preguntas</label>"); 
  
   if(eventoHomologacionObj.numPreguntasRespondidas == 0){
      $("#btnEvaluarPreguntasEventoHomologacion").hide();   
   }else{
      $("#btnEvaluarPreguntasEventoHomologacion").show(); 
   }
   
   var sizePantalla = (eventoHomologacionObj.numPreguntasRespondidas == 0?130:170);
    
   resizeDivWrapper("wrapPregEventoHomologacion",sizePantalla);
	
   var dataParam={
      id: eventoHomologacionId
   };
   
   callAjaxPost(URL+"/contratista/evento_homologacion/pregunta",dataParam,function(data){
      listPreguntasHomologacionContratistaEval = data.list;
      listTipoCumplimientoHomConEva = data.tipoEvaluaciones;
      
      $("#tblPregEventoHomologacion tbody tr").remove();
		
      listPreguntasHomologacionContratistaEval.forEach(function(val,index){
         var selCumplPreguntaEventoHomologacion = crearSelectOneMenuOblig("selCumplPreguntaEventoHomologacion"+val.id,
            "verIconoAcuerdoEvalPregEventoHomologacion(this)",listTipoCumplimientoHomConEva,val.tipoCumplimiento.id,"id","nombre");
         
         var respuestaSimple = (val.respuesta.id == -1?"<label>*Pendiente</label>":val.respuesta.nombre);
         
         var comentarioContratista = (val.respuesta.id == -1?"":
            (val.comentarioContratista.length == 0?"":"<br><br><label style='text-align:left;'>*Comentario:</label> "+val.comentarioContratista));
         
         var evidenciaNombre = (val.respuesta.id == -1?"------":
            (val.evidenciaNombre.length != 0?
	     "<a class='efectoLink' target='_blank' " +
	        "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_simple?id="+val.id+"'>"+
	         val.evidenciaNombre +
	     "</a>":
	     (val.evidenciaANombre.length == 0 && val.evidenciaBNombre.length == 0 && val.evidenciaCNombre.length == 0 && 
	      val.evidenciaDNombre.length == 0 && val.evidenciaENombre.length == 0?"------":
	      (val.evidenciaANombre.length != 0?
	       "<a class='efectoLink' target='_blank' " +
	     	  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_a?id="+val.id+"'>" +
	     	   val.evidenciaANombre +
	       "</a>":"") +
	      (val.evidenciaBNombre.length != 0?(val.evidenciaANombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
	     	  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_b?id="+val.id+"'>" +
	     	   val.evidenciaBNombre +
	       "</a>":"") +
	      (val.evidenciaCNombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_c?id="+val.id+"'>" +
		   val.evidenciaCNombre +
	       "</a>":"") +
	      (val.evidenciaDNombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
		val.evidenciaCNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_d?id="+val.id+"'>" +
		   val.evidenciaDNombre +
	       "</a>":"") +
	      (val.evidenciaENombre.length != 0?
	       (val.evidenciaANombre.length != 0 || val.evidenciaBNombre.length != 0 ||
		val.evidenciaCNombre.length != 0 || val.evidenciaDNombre.length != 0?"<br><br>":"") +
	       "<a class='efectoLink' target='_blank' " +
		  "href='"+URL+"/contratista/evento_homologacion/respuesta/evidencia_multi_e?id="+val.id+"'>" +
		   val.evidenciaENombre +
	       "</a>":""))));
         var fechaRespuestaTexto = (val.respuesta.id == -1?"------":val.fechaRespuestaTexto);
         
         var comentarioEvaluacion = (val.respuesta.id == -1?"------":
            "<textarea id='textAreaComentarioPreguntaEventoHomologacion"+val.id+"' class='form-control' rows='3'></textarea>");
         var fechaEvaluacionTexto = (val.respuesta.id == -1?"------":val.fechaEvaluacionTexto+
            (val.usuarioEvaluacion.nombre.length != 0?"<br>(Por "+val.usuarioEvaluacion.nombre+")":""));

         $("#tblPregEventoHomologacion tbody").append(
	    "<tr>" +
	       "<td>"+val.pregunta.nombre+"</td>" +
	       "<td style='word-break: break-all;'>" +
	           respuestaSimple +
	           comentarioContratista+"</td>" +
	       "<td>"+evidenciaNombre+"</td>" +
	       "<td>"+fechaRespuestaTexto+"</td>" +
	       "<td>"+(val.respuesta.id == -1?"<label>*Falta la respuesta del contratista.</label>":
		       "<label>"+val.tipoCumplimiento.icono+"</label>" +
		        selCumplPreguntaEventoHomologacion)+"</td>" +
	       "<td>"+comentarioEvaluacion+"</td>" +
	       "<td>"+fechaEvaluacionTexto+"</td>" +
	    "</tr>"); 
 
         $("#textAreaComentarioPreguntaEventoHomologacion"+val.id).val(val.comentario);
      });
		
      goheadfixedY("#tblPregEventoHomologacion","#wrapPregEventoHomologacion");
   });
}

function verIconoAcuerdoEvalPregEventoHomologacion(obj){
   var notaId = parseInt($(obj).val());
 	
   listTipoCumplimientoHomConEva.every(function(val){
      if(val.id == notaId){
         $(obj).parent().find("label").html(val.icono);
         return false;
      }
       
      return true;
   });
}

var indiceActualEvalPregListHomCon;

function prepararGuardarEvaluacionesPreguntaEventoHomologacion(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   indiceActualEvalPregListHomCon = 0;
   guardarEvaluacionesPreguntaEventoHomologacion(guardarEvaluacionesPreguntaEventoHomologacion); 
}

function guardarEvaluacionesPreguntaEventoHomologacion(functionCallBack){
   var cumplimientoId,comentario,actualizarEvaluacion = 0,dataParam;
   
   listPreguntasHomologacionContratistaEval.forEach(function(val,index){
      var comentarioAux = $("#textAreaComentarioPreguntaEventoHomologacion"+val.id).val();
      var cumplimientoIdAux = parseInt($("#selCumplPreguntaEventoHomologacion"+val.id).val());
	  
      if((index + 1) == indiceActualEvalPregListHomCon && (val.comentario != comentarioAux || 
	 val.tipoCumplimiento.id != cumplimientoIdAux)){
	 actualizarEvaluacion = 1;
	  
	 dataParam={
	    id: val.id,
	    comentario: comentarioAux,
	    tipoCumplimiento: {id: cumplimientoIdAux}
	 };
      }
   }); 
   
   if(actualizarEvaluacion == 1){
      callAjaxPostNoUnlockAux(URL+'/contratista/evento_homologacion/respuesta/evaluacion/save',dataParam,function(data){
	 if(indiceActualEvalPregListHomCon == listPreguntasHomologacionContratistaEval.length){
	    $.unblockUI();
	    mensajeUx = "<label>La evaluación fue registrada con éxito.</label>";
	    mensajesUx(mensajeUx,1,"","ActPrincipalListaHom");
							
	    $("#modalMensajeUxActPrincipalListaHom").on("hidden.bs.modal",function(){
	       cargarEventosHomologacionContratista();
	    });
	 }else{
	    indiceActualEvalPregListHomCon++;
	    functionCallBack(guardarEvaluacionesPreguntaEventoHomologacion);
	 }        	   
      });
   }else{
      if(indiceActualEvalPregListHomCon == listPreguntasHomologacionContratistaEval.length){
         $.unblockUI();
	 mensajeUx = "<label>La evaluación fue registrada con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActPrincipalListaHom");
						
	 $("#modalMensajeUxActPrincipalListaHom").on("hidden.bs.modal",function(){
	    cargarEventosHomologacionContratista();
	 });
      }else{
         indiceActualEvalPregListHomCon++;
         functionCallBack(guardarEvaluacionesPreguntaEventoHomologacion);
      }      
   }
}
