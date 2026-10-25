/**
 * 
 */
var listFullProyectosMedico=[];

var menuDerechaMedico=[
       {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"",
        titulo:"Perfil",adicional:"Médico <label id='empresaActual'></label>"}
                      ];

var menuFuncionesIzquierdaMedico=[
       {moduloId:6,icono:"fa-medkit",ident:"ico35Inicio",
	funcionClick:function(){habilitarExamenesEvaluacionMedico()},titulo:"Exámenes Médicos",adicional:""},
       {moduloId:22,icono:"fa-users",ident:"icoContra",
	funcionClick:function(){
	   crearFiltroResumenProyVistaMed(habilitarProyectosContratistaMedico);
	},titulo:"Contratistas",adicional:""},
       {moduloId:22,icono:"fa-times-circle",ident:"icoCerrar",
	funcionClick:function(){cerrarSesion()},titulo:"Cerrar Sesión",adicional:""}
                                 ];

var listContratistaMedico=[],listTrabajadoresMedico=[];
var listEstadosProyectoId = [];

var listEstadoAuxVisMed=[
       {id:1,nombre:"Pendiente"},
       {id:2,nombre:"En curso"},
       {id:3,nombre:"Completado"}
                        ];

var numVecesFiltroVistaMed;

function ocultarFiltroVistaMed(){
   $("#modalFiltroResProyVistaMed").modal("hide");
}

function verFiltroVistaMed(){
   $("#modalFiltroResProyVistaMed").modal("show");
}

function crearFiltroResumenProyVistaMed(functionCallBack){
   var dataParam={}; 
	
// callAjaxPost(URL+'/contratista/proyectos/vista_medico/filtro',dataParam,function(data){
     
      var listOrdenAux=[
             {id:1,nombre:"Fecha de creación (menor a mayor)"},
	     {id:2,nombre:"Título (A-Z)"},
	     {id:3,nombre:"Título (Z-A)"}
	               ];

      var selOrdenAuxProyecto = crearSelectOneMenuOblig("selOrdenAuxProyecto",
	     "",listOrdenAux,"5","id","nombre");

      var listContAux=[
             {id:-1,nombre:"Todos"},
             {id:0,nombre:"Inactivos"},
             {id:1,nombre:"Activos"}
                      ];

      var selContratistaActAuxProyecto = crearSelectOneMenuOblig("selContratistaActAuxProyecto",
	     "",listContAux,"1","id","nombre");
   
      var contenido = "";
  				
      var listContenido=[
             {sugerencia:"",label:"Ordenar por",inputForm:selOrdenAuxProyecto,
              divContainer: "divSelectOrdenar"},
             {sugerencia:"",label:"Estado contratista",inputForm:selContratistaActAuxProyecto,
              divContainer: ""},
  	     {sugerencia:"",label:"Estado del proyecto",inputForm:"",
              divContainer:"divFiltroEstadosResProyVistaMed"},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
  	     {sugerencia:"",
              label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroVistaMed()'>" +
               	       "<i class='fa fa-times'></i> Cancelar" +
               	    "</button>",
  	      inputForm:"<button id='btnAplicarFiltroVistaMed' class='btn btn-success' type='submit' " +
  	      		        "onclick='habilitarProyectosContratistaMedico()' style='float:right;'>" +
  	      		   "<i class='fa fa-filter'></i> Aplicar filtro" +
  	      		"</button>"},
  	                ];
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
  				
      var modalOptionsVistaMed={
 	     id: "modalFiltroResProyVistaMed",
 	     nombre: "<i class='fa fa-filter'></i> Filtros",
  	     contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
  	                       };
  				
      crearModalPrincipalUsuario(modalOptionsVistaMed,function(){
         if($("#filtroEstadosResProyVistaMed").length > 0){
  	    return;
         }
          
         listEstadoAuxVisMed.forEach(function(val){
            if(val.id == 2){
               val.selected = 1;
            }    
         });
           
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosResProyVistaMed","",listEstadoAuxVisMed,
            "id","nombre","#divFiltroEstadosResProyVistaMed","Todos");
      },false);
  				
      $("#btnAplicarFiltroVistaMed").on("click",function(){
	 ocultarFiltroVistaMed();
      });
  	
      $("#modalFiltroResProyVistaMed").modal("hide");
      numVecesFiltroVistaMed = 0;
      functionCallBack();
//    });
}

function marcarIconoModuloSeleccionadoMedico(menuIndex){
   $("#menuExplicativo").hide();
	 $(".divContainerGeneral").show();
		$(".divListModulos").find("li").removeClass("activeMenu");
		$(".divListPrincipal").html("");
		$(".gosst-aviso").remove();
		var menuObject=menuFuncionesIzquierdaMedico[menuIndex];
		$(".divListModulos #"+menuObject.ident).addClass("activeMenu");
		var isPermitido=false;
		listaModulosPermitidos.forEach(function(val,index){
			var moduloPermitido=val.isPermitido;
			
			if(val.menuOpcionId==menuObject.moduloId && moduloPermitido==1){
				isPermitido=true;
			}
			var numerSubModulos=val.subMenus;
			numerSubModulos.forEach(function(val1,index1){
				var subModuloPermitido=val1.isPermitido;
				
				if(val1.menuOpcionId==menuObject.moduloId && subModuloPermitido==1){
					isPermitido=true;
				}
			});
		});
		if(isPermitido){
			menuObject.funcionClick();
		}else{
			verSeccionRestringida();
		}
		
		$(".divTituloFull").find("h4").html(menuObject.titulo)
		
}
function habilitarExamenesEvaluacionMedico(){
	irHacia(6);
}
function verLateralesFijosMedico(){
	var dataParamAux = {
			mdfId:getSession("unidadGosstId"),
			empresaId:getSession("gestopcompanyid"),
			trabajadorId:parseInt(getSession("trabajadorGosstId"))
		};
	 
	$("#menuPrincipal").html("" +
			"" +
			"Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida")
	.css({color:"white","margin-top": "12px"});
	$(".navbar").css({"min-height": "48px","margin-bottom": "0px","top":"0px"});
	var logo=$("#logoMenu");
	logo.css({"background-color":"#2e9e8f","margin-top":"-18px"})
	.attr("onclick","volverMenuInicio()");
	$("#barraMenu").css({"position": "fixed",
    "width": "100%"});
	$("#barraMenu").find(".navbar-right").html("<ul></ul> ");
	menuDerechaMedico.forEach(function(val,index){
		var claseSub="class='iconoLink dropdown-toggle' data-toggle='dropdown'";
		if(val.ident!="icoPerfil"){
			claseSub="class='iconoLink'";
			
		}else{
			val.onclick="";
		}
		$("#barraMenu").find(".navbar-right").append("" +
				"<li id='"+val.ident+"' title='"+val.titulo+"'><a onclick='"+val.onclick+"'"+ 
				claseSub+"	>"+
				"<i class='fa "+val.icono+" fa-2x' aria-hidden='true'>"+
				"</i> "+val.adicional+"</a></li>"+
				"")
	});
	$("#icoPerfil").append(
			"<ul class='dropdown-menu' style='color :white'>" +
			//"<li onclick='marcarIconoModuloSeleccionado(0)'> <a><i class='fa fa-user-o ' aria-hidden='true'></i>Perfil</a></li>" +
			//"<li onclick='marcarIconoModuloSeleccionado(0)'> <a> <i class='fa fa-exchange ' aria-hidden='true'></i>Cambiar Contraseña</a></li>" +
			"<li class='dropdown-divider' role='presentation'></li>" +
			"<li onclick='cerrarSesion()'> <a> <i class='fa fa-power-off ' aria-hidden='true'></i>Salir</a></li>" +
			"" +
			"</ul>" +
			"" +
			"" +
			"</div>");
	$("#icoPerfil a #empresaActual").html(getSession("gestopcompanyname").substr(0,12))
	 $(".buscadorGosst").css({"margin-top": "8px",
    "border-radius": "21px","color":"black",
    "background-color": "#ffffff"});
	$("body").find("table").remove();
	$("body").find("#divCompletarActividad").remove();
	$("body").find("h4").remove();
	$("body").find(".divTituloFull").remove();
	$("body").find(".divContainerGeneral").remove();
	$("body").append("" +
			"<div class='divTituloFull'><div class='divTituloGeneral'><h4>Mis Actividades SST</h4></div></div>" +
			"<div class='divContainerGeneral'>" +
			"" +
			"<div class='divListModulos'><ul class='list-group'></ul></div>" +
			"<div class='divListPrincipal'></div>" +
			"<div class='divListSecundaria'>" +
				
				"<div id='divObjetivos' style='height:120px'>" +
				"<div class='subDivTitulo'>Objetivos </div><div class='subDivContenido'></div>" +
				"</div>" +
				"<div id='divNoticiaDiaria' style='height:250px'>" +
				"<div class='subDivTitulo'>Noticia del día </div><div class='subDivContenido'></div>" +
				"</div>" +
				"<div id='divPiramide' >" +
				"<div class='subDivTitulo'>Accidentabilidad </div><div class='subDivContenido'></div>" +
				"</div>" +
			"" +
			"</div>"+
			"</div>"  ); 
	$("#menuFigureti").html("<ul class='list-group'></ul>")
menuFuncionesIzquierdaMedico.forEach(function(val,index){
		$(".divListModulos").find("ul").append("" +
				"<li class='list-group-item' id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoMedico("+index+")'>" +
				"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
		$("#menuFigureti").find("ul").append("" +
				"<li class='list-group-item' style='color: #2e9e8f'  id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoMedico("+index+")'>" +
				"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
	}); 
	$("#menuMovilGosst").on("click",function(){
		$(".divContainerGeneral").toggle();
	});
$(".divListSecundaria").html("");
}

function valoresFiltroVistaMed(){
   listEstadosProyectoId = [];
   var estadoProyectoId = (numVecesFiltroVistaMed == 0?[2]:$("#filtroEstadosResProyVistaMed").val()); 
    
   if(estadoProyectoId != null){
      estadoProyectoId.forEach(function(val){
	 listEstadosProyectoId.push(parseInt(val));
      });
   }
}

function habilitarProyectosContratistaMedico(){
   $(".divProyectoGeneral").remove();
   $("#divNoResultados").remove();
   $(".divTituloFull").find("h4").html("Contratista");
   
   var trabajadorId = getSession("trabajadorGosstId");
   
   valoresFiltroVistaMed();
   
   var dataParam={
	  empresaId: getSession("gestopcompanyid"),
	  listEstadosProyectoIdFiltro: (listEstadosProyectoId.length==0?
                                        null:listEstadosProyectoId),
          ordenFiltroId: (numVecesFiltroVistaMed == 0?1:
                            ($("#selOrdenAuxProyecto").val()!=null?
                                $("#selOrdenAuxProyecto").val():null)),
          isActivo: (numVecesFiltroVistaMed == 0?1:
                        ($("#selContratistaActAuxProyecto").val() != -1?
                            $("#selContratistaActAuxProyecto").val():null))
		 };
   
   numVecesFiltroVistaMed++;
   
   callAjaxPost(URL+'/contratista/proyectos/vista_medico',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var listPanelesPrincipal = [];
	    listFullProyectosMedico = data.proyectos;
	    listFullProyectosTrabajador = data.proyectos;
	    listFullProyectoSeguridad = data.proyectos;
	    listEvaluacionStatusTotal = data.tipo_evaluacion;
		   
	    var resumenNumExamenesPorEvaluar = 0,resumenNumExamenesDesaprobados = 0,
		resumenNumExamenesAprobados = 0,resumenNumExamenesTotal = 0,
		resumenNumExamenesPorValidar = 0;
		   
	    var contratistasIncluidos=[];
			
	    data.proyectos.forEach(function(val,index){
	       var tipoProyecto = 0;
	       var condicionAgregar = (tipoProyecto == 4?
				       val.postulante.asignacion != 1:
				          (val.estado.id == tipoProyecto && val.postulante.asignacion==1));
				
	       condicionAgregar = true;
				
	       if(condicionAgregar){
		  var textoAsignacion = (val.postulante.asignacion==1?"(Asignado)":"(No asignado)");
		  var textoBoton="",textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="",textoBotonAct5="",
		      textoBotonAudi="",textoBotonInsp="",textoBotonTrab,textoBotonObs="",textoBotonObsContr="",
		      textoBotonForm="",textoBotonInci="",textoBotonInduccion="",textoBotonIperc="",textoBotonStatus="";
					 
		  if(val.postulante.estado.id == 1){
		     textoBoton = "Desde: "+val.postulante.fechaPlanificadaTexto;
		  }
			
		  if(val.postulante.estado.id == 2){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
				  "<button class='btn btn-success' style='padding:5px' " +
				          "onclick='verCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
				     "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				  "</button>";
		  }
					
		  if(val.postulante.estado.id == 3){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
			          "<button class='btn btn-success' style='padding:5px' " +
			                  "onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
			             "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
			          "</button>" ;
		  }
					
		  if(true){
		     textoBotonObs="<button class='btn btn-success' style='padding:5px' " +
		     		           "onclick='verCompletarObsColaborador("+index+");alterarTextoBoton(this,11)'>" +
				      "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				   "</button>"+
				   "<br><br>" +
				   "<button class='btn btn-success' style='padding:5px' " +
				           "onclick='nuevaObservacionProyectoColaborador("+index+")'>" +
				      "<i class='fa fa-plus' aria-hidden='true'></i> Agregar" +
				   "</button>" ;
					 
		     textoBotonStatus="<button class='btn btn-success' style='padding:5px' " +
		     		              "onclick='cargarStatusExamenesProyectoMedico("+index+")'>" +
				         "<i class='fa fa-refresh' aria-hidden='true'></i> Cargar Status Exámenes" +
				      "</button>";
						 
		     textoBotonTrab="<button class='btn btn-success' style='padding:5px' " +
		     		            "onclick='verTablaResumenTrabProyecto("+index+")'>" +
				       "<i class='fa fa-table' aria-hidden='true'></i> Ver resumen" +
				    "</button>"+"";
		     
		     textoBotonAudi="<button class='btn btn-success' style='padding:5px' " +
		     		            "onclick='verCompletarAuditoriaColabGenral("+index+");alterarTextoBoton(this,6)'>" +
				       "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				    "</button>";
						
		     textoBotonInsp="<button class='btn btn-success' style='padding:5px' " +
		     		            "onclick='verCompletarInspeccionColabGenral("+index+");alterarTextoBoton(this,12)'>" +
				       "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				    "</button>";
						
		     textoBotonInci="<button class='btn btn-success' style='padding:5px' " +
		     		            "onclick='verCompletarIncidenteColaborador("+index+");alterarTextoBoton(this,7)'>" +
				       "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				    "</button>" +
				    "<br><br>" +
				    "<button class='btn btn-success' style='padding:5px' " +
				            "onclick='nuevoIncidenteProyectoColaborador("+index+")'>" +
				       "<i class='fa fa-plus' aria-hidden='true'></i> Agregar" +
				    "</button>"+""; 
		  }
		  
		  if(val.estado.id == 2){
		     textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
				"<button class='btn btn-success' style='padding:5px' " +
				        "onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
			           "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
			        "</button>"; 
		  }
					
		  if(val.estado.id == 3){
		     textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
				"<button class='btn btn-success' style='padding:5px' " +
				        "onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
				   "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
				"</button>";
		     textoBotonTrab="";textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="";
		     textoBotonAudi="";textoBotonInsp="";textoBotonObs="",textoBotonObsContr="";textoBotonForm="";
		     textoBotonInci="";textoBotonInduccion="",textoBotonIperc="";textoBotonStatus="";
		  } 
					
		  var filasRelevantesProyecto="" +
		      "<tr title='Status de exámenes' id='trStatusMedic"+val.id+"'>" +
		         "<td><i aria-hidden='true' class='fa fa-eye'></i> Status de exámenes"+"" +
			     "<div class='barraIndicadorProyecto'></div></td>" + 
			 "<td class='celdaIndicadorProyecto'></td>" +
			 "<td class='celdaBotonAccion'>"+textoBotonStatus+"</td>"+
		      "</tr>" +
		      "<tr class='detalleStatusExamMedico'></tr>"+"";
					
		  var puntajeProyecto = 0.0;
					
		  puntajeProyecto = val.postulante.indicadorDocumentosDecimal+
				    val.postulante.indicadorFormacionesDecimal+
				    val.postulante.indicadorActividadesDecimal1+
				    val.postulante.indicadorActividadesDecimal2+
				    val.postulante.indicadorActividadesDecimal3+
				    val.postulante.indicadorActividadesDecimal4+
				    val.postulante.indicadorObservacionesDecimal+
				    val.postulante.indicadorAuditoriaDecimal+
				    val.postulante.indicadorIncidentesDecimal+
				    val.postulante.indicadorTrabajadoresDecimal +
				    val.postulante.indicadorIpercDecimal 
				    
		  puntajeProyecto = puntajeProyecto/11;
					
		  switch(tipoProyecto){
		     case 1:
			break;
					
		     case 4:
			puntajeProyecto = val.postulante.indicadorDocumentosDecimal;
			filasRelevantesProyecto = "";
			break;
		  }
					
		  var descripcionProy=
		      "<div class='eventoGeneral'>" +
		         "<div id='tituloEvento'>" +
		            "<table class='table table-movil' id='proyectoTable"+val.id+"'>" +
			    "<tbody>" +
			       "<tr>" +
			          "<td><i aria-hidden='true' class='fa fa-user'></i> Contratista"+"</td>" + 
				  "<td colspan='2'> "+val.contratistaNombre+" </td>" + 
			       "</tr>" +
			       "<tr>" +
			          "<td><i aria-hidden='true' class='fa fa-hourglass-start'></i> Fecha Inicio"+"</td>" + 
				  "<td colspan='2'> "+val.fechaInicioTexto+ "</td>" +
			       "</tr>" +
			       "<tr>" +
			          "<td><i aria-hidden='true' class='fa fa-hourglass-end'></i> Fecha Fin"+"</td>" + 
				  "<td colspan='2'> "+val.fechaFinTexto+"</td>" + 
			       "</tr>" +
			       "<tr>" +
				  "<td><i aria-hidden='true' class='fa fa-info'></i> Descripción"+"</td>" + 
				  "<td colspan='2'> "+val.descripcion+" </td>" + 
			       "</tr>" +
				filasRelevantesProyecto+
			    "</tbody>" +
			 "</table>"+ 
		      "</div>"+
	           "</div>";
			
		  if(parseInt(getSession("gestopcompanyid")) == 154 ||
	             parseInt(getSession("gestopcompanyid")) == 285){
		     val.postulante.contratista.numExamenesPorEvaluar=
		        (val.postulante.contratista.numExamenesTotal-val.postulante.contratista.numExamenesAprobados-
		         val.postulante.contratista.numExamenesDesaprobados-val.postulante.contratista.numExamenesPorValidar);
		  }else{
		     val.postulante.contratista.numExamenesPorEvaluar=
		        (val.postulante.contratista.numExamenesTotal-val.postulante.contratista.numExamenesAprobados-
			 val.postulante.contratista.numExamenesDesaprobados); 
		  }			
		  
		  var textPorEvaluar="";
		  var textPorValidar="";
					
		  if(val.postulante.contratista.numExamenesPorEvaluar > 0){
		     textPorEvaluar="<br><label style='font-size: 13px;font-weight: 600;color: #b85e5e'>" +
		     		           "Exámenes Por Evaluar: "+val.postulante.contratista.numExamenesPorEvaluar+
		     		        "</label>";
		  }
		  
		  if(val.postulante.contratista.numExamenesPorValidar > 0){
		     textPorValidar="<br><label style='font-size: 13px;font-weight: 600;color: #b85e5e'>" +
			     		   "Exámenes Por Validar: "+val.postulante.contratista.numExamenesPorValidar+
			     		"</label>";
		  }
					
		  if(contratistasIncluidos.indexOf(val.postulante.contratista.id) == -1){
		     resumenNumExamenesPorEvaluar+=val.postulante.contratista.numExamenesPorEvaluar;
		     resumenNumExamenesPorValidar+=val.postulante.contratista.numExamenesPorValidar;
		     resumenNumExamenesDesaprobados+=val.postulante.contratista.numExamenesDesaprobados;
		     resumenNumExamenesAprobados+=val.postulante.contratista.numExamenesAprobados;
		     resumenNumExamenesTotal+=val.postulante.contratista.numExamenesTotal;
		     contratistasIncluidos.push(val.postulante.contratista.id)
		  }
					
		  listPanelesPrincipal.push(
		     {id:"pro"+val.id,clase:"divProyectoGeneral",proyectoId:val.id,
		      nombre:""+val.titulo+" ("+pasarDecimalPorcentaje(val.porcentajeAvance)+")" +
			     "<br><label style='font-size:13px;font-weight:600;'>Contratista Asignado: "+val.contratistaNombre+"</label>"+
				  textPorEvaluar+
				  textPorValidar+
			     "<br><label style='font-size:13px;font-weight:600;'>Exámenes Desaprobados: "+val.postulante.contratista.numExamenesDesaprobados+"</label>"+
			     "<br><label style='font-size:13px;font-weight:600;'>Exámenes Aprobados: "+val.postulante.contratista.numExamenesAprobados+"</label>"+
			     "<br><label style='font-size: 13px;font-weight: 600;'>Exámenes Total: "+val.postulante.contratista.numExamenesTotal+"</label>",
	              contenido:descripcionProy});
	       }
	    });
		
	    var	listPanelesPrincipalResumen=[
                   {id:"proDetalle",clase:"divProyectoGeneral",proyectoId:null,
                    nombre:"",contenido:""},
                   {id:"proFiltro",clase:"divProyectoGeneral",proyectoId:null,
                    nombre:"",contenido:""},
		   {id:"proResumen",clase:"divProyectoGeneral",proyectoId:null,
		    nombre:"",contenido:""}
                                            ];
	    
	    agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);
			 
	    $("#proDetalle").find(".tituloSubList")
	    .html("<button class='btn-success btn' onclick='verCuadroEvaluacionMedica()'>" +
		     "<i class='fa fa-table fa-2x'></i>" +
		  "</button> Cuadro resumen de trabajadores");
	    
	    $("#proFiltro").find(".tituloSubList")
	    .html("<button class='btn-success btn' onclick='verFiltroVistaMed()'>" +
		     "<i class='fa fa-filter fa-2x'></i>" +
		  "</button> Filtro - Resumen de proyectos");
			
	    $("#proResumen").find(".tituloSubList").css({"background-color":"#e5eee9"})
	    .html("Resumen de Proyectos"+
		  "<br><label style='font-size:13px;font-weight:600;color:#b85e5e'>" +
		         "Exámenes Por Evaluar: "+resumenNumExamenesPorEvaluar+
		      "</label>" +
		  (parseInt(getSession("gestopcompanyid")) == 154 ||
		   parseInt(getSession("gestopcompanyid")) == 285?
		     "<br><label style='font-size:13px;font-weight:600;color:#b85e5e'>" +
		            "Exámenes Por Validar: "+resumenNumExamenesPorValidar+
		         "</label>":"") +
		  "<br><label style='font-size:13px;font-weight:600;'>" +
		         "Exámenes Desaprobados: "+resumenNumExamenesDesaprobados+
		      "</label>"+
		  "<br><label style='font-size:13px;font-weight:600;'>" +
		         "Exámenes Aprobados: "+resumenNumExamenesAprobados+
		      "</label>"+
		  "<br><label style='font-size:13px;font-weight:600;'>" +
		         "Exámenes Total: "+resumenNumExamenesTotal+
		      "</label>");
			
	    $(".divListModulos #icoContra")
	    .html("<i class='fa fa-users'></i> Contratistas ("+(resumenNumExamenesPorEvaluar+
		                                                resumenNumExamenesPorValidar)+")");
		
	    $(".divTituloFull h4").append(" - "+listPanelesPrincipal.length+" proyecto(s) ");
			
	    agregarPanelesDivPrincipalColaborador(listPanelesPrincipal);
				
	    var textObservacion="";
			
	    var listItemsFormObservacion=[
		   {sugerencia:"",label:"Acción de mejora",inputForm:"",divContainer:"divDescAccColab"},
		   {sugerencia:"",label:"Fecha planificada",inputForm:"",divContainer:"divFechaAccColab"},
		   {sugerencia:"",label:"Observación del contratista",inputForm:"",divContainer:"divObsAccColab"},
		   {sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviAccionMejora"}, 
		   {sugerencia:"",label:"Fecha Realizada",inputForm:"",divContainer:"divFechaRealAccColab"},
		   {sugerencia:"Si está todo conforme, dejar en blanco",label:"Respuesta de cliente",inputForm:"<input class='form-control' id='inpuRespAccColaborador'>",divContainer:"divFechaRealAccColab"},
		   {sugerencia:"",label:" ",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
  		 			 ];
			
	    listItemsFormObservacion.forEach(function(val,index){
	       textObservacion+=obtenerSubPanelModulo(val); 
	    });
			
	    var listEditarPrincipal=[ 
		   {id:"editarMovilAccProyColab" ,clase:"contenidoFormVisible",
		    nombre:""+"Editar Acción de mejora",
		    contenido:"<form id='formEditarAccionColab' class='eventoGeneral'>"+textObservacion+"</form>"}
			            ];
			
	    agregarPanelesDivPrincipalColaborador(listEditarPrincipal);
			
	    $(".contenidoFormVisible").hide();
			 
	    $('#formEditarAccionColab').on('submit', function(e) {  
	       e.preventDefault();   
	       guardarAccionProyectoColaborador();
	    });
				
	    completarBarraCarga();
	    break;
      }
   })
}

function verAcordeContratistaMedico(){
	var contratistaId=parseInt($("#selEmpresaMedico").val());
	listTrabajadoresMedico=[];
	var objTodo=[{nombreCompleto:"TODOS",id:0 ,tipoDocumento:{nombre:""},nroDocumento:""}];
	listTrabajadoresMedico = objTodo.concat(listTrabajadoresMedico);
	listContratistaMedico.forEach(function(val1){
		if(val1.id==contratistaId   ||  contratistaId==0){
			//
			$("#subDetalle").find(".contenidoSubList")
			.html("");
			
			//
			listTrabajadoresMedico=listTrabajadoresMedico.concat(val1.trabajadores);
			
			
			listTrabajadoresMedico.forEach(function(val){
				if(val.id!=0){
				val.nombreCompleto=val.nombre+" ("+val.tipoDocumento.nombre+": "+val.nroDocumento+")";
				
				}
				
			});
			crearSelectOneMenuObligUnitarioCompleto("selTrabajadoresEmpresaMedico", 
					"verAcordeTrabajadorContratistaMedico()", listTrabajadoresMedico, "id",
					"nombreCompleto","#divSelTrabajador","Trabajador",null);
			verAcordeTrabajadorContratistaMedico();
		}
	});

	
}
var listFullExamnesEvaluacionMedica=[];
function verAcordeTrabajadorContratistaMedico(){
	var trabajadorId=parseInt($("#selTrabajadoresEmpresaMedico").val());
	var trabajadorObj=null;
	listTrabajadoresMedico.forEach(function(val){
		if(val.id==trabajadorId ){
			trabajadorObj=val;
		}
	});
	$("#subResultTrabajador").hide();
	if(trabajadorObj!=null && trabajadorId!=0){
	callAjaxPost(URL + '/contratista/trabajador/info', {id:trabajadorId}, 
			function(data){
		$("#subResultTrabajador").show();
		$("#subResultTrabajador .tituloSubList").html("Resultado de búsqueda Trabajador<br> <h5 style='margin-bottom:0px'>Actualizado  "+obtenerHoraFechaActual()+" </h5>")
		var textFoto="Sin Registrar";
		if(data.trab!=null){
			textFoto=insertarImagenParaTablaMovil(data.trab.evidenciaFoto,"","100%")
		}
		
		var verificacionObj=verificarTrabajadorContratistaHabilitado(trabajadorObj);
		var infoArray=[
		               {campo:"Nombre",descripcion:"<strong>"+trabajadorObj.nombre+"</strong>"},
		               {campo:trabajadorObj.tipoDocumento.nombre,descripcion:"<strong>"+trabajadorObj.nroDocumento+"</strong>"},
		              
		               {campo:"Aptitud Médica",descripcion:""+verificacionObj.textoExamenVigilante.replace("<br>","")},
		               {campo:"Foto",descripcion:textFoto}];
		var informacionTexto="";
		infoArray.forEach(function(val,index){
			informacionTexto+="<tr>" +
			"<td style='width:177px;'>"+val.campo+"</td>" +
			"<td>"+val.descripcion+"</td>" +
			"</tr>" ;
		});
		$("#subResultTrabajador").find(".contenidoSubList")
		.html("<div class='eventoGeneral'><table class='table table-user-information'>" +
				"<tbody>" +
				informacionTexto+
				"</tbody>" +
				"</table>" +
				"</div>");
	})
	}else{
		$("#subResultTrabajador").hide();
		$("#subResultTrabajador").find(".contenidoSubList")
		.html("<div class='eventoGeneral'>Sin Trabajadores"+
				"</div>");
	}
	
		callAjaxPost(URL + '/contratista/examenes', {id:parseInt($("#selEmpresaMedico").val()),
			                                     examen:{tipo:{id:1}},
			                                     perfil: {id: null}}, 
				function(data){
			$("#subResultExamen .tituloSubList").html("Resultado de búsqueda Exámenes<br> <h5 style='margin-bottom:0px'>Actualizado  "+obtenerHoraFechaActual()+" </h5>")
			$("#subResultExamen").find(".contenidoSubList")
				.html("")
			listFullExamnesEvaluacionMedica=data.examenes;
			if(listFullExamnesEvaluacionMedica.length==0){
				 
				$("#subResultExamen").find(".contenidoSubList")
				.html("<div class='eventoGeneral'>Sin exámenes"+
						"</div>");
			}else{
				
			}
			listFullExamnesEvaluacionMedica.forEach(function(val,index){
				if(val.evaluacion==null){
					val.evaluacion={fechaTexto:"",nota:{id:0,nombre:"Sin evaluar",icono:""},observacion:"" };
				}else{
					if(val.evaluacion.nota==null){
						val.evaluacion.nota={id:0,icono:"",nombre:""};
					}
				}
			});
			listFullExamnesEvaluacionMedica.sort(function(a, b){
				return b.evaluacion.nota.id-a.evaluacion.nota.id
			});
			listFullExamnesEvaluacionMedica.forEach(function(val,index){
				var listTrabId=val.trabajadoresId.split(",");
				if(listTrabId.indexOf(trabajadorId+"")!=-1 || trabajadorId==0){
					var textDescarga="Sin registrar"
						if(val.evidenciaNombre!=""){
							textDescarga=
								"<a class='efectoLink' target='_blank' href='"+urlArchivo(val.evidenciaUrl)+"'>"+
								"<i class='fa fa-download'></i>"+val.evidenciaNombre+"</a>"
						}
					var textoBotonAgregar="<a class='efectoLink' onclick='evaluarStatusExamenMedicoBusqueda("+index+")'>Modificar</a>";
					var textObservacion="";
					if(val.evaluacion.observacion!=""){
						textObservacion=" ("+val.evaluacion.observacion+")"
					}
				var infoArray=[
				               {campo:"Trabajador(es)",descripcion:"<strong>"+val.trabajadoresNombre+"</strong>"},
				               {campo:"Evidencia",descripcion:textDescarga},
				               {campo:"Fecha realizada",descripcion:""+val.fechaTexto},
				               {campo:"Vigencia",descripcion:""+val.vigencia.nombre},
				               {id:"campoEvalExam"+val.id,campo:"Evaluación",descripcion:""+val.evaluacion.nota.icono+""+val.evaluacion.nota.nombre+""+textObservacion+" "+textoBotonAgregar},
				               {campo:"Fecha Evaluación",descripcion:""+val.evaluacion.fechaTexto},
				               
				               ];
				var informacionTexto="";
				infoArray.forEach(function(val1){
					informacionTexto+="<tr>" +
					"<td style='width:177px;'>"+val1.campo+"</td>" +
					"<td id='"+val1.id+"'>"+val1.descripcion+"</td>" +
					"</tr>" ;
				});
				$("#subResultExamen").find(".contenidoSubList")
				.append("<div class='eventoGeneral'><table class='table table-user-information'>" +
						"<tbody>" +
						informacionTexto+
						"</tbody>" +
						"</table>" +
						"</div>");
				}
			});
		});
		
	
	
}

function verCuadroEvaluacionMedica(){
   $(".divContainerGeneral").hide();
	
   var buttonDescarga="<a target='_blank' class='btn btn-success' href='"+URL+"/'>" +
		         "<i class='fa fa-download'></i> Descargar" +
		      "</a>";
   
   var buttonClip="<button type='button' id='btnClipboardTrabProy' style='margin-right:10px'" +
			 " class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()'>" +
	             "<i class='fa fa-clipboard'></i> Clipboard" +
	          "</button>";
   
   var buttonVolver="<button type='button' class='btn btn-success ' style='margin-right:10px'" +
			   " onclick='volverVistaMovil()' title='Regresar a la vista anterior.'>" +
		       "<i class='fa fa-2x fa-sign-out fa-rotate-180'></i>" +
		    "</button>";
   
   var buttonFiltro="<button type='button' class='btn btn-success ' id='btnIniciarFiltro' style='margin-right:10px'" +
	                   " onclick='iniciarFiltroTrabProyecto()'>" +
		       "<i class='fa fa-filter'></i> Ver filtros" +
		    "</button>";
   
   var buttonFiltroAplicar="<button type='button' class='btn btn-success ' id='btnAplicarFiltro' style='margin-right:10px'" +
	                          " onclick='aplicarFiltroTrabProyecto()'>" +
		              "<i class='fa fa-filter'></i> Aplicar filtros" +
		           "</button>";
   var buttonFiltroRefresh="<button type='button' class='btn btn-success ' id='btnReiniciarFiltro' style='margin-right:10px'" +
	                          " onclick='reiniciarFiltroTrabProyecto()'>" +
		              "<i class='fa fa-refresh'></i> Refresh" +
		           "</button>";
	
   var buttonBuscar="<input class='form-control' id='buscarTrabProy'>" +
		    "<button type='button' class='btn btn-success ' style='margin-right:10px'" +
	                      " onclick='buscarTrabajadorProyecto()'>" +
		       "<i class='fa fa-search'></i> Buscar" +
		    "</button>";
   $("body")
   .append("<div id='divTrabProyTabla' class='divTablaVisual' style='padding-left:40px;'>" +
	      "<form class='form-inline'>"+
	          buttonVolver+
	      "</form>"+
	      "<div class='camposFiltroTabla'>"+
	         "<div class='contain-filtro' id='filtroProyTrab'>" +
		    "<input type='checkbox' id='checkFiltroProyTrab' checked>" +
		    "<label for='checkFiltroProyTrab'>Trabajadores "+
		    "</label>" +
		    "<div id='divSelectFiltroProyTrab'>" +
		    "</div>" + 
		 "</div>"+	
              "</div>" +
	      "<div class='wrapper' id='wrapperDetVigMedica'>" +
	         "<table style='min-width:1250px;width:100%' id='tblDetVigMedica' " +
	                "class='table table-striped table-bordered table-hover fixed'>" +
		    "<thead>" +
		       "<tr>" +
		          "<th class='tb-acc' rowspan='3' style='width:250px'>Contratista</th>" +
		          "<th class='tb-acc' rowspan='3' style='width:250px'>Trabajador de la contratista</th>" + 
		          "<th class='tb-acc' rowspan='3' style='width:200px'>Estado de Aptitud Médica</th>" +
		          "<th class='tb-acc' colspan='3' style='width:700px'>Evaluación</th>" +
		       "</tr>" +
		       "<tr>" +
		          "<th class='tb-acc' rowspan='2' style='width:200px'>Estado</th>" +
		          "<th class='tb-acc' rowspan='2' style='width:300px'>Observación</th>" +  
		          "<th class='tb-acc' rowspan='2' style='width:200px'>Fecha</th>" + 
		       "</tr>" +
		    "</thead>" +
		    "<tbody></tbody>" +
		 "</table>" +
	      "</div>" +
	   "</div>");
   
   resizeDivWrapper("wrapperDetVigMedica",180);
   tituloAnteriorContratista = $(".divTituloGeneral h4").text();
   $(".camposFiltroTabla").remove();
	
   var proyectoObjSend={
	  empresaId:getSession("gestopcompanyid")
		       }
		
   callAjaxPost(URL+'/contratista/resumen/evaluacion_medica',proyectoObjSend,function(data){
      var list = data.list;
      $("#tblDetVigMedica tbody tr").remove();
			
      list.forEach(function(val,index){
         var trabajadores = val.trabajadores;
				
         trabajadores.forEach(function(val1){
	    val1.textoExamen = iconoGosst.desaprobado+" Sin examen médico vigente";
	    				
	    if(val1.indicadorExamenMedico != null){
	       var hasExamen,iconoHelp;
	       
	       hasExamen = (val1.notaExamenMedico == 1?true:false);
	       iconoHelp = (val1.notaExamenMedico == 1?iconoGosst.aprobado:(val1.notaExamenMedico == 2?iconoGosst.advertir:iconoGosst.por_evaluar));
							
	       val1.textoExamen = iconoHelp+" Examen médico vigente hasta el <br>"+val1.indicadorExamenMedico;
	    }else{
	       val1.observacionExamenMedico = "";
	    }
					
	    $("#tblDetVigMedica tbody")
	    .append("<tr>" +
		       "<td>"+val.nombre+"</td>" +
		       "<td>"+val1.nombre+"</td>" +
		       "<td>"+val1.textoExamen+"</td>" +
		       "<td>"+val1.tipoNotaExamenMedico+"</td>" +
		       "<td>"+val1.observacionExamenMedico+"</td>" +
		       "<td>"+val1.fechaEvaluacionTexto+"<br>"+
		             "*Evaluado por "+val1.nombreUsuario+"</td>" +
		    "</tr>");
         });
         
         goheadfixedY("#tblDetVigMedica","#wrapperDetVigMedica");
      });
   });
}

function cargarStatusExamenesProyectoMedico(indexProy){
   showDivStatusExamen();
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
   .html("<td colspan='3'></td>");
	
   var dataParamAux={
	  id: proyectoObj.postulante.contratista.id,
	  examen: {tipo: {id: 1}},
	  perfil: {id: null}
                    };
   
   callAjaxPost(URL+'/contratista/examenes',dataParamAux,function(data){
      listFullExamnesEvaluacionMedica = data.examenes;
      var numAprob = 0,numTotal = 0;
				
      listFullExamnesEvaluacionMedica.forEach(function(val,index){
         if(val.evaluacion == null){
	    val.evaluacion={
	       fechaTexto:"",
	       nota:{
		  id:0,
		  nombre:"Sin evaluar",
		  icono:""},
	       observacion:""
		           };
         }else{
	    if(val.evaluacion.nota == null){
	       val.evaluacion.nota={
		  id:0,
		  icono:"",
		  nombre:""
		                   };
	    }
         }
      });
				
      listFullExamnesEvaluacionMedica.sort(function(a, b){
         return b.evaluacion.nota.id-a.evaluacion.nota.id
      });
				
      listFullExamnesEvaluacionMedica.forEach(function(val,index){
         var claseNotaDocumento = "gosst-neutral";
					
         if(val.evaluacion.nota.id == 1){
	    numAprob++;
	    claseNotaDocumento = "gosst-aprobado";
         }
					
         numTotal++;
         val.tipo.nombre = "Exámen Médico";
         var detalle = ""; 
         var textoBotonDescarga = "<a href='"+urlArchivo(val.evidenciaUrl)+"' target='_blank'>" +
         		             "Descargar" +
         		          "</a>",
	     textoBotonAgregar = "<a onclick='evaluarStatusExamenMedico("+index+")'>Evaluar</a>",
	     textoBotonConfirm="";
		
         $("#proyectoTable"+proyectoObj.id)
	 .find(".detalleStatusExamMedico td") 
	 .append("<div id='divMovilExamProy"+val.id+"'>" +
		    "<div class='detalleAccion "+claseNotaDocumento+"'> " +
		       "<i class='fa fa-users'></i><label>Trabajador(es):</label> "+val.trabajadoresNombre+"  <br>" +
		       "<i class='fa fa-certificate'></i><label>Evidencia:</label> "+val.evidenciaNombre+"  <br>" +
		       "<i class='fa fa-calendar'></i><label>Inicio de vigencia:</label> "+val.fechaTexto+" (Vigencia : "+val.vigencia.nombre+")<br>" +
		       "<i class='fa fa-calendar'></i><label>Fin de vigencia:</label> "+val.fechaFinVigenciaTexto+"<br>" +	
		       "<label>*** EVALUACIÓN***</label>"+"<br>"+
		       "<i class='fa fa-pencil'></i><label>Estado:</label> "+val.evaluacion.nota.icono+""+val.evaluacion.nota.nombre+"<br>" +
		       "<i class='fa fa-calendar'></i><label>Fecha:</label> "+val.evaluacion.fechaTexto+"<br>"+
		       "<i class='fa fa-eye'></i><label>Observación:</label> "+val.evaluacion.observacion+""+
		    "</div>" +
		    "<div class='opcionesAccion'>"+textoBotonDescarga+"<i class='fa fa-minus'></i>"
						  +textoBotonAgregar+textoBotonConfirm+
		    "</div>" +
		    "<div class='subOpcionAccion'></div>" +
		 "</div>");
      });
				
      $("#trStatusMedic"+proyectoObj.id).find(".celdaIndicadorProyecto").html(numAprob+" / "+numTotal);
      $("#trStatusMedic"+proyectoObj.id).find(".celdaIndicadorProyecto").html("");
      $("#trStatusMedic"+proyectoObj.id).find(".barraIndicadorProyecto")
      .css({"width":pasarDecimalPorcentaje(numAprob/numTotal),
	    "background-color":colorPuntajeGosst(numAprob/numTotal)});
   });
}

function evaluarStatusExamenMedicoBusqueda(indexExam){
	var objDoc=listFullExamnesEvaluacionMedica[indexExam];
	listFullExamnesEvaluacionMedica.forEach(function(val){
		$("#campoEvalExam"+val.id).find("a").hide();
	});
	var selEstadoObsTotal=crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEvalColaborador(this)",
			listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
	var textoBotonVolver="<a onclick='cancelarEvaluacionStatusExamenBusqueda("+indexExam+")'><i class='fa fa-times'></i>Cancelar</a>";
	var btnGuardar="<a  onclick='guardarEvalStatusExamenMedicoBusqueda("+indexExam+")'>" +
	"<i class='fa fa-save'></i>Guardar</button>";
	$("#campoEvalExam"+objDoc.id).html(
			selEstadoObsTotal +"<label>"+objDoc.evaluacion.nota.icono+"</label><br>"+
			"<input class='form-control' id='inputObsEvalTotal' placeholder='Observación'><br>" +
			textoBotonVolver+" - "+btnGuardar
	);
	$("#campoEvalExam"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion)
	
}
function cancelarEvaluacionStatusExamenBusqueda(indexExam){
	var objDoc=listFullExamnesEvaluacionMedica[indexExam];
	listFullExamnesEvaluacionMedica.forEach(function(val){
		$("#campoEvalExam"+val.id).find("a").show();
	});
	var textoBotonAgregar="<a class='efectoLink' onclick='evaluarStatusExamenMedicoBusqueda("+indexExam+")'>Modificar</a>";
	var textObservacion="";
	if(objDoc.evaluacion.observacion!=""){
		textObservacion=" ("+objDoc.evaluacion.observacion+")"
	}
	$("#campoEvalExam"+objDoc.id).html(objDoc.evaluacion.nota.icono+""+objDoc.evaluacion.nota.nombre+""+textObservacion+" "+textoBotonAgregar
	);
}

function evaluarStatusExamenMedico(indexDoc){
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusExamMedico td")
   .find(".opcionesAccion").hide();
	
   var objDoc=listFullExamnesEvaluacionMedica[indexDoc];
   var selEstadoObsTotal=crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEvalColaborador(this)",
			listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
   var textoBotonVolver="<a onclick='cancelarEvaluacionStatusExamen("+indexDoc+")'>Cancelar</a>";
   var textoBotonConfirm="";
   var claseNotaDocumento="gosst-neutral";
	
   if(objDoc.evaluacion.nota.id==1){
      claseNotaDocumento="gosst-aprobado"
   }
	
   var detalle=objDoc.detalle;
   var btnGuardar="<button class='btn btn-success' onclick='guardarEvalStatusExamenMedico("+indexDoc+")'>" +
			"<i class='fa fa-save'></i>Guardar</button>";
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusExamMedico td") 
   .find("#divMovilExamProy"+objDoc.id)
   .html("<div class='detalleAccion "+claseNotaDocumento+"'> " +
            "<i class='fa fa-users'></i><label>Trabajador(es):</label> "+objDoc.trabajadoresNombre+" <br>" +
            "<i class='fa fa-certificate'></i><label>Evidencia:</label> "+objDoc.evidenciaNombre+" <br>" +
            "<i class='fa fa-calendar'></i><label>Inicio de vigencia:</label> "+objDoc.fechaTexto+" (Vigencia : "+objDoc.vigencia.nombre+")<br>" +
            "<i class='fa fa-calendar'></i><label>Fin de vigencia:</label> "+objDoc.fechaFinVigenciaTexto+"<br>" +
	    "<label>******EVALUACIÓN******</label><br>" +
	    "<label>Estado: "+objDoc.evaluacion.nota.icono+"</label>"+selEstadoObsTotal +"<br>"+
	    "<label>Observación :</label><input class='form-control' id='inputObsEvalTotal' placeholder='Observación'><br>" +
	    ""+btnGuardar+
	 "</div>" +
	 "<div class='opcionesAccion'>"
	       +textoBotonVolver+textoBotonConfirm+
	 "</div>" +
	 "<div class='subOpcionAccion'></div>");
	 
   $("#divMovilExamProy"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion);	
}

function cancelarEvaluacionStatusExamen(indexDoc){
   var objDoc=listFullExamnesEvaluacionMedica[indexDoc];
      
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusExamMedico td")
   .find(".opcionesAccion").show();
	
   var claseNotaDocumento="gosst-neutral";
	
   if(objDoc.evaluacion.nota.id == 1){
      claseNotaDocumento="gosst-aprobado"
   }
	
   var textoBotonDescarga="<a href='"+urlArchivo(objDoc.evidenciaUrl)+"' target='_blank'>" +
   		             "Descargar" +
   		          "</a>",
       textoBotonAgregar="<a onclick='evaluarStatusExamenMedico("+indexDoc+")'>Evaluar</a>",
       textoBotonConfirm="";
	
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleStatusExamMedico td") 
   .find("#divMovilExamProy"+objDoc.id)
   .html("<div class='detalleAccion "+claseNotaDocumento+"'> " +
	    "<i class='fa fa-users'></i><label>Trabajador(es):</label> "+objDoc.trabajadoresNombre+" <br>" +
	    "<i class='fa fa-certificate'></i><label>Evidencia:</label> "+objDoc.evidenciaNombre+"  <br>" +
	    "<i class='fa fa-calendar'></i><label>Inicio de vigencia:</label> "+objDoc.fechaTexto+" (Vigencia : "+objDoc.vigencia.nombre+")<br>" +
	    "<i class='fa fa-calendar'></i><label>Fin de vigencia:</label> "+objDoc.fechaFinVigenciaTexto+"<br>" +
	    "<label>******EVALUACIÓN******</label><br>" +
	    "<i class='fa fa-pencil'></i><label>Estado:</label> "+objDoc.evaluacion.nota.icono+""+objDoc.evaluacion.nota.nombre+"<br>" +
	    "<i class='fa fa-calendar'></i><label>Fecha:</label> "+objDoc.evaluacion.fechaTexto+"<br>"+
	    "<i class='fa fa-eye'></i><label>Observación:</label> "+objDoc.evaluacion.observacion+""+
	 "</div>" +
	 "<div class='opcionesAccion'>"+textoBotonDescarga+"<i class='fa fa-minus'></i>"
			               +textoBotonAgregar+textoBotonConfirm+
         "</div>" +
   	 "<div class='subOpcionAccion'></div>");	
}

function guardarEvalStatusExamenMedicoBusqueda(indexDoc){
	var objDoc=listFullExamnesEvaluacionMedica[indexDoc];
	var evalId=$("#selEvalTotalAct").val();
	var obs=$("#inputObsEvalTotal").val();
	var objAct={id:objDoc.id,evaluacion:{nota:{id:evalId},observacion:obs}};
	
	callAjaxPost(URL + '/contratista/proyecto/evaluacion_exam/unitaria/save', 
			objAct
			, function(data){
				if(data.CODE_RESPONSE=="05"){
					verAcordeTrabajadorContratistaMedico();
				}
			})
}

function guardarEvalStatusExamenMedico(indexDoc){
   var objDoc = listFullExamnesEvaluacionMedica[indexDoc];
   var evalId = $("#selEvalTotalAct").val();
   var obs = $("#inputObsEvalTotal").val();
   
   var objAct={
	  id:objDoc.id,
	  evaluacion:{
	     nota:{id:evalId},
	           observacion:obs}
              };
	
   callAjaxPost(URL+'/contratista/proyecto/evaluacion_exam/unitaria/save',objAct,function(data){
      if(data.CODE_RESPONSE == "05"){
	 cargarStatusExamenesProyectoMedico();
      }
   });
}

function showDivStatusExamen(){
	$("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
	.show();
	$("#trStatusMedic"+proyectoObj.id).find(".celdaBotonAccion")
	.html("<button class='btn btn-success' onclick='hideDivStatusExamen("+proyectoObj.id+")'>" +
			"<i class='fa fa-eye'></i>Ocultar</button>" 
			//+"<br><br>" +
			//"<button class='btn btn-success' onclick='tablaResumenStatusDocumentos("+proyectoObj.id+")'>" +
			//"<i class='fa fa-table'></i>Ver Tabla</button>"
			);
}

function hideDivStatusExamen(){
	$("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
	.hide();
	$("#trStatusMedic"+proyectoObj.id).find(".celdaBotonAccion")
	.html("<button class='btn btn-success' onclick='showDivStatusExamen("+proyectoObj.id+")'>" +
			"<i class='fa fa-eye'></i>Ver </button>");
}



