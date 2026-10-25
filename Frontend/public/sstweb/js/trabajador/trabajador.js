
var banderaEdicion;
var trabajadorId;
var positionId;
var sangreTipoId;
var generoId;
var listPosition;var listDivisiones;
var listSite;
var listSangre;
var listGenero;
var listDiscapacidad;
var fechaIngreso;
var fechaRetiro;
var fechaNacimiento;
var tipoDiscapacidad;
var tipoDuracionTrab;
var nroNuevoTrabajador;
var mensajeUx;
var listTrabajadores,listTrabajadoresActivos;
var listFullTrabajadores=[],listFullTrabajadoresBuscador=[];
var indicadoresSeguridad;
var contadorListTrab;
var listDuracion;
var listFullIndicadoresTrabajadores=[];
var listFullIndicadoresTrabajadoresAux=[];
var accesoGarantizado = false;
var passwordTrabajador;
var fechaUltimaActClaveTexto;

var listAreasId=[],listPuestosId=[];
var trabajadorObj = {};
var busquedaActiva;

$(document).ready(function() {
    insertMenu(function(){
       crearFiltroTrabajador(valoresFiltroTrabajador);
    });

   $('#mdEvent').on('show.bs.modal',function(e){
      cargarModalEvent();
      var trabNombre = $("#inputNom").val();
				
      $("#mdEvent .modal-title").html(
         "Informe resumen de actividades relacionadas la Seguridad y Salud en el Trabajo de '" +
	 trabNombre+"' al "+obtenerFechaActualNormal());
   });
	
   $("#txtListado").on("paste",function(){
      var textoPasted = window.clipboardData.getData('Text');
      $(this).val(textoPasted.substring(0,textoPasted.length - 1));
   });

    $("#flechaIzquierdaTrabPrincipal").on('click',function(){
        numPaginaActual = numPaginaActual-1;
        cambiarPaginaTrabajador();
    });

    $('#flechaDerechaTrabPrincipal').on('click',function(){
        numPaginaActual = numPaginaActual+1;
        cambiarPaginaTrabajador();
    });
	
   if(getSession("linkCalendarioGrupoId") != null){ 
      programarFecha(); 
   }
	
   listFullIndicadoresTrabajadores = [];

    if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 0){
        $("#btnNuevoTrabajador").remove();$("#btnGrupoTrabajador").remove();$("#btnUpload").remove();
        $("#btnSmartUpload").remove();$("#btnEliminar").remove();$("#btnRetiroTrabajadores").remove();
        $("#btnReportExcel").remove();$("#btnCambiarPuestoTrabs").remove();$("#btnConfigurarHoras").remove();
    }else if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){
        accesoGarantizado = true;
    }

    if(parseInt(getSession("gestopcompanyid")) == 524){//ISEG
        document.querySelector('#idCambioNomArea').innerText = "Área 1";
        document.querySelector('#idCambioNomPueTra').innerText = "Área 2";
        document.querySelector('#idCambioNomJorLab').innerText = "Tipo de planilla";
    }

    if(parseInt(getSession("gestopcompanyid")) == 647){//Inkacrops
        $("#columnaTipoSangreTrab").hide();$("#columnaSiteTrab").hide();$("#columnaUltimoExamenTrab").hide();
        $("#columnaRestriccionsMedicasTrab").hide();$("#columnaDiscapacidadLaboralTrab").hide();$("#columnaObsGeneralesTrab").hide();
        $("#columnaDeclaracionCovidTrab").hide();$("#columnaValidacionDniTrab").hide();$("#columnaValidado").hide();
        $("#columnaFechaValidado").hide();
    }else if(parseInt(getSession("actPlanillaTrabAuto")) == 1){
        $("#columnaContraseniaTrab").hide();$("#columnaClaveAccesoTrab").hide();$("#columnaFechaUltActTrab").hide();
    }
});

function llamarIndicadores(){
   var listTrabajadores = [];
	
   listFullTrabajadores.forEach(function(val,index){ 
      listTrabajadores.push(val.trabajadorId);
   });
	
   var dataParam={
      mdfId: getUrlParameter("mdfId"),
      listTrabajadorId: listTrabajadores
   }; 
	
   if(getSession("trabajadorGosstId") > 0){
      dataParam={
         trabajadorId: getSession("trabajadorGosstId")
      };
   }
	 
   callAjaxPostNoLoad(URL+'/trabajador/puntajes',dataParam,procesarPuntajesSeguridadTrabajadores,function(){
      listFullTrabajadores.forEach(function(val,index){ 
         $("#tr"+val.trabajadorId).find("#tdprom").html("Loading...");
      });
   });
}

var listOpcionImport=[
    {id:0,nombre:"Todos"},{id:1,nombre:"Registrar trabajador(es)"},{id:2,nombre:"Actualizar trabajador(es)"},
    {id:3,nombre:"Reincorporar trabajador(es)"},{id:4,nombre:"Retirar trabajador(es)"}
];

function ocultarSmartImportTrabajador(){
    $("#divImportTrabajador").modal("hide");
}

function verSmartImportTrabajador(){
    $("#divImportTrabajador").remove();

    var textBackUp =
       "<a class='efectoLink' href='"+URL+"/trabajador/backup?empresaId="+getSession("gestopcompanyid")+"' target='_blank'>" +
           "<i class='fa fa-download'></i> Descargar" +
       "</a>";
   
    var textPlantilla =
        "<a class='efectoLink' href='"+URL+"/trabajador/backup/plantilla' target='_blank'>" +
            "<i class='fa fa-download'></i> Descargar" +
        "</a>";
   
    var selOpcionImport = crearSelectOneMenuOblig("selOpcionImport","textoDetalleImport()",
        listOpcionImport,1,"id","nombre");
	
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Lista Backup ",inputForm:textBackUp,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Plantilla ",inputForm:textPlantilla,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Opción import*",inputForm:selOpcionImport},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Detalle(s)*",inputForm:"",divContainer:"idDetalleTextoImport"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Archivo Excel",inputForm:"",divContainer:"divExcelImport"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' onclick='ocultarSmartImportTrabajador()' style='font-size:18px;'>" +
                 "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
       		         "<i class='fa fa-floppy-o'></i> Guardar" +
                 "</button>",divContainer:""}
   ];
	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		       	
   var contenido =
      "<form id='formImportEvento' class='eventoGeneral'>" +
         "<div id='tituloEvento'>"+text+"</div>" +
      "</form>";  
		       	
   var listPaneles={
      id:"divImportTrabajador",nombre:"Actualizar trabajadores (import)",clase:"listaAuxiliar",contenido:contenido
   };

    crearModalPrincipalUsuario(listPaneles,function(){
        var options={
	        container: "#divExcelImport",functionCall: function(){},descargaUrl: "",esNuevo: true,
	        idAux: "ImportExcel",evidenciaNombre: ""
        };
			
        crearFormEvidenciaCompleta(options);
    },true,true);
   
   textoDetalleImport();
		
   $("#formImportEvento").on("submit",function(e){
      e.preventDefault();
      confirmacionSmartImportTrabajador();
   });
}

function textoDetalleImport(){
   var opcionId = parseInt($("#selOpcionImport").val());   
   var textoDetalle;
   
   if(opcionId == 1){
      textoDetalle = 
         "<label style='color:blue'>" +
            "*En el archivo excel, deben incluirse SOLO los registros de nuevos trabajadores que " +
            "se añadirán a la lista actual (en caso de incluir registros de trabajadores ya " +
            "existentes, no serán considerados en el proceso)." +
         "</label>" +
         "<label style='color:blue'>*El estado de trabajador será 'Nuevo'.</label>";
   }else if(opcionId == 2){
      textoDetalle = 
	 "<label style='color:blue'>" +
            "*En el archivo excel, deben incluirse SOLO los registros de trabajadores ya existentes, " +
            "en la lista actual, que se actualizará su información (en caso de incluir registros de " +
            "nuevos trabajadores, no serán considerados en el proceso)." +
         "</label>" +
         "<br><label style='color:blue'>*El estado de trabajador será 'Actualizado'.</label>";
   }else if(opcionId == 3){
      textoDetalle = 
         "<label style='color:blue'>" +
	    "*En el archivo excel, deben incluirse SOLO los registros de trabajadores ya existentes, " +
	    "en la lista actual, que volverán a activarse (en el caso de los registros de trabajadores " +
	    "que no se incluyan, no se verán afectados)." +
	 "</label>" +
	 "<br><label style='color:blue'>*Solo es necesario completar la columna 'DNI' del archivo excel.</label>" +
	 "<br><label style='color:blue'>*El estado de trabajador será 'Reingreso'.</label>"; 
   }else if(opcionId == 4){
      textoDetalle = 
	 "<label style='color:blue'>" +
            "*En el archivo excel, deben incluirse SOLO los registros de trabajadores ya existentes, " +
	    "en la lista actual, que se desactivarán (en el caso de los registros de trabajadores " +
	    "que no se incluyan, no se verán afectados)." +
	 "</label>" +
	 "<br><label style='color:blue'>*Solo es necesario completar la columna 'DNI' del archivo excel.</label>" +
         "<br><label style='color:blue'>*El estado de trabajador será 'Retirado'.</label>";  
   }else{
      textoDetalle = 
         "<label style='color:blue'>" +
	    "*En el archivo excel, deben incluirse TODOS los registros de trabajadores (nuevos y/o " +
	    "existentes) [respecto a los trabajadores que no se incluyan, pero que existan en la lista " +
	    "actual, serán desactivados, al añadirles una 'fecha de retiro']." +
         "</label>" +
         "<br><label style='color:blue'>" +
	    "*Se realizarán los procesos registrar, actualizar, reincorporar y retirar." +
         "</label>" +
	 "<br><label style='color:blue'>*El estado de trabajador será según el proceso respectivo.</label>";  
   }
   
   document.querySelector('#idDetalleTextoImport').innerHTML = textoDetalle;
}

function confirmacionSmartImportTrabajador(){
   $("#divImportTrabajador").modal("hide");
   $("#modalConfirmacionImportTrab").remove();
   
   var campoVacio = true;
   
   var nombreExcel = $("#inputEviImportExcel").val();
    
   if(nombreExcel.length == 0){
      campoVacio = false;
   }
   
   if(campoVacio){
      var contenidoAux = "";
   
      var opcionImpId = parseInt($("#selOpcionImport").val());
 	   
      var valOpcionImportAux = listOpcionImport.find(function(val1){
                                  return val1.id == opcionImpId}).nombre;
 	   
      var listContenidoAux=[
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
          label:"<i class='fa fa-check-square-o'></i> Opción import seleccionado",
          inputForm:"<span style='color:blue;font-weight:bolder;'>"+valOpcionImportAux+"</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
 	                "onclick='cancelarMensajeConfirmacionSmartImportTrabajador()'>" +
 	           "<i class='fa fa-times'></i> Cancelar" +
 	        "</button>",
 	  inputForm:"<button type='submit' class='btn btn-success' " +
 	                    "style='font-size:18px;float:right;'>" +
 	               "<i class='fa fa-check'></i> Aceptar" +
 	            "</button>"}
      ];
 	  
      listContenidoAux.forEach(function(val){
         contenidoAux += obtenerSubPanelModuloVersionDos(val);
      });
           		
      var modalOptionsAux={
     	 id: "modalConfirmacionImportTrab",
     	 nombre: "<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
     	 contenido: "<form id='formConfirmacionImportTrab' class='eventoGeneral'>"+contenidoAux+"</form>"
      };
           		
      crearModalPrincipalUsuario(modalOptionsAux,function(){},true,true);
       
      $("#formConfirmacionImportTrab").on("submit",function(e){
         e.preventDefault();
         enviarExcelImportTrabajador(); 
      }); 
   }else{
      mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";

      mensajesUx(mensajeUx,2,"","AvisoCompletarImportTrab");

      $("#modalMensajeUxAvisoCompletarImportTrab").on("hidden.bs.modal",function(){
	 $("#divImportTrabajador").modal("show");   
      });   
   }
}

function cancelarMensajeConfirmacionSmartImportTrabajador(){
   $("#modalConfirmacionImportTrab").modal("hide");
   $("#divImportTrabajador").modal("show");
}

function enviarExcelImportTrabajador(){
   guardarEvidenciaAuto(0,"fileEviImportExcel",bitsEvidenciaActoInseguro,
      "/trabajador/excel/masivo/save",function(data){
         $("#divImportTrabajador").remove();
	    
         if(data.mensaje.length > 0){
//	    alert(data.mensaje);
	    mensajeUx = "<label style='text-align:left;'>"+data.mensaje+"</label>";
	    mensajesUx(mensajeUx,4,"","ActualizarVistaModTrab");
	    
	    $("#modalMensajeUxActualizarVistaModTrab").on("hidden.bs.modal",function(){
               verSmartFinalizarImportTrabajador();     
	    });
         }else{
             verSmartFinalizarImportTrabajador();
         }
   },"id",[  
      {id: "unidadId",value: getUrlParameter("mdfId")},
      {id: "empresaId",value: getSession("gestopcompanyid")},
      {id: "opcionImpId",value: parseInt($("#selOpcionImport").val())}]);
}

function verSmartFinalizarImportTrabajador(){
   var btnDescarga = 
      "<a class='efectoLink' target='_blank' href='"+URL+"/trabajador/estado/excel?empresaId="+getSession("gestopcompanyid")+"'>" +
         "<i class='fa fa-download'></i> Descargar" +
      "</a>";
	
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"<i class='fa fa-file-excel-o'></i> Informe Estado trabajadores: ",
       inputForm:btnDescarga,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
       		    "<i class='fa fa-check'></i> Finalizar" +
       		 "</button>",divContainer:""}
		     ];
		       	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		       	
   var contenido =
      "<form id='formImportFinalEvento' class='eventoGeneral'>" +
         "<div id='tituloEvento'>"+text+"</div>"+
      "</form>";  
		       	
   var listPaneles={
      id:"divImportFinalTrabajador",nombre:"Finalizar Actualizar trabajadores (import)",
      clase:"listaAuxiliar",contenido:contenido
                   };
   
   crearModalPrincipalUsuario(listPaneles,function(){},true,true);
   
   $("#formImportFinalEvento").on("submit",function(e){
      e.preventDefault();
      $(".modal").modal("hide");
      $("#divImportTrabajador").remove();
      $("#divImportFinalTrabajador").remove();
      cargarPrimerEstado();
   });	
}

function ocultarFiltroTrabajador(){
   $("#modalFiltroTrabajador").modal("hide");
}

function verFiltroTrabajador(){
   $("#modalFiltroTrabajador").modal("show");
}

function crearFiltroTrabajador(functionCallBack){
    $("#modalFiltroTrabajador").remove();
    
    var dataParam={
        mdfId: parseInt(getUrlParameter("mdfId")),companyId: parseInt(getSession("gestopcompanyid"))
    };
   
    callAjaxPost(URL+"/trabajador/filtro",dataParam,function(data){
        var listAreasTrabajador = data.areas;var listPositionAux = data.puestos;listDivisiones = data.divisiones;
        listPosition = data.listPosition;listSite = data.listSite;listSangre = data.listSangre;listGenero = data.listGenero;
        listDiscapacidad = data.listDisc;
        listDuracion = data.listDuracion;
      
        listPosition = listPosition.filter(function(data){
	        if(data.isPerfil == 0 || data.isPerfil == null){
	            return data;
	        }
        });
	
        listAreasTrabajador.forEach(function(val){
            val.puestos = [];
			
            listPositionAux.forEach(function(val1){
	            if(val1.areaId == val1.areaId){
	                val.puestos.push(val1);
	            }
            });
        });
		
        listDivisiones.forEach(function(val){
            val.areas = [];
	 		
            listAreasTrabajador.forEach(function(val1){
	            if(val1.divisionId == val.divisionId){
	                val.areas.push(val1);
	            }
            });
        });

        var listBooleanSiNo = listBoolean.sort(function(val,val2){
            return val2.id - val.id;
        });

        var radiosRespTrabActivos = crearRadiosAutoVersionDos("radiosRespTrabActivos",
            listBooleanSiNo,"1","id","nombre","habilitarCamposAsociadosTrabActivos","");
     
        var contenido = "";
    				
        var listContenido=[
    	    {sugerencia:"",label:"Fecha ingreso - Inicio",inputForm:"<input type='date' id='inicioFechaIngreso' class='form-control'>"},
    	    {sugerencia:"",label:"Fecha ingreso - Fin",inputForm:"<input type='date' id='finFechaIngreso' class='form-control'>"},
    	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Solo trabajadores activos?",inputForm:radiosRespTrabActivos},
            {sugerencia:"",clase:"campos-trab-activos",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	    {sugerencia:"",clase:"campos-trab-activos",label:"Fecha retiro - Inicio",inputForm:"<input type='date' id='inicioFechaRetiro' class='form-control'>"},
       	    {sugerencia:"",clase:"campos-trab-activos",label:"Fecha retiro - Fin",inputForm:"<input type='date' id='finFechaRetiro' class='form-control'>"},
       	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	    {sugerencia:"",label:"Áreas",inputForm:"",divContainer:"divSelectFiltroArea"},
    	    {sugerencia:"",label:"Puestos",inputForm:"",divContainer:"divSelectFiltroPuesto"},
    	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
    	    {sugerencia:"",
             label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroTrabajador()'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                   "</button>",
    	     inputForm:"<button id='btnAplicarFiltroTrabajador' class='btn btn-success' type='submit' onclick='valoresFiltroTrabajador()' style='font-size:18px;float:right;'>" +
    	                   "<i class='fa fa-filter'></i> Aplicar filtro" +
    	               "</button>"}
        ];
    				
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
        });
     
        var modalOptionsObsTrab={
   	        id:"modalFiltroTrabajador",nombre:"<i class='fa fa-filter'></i> Filtros - Trabajadores",
    	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };
    				
        crearModalPrincipalUsuario(modalOptionsObsTrab,function(){
  	        if($("#selMultipleArea").length > 0){
  	            return;
  	        }
  	                   
  	        var sinPuesto =[{positionId:"0",positionName:"Sin Puesto de trabajo Asignado"}];
	 
            crearSelectOneMenuObligMultipleCompleto("selMultipleArea","",listAreasTrabajador,
            "areaId","areaName","#divSelectFiltroArea","Todas")
  		 
            crearSelectOneMenuObligMultipleCompleto("selMultiplePuesto","",sinPuesto.concat(listPositionAux),
            "positionId","positionName","#divSelectFiltroPuesto","Todos");
        },true,true);

        habilitarCamposAsociadosTrabActivos(1);
        			
        functionCallBack();
    });
}

function habilitarCamposAsociadosTrabActivos(value){
    (value == 1?$(".campos-trab-activos").hide():$(".campos-trab-activos").show());
}

function valoresFiltroTrabajador(){
   ocultarFiltroTrabajador();
   $("#valBuscarValorTrabajador").val("");
    
   listAreasId = [];
   var areaId = $("#selMultipleArea").val();
   
   areaId.forEach(function(val,index){
      listAreasId.push(parseInt(val));
   }); 
	
   listPuestosId = [];
   var puestoId = $("#selMultiplePuesto").val();
    
   puestoId.forEach(function(val,index){
      listPuestosId.push(parseInt(val));
   }); 
    
   cargarPrimerEstado();
}

var numPaginaTotal = 0,numPaginaActual = 0;

function cargarPrimerEstado(){
    busquedaActiva = 0;numPaginaActual = 1;

    trabajadorId = 0;positionId = 0;sangreTipoId = 0;generoId = 0;tipoDiscapacidad = 0;
    listTrabajadores = "";listTrabajadoresActivos = [],contadorListTrab = 0;tipoDuracionTrab = 0;

    var fechaInicioFiltro = $("#inicioFechaIngreso").val(),fechaFinFiltro = $("#finFechaIngreso").val();
    var fechaInicioRetiroFiltro = $("#inicioFechaRetiro").val(),fechaFinRetiroFiltro = $("#finFechaRetiro").val();
    var hasTrabActivos = parseInt($("input[name='radiosRespTrabActivos']:checked").val());
	
    var dataParam={
        mdfId:getUrlParameter("mdfId"),empresaId:parseInt(getSession("gestopcompanyid")),fechaInicioFiltro:convertirFechaTexto(fechaInicioFiltro),
        fechaFinFiltro:convertirFechaTexto(fechaFinFiltro),listAreasId:(listAreasId.length == 0?null:listAreasId),
        listPuestosId:(listPuestosId.length == 0?null:listPuestosId),hasTrabActivos:hasTrabActivos
    };

    if(hasTrabActivos == 0){
        dataParam.fechaInicioRetiroFiltro = convertirFechaTexto(fechaInicioRetiroFiltro);dataParam.fechaFinRetiroFiltro = convertirFechaTexto(fechaFinRetiroFiltro);
    }
   
    if(isMobile.any()){
        dataParam.trabajadorId = parseInt(getSession("trabajadorGosstId"));
       
        callAjaxPost(URL+'/trabajador',dataParam,procesarDataMovilDescargadaPrimerEstado);
    }else{
        $("#trabajadoresGosstMovil").hide();$("#trabajadoresGosstDesktop").show();

        callAjaxPostSimpleVersionDos(1,URL+'/trabajador/vista_admin',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    listFullTrabajadores = data.list;

                    cambiarPaginaTrabajador();completarBarraCarga();

                    resizeDivWrapper("wrapper",160);goheadfixedY("#tblTrab","#wrapper");
                    formatoCeldaSombreableTabla(true,"tblTrab");

                    break;

                default:
                    alert("Ocurrió un error al traer los Trabajadores!");
            }
        });

        $("#btnCancelarTrabajador").hide();$("#btnNuevoTrabajador").show();$("#btnGuardarTrabajador").hide();$("#btnEliminarTrabajador").hide();
        $("#btnVistaEventos").hide();$("#btnFiltroTrabajador").show();$("#btnGrupoTrabajador").show();$("#btnClipTablaTotal").show();
        $("#btnSmartUploadRetiro").show();$("#btnAgregarSite").show();$("#btnRegistroHoras").show();$("#btnTrabajadoresDestinatarios").show();
        $("#indicadorPaginaParcialTrabPrincipal").show();$("#btnResetBuscadorTrabajador").show();$("#btnAplicarBuscadorTrabajador").show();
        $("#valBuscarValorTrabajador").show();$("#btnAutoSmartPlanilla").hide();

        if(parseInt(getSession("actPlanillaTrabAuto")) == 1){
            $("#btnNuevoTrabajador").hide();$("#btnSmartUploadRetiro").hide();$("#btnAutoSmartPlanilla").show();
        }

        banderaEdicion = false;
    }
}

function cambiarPaginaTrabajador(){
    $("#flechaIzquierdaTrabPrincipal").show();$("#flechaDerechaTrabPrincipal").show();

    var list = (busquedaActiva == 0?listFullTrabajadores:listFullTrabajadoresBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
    var finRegistro = (numPaginaActual*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechas").html("<label>"+numPaginaActual+" de "+numPaginaTotal+"</label>");

    if(numPaginaActual == 1){
        $("#flechaIzquierdaTrabPrincipal").hide();
    }

    if(numPaginaActual == numPaginaTotal){
        $("#flechaDerechaTrabPrincipal").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblTrab tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            // var promedioTrab = "*Dar click al botón 'Cargar indicadores'";
            //
            // listFullIndicadoresTrabajadores.forEach(function(val1,index1){
	        //     if(val.trabajadorId == val1.id){
	        //         promedioTrab = val1.promedio;
	        //     }
            // });
         
            // val.nivelArea = {nombre:(val.numAreasGerente > 0?"Gerente":(val.numAreasJefe > 0?"Jefe":(val.numAreasSupervisor > 0?"Supervisor":"")))};
            // val.numAreasResponsable = val.numAreasSupervisor+val.numAreasJefe+val.numAreasGerente;
         
            var evidenciaConstanciaNombre = (val.evidenciaConstanciaTrabajoNombre.length == 0?"------":val.evidenciaConstanciaTrabajoNombre),
                contrasenia = (val.fechaUltimaActClaveTexto.length == 0?"**********":"<label>*Encriptada.</label>"),
                detalleActContrasenia = (val.fechaUltimaActClaveTexto.length == 0?"------":val.fechaUltimaActClaveTexto+"<br>(por "+val.usuarioActClave.nombre+")"),
                correo = (val.correo.length == 0?"------":val.correo),fechaIngresoTexto = (val.fechaIngresoTexto.length == 0?"------":val.fechaIngresoTexto),
                fechaRetiroTexto = (val.fechaRetiroTexto.length == 0?"------":val.fechaRetiroTexto),discapacidadGeneral = (val.discapacidad.length == 0?"------":val.discapacidad),
                observacionGeneral = (val.observacion.length == 0?"------":val.observacion);
		
            $("#tblTrab tbody").append(
                "<tr id='tr"+val.trabajadorId+"' onclick='javascript:editarTrabajador("+index+")'>" +
                    "<td>"+(index+1)+"</td>" +
	                // "<td id='tdprom'>"+promedioTrab+"</td>" +
	                "<td id='tddni"+val.trabajadorId+"'>"+val.dni+"</td>" +
	                "<td id='tdnom"+val.trabajadorId+"'>"+val.trabajadorNombre+"</td>" +
	                "<td id='tdgen"+val.trabajadorId+"'>"+val.genero.generoNombre+"</td>" +
	                "<td id='tdnac"+val.trabajadorId+"'>"+val.fechaNacimientoTexto+"</td>" +
	                "<td id='edadTrab"+val.trabajadorId+"'>"+val.edad+"</td>" +
	                "<td id='tdsang"+val.trabajadorId+"'>"+val.sangre.sangreTipoNombre+"</td>" +
	                "<td id='tdtrdivi"+val.trabajadorId+"'>"+val.puesto.divisionName+"</td>" +
	                "<td id='tdtrarea"+val.trabajadorId+"'>"+val.puesto.areaName+"</td>" +
	                "<td id='tdpos"+val.trabajadorId+"'>"+val.puesto.positionName+"</td>" +
	                "<td id='tdsite"+val.trabajadorId+"'>"+val.site.nombre+"</td>" +
	                "<td id='tdsuc"+val.trabajadorId+"'>"+correo+"</td>" +
	                "<td id='tddur"+val.trabajadorId+"'>"+val.tipoDuracion.nombre+"</td>" +
	                "<td id='tdfeing"+val.trabajadorId+"'>"+fechaIngresoTexto+"</td>" +
	                "<td id='tdferet"+val.trabajadorId+"'>"+fechaRetiroTexto+"</td>" +
	                // "<td id='tdtipod"+val.trabajadorId+"'>"+val.tipoDiscapacidadNombre+"</td>" +
	                // "<td id='tdrestr"+val.trabajadorId +"'>"+val.restriccion+"</td>" +
	                "<td id='tddiscap"+val.trabajadorId+"'>"+discapacidadGeneral+"</td>" +
	                "<td id='tdobs"+val.trabajadorId+"'>"+observacionGeneral+"</td>" +
	                "<td id='tdconstanciatrabajo"+val.trabajadorId+"'>"+evidenciaConstanciaNombre+"</td>" +
//	                "<td id='tdHasValidacion"+val.trabajadorId+"'>"+hasValidacion+"</td>" +
//	                "<td id='tdFechaValidacion"+val.trabajadorId+"'>"+estadoValidacion+"</td>" +
	                "<td id='tdpass"+val.trabajadorId+"'>"+contrasenia+"</td>" +
	                "<td id='tdFechaActUltimoPass"+val.trabajadorId+"'>"+detalleActContrasenia+"</td>" +
	                "<td id='tdFechaUltimoAcceso"+val.trabajadorId+"'>"+val.fechaUltimoAccesoTexto+"</td>" +
                "</tr>");
         
            if(parseInt(getSession("gestopcompanyid")) == 647){
                $("#tdsang"+val.trabajadorId).hide();$("#tdsite"+val.trabajadorId).hide();$("#tdtipod"+val.trabajadorId).hide();
                $("#tdrestr"+val.trabajadorId).hide();$("#tddiscap"+val.trabajadorId).hide();$("#tdobs"+val.trabajadorId).hide();
                $("#tdconstanciatrabajo"+val.trabajadorId).hide();$("#tdHasValidacion"+val.trabajadorId).hide();
                $("#tdFechaValidacion"+val.trabajadorId).hide();
            }else if(parseInt(getSession("actPlanillaTrabAuto")) == 1){
                $("#tdpass"+val.trabajadorId).hide();$("#tdFechaActUltimoPass"+val.trabajadorId).hide();
            }
		
            if(val.fechaRetiroTexto != ''){
	            $("#tblTrab tbody #tr"+val.trabajadorId+" td").css({"background-color":"#E6E6E6"});
            }
            // else{
            //     listTrabajadores = listTrabajadores + listFullTrabajadores[index].trabajadorNombre+"\n";contadorListTrab = contadorListTrab + 1;
            // }
        }
    });

    $.unblockUI();
}

function verificarDni(){
   var existe = false;
	
   listFullTrabajadores.forEach(function(val,index){
      if(val.dni == $("#inputDni").val() && val.trabajadorId != trabajadorId){
	 existe = true;
      }
   });
	
   if(existe){
      alert("DNI ya registrado");
      $("#inputDni").val("");
   }
	
   var antes = $("#inputDni").val();
   var size = $("#inputDni").val().length;
	
   if(size > 10){
      alert("10 dígitos máximo");
      $("#inputDni").val(antes.substr(0,10));
   }
}

function editarTrabajador(pindex){
    if(!banderaEdicion){
        trabajadorObj = (busquedaActiva == 0?listFullTrabajadores[pindex]:listFullTrabajadoresBuscador[pindex]);
      
        trabajadorId = trabajadorObj.trabajadorId;
		
        $("#tr"+trabajadorId).addClass("fila-edicion");

        // var indicadorFormacion = trabajadorObj.indicadorFormacion;var indicadorEntregaEpp = trabajadorObj.indicadorEntregaEpp;
        // var indicadorDisponibilidad = trabajadorObj.indicadorDisponibilidad;var indicadorParticipacion = trabajadorObj.indicadorParticipacion;
        // var indicadorExamenMedico = trabajadorObj.indicadorExamenMedico;
        // $("#tr"+trabajadorId+"#tdprom").html("<a onclick='verRadialTrabajador("+pindex+")'>"+$("#tr"+trabajadorId+"#tdprom:first").text()+"</a>");

        $("#tdobs"+trabajadorId).html("<input id='inputObs' type='text' class='form-control'>");
        $("#inputObs").val(trabajadorObj.observacion);

        if(trabajadorObj.fechaUltimaActClaveTexto.length == 0){
            $("#tdpass"+trabajadorId).html("<input id='inputPass' type='text' class='form-control' placeholder='Pass'>");
            $("#inputPass").val(trabajadorObj.contrasenia);
        }else{
	        $("#tdpass"+trabajadorId).addClass("linkGosst").on("click",function(){
                verCambiarPasswordEncriptadaTrabajador();
            }).html("<i class='fa fa-pencil fa-2x' aria-hidden='true'></i> Cambiar");
        }

        $("#tddni"+trabajadorId).html("<input id='inputDni' type='text' onkeyup='verificarDni()' class='form-control' " +
		    "style='width:100px' placeholder='DNI' autofocus='true' value='"+name+"'>");
        $("#inputDni").val(trabajadorObj.dni);

        $("#tdnom"+trabajadorId).html("<input id='inputNom' type='text' class='form-control'>");
        $("#inputNom").val(trabajadorObj.trabajadorNombre);
      
        var name4 = $("#tdsuc"+trabajadorId).text();
		
        $("#tdsuc"+trabajadorId).html("<input id='inputSuc' type='text' class='form-control'>");
        $("#inputSuc").val(trabajadorObj.correo);
		
        var name5 = $("#tddiscap"+trabajadorId).text();
		
        $("#tddiscap"+trabajadorId).html("<input id='inputDiscap' type='text' class='form-control'>");
        $("#inputDiscap").val(trabajadorObj.discapacidad);

        $("#tdfeing"+trabajadorId).html("<input id='inputFecIng' type='date' class='form-control'>");
        $("#inputFecIng").val(convertirFechaInput(trabajadorObj.fechaIngreso));

        $("#tdferet" + trabajadorId).html("<input id='inputFecRet' type='date' style='width:170px' class='form-control'>");
        $("#inputFecRet").val(convertirFechaInput(trabajadorObj.fechaRetiro));

        if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 0){
            $("#inputFecRet").prop("disabled",true);
        }
		
        $("#tdnac"+trabajadorId).html("<input id='inputFecNac' type='date' onchange='colocarEdad("+trabajadorId+")' class='form-control'>");
        $("#inputFecNac").val(convertirFechaInput(trabajadorObj.fechaNacimiento));

        $("#tdtrdivi"+trabajadorId).html("<label>*Automático.</label>");$("#tdtrarea"+trabajadorId).html("<label>*Automático.</label>");
      
        var selSite = crearSelectOneMenu("selSite","",listSite,trabajadorObj.site.id,"id","nombre");
        $("#tdsite"+trabajadorId).html(selSite);
	
        var selPosTipo = crearSelectOneMenu("selPosTipo","",listPosition,trabajadorObj.puesto.positionId,"positionId","positionNameShort");
        $("#tdpos"+trabajadorId).html("<input class='form-control' id='inputBuscarPuestoTrabajoTrab'>"+selPosTipo);
      
        $("#inputBuscarPuestoTrabajoTrab").val(trabajadorObj.puesto.positionName);
        $("#inputBuscarPuestoTrabajoTrab").attr("onkeyup","buscarPuestoTrabajoTrabajador()");

        var selTipoSang = crearSelectOneMenu("selTipoSang","",listSangre,trabajadorObj.sangre.sangreTipoId,"sangreTipoId","sangreTipoNombre");
        $("#tdsang"+trabajadorId).html(selTipoSang);

        var selGenero = crearSelectOneMenu("selGenero","",listGenero,trabajadorObj.genero.generoId,"generoId","generoNombre");
        $("#tdgen"+trabajadorId).html(selGenero);

        // var selTipoDisc = crearSelectOneMenu("selTipoDisc","",listDiscapacidad,trabajadorObj.tipoDiscapacidad,"tipoDiscapacidad","tipoDiscapacidadNombre");
        //$("#tdtipod"+trabajadorId).html(selTipoDisc);
      
        var selTipoDuracion = crearSelectOneMenu("selTipoDuracion","",listDuracion,trabajadorObj.tipoDuracion.id,"id","nombre");
        $("#tddur"+trabajadorId).html(selTipoDuracion);

        var optionEvidencia={
            isImage:false,container:"#tdconstanciatrabajo"+trabajadorId,functionCall:function(){},idAux:"Cons",
	        esNuevo:(trabajadorObj.evidenciaConstanciaTrabajoNombre.length == 0?true:false),
            evidenciaNombre:trabajadorObj.evidenciaConstanciaTrabajoNombre,
            descargaUrl:"/trabajador/evidencia_constancia_trabajo?id="+trabajadorId
        };
		
        crearFormEvidenciaCompleta(optionEvidencia);

        banderaEdicion = true;

        $("#btnCancelarTrabajador").show();$("#btnNuevoTrabajador").hide();$("#btnGuardarTrabajador").show();$("#btnEliminarTrabajador").show();
        $("#btnVistaEventos").show();$("#btnFiltroTrabajador").hide();$("#btnGrupoTrabajador").hide();$("#btnClipTablaTotal").hide();
        $("#btnSmartUploadRetiro").hide();$("#btnAgregarSite").hide();$("#btnRegistroHoras").hide();$("#btnTrabajadoresDestinatarios").hide();
        $("#indicadorPaginaParcialTrabPrincipal").hide();$("#btnResetBuscadorTrabajador").hide();$("#btnAplicarBuscadorTrabajador").hide();$("#valBuscarValorTrabajador").hide();
        $("#btnAutoSmartPlanilla").hide();

        formatoCeldaSombreableTabla(false,"tblTrab");

        if(parseInt(getSession("actPlanillaTrabAuto")) == 1){
            document.getElementById("inputDni").disabled = true;document.getElementById("inputNom").disabled = true;document.getElementById("inputBuscarPuestoTrabajoTrab").disabled = true;
            document.getElementById("selPosTipo").disabled = true;document.getElementById("inputSuc").disabled = true;document.getElementById("inputFecIng").disabled = true;
            document.getElementById("inputFecRet").disabled = true;document.getElementById("selGenero").disabled = true;document.getElementById("inputFecNac").disabled = true;
        }

//      if(parseInt(getSession("habilitarValidacion")) == 1){
//	        if(trabajadorObj.hasValidacion == 0){
//	            $("#btnValidacionTrabDni").show();
//	        }
//      }
    }
}

function nuevoTrabajador(){
    if(!banderaEdicion){
        var selSite = crearSelectOneMenu("selSite","",listSite,"-1","id","nombre");
        var selPuesto = crearSelectOneMenuOblig("selPosTipo","",listPosition,"-1","positionId","positionNameShort");
        var selTipoSang = crearSelectOneMenu("selTipoSang","",listSangre,"-1","sangreTipoId","sangreTipoNombre");
        var selGenero = crearSelectOneMenuOblig("selGenero","",listGenero,"-1","generoId","generoNombre");
        // var selTipoDisc = crearSelectOneMenu("selTipoDisc","",listDiscapacidad,"-1","tipoDiscapacidad","tipoDiscapacidadNombre");
        var selTipoDuracion = crearSelectOneMenu("selTipoDuracion","",listDuracion,"-1","id","nombre");
        var textoOblig = "<small style='font-weight:bolder;'>*Obligatorio</small>";

        $("#tblTrab tbody:first").prepend(
            "<tr id='0'>" +
	            "<td>"+"<label>*Automático.</label>"+"</td>" +
	            // "<td>"+"<label>*Primero debe guardar el registro.</label>"+"</td>" +
	            "<td><input type='text' id='inputDni' onkeyup='verificarDni()' class='form-control' autofocus='true'>"+textoOblig+"</td>" +
                "<td><input type='text' id='inputNom' class='form-control'>"+textoOblig+"</td>" +
	            "<td>"+selGenero+""+textoOblig+""+"</td>" +
	            "<td><input type='date' id='inputFecNac' class='form-control' onchange='colocarEdad(0)'>"+textoOblig+"</td>" +
	            "<td id='edadTrab0'>"+"<label>*Debe ingresar la Fecha de nacimiento.</label>"+"</td>" +
	            "<td id='tdsang0'>"+selTipoSang+"</td>" +
	            "<td>"+"<label>*Debe ingresar el Puesto de trabajo.</label>"+"</td>" +
	            "<td>"+"<label>*Debe ingresar el Puesto de trabajo.</label>"+"</td>" +
	            "<td>"+"<input class='form-control' id='inputBuscarPuestoTrabajoTrab'>"+selPuesto+textoOblig+"</td>"+
	            "<td id='tdsite0'>"+selSite+"</td>"+
	            "<td><input type='text' id='inputSuc' class='form-control'>"+textoOblig+"</td>" +
	            "<td>"+selTipoDuracion+"</td>" +
	            "<td><input type='date' id='inputFecIng' class='form-control'></td>" +
	            "<td><input type='date' id='inputFecRet' class='form-control'></td>" +
	            // "<td id='tdtipod0'>Pendiente</td>" +
	            // "<td id='tdrestr0'>...</td>" +
	            "<td id='tddiscap0'><input type='text' id='inputDiscap' class='form-control'></td>" +
	            "<td id='tdobs0'><input type='text' id='inputObs' class='form-control'></td>" +
                "<td id='tdconstanciatrabajo0'></td>" +
//              "<td id='tdHasValidacion0'>...</td>" +
//              "<td id='tdconstanciatrabajo0'>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
            "</tr>");
      
        if(parseInt(getSession("gestopcompanyid")) == 647){
            $("#tdsang0").hide();$("#tdsite0").hide();$("#tdtipod0").hide();$("#tdrestr0").hide();$("#tddiscap0").hide();$("#tdobs0").hide();
            $("#tdconstanciatrabajo0").hide();$("#tdHasValidacion0").hide();$("#tdFechaValidacion0").hide();
        }
      
        trabajadorId = 0;formatoCeldaSombreableTabla(false,"tblTrab");
	
        var optionEvidencia={
	        isImage:false,functionCall:function(){},container:"#tdconstanciatrabajo"+trabajadorId,
	        idAux:"Cons",esNuevo:true,evidenciaNombre:"",descargaUrl:""
        };
			
        crearFormEvidenciaCompleta(optionEvidencia);
      
        $("#inputBuscarPuestoTrabajoTrab").attr("onkeyup","buscarPuestoTrabajoTrabajador()");

        $("#btnCancelarTrabajador").show();$("#btnNuevoTrabajador").hide();$("#btnGuardarTrabajador").show();$("#btnEliminarTrabajador").hide();
        $("#btnVistaEventos").hide();$("#btnFiltroTrabajador").hide();$("#btnGrupoTrabajador").hide();$("#btnClipTablaTotal").hide();
        $("#btnSmartUploadRetiro").hide();$("#btnAgregarSite").hide();$("#btnRegistroHoras").hide();$("#btnTrabajadoresDestinatarios").hide();
        $("#indicadorPaginaParcialTrabPrincipal").hide();$("#btnResetBuscadorTrabajador").hide();$("#btnAplicarBuscadorTrabajador").hide();$("#valBuscarValorTrabajador").hide();
        $("#btnAutoSmartPlanilla").hide();

//      if(parseInt(getSession("habilitarValidacion")) == 1){
//          $("#btnValidacionTrabDni").hide();
//      }
		
        banderaEdicion = true;
    }else{
        alert("Guarde primero.");
    }
}

function buscarPuestoTrabajoTrabajador(){
   var puestoTrabajoTrabAux = $("#inputBuscarPuestoTrabajoTrab").val().toUpperCase().trim();
   var encontrado = 0;
   
   if(puestoTrabajoTrabAux.length != 0){
      listPosition.forEach(function(val){
         if(val.positionNameShort.toUpperCase().trim().includes(puestoTrabajoTrabAux) && encontrado == 0){
  	    $("#selPosTipo").val(val.positionId);
  	    encontrado++;
         }     
      }); 
   }
}

function cancelarTrabajador(){
    cargarPrimerEstado();
}

function eliminarTrabajador(){
   mensajeUx="<label>¿Está seguro de eliminar el registro del trabajador " +
      "asociado a la fila seleccionada?</label>";
	
   mensajesUx(mensajeUx,3,"","Tra");
	 
   $("#btnDevolverValorTra").on("click",function(){
      var dataParam={
         trabajadorId: trabajadorId
      };

      callAjaxPost(URL+'/trabajador/delete',dataParam,procesarResultadoEliminarTrab);
   });
}

function procesarResultadoEliminarTrab(data){
    switch(data.CODE_RESPONSE){
        case "05":
	        if(data.mensaje == ""){
	            mensajeUx="<label>El registro del trabajador seleccionado se ha eliminado correctamente.</label>";
	            mensajesUx(mensajeUx,1,"","");
	    
	            $("#valBuscarValorTrabajador").val("");
	    
	            cargarPrimerEstado();
            }else{
	            mensajeUx = data.mensaje;
                mensajesUx(mensajeUx,2,"","");
	        }
	 
	        break;
	
        default:
	        mensajeUx="<label>El registro del trabajador seleccionado no se ha podido eliminar. *Motivo: El trabajador " +
	            "tiene eventos asociados (Puede visualizar los eventos asociados al dar click al botón " +
	            "'Ver eventos asociados' ubicado en la parte superior de la tabla).</label>";
      	    mensajesUx(mensajeUx,2,"","");
    }
}

function guardarTrabajador(){
    var campoVacio = true;

    var inputDni = $("#inputDni").val();
    var inputNom = $("#inputNom").val();
    var selGenero = parseInt($("#selGenero").val());
    var selTipoSang = (parseInt($("#selTipoSang").val()) == -1?null:parseInt($("#selTipoSang").val()));
    var selPosTipo = parseInt($("#selPosTipo").val());
    var selSite = parseInt($("#selSite").val());
    var inputSuc = $("#inputSuc").val();
    var selTipoDuracion = (parseInt($("#selTipoDuracion").val()) == -1?null:parseInt($("#selTipoDuracion").val()));
    var inputDiscap = $("#inputDiscap").val();
    var observaciones = $("#inputObs").val();
    // var selTipoDisc = $("#selTipoDisc option:selected").val(),inputRestr = $("#inputRestr").val();

    var fechaNacimiento = convertirFechaTexto($("#inputFecNac").val());
    var inputFechaNacimiento = (!fechaNacimiento?null:fechaNacimiento);

    var fechaIngreso = convertirFechaTexto($("#inputFecIng").val());
    var inputFechaIngreso = (!fechaIngreso?null:fechaIngreso);

    var fechaRetiro = convertirFechaTexto($("#inputFecRet").val());
    var inputFechaRetiro = (!fechaRetiro?null:fechaRetiro);

    if(inputSuc.length == 0 || inputDni.length == 0 || inputNom.length == 0 || selGenero == -1 || inputFechaNacimiento == null){
        campoVacio = false;mensajeUx = "<label>Debe completar los campos 'Documento de identidad', 'Nombre del trabajador', " +
        "'Género', 'Fecha de nacimiento' y 'Correo'.</label>";
    }

    passwordTrabajador = (trabajadorId == 0?inputDni:$("#inputPass").val());
	
    if(campoVacio){
        var dataParam={
	        trabajadorId:trabajadorId,dni:inputDni,contrasenia:passwordTrabajador,trabajadorNombre:inputNom,genero:{generoId:selGenero},
            sangre:{sangreTipoId:selTipoSang},correo:inputSuc,discapacidad:inputDiscap,puesto:{positionId:selPosTipo},mdfId:getUrlParameter("mdfId"),
	        fechaIngreso:inputFechaIngreso,fechaRetiro:inputFechaRetiro,fechaNacimiento:inputFechaNacimiento,tipoDuracion:{id:selTipoDuracion},
	        observacion:observaciones,site:{id:selSite}
        };

        if(trabajadorId > 0){
            dataParam.fechaUltimaActClaveTexto = trabajadorObj.fechaUltimaActClaveTexto;
        }
	
        callAjaxPost(URL+'/trabajador/save',dataParam,procesarResultadoGuardarTrabajador);
    }else{
        mensajesUx(mensajeUx,2,"","");
    }
}

function procesarResultadoGuardarTrabajador(data) {
    switch (data.CODE_RESPONSE) {
        case "05":
	        guardarEvidenciaAuto(data.trabajadorId,"fileEviCons",bitsMega*10,
            "/trabajador/evidencia_constancia_trabajo/save",function(){
                mensajeUx = "<label>"+(trabajadorId == 0?"El registro del trabajador se guardó " +
	            "correctamente.":"El registro del trabajador se actualizó correctamente.")+"</label>";
	            mensajesUx(mensajeUx,1,"","");
	    
	            $("#valBuscarValorTrabajador").val("");cargarPrimerEstado();
	        });
	 
	        break;
	  
        default:
	        mensajeUx="<Label>Ya existe un trabajador con ese DNI.</label>";
      	    mensajesUx(mensajeUx,3,"","");
      	 
      	    $("#valBuscarValorTrabajador").val("");cargarPrimerEstado();
      	 
      	    break;
    }
}

function verVistaEventos() {
	$('#mdEvent').modal('show');
}

function cargarModalEvent() {
	var dataParam = {
		trabajadorId : trabajadorId
	};

	callAjaxPost(URL + '/trabajador/eventos', dataParam,
			procesarResultadoEventos);
}

function procesarResultadoEventos(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		var listNegativa = data.listEventosNegativos;
		$("#tabCapa table tbody tr").remove();
		$("#tabExamen table tbody tr").remove();
		$("#tabEntrega table tbody tr").remove();
		$("#tabActos table tbody tr").remove();
		$("#tabSancion table tbody tr").remove();
		$("#tabParticipacion table tbody tr").remove();
		$("#tabGrupos table tbody tr").remove();
		for (index = 0; index < list.length; index++) {
			switch (list[index].eventoTipoId) {
			case 1:
				$("#tabCapa table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ list[index].eventoNombre + "</td>"

								+ "<td>" + list[index].estadoNombre + "</td>"

								+ "<td>" + list[index].fechaTexto + "</td>"

								+ "<td><a href='" + URL
								+ list[index].urlEvidencia
								+ "' target='_blank' >"
								+ list[index].nombreEvidencia + "</a></td>"

								+ "</tr>");
				break;
			case 2:
				$("#tabExamen table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ list[index].eventoNombre + "</td>"

								+ "<td>" + list[index].estadoNombre + "</td>"

								+ "<td>" + list[index].fechaTexto + "</td>"

								+ "<td><a href='" + URL
								+ list[index].urlEvidencia
								+ "' target='_blank' >"
								+ list[index].nombreEvidencia + "</a></td>"

								+ "</tr>");
				break;
			case 3:
				$("#tabEntrega table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ list[index].eventoNombre + "</td>"

								+ "<td>" + list[index].estadoNombre + "</td>"

								+ "<td>" + list[index].fechaTexto + "</td>"

								+ "<td><a href='" + URL
								+ list[index].urlEvidencia
								+ "' target='_blank' >"
								+ list[index].nombreEvidencia + "</a></td>"

								+ "</tr>");
				break;
			case 7:
				$("#tabParticipacion table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ list[index].eventoNombre + "</td>"

								+ "<td>" + list[index].estadoNombre + "</td>"

								+ "<td>" + list[index].fechaTexto + "</td>"

								+ "</tr>");
				break;
			case 8:
				$("#tabGrupos table tbody").append(

						"<tr id='tr" + index + "'>" 
								+ "<td>"+ list[index].eventoNombre + "</td>"
								+ "<td>" + list[index].fechaInicioTexto + "</td>"
								+ "<td>" + list[index].fechaFinTexto + "</td>"
								+ "<td>" + list[index].estadoNombre + "</td>"

								
								+ "<td><a href='" + URL
								+ list[index].urlEvidencia
								+ "' target='_blank' >"
								+ list[index].nombreEvidencia + "</a></td>"
								+ "</tr>");
				break;
			}

		}
		var hModalAux=$(window).height()*0.6;
		$("#tabCapa").css(
				{"height":hModalAux+"px",
				"overflow-x": "auto",
				"overflow-y": "auto"}	
				
		);
		for (index = 0; index < listNegativa.length; index++) {
			switch (listNegativa[index].eventoTipoId) {
			case 4:
				$("#tabActos table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ listNegativa[index].tipoNombre + "</td>"

								+ "<td>" + listNegativa[index].eventoNombre
								+ "</td>"

								+ "<td>" + listNegativa[index].fechaTexto
								+ "</td>" + "<td>"
								+ listNegativa[index].diasDescanso + "</td>"
								+ "<td><a href='" + URL
								+ listNegativa[index].urlEvidencia
								+ "' target='_blank' >"
								+ listNegativa[index].nombreEvidencia
								+ "</a></td>"

								+ "</tr>");
				break;
			case 5:
				$("#tabSancion table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ listNegativa[index].tipoNombre + "</td>"

								+ "<td>" + listNegativa[index].eventoNombre
								+ "</td>"

								+ "<td>" + listNegativa[index].fechaTexto
								+ "</td>"

								+ "<td><a href='" + URL
								+ listNegativa[index].urlEvidencia
								+ "' target='_blank' >"
								+ listNegativa[index].nombreEvidencia
								+ "</a></td>"

								+ "</tr>");
				break;
			case 6:
				$("#tabActos table tbody").append(

						"<tr id='tr" + index + "'>" + "<td>"
								+ listNegativa[index].tipoNombre + "</td>"

								+ "<td>" + listNegativa[index].eventoNombre
								+ "</td>"

								+ "<td>" + listNegativa[index].fechaTexto
								+ "</td>" + "<td>"
								+ listNegativa[index].diasDescanso + "</td>"
								+ "<td><a href='" + URL
								+ listNegativa[index].urlEvidencia
								+ "' target='_blank' >"
								+ listNegativa[index].nombreEvidencia
								+ "</a></td>"

								+ "</tr>");
				break;
			}

		}
		break;
	default:
		alert("Ocurrió un error al cargar los eventos!");
	}
}
function importarDatos() {
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoCopiaExcel();");

	$('#mdImpDatos').modal('show');
	var selPosTipo = crearSelectOneMenu("selPosTipoImp", "", listPosition,
			positionId, "positionId", "positionNameShort","Sin Definir");
	
	$("#divSelPuesto").html(selPosTipo);
	
	var inputPuesto="<input class='form-control' id='positionAutoImport'>";
	$("#divSelPuesto").html(inputPuesto);
	ponerListaSugerida("positionAutoImport",listarStringsDesdeArray(listPosition,"positionNameShort"),true);
	
	}

function importarSmartDatos() {
	$("#btnGuardarSmartNuevos").attr("onclick",
			"javascript:guardarMasivoSmartCopiaExcel();");

	$('#mdImpSmartDatos').modal('show');    
	
	}
function guardarMasivoSmartCopiaExcel() {
	var texto = $("#txtListadoSmart").val();
	var listExcelInicial = texto.split('\n');
	var listTrabs = [];
	var listDnisRepetidos = [];
	var listFullNombres = "";
	var validado = "";
	var listExcel=[];
	listExcelInicial.forEach(function(val,index){ 
		if(val.length>0){
			listExcel.push(val);
		} 
	});
	if (texto.length < 100000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}

			if (validado.length < 1 && listCells.length != 10) {
				validado = "No coincide el numero de celdas."
						+ listCells.length;
				break;
			} else {
				var trab = {};
				var genero = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						trab.dni = element.trim();
						if ($.inArray(trab.dni, listDnisRepetidos) === -1) {
							listDnisRepetidos.push(trab.dni);
						} else {
							listFullNombres = listFullNombres + trab.dni + ", ";
						}

					}
					
					if (j === 1)
						trab.trabajadorNombre = element.trim();
					if (j === 2) {
						for (var k = 0; k < listGenero.length; k++) {
							if (listGenero[k].generoNombre == element.trim()) {
								genero.generoId = listGenero[k].generoId;
								trab.genero = genero;
							}
						}

						if (!genero.generoId) {
							validado = "Genero no reconocido.";
							break;
						}
					}
					if (j === 3) {
						try {
							var fechaTexto = element.trim();
							var parts = fechaTexto.split('/');
							var dateNac = new Date(parts[2], parts[1] - 1,
									parts[0]);
							trab.fechaNacimiento = dateNac;
						} catch (err) {
							validado = "Error en el formato de fecha de nacimiento.";
							break;
						}
					}

					if (j === 4) {
						trab.correo = element.trim();
					}
					if (j === 7) {
						var puestoIdFinal=null; 
						listDivisiones.forEach(function(val,index){
							if(val.divisionName.toUpperCase().trim()==listCells[5].trim().toUpperCase()){
								val.areas.forEach(function(val1,index1){
									if(val1.areaName.toUpperCase().trim()==listCells[6].trim().toUpperCase()){
										val1.puestos.forEach(function(val2,index2){
											if(val2.positionName.toUpperCase().trim()==listCells[7].trim().toUpperCase()){
												puestoIdFinal=val2.positionId;
											}
										});
									}
								});
							}
						}); 
						trab.puesto={
								positionId:(puestoIdFinal)
						}
					}
					if (j === 8) {
						try {
							var fechaTexto = element.trim();
							var parts = fechaTexto.split('/');
							var dateIngreso = new Date(parts[2], parts[1] - 1,
									parts[0]);
							trab.fechaIngreso = dateIngreso;
						} catch (err) {
							validado = "Error en el formato de fecha de ingreso.";
							break;
						}

					}

					if (j === 9) {
						for (var k = 0; k < listDuracion.length; k++) {
							if (listDuracion[k].nombre == element.trim()) {
								trab.tipoDuracion = {
									id : listDuracion[k].id
								};
							}
						}

						if (!trab.tipoDuracion) {
							validado = "Jornada Laboral no reconocida.";
							break;
						}
					}
					trab.mdfId = getUrlParameter("mdfId");
					
				}

				listTrabs.push(trab);
				if (listDnisRepetidos.length < listTrabs.length) {
					validado = "Existen dnis repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 100000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listTrabs : listTrabs
			}; 
		 callAjaxPost(URL + '/trabajador/masivo/save', dataParam,
		 		funcionResultadoMasivo);
		}
	} else {
		alert(validado);
	}
}
function guardarMasivoCopiaExcel() {
	var texto = $("#txtListado").val();
	var listExcel = texto.split('\n');
	var listTrabs = [];
	var listDnisRepetidos = [];
	var listFullNombres = "";
	var validado = "";

	if (texto.length < 100000) {
		for (var int = 0; int < listExcel.length; int++) {

			var listCells = listExcel[int].split('\t');
			var filaTexto = listExcel[int];
			if (filaTexto.trim().length < 1) {
				validado = "Existen filas vacias.";
				break;
			}

			if (validado.length < 1 && listCells.length != 7) {
				validado = "No coincide el numero de celdas."
						+ listCells.length;
				break;
			} else {
				var trab = {};
				var genero = {};
				for (var j = 0; j < listCells.length; j++) {
					var element = listCells[j];
					if (j === 0) {
						trab.dni = element.trim();
						if ($.inArray(trab.dni, listDnisRepetidos) === -1) {
							listDnisRepetidos.push(trab.dni);
						} else {
							listFullNombres = listFullNombres + trab.dni + ", ";
						}

					}
					
					if (j === 1)
						trab.trabajadorNombre = element.trim();
					if (j === 2) {
						for (var k = 0; k < listGenero.length; k++) {
							if (listGenero[k].generoNombre == element.trim()) {
								genero.generoId = listGenero[k].generoId;
								trab.genero = genero;
							}
						}

						if (!genero.generoId) {
							validado = "Genero no reconocido.";
							break;
						}
					}
					if (j === 3) {
						try {
							var fechaTexto = element.trim();
							var parts = fechaTexto.split('/');
							var dateNac = new Date(parts[2], parts[1] - 1,
									parts[0]);
							trab.fechaNacimiento = dateNac;
						} catch (err) {
							validado = "Error en el formato de fecha de nacimiento.";
							break;
						}
					}

					if (j === 4) {
						trab.correo = element.trim();
					}

					if (j === 5) {
						try {
							var fechaTexto = element.trim();
							var parts = fechaTexto.split('/');
							var dateIngreso = new Date(parts[2], parts[1] - 1,
									parts[0]);
							trab.fechaIngreso = dateIngreso;
						} catch (err) {
							validado = "Error en el formato de fecha de ingreso.";
							break;
						}

					}

					if (j === 6) {
						for (var k = 0; k < listDuracion.length; k++) {
							if (listDuracion[k].nombre == element.trim()) {
								trab.tipoDuracion = {
									id : listDuracion[k].id
								};
							}
						}

						if (!trab.tipoDuracion) {
							validado = "Jornada Laboral no reconocida.";
							break;
						}
					}
					trab.mdfId = getUrlParameter("mdfId");
					var puestoIdFinal=null;
					listPosition.forEach(function(val,index){
						if(val.positionNameShort==$("#positionAutoImport").val()){
							puestoIdFinal=val.positionId;
						}
					});
					trab.puesto={
							positionId:(puestoIdFinal)
					}
				}

				listTrabs.push(trab);
				if (listDnisRepetidos.length < listTrabs.length) {
					validado = "Existen dnis repetidos." + listFullNombres;
					break;
				}
			}
		}
	} else {
		validado = "Ha excedido los 100000 caracteres permitidos.";
	}

	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ listExcel.length + " elemento(s)?");
		if (r == true) {
			var dataParam = {
				listTrabs : listTrabs
			};
			console.log(listTrabs);
			callAjaxPost(URL + '/trabajador/masivo/save', dataParam,
					funcionResultadoMasivo);
		}
	} else {
		alert(validado);
	}
}

function funcionResultadoMasivo(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		if (data.MENSAJE.length > 0) {
			alert(data.MENSAJE);
		} else {
			alert("Se guardaron exitosamente.");
			cargarPrimerEstado();
			$('#mdImpDatos').modal('hide');
		}
		break;
	default:
		alert("Ocurrió un error al guardar el trabajador!");
	}
}

function colorTrabajadorInactivo(fechaSalida) {
	var color;
	if (fechaSalida != null) {
		color = "#E6E6E6";
	} else {
		color = "";
	}

	return "style='background-color:" + color + ";'"

}

function colocarEdad(trabId) {

	var edad = calcularEdadAuto($("#inputFecNac").val());

	$("#edadTrab" + trabId).html(edad);
}

function obtenerListaNombresTrabajador() {

	new Clipboard('#btnSelect', {
		text : function(trigger) {
			return listTrabajadores
		}
	});
	alert("Se han guardado al clipboard " + contadorListTrab
			+ " trabajador(es)");

}
function obtenerListaTrabajadorActivo() {
	var clipoard="Nombre Puesto \t ";
	listTrabajadoresActivos.forEach(function(val,index){
		clipoard+=(val.id!=-1?val.nombre:"Sin Puesto")+"\t";
	});
	clipoard+="\n Activos \t"
	listTrabajadoresActivos.forEach(function(val1,index1){
		clipoard+=val1.activos+"\t";
		
	});
	clipoard+="\n Inactivos \t"
	listTrabajadoresActivos.forEach(function(val2,index2){
		clipoard+=val2.inactivos+"\t";
		
	});
	
	
	new Clipboard('#btnSelectPuesto', {
		text : function(trigger) {
			return clipoard
		}
	});
	alert("Se han guardado al clipboard el número de trabajador(es) activos e inactivos");

}
function obtenerTablaClipboard() {
	var listFullTablaTrabajador=obtenerDatosTablaTrabajadorEstandar("tblTrab"); 
	 
	copiarAlPortapapeles(listFullTablaTrabajador);
	alert("Se han guardado al clipboard la tabla de este módulo" );

}

function obtenerTablaClipboardTotal(){
    var texto = obtenerDatosBodyTablaEstandar("tblTrab");
    copiarAlPortapapeles(texto,"btnClipTablaTotal");

    mensajeUx="<label>Los registros del consolidado se copiaron en el clipboard.</label>";
    mensajesUx(mensajeUx,1,"","");
}

function verRadialTrabajador(index) {

	$("#containerModal").html("");
		
		$("#modalRadial").modal("show");

	
var indexAux=index;

var indicadorFormacion = 0;
var indicadorEntregaEpp = 0;
var indicadorDisponibilidad = 1;
var sumaDiasDescanso=0;
var diasTrabajados=0;
var indicadorParticipacion = 0;
var indicadorExamenMedico = 0;
listFullIndicadoresTrabajadoresAux.forEach(function(val1,index1){
	if(val1.id==trabajadorId){
		 indicadorFormacion = listFullIndicadoresTrabajadoresAux[index1].indicadorFormacion;
		 indicadorEntregaEpp = listFullIndicadoresTrabajadoresAux[index1].indicadorEntregaEpp;
		 indicadorDisponibilidad = listFullIndicadoresTrabajadoresAux[index1].indicadorDisponibilidad;
		 sumaDiasDescanso=listFullIndicadoresTrabajadoresAux[index1].sumaDiasDescanso;
		 diasTrabajados=listFullIndicadoresTrabajadoresAux[index1].diasTrabajados;
		 indicadorParticipacion = listFullIndicadoresTrabajadoresAux[index1].indicadorParticipacion;
		 indicadorExamenMedico = listFullIndicadoresTrabajadoresAux[index1].indicadorExamenMedico;
	}
	
});


var indicadorMinimoFormacion = indicadoresSeguridad.indicadorMinimoFormacion;
var indicadorMinimoEntregaEpp = indicadoresSeguridad.indicadorMinimoEntregaEpp;
var indicadorMinimoDisponibilidad = indicadoresSeguridad.indicadorMinimoDisponibilidad;
var indicadorMinimoParticipacion = indicadoresSeguridad.indicadorMinimoParticipacion;
var indicadorMinimoExamenMedico = indicadoresSeguridad.indicadorMinimoExamenMedico;
	// /////////
	//BUscanod el trab id
	 
	
	var objTrab = {
		trabajadorId : trabajadorId,
		palabraEspacio:"<br>"
	}
	callAjaxPost(URL + '/trabajador/indicadores', objTrab,
			function(data){
		switch(data.CODE_RESPONSE){
		case "05":
			var formNecesarias=indFormacion;
			$("#tblFormInd tbody tr").remove();
			for (var index2 = 0; index2 < indFormacion.length; index2++) {
				if (trabajadorId == indFormacion[index2].trabajadorId) {
				
					
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var capacitacionesTrab=indFormacion[index2].caps;
					var indicadorRangoActual=1;
					for(var index22=0;index22<capacitacionesTrab.length;index22++){
						
						var programs=capacitacionesTrab[index22].programsCap;
						var textoFechaVigencia="----";
						var textoFechaPendiente="";
						var vecesAprobadas="-----";
						var horaProgramada="-----";
						var numAprobadas=0;
						var progAnteriores=0;
						var colorFondo="white";
						for(var index3=0;index3<programs.length;index3++){
							if(programs[index3].fechaPlaTexto==null){
								programs[index3].fechaPlaTexto=primerDia;
							}
							if(programs[index3].fechaRealTexto==null){
								programs[index3].fechaRealTexto=programs[index3].fechaPlaTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index3].fechaPlaTexto,programs[index3].fechaRealTexto)
							if(restaFechas(primerDia,programs[index3].fechaPlaTexto)<0  ){
								progAnteriores=progAnteriores+1;
								textoFechaVigencia=convertirFechaNormal(programs[index3].fechaRealTexto);
							}
							if(restaFechas(primerDia,programs[index3].fechaPlaTexto)<0 &&programs[index3].tipoNotaTrabId==1 ){
								numAprobadas=numAprobadas+1;
							}
							if(index3+1==programs.length){
								vecesAprobadas=numAprobadas+"/"+progAnteriores
							}
							if(restaFechas(primerDia,programs[index3].fechaPlaTexto)>0){
								textoFechaPendiente=textoFechaPendiente+convertirFechaNormal(programs[index3].fechaPlaTexto)+" ,";
								horaProgramada=programs[index3].horaPlanificada;
							}
							
							if(programs[index3].tipoNotaTrabId==1 &&enRangoInicial ){
							colorFondo="#9BBB59";
							textoFechaVigencia=convertirFechaNormal(programs[index3].fechaRealTexto);
							horaProgramada="-----";
							};
						};
						$("#tblFormInd tbody").append(
								"<tr  " +
								"id='f"+capacitacionesTrab[index22].capacitacionId+"' '>" +
								"<td>"+capacitacionesTrab[index22].capacitacionNombre+"</td>" +
								"<td>"+textoFechaVigencia+"</td>" +
								"<td>"+textoFechaPendiente+"</td>" +
								"<td>"+vecesAprobadas+"</td>" +
								
								"</tr>"		
								);
						$("#tblFormInd tbody #f"+capacitacionesTrab[index22].capacitacionId+" td").css(
								{"background-color":colorFondo}
									
								);	
						
					}
					
					index2 = indFormacion.length;
					
				}

			}
			
			
		
			var examVigencia=indExam;
			$("#tblExamSum tbody tr").remove();
			for (var index2 = 0; index2 < examVigencia.length; index2++) {
				if (trabajadorId == examVigencia[index2].trabajadorId) {
				
					
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var examenTrab=indExam[index2].exams;
					var indicadorRangoActual=0;
					for(var index22=0;index22<examenTrab.length;index22++){
						
						var programs=examenTrab[index22].programsExams;
						var textoFechaVigencia="----";
						var textoFechaPendiente="";
						var vecesAprobadas="-----";
						var colorFondo="white";
						for(var index3=0;index3<programs.length;index3++){
							if(programs[index3].fechaInicialTexto==null){
								programs[index3].fechaInicialTexto=primerDia;
							}
							if(programs[index3].fechaFinTexto==null){
								programs[index3].fechaFinTexto=programs[index3].fechaInicialTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index3].fechaInicialTexto,programs[index3].fechaFinTexto)
							if(restaFechas(primerDia,programs[index3].fechaInicialTexto)<0  ){
								
								textoFechaVigencia=convertirFechaNormal(programs[index3].fechaFinTexto);
							}
							
							
							if(restaFechas(primerDia,programs[index3].fechaInicialTexto)>0){
								textoFechaPendiente=textoFechaPendiente+convertirFechaNormal(programs[index3].fechaInicialTexto)+" ,"
							}
							
							if((programs[index3].tipoNotaTrabId==1 && enRangoInicial) || programs[index3].progTrabId >0){
								
							colorFondo="#9BBB59";
							textoFechaVigencia=convertirFechaNormal(programs[index3].fechaFinTexto);
							
							}else{
								textoFechaVigencia="";
							};
							
							$("#tblExamSum tbody").append(
									"<tr  " +
									"id='ex"+examenTrab[index22].examenMedicoId+"' '>" +
									"<td>"+examenTrab[index22].examenMedicoNombre+"</td>" +
									"<td>"+programs[index3].vigenciaNombre+"</td>" +
									"<td>"+programs[index3].resultadoNombre+"</td>" +
									
									"<td>"+textoFechaVigencia+"</td>" +
									"<td>"+textoFechaPendiente+"</td>" +
									
									"</tr>"		
									);
							colorFondo="white"
							$("#tblExamSum tbody #ex"+examenTrab[index22].examenMedicoId+" td").css(
									{"background-color":colorFondo}
										
									);	
							
							
						};
						
						
					}
					
					index2 = indExam.length;
					
				}

			}
			$("#tblEppSum tbody tr").remove();
			for (var index2 = 0; index2 < indEpp.length; index2++) {
				if (trabajadorId == indEpp[index2].trabajadorId) {
				
					
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var eppsTrab=indEpp[index2].epps;
					var indicadorRangoActual=1;
					for(var index22=0;index22<eppsTrab.length;index22++){
						
						var programs=eppsTrab[index22].programsEpp;
						var textoFechaVigencia="----";
						var textoFechaPendiente="";
						var vecesAprobadas="----";
						var colorFondo="white";
						for(var index3=0;index3<programs.length;index3++){
							if(programs[index3].fechaPlanificadaTexto==null){
								programs[index3].fechaPlanificadaTexto=primerDia;
							}
							if(programs[index3].fechaPlanificadaTexto==null){
								programs[index3].fechaPlanificadaTexto=programs[index3].fechaPlanificadaTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index3].fechaPlanificadaTexto,programs[index3].fechaEntregaTexto)
							if(restaFechas(primerDia,programs[index3].fechaPlanificadaTexto)<0  ){
								progAnteriores=progAnteriores+1;
								textoFechaVigencia=convertirFechaNormal(programs[index3].fechaEntregaTexto);
							}
							
							if(index3+1==programs.length){
								vecesAprobadas=numAprobadas+"/"+progAnteriores
							}
							if(restaFechas(primerDia,programs[index3].fechaPlanificadaTexto)>0){
								textoFechaPendiente=textoFechaPendiente+convertirFechaNormal(programs[index3].fechaPlanificadaTexto)+" ,"
							}
							
							if(programs[index3].tipoNotaTrabId!=null &&enRangoInicial ){
							colorFondo="#9BBB59";
							textoFechaVigencia=convertirFechaNormal(programs[index3].fechaEntregaTexto);
							};
						};
						$("#tblEppSum tbody").append(
								"<tr  " +
								"id='f"+eppsTrab[index22].equipoSeguridadId+"' '>" +
								"<td>"+eppsTrab[index22].equipoSeguridadNombre+"</td>" +
								"<td>"+programs.length+"</td>" +
								"<td>"+textoFechaVigencia+"</td>" +
								"<td>"+textoFechaPendiente+"</td>" +
								
								"</tr>"		
								);
						$("#tblEppSum tbody #f"+eppsTrab[index22].equipoSeguridadId+" td").css(
								{"background-color":colorFondo}
									
								);	
						
					}
					
					index2 = indEpp.length;
					
				}

			}
			
			
			
			///////
			$("#tblPartSum tbody").html(
			"<tr>" +
			"<td>"+indicadorParticipacion+"</td>" +
					"<td>"+indicadoresSeguridad.indicadorMinimoParticipacion+"</td>" +
			"</tr>"		
			);
			var diastrabajados=diasTrabajados;
			var diasdescanso=sumaDiasDescanso;
			$("#tblDispSum tbody").html(
					"<tr>" +
					"<td>"+diasdescanso+"</td>" +
					"<td>"+diastrabajados+"</td>" +
					"</tr>"		
					);
			break;
			default:
				alert("error al traer indicadores de trabajador");
			break;
		}
		
	});
	// /////////
	$("#modalRadial #mdEventLabel").html(
			"Promedio no ponderado de Metas SST de "
					+ listFullTrabajadores[index].trabajadorNombre

	);
	
	$('#containerModal')
			.highcharts(
					{

						chart : {
							polar : true,
							type : 'area'
						},

						title : {
							text : '',
							x : -80
						},

						pane : {
							size : '80%'
						},

						xAxis : {
							categories : [ 'Vigencia Promedio de Formacion',
									'Vigencia Promedio de EPP',
									'Disponibilidad Laboral',
									'Participacion en el SGSST',
									'Vigencia Examen Médico' ],
							tickmarkPlacement : 'on',
							lineWidth : 0
						},

						yAxis : {
							gridLineInterpolation : 'polygon',
							lineWidth : 0,
							min : 0,
							tickInterval : 0.25,
							max : 1
						},

						tooltip : {
							shared : true,
							pointFormat : '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>',
							valueDecimals : 2
						},

						legend : {
							align : 'right',
							enabled : false,
							verticalAlign : 'top',
							y : 70,
							layout : 'vertical'
						},
					    colors:["#9BBB59","#4F81BD"],

						series : [
								{  zIndex:3,
							    	  fillColor: {
					                      linearGradient: {
					                          x1: 0,
					                          y1: 0,
					                          x2: 0,
					                          y2: 1
					                      },
					                      stops: [
					                          [0, "#9BBB59"],
					                          [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
					                      ]
					                  },
									name : 'Promedio Actual',
									data : [
											indicadorFormacion,
											indicadorEntregaEpp,
											indicadorDisponibilidad,
											 ((indicadorParticipacion/indicadorMinimoParticipacion)>1?1:(indicadorParticipacion/indicadorMinimoParticipacion)),
											indicadorExamenMedico ],
									pointPlacement : 'on'
								},
								{
									name : 'Meta',
									 fillColor: {
						                    linearGradient: {
						                        x1: 0,
						                        y1: 0,
						                        x2: 0,
						                        y2: 0.05
						                    },
						                    stops: [
						                        [0, "#4F81BD"],
						                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(-0.9).get('rgba')]
						                    ]
						                },
									data : [ indicadorMinimoFormacion,
											indicadorMinimoEntregaEpp,
											indicadorMinimoDisponibilidad, 1,
											indicadorMinimoExamenMedico ],
									pointPlacement : 'on'
								} ]

					});
/////////////
	var hModalAux=$(window).height()*0.6;
	$("#tabFormSum").css(
			{"height":hModalAux+"px",
			"overflow-x": "auto",
			"overflow-y": "auto"}	
			
	);
	$("#tabEntregaSum").css(
			{"height":hModalAux+"px",
			"overflow-x": "auto",
			"overflow-y": "auto"}	
			
	);
	$("#tabExamSum").css(
			{"height":hModalAux+"px",
			"overflow-x": "auto",
			"overflow-y": "auto"}	
			
	);
	$("#tabFormSum").css(
			{"height":hModalAux+"px",
			"overflow-x": "auto",
			"overflow-y": "auto"}	
			
	);
	////////////
}

function obtenerAyudaIndicador() {
	$("#modalAyudaIndicador").modal("show");
	escribirFraccion("ayudaForm", "Vigencia Promedio de Formación",
			"# de formaciones APROBADAS, vigentes y asignadas",
			"# total de formaciones asignadas");
	escribirFraccion("ayudaEpp", "Vigencia Promedio de EPP",
			"EPP's entregados, asignados y vigentes", "EPP´s asignados");
	$("#ayudaExam").html(
			"Vigencia de Examen Médico= (1) Si está apto o apto con restricciones,"
					+ " (0) si está pendiente, no apto o sin realizar");
	escribirFraccion("ayudaDisp", "Disponibilidad Laboral",
			"Días trabajados - Días de descanso médico ", "Días trabajados");
	$("#ayudaDisp").append(";Días trabajados=52*5");
	$("#ayudaPart")
			.html(
					"Participación en el SGSST =#Reportes de A/C subestándar en el año");

}

//function retiroMasivoPorDni()
//{
//	$("#mdImportDniRetiro").modal("show");
//	$("#mdImportDniRetiro").find("textarea").val("");
//	$("#btnGuardarRetiroDni").attr("onclick", "javascript:guardarImportRetiroDni();"); 
//	$("#modalUpdateTrabajador").modal("hide");
//}
//function verModalRetiro(){
//$("#modalUpdateTrabajador").modal("show");
//$("#fechaRetiroMasivo").val(obtenerFechaActual());
//var filaTrabajador=$("#trabajadoresList tbody");
//
//$("#trabajadoresList").parent(".wrapper").css({"height":$(window).height()-300+"px"}); /*-300*/
//$("#btnGuardarRetiros").attr("onclick","retiroMasivoTrabajadores()");
//$("#retiroImportarDniTrab").attr("onclick","retiroMasivoPorDni()");
//filaTrabajador.html("");
//	listFullTrabajadores.forEach(function(val,index){
//		if(val.fechaRetiro==null){
//			
//			filaTrabajador.append("<tr id='filaRetiro"+val.trabajadorId+"'>" +
//					"<td><input class='form-control' type='checkbox' id='checkRetiro"+val.trabajadorId+"'></td>" +
//					"<td>"+val.trabajadorNombre+"</td>" +
//					"</tr>")
//		}
//		
//		
//	});
//	
//}
//
//function guardarImportRetiroDni()
//{
//	var listDniRetirarImportar=[]; 
//	var texto=$("#txtListadoDNIs").val(); 
//	var listExcel=texto.split("\n");
//	var listDniRetir=[];
//	var listDniRetirRepe=[];
//	var listFullDNIs="";
//	var validado=""; 
//	
//	var fechaRetiroAux = $("#fechaRetiroMasivo").val()
//	var mes2 = $("#fechaRetiroMasivo").val().substring(5, 7) - 1;
//	var fechatemp2 = new Date($("#fechaRetiroMasivo").val().substring(0, 4), mes2, $(
//			"#fechaRetiroMasivo").val().substring(8, 10)); 
//	var inputFecRet = fechatemp2;
//	
//	
//	if(texto.length<1000000)
//	{ 
//		var ultimotitulo="";
//		for(var int=0;int<listExcel.length-1;int++)
//		{   
//			var listCells=listExcel[int].split("\t");
//			var filaTexto=listExcel[int];
//			if(filaTexto.trim().length<1)
//			{
//				validado="Existen filas vacias !.";
//				break;
//			}
//			if(validado.length<1 && listCells.length!=1)
//			{
//				validado="No coincide el numero de las celdas ->> ("+listCells.length+"!=1)";		
//			}
//			else
//			{
//				var retirodni={};
//				for(var j=0;j<listCells.length;j++)
//				{
//					var element=listCells[j];
//					switch (j) {
//					case 0:
//						retirodni.dni=element.trim(); 
//						if($.inArray(retirodni.dni,listDniRetirRepe) === -1)
//						{
//							listDniRetirRepe.push(retirodni.dni); 
//						}
//						else 
//						{
//							listFullDNIs= listFullDNIs+retirodni.dni+", ";
//						}
//						break; 
//					default:
//						break;
//					}
//				}
//				
//			}
//			listDniRetir.push(retirodni);
//		}  
//		
//		if(listDniRetirRepe.length<listExcel.length-1)
//		{
//			validado="Existen DNIs repetidos. \n"+listFullDNIs; 
//		}
//	}
//	else 
//	{
//		validado="Ha excedido el 1 000 000 de caracteres para el registro";
//	} 
//	if(validado.length<1)
//	{
//		var r=confirm("¿Está seguro que desea subir estos "+(listExcel.length-1)+" elemento(s)");
//		if(r==true)
//		{ 
//			listFullTrabajadores.forEach(function(val,index)
//			{
//				listDniRetir.forEach(function(val1)
//				{ 
//					if(val1.dni==val.dni)
//					{
//						var trabajadorObj={	};
//						trabajadorObj=val;
//						trabajadorObj.fechaRetiro=inputFecRet;
//						val.fechaRetiroTexto=fechaRetiroAux;
//						val.fechaRetiro=inputFecRet; 
//						listDniRetirarImportar.push(trabajadorObj); 
//					}
//				}); 
//			});  
//			var dataParam = {
//				listTrabs : listDniRetirarImportar
//			};
//			console.log(listDniRetirarImportar);
//			callAjaxPostNoUnlock(URL + '/trabajador/masivo/update', dataParam,
//				funcionResultadoUpdateMasivo,
//				function(){
//					listDniRetirarImportar.forEach(function(val,index){
//						listFullTrabajadores.forEach(function(val1,index1){
//							if(val.trabajadorId==val1.trabajadorId){
//								llamarCeldaTabla(index1);
//							}
//						});
//						$("#tblTrab tbody #tr"+val.trabajadorId+" td").css(
//							{
//								"background-color":"#E6E6E6"
//							}
//						);	
//					});
//					$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>Guardando Trabajadores...'});
//				},dataParam);
//		}
//	}
//	else 
//	{
//		alert(validado);
//	}
//}
//function retiroMasivoTrabajadores(){
//	var listTrabs=[];
//	var fechaRetiroAux = $("#fechaRetiroMasivo").val()
//	var mes2 = $("#fechaRetiroMasivo").val().substring(5, 7) - 1;
//	var fechatemp2 = new Date($("#fechaRetiroMasivo").val().substring(0, 4), mes2, $(
//			"#fechaRetiroMasivo").val().substring(8, 10));
//
//	var inputFecRet = fechatemp2;
//	listFullTrabajadores.forEach(function(val,index){
//		if($("#checkRetiro"+val.trabajadorId).prop("checked")){ 
//			
//			var trabajadorObj={	};
//			trabajadorObj=val;
//			trabajadorObj.fechaRetiro=inputFecRet;
//			val.fechaRetiroTexto=fechaRetiroAux;
//			val.fechaRetiro=inputFecRet;
//			listTrabs.push(trabajadorObj)
//		}
//		
//		
//	});
//	var dataParam = {
//			listTrabs : listTrabs
//		};
//		console.log(listTrabs);
//		callAjaxPostNoUnlock(URL + '/trabajador/masivo/update', dataParam,
//				funcionResultadoUpdateMasivo,function(){
//			listTrabs.forEach(function(val,index){
//				listFullTrabajadores.forEach(function(val1,index1){
//					if(val.trabajadorId==val1.trabajadorId){
//						llamarCeldaTabla(index1);
//					}
//				}) 
//				$("#tblTrab tbody #tr"+val.trabajadorId+" td").css(
//					{
//						"background-color":"#E6E6E6"
//					}	
//				);	 
//			})
//			$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>Guardando Trabajadores...'});
//		},dataParam);
//}

function funcionResultadoUpdateMasivo(data){
	if(data.CODE_RESPONSE="05"){
		$("#modalUpdateTrabajador").modal("hide");
		$.blockUI({
			timeout: 2000, 
			message : '<i class="fa fa-check-square" style="color:green" aria-hidden="true"></i> Guardado '
		});
		console.log("buena");
		
	};
	
}

function verModalNuevaAsociarTrabajador(){
	$("#modalAsociarNuevoPuesto").modal("show");
	
	var btnGuaradr="<button id='btnGuardarNuevoAsociado' type='button' class='btn btn-success'"
	+"	title='Guardar'>"
+"	<i class='fa fa-floppy-o fa-2x'></i>"
+"</button>"
var divisionesActuales=[];
	var dataParam = {
			matrixId : getUrlParameter("mdfId")
	};

	callAjaxPost(URL + '/division', dataParam, function(data){
		divisionesActuales=data.list;
		var selNuevaDivision1= crearSelectOneMenuOblig("selNuevaDivision1", "verAreasDivisionNuevaTrabajador(1)", divisionesActuales, "", "divisionId",
		"divisionName");
		var selNuevaDivision2= crearSelectOneMenuOblig("selNuevaDivision2", "verAreasDivisionNuevaTrabajador(2)", divisionesActuales, "", "divisionId",
		"divisionName");
		$("#modalAsociarNuevoPuesto").find(".modal-title").html("Asociar nuevo puesto")
$("#modalAsociarNuevoPuesto").find(".modal-body")
.html(btnGuaradr+"<div id='divPuestoNuevo1' style='width:50%;display: table-cell;'><br><br>Actual División a:<br>"+selNuevaDivision1
		+"<br>Actual Áreas:<div  id='divNuevaArea1'></div>"
		+"<br>Actual Puestos:<div  id='divNuevoPuesto1'></div>" +
				"</div>" +
				"<div id='divPuestoNuevo2' style='width:50%;display: table-cell;'><br><br>Nueva Divisón :<br>"+selNuevaDivision2
				+"<br>Nueva Área:<div  id='divNuevaArea2'></div>"
				+"<br>Nuevo Puesto:<div  id='divNuevoPuesto2'></div>" +
						"</div>" +
						"<div id='divNuevoNombreTrabs'> </div>" +
				"");
		verAreasDivisionNuevaTrabajador(1);
		verAreasDivisionNuevaTrabajador(2);
$("#btnGuardarNuevoAsociado").attr("onclick","guardarNuevoAsociadoTrabajador()")
	});
	
}
function verAreasDivisionNuevaTrabajador(subId){
	var areasActuales=[];
	var dataParam = {
			divisionId : $("#selNuevaDivision"+subId).val()
		};
	$("#divNuevaArea"+subId).html("Loading...");
		callAjaxPost(URL + '/area', dataParam, function(data){
			areasActuales=data.list;
			var selNuevaArea= crearSelectOneMenuOblig("selNuevaArea"+subId, "verPuestosAreaNuevaTrabajador("+subId+")", areasActuales, "", "areaId",
			"areaName");
			$("#divNuevaArea"+subId).html(selNuevaArea);
			verPuestosAreaNuevaTrabajador(subId);
		});
}
function verPuestosAreaNuevaTrabajador(subId){
	var puestosActuales=[];
	 
	var dataParam = {
			areaId : $("#selNuevaArea"+subId).val()
	};
	$("#divNuevoPuesto"+subId).html("Loading...");
		callAjaxPost(URL + '/puesto', dataParam, function(data){
			puestosActuales=data.list;
			var selNuevoPuesto= crearSelectOneMenuOblig("selNuevoPuesto"+subId, "verAcordePuestoActual()", puestosActuales, "", "positionId",
			"positionName");
			$("#divNuevoPuesto"+subId).html(selNuevoPuesto);
			verAcordePuestoActual();
			
		});
		
		
}
function verAcordePuestoActual(){
	//
	
	var numTrabs= 0,nombreTrabs = "";
	var puestoActualId = parseInt($("#selNuevoPuesto1").val());
	listFullTrabajadores.forEach(function(val){
		if(val.puesto.positionId == puestoActualId){
			numTrabs++;
			nombreTrabs += val.trabajadorNombre+" ("+val.dni+") <br>"
		}
	});
	$("#divNuevoNombreTrabs").html("Afecta a ("+numTrabs+") trabajador(es):<br>"+nombreTrabs);
}
function guardarNuevoAsociadoTrabajador(){
	var numTrabs= 0;
	var puestoActualId = parseInt($("#selNuevoPuesto1").val());
	var listTrabajadorId = [];
	listFullTrabajadores.forEach(function(val){
		if(val.puesto.positionId == puestoActualId){
			numTrabs++;
			listTrabajadorId.push(val.trabajadorId)
		}
	});
	listTrabajadorId = (listTrabajadorId.length > 0?listTrabajadorId:null);
	var r = confirm("¿Está seguro de cambiar el puesto de "+numTrabs+" trabajador(es)?");
	if (r == true) {
		var dataParam = {
				puestoActualId : puestoActualId,
				puestoNuevoId:$("#selNuevoPuesto2").val(),
				listTrabajadorId : listTrabajadorId
		};

		callAjaxPost(URL + '/trabajador/puesto/save', dataParam,
				function(){
			alert("Cambio de puestos completado");
			cargarPrimerEstado();
			$("#modalAsociarNuevoPuesto").modal("hide")
		});
	}
}

var siteId;
var listSites = [];
var siteObj={};
var siteRegistroAux=false;

function ocultarConfiguracionSite(){
   $("#modalConfiguracionSite").modal("hide");
   listSite = listSites;
   cargarPrimerEstado();
}

function configuracionSite(){
   $("#modalConfiguracionSite").remove();  
    
   var listModal={
      id:"modalConfiguracionSite",nombre:"Site",maxWidth:"60%",
      contenido:
	 "<button class='btn btn-info' id='btnVolverVistaPrincipal' onclick='ocultarConfiguracionSite()' " +
	         "title='Regresar a la vista principal.'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnNuevoRegistroSite' style='margin-left:5px' " +
	         "title='Nuevo registro de site' onclick='nuevoRegistroSite()'>" +
	    "<i class='fa fa-plus fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnCancelarRegistroSite' style='margin-left:5px' " +
	         "title='Cancelar acción' onclick='cancelarRegistroSite()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnGuardarRegistroSite' style='margin-left:5px' " +
	         "title='Guardar el nuevo registro de site.' onclick='guardarRegistroSite()'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-danger' id='btnEliminarRegistroSite' style='margin-left:5px' " +
	         "title='Eliminar el nuevo registro del site.' onclick='eliminarSite()'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapConfiguracionSite'>" +
	    "<table id='tblConfiguracionSite' " +
	           "class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:70px'>Nro</td>" +
		     "<td class='tb-acc' style='width:300px'>Nombre</td>" +
		     "<td class='tb-acc' style='width:100px'>N° de trabajadores asociados</td>" +
		     "<td class='tb-acc' style='width:100px'>N° de documentos asociados</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>"+
	 "</div>"
   }
	
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapConfiguracionSite",320);
   
   siteRegistroAux = false;
 
   $("#btnCancelarRegistroSite").hide();$("#btnGuardarRegistroSite").hide();
   $("#btnEliminarRegistroSite").hide();
   
   var dataParamAux={
      empresaId:parseInt(getSession("gestopcompanyid")),esConsolidado:1
   }
   
   callAjaxPost(URL+'/trabajador/site',dataParamAux,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listSites = data.listSites;
	      
	    $("#tblConfiguracionSite tbody tr").remove();
	    
	    listSites.forEach(function(val,index){
	       $("#tblConfiguracionSite tbody").append(
	          "<tr id='trRegistroSite"+val.id+"' onclick='editarSite("+index+")'>" +
		     "<td id='tdordensite"+val.id+"' style='word-break: break-all;'>"+(index+1)+"</td>" +
		     "<td id='tdnombresite"+val.id+"' style='word-break: break-all;'>"+val.nombre+"</td>" +
		     "<td id='tdNumTrabAsig"+val.id+"'>"+val.numTotalTrabajadores+"</td>" +
		     "<td id='tdNumDocAsig"+val.id+"'>"+val.numDocumentosAsociados+"</td>" +
		  "</tr>");
	    });
	     
	    formatoCeldaSombreableTabla(true,"tblConfiguracionSite");
	     
	    break;
	     
         default:
	    alert("nop");
	    break;
      }
      
      goheadfixedY("#tblConfiguracionSite","#wrapConfiguracionSite");
   });
}

function cancelarRegistroSite(){
   configuracionSite();
}

function nuevoRegistroSite(){
   if(!siteRegistroAux){
      $("#btnCancelarRegistroSite").show();$("#btnGuardarRegistroSite").show();
      $("#btnEliminarRegistroSite").hide();$("#btnNuevoRegistroSite").hide();
      $("#btnVolverVistaPrincipal").hide();
      
      siteRegistroAux = true;
      formatoCeldaSombreableTabla(false,"tblConfiguracionSite");
      
      siteId = 0;
	
      $("#tblConfiguracionSite tbody").prepend(
         "<tr id='trRegistroSite0'>" +
	    "<td><label>*Automático</label></td>" +
	    "<td><input type='text' id='inputNombreSite' class='form-control'></td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	 "</tr>");
   }else{
      alert("Guarde primero.");
   }
}

function editarSite(pindex){
   if(!siteRegistroAux){
      $("#btnCancelarRegistroSite").show();$("#btnGuardarRegistroSite").show();
      $("#btnEliminarRegistroSite").show();$("#btnNuevoRegistroSite").hide();
      $("#btnVolverVistaPrincipal").hide();
      
      siteRegistroAux = true;
      formatoCeldaSombreableTabla(false,"tblConfiguracionSite");
      
      siteId = listSites[pindex].id;
      siteObj = listSites[pindex];
	
      $("#trRegistroSite"+siteId).addClass("fila-edicion");
      
      $("#tdordensite"+siteId).html("<label>*Automático</label>");
       
      $("#tdnombresite"+siteId).html("<input type='text' id='inputNombreSite' class='form-control'>");
      $("#inputNombreSite").val(siteObj.nombre);
   }
}

function eliminarSite(){
   $("#modalConfiguracionSite").modal("hide");
    
   if(siteObj.numTotalTrabajadores == 0 && siteObj.numDocumentosAsociados == 0){
      mensajeUx="<label>¿Está seguro de eliminar el site seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","EliminarSite");

      $("#btnDevolverValorEliminarSite").on("click",function(){
         var dataParam={
 	    id:siteObj.id
         }

         callAjaxPost(URL+'/trabajador/site/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
 	       case "05":
 		  mensajeUx="<label>El site seleccionado fue eliminado con éxito.</label>";
  		  mensajesUx(mensajeUx,1,"","EliminarSiteAviso");
 		
  		  $("#modalMensajeUxEliminarSiteAviso").on("hidden.bs.modal",function(){
  		     $("#modalMensajeUxEliminarSiteAviso").remove();
  		     configuracionSite();     
  		  });
 		
  		  break;
 		
 	       default:
 		  alert("Ocurrió un error al eliminar el site!");
            }
         });
      });
   
      $("#btnRegresarPrevioEliminarSite").on("click",function(){
         $("#modalConfiguracionSite").modal("show"); 
      });  
   }else{
      mensajeUx="<label>No se puede eliminar ya que tiene trabajadores y/o documentos " +
      		"asociados a este site.</label>";
      mensajesUx(mensajeUx,2,"","EliminarSiteAviso");
		
      $("#modalMensajeUxEliminarSiteAviso").on("hidden.bs.modal",function(){
	 $("#modalConfiguracionSite").modal("show");
      });
   }
}

function guardarRegistroSite(){

   var campoVacio = true;
   
   var nombreSite = $("#inputNombreSite").val();
       
   if(nombreSite.length == 0){
      campoVacio = false;
   }
       
   if(campoVacio){
      var dataParam={
 	     id: siteId,
 	     nombre: nombreSite,
 	     empresaId: getSession("gestopcompanyid")
 	 	    }

      callAjaxPost(URL+'/trabajador/site/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":  
 		$("#modalConfiguracionSite").remove();
 		
 		mensajeUx="<label>El site fue registrado con éxito.</label>";
 		mensajesUx(mensajeUx,1,"","ActualizarSite");
 		
 		$("#modalMensajeUxActualizarSite").on("hidden.bs.modal",function(){
 		   $("#modalMensajeUxActualizarSite").remove();
 		   configuracionSite();
 		});
 	        break;
 	 		   
 	    default:
 	        alert("Ocurrió un error al guardar!");
         }
      }); 
   }else{
      $("#modalConfiguracionSite").modal("hide");
      mensajeUx="Debe ingresar el nombre del Site."
      mensajesUx(mensajeUx,2,"","AvisoCompletarSite");
 		       	
      $("#modalMensajeUxAvisoCompletarSite").on("hidden.bs.modal",function(){
         $("#modalConfiguracionSite").modal("show");    
      });
   } 
}

function agregarModalPrincipalUsuarioSite(modalOptions,functionCallBack,isStatic){
   $(".modal-backdrop").remove();
   $("#"+modalOptions.id).remove();

   $("body")
   .append("<div class='modal' id='"+modalOptions.id+"' role='dialog'>"+
              "<div class='modal-dialog modal-dialog-centered' style='width:100%;max-width: 500px;'>"+
                 "<div class='modal-content'>"+
                    "<div class='modal-header'>"+
                       "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
                       "<h4 class='modal-title'>"+modalOptions.nombre+"</h4>"+
                    "</div>"+
                    "<div class='modal-body'>"+
                        modalOptions.contenido+
                    "</div>"+
                 "</div>"+
              "</div>"+
           "</div>");
   
   $("#"+modalOptions.id).on('shown.bs.modal',functionCallBack);
	
   if(isStatic){
      $('#'+modalOptions.id).modal({
         keyboard: true,
         show : true,
	 backdrop : false
      })	
   }else{
      $("#"+modalOptions.id).modal("show");
   }
}

var hasFalloValidacion;

function ocultarValidacionTrabajadorPorEvidenciaDNI(){
   $("#modalValidacionPorDniTrabajador").modal("hide");    
   
   if(hasFalloValidacion == 1){
      cargarPrimerEstado(); 
   }
}

function verValidacionTrabajadorPorEvidenciaDNI(){
   $("#modalValidacionPorDniTrabajador").remove();
   hasFalloValidacion = 0;
     
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"DNI - Frontal",
       inputForm:"",divContainer:"divEvidenciaDniFrontal"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"DNI - Reverso",
       inputForm:"",divContainer:"divEvidenciaDniReverso"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Foto - Trabajador",
       inputForm:"",divContainer:"divEvidenciaFotoTrab"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
 	             "onclick='ocultarValidacionTrabajadorPorEvidenciaDNI()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
             	    "<i aria-hidden='true' class='fa fa-pencil-square-o'></i> Validar" +
             	 "</button>"} 
   ];
      
   var textFormRegistro = "";
   	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
    
   var opciones={
      id: "modalValidacionPorDniTrabajador",
      nombre: "Validación por DNI - Trabajador",
      contenido: "<form id='formValidacionPorDniTrab' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
      
   crearModalPrincipalUsuario(opciones,function(){},true,true);
     	
   var editarDiv = $("#formValidacionPorDniTrab");
    
   var optionsDniFrontal={
      container: "#divEvidenciaDniFrontal",
      functionCall: function(){
	  validacionSubirEvidencia("DniFrontal",bitsImagenExterno,
             "modalValidacionPorDniTrabajador");
      },
      descargaUrl: "",esNuevo: true,
      idAux: "DniFrontal",isImagen: true,
      evidenciaNombre: "",mensajeAux: ""
   };

   crearFormEvidenciaCompleta(optionsDniFrontal);
   
   var optionsDniReverso={
      container: "#divEvidenciaDniReverso",
      functionCall: function(){
	 validacionSubirEvidencia("DniReverso",bitsImagenExterno,
            "modalValidacionPorDniTrabajador");
      },
      descargaUrl: "",esNuevo: true,
      idAux: "DniReverso",isImagen: true,
      evidenciaNombre: "",mensajeAux: ""
   };

   crearFormEvidenciaCompleta(optionsDniReverso);
	   
   var optionsFotoTrab={
      container: "#divEvidenciaFotoTrab",
      functionCall: function(){
	 validacionSubirEvidencia("FotoTrab",bitsImagenExterno,
            "modalValidacionPorDniTrabajador");
      },
      descargaUrl: "",esNuevo: true,
      idAux: "FotoTrab",isImagen: true,
      evidenciaNombre: "",mensajeAux: ""
   };

   crearFormEvidenciaCompleta(optionsFotoTrab);
     
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarValidacionTrabajadorPorEvidenciaDNI();
   });    
}

function guardarValidacionTrabajadorPorEvidenciaDNI(){
   var campoVacio = true;
    
   var nombreEviDniFrontal = $("#inputEviDniFrontal").val();
   var nombreEviDniReverso = $("#inputEviDniReverso").val();
   var nombreEviFotoTrab = $("#inputEviFotoTrab").val();
	
   if(nombreEviDniFrontal.length == 0 || nombreEviDniReverso.length == 0 || 
      nombreEviFotoTrab.length == 0){
      campoVacio = false; 
      mensajeUx = "<label>Debe subir todas las evidencias.</label>"; 
   }else if(nombreEviDniFrontal == "VOLVER A SUBIR" || nombreEviDniReverso == "VOLVER A SUBIR" || 
      nombreEviFotoTrab == "VOLVER A SUBIR"){
      campoVacio = false; 
      mensajeUx = "<label>Hay una o más evidencias que debe 'VOLVER A SUBIR'.</label>"; 
   }
   
   if(campoVacio){
      var dataParam={};
      var dataParamError={
	 esModal: 1, contenedorModal: "modalValidacionPorDniTrabajador"
      };
      
      convertirImagenABase64("fileEviDniFrontal",1,function(data1){
       dataParam.image1 = data1.EviBase64Aux;
        
       convertirImagenABase64("fileEviDniReverso",0,function(data2){
        dataParam.image2 = data2.EviBase64Aux;
     
        convertirImagenABase64("fileEviFotoTrab",0,function(data3){
         dataParam.face = data3.EviBase64Aux;
	 
	 enviarParametrosExterno("https://umgqc5c4wf.execute-api.us-west-2.amazonaws.com" +
	 "/dev/certifications/verify-document",dataParam,dataParamError,0,1,function(data4){
	    console.log(data4.statusCode);
	    var codigoValidacion = data4.statusCode;
	    
	    switch(codigoValidacion){
	     case 101:  
	     case 400: 
	      var dataParam1={
		 trabajadorId: trabajadorId,    
	         hasValidacion: (codigoValidacion == 101?1:0)     
	      };
		 
	      callAjaxPostNoUnlockAux(URL+'/trabajador/validacion_dni/save',dataParam1,function(data){
	       switch(data.CODE_RESPONSE){
		case "05":  
		 $.unblockUI();  
		 $("#modalValidacionPorDniTrabajador").modal("hide");
				   
		 mensajeUx = (codigoValidacion == 101?"<label>La validación se realizó con éxito.</label>":
	            "<label>No se alcanzó el porcentaje de validación mínimo. Por favor, revise las " +
	               "imágenes que adjuntó y vuelva a intentarlo.</label>");
		 mensajesUx(mensajeUx,1,"","ActualizarModTrabajador");
				    
	         $("#modalMensajeUxActualizarModTrabajador").on("hidden.bs.modal",function(){
	            if(codigoValidacion == 101){
		       cargarPrimerEstado();
	            }else{
	               hasFalloValidacion = 1;
	               $("#modalValidacionPorDniTrabajador").modal("show");
	            }
		 });
										
	         break;
									
                default:
	         console.log("Ocurrió un error al guardar!");
	       }
	      });
	      
	      break;					
		    
	     default:
	      $.unblockUI();
              console.log("Ocurrió un error al validar la informacion!");
	    }
	  });
        });
       });
      });
   }else{
      $("#modalValidacionPorDniTrabajador").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
  	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalValidacionPorDniTrabajador").modal("show");    
      });   
   }
}

var listFullTrabajoHombresColaborador=[];
var objTrabajoHombreColaborador={id:0};

function toggleMenuOpcionTrHom(obj,pindex){
//objTrabajoHombreColaborador=listFullTrabajoHombresColaborador[pindex];
objTrabajoHombreColaborador={id:0};
console.log(" nuevo valor " + objTrabajoHombreColaborador.id);
$(obj).parent(".eventoGeneral").find("ul").toggle();
$(obj).parent(".eventoGeneral").parent().siblings().find("ul").hide(); 	


}
var funcionalidadesTrabajoHombres=[
{id:"opcEditar",nombre:"<i class='fa fa-exchange'></i>&nbsp Editar",functionClick:function(data){editarTrabajoHombreColaborador()}  },
{id:"opcElimnar",nombre:"<i class='fa fa-trash-o'></i>&nbsp Eliminar",functionClick:function(data){eliminarTrabajoHombreColaborador()}  }
                    ]
function marcarSubOpcionTrabajoHombre(pindex,index1){
objTrabajoHombreColaborador=listFullTrabajoHombresColaborador[index1];

console.log(" aqui un  valor " + objTrabajoHombreColaborador.id);
funcionalidadesTrabajoHombres[pindex].functionClick();
$(".listaGestionGosst").hide();
}  

function verRegistroHoras(){
objTrabajoHombreColaborador={id:0};


var dataParam={ 
mdfId:getUrlParameter("mdfId"),
//empresaId:154

	};
callAjaxPost(URL + '/trabajador/trabajo_hombre', dataParam, function(data) {
switch (data.CODE_RESPONSE) {
case "05":
/*var textBackUp ="<a  class='efectoLink' href='"+URL+"/trabajador/backup?empresaId="+getSession("gestopcompanyid")+"'" +
	"target='_blank'><i class='fa fa-download'></i>"+"Descargar"+"</a>"
	*/
	var textSinRevisar="",textRevisar="",textCompletos="";
	var numTrabajoHombresSinRevisar=0,numTrabajoHombresRevisadas=0,numTrabajoHombresCompletadas=0;
			
	listFullTrabajoHombresColaborador=data.list;
	//$(".mod").html("");
	listFullTrabajoHombresColaborador.forEach(function(val,index){
		var menuOpcion="<ul class='list-group listaGestionGosst' >";
		funcionalidadesTrabajoHombres.forEach(function(val1,index1){
			menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionTrabajoHombre("+index1+","+index+")'>"+val1.nombre+" </li>"
		});
		menuOpcion+="</ul>";
		var textEvi="Sin registrar evidencia";
		/* if(val.evidenciaNombre!=""){
			 textEvi="<a class='efectoLink' target='_blank' href='"+URL+"/contratista/trabajo_hombre/evidencia?id="+val.id+"'  >" +
			 		"<i class='fa fa-download' aria-hidden='true'></i>" +val.evidenciaNombre+"</a>";
		 }*/
				numTrabajoHombresCompletadas++;
				textCompletos+=("<div class='eventoGeneral '>" +
						"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionTrHom(this,"+index+")'>" +
						"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
						menuOpcion+
						"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.year+"</strong><br>"+ 
						"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.month.nombre+"</strong><br>"+ 
						"<i class='fa fa-users' aria-hidden='true'></i><strong>Trabajador(es): " +val.numTrabajadores+"</strong><br>"+ 
						"<i class='fa fa-clock-o' aria-hidden='true'></i><strong>" +val.numHoras+"</strong><br>"+ 
						 //textEvi+
						 "</div>"  );

	});
	

	var listYear=[];
var listMonth=data.month;
var current=new Date();

for(var i=-2;i<2;i++){
listYear.push({id:current.getFullYear()+i,nombre:current.getFullYear()+i})
}
	
	var selYearTrabajoHombre= crearSelectOneMenuOblig("selYearTrabajoHombre", "", listYear, current.getFullYear(), 
		"id","nombre");
var selMonthTrabajoHombre= crearSelectOneMenuOblig("selMonthTrabajoHombre", "", listMonth, current.getMonth(), 
		"id","nombre");
	
var listItemsForm=[
/* {sugerencia:"",label:"Año",inputForm:selYearTrabajoHombre},
{sugerencia:"",label:"Mes",inputForm:selMonthTrabajoHombre } ,
			{sugerencia:"",label:"<i class='fa fa-download'></i> Lista Backup ",inputForm: "<input type='text' id='name' name='name' required minlength='4' maxlength='8' size='10'>",divContainer:""},*/
   			{sugerencia:"",label:"<i class='fa fa-calendar'></i> Año ",inputForm: selYearTrabajoHombre,divContainer:""},
   			{sugerencia:"",label:"<i class='fa fa-calendar'></i> Mes ",inputForm: selMonthTrabajoHombre,divContainer:""},
   		        {sugerencia:"",label:"# de trabajadores",inputForm:"<input class='form-control' type='number' id='numberTrabajoTrab'>"},  
        		 {sugerencia:"",label:"Total de HH trabajadas",inputForm:"<input class='form-control' type='number' id='numberTrabajoHoras'>"},  
        		 //{sugerencia:"Ej: registro de HH",label:"Evidencia",inputForm:"" ,divContainer:"divEviTrabajoHombre"} ,
  			//{sugerencia:"",label:"<i class='fa fa-download'></i> Lista Backup ",inputForm: textBackUp,divContainer:""},
   			//{sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel: ",inputForm: "",divContainer:"divExcelImport"},
   			//{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""},
/*            		 {sugerencia:"",label:"",inputForm:"<button type='submit'  class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"},*/ 
        		{sugerencia:"",label:"",inputForm:"<button  id='btnGuardar1' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
   	         
        		 
        		 ];

   	var text="";
   	listItemsForm.forEach(function(val,index)
   	{
   		text+=obtenerSubPanelModuloGeneral(val);
   	});
   	
   	
   	listPanelesPrincipal = [];
    listPanelesPrincipal.push(
		{id:"nuevoMovilTrabHora" ,clase:"divNuevo",nombre:""+"Nuevo registro",form1: 'formImportEvento', claseForm:'eventoGeneral' ,contenido:text},
		{id:"editarMovilTrabHora" ,clase:"contenidoFormVisible",nombre:""+"Editar asd",form1: 'formEditarTrabajoHombre', claseForm:'eventoGeneral' ,contenido:text	},
		{id:"sugCompletadasContratista",clase:"divTrabajoHombreContratistaGeneral",nombre:"Registro Trabajo HH ("+ numTrabajoHombresCompletadas+")", contenido:textCompletos});
   	


   	var contenido1=
   //	"<form id='formImportEvento2' class='eventoGeneral' >" +
   			"<div id='tituloEvento'  class='mod '>" + 
   			
   			
   			"</div>";  
	//"</form>";  
   	var listPaneles= 
   		 {id:"divImportTrabajador",nombre:"Registro de Hora-Trabajador",clase : "listaAuxiliar",contenido:contenido1}
   	                  ;
   	agregarModalPrincipalColaboradorGeneral(listPaneles,function(){/*
	var options=
	{container:"#divExcelImport",
			functionCall:function(){  },
			descargaUrl: "",
			esNuevo:true,
			idAux:"ImportExcel",
			evidenciaNombre:""};
	crearFormEvidenciaCompleta(options);*/
});
   	
    agregarPanelesDivPrincipal1(listPanelesPrincipal,function(){/*
		var options=
		{container:"#divExcelImport",
				functionCall:function(){  },
				descargaUrl: "",
				esNuevo:true,
				idAux:"ImportExcel",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);*/
	});
/*$("#formImportEvento").on("submit",function(e){
	e.preventDefault();
	enviarExcelImportTrabajador();
});
*/
$(".listaGestionGosst").hide();
$(".contenidoFormVisible").hide();

/*	 $('#formNuevaTrabajoHombre').on('submit', function(e) {  
    e.preventDefault();
    objTrabajoHombreColaborador={id:0}
   // verRegistroHoras();
   // guardarTrabajoHombreContratista();
});
*//*	 $('#formEditarTrabajoHombre').on('submit', function(e) {
    e.preventDefault(); 
    guardarTrabajoHombreContratista();
    //verRegistroHoras();
});*/

$("#btnGuardar1").click(function () {
	//saco el valor accediendo a un input de tipo text y name = nombre2 y lo asigno a uno con name = nombre3 

guardarTrabajoHombreContratista();

	});

break;
default:
	alert("nop");
	break;
}});
}


function guardarTrabajoHombreContratista(){

var formDiv=$("#editarMovilTrabHora");
console.log(' valor ' + objTrabajoHombreColaborador.id);
if(objTrabajoHombreColaborador.id==0){
formDiv=$("#nuevoMovilTrabHora");
}
var campoVacio = true; 
var year=formDiv.find("#selYearTrabajoHombre").val();
var month=formDiv.find("#selMonthTrabajoHombre").val();
var numTrabajadores=formDiv.find("#numberTrabajoTrab").val();
var numHoras=formDiv.find("#numberTrabajoHoras").val();
var textoCampos=""; 
if (textoCampos.length==0) {

	var dataParam = {
		//id:"unidadId",
		mdfId:getUrlParameter("mdfId"),
		id : objTrabajoHombreColaborador.id,   
		year:year,month:{id:month},numTrabajadores:numTrabajadores,numHoras:numHoras,
		
		//trabajador:{trabajadorId:parseInt(getSession("trabajadorGosstId"))}
	};

	callAjaxPost(URL + '/trabajador/trabajo_hombre/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05":  
				//	guardarEvidenciaAuto(data.nuevoId,"fileEviTrabajoHombre"+ objTrabajoHombreColaborador.id
					//		,bitsEvidenciaPostulante,"/contratista/trabajo_hombre/evidencia/save",
					//		habilitarTrabajoHombresColaborador(); 
				    verRegistroHoras();
					break;
				default:
					console.log("Ocurrió un error al guardar la sug!");
				}
			});
	 verRegistroHoras();
} else {
	alert("Debe ingresar los campos: "+textoCampos);
} 

}




function agregarPanelesDivPrincipal1(listPanelesPrincipal){
if(listPanelesPrincipal.length==0){
$(".mod")
.append(
		"<div id='divNoResultados'  >" +
		"<div class='tituloSubList'></div>" +
		"<div class='contenidoSubList  justify-content-center  align-items-center'>" +
		"<div class='otro col-auto pt-4'>" +
		
		"</div>" +
		"</div>" +
		"</div>" 
		);
$("#divNoResultados" ).find(".tituloSubList").html( 
	//"<i aria-hidden='true' class='fa fa-list'></i>"+ 
	"Sin resultados"); 
}
listPanelesPrincipal.forEach(function(val,index){
$(".mod")
.append(
		"<div id='"+val.id+"' class='"+val.clase+"' >" +
		"<div class='tituloSubList'></div>" +
		"<div class='contenidoSubList  justify-content-center  align-items-center'>" +
		
		"<div id='"+ val.form +"' class='"+val.claseForm+"' >" +
		"<div class='otro ptm col-auto pt-4' style=' padding-bottom:20px; '>" +
		"</div>" +
	"</div>"+  
		
		"</div>" +
		"</div>" 
		);
var textoBtn="<button class='btn btn-success' style= 'padding:0px 4px 0px 4px'  onclick='cambiarDivSubContenido(this,"+val.proyectoId+")'>" +
"<i class='fa fa-caret-down fa-3x' aria-hidden='true'></i></button>";
$("#"+val.id).find(".tituloSubList").html(textoBtn
	//	+"<i aria-hidden='true' class='fa fa-list'></i>"
		+val.nombre); 
$("#"+val.id).find(".otro").html(
		val.contenido
);
})

}

function cambiarDivSubContenido(obj,proyectoId){
if(proyectoId != null){
proyectoId = parseInt(proyectoId);

listFullProyectoSeguridad.forEach(function(val,index){
if(val.id == proyectoId){
proyectoObj = val;
}
});
}

$(obj).parent(".tituloSubList").siblings().find(".contenidoSubList").hide();
$(obj).parent(".tituloSubList").siblings( ".contenidoSubList" ).toggle();
}

var textoBotonToggleContenido="<button class='btn btn-success'  onclick='cambiarDivSubContenido(this)'>" +
"<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>";
var textoBotonVolverContenido="<button class='btn btn-success' style='float:left'  onclick='volverDivSubContenido(this)'>" +
"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>";

function volverDivSubContenido(obj){
objTrabajoHombreColaborador={id:0};
$(".divListPrincipal>div").show();


$(".contenidoFormVisible").hide();
$(".divNuevo>div").show();



}
function editarTrabajoHombreColaborador(){

$(".divNuevo>div").hide();

var editarDiv=$("#editarMovilTrabHora");
editarDiv.show();
editarDiv.find(".tituloSubList")
.html(textoBotonVolverContenido+" "+"  Editar ");

editarDiv.find("#selYearTrabajoHombre").val(objTrabajoHombreColaborador.year); 
editarDiv.find("#selMonthTrabajoHombre").val(objTrabajoHombreColaborador.month.id); 
editarDiv.find("#numberTrabajoTrab").val(objTrabajoHombreColaborador.numTrabajadores); 
editarDiv.find("#numberTrabajoHoras").val(objTrabajoHombreColaborador.numHoras); 
editarDiv.find("#btnGuardar1").click(function () {
	//saco el valor accediendo a un input de tipo text y name = nombre2 y lo asigno a uno con name = nombre3 
// alert(editarDiv.find("#selYearTrabajoHombre").val());
//alert(editarDiv.find("#selMonthTrabajoHombre").val());
/// alert(editarDiv.find("#numberTrabajoTrab").val());
// alert(editarDiv.find("#numberTrabajoHoras").val());

guardarTrabajoHombreContratista();
objTrabajoHombreColaborador={id:0};
	});


/*
var options=
{container:"#editarMovilTrabHora #divEviTrabajoHombre",
		functionCall:function(){},
		descargaUrl: "/trabajador/trabajo_hombre/evidencia?id="+objTrabajoHombreColaborador.id,
		esNuevo:false,
		idAux:"TrabajoHombre"+objTrabajoHombreColaborador.id,
		evidenciaNombre:objTrabajoHombreColaborador.evidenciaNombre};
crearFormEvidenciaCompleta(options);*/
}


function eliminarTrabajoHombreColaborador() {
$(".mod").modal("hide");

var r = confirm("¿Está seguro de eliminar la sugerencia?");
if (r == true) {
	var dataParam = {
			id :  objTrabajoHombreColaborador.id,
	};

	callAjaxPost(URL + '/trabajador/trabajo_hombre/delete', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05":
				    verRegistroHoras();
					 
					break;
				default:
					alert("Ocurrió un error al eliminar la sug!");
				}
			});
}
}

var indFormacion;
var indEpp;
var indExam;

function procesarPuntajesSeguridadTrabajadores(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		
		indicadoresSeguridad = data.indicadoresSeguridad;

		var indEvento = data.indEvento;
		var indAcc = data.indAcc;
		    indEpp = data.indEpp;
		    indExam = data.indExam;
		    indFormacion = data.indFormacion;
		    listFullIndicadoresTrabajadores=[];
		 
		for (var index = 0; index < listFullTrabajadores.length; index++){
			var indicadorForTrab=0;
			var indicadorEntrega=0;
			var indicadorAcc=1;
			var sumaDiasDescanso=0;
			var diasTrabajados=0;
			var indicadorPart=0;
			var indicadorExamTrab=0;
			listFullIndicadoresTrabajadoresAux.push({
				indicadorFormacion :0,
				indicadorEntregaEpp:1,
				indicadorDisponibilidad:1, 
			        indicadorParticipacion:0,
				indicadorExamenMedico:0,
				id:listFullTrabajadores[index].trabajadorId
			})
			
			
			// ////////
			for (index1 = 0; index1 < indEvento.length; index1++) {
				if (listFullTrabajadores[index].trabajadorId == indEvento[index1].trabajadorId) {
					indicadorPart = indEvento[index1].numEventosReportados;
					index1 = indEvento.length;

				}

			}
			// ////////
			for (var index2 = 0; index2 < indFormacion.length; index2++) {
				if (listFullTrabajadores[index].trabajadorId == indFormacion[index2].trabajadorId) {
				
					
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var capacitacionesTrab=indFormacion[index2].caps;
					var indicadorRangoActual=1;
					for(var index22=0;index22<capacitacionesTrab.length;index22++){
						if(index22==0){
							indicadorRangoActual=0
						}
						var programs=capacitacionesTrab[index22].programsCap;
						
						for(var index31=0;index31<programs.length;index31++){
							if(programs[index31].fechaPlaTexto==null){
								programs[index31].fechaPlaTexto=primerDia;
							}
							if(programs[index31].fechaRealTexto==null){
								programs[index31].fechaRealTexto=programs[index31].fechaPlaTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index31].fechaPlaTexto,programs[index31].fechaRealTexto)
							var  boolEntreFechas=false;
							if(enRangoInicial ){
								 boolEntreFechas=true;
							}
							if(programs[index31].tipoNotaTrabId==1 &&boolEntreFechas ){
								indicadorRangoActual=
									indicadorRangoActual+(1/capacitacionesTrab.length);
								index31=programs.length;
							}
						}
					
					}
					indicadorForTrab=indicadorRangoActual;
					index2 = indFormacion.length;
				}
			}
			//////////
			for (var index3 = 0; index3 < indExam.length; index3++) {
				if (listFullTrabajadores[index].trabajadorId == indExam[index3].trabajadorId) {
				
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var examsTrab=indExam[index3].exams;
					var indicadorRangoActual=0;
					for(var index22=0;index22<examsTrab.length;index22++){
						
						var programs=examsTrab[index22].programsExams;
						
						for(var index33=0;index33<programs.length;index33++){
							if(programs[index33].fechaInicialTexto==null){
								programs[index33].fechaInicialTexto=primerDia;
							}
							if(programs[index33].fechaFinTexto==null){
								programs[index33].fechaFinTexto=programs[index33].fechaInicialTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index33].fechaInicialTexto,programs[index33].fechaFinTexto)
							var  boolEntreFechas=false;
							if(enRangoInicial ){
								 boolEntreFechas=true;
							}
							if(programs[index33].tipoNotaTrabId==1 &&boolEntreFechas ){
							
								indicadorRangoActual=1
								index33=programs.length;

								index22=examsTrab.length;
							}
						}
					
					}
					
					indicadorExamTrab=indicadorRangoActual;
					index3 = indExam.length;
				}
			}
			// //////////
			for (index4 = 0; index4 < indEpp.length; index4++) {

				if (listFullTrabajadores[index].trabajadorId == indEpp[index4].trabajadorId) {
				
					
					var primerDia = new Date();
				
					primerDia=convertirFechaNormal2(primerDia);
					var eppsTrabajador=indEpp[index4].epps;
					var indicadorRangoActual=1;
					for(var index22=0;index22<eppsTrabajador.length;index22++){
						if(index22==0){
							indicadorRangoActual=0
						}
						var programs=eppsTrabajador[index22].programsEpp;
						
						for(var index31=0;index31<programs.length;index31++){
							if(programs[index31].fechaPlanificadaTexto==null){
								programs[index31].fechaPlanificadaTexto=primerDia;
							}
							if(programs[index31].fechaEntregaTexto==null){
								programs[index31].fechaEntregaTexto=programs[index31].fechaPlanificadaTexto;
							}
							var enRangoInicial=fechaEnRango(primerDia,programs[index31].fechaPlanificadaTexto,programs[index31].fechaEntregaTexto)
							var  boolEntreFechas=false;
							if(enRangoInicial ){
								 boolEntreFechas=true;
							}
							if(programs[index31].tipoNotaTrabId!=null &&boolEntreFechas ){
								indicadorRangoActual=
									indicadorRangoActual+(1/eppsTrabajador.length);
								index31=programs.length;
							}
						}
					
					}
					indicadorEntrega=indicadorRangoActual;
					index4 = indEpp.length;
				}
			}
			// //////////
			for (index5 = 0; index5 < indAcc.length; index5++) {
				if (listFullTrabajadores[index].trabajadorId == indAcc[index5].trabajadorId) {
					indicadorAcc = indAcc[index5].indicadorDiasDescanso;
					sumaDiasDescanso=indAcc[index5].sumaDiasDescanso;
					diasTrabajados=   indAcc[index5].diasTrabajados
					index5 = indAcc.length;

				}

			}
			// ///////////
			listFullIndicadoresTrabajadoresAux[index].indicadorFormacion = indicadorForTrab;
			listFullIndicadoresTrabajadoresAux[index].indicadorEntregaEpp = indicadorEntrega;
			listFullIndicadoresTrabajadoresAux[index].indicadorDisponibilidad = indicadorAcc;
			listFullIndicadoresTrabajadoresAux[index].sumaDiasDescanso = sumaDiasDescanso;
			listFullIndicadoresTrabajadoresAux[index].diasTrabajados = diasTrabajados;
			listFullIndicadoresTrabajadoresAux[index].indicadorParticipacion = indicadorPart;
			listFullIndicadoresTrabajadoresAux[index].indicadorExamenMedico = indicadorExamTrab;
			// //////////
			var promedio = (indicadorForTrab + indicadorExamTrab
					+ indicadorEntrega + indicadorAcc + 
					((indicadorPart / indicadoresSeguridad.indicadorMinimoParticipacion)>1?1:(indicadorPart / indicadoresSeguridad.indicadorMinimoParticipacion))

			) / 5;
	
			 
		$("#tr"+listFullTrabajadores[index].trabajadorId+" #tdprom").html(
				  pasarDecimalPorcentaje(promedio, 2)
									 	
				);
			 
		listFullIndicadoresTrabajadores.push(
				{
					id:listFullTrabajadores[index].trabajadorId,
					promedio:pasarDecimalPorcentaje(promedio, 2)
				}
			)
		}
		break;
		default:
			alert("No pOS");
		break;
}
	
}

function configuracionTrabajador(){ 
var listItemsForm=[
   			{sugerencia:"",label:"HH por mes",inputForm: "<input type='number' class='form-control' id='inputHorasMes' >",divContainer:""},
   			{sugerencia:"",label:"HH por año ",inputForm: "<input type='number' class='form-control' id='inputHorasAnio' >",divContainer:""},
   			{sugerencia:"",label:"HH en total ",inputForm: "<input type='number' class='form-control' id='inputHorasTotal' >",divContainer:""},
   			{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""}
      ];

   	var text="";
   	listItemsForm.forEach(function(val,index)
   	{
   		text+=obtenerSubPanelModuloGeneral(val);
   	});
   	var contenido=
   		"<form id='formConfiguracion' class='eventoGeneral' >" +
   			"<div id='tituloEvento'>" + 
   				text+
   			"</div>"+
   			"</div>" +
   		"</form>";  
   	var listPaneles= 
   		 {id:"divModalConfiguracion",nombre:"Configuración",clase : "listaAuxiliar",contenido:contenido}
   	                  ;
   	agregarModalPrincipalColaboradorGeneral(listPaneles,function(){ });
   	    var unidadObj = {
   		    id : getUrlParameter("mdfId") 
   	    }
   	 callAjaxPost(URL+"/trabajador/configuracion",unidadObj,function(data){
   	  $("#inputHorasMes").val(data.unidad.horasMes);
   	$("#inputHorasAnio").val(data.unidad.horasAnio);
   	$("#inputHorasTotal").val(data.unidad.horasTotal);
   		
   	    });
$("#formConfiguracion").on("submit",function(e){
	e.preventDefault();
	guardarConfiguracionTrabajador();
});
}
function guardarConfiguracionTrabajador(){
    var unidadObj = {
	    id : getUrlParameter("mdfId"),
	    horasMes : $("#inputHorasMes").val(),
	    horasAnio : $("#inputHorasAnio").val(),
	    horasTotal : $("#inputHorasTotal").val()
    }
    callAjaxPost(URL+"/trabajador/configuracion/save",unidadObj,function(data){
	alert("Configuración actualizada!");
	$("#divModalConfiguracion").modal("hide");
    });
}

function aplicarBuscadorTrabajador(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    
   var valBuscarValorTrabajador = igualarStringBuscar($("#valBuscarValorTrabajador").val());
   listFullTrabajadoresBuscador = [];
   busquedaActiva = 1;numPaginaActual = 1;
  	
   listFullTrabajadores.forEach(function(val,index){
      if(igualarStringBuscar(val.trabajadorNombre).indexOf(valBuscarValorTrabajador) != -1 ||
	 igualarStringBuscar(val.dni).indexOf(valBuscarValorTrabajador) != -1){
	 listFullTrabajadoresBuscador.push(val);
      }
   }); 
   
   cambiarPaginaTrabajador();
}

function reiniciarBuscadorTrabajador(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
   $("#valBuscarValorTrabajador").val("").focus();
   busquedaActiva = 0;numPaginaActual = 1;
    
   cambiarPaginaTrabajador();
}

function ocultarCambiarPasswordEncriptadaTrabajador(){
   $("#modalActualizarClaveTrab").modal("hide");
}

function verCambiarPasswordEncriptadaTrabajador(){
   mensajeUx="<label>¿Está seguro de cambiar la contraseña encriptada?</label>"	
   mensajesUx(mensajeUx,3,"","ConfirmarCambioPasswordTra");
	 
   $("#btnDevolverValorConfirmarCambioPasswordTra").on("click",function(){
      $("#modalActualizarClaveTrab").remove();   

      var contenido = "";
    	
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Nueva contraseña",inputForm:""},
         {sugerencia:"<label>*Debe incluir mínimo 8 caracteres.</label>",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"",
          inputForm:"<input id='inputNuevaClaveAccesoTrab' type='text' class='form-control' autofocus>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		        "onclick='ocultarCambiarPasswordEncriptadaTrabajador()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
          inputForm:"<button type='button' class='btn btn-success' onclick='guardarCambiarPasswordEncriptadaTrabajador()' " +
           		    "style='float:right;font-size:18px;'>" +
      	  	       "<i class='fa fa-floppy-o'></i> Guardar" +
      	  	    "</button>"}
      ];
      	  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
      	  				
      var modalOptions={
         id: "modalActualizarClaveTrab",
         nombre: "<i class='fa fa-refresh'></i> Cambiar contraseña",
         contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
       	  				
      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   });    
}

function guardarCambiarPasswordEncriptadaTrabajador(){
   var campoVacio = true;
    
   var psw1 = $("#inputNuevaClaveAccesoTrab").val().trim();
    	
   if(psw1.length < 8){
      campoVacio = false;
      mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
   }
     	
   if(campoVacio){
      var dataParam={
	 trabajadorId: trabajadorId,fechaUltimaActClaveTexto: trabajadorObj.fechaUltimaActClaveTexto,contraseniaNueva: psw1
      };
 	    
      callAjaxPost(URL+'/trabajador/password/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
               $("#modalActualizarClaveTrab").modal("hide"); 
 	       
 	       mensajeUx = data.mensaje;
 	       mensajesUx(mensajeUx,1,"","ActualizarClave");
 	       
 	       $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
 	          $("#valBuscarValorTrabajador").val("");cargarPrimerEstado();
 	       });  
 	 		       
 	       break;
 	 							
 	    default:
 	       alert("Ocurrió un error al actualizar la contraseña!");
         }    	
      });
   }else{
      $("#modalActualizarClaveTrab").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ActualizarClave");
       
      $("#modalMensajeUxActualizarClave").on("hidden.bs.modal",function(){
 	 $("#modalActualizarClaveTrab").modal("show");
      });  
   }    
}

var trabDestinatarioId,trabDestinatarioObj={};
var banderaEdicionTrabDestinatario = false;
var listTrabajadoresDestinatarios = [],listRiesgoPotencial = [],listUnidadesTrabDest = [];
var unidadTextTrabDest;

function volverTrabajadoresDestinatarios(){
    $("#modalTrabajadoresDestinatarios").modal("hide");
}

function verTrabajadoresDestinatarios(){
    $("#modalTrabajadoresDestinatarios").remove();

    var contenido = "";

    var buttonVolverPrincipal =
        "<button id='btnVolverTrabDestinatario' type='button' class='btn btn-info' style='margin-right:5px' " +
                "onclick='volverTrabajadoresDestinatarios()' title='Regresar a la vista principal'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-2x fa-envelope-o'></i> <i class='fa fa-user'></i>" +
        "</button>";

    var buttonNuevo =
        "<button id='btnNuevoTrabDestinatario' type='button' class='btn btn-success' style='margin-right:5px' " +
                "title='Registrar un nuevo trabajador destinatario.' onclick='nuevoTrabajadoresDestinatarios()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
        "</button>";

    var buttonCancelar =
        "<button id='btnCancelarTrabDestinatario' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='cancelarTrabajadoresDestinatarios()' title='Cancelar'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button id='btnGuardarTrabDestinatario' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarTrabajadoresDestinatarios()' title='Guardar'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonEliminar =
        "<button id='btnEliminarTrabDestinatario' type='button' class='btn btn-danger' style='margin-right:5px' " +
                "title='Eliminar.' onclick='eliminarTrabajadoresDestinatarios()'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    unidadTextTrabDest = (parseInt(getSession("gestopcompanyid")) == 714?"País - Empresa":"Unidad");

    var modalOptions={
        maxWidth:"95%",id:"modalTrabajadoresDestinatarios",
        nombre:"<i class='fa fa-user'></i> Trabajadores destinatarios",
        contenido:
             buttonVolverPrincipal+buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar +
            "<div class='wrapper' id='wrapperTrabajadoresDestinatarios'>" +
                "<table id='tblTrabajadoresDestinatarios' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th class='tb-acc' style='width:250px'>Trabajador(a)</th>" +
                            "<th class='tb-acc' style='width:250px'>Correo</th>" +
                            "<th class='tb-acc' style='width:200px'>Nivel de potencialidad del evento (accidente/incidentes)</th>" +
                            "<th class='tb-acc' style='width:200px'>"+unidadTextTrabDest+"</th>" +
                            "<th class='tb-acc' style='width:150px'>Registrado el</th>" +
                            "<th class='tb-acc' style='width:150px'>Actualizado el</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperTrabajadoresDestinatarios",190);
    cargarTrabajadoresDestinatarios();
}

function cargarTrabajadoresDestinatarios(){
    banderaEdicionTrabDestinatario = false;

    $("#btnVolverTrabDestinatario").show();$("#btnCancelarTrabDestinatario").hide();$("#btnGuardarTrabDestinatario").hide();
    $("#btnNuevoTrabDestinatario").show();$("#btnEliminarTrabDestinatario").hide();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPost(URL+"/trabajador/destinatario",dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            listTrabajadoresDestinatarios = data.listTrabajadoresDestinatarios;listRiesgoPotencial = data.listRiesgoPotencial;
            listUnidadesTrabDest = data.listUnidades;

            $("#tblTrabajadoresDestinatarios tbody tr").remove();

            listTrabajadoresDestinatarios.forEach(function(val,index){
                var trabajadorCorreo = (val.trabajador.correo.length == 0?"------":val.trabajador.correo),
                    riesgoPotencialAsig = (val.riesgoPotencialAsignadosNombre.length == 0?"------":val.riesgoPotencialAsignadosNombre),
                    unidadAsig = (val.unidadAsignadasNombre.length == 0?"------":val.unidadAsignadasNombre);

                $("#tblTrabajadoresDestinatarios tbody").append(
                    "<tr id='trTrabDest"+val.id+"' onclick='editarTrabajadoresDestinatarios("+index+")'>" +
                        "<td id='nombreTrabDest"+val.id+"'>"+val.trabajador.nombre+"</td>" +
                        "<td id='correoTrabDest"+val.id+"'>"+trabajadorCorreo+"</td>" +
                        "<td id='riesgoPotencialTrabDest"+val.id+"'>"+riesgoPotencialAsig+"</td>" +
                        "<td id='unidadTrabDest"+val.id+"'>"+unidadAsig+"</td>" +
                        "<td id='fechaRegistroTrabDest"+val.id+"'>"+val.fechaRegistroTexto+"</td>" +
                        "<td id='fechaActTrabDest"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +
                    "</tr>");
            });
        }else{
            console.log("NOPNPO");
        }

        goheadfixedY("#tblTrabajadoresDestinatarios","#wrapperTrabajadoresDestinatarios");
        formatoCeldaSombreableTabla(true,"tblTrabajadoresDestinatarios");
    });
}

function cancelarTrabajadoresDestinatarios(){
    cargarTrabajadoresDestinatarios();
}

function editarTrabajadoresDestinatarios(pindex){
    if(!banderaEdicionTrabDestinatario){
        formatoCeldaSombreableTabla(false,"tblTrabajadoresDestinatarios");
        trabDestinatarioId = listTrabajadoresDestinatarios[pindex].id;
        trabDestinatarioObj = listTrabajadoresDestinatarios[pindex];

        $("#trTrabDest"+trabDestinatarioId).addClass("fila-edicion");

        $("#fechaActTrabDest"+trabDestinatarioId).html("<label>*Automático.</label>");

        crearCheckListGeneral("modalTrabajadoresDestinatarios","Nivel de potencialidad del evento",
            "RiesPotTrabDest",listRiesgoPotencial,"RiesgoPotencialTrabDest",cargarCheckListRiesgoPotencialTrabDest);

        crearCheckListGeneral("modalTrabajadoresDestinatarios",unidadTextTrabDest,
            "UniTrabDest",listUnidadesTrabDest,"UnidadTrabDest",cargarCheckListUnidadTrabDest);

        banderaEdicionTrabDestinatario = true;

        $("#btnVolverTrabDestinatario").hide();$("#btnCancelarTrabDestinatario").show();$("#btnGuardarTrabDestinatario").show();
        $("#btnNuevoTrabDestinatario").hide();$("#btnEliminarTrabDestinatario").show();
    }
}

function nuevoTrabajadoresDestinatarios(){
    if(!banderaEdicionTrabDestinatario){
        formatoCeldaSombreableTabla(false,"tblTrabajadoresDestinatarios");
        trabDestinatarioObj = {id: 0};trabDestinatarioId = 0;

        $("#tblTrabajadoresDestinatarios tbody").prepend(
            "<tr>" +
                "<td><input class='form-control' id='inputBuscarTrabajadorDestinatario'>" +
                    "<div id='divSelTrabajadorDestinatario'></div>" +
                    "<label>*Buscar trabajador por DNI y/o nombre (debe ingresar 3 caracteres como mínimo).</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td id='riesgoPotencialTrabDest"+trabDestinatarioId+"'></td>" +
                "<td id='unidadTrabDest"+trabDestinatarioId+"'></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>...</label></td>" +
            "</tr>");

        buscarTrabajadorDestinatario();

        crearCheckListGeneral("modalTrabajadoresDestinatarios","Nivel de potencialidad del evento",
            "RiesPotTrabDest",listRiesgoPotencial,"RiesgoPotencialTrabDest",ocultarCheckListRiesgoPotencialTrabDest);

        crearCheckListGeneral("modalTrabajadoresDestinatarios",unidadTextTrabDest,
            "UniTrabDest",listUnidadesTrabDest,"UnidadTrabDest",ocultarCheckListUnidadTrabDest);

        $("#btnVolverTrabDestinatario").hide();$("#btnCancelarTrabDestinatario").show();$("#btnGuardarTrabDestinatario").show();
        $("#btnNuevoTrabDestinatario").hide();$("#btnEliminarTrabDestinatario").hide();

        banderaEdicionTrabDestinatario = true;
    }else{
        alert("Guarde primero.");
    }
}

var listTrabDestinatarioBuscadorAux=[];

function buscarTrabajadorDestinatario(){
    var nombre = $("#inputBuscarTrabajadorDestinatario").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1,hasTrabajadorDestinatario:1
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listTrabDestinatarioBuscadorAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selTrabajadorDestinatario = crearSelectOneMenuOblig("selTrabajadorDestinatario",
                "",listTrabDestinatarioBuscadorAux,"","trabajadorId","nombre");

            $("#divSelTrabajadorDestinatario").html(selTrabajadorDestinatario);
            $("#inputBuscarTrabajadorDestinatario").attr("onkeyup","buscarTrabajadorDestinatario()");
        });
    }else{
        listTrabDestinatarioBuscadorAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selTrabajadorDestinatario = crearSelectOneMenuOblig("selTrabajadorDestinatario",
            "",listTrabDestinatarioBuscadorAux,"","trabajadorId","nombre");

        $("#divSelTrabajadorDestinatario").html(selTrabajadorDestinatario);
        $("#inputBuscarTrabajadorDestinatario").attr("onkeyup","buscarTrabajadorDestinatario()");
    }
}

function ocultarCheckListRiesgoPotencialTrabDest(){
    var textRiesgoPotencialAsig = "";

    listRiesgoPotencial.forEach(function(val,index){
        var isAsignado = ($("#checkAsignadoRiesPotTrabDest"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textRiesgoPotencialAsig += (textRiesgoPotencialAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textRiesgoPotencialAsig = (textRiesgoPotencialAsig.length == 0?"------":textRiesgoPotencialAsig);

    $("#riesgoPotencialTrabDest"+trabDestinatarioId).addClass("linkGosst").on("click",function(){
        verCheckListRiesgoPotencialTrabDest();
    }).html(textRiesgoPotencialAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListRiesPotTrabDest").modal("hide");$("#modalTrabajadoresDestinatarios").modal("show");
}

function verCheckListRiesgoPotencialTrabDest(){
    $("#modalCheckListRiesPotTrabDest").modal("show");$("#modalTrabajadoresDestinatarios").modal("hide");
}

function cargarCheckListRiesgoPotencialTrabDest(){
    if(trabDestinatarioObj.riesgoPotencialAsignadosId.length != 0){
        var riesgoPotencialAsignadosId = trabDestinatarioObj.riesgoPotencialAsignadosId.split(",");

        riesgoPotencialAsignadosId.forEach(function(val1){
            var checkboxRiesgoPotencial = document.getElementById('checkAsignadoRiesPotTrabDest'+val1);
            checkboxRiesgoPotencial.checked = true;
        });
    }

    ocultarCheckListRiesgoPotencialTrabDest();
}

function ocultarCheckListUnidadTrabDest(){
    var textUnidadAsig = "";

    listUnidadesTrabDest.forEach(function(val,index){
        var isAsignado = ($("#checkAsignadoUniTrabDest"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textUnidadAsig += (textUnidadAsig.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textUnidadAsig = (textUnidadAsig.length == 0?"------":textUnidadAsig);

    $("#unidadTrabDest"+trabDestinatarioId).addClass("linkGosst").on("click",function(){
        verCheckListUnidadTrabDest();
    }).html(textUnidadAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListUniTrabDest").modal("hide");$("#modalTrabajadoresDestinatarios").modal("show");
}

function verCheckListUnidadTrabDest(){
    $("#modalCheckListUniTrabDest").modal("show");$("#modalTrabajadoresDestinatarios").modal("hide");
}

function cargarCheckListUnidadTrabDest(){
    if(trabDestinatarioObj.unidadAsignadasId.length != 0){
        var unidadAsignadasId = trabDestinatarioObj.unidadAsignadasId.split(",");

        unidadAsignadasId.forEach(function(val1){
            var checkboxUnidad = document.getElementById('checkAsignadoUniTrabDest'+val1);
            checkboxUnidad.checked = true;
        });
    }

    ocultarCheckListUnidadTrabDest();
}

function guardarTrabajadoresDestinatarios(){
    var campoVacio = true;

    var trabajadorId = parseInt($("#selTrabajadorDestinatario").val());

    var listRiesgoPotencialAsignados = [];
    var textoRiesgosPotencialesAsignados = "";

    listRiesgoPotencial.forEach(function(val){
        var isAsignado = ($("#checkAsignadoRiesPotTrabDest"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            listRiesgoPotencialAsignados.push({id:val.id});

            textoRiesgosPotencialesAsignados += (textoRiesgosPotencialesAsignados.length == 0?val.id:","+val.id);
        }
    });

    var listUnidadAsignadas = [];
    var textoUnidadesAsignadas = "";

    listUnidadesTrabDest.forEach(function(val){
        var isAsignado = ($("#checkAsignadoUniTrabDest"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            listUnidadAsignadas.push({id:val.id});

            textoUnidadesAsignadas += (textoUnidadesAsignadas.length == 0?val.id:","+val.id);
        }
    });

    if(trabajadorId == -1){
        campoVacio = false;
    }

    if(campoVacio){
        var dataParam={
            id:trabDestinatarioId,empresaId:parseInt(getSession("gestopcompanyid")),riesgosPotenciales:listRiesgoPotencialAsignados,
            textoRiesgosPotencialesAsignados:textoRiesgosPotencialesAsignados,unidades:listUnidadAsignadas,textoUnidadesAsignadas:textoUnidadesAsignadas
        };

        if(trabDestinatarioId == 0){
            dataParam.trabajadorId = trabajadorId;
        }

        callAjaxPost(URL+'/trabajador/destinatario/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalTrabajadoresDestinatarios").modal("hide");

                    mensajeUx="<label>El registro trabajador destinatario fue guardado con éxito.<label>";
                    mensajesUx(mensajeUx,1,"","ActualizarTrabDest");

                    $("#modalMensajeUxActualizarTrabDest").on("hidden.bs.modal",function(){
                        $("#modalTrabajadoresDestinatarios").modal("show");cargarTrabajadoresDestinatarios();
                    });

                    break;

                default:
                    console.log("Ocurrió un error al guardar el trabajador destinatario!");
            }
        });
    }else{
        $("#modalTrabajadoresDestinatarios").modal("hide");

        mensajeUx="<label>Debe seleccionar al trabajador.<label>";
        mensajesUx(mensajeUx,2,"","ValidacionTrabDest");

        $("#modalMensajeUxValidacionTrabDest").on("hidden.bs.modal",function(){
            $("#modalTrabajadoresDestinatarios").modal("show");
        });
    }
}

function eliminarTrabajadoresDestinatarios(){
    $("#modalTrabajadoresDestinatarios").modal("hide");

    if(trabDestinatarioObj.riesgoPotencialAsignadosNombre.length == 0 && trabDestinatarioObj.unidadAsignadasNombre.length == 0){
        mensajeUx="<label>¿Está seguro de eliminar al trabajador destinatario seleccionado?</label>";
        mensajesUx(mensajeUx,3,"","ConfTrabDest");

        $("#btnDevolverValorConfTrabDest").on("click",function(){
            var dataParam={
                id:trabDestinatarioId
            };

            callAjaxPost(URL+'/trabajador/destinatario/delete',dataParam,function(data){
                switch(data.CODE_RESPONSE){
                    case "05":
                        mensajeUx="<label>El registro trabajador destinatario seleccionado se ha eliminado correctamente.</label>";
                        mensajesUx(mensajeUx,1,"","ActualizarTrabDest");

                        $("#modalMensajeUxActualizarTrabDest").on("hidden.bs.modal",function(){
                            $("#modalTrabajadoresDestinatarios").modal("show");cargarTrabajadoresDestinatarios();
                        });

                        break;

                    default:
                        alert("Ocurrió un error al eliminar el registro trabajador destinatario!");
                }
            });
        });

        $("#btnRegresarPrevioConfTrabDest").on("click",function(){
            $("#modalTrabajadoresDestinatarios").modal("show");
        });
    }else{
        mensajeUx="<label>No se puede eliminar el registro trabajador destinatario seleccionado " +
            "porque tienes valores asignados.<label>";
        mensajesUx(mensajeUx,2,"","EliminarTrabDest");

        $("#modalMensajeUxEliminarTrabDest").on("hidden.bs.modal",function(){
            $("#modalTrabajadoresDestinatarios").modal("show");
        });
    }
}

function autoSmartImportTrabajadores(){
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/trabajador/import/auto/masivo/save',dataParam,1,1,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                mensajeUx = "<label style='text-align:left;'>"+data.mensaje+"</label>";
                mensajesUx(mensajeUx,4,"","");

                break;

            default:
                alert("Ocurrió un error al actualizar la planilla de trabajadores!");
        }
    });
}