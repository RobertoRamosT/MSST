var programaTipExId,programaTipExObj={};
var tipoExamenMedicoId;
var responsable;
var fechaIni;
var fechaFin;
var progExamEstado;
var progExamEstadoNombre;
var banderaEdicion2;
var estadoInforme;
var listTrabajadoresPlanisSelecccionados;
var listTrabajadoresPlanis;
var listTrabajadoresAsistSelecccionados;
var listTrabajadoresAsist;
var listExMedTipo;
var vigencia;
var listaFullProgExam;
var inversion;
var numPaginaActual;
var numPaginaTotal;
var listDisca;
var listEvaluacion;
var trabajadoresSugeridos;
var listaTrabs;

var listTrabajadores;var contadorListTrab;
var listFrecuencia;

$(function(){
	$("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
	$("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(2)");
	$("#btnInversion").attr("onclick","obtenerPrecioSugerido()");
	$("#btnGuardarEval").attr("onclick","guardarEvaluacionMedica(1)");
	$("#btnCancelarEval").attr("onclick","guardarEvaluacionMedica()");
	$("#listTrabBuscar").hide();
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
	$("#listTrabAsistBuscar").hide();
	 $('.izquierda_flecha').on('click',function(){
		 numPaginaActual=numPaginaActual-1
    cambiarPaginaTabla();
    });
	 $('.derecha_flecha').on('click',function(){
		 numPaginaActual=numPaginaActual+1;
		 cambiarPaginaTabla();
    });
	 $("#btnClipTablaProgramacion").on("click",function(){
			var listFullTablaProgramacion="";
			listFullTablaProgramacion="Tipo de examen" +"\t"
			+"Fecha Planificada" +"\t"
			+"Fecha real" +"\t"
			+"Inversión" +"\t"
			+"Trabajadores planificados" +"\t"
			+"Trabajadores que asistieron" +"\t"

			+"Trabajadores aptos" +"\t"
			+"Trabajadores con restricciones" +"\t"
			+"Trabajadores no aptos" +"\t"
			+"Trabajadores no evaluados" +"\t"
			+"Evidencia" +"\t"
			+"Estado" +"\t"+" \n";
			for (var index = 0; index < listaFullProgExam.length; index++){
				
			
				listFullTablaProgramacion=listFullTablaProgramacion
				+listaFullProgExam[index].tipoExamenNombre+"\t"
				+listaFullProgExam[index].responsable+"\t"
				+listaFullProgExam[index].fechaInicialTexto+"\t"
				+listaFullProgExam[index].fechaFinTexto+"\t"
				+listaFullProgExam[index].inversionProgExam+"\t"
				+listaFullProgExam[index].numeroPlanificado +"\t"
				+listaFullProgExam[index].numeroAsistentes+"\t"
				
				+listaFullProgExam[index].numeroEvaluadoApto+"\t"
				+listaFullProgExam[index].numeroEvaluadoRestriccion+"\t"
				+listaFullProgExam[index].numeroEvaluadoNoApto+"\t"

				+(listaFullProgExam[index].numeroAsistentes-listaFullProgExam[index].numeroEvaluado)+"\t"

				+(listaFullProgExam[index].evidenciaNombre=="----"?"NO":"SI") +"\t"
				+listaFullProgExam[index].progExamEstadoNombre +"\t"
				+"\n";
				
				
			

			}
			copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaProgramacion");
			
			 
			
			alert("Se han guardado al clipboard la tabla de este módulo" );

		});
	 if(getSession("linkCalendarioProgExamId")!=null){
			programarFecha();
		}
		
	 $('#buscadorTrabajadorInput').keyup(function(e){
		    if(e.keyCode == 13)
		    {
		        $(this).trigger("enterKey");
		    }
		});
		$('#buscadorTrabajadorInput').bind("enterKey",function(e){
			cargarModalprogTipEx();
			});
		$("#buscadorTrabajadorInput").focus();
		
		$("#resetBuscador").attr("onclick","resetBuscador()");
		var dataParam2 = {
				idCompany: getSession("gestopcompanyid")
		};

		callAjaxPost(URL + '/accidente/trab', dataParam2,
				function (data){
			switch (data.CODE_RESPONSE) {
				
				case "05":
					 trabajadoresSugeridos=data.listDniNombre;
					  listaTrabs=listarStringsDesdeArray(trabajadoresSugeridos,"nombre");
						
					break;
				default:
					alert("Ocurrió un error al traer los trabajdores!");
				}
			});
		resizeDivWrapper("wrapProgEx",240);
});

function programarFecha(){
   cargarModalprogTipEx();
	
   $('#mdProgFecha').modal({
      keyboard: true,
      show: true,
      "backdrop": "static"
   });	
}

function resetBuscador(){
	$("#buscadorTrabajadorInput").val("");
	cargarModalprogTipEx();
}

function obtenerListaNombresTrabajador(){
	copiarAlPortapapeles(listTrabajadores,"btnSelectTrabs");
	
	 
	alert("Se han guardado al clipboard " + contadorListTrab
			+ " trabajador(es)");
}

function agruparRegistrosTabla(){
   numPaginaActual = 1;
   var numAgrupacion=10;
		
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
   //Definiendo variables
   var list = listaFullProgExam;
   var totalSize = list.length;
   var partialSize = 8;
	
   numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
   var finRegistro = (numPaginaActual*partialSize)-1;
	
   //Aplicando lógica de compaginación
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
	 
   if(finRegistro >= totalSize){
      finRegistro=totalSize-1;
   }
	
   $("#tblProg tbody tr").remove();
	
   for(var index = inicioRegistro;index <= finRegistro;index++){
      $("#tblProg tbody").append(
         "<tr id='tr"+list[index].programaTipExId+"' onclick='javascript:editarprogTipEx("+index+")'>" +
            "<td id='tdtipex"+list[index].programaTipExId+"'>"+list[index].tipoExamenNombre+"</td>" +
            "<td id='tdresp"+list[index].programaTipExId+"'>"+list[index].responsable+"</td>" +
            "<td id='tdfechini"+list[index].programaTipExId+"'>"+list[index].fechaInicialTexto+"</td>" +
            "<td id='tdhorapla"+list[index].programaTipExId+"'>"+list[index].horaPlanificadaTexto+"</td>" +
	    "<td id='tdinversion"+list[index].programaTipExId+"'>S/ "+list[index].inversionProgExam+"</td>" +
	    "<td id='tdvigencia"+list[index].programaTipExId+"'>"+list[index].tipoVigencia.nombre+"</td>" +
	    "<td id='tdtrabplani"+list[index].programaTipExId+"'>"+list[index].numeroPlanificado+"</td>" +
	    "<td id='tdtrabreal"+list[index].programaTipExId+"'>"+list[index].numeroAsistentes+"</td>" +
	    "<td id='tdtdfechfin"+list[index].programaTipExId+"'>"+list[index].fechaFinTexto+"</td>" +
	    "<td id='tdtrabeval"+list[index].programaTipExId+"'>" + 
	     (list[index].numeroEvaluadoApto+list[index].numeroEvaluadoRestriccion)+" / "+list[index].numeroEvaluado+"</td>" +
	    "<td id='tdevi"+ list[index].programaTipExId+"'>"+list[index].evidenciaNombre+"</td>" +
	    "<td id='estadoExam"+list[index].programaTipExId+"'>"+ list[index].progExamEstadoNombre+"</td>" +	
	 "</tr>");
   }
}  

function cargarModalprogTipEx(){	
    
   $('#modalEvaluacion').on('hidden.bs.modal',function(e){
      $("#mdProgFecha").modal({
         keyboard: true,
         show: true,
         "backdrop": "static"
      });	
   });
	
   $('#modalCorreos').on('hidden.bs.modal',function(e){
      $("#mdProgFecha").modal({
         keyboard: true,
         show: true,
         "backdrop": "static"
      });
   });
	
   $('#modalPrecio').on('hidden.bs.modal',function(e){
      $("#mdProgFecha").modal({
         keyboard: true,
         show: true,
         "backdrop": "static"
      });	
   });
	
   $("#btnAgregarProg").attr("onclick", "javascript:nuevoprogTipEx();");
   $("#btnCancelarProg").attr("onclick", "javascript:cancelarprogTipEx();");
   $("#btnGuardarProg").attr("onclick", "javascript:guardarprogTipEx();");
   $("#btnEliminarProg").attr("onclick", "javascript:eliminarprogTipEx();");
   $("#btnGenReporte").attr("onclick", "javascript:generarReporte();");
   $("#btnEvaluar").attr("onclick", "javascript:verEvaluacionMedica();");
   $("#btnEvaluarPlus").attr("onclick", "javascript:verEvaluacionMedicaPlus();");
	
   $("#btnInversion").hide();
   $("#btnVerCorreos").attr("onclick", "javascript:verCorreos();");
   $("#btnEvaluar").hide();$("#btnEvaluarPlus").hide();
   $("#btnCancelarProg").hide();
   $("#btnAgregarProg").show();
   $("#btnEliminarProg").hide();
   $("#btnGenReporte").hide();
   $("#btnGuardarProg").hide();
   $("#btnVerCorreos").hide();
   $("#mdProgFecha .modal-body").hide();
   $("#modalProg").show();
	
   inversion = 0;
   programaTipExId = 0;
   tipoExamenMedicoId = -1;
   listTrabajadoresPlanisSelecccionados = null;
   listTrabajadoresAsistSelecccionados = null;
   fechaIni = null,fechaFin = null;
   banderaEdicion2 = false;
   vigencia = 0;
   listExMedTipo = [],listEvaluacion = [],listaFullProgExam = [],
   listaFrecuencia = [];
	
   var palabraClave = $("#buscadorTrabajadorInput").val();
	
   if(palabraClave.length == 0){
      palabraClave = null;
   }else{
      palabraClave = ("%"+palabraClave+"%").toUpperCase();
   }
	
   var dataParam = {
      idCompany: sessionStorage.getItem("gestopcompanyid"),
      palabraClave: palabraClave
   };
	
   callAjaxPost(URL+'/examenmedico/programacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var list = data.list;
	    listaFullProgExam = data.list;
	    listExMedTipo = data.listExMedTipo;
	    listDisca = data.listDisca;
	    listFrecuencia = data.listFrecuencia;
			
	    agruparRegistrosTabla();
	    formatoCeldaSombreableTabla(true,"tblProg");
			
	    if(getSession("linkCalendarioProgExamId") != null){		
	       listaFullProgExam.every(function(val,index3){	
	          if(val.programaTipExId == parseInt(getSession("linkCalendarioProgExamId"))){			
		     numPaginaActual = Math.ceil((index3+1)/8);
		     cambiarPaginaTabla();
		     editarprogTipEx(index3);
		     sessionStorage.removeItem("linkCalendarioProgExamId");
		     return false;
	          }else{
		     return true;
	          }
	       });		
	    }
		      
	    break;
		
         default:
	    alert("Ocurrió un error al traer las programaciones!");
      }
   });
}

function editarprogTipEx(pindex){
   if(!banderaEdicion2){
      listTrabajadoresPlanis = [],listTrabajadoresPlanisSelecccionados = [],
      listTrabajadoresAsist = [],listTrabajadoresAsistSelecccionados = [];
      
      programaTipExId = listaFullProgExam[pindex].programaTipExId;
      programaTipExObj = listaFullProgExam[pindex];
      
      responsable = programaTipExObj.responsable;
      fechaIni = programaTipExObj.fechaInicial;
      fechaFin = programaTipExObj.fechaFin;
      tipoExamenMedicoId = programaTipExObj.tipoExamenMedicoId;
      vigencia = programaTipExObj.tipoVigencia.id;
		
      var correTrabajadores = programaTipExObj.correoTrabajadores;
      var numTrabajadores = programaTipExObj.numeroPlanificado;
      var inversionProgExam = programaTipExObj.inversionProgExam;
      var horaPlanificada = programaTipExObj.horaPlanificada;
		
      $("#modalBodyCorreos").html(
         "<p style='color:#008b8b'>Número de Trabajadores: </p>"+numTrabajadores+"<br>" +
         "<p style='color:#008b8b'>Correos: </p>"+correTrabajadores);
		
      formatoCeldaSombreableTabla(false,"tblProg");
		
      $("#btnVerCorreos").show();
		
      var selFrecTipo = crearSelectOneMenuOblig("selFrecTipo","",listFrecuencia,vigencia,"id","nombre");
      $("#tdvigencia"+programaTipExId).html(selFrecTipo);
	
      $("#tdresp"+programaTipExId).html("<input type='text' id='inputResp' class='form-control' value='"+responsable+"'>");
		
      $("#tdinversion"+programaTipExId).html(
         "<label for='inputInversion'>S/ </label>" +
         "<input type='number' id='inputInversion' name='inputInversion' class='form-control' value='"+inversionProgExam+"'>");
      
      $("#tdhorapla"+programaTipExId).html(
         "<input type='time' id='inputHora' name='inputHora' class='form-control' value='"+horaPlanificada+"'>");
      
      $("#tdtrabplani"+programaTipExId).html(
         "<a id='linkTrabPlani' href='#' onclick='javascript:cargarTrabajadoresPlanis();'>Trabajadores planificados</a>");

      $("#tdtrabreal"+programaTipExId).html(
         "<a id='linkTrabReal' href='#' onclick='javascript:cargarTrabajadoresAsist();'>Trabajadores que asistieron</a>");
		
      var nombreEvidencia = $("#tdevi"+programaTipExId).text();
		
      var options={
         container :"#tdevi" + programaTipExId,
         functionCall: function(){},
         descargaUrl:  "/examenmedico/programacion/evidencia?programaTipExId="+programaTipExId,
         esNuevo: false,
         idAux:"Examen",
         evidenciaNombre: nombreEvidencia
      };
		
      crearFormEvidenciaCompleta(options);
		
      $("#tdfechini"+programaTipExId).html(
         "<input type='date' id='inputFecIni' onchange='hallarEstadoImplementacion("+programaTipExId+")' class='form-control'>");	
      $("#inputFecIni").val(convertirFechaInput(fechaIni));
		
      $("#tdtdfechfin"+programaTipExId).html(
         "<input type='date' id='inputFecFin' onchange='hallarEstadoImplementacion("+programaTipExId+")' class='form-control'>");
      $("#inputFecFin").val(convertirFechaInput(fechaFin));
		
      var selExMedTipoProg = crearSelectOneMenuOblig("selExMedTipoProg","",listExMedTipo,tipoExamenMedicoId,
	 "exMedTipoId","exMedTipoNombre");
      $("#tdtipex"+programaTipExId).html(selExMedTipoProg);
		
      ponerListaSugerida("inputResp",listaTrabs,true);
      hallarEstadoImplementacion(programaTipExId);
      banderaEdicion2 = true;
      
      $("#tdtrabeval"+programaTipExId).html(
         "<a class='efectoLink' title='Enlace consolidado Trabajadores asistentes - estado evaluación' " +
            "onclick='verConsolidadoTrabajadoresAsistentesEstEvalExamMed()'>" +
            "<i class='fa fa-table'></i> " +
             (programaTipExObj.numeroEvaluadoApto+programaTipExObj.numeroEvaluadoRestriccion)+" / "+programaTipExObj.numeroEvaluado + 
         "</a>");
		
      $("#btnCancelarProg").show();
      $("#btnAgregarProg").hide();
      $("#btnEliminarProg").show();
      $("#btnGenReporte").show();
      $("#btnInversion").show();
		
      if(getSession("accesoUsuarios") == 3){
         $("#btnEvaluarPlus").show();
      }else{
	 $("#btnEvaluar").show();
      }
		
      cargarTrabajadoresPlanis();
      cargarTrabajadoresAsist();
		
      $("#modalProg").show();
      $("#modalTree").hide();
      $("#modalTreeAsist").hide();
      $("#modalUpload").hide();
   }
}

function nuevoprogTipEx() {
	if (!banderaEdicion2) {
		var selectExMedTipo = crearSelectOneMenuOblig("selExMedTipoProg", "",
				listExMedTipo, "-1", "exMedTipoId", "exMedTipoNombre");
		var selectFrecuencia = crearSelectOneMenuOblig("selFrecTipo", "",
				listFrecuencia, "-1", "id", "nombre");
		programaTipExId = 0;
		$("#tblProg tbody")
				.prepend(
						"<tr id='tr0'>"
								+ "<td>" + selectExMedTipo + "</td>"
								+ "<td><input type='text' id='inputResp' class='form-control'></td>"

								+ "<td><input type='date' id='inputFecIni' onchange='hallarEstadoImplementacion("+programaTipExId+")' class='form-control'></td>"
								+ "<td><input type='time' value='12:00:00' id='inputHora' class='form-control'></td>"
								+"<td>"
								+"<label for='inputInversion'>S/</label><input type='number' id='inputInversion' name='inputInversion' " 
								+"class='form-control'>"
								+"</td>"
								+ "<td>"+
								selectFrecuencia
								+"</td>"
								+ "<td>...</td>"
								+ "<td>...</td>"
								+ "<td><input type='date' id='inputFecFin' onchange='hallarEstadoImplementacion("+programaTipExId+")' class='form-control'></td>"
								+ "<td>...</td>"	
								+ "<td id='inputevimedic'>...</td>"
								+"<td id='estadoExam0'>...</td>"
								+ "</tr>");
		
		var options=
		{
				container:"#inputevimedic",
				functionCall: function(){ },
				descargaUrl:"",
				esNuevo: true,
				idAux: "Examen",
				evidenciaNombre:""			
		}
		formatoCeldaSombreableTabla(false,"tblProg");
		crearFormEvidenciaCompleta(options);
		ponerListaSugerida("inputResp",listaTrabs,true);
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

function cancelarprogTipEx() {
	cargarModalprogTipEx();
}

function eliminarprogTipEx() {
	var r = confirm("¿Está seguro de eliminar la programacion?");
	if (r == true) {
		var dataParam = {
			programaTipExId : programaTipExId,
		};

		callAjaxPost(URL + '/examenmedico/programacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalprogTipEx();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function guardarprogTipEx() {
   $("#modalProg button:not(#btnClipTablaProgramacion)").hide();
	
   var inversion=$("#inputInversion").val();
   var campoVacio = true;
   var selFrecTipo= $("#selFrecTipo").val();	 
   var horaPlanificada=$("#inputHora").val();
   var responsableExamen=$("#inputResp").val();

   if(!$("#inputHora").val()){
      horaPlanificada=null;
   }
	
   var inputFecIni = convertirFechaTexto($("#inputFecIni").val());
   var inputFecFin = convertirFechaTexto($("#inputFecFin").val());
   var exmedTipo = $("#selExMedTipoProg option:selected").val();

   if(exmedTipo == '-1'){
      campoVacio = false;
   }

   ///Logica para guaradar evaluaciones
   var r=true;
   var trabEncontrados=0;
	
   for(index=0;index<listEvaluacion.length;index++){
      for(index1=0;index1<listTrabajadoresAsistSelecccionados.length;index1++){
	  if(listEvaluacion[index].traId
	     .substr(3,listEvaluacion[index].traId.length)==listTrabajadoresAsistSelecccionados[index1]){
		       trabEncontrados=trabEncontrados+1;
		       index1=listTrabajadoresAsistSelecccionados.length;
		     }
      }
   }

   if(programaTipExId>0){
      var numAsist=listTrabajadoresAsistSelecccionados.length ;
      var programacionExamIdAux=programaTipExId;
      if(trabEncontrados==listTrabajadoresAsistSelecccionados.length 
	    && listTrabajadoresAsistSelecccionados.length==listEvaluacion.length){
	 r=true;
      }else{
	 r = confirm("La lista de trabajadores asistidos se ha modificado, tendrá que evaluar nuevamente los trabajadores, ¿desea continuar?");
      }
   }

   ////
   if(r){
   if(campoVacio){
      var dataParam = {
	      programaTipExId : programaTipExId,
	      fechaInicial : inputFecIni,
	      horaPlanificada:horaPlanificada,
	      fechaFin : inputFecFin,
	      tipoVigencia:{id:selFrecTipo},
	      responsable:responsableExamen,
	      inversionProgExam:inversion,
	      tipoExamenMedicoId : exmedTipo,
	      progExamEstadoId:progExamEstado,
	      trabajadoresPlanificados: listTrabajadoresPlanisSelecccionados,
	      trabajadoresAsistidos: listTrabajadoresAsistSelecccionados,
	      idCompany : getSession("gestopcompanyid")
	  };

   callAjaxPost(URL + '/examenmedico/programacion/save', dataParam,
		function(data){
		   switch(data.CODE_RESPONSE){
		      case "05":
			  if(programacionExamIdAux>0 && listTrabajadoresAsistSelecccionados!=null){
			     if(trabEncontrados==listTrabajadoresAsistSelecccionados.length 
				&& listTrabajadoresAsistSelecccionados.length==listEvaluacion.length){	
				guardarEvaluacionMedica(1);
			     }
			   }else{
			      cargarModalprogTipEx();
			   } 
			
			  guardarEvidenciaAuto(data.nuevoId,"fileEviExamen",bitsEvidenciaIperc,
				               "/examenmedico/programacion/evidencia/save", 
						cargarModalprogTipEx,"programaTipExId")
			  break;
		        default:
			   alert("Ocurrió un error al guardar la programacion!");
		     }
		 });
	}else{
           alert("Debe ingresar todos los campos.");
	}
   }
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
		guardarprogTipEx();
	});
	if (listTrabajadoresPlanisSelecccionados.length === 0) {
var fechaIninAux=$("#inputFecIni").val();

		var dataParam = {
				programaTipExId : programaTipExId,
				fechaInicialTexto:fechaIninAux,
			idCompany : sessionStorage.getItem("gestopcompanyid")
		};

		callAjaxPost(
				URL + '/examenmedico/programacion/trabajadores',
				dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						$('#jstree').jstree("destroy");

						listTrabajadoresPlanis = data.list;

						$('#jstree').jstree({
							"plugins" : [ "checkbox", "json_data","search" ],
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
							
							    	busquedaMasivaJstree(listTrabajadoresPlanis,"jstree","resultSearchTrab","listTrabBuscar")
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
	}

}

function cargarTrabajadoresAsist(){
   var buttonGuardar =
      "<button id='btnGuardarShortcut' type='button' class='btn btn-success' title='Guardar' style='margin-left:2px'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
	
   $("#modalTreeAsist #btnGuardarShortcut").remove();
   $("#modalTreeAsist #btnCancelarTrabs").after(buttonGuardar);

   $("#modalTreeAsist #btnGuardarShortcut").on("click",function(){
      cancelarSeleccionarTrabsAsist();
      guardarprogTipEx();
   });

   if(listTrabajadoresAsistSelecccionados.length > 0){
      var r = confirm("Si modifica los trabajadores, tendrá que evaluarlos nuevamente,¿desea continuar?");
		
      if(r == true){
         $("#modalProg").hide();
         $("#modalTree").hide();
         $("#modalTreeAsist").show();
         $("#modalUpload").hide();
      }else{
	 return;
      }
   }
	
   if(listTrabajadoresAsistSelecccionados.length === 0){
      $("#modalProg").hide();
      $("#modalTree").hide();
      $("#modalTreeAsist").show();
      $("#modalUpload").hide();
				
      var fechaFinAux = $("#inputFecFin").val();
      
      var dataParam={
         programaTipExId: programaTipExId,
         fechaFinTexto: fechaFinAux,
         idCompany: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/examenmedico/programacion/trabajadores/asistidos',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $('#jstreeAsist').jstree("destroy");
	       listEvaluacion = data.listEvaluacion;
	       listTrabajadoresAsist = data.list;
	       listTrabajadores = "";
	       contadorListTrab = 0;
	       
	       $("#tblEval tbody tr").remove();
	       
	       var selectDiscapacidad = crearSelectOneMenu("selTipoDisc","",listDisca,"1",
		  "tipoDiscapacidad","tipoDiscapacidadNombre");
					
	       for(var index = 0;index < listEvaluacion.length;index++){
	          listTrabajadores = listTrabajadores + listEvaluacion[index].traNombre + "\n";
	          contadorListTrab = contadorListTrab + 1;
						
	          var trabId = listEvaluacion[index].traId.substr(3,listEvaluacion[index].traId.length);
	          var trabNombre = listEvaluacion[index].traNombre;
	          var restriccion = "<input id='restriccion"+trabId+"' class='form-control'>";
	          var tipoDisc = listEvaluacion[index].tipoDiscapacidadId;
						
	          $("#tblEval tbody").append(
		     "<tr>" +
		        "<td>"+trabNombre+"</td>"+
		        "<td>"+selectDiscapacidad+"</td>" +
		        "<td>"+restriccion+"</td>" +
		     "</tr>");
						
	          $("#restriccion"+trabId).val(listEvaluacion[index].restriccionMedica);
	          $("#selTipoDisc").attr("id","selTipoDisc"+trabId);
	          $("#selTipoDisc"+trabId).val(listEvaluacion[index].tipoDiscapacidadId);
	       }
	       	
	       $('#jstreeAsist').jstree({
		  "plugins": [ "checkbox","json_data","search"],
		  'checkbox': {"keep_selected_style": false,
			       "tie_selection": false},
		  'core': {'data': listTrabajadoresAsist}
	       });
						
	       //Inicio Para Buscador en jstree
	       var to = false;
						  
	       $('#buscarTrabAsisJstree').keyup(function(){
	          if(to){clearTimeout(to);}
		
	          to = setTimeout(function(){
		          var v = $('#buscarTrabAsisJstree').val();
		          $('#jstreeAsist').jstree(true).search(v);
	               }, 250);
	       });
						  
	       $('#listTrabAsistBuscar').keyup(function(){
	          if(to){clearTimeout(to);}
							    
	          to = setTimeout(function(){
		          busquedaMasivaJstreeException(listTrabajadoresAsist,"jstreeAsist","resultSearchTrabAsist",
		             "listTrabAsistBuscar",null,listTrabajadoresPlanisSelecccionados)
	               },250);
	       });
						  
	       $.jstree.defaults.search.show_only_matches = true;
               //Fin Para Buscador en jstree

	       var listTrabajadoresAsistSelecccionados2;
						
	       for(index = 0;index < listTrabajadoresAsist.length;index++){
		  if(listTrabajadoresAsist[index].state.checked && 
		     listTrabajadoresAsist[index].id.substr(0,3) == "tra"){
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

function cancelarSeleccionarTrabsAsist() {
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

function cancelarSeleccionarTrabs() {
	var seleccionados = $('#jstree').jstree(true).get_checked();
	listTrabajadoresPlanisSelecccionados = [];
	for (index = 0; index < seleccionados.length; index++) {
		var trab = seleccionados[index];
		if (seleccionados[index].substr(0, 3) == "tra") {
			listTrabajadoresPlanisSelecccionados.push(seleccionados[index]
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
	guardarEvidenciaAuto(programaTipExId,"fileEvi",bitsEvidenciaExamen,
			"/examenmedico/programacion/evidencia/save",function(){
		var inputFileImage = document.getElementById("fileEvi");
		var file = inputFileImage.files[0];
		$("#tdevi"+programaTipExId).html(file.name);
		$.unblockUI();
		$("#modalProg").show();
		$("#modalTree").hide();
		$("#modalUpload").hide();
	},"programaTipExId");
  
	 
		
}




function hallarEstadoImplementacion(progId){
	var fechaPlanificada=$("#inputFecIni").val();
	var fechaReal=$("#inputFecFin").val();
	
	programaTipExObj.fechaFinTexto=convertirFechaNormal(fechaReal);
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		progExamEstado=2;
		progExamEstadoNombre="Completado";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				progExamEstado=3;
				progExamEstadoNombre="Retrasado";
			}else{
				progExamEstado=1;
				progExamEstadoNombre="Por implementar";
			}
			
		}else{
			
			progExamEstado=1;
			progExamEstadoNombre="Por implementar";
			
		}
	}
	
	$("#estadoExam"+progId).html(progExamEstadoNombre);
	
}

function generarReporte(){
	window.open(URL
			+ "/examenmedico/informe?programaTipExId="
			+ programaTipExId , '_blank');	
	
	
	
}


function verCorreos(){
	
	$("#modalCorreos").modal("show");
	$("#mdProgFecha").modal("hide");
}



function obtenerPrecioSugerido(){
	var dataParam = {
			programaTipExId : programaTipExId
		};

		callAjaxPost(URL + '/examenmedico/programacion/sugerencia', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				var precios = data.precioTotal;
				var detalleExam=data.programacion;
				$("#tablePrecio tbody tr").remove();
				for(var index=0;index<detalleExam.length;index++){
					$("#tablePrecio tbody").append(
							"<tr>" +
							"<td>"+detalleExam[index].examenAsociado+"</td>" +
									"<td>" +detalleExam[index].precioExamen+
									"</td>" +
									"<td>"+detalleExam[index].numTrabajadoresAsociados+"</td>" +
									"<td>" +detalleExam[index].inversionProgExam+
									"</td>" +
									"</tr>"
					);
				}
			
				
				
				$("#modalPrecio").modal("show");
				$("#mdProgFecha").modal("hide");
				$("#precioTotal").html(
				"Precio Sugerido:  S/. "+precios		
				);

				break;
			default:
				alert("Ocurrió un error al traer la sugerencia!");
			}
		});
	
}

function verEvaluacionMedica(){
   $("#modalEvaluacion").modal({
      keyboard: true,
      show: true,
      "backdrop": "static"
   });
	
   $("#mdProgFecha").modal("hide");
   $("#divImportarEval").hide();
   $("#divEvalNormal").show();
}

function guardarEvaluacionMedica(idFinal){
	var listaEvaluacionTrabs=[];
	for(index=0;index<listEvaluacion.length;index++){
		var trabId=listEvaluacion[index].traId
		.substr(
				3,
				listEvaluacion[index].traId.length);
				
		var restriccion=$("#restriccion"+trabId).val();
		var tipoDiscapacidad=$("#selTipoDisc"+trabId).val();
		
		listaEvaluacionTrabs.push(
		{
			trabajadorId:trabId,
			restriccion:restriccion,
			tipoDiscapacidadId:parseInt(tipoDiscapacidad),
			progMedicaId:programaTipExId
		}		
		);
		
		
	}
	
	var dataParam={
			progExamEstadoId: progExamEstado,
			programaTipExId:programaTipExId,
			trabajadoresEvaluadosObject:listaEvaluacionTrabs
	}
	
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/save', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			$("#modalEvaluacion").modal("hide");
			if(idFinal==1){
				cargarModalprogTipEx();
			}else{
				 
			}
			break;
		default:
			alert("Hay trabajadores que tienen hallazgos médicos");
		}
	});
	
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
	var trabajadoresValidos=0;
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
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					var guardarTrabajador=true;
					if (j === 0) {
						var trabId=0;
						var seguirBusqueda=true;
						listEvaluacion.every(function(val,index2){
							if(val.traNombre==element.trim()
									|| val.trabDni.trim() == element.trim()){
								 trabId=val.traId
								.substr(
										3,
										val.traId.length);

									evals.trabajadorId =parseInt(trabId);
									seguirBusqueda= false;
									trabajadoresValidos=trabajadoresValidos+1;
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
						
						if(evals.trabajadorId > 0){
							
						}else{
							validado = "Trabajador/DNI "+element.trim()+" no reconocido";
							break;
						}

					}
					
					if (j === 1) {
						for (var k = 0; k < listDisca.length; k++) {
							if (listDisca[k].tipoDiscapacidadNombre == element.trim()) {
								evals.tipoDiscapacidadId = listDisca[k].tipoDiscapacidad;
							}
						}

						if (!evals.tipoDiscapacidadId) {
							validado = "Tipo de Resultado" +
									" no reconocido.";
							break;
						}
					}
					if (j === 2) {
						
								evals.restriccion = element.trim();
							
						

						
					}
					
				}
				if(guardarTrabajador){
					evals.progMedicaId=programaTipExId;
					listEvaluaciones.push(evals);
				}
				
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
				+ trabajadoresValidos + " elemento(s)?");
		if (r == true) {
			var dataParam = {
					programaTipExId:programaTipExId,progExamEstadoId : 1,
					trabajadoresEvaluadosObject : listEvaluaciones
			};
			callAjaxPost(URL + '/examenmedico/programacion/evaluacion/save', dataParam,
					function (data) {
				switch (data.CODE_RESPONSE) {
				case "05":
					
					alert("Evaluaciones guardadas");
					$("#modalEvaluacion").modal("hide");
					cargarModalprogTipEx();
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

function ocultarSmartImportProgExamenMedico(){
   $("#divImportProgExamenMedico").modal("hide");  
   $("#mdProgFecha").modal("show");    
}

function verSmartImportProgExamenMedico(){
    $("#mdProgFecha").modal("hide"); 
   $("#divImportProgExamenMedico").remove();
//   $("#mdProgFecha").hide();
    
   var textBackUp = 
      "<a class='efectoLink' href='"+URL+"/examenmedico/programacion/import/plantilla' target='_blank'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	
   var listItemsForm=[
      {sugerencia:"",label:"<i class='fa fa-download'></i> Plantilla Excel: ",inputForm: textBackUp,divContainer:""},
      {sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel: ",inputForm: "",divContainer:"divExcelImport"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:" ",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
		"onclick='ocultarSmartImportProgExamenMedico()'>" +
	       	   "<i class='fa fa-times'></i> Cancelar" +
	       	"</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='submit'>" +
       		    "<i class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>",divContainer:""}
   ];
	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		       	
   var contenido = 
      "<form id='formImportEvento' class='eventoGeneral'>" +
         "<div id='tituloEvento'>" + 
	     text +
         "</div>" +
      "</form>"; 
		       	
   var listPaneles={
      id: "divImportProgExamenMedico",
      nombre: "Actualizar Programación Examen Médico (import)",
      clase: "listaAuxiliar",
      contenido: contenido
   };
		       	
   agregarModalPrincipalColaboradorGeneral(listPaneles,function(){
      var options={
	 container: "#divExcelImport",
	 functionCall: function(){},
	 descargaUrl: "",
	 esNuevo: true,
	 idAux: "ImportExcel",
	 evidenciaNombre: ""
      }; 
	     
      crearFormEvidenciaCompleta(options);
   });
		       	
   $("#formImportEvento").on("submit",function(e){
      e.preventDefault();
      enviarExcelImportProgExamenMedico();
   });
		
//   $('#divImportProgExamenMedico').on('hidden.bs.modal',function(e){
//      $('#mdProgFecha').show();
//   });
}

function enviarExcelImportProgExamenMedico(){    
   estadoInforme = 0;
    
   guardarEvidenciaAuto(0,"fileEviImportExcel",bitsEvidenciaActoInseguro,
   "/examenmedico/programacion/excel/masivo/save",function(data){
      $("#divImportProgExamenMedico").remove();
			   
      if(data.mensaje.length > 0){
         alert(data.mensaje);
         estadoInforme = 1;
      }
			   
      verSmartFinalizarImportProgExamenMedico();
   },"id",[{id: "empresaId",value:getSession("gestopcompanyid")}]);
}

function verSmartFinalizarImportProgExamenMedico(){	
   var btnDescarga = 
      "<a class='efectoLink' target='_blank' href='"+URL+"/trabajador/estado/excel?empresaId="+getSession("gestopcompanyid")+"'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	
   var listItemsForm=[
      {sugerencia:"",label:"<i class='fa fa-file-excel-o'></i> Informe: ",
       inputForm: (estadoInforme == 0?"Se importaron las programaciones de los exámenes médicos.":
                   "Error al importar las programaciones de los exámenes médicos."),divContainer:""},
      {sugerencia:"",label:"",
       inputForm: "<button class='btn btn-success'>" +
       	             "<i class='fa fa-check'></i> Finalizar" +
       	          "</button>",divContainer:""}
   ];	
			
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloGeneral(val);
   });
		       
   var contenido = 
      "<form id='formImportFinalEvento' class='eventoGeneral'>" +
         "<div id='tituloEvento'>" + 
	     text +
         "</div>" +
      "</form>";  
		       	
   var listPaneles={
      id: "divImportFinalProgExamenMedico",
      nombre: "Finalizar Actualizar Programación Examen Médico (import)",
      clase: "listaAuxiliar",
      contenido: contenido
   };
		       	                  
   agregarModalPrincipalColaboradorGeneral(listPaneles,function(){});
		
   $("#formImportFinalEvento").on("submit",function(e){
      e.preventDefault();
      $(".modal").modal("hide");
      $("#divImportProgExamenMedico").remove();
      $("#divImportFinalProgExamenMedico").remove();
      cambiarPaginaTabla();
   });	
}

var listTrabAsistEstEvalExamMed = [];

function regresarConsolidadoTrabajadoresAsistentesEstEvalExamMed(){
   $("#modalConsolidadoTrabAsistEstEvalExamMed").modal("hide");
   $("#mdProgFecha").modal("show");
}

function verConsolidadoTrabajadoresAsistentesEstEvalExamMed(){
   $("#mdProgFecha").modal("hide");
   $("#modalConsolidadoTrabAsistEstEvalExamMed").remove();
    
   var listModal={
      id: "modalConsolidadoTrabAsistEstEvalExamMed",
      maxWidth: "1500px",
      nombre: "Consolidado Trabajadores asistentes - Estado evaluación ",
      contenido:
         "<button class='btn btn-info' id='btnVolverTrabAsistEstEvalExamMed' title='Regresar a la vista anterior.' " +
		 "onclick='regresarConsolidadoTrabajadoresAsistentesEstEvalExamMed()' style='margin-left: 5px'>" + 
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapConTrabAsistEstEvalExamMed'>" +
            "<table id='tblConTrabAsistEstEvalExamMed' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
                  "<tr>" +
		    "<th class='tb-acc' colspan='4' style='width:1400px'>Trabajador</th>" +
		    "<th class='tb-acc' colspan='2' style='width:750px'>Evaluación del examen médico</th>" +
		    "</tr>" +
	          "<tr>" +
		     "<th class='tb-acc'>Nombre</th>" +
		     "<th class='tb-acc'>Unidad</th>" +
		     "<th class='tb-acc'>Área</th>" +
		     "<th class='tb-acc'>Puesto de trabajo</th>" +
		     "<th class='tb-acc'>Resultado</th>" +
		     "<th class='tb-acc'>Restricción</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
         "</div>"};
	   
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConTrabAsistEstEvalExamMed",200);    
   
   cargarConsolidadoTrabajadoresAsistentesEstEvalExamMed();
}

function cargarConsolidadoTrabajadoresAsistentesEstEvalExamMed(){
   $("#btnVolverTrabAsistEstEvalExamMed").show();
    
   var fechaFinAux = $("#inputFecFin").val();
   
   var dataParam={
      programaTipExId: programaTipExId,
      fechaFinTexto: fechaFinAux,
      idCompany: getSession("gestopcompanyid")
   };
  	   
   callAjaxPost(URL+'/examenmedico/programacion/trabajadores/asistidos/resumen',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listTrabAsistEstEvalExamMed = data.listTrabAsistEstEvalExamMed;
  		  
  	    $("#tblConTrabAsistEstEvalExamMed tbody tr").remove();
  		    
  	    listTrabAsistEstEvalExamMed.forEach(function(val,index){
  	       $("#tblConTrabAsistEstEvalExamMed tbody").append(
  	          "<tr id='trConTrabAsistEstEvalExamMed"+val.trabajadorId+"'>" +
  	             "<td id='tdTrabEvalExamMed"+val.trabajadorId+"'>"+val.traNombre+"</td>" +
  	             "<td id='tdUnidadEvalExamMed"+val.trabajadorId+"'>"+val.mdfNombre+"</td>" +
  	             "<td id='tdAreaEvalExamMed"+val.trabajadorId+"'>"+val.areNombre+"</td>" +
  	             "<td id='tdPuestoTrabEvalExamMed"+val.trabajadorId+"'>"+val.ptoNombre+"</td>" +
  	             "<td id='tdResultadoEvalExamMed"+val.trabajadorId+"'>"+val.tipoDiscapacidadNombre+"</td>" +
  	             "<td id='tdRestriccEvalExamMed"+val.trabajadorId+"'>"+val.restriccionMedica+"</td>" +
  		  "</tr>");
  	    }); 
  		     
  	    formatoCeldaSombreableTabla(true,"tblConTrabAsistEstEvalExamMed");
  	    break;
  		     
         default:
            alert("nop");
            break;
      }
  	      
      goheadfixedY("#tblConTrabAsistEstEvalExamMed","#wrapConTrabAsistEstEvalExamMed");
   });       
}
