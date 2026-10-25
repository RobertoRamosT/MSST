
var listFullConsolidadoTrabajador=[];
var listUnidadesId = [];
var listDivisionesId = [];
var listAreasId = [];
var listPuestosId = [];
var listModalidadesId = [];
var listResultadosId = [];
var mensajeUx;

function ocultarFiltroTrabajadorCovid(){
   $("#modalFiltroTrabajadorCovid").modal("hide");
}

function verFiltroTrabajadorCovid(){
   $("#modalFiltroTrabajadorCovid").modal("show");
}

function crearFiltroTrabajadorCovid(){
      
   var dataParam={
	   empresaId:getSession("gestopcompanyid"),
	   idCompany:getSession("gestopcompanyid"),
	   valFiltroTipoCon:1
		 }; 
		
   callAjaxPost(URL + '/covid/trabajadores/filtro',dataParam,function(data){
      //listNombreProductos= data.listNombreProductos;
       
      var listUnidades= data.listUnidades;
      var listDivisiones= data.listDivisiones;
      var listAreas= data.listAreas;
      var listPuestos= data.listPuestos;
      var listModalidades= data.listModalidades;
      var listTiposConfirmacionCovid= data.listTiposConfirmacionCovid;
      
      var contenido = "";
				
      var listContenido=[
	      {sugerencia:"",label:"Unidad",inputForm:"",divContainer: "divFiltroUnidadesTrabajadorCovid"},
	      {sugerencia:"",label:"División",inputForm:"",divContainer: "divFiltroDivisionesTrabajadorCovid"},
	      {sugerencia:"",label:"Área",inputForm:"",divContainer: "divFiltroAreasTrabajadorCovid"},
	      {sugerencia:"",label:"Puesto de trabajo",inputForm:"",divContainer: "divFiltroPuestosTrabajadorCovid"},
	      {sugerencia:"",label:"Modalidad de trabajo",inputForm:"",divContainer: "divFiltroModalidadesTrabajadorCovid"},
	      {sugerencia:"",label:"Resultado de la última observación médica",inputForm:"",divContainer: "divFiltroResultadosTrabajadorCovid"},
	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroTrabajadorCovid()'><i class='fa fa-times'></i>Cancelar</button>",
	            	 inputForm:"<button id='btnAplicarFiltroTrabajadorCovid'class='btn btn-success' type='submit' onclick='cargarConsolidadoTrabajadorCovid()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
	                ];
				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
				
      var modalOptionsCov={id:"modalFiltroTrabajadorCovid",nombre:"<i class='fa fa-filter'></i>Filtros",
		           contenido: contenido};
				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroUnidadesTrabajadorCovid").length > 0){
	 return;
         }
         
         crearSelectOneMenuObligMultipleCompleto("filtroUnidadesTrabajadorCovid","",listUnidades,"matrixId",
        	    "matrixName","#divFiltroUnidadesTrabajadorCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroDivisionesTrabajadorCovid","",listDivisiones,"divisionId",
        	    "divisionName","#divFiltroDivisionesTrabajadorCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroAreasTrabajadorCovid","",listAreas,"areaId",
        	    "areaName","#divFiltroAreasTrabajadorCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroPuestosTrabajadorCovid","",listPuestos,"puestoId",
        	    "puestoNombre","#divFiltroPuestosTrabajadorCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroModalidadesTrabajadorCovid","",listModalidades,"id",
     	            "nombre","#divFiltroModalidadesTrabajadorCovid","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroResultadosTrabajadorCovid","",listTiposConfirmacionCovid,"id",
     	    	    "nombre","#divFiltroResultadosTrabajadorCovid","Todos");
      },false);
				
      $("#btnAplicarFiltroTrabajadorCovid").on("click",function(){
	 ocultarFiltroTrabajadorCovid() 
      });
				
      $("#modalFiltroTrabajadorCovid").modal("hide");
   });
}

function valoresFiltroTrabajadorCovid(){
    
   listUnidadesId = [];
   var unidadId = $("#filtroUnidadesTrabajadorCovid").val();
   if(unidadId != null){
      unidadId.forEach(function(val){
         listUnidadesId.push(parseInt(val));
      });
   }
    
   listDivisionesId = [];
   var divisionId = $("#filtroDivisionesTrabajadorCovid").val();
   if(divisionId != null){
      divisionId.forEach(function(val){
         listDivisionesId.push(parseInt(val));
      });
   }
    
   listAreasId = [];
   var areaId = $("#filtroAreasTrabajadorCovid").val();
   if(areaId != null){
      areaId.forEach(function(val){
	 listAreasId.push(parseInt(val));
      });
   }
    
   listPuestosId = [];
   var puestoId = $("#filtroPuestosTrabajadorCovid").val();
   if(puestoId != null){
      puestoId.forEach(function(val){
         listPuestosId.push(parseInt(val));
      });
   }
    
   listModalidadesId = [];
   var modalidadId = $("#filtroModalidadesTrabajadorCovid").val();
   if(modalidadId != null){
      modalidadId.forEach(function(val){
	 listModalidadesId.push(parseInt(val));
      });
    }
    
   listResultadosId = [];
   var resultadoId = $("#filtroResultadosTrabajadorCovid").val();
   if(resultadoId != null){
      resultadoId.forEach(function(val){
	 listResultadosId.push(parseInt(val));
      });
   }
}

function verTablaConsolidadoTrabajadoresCovid(){
    
   crearFiltroTrabajadorCovid();
    
   $("#wrapperConsolidadoTrabajadoresCovid").remove();
   $(".divContainerGeneral").hide();  
   
   var buttonVolver="<button type='button' id='btnVolverVistaMedicoCovid' class='btn btn-success ' style='margin-right:10px'" +
                           " onclick='volverVistaMedicoCovid()' title='Regresar a la vista anterior'>" +
                       "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
                    "</button>";
   
   var buttonFiltro = "<button id='btnActivarFiltroTrabajadorCovid' type='button' onclick='verFiltroTrabajadorCovid()' style='margin-right:10px'"+
			      "title='Filtro' class='btn btn-success'>"+
		         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
		      "</button>";
   
   var buttonClip = "<button id='btnClipConsolidadoTrabajadorCovid' type='button' onclick='copiarConsolidadoTrabajadorCovid()'"+
   			    "title='Copiar la información de la tabla actual' class='btn btn-success'>"+
   	               "<i class='fa fa-2x fa-clipboard' aria-hidden='true'></i>"+
   	            "</button>";
   
   $("body")
   .append("<div id='divTrabajadorCovidTabla' style='padding-left: 40px;'>" +
	         "<form class='form-inline' id='formBtnGeneral'>"+
		    buttonVolver+buttonFiltro+buttonClip+
		 "</form>"+
		 
		"<div class='wrapper' id='wrapperConsolidadoTrabajadorCovid'>" +
		   "<table style='min-width:100%' id='tblConsolidadoTrabajadorCovid' " +
		          "class='table table-striped table-bordered table-hover table-fixed'>" +
		      "<thead>" +
		         "<tr>" +
			    "<td class='tb-acc' style='width:250px'>Nombre del trabajador</td>" +
			    "<td class='tb-acc' style='width:150px'>DNI</td>" +
			    "<td class='tb-acc' style='width:150px'>Edad</td>" +
			    "<td class='tb-acc' style='width:250px'>Dirección</td>" +
			    "<td class='tb-acc' style='width:250px'>Correo</td>" +
			    "<td class='tb-acc' style='width:180px'>Telefono de contacto personal</td>" +
			    "<td class='tb-acc' style='width:250px'>Persona de contacto</td>" +
			    "<td class='tb-acc' style='width:180px'>Telefono de la persona de contacto</td>" +
			    "<td class='tb-acc' style='width:200px'>Unidad</td>" +
			    "<td class='tb-acc' style='width:200px'>División</td>" +
			    "<td class='tb-acc' style='width:200px'>Área</td>" +
			    "<td class='tb-acc' style='width:220px'>Puesto de trabajo</td>" +
			    "<td class='tb-acc' style='width:150px'>Trabajador en grupo de riesgo</td>" +
			    "<td class='tb-acc' style='width:150px'>Entorno en grupo de riesgo</td>" +
			    "<td class='tb-acc' style='width:150px'>Sospecha de COVID-19</td>" +
			    "<td class='tb-acc' style='width:180px'>Modalidad de trabajo</td>" +
			    "<td class='tb-acc' style='width:200px'>Fecha del último llenado del formulario</td>" +
			    "<td class='tb-acc' style='width:180px'>Resultado de la última observación médica</td>" +
			    "<td class='tb-acc' style='width:200px'>Fecha de la última observación médica</td>" +
			    "<td class='tb-acc' style='width:180px'>Estado actual del trabajador</td>" +
		         "</tr>"+
		      "</thead>" +
		      "<tbody></tbody>" +
		   "</table>" +
	        "</div>" +
	     "</div>");
   
   cargarConsolidadoTrabajadorCovid();
   
   tituloAnteriorColaborador=$(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Consolidado Trabajadores - COVID-19");
   resizeDivWrapper("wrapperConsolidadoTrabajadorCovid",190);	
}

function cargarConsolidadoTrabajadorCovid(){
     
    valoresFiltroTrabajadorCovid();
    
   var dataParam2={
	   empresaId:getSession("gestopcompanyid"),
	   trabajadorConRiesgo:2, //TODOS LOS TRABAJADORES
	   listUnidadesIdFiltro : (listUnidadesId.length==0?null:listUnidadesId),
	   listDivisionesIdFiltro : (listDivisionesId.length==0?null:listDivisionesId),
	   listAreasIdFiltro : (listAreasId.length==0?null:listAreasId),
	   listPuestosIdFiltro : (listPuestosId.length==0?null:listPuestosId),
	   listModalidadesIdFiltro : (listModalidadesId.length==0?null:listModalidadesId),
	   listResultadosIdFiltro : (listResultadosId.length==0?null:listResultadosId)
   	    	  }
 
   callAjaxPost(URL+'/covid/trabajadores/revisar',dataParam2,function(data){
      
      $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
       
      listFullConsolidadoTrabajador = data.trabajadores;
      $("#tblConsolidadoTrabajadorCovid tbody tr").remove();
	
      listFullConsolidadoTrabajador.forEach(function(val){
         $("#tblConsolidadoTrabajadorCovid tbody")
	 .append("<tr>" +
		    "<td>"+val.nombre+"</td>" +
		    "<td>"+val.dni+"</td>" +
		    "<td>"+val.edad+"</td>" +
		    "<td>"+val.ultimoAntecedente.direccion+"</td>" +
		    "<td>"+val.correo+"</td>" +
		    "<td>"+val.ultimoAntecedente.telefonoContacto+"</td>" +
		    "<td>"+val.ultimoAntecedente.personaContacto+"</td>" +
		    "<td>"+val.ultimoAntecedente.telefonoPersonaContacto+"</td>" +
		    "<td>"+val.area.matrixName+"</td>" +
		    "<td>"+val.area.divisionName+"</td>" +
		    "<td>"+val.area.areaName+"</td>" +
		    "<td>"+val.puesto.positionName+"</td>" +
		    "<td>"+val.condicionAntecedentePersonal+"</td>" +
		    "<td>"+val.condicionAntecedenteEntorno+"</td>" +
		    "<td>"+val.sospechaCovid19+"</td>" +
		    "<td>"+val.modTrabajo.nombre+"</td>" +
		    "<td>"+val.ultimoFormulario.fechaActualizacionTexto+"</td>" +
		    "<td>"+val.ultimaObservacionMedica.tipoConfirmacionCovid.nombre+"</td>" +
		    "<td>"+val.ultimaObservacionMedica.fechaTexto+"</td>" +
		    "<td>"+val.estadoEspecificoCovid.nombre+"</td>" +
	         "</tr>")
      });
	
      goheadfixedY("#tblConsolidadoTrabajadorCovid","#wrapperConsolidadoTrabajadorCovid");
   });
}

function copiarConsolidadoTrabajadorCovid(){
   var list=obtenerDatosBodyTablaEstandar("tblConsolidadoTrabajadorCovid");
   copiarAlPortapapeles(list,"btnClipConsolidadoTrabajadorCovid");
   mensajeUx="Se han copiado todas las filas del Consolidado Trabajadores - COVID-19.";
   mensajesUx(mensajeUx,1,"");
}


function volverVistaMedicoCovid(){
   $("#divTrabajadorCovidTabla").remove();
   $("#modalFiltroTrabajadorCovid").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   //$("#subConsolidado").hide();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
 }
