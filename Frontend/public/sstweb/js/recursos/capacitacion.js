var banderaEdicion;
var capacitacionId;
var capacitacionTipo;
var clasificacionId;
var listClasificacion;
var listCapacitacionTipo;
var listCategoriaCapacitacion;
var listTiposVigencia;
var contador2 = 0;

var trabajadorId;

var asigAux=[],asigAuxCorreo=[],asigAuxNombre=[];
var vigAux=[],vigAuxCorreo=[],vigAuxNombre=[];

var listFullFormaciones;

var listTrabajadoresCapacitacion=[];

var listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
    listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[];

var userAgent = isMobile.any();

var capacitacionObj;
var mensajeUx;

$(document).ready(function(){
   var dataParam={
      empresaId: getSession("gestopcompanyid")
   };
	
   callAjaxPost(URL+'/capacitacion/filtro',dataParam,function(data){
      var selUnidadAccidente = crearSelectOneMenu("selFiltroResponsableCapacitacion","",
         data.responsables,"","trabajadorId","nombre","Todos");
      
      if(data.numTrabajadores > 0){
	 selUnidadAccidente = crearSelectOneMenuOblig("selFiltroResponsableCapacitacion","",
            data.responsables,"","trabajadorId","nombre");
      }
		
      var contenido = "";
	
      var listContenido = [
         {sugerencia:"",label:"Responsable",inputForm:selUnidadAccidente},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroCapacitacion()'>" +
          	   "<i class='fa fa-times'></i> Cancelar" +
          	"</button>",
    	  inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
    	  		    "onclick='cargarPrimerEstado()'>" +
    	               "<i class='fa fa-filter'></i> Aplicar filtro" +
    	            "</button>"}
      ];
		
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
		
      var modalOptions={
	 id:"modalFiltroCap",nombre:"<i class='fa fa-filter'></i> Filtros",
	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
		
      crearModalPrincipalUsuario(modalOptions,function(){},false);
		
      insertMenu();cargarPrimerEstado();
   });
	
   resizeDivWrapper("wrapper",160); /* antes -> 200*/
   resizeDivWrapper("wrapperEval",200);
	
   $(document).on("click","#btnClipTabla",function(){	
      var fullDatosTabla = "";
				 
//      $(".fix-head #"+"tblCap"+" thead tr").each(function(index){   
//         $(this).children("th").each(function(index2){
//	    if(index2 < 7){
//	       fullDatosTabla = fullDatosTabla + $(this).text()+"\t";
//	    }
//         });
//			         
//         fullDatosTabla = fullDatosTabla+"\n";
//      });
	 
      for(index = 0;index < listFullFormaciones.length;index++){
         if(listFullFormaciones[index].capacitacionTipoId != 5){
//	    var lastListAprobadosReal = dividirLista(listFullFormaciones[index].lastListTrabVigentesAprobados);
            var indicadorTrabAsig = (listFullFormaciones[index].tipoVisitante.id == -1?
      	       listFullFormaciones[index].numTrabAsignadosAprobadosTotal+"//"+listFullFormaciones[index].numTrabAsignadosTotal:"------");
            var indicadorTraProg = (listFullFormaciones[index].tipoVisitante.id == -1?
      	       listFullFormaciones[index].numProgramacionesRealizadas+"//"+listFullFormaciones[index].numProgramacionesPlaneadas:"------");
      		       						
	    fullDatosTabla = fullDatosTabla +
	       listFullFormaciones[index].capacitacionNombre.replace("\t","")+"\t" +
               listFullFormaciones[index].clasificacionNombre.replace("\t","")+"\t" +
               listFullFormaciones[index].responsable.replace("\t","")+"\t" +
               listFullFormaciones[index].tema.replace("\t","")+"\t" +
               (listFullFormaciones[index].vigencia.id == null?"------":listFullFormaciones[index].vigencia.nombre)+"\t" +
	       indicadorTrabAsig+""+"\t" +
	       indicadorTraProg+"\n";
         }
      }
			
      copiarAlPortapapeles(fullDatosTabla); 
				
      alert("Se han guardado al clipboard la tabla de este módulo" );		
   }); 
});

function ocultarModalConsolidadoExcelFormacion(){
   $("#modalConsolidadoExcel").modal("hide");
}

function verModalConsolidadoExcelFormacion(){
   $("#modalConsolidadoExcel").remove();
      
   var selEstadoActivo = crearSelectOneMenu("selEstadoActivo","",
      listBoolean,1,"id","nombre","Todos");
 
   var contenido = "";
    
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Fecha inicio",
       inputForm:"<input type='date' class='form-control' id='dateInicioConsolidadoInsEmpresa'>",divContainer: ""}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Fecha fin",
       inputForm:"<input type='date' class='form-control' id='dateFinConsolidadoInsEmpresa'>",divContainer: ""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Formación",inputForm:"",divContainer:"divFiltroFormacionesCap"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS DE LOS TRABAJADORES ***</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Activo en la empresa?",inputForm:selEstadoActivo},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	             "onclick='ocultarModalConsolidadoExcelFormacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
            		 "onclick='consolEmpresaExcelFormacion()'>" +
              	    "<i class='fa fa-file-excel-o'></i> Generar" +
              	 "</button>"}
   ];
              	        
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
              	 
   var modalOptions={
      id: "modalConsolidadoExcel",
      nombre: "<i class='fa fa-list-alt'></i> Consolidado Formación",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
              	 
   crearModalPrincipalUsuario(modalOptions,function(){
      crearSelectOneMenuObligMultipleCompleto("selMulFiltroFormacionesCap","",listFullFormaciones,
         "capacitacionId","capacitacionNombre","#divFiltroFormacionesCap","Todos");
   },true,true);
    
   var hoy = getSession("fechaHoyOrdenInversoTexto");
              		
   $("#dateInicioConsolidadoInsEmpresa").val(sumaFechaDias(-30,hoy));
   $("#dateFinConsolidadoInsEmpresa").val(sumaFechaDias(7,hoy));    
}

function consolEmpresaExcelFormacion(){
   var estadoActivoId = $("#selEstadoActivo").val(); 
   
   var listFormacionesId = [];
   var formacionesId = $("#selMulFiltroFormacionesCap").val();
    
   if(formacionesId != null){
      formacionesId.forEach(function(val){
	 listFormacionesId.push(parseInt(val));
      });
   }

   window.open(URL+"/capacitacion/formacion/consolidado/excel?" +
      "empresaId="+getSession("gestopcompanyid")+"&fechaInicio="+$("#dateInicioConsolidadoInsEmpresa").val() +
      "&fechaFin="+$("#dateFinConsolidadoInsEmpresa").val()+"&estadoActivoId="+estadoActivoId +
      "&listCapacitacionesId="+(listFormacionesId.length == 0?"-1":listFormacionesId)); 
}

function verFiltroCapacitacion(){
   $("#modalFiltroCap").modal("show");
   $("#modalFiltroCap .modal-body").show();
}

function ocultarFiltroCapacitacion(){
   $("#modalFiltroCap").modal("hide");
}

function cargarPrimerEstado(){
   banderaEdicion = false;
   
   capacitacionId = 0;capacitacionTipo = 0;clasificacionId = 0;
	
   removerBotones();crearBotones();
	
   $("#fsBotones").append(
      "<button id='btnProgFecha' type='button' class='btn btn-success' title='Programar Fecha'>" +
         "<i class='fa fa-calendar fa-2x'></i>" +
      "</button>");
	
   $("#fsBotones").append(
      "<button id='filtroAplicarBuscador' type='button' onclick='verFiltroCapacitacion()' " +
              "title='Filtros' class='btn btn-success'>" +
         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>" +
      "</button>");
   
   $("#fsBotones").append(
      "<button id='btnClipTabla' type='button' class='btn btn-success' title='Tabla Clipboard'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" + 
      "</button>");
	
   $("#btnUpload").attr("onclick","javascript:importarDatos();");
	
   $("#fsBotones").append(
      "<button id='btnModalConExcelFormacion' type='button' class='btn btn-success' " +
              "title='Consolidado Formaciones' onclick='verModalConsolidadoExcelFormacion();'>" +
         "<i class='fa fa-list-alt fa-2x'></i>" +
      "</button>");
   
   $("#fsBotones").append(
      "<button id='btnGraficoCap' class='btn btn-info' title='Elaborar un gráfico con los valores seleccionados.' " +
              "type='button' onclick='seleccionarOpcionGraficoCap();'>" +
         "<i class='fa fa-bar-chart fa-2x'></i>" +
         "<i class='fa fa-info-circle'></i>" +
      "</button>");

   deshabilitarBotonesEdicion();
   $("#btnProgFecha").hide();

   $("#btnNuevo").attr("onclick","javascript:nuevoCapacitacion();");
   $("#btnCancelar").attr("onclick","javascript:cancelarCapacitacion();");
   $("#btnGuardar").attr("onclick","javascript:guardarCapacitacion();");
   $("#btnEliminar").attr("onclick","javascript:eliminarCapacitacion();");
   $("#btnProgFecha").attr("onclick","javascript:programarFecha();");
   $("#btnImportar").attr("onclick","javascript:importarDatos();");
   $("#modalFiltroCap").modal("hide");
	
   var dataParam={
      idCompany: getSession("gestopcompanyid"),capacitacionTipoId: null,
      trabajador: ($("#selFiltroResponsableCapacitacion").val() == -1 || 
	           $("#selFiltroResponsableCapacitacion option:selected").text() == ""?null:
         {trabajadorId: $("#selFiltroResponsableCapacitacion").val(),
	  nombre: $("#selFiltroResponsableCapacitacion option:selected").text()}),
      wantsOrdenNombre: 1,esCapacitacionOnline: 0
   };

   callAjaxPost(URL+'/capacitacion/vista_admin',dataParam,procesarDataDescargadaPrimerEstado);
}

function nombreClasifCap(idTipo,nombreTipo){
   if(idTipo == 4){
      return nombreTipo;
   }else{
      return "Ninguna";
   }
}

var listCapacitacionAux=[];

function procesarDataDescargadaPrimerEstado(data){
   resizeDivWrapper("wrapper",160);
    
   switch(data.CODE_RESPONSE){
      case "05":
	 var list = data.list;
	 listFullFormaciones = list;       
         listCategoriaCapacitacion = data.listCategoriaCapacitacion;
         listClasificacion = data.listCla;
         listCapacitacionTipo = data.listCapTipo;
         listCapacitacionAux=[];
         
         listCapacitacionTipo = listCapacitacionTipo.filter(function(val,index){		
            if(val.selCapId == 5){
	       return false;
            }else{
	       return true;
            }
         });
		
         listTiposVigencia = data.listTiposVigencia;
		
         $("#h2Titulo").html("<a onclick='javascript:cargarPrimerEstado();' href='#'>Capacitaciones</a>");
	
         $("#tblCap tbody tr").remove();
		
         list.forEach(function(val,index){
	    if(val.capacitacionTipoId != 5){
	       listCapacitacionAux.push(val);
	  
	       $("#tblCap tbody").append(
	          "<tr id='tr"+val.capacitacionId+"' onclick='javascript:editarCapacitacion("+index+")'>" +
                     "<td id='tdnom"+val.capacitacionId+"'>"+val.capacitacionNombre+"</td>" + 
                     "<td id='tdtipo"+val.capacitacionId+"'>"+val.capacitacionTipoNombre+"</td>" + 
                     "<td id='tdcla"+val.capacitacionId+"'>"+val.clasificacionNombre+"</td>" +
		     "<td id='tdcatcap"+val.capacitacionId+"'>"+val.categoriaCapacitacion.nombre+"</td>" +
		     "<td id='tdres"+val.capacitacionId+"'>"+val.responsable+"</td>" +
		     "<td id='tdtem"+val.capacitacionId+"'>"+val.tema+"</td>" +
		     "<td id='tdhor"+val.capacitacionId+"'>"+val.horasProgramadas+"</td>" +
		     "<td id='tdvig"+val.capacitacionId+"'>"+val.vigencia.nombre+"</td>" +
		     "<td id='tdTrabAsig"+val.capacitacionId+"'>" +
		         val.numTrabAsignadosAprobadosTotal+"/"+val.numTrabAsignadosTotal+"</td>" +
		     "<td id='tdProg"+val.capacitacionId+"'>"+val.numProgramacionesRealizadas+"/"+val.numProgramacionesPlaneadas+"</td>" +
		     "<td id='tdvid"+val.capacitacionId+"' style='word-break:break-all;'>"+val.urlVideo+"</td>" +
		     "<td id='tdasig"+val.capacitacionId+"'>"+val.numPuestosAsociados+"</td>" + 
		     "<td id='tdExcep"+val.capacitacionId+"'>"+val.numExcepciones+"</td>" +
		  "</tr>");
	    }
         });
		
         goheadfixedY("#tblCap","#wrapper");formatoCeldaSombreableTabla(true,"tblCap");completarBarraCarga();
		
         if(getSession("linkCalendarioCapId")!=null){
	    var indexIpercAux = 0;
	       
	    listFullFormaciones.every(function(val,index3){
	       if(val.capacitacionId == parseInt(getSession("linkCalendarioCapId"))){
		  editarCapacitacion(index3);
		  programarFecha();
		  sessionStorage.removeItem("linkCalendarioCapId");
					
		  return false;
				
	       }else{
		  return true;
	       }
	    });
         }
		
         break;
	
      default:
	 alert("Ocurrió un error al traer las capacitaciones!");
   }
	
   if(contador2 == 0){
      goheadfixed('table.fixed');
   }
	
   contador2 = contador2 + 1;
}

function editarCapacitacion(pindex){
   if(!banderaEdicion){
      capacitacionObj = listFullFormaciones[pindex];
      capacitacionId = listFullFormaciones[pindex].capacitacionId;
      capacitacionTipo = listFullFormaciones[pindex].capacitacionTipoId;
      clasificacionId = listFullFormaciones[pindex].clasificacionId;
		
      $("#tr"+capacitacionId).addClass("fila-edicion");
		
      var vigenciaId = listFullFormaciones[pindex].vigencia.id;
      formatoCeldaSombreableTabla(false,"tblCap");
		
      var name = $("#tdnom"+capacitacionId).text();
      var iconoSmart = "<i class='fa fa-magic' aria-hidden='true'></i>";
		
      $("#tdTrabAsig"+capacitacionId).append(iconoSmart);
	
      $("#tdTrabAsig"+capacitacionId+" i").on("click",function(){
         verResumenTrabCapacitacion();
      });
		
      $("#mdProgFechaLabel").html("Programaci&oacute;n de '"+name+"'");
		
      $("#tdnom"+capacitacionId).html(
         "<input type='text' id='inputCap' class='form-control' placeholder='Capacitacion' autofocus='true' value='"+name+"'>");

//	var name1 = $("#tdres" + capacitacionId).text();
      $("#tdres"+capacitacionId).html(
         "<input type='text' id='inputRes' class='form-control' placeholder='Ingresar nombre y seleccionar' value=''>" +
         "<div id='divAutoCompletarTrabCap'></div>");
			
      var name2 = $("#tdtem"+capacitacionId).text();
		
      $("#tdtem"+capacitacionId).html(
         "<input type='text' id='inputTem' class='form-control' placeholder='Tema' autofocus='true' value='"+name2+"'>");
		
      var name3 = $("#tdhor"+capacitacionId).text();
		
      $("#tdhor"+capacitacionId).html(
         "<input type='number' id='inputHor' class='form-control' placeholder='Hora programada' autofocus='true' value='"+name3+"'>");
      
      var name4 = $("#tdvid"+capacitacionId).text();
		
      $("#tdvid"+capacitacionId).html(
         "<input type='text' id='inputUrlVideo' class='form-control' placeholder='Url Video' autofocus='true' value='"+name4+"'>");
      /** ************************************************************************* */
      var selCapTipo = crearSelectOneMenu("selCapTipo","",
         listCapacitacionTipo,capacitacionTipo,"selCapId","nombre");
		
      $("#tdtipo"+capacitacionId).html(selCapTipo);

      var selClaTipo = crearSelectOneMenu("selClaTipo","",
         listClasificacion,clasificacionId,"clasificacionId","nombre");
		
      $("#tdcla"+capacitacionId).html(selClaTipo);

      var selTipoVig = crearSelectOneMenu("selTipoVig","",
         listTiposVigencia,vigenciaId,"id","nombre");
		
      $("#tdvig"+capacitacionId).html(selTipoVig);
      // **********************************************	
      var categoriaCapacitacionId = listFullFormaciones[pindex].categoriaCapacitacion.id;
		
      var selCategoriaCapacitacion = crearSelectOneMenuOblig("selCategoriaCapacitacion","",
         listCategoriaCapacitacion, categoriaCapacitacionId, "id", "nombre");
	        
      $("#tdcatcap"+capacitacionId).html(selCategoriaCapacitacion);
	        
      banderaEdicion = true;
      habilitarBotonesEdicion();
		
      $("#btnProgFecha").show();
		
      $("#tdasig"+capacitacionId).html(
         "<a onclick='verPuestosRecurso("+1+","+pindex+")' class='efectoLink'>" +
	    "<i class='fa fa-list'></i> "+capacitacionObj.numPuestosAsociados +
	 "</a>");
      
      $("#tdExcep"+capacitacionId).html(
         "<a onclick='verExcepcionesCapacitacionOnline()' class='efectoLink'>" +
            "<i class='fa fa-list'></i>" +capacitacionObj.numExcepciones +
         "</a>");
	
      $("#inputRes").val(capacitacionObj.responsable);
      verAutoCompletarTrab();
      $("#selAutoTrabajador").val(capacitacionObj.trabajadorId);	
      
      $("#filtroAplicarBuscador").hide();$("#btnClipTabla").hide();
      $("#btnModalConExcelFormacion").hide();$("#btnGraficoCap").hide();
   }
}

function nuevoCapacitacion(){
   if(!banderaEdicion){
      var selCapTipo = crearSelectOneMenuOblig("selCapTipo","",
         listCapacitacionTipo,"-1","selCapId","nombre");
		
      var selClaTipo = crearSelectOneMenuOblig("selClaTipo","",
	 listClasificacion,"-1","clasificacionId","nombre");
		
      var selTipoVig = crearSelectOneMenuOblig("selTipoVig","",
	 listTiposVigencia,"-1","id","nombre");
		
      var selCategoriaCapacitacion = crearSelectOneMenuOblig("selCategoriaCapacitacion","",
	 listCategoriaCapacitacion,"-1","id","nombre");
	
      $("#tblCap tbody:first").prepend(
         "<tr id='tr0'>" +
	    "<td><input type='text' id='inputCap' class='form-control' placeholder='Formaci&oacute;n' required='true' autofocus='true'></td>" +
	    "<td>"+selCapTipo+"</td>" +
	    "<td>"+selClaTipo+"</td>" +
	    "<td>"+selCategoriaCapacitacion+"</td>" +
	    "<td><input type='text' id='inputRes' class='form-control' placeholder='Ingresar nombre y seleccionar' required='true' autofocus='true'>" +
		"<div id='divAutoCompletarTrabCap'></div></td>" +
	    "<td><input type='text' id='inputTem' class='form-control' placeholder='Tema' required='true' autofocus='true'></td>" +
	    "<td><input type='number' id='inputHor' class='form-control' placeholder='Hora Programada' required='true'></td>" +
	    "<td>"+selTipoVig+"</td>" + 
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td><input type='text' id='inputUrlVideo' class='form-control' placeholder='Url Video' required='true'></td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
         "</tr>");
		
      $("#inputRes").attr("onkeyup","verAutoCompletarTrab()");
		
      $("#inputCap").focus();
      formatoCeldaSombreableTabla(false,"tblCap");
		
      capacitacionId = 0;
      habilitarBotonesNuevo();
	
      $("#filtroAplicarBuscador").hide();$("#btnClipTabla").hide();
      $("#btnModalConExcelFormacion").hide();$("#btnGraficoCap").hide();
      
      banderaEdicion = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarCapacitacion(){
   cargarPrimerEstado();
}

function eliminarCapacitacion() {
   var r = confirm("¿Está seguro de eliminar la formación?");
	
   if(r == true){
      var dataParam={
	 capacitacionId: capacitacionId
      };

      callAjaxPost(URL+'/capacitacion/delete',dataParam,procesarResultadoEliminarCapacitacion);
   }
}

function procesarResultadoEliminarCapacitacion(data){
   switch (data.CODE_RESPONSE) {
      case "05":
	 cargarPrimerEstado();
		
	 break;

      default:
	 alert("Verificar que el tema de formación no tenga programaciones registradas, y también verificar " +
	       "que el tema de formación no esté asignado a puestos de trabajo");
   }
}

function guardarCapacitacion(){
   var campoVacio = true;
	
   var capacitacionTipo = $("#selCapTipo option:selected").val();
   var clasificacionTipo = $("#selClaTipo option:selected").val();
   var selTipoVig = $("#selTipoVig").val();
   var inputCap = $("#inputCap").val();
   var inputRes = $("#inputRes").val();
   var inputTem = $("#inputTem").val();
   var inputHor = $("#inputHor").val();
   var inputUrlVideo = $("#inputUrlVideo").val();
	
   var trabId = parseInt( $("#selAutoTrabajador").val());
	
   var selCategoriaCapacitacion= $("#selCategoriaCapacitacion").val();
	    
   if(capacitacionTipo == '-1' || clasificacionTipo == '-1' || 
      inputCap.length == 0 || inputRes.length == 0 || inputTem.length == 0 || 
      inputHor.length == 0 || inputUrlVideo.legth == 0){
      campoVacio = false;
   }

   if(selTipoVig == "-1"){
      selTipoVig = null;
   }
	
   if(campoVacio){
      var dataParam={
	 capacitacionId: capacitacionId,trabajadorId: trabId,clasificacionId: clasificacionTipo,
	 capacitacionNombre: inputCap,responsable: inputRes,tema: inputTem,horasProgramadas: inputHor,
	 capacitacionTipoId: capacitacionTipo,urlVideo: inputUrlVideo,vigencia :{id: selTipoVig},
	 categoriaCapacitacion: {id: selCategoriaCapacitacion},
	 idCompany: sessionStorage.getItem("gestopcompanyid")
      };

      var dataParamBefore = "tr"+capacitacionId;
		
      callAjaxPost(URL+'/capacitacion/save',dataParam,procesarResultadoGuardarCap);
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function procesarResultadoGuardarCap(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 cargarPrimerEstado();
		
	 break;
	
      default:
         alert("Ocurrió un error al guardar la capacitacion!");
   }
}

function importarDatos(){
   $("#btnGuardarNuevos").attr("onclick","javascript:guardarMasivoCopiaExcel();");

   $('#mdImpDatos').modal('show');	
}

function guardarMasivoCopiaExcel() {
   var texto = $("#txtListado").val();
   var listExcel = texto.split('\n');
   var listRecurso = [];
   var listFormacionRepe = [];
   var listFullNombres = "";
   var validado = "";
	
   if(texto.length < 10000){
      for(var int = 0;int < listExcel.length;int++){
         var listCells = listExcel[int].split('\t');
         var filaTexto = listExcel[int];
			
         if(filaTexto.trim().length < 1){
	    validado = "Existen filas vacias.";
				
	    break;
	 }

	 if(validado.length < 1 && listCells.length != 6){
	    validado = "No coincide el numero de celdas. ("+listCells.length+" != 6)";
				
	    break;
         }else{
	    var recurs = {};
	    var tipo = {};
	    var clas = {};
				
	    for(var j = 0;j < listCells.length;j++){
	       var element = listCells[j];
					
	       if(j === 0){
		  recurs.capacitacionNombre = element.trim();
						
		  if($.inArray(recurs.capacitacionNombre,listFormacionRepe) === -1){
		     listFormacionRepe.push(recurs.capacitacionNombre);
		  }else{
		     listFullNombres = listFullNombres + recurs.capacitacionNombre + ", ";
		  }
	       }
					
	       if(j === 1){
		  for(var k = 0;k < listCapacitacionTipo.length;k++){
		     if(listCapacitacionTipo[k].nombre == element.trim()){
		        recurs.capacitacionTipoId = listCapacitacionTipo[k].selCapId;
		     }
		  }

		  if(!recurs.capacitacionTipoId){
		     validado = "Tipo de Formación no reconocido.";
							
		     break;
		  }
	       }
					
	       if(j === 2){
		  for(var k = 0;k < listClasificacion.length;k++){
		     if(listClasificacion[k].nombre == element.trim()){
			recurs.clasificacionId = listClasificacion[k].clasificacionId;
		     }
		  }

		  if(!recurs.clasificacionId){
		     validado = "Clasificación de Formación no reconocida.";
							
		     break;
		  }
	       }
					
	       if(j === 3){
		  recurs.responsable = element.trim();
	       }
					
	       if(j === 4){
		  recurs.tema = element.trim();
	       }
					
	       if(j === 5){
		  recurs.horasProgramadas = element.trim();
						
		  if(isNaN(parseFloat(recurs.horasProgramadas ))){
		     validado = "Horas ingresadas no reconocidas";
		  }
	       }
					
	       recurs.idCompany = sessionStorage.getItem("gestopcompanyid");
	    }

	    listRecurso.push(recurs);
				
	    if(listFormacionRepe.length < listRecurso.length){
	       validado = "Existen fomaciones repetidos." + listFullNombres;
					
	       break;
	    }
         }
      }
   }else{
      validado = "Ha excedido los 10000 caracteres permitidos.";
   }

   if(validado.length < 1){
      var r = confirm("¿Está seguro que desea subir estos "+listExcel.length+" elemento(s)?");
		
      if(r == true){
         var dataParam={
	    listRecurso: listRecurso
         };
			
         callAjaxPost(URL+'/capacitacion/masivo/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
		  alert("Se guardaron exitosamente.");
		  cargarPrimerEstado();
		  $('#mdImpDatos').modal('hide');
					
		  break;
				
	       default:
		  alert("Ocurri&oacute; un error al guardar el trabajador!");
            }
         });
      }
   }else{
      alert(validado);
   }
}

function verAutoCompletarTrab(){
   var nombre = $("#inputRes").val().trim();
	
   if(nombre == ""){
      nombre = null;
   }
	
   var dataParam={
      trabajadorNombre: "%"+nombre+"%",
      empresaId: getSession("gestopcompanyid")
   };
	
   callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
      if(data.trabajadores.length == 0){
         data.trabajadores.push({
	    trabajadorId: -1,nombre: "Sin asignar"});
      }
		
      listTrabajadoresCapacitacion = data.trabajadores;
		
      crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","",
         data.trabajadores,"trabajadorId","nombre","#divAutoCompletarTrabCap","");
		
      $("#inputRes").attr("onkeyup","verAutoCompletarTrab()");
   });
}

var listTrabajadoresEstadoCap=[];

function volverPrincipalCapacitacion(){
   $("#modalResumenTrabCapacitacion").modal("hide");
}

function verResumenTrabCapacitacion(){
   $("#modalResumenTrabCapacitacion").remove();
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
   
   if(capacitacionObj.listPuestosAsignadosId.length != 0){
      var puestosAsignadosId = capacitacionObj.listPuestosAsignadosId.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabAgregadosId.length != 0){
      var trabAgregadosId = capacitacionObj.listTrabAgregadosId.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabExoneradosId.length != 0){
      var trabExoneradosId = capacitacionObj.listTrabExoneradosId.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabGrupoSeguridadId.length != 0){
      var trabGrupoSeguridadId = capacitacionObj.listTrabGrupoSeguridadId.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listCursosVigentesId.length != 0){
      var cursosVigentesId = capacitacionObj.listCursosVigentesId.split(","); 
   
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverCap' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalCapacitacion()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var btnClipBoard = 
      "<button id='btnClipboardSmartResCap' type='button' class='btn btn-success clipGosst' style='margin-right:5px' " +
              "onclick='copiarContenidoResumenTrabCapacitacion()' title='Copiar Clipboard'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" +
      "</button>";
	
//   var btnProgramacionCap =
//      "<button id='btnSmartProgResCap' type='button' class='btn btn-success' style='margin-right:5px' " +
//              "title='Smart Programacion'>" +
//         "<i class='fa fa-magic fa-2x'></i>" +
//      "</button>";
   
   var btnEnviarCorreo = 
      "<button id='btnEnviarCorreoResCap' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='enviarCorreoTrabPendientesCap()' title='Enviar correo - Trabajadores Sin Asignar'>" +
	 "<i class='fa fa-envelope fa-2x'></i>" +
      "</button>";

   var btnGrafico = 
      "<button id='btnGraficoResumenCap' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='verGraficoResumenCapacitacion()' title='Gráfico - Resumen Formación'>" +
 	 "<i class='fa fa-bar-chart fa-2x'></i>" +
      "</button>";
   
   var btnHistorialCorreo = 
      "<button id='btnHistorialCorreoCap' type='button' class='btn btn-success' " +
              "onclick='verHistoriaCorreoCapacitacion()' title='Historial de correos enviados asociados a la formación.'>" +
         "<i class='fa fa-list-ol fa-2x'></i> " +
         "<i class='fa fa-envelope'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalResumenTrabCapacitacion",
      nombre:"<i class='fa fa-table'></i> Resumen de formación: "+capacitacionObj.capacitacionNombre+" - "+capacitacionObj.tema,
      contenido: 
	  buttonVolver+btnClipBoard+btnEnviarCorreo+btnGrafico+btnHistorialCorreo +
         "<div class='wrapper' id='wrapperResumenTrabCapacitacion'>" +
            "<table id='tblResumenTrabCapacitacion' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
		  "<tr>" +
		     "<th class='tb-acc' colspan='7' style='width:2100px'>Datos del trabajador(a)</th>" +
		     "<th class='tb-acc' colspan='3' style='width:750px'>Formación</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:300px'>DNI</th>" +
		     "<th class='tb-acc' style='width:300px'>Unidad</th>" +
		     "<th class='tb-acc' style='width:300px'>División</th>" +
		     "<th class='tb-acc' style='width:300px'>Área</th>" +
		     "<th class='tb-acc' style='width:300px'>Puesto de trabajo</th>" +
		     "<th class='tb-acc' style='width:300px'>Nombre</th>" +
		     "<th class='tb-acc' style='width:300px'>Correo</th>" +
		     "<th class='tb-acc' style='width:250px'>Estado</th>" +
		     "<th class='tb-acc' style='width:250px'>Días de vigencia</th>" +
		     "<th class='tb-acc' style='width:250px'>Fecha próxima</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperResumenTrabCapacitacion",190);
   cargarResumenCapacitacionVersionDos();
}

var numTrabCapTotal,numTrabCapAprobado,numTrabCapDesaprobado;

function cargarResumenCapacitacionVersionDos(){
   numTrabCapTotal = 0,numTrabCapAprobado = 0,
   numTrabCapDesaprobado = 0;
   
   asigAuxCorreo = [],asigAuxNombre = [];
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionId,ultimoCursoId: capacitacionObj.ultimoCursoId,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
         (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
         (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
         (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
         (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux)
   };
    
   callAjaxPost(URL+"/capacitacion/trabajador/formacion/version_dos",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listTrabajadoresEstadoCap = data.listTrabajadoresEstadoCap;
	 
	 $("#tblResumenTrabCapacitacion tbody tr").remove();
	 
	 listTrabajadoresEstadoCap.forEach(function(val,index){
	    var estadoCapOnline = (val.tipoNotaId == 3?"------":
	       (val.tipoNotaId == 1?"Aprobado":"Desaprobado"));
	    var diasRestantesCapOnline = (val.tipoNotaId == 3?"------":val.diasRestantes);
	    var fechaFuturaCapOnline = (val.tipoNotaId == 3?"------":val.fechaFutura);
	    
	    $("#tblResumenTrabCapacitacion tbody").append(
	       "<tr id='ft"+val.trabajadorId+"'>" +
	          "<td>"+val.dni+"</td>" +
		  "<td>"+val.unidadNombre+"</td>" +
		  "<td>"+val.divisionNombre+"</td>" +
		  "<td>"+val.areaNombre+"</td>" +
		  "<td>"+val.puestoNombre+"</td>" + 
		  "<td>"+val.trabajadorNombre+"</td>" +
		  "<td>"+val.emailTrabajador+"</td>" +
		  "<td>"+estadoCapOnline+"</td>" +
		  "<td>"+diasRestantesCapOnline+"</td>" +
		  "<td>"+fechaFuturaCapOnline+"</td>" +
               "</tr>");
	    
	    var colorFondoFila = (val.tipoNotaId == 1?"#5dcd5d":(val.tipoNotaId == 2?"#D8D808":"#ff7474"));
	    
	    $("#ft"+val.trabajadorId+" td").css({"background-color":colorFondoFila});
	    
	    if(val.tipoNotaId == 1){
	       numTrabCapAprobado++;
	    }else{
	       if(val.tipoNotaId == 2){
		  numTrabCapDesaprobado++; 
	       }
		
	       asigAuxCorreo.push(val.emailTrabajador);asigAuxNombre.push(val.trabajadorNombre);
	    }
	    
	    numTrabCapTotal++;
	 });
	 
	 if(asigAuxCorreo.length == 0){
	    $("#btnEnviarCorreoResCap").hide(); 
         }
	 
	 if(capacitacionObj.numRegHistorialCorreo == 0){
	    $("#btnHistorialCorreoCap").hide(); 
	 }
      }else{
         console.log("NOPNPO");
      }
	
      goheadfixedY("#tblResumenTrabCapacitacion","#wrapperResumenTrabCapacitacion");
   });
}

function copiarContenidoResumenTrabCapacitacion(){
   var texto = obtenerDatosBodyTablaEstandar("tblResumenTrabCapacitacion");
   copiarAlPortapapeles(texto,"btnClipboardSmartResCap");
		
   $("#modalResumenTrabCapacitacion").modal("hide");
		    
   mensajeUx = "<label>Se han copiado todas las filas de la tabla " +
	       "Resumen de formación.</label>";
   mensajesUx(mensajeUx,1,"","MensajeExitoFilasCopiadasCap");  
		   
   $("#modalMensajeUxMensajeExitoFilasCopiadasCap").on("hidden.bs.modal",function(){
      $("#modalResumenTrabCapacitacion").modal("show");
   });
}

function enviarCorreoTrabPendientesCap(){
   $("#modalResumenTrabCapacitacion").modal("hide");
    
   mensajeUx="<label>¿Desea enviar un correo a todos los trabajadores que no han "+
      "llevado o aprobado aún la formación? ("+asigAuxCorreo.length+")</label>";
   mensajesUx(mensajeUx,3,"","EnviarCorreoCap");

   $("#btnDevolverValorEnviarCorreoCap").on("click",function(){
      var dataParam={
	 capacitacionId: capacitacionId,
	 correoTrabajadoresSinAsignar: asigAuxCorreo,
	 nombreTrabajadores: asigAuxNombre
      };
	    
      callAjaxPost(URL+'/capacitacion/curso/correo',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>Correo(s) enviado(s) con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarResumenCap");
  		
  	       $("#modalMensajeUxActualizarResumenCap").on("hidden.bs.modal",function(){
  	          $("#modalResumenTrabCapacitacion").modal("show");
  	          $("#btnHistorialCorreoCap").show();
  	       });
	       
  	       break;
				
	    default:
	       console.log("Ocurrió un error al enviar los correos!");
         }
      });
   });
	      
   $("#btnRegresarPrevioEnviarCorreoCap").on("click",function(){
      $("#modalResumenTrabCapacitacion").modal("show");
   });  
}

function verGraficoResumenCapacitacion(){
   $("#modalResumenTrabCapacitacion").modal("hide");
   $("#modalGraficoResumenTrabCapacitacion").remove();
   
   var numTrabajadoresPendientes = 
      numTrabCapTotal - (numTrabCapAprobado + numTrabCapDesaprobado);
     
   var modalOptions={
      id: "modalGraficoResumenTrabCapacitacion",
      maxWidth: "90%",
      nombre: "Gráfico - Resumen de formación: "+capacitacionObj.capacitacionNombre+" - "+capacitacionObj.tema,
      dontRemoveBack: true,
      contenido: "<div id='divGraficoResTrabCap'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoResTrabCap",190);
 	 	
   Highcharts.chart('divGraficoResTrabCap',{
      chart: {type: 'column'},
      title: {text: "Gráfico - Resumen Formación"},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de trabajadores"}},
      plotOptions: {
 	 column: {
            dataLabels: {
 	       enabled: true},
 	    enableMouseTracking: false}},
      series: [
         {name: "Trabajadores con formación pendiente",data: [numTrabajadoresPendientes],color: "#ff7474"},
	 {name: "Trabajadores con formación desaprobada",data: [numTrabCapDesaprobado],color: "#D8D808"},
 	 {name: "Trabajadores con formación aprobada",data: [numTrabCapAprobado],color: "#5dcd5d"}]
   }); 
   
   $("#modalGraficoResumenTrabCapacitacion").on("hidden.bs.modal",function(){
      $("#modalResumenTrabCapacitacion").modal("show");
   });
}

var capacitacionObjAux={};

function ocultarValoresPreviosParametrosGraficoCap(){
   $("#modalValParamGraficoCap").modal("hide");
}

function valoresPreviosParametrosGraficoCap(){
   if(listCapacitacionAux.length > 0){
      $("#modalValParamGraficoCap").remove();
   
      var selCapacitacion = crearSelectOneMenuOblig("selCapacitacion","",
         listCapacitacionAux,"","capacitacionId","capacitacionNombre");
     
      var contenido = "";
  
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"Formación",inputForm:selCapacitacion},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	                "onclick='ocultarValoresPreviosParametrosGraficoCap()'>" +
    	           "<i class='fa fa-times'></i> Cancelar" +
    	        "</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		    "onclick='verResultadoGraficoCapacitacion()'>" +
    	               "<i class='fa fa-bar-chart'></i> Gráfico" +
    	            "</button>"}
      ];
    	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	
      var modalOptions={
         id: "modalValParamGraficoCap",
         nombre: "<i class='fa fa-list-ul'></i> Gráfico - Valores",
         contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
      };
    	
      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
      $("#modalValParamGraficoCap").modal("show");
   }else{
      mensajeUx = "<label>Para utilizar esta función, debe tener al menos " +
      		  "una formación registrada.</label>";
      mensajesUx(mensajeUx,2,""); 
   }
}

function verResultadoGraficoCapacitacion(){
   var nombreCapacitacion="";
   var puestosAsignadosIdAux,trabAgregadosIdAux,trabExoneradosIdAux,
       trabGrupoSeguridadIdAux,cursosVigentesIdAux,ultimoCursoIdAux;
   var capacitacionIdAux = parseInt($("#selCapacitacion").val());

   listCapacitacionAux.forEach(function(val,index){
      if(capacitacionIdAux == val.capacitacionId){
	 nombreCapacitacion = val.capacitacionNombre;puestosAsignadosIdAux = val.listPuestosAsignadosId;
	 trabAgregadosIdAux = val.listTrabAgregadosId;trabExoneradosIdAux = val.listTrabExoneradosId;
	 trabGrupoSeguridadIdAux = val.listTrabGrupoSeguridadId;cursosVigentesIdAux = val.listCursosVigentesId;
	 ultimoCursoIdAux = val.ultimoCursoId;
      }    
   });
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
   
   if(puestosAsignadosIdAux.length != 0){
      var puestosAsignadosId = puestosAsignadosIdAux.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabAgregadosIdAux.length != 0){
      var trabAgregadosId = trabAgregadosIdAux.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabExoneradosIdAux.length != 0){
      var trabExoneradosId = trabExoneradosIdAux.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(trabGrupoSeguridadIdAux.length != 0){
      var trabGrupoSeguridadId = trabGrupoSeguridadIdAux.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
   
   if(cursosVigentesIdAux.length != 0){
      var cursosVigentesId = cursosVigentesIdAux.split(","); 
   
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }
    
   var dataParam={ 
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionIdAux,ultimoCursoId: ultimoCursoIdAux,
      listPuestosAsignadosIdAux: 
	 (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
         (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
	 (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
	 (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
	 (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux)
   };
  	   
   callAjaxPost(URL+'/capacitacion/trabajador/formacion/grafico',dataParam,function(data){
      var listValoresCapGrafico = data.valoresCapacitacionGrafico;
      var listAreasAux=[],listNumAprobadosAux=[],listNumDesaprobadosAux=[],listNumPendientesAux=[];
      var numCumplimientoTotal = 0,numAsignadosTotal = 0,resultadoDecimal;
      
      listValoresCapGrafico.forEach(function(val,index){
         if(val.numTrabajadoresAsignados > 0){
            var numTrabPendientes = 
               val.numTrabajadoresAsignados - (val.numTrabAprobados + val.numTrabDesaprobados); 
            
            numCumplimientoTotal = numCumplimientoTotal + val.numTrabAprobados + val.numTrabDesaprobados;
            numAsignadosTotal = numAsignadosTotal + val.numTrabajadoresAsignados;
              
            listAreasAux.push(val.areaName);
            listNumAprobadosAux.push(val.numTrabAprobados);
            listNumDesaprobadosAux.push(val.numTrabDesaprobados);
            listNumPendientesAux.push(numTrabPendientes);
         }
      });
      
      resultadoDecimal = (numAsignadosTotal == 0?0:pasarDecimalPorcentaje((numCumplimientoTotal/numAsignadosTotal),2));
         
      $("#modalValParamGraficoCap").modal("hide");
      $("#modalGraficoResultadoTrabCapacitacion").remove();
         
      var modalOptions={
         id: "modalGraficoResultadoTrabCapacitacion",
         maxWidth: "90%",
         nombre: "Gráfico - Resumen de formación: "+nombreCapacitacion,
//         dontRemoveBack: true,
         contenido: "<div id='divGraficoResultadoTrabCap'></div>"
      };
     	    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      resizeDivWrapper("divGraficoResultadoTrabCap",170);
       
      Highcharts.chart('divGraficoResultadoTrabCap',{
         chart:{type: 'column'},
	 title:{text: "% de cumplimiento: "+resultadoDecimal+" ("+numCumplimientoTotal+"/"+numAsignadosTotal+")",
	        align: 'left',
	        style: {fontWeight: 'bold',fontSize: '20px'}},
	 xAxis:{
	    categories: listAreasAux,
	    labels: {
	       style: {fontWeight: 'bold'}},
	    title: {
	       text: 'Área',
	       style: {fontWeight: 'bold',fontSize: '18px'}}},
	 yAxis:{
	    min: 0,max: 100,tickInterval: 10,
	    title: {
	       text: 'Porcentajes',
	       style: {fontWeight: 'bold',fontSize: '18px'}},
	    labels: {
	       style: {fontWeight: 'bold',fontSize: '18px'},
	       formatter: function(){
	          return this.value+ '%'
	       }},
	    stackLabels: {
	       enabled: true,
	          style: {
	             fontWeight: 'bold',
	             color: ( // theme
	                Highcharts.defaultOptions.title.style &&
	                Highcharts.defaultOptions.title.style.color) || 'gray',
	             textOutline: 'none'}}},
	 legend: {
	    align: 'right',x: -30,verticalAlign: 'top',y: 0,floating: true,
	    backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
	    borderColor: '#CCC',borderWidth: 1,shadow: false},
	 tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
	    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>' +
	                 '<br/>Total: {point.stackTotal} (100%)'}, 
	 plotOptions: {
            column: {
	       stacking: 'percent',
	       dataLabels: {
	          enabled: true,color: 'black',style: {fontSize: '25px'}}}},
	 series: [
	    {name: 'Aprobado',data: listNumAprobadosAux,color: '#5dcd5d'},
	    {name: 'Desaprobado',data: listNumDesaprobadosAux,color: '#D8D808'},
	    {name: 'Pendiente',data: listNumPendientesAux,color: '#ff7474'}]
      });	   
   });
}

var listOpcionesGraficoCap=[
   {id:1,nombre:"Resumen de formación"},
   {id:2,nombre:"Combinación Formación - Capacitación online"}
];

function ocultarSeleccionarOpcionGraficoCap(){
   $("#modalSelOpcionGraficoCap").modal("hide");
}

function seleccionarOpcionGraficoCap(){
   $("#modalSelOpcionGraficoCap").remove();
   
   var selOpcionGraficoCap = crearSelectOneMenuOblig("selOpcionGraficoCap","",
      listOpcionesGraficoCap,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoCap},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoCap()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoCapacitacion()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoCap",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
   $("#modalSelOpcionGraficoCap").modal("show");
}

function redireccionarGraficoCapacitacion(){
   $("#modalSelOpcionGraficoCap").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoCap").val());
  
   if(opcionId == 1){
      valoresPreviosParametrosGraficoCap();
   }else if(opcionId == 2){
      valoresPreviosParamGraficoCombinacionCap(); 
   }
}

var listCapacitacionesOnlineAux=[],listCursosVigentesIdCapOnlineAux=[];

function ocultarValoresPreviosParamGraficoCombinacionCap(){
   $("#modalValParamGraficoCombinacionCap").modal("hide");
}

function valoresPreviosParamGraficoCombinacionCap(){
   var dataParam={
      idCompany: parseInt(getSession("gestopcompanyid")),
      esCapacitacionOnline: 1
   }; 
		  		
   callAjaxPost(URL+'/capacitacion/vista_admin/simple',dataParam,function(data){
      listCapacitacionesOnlineAux = data.list;
    
      if(listCapacitacionAux.length > 0 && listCapacitacionesOnlineAux.length > 0){
         $("#modalValParamGraficoCombinacionCap").remove();
   
         var selCapacitacionBase = crearSelectOneMenuOblig("selCapacitacionBase","",
            listCapacitacionAux,"","capacitacionId","capacitacionNombre");
         
         var selCapacitacionOnlineAuxiliar = crearSelectOneMenuOblig("selCapacitacionOnlineAuxiliar","",
            listCapacitacionesOnlineAux,"","capacitacionId","capacitacionNombre");
     
         var contenido = "";
  
         var listContenido=[
            {sugerencia:"<label>*Se considerará a todos los trabajadores asignados (aprobados y pendientes).</label>",
             anchoLabel:"",anchoDiv:"",label:"Formación*",inputForm:selCapacitacionBase},
            {sugerencia:"<label>**Para considerará solo a los trabajadores aprobados.</label>",
             anchoLabel:"",anchoDiv:"",label:"Capacitación online**",inputForm:selCapacitacionOnlineAuxiliar},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             label:"'Para obtener el gráfico exacto, recuerde seleccionar la misma opción (tema general) tanto en " +
              	   "Formación como en Capacitación online (en caso el tema general tenga el mismo nombre en ambos módulos).'",
             inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	                   "onclick='ocultarValoresPreviosParamGraficoCombinacionCap()'>" +
    	              "<i class='fa fa-times'></i> Cancelar" +
    	           "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		       "onclick='verResultadoGraficoCombinacionCapacitacion()'>" +
    	                  "<i class='fa fa-bar-chart'></i> Gráfico" +
    	               "</button>"}
            ];
    	    
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
         });
    	
         var modalOptions={
            id: "modalValParamGraficoCombinacionCap",
            nombre: "<i class='fa fa-list-ul'></i> Gráfico - Valores",
            contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
         };
    	
         crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
         $("#modalValParamGraficoCombinacionCap").modal("show");
      }else{
         mensajeUx = "<label>Para utilizar esta función, debe tener al menos " +
      		     "una formación y una capacitación online registrada.</label>";
         mensajesUx(mensajeUx,2,""); 
      }
   });
}

function verResultadoGraficoCombinacionCapacitacion(){ 
   var nombreCapacitacion="";
   var puestosAsignadosIdAux,trabAgregadosIdAux,trabExoneradosIdAux,
        trabGrupoSeguridadIdAux,cursosVigentesIdAux,ultimoCursoIdAux;
   var capacitacionIdAux = parseInt($("#selCapacitacionBase").val());

   listCapacitacionAux.forEach(function(val,index){
      if(capacitacionIdAux == val.capacitacionId){
 	 nombreCapacitacion = val.capacitacionNombre;puestosAsignadosIdAux = val.listPuestosAsignadosId;
 	 trabAgregadosIdAux = val.listTrabAgregadosId;trabExoneradosIdAux = val.listTrabExoneradosId;
 	 trabGrupoSeguridadIdAux = val.listTrabGrupoSeguridadId;cursosVigentesIdAux = val.listCursosVigentesId;
 	 ultimoCursoIdAux = val.ultimoCursoId;
      }    
   });
    
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
    
   if(puestosAsignadosIdAux.length != 0){
      var puestosAsignadosId = puestosAsignadosIdAux.split(","); 
    
      puestosAsignadosId.forEach(function(val){
  	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
    
   if(trabAgregadosIdAux.length != 0){
      var trabAgregadosId = trabAgregadosIdAux.split(","); 
    
      trabAgregadosId.forEach(function(val){
 	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
    
   if(trabExoneradosIdAux.length != 0){
      var trabExoneradosId = trabExoneradosIdAux.split(","); 
    
      trabExoneradosId.forEach(function(val){
 	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
    
   if(trabGrupoSeguridadIdAux.length != 0){
      var trabGrupoSeguridadId = trabGrupoSeguridadIdAux.split(","); 
    
      trabGrupoSeguridadId.forEach(function(val){
 	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
    
   if(cursosVigentesIdAux.length != 0){
      var cursosVigentesId = cursosVigentesIdAux.split(","); 
    
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }

   var nombreCapacitacionOnline="";
   var cursosVigentesIdCapOnlineAux;
   var capacitacionOnlineIdAux = parseInt($("#selCapacitacionOnlineAuxiliar").val());

   listCapacitacionesOnlineAux.forEach(function(val,index){
      if(capacitacionOnlineIdAux == val.capacitacionId){
	 nombreCapacitacionOnline = val.capacitacionNombre;cursosVigentesIdCapOnlineAux = val.listCursosVigentesId;
      }    
   });
   
   listCursosVigentesIdCapOnlineAux=[];
   
   if(cursosVigentesIdCapOnlineAux.length != 0){
      var cursosVigentesCapOnlineId = cursosVigentesIdCapOnlineAux.split(","); 
   
      cursosVigentesCapOnlineId.forEach(function(val){
         listCursosVigentesIdCapOnlineAux.push(parseInt(val));
      });
   }

   var dataParam={ 
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionIdAux,ultimoCursoId: ultimoCursoIdAux,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
	 (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
	 (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
	 (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
	 (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux),
      listCursosVigentesIdCapOnlineAux: 
	 (listCursosVigentesIdCapOnlineAux.length == 0?null:listCursosVigentesIdCapOnlineAux)
   };
  	   
   callAjaxPost(URL+'/capacitacion/trabajador/formacion/grafico/combinacion',dataParam,function(data){
      var listValoresCapGrafico = data.valoresCapacitacionGrafico;
      var listAreasAux=[],listNumAprobadosAux=[],listNumDesaprobadosAux=[],listNumPendientesAux=[];
      var numCumplimientoTotal = 0,numAsignadosTotal = 0,resultadoDecimal;
      
      listValoresCapGrafico.forEach(function(val,index){
         if(val.numTrabajadoresAsignados > 0){
            var numTrabPendientes = val.numTrabajadoresAsignados - (val.numTrabAprobados + val.numTrabDesaprobados);  
            
            numCumplimientoTotal = numCumplimientoTotal + val.numTrabAprobados + val.numTrabDesaprobados;
            numAsignadosTotal = numAsignadosTotal + val.numTrabajadoresAsignados;
              
            listAreasAux.push(val.areaName);
            listNumAprobadosAux.push(val.numTrabAprobados);
            listNumDesaprobadosAux.push(val.numTrabDesaprobados);
            listNumPendientesAux.push(numTrabPendientes);
         }
      });
      
      resultadoDecimal = (numAsignadosTotal == 0?0:pasarDecimalPorcentaje((numCumplimientoTotal/numAsignadosTotal),2));
         
      $("#modalValParamGraficoCombinacionCap").modal("hide");
      $("#modalGraficoCombinacionTrabCapacitacion").remove();
         
      var modalOptions={
         id: "modalGraficoCombinacionTrabCapacitacion",
         maxWidth: "90%",
         nombre: "Gráfico Combinación - Formación ["+nombreCapacitacion+"] + " +
                 "Capacitación Online ["+nombreCapacitacionOnline+"] ",
//         dontRemoveBack: true,
         contenido: "<div id='divGraficoCombinacionTrabCap'></div>"
      };
     	    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      resizeDivWrapper("divGraficoCombinacionTrabCap",170);
       
      Highcharts.chart('divGraficoCombinacionTrabCap',{
         chart:{type: 'column'},
	 title:{text: "% de cumplimiento: "+resultadoDecimal+" ("+numCumplimientoTotal+"/"+numAsignadosTotal+")",
	        align: 'left',
	        style: {fontWeight: 'bold',fontSize: '20px'}},
	 xAxis:{
	    categories: listAreasAux,
	    labels: {
	       style: {fontWeight: 'bold'}},
	    title: {
	       text: 'Área',
	       style: {fontWeight: 'bold',fontSize: '18px'}}},
	 yAxis:{
	    min: 0,max: 100,tickInterval: 10,
	    title: {
	       text: 'Porcentajes',
	       style: {fontWeight: 'bold',fontSize: '18px'}},
	    labels: {
	       style: {fontWeight: 'bold',fontSize: '18px'},
	       formatter: function(){
	          return this.value+ '%'
	       }},
	    stackLabels: {
	       enabled: true,
	          style: {
	             fontWeight: 'bold',
	             color: ( // theme
	                Highcharts.defaultOptions.title.style &&
	                Highcharts.defaultOptions.title.style.color) || 'gray',
	             textOutline: 'none'}}},
	 legend: {
	    align: 'right',x: -30,verticalAlign: 'top',y: 0,floating: true,
	    backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
	    borderColor: '#CCC',borderWidth: 1,shadow: false},
	 tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
	    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>' +
	                 '<br/>Total: {point.stackTotal} (100%)'}, 
	 plotOptions: {
            column: {
	       stacking: 'percent',
	       dataLabels: {
	          enabled: true,color: 'black',style: {fontSize: '25px'}}}},
	 series: [
	    {name: 'Aprobado',data: listNumAprobadosAux,color: '#5dcd5d'},
	    {name: 'Desaprobado',data: listNumDesaprobadosAux,color: '#D8D808'},
	    {name: 'Pendiente',data: listNumPendientesAux,color: '#ff7474'}]
      });	   
   });
}

function volverResumenCapacitacion(){
   $("#modalConsolidadoHistorialCorreoCap").modal("hide");$("#modalResumenTrabCapacitacion").modal("show");
}

function verHistoriaCorreoCapacitacion(){
   $("#modalResumenTrabCapacitacion").modal("hide");$("#modalConsolidadoHistorialCorreoCap").remove();
    
   var contenido = "";
    
   var buttonVolver =
      "<button type='button' id='btnVolverCapacitacion' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverResumenCapacitacion()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var modalOptions={
      maxWidth:"50%",id:"modalConsolidadoHistorialCorreoCap",
      nombre:"<i class='fa fa-table'></i> Historial de correos",
      contenido: 
 	 buttonVolver +
         "<div class='wrapper' id='wrapperHistorialCorreoCap'>" +
            "<table id='tblHistorialCorreoCap' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 	             "<td class='tb-acc' style='width:100px'>N° Orden</td>" +
 		     "<td class='tb-acc' style='width:300px'>Correo</td>" +
 		     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperHistorialCorreoCap",190);    
    
   var dataParam={
      capacitacionId: capacitacionId
   }; 
    
   callAjaxPost(URL+"/capacitacion/historial_correo",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
 	 var listHistorialCorreo = data.listHistorialCorreo;
 	 
 	 $("#tblHistorialCorreoCap tbody tr").remove();
 	 
 	 listHistorialCorreo.forEach(function(val,index){
 	    $("#tblHistorialCorreoCap tbody").append(
 	       "<tr id='fcorreo"+val.id+"'>" +
 	          "<td>"+(index+1)+"</td>" +
 		  "<td>"+val.correo+"</td>" +
 		  "<td>"+val.fechaRegistroTexto+"</td>" +
               "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblHistorialCorreoCap","#wrapperHistorialCorreoCap");
   });
}
