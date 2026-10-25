
var listLugaresTrabajoProyTotal=[];
var numPaginaActualLugarTrabProyTotal,lugarTrabProyTotalObj,banderaEdicionLugarTrabProyTotal,actPrincipalProy;

function ocultarConsolidadoLugarTrabajoProyecto(){
    $("#modalConsolidadoLugarTrabProyTotal").modal("hide");
   
    if(actPrincipalProy == 1){
	crearFiltroProyecto(valoresFiltroProyectosSeguridad);
    }
}

function verConsolidadoLugarTrabajoProyecto(){
   $("#modalSelecCampoPersonalizadoProy").modal("hide");$("#modalConsolidadoLugarTrabProyTotal").remove();actPrincipalProy = 0;
    
   var contenido = "";
   
   var buttonOcultar =
      "<button id='btnOcultarLugarTrabProy' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='ocultarConsolidadoLugarTrabajoProyecto()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonNuevo =
       "<button id='btnNuevoLugarTrabProy' type='button' class='btn btn-success' style='margin-right:5px' " +
               "onclick='nuevoConsolidadoLugarTrabajoProyecto()' title='Nuevo.'>" +
          "<i class='fa fa-file-o fa-2x'></i>" +
       "</button>";
   
   var buttonCancelar =
      "<button id='btnCancelarLugarTrabProy' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarConsolidadoLugarTrabajoProyecto()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarLugarTrabProy' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConsolidadoLugarTrabajoProyecto()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonEliminar = 
       "<button id='btnEliminarLugarTrabProy' type='button' class='btn btn-danger' style='margin-right:5px' " +
               "title='Eliminar.' onclick='eliminarConsolidadoLugarTrabajoProyecto()'>" +
           "<i class='fa fa-times fa-2x'></i>" +
       "</button>";
      
   var buttonFlechas = 
      "<span id='indicadorPaginaParcialAuxLugarTrabProy' style='margin:5px;margin-top:10px;'>" +
         "<a id='flechaIzquierdaLugarTrabProy'><img src='../imagenes/flecha_01.png' /></a>" +
	    " <em id='labelFlechasLugarTrabProy'></em> " +
	 "<a id='flechaDerechaLugarTrabProy'><img src='../imagenes/flecha_02.png' /></a>" +
      "</span>";
   
   var modalOptions={
      maxWidth:"60%",id:"modalConsolidadoLugarTrabProyTotal",btnCerrarHabilitado:0,
      nombre:"<i class='fa fa-table'></i> Consolidado Lugar de trabajo",
      contenido: 
	 "<form class='form-inline'>" +
	     buttonOcultar+buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar+buttonFlechas +
         "</form>" +
         "<div class='wrapper' id='wrapperConsolidadoLugarTrabProy'>" +
            "<table id='tblConsolidadoLugarTrabProy' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	           "<tr>" +
	               "<td class='tb-acc' style='width:400px'>Nombre</td>" +
	               "<td class='tb-acc' style='width:120px'>N° de proyectos asociados</td>" +
				   "<td class='tb-acc' style='width:120px'>N° de usuarios asociados</td>" +
	               "<td class='tb-acc' style='width:200px'>Registrado el</td>" +
                       "<td class='tb-acc' style='width:200px'>Actualizado el</td>" +
                   "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoLugarTrabProy",190);
   cargarConsolidadoLugarTrabajoProyecto();
   
   $("#flechaIzquierdaLugarTrabProy").on('click',function(){
      numPaginaActualLugarTrabProyTotal = numPaginaActualLugarTrabProyTotal-1;
      cambiarPaginaLugarTrabajoProyectoTotal();
   });
	 
   $('#flechaDerechaLugarTrabProy').on('click',function(){
      numPaginaActualLugarTrabProyTotal = numPaginaActualLugarTrabProyTotal+1;
      cambiarPaginaLugarTrabajoProyectoTotal();
   });
}

function cargarConsolidadoLugarTrabajoProyecto(){
   $("#modalConsolidadoLugarTrabProyTotal").modal("show");
   numPaginaActualLugarTrabProyTotal = 1; 
    
   var dataParam={
       empresaId:parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/contratista/proyecto/campo_personalizado/lugar_trabajo',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listLugaresTrabajoProyTotal = data.listLugaresTrabajoProy;
	 
	 $("#tblConsolidadoLugarTrabProy tbody tr").remove();
	 
	 cambiarPaginaLugarTrabajoProyectoTotal();
	      
	 goheadfixedY("#tblConsolidadoLugarTrabProy","#wrapperConsolidadoLugarTrabProy");
      }else{
         console.log("Error al cargar el consolidado Lugar de trabajo");
      }
   }); 
   
   $("#btnOcultarLugarTrabProy").show();$("#btnNuevoLugarTrabProy").show();$("#btnCancelarLugarTrabProy").hide();
   $("#btnGuardarLugarTrabProy").hide();$("#indicadorPaginaParcialAuxLugarTrabProy").show();$("#btnEliminarLugarTrabProy").hide();
   
   banderaEdicionLugarTrabProyTotal = false;
}

function cambiarPaginaLugarTrabajoProyectoTotal(){
   $("#flechaIzquierdaLugarTrabProy").show();$("#flechaDerechaLugarTrabProy").show(); 
   
   var list = listLugaresTrabajoProyTotal;
   var totalSize = list.length;
   var partialSize = 100;
	
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActualLugarTrabProyTotal*partialSize)-partialSize;
   var finRegistro = (numPaginaActualLugarTrabProyTotal*partialSize)-1;
	
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechasLugarTrabProy").html("<label>"+numPaginaActualLugarTrabProyTotal+" de "+numPaginaTotal+"</label>");
	 
   if(numPaginaActualLugarTrabProyTotal == 1){
      $("#flechaIzquierdaLugarTrabProy").hide();
   }
	
   if(numPaginaActualLugarTrabProyTotal == numPaginaTotal){
      $("#flechaDerechaLugarTrabProy").hide();
   }
	 
   if(finRegistro >= totalSize){
      finRegistro = totalSize-1;
   }
   
   $("#tblConsolidadoLugarTrabProy tbody tr").remove();

   list.forEach(function(val,index){	
      if(inicioRegistro <= index && index <= finRegistro){
	  var registradoPor = (val.fechaRegistroTexto.length == 0?"------":
                  val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")")),
              actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":
                  val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")"));
	  
         $("#tblConsolidadoLugarTrabProy tbody").append(
            "<tr id='trLugarTrabProy"+val.id+"' onclick='editarConsolidadoLugarTrabajoProyecto("+index+")'>" +
               "<td id='lugarTrabProyTotalNombre"+val.id+"'>"+val.nombre+"</td>" +
               "<td id='lugarTrabProyTotalNumProyAsoc"+val.id+"'>"+val.numProyectosAsociados+"</td>" +
			   "<td id='lugarTrabProyTotalNumUsuAsoc"+val.id+"'>"+val.numUsuariosAsociados+"</td>" +
               "<td id='lugarTrabProyTotalFechaReg"+val.id+"'>"+registradoPor+"</td>" +
               "<td id='lugarTrabProyTotalFechaAct"+val.id+"'>"+actualizadoPor+"</td>" +
	    "</tr>");
      }
   });

   $.unblockUI();
   formatoCeldaSombreableTabla(true,"tblConsolidadoLugarTrabProy");
}

function nuevoConsolidadoLugarTrabajoProyecto(){
    if(!banderaEdicionLugarTrabProyTotal){
        formatoCeldaSombreableTabla(false,"tblConsolidadoLugarTrabProy");
        lugarTrabProyTotalObj = {id:0};

        $("#tblConsolidadoLugarTrabProy tbody").prepend(
            "<tr>" +
                "<td>"+"<input id='inputNombreLugarTrabProy' type='text' class='form-control'>"+"</td>" +
                "<td><label>...</label></td>" +
				"<td><label>...</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>...</label></td>" +
            "</tr>");


        $("#btnOcultarLugarTrabProy").hide();$("#btnNuevoLugarTrabProy").hide();$("#btnCancelarLugarTrabProy").show();
        $("#btnGuardarLugarTrabProy").show();$("#indicadorPaginaParcialAuxLugarTrabProy").hide();$("#btnEliminarLugarTrabProy").hide();

        banderaEdicionLugarTrabProyTotal = true;
    }else{
        alert("Guarde primero.");
    }
}

function editarConsolidadoLugarTrabajoProyecto(pindex){
   if(!banderaEdicionLugarTrabProyTotal){
      lugarTrabProyTotalObj = listLugaresTrabajoProyTotal[pindex];

      $("#trLugarTrabProy"+lugarTrabProyTotalObj.id).addClass("fila-edicion");
      
      $("#lugarTrabProyTotalNombre"+lugarTrabProyTotalObj.id).html("<input id='inputNombreLugarTrabProy' type='text' class='form-control'>");
      $("#inputNombreLugarTrabProy").val(lugarTrabProyTotalObj.nombre);
      
      $("#lugarTrabProyTotalFechaAct"+lugarTrabProyTotalObj.id).html("<label>*Automático.</label>");

      formatoCeldaSombreableTabla(false,"tblConsolidadoLugarTrabProy");
      
      $("#btnOcultarLugarTrabProy").hide();$("#btnNuevoLugarTrabProy").hide();$("#btnCancelarLugarTrabProy").show();
      $("#btnGuardarLugarTrabProy").show();$("#indicadorPaginaParcialAuxLugarTrabProy").hide();$("#btnEliminarLugarTrabProy").show();

      banderaEdicionLugarTrabProyTotal = true;
   }
}

function guardarConsolidadoLugarTrabajoProyecto(){
    var campoVacio = true;
   
    var nombre = $("#inputNombreLugarTrabProy").val().trim();
    
    if(nombre.length == 0){
	campoVacio = false;mensajeUx="<label>Debe ingresar el lugar de trabajo.</label>";
    }
   
    if(campoVacio){
        var dataParam={
	    id:lugarTrabProyTotalObj.id,nombre:nombre,empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyecto/campo_personalizado/lugar_trabajo/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":  
	            $("#modalConsolidadoLugarTrabProyTotal").modal("hide");	
		
	            mensajeUx = "<label>El registro lugar de trabajo fue guardado con éxito.</label>";
	            mensajesUx(mensajeUx,1,"","ActualizarLugarTrabProyTotal");
								   
	            $("#modalMensajeUxActualizarLugarTrabProyTotal").on("hidden.bs.modal",function(){
		        cargarConsolidadoLugarTrabajoProyecto();actPrincipalProy = 1;  
	            });
		
	            break;
						
	        default:
	            alert("Ocurrió un error al guardar el registro lugar de trabajo.");
	    }
        });	
    }else{
	$("#modalConsolidadoLugarTrabProyTotal").modal("hide");
	mensajesUx(mensajeUx,2,"","ValidacionLugarTrabProyTotal"); 
	   
	$("#modalMensajeUxValidacionLugarTrabProyTotal").on("hidden.bs.modal",function(){
	    $("#modalConsolidadoLugarTrabProyTotal").modal("show");  
	});
    }	
}

function eliminarConsolidadoLugarTrabajoProyecto(){
    $("#modalConsolidadoLugarTrabProyTotal").modal("hide");
    
    if(lugarTrabProyTotalObj.numProyectosAsociados == 0 && lugarTrabProyTotalObj.numUsuariosAsociados == 0){
        mensajeUx="<label>¿Está seguro de eliminar el registro lugar de trabajo seleccionado?</label>";
        mensajesUx(mensajeUx,3,"","EliminarLugarTrabProyTotal");
    
        $("#btnDevolverValorEliminarLugarTrabProyTotal").on("click",function(){
            var dataParam={
                id:lugarTrabProyTotalObj.id
            };
    
            callAjaxPost(URL+'/contratista/proyecto/campo_personalizado/lugar_trabajo/delete',dataParam,function(data){
                switch(data.CODE_RESPONSE){
                    case "05":
     	                mensajeUx = "<label>El registro solicitud proyecto fue eliminado con éxito.</label>";
     	                mensajesUx(mensajeUx,1,"","ActualizarLugarTrabProyTotal"); 
     								   
     	                $("#modalMensajeUxActualizarLugarTrabProyTotal").on("hidden.bs.modal",function(){
     	                    cargarConsolidadoLugarTrabajoProyecto();  
     	                });
     	       
     	                break;
    			
                    default:
                        alert("Ocurrió un error al eliminar el registro lugar de trabajo.");
                }
            });
        });
        
        $("#btnRegresarPrevioEliminarLugarTrabProyTotal").on("click",function(){
            $("#modalConsolidadoLugarTrabProyTotal").modal("show"); 
        });
    }else{
	mensajeUx = "<label>No se puede borrar el registro seleccionado porque tiene proyectos y/o usuarios asociados.</label>";
        mensajesUx(mensajeUx,2,"","ValidacionLugarTrabProyTotal"); 
							   
        $("#modalMensajeUxValidacionLugarTrabProyTotal").on("hidden.bs.modal",function(){
            $("#modalConsolidadoLugarTrabProyTotal").modal("show");  
        });
    }
}