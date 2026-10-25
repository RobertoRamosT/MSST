/**
 * 
 */
var listFullProyectosSctr=[];
var menuDerechaSctr=[
                          
                          {id:1,icono:" fa-user-circle",ident:"icoPerfil",onclick:"",
                          	titulo:"Perfil",adicional:"Médico SCTR <label id='empresaActual'> </label>"}
                          ];
var menuFuncionesIzquierdaSctr=[
                {moduloId:22,icono:"fa-users",ident:"icoContra",funcionClick:function(){habilitarProyectosContratistaSctr()},titulo:"Contratistas",adicional:""},
                 {moduloId:22,icono:"fa-times-circle",ident:"icoCerrar",funcionClick:function(){cerrarSesion()},titulo:"Cerrar Sesión",adicional:""}
                 ];
var listContratistaSctr=[],listTrabajadoresSctr=[];
function marcarIconoModuloSeleccionadoSctr(menuIndex){
	 $("#menuExplicativo").hide();
	 $(".divContainerGeneral").show();
		$(".divListModulos").find("li").removeClass("activeMenu");
		$(".divListPrincipal").html("");
		$(".gosst-aviso").remove();
		var menuObject=menuFuncionesIzquierdaSctr[menuIndex];
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
 
function verLateralesFijosSctr(){
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
	menuDerechaSctr.forEach(function(val,index){
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
menuFuncionesIzquierdaSctr.forEach(function(val,index){
		$(".divListModulos").find("ul").append("" +
				"<li class='list-group-item' id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoSctr("+index+")'>" +
				"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
		$("#menuFigureti").find("ul").append("" +
				"<li class='list-group-item' style='color: #2e9e8f'  id='"+val.ident+"' onclick='marcarIconoModuloSeleccionadoSctr("+index+")'>" +
				"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
	}); 
	$("#menuMovilGosst").on("click",function(){
		$(".divContainerGeneral").toggle();
	});
$(".divListSecundaria").html("");
completarBarraCarga();
}

function habilitarProyectosContratistaSctr(){
	var trabajadorId=getSession("trabajadorGosstId");
	var dataParam={
			empresaId:getSession("gestopcompanyid")
			};
	callAjaxPost(URL + '/contratista/proyectos', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			listFullProyectosSctr=data.proyectos;
			listFullProyectosTrabajador=data.proyectos;
			listFullProyectoSeguridad=data.proyectos;
			listEvaluacionStatusTotal=data.tipo_evaluacion;
			var resumenNumSctresPorEvaluar=0,resumenNumSctresDesaprobados=0,resumenNumSctresAprobados=0,resumenNumSctresTotal=0;
			var contratistasIncluidos=[];
			data.proyectos.forEach(function(val,index){
				var tipoProyecto=0;
				var condicionAgregar=(tipoProyecto==4?
						val.postulante.asignacion!=1:
							(val.estado.id==tipoProyecto
									&& val.postulante.asignacion==1) );
				condicionAgregar=true;
				if(condicionAgregar ){
					var textoAsignacion=(val.postulante.asignacion==1?"(Asignado)  ":"(No asignado)  ");
					var textoBoton="",textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="",textoBotonAct5="",
					textoBotonAudi="",textoBotonInsp="",textoBotonTrab,
					textoBotonObs="",textoBotonObsContr="",textoBotonForm="",
					textoBotonInci="",textoBotonInduccion="",textoBotonIperc="",
					textoBotonStatus="";
					 
					if(val.postulante.estado.id==1){
						textoBoton="Desde: "+val.postulante.fechaPlanificadaTexto;
					}
					if(val.postulante.estado.id==2){
						textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
						"<button class='btn btn-success' style='padding:5px' onclick='verCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
							"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>";
					}
					if(val.postulante.estado.id==3){
						textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
						"<button class='btn btn-success' style='padding:5px' onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>" ;
					}
					if(true){
						textoBotonObs="<button class='btn btn-success' style='padding:5px' onclick='verCompletarObsColaborador("+index+");alterarTextoBoton(this,11)'>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>"+
						"<br><br>" +
						"<button class='btn btn-success' style='padding:5px' onclick='nuevaObservacionProyectoColaborador("+index+")'>" +
						"<i class='fa fa-plus' aria-hidden='true'></i>Agregar</button>" ;
					 
						textoBotonStatus="<button class='btn btn-success' style='padding:5px' onclick='cargarStatusSctresProyectoSctr("+index+")'>" +
						"<i class='fa fa-refresh' aria-hidden='true'></i>Cargar Status SCTR</button>";
						 
						 
						 
						textoBotonTrab=
						"<button class='btn btn-success' style='padding:5px' onclick='verTablaResumenTrabProyecto("+index+")'>" +
						"<i class='fa fa-table' aria-hidden='true'></i>Ver resumen</button>" +
						"";
						textoBotonAudi="<button class='btn btn-success' style='padding:5px' onclick='verCompletarAuditoriaColabGenral("+index+");alterarTextoBoton(this,6)'>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>";
						textoBotonInsp="<button class='btn btn-success' style='padding:5px' onclick='verCompletarInspeccionColabGenral("+index+");alterarTextoBoton(this,12)'>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>";
						textoBotonInci="<button class='btn btn-success' style='padding:5px' onclick='verCompletarIncidenteColaborador("+index+");alterarTextoBoton(this,7)'>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>" +
						"<br><br>" +
						"<button class='btn btn-success' style='padding:5px' onclick='nuevoIncidenteProyectoColaborador("+index+")'>" +
						"<i class='fa fa-plus' aria-hidden='true'></i>Agregar</button>" +
						""; 
						
					}
					if(val.estado.id==2){
						textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
						"<button class='btn btn-success' style='padding:5px' onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>"; 
					}
					if(val.estado.id==3){
						textoBoton="Hasta: "+val.postulante.fechaRealTexto+"<br>"+
						"<button class='btn btn-success' style='padding:5px' onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1) '>" +
						"<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver</button>";
						textoBotonTrab="";textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="";
						textoBotonAudi="";textoBotonInsp="";
						textoBotonObs="",textoBotonObsContr="";textoBotonForm="";
						textoBotonInci="";textoBotonInduccion="",textoBotonIperc="";textoBotonStatus="";
					} 
					var filasRelevantesProyecto="" +
					"<tr title='Status de SCTR' id='trStatusMedic"+val.id+"'>" +
					"<td > "+" <i aria-hidden='true' class='fa fa-eye'></i> Status de SCTR"+"" +
							"<div class='barraIndicadorProyecto' > </div></td>" + 
					"<td class='celdaIndicadorProyecto'></td>" +
					"<td class='celdaBotonAccion'>"+textoBotonStatus+"</td>"+
					"</tr>" +
					"<tr class='detalleStatusExamMedico'></tr>"+
					"";
					
					var puntajeProyecto=0.0;
					puntajeProyecto=val.postulante.indicadorDocumentosDecimal+
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
					puntajeProyecto=puntajeProyecto/11;
					switch(tipoProyecto){
					case 1:
						
					break;
					case 4:
						puntajeProyecto=val.postulante.indicadorDocumentosDecimal;
						filasRelevantesProyecto="";
						break;
					}
					var descripcionProy="<div  class='eventoGeneral'>" +
					"<div id='tituloEvento'>" +
					"<table class='table table-movil' id='proyectoTable"+val.id+"'>" +
					"<tbody>" +
					"<tr>" +
					"<td > "+" <i aria-hidden='true' class='fa fa-user'></i> Contratista"+"</td>" + 
					"<td colspan='2'>  "+val.contratistaNombre+" </td>" + 
					"</tr>" +
					"<tr>" +
						"<td > "+"<i aria-hidden='true' class='fa fa-hourglass-start'></i>Fecha Inicio"+"</td>" + 
						"<td colspan='2'>  "+val.fechaInicioTexto+ "</td>" +
						 
					"</tr>" +
					"<tr>" +
						"<td > "+"<i aria-hidden='true' class='fa fa-hourglass-end'></i>Fecha Fin"+"</td>" + 
						"<td colspan='2'>   "+val.fechaFinTexto+"</td>" + 
					"</tr>" +
						"<tr>" +
						"<td > "+" <i aria-hidden='true' class='fa fa-info'></i> Descripción"+"</td>" + 
						"<td colspan='2'> "+val.descripcion+" </td>" + 
					"</tr>" +
					 
					filasRelevantesProyecto+
					"</tbody>" +
					"</table>"+ 
					"</div>"+
					"</div>";
					val.postulante.contratista.numExamenesPorEvaluar=(val.postulante.contratista.numSctrTotal-
							val.postulante.contratista.numSctrAprobados-
							val.postulante.contratista.numSctrDesaprobados);
					var textPorEvaluar="";
					if(val.postulante.contratista.numExamenesPorEvaluar>0){
						textPorEvaluar="<br><label style='font-size: 13px;font-weight: 600;color: #b85e5e'>SCTR Por Evaluar: "+val.postulante.contratista.numExamenesPorEvaluar+"</label>";
					}
					if(contratistasIncluidos.indexOf(val.postulante.contratista.id)==-1){
						resumenNumSctresPorEvaluar+=val.postulante.contratista.numExamenesPorEvaluar;
						resumenNumSctresDesaprobados+=val.postulante.contratista.numSctrDesaprobados;
						resumenNumSctresAprobados+=val.postulante.contratista.numSctrAprobados;
						resumenNumSctresTotal+=val.postulante.contratista.numSctrTotal;
						contratistasIncluidos.push(val.postulante.contratista.id)
					}
					
				listPanelesPrincipal.push(
						{id:"pro"+val.id,clase:"divProyectoGeneral",proyectoId:val.id,
							nombre:""+val.titulo+" ("+pasarDecimalPorcentaje(val.porcentajeAvance)+")" +
							"<br><label style='font-size: 13px;font-weight: 600;'>Contratista Asignado: "+val.contratistaNombre+"</label>"+
							textPorEvaluar+
							"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Desaprobados: "+val.postulante.contratista.numSctrDesaprobados+"</label>"+
							"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Aprobados: "+val.postulante.contratista.numSctrAprobados+"</label>"+
									"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Total: "+val.postulante.contratista.numSctrTotal+"</label>",
							contenido:descripcionProy});
				}
			});
		var	listPanelesPrincipalResumen=
					[
{id:"subBuscador",clase:"divProyectoGeneral",proyectoId:null,
	nombre:"",contenido:""},
	{id:"subResultTrabajador",clase:"",proyectoId:null,nombre:"",contenido:""},
	{id:"subResultSctr",clase:"",proyectoId:null,nombre:"Resultados examen",contenido:""},
					 {id:"proDetalle",clase:"divProyectoGeneral",proyectoId:null,
						nombre:"",
						contenido:""},
						{id:"proResumen",clase:"divProyectoGeneral",proyectoId:null,
						nombre:"",
						contenido:""}];
			agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);
			//
			var textoForm="";
			var listItemsForm=[
			{sugerencia:"",label:"Empresa",inputForm:"... ",divContainer:"divSelEmpresa"},
			{sugerencia:" ",label:"Trabajador",inputForm:"...",divContainer:"divSelTrabajador"}
			];
			listItemsForm.forEach(function(val,index){
				textoForm+=obtenerSubPanelModulo(val); 
			});
			$(".divListPrincipal").find("#subResultTrabajador .tituloSubList")
			.html("Resultado de búsqueda");
			$(".divListPrincipal").find("#subBuscador .tituloSubList")
			.html("Buscar SCTR / Trabajadores");
			$("#subBuscador").find(".contenidoSubList").show().html(
					"<form class='eventoGeneral' id='buscadorVigilante'>"+
					textoForm+
					 "<button type='submit' class='btn btn-success' >" +
					 "<i aria-hidden='true' class='fa fa-search'></i>Buscar</button>"+
					"</form>"
			);
			 var proyectoObjSend={
					 empresaId:getSession("gestopcompanyid")
				 }
				callAjaxPost(URL + '/contratista/resumen/evaluacion_sctr', 
						proyectoObjSend, function(data){
					listContratistaSctr=data.list;
					console.log(listContratistaSctr);
					listContratistaSctr.forEach(function(val){
						val.numExamenesPorEvaluar=(val.numExamenesTotal-
								val.numExamenesAprobados-
								val.numExamenesDesaprobados);
						var textIndicador="("+val.numExamenesPorEvaluar+"-"+val.numExamenesDesaprobados+"-"+val.numExamenesAprobados+")"
						val.nombreCompleto=textIndicador+" "+val.nombre+"  (RUC: "+val.ruc+" )"
					});
					 
					crearSelectOneMenuObligUnitarioCompleto("selEmpresaSctr", "verAcordeContratistaSctr()", listContratistaSctr.sort(function(a, b){
						return b.numExamenesDesaprobados-a.numExamenesDesaprobados
					}).sort(function(a, b){
						return b.numExamenesPorEvaluar-a.numExamenesPorEvaluar
					}), "id",
							"nombreCompleto","#divSelEmpresa","Empresa",null);
					$("#divSelEmpresa").append("<small>*El indicador al costado significa:<br> " +
							"(# SCTR sin evaluar /<br> # SCTR desaprobados /<br> # SCTR aprobados) </small>")
					verAcordeContratistaSctr();
				})
			
			//
			$("#proDetalle").find(".tituloSubList")
			.html("<button class='btn-success btn' onclick='verCuadroEvaluacionSctr()'>" +
					"<i class='fa fa-table fa-2x'></i></button>Cuadro resumen de trabajadores")
			$("#proResumen").find(".tituloSubList").css({"background-color":"#e5eee9"}).html("Resumen de Proyectos"+
						"<br><label style='font-size: 13px;font-weight: 600;color: #b85e5e'>SCTR Por Evaluar: "+resumenNumSctresPorEvaluar+"</label>" +
						"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Desaprobados: "+resumenNumSctresDesaprobados+"</label>"+
						"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Aprobados: "+resumenNumSctresAprobados+"</label>"+
								"<br><label style='font-size: 13px;font-weight: 600;'>SCTR Total: "+resumenNumSctresTotal+"</label>");
			$(".divListModulos #icoContra").html("<i class='fa fa-users'></i>Contratistas ("+resumenNumSctresPorEvaluar+")")
		$(".divTituloFull h4").append(" - "+listPanelesPrincipal.length+" proyecto(s) ")
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
			
			
			
			
			break;
		}
	})
}
function verAcordeContratistaSctr(){
	var contratistaId=parseInt($("#selEmpresaSctr").val());
	listTrabajadoresSctr=[];
	var objTodo=[{nombreCompleto:"TODOS",id:0 ,tipoDocumento:{nombre:""},nroDocumento:""}];
	listTrabajadoresSctr = objTodo.concat(listTrabajadoresSctr);
	listContratistaSctr.forEach(function(val1){
		if(val1.id==contratistaId   ||  contratistaId==0){
			//
			$("#subDetalle").find(".contenidoSubList")
			.html("");
			
			//
			listTrabajadoresSctr=listTrabajadoresSctr.concat(val1.trabajadores);
			
			
			listTrabajadoresSctr.forEach(function(val){
				if(val.id!=0){
				val.nombreCompleto=val.nombre+" ("+val.tipoDocumento.nombre+": "+val.nroDocumento+")";
				
				}
				
			});
			crearSelectOneMenuObligUnitarioCompleto("selTrabajadoresEmpresaSctr", 
					"verAcordeTrabajadorContratistaSctr()", listTrabajadoresSctr, "id",
					"nombreCompleto","#divSelTrabajador","Trabajador",null);
			verAcordeTrabajadorContratistaSctr();
		}
	});

	
}
var listFullExamnesEvaluacionSctr=[];
function verAcordeTrabajadorContratistaSctr(){
	var trabajadorId=parseInt($("#selTrabajadoresEmpresaSctr").val());
	var trabajadorObj=null;
	listTrabajadoresSctr.forEach(function(val){
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
		              
		               {campo:"Aptitud SCTR",descripcion:""+verificacionObj.textoSctrVigilante.replace("<br>","")},
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
	
		callAjaxPost(URL + '/contratista/examenes', {id:parseInt($("#selEmpresaSctr").val()),
			                                     examen:{tipo:{id:2}},
			                                     perfil: {id: null}}, 
				function(data){
			$("#subResultSctr .tituloSubList").html("Resultado de búsqueda SCTR<br> <h5 style='margin-bottom:0px'>Actualizado  "+obtenerHoraFechaActual()+" </h5>")
			$("#subResultSctr").find(".contenidoSubList")
				.html("")
			listFullExamnesEvaluacionSctr=data.examenes;
			if(listFullExamnesEvaluacionSctr.length==0){
				 
				$("#subResultSctr").find(".contenidoSubList")
				.html("<div class='eventoGeneral'>Sin SCTR"+
						"</div>");
			}else{
				
			}
			listFullExamnesEvaluacionSctr.forEach(function(val,index){
				if(val.evaluacion==null){
					val.evaluacion={fechaTexto:"",nota:{id:0,nombre:"Sin evaluar",icono:""},observacion:"" };
				}else{
					if(val.evaluacion.nota==null){
						val.evaluacion.nota={id:0,icono:"",nombre:""};
					}
				}
			});
			listFullExamnesEvaluacionSctr.sort(function(a, b){
				return b.evaluacion.nota.id-a.evaluacion.nota.id
			});
			listFullExamnesEvaluacionSctr.forEach(function(val,index){
				var listTrabId=val.trabajadoresId.split(",");
				if(listTrabId.indexOf(trabajadorId+"")!=-1 || trabajadorId==0){
					var textDescarga="Sin registrar"
						if(val.evidenciaNombre!=""){
							textDescarga=
								"<a class='efectoLink' target='_blank' href='"+URL+"/contratista/examen/evidencia?id="+val.id+"'>"+
								"<i class='fa fa-download'></i>"+val.evidenciaNombre+"</a>"
						}
					var textoBotonAgregar="<a class='efectoLink' onclick='evaluarStatusSctrSctrBusqueda("+index+")'>Modificar</a>";
					var textObservacion="";
					if(val.evaluacion.observacion!=""){
						textObservacion=" ("+val.evaluacion.observacion+")"
					}
				var infoArray=[
				               {campo:"Trabajador(es)",descripcion:"<strong>"+val.trabajadoresNombre+"</strong>"},
				               {campo:"Evidencia",descripcion:textDescarga},
				               {campo:"Registrado el:",descripcion:""+val.fechaTexto},
				               {campo:"Vigencia",descripcion:""+val.vigencia.nombre},
				               {campo:"Vigente hasta el: ",descripcion:""+val.fechaFinVigenciaTexto},
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
				$("#subResultSctr").find(".contenidoSubList")
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
function verCuadroEvaluacionSctr(){
	$(".divContainerGeneral").hide();
	var buttonDescarga="<a target='_blank' class='btn btn-success'" +
			" href='"+URL+"/'>" +
			"<i class='fa fa-download'></i>Descargar</a>"
	var buttonClip="<button type='button' id='btnClipboardTrabProy'   style='margin-right:10px'" +
			" class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()'>" +
					"<i class='fa fa-clipboard'></i>Clipboard</button>"
	var buttonVolver="<button type='button' class='btn btn-success ' style='margin-right:10px'" +
			" onclick='volverVistaMovil()'>" +
						"<i class='fa fa-sign-out fa-rotate-180'></i>Volver</button>";
	var buttonFiltro="<button type='button' class='btn btn-success ' id='btnIniciarFiltro' style='margin-right:10px'" +
	" onclick='iniciarFiltroTrabProyecto()'>" +
				"<i class='fa fa-filter'></i>Ver filtros</button>";
	var buttonFiltroAplicar="<button type='button' class='btn btn-success ' id='btnAplicarFiltro' style='margin-right:10px'" +
	" onclick='aplicarFiltroTrabProyecto()'>" +
				"<i class='fa fa-filter'></i>Aplicar filtros</button>";
	var buttonFiltroRefresh="<button type='button' class='btn btn-success ' id='btnReiniciarFiltro' style='margin-right:10px'" +
	" onclick='reiniciarFiltroTrabProyecto()'>" +
				"<i class='fa fa-refresh'></i>Refresh</button>";
	var buttonBuscar="<input class='form-control' id='buscarTrabProy'>" +
			"<button type='button' class='btn btn-success ' style='margin-right:10px'" +
	" onclick='buscarTrabajadorProyecto()'>" +
				"<i class='fa fa-search'></i>Buscar</button>";
	$("body")
	.append("<div id='divTrabProyTabla' class='divTablaVisual' style='padding-left: 40px;'>" +
			"<form class='form-inline'>"+
			buttonVolver+"</form>"+
			"<div class='camposFiltroTabla'>"+
				"<div class='contain-filtro' id='filtroProyTrab'>" +
					"<input type='checkbox' id='checkFiltroProyTrab' checked>" +
					"<label for='checkFiltroProyTrab'  >Trabajadores "+
					"</label>" +
					"<div id='divSelectFiltroProyTrab'> " +
					"</div>" + 
				"</div>"+	
			"</div>" +
			"<div class='wrapper' id='wrapperDetVigSctr'>" +
			"<table  style='min-width:1250px;width:100% ' " +
			"id='tblDetVigSctr' class='table table-striped table-bordered table-hover fixed'>" +
			"<thead>" +
				"<tr>" +
				"<td class='tb-acc' style='width:220px'>Empresa Contratista</td>" +
				"<td class='tb-acc' style=''>Nombre</td>" + 
				"<td class='tb-acc' style='width:190px'>Estado de Aptitud Médica</td>" +
				"<td class='tb-acc' style='width:240px'>Observación</td>" +
				 
				"</tr>" +
			"</thead>" +
			"<tbody></tbody>" +
			"</table>" +
			"</div>" +
			" </div>");
	resizeDivWrapper("wrapperDetVigSctr",300);
	$(".camposFiltroTabla").remove();
	 var proyectoObjSend={
			 empresaId:getSession("gestopcompanyid")
		 }
		callAjaxPost(URL + '/contratista/resumen/evaluacion_sctr', 
				proyectoObjSend, function(data){
			var list=data.list;
			$("#tblDetVigSctr tbody tr").remove();
			list.forEach(function(val,index){
				var trabajadores=val.trabajadores;
				trabajadores.forEach(function(val1){
				   val1.textoSctr = iconoGosst.desaprobado+" Sin SCTR vigente";
					
				   if(val1.indicadorSctr != null){
				      var hasSctr,iconoHelp;	
				      
				      hasSctr = (val1.notaSctr == 1?true:false);
				      iconoHelp = (val1.notaSctr == 1?iconoGosst.aprobado:(val1.notaSctr == 2?iconoGosst.advertir:iconoGosst.por_evaluar));
						
				      val1.textoSctr = iconoHelp+" SCTR vigente: <br>"+val1.indicadorSctr
				   }else{
				      val1.observacionSctr = "";  
				   }
					
				   $("#tblDetVigSctr tbody")
					.append("<tr>" +
							"<td>"+val.nombre+"</td>" +
							"<td>"+val1.nombre+"</td>" +
							"<td>"+val1.textoSctr+"</td>" +
							"<td>"+val1.observacionSctr+"</td>" +
							"" +
							"" +
							"</tr>")
				});
			})
		});
}

function cargarStatusSctresProyectoSctr(indexProy){
	showDivStatusSctr();
	$("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
	.html("<td colspan='3'></td>");
	callAjaxPost(URL + '/contratista/examenes', {id:proyectoObj.postulante.contratista.id,
				                     examen:{tipo:{id:2}},
				                     perfil: {id: null}}, function(data){
				listFullExamnesEvaluacionSctr=data.examenes;
				var numAprob=0,numTotal=0;
				listFullExamnesEvaluacionSctr.forEach(function(val,index){
					if(val.evaluacion==null){
						val.evaluacion={fechaTexto:"",nota:{id:0,nombre:"Sin evaluar",icono:""},observacion:"" };
					}else{
						if(val.evaluacion.nota==null){
							val.evaluacion.nota={id:0,icono:"",nombre:""};
						}
					}
				});
				listFullExamnesEvaluacionSctr.sort(function(a, b){
					return b.evaluacion.nota.id-a.evaluacion.nota.id
				});
				listFullExamnesEvaluacionSctr.forEach(function(val,index){
					var claseNotaDocumento="gosst-neutral";
					
					if(val.evaluacion.nota.id==1){
						numAprob++;
						claseNotaDocumento="gosst-aprobado"
					}
					numTotal++;
					val.tipo.nombre="SCTR";
					var detalle=""; 
					var textoBotonDescarga="<a href='"+urlArchivo(val.evidenciaUrl)+"' target='_blank'>Descargar</a>",
					textoBotonAgregar="<a onclick='evaluarStatusSctrSctr("+index+")'>Evaluar</a>",
					textoBotonConfirm="";
					$("#proyectoTable"+proyectoObj.id)
					.find(".detalleStatusExamMedico td") 
					.append("<div id='divMovilExamProy"+val.id+"'>" +
							"<div class='detalleAccion "+claseNotaDocumento+"'> " +
							"<i class='fa fa-users'></i> Trabajador(es): "+val.trabajadoresNombre+"  <br>" +
							"<i class='fa fa-certificate'></i> "+val.evidenciaNombre+"  <br>" +
							"<i class='fa fa-calendar'></i>  "+val.fechaTexto+" (Vigencia : "+val.vigencia.nombre+")<br>" +
							"<i class='fa fa-calendar'></i>Fin de vigencia: "+val.fechaFinVigenciaTexto+"<br>" +
							"Evaluación: <br>" +
							""+val.evaluacion.nota.icono+""+val.evaluacion.nota.nombre+"<br>" +
							"<i class='fa fa-eye'></i> "+val.evaluacion.fechaTexto+" / " +val.evaluacion.observacion+""+
							
							"</div>" +
							"<div class='opcionesAccion'>"+textoBotonDescarga+"<i class='fa fa-minus'></i>"
							+textoBotonAgregar+textoBotonConfirm+"</div>" +
								"<div class='subOpcionAccion'></div>" +
								"</div>")
					  
				});
				
				$("#trStatusMedic"+proyectoObj.id).find(".celdaIndicadorProyecto").html(numAprob+" / "+numTotal);
				$("#trStatusMedic"+proyectoObj.id).find(".celdaIndicadorProyecto").html("");
				$("#trStatusMedic"+proyectoObj.id).find(".barraIndicadorProyecto")
				.css({"width":pasarDecimalPorcentaje(numAprob/numTotal),
					"background-color":colorPuntajeGosst(numAprob/numTotal)});
				
		})
}
function evaluarStatusSctrSctrBusqueda(indexExam){
	var objDoc=listFullExamnesEvaluacionSctr[indexExam];
	listFullExamnesEvaluacionSctr.forEach(function(val){
		$("#campoEvalExam"+val.id).find("a").hide();
	});
	var selEstadoObsTotal=crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEvalColaborador(this)",
			listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
	var textoBotonVolver="<a onclick='cancelarEvaluacionStatusSctrBusqueda("+indexExam+")'><i class='fa fa-times'></i>Cancelar</a>";
	var btnGuardar="<a  onclick='guardarEvalStatusSctrSctrBusqueda("+indexExam+")'>" +
	"<i class='fa fa-save'></i>Guardar</button>";
	$("#campoEvalExam"+objDoc.id).html(
			selEstadoObsTotal +"<label>"+objDoc.evaluacion.nota.icono+"</label><br>"+
			"<input class='form-control' id='inputObsEvalTotal' placeholder='Observación'><br>" +
			textoBotonVolver+" - "+btnGuardar
	);
	$("#campoEvalExam"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion)
	
}
function cancelarEvaluacionStatusSctrBusqueda(indexExam){
	var objDoc=listFullExamnesEvaluacionSctr[indexExam];
	listFullExamnesEvaluacionSctr.forEach(function(val){
		$("#campoEvalExam"+val.id).find("a").show();
	});
	var textoBotonAgregar="<a class='efectoLink' onclick='evaluarStatusSctrSctrBusqueda("+indexExam+")'>Modificar</a>";
	var textObservacion="";
	if(objDoc.evaluacion.observacion!=""){
		textObservacion=" ("+objDoc.evaluacion.observacion+")"
	}
	$("#campoEvalExam"+objDoc.id).html(objDoc.evaluacion.nota.icono+""+objDoc.evaluacion.nota.nombre+""+textObservacion+" "+textoBotonAgregar
	);
}
function evaluarStatusSctrSctr(indexDoc){
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleStatusExamMedico td")
	.find(".opcionesAccion").hide();
	var objDoc=listFullExamnesEvaluacionSctr[indexDoc];
	var selEstadoObsTotal=crearSelectOneMenuOblig("selEvalTotalAct","verIconoAcuerdoEvalColaborador(this)",
			listEvaluacionStatusTotal,objDoc.evaluacion.nota.id,"id","nombre");
	var textoBotonVolver="<a onclick='cancelarEvaluacionStatusSctr("+indexDoc+")'>Cancelar</a>";
	var textoBotonConfirm="";
	var claseNotaDocumento="gosst-neutral";
	if(objDoc.evaluacion.nota.id==1){
		claseNotaDocumento="gosst-aprobado"
	}
	var detalle=objDoc.detalle;
	var btnGuardar="<button class='btn btn-success' onclick='guardarEvalStatusSctrSctr("+indexDoc+")'>" +
			"<i class='fa fa-save'></i>Guardar</button>";
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleStatusExamMedico td") 
	.find("#divMovilExamProy"+objDoc.id).html(
			"<div class='detalleAccion "+claseNotaDocumento+"'> " +
			"<i class='fa fa-users'></i> Trabajador(es): "+objDoc.trabajadoresNombre+"  <br>" +
			"<i class='fa fa-certificate'></i> "+objDoc.evidenciaNombre+"  <br>" +
			"<i class='fa fa-calendar'></i>  "+objDoc.fechaTexto+" (Vigencia : "+objDoc.vigencia.nombre+")<br>" +
			"<i class='fa fa-calendar'></i>Fin de vigencia:  "+objDoc.fechaFinVigenciaTexto+"<br>" +
			
					"Evaluación: <br>" +
					selEstadoObsTotal +"<label>"+objDoc.evaluacion.nota.icono+"</label><br>"+
			"<input class='form-control' id='inputObsEvalTotal' placeholder='Observación'><br>" +
			""+btnGuardar+
			
			"</div>" +
			"<div class='opcionesAccion'>"
			+textoBotonVolver+textoBotonConfirm+"</div>" +
				"<div class='subOpcionAccion'></div>"  );
	 $("#divMovilExamProy"+objDoc.id).find("#inputObsEvalTotal").val(objDoc.evaluacion.observacion)
	
	
}
function cancelarEvaluacionStatusSctr(indexDoc){
	var objDoc=listFullExamnesEvaluacionSctr[indexDoc];
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleStatusExamMedico td")
	.find(".opcionesAccion").show();
	var claseNotaDocumento="gosst-neutral";
	if(objDoc.evaluacion.nota.id==1){
		claseNotaDocumento="gosst-aprobado"
	}
	var textoBotonDescarga="<a href='"+urlArchivo(objDoc.evidenciaUrl)+"' target='_blank'>Descargar</a>",
	textoBotonAgregar="<a onclick='evaluarStatusSctrSctr("+indexDoc+")'>Evaluar</a>",
	textoBotonConfirm="";
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleStatusExamMedico td") 
	.find("#divMovilExamProy"+objDoc.id).html( 
			"<div class='detalleAccion "+claseNotaDocumento+"'> " +
			"<i class='fa fa-users'></i> Trabajador(es): "+objDoc.trabajadoresNombre+"  <br>" +
			"<i class='fa fa-certificate'></i> "+objDoc.evidenciaNombre+"  <br>" +
			"<i class='fa fa-calendar'></i>  "+objDoc.fechaTexto+" (Vigencia : "+objDoc.vigencia.nombre+")<br>" +
			"<i class='fa fa-calendar'></i>Fin de vigencia:  "+objDoc.fechaFinVigenciaTexto+"<br>" +
					"Evaluación: <br>" +
			""+objDoc.evaluacion.nota.icono+""+objDoc.evaluacion.nota.nombre+"<br>" +
			"<i class='fa fa-eye'></i> "+objDoc.evaluacion.fechaTexto+" / " +objDoc.evaluacion.observacion+""+
			
			"</div>" +
			"<div class='opcionesAccion'>"+textoBotonDescarga+"<i class='fa fa-minus'></i>"
			+textoBotonAgregar+textoBotonConfirm+"</div>" +
				"<div class='subOpcionAccion'></div>"  )
	
}
function guardarEvalStatusSctrSctrBusqueda(indexDoc){
	var objDoc=listFullExamnesEvaluacionSctr[indexDoc];
	var evalId=$("#selEvalTotalAct").val();
	var obs=$("#inputObsEvalTotal").val();
	var objAct={id:objDoc.id,evaluacion:{nota:{id:evalId},observacion:obs}};
	
	callAjaxPost(URL + '/contratista/proyecto/evaluacion_exam/unitaria/save', 
			objAct
			, function(data){
				if(data.CODE_RESPONSE=="05"){
					verAcordeTrabajadorContratistaSctr();
				}
			})
}

function guardarEvalStatusSctrSctr(indexDoc){
	var objDoc=listFullExamnesEvaluacionSctr[indexDoc];
	var evalId=$("#selEvalTotalAct").val();
	var obs=$("#inputObsEvalTotal").val();
	var objAct={id:objDoc.id,evaluacion:{nota:{id:evalId},observacion:obs}};
	
	callAjaxPost(URL + '/contratista/proyecto/evaluacion_exam/unitaria/save', 
			objAct
			, function(data){
				if(data.CODE_RESPONSE=="05"){
					cargarStatusSctresProyectoSctr();
				}
			})
}
function showDivStatusSctr(){
	$("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
	.show();
	$("#trStatusMedic"+proyectoObj.id).find(".celdaBotonAccion")
	.html("<button class='btn btn-success' onclick='hideDivStatusSctr("+proyectoObj.id+")'>" +
			"<i class='fa fa-eye'></i>Ocultar</button>" 
			//+"<br><br>" +
			//"<button class='btn btn-success' onclick='tablaResumenStatusDocumentos("+proyectoObj.id+")'>" +
			//"<i class='fa fa-table'></i>Ver Tabla</button>"
			);
}

function hideDivStatusSctr(){
	$("#proyectoTable"+proyectoObj.id).find(".detalleStatusExamMedico")
	.hide();
	$("#trStatusMedic"+proyectoObj.id).find(".celdaBotonAccion")
	.html("<button class='btn btn-success' onclick='showDivStatusSctr("+proyectoObj.id+")'>" +
			"<i class='fa fa-eye'></i>Ver </button>");
}



