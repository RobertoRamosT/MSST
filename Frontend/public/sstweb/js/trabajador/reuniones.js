var reunionId;var reunionObj;
var fechaEntrega;
var banderaEdicion3;
var listTrabajadoresReunion;
var listTrabsReuSeleccionados;
var listEquipos;
var listTiposReunion;
var listEstados;
var listaFullReuniones;
var reunion;
var reunionNombre;
var numPaginaActual;
var numPaginaTotal;
var mensajeUx;
var listTrabajadoresResponsablesReunion=[];

$(function(){
   $("#btnClipTablaReunion").on("click",function(){
      var listFullTablaProgramacion=""; 
      listFullTablaProgramacion = obtenerDatosTablaEstandarNoFija("tblReu");
      copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaReunion");
		
      alert("Se han guardado al clipboard la tabla Reuniones.");
   });
		
   $("#btnGuardarListTrabs").on("click",function(){
      cancelarListTrabs();
      guardarReunionSeguridad();
   });
	
   resizeDivWrapper("wrapperReunion",400);
});

function programarReunion(){
   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title")
   .html("<a onclick='volverGruposTrabajo()'>Grupo</a> > Reuniones");
   $("#modalReunion").show(); 
	
   cargarModalReunionSeguridad();
}

function cambiarPaginaTablaReunion(){
   //Definiendo variables
   var list = listaFullReuniones;
   var totalSize = list.length;
	
   var partialSize = 10;
   numPaginaTotal = Math.ceil(totalSize/partialSize);
   var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
   var finRegistro = (numPaginaActual*partialSize)-1;
	
   //Aplicando lógica de compaginacion
	
   $('.izquierda_flecha').show();
   $('.derecha_flecha').show();
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechas").html(numPaginaActual+" de "+numPaginaTotal);
	
   if(numPaginaActual == 1){
      $('.izquierda_flecha').hide();
   }
	
   if(numPaginaActual == numPaginaTotal){
      $('.derecha_flecha').hide();
   }
	 
   if(finRegistro > totalSize){
      finRegistro = totalSize-1;
   }
	
   $("#tblReu tbody tr").remove();
   $("#tblReu tbody tr").css("font-size","11px");
   $("#tblReu thead tr").css("font-size","11px");
}

function cancelarListTrabs(){
   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title")
   .html("<a onclick='volverGruposTrabajo()'>Grupo</a> > Reuniones");
   $("#modalReunion").show(); 
}

function cargarModalReunionSeguridad(){	
   $("#btnAgregarReu").attr("onclick","javascript:nuevaReunionSeguridad();");
   $("#btnCancelarReu").attr("onclick","javascript:cancelarReunionSeguridad();");
   $("#btnGuardarReu").attr("onclick","javascript:guardarReunionSeguridad();");
   $("#btnEliminarReu").attr("onclick","javascript:eliminarReunionSeguridad();");
   $("#btnGenReporte").attr("onclick","javascript:generarHojaRuta();");
	
   $("#btnCancelarReu").hide();
   $("#btnAgregarReu").show();
   $("#btnEliminarReu").hide();
   $("#btnGuardarReu").hide();
   $("#btnGenReporte").hide();
   $("#btnConsolidadoAcuTotalGruTrabReu").show();
	
   $("#mdReuniones .modal-body").hide();
   $("#modalReunion").show();
	
   reunionId = 0;
   reunionObj={};
   numPaginaActual = 1;
   listTrabsReuSeleccionados = null;
   banderaEdicion3 = false;
   listaFullReuniones=[];
	
   var dataParam={
	  grupoSeguridadId: grupoSeguridadId
	         };

   callAjaxPost(URL+'/trabajador/reuniones',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listTiposReunion = data.listTiposReunion;
	    var list = data.list;
	    listaFullReuniones = data.list;
	    listTrabajadoresResponsablesReunion = data.trabajadores;
	    
	    $("#tblReu tbody tr").remove();
			
	    list.forEach(function(val,index){
	       $("#tblReu tbody")
	       .append("<tr id='tr"+val.id+"' onclick='javascript:editarReunionSeguridad("+index+")'>" +
		          "<td id='tdtiporeu"+val.id+"'>"+val.tipo.nombre+"</td>" +
			  "<td id='trtrareu"+val.id+"'>"+val.trabajadorResponsable.nombre+"</td>" +	
			  "<td id='tdfechapla"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
			  "<td id='tdhorapla"+val.id+"'>"+val.horaPlanificadaTexto+"</td>" +
			  "<td id='tdnumage"+val.id+"'>"+val.numAgenda+"</td>" +
			  "<td id='tdfechareal"+val.id+"'> "+val.fechaRealizadaTexto+"</td>" +
			  "<td id='tdnumdes"+val.id+"'>"+val.numDesarrollo+"</td>" +
			  "<td id='tdtrabreua"+ val.id+"'>"+val.numTrabajadoresAsociados+"</td>" +
			  "<td id='tdacus"+val.id+"'>"+val.numAcuerdosAsociados+"</td>" +
			  "<td id='tdobsreu"+val.id+"'>"+val.observacion+"</td>" +
			  "<td id='tdevireu"+val.id+"'>"+val.evidenciaNombre+"</td>" +
		          "<td id='tdestadoreu" + val.id+"'>"+val.estado.estadoCumplientoNombre+"</td>" +
		       "</tr>");	
	    });
			 
	    formatoCeldaSombreableTabla(true,"tblReu");

	    if(getSession("linkCalendarioReunionId")!=null){		
	       listaFullReuniones.every(function(val,index3){
	          if(val.id == parseInt(getSession("linkCalendarioReunionId"))){
		     editarReunionSeguridad(index3);
						
		     if(getSession("linkCalendarioAcuerdoId")!=null){
		        cargarAcuerdosReunion();
		     }
						
		     getSession("linkCalendarioReunionId");
		     return false;
	          }else{
		     return true;
	          }
	       });
	    }
	    break;
	    
         default:
	    alert("Ocurrió un error al traer las reuniones!");
      }
   });
}

function editarReunionSeguridad(pindex){
   if(!banderaEdicion3){
      listTrabajadoresReunion = [];
      listTrabsReuSeleccionados = [];
      reunionObj = listaFullReuniones[pindex];
      reunionId = reunionObj.id;
		
      var fechaPlanificada = reunionObj.fechaPlanificada;
      var fechaRealizada = reunionObj.fechaRealizada;
      var numTrabajadores = reunionObj.numTrabajadoresAsociados;
      var numAcuerdos = reunionObj.numAcuerdosAsociados;
      var tipoId = reunionObj.tipo.id;
      var observaciones = reunionObj.observacion;
      var horaPlanificada = reunionObj.horaPlanificada;
      var textAgenda = $("#tdnumage"+reunionId).text();
      var textDesarrollo = $("#tdnumdes"+reunionId).text();
		
      formatoCeldaSombreableTabla(false,"tblReu");
      $("#tr"+reunionId).addClass("fila-edicion");
      //
      listTrabajadoresResponsablesReunion.forEach(function(val){
         if(val.trabajadorId == reunionObj.trabajadorResponsable.trabajadorId){
	    val.selected = 1;
         }else{
	    val.selected = 0;
         }
      });
		
      crearSelectOneMenuObligUnitarioCompleto("selRespTrabReunion","",listTrabajadoresResponsablesReunion,
	 "trabajadorId","nombre","#trtrareu"+reunionId,"Seleccionar Responsable");
      //
      var selMotivo = crearSelectOneMenu("selTipoReu","",listTiposReunion,tipoId,
	     "id","nombre");
		
      $("#tdtiporeu"+reunionId).html(selMotivo);
		
      $("#tdobsreu"+reunionId)
      .html("<input type='text' id='inputObsReu' class='form-control'>");
		
      $("#tdtrabreua"+reunionId)
      .html("<a id='linkTrabEntr' href='#' onclick='javascript:cargarTrabajadoresReunion();'>"+
	       $("#tdtrabreua"+reunionId).text()+
	    "</a>");
      
      $("#tdacus"+reunionId)
      .html("<a id='linkAcus' href='#' onclick='javascript:cargarAcuerdosReunion();'>"+
	        $("#tdacus"+reunionId).text()+
	    "</a>");

      $("#tdfechapla"+reunionId)
      .html("<input type='date' id='inputPlan' class='form-control' onchange='hallarEstadoReunion("+reunionId+")'>");
		
      $("#tdfechareal"+reunionId)
      .html("<input type='date' id='inputReal' class='form-control' onchange='hallarEstadoReunion("+reunionId+")'>");
		
      $("#tdhorapla"+reunionId)
      .html("<input type='time' id='inputHoraPla' class='form-control'>");
		
      $("#tdnumage"+reunionId).addClass("linkGosst")
      .on("click",function(){verAgendaReunion();})
      .html(textAgenda);
		
      $("#tdnumdes"+reunionId).addClass("linkGosst")
      .on("click",function(){verDesarrolloReunion();})
      .html(textDesarrollo);
		
      $("#inputObsReu").val(observaciones);
      $("#inputPlan").val(convertirFechaInput(fechaPlanificada));
      $("#inputReal").val(convertirFechaInput(fechaRealizada));
      $("#inputHoraPla").val(horaPlanificada);
		
      var nombreEvidencia = $("#tdevireu"+reunionId).text(); 
		
      var options={
	     container: "#tdevireu"+reunionId,
	     functionCall: function(){},
	     descargaUrl: "/trabajador/reunion/evidencia?reunionId="+reunionId,
	     esNuevo: false,
	     idAux: "Reunion",
	     evidenciaNombre: nombreEvidencia
		  }
      
      crearFormEvidenciaCompleta(options);
		
      banderaEdicion3 = true;
      
      $("#btnCancelarReu").show();
      $("#btnAgregarReu").hide();
      $("#btnEliminarReu").show();
      $("#btnGuardarReu").show();
      $("#btnGenReporte").show();
      $("#btnConsolidadoAcuTotalGruTrabReu").hide();
      
      cargarTrabajadoresReunion(1);
      hallarEstadoReunion(reunionId);
      $("#modalReunion").show();
      $("#modalTrabsReu").hide();
   }
}

function cargarTrabajadoresReunion(accionId) {
   if(accionId == null){
      $("#mdProgFecha .modal-body").hide();
      $("#mdProgFecha .modal-title")
      .html("<a onclick='volverGruposTrabajo()'>Grupo</a> > " +
      	    "<a onclick='volverReunionesGrupo()'>Reunión </a> > Participantes");	
      $("#modalTrabsReu").show(); 
      $("#importTrabReunion").hide();
		
      $("#importTrabReunion").keyup(function(){
         var texto = $(this).val();
         var listExcel = texto.split('\n');
         var validado = "";
         var listTrabs=[];
			
         listTrabajadoresReunion.forEach(function(val,index){
	    $("#list-trab"+val.trabajadorId).prop("checked",false);
         });
			
         for(var int=0;int<listExcel.length;int++){
	    var trab={};
	    var filaTexto = listExcel[int];
				
	    filaTexto = filaTexto.toUpperCase();
			
	    listTrabajadoresReunion.forEach(function(val,index){
	       var trabNombre = val.nombre;
	       trabNombre = trabNombre.trim().toUpperCase();
					
	       if(trabNombre.indexOf(filaTexto) != -1 && filaTexto.length > 0){
		  $("#list-trab"+val.trabajadorId).prop("checked",true);
	       }
	    });
         };
      });
		
      $("#btnShowImport").on("click",function(){
         $("#importTrabReunion").toggle();
      });
   }
	
   if(listTrabsReuSeleccionados.length === 0){
      $("#list-trabs").html("");
		
      var dataParam={
	     id: reunionId
		    };

      callAjaxPost(URL+'/trabajador/reunion/trabajadores',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       listTrabajadoresReunion = data.list;
						
	       for(index=0;index<listTrabajadoresReunion.length;index++){
	          if(listTrabajadoresReunion[index].participaReunion == 1){
		     $("#list-trabs")
		     .append("<li class='list-group-item'>" +
			        "<input type='checkbox' class='check' id='list-trab" +
					listTrabajadoresReunion[index].trabajadorId+"' checked>" +
			         listTrabajadoresReunion[index].nombre + 
			     "</li>");
								
		     listTrabsReuSeleccionados
		     .push({trabajadorId:listTrabajadoresReunion[index].id});
	          }else{
		     $("#list-trabs")
		     .append("<li class='list-group-item'>" +
			        "<input type='checkbox' class='check' id='list-trab" +
				        listTrabajadoresReunion[index].trabajadorId+"'>" +
			         listTrabajadoresReunion[index].nombre +
			     "</li>");
	          }
	       }
						
	       $("#list-trabs")
	       .prepend("<li class='list-group-item'>" +
		           "<input type='checkbox' class='' id='list-trab-all'>" +
			   "<strong>Todos</strong>" + 
			"</li>");
						
	       $("#list-trab-all").on("click",function(){
	          var marcado = $(this).prop("checked");
	          $("#list-trabs .check").prop("checked",marcado);
	       });
	       
	       break;
					
	    default:
	       alert("Ocurrió un error al cargar los trabs de reuniones!");
         }
      });
   }	
}

function nuevaReunionSeguridad() {
   if(!banderaEdicion3){
      var selMotivo = crearSelectOneMenu("selTipoReu","",listTiposReunion,
	     "","id","nombre");
		
      $("#tblReu tbody")
      .append("<tr id='0'>" +
	         "<td>"+selMotivo+"</td>" +
	         "<td id='trtrareu0'>...</td>" +
	         "<td><input type='date' id='inputPlan' class='form-control' onchange='hallarEstadoReunion(0)'></td>" +
	         "<td><input type='time' value='12:00:00' id='inputHoraPla' class='form-control'></td>" +
	         "<td>...</td>" +
	         "<td><input type='date' id='inputReal' class='form-control' onchange='hallarEstadoReunion(0)'></td>" +
	         "<td>...</td>" +
	         "<td>...</td>" + 
	         "<td>...</td>" +
	         "<td><input type='text' id='inputObsReu' class='form-control' ></td>" +
	         "<td id='inputEviReu'>...</td>" +
	         "<td id='tdestadoreu0'>...</td>" +
	      "</tr>");
		
      var options={
	     container: "#inputEviReu",
	     functionCall: function(){},
	     descargaUrl: "",
	     esNuevo: true,
	     idAux: "Reunion",
	     evidenciaNombre: "" 
		  }
		
      crearFormEvidenciaCompleta(options);
		
      reunionId = 0;
      
      crearSelectOneMenuObligUnitarioCompleto("selRespTrabReunion","",listTrabajadoresResponsablesReunion,
	 "trabajadorId","nombre","#trtrareu"+reunionId,"Seleccionar Responsable");
		
      $("#btnCancelarReu").show();
      $("#btnAgregarReu").hide();
      $("#btnEliminarReu").hide();
      $("#btnGuardarReu").show();
      $("#btnConsolidadoAcuTotalGruTrabReu").hide();
	
      formatoCeldaSombreableTabla(false,"tblReu");
      banderaEdicion3 = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarReunionSeguridad(){
   cargarModalReunionSeguridad();
}

function eliminarReunionSeguridad() {
   var r = confirm("¿Está seguro de eliminar la reunión?");
	
   if(r == true){
      var dataParam={
	     id: reunionId,
		    };

      callAjaxPost(URL+'/trabajador/reunion/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       cargarModalReunionSeguridad();
	       break;
					
	    default:
	       alert("Antes de eliminar el registro, verificar que no tenga registrado temas de agenda, " +
	       	        "desarrollo de la reunión, participantes y acuerdos");
         }
      });
   }
}

function guardarReunionSeguridad(){
   $("#modalReunion button:not(#btnClipTablaReunion)").hide();
	
   var campoVacio = true;
   var tipoId = $("#selTipoReu").val();
   var inputObsReu=$("#inputObsReu").val();
   var inputPlan = convertirFechaTexto($("#inputPlan").val());
   var inputReal = convertirFechaTexto($("#inputReal").val());
   var horaPlan = $("#inputHoraPla").val();

   if(!$("#inputHoraPla").val()){	
      horaPlan = null;
   }

   if(!$("#inputReal").val()){
      inputReal = null;
   }

   if(tipoId == "-1" || inputPlan == null){
      campoVacio = false;
   }

   var listTrabsSelec=[];

   $("#list-trabs .check").each(function(){
      if($(this).is(':checked')){
         var id = $(this).attr('id');
         listTrabsSelec.push({trabajadorId:id.substring(9,id.length)});
      }
   });
    
   var trabId = $("#selRespTrabReunion").val();
	
   if(campoVacio){
      var dataParam={
	     fechaPlanificada: inputPlan,
	     trabajadorResponsable: {trabajadorId: trabId},
	     fechaRealizada: inputReal,
	     horaPlanificada: horaPlan,
	     observacion: inputObsReu,
	     id: reunionId,
	     grupoSeguridadId: grupoSeguridadId,
	     trabs: listTrabsSelec,
	     estado: {estadoCumpId: reunion},
	     tipo: {id: parseInt(tipoId)}
	            };
	
      callAjaxPost(URL+'/trabajador/reunion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       guardarEvidenciaAuto(data.nuevoId,"fileEviReunion",bitsEvidenciaReunion,
	          "/trabajador/reunion/evidencia/save",cargarModalReunionSeguridad,"reunionId") 
	       break;
					
	    default:
	       alert("Ocurrió un error al guardar la reunion!");
         }
      });
   }else{
      alert("Debe ingresar la fecha planificada y el tipo de reunión");
   }
}

function subirEvidencia(idObjeto,tipoId){
   $('#mdUpload').modal('show');
	
   switch(tipoId){
      case 1:
         $('#btnUploadArchivo')
         .attr("onclick","javascript:procesarEvidencia("+idObjeto+","+tipoId+");");
         break;
	
      case 2:
         $('#btnUploadArchivo')
         .attr("onclick","javascript:procesarEvidenciaAcuerdo("+idObjeto+","+tipoId+");");
         break;
   }
}

function procesarEvidencia(progEquipoId,tipoId){
   $.blockUI({
      message: 'cargando...'
   });
	
   guardarEvidenciaAuto(progEquipoId,"fileEvi",bitsEvidenciaReunion,"/trabajador/reunion/evidencia/save",function(){
      var inputFileImage = document.getElementById("fileEvi");
      var file = inputFileImage.files[0];
		
      $("#tdevireu"+progEquipoId).html(file.name);
      $.unblockUI();
      $('#mdUpload').modal('hide');
   },"reunionId");	   
}

function hallarEstadoReunion(progId){
   var fechaPlanificada = $("#inputPlan").val();
   var fechaReal = $("#inputReal").val();
   var fechaHoy = getSession("fechaHoyOrdenInversoTexto");
   
   if(fechaReal != ''){
      reunion = 2;
      reunionNombre = "Completado";
   }else{
      if(fechaPlanificada != ""){
         var dif = restaFechas(fechaHoy,fechaPlanificada);
	 
         if(dif<0){
	    reunion = 3;
	    reunionNombre = "Retrasado";
         }else{
	    reunion = 1;
	    reunionNombre = "Por implementar";
         }
      }else{
         reunion = 1;
         reunionNombre = "Por implementar";
      }
   }
	
   $("#tdestadoreu"+progId).html(reunionNombre);	
}

function generarHojaRuta(){
   var ss = $("#inputReal").val(); 
	
   if(ss != ""){
      switch(parseInt($("#selTipo").val())){
         case 1:
            window.open(URL+"/trabajador/reunion/informe/completo?reunionId="+reunionId);	
            break;
         
         case 2:
	    window.open(URL+"/trabajador/reunion/informe/completo?reunionId="+reunionId);	
	    break;
	
         default:
	    window.open(URL+"/trabajador/reunion/informe/basico?reunionId="+reunionId);	
            break;
      }
   }else{
      $("#mdProgFecha").modal("hide");
      
      mensajeUx="<label>" +
      		   "No se puede generar un reporte de una reunión " +
      	           "<span style='color:red;font-weight:bolder;'>no completada.</span>" +
      	        "</label>";
      
      mensajesUx(mensajeUx,2,"","AvisoNoReporteHojaRutaReu");
      
      $("#modalMensajeUxAvisoNoReporteHojaRutaReu").on("hidden.bs.modal",function(){
         $("#mdProgFecha").modal("show");    
      });
   }
}

function verAgendaReunion(){
   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title").html("<a onclick='volverGruposTrabajo()'>Grupo</a> > <a onclick='volverReunionesGrupo()'>Reunión </a> > Agenda");
   $("#modalAgenda").show(); 
   llamarAgendasReunion();
}

function verDesarrolloReunion(){
   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title").html("<a onclick='volverGruposTrabajo()'>Grupo</a> > <a onclick='volverReunionesGrupo()'>Reunión </a> > Desarrollo");
   $("#modalDesarrollo").show(); 
   llamarDesarrollosReunion();
}

function volverReunionesGrupo(){
   $("#mdProgFecha .modal-body").hide();
   $("#modalReunion").show();
   $("#mdProgFecha .modal-title").html("<a onclick='volverGruposTrabajo()'>Grupo</a> > Reuniones");	
}

function volverGruposTrabajo(){
   $("#mdProgFecha .modal-body").hide();
   $("#modalGrupo").show();
   $("#mdProgFecha .modal-title").html("Grupos de Trabajadores");
}

function ocultarValoresPreviosConsolidadoAcuTotalGruTrabReu(){
   $("#modalValPrevConAcuTotalGruTrabReu").modal("hide");
   $("#mdProgFecha").modal("show");
}

function valoresPreviosConsolidadoAcuTotalGruTrabReu(){
   $("#mdProgFecha").modal("hide");
   $("#modalValPrevConAcuTotalGruTrabReu").remove();
    
   var hoy = getSession("fechaHoyOrdenInversoTexto");
       
   var contenido ="";
   	    
   var listContenido = [];
   	
   var listContenido=[
   	  {sugerencia:"",label:"Inicio - Fecha realizada",
   	   inputForm:"<input type='date' id='fechaInicioConsolidadoAcuTotalGruTrabReu' class='form-control'>"},
   	  {sugerencia:"",label:"Fin - Fecha realizada",
   	   inputForm:"<input type='date' id='fechaFinConsolidadoAcuTotalGruTrabReu' class='form-control'>"},
   	  {sugerencia:"",label:"",inputForm:""},
   	  {sugerencia:"",
   	   label:"<button class='btn btn-danger' type='button' " +
   	   		 "onclick='ocultarValoresPreviosConsolidadoAcuTotalGruTrabReu()'>" +
   	       	    "<i class='fa fa-times'></i> Cancelar" +
   	       	 "</button>",
   	   inputForm:"<button class='btn btn-success' style='float:right;' type='button' " +
   	   		     "onclick='descargarConsolidadoAcuTotalGruTrabReu()'>" +
   	                "<i class='fa fa-download'></i> Descargar" +
   	             "</button>"},
   	             ];
   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloGeneral(val);
   });
   	
   var modalOptions={
   	  id: "modalValPrevConAcuTotalGruTrabReu",
   	  nombre: "<i class='fa fa-filter'></i> Filtro - Consolidado Acuerdos - " +
   	             "Reuniones realizadas <br>",
   	  contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   	            };
   	
   crearModalPrincipalUsuario(modalOptions,function(){},false);
       
   $("#fechaInicioConsolidadoAcuTotalGruTrabReu").val(sumaFechaDias(-30,hoy));
   $("#fechaFinConsolidadoAcuTotalGruTrabReu").val(hoy);
      	
   $("#modalValPrevConAcuTotalGruTrabReu").modal("show");  
}

function descargarConsolidadoAcuTotalGruTrabReu(){
   var fechaInicioConsolidado = $("#fechaInicioConsolidadoAcuTotalGruTrabReu").val();
   var fechaFinConsolidado = $("#fechaFinConsolidadoAcuTotalGruTrabReu").val();
   var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
   var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
   
   window.open(URL+"/trabajador/reunion/excel/consolidado_acuerdos?" +
      "grupoSeguridadId="+grupoSeguridadId+"&fechaInicioConsolidado="+fechaInicioConsolidado+
      "&fechaFinConsolidado="+fechaFinConsolidado+"&fechaInicioConsolidadoNormal="+fechaInicioConText+
      "&fechaFinConsolidadoNormal="+fechaFinConText);   
    
   $("#modalValPrevConAcuTotalGruTrabReu").modal("hide");
   $("#mdProgFecha").modal("show");
}
