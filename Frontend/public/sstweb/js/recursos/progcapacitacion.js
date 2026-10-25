var programacionCapId;
var fechaPla;
var fechaReal;
var responsable;
var banderaEdicion2;
var listTrabajadoresPlanisSelecccionados;
var listTrabajadoresPlanis;
var listTrabajadoresAsistSelecccionados;
var listTrabajadoresAsist;
var progCapEstado;
var progCapEstadoNombre;
var listaFullProgCap;
var listEvaluacion;
var listNotas;
var numPaginaActual;
var numPaginaTotal;
var trabajadoresSugeridos;
var listaTrabs;

var mensajeUx;

var listTrabajadores;var contadorListTrab;

$(function(){
	$("#btnClipboardEvalsForm").on("click",function(){
		var textoTabla="Trabajador\tResultado\tDetalle\n";
		$("#tblEval tbody tr").each(function(ind,elem){
			 $(this).children("td").each(function (index2,elem2){
				 switch(index2){
				 case 0:
					 textoTabla+=$(elem2).text()+"\t";
					 console.log(textoTabla);
					 break;
				 case 1:
					 textoTabla+=$(elem2).find("select option:selected").text()+"\t";
					 break;
				 case 2:
					 textoTabla+=$(elem2).find("input").val()+"\n";
					 break;
				 }
			 });
		});
		 copiarAlPortapapeles(textoTabla,"btnClipboardEvalsForm");
			alert("Se ha guardado al clipboard la tabla" );

	});
	$('#modalEvaluacion').on('hidden.bs.modal', function(e) {
		
		$('#mdProgFecha').modal({
			  keyboard: true,
			  show:true,"backdrop":"static"
			});
		
	});
	$('#buscadorTrabajadorInput').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
	$('#buscadorTrabajadorInput').bind("enterKey",function(e){
		cargarModalProgCap();
		});
	$("#buscadorTrabajadorInput").focus();
	$("#btnUploadEvaluacionNormal").on("click",function(){
		$("#divEvalNormal").show();
		$("#divImportarEval").hide();
	});
	
	$("#btnUploadEvaluacion").on("click",function(){
		$("#divImportarEval").show();
		$("#divEvalNormal").hide();
	});
	$("#btnGuardarImportEvals").on("click",function(){
		guardarMasivoEvaluacionesExcel();
	});
	$("#resetBuscador").attr("onclick","resetBuscador()")
	
	$("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
	$("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(2)");
	
   $('.izquierda_flecha').on('click',function(){
      numPaginaActual = numPaginaActual-1;
      cambiarPaginaTabla();
   });
	
   $('.derecha_flecha').on('click',function(){
      numPaginaActual = numPaginaActual+1;
      cambiarPaginaTabla();
   });
	
   $("#listTrabBuscar").hide();
   $("#listTrabAsistBuscar").hide();
   $("#btnGuardarEval").attr("onclick","guardarEvaluacionFormacion(1)"); 	
   $("#btnCancelarEval").attr("onclick","cancelarEvaluaciones()");
	
	$("#btnClipTablaProgramacion").on("click",function(){
		var listFullTablaProgramacion="";
		listFullTablaProgramacion="Fecha Planificada" +"\t"
		+"Fecha Realizada" +"\t"
		+"Inversión" +"\t"
		+"Trabajadores Planificados" +"\t"
		+"Trabajadores que asistieron" +"\t"
		+"Trabajadores aprobados" +"\t"
		+"Trabajadores  no aprobados" +"\t"
		+"Trabajadores  no evaluados" +"\t"

		+"Evidencia" +"\t"+" \n";
		for (var index = 0; index < listaFullProgCap.length; index++){
			
		
			listFullTablaProgramacion=listFullTablaProgramacion
			+listaFullProgCap[index].fechaPlaTexto+"\t"
			+listaFullProgCap[index].fechaRealTexto+"\t"
			+listaFullProgCap[index].inversionProgramacionCap+"\t"
			+listaFullProgCap[index].numeroPlanificado+"\t"
			+listaFullProgCap[index].numeroAsistentes +"\t"
			+listaFullProgCap[index].numeroAprobado+"\t"
			+(listaFullProgCap[index].numeroAsistentes-listaFullProgCap[index].numeroAprobado)+"\t"
			+(listaFullProgCap[index].numeroAsistentes-listaFullProgCap[index].numeroEvaluado)+"\t"

			+(listaFullProgCap[index].evidenciaNombre=="----"?"NO":"SI") +"\t"
			+"\n";
		
		

		}
		 copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaProgramacion");
		
		alert("Se han guardado al clipboard la tabla de este módulo" );

	}); 
})
function obtenerListaNombresTrabajador(){
	copiarAlPortapapeles(listTrabajadores,"btnSelectTrabs");
	
	 
	alert("Se han guardado al clipboard " + contadorListTrab
			+ " trabajador(es)");
}
function toggleBuscadorJstree(idToggle){
	$("#buscarTrabJstree").hide();
	
	if(idToggle==1){
	$("#buscarTrabJstree").show();
	$("#listTrabBuscar").hide();
	$("#cambiarBuscador").html(
		"	<i class='fa fa-arrow-circle-down ' ></i>	"
	);
	$("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
	$("#resultSearchTrab").hide();
	}else{
		$("#buscarTrabJstree").hide();
		$("#listTrabBuscar").show();
		$("#cambiarBuscador").html(
			"	<i class='fa fa-arrow-circle-up ' ></i>	"
		);
		$("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(1)");
		$("#resultSearchTrab").show();
		
	}
}
function toggleBuscadorAsistJstree(idToggle){
$("#buscarTrabAsisJstree").hide();
	
	if(idToggle==1){
	$("#buscarTrabAsisJstree").show();
	$("#listTrabAsistBuscar").hide();
	$("#cambiarBuscadorAsist").html(
		"	<i class='fa fa-arrow-circle-down ' ></i>	"
	);
	$("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(2)");
	$("#resultSearchTrabAsist").hide();
	}else{
		$("#buscarTrabAsisJstree").hide();
		$("#listTrabAsistBuscar").show();
		$("#cambiarBuscadorAsist").html(
			"	<i class='fa fa-arrow-circle-up ' ></i>	"
		);
		$("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(1)");
		$("#resultSearchTrabAsist").show();
		
	}
	
}

function resetBuscador(){
   $("#buscadorTrabajadorInput").val("");

   cargarModalProgCap();
}

function programarFecha(){
   numPaginaActual = 1;
	
   cargarModalProgCap(); 
	
   $('#mdProgFecha').modal({
      keyboard: true,show: true,"backdrop": "static"
   });
}

function cargarModalProgCap(){
   $('#modalCorreos').on('hidden.bs.modal',function(e){
      $("#mdProgFecha").modal({
         keyboard: true,show: true,"backdrop": "static"
      });
   });
	
   var palabraClave = $("#buscadorTrabajadorInput").val();
   
   palabraClave = (palabraClave.length == 0?null:("%"+palabraClave+"%").toUpperCase());
	
   $("#btnAgregarProg").attr("onclick","javascript:nuevoProgCap();");$("#btnCancelarProg").attr("onclick","javascript:cancelarProgCap();");
   $("#btnGuardarProg").attr("onclick","javascript:guardarProgCap();");$("#btnEliminarProg").attr("onclick","javascript:eliminarProgCap();");
   $("#btnEvaluar").attr("onclick","javascript:verEvaluacionFormacion();");$("#btnGenReporte").attr("onclick","javascript:generarHojaRutaForm();");
   $("#btnVerCorreos").attr("onclick","javascript:verCorreos();");
	
   $("#btnCancelarProg").hide();$("#btnAgregarProg").show();$("#btnEliminarProg").hide();
   $("#btnEvaluar").hide();$("#btnGuardarProg").hide();$("#btnGenReporte").hide();
   $("#btnVerCorreos").hide();$("#modalProg").show();$("#modalTree").hide();
   $("#modalTreeAsist").hide();$("#modalUpload").hide();$("#btnClipTablaProgramacion").show();
   $("#btnSmartUploadCapacitacion").show();$("#btnGenReporteExcelEval").hide();

   programacionCapId = 0;listTrabajadoresPlanisSelecccionados = null;
   listTrabajadoresAsistSelecccionados = null;fechaPla = null;fechaReal = null;
   banderaEdicion2 = false;listaFullProgCap = [];listEvaluacion = [];
	
   var dataParam={
      empresaId: getSession("gestopcompanyid"),capacitacionId: capacitacionId,palabraClave: palabraClave
   };
	
   callAjaxPost(URL+'/capacitacion/programacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var list = data.list;
	    listaFullProgCap = data.list;
	    trabajadoresSugeridos = data.trabajadores;
			 
	    agruparRegistrosTabla();
			
	    if(getSession("linkCalendarioProgCapId") != null){
	       var indexIpercAux = 0;
	       
	       listaFullProgCap.every(function(val,index3){
		  if(val.programacionCapId == parseInt(getSession("linkCalendarioProgCapId"))){
		     numPaginaActual = Math.ceil((index3+1)/(10));
		     cambiarPaginaTabla();
		     editarProgCap(index3);
		     sessionStorage.removeItem("linkCalendarioProgCapId");
			
		     return false;
		  }else{
		     return true;
		  }
	       });
	    }
			
	    formatoCeldaSombreableTabla(true,"tblProg");
			
	    break;
		
         default:
	    alert("Ocurrió un error al traer las programaciones!");
      }
   });
}

function editarProgCap(pindex){
   if(!banderaEdicion2){
		listTrabajadoresPlanis = [];
		listTrabajadoresPlanisSelecccionados = [];
		listTrabajadoresAsist = [];
		listTrabajadoresAsistSelecccionados = [];
		programacionCapId = listaFullProgCap[pindex].programacionCapId;
		fechaPla = listaFullProgCap[pindex].fechaPlanificada;
		fechaReal = listaFullProgCap[pindex].fechaRealizada;
		responsable=listaFullProgCap[pindex].responsable;
		
      $("#tr"+programacionCapId).addClass("fila-edicion");
		
		var correTrabajadores=listaFullProgCap[pindex].correoTrabajadores;
		var numTrabajadores=listaFullProgCap[pindex].numeroPlanificado;
		var inversionProgCap=listaFullProgCap[pindex].inversionProgramacionCap;
		var horaPlanificada=listaFullProgCap[pindex].horaPlanificada;
		$("#modalBodyCorreos").html("<p style='color:#008b8b'>Número de Trabajadores: </p>"+numTrabajadores+"<br>" +
				"<p style='color:#008b8b'>Correos: </p>"+correTrabajadores);
		formatoCeldaSombreableTabla(false,"tblProg");
		$("#btnVerCorreos").show();
		$("#tdtrabplani" + programacionCapId)
				.html(
						"<a id='linkTrabPlani' href='#' onclick='javascript:cargarTrabajadoresPlanis();'>Trabajadores planificados</a>");

		$("#tdtrabreal" + programacionCapId)
				.html(
						"<a id='linkTrabReal' href='#' onclick='javascript:cargarTrabajadoresAsist();'>Trabajadores que asistieron</a>");
		var nombreEvidencia=$("#tdevi" + programacionCapId)
		.text();
		$("#tdevi" + programacionCapId)
		.html(
				"<a id='linkEvidencia' " +
				"href='"+URL 
				+ "/capacitacion/programacion/evidencia?programacionCapId="+programacionCapId+"' target='_blank' >" +
				nombreEvidencia+	"</a><br/>" +
				"<a id='linkEvidencia' href='#' onclick='javascript:editarEvidencia();'>Subir</a>");

		$("#tdfechpla" + programacionCapId).html(
				"<input type='date' id='inputFecPla' onchange=' hallarEstadoImplementacion("+programacionCapId+")' class='form-control'>");
		 

		trabajadoresSugeridos.forEach(function(val){
			val.selected = 0;
			if(val.trabajadorId == listaFullProgCap[pindex].responsableId){
				val.selected = 1;
			}
		});
		crearSelectOneMenuObligUnitarioCompleto("inputResp", "", trabajadoresSugeridos, "trabajadorId",
				"nombreCompleto","#tdresp"+programacionCapId,"---");
		
		var today =convertirFechaInput(fechaPla);
		$("#inputFecPla").val(today);

		$("#tdtdfechreal" + programacionCapId).html(
				"<input type='date' id='inputFecReal' " +
				"onchange='hallarEstadoImplementacion("+programacionCapId+")' class='form-control'>");
		$("#tdhorapla" + programacionCapId)
		.html("<input type='time' id='inputHoraPla'  class='form-control'>");
		$("#inputHoraPla").val(horaPlanificada);

		$("#tddescev" + programacionCapId)
		.html("<input type='text' id='inputDescProgramacion'  class='form-control'>");
		$("#inputDescProgramacion").val(listaFullProgCap[pindex].descripcion);
		$("#tdtiempoev" + programacionCapId)
		.html("<input type='number' id='inputTiempoProgramacion'  class='form-control'>");
		$("#inputTiempoProgramacion").val(listaFullProgCap[pindex].tiempoSolucion);
		
		$("#tdinversion" + programacionCapId).html(
				"<label for='inputInversion' style='float:left'>S/</label> " +
				"<input type='number' style='width:80%' id='inputInversion' name='inputInversion'" +
				"class='form-control' value='"+inversionProgCap+"'>");
	
		var today2 = convertirFechaInput(fechaReal);
		$("#inputFecReal").val(today2);
		
	
		
		hallarEstadoImplementacion(programacionCapId);
		
		banderaEdicion2 = true;
		
   $("#btnCancelarProg").show();$("#btnAgregarProg").hide();$("#btnEliminarProg").show();
   $("#btnGenReporte").show();$("#btnClipTablaProgramacion").hide();$("#btnSmartUploadCapacitacion").hide();$("#btnGenReporteExcelEval").show();
		
		cargarTrabajadoresPlanis();
		cargarTrabajadoresAsist();
		
		$("#btnEvaluar").show();
		$("#modalProg").show();
		$("#modalTree").hide();
		$("#modalTreeAsist").hide();
		$("#modalUpload").hide();
	}
}

function nuevoProgCap() {
	if (!banderaEdicion2) {
		programacionCapId = 0;
		$("#tblProg tbody").prepend(
			"<tr id='tr0'>"
			
			+"<td id='tdresp0'>" +"</td>"
			+ "<td><input  id='inputDescProgramacion'    class='form-control'></td>"
			+ "<td><input type='number'  id='inputTiempoProgramacion'    class='form-control'></td>"
			+ "<td><input type='date' id='inputFecPla' onchange='hallarEstadoImplementacion("+programacionCapId+")' class='form-control'></td>"
			+"<td>"
			+"<input type='time' value='12:00:00' id='inputHoraPla' " +
			" class='form-control'>"
			+"</td>"
			+ "<td><input type='date' id='inputFecReal' onchange='hallarEstadoImplementacion("+programacionCapId+")' class='form-control'></td>"
			+ "<td>" 
			+"<label for='inputInversion'>S/</label><input type='number' id='inputInversion' name='inputInversion' " 
			+"class='form-control'>"
			+	"</td>"
			+ "<td>...</td>"
			+ "<td>...</td>"
			+ "<td>...</td>"	+ "<td>...</td>"
			+"<td id='estadoControl0'>"
			+"</td>"
		+ "</tr>");
		trabajadoresSugeridos.forEach(function(val){
			val.selected = 0;
		});
		crearSelectOneMenuObligUnitarioCompleto("inputResp", "", trabajadoresSugeridos, "trabajadorId",
				"nombreCompleto","#tdresp"+programacionCapId,"---");
		formatoCeldaSombreableTabla(false,"tblProg");
		
      $("#btnCancelarProg").show();$("#btnAgregarProg").hide();$("#btnEliminarProg").hide();
      $("#btnGuardarProg").show();$("#btnGenReporte").hide();$("#btnClipTablaProgramacion").hide();
      $("#btnSmartUploadCapacitacion").hide();$("#btnGenReporteExcelEval").hide();
   
      banderaEdicion2 = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarProgCap() {
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
		cargarModalProgCap();
}

function eliminarProgCap() {
	var r = confirm("¿Está seguro de eliminar la programacion?");
	if (r == true) {
		var dataParam = {
				programacionCapId : programacionCapId,
		};

		callAjaxPost(URL + '/capacitacion/programacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalProgCap();
						break;
					default:
						alert("Hay registro de trabajadores asociados");
					}
				});
	}
}

function guardarProgCap() {
    
	$("#modalProg button:not(#btnClipTablaProgramacion)").hide();
	
	var campoVacio = true;
	var responsableProg=$("#inputResp").val();
        var inversion=$("#inputInversion").val(); 
	var inputFecPla = convertirFechaTexto($("#inputFecPla").val() );
	var inputFecReal =  convertirFechaTexto($("#inputFecReal").val() );
        var horaPlan=$("#inputHoraPla").val();
        var descripcion = $("#inputDescProgramacion").val();
        var tiempoSolucion = $("#inputTiempoProgramacion").val();
        
        if(!$("#inputHoraPla").val()){
	   horaPlan=null;
        }
        
        var r=true;
        var trabEncontrados=0;
        
        for(index=0;index<listEvaluacion.length;index++){
	    for(index1=0;index1<listTrabajadoresAsistSelecccionados.length;index1++){
		if(listEvaluacion[index].trabId==listTrabajadoresAsistSelecccionados[index1]){
		   trabEncontrados=trabEncontrados+1;
		   index1=listTrabajadoresAsistSelecccionados.length;
		}
	    }
         }
        
        if(programacionCapId>0){
	   var numAsist=listTrabajadoresAsistSelecccionados.length ;
	   var programacionCapIdAux=programacionCapId;
	   
	   if(trabEncontrados==listTrabajadoresAsistSelecccionados.length 
			&& listTrabajadoresAsistSelecccionados.length==listEvaluacion.length){
		r=true;
	   }else{
		r = confirm("La lista de trabajadores asistidos se ha modificado, tendrá que evaluar nuevamente los trabajadores, ¿desea continuar?");

	   }
        }

	if(r){
	   if(campoVacio) {

	      var dataParam = {
		      programacionCapId : programacionCapId,
		      tiempoSolucion : tiempoSolucion,
		      descripcion : descripcion,
		      fechaPlanificada : inputFecPla,
		      fechaRealizada : inputFecReal,	
		      responsableId:responsableProg,
		      responsable : "",
		      inversionProgramacionCap:inversion,
		      capacitacionId : capacitacionId,
		      horaPlanificada:horaPlan,
		      capacitacionNombre : $("#inputCap").val(),
		      trabajadoresPlanificados:( listTrabajadoresPlanisSelecccionados==null?[]:listTrabajadoresPlanisSelecccionados),
		      trabajadoresAsistidos: listTrabajadoresAsistSelecccionados,
		      progCapEstado:progCapEstado,
		      idCompany : getSession("gestopcompanyid")
	       };

	 callAjaxPost(URL + '/capacitacion/programacion/save', dataParam,
		      function(data) {
			 switch(data.CODE_RESPONSE) {
			    case "05":
			    if(programacionCapIdAux>0 && listTrabajadoresAsistSelecccionados!=null){
			       if(trabEncontrados==listTrabajadoresAsistSelecccionados.length 
			          && listTrabajadoresAsistSelecccionados.length==listEvaluacion.length){	
				  guardarEvaluacionFormacion(1);return;				 
				}
			    }else{
				  cargarModalProgCap();return;
			    }
			    cargarModalProgCap();
			    break;
						
			    default:
			    console.log("Ocurrió un error al guardar la programacion!");
			   }
			});
		}else {
			alert("Debe ingresar todos los campos.");
		}
	}
	
}
function smartSelectJsTree(){

	var dataParamAux={capacitacionId:capacitacionId};
	callAjaxPostNoLoad(
			URL + '/capacitacion/trabajador/formacion',
			dataParamAux,function(data){
				if(data.CODE_RESPONSE=="05"){
					var trabajadoresAsignados=data.trabajadoresAsignados;
					for(index=0;index<trabajadoresAsignados.length;index++){
						if(trabajadoresAsignados[index].estadoPlanificacion!=1){
						 $("#jstree ul a#tra"+trabajadoresAsignados[index].trabajadorId+"_anchor").css({"color":"blue","font-weight":"900"})
						 $("#jstree ul a#pto"+trabajadoresAsignados[index].puestoId+"_anchor").css({"color":"blue","font-weight":"900"})
						 $("#jstree ul a#are"+trabajadoresAsignados[index].areaId+"_anchor").css({"color":"blue","font-weight":"900"});
						 $("#jstree ul a#mdf"+trabajadoresAsignados[index].unidadId+"_anchor").css({"color":"blue","font-weight":"900"})
									
						}
					}}});
}
function cargarTrabajadoresPlanis() {
	$("#modalProg").hide();
	$("#modalTree").show();
	$("#modalTreeAsist").hide();
	$("#modalUpload").hide();
	var buttonGuardar="<button id='btnGuardarShortcut' type='button' class='btn btn-success'"
		+"title='Guardar' style='margin-left:2px'>"
	+"	<i class='fa fa-floppy-o fa-2x'></i>"
	+"</button>";
	$("#modalTree #btnGuardarShortcut").remove();
	$("#modalTree #btnCancelarTrabs").after(buttonGuardar);
	$("#modalTree #btnGuardarShortcut").on("click",function(){
		cancelarSeleccionarTrabs();
		guardarProgCap();
	});
	if (listTrabajadoresPlanisSelecccionados.length === 0) {
var fechaAux=$("#inputFecPla").val();
var fechaRealAux=$("#inputFecReal").val();
		var dataParam = {
			programacionCapId : programacionCapId,
			fechaPlaTexto:fechaAux,
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(
				URL + '/capacitacion/programacion/trabajadores',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						$('#jstree').jstree("destroy");
						
						listTrabajadoresPlanis = data.list;
						$('#jstree').jstree({
							"plugins" : [ "checkbox", "json_data" , "search" ],
							'checkbox' : {
								"keep_selected_style" : false,
								"tie_selection" : false
							},
							'core' : {
								'data' : listTrabajadoresPlanis
							}
						});
						
					//Inicio Para Buscador en jstree
						  var to = false;
						  $('#buscarTrabJstree').keyup(function () {
						    if(to) { clearTimeout(to); }
						    to = setTimeout(function () {
						      var v = $('#buscarTrabJstree').val();
						  $("#jstree").jstree(true).search(v);
						    
						    }, 250);
						  });
						  $.jstree.defaults.search.show_only_matches=true;
						 
						  $('#listTrabBuscar').keyup(function () {
							    if(to) { clearTimeout(to); }
							    to = setTimeout(function () {
							
							    	busquedaMasivaJstree(listTrabajadoresPlanis,"jstree","resultSearchTrab",
							    			"listTrabBuscar");
							    	
							    }, 250);
							  });
						//Fin Para Buscador en jstree
						  

						for (index = 0; index < listTrabajadoresPlanis.length; index++) {
							if (listTrabajadoresPlanis[index].state.checked
									&& listTrabajadoresPlanis[index].id.substr(
											0, 3) == "tra") {
								listTrabajadoresPlanisSelecccionados
										.push(listTrabajadoresPlanis[index].id
												.substr(
														3,
														listTrabajadoresPlanis[index].id.length));
							}
						}
						break;
					default:
						alert("Ocurrió un error al cargar el arbol de trabajadores!");
					}
				});
	}else{
		
	}

}
 
function cargarTrabajadoresAsist(){
   var buttonGuardar =
      "<button id='btnGuardarShortcut' type='button' class='btn btn-success' " +
              "title='Guardar' style='margin-left:2px'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   $("#modalTreeAsist #btnGuardarShortcut").remove();
   $("#modalTreeAsist #btnCancelarTrabs").after(buttonGuardar);
   
   $("#modalTreeAsist #btnGuardarShortcut").on("click",function(){
      cancelarSeleccionarTrabs();
      guardarProgCap();
   });
	
   if(listTrabajadoresAsistSelecccionados.length > 0){
      var r = confirm("Si modifica los trabajadores, tendrá que evaluarlos nuevamente,¿desea continuar?");
      
      if(r == true){
	 $("#modalProg").hide();$("#modalTree").hide();
	 $("#modalTreeAsist").show();$("#modalUpload").hide();
      }else{
	 return;
      }
   }
   
   if(listTrabajadoresAsistSelecccionados.length == 0){
      $("#modalProg").hide();$("#modalTree").hide();
      $("#modalTreeAsist").show();$("#modalUpload").hide();
	
      var fechaRealAux = $("#inputFecReal").val();
	
      if(fechaRealAux == ""){
	 fechaRealAux = null;
      }
		
      var dataParam={
	 programacionCapId: programacionCapId,
	 fechaRealTexto: fechaRealAux,
	 idCompany: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/capacitacion/programacion/trabajadores/asistidos',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $('#jstreeAsist').jstree("destroy");

	       listTrabajadoresAsist = data.list;
	       listEvaluacion = data.listEvaluacion;
	       listNotas = data.listNotas;
			
	       $("#tblEval tbody tr").remove();
			
	       var selectNota= crearSelectOneMenu("selectNota","",
		  listNotas,"1","id","nombre");
	       listTrabajadores = "";
	       contadorListTrab = 0;
			
	       for(index = 0;index < listEvaluacion.length;index++){
	          listTrabajadores = listTrabajadores+listEvaluacion[index].trabNombre+"\n";
	          contadorListTrab = contadorListTrab+1;
						
	          var trabId = listEvaluacion[index].trabId;
	          var trabNombre = listEvaluacion[index].trabNombre;
	          var comentario = "<input id='comentario"+trabId+"' class='form-control'>";
	          var tipoNota = listEvaluacion[index].tipoNota.id;
						
	          $("#tblEval tbody").append(
		     "<tr>" +
		        "<td>"+trabNombre+"</td>" +
			"<td>"+selectNota+"</td>" +
			"<td>"+comentario+"</td>" +
		     "</tr>");
			    
	          $("#comentario"+trabId).val(listEvaluacion[index].comentario);
	          $("#selectNota").attr("id","selectNota"+trabId);
	          $("#selectNota"+trabId).val(tipoNota);
	       }				
	       ///////
	       $('#jstreeAsist').jstree({
	          "plugins": ["checkbox","json_data","search"],
		  'checkbox': {
		     "keep_selected_style" : false,
		     "tie_selection" : false
		  },
		  'core': {
		     'data': listTrabajadoresAsist
		  }
	       });
		        
	       //Inicio Para Buscador en jstree							  
	       var to = false;
			
	       $('#buscarTrabAsisJstree').keyup(function(){
	          if(to){ 
		     clearTimeout(to); 
	          }
			    
	          to = setTimeout(function(){
		     var v = $('#buscarTrabAsisJstree').val();
						 
		     $('#jstreeAsist').jstree(true).search(v);
	          },250);
	       });
						  
	       $('#listTrabAsistBuscar').keyup(function (){
	          if(to){ 
		     clearTimeout(to);
	          }
							    
	          to = setTimeout(function(){
	                  busquedaMasivaJstreeException(listTrabajadoresAsist,"jstreeAsist","resultSearchTrabAsist",
			     "listTrabAsistBuscar",null,listTrabajadoresPlanisSelecccionados)
		       }, 250);
	       });
						  			
	       $.jstree.defaults.search.show_only_matches = true;
			 
	       //Fin Para Buscador en jstree
	       for(index = 0;index < listTrabajadoresAsist.length;index++){
		  if(listTrabajadoresAsist[index].state.checked && listTrabajadoresAsist[index].id.substr(0,3) == "tra"){
		     listTrabajadoresAsistSelecccionados.push(listTrabajadoresAsist[index].id
		     .substr(3,listTrabajadoresAsist[index].id.length));
		  }
	       }
						
	       $("#btnGuardarProg").show();
			 
	       break;
			 
	    default:
	       alert("Ocurrió un error al cargar el arbol de trabajadores!");
         }
      });
   }
}

function cancelarSeleccionarTrabs() {
	agregarSeleccionarTrabs();
	agregarSeleccionarTrabsAsist();
	$("#modalProg").show();
	$("#modalTree").hide();
	$("#modalTreeAsist").hide();
	$("#modalUpload").hide();
}


function agregarSeleccionarTrabs() {
	var seleccionados = $('#jstree').jstree(true).get_checked();
	listTrabajadoresPlanisSelecccionados = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0,3) == "tra") {
			listTrabajadoresPlanisSelecccionados.push(seleccionados[index]
					.substr(3, seleccionados[index].length));
		}
	}

	$("#modalProg").show();
	$("#modalTree").hide();
	$("#modalTreeAsist").hide();
	$("#modalUpload").hide();
}

function agregarSeleccionarTrabsAsist() {
	var seleccionados = $('#jstreeAsist').jstree(true).get_checked();
	listTrabajadoresAsistSelecccionados = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0, 3) == "tra") {
			listTrabajadoresAsistSelecccionados.push(seleccionados[index]
					.substr(3, seleccionados[index].length));
		}
	}

	$("#modalProg").show();
	$("#modalTree").hide();
	$("#modalTreeAsist").hide();
	$("#modalUpload").hide();
}

function cancelarUploadEvidencia() {
	$("#modalProg").show();
	$("#modalTree").hide();
	$("#modalTreeAsist").hide();
	$("#modalUpload").hide();
}

function editarEvidencia(){
	$("#modalProg").hide();
	$("#modalTree").hide();
	$("#modalTreeAsist").hide();
	$("#modalUpload").show();
}

function uploadEvidencia(){
	$.blockUI({
		message : 'cargando...'
	});
	guardarEvidenciaAuto(programacionCapId,"fileEvi",bitsEvidenciaFormacion,
			"/capacitacion/programacion/evidencia/save",function(){
		var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		$("#tdevi"+programacionCapId).html(file.name);
		$.unblockUI();
		$("#modalProg").show();
		$("#modalTree").hide();
		$("#modalUpload").hide();
	},"programacionCapId");
  
		
}

function generarHojaRutaForm(){
   window.open(URL+"/capacitacion/informe?progcapacitacionId="+programacionCapId,'_blank');	
}


function hallarEstadoImplementacion(progId){
	var fechaPlanificada=$("#inputFecPla").val();
	var fechaReal=$("#inputFecReal").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		progCapEstado=2;
		progCapEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				progCapEstado=3;
				progCapEstadoNombre="Retrasado";
			}else{
				progCapEstado=1;
				progCapEstadoNombre="Por implementar";
			}
			
		}else{
			
			progCapEstado=1;
			progCapEstadoNombre="Por implementar";
			
		}
	}
	
	$("#estadoControl"+progId).html(progCapEstadoNombre);
	
}


function verCorreos(){
	
	$("#modalCorreos").modal("show");
	$("#mdProgFecha").modal("hide");
	
}

function agruparRegistrosTabla(){
   cambiarPaginaTabla();
	
   $('.izquierda_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });

   $('.derecha_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });	
}

function cambiarPaginaTabla(){
   $('.izquierda_flecha').show();$('.derecha_flecha').show(); 
   	
   var list = listaFullProgCap;
   var totalSize = list.length;
   var partialSize = 10;
	
   numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
   var finRegistro = (numPaginaActual*partialSize)-1;
	
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
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblProg tbody tr").remove();
	
   list.forEach(function(val,index){
      if(inicioRegistro <= index && index <= finRegistro){
         $("#tblProg tbody").append(
	    "<tr id='tr"+val.programacionCapId+"' onclick='javascript:editarProgCap("+index+")'>" + 
	       "<td id='tdresp"+val.programacionCapId+"'>"+val.responsable+"</td>" +
	       "<td id='tddescev"+val.programacionCapId+"'>"+val.descripcion+"</td>" +
	       "<td id='tdtiempoev"+val.programacionCapId+"'>"+val.tiempoSolucion+"</td>" +
	       "<td id='tdfechpla"+val.programacionCapId+"'>"+val.fechaPlaTexto+"</td>" +
	       "<td id='tdhorapla"+val.programacionCapId+"'>"+val.horaPlanificadaTexto+"</td>" +
	       "<td id='tdtdfechreal"+val.programacionCapId+"'>"+val.fechaRealTexto+"</td>" +
	       "<td id='tdinversion"+val.programacionCapId+"'>S/ "+val.inversionProgramacionCap+"</td>" +
	       "<td id='tdtrabplani"+val.programacionCapId+"'>"+val.numeroPlanificado+"</td>" +
	       "<td id='tdtrabreal"+val.programacionCapId+"'>"+val.numeroAsistentes+"</td>" +
	       "<td id='tdtrabeval"+val.programacionCapId+"'>"+val.numeroAprobado+"/"+val.numeroEvaluado+"</td>" +
	       "<td id='tdevi"+val.programacionCapId+"'>"+val.evidenciaNombre+"</td>" +
	       "<td id='estadoControl"+val.programacionCapId+"'>"+val.progCapEstadoNombre+"</td>" +				
	    "</tr>");
      }
   });
}

function verEvaluacionFormacion(){
   $("#modalEvaluacion").modal({
      keyboard: true,show: true,
      "backdrop":"static"
   });
	
   $("#mdProgFecha").modal("hide");
   $("#divEvalNormal").show();$("#divImportarEval").hide();
}

function guardarEvaluacionFormacion(idFinal){
	var listaEvaluacionTrabs=[];
	for(index=0;index<listEvaluacion.length;index++){
		var trabId=listEvaluacion[index].trabId;
				
		var comentario=$("#comentario"+trabId).val();
		var tipoNotaId=$("#selectNota"+trabId).val();
		
		listaEvaluacionTrabs.push({
			trabId:trabId,
			comentario:comentario,
			tipoNota:{id:tipoNotaId},
			progCapId:programacionCapId
		});
		
		
	}
	
	var dataParam={
			programacionCapId:programacionCapId,
			trabajadoresEvaluacion:listaEvaluacionTrabs
	}
	
	callAjaxPost(URL + '/capacitacion/programacion/evaluacion/save', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			$("#modalEvaluacion").modal("hide");
if(idFinal==1){
	cargarModalProgCap();
}
	

			break;
		default:
			alert("Ocurrió un error al traer la sugerencia!");
		}
	});
	
}

function cancelarEvaluaciones(){
	guardarEvaluacionFormacion();
}



function guardarMasivoEvaluacionesExcel() {
	var texto = $("#txtListadoEval").val();
	var listExcel = [];
	var listExcelInicial=texto.split('\n');
	var listEvaluaciones = [];
	var listTrabRepe = [];
	var listFullNombres = "";
	var validado = "";
	listExcelInicial.forEach(function(val){
		if (val.length > 0){
			listExcel.push(val);
		}
	})
	if (texto.length < 100000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			 

			if (validado.length < 1 && listCells.length != 3) {
				validado = "No coincide el numero de celdas. ("
						+ listCells.length+"!=3 )";
				break;
			} else {
				var evals = {};
				var tipo={}
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						var trabId=0;var seguirBusqueda=true;
						listEvaluacion.every(function(val,index2){
							if(val.trabNombre.trim()==element.trim() 
									|| val.trabDni.trim() == element.trim()){
								 trabId=val.trabId;
									evals.trabId =parseInt(trabId);
									seguirBusqueda= false;
							};
							if (!seguirBusqueda)
							{  return false}
							else {return true};
							
						});
						
						
						
						if ($.inArray(element.trim(), listTrabRepe) === -1) {
							listTrabRepe.push(element.trim());
						} else {
							listFullNombres = listFullNombres + element.trim() + ", ";
						}
						if(evals.trabId > 0){
							
						}else{
							validado = "Trabajador/DNI "+element.trim()+" no reconocido";
							break;
						}
					}
					
					if (j === 1) {
						for (var k = 0; k < listNotas.length; k++) {
							if (listNotas[k].nombre == element.trim()) {
								tipo.id= listNotas[k].id;
								evals.tipoNota=tipo;
							}
						}
						
						if (!evals.tipoNota) {
							validado = "Tipo de Resultado" +
									" no reconocido.";
							break;
						}
					}
					if (j === 2) {
						evals.comentario = element.trim();
					}
					
					evals.progCapId=programacionCapId
				}
				
				listEvaluaciones.push(evals);
				if (listTrabRepe.length < listEvaluaciones.length) {
					validado = "Existen trabajadores repetidos repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 20000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			console.log(listEvaluaciones);
			var listIds=listarStringsDesdeArray(listEvaluaciones,"trabId");
			var listEvalAux=listEvaluacion.filter(function(val){
				if(listIds.indexOf(val.trabId)==-1){
					val.progCapId=programacionCapId;
					return val;
				}
					
			});
			var listEvalAux2=listEvalAux.concat(listEvaluaciones);
			var dataParam={
					programacionCapId:programacionCapId,
					trabajadoresEvaluacion:listEvalAux2
			};
			console.log(listEvalAux2);
			callAjaxPost(URL + '/capacitacion/programacion/evaluacion/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
					alert("Evaluaciones guardadas");
					$("#modalEvaluacion").modal("hide");
					cargarModalProgCap();
					break;
				default:
					alert("Ocurrió un error al guardar las evaluaiones!");
				}
			});
		}
	} else {
		alert(validado);
	}
}

function ocultarSmartImportProgCapacitacion(){
   $("#divImportProgCapacitacion").modal("hide");
   $('#mdProgFecha').modal("show");
}

function verSmartImportProgCapacitacion(){
   $('#mdProgFecha').modal("hide");$("#divImportProgCapacitacion").remove();
    
   var modeloDescarga = 
      "<a class='efectoLink' href='"+URL+"/capacitacion/programacion/import/plantilla' " +
         "target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<i class='fa fa-download'></i> Plantilla Excel:",inputForm:modeloDescarga},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha",
       inputForm:"<input type='date' id='fechaProgCapacitacionImport' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora",
       inputForm:"<input type='time' id='horaProgCapacitacionImport' class='form-control'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"<label>*Buscar trabajador por DNI y/o nombre (debe ingresar 3 caracteres como mínimo).</label>",
       anchoLabel:"",anchoDiv:"",label:"Coordinador del evento de formación",
       inputForm:"<input id='inputBuscarTrabajadorGeneral0' class='form-control'>" +
       		 "<div id='divSelTrabajadorGeneral0'></div>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel:",
       inputForm:"",divContainer:"divExcelImport"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarSmartImportProgCapacitacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
                    "<i class='fa fa-floppy-o'></i> Importar" +
                 "</button>",divContainer:""}
   ];
	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		       	
   var contenido =
      "<form id='formImportEvento' class='eventoGeneral'>" +
         "<div id='tituloEvento'>"+text+"</div>"+
      "</form>"; 
		       	
   var listPaneles={
      id: "divImportProgCapacitacion",
      nombre: "Actualizar Programación Capacitación (import)",
      clase: "listaAuxiliar",contenido: contenido
   };
		       	
   crearModalPrincipalUsuario(listPaneles,function(){},true,true);
   
   buscarTrabajadorGeneralInformacion(0,"inputBuscarTrabajadorGeneral","divSelTrabajadorGeneral","selTrabajadorGeneralInformacion");
   
   var options={
      container:"#divExcelImport",functionCall:function(){},
      descargaUrl:"",esNuevo:true,
      idAux:"ImportExcel",evidenciaNombre:""
   };
		     
   crearFormEvidenciaCompleta(options);
   
   var hoy = getSession("fechaHoyOrdenInversoTexto");
   
   $("#fechaProgCapacitacionImport").val(hoy);
   $("#horaProgCapacitacionImport").val(obtenerHoraActual(1));
		       	
   $("#formImportEvento").on("submit",function(e){
      e.preventDefault();
      enviarExcelImportProgCapacitacion();
   });
}

function enviarExcelImportProgCapacitacion(){
   var campoVacio = true;
    
   var fechaRealizada = convertirFechaTexto($("#fechaProgCapacitacionImport").val());
   var inputFechaRealizada = (!fechaRealizada?null:fechaRealizada);
   
   var horaPlanificada = $("#horaProgCapacitacionImport").val();
   var coordinadorId = parseInt($("#selTrabajadorGeneralInformacion0").val()); 
   var evidenciaNombre = $("#inputEviImportExcel").val();
   
   if(inputFechaRealizada == null || horaPlanificada.length == 0 || evidenciaNombre.length == 0 || coordinadorId == -1){
      campoVacio = false; 
   }
   
   if(campoVacio){ 
      guardarEvidenciaAuto(0,"fileEviImportExcel",bitsEvidenciaActoInseguro,
      "/capacitacion/programacion/excel/masivo/save",function(data){
	 $("#divImportProgCapacitacion").modal("hide");
	  
	 mensajeUx = "<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
	 mensajesUx(mensajeUx,4,"");
      },"id",[ 
         {id: "empresaId",value: getSession("gestopcompanyid")},{id: "capacitacionId",value: capacitacionId},
         {id: "fechaRealizada",value: inputFechaRealizada},{id: "horaPlanificada",value: horaPlanificada},
         {id: "coordinadorId",value: coordinadorId}
      ]);
   }else{
      $("#divImportProgCapacitacion").modal("hide");
       
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","AvisoProgCapImport");
	       
      $("#modalMensajeUxAvisoProgCapImport").on("hidden.bs.modal",function(){
	 $("#divImportProgCapacitacion").modal("show");        
      });     
   }
}

function generarExcelFormatoRegistroFormacion(){
    window.open(URL+"/capacitacion/excel/formato/registro_formacion?empresaId="+parseInt(getSession("gestopcompanyid")) +
       "&progcapacitacionId="+programacionCapId,'_blank');	
}
