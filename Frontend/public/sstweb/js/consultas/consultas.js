/*Buscar ruc empresa*/

var habilitadoConsultaQR;

$(function(){
   $("form").hide();
   
   if(getUrlParameter("empresaId")){
      buscarEmpresaRuc();
   }else if (getUrlParameter("idContratista") != undefined){
      habilitadoConsultaQR = 1;
      
      if(getUrlParameter("idTrabajadorContratista") != undefined){
         previoBuscarDatosTrabajadorContratista(0);
      }else if(getUrlParameter("idVehiculoMaquinaria") != undefined){
	 buscarDatosVehiculoMaquinaria(0);
      }
   }else{
      $("#formBuscarEmpresa").show().on("submit",buscarEmpresaRuc);
   }
});

var visitanteObj = {};
var listTipoVisitante = [],listSeccionesTrabContratista = [];
var mensajeUx;

var listPerfilPersonalExterno=[
   {id:1,nombre:"Visitante"},{id:2,nombre:"Trabajador contratista"},{id:3,nombre:"Contratista"},
   /*{id:4,nombre:"Trabajador interno"},*/{id:5,nombre:"Vehículo/Maquinaria"},{id:6,nombre:"Equipo/Herramienta"}
];

var listPerfilPersonalExternoInkacrops=[
   {id:2,nombre:"Trabajador - Contratista"},{id:3,nombre:"Contratista"}
];

function verTopGosst(){
   $("body")
   .prepend($("<div>",{class:"topGosst",
                       html:"<button onclick='verMenuVisitante()'> Opciones" +
                       	       "<i class='fa fa-list'></i>" +
                       	    "</button>"}));
    
   $(".topGosst").append($("<div>",{id:"menuVisitante",click:verMenuVisitante}));
   
   $("#menuVisitante").hide() 
//   .append($("<div>",{class:"opcionMenuVisitante",
//                      html:"<i class='fa fa-download'></i> Excel tabla resumen",
//                      click:valoresPreviosContratistasTablaResumen}))
   .append($("<div>",{class:"opcionMenuVisitante",
                      html:"<i class='fa fa-download'></i> Consolidado general -  trabajadores contratista",
                      click:valoresPreviosExcelConsolidadoTrabajadoresContratista}))
   .append($("<div>",{class:"opcionMenuVisitante opcionCerrarSession",
                      html:"<i class='fa fa-sign-out fa-rotate-180'></i> Cerrar sesión",
                      click:cerrarSesionVisitante}));
}

function verMenuVisitante(){
   $(".topGosst button").toggleClass("topButtonActive");
   $("#menuVisitante").toggle();
}

function ocultarValoresPreviosContratistasTablaResumen(){
   $("#modalValPrevContratistaTblResumen").modal("hide");
}

function valoresPreviosContratistasTablaResumen(){
   $("#modalValPrevContratistaTblResumen").remove();
    
   var dataParam={ 
      empresaId: parseInt(getSession("empresaId"))
   };
 	   
   callAjaxPost(URL+'/public/contratista/buscar',dataParam,function(data){
      var listContratistasEmpresa = data.contratistas;
      var listVisitantesEmpresa = data.visitantes;
        
      var contenido = "";
      
      var listBooleanSiNo = listBoolean.sort(function(val,val2){
	 return val2.id - val.id;
      });
      
      var radioIncluirRegTraCon = crearRadiosAuto("radioIncluirRegTraCon",
         listBooleanSiNo,"1","id","nombre","habilitarMultiselectTraCon");
      
      var radioIncluirRegVis = crearRadiosAuto("radioIncluirRegVis",
         listBooleanSiNo,"1","id","nombre","habilitarMultiselectVis");
      
      var radioIncluirRegIndVisTraCon = crearRadiosAuto("radioIncluirRegIndVisTraCon",
	 listBooleanSiNo,"0","id","nombre","habilitarIntervaloFechaInduccion");
      
      var listContenido=[
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
	  label:"¿Incluir los registros de los trabajadores de las contratistas?",
          inputForm:radioIncluirRegTraCon},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Contratistas*",
          inputForm:"",divContainer:"divContratistasActivosTblResumen"},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
          label:"<span style='font-size:10px;font-weight:bolder;'>" +
              	   "*Se puede buscar por RUC y/o nombre del contratista." +
                "</span>",
          inputForm:""},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//   	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
//   	  label:"¿Incluir registro de los visitantes en el excel?",
//          inputForm:radioIncluirRegVis},
   	 {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
   	  label:"¿Incluir los registros de los visitantes?",
          inputForm:radioIncluirRegVis},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Visitantes**",
          inputForm:"",divContainer:"divVisitantesActivosTblResumen"},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
          label:"<span style='font-size:10px;font-weight:bolder;'>" +
                   "**Se puede buscar por Número de documento de identidad, " +
                   "apellidos y/o nombre del visitante." +
                "</span>",
          inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
      	  label:"¿Incluir todos los registros sin inducción realizada?***",
          inputForm:radioIncluirRegIndVisTraCon},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
          label:"<span style='font-size:10px;font-weight:bolder;'>" +
          	   "***Al marcar 'No', se habilitarán los campos para filtrar " +
                   "los registros según el intervalo de fecha." +
                "</span>",
          inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
	       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	                "Intervalo - Fecha de inducción " +
	             "</span>"},
         {sugerencia:"",label:"Fecha inicio",
      	  inputForm:"<input type='date' id='fechaInicioIndPerExt' class='form-control'>"},
      	 {sugerencia:"",label:"Fecha fin",
      	  inputForm:"<input type='date' id='fechaFinIndPerExt' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
   	  label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
   	   		"onclick='ocultarValoresPreviosContratistasTablaResumen()'>" +
   	       	   "<i class='fa fa-times'></i> Cancelar" +
   	       	"</button>",
   	  inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
   	   		    "onclick='descargarExcelTablaResumen()'>" +
   	               "<i class='fa fa-download'></i> Descargar" +
   	            "</button>"}
      ];
   	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   	
      var modalOptions={
   	 id: "modalValPrevContratistaTblResumen",
   	 nombre: "<i class='fa fa-filter'></i> Filtro - Excel tabla resumen <br>",
   	 contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
      };
   	
      crearModalPrincipalUsuario(modalOptions,function(){
         crearSelectOneMenuObligMultipleCompleto("selMulContratistasTablaResumen","",listContratistasEmpresa,
            "id","nombre","#divContratistasActivosTblResumen","Todos");
          
         crearSelectOneMenuObligMultipleCompleto("selMulVisitantesTablaResumen","",listVisitantesEmpresa,
            "id","nombre","#divVisitantesActivosTblResumen","Todos");
      },false);
       
      $("#modalValPrevContratistaTblResumen").modal("show");
      
      habilitarMultiselectTraCon(1);
      habilitarMultiselectVis(1);
      habilitarIntervaloFechaInduccion(0);
   });
}

function habilitarMultiselectTraCon(value){
   if(value == 1){
      // habilitamos
      $("#selMulContratistasTablaResumen_chosen").show();
   }else{
      // deshabilitamos
      $("#selMulContratistasTablaResumen_chosen").hide();
   }
}

function habilitarMultiselectVis(value){
   if(value == 1){
      // habilitamos
      $("#selMulVisitantesTablaResumen_chosen").show();
   }else{
      // deshabilitamos
      $("#selMulVisitantesTablaResumen_chosen").hide();
   }
}

function habilitarIntervaloFechaInduccion(value){
   if(value == 0){
      // habilitamos
      document.getElementById("fechaInicioIndPerExt").disabled=false;
       
      document.getElementById("fechaFinIndPerExt").disabled=false;
      
      var hoy = obtenerFechaActual();
      
      $("#fechaInicioIndPerExt").val(sumaFechaDias(-90,hoy));
      $("#fechaFinIndPerExt").val(hoy);
   }else{
      // deshabilitamos
      document.getElementById("fechaInicioIndPerExt").disabled=true;
      document.getElementById("fechaInicioIndPerExt").value=null;
       
      document.getElementById("fechaFinIndPerExt").disabled=true;
      document.getElementById("fechaFinIndPerExt").value=null;
   }
}

function descargarExcelTablaResumen(){
   var incluirRegIndVisTraCon = parseInt($("input[name='radioIncluirRegIndVisTraCon']:checked").val());
   var fechaInicioInd = $("#fechaInicioIndPerExt").val();
   var fechaFinInd = $("#fechaFinIndPerExt").val();
   var intervaloDiasFiltro = restaFechas($("#fechaInicioIndPerExt").val(),$("#fechaFinIndPerExt").val());
    
   if(incluirRegIndVisTraCon == 0 && (fechaInicioInd.length == 0 || 
      fechaFinInd.length == 0)){
      $("#modalValPrevContratistaTblResumen").modal("hide");
       
      mensajeUx = "<label>Debe completar los campos fecha inicio y fecha fin del " +
       		  "intervalo - fecha de inducción.</label>";
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposFiltroRepPerExt");

      $("#modalMensajeUxAvisoCompletarCamposFiltroRepPerExt").on("hidden.bs.modal",function(){
         $("#modalValPrevContratistaTblResumen").modal("show");
      });
       
      return;
   }else if(incluirRegIndVisTraCon == 0 && (intervaloDiasFiltro > 90 || intervaloDiasFiltro < 1)){
       $("#modalValPrevContratistaTblResumen").modal("hide");
        
       mensajeUx = "<label>El intervalo de fecha no puede ser mayor a 90 días ni menor que uno.</label>";
       mensajesUx(mensajeUx,2,"","AvisoCompletarCamposFiltroRepPerExt");

       $("#modalMensajeUxAvisoCompletarCamposFiltroRepPerExt").on("hidden.bs.modal",function(){
          $("#modalValPrevContratistaTblResumen").modal("show");
       });
        
       return;
    }
   
   var radioIncluirRegTraCon = parseInt($("input[name='radioIncluirRegTraCon']:checked").val());
    
   var listContratistasId = [];
   
   if(radioIncluirRegTraCon == 1){
      var contratistasId = $("#selMulContratistasTablaResumen").val();
    
      if(contratistasId != null){
         contratistasId.forEach(function(val){
 	    listContratistasId.push(parseInt(val));
         });
      }
   }
   
   var radioIncluirRegVis = parseInt($("input[name='radioIncluirRegVis']:checked").val());
   
   var listVisitantesId = [];
   
   if(radioIncluirRegVis == 1){
      var visitantesId = $("#selMulVisitantesTablaResumen").val();
    
      if(visitantesId != null){
         visitantesId.forEach(function(val){
 	    listVisitantesId.push(parseInt(val));
         });
      }
   }
  
   window.open(URL+"/public/visitante/resumen/excel?empresaId="+getSession("empresaId") +
      "&radioIncluirRegTraCon="+radioIncluirRegTraCon +
      "&listContratistasId="+(listContratistasId.length == 0?"-1":listContratistasId) +
      "&radioIncluirRegVis="+radioIncluirRegVis +
      "&listVisitantesId="+(listVisitantesId.length == 0?"-1":listVisitantesId) +
      "&fechaInicioIntervaloInd="+fechaInicioInd +
      "&fechaFinIntervaloInd="+fechaFinInd,"_blank");
   
   $("#modalValPrevContratistaTblResumen").modal("hide");
}

var empresaVisitante = {};

function buscarEmpresaRuc(e){
   if(e){
      e.preventDefault();
   }
    
   var empresaRuc = $("#inputEmpresaRucBuscar").val().trim();
    
   var dataParam={
      ruc: empresaRuc,
      codigo: (getUrlParameter("empresaId")?getUrlParameter("empresaId"):null),
      cargarLogo: 1
   };
    
   callAjaxPost(URL+"/public/consulta/ruc",dataParam,function(data){
      if(data.empresa){
         empresaVisitante = data.empresa;
	 sessionStorage.setItem("empresaNombre",data.empresa.name);
	 sessionStorage.setItem("empresaId",data.empresa.empresaId);
	 sessionStorage.setItem("fechaHoyOrdenInversoTexto",data.empresa.fechaHoyOrdenInversoTexto);
	 
	 $("form").hide();$("#formNeutral").show();
	 $("#formNeutral h2").html("<i class='fa fa-spinner fa-spin fa-fw'></i> Accediendo a plataforma de: "+data.empresa.name);
	  
	 if(data.empresa.logo != null){
	    $("#logoVistaConsulta").html("<img src='data:image/png;base64,"+data.empresa.logo+"' style='width:200px;heigth:210px'>"); 
	 }
	 
	 $("#tituloSaludo").html("Bienvenido a la plataforma de <u>"+data.empresa.name+"</u> para CONSULTAS");
	    
	 setTimeout(function(){
	    verTopGosst();
	    seleccionarPerfilPersonalExterno();
	 },1600);
      }else{
         $("#msj").html("Empresa no encontrada");
      }
   });
}

function seleccionarPerfilPersonalExterno(){
   $("form").remove();$(".seccionInduccion").remove();$(".divDescripcionInduccion").remove(); 
    
   var containerWelcome = $("#containerWelcome");
    
   containerWelcome
   .append($("<div>",{class:"seccionInduccion",
                      id:"seccionPerfilPersonalExterno",
                      html:$("<div>",{class:"divTituloSeccion",
                 	              html:"Perfil"})}));
   
   var listPerfil = (parseInt(getSession("empresaId")) == 647?listPerfilPersonalExternoInkacrops:listPerfilPersonalExterno);
   
   var selPerfilTrabExt = crearSelectOneMenuOblig("selPerfilTrabExt","cargarBuscarPersonalExterno()",
      listPerfil,3,"id","nombre");
   
   $("#seccionPerfilPersonalExterno")
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-12'>" +
                      	       selPerfilTrabExt +
                      	   "</div>"}));
   
   cargarBuscarPersonalExterno();
}

var valPerfilTrabExt;

function cargarBuscarPersonalExterno(){
   $(".contenidoVisitante").remove();$(".contenidoTrabContratista").remove();$(".contenidoContratista").remove();
   $(".contenidoTrabInterno").remove();$(".contenidoVehiculoMaquinaria").remove();$(".contenidoEquipoHerramienta").remove();

   valPerfilTrabExt = parseInt($("#selPerfilTrabExt").val());
   
   if(valPerfilTrabExt == 1){
      verBuscarDatosVisitante();
   }else if(valPerfilTrabExt == 2){
      verBuscarDatosTrabContratista();
   }else if(valPerfilTrabExt == 3){
      verBuscarDatosContratista(); 
   }else if(valPerfilTrabExt == 4){
      verBuscarDatosTrabInterno();
   }else if(valPerfilTrabExt == 5){
      verBuscarDatosVehiculoMaquinaria();
   }else if(valPerfilTrabExt == 6){
      verBuscarDatosEquipoHerramienta();
   }
}

function verDetalleDocumentos(){
   $(".divDescripcionDetalleDocumento").show();
   $("#idDetalleDocumento").html("Ocultar detalle <i class='fa fa-angle-double-up'></i>");
   $("#idDetalleDocumento").attr("onclick","ocultarDetalleDocumentos()");
}

function ocultarDetalleDocumentos(){
   $(".divDescripcionDetalleDocumento").hide();
   $("#idDetalleDocumento").html("Ver detalle <i class='fa fa-angle-double-down'></i>");
   $("#idDetalleDocumento").attr("onclick","verDetalleDocumentos()");
}

function cerrarSesionVisitante(){
   removeAllSession();
   window.location.href = "login.html";
}

var listOpcionDocTrabCont = [{id: 1,nombre: "SCTR"},{id: 2,nombre: "Inducción"}];

function ocultarValoresPreviosExcelConsolidadoTrabajadoresContratista(){
   $("#modalValPrevExcelConTrabConConsulta").modal("hide");  
}

function valoresPreviosExcelConsolidadoTrabajadoresContratista(){
   $("#modalValPrevExcelConTrabConConsulta").remove();
     
   var selBLoqueLetrasConsulta = crearSelectOneMenuOblig("selBLoqueLetrasConsulta","",
      listBloqueLetras,1,"id","nombre");
   
   var selOpcionDocumentoTrabCont = crearSelectOneMenuOblig("selOpcionDocumentoTrabCont",
      "",listOpcionDocTrabCont,1,"id","nombre");
       
   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Documento",inputForm:selOpcionDocumentoTrabCont},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Bloque letra inicial - Contratista",inputForm:selBLoqueLetrasConsulta},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
   	             "onclick='ocultarValoresPreviosExcelConsolidadoTrabajadoresContratista()'>" +
   	        "<i class='fa fa-times'></i> Cancelar" +
   	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
   	   		 "onclick='descargarExcelConsolidadoTrabajadoresContratista()'>" +
   	            "<i class='fa fa-check'></i> Aceptar" +
   	         "</button>"}
   ];
   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   	
   var modalOptions={
      id: "modalValPrevExcelConTrabConConsulta",
      nombre: "<i class='fa fa-list-ul'></i> Valores - Excel Consolidado Trabajadores Contratista",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
   	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function descargarExcelConsolidadoTrabajadoresContratista(){
   var opcionBloque = $("#selBLoqueLetrasConsulta").val();
   var hasSctrExcel = (parseInt($("#selOpcionDocumentoTrabCont").val()) == 1?1:0);
   var hasInduccionExcel = (parseInt($("#selOpcionDocumentoTrabCont").val()) == 2?1:0);
    
   window.open(URL+"/public/trabajador_contratista/excel/general?empresaId="+getSession("empresaId") +
      "&bloqueLetras="+opcionBloque+"&hasSctrExcel="+hasSctrExcel+"&hasInduccionExcel="+hasInduccionExcel,"_blank");   
   
   $("#modalValPrevExcelConTrabConConsulta").modal("hide"); 
}
