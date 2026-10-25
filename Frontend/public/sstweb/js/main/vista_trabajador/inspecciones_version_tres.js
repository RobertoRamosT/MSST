
var inspeccionGenV3Id,indexInspeccionGenV3,objInspeccionGenV3 = {},objInspeccionGenV3Aux = {};
var actualizarPrincipalSeccActSst,numPaginaActualInspeccionGenV3,accesoFinalizarInspeccGenV3;
var hashRespPreguntaInspeccGenV3;
var listPreguntasInspeccionGenV3 = [];

function toggleMenuOpcionInspeccionGeneralVersionTres(obj,pindex){
    objInspeccionGenV3 = listPreguntasInspeccionGenV3[pindex];indexInspeccionGenV3 = pindex;

    registroEvaluacionInspeccGeneralVersionTres();
}

function regresarVistaPrincipalInspeccionGeneralVersionTres(){
    $("#modalPrincipalInspeccionGenV3").modal("hide");

    if(actualizarPrincipalSeccActSst == 1){
        traerEventosTrabajador();
    }
}

function verPrincipalInspeccionGeneralVersionTres(){
    $("#modalPrincipalInspeccionGenV3").remove();

    actualizarPrincipalSeccActSst = actPorInicioDirectoInspeccGenV3;

    var listModal={
        id:"modalPrincipalInspeccionGenV3",nombre:inspeccionEvento.text,
        contenido:"<div id='estadoMovilPrincipalInspeccionGenV3'></div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(listModal,function(){},true,true);

    cargarPrincipalInspeccionGeneralVersionTres();
}

function cargarPrincipalInspeccionGeneralVersionTres(){
    $("#estadoMovilPrincipalInspeccionGenV3").html("");

    var dataParam={
        auditoriaId:inspeccionEvento.idAux,auditoriaTipo:inspeccionEvento.linkAuxiliarId2,estadoId:inspeccionEvento.estadoEvento
    };

    callAjaxPostSimpleVersionDos(1,URL+'/auditoria/verificaciones/version_dos',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listPanelesPrincipal = [];

            numPaginaActualInspeccionGenV3 = 1;listPreguntasInspeccionGenV3 = data.listEvalInspeccGeneral;objInspeccionGenV3Aux = data.empresaInspeccV3Gen;

            if(inspeccionEvento.estadoEvento != 2){
                hashRespPreguntaInspeccGenV3 = new Map();

                listPreguntasInspeccionGenV3.forEach(function(val,index){
                    if(val.detalleAuditoriaId > 0){
                        var textRespActual = "("+(val.bitAplica == 1?"Aplica"+" / "+(val.respuesta == 1.00?"Cumple":(val.respuesta == 0.50?"Cumple parcialmente":"No cumple")):"No aplica")+")";
                        var textColorRespActual = (val.bitAplica == 1?"blue":"red");

                        hashRespPreguntaInspeccGenV3.set(val.verificacionId,{detalleAuditoriaId:val.detalleAuditoriaId,textRespActual:textRespActual,textColorRespActual:textColorRespActual});
                    }
                });
            }

            var btnIzqCambioPag = "<button type='button' id='btnFlechaIzquierdaInspeccGenV3' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
                                          "onclick='regresarListaIzquierdaInspeccGenVersionTres()' title='Regresar a la lista anterior.'>" +
                    "<i class='fa fa-chevron-left fa-4x'></i>" +
                "</button>";

            var btnDerCambioPag = "<button type='button' id='btnFlechaDerechaInspeccGenV3' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
                                          "onclick='siguienteListaDerechaInspeccGenVersionTres()' title='Cambiar a la siguiente lista.'>" +
                    "<i class='fa fa-chevron-right fa-4x'></i>" +
                "</button>";

            listPanelesPrincipal.push({id:"volverPrincipalInspeccionGenV3",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalInspeccionGeneralVersionTres()",
                 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
                {id:"completarAutoPrincipalInspeccionGenV3",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"previoMarcarCumpleRespInspeccGeneralVersionTres()",
                 btnIconoAux:"fa-pencil-square-o",btnTitleAux:"Responder preguntas restantes",nombre:"Marcar 'Cumple' en todas las preguntas sin respuesta",contenido:""},
                {id:"finalizarPrincipalInspeccionGenV3",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFinalizarInspeccGeneralVersionTres(1)",
                 btnIconoAux:"fa-check-square",btnTitleAux:"Finalizar inspección",nombre:"Registrar inspección como terminada",contenido:""},
                {id:"registroPrincipalInspeccionGenV3",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnDerCambioPag+btnIzqCambioPag,btnOnclickAux:"",
                 btnIconoAux:"",btnTitleAux:"",nombre:"<label id='labelAvanceInspeccGenV3'></label> [página <label id='labelEstadoPagActualInspeccGenV3'></label>]",contenido:""});

            agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalInspeccionGenV3");

            if(inspeccionEvento.estadoEvento == 2 || hashRespPreguntaInspeccGenV3.size != listPreguntasInspeccionGenV3.length){
                $("#finalizarPrincipalInspeccionGenV3").hide();
            }
            
            if(objInspeccionGenV3Aux.snRespAutoTotalInspecc == 0 || inspeccionEvento.estadoEvento == 2){
        	$("#completarAutoPrincipalInspeccionGenV3").hide();
            }

            cambiarPaginaPrincipalInspeccionGeneralVersionTres();
        }else{
            console.log("NOPNPO");
        }
    });
}

function regresarListaIzquierdaInspeccGenVersionTres(){
    numPaginaActualInspeccionGenV3 = numPaginaActualInspeccionGenV3-1;

    cambiarPaginaPrincipalInspeccionGeneralVersionTres();
}

function siguienteListaDerechaInspeccGenVersionTres(){
    numPaginaActualInspeccionGenV3 = numPaginaActualInspeccionGenV3+1;

    cambiarPaginaPrincipalInspeccionGeneralVersionTres();
}

function cambiarPaginaPrincipalInspeccionGeneralVersionTres(){
    $("#btnFlechaIzquierdaInspeccGenV3").show();$("#btnFlechaDerechaInspeccGenV3").show();

    var list = listPreguntasInspeccionGenV3;
    var totalSize = list.length;
    var partialSize = 20;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualInspeccionGenV3*partialSize)-partialSize;
    var finRegistro = (numPaginaActualInspeccionGenV3*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    if(inspeccionEvento.estadoEvento != 2){
        $("#labelAvanceInspeccGenV3").html("Avance: "+hashRespPreguntaInspeccGenV3.size+" / "+listPreguntasInspeccionGenV3.length);
    }else{
        $("#labelAvanceInspeccGenV3").html("Preguntas ("+listPreguntasInspeccionGenV3.length+")");
    }

    $("#labelEstadoPagActualInspeccGenV3").html(numPaginaActualInspeccionGenV3+" de "+numPaginaTotal);

    if(numPaginaActualInspeccionGenV3 == 1){
        $("#btnFlechaIzquierdaInspeccGenV3").hide();
    }

    if(numPaginaActualInspeccionGenV3 == numPaginaTotal){
        $("#btnFlechaDerechaInspeccGenV3").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#registroPrincipalInspeccionGenV3 .contenidoSubList").html("");

    var textTotalRegistros = "";

    listPreguntasInspeccionGenV3.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var btnOpcion = "";

            if(inspeccionEvento.estadoEvento != 2){
                btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionInspeccionGeneralVersionTres(this,"+index+")'>" +
                        "<i class='fa fa-pencil-square-o'></i> Respuesta" +
                    "</a>";
            }

            var textColorPregActual = "blue",divRespuestaInicial = "",margenAux = (isMobile.any()?"margin:0px 0px -10px 0px;":""),ocultarAux = "";

            if(inspeccionEvento.estadoEvento != 2){
                var hasTempRespPregInspeccGenV3 = hashRespPreguntaInspeccGenV3.has(val.verificacionId);
                var tempRespPregInspeccGenV3Obj = (hasTempRespPregInspeccGenV3?hashRespPreguntaInspeccGenV3.get(val.verificacionId):{});

                textColorPregActual = (hasTempRespPregInspeccGenV3?tempRespPregInspeccGenV3Obj.textColorRespActual:"#A5AA13");

                divRespuestaInicial = "<label id='labelEstadoRespAux"+val.verificacionId+"' style='color:"+textColorPregActual+";'>" +
                    (hasTempRespPregInspeccGenV3?tempRespPregInspeccGenV3Obj.textRespActual:"")+"</label>";
                
                ocultarAux = "display:"+(hashRespPreguntaInspeccGenV3 && tempRespPregInspeccGenV3Obj.textColorRespActual =="blue"?"block;":"none;");
            }
            
            var verEviAuxResp = "<a class='efectoLink' onclick='validacionEvidenciaAuxiliarInspeccV2Gen(2,1,"+index+","+val.detalleAuditoriaId+"," +
                inspeccionEvento.idAux+","+val.verificacionId+")'>"+"<i class='fa fa-eye'></i> Ver registros"+"</a>";

            var listTotal=[
                {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion,
                 label:"<label id='labelEstadoPregAux"+val.verificacionId+"' style='color:"+textColorPregActual+";font-size:18px;'>"+"*** PREGUNTA #"+(index+1)+" ***"+"</label>"},
                {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:"word-break:break-all;",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:val.categoriaNombre+"<br>"+val.verificacion+" "+divRespuestaInicial,inputForm:""},
            ];
            
            if(inspeccionEvento.estadoEvento != 2){
        	var claseAux = inspeccionEvento.idAux+"campo-inspeccv2-evi-aux"+val.verificacionId;
        	
        	listTotal.push({sugerencia:"",clase:claseAux,styleAux:margenAux+ocultarAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        	    {sugerencia:"",clase:claseAux,styleAux:ocultarAux,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Evidencia auxiliar:",inputForm:verEviAuxResp});
            }

            if(inspeccionEvento.estadoEvento == 2){
                var estadoPregunta = (val.bitAplica == 1?"Aplica":"No aplica");

                listTotal.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-question-circle'></i> Estado:",inputForm:estadoPregunta});

                if(val.detalleAuditoriaId > 0 && val.bitAplica == 1){
                    var iconoRespuesta = (val.respuesta == 1.00?iconoGosst.aprobado:(val.respuesta == 0.50?iconoGosst.advertir:iconoGosst.desaprobado)),
                        valorRespuesta = (val.respuesta == 1.00?"Cumple":(val.respuesta == 0.50?"Cumple parcialmente":"No cumple")),
                        valorObservacion = (val.comentario.length == 0?"------":val.comentario);

                    var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' href='"+URL +
                        "/auditoria/amazon_s3/verificaciones/evidencia?auditoriaId="+inspeccionEvento.idAux+"&verificacionId="+val.verificacionId+"'>" +
                             val.evidenciaNombre +
                        "</a>");
                   
                    listTotal.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-pencil-square-o'></i> Respuesta:",inputForm:iconoRespuesta+" "+valorRespuesta},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-eye'></i> Comentario:",inputForm:valorObservacion},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file'></i> Evidencia:",inputForm:evidenciaNombre},
                        {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"N° de evidencias auxiliares: ",inputForm:val.numEviAuxiliarRespuesta+(val.numEviAuxiliarRespuesta > 0?" ["+verEviAuxResp+"]":"")});

                    if(inspeccionEvento.esAutoInspeccion == 0 && val.respuesta == 0.00){
                        var descripcionAccMej = (val.accionCorrectiva.length == 0?"------":val.accionCorrectiva),
                            areaObservada = (val.areaObservada.length == 0?"------":val.areaObservada),
                            fechaPlanificadoAccMej = (val.fechaPlanificacionTexto.length == 0?"------":val.fechaPlanificacionTexto),
                            responsableAccMej = (val.responsable.length == 0?"------":val.responsable);

                        var evidenciaNombreAccMej = (val.evidenciaAccCorNombre.length == 0?"------":"<a class='efectoLink' target='_blank' href='"+URL +
                            "/auditoria/amazon_s3/verificaciones/accion_correctiva/evidencia?auditoriaId="+inspeccionEvento.idAux+"&verificacionId="+val.verificacionId+"'>" +
                                 val.evidenciaAccCorNombre +
                            "</a>");
                        
                        var verEviAuxMedCor = "<a class='efectoLink' onclick='validacionEvidenciaAuxiliarInspeccV2Gen(2,2,"+index+","+val.detalleAuditoriaId+"," +
                            inspeccionEvento.idAux+","+val.verificacionId+")'>"+"<i class='fa fa-eye'></i> Ver registros"+"</a>";

                        listTotal.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"<label style='color:blue;font-size:18px;'>" +"*** MEDIDA CORRECTIVA ***"+"</label>"},
                            {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-eye'></i> Descripción:",inputForm:descripcionAccMej},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-pencil'></i> Área responsable:",inputForm:areaObservada},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-calendar'></i> Fecha planificada:",inputForm:fechaPlanificadoAccMej},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-user'></i> Responsable:",inputForm:responsableAccMej},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file'></i> Evidencia:",inputForm:evidenciaNombreAccMej},
                            {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Evidencias auxiliares: ",inputForm:verEviAuxMedCor});
                    }
                }
            }

            textTotalRegistros += "<div class='eventoGeneral'>" +
                                      "<div class='eventoGeneral'>";
            listTotal.forEach(function(val,index){
                textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
            });
            textTotalRegistros +=     "</div>" +
                                  "</div>";
        }
    });

    $("#registroPrincipalInspeccionGenV3 .contenidoSubList").html(textTotalRegistros);

    $.unblockUI();
}

var regEvalInspeccGeneralV3Obj = {},valRespPregInspeccGenV3Obj = {};
var hasValRespPregInspeccGenV3;

function ocultarRegistroEvaluacionInspeccGeneralVersionTres(){
    $("#modalRegistroEvalInspeccV3").modal("hide");$("#modalPrincipalInspeccionGenV3").modal("show");

    document.getElementById("labelEstadoRespAux"+objInspeccionGenV3.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
}

function registroEvaluacionInspeccGeneralVersionTres(){
    $("#modalPrincipalInspeccionGenV3").modal("hide");$("#modalRegistroEvalInspeccV3").remove();

    hasValRespPregInspeccGenV3 = hashRespPreguntaInspeccGenV3.has(objInspeccionGenV3.verificacionId);
    valRespPregInspeccGenV3Obj = (hasValRespPregInspeccGenV3?hashRespPreguntaInspeccGenV3.get(objInspeccionGenV3.verificacionId):{});

    var dataParam={
        detalleAuditoriaId:(hasValRespPregInspeccGenV3?valRespPregInspeccGenV3Obj.detalleAuditoriaId:null),
        auditoriaId:(hasValRespPregInspeccGenV3?null:inspeccionEvento.idAux),
        verificacionId:(hasValRespPregInspeccGenV3?null:objInspeccionGenV3.verificacionId)
    };

    callAjaxPostSimpleVersionDos(1,URL+'/auditoria/verificaciones/version_tres/detalle',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            regEvalInspeccGeneralV3Obj = data.registroInspeccGeneralV3;

            var margenAux = (isMobile.any()?"margin:0px 0px -10px 0px;":"");

            var listEstadoPreguntaAux = [{id:1,nombre:"Aplica"},{id:0,nombre:"No aplica"}];
            var listRespuestaPreguntaAux = [{id:1,nombre:"Cumple"},{id:0,nombre:"No cumple"}];

            var radiosRespEstadoPregInspeccV3 = crearRadiosAutoVersionDos("radiosRespEstadoPregInspeccV3",listEstadoPreguntaAux,
                (regEvalInspeccGeneralV3Obj != null?regEvalInspeccGeneralV3Obj.bitAplica:"1"),"id","nombre","habilitarCamposEstadoPregInspeccGeneralV3","");

            var radiosRespPregInspeccV3 = crearRadiosAutoVersionDos("radiosRespPregInspeccV3",listRespuestaPreguntaAux,
                (regEvalInspeccGeneralV3Obj != null?regEvalInspeccGeneralV3Obj.respuesta:"1"),"id","nombre","habilitarCamposMedCorrPregInspeccGeneralV3","");

            var contenido = "";

            var listContenido=[
                {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:objInspeccionGenV3.categoriaNombre+"<br>"+objInspeccionGenV3.verificacion,inputForm:"",styleAux:"word-break:break-all;"},
                {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado:",inputForm:radiosRespEstadoPregInspeccV3}
            ];

            listContenido.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listSeparacionUno=[{sugerencia:"",clase:"campos-estado-inspeccv3",styleAux:"border-top:6px solid black;margin:10px -10px 0px -10px;",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}];

            listSeparacionUno.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listContenidoResp=[
                {sugerencia:"",clase:"campos-estado-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Respuesta:",inputForm:radiosRespPregInspeccV3},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObsPregInspeccV3' class='form-control' rows='4'></textarea>"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Evidencia:",inputForm:"",divContainer:"divEvidenciaPregInspeccV3"}
            ];

            contenido += "<div class='campos-estado-inspeccv3 eventoGeneral'>";
            listContenidoResp.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });
            contenido += "</div>";

            var listSeparacionDos=[{sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",styleAux:"border-top:6px solid black;margin:10px -10px 0px -10px;",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}];

            listSeparacionDos.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listContenidoMedCorr=[
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MEDIDA CORRECTIVA ***</span>",inputForm:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción:",inputForm:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDescMedCorrPregInspeccV3' class='form-control' rows='4'></textarea>"+textCampoObligatorio},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Área responsable:",inputForm:"<input id='inputAreaRespMedCorrPregInspeccV3' type='text' class='form-control'>"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Fecha planificada:",inputForm:"<input id='inputFechaPlanifMedCorrPregInspeccV3' type='date' class='form-control'>"+textCampoObligatorio},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Responsable de la medida correctiva:",
                 inputForm:"<input type='text' id='inputTrabNombreMedCorrPregInspeccV3' class='form-control'>" +
                           "<div id='divSelTrabajadorMedCorrPregInspeccV3'></div>" +
                           "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"+textCampoObligatorio},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Evidencia - medida correctiva:",inputForm:"",divContainer:"divEvidenciaMedCorrPregInspeccV3"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv3 campos-medcorr-inspeccv3",anchoLabel:"",anchoDiv:"",label:"Estado:",inputForm:"",divContainer:"divEstadoMedCorrPregInspeccV3"}
            ];

            contenido += "<div class='campos-estado-inspeccv3 campos-medcorr-inspeccv3 eventoGeneral'>";
            listContenidoMedCorr.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });
            contenido += "</div>";

            var listCierre=[
                {sugerencia:"",styleAux:(isMobile.any()?"margin:10px -10px 0px -10px;":"margin:10px 0px 10px 0px;"),anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                {sugerencia:"",styleAux:(isMobile.any()?"display:flex;":""),anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
                    label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroEvaluacionInspeccGeneralVersionTres()'>" +
                        "<i class='fa fa-times'></i> Cancelar" +
                        "</button>",
                    inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarRegistroEvaluacionInspeccGeneralVersionTres()'>" +
                        "<i class='fa fa-floppy-o'></i> Guardar" +
                        "</button>"}
            ];

            listCierre.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var modalOptions={
                id:"modalRegistroEvalInspeccV3",nombre:"<i class='fa fa-pencil'></i> Pregunta #"+(indexInspeccionGenV3+1),
                contenido:"<div class='eventoGeneral'>"+contenido+"</div>",btnCerrarHabilitado:0
            };

            crearModalPrincipalUsuario(modalOptions,function(){},true,true);

            var options={
                container:"#divEvidenciaPregInspeccV3",functionCall:function(){
                    validacionSubirEvidencia("PregInspeccV3",bitsEvidenciaExamen,"modalRegistroEvalInspeccV3");
                },descargaUrl:"/auditoria/amazon_s3/verificaciones/evidencia?auditoriaId="+inspeccionEvento.idAux+"&verificacionId="+objInspeccionGenV3.verificacionId,
                esNuevo:(regEvalInspeccGeneralV3Obj == null || regEvalInspeccGeneralV3Obj.evidenciaNombre.length == 0?true:false),
                idAux:"PregInspeccV3",evidenciaNombre:(regEvalInspeccGeneralV3Obj != null?regEvalInspeccGeneralV3Obj.evidenciaNombre:"")
            };

            crearFormEvidenciaCompleta(options);

            var optionsMedCorr={
                container:"#divEvidenciaMedCorrPregInspeccV3",functionCall:function(){
                    estadoMedCorrPregInspeccV3();validacionSubirEvidencia("MedCorrPregInspeccV3",bitsEvidenciaExamen,"modalRegistroEvalInspeccV3");
                },descargaUrl:"/auditoria/amazon_s3/verificaciones/accion_correctiva/evidencia?auditoriaId="+inspeccionEvento.idAux+"&verificacionId="+objInspeccionGenV3.verificacionId,
                esNuevo:(regEvalInspeccGeneralV3Obj == null || regEvalInspeccGeneralV3Obj.evidenciaAccCorNombre.length == 0?true:false),
                idAux:"MedCorrPregInspeccV3",evidenciaNombre:(regEvalInspeccGeneralV3Obj != null?regEvalInspeccGeneralV3Obj.evidenciaAccCorNombre:""),
                mensajeAux:"*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
            };

            crearFormEvidenciaCompleta(optionsMedCorr);

            if(regEvalInspeccGeneralV3Obj != null){
                $("#textObsPregInspeccV3").val(regEvalInspeccGeneralV3Obj.comentario);

                if(regEvalInspeccGeneralV3Obj.respuesta == 0.00){
                    $("#textDescMedCorrPregInspeccV3").val(regEvalInspeccGeneralV3Obj.accionCorrectiva);
                    $("#inputAreaRespMedCorrPregInspeccV3").val(regEvalInspeccGeneralV3Obj.areaObservada);
                    $("#inputFechaPlanifMedCorrPregInspeccV3").val(convertirFechaInput(regEvalInspeccGeneralV3Obj.fechaPlanificacion));
                    $("#inputTrabNombreMedCorrPregInspeccV3").val(regEvalInspeccGeneralV3Obj.responsable);
                }
            }

            buscarResponsableMedCorrPregInspeccV3();estadoMedCorrPregInspeccV3();
            habilitarCamposEstadoPregInspeccGeneralV3((regEvalInspeccGeneralV3Obj != null?regEvalInspeccGeneralV3Obj.bitAplica:1));
        }else{
            mensajeUx = "<label>Error al cargar los datos.</label>";
            mensajesUx(mensajeUx,2,"","ValidacionQuicksight");

            $("#modalMensajeUxValidacionQuicksight").on("hidden.bs.modal",function(){
                $("#modalQuicksightOpcAcInseg").modal("show");
            });
        }
    });
}

var listRespBuscadorProgMedCorrPregInspeccV3Aux = [];

function buscarResponsableMedCorrPregInspeccV3(){
    var nombre = $("#inputTrabNombreMedCorrPregInspeccV3").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listRespBuscadorProgMedCorrPregInspeccV3Aux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selResponsableMedCorrPregInspeccV3 = crearSelectOneMenuOblig("selResponsableMedCorrPregInspeccV3",
                "",listRespBuscadorProgMedCorrPregInspeccV3Aux,"","trabajadorId","nombre");

            $("#divSelTrabajadorMedCorrPregInspeccV3").html(selResponsableMedCorrPregInspeccV3);
            $("#inputTrabNombreMedCorrPregInspeccV3").attr("onkeyup","buscarResponsableMedCorrPregInspeccV3()");
        });
    }else{
        listRespBuscadorProgMedCorrPregInspeccV3Aux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selResponsableMedCorrPregInspeccV3 = crearSelectOneMenuOblig("selResponsableMedCorrPregInspeccV3",
            "",listRespBuscadorProgMedCorrPregInspeccV3Aux,"","trabajadorId","nombre");

        $("#divSelTrabajadorMedCorrPregInspeccV3").html(selResponsableMedCorrPregInspeccV3);
        $("#inputTrabNombreMedCorrPregInspeccV3").attr("onkeyup","buscarResponsableMedCorrPregInspeccV3()");
    }
}

function habilitarCamposEstadoPregInspeccGeneralV3(value){
    (value == 0?$(".campos-estado-inspeccv3").hide():$(".campos-estado-inspeccv3").show());

    if(value == 1){
        var respPregAux = parseInt($("input[name='radiosRespPregInspeccV3']:checked").val());

        habilitarCamposMedCorrPregInspeccGeneralV3(respPregAux);
    }
}

function habilitarCamposMedCorrPregInspeccGeneralV3(value){
    (inspeccionEvento.esAutoInspeccion == 1 || value == 1?$(".campos-medcorr-inspeccv3").hide():$(".campos-medcorr-inspeccv3").show());
}

function estadoMedCorrPregInspeccV3(){
    var nombreMedCorrEvi = $("#inputEviMedCorrPregInspeccV3").val();
    var styleDivEstado = "color:"+(nombreMedCorrEvi.length == 0?"#A5AA13":"blue")+";font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+";";
    var contenidoDivEstado = (nombreMedCorrEvi.length == 0?"Pendiente":"Completado");

    $("#divEstadoMedCorrPregInspeccV3").html("<span style='"+styleDivEstado+"'>"+contenidoDivEstado+"</span>");
}

function guardarRegistroEvaluacionInspeccGeneralVersionTres(){
    var campoVacio = true;

    var estado = parseInt($("input[name='radiosRespEstadoPregInspeccV3']:checked").val());

    var respuesta = (estado == 1?parseInt($("input[name='radiosRespPregInspeccV3']:checked").val()):null);
    var observacion = (estado == 1?$("#textObsPregInspeccV3").val():null);
    var evidenciaNombre = (estado == 1?$("#inputEviPregInspeccV3").val():null);
    var habilitadoEviPregInspeccV3 = (estado == 1?1:0);

    var habilitadoMedCorrPregInspeccV3 = (inspeccionEvento.esAutoInspeccion == 0 && estado == 1 && respuesta == 0?true:false);

    var medCorrDescripcion = (habilitadoMedCorrPregInspeccV3?$("#textDescMedCorrPregInspeccV3").val():null);
    var medCorrAreaResp = (habilitadoMedCorrPregInspeccV3?$("#inputAreaRespMedCorrPregInspeccV3").val():null);
    var medCorrfechaPlanificada = (habilitadoMedCorrPregInspeccV3?convertirFechaTexto($("#inputFechaPlanifMedCorrPregInspeccV3").val()):null);
    var inputMedCorrfechaPlanificada = (habilitadoMedCorrPregInspeccV3?(!medCorrfechaPlanificada?null:medCorrfechaPlanificada):null);
    var medCorrResponsableId = (habilitadoMedCorrPregInspeccV3?parseInt($("#selResponsableMedCorrPregInspeccV3").val()):null);
    var medCorrEvidenciaNombre = (habilitadoMedCorrPregInspeccV3?$("#inputEviMedCorrPregInspeccV3").val():null);
    var habilitadoEviMedCorrPregInspeccV3 = (habilitadoMedCorrPregInspeccV3?1:0);

    if(habilitadoMedCorrPregInspeccV3 && (medCorrDescripcion.trim().length == 0 || inputMedCorrfechaPlanificada == null || medCorrResponsableId == -1)){
        campoVacio = false;mensajeUx = "<label>Debe completar los campos obligatorios de la medida correctiva.</label>";
    }else if(habilitadoEviPregInspeccV3 == 1 && evidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }else if(habilitadoEviMedCorrPregInspeccV3 == 1 && medCorrEvidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia de la medida correctiva.</label>";
    }

    if(campoVacio){
        var dataParam={
            detalleAuditoriaId:(hasValRespPregInspeccGenV3?valRespPregInspeccGenV3Obj.detalleAuditoriaId:0),auditoriaId:inspeccionEvento.idAux,
            verificacionId:objInspeccionGenV3.verificacionId,bitAplica:estado,trabajadorId:parseInt(getSession("trabajadorGosstId")),
            bucketNombre:BUCKETAMAZONS3,bitRespuesta:respuesta,comentario:observacion,accionCorrectiva:medCorrDescripcion,areaObservada:medCorrAreaResp,
            fechaPlanificacion:inputMedCorrfechaPlanificada,responsableId:medCorrResponsableId
        };

        callAjaxPostSimpleVersionDos(1,URL+'/auditoria/verificaciones/respuesta/inspeccion_general/version_dos/save',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
//                    guardarEvidenciaAutoVersionTres(habilitadoEviPregInspeccV3,data.nuevoId,"fileEviPregInspeccV3",bitsEvidenciaEvalEvento,0,0,
//                    "/auditoria/verificaciones/evidencia/save",function(){
                    guardarEvidenciaAutoVersionS3(habilitadoEviPregInspeccV3,data.nuevoId,"fileEviPregInspeccV3",bitsEvidenciaEvalEvento,
                    0,0,"/auditoria/amazon_s3/verificaciones/evidencia/save","detalle-auditoria/evidencia",function(){
                        guardarEvidenciaAutoVersionS3(habilitadoEviMedCorrPregInspeccV3,data.nuevoId,"fileEviMedCorrPregInspeccV3",bitsEvidenciaEvalEvento,
                        0,1,"/auditoria/amazon_s3/verificaciones/accion_correctiva/evidencia/save","detalle-auditoria/evidencia-acc-correctiva",function(){
                            $("#modalRegistroEvalInspeccV3").modal("hide");

                            var textRespActual = "("+(estado == 1?"Aplica"+" / "+(respuesta == 1?"Cumple":"No cumple"):"No aplica")+")";
                            var textColorRespActual = (estado == 1?"blue":"red");

                            document.querySelector('#labelEstadoRespAux'+objInspeccionGenV3.verificacionId).innerText = textRespActual;
                            document.getElementById('labelEstadoRespAux'+objInspeccionGenV3.verificacionId).style.color = textColorRespActual;
                            document.getElementById('labelEstadoPregAux'+objInspeccionGenV3.verificacionId).style.color = textColorRespActual;

                            hashRespPreguntaInspeccGenV3.set(objInspeccionGenV3.verificacionId,{detalleAuditoriaId:data.nuevoId,textRespActual:textRespActual,textColorRespActual:textColorRespActual});

                            $("#labelAvanceInspeccGenV3").html("Avance: "+hashRespPreguntaInspeccGenV3.size+" / "+listPreguntasInspeccionGenV3.length);

                            if(estado == 1){
                                $("."+inspeccionEvento.idAux+"campo-inspeccv2-evi-aux"+objInspeccionGenV3.verificacionId).show();
                            }
                            
                            if(hashRespPreguntaInspeccGenV3.size == listPreguntasInspeccionGenV3.length){
                                $("#finalizarPrincipalInspeccionGenV3").show();
                            }

                            mensajeUx = "<label>El registro de la respuesta fue guardado con éxito.</label>";
                            mensajesUx(mensajeUx,1,"","ActualizarRegEvalInspeccV3");

                            $("#modalMensajeUxActualizarRegEvalInspeccV3").on("hidden.bs.modal",function(){
                                actualizarPrincipalSeccActSst = 1;$("#modalPrincipalInspeccionGenV3").modal("show");

                                document.getElementById("labelEstadoRespAux"+objInspeccionGenV3.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
                            });
                        });
                    });
//                    },"verificacionId");

                    break;

                default:
                    alert("Ocurrió un error al guardar la respuesta de la pregunta.");
            }
        });
    }else{
        $("#modalRegistroEvalInspeccV3").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionRegEvalInspeccV3");

        $("#modalMensajeUxValidacionRegEvalInspeccV3").on("hidden.bs.modal",function(){
            $("#modalRegistroEvalInspeccV3").modal("show");
        });
    }
}

function ocultarFinalizarInspeccGeneralVersionTres(){
    $("#modalFinalizarInspeccionGenV3").modal("hide");

    if(accesoFinalizarInspeccGenV3 == 1){
        $("#modalPrincipalInspeccionGenV3").modal("show");
    }
}

function verFinalizarInspeccGeneralVersionTres(opcionAcceso){
    $("#modalPrincipalInspeccionGenV3").modal("hide");$("#modalFinalizarInspeccionGenV3").remove();

    accesoFinalizarInspeccGenV3 = parseInt(opcionAcceso);

    var contenido = "";

    var listContenido=[
        {sugerencia:"",label:"Fecha realizada",inputForm:"<input type='date' id='fechaRealizadaInspeccV3' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",styleAux:(isMobile.any()?"display:flex;":""),anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFinalizarInspeccGeneralVersionTres()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarFinalizarInspeccGeneralVersionTres()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"},
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalFinalizarInspeccionGenV3",nombre:"<i class='fa fa-check-square'></i> Finalizar inspección",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var hoy = getSession("fechaHoyOrdenInversoTexto");

    $("#fechaRealizadaInspeccV3").val(hoy);
}

function guardarFinalizarInspeccGeneralVersionTres(){
    var campoVacio = true;

    var fechaRealizada = convertirFechaTexto($("#fechaRealizadaInspeccV3").val());
    var inputFechaRealizada = (!fechaRealizada?null:fechaRealizada);

    if(inputFechaRealizada == null){
        campoVacio = false;mensajeUx = "<label>Debe ingresar la 'fecha realizada'.</label>";
    }

    if(campoVacio){
        var dataParam={
            auditoriaId:inspeccionEvento.idAux,fechaRealizada:inputFechaRealizada,bucketNombre:BUCKETAMAZONS3
        };

        callAjaxPostSimpleVersionDos(1,URL+'/auditoria/finalizar_inspeccion/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
//                    callAjaxPostSimpleVersionDos(1,URL+'/auditoria/finalizar_inspeccion/generar_excel_evidencia',dataParam,0,1,function(data){
//                        switch(data.CODE_RESPONSE){
//                            case "05":
                                $("#modalFinalizarInspeccionGenV3").modal("hide");

                                mensajeUx = "<label>El registro de finalización de la inspección fue guardado con éxito.</label>";
                                mensajesUx(mensajeUx,1,"","ActualizarFinalizarInspeccV3");

                                $("#modalMensajeUxActualizarFinalizarInspeccV3").on("hidden.bs.modal",function(){
                                    traerEventosTrabajador();
                                });

                                break;

//                            default:
//                                alert("Ocurrió un error al generar el archivo excel.");
//                        }
//                    });
//
//                    break;

                default:
                    alert("Ocurrió un error al finalizar la inspección.");
            }
        });
    }else{
        $("#modalFinalizarInspeccionGenV3").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionFinalizarInspeccV3");

        $("#modalMensajeUxValidacionFinalizarInspeccV3").on("hidden.bs.modal",function(){
            $("#modalFinalizarInspeccionGenV3").modal("show");
        });
    }
}

function previoMarcarCumpleRespInspeccGeneralVersionTres(){
    $("#modalPrincipalInspeccionGenV3").modal("hide");
    
    if(hashRespPreguntaInspeccGenV3.size != listPreguntasInspeccionGenV3.length){
        mensajeUx="<label>¿Desea marcar todas las preguntas pendientes con la respuesta 'Cumple'?</label>";
        mensajesUx(mensajeUx,3,"","CompletarAutoRegEvalInspeccV3");

        $("#btnDevolverValorCompletarAutoRegEvalInspeccV3").on("click",function(){
            var dataParam={
        	auditoriaId:inspeccionEvento.idAux,auditoriaTipo:inspeccionEvento.linkAuxiliarId2,bitAplica:1,bitRespuesta:1,
                trabajadorId:parseInt(getSession("trabajadorGosstId"))
            };

            callAjaxPostSimpleVersionDos(1,URL+'/auditoria/pregunta/respuesta/inspeccion_version_tres/autocompletado/save',dataParam,1,1,function(data){
        	switch(data.CODE_RESPONSE){
                    case "05":
 	                mensajeUx = "<label>La respuesta 'Cumple' de las preguntas pendientes se guardó con éxito.</label>";
 	                mensajesUx(mensajeUx,1,"","ActualizarRegEvalInspeccV3");

 	                $("#modalMensajeUxActualizarRegEvalInspeccV3").on("hidden.bs.modal",function(){
 	                    actualizarPrincipalSeccActSst = 1;$("#modalPrincipalInspeccionGenV3").modal("show");
 	                    
 	                    cargarPrincipalInspeccionGeneralVersionTres();
 	                });
 	       
 	                break;
			
                    default:
                	alert("Ocurrió un error al intentar responder todas las preguntas pendientes.");
        	}
            });
        });
    
        $("#btnRegresarPrevioCompletarAutoRegEvalInspeccV3").on("click",function(){
            $("#modalPrincipalInspeccionGenV3").modal("show"); 
        });
    }else{
	mensajeUx="<label>Función no disponible porque no hay más preguntas pendientes sin respuesta.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionFinalizarInspeccV3");
        
        $("#modalMensajeUxValidacionFinalizarInspeccV3").on("hidden.bs.modal",function(){
            $("#modalPrincipalInspeccionGenV3").modal("show");
        });
    }
}
