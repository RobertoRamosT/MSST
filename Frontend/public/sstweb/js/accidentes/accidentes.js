
var banderaEdicion;

var accidenteId;
var accidenteTipoId;
var accidenteInformeId;
var contador2;

var listProyectos;var listClimas;var listAreasAcc;
var listAccidenteTipo;
var listAccidenteSubTipo;
var listAccidenteSubSubTipo;
var listAccidenteClasificacion;
var listAccidenteSubClasificacion;
var listInforme;
var listCategoriasLesionAn = [];

var accidenteTipoNombre;
var listAgente;
var listClasifAgente;
var listPartesCuerpo;
var listTipoLesion;
var listDniNombre;
var listeventos;

var accSubTipoId;
var accSubSubTipoId
var accClasifId;
var accSubClasifId;

var descripcion;
var accDgReporta;
var accDgJefeReporta;
var accDgLugar;
var accDgFecha;
var accDgHora;
var epTrabOper;
var epTrabScrt;
var epTrabSeguro;
var etNombre;
var etRuc;
var etDireccion;
var etRubro;
var etTrabOper;
var etTrabScrt;
var etTrabSeguro;

var etAseguradora;
var epAseguradora;

var doHorasInterr;
var doValorizacion;
var doObserv;
var doEvidencia;
var invFechaInicio;
var invFehcaFin;
var invFallosSG;
var invAnalisisRazones;var invDeclaracionAccidentado;
var invCausasLaborales;
var invCausasPersonales;
var ClasifAgente;
var invAgente;
var esNuevo;
var listUnidad;
var mdfId;

// Listas TASC
var causasSugeridas=[];
var subTiposEventos=[];
var subSubTiposSugeridos=[];

// Listas filtro
var listDivisionesFiltroAccidente=[];
var listUnidadesInformadas=[];
var listFullAccidentes=[];
var accidenteObj ;
var mensajeUx;

function verFiltroAccidente(){
    $("#modalFiltroAcci").modal("show");
}

function ocultarFiltroAccidente(){
    $("#modalFiltroAcci").modal("hide");
}

$(document).ready(function(){
    $("#labelUnidadAcc").html(getSession("gestopunidad")+" Referida");

    insertMenu();crearFiltroAccidente(valoresFiltroAccidente);

    $("#mdVerif").load("agregaraccionmejora.html");
});

function generarReporteFlash(){
   if(numTrabajadoresAsociadoAccidente > 0){
      alert("Función válida solo para administrador del sistema");
      return;
   }

   var r = confirm("Está seguro de enviar el reporte flash a todos los ("+accidenteObj.numTrabajadoresUnidades+") " +
   	   "colaboradores de las unidades informadas?");

   if(!r){
      return;
   }

   callAjaxPost(URL+"/accidente/flash",{accidenteId: accidenteId},function(data){
      alert("Reporte flash enviado a los trabajadores");
      $("#tdflash"+accidenteId).html(iconoGosst.aprobado+" Enviado")
   });
}

function crearFiltroAccidente(functionCallBack){
    var dataParam={
        idCompany:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostNoLoad(URL+'/accidente/filtro',dataParam,function(data){
        var selUnidadAccidente = crearSelectOneMenu("selUnidadAccidente","verAcordeUnidadFiltroAccidente()",
            data.list,"","matrixId","matrixNameSimple","Todas");

        var listTodos = [{id:0,titulo:"Todos"}];

        data.proyectos = listTodos.concat(data.proyectos);

        var selProyectoAccidente = crearSelectOneMenu("selProyectoAccidente","",
            data.proyectos,"0","id","titulo","Ninguno");

        listDivisionesFiltroAccidente = data.divisiones;

        var contenido = "";

        var listContenido=[
            {sugerencia:"",label:"Desde",inputForm:"<input type='date' class='form-control' id='fechaInicioEvento'>"},
            {sugerencia:"",label:"Hasta",inputForm:"<input type='date' class='form-control' id='fechaFinEvento'>"},
            {sugerencia:"",label:"Proyecto",inputForm:selProyectoAccidente},
            {sugerencia:"",label:"Unidad Test",inputForm:selUnidadAccidente},
            {sugerencia:"",label:"División (colaborador)",inputForm:"",divContainer:"divDivisionFiltro"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroAccidente()'>" +
                                     "<i class='fa fa-times'></i> Cancelar" +
                                 "</button>",
             inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='valoresFiltroAccidente()'>" +
                           "<i class='fa fa-filter'></i> Aplicar filtro" +
                       "</button>"}
        ];

        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });

        var modalOptions={
            id:"modalFiltroAcci",nombre:"<i class='fa fa-filter'></i> Filtros",
            contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };

        crearModalPrincipalUsuario(modalOptions,function(){},true,true);

        var hoy = obtenerFechaActual();
        $("#fechaInicioEvento").val(sumaFechaDias(-180,hoy));$("#fechaFinEvento").val(hoy);

        verAcordeUnidadFiltroAccidente();functionCallBack();
    });
}

function verAcordeUnidadFiltroAccidente(){
    var undadId = $("#selUnidadAccidente").val();
    $("#selDivisionAccidente").remove();

    var selDivisionAccidente = crearSelectOneMenu("selDivisionAccidente","",
        listDivisionesFiltroAccidente.filter(function(val){
            return (val.mdfId == parseInt(undadId));
    }),"","divisionId","divisionName","Todas");

    $("#divDivisionFiltro").html(selDivisionAccidente);

    if(undadId == "-1"){
        $("#selDivisionAccidente").prop("disabled",true);
    }
}

function valoresFiltroAccidente(){
    ocultarFiltroAccidente();cargarPrimerEstado();
}

function cargarPrimerEstado(){
    var valorAntes1 = $("#fechaInicioEvento").val(),valorAntes2 = $("#fechaFinEvento").val();

    $("input").val("");
    $("#fechaInicioEvento").val(valorAntes1);$("#fechaFinEvento").val(valorAntes2);

    banderaEdicion = false;
    mdfId = 0;accidenteId = 0;accidenteObj = {accidenteId:0,areaOcurrio:{}};

    accidenteTipoId = 0;accidenteTipoNombre = "";descripcion = ' ';accDgLugar = ' ';accDgFecha = 0;
    epTrabOper = 0;epTrabScrt = 0;epTrabSeguro = 0;etNombre = ' ';etRuc = 0;etDireccion = ' ';
    etRubro = ' ';etTrabOper = 0;etTrabScrt = 0;etTrabSeguro = 0;epAseguradora = "";etAseguradora = "";
    doHorasInterr = 0;doValorizacion = 0;doObserv = 0;doEvidencia = 0;invFechaInicio = 0;invFehcaFin = 0;
    invFallosSG = ' ';invAnalisisRazones = ' ';invDeclaracionAccidentado = "";invCausasLaborales = ' ';
    invCausasPersonales = ' ';invAgente = ' ';contador2 = 0;esNuevo = false;

    removerBotones();crearBotones();

    $("#fsBotones").append("<button id='btnGenReporte' type='button' class='btn btn-success' title='Generar reporte obligatorio'>" +
	                           "<i class='fa fa-file-word-o fa-2x'></i> " +
                           "</button>");

    $("#fsBotones").append("<button id='btnFlash' type='button' class='btn btn-success' title='Enviar comunicado del accidente a la empresa'>" +
	                           "<i class='fa fa-envelope fa-2x'></i> " +
	                       "</button>");

    $("#fsBotones").append("<button id='btnAccidenteArea' type='button' class='btn btn-success' title='Calificación de réplica de accidente en áreas áreas'>" +
	                           "<i class='fa fa-calendar-check-o fa-2x'></i> " +
                           "</button>");

    $("#fsBotones").append("<button id='btnAccidenteSeguimiento' type='button' class='btn btn-success' title='Cuadro de seguimiento de Acciones inmediatas y Acciones de Mejora'>" +
	                           "<i class='fa fa-calendar-times-o fa-2x'></i> " +
	                       "</button>");

    $("#fsBotones").append("<button id='filtroAplicarBuscador' type='button' onclick='verFiltroAccidente()' title='Filtros' class='btn btn-success'>" +
	                           "<i class='fa fa-2x fa-filter'></i>" +
	                       "</button>");

    $("#fsBotones").append("<button id='btnReporteConsolidado' type='button' onclick='generarInformeConsolidadoAccidente()' title='Consolidado' class='btn btn-success'>" +
	                           "<i class='fa fa-2x fa-file-excel-o' aria-hidden='true'></i>" +
                           "</button>");

    $("#fsBotones").append("<button id='btnRegistroHorasHombre' type='button' onclick='verModalRegistroHorasHombre()' title='Ver la ventana emergente Registro de horas-hombre " +
                                    "trabajadas (Nuevo registro y ver consolidado)' class='btn btn-success'>" +
	                           "<i class='fa fa-2x fa-book' aria-hidden='true'></i>" +
	                       "</button>");

	$("#fsBotones").append("<button id='btnPerfilesSsoma' type='button' class='btn btn-info' onclick='verPerfilesSsomaAcc()' " +
		                            "title='Ver la lista de perfiles SSOMA.'>" +
		                       "<i class='fa fa-2x fa-list-alt'></i> <i class='fa fa-user'></i>" +
		                   "</button>");

	$("#fsBotones").append("<button id='btnQuickSightAccidente' type='button' class='btn btn-success' onclick='verGraficosQuickSightAccidente()' " +
		                           "title='Ver los gráficos en QuickSight.'>" +
		                       "<i class='fa fa-bar-chart fa-2x'></i>" +
		                   "</button>");

    deshabilitarBotonesEdicion();

    $("#btnFlash").hide();$("#btnFlash").attr("onclick","javascript:generarReporteFlash();");
    $("#btnGenReporte").hide();$("#btnGenReporte").attr("onclick","javascript:generarHojaRuta();");
    $("#btnReporteConsolidado").show();$("#btnUpload").hide();

    $("#btnNuevo").attr("onclick","javascript:nuevoAccidente();");$("#btnCancelar").attr("onclick","javascript:cancelarAccidente();");
    $("#btnGuardar").attr("onclick","javascript:guardarAccidente();");$("#btnEliminar").attr("onclick","javascript:eliminarAccidente();");
    $("#btnAccidenteArea").attr("onclick","javascript:verAreasAccidentes();");$("#btnAccidenteSeguimiento").attr("onclick","javascript:verAccionesAccidentes();");

    volverDivAccidente();

    var dataParam={
	    idCompany:parseInt(getSession("gestopcompanyid")),fechaInicioPresentacion:$("#fechaInicioEvento").val(),
	    fechaFinPresentacion:$("#fechaFinEvento").val(),unidadId:($("#selUnidadAccidente").val() == -1?null:$("#selUnidadAccidente").val()),
	    proyectoId:($("#selProyectoAccidente").val() == -1?null:$("#selProyectoAccidente").val()),
	    divisionId:($("#selDivisionAccidente").val() == -1?null:$("#selDivisionAccidente").val())
    };

    callAjaxPost(URL+'/accidente/version_dos',dataParam,procesarDataDescargadaPrimerEstado);
}

function generarInformeSeguimientoAccidente(){
   window.open(URL+"/accidente/informe/seguimiento?empresaId="+getSession("gestopcompanyid") +
      "&inicio="+$("#fechaInicioEvento").val()+"&fin="+$("#fechaFinEvento").val());
}

function generarInformeConsolidadoAccidente(){
   window.open(URL+"/accidente/informe/consolidado?empresaId="+getSession("gestopcompanyid") +
      "&inicio="+$("#fechaInicioEvento").val()+"&fin="+$("#fechaFinEvento").val());
}

function verAccionesAccidentes(){
   volverDivAccionessAccidente();
   $("#btnExcelSeg").attr("onclick","generarInformeSeguimientoAccidente()")

   var dataParam={
	  idCompany: getSession("gestopcompanyid"),
	  fechaInicioPresentacion: $("#fechaInicioEvento").val(),
	  fechaFinPresentacion: $("#fechaFinEvento").val(),
	  unidadId: ($("#selUnidadAccidente").val()==-1?null:$("#selUnidadAccidente").val()),
	  proyectoId: ($("#selProyectoAccidente").val()==-1?null:$("#selProyectoAccidente").val()),
	  divisionId: ($("#selDivisionAccidente").val()==-1?null:$("#selDivisionAccidente").val())
		 };

		callAjaxPost(URL + '/accidente/acciones/seguimiento', dataParam,
				function(data){
			$("#tblSegAccionAcc tbody tr").remove();
			var listAccidentes = data.accidentes;
			var listTrabajadoresPendientes = [];
			listAccidentes.forEach(function(val){
				var textoAcciones = "";
				var textoAccionInicial ="";
				if(val.acciones.length == 0){
					val.acciones.push(
							{
								accionMejoraId : 0,
								descripcion:"--",
								fechaRevisionTexto :"--",
								responsableNombre :"--",
								fechaRealTexto :"--",
								estadoCumplimientoNombre :"--",
								descripcion11 :"--",
								descripcion12 :"--",
								descripcion21 :"--",
								descripcion22 :"--",

							}
					)
				}
				val.acciones.forEach(function(val1,index1){
					if((val1.estadoId == 1 || val1.estadoId == 3) && val1.accionMejoraId > 0){
						var isAgregado = false;
						listTrabajadoresPendientes.forEach(function(val2){
							if(val2.trabajadorId == val1.trabajadorResponsableId){
								isAgregado = true;
							}
						});
						if(!isAgregado){
							listTrabajadoresPendientes.push({trabajadorId : val1.trabajadorResponsableId,
								nombre : val1.responsableNombre,acciones:[]})
						}
						listTrabajadoresPendientes.forEach(function(val2){
							if(val2.trabajadorId == val1.trabajadorResponsableId){
								val2.acciones.push(val1)
							}
						});

					}
					val1.descripcion11 ="--",
					val1.descripcion12 ="--",
					val1.descripcion21 ="--",
					val1.descripcion22 ="--";
					if(val1.tipoAccionId == 1 && val1.clasificacion.id == 1){val1.descripcion11 = val1.descripcion};
					if(val1.tipoAccionId == 1 && val1.clasificacion.id == 2){val1.descripcion12 = val1.descripcion};
					if((val1.tipoAccionId == 2 || val1.tipoAccionId == 3) && val1.clasificacion.id == 1){val1.descripcion21 = val1.descripcion};
					if((val1.tipoAccionId == 2 || val1.tipoAccionId == 3) && val1.clasificacion.id == 2){val1.descripcion22 = val1.descripcion};
					var textEvi = "";
					if(val1.evidenciaNombre!="" && val1.evidenciaNombre != null){
						textEvi = "<a href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val1.accionMejoraId+"' target='_blank' class='efectoLink'><i class='fa fa-download'></i>Descargar</a>"
					}
					var textoIn = "<td rowspan = '1'>"+val1.descripcion11+"</td>" +
					"<td rowspan = '1'>"+val1.descripcion12+"</td>" +
					"<td rowspan = '1'>"+val1.descripcion21+"</td>" +
					"<td rowspan = '1'>"+val1.descripcion22+"</td>" +
					"<td rowspan = '1'>"+val1.fechaRevisionTexto+"</td>" +
					"<td rowspan = '1'>"+val1.responsableNombre+"</td>" +
					"<td rowspan = '1'>"+val1.estadoCumplimientoNombre+"</td>" +
					"<td rowspan = '1'>"+val1.fechaRealTexto+"</td>"+
					"<td rowspan = '1'>"+textEvi+"</td>" ;

					if(index1 == 0){
						textoAccionInicial = textoIn;
					}else{
						textoAcciones+="<tr>" +
						textoIn
						"</tr>"
					}

				});

				$("#tblSegAccionAcc tbody")
				.append("<tr  >" +
						"<td rowspan='"+val.acciones.length+"'>"+val.accidenteTipoNombre+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.accidenteDescripcion+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.fechaTexto+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.areaOcurrio.areaName+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.lugar+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.tipoContacto.nombre+"</td>" +
						"<td rowspan='"+val.acciones.length+"'>"+val.investigacionAnalisisRazones+"</td>" +
						textoAccionInicial+
						"</tr>"+
						textoAcciones+""
						);
			});
			var numAccionesPendientes = 0;
			listTrabajadoresPendientes.forEach(function(val){
				numAccionesPendientes+= val.acciones.length;
			});
			if(listTrabajadoresPendientes.length == 0){
				$("#btnNotificarSeg").attr("onclick","").html("Sin responsables por notificar");
			}else{
				$("#btnNotificarSeg").attr("onclick","enviarCorreosSeguimientoAcciones()")
				.html("<i class='fa fa-envelope-o fa-2x' Title='Notificar "+listTrabajadoresPendientes.length+" trabajador(es)" +
						" acerca de "+numAccionesPendientes+" accion(es) pendiente(s)'></i> ");
			}

			resizeDivWrapper("wrapSegAcc",160);
			goheadfixedY("#tblSegAccionAcc","#wrapSegAcc");
		});
}
function enviarCorreosSeguimientoAcciones(){
var dataParam = {

			idCompany : getSession("gestopcompanyid"),
			fechaInicioPresentacion:$("#fechaInicioEvento").val(),
			fechaFinPresentacion:$("#fechaFinEvento").val(),

			};

		callAjaxPost(URL + '/accidente/acciones/seguimiento/notificar', dataParam,
				function(data){
			if(data.CODE_RESPONSE == "05"){
				alert("Se notificaron a sus correos a los responsables");
			}else{
				alert("Ocurrió un error")
			}

		});
}
function verAreasAccidentes(){
	volverDivAreasAccidente();
	var dataParam = {

			idCompany : getSession("gestopcompanyid"),
			fechaInicioPresentacion:$("#fechaInicioEvento").val(),
			fechaFinPresentacion:$("#fechaFinEvento").val(),

			};

		callAjaxPost(URL + '/accidente/areas/calificacion', dataParam,
				function(data){
			$("#tblAreaAccidente thead tr").remove();
			$("#tblAreaAccidente tbody tr").remove();
			var listAccidentes = data.accidentes;
			var listAreas = data.areas;
			$("#tblAreaAccidente thead")
			.append("<tr id='trunidadacc'><td style='width : 190px'>.. /Unidad</td></tr>"+
					"<tr id='trareaacc'><td>.. / Área</td></tr>")
			listAreas.forEach(function(val){
				$("#tblAreaAccidente thead #trareaacc")
				.append("<td class='tb-acc' style='width: 150px'>" +val.areaName+"</td>");
				$("#tblAreaAccidente thead #trunidadacc")
				.append("<td  class='tb-acc'  style='width: 150px'>" +val.matrixName+"</td>");
			});
			listAccidentes.forEach(function(val){
				val.areasInternas = listAreas;
				$("#tblAreaAccidente tbody")
				.append("<tr id='traccar"+val.accidenteId+"'>" +
						"<td>("+val.fechaTexto+") "+val.accidenteDescripcion+"</td>" +

						"</tr>");
				val.areasInternas.forEach(function(val1){
					$("#traccar"+val.accidenteId).append("<td id='tdareval"+val1.areaId+"'>O</td>")
				});
				val.evalacionesAreas.forEach(function(val1){
					if(val1.id == null){
						$("#traccar"+val.accidenteId+" #tdareval"+val1.areaEvaluada.areaId).html("X").css({"background-color":colorPuntajeGosst(0)});
					}else{
						$("#traccar"+val.accidenteId+" #tdareval"+val1.areaEvaluada.areaId).html("").css({"background-color":colorPuntajeGosst(1)});
					}

				})

			});
			resizeDivWrapper("wrapAccArea",220);
			goheadfixedZ("#tblAreaAccidente","#wrapAccArea",100);

		});
}
function volverDivAreasAccidente(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divAreasAccidente").show();
	$("#generalModuloAccidente h2").html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> > Cuadro de evaluación de accidentes por las áreas de la empresa")

}
function volverDivAccionessAccidente(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divSegAccionesAccidente").show();
	$("#generalModuloAccidente h2").html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> > Cuadro de seguimiento de Acciones de mejora”")

}

function volverQuicksight(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divContainQuicksightAccidente").show();
	$("#generalModuloAccidente h2").html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> > Análisis de Datos")

}

function llamarUnidades(){
    var selUnidad= crearSelectOneMenuOblig("selUnidad","verAcordeUnidadAccidente()",listUnidadesInformadas,mdfId,
		"matrixId","matrixNameSimple");

	$("#slcUnidadAcc"+accidenteId).html(selUnidad);

	$("#labelUnidadAcc").html(getSession("gestopunidad")+" Referida");

	verAcordeUnidadAccidente();
}

function verAcordeUnidadAccidente(){
	var unidId = parseInt($("#selUnidad").val());
	var selAreaAcc= crearSelectOneMenu("selAreaAcc","",listAreasAcc.filter(function(val){
		return unidId == val.mdfId;
	}),accidenteObj.areaOcurrio.areaId,"areaId","areaName","Por definir");

	$("#slcAreaAcc").html(selAreaAcc);
}

function guardarModalAccidente(idModal){
    var campoVacio = true;
//  console.log(campoVacio);

    if(accidenteId == 0){
        switch(parseInt(idModal)){
            case 2:
            var accDgFecha= $("#dgFecha").val();

            if(accDgFecha.length == 0){
               $("#mdDatoGeneral").modal("hide");

               mensajeUx="<label>Debe ingresar la Fecha de ocurrencia (en E.Datos " +
               		 "Generales).</label>";
               mensajesUx(mensajeUx,2,"verDatosGenerales("+accidenteId+")","IngFecOcu");

               $("#btnDevolverValorIngFecOcu").on("click",function(){
                  $("#modalMensajeUxIngFecOcu").modal("hide");
               });
            }
            break;
      }
      return;
    }

	var listUnidadesInput=$("#selUnidadesInformadas").val();
	var listUnidadesFinal=[];

	if(listUnidadesInput!=null){
	   listUnidadesInput.forEach(function(val)
	     {
	       listUnidadesFinal.push({matrixId:parseInt(val)});
	     });
	}

    switch(parseInt(idModal)){

	case 1:
		var subTipoAcc=$("#selAccSub").val().split('-');
		var accidenteSubTipoId=subTipoAcc[0];
		var subClasifAcc=$("#subClasiffAcc option:selected").val();
		var clasifAcc=$("#clasifAcc option:selected").val();
		var detalleOtros=$("#accDetalleOtros").val();

		if(parseInt(accidenteSubTipoId)!=24 && parseInt(accidenteSubTipoId)!=72){
			detalleOtros="";
		}
		console.log(clasifAcc);
		if(clasifAcc!=2){
			subClasifAcc=null;
		}

		if(accidenteTipoId!=1){
			subClasifAcc=null;
			clasifAcc=null;
		}

		var subSubTipoAcc=$("#selAccSubSub").val().split('-');
		var accidenteSubSubTipoId=subSubTipoAcc[0];
		var descripcion=$("#accDescr").val();
		var climaId = $("#selClimaAcc").val();
		var areaId = $("#selAreaAcc").val();
		var proyectoId=$("#selProyecto").val();
		var categoriaLesionAnId = (parseInt($("#slcClasificacionInternacional").val()) == -1?null:parseInt($("#slcClasificacionInternacional").val()));
console.log(categoriaLesionAnId);
		proyectoId=(proyectoId=="-1"?null:proyectoId)
		climaId=(proyectoId=="-1"?null:climaId)

		accidenteObj.accidenteDescripcion = descripcion;
		accidenteObj.accidenteSubTipoId = accidenteSubTipoId;
		accidenteObj.accidenteSubSubTipoId = accidenteSubSubTipoId;
		accidenteObj.detalleOtros = detalleOtros;
		accidenteObj.clima= {id:climaId};
		accidenteObj.areaOcurrio ={areaId: areaId};
		accidenteObj.proyectoId = proyectoId;
		accidenteObj.accidenteClasificacionId = clasifAcc;
		accidenteObj.accidenteSubClasificacionId = subClasifAcc;
		accidenteObj.categoriaLesionAnId = categoriaLesionAnId;

		break;
	case 2:
		/** 2**/
		var accDgReporta=$("#dgReporta").val();
		var accDgJefe=$("#dgJefe").val();
		var accDgLugar=$("#dgLugar").val();
		var accDgHora=$("#dgHora").val();;
		var accDgFecha= $("#dgFecha").val();

		/*
		if(accDgFecha.length == 0){
		   var d = new Date();

		   var month = d.getUTCMonth()+1;
		   var day = d.getUTCDate();

		   var fechaHoy = d.getUTCFullYear() + '-' +
			         (month<10 ? '0' : '') + month + '-' +
			         (day<10 ? '0' : '') + day;
			          accDgFecha = fechaHoy;
		 }

		 if(accDgHora.length == 0){
			var tiempo = new Date();
			var hora = tiempo.getHours();
			var minuto = tiempo.getMinutes();
			var segundo = tiempo.getSeconds();

			accDgHora = hora + ":" +
			minuto + ":00"  ;
		 }
		 */
		 accidenteObj.encargadoReportar=accDgReporta;
		 accidenteObj.jefeEncargadoReportar=accDgJefe;
		 accidenteObj.lugar = accDgLugar;
		 accidenteObj.fecha = accDgFecha+" "+accDgHora;
		 accidenteObj.fechaN= accDgFecha;

		 if(accDgFecha.length == 0){
		    campoVacio = false;
		 }

		 console.log(campoVacio);

		 break;
	case 3:
		/** 3**/
		var epTrabSeguro=$("#epTrabSeguro").val();
		var epTrabOper=$("#epTrabOper").val();
		var epTrabScrt=$("#epTrabScrt").val();
		//if(epTrabSeguro.length == 0){
		//	epTrabSeguro =0;
		//}
		if(epTrabOper.length == 0){
			epTrabOper = 0;
		}

		if(epTrabScrt.length == 0){
			epTrabScrt = 0;
		}
		/** 4**/
		var etNombre=$("#etNombre").val();
		var etRuc=$("#etRuc").val();
		var etDireccion=$("#etDireccion").val();
		var etRubro=$("#etRubro").val();
		var etTrabOper=$("#etTrabOper").val();
		var etTrabScrt=$("#etTrabScrt").val();
		var etTrabSeguro=$("#etTrabSeguro").val();
		var epAseguradora = $("#epAseguradora").val();
		var etAseguradora = $("#etAseguradora").val();

		if(etRuc.length == 0){
			etRuc =0;
		}

		if(etTrabOper.length == 0){
			etTrabOper = 0;
		}

		if(etTrabScrt.length == 0){
			etTrabScrt = 0;
		}
		//if(etTrabSeguro.length == 0){
		//	etTrabSeguro = 0;
		//}
		if(epAseguradora.length == 0){
		    epAseguradora = "";
		}

		if(etAseguradora.length == 0){
		    etAseguradora = "";
		}

		accidenteObj.trabOperacion = epTrabOper;
		accidenteObj.trabSCRT = epTrabScrt;
		accidenteObj.trabAsegurados = epTrabSeguro;
		accidenteObj.terceroNombre = etNombre;
		accidenteObj.terceroRuc = etRuc;
		accidenteObj.terceroDireccion =  etDireccion;
		accidenteObj.terceroRubro = etRubro;
		accidenteObj.tercerotrabOperacion = etTrabOper;
		accidenteObj.tercerotrabSCRT = etTrabScrt;
		accidenteObj.tercerotrabAsegurados = etTrabSeguro;
		accidenteObj.trabAseguradora = epAseguradora;
		accidenteObj.terceroAseguradora = etAseguradora;
		break;

	case 4:
		/** 5**/
		var doHorasInterr = ($("#doHorasInterr").val().length == 0?0:$("#doHorasInterr").val());
		var doValorizacion = ($("#doValorizacion").val().length == 0?0:$("#doValorizacion").val())
		var doObserv = $("#doObserv").val();
		var checkAfectaInfraestructuraDo = ($("#checkAfectaInfraestructuraDo").prop("checked")?1:0);

		accidenteObj.operacionHorasInterrupcion = doHorasInterr;accidenteObj.operacionValor = doValorizacion;
		accidenteObj.operacionObservacion = doObserv;accidenteObj.afectaInfraestructura = checkAfectaInfraestructuraDo;

		break;

	case 5:

		var invFechaInicio=$("#invFechaInicio").val();
		var invFehcaFin=$("#invFehcaFin").val();
		var invAnalisisRazones=$("#invAnalisisRazones").val();
		var invDeclaracionAccidentado = $("#invDeclaracionAccidentado").val();
		var invFallosSG=$("#invFallosSG").val();
		var invCausasLaborales=$("#invCausasLaborales").val();
		var invCausasPersonales=$("#invCausasPersonales").val();
		var invAgente=$("#inputAgente").val();

		var objetoNombre = $("#invObjAcc").val();
		var objetoDescripcion = $("#invDescObjAcc").val();
		var eppDescripcion = $("#invEstadoEppAcc").val();
		var how = $("#inveAccHow").val();

		accidenteObj.investigacionFechaInicio = invFechaInicio;
		accidenteObj.investigacionFechaFin = invFehcaFin;
		accidenteObj.investigacionFallosSistema = invFallosSG;
		accidenteObj.investigacionAnalisisRazones = invAnalisisRazones;
		accidenteObj.investigacionDeclaracionAccidentado = invDeclaracionAccidentado;

		accidenteObj.investigacionCausaLaboral =	invCausasLaborales;
		accidenteObj.investigacionCausaPersonal = invCausasPersonales;
		accidenteObj.investigacionAgente = invAgente;
		accidenteObj.objetoNombre = objetoNombre;
		accidenteObj.objetoDescripcion = objetoDescripcion;
		accidenteObj.eppDescripcion = eppDescripcion;
		accidenteObj.how = how;
		break;
	}

	if(campoVacio){
	    console.log("xyz");
	   accidenteObj.unidades = listUnidadesFinal;
	   callAjaxPost(URL + '/accidente/save', accidenteObj,
			function(){
		guardarEvidenciaAuto(accidenteId,"fileEviAccidenteHow",
				bitsEvidenciaAccidente,'/accidente/evidencia/how/save',
				function(){
		},"accidenteId");
	   });
	}else{
	    console.log("abc")
	    $("#mdDatoGeneral").modal("hide");

	    mensajeUx="Debe ingresar la Fecha de ocurrencia (en E.Datos Generales)."
	    mensajesUx(mensajeUx,2,"verDatosGenerales("+accidenteId+")","IngFecOcu");

	    $("#btnDevolverValorIngFecOcu").on("click",function(){
	       $("#modalMensajeUx").modal("hide");
	    });
	}
}

function cancelarModal(idModal){
    switch(idModal){
		case 1:

	       $("#accDescr").val(descripcion);
               break;

         case 2:

	       $("#dgReporta").val(accDgReporta);
	       $("#dgJefe").val(accDgJefeReporta);
	       $("#dgLugar").val(accDgLugar);
	       $("#dgFecha").val(accDgFecha);
	       $("#dgHora").val(accDgHora);
	       break;

         case 3:

	       $("#epTrabSeguro").val(epTrabSeguro);
	       $("#epTrabOper").val(epTrabOper);
	       $("#etNombre").val(etNombre);
	       $("#etRuc").val(etRuc);
	       $("#etDireccion").val(etDireccion);
	       $("#etRubro").val(etRubro);
	       $("#etTrabOper").val(etTrabOper);
	       $("#etTrabScrt").val(etTrabScrt);
	       $("#etTrabSeguro").val(etTrabSeguro);
	       $("#epAseguradora").val(epAseguradora);
	       $("#etAseguradora").val(etAseguradora);
	       break;

        case 4:
	        $("#doHorasInterr").val(doHorasInterr);
	        $("#doValorizacion").val(doValorizacion);
	        $("#doObserv").val(doObserv);
			$("#checkAfectaInfraestructuraDo").prop("checked",(accidenteObj.afectaInfraestructura == 1?true:false))

	        break;

        case 5:

	      $("#invFechaInicio").val(invFechaInicio);
	      $("#invFehcaFin").val(invFehcaFin);
	      $("#invAnalisisRazones").val(invAnalisisRazones);
	      $("#invDeclaracionAccidentado").val(invDeclaracionAccidentado);
	      $("#invFallosSG").val(invFallosSG);
	      $("#invCausasLaborales").val(invCausasLaborales);
	      $("#invCausasPersonales").val(invCausasPersonales);
	      $("#inputAgente").val(invAgente);
	      break;

	}
}

function devolverTercero(tercero){
	if(tercero==1){
		return tercero +" involucrado";
	}
	if(tercero==0){
		return "No hay involucrados";
	}
	if(tercero>1){
		return tercero +" involucrados";
	}
}

function ponerDescripcion(tipoId,descripcion,subtipo){
	var texto = "";

	if(tipoId == 3){
		texto = (descripcion == null?"":descripcion);
	}else{
		texto = (subtipo == null?descripcion.substr(0,30)+'...':subtipo+"<br>'"+descripcion+"'");
	}

	return texto;
}

var numTrabajadoresAsociadoAccidente = 0;

function procesarDataDescargadaPrimerEstado(data) {
	switch(data.CODE_RESPONSE){
	    case "05":
		    listFullAccidentes = data.list;listUnidadesInformadas = data.unidades_informadas;numTrabajadoresAsociadoAccidente = data.numTrabajadores;

			volverDivAccidente();$("#tblAcc tbody tr").remove();

			listFullAccidentes.forEach(function(val,index){
				var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre),
					trabInternos = (val.nombreAccidentadosInterno.length == 0?"":"*Internos: "+val.nombreAccidentadosInterno),
					trabExternos = (val.nombreAccidentadosExterno.length == 0?"":(trabInternos.length == 0?"":"<br>")+"*Externos: "+val.nombreAccidentadosExterno);

				$("#tblAcc tbody").append(
					"<tr id='tr"+val.accidenteId+"' onclick='javascript:editarAccidente("+val.accidenteId+","+val.accidenteInformeId +","+val.accidenteTipoId+")'>" +
				    	"<td>"+(index+1)+"</td>" +
						"<td id='tdtipInf"+val.accidenteId+"'>"+val.accidenteInformeNombre+"</td>" +
						"<td id='tdaccTipo"+val.accidenteId+"'>"+val.accidenteTipoNombre+" "+val.accidenteSubClasificacionNombre+" "+val.tipoContacto.nombre+"</td>" +
						"<td id='slcUnidadAcc"+val.accidenteId+"'>"+val.unidadNombre+"</td>" +
						"<td id='tdDG"+val.accidenteId+"'>"+val.fechaTexto+"</td>" +
						"<td id='tdEsp"+val.accidenteId+"'>" +
					    	"<p align='left' style='margin-left:0.2cm;'>" +
					        	"<strong>División - "+getSession("gestoparea")+": </strong>"+val.areaOcurrio.areaName +
					        	"<br>"+ponerDescripcion(val.accidenteTipoId,"<strong>Descripción: </strong>"+val.accidenteDescripcion,
						    	"<strong>Tipo de incidente: </strong>"+val.accidenteSubTipoNombre) +
					    	"</p>" +
					    "</td>" +
						"<td id='tdInc"+val.accidenteId+"'>"+val.cantidadCaracteristicasCheck+" / "+val.cantidadCaracteristicasTotal+"</td>" +
						"<td id='tdInv"+val.accidenteId+"'>"+(trabInternos.length == 0 && trabExternos.length == 0?"------":trabInternos+trabExternos)+"</td>" +
						"<td id='tdDM"+val.accidenteId+"'>S/. "+val.operacionValor+"</td>" +
				    	"<td id='tdIA"+val.accidenteId+"'>"+val.numImpac+" Impacto</td>" +
						"<td id='tdInve"+val.accidenteId+"'>"+val.investigacionAnalisisRazones+"</td>" +
						"<td id='tdevi"+val.accidenteId+"'>"+evidenciaNombre+"</td>" +
						"<td id='tdunidinfor"+val.accidenteId+"'>"+val.unidadesInformadasNombre+"</td>" +
				    	"<td id='tdcalifacc"+val.accidenteId+"'>"+val.areasEvaluadasNum+" / " +val.areasEvalTotalNum+"</td>" +
						"<td id='tdaccrespo"+val.accidenteId+"'>"+val.numAccionesColaboradorCompletas+" / "+val.numAccionesColaboradorTotal+"</td>" +
						"<td id='tdAM"+val.accidenteId+"'>"+val.iconoEstadoAccion+" "+val.nombreAccionMejora+"</td>" +
						"<td id='tdAccProy"+val.accidenteId+"'>"+(val.proyectoId != null?val.indicadorAcciones:val.accionesSolicitudCompletas+" / "+val.accionesSolicitudTotal)+"</td>" +
						"<td id='tdflash"+val.accidenteId+"'>"+(val.fechaReporteFlashTexto.length == 0?"":iconoGosst.aprobado+" "+val.fechaReporteFlashTexto)+"</td>" +
					"</tr>");
				});

				formatoCeldaSombreableTabla(true,"tblAcc");

				if(getSession("linkCalendarioAccidenteId") != null){
			    	listFullAccidentes.every(function(val,index3){
				    	if(val.accidenteId == parseInt(getSession("linkCalendarioAccidenteId"))){
					    	editarAccidente(val.accidenteId,val.accidenteInformeId,val.accidenteTipoId);
							sessionStorage.removeItem("linkCalendarioAccidenteId");

							return false;
						}else{
					    	return true;
						}
					});
				}

				completarBarraCarga();

			break;

		default:
			alert("Ocurrió un error al traer los Accidentes!");
	}

	resizeDivWrapper("wrapper",170); /*antes -> 300*/
	goheadfixedY("#tblAcc","#wrapper");
}

var hasTablasFijas= 1;

function editarAccidente(paccidenteId,paccidenteInformeId,paccidenteTipoId){
	if(!banderaEdicion){
		formatoCeldaSombreableTabla(false,"tblAcc");

      	accidenteId = paccidenteId;accidenteTipoId = paccidenteTipoId;accidenteInformeId = paccidenteInformeId;

      	$("#tr"+accidenteId).addClass("fila-edicion");

      	var dataParam={
	        accidenteId:accidenteId,idCompany:parseInt(getSession("gestopcompanyid")),inicioEmpresa:hasTablasFijas
		};

      	callAjaxPost(URL+'/accidente/detalle',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	    	    case "05":
	       		    var list = data.list;

	       			if(hasTablasFijas == 1){
	          			$("#divContainAccidenteCalificacionArea").show();
						var dataTodas = [{areaId:0,areaName:"TODAS",selected:0}];

						$("#divContainAccidenteCalificacionArea form").on("submit",function(e){
							e.preventDefault();
						}).html("Áreas: <div style='width:500px' id='divFiltroAreaAccidente'></div>");

						crearSelectOneMenuObligUnitarioCompleto("selAreasCalif","verAccionesAreaAccidente(0)",dataTodas.concat(data.areas),
							"areaId","areaName","#divFiltroAreaAccidente","TODAS");
						$("#divContainAccidenteCalificacionArea").hide()

						listProyectos = data.proyectos;listClimas = data.listClimas;listAreasAcc = data.areas;
						listAccidenteSubTipo = data.listAccSubTipo;listAccidenteSubSubTipo = data.listAccSubSubTipo;listAgente = data.listagente;
						listClasifAgente = data.listclasifage;listPartesCuerpo = data.listparte;listTipoLesion = data.listLesion;
						listDniNombre = data.listDniNombre;listeventos = data.listEventos;causasSugeridas = data.causasSugeridas;
						subTiposEventos = data.subTiposEventos;subSubTiposSugeridos = data.subSubTiposSugeridos;hasTablasFijas = 0;
						listCategoriasLesionAn = data.listCategoriasLesionAn;
					}

				    accSubSubTipoId = list.accidenteSubSubTipoId;accClasifId = list.accidenteClasificacionId;accSubClasifId = list.accidenteSubClasificacionId;
				    accSubTipoId = list.accidenteSubTipoId;descripcion = list.accidenteDescripcion;accDgReporta = list.encargadoReportar;
				    accDgJefeReporta = list.jefeEncargadoReportar;accDgLugar = list.lugar;accDgFecha = list.fecha.substring(0,10);
				    accDgHora = list.fecha.substring(11,19);epTrabOper = list.trabOperacion;epTrabScrt = list.trabSCRT;
				    epTrabSeguro = list.trabAsegurados;etNombre = list.terceroNombre;etRuc = list.terceroRuc;
				    etDireccion = list.terceroDireccion;etRubro = list.terceroRubro;etTrabOper = list.tercerotrabOperacion;
				    etTrabScrt = list.tercerotrabSCRT;etTrabSeguro = list.tercerotrabAsegurados;epAseguradora = list.trabAseguradora;
				    etAseguradora = list.terceroAseguradora;doHorasInterr = list.operacionHorasInterrupcion;doValorizacion = list.operacionValor;
				    doObserv = list.operacionObservacion;doEvidencia = list.operacionEvidencia;invFechaInicio = list.investigacionFechaInicio;
				    invFehcaFin = list.investigacionFechaFin;invFallosSG = list.investigacionFallosSistema;invAnalisisRazones = list.investigacionAnalisisRazones;
				    invDeclaracionAccidentado = list.investigacionDeclaracionAccidentado;invCausasLaborales = list.investigacionCausaLaboral;
				    invCausasPersonales = list.investigacionCausaPersonal;invAgente = list.investigacionAgente;ClasifAgente = list.investigacionClasifAgenteId;
					mdfId = list.unidadId;accidenteObj = list;

					$("#tdtipInf"+accidenteId).html("<select id='selTipoInf' class='form-control' onclick='verCategAcordeInforme()'>" +
						    "<option value='1'>Preliminar</option>" +
						    "<option value='2'>Completo</option>" +
						"</select>");

					$('#selTipoInf > option[value="'+accidenteInformeId+'"]').attr('selected','selected');

					$("#dgReporta").val(accDgReporta);$("#dgJefe").val(accDgJefeReporta);$("#dgLugar").val(accDgLugar);
					$("#dgFecha").val(accDgFecha);$("#dgHora").val(accDgHora);

					llamarUnidades();

					var selProyecto=crearSelectOneMenu("selProyecto","",listProyectos,list.proyectoId,
						"id","titulo","Ninguno");

					var selClimaAcc=crearSelectOneMenu("selClimaAcc","",listClimas,list.clima.id,
						"id","nombre","Por definir");

					var selAccSub1 = crearSelectOneMenuY("selAccSub","verCategAcordeSubTipo()",listAccidenteSubTipo,
						accSubTipoId,"accidenteSubTipoId","accidenteTipoId","accidenteSubTipoNombre");

					var selAccSubSub1 = crearSelectOneMenuY("selAccSubSub","",listAccidenteSubSubTipo,accSubSubTipoId,
						"accidenteSubSubTipoId","accidenteSubTipoId","accidenteSubSubTipoNombre");

					var slcClasificacionInternacional = crearSelectOneMenu("slcClasificacionInternacional","",listCategoriasLesionAn,
						accidenteObj.categoriaLesionAnId,"idCategoriaLesion","nombreCategoriaLesion","Por completar");

					$("#slcClimaAcc").html(selClimaAcc+"<br>");$("#slcProyectoAcc").html(selProyecto);
					$("#labelProyectoAcc").html("Contratista - Proyecto de contratista (en caso el accidente corresponda a un contratista)");
					$("#slcTipo").html("<label id='labelTipo'>Tipo de Accidente</label>"+selAccSub1+"<br>");
					$("#slcSubtipo").html("<label>SubTipo de Accidente</label>"+selAccSubSub1+"<br>");
					$("#accEspSubTipo").val(list.detalleOtros);$("#accDescr").val(descripcion);
					$("#clasificacionInternacionalAcc").html(slcClasificacionInternacional);

					$('#clasifAcc > option[value="'+accClasifId+'"]').attr('selected','selected');
					$('#subClasiffAcc > option[value="'+accSubClasifId+'"]').attr('selected','selected');

					$("#epTrabOper").val(epTrabOper);$("#epTrabScrt").val(epTrabScrt);$("#epTrabSeguro").val(epTrabSeguro);
					$("#epAseguradora").val(epAseguradora);

					$("#etNombre").val(etNombre);$("#etRuc").val(etRuc);$("#etDireccion").val(etDireccion);
					$("#etRubro").val(etRubro);$("#etTrabOper").val(etTrabOper);$("#etTrabScrt").val(etTrabScrt);
					$("#etTrabSeguro").val(etTrabSeguro);$("#etAseguradora").val(etAseguradora);

					$("#doHorasInterr").val(doHorasInterr);$("#doValorizacion").val(doValorizacion);$("#doObserv").val(doObserv);
					$("#checkAfectaInfraestructuraDo").prop("checked",(list.afectaInfraestructura == 1?true:false));

					$("#invFechaInicio").val(invFechaInicio);$("#invFehcaFin").val(invFehcaFin);$("#invAnalisisRazones").val(invAnalisisRazones);
					$("#invDeclaracionAccidentado").val(invDeclaracionAccidentado);$("#invFallosSG").val(invFallosSG);$("#invCausasLaborales").val(invCausasLaborales);
					$("#invCausasPersonales").val(invCausasPersonales);

					$("#inputAgente").val(invAgente);

					$("#tdEsp"+accidenteId).html("<a onclick='verEspecificacion(0)'>Detallar</a>");
					$("#tdInc"+accidenteId).html("<a onclick='verCategorias(0)'>Detallar</a>");
					$("#tdDG"+accidenteId).html("<a onclick='verDatosGenerales(0)' id='op2'>Detallar</a>");
					$("#tdInv"+accidenteId).html("<a onclick='verInvolucrados(0)' id='op3'>Detallar</a>");
					$("#tdDM"+accidenteId).html("<a onclick='verDanioMaterial(0)' id='op4'>Detallar</a>");
					$("#tdIA"+accidenteId).html("<a onclick='verImpactoAmbiental(0)' id='op5'>Detallar</a>");
					$("#tdInve"+accidenteId).html("<a onclick='verInvestigacion(0)' id='op6'>Detallar</a>");
					$("#tdAM"+accidenteId).html("<a onclick='verAccionMejora(0)' id='op7'>Detallar</a>");

					var evidenciaNombre = $("#tdevi"+accidenteId).text();

					var options={
						container:"#tdevi"+accidenteId,functionCall:function(){},
						descargaUrl:"/accidente/evidencia?accidenteId="+accidenteId,
						esNuevo:false,idAux:"Accidente",evidenciaNombre:list.evidenciaNombre
					};

					crearFormEvidenciaCompleta(options);

					var pindex;

					listFullAccidentes.forEach(function(val,index){
						if(val.accidenteId == accidenteId){
							pindex = index;
						}
					});

					var unidades = listFullAccidentes[pindex].unidadesInformadasIds;

					var listIdsUnidades = unidades.split(",");

					listIdsUnidades.forEach(function(val){
						listUnidadesInformadas.forEach(function(val1){
							if(val == val1.matrixId){
								val1.selected=1;
							}
						});
					});

					crearSelectOneMenuObligMultipleCompleto("selUnidadesInformadas","",listUnidadesInformadas,
						"matrixId","matrixNameSimple","#tdunidinfor"+accidenteId,"Unidades Informadas...");

					var calificacion = $("#tdcalifacc"+accidenteId).text();

					$("#tdcalifacc"+accidenteId).addClass("linkGosst").on("click",function(){verCalificacionAccidente();})
					    .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true'></i>"+calificacion);

					$("#tdaccrespo"+accidenteId).html("<a class='efectoLink' onclick='verAccionesAreaAccidente(1)'>" +
						"<i class='fa fa-external-link'></i>"+listFullAccidentes[pindex].numAccionesColaboradorCompletas+" / "+listFullAccidentes[pindex].numAccionesColaboradorTotal+"</a>")

					banderaEdicion = true;

					var restriccionAccionId= 0;

					switch(list.accidenteTipoId){
					    case 1:
						    restriccionAccionId = 6;

							break;

						case 2:
						    restriccionAccionId = 7;

							break;

						case 3:
							restriccionAccionId = 8;

							break;
					}

					$("#tdAM"+accidenteId).html("<a href='#' onclick='javascript:agregarAccionMejora(4,"+accidenteId+","+restriccionAccionId+");'>Seleccionar</a>");

					$("#tdAccProy"+accidenteId).addClass("linkGosst").on("click",function(){
						if(list.proyectoId != null){
							verAccionesAccidenteProyecto();
						}else{
							verAccionesAccidenteSolicitud();
						}
					}).html("<i class='fa fa-external-link'></i>"+(list.proyectoId != null?list.indicadorAcciones:list.accionesSolicitudCompletas+" / "+list.accionesSolicitudTotal));
					//
					$("#invObjAcc").val(list.objetoNombre);$("#invDescObjAcc").val(list.objetoDescripcion);$("#invEstadoEppAcc").val(list.eppDescripcion);
					$("#inveAccHow").val(list.how);

					var optionsHow={
						container:"#eviAccCondicion",functionCall:function(){},
						descargaUrl:"/accidente/evidencia/how?accidenteId="+accidenteId,
						esNuevo:false,idAux:"AccidenteHow",evidenciaNombre:list.evidenciaHowNombre
					};

					crearFormEvidenciaCompleta(optionsHow);
					//
					var optionsDeclaracionAcc={
						container:"#eviDeclaracionAccidentado",functionCall:function(){},
						descargaUrl:"/accidente/evidencia/declaracion_acc?accidenteId="+accidenteId,
						esNuevo:false,idAux:"DeclaracionAcc",evidenciaNombre:list.evidenciaDeclaracionAccNombre
					};

					crearFormEvidenciaCompleta(optionsDeclaracionAcc);

					habilitarBotonesEdicion();verCategAcordeInforme();verCategAcordeTipoAccidente();verCategAcordeSubTipo();

					if(listFullAccidentes[pindex].cantidadCaracteristicasCheck > 0){
						cargarModalEsp();
					}

					$("#btnReporteConsolidado").hide();$("#btnGenReporte").show();$("#btnFlash").show();
					$("#btnAccidenteArea").hide();$("#btnAccidenteSeguimiento").hide();$("#btnPerfilesSsoma").hide();
					$("#btnQuickSightAccidente").hide();

					break;

				default:
					alert("Ocurrió un error al traer el detalle!");
			}
		});
	}
}

function volverDivAccidente(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divContainAccidente").show();
	$("#generalModuloAccidente h2").html("Accidente, Incidente y Enfermedades");
}

function volverDivAccionesAccidente(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divAccionesSolicitudIncidente").show();
	$("#generalModuloAccidente h2").html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> > Acciones de mejora")

}
var listFullAccionesSolicitudAccidente=[];

function verAccionesAccidenteSolicitud(){
	volverDivAccionesAccidente();
	var audiObj={accidenteId:accidenteId,idCompany : getSession("gestopcompanyid")};

	callAjaxPost(URL + '/accidente/acciones',
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){
					$("#tblAccSolIncidente tbody tr").remove();
					listFullAccionesSolicitudAccidente= data.list;
					listFullAccionesSolicitudAccidente.forEach(function(value,index){

					    var btnEvidencia = "Sin asignar";
					    if(value.evidenciaNombre != null){
						btnEvidencia = "<a class='efectoLink' target='_blank' " +
								"href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+value.accionMejoraId+"'>" +
										"<i class='fa fa-download'></i>Descargar</a>";
					    }
						$("#tblAccSolIncidente tbody").append(
								"<tr>" +
								"<td>"+value.solicitud.resumen+"</td>" +
								//"<td>"+value.solicitud.numActAsociadas+btnAsociado+"</td>" +
								"<td>"+value.descripcion+"</td>" +
								"<td>"+value.tipoAccionNombre+"</td>" +
								"<td>"+value.clasificacion.nombre+"</td>" +
								"<td>"+value.responsableNombre+"</td>" +

								"<td>"+value.fechaRevisionTexto+"</td>" +
								"<td>"+value.fechaRealTexto+"</td>" +
								//"<td>"+value.inversionAccion+"</td>" +
								"<td style='font-weight:800;color:"+value.estadoColor+"'>"+value.estadoCumplimientoNombre+"</td>" +
								"<td>"+btnEvidencia+"</td>" +
								"</tr>"
						)
					});
				}
	})
}
function verOrigenSolicitudAccion(pindex){
	var accionObj=listFullAccionesSolicitudAccidente[pindex];
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divOrigenAccionesSolicitudIncidente").show();
	$("#generalModuloAccidente h2")
	.html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> " +
			" > <a onclick='volverDivAccionesAccidente()' >Solicitud de mejora '"+accionObj.descripcion+"' </a>" +
			" > Asociados")


	callAjaxPost(URL + '/auditoria/accion/origenes',
			{gestionAccionMejoraId:accionObj.solicitud.gestionAccionMejoraId},
			function(data){
		var list = data.list;
		$("#tblItemAsoc tbody tr").remove();
		list.forEach(function(val,index) {
			var btnDescargaCausa="";
			if(val.evidenciaNombre!=null){
				btnDescargaCausa="<a class='btn-success btn' " +
						"href='"+URL+"/auditoria/accion/origen/evidencia?id="+val.detalleGestAccionMejoraId+"' " +
								"target='_blank' >Descargar Evidencia</a>";
			}else{
				btnDescargaCausa="Sin evidencia"
			}
			$("#tblItemAsoc tbody")
					.append(
							"<tr  >"
									+ "<td id='asd"
									+ val.detalleGestAccionMejoraId + "'>"
									+ val.moduloNombre + "</td>"

									+ "<td id='asd"
									+ val.detalleGestAccionMejoraId + "'>"
									+ val.categoriaNombre + "</td>"

									+ "<td id='asd"
									+ val.detalleGestAccionMejoraId
									+ "'>"+ val.detalleNombre +"</td>"
									+ "<td id='asd"
									+ val.detalleGestAccionMejoraId
									+ "'>"+ val.observacion +"</td>"
									+ "<td id='asd"
									+ val.detalleGestAccionMejoraId + "'>"
									+ val.fechaInicioTexto
									+ "</td>"
									+ "<td >"
									+ btnDescargaCausa
									+ "</td>"
									+ "</tr>");
			$("#tddetalle"+ val.detalleGestAccionMejoraId).css({"text-align":"left"});
		});

	});
}
var listFullAccionesAsociadas=[],banderaEdicionRespuestaAcc=false;
function verAccionesAccidenteProyecto(){
	$("#generalModuloAccidente .container-fluid").hide();
	$("#divAccionesIncidente").show();
	$("#generalModuloAccidente h2").html("<a onclick='volverDivAccidente()'>Accidente, Incidente y Enfermedades</a> > Acciones de mejora")
	var audiObj={accionMejoraTipoId : 1,
		accidenteId:accidenteId};
callAjaxPost(URL + '/gestionaccionmejora/accionmejora',
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){
					$("#tblAccIncidente tbody tr").remove();
					banderaEdicionRespuestaAcc=false;
					listFullAccionesAsociadas=data.list;
					listFullAccionesAsociadas.forEach(function(val,index){
						val.id=val.accionMejoraId;
						var iconoDescarga=
							"<a href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>" +
									"<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
						if(val.evidenciaNombre=="----"){
							iconoDescarga="";
						}
						$("#tblAccIncidente tbody").append(
								"<tr id='trtip"+val.id+"'  >" +
//
								"<td id='actpdesc"+val.id+"'>"+val.descripcion+"</td>" +
								"<td id='actpfp"+val.id+"'>"+val.fechaRevisionTexto+"</td>" +
								"<td id='actpfr"+val.id+"'>"+val.fechaRealTexto+"</td>" +
								"<td id='actpobs"+val.id+"'>"+val.observacion+"</td>" +
								"<td id='actpresp"+val.id+"'>"+val.respuesta+
								"<button onclick='modificarRespuestaAccionMejoraAccidente("+index+")' class='btn btn-success'>" +
								"Modificar respuesta <i class='fa fa-envelope-o'></i>" +
								"</button>"+"</td>" +
								"<td id='actpevi"+val.id+"'>"+val.evidenciaNombre+iconoDescarga+"</td>" +
								"<td id='actpes"+val.id+"'>"+val.estadoCumplimientoNombre+"</td>" +


								"</tr>");
					});
				}else{
					console.log("NOPNPO")
				}
			});
}
function modificarRespuestaAccionMejoraAccidente(pindex){
	 if(!banderaEdicionRespuestaAcc){
		 banderaEdicionRespuestaAcc=true;
	 var accObj=listFullAccionesAsociadas[pindex];
	 var btnVolver="<button onclick='volverModificarRespuestaAccidente("+pindex+")' class='btn btn-danger'>" +
		" <i class='fa fa-arrow-left'></i>" +
		"</button>";
	 var btnGuardar="<button onclick='guardarModificarRespuestaAccidente("+pindex+")' class='btn btn-success'>" +
		" <i class='fa fa-floppy-o'></i>" +
		"</button>";
	 $("#actpresp"+accObj.id)
	 .html("<input type='text' id='inputRespAccASoc' class='form-control'> " +
	 		""+btnVolver+btnGuardar);
	 $("#inputRespAccASoc").focus();
	 $("#inputRespAccASoc").val(accObj.respuesta);
	 }else{
		 alert("Hay una respuesta en edición")
	 }
}
function volverModificarRespuestaAccidente(){
	verAccionesAccidenteProyecto();
}
function guardarModificarRespuestaAccidente(pindex){
	 var accObj=listFullAccionesAsociadas[pindex];
	 var accSend={accionMejoraId:accObj.id,
			 respuesta:$("#inputRespAccASoc").val()}
	 callAjaxPost(URL + '/gestionaccionmejora/accionmejora/respuesta/save',
			 accSend, function(data){

		 verAccionesAccidenteProyecto();
	 });
}

function nuevoAccidente() {

   accidenteId=0;

   var dataParam={
	   accidenteId:accidenteId,
	   idCompany:getSession("gestopcompanyid"),
	   inicioEmpresa: hasTablasFijas
	         };

   callAjaxPost(URL + '/accidente/detalle', dataParam,
      function (data){

	 if(hasTablasFijas==1){
	    listProyectos=data.proyectos;
	    listClimas = data.listClimas;

	    listAccidenteSubTipo = data.listAccSubTipo;
	    listAccidenteSubSubTipo = data.listAccSubSubTipo;

	    listAgente=data.listagente;
	    listClasifAgente=data.listclasifage;
	    listPartesCuerpo=data.listparte;
	    listTipoLesion=data.listLesion;
	    listDniNombre=data.listDniNombre;
	    listeventos=data.listEventos;

	    causasSugeridas=data.causasSugeridas;
	    subTiposEventos=data.subTiposEventos;
	    subSubTiposSugeridos=data.subSubTiposSugeridos;

	    listAreasAcc = data.areas;
	    hasTablasFijas=0;

		 listCategoriasLesionAn = data.listCategoriasLesionAn;
	}

	if(!banderaEdicion){

	   var options={
	          container:"#tdevi"+accidenteId,
		  functionCall:function(){ },
		  descargaUrl: "",
	          esNuevo:true,
	          idAux:"Accidente",
		  evidenciaNombre:""
		       };

	   crearFormEvidenciaCompleta(options);

	   var optionsHow={
		  container:"#eviAccCondicion",
		  functionCall:function(){ },
		  descargaUrl: "",
		  esNuevo:true,
		  idAux:"AccidenteHow",
		  evidenciaNombre:""
		          };

	   crearFormEvidenciaCompleta(optionsHow);

	   var optionsDeclaracionAcc={
		  container:"#eviDeclaracionAccidentado",
		  functionCall:function(){ },
		  descargaUrl: "",
		  esNuevo:true,
		  idAux:"DeclaracionAcc",
		  evidenciaNombre:""
			             };

	   crearFormEvidenciaCompleta(optionsDeclaracionAcc);

	   var valorAntes1=$("#fechaInicioEvento").val()
	   var valorAntes2=$("#fechaFinEvento").val()

	   $("input").val("");
	   $("#fechaInicioEvento").val(valorAntes1);
	   $("#fechaFinEvento").val(valorAntes2);
	   $("textarea").val("");

	   esNuevo=true;

	   formatoCeldaSombreableTabla(false,"tblAcc")
	   //
	   var selProyecto=crearSelectOneMenu("selProyecto","",listProyectos,"",
		   			      "id" ,"titulo","Ninguno");

	   var selClimaAcc=crearSelectOneMenu("selClimaAcc","",listClimas,"",
		   			      "id" ,"nombre","Por especificar");

	   $("#slcClimaAcc").html(selClimaAcc+"<br>");
	   $("#slcProyectoAcc").html(selProyecto);
	   $("#labelProyectoAcc").html("Proyecto Referido");

		var slcClasificacionInternacional = crearSelectOneMenu("slcClasificacionInternacional","",listCategoriasLesionAn,
			-1,"idCategoriaLesion","nombreCategoriaLesion","Por completar");

		$("#clasificacionInternacionalAcc").html(slcClasificacionInternacional);
	   //
	   var selAccSub = crearSelectOneMenuY("selAccSub","verCategAcordeSubTipo()", listAccidenteSubTipo,
				"-1","accidenteSubTipoId","accidenteTipoId","accidenteSubTipoNombre");

	   var selAccSubSub = crearSelectOneMenuY("selAccSubSub","",listAccidenteSubSubTipo,"-1",
				                  "accidenteSubSubTipoId", "accidenteSubTipoId","accidenteSubSubTipoNombre");

	   $("#slcTipo").html("<label>Tipo </label>"+selAccSub+"<br>");
	   $("#slcSubtipo").html("<label>SubTipo de Accidente</label>"+selAccSubSub+"<br>");

	   $("#tblAcc:first tbody")
	      .prepend("<tr id='0'>"
		        + "<td>*Primero debe guardar el registro</td>"
		        + "<td>"+"<select autofocus='true' id='selTipoInf' class='form-control' onclick='verCategAcordeInforme()'>" +
		        	    "<option value='1'>Preliminar</option>" +
				    "<option value='2' selected>Completo</option></select>"+ "</td>"
			+ "<td><select id='selTipoAcc' class='form-control' onchange='verCategAcordeTipoAccidente()'>" +
			         "<option value='1'>Accidente</option>" +
				 "<option value='2'>Incidente</option>" +
				 "<option value='3'>Enfermedad</option></select></td>"
			+ "<td id='slcUnidadAcc0'></td>"
			+ "<td><a onclick='verDatosGenerales(0)' id='op2'>Detallar</a></td>"
			+ "<td><a onclick='verEspecificacion(0)'>Detallar</a></td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td id='tdevi0'>*Primero debe guardar el registro</td>"
			+ "<td id='tdunidinfor0'>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
			+ "<td>*Primero debe guardar el registro</td>"
		     + "</tr>");

	   crearSelectOneMenuObligMultipleCompleto("selUnidadesInformadas","",listUnidadesInformadas,"matrixId",
		   			           "matrixNameSimple","tdunidinfor"+accidenteId,"Unidades Informadas...");

		$("#checkAfectaInfraestructuraDo").prop("checked",false);

	   $("#btnAccidenteArea").hide();$("#btnPerfilesSsoma").hide();$("#btnQuickSightAccidente").hide();
	   $("#btnAccidenteSeguimiento").hide();

	   llamarUnidades();

	   var options={
		  container:"#tdevi"+accidenteId,
		  functionCall:function(){ },
		  descargaUrl: "",
		  esNuevo:true,
		  idAux:"Accidente",
		  evidenciaNombre:""
		       };

	   crearFormEvidenciaCompleta(options);
	   $("#btnReporteConsolidado").hide();
	   habilitarBotonesNuevo();
	   verCategAcordeTipoAccidente();
	   verCategAcordeInforme();
	   banderaEdicion = true;

	}else{
	  alert("Guarde primero.");
	}
   });
}

function cancelarAccidente() {
	cargarPrimerEstado();
}
function eliminarAccidente() {
	var r = confirm("¿Está seguro de eliminar el accidente?");
	if (r == true) {
		var dataParam = {
			accidenteId : accidenteId
		};

		callAjaxPost(URL + '/accidente/delete', dataParam,
				procesarResultadoEliminarACC);
	}
}
function procesarResultadoEliminarACC(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		break;
	default:
	    alert("El reporte no se puede eliminar al tener " +
	    		"calificacione de los Responsables de las áreas. Comuníquese con su contacto GOSST");
	return;
		alert("Verificar que el registro de accidente no esté asociado a " +
				"un trabajador afectado, impacto ambiental ocasionado, equipo de investigación, " +
				"declaración de entrevistas, causas inmediatas, condiciones básicas, fallos en el " +
				"sistema de gestión o solicitud de acción de mejora");
	}
}
function guardarAccidente() {

   var campoVacio = true;
   var TipoInf=$("#selTipoInf").val();
   var TipoAcc;

   var descripcion=$("#accDescr").val();
   var subTipoAcc=$("#selAccSub").val().split('-');
   var accidenteSubTipoId=subTipoAcc[0];
   var detalleOtros=$("#accDetalleOtros").val();

   if(parseInt(accidenteSubTipoId)!=24 && parseInt(accidenteSubTipoId)!=72){
      detalleOtros="";
   }

   var subClasifAcc=$("#subClasiffAcc option:selected").val();
   var clasifAcc=$("#clasifAcc option:selected").val();
	console.log(clasifAcc);
   if(esNuevo){
      TipoAcc=$("#selTipoAcc").val();
      subClasifAcc=null;
   }else{
      TipoAcc=accidenteTipoId;
   }

   if(clasifAcc!=2){
      subClasifAcc=null;
   }

   if(accidenteTipoId!=1){
      subClasifAcc=null;
      clasifAcc=null;
   }

   var subSubTipoAcc=$("#selAccSubSub").val().split('-');
   var accidenteSubSubTipoId=subSubTipoAcc[0];

   var climaId = $("#selClimaAcc").val();
   var areaId = $("#selAreaAcc").val();
   var proyectoId=$("#selProyecto").val();
	var categoriaLesionAnId = (parseInt($("#slcClasificacionInternacional").val()) == -1?null:parseInt($("#slcClasificacionInternacional").val()));
console.log(categoriaLesionAnId);
   proyectoId=(proyectoId=="-1"?null:proyectoId)
   climaId=(proyectoId=="-1"?null:climaId)

   /** 1**/

   var rpta1=$("#accRpta1").is(':checked');
   var rpta2=$("#accRpta2").is(':checked');
   var rpta3=$("#accRpta3").is(':checked');
   var rpta4=$("#accRpta4").is(':checked');
   var rpta5=$("#accRpta5").is(':checked');
   var rpta6=$("#accRpta6").is(':checked');
   var rpta7=$("#accRpta7").is(':checked');
   var rpta8=$("#accRpta8").is(':checked');

   var enfrpta1=$("#enfRpta1").is(':checked');
   var enfrpta2=$("#enfRpta2").is(':checked');

   /** 2**/
   var accDgReporta=$("#dgReporta").val();
   var accDgJefe=$("#dgJefe").val();
   var accDgLugar=$("#dgLugar").val();

   var accDgHora=$("#dgHora").val();;
   var accDgFecha= $("#dgFecha").val();

   /*
   if(accDgFecha.length == 0){
      var d = new Date();

      var month = d.getUTCMonth()+1;
      var day = d.getUTCDate();

      var fechaHoy = d.getUTCFullYear() + '-' +
      (month<10 ? '0' : '') + month + '-' +
      (day<10 ? '0' : '') + day;
      accDgFecha = fechaHoy;
   }

   if(accDgHora.length == 0){
      var tiempo = new Date();

      var hora = tiempo.getHours();
      var minuto = tiempo.getMinutes();
      var segundo = tiempo.getSeconds();

      accDgHora = hora + ":" +minuto + ":00"  ;
   }
   */

   /** 3**/

   var epTrabSeguro=$("#epTrabSeguro").val();
   var epTrabOper=$("#epTrabOper").val();
   var epTrabScrt=$("#epTrabScrt").val();

   //if(epTrabSeguro.length == 0){
   //	epTrabSeguro =0;
   //}

   if(epTrabOper.length == 0){
      epTrabOper = 0;
   }

   if(epTrabScrt.length == 0){
      epTrabScrt = 0;
   }

   /** 4**/

   var etNombre=$("#etNombre").val();
   var etRuc=$("#etRuc").val();
   var etDireccion=$("#etDireccion").val();
   var etRubro=$("#etRubro").val();
   var etTrabOper=$("#etTrabOper").val();
   var etTrabScrt=$("#etTrabScrt").val();
   var etTrabSeguro=$("#etTrabSeguro").val();
   var etAseguradora = $("#etAseguradora").val();
   var epAseguradora = $("#epAseguradora").val();

   if(etRuc.length == 0){
      etRuc =0;
   }

   if(etTrabOper.length == 0){
      etTrabOper = 0;
   }

   if(etTrabScrt.length == 0){
      etTrabScrt = 0;
   }

   //if(etTrabSeguro.length == 0){
   //	etTrabSeguro = 0;
   //}

   /** 5**/
    var doHorasInterr = ($("#doHorasInterr").val().length == 0?0:$("#doHorasInterr").val());
    var doValorizacion = ($("#doValorizacion").val().length == 0?0:$("#doValorizacion").val());
    var doObserv = $("#doObserv").val();
	var checkAfectaInfraestructuraDo = ($("#checkAfectaInfraestructuraDo").prop("checked")?1:0);

    var doEvidencia = "falta definir";

   /** 6**/

   var unidadId=$("#selUnidad").val();

   var invFechaInicio=$("#invFechaInicio").val();
   var invFehcaFin=$("#invFehcaFin").val();
   var invAnalisisRazones=$("#invAnalisisRazones").val();
   var invDeclaracionAccidentado = $("#invDeclaracionAccidentado").val();
   var invFallosSG=$("#invFallosSG").val();
   var invCausasLaborales=$("#invCausasLaborales").val();
   var invCausasPersonales=$("#invCausasPersonales").val();
   var invAgente=$("#inputAgente").val();

   if(invFechaInicio.length == 0){
      invFechaInicio = null;
   }

   if(invFehcaFin.length == 0){
      invFehcaFin = null;
   }

   var clasifAgente= $("#selClasifAgente").val();

   if(clasifAgente<0){
      clasifAgente=1;
   }

   var listUnidadesInput=$("#selUnidadesInformadas").val();
   var listUnidadesFinal=[];

   if(listUnidadesInput!=null){
      listUnidadesInput.forEach(function(val){
         listUnidadesFinal.push({matrixId:parseInt(val)});
      });
   }

   var objetoNombre = $("#invObjAcc").val();
   var objetoDescripcion = $("#invDescObjAcc").val();
   var eppDescripcion = $("#invEstadoEppAcc").val();
   var how = $("#inveAccHow").val();

   if(accDgFecha.length == 0) {
      campoVacio = false;
   }

   if(campoVacio){

      var dataParam={
	      idCompany : getSession("gestopcompanyid"),
	      objetoNombre : objetoNombre,
	      objetoDescripcion : objetoDescripcion,
	      eppDescripcion : eppDescripcion,
	      how : how,
	      detalleOtros:detalleOtros,
	      accidenteDescripcion: descripcion,
	      clima : {id : climaId},areaOcurrio : {areaId : areaId},
	      proyectoId:proyectoId,

	      lugar : accDgLugar,
	      encargadoReportar:accDgReporta,
	      jefeEncargadoReportar:accDgJefe,
	      fecha : accDgFecha+" "+accDgHora,
	      fechaN: accDgFecha,
	      unidadId: unidadId,

	      trabOperacion : epTrabOper,
	      trabSCRT : epTrabScrt,
	      trabAsegurados : epTrabSeguro,

	      terceroNombre : etNombre,
	      terceroRuc : etRuc,
	      terceroDireccion :  etDireccion,
	      terceroRubro : etRubro,
	      tercerotrabOperacion : etTrabOper,
	      tercerotrabSCRT : etTrabScrt,
	      tercerotrabAsegurados : etTrabSeguro,

	      trabAseguradora : epAseguradora,
	      terceroAseguradora : etAseguradora,
	      operacionHorasInterrupcion : doHorasInterr,
	      operacionValor : doValorizacion,
	      operacionObservacion : doObserv,
	      operacionEvidencia : doEvidencia,

	      investigacionFechaInicio : invFechaInicio,
	      investigacionFechaFin : invFehcaFin,
	      investigacionFallosSistema : invFallosSG,
	      investigacionAnalisisRazones : invAnalisisRazones,afectaInfraestructura:checkAfectaInfraestructuraDo,
	      investigacionDeclaracionAccidentado : invDeclaracionAccidentado,
	      investigacionCausaLaboral :	invCausasLaborales,
	      investigacionCausaPersonal : invCausasPersonales,
	      investigacionAgente : invAgente,
	      accidenteId : accidenteId,
	      accidenteTipoId : TipoAcc,
	      accidenteInformeId : TipoInf,
	      accidenteSubTipoId : accidenteSubTipoId,
	      accidenteSubSubTipoId: accidenteSubSubTipoId,

	      accidenteClasificacionId:clasifAcc,
	      accidenteSubClasificacionId :subClasifAcc,
	      investigacionClasifAgenteId:clasifAgente,
	      accidenteSubTipoNombre:$("#selAccSub option:selected").text(),
	      unidades:listUnidadesFinal,categoriaLesionAnId:categoriaLesionAnId
	             };

      callAjaxPost(URL+'/accidente/save',dataParam,procesarResultadoGuardarAccidente);

   }else{
      //alert("Debe ingresar todos los campos.");
      mensajeUx="<label>Debe ingresar la Fecha de ocurrencia (en E.Datos " +
      		"Generales).</label>";
      mensajesUx(mensajeUx,2,"verDatosGenerales("+accidenteId+")","IngFecOcu");

      $("#btnDevolverValorIngFecOcu").on("click",function(){
         $("#modalMensajeUx").modal("hide");
      });
   }
}

function procesarResultadoGuardarAccidente(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviAccidente",
				bitsEvidenciaAccidente,'/accidente/evidencia/save',
				function(){
			guardarEvidenciaAuto(data.nuevoId,"fileEviAccidenteHow",
					bitsEvidenciaAccidente,'/accidente/evidencia/how/save',
					function(){
			    guardarEvidenciaAuto(data.nuevoId,"fileEviDeclaracionAcc",
					bitsEvidenciaAccidente,'/accidente/evidencia/declaracion_acc/save',
					function(){
				           cargarPrimerEstado();
			    },"accidenteId");
			},"accidenteId");
		},"accidenteId")

		break;
	default:
		alert("Ocurrió un error al guardar el accidente!"+data.CODE_RESPONSE);
	}
}
function mostrarCargarImagen(accidenteId) {
	$('#mdUpload').modal('show');
	$('#btnUploadEvidencia').attr("onclick",
			"javascript:uploadEvidencia(" + accidenteId + ");");
}
function uploadEvidencia(accidenteId) {
	$.blockUI({message:'Cargando...'});
	guardarEvidenciaAuto(accidenteId,"fileEvi",bitsEvidenciaAccidente,'/accidente/evidencia/save',function(){
		$.unblockUI();
		$('#mdUpload').modal('hide');
	},"accidenteId");
}
function verEspecificacion(){

	modificarAcordeClasificacion();

	 $("#mdEspecificacion").modal('show');

}

function verDatosGenerales(){
   $("#modalMensajeUxIngFecOcu").modal("hide");
   $("#mdDatoGeneral").modal('show');
}

function verCategAcordeTipoAccidente(){
	if(esNuevo){
		accidenteTipoId = parseInt($("#selTipoAcc").val());
	}

	switch(accidenteTipoId){
		case 2:
 			$("#labelTipo").html("Tipo de incidente");
  			$("#slcTipo").show();$("#divclasifAcc").hide();
			$("#daniosVehiculares").show();$("#daniosOperativos").show();
   			$("#op4").show();$("#op5").show();

  			$("#selAccSub option").each(function(){
				$(this).show();
			});

  			$("#selAccSub option").each(function(){
				var arr1 = $(this).val().split('-');

			   	if(arr1[1] != '2'){
					$(this).hide();
			   	}
			});

			$("#equipoInvestigacion").show();$("#invTestigos").show();$("#causasInmeditas").show();
			$("#actoInseguro").show();$("#agente").hide();

 			break;

		case 1:
			$("#labelTipo").html("Tipo de accidente");
 			$("#labelSubtipo").html("Subtipo de accidente");
 			$("#slcTipo").show();$("#divclasifAcc").show();

			$("#selAccSub option").each(function(){
				$(this).show();
			});

			$("#selAccSub option").each(function(){
				var arr1= $(this).val().split('-');

			   	if(arr1[1]!='1'){
					$(this).hide();
			   	}
			});

			$("#daniosVehiculares").show();$("#daniosOperativos").show();
 			$("#op4").show();$("#op5").show();$("#equipoInvestigacion").show();
			$("#invTestigos").show();$("#causasInmeditas").show();$("#actoInseguro").show();
			$("#agente").hide();

			break;

 		case 3:
	 		$("#labelTipo").html("Tipo de enfermedad");$("#slcTipo").show();

			$("#selAccSub option").each(function(){
				$(this).show();
			});

			$("#selAccSub option").each(function(){
				var arr1 = $(this).val().split('-');

				if(arr1[1] != '3'){
					$(this).hide();
				}
			});

			$("#divclasifAcc").hide();$("#op4").hide();$("#op5").hide();
			$("#equipoInvestigacion").show();$("#listaCategoria").hide();$("#invTestigos").hide();
			$("#causasInmeditas").hide();$("#actoInseguro").hide();$("#agente").show();

			break;
 	}

	$("#op3").show();$("#slcSubtipo").hide();
}

function verCategAcordeInforme(){
   	switch($("#selTipoInf").val()){
		case "1":
			$("#empresaPrincipal").hide();$("#detalleTercero").hide();
			$('#tblIA td:nth-child(3),#tblIA th:nth-child(3)').hide();
			$('#tblIA td:nth-child(4),#tblIA th:nth-child(4)').hide();
			$('#tblIA td:nth-child(5),#tblIA th:nth-child(5)').hide();
			$("#op6").hide();$("#op7").hide();

  			break;

		case "2":
			$("#empresaPrincipal").show();$("#detalleTercero").show();
			$('#tblIA td:nth-child(3),#tblIA th:nth-child(3)').show();
			$('#tblIA td:nth-child(4),#tblIA th:nth-child(4)').show();
			$('#tblIA td:nth-child(5),#tblIA th:nth-child(5)').show();
			$("#op6").show();$("#op7").show();

			break;
	}

	$("#empresaTercera").show();$("#trabajadoresAfectados").show();
}

function verCategAcordeSubTipo(){
	$("#accDetalleOtros").hide();$("#labelOtrosDetalle").hide();

	var subTipo= parseInt($("#selAccSub").val());

	if([24,72].includes(subTipo)){
		$("#accDetalleOtros").show();$("#labelOtrosDetalle").show();
	}

	$("#slcSubtipo").show();$("#slcTipo").show();
	$('#selAccSubSub > option[value="-1"]').attr('selected','selected');

	$("#selAccSubSub option").each(function(){
		$(this).show();
	});

	var contar= 0;

	var prese = $("#selAccSub option:selected").val();

	var arr= prese.split('-');

	$("#selAccSubSub option").each(function(){
		var arr1 = $(this).val().split('-');

		if(arr[0] == arr1[1]){
			contar = contar+1;
		}
	});

	if(contar != 0){
		$("#slcSubtipo").show();

		var presee = $("#selAccSub option:selected").val();
		var arrr= presee.split('-');

		$("#selAccSubSub option").each(function(){
			var arr11 = $(this).val().split('-');

			if(arrr[0] != arr11[1]){
				$(this).hide();
			}
		});
	}

	$("#slcSubtipo").hide();
}

function mostrarCat(){
	($("#accRpta1").prop("checked")?$("#empresaTercera").show():$("#empresaTercera").hide());
	($("#accRpta2").prop("checked")?$("#empresaPrincipal").show():$("#empresaPrincipal").hide());
	($("#accRpta3").prop("checked")?$("#trabajadoresAfectados").show():$("#trabajadoresAfectados").hide());

  	if(!$("#accRpta1").prop("checked") && !$("#accRpta2").prop("checked")){
	 	$("#accRpta3").prop("checked","");$("#op3").hide();
  	}else{
		$("#op3").show();
	}

	($("#accRpta5").prop("checked")?$("#daniosVehiculares").show():$("#daniosVehiculares").hide());
	($("#accRpta6").prop("checked")?$("#daniosOperativos").show():$("#daniosOperativos").hide());

	if(!$("#accRpta5").prop("checked") && !$("#accRpta6").prop("checked")){
		$("#op4").hide();
	}else{
		$("#op4").show();
	}

	($("#accRpta7").prop("checked")?$("#op5").show():$("#op5").hide());
	($("#accRpta8").prop("checked")?$("#invTestigos").show():$("#invTestigos").hide());
}

function modificarAcordeClasificacion(){

  switch($("#divclasifAcc #clasifAcc").val()){
	  case "1":
		$("#nivelIncapacitante").hide();
	        break;
	  case "2":
		$("#nivelIncapacitante").show();
	        break;
	  case "3":
		$("#nivelIncapacitante").hide();
	        break;
	 }
}

function generarHojaRuta(){
         window.open(URL
		     + "/accidente/informe/accidente?accidenteId="
		     + accidenteId +"&tipoAccidenteId="+accidenteTipoId);
}

var perfilSsomaAccId,perfilSsomaAccObj={};
var banderaEdicionPerfilSsomaAcc = false;
var listPerfilesSsomaAcc = [],listEstadoAccidenteSsoma = [],listRiesgoPotencial = [];

function volverPerfilesSsomaAcc(){
	$("#modalPerfilesSsomaAcc").modal("hide");
}

function verPerfilesSsomaAcc(){
	$("#modalPerfilesSsomaAcc").remove();

	var contenido = "";

	var buttonVolverPrincipal =
		"<button id='btnVolverPerfilSsomaAcc' type='button' class='btn btn-info' style='margin-right:5px' " +
		        "onclick='volverPerfilesSsomaAcc()' title='Regresar a la vista principal'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-2x fa-list-alt'></i> <i class='fa fa-user'></i>" +
		"</button>";

	var buttonNuevo =
		"<button id='btnNuevoPerfilSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
		        "title='Registrar un nuevo perfil SSOMA.' onclick='nuevoPerfilesSsomaAcc()'>" +
		    "<i class='fa fa-file-o fa-2x'></i>" +
		"</button>";

	var buttonCancelar =
		"<button id='btnCancelarPerfilSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
		        "onclick='cancelarPerfilesSsomaAcc()' title='Cancelar'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
		"</button>";

	var buttonGuardar =
		"<button id='btnGuardarPerfilSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
		        "onclick='guardarPerfilesSsomaAcc()' title='Guardar'>" +
		    "<i class='fa fa-floppy-o fa-2x'></i>" +
		"</button>";

	var buttonEliminar =
		"<button id='btnEliminarPerfilSsomaAcc' type='button' class='btn btn-danger' style='margin-right:5px' " +
		        "title='Eliminar.' onclick='eliminarPerfilesSsomaAcc()'>" +
			"<i class='fa fa-times fa-2x'></i>" +
		"</button>";

	var modalOptions={
		maxWidth:"95%",id:"modalPerfilesSsomaAcc",nombre:"<i class='fa fa-list-alt'></i> Perfiles SSOMA",
		contenido:
			 buttonVolverPrincipal+buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar +
			"<div class='wrapper' id='wrapperPerfilesSsomaAcc'>" +
				"<table id='tblPerfilesSsomaAcc' class='table table-striped table-bordered table-hover table-fixed'>" +
					"<thead>" +
						"<tr>" +
							"<th class='tb-acc' style='width:250px'>Nombre</th>" +
							"<th class='tb-acc' style='width:150px'>¿Habilitar nuevo registro?</th>" +
							"<th class='tb-acc' style='width:200px'>Estados del registro</th>" +
							"<th class='tb-acc' style='width:200px'>Nivel de potencialidad del evento</th>" +
							"<th class='tb-acc' style='width:150px'>N° de trabajadores asociados</th>" +
							"<th class='tb-acc' style='width:150px'>Registrado el</th>" +
							"<th class='tb-acc' style='width:150px'>Actualizado el</th>" +
						"</tr>" +
					"</thead>" +
					"<tbody></tbody>" +
				"</table>" +
			"</div>"};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	resizeDivWrapper("wrapperPerfilesSsomaAcc",190);
	cargarPerfilesSsomaAcc();
}

function cargarPerfilesSsomaAcc(){
	banderaEdicionPerfilSsomaAcc = false;

	$("#btnVolverPerfilSsomaAcc").show();$("#btnCancelarPerfilSsomaAcc").hide();$("#btnGuardarPerfilSsomaAcc").hide();
	$("#btnNuevoPerfilSsomaAcc").show();$("#btnEliminarPerfilSsomaAcc").hide();

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid"))
	};

	callAjaxPost(URL+"/accidente/accidente_ssoma/perfil",dataParam,function(data){
		if(data.CODE_RESPONSE == "05"){
			listPerfilesSsomaAcc = data.listPerfilesSsomaAcc;listEstadoAccidenteSsoma = data.listEstadoAccidenteSsoma;
			listRiesgoPotencial = data.listRiesgoPotencial;

			$("#tblPerfilesSsomaAcc tbody tr").remove();

			listPerfilesSsomaAcc.forEach(function(val,index){
				var estadoHabilitarNuevo = (val.habilitarNuevo == 1?"Sí":"No"),
					estadoAccSsomaHabilitados = (val.estadoAccSsomaHabilitadosNombre.length == 0?"------":val.estadoAccSsomaHabilitadosNombre),
					riesgoPotencialAsig = (val.riesgoPotencialAsignadosNombre.length == 0?"------":val.riesgoPotencialAsignadosNombre);

				$("#tblPerfilesSsomaAcc tbody").append(
					"<tr id='trPerfilSsomaAcc"+val.id+"' onclick='editarPerfilesSsomaAcc("+index+")'>" +
						"<td id='nombrePerfilSsomaAcc"+val.id+"'>"+val.nombre+"</td>" +
						"<td id='habilitarNuevoPerfilSsomaAcc"+val.id+"'>"+estadoHabilitarNuevo+"</td>" +
						"<td id='estadoPerfilSsomaAcc"+val.id+"'>"+estadoAccSsomaHabilitados+"</td>" +
						"<td id='riesgoPotencialPerfilSsomaAcc"+val.id+"'>"+riesgoPotencialAsig+"</td>" +
					    "<td id='numTrabPerfilSsomaAcc"+val.id+"'>"+val.numTrabajadoresAsignados+"</td>" +
						"<td id='fechaRegistroPerfilSsomaAcc"+val.id+"'>"+val.fechaRegistroTexto+"</td>" +
						"<td id='fechaActPerfilSsomaAcc"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +
					"</tr>");
			});
		}else{
			console.log("NOPNPO");
		}

		goheadfixedY("#tblPerfilesSsomaAcc","#wrapperPerfilesSsomaAcc");
		formatoCeldaSombreableTabla(true,"tblPerfilesSsomaAcc");
	});
}

function cancelarPerfilesSsomaAcc(){
	cargarPerfilesSsomaAcc();
}

function editarPerfilesSsomaAcc(pindex){
	if(!banderaEdicionPerfilSsomaAcc){
		formatoCeldaSombreableTabla(false,"tblPerfilesSsomaAcc");
		perfilSsomaAccId = listPerfilesSsomaAcc[pindex].id;
		perfilSsomaAccObj = listPerfilesSsomaAcc[pindex];

		$("#trPerfilSsomaAcc"+perfilSsomaAccId).addClass("fila-edicion");

		$("#nombrePerfilSsomaAcc"+perfilSsomaAccId).html("<input id='inputNombrePerfilSsomaAcc' type='text' class='form-control'>");
		$("#inputNombrePerfilSsomaAcc").val(perfilSsomaAccObj.nombre);

		var textHabNuevo = (perfilSsomaAccObj.habilitarNuevo == 1?"checked":"");
		$("#habilitarNuevoPerfilSsomaAcc"+perfilSsomaAccId).html("<input id='checkHabNuevoPerfilSsomaAcc' type='checkbox' class='form-control' "+textHabNuevo+">");

		$("#fechaActPerfilSsomaAcc"+perfilSsomaAccId).html("<label>*Automático.</label>");

		crearCheckListGeneral("modalPerfilesSsomaAcc","Estados del registro",
			"EstPerfSsomaAcc",listEstadoAccidenteSsoma,"EstadoAccidenteSsoma",cargarCheckListEstadoAccidenteSsoma);

		crearCheckListGeneral("modalPerfilesSsomaAcc","Nivel de potencialidad del evento",
			"RiesPotPerfSsomaAcc",listRiesgoPotencial,"RiesgoPotencialPerfSsomaAcc",cargarCheckListRiesgoPotencialPerfSsomaAcc);

		$("#numTrabPerfilSsomaAcc"+perfilSsomaAccId).addClass("linkGosst").on("click",function(){
			verTrabajadoresPerfilesSsomaAcc();
		}).html(perfilSsomaAccObj.numTrabajadoresAsignados+"<br><i class='fa fa-user fa-2x' style='text-align:center;'></i>");

		banderaEdicionPerfilSsomaAcc = true;

		$("#btnVolverPerfilSsomaAcc").hide();$("#btnCancelarPerfilSsomaAcc").show();$("#btnGuardarPerfilSsomaAcc").show();
		$("#btnNuevoPerfilSsomaAcc").hide();$("#btnEliminarPerfilSsomaAcc").show();
	}
}

function nuevoPerfilesSsomaAcc(){
	if(!banderaEdicionPerfilSsomaAcc){
		formatoCeldaSombreableTabla(false,"tblPerfilesSsomaAcc");
		perfilSsomaAccObj = {id: 0};perfilSsomaAccId = 0;

		$("#tblPerfilesSsomaAcc tbody").prepend(
			"<tr>" +
			    "<td>"+"<input id='inputNombrePerfilSsomaAcc' type='text' class='form-control'>"+"</td>" +
				"<td>"+"<input id='checkHabNuevoPerfilSsomaAcc' type='checkbox' class='form-control'>"+"</td>" +
			    "<td id='estadoPerfilSsomaAcc"+perfilSsomaAccId+"'></td>" +
				"<td id='riesgoPotencialPerfilSsomaAcc"+perfilSsomaAccId+"'></td>" +
				"<td><label>...</label></td>" +
				"<td><label>*Automático.</label></td>" +
				"<td><label>...</label></td>" +
			"</tr>");

		crearCheckListGeneral("modalPerfilesSsomaAcc","Estados del registro",
			"EstPerfSsomaAcc",listEstadoAccidenteSsoma,"EstadoAccidenteSsoma",ocultarCheckListEstadoAccidenteSsoma);

		crearCheckListGeneral("modalPerfilesSsomaAcc","Nivel de potencialidad del evento",
			"RiesPotPerfSsomaAcc",listRiesgoPotencial,"RiesgoPotencialPerfSsomaAcc",ocultarCheckListRiesgoPotencialPerfSsomaAcc);

		$("#btnVolverPerfilSsomaAcc").hide();$("#btnCancelarPerfilSsomaAcc").show();$("#btnGuardarPerfilSsomaAcc").show();
		$("#btnNuevoPerfilSsomaAcc").hide();$("#btnEliminarPerfilSsomaAcc").hide();

		banderaEdicionPerfilSsomaAcc = true;
	}else{
		alert("Guarde primero.");
	}
}

function ocultarCheckListEstadoAccidenteSsoma(){
	var textEstadoAccSsomaHab = "";

	listEstadoAccidenteSsoma.forEach(function(val,index){
		var isHabilitado = ($("#checkAsignadoEstPerfSsomaAcc"+val.id).prop("checked")?1:0);

		if(isHabilitado == 1){
			textEstadoAccSsomaHab += (textEstadoAccSsomaHab.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textEstadoAccSsomaHab = (textEstadoAccSsomaHab.length == 0?"------":textEstadoAccSsomaHab);

	$("#estadoPerfilSsomaAcc"+perfilSsomaAccId).addClass("linkGosst").on("click",function(){
		verCheckListEstadoAccidenteSsoma();
	}).html(textEstadoAccSsomaHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

	$("#modalCheckListEstPerfSsomaAcc").modal("hide");$("#modalPerfilesSsomaAcc").modal("show");
}

function verCheckListEstadoAccidenteSsoma(){
	$("#modalCheckListEstPerfSsomaAcc").modal("show");$("#modalPerfilesSsomaAcc").modal("hide");
}

function cargarCheckListEstadoAccidenteSsoma(){
	if(perfilSsomaAccObj.estadoAccSsomaHabilitadosId.length != 0){
		var estadoSsomaAccHabilitadosId = perfilSsomaAccObj.estadoAccSsomaHabilitadosId.split(",");

		estadoSsomaAccHabilitadosId.forEach(function(val1){
			var checkboxRiesgoPotencial = document.getElementById('checkAsignadoEstPerfSsomaAcc'+val1);
			checkboxRiesgoPotencial.checked = true;
		});
	}

	ocultarCheckListEstadoAccidenteSsoma();
}

function ocultarCheckListRiesgoPotencialPerfSsomaAcc(){
	var textRiesgoPotencialAsig = "";

	listRiesgoPotencial.forEach(function(val,index){
		var isAsignado = ($("#checkAsignadoRiesPotPerfSsomaAcc"+val.id).prop("checked")?1:0);

		if(isAsignado == 1){
			textRiesgoPotencialAsig += (textRiesgoPotencialAsig.length == 0?val.nombre:", "+val.nombre);
		}
	});

	textRiesgoPotencialAsig = (textRiesgoPotencialAsig.length == 0?"------":textRiesgoPotencialAsig);

	$("#riesgoPotencialPerfilSsomaAcc"+perfilSsomaAccId).addClass("linkGosst").on("click",function(){
		verCheckListRiesgoPotencialPerfSsomaAcc();
	}).html(textRiesgoPotencialAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

	$("#modalCheckListRiesPotPerfSsomaAcc").modal("hide");$("#modalPerfilesSsomaAcc").modal("show");
}

function verCheckListRiesgoPotencialPerfSsomaAcc(){
	$("#modalCheckListRiesPotPerfSsomaAcc").modal("show");$("#modalPerfilesSsomaAcc").modal("hide");
}

function cargarCheckListRiesgoPotencialPerfSsomaAcc(){
	if(perfilSsomaAccObj.riesgoPotencialAsignadosId.length != 0){
		var riesgoPotencialAsignadosId = perfilSsomaAccObj.riesgoPotencialAsignadosId.split(",");

		riesgoPotencialAsignadosId.forEach(function(val1){
			var checkboxRiesgoPotencial = document.getElementById('checkAsignadoRiesPotPerfSsomaAcc'+val1);
			checkboxRiesgoPotencial.checked = true;
		});
	}

	ocultarCheckListRiesgoPotencialPerfSsomaAcc();
}

function guardarPerfilesSsomaAcc(){
	var campoVacio = true;

	var nombre = $("#inputNombrePerfilSsomaAcc").val();
	var habilitarNuevo = ($("#checkHabNuevoPerfilSsomaAcc").prop("checked")?1:0);

	var listEstadoAccidenteSsomaHabilitados = [];
	var textoEstadoAccidenteSsomaHabilitados = "";

	listEstadoAccidenteSsoma.forEach(function(val){
		var isHabilitado = ($("#checkAsignadoEstPerfSsomaAcc"+val.id).prop("checked")?1:0);

		if(isHabilitado == 1){
			listEstadoAccidenteSsomaHabilitados.push({id:val.id});

			textoEstadoAccidenteSsomaHabilitados += (textoEstadoAccidenteSsomaHabilitados.length == 0?val.id:","+val.id);
		}
	});

	var listRiesgoPotencialAsignados = [];
	var textoRiesgosPotencialesAsignados = "";

	listRiesgoPotencial.forEach(function(val){
		var isAsignado = ($("#checkAsignadoRiesPotPerfSsomaAcc"+val.id).prop("checked")?1:0);

		if(isAsignado == 1){
			listRiesgoPotencialAsignados.push({id:val.id});

			textoRiesgosPotencialesAsignados += (textoRiesgosPotencialesAsignados.length == 0?val.id:","+val.id);
		}
	});

	if(nombre.length == 0){
		campoVacio = false;
	}

	if(campoVacio){
		var dataParam={
			id:perfilSsomaAccId,nombre:nombre,habilitarNuevo:habilitarNuevo,estadosAccSsoma:listEstadoAccidenteSsomaHabilitados,
			textoEstadosAccSsomaHabilitados:textoEstadoAccidenteSsomaHabilitados,riesgosPotenciales:listRiesgoPotencialAsignados,
			textoRiesgosPotencialesAsignados:textoRiesgosPotencialesAsignados,empresaId:parseInt(getSession("gestopcompanyid"))
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/perfil/save',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalPerfilesSsomaAcc").modal("hide");

					mensajeUx="<label>El registro perfil SSOMA fue guardado con éxito.<label>";
					mensajesUx(mensajeUx,1,"","ActualizarPerfilSsomaAcc");

					$("#modalMensajeUxActualizarPerfilSsomaAcc").on("hidden.bs.modal",function(){
						$("#modalPerfilesSsomaAcc").modal("show");cargarPerfilesSsomaAcc();
					});

					break;

				default:
					console.log("Ocurrió un error al guardar el perfil SSOMA!");
			}
		});
	}else{
		$("#modalPerfilesSsomaAcc").modal("hide");

		mensajeUx="<label>Debe ingresar el nombre del perfil SSOMA.<label>";
		mensajesUx(mensajeUx,2,"","ValidacionPerfilSsomaAcc");

		$("#modalMensajeUxValidacionPerfilSsomaAcc").on("hidden.bs.modal",function(){
			$("#modalPerfilesSsomaAcc").modal("show");
		});
	}
}

function eliminarPerfilesSsomaAcc(){
	$("#modalPerfilesSsomaAcc").modal("hide");

	if(perfilSsomaAccObj.estadoAccSsomaHabilitadosNombre.length == 0 && perfilSsomaAccObj.riesgoPotencialAsignadosNombre.length == 0 &&
		perfilSsomaAccObj.numTrabajadoresAsignados == 0){
		mensajeUx="<label>¿Está seguro de eliminar el registro perfil SSOMA seleccionado?</label>";
		mensajesUx(mensajeUx,3,"","ConfPerfilSsomaAcc");

		$("#btnDevolverValorConfPerfilSsomaAcc").on("click",function(){
			var dataParam={
				id:perfilSsomaAccId
			};

			callAjaxPost(URL+'/accidente/accidente_ssoma/perfil/delete',dataParam,function(data){
				switch(data.CODE_RESPONSE){
					case "05":
						mensajeUx="<label>El registro perfil SSOMA seleccionado se ha eliminado correctamente.</label>";
						mensajesUx(mensajeUx,1,"","ActualizarPerfilSsomaAcc");

						$("#modalMensajeUxActualizarPerfilSsomaAcc").on("hidden.bs.modal",function(){
							$("#modalPerfilesSsomaAcc").modal("show");cargarPerfilesSsomaAcc();
						});

						break;

					default:
						alert("Ocurrió un error al eliminar el registro perfil SSOMA!");
				}
			});
		});

		$("#btnRegresarPrevioConfPerfilSsomaAcc").on("click",function(){
			$("#modalPerfilesSsomaAcc").modal("show");
		});
	}else{
		mensajeUx="<label>No se puede eliminar el registro perfil SSOMA seleccionado " +
			"porque tiene valores asignados.<label>";
		mensajesUx(mensajeUx,2,"","EliminarPerfilSsomaAcc");

		$("#modalMensajeUxEliminarPerfilSsomaAcc").on("hidden.bs.modal",function(){
			$("#modalPerfilesSsomaAcc").modal("show");
		});
	}
}

var trabPerfSsomaAccId,trabPerfSsomaAccObj={},modRegTrabPerfSsomaAcc;
var banderaEdicionTrabPerfSsomaAcc = false;
var listTrabajadoresPerfilesSsomaAcc = [];

function volverTrabajadoresPerfilesSsomaAcc(){
	$("#modalTrabajadoresPerfSsomaAcc").modal("hide");$("#modalPerfilesSsomaAcc").modal("show");

	if(modRegTrabPerfSsomaAcc == 1){
		cargarPerfilesSsomaAcc();
	}
}

function verTrabajadoresPerfilesSsomaAcc(){
	$("#modalPerfilesSsomaAcc").modal("hide");$("#modalTrabajadoresPerfSsomaAcc").remove();

	modRegTrabPerfSsomaAcc = 0;

	var contenido = "";

	var buttonVolverPrincipal =
		"<button id='btnVolverTrabPerfSsomaAcc' type='button' class='btn btn-info' style='margin-right:5px' " +
				"onclick='volverTrabajadoresPerfilesSsomaAcc()' title='Regresar a la vista principal'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-2x fa-user'></i>" +
		"</button>";

	var buttonNuevo =
		"<button id='btnNuevoTrabPerfSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
				"title='Asociar un nuevo trabajador al perfil SSOMA.' onclick='nuevoTrabajadoresPerfilesSsomaAcc()'>" +
			"<i class='fa fa-file-o fa-2x'></i>" +
		"</button>";

	var buttonCancelar =
		"<button id='btnCancelarTrabPerfSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
				"onclick='cancelarTrabajadoresPerfilesSsomaAcc()' title='Cancelar'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
		"</button>";

	var buttonGuardar =
		"<button id='btnGuardarTrabPerfSsomaAcc' type='button' class='btn btn-success' style='margin-right:5px' " +
				"onclick='guardarTrabajadoresPerfilesSsomaAcc()' title='Guardar'>" +
			"<i class='fa fa-floppy-o fa-2x'></i>" +
		"</button>";

	var buttonEliminar =
		"<button id='btnEliminarTrabPerfSsomaAcc' type='button' class='btn btn-danger' style='margin-right:5px' " +
				"title='Eliminar.' onclick='eliminarTrabajadoresPerfilesSsomaAcc()'>" +
			"<i class='fa fa-times fa-2x'></i>" +
		"</button>";

	var modalOptions={
		maxWidth:"50%",id:"modalTrabajadoresPerfSsomaAcc",btnCerrarHabilitado:0,
		nombre:"<i class='fa fa-list-alt'></i> Perfiles SSOMA - Trabajadores",
		contenido:
			 buttonVolverPrincipal+buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar +
			"<div class='wrapper' id='wrapperTrabajadoresPerfSsomaAcc'>" +
				"<table id='tblTrabajadoresPerfSsomaAcc' class='table table-striped table-bordered table-hover table-fixed'>" +
					"<thead>" +
						"<tr>" +
							"<th class='tb-acc' style='width:300px'>Nombre</th>" +
							"<th class='tb-acc' style='width:150px'>Actualizado el</th>" +
						"</tr>" +
					"</thead>" +
					"<tbody></tbody>" +
				"</table>" +
			"</div>"};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	resizeDivWrapper("wrapperTrabajadoresPerfSsomaAcc",190);
	cargarTrabajadoresPerfilesSsomaAcc();
}

function cargarTrabajadoresPerfilesSsomaAcc(){
	banderaEdicionTrabPerfSsomaAcc = false;

	$("#btnVolverTrabPerfSsomaAcc").show();$("#btnCancelarTrabPerfSsomaAcc").hide();$("#btnGuardarTrabPerfSsomaAcc").hide();
	$("#btnNuevoTrabPerfSsomaAcc").show();$("#btnEliminarTrabPerfSsomaAcc").hide();

	var dataParam={
		perfilSsomaAccId:perfilSsomaAccId
	};

	callAjaxPost(URL+"/accidente/accidente_ssoma/perfil/trabajador",dataParam,function(data){
		if(data.CODE_RESPONSE == "05"){
			listTrabajadoresPerfilesSsomaAcc = data.listTrabajadoresPerfilesSsomaAcc;

			$("#tblTrabajadoresPerfSsomaAcc tbody tr").remove();

			listTrabajadoresPerfilesSsomaAcc.forEach(function(val,index){
				$("#tblTrabajadoresPerfSsomaAcc tbody").append(
					"<tr id='trTrabPerfilSsomaAcc"+val.trabajadorId+"' onclick='editarTrabajadoresPerfilesSsomaAcc("+index+")'>" +
						"<td id='nombreTrabPerfilSsomaAcc"+val.trabajadorId+"'>"+val.nombre+"</td>" +
						"<td id='fechaRegistroTrabPerfilSsomaAcc"+val.trabajadorId+"'>"+val.fechaActPerfAccSsomaTexto+"</td>" +
					"</tr>");
			});
		}else{
			console.log("NOPNPO");
		}

		goheadfixedY("#tblTrabajadoresPerfSsomaAcc","#wrapperTrabajadoresPerfSsomaAcc");
		formatoCeldaSombreableTabla(true,"tblTrabajadoresPerfSsomaAcc");
	});
}

function cancelarTrabajadoresPerfilesSsomaAcc(){
	cargarTrabajadoresPerfilesSsomaAcc();
}

function editarTrabajadoresPerfilesSsomaAcc(pindex){
	if(!banderaEdicionTrabPerfSsomaAcc){
		formatoCeldaSombreableTabla(false,"tblTrabajadoresPerfSsomaAcc");
		trabPerfSsomaAccId = listTrabajadoresPerfilesSsomaAcc[pindex].trabajadorId;
		trabPerfSsomaAccObj = listTrabajadoresPerfilesSsomaAcc[pindex];

		$("#trTrabPerfilSsomaAcc"+trabPerfSsomaAccId).addClass("fila-edicion");

		$("#fechaRegistroTrabPerfilSsomaAcc"+trabPerfSsomaAccId).html("<label>*Automático.</label>");

		banderaEdicionTrabPerfSsomaAcc = true;

		$("#btnVolverTrabPerfSsomaAcc").hide();$("#btnCancelarTrabPerfSsomaAcc").show();$("#btnGuardarTrabPerfSsomaAcc").hide();
		$("#btnNuevoTrabPerfSsomaAcc").hide();$("#btnEliminarTrabPerfSsomaAcc").show();
	}
}

function nuevoTrabajadoresPerfilesSsomaAcc(){
	if(!banderaEdicionTrabPerfSsomaAcc){
		formatoCeldaSombreableTabla(false,"tblTrabajadoresPerfSsomaAcc");
		trabPerfSsomaAccObj = {id: 0};trabPerfSsomaAccId = 0;

		$("#tblTrabajadoresPerfSsomaAcc tbody").prepend(
			"<tr>" +
				"<td><input class='form-control' id='inputBuscarTrabajadorPerfSsomaAcc'>" +
				"<div id='divSelTrabajadorPerfSsomaAcc'></div>" +
				"<label>*Buscar trabajador por DNI y/o nombre (debe ingresar 3 caracteres como mínimo).</label></td>" +
				"<td><label>*Automático.</label></td>" +
			"</tr>");

		buscarTrabajadorPerfilSsomaAccidente();

		$("#btnVolverTrabPerfSsomaAcc").hide();$("#btnCancelarTrabPerfSsomaAcc").show();$("#btnGuardarTrabPerfSsomaAcc").show();
		$("#btnNuevoTrabPerfSsomaAcc").hide();$("#btnEliminarTrabPerfSsomaAcc").hide();

		banderaEdicionTrabPerfSsomaAcc = true;
	}else{
		alert("Guarde primero.");
	}
}

var listTrabPerfSsomaAccBuscadorAux=[];

function buscarTrabajadorPerfilSsomaAccidente(){
	var nombre = $("#inputBuscarTrabajadorPerfSsomaAcc").val().trim();

	if(nombre.length >= 3){
		var dataParam={
			trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1,hasPerfilSsomaAcc:1
		};

		callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
			listTrabPerfSsomaAccBuscadorAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

			var selTrabajadorPerfSsomaAcc = crearSelectOneMenuOblig("selTrabajadorPerfSsomaAcc",
				"",listTrabPerfSsomaAccBuscadorAux,"","trabajadorId","nombre");

			$("#divSelTrabajadorPerfSsomaAcc").html(selTrabajadorPerfSsomaAcc);
			$("#inputBuscarTrabajadorPerfSsomaAcc").attr("onkeyup","buscarTrabajadorPerfilSsomaAccidente()");
		});
	}else{
		listTrabPerfSsomaAccBuscadorAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

		var selTrabajadorPerfSsomaAcc = crearSelectOneMenuOblig("selTrabajadorPerfSsomaAcc",
			"",listTrabPerfSsomaAccBuscadorAux,"","trabajadorId","nombre");

		$("#divSelTrabajadorPerfSsomaAcc").html(selTrabajadorPerfSsomaAcc);
		$("#inputBuscarTrabajadorPerfSsomaAcc").attr("onkeyup","buscarTrabajadorPerfilSsomaAccidente()");
	}
}

function guardarTrabajadoresPerfilesSsomaAcc(){
	var campoVacio = true;

	var trabajadorId = parseInt($("#selTrabajadorPerfSsomaAcc").val());

	if(trabajadorId == -1){
		campoVacio = false;
	}

	if(campoVacio){
		var dataParam={
			trabajadorId:trabajadorId,perfilSsomaAccId:perfilSsomaAccId
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/perfil/trabajador/save',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalTrabajadoresPerfSsomaAcc").modal("hide");

					mensajeUx="<label>El trabajador seleccionado fue asignado al perfil SSOMA con éxito.<label>";
					mensajesUx(mensajeUx,1,"","ActualizarTrabPerfilSsomaAcc");

					$("#modalMensajeUxActualizarTrabPerfilSsomaAcc").on("hidden.bs.modal",function(){
						$("#modalTrabajadoresPerfSsomaAcc").modal("show");modRegTrabPerfSsomaAcc = 1;
						cargarTrabajadoresPerfilesSsomaAcc();
					});

					break;

				default:
					console.log("Ocurrió un error al guardar la asignación del perfil SSOMA!");
			}
		});
	}else{
		$("#modalTrabajadoresPerfSsomaAcc").modal("hide");

		mensajeUx="<label>Debe seleccionar al trabajador.<label>";
		mensajesUx(mensajeUx,2,"","ValidacionTrabPerfilSsomaAcc");

		$("#modalMensajeUxValidacionTrabPerfilSsomaAcc").on("hidden.bs.modal",function(){
			$("#modalTrabajadoresPerfSsomaAcc").modal("show");
		});
	}
}

function eliminarTrabajadoresPerfilesSsomaAcc(){
	$("#modalTrabajadoresPerfSsomaAcc").modal("hide");

	mensajeUx="<label>¿Está seguro de retirar al trabajador seleccionado de este perfil?</label>";
	mensajesUx(mensajeUx,3,"","ConfTrabPerfilSsomaAcc");

	$("#btnDevolverValorConfTrabPerfilSsomaAcc").on("click",function(){
		var dataParam={
			trabajadorId:trabPerfSsomaAccId
		};

		callAjaxPost(URL+'/accidente/accidente_ssoma/perfil/trabajador/save',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx="<label>El trabajador seleccionado fue retirado de este perfil correctamente.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarTrabPerfilSsomaAcc");

					$("#modalMensajeUxActualizarTrabPerfilSsomaAcc").on("hidden.bs.modal",function(){
						$("#modalTrabajadoresPerfSsomaAcc").modal("show");modRegTrabPerfSsomaAcc = 1;
						cargarTrabajadoresPerfilesSsomaAcc();
					});

					break;

				default:
					alert("Ocurrió un error al retirar al trabajador seleccionado de este perfil!");
			}
		});
	});

	$("#btnRegresarPrevioConfTrabPerfilSsomaAcc").on("click",function(){
		$("#modalTrabajadoresPerfSsomaAcc").modal("show");
	});
}

function verGraficosQuickSightAccidente(){
    // console.log("QUICKSIGHT");
	volverQuicksight();
	// Mostrar mensaje de carga
	$('#divContainQuicksightAccidente').html('<div class="loading">Cargando...</div>');

	var dataParam = {
		idEmpresa: getSession("gestopcompanyid"),
	};

	callAjaxPost(URL + '/quicksight/accidente', dataParam, function (data) {
		if (data.CODE_RESPONSE === "05") {
			// Definir la URL del contenido que deseas mostrar en el iframe
			var urlDelIframe = data.embedUrl;

			// Crear el elemento iframe y configurar sus propiedades
			var $iframe = $('<iframe>', {
				src: urlDelIframe,
				width: '100%',
				height: '750px', // Ajusta esto según tus necesidades
				frameborder: '0',
				css: {
					border: 'none' // Opcional: Añadir estilos adicionales si es necesario
				}
			}).on('load', function () {
				// Eliminar el mensaje de carga una vez que el iframe se haya cargado
				$('.loading').remove();
				console.log('El contenido de QuickSight ha terminado de cargar.');
			});

			// Limpiar el contenedor y añadir el iframe
			$('#divContainQuicksightAccidente').empty().append($iframe);
		} else {
			console.log("No se pudieron cargar los datos de la huella de carbono.");
			// Actualizar el contenedor para mostrar un mensaje de error o quitar el mensaje de carga
			$('#divContainQuicksightAccidente').html('<div class="error">Error al cargar los datos.</div>');
		}
	});
}