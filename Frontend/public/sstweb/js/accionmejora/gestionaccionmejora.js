var listCausa = [];var listEstado = [];
var listSolicitud=[];var listRiesgoPotencial = [];
var listTipoAccionMejora = [];var listTipoAccionMejoraDepurado = [];
var listTipoAccionMejoraDepurado = [];var listRespAccionMejora = [];
var listEstadoCumplimiento = [];
var gestionAccionMejoraId;var gestionAccionMejoraObj={};
var causaId;
var solicitudAccionId;
var estadoCumpId;
var accionMejoraTipoIdActual;
var listTabla;
var listTablaAux;
var banderaEdicion;
var hayProceso;
var hayCompleto;
var hayRetrasado;
var huboCambiosAcciones;
var propiedad1;
var propiedad2;
var numPaginaTotal;
var numPaginaActual;
var listanombretab;

var listTipoHallazgo;
var tipoHallazgoAccionId;
var listDniNombreAccion;
var listanombretab;

var toggleFiltroCausa=false;
var listResponsableSolicitud;  
var mensajeUx;

function verFiltroSolicitudes(){
	$("#modalFiltroSolicitud").modal("show");
}
function ocultarFiltroSolicitudes(){
	$("#modalFiltroSolicitud").modal("hide");
}

function verFiltroSolicitudesConsolidado(){
	$("#modalFiltroSolicitudConsolidado").modal("show");
}
function ocultarFiltroSolicitudesConsolidado(){
	$("#modalFiltroSolicitudConsolidado").modal("hide");
}

$(document).ready(function() {
	
	 $('.izquierda_flecha').on('click',function(){
		 numPaginaActual=numPaginaActual-1
		 cambiarPaginaTabla();
        });
	 $('.derecha_flecha').on('click',function(){
		 numPaginaActual=numPaginaActual+1;
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
         $('#buscadorAcciones').keyup(function(e) {
 		if (e.keyCode == 13) {
 			$(this).trigger("enterKey");
 		}
 	});
 	$('#buscadorAcciones').bind("enterKey", function(e) {
 		cargarPrimerEstado();
 	});
 	$("#buscadorAcciones").focus();
 	$("#resetBuscador").on("click", function(){
 	    $('#buscadorAcciones').val("");
     	    cargarPrimerEstado();
     	});
 	
     	crearFiltroSolicitudes( function(){
    		insertMenu(cargarPrimerEstado);
    	}); 
     	
     	crearFiltroSolicitudesConsolidado( function(){
		insertMenu(cargarPrimerEstado);
	});
    	resizeDivWrapper("wrapper",300);
    	resizeDivWrapper("wrapperConsolidado" ,300);
    	
});

function volverDivSolicitudes(){
    $("#divGeneralSolicitud .container-fluid").hide();
    $("#divGestionAccion").show();
    
    $("#divGeneralSolicitud h2").html("Gestión de solicitudes de mejora");
}

function crearFiltroSolicitudes(functionCallBack){
    var dataParam = {
		idCompany : getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/gestionaccionmejora/filtro', dataParam,
    		function(data){

	listCausa = data.listCausa;
	listResponsableSolicitud=data.trabajadores;
	listTipoHallazgo=data.listHallazgo;
	listEstado = data.listEstado;
	listTipoAccionMejora = data.listTipoAccionMejora;
	listRiesgoPotencial = data.listRiesgoPotencial;
 
        var contenido ="";
        var listContenido = [
        //{sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioEvento' class='form-control'>"},
        //{sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinEvento' class='form-control'>"},
        //{sugerencia:"",label:"Responsable",inputForm: selUnidadAccidente},
        {sugerencia:"",label:"Resumen Solicitud",inputForm:"",divContainer:"divResumenSolicitudAccion"},
        {sugerencia:"",label:"Fuente/Origen de la solicitud",inputForm: "",divContainer:"divCausaSolicitudAccion"},
        {sugerencia:"",label:"Tipo de hallazgo",inputForm: "",divContainer:"divTipoHallazgoPrincipalAccion"},
        {sugerencia:"",label:"Responsable de la solicitud",inputForm:"",divContainer:"divResponsableSolicitudPrincipalAccion"},
        {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroSolicitudes()'><i class='fa fa-times'></i>Cancelar</button>",
        inputForm:"<button class='btn btn-success' type='button' onclick='cargarPrimerEstado()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
                             ];
        listContenido.forEach(function(val){
        	contenido +=obtenerSubPanelModuloGeneral(val);
        });
        var modalOptions= {id:"modalFiltroSolicitud",nombre:"<i class='fa fa-filter'></i>Filtros",
        		contenido: contenido};
        crearModalPrincipalUsuario(modalOptions,function(){},false,false);
        
        $("#modalFiltroSolicitud").modal("show");
        crearSelectOneMenuObligMultipleCompleto("selMulCausaFiltro", "", listCausa, "id",
        	"nombre","#divCausaSolicitudAccion","TODAS");
        var solicitudExternaId = parseInt(getSession("solicitudAuxId"));
        if(solicitudExternaId>0){
            data.listTotal.forEach(function(val){
        	  val.selected = 0;
        	if(val.gestionAccionMejoraId == solicitudExternaId){
        	  val.selected = 1;
    			
        	}
            }); 
            sessionStorage.removeItem("solicitudAuxId");
        }
        crearSelectOneMenuObligMultipleCompleto("selMulResumenFiltro", "", data.listTotal, "gestionAccionMejoraId",
        	"resumen","#divResumenSolicitudAccion","TODOS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulTipoHallazgoPrincipalFiltro", "", listTipoHallazgo, "id",
        	"nombre","#divTipoHallazgoPrincipalAccion","TODOS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulResponsablePrincipalFiltro", "", listResponsableSolicitud, "trabajadorId",
        	"nombre","#divResponsableSolicitudPrincipalAccion","TODOS");
        
        $("#modalFiltroSolicitud").modal("hide");

      //$("#fechaInicioEvento").val(sumaFechaDias(-30,hoy));
      //$("#fechaFinEvento").val(sumaFechaDias(365,hoy));

      if(functionCallBack != null){
          functionCallBack();
      }
	
	
    });
}

// *********************************************** Filtro Consolidado **************************************************

function crearFiltroSolicitudesConsolidado(functionCallBack){
    
    var hoy=obtenerFechaActual();
    
    var dataParam = {
		idCompany : getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/gestionaccionmejora/filtro', dataParam,
    		function(data){

	listCausa = data.listCausa;
	listResponsableSolicitud=data.trabajadores;
	listTipoHallazgo=data.listHallazgo;
	listEstado = data.listEstado;
	listTipoAccionMejora = data.listTipoAccionMejora;
	listRiesgoPotencial = data.listRiesgoPotencial;
	listRespAccionMejora = data.listRespAccionMejora;
	listEstadoCumplimiento= data.listEstadoCumplimiento;
	
        var contenido ="";
        var listContenido = [
        {sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioEventoCons' class='form-control'>"},
        {sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinEventoCons' class='form-control'>"},
        //{sugerencia:"",label:"Responsable",inputForm: selUnidadAccidente},
        {sugerencia:"",label:"Responsable de la solicitud",inputForm:"",divContainer:"divResponsableSolicitudAccion"},
        {sugerencia:"",label:"Responsable de la acción de mejora",inputForm: "",divContainer:"divResponsableAccionMejora"},
        {sugerencia:"",label:"Origen de la solicitud",inputForm: "",divContainer:"divOrigenSolicitudAccion"},
        {sugerencia:"",label:"Tipo de hallazgo",inputForm: "",divContainer:"divTipoHallazgoAccion"},
        {sugerencia:"",label:"Estado de cumplimiento",inputForm: "",divContainer:"divEstadoCumplimiento"},
        {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroSolicitudesConsolidado()'><i class='fa fa-times'></i>Cancelar</button>",
        inputForm:"<button class='btn btn-success' type='button' onclick='generarConsolidadoGestionAccion()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
                             ];
        listContenido.forEach(function(val){
        	contenido +=obtenerSubPanelModuloGeneral(val);
        });
        var modalOptions= {id:"modalFiltroSolicitudConsolidado",nombre:"<i class='fa fa-filter'></i>Filtros",
        		contenido: contenido};
        crearModalPrincipalUsuario(modalOptions,function(){},false,false);
        
        $("#modalFiltroSolicitudConsolidado").modal("show");
        
        crearSelectOneMenuObligMultipleCompleto("selMulResponsableFiltro", "", listResponsableSolicitud, "trabajadorId",
        	"nombre","#divResponsableSolicitudAccion","TODOS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulResponsableAccMejFiltro", "", listRespAccionMejora, "trabajadorResponsableId",
        	"trabajadorResponsableNombre","#divResponsableAccionMejora","TODOS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulOrigenFiltro", "", listCausa, "id",
        	"nombre","#divOrigenSolicitudAccion","TODAS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulTipoHallazgoFiltro", "", listTipoHallazgo, "id",
        	"nombre","#divTipoHallazgoAccion","TODOS");
        
        crearSelectOneMenuObligMultipleCompleto("selMulEstadoCumplimientoFiltro", "", listEstadoCumplimiento, "estadoCumpId",
        	"estadoCumplientoNombre","#divEstadoCumplimiento","TODOS");
        
        $("#modalFiltroSolicitudConsolidado").modal("hide");

        $("#fechaInicioEventoCons").val(sumaFechaDias(-30,hoy));
        $("#fechaFinEventoCons").val(sumaFechaDias(365,hoy));

      if(functionCallBack != null){
          functionCallBack();
      }
	
	
    });
}

//*************************************************************************************************************************

function calcularFilasEntrantes(){
    // ****** Tamaño de las filas en la tabla****** 
	var sizeArriba=275;
	var sizeAbajo=30;
	var alturaFila=38;
	var alturaWindow=$(window).height();
	
	return Math.floor((alturaWindow-sizeAbajo-sizeArriba)/alturaFila)
}

function cambiarPaginaTabla(){
	//Definiendo variables
	 
	var list = listTabla;
	
	var totalSize=list.length;
	var partialSize=calcularFilasEntrantes();
	numPaginaTotal=Math.ceil(totalSize/partialSize); 
	var inicioRegistro=(numPaginaActual*partialSize)-partialSize;
	var finRegistro=(numPaginaActual*partialSize)-1;
	
	//aplicando logica de compaginacion
	
	$('.izquierda_flecha').show();
	 $('.derecha_flecha').show();
	 if(numPaginaTotal==0){
			numPaginaTotal=1;
		}
		$("#labelFlechas").html(numPaginaActual+" de "+numPaginaTotal);
	 if(numPaginaActual==1){
			$('.izquierda_flecha').hide();
	 }
	
	 if(numPaginaActual==numPaginaTotal){
		 $('.derecha_flecha').hide();
	 }
	if(finRegistro>=totalSize){
		finRegistro=totalSize-1;
	}
	$("#tblAccion tbody tr").remove();
	for (var index =inicioRegistro; index <= finRegistro; index++) {
		
		 var valFila=list[index];
		$("#tblAccion tbody")
				.append("<tr id='tr"
						+ valFila.gestionAccionMejoraId
						+ "' onclick='javascript:editarGestionAccionMejora("
						+ valFila.gestionAccionMejoraId +","+index
					
						+ ")' >"

						+  agregarFilaGestionAccion(valFila,index) 
						+ "</tr>" );
		
	}
    //	goheadfixed("table.fixed");
	completarBarraCarga();
	formatoCeldaSombreableTabla(true,"tblAccion");
	
	
}
function agregarFilaGestionAccion(val,index){
	propiedad1=estadoAccion(
			val.numCorInmediataRetrasado,
			val.numCorInmediataProceso,
			val.numCorInmediataCompleto
			);
	 propiedad2=estadoAccion(
			 val.numAccionRetrasado,
			 val.numAccionProceso,
			 val.numAccionCompleto
			);
return  "<td>" + (parseInt(index)+parseInt(1)) + "</td>"

			+ "<td id='tdcausa"
			+ val.gestionAccionMejoraId + "'>"
			+ val.causaNombre + "</td>"
			
			+ "<td id='tdHallazgo"
		    + val.gestionAccionMejoraId + "'>"
		    + val.tipoHallazgo.nombre + "</td>"

			+ "<td id='tdasoc"
			+ val.gestionAccionMejoraId
			+ "'>"+devolverNumeroSustantivo(
					val.numActAsociadas,
					"asociado",
					"asociados")+"</td>"
					
		    /*  + "<td id='tdsoli"
		        + val.gestionAccionMejoraId + "'>"
		        + val.solicitud.nombre + "</td>"  */

			+ "<td id='tdres"
			+ val.gestionAccionMejoraId + "'>"
			+ val.resumen + "</td>"
			+ "<td id='tdrespo"
			+ val.gestionAccionMejoraId + "'>"
			+ val.responsable + "</td>"

			+ "<td id='tdcorr"
			+ val.gestionAccionMejoraId
			+ "' style='color:"+ propiedad1.color+"'>"+devolverNumeroSustantivo(
					val.numCorInmediata,
					"corrección",
					"correcciones")
					+ propiedad1.icono
					
					+"</td>"

			+ "<td id='tdanali"
			+ val.gestionAccionMejoraId
			+ "'>"+devolverNumeroSustantivo(
					val.numCausas,
					"causa",
					"causas")+"</td>"

			+ "<td id='tdacc"
			+ val.gestionAccionMejoraId
			+ "' style='color:"+ propiedad2.color+"'>"+devolverNumeroSustantivo(
					val.numAccionesMejora,
					"acci&oacute;n",
					"acciones")+	 propiedad2.icono+
					"</td>"

			+ "<td id='tdefic"
			+ val.gestionAccionMejoraId
			+ "'>"+pasarDecimalPorcentaje(val.eficacia/100,2)+"</td>"

;
}

function cargarPrimerEstado() {
   var valorResize= 170;
   resizeDivWrapper("wrapper",valorResize);
   //   console.log("Con "+valorResize);
    
   volverDivSolicitudes();
   $("#modalFiltroSolicitud").modal("hide");
	
   numPaginaActual = 1;
   banderaEdicion = false;
   gestionAccionMejoraId = 0;
   causaId = 0;	
   estadoCumpId = 1;
   accionMejoraTipoIdActual = 0;
   hayProceso = false;
   hayCompleto = false;
   hayRetrasado = false;
   huboCambiosAcciones = false;
   
   var palabraClave = $("#buscadorAcciones").val();
		
   if(palabraClave.length == 0){
      palabraClave = null;
   }else{
      palabraClave = ("%"+palabraClave+"%").toUpperCase();
   }
	
   removerBotones();
   crearBotones();
   deshabilitarBotonesEdicion();

   $("#btnNuevo").attr("onclick","javascript:nuevoGestionAccionMejora();");
   $("#btnCancelar").attr("onclick","javascript:cancelarGestionAccionMejora();");
   $("#btnGuardar").attr("onclick","javascript:guardarGestionAccionMejora();");
   $("#btnEliminar").attr("onclick","javascript:eliminarGestionAccionMejora();");
	
   /**** Mostrar botones ****/
   
   $("#fsBotones")
   .append("<button id='btnGenReporte' type='button' class='btn btn-success btn-word' " +
   		   "title='Generar Informe'>" +
	      "<i class='fa fa-file-word-o fa-2x'></i>" +
	   "</button>");  
 	
   $("#fsBotones")
   .append("<button id='btnGenConsolidado' type='button' class='btn btn-success' " +
   		   "title='Ver Consolidado'>" +
	      "<i class='fa fa-table fa-2x'></i>" +
	   "</button>");
   
   $("#fsBotones")
   .append("<button id='btnDescargarConsolidadoSolAccMej' type='button' class='btn btn-excel' " +
   		   "title='Descargar consolidado Solicitud de acciones de mejora' " +
   		   "onclick='descargarConsolidadoSolicitudesAccionesMejora()'>" +
	      "<i class='fa fa-file-excel-o fa-2x'></i>" +
	   "</button>");
 		
   $("#fsBotones")
   .append("<button id='filtroAplicarBuscador' type='button' class='btn btn-success' " +
	           "title='Filtros' onclick='verFiltroSolicitudes()'>" +
	      "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>" +
	   "</button>");
   
   $("#fsBotones")
   .append("<button id='btnActualizarSolAccMej' type='button' class='btn btn-success' " +
	           "title='Regresar al estado inicial la tabla Gestión de solicitudes de mejora.' " +
	           "onclick='reiniciarTablaGestionSolMej()'>" +
	      "<i class='fa fa-refresh fa-2x'></i>" +
	   "</button>");
  	
   $("#btnGenConsolidado").attr("onclick","generarConsolidadoGestionAccion()");
   $("#btnGenReporte").attr("onclick","javascript:generarReporteAccion();");
   $("#btnGenReporte").hide();
	
   var listCausaId = [];
   var causasId = $("#selMulCausaFiltro").val();
   if(causaId != null){
      causasId.forEach(function(val){
         listCausaId.push(parseInt(val));
      });
   }

   var listId = [];
   var ids = $("#selMulResumenFiltro").val();
   if(ids != null){
      ids.forEach(function(val){
         listId.push(parseInt(val));
      });
   }
	
   var listHallazgoId = [];
   var hallazgoId = $("#selMulTipoHallazgoPrincipalFiltro").val();	
   if(hallazgoId != null){
      hallazgoId.forEach(function(val){
	 listHallazgoId.push(parseInt(val));
      });
   }
    
   var listResponsableId = [];
   var responsableId = $("#selMulResponsablePrincipalFiltro").val();
   if(responsableId != null){
      responsableId.forEach(function(val){
         listResponsableId.push(parseInt(val));
      });
   }
	
   var dataParam={
	  idCompany : getSession("gestopcompanyid"),
	  listCausaId: (listCausaId.length==0?null:listCausaId),
	  listId: (listId.length==0?null:listId),
	  listHallazgoId: (listHallazgoId.length==0?null:listHallazgoId),
	  listResponsableId: (listResponsableId.length==0?null:listResponsableId),
	  palabraClave: palabraClave
	         };

   callAjaxPost(URL+'/gestionaccionmejora/solo',dataParam,procesarDataDescargadaPrimerEstado);
	
//   goheadfixedY("#tblAccion","#wrapper")  //Fijar título en tabla con id="tblAccion"
   $("#btnUpload").hide();
}

function procesarDataDescargadaPrimerEstado(data){
   switch(data.CODE_RESPONSE){
      case "05":
	  var list = data.list;
	  listTabla=list;
	  listTablaAux=listTabla;	
	  propiedad1=[];
	  propiedad2=[];
		
	  $("#h2Titulo").html("<a onclick='javascript:cargarPrimerEstado();' href='#'>Solicitud de mejora asociada</a>");
		
		
	  if(getSession("linkCalendarioAccMejoraId")!=null){
	     var indexIpercAux=0;
	     
	     listTabla.every(function(val,index3){
	        if(val.gestionAccionMejoraId==parseInt(getSession("linkCalendarioAccMejoraId"))){
		   numPaginaActual = Math.ceil((index3+1)/(calcularFilasEntrantes()));
		   cambiarPaginaTabla();
		   editarGestionAccionMejora(val.gestionAccionMejoraId,index3);
					
		   if(parseInt(getSession("linkCalendarioTipoAccMejoraId"))==1){
		      showCorreccionInmediata();
		   }else{
		      showAccionMejora();
		   }
					
		   sessionStorage.removeItem("linkCalendarioAccMejoraId");
		   sessionStorage.removeItem("linkCalendarioTipoAccMejoraId");
		   return false;
	        }else{
		   return true;
	        }
	     });
	  }else{
	     cambiarPaginaTabla();
	  }
	  break;
	
      default:
          alert("Ocurrió un error al traer las gestiones acciones de mejoras!");
   }
}

function reiniciarTablaGestionSolMej(){
   $("#buscadorAcciones").val("");
   $("#modalFiltroSolicitud").remove();
   crearFiltroSolicitudes(cargarPrimerEstado);
}

function editarGestionAccionMejora(pgestionaccionMejoraId,index){
   if(!banderaEdicion){
      formatoCeldaSombreableTabla(false,"tblAccion");
      gestionAccionMejoraObj = listTabla[index];
      gestionAccionMejoraObj.index = index;
		
      var pcausaId = listTabla[index].causaId;
      solicitudAccionId = listTabla[index].solicitud.id;
      tipoHallazgoAccionId = listTabla[index].tipoHallazgo.id;
		
      var pestadoCumpId = listTabla[index].estadoId; 
      var priesgoPotId = listTabla[index].riesgoPotencialId; 
      var pdanio = listTabla[index].danio; 
      var priesgoConsecuencia = listTabla[index].riesgoConsecuencia; 
      var peficacia = listTabla[index].eficacia;
		
      var peficaciaMotivo = listTabla[index].eficaciaMotivo; 
      var peficaciaResponsableNombre = listTabla[index].eficaciaResponsableNombre; 
      var peficaciaResponsableMail = listTabla[index].eficaciaResponsableMail;
      var pDeclaracionCierre = listTabla[index].declaracionCierre;
      var pEficaciaFecha = listTabla[index].fechaCierre;
      var fechaInputCierre = convertirFechaInput(pEficaciaFecha);
		
      gestionAccionMejoraId = pgestionaccionMejoraId;	
      estadoCumpId = listTabla[index].estadoId;		
      causaId = pcausaId;	
      estadoCumpId = pestadoCumpId;

      var name = $("#tdres"+gestionAccionMejoraId).text();
      $("#tdres"+gestionAccionMejoraId).html(
         "<textarea type='text' id='inputRes' class='form-control' placeholder='Resumen' rows='2'>"+name+"</textarea>");
//    var responsable=listTabla[index].responsable;
//    $("#tdrespo"+gestionAccionMejoraId).html("<input class='form-control' id='inputRespSolicituMejora'>");
//    $("#inputRespSolicituMejora").val(gestionAccionMejoraObj.responsable);
      listResponsableSolicitud.forEach(function(val){
         val.selected = 0;
			
         if(val.trabajadorId == gestionAccionMejoraObj.responsableId){
	    val.selected = 1;
         }
      });
      
      var selTrabajadorAux =crearSelectOneMenuObligUnitarioCompleto("selTrabSolicitud","",
	 listResponsableSolicitud,"trabajadorId","trabajadorNombre","#tdrespo"+gestionAccionMejoraId,"Trabajador ...")
		
      $("#tdasoc"+gestionAccionMejoraId).html(
         "<a href='#' onclick='javascript:showItemAsoc();'>"+$("#tdasoc"+gestionAccionMejoraId).html()+"</a>");
      
      $("#tdcorr"+gestionAccionMejoraId).html(
         "<a href='#' onclick='javascript:showCorreccionInmediata();'>"+$("#tdcorr"+gestionAccionMejoraId).html()+"</a>");
      
      if(pcausaId != 3){
         $("#tdanali"+gestionAccionMejoraId).html(
            "<a href='#' onclick='javascript:showAnalisisCausa();'>"+$("#tdanali"+gestionAccionMejoraId).html()+"</a>");
         
         $("#tdacc"+gestionAccionMejoraId).html(
            "<a href='#' onclick='javascript:showAccionMejora();'>"+$("#tdacc"+gestionAccionMejoraId).html()+"</a>");
         
         $("#tdefic"+gestionAccionMejoraId).html(
            "<a href='#' onclick='javascript:showEficacia();'>"+$("#tdefic"+gestionAccionMejoraId).html()+"</a>");
      }else{
         $("#tdanali"+gestionAccionMejoraId).html("Restringido");
			
         $("#tdacc"+gestionAccionMejoraId).html("Restringido");
			
         $("#tdefic"+gestionAccionMejoraId).html("Restringido");	
      }
		
      /* ************************************************************************** */
      var selCausa = crearSelectOneMenu("selCausa","",listCausa,causaId,"causaId","causaNombre");

      $("#tdcausa"+gestionAccionMejoraId).html(selCausa);
      /*
      var slcTipoSoli = crearSelectOneMenuOblig("slcTipoSoli", "", listSolicitud, solicitudAccionId,
	 "id", "nombre");
      $("#tdsoli" + gestionAccionMejoraId).html(slcTipoSoli);
      */
      $("#selCausa").attr("onChange","javascript:onchangeCmbCausa();");
		
      var selTipoHallazgo = crearSelectOneMenuOblig("selTipoHallazgo","",
	 listTipoHallazgo,tipoHallazgoAccionId,"id","nombre");
		
      $("#tdHallazgo" + gestionAccionMejoraId).html(selTipoHallazgo);
		
      /** *************RIESGO************** */
      var selRiesgoPot = crearSelectOneMenu("selRiesgoPot","",
	 listRiesgoPotencial,priesgoPotId,"riesgoPotencialId","riesgoPotencialNombre");
		
      $("#tdRieSelPot").html(selRiesgoPot);

      $("#inputRieCon").val(priesgoConsecuencia);
      $("#inputRieDan").val(pdanio);

      /** *************EFICACIA************** */
      $("#inputEficPorc").val(peficacia);
      $("#inputEficMot").val(peficaciaMotivo);
      $("#inputEficResNom").val(peficaciaResponsableNombre);
      $("#inputEficResMail").val(peficaciaResponsableMail);
      $("#inputEficFecha").val(fechaInputCierre);
      $("#inputDeclaracionCierre").val(pDeclaracionCierre);	
      // 
      var options={
         container: "#tdEfiEvi",
         functionCall: function(){},
         descargaUrl: "/gestionaccionmejora/evidencia?gestionAccionMejoraId="+gestionAccionMejoraId,
         esNuevo: false,
         idAux: "EficaciaSolicitud",
         evidenciaNombre: gestionAccionMejoraObj.evidenciaNombre
      };
		
      crearFormEvidenciaCompleta(options);
      //
      var options1={
	 container: "#tdValidEvi",
	 functionCall: function(){},
	 descargaUrl: "/gestionaccionmejora/evidencia/validacion?gestionAccionMejoraId="+gestionAccionMejoraId,
	 esNuevo: false,
	 idAux: "ValidacionSolicitud",
	 evidenciaNombre: gestionAccionMejoraObj.evidenciaValidacionNombre
      };
		
      crearFormEvidenciaCompleta(options1);
      //
      $("#inputValidFecha").val(convertirFechaInput(gestionAccionMejoraObj.fechaValidacion));
			
      banderaEdicion = true;
      habilitarBotonesEdicion();
      $("#btnGenReporte").show();$("#btnGenConsolidado").hide();
   }
	
   $("#inputEficResNom").val(gestionAccionMejoraObj.eficaciaResponsableNombre);
   verAutoCompletarTrab();
   $("#selAutoTrabajador").val(gestionAccionMejoraObj.trabajadorId);
}

function nuevoGestionAccionMejora() {
	if (!banderaEdicion) {
		var selCausa = crearSelectOneMenuOblig("selCausa", "", listCausa, "-1",
				"causaId", "causaNombre");
		var selTipoHallazgo = crearSelectOneMenuOblig("selTipoHallazgo", "", listTipoHallazgo, "-1",
				"id", "nombre");
		var selEstado = crearSelectOneMenu("selEstado", "", listEstado, "-1",
				"estadoCumpId", "estadoCumplientoNombre");
	/*	var slcTipoSoli = crearSelectOneMenuOblig("slcTipoSoli", "", listSolicitud, "-1",
				"id", "nombre"); */
		gestionAccionMejoraId = 0;
		$("#tblAccion tbody")
				.prepend(
						"<tr id='nuevotrgest0'>"
								+ "<td>...</td>"
								+ "<td>"
								+ selCausa
								+ "</td>"
								+ "<td>"+selTipoHallazgo+" </td>"
								+ "<td>...</td>"
					      /*    + "<td>"
								+ slcTipoSoli
								+ "</td>" */    
								+ "<td><textarea type='text' id='inputRes' class='form-control' placeholder='Resumen' rows='2'></textarea>"
								+ "</td>"
								+"<td id='tdrespo0'> "+"  "+"</td>"
								
								+ "<td>...</td>" + "<td>...</td>"
								+ "<td>...</td>" + "<td>...</td>"  + "</tr>");
		listResponsableSolicitud.forEach(function(val){
			val.selected=0;
		})
		
                var selTrabajadorAux =crearSelectOneMenuObligUnitarioCompleto("selTrabSolicitud", "", listResponsableSolicitud, "trabajadorId", 
		"trabajadorNombre","#tdrespo"+gestionAccionMejoraId,"Trabajador ...")
		habilitarBotonesNuevo();
		banderaEdicion = true;
		formatoCeldaSombreableTabla(false,"tblAccion");
		
		estadoCumpId= 1;
			
	} else {
		alert("Guarde primero.");
	}
}
function generarConsolidadoGestionAccion(){
    
   var valorResize= 160;
   resizeDivWrapper("wrapperConsolidado",valorResize);
    
   $("#divGeneralSolicitud .container-fluid").hide();
   $("#divConsolidadoGestionAccion").show();
   $("#modalFiltroSolicitudConsolidado").modal("hide");
   $("#divGeneralSolicitud h2").html("<a onclick='volverDivSolicitudes();'>Gestión de solicitudes de mejora</a> > Consolidado");
  
    var listHallazgoId = [];
	var hallazgoId = $("#selMulTipoHallazgoFiltro").val();
	if(hallazgoId != null){
	    hallazgoId.forEach(function(val){
		listHallazgoId.push(parseInt(val));
	    });
	}
    
    var listResponsableId = [];
	var responsableId = $("#selMulResponsableFiltro").val();
	if(responsableId != null){
	    responsableId.forEach(function(val){
		listResponsableId.push(parseInt(val));
	    });
	}
	
    var listOrigenId = [];
    var origenId = $("#selMulOrigenFiltro").val();
	if(origenId != null){
           origenId.forEach(function(val){
	   listOrigenId.push(parseInt(val));
           });
	}

    var listResponsableAccMejId = [];
    var responsableAccMejId = $("#selMulResponsableAccMejFiltro").val();
	if(responsableAccMejId != null){
	   responsableAccMejId.forEach(function(val){
	   listResponsableAccMejId.push(parseInt(val));
	   });
        }

    var listEstadoCumplimientoId = [];
    var estadoCumplimientoId = $("#selMulEstadoCumplimientoFiltro").val();
	if(estadoCumplimientoId != null){
	   estadoCumplimientoId.forEach(function(val){
	   listEstadoCumplimientoId.push(parseInt(val));
	   });
        }
	
    var dataParam = {
	    idCompany  : getSession("gestopcompanyid"),
	    listHallazgoId : (listHallazgoId.length==0?null:listHallazgoId),
	    listResponsableId : (listResponsableId.length==0?null:listResponsableId),
	    listOrigenId : (listOrigenId.length==0?null:listOrigenId),
    	    listResponsableAccMejId : (listResponsableAccMejId.length==0?null:listResponsableAccMejId),
            listEstadoCumplimientoId : (listEstadoCumplimientoId.length==0?null:listEstadoCumplimientoId),
            fechaInicioPresentacion:$("#fechaInicioEventoCons").val(),
	    fechaFinPresentacion:$("#fechaFinEventoCons").val()};
    
    callAjaxPost(URL+"/gestionaccionmejora/consolidado",dataParam,function(data){
	$("#tblConsolidadoAcc tbody tr").remove();
	data.list.forEach(function(val){
	    var textObs = "";
	    if(val.solicitud.causaId == 12 ||
		    val.solicitud.causaId == 13){
		textObs = "<br><label style='color : red'>"+val.solicitud.hallazgoDetalle+"</label>";
	    }
	   $("#tblConsolidadoAcc tbody").append("<tr>" +
	   		"<td>"+val.solicitud.causaNombre+"</td>" +
	   		"<td>"+val.detalleSolicitud.fechaInicioTexto+"</td>" +
	   		"<td>"+val.solicitud.hallazgo+textObs+"</td>" +
	   		"<td>"+val.solicitud.tipoHallazgo.nombre+"</td>" +
	   		"<td>"+val.solicitud.resumen+"</td>" +
	   		"<td>"+val.solicitud.responsable+"</td>" +

	   		"<td>"+val.descripcion+"</td>" +
	   		"<td>"+val.tipoAccionNombre+"</td>" +
	   		"<td>"+val.clasificacion.nombre+"</td>" +
	   		"<td>"+val.responsableNombre+"</td>" +
	   		"<td>"+val.fechaRevisionTexto+"</td>" +
	   		"<td>"+val.fechaRealTexto+"</td>" +
	   		"<td>"+val.estado.nombre+"</td>" +
	   		"<td>"+val.observacion+"</td>" +
	   		"<td>"+val.evidenciaNombre+"</td>" + 
	   		
	   		"" +
	   		"") 
	});

	goheadfixedY("#tblConsolidadoAcc","#wrapperConsolidado") //Fijar título en tabla con id="tblConsolidadoAcc"
    });
}

function cancelarGestionAccionMejora() {
   banderaEdicion = false;
   
   removerBotones();
   crearBotones();
   deshabilitarBotonesEdicion();
	
   $("#btnNuevo").attr("onclick", "javascript:nuevoGestionAccionMejora();");
   $("#btnCancelar").attr("onclick","javascript:cancelarGestionAccionMejora();");
   $("#btnGuardar").attr("onclick", "javascript:guardarGestionAccionMejora();");
   $("#btnEliminar").attr("onclick","javascript:eliminarGestionAccionMejora();");
        
   $("#fsBotones")
   .append("<button id='btnGenReporte' type='button' class='btn btn-success btn-word' " +
   		   "title='Generar Informe'>" +
	      "<i class='fa fa-file-word-o fa-2x'></i>" +
	   "</button>");
        
   $("#fsBotones")
   .append("<button id='btnGenConsolidado' type='button' class='btn btn-success' " +
   		   "title='Generar Informe'>" +
	      "<i class='fa fa-table fa-2x'></i>" +
	   "</button>");
   
   $("#fsBotones")
   .append("<button id='btnDescargarConsolidadoSolAccMej' type='button' class='btn btn-excel' " +
   		   "title='Descargar consolidado Solicitud de acciones de mejora' " +
   		   "onclick='descargarConsolidadoSolicitudesAccionesMejora()'>" +
	      "<i class='fa fa-file-excel-o fa-2x'></i>" +
	   "</button>");
        
   $("#fsBotones")
   .append("<button id='filtroAplicarBuscador' type='button' class='btn btn-success' " + 
        	   "title='Filtros' onclick='verFiltroSolicitudes()'>" +
	      "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>" +
	   "</button>");
        
   $("#fsBotones")
   .append("<button id='btnActualizarSolAccMej' type='button' class='btn btn-success' " +
     	           "title='Regresar al estado inicial la tabla Gestión de solicitudes de mejora.' " +
     	           "onclick='reiniciarTablaGestionSolMej()'>" +
     	      "<i class='fa fa-refresh fa-2x'></i>" +
     	   "</button>");
        
   $("#btnGenConsolidado").attr("onclick","generarConsolidadoGestionAccion()")
   formatoCeldaSombreableTabla(true,"tblAccion");

   $("#btnGenReporte").attr("onclick","javascript:generarReporteAccion();");
   $("#btnGenReporte").hide();
   $("#FitroAplicarBuscador").hide();
   $("#nuevotrgest0").remove();
   //cargarPrimerEstado();
	
   if(gestionAccionMejoraId==0){
		
   }else{
      var dataParam={
	     gestionAccionMejoraId : gestionAccionMejoraId
		    };

      callAjaxPost(URL+'/gestionaccionmejora/id',dataParam,function(data){
         var gestionObj = data.list;
         var listFinal = [];
			
         listTabla.forEach(function(val){
	    if(val.gestionAccionMejoraId == gestionObj.gestionAccionMejoraId){
	       listFinal.push(gestionObj)
	    }else{
	       listFinal.push(val)
	    }
         });
			
         listTabla = listFinal
	 $("#tr"+gestionObj.gestionAccionMejoraId)
         .html(agregarFilaGestionAccion(gestionObj,gestionAccionMejoraObj.index))

         gestionAccionMejoraId = 0;
      });
   }	
}

function eliminarGestionAccionMejora() {
	var r = confirm("¿Está seguro de eliminar la Solicitud de Mejora?");
	if (r == true) {
		var dataParam = {
			gestionAccionMejoraId : gestionAccionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/delete', dataParam,
				procesarResultadoEliminarGestionAccionMejora);
	}
}

function procesarResultadoEliminarGestionAccionMejora(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarPrimerEstado();
		break;
	default:
		alert("Verificar que el registro de solicitud de acción de mejora" +
				" no tenga registrado acciones inmediatas, análisis causa o acciones de mejora");
	}
}

function guardarGestionAccionMejora() {
   var campoVacio = true;
   
   var selCausa = $("#selCausa option:selected").val();
   var selRiePot = $("#selRiesgoPot option:selected").val();
   var inputRes = $("#inputRes").val();
   var inputRieCon = $("#inputRieCon").val();
   var inputRieDan = $("#inputRieDan").val();
   var inputEficPorc = $("#inputEficPorc").val();
   var inputEficMot = $("#inputEficMot").val();
   var inputEficResNom = $("#inputEficResNom").val();
   var inputEficResMail = $("#inputEficResMail").val();
   var inputDeclaracion = $("#inputDeclaracionCierre").val();
   var responsable = $("#inputRespSolicituMejora").val();
   var tipoSolicitudId = $("#slcTipoSoli").val();
   var tipoHallazgoId = parseInt($("#selTipoHallazgo").val());
   var trabId = parseInt($("#selAutoTrabajador").val());
   var responsableId = $("#selTrabSolicitud").val();
   var inputEficFecha = convertirFechaTexto($("#inputEficFecha").val()); 
   var inputValidFecha = convertirFechaTexto($("#inputValidFecha").val());
	
   if(huboCambiosAcciones){
      if(hayRetrasado){
	 estadoCumpId = 3;
      }else{
         if(hayProceso){
	    estadoCumpId = 1;
         }else{
	    if(hayCompleto){
	       estadoCumpId = 2;
	    }
         }
      }
   }

   if(selCausa == '-1' || inputRes.length == 0 ||tipoSolicitudId == "-1"){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
	     gestionAccionMejoraId: gestionAccionMejoraId,
	     responsableId: responsableId,
	     resumen: inputRes,
	     responsable: responsable,
	     causaId: selCausa,
	     solicitud: {id: tipoSolicitudId},
	     tipoHallazgo: {id: tipoHallazgoId},
	     riesgoConsecuencia: inputRieCon,
	     danio: inputRieDan,
	     riesgoPotencialId: selRiePot,
	     eficaciaTrabajadorId: trabId,
	     eficacia: inputEficPorc,
	     eficaciaMotivo: inputEficMot,
	     eficaciaResponsableNombre: inputEficResNom,
	     eficaciaResponsableMail: inputEficResMail,
	     estadoId: estadoCumpId,
	     fechaCierre: inputEficFecha,
	     fechaValidacion: inputValidFecha,
	     declaracionCierre: inputDeclaracion,
	     idCompany: getSession("gestopcompanyid")
		    };

      callAjaxPost(URL+'/gestionaccionmejora/save',dataParam,
		   procesarResultadoGuardarGestionAccionMejora);
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function guardarEficaciaGestionAccion(){
   var campoVacio = true;
   
   var selCausa = $("#selCausa option:selected").val();
   var selRiePot = $("#selRiesgoPot option:selected").val();
   var inputRes = $("#inputRes").val();
   var inputRieCon = $("#inputRieCon").val();
   var inputRieDan = $("#inputRieDan").val();
   var inputEficPorc = $("#inputEficPorc").val();
   var inputEficMot = $("#inputEficMot").val();
   var inputEficResNom = $("#inputEficResNom").val();
   var inputEficResMail = $("#inputEficResMail").val();
	
   var inputDeclaracion = $("#inputDeclaracionCierre").val();
   var responsable = $("#inputRespSolicituMejora").val();
   var tipoSolicitudId = $("#slcTipoSoli").val();
        
   var trabId = parseInt($("#selAutoTrabajador").val());

   var inputEficFecha = convertirFechaTexto($("#inputEficFecha").val()); 
   var fechaValidacion = convertirFechaTexto($("#inputValidFecha").val());
   
   var eviNombreCierre = $("#inputEviEficaciaSolicitud").val();

   if(huboCambiosAcciones){
      if(hayRetrasado){
         estadoCumpId = 3;
      }else{
	 if(hayProceso){
	    estadoCumpId = 1;
	 }else{
	    if(hayCompleto){
	       estadoCumpId = 2;
	    }
	 }
      }
   }
   
   if(selCausa == '-1' || inputRes.length == 0 || tipoSolicitudId == "-1"){
      campoVacio = false;
      mensajeUx = "<label>Debe ingresar todos los campos.</label>";
   }else if(inputEficFecha != null && eviNombreCierre.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe subir la evidencia de cierre porque " +
         "ingresó la Fecha de cierre.</label>";
      $("#inputEviEficaciaSolicitud").focus();
   }

   if(campoVacio){
      var dataParam={
         gestionAccionMejoraId: gestionAccionMejoraId,resumen: inputRes,responsable: responsable,
         causaId: selCausa,solicitud: {id: tipoSolicitudId},riesgoConsecuencia: inputRieCon,
	 danio: inputRieDan,riesgoPotencialId: selRiePot,eficaciaTrabajadorId: trabId,
	 eficacia: inputEficPorc,eficaciaMotivo: inputEficMot,eficaciaResponsableNombre: inputEficResNom,
	 eficaciaResponsableMail: inputEficResMail,estadoId: estadoCumpId,fechaCierre: inputEficFecha,
	 fechaValidacion: fechaValidacion,declaracionCierre: inputDeclaracion,idCompany: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/gestionaccionmejora/save',dataParam,function(data){
         guardarEvidenciaAuto(gestionAccionMejoraId,"fileEviEficaciaSolicitud",512000,
         "/gestionaccionmejora/evidencia/save",function(){
            guardarEvidenciaAuto(gestionAccionMejoraId,"fileEviValidacionSolicitud",512000,
            "/gestionaccionmejora/evidencia/validacion/save",function(){
	       $.unblockUI();
	       $("#modalEf").show();
            });
         },"gestionAccionMejoraId");
			
         $("#mdEfic").modal("hide");
	 $("#tdefic"+gestionAccionMejoraId).find("a").html(pasarDecimalPorcentaje(inputEficPorc/100,2));
      });
   }else{
      $("#mdEfic").modal("hide");
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposEficVistaAdm");

      $("#modalMensajeUxAvisoCompletarCamposEficVistaAdm").on("hidden.bs.modal",function(){
         $("#mdEfic").modal("show");
      });
   }
}

function procesarResultadoGuardarGestionAccionMejora(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if(gestionAccionMejoraId==0){
			callAjaxPost(URL + '/gestionaccionmejora/id', {gestionAccionMejoraId:data.nuevoId},
					function(data){
				var gestionObj=data.list;
				var listFinal=[gestionObj];
				 
				listTablaAux=listFinal.concat(listTablaAux);
				listTabla=listFinal.concat(listTabla);
				
				cancelarGestionAccionMejora();
				numPaginaActual=1;
				cambiarPaginaTabla();
			})
		}else{
			cancelarGestionAccionMejora();
		}		
		
		break;
	default:
		alert("Ocurrió un error al guardar la Gestion accion Mejora!");
	}
}

function showItemAsoc() {
	$('#mdItemAsoc').modal('show');
}

$('#mdItemAsoc').on('show.bs.modal', function(e) {
	var dataParam = {
			gestionAccionMejoraId : gestionAccionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/detalle', dataParam,
				procesarDataListadoDetalleAsociados);
});

function procesarDataListadoDetalleAsociados(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;

		$("#tblItemAsoc tbody tr").remove(); 
		var nro = 0;
		for (index = 0; index < list.length; index++) {
			nro++;
			var btnEliminar="<button class='btn btn-danger' style='padding:5px' onclick='eliminarDetalleAsociado("+list[index].detalleGestAccionMejoraId+")'>" +
			"<i class='fa fa-times' aria-hidden='true'></i></button>";
			;
			var btnDescargaCausa="";
			if(list[index].evidenciaNombre!=null){
				btnDescargaCausa="<a class='btn-success btn' " +
						"href='"+URL+"/gestionaccionmejora/detalle/evidencia?id="+list[index].detalleGestAccionMejoraId+"' " +
								"target='_blank' >Descargar Evidencia</a>";
			}else{
				btnDescargaCausa="Sin evidencia"
			}
			$("#tblItemAsoc tbody")
					.append(
							"<tr id='tr"
									+ list[index].detalleGestAccionMejoraId
									+ "'>"

									+ "<td id='tdmod"
									+ list[index].detalleGestAccionMejoraId + "'>"
									+ list[index].moduloNombre + "</td>"

									+ "<td id='tdres"
									+ list[index].detalleGestAccionMejoraId + "'>"
									+ list[index].categoriaNombre + "</td>"

									+ "<td id='tddetalle"
									+ list[index].detalleGestAccionMejoraId
									+ "'>"+ list[index].detalleNombre +"</td>"
									+ "<td id='tdcorr"
									+ list[index].detalleGestAccionMejoraId
									+ "'>"+ list[index].observacion +"</td>"
									+ "<td id='tdest"
									+ list[index].detalleGestAccionMejoraId + "'>"
									+ list[index].fechaInicioTexto
									+ "</td>"
									+ "<td >"
									+ btnDescargaCausa
									+ "</td>"
									+ "<td >"
									+ btnEliminar
									+ "</td>"
									+ "</tr>");	$("#tddetalle"+ list[index].detalleGestAccionMejoraId).css({"text-align":"left"});
		}
	
		
		break;
	default:
		alert("Ocurrió un error al traer los items asociados!");
	}	
}
function eliminarDetalleAsociado(idItem){
	var r=confirm("¿Desea eliminar este item asociado?");
	if(r){
		callAjaxPost(URL + '/gestionaccionmejora/detalle/delete', {detalleGestAccionMejoraId:idItem},
				showItemAsoc);
	}
}

function showCorreccionInmediata() {
	$("#mdCorrInmediataLabel").text("Acción Inmediata / Mitigación");
	var band = $("#selCausa option:selected").val();
	if(band > -1){
		accionMejoraTipoIdActual = 1;
		$('#mdCorrInmediata').modal('show');	

		cargarModalAccionInmediata();
	}
} 

function showAccionMejora() {
   $("#mdCorrLabel").text("Acción de Mejora");
   var band = $("#selCausa option:selected").val();
	
   if(band > -1){
      accionMejoraTipoIdActual=-1;
      listTipoAccionMejoraDepurado = listTipoAccionMejora;
		
      if(band == 2){
         var index = listTipoAccionMejora.indexOf(3);
         listTipoAccionMejoraDepurado.splice(index-1,1);
      }
		
      if(band == 4){
         var index = listTipoAccionMejora.indexOf(3);
         listTipoAccionMejoraDepurado = listTipoAccionMejoraDepurado.splice(index,1);
      }
		
      $('#mdCorr').modal('show');	

      cargarModalAccionMejora();
   }
}

$('#mdCorr').on('show.bs.modal', function(e) {
	$("#modalAcc").show();
	$("#modalAccUpload").hide();
});

$('#mdCorrInmediata').on('show.bs.modal', function(e) {
	$("#modalAcc").show();
	$("#modalAccInmediataUpload").hide();
});

function showAnalisisCausa() {
	$('#mdAnalCau').modal('show');
}

$('#mdAnalCau').on('show.bs.modal', function(e) {
	$("#modalAn").show();
	$("#modalAnUpload").hide();
	cargarModalAnalisisCausa();
});

function showEficacia(){
   $("#modalEf").show();
   $("#modalEfUpload").hide();
   $('#mdEfic').modal('show');
}


function onchangeCmbCausa(){
	var band = $("#selCausa option:selected").val();
	
	if(band != 3){
		$("#tdanali" + gestionAccionMejoraId)
		.html(
				"<a href='#' onclick='javascript:showAnalisisCausa();'>Agregar</a>");
		$("#tdacc" + gestionAccionMejoraId)
		.html(
				"<a href='#' onclick='javascript:showAccionMejora();'>Agregar</a>");
		$("#tdefic" + gestionAccionMejoraId).html(
				"<a href='#' onclick='javascript:showEficacia();'>Agregar</a>");
	} else {
		$("#tdanali" + gestionAccionMejoraId)
		.html(
				"Restringido");
		$("#tdacc" + gestionAccionMejoraId)
		.html(
				"Restringido");
		$("#tdefic" + gestionAccionMejoraId).html(
				"Restringido");	
	}
}


function devolverNumeroSustantivo(numero,singular,plural){
	if(numero==1){
		return numero +" "+singular;
	}
	if(numero==0){
		return "No hay "+plural;
	}
	if(numero>1){
		return numero +" "+plural;
	}
}

function estadoAccion(numRetrasados, numImplementar, numCompletados) {
	var color = "";
	var icono = "";
	var propiedades;
	var mensaje = "";
	var totalAcciones=numRetrasados+numImplementar+numCompletados;
	mensaje = "<br>";
	
	
	

	if (numImplementar > 0 && numRetrasados == 0) {
		mensaje = devolverNumeroSustantivo( numImplementar,"acci&oacuten","acciones") ;
		color = "#FF8000";

		icono = ' <i class="fa fa-eye"></i>';
	
		
	}

	if (numRetrasados > 0) {
		mensaje = devolverNumeroSustantivo( numRetrasados,"acci&oacuten","acciones") ;
		icono = ' <i class="fa fa-exclamation-circle"></i>';
		color = "red";
		

	}

	if (numRetrasados == 0 && numImplementar == 0 && numCompletados > 0) {
		color = "green";
		mensaje = devolverNumeroSustantivo( numCompletados,"acci&oacuten","acciones") ;
		icono = ' <i class="fa fa-check-square"></i>';
		
	}
	
	mensaje="<h5 style='color:"+color+";font-weight:bold'>"
	+devolverNumeroSustantivo( totalAcciones,"acci&oacuten","acciones")+" "+icono+"</h5>"
	
	propiedades = {
		color : color,
		icono : icono,
		mensaje : mensaje
		
	}
	
	return propiedades

}


function generarReporteAccion(){
	var tienePermisoReporte=true;
	if(tienePermisoReporte){
		window.open(URL
				+ "/gestionaccionmejora/informe?gestionAccionId="
				+ gestionAccionMejoraId 
				+ '');	
	}else{
		alert("Faltan cmapos de registro ")
		
	}

}

function verAutoCompletarTrab(){
	var nombre = $("#inputEficResNom").val().trim();
	
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin asignar",correo:"Sin asignar"
			})
			
		}
		listTrabajadoresCapacitacion= data.trabajadores;
		
		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador", 
				"verAutoCorreoAsignado()", data.trabajadores, "trabajadorId","nombre",
				"#divAutoCompletarTrabEfi","");
		
	        verAutoCorreoAsignado();
		
		$("#inputEficResNom")
		.attr("onkeyup","verAutoCompletarTrab()");
		
	});
}

function verAutoCorreoAsignado(){
        
	var trabId = parseInt($("#selAutoTrabajador").val());
	listTrabajadoresCapacitacion.forEach(function(val){
		if(val.trabajadorId == trabId){
			$("#inputEficResMail").val(val.correo)
		}
	})
}

function copiarTablaConsolidadoAccMej(){
   var list=obtenerDatosTablaEstandar("tblConsolidadoAcc");
   
   copiarAlPortapapeles(list,"btnClipTablaConsolidado");
   alert("Se han guardado los datos al Clipboard");
}

function descargarConsolidadoSolicitudesAccionesMejora(){
   window.open(URL+"/gestionaccionmejora/excel/consolidado_solicitudes_acciones_mejora?" +
   	       "empresaId="+getSession("gestopcompanyid"));
}
