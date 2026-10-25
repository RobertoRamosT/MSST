
var inspeccionV2GenId,indexInspeccionV2Gen,objInspeccionV2Gen = {};
var actualizarPrincipalInspeccV2Gen,numPaginaActualInspeccV2Gen;
var hashRespPreguntaInspeccV2Gen;
var listPreguntasInspeccionV2Gen = [];

function toggleMenuOpcionInspeccionV2General(obj,pindex){
    objInspeccionV2Gen = listPreguntasInspeccionV2Gen[pindex];indexInspeccionV2Gen = pindex;

    registroEvaluacionInspeccV2General();
}

function regresarVistaPrincipalInspeccionV2General(){
    $("#modalPrincipalInspeccV2General").modal("hide");

    if(actualizarPrincipalInspeccV2Gen == 1){
	habilitarInspeccionV2();
    }
}

function verPrincipalInspeccionV2General(){
    $("#modalPrincipalInspeccV2General").remove();

    actualizarPrincipalInspeccV2Gen = 0;

    var listModal={
        id:"modalPrincipalInspeccV2General",nombre:"CÓDIGO #"+inspeccionesV2Obj.auditoriaId+" - inspección "+inspeccionesV2Obj.tipo.nombre,
        contenido:"<div id='estadoMovilPrincipalInspeccV2General'></div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(listModal,function(){},true,true);

    cargarPrincipalInspeccionV2General();
}

function cargarPrincipalInspeccionV2General(){
    $("#estadoMovilPrincipalInspeccV2General").html("");

    var dataParam={
        auditoriaId:inspeccionesV2Obj.auditoriaId,auditoriaTipo:inspeccionesV2Obj.tipo.id,estadoId:inspeccionesV2Obj.estado.id
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/preguntas',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listPanelesPrincipal = [];

            numPaginaActualInspeccV2Gen = 1;listPreguntasInspeccionV2Gen = data.listPreguntasInspeccionV2Gen;

            if(inspeccionesV2Obj.estado.id != 2){
                hashRespPreguntaInspeccV2Gen = new Map();

                listPreguntasInspeccionV2Gen.forEach(function(val,index){
                    if(val.detalleAuditoriaId > 0){
                        var textRespActual = "("+(val.bitAplica == 1?"Aplica"+" / "+(val.respuesta == 1.00?"Cumple":(val.respuesta == 0.50?"Cumple parcialmente":"No cumple")):"No aplica")+")";
                        var textColorRespActual = (val.bitAplica == 1?"blue":"red");

                        hashRespPreguntaInspeccV2Gen.set(val.verificacionId,{detalleAuditoriaId:val.detalleAuditoriaId,textRespActual:textRespActual,textColorRespActual:textColorRespActual});
                    }
                });
            }

            var btnIzqCambioPag = "<button type='button' id='btnFlechaIzquierdaInspeccV2Gen' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
                                          "onclick='regresarListaIzquierdaInspeccV2Gen()' title='Regresar a la lista anterior.'>" +
                    "<i class='fa fa-chevron-left fa-4x'></i>" +
                "</button>";

            var btnDerCambioPag = "<button type='button' id='btnFlechaDerechaInspeccV2Gen' class='btn btn-success' style='padding:4px 6px;margin-right:5px;' " +
                                          "onclick='siguienteListaDerechaInspeccV2Gen()' title='Cambiar a la siguiente lista.'>" +
                    "<i class='fa fa-chevron-right fa-4x'></i>" +
                "</button>";

            listPanelesPrincipal.push({id:"volverPrincipalInspeccionV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalInspeccionV2General()",
                 btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""},
                {id:"completarAutoPrincipalInspeccionV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"previoMarcarCumpleRespInspeccionV2General()",
                 btnIconoAux:"fa-pencil-square-o",btnTitleAux:"Responder preguntas restantes",nombre:"Marcar 'Cumple' en todas las preguntas sin respuesta",contenido:""},
                {id:"finalizarPrincipalInspeccionV2Gen",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"previoVerFinalizarInspeccionV2General(1)",
                 btnIconoAux:"fa-check-square",btnTitleAux:"Finalizar inspección",nombre:"Registrar inspección como finalizada",contenido:""},
                {id:"registroPrincipalInspeccionV2Gen",clase:"",styleAux:"",habilitarBtnSimple:0,buttonAd:btnDerCambioPag+btnIzqCambioPag,btnOnclickAux:"",
                 btnIconoAux:"",btnTitleAux:"",nombre:"<label id='labelAvanceInspeccV2Gen'></label> [página <label id='labelEstadoPagActualInspeccV2Gen'></label>]",contenido:""});

            agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalInspeccV2General");

            if(inspeccionesV2Obj.estado.id == 2){
        	$("#finalizarPrincipalInspeccionV2Gen").hide();
            }
            
            if(empresaInspeccV2Obj.snRespAutoTotalInspecc == 0 || inspeccionesV2Obj.estado.id == 2){
        	$("#completarAutoPrincipalInspeccionV2Gen").hide();
            }

            cambiarPaginaPrincipalInspeccionV2General();
        }else{
            console.log("NOPNPO");
        }
    });
}

function regresarListaIzquierdaInspeccV2Gen(){
    numPaginaActualInspeccV2Gen = numPaginaActualInspeccV2Gen-1;

    cambiarPaginaPrincipalInspeccionV2General();
}

function siguienteListaDerechaInspeccV2Gen(){
    numPaginaActualInspeccV2Gen = numPaginaActualInspeccV2Gen+1;

    cambiarPaginaPrincipalInspeccionV2General();
}

function cambiarPaginaPrincipalInspeccionV2General(){
    $("#btnFlechaIzquierdaInspeccV2Gen").show();$("#btnFlechaDerechaInspeccV2Gen").show();

    var list = listPreguntasInspeccionV2Gen;
    var totalSize = list.length;
    var partialSize = 20;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualInspeccV2Gen*partialSize)-partialSize;
    var finRegistro = (numPaginaActualInspeccV2Gen*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    if(inspeccionesV2Obj.estado.id != 2){
        $("#labelAvanceInspeccV2Gen").html("Avance: "+hashRespPreguntaInspeccV2Gen.size+" / "+listPreguntasInspeccionV2Gen.length);
    }else{
        $("#labelAvanceInspeccV2Gen").html("Preguntas ("+listPreguntasInspeccionV2Gen.length+")");
    }

    $("#labelEstadoPagActualInspeccV2Gen").html(numPaginaActualInspeccV2Gen+" de "+numPaginaTotal);

    if(numPaginaActualInspeccV2Gen == 1){
        $("#btnFlechaIzquierdaInspeccV2Gen").hide();
    }

    if(numPaginaActualInspeccV2Gen == numPaginaTotal){
        $("#btnFlechaDerechaInspeccV2Gen").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#registroPrincipalInspeccionV2Gen .contenidoSubList").html("");

    var textTotalRegistros = "";

    listPreguntasInspeccionV2Gen.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var btnOpcion = "";

            if(inspeccionesV2Obj.estado.id != 2){
                btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionInspeccionV2General(this,"+index+")'>" +
                        "<i class='fa fa-pencil-square-o'></i> Respuesta" +
                    "</a>";
            }

            var textColorPregActual = "blue",divRespuestaInicial = "",margenAux = (isMobile.any()?"margin:0px 0px -10px 0px;":""),ocultarAux = "";

            if(inspeccionesV2Obj.estado.id != 2){
                var hasTempRespPregInspeccV2Gen = hashRespPreguntaInspeccV2Gen.has(val.verificacionId);
                var tempRespPregInspeccV2GenObj = (hasTempRespPregInspeccV2Gen?hashRespPreguntaInspeccV2Gen.get(val.verificacionId):{});

                textColorPregActual = (hasTempRespPregInspeccV2Gen?tempRespPregInspeccV2GenObj.textColorRespActual:"#A5AA13");

                divRespuestaInicial = "<label id='labelEstadoRespInspeccV2Aux"+val.verificacionId+"' style='color:"+textColorPregActual+";'>" +
                    (hasTempRespPregInspeccV2Gen?tempRespPregInspeccV2GenObj.textRespActual:"")+"</label>";
                
                ocultarAux = "display:"+(hasTempRespPregInspeccV2Gen && tempRespPregInspeccV2GenObj.textColorRespActual =="blue"?"block;":"none;");
            }
            
            var verEviAuxResp = "<a class='efectoLink' onclick='validacionEvidenciaAuxiliarInspeccV2Gen(1,1,"+index+","+val.detalleAuditoriaId+"," +
                inspeccionesV2Obj.auditoriaId+","+val.verificacionId+")'>"+"<i class='fa fa-eye'></i> Ver registros"+"</a>";

            var listTotal=[
                {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion,
                 label:"<label id='labelEstadoPregInspeccV2Aux"+val.verificacionId+"' style='color:"+textColorPregActual+";font-size:18px;'>"+"*** PREGUNTA #"+(index+1)+" ***"+"</label>"},
                {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:"word-break:break-all;",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:val.categoriaNombre+"<br>"+val.verificacion+" "+divRespuestaInicial,inputForm:""},
            ];
            
            if(inspeccionesV2Obj.estado.id != 2){
        	var claseAux = inspeccionesV2Obj.auditoriaId+"campo-inspeccv2-evi-aux"+val.verificacionId;
        	
        	listTotal.push({sugerencia:"",clase:claseAux,styleAux:margenAux+ocultarAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        	    {sugerencia:"",clase:claseAux,styleAux:ocultarAux,anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Evidencia auxiliar:",inputForm:verEviAuxResp});
            }

            if(inspeccionesV2Obj.estado.id == 2){
                var estadoPregunta = (val.bitAplica == 1?"Aplica":"No aplica");

                listTotal.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-question-circle'></i> Estado:",inputForm:estadoPregunta});

                if(val.detalleAuditoriaId > 0 && val.bitAplica == 1){
                    var iconoRespuesta = (val.respuesta == 1.00?iconoGosst.aprobado:(val.respuesta == 0.50?iconoGosst.advertir:iconoGosst.desaprobado)),
                        valorRespuesta = (val.respuesta == 1.00?"Cumple":(val.respuesta == 0.50?"Cumple parcialmente":"No cumple")),
                        valorObservacion = (val.comentario.length == 0?"------":val.comentario);

                    var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":"<a class='efectoLink' target='_blank' href='"+URL +
                        "/inspeccionv2/amazon_s3/pregunta/evidencia?auditoriaId="+inspeccionesV2Obj.auditoriaId+"&verificacionId="+val.verificacionId+"'>" +
                             val.evidenciaNombre +
                        "</a>");

                    listTotal.push({sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-pencil-square-o'></i> Respuesta:",inputForm:iconoRespuesta+" "+valorRespuesta},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-eye'></i> Comentario:",inputForm:valorObservacion},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-file'></i> Evidencia:",inputForm:evidenciaNombre},
                        {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"N° de evidencias auxiliares: ",inputForm:val.numEviAuxiliarRespuesta+(val.numEviAuxiliarRespuesta > 0?" ["+verEviAuxResp+"]":"")});

                    if(inspeccionesV2Obj.snAutoInspeccion == 0 && val.respuesta == 0.00){
                        var descripcionAccMej = (val.accionCorrectiva.length == 0?"------":val.accionCorrectiva),
                            areaObservada = (val.areaObservada.length == 0?"------":val.areaObservada),
                            fechaPlanificadoAccMej = (val.fechaPlanificacionTexto.length == 0?"------":val.fechaPlanificacionTexto),
                            responsableAccMej = (val.responsable.length == 0?"------":val.responsable);

                        var evidenciaNombreAccMej = (val.evidenciaAccCorNombre.length == 0?"------":"<a class='efectoLink' target='_blank' href='"+URL +
                            "/inspeccionv2/amazon_s3/pregunta/accion_correctiva/evidencia?auditoriaId="+inspeccionesV2Obj.auditoriaId+"&verificacionId="+val.verificacionId+"'>" +
                                 val.evidenciaAccCorNombre +
                            "</a>");
                        
                        var verEviAuxMedCor = "<a class='efectoLink' onclick='validacionEvidenciaAuxiliarInspeccV2Gen(1,2,"+index+","+val.detalleAuditoriaId+"," +
                            inspeccionesV2Obj.auditoriaId+","+val.verificacionId+")'>"+"<i class='fa fa-eye'></i> Ver registros"+"</a>";

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

    $("#registroPrincipalInspeccionV2Gen .contenidoSubList").html(textTotalRegistros);

    $.unblockUI();
}

var regEvalInspeccV2GeneralObj = {},valRespPregInspeccV2GenObj = {};
var hasValRespPregInspeccV2Gen;

function ocultarRegistroEvaluacionInspeccV2General(){
    $("#modalRegistroEvalInspeccV2Gen").modal("hide");$("#modalPrincipalInspeccV2General").modal("show");

    document.getElementById("labelEstadoRespInspeccV2Aux"+objInspeccionV2Gen.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
}

function registroEvaluacionInspeccV2General(){
    $("#modalPrincipalInspeccV2General").modal("hide");$("#modalRegistroEvalInspeccV2Gen").remove();

    hasValRespPregInspeccV2Gen = hashRespPreguntaInspeccV2Gen.has(objInspeccionV2Gen.verificacionId);
    valRespPregInspeccV2GenObj = (hasValRespPregInspeccV2Gen?hashRespPreguntaInspeccV2Gen.get(objInspeccionV2Gen.verificacionId):{});

    var dataParam={
        detalleAuditoriaId:(hasValRespPregInspeccV2Gen?valRespPregInspeccV2GenObj.detalleAuditoriaId:null),
        auditoriaId:(hasValRespPregInspeccV2Gen?null:inspeccionesV2Obj.auditoriaId),
        verificacionId:(hasValRespPregInspeccV2Gen?null:objInspeccionV2Gen.verificacionId)
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/detalle',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            regEvalInspeccV2GeneralObj = data.registroInspeccGeneralV3;

            var margenAux = (isMobile.any()?"margin:0px 0px -10px 0px;":"");

            var listEstadoPreguntaAux = [{id:1,nombre:"Aplica"},{id:0,nombre:"No aplica"}];
            var listRespuestaPreguntaAux = [{id:1,nombre:"Cumple"},{id:0,nombre:"No cumple"}];

            var radiosRespEstadoPregInspeccV2Gen = crearRadiosAutoVersionDos("radiosRespEstadoPregInspeccV2Gen",listEstadoPreguntaAux,
                (regEvalInspeccV2GeneralObj != null?regEvalInspeccV2GeneralObj.bitAplica:"1"),"id","nombre","habilitarCamposEstadoPregInspeccV2General","");

            var radiosRespPregInspeccV2Gen = crearRadiosAutoVersionDos("radiosRespPregInspeccV2Gen",listRespuestaPreguntaAux,
                (regEvalInspeccV2GeneralObj != null?regEvalInspeccV2GeneralObj.respuesta:"1"),"id","nombre","habilitarCamposMedCorrPregInspeccV2General","");

            var contenido = "";

            var listContenido=[
                {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:objInspeccionV2Gen.categoriaNombre+"<br>"+objInspeccionV2Gen.verificacion,inputForm:"",styleAux:"word-break:break-all;"},
                {sugerencia:"",styleAux:margenAux,anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado:",inputForm:radiosRespEstadoPregInspeccV2Gen}
            ];

            listContenido.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listSeparacionUno=[{sugerencia:"",clase:"campos-estado-inspeccv2gen",styleAux:"border-top:6px solid black;margin:10px -10px 0px -10px;",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}];

            listSeparacionUno.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listContenidoResp=[
                {sugerencia:"",clase:"campos-estado-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Respuesta:",inputForm:radiosRespPregInspeccV2Gen},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Observación:",inputForm:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textObsPregInspeccV2Gen' class='form-control' rows='4'></textarea>"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Evidencia:",inputForm:"",divContainer:"divEvidenciaPregInspeccV2Gen"}
            ];

            contenido += "<div class='campos-estado-inspeccv2gen eventoGeneral'>";
            listContenidoResp.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });
            contenido += "</div>";

            var listSeparacionDos=[{sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",styleAux:"border-top:6px solid black;margin:10px -10px 0px -10px;",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}];

            listSeparacionDos.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var listContenidoMedCorr=[
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** MEDIDA CORRECTIVA ***</span>",inputForm:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción:",inputForm:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDescMedCorrPregInspeccV2Gen' class='form-control' rows='4'></textarea>"+textCampoObligatorio},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Área responsable:",inputForm:"<input id='inputAreaRespMedCorrPregInspeccV2Gen' type='text' class='form-control'>"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Fecha planificada:",inputForm:"<input id='inputFechaPlanifMedCorrPregInspeccV2Gen' type='date' class='form-control'>"+textCampoObligatorio},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Responsable de la medida correctiva:",
                 inputForm:"<input type='text' id='inputTrabNombreMedCorrPregInspeccV2Gen' class='form-control'>" +
                           "<div id='divSelTrabajadorMedCorrPregInspeccV2Gen'></div>" +
                           "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"+textCampoObligatorio},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Evidencia - medida correctiva:",inputForm:"",divContainer:"divEvidenciaMedCorrPregInspeccV2Gen"},
                {sugerencia:"",styleAux:margenAux,clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",clase:"campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen",anchoLabel:"",anchoDiv:"",label:"Estado:",inputForm:"",divContainer:"divEstadoMedCorrPregInspeccV2Gen"}
            ];

            contenido += "<div class='campos-estado-inspeccv2gen campos-medcorr-inspeccv2gen eventoGeneral'>";
            listContenidoMedCorr.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });
            contenido += "</div>";

            var listCierre=[
                {sugerencia:"",styleAux:(isMobile.any()?"margin:10px -10px 0px -10px;":"margin:10px 0px 10px 0px;"),anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                {sugerencia:"",styleAux:(isMobile.any()?"display:flex;":""),anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
                    label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroEvaluacionInspeccV2General()'>" +
                        "<i class='fa fa-times'></i> Cancelar" +
                        "</button>",
                    inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarRegistroEvaluacionInspeccV2General()'>" +
                        "<i class='fa fa-floppy-o'></i> Guardar" +
                        "</button>"}
            ];

            listCierre.forEach(function(val,index){
                contenido += obtenerSubPanelModuloVersionDos(val);
            });

            var modalOptions={
                id:"modalRegistroEvalInspeccV2Gen",nombre:"<i class='fa fa-pencil'></i> Pregunta #"+(indexInspeccionV2Gen+1),
                contenido:"<div class='eventoGeneral'>"+contenido+"</div>",btnCerrarHabilitado:0
            };

            crearModalPrincipalUsuario(modalOptions,function(){},true,true);

            var options={
                container:"#divEvidenciaPregInspeccV2Gen",functionCall:function(){
                    validacionSubirEvidencia("PregInspeccV2Gen",bitsEvidenciaExamen,"modalRegistroEvalInspeccV2Gen");
                },descargaUrl:"/inspeccionv2/amazon_s3/pregunta/evidencia?auditoriaId="+inspeccionesV2Obj.auditoriaId+"&verificacionId="+objInspeccionV2Gen.verificacionId,
                esNuevo:(regEvalInspeccV2GeneralObj == null || regEvalInspeccV2GeneralObj.evidenciaNombre.length == 0?true:false),
                idAux:"PregInspeccV2Gen",evidenciaNombre:(regEvalInspeccV2GeneralObj != null?regEvalInspeccV2GeneralObj.evidenciaNombre:"")
            };

            crearFormEvidenciaCompleta(options);

            var optionsMedCorr={
                container:"#divEvidenciaMedCorrPregInspeccV2Gen",functionCall:function(){
                    estadoMedCorrPregInspeccV2General();validacionSubirEvidencia("MedCorrPregInspeccV2Gen",bitsEvidenciaExamen,"modalRegistroEvalInspeccV2Gen");
                },descargaUrl:"/inspeccionv2/amazon_s3/pregunta/accion_correctiva/evidencia?auditoriaId="+inspeccionesV2Obj.auditoriaId+"&verificacionId="+objInspeccionV2Gen.verificacionId,
                esNuevo:(regEvalInspeccV2GeneralObj == null || regEvalInspeccV2GeneralObj.evidenciaAccCorNombre.length == 0?true:false),
                idAux:"MedCorrPregInspeccV2Gen",evidenciaNombre:(regEvalInspeccV2GeneralObj != null?regEvalInspeccV2GeneralObj.evidenciaAccCorNombre:""),
                mensajeAux:"*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
            };

            crearFormEvidenciaCompleta(optionsMedCorr);

            if(regEvalInspeccV2GeneralObj != null){
                $("#textObsPregInspeccV2Gen").val(regEvalInspeccV2GeneralObj.comentario);

                if(regEvalInspeccV2GeneralObj.respuesta == 0.00){
                    $("#textDescMedCorrPregInspeccV2Gen").val(regEvalInspeccV2GeneralObj.accionCorrectiva);
                    $("#inputAreaRespMedCorrPregInspeccV2Gen").val(regEvalInspeccV2GeneralObj.areaObservada);
                    $("#inputFechaPlanifMedCorrPregInspeccV2Gen").val(convertirFechaInput(regEvalInspeccV2GeneralObj.fechaPlanificacion));
                    $("#inputTrabNombreMedCorrPregInspeccV2Gen").val(regEvalInspeccV2GeneralObj.responsable);
                }
            }

            buscarResponsableMedCorrPregInspeccV2General();estadoMedCorrPregInspeccV2General();
            habilitarCamposEstadoPregInspeccV2General((regEvalInspeccV2GeneralObj != null?regEvalInspeccV2GeneralObj.bitAplica:1));
        }else{
            mensajeUx = "<label>Ocurrió un error al cargar el registro pregunta de la inspección.</label>";
            mensajesUx(mensajeUx,2,"","ValidacionPregInspeccV2Gen");

            $("#modalMensajeUxValidacionPregInspeccV2Gen").on("hidden.bs.modal",function(){
                $("#modalPrincipalInspeccV2General").modal("show");
            });
        }
    });
}

var listRespBuscadorProgMedCorrPregInspeccV2GenAux = [];

function buscarResponsableMedCorrPregInspeccV2General(){
    var nombre = $("#inputTrabNombreMedCorrPregInspeccV2Gen").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listRespBuscadorProgMedCorrPregInspeccV2GenAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selResponsableMedCorrPregInspeccV2Gen = crearSelectOneMenuOblig("selResponsableMedCorrPregInspeccV2Gen",
                "",listRespBuscadorProgMedCorrPregInspeccV2GenAux,"","trabajadorId","nombre");

            $("#divSelTrabajadorMedCorrPregInspeccV2Gen").html(selResponsableMedCorrPregInspeccV2Gen);
            $("#inputTrabNombreMedCorrPregInspeccV2Gen").attr("onkeyup","buscarResponsableMedCorrPregInspeccV2General()");
        });
    }else{
        listRespBuscadorProgMedCorrPregInspeccV2GenAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selResponsableMedCorrPregInspeccV2Gen = crearSelectOneMenuOblig("selResponsableMedCorrPregInspeccV2Gen",
            "",listRespBuscadorProgMedCorrPregInspeccV2GenAux,"","trabajadorId","nombre");

        $("#divSelTrabajadorMedCorrPregInspeccV2Gen").html(selResponsableMedCorrPregInspeccV2Gen);
        $("#inputTrabNombreMedCorrPregInspeccV2Gen").attr("onkeyup","buscarResponsableMedCorrPregInspeccV2General()");
    }
}

function habilitarCamposEstadoPregInspeccV2General(value){
    (value == 0?$(".campos-estado-inspeccv2gen").hide():$(".campos-estado-inspeccv2gen").show());

    if(value == 1){
        var respPregAux = parseInt($("input[name='radiosRespPregInspeccV2Gen']:checked").val());

        habilitarCamposMedCorrPregInspeccV2General(respPregAux);
    }
}

function habilitarCamposMedCorrPregInspeccV2General(value){
    (inspeccionesV2Obj.snAutoInspeccion == 1 || value == 1?$(".campos-medcorr-inspeccv2gen").hide():$(".campos-medcorr-inspeccv2gen").show());
}

function estadoMedCorrPregInspeccV2General(){
    var nombreMedCorrEvi = $("#inputEviMedCorrPregInspeccV2Gen").val();
    var styleDivEstado = "color:"+(nombreMedCorrEvi.length == 0?"#A5AA13":"blue")+";font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+";";
    var contenidoDivEstado = (nombreMedCorrEvi.length == 0?"Pendiente":"Completado");

    $("#divEstadoMedCorrPregInspeccV2Gen").html("<span style='"+styleDivEstado+"'>"+contenidoDivEstado+"</span>");
}

function guardarRegistroEvaluacionInspeccV2General(){
    var campoVacio = true;

    var estado = parseInt($("input[name='radiosRespEstadoPregInspeccV2Gen']:checked").val());

    var respuesta = (estado == 1?parseInt($("input[name='radiosRespPregInspeccV2Gen']:checked").val()):null);
    var observacion = (estado == 1?$("#textObsPregInspeccV2Gen").val():null);
    var evidenciaNombre = (estado == 1?$("#inputEviPregInspeccV2Gen").val():null);
    var habilitadoEviPregInspeccV2Gen = (estado == 1?1:0);

    var habilitadoMedCorrPregInspeccV2Gen = (inspeccionesV2Obj.snAutoInspeccion == 0 && estado == 1 && respuesta == 0?true:false);

    var medCorrDescripcion = (habilitadoMedCorrPregInspeccV2Gen?$("#textDescMedCorrPregInspeccV2Gen").val():null);
    var medCorrAreaResp = (habilitadoMedCorrPregInspeccV2Gen?$("#inputAreaRespMedCorrPregInspeccV2Gen").val():null);
    var medCorrfechaPlanificada = (habilitadoMedCorrPregInspeccV2Gen?convertirFechaTexto($("#inputFechaPlanifMedCorrPregInspeccV2Gen").val()):null);
    var inputMedCorrfechaPlanificada = (habilitadoMedCorrPregInspeccV2Gen?(!medCorrfechaPlanificada?null:medCorrfechaPlanificada):null);
    var medCorrResponsableId = (habilitadoMedCorrPregInspeccV2Gen?parseInt($("#selResponsableMedCorrPregInspeccV2Gen").val()):null);
    var medCorrEvidenciaNombre = (habilitadoMedCorrPregInspeccV2Gen?$("#inputEviMedCorrPregInspeccV2Gen").val():null);
    var habilitadoEviMedCorrPregInspeccV2Gen = (habilitadoMedCorrPregInspeccV2Gen?1:0);

    if(habilitadoMedCorrPregInspeccV2Gen && (medCorrDescripcion.trim().length == 0 || inputMedCorrfechaPlanificada == null || medCorrResponsableId == -1)){
        campoVacio = false;mensajeUx = "<label>Debe completar los campos obligatorios de la medida correctiva.</label>";
    }else if(habilitadoEviPregInspeccV2Gen == 1 && evidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }else if(habilitadoEviMedCorrPregInspeccV2Gen == 1 && medCorrEvidenciaNombre == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia de la medida correctiva.</label>";
    }

    if(campoVacio){
        var dataParam={
            detalleAuditoriaId:(hasValRespPregInspeccV2Gen?valRespPregInspeccV2GenObj.detalleAuditoriaId:0),auditoriaId:inspeccionesV2Obj.auditoriaId,
            verificacionId:objInspeccionV2Gen.verificacionId,bitAplica:estado,trabajadorId:parseInt(getSession("trabajadorGosstId")),
            bucketNombre:BUCKETAMAZONS3,bitRespuesta:respuesta,comentario:observacion,accionCorrectiva:medCorrDescripcion,areaObservada:medCorrAreaResp,
            fechaPlanificacion:inputMedCorrfechaPlanificada,responsableId:medCorrResponsableId
        };

        callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/save',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
//                    guardarEvidenciaAutoVersionTres(habilitadoEviPregInspeccV2Gen,data.nuevoId,"fileEviPregInspeccV2Gen",bitsEvidenciaEvalEvento,0,0,
//                    "/inspeccionv2/pregunta/evidencia/save",function(){
                    guardarEvidenciaAutoVersionS3(habilitadoEviPregInspeccV2Gen,data.nuevoId,"fileEviPregInspeccV2Gen",bitsEvidenciaEvalEvento,
                    0,0,"/inspeccionv2/amazon_s3/pregunta/evidencia/save","detalle-auditoria/evidencia",function(){
                        guardarEvidenciaAutoVersionS3(habilitadoEviMedCorrPregInspeccV2Gen,data.nuevoId,"fileEviMedCorrPregInspeccV2Gen",bitsEvidenciaEvalEvento,
                        0,1,"/inspeccionv2/amazon_s3/pregunta/accion_correctiva/evidencia/save","detalle-auditoria/evidencia-acc-correctiva",function(){
                            $("#modalRegistroEvalInspeccV2Gen").modal("hide");

                            var textRespActual = "("+(estado == 1?"Aplica"+" / "+(respuesta == 1?"Cumple":"No cumple"):"No aplica")+")";
                            var textColorRespActual = (estado == 1?"blue":"red");

                            document.querySelector('#labelEstadoRespInspeccV2Aux'+objInspeccionV2Gen.verificacionId).innerText = textRespActual;
                            document.getElementById('labelEstadoRespInspeccV2Aux'+objInspeccionV2Gen.verificacionId).style.color = textColorRespActual;
                            document.getElementById('labelEstadoPregInspeccV2Aux'+objInspeccionV2Gen.verificacionId).style.color = textColorRespActual;

                            hashRespPreguntaInspeccV2Gen.set(objInspeccionV2Gen.verificacionId,{detalleAuditoriaId:data.nuevoId,textRespActual:textRespActual,textColorRespActual:textColorRespActual});

                            $("#labelAvanceInspeccV2Gen").html("Avance: "+hashRespPreguntaInspeccV2Gen.size+" / "+listPreguntasInspeccionV2Gen.length);

                            if(estado == 1){
                                $("."+inspeccionesV2Obj.auditoriaId+"campo-inspeccv2-evi-aux"+objInspeccionV2Gen.verificacionId).show();
                            }
                            
                            mensajeUx = "<label>El registro de la respuesta fue guardado con éxito.</label>";
                            mensajesUx(mensajeUx,1,"","ActualizarRegEvalInspeccV2Gen");

                            $("#modalMensajeUxActualizarRegEvalInspeccV2Gen").on("hidden.bs.modal",function(){
                                actualizarPrincipalInspeccV2Gen = 1;$("#modalPrincipalInspeccV2General").modal("show");

                                document.getElementById("labelEstadoRespInspeccV2Aux"+objInspeccionV2Gen.verificacionId).scrollIntoView({behavior:"auto",block:"center",inline:"nearest"});
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
        $("#modalRegistroEvalInspeccV2Gen").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionRegEvalInspeccV2Gen");

        $("#modalMensajeUxValidacionRegEvalInspeccV2Gen").on("hidden.bs.modal",function(){
            $("#modalRegistroEvalInspeccV2Gen").modal("show");
        });
    }
}

function previoMarcarCumpleRespInspeccionV2General(){
    $("#modalPrincipalInspeccV2General").modal("hide");
    
    if(hashRespPreguntaInspeccV2Gen.size != listPreguntasInspeccionV2Gen.length){
        mensajeUx="<label>¿Desea marcar todas las preguntas pendientes con la respuesta 'Cumple'?</label>";
        mensajesUx(mensajeUx,3,"","CompletarAutoRegEvalInspeccV2Gen");

        $("#btnDevolverValorCompletarAutoRegEvalInspeccV2Gen").on("click",function(){
            var dataParam={
                auditoriaId:inspeccionesV2Obj.auditoriaId,auditoriaTipo:inspeccionesV2Obj.tipo.id,bitAplica:1,bitRespuesta:1,
                trabajadorId:parseInt(getSession("trabajadorGosstId"))
            };

            callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/pregunta/respuesta/inspeccion_general/autocompletado/save',dataParam,1,1,function(data){
        	switch(data.CODE_RESPONSE){
                    case "05":
 	                mensajeUx = "<label>La respuesta 'Cumple' de las preguntas pendientes se guardó con éxito.</label>";
 	                mensajesUx(mensajeUx,1,"","ActualizarRegEvalInspeccV2Gen");

 	                $("#modalMensajeUxActualizarRegEvalInspeccV2Gen").on("hidden.bs.modal",function(){
 	                    actualizarPrincipalInspeccV2Gen = 1;$("#modalPrincipalInspeccV2General").modal("show");
 	                    
 	                    cargarPrincipalInspeccionV2General();
 	                });
 	       
 	                break;
			
                    default:
                	alert("Ocurrió un error al intentar responder todas las preguntas pendientes.");
        	}
            });
        });
    
        $("#btnRegresarPrevioCompletarAutoRegEvalInspeccV2Gen").on("click",function(){
            $("#modalPrincipalInspeccV2General").modal("show"); 
        });
    }else{
	mensajeUx="<label>Función no disponible porque no hay más preguntas pendientes sin respuesta.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionRegEvalInspeccV2Gen");
        
        $("#modalMensajeUxValidacionRegEvalInspeccV2Gen").on("hidden.bs.modal",function(){
            $("#modalPrincipalInspeccV2General").modal("show");
        });
    }
}
