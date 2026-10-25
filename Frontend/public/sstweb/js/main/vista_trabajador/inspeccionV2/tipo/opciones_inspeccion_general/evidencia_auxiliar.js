
var respuestaAuxInspeccV2GenObj = {},infoAuxInspeccV2GenObj = {};

function validacionEvidenciaAuxiliarInspeccV2Gen(acceso,pTipoEaId,pNumPregunta,pDetalleAuditoriaId,pAuditoriaId,pVerificacionId){
    var accesoAux = parseInt(acceso),tipoEaIdAux = parseInt(pTipoEaId),numPreguntaActual = parseInt(pNumPregunta)+1,
        detalleAuditoriaId = parseInt(pDetalleAuditoriaId),auditoriaId = parseInt(pAuditoriaId),verificacionId = parseInt(pVerificacionId);

    if(accesoAux == 1){
	$("#modalPrincipalInspeccV2General").modal("hide");
    }else if(accesoAux == 2){
	$("#modalPrincipalInspeccionGenV3").modal("hide");
    }else{
	$("#modalCerraMedidaCorrectivaEvento").modal("hide");
    }
    
    var dataParam={
        auditoriaId:auditoriaId,verificacionId:verificacionId
    };
    
    if(detalleAuditoriaId > 0){
	dataParam.detalleAuditoriaId = detalleAuditoriaId;
    }

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/validacion',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
	    respuestaAuxInspeccV2GenObj = data.respuestaAuxInspeccV2GenObj;
		 
	    if(respuestaAuxInspeccV2GenObj != null){
		infoAuxInspeccV2GenObj = {detalleAuditoriaId:respuestaAuxInspeccV2GenObj.detalleAuditoriaId,estadoAudId:respuestaAuxInspeccV2GenObj.estado.id,
	            accesoOpcion:accesoAux,tipoEaId:tipoEaIdAux};
		
		if(verificacionId > 0){
		    infoAuxInspeccV2GenObj.verificacionId = verificacionId;
		}
		
		if([1,2].includes(accesoAux)){
		    infoAuxInspeccV2GenObj.numPregunta = numPreguntaActual;
		}
		
		verEvidenciaAuxiliarInspeccV2Gen();
	    }else{
		mensajeUx = "<label>No puede registrar evidencias auxiliares porque aún no ha respondido la pregunta.</label>";
	        mensajesUx(mensajeUx,2,"","ValidacionEviAuxInspeccV2Gen"); 
								   
	        $("#modalMensajeUxValidacionEviAuxInspeccV2Gen").on("hidden.bs.modal",function(){
	            if(accesoAux == 1){
	        	$("#modalPrincipalInspeccV2General").modal("show");
	            }else if(accesoAux == 2){
	        	$("#modalPrincipalInspeccionGenV3").modal("show");
	            }else{
	        	$("#modalCerraMedidaCorrectivaEvento").modal("show");
	            } 
	        });
	    }
	}else{
	         console.log("Error al cargar las evidencias auxiliares.");
	}
    }); 
}

var eviAuxIdInspeccV2Gen,indexEviAuxInspeccV2Gen,eviAuxObjInspeccV2Gen={};
var listEvidenciasAuxiliaresInspeccV2Gen = [];

function toggleMenuOpcionEvidenciaAuxiliarInspeccV2Gen(obj,pindex){
    eviAuxObjInspeccV2Gen = listEvidenciasAuxiliaresInspeccV2Gen[pindex];indexEviAuxInspeccV2Gen = pindex;

    $(obj).parent().parent().parent().parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent().parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesEvidenciaAuxiliarInspeccV2Gen=[
    {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
     functionClick:function(data){registroEvidenciaAuxiliarInspeccV2Gen(1)}},
    {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
     functionClick:function(data){eliminarEvidenciaAuxiliarInspeccV2Gen()}}
];

function marcarSubOpcionEvidenciaAuxiliarInspeccV2Gen(pindex){
    funcionalidadesEvidenciaAuxiliarInspeccV2Gen[pindex].functionClick();
    $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalEvidenciaAuxiliarInspeccV2Gen(){
    $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("hide");
    
    if(infoAuxInspeccV2GenObj.accesoOpcion == 1){
	$("#modalPrincipalInspeccV2General").modal("show");
    }else if(infoAuxInspeccV2GenObj.accesoOpcion == 2){
	$("#modalPrincipalInspeccionGenV3").modal("show");
    }else{
	$("#modalCerraMedidaCorrectivaEvento").modal("show");
    }
    
    if([1,2].includes(infoAuxInspeccV2GenObj.accesoOpcion)){
        if(infoAuxInspeccV2GenObj.estadoAudId == 2){
	    if(infoAuxInspeccV2GenObj.accesoOpcion == 1){
	        document.getElementById("labelEstadoPregInspeccV2Aux"+infoAuxInspeccV2GenObj.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
	    }else{
		document.getElementById("labelEstadoPregAux"+infoAuxInspeccV2GenObj.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
	    }
        }else{
            if(infoAuxInspeccV2GenObj.accesoOpcion == 1){
        	document.getElementById("labelEstadoRespInspeccV2Aux"+infoAuxInspeccV2GenObj.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
            }else{
        	document.getElementById("labelEstadoRespAux"+infoAuxInspeccV2GenObj.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
            }
        }
    }
}

function verEvidenciaAuxiliarInspeccV2Gen(){
    $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").remove();

    var listModal={
	id:"modalPrincipalEvidenciaAuxiliarInspeccV2Gen",nombre:([1,2].includes(infoAuxInspeccV2GenObj.accesoOpcion)?
	    "PREGUNTA #"+infoAuxInspeccV2GenObj.numPregunta+" > ":"")+"Evidencia auxiliar",
	contenido:"<div id='estadoMovilPrincipalEviAuxInspeccV2Gen'></div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(listModal,function(){},true,true);

    cargarEvidenciaAuxiliarInspeccV2Gen();
}

function cargarEvidenciaAuxiliarInspeccV2Gen(){
    $("#estadoMovilPrincipalEviAuxInspeccV2Gen").html("");

    var dataParam={
	detalleAuditoriaId:infoAuxInspeccV2GenObj.detalleAuditoriaId,tipoEaId:infoAuxInspeccV2GenObj.tipoEaId
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/evidencia_auxiliar',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
	    var listPanelesPrincipal = [];
	    var textTotalRegistros= "";

	    listEvidenciasAuxiliaresInspeccV2Gen = data.listEvidenciasAuxiliares;

	    listEvidenciasAuxiliaresInspeccV2Gen.forEach(function(val,index){
		var btnOpcion="",menuOpcion="";

		if(infoAuxInspeccV2GenObj.estadoAudId != 2 || infoAuxInspeccV2GenObj.tipoEaId == 2){
		    menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
		        funcionalidadesEvidenciaAuxiliarInspeccV2Gen.forEach(function(val1,index1){
		            menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionEvidenciaAuxiliarInspeccV2Gen("+index1+")'>"+val1.nombre+"</li>";
		        });
		    menuOpcion += "</ul>";

		    btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionEvidenciaAuxiliarInspeccV2Gen(this,"+index+")'>" +
			            "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			        "</a>";
		}
		
		var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' " +
		    "href='"+URL+"/inspeccionv2/amazon_s3/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/evidencia?"+"id="+val.id+"'>"+val.evidenciaNombre+"</a>"),
		    comentario = (val.comentario.length == 0?"------":val.comentario);

		var listTotal=[
                    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                     label:"<label style='color:blue;font-size:18px;'>"+"*** REGISTRO #"+(index+1)+" ***"+"</label>"},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Evidencia #01:",inputForm:evidenciaNombre},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil'></i> Comentario:",inputForm:comentario}
		];

		if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
		    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
		}

		if(val.fechaRegistroTexto.length > 0){
		    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",
		        inputForm:val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")});
		}

		if(val.fechaActualizacionTexto.length > 0){
		    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",
		        inputForm:val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")")});
		}

		textTotalRegistros += "<div class='eventoGeneral'>" +
			                  "<form class='eventoGeneral'>";
		listTotal.forEach(function(val,index){
		    textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
		});
		textTotalRegistros +=     "</form>" +
			              "</div>";
	    });

	    listPanelesPrincipal.push({id:"volverPregInspeccV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalEvidenciaAuxiliarInspeccV2Gen()",
	        btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""});

	    if(infoAuxInspeccV2GenObj.estadoAudId != 2 || infoAuxInspeccV2GenObj.tipoEaId == 2){
	        listPanelesPrincipal.push({id:"nuevoRegEviAuxInspeccV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroEvidenciaAuxiliarInspeccV2Gen(0)",
		    btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar evidencia auxiliar",contenido:""});
	    }
		
	    listPanelesPrincipal.push({id:"registroEviAuxInspeccV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
		btnIconoAux:"",btnTitleAux:"",nombre:"Evidencias auxiliares ("+listEvidenciasAuxiliaresInspeccV2Gen.length+")",contenido:textTotalRegistros});

	    agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalEviAuxInspeccV2Gen");

	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
	    
	    if((infoAuxInspeccV2GenObj.estadoAudId != 2 || infoAuxInspeccV2GenObj.tipoEaId == 2) && listEvidenciasAuxiliaresInspeccV2Gen.length == 0){
		registroEvidenciaAuxiliarInspeccV2Gen(0);
	    }
        }else{
            alert("Error al cargar las evidencias auxiliares.");
	}
    });
}

function ocultarRegistroEvidenciaAuxiliarInspeccV2Gen(){
    $("#modalRegistroEviAuxInspeccV2Gen").modal("hide");$("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("show");
}

function registroEvidenciaAuxiliarInspeccV2Gen(opcRegistro){
    var opcionRegistro = parseInt(opcRegistro);

    $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("hide");$("#modalRegistroEviAuxInspeccV2Gen").remove();

    eviAuxIdInspeccV2Gen = (opcionRegistro == 0?0:eviAuxObjInspeccV2Gen.id);

    var contenido = "";

    var listContenido=[
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Archivo:",inputForm:"",divContainer:"divArcEviAuxInspeccV2Gen"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Comentario:",inputForm:"<textarea id='textComentarioEviAuxInsV2Gen' class='form-control' rows='5'></textarea>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",
	 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroEvidenciaAuxiliarInspeccV2Gen()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	       "</button>",
	 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroEvidenciaAuxiliarInspeccV2Gen()'>" +
		       "<i class='fa fa-floppy-o'></i> Guardar" +
		   "</button>"}
    ];

    listContenido.forEach(function(val){
	contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalRegistroEviAuxInspeccV2Gen",nombre:"<i class='fa fa-pencil-square-o'></i> Registro evidencia auxiliar",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    if(opcionRegistro == 1){
	$("#textComentarioEviAuxInsV2Gen").val(eviAuxObjInspeccV2Gen.comentario);
    }
    
    var options={
        container:"#divArcEviAuxInspeccV2Gen",functionCall:function(){
            validacionSubirEvidencia("EvidenciaAuxInsV2Gen",bitsEvidenciaExamen,"modalRegistroEviAuxInspeccV2Gen");
        },descargaUrl:"/inspeccionv2/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/evidencia?id="+eviAuxIdInspeccV2Gen,
        esNuevo:(opcionRegistro == 0 || eviAuxObjInspeccV2Gen.evidenciaNombre.length == 0?true:false),
        idAux:"EvidenciaAuxInsV2Gen",evidenciaNombre:(opcionRegistro == 0?"":eviAuxObjInspeccV2Gen.evidenciaNombre)
    };

    crearFormEvidenciaCompleta(options);
}

function guardarRegistroEvidenciaAuxiliarInspeccV2Gen(){
    var campoVacio = true;
    
    var inputEvidencia = $("#inputEviEvidenciaAuxInsV2Gen").val();
    var comentario = $("#textComentarioEviAuxInsV2Gen").val().trim();

    if(inputEvidencia.length == 0){
        campoVacio = false;mensajeUx="<label>Debe subir el archivo.<label>";
    }else if(inputEvidencia == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir el archivo.</label>";
    }

    if(campoVacio){
        var dataParam={
            id:eviAuxIdInspeccV2Gen,tipoEaId:infoAuxInspeccV2GenObj.tipoEaId,comentario:comentario,detalleAuditoriaId:infoAuxInspeccV2GenObj.detalleAuditoriaId,
            trabajadorRegistroId:parseInt(getSession("trabajadorGosstId"))
        };

        callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/save',dataParam,1,0,function(data){
            if(data.CODE_RESPONSE == "05"){
                guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviEvidenciaAuxInsV2Gen",bitsEvidenciaExamen,
    	        0,1,"/inspeccionv2/amazon_s3/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/evidencia/save","evidencia-auxiliar/evidencia",function(){
                    $("#modalRegistroEviAuxInspeccV2Gen").modal("hide");

                    mensajeUx="<label>El registro evidencia auxiliar fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarEviAuxInspeccV2Gen");

                    $("#modalMensajeUxActualizarEviAuxInspeccV2Gen").on("hidden.bs.modal",function(){
                	$("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("show");
		        cargarEvidenciaAuxiliarInspeccV2Gen();
                    });
                });
            }else{
        	alert("Ocurrió un error al guardar la evidencia auxiliar!");
            }
        });
    }else{
        $("#modalRegistroEviAuxInspeccV2Gen").modal("hide");

        mensajesUx(mensajeUx,2,"","ValidacionEviAuxInspeccV2Gen");

        $("#modalMensajeUxValidacionEviAuxInspeccV2Gen").on("hidden.bs.modal",function(){
            $("#modalRegistroEviAuxInspeccV2Gen").modal("show");
        });
    }
}

function eliminarEvidenciaAuxiliarInspeccV2Gen(){
    $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("hide");

    mensajeUx = "<label>¿Está seguro de eliminar este registro evidencia auxiliar?</label>";
    mensajesUx(mensajeUx,3,"","ConfEviAuxInspeccV2Gen");

    $("#btnDevolverValorConfEviAuxInspeccV2Gen").on("click",function(){
	var dataParam={
	    id:eviAuxObjInspeccV2Gen.id,bucketNombre:BUCKETAMAZONS3
	};

	callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/evidencia_auxiliar/delete',dataParam,1,1,function(data){
	    if(data.CODE_RESPONSE == "05"){
	        mensajeUx="<label>El registro evidencia auxiliar fue eliminado con éxito.</label>";
	        mensajesUx(mensajeUx,1,"","ActualizarEviAuxInspeccV2Gen");

	        $("#modalMensajeUxActualizarEviAuxInspeccV2Gen").on("hidden.bs.modal",function(){
		    $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("show");
		    cargarEvidenciaAuxiliarInspeccV2Gen();
	        });
	    }else{
	        alert("Ocurrió un error al eliminar este registro evidencia auxiliar!");
	    }
	});
    });

    $("#btnRegresarPrevioConfEviAuxInspeccV2Gen").on("click",function(){
        $("#modalPrincipalEvidenciaAuxiliarInspeccV2Gen").modal("show");
    });
}

