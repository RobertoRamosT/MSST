/** *************variables de empresa********** */
var banderaEdicion;
var idCompanyEdicion;
var companyObj;
var encabezadosTotal;
var encabezadoId;
var idTipoEncabezado;
var listFullEmpresa,listSubSubSubTipoEmpresas; 
var listFullTipoAuditora,listFullAuditora1,listFullAuditora2,listFullAuditora3;
var listObjetivos;
var listFullSeccionesTrab;
var correoAsociadoActual;
var confirmCorreoActual;
var listFullTablaIndicadores;
var listFullTrabInter;
var listaModulosEmpresa;
var mensajeUx;

$(document).ready(function(){
   resizeDivWrapper("wrapEmpresa",225);
   banderaEdicion = false;
   idCompanyEdicion = 0;
      
   var hoy = getSession("fechaHoyOrdenInversoTexto");
      
   $("#fechaInicioHistorial").val(sumaFechaDias(-2,hoy));
   $("#fechaFinHistorial").val(hoy);
     
   $("#formHistorial").on("submit",function(e){
      e.preventDefault();
      verHistorialEmpresa();
   });
      
   $("#btnGuardar").hide();$("#btnCancelar").hide();$("#btnEliminar").hide()
   ;$("#btnCodigoCIIU").hide();$("#btnLinkVisita").hide();$("#btnValoresPreviosConsolidadoTrab").hide();
   $("#btnConfiguracionEmpresa").hide();
	
   $("#modalEncabezadosEmpresa .nav-tabs li a")
   .css({"border":"0.5px solid"});

   $("#btnClipTabla").on("click",function(){
      obtenerTablaClipboard();	
   });
	
   insertMenu();
	
   if(getUrlParameter("confirmarCorreo")){
      var dataObj={
	 idCompany: parseInt(getUrlParameter("companyId"))
      };
		
      callAjaxPost(URL + '/empresa/confirmarFinal', dataObj, function(){
	 listarEmpresa();
      });
   }else{
      listarEmpresa();
   }
	
   $("#btnLinkVisita").on("click",verModalLinkVisita);
});

function verModalLinkVisita(){
   $("#modalLinkVisita").remove();
    
   var ref = URLCorto+"/pages/login_visitante.html?empresaId="+companyObj.codigo;
   var refConsulta = URLCorto+"/pages/consultas.html?empresaId="+companyObj.codigo;
   
   var btnGenerarLinkAcceso = 
      "<button class='btn btn-success' style='font-size:18px;' type='button' " +
              "onclick='consultaIngresarNombreUsuario(0)'>" +
         "<i class='fa fa-external-link'></i> Generar link" +
      "</button>";
   
   var btnGenerarLinkAccesoColaborador = 
      "<button class='btn btn-success' style='font-size:18px;' type='button' " +
              "onclick='consultaIngresarNombreUsuario(1)'>" +
         "<i class='fa fa-external-link'></i> Generar link" +
      "</button>";
   
   var btnGenerarLinkAccesoContratista = 
       "<button class='btn btn-success' style='font-size:18px;' type='button' onclick='consultaIngresarNombreUsuario(2)'>" +
          "<i class='fa fa-external-link'></i> Generar link" +
       "</button>";
   
   var contenido = "";
   
   var listContenido=[
      {sugerencia:"",
       anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"Visitas" +
             "<br>"+ref+
             "<br><a href='"+ref+"' class='efectoLink' target='_blank'>Ir al enlace</a>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"Vista consulta" +
       	     "<br>"+refConsulta+
       	     "<br><a href='"+refConsulta+"' class='efectoLink' target='_blank'>Ir al enlace</a>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Acceso general",inputForm:btnGenerarLinkAcceso},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Acceso colaborador (correo)",inputForm:btnGenerarLinkAccesoColaborador},
       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
       {sugerencia:"",anchoLabel:"",anchoDiv:"",
        label:"Acceso contratista (RUC)",inputForm:btnGenerarLinkAccesoContratista}
   ];
  	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   var modalOptions={
      id: "modalLinkVisita",
      nombre: "<i class='fa fa-external-link'></i> Link de referencia",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   }
   
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   
   $("#modalLinkVisita").modal("show");
}

var listUsuariosGeneral=[];

function ocultarConsultaIngresarNombreUsuario(){
   $("#modalConsultaNombreUsuario").modal("hide");
   $("#modalLinkVisita").modal("show");
}

function consultaIngresarNombreUsuario(pTipoEnlaceId){
   // 0 -> General || 1 -> Colaborador || 2 -> Contratista
   $("#modalLinkVisita").modal("hide");
   $("#modalConsultaNombreUsuario").remove();
   
   var tipoEnlaceId = parseInt(pTipoEnlaceId);
   var crearEnlace = (tipoEnlaceId == 0?"generarLinkAccesoUsuario()":(tipoEnlaceId == 1?"generarLinkAccesoUsuarioColaborador()":
       "generarLinkAccesoUsuarioContratista()"));
   
   var dataParam={}; 
   
   if(tipoEnlaceId == 1){
      dataParam.tipoAccesoId = 0; 
   }else if(tipoEnlaceId == 2){
      dataParam.tipoAccesoId = 2; 
   }
  	  		
   callAjaxPost(URL+'/subusuario/simple',dataParam,function(data){
      listUsuariosGeneral = data.listSubUsuarios;
      
      if(listUsuariosGeneral.length > 0){
         var selUsuarioGeneral = (tipoEnlaceId == 0?
            crearSelectOneMenu("selUsuarioGeneral","",listUsuariosGeneral,"","usuarioId","userName","Ninguno"):
            crearSelectOneMenuOblig("selUsuarioGeneral","",listUsuariosGeneral,"","usuarioId","userName"));
    
         var contenido = "";
     
         var listContenido=[
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"Usuario"+(tipoEnlaceId == 0?"":(tipoEnlaceId == 1?" (colaborador)":" (contratista)")),inputForm:selUsuarioGeneral},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
  	                   "onclick='ocultarConsultaIngresarNombreUsuario()'>" +
  	              "<i class='fa fa-times'></i> Cancelar" +
  	           "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
  	   		 "onclick='"+crearEnlace+"'>" +
  	            "<i class='fa fa-external-link'></i> Obtener link" +
  	         "</button>"}
  	 ];
  	    
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
         });
  	
         var modalOptions={
            id: "modalConsultaNombreUsuario",
            nombre: "<i class='fa fa-question-circle'></i> " +
               (tipoEnlaceId == 0?"¿Incluir nombre de usuario fijo en el login de acceso?":
        	"Seleccione el nombre de usuario fijo para el login de acceso"),
            contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
         };
   
         crearModalPrincipalUsuario(modalOptions,function(){},true,true);
      }else{
         mensajeUx = (tipoEnlaceId == 0?"<label>No hay ningún usuario registrado.</label>":
            "<label>No hay ningún usuario (con acceso "+(tipoEnlaceId == 1?"colaborador":"contratista")+") registrado.</label>");
	 mensajesUx(mensajeUx,1,"","ValidacionUrlUsuario");
			     
	 $("#modalMensajeUxValidacionUrlUsuario").on("hidden.bs.modal",function(){
	    $("#modalLinkVisita").modal("show");
	 }); 
      }
   });
}

var listAccesoLoginEmpresa=[
    {id:285,refLogin:URLCorto+"/pages/login.html",codigo:"GVODSHSQT9076"},
    {id:546,refLogin:URLCorto+"/pages/virtualcare.html",codigo:"GWOGSBSCT3422"},
    {id:616,refLogin:URLCorto+"/pages/wiener.html",codigo:"GYOHSFGFD6473"},
    {id:617,refLogin:URLCorto+"/pages/ach.html",codigo:"GBOHSJSFT8634"},
    {id:670,refLogin:URLCorto+"/pages/westernunion.html",codigo:"GQOESRSTT9125"},
    {id:714,refLogin:URLCorto+"/pages/smi.html",codigo:"GXGTVQHUJ7359"},
    {id:716,refLogin:URLCorto+"/pages/modasa.html",codigo:"GYXGNQTII2951"},
    {id:500,refLogin:URLCorto+"/pages/login.html",codigo:"GWJSNTGBB7223"}
];

function generarLinkAccesoUsuario(){
   $("#modalConsultaNombreUsuario").modal("hide");
    
   var nombreUsuario = "";
   var usuarioId = parseInt($("#selUsuarioGeneral").val());
   var refLogin = URLCorto+"/pages/login.html";
  
   listUsuariosGeneral.forEach(function(val){
      if(usuarioId == val.usuarioId){
	 nombreUsuario = val.userName; 
      } 
   });
   
   listAccesoLoginEmpresa.forEach(function(val){
      if(parseInt(getSession("gestopcompanyid")) == val.id){
	 refLogin = val.refLogin; 
      } 
   });
   
   if(nombreUsuario.length == 0){
      mensajeUx = "<label>"+refLogin+"<br>" +
      		  "<a href='"+refLogin+"' class='efectoLink' target='_blank'>" +
      		     "Ir al enlace</a></label>";
   }else{
      mensajeUx = "<label>"+refLogin+"?nombreUsuario="+nombreUsuario+"<br>" +
      		  "<a href='"+refLogin+"?nombreUsuario="+nombreUsuario+"' " +
      		     "class='efectoLink' target='_blank'>Ir al enlace</a></label>";
   }
  
   mensajesUx(mensajeUx,1,"");
}

function generarLinkAccesoUsuarioColaborador(){
   $("#modalConsultaNombreUsuario").modal("hide");
     
   var nombreUsuario = "";
   var usuarioId = parseInt($("#selUsuarioGeneral").val());
   var refLogin = URLCorto+"/pages/login_personalizado.html";
   var codigo = "GQOWSFSFT9451";
    
   listUsuariosGeneral.forEach(function(val){
      if(usuarioId == val.usuarioId){
	 nombreUsuario = val.userName; 
      } 
   });
   
   listAccesoLoginEmpresa.forEach(function(val){
      if(parseInt(getSession("gestopcompanyid")) == val.id){
	 codigo = val.codigo; 
      } 
   });
    
   mensajeUx = 
      "<label style='word-break:break-all;'>" +
          refLogin+"?nombreUsuario="+nombreUsuario+"&codigo="+codigo +
          "<br>" +
          "<a href='"+refLogin+"?nombreUsuario="+nombreUsuario+"&codigo="+codigo+"' " +
             "class='efectoLink' target='_blank'>Ir al enlace</a>" +
      "</label>";
   
   mensajesUx(mensajeUx,1,"","");
}

function generarLinkAccesoUsuarioContratista(){
    $("#modalConsultaNombreUsuario").modal("hide");
      
    var nombreUsuario = "";
    var usuarioId = parseInt($("#selUsuarioGeneral").val());
    var refLogin = URLCorto+"/pages/login_personalizado_contratista.html";
    var codigo = "GQOWSFSFT9451";
     
    listUsuariosGeneral.forEach(function(val){
       if(usuarioId == val.usuarioId){
 	 nombreUsuario = val.userName; 
       } 
    });
    
    listAccesoLoginEmpresa.forEach(function(val){
       if(parseInt(getSession("gestopcompanyid")) == val.id){
 	 codigo = val.codigo; 
       } 
    });
     
    mensajeUx = 
       "<label style='word-break:break-all;'>" +
           refLogin+"?nombreUsuario="+nombreUsuario+"&codigo="+codigo +
           "<br>" +
           "<a href='"+refLogin+"?nombreUsuario="+nombreUsuario+"&codigo="+codigo+"' " +
              "class='efectoLink' target='_blank'>Ir al enlace</a>" +
       "</label>";
    
    mensajesUx(mensajeUx,1,"","");
 }

function volverVistaEmpresa(){
	$("#tabEmpresa .container-fluid").hide();
	$("#tabEmpresa").find("#divContainerEmpresas").show();
	$("#tabEmpresa h2").html("Información de Empresas"); 
}

function verHistorialEmpresa(){
   $("#tabEmpresa .container-fluid").hide();
   $("#tabEmpresa").find("#divContainerHistorial").show();
   $("#tabEmpresa h2").html("<a onclick='volverVistaEmpresa()'>Empresa</a> > Historial");
   
   resizeDivWrapper("wrapperHistorialEmpresa",220);
	
   var fechaInicioPresentacion = $("#fechaInicioHistorial").val();
   var fechaFinPresentacion = $("#fechaFinHistorial").val();
   
   var dataObj={
      idCompany: idCompanyEdicion,
      fechaInicioPresentacion: fechaInicioPresentacion,
      fechaFinPresentacion: fechaFinPresentacion
   }
	
   callAjaxPost(URL+'/empresa/historial',dataObj,function(data){
      $("#tblHistorial tbody").html("");
		
      data.list.forEach(function(val,index){
         $("#tblHistorial tbody").append(
	    "<tr>" +
	       "<td>"+val.fechaIngresoTexto+" "+val.horaIngresoTexto+"</td>" +
	       "<td>"+val.usuario+"</td>" +
	       "<td>"+val.descripcion+"</td>" +
	       "<td>"+val.moduloNombre+"</td>" +
	    "</tr>");
      });
      
      goheadfixedY("#tblHistorial","#wrapperHistorialEmpresa");
   });
}

function guardarDocumentoAyudaEmpresa(tipoId){
   guardarEvidenciaAuto(companyObj.idCompany,"fileEvi"+tipoId+"DocEmpresa"+companyObj.idCompany,
   bitsEvidenciaProcedimiento,"/empresa/documento/evidencia/save",function(){
      alert("Se guardó el documento satisfactoriamente");
   },"id",[{id:"tipoId",value:""+tipoId}] )
}

function guardarDocumentoAyudaEmpresaVersionDos(tipoId){
   guardarEvidenciaAuto(companyObj.idCompany,"fileEvi"+tipoId+"DocEmpresa"+companyObj.idCompany,
   bitsEvidenciaProcedimiento,"/empresa/amazon_s3/documento/evidencia/save",function(){
      alert("Se guardó el documento satisfactoriamente");
   },"id",[{id:"tipoId",value:""+tipoId},{id:"bucketAmazonS3",value:BUCKETAMAZONS3},
           {id:"keyAmazonS3",value:"empresa/evidencia-induccion-virtual-trab-alto-riesgo-cont/"+companyObj.idCompany}]);
}

var listDocsEmp=[
   {id:1,nombre:"Cargo (para contratistas)",
    getEviNombre:function(){return companyObj.evidenciaCargoNombre}},
   {id:2,nombre:"Reglamento Interno SST ",
    getEviNombre:function(){return companyObj.evidenciaReglamentoNombre}},
   {id:3,nombre:"Formato Hoja de Vida del Contratista",
    getEviNombre:function(){return companyObj.evidenciaHojaVidaNombre}},
   {id:4,nombre:"Cargo de visitante",
    getEviNombre:function(){return companyObj.evidenciaVisitanteNombre}},
   {id:7,nombre:"Cargo Inducción virtual",
    getEviNombre:function(){return companyObj.evidenciaInduccionVirtualNombre}},
   {id:8,nombre:"Grupo de riesgo - COVID-19 - Personal externo",
    getEviNombre:function(){return companyObj.evidenciaGrupoRiesgoPerExtNombre}},
   {id:9,nombre:"Ficha sintomatología - COVID-19 - Personal externo",
    getEviNombre:function(){return companyObj.evidenciaFichaSintomatologiaPerExtNombre}},
   {id:10,nombre:"Material inducción - Contratista regular", 
    getEviNombre:function(){return companyObj.evidenciaMaterialInduccionConRegNombre}}, 
   {id:11,nombre:"Material Inducción - Contratista locatario",
    getEviNombre:function(){return companyObj.evidenciaMaterialInduccionConLocNombre}}, 
   {id:12,nombre:"Cargo inducción - Contratista",
    getEviNombre:function(){return companyObj.evidenciaCargoInduccionConNombre}}, 
   {id:13,nombre:"Acta de compromiso - Contratista locatario",
    getEviNombre:function(){return companyObj.evidenciaActaCompromisoNombre}},
   {id:14,nombre:"Formato Análisis de Trabajo Seguro (ATS) - Contratista",
    getEviNombre:function(){return companyObj.evidenciaAnalisisTrabajoSeguroNombre}},
   {id:15,nombre:"Formato Permiso de Trabajo de Alto Riesgo (PETAR) - Contratista",
    getEviNombre:function(){return companyObj.evidenciaPermisoTrabajoAltoRiesgoNombre}},
   {id:16,nombre:"Cargo inducción virtual (trabajos de alto riesgo) - Contratista",
    getEviNombre:function(){return companyObj.evidenciaInduccionVirtualTrabajoAltoRiesgoContratistaNombre}} 
];

function verDocumentosAyudaEmpresa(){
   $("#tabEmpresa .container-fluid").hide();
   $("#tabEmpresa").find("#divContainerDocumentos").show();
   $("#tabEmpresa h2").html(
      "<a onclick='volverVistaEmpresa()'>Empresa '"+companyObj.name+"'</a> > Documentos");
   $("#divContainerDocumentos table tbody tr").remove();
	
   listDocsEmp.forEach(function(val){
      $("#divContainerDocumentos table tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	    "<td id='tdEviDoc"+val.id+"'></td>" +
         "</tr>");
		
      var eviNombre = val.getEviNombre();
      
      var optionsY={
	 container:"#tdEviDoc"+val.id,functionCall:function(){
	    if(val.id == 16){
	       guardarDocumentoAyudaEmpresaVersionDos(val.id);
	    }else{
	       guardarDocumentoAyudaEmpresa(val.id);
	    }
	 },descargaUrl:"/empresa/documento/evidencia?id="+companyObj.idCompany+"&tipoId="+val.id,
	 esNuevo:(eviNombre.length == 0?true:false),idAux:val.id+"DocEmpresa"+companyObj.idCompany,
	 evidenciaNombre:eviNombre
      };
		
      crearFormEvidenciaCompleta(optionsY); 
   });   	
}

function procesarGuardarEncabezado(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		
		llamarEncabezados();
		break;
	default:
		alert("Ocurrió un error al guardar la empresa!");
	}
}
function guardarEncabezado(){
	var codigo=$("#codigoDocInput").val();	
	var revision=$("#revisionDocInput").val();
	var inputFecha =convertirFechaTexto( $("#fechaDocInput").val()  ); 
	var encabezadoObj={
			encabezadoId:encabezadoId,
			codigoDocumento:codigo,
			fechaActualizacionDocumentoDate:inputFecha,
			revisionDocumento:revision,
			idCompany:idCompanyEdicion,
			tipoEncabezadoDocumento:idTipoEncabezado
					
	};
	callAjaxPost(URL + '/empresa/encabezado/save', encabezadoObj, procesarGuardarEncabezado);

}
function verEncabezados(pidTipoEncabezado){
	
	var codigo="";
	var fecha=null;
	var revision="";
	idTipoEncabezado=pidTipoEncabezado;
	encabezadoId=0;
	if(encabezadosTotal[idTipoEncabezado]){
		encabezadoId=encabezadosTotal[idTipoEncabezado].encabezadoId;
		 codigo=encabezadosTotal[idTipoEncabezado].codigoDocumento;
		 fecha=encabezadosTotal[idTipoEncabezado].fechaActualizacionDocumento;
		 revision=encabezadosTotal[idTipoEncabezado].revisionDocumento;
		
	}

	$("#codigoDocInput").val(codigo);
	$("#fechaDocInput").val(fecha);
	$("#revisionDocInput").val(revision);

}
function llamarObjetivos(){
	var dataParam = {
			empresaId :idCompanyEdicion,grupoId:1
		};
	
	callAjaxPost(URL + '/empresa/indicadores', dataParam, procesarIndicadorEmpresa);
	
}
function llamarEncabezados(){
	
	$("#modalEncabezadosEmpresa").modal("show");
	var companyObj={
			idCompany:idCompanyEdicion
	}
	
	callAjaxPost(URL + '/empresa/encabezados', companyObj, procesarListarEncabezados);
}
function procesarListarEncabezados(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		encabezadoId=0;
		
		encabezadosTotal=[];
		encabezadosTotal.push(data.encabezadosInsp);
		encabezadosTotal.push(data.encabezadosInsp); 
		encabezadosTotal.push(data.encabezadosAudi); 
		encabezadosTotal.push(data.encabezadosAcci);
		encabezadosTotal.push(data.encabezadosInci);
		encabezadosTotal.push(data.encabezadosEnfe);
		encabezadosTotal.push(data.encabezadosActo);
		encabezadosTotal.push(data.encabezadosForm);
		encabezadosTotal.push(data.encabezadosEpp);
		encabezadosTotal.push(data.encabezadosMdf);
		encabezadosTotal.push(data.encabezadosExam);
		encabezadosTotal.push(data.encabezadosPuesto);
		encabezadosTotal.push(data.encabezadosAccion);
		encabezadosTotal.push(data.encabezadosInduccionContratista);
		encabezadosTotal.push(data.encabezadosTrabajadoresCovid);
		verEncabezados(idTipoEncabezado);
		break;
	default:
		alert("Ocurrió un error al traer las encabezados!");
	}
	
}
function listarEmpresa() {
	idTipoEncabezado=1;
	idCompanyEdicion = 0;
	deshabilitarBotonesEdicion();
	$("#btnHistorial").hide();
	$("#btnDocumentos").hide();
	volverVistaEmpresa();
	$("#btnEncabezado").hide();
	$("#btnObjetivo").hide();
	banderaEdicion = false;
	//var dataParam = {};
	if( isMobile.any() ) {
		callAjaxPost(URL + '/empresa', {}, procesarListarEmpresaMovil,function(){},function(){});
		
	}else{
		callAjaxPost(URL + '/empresa', {}, procesarListarEmpresa);
	};
	
}
function mensajeLimiteEmpresa(){
	$("#modalLimiteEmpresa .modal-body").html
	("Estimado usuario:<br> ha excedido " +
			"el número de empresas permitido " +
			"en su licencia ("+getSession("numEmpresas")+"). " +
					"Contáctese con ventas@aswan.pe para mayor información<br>Atentamente,<br><br>El equipo Aswan")
	$("#modalLimiteEmpresa").modal('show');
	
}
function procesarListarEmpresaMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#containerEmpresa").remove();  
		var list = data.list;
	var numEmpresaActual=data.list.length;
		
		var acceso=comprobarNumEmpresasUnidades(getSession("numEmpresas"),numEmpresaActual);
		 
		$("#nuevoEventoGosst").off("click");
		if(!acceso){
			 
			$("#nuevoEventoGosst").on("click",function(e){e.preventDefault();mensajeLimiteEmpresa()});
		}else{
			$("#nuevoEventoGosst").on("click",function(){
				$("#graficoResumenEventos").hide();
				$("#nuevoEventoGosst").hide();
				$("#buscarEventoGosst").hide(); 
				$("#empresaGosstMovil").css( { "top":"0px"});
				 
				var inputEvi="<div class='input-group'>"+
			   " <label class='input-group-btn'>"+
			    "<span class='btn btn-primary'>"+
			    "<i class='fa fa-camera' aria-hidden='true'></i>"+
			      "  Buscar Logo&hellip; <input style='display: none;' "+
			       " type='file' name='fileEviMovil' id='fileEviMovil' "+
			"accept='image/jpg,image/png,image/jpeg,image/gif'>"+
			   " </span>"+
			"</label>"+
			"<input type='text' class='form-control' readonly>"+
				" </div>";
				$("#barraMenu").hide();
				$("#empresaGosstMovil").append("<div class='principalMovil'><label>Datos Principales</label>" +
						"<div class='formNuevoEvento1'>" +
						"<input type='text' id='inputRuc' onkeydown='return IsNumeric(event);'  onkeyup='return IsNumericRestriccion(event);' class='form-control' placeholder='RUC' > " +
						"</div>"+
						
						
						"<div class='formNuevoEvento1'>" + 
						 "<input type='text' id='inputRS' class='form-control' placeholder='Razon Social'  >" +
						 "</div>"+
						 "<div class='formNuevoEvento1'> " +
							inputEvi+
							"</div>"+
						 "<div class='formNuevoEvento1' >" +
						 "<input type='text' id='inputDom' class='form-control' placeholder='Domicilio'  >"+
						"</div>"+
						 "</div>"+
						 "<div class='secundarioMovil'>"+
						 "<label>Datos Secundarios</label><div class='formNuevoEvento2'>" +
						 "<input type='text' id='inputRub' class='form-control' placeholder='Rubro' ></div>"+
						 
						"<div class='formNuevoEvento2'>" +
			            "<input type='text' id='inputAseg' class='form-control' placeholder='Aseguradora' required='true'>"+ 
						"</div>"+
						"<div class='formNuevoEvento2'>" +
						 "<input type='text' id='inputAnInic' onkeypress='return IsNumeric(event);' class='form-control' placeholder='A&ntilde;o Inicio' required='true'  >"+			"</div>"+
						"<div class='formNuevoEvento2'>" +
					 
						"</div>" +
						"</div>"+
						"<div class='cancelarFormMovil' >" +
						"<div><i class='fa fa-ban fa-2x' aria-hidden='true'></i>Cancelar</div>" +
						"</div>  "+
						"<div class='seguirFormMovil'  >" +
						"<div>Guardar <i class='fa fa-chevron-circle-right fa-2x' aria-hidden='true'></i></div>" +
						"</div>");
				 
				 
				$("#empresaGosstMovil .form-control:not(select)")
					.on("focus",function(){
						var inputId=$(this).prop("id");
						var textoSuperior="";
						switch(inputId){
						case "inputNom":textoSuperior=" - Descripción";
							break;
						case "inputLug":textoSuperior=" - Lugar"
							break;
						}
						$("#empresaGosstMovil .principalMovil").hide();
						$("#empresaGosstMovil .secundarioMovil").hide();
						$("#empresaGosstMovil .seguirFormMovil").hide();
						$("#empresaGosstMovil .cancelarFormMovil").hide();
						$(this).parent().parent().show().addClass("solitarioMovil");
						$(this).parent().parent().find("label:first").append(textoSuperior);
						$(".formNuevoEvento2").hide();
						$(".formNuevoEvento1").hide();
						$(this).parent().show();
					})
					.on("focusout",function(e){
					   //do stuff here
						$("#empresaGosstMovil .principalMovil").show().removeClass("solitarioMovil")
						.find("label:first").html("Datos Principales");
						$("#empresaGosstMovil .secundarioMovil").show().removeClass("solitarioMovil")
						.find("label:first").html("Datos Secundarios");
						$("#empresaGosstMovil .seguirFormMovil").show();
						$("#empresaGosstMovil .cancelarFormMovil").show();
						$(".formNuevoEvento2").show();
						$(".formNuevoEvento1").show();
					}) ;
				$(".cancelarFormMovil").on("click",function(){
					$("#empresaGosstMovil .principalMovil").remove();
					$("#empresaGosstMovil .secundarioMovil").remove();
					$("#empresaGosstMovil .seguirFormMovil").remove();
					$("#empresaGosstMovil .cancelarFormMovil").remove();
					$("#empresaGosstMovil label").remove();

					$("#empresaGosstMovil").css({ "top":"25px"});
					
					$("#graficoResumenEventos").hide();
					$("#nuevoEventoGosst").show();
					$("#buscarEventoGosst").hide();
					$("#barraMenu").show();
				});
				 
				
				$(".seguirFormMovil").on("click", function(){
					var valEvi=$("#fileEviMovil").val();
					var campoVacio=false;
					if (  $("#inputRuc").val().length == 0
								|| $("#inputRS").val().length == 0
								|| $("#inputDom").val().length == 0
								|| $("#inputRub").val().length == 0
								|| $("#inputAseg").val().length == 0
								|| $("#inputAnInic").val().length == 0
								) {
						campoVacio = true;
					}
				  
					if(!campoVacio){
						guardarEmpresaMovil();
					}else{
					alert("Faltan Completar Campos");
					}
					 
					});
				
				
				
				$(".formNuevoEvento1").show();
				$(".formNuevoEvento2").show();
			});
		}
		completarBarraCarga(); 
		break;
	default:
		alert("Ocurrió un error al traer las actos inseguros!");
	}
}

function procesarListarEmpresa(data) {   
   switch(data.CODE_RESPONSE){
      case "05":
         var list = data.list;
         
         $("#empresaGosstMovil").remove(); 
         $("#btnCodigoCIIU").hide();$("#btnLinkVisita").hide();$("#btnValoresPreviosConsolidadoTrab").hide();
         $("#btnConfiguracionEmpresa").hide();
         
         listFullEmpresa = list;
         listObjetivos = data.objetivos;
         listFullTipoAuditora = data.listTipoAuditoria; 
         listFullSeccionesTrab = data.listSeccionesTrab; 
         listaModulosEmpresa = data.listaModulosEmpresa;
         correoAsociadoActual="",confirmCorreoActual="";
		
         $("#tblObjetivo tbody tr").remove();
		
         for(index = 0;index < listObjetivos.length;index++){
	    var indicador = listObjetivos[index].indicador.split("/");
	     
	    $("#tblObjetivo tbody").append(
	       "<tr>" +
		  "<td>"+listObjetivos[index].campo+"</td>" +
		  "<td style='text-align:left'>"+listObjetivos[index].objetivo+"</td>" +
		  "<td id='tdobj"+index+"'></td>" +
		  "<td><input id='objetivo"+index+"' type='number' class='form-control'></td>" +
	       "</tr>");
	     
	    if(index != 3){
	       escribirFraccionSola("tdobj"+index,indicador[0],indicador[1]);
	       $("#objetivo"+index).attr("max",100);$("#objetivo"+index).attr("step",1);
	       $("#objetivo"+index).attr("min",1);$("#objetivo"+index).val("100");
	    }else{
	       $("#tdobj"+index).html(indicador[0]);
	       $("#objetivo"+index).val("12");
	    }
         }
		
         $("#modalObjetivoEmpresa .modal-title").html("Objetivos de SST propuestos por GOSST");
         var numEmpresaActual = data.list.length;	
         var acceso = comprobarNumEmpresasUnidades(getSession("numEmpresas"),numEmpresaActual);
		 
         if(!acceso){
	    $("#btnNuevo").attr("onclick","mensajeLimiteEmpresa()");
         }else{
	    $("#btnNuevo").attr("onclick","nuevaEmpresa()");
         }
		
         $("#tblEmpresas tbody tr").remove();
	  
         // var celdaEstilo=CELDA_ESTILO_PAR;
         var celdaEstilo;
		
         list.forEach(function(val,index){
	    // celdaEstilo=celdaEstilo==CELDA_ESTILO_PAR?CELDA_ESTILO_IMPAR:CELDA_ESTILO_PAR;
	    var textoConfirm = (val.confirmaCorreo == 1?"<i aria-hidden='true' class='fa fa-check'></i> Confirmado":
	       "<button class='btn btn-success' style='font-size:12px' onclick='solicitarConfirmacionCorreo("+index+")'>" +
	          "Solicitar <br> confirmación" +
	       "</button>");
	    
	    var textoWants = (val.wantsCorreo == 1?"Sí":"No"),textoProy = (val.isProyectoSimple == 1?"Sí":"No"),textoWantsObj = (val.wantsColaboradorObjetivos == 1?"Sí":"No"),
	       textoWantsAcc = (val.wantsColaboradorAccidentabilidad == 1?"Sí":"No"),textoWantsEvalTriple = (val.wantsEvalTriple == 1?"Sí":"No"),
	       textoWantsEventosResp = (val.wantsCorreoEventosResp == 1?"Sí":"No"),textoWantsDocEvalResp = (val.wantsCorreoDocEvalResp == 1?"Sí":"No"),
	       textoWantsCargoInduccVirtualResp = (val.wantsCorreoCargoInduccVirtualResp == 1?"Sí":"No");
			
	    $("#tblEmpresas tbody").append(
	       "<tr id='"+val.idCompany+"' onclick='editarEmpresa("+val.idCompany+","+index+")'>" +
	          "<td id='"+val.idCompany+"ruc' "+celdaEstilo+">"+val.ruc+"</td>" +
		  "<td id='"+val.idCompany+"name' "+celdaEstilo+">"+val.name+"</td>" +
		  "<td id='"+val.idCompany+"address' "+celdaEstilo+">"+val.address+"</td>" +
		  "<td id='"+val.idCompany+"category' "+celdaEstilo+">"+val.category+"</td>" +
		  "<td id='"+val.idCompany+"insurance' "+celdaEstilo+">"+val.insurance+"</td>" + 
		  "<td id='"+val.idCompany+"actInitYear'>"+val.activityInitialYear+"</td>" +
		  "<td id='"+val.idCompany+ "moduloInvisi'>"+val.modulosInvisibleNombre+"</td>" +
	          "<td id='"+val.idCompany+"empwantsobj' "+celdaEstilo+">"+textoWantsObj+"</td>" +
		  "<td id='"+val.idCompany+"empwantsacc' "+celdaEstilo+">"+textoWantsAcc+"</td>" +
		  "<td id='"+val.idCompany+"areaSst'>"+val.nombreAreaSst+"</td>" +
		  "<td id='"+val.idCompany+"unidadNomb'>"+val.nombreUnidad+"</td>" +
		  "<td id='"+val.idCompany+"divisionNomb'>"+val.nombreDivision+"</td>" +
		  "<td id='"+val.idCompany+"areaNomb'>"+val.nombreArea+"</td>" +
		  "<td id='"+val.idCompany+"secctrab'>"+val.seccionTrabajadorNombre+"</td>" +
		  "<td id='"+val.idCompany+"secctrabdef'>"+val.seccionTrabajadorDefault.nombre+"</td>" +
		  "<td id='"+val.idCompany+"partinter'>"+val.numSeccionesInteresadas+"</td>" +
		  "<td id='"+val.idCompany+"lista1'>"+val.listaAuditoriaNombre1+"</td>" +
		  "<td id='"+val.idCompany+"lista2'>"+val.listaAuditoriaNombre2+"</td>" +
	          "<td id='"+val.idCompany+"lista3'>"+val.listaAuditoriaNombre3+"</td>" +
		  "<td id='"+val.idCompany+"logo'>"+insertarImagenParaTabla(val.logo,"50px","50px")+"</td>" + 
		  "<td id='"+val.idCompany+"empCorreo'>"+val.correoAsociado+"</td>" +
		  "<td id='"+val.idCompany+"empConfirmCorreo' "+celdaEstilo+">"+textoConfirm+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreo' "+celdaEstilo+">"+textoWants+"</td>" +
//	          "<td id='"+val.idCompany+"empProySimple' "+celdaEstilo+">"+textoProy+"</td>" +
//		  "<td id='"+val.idCompany+"empTriple' "+celdaEstilo+">"+textoWantsEvalTriple+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreoForRenCov' "+celdaEstilo+">"+val.respuestaCorreoForRenCov+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreoDiaForRenCov' "+celdaEstilo+">"+val.respuestaCorreoDiaForRenCov+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreoEventosResp' "+celdaEstilo+">"+textoWantsEventosResp+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreoDocEvalResp' "+celdaEstilo+">"+textoWantsDocEvalResp+"</td>" +
//		  "<td id='"+val.idCompany+"empWantsCorreoCargoInduccVirtualResp' "+celdaEstilo+">"+textoWantsCargoInduccVirtualResp+"</td>" +
	       "</tr>");
         });
		
         encontrarListaAuditoria();
         goheadfixedY("#tblEmpresas","#wrapEmpresa");
		
         if(list.length == 0){
	    var divObjectBienvenida={
	       divId:"",titulo:"¡Bienvenido!",
	       cuerpo:"Tutorial de creación de empresa<br><br>" +
		      "<button id='startTutorial' class='btn btn-success'>Empezar</button>"
            };
	     
	    crearOverlaySobreDiv(divObjectBienvenida);
	     
	    $("#startTutorial").on("click",function(){
	       $(".mensajeBienvenida").remove();
	        
	       var divObject={
		  divId:"btnNuevo",titulo:"Creando una empresa",
		  cuerpo:"Empecemos registrando los datos de la empresa que vamos a gestionar."
	       };
		  
	       resaltarDivTutorial(divObject);	
	    });	
         }else{
	    if(tutorialOn){
	       var divObjectBienvenida={
		  divId:"containerEmpresa",titulo:"¡Listo!",
		  cuerpo:"Creaste tu primera empresa, ahora podrás acceder " +
			 "al módulo Despliegue Organizacional y " +
			 "registrar las unidades de negocio que necesites<br><br>" +
			 "<button id='followTutorial' class='btn btn-success'>Ir al Despliegue</button>"
	       };
	        
	       siguientePasoTutorial(divObjectBienvenida);
	       tutorialOn = false;
		
	       $("#followTutorial").on("click",function(){
	          window.location.href = 'mdf.html';	
	       });
	    }
         }
		
         formatoCeldaSombreableTabla(true,"tblEmpresas");
         completarBarraCarga();
         
         break;
          
      default:
         alert("Ocurrió un error al traer las empresas!");
   }
}

function editarEmpresa(idCompany,pindex) {
   if(!banderaEdicion){
      idCompanyEdicion = idCompany;
		
      $("#btnHistorial").show();$("#btnDocumentos").show();$("#btnEncabezado").show();
      $("#btnObjetivo").show();$("#btnCodigoCIIU").show();$("#btnLinkVisita").show();
      $("#btnValoresPreviosConsolidadoTrab").show();$("#btnConfiguracionEmpresa").show();
		
      formatoCeldaSombreableTabla(false,"tblEmpresas");
		
      companyObj = listFullEmpresa[pindex];
		
      var objForm=listFullEmpresa[pindex].objetivoFormacion;
		var objExam=listFullEmpresa[pindex].objetivoExam;
		var objEpp=listFullEmpresa[pindex].objetivoEpp;
		var objPart=listFullEmpresa[pindex].objetivoParticipacion;
		var objDisp=listFullEmpresa[pindex].objetivoDisponibilidad;
		var objIperc=listFullEmpresa[pindex].objetivoIperc;
		
		$("#"+idCompany).addClass("fila-edicion");
		
		$("#objetivo0").val(objForm*100);
		$("#objetivo1").val(objExam*100);
		$("#objetivo2").val(objEpp*100);
		$("#objetivo3").val(objPart);
		$("#objetivo4").val(objDisp*100);
		$("#objetivo5").val(objIperc*100);
		 
		
		var listaSeccionTrab=companyObj.seccionTrabajadorId; //Secciones del Trabajador
		var listaIdsSeccionTrab=listaSeccionTrab.split(",");
		listaIdsSeccionTrab.forEach(function (val)
		{
			listFullSeccionesTrab.forEach(function (val1){
				if(val==val1.id)
				{
					val1.selected=1;
				}
			});
		});
		crearSelectOneMenuObligMultipleCompleto("selSeccionTrab","",
				listFullSeccionesTrab,"id","nombre","#"+idCompanyEdicion+"secctrab","Secciones de Trabajador");	 

		//
		var listModuloInviId=companyObj.modulosInvisibleId; // modulos invisibles
		var listaIdsModulosInvi=listModuloInviId.split(",");
		listaIdsModulosInvi.forEach(function (val)
		{
			listaModulosEmpresa.forEach(function (val1){
				if(val==val1.menuOpcionId)
				{
					val1.selected=1;
				}
			});
		});
		crearSelectOneMenuObligMultipleCompleto("selModulosInvi","",
				listaModulosEmpresa,"menuOpcionId","menuOpcionNombre","#"+idCompanyEdicion+"moduloInvisi","Módulos Invisibles");	 

		
		
		//
		listFullSeccionesTrab.forEach(function(val){
			val.selected = 0;
			if(val.id == companyObj.seccionTrabajadorDefault.id){
				val.selected = 1;
			}
		});
		crearSelectOneMenuObligUnitarioCompleto("selSeccionTrabDefault","",
				listFullSeccionesTrab,"id","nombre","#"+idCompanyEdicion+"secctrabdef","Sección default");	 
		
		
		var lista1=companyObj.listaAuditoriaId1; //auditoria
		var listaIdsAuditoria1=lista1.split(",");

		if(listFullAuditora1.length!=0)
		{
			listaIdsAuditoria1.forEach(function (val)
			{
				listFullAuditora1.forEach(function (val1){
					if(val==val1.id)
					{
						val1.selected=1;
					}
				});
			});
			crearSelectOneMenuObligMultipleCompleto("selListaAuditoria1","",
					listFullAuditora1,"id","nombre","#"+idCompanyEdicion+"lista1","Auditorias No Permitidas");	 
		}
		else 
		{
			msg="Sin Auditorias No Permitidas ..."; 
			$("#"+idCompanyEdicion+"lista1"+ " select").remove();
			$("#"+idCompanyEdicion+"lista1"+" div").remove();
			$("#"+idCompanyEdicion+"lista1"+ " input").remove();
			$("#"+idCompanyEdicion+"lista1").append(
					"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
		}
		
		var lista2=companyObj.listaAuditoriaId2; //inspeccion
		var listaIdsAuditoria2=lista2.split(",");
		if(listFullAuditora2.length!=0)
		{
			listaIdsAuditoria2.forEach(function (val)
			{
				listFullAuditora2.forEach(function (val1){
					if(val==val1.id)
					{
						val1.selected=1;
					}
				});
			});
			crearSelectOneMenuObligMultipleCompleto("selListaAuditoria2","",
							listFullAuditora2,"id","nombre","#"+idCompanyEdicion+"lista2","Inspecciones No Permitidas");
		}		
		else 
		{
			msg="Sin Inspecciones No Permitidas ..."; 
			$("#"+idCompanyEdicion+"lista2"+ " select").remove();
			$("#"+idCompanyEdicion+"lista2"+" div").remove();
			$("#"+idCompanyEdicion+"lista2"+ " input").remove();
			$("#"+idCompanyEdicion+"lista2").append(
					"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
		}
		var lista3=companyObj.listaAuditoriaId3; //revision proyectos
		var listaIdsAuditoria3=lista3.split(",");
		if(listFullAuditora3.length!=0)
		{
			listaIdsAuditoria3.forEach(function (val)
			{
				listFullAuditora3.forEach(function (val1){
					if(val==val1.id)
					{
						val1.selected=1;
					}
				});
			});
			crearSelectOneMenuObligMultipleCompleto("selListaAuditoria3","",
							listFullAuditora3,"id","nombre","#"+idCompanyEdicion+"lista3","Auditorias de Proyectos  No Permitidas");			
		}
		else 
		{
			msg="Sin Auditorias de Proyectos  No Permitidas ..."; 
			$("#"+idCompanyEdicion+"lista3"+ " select").remove();
			$("#"+idCompanyEdicion+"lista3"+" div").remove();
			$("#"+idCompanyEdicion+"lista3"+ " input").remove();
			$("#"+idCompanyEdicion+"lista3").append(
					"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
		}
		//
		var correo = $("#" + idCompany + "empCorreo").text();
		correoAsociadoActual=correo;
		$("#" + idCompany + "empCorreo")
				.html(
						"<input type='text' id='inputCorreoAsociado' onkeyup='confirmarEstadoCorreo()' class='form-control' value='"
								+ correo + "'>");
		
		//
		var nombreAreaSst=companyObj.nombreAreaSst;
		$("#"+idCompany+"areaSst").html("<input class='form-control' id='inputNombreAreaSst'>");
		$("#inputNombreAreaSst").val(nombreAreaSst);
		//
		var nombreDivision=companyObj.nombreDivision;
		$("#"+idCompany+"divisionNomb").html("<input class='form-control' id='inputNombreDivision'>");
		$("#inputNombreDivision").val(nombreDivision);
		
		var nombreArea=companyObj.nombreArea;
		$("#"+idCompany+"areaNomb").html("<input class='form-control' id='inputNombreArea'>");
		$("#inputNombreArea").val(nombreArea);
		
		var nombreUnidad=companyObj.nombreUnidad;
		$("#"+idCompany+"unidadNomb").html("<input class='form-control' id='inputNombreUnidad'>");
		$("#inputNombreUnidad").val(nombreUnidad);

		var confirm=listFullEmpresa[pindex].confirmaCorreo;
		confirmCorreoActual=confirm;
		
		
		//
//		var wants=listFullEmpresa[pindex].wantsCorreo;
//		var textoWants="";
//		if(wants==1){
//			textoWants="checked";
//		}
//		$("#" + idCompany + "empWantsCorreo")
//		.html(
//				"<input type='checkbox' id='checkWantsCorreo' class='form-control' "
//						+ textoWants + ">");
		//************************************************************************
		
//		var wantsCorreoForRenCov = listFullEmpresa[pindex].wantsCorreoForRenCov;
//		
//		$("#"+idCompany+"empWantsCorreoForRenCov")
//		.html("<input type='checkbox' id='checkWantsCorreoForRenCov' class='form-control' "
//			+(wantsCorreoForRenCov == 1?"checked":"")+">");
		
		// ***********************************************************************
		
//		var wantsCorreoDiaForRenCov = listFullEmpresa[pindex].wantsCorreoDiaForRenCov;
//		
//		$("#"+idCompany+"empWantsCorreoDiaForRenCov")
//		.html("<input type='checkbox' id='checkWantsCorreoDiaForRenCov' class='form-control' "
//			+(wantsCorreoDiaForRenCov == 1?"checked":"")+">");
		
		// ***********************************************************************
		
//      $("#"+idCompany+"empWantsCorreoEventosResp").html("<input type='checkbox' id='checkWantsCorreoEventosResp' class='form-control' " +
//         (companyObj.wantsCorreoEventosResp == 1?"checked":"")+">");
      
//      $("#"+idCompany+"empWantsCorreoDocEvalResp").html("<input type='checkbox' id='checkWantsCorreoDocEvalResp' class='form-control' " +
//	 (companyObj.wantsCorreoDocEvalResp == 1?"checked":"")+">");
		
//      $("#"+idCompany+"empWantsCorreoCargoInduccVirtualResp").html("<input type='checkbox' id='checkWantsCorreoCargoInduccVirtualResp' class='form-control' " +
//	 (companyObj.wantsCorreoCargoInduccVirtualResp == 1?"checked":"")+">");
      // ***********************************************************************
		
//		var isProyectoSimple=listFullEmpresa[pindex].isProyectoSimple;
//		var textoProy="";
//		if(isProyectoSimple==1){
//			textoProy="checked";
//		}
//		$("#" + idCompany + "empProySimple")
//		.html("<input type='checkbox' id='checkProyectoSimple' class='form-control' "
//						+ textoProy + ">");
		
		//
//		var wantsEvalTriple=listFullEmpresa[pindex].wantsEvalTriple;
//		var textoEvalTriple="";
//		if(wantsEvalTriple==1){
//		    textoEvalTriple="checked";
//		}
//		$("#" + idCompany + "empTriple")
//		.html("<input type='checkbox' id='checkEvalTriple' class='form-control' "
//						+ textoEvalTriple+ ">");
		
		//
		
		var wantsColaboradorObjetivos=listFullEmpresa[pindex].wantsColaboradorObjetivos;
		var textoObj="";
		if(wantsColaboradorObjetivos==1){
			textoObj="checked";
		}
		$("#" + idCompany + "empwantsobj")
		.html(
				"<input type='checkbox' id='checkWantsObj' class='form-control' "
						+ textoObj + ">");
		//
		var wantsColaboradorAccidentabilidad=listFullEmpresa[pindex].wantsColaboradorAccidentabilidad;
		var textoAcc="";
		if(wantsColaboradorAccidentabilidad==1){
			textoAcc="checked";
		}
		$("#" + idCompany + "empwantsacc")
		.html(
				"<input type='checkbox' id='checkWantsAcc' class='form-control' "
						+ textoAcc + ">");
		
		confirmarEstadoCorreo();
		//
		
		var name = $("#" + idCompany + "ruc").text();
		$("#" + idCompany + "ruc")
				.html(
						"<input type='text' id='inputRuc' class='form-control' placeholder='Razon Social' onkeydown='return IsNumeric(event);'  onkeyup='return IsNumericRestriccion(event);' value='"
								+ name + "'>");
		nombrarInput("inputRuc",name);
		var name = $("#" + idCompany + "name").text();
		$("#" + idCompany + "name")
				.html(
						"<input type='text' " +
						"id='inputRS' " +
						"class='form-control' " +
						"placeholder='Razon Social' " +
						"required='true'>");
		
		nombrarInput("inputRS",name);

		var address = $("#" + idCompany + "address").text();
		$("#" + idCompany + "address")
				.html(
						"<input type='text' id='inputDom' class='form-control' placeholder='Domicilio' required='true'>");
		$("#inputDom").attr("value", address);

		var category = $("#" + idCompany + "category").text();
		$("#" + idCompany + "category")
				.html(
						"<input type='text' id='inputRub' class='form-control' placeholder='Rubro' required='true'>");
		$("#inputRub").attr("value", category);

		var insurance = $("#" + idCompany + "insurance").text();
		$("#" + idCompany + "insurance")
				.html(
						"<input type='text' id='inputAseg' class='form-control' placeholder='Aseguradora' required='true'>");
		$("#inputAseg").attr("value", insurance);

		var activityInitialYear = $("#" + idCompany + "actInitYear").text();
		$("#" + idCompany + "actInitYear")
				.html(
						"<input type='text' id='inputAnInic' name='inputAnInic' class='form-control' onkeypress='return IsNumeric(event);' "
								+ "ondrop='return false;' onpaste='return false;' placeholder='Anio Inicio' style='width:100px;' value='"
								+ activityInitialYear + "'>");
		//
		$("#" + idCompany + "partinter").addClass("linkGosst")
		.html("<i class='fa fa-list'></i>"+companyObj.numSeccionesInteresadas)
		.on("click",function(){
			cargarSeccionInteresadasEmpresa();
		});
		var options=
		{
				container:"#" + idCompany + "logo",
				functionCall:function(){ },
				descargaUrl: "/empresa/logo?companyId="+idCompany,
				esNuevo:false,
				idAux:"Company",
				evidenciaNombre:companyObj.logoNombre
		};
		crearFormEvidenciaCompleta(options); 
		habilitarBotonesEdicion(); 
		banderaEdicion = true;
	}

}

function nuevaEmpresa(){
   if(!banderaEdicion){
      $("#btnObjetivo").show();
      
      $("#tblEmpresas:first tbody").prepend(
         "<tr id='0'>" +
            "<td>" +
               "<input type='text' id='inputRuc' onkeydown='return IsNumeric(event);' " +
                      "onkeyup='return IsNumericRestriccion(event);' class='form-control' " +
                      "placeholder='RUC' required='true' autofocus='true'>" +
            "</td>" +
	    "<td>" +
	       "<input type='text' id='inputRS' class='form-control' placeholder='Razon Social' required='true'>" +
	    "</td>" +
	    "<td>" +
	       "<input type='text' id='inputDom' class='form-control' placeholder='Domicilio' required='true'>" +
	    "</td>" +
	    "<td>" +
	       "<input type='text' id='inputRub' class='form-control' placeholder='Rubro' required='true'>" +
	    "</td>" +
	    "<td>" +
	       "<input type='text' id='inputAseg' class='form-control' placeholder='Aseguradora' required='true'>" +
	    "</td>" +
	    "<td>" +
	       "<input type='text' id='inputAnInic' onkeypress='return IsNumeric(event);' " +
	              "class='form-control' placeholder='A&ntilde;o Inicio' required='true'>" +
	    "</td>" +
	    "<td id='0moduloInvisi'></td>" +
	    "<td><input type='checkbox' id='checkWantsObj' class='form-control'></td>" +
	    "<td><input type='checkbox' id='checkWantsAcc' class='form-control'></td>" +
	    "<td><input class='form-control' id='inputNombreAreaSst'></td>" +
	    "<td><input class='form-control' id='inputNombreUnidad'></td>" +
            "<td><input class='form-control' id='inputNombreDivision'></td>" + 
	    "<td><input class='form-control' id='inputNombreArea'></td>" + 
	    "<td id='0secctrab'>...</td>" +
	    "<td id='0secctrabdef'>...</td>" + 
	    "<td>...</td>" +
	    "<td id='0lista1'>...</td>" + 
	    "<td id='0lista2'>...</td>" +
	    "<td id='0lista3'>...</td>" +
	    "<td id='inputEvidenciaLogo'>...</td>" + 
	    "<td><input type='text' id='inputCorreoAsociado' class='form-control'></td>" +
	    "<td>...</td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreo' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkProyectoSimple' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkEvalTriple' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreoForRenCov' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreoDiaForRenCov' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreoEventosResp' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreoDocEvalResp' class='form-control'></td>" +
//	    "<td><input type='checkbox' id='checkWantsCorreoCargoInduccVirtualResp' class='form-control'></td>" +
	 "</tr>");
      
      crearSelectOneMenuObligMultipleCompleto("selListaAuditoria1","",listFullAuditora1,"id",
         "nombre","#"+idCompanyEdicion+"lista1","Auditorias de Proyectos  No Permitidas");
      
      crearSelectOneMenuObligMultipleCompleto("selListaAuditoria2","",listFullAuditora2,"id",
	 "nombre","#"+idCompanyEdicion+"lista2","Inspecciones No Permitidas");
		
      crearSelectOneMenuObligMultipleCompleto("selListaAuditoria3","",listFullAuditora3,"id",
         "nombre","#"+idCompanyEdicion+"lista3","Auditorias de Proyectos  No Permitidas");
		
      crearSelectOneMenuObligMultipleCompleto("selSeccionTrab","",listFullSeccionesTrab,"id",
         "nombre","#"+idCompanyEdicion+"secctrab","Secciones de Trabajador");	 
		
      crearSelectOneMenuObligMultipleCompleto("selModulosInvi","",listaModulosEmpresa,
         "menuOpcionId","menuOpcionNombre","#"+idCompanyEdicion+"moduloInvisi","Módulos Invisibles");	 
	
      listFullSeccionesTrab.forEach(function(val){
         val.selected = 0;
      });
		
      crearSelectOneMenuObligUnitarioCompleto("selSeccionTrabDefault","",listFullSeccionesTrab,
         "id","nombre","#"+idCompanyEdicion+"secctrabdef","Sección default");	 
				
      var options={
	     container:"#inputEvidenciaLogo",
	     functionCall:function(){},
	     descargaUrl: "",
	     esNuevo:true,
	     idAux:"Company",
	     evidenciaNombre: "" 
		  };
	
      crearFormEvidenciaCompleta(options);	
      formatoCeldaSombreableTabla(false,"tblEmpresas");
      idCompanyEdicion = 0;
      habilitarBotonesNuevo();
      banderaEdicion = true;
		
      if(tutorialOn){
	 $("#btnCancelar").hide();
	 $("#btnObjetivo").hide();
			
	 var divObject={
	        divId:"containerEmpresa",
	        titulo:"Registrando Datos de Empresa",
	        cuerpo:"Estos son datos que se usarán en los reportes GOSST"
	               };
	 
	 siguientePasoTutorial(divObject);
      }
   }else{
      alert("Guarde primero.");
   }
	
   $("#btnCodigoCIIU").hide();$("#btnLinkVisita").hide();$("#btnValoresPreviosConsolidadoTrab").hide();
   $("#btnConfiguracionEmpresa").hide();
}

function eliminarEmpresa() {
	var r = confirm("¿Está seguro de eliminar la empresa?");
	if (r == true) {
		var dataParam = {
			idCompany : idCompanyEdicion
		};

		callAjaxPost(URL + '/empresa/delete', dataParam,
				procesarEliminarEmpresa);
	}

}

function cancelarNuevaEmpresa() {
	listarEmpresa();
}

function guardarEmpresa(){
   var campoVacio = true;
   var nuevaEmpresa = 0;

	if ($("#inputRuc").val().length == 0) {
		campoVacio = false;
	}
	if ($("#inputRS").val().length == 0) {
		campoVacio = false;
	}
	if ($("#inputDom").val().length == 0) {
		campoVacio = false;
	}
	if ($("#inputRub").val().length == 0) {
		campoVacio = false;
	}
	if ($("#inputAseg").val().length == 0) {
		campoVacio = false;
	}
	if ($("#inputAnInic").val().length == 0) {
		campoVacio = false;
	}
var nombreAreaSst=$("#inputNombreAreaSst").val();
var nombreDivision=$("#inputNombreDivision").val(); 
var nombreArea=$("#inputNombreArea").val();
var nombreUnidad=$("#inputNombreUnidad").val();

	var objetivoFormacion=$("#objetivo0").val();
	var objetivoExam=$("#objetivo1").val();
	var objetivoEpp=$("#objetivo2").val();
	var objetivoParticipacion=$("#objetivo3").val();
	var objetivoDisponibilidad=$("#objetivo4").val();
	var objetivoIperc=$("#objetivo5").val();
	var correoNuevo=$("#inputCorreoAsociado").val();
//	var wants=($("#checkWantsCorreo").prop("checked")?1:0);
	
//   var wantsCorreoForRenCov = ($("#checkWantsCorreoForRenCov").prop("checked")?1:0);
//   var wantsCorreoDiaForRenCov = ($("#checkWantsCorreoDiaForRenCov").prop("checked")?1:0);
//   var wantsCorreoEventosResp = ($("#checkWantsCorreoEventosResp").prop("checked")?1:0);
//   var wantsCorreoDocEvalResp = ($("#checkWantsCorreoDocEvalResp").prop("checked")?1:0);
//   var wantsCorreoCargoInduccVirtualResp = ($("#checkWantsCorreoCargoInduccVirtualResp").prop("checked")?1:0);
	
//	var isProyectoSimple=($("#checkProyectoSimple").prop("checked")?1:0);
	
	
	var wantsColaboradorObjetivos=($("#checkWantsObj").prop("checked")?1:0);
	var wantsColaboradorAccidentabilidad=($("#checkWantsAcc").prop("checked")?1:0);
//	var wantsEvalTriple=($("#checkEvalTriple").prop("checked")?1:0);
	
	var aceptarCambioCoreo=true;
	var confirmCorreo=confirmCorreoActual;
	if(correoAsociadoActual==correoNuevo || idCompanyEdicion==0){
		
	}else{
		aceptarCambioCoreo=confirm("Si cambia el correo deberá confirmarlo nuevamente, ¿desea seguir?");
		confirmCorreo=0;
	}
	var listAuditoria1=$("#selListaAuditoria1").val();
	var listAuditoria2=$("#selListaAuditoria2").val(); 
	var listAuditoria3=$("#selListaAuditoria3").val(); 
	var listAuditoriaFinal=[];
	if(listAuditoria1!=null)
	{
		listAuditoria1.forEach(function(val)
		{
			listAuditoriaFinal.push({id:parseInt(val)});
		});;
	}
	if(listAuditoria2!=null)
	{
		listAuditoria2.forEach(function(val)
		{
			listAuditoriaFinal.push({id:parseInt(val)});
		});;
	}
	if(listAuditoria3!=null)
	{
		listAuditoria3.forEach(function(val)
		{
			listAuditoriaFinal.push({id:parseInt(val)});
		});;
	}
	var listSeccionTrab=$("#selSeccionTrab").val(); 
	var listSeccionTrabFinal=[];
	if(listSeccionTrab!=null)
	{
		listSeccionTrab.forEach(function(val)
		{
			listSeccionTrabFinal.push({id:parseInt(val)});
		});
	}
	//
	var listModulosInvi = $("#selModulosInvi").val();
	var listModulosInvisible=[];
	if(listModulosInvi!=null)
	{
		listModulosInvi.forEach(function(val)
		{
			listModulosInvisible.push({menuOpcionId:parseInt(val)});
		});
	}
	//
	var listTrabInteresados=$("#selTrabInter").val(); 
	var listTrabInteresadosFinal=[];
	if(listTrabInteresados!=null)
	{
		listTrabInteresados.forEach(function(val)
		{
			listTrabInteresadosFinal.push({trabajadorId:parseInt(val)});
		});
	}
	var seccionTrabajadorDefaultId = $("#selSeccionTrabDefault").val();
	
   if(aceptarCambioCoreo){
      if(campoVacio){
         var dataParam={
	    ruc: $("#inputRuc").val(),seccionTrabajadorDefault: {id: seccionTrabajadorDefaultId},
	    wantsColaboradorObjetivos: wantsColaboradorObjetivos,
	    wantsColaboradorAccidentabilidad: wantsColaboradorAccidentabilidad,
	    nombreAreaSst: nombreAreaSst,nombreDivision: nombreDivision,
	    nombreArea: nombreArea,nombreUnidad: nombreUnidad,name: $("#inputRS").val(),
	    address: $("#inputDom").val(),category: $("#inputRub").val(),insurance: $("#inputAseg").val(),
	    activityInitialYear: $("#inputAnInic").val(),correoAsociado: correoNuevo,
	    confirmaCorreo: confirmCorreo,idCompany: idCompanyEdicion,objetivoFormacion: objetivoFormacion/100,
	    objetivoExam: objetivoExam/100,objetivoEpp: objetivoEpp/100,objetivoParticipacion: objetivoParticipacion,
	    objetivoDisponibilidad: objetivoDisponibilidad/100,objetivoIperc: objetivoIperc/100,
	    listTipoAuditoria: listAuditoriaFinal,listSeccionTrabajador: listSeccionTrabFinal,
	    listModulosInvisible: listModulosInvisible,listTrabInteresados: listTrabInteresadosFinal
	    
//	    wantsCorreo:wants,wantsEvalTriple:wantsEvalTriple,isProyectoSimple:isProyectoSimple,
//	    wantsCorreoForRenCov:wantsCorreoForRenCov,wantsCorreoDiaForRenCov:wantsCorreoDiaForRenCov,
//	    wantsCorreoEventosResp:wantsCorreoEventosResp,wantsCorreoDocEvalResp:wantsCorreoDocEvalResp,
//	    wantsCorreoCargoInduccVirtualResp:wantsCorreoCargoInduccVirtualResp
         };
			
         callAjaxPost(URL+'/empresa/save',dataParam,procesarGuardarEmpresa);
      }else{
         alert("Debe ingresar todos los campos.");
      }
   }	
}

function procesarGuardarEmpresa(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 guardarEvidenciaAuto(data.idNuevo,"fileEviCompany",bitsEvienciaLogo,'/empresa/logo/save',
	    cargarEmpresasxUsuario,"companyId");
		
	 $("#tblEmpresas tbody tr").remove();
	 listarEmpresa();
	 deshabilitarBotonesEdicion();
		
	 if(tutorialOn){
	 }else{
	    //location.reload();
	 }
	
	 banderaEdicion = false;
		
	 break;
	
      default:
         alert("Ocurrió un error al guardar la empresa!");
   }
}

function procesarEliminarEmpresa(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		listarEmpresa();
		deshabilitarBotonesEdicion(); 
		cargarEmpresasxUsuario();
		banderaEdicion = false;
		break;
	default:
		alert("Ocurrió un error al eliminar la empresa!");
	}
}

function mostrarCargarImagen(companyId) {
	$('#mdUpload').modal('show');
	$('#mdUpload .modal-title:first').html("Subir logo  ");

	$('#mdUpload .modal-title:last').html(" (Tamaño recomendable: 100x150)");
	$('#btnUploadLogo').attr("onclick",
			"javascript:uploadLogo(" + companyId + ");");
}

function uploadLogo(companyId) {
	$.blockUI({
		message : 'cargando...'
	});
	 guardarEvidenciaAuto(companyId,"fileEvi",512000,'/empresa/logo/save',function(){
		 $.unblockUI();
			$('#mdUpload').modal('hide');
	 },"companyId");
}
function obtenerTablaClipboard() {
	
	new Clipboard('#btnClipTabla', {
		text : function(trigger) {
			
			return listFullTablaIndicadores;
		}
	});
	alert("Se han guardado los indicadores al Clipboard")
}



function procesarIndicadorEmpresa(data){

	if(data.CODE_RESPONSE=="05"){
var indicadorFormacion=	0;
var indicadorAcumulado=0;
		var indicadorEntregaEpp=	0;
		var indicadorDisponibilidad=	0;
		var indicadorParticipacion=	0;
		var indicadorExamenMedico=	0;
for(index=0;index<data.indFormacion.length;index++){
	indicadorAcumulado=data.indFormacion[index].cumplimientoFormacion+indicadorAcumulado;
	var size=data.indFormacion.length ;
	(index+1==size ? indicadorFormacion=indicadorAcumulado/size : 0)
}
indicadorAcumulado=0;
for(index=0;index<data.indEpp.length;index++){
	var entregadosVigentes= data.indEpp[index].entregasLastYear;
	var asignados=data.indEpp[index].eppAsignados;
	if( asignados>0){
		indicadorAcumulado=(entregadosVigentes/asignados)+indicadorAcumulado;
	}else{
		indicadorAcumulado=1+indicadorAcumulado;
	}
	
	var size=data.indEpp.length ;
	(index+1==size ? indicadorEntregaEpp=indicadorAcumulado/size : 0)
}
indicadorAcumulado=0;
for(index=0;index<data.indAcc.length;index++){
	indicadorAcumulado=data.indAcc[index].indicadorDiasDescanso+indicadorAcumulado;
	var size=data.indAcc.length ;
	(index+1==size ? indicadorDisponibilidad=indicadorAcumulado/size : 0)
}
indicadorAcumulado=0;
for(index=0;index<data.indEvento.length;index++){
	indicadorAcumulado=data.indEvento[index].numEventosReportados+indicadorAcumulado;
	var size=data.indEvento.length ;
	(index+1==size ? indicadorParticipacion=indicadorAcumulado/size : 0)
}
indicadorAcumulado=0;
for(index=0;index<data.indExam.length;index++){
	indicadorAcumulado=data.indExam[index].vigenciaMedicaPuntaje+indicadorAcumulado;
	var size=data.indExam.length ;
	(index+1==size ? indicadorExamenMedico=indicadorAcumulado/size : 0)
}

	var	 evalRealizadas=data.indIperc[0].evalRealizadas;
	var	 evalRiesgosas=data.indIperc[0].evalRiesgosas;
		
		var indicadorIperc=(evalRealizadas==0 ? 0:(evalRealizadas-evalRiesgosas)/evalRealizadas)	;
		
		var objIndicadores=[indicadorFormacion, 
		                    indicadorExamenMedico, 
		                    indicadorEntregaEpp, 
				               indicadorParticipacion, 
				               indicadorDisponibilidad,
				               indicadorIperc];
		
		 listFullTablaIndicadores="";
		listFullTablaIndicadores="Campo" +"\t"
		+"Objetivo" +"\t"
		+"Indicador" +"\t"
		+"Meta" +"\t"
		+"Resultado" +"\t"+"\n";
		for (var index = 0; index < listObjetivos.length; index++){
			
			listFullTablaIndicadores=listFullTablaIndicadores
			+listObjetivos[index].campo+"\t"
			+listObjetivos[index].objetivo+"\t"
			+listObjetivos[index].indicador+"\t"
			+$("#objetivo"+index).val()+"\t"
			+(objIndicadores[index])+"\t"
			+"\n"

		}

		$("#modalObjetivoEmpresa").modal("show");
	}else{
		console.log("T")
	}
			

			
}

function solicitarConfirmacionCorreo(pindex){
	var idCompanyAux=listFullEmpresa[pindex].idCompany;
	var nombre=listFullEmpresa[pindex].name;
	var correoAsociado=listFullEmpresa[pindex].correoAsociado;
	var adress=window.location.href;
	if(adress.indexOf("perfil")!=-1){
		adress="perfiles.html"
	}else{
		adress="empresa.html"
	}
	var dataParam = {
			idCompany : idCompanyAux,
			name:nombre,
			address:adress,
			correoAsociado:correoAsociado
		};console.log(dataParam)
	callAjaxPost(URL + '/empresa/confirmarCorreo', dataParam, function(){
		alert("Confirmación enviada. ")
	});
}

function confirmarEstadoCorreo(){
	var correoNuevo=$("#inputCorreoAsociado").val();
	var textoConfirm="";
	if(correoNuevo==correoAsociadoActual){
		if(confirmCorreoActual==1){
			textoConfirm="<i aria-hidden='true' class='fa fa-check'></i>Confirmado"
		}else{
			textoConfirm="Confirmacion Pendiente"
		}
		
	}else{
		textoConfirm="Confirmacion Pendiente"
	}
	$("#" + idCompanyEdicion + "empConfirmCorreo").html(textoConfirm)
}

function encontrarListaAuditoria()
{ 
	for(var i=1;i<=3;i++)
	{
		var listFullTipoTemp=[]; 
		listFullTipoAuditora.forEach(function(val,index)
		{ 
			if(val.clasificacion.clasificacionId==i)
			{
				listFullTipoTemp.push({id:val.id,nombre:val.nombre,clasificacion:{clasificacionId:val.clasificacion.clasificacionId}});
			}
		});
		if(i==1)
		{
			listFullAuditora1=listFullTipoTemp;
		}
		else if(i==2)
		{
			listFullAuditora2=listFullTipoTemp;
		}
		else if(i==3)
		{
			listFullAuditora3=listFullTipoTemp;
		}
	} 
}

var listOpcConsolidadoTrab=[
   {id:1,nombre:"Cumplimiento - Firma electrónica de los trabajadores"}
];

function ocultarConsolidadosExcelTrabajadores(){
   $("#modalConsolidadosExcelTrab").modal("hide");
}

function verConsolidadosExcelTrabajadores(){
   $("#modalConsolidadosExcelTrab").remove();

   var selOpcConExcelTrab = crearSelectOneMenuOblig("selOpcConExcelTrab",
      "verAcordeConsolidadosExcelTrabajadores()",listOpcConsolidadoTrab,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelTrab,divContainer:"divSelConExcelEvalTrab"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelTrabajadores()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelTrabajadores()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalConsolidadosExcelTrab",nombre:"<i class='fa fa-filter'></i> Seleccionar - Consolidado excel",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelTrabajadores();
}

function verAcordeConsolidadosExcelTrabajadores(){
   $(".atributo-consolidadoExcelTrab").remove(); 
   var listContenidoDivSelConExcelTrab = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelEvalDocProy").val());
   
   if([1].includes(opcConsolidadoExcel)){
   
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelTrab.forEach(function(val){
      val.clase = "atributo-consolidadoExcelTrab";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelConExcelEvalTrab").parent().after(contenido);
}

function descargarConsolidadosExcelTrabajadores(){
   var campoVacio = true;
   
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelTrab").val());
   
   if(campoVacio){
      if([1].includes(opcConsolidadoExcel)){
         window.open(URL+"/empresa/excel/consolidado/trabajadores?" +
            "empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel);
      }
   }else{
      $("#modalConsolidadosExcelEvalDocProy").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionFiltroExcel");
      
      $("#modalMensajeUxValidacionFiltroExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelEvalDocProy").modal("show");
      });
   }
}
