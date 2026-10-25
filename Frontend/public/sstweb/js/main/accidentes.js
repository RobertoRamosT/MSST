/**
 * 
 */
var listFullAccidentesMovil=[];
var indexFunction=0;
var listFullAccidenteEval=[];
var listFullAccidenteFlash=[];
var listClasificacionAccionEscenarioColaborador  = [];
var listAreaAccidenteColaborador = [];
var listTrabajadores = [];
var mensajeUx;
var idMaxAccAreaActual;
var idMaxAccEscenarioActual;
var mostrarFormulario;

function toggleMenuOpcionAccid(obj,pindex)
{
	indexFunction=pindex; 
	$(obj).parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent(".eventoGeneral").siblings().find("ul").hide();
}
 var funcionalidadesAccidente=
[
	{id:"opcDetalle",nombre:"<i class='fa fa-file-text-o'></i>&nbspDetalle",
		functionClick:function(data){verDetalleAccidenteMovil(indexFunction);}}, //llamando funcion deseada
	{id:"opcAcciones",nombre:"<i class='fa fa-eye'></i>&nbspVer Acciones",
			functionClick:function(data){verAccionesAccidenteMovil(indexFunction);}}
];
 function marcarSubOpcionAccid(pindex)
 {
	 funcionalidadesAccidente[pindex].functionClick(); 
	 $(".listaGestionGosst").hide();
 }
function habilitarAccidentesEmpresa(){
	var dataParam2 = {
			idCompany:getSession("gestopcompanyid") 
		};
	
	callAjaxPost(URL + '/accidente', dataParam2,function(data){
		listFullAccidentesMovil = data.list;
		var contenidoRevisar="", contenidoSinRevisar="", contenidoRetrasado="";
		 
		var revisarNum=0,sinRevisarNum=0 ;
		listFullAccidentesMovil.sort(function(a,b){
			return new Date(b.fecha) - new Date(a.fecha);
			});
		listFullAccidentesMovil.forEach(function(val,index){ 
			var colorFondo="gray";
			var textEvi="<a class='btn btn-success' href='"+URL +"/examenmedico/vigilancia_medica/hallazgo/evidencia?id="+val.id+"' target='_blank'  >" +
			"<i class='fa fa-download'> </i>Descargar</a>";
			if(val.evidenciaNombre.length>0){
				val.evidenciaNombre=val.evidenciaNombre+"  <br>"+textEvi;
			}else{
				textEvi="";
				val.evidenciaNombre="Sin registrar";
			}
			var colorIn="";
			switch(val.numAcciones){
			case 0:
				colorIn="#c9c6c6";
				break;
			default:
				colorIn="#9BBB59";
				
				break;
			}
			var menuOpcion="<ul class='list-group listaGestionGosst'>";
			funcionalidadesAccidente.forEach(function(val1,index1){
				menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionAccid("+index1+")'>"+val1.nombre+" </li>"
			});
			menuOpcion+="</ul>";
			var textReco="";
			var fechaAuxAcc=val.fecha.substring(0,10).split("-");
			var textIn =
			"<div class='eventoGeneral' style='border-left: 7px solid "+colorIn+";'>" +
					"<div id='tituloEvento'>" + 
				"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccid(this,"+index+")'>" +
					"Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
				"</a>"+
				menuOpcion+
				"<div style='font-weight:600;font-size:15px'>"+val.accidenteTipoNombre+" - "+val.accidenteSubTipoNombre+"</div>" +
				"<div ><i class='fa fa-calendar-plus-o' aria-hidden='true'></i>&nbspFecha Ocurrencia: "+fechaAuxAcc[2]+"-"+fechaAuxAcc[1]+"-"+fechaAuxAcc[0]+ "</div>" +
				"<div ><i class='fa fa-indent' aria-hidden='true'></i>&nbspUnidad: "+val.unidadNombre+ "</div>" +
			
				//"<div  >"+"    <a class='btn btn-success' onclick='verDetalleAccidenteMovil("+index+")'><i class='fa fa-list'></i>Detalle</a>"+"</div>" +
				//"<br>"+
				//"<div  >"+"<a class='btn btn-success' onclick='verAccionesAccidenteMovil("+index+")'><i class='fa fa-eye'></i>Ver Acciones ("+val.numAccionesCompletas+" / "+val.numAcciones+") </a>    </div>" +
				 "<div class='divMovilHistorialTrabajador' id='detalleAccionAccidente"+val.accidenteId+"' class=''></div>"+
			"</div>" +
			"</div>"; 
			switch(val.numAcciones){
			case 0:
				contenidoSinRevisar+=textIn;
				sinRevisarNum++;
				break;
			default:
				contenidoRevisar+=textIn;
				revisarNum++;
				
				break;
			}
			 
		});  
		var listPaneles=[
		                 {id:"divSinRevisar",nombre:"Reportes por atender ("+sinRevisarNum+")<br><h5>Sin acciones de mejora planificadas</h5>",contenido:contenidoSinRevisar} ,
		                 {id:"divRevisado",nombre:"Reportes atendidos ("+revisarNum+")<br><h5>Con 1 o más acciones de mejora</h5>",contenido:contenidoRevisar}
		                 ]
		agregarPanelesDivPrincipalColaborador(listPaneles); 
		$(".listaGestionGosst").hide();
	}); 
}

var indexFunctAccEval;
function toggleMenuOpcionAccidentEval(obj,pindex,menu)
{ 
	indexFunctAccEval=pindex;       
	$(obj).parent(".containerEval"+menu+pindex).find("ul").toggle();
	$(obj).parent(".containerEval"+menu+pindex).siblings().find("ul").hide();
	switch (menu) {
	case "SinEvaluar": 
		$(".containerEvalEvaluar"+pindex+" .listaGestionGosst").hide();
		break;
	case "Evaluar":
		$(".containerEvalSinEvaluar"+pindex+" .listaGestionGosst").hide(); 
		break;
	default:
		break;
	}
}

var funcionalidadOpcAccidentEval=[
    {menu:"SinEvaluar",opcion:[
		{id:"opcOcurrir",nombre:"<i class='fa fa-check'></i> Puede ocurrir en mi área",functionClick:function(data){
		    mensajeUx = "<label>¿Está seguro de que puede ocurrir este evento en su área?</label>";
			mensajesUx(mensajeUx,3,"","AccAreOcurrir");

       		$("#btnDevolverValorAccAreOcurrir").on("click",function(){
		    	mostrarFormulario = 1;evaluarAccidenteOcurrido(1,indexFunctAccEval);
			});}},
		{id:"opcNoOcurrir",nombre:"<i class='fa fa-times'></i> No puede ocurrir en mi área",functionClick:function(data){
			mensajeUx = "<label>¿Está seguro de que no puede ocurrir este evento en su área?</label>";
     		mensajesUx(mensajeUx,3,"","AccAreNoOcurrir");

			$("#btnDevolverValorAccAreNoOcurrir").on("click",function(){
     		    evaluarAccidenteOcurrido(0,indexFunctAccEval);
     		});}}]},
   {menu:"Evaluar",opcion:[{id:"opcAgregarEsc",nombre:"<i class='fa fa-plus'></i> Agregar Escenario",functionClick:
			      function(data){ 
			         mostrarFormulario = 0;
			         agregarEscenarioAcci();
			      }
			   }
		          ]},
   {menu:"Escenario",opcion:[{id:"opcAgregarAccMejo",nombre:"<i class='fa fa-plus'></i> Agregar Acción de Mejora",functionClick:
				function(data){ 
			           mostrarFormulario = 0;
				   agregarAccionMejoraEscenario();
				}
			     }
		            ]},
   {menu:"AccionMejora",opcion:[{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
				   function(data){ 
				      editarAccionMejoraEscenario();
				   }
			        },
			        {id:"opcEditar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",functionClick:
				   function(data){ 
					eliminarAccionMejoraEscenario();
				   }
			        }
		               ]},
   {menu:"Evaluar",opcion:[{id:"opcAgregarEsc",nombre:"<i class='fa fa-plus'></i> Agregar Escenario",functionClick:
			      function(data){ 
       				 mostrarFormulario = 0;
			         agregarEscenarioAcci();
			      }
			   },
                           {id:"opcCompletarInforme",nombre:"<i class='fa fa-files-o'></i> Completar informe",functionClick:
			      function(data){ 
			         completarInformeAccidenteColaborador();
			      }
			   },
			   {id:"opDescargarInforme",nombre:"<i class='fa fa-download'></i> Descargar informe",functionClick:
			      function(data){ 
				 window.open(URL+ "/accidente/informe/accidente?accidenteId="
						+ listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId 
						+"&tipoAccidenteId="
						+listFullAccidenteEval[indexFunctAccEval].accidente.accidenteTipoId);	
			      }
			   }
		          ]},		 
];

function marcarSubOpcionAcciEval(pindex,pindex1,menu){  

   $(".containerEval"+menu+indexFunction+" .listaGestionGosst").hide(); 
   funcionalidadOpcAccidentEval[pindex].opcion[pindex1].functionClick();
}

var menuOpcionAccidentEval=[];

function ListarOpcionesAccidenteEval(idpindex){
    
   funcionalidadOpcAccidentEval.forEach(function(val1,index1){
      var menu=val1.menu;
      var opciones=val1.opcion;
      menuOpcionAccidentEval[index1]="<ul class='listaGestionGosst list-group ' style='margin-top:20px;display:none;'>";
		
      opciones.forEach(function(val2,index2){
         menuOpcionAccidentEval[index1]+="<li id='"+val2.id+menu+idpindex+"'style=' top:-18px;'class='list-group-item' onclick='marcarSubOpcionAcciEval("+index1+","+index2+",\""+menu+"\")'>"+val2.nombre+"</li>";
      });
		
      menuOpcionAccidentEval[index1]+="</ul>";
   }); 
}

function habilitarAccidentesPorEvaluar(){
    $(".divListPrincipal > div").remove();

	var listPaneles = [];
	
    // var listPaneles=[
	//     {id:"divReportarAcc",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
	// 	 nombre:"Nuevo Reporte"+"<br><h5>Se enviará correo a administrador y a Supervisores, Jefes y Gerentes de área</h5>",contenido:""},
	// 	{id:"divFiltroAccidente",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroAccidentes()",btnIconoAux:"fa-filter",
	// 	 btnTitleAux:"Ver valores del filtro para aplicarlo a esta sección.",nombre:"Filtro",contenido:""},
	// 	{id:"divSinContenido",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"fa-hand-o-left",btnTitleAux:"",nombre:"Sin opciones disponibles",contenido:""},
	// 	{id:"divSinEvaluar",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// 	{id:"divEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// 	{id:"divFlashEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// 	{id:"divConsolidadoAccidentes",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// ];
	//
    // if(numComiteCsst == 0){
    //     listPaneles=[
	// 		{id:"divFiltroAccidente",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroAccidentes()",btnIconoAux:"fa-filter",
	// 		 btnTitleAux:"Ver valores del filtro para aplicarlo a esta sección.",nombre:"Filtro",contenido:""},
    //         {id:"divSinEvaluar",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
    //         {id:"divEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
    //         {id:"divFlashEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
    //         {id:"divConsolidadoAccidentes",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// 	];
    // }
	//
    // if(numAreasResponsable == 0){
    //     listPaneles=[
	//         {id:"divFlashEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""},
	// 	];
    // }

	if(numComiteCsst > 0 && numAreasResponsable > 0){
		listPaneles.push({id:"divReportarAcc",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
			nombre:"Nuevo Reporte"+"<br><h5>Se enviará correo a administrador y a Supervisores, Jefes y Gerentes de área</h5>",contenido:""});
	}

	if(numAreasResponsable > 0 || parseInt(getSession("gestopcompanyid")) != 336){
		listPaneles.push({id:"divFiltroAccidente",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verFiltroAccidentes()",btnIconoAux:"fa-filter",
			btnTitleAux:"Ver valores del filtro para aplicarlo a esta sección.",nombre:"Filtro <div id='divAuxValor'></div>",contenido:""});
	}

	if(numAreasResponsable > 0){
		listPaneles.push({id:"divSinEvaluar",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""});
	}

	if(numAreasResponsable > 0){
		listPaneles.push({id:"divEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""});
	}

	if(parseInt(getSession("gestopcompanyid")) != 336){
		listPaneles.push({id:"divFlashEvaluados",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""});
	}

	if(numAreasResponsable > 0){
		listPaneles.push({id:"divConsolidadoAccidentes",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"",contenido:""});
	}

	if(listPaneles.length == 0){
		listPaneles.push({id:"divSinContenido",clase:"divIniciales",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"fa-hand-o-left",btnTitleAux:"",nombre:"Sin opciones disponibles",contenido:""});
	}

	agregarPanelesDivPrincipalVersionTres(listPaneles);
				
    // if(parseInt(getSession("gestopcompanyid")) == 336){
    //     $("#divFlashEvaluados").remove();
    // }
				
    var btnConsolidado = "<button onclick='verTablaConsolidadoAccidentes()' class='btn btn-success'>" +
		    "<i class='fa fa-2x fa-arrow-right'></i>" +
		"</button>";
				
   	$("#divConsolidadoAccidentes .tituloSubList").html("<i aria-hidden='true' class='fa fa-table'></i> Ver Consolidado "+btnConsolidado);
				
    // cargarAccidentesPorEvaluar();
	crearFiltroAccidentes(valoresFiltroAccidentes);
}

function volverVistaAccidentes(){
	$("#divAccidenteResponsableTabla").remove();
	
	$(".divContainerGeneral").show(); 
	$(".divListPrincipal > div").show();
	 
	$(".divTituloGeneral h4").html(tituloAnteriorColaborador)
}
function iniciarFiltroAccidentesResponsable(){
	$(".camposFiltroTabla").show();
	$("#wrapperConsolidadoAccidentesResponsable").hide();
	
	$("#btnIniciarFiltro").hide();
	$("#btnAplicarFiltro").show();
}
var listFullAccidentesConsolidado = [];
function verTablaConsolidadoAccidentes(){
	 $(".divContainerGeneral").hide();  
	var buttonVolver="<button type='button' id='btnVolverDetalle' class='btn btn-success ' style='margin-right:10px'" +
			" onclick='volverVistaAccidentes()'>" +
						"<i class='fa fa-sign-out fa-rotate-180'></i>Volver</button>";
	var buttonFiltro="<button type='button' class='btn btn-info ' id='btnIniciarFiltro' style='margin-right:10px'" +
	" onclick='iniciarFiltroAccidentesResponsable()'>" +
				"<i class='fa fa-filter'></i>Ver filtros</button>";
	var buttonFiltroAplicar="<button type='button' class='btn btn-info ' id='btnAplicarFiltro' style='margin-right:10px'" +
	" onclick='aplicarFiltroAccidenteResponsable()'>" +
				"<i class='fa fa-filter'></i>Aplicar filtros</button>";
	var buttonFiltroRefresh="<button type='button' class='btn btn-success ' id='btnReiniciarFiltro' style='margin-right:10px'" +
	" onclick='reiniciarFiltroAccidenteResponsable()'>" + 
				"<i class='fa fa-refresh'></i>Refresh</button>";
	$("body").append(
			"<div id='divAccidenteResponsableTabla' style='padding-left: 40px;'>" +
			"<form class='form-inline' id='formBtnGeneral'>"+
			buttonVolver+
			buttonFiltroRefresh+buttonFiltroAplicar+buttonFiltro+"</form>"+
			
			"<div class='camposFiltroTabla' style='width : 500px ; max-width: 100%'>"+
			 
					"<div class='contain-filtro' id=''>" +
					
					"<label for=''  >Fecha Inicio "+
					"</label>" +
					"<div id=''> <input type='date' class='form-control' id='fechaInicioFiltroAccidente'>" +
					"</div>" + 
				"</div>"+
				"<div class='contain-filtro' id=''>" +
				
				"<label for=''  >Fecha Fin "+
				"</label>" +
				"<div id=''> <input type='date' class='form-control' id='fechaFinFiltroAccidente'>" +
				"</div>" + 
			"</div>"+
				  //
			"<div class='contain-filtro' id='filtroAreaAccidenteResponsable'>" +
			
			"<label for='filtroAreaAccidenteResponsable'  > Área"+
			"</label>" +
			"<div id='divSelectAreaFiltroAccidenteResponsable'> " +
			"</div>" + 
		"</div>"+
				" </div>" +
				"<small >Para visualizar accidentes de otras áreas, modificar el filtro</small>"+
				
				 
				 
				"<div class='wrapper' id='wrapperConsolidadoAccidentesResponsable'>" +
			"<table  style='min-width: 100% ' " +
			"id='tblConsolidadoAccidente' class='table table-striped table-bordered table-hover table-fixed'>" +
			"<thead>" +
				 "<tr>" +
				 "<td class='tb-acc' style='width : 180px' >Fecha reporte</td>" +
				 "<td class='tb-acc' style='width : 180px' >Descripción Accidente</td>" +
				 "<td class='tb-acc' style='width : 200px' >"+getSession("gestopdivision")+"</td>" +
				 "<td class='tb-acc' style='width : 200px' >"+getSession("gestoparea")+"</td>" +
				 "<td class='tb-acc' style='width : 180px' >Evaluación</td>" +
				 "<td class='tb-acc' style='width : 180px' >N° escenario</td>" +
				 "<td class='tb-acc' style='width : 220px' >Actividad</td>" +
				 "<td class='tb-acc' style='width : 220px' >Peligro</td>" +
				 "<td class='tb-acc' style='width : 220px' >Riesgo</td>" +
				 "<td class='tb-acc' style='width : 220px' >N° acción mejora</td>" +
				 "<td class='tb-acc' style='width : 220px' >Clasificación</td>" +
				 "<td class='tb-acc' style='width : 220px' >Descripción</td>" +
				 "<td class='tb-acc' style='width : 220px' >Fecha de registro</td>" +
				 "<td class='tb-acc' style='width : 220px' >Responsable</td>" +
				 "<td class='tb-acc' style='width : 220px' >Evidencia</td>" + 
				 
				 "</tr>"+
			"</thead>" +
			"<tbody></tbody>" +
			"</table>" +
			"</div>" +
			" </div>");

	 
	reiniciarFiltroAccidenteResponsable();
	$("#btnAplicarFiltro").hide(); 
	  $("#divTrabActosResponsable form").on("submit",function(e){
			e.preventDefault(); 
		}); 
	  tituloAnteriorColaborador=$(".divTituloGeneral h4").text();
		$(".divTituloGeneral h4").html("Consolidado de accidentes");
		resizeDivWrapper("wrapperConsolidadoAccidentesResponsable",300);
		cargarConsolidadoAccidentesColaborador()
}
function reiniciarFiltroAccidenteResponsable(){
	 
	$(".camposFiltroTabla").show();
	var hoy= obtenerFechaActual();
	$("#fechaInicioFiltroAccidente").val(sumaFechaDias(-365,hoy));
	$("#fechaFinFiltroAccidente").val(hoy);
	var areaTodos = [{areaId : 0,areaName : "TODAS"}];
	
	crearSelectOneMenuObligUnitarioCompleto
	 ("selAreaAccidenteFiltro", "",areaTodos.concat(listFullAreasResponsable), "areaId","areaName",
			 "#divSelectAreaFiltroAccidenteResponsable","Todos");
	
	 
	aplicarFiltroAccidenteResponsable();
}
function aplicarFiltroAccidenteResponsable(){
	$(".camposFiltroTabla").hide();
	$("#wrapperConsolidadoAccidentesResponsable").show();
	
	$("#btnIniciarFiltro").show();
	$("#btnAplicarFiltro").hide();
	
	cargarConsolidadoAccidentesColaborador();
}
function cargarConsolidadoAccidentesColaborador(){
	var areaId = $("#selAreaAccidenteFiltro").val();
	var areaObj = null;
	if(parseInt(areaId) > 0){
	    areaObj = {areaId : areaId};
	}
	var fechaInicioFiltro = convertirFechaTexto($("#fechaInicioFiltroAccidente").val() );
	var fechaFinFiltro = convertirFechaTexto($("#fechaFinFiltroAccidente").val() );
	var dataParam2={
			trabajadorId : parseInt(getSession("trabajadorGosstId")),
			mdfId : getSession("unidadGosstId"),
			empresaId : getSession("gestopcompanyid") ,
			area : areaObj,
			
			fechaInicioFiltro : fechaInicioFiltro,
			fechaFinFiltro : fechaFinFiltro,
	}
	
	callAjaxPost(URL + '/accidente/colaborador/evaluar/consolidado', dataParam2,function(data){
		listFullAccidentesConsolidado = data.list;
		$("#tblConsolidadoAccidente tbody tr").remove();
		listFullAccidentesConsolidado.forEach(function(val){
			var listEscenarios = val.escenarios;
			var textoReplicar ="";
			if(val.replicar == null){
				textoReplicar = iconoGosst.por_realizar+" Sin evaluar";
			}else if(val.replicar == 1){
				textoReplicar = iconoGosst.aprobado+" Puede ocurrir";
			}else if(val.replicar == 0){
				textoReplicar = iconoGosst.aprobado+" No puede ocurrir";
			}
			if(val.escenarios == 0){
				$("#tblConsolidadoAccidente tbody")
				.append("<tr>" +
						"<td>"+val.accidente.fecha+"</td>" +
						"<td>"+val.accidente.accidenteDescripcion+"</td>" +
						"<td>"+val.areaEvaluada.divisionName +"</td>" +
						"<td>"+val.areaEvaluada.areaName+"</td>" +
						"<td>"+textoReplicar+"</td>" +
						"<td>"+(0)+"</td>" +
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"<td>"+"--"+"</td>" + 
						"" +
						"</tr>");
			}else{
				listEscenarios.forEach(function(val1,index1){
				    if(val1.acciones.length == 0){
					$("#tblConsolidadoAccidente tbody")
					.append("<tr>" +
							"<td>"+val.accidente.fecha+"</td>" +
							"<td>"+val.accidente.accidenteDescripcion+"</td>" +
							"<td>"+val.areaEvaluada.divisionName +"</td>" +
							"<td>"+val.areaEvaluada.areaName+"</td>" +
							"<td>"+textoReplicar+"</td>" +
							"<td>"+(index1+1)+"</td>" +
							"<td>"+val1.actividad+"</td>" + 
							"<td>"+val1.peligro+"</td>" + 
							"<td>"+val1.riesgo+"</td>" + 
							"<td> "+0+"</td>" + 
							"<td>"+"--"+"</td>" + 
							"<td>"+"--"+"</td>" + 
							"<td>"+"--"+"</td>" + 
							"<td>"+"--"+"</td>" + 
							"<td>"+"--"+"</td>" + 
							"</tr>");
				    }else{
					 val1.acciones.forEach(function(val2,index2){
					     $("#tblConsolidadoAccidente tbody")
						.append("<tr>" +
								"<td>"+val.accidente.fecha+"</td>" +
								"<td>"+val.accidente.accidenteDescripcion+"</td>" +
								"<td>"+val.areaEvaluada.divisionName +"</td>" +
								"<td>"+val.areaEvaluada.areaName+"</td>" +
								"<td>"+textoReplicar+"</td>" +
								"<td>"+(index1+1)+"</td>" +
								"<td>"+val1.actividad+"</td>" + 
								"<td>"+val1.peligro+"</td>" + 
								"<td>"+val1.riesgo+"</td>" + 
								
								"<td> "+(index2+1)+"</td>" + 
								"<td>"+val2.clasificacion.nombre+"</td>" + 
								"<td>"+val2.descripcion+"</td>" + 
								"<td>"+(val2.fechaRevision ==null?val2.fechaRealTexto:val2.fechaRevisionTexto)+"</td>" + 
								"<td>"+val2.responsableNombre+"</td>" + 
								"<td>"+"<a target='_blank' class='efectoLink' " +
								"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+
								val2.accionMejoraId+"'>"+val2.evidenciaNombre+"</a>"+"</td>" + 
								"</tr>");
					 });
				    }
				   
					
				});
			}
			
			$("#tblConsolidadoAccidente tbody tr:last").css({"border-bottom":"2px solid black"});
		});
		
	});
}
/**
function verAccionesEscenarioConsolidadoTest(escenarioId){
	var contenido ="<div class='wrapper' id='wrapperConsolidadoAccionesResponsable'>" +
	"<table  style='min-width: 100% ' " +
	"id='tblConsolidadoAcciones' class='table table-striped table-bordered table-hover table-fixed'>" +
	"<thead>" +
		 "<tr>" +
		 "<td class='tb-acc' style='width : 180px' >Clasificación</td>" +
		 "<td class='tb-acc' style='width : 180px' >Descripción</td>" +
		 "<td class='tb-acc' style='width : 180px' >Fecha de registro</td>" +
		 "<td class='tb-acc' style='width : 180px' >Responsable</td>" +
		 "<td class='tb-acc' style='width : 180px' >Evidencia</td>" +
		 
		 "</tr>"+
	"</thead>" +
	"<tbody></tbody>" +
	"</table>" +
	"</div>" ;
	var listPaneles=
	 {id:"asd",nombre:"Acciones de mejora del escenario",clase:"",contenido:contenido}
            ;
	agregarModalPrincipalColaborador(listPaneles,function(){
		 
	});
	$("#asd .modal-dialog").css({"width":"90%","max-width":"100%"})
	 
		 var escenarioObj = {};
	listFullAccidentesConsolidado.forEach(function(val1){
	    val1.escenarios.forEach(function(val){
		if(val.id == parseInt(escenarioId)){
			escenarioObj = val;
		    }
	    })
	})
	 
		var asd = escenarioObj.acciones;
		asd.forEach(function(val){
			$("#tblConsolidadoAcciones tbody").append("<tr>" +
					"<td>"+val.clasificacion.nombre+"</td>"+
					"<td>"+val.descripcion+"</td>"+
					"<td>"+(val.fechaRevision ==null?val.fechaRealTexto:val.fechaRevisionTexto)+"</td>"+
					"<td>"+val.responsableNombre+"</td>"+
					"<td>"+"<a target='_blank' class='efectoLink' " +
							"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+
							val.accionMejoraId+"'>"+val.evidenciaNombre+"</a>"+"</td>"
					)
		})
	 

}

function verAccionesEscenarioConsolidado(escenarioId){
	var contenido ="<div class='wrapper' id='wrapperConsolidadoAccionesResponsable'>" +
	"<table  style='min-width: 100% ' " +
	"id='tblConsolidadoAcciones' class='table table-striped table-bordered table-hover table-fixed'>" +
	"<thead>" +
		 "<tr>" +
		 "<td class='tb-acc' style='width : 180px' >Clasificación</td>" +
		 "<td class='tb-acc' style='width : 180px' >Descripción</td>" +
		 "<td class='tb-acc' style='width : 180px' >Fecha de registro</td>" +
		 "<td class='tb-acc' style='width : 180px' >Responsable</td>" +
		 "<td class='tb-acc' style='width : 180px' >Evidencia</td>" +
		 
		 "</tr>"+
	"</thead>" +
	"<tbody></tbody>" +
	"</table>" +
	"</div>" ;
	var listPaneles=
	 {id:"asd",nombre:"Acciones de mejora del escenario",clase:"",contenido:contenido}
                ;
	agregarModalPrincipalColaborador(listPaneles,function(){
		 
	});
	$("#asd .modal-dialog").css({"width":"90%","max-width":"100%"})
	callAjaxPost(URL+"/gestionaccionmejora/accionmejora",
			{accionMejoraTipoId : 2,
		escenarioId : escenarioId},function(data){
		 
		var asd = data.list;
		asd.forEach(function(val){
			$("#tblConsolidadoAcciones tbody").append("<tr>" +
					"<td>"+val.clasificacion.nombre+"</td>"+
					"<td>"+val.descripcion+"</td>"+
					"<td>"+(val.fechaRevision ==null?val.fechaRealTexto:val.fechaRevisionTexto)+"</td>"+
					"<td>"+val.responsableNombre+"</td>"+
					"<td>"+"<a target='_blank' class='efectoLink' " +
							"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+
							val.accionMejoraId+"'>"+val.evidenciaNombre+"</a>"+"</td>"
					)
		})
	});

}
**/

var listFullAreasResponsable = [];

function cargarAccidentesPorEvaluar(){
	console.log($("#fechaInicioOcurrenciaAcc").val());
	console.log($("#fechaFinOcurrenciaAcc").val());

	$("#divAuxValor").html("(desde "+convertirFechaNormal($("#fechaInicioOcurrenciaAcc").val())+" hasta "+convertirFechaNormal($("#fechaFinOcurrenciaAcc").val())+")");

	var dataParam2={
		trabajadorId:parseInt(getSession("trabajadorGosstId")),mdfId:parseInt(getSession("unidadGosstId")),
		empresaId:parseInt(getSession("gestopcompanyid")),fechaOcurrenciaInicioFiltro:$("#fechaInicioOcurrenciaAcc").val(),
		fechaOcurrenciaFinFiltro:$("#fechaFinOcurrenciaAcc").val()
	};

	callAjaxPost(URL+'/accidente/colaborador/evaluar',dataParam2,function(data){
		if(data.CODE_RESPONSE == "05"){
			listFullAreasResponsable = data.areasTotal;
			listClasificacionAccionEscenarioColaborador = data.clasificacionAccion;
			listFullAccidenteEval = data.list;
			listFullAccidenteFlash = data.accidentesFlash;
					
			idMaxAccAreaActual= data.idMaxAccAreaActual;idMaxAccEscenarioActual = data.idMaxAccEscenarioActual;

			var contenidoEvaluado= "",contenidoSinEvaluar= "",contenidoFlash= "";
			var textoEvalTodo= "",textoSinEvalTodo= "",textoFlashTodo= "";
			var evalNum= 0,sinEvalNum= 0,flashNum= 0;

			listFullAccidenteFlash.forEach(function(val,index){
				var btnDescarga = (val.evidenciaNombre == "----" || val.evidenciaNombre == ""?"Sin Asignar":
					"<a target='_blank' href='"+URL+"/accidente/evidencia?accidenteId="+val.accidenteId+"' class='efectoLink'>" +
					    "<i class='fa fa-download'></i> Descargar" +
					"</a>");

				var listItemsFormSinEval=[
					{sugerencia:"",label:"<i class='fa fa-info'></i> Descripción:",inputForm: val.accidenteDescripcion+" ",divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha de Ocurrencia: ",inputForm: val.fechaTexto+" "+val.horaTexto,divContainer:""},
					{sugerencia:" ",label:"<i class='fa fa-indent'></i> Unidad: ",inputForm:val.unidadNombre,divContainer:""},
					{sugerencia:" ",label:"<i class='fa fa-indent'></i> Lugar (Área): ",inputForm:val.areaOcurrio.areaName,divContainer:""},
					{sugerencia:" ",label:"<i class='fa fa-user'></i> Supervisor registró: ",inputForm:val.trabajadorRegistra.nombre,divContainer:""},
					{sugerencia:" ",label:"<i class='fa fa-picture-o'></i>Evidencia: ",inputForm:btnDescarga,divContainer:""},
					{sugerencia:" ",label:"<i class='fa fa-list'></i> Avance de acciones: ",inputForm:val.numAccionesColaboradorCompletas+" / "+val.numAccionesColaboradorTotal,divContainer:""},
				];

				var textoFlash= "",colorIn="#c9c6c6";

				listItemsFormSinEval.forEach(function(val,index){
					textoFlash += obtenerSubPanelModulo(val);
				});

				textoFlashTodo += "<div id='divAccFlash"+val.accidenteId+"'>"+
					    "<div class='detalleAccion gosst-neutral' style='border-left: 7px solid "+colorIn+";'>" +
					        "<div id='tituloEvento'>" +
					          //"<div class='' style=''>" +
					              //"<section class='containerEvalSinEvaluar"+index+"'>" +
					                  //"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccidentEval(this,"+index+",\"SinEvaluar\");'>" +
					                      //"Calificar evento <i class='fa fa-angle-double-down'></i>" +
					                  //"</a>"+menuOpcionAccidentEval[0]+
					              //"</section>"+
					          //"</div>"+
					            "<div class='row'>" +
					                "<section class='col col-xs-9'>" +
					                    "<strong>"+val.accidenteTipoNombre+" - "+val.accidenteSubTipoNombre+"</strong>"+
					                "</section>"+
					            "</div>"+
					             textoFlash+
					        "</div>" +
					    "</div>" +
					"</div>";

				flashNum++;
						
			});

			listFullAccidenteEval.forEach(function(val,index){
				ListarOpcionesAccidenteEval(index);

				var colorFondo="gray",colorIn="#c9c6c6";

				var btnDescarga = (val.accidente.evidenciaNombre =="----" || val.accidente.evidenciaNombre ==""?"Sin asignar":
					"<a target='_blank' href='"+URL+"/accidente/evidencia?accidenteId="+val.accidente.accidenteId+"' class='efectoLink'>" +
					    "<i class='fa fa-download'></i>Descargar" +
					"</a>");

				var listItemsFormSinEval=[
					{sugerencia:"",label:"<i class='fa fa-indent'></i> Área donde podría ocurrir:",inputForm:val.areaEvaluada.areaName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-info'></i> Descripción:",inputForm: val.accidente.accidenteDescripcion+" ",divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha de Ocurrencia:",inputForm: val.accidente.fecha,divContainer:""},
				  //{sugerencia:"",label:"<i class='fa fa-indent'></i> Mi Unidad: ",inputForm:val.areaEvaluada.matrixName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-user'></i> Supervisor registró:",inputForm:val.accidente.trabajadorRegistra.nombre,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-user'></i>Área asociada:",inputForm:val.accidente.areaOcurrio.areaName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-picture-o'></i>Evidencia:",inputForm:" "+btnDescarga,divContainer:""},
				];
						
				var listItemsFormEval=[
				    {sugerencia:"",label:"<i class='fa fa-indent'></i> Área donde podría ocurrir:",inputForm:val.areaEvaluada.areaName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-info'></i> Descripción:",inputForm:val.accidente.accidenteDescripcion+" ",divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-calendar'></i>  Fecha de Ocurrencia:",inputForm: val.accidente.fecha,divContainer:""},
				  //{sugerencia:"",label:"<i class='fa fa-indent'></i> Mi Unidad:",inputForm:val.areaEvaluada.matrixName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-user'></i> Supervisor registró:",inputForm:val.accidente.trabajadorRegistra.nombre,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-user'></i>Área asociada:",inputForm:val.accidente.areaOcurrio.areaName,divContainer:""},
					{sugerencia:"",label:"<i class='fa fa-picture-o'></i>Evidencia:",inputForm:""+btnDescarga,divContainer:""},
					{sugerencia:"",label:"<i class='fa "+(val.replicar == 1?"fa-check":"fa-times")+"' style='color:"+(val.replicar==1?"#9BBB59":"#C0504D")+"'>" +
					 "</i>"+(val.replicar == 1?" Puede":" No Puede")+" Ocurrir en mi área",inputForm:"",divContainer:""},
					{sugerencia:"",label:val.replicar == 1?"<a class='efectoLink' onclick='verEscenario("+index+")'>" +
					     "Ver Escenarios ("+val.escenarioNum+") <i class='fa fa-angle-double-down'></i></a>":"",inputForm:"",divContainer:""}
				];
						
				var textoSinEval= "",textoEval= "";

				if(val.replicar == null){//no evaluado
					listItemsFormSinEval.forEach(function(val,index){
						textoSinEval+=obtenerSubPanelModulo(val);
					});

					textoSinEvalTodo += "<div id='sinEvaluar"+index+"'>"+
						    "<div class='detalleAccion gosst-neutral' style='border-left: 7px solid "+colorIn+";'>" +
						        "<div id='tituloEvento'>" +
									"<div class='' style=''>" +
										"<section class='containerEvalSinEvaluar"+index+"'>" +
											"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccidentEval(this,"+index+",\"SinEvaluar\");'>" +
											    "Calificar evento <i class='fa fa-angle-double-down'></i>" +
											"</a>"+menuOpcionAccidentEval[0]+
										"</section>"+
									"</div>"+
									"<div class='row'>" +
										"<section class='col col-xs-9'>" +
											"<strong>"+val.accidente.accidenteTipoNombre+" - "+val.accidente.accidenteSubTipoNombre+"</strong>"+
										"</section>"+
									"</div>"+
									"<br>"+textoSinEval+
								"</div>" +
							"</div>" +
						"</div>";

					sinEvalNum++;
				}else if(val.replicar == 1 || val.replicar == 0){//si o no ocurre
					listItemsFormEval.forEach(function(val,index){
						textoEval += obtenerSubPanelModulo(val);
					});

					var opciones = menuOpcionAccidentEval[1];

					if(getSession("trabajadorGosstId") == val.accidente.trabajadorRegistra.trabajadorId){
						opciones = menuOpcionAccidentEval[4];
					}

					textoEvalTodo += "<div class='' id='evaluado"+index+"'>"+
						    "<div class='detalleAccion gosst-neutral' style='border-left: 7px solid "+colorIn+";'>" +
								"<div id='tituloEvento'>" +
								    (val.replicar == 1?"<div class='' style=''>" +
										"<section class='containerEvalEvaluar"+index+"'>" +
									 		"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionAccidentEval(this,"+index+",\"Evaluar\");'>" +
									 			"Ver Opciones <i class='fa fa-angle-double-down'></i>" +
									 		"</a>"+opciones+
									 	"</section>"+
									"</div>":"")+
									"<div class='row'>" +
										"<section class='col col-xs-9'>" +
											"<strong>"+val.accidente.accidenteTipoNombre+" - "+val.accidente.accidenteSubTipoNombre+"</strong>"+
										"</section>"+
									"</div>"+
								 	 textoEval+
								"</div>" +
							"</div>"+
							(val.replicar == 1?"<div class='subOpcionAccion' style='display:none;'></div>":"")+
						"</div>";

					evalNum++;
				}
			});

			var listTipoAccidente=[],listSubTipoAccidente=[],listClasificacionAccidente=[];

			listTipoAccidente = data.tipo;
			listSubTipoAccidente = data.clasificacionIncap;
			listClasificacionAccidente = data.clasificacion;
			listRiesgosEscenario = data.riesgos;
			listAreaAccidenteColaborador = data.areasTotal;

			var selTipoAccidente= crearSelectOneMenuOblig("selTipoAccidente","verAcuerdoTipoAccidenteColaborador()",
				listTipoAccidente,"","id","nombre");

			var selSubTipoAccidente= crearSelectOneMenuOblig("selSubTipoAccidente","verAcordeTipoIncapacitanteColaborador()",
				listSubTipoAccidente,"","id","nombre");

			var selClasAccidente= crearSelectOneMenuOblig("selClasAccidente","",
				listClasificacionAccidente,"","id","nombre");

			var listItemsFormTrab=[
				{sugerencia:"",label:"Fecha reporte *",inputForm:"<input  class='form-control' type='date' id='dateInciProy' placeholder=''>" } ,
				{sugerencia:"",label:"Tipo *",inputForm:selTipoAccidente},
				{sugerencia:"",label:"Sub-Tipo *",inputForm:selSubTipoAccidente,divContainer:"divSelSubTipo"},
				{sugerencia:"",label:"Nivel Incapacitante *",inputForm:selClasAccidente,divContainer:"divNivIncap"},
				{sugerencia:"",label:"Ocurrencia *",inputForm:"<input class='form-control' id='inputDescIncProy' placeholder=''>"},
			//  {sugerencia:"",label:"Lugar *",inputForm:"<input class='form-control' id='inputLugarIncProy'>"},
				{sugerencia:"",label:"Lugar (Área)*",inputForm:"",divContainer: "divAreaAccColaborador"},
				{sugerencia:"",label:"Evidencia",divContainer:"eviInciProy"},
				{sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'><i aria-hidden='true' class='fa fa-floppy-o'></i>Guardar</button>"}
			];

			var textFormTrabajador="";

			listItemsFormTrab.forEach(function(val,index){
				textFormTrabajador+=obtenerSubPanelModulo(val);
			});

			$("#liMenuTrabajador13 .alertaMenu").html(sinEvalNum);

			var textoBtn="<button class='btn btn-success'  onclick='cambiarDivSubContenidoColaborador(this)'>" +
					"<i class='fa fa-caret-down fa-3x' aria-hidden='true'></i>" +
				"</button>";

			$("#divReportarAcc .contenidoSubList").html("<form id='formEditarIncidenteProy' class='eventoGeneral'>"+textFormTrabajador+"</form>")

			$("#divSinEvaluar .contenidoSubList").html(textoSinEvalTodo);
			$("#divSinEvaluar .tituloSubList").html(textoBtn+"Reportes Sin Evaluar ("+sinEvalNum+")" +
				"<br>"+"<h5>Evaluar si puede ocurrir en el área</h5>");

			$("#divEvaluados .contenidoSubList").html(""+textoEvalTodo+"");
			$("#divEvaluados .tituloSubList").html(textoBtn+"Reportes Evaluados ("+evalNum+")" +
				"<br>"+"<h5>Se evaluó si puede ocurrir en el área</h5>" +
				"<h5>En caso el incidente pueda ocurrir en su área de trabajo, registrar los escenarios y acciones de mejora</h5>");

			$("#divFlashEvaluados .contenidoSubList").html(textoFlashTodo)
			$("#divFlashEvaluados .tituloSubList").html(textoBtn+"Reportes FLASH ("+flashNum+")<br>"+"<h5>Aprobados por administración</h5>")

			$("#divEvaluados .tituloSubList").css({"color":colorPuntajeGosst(1.0)+" !important"});
			$("#divSinEvaluar .tituloSubList").css({"color":colorPuntajeGosst(0.0)+" !important"});
					
			crearSelectOneMenuObligUnitarioCompleto("selAreaAccColaborador","",listFullAreasResponsable,"areaId","areaName",
				"#divAreaAccColaborador","Ninguno");

			$('#formEditarIncidenteProy').on('submit',function(e){
				e.preventDefault();
				guardarIncidenteColaborador();
			});

			verAcuerdoTipoAccidenteColaborador();verAcordeTipoIncapacitanteColaborador();

			var options={
				container:"#eviInciProy",functionCall:function(){},descargaUrl:"",
				esNuevo:true,idAux:"Incidente",evidenciaNombre:""
			};

			crearFormEvidenciaCompleta(options);
					 
			$(".listaGestionGosst").hide();
		}else{
			console.log("no cargo :''v");
		}
	});
}

var accidenteInformeId = null;
function completarInformeAccidenteColaborador(){
	accidenteInformeId = listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId;
	var selBooleanTerceros = crearSelectOneMenuOblig("selBooleanTerceros", "verAcordeBooleanTercero()", listBoolean, "1", "id","nombre")
	var listItemsTercero=[
	  	       			{sugerencia:"",label:"1. DATOS DE EMPLEADOR TERCERO",inputForm: "",divContainer:""},
		       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
		       			{sugerencia:" ",label:"Involucra a terceros",inputForm: selBooleanTerceros+"",divContainer:""},
		       			{sugerencia:" ",label:"Razón social o denominación social ",inputForm: "<input class='form-control' id='inputRazonTercero'>",divContainer:""},
	       			{sugerencia:" ",label:"RUC ",inputForm: "<input class='form-control' id='inputRucTercero'>",divContainer:""},
	       			{sugerencia:" ",label:"Domicilio (Dirección , distrito , departamento , provincia ) ",inputForm: "<input class='form-control' id='inputDireccionTercero'>",divContainer:""},
	       			{sugerencia:" ",label:"Tipo de actividad economica ",inputForm: "<input class='form-control' id='inputRubroTercero'>",divContainer:""},
	       			{sugerencia:" ",label:"N° de trabajadores en el centro laboral",inputForm: "<input type='number' class='form-control' id='inputTrabTercero'>",divContainer:""},
	       			{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success' > Siguiente <i class='fa fa-arrow-right'></i></button>",divContainer:""}
	       		];
   	var text="";
   	listItemsTercero.forEach(function(val,index)
   	{
   		text+=obtenerSubPanelModulo(val);
   	});
   	var contenidoTercero = "<form class='eventoGeneral' id='formInformeAccA'> "+text+"</form>";
	    	   	
	var listPaneles=
	 {id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenidoTercero}
                ;
	agregarModalPrincipalColaborador(listPaneles);
	$("#formInformeAccA").on("submit",function(e){
		e.preventDefault();
		var terceroNombre = $("#inputRazonTercero").val();
		var terceroRuc = $("#inputRucTercero").val();
		var terceroDireccion = $("#inputDireccionTercero").val();
		var terceroRubro = $("#inputRubroTercero").val();
		var tercerotrabOperacion = $("#inputTrabTercero").val();
		var dataParam = {
				terceroNombre : terceroNombre,
				terceroRuc : terceroRuc,
				terceroDireccion : terceroDireccion,
				terceroRubro : terceroRubro,
				tercerotrabOperacion : tercerotrabOperacion,
				accidenteId: listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId,
		}
		var tipoBoolTercero = parseInt($("#selBooleanTerceros").val());
		if(tipoBoolTercero == 1 && terceroNombre.trim().length == 0){alert("Razón social obligatoria"); return;}
		callAjaxPost(URL + '/accidente/detalle/tercero/save', dataParam,
				function (data){
			verSeccionInformeInvolucrados();
		});
	});
	var dataParam = {
			accidenteId: listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId,
			idCompany: getSession("gestopcompanyid"),
			inicioEmpresa:0
	};

	callAjaxPost(URL + '/accidente/detalle', dataParam,
			function (data){
		var accidenteDetalle = data.list;
		$("#inputRazonTercero").val(accidenteDetalle.terceroNombre);
		$("#inputRucTercero").val(accidenteDetalle.terceroRuc);
		$("#inputDireccionTercero").val(accidenteDetalle.terceroDireccion);
		$("#inputRubroTercero").val(accidenteDetalle.terceroRubro);
		$("#inputTrabTercero").val(accidenteDetalle.tercerotrabOperacion);
		var hasTercero =accidenteDetalle.terceroNombre ==""?0:1;
		$("#selBooleanTerceros").val(hasTercero);
		verAcordeBooleanTercero();
	});
}
var listTrabajadoresAccidenteColaborador = [];
var listTurnoTrabAcc = [];
function verSeccionInformeInvolucrados(){
	var listItems=[
		  	       			{sugerencia:"",label:"2. DATOS DE INVOLUCRADOS",
		  	       				inputForm: "<button type='button' id='btnAgregarTrabAcc' onclick='agregarTrabajadorInvolucradoAcc()' class='btn btn-success'>" +
		  	       						"<i class='fa fa-plus'></i>Agregar" +
		  	       						"</button>" +
		  	       						"" +
		  	       						"<button  type='button' id='btnCancelarTrabAcc' onclick='cancelarTrabajadorInvolucradoAcc()' class='btn btn-danger'>" +
		  	       						"<i class='fa fa-times'></i>Cancelar" +
		  	       						"</button>" +
		  	       						"" +
		  	       						"<button  type='button' id='btnGuardarTrabAcc' onclick='guardarTrabajadorInvolucradoAcc()' class='btn btn-success'>" +
		  	       						"<i class='fa fa-floppy-o'></i>Guardar" +
		  	       						"</button>",divContainer:""},
			       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
			       			{clase:"formLista",sugerencia:" ",label:"Involucra a ",inputForm: "",divContainer:"indicadorTrabsInterno"},
			       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
		  	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
		  	       						"</button>",divContainer:"divSiguiente"}
			       		];
	   	var text="";
	   	listItems.forEach(function(val,index)
	   	{
	   		text+=obtenerSubPanelModulo(val);
	   	});
	   	var contenido = "<form class='eventoGeneral' id='formInformeAccB'> "+text+"</form>";
		    	   	
		var listPaneles=
		 {id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

		agregarModalPrincipalColaborador(listPaneles);
		
		$("#formInformeAccB").on("submit",function(e){
				e.preventDefault();
				verSeccionInformeCircunstancias();
		});
		var dataParam ={
				trabajadoresId : getSession("trabajadorGosstId"),
				accidenteId:  accidenteInformeId,};
		callAjaxPost(URL + '/accidente/trabacc', dataParam, 
				function(data) {
			 var listTrabInvolucrados = data.list;
			listTrabajadoresAccidenteColaborador = data.trabajadores;
			listTurnoTrabAcc = data.turnos;
			 $("#indicadorTrabsInterno").html("Involucra a "+listTrabInvolucrados.length+" trabajador(es)")
			 listTrabInvolucrados.forEach(function(val,index){
				 var btnEliminar ="<button type='button' class='btn btn-danger' onclick='eliminarTrabAccColaborador("+val.trabAccidId+")'>" +
				 		"<i class='fa fa-trash'></i></button>";
				 var item = {clase:"formLista",sugerencia : "", label : btnEliminar+"Trabajador #"+(index+1)+" ",
						 inputForm : "("+val.dni+") "+val.nombre+""};
				 $("#formInformeAccB").append(
				   	 obtenerSubPanelModulo(item)
				   )
			 });
			 cancelarTrabajadorInvolucradoAcc();
		});
		
		
}
function eliminarTrabAccColaborador(trabAccidId){
	
	var r = confirm("¿Está seguro de eliminar el trabajador involucrado?");
	if (r == true) {
		var dataParam = {
			trabAccidId : trabAccidId,
		};

		callAjaxPost(URL + '/accidente/trabacc/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verSeccionInformeInvolucrados();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}
function agregarTrabajadorInvolucradoAcc(){
	$(".formLista").hide();
	$("#btnAgregarTrabAcc").hide();
	$("#btnCancelarTrabAcc").show();
	$("#btnGuardarTrabAcc").show();
	var selBooleanActividadRutina= crearSelectOneMenuOblig
	("selBooleanActividadRutina", "", listBoolean, "1", "id","nombre");
	var selTurnoTrabAcc= crearSelectOneMenuOblig
	("selTurnoTrabAcc", "", listTurnoTrabAcc, "1", "id","nombre");
	var listForm = [
	                {sugerencia:"",label:"Nombre",inputForm: "",divContainer:"divNombreInvolucradoInterno",clase:"formNuevo"},
	                {sugerencia:"",label:"Turno",inputForm: selTurnoTrabAcc,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Trabajo realizado al ocurrir el accidente",inputForm: "<input class='form-control' id='inputActTrabAcc'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Es rutinario",inputForm: selBooleanActividadRutina,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Inicio descanso médico",inputForm: "<input type='date' id='dateInicioTrabAcc' class='form-control'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Fin descanso médico",inputForm: "<input type='date' id='dateFinTrabAcc' class='form-control'>",divContainer:"",clase:"formNuevo"},];
	listForm.forEach(function(val){
		$("#formInformeAccB").append(
			   	 obtenerSubPanelModulo(val)
			   )
	});
	crearSelectOneMenuObligUnitarioCompleto("selTrabAccColaborador", "", listTrabajadoresAccidenteColaborador, 
			 "trabajadorId","nombre","#divNombreInvolucradoInterno","Trabajador")
	 
}
function cancelarTrabajadorInvolucradoAcc(){
	$("#btnAgregarTrabAcc").show();
	$("#btnCancelarTrabAcc").hide();
	$("#btnGuardarTrabAcc").hide();
	$(".formNuevo").remove();
	$(".formLista").show();
}
function guardarTrabajadorInvolucradoAcc(){
	var trabajadorId = $("#selTrabAccColaborador").val();
	var turno = $("#selTurnoTrabAcc").val();
	var actividadRealizada = $("#inputActTrabAcc").val(); 
	var isActividadRutinaria = $("#selBooleanActividadRutina").val();
	var fechaInicioDescanso = $("#dateInicioTrabAcc").val();
	var fechaFinDescanso = $("#dateFinTrabAcc").val();
	var diasDescanso=restaFechas(fechaInicioDescanso,fechaFinDescanso);
	if(fechaInicioDescanso==""){
		fechaInicioDescanso=null;
	}
	var dataParam = {
			accidenteId: listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId,
			partes:[],
			trabAccidId: 0  ,
			actividadRealizada : actividadRealizada,
			isActividadRutinaria : isActividadRutinaria,
			trabajadoresId:trabajadorId  ,
			parteCuerpoId:41  ,
			 turno :turno   ,
			 observaciones:"",
			 horasTrabajadas:1  ,
			 diasDescanso:diasDescanso  ,
			 fechaInicioDescanso:fechaInicioDescanso,
			 tipoLesion:{id:null}
			
		};
	callAjaxPost(URL + '/accidente/trabacc/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					verSeccionInformeInvolucrados();
					break;
				default:
					alert("Ocurrió un error al guardar el involucrado!");
				}
			});
}
function verAcordeBooleanTercero(){ 
	var tipoBoolTercero = parseInt($("#selBooleanTerceros").val());
	$("#formInformeAccA input").parent().parent().show();
	if(tipoBoolTercero == 1){
		
	}else{
		$("#formInformeAccA input").parent().parent().hide();
		$("#inputRazonTercero").val("");
		$("#inputRucTercero").val("");
		$("#inputDireccionTercero").val("");
		$("#inputRubroTercero").val("");
		$("#inputTrabTercero").val("");
	}
	
	
}

function verSeccionInformeCircunstancias(){
	var listItems=[
 	       			{sugerencia:"",label:"3. CIRCUNSTANCIAS AL MOMENTO",
 	       				inputForm: "",divContainer:""},
	       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Fecha ocurrencia",inputForm: "<input type='date' class='form-control' id='dgFecha'>",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Hora ocurrencia",inputForm: "<input type='time' class='form-control' id='dgHora'>",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Lugar (Área)",inputForm: "",divContainer:"divLugarArea"},
	       			{clase:"formLista",sugerencia:" ",label:"Lugar específico",inputForm: "<input class='form-control' id='dgLugar'>",divContainer:""}, 
	       			{clase:"formLista",sugerencia:"",label:"Riesgo principal asociado / Tipo de accidente",inputForm: "",divContainer:"divRiesgoAsociadoAcc"},  
	       			{clase:"formLista",sugerencia:" ",label:"Clima",inputForm: "",divContainer:"divClimaAcc"}, 
	       			
	       			{clase:"formLista",sugerencia:"Describa circunstancias del momento",label:"¿Cómo ocurrió?",inputForm: "<input class='form-control' id='inveAccHow'>",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Foto o diagrama de accidente",inputForm: "",divContainer:"eviAccCondicion"},
	       			{clase:"formLista",sugerencia:" ",label:"Objeto causante del accidente",inputForm: "<input class='form-control' id='invObjAcc' >",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Tamaño, peso, altura, capacidad, etc",inputForm: "<input class='form-control' id='invDescObjAcc'>",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Estado del equipo de prevención, EPP, guardas",inputForm: "<input class='form-control' id='invEstadoEppAcc'>",divContainer:""},
	       			
	       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
 	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
 	       						"</button>",divContainer:"divSiguiente"},
	       		];
		var text="";
		listItems.forEach(function(val,index)
		{
			text+=obtenerSubPanelModulo(val);
		});
		var contenido = "<form class='eventoGeneral' id='formInformeAccC'> "+text+"</form>";
		   	   	
		var listPaneles=
		{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}
		
		agregarModalPrincipalColaborador(listPaneles);
		
		$("#formInformeAccC").on("submit",function(e){
				e.preventDefault();
				guardarCircunstaciasAcc();
		});
		var dataParam ={
				inicioEmpresa : 0,
				accidenteId: accidenteInformeId,
				idCompany : getSession("gestopcompanyid")};
		
		callAjaxPost(URL + '/accidente/detalle', dataParam,
				function (data){
			var accidenteDetalle = data.list;
			var accDgFecha=accidenteDetalle.fecha.substring(0,10);
		    var accDgHora=accidenteDetalle.fecha.substring(11,19);
		    var listTipoContacto= data.tiposContacto;
			$("#dgFecha").val(accDgFecha);		
			$("#dgHora").val(accDgHora);
			$("#dgLugar").val(accidenteDetalle.lugar);
			$("#divLugarArea").html(accidenteDetalle.areaOcurrio.areaName);
			var selClimaAcc=crearSelectOneMenuOblig("selClimaAcc","",
					data.listClimas,accidenteDetalle.clima.id
					,"id" ,"nombre","Sin definir");
			listTipoContacto.forEach(function(val){
				val.selected = 0;
				if(val.id == accidenteDetalle.tipoContacto.id){
					val.selected = 1;
				}
			});
			crearSelectOneMenuObligUnitarioCompleto("selRiesgoAsocAccidente", "",listTipoContacto , "id",
						"nombreAux","#divRiesgoAsociadoAcc","---")
			$("#divClimaAcc").html(selClimaAcc);
			$("#invObjAcc").val(accidenteDetalle.objetoNombre)
			$("#invDescObjAcc").val(accidenteDetalle.objetoDescripcion)
			$("#invEstadoEppAcc").val(accidenteDetalle.eppDescripcion)
			$("#inveAccHow").val(accidenteDetalle.how)
			var optionsHow={
					container:"#eviAccCondicion",
					functionCall:function(){ },
					descargaUrl: "/accidente/evidencia/how?accidenteId="+accidenteDetalle.accidenteId,
					esNuevo:false,
					idAux:"AccidenteHow",
					evidenciaNombre:accidenteDetalle.evidenciaHowNombre};
			crearFormEvidenciaCompleta(optionsHow);
			
		});
}
function guardarCircunstaciasAcc(){
	var accDgHora=$("#dgHora").val();
	var accDgFecha= $("#dgFecha").val();
	var lugar = $("#dgLugar").val();
	var climaId = $("#selClimaAcc").val();
	var objetoNombre = $("#invObjAcc").val();
	var objetoDescripcion = $("#invDescObjAcc").val();
	var eppDescripcion = $("#invEstadoEppAcc").val();
	var how = $("#inveAccHow").val();
	var tipoContactoId = $("#selRiesgoAsocAccidente").val();
	var dataParam ={
			accidenteId: listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId,
			fecha : accDgFecha+" "+accDgHora,
			tipoContacto : {id : tipoContactoId},
			lugar : lugar,
			clima : {id: climaId},
			objetoNombre : objetoNombre,
			objetoDescripcion : objetoDescripcion,
			eppDescripcion : eppDescripcion,
			how : how,
			};
	callAjaxPost(URL + '/accidente/detalle/circunstancias/save', dataParam,
			function (data){
		guardarEvidenciaAuto( accidenteInformeId,"fileEviAccidenteHow",
				bitsEvidenciaAccidente,'/accidente/evidencia/how/save',
				function(){
			verSeccionInformeSupervisorTestigo();
		},"accidenteId");
		
	});
 
}
function verSeccionInformeSupervisorTestigo(){
	var listItems=[
		  	       			{sugerencia:"",label:"4. DATOS DE SUPERVISORES INVESTIGACIÓN",
		  	       				inputForm: "<button type='button' id='btnAgregarInvestigadorAcc' onclick='agregarInvestigadorAcc()' class='btn btn-success'>" +
		  	       						"<i class='fa fa-plus'></i>Agregar" +
		  	       						"</button>" +
		  	       						"" +
		  	       						"<button  type='button' id='btnCancelarInvestigadorAcc' onclick='cancelarInvestigadorAcc()' class='btn btn-danger'>" +
		  	       						"<i class='fa fa-times'></i>Cancelar" +
		  	       						"</button>" +
		  	       						"" +
		  	       						"<button  type='button' id='btnGuardarInvestigadorAcc' onclick='guardarInvestigadorAcc()' class='btn btn-success'>" +
		  	       						"<i class='fa fa-floppy-o'></i>Guardar" +
		  	       						"</button>",divContainer:""},
			       			{clase:"",sugerencia:"",label:"",inputForm: "",divContainer:""},
			       			{clase:"formLista",sugerencia:" ",label:"Hay ",inputForm: "",divContainer:"indicadorTrabsInterno"},
			       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
		  	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
		  	       						"</button>",divContainer:"divSiguiente"},
			       		];
	   	var text="";
	   	listItems.forEach(function(val,index)
	   	{
	   		text+=obtenerSubPanelModulo(val);
	   	});
	   	var contenido = "<form class='eventoGeneral' id='formInformeAccD'> "+text+"</form>";
		    	   	
		var listPaneles=
		 {id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

		agregarModalPrincipalColaborador(listPaneles);
		
		var dataParam ={
				accidenteId:  accidenteInformeId,};
		callAjaxPost(URL + '/accidente/investigador', dataParam, 
				function(data) {
			 var listTrabSupervisores = data.list;
			 $("#indicadorTrabsInterno").html("Hay "+listTrabSupervisores.length+" supervisor(es)")
			 listTrabSupervisores.forEach(function(val,index){
				 var btnEliminar ="<button class='btn btn-danger' onclick='eliminarInvestigadorColaborador("+val.trabAccidId+")'>" +
				 		"<i class='fa fa-trash'></i></button>";
				 var item = {clase:"formLista",sugerencia : "", label : btnEliminar+"Supervisor #"+(index+1)+" ",
						 inputForm : " "+val.nombre+"  ("+val.cargo+")"};
				 $("#formInformeAccD").append(
				   	 obtenerSubPanelModulo(item)
				   )
			 });
			 if(listTrabSupervisores.length == 0){
				 $("#formInformeAccD").on("submit",function(e){
						e.preventDefault();
						alert("1 supervisor obligatorio")
				});
			 }else{
				$("#formInformeAccD").on("submit",function(e){
						e.preventDefault();
						verSeccionInformeTestigos();
				});
			 }
			 cancelarInvestigadorAcc();
		});
		
		
}
function agregarInvestigadorAcc(){
	$(".formLista").hide();
	$("#btnAgregarInvestigadorAcc").hide();
	$("#btnCancelarInvestigadorAcc").show();
	$("#btnGuardarInvestigadorAcc").show();
	var listForm = [
	                {sugerencia:"",label:"Nombre",inputForm: "<input class='form-control' id='inveNombre'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Cargo",inputForm: "<input class='form-control' id='inveCargo'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Proceso",inputForm: "<input class='form-control' id='inveProceso'>",divContainer:"",clase:"formNuevo"},
	                ];
	listForm.forEach(function(val){
		$("#formInformeAccD").append(
			   	 obtenerSubPanelModulo(val)
			   )
	});
	 
}
function guardarInvestigadorAcc(){
	var nombre = $("#inveNombre").val();
	var cargo = $("#inveCargo").val();
	var proceso = $("#inveProceso").val();
	
	var dataParam = {
			accidenteId:  accidenteInformeId,
			investigadorId : 0,
			nombre: nombre,
			cargo:cargo,
			proceso:proceso
			
		};
	callAjaxPost(URL + '/accidente/investigador/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					verSeccionInformeSupervisorTestigo();
					break;
				default:
					alert("Ocurrió un error al guardar el investigador!");
				}
			});
}
function eliminarInvestigadorColaborador(investigadorId){
	var r = confirm("¿Está seguro de eliminar el investigador?");
	if (r == true) {
		var dataParam = {
				investigadorId : investigadorId,
		};

		callAjaxPost(URL + '/accidente/investigador/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verSeccionInformeSupervisorTestigo();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}
function cancelarInvestigadorAcc(){
	$("#btnAgregarInvestigadorAcc").show();
	$("#btnCancelarInvestigadorAcc").hide();
	$("#btnGuardarInvestigadorAcc").hide();
	$(".formNuevo").remove();
	$(".formLista").show();
}
var listInvestigosresTestigoAcc = [];
function verSeccionInformeTestigos(){
	var listItems=[
 	       			{sugerencia:"",label:"5. DATOS DE TESTIGOS",
 	       				inputForm: "<button type='button' id='btnAgregarTestigoAcc' onclick='agregarTestigoAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-plus'></i>Agregar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnCancelarTestigoAcc' onclick='cancelarTestigoAcc()' class='btn btn-danger'>" +
 	       						"<i class='fa fa-times'></i>Cancelar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnGuardarTestigoAcc' onclick='guardarTestigoAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-floppy-o'></i>Guardar" +
 	       						"</button>",divContainer:""},
	       			{clase:"",sugerencia:"",label:"",inputForm: "",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Hay ",inputForm: "",divContainer:"indicadorTrabsInterno"},
	       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
 	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
 	       						"</button>",divContainer:"divSiguiente"},
	       		];
	var text="";
	listItems.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido = "<form class='eventoGeneral' id='formInformeAccE'> "+text+"</form>";
   	   	
var listPaneles=
{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

agregarModalPrincipalColaborador(listPaneles);

$("#formInformeAccE").on("submit",function(e){
		e.preventDefault();
		verSeccionInformeCausas();
});
var dataParam ={
		accidenteId:  accidenteInformeId,};
callAjaxPost(URL + '/accidente/testigo', dataParam, 
		function(data) {
	 var listTrabTestigos = data.lista;
	 listInvestigosresTestigoAcc = data.listInvestigadores
	 $("#indicadorTrabsInterno").html("Hay "+listTrabTestigos.length+" testigo(s)")
	 listTrabTestigos.forEach(function(val,index){
		 var btnEliminar ="<button class='btn btn-danger' onclick='eliminarTestigoColaborador("+val.testigoId+")'>" +
		 		"<i class='fa fa-trash'></i></button>";
		 var item = {clase:"formLista",sugerencia : "", label : btnEliminar+"Testigo #"+(index+1)+" ",
				 inputForm : " "+val.nombre+"  ("+val.declaracion.substr(0,20)+"...)"};
		 $("#formInformeAccE").append(
		   	 obtenerSubPanelModulo(item)
		   )
	 });
	 cancelarTestigoAcc();
});

}
function agregarTestigoAcc(){
	$(".formLista").hide();
	$("#btnAgregarTestigoAcc").hide();
	$("#btnCancelarTestigoAcc").show();
	$("#btnGuardarTestigoAcc").show();
	var selInvestigador = crearSelectOneMenuOblig("selInvestigador", "", listInvestigosresTestigoAcc,
			"", "investigadorId", "nombre");
	var selInterno = crearSelectOneMenuOblig("testigoTipo", "", listInterno,
			"", "id", "nombre");

	var listForm = [
	                {sugerencia:"",label:"Supervisor encargado",inputForm: selInvestigador,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Tipo",inputForm: selInterno,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Nombre",inputForm: "<input class='form-control' id='testigoNombre'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Fecha declaración",inputForm: "<input type='date' class='form-control' id='testigoFecha'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Declaración",inputForm: "<textarea class='form-control' id='testigoDeclara'></textarea>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Lugar Declaración",inputForm: "<input class='form-control' id='testigoLugar'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Hora inicio",inputForm: "<input class='form-control' id='testigoHoraInicio' type='time'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Hora fin",inputForm: "<input class='form-control' id='testigoHoraFin' type='time'>",divContainer:"",clase:"formNuevo"},
	                 ];
	listForm.forEach(function(val){
		$("#formInformeAccE").append(
			   	 obtenerSubPanelModulo(val)
			   )
	});
	 
}
function guardarTestigoAcc(){
	var tipoTestigo=$('#testigoTipo').val();
	var testigoFecha=$("#testigoFecha").val();
	if(!$("#testigoFecha").val()){
		testigoFecha=null;
	}
	var declaracion=$("#testigoDeclara").val();
	var nombre=$("#testigoNombre").val();
	var lugar=$("#testigoLugar").val();
	var horaInicio=$("#testigoHoraInicio").val();
	var horaFin=$("#testigoHoraFin").val();
	var investigadorId=$("#selInvestigador").val();
	
	var dataParam = {
			accidenteId: accidenteInformeId,
			testigoId:0,
			 nombre:nombre,
			 testigoFecha:testigoFecha,
			 declaracion:declaracion,
			 lugarDeclarado:lugar,
			 horaInicio:horaInicio,
			 horaFin:horaFin,
			 investigadorId:investigadorId,
			 testigoTipoId:  tipoTestigo			
		};
	callAjaxPost(URL + '/accidente/testigo/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					verSeccionInformeTestigos();
					break;
				default:
					alert("Ocurrió un error al guardar el testigo!");
				}
			});
}
function eliminarTestigoColaborador(testigoId){
	var r = confirm("¿Está seguro de eliminar el testigo?");
	if (r == true) {
		var dataParam = {
				testigoId : testigoId,
		};

		callAjaxPost(URL + '/accidente/testigo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verSeccionInformeTestigos();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}
function cancelarTestigoAcc(){
	$("#btnAgregarTestigoAcc").show();
	$("#btnCancelarTestigoAcc").hide();
	$("#btnGuardarTestigoAcc").hide();
	$(".formNuevo").remove();
	$(".formLista").show();
}
var listTipoEventoAcc = [];
var listCausaTipoEventoAcc = [];
function verSeccionInformeCausas(){
	var listItems=[
 	       			{sugerencia:"",label:"6. DETALLES DE LAS CAUSAS",
 	       				inputForm: "<button type='button' id='btnAgregarCausaAcc' onclick='agregarCausaAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-plus'></i>Agregar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnCancelarCausaAcc' onclick='cancelarCausaAcc()' class='btn btn-danger'>" +
 	       						"<i class='fa fa-times'></i>Cancelar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnGuardarCausaAcc' onclick='guardarCausaAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-floppy-o'></i>Guardar" +
 	       						"</button>",divContainer:""},
	       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Hay ",inputForm: "",divContainer:"indicadorTrabsInterno"},
	       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
 	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
 	       						"</button>",divContainer:"divSiguiente"},
	       		];
	var text="";
	listItems.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido = "<form class='eventoGeneral' id='formInformeAccF'> "+text+"</form>";
   	   	
var listPaneles=
{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

agregarModalPrincipalColaborador(listPaneles);

$("#formInformeAccF").on("submit",function(e){
		e.preventDefault();
		verSeccionInformeCausaPrincipal();
});
var dataParam ={
		accidenteId:  accidenteInformeId,};
callAjaxPost(URL + '/accidente/eventacc', dataParam, 
		function(data) {
	 var listTrabCausas = data.list;
	 listTipoEventoAcc = data.tipos;
	 listCausaTipoEventoAcc = data.causas;
	 $("#indicadorTrabsInterno").html("Hay "+listTrabCausas.length+" causa(s)")
	 listTrabCausas.forEach(function(val,index){
		 var btnEliminar ="<button class='btn btn-danger' onclick='eliminarCausaColaborador("+val.eventoInseguroAccidenteId+")'>" +
		 		"<i class='fa fa-trash'></i></button>";
		 var item = {clase:"formLista",sugerencia : "", label : btnEliminar+"Causa #"+(index+1)+" ",
				 inputForm : " "+val.eventoTipoNombre+"  ("+val.causa.nombre+")"};
		 $("#formInformeAccF").append(
		   	 obtenerSubPanelModulo(item)
		   )
	 });
	 cancelarCausaAcc();
});

}
function agregarCausaAcc(){
	$(".formLista").hide();
	$("#btnAgregarCausaAcc").hide();
	$("#btnCancelarCausaAcc").show();
	$("#btnGuardarCausaAcc").show();
	var selInvestigador = crearSelectOneMenuOblig("listTipoEvento", "verAcordeTipoEventoAcc()", listTipoEventoAcc,
			"", "id", "nombre");

	var listForm = [
	                {sugerencia:"",label:"Tipo",inputForm: selInvestigador,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Causa",inputForm: "",divContainer:"divCausaAcc",clase:"formNuevo"},
	                {sugerencia:"",label:"Detalle",inputForm: "<input class='form-control' id='invEventoInseguro'>",divContainer:"",clase:"formNuevo"},
	                ];
	listForm.forEach(function(val){
		$("#formInformeAccF").append(
			   	 obtenerSubPanelModulo(val)
			   )
	});
	verAcordeTipoEventoAcc();
}
function verAcordeTipoEventoAcc(){
var tipoId = parseInt($("#listTipoEvento").val());
 
	crearSelectOneMenuObligUnitarioCompleto
	("selCausaEvento", "", listCausaTipoEventoAcc.filter(function(val){
		return val.tipoEvento.id == tipoId;
	}), 
			 "id","nombreAux","#divCausaAcc","Causa");
}
function guardarCausaAcc(){
	var eventoTipoId=$("#listTipoEvento").val();
	var subTipo=$("#selSubTipoEvento").val();
	var causaId = $("#selCausaEvento").val();
	var eventoNombre=$("#invEventoInseguro").val();
	
	var dataParam = {
			accidenteId: accidenteInformeId,
			eventoInseguroAccidenteId : 0,
			eventoTipoId: eventoTipoId,
			eventoNombre: eventoNombre,
			subTipoEventoId:subTipo,
			causa : {id : causaId}		
		};
	callAjaxPost(URL + '/accidente/eventacc/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					verSeccionInformeCausas();
					break;
				default:
					alert("Ocurrió un error al guardar la causa");
				}
			});
}
function eliminarCausaColaborador(actoId){
	var r = confirm("¿Está seguro de eliminar la causa?");
	if (r == true) {
		var dataParam = {
				eventoInseguroAccidenteId : actoId,
		};

		callAjaxPost(URL + '/accidente/eventacc/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verSeccionInformeCausas();
						break;
					default:
						alert("Ocurrió un error al eliminar la causa!");
					}
				});
	}
}
function cancelarCausaAcc(){
	$("#btnAgregarCausaAcc").show();
	$("#btnCancelarCausaAcc").hide();
	$("#btnGuardarCausaAcc").hide();
	$(".formNuevo").remove();
	$(".formLista").show();
}
function verSeccionInformeCausaPrincipal(){
	var listItems=[
	       			{sugerencia:"",label:"7. RESUMEN DE CAUSA PRINCIPAL",
	       				inputForm: "",divContainer:""},
	       			{sugerencia:"",label:"Causa del accidente",inputForm: "<textarea class='form-control' id='inveWhy'></textarea>",divContainer:""},
	       			
	       			{sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
	       						"</button>",divContainer:"divSiguiente"},
	       		];
		var text="";
		listItems.forEach(function(val,index)
		{
			text+=obtenerSubPanelModulo(val);
		});
		var contenido = "<form class='eventoGeneral' id='formInformeAccG'> "+text+"</form>";
		   	   	
		var listPaneles=
		{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}
		
		agregarModalPrincipalColaborador(listPaneles);
		
		$("#formInformeAccG").on("submit",function(e){
				e.preventDefault();
				guardarCausaPrincipalAcc();
		});
		var dataParam ={
				inicioEmpresa : 0,
				accidenteId: accidenteInformeId,
				idCompany : getSession("gestopcompanyid")};
		
		callAjaxPost(URL + '/accidente/detalle', dataParam,
				function (data){
			var accidenteDetalle = data.list;
			$("#inveWhy").val(accidenteDetalle.investigacionAnalisisRazones)
			
		});
}
function guardarCausaPrincipalAcc(){
	var investigacionAnalisisRazones=$("#inveWhy").val();
	var dataParam ={
			accidenteId: accidenteInformeId,
			investigacionAnalisisRazones : investigacionAnalisisRazones,
			};
	callAjaxPost(URL + '/accidente/detalle/causa_principal/save', dataParam,
			function (data){
		
		verSeccionInformeAccionMejoras();
		
	});
 
}
var listTipoAccionAcc = [];
var listClasificacionAccionAcc = [];
function verSeccionInformeAccionMejoras(){
	var listItems=[
 	       			{sugerencia:"",label:"8. ACCIONES DE MEJORA ASOCIADA (CONTRAMEDIDAS)",
 	       				inputForm: "<button type='button' id='btnAgregarAccionMejoraAcc' onclick='agregarAccionMejoraAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-plus'></i>Agregar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnCancelarAccionMejoraAcc' onclick='cancelarAccionMejoraAcc()' class='btn btn-danger'>" +
 	       						"<i class='fa fa-times'></i>Cancelar" +
 	       						"</button>" +
 	       						"" +
 	       						"<button  type='button' id='btnGuardarAccionMejoraAcc' onclick='guardarAccionMejoraAcc()' class='btn btn-success'>" +
 	       						"<i class='fa fa-floppy-o'></i>Guardar" +
 	       						"</button>",divContainer:""},
	       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
	       			{clase:"formLista",sugerencia:" ",label:"Hay ",inputForm: "",divContainer:"indicadorTrabsInterno"},
	       			{clase:"formLista",sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
 	       						" Siguiente <i class='fa fa-arrow-right'></i>" +
 	       						"</button>",divContainer:"divSiguiente"},
	       		];
	var text="";
	listItems.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido = "<form class='eventoGeneral' id='formInformeAccH'> "+text+"</form>";
   	   	
var listPaneles=
{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

agregarModalPrincipalColaborador(listPaneles);

$("#formInformeAccH").on("submit",function(e){
		e.preventDefault();
		verSeccionInformeFinal();
});
var dataParam ={
		accidenteId:  accidenteInformeId,};
callAjaxPost(URL + '/accidente/acciones', dataParam, 
		function(data) {
	 var listTrabAccionMejoras = data.list;
	 listTipoAccionAcc = data.tipos;
	 listClasificacionAccionAcc = data.clasificacion;
	 $("#indicadorTrabsInterno").html("Hay "+listTrabAccionMejoras.length+" accion(es)")
	 listTrabAccionMejoras.forEach(function(val,index){
		 var btnEliminar ="<button class='btn btn-danger' onclick='eliminarAccionMejoraColaborador("+val.accionMejoraId+")'>" +
		 		"<i class='fa fa-trash'></i></button>";
		 var item = {clase:"formLista",sugerencia : "", label : btnEliminar+val.tipoAccionNombre+" #"+(index+1)+" ",
				 inputForm : "("+val.clasificacion.nombre+") "+val.descripcion+" " +
				 		", Responsable : "+val.responsableNombre};
		 $("#formInformeAccH").append(
		   	 obtenerSubPanelModulo(item)
		   )
	 });
	 cancelarAccionMejoraAcc();
});

}
function agregarAccionMejoraAcc(){
	$(".formLista").hide();
	$("#btnAgregarAccionMejoraAcc").hide();
	$("#btnCancelarAccionMejoraAcc").show();
	$("#btnGuardarAccionMejoraAcc").show();
	var selTipoAccion = crearSelectOneMenuOblig("selTipoAccion", "", listTipoAccionAcc, "",
			"id", "nombre");
	var selClasifAccion = crearSelectOneMenuOblig("selClasifAccion", "", listClasificacionAccionAcc, "",
			"id", "nombre");

	var listForm = [
	                {sugerencia:"",label:"Tipo*",inputForm: selTipoAccion,divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Clasificación*",inputForm: selClasifAccion,divContainer:"",clase:"formNuevo"},
	                 {sugerencia:"",label:"Descripción*",inputForm: "<input class='form-control' id='inputDescAccion'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Trabajador Responsable*",inputForm: "",divContainer:"divResponsableAccion",clase:"formNuevo"},
	                {sugerencia:"Si ya ha realizado la acción,solo introduzca la evidencia",label:"Fecha planificada",inputForm: "<input type='date' class='form-control' id='inputDateAccion'>",divContainer:"",clase:"formNuevo"},
	                {sugerencia:"",label:"Evidencia",inputForm: "",divContainer:"divEvidenciaAccion",clase:"formNuevo"},
	                ];
	listForm.forEach(function(val){
		$("#formInformeAccH").append(
			   	 obtenerSubPanelModulo(val)
			   );
	});
	crearSelectOneMenuObligUnitarioCompleto
	("selTrabAccionAccColaborador", "", listTrabajadoresAccidenteColaborador, 
			 "trabajadorId","nombre","#divResponsableAccion","Trabajador");
	var options=
	{container:"#divEvidenciaAccion",
			functionCall:function(){ },
			descargaUrl: "",
			esNuevo:true,
			idAux:"AccionAcc",
			evidenciaNombre:""};
	crearFormEvidenciaCompleta(options);
	
}
function guardarAccionMejoraAcc(){
	var tipoId=$("#selTipoAccion").val();
	var clasificacionId=$("#selClasifAccion").val();
	var descripcion = $("#inputDescAccion").val();
	var trabajadorResponsableId=$("#selTrabAccionAccColaborador").val();
	var fechaPlanificada=$("#inputDateAccion").val(); 
	
	var dataParam = {
			accidenteId: accidenteInformeId,
			accionMejoraId : 0,
			clasificacion : {id : clasificacionId},
			trabajadorResponsableId:trabajadorResponsableId,
		descripcion : descripcion,
		fechaRevision : fechaPlanificada,
		accionMejoraTipoId : tipoId,
		estadoId : 1,
		inversionAccion:0,
		companyId : getSession("gestopcompanyid"),
		gestionAccionMejoraId : listFullAccidenteEval[indexFunctAccEval].accidente.gestionAccionMejoraId	
		};
	callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					guardarEvidenciaAuto(data.nuevoId,"fileEviAccionAcc",
							bitsEvidenciaAccidente,
							'/gestionaccionmejora/accionmejora/evidencia/save',
							function(){
						verSeccionInformeAccionMejoras();
					},"accionMejoraId");
				
					break;
				default:
					alert("Ocurrió un error al guardar la acción");
				}
			});
}
function eliminarAccionMejoraColaborador(actoId){
	var r = confirm("¿Está seguro de eliminar la causa?");
	if (r == true) {
		var dataParam = {
				eventoInseguroAccidenteId : actoId,
		};

		callAjaxPost(URL + '/accidente/eventacc/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						verSeccionInformeAccionMejoras();
						break;
					default:
						alert("Ocurrió un error al eliminar la accion!");
					}
				});
	}
}
function cancelarAccionMejoraAcc(){
	$("#btnAgregarAccionMejoraAcc").show();
	$("#btnCancelarAccionMejoraAcc").hide();
	$("#btnGuardarAccionMejoraAcc").hide();
	$(".formNuevo").remove();
	$(".formLista").show();
}
function verSeccionInformeFinal(){
	var listItems=[
	       			{sugerencia:"",label:"9. GENERAR EXCEL",inputForm: "",divContainer:""},
	       			{sugerencia:"",label:"",inputForm: "",divContainer:""},
	       			{sugerencia:" ",label:" ",inputForm: "Ya puedes descargar el informe para ser revisado",divContainer:""}, 
	       			{sugerencia:" ",label:"",inputForm: "<button type='submit' class='btn btn-success'>" +
	       						" Descargar y finalizar <i class='fa fa-download'></i>" +
	       						"</button>",divContainer:"divSiguiente"},
	       		];
	var text="";
	listItems.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido = "<form class='eventoGeneral' id='formInformeAccZ'> "+text+"</form>";
  	   	
var listPaneles=
{id:"asd",nombre:"Datos informe accidente/incidente",clase:"",contenido:contenido}

agregarModalPrincipalColaborador(listPaneles);

$("#formInformeAccZ").on("submit",function(e){
		e.preventDefault();
		$("#asd").modal("hide");
		window.open(URL
				+ "/accidente/informe/accidente?accidenteId="
				+ listFullAccidenteEval[indexFunctAccEval].accidente.accidenteId 
				+"&tipoAccidenteId="
				+listFullAccidenteEval[indexFunctAccEval].accidente.accidenteTipoId
			);	
});
}

function guardarIncidenteColaborador(){ 
   var formDiv=$("#divReportarAcc");
   var campoVacio = false;
	
   var lugar=formDiv.find("#inputLugarIncProy").val();  
   var descripcion=formDiv.find("#inputDescIncProy").val();  
   var fecha=formDiv.find("#dateInciProy").val();
   var tipo=parseInt( formDiv.find("#selTipoAccidente").val() ); 
   var subtipo=formDiv.find("#selSubTipoAccidente").val(); 
   var clasificacion=formDiv.find("#selClasAccidente").val(); 
   var areaId = $("#selAreaAccColaborador").val();
 
   if(tipo != 1){
      subtipo = null;
      clasificacion =null;
   }
 
   var subTipoAux = null;
 
   if(tipo == 1){
      subTipoAux = 72;
   }
 
   if(tipo == 2){
      subTipoAux = 24;
   }
   //if(lugar.trim() == ""){alert("El lugar es obligatorio"); return;};
   if(descripcion.trim() == ""){
      alert("La descripción es obligatoria"); 
      return;
   }
   
   if(fecha == ""){
      alert("La fecha es obligatoria");
      return;
   }

   var existe=comprobarFieInputExiste("fileEviIncidente");
   //if(!existe.isValido){alert("Introducir evidencia"); return;}

      if(!campoVacio){
         var dataParam={
	        accidenteId : 0,
	        accidenteInformeId : 1,
	        idCompany: getSession("gestopcompanyid"),
	        areaOcurrio: {areaId: areaId},
	        proyectoId: null ,
	        trabajadorRegistra: {trabajadorId: getSession("trabajadorGosstId")},
	        accidenteDescripcion: descripcion,
	        lugar: "",
		fecha: fecha, 
		accidenteTipoId: tipo ,
		accidenteSubTipoId : (subTipoAux),
		accidenteClasificacionId: subtipo  ,
		accidenteSubClasificacionId: clasificacion,
		trabajadorContratista: {id: null},
		unidadId: getSession("unidadGosstId"),
		unidades: [{matrixId : getSession("unidadGosstId")}]
		       };

         callAjaxPost(URL+'/accidente/colaborador/save',dataParam,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		  guardarEvidenciaAuto(data.nuevoId,"fileEviIncidente",bitsEvidenciaAccidente,
				       '/accidente/evidencia/save',function(){
				  cargarAccidentesPorEvaluar();
		  },"accidenteId");
						 
		  alert("Se informó al administrador del reporte!");
		  break;
						
	       default:
		  console.log("Ocurrió un error al guardar la programacion!");
	    }
         });
      }else{
         alert("Debe ingresar todos los campos.");
      } 
}

function verAcuerdoTipoAccidenteColaborador(){
	var tipoId=$("#selTipoAccidente").val();
	$("#divSelSubTipo").parent().hide();
	$("#divNivIncap").parent().hide();
	if(parseInt(tipoId)==1){
		$("#divSelSubTipo").parent().show();
		verAcordeTipoIncapacitanteColaborador();
	}
}

function verAcordeTipoIncapacitanteColaborador(){
	var incapId=parseInt($("#selSubTipoAccidente").val());
	$("#divNivIncap").parent().hide();
	if(parseInt(incapId)==2){
		$("#divNivIncap").parent().show();
	}
}

function evaluarAccidenteOcurrido(replicar,pindex){
    var obj = listFullAccidenteEval[pindex];
   	var ideval = (obj.id == null?0:obj.id);
   	var accidenteid = obj.accidente.accidenteId;
   	var trabajadorid = obj.trabajador.trabajadorId;
   	var areaid = obj.areaPorEvaluar.areaId;
   	var rep = replicar;
   	var dias = 10;

   	var dataParam={
	    id:ideval,accidente:{accidenteId:accidenteid},trabajador:{trabajadorId:trabajadorid},
	    areaEvaluada:{areaId:areaid},replicar:rep,diasRspta:dias
	};
	
   	callAjaxPost(URL+'/accidente/colaborador/evaluar/save',dataParam,function(data){
		cargarAccidentesPorEvaluar();

		idMaxAccAreaActual = idMaxAccAreaActual+1;

		if(rep == 1) {
			mensajeUx = "<label>Calificación guardada con éxito. Ahora ingrese el escenario asociado al accidente/incidente.</label>";
			mensajesUx(mensajeUx, 1, "ocultarMensajesUx();agregarEscenarioAcci();", "");
		}else{
			mensajeUx = "<label>Calificación guardada con éxito.</label>";
			mensajesUx(mensajeUx,1,"","");
		}
	});
}

function agregarEscenarioAcci()
{
	var listItemsForm=[
			{sugerencia:"",label:"<i class='fa fa-calendar'></i> Actividad Identificada* ",inputForm: "<input class='form-control' id='inputActividad'>",divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-fire'></i> Peligro Identificado* ",inputForm: "<input class='form-control' id='inputPeligro'>",divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-exclamation-triangle'></i> Riesgo Identificado* ",
				inputForm: "",divContainer:"divRiesgoIdentificado"},
			{sugerencia:" ",label:"<i class='fa fa-bars'></i> Causa que origiaría el riesgo* ",inputForm: "<input class='form-control' id='inputCausaRiesgo'>",divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-upload'></i> Evidencia (foto del ambiente): ",inputForm: "<div id='inputEvidencia'></div>",divContainer:""},
			{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success' ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""}
		];
	var text="";
	listItemsForm.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido=
		"<form class='eventoGeneral' id='formEscenario'>" +
			"<div id='tituloEvento'>" + 
				text+
			"</div>"+
			"</div>" +
		"</form>";
	var listPaneles=
		 {id:"divNuevoEscenario",nombre:"Descripción del Escenario de Posible Accidente",clase:"",contenido:contenido}
	                 ;
	agregarModalPrincipalColaborador(listPaneles,function(){
		crearSelectOneMenuObligUnitarioCompleto
		 ("selRiesgoEscenario", "",listRiesgosEscenario, "id","nombreAux",
				 "#divRiesgoIdentificado","Ninguno");
	});
	
	$("#formEscenario").on("submit",function(e){
		e.preventDefault();
		guardarEscenario();
	}); 
	var options=
	{container:"#inputEvidencia",
			functionCall:function(){ },
			descargaUrl: "",
			esNuevo:true,
			idAux:"Escenario",
			evidenciaNombre:""};
	crearFormEvidenciaCompleta(options);
	
}

var indexAccidenteColaborador = 0;
var listFullEscenarios = [];
var listRiesgosEscenario = [];
var indexEscenario = 0;
//cambiar a llamada al servidor
function verEscenario(pindex)
{
	indexAccidenteColaborador = parseInt(pindex);
	$(".subOpcionAccion").hide();
	$("#evaluado"+pindex+" .subOpcionAccion").show();
	callAjaxPost(URL+"/accidente/area/escenarios",{
		areaEvaluada : {companyId : getSession("gestopcompanyid")},
		id : listFullAccidenteEval[pindex].id},function(data){
		listFullEscenarios=data.escenarios;
		listRiesgosEscenario = data.riesgos;
		
		var todo="";
		listFullEscenarios.forEach(function(val,index)
		{
			var listItemsForm=[
				{sugerencia:"",label:"<i class='fa fa-calendar'></i> Actividad Identificada: ",inputForm:val.actividad,divContainer:""},
				{sugerencia:" ",label:"<i class='fa fa-fire'></i> Peligro Identificado: ",inputForm: val.peligro,divContainer:""},
				{sugerencia:" ",label:"<i class='fa fa-exclamation-triangle'></i> Riesgo Identificado: ",inputForm: val.riesgo,divContainer:""},
				{sugerencia:" ",label:"<i class='fa fa-bars'></i> Causa que origiaría el riesgo: ",inputForm: val.causaRiesgo,divContainer:""},
				{sugerencia:" ",label:"<i class='fa fa-upload'></i> Evidencia: ",inputForm: "<a class='efectoLink' href='"+URL+"/accidente/colaborador/escenario/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>",divContainer:""},
				{sugerencia:" ",label:"<a class='efectoLink' onclick='verAccionMejora("+val.id+")' >Ver Acciones de Mejora ("+val.numAccionesTotal+") <i class='fa fa-angle-double-down'></i></a>",inputForm:"",divContainer:""}
			];
			var text="";
			listItemsForm.forEach(function(val1,index1)
			{
				text+=obtenerSubPanelModulo(val1);
			});
			todo+=
				"<div class='subDetalleAccion  gosst-neutral'>" +
					"<div class='' style=''>" +
						"<section class='containerEvalEscenario"+index+"'>" +
							"<a class='efectoLink btn-gestion' onclick='" +
							"indexEscenario = "+index+";toggleMenuOpcionAccidentEval(this,"+index+",\"Escenario\");'>" +
									"Ver Opciones <i class='fa fa-angle-double-down'></i>" +
							"</a>"+menuOpcionAccidentEval[2]+
						"</section>"+
					"</div>"+
					"<div class='row'>" +
						"<section class='col col-xs-9'>" +
							"<strong>"+
								"ESCENARIO "+(index+1)+
							"</strong>"+
						"</section>"+
					"</div>"+
					text+
				"</div>"+
				"<div class='subOpcionDetalleAccion' id='subSubMenu"+val.id+"'style='display:none;'></div>";
		});
		$("#evaluado"+pindex+" .subOpcionAccion").html(todo);
	});
	
}
function guardarEscenario(){
    
   //console.log(mostrarFormulario);
    
   var idEvalOcurre;
   
   if(mostrarFormulario == 1){
      idEvalOcurre = idMaxAccAreaActual;
   }else{
      idEvalOcurre = listFullAccidenteEval[indexFunctAccEval].id;    
   }
   
   var actividad=$("#inputActividad").val();
   var pelig=$("#inputPeligro").val();
   var riesgoId=$("#selRiesgoEscenario").val();
   var causaRies=$("#inputCausaRiesgo").val();
   var evidencia=$("#inputEviEscenario").val();
	
   if(actividad.trim() == ""){alert("La actividad es obligatoria"); return;};
   if(pelig.trim() == ""){alert("El peligro es obligatorio"); return;};
   if(riesgoId == -1){alert("El riesgo es obligatorio"); return;};
   if(causaRies.trim() == ""){alert("La causa de riesgo es obligatoria"); return;};
	
   var dataParam={
           id:0,
           actividad:actividad,
           peligro:pelig,
           riesgoId:riesgoId,
           causaRiesgo:causaRies,
           accidenteOcurre:{id:idEvalOcurre}
	         }
	
   callAjaxPost(URL + '/accidente/colaborador/escenario/save', dataParam,
      function(data){
         if(data.CODE_RESPONSE=="05"){
	    guardarEvidenciaAuto(data.nuevoId,"fileEviEscenario",
				 bitsEvidenciaEscenarioAccidente,"/accidente/colaborador/escenario/evidencia/save",
				 function(data){
		                    if(mostrarFormulario == 1){
				       $(".modal").modal("hide");
				       cargarAccidentesPorEvaluar();
				       mensajeUx="<label>Escenario guardado. Ahora ingrese la acción de mejora asociada al escenario del accidente/incidente.</label>";
				       mensajesUx(mensajeUx,1,"ingresarAccionMejoraAccidenteIncidente()","");
				       idMaxAccEscenarioActual=idMaxAccEscenarioActual+1;
				       //console.log(idMaxAccEscenarioActual);
				       //alert("Escenario guardado");
		                    }else{
		                       $(".modal").modal("hide");
				       cargarAccidentesPorEvaluar();
				       mensajeUx="<label>Escenario guardado.</label>";
				       mensajesUx(mensajeUx,1,"");
		                    }
			         });
	 }
     });
}

function ingresarAccionMejoraAccidenteIncidente(){
    $("#modalMensajeUx").modal("hide");
    agregarAccionMejoraEscenario();  
 }

function procesarResultadoGuardarEviEscenario(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviEscenario",
				bitsEvidenciaEscenarioAccidente,"/accidente/colaborador/escenario/evidencia/save",
				function(data){
					console.log("evidencia guardada !");
		},"id");
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
var accionMejoraColaboradorId =0;
var listFullAccionesEscenario = [];
var accionMejoraColaboradorIndex = 0;

function agregarAccionMejoraEscenario(){
 
    var dataParamAux = {
	    mdfId : getSession("unidadGosstId"),
	    empresaId : getSession("gestopcompanyid") 
    };    
    

    callAjaxPost(URL + '/accidente/colaborador/evaluar', dataParamAux,
       function(data){ 
	  
	  listTrabajadores= data.listTrabajadores;
	  
   accionMejoraColaboradorId = 0;
	 
   var listItemsForm=[
	   {sugerencia:" ",label:"<i class='fa fa-info'></i> Clasificación*",inputForm: "",divContainer:"divClasifAccColaboradorA"},
	   {sugerencia:" ",label:"<i class='fa fa-fire'></i> Descripción *",inputForm: "<input class='form-control' id='inputDescAccion'>",divContainer:""},
	   {sugerencia:"Si ya ha realizado la acción, introduzca la evidencia",label:"<i class='fa fa-calendar'></i> Fecha Planificada: ",inputForm: "<input type='date' class='form-control' id='inputDateAccion'>",divContainer:""},
	   {sugerencia:" ",label:"<i class='fa fa-upload'></i> Evidencia : ",inputForm: "<div id='inputEvidenciaAccEscenario'></div>",divContainer:""},
	   {sugerencia:"",label:"*Personal interesado:",inputForm:"",divContainer: "divPersonalInteresado"},
	   {sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""},
	   //{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success' onclick='guardarAccionEscenario(1)'><i class='fa fa-paper-plane-o'></i> Guardar y agregar otra acción</button>",divContainer:""}
		     ];
	
   var text="";
	
   listItemsForm.forEach(function(val,index){
	    text+=obtenerSubPanelModulo(val);
   });
	
   var contenido="<form class='eventoGeneral' id='formAccEscenario'>" +
		    "<div id='tituloEvento'>" + 
		        text+
		    "</div>"+
		 "</form>";
	
   var btnRegresar="<button class='btn btn-default' onclick='regresarAccidentes()' style='font-size:15px;float: left;color:white ;background-color:#008b8b'>" +
		      "<i class='fa fa-arrow-left' aria-hidden='true'></i>" +
		   "</button>"
		      
   var listPaneles={id:"divNuevoEscenario",nombre:" Nueva acción de mejora de escenario de Accidente / Incidente",clase:"",contenido:contenido}
	                  ;
   agregarModalPrincipalColaborador(listPaneles,function(){
       
      crearSelectOneMenuObligMultipleCompleto("selMulPersonalInteresado","",listTrabajadores, "trabajadorId",
	                                      "trabajadorNombre","#divPersonalInteresado","Todos");
       
      crearSelectOneMenuObligUnitarioCompleto("selClasificacionAccA", "",listClasificacionAccionEscenarioColaborador,
	                                      "id","nombre","#divClasifAccColaboradorA","Todos");
   }); 
	
   $("#formAccEscenario").on("submit",function(e){
	      e.preventDefault();
	      guardarAccionEscenario();
   });
	
   var options=
	 {container:"#inputEvidenciaAccEscenario",
	  functionCall:function(){ },
	  descargaUrl: "",
	  esNuevo:true,
	  idAux:"AccEscenario",
	  evidenciaNombre:""};
	 
   crearFormEvidenciaCompleta(options);	
    
   });
}

function editarAccionMejoraEscenario()
{ 
	var listItemsForm=[
		{sugerencia:" ",label:"<i class='fa fa-info'></i> Clasificación*",inputForm: "",divContainer:"divClasifAccColaboradorA"},
		{sugerencia:" ",label:"<i class='fa fa-fire'></i> Descripción* ",
		 inputForm: "<input class='form-control' id='inputDescAccion'>",divContainer:""},
		{sugerencia:"Si ya ha realizado la acción, introduzca la evidencia",label:"<i class='fa fa-calendar'></i> Fecha Planificada: ",inputForm: "<input type='date' class='form-control' id='inputDateAccion'>",divContainer:""},
		{sugerencia:" ",label:"<i class='fa fa-upload'></i> Evidencia : ",inputForm: "<div id='inputEvidenciaAccEscenario'></div>",divContainer:""},
		{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""},
			  ];
	var text="";
	listItemsForm.forEach(function(val,index)
	{
		text+=obtenerSubPanelModulo(val);
	});
	var contenido=
		"<form class='eventoGeneral' id='formAccEscenario'>" +
			"<div id='tituloEvento'>" + 
				text+
			"</div>"+
			"</div>" +
		"</form>";
	var btnRegresar="<button class='btn btn-default' onclick='regresarAccidentes()' style='font-size:15px;float: left;color:white ;background-color:#008b8b'>" +
			"<i class='fa fa-arrow-left' aria-hidden='true'></i></button>"
	var accionObj = listFullAccionesEscenario[accionMejoraColaboradorIndex];
	var listPaneles= 
		 {id:"divNuevoEscenario",nombre:" Nueva acción de mejora de escenario de Accidente / Incidente",clase:"",contenido:contenido}
	                 ;
	agregarModalPrincipalColaborador(listPaneles,function(){
		listClasificacionAccionEscenarioColaborador.forEach(function(val){
			val.selected = 0;
			if(val.id == accionObj.clasificacion.id){val.selected = 1};
		});
		crearSelectOneMenuObligUnitarioCompleto
		 ("selClasificacionAccA", "",listClasificacionAccionEscenarioColaborador, "id","nombre",
				 "#divClasifAccColaboradorA","Todos");
	}); 

	$("#formAccEscenario").on("submit",function(e){
		e.preventDefault();
		guardarAccionEscenario();
	});
	accionMejoraColaboradorId = accionObj.accionMejoraId;
	$("#inputDescAccion").val(accionObj.descripcion);
	$("#inputDateAccion").val(convertirFechaInput(accionObj.fechaRevision));
	
	
	var options=
	{container:"#inputEvidenciaAccEscenario",
			functionCall:function(){ },
			descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+accionObj.accionMejoraId,
			esNuevo:false,
			idAux:"AccEscenario",
			evidenciaNombre:""+accionObj.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
	
}
function eliminarAccionMejoraEscenario(){
	var r = confirm("¿Está seguro de eliminar esta acción ?");
	if(r){
		var accionObj = listFullAccionesEscenario[accionMejoraColaboradorIndex];
		accionMejoraColaboradorId = accionObj.accionMejoraId;
		var dataParam=
		{accionMejoraId: accionMejoraColaboradorId}
		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete', dataParam,
				function(data)
				{
					cargarAccidentesPorEvaluar();
				})
	}
}
function verAccionMejora(idEscen)
{
	$("#subSubMenu"+idEscen).show();
	callAjaxPost(URL+"/gestionaccionmejora/accionmejora",
			{accionMejoraTipoId : 2,
		escenarioId : idEscen},function(data){
		var todo="";
		listFullAccionesEscenario = data.list;
		listFullAccionesEscenario.forEach(function(val,index){
			
		
		var listItemsForm=[
			{sugerencia:"",label:"<i class='fa fa-info'></i> Clasificación: ",inputForm:val.clasificacion.nombre,divContainer:""},
				{sugerencia:"",label:"<i class='fa fa-calendar'></i> Descripcion: ",inputForm:val.descripcion,divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-fire'></i> Fecha de Registro: ",
				inputForm:(val.fechaRevision ==null?val.fechaRealTexto:val.fechaRevisionTexto),divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-user'></i> Responsable: ",inputForm:val.responsableNombre,divContainer:""},
			{sugerencia:" ",label:"<i class='fa fa-upload'></i> Evidencia: ",inputForm: "<a target='_blank' class='efectoLink' href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>"+val.evidenciaNombre+"</a>",divContainer:""}
		];
		var text="";
		listItemsForm.forEach(function(val1,index1)
		{
			text+=obtenerSubPanelModulo(val1);
		});
		todo+=
			"<div class='subSubDetalleAccion  gosst-neutral'>" +
				"<div class='' style=''>" +
					"<section class='containerEvalAccionMejora"+0+"'>" +
						"<a class='efectoLink btn-gestion' onclick='" +
						"accionMejoraColaboradorIndex = "+index+";toggleMenuOpcionAccidentEval(this,"+0+",\"AccionMejora\");'>" +
								"Ver Opciones <i class='fa fa-angle-double-down'></i>" +
						"</a>"+menuOpcionAccidentEval[3]+
					"</section>"+
				"</div>"+
				"<div class='row'>" +
					"<section class='col col-xs-9'>" +
						"<strong>"+
							"ACCIÓN DE MEJORA "+(index+1)+
						"</strong>"+
					"</section>"+
				"</div>"+
				text+
			"</div>";
		});
		$("#subSubMenu"+idEscen).html(todo);
	});
		
}

function guardarAccionEscenario(hasOtroNuevo){
   var listPersonalInteresadoId = [];
   var personalInteresadoId = $("#selMulPersonalInteresado").val();
	
   if(personalInteresadoId != null){
      personalInteresadoId.forEach(function(val){
         listPersonalInteresadoId.push(parseInt(val));
      });
   } 
    
   var escenarioId;
   
   if(mostrarFormulario == 1){
      escenarioId = idMaxAccEscenarioActual;
   }else{
      escenarioId = listFullEscenarios[indexEscenario].id;
   }
    
   var clasificacionId = $("#selClasificacionAccA").val();
   var descripcion = $("#inputDescAccion").val();
   var fechaRevision = convertirFechaTexto($("#inputDateAccion").val());
   var existe = comprobarFieInputExiste("fileEviAccEscenario");
   
   if(descripcion.trim() == ""){
      alert("La descripción es obligatoria");
      return;
   }
   
   if(fechaRevision == null && !existe.isValido){
      alert("Ingresar fecha planificada o evidencia");
      return;
   }
	
   var dataParam={
      accionMejoraId: accionMejoraColaboradorId,
      escenarioId: escenarioId,
      descripcion: descripcion,
      fechaRevision: fechaRevision,
      clasificacion: {id: clasificacionId},			
      responsableNombre: "",
      responsableMail: "",
      estadoId: 1,
      inversionAccion: 0,
      accionMejoraTipoId: 2,
      horaPlanificada: "13:00:00",
      listPersonalInteresadoId: (listPersonalInteresadoId.length == 0?null:listPersonalInteresadoId),
      trabajadorResponsableId: getSession("trabajadorGosstId") 
   };
   
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 guardarEvidenciaAuto(data.nuevoId,"fileEviAccEscenario",bitsEvidenciaEscenarioAccidente,
	 "/gestionaccionmejora/accionmejora/evidencia/save",function(){
	    $(".modal").modal("hide");
	    //alert("Acción de mejora guardada");
	    mensajeUx = "<label>Acción de mejora guardada</label>";
	    mensajesUx(mensajeUx,1,"ocultarMensajesUx();regresarAEscenario();");
	    //verEscenario(indexAccidenteColaborador);
         },"accionMejoraId");
      }
   });
}
 
function regresarAEscenario(){
    console.log(mostrarFormulario);
   if(mostrarFormulario == 1){
      cargarAccidentesPorEvaluar();
   }else{
      verEscenario(indexAccidenteColaborador);
   }
}

function agregarPanelPrincipalColaborador(listPaneles)
{
	listPaneles.forEach(function(val,index)
	{
		$(".divListPrincipal").append(
				"<div id='"+val.id+"' class='"+val.clase+"' >" +
					"<div class='tituloSubList'></div>" +
					"<div class='contenidoSubList'>" +
					val.contenido+
					"</div>" +
				"</div>");
		var btndesplegar="<button class='btn btn-success' onclick='toggleContenido(\""+val.id+"\");'><i class='fa fa-caret-down fa-2x' aria-hidden='true'></i></button>";
		$("#"+val.id+" .tituloSubList").html(val.nombre +btndesplegar);
	});
}
function toggleContenido(iddiv)
{
	$("#"+iddiv+" .contenidoSubList").toggle();
}
function regresarAccidentes()
{
	$(".divListPrincipal > div").show();
	$(".divListPrincipal > .divIniciales").show(); 
	$("#divNuevoEscenario").remove();
	$("#divNuevoEscenario").remove();
}





var listFullAccionesAccidente=[];
function verAccionesAccidenteMovil(index){
	var accidenteObj=listFullAccidentesMovil[index]; 
	var dataParam={  
			accidenteId:accidenteObj.accidenteId
			};
	//  
	$("#detalleAccionAccidente"+accidenteObj.accidenteId).siblings(".divMovilHistorialTrabajador").hide();
	
	$("#detalleAccionAccidente"+accidenteObj.accidenteId).toggle() 
	//
	callAjaxPost(URL + '/accidente/acciones', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05": 
			listFullAccionesAccidente=data.list;
			
			$("#detalleAccionAccidente"+accidenteObj.accidenteId).html("")
			var numPositivo=0;
			listFullAccionesAccidente.forEach(function(val,index){  
				var claseGosst="gosst-neutral";  
				if(val.estadoId==2 ){
					numPositivo++;
					claseGosst="gosst-aprobado"
				}
				$("#detalleAccionAccidente"+accidenteObj.accidenteId)
				.append(
						"<div id='divMovilAccionAcc"+val.accionMejoraId+"'>" +
						"<div class='detalleAccion "+claseGosst+"'>" +
					 
						"<i aria-hidden='true' class='fa fa-caret-right'></i>Solicitud: "+val.solicitud.resumen+"" +
						"<i aria-hidden='true' class='fa fa-caret-right'></i>Tipo: "+val.tipoAccionNombre+"" +
						"<i aria-hidden='true' class='fa fa-caret-right'></i>Descripción: "+val.descripcion+"" +
					"<i aria-hidden='true' class='fa fa-calendar'></i>Fecha: "+val.fechaRevisionTexto+"" + 
					"<i aria-hidden='true' class='fa fa-calendar'></i>Estado: "+val.estadoCumplimientoNombre+"" + 
					"<i aria-hidden='true' class='fa fa-user'></i>Responsable: "+val.responsableNombre+"" + 
					
					
							"</div>" );
			});
			
			
			break;
			default:
				alert("nop");
				break;
		}
	})
}

function verDetalleAccidenteMovil(index){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilIncidenteProy");
	editarDiv.remove();
	var accidenteObj=listFullAccidentesMovil[index];
	var textFormTrabajador="";
	var textAfectados=accidenteObj.nombreAccidentadosInterno+" "+accidenteObj.nombreAccidentadosExterno;
	if(accidenteObj.nombreAccidentadosInterno.length==0 && accidenteObj.nombreAccidentadosExterno.length==0){
		textAfectados="Sin trabajadores afectados"
	}
	var listItemsFormTrab=[
   {sugerencia:"",label:"Hora",inputForm:accidenteObj.horaTexto,divContainer:""},
   
   {sugerencia:"",label:"Lugar",inputForm:accidenteObj.areaOcurrio.areaName,divContainer:""},
   {sugerencia:"",label:"Afectados",inputForm:textAfectados,divContainer:""},
   {sugerencia:"",label:"Categoría",inputForm:accidenteObj.accidenteSubTipoNombre,divContainer:""},
   {sugerencia:"",label:"Descripción ",inputForm:accidenteObj.accidenteDescripcion,divContainer:""}
   
    		];
	listItemsFormTrab.forEach(function(val,index){
		textFormTrabajador+=obtenerSubPanelModulo(val);
	});
	var listPanelesPrincipal=[];
	 listPanelesPrincipal.push(
			 {id:"editarMovilIncidenteProy" ,clase:"contenidoFormVisible",
				nombre:""+" ",
				contenido:"<form id='formEditarIncidenteProy' class='eventoGeneral'>"+textFormTrabajador+"</form>"}
					);
	 agregarPanelesDivPrincipal(listPanelesPrincipal); 
	 var editarDiv=$("#editarMovilIncidenteProy");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Detalle de "+accidenteObj.accidenteTipoNombre+" del día "+accidenteObj.fechaTexto);
	
	var eviNombre=accidenteObj.evidenciaNombre;
	var options=
	{container:"#eviInciProy",
			functionCall:function(){ },
			descargaUrl: "/contratista/incidente/evidencia?id="+accidenteObj.id,
			esNuevo:false,
			idAux:"Incidente",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);
}