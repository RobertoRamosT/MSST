var reuVirCovId,reuVirCovObj;
var listFullReunionesVirtualCovid;
var mensajeUx;

function ocultarFiltroReunionVirtualCovid(){
   $("#modalFiltroReunionVirtualCovid").modal("hide");
}

function verFiltroReunionVirtualCovid(){
   $("#modalFiltroReunionVirtualCovid").modal("show");
}

function crearFiltroReunionesVirtualCovid(functionCallBack){
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
       inputForm:"<button id='btnAplicarReunionesVirCov' class='btn btn-success' " +
    	   		 "style='float:right;font-size:18px;' type='submit'>" +
    	            "<i class='fa fa-filter'></i> Filtrar" +
    	         "</button>"},
    	             ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalFiltroReunionVirtualCovid",
      nombre: "<i class='fa fa-filter'></i> Filtro - Programación asistencia presencial",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
    	            };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},false);
        
   $("#btnAplicarReunionesVirCov").on("click",function(){
      ocultarFiltroReunionVirtualCovid(); 
      functionCallBack();
   });
	   
   var hoy = getSession("fechaHoyOrdenInversoTexto");
   $("#fechaInicioReuVirCov").val(hoy);
   $("#fechaFinReuVirCov").val(sumaFechaDias(30,hoy));
   
   $("#modalFiltroReunionVirtualCovid").modal("hide");
    
   functionCallBack();
}

function habilitarReunionVirtualCovid(){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      fechaReunionInicioFiltro: $("#fechaInicioReuVirCov").val(),
      fechaReunionFinFiltro: $("#fechaFinReuVirCov").val()
                 };
   
   var listPanelesPrincipal = [];

   callAjaxPost(URL+'/covid/reunion_virtual',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textTotal = "";

 	    listFullReunionesVirtualCovid = data.listFullReunionesVirtualCovid;
 	    $(".divListPrincipal").html("");

 	    listFullReunionesVirtualCovid.forEach(function(val,index){
 	       var colorCuposDisponible = ((val.aforo - val.cuposOcupados) == 0?"red":"blue");
 	       var cuposDisponibles = "<label style='color:"+colorCuposDisponible+";'>"+
 	                                  (val.aforo - val.cuposOcupados)+"</label>";
 	       var btnOpcion = 
 		  "<a id='btnVerSolicitudCupCub"+val.id+"' class='btn-gestion efectoLink' " +
	             "onclick='verSolicitudCuposCubiertosVistaColaborador("+index+")'>" +
	             "<i class='fa fa-book'></i> Solicitudes de cupos" +
	          "</a>";
 	       
 	       var listTotal=[
 		      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion,
 		       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 		                "Fecha presencial: "+val.fechaReunionTexto+
 		             "</span>"},
 		      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		      {sugerencia:"",anchoLabel:"",anchoDiv:"",
 		       label:"<i class='fa fa-users'></i> Aforo:",inputForm:val.aforo},
 		      {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	 	       label:"<i class='fa fa-users'></i> Cupos disponibles:",inputForm:cuposDisponibles},
 	 	      {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	 	       label:"<i class='fa fa-users'></i> Cupos cubiertos:",inputForm:val.cuposOcupados},
 		      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		      {sugerencia:"",anchoLabel:"",anchoDiv:"",
 		       label:"<i class='fa fa-calendar'></i> Registrado el ",
 		       inputForm:val.fechaRegistroTexto}
 			     ];

 	       textTotal += "<div class='eventoGeneral'>";

 	          listTotal.forEach(function(val,index){
 		     textTotal += ""+obtenerSubPanelModuloVersionDos(val);
 	          });

 	       textTotal += "</div>"
 	    });
 	    
 	    listPanelesPrincipal.push({
 	       id: "infoMovilReunionVirtualCovid",clase:"",styleAux:"",
 	       buttonAd:"<button class='btn btn-success' style='padding:2px 8px 2px 8px;margin-right:10px' " +
       		                "onclick='verFiltroReunionVirtualCovid()' " +
       		                "title='Prueba'>" +
 	                   "<i class='fa fa-filter fa-4x' aria-hidden='true'></i>" +
 	                "</button>",
 	       nombre: ""+"Programación asistencia presencial registradas ("+listFullReunionesVirtualCovid.length+")",
 	       contenido: ""+textTotal
 	    });

 	    agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);

 	    $(".listaFinalGestionGosst").hide();
 	    $(".contenidoFormVisible").hide();
 	    break;

         default:
            alert("nop");
            break;
      }
   });
}

var solCupCubId,solCupCubObj;
var banderaEdicionSolCupCub = false;
var listFullSolicitudesCuposCubiertos;
var listTrabajadoresActivos;
var cuposDisponiblesActual;
var actualizarReunionVirtualCovid;

function regresarReunionVirtualCovid(){
   $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
}

function verSolicitudCuposCubiertosVistaColaborador(pindex){
    reuVirCovId = listFullReunionesVirtualCovid[pindex].id;
    reuVirCovObj = listFullReunionesVirtualCovid[pindex];
    
   actualizarReunionVirtualCovid = 0;
    
   cuposDisponiblesActual = reuVirCovObj.aforo - reuVirCovObj.cuposOcupados;
   var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
    
   var listModal={
      id:"modalSolicitudCuposCubiertosVisCol",
      nombre:"<i class='fa fa-list-alt'></i> Lista de cupos cubiertos",
      contenido:
	 "<label style='font-size:18px;'>CUPOS DISPONIBLES DE LA FECHA PRESENCIAL ("+reuVirCovObj.fechaReunionTexto+"): " +
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
 	    "<table id='tblSolCuposCubiertosVisCol' class='table table-striped table-bordered table-hover table-fixed'>" +
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
//    goheadfixedY("#tblSolCuposCubiertosVisCol","#wrapSolCuposCubiertos");
   cargarSolicitudCuposCubiertos();
	  
   $("#modalSolicitudCuposCubiertosVisCol").on("hidden.bs.modal",function(){
      if(actualizarReunionVirtualCovid == 0){
	 habilitarReunionVirtualCovid();
      }
   });
}

var listTrabajadoresAdOtros;

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
         var countRegListTrabId = 0;
         listTrabajadoresAdOtros = "";
         
	 $("#tblSolCuposCubiertosVisCol tbody tr").remove();
	         
	 listFullSolicitudesCuposCubiertos.forEach(function(val,index){ 
	    var registradoPor = 
	       val.fechaRegistroTexto+" "+(val.registradoPor != ""?"<br>(Por "+val.registradoPor+")":"");
	    var modificadoPor = 
	       val.fechaModificacionTexto+" "+(val.modificadoPor != ""?"<br>(Por "+val.modificadoPor+")":"");
	    
	    if(val.trabajadorId == parseInt(getSession("trabajadorGosstId"))){
	       habilitarNuevoReg = 0;
	       
	       $("#tblSolCuposCubiertosVisCol tbody").append(
	          "<tr id='trSolCupCubVisCol"+val.id+"' onclick='editarSolicitudCuposCubiertosVistaColaborador("+index+")'>" +
		     "<td id='tdCuposAparatadosSolCupCub"+val.id+"'>"+val.cuposApartados+"</td>" + 
		     "<td id='tdCuposCubiertosSolCupCub"+val.id+"'>"+val.cuposCubiertos+"</td>" + 
		     "<td id='tdTrabajadoresAsignSolCupCubAux"+val.id+"'>"+val.listTrabajadoresNombre+"</td>" + 
		     "<td id='tdFechaRegistroSolCupCub"+val.id+"'>"+registradoPor+"</td>" + 
		     "<td id='tdFechaModificacionSolCupCub"+val.id+"'>"+modificadoPor+"</td>" + 
		  "</tr>");
	    }else{
	       if(val.listTrabajadoresId != ''){
		  if(countRegListTrabId > 0){
		      listTrabajadoresAdOtros += ",";
		  }
		  
	          listTrabajadoresAdOtros += val.listTrabajadoresId;
	          countRegListTrabId++;
	       }
	    }
	 });
	 
	 listTrabajadoresAdOtros = listTrabajadoresAdOtros.split(",");
	 
	 if(habilitarNuevoReg == 0 || cuposDisponiblesActual == 0){
	    $("#btnNuevoSolCupCub").hide();
	 }
						
	 goheadfixedY("#tblSolCuposCubiertosVisCol","#wrapSolCuposCubiertos");
	 formatoCeldaSombreableTabla(true,"tblSolCuposCubiertosVisCol");
      }else{
	 console.log("NOPNPO");
      }
   });	
}

var inicialEditarRegSolCupCub;

function editarSolicitudCuposCubiertosVistaColaborador(pindex){
   if(!banderaEdicionSolCupCub){
      actualizarReunionVirtualCovid++;
      
      inicialEditarRegSolCupCub = 0;
      
      formatoCeldaSombreableTabla(false,"tblSolCuposCubiertosVisCol");
      solCupCubId = listFullSolicitudesCuposCubiertos[pindex].id;
      solCupCubObj = listFullSolicitudesCuposCubiertos[pindex];
 		
      $("#trSolCupCubVisCol"+solCupCubId).addClass("fila-edicion");

      $("#tdCuposCubiertosSolCupCub"+solCupCubId)
      .html("<label id='labelCuposCubiertosSolCupCubAux"+solCupCubId+"'></label>");
      
      if(cuposDisponiblesActual > 0){
         $("#tdCuposAparatadosSolCupCub"+solCupCubId).html(
            solCupCubObj.cuposApartados +"<br>"+
            "<button class='btn btn-success' onclick='habilitarModCuposApartados()'>" +
               "<i class='fa fa-pencil'></i> Editar" +
            "</button>");
      }	
      
      var listTrabajadoresAd = solCupCubObj.listTrabajadoresId.split(",");   
      	
      listTrabajadoresAdOtros.forEach(function(val1){	
         listTrabajadoresActivos.forEach(function(val,index){
	    if(parseInt(val1) == val.trabajadorId){
	       listTrabajadoresActivos.splice(index,1);
	    }
	 	 });
	      });
	 	
      listTrabajadoresActivos.forEach(function(val){
 	 val.selected = 0;
 	 listTrabajadoresAd.forEach(function(val1){
            if(parseInt(val1) == val.trabajadorId){
 	       val.selected = 1;
            }	
 	 });
      });
      
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadorSolCupCubAux","calcularCuposCubiertosSolCupCubVistaColaborador()",
         listTrabajadoresActivos,"trabajadorId","nombre","#tdTrabajadoresAsignSolCupCubAux"+solCupCubId,"Sin asignar");
      
      calcularCuposCubiertosSolCupCubVistaColaborador();
      
      banderaEdicionSolCupCub = true;
      $("#btnVolverPrincipalSolCupCub").hide();
      $("#btnVolverSolCupCub").show();
      $("#btnNuevoSolCupCub").hide();
      $("#btnGuardarSolCupCub").show();
      $("#btnEliminarSolCupCub").show();
   }	
}

function calcularCuposCubiertosSolCupCubVistaColaborador(){
   var cuposApartadosAux = solCupCubObj.cuposApartados;
   var listTrabajadoresAux = $("#selMulTrabajadorSolCupCubAux").val();
   
   if($("#selMulTrabajadorSolCupCubAux").val() != null){
      var resultado = listTrabajadoresAux.length;
      var colorResultado = (resultado > cuposApartadosAux?"red":"blue");
   }else{
      var resultado = 0;
      var colorResultado = (resultado > cuposApartadosAux?"red":"blue");
       
      listTrabajadoresActivos.forEach(function(val){
         val.selected = 0;
      });
       
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadorSolCupCubAux","calcularCuposCubiertosSolCupCubVistaColaborador()",
         listTrabajadoresActivos,"trabajadorId","nombre","#tdTrabajadoresAsignSolCupCubAux"+solCupCubId,"Sin asignar");
   }
   
   document.querySelector('#labelCuposCubiertosSolCupCubAux'+solCupCubId)
   .innerText = resultado;
 
   document.getElementById('labelCuposCubiertosSolCupCubAux'+solCupCubId)
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
   
   $("#tdTrabajadoresAsignSolCupCubAux"+solCupCubId).html(solCupCubObj.listTrabajadoresNombre);
    
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
      formatoCeldaSombreableTabla(false,"tblSolCuposCubiertosVisCol");	
      solCupCubObj = {id: 0};
      solCupCubId = 0; 
 		
      $("#tblSolCuposCubiertosVisCol tbody").prepend(
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
//    	    guardarSolicitudCuposCubiertos();
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
    	       $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
    	       mensajeUx = "<label>No hay más cupos disponibles en la reunión virtual.</label>";
    	       mensajesUx(mensajeUx,2,"","AvisoVistaAdmSolCupCub"); 
    	      
    	       $("#modalMensajeUxAvisoVistaAdmSolCupCub").on("hidden.bs.modal",function(){
    	          $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
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
	  	      "<br><br> *Actualmente quedan "+cuposDisponiblesActual+" cupo(s).</label>";
       }	
   }else{
      var listTrabajadores = $("#selMulTrabajadorSolCupCubAux").val();
      var listTrabajadoresAd = [];
      if(listTrabajadores != null){
         listTrabajadores.forEach(function(val,index){
            listTrabajadoresAd.push(
	       {trabajadorId: parseInt(val)});
         });
      }else{
         listTrabajadores = []; 
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
	 dataParam.trabajadorId = parseInt(getSession("trabajadorGosstId"));
      }else{
	 dataParam.listTrabajadores = listTrabajadoresAd;
      }
       
      callAjaxPost(URL+'/covid/reunion_virtual/solicitud_cupo_cubierto/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
     	    case "05":		
     	       if(solCupCubId == 0){
     		  cuposDisponiblesActual = cuposDisponiblesActual - cuposApartados;
     		  var colorCuposDisponiblesActual = (cuposDisponiblesActual > 0?"blue":"red");
     		  
     		  document.querySelector("#labelCuposDisponiblesActual"+reuVirCovId).innerText = cuposDisponiblesActual;
         	      
     		  document.getElementById("labelCuposDisponiblesActual"+reuVirCovId)
         	  .style.color = colorCuposDisponiblesActual;
     	       }
     	       
     	       $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
     		
     	       mensajeUx="<label>La solicitud de cupos fue registrada con éxito.</label>";
     	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmSolCupCub");
 		    
     	       $("#modalMensajeUxActualizarVistaAdmSolCupCub").on("hidden.bs.modal",function(){
     		  $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
     		  cargarSolicitudCuposCubiertos();
     	       });
     	       break;
     			
     	    default:
     	       console.log("Ocurrió un error al guardar la solicitud de cupos!");
         }
      });	
   }else{
      $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ValidacionVistaAdmSolCupCub"); 
      
      $("#modalMensajeUxValidacionVistaAdmSolCupCub").on("hidden.bs.modal",function(){
         $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
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
	     	       
	       $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
	     		
	       mensajeUx="<label>Los cupos apartados se modificaron correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmSolCupCub");
	 		    
	       $("#modalMensajeUxActualizarVistaAdmSolCupCub").on("hidden.bs.modal",function(){
	          $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
	          cargarSolicitudCuposCubiertos();
	       });
	       break;
	     			
	    default:
	       console.log("Ocurrió un error al guardar la solicitud de cupos!");
         }
      });	
   }else{
      $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
      mensajesUx(mensajeUx,2,"","ValidacionVistaAdmSolCupCub"); 
	      
      $("#modalMensajeUxValidacionVistaAdmSolCupCub").on("hidden.bs.modal",function(){
         $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
      });
   }
}

function eliminarSolicitudCuposCubiertos(){
   $("#modalSolicitudCuposCubiertosVisCol").modal("hide"); 
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
     		  $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
     		  cargarSolicitudCuposCubiertos();
     	       });
 	       break;
 						
 	    default:
 	       alert("Ocurrió un error al eliminar la reunión virtual!");
         }
      });
   });
   
   $("#btnRegresarPrevioConfSolCupCub").on("click",function(){
      $("#modalSolicitudCuposCubiertosVisCol").modal("show"); 
   });
}

function cancelarSolicitudCuposCubiertos(){
   cargarSolicitudCuposCubiertos();  
}