
var blacklistId,blacklistObj={};
var banderaEdicion41 = false;

var listFullBlacklist = [],listContratistasBlacklist = [],listTrabajadoresBlacklist = [];
var listGravedadBlacklist = [],listCategoriaBlacklist = [],listSubCategoriaBlacklist = [];
var listFullBlacklistBuscador = [],busquedaActivaBlacklist,numPaginaActualBlacklist;
var mensajeUx;

$(document).ready(function(){
   $("#flechaIzquierdaBlacklist").on("click",function(){
      numPaginaActualBlacklist = numPaginaActualBlacklist-1;
      cambiarPaginaBlacklist();
   });

   $("#flechaDerechaBlacklist").on("click",function(){
      numPaginaActualBlacklist = numPaginaActualBlacklist+1;
      cambiarPaginaBlacklist();
   });
});

function ocultarFiltroBlacklist(){
    $("#modalFiltroBlacklist").modal("hide");
}

function verFiltroBlacklist(){
    $("#modalFiltroBlacklist").modal("show");
}

function crearFiltroBlacklist(functionCallBack){
    $("#modalFiltroBlacklist").remove();

    var contenido = "";
   
    var listContenido=[
        {label:"Fecha de registro - Inicio",inputForm:"<input type='date' id='fechaInicioFiltroBlacklist' class='form-control'>"},
      	{label:"Fecha de registro - Fin",inputForm:"<input type='date' id='fechaFinFiltroBlacklist' class='form-control'>"},
      	{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
      	{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroBlacklist()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroBlacklist()'>" +
                       "<i class='fa fa-filter'></i> Aplicar" +
                   "</button>"}
   	];

   	listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionTres(val);
   	});

    var modalOptions={
        id:"modalFiltroBlacklist",nombre:"<i class='fa fa-filter'></i> Filtros",
        contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
   	};

   	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   	var hoy = getSession("fechaHoyOrdenInversoTexto");
   	$("#fechaInicioFiltroBlacklist").val(sumaFechaDias(-360,hoy));$("#fechaFinFiltroBlacklist").val(hoy);

   	functionCallBack();
}

function valoresFiltroBlacklist(){
    ocultarFiltroBlacklist();

    if($("#fechaInicioFiltroBlacklist").val().length > 0 && $("#fechaFinFiltroBlacklist").val().length > 0){
        cargarBlacklistsSeguridad();
    }else{
        mensajeUx="<label>Debe ingresar la 'Fecha de registro - Inicio' y 'Fecha de registro - Fin' en el filtro.</label>";
      	mensajesUx(mensajeUx,2,"","ValidacionFiltroBlacklist");

      	$("#modalMensajeUxValidacionFiltroBlacklist").on("hidden.bs.modal",function(){
            $("#modalFiltroBlacklist").modal("show");
      	});
    }
}

function cargarBlacklistsSeguridad(){
    $("#valBuscarBlacklist").val("");
    
	resizeDivWrapper("wrapBlacklist",170);	
    
	banderaEdicion41 = false;
	
    $("#btnCancelarBlacklist").hide();$("#btnNuevoBlacklist").show();$("#btnEliminarBlacklist").hide();
    $("#btnGuardarBlacklist").hide();$("#btnCambioSancionTrabCont").show();
	$("#btnFiltroBlacklist").show();$("#btnResetFiltroBlacklist").show();$("#btnBuscarBlacklist").show();
	$("#valBuscarBlacklist").show();$("#indicadorPaginaParcialAuxBlacklist").show();
	
   volverDivBlacklist();
	
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),fechaRegistroInicio:$("#fechaInicioFiltroBlacklist").val(),
      fechaRegistroFin:$("#fechaFinFiltroBlacklist").val()
   };
   
   callAjaxPost(URL+'/contratista/blacklists',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         listFullBlacklist = data.list;
         listGravedadBlacklist = data.gravedades;
         listCategoriaBlacklist = data.categorias;
         listSubCategoriaBlacklist = data.subcategorias;

         busquedaActivaBlacklist = 0;numPaginaActualBlacklist = 1;
         cambiarPaginaBlacklist();

         goheadfixedY("#tblBlacklist","#wrapBlacklist");
         formatoCeldaSombreableTabla(true,"tblBlacklist");
      }else{
	 console.log("NOPNPO")
      }
   });
}

function cambiarPaginaBlacklist(){
   $("#flechaIzquierdaBlacklist").show();$("#flechaDerechaBlacklist").show();

   var list = (busquedaActivaBlacklist == 0?listFullBlacklist:listFullBlacklistBuscador);
   var totalSize = list.length;
   var partialSize = 100;
   var numPaginaTotal = Math.ceil(totalSize/partialSize);
   var inicioRegistro = (numPaginaActualBlacklist*partialSize)-partialSize;
   var finRegistro = (numPaginaActualBlacklist*partialSize)-1;

   if(numPaginaTotal == 0){numPaginaTotal = 1;}

   $("#labelFlechasBlacklist").html("<label>"+numPaginaActualBlacklist+" de "+numPaginaTotal+"</label>");

   if(numPaginaActualBlacklist == 1){$("#flechaIzquierdaBlacklist").hide();}
   if(numPaginaActualBlacklist == numPaginaTotal){$("#flechaDerechaBlacklist").hide();}
   if(finRegistro >= totalSize){finRegistro = totalSize-1;}

   $("#tblBlacklist tbody tr").remove();

   list.forEach(function(val,index){
      if(inicioRegistro <= index && index <= finRegistro){
            var observacion = (val.observacion.length != 0?val.observacion:"------");
            var evidenciaNombre = (val.evidenciaNombre.length != 0?val.evidenciaNombre:"------");
            var estadoNombre = (val.estado.id == 1?"Pendiente":(val.estado.id == 2?"En curso":"Completado"));
            var estadoColor = (val.estado.id == 1?"red":(val.estado.id == 2?"blue":"#9BBB59"));
            var datosCreacion = 
	       val.fechaCreacionTexto+(val.usuarioCreacion.nombre.length == 0?"":"<br>(Por "+val.usuarioCreacion.nombre+")");
	    var datosModificacion = 
	       val.fechaModificacionTexto+(val.usuarioModificacion.nombre.length == 0?"":"<br>(Por "+val.usuarioModificacion.nombre+")");
        	 
            $("#tblBlacklist tbody").append(
	       "<tr id='trbla"+val.id+"' onclick='editarBlacklist("+index+")'>" +
	          "<td id='traconbla"+val.id+"'>"+val.contratista.nombre+"</td>" +
	          "<td id='tranombla"+val.id+"'>("+val.trabajador.nroDocumento+") "+val.trabajador.nombre+"</td>" +
	          "<td id='traotrosconbla"+val.id+"'>"+val.otrosContratistas+"</td>" +
	          "<td id='obsbla"+val.id+"'>"+observacion+"</td>" +
	          "<td id='evibla"+val.id+"'>"+evidenciaNombre+"</td>" +
	          "<td id='feinibla"+val.id+"'>"+val.fechaInicioTexto+"</td>" +
	          "<td id='gravbla"+val.id+"'>"+val.gravedad.nombre+"</td>" +
	          "<td id='catbla"+val.id+"'>"+val.categoria.nombre+"</td>" +
	          "<td id='subcatbla"+val.id+"'>"+val.subCategoria.nombre+"</td>" +
	          "<td id='diasbla"+val.id+"'>"+val.dias+"</td>" +
	          "<td id='fefinbla"+val.id+"'>"+val.fechaFinTexto+"</td>" +
	          "<td id='estbla"+val.id+"'><label style='color:"+estadoColor+";'>"+estadoNombre+"</label></td>" +
	          "<td id='feCre"+val.id+"'>"+datosCreacion+"</td>" +
	          "<td id='feMod"+val.id+"'>"+datosModificacion+"</td>" +
	       "</tr>");
      }
   });

   $.unblockUI();
}

function aplicarBuscadorBlacklist(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

   var valorBuscador = igualarStringBuscar($("#valBuscarBlacklist").val());
   listFullBlacklistBuscador = [];busquedaActivaBlacklist = 1;numPaginaActualBlacklist = 1;

   listFullBlacklist.forEach(function(val){
      if(igualarStringBuscar(val.contratista.nombre).indexOf(valorBuscador) != -1 ||
         igualarStringBuscar(val.trabajador.nroDocumento).indexOf(valorBuscador) != -1 ||
         igualarStringBuscar(val.trabajador.nombre).indexOf(valorBuscador) != -1){
         listFullBlacklistBuscador.push(val);
      }
   });

   cambiarPaginaBlacklist();
}

function reiniciarBuscadorBlacklist(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

   $("#valBuscarBlacklist").val("").focus();
   busquedaActivaBlacklist = 0;numPaginaActualBlacklist = 1;

   cambiarPaginaBlacklist();
}

function verAcordeCategoriaBlacklist(){
   var categoriaId = parseInt($("#selCategoriaBlacklist").val());
   var listAuxSubCategorias = [];
	 
   listSubCategoriaBlacklist.forEach(function(val,index){
      if(val.categoria.id == categoriaId){
	 listAuxSubCategorias.push(val);
      }
   });
	
   var selSubCategoriaBlacklist = crearSelectOneMenuOblig("selSubCategoriaBlacklist","",
      listAuxSubCategorias,blacklistObj.subCategoria.id,"id","nombre");
   
   $("#subcatbla"+blacklistId).html(selSubCategoriaBlacklist);
}

function editarBlacklist(pindex){
   if(!banderaEdicion41){
      formatoCeldaSombreableTabla(false,"tblBlacklist");
      
      blacklistObj = (busquedaActivaBlacklist == 0?listFullBlacklist[pindex]:listFullBlacklistBuscador[pindex]);
      blacklistId = blacklistObj.id; 
      
      $("#trbla"+blacklistId).addClass("fila-edicion");
		
      var selGravedadBlacklist = crearSelectOneMenuOblig("selGravedadBlacklist","",
         listGravedadBlacklist,blacklistObj.gravedad.id,"id","nombre");
	  
      var selCategoriaBlacklist = crearSelectOneMenuOblig("selCategoriaBlacklist","verAcordeCategoriaBlacklist()",
	 listCategoriaBlacklist,blacklistObj.categoria.id,"id","nombre");
		
      $("#gravbla"+blacklistId).html(selGravedadBlacklist);
      $("#catbla"+blacklistId).html(selCategoriaBlacklist);
		
      verAcordeCategoriaBlacklist();
	
      $("#diasbla"+blacklistId).html(
         "<input type='number' onkeyup='hallarEstadoBlacklist()' id='numberDiasBlacklist' class='form-control' min='0'>");
      $("#numberDiasBlacklist").val(blacklistObj.dias);
	  //
      $("#obsbla"+blacklistId).html("<input class='form-control' id ='inputObservacionBlacklist'>" +
         "<label>(Opcional)</label>");
      $("#inputObservacionBlacklist").val(blacklistObj.observacion);
	  //
      $("#feinibla"+blacklistId).html(
         "<input type='date' onchange='hallarEstadoBlacklist()' id='dateFechaInicioBlacklist' class='form-control'>");
      $("#dateFechaInicioBlacklist").val(convertirFechaInput(blacklistObj.fechaInicio));
	  //
      $("#fefinbla"+blacklistId).html(
         "<input type='date' id='dateFechaFinBlacklist' disabled='true' class='form-control'>");
      $("#dateFechaFinBlacklist").val(convertirFechaInput(blacklistObj.fechaFin));
		  
      hallarEstadoBlacklist();
      banderaEdicion41 = true;
		
      $("#btnCancelarBlacklist").show();$("#btnNuevoBlacklist").hide();$("#btnEliminarBlacklist").show();
      $("#btnGuardarBlacklist").show();$("#btnCambioSancionTrabCont").hide();
	  $("#btnFiltroBlacklist").hide();$("#btnResetFiltroBlacklist").hide();$("#btnBuscarBlacklist").hide();
	  $("#valBuscarBlacklist").hide();$("#indicadorPaginaParcialAuxBlacklist").hide();
      //
      var options={
         container:"#evibla"+blacklistObj.id,functionCall:function(){},
         descargaUrl:"/contratista/blacklist/evidencia?id="+blacklistObj.id,
         esNuevo:(blacklistObj.evidenciaNombre.length == 0?true:false),idAux:"Blacklist",
         evidenciaNombre:blacklistObj.evidenciaNombre,mensajeAux:"(Opcional)"
      };
	  
      crearFormEvidenciaCompleta(options);
   }
}

function volverDivBlacklist(){
   $("#tabBlacklist .container-fluid").hide();
   $("#divContainBlacklist").show();
//   $("#tabBlacklist h2").html("<label>Trabajadores Sancionados</label>");
}

function nuevoBlacklist(){
   if(!banderaEdicion41){
      blacklistId = 0;blacklistObj.id = 0;blacklistObj.subCategoria = {};
		
      var selGravedadBlacklist = crearSelectOneMenuOblig("selGravedadBlacklist","",
	 listGravedadBlacklist,"","id","nombre");
	  
      var selCategoriaBlacklist = crearSelectOneMenuOblig("selCategoriaBlacklist","verAcordeCategoriaBlacklist()",
         listCategoriaBlacklist,"","id","nombre");
		 
      $("#tblBlacklist tbody:first").prepend(
         "<tr id='0'>" +
	    "<td>"+"<input class='form-control' type='text' id='inputContratistaBlacklist'>" +
		   "<div id='divAutoCompletarContratistaBlacklist'></div>" +
		   "<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>" +"</td>" +
            "<td><input type='text' id='inputTrabajadorBlacklist' class='form-control'>" +
		"<div id='divAutoCompletarTrabajadorBlacklist'></div>" +
		"<label>*Buscar trabajador por N° documento y/o nombre/apellido (debe ingresar 3 caracteres como mínimo, " +
		       "antes seleccione un contratista) [obligatorio].</label></td>" +
	    "<td><label>*Automático.</label></td>" +	       
	    "<td>"+"<input class='form-control' id='inputObservacionBlacklist'>" +
	           "<label>(Opcional)</label>"+"</td>" +
	    "<td id='evibla0'>...</td>" +
	    "<td>"+"<input onchange='hallarEstadoBlacklist()' type='date' id='dateFechaInicioBlacklist' class='form-control'>" +
	           "<label>(Obligatorio)</label></td>" +
	    "<td>"+selGravedadBlacklist+"</td>" +
	    "<td>"+selCategoriaBlacklist+"</td>" +
	    "<td id='subcatbla0'></td>" +
	    "<td>"+"<input onkeyup='hallarEstadoBlacklist()' class='form-control' id='numberDiasBlacklist' type='number' min='0'>" +
	    	   "<label>(Obligatorio)</label></td>" +
	    "<td>"+"<input type='date' disabled='true' id='dateFechaFinBlacklist' class='form-control'>"+"</td>" +
	    "<td id='estbla0'>...</td>" + 
	    "<td><label>*Automático.</label></td>" +	  
	    "<td>...</td>" +	  
	 "</tr>");
		
      verAcordeCategoriaBlacklist();verAutoCompletarContratistaBlacklist();
		
      var options={
         container:"#evibla"+blacklistObj.id,functionCall:function(){},
         descargaUrl:"/contratista/blacklist/evidencia?id="+blacklistObj.id,
         esNuevo:true,idAux:"Blacklist",evidenciaNombre:"",mensajeAux:"(Opcional)"
      };
		 
      crearFormEvidenciaCompleta(options);
	
      formatoCeldaSombreableTabla(false,"tblBlacklist");
		
      $("#btnCancelarBlacklist").show();$("#btnNuevoBlacklist").hide();$("#btnEliminarBlacklist").hide();
      $("#btnGuardarBlacklist").show();$("#btnCambioSancionTrabCont").hide();
	  $("#btnFiltroBlacklist").hide();$("#btnResetFiltroBlacklist").hide();$("#btnBuscarBlacklist").hide();
	  $("#valBuscarBlacklist").hide();$("#indicadorPaginaParcialAuxBlacklist").hide();
		
      banderaEdicion41 = true;
   }else{
      alert("Guarde primero.");
   }
}

function verAutoCompletarContratistaBlacklist(){
   var contratista = $("#inputContratistaBlacklist").val().trim();
	
   if(contratista.length >= 3){
      var dataParam={
	 nombre: "%"+contratista+"%",isBuscador: 1,
 	 empresaId: parseInt(getSession("gestopcompanyid"))
      }; 
 	   
      callAjaxPostNoLoad(URL+"/contratista/buscar",dataParam,function(data){
         listContratistasBlacklist = (data.contratistas.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.contratistas);
            
         var selAutoContratistaBlacklist = crearSelectOneMenuOblig("selAutoContratistaBlacklist",
     	    "verAutoCompletarTrabajadorBlacklist()",listContratistasBlacklist,"","id","nombre");
     		 		       
         $("#divAutoCompletarContratistaBlacklist").html(selAutoContratistaBlacklist);
         $("#inputContratistaBlacklist").attr("onkeyup","verAutoCompletarContratistaBlacklist()");
 		
         if(data.contratistas.length > 0){
            document.getElementById("inputTrabajadorBlacklist").disabled = false; 
            verAutoCompletarTrabajadorBlacklist(); 
         }else{
            document.getElementById("inputTrabajadorBlacklist").disabled = true; 
            $("#inputTrabajadorBlacklist").val("");$("#divAutoCompletarTrabajadorBlacklist").html("");  
         }
      });
   }else{
      listContratistasBlacklist = [{id: -1,nombre: "Sin asignar"}];
       
      var selAutoContratistaBlacklist = crearSelectOneMenuOblig("selAutoContratistaBlacklist",
     	 "",listContratistasBlacklist,"","id","nombre");
     	    		 		       
      $("#divAutoCompletarContratistaBlacklist").html(selAutoContratistaBlacklist);
      $("#inputContratistaBlacklist").attr("onkeyup","verAutoCompletarContratistaBlacklist()");
     			
      document.getElementById("inputTrabajadorBlacklist").disabled = true; 
      $("#inputTrabajadorBlacklist").val("");$("#divAutoCompletarTrabajadorBlacklist").html("");
   }
}

function verAutoCompletarTrabajadorBlacklist(){
   var trabajador = $("#inputTrabajadorBlacklist").val().trim();
   var contratistaId = parseInt($("#selAutoContratistaBlacklist").val());
	
   if(trabajador.length >= 3){
      var dataParam={
	 nombre: "%"+trabajador+"%",isBuscador: 1,contratistaId: contratistaId
      }; 
	   
      callAjaxPostNoLoad(URL+"/contratista/trabajadores/buscar/simple",dataParam,function(data){
         listTrabajadoresBlacklist = (data.trabajadores.length == 0?[{id: -1,nombre: "Sin asignar"}]:data.trabajadores);
		
         listTrabajadoresBlacklist = data.trabajadores;
		
         var selAutoTrabajadorBlacklist = crearSelectOneMenuOblig("selAutoTrabajadorBlacklist",
    	    "",listTrabajadoresBlacklist,"","id","nombre");
    		 		       
         $("#divAutoCompletarTrabajadorBlacklist").html(selAutoTrabajadorBlacklist);
         $("#inputTrabajadorBlacklist").attr("onkeyup","verAutoCompletarTrabajadorBlacklist()");
      });
   }else{
      listTrabajadoresBlacklist = [{id:-1,nombre:"Sin asignar"}];
      
      var selAutoTrabajadorBlacklist = crearSelectOneMenuOblig("selAutoTrabajadorBlacklist",
    	 "",listTrabajadoresBlacklist,"","id","nombre");
    	    		 		       
      $("#divAutoCompletarTrabajadorBlacklist").html(selAutoTrabajadorBlacklist);
      $("#inputTrabajadorBlacklist").attr("onkeyup","verAutoCompletarTrabajadorBlacklist()");
   }
}

function cancelarNuevoBlacklist(){
   cargarBlacklistsSeguridad();
}

function eliminarBlacklist(){
   mensajeUx="<label>¿Está seguro de eliminar la sanción seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","EventoBlacklist");

   $("#btnDevolverValorEventoBlacklist").on("click",function(){
      var dataParam={
    	 id: blacklistId
      };
			
      callAjaxPost(URL+'/contratista/blacklist/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>La sanción fue eliminada con éxito.</label>"; 
	       mensajesUx(mensajeUx,1,"","ActualizarBlacklist");
	               
	       $("#modalMensajeUxActualizarBlacklist").on("hidden.bs.modal",function(){
	          cargarBlacklistsSeguridad();   
	       });
	  	       
	       break;
						
	    default:
	       alert("Ocurrió un error al eliminar la sanción!");
         }	
      });
   });
}

function guardarBlacklist(){
   var campoVacio = true;

   var gravedadId = $("#selGravedadBlacklist").val();
   var categoriaId = $("#selCategoriaBlacklist").val();
   var subcategoriaId = $("#selSubCategoriaBlacklist").val();
   var dias = ($("#numberDiasBlacklist").val().length != 0?$("#numberDiasBlacklist").val():0);
   var contratistaId = (blacklistId == 0?parseInt($("#selAutoContratistaBlacklist").val()):null);  
   var trabajadorId = (blacklistId == 0?parseInt($("#selAutoTrabajadorBlacklist").val()):null);  
   var observacion = $("#inputObservacionBlacklist").val(); 
   
   var fechaInicio = convertirFechaTexto($("#dateFechaInicioBlacklist").val()); 
   var inputFechaInicio = (!fechaInicio?null:fechaInicio);
   
   var fechaFin = convertirFechaTexto($("#dateFechaFinBlacklist").val());
   var inputFechaFin = (!fechaFin?null:fechaFin);

   if(blacklistId == 0 && (contratistaId == -1 || isNaN(trabajadorId) || trabajadorId == -1 || inputFechaInicio == null || 
      0 >= dias || inputFechaFin == null)){
      campoVacio = false;
   }else if(blacklistId > 0 && (inputFechaInicio == null || 0 >= dias || inputFechaFin == null)){
      campoVacio = false;
   }
		
   if(campoVacio){
      var dataParam={
	 id: blacklistId,gravedad:{id: gravedadId},categoria:{id: categoriaId},subCategoria:{id: subcategoriaId},
	 dias: dias,observacion: observacion,fechaInicio: fechaInicio,fechaFin: fechaFin,estado: blacklistObj.estado,
	 empresaId: parseInt(getSession("gestopcompanyid"))
      };
      
      if(blacklistId == 0){
    	 dataParam.contratista = {id: contratistaId};
    	 
    	 listTrabajadoresBlacklist.forEach(function(val,index){
    	    if(val.id == trabajadorId){
    	       dataParam.trabajador={
    	          nroDocumento: val.nroDocumento,nombre: val.nombreCompleto
    	       };
    	    }
    	 });
      }

      callAjaxPost(URL+'/contratista/blacklist/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       guardarEvidenciaAuto(data.nuevoId,"fileEviBlacklist",bitsMega*10,
	       "/contratista/blacklist/evidencia/save",function(){
		  mensajeUx = "<label>La sanción fue registrada con éxito.</label>"; 
    	          mensajesUx(mensajeUx,1,"","ActualizarBlacklist");
		    
    	          $("#modalMensajeUxActualizarBlacklist").on("hidden.bs.modal",function(){
    	             cargarBlacklistsSeguridad();
    	          });
	       });
							 
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la sanción!");
         }
      });
   }else{
      mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>"; 
      mensajesUx(mensajeUx,2,"");
   }
}

function hallarEstadoBlacklist(){
   var fechaInicio = $("#dateFechaInicioBlacklist").val();
   var numDias = $("#numberDiasBlacklist").val(); // Se almacena los dias
   
   $("#dateFechaFinBlacklist").val(sumaFechaDias(numDias,fechaInicio)); // se asigna la fecha nueva
	
   var fechaFin = $("#dateFechaFinBlacklist").val();
   var hoyDia = getSession("fechaHoyOrdenInversoTexto");
   
   var difInicio = restaFechas(hoyDia,fechaInicio);
   var difFinal = restaFechas(hoyDia,fechaFin);
	
   if(difInicio > 0){
      blacklistObj.estado = {id:"1",nombre:"Pendiente"};
   }else{
      if(difFinal > 0){
	 blacklistObj.estado = {id:"2",nombre:"En Curso"};
      }else{
         blacklistObj.estado = {id:"3",nombre:"Completado"};
      }
   }
	
   $("#estbla"+blacklistObj.id).html(blacklistObj.estado.nombre); 
}
