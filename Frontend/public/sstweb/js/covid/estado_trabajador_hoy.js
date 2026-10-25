var listFullEstadoTrabHoyCovid=[];
//var listUnidadesId = [];
var mensajeUx;

function ocultarFiltroEstadoTrabHoyCov(){
   $("#modalFiltroEstTrabHoyCov").modal("hide");
}

function verFiltroEstadoTrabHoyCov(){
   $("#modalFiltroEstTrabHoyCov").modal("show");
}

function crearFiltroEstadoTrabHoyCov(){
    
//   var dataParam={
// 	  empresaId:getSession("gestopcompanyid"),
// 	  idCompany:getSession("gestopcompanyid")
// 		 }; 
 		
//   callAjaxPost(URL+'/covid/trabajadores/filtro',dataParam,function(data){
        
//       var listUnidades= data.listUnidades;
      var contenido = "";
 				
      var listContenido=[
             {sugerencia:"",label:"DNI o Nombre del trabajador",
              inputForm:"<input type='text' id='valorBuscarTrabCovHoy' class='form-control'>"},
             {sugerencia:"",label:"",inputForm:""},
 	     {sugerencia:"",
              label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroEstadoTrabHoyCov()'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                    "</button>",
 	      inputForm:"<button id='btnAplicarFiltroEstTrabHoyCov' class='btn btn-success' type='submit' " +
 	      		        "onclick='cargarEstadoTrabHoyCov()' style='float:right;'>" +
 	      		   "<i class='fa fa-search'></i> Buscar" +
 	      		"</button>"},
 	                ];
 				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
 				
      var modalOptionsCov={
	     id: "modalFiltroEstTrabHoyCov",
	     nombre: "<i class='fa fa-search'></i> Buscador",
	     contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
	                  };
 				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
//          if($("#filtroUnidadesForRen").length > 0){
// 	     return;
//          }
//          
//          crearSelectOneMenuObligMultipleCompleto("filtroUnidadesForRen","",listUnidades,"matrixId",
//         	    "matrixName","#divFiltroUnidadesForRen","Todos");
      },true,true);
       
      $("#btnAplicarFiltroEstTrabHoyCov").on("click",function(){
	  ocultarFiltroEstadoTrabHoyCov();
      });
 				
      completarBarraCarga();
//   });
}

// function valoresFiltroFormularioRenovable(){
//     
//    listUnidadesId = [];
//    var unidadId = $("#filtroUnidadesForRen").val();
//    if(unidadId != null){
//       unidadId.forEach(function(val){
//          listUnidadesId.push(parseInt(val));
//       });
//    }
//}

function cargarEstadoTrabHoyCov(){  
   var valorResize = 180;
   resizeDivWrapper("wrapperEstadoHoyTrabCov",valorResize);
      
//    valoresFiltroFormularioRenovable();
   var valBuscarAux = $("#valorBuscarTrabCovHoy").val();
   
   var dataParam2={
 	  empresaId: getSession("gestopcompanyid"),
 	  nombre: (valBuscarAux.length != 0?"%"+valBuscarAux+"%":"")
    	    	  }

   callAjaxPost(URL+'/covid/trabajador/estado_actual/buscar',dataParam2,function(data){
      listFullEstadoTrabHoyCovid = data.trabajadores;
      $("#tblEstadoTrabHoyCov tbody tr").remove();
 	
      listFullEstadoTrabHoyCovid.forEach(function(val){
         $("#tblEstadoTrabHoyCov tbody")
 	 .append("<tr id='trTrabHoyCov"+val.id+"'>" +
 	 	    "<td id='tdnombre"+val.id+"'>"+val.nombre+"</td>" +
 		    "<td id='tdestadohoy"+val.id+"'>"+val.estadoEspecificoCovid.nombre+"</td>" +
 		 "</tr>");
      });
 	
      goheadfixedY("#tblEstadoTrabHoyCov","#wrapperEstadoHoyTrabCov");
   });
}

function copiarEstadoHoyTrabajadorCov(){
   var list=obtenerDatosBodyTablaEstandar("tblEstadoTrabHoyCov");
     
   copiarAlPortapapeles(list,"btnClipTablaEstadoHoyTrab");
     
   mensajeUx="<label>Se han copiado todas las filas de la tabla " +
             "Trabajador(es) - Estado de hoy.</label>";
   mensajesUx(mensajeUx,1,"");
}