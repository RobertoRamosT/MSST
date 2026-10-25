var listFullConsolidadoCovid=[];
var listUnidadesId = [];
var listDivisionesId = [];
var listAreasId = [];
var listPuestosId = [];
var listModalidadesId = [];
var listResultadosId = [];
var listEstadosEspecificosId = [];
var mensajeUx;

var listTabs=[
   {id:1,nombre:"COVID-19" },
   {id:2,nombre:"Formularios renovables"},
   {id:3,nombre:"Estado del trabajador - Hoy"},
   {id:4,nombre:"Programación asistencia presencial"}
];

$(function(){    
   var selTabCovid=crearSelectOneMenuOblig("selTabCovid","verAcordeTabCovid()",
      listTabs,"3","id","nombre");
   $("#divListaTabsCovid").html("Pestaña: "+selTabCovid);

   insertMenuPrimeraVez(function(){
      verAcordeTabCovid();
   }); 
   
   /*insertMenuPrimeraVez(function(){
      cargarConsolidadoCovid();
      completarBarraCarga();
      crearFiltroCovid();
      $("#tabCovid").show();
   });*/
})

function verAcordeTabCovid(){
//   $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
    	 
   var tabId = $("#selTabCovid").val();
   var tabNombre="";
	
   $(".tab-content .tab-pane").hide();
	
   switch(parseInt(tabId)){
      case 1:
         tabNombre="tabCovid";
         $("#modalFiltroCovid").remove();
         crearFiltroCovid(cargarConsolidadoCovid);
         break;
		
      case 2:
	 tabNombre="tabFormularioRenovable";
	 $("#modalFiltroForRen").remove();
	 crearFiltroFormularioRenovable(cargarEstadoFormularioRenovable);
	 break;
	  
      case 3:
	 tabNombre="tabEstadoTrabajadorHoy";
	 $("#tabEstadoTrabajadorHoy h2")
	 .html("<label>Trabajador(es) - Estado del "+getSession("fechaHoyTexto")+"</label>");
	 $("#modalFiltroEstTrabHoyCov").remove();
	 crearFiltroEstadoTrabHoyCov();
	  //cargarExtra();
	 break;
	  
      case 4:
	 tabNombre = "tabReunionVirtualCovid";
	 cargarReunionVirtualCovid();
	 break;	
   }
   
   $("#"+tabNombre).show();
}

function ocultarFiltroCovid(){
   $("#modalFiltroCovid").modal("hide");
}

function verFiltroCovid(){
   $("#modalFiltroCovid").modal("show");
}

function crearFiltroCovid(functionCallBack){
   $("#modalFiltroCovid").remove();
      
   var dataParam={
      empresaId:getSession("gestopcompanyid"),
      idCompany:getSession("gestopcompanyid")
   }; 
		
   callAjaxPost(URL + '/covid/trabajadores/filtro',dataParam,function(data){
      //listNombreProductos= data.listNombreProductos; 
      var listUnidades= data.listUnidades;
      var listDivisiones= data.listDivisiones;
      var listAreas= data.listAreas;
      var listPuestos= data.listPuestos;
      var listModalidades= data.listModalidades;
      var listTiposConfirmacionCovid= data.listTiposConfirmacionCovid;
      var listEstadosEspecificosCovid= data.listEstadosEspecificosCovid;
      
      var contenido = "";
				
      var listContenido=[
	 {sugerencia:"",label:"Unidad",inputForm:"",divContainer:"divFiltroUnidadesCovid"},
	 {sugerencia:"",label:"División",inputForm:"",divContainer:"divFiltroDivisionesCovid"},
	 {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroAreasCovid"},
	 {sugerencia:"",label:"Puesto de trabajo",inputForm:"",divContainer:"divFiltroPuestosCovid"},
	 {sugerencia:"",label:"Modalidad de trabajo",inputForm:"",divContainer:"divFiltroModalidadesCovid"},
	     //{sugerencia:"",label:"Resultado de la última observación médica",inputForm:"",divContainer: "divFiltroResultadosCovid"},
	 {sugerencia:"",label:"Estado actual del trabajador",inputForm:"",divContainer:"divFiltroEstadosEspecificosCovid"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	 {sugerencia:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	  		"onclick='ocultarFiltroCovid()'>" +
	      	   "<i class='fa fa-times'></i> Cancelar" +
	      	"</button>",
	  inputForm:"<button id='btnAplicarFiltroCovid' class='btn btn-success' type='submit' " +
	  		    "onclick='cargarConsolidadoCovid()' style='float:right;font-size:18px;'>" +
	               "<i class='fa fa-filter'></i> Aplicar filtro" +
	      	    "</button>"},
      ]; 
				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
				
      var modalOptionsCov={
	 id: "modalFiltroCovid",
	 nombre: "<i class='fa fa-filter'></i>Filtros",
	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroUnidadesCovid").length > 0){
	    return;
         }
         
         crearSelectOneMenuObligMultipleCompleto("filtroUnidadesCovid","",listUnidades,"matrixId",
            "matrixName","#divFiltroUnidadesCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroDivisionesCovid","",listDivisiones,"divisionId",
            "divisionName","#divFiltroDivisionesCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroAreasCovid","",listAreas,"areaId",
            "areaName","#divFiltroAreasCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroPuestosCovid","",listPuestos,"puestoId",
            "puestoNombre","#divFiltroPuestosCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroModalidadesCovid","",listModalidades,"id",
     	    "nombre","#divFiltroModalidadesCovid","Todos");
         //crearSelectOneMenuObligMultipleCompleto("filtroResultadosCovid","",listTiposConfirmacionCovid,"id",
     	   // 	    "nombre","#divFiltroResultadosCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosEspecificosCovid","",listEstadosEspecificosCovid,"id",
	    "nombre","#divFiltroEstadosEspecificosCovid","Todos");
      },true,true);
				
      $("#btnAplicarFiltroCovid").on("click",function(){
	 ocultarFiltroCovid() 
      });
				
      $("#modalFiltroCovid").modal("hide");
      functionCallBack();
      completarBarraCarga();
   });
}

function valoresFiltroCovid(){
   listUnidadesId = [];
   var unidadId = $("#filtroUnidadesCovid").val();
   if(unidadId != null){
      unidadId.forEach(function(val){
         listUnidadesId.push(parseInt(val));
      });
   }
    
   listDivisionesId = [];
   var divisionId = $("#filtroDivisionesCovid").val();
   if(divisionId != null){
      divisionId.forEach(function(val){
         listDivisionesId.push(parseInt(val));
      });
   }
    
   listAreasId = [];
   var areaId = $("#filtroAreasCovid").val();
   if(areaId != null){
      areaId.forEach(function(val){
	 listAreasId.push(parseInt(val));
      });
   }
    
   listPuestosId = [];
   var puestoId = $("#filtroPuestosCovid").val();
   if(puestoId != null){
      puestoId.forEach(function(val){
         listPuestosId.push(parseInt(val));
      });
   }
    
   listModalidadesId = [];
   var modalidadId = $("#filtroModalidadesCovid").val();
   if(modalidadId != null){
      modalidadId.forEach(function(val){
	 listModalidadesId.push(parseInt(val));
      });
    }
    
   /*listResultadosId = [];
   var resultadoId = $("#filtroResultadosCovid").val();
   if(resultadoId != null){
      resultadoId.forEach(function(val){
	 listResultadosId.push(parseInt(val));
      });
   }*/
   
   listEstadosEspecificosId = [];
   var estadoEspecificoId = $("#filtroEstadosEspecificosCovid").val();
   if(estadoEspecificoId != null){
      estadoEspecificoId.forEach(function(val){
	 listEstadosEspecificosId.push(parseInt(val));
      });
   }
}

function cargarConsolidadoCovid(data){
   resizeDivWrapper("wrapperCovid",180);
   
// 524 ->  id de ISEG
   if(parseInt(getSession("gestopcompanyid")) != 524){
      $("#btnConsolidadoNumTrabajadoresCovid").hide();  
   }
     
   valoresFiltroCovid();
    
   var dataParam2={
      empresaId: getSession("gestopcompanyid"),	
      trabajadorConRiesgo: 2, //TODOS LOS TRABAJADORES
      listUnidadesIdFiltro: (listUnidadesId.length==0?null:listUnidadesId),
      listDivisionesIdFiltro: (listDivisionesId.length==0?null:listDivisionesId),
      listAreasIdFiltro: (listAreasId.length==0?null:listAreasId),
      listPuestosIdFiltro: (listPuestosId.length==0?null:listPuestosId),
      listModalidadesIdFiltro: (listModalidadesId.length==0?null:listModalidadesId),
	   //listResultadosIdFiltro : (listResultadosId.length==0?null:listResultadosId),
      listEstadosEspecificosIdFiltro: (listEstadosEspecificosId.length==0?null:listEstadosEspecificosId)
   };

   callAjaxPost(URL+'/covid/trabajadores/revisar/vista_admin',dataParam2,function(data){
      listFullConsolidadoCovid = data.trabajadores;
      $("#tblCovid tbody tr").remove();
	
      listFullConsolidadoCovid.forEach(function(val){
         $("#tblCovid tbody").append(
            "<tr id='trCovid"+val.id+"'>" +
	       "<td id='tdnombrecov"+val.id+"'>"+val.nombre+"</td>" +
	       "<td id='tddnicov"+val.id+"'>"+val.dni+"</td>" +
	       "<td id='tdedadcov"+val.id+"'>"+val.edad+"</td>" +
	       "<td id='tddireccioncov"+val.id+"'>"+val.ultimoAntecedente.direccion+"</td>" +
	       "<td id='tdcorreocov"+val.id+"'>"+val.correo+"</td>" +
	       "<td id='tdtelcontactocov"+val.id+"'>"+val.ultimoAntecedente.telefonoContacto+"</td>" +
	       "<td id='tdpercontactocov"+val.id+"'>"+val.ultimoAntecedente.personaContacto+"</td>" +
	       "<td id='tdtelpercontactocov"+val.id+"'>"+val.ultimoAntecedente.telefonoPersonaContacto+"</td>" +
	       "<td id='tdunidadcov"+val.id+"'>"+val.area.matrixName+"</td>" +
	       "<td id='tddivisioncov"+val.id+"'>"+val.area.divisionName+"</td>" +
	       "<td id='tdareacov"+val.id+"'>"+val.area.areaName+"</td>" +
	       "<td id='tdpuestotrabajocov"+val.id+"'>"+val.puesto.positionName+"</td>" +
	       "<td id='tdantpersonalcov"+val.id+"'>"+val.condicionAntecedentePersonal+"</td>" +
	       "<td id='tdconentornocov"+val.id+"'>"+val.condicionAntecedenteEntorno+"</td>" +
	       "<td id='tdsospechacov"+val.id+"'>"+(val.hasAccesoCovid == 1?"No":"Sí")+"</td>" +
	       "<td id='tdmodtrabajocov"+val.id+"'>"+val.modTrabajo.nombre+"</td>" +
	       "<td id='tdformulariofechacov"+val.id+"'>"+val.ultimoFormulario.fechaActualizacionTexto+"</td>" +
	       "<td id='tdtipoconfirmacioncov"+val.id+"'>"+val.ultimaObservacionMedica.tipoConfirmacionCovid.nombre+"</td>" +
	       "<td id='tdobservacionfechacov"+val.id+"'>"+val.ultimaObservacionMedica.fechaTexto+"</td>" +
	       "<td id='tdestadoespecificocov"+val.id+"'>"+val.estadoEspecificoCovid.nombre+"</td>" +
	    "</tr>");
      });
	
      goheadfixedY("#tblCovid","#wrapperCovid");
   });
}

function ocultarFiltroRegistrosConForCov(){
   $("#modalFiltroRegConForCov").modal("hide");
}

function filtrarRegistrosConsolidadoFormularioCovid(){

   var contenido = "";
 				
   var listContenido=[
 	  {sugerencia:"",label:"Desde",inputForm:"<input type='date' class='form-control' id='fechaInicioRegConForCov'>"},
 	  {sugerencia:"",label:"Hasta",inputForm:"<input type='date' class='form-control' id='fechaFinRegConForCov'>"},
 	  {sugerencia:"",label:"",inputForm:""},
 	  {sugerencia:"",
 	   label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroRegistrosConForCov()'>" +
 	            "<i class='fa fa-times'></i> Cancelar" +
 	         "</button>",
 	   inputForm:"<button id='btnAplicarFiltroRegConForCov' class='btn btn-success' type='submit' " +
 	   		     "onclick='generarConsolidadoFormularioCovid()' style='float:right;'>" +
 	   	        "<i class='fa fa-filter'></i> Aplicar filtro" +
 	   	     "</button>"},
 	             ];
 				
   listContenido.forEach(function(val){
      contenido +=obtenerSubPanelModuloGeneral(val);
   });
 				
   var modalOptionsCov={
	  id: "modalFiltroRegConForCov",
	  nombre: "<i class='fa fa-filter'></i> Filtros - Registros Consolidado Formulario Covid",
	  contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
	               };
 				
   crearModalPrincipalUsuario(modalOptionsCov,function(){},false);
 				
   $("#btnAplicarFiltroRegConForCov").on("click",function(){
      ocultarFiltroRegistrosConForCov();
   });
   
   var hoy=obtenerFechaActual();
   $("#fechaInicioRegConForCov").val(sumaFechaDias(-1,hoy));
   $("#fechaFinRegConForCov").val(hoy);
 				
   $("#modalFiltroRegConForCov").modal("show");
}

function generarConsolidadoFormularioCovid(){
   var campoVacio = true;
    
   var valFechaInicioCon = $("#fechaInicioRegConForCov").val();
   var valFechaFinCon = $("#fechaFinRegConForCov").val();
   var fechaInicioConText = convertirFechaNormal(valFechaInicioCon);
   var fechaFinConText = convertirFechaNormal(valFechaFinCon);
    
   if(valFechaInicioCon.length == 0){
      valFechaInicioCon = null;
   }
    
   if(valFechaFinCon.length == 0){
      valFechaFinCon = null;
   }
   
   if(valFechaInicioCon == null || valFechaFinCon == null){
      campoVacio = false
   }
    
   if(campoVacio){
      var dataParam={
   	     empresaId: getSession("gestopcompanyid"),
   	     fechaInicioConsolidado:valFechaInicioCon,
   	     fechaFinConsolidado:valFechaFinCon
                    }
      
      callAjaxPost(URL+'/covid/validacion/excel/consolidado_formulario_covid',dataParam,function(data){
//	 console.log(data.numRegistroFomCov);
         if(data.numRegistroFomCov <= 32000){
            window.open(URL+"/covid/excel/consolidado_formulario_covid?empresaId=" +
	       getSession("gestopcompanyid")+"&fechaInicioConsolidado="+valFechaInicioCon +
	       "&fechaFinConsolidado="+valFechaFinCon+"&fechaInicioConsolidadoNormal="+
	       fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
         }else{
            mensajeUx="El número de registros en el excel supera los 32 000 filas. <br>" +
             	      "Por favor. Cambie el rango de la fecha para reducir el número de filas.";
            mensajesUx(mensajeUx,2,"","RegresarModalFiltroConForCov");
             
            $("#modalMensajeUxRegresarModalFiltroConForCov").on("hidden.bs.modal",function(){
               $("#modalFiltroRegConForCov").modal("show");
            }); 
         }
      });	
      
   }else{
      mensajeUx="Debe completar todos los campos activos.";
      mensajesUx(mensajeUx,2,"","RegresarModalFiltroConForCov");
      
      $("#modalMensajeUxRegresarModalFiltroConForCov").on("hidden.bs.modal",function(){
         $("#modalFiltroRegConForCov").modal("show");
      });
   }
}

function ocultarElegirConsolidadoNumTrabajadoresCovid(){
   $("#modalAplicarOpcionConsolidadoNumTraCov").modal("hide");
   $("#modalAplicarOpcionConsolidadoNumTraCov").remove();
}

function elegirConsolidadoNumTrabajadoresCovid(){
	
   var listOpcionesConsolidadoNumTrabCov=[
 	  {id:1,nombre:"División"},
 	  {id:2,nombre:"Área 1"},
 	  {id:3,nombre:"Área 2"},
 	  {id:4,nombre:"Site"},
 	  {id:5,nombre:"Tipo de planilla"}
 	                                 ]
 	                            
   var selOpcionConsolidadoNumTrabCov = crearSelectOneMenuOblig("selOpcionConsolidadoNumTrabCov","",
	  listOpcionesConsolidadoNumTrabCov,"","id","nombre");
 	
   var contenido = "";
 	
   var listContenido=[
          {sugerencia:"",label:"Ordenar por",
           inputForm:selOpcionConsolidadoNumTrabCov},
          {sugerencia:"",label:"",inputForm:""},
          {sugerencia:"",
           label:"<button class='btn btn-danger' type='button' onclick='ocultarElegirConsolidadoNumTrabajadoresCovid()'>" +
                    "<i class='fa fa-times'></i> Cancelar" +
                 "</button>",
 	   inputForm:"<button id='btnAplicarOpcionConsolidadoNumTraCov' class='btn btn-success' style='float:right;' " +
 	            	     "type='submit' onclick='descargarConsolidadoElegidoNumTrabajadoresCovid()'>" +
 	                "<i class='fa fa-download'></i> Descargar" +
 	             "</button>"},
 	             ];
 				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloGeneral(val);
   });
     
   var modalOptions={
          id:"modalAplicarOpcionConsolidadoNumTraCov",
          nombre:"<i class='fa fa-table'></i> Opciones - Consolidado número trabajadores COVID-19",
          contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
                    };
 		
   crearModalPrincipalUsuario(modalOptions,function(){},false);
 	
   $("#btnAplicarOpcionConsolidadoNumTraCov").on("click",function(){
      ocultarElegirConsolidadoNumTrabajadoresCovid(); 
   });
    
   $("#modalAplicarOpcionConsolidadoNumTraCov").modal("show");
}

function descargarConsolidadoElegidoNumTrabajadoresCovid(){
   var valOpcConsolidado = parseInt($("#selOpcionConsolidadoNumTrabCov").val());

   window.open(URL+"/covid/excel/consolidado_numero_trabajadores_covid?idCompany=" + 
      parseInt(getSession("gestopcompanyid"))+"&valOpcionConsolidado="+valOpcConsolidado);
}

function generarConsolidadoNumTrabajadoresEmpresaPorPerfilMedicoCovid(){
    window.open(URL+"/covid/excel/consolidado_numero_trabajadores_empresa_perfil_medico_covid");	
}

function copiarTablaCovid(){
    var list=obtenerDatosBodyTablaEstandar("tblCovid");
    copiarAlPortapapeles(list,"btnClipTablaCovid");
    mensajeUx="Se han copiado todas las filas de la tabla COVID-19.";
    mensajesUx(mensajeUx,1,"");
}

function ocultarFiltroPrevioObsMedicaEstadoTrabCovid(){
   $("#modalFiltroPreObsMedEstTrabCov").modal("hide");
}

function filtrarPrevioObsMedicaEstadoTrabCovid(){
   $("#modalFiltroPreObsMedEstTrabCov").remove();
    
   var contenido = "";
  				
   var listContenido=[
      {sugerencia:"",label:"Desde",
       inputForm:"<input type='date' class='form-control' id='fechaInicioPreObsMedEstTrabCov'>"},
      {sugerencia:"",label:"Hasta",
       inputForm:"<input type='date' class='form-control' id='fechaFinPreObsMedEstTrabCov'>"},
       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
       		     "onclick='ocultarFiltroPrevioObsMedicaEstadoTrabCovid()'>" +
  	        "<i class='fa fa-times'></i> Cancelar" +
  	     "</button>",
       inputForm:"<button id='btnAplicarFiltroPreObsMedEstTrabCov' class='btn btn-success' type='submit' " +
  	   		 "onclick='generarConsolidadoEstadoTrabajadorObservacionMedica()' style='float:right;font-size:18px;'>" +
  	   	    "<i class='fa fa-file-excel-o'></i> Generar" +
  	   	 "</button>"}
   ];
  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  				
   var modalOptionsCov={
      id: "modalFiltroPreObsMedEstTrabCov",
      nombre: "<i class='fa fa-file-excel-o'></i> Excel - Registros Consolidado Estado del " +
      	      "trabajador según observación médica",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
  				
   crearModalPrincipalUsuario(modalOptionsCov,function(){},true,true);
  				
   $("#btnAplicarFiltroPreObsMedEstTrabCov").on("click",function(){
      ocultarFiltroPrevioObsMedicaEstadoTrabCovid();
   });
    
   var hoy = getSession("fechaHoyOrdenInversoTexto");
    
   $("#fechaInicioPreObsMedEstTrabCov").val(sumaFechaDias(-180,hoy));
   $("#fechaFinPreObsMedEstTrabCov").val(hoy);
  				
   $("#modalFiltroPreObsMedEstTrabCov").modal("show");
}

function generarConsolidadoEstadoTrabajadorObservacionMedica(){
   var campoVacio = true;
     
   var valFechaInicioCon = $("#fechaInicioPreObsMedEstTrabCov").val();
   var valFechaFinCon = $("#fechaFinPreObsMedEstTrabCov").val();
   var fechaInicioConText = convertirFechaNormal(valFechaInicioCon);
   var fechaFinConText = convertirFechaNormal(valFechaFinCon);
   
   if(valFechaInicioCon.length == 0 || valFechaFinCon.length == 0){
      campoVacio = false
   }
     
   if(campoVacio){
      window.open(URL+"/covid/excel/consolidado_estado_trabajador_observacion_medica?empresaId=" +
         getSession("gestopcompanyid")+"&fechaInicioConsolidado="+valFechaInicioCon +
         "&fechaFinConsolidado="+valFechaFinCon+"&fechaInicioConsolidadoNormal="+
 	 fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
   }else{
      mensajeUx="<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","RegresarInicioModCovid");
       
      $("#modalMensajeUxRegresarInicioModCovid").on("hidden.bs.modal",function(){
         $("#modalFiltroPreObsMedEstTrabCov").modal("show");
      });
   }
}
