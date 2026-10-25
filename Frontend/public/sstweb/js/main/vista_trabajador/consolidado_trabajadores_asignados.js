
var listFullConsolidadoTrabajadoresAsignadosCO=[];
var listAreasId = [];
var listEstadosCapacitacionOnlineId = [];
var mensajeUx;

function ocultarFiltroConsolidadoTrabajadoresAsignadosCO(){
   $("#modalFiltroConsolidadoTrabajadoresAsignadosCO").modal("hide");
}

function verFiltroConsolidadoTrabajadoresAsignadosCO(){
   $("#modalFiltroConsolidadoTrabajadoresAsignadosCO").modal("show");
}

function crearFiltroConsolidadoTrabajadoresAsignadosCO(functionCallBack){
   var dataParam={
          empresaId: getSession("gestopcompanyid"),
          idCompany: getSession("gestopcompanyid")
                 }; 
 		
   callAjaxPost(URL+'/capacitacion/trabajadores/filtro',dataParam,function(data){
        
      var listCapacitaciones= data.listCaps;
      var listAreas= data.listAreas;
      
      var listEstadosCapacitacionOnline=[
             {id:1,nombre:"Aprobado"},
             {id:2,nombre:"Desaprobado"},
             {id:3,nombre:"Pendiente"},
             {id:4,nombre:"Sin vigencia"}
                                        ];
      
      var selCapacitacionConsolidado = crearSelectOneMenuOblig("selCapacitacionConsolidado","",listCapacitaciones,
             "0","capacitacionId","capacitacionNombre");
       
      var contenido = "";
 				
      var listContenido=[
             {sugerencia:"",label:"Capacitación online",inputForm:selCapacitacionConsolidado},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",label:"Área(s)",inputForm:"",divContainer:"divFiltroAreasTrabajadorAsignadoCO"},
             {sugerencia:"",label:"Estado(s)",inputForm:"",divContainer:"divFiltroEstadosCapacitacionOnlineTrabAsigCO"},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
 	     {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroConsolidadoTrabajadoresAsignadosCO()'>" +
 	      		             "<i class='fa fa-times'></i>Cancelar" +
 	      		          "</button>",
 	      inputForm:"<button id='btnAplicarFiltroConsolidadoTrabajadoresAsignadosCO' class='btn btn-success' type='submit' " +
 	       		        "onclick='cargarConsolidadoTrabajadoresAsignadosCO()' style='float:right;'>" +
 	       		   "<i class='fa fa-filter'></i>Aplicar filtro" +
 	       		"</button>"},
 	                ];
 				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
 				
      var modalOptionsCov={id:"modalFiltroConsolidadoTrabajadoresAsignadosCO",
	                   nombre:"<i class='fa fa-filter'></i>Filtros",
 		           contenido: "<div class='eventoGeneral'>"+contenido+"</div>"};
 				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroAreasConsolidadoTrabajadoresAsignadosCO").length > 0){
 	    return;
         }
          
         crearSelectOneMenuObligMultipleCompleto("filtroAreasConsolidadoTrabajadoresAsignadosCO","",listAreas,"areaId",
       	    "areaName","#divFiltroAreasTrabajadorAsignadoCO","Todos");
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosCapacitacionOnlineTrabAsigCO","",listEstadosCapacitacionOnline,
            "id","nombre","#divFiltroEstadosCapacitacionOnlineTrabAsigCO","Todos");
      },false);
       		
      $("#btnAplicarFiltroConsolidadoTrabajadoresAsignadosCO").on("click",function(){
         ocultarFiltroConsolidadoTrabajadoresAsignadosCO(); 
      });
 				
      $("#modalFiltroConsolidadoTrabajadoresAsignadosCO").modal("hide");
      functionCallBack();
   });
}

function valoresFiltroConsolidadoTrabajadoresAsignadosCO(){

   listAreasId = [];
   var areaId = $("#filtroAreasConsolidadoTrabajadoresAsignadosCO").val();
   if(areaId != null){
      areaId.forEach(function(val){
         listAreasId.push(parseInt(val));
      });
   }
   
   listEstadosCapacitacionOnlineId = [];
   var estadosCapacitacionOnlineId = $("#filtroEstadosCapacitacionOnlineTrabAsigCO").val();
   if(estadosCapacitacionOnlineId != null){
      estadosCapacitacionOnlineId.forEach(function(val){
	 listEstadosCapacitacionOnlineId.push(parseInt(val));
      });
   }
}

function verTablaConsolidadoTrabajadoresAsignadosCO(){
     
   $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
   $("#wrapperConsolidadoTrabajadoresAsignadosCO").remove();$("#divQuickSightCapOnline").remove();
   $(".divContainerGeneral").hide();  
    
   var buttonVolver= "<button type='button' id='btnVolverVistaTraConTraAsig' class='btn btn-success ' style='margin-right:10px'" +
                            " onclick='volverVistaTraConTraAsig()' title='Regresar a la vista anterior'>" +
                        "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
                     "</button>";
    
   var buttonFiltro = "<button id='btnActivarFiltroConsolidadoTrabajadoresAsignadosCO' type='button' style='margin-right:10px'" +
    		              "onclick='verFiltroConsolidadoTrabajadoresAsignadosCO()' title='Filtro' class='btn btn-success'>"+
 		         "<i class='fa fa-2x fa-filter' aria-hidden='true'></i>"+
 		      "</button>";
    
   var buttonClip = "<button id='btnClipConsolidadoTrabajadoresAsignadosCO' type='button' " +
   		            "onclick='copiarConsolidadoTrabajadoresAsignadosCO()'"+
                            "title='Copiar la información de la tabla actual' class='btn btn-success'>"+
                       "<i class='fa fa-2x fa-clipboard' aria-hidden='true'></i>"+
                    "</button>";
    
   $("body")
   .append("<div id='divConsolidadoTrabajadoresAsignadosCOTabla' style='padding-left: 40px;'>" +
 	      "<form class='form-inline' id='formBtnGeneral'>"+
 	          buttonVolver+buttonFiltro+buttonClip+
 	      "</form>"+
 	      "<div class='wrapper' id='wrapperConsolidadoTrabajadoresAsignadosCO'>" +
 	         "<table style='min-width:100%' id='tblConsolidadoTrabajadoresAsignadosCO' " +
 		        "class='table table-striped table-bordered table-hover table-fixed'>" +
 		    "<thead>" +
 		       "<tr>" +
 		          "<th class='tb-acc' style='width:250px'>Área</th>" +
 			  "<th class='tb-acc' style='width:250px'>Puesto de trabajo</th>" +
 			  "<th class='tb-acc' style='width:350px'>Nombre del trabajador</th>" +
 			  "<th class='tb-acc' style='width:250px'>Fecha de evaluación realizada</th>" +
 			  "<th class='tb-acc' style='width:200px'>Estado</th>" +
 		       "</tr>"+
 		    "</thead>" +
 		    "<tbody></tbody>" +
 		 "</table>" +
 	      "</div>" +
 	   "</div>");
    
   crearFiltroConsolidadoTrabajadoresAsignadosCO(cargarConsolidadoTrabajadoresAsignadosCO);
    
   tituloAnteriorColaborador=$(".divTituloGeneral h4").text();
   $(".divTituloGeneral h4").html("Consolidado Trabajadores Asignados - Capacitación Online");
   resizeDivWrapper("wrapperConsolidadoTrabajadoresAsignadosCO",190);	
}

function cargarConsolidadoTrabajadoresAsignadosCO(){
      
   valoresFiltroConsolidadoTrabajadoresAsignadosCO();
    
   var dataParam2={
 	  capacitacionId: parseInt($("#selCapacitacionConsolidado").val()),
  	  listAreasIdFiltro: (listAreasId.length==0?null:listAreasId),
  	  listEstadosCapacitacionOnlineFiltro: (listEstadosCapacitacionOnlineId.length==0?
  		                                null:listEstadosCapacitacionOnlineId)
    	    	  }

   callAjaxPost(URL+'/capacitacion/trabajadores/asignados',dataParam2,function(data){
      listFullConsolidadoTrabajadoresAsignadosCO = data.listTrabajadores;
      $("#tblConsolidadoTrabajadoresAsignadosCO tbody tr").remove();
 	
      listFullConsolidadoTrabajadoresAsignadosCO.forEach(function(val){
         $("#tblConsolidadoTrabajadoresAsignadosCO tbody")
 	 .append("<tr>" +
 		    "<td>"+val.areaNombre+"</td>" +
 		    "<td>"+val.puesto.nombre+"</td>" +
 		    "<td>"+val.nombre+"</td>" +
 		    "<td>"+val.fechaRealizadaCO+"</td>" +
 		    "<td>"+
 		       "<span style='"+val.colorEstadoCapacitacionOnline+"font-weight:bold;'>"+
 		           val.estadoCapacitacionOnline+
 		       "</span>"+
 		    "</td>" +
 	         "</tr>");
      });
 	
      goheadfixedY("#tblConsolidadoTrabajadoresAsignadosCO","#wrapperConsolidadoTrabajadoresAsignadosCO");
   });
}

function copiarConsolidadoTrabajadoresAsignadosCO(){
   var list = obtenerDatosBodyTablaEstandar("tblConsolidadoTrabajadoresAsignadosCO");
   copiarAlPortapapeles(list,"btnClipConsolidadoTrabajadoresAsignadosCO");
   
   mensajeUx="Se han copiado todas las filas del Consolidado Trabajadores Asignados - Capacitación Online.";
   mensajesUx(mensajeUx,1,"");
}

function volverVistaTraConTraAsig(){
   $("#divConsolidadoTrabajadoresAsignadosCOTabla").remove();
   $("#modalFiltroConsolidadoTrabajadoresAsignadosCO").remove();
   $("#divQuickSightCapOnline").remove();
   $(".divContainerGeneral").show(); 
   $(".divListPrincipal > div").show();
   $(".divTituloGeneral h4").html(tituloAnteriorColaborador);
   $(".divListPrincipal").find("#cursoExamenMovil .tituloSubList").hide(); 
   $(".divListPrincipal").find("#cursoEncuestaExamenMovil .tituloSubList").hide(); 
   $(".divListPrincipal").find("#cursoPreguntasExamenMovil .tituloSubList").hide();
   $(".divListPrincipal").find("#cursoResultadoExamenMovil .tituloSubList").hide(); 
}
