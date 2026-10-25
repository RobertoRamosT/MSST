var grupoSeguridadId;
var numTrabajadoresGrupo;
var fechaEntrega;
var banderaEdicion2;
var listTrabajadores;
var listTrabajadoresSeleccionados;
var listEquipos;
var listTipos;
var listEstados;
var listaFullGrupos;
var grupoEstado; 
var numPaginaActual;
var numPaginaTotal;
var listCargosGrupo=[];
function toggleBuscadorJstree(idToggle){
	
	$("#btnReportExcelGrupo").on("click",function(){
		window.open(URL
				+ "/trabajador/grupo/reporte/excel?grupoId="
				+ grupoSeguridadId + '&nada=_blank');	
	});
	
	
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
$(function(){
	$("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
	toggleBuscadorJstree(1);
	$("#btnClipTablaProgramacion").on("click",function(){
		var listFullTablaProgramacion="";
		listFullTablaProgramacion="Tipo" +"\t"
		+"Proposito" +"\t"
		+"Reuniones Realizadas" +"\t"
		+"Reuniones Planificadas" +"\t"
		+"# integrantes" +"\t"
		+"Fecha Inicio" +"\t"
		+"Fecha Fin" +"\t"
		+"Estado" +"\t"
		+"Evidencia" +"\t"
		+"Observaciones	" +"\n";  
		 
		 
		    
		for (var index = 0; index < listaFullGrupos.length; index++){
			
		
			listFullTablaProgramacion=listFullTablaProgramacion
			+listaFullGrupos[index].tipo.nombre+"\t"
			+listaFullGrupos[index].proposito+"\t"
			+listaFullGrupos[index].reunionesRealizadas+"\t"
			+ listaFullGrupos[index].reunionesPlanificadas+"\t"
			+listaFullGrupos[index].trabsAsociados+"\t"
			+listaFullGrupos[index].fechaInicioTexto+"\t"
			+listaFullGrupos[index].fechaFinTexto+"\t"
			+listaFullGrupos[index].estado.nombre +"\t" 
			+(listaFullGrupos[index].evidenciaNombre=="----"?"NO":"SI") +"\t"
			+listaFullGrupos[index].observaciones
			+"\n";
		

		}
		copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaProgramacion");
		
		 
		
		alert("Se han guardado al clipboard la tabla de este módulo" );

	});
})

function programarFecha(){
   cargarModalGrupoSeguridad();
   
   $('#mdProgFecha')
   .modal({
      keyboard: true,
      show: true,
      "backdrop":"static"
	  });
}

function cambiarPaginaTabla(){
   //Definiendo variables
	
   var list = listaFullGrupos;
   var totalSize = list.length;
   var partialSize = 10;
	
   numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
   var finRegistro = (numPaginaActual*partialSize)-1;
	
   //aplicando logica de compaginacion
	
   $('.izquierda_flecha_grupoSeguridad').show();
   $('.derecha_flecha_grupoSeguridad').show();
	 
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasGrupoSeguridad").html(numPaginaActual+" de "+numPaginaTotal);
	
   if(numPaginaActual == 1){
      $('.izquierda_flecha_grupoSeguridad').hide();
   }
	
   if(numPaginaActual == numPaginaTotal){
      $('.derecha_flecha_grupoSeguridad').hide();
   }
	 
   if(finRegistro > totalSize){
      finRegistro = totalSize-1;
   }
	
   $("#tblProg tbody tr").remove();
	
   for(var index=inicioRegistro;index<=finRegistro;index++){
      $("#tblProg tbody")
      .append("<tr id='tr"+list[index].id+"' onclick='javascript:editarGrupoSeguridad("+index+")'>" +
	         "<td id='tdtipo"+list[index].id+"'>"+list[index].tipo.nombre+"</td>" +
		 "<td id='tdprop"+list[index].id+"'>"+list[index].proposito+"</td>" +
		 "<td id='grupCaps"+list[index].id+"'>"+list[index].numCapacitaciones+"</td>" +
	         "<td id='tdtrab"+list[index].id+"'>"+list[index].trabsAsociados+"</td>" +
		 "<td id='tdreus"+list[index].id+"'>"+list[index].reunionesRealizadas+" / "+
		                                      list[index].reunionesPlanificadas+"</td>" +
	         "<td id='tdfechaini"+list[index].id+"'>"+list[index].fechaInicioTexto+"</td>" +
	         "<td id='tdfechafin"+list[index].id+"'>"+list[index].fechaFinTexto+"</td>" +
	         "<td id='tdestado"+list[index].id+"'>"+list[index].estado.nombre+"</td>" +
	         "<td id='tdevi"+list[index].id+"'>"+list[index].evidenciaNombre+"</td>" +
	         "<td id='tdobs" + list[index].id+"'>"+list[index].observaciones+"</td>" +
	      "</tr>");
   }
   
   formatoCeldaSombreableTabla(true,"tblProg");
   //$("#tblProg tbody tr").css("font-size","11px");
   //$("#tblProg thead tr").css("font-size","11px");
}

$('.izquierda_flecha_grupoSeguridad').on('click',function(){
   numPaginaActual = numPaginaActual-1;
   cambiarPaginaTabla();
});

$('.derecha_flecha_grupoSeguridad').on('click',function(){
   numPaginaActual = numPaginaActual+1;
   cambiarPaginaTabla();
});

function cargarModalGrupoSeguridad(){
   $("#btnAgregarProg").attr("onclick","javascript:nuevoGrupoSeguridad();");
   $("#btnCancelarProg").attr("onclick","javascript:cancelarGrupoSeguridad();");
   $("#btnGuardarProg").attr("onclick","javascript:guardarGrupoSeguridad();");
   $("#btnEliminarProg").attr("onclick","javascript:eliminarGrupoSeguridad();");
	
   $("#btnGuardarEval").attr("onclick","guardarCargosTrabs()");
   $("#btnCancelarProg").hide();
   $("#btnAgregarProg").show();
   $("#btnEliminarProg").hide();
   $("#btnGuardarProg").hide();
	
   $("#btnReportExcelGrupo").hide();

   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title").html("Grupos de Trabajadores");
   $("#modalGrupo").show(); 
	
   grupoSeguridadId = 0;
   numPaginaActual=1;
   listTrabajadoresSeleccionados = [];
   banderaEdicion2 = false;
   listaFullGrupos=[];
	
   var dataParam={
	   unidadId: getUrlParameter("mdfId")
		 };

   callAjaxPost(URL+'/trabajador/grupos',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listTipos = data.listTipos;
	    listEstados = data.listEstados;
	    listaFullGrupos = data.list;
			
	    if(getSession("linkCalendarioGrupoId") != null){
	       listaFullGrupos.every(function(val,index3){
	          if(val.id == parseInt(getSession("linkCalendarioGrupoId"))){
		     numPaginaActual = Math.ceil((index3+1)/(10));
		     cambiarPaginaTabla();
		     editarGrupoSeguridad(index3);
						
		     if(getSession("linkCalendarioReunionId") != null){
			programarReunion();
		     }
						
		     return false;
	          }else{
		     return true;
	          }
	       });
				
	       sessionStorage.removeItem("linkCalendarioGrupoId");
	    }else{
	       cambiarPaginaTabla();
	    }
			
//	    formatoCeldaSombreableTabla(true,"tblProg");	
	    break;
	   
         default:
	    alert("Ocurrió un error al traer las grupos!");
      }
   });
}

function verCargosTrabajadores(){
	$("#modalEvaluacion").modal("show");
}

function editarGrupoSeguridad (pindex) {
   if(!banderaEdicion2){
      listTrabajadores = [];
      listTrabajadoresSeleccionados = [];
      grupoSeguridadId = listaFullGrupos[pindex].id;
		
      var fechaInicio = listaFullGrupos[pindex].fechaInicio;
		var fechaFin = listaFullGrupos[pindex].fechaFin;

		numTrabajadoresGrupo=listaFullGrupos[pindex].trabsAsociados;
		
		var tipoId=listaFullGrupos[pindex].tipo.id;
		var proposito=listaFullGrupos[pindex].proposito;
		var observaciones=listaFullGrupos[pindex].observaciones;
		var textForm=$("#grupCaps"+grupoSeguridadId).text();
		
		$("#tr"+grupoSeguridadId).addClass("fila-edicion");
		
		$("#grupCaps"+grupoSeguridadId).addClass("linkGosst")
		.on("click",function(){verFormacionesGrupo();})
		.html("<i class='fa fa-graduation-cap fa-2x' aria-hidden='true' ></i>"+textForm);
		
		formatoCeldaSombreableTabla(false,"tblProg");
			var selMotivo = crearSelectOneMenu("selTipo", "",
					listTipos, tipoId, "id",
					"nombre");
		
		$("#tdtipo"+grupoSeguridadId).html(selMotivo);
		$("#tdprop" + grupoSeguridadId).html(
		"<input type='text' id='inputProp' class='form-control'>");
		$("#tdobs" + grupoSeguridadId).html(
		"<input type='text' id='inputObs' class='form-control'>");
		
		
      $("#tdtrab"+grupoSeguridadId).html(
         "<a id='linkTrabEntr' href='#' onclick='javascript:cargarTrabajadores();'>"+numTrabajadoresGrupo+" trabajador(es) &nbsp;&nbsp;</a>" +
         "<span onclick='verCargosTrabajadores()'><i class='fa fa-external-link fa-2x userLink' aria-hidden='true'></i></span>");
		
      var reus=$("#tdreus" + grupoSeguridadId).text();
	$("#tdreus" + grupoSeguridadId)
	.html(
			"<a id='linkReus' " +
			"href='#' " +
			"onclick='javascript:programarReunion();'>"+reus+"</a>");

		$("#tdfechaini" + grupoSeguridadId).html(
				"<input type='date' id='inputInicio' class='form-control' onchange='hallarEstadoImplementacion("+grupoSeguridadId+")'>");
		$("#tdfechafin" + grupoSeguridadId).html(
				"<input type='date' id='inputFin' class='form-control' onchange='hallarEstadoImplementacion("+grupoSeguridadId+")'>");
		
		
	
		$("#inputProp").val(proposito);
		$("#inputObs").val(observaciones);
		$("#inputInicio").val(convertirFechaInput(fechaInicio));
		$("#inputFin").val(convertirFechaInput(fechaFin));
		var nombreEvidencia=$("#tdevi" + grupoSeguridadId).text();
		
  
		var options=
		{
				container:"#tdevi" + grupoSeguridadId,
				functionCall: function(){ },
				descargaUrl:"/trabajador/grupo/evidencia?grupoId="+grupoSeguridadId,
				esNuevo: false,
				idAux:"Grupo",
				evidenciaNombre: nombreEvidencia 
		};
		crearFormEvidenciaCompleta(options);
		banderaEdicion2 = true;
		$("#btnCancelarProg").show();
		$("#btnAgregarProg").hide();
		$("#btnEliminarProg").show();
		$("#btnGuardarProg").show();
		$("#btnReportExcelGrupo").show();

		cargarTrabajadores(1);
		hallarEstadoImplementacion(grupoSeguridadId);
		$("#modalGrupo").show();
		$("#modalTree").hide();
	}
}

function cargarTrabajadores(accionId){
   var buttonGuardar =
      "<button id='btnGuardarShortcut' type='button' class='btn btn-success' " +
              "title='Guardar' style='margin-left:2px'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
	
   $("#modalTree #btnGuardarShortcut").remove();
   $("#modalTree #btnCancelarTrabs").after(buttonGuardar);
	
   $("#modalTree #btnGuardarShortcut").on("click",function(){
      cancelarSeleccionarTrabs();
      guardarGrupoSeguridad();
   });
	
   if(accionId == null){
      $("#modalTree").show("slow");

      $("#modalGrupo").hide("slow",function(){
         console.log("sdds")
      });
   }
	
   if (listTrabajadoresSeleccionados.length === 0) {
		var fechaPlanAux=$("#inputInicio").val();

		var dataParam = {
			id : grupoSeguridadId,
			fechaInicio:fechaPlanAux,
			unidadId : getUrlParameter("mdfId")
		};

		callAjaxPost(
				URL + '/trabajador/grupo/trabajadores',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						$('#jstree').jstree("destroy");
						$("#tblGroup tbody tr").remove();
						listTrabajadores = data.list;
						listCargosGrupo=data.listCargosGrupo;
						for(index=0;index<listCargosGrupo.length;index++){
							var trabId=listCargosGrupo[index].trabId;
							var trabNombre=listCargosGrupo[index].trabNombre;
							var cargo="<input id='cargo"+trabId+"' class='form-control'>";
							
							
							$("#tblGroup tbody").append(
							"<tr>" +
							"<td>"+trabNombre+"</td>"+
							"<td>"+cargo+"</td>" +
							"</tr>"		
							);
							$("#cargo"+trabId).val(listCargosGrupo[index].cargo);
						}
						$('#jstree').jstree({
							"plugins" : [ "checkbox", "json_data","search" ],
							'checkbox' : {
								"keep_selected_style" : false,
								"tie_selection" : false
							},
							'core' : {
								'data' : listTrabajadores
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
							
							    	busquedaMasivaJstree(listTrabajadores,"jstree","resultSearchTrab","listTrabBuscar")
							    }, 250);
							  });
						//Fin Para Buscador en jstree

						for (index = 0; index < listTrabajadores.length; index++) {
							if (listTrabajadores[index].state.checked
									&& listTrabajadores[index].id.substr(
											0, 3) == "tra") {
								listTrabajadoresSeleccionados
										.push(parseInt(listTrabajadores[index].id
												.substr(
														3,
														listTrabajadores[index].id.length)));
							}
						}
						
						break;
					default:
						alert("Ocurrió un error al cargar el arbol de trabajadores!");
					}
				});
	}
	
}

function guardarCargosTrabs(idFinal){
	var listGrupoTrabs=[];
	for(index=0;index<listCargosGrupo.length;index++){
		var trabId=listCargosGrupo[index].trabId;
				
		var cargo=$("#cargo"+trabId).val();
		
		listGrupoTrabs.push({
			trabajadorId:trabId,
			cargoGrupo:cargo,
			grupoId:grupoSeguridadId
		});
		
		
	}
	
	var dataParam={
			id:grupoSeguridadId,
			trabs:listGrupoTrabs
	}
	
	callAjaxPost(URL + '/trabajador/grupo/trabs/save', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			$("#modalEvaluacion").modal("hide");

if(idFinal!=null){
	cargarModalGrupoSeguridad();
}
			break;
		default:
			alert("Ocurrió un error al traer la sugerencia!");
		}
	});
	
}
function nuevoGrupoSeguridad() {
	if (!banderaEdicion2) {
		var selMotivo = crearSelectOneMenuOblig("selTipo", "",
				listTipos, "", "id","nombre");
		formatoCeldaSombreableTabla(false,"tblProg");
		$("#tblProg tbody")
				.prepend(
						"<tr id='0'>"
						+ "<td>"+selMotivo+"</td>"
						+ "<td><input type='text' id='inputProp' class='form-control' ></td>"
						+ "<td>...</td>"
						+ "<td>...</td>"
						+ "<td>...</td>"
						+ "<td><input type='date' id='inputInicio' class='form-control' onchange='hallarEstadoImplementacion(0)'></td>"
						+ "<td><input type='date' id='inputFin' class='form-control' onchange='hallarEstadoImplementacion(0)'></td>"
						+ "<td id='tdestado0'>...</td>"
						+ "<td id='inputeviGrupo'>...</td>"
						+ "<td><input type='text' id='inputObs' class='form-control' ></td>"
						+ "</tr>");
		
		var options=
		{
				container:"#inputeviGrupo",
				functionCall: function(){},
				descargaUrl:"",
				esNuevo: true,
				idAux:"Grupo",
				evidenciaNombre: "" 
		};
		crearFormEvidenciaCompleta(options);
		
		
		grupoSeguridadId = 0;
		$("#btnCancelarProg").show();
		$("#btnAgregarProg").hide();
		$("#btnEliminarProg").hide();
		$("#btnGuardarProg").show();
		$("#btnGenReporte").hide();
		
		
		banderaEdicion2 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarGrupoSeguridad() {
	cargarModalGrupoSeguridad();
}

function eliminarGrupoSeguridad() {
	var r = confirm("¿Está seguro de eliminar el grupo?");
	if (r == true) {
		var dataParam = {
			id : grupoSeguridadId,
		};

		callAjaxPost(URL + '/trabajador/grupo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalGrupoSeguridad();
						break;
					default:
						alert("Antes de eliminar el registro, verificar que no esté asociado a temas de formación, trabajadores y no tenga eventos programados");
					}
				});
	}
}

function guardarGrupoSeguridad() {
	
	var campoVacio = true;
var tipoId=$("#selTipo").val();
var inputProp=$("#inputProp").val();
var inputObs=$("#inputObs").val();
	var mes1 = $("#inputInicio").val().substring(5, 7) - 1;
	var fechatemp1 = new Date($("#inputInicio").val().substring(0, 4), mes1, $(
			"#inputInicio").val().substring(8, 10));

	var inputInicio = fechatemp1;
	
	var mes2 = $("#inputFin").val().substring(5, 7) - 1;
	var fechatemp2 = new Date($("#inputFin").val().substring(0, 4), mes2, $(
			"#inputFin").val().substring(8, 10));

	var inputFin = fechatemp2;
if(!$("#inputInicio").val()){
		
	inputInicio=null;
	}
if(!$("#inputFin").val()){
	inputFin=null;
};

if(tipoId=="-1" || inputInicio==null||inputFin==null ){
	campoVacio=false;
};
	if (campoVacio) {
		$("#modalGrupo button:not(#btnClipTablaProgramacion)").hide();
		var dataParam = {
			fechaInicio : inputInicio,
			fechaFin:inputFin,
			observaciones:inputObs,
			proposito:inputProp,
			id : grupoSeguridadId,
			unidadId : getUrlParameter("mdfId"),
			trabsId: listTrabajadoresSeleccionados,
			estado:grupoEstado,
			tipo:{
				id:tipoId
			}
		};

		callAjaxPost(URL + '/trabajador/grupo/save', dataParam,
				function(data) {
			
					switch (data.CODE_RESPONSE) {
					case "05":
					
						var encontradoAll=true;
						listCargosGrupo.forEach(function(val,index){
							if(listTrabajadoresSeleccionados.indexOf(val.trabId)==-1){
								encontradoAll=false;
							}
						});
						if(encontradoAll){
							console.log("Se encontró all")
						}
						if(listTrabajadoresSeleccionados.length==listCargosGrupo.length
								&& encontradoAll
								&& parseInt(grupoSeguridadId)>0){
							guardarCargosTrabs(1);
						};
						guardarEvidenciaAuto(data.nuevoId,"fileEviGrupo",
								bitsEvidenciaGrupo,'/trabajador/grupo/evidencia/save' , 
								cargarModalGrupoSeguridad,"grupoId")
						
						 
						break;
					default:
						alert("Ocurrió un error al guardar la programacion!");
					}
				});
	} else {
		alert("Debe ingresar las dos fechas y el tipo de grupo");
	}
}



function cancelarSeleccionarTrabs(){
	$("#modalGrupo").show();
	$("#modalTree").hide();
	var seleccionados = $('#jstree').jstree(true).get_checked();
	listTrabajadoresSeleccionados = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0, 3) == "tra") {
			listTrabajadoresSeleccionados.push(parseInt(seleccionados[index]
					.substr(3, seleccionados[index].length)));
		}
	}
}

function mostrarCargarImagen(progEquipoId) {
	$('#mdUpload').modal('show');
	$('#btnUploadArchivo').attr("onclick",
			"javascript:uploadArchivo(" + progEquipoId + ");");
}

function uploadArchivo(progEquipoId) {
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(progEquipoId,"fileEvi",bitsEvidenciaGrupo,
			"/trabajador/grupo/evidencia/save",function(){
		$.unblockUI();
		var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		$("#tdevi"+progEquipoId+" ").html(file.name);
		$("#mdUpload").modal("hide");
	},"grupoId");
	
    
}

function hallarEstadoImplementacion(progId){
	var fechaInicio=$("#inputInicio").val();
	var fechaFin=$("#inputFin").val();  
			
			var hoyDia=obtenerFechaActual();
			
			var difInicio= restaFechas(hoyDia,fechaInicio);
			var difFinal= restaFechas(hoyDia,fechaFin);
			if(difInicio>0){
				grupoEstado={id:"1",nombre:"Pendiente"};
			}else{
				if(difFinal>0){
					grupoEstado={id:"2",nombre:"Activo"};
				}else{
					if(fechaFin==""){
						grupoEstado={id:"2",nombre:"Activo"};
					}else{
						grupoEstado={id:"3",nombre:"Inactivo"};
					}
					
				}
			}
			
		
	
	$("#tdestado"+progId).html(grupoEstado.nombre);
	
}

var listFormacion;
function verFormacionesGrupo(){
	$("#mdProgFecha .modal-body").hide();
	$("#mdProgFecha .modal-title").html("<a onclick='volverGrupos()'>Grupos</a> > Formaciones");
	$("#btnCancelarForms").attr("onclick","guardarFormacionesGrupo()");
	$("#modalFormacion").show();
	listFormacion=[];
	llamarFormacionesGrupo();
}

function volverGrupos(){
	$("#mdProgFecha .modal-body").hide();
	$("#modalGrupo").show();
	$("#mdProgFecha .modal-title").html("Grupos de Seguridad");
	
	
}
function volverFormaciones(){
	$("#mdProgFecha .modal-body").hide();
	$("#modalFormacion").show();
	$("#mdProgFecha .modal-title").html("<a onclick='volverGrupos()'>Grupos</a> > Formaciones");
}

function llamarFormacionesGrupo(){
	var dataParam = {
			id : grupoSeguridadId,
			unidadId: getUrlParameter("mdfId"),
			empresaId : sessionStorage.getItem("gestopcompanyid")
	};

	callAjaxPostNoLoad(URL + '/trabajador/grupo/formaciones', dataParam, function(data) {
	 listFormacion=data.list;
	$("#tblFormGroup tbody").html("");
	listFormacion.forEach(function(val,index){
		var isAsignado=(val.isAsociado==1?"checked":"");
		var numVigentes=0;
		val.trabajadores.forEach(function(val1,index1){
			if(val1.isAprobado==1){
				numVigentes++;
			}
		});
		$("#tblFormGroup tbody").append("<tr >" +
				"<td>" +val.capacitacionNombre+"</td>"+
				"<td>" +"<input id='formGrupo"+val.capacitacionId+"' class='form-control' type='checkbox' "+isAsignado+">"+
				"<td class='linkGosst' onclick='verEvaluacionGrupoFormaciones("+index+")'><i class='fa fa-male fa-2x' aria-hidden='true'></i> "+numVigentes+"/"+val.trabajadores.length+"</td>"+
				"</tr>")
	});
	
	
	});
	
}

function verEvaluacionGrupoFormaciones(pindex){
	var dataParam={capacitacionId:listFormacion[pindex].capacitacionId};
	var vigAux=[],asigAux=[];
	callAjaxPost(
			URL + '/capacitacion/trabajador/formacion',
			dataParam,function(data){
				if(data.CODE_RESPONSE=="05"){
					var trabajadoresPermitidos=listFormacion[pindex].trabajadores;
					var idPermitido=listarStringsDesdeArray(trabajadoresPermitidos,"trabajadorId");
					var trabajadoresAsignados=data.trabajadoresAsignados;
					trabajadoresAsignados=trabajadoresAsignados.filter(function(val,index){
						 if(idPermitido.indexOf(val.trabajadorId)!=-1){
							 return true;
						 }else{
							 return false;
						 }
					});
					var trabajadoresVigentes=data.trabajadoresVigentes;
					trabajadoresVigentes=trabajadoresVigentes.filter(function(val,index){
						 if(idPermitido.indexOf(val.trabajadorId)!=-1){
							 return true;
						 }else{
							 return false;
						 }
					});
					var trabajadoresPlanificados=data.trabajadoresPlanificados;
					trabajadoresPlanificados=trabajadoresPlanificados.filter(function(val,index){
						 if(idPermitido.indexOf(val.trabajadorId)!=-1){
							 return true;
						 }else{
							 return false;
						 }
					});
					$("#mdProgFecha .modal-title").html("<a onclick='volverGrupos()'>Grupos</a> " +
							"> <a onclick='volverFormaciones()'>Formación '"+listFormacion[pindex].capacitacionNombre+"' </a>" +
									"> Evaluaciones");
					
					$("#mdProgFecha .modal-body").hide();
					$("#modalEvaluacionGrupo").show();
					
					$("#tblTrabFormacion tbody tr").remove();
					vigAux=[];
					asigAux=[]; 
					for(index=0;index<trabajadoresAsignados.length;index++){
						if(trabajadoresAsignados[index].estadoPlanificacion!=1){
							asigAux.push(trabajadoresAsignados[index].trabajadorId);	
						}
						
						$("#tblTrabFormacion tbody").append("" +
								
					"<tr id='ft"+trabajadoresAsignados[index].trabajadorId+"'>" +
					
					"<td>"+trabajadoresAsignados[index].trabajadorNombre+"</td>" +
					"<td>"+"---"+"</td>" +
					"<td>"+"---"+"</td>" +
					"</tr>")	;
						$("#ft"+trabajadoresAsignados[index].trabajadorId+" td").css({
							"background-color":"#C0504D"
						})
					}
					for(index=0;index<trabajadoresPlanificados.length;index++){
						if(trabajadoresPlanificados[index].fechaFutura.trim()!=""){
							vigAux.push(trabajadoresPlanificados[index].trabajadorId);
							$("#ft"+trabajadoresPlanificados[index].trabajadorId).remove();
							$("#tblTrabFormacion tbody").prepend("" +
									
									"<tr id='ft"+trabajadoresPlanificados[index].trabajadorId+"'>" +
									
									"<td>"+trabajadoresPlanificados[index].trabajadorNombre+"</td>" +
									"<td>"+trabajadoresPlanificados[index].fechaFutura+"</td>" +
									"<td>"+"----"+"</td>" +
									"</tr>");
							
							
							
							$("#ft"+trabajadoresPlanificados[index].trabajadorId+" td").css({
								"background-color":"#F79646"
							})
						}
						
					}
					for(index=0;index<trabajadoresVigentes.length;index++){
						vigAux.push(trabajadoresVigentes[index].trabajadorId);
						$("#ft"+trabajadoresVigentes[index].trabajadorId).remove()	;
						$("#tblTrabFormacion tbody").prepend("" +
								
								"<tr id='ft"+trabajadoresVigentes[index].trabajadorId+"'>" +
								
								"<td>"+trabajadoresVigentes[index].trabajadorNombre+"</td>" +
								"<td>"+trabajadoresVigentes[index].fechaFutura+"</td>" +
								"<td>"+trabajadoresVigentes[index].diasRestantes+"</td>" +
								"</tr>");
						$("#ft"+trabajadoresVigentes[index].trabajadorId+" td").css({
							"background-color":"#9BBB59"
						})
					}
					
				}else{
					console.log("NOP")
				}
			})
}
function guardarFormacionesGrupo(){
	var listEnviar=[];
	
	listFormacion.forEach(function(val,index){
		if($("#formGrupo"+val.capacitacionId).prop("checked")){
			val.grupoId=grupoSeguridadId;
			val.isAsociado=1;
		}else{
			val.grupoId=grupoSeguridadId;
			val.isAsociado=0;
		}
	});
	console.log(listFormacion);
 
	callAjaxPostNoLoad(URL + '/trabajador/grupo/formaciones/save', listFormacion, function(data) {
		alert("Asignaciones guardadas")
		volverGrupos();
	},function(asd){
	
	},{});
}





