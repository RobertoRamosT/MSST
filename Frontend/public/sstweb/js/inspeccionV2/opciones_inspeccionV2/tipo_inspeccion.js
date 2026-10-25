
var tipoInspeccionV2Id,tipoInspeccionV2Obj={};
var banderaEdicionTipoInspeccionV2 = false;
var listFullTipoInspeccionV2 = [],textoBuscarTipoInspeccionV2 = "";
var numPaginaActualTipoInspeccionV2 = 1,totalPaginasTipoInspeccionV2 = 0,actualizarPrincipalTipoInspeccionV2;

function ocultarConsolidadoTipoInspeccionV2(){
    $("#modalConsolidadoTipoInspeccionV2").modal("hide");
	
	if(actualizarPrincipalTipoInspeccionV2 == 1){
	    crearFiltroPrincipalInspeccionV2(valoresFiltroPrincipalInspeccionV2);
	}
}

function verConsolidadoTipoInspeccionV2(){
    $("#modalConsolidadoTipoInspeccionV2").remove();
	
	actualizarPrincipalTipoInspeccionV2 = 0;

    var buttonVolver =
        "<button type='button' id='btnOcultarTipoInspeccionV2' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoTipoInspeccionV2()' title='Regresar a la vista principal'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";
		
    var buttonImportExcel = 
	    "<button id='btnImportExcelTipoInspeccionV2' type='button' class='btn btn-excel' style='margin-right:5px' onclick='verImportExcelTipoInspeccionV2()' " +
		        "title='Método import por medio de un excel.'>" +
		    "<i class='fa fa-upload fa-2x'></i> <i class='fa fa-file-excel-o'></i>" +
		"</button>";

    var buttonCancelar =
        "<button id='btnCancelarTipoInspeccionV2' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='cancelarConsolidadoTipoInspeccionV2()' title='Cancelar'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button id='btnGuardarTipoInspeccionV2' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarConsolidadoTipoInspeccionV2()' title='Guardar'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaTipoInspeccionV2' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaTipoInspeccionV2'><img src='../imagenes/flecha_01.png' /></a>" +
            " <em id='labelFlechasTipoInspeccionV2'></em> " +
            "<a id='flechaDerechaTipoInspeccionV2'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorTipoInspeccionV2' type='button' class='btn btn-success' " +
                "title='Restablecer búsqueda' onclick='reiniciarBuscadorConsolidadoTipoInspeccionV2()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorTipoInspeccionV2' type='button' class='btn btn-success' onclick='aplicarBuscadorConsolidadoTipoInspeccionV2()' " +
                "style='float:right;margin-right:5px;' title='Buscar por nombre de inspección'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorTipoInspeccionV2' placeholder='Nombre de inspección' maxlength='200' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoTipoInspeccionV2",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
        nombre:"<i class='fa fa-table'></i> Consolidado de listas de inspección",
        contenido:
            "<div class='eventoGeneral-moderno'>" +
            "<form class='form-inline'>" +
                 buttonVolver+buttonImportExcel+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoTipoInspeccionV2'>" +
                "<table id='tblConsolidadoTipoInspeccionV2' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:250px'>Inspección</td>" +
                            "<td class='tb-acc' style='width:150px'>N° de preguntas asociadas</td>" +
							"<td class='tb-acc' style='width:150px'>¿Autoinspección?</td>" +
                            "<td class='tb-acc' style='width:150px'>¿Activo?</td>" +
                            "<td class='tb-acc' style='width:200px'>Registrado el</td>" +
                            "<td class='tb-acc' style='width:200px'>Actualizado el</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoTipoInspeccionV2",240);
    textoBuscarTipoInspeccionV2 = "";
    cargarConsolidadoTipoInspeccionV2(1);

    $("#flechaIzquierdaTipoInspeccionV2").on('click',function(){
        $("#valBuscarValorTipoInspeccionV2").val(textoBuscarTipoInspeccionV2);
        cargarConsolidadoTipoInspeccionV2(numPaginaActualTipoInspeccionV2-1);
    });

    $('#flechaDerechaTipoInspeccionV2').on('click',function(){
        $("#valBuscarValorTipoInspeccionV2").val(textoBuscarTipoInspeccionV2);
        cargarConsolidadoTipoInspeccionV2(numPaginaActualTipoInspeccionV2+1);
    });
}

function cargarConsolidadoTipoInspeccionV2(pagina){
    banderaEdicionTipoInspeccionV2 = false;

    $("#btnOcultarTipoInspeccionV2").show();$("#btnCancelarTipoInspeccionV2").hide();$("#btnGuardarTipoInspeccionV2").hide();
    $("#btnAplicarBuscadorTipoInspeccionV2").show();$("#valBuscarValorTipoInspeccionV2").show();$("#indicadorPaginaTipoInspeccionV2").show();
	$("#btnResetBuscadorTipoInspeccionV2").show();$("#btnImportExcelTipoInspeccionV2").show();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),pagina:pagina,textoBuscar:textoBuscarTipoInspeccionV2
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/tipo_inspeccion',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            listFullTipoInspeccionV2 = data.listTipoInspeccionV2;
            numPaginaActualTipoInspeccionV2 = data.pagina;totalPaginasTipoInspeccionV2 = data.totalPaginas;

            cambiarPaginaConsolidadoTipoInspeccionV2();

            goheadfixedY("#tblConsolidadoTipoInspeccionV2","#wrapperConsolidadoTipoInspeccionV2");
            formatoCeldaSombreableTabla(true,"tblConsolidadoTipoInspeccionV2");
        }else if(data.CODE_RESPONSE == "25"){
			$("#modalConsolidadoTipoInspeccionV2").modal("hide");
			
			mensajeUx = "<label>"+data.mensaje+"</label>";
			mensajesUx(mensajeUx,2,"","ActualizarTipoInspeccionV2");
		}else{
            alert("Error al cargar el consolidado de listas de inspección");
        }

    });
}

function cambiarPaginaConsolidadoTipoInspeccionV2(){
    $("#flechaIzquierdaTipoInspeccionV2").show();$("#flechaDerechaTipoInspeccionV2").show();

    var numPaginaTotal = (totalPaginasTipoInspeccionV2 == 0?1:totalPaginasTipoInspeccionV2);

    $("#labelFlechasTipoInspeccionV2").html("<label>"+numPaginaActualTipoInspeccionV2+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualTipoInspeccionV2 == 1){
        $("#flechaIzquierdaTipoInspeccionV2").hide();
    }

    if(numPaginaActualTipoInspeccionV2 == numPaginaTotal){
        $("#flechaDerechaTipoInspeccionV2").hide();
    }

    $("#tblConsolidadoTipoInspeccionV2 tbody tr").remove();

	if(listFullTipoInspeccionV2.length == 0){
	    $("#tblConsolidadoTipoInspeccionV2 tbody").append("<tr>"+"<td colspan='6' style='text-align:center;'>Sin registros</td>"+"</tr>");
	}

    listFullTipoInspeccionV2.forEach(function(val,index){
        var nombre = $("<div>").text(val.nombre).html();
        var fechaRegistro = val.fechaRegistroTexto,fechaActualizacion = val.fechaActualizacionTexto;

        $("#tblConsolidadoTipoInspeccionV2 tbody").append(
            "<tr id='trConsTipoInspeccionV2"+val.id+"' onclick='editarConsolidadoTipoInspeccionV2("+index+")'>" +
                "<td id='nombreTipoInspeccionV2"+val.id+"'>"+nombre+"</td>" +
                "<td id='numPreguntasTipoInspeccionV2"+val.id+"'>"+val.numPreguntas+"</td>" +
				"<td id='autoInspeccionTipoInspeccionV2"+val.id+"'>"+(val.autoInspeccion == 1?"Sí":"No")+"</td>" +
                "<td id='activoTipoInspeccionV2"+val.id+"'>"+(val.snActivo == 1?"Sí":"No")+"</td>" +
                "<td id='fechaRegTipoInspeccionV2"+val.id+"'>"+fechaRegistro+"</td>" +
                "<td id='fechaActTipoInspeccionV2"+val.id+"'>"+fechaActualizacion+"</td>" +
            "</tr>");
    });

    $.unblockUI();
}

function cancelarConsolidadoTipoInspeccionV2(){
    reiniciarBuscadorConsolidadoTipoInspeccionV2();
}

function editarConsolidadoTipoInspeccionV2(pindex){
    if(!banderaEdicionTipoInspeccionV2){
        formatoCeldaSombreableTabla(false,"tblConsolidadoTipoInspeccionV2");
        tipoInspeccionV2Obj = listFullTipoInspeccionV2[pindex];
        tipoInspeccionV2Id = tipoInspeccionV2Obj.id;

        $("#trConsTipoInspeccionV2"+tipoInspeccionV2Id).addClass("fila-edicion");

        $("#activoTipoInspeccionV2"+tipoInspeccionV2Id).html("<input id='cbActivoTipoInspeccionV2' type='checkbox' class='form-control'>");
        $("#cbActivoTipoInspeccionV2").prop("checked",(tipoInspeccionV2Obj.snActivo == 1));

		if(tipoInspeccionV2Obj.numPreguntas > 0){
        	$("#numPreguntasTipoInspeccionV2"+tipoInspeccionV2Id).addClass("linkGosst").on("click",function(){
            	verConsolidadoPreguntaTipoInspeccionV2();
        	}).html(tipoInspeccionV2Obj.numPreguntas+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
		}
		
        $("#fechaActTipoInspeccionV2"+tipoInspeccionV2Id).html("<label>*Automático.</label>");

        banderaEdicionTipoInspeccionV2 = true;

        $("#btnOcultarTipoInspeccionV2").hide();$("#btnCancelarTipoInspeccionV2").show();$("#btnGuardarTipoInspeccionV2").show();
        $("#indicadorPaginaTipoInspeccionV2").hide();$("#btnResetBuscadorTipoInspeccionV2").hide();$("#btnAplicarBuscadorTipoInspeccionV2").hide();
		$("#valBuscarValorTipoInspeccionV2").hide();$("#btnImportExcelTipoInspeccionV2").hide();
    }
}

function guardarConsolidadoTipoInspeccionV2(){
    var campoVacio = true;

    var snActivo = ($("#cbActivoTipoInspeccionV2").prop("checked")?1:0);

    if(campoVacio){
        var dataParam={
            id:tipoInspeccionV2Id,snActivo:snActivo,empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/tipo_inspeccion/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalConsolidadoTipoInspeccionV2").modal("hide");

                    mensajeUx = "<label>El registro tipo de inspección fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarTipoInspeccionV2");

                    $("#modalMensajeUxActualizarTipoInspeccionV2").on("hidden.bs.modal",function(){
                        $("#modalConsolidadoTipoInspeccionV2").modal("show");actualizarPrincipalTipoInspeccionV2 = 1;
						reiniciarBuscadorConsolidadoTipoInspeccionV2();
                    });
					
                    break;
					
				case "25":
					$("#modalConsolidadoTipoInspeccionV2").modal("hide");

					mensajeUx = "<label>"+data.mensaje+"</label>";
					mensajesUx(mensajeUx,2,"","ActualizarTipoInspeccionV2");

					$("#modalMensajeUxActualizarTipoInspeccionV2").on("hidden.bs.modal",function(){
					    $("#modalConsolidadoTipoInspeccionV2").modal("show");
					});
										
				    break;

                default:
                    alert("Ocurrió un error al guardar el estado de la lista de inspección!");
					
					break;
            }
        });
    }else{
        $("#modalConsolidadoTipoInspeccionV2").modal("hide");

        mensajesUx("",2,"","ValidacionTipoInspeccionV2");

        $("#modalMensajeUxValidacionTipoInspeccionV2").on("hidden.bs.modal",function(){
            $("#modalConsolidadoTipoInspeccionV2").modal("show");
        });
    }
}

function aplicarBuscadorConsolidadoTipoInspeccionV2(){
    textoBuscarTipoInspeccionV2 = $("#valBuscarValorTipoInspeccionV2").val();

    cargarConsolidadoTipoInspeccionV2(1);
}

function reiniciarBuscadorConsolidadoTipoInspeccionV2(){
    textoBuscarTipoInspeccionV2 = "";$("#valBuscarValorTipoInspeccionV2").val("");

    cargarConsolidadoTipoInspeccionV2(1);
}

function ocultarImportExcelTipoInspeccionV2(){
    $("#modalImportExcelTipoInspeccionV2").modal("hide");$("#modalConsolidadoTipoInspeccionV2").modal("show");
}

function verImportExcelTipoInspeccionV2(){
    $("#modalConsolidadoTipoInspeccionV2").modal("hide");$("#modalImportExcelTipoInspeccionV2").remove();

	var enlacePlantilla =
	    "<a class='efectoLink' href='"+URL+"/inspeccionv2/import/tipo_inspeccion/plantilla' target='_blank'>" +
	        "<i class='fa fa-download'></i> Descargar" +
	    "</a>";

    var listBooleanSiNo = listBoolean.sort(function(val,val2){
	    return val2.id - val.id;
	});
			
	var radiosAutoInspTipoInspeccionV2 = crearRadiosAutoVersionDos("radiosAutoInspTipoInspeccionV2",
		listBooleanSiNo,"0","id","nombre","","");

    var contenido = "";

	var listContenido=[
		{anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Tipo de inspección",inputForm:""},
		{anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='2' maxlength='200' id='textNombreTipoInspeccionV2'></textarea>"},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Autoinspección?",inputForm:radiosAutoInspTipoInspeccionV2},
	    {label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Plantilla",inputForm:enlacePlantilla},
		{label:"",inputForm:"",styleTotal:styleLineaCortaCentrada},
		{label:"Archivo excel",inputForm:"",idDivContainer:"divExcelImportTipoInspeccionV2"},
	  	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	  	{label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarImportExcelTipoInspeccionV2()'>" +
	               "<i class='fa fa-arrow-left'></i> Regresar" +
	           "</button>",
	  	 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='validacionImportExcelTipoInspeccionV2()'>" +
	  	               "<i class='fa fa-upload'></i> Importar" +
	  	           "</button>"}
    ]; 
	  				
    listContenido.forEach(function(val){
	    contenido += obtenerSubPanelModuloVersionTres(val);
    });

    var modalOptions={
        id:"modalImportExcelTipoInspeccionV2",nombre:"<i class='fa fa-upload'></i> Método import - tipo de inspección",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var options={
	    container:"#divExcelImportTipoInspeccionV2",functionCall:function(){},descargaUrl:"",esNuevo:true,
		idAux:"ImportExcelTipoInspeccionV2",evidenciaNombre:""
    };

 	crearFormEvidenciaCompleta(options);
}

function validacionImportExcelTipoInspeccionV2(){
    var campoVacio = true;
   
	var nombreTipo = $("#textNombreTipoInspeccionV2").val().trim();
	var snAutoinspeccion = parseInt($("input[name='radiosAutoInspTipoInspeccionV2']:checked").val());
    var nombreExcel = $("#inputEviImportExcelTipoInspeccionV2").val();
	var archivoExcel = document.getElementById("fileEviImportExcelTipoInspeccionV2").files[0];
    
	if(nombreTipo.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe completar todos los campos.</label>";
	}else if(nombreTipo.length > 200){
		campoVacio = false;mensajeUx = "<label>El nombre de la inspección no puede superar los 200 caracteres.</label>";
	}else if(nombreExcel.length == 0 || !archivoExcel){
        campoVacio = false;mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
    }else if(archivoExcel.size > bitsImportExcel){
		campoVacio = false;mensajeUx = "<label>El archivo Excel no puede superar los 5 MB.</label>";
    }

    if(campoVacio){
	    guardarEvidenciaAuto(0,"fileEviImportExcelTipoInspeccionV2",bitsImportExcel,"/inspeccionv2/import/tipo_inspeccion/save",function(data){
			switch(data.CODE_RESPONSE){
			    case "05":
	                $("#modalImportExcelTipoInspeccionV2").modal("hide");
		    
	        		if(data.mensaje.length > 0){
		        		mensajeUx = "<label style='text-align:left;white-space:pre-wrap;'>"+$("<div>").text(data.mensaje).html()+"</label>";
		    			mensajesUx(mensajeUx,4,"","ActualizarImportTipoInspeccionV2");
	        		}else{
						mensajeUx = "<label>Ocurrió un error al realizar el import.</label>";
						mensajesUx(mensajeUx,2,"","ActualizarImportTipoInspeccionV2");
	        		}
			
					$("#modalMensajeUxActualizarImportTipoInspeccionV2").on("hidden.bs.modal",function(){
						$("#modalConsolidadoTipoInspeccionV2").modal("show");actualizarPrincipalTipoInspeccionV2 = 1;
						reiniciarBuscadorConsolidadoTipoInspeccionV2();
					});
					
					break;
					
				case "25":
					$("#modalImportExcelTipoInspeccionV2").modal("hide");
					
					mensajeUx = "<label style='text-align:left;white-space:pre-wrap;'>"+$("<div>").text(data.mensaje).html()+"</label>";
					mensajesUx(mensajeUx,4,"","ActualizarImportTipoInspeccionV2");
					
					$("#modalMensajeUxActualizarImportTipoInspeccionV2").on("hidden.bs.modal",function(){
					    $("#modalImportExcelTipoInspeccionV2").modal("show");
					});
					
					break;
				
				default:
					alert("Ocurrió un error al intentar importar los registros del archivo excel.");

					break;
		    }
	    },"id",[{id:"nombreTipo",value:nombreTipo},{id:"snAutoinspeccion",value:snAutoinspeccion},{id:"empresaId",value:getSession("gestopcompanyid")}]);
   }else{
	   $("#modalImportExcelTipoInspeccionV2").modal("hide");
	
       mensajesUx(mensajeUx,2,"","AvisoCompletarImportTipoInspeccionV2");

       $("#modalMensajeUxAvisoCompletarImportTipoInspeccionV2").on("hidden.bs.modal",function(){
	       $("#modalImportExcelTipoInspeccionV2").modal("show");   
       });   
   }
}

var listFullPreguntaTipoInspeccionV2 = [];
var numPaginaActualPreguntaTipoInspeccionV2 = 1,totalPaginasPreguntaTipoInspeccionV2 = 0;

function ocultarConsolidadoPreguntaTipoInspeccionV2(){
    $("#modalConsolidadoPreguntaTipoInspeccionV2").modal("hide");$("#modalConsolidadoTipoInspeccionV2").modal("show");
}

function verConsolidadoPreguntaTipoInspeccionV2(){
    $("#modalConsolidadoTipoInspeccionV2").modal("hide");$("#modalConsolidadoPreguntaTipoInspeccionV2").remove();

    var nombre = $("<div>").text(tipoInspeccionV2Obj.nombre).html();

    var buttonVolver =
        "<button type='button' id='btnOcultarPreguntaTipoInspeccionV2' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoPreguntaTipoInspeccionV2()' title='Regresar a la vista anterior'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaPreguntaTipoInspeccionV2' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaPreguntaTipoInspeccionV2'><img src='../imagenes/flecha_01.png' /></a>" +
            " <em id='labelFlechasPreguntaTipoInspeccionV2'></em> " +
            "<a id='flechaDerechaPreguntaTipoInspeccionV2'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoPreguntaTipoInspeccionV2",contenidoClassAux:"modal-content-moderno",btnCerrarHabilitado:0,
        nombre:"<i class='fa fa-table'></i> Preguntas de la inspección '"+nombre+"'",
        contenido:
            "<div class='eventoGeneral-moderno'>" +
            "<form class='form-inline'>" +
                 buttonVolver+buttonFlechas +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoPreguntaTipoInspeccionV2'>" +
                "<table id='tblConsolidadoPreguntaTipoInspeccionV2' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:250px'>Categoría</td>" +
                            "<td class='tb-acc' style='width:650px'>Pregunta</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoPreguntaTipoInspeccionV2",240);
    cargarConsolidadoPreguntaTipoInspeccionV2(1);

    $("#flechaIzquierdaPreguntaTipoInspeccionV2").on('click',function(){
        cargarConsolidadoPreguntaTipoInspeccionV2(numPaginaActualPreguntaTipoInspeccionV2-1);
    });

    $("#flechaDerechaPreguntaTipoInspeccionV2").on('click',function(){
        cargarConsolidadoPreguntaTipoInspeccionV2(numPaginaActualPreguntaTipoInspeccionV2+1);
    });
}

function cargarConsolidadoPreguntaTipoInspeccionV2(pagina){
    var dataParam={
        auditoriaTipo:tipoInspeccionV2Id,empresaId:parseInt(getSession("gestopcompanyid")),pagina:pagina
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/tipo_inspeccion/pregunta',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            listFullPreguntaTipoInspeccionV2 = data.listPreguntaTipoInspeccionV2;
            numPaginaActualPreguntaTipoInspeccionV2 = data.pagina;totalPaginasPreguntaTipoInspeccionV2 = data.totalPaginas;

            cambiarPaginaConsolidadoPreguntaTipoInspeccionV2();

            goheadfixedY("#tblConsolidadoPreguntaTipoInspeccionV2","#wrapperConsolidadoPreguntaTipoInspeccionV2");
        }else if(data.CODE_RESPONSE == "25"){
            $("#modalConsolidadoPreguntaTipoInspeccionV2").modal("hide");

            mensajeUx = "<label>"+data.mensaje+"</label>";
            mensajesUx(mensajeUx,2,"","ActualizarPreguntaTipoInspeccionV2");

            $("#modalMensajeUxActualizarPreguntaTipoInspeccionV2").on("hidden.bs.modal",function(){
                $("#modalConsolidadoTipoInspeccionV2").modal("show");
            });
        }else{
            console.log("Error al cargar el consolidado de preguntas de la inspección '"+tipoInspeccionV2Obj.nombre+"'");
        }
    });
}

function cambiarPaginaConsolidadoPreguntaTipoInspeccionV2(){
    $("#flechaIzquierdaPreguntaTipoInspeccionV2").show();$("#flechaDerechaPreguntaTipoInspeccionV2").show();

    var numPaginaTotal = (totalPaginasPreguntaTipoInspeccionV2 == 0?1:totalPaginasPreguntaTipoInspeccionV2);

	$("#labelFlechasPreguntaTipoInspeccionV2").html("<label>"+numPaginaActualPreguntaTipoInspeccionV2+" de "+numPaginaTotal+"</label>");

	if(numPaginaActualPreguntaTipoInspeccionV2 == 1){
	    $("#flechaIzquierdaPreguntaTipoInspeccionV2").hide();
	}

	if(numPaginaActualPreguntaTipoInspeccionV2 == numPaginaTotal){
	    $("#flechaDerechaPreguntaTipoInspeccionV2").hide();
	}

    $("#tblConsolidadoPreguntaTipoInspeccionV2 tbody tr").remove();

	listFullPreguntaTipoInspeccionV2.forEach(function(val){
        var categoriaNombre = $("<div>").text(val.categoriaNombre).html();
        var verificacion = $("<div>").text(val.verificacion).html();

    	$("#tblConsolidadoPreguntaTipoInspeccionV2 tbody").append(
            "<tr id='trConsPreguntaTipoInspeccionV2"+val.id+"'>" +
                "<td id='categoriaPreguntaTipoInspeccionV2"+val.id+"'>"+categoriaNombre+"</td>" +
            	"<td id='nombrePreguntaTipoInspeccionV2"+val.id+"' style='white-space:pre-wrap;'>"+verificacion+"</td>" +
        	"</tr>");
    });
}
