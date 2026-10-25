
var inspeccionesV2Id,indexInspeccionesV2,inspeccionesV2Obj = {},empresaInspeccV2Obj = {};
var listInspeccionesV2 = [];
var listTipoInspeccionV2 = [],listUnidadesInspeccionV2 = [],listDivisionesInspeccionV2 = [],listAreasInspeccionV2 = [];
var snInicioRapidoInspeccV2,inicioRapidoInspeccV2Id,indexInicioRapidoInspeccV2Aux;
var accesoFinalizarInspeccV2Gen;
var mensajeUx;

function ocultarFiltroInspeccionV2(){
    $("#modalFiltroInspeccionV2").modal("hide");
}

function verFiltroInspeccionV2(){
    $("#modalFiltroInspeccionV2").modal("show");
}

function crearFiltroInspeccionV2(functionCallBack){
    $("#modalFiltroInspeccionV2").remove();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),autoInspeccion:(numAreasResponsable == 0?1:null)
    };

    callAjaxPost(URL+'/inspeccionv2/vista_colaborador/filtro',dataParam,function(data){
        listTipoInspeccionV2 = data.listTipoInspeccionV2;listUnidadesInspeccionV2 = data.listUnidadesInspeccionV2;listDivisionesInspeccionV2 = data.listDivisionesInspeccionV2;
        listAreasInspeccionV2 = data.listAreasInspeccionV2;empresaInspeccV2Obj = data.empresaInspeccV2;
        
        var contenido = "";

        var listContenido=[
            {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",label:"<span style='font-size:20px;font-weight:bolder;'>Fecha planificada</span>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioFiltroInspeccV2' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinFiltroInspeccV2' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroInspeccionV2()' style='font-size:18px;'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                   "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='valoresFiltroInspeccionV2()'>" +
                           "<i class='fa fa-filter'></i> Aplicar" +
                       "</button>"}
        ];

        listContenido.forEach(function (val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptions={
            id:"modalFiltroInspeccionV2",nombre:"<i class='fa fa-filter'></i> Filtros",
            contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };

        crearModalPrincipalUsuario(modalOptions,function(){},true,true);

        var hoy = getSession("fechaHoyOrdenInversoTexto");

        $("#fechaInicioFiltroInspeccV2").val(sumaFechaDias(-180,hoy));$("#fechaFinFiltroInspeccV2").val(sumaFechaDias(15,hoy));
        
        snInicioRapidoInspeccV2 = 0;inicioRapidoInspeccV2Id = 0;

        functionCallBack();
    });
}

function valoresFiltroInspeccionV2(){
    ocultarFiltroInspeccionV2();

    
    if($("#fechaInicioFiltroInspeccV2").val().length > 0 && $("#fechaFinFiltroInspeccV2").val().length > 0){
	habilitarInspeccionV2();
    }else{
	mensajeUx="<label>Debe ingresar la 'Fecha planificada - Desde' y 'Fecha planificada - Hasta' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
	
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroInspeccionV2").modal("show");
	});
    }
}

function toggleMenuOpcionInspeccionV2(obj,pindex){
    inspeccionesV2Obj = listInspeccionesV2[pindex];
    indexInspeccionesV2 = pindex;

    if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
        $(".listaFinalGestionGosst").hide();
    }

    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
    
    if(snInicioRapidoInspeccV2 == 1){
	snInicioRapidoInspeccV2 = 0;inicioRapidoInspeccV2Id = 0;marcarSubOpcionInspeccionV2(0);
    }
}

var funcionalidadesEstadoInspeccionV2=[
    {id:"opcRealizarInspeccV2Est1&3",nombre:"<i class='fa fa-pencil-square-o'></i> Realizar evaluación",estadosHabilitados:[1,3],
     functionClick:function(data){verPrincipalInspeccionV2General();}},
    {id:"opcRealizarInspeccV2Est2",nombre:"<i class='fa fa-eye'></i> Ver evaluación",estadosHabilitados:[2],
     functionClick:function(data){verPrincipalInspeccionV2General();}},
    {id:"opcEditarInspeccV2Est1&3",nombre:"<i class='fa fa-pencil'></i> Editar registro",estadosHabilitados:[1,3],
     functionClick:function(data){registroInspeccionV2(1);}},
    {id:"opcFinalizarInspeccV2Est1&3",nombre:"<i class='fa fa-check-square'></i> Finalizar inspección",estadosHabilitados:[1,3],
     functionClick:function(data){previoVerFinalizarInspeccionV2General(0);}}
];

function marcarSubOpcionInspeccionV2(pindex){
    funcionalidadesEstadoInspeccionV2[pindex].functionClick();
    $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function habilitarInspeccionV2(){
    var dataParam={
        trabajadorId:parseInt(getSession("trabajadorGosstId")),fechaPlanificadaInicio:$("#fechaInicioFiltroInspeccV2").val(),
        fechaPlanificadaFin:$("#fechaFinFiltroInspeccV2").val()
    };

    callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/vista_colaborador',dataParam,1,1,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                var listPanelesPrincipal = [];
                var textEstadoUno = "",textEstadoDos = "",textEstadoTres = "";
                var numEstadoUno = 0,numEstadoDos = 0,numEstadoTres = 0;

                listInspeccionesV2 = data.listInspeccionesV2;

                $(".divListPrincipal").html("");
                
                listInspeccionesV2.forEach(function(val,index){
                    var btnOpcion = "",menuOpcion = "";

                    menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
                    funcionalidadesEstadoInspeccionV2.forEach(function(val1,index1){
                        if(val1.estadosHabilitados.includes(val.estado.id)){
                            menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionInspeccionV2("+index1+")'>"+val1.nombre+"</li>";
			}
                    });
                    menuOpcion += "</ul>";
                        
                    btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionInspeccionV2(this,"+index+")'>" +
                            "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
                        "</a>";
                        
                    if(snInicioRapidoInspeccV2 == 1 && inicioRapidoInspeccV2Id == val.auditoriaId){
                	indexInicioRapidoInspeccV2Aux = index;
                    }    
                    
                    var lugar = (val.lugar.length == 0?"------":val.lugar),detalle = (val.observacion.length == 0?"------":val.observacion),
                        respuestaInspecc = (val.respInspeccPlanificada == 1?"Sí":"No");

                    var listTotal=[
                        {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
                         label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO "+val.codigo+" ***</span>"},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-calendar'></i> Fecha y hora planificada:",inputForm:val.fechaPlanificadaTexto+" "+val.horaPlanificadaTexto}
                    ];

                    if(val.estado.id == 2){
                        listTotal.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-calendar'></i> Fecha realizada:",inputForm:val.fechaRealizadaTexto});
                    }

                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list'></i> Tipo:",inputForm:val.tipo.nombre,styleAux:"word-break:break-all;"},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list'></i> ¿Planificada?",inputForm:respuestaInspecc},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> Unidad:",inputForm:val.nombreUnidades},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> División:",inputForm:val.nombreDivisiones},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> Área:",inputForm:val.nombreAreas},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

                    var lugarTexto = (val.snAutoInspeccion == 1 && numAreasResponsable == 0?"Dirección":"Lugar");
                    
                    if(val.lugar.trim().length == 0){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil'></i> "+lugarTexto+":",inputForm:"------"});
                    }else{
                        listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil'></i> "+lugarTexto+":",inputForm:""},
                            {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.lugar,styleAux:"word-break:break-all;"});
                    }
                    
                    var detalleTexto = (val.snAutoInspeccion == 1 && numAreasResponsable == 0?"¿Presenta alguna discapacidad?":"Detalle:");

                    if(val.observacion.trim().length == 0){
                        listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil'></i> "+detalleTexto,inputForm:"------"});
                    }else{
                        listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil'></i> "+detalleTexto,inputForm:""},
                            {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.observacion,styleAux:"word-break:break-all;"});
                    }
                    
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Avance:",inputForm:val.numRespuestas+" / "+val.numPreguntas});
                    
                    if(val.snAutoInspeccion == 0){
                        if(val.numMedidasCorrectivas > 0){
                	    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Medidas correctivas:",inputForm:val.numMedidasCorrectivasCompletadas+" / "+val.numMedidasCorrectivas});
                        }else{
                            listTotal.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"*Sin medidas correctivas registradas.",inputForm:""});
                        }
                    }
                    
                    if(val.estado.id == 2){
                	var excelFinal = "<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/inspeccion/excel/reporte_final?"+"auditoriaId="+val.auditoriaId+"'>" +
			        "<i class='fa fa-download'></i> Descargar" +
			    "</a>";
                	
                	listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file-excel-o'></i> Reporte final:",inputForm:excelFinal});
                            
                    }

                    if(val.fechaRegistroTexto.length > 0 || val.fechaActualizacionTexto.length > 0){
                	listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
                    
                        if(val.fechaRegistroTexto.length > 0){
                            listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",inputForm:val.fechaRegistroTexto});
                        }
                    
                        if(val.fechaActualizacionTexto.length > 0){
                            listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",inputForm:val.fechaActualizacionTexto});
                        }
                    }

                    var textAccidenteSsomaAux = "";

                    textAccidenteSsomaAux += "<div class='eventoGeneral'>" +
                                                 "<div class='eventoGeneral'>";
                    listTotal.forEach(function(val,index){
                        textAccidenteSsomaAux += obtenerSubPanelModuloVersionDos(val);
                    });
                    textAccidenteSsomaAux +=     "</div>" +
                                             "</div>";

                    if(val.estado.id == 1){
                        textEstadoUno += textAccidenteSsomaAux;numEstadoUno++;
                    }else if(val.estado.id == 2){
                        textEstadoDos += textAccidenteSsomaAux;numEstadoDos++;
                    }else if(val.estado.id == 3){
                        textEstadoTres += textAccidenteSsomaAux;numEstadoTres++;
                    }
                });

                if([154,543,591].includes(parseInt(getSession("gestopcompanyid")))){
                    listPanelesPrincipal.push({id:"nuevoRegistroAccidenteSssoma",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroInspeccionV2(0)",
                        btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar evento",contenido:""});
                }

                listPanelesPrincipal.push({id:"opcionesInspeccionV2",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroInspeccionV2()",
                     btnIconoAux:"fa-filter",btnTitleAux:"Opciones de los registros",nombre:"Opciones",contenido:""},
                    {id:"estadoUnoInspeccionV2",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Inspecciones pendientes ("+numEstadoUno+")",contenido:textEstadoUno},
                    {id:"estadoTresInspeccionV2",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Inspecciones retrasadas ("+numEstadoTres+")",contenido:textEstadoTres},
                    {id:"estadoDosInspeccionV2",clase:"",styleAux:"display:none;",buttonAd:"",btnOnclickAux:"",
                     btnIconoAux:"",btnTitleAux:"",nombre:"Inspecciones completadas ("+numEstadoDos+")",contenido:textEstadoDos});

                // if(parseInt(getSession("gestopcompanyid")) == 154){
                //     listPanelesPrincipal.push({id:"quicksightAccidenteSssoma",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verQuicksightInspeccionV2()",
                //         btnIconoAux:"fa-pie-chart",btnTitleAux:"Ver gráficos en quicksight",nombre:"Ver análisis de datos",contenido:""});
                // }

                agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

                $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
                
                if(snInicioRapidoInspeccV2 == 1){
                    toggleMenuOpcionInspeccionV2(this,indexInicioRapidoInspeccV2Aux);
                }
                
                window.scrollTo({top:0,behavior:'smooth'});

                break;

            default:
                alert("nop");

                break;
        }
    });
}

function ocultarRegistroInspeccionV2(){
    $("#modalRegistroInspeccionV2").modal("hide");
}

function registroInspeccionV2(opcionIdAux){
    $("#modalRegistroInspeccionV2").remove();
    
    var opcionId = parseInt(opcionIdAux);

    inspeccionesV2Id = (opcionId == 0?0:inspeccionesV2Obj.auditoriaId);
    
    var listBooleanSiNo = listBoolean.sort(function(val,val2){
	return val2.id - val.id;
    });

    var selTipoInspeccionV2 = crearSelectOneMenu("selTipoInspeccionV2","",listTipoInspeccionV2,"-1","id","nombre");
    
    var radiosRespPlanifInspeccV2 = crearRadiosAutoVersionDos("radiosRespPlanifInspeccV2",listBooleanSiNo,
	(inspeccionesV2Id > 0?inspeccionesV2Obj.respInspeccPlanificada:"1"),"id","nombre","","");

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:(inspeccionesV2Id > 0?inspeccionesV2Obj.tipo.nombre:selTipoInspeccionV2)}, 
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha planificada",inputForm:"<input id='inputFechaPlanInspeccV2' type='date' class='form-control'>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora planificada",inputForm:"<input id='inputHoraPlanInspeccV2' type='time' class='form-control'>"},
	{sugerencia:"",clase:"campo-preg-planificado",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",clase:"campo-preg-planificado",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Planificada?",inputForm:radiosRespPlanifInspeccV2},
    ];
	
    if(inspeccionesV2Id == 0 && parseInt(getSession("gestopcompanyid")) == 500){
	listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Unidad*",inputForm:"",divContainer:"divSelUnidadInspeccV2"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"División*",inputForm:"",divContainer:"divSelDivisionInspeccV2"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Área*",inputForm:"",divContainer:"divSelAreaInspeccV2"});
    }else{
	listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Área*",inputForm:"",divContainer:"divSelAreaAuxInspeccV2"});
    }
	
    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:(numAreasResponsable > 0?"Lugar":"Dirección"),inputForm:""},
	{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='2' id='textLugarInspeccV2'></textarea>" +
         "<label style='float:right;color:blue;'>(opcional)</label>"},
	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:(numAreasResponsable > 0?"Detalle":"¿Presenta alguna discapacidad?"),inputForm:""},
	{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea class='form-control' rows='4' id='textDetalleInspeccV2'></textarea>" +
	 "<label style='float:right;color:blue;'>(opcional)</label>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",
	 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroInspeccionV2()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	       "</button>",
	 inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarRegistroInspeccionV2()'>" +
		       "<i class='fa fa-floppy-o'></i> Guardar" +
		   "</button>"});

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
	id:"modalRegistroInspeccionV2",nombre:"<i class='fa fa-pencil'></i> Registro de la inspección",
	contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
    if(inspeccionesV2Id == 0 && parseInt(getSession("gestopcompanyid")) == 500){
        var selUnidadInspeccV2 = crearSelectOneMenu("selUnidadInspeccV2","filtrarDivisionesSegunUnidadInspeccionV2()",
            listUnidadesInspeccionV2,(parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidadesInspeccionV2.length == 0?"Sin unidades registradas":null));

        $("#divSelUnidadInspeccV2").html(selUnidadInspeccV2);

        filtrarDivisionesSegunUnidadInspeccionV2();
    }else{
	var listAreasAux = (inspeccionesV2Id > 0?inspeccionesV2Obj.listAreasId.split(","):[getSession("areaGosstId")+""]);
	var listAreasAuxInspeccionV2 = listAreasInspeccionV2;
	
	listAreasAuxInspeccionV2.forEach(function(val){
	    val.selected = 0;
		    
	    listAreasAux.forEach(function(val1){
	        if(parseInt(val1) == val.areaId){
		    val.selected = 1;
	        }
	    });	
	});
		
	crearSelectOneMenuObligMultipleCompleto("selAreaAuxInspeccV2","",listAreasAuxInspeccionV2,
	    "areaId","nombreAuxiliar","#divSelAreaAuxInspeccV2","sin asignar");
	
	$("#divSelAreaAuxInspeccV2").append("<br><label>Unidad > División > Área*</label>");
    }
    
    if(numAreasResponsable == 0){
	$(".campo-preg-planificado").hide();
    }
    
    if(inspeccionesV2Id > 0){
	$("#inputFechaPlanInspeccV2").val(convertirFechaInput(inspeccionesV2Obj.fechaPlanificada));$("#inputHoraPlanInspeccV2").val(inspeccionesV2Obj.horaPlanificada);
	$("#textLugarInspeccV2").val(inspeccionesV2Obj.lugar);$("#textDetalleInspeccV2").val(inspeccionesV2Obj.observacion);
	
	$("#inputFechaPlanInspeccV2").prop("disabled",true);$("#inputHoraPlanInspeccV2").prop("disabled",true);$("#0radiosRespPlanifInspeccV2").prop("disabled",true);
	$("#1radiosRespPlanifInspeccV2").prop("disabled",true);
    }else{
	$("#inputFechaPlanInspeccV2").val(convertirFechaInputNoUTC(new Date()));$("#inputHoraPlanInspeccV2").val(obtenerHoraActual(1));
    }
}

var selDivisionInspeccV2,selAreaInspeccV2,textoAdicional,textoSelectVacioAux1,textoSelectVacioAux2;

function filtrarDivisionesSegunUnidadInspeccionV2(){
    var listDivisionInspeccV2Aux = [];selDivisionInspeccV2 = "";

    textoSelectVacioAux1 = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
    textoSelectVacioAux2 = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

    var unidadIdAux = parseInt($("#selUnidadInspeccV2").val());

    if(listDivisionesInspeccionV2.length != 0 && unidadIdAux != -1){
        listDivisionesInspeccionV2.forEach(function(val){
            if(val.matrixId == unidadIdAux){
                listDivisionInspeccV2Aux.push(val);
            }
        });

        selDivisionInspeccV2 = crearSelectOneMenu("selDivisionInspeccV2","filtrarAreasSegunDivisionInspeccionV2()",listDivisionInspeccV2Aux,
            (parseInt(getSession("gestopcompanyid")) == 500?"2430":""),"divisionId","divisionName",(listDivisionInspeccV2Aux.length == 0?"Sin "+textoSelectVacioAux1+" asociadas":null));

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" para seleccionar")+".</small>";
    }

    $("#divSelDivisionInspeccV2").html(selDivisionInspeccV2+textoAdicional);

    filtrarAreasSegunDivisionInspeccionV2();
}

function filtrarAreasSegunDivisionInspeccionV2(){
    var listAreaEventoInspeccionAux = [];selAreaInspeccV2 = "";

    textoSelectVacioAux1 = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
    textoSelectVacioAux2 = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

    var divisionIdAux = (selDivisionInspeccV2.length == 0?-1:parseInt($("#selDivisionInspeccV2").val()));

    if(listAreasInspeccionV2.length != 0 && divisionIdAux != -1){
	listAreasInspeccionV2.forEach(function(val){
            if(val.divisionId == divisionIdAux){
                listAreaEventoInspeccionAux.push(val);
            }
        });

        if(listAreaEventoInspeccionAux.length > 0){
            selAreaInspeccV2 = crearSelectOneMenuObligMultipleCompleto("selAreaInspeccV2","",
                listAreaEventoInspeccionAux,"areaId","areaNameShort","#divSelAreaInspeccV2","Todos");
        }else{
            $("#divSelAreaInspeccV2").html("<label>Sin "+textoSelectVacioAux1+" con responsables</label><br>");
        }

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";

        $("#divSelAreaInspeccV2").append(textoAdicional);
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" con responsables para seleccionar")+".</small>";

        $("#divSelAreaInspeccV2").html(selAreaInspeccV2+textoAdicional);
    }
}

function guardarRegistroInspeccionV2(){
    var campoVacio = true;
    
    var tipoInspeccionId = parseInt($("#selTipoInspeccionV2").val());
    var fechaPlanificada = convertirFechaTexto($("#inputFechaPlanInspeccV2").val());
    var inputFechaPlanificada = (!fechaPlanificada?null:fechaPlanificada);
    var horaPlanificada = $("#inputHoraPlanInspeccV2").val();
    var snPlanificado = parseInt($("input[name='radiosRespPlanifInspeccV2']:checked").val());
    var lugar = $("#textLugarInspeccV2").val();
    var detalle = $("#textDetalleInspeccV2").val();
    
    var listAreasSeleccionadas = [];

    var listAreasAux = (inspeccionesV2Id == 0 && parseInt(getSession("gestopcompanyid")) == 500?$("#selAreaInspeccV2").val():$("#selAreaAuxInspeccV2").val());

    if(listAreasAux != null){
        listAreasAux.forEach(function(val,index){
            listAreasSeleccionadas.push({areaId:parseInt(val)});
        });
    }

    if(tipoInspeccionId == -1 || inputFechaPlanificada == null || horaPlanificada.length == 0){
	campoVacio = false;mensajeUx = "<label>Debe completar los campos obligatorios.</label>";
    }else if(listAreasSeleccionadas.length == 0){
	campoVacio = false;mensajeUx = "<label>Debe seleccionar al menos un área.</label>";
    }
    
    if(campoVacio){
	var dataParam={
	    auditoriaId:inspeccionesV2Id,auditoriaTipo:tipoInspeccionId,fechaPlanificada:inputFechaPlanificada,horaPlanificada:horaPlanificada,
	    respInspeccPlanificada:snPlanificado,lugar:lugar,observacion:detalle,empresaId:parseInt(getSession("gestopcompanyid")),
	    trabajadorId:parseInt(getSession("trabajadorGosstId")),listAreas:listAreasSeleccionadas
        };
	
	callAjaxPostSimpleVersionDos(1,URL+"/inspeccionv2/save",dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
		case "05":
	            $("#modalRegistroInspeccionV2").modal("hide");

	            if(inspeccionesV2Id > 0){
	        	mensajeUx = "<label>El registro de la inspección fue guardado con éxito.</label>";
		  	mensajesUx(mensajeUx,1,"","ActualizarInspeccV2");

		  	$("#modalMensajeUxActualizarInspeccV2").on("hidden.bs.modal",function(){
		  	    habilitarInspeccionV2();
			});
	            }else{
	                mensajeUx="<label>El registro de la inspección fue guardado con éxito.<label>" +
	                    "<br><label>¿Desea empezarla de inmediato?</label>";
	                mensajesUx(mensajeUx,9,"","RespEmpezarInspeccV2");

	                $("#btnDevolverValorRespEmpezarInspeccV2").on("click",function(){
	                    snInicioRapidoInspeccV2 = 1;inicioRapidoInspeccV2Id = data.nuevoId;habilitarInspeccionV2();
	                });

	                $("#btnRegresarPrevioRespEmpezarInspeccV2").on("click",function(){
	                    habilitarInspeccionV2();
	                });
	            }

		    break;

		default:
		    alert("Ocurrió un error al guardar la inspección.");
	    }
        });
    }else{
	$("#modalRegistroInspeccionV2").modal("hide");
	
        mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");

        $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
            $("#modalRegistroInspeccionV2").modal("show");
        });
    }
}

function previoVerFinalizarInspeccionV2General(opcionAcceso){
    var previoOpcionAccesoAux = parseInt(opcionAcceso);
    
    if(previoOpcionAccesoAux == 0 && inspeccionesV2Obj.numRespuestas == inspeccionesV2Obj.numPreguntas){
	verFinalizarInspeccionV2General(0);
    }else if(previoOpcionAccesoAux == 1 && hashRespPreguntaInspeccV2Gen.size == listPreguntasInspeccionV2Gen.length){
	verFinalizarInspeccionV2General(1);
    }else{
	$("#modalPrincipalInspeccV2General").modal("hide");
	
	mensajeUx = "<label>Debe responder todas las preguntas de la inspección para finalizarla.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionInspeccV2Gen");
	
	$("#modalMensajeUxValidacionInspeccV2Gen").on("hidden.bs.modal",function(){
    	    if(previoOpcionAccesoAux == 1){
    		$("#modalPrincipalInspeccV2General").modal("show");
    	    }
        });
    }
}

function ocultarFinalizarInspeccV2General(){
    $("#modalFinalizarInspeccionV2Gen").modal("hide");

    if(accesoFinalizarInspeccV2Gen == 1){
        $("#modalPrincipalInspeccV2General").modal("show");
    }
}

function verFinalizarInspeccionV2General(opcionAcceso){
    $("#modalPrincipalInspeccV2General").modal("hide");$("#modalFinalizarInspeccionV2Gen").remove();

    accesoFinalizarInspeccV2Gen = parseInt(opcionAcceso);

    var contenido = "";

    var listContenido=[
        {sugerencia:"",label:"Fecha realizada",inputForm:"<input type='date' id='fechaRealizadaInspeccV2Gen' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",styleAux:(isMobile.any()?"display:flex;":""),anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFinalizarInspeccV2General()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarFinalizarInspeccV2General()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"},
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalFinalizarInspeccionV2Gen",nombre:"<i class='fa fa-check-square'></i> Finalizar inspección",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var hoy = getSession("fechaHoyOrdenInversoTexto");

    $("#fechaRealizadaInspeccV2Gen").val(hoy);
}

function guardarFinalizarInspeccV2General(){
    var campoVacio = true;

    var fechaRealizada = convertirFechaTexto($("#fechaRealizadaInspeccV2Gen").val());
    var inputFechaRealizada = (!fechaRealizada?null:fechaRealizada);

    if(inputFechaRealizada == null){
        campoVacio = false;mensajeUx = "<label>Debe ingresar la 'fecha realizada'.</label>";
    }

    if(campoVacio){
        var dataParam={
            auditoriaId:inspeccionesV2Obj.auditoriaId,fechaRealizada:inputFechaRealizada,bucketNombre:BUCKETAMAZONS3
        };

        callAjaxPostSimpleVersionDos(1,URL+'/inspeccionv2/finalizar/inspeccion_general/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalFinalizarInspeccionV2Gen").modal("hide");

                    mensajeUx = "<label>El registro de finalización de la inspección fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarFinalizarInspeccV2Gen");

                    $("#modalMensajeUxActualizarFinalizarInspeccV2Gen").on("hidden.bs.modal",function(){
                	habilitarInspeccionV2();
                    });

                    break;

                default:
                    alert("Ocurrió un error al finalizar la inspección.");
            }
        });
    }else{
        $("#modalFinalizarInspeccionV2Gen").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionFinalizarInspeccV2Gen");

        $("#modalMensajeUxValidacionFinalizarInspeccV2Gen").on("hidden.bs.modal",function(){
            $("#modalFinalizarInspeccionV2Gen").modal("show");
        });
    }
}
