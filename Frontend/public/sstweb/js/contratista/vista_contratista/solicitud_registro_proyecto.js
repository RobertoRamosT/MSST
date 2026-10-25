
var solRegProyId,indexSolRegProy,solRegProyObj = {},empAuxSolRegProyObj = {};
var listSolicitudesRegistroProy = [];
var listEvaluacionSolRegProy = [],listPerfilesEspecialesSolRegProy = [],listResponsablesSolRegProy = [],listAreasSolRegProy = [],
    listLugaresTrabSolRegProy = [],listTurnosAnSolRegProy = [];
var listEstadosEvalIdSolRegProy = [];
var mensajeUx;

function ocultarFiltroSolicitudRegistroProyecto(){
    $("#modalFiltroSolRegProy").modal("hide");
}

function verFiltroSolicitudRegistroProyecto(){
    $("#modalFiltroSolRegProy").modal("show");
}

function crearFiltroSolicitudRegistroProyecto(){
    $("#modalFiltroSolRegProy").remove();
    
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    }; 
	  		
    callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/vista_contratista/filtro',dataParam,function(data){
	listEvaluacionSolRegProy = data.listEvaluacion;listPerfilesEspecialesSolRegProy = data.listPerfilesProyecto;listResponsablesSolRegProy = data.listResponsables;
	listAreasSolRegProy = data.listAreas;empAuxSolRegProyObj = data.registroConfigGenEmp;listLugaresTrabSolRegProy = data.listTipoLugaresTrabajo;
	listTurnosAnSolRegProy = data.listTurnosAn;
	
        var contenido = "";
  				
        var listContenido=[
  	    {sugerencia:"",label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroSolRegProy' class='form-control'>"},
  	    {sugerencia:"",label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroSolRegProy' class='form-control'>"},
  	    {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	    {sugerencia:"",label:"Estado de la evaluación",inputForm:"",divContainer:"divFiltroEstadosEvalSolRegProy"},
  	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	    {sugerencia:"",
             label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		   "onclick='ocultarFiltroSolicitudRegistroProyecto()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	   "</button>",
  	     inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
  	      		       "onclick='valoresFiltroSolicitudRegistroProyecto()'>" +
  	                   "<i class='fa fa-filter'></i> Aplicar filtro" +
  	               "</button>"},
        ]; 
  				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });
   
  		
        var modalOptions={
            id:"modalFiltroSolRegProy",nombre:"<i class='fa fa-filter'></i> Filtro - Solicitud registro de proyecto",
  	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };
  				
        crearModalPrincipalUsuario(modalOptions,function(){
	    if($("#filtroEstadosEvalSolRegProy").length > 0){
	        return;
	    }
	                   
	    crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvalSolRegProy","",listEvaluacionSolRegProy,
		"id","nombre","#divFiltroEstadosEvalSolRegProy","Todos");
        },true,true);
   
        var hoy = getSession("fechaHoyOrdenInversoTexto");
   
        $("#fechaInicioFiltroSolRegProy").val(sumaFechaDias(-180,hoy));$("#fechaFinFiltroSolRegProy").val(sumaFechaDias(30,hoy));
  				
        valoresFiltroSolicitudRegistroProyecto();
        
        if(parseInt(getSession("gestopcompanyid")) == 741){
            crearMensajeInformativoContratistaSolRegProy();
        }
    });
}

function toggleMenuOpcionRegistrosSolicitudRegistroProyecto(obj,pindex){
    solRegProyObj = listSolicitudesRegistroProy[pindex];
    indexSolRegProy = pindex;
    
    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosSolicitudRegistroProyecto=[  
    {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
     functionClick:function(data){registroSolicitudRegistroProyecto(1);}},
    {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar",
     functionClick:function(data){eliminarRegistroSolicitudRegistroProyecto();}}
];

function marcarSubOpcionRegistrosSolicitudRegistroProyecto(pindex){
   funcionalidadesRegistrosSolicitudRegistroProyecto[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function valoresFiltroSolicitudRegistroProyecto(){
    ocultarFiltroSolicitudRegistroProyecto(); 
    
    if($("#fechaInicioFiltroSolRegProy").val().length > 0 && $("#fechaFinFiltroSolRegProy").val().length > 0){
	listEstadosEvalIdSolRegProy = [];
	    
	var estadoEvaluacionId = $("#filtroEstadosEvalSolRegProy").val(); 
	   
	if(estadoEvaluacionId != null){
	    estadoEvaluacionId.forEach(function(val){
	        listEstadosEvalIdSolRegProy.push(parseInt(val));
	    });
	}
	   
	verRegistrosSolicitudRegistroProyecto();
    }else{
	mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
	mensajesUx(mensajeUx,2,"","ValidacionFiltro");
		
	$("#modalMensajeUxValidacionFiltro").on("hidden.bs.modal",function(){
	    $("#modalFiltroSolRegProy").modal("show");
	});
    }
}

function verRegistrosSolicitudRegistroProyecto(){
    var dataParam={
        contratistaId:parseInt(getSession("contratistaGosstId")),fechaRegInicioFiltro:$("#fechaInicioFiltroSolRegProy").val(),
        fechaRegFinFiltro:$("#fechaFinFiltroSolRegProy").val(),listEstadoEvaluacionId:(listEstadosEvalIdSolRegProy.length == 0?null:listEstadosEvalIdSolRegProy)
    };
    
    callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/vista_contratista',dataParam,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                listSolicitudesRegistroProy = data.listSolicitudesRegistroProy;
            
                var listPanelesPrincipal = [],textRegistros = "";
  	    
                $(".divListPrincipal").html("");
  	     
                listSolicitudesRegistroProy.forEach(function(val,index){
                    var btnOpcion = "",menuOpcion = "";
 	       
                    if(val.evaluacion.nota.id != 1){
                	menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
                	    funcionalidadesRegistrosSolicitudRegistroProyecto.forEach(function(val1,index1){
		                menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosSolicitudRegistroProyecto("+index1+")'>" +
				         val1.nombre +
				    "</li>";
                	});		    
                	menuOpcion += "</ul>";
				    
                	btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosSolicitudRegistroProyecto(this,"+index+")'>" +
			         	"<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			            "</a>";
                    }
                    
                    var listTotal = [];
	       
                    if(empAuxSolRegProyObj.snEvalSrpAuto == 1){
                	listTotal.push({sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",label:"<i class='fa fa-pencil'></i> Nombre del proyecto:",inputForm:btnOpcion+menuOpcion});
	            }else{
	        	listTotal.push({sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	 		     label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** CÓDIGO "+val.codigo+" ***</span>"},
	 		    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	                    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil'></i> Nombre del proyecto:",inputForm:""});
	            }
 		         
                    listTotal.push({sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.titulo,styleAux:"word-break:break-all;"},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha inicio:",inputForm:val.fechaInicioTexto},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Fecha fin:",inputForm:val.fechaFinTexto},
                        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"<i class='fa fa-pencil'></i> Descripción del proyecto:",inputForm:""},
                        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:val.descripcion,styleAux:"word-break:break-all;"});
                    
                    if(empAuxSolRegProyObj.habilitadoCampPerProy3 == 1){
                	listTotal.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-pencil'></i> Orden de compra:",inputForm:(val.ordenCompra.length > 0?val.ordenCompra:"------")});
                    }
                    
                    var actividad = (val.perfilEspecialProyecto.actividad.length > 0?val.perfilEspecialProyecto.actividad:val.perfilEspecialProyecto.nombre);
                	
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         	        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo de actividad:",inputForm:actividad});
                    
                    if(empAuxSolRegProyObj.habilitadoCampPerProy4 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy4 == 1){
                	listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Responsable:",inputForm:val.responsable.nombre});
                    }
                    
                    if(empAuxSolRegProyObj.habilitadoCampPerProy5 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy5 == 1){
                	listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Área:",inputForm:val.area.nombre});
                    }
                    
                    if(empAuxSolRegProyObj.habilitadoCampPerProy1 == 1 || empAuxSolRegProyObj.habilitadoCampPerProy2 == 1){
                	listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
                	
                	if(empAuxSolRegProyObj.habilitadoCampPerProy1 == 1){
                	    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tags'></i> Lugar(es) de trabajo:",inputForm:val.tipoLugaresTrabajoAsignadosNombre}); 
                	}
                	
                	if(empAuxSolRegProyObj.habilitadoCampPerProy2 == 1){
                	    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tags'></i> Turno(s):",inputForm:val.turnosAnAsignadosNombre}); 
                	}
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
                    
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 		        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	                 label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
 	                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:val.evaluacion.nota.icono+" Estado:",inputForm:val.evaluacion.nota.nombre});  
 	       
                    if(![3,4].includes(val.evaluacion.nota.id)){
                	if(val.evaluacion.nota.id != 1){ 
 		            listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-exclamation-circle'></i> Observación:",inputForm:val.evaluacion.observacion});  
                	}
 		  
                	if(val.snEvaluacionAuto == 0){
                	    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:val.evaluacion.fechaTexto});
                	}
                    }
                    
                    var estiloGosst = (val.evaluacion.nota.id == 1?"gosst-aprobado":(val.evaluacion.nota.id == 2?"gosst-desaprobado":"gosst-advertencia"));

                    textRegistros += "<div class='eventoGeneral "+estiloGosst+"'>" +
 	                                 "<div class='eventoGeneral'>";	
 	            listTotal.forEach(function(val,index){
 	                textRegistros += obtenerSubPanelModuloVersionDos(val);
 	            });
 	            textRegistros +=     "</div>" +
 		                     "</div>";
                });
                
                var btnImportAux = (listPerfilesEspecialesSolRegProy.length == 0 || listResponsablesSolRegProy.length == 0 || listAreasSolRegProy.length == 0 || 
                    listLugaresTrabSolRegProy.length == 0 || listTurnosAnSolRegProy.length == 0?"":
     	            "<button type='button' class='btn btn-excel' style='padding:4px 6px;margin-right:10px' " +
     	                    "onclick='verImportSmartSolicitudRegistroProyecto()' title='Método import de los registros.'>" +
     	                "<i class='fa fa-file-excel-o fa-4x'></i> <i class='fa fa-upload fa-2x'></i>" +
     	            "</button>");
  	    	  				
     	        listPanelesPrincipal.push({id:"registroMovilSolRegProy",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroSolicitudRegistroProyecto(0)",
            	     btnIconoAux:"fa-pencil",btnTitleAux:"Registrar nueva solicitud proyecto",nombre:"Nuevo registro solicitud proyecto",contenido:""},
            	    {id:"opcionesSolRegProy",clase:"",styleAux:"",buttonAd:btnImportAux,btnOnclickAux:"verFiltroSolicitudRegistroProyecto()",
		     btnIconoAux:"fa-filter",btnTitleAux:"Opciones de los registros",nombre:"Opciones",contenido:""},
                    {id:"infoMovilSolRegProy",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
            	     nombre:"Solicitudes proyecto registradas ("+listSolicitudesRegistroProy.length+")",contenido:textRegistros});

     	        agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	        $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	        
     	        break;
  	     
            default:
        	alert("nop");
         
  	    	break;
        }
    });
}

function ocultarRegistroSolicitudRegistroProyecto(){
    $("#modalRegistroSolRegProy").modal("hide");
}

function registroSolicitudRegistroProyecto(opcionId){
    if(listResponsablesSolRegProy.length > 0 && listAreasSolRegProy.length > 0){
	$("#modalRegistroSolRegProy").remove();  
   
	solRegProyId = (parseInt(opcionId) == 0?0:solRegProyObj.id);

	var selPerfilProyectoSolRegProy = crearSelectOneMenu("selPerfilProyectoSolRegProy","",
	    listPerfilesEspecialesSolRegProy,(solRegProyId == 0?"-1":solRegProyObj.perfilEspecialProyecto.id),"id","nombre");
	
	var selResponsableSolRegProy = crearSelectOneMenu("selResponsableSolRegProy","",
	    listResponsablesSolRegProy,(solRegProyId == 0?"-1":solRegProyObj.responsable.id),"id","nombre");
	
	var selAreaSolRegProy = crearSelectOneMenu("selAreaSolRegProy","",
	    listAreasSolRegProy,(solRegProyId == 0?"-1":solRegProyObj.area.id),"id","nombre");
 	     
	var contenido = "";

	var listContenido=[
	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Nombre del proyecto",inputForm:""},
	    {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textTituloSolRegProy' class='form-control' rows='2'></textarea>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio",inputForm:"<input id='inputFechaInicioSolRegProy' class='form-control' type='date'>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha fin",inputForm:"<input id='inputFechaFinSolRegProy' class='form-control' type='date'>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Descripción del proyecto",inputForm:""},
	    {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",inputForm:"<textarea id='textDescripcionSolRegProy' class='form-control' rows='4'></textarea>"}
	];
	
	if(empAuxSolRegProyObj.habilitadoCampPerProy3 == 1){
	    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Orden de compra",inputForm:"<input id='inputOrdenCompraSolRegProy' class='form-control' type='text'>"});
	}
	
	listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo de actividad",inputForm:selPerfilProyectoSolRegProy},
	    {sugerencia:"",clase:"campo-responsable-srp",anchoLabel:"",anchoDiv:"",label:"Responsable",inputForm:selResponsableSolRegProy},
	    {sugerencia:"",clase:"campo-area-srp",anchoLabel:"",anchoDiv:"",label:"Área",inputForm:selAreaSolRegProy});
	    
	if(empAuxSolRegProyObj.habilitadoCampPerProy1 == 1){
	    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Lugar(es) de trabajo",
		 inputForm:"<a class='efectoLink' onclick='verCheckListLugaresTrabajoSolicitudRegistroProyecto()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelLugaresTrabajoSolRegProy"}); 
	}
	
	if(empAuxSolRegProyObj.habilitadoCampPerProy2 == 1){
	    listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Turno(s)",
		 inputForm:"<a class='efectoLink' onclick='verCheckListTurnosAnSolicitudRegistroProyecto()'>"+"Seleccionar "+"<i class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTurnosAnSolRegProy"});
	}
	
	listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                           "onclick='ocultarRegistroSolicitudRegistroProyecto()'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                   "</button>",
             inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		       "onclick='guardarRegistroSolicitudRegistroProyecto()'>" +
	                   "<i class='fa fa-floppy-o'></i> Guardar" +
	               "</button>"});
				
	listContenido.forEach(function(val){
	    contenido += obtenerSubPanelModuloVersionDos(val);
	});
 		
	var modalOptions={
	    id:"modalRegistroSolRegProy",nombre:"<i class='fa fa-pencil'></i> Registro solicitud proyecto",
	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};
				
	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	
	if(solRegProyId > 0){
	    $("#textTituloSolRegProy").val(solRegProyObj.titulo);$("#inputFechaInicioSolRegProy").val(convertirFechaInput(solRegProyObj.fechaInicio));
	    $("#inputFechaFinSolRegProy").val(convertirFechaInput(solRegProyObj.fechaFin));$("#textDescripcionSolRegProy").val(solRegProyObj.descripcion);
	    $("#inputOrdenCompraSolRegProy").val(solRegProyObj.ordenCompra);
	    
	    crearCheckListGeneral("modalRegistroSolRegProy","Lugares de trabajo","LugTrabSolRegProySelec",
	        listLugaresTrabSolRegProy,"LugaresTrabajoSolicitudRegistroProyecto",cargarCheckListLugaresTrabajoSolicitudRegistroProyecto);
	    
	    crearCheckListGeneral("modalRegistroSolRegProy","Turnos","TurnosAnSolRegProySelec",
		listTurnosAnSolRegProy,"TurnosAnSolicitudRegistroProyecto",cargarCheckListTurnosAnSolicitudRegistroProyecto);
	}else{
	    var hoy = getSession("fechaHoyOrdenInversoTexto");
	    
	    $("#inputFechaInicioSolRegProy").val(hoy); 
	    
	    crearCheckListGeneral("modalRegistroSolRegProy","Lugares de trabajo","LugTrabSolRegProySelec",
	        listLugaresTrabSolRegProy,"LugaresTrabajoSolicitudRegistroProyecto",ocultarCheckListLugaresTrabajoSolicitudRegistroProyecto);
	    
	    crearCheckListGeneral("modalRegistroSolRegProy","Turnos","TurnosAnSolRegProySelec",
	        listTurnosAnSolRegProy,"TurnosAnSolicitudRegistroProyecto",ocultarCheckListTurnosAnSolicitudRegistroProyecto);
	}
	
	 if(empAuxSolRegProyObj.habilitadoCampPerProy4 == 0 || empAuxSolRegProyObj.obligatorioCampPerProy4 == 0){
             $(".campo-responsable-srp").hide();
         }
	 
	 if(empAuxSolRegProyObj.habilitadoCampPerProy5 == 0 || empAuxSolRegProyObj.obligatorioCampPerProy5 == 0){
             $(".campo-area-srp").hide();
         }
    }else{
	mensajeUx = "<label>La función no está disponible. Comuníquese con el administrador.</label>";
	mensajesUx(mensajeUx,2,"","");
    }
}

function ocultarCheckListLugaresTrabajoSolicitudRegistroProyecto(){
    var textLugarTrabSolRegProyAsig = "";

    listLugaresTrabSolRegProy.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoLugTrabSolRegProySelec"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textLugarTrabSolRegProyAsig += (textLugarTrabSolRegProyAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textLugarTrabSolRegProyAsig = (textLugarTrabSolRegProyAsig.length == 0?"Ninguno":textLugarTrabSolRegProyAsig);
    textLugarTrabSolRegProyAsig = (textLugarTrabSolRegProyAsig.length >= 1000?textLugarTrabSolRegProyAsig.substring(0,1000)+"...":textLugarTrabSolRegProyAsig);

    $("#divSelLugaresTrabajoSolRegProy").html(textLugarTrabSolRegProyAsig);

    $("#modalCheckListLugTrabSolRegProySelec").modal("hide");$("#modalRegistroSolRegProy").modal("show");
}

function verCheckListLugaresTrabajoSolicitudRegistroProyecto(){
    $("#modalCheckListLugTrabSolRegProySelec").modal("show");$("#modalRegistroSolRegProy").modal("hide");
}

function cargarCheckListLugaresTrabajoSolicitudRegistroProyecto(){
    if(solRegProyObj.tipoLugaresTrabajoAsignadosId.length != 0){
        var tipoLugaresTrabajoAsignadosIdAux = solRegProyObj.tipoLugaresTrabajoAsignadosId.split(",");

        tipoLugaresTrabajoAsignadosIdAux.forEach(function(val1){
            var checkboxtipLugTrabAsig = document.getElementById('checkAsignadoLugTrabSolRegProySelec'+val1);
            
            if(checkboxtipLugTrabAsig != null){
        	checkboxtipLugTrabAsig.checked = true;
            }
        });
    }

    ocultarCheckListLugaresTrabajoSolicitudRegistroProyecto();
}

function ocultarCheckListTurnosAnSolicitudRegistroProyecto(){
    var textTurnoSolRegProyAsig = "";

    listTurnosAnSolRegProy.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoTurnosAnSolRegProySelec"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textTurnoSolRegProyAsig += (textTurnoSolRegProyAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textTurnoSolRegProyAsig = (textTurnoSolRegProyAsig.length == 0?"Ninguno":textTurnoSolRegProyAsig);
    textTurnoSolRegProyAsig = (textTurnoSolRegProyAsig.length >= 1000?textTurnoSolRegProyAsig.substring(0,1000)+"...":textTurnoSolRegProyAsig);

    $("#divSelTurnosAnSolRegProy").html(textTurnoSolRegProyAsig);

    $("#modalCheckListTurnosAnSolRegProySelec").modal("hide");$("#modalRegistroSolRegProy").modal("show");
}

function verCheckListTurnosAnSolicitudRegistroProyecto(){
    if(listTurnosAnSolRegProy.length > 0){
	$("#modalCheckListTurnosAnSolRegProySelec").modal("show");$("#modalRegistroSolRegProy").modal("hide");
    }else{
	$("#modalRegistroSolRegProy").modal("hide");
	
	mensajeUx="<label>No hay valores registrados para seleccionar en 'Lugar(es) de trabajo'.<label>";
        mensajesUx(mensajeUx,2,"","ValidacionSolRegProy");
        
        $("#modalMensajeUxValidacionSolRegProy").on("hidden.bs.modal",function(){
            $("#modalRegistroSolRegProy").modal("show");  
        });
    }
}

function cargarCheckListTurnosAnSolicitudRegistroProyecto(){
    if(solRegProyObj.turnosAnAsignadosId.length != 0){
        var turnosAnAsignadosIdAux = solRegProyObj.turnosAnAsignadosId.split(",");

        turnosAnAsignadosIdAux.forEach(function(val1){
            var checkboxTurAnAsig = document.getElementById('checkAsignadoTurnosAnSolRegProySelec'+val1);
            
            if(checkboxTurAnAsig != null){
        	checkboxTurAnAsig.checked = true;
            }
        });
    }

    ocultarCheckListTurnosAnSolicitudRegistroProyecto();
}

function eliminarRegistroSolicitudRegistroProyecto(){
    mensajeUx="<label>¿Está seguro de eliminar el registro solicitud proyecto seleccionado?</label>";
    mensajesUx(mensajeUx,3,"","EliminarSolRegProy");

    $("#btnDevolverValorEliminarSolRegProy").on("click",function(){
        var dataParam={
            id:solRegProyObj.id
        };

        callAjaxPost(URL+'/contratista/solicitud_registro_proyecto/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
 	            mensajeUx = "<label>El registro solicitud proyecto fue eliminado con éxito.</label>";
 	            mensajesUx(mensajeUx,1,"","ActualizarSolRegProy"); 
 								   
 	            $("#modalMensajeUxActualizarSolRegProy").on("hidden.bs.modal",function(){
 	        	verRegistrosSolicitudRegistroProyecto();  
 	            });
 	       
 	            break;
			
                default:
                    alert("Ocurrió un error al eliminar el registro solicitud proyecto.");
            }
        });
    });
}

function guardarRegistroSolicitudRegistroProyecto(){
    var campoVacio = true;
   
    var titulo = $("#textTituloSolRegProy").val().trim();
    var fechaInicio = convertirFechaTexto($("#inputFechaInicioSolRegProy").val());
    var inputFechaInicio = (!fechaInicio?null:fechaInicio);
    var fechaFin = convertirFechaTexto($("#inputFechaFinSolRegProy").val());
    var inputFechaFin = (!fechaFin?null:fechaFin);
    var descripcion = $("#textDescripcionSolRegProy").val().trim();
    var perfilProyectoId = parseInt($("#selPerfilProyectoSolRegProy").val());
    var responsableId = parseInt($("#selResponsableSolRegProy").val());
    var areaId = parseInt($("#selAreaSolRegProy").val());
    
    var ordenCompra = (empAuxSolRegProyObj.habilitadoCampPerProy3 == 1?$("#inputOrdenCompraSolRegProy").val().trim():null);
    
    var listLugaresTrabProyAsignados = [];
    var textoLugaresTrabProyAsignados = "";

    if(empAuxSolRegProyObj.habilitadoCampPerProy1 == 1){
        listLugaresTrabSolRegProy.forEach(function(val){
            var isAsignado = ($("#checkAsignadoLugTrabSolRegProySelec"+val.id).prop("checked")?1:0);

            if(isAsignado == 1){
        	textoLugaresTrabProyAsignados += (textoLugaresTrabProyAsignados.length == 0?val.id:","+val.id);
        	listLugaresTrabProyAsignados.push({id:val.id});
            }
        });
    }
    
    var listTurnosTrabProyAsignados = [];
    var textoTurnosTrabProyAsignados = "";

    if(empAuxSolRegProyObj.habilitadoCampPerProy2 == 1){
        listTurnosAnSolRegProy.forEach(function(val){
            var isAsignado = ($("#checkAsignadoTurnosAnSolRegProySelec"+val.id).prop("checked")?1:0);

            if(isAsignado == 1){
        	textoTurnosTrabProyAsignados += (textoTurnosTrabProyAsignados.length == 0?val.id:","+val.id);
        	listTurnosTrabProyAsignados.push({id:val.id});
            }
        });
    }
    
    if(titulo.length == 0 || inputFechaInicio == null || inputFechaFin == null || descripcion.length == 0){
        mensajeUx = "<label>Debe completar todos los campos obligatorio.</label>";campoVacio = false;  
    }else if(empAuxSolRegProyObj.habilitadoCampPerProy3 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy3 == 1 && ordenCompra.length == 0){
	mensajeUx = "<label>Debe completar el campo 'Orden de compra'.</label>";campoVacio = false; 
    }else if(empAuxSolRegProyObj.habilitadoCampPerProy1 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy1 == 1 && textoLugaresTrabProyAsignados.length == 0){
	mensajeUx = "<label>Debe seleccionar al menos un valor en el campo 'Lugar(es) de trabajo'.</label>";campoVacio = false; 
    }else if(empAuxSolRegProyObj.habilitadoCampPerProy2 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy2 == 1 && textoTurnosTrabProyAsignados.length == 0){
	mensajeUx = "<label>Debe seleccionar al menos un valor en el campo 'Turno(s)'.</label>";campoVacio = false; 
    }else if(empAuxSolRegProyObj.habilitadoCampPerProy4 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy4 == 1 && responsableId == -1){
	mensajeUx = "<label>Debe seleccionar al responsable.</label>";campoVacio = false;
    }else if(empAuxSolRegProyObj.habilitadoCampPerProy5 == 1 && empAuxSolRegProyObj.obligatorioCampPerProy5 == 1 && areaId == -1){
	mensajeUx = "<label>Debe seleccionar el área.</label>";campoVacio = false;
    }else{
        var numDiasVigencia = restaFechas($("#inputFechaInicioSolRegProy").val(),$("#inputFechaFinSolRegProy").val()),
            numDiasVigenciaActual = restaFechas(getSession("fechaHoyOrdenInversoTexto"),$("#inputFechaFinSolRegProy").val());
//            numDiasActualInicio = restaFechas($("#inputFechaInicioSolRegProy").val(),getSession("fechaHoyOrdenInversoTexto"));
	  
        if(numDiasVigencia < 0){
 	   mensajeUx = "<label>La fecha fin del registro no puede ser menor que la fecha inicio del registro.</label>";campoVacio = false; 
        }else if(numDiasVigenciaActual < 0){ 
           mensajeUx = "<label>La fecha fin del registro no puede ser menor a la fecha de hoy.</label>";campoVacio = false;  
        }/*else if (numDiasActualInicio < 0) {
            mensajeUx = "<label>La fecha inicio del registro no puede ser mayor a la fecha de hoy.</label>";campoVacio = false;
        }*/
    }
    
    if(campoVacio){
        var dataParam={
	    id:solRegProyId,titulo:titulo,fechaInicio:inputFechaInicio,fechaFin:inputFechaFin,descripcion:descripcion,perfilProyectoId:perfilProyectoId,
	    empresaId:parseInt(getSession("gestopcompanyid")),contratistaId:parseInt(getSession("contratistaGosstId")),listLugaresTrabProyAsignados:listLugaresTrabProyAsignados,
	    textoLugaresTrabProyAsignados:textoLugaresTrabProyAsignados,listTurnosTrabProyAsignados:listTurnosTrabProyAsignados,textoTurnosTrabProyAsignados:textoTurnosTrabProyAsignados,
	    ordenCompra:ordenCompra,empresa:{habilitadoCampPerProy1:empAuxSolRegProyObj.habilitadoCampPerProy1,habilitadoCampPerProy2:empAuxSolRegProyObj.habilitadoCampPerProy2,
	    habilitadoCampPerProy3:empAuxSolRegProyObj.habilitadoCampPerProy3,habilitadoCampPerProy4:empAuxSolRegProyObj.habilitadoCampPerProy4,
	    obligatorioCampPerProy4:empAuxSolRegProyObj.obligatorioCampPerProy4,habilitadoCampPerProy5:empAuxSolRegProyObj.habilitadoCampPerProy5,
	    obligatorioCampPerProy5:empAuxSolRegProyObj.obligatorioCampPerProy5},responsableId:responsableId,areaId:areaId
        };
      
        callAjaxPostSimpleVersionDos(1,URL+'/contratista/solicitud_registro_proyecto/vista_contratista/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalRegistroSolRegProy").modal("hide");
		
	            if(empAuxSolRegProyObj.snEvalSrpAuto == 1){
	        	mensajeUx = "<label>El registro del proyecto* fue guardado con éxito." +
	        	    "<br><br>*Para ver más detalles, como el código, diríjase a la sección 'Cargar documentos asociados a proyectos'.</label>";
	            }else{
	                mensajeUx = "<label>El registro solicitud proyecto fue guardado con éxito."+(solRegProyId == 0?
	                    "<br><br>*Se envió un correo de notificación al responsable de la evaluación.":"")+"</label>";
	            }
	            
	            mensajesUx(mensajeUx,1,"","ActualizarSolRegProy"); 
								   
	            $("#modalMensajeUxActualizarSolRegProy").on("hidden.bs.modal",function(){
	        	verRegistrosSolicitudRegistroProyecto();  
	            });
		
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar el registro solicitud proyecto.");
	    }
        });	
    }else{
        $("#modalRegistroSolRegProy").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionSolRegProy");
      
        $("#modalMensajeUxValidacionSolRegProy").on("hidden.bs.modal",function(){
	    $("#modalRegistroSolRegProy").modal("show");
        });
    }	
}

function ocultarMensajeInformativoContratistaSolRegProy(){
    $("#modalMensajeInfoCont").modal("hide");
}

function crearMensajeInformativoContratistaSolRegProy(){
    $("#modalMensajeInfoCont").remove();

    var contenido = "";
    
    var enlaceVideo = "<a href='https://drive.google.com/file/d/1HYonggRvzNC2phMHCIu43ncPvNreEzMl/view?usp=sharing' class='efectoLink' target='_blank'>" +
                          "<i class='fa fa-eye'></i> Ver video" +
                      "</a>";

    var listContenido=[
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"¿Tienes dudas sobre cómo crear una solicitud de proyecto? " +
         "Haz clic aquí para ver la guía y conocer el paso a paso.",styleAux:"font-size:18px;"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Enlace:",inputForm:enlaceVideo,styleAux:"font-size:18px;"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='ocultarMensajeInformativoContratistaSolRegProy()'>" +
                       "<i class='fa fa-check-circle'></i> Aceptar" +
                   "</button>"}
    ];

    listContenido.forEach(function (val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalMensajeInfoCont",nombre:"<i class='fa fa-bell'></i> Notificación",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function ocultarImportSmartSolicitudRegistroProyecto(){
    $("#modalImportSolRegProy").modal("hide");
}

function verImportSmartSolicitudRegistroProyecto(){
    $("#modalImportSolRegProy").remove();

    var contenido = "";

    var textPlantilla = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/solicitud_registro_proyecto/vista_contratista/backup/plantilla?" +
                           "empresaId="+getSession("gestopcompanyid")+"'>" +
                           "<i class='fa fa-download'></i> Descargar" +
                        "</a>";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Plantilla ",inputForm:textPlantilla,divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Archivo Excel:",inputForm:"",divContainer:"divExcelImportTraCon"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",label:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarImportSmartSolicitudRegistroProyecto()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='enviarExcelImportSmartSolicitudRegistroProyecto()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
        	   "</button>",divContainer:""}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalImportSolRegProy",nombre:"<i class='fa fa-file-excel-o'></i> Import - Solicitud registro de proyecto",
	contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
    var options={
        container:"#divExcelImportTraCon",functionCall:function(){
	    validacionSubirEvidencia("ImportExcelSolRegProy",bitsEvidenciaActoInseguro,"modalImportSolRegProy");
	},descargaUrl:"",esNuevo:true,idAux:"ImportExcelSolRegProy",evidenciaNombre:""
    };

    crearFormEvidenciaCompleta(options);
}

function enviarExcelImportSmartSolicitudRegistroProyecto(){
    var campoVacio = true;
    
    var excelImportNombre = $("#inputEviImportExcelSolRegProy").val();
    var extensionImportNombre = getFileExtension(excelImportNombre);
    
    if(excelImportNombre.length == 0){
	campoVacio = false;mensajeUx = "<label>Debe subir el archivo excel.</label>";
    }else if(extensionImportNombre != "xlsx"){
	campoVacio = false;mensajeUx = "<label>El formato del archivo debe ser '.xlsx'.</label>";
    }
    
    if(campoVacio){
	guardarEvidenciaAuto(0,"fileEviImportExcelSolRegProy",bitsEvidenciaActoInseguro,
        "/contratista/solicitud_registro_proyecto/excel/masivo/save",function(data){
	    switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalImportSolRegProy").remove();
		 	    
                    mensajeUx="<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
                    mensajesUx(mensajeUx,4,"","ActualizarSolRegProy");
		 	    
                    $("#modalMensajeUxActualizarSolRegProy").on("hidden.bs.modal",function(){
                	verRegistrosSolicitudRegistroProyecto();     
                    });
                    
                    break;
         	     
                default:
            	    alert("Error al intentar importar los registros solicitud proyecto.");
             
      	    	    break;
	    }
	},"id",[  
	    {id:"empresaId",value:getSession("gestopcompanyid")},
	    {id:"contratistaId",value:getSession("contratistaGosstId")}]);
    }else{
	$("#modalImportSolRegProy").modal("hide"); 
	mensajesUx(mensajeUx,2,"","AvisoCompletarCampos","");
	      
	$("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
	    $("#modalImportSolRegProy").modal("show");
	});
    }
}
