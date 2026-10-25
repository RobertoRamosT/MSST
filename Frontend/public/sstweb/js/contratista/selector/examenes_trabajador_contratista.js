
var listFullExamenesTrabCon = [],listDocumentosNivTrabContBuscador=[];
var listEvaluacionExaTrabCon = [];
var listTipoExamenTrabCon = [],listTipoExamenTrabConFinal = [];
var listEstadosEvaluacionId = [];
var listTiposExaTraConId = [],listTiposExaTraConIdAux = [];
var busquedaActivaDocNivTrabCont,numPaginaActualDocNivTrabCont,docNivTrabContObj,banderaEdicionDocNivTrabCont;
var mensajeUx;

$(document).ready(function(){
    $("#flechaIzquierdaDocNivTrabCont").on('click',function(){
	numPaginaActualDocNivTrabCont = numPaginaActualDocNivTrabCont-1;
	cambiarPaginaDocumentosNivelTrabajadorContratista();
    });

    $('#flechaDerechaDocNivTrabCont').on('click',function(){
	numPaginaActualDocNivTrabCont = numPaginaActualDocNivTrabCont+1;
	cambiarPaginaDocumentosNivelTrabajadorContratista();
    }); 
});

function ocultarFiltroExaTrabContratista(){
   $("#modalFiltroExaTraContratista").modal("hide");
}

function verFiltroExaTrabContratista(){
   $("#modalFiltroExaTraContratista").modal("show");
}

function crearFiltroExaTrabContratista(functionCallBack){
    $("#modalFiltroExaTraContratista").remove(); 
    
    var dataParam = {}; 
   
    callAjaxPost(URL+'/contratista/examenes/empresa/filtro',dataParam,function(data){
        listEvaluacionExaTrabCon = data.listEvaluacion;listTipoExamenTrabCon = data.listTiposExamenes;
        listTipoExamenTrabConFinal = [];
      
        if(personalizarUsuarioDocumento == 1){
            var examenesHabilitadosId = usuarioConfig.examenesHabilitadosId.split(",");
      
            listTipoExamenTrabCon.forEach(function(val){
                examenesHabilitadosId.forEach(function(val1){
	            if(parseInt(val1) == val.id){
		        listTipoExamenTrabConFinal.push(val);listTiposExaTraConIdAux.push(val.id);
	            }
                });
            });
      
            if(listTipoExamenTrabConFinal.length == 0){
                listTipoExamenTrabCon.forEach(function(val){
                    if([2,34].includes(val.id)){
                	listTipoExamenTrabConFinal.push(val);listTiposExaTraConIdAux.push(val.id)
                    }    	
                });
            }
        }else{
	    listTipoExamenTrabConFinal = listTipoExamenTrabCon;
        }
       
      var contenido = "";
 				
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
          label:"<span style='font-size:18px;font-weight:bolder;'>Fecha de registro</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Inicio",inputForm:"<input type='date' id='fechaInicioExaTrabCon' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fin",inputForm:"<input type='date' id='fechaFinExaTrabCon' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Estados de la evaluación",
	  inputForm:"<a class='efectoLink' onclick='verCheckListTiposNotaDocumentoNivelTrabCont()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	 {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposNotaDocNivTrabCont"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Tipos de examen",
	  inputForm:"<a class='efectoLink' onclick='verCheckListTiposExamenDocumentoNivelTrabCont()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
	 {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTiposExamenDocNivTrabCont"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroExaTrabContratista()'>" +
              	   "<i class='fa fa-times'></i> Cancelar" +
              	"</button>",
 	  inputForm:"<button id='btnAplicarFiltroExaTrabCon' class='btn btn-success' type='submit' " +
 	      		    "onclick='valoresFiltroExaTrabContratista()' style='float:right;font-size:18px;'>" +
 	               "<i class='fa fa-filter'></i> Aplicar filtro" +
 	      	    "</button>"}
      ];
 				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
 				
      var modalOptionsDocPerExt={
	 id:"modalFiltroExaTraContratista",nombre: "<i class='fa fa-filter'></i> Filtros - Documentos nivel trabajador contratista",
 	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
 				
      crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){},true,true);
      
      crearCheckListGeneral("modalFiltroExaTraContratista","Tipos de examen",
          "TipoExamenDocNivTrabContSelec",listTipoExamenTrabConFinal,"TiposExamenDocumentoNivelTrabCont",ocultarCheckListTiposExamenDocumentoNivelTrabCont);
      
      crearCheckListGeneral("modalFiltroExaTraContratista","Estados de la evaluación",
          "TipoNotaDocNivTrabContSelec",listEvaluacionExaTrabCon,"TiposNotaDocumentoNivelTrabCont",cargarCheckListTiposNotaDocumentoNivelTrabCont);
      
      var hoy = getSession("fechaHoyOrdenInversoTexto");
      
      $("#fechaInicioExaTrabCon").val(sumaFechaDias(-120,hoy));$("#fechaFinExaTrabCon").val(sumaFechaDias(15,hoy));
 				
      functionCallBack();completarBarraCarga();
   });
}

function ocultarCheckListTiposExamenDocumentoNivelTrabCont(){
    var textTipoExamenDocNivTrabContSelec = "";

    listTipoExamenTrabConFinal.forEach(function(val,index){
        var isSeleccionado = ($("#checkAsignadoTipoExamenDocNivTrabContSelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
	    textTipoExamenDocNivTrabContSelec += (textTipoExamenDocNivTrabContSelec.length == 0?val.nombre:", "+val.nombre);
	}
    });

    textTipoExamenDocNivTrabContSelec = (textTipoExamenDocNivTrabContSelec.length == 0?"Todos":textTipoExamenDocNivTrabContSelec);

    $("#divSelTiposExamenDocNivTrabCont").html(textTipoExamenDocNivTrabContSelec);

    $("#modalCheckListTipoExamenDocNivTrabContSelec").modal("hide");$("#modalFiltroExaTraContratista").modal("show");
}

function verCheckListTiposExamenDocumentoNivelTrabCont(){
    $("#modalCheckListTipoExamenDocNivTrabContSelec").modal("show");$("#modalFiltroExaTraContratista").modal("hide");
}

function ocultarCheckListTiposNotaDocumentoNivelTrabCont(){
    var textTipoNotaDocNivTrabContSelec = "";

    listEvaluacionExaTrabCon.forEach(function(val,index){
        var isSeleccionado = ($("#checkAsignadoTipoNotaDocNivTrabContSelec"+val.id).prop("checked")?1:0);

	if(isSeleccionado == 1){
            textTipoNotaDocNivTrabContSelec += (textTipoNotaDocNivTrabContSelec.length == 0?val.nombre:", "+val.nombre);
	}
    });

    textTipoNotaDocNivTrabContSelec = (textTipoNotaDocNivTrabContSelec.length == 0?"Todos":textTipoNotaDocNivTrabContSelec);

    $("#divSelTiposNotaDocNivTrabCont").html(textTipoNotaDocNivTrabContSelec);

    $("#modalCheckListTipoNotaDocNivTrabContSelec").modal("hide");$("#modalFiltroExaTraContratista").modal("show");
}

function verCheckListTiposNotaDocumentoNivelTrabCont(){
    $("#modalCheckListTipoNotaDocNivTrabContSelec").modal("show");$("#modalFiltroExaTraContratista").modal("hide");
}

function cargarCheckListTiposNotaDocumentoNivelTrabCont(){
    var tipoNotaSeleccionadosId = [3,4];

    tipoNotaSeleccionadosId.forEach(function(val1){
        var checkboxTipoNota = document.getElementById('checkAsignadoTipoNotaDocNivTrabContSelec'+val1);
        checkboxTipoNota.checked = true;
    });

    ocultarCheckListTiposNotaDocumentoNivelTrabCont();
}

function valoresFiltroExaTrabContratista(){
    ocultarFiltroExaTrabContratista();
   
    if($("#fechaInicioExaTrabCon").val().length > 0 && $("#fechaFinExaTrabCon").val().length > 0){
        listEstadosEvaluacionId = [];
        
        listEvaluacionExaTrabCon.forEach(function(val){
	    var isSeleccionado = ($("#checkAsignadoTipoNotaDocNivTrabContSelec"+val.id).prop("checked")?1:0);

	    if(isSeleccionado == 1){
		listEstadosEvaluacionId.push(val.id);
	    }
	});
       
        listTiposExaTraConId = [];
        
        listTipoExamenTrabConFinal.forEach(function(val){
	    var isSeleccionado = ($("#checkAsignadoTipoExamenDocNivTrabContSelec"+val.id).prop("checked")?1:0);

	    if(isSeleccionado == 1){
		listTiposExaTraConId.push(val.id);
	    }
	});
       
        cargarExamenesTrabajadorContratista();
   }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroExaTraContratista").modal("show");
	});
   }
}

function cargarExamenesTrabajadorContratista(){
    resizeDivWrapper("wrapperExaTrabContratista",165);
    
    $("#valBuscarExaTrabConCampos").val("");
    busquedaActivaDocNivTrabCont = 0,numPaginaActualDocNivTrabCont = 1;
    
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),fechaRegistroInicio:$("#fechaInicioExaTrabCon").val(),fechaRegistroFin:$("#fechaFinExaTrabCon").val(),
        listEstadoId:(listEstadosEvaluacionId.length == 0?null:listEstadosEvaluacionId),listTipoExamenIdFiltro:(listTiposExaTraConId.length == 0?listTiposExaTraConIdAux:listTiposExaTraConId)
    };
	
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/examenes/empresa',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
	    listFullExamenesTrabCon = data.listExamenesTrabCon;
	    
	    mapTrabContratistaVerfIa = new Map();

	    $("#tblExaTrabContratista tbody tr").remove();
	    
	    cambiarPaginaDocumentosNivelTrabajadorContratista();
	 
	    goheadfixedY("#tblExaTrabContratista","#wrapperExaTrabContratista");
        }else{
	    console.log("NOPNPO")
        }
    });
    
    $("#btnFiltroExaTrabContratista").show();$("#btnConsolidadoHojaMsdsExaTrabContratista").show();$("#indicadorPaginaParcialAuxDocNivTrabCont").show();
    $("#btnResetFiltroDocNivTrabCont").show();$("#btnResetBuscadorExaTraCon").show();$("#valBuscarExaTrabConCampos").show();
    $("#btnCancelarDocNivTrabCont").hide();$("#btnGuardarDocNivTrabCont").hide();$("#btnEliminarDocNivTrabCont").hide();
    
    banderaEdicionDocNivTrabCont = false;
}

function cambiarPaginaDocumentosNivelTrabajadorContratista(){
    $("#flechaIzquierdaDocNivTrabCont").show();$("#flechaDerechaDocNivTrabCont").show(); 
   
    var list = (busquedaActivaDocNivTrabCont == 0?listFullExamenesTrabCon:listDocumentosNivTrabContBuscador);
    var totalSize = list.length;
    var partialSize = 100;
	
    var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
    var inicioRegistro = (numPaginaActualDocNivTrabCont*partialSize)-partialSize;
    var finRegistro = (numPaginaActualDocNivTrabCont*partialSize)-1;
	
    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }
		
    $("#labelFlechasDocNivTrabCont").html("<label>"+numPaginaActualDocNivTrabCont+" de "+numPaginaTotal+"</label>");
	 
    if(numPaginaActualDocNivTrabCont == 1){
        $("#flechaIzquierdaDocNivTrabCont").hide();
    }
	
    if(numPaginaActualDocNivTrabCont == numPaginaTotal){
        $("#flechaDerechaDocNivTrabCont").hide();
    }
	 
    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }
   
    $("#tblExaTrabContratista tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
	    var enlaceEvidencia = (val.evidenciaNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia?id="+val.id+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
	        "</a> - ("+getButtonVisorEvidenciaAmazonS3(val.id,val.evidenciaNombre.replace(/['"]/g,''),val.evidenciaUrl,0,0)+")");

	    var enlaceAuxiliar = (val.evidenciaAuxiliarNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar?id="+val.id+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarNombre +
	        "</a>");

	    var enlaceAuxiliarDos = (val.evidenciaAuxiliarDosNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_dos?id="+val.id+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarDosNombre +
	        "</a>");

	    var enlaceAuxiliarTres = (val.evidenciaAuxiliarTresNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/evidencia_auxiliar_tres?id="+val.id+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaAuxiliarTresNombre +
	        "</a>");

	    var enlaceVacunacion = (val.evidenciaVacunacionNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaVacunacionUrl)+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaVacunacionNombre +
	        "</a>");

	    var enlaceDni = (val.evidenciaDniNombre.trim().length == 0?"------":
	        "<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaDniUrl)+"'>"+
	            "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaDniNombre +
	        "</a>");

	    var textEvidencia = (val.tipo.id == 78?"Certificado DIGESA":(val.tipo.id == 79?"Certificado de aptitud médica ocupacional":(val.tipo.id == 98?"Formulario de autorización":"Evidencia"))),
	        textEvidenciaAux = (val.tipo.id == 79?"Certificados médicos adicionales":(val.tipo.id == 90?"Comprobante de pago":"Evidencia auxiliar"));

	    var enlaceVerificarIa = "";

	    if(val.tipo.id == 2 && val.trabajadoresId.length != 0 && (val.evidenciaNombre.length != 0 || val.evidenciaAuxiliarNombre.length != 0)){
		mapTrabContratistaVerfIa.set(val.id,val);
		
	        var extensionEvidencia = getFileExtension(val.evidenciaNombre),extensionEvidenciaAux = getFileExtension(val.evidenciaAuxiliarNombre);
	        var hasEvidenciaPdf = (extensionEvidencia == "pdf"?1:0),hasEvidenciaAuxPdf = (extensionEvidenciaAux == "pdf"?1:0);

	        enlaceVerificarIa = (hasEvidenciaPdf == 0 && hasEvidenciaAuxPdf == 0?"":
	            "<a class='efectoLink' target='_blank' onclick='verVerificacionIaDocTrabCont(\""+val.trabajadoresId+"\","+hasEvidenciaPdf +
	                ",\""+val.evidenciaUrl+"\","+hasEvidenciaAuxPdf+",\""+val.evidenciaAuxiliarUrl+"\")'>" +
	                "<i class='fa fa-user'></i> Verificación DNI" +
	            "</a>");
	    }

	    var detalle = (val.trabajadoresNombre.trim().length > 0?"<strong>*Trabajador(es):</strong> "+val.trabajadoresNombre+"<br>":"") +
	        (val.tipo.id == 79 && val.trabajosAltoRiesgoAsignadosNombre.length > 0?"<strong>*Trabajos de alto riesgo asociados:</strong> "+val.trabajosAltoRiesgoAsignadosNombre+"<br>":"") +
	        (val.tipo.id != 34?"<strong>*"+textEvidencia+":</strong> "+enlaceEvidencia+(enlaceVerificarIa.length == 0?"":" - ["+enlaceVerificarIa+"]"):"") +
	        ([2,79,90].includes(val.tipo.id)?"<br><strong>*"+textEvidenciaAux+":</strong> "+enlaceAuxiliar:"") +
	        (val.tipo.id == 2?"<br><strong>*Comprobante de pago:</strong> "+enlaceAuxiliarDos:"") +
	        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Certificado de clínica:</strong> "+enlaceAuxiliar:"") +
	        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Riesgo de exposición al puesto de trabajo:</strong> "+enlaceAuxiliarDos:"") +
	        (parseInt(getSession("gestopcompanyid")) == 741 && val.tipo.id == 1?"<br><strong>*Vacunación o declaración jurada de no patologías COVID-19:</strong> "+enlaceAuxiliarTres:"") +
			(parseInt(getSession("gestopcompanyid")) == 272 && val.tipo.id == 1?"<br><strong>*Test de altura:</strong> "+enlaceAuxiliar:"") +
	        (val.tipo.id == 34?"<strong>*Carné de vacunación:</strong> "+enlaceVacunacion:"") +
	        (val.tipo.id == 34?"<br><strong>*DNI (Parte frontal):</strong> "+enlaceDni:"") +
	        (val.tipo.id == 8?"<br><strong>*Descripción:</strong> "+(val.tema.trim().length == 0?"------":val.tema):"") +
	        (val.tipo.id == 15?"<br><strong>*Tipo de certificado:</strong> "+val.tipoCertificado.nombre:"") +
	        (val.tipo.id == 34?"<br><strong>*Fecha última dosis:</strong> "+val.fechaUltimaDosisTexto:"") +
	        (val.tipo.id == 34?"<br><strong>*Tipo de vacuna:</strong> "+val.tipoVacunaCovid.nombre:"") +
	        (val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*N° de dosis recibidas:</strong> "+val.numCantidadDosis:"") +
	        (val.tipo.id == 34 && val.numCantidadDosis > 0?"<br><strong>*Observación adicional:</strong> "+(val.observacion.trim().length == 0?"------":val.observacion):"") +
	        (val.tipo.id == 79?"<br><strong>*Clínica (certificación DIGESA):</strong> "+val.clinicaCertifDigesaNombre:"") +
	        (val.tipo.id == 79?"<br><strong>*¿Va a realizar alguna de las actividades listadas?</strong> "+(val.hasTrabAltoRiesgo == 1?"Sí":"No"):"") +
	        (val.tipo.id == 79 && val.hasTrabAltoRiesgo == 1?"<br><strong>*Actividad(es) seleccionada(s):</strong> "+(val.trabajosAltoRiesgoHabilitadosNombre.length == 0?"------":val.trabajosAltoRiesgoHabilitadosNombre):"") +
	        (![14,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha inicio de vigencia:</strong> "+val.fechaTexto:"") +
	        (![14,34,101,128,129,130,132,133,134].includes(val.tipo.id)?"<br><strong>*Fecha fin de vigencia:</strong> "+val.fechaFinVigenciaTexto:"") +
	        (val.evidenciaFechaTexto == "------" && val.fechaRegistroVacunacionTexto == "------"?"":"<br><strong>*Registrado el "+(val.tipo.id == 34?val.fechaRegistroVacunacionTexto:val.evidenciaFechaTexto)+"</strong>");
	        
	    var evaluacionObservacion = (val.evaluacion.observacion.trim().length > 0?val.evaluacion.observacion:"------"),
	        evaluacionFecha = val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.trim().length == 0?"":"<br>(por "+val.evaluacion.usuario.nombre+")");

	    var opcionEditar = (val.evaluacion.nota.id == 1?"":"editarDocumentosNivelTrabajadorContratista("+index+")");
	  
            $("#tblExaTrabContratista tbody").append(
                "<tr id='trDocNivTrabCont"+val.id+"' onclick='"+opcionEditar+"'>" +
                    "<td id='docNivTrabContContratista"+val.id+"'>("+val.contratista.ruc+") "+val.contratista.nombre+"</td>" +
                    "<td id='docNivTrabContTipo"+val.id+"'>"+val.tipo.nombre+"</td>" +
                    "<td id='docNivTrabContDetalle"+val.id+"' style='text-align:left;word-break:break-all;'>"+detalle+"</td>" +
                    "<td id='docNivTrabContEvalEstado"+val.id+"' style='border-left:3px solid #afb5bb'>"+val.evaluacion.nota.icono+" "+val.evaluacion.nota.nombre+"</td>" +
                    "<td id='docNivTrabContEvalObs"+val.id+"'>"+evaluacionObservacion+"</td>" +
                    "<td id='docNivTrabContEvalFecha"+val.id+"'>"+evaluacionFecha+"</td>" +
	        "</tr>");
        }
    });

    $.unblockUI();
    formatoCeldaSombreableTabla(true,"tblExaTrabContratista");
}

function buscarExamenTrabajadorContratistaCampos(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
    var exaPerExtRegistro = igualarStringBuscar($("#valBuscarExaTrabConCampos").val());
    listDocumentosNivTrabContBuscador = [];
    busquedaActivaDocNivTrabCont = 1;numPaginaActualDocNivTrabCont = 1;
   	
    listFullExamenesTrabCon.forEach(function(val,index){
        if(igualarStringBuscar(val.contratista.nombre).indexOf(exaPerExtRegistro) != -1 || 
            igualarStringBuscar(val.contratista.ruc).indexOf(exaPerExtRegistro) != -1 ||
    	    igualarStringBuscar(val.trabajadoresNombre).indexOf(exaPerExtRegistro) != -1){
            listDocumentosNivTrabContBuscador.push(val);
        }
    });
    
    cambiarPaginaDocumentosNivelTrabajadorContratista();
}

function reiniciarFiltroExamenTrabajadorContratista(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarExaTrabConCampos").val("").focus();
    busquedaActivaDocNivTrabCont = 0;numPaginaActualDocNivTrabCont = 1;
     
    cambiarPaginaDocumentosNivelTrabajadorContratista();
}

function editarDocumentosNivelTrabajadorContratista(pindex){
    if(!banderaEdicionDocNivTrabCont){
	docNivTrabContObj = (busquedaActivaDocNivTrabCont == 0?listFullExamenesTrabCon[pindex]:listDocumentosNivTrabContBuscador[pindex]);
        
        $("#trDocNivTrabCont"+docNivTrabContObj.id).addClass("fila-edicion");
       
        var selEvalEstadoDocNivTrabCont = crearSelectOneMenuOblig("selEvalEstadoDocNivTrabCont","",
            listEvaluacionExaTrabCon,docNivTrabContObj.evaluacion.nota.id,"id","nombre");
       
        $("#docNivTrabContEvalEstado"+docNivTrabContObj.id).html(selEvalEstadoDocNivTrabCont);
       
        $("#docNivTrabContEvalObs"+docNivTrabContObj.id).html("<textarea id='textEvalObsDocNivTrabCont' class='form-control' rows='8'></textarea>");
        $("#textEvalObsDocNivTrabCont").val(docNivTrabContObj.evaluacion.observacion);
       
        $("#docNivTrabContEvalFecha"+docNivTrabContObj.id).html("<label>*Automático.</label>");

        formatoCeldaSombreableTabla(false,"tblExaTrabContratista");
       
        $("#btnFiltroExaTrabContratista").hide();$("#btnConsolidadoHojaMsdsExaTrabContratista").hide();$("#indicadorPaginaParcialAuxDocNivTrabCont").hide();
        $("#btnResetFiltroDocNivTrabCont").hide();$("#btnResetBuscadorExaTraCon").hide();$("#valBuscarExaTrabConCampos").hide();
        $("#btnCancelarDocNivTrabCont").show();$("#btnGuardarDocNivTrabCont").show();$("#btnEliminarDocNivTrabCont").show();

        banderaEdicionDocNivTrabCont = true;
    }
}

function eliminarFilaExamenTrabajadorContratista(){	  
   mensajeUx="<label>¿Está seguro de eliminar este documento "+docNivTrabContObj.tipo.nombre+"?</label>";
   mensajesUx(mensajeUx,3,"","EliminarDocNivTrabCont");

   $("#btnDevolverValorEliminarDocNivTrabCont").on("click",function(){
      var dataParam={
         id:docNivTrabContObj.id,bucketNombre:BUCKETAMAZONS3
      };

      callAjaxPost(URL+'/contratista/examen/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El documento "+docNivTrabContObj.tipo.nombre+" seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarDocNivTrabCont");

               $("#modalMensajeUxActualizarDocNivTrabCont").on("hidden.bs.modal",function(){
        	   cargarExamenesTrabajadorContratista();  
               });

               break;
 				
            default:
               alert("Ocurrió un error al eliminar el documento!");
         }
      });
   });    
}

function guardarDocumentosNivelTrabajadorContratista(){
    var campoVacio = true;
   
    var evalEstadoId = parseInt($("#selEvalEstadoDocNivTrabCont").val());
    var evalObservacion = $("#textEvalObsDocNivTrabCont").val().trim();
    var snEnviarCorreo = (docNivTrabContObj.evaluacion.nota.id != evalEstadoId && [1,2].includes(evalEstadoId)?1:0);
   
    if(campoVacio){
        var dataParam={
	    id:docNivTrabContObj.id,evaluacion:{nota:{id:evalEstadoId},observacion:evalObservacion},snEnviarCorreo:snEnviarCorreo
        };
	        
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/examen/evaluacion/observacion/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":
	            mensajeUx = "<label>La evaluación del documento fue guardada con éxito." +(snEnviarCorreo == 1 && 
	                [1,2].includes(evalEstadoId)?"<br><br>*Se envió un correo de notificación a la persona de contacto.":"")+"</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarDocNivTrabCont"); 
								   
	            $("#modalMensajeUxActualizarDocNivTrabCont").on("hidden.bs.modal",function(){
	        	cargarExamenesTrabajadorContratista();  
	            });
		
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar la evaluación del documento.");
	    }
        });	
    }else{
       
    }	
}

var listHojasQuimicaExaTrabCon=[];

function volverPrincipalExaTrabContratista(){
   $("#modalHojaMsdsExaTrabContratista").modal("hide");
}

function verConsolidadoHojaMsdsExaTrabContratista(){
   $("#modalHojaMsdsExaTrabContratista").remove();
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverExaTrabContratista' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalExaTrabContratista()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalHojaMsdsExaTrabContratista",
      nombre:"<i class='fa fa-table'></i> Consolidado Hojas MSDS",
      contenido: 
          buttonVolver +
         "<div class='wrapper' id='wrapperHojaMsdsExaTrabCon'>" +
            "<table id='tblHojaMsdsExaTrabCon' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<td class='tb-acc' style='width:400px'>Contratista</th>" +
	             "<td class='tb-acc' style='width:150px'>Fecha de registro</th>" +
	             "<td class='tb-acc' style='width:300px'>Nombre del Producto Químico (PQ)</th>" +
		     "<td class='tb-acc' style='width:300px'>Usado para</th>" +
		     "<td class='tb-acc' style='width:300px'>Peligros Asociados al uso del PQ</th>" +
		     "<td class='tb-acc' style='width:300px'>Puestos que manipularán el PQ</th>" +
		     "<td class='tb-acc' style='width:300px'>Equipo de Proteccion necesario</th>" +
		     "<td class='tb-acc' style='width:300px'>Evidencia</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperHojaMsdsExaTrabCon",190);
   cargarConsolidadoHojaMsdsExaTrabContratista();
}

function cargarConsolidadoHojaMsdsExaTrabContratista(){
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/contratista/hojaquimica/consolidado',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listHojasQuimicaExaTrabCon = data.listHojasQuimica;
						
	 $("#tblHojaMsdsExaTrabCon tbody tr").remove();
		
	 listHojasQuimicaExaTrabCon.forEach(function(val){	
	    var enlaceEvidencia = (val.evidenciaNombre.length == 0?"------":
	       "<a class='efectoLink' target='_blank' " +
	          "href='"+URL+"/contratista/hojaquimica/evidencia?id="+val.id+"'>" +
	          "<i class='fa fa-download' aria-hidden='true'></i> "+val.evidenciaNombre +
	       "</a>");
	     
	    $("#tblHojaMsdsExaTrabCon tbody").append(
	       "<tr>" +
	          "<td>"+val.contratista.nombre+"</td>" +
	          "<td>"+val.fechaEvidenciaTexto+"</td>" +
		  "<td>"+val.nombre+"</td>" +
		  "<td>"+val.uso+"</td>" + 
		  "<td>"+val.peligro+"</td>" + 
		  "<td>"+val.puesto+"</td>" + 
		  "<td>"+val.equipoNecesario+"</td>" + 
		  "<td>"+enlaceEvidencia+"</td>" + 
	       "</tr>");
	 });
	      
	 goheadfixedY("#tblHojaMsdsExaTrabCon","#wrapperHojaMsdsExaTrabCon");
      }else{
         console.log("Error al cargar el consolidado - Hojas MSDS");
      }
   });    
}
