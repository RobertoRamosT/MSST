var reuVirCovId,reuVirCovObj;
var banderaEdicionReuVirCov = false;
var listFullReunionesVirtualCovid;
var mensajeUx;

$(document).ready(function(){
   var contenido ="";
   
   var listContenido=[
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Inicio - Fecha de la reunión",
   	   inputForm:"<input type='date' id='fechaInicioReuVirCov' class='form-control'>"},
   	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fin - Fecha de la reunión",
   	   inputForm:"<input type='date' id='fechaFinReuVirCov' class='form-control'>"},   
   	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
   	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
   	   label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
   	   		 "onclick='ocultarFiltroReunionVirtualCovid()'>" +
   	       	    "<i class='fa fa-times'></i> Cancelar" +
   	       	 "</button>",
   	   inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
   	   		     "onclick='ocultarFiltroReunionVirtualCovid();cargarReunionVirtualCovid();'>" +
   	                "<i class='fa fa-filter'></i> Filtrar" +
   	             "</button>"},
   	             ];
   	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   	
   var modalOptions={
   	  id: "modalFiltroReunionVirtualCovid",
   	  nombre: "<i class='fa fa-filter'></i> Filtro - Programación asistencia presencial",
   	  contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   	            };
   	
   crearModalPrincipalUsuario(modalOptions,function(){},false);
       
   $("#modalFiltroReunionVirtualCovid").modal("hide");
   
   var hoy = getSession("fechaHoyOrdenInversoTexto");
   $("#fechaInicioReuVirCov").val(hoy);
   $("#fechaFinReuVirCov").val(sumaFechaDias(30,hoy));
   console.log("CARGA INICIAL!!!!!!"); 
});

function ocultarFiltroReunionVirtualCovid(){
   $("#modalFiltroReunionVirtualCovid").modal("hide");
}

function verFiltroReunionVirtualCovid(){
   $("#modalFiltroReunionVirtualCovid").modal("show");
}

function cargarReunionVirtualCovid(){
   $("#btnCancelarReuVirCov").hide();
   $("#btnNuevoReuVirCov").show();
   $("#btnGuardarReuVirCov").hide();
   $("#btnEliminarReuVirCov").hide();
   $("#btnVerFiltroReuVirCov").show();
   $("#btnConsGeneralReuVirCov").show();
   
   resizeDivWrapper("wrapperReunionVirtualCovid",180);
   
   var dataParam={
	  empresaId: getSession("gestopcompanyid"),
	  fechaReunionInicioFiltro: $("#fechaInicioReuVirCov").val(),
	  fechaReunionFinFiltro: $("#fechaFinReuVirCov").val()
                 };
	
   callAjaxPost(URL+'/covid/reunion_virtual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         banderaEdicionReuVirCov = false;
         listFullReunionesVirtualCovid = data.listFullReunionesVirtualCovid;
					
         $("#tblReunionVirtualCovid tbody tr").remove();
         
         listFullReunionesVirtualCovid.forEach(function(val,index){ 
            var colorCuposDisponible = ((val.aforo - val.cuposOcupados) == 0?"red":"blue");
            var cuposDisponibles = "<label style='color:"+colorCuposDisponible+";'>"+
                                  (val.aforo - val.cuposOcupados)+"</label>";
             
	    $("#tblReunionVirtualCovid tbody").append(
	       "<tr id='trReuVirCovid"+val.id+"' onclick='editarReunionVirtualCovid("+index+")'>" +
	          "<td id='tdFechaReunion"+val.id+"'>"+val.fechaReunionTexto+"</td>" + 
	          "<td id='tdAforo"+val.id+"'>"+val.aforo+"</td>" + 
	          "<td id='tdCuposDisponibles"+val.id+"'>"+cuposDisponibles+"</td>" + 
	          "<td id='tdCuposCubiertos"+val.id+"'>"+val.cuposOcupados+"</td>" + 
	          "<td id='tdFechaRegistro"+val.id+"'>"+val.fechaRegistroTexto+"</td>" + 
	          "<td id='tdFechaModificacion"+val.id+"'>"+val.fechaModificacionTexto+"</td>" + 
	       "</tr>");
         });
					
         goheadfixedY("#tblReunionVirtualCovid","#wrapperReunionVirtualCovid");
         formatoCeldaSombreableTabla(true,"tblReunionVirtualCovid");
      }else{
         console.log("NOPNPO")
      }
   });	
}

function editarReunionVirtualCovid(pindex){
   if(!banderaEdicionReuVirCov){
      formatoCeldaSombreableTabla(false,"tblReunionVirtualCovid");
      reuVirCovId = listFullReunionesVirtualCovid[pindex].id;
      reuVirCovObj = listFullReunionesVirtualCovid[pindex];
		
      $("#trReuVirCovid"+reuVirCovId).addClass("fila-edicion");
      
      $("#tdFechaReunion"+reuVirCovId)
      .html("<input type='date' id='inputFechaReunionReuVirCov' class='form-control'>");
      $("#inputFechaReunionReuVirCov").val(convertirFechaInput(reuVirCovObj.fechaReunion));
      
      $("#tdAforo"+reuVirCovId)
      .html("<input type='number' id='inputAforoReuVirCov' class='form-control' min='0' " +
      		   "onchange='calcularCuposDisponiblesReuVirCov()' " +
      		   "onkeyup='calcularCuposDisponiblesReuVirCov()'>");
      $("#inputAforoReuVirCov").val(reuVirCovObj.aforo);
      
      $("#tdCuposDisponibles"+reuVirCovId)
      .html("<label id='labelCuposDisponibles"+reuVirCovId+"'></label>");
      
      $("#tdCuposCubiertos"+reuVirCovId)
      .html("<a class='efectoLink' onclick='verSolicitudCuposCubiertos()'>" +
            "<i class='fa fa-list-alt fa-2x'></i> "+reuVirCovObj.cuposOcupados+"</a>");
      
      calcularCuposDisponiblesReuVirCov();
		
      banderaEdicionReuVirCov = true;
      $("#btnCancelarReuVirCov").show();
      $("#btnNuevoReuVirCov").hide();
      $("#btnGuardarReuVirCov").show();
      $("#btnEliminarReuVirCov").show();
      $("#btnVerFiltroReuVirCov").hide();
      $("#btnConsGeneralReuVirCov").hide();
   }	
}

function nuevaReunionVirtualCovid(){
   if(!banderaEdicionReuVirCov){
      formatoCeldaSombreableTabla(false,"tblReunionVirtualCovid");	
      reuVirCovObj = {id: 0,cuposOcupados: 0,fechaReunionTexto: ""};
      reuVirCovId = 0; 
		
      $("#tblReunionVirtualCovid tbody").prepend(
         "<tr>" + 
	    "<td>"+"<input type='date' id='inputFechaReunionReuVirCov' class='form-control'>"+"</td>" +
	    "<td>"+"<input type='number' id='inputAforoReuVirCov' class='form-control' min='0'>"+"</td>" +
	    "<td><label>*Automático</label></td>" +
	    "<td><label>*Habilitado luego de guardar el nuevo registro.</label></td>" +
	    "<td><label>*Automático</label></td>" +
	    "<td><label>*Automático</label></td>" +
	 "</tr>");
      
      $("#btnCancelarReuVirCov").show();
      $("#btnNuevoReuVirCov").hide();
      $("#btnGuardarReuVirCov").show();
      $("#btnEliminarReuVirCov").hide();
      $("#btnVerFiltroReuVirCov").hide();
      $("#btnConsGeneralReuVirCov").hide();
      banderaEdicionReuVirCov = true;
   }else{
      alert("Guarde primero.");
   }
}

function calcularCuposDisponiblesReuVirCov(){
   var aforoAux = $("#inputAforoReuVirCov").val();
   var cuposOcupados = reuVirCovObj.cuposOcupados;
   var resultado = aforoAux - cuposOcupados;
   var colorResultado = (resultado > 0?"blue":"red");
   
   document.querySelector('#labelCuposDisponibles'+reuVirCovId)
   .innerText = resultado;
   
   document.getElementById('labelCuposDisponibles'+reuVirCovId)
   .style.color = colorResultado; 
}

function cancelarReunionVirtualCovid(){
   cargarReunionVirtualCovid();
}

function eliminarReunionVirtualCovid(){
   if(reuVirCovObj.cuposOcupados == 0){
      mensajeUx="<label>¿Está seguro de eliminar la programación asistencia " +
   	        "presencial seleccionada?</label>";
      mensajesUx(mensajeUx,3,"","ConfReuVirCov");

      $("#btnDevolverValorConfReuVirCov").on("click",function(){
         var dataParam={
	    id: reuVirCovId
		       };
	     
         callAjaxPost(URL+'/covid/reunion_virtual/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
	          mensajeUx="<label>La programación asistencia presencial seleccionada " +
	       		    "se ha eliminado correctamente.</label>";
	          mensajesUx(mensajeUx,1,"");
				
	          cargarReunionVirtualCovid();
	          break;
						
	       default:
	          alert("Ocurrió un error al eliminar la programación asistencia presencial!");
            }
         });
      });
   }else{
      mensajeUx="<label>No se puede eleminar la programación asistencia presencial seleccionada " +
      		"porque tiene "+reuVirCovObj.cuposOcupados+" cupos apartados.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

var existeFecReuVirCov;
var inputFechaReunion;

function validacionFechaReunionVirCov(){
   var fechaReunion = convertirFechaTexto($("#inputFechaReunionReuVirCov").val());
    
   if(!fechaReunion){  
      inputFechaReunion = null;
   }else{
      inputFechaReunion = fechaReunion;
   }
   
   if(inputFechaReunion != null){
      var mismaFecha = 0;
       
      if(reuVirCovObj.fechaReunionTexto == convertirFechaNormal($("#inputFechaReunionReuVirCov").val())){
         mismaFecha = 1;
      }
        
      if(reuVirCovId == 0 || (reuVirCovId > 0 && mismaFecha == 0)){
         var dataParam={
	        fechaReunionTexto: $("#inputFechaReunionReuVirCov").val(),
	        empresaId: parseInt(getSession("gestopcompanyid"))
     		       };
     
         callAjaxPost(URL+'/covid/reunion_virtual/validacion_campo',dataParam,function(data){
            switch(data.CODE_RESPONSE){
     	       case "05":		
     	          existeFecReuVirCov = data.existeFechaReunionRegistrada;
//     	          console.log(existeFecReuVirCov);
     	          if(existeFecReuVirCov == 0){
     	             guardarReunionVirtualCovid();
     	          }else{
     	             mensajeUx = "<label>Ya existe una programación asistencia presencial registrada con la fecha " +
     	             		 "ingresada ("+convertirFechaNormal($("#inputFechaReunionReuVirCov").val())+").</label>";
     	             mensajesUx(mensajeUx,2,""); 
     	          }
     	       
     	          break;
     			
     	       default:
     	          console.log("Error al comprobar si existe la fecha de reunión ingresada!");
            }
         });    
      }else{
	 guardarReunionVirtualCovid(); 
      }
   }else{
      mensajeUx = "<label>Debe ingresar el valor en Fecha de la reunión.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarReunionVirtualCovid(){
   var campoVacio = true;
   var aforo = $("#inputAforoReuVirCov").val();
   
   if(0 >= aforo){
      campoVacio = false;
      mensajeUx = "<label>El aforo no puede ser menor o igual a 0.</label>";
   }else{
      if(0 > aforo - reuVirCovObj.cuposOcupados){
         campoVacio = false;
         mensajeUx = "<label>Los cupos disponibles no pueden ser menor a 0.</label>"; 
      }
   }
   
   if(campoVacio){
      var dataParam={
    	     id: reuVirCovId,
    	     fechaReunion: inputFechaReunion,
    	     aforo: aforo,
    	     empresaId: getSession("gestopcompanyid")
    		    };
        
      callAjaxPost(URL+'/covid/reunion_virtual/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
    	    case "05":		
    	       mensajeUx="<label>La programación asistencia presencial fue registrada con éxito.</label>";
    	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmReuVirCov");
		    
    	       $("#modalMensajeUxActualizarVistaAdmReuVirCov").on("hidden.bs.modal",function(){
    		  cargarReunionVirtualCovid();
    	       });
    	       break;
    			
    	    default:
    	       console.log("Ocurrió un error al guardar la programación asistencia presencial!");
         }
      });	
   }else{
      mensajesUx(mensajeUx,2,""); 
   }	
}

function descargarConsolidadoGeneralReunionVirtualCovid(){
   var listaReuVirId = "";
  	
   listFullReunionesVirtualCovid.forEach(function(val){
      listaReuVirId = listaReuVirId+val.id+",";
   });
   
   window.open(URL+"/covid/reunion_virtual/excel?listReunionesVirId="+listaReuVirId);
}

var solCupCubId,solCupCubObj;
var banderaEdicionSolCupCub = false;
var listFullSolicitudesCuposCubiertos;
var listTrabajadoresActivos;
var cuposDisponiblesActual;
var actualizarReunionVirtualCovid;

function regresarReunionVirtualCovid(){
   $("#modalSolicitudCuposCubiertos").modal("hide"); 
}

function verSolicitudCuposCubiertos(){
   actualizarReunionVirtualCovid = 0;
    
   cuposDisponiblesActual = reuVirCovObj.aforo - reuVirCovObj.cuposOcupados;
   var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
    
   var listModal={
      id:"modalSolicitudCuposCubiertos",
      nombre:"<i class='fa fa-list-alt'></i> Lista de cupos cubiertos",
      contenido:
	 "<label style='font-size:18px;'>CUPOS DISPONIBLES DE LA REUNIÓN VIRTUAL: " +
	 "<label id='labelCuposDisponiblesActual"+reuVirCovId+"' style='color:"+colorCuposDisponiblesActual+";font-size:18px;'>"+
	     +cuposDisponiblesActual+"</label></label>" +
      	 "<br>" +
         "<button id='btnVolverPrincipalSolCupCub' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                 "onclick='regresarReunionVirtualCovid()'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
 	 "<button id='btnVolverSolCupCub' class='btn btn-success' style='margin-left:5px' " +
 	         "title='Deshacer las acciones hechas en el registro.' onclick='cancelarSolicitudCuposCubiertos()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
	 "<button id='btnNuevoSolCupCub' type='button' class='btn btn-success' style='margin-left:5px' " + 
	         "title='Registrar una nueva solicitud de cupos.' onclick='nuevoSolicitudCuposCubiertos()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
         "</button>" +
 	 "<button id='btnGuardarSolCupCub' class='btn btn-success' style='margin-left:5px' " +
 	         "title='Guardar la solicitud de cupos ingresada/modificada.' onclick='actualizarCuposDisponiblesActual(1)'>" +
 	    "<i class='fa fa-floppy-o fa-2x'></i>" +
 	 "</button>" +
 	 "<button id='btnEliminarSolCupCub' type='button' class='btn btn-danger' style='margin-left:5px' " +
 	         "title='Eliminar la solicitud de cupos seleccionado.' onclick='eliminarSolicitudCuposCubiertos()'>" +
 	    "<i class='fa fa-times fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapSolCuposCubiertos'>" +
 	    "<table id='tblSolCuposCubiertos' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 		     "<td class='tb-acc' style='width:100px'>Cupos Apartados</td>" +
 		     "<td class='tb-acc' style='width:100px'>Cupos Cubiertos</td>" +
 		     "<td class='tb-acc' style='width:400px'>Trabajadores</td>" +
 		     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
 		     "<td class='tb-acc' style='width:150px'>Modificado el</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 	
   agregarModalPrincipalUsuario(listModal);
//    resizeDivWrapper("wrapSolCuposCubiertos",200);
//    goheadfixedY("#tblSolCuposCubiertos","#wrapSolCuposCubiertos");
   cargarSolicitudCuposCubiertos();
	  
   $("#modalSolicitudCuposCubiertos").on("hidden.bs.modal",function(){
      if(actualizarReunionVirtualCovid == 0){
         cargarReunionVirtualCovid();
      }
   });
}

function cargarSolicitudCuposCubiertos(){
   actualizarReunionVirtualCovid = 0;
   $("#btnVolverPrincipalSolCupCub").show();
   $("#btnVolverSolCupCub").hide();
   $("#btnNuevoSolCupCub").show();
   $("#btnGuardarSolCupCub").hide();
   $("#btnEliminarSolCupCub").hide();
    
   resizeDivWrapper("wrapSolCuposCubiertos",210);
    
   var dataParam={
 	  reunionVirtualCovidId: reuVirCovId,
 	  empresaId: getSession("gestopcompanyid") 
 	         };
 	
   callAjaxPost(URL+'/covid/reunion_virtual/solicitud_cupo_cubierto',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         banderaEdicionSolCupCub = false;
         listFullSolicitudesCuposCubiertos = data.listFullSolicitudesCuposCubiertos;
         listTrabajadoresActivos = data.listTrabajadoresActivos;
         var habilitarNuevoReg = 1;
						
	 $("#tblSolCuposCubiertos tbody tr").remove();
	         
	 listFullSolicitudesCuposCubiertos.forEach(function(val,index){ 
	    var registradoPor = 
	       val.fechaRegistroTexto+" "+(val.registradoPor != ""?"<br>(Por "+val.registradoPor+")":"");
	    var modificadoPor = 
	       val.fechaModificacionTexto+" "+(val.modificadoPor != ""?"<br>(Por "+val.modificadoPor+")":"");
	    
	    if(val.hasRegAdmin == 1){
	       habilitarNuevoReg = 0;
	    }
	     
	    $("#tblSolCuposCubiertos tbody").append(
               "<tr id='trSolCupCub"+val.id+"' onclick='editarSolicitudCuposCubiertos("+index+")'>" +
	          "<td id='tdCuposAparatadosSolCupCub"+val.id+"'>"+val.cuposApartados+"</td>" + 
	          "<td id='tdCuposCubiertosSolCupCub"+val.id+"'>"+val.cuposCubiertos+"</td>" + 
		  "<td id='tdTrabajadoresAsignSolCupCub"+val.id+"'>"+val.listTrabajadoresNombre+"</td>" + 
		  "<td id='tdFechaRegistroSolCupCub"+val.id+"'>"+registradoPor+"</td>" + 
		  "<td id='tdFechaModificacionSolCupCub"+val.id+"'>"+modificadoPor+"</td>" + 
	       "</tr>");
	 });
	 
	 if(habilitarNuevoReg == 0 || cuposDisponiblesActual == 0){
	    $("#btnNuevoSolCupCub").hide();
	 }
						
	 goheadfixedY("#tblSolCuposCubiertos","#wrapSolCuposCubiertos");
	 formatoCeldaSombreableTabla(true,"tblSolCuposCubiertos");
      }else{
	 console.log("NOPNPO");
      }
   });	
}

var inicialEditarRegSolCupCub;

function editarSolicitudCuposCubiertos(pindex){
   if(!banderaEdicionSolCupCub){
      actualizarReunionVirtualCovid++;
      
      inicialEditarRegSolCupCub = 0;
      
      formatoCeldaSombreableTabla(false,"tblSolCuposCubiertos");
      solCupCubId = listFullSolicitudesCuposCubiertos[pindex].id;
      solCupCubObj = listFullSolicitudesCuposCubiertos[pindex];
 		
      $("#trSolCupCub"+solCupCubId).addClass("fila-edicion");
       
      var listTrabajadoresAd = solCupCubObj.listTrabajadoresId.split(",");   
      listTrabajadoresActivos.forEach(function(val){
 	 val.selected = 0;
 	 listTrabajadoresAd.forEach(function(val1){
            if(parseInt(val1) == val.trabajadorId){
 	       val.selected = 1;
            }	
 	 });
      });
 	
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadorSolCupCub","calcularCuposCubiertosSolCupCub()",
         listTrabajadoresActivos,"trabajadorId","nombre","#tdTrabajadoresAsignSolCupCub"+solCupCubId,"Sin asignar");

      $("#tdCuposCubiertosSolCupCub"+solCupCubId)
      .html("<label id='labelCuposCubiertosSolCupCub"+solCupCubId+"'></label>");
       
      calcularCuposCubiertosSolCupCub();
      
      if(cuposDisponiblesActual > 0){
	         $("#tdCuposAparatadosSolCupCub"+solCupCubId).html(
	            solCupCubObj.cuposApartados +"<br>"+
	            "<button class='btn btn-success' onclick='habilitarModCuposApartados()'>" +
	               "<i class='fa fa-pencil'></i> Editar" +
	            "</button>");
	      }	
 		
      banderaEdicionSolCupCub = true;
      $("#btnVolverPrincipalSolCupCub").hide();
      $("#btnVolverSolCupCub").show();
      $("#btnNuevoSolCupCub").hide();
      $("#btnGuardarSolCupCub").show();
      $("#btnEliminarSolCupCub").show();
   }	
}

function calcularCuposCubiertosSolCupCub(){
   var cuposApartadosAux = solCupCubObj.cuposApartados;
   var listTrabajadoresAux = $("#selMulTrabajadorSolCupCub").val();
   var resultado = listTrabajadoresAux.length;
   var colorResultado = (resultado > cuposApartadosAux?"red":"blue");
    
   document.querySelector('#labelCuposCubiertosSolCupCub'+solCupCubId)
   .innerText = resultado;
    
   document.getElementById('labelCuposCubiertosSolCupCub'+solCupCubId)
   .style.color = colorResultado; 
   
   inicialEditarRegSolCupCub++;
}

function habilitarModCuposApartados(){
    $("#tdCuposAparatadosSolCupCub"+solCupCubId)
    .html("<input type='number' id='inputModCuposApartadosSolCupCub' class='form-control' min='0'>" +
 	    "<button style='margin-right:10px;' class='btn btn-danger' " +
 	 	    "onclick='cargarSolicitudCuposCubiertos()'>" +
 	       "<i class='fa fa-arrow-left'></i>" +
 	    "</button>" +
 	    "<button class='btn btn-success' onclick='actualizarCuposDisponiblesActual(2)'>" +
 	       "<i class='fa fa-floppy-o'></i>" +
 	    "</button>");
    
    $("#tdCuposCubiertosSolCupCub"+solCupCubId).html(solCupCubObj.cuposCubiertos);
    
    $("#tdTrabajadoresAsignSolCupCub"+solCupCubId).html(solCupCubObj.listTrabajadoresNombre);
     
    $("#inputModCuposApartadosSolCupCub").val(solCupCubObj.cuposApartados).focus();
    
    inicialEditarRegSolCupCub = 0;
    
    $("#btnVolverPrincipalSolCupCub").hide();
    $("#btnVolverSolCupCub").hide();
    $("#btnNuevoSolCupCub").hide();
    $("#btnGuardarSolCupCub").hide();
    $("#btnEliminarSolCupCub").hide();
}

function nuevoSolicitudCuposCubiertos(){
   if(!banderaEdicionSolCupCub){
      actualizarReunionVirtualCovid++;
      inicialEditarRegSolCupCub = 0;
      formatoCeldaSombreableTabla(false,"tblSolCuposCubiertos");	
      solCupCubObj = {id: 0};
      solCupCubId = 0; 
 		
      $("#tblSolCuposCubiertos tbody").prepend(
         "<tr>" + 
 	    "<td>"+"<input type='number' id='inputCuposApartadosSolCupCub' class='form-control' min='0'>"+"</td>" +
 	    "<td>"+"*Automático"+"</td>" +
 	    "<td><label>*Debe apartar primero los cupos.</label></td>" +
 	    "<td><label>*Automático</label></td>" +
 	    "<td><label>*Automático</label></td>" +
 	 "</tr>");
       
      $("#btnVolverPrincipalSolCupCub").hide();
      $("#btnVolverSolCupCub").show();
      $("#btnNuevoSolCupCub").hide();
      $("#btnGuardarSolCupCub").show();
      $("#btnEliminarSolCupCub").hide();
      banderaEdicionSolCupCub = true;
   }else{
      alert("Guarde primero.");
   }
}

function actualizarCuposDisponiblesActual(accesoGuardar){
    var cuposDisponiblesAux;
     
    var dataParam={
     	  id: reuVirCovId
     		 };
     
    callAjaxPost(URL+'/covid/reunion_virtual/actualizar_cupo_disponible',dataParam,function(data){
       switch(data.CODE_RESPONSE){
     	 case "05":		
     	    cuposDisponiblesAux = data.cuposDisponibles;
     	 
     	    cuposDisponiblesActual = cuposDisponiblesAux;
     	    var colorCuposDisponiblesActual = (cuposDisponiblesAux > 0?"blue":"red");
     	
     	    document.querySelector('#labelCuposDisponiblesActual'+reuVirCovId)
     	    .innerText = cuposDisponiblesAux;
     	    
     	    document.getElementById('labelCuposDisponiblesActual'+reuVirCovId)
     	    .style.color = colorCuposDisponiblesActual; 
     	    
     	    if(cuposDisponiblesAux > 0 || inicialEditarRegSolCupCub > 0){
     	       if(accesoGuardar == 1){
     	          guardarSolicitudCuposCubiertos();
     	       }else{
     		  guardarModCuposApartados();
     	       }
     	    }else{
     	       $("#modalSolicitudCuposCubiertos").modal("hide"); 
     	       mensajeUx = "<label>No hay más cupos disponibles en la reunión virtual.</label>";
     	       mensajesUx(mensajeUx,2,"","AvisoVistaAdmSolCupCub"); 
     	      
     	       $("#modalMensajeUxAvisoVistaAdmSolCupCub").on("hidden.bs.modal",function(){
     	          $("#modalSolicitudCuposCubiertos").modal("show"); 
     	       }); 
     	    }
     	    
     	    break;
     			
     	 default:
     	    console.log("Error al actualizar el número de cupos actual!");
       }
    });  
 }

function guardarSolicitudCuposCubiertos(){
   var campoVacio = true;
   var cuposApartados;
   
   if(solCupCubId == 0){
       cuposApartados = $("#inputCuposApartadosSolCupCub").val();
       
       if(0 >= cuposApartados){
          campoVacio = false;
          mensajeUx = "<label>Los cupos apartados no pueden ser menor o igual a 0.</label>";
       }else if(cuposApartados > cuposDisponiblesActual){
	  campoVacio = false;
	  mensajeUx = "<label style='text-align: justify;'>No puede apartar una cantidad de " +
	  	      "cupos mayor a los disponibles* de la reunión virtual. " +
	  	      "<br><br> *Actualmente quedan "+cuposDisponiblesActual+" cupos.</label>";
       }	
   }else{
      var listTrabajadores = $("#selMulTrabajadorSolCupCub").val();
      var listTrabajadoresAd = [];
      if(listTrabajadores != null){
         listTrabajadores.forEach(function(val,index){
            listTrabajadoresAd.push(
	       {trabajadorId: parseInt(val)});
         });
      }

      if(listTrabajadores.length > solCupCubObj.cuposApartados){
        campoVacio = false;
        mensajeUx = "<label>Los cupos cubiertos no pueden ser mayor a los " +
        	    "cupos apartados.</label>"; 
      }
   }
    
   if(campoVacio){
      var dataParam={
     	     id: solCupCubId
     		    };
       
      if(solCupCubId == 0){
	 dataParam.cuposApartados = cuposApartados;
	 dataParam.reunionVirtualCovidId = reuVirCovId;
      }else{
	 dataParam.listTrabajadores = listTrabajadoresAd;
      }
       
      callAjaxPost(URL+'/covid/reunion_virtual/solicitud_cupo_cubierto/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
     	    case "05":		
     	       if(solCupCubId == 0){
     		  cuposDisponiblesActual = cuposDisponiblesActual - cuposApartados;
     		  var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
     		  console.log(cuposDisponiblesActual);
     		  document.querySelector("#labelCuposDisponiblesActual"+reuVirCovId).innerText = cuposDisponiblesActual;
         	      
     		  document.getElementById("labelCuposDisponiblesActual"+reuVirCovId)
         	  .style.color = colorCuposDisponiblesActual;
     	       }
     	       
     	       $("#modalSolicitudCuposCubiertos").modal("hide"); 
     		
     	       mensajeUx="<label>La solicitud de cupos fue registrada con éxito.</label>";
     	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmSolCupCub");
 		    
     	       $("#modalMensajeUxActualizarVistaAdmSolCupCub").on("hidden.bs.modal",function(){
     		  $("#modalSolicitudCuposCubiertos").modal("show"); 
     		  cargarSolicitudCuposCubiertos();
     	       });
     	       break;
     			
     	    default:
     	       console.log("Ocurrió un error al guardar la solicitud de cupos!");
         }
      });	
   }else{
      $("#modalSolicitudCuposCubiertos").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ValidacionVistaAdmSolCupCub"); 
      
      $("#modalMensajeUxValidacionVistaAdmSolCupCub").on("hidden.bs.modal",function(){
         $("#modalSolicitudCuposCubiertos").modal("show"); 
      });
   }
}

function guardarModCuposApartados(){
   var campoVacio = true;
   var cuposApartados;
     
   cuposApartados = $("#inputModCuposApartadosSolCupCub").val();
     
   if(0 >= cuposApartados){
      campoVacio = false;
      mensajeUx = "<label>Los cupos apartados no pueden ser menor o igual a 0.</label>";
   }else if(cuposApartados > cuposDisponiblesActual+solCupCubObj.cuposApartados){
      campoVacio = false;
      mensajeUx = "<label style='text-align: justify;'>No puede apartar una cantidad de " +
 	  	  "cupos mayor a los disponibles* de la reunión virtual. " +
 	  	  "<br><br> *Actualmente quedan "+cuposDisponiblesActual+" cupo(s) y usted " +
 	  	  "tiene "+solCupCubObj.cuposApartados+" cupo(s) apartado(s).</label>";
     
   }else{
      if(solCupCubObj.cuposCubiertos > cuposApartados){
         campoVacio = false;
         mensajeUx = "<label>Los cupos cubiertos no pueden ser mayor a los " +
 	       	     "cupos apartados.</label>"; 
      }
   }
     
   if(campoVacio){
      var dataParam={
 	     id: solCupCubId,
 	     cuposApartados: cuposApartados,
 	     reunionVirtualCovidId: reuVirCovId
 	     	    };
 	        
      callAjaxPost(URL+'/covid/reunion_virtual/solicitud_cupo_cubierto/actualizar_cupos_apartados',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":		
 	       cuposDisponiblesActual = data.cuposDisponibles;
 	       var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
 	      
 	       document.querySelector("#labelCuposDisponiblesActual"+reuVirCovId).innerText = cuposDisponiblesActual;
 	         	      
 	       document.getElementById("labelCuposDisponiblesActual"+reuVirCovId)
 	       .style.color = colorCuposDisponiblesActual;
 	     	       
 	       $("#modalSolicitudCuposCubiertos").modal("hide"); 
 	     		
 	       mensajeUx="<label>Los cupos apartados se modificaron correctamente.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmSolCupCub");
 	 		    
 	       $("#modalMensajeUxActualizarVistaAdmSolCupCub").on("hidden.bs.modal",function(){
 	          $("#modalSolicitudCuposCubiertos").modal("show"); 
 	          cargarSolicitudCuposCubiertos();
 	       });
 	       break;
 	     			
 	    default:
 	       console.log("Ocurrió un error al guardar la solicitud de cupos!");
         }
      });	
   }else{
      $("#modalSolicitudCuposCubiertos").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ValidacionVistaAdmSolCupCub"); 
 	      
      $("#modalMensajeUxValidacionVistaAdmSolCupCub").on("hidden.bs.modal",function(){
         $("#modalSolicitudCuposCubiertos").modal("show"); 
      });
   }
}

function eliminarSolicitudCuposCubiertos(){
   $("#modalSolicitudCuposCubiertos").modal("hide"); 
   mensajeUx="<label>¿Está seguro de eliminar la solicitud de cupos seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","ConfSolCupCub");

   $("#btnDevolverValorConfSolCupCub").on("click",function(){
      var dataParam={
 	     id: solCupCubId,
 	     reunionVirtualCovidId: reuVirCovId
 		    };
 	     
      callAjaxPost(URL+'/covid/reunion_virtual/solicitud_cupo_cubierto/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
 	    case "05":
 	       cuposDisponiblesActual = data.cuposDisponibles;
 	       var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
 	 	    	
 	       document.querySelector('#labelCuposDisponiblesActual'+reuVirCovId)
 	       .innerText = cuposDisponiblesActual;
 	 	    	    
 	       document.getElementById('labelCuposDisponiblesActual'+reuVirCovId)
 	       .style.color = colorCuposDisponiblesActual;
 		
 	       mensajeUx="<label>La solicitud de cupos seleccionada se ha eliminado " +
 	       		 "correctamente.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmSolCupCub");
 				
 	       $("#modalMensajeUxActualizarVistaAdmSolCupCub").on("hidden.bs.modal",function(){
     		  $("#modalSolicitudCuposCubiertos").modal("show"); 
     		  cargarSolicitudCuposCubiertos();
     	       });
 	       break;
 						
 	    default:
 	       alert("Ocurrió un error al eliminar la reunión virtual!");
         }
      });
   });
   
   $("#btnRegresarPrevioConfSolCupCub").on("click",function(){
      $("#modalSolicitudCuposCubiertos").modal("show"); 
   });
}

function cancelarSolicitudCuposCubiertos(){
   cargarSolicitudCuposCubiertos();  
}
