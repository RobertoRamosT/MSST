var banderaEdicion;
var acInseguroId; var acInseguroObj;
var acInseguroTipoId;
var acInseguroCausa;
var areaId;
var reporteLugar;
var reporteTipo;
var reporteNombre;
var trabajadorId;

var reporteFecha;
var listArea=[];var listNivel;
var listDivisionActos= [];
var listActInsegTipo = [];
var listTrabsSelecccionados;
var listCausaBasica;var listFullTipoContacto;
var listCausaInmediataSimple;
var listOrigenReporte;
var lisTipoReporteLugar;
var listTipoReporteValido;

var listTrabs;
var listDniNombre;
var listanombretab;
var listTabla;
var listTablaAux;
var listTablaAuxCopmleta;
var contador2;
var numPaginaTotal;
var numPaginaActual;

var tienePermisoReporte;
var fechaInicioFiltro="2000-01-01";
var fechaFinFiltro="2057-12-31";
var arrayFiltroTipo=[];
var arrayFiltroCausa=[];
var arrayFiltroOrigen=[];
var arrayFiltroNivel=[];
var arrayFiltroArea=[];

var toggleFiltroCausa;
var numPaginaActualAcSubAdmin;
var mensajeUx;

function verFiltroAcinseguro(){
   $("#modalFiltroAcinseguro").modal("show");
}

function ocultarFiltroAcinseguro(){
   $("#modalFiltroAcinseguro").modal("hide");
}

var listDivisionesAcFiltro = [],listAreasAcFiltro = [],listTipoContactoAcFiltro = [],listActInsegTipoAcFiltro = [],
	listCausaInmediataSimpleAcFiltro = [];

$(document).ready(function(){
   var listOption=[
	  {id: 4,nombre: "Área vs meses"},
	  {id: 1,nombre: "Área vs Causa Inmediata"},
	  {id: 2,nombre: "Área vs Riesgo asociado",selected: 1},
	  {id: 5,nombre: "Reportes emitidos por cada área "},
	  {id: 6,nombre:"Colaboradores que emiten reportes"},
	  {id: 7,nombre: "Reportes por áreas en donde se registró el evento"}
	//{id : 3,nombre :"Área vs Tipo"},
	          ];
   
   var buttonFiltro="<button type='button' class='btn btn-success' style='margin-right:10px'" +
	                   " onclick='verFiltroAcinseguroIndicador()' title='Ver filtros'>" +
		       "<i class='fa fa-filter fa-2x'></i>" +
		    "</button>";
   
   var selTipoIndicadorActos = crearSelectOneMenuOblig("selTipoIndicadorActos",
	  "verFiltroAcinseguroIndicador();"+"verAcordeTipoIndicadorActos();"+"ocultarFiltroAcinseguroIndicador()",
	  listOption,"6","id","nombre","Seleccionar");
   
   $("#divIndicadoresEventoSub form").append(selTipoIndicadorActos+""+buttonFiltro);
    
   // var buttonFiltroConso="<button type='button' class='btn btn-success' style='margin-right:10px'" +
	//                         " onclick='verFiltroAcinseguroConsolidado()' title='Ver filtros'>" +
	// 		    "<i class='fa fa-filter fa-2x'></i>" +
	// 		 "</button>";
   //
   // $("#divConsolidadoEventoSub form").append(""+""+buttonFiltroConso);
    
   $(document).on('change',':file',function(){
      var input = $(this),
	  numFiles = input.get(0).files ? input.get(0).files.length : 1,
	  label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	    
      input.trigger('fileselect', [numFiles, label]);
      $(".modal-body img").hide();
   });
	 
   $(document).on('fileselect',"input:file",function(event,numFiles,label){
      var input = $(this).parents('.input-group').find(':text'),
          log = numFiles > 1 ? numFiles + ' files selected' : label;

      if(input.length){
         input.val(log);
      }else{
	 if(log)alert(log);
      }
   });
	
   $('.izquierda_flecha').on('click',function(){
      numPaginaActual = numPaginaActual-1
      cambiarPaginaTabla();
   });
	 
   $('.derecha_flecha').on('click',function(){
      numPaginaActual = numPaginaActual+1;
      cambiarPaginaTabla();
   });
	  
   $('.izquierda_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
        $(this).css('opacity','1');
   });

   $('.derecha_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });
	 
   insertMenu();

   $("#tdlabelArea").html(getSession("gestoparea"));
	
   callAjaxPost(URL+"/acinseguro/filtro",{matrixId: getUrlParameter("mdfId"),
					  companyId: getSession("gestopcompanyid")},function(data){
      listDivisionActos = data.divisiones;
      /*verFiltroEventoGeneral();
        $("#formAplicarFiltro").on("submit",function(e){
	   e.preventDefault();
           cargarPrimerEstado();
	});*/
		
      var hoy = obtenerFechaActual();
		
      $("#fechaInicioEvento").val(sumaFechaDias(-30,hoy));
      $("#fechaFinEvento").val(hoy);
		
      var listTipo = $("#filtroTipoEvento").val();
      var listCausa = $("#filtroCausaEventoGeneral").val();
      var listNivelRiesgo = $("#filtroNivelRiesgo").val();
      var listDivisiones = $("#selDivisionActoFiltro").val();
      var listAreas = $("#selAreaActoFiltro").val();
      var listTipoContacto = $("#filtroRiesgoAsociado").val();
		
      var selValidezReporte = crearSelectOneMenu("selValidezReporte","",
	     data.listTipoReporteValido,-1,"id","nombre","Todos");
		
      //***************************** modalFiltroAcinseguro ********************
      var contenido = "";
		
      var listContenido=[
             {sugerencia:"",label:"Desde",inputForm:"<input type='date' class='form-control' id='fechaInicioEvento' >"},
             {sugerencia:"",label:"Hasta",inputForm:"<input type='date' class='form-control' id='fechaFinEvento' >"},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",label:"División",inputForm:"",divContainer:"divFiltroDivision"},
             {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroArea"},
             {sugerencia:"",label:"Niveles de riesgo",inputForm:"",divContainer:"divFiltNivelRiesgo"},
             {sugerencia:"",label:"Tipos",inputForm:"",divContainer:"divFiltTipoEvento"},
             {sugerencia:"",label:"Causas",inputForm:"",divContainer:"divFiltroCausaEventoGeneral"},
             {sugerencia:"",label:"Riesgos asociados",inputForm:"",divContainer:"divFiltroRiesgoAsociado"},
             {sugerencia:"",label:"Validez Reporte",inputForm:selValidezReporte},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",
              label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroAcinseguro()'>" +
              	       "<i class='fa fa-times'></i> Cancelar" +
              	    "</button>",
    	      inputForm:"<button class='btn btn-success' type='button' onclick='cargarPrimerEstado()' style='float:right;font-size:18px;'>" +
    	      		   "<i class='fa fa-filter'></i> Aplicar filtro" +
    	      		"</button>"},
		        ];
		
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
		
      var modalOptions={
	     id: "modalFiltroAcinseguro",
	     nombre: "<i class='fa fa-filter'></i> Filtros",
	     contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
	               };

	   listDivisionesAcFiltro = data.divisiones;listAreasAcFiltro = data.listArea;listTipoContactoAcFiltro = data.listTipoContacto;
	   listActInsegTipoAcFiltro = data.tipos;listCausaInmediataSimpleAcFiltro = data.causas.filter(function(val){return val.causaInmTipoEvent != 5;});
		
      crearModalPrincipalUsuario(modalOptions,function(){
         if($("#selDivisionActoFiltro").length > 0){
	    return;
         }
		   
         crearSelectOneMenuObligMultipleCompleto("filtroTipoEvento","",data.tipos,
            "id","nombre","#divFiltTipoEvento","Todos");
		    
         crearSelectOneMenuObligMultipleCompleto("filtroCausaEventoGeneral","",
            data.causas.filter(function(val){
	       return val.causaInmTipoEvent != 5;
            }),"id","nombre","#divFiltroCausaEventoGeneral","Todas");
			
         crearSelectOneMenuObligMultipleCompleto("filtroNivelRiesgo","",data.listNivel,
            "nivelRiesgoId","nivelRiesgoNombre","#divFiltNivelRiesgo","Todos");
		    	
         crearSelectOneMenuObligMultipleCompleto("selDivisionActoFiltro","",data.divisiones,
            "divisionId","divisionName","#divFiltroDivision","Todos");
		    
	 // Tabla tipo_contacto
         crearSelectOneMenuObligMultipleCompleto("filtroRiesgoAsociado","",data.listTipoContacto,
            "id","nombre","#divFiltroRiesgoAsociado","Todos");
		    
         crearSelectOneMenuObligMultipleCompleto("selAreaActoFiltro","validarDivision()",data.listArea,
            "areaId","areaName","#divFiltroArea","Todos");
		    
         listArea = data.listArea;
         //  verAcordeDivisionFiltroActo();
      },false);
		
      $("#fechaInicioEvento").val(sumaFechaDias(-180,hoy));
      $("#fechaFinEvento").val(hoy);
		      
      insertMenu();
      cargarPrimerEstado();
   });
	
   $("#mdVerif").load("agregaraccionmejora.html");
   $("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
	
   $("#listTrabBuscar").hide();	 
   
   $("#mdTrabs").on("hidden.bs.modal",function(){
      $('#mdReporte').modal('show'); 
   });
   
   $("#modalRespuesta").on("hidden.bs.modal",function(){
      $('#mdReporte').modal('show'); 
   });

	$("#flechaIzquierdaAcSubAdmin").on('click',function(){
		numPaginaActualAcSubAdmin = numPaginaActualAcSubAdmin-1;
		cambiarPaginaTabla();
	});

	$('#flechaDerechaAcSubAdmin').on('click',function(){
		numPaginaActualAcSubAdmin = numPaginaActualAcSubAdmin+1;
		cambiarPaginaTabla();
	});

	$("#flechaIzquierdaConsAcSub").on('click',function(){
		numPaginaActualConsAcSub = numPaginaActualConsAcSub-1;
		cambiarPaginaConsolidadoActosAdmnistrador();
	});

	$('#flechaDerechaConsAcSub').on('click',function(){
		numPaginaActualConsAcSub = numPaginaActualConsAcSub+1;
		cambiarPaginaConsolidadoActosAdmnistrador();
	});
});

var noDefinidoFiltro = [{id:0,nombreAux:"No definido"}];

function cargarIndicadoresActosAdmnistrador(){ 
   var listDivision = $("#selDivisionActoFiltroIndicador").val();
	var listAreaLocal = $("#selAreaActoFiltroIndicador").val();
	var listCausasInmediatas = $("#selCausaActoFiltroIndicador").val();
	var listSubTiposContacto = $("#selSubTipoContactoActoFiltroIndicador").val();
	var listTipoActo = $("#selTipoActoFiltroIndicador").val();

	
	var listCausaIdGlobal = [];var listAreaIdGlobal = [];
	var listSubTiposContactoIdGlobal = []; var listTipoActoIdGlobal = [];
	var listDivisionIdGlobal = [];
	if(listCausasInmediatas != null){
		listCausasInmediatas.forEach(function(val){
			listCausaIdGlobal.push(parseInt(val));
		});
	}
	if(listAreaLocal != null){
	    listAreaLocal.forEach(function(val){
			listAreaIdGlobal.push(parseInt(val));
		});
	}
	if(listDivision != null){
		listDivision.forEach(function(val){
			listDivisionIdGlobal.push(parseInt(val));
		});
	}
	
	if(listSubTiposContacto != null){
		listSubTiposContacto.forEach(function(val){
			listSubTiposContactoIdGlobal.push(parseInt(val));
		});
	}
	if(listTipoActo != null){
		listTipoActo.forEach(function(val){
			listTipoActoIdGlobal.push(parseInt(val));
		});
	}
	var fechaInicioFiltro = convertirFechaTexto($("#fechaInicioIndicadorEvento").val() );
	var fechaFinFiltro = convertirFechaTexto($("#fechaFinIndicadorEvento").val() );
	 
	(listCausaIdGlobal.length == 0?listCausaIdGlobal = null:"");
	(listAreaIdGlobal.length == 0?listAreaIdGlobal = null:"");
	(listDivisionIdGlobal.length == 0?listDivisionIdGlobal = null:"");
	(listSubTiposContactoIdGlobal.length == 0?listSubTiposContactoIdGlobal = null:"");
	(listTipoActoIdGlobal.length == 0?listTipoActoIdGlobal = null:"");
	var dataParam2={
			matrixId:getUrlParameter("mdfId"),
			companyId:getSession("gestopcompanyid"),
			listCausaId : listCausaIdGlobal,
			listAreaId : listAreaIdGlobal,
			listDivisionId : listDivisionIdGlobal,
			listTipoContactoId : listSubTiposContactoIdGlobal,
			listTipoActoId : listTipoActoIdGlobal,
			
			fechaInicioFiltro : fechaInicioFiltro,
			fechaFinFiltro : fechaFinFiltro,
	}
	callAjaxPost(URL + '/acinseguro', dataParam2,function(data){
		var tipoIndicador =parseInt($("#selTipoIndicadorActos").val() );
		var listFullActosConsolidado = data.list;
		var listResponsablesActoColaborador = data.trabajadoresAreas;
		$("#tblConsolidadoActo tbody tr").remove();
		$("#tblConsolidadoActo thead tr td").remove();
		var listTipoActo = listActInsegTipo.filter(function(val){
			if(listTipoActoIdGlobal == null){
				return true;
			}
			 return listTipoActoIdGlobal.indexOf(val.id) > -1 ;
		});
		var listSubTiposContacto = noDefinidoFiltro.concat(listFullTipoContacto).filter(function(val){
			if(listSubTiposContactoIdGlobal == null){
				return true;
			}
			 return listSubTiposContactoIdGlobal.indexOf(val.id) > -1 ;
		});
		var listCausaIndicador = listCausaInmediataSimple.filter(function(val){
			if(listCausaIdGlobal == null){
				return true;
			}
			 return listCausaIdGlobal.indexOf(val.id) > -1 ;
		});
		var listAreaIndicador = listArea.filter(function(val){
			if(listAreaIdGlobal == null){
				if(listDivisionIdGlobal == null){
					return true;
				}
				return listDivisionIdGlobal.indexOf(val.divisionId) > -1
				
			}
			 return listAreaIdGlobal.indexOf(val.areaId) > -1 ;
		});
		var listFechas= hallarFechasPeriodoActo();
		switch(tipoIndicador){
		case 5:
			 
			listAreaIndicador.forEach(function(val){
				val.numActos = 0;
				listFullActosConsolidado.forEach(function(val2){
					if(val2.trabajadorAreaId == val.areaId){
						val.numActos++;
					}
				});
			});
			listAreaIndicador.sort(function(a, b) {
				  return -a.numActos + b.numActos;
			});
			$("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
			$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Área</strong></td>");
			listAreaIndicador.forEach(function(val){
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>"+val.areaName+"</td>");
				$("#tblConsolidadoActo tbody tr").append("<td>"+val.numActos+"</td>");
				
			});
			break;
		case 6:
			listResponsablesActoColaborador.forEach(function(val){
				val.numActos = 0;
				listFullActosConsolidado.forEach(function(val2){
					if(val2.trabajadorId == val.trabajadorId){
						val.numActos++;
					}
				});
			});
			listResponsablesActoColaborador.sort(function(a, b) {
				  return -a.numActos + b.numActos;
			});
			$("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
			$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Trabajador reporta</strong></td>");
			listResponsablesActoColaborador.forEach(function(val){
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>"+val.nombre+"</td>");
				$("#tblConsolidadoActo tbody tr").append("<td>"+val.numActos+"</td>");
				
			});
			break;
		case 7:
			 
			listAreaIndicador.forEach(function(val){
				val.numActos = 0;
				listFullActosConsolidado.forEach(function(val2){
					if(val2.areaId == val.areaId){
						val.numActos++;
					}
				});
			});
			listAreaIndicador.sort(function(a, b) {
				  return -a.numActos + b.numActos;
			});
			$("#tblConsolidadoActo tbody").html("<tr><td><strong>Total</strong></td></tr>");
			$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'><strong>Área</strong></td>");
			listAreaIndicador.forEach(function(val){
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 180px'>"+val.areaName+"</td>");
				$("#tblConsolidadoActo tbody tr").append("<td>"+val.numActos+"</td>");
				
			});
			break;
			
		case 4:
			break;
		case 1:
			$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+"Área / Causa"+"</td>");
			listCausaIndicador.forEach(function(val){
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+val.nombre+"</td>");
			});
			break;
		case 2:
			
			break;
		case 3:
			$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+"Área / Tipo"+"</td>");
			listTipoActo.forEach(function(val){
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+val.nombre+"</td>");
			});
			break;
		}

		if(tipoIndicador == 4){
			 $("#tblConsolidadoActo tbody")
			 .append("<tr id='trtotal'><td>Total</td></tr>" +
			 		"<tr id='trindicador1'><td>Porcentaje</td></tr>"+
					 "<tr id='trindicadorAcum' style='    border-bottom: 2px solid black;'><td>Porcentaje acumulado</td></tr>"+
					 "");
			 	var indicadorAcum = 0; 
				listFechas.forEach(function(val){
					val.numActosOrden =0;
					
					listFullActosConsolidado.forEach(function(val2){
						if(val2.fechaAnio == val.anio && val2.fechaMes == val.mes){
							val.numActosOrden++;
						}
						
					});
				});
				listFechas.forEach(function(val){
					val.indicadorTest = val.numActosOrden +"/"+ listFullActosConsolidado.length;
					val.indicador = val.numActosOrden / listFullActosConsolidado.length;
					indicadorAcum += val.indicador;
					val.indicadorAcumulado = indicadorAcum;
					$("#trindicadorAcum").append("<td>"+pasarDecimalPorcentaje(val.indicadorAcumulado,2)+"</td>")
					$("#trindicador1").append("<td>"+pasarDecimalPorcentaje(val.indicador,2)+"</td>")
					$("#trtotal").append("<td>"+val.numActosOrden+"</td>")
				});

				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+"Área / Meses"+"</td>");
				listFechas.forEach(function(val){
					$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+val.nombre+"</td>");
				});
				 
			}
		if(tipoIndicador == 2){
			 $("#tblConsolidadoActo tbody")
			 .append("<tr id='trtotal' style='border-top: 2px solid black;'><td>Total</td></tr>" +
			 		"<tr id='trindicador1'><td>Porcentaje</td></tr>"+
					 "<tr id='trindicadorAcum' ><td>Porcentaje acumulado</td></tr>"+
					 "");
			 	var indicadorAcum = 0; 
				listSubTiposContacto.forEach(function(val){
					val.numActosOrden =0;
					
					listFullActosConsolidado.forEach(function(val2){
						var pertenece = false;
						var lista1=val2.idTiposContacto; 
						var listaTipoContacto=lista1.split(",");
						
						listaTipoContacto.forEach(function(val3){
							if(val.id == val3){
								pertenece= true;
							}
						});
						if(pertenece){
							val.numActosOrden++;
						}
						
					});
				});
				listSubTiposContacto.sort(function(a, b) {
					  return -a.numActosOrden + b.numActosOrden;
				});
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+"Área / Riesgo Asociado"+"</td>");
				listSubTiposContacto.forEach(function(val){
					$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+val.nombreAux+"</td>");
				});
				$("#tblConsolidadoActo thead tr").append("<td class='tb-acc' style='width : 160px'>"+"Total"+"</td>");
				var numActosOrdenTotal = 0;
				listSubTiposContacto.forEach(function(val){
					val.indicadorTest = val.numActosOrden +"/"+ listFullActosConsolidado.length;
					val.indicador = val.numActosOrden / listFullActosConsolidado.length;
					indicadorAcum += val.indicador;
					val.indicadorAcumulado = indicadorAcum;
					
					numActosOrdenTotal +=val.numActosOrden;
					$("#trindicadorAcum").append("<td>"+pasarDecimalPorcentaje(val.indicadorAcumulado,2)+"</td>")
					$("#trindicador1").append("<td>"+pasarDecimalPorcentaje(val.indicador,2)+"</td>")
					$("#trtotal").append("<td>"+val.numActosOrden+"</td>");
				});
				$("#trindicadorAcum").append("<td>"+"100%"+"</td>")
				$("#trindicador1").append("<td>"+"100%"+"</td>")
				$("#trtotal").append("<td>"+numActosOrdenTotal+"</td>");
			}
		listAreaIndicador.forEach(function(val){
			 val.causas = [];
			 listCausaIndicador.forEach(function(val1){
				 val.causas.push({id: val1.id,nombre : val1.nombre})
			 });
			 
			 val.subtiposcontacto = [];
			 listSubTiposContacto.forEach(function(val1){
				 val.subtiposcontacto.push({id: val1.id,nombre : val1.nombre})
			 });
			 val.fechas = [];
			 listFechas.forEach(function(val1){
				 val.fechas.push({anio: val1.anio,mes: val1.mes,nombre : val1.nombre})
			 })
			 val.tipos = listTipoActo;
			 switch(tipoIndicador){
			 case 1:
			 case 2:
			 case 3:
			 case 4:
				 $("#tblConsolidadoActo tbody").prepend("<tr id='trfilar"+val.areaId+"'><td>"+val.areaName+"</td></tr>");
				 break;
			 }
			
			 
				switch(tipoIndicador){
				case 1:
				 val.causas.forEach(function(val1){
					val1.numActos = 0;
					listFullActosConsolidado.forEach(function(val2){
						if(val2.areaId == val.areaId && val2.acInseguroCausaId == val1.id){
							val1.numActos++;
						}
					});
					$("#trfilar"+val.areaId).append("<td>" +
							//"<a onclick='verDetalleActoAreaCausa("+val.areaId+","+val1.id+")' class='efectoLink'>"+
							val1.numActos
							//+"</a>" 
							+"</td>")
				 });
				 break;
				case 2:
					var numActosTotal =0;
					 val.subtiposcontacto.forEach(function(val1){
						val1.numActos = 0;
						listFullActosConsolidado.forEach(function(val2){
							var pertenece = false;
							var lista1=val2.idTiposContacto; 
							var listaTipoContacto=lista1.split(",");
							
							listaTipoContacto.forEach(function(val3){
								if(val1.id == val3){
									pertenece= true;
								}
							});
							if(pertenece && val2.areaId == val.areaId){
								val1.numActos++;
							}
							
						});
						numActosTotal += val1.numActos;
						$("#trfilar"+val.areaId).append("<td>" +
								//"<a onclick='verDetalleActoSubTipoContactoArea("+val.id+","+val1.id+")' class='efectoLink'>"+
								val1.numActos
								//+"</a>" 
								+"</td>")
					 });
					 $("#trfilar"+val.areaId).append("<td>" +
						numActosTotal
						+"</td>")
					 break; 
				case 4:
					val.fechas.forEach(function(val1){
						val1.numActos = 0;
						listFullActosConsolidado.forEach(function(val2){
							if(val2.areaId == val.areaId && val2.fechaAnio == val1.anio && val2.fechaMes == val1.mes){
								val1.numActos++;
							}
						});
						$("#trfilar"+val.areaId).append("<td>" +
								//"<a onclick='verDetalleActoTipoArea("+val.id+","+val1.id+")' class='efectoLink'>"+
								val1.numActos
								//+"</a>" 
								+"</td>")
					 });
					 break;
					 
				}
				
			 
		});
		
		
		 
		switch(tipoIndicador){
		case 5:
			var dataPrincipal = [];
			var listCategories = [];
			var listCantidad =  [];
			listAreaIndicador.forEach(function(val){
				listCategories.push(val.areaName);
				listCantidad.push(val.numActos);
				dataPrincipal.push(
						{"name": val.nombre,
		                    "y": val.numActos}
						);
			});
			dataPrincipal.sort(function(a, b) {
				  return -a.y + b.y;
				});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: 'RANKING DE ÁREA QUE MÁS REPORTA'
			    },
			    xAxis: {
			        categories: listCategories,
			        crosshair: true
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: 'Reportes'
			        }
			    },
			    tooltip: {
			        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
			        footerFormat: '</table>',
			        shared: true,
			        useHTML: true
			    },
			    plotOptions: {
			        column: {
			            pointPadding: 0.2,
			            borderWidth: 0
			        }
			    },
			    series: [{
			        name: 'Total',
			        data: listCantidad

			    }]
			});
			break;
		case 6:
			var listCategories = [];
			var listCantidad =  [];
			listResponsablesActoColaborador.forEach(function(val){
				listCategories.push(val.nombre);
				listCantidad.push(val.numActos); 
			});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: 'RANKING PERSONA QUE MÁS REPORTA'
			    },
			    xAxis: {
			        categories: listCategories,
			        crosshair: true
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: 'Reportes'
			        }
			    },
			    tooltip: {
			        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
			        footerFormat: '</table>',
			        shared: true,
			        useHTML: true
			    },
			    plotOptions: {
			        column: {
			            pointPadding: 0.2,
			            borderWidth: 0
			        }
			    },
			    series: [{
			        name: 'Total',
			        data: listCantidad

			    }]
			});
			
			break;
		case 7:
			var dataPrincipal = [];
			var listCategories = [];
			var listCantidad =  [];
			listAreaIndicador.forEach(function(val){
				listCategories.push(val.areaName);
				listCantidad.push(val.numActos);
				dataPrincipal.push(
						{"name": val.nombre,
		                    "y": val.numActos}
						);
			});
			dataPrincipal.sort(function(a, b) {
				  return -a.y + b.y;
				});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: 'REPORTES POR ÁREA DÓNDE SE REGISTRÓ EL EVENTO'
			    },
			    xAxis: {
			        categories: listCategories,
			        crosshair: true
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: 'Reportes'
			        }
			    },
			    tooltip: {
			        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
			        footerFormat: '</table>',
			        shared: true,
			        useHTML: true
			    },
			    plotOptions: {
			        column: {
			            pointPadding: 0.2,
			            borderWidth: 0
			        }
			    },
			    series: [{
			        name: 'Total',
			        data: listCantidad

			    }]
			});
		break;
		
		case 1:
			var dataPrincipal = [];
			var dataSeries = [];
			listCausaIndicador.forEach(function(val){
				val.numActosTotal = 0;
				val.areas = [];
				listAreaIndicador.forEach(function(val1){
					val.areas.push({areaId : val1.areaId, areaName : val1.areaName})
				});
				 
				var dataArea = [];
				val.areas.forEach(function(val1){
					val1.numActos = 0;
					listFullActosConsolidado.forEach(function(val2){
						if(val2.areaId == val1.areaId && val2.acInseguroCausaId == val.id){
							val1.numActos++;
						}
						
					}); 
					dataArea.push([val1.areaName,val1.numActos])
				});
				dataSeries.push(
						{"name": val.nombreAux,
			                "id": val.id+"",
			                "data":   dataArea  }		
						);
			});
			listAreaIndicador.forEach(function(val){
				val.causas.forEach(function(val1){
					
					listCausaIndicador.forEach(function(val2){
						if(val2.id == val1.id){
							val2.numActosTotal += val1.numActos;
						}
					});
				});
			});
			
			listCausaIndicador.forEach(function(val){
				dataPrincipal.push(
						{"name": val.nombre,
		                    "y": val.numActosTotal,
		                    "drilldown": val.id+""}
						);
			});
			dataPrincipal.sort(function(a, b) {
				  return -a.y + b.y;
				})
			Highcharts.setOptions({
			    lang: {
			        drillUpText: '<< Volver'
			    }
			});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: ' Causas Inmediatas Total'
			    },
			    xAxis: {
			        type: 'category',
			        labels: {
						style: {
			                width: '400px',
			                whiteSpace: 'nowrap'
						},
						//rotation : 90
						//"align": "left",
						//"y": -40,
						//"x": 4
					},
			    },
			    yAxis: {
			        title: {
			            text: 'Cantidad'
			        }

			    },
			    legend: {
			        enabled: false
			    },
			    plotOptions: {
			        series: {
			            borderWidth: 0,
			            dataLabels: {
			                enabled: true,
			                format: '{point.y}'
			            }
			        }
			    },

			    tooltip: {
			        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
			    },

			    "series": [
			        {
			            "name": "Causas Inmediatas",
			            "colorByPoint": true,
			            "data": dataPrincipal
			        }
			    ],
			    "drilldown": {
			    	 drillUpButton: {
			             relativeTo: 'spacingBox',
			             position: {
			             align: "left",
			                 y: 0,
			                 x: 0
			             }
			    	 },
			        "series": dataSeries
			    }
			}); 
			break;
		case 2:
			var dataPrincipal = [];
			var dataSeries = [];
			listSubTiposContacto.forEach(function(val){
				val.numActosTotal = 0;
				val.areas = [];
				listAreaIndicador.forEach(function(val1){
					val.areas.push({areaId : val1.areaId, areaName : val1.areaName})
				});
				 
				var dataArea = [];
				val.areas.forEach(function(val1){
					val1.numActos = 0;
					listFullActosConsolidado.forEach(function(val2){
						var pertenece = false;
						var lista1=val2.idTiposContacto; 
						var listaTipoContacto=lista1.split(",");
						
						listaTipoContacto.forEach(function(val3){
							if(val.id == val3){
								pertenece= true;
							}
						});
						if(pertenece && val2.areaId == val1.areaId){
							val1.numActos++;
						}
						
					}); 
					dataArea.push([val1.areaName,val1.numActos])
				});
				dataSeries.push(
						{"name": val.nombreAux,
			                "id": val.id+"",
			                "data":   dataArea  }		
						);
			});
			listAreaIndicador.forEach(function(val){
				val.subtiposcontacto.forEach(function(val1){
					
					listSubTiposContacto.forEach(function(val2){
						if(val2.id == val1.id){
							val2.numActosTotal += val1.numActos;
						}
					});
				});
			});
			
			listSubTiposContacto.forEach(function(val){
				dataPrincipal.push(
						{"name": val.nombreAux,
		                    "y": val.numActosTotal,
		                    "drilldown": val.id+""}
						);
			});
			dataPrincipal.sort(function(a, b) {
				  return -a.y + b.y;
				})
			Highcharts.setOptions({
			    lang: {
			        drillUpText: '<< Volver'
			    }
			});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: '  Riesgos Asociados Total'
			    },
			    xAxis: {
			        type: 'category',
			        labels: {
						style: {
			                width: '400px',
			                whiteSpace: 'nowrap'
						},
						//rotation : 90
						//"align": "left",
						//"y": -40,
						//"x": 4
					},
			    },
			    yAxis: {
			        title: {
			            text: 'Cantidad'
			        }

			    },
			    legend: {
			        enabled: false
			    },
			    plotOptions: {
			        series: {
			            borderWidth: 0,
			            dataLabels: {
			                enabled: true,
			                format: '{point.y}'
			            }
			        }
			    },

			    tooltip: {
			        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
			    },

			    "series": [
			        {
			            "name": "Riesgos Asociados",
			            "colorByPoint": true,
			            "data": dataPrincipal
			        }
			    ],
			    "drilldown": {
			    	 drillUpButton: {
			             relativeTo: 'spacingBox',
			             position: {
			             align: "left",
			                 y: 0,
			                 x: 0
			             }
			    	 },
			        "series": dataSeries
			    }
			});
			$("#wrapperGraficoActosResponsable .highcharts-axis-labels > text > tspan").each(function(index,elem){
				 if($(elem).next("title").length > 0){
				//	$(elem).html($(elem).next("title").html());
				 }
			});
			break;
		case 4:
			var dataPrincipal = [];
			var dataSeries = [];
			listFechas.forEach(function(val){
				val.numActosTotal = 0;
				val.areas = [];
				listAreaIndicador.forEach(function(val1){
					val.areas.push({areaId : val1.areaId, areaName : val1.areaName})
				});
				 
				var dataArea = [];
				val.areas.forEach(function(val1){
					val1.numActos = 0;
					listFullActosConsolidado.forEach(function(val2){
						 
						if(val2.fechaAnio == val.anio && val2.fechaMes == val.mes 
								&& val2.areaId == val1.areaId){
							val1.numActos++;
						}
						
					}); 
					dataArea.push([val1.areaName,val1.numActos])
				});
				dataSeries.push(
						{"name": val.anio+""+val.mes,
			                "id": val.anio+""+val.mes,
			                "data":   dataArea  }		
						);
			});
			listAreaIndicador.forEach(function(val){
				val.fechas.forEach(function(val1){
					
					listFechas.forEach(function(val2){
						if(val2.anio == val1.anio && val2.mes == val1.mes){
							val2.numActosTotal += val1.numActos;
						}
					});
				});
			});
			
			listFechas.forEach(function(val){
				dataPrincipal.push(
						{"name": val.nombre,
		                    "y": val.numActosTotal,
		                    "drilldown": val.anio+""+val.mes+""}
						);
			});
			 console.log(dataSeries);
			 console.log(dataPrincipal);
			Highcharts.setOptions({
			    lang: {
			        drillUpText: '<< Volver'
			    }
			});
			// Create the chart
			Highcharts.chart('wrapperGraficoActosResponsable', {
			    chart: {
			        type: 'column'
			    },
			    title: {
			        text: '  Cantidad por Mes Total'
			    },
			    xAxis: {
			        type: 'category'
			    },
			    yAxis: {
			        title: {
			            text: 'Cantidad'
			        }

			    },
			    legend: {
			        enabled: false
			    },
			    plotOptions: {
			        series: {
			            borderWidth: 0,
			            dataLabels: {
			                enabled: true,
			                format: '{point.y}'
			            }
			        }
			    },

			    tooltip: {
			        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y }</b> <br/>'
			    },

			    "series": [
			        {
			            "name": "Meses",
			            "colorByPoint": true,
			            "data": dataPrincipal
			        }
			    ],
			    "drilldown": {
			    	 drillUpButton: {
			             relativeTo: 'spacingBox',
			             position: {
			             align: "left",
			                 y: 0,
			                 x: 0
			             }
			    	 },
			        "series": dataSeries
			    }
			});
			break;
		}
	});
}

function volverDivEventos(){
   $("#generalDivEventos .container-fluid").hide();
   $("#divEventosSub").show();
   $("#generalDivEventos h2").html("Actos y Condiciones Subestándar")
}

function volverDivAccionesEvento(){
   $("#generalDivEventos .container-fluid").hide();
   $("#divAccionesSolicitudEventoSub").show();
   $("#generalDivEventos h2")
   .html("<a onclick='volverDivEventos()'>Actos y Condiciones Subestándar</a> > Acciones de mejora")	
}

var listFullAccionesSolicitudEventosSub=[];

function verAccionesEventoSub(){
   volverDivAccionesEvento();
   
   var audiObj={
	  acInseguroId: acInseguroId
	       };
	
   callAjaxPost(URL+'/acinseguro/acciones',audiObj,function(data){
      if(data.CODE_RESPONSE == "05"){ 
         $("#tblAccSolEveventoSub tbody tr").remove();
         listFullAccionesSolicitudEventosSub = data.list;
         
         listFullAccionesSolicitudEventosSub = listFullAccionesSolicitudEventosSub.filter(function(val){
	    return val.solicitud.numActAsociadas > 0;
         });
					
         listFullAccionesSolicitudEventosSub.forEach(function(value,index){
	    var btnEvidencia = "Sin asignar";
					    
	    if(value.evidenciaNombre != null){
	       btnEvidencia = "<a class='efectoLink' target='_blank' " +
				 "href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+value.accionMejoraId+"'>" +
			         "<i class='fa fa-download'></i> Descargar" +
			      "</a>";
	    }
						
	    $("#tblAccSolEveventoSub tbody")
	    .append("<tr>" + 
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
		    "</tr>");
         });
      }
   });
}

function volverDivAccionesEventoColaborador(){
   $("#generalDivEventos .container-fluid").hide();
   $("#divAccionesSolicitudEventoSubColaborador").show();
   $("#generalDivEventos h2")
   .html("<a onclick='volverDivEventos()'>Actos y Condiciones Subestándar</a> > Acciones de mejora")	
}

function verAccionesEventoSubColaborador(){
   volverDivAccionesEventoColaborador();
	
   var audiObj={
	  acInseguroId: acInseguroId
	       };
	
   callAjaxPost(URL+'/acinseguro/acciones',audiObj,function(data){ 
      if(data.CODE_RESPONSE == "05"){ 
         $("#tblAccSolEveventoSubColaborador tbody tr").remove();
         listFullAccionesSolicitudEventosSub = data.list;
         
         listFullAccionesSolicitudEventosSub = listFullAccionesSolicitudEventosSub.filter(function(val){
            return val.solicitud.numActAsociadas == 0;
         });
					
         listFullAccionesSolicitudEventosSub.forEach(function(value,index){
            $("#tblAccSolEveventoSubColaborador tbody")
            .append("<tr>" +
		       "<td>"+value.tipoAccionNombre+"</td>" +
		       "<td>"+value.descripcion+"</td>" +
		       "<td>"+(value.observacion == ""?"------":value.observacion)+"</td>" +
		       "<td>"+value.responsableNombre+"</td>" +
		       "<td>"+value.fechaRevisionTexto+"</td>" +
		       "<td>"+value.fechaRealTexto+"</td>" +
		       "<td>"+value.inversionAccion+"</td>" +
		       "<td style='font-weight:800;color:"+value.estadoColor+"'>"+value.estadoCumplimientoNombre+"</td>" +
		    "</tr>");
         });
      }
   });
}

function verOrigenSolicitudAccion(pindex){
   var accionObj = listFullAccionesSolicitudEventosSub[pindex];
	
   $("#generalDivEventos .container-fluid").hide();
   $("#divOrigenAccionesSolicitudEventoSub").show();
   $("#generalDivEventos h2")
   .html("<a onclick='volverDivAccidente()'>Actos y Condiciones Subestándar</a> " +
	 " > <a onclick='volverDivAccionesEvento()' >Solicitud de mejora '"+accionObj.descripcion+"' </a>" +
	 " > Asociados");
	
   callAjaxPost(URL+'/auditoria/accion/origenes',{gestionAccionMejoraId:accionObj.solicitud.gestionAccionMejoraId},function(data){
      var list = data.list; 

      $("#tblItemAsoc tbody tr").remove();  
		
      list.forEach(function(val,index){ 
         var btnDescargaCausa = ""; 
			
         if(val.evidenciaNombre != null){
	    btnDescargaCausa="<a class='btn-success btn' " +
				"href='"+URL+"/auditoria/accion/origen/evidencia?id="+val.detalleGestAccionMejoraId+"' " +
			        "target='_blank'>" +
			        "Descargar Evidencia" +
			     "</a>";
         }else{
	    btnDescargaCausa="Sin evidencia"
         }
			
         $("#tblItemAsoc tbody")
	 .append("<tr>" + 
		    "<td id='asd"+val.detalleGestAccionMejoraId+"'>"+val.moduloNombre+"</td>" +
		    "<td id='asd"+val.detalleGestAccionMejoraId+"'>"+val.categoriaNombre+"</td>" +
		    "<td id='asd"+val.detalleGestAccionMejoraId+"'>"+val.detalleNombre+"</td>" +
		    "<td id='asd"+val.detalleGestAccionMejoraId+"'>"+val.observacion+"</td>" +
		    "<td id='asd"+val.detalleGestAccionMejoraId+"'>"+val.fechaInicioTexto+"</td>" +
		    "<td>"+btnDescargaCausa+"</td>" +
		 "</tr>");	
			
         $("#tddetalle"+ val.detalleGestAccionMejoraId).css({"text-align":"left"});
      });
   });
}

function calcularFilasEntrantes(){
   var sizeArriba = 245;
   var sizeAbajo = 66;
   var alturaFila = 58;
   var alturaWindow = $(window).height();
   var numFilasSugerido = Math.floor((alturaWindow-sizeAbajo-sizeArriba)/alturaFila);

   return numFilasSugerido
}

function filtrarListActosSubestandar(){ 
   var listReturn=[];

   listReturn = listTablaAux.filter(function(val,index){
		   if(fechaIncluidaEnRango(convertirFechaNormal2(val.reporteFecha),fechaInicioFiltro,fechaFinFiltro)
		      && arrayFiltroArea.indexOf(parseInt(val.areaId)) != -1 && arrayFiltroOrigen.indexOf(parseInt(val.origen.id)) != -1
		      && arrayFiltroNivel.indexOf(val.nivelRiesgoId) != -1 && arrayFiltroCausa.indexOf(val.acInseguroCausaId) != -1
		      && arrayFiltroTipo.indexOf(val.acInseguroTipoId) != -1){
		      return true;
		   }else{ 
		      return false;
		   }
		});
	
   return listReturn;
} 
/*
function verAcordeDivisionFiltroActo(){
	var listDivisiones = $("#selDivisionActoFiltro").val();

	var unFiltro = true;
	var listAreasFiltro = listArea.filter(function(val){
		var isReturn = false;
		val.selected = 0;
		if(listDivisiones == null){
			return true;
		}
		listDivisiones.forEach(function(val1){
			
			 if(val.divisionId == parseInt(val1) ){
				 isReturn =true
			 };
			 if(isReturn && unFiltro){
				 val.selected = 1;
				 unFiltro = false;
			 }
			 if(isReturn){
				 return isReturn;
			 }
		});
		return isReturn;
	});
	 
	crearSelectOneMenuObligMultipleCompleto
	("selAreaActoFiltro", "",listAreasFiltro, "areaId","areaName",
			 "#divFiltroArea","Todos");
}*/

function validarDivision(){
   var listDivisiones = $("#selDivisionActoFiltro").val();
    
   if(listDivisiones == 0){
      alert("Estimado usuario, primero debe seleccionar una división.");
      
      crearSelectOneMenuObligMultipleCompleto("selAreaActoFiltro","validarDivision()",listArea,
         "areaId","areaName","#divFiltroArea","Todos");
   }
}

function cargarPrimerEstado(){
    numPaginaActual = 1;banderaEdicion = false;acInseguroId = 0;acInseguroTipoId = 0;acInseguroCausa = 0;areaId = 0;reporteLugar = '';
   	reporteTipo = -1;reporteNombre = '';reporteFecha = 0;

	listTrabsSelecccionados = [];listOrigenReporte = [];lisTipoReporteLugar = [];listTipoReporteValido = [];listTrabs = [];listCausaBasica = [];
	listFullTipoContacto = [];listCausaInmediataSimple = [];
	
   	removerBotones();volverDivEventos();
   	resizeDivWrapper("wrapperInseg",160);
	
   	var botones=[
	  	{id:"btnCancelar",icono:"fa-sign-out fa-rotate-180",clase:"",nombre:"Cancelar",onclick:"cancelarACInseguros()"},
	  	{id:"btnNuevo",icono:"fa-file-o",clase:"",nombre:"Nuevo",onclick:"nuevoACInseguros()"},
	  	{id:"btnGuardar",icono:"fa-floppy-o",clase:"",nombre:"Guardar",onclick:"guardarACInseguros()"},
	  	{id:"btnEliminar",icono:"fa-sign-out fa-rotate-180",clase:"",nombre:"Eliminar",onclick:"eliminarACInseguros()"}
	];
   
   	crearBotones(botones);
	
   	$("#btnUpload").attr("onclick","javascript:importarDatos();");

   	contador2 = 0;
	
   	$("#fsBotones").append("<button id='btnGenReporte' type='button' class='btn btn-success' title='Generar Informe'>" +
	      					   "<i class='fa fa-file-word-o fa-2x'></i>" +
	   					   "</button>");

   	$("#fsBotones").append("<button id='btnClipTabla' type='button' class='btn btn-success'>" +
	      				       "<i class='fa fa-clipboard fa-2x'></i>" +
	   					   "</button>");

    $("#fsBotones").append("<button id='filtroAplicarBuscador' type='button' onclick='verFiltroAcinseguro()' title='Ver filtros disponibles' class='btn btn-success'>" +
	      				       "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>" +
	   					   "</button>");

   	$("#fsBotones").append("<button id='btnReportExcel' type='button' class='btn btn-success btn-excel' onclick='verOpcionesConsolidadosAc()' " +
   	                               "title='Valores previos para seleccionar el excel relacionado a A/C Sub estándar a descargar.'>" +
		                       "<i class='fa fa-file-excel-o fa-2x'></i> <i class='fa fa-list'></i>" +
      					   "</button>");
   
    $("#fsBotones").append("<button id='btnVerConsolidado' type='button' class='btn btn-success' onclick='verConsolidadoActosSubestandar()' title='Ver consolidado'>" +
	      					   "<i class='fa fa-table fa-2x'></i>" +
	   					   "</button>");

   	$("#fsBotones").append("<button id='btnVerIndicadores' type='button' class='btn btn-success' onclick='verIndicadoresActosSubestandar()' title='Ver indicadores'>" +
	      				       "<i class='fa fa-pie-chart fa-2x'></i>" +
	   					   "</button>");


	$("#fsBotones").append("<button id='btnVerQuicksight' type='button' class='btn btn-info' style='margin-right:5px' onclick='verQuicksightOpcionesAcInseguro()' title='Ver Quicksight.'>" +
							   "<i class='fa fa-table fa-2x'></i> "+"<i class='fa fa-pie-chart'></i>" +
						   "</button>");

	$("#indicadorPaginaParcialAuxAcSubAdmin").show();

	numPaginaActualAcSubAdmin = 1;

   	deshabilitarBotonesEdicion();
	
   	$("#btnGenReporte").hide();
   	$("#btnNuevo").attr("onclick","javascript:nuevoACInseguros();");
   	$("#btnCancelar").attr("onclick","javascript:cancelarACInseguros();");
   	$("#btnGuardar").attr("onclick","javascript:guardarACInseguros();");
   	$("#btnEliminar").attr("onclick","javascript:eliminarACInseguros();");
   	$("#btnGenReporte").attr("onclick","javascript:generarReporteActo();");
   	$("#btnImportar").attr("onclick","javascript:importarDatos();");
	
   	$("#btnClipTabla").on("click",function(){
        new Clipboard('#btnClipTabla',{
            text:function(trigger){
	            var listFullTabla = "";
				
	    		listFullTabla = "Tipo"+"\t"+"Causa Inmediata"+"\t"+"Nivel de Riesgo"+"\t"+"Descripción"+"\t"+"Fecha Reporte"+"\t"+"Área" +
					"\t"+"Lugar específico" +"\t"+"Reporta"+"\t"+"Evidencia"+"\t"+"Acción de mejora"+"\t"+" \n";
				
	    		for(var index = 0;index < listTabla.length;index++){
	       			listFullTabla = listFullTabla+listTabla[index].acInseguroTipoNombre+"\t"+listTabla[index].acInseguroCausaNombre+"\t" +
						listTabla[index].nivelRiesgoNombre+"\t"+listTabla[index].acInseguroNombre+"\t"+convertirFechaNormal(listTabla[index].reporteFecha)+"\t" +
			       		listTabla[index].areaNombre +"\t"+listTabla[index].reporteLugar +"\t"+listTabla[index].reporteNombre +"\t" +
						(listTabla[index].evidenciaNombre=="----"?"NO":"SI") +"\t"+listTabla[index].numSolicitudesAccionMejora+"\t"+"\n";
	    		}
				 
	    		return listFullTabla;
			}
      	});

      	alert("Se han guardado al clipboard la tabla de este módulo" );
   	});
	
    var fechaInicio = convertirFechaTexto($("#fechaInicioEvento").val());
   	var fechaFin = convertirFechaTexto($("#fechaFinEvento").val());
   	var listTipo = $("#filtroTipoEvento").val();
   	var listCausa = $("#filtroCausaEventoGeneral").val();
   	var listNivelRiesgo = $("#filtroNivelRiesgo").val();
   	var listDivisiones = $("#selDivisionActoFiltro").val();
   	var listAreas = $("#selAreaActoFiltro").val();
   	var listTipoContacto = $("#filtroRiesgoAsociado").val();

   	var listTipoId = [],listCausaId = [],listNivelRiesgoId = [],listAreaId = [],listDivisionId = [],
		listTipoContactoId = [];
	
   if(listTipo != null){
      listTipo.forEach(function(val){
         listTipoId.push(parseInt(val));
      });
   }
   
   if(listCausa != null){
      listCausa.forEach(function(val){
         listCausaId.push(parseInt(val));
      });
   }
   
   if(listNivelRiesgo != null){
      listNivelRiesgo.forEach(function(val){
         listNivelRiesgoId.push(parseInt(val));
      });
   }
   
   if(listDivisiones != null){
      listDivisiones.forEach(function(val){
	 listDivisionId.push(parseInt(val));
      });
   }
   
   if(listAreas != null){
      listAreas.forEach(function(val){
	 listAreaId.push(parseInt(val));
      });
   }
   
   if(listTipoContacto != null){
      listTipoContacto.forEach(function(val){
	 listTipoContactoId.push(parseInt(val));
      });
   }
	
    var dataParam={
	    matrixId:getUrlParameter("mdfId"),empresaId:parseInt(getSession("gestopcompanyid")),companyId:parseInt(getSession("gestopcompanyid")),
	    listTipoId:listTipoId,listCausaId:listCausaId,fechaInicioFiltro:fechaInicio,fechaFinFiltro:fechaFin,listNivelRiesgoId:listNivelRiesgoId,
	    listDivisionId:listDivisionId,listAreaId:listAreaId,listTipoContactoId:listTipoContactoId,
	    reporteValido:($("#selValidezReporte").val() == -1?null:$("#selValidezReporte").val())
	};
	
    var dataParamMovil={
	    matrixId:getUrlParameter("mdfId"),companyId:sessionStorage.getItem("gestopcompanyid"),fechaInicioFiltro:fechaInicio,
	    fechaFinFiltro:fechaFin,
	};
	
    if(isMobile.any()){
        callAjaxPost(URL+'/acinseguro/movil',dataParamMovil,procesarDataDescargadaPrimerEstadoMovil,function(){});
    }else{
        callAjaxPost(URL+'/acinseguro/vista_admin',dataParam,procesarDataDescargadaPrimerEstado);
    }
	
    goheadfixedY("#tblInseg","#wrapperInseg");

    $("#modalFiltroAcinseguro").modal("hide");
}

function verConsolidadoActosSubestandar(){
   $("#generalDivEventos .container-fluid").hide();
   $("#divConsolidadoEventoSub").show();
   $("#generalDivEventos h2")
   .html("<a onclick='volverDivEventos()'>Actos y Condiciones Subestándar</a> > Consolidado")

   resizeDivWrapper("wrapperConsolidadoTablaActosResponsable",160);
   crearFiltroConsolidadoActoAdministrador(valoresFiltroConsolidadoActoAdministrador);
}

function verFiltroAcinseguroConsolidado(){
   $("#modalFiltroAcinseguroConsolidado").modal("show");
}

function ocultarFiltroAcinseguroConsolidado(){
   $("#modalFiltroAcinseguroConsolidado").modal("hide");
}

function crearFiltroConsolidadoActoAdministrador(functionCallBack){
	$("#modalFiltroAcinseguroConsolidado").remove();
   
   	var contenido = "";
	
   	var listContenido=[
	    {sugerencia:"",label:"Desde",inputForm:"<input type='date' class='form-control' id='fechaInicioConsolidadoEvento'>"},
		{sugerencia:"",label:"Hasta",inputForm:"<input type='date' class='form-control' id='fechaFinConsolidadoEvento'>"},
		{sugerencia:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",label:""+getSession("gestopdivision"),inputForm:"",divContainer:"divFiltroDivisionConsolidado"},
		{sugerencia:"",label:""+getSession("gestoparea"),inputForm:"",divContainer:"divFiltroAreaConsolidado"},
		{sugerencia:"",label:"Riesgos asociados",inputForm:"",divContainer:"divFiltRiesgoAsociadoConsolidado"},
		{sugerencia:"",label:"Tipos",inputForm:"",divContainer:"divFiltTipoEventoConsolidado"},
		{sugerencia:"",label:"Causas inmediatas",inputForm:"",divContainer:"divFiltroCausaEventoConsolidado"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroAcinseguroConsolidado()'>" +
          	       "<i class='fa fa-times'></i> Cancelar" +
          	   "</button>",
         inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='valoresFiltroConsolidadoActoAdministrador()'>" +
			           "<i class='fa fa-filter'></i> Aplicar filtro" +
			       "</button>"},
	];
	
    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
	
    var modalOptions={
	    id:"modalFiltroAcinseguroConsolidado",nombre:"<i class='fa fa-filter'></i> Filtros",
	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};
	
    crearModalPrincipalUsuario(modalOptions,function(){
        if($("#selSubTipoContactoActoFiltroConsolidado").length > 0){
            return;
        }

      	crearSelectOneMenuObligMultipleCompleto("selDivisionActoFiltroConsolidado","verAcordeDivisionFiltroActoConsolidado()",
         	listDivisionActos,"divisionId","divisionName","#divFiltroDivisionConsolidado","Todos");
      
      	verAcordeDivisionFiltroActoConsolidado();
	    
      	crearSelectOneMenuObligMultipleCompleto("selSubTipoContactoActoFiltroConsolidado","",listFullTipoContacto,
         	"id","nombre","#divFiltRiesgoAsociadoConsolidado","Todos");
	    
      	crearSelectOneMenuObligMultipleCompleto("selCausaActoFiltroConsolidado","",listCausaInmediataSimple,
         	"id","nombre","#divFiltroCausaEventoConsolidado","Todos");
	    
      	crearSelectOneMenuObligMultipleCompleto("selTipoActoFiltroConsolidado","",listActInsegTipo,
         	"id","nombre","#divFiltTipoEventoConsolidado","Todos");
   	},true,true);

	var hoy = obtenerFechaActual();

	$("#fechaInicioConsolidadoEvento").val(sumaFechaDias(-180,hoy));
	$("#fechaFinConsolidadoEvento").val(hoy);

	functionCallBack();
}

function verAcordeDivisionFiltroActoConsolidado(){
   var listDivisiones = $("#selDivisionActoFiltroConsolidado").val();
   var unFiltro = true;
	
   var listAreasFiltro = listArea.filter(function(val){
      var isReturn = false;
      val.selected = 0;
		
      if(listDivisiones == null){
         return true;
      }
		
      listDivisiones.forEach(function(val1){
         if(val.divisionId == parseInt(val1)){
            isReturn = true;
         }
			 
         if(isReturn && unFiltro){
	    val.selected = 1;
	    // unFiltro = false;
         }
			 
         if(isReturn){
	    return isReturn;
         }
      });
		return isReturn;
	});
	 
   crearSelectOneMenuObligMultipleCompleto("selAreaActoFiltroConsolidado","",listAreasFiltro,
      "areaId","areaName","#divFiltroAreaConsolidado","Todos");
}

function verFiltroAcinseguroIndicador(){
   $("#modalFiltroAcinseguroIndicador").modal("show");
}

function ocultarFiltroAcinseguroIndicador(){
   $("#modalFiltroAcinseguroIndicador").modal("hide");
}

function crearFiltroIndicadoroActoAdministrador(){
   var contenido = "";
	
   var listContenido=[
          {sugerencia:"",label:"Desde",inputForm:"<input type='date' class='form-control' id='fechaInicioIndicadorEvento'>"},
          {sugerencia:"",label:"Hasta",inputForm:"<input type='date' class='form-control' id='fechaFinIndicadorEvento'>"}, 
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",label:""+getSession("gestopdivision"),inputForm:"",divContainer:"divFiltroDivisionIndicador"},
          {sugerencia:"",label:""+getSession("gestoparea"),inputForm:"",divContainer:"divFiltroAreaIndicador"},
          {sugerencia:"",label:"Tipo de reporte",inputForm:"",divContainer:"divTipoActoFiltroIndicador"},	
          {sugerencia:"",label:"detalle",inputForm:"",divContainer:"divSelectDetalleFiltroActosIndicador"},
          {sugerencia:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",
           label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroAcinseguroIndicador()'>" +
           	    "<i class='fa fa-times'></i> Cancelar" +
           	 "</button>",
           inputForm:"<button class='btn btn-success' type='button' style='float:right;' " +
           		     "onclick='ocultarFiltroAcinseguroIndicador();cargarIndicadoresActosAdmnistrador()'>" +
           	        "<i class='fa fa-filter'></i> Aplicar filtro" +
           	     "</button>"},
	             ];
	
   listContenido.forEach(function(val){
      contenido +=obtenerSubPanelModuloGeneral(val);
   });
	
   var modalOptions={
	  id: "modalFiltroAcinseguroIndicador",
	  nombre: "<i class='fa fa-filter'></i> Filtros",
	  contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
	            };
	
   crearModalPrincipalUsuario(modalOptions,function(){
      if($("#selDivisionActoFiltroIndicador").length > 0){
         return;
      }
	    
      verAcordeTipoIndicadorActos();

      var hoy = obtenerFechaActual();
		
      $("#fechaInicioIndicadorEvento").val(sumaFechaDias(-365,hoy));
      $("#fechaFinIndicadorEvento").val(hoy);
	    
      crearSelectOneMenuObligMultipleCompleto("selDivisionActoFiltroIndicador","verAcordeDivisionFiltroActoIndicador()",
         listDivisionActos,"divisionId","divisionName","#divFiltroDivisionIndicador","Todos");
	    
      verAcordeDivisionFiltroActoIndicador();

      crearSelectOneMenuObligMultipleCompleto("selTipoActoFiltroIndicador","",listActInsegTipo,
         "id","nombre","#divTipoActoFiltroIndicador","Todos");
   },false);
}

var noDefinidoFiltro = [{id:0,nombreAux:"No definido"}];

function verAcordeTipoIndicadorActos(){
   var tipoIndicador = parseInt($("#selTipoIndicadorActos").val());
	
   $("#divSelectDetalleFiltroActosIndicador").parent().show();
	
   switch(tipoIndicador){
      case 1:
         $("#divSelectDetalleFiltroActosIndicador").parent().find("label").html("Causas Inmediatas")
	
         crearSelectOneMenuObligMultipleCompleto("selCausaActoFiltroIndicador","",listCausaInmediataSimple,
            "id","nombre","#divSelectDetalleFiltroActosIndicador","Todos");
         break;
	
      case 2:
         $("#divSelectDetalleFiltroActosIndicador").parent().find("label").html("Riesgos Asociados");
		
         crearSelectOneMenuObligMultipleCompleto("selSubTipoContactoActoFiltroIndicador","",
            noDefinidoFiltro.concat(listFullTipoContacto),"id","nombreAux","#divSelectDetalleFiltroActosIndicador","Todos");
         break;
	
      case 3:
         break;
	
      case 4:
      case 5:
      case 6:
      case 7:
         $("#divSelectDetalleFiltroActosIndicador").parent().hide();
         break;
   }
	 
   cargarIndicadoresActosAdmnistrador();
}

function verAcordeDivisionFiltroActoIndicador(){
   var listDivisiones = $("#selDivisionActoFiltroIndicador").val();	 
   var unFiltro = true;
	
   var listAreasFiltro = listArea.filter(function(val){
      var isReturn = false;
      val.selected = 0;
		
      if(listDivisiones == null){
         return true;
      }
		
      listDivisiones.forEach(function(val1){
         if(val.divisionId == parseInt(val1) ){
	    isReturn = true;
         }
			 
         if(isReturn && unFiltro){
	    val.selected = 1;
	    // unFiltro = false;
         }
			 
         if(isReturn){
	    return isReturn;
         }
      });
		
      return isReturn;
   });
	 
   crearSelectOneMenuObligMultipleCompleto("selAreaActoFiltroIndicador","",listAreasFiltro,
      "areaId","areaName","#divFiltroAreaIndicador","Todos");
}

function verIndicadoresActosSubestandar(){
   $("#generalDivEventos .container-fluid").hide();
   $("#divIndicadoresEventoSub").show();
   $("#generalDivEventos h2")
   .html("<a onclick='volverDivEventos()'>Actos y Condiciones Subestándar</a> > Indicadores")

   resizeDivWrapper("wrapperGraficoActosResponsable",300);
   resizeDivWrapper("wrapperConsolidadoActosResponsable",300);
   crearFiltroIndicadoroActoAdministrador();
   cargarIndicadoresActosAdmnistrador();
}

var listDivisionFiltroConsId = [],listAreaFiltroConsId = [],listSubTipoContactoFiltroConsId = [],listTipoActoFiltroConsId = [],listCausaFiltroConsId = [];

function valoresFiltroConsolidadoActoAdministrador(){
	ocultarFiltroAcinseguroConsolidado();

	var listDivisiones = $("#selDivisionActoFiltroConsolidado").val();
	listDivisionFiltroConsId = [];

	if(listDivisiones != null){
		listDivisiones.forEach(function(val,index){
			listDivisionFiltroConsId.push(parseInt(val));
		});
	}

	var listArea = $("#selAreaActoFiltroConsolidado").val();
	listAreaFiltroConsId = [];

	if(listArea != null){
		listArea.forEach(function(val,index){
			listAreaFiltroConsId.push(parseInt(val));
		});
	}

	var listSubTiposContacto = $("#selSubTipoContactoActoFiltroConsolidado").val();
	listSubTipoContactoFiltroConsId = [];

	if(listSubTiposContacto != null){
		listSubTiposContacto.forEach(function(val,index){
			listSubTipoContactoFiltroConsId.push(parseInt(val));
		});
	}

	var listTipoActo = $("#selTipoActoFiltroConsolidado").val();
	listTipoActoFiltroConsId = [];

	if(listTipoActo != null){
		listTipoActo.forEach(function(val,index){
			listTipoActoFiltroConsId.push(parseInt(val));
		});
	}

	var listCausasInmediatas = $("#selCausaActoFiltroConsolidado").val();
	listCausaFiltroConsId = [];

	if(listCausasInmediatas != null){
		listCausasInmediatas.forEach(function(val,index){
			listCausaFiltroConsId.push(parseInt(val));
		});
	}

	cargarConsolidadoActosAdmnistrador();
}

var listConsolidadoAcSubestandar = [];
var numPaginaActualConsAcSub;

function cargarConsolidadoActosAdmnistrador(){
    numPaginaActualConsAcSub = 1;

   	var fechaInicioFiltro = convertirFechaTexto($("#fechaInicioConsolidadoEvento").val());
   	var fechaFinFiltro = convertirFechaTexto($("#fechaFinConsolidadoEvento").val());

   	var dataParam={
	    matrixId:getUrlParameter("mdfId"),companyId:parseInt(getSession("gestopcompanyid")),listCausaId:listCausaFiltroConsId,listAreaId:listAreaFiltroConsId,
	  	listDivisionId:listDivisionFiltroConsId,listTipoContactoId:listSubTipoContactoFiltroConsId,listTipoActoId:listTipoActoFiltroConsId,fechaInicioFiltro:fechaInicioFiltro,
	  	fechaFinFiltro:fechaFinFiltro
	};
	
   	callAjaxPost(URL+'/acinseguro/movil/consolidado',dataParam,function(data){
		if(data.CODE_RESPONSE == "05"){
			listConsolidadoAcSubestandar = data.actos;

			cambiarPaginaConsolidadoActosAdmnistrador();

			goheadfixedY("#tblConsolidadoTablaActo","#wrapperConsolidadoTablaActosResponsable");
		}else{
			console.log("Error al cargar el consolidado.");
		}
   	});
}

function cambiarPaginaConsolidadoActosAdmnistrador(){
	$("#flechaIzquierdaConsAcSub").show();$("#flechaDerechaConsAcSub").show();

	var list = listConsolidadoAcSubestandar;
	var totalSize = list.length;
	var partialSize = 100;

	var numPaginaTotal = Math.ceil(totalSize/partialSize);

	var inicioRegistro = (numPaginaActualConsAcSub*partialSize)-partialSize;
	var finRegistro = (numPaginaActualConsAcSub*partialSize)-1;

	if(numPaginaTotal == 0){
		numPaginaTotal = 1;
	}

	$("#labelFlechasConsAcSub").html("<label>"+numPaginaActualConsAcSub+" de "+numPaginaTotal+"</label>");

	if(numPaginaActualConsAcSub == 1){
		$("#flechaIzquierdaConsAcSub").hide();
	}

	if(numPaginaActualConsAcSub == numPaginaTotal){
		$("#flechaDerechaConsAcSub").hide();
	}

	if(finRegistro >= totalSize){
		finRegistro = totalSize-1;
	}

	$("#tblConsolidadoTablaActo tbody tr").remove();

	list.forEach(function(val,index){
		if(inicioRegistro <= index && index <= finRegistro){
		    $("#tblConsolidadoTablaActo tbody").append(
			    "<tr id='trConsAcSub"+val.id+"'>" +
					"<td>"+val.unidadNombre+"</td>" +
					"<td>"+val.divisionNombre+"</td>" +
					"<td>"+val.areaNombre+"</td>" +
					"<td>"+val.reporteFechaTexto+"</td>" +
					"<td>"+val.horaTexto+"</td>" +
					"<td>"+val.descripcion+"</td>" +
					"<td>"+val.reporteLugar+"</td>" +
					"<td>"+val.reporteNombre+"</td>" +
					"<td>"+val.reporteAccion+"</td>" +
					"<td>"+val.subTipoContacto.nombre+"</td>" +
					"<td>"+val.acInseguroTipoNombre+"</td>" +
					"<td>"+val.acInseguroCausaNombre+"</td>" +
					"<td>"+val.fechaRegistroTexto+"</td>" +
					"<td>"+val.trabajadorRegistraNombre+"</td>" +
					"<td style='word-break: break-all;'>"+val.evidenciaNombre+"</td>" +
					"<td>"+"<a class='efectoLink' onclick='verAccionesConsolidadoActo("+val.acInseguroId+")'>" +
							   "<i class='fa fa-list'></i> "+val.numAccionesColaboradorIndicador +
				           "</a>"+"</td>" +
				"</tr>");
		}
	});
}

function obtenerTablaClipboardConsolidadoActosAdmnistrador(){
	var texto = obtenerDatosTablaEstandar("tblConsolidadoTablaActo");
	copiarAlPortapapeles(texto,"btnClipTablaConsAcSub");

	mensajeUx="<label>Los registros del consolidado se copiaron en el clipboard.</label>";
	mensajesUx(mensajeUx,1,"","");
}

function verAccionesConsolidadoActo(actoId){
   var contenido =
      "<div class='wrapper' id='wrapperConsolidadoAccionesResponsable'>" +
         "<table style='min-width:100%' id='tblConsolidadoAcciones' " +
                "class='table table-striped table-bordered table-hover table-fixed'>" +
	    "<thead>" +
	       "<tr>" +
	          "<td class='tb-acc' style='width:180px'>Clasificación</td>" +
		  "<td class='tb-acc' style='width:180px'>Descripción</td>" +
		  "<td class='tb-acc' style='width:180px'>Fecha de registro</td>" +
		  "<td class='tb-acc' style='width:180px'>Responsable</td>" +
		  "<td class='tb-acc' style='width:180px'>Evidencia</td>" +
	       "</tr>"+
	    "</thead>" +
	    "<tbody></tbody>" +
	 "</table>" +
      "</div>" ;
	
   var listPaneles={
	  id: "asd",
	  nombre: "Acciones de mejora del acto/condición",
	  clase: "",
	  contenido: contenido
	           };
   
   crearModalPrincipalUsuario(listPaneles,function(){},false,true);
   
   $("#asd .modal-dialog").css({"width":"90%","max-width":"100%"})
	
   callAjaxPost(URL+"/gestionaccionmejora/accionmejora",{accionMejoraTipoId: 2,
		                                         eventoInseguroId: actoId},function(data){
      var asd = data.list;
		
      asd.forEach(function(val){
         $("#tblConsolidadoAcciones tbody")
         .append("<tr>" +
		    "<td>"+val.clasificacion.nombre+"</td>"+
		    "<td>"+val.descripcion+"</td>"+
		    "<td>"+(val.fechaRevision ==null?val.fechaRealTexto:val.fechaRevisionTexto)+"</td>"+
		    "<td>"+val.responsableNombre+"</td>"+
		    "<td>"+
		        (val.estadoId != 2 ?iconoGosst.desaprobado+"":iconoGosst.aprobado+"")+
	               "<a target='_blank' class='efectoLink' " +
			  "href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.accionMejoraId+"'>"+
			   val.evidenciaNombre+
		       "</a>"+
		    "</td>" +
		 "</tr>");
      });
   });
}

function listaTrabAcordeTipo(){
   if($("#selTipoRep").val() == "1"){
      ponerListaSugerida("inputNomRep",listanombretab,true);
   }
		
   if($("#selTipoRep").val() == "2"){
      ponerListaSugerida("inputNomRep",listanombretab,false);
   }	
}

function ponerGenerado(isReportaVacio,valTextoAccion,idCasilla){
   var generado;
	
   if(isReportaVacio == ""){
      generado="<td id='tdrep"+idCasilla+"' style='background-color:#C0504D;color:white'>No hay</td>"
   }else{
      var textoAccion="";
		
      if(valTextoAccion != ""){
         textoAccion="<br> Acción trabajador: '"+valTextoAccion+"'";
      }
		
      generado="<td id='tdrep"+idCasilla+"' style='background-color:#9BBB59;color:white;'>Generado"+textoAccion+"</td>"
   }
	
   return generado
}

var htmlEvidencia = "";

function cambiarPaginaTabla(){
	$("#flechaIzquierdaAcSubAdmin").show();$("#flechaDerechaAcSubAdmin").show();

    //Definiendo variables
    var list = listTabla;
    var totalSize = list.length;
    var partialSize= 100;
	
   	var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   	var inicioRegistro = (numPaginaActualAcSubAdmin*partialSize) - partialSize;
   	var finRegistro = (numPaginaActualAcSubAdmin*partialSize) - 1;

   	if(numPaginaTotal == 0){
      	numPaginaTotal = 1;
   	}
		
   	$("#labelFlechasAcSubAdmin").html("<label>"+numPaginaActualAcSubAdmin+" de "+numPaginaTotal+"</label>");
	 
   	if(numPaginaActualAcSubAdmin == 1){
		$("#flechaIzquierdaAcSubAdmin").hide();
   	}
	
   	if(numPaginaActualAcSubAdmin == numPaginaTotal){
		$("#flechaDerechaAcSubAdmin").hide();
   	}
	 
   	if(finRegistro >= totalSize){
   	   	finRegistro = totalSize - 1;
   	}
	
   	$("#tblInseg tbody tr").remove();

	list.forEach(function(val,index){
		if(inicioRegistro <= index && index <= finRegistro){
			var parteGenerado = ponerGenerado(val.reporteNombre, val.reporteAccion, val.acInseguroId);
			var evidenciaNombre = (val.evidenciaNombre.trim().length == 0? "------":val.evidenciaNombre);

			$("#tblInseg tbody").append(
				"<tr id='tr" + val.acInseguroId + "' onclick='editarACInseguros(" + index + ")'>" +
				    "<td id='tdtipact" + val.acInseguroId + "'>" + val.acInseguroTipoNombre + "</td>" +
				    // "<td id='tdori"+val.acInseguroId+"'>"+val.origen.nombre+"</td>" +
				    "<td id='tdcausa" + val.acInseguroId + "'>" + val.acInseguroCausaNombre + "</td>" +
					"<td id='tdtipcon" + val.acInseguroId + "'>" + val.nombreTiposContacto + "</td>" +
					"<td id='tdnivel" + val.acInseguroId + "'>" + val.nivelRiesgoNombre + "</td>" +
					"<td id='tdnom" + val.acInseguroId + "'>" + val.acInseguroNombre + "</td>" +
					"<td id='tdlug" + val.acInseguroId + "'>" + val.reporteLugar + "</td>" +
					"<td id='tdfecha" + val.acInseguroId + "'>" + convertirFechaNormal(val.reporteFecha) + "</td>" +
					"<td id='tdhora" + val.acInseguroId + "'>" + (val.horaTexto) + "</td>" +
					"<td id='tdare" + val.acInseguroId + "'>" + val.areaNombre + "</td>" +
				    // "<td id='tdtrl"+val.acInseguroId+"'>"+(val.tipoLugar.id == 2?"<label style='color:red'>"+val.tipoLugar.nombre+"</label>":val.tipoLugar.nombre+"")+"</td>" +
				     parteGenerado +
					"<td id='tdtrv" + val.acInseguroId + "'>" + (val.tipoValido.id == 2 ? "<label style='color:red'>" + val.tipoValido.nombre + "</label>" +
						"<br>" + val.motivoValido : "<i style='color:green' class='fa fa-check'></i>") + "</td>" +
					"<td id='tdEviAcSubAdm" + val.acInseguroId + "' style='word-break:break-all;'>" + evidenciaNombre + "</td>" +
					"<td id='tdaccmej" + val.acInseguroId + "'>" + val.numSolicitudesAccionMejora + "</td>" +
					"<td id='tdEveSol" + val.acInseguroId + "'>" + val.accionesSolicitudIndicador + "</td>" +
					"<td id='tdEveAccColab" + val.acInseguroId + "'>" + val.numAccionesColaboradorIndicador + "</td>" +
				"</tr>");

			// $("#tdevi"+val.acInseguroId).on("click",function(e){
			//    var actoId = parseInt($(this).prop("id").substr(5,9));
			//
			//    if(!banderaEdicion || actoId == acInseguroId){
			//   callAjaxPost(URL+'/acinseguro/id',{acInseguroId:actoId},function(data){
			//      var alturaAux = $(window).height()*0.7;
			//      var anchoAux = $(window).height()*0.8;
			//      var nombreEvidencia = htmlEvidencia;
			//      var imagenPrevia = insertarImagenParaTablaMovil(data.actos.evidencia,alturaAux+"px","100%");
			//
			//      $("#mdVistaPrevia").modal("show");
			//
			//      $("#mdVistaPrevia .modal-body #btnGuardarVista").attr("onclick","uploadEvidencia("+actoId+")")
			//      $("#mdVistaPrevia .modal-body #btnDescargarVista")
			//      .attr("onclick","location.href='"+URL+"/acinseguro/evidencia?acInseguroId="+actoId+"'")
			//
			//      $("#mdVistaPrevia .modal-body #divVistaImagen").html(imagenPrevia)
			//      .css({"background-color":"","color":""});
			//   },function(){
			//      $("#tdevi"+actoId).html("<img src='../imagenes/gif/ruedita.gif'></img>Descargando");
			//   });
			//    }
			// });
			//
			// $("#tdevi"+val.acInseguroId).hover(function(){
			//    var actoId = parseInt($(this).prop("id").substr(5,9));
			//
			//    if(!banderaEdicion || actoId == acInseguroId){
			//   $(this).css({"background-color":"#1c9da9","color":"white"});
			//   htmlEvidencia = $(this).html();
			//   $(this).html("<i class='fa fa-picture-o' aria-hidden='true'></i>Vista Previa");
			//    }
			// },function(){
			//    var actoId = parseInt($(this).prop("id").substr(5,9));
			//
			//    if(!banderaEdicion || actoId == acInseguroId){
			//   $(this).html(htmlEvidencia);
			//   $(this).css({"background-color":"","color":""});
			//    }
			// });
		}
	});
}

var tipoGraf=1;

function procesarDataDescargadaPrimerEstadoMovil(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 $("#eventosGosstDesktop").remove(); 
	 listActInsegTipo = data.listActInsegTipo;
	 listArea = data.listArea;
	 listCausaBasica = data.listCausaInmediata;
	 listFullTipoContacto = data.listFullTipoContacto;
	 listCausaInmediataSimple = data.listCausaInmediataSimple;
	 listNivel = data.listNivel;
	 listOrigenReporte = data.listOrigen;
	 lisTipoReporteLugar = data.lisTipoReporteLugar;
	 listTipoReporteValido = data.listTipoReporteValido;
		
	 var numActos = data.numActos;
		
	 $("#buscarEventoGosst .textoMuestra").append("<div class='alertaEventos'>"+numActos+"<div>");
		 
	 completarBarraCarga();
	 ajustarBarraSizeTop("eventosGosstMovil");
		
	 if(sessionStorage.getItem("trabajadorGosstId") > 0){
            $("#graficoResumenEventos").remove();
            $("#buscarEventoGosst").remove();
	 }
	 break;
	
      default:
         alert("Ocurrió un error al traer las actos inseguros!");
   }
}

function procesarDataDescargadaPrimerEstado(data){
    switch(data.CODE_RESPONSE){
        case "05":
            $("#eventosGosstMovil").remove();
         
         // var list = data.list;
         // listDniNombre = data.trabajadores;
         // listanombretab = listarStringsDesdeArray(listDniNombre,"nombre");
         // listTabla = list;
         // listTablaAux = list;
         // listTablaAuxCopmleta = list;
         // listActInsegTipo = data.listActInsegTipo;
         // listArea = data.listArea;
		 //
         // listOrigenReporte = data.listOrigen;
         // lisTipoReporteLugar = data.lisTipoReporteLugar;
         // listTipoReporteValido = data.listTipoReporteValido;

			listTabla = data.list;
		  	listDniNombre = data.trabajadores;
		  	listanombretab = listarStringsDesdeArray(listDniNombre,"nombre");
		  	listActInsegTipo = data.listActInsegTipo;
		  	listFullTipoContacto = data.listFullTipoContacto;
		  	listCausaInmediataSimple = data.listCausaInmediataSimple;
		  	listNivel = data.listNivel;
		  	listArea = data.listArea;
		  	listTipoReporteValido = data.listTipoReporteValido;

         	cambiarPaginaTabla();completarBarraCarga();
         	formatoCeldaSombreableTabla(true,"tblInseg");

			break;
	
      	default:
	 	    alert("Ocurrió un error al traer las actos inseguros!");
   	}
}

function hallarFechasPeriodoActo(){
   //falta cambiar
   var fechaInicio = $("#fechaInicioEvento").val();
   var fechaFin = $("#fechaFinEvento").val();
   var fecha1 = fechaInicio.split('-');
   var fecha2 = fechaFin.split('-');
   var difanio = fecha2[0]-fecha1[0]+1;
   var difDias = restaFechas(fechaInicio,fechaFin);
   var listfecha = [];
    		
   for(index=0;index<difanio;index++){
      var anioaux = parseInt(index)+parseInt(fecha1[0]);
    			
      if(difanio > 1){
         if(index == 0){
            for(index1=0;index1<12-fecha1[1]+1;index1++){
    	       var mesaux = parseInt(index1)+parseInt(fecha1[1]);
    	       listfecha.push({mes:mesaux,anio:anioaux,nombre:anioaux+"-"+((''+mesaux).length<2?'0':'')+mesaux});
    	    }
         }
    				
         if(index == difanio-1){
    	    for(index4=0;index4<parseInt(fecha2[1]);index4++){
    	       var mesaux3 = parseInt(index4)+parseInt("1");
    	       listfecha.push({mes:mesaux3,anio:anioaux,nombre:anioaux+"-"+((''+mesaux3).length<2?'0':'')+mesaux3});
    	    }
         }	
    				
         if(index>0 && index<difanio-1){
    	    for(index3=0;index3<12;index3++){
    	       var mesaux2 = parseInt(index3)+1;	
    	       listfecha.push({mes:mesaux2,anio:anioaux,nombre:anioaux+"-"+((''+mesaux2).length<2?'0':'')+mesaux2});
    	    }
         }
      }else{
    	 for(index5=0;index5<fecha2[1]-fecha1[1]+1;index5++){
    	    var mesaux4 = parseInt(index5)+parseInt(fecha1[1]);
    	    listfecha.push({mes:mesaux4,anio:anioaux,nombre:anioaux+"-"+((''+mesaux4).length<2?'0':'')+mesaux4});
    	 }
      }
   }; 
    	
   return listfecha;
}

function verAcordeTipoValido(){
   var validoId = parseInt($("#selTipoReporteValidoActo").val());
	
   if(validoId == 1){
      $("#inputObsValidoActo").hide();
   }else{
      $("#inputObsValidoActo").show();
   }	
}

function editarACInseguros(index){
    if(!banderaEdicion){
        acInseguroObj = listTabla[index];
		acInseguroId = acInseguroObj.acInseguroId;

		acInseguroTipoId = listTabla[index].acInseguroTipoId;
      acInseguroCausa = listTabla[index].acInseguroCausaId;
      areaId = listTabla[index].areaId;
      reporteLugar = listTabla[index].reporteLugar;
      var reporteAccion = listTabla[index].reporteAccion;
      reporteTipo = listTabla[index].reporteTipo;
      reporteNombre = listTabla[index].reporteNombre; 
      reporteFecha = listTabla[index].reporteFecha; 
      var nivelId = listTabla[index].nivelRiesgoId;
      // var origenId = listTabla[index].origen.id;
      var motivoValido = listTabla[index].motivoValido;
      var tipoLugarId = listTabla[index].tipoLugar.id;
      var tipoValidoId = listTabla[index].tipoValido.id;
      listTrabsSelecccionados = [];
      listTrabs = [];
	    //
        $("#tdhora"+acInseguroId).html("<input type='time' id='inputTimeAcinseguro' class='form-control'>");
        $("#inputTimeAcinseguro").val(acInseguroObj.hora);
		//
      	formatoCeldaSombreableTabla(false,"tblInseg");
		
      	var name = $("#tdnom"+acInseguroId).text();
      	$("#tdnom"+acInseguroId).html("<input type='text' id='inputNom' class='form-control' placeholder='Descripci&oacute;n'>");
      	nombrarInput("inputNom",name);
		
      	$("#tdrep"+acInseguroId).html("<a href='#' onclick='javascript:editarDatosReporte();' style='color:white'>Editar Reporte</a>");

      	$("#tdtrabs").html("<a href='#' onclick='javascript:seleccionarTrabajadores();'>Trabajadores</a>");
		$("#tdrespuestas").html("<a href='#' onclick='javascript:verRespuestaSeguridad();'>Sanciones</a>");
		
      	$("#tdaccmej"+acInseguroId).html("<a class='efectoLink' href='#' onclick='javascript:agregarAccionMejora(3,"+acInseguroId+",9);'>" +
			    "<i class='fa fa-external-link'></i> "+acInseguroObj.numSolicitudesAccionMejora +
			"</a>");

      	$("#tdlug"+acInseguroId).html("<input type='text' id='inputLug' class='form-control'>");
      	$("#inputLug").val(reporteLugar);

      	$("#inputNomRep").val(reporteNombre);
      	$("#inputAccRep").val(reporteAccion);

      	$("#selTipoRep").val(reporteTipo);
      	listaTrabAcordeTipo();

		tienePermisoReporte = (acInseguroObj.evidenciaNombre.trim().length > 0?true:false);
        //
        var lista1 = acInseguroObj.idTiposContacto;
        var listaTipoContacto = lista1.split(",");
		
      	listFullTipoContacto.forEach(function(val){
         	val.selected = 0;
			
         	listaTipoContacto.forEach(function(val1){
	    		if(parseInt(val1) == val.id){
	       			val.selected = 1;
	    		}
         	});
      	});


		isMultipleGeneral = (listaTipoContacto.length > 1?1:0);
      	verAcordeCausaInmediata(isMultipleGeneral);
      	//
      	$("#tdfecha"+acInseguroId).html("<input type='date' id='inputFechaRep' class='form-control' value='"+convertirFechaInput(reporteFecha)+"'>");

      	cargarModalTrabs();
        /*************************************************************************** */
      	var selActTipo = crearSelectOneMenuOblig("selActTipo","verCategAcordeTipoActoInseguro()",listActInsegTipo,
	        acInseguroTipoId,"actTipoId","actTipoName");
      	$("#tdtipact"+acInseguroId).html(selActTipo);
      
      	// var selOrigen = crearSelectOneMenuOblig("selOrigen","",listOrigenReporte,
	  	//    origenId,"id","nombre");
      
      	var selTipoReporteLugarActo = crearSelectOneMenuOblig("selTipoReporteLugarActo","verAcordeTipoReporteLugar()",
	     	lisTipoReporteLugar,tipoLugarId,"id","nombre");
      
      	var selTipoReporteValidoActo = crearSelectOneMenuOblig("selTipoReporteValidoActo","verAcordeTipoValido()",
	     	listTipoReporteValido,tipoValidoId,"id","nombre");
		
      	$("#tdtrv"+acInseguroId).html(selTipoReporteValidoActo+"<br><br><input class='form-control' id='inputObsValidoActo'>");
		
      	verAcordeTipoValido();
		
      	$("#inputObsValidoActo").val(motivoValido);
      	$("#tdtrl"+acInseguroId).html(selTipoReporteLugarActo);
      	// $("#tdori"+acInseguroId).html(selOrigen);
		
      	var selArea = crearSelectOneMenu("selArea","",listArea,areaId,
	     	"areaId","areaName","Sin asignar");
      	$("#tdare"+acInseguroId).html(selArea);
      	//verAcordeTipoReporteLugar();
      	verCategAcordeTipoActoInseguro();

      	var selNivel = crearSelectOneMenuOblig("selNivel","",listNivel,nivelId,
	     	"nivelRiesgoId","nivelRiesgoNombre");
      	$("#tdnivel" + acInseguroId).html(selNivel);
		
        $("#tdEveSol"+acInseguroId).html("<a class='efectoLink' onclick='verAccionesEventoSub()'>" +
	            "<i class='fa fa-external-link'></i> "+acInseguroObj.accionesSolicitudIndicador +
	        "</a>");
		
        $("#tdEveAccColab"+acInseguroId).html("<a class='efectoLink' onclick='verAccionesEventoSubColaborador()'>" +
	            "<i class='fa fa-external-link'></i> "+acInseguroObj.numAccionesColaboradorIndicador +
	        "</a>");

		var options={
			container:"#tdEviAcSubAdm"+acInseguroId,functionCall:function(){
				validacionSubirEvidencia("AcSubAdm",bitsEvidenciaExamen,"");
			},descargaUrl:"/acinseguro/evidencia?acInseguroId="+acInseguroId,
			esNuevo:(acInseguroObj.evidenciaNombre.trim().length == 0?true:false),
			idAux:"AcSubAdm",evidenciaNombre:acInseguroObj.evidenciaNombre
		};

		crearFormEvidenciaCompleta(options);

		banderaEdicion = true;
      	habilitarBotonesEdicion();

		$("#btnClipTabla").hide();$("#filtroAplicarBuscador").hide();$("#btnReportExcel").hide();
		$("#btnVerConsolidado").hide();$("#btnVerIndicadores").hide();$("#btnVerQuicksight").hide();
		$("#indicadorPaginaParcialAuxAcSubAdmin").hide();
    }
}

function verAcordeTipoReporteLugar(){
   var tipoId = parseInt($("#selTipoReporteLugarActo").val());
	
   if(tipoId == 1){
      $("#selArea").val(getSession("areaGosstId"));
      $("#selArea").prop("disabled",true);
   }else{
      $("#selArea").prop("disabled",false);
   }
}

var isMultipleGeneral = 0;

function verAcordeCausaInmediata(isMultiple){
   isMultipleGeneral = parseInt(isMultiple);
	
   if((parseInt(isMultiple) == 0)){
      crearSelectOneMenuObligUnitarioCompleto("selTipoContactoMul","",listFullTipoContacto,
	 "id","nombre","#tdtipcon"+acInseguroId,"---");
		
      $("#tdtipcon"+acInseguroId)
      .append("<br><button class='btn btn-success' onclick='verAcordeCausaInmediata(1)'>Asignar más riesgos</button>");
   }else{
      crearSelectOneMenuObligMultipleCompleto("selTipoContactoMul","",listFullTipoContacto,
	 "id","nombre","#tdtipcon"+acInseguroId,"---");	
		
      $("#tdtipcon"+acInseguroId)
      .append("<br><button class='btn btn-success' onclick='verAcordeCausaInmediata(0)'>Asignar 1 riesgo</button>");
   }	
}

function cambiarGraficoEvento(){
	$("#grafEventosGosst").html("");
	switch(tipoGraf){
	case 1:
		tipoGraf=2;
		var data=[];
		var resto={name:"Otros",y:0};
		var totalAux=0;
		listCausaInmediataSimple.forEach(function(val,index){
			totalAux+=val.numEventosAsociados; 
		});
		listCausaInmediataSimple.forEach(function(val,index){ 
			if(val.numEventosAsociados>0){
				if(index<5){
					var porcAux=pasarDecimalPorcentaje(val.numEventosAsociados/totalAux,2);
					data.push({
						name:" ("+porcAux+") "+val.causaInmNombre,
						y:val.numEventosAsociados
					})
				}else{
					resto.y+=val.numEventosAsociados
				}
			}
			
		});
		resto.name="("+pasarDecimalPorcentaje(resto.y/totalAux,2)+")"+" Otros ";
		if(resto.y>0){
			data.push(resto);
		}

		 
		Highcharts.chart('grafEventosGosst', {
	        chart: { 
	            type: 'bar'
	        },
	        legend: {
	            enabled: false
	        },
	        xAxis:{visible:false},
	        yAxis:{visible:false},
	        title: {
	            text: '<span onclick="cambiarGraficoEvento()"><i class="fa fa-arrow-left" aria-hidden="true"></i></span>'
	            	+'<label style="font-size:20px;font-weight:900">Causas Inmediatas</label>' 
	            	+'<span onclick="cambiarGraficoEvento()"><i class="fa fa-arrow-right" aria-hidden="true"></i></span>',
	            useHTML:true,
	            style:{
	            	fontSize:"20px !important",
	            	fontWeight:"900 !important"
	            }
	        },
	        tooltip: {
	        	useHTML: true,
	        	headerFormat:"",
	            pointFormat: '<b style="font-size:">{point.name}</b>'
	        },
	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    align: 'right',
	                    color: '#FFFFFF',
	                    style:{
	                    	fontSize:"15px !important"
	                    },
	                    x: -10
	                },
	                pointPadding: 0.1,
	                groupPadding: 0
	            }
	        },
	        series: [{
	            name: 'Causas Inmediatas',
	            colorByPoint: true,
	            data: data
	        }]
	    });
		break;
	case 2:
		tipoGraf=1;
		var dataGraf1=[];
		var colors=["#FA325D","#FFBC28","#F8F554","#12A882","#53D321","#8621D3","",""]
		listNivel.forEach(function(val,index){
			if(val.numEventosAsociados>0)
			dataGraf1.push({
				name:val.nivelRiesgoNombre,
				y:val.numEventosAsociados,
				color:{
		            radialGradient: {
		                cx: 0.5,
		                cy: 0.3,
		                r: 0.7
		            },
		            stops: [
		                [0, colors[index]],
		                [1, Highcharts.Color(colors[index]).brighten(-0.3).get('rgb')] // darken
		            ]
		        }
			});
		});
		
		 Highcharts.chart('grafEventosGosst', {
	            chart: {
	                plotBackgroundColor: null,
	                plotBorderWidth: null,
	                plotShadow: false,
	                type: 'pie'
	            },
	            title: {
	                text: '<span onclick="cambiarGraficoEvento()"><i class="fa fa-arrow-left" aria-hidden="true"></i></span>'
	                	+'<label style="font-size:20px;font-weight:900">Nivel de riesgo</label>' 
	                	+'<span onclick="cambiarGraficoEvento()"><i class="fa fa-arrow-right" aria-hidden="true"></i></span>',
	                useHTML:true,
	                style:{
	                	fontSize:"20px !important",
	                	fontWeight:"900 !important"
	                }
	            },
	            tooltip: {
	            	headerFormat:"",
	                pointFormat: '<b style="font-size:15px;font-weight:900">{point.name}: {point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    size: "110%",
	                    dataLabels: {
	                        enabled: true,
	                        distance: -20,format:"{y}",
	                        style:{
	                        	fontSize:"12px !important"
	                        }
	                    },
	                    showInLegend: false
	                }
	            },
	            series: [{
	                name: 'Nivel de riesgo',
	                colorByPoint: true,
	                data: dataGraf1
	            }]
	        });
		break;
	}
	

}

function verCategAcordeTipoActoInseguro(){
   var auxTipoActo = $("#selActTipo").val();
 
   var selCausa = crearSelectOneMenuY("selCausa","verAcordeCausaInmediata()",
	  listCausaInmediataSimple.filter(function(val){
	     if(val.causaInmTipoEvent == parseInt(auxTipoActo)){
	        return true;
	     }else{
		return false;
	     }
	  }),acInseguroCausa,"causaInmId","causaInmTipoEvent", "causaInmNombre");
   $("#tdcausa"+acInseguroId).html(selCausa);
}

function nuevoACInseguros(){
   if(!banderaEdicion){
      var selActTipo = crearSelectOneMenuOblig("selActTipo","verCategAcordeTipoActoInseguro()",
	     listActInsegTipo,"-1","actTipoId","actTipoName");

      var selArea = crearSelectOneMenu("selArea","",listArea,"-1",
	     "areaId","areaName","Sin asignar");
		
      var selNivel = crearSelectOneMenuOblig("selNivel","",listNivel,-1,
	     "nivelRiesgoId","nivelRiesgoNombre");
		
      var selOrigen = crearSelectOneMenuOblig("selOrigen","",listOrigenReporte,-1,"id","nombre");
      
      var selTipoReporteLugarActo = crearSelectOneMenuOblig("selTipoReporteLugarActo","verAcordeTipoReporteLugar()",
	     lisTipoReporteLugar,"","id","nombre");
      
      $("#tblInseg tbody")
      .prepend("<tr id='0'>" +
	          "<td>"+selActTipo+"</td>" +
		//+"<td>"+selOrigen+"</td>"
		  "<td id='tdcausa0'></td>" +
		  "<td id='tdtipcon0'></td>" + 
		  "<td>"+selNivel+"</td>" +
		  "<td><input type='text' id='inputNom' class='form-control' placeholder='Descripcion'></td>" +
                  "<td><input type='text' id='inputLug' class='form-control' placeholder='Lugar'></td>" +
		  "<td><input type='date' id='inputFechaRep' class='form-control'></td>" +
		  "<td><input type='time' id='inputTimeAcinseguro' class='form-control'></td>" +
		  "<td>"+selArea+"</td>" + 
	      //+ "<td>"+selTipoReporteLugarActo+"</td>"
		  "<td>...</td>" + 
		  "<td>...</td>" +
		  "<td id='tdEviAcSubAdm0'></td>" +
		  "<td>...</td>" +  
		  "<td>...</td>" + 
		  "<td>...</td>" + 
	       "</tr>");
		
      acInseguroId = 0;
		
      $("#inputTimeAcinseguro").val(obtenerHoraActual());
		
      habilitarBotonesNuevo();
      verCategAcordeTipoActoInseguro();
      listFullTipoContacto.forEach(function(val){val.selected = 0;})
      verAcordeCausaInmediata(0);
      verAcordeTipoReporteLugar();
      banderaEdicion = true;

	   var options={
		   container:"#tdEviAcSubAdm"+acInseguroId,functionCall:function(){
			   validacionSubirEvidencia("AcSubAdm",bitsEvidenciaExamen,"");
		   },descargaUrl:"",esNuevo:true,idAux:"AcSubAdm",evidenciaNombre:""
	   };

	   crearFormEvidenciaCompleta(options);

	   $("#btnClipTabla").hide();$("#filtroAplicarBuscador").hide();$("#btnReportExcel").hide();
	   $("#btnVerConsolidado").hide();$("#btnVerIndicadores").hide();$("#btnVerQuicksight").hide();
	   $("#indicadorPaginaParcialAuxAcSubAdmin").hide();

      formatoCeldaSombreableTabla(false,"tblInseg");
   }else{
      alert("Guarde primero.");
   }
}

function cancelarACInseguros(){
   cargarPrimerEstado();
}

function eliminarACInseguros(){
   var r = confirm("¿Está seguro de eliminar el acto inseguro?");
	
   if(r == true){
      var dataParam={
             acInseguroId : acInseguroId
		    };

      callAjaxPost(URL+'/acinseguro/delete',dataParam,
         procesarResultadoEliminarAC);
   }
}

function procesarResultadoEliminarAC(data){
   switch(data.CODE_RESPONSE){
      case "05":
         cargarPrimerEstado();
         break;
	
      default:
         alert("Verificar que el registro de acto o condición sub estándar no este asociado a " +
               "trabajadores involucrados, sanciones, o acciones de mejora asociadas.");
   }
}

function guardarACInseguros(){
   var campoVacio = true;
   var trabajadorId;
   var nombreTrab = $("#inputNomRep").val().trim();
	
   if(parseInt($("#selTipoRep").val()) == 1){
      for(var index=0;index<listDniNombre.length;index++){
         if(listDniNombre[index]["trabajadorNombre"].trim() == nombreTrab){
	    trabajadorId = listDniNombre[index]["trabajadorId"];
	    break;
         }else{
	    trabajadorId = null;
         }
      }
   }
	
   var hora = $("#inputTimeAcinseguro").val();
   var tipoLugar = (acInseguroId == 0?2:acInseguroObj.tipoLugar.id);
   var tipoValido = (acInseguroId == 0?1:$("#selTipoReporteValidoActo").val());
   var motivoValido = $("#inputObsValidoActo").val();
   var origenId = $("#selOrigen").val();
   var inputNom = $("#inputNom").val();
   var selActTipo = $("#selActTipo option:selected").val();
   var acInseguroCausa = $("#selCausa option:selected").val();
   var nivelId = $("#selNivel option:selected").val();
   var acAux = acInseguroCausa.split('-');
   var selArea = $("#selArea").val();
   var inRepLugar = $("#inputLug").val();
   var inRepAcc = (acInseguroId > 0?$("#inputAccRep").val():'');
   var inRepTipo = (acInseguroId > 0?$("#selTipoRep option:selected").val():'');
   var inRepNombre = (acInseguroId > 0?$("#inputNomRep").val():'');
   var inputFecha = convertirFechaTexto($("#inputFechaRep").val());
	var inputEvi = $("#inputEviAcSubAdm").val();
	
   if(acInseguroId > 0){
      var seleccionados = $('#jstree').jstree(true).get_checked();
      listTrabsSelecccionados = [];
		
      for(index=0;index<seleccionados.length;index++){
         var trab = seleccionados[index];
			
         if(seleccionados[index].substr(0, 4) == "nodo"){
	    listTrabsSelecccionados.push(seleccionados[index].substr(4,seleccionados[index].length));
         }
      }
   }else{ 
      if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){	 
      }else{
         inRepTipo = 1;
         trabajadorId = parseInt(sessionStorage.getItem("trabajadorGosstId"));
      }
   }

   if(selActTipo == '-1' || inputNom.length == 0 || nivelId=='-1'){
      campoVacio = false;
   }
   
   var listTipC = $("#selTipoContactoMul").val();
   var tiposContacto = [];
   
   if(isMultipleGeneral == 1){
      if(listTipC != null){
         listTipC.forEach(function(val){
	    tiposContacto.push({id: parseInt(val)});
         });
      }
   }else{
      tiposContacto=[{id: parseInt(listTipC)}];
   }

	if(inputEvi == "VOLVER A SUBIR"){
		campoVacio = false;
	}

   if(campoVacio){ 
      var dataParam={
	     acInseguroId: acInseguroId,
	     tiposContacto: tiposContacto,
	     hora: hora,
	     origen: {id: (origenId==-1?null:origenId)},
	     areaId: (selArea=='-1'?null:selArea),
	     nivelRiesgoId: nivelId,
	     acInseguroTipoId: selActTipo,
	     acInseguroCausaId: acAux[0],
	     tipoLugar: {id: tipoLugar},
	     tipoValido: {id: tipoValido},
	     motivoValido: motivoValido,
	     acInseguroNombre: inputNom,
	     reporteLugar: inRepLugar,
	     reporteAccion: inRepAcc,
	     reporteTipo: inRepTipo,
	     reporteNombre: inRepNombre,
	     reporteFecha: inputFecha,
	     trabajadorId: trabajadorId,
	     trabajadores: listTrabsSelecccionados,
	     existeEvidencia: (acInseguroId > 0?1:0),
	     matrixId: getUrlParameter("mdfId")
		    };

	   callAjaxPostSimpleVersionDos(1,URL+'/acinseguro/save',dataParam,1,0,procesarResultadoGuardarACInseguro);
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function procesarResultadoGuardarACInseguro(data){
   switch(data.CODE_RESPONSE){
      case "05":
		  guardarEvidenciaAutoVersionTres(1,data.idNuevo,"fileEviAcSubAdm",
			  bitsEvidenciaExamen,0,1,"/acinseguro/evidencia/save",function(){
				  mensajeUx = "<label>El registro del reporte A/C subestándar fue guardado con éxito.</label>";
				  mensajesUx(mensajeUx,1,"","ActualizarAcSubAdm");

				  $("#modalMensajeUxActualizarAcSubAdm").on("hidden.bs.modal",function(){
					  cargarPrimerEstado();
				  });
			  },"acInseguroId");

         break;

      default:
         alert("Ocurrió un error al guardar el acto inseguro!");
   }
}

function editarDatosReporte(){
   $('#mdReporte').modal('show');
}

function mostrarCargarImagen(acInseguroId){
   $('#mdUpload').modal('show');
   $('#btnUploadEvidencia')
   .attr("onclick","javascript:uploadEvidencia("+acInseguroId+");");
}

function uploadEvidencia(acInseguroId,tipoImagenId) {
   $.blockUI({message: 'cargando...'});
	 
   guardarEvidenciaAuto(acInseguroId,"fileEvi",bitsEvidenciaActoInseguro,'/acinseguro/evidencia/save',function(){
      $.unblockUI();
      console.log('Se subio el archivo correctamente.');
      $('#mdVistaPrevia').modal('hide');
			
      var inputFileImage = document.getElementById("fileEvi");
      var file = inputFileImage.files[0];
			
      $("#tdevi"+acInseguroId)
      .html("<i class='fa fa-picture-o' aria-hidden='true'></i>"+file.name);
   },"acInseguroId");	
}

/** *********************JsTree************** */
function seleccionarTrabajadores(){
   $('#mdTrabs').modal('show');
   $('#mdReporte').modal('hide');
}

function cargarModalTrabs(){
   if(listTrabsSelecccionados.length === 0){
      var dataParam={
	     acInseguroId: acInseguroId,
	     matrixId: getUrlParameter("mdfId")
		    };

      callAjaxPost(URL+'/acinseguro/trabajadores/jstree',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $('#jstree').jstree("destroy");

	       listTrabs = data.list;

	       $('#jstree')
	       .jstree({"plugins": ["checkbox","json_data","search","wholerow"],
			'checkbox': {"keep_selected_style": false,
				     "tie_selection": false
				    },
		        'core': {'data': listTrabs}
	       });

	       //Inicio Para Buscador en jstree
	       var to = false;

	       $('#buscarTrabJstree').keyup(function(){
                  if(to){
                     clearTimeout(to);
                  }
  
                  to = setTimeout(function(){
                     var v = $('#buscarTrabJstree').val();
                     $("#jstree").jstree(true).search(v);
                  },250);
	       });
	       
	       $.jstree.defaults.search.show_only_matches=true;

	       $('#listTrabBuscar').keyup(function(){
	          if(to){
	             clearTimeout(to);
	          }
	    
	          to = setTimeout(function(){
	             busquedaMasivaJstree(listTrabs,"jstree","resultSearchTrab","listTrabBuscar",1);
	          },250);
	       });
	       //Fin Para Buscador en jstree
	       for(index=0;index<listTrabs.length;index++){
	          if(listTrabs[index].state.checked && listTrabs[index].id.substr(0,4) == "nodo"){
		     listTrabsSelecccionados.push(listTrabs[index].id.substr(4,listTrabs[index].id.length));
	          }
	       }
	       break;
					
	    default:
	       alert("Ocurrió un error al cargar el árbol de trabajadores.!");
         }
      });
   }
}

function generarReporteActo(){
   if(tienePermisoReporte){
      window.open(URL+"/acinseguro/informe?actoInseguroId="+acInseguroId+'');	
   }else{
      alert("Debe registrar una evidencia ")
   }
}

function importarDatos(){
   $("#btnGuardarNuevos").attr("onclick","javascript:guardarMasivoCopiaExcel();");
   $('#mdImpDatos').modal('show');
	
   var selArea = crearSelectOneMenu("selAreaImp","",listArea,"-1",
          "areaId","areaName");
   $("#divSelArea").html(selArea);
}

function guardarMasivoCopiaExcel() {
   var texto = $("#txtListado").val();
   var listExcel = texto.split('\n');
   var listRecurso = [];
   var listActRepe = [];
   var listFullNombres = "";
   var validado = "";
	
   if(texto.length < 10000){
      for(var int=0;int<listExcel.length;int++){
         var listCells = listExcel[int].split('\t');
         var filaTexto = listExcel[int];
			
         if(filaTexto.trim().length < 1){
	    validado = "Existen filas vacias.";
	    break;
         }

         if(validado.length < 1 && listCells.length != 3){
	    validado = "No coincide el numero de celdas. ("+listCells.length+"!=3 )";
	    break;
         }else{
	    var recurs = {};
	    var tipo = {};
				
	    for(var j=0;j<listCells.length;j++){
	       var element = listCells[j];
					
	       if(j === 1){
		  recurs.acInseguroNombre = element.trim();
			
		  if($.inArray(recurs.acInseguroNombre,listActRepe) === -1){
		     listActRepe.push(recurs.acInseguroNombre);
		  }else{
		     listFullNombres = listFullNombres + recurs.acInseguroNombre + ", ";
		  }
	       }
					
	       if(j === 0){
		  for(var k=0;k<listActInsegTipo.length;k++){
		     if(listActInsegTipo[k].actTipoName == element.trim()){
		        recurs.acInseguroTipoId = listActInsegTipo[k].actTipoId;
		     }
		  }

		  if(!recurs.acInseguroTipoId){
		     validado = "Tipo de A/C Sub estándar no reconocido.";
		     break;
		  }
	       }
					
	       if(j === 2){
		  try{
		     var fechaTexto = element.trim();
		     var parts = fechaTexto.split('/');
		     var dateIngreso = new Date(parts[2], parts[1] - 1,parts[0]);
		     recurs.reporteFecha = dateIngreso;
		  }catch(err){
		     validado = "Error en el formato de fecha de reporte.";
		     break;
		  }
	       }
					
	       recurs.areaId = $("#selAreaImp").val();
	       recurs.acInseguroCausaId = 34;
				
	       if(recurs.areaId == "-1"){
		  validado = "seleccione un área a importar";
	       }
	    }

	    listRecurso.push(recurs);
		
	    if(listActRepe.length < listRecurso.length){
	       validado = "Existen A/C repetidos repetidos. "+listFullNombres;
	       break;
	    }
         }
      }
   }else{
      validado = "Ha excedido los 10000 caracteres permitidos.";
   }

   if(validado.length < 1) {
      var r = confirm("¿Está seguro que desea subir estos "+listExcel.length+" elemento(s)?");
		
      if(r == true){
         var dataParam={
	        listRecurso: listRecurso
		       };
			
         callAjaxPost(URL+'/acinseguro/masivo/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
		  alert("Se guardaron exitosamente.");
		  cargarPrimerEstado();
		  $('#mdImpDatos').modal('hide');
		  break;
				
	       default:
		  alert("Ocurri&oacute; un error al guardar los exams!");
            }
         });
      }
   }else{
      alert(validado);
   }
}

var listOpcConsolidadosAc=[
   {id:1,nombre:"Reporte de Actos y Condiciones Subestándar"}
];

function ocultarOpcionesConsolidadosAc(){
   $("#modalOpcConsolidadosAc").modal("hide");
}

function verOpcionesConsolidadosAc(){
   $("#modalOpcConsolidadosAc").remove();
   
   var selOpcConExcelAc = crearSelectOneMenuOblig("selOpcConExcelAc",
      "verAcordeConsolidadosAc()",listOpcConsolidadosAc,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Opción",
       inputForm:selOpcConExcelAc,divContainer:"divSelOpcConAc"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarOpcionesConsolidadosAc()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelAc()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions = {
      id:"modalOpcConsolidadosAc",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosAc();
}

function verAcordeConsolidadosAc(){
	$(".atributo-consolidadoExcelAc").remove();
	var listContenidoDivSelConExcelAc = [];
	var opcConsolidadoExcel = parseInt($("#selOpcConExcelAc").val());

	if([1].includes(opcConsolidadoExcel)){
		listContenidoDivSelConExcelAc=[
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
				inputForm:"<input type='date' id='fechaInicioOpcConAc' class='form-control'>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
				inputForm:"<input type='date' id='fechaFinOpcConAc' class='form-control'>"}
		];

		listContenidoDivSelConExcelAc.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestopdivision") != null?getSession("gestopdivision"):"División"),inputForm:"",divContainer:"divDivisionExcel"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:(getSession("gestoparea") != null?getSession("gestoparea"):"Área"),inputForm:"",divContainer:"divAreaExcel"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Riesgos asociados",inputForm:"",divContainer:"divSubTipoContactoExcel"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:"",divContainer:"divTipoAcExcel"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Causas inmediatas",inputForm:"",divContainer:"divCausaAcExcel"});

		if(parseInt(getSession("gestopcompanyid")) != 336){
			var listBooleanSiNo = listBoolean.sort(function(val,val2){
				return val2.id - val.id;
			});

			var selHasEvidenciaAc = crearSelectOneMenuOblig("selHasEvidenciaAc","",
				listBooleanSiNo,0,"id","nombre");

			listContenidoDivSelConExcelAc.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
				{sugerencia:"",label:"¿Incluir las evidencias?",inputForm:selHasEvidenciaAc,divContainer:""});
		}
	}

	var contenido = "";

	listContenidoDivSelConExcelAc.forEach(function(val){
		val.clase = "atributo-consolidadoExcelAc";
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	$("#divSelOpcConAc").parent().after(contenido);

	if([1].includes(opcConsolidadoExcel)){
		var hoy = getSession("fechaHoyOrdenInversoTexto");

		$("#fechaInicioOpcConAc").val(sumaFechaDias(-180,hoy));$("#fechaFinOpcConAc").val(hoy);

		crearSelectOneMenuObligMultipleCompleto("selMulDivisionesAcExcel","filtrarValoresAreasAcSubExcel()",
			listDivisionesAcFiltro,"divisionId","divisionName","#divDivisionExcel","Todos");

		crearSelectOneMenuObligMultipleCompleto("selMulSubTipoContactoActoAcExcel","",
			listTipoContactoAcFiltro,"id","nombre","#divSubTipoContactoExcel","Todos");

		crearSelectOneMenuObligMultipleCompleto("selMulTipoActoAcExcel","",listActInsegTipoAcFiltro,
			"id","nombre","#divTipoAcExcel","Todos");

		crearSelectOneMenuObligMultipleCompleto("selMulCausaActoAcExcel","",listCausaInmediataSimpleAcFiltro,
			"id","nombre","#divCausaAcExcel","Todos");

		filtrarValoresAreasAcSubExcel();
	}
}

function filtrarValoresAreasAcSubExcel(){
	var listMultiDivisiones = $("#selMulDivisionesAcExcel").val();
	var listAreaAux = [];

	if(listMultiDivisiones != null){
		listMultiDivisiones.forEach(function(val,index){
			listAreasAcFiltro.forEach(function(val1,index){
				if(parseInt(val) == val1.divisionId){
					listAreaAux.push(val1);
				}
			});
		});

		if(listAreaAux.length > 0){
			crearSelectOneMenuObligMultipleCompleto("selMulAreasAcExcel","",listAreaAux,
				"areaId","areaName","#divAreaExcel","Todos");
		}else{
			$("#divAreaExcel").html("<label>*Sin áreas registradas</label>");
		}
	}else{
		$("#divAreaExcel").html("<label>*Debe seleccionar al menos una división.</label>");
	}
}

function descargarConsolidadosExcelAc(){
    var campoVacio = true;
    
    var opcConsolidadoExcel = parseInt($("#selOpcConExcelAc").val());
    var fechaInicioConsolidado = $("#fechaInicioOpcConAc").val();
    var fechaFinConsolidado = $("#fechaFinOpcConAc").val();
     
    if([1].includes(opcConsolidadoExcel)){
       if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
 	 campoVacio = false;  
 	 mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
       } 
    }
     
   if(campoVacio){
      var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
      var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
      
      if([1].includes(opcConsolidadoExcel)){
		  var valDivisiones = "",valAreas = "",valRiesgos = "",valTiposAc = "",valCausas = "";

		  var listMultiDivisiones = $("#selMulDivisionesAcExcel").val();

		  if(listMultiDivisiones != null){
			  listMultiDivisiones.forEach(function(val,index){
				  valDivisiones += (valDivisiones.length == 0?val:","+val);
			  });
		  }

		  var listMultiAreas = $("#selMulAreasAcExcel").val();

		  if(listMultiAreas != null){
			  listMultiAreas.forEach(function(val,index){
				  valAreas += (valAreas.length == 0?val:","+val);
			  });
		  }

		  var listMulSubTipoContactoActo = $("#selMulSubTipoContactoActoAcExcel").val();

		  if(listMulSubTipoContactoActo != null){
			  listMulSubTipoContactoActo.forEach(function(val){
				  valRiesgos += (valRiesgos.length == 0?val:","+val);
			  });
		  }

		  var listMulTipoActo = $("#selMulTipoActoAcExcel").val();

		  if(listMulTipoActo != null){
			  listMulTipoActo.forEach(function(val){
				  valTiposAc += (valTiposAc.length == 0?val:","+val);
			  });
		  }

		  var listMulCausaActo = $("#selMulCausaActoAcExcel").val();

		  if(listMulCausaActo != null){
			  listMulCausaActo.forEach(function(val){
				  valCausas += (valCausas.length == 0?val:","+val);
			  });
		  }

		  var hasEvidencia = (parseInt(getSession("gestopcompanyid")) == 336?0:parseInt($("#selHasEvidenciaAc").val()));

          window.open(URL+"/acinseguro/version_dos/reporte/excel?"+"empresaId="+getSession("gestopcompanyid") +
              "&opcionSelectLista="+opcConsolidadoExcel+"&accesoVistaColaborador=0"+"&unidadId="+getUrlParameter("mdfId") +
              "&conEvidencia="+hasEvidencia+"&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
			  "&valUnidades="+"-1"+"&valDivisiones="+(valDivisiones.length == 0?"-1":valDivisiones) +
			  "&valAreas="+(valAreas.length == 0?"-1":valAreas)+"&valEstados="+"-1" +
			  "&valRiesgos="+(valRiesgos.length == 0?"-1":valRiesgos)+"&valTiposAc="+(valTiposAc.length == 0?"-1":valTiposAc) +
			  "&valCausas="+(valCausas.length == 0?"-1":valCausas));

      }
   }else{
      $("#modalOpcConsolidadosAc").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
       
      $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
         $("#modalOpcConsolidadosAc").modal("show");
      });
   }    
}

function ocultarQuicksightOpcionesAcInseguro(){
	$("#modalQuicksightOpcAcInseg").modal("hide");
}

function verQuicksightOpcionesAcInseguro(){
	$("#modalQuicksightOpcAcInseg").remove();

	var contenido = "";

	var buttonOcultar =
		"<button type='button' class='btn btn-info' style='margin-right:5px' " +
		        "onclick='ocultarQuicksightOpcionesAcInseguro()' title='Regresar a la vista anterior.'>" +
		    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> "+"<i class='fa fa-pie-chart fa-2x'></i>" +
		"</button>";

	var modalOptions={
		maxWidth:"90%",id:"modalQuicksightOpcAcInseg",btnCerrarHabilitado:0,
		nombre:"<i class='fa fa-table'></i> Quicksight",
		contenido:
			"<form class='form-inline'>"+buttonOcultar+"</form>" +
			"<div id='divQuicksightOpcAcInseg'>"+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var dataParam={
		empresaId:parseInt(getSession("gestopcompanyid"))
	};

	callAjaxPostSimpleVersionDos(1,URL+'/quicksight/ac_subestandar/opciones',dataParam,1,0,function(data){
		if(data.CODE_RESPONSE === "05"){
			var urlDelIframe = data.embedUrl;

			var $iframe = $('<iframe>',{
				src:urlDelIframe,width:'100%',height:'750px',frameborder:'0',css:{border:'none'}
			}).on('load',function(){
				$.unblockUI();console.log('El contenido de QuickSight ha terminado de cargar.');
			});

			$('#divQuicksightOpcAcInseg').empty().append($iframe);
		}else{
			$("#modalQuicksightOpcAcInseg").modal("hide");

			mensajeUx = "<label>Error al cargar los datos.</label>";
			mensajesUx(mensajeUx,2,"","ValidacionQuicksight");

			$("#modalMensajeUxValidacionQuicksight").on("hidden.bs.modal",function(){
				$("#modalQuicksightOpcAcInseg").modal("show");
			});
		}
	});
}