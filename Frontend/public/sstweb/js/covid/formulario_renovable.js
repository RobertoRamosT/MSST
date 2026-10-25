var listFullEstadoFormularioRenovable=[];
var listUnidadesId = [];
var listDivisionesId = [];
var listAreasId = [];
var listEstadosFormularioCovidId = [];
var mensajeUx;
var fechaHoyTextoVal;

function ocultarFiltroFormularioRenovable(){
    $("#modalFiltroForRen").modal("hide");
 }

 function verFiltroFormularioRenovable(){
    $("#modalFiltroForRen").modal("show");
 }

function crearFiltroFormularioRenovable(functionCallBack){
    
    var dataParam={
 	   empresaId:getSession("gestopcompanyid"),
 	   idCompany:getSession("gestopcompanyid")
 		 }; 
 		
    callAjaxPost(URL + '/covid/trabajadores/filtro',dataParam,function(data){
       //listNombreProductos= data.listNombreProductos;
        
       var listUnidades= data.listUnidades;
       var listDivisiones= data.listDivisiones;
       var listAreas= data.listAreas;
       var listEstadosFormularioCovid= data.listEstadosFormularioCovid;
       //var listEstadosEspecificosCovid= data.listEstadosEspecificosCovid;
       fechaHoyTextoVal = data.fechaHoyTextoVal;
       var hoy=fechaHoyTextoVal;
       
       var contenido = "";
 				
       var listContenido=[
              {sugerencia:"",label:"Fecha",inputForm:"<input type='date' id='fechaForRen' class='form-control'>"},
 	      {sugerencia:"",label:"Unidad",inputForm:"",divContainer: "divFiltroUnidadesForRen"},
 	      {sugerencia:"",label:"División",inputForm:"",divContainer: "divFiltroDivisionesForRen"},
 	      {sugerencia:"",label:"Área",inputForm:"",divContainer: "divFiltroAreasForRen"},
 	      {sugerencia:"",label:"Estado del formulario renovable",inputForm:"",divContainer: "divFiltroEstadosFormularioForRen"},
 	      //{sugerencia:"",label:"Estado actual del trabajador",inputForm:"",divContainer:"divFiltroEstadosEspecificosForRen"},
 	      {sugerencia:"",label:"<button class='btn btn-danger' type='button' " +
 	      		                   "onclick='ocultarFiltroFormularioRenovable()'><i class='fa fa-times'></i>Cancelar</button>",
 	       inputForm:"<button id='btnAplicarFiltroForRen'class='btn btn-success' " +
 	       		         "type='submit' onclick='cargarEstadoFormularioRenovable()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
 	                ];
 				
       listContenido.forEach(function(val){
          contenido +=obtenerSubPanelModuloGeneral(val);
       });
 				
       var modalOptionsCov={id:"modalFiltroForRen",nombre:"<i class='fa fa-filter'></i>Filtros",
 		           contenido: contenido};
 				
       crearModalPrincipalUsuario(modalOptionsCov,function(){
          if($("#filtroUnidadesForRen").length > 0){
 	     return;
          }
          
          crearSelectOneMenuObligMultipleCompleto("filtroUnidadesForRen","",listUnidades,"matrixId",
         	    "matrixName","#divFiltroUnidadesForRen","Todos");
          crearSelectOneMenuObligMultipleCompleto("filtroDivisionesForRen","",listDivisiones,"divisionId",
         	    "divisionName","#divFiltroDivisionesForRen","Todos");
          crearSelectOneMenuObligMultipleCompleto("filtroAreasForRen","",listAreas,"areaId",
         	    "areaName","#divFiltroAreasForRen","Todos");
          crearSelectOneMenuObligMultipleCompleto("filtroEstadosFormularioForRen","",listEstadosFormularioCovid,"id",
             	    "nombre","#divFiltroEstadosFormularioForRen","Todos");
         // crearSelectOneMenuObligMultipleCompleto("filtroEstadosEspecificosForRen","",listEstadosEspecificosCovid,"id",
 	   // 	    "nombre","#divFiltroEstadosEspecificosForRen","Todos");
       },false);
       
       $("#fechaForRen").val(hoy);
 				
       $("#btnAplicarFiltroForRen").on("click",function(){
          ocultarFiltroFormularioRenovable();
       });
 				
       $("#modalFiltroForRen").modal("hide");
       functionCallBack();
       completarBarraCarga();
    });
 }

 function valoresFiltroFormularioRenovable(){
     
    listUnidadesId = [];
    var unidadId = $("#filtroUnidadesForRen").val();
    if(unidadId != null){
       unidadId.forEach(function(val){
          listUnidadesId.push(parseInt(val));
       });
    }
     
    listDivisionesId = [];
    var divisionId = $("#filtroDivisionesForRen").val();
    if(divisionId != null){
       divisionId.forEach(function(val){
          listDivisionesId.push(parseInt(val));
       });
    }
     
    listAreasId = [];
    var areaId = $("#filtroAreasForRen").val();
    if(areaId != null){
       areaId.forEach(function(val){
 	 listAreasId.push(parseInt(val));
       });
    }
    
    listEstadosFormularioCovidId = [];
    var estadosFormularioId = $("#filtroEstadosFormularioForRen").val();
    if(estadosFormularioId != null){
       estadosFormularioId.forEach(function(val){
	  listEstadosFormularioCovidId.push(parseInt(val));
       });
   }
     
   /* listEstadosEspecificosId = [];
    var estadoEspecificoId = $("#filtroEstadosEspecificosCovid").val();
    if(estadoEspecificoId != null){
       estadoEspecificoId.forEach(function(val){
 	 listEstadosEspecificosId.push(parseInt(val));
       });
    }*/
    
 }

 function cargarEstadoFormularioRenovable(data){
     
    var valorResize= 180;
    resizeDivWrapper("wrapperEstadoFormularioRenovable",valorResize);
      
    valoresFiltroFormularioRenovable();
   
    if($("#fechaForRen").val() == undefined){
       $("#fechaForRen").val(hoy);
    }else{
	
    }
    
    var hoy = fechaHoyTextoVal;
    
    var dataParam2={
 	   empresaId:getSession("gestopcompanyid"),
 	   fechaFormularioRenovable:($("#fechaForRen").val() == undefined ?hoy:$("#fechaForRen").val()),
 	   listUnidadesIdFiltro : (listUnidadesId.length==0?null:listUnidadesId),
 	   listDivisionesIdFiltro : (listDivisionesId.length==0?null:listDivisionesId),
 	   listAreasIdFiltro : (listAreasId.length==0?null:listAreasId),
 	   listEstadosFormularioIdFiltro : (listEstadosFormularioCovidId.length==0?null:listEstadosFormularioCovidId),
 	   //listEstadosEspecificosIdFiltro : (listEstadosEspecificosId.length==0?null:listEstadosEspecificosId)
    	    	   }

    callAjaxPost(URL+'/covid/trabajadores/revisar/vista_admin',dataParam2,function(data){
       listFullEstadoFormularioRenovable = data.trabajadores;
       $("#tblEstadoForRen tbody tr").remove();
 	
       listFullEstadoFormularioRenovable.forEach(function(val){
          $("#tblEstadoForRen tbody")
 	 .append("<tr id='trCovid"+val.id+"'>" +
 	 	    "<td id='tdtiempohoraforren"+val.id+"'>"+val.fechaFormularioRenovableTexto+"</td>" +
 		    "<td id='tdunidadforren"+val.id+"'>"+val.area.matrixName+"</td>" +
 		    "<td id='tddivisionforren"+val.id+"'>"+val.area.divisionName+"</td>" +
 		    "<td id='tdareaforren"+val.id+"'>"+val.area.areaName+"</td>" +
 		    "<td id='tdnombreforren"+val.id+"'>"+val.nombre+"</td>" +
 		    "<td id='tdestadoforren"+val.id+"'>" +
 		       "<span style='color:"+(val.estadoFormularioFecha == 'Completado'?"blue"
 			                    :(val.estadoFormularioFecha == 'Sin Completar'?"red":"green"))+";font-weight:bold;'>"+
 		          val.estadoFormularioFecha+"</span></td>" +
 	         "</tr>")
       });
 	
       goheadfixedY("#tblEstadoForRen","#wrapperEstadoFormularioRenovable");
    });
 }

 function copiarEstadoFormularioRenovable(){
     var list=obtenerDatosBodyTablaEstandar("tblEstadoForRen");
     copiarAlPortapapeles(list,"btnClipTablaEstadoForRen");
     mensajeUx="Se han copiado todas las filas de la tabla Trabajadores - Estado Formulario renovable.";
     mensajesUx(mensajeUx,1,"");
 }