var entregaEppId;
var fechaEntrega;
var banderaEdicion2;
var listTrabajadores;
var listTrabajadoresSeleccionados;
var listEquipos;
var cantidadEPP;
var listaFullProgEpp;
var motivoId;
var progEppEstado;
var progEppEstadoNombre;
var numPaginaActual;
var numPaginaTotal;
var listTrabajadoresResponsables=[];
var entregaEppObj={};
var listEquiposEntrega;
var mensajeUx;

$(function(){
   $("#btnClipTablaProgramacion").on("click",function(){
      var listFullTablaProgramacion = "";
		
      listFullTablaProgramacion = 
         "Motivo"+"\t" +
	 "Fecha Entrega Planificada"+"\t" +
	 "Fecha Entrega Real"+"\t" +
	 "# de EPP´s"+"\t" +
	 "# de trabajadores"+"\t" +
	 "Evidencia"+"\t" +
	 "Estado"+" \n";
      
      for(var index = 0;index < listaFullProgEpp.length;index++){					
         listFullTablaProgramacion = 
            listFullTablaProgramacion +
            listaFullProgEpp[index].motivoNombre+"\t" +
            listaFullProgEpp[index].fechaPlanificadaTexto+"\t" +
            listaFullProgEpp[index].fechaEntregaTexto+"\t" +
            listaFullProgEpp[index].numeroEquipos+"\t" +
            listaFullProgEpp[index].numeroTrabajadores+"\t" +
            (listaFullProgEpp[index].evidenciaNombre == "----"?"NO":"SI")+"\t" +
            listaFullProgEpp[index].estadoImplementacionNombre+"\n";
      }
		
      copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaProgramacion");
      alert("Se han guardado al clipboard la tabla de este módulo" );	
   });
	
   $("#cambiarBuscador").attr("onclick","toggleBuscadorJstree(2)");
   $("#cambiarBuscadorAsist").attr("onclick","toggleBuscadorAsistJstree(2)");
	
   $("#listTrabBuscar").hide();$("#listTrabAsistBuscar").hide();
   
   $('#modalRecomendacion').on('hidden.bs.modal',function(e){
      $("#mdProgFecha").modal({
         keyboard: true,show:true,"backdrop":"static"
      });
   });
	
   $('#buscadorTrabajadorInput').keyup(function(e){
      if(e.keyCode == 13){
         $(this).trigger("enterKey");
      }
   });
	
   $('#buscadorTrabajadorInput').bind("enterKey",function(e){
      cargarModalProgCap();
   });
	
   $("#buscadorTrabajadorInput").focus();
	
   $("#resetBuscador").attr("onclick","resetBuscador()")
		
   $('.izquierda_flecha').on('click',function(){
      numPaginaActual = numPaginaActual-1;
      cambiarPaginaTabla();
   });
	 
   $('.derecha_flecha').on('click',function(){
      numPaginaActual = numPaginaActual+1;
      cambiarPaginaTabla();
   });
	 
   $('.izquierda_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });

   $('.derecha_flecha').hover(function(){
      $(this).css('opacity','0.5');
   },function(){
      $(this).css('opacity','1');
   });	
});

function resetBuscador(){
   $("#buscadorTrabajadorInput").val("");
   cargarModalProgCap();
}

function programarFecha(){
   cargarModalProgCap();
	
   $('#mdProgFecha').modal({
      keyboard: true,show: true,"backdrop": "static"
   }); 
}

function cambiarPaginaTabla(){
   var list = listaFullProgEpp;
   var totalSize = list.length;	
   var partialSize = 10;
   
   numPaginaTotal = Math.ceil(totalSize/partialSize);
	
   var inicioRegistro = (numPaginaActual*partialSize)-partialSize;
   var finRegistro = (numPaginaActual*partialSize)-1;
	
   //aplicando logica de compaginacion
	
   $('.izquierda_flecha').show(); $('.derecha_flecha').show();
	 
   if(numPaginaTotal == 0){
      numPaginaTotal = 1;
   }
		
   $("#labelFlechas").html(numPaginaActual+" de "+numPaginaTotal);
	
   if(numPaginaActual == 1){
      $('.izquierda_flecha').hide();
   }
	
   if(numPaginaActual == numPaginaTotal){
      $('.derecha_flecha').hide();
   }
	 
   if(finRegistro > totalSize){
      finRegistro = totalSize-1;
   }
	
   $("#tblProg tbody tr").remove();
	
   for(var index = inicioRegistro;index <= finRegistro;index++){
      cantidadEPPP(list[index].entregaEppId);
			
      $("#tblProg tbody").append(
         "<tr id='tr"+list[index].entregaEppId+"' onclick='javascript:editarEntregaEpp("+index+")'>" +
	    "<td id='tdmotivo"+list[index].entregaEppId+"'>"+list[index].motivoNombre+"</td>" + 
	    "<td id='tdfechaPlan"+list[index].entregaEppId+"'>"+list[index].fechaPlanificadaTexto+"</td>" +
	    "<td id='tdhorapla"+list[index].entregaEppId+"'>"+list[index].horaPlanificadaTexto+"</td>" +
	    "<td id='tdfechEntrega"+list[index].entregaEppId+"'>"+list[index].fechaEntregaTexto+"</td>" +
	    "<td id='trabent"+list[index].entregaEppId+"'>"+list[index].trabajadorResponsable.nombre+"</td>" +
	    "<td id='tdlistEpp"+list[index].entregaEppId+"'>"+list[index].numeroEquipos+"</td>" + 
	    "<td id='tdtrabEntrega"+list[index].entregaEppId+"'>"+list[index].numeroTrabajadores+"</td>" + 
	    "<td id='tdevi"+list[index].entregaEppId+"'>"+list[index].evidenciaNombre+"</td>" +
	    "<td id='estadoEpp"+list[index].entregaEppId+"'>"+list[index].estadoImplementacionNombre+"</td>" +
         "</tr>");
   }
}

function cargarModalProgCap(){	
   $('#modalCorreos').on('hidden.bs.modal',function(e){		
      $("#mdProgFecha").modal({
         keyboard: true,show: true,"backdrop": "static"
      });
   });
	
   var palabraClave = $("#buscadorTrabajadorInput").val();
	
   if(palabraClave.length == 0){
      palabraClave = null;
   }else{
      palabraClave = ("%"+palabraClave+"%").toUpperCase();
   }
   
   $("#btnAgregarProg").attr("onclick","javascript:nuevoProgCap();");
   $("#btnCancelarProg").attr("onclick","javascript:cancelarProgCap();");
   $("#btnGuardarProg").attr("onclick","javascript:guardarProgCap();");
   $("#btnEliminarProg").attr("onclick","javascript:eliminarProgCap();");
   $("#btnGenReporte").attr("onclick","javascript:generarReporteEntrega();");
   $("#btnRecomendacion").attr("onclick","javascript:verRecomendacion();");

   $("#btnRecomendacion").hide();$("#btnCancelarProg").hide();$("#btnAgregarProg").show();
   $("#btnEliminarProg").hide();$("#btnGenReporte").hide();$("#btnGuardarProg").hide();
   $("#btnClipTablaProgramacion").show();$("#btnUploadEntregas").show();

   $("#modalProg").show();$("#modalTree").hide();$("#modalListEpp").hide();
   $("#btnVerCorreos").attr("onclick","javascript:verCorreos();");
   $("#btnVerCorreos").hide();
	
   entregaEppId = 0;numPaginaActual = 1;
   listTrabajadoresSeleccionados = null;listEquipos = null;motivoId = null;
   fechaEntrega = null;banderaEdicion2 = false;
   listaFullProgEpp=[];
	
   var dataParam={
      idCompany: getSession("gestopcompanyid"),
      palabraClave: palabraClave
   };

   callAjaxPost(URL+'/equiposeguridad/entrega',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var list = data.list;
	    listaFullProgEpp = data.list;
	    listTrabajadoresResponsables = data.trabajadores;
	    listEquiposEntrega = data.equipos;
			
	    if(getSession("linkCalendarioEntregaEppId") != null){ 		
	       listaFullProgEpp.every(function(val,index3){
	          if(val.entregaEppId == parseInt(getSession("linkCalendarioEntregaEppId"))){
		     numPaginaActual = Math.ceil((index3+1)/(10));
		     cambiarPaginaTabla();
		     editarEntregaEpp(index3);
		     sessionStorage.removeItem("linkCalendarioEntregaEppId");
		     return false;
	          }else{
		     return true;
	          }
	       });
	    }else{
	       cambiarPaginaTabla();
	    }

	    formatoCeldaSombreableTabla(true,"tblProg");
			
	    break;
		
         default:
	    alert("Ocurrió un error al traer las programaciones!");
      }
   });
}

function editarEntregaEpp(pindex){
   if(!banderaEdicion2){
      listTrabajadores = [];listTrabajadoresSeleccionados = [];
		
      entregaEppObj = listaFullProgEpp[pindex];
      entregaEppId = entregaEppObj.entregaEppId;
      fechaEntrega = entregaEppObj.fechaEntrega;
      listEquipos = [];
      
      $("#tr"+entregaEppId).addClass("fila-edicion");
		
      var correTrabajadores = entregaEppObj.correoTrabajadores;
      var numTrabajadores = entregaEppObj.numeroTrabajadores;
      var estadoImpl = entregaEppObj.estadoImplementacion;
      var fechaPlan = entregaEppObj.fechaPlanificada;
      var inversionEntregaEpp = entregaEppObj.inversionEntregaEpp;
      var motivoId = entregaEppObj.motivoId;
      var horaPlanificada = entregaEppObj.horaPlanificada;
		
      var dataParam={
         entregaEppId: entregaEppId,
      };

      callAjaxPost(URL+'/equiposeguridad/recomendacion',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       var list = data.list;
	       var inversionRecomendada = list.inversionRecomendada;
					
	       $("#tblRecomendacion tbody tr").remove();
						
	       $("#tblRecomendacion tbody").append(
	          "<tr>" +
	             "<td>"+inversionRecomendada+"</td>" +
		     "<td>"+numTrabajadores+"</td>" +
		     "<td>"+parseFloat(inversionRecomendada)*parseInt(numTrabajadores)+"</td>" +
		  "</tr>");
							
	       break;
						
	    default:
	       alert("Ocurrió un error al eliminar la programacion!");
         }
      });
		//
      listTrabajadoresResponsables.forEach(function(val){
         if(val.trabajadorId == entregaEppObj.trabajadorResponsable.trabajadorId){
	    val.selected = 1;
         }else{
	    val.selected = 0;
         }
      });
			
      crearSelectOneMenuObligUnitarioCompleto("selRespTrabEntrega","",listTrabajadoresResponsables,
         "trabajadorId","nombre","#trabent"+entregaEppId,"Seleccionar Responsable")
			//
      var selMotivo = crearSelectOneMenuOblig("selMotivo","",listMotivos,
	 motivoId,"motivoId","motivoNombre");
		
      $("#tdmotivo"+entregaEppId).html(selMotivo);
      $("#btnRecomendacion").hide();
		
      $("#modalBodyCorreos").html(
         "<p style='color:#008b8b'>Número de Trabajadores: </p>"+numTrabajadores+"<br>" +
	 "<p style='color:#008b8b'>Correos: </p>"+correTrabajadores);
		
      $("#btnVerCorreos").show();
      formatoCeldaSombreableTabla(false,"tblProg");
		
      $("#tdinversion"+entregaEppId).html(
         "<input type='number' id='inputInversion' name='inputInversion'" +
		"class='form-control' value='"+inversionEntregaEpp+"'><label for='inputInversion'>S/</label>");
		
      $("#tdtrabEntrega"+entregaEppId).html(
         "<a id='linkTrabEntr' href='#' onclick='javascript:cargarTrabajadores();'>Trabajadores a entregar</a>");
		
      $("#tdfechEntrega"+entregaEppId).html(
         "<input type='date' id='inputFecEntrega' class='form-control' onchange='hallarEstadoImplementacion("+entregaEppId+")'>");
		
      $("#tdfechaPlan"+entregaEppId).html(
         "<input type='date' id='inputFecPlan' class='form-control' onchange='hallarEstadoImplementacion("+entregaEppId+")'>");
		
      $("#tdhorapla"+entregaEppId).html("<input type='time' id='inputHora' class='form-control'>");
		
      var today = convertirFechaInput(fechaEntrega);
      var today2 = convertirFechaInput(fechaPlan);
		
      $("#inputHora").val(horaPlanificada);
      $("#inputFecEntrega").val(today);
      $("#inputFecPlan").val(today2);
		
      hallarEstadoImplementacion(entregaEppId);
		
      var nombreEvidencia = $("#tdevi"+entregaEppId).text();
		
      $("#tdevi"+entregaEppId).html(
         "<a href='"+URL+"/equiposeguridad/evidencia?progEquipoId="+entregaEppId+"' target='_blank'>" +
	     nombreEvidencia+"</a>"+ 
	 "<br/><a href='#' onclick='javascript:mostrarCargarImagen("+entregaEppId+")'  " +
	 	 "id='subirimagen"+entregaEppId+"'>Subir</a>");
      
      banderaEdicion2 = true;
		
      $("#btnCancelarProg").show();$("#btnAgregarProg").hide();$("#btnEliminarProg").show();
      $("#btnGenReporte").show();$("#btnGuardarProg").show();$("#btnClipTablaProgramacion").hide();
      $("#btnUploadEntregas").hide();

      cargarTrabajadores();cargarEPPs();
		
      $("#modalProg").show();$("#modalTree").hide();$("#modalListEpp").hide();
   }
}

function cargarTrabajadores(){
   $("#modalProg").hide();$("#modalTree").show();$("#modalListEpp").hide();
   
   var buttonGuardar = 
      "<button id='btnGuardarShortcut' type='button' class='btn btn-success' " +
              "title='Guardar' style='margin-left:2px'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
	
   $("#modalTree #btnGuardarShortcut").remove();
   $("#modalTree #btnCancelarTrabs").after(buttonGuardar);
	
   $("#modalTree #btnGuardarShortcut").on("click",function(){
      cancelarSeleccionarTrabs();guardarProgCap();
   });
	
   if(listTrabajadoresSeleccionados.length === 0){
      var fechaPlanAux = $("#inputFecPlan").val();
      var fechaEntregaAux = $("#inputFecEntrega").val();

      var dataParam={
         entregaEppId: entregaEppId,
         fechaPlanificadaTexto: fechaPlanAux,
         fechaEntregaTexto: fechaEntregaAux,
         idCompany: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/equiposeguridad/entrega/trabajadores',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $('#jstree').jstree("destroy");

	       listTrabajadores = data.list;

	       $('#jstree').jstree({
	          "plugins": ["checkbox","json_data","search" ],
		  'checkbox': {
		     "keep_selected_style": false,
		     "tie_selection": false},
		  'core': {
		     'data': listTrabajadores}
	       });
	       //Inicio Para Buscador en jstree
	       var to = false;
						  
	       $('#buscarTrabJstree').keyup(function(){
	          if(to){
	             clearTimeout(to);
	          }
						    
	          to = setTimeout(function(){
		     var v = $('#buscarTrabJstree').val();
		     $("#jstree").jstree(true).search(v);
		  },250);
               });
						  
	       $.jstree.defaults.search.show_only_matches = true;
						 
	       $('#listTrabBuscar').keyup(function(){
	          if(to){
	             clearTimeout(to);
	          }
							    
	          to = setTimeout(function(){
		     busquedaMasivaJstree(listTrabajadores,"jstree","resultSearchTrab","listTrabBuscar")
		  },250);
	       });
	       //Fin Para Buscador en jstree
	       for(index = 0;index < listTrabajadores.length;index++){
	          if(listTrabajadores[index].state.checked && listTrabajadores[index].id.substr(0,3) == "tra"){
		     listTrabajadoresSeleccionados.push(listTrabajadores[index].id.substr(3,listTrabajadores[index].id.length));
	          }
	       }

	       break;
					
	    default:
	       alert("Ocurrió un error al cargar el arbol de trabajadores!");
         }
      });
   }
}

function nuevoProgCap(){
   if(!banderaEdicion2){
      var selMotivo = crearSelectOneMenuOblig("selMotivo","",
         listMotivos,"","motivoId","motivoNombre");
      
      $("#tblProg tbody").prepend(
         "<tr id='tr0'>" + 
            "<td>"+selMotivo+"</td>" + 
            "<td><input type='date' id='inputFecPlan' class='form-control' onchange='hallarEstadoImplementacion(0)'></td>" + 
            "<td><input type='time' value='12:00:00' id='inputHora' class='form-control'></td>" + 
            "<td><input type='date' id='inputFecEntrega' class='form-control' onchange='hallarEstadoImplementacion(0)'></td>" +
	    "<td id='trabent0'>...</td>" +
	    "<td>...</td>" + 
	    "<td>...</td>" + 
	    "<td>...</td>" + 
	    "<td id='estadoEpp0'>...</td>" +
	 "</tr>");
		
      entregaEppId = 0;
		
      $("#btnCancelarProg").show();$("#btnAgregarProg").hide();$("#btnEliminarProg").hide();
      $("#btnGuardarProg").show();$("#btnGenReporte").hide();$("#btnClipTablaProgramacion").hide();
      $("#btnUploadEntregas").hide();
		
      crearSelectOneMenuObligUnitarioCompleto("selRespTrabEntrega","",listTrabajadoresResponsables,
         "trabajadorId","nombre","#trabent"+entregaEppId,"Seleccionar Responsable")
		
      banderaEdicion2 = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarProgCap(){
   cargarModalProgCap();
}

function eliminarProgCap(){
   $("#mdProgFecha").modal("hide");
	
   mensajeUx="<label>¿Está seguro de eliminar este registro Entrega " +
   	     "de Epp's seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarEntregaEpp");
	
   $("#btnDevolverValorEliminarEntregaEpp").on("click",function(){
      var dataParam={
         entregaEppId: entregaEppId,
      };
		
      callAjaxPost(URL+'/equiposeguridad/entrega/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
	       mensajeUx="<label>El registro Entrega de EPP's fue eliminado con éxito.<label>";
	       mensajesUx(mensajeUx,1,"","ActualizarEntregaEpp");
			     
	       $("#modalMensajeUxActualizarEntregaEpp").on("hidden.bs.modal",function(){
	          $("#mdProgFecha").modal("show");
		  cargarModalProgCap();
	       });
			    
	       break;
				  
	    default:
	       alert("Ocurrió un error al eliminar la programacion!");
         }
      });
   });
   
   $("#btnRegresarPrevioEliminarEntregaEpp").on("click",function(){
      $("#mdProgFecha").modal("show");   
   });
}

function guardarProgCap(){
//   $("#modalProg button:not(#btnClipTablaProgramacion)").hide();
	
   var campoVacio = true;
   
   var motivoEntregaId = $("#selMotivo").val();
   var horaPlanificada = $("#inputHora").val();
   var fechaEntrega = convertirFechaTexto($("#inputFecEntrega").val());
   var inputFechaEntrega = (!fechaEntrega?null:fechaEntrega);
   var fechaPlanificada = convertirFechaTexto($("#inputFecPlan").val());
   var inputFechaPlanificada = (!fechaPlanificada?null:fechaPlanificada);

   var trabajadorResponsableId = $("#selRespTrabEntrega").val();
   
   if(horaPlanificada == "" || inputFechaEntrega == null || inputFechaPlanificada == null){
      campoVacio = false; 
   }
	
   if(campoVacio){
      var dataParam={
         fechaEntrega: inputFechaEntrega,horaPlanificada: horaPlanificada,
	 trabajadorResponsable: {trabajadorId: trabajadorResponsableId},
	 fechaPlanificada: inputFechaPlanificada,entregaEppId: entregaEppId,
	 trabajadores: listTrabajadoresSeleccionados,estadoImplementacion: progEppEstado,
	 motivoId: motivoEntregaId,idCompany: sessionStorage.getItem("gestopcompanyid")
      };

      callAjaxPost(URL+'/equiposeguridad/entrega/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#mdProgFecha").modal("hide");	
		
	       mensajeUx="<label>El registro Entrega de EPP's fue guardado con éxito.<label>";
	       mensajesUx(mensajeUx,1,"","ActualizarEntregaEpp");
			     
	       $("#modalMensajeUxActualizarEntregaEpp").on("hidden.bs.modal",function(){
	          $("#mdProgFecha").modal("show");
		  cargarModalProgCap();
	       });
			
	       break;
					
	    default:
	       alert("Ocurrió un error al guardar la programacion!");
         }
      });
   }else{
      $("#mdProgFecha").modal("hide");	
      
      mensajeUx="<label>Debe ingresar la hora y fechas respectivas.<label>";
      mensajesUx(mensajeUx,2,"","ActualizarEntregaEpp"); 
	  
      $("#modalMensajeUxActualizarEntregaEpp").on("hidden.bs.modal",function(){
         $("#mdProgFecha").modal("show");
      });
   }
}

function cantidadEPPP(pentregaEppId){
	 	
}

function cargarEPPs(){
   $("#modalProg").hide();$("#modalTree").hide();$("#modalListEpp").show();
   
   resizeDivWrapper("wrapperEppEntregaEpp",200);
		
   $("#tblEppEntregaEpp tbody").html("");
		
   cancelarEppEntregaEpp();
		
   var dataParam={
      entregaEppId: entregaEppId,
      idCompany: getSession("gestopcompanyid")
   };

   callAjaxPost(URL+'/equiposeguridad/entrega/equiposeguridad',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listEquipos = data.list;
						
            listEquipos.forEach(function(val,index){
	       var textoTallas = "";
						    
	       val.tallas.forEach(function(val1,index1){
	          textoTallas += val1.nombre +"-"+val1.numTrabsTalla+"<br>";
	       });
						    
	       $("#tblEppEntregaEpp tbody").append(
	          "<tr>" +
		     "<td><button class='btn btn-danger' onclick='eliminarEppEntregaEpp("+val.id+")'>" +
			    "<i class='fa fa-trash'></i>" +
			 "</button></td>" +
		     "<td>"+val.equipoSeguridadNombre+"</td>" +
		     "<td>"+textoTallas+"</td>" +
		     "<td>"+val.cantidad+"</td>" +
	          "</tr>");
            });
							
            $("#tdlistEpp"+entregaEppId).html(
               "<a id='linkEpps' href='#' onclick='javascript:cargarEPPs();'>Lista de EPPs</a>");

	    break;
					
         default:
	    alert("Ocurrió un error al cargar los epps!");
      }
   });
}

function nuevoEppEntregaEpp(){
   $("#btnNuevoEppEntregaEpp").hide();
    
    
   $("#tblEppEntregaEpp tbody").prepend(
      "<tr id='trnuevoeppentrega'>" +
         "<td><button class='btn btn-info' onclick='cancelarEppEntregaEpp()'>" +
	        "<i class='fa fa-times'></i>" +
	     "</button>" +
	     "<button class='btn btn-success' onclick='guardarEppEntregaEpp()'>" +
	        "<i class='fa fa-floppy-o'></i>" +
	     "</button></td>" +
         "<td id='divSelEquipoEntregaEpp' > "+ ""+" </td>" +
	 "<td></td>" +
	 "<td>"+"<input class='form-control' type='number' id='inputCantidadEppEntrega'>"+"</td>" +
      "</tr>");
    
   crearSelectOneMenuObligUnitarioCompleto("selEquipoEntregaEpp","",listFullEquipos,
      "equipoSeguridadId","equipoSeguridadNombre","#divSelEquipoEntregaEpp");
}

function guardarEppEntregaEpp(){
   var equipoId = $("#selEquipoEntregaEpp").val();
   var cantidad = $("#inputCantidadEppEntrega").val();
    
   var dataParam={
      id: equipoId,cantidad: cantidad,entregaId: entregaEppId
   };
   
   callAjaxPost(URL+"/equiposeguridad/entrega/equipo/save",dataParam,function(data){
      cargarEPPs();
   });
}

function eliminarEppEntregaEpp(equipoId){
   var dataParam={
      id: equipoId 
   };
    
   callAjaxPost(URL+"/equiposeguridad/entrega/equipo/delete",dataParam,function(data){
      cargarEPPs();
   });
}

function cancelarEppEntregaEpp(){
   $("#btnNuevoEppEntregaEpp").show();
   $("#trnuevoeppentrega").remove();
}

function cancelarListEpp(){
   $("#modalProg").show();$("#modalTree").hide();$("#modalListEpp").hide();	
}

function cancelarSeleccionarTrabs(){
   $("#modalProg").show();$("#modalTree").hide();$("#modalListEpp").hide();
	
   var seleccionados = $('#jstree').jstree(true).get_checked();
	
   listTrabajadoresSeleccionados = [];
	
   for(index = 0;index < seleccionados.length;index++){
      var trab = seleccionados[index];
		
      if(seleccionados[index].substr(0,3) == "tra"){
         listTrabajadoresSeleccionados.push(seleccionados[index].substr(3,seleccionados[index].length));
      }
   }
}

function generarReporteEntrega(){
   if($("#inputFecEntrega").val()){
      window.open(URL+"/equiposeguridad/informe?entregaEppId="+entregaEppId,'_blank');	
   }else{
      alert("Asegúrese de haber ingresado una fecha de entrega, trabajadores y EPP´s ")
   }
}

function mostrarCargarImagen(progEquipoId){
   $('#mdUpload').modal('show');
   $('#btnUploadArchivo').attr("onclick","javascript:uploadArchivo("+progEquipoId+");");
}

function uploadArchivo(progEquipoId){
   $.blockUI({message: 'cargando...'});
	
   guardarEvidenciaAuto(progEquipoId,"fileEvi",bitsEvidenciaEPP,
   "/equiposeguridad/evidencia/save",function(){
      var inputFileImage = document.getElementById("fileEvi");
      var file = inputFileImage.files[0];
      $("#tdevi"+progEquipoId).html(file.name);
      $.unblockUI();
      $('#mdUpload').modal('hide');
   },"progEquipoId");	 
}

function hallarEstadoImplementacion(progId){
   var fechaPlanificada = $("#inputFecPlan").val();
   var fechaReal = $("#inputFecEntrega").val();
   var fechaHoy = obtenerFechaActual();
	
   if(fechaReal != ''){
      progEppEstado = 2;progEppEstadoNombre = "Completado";
   }else{
      if(fechaPlanificada != ""){
         var dif = restaFechas(fechaHoy,fechaPlanificada);
			
         if(dif < 0){
	    progEppEstado = 3;progEppEstadoNombre = "Retrasado";
	 }else{
	    progEppEstado = 1;progEppEstadoNombre = "Por implementar";
	 }
      }else{
         progEppEstado = 1;progEppEstadoNombre = "Por implementar";
      }
   }
	
   $("#estadoEpp"+progId).html(progEppEstadoNombre);	
}

function verCorreos(){	
   $("#modalCorreos").modal("show");$("#mdProgFecha").modal("hide");
}

function verRecomendacion(){
   $("#modalRecomendacion").modal("show");$("#mdProgFecha").modal("hide");
}

function importarDatosEntregas(){
   $("#btnGuardarNuevosEntrega").attr("onclick","javascript:guardarMasivoEntregaCopiaExcel();");
   $('#mdProgFecha').modal('hide');$('#mdImpDatosEntrega').modal('show');	
   
   $("#mdImpDatosEntrega").on("hidden.bs.modal",function(){
      $('#mdProgFecha').modal('show');
   });
}

function guardarMasivoEntregaCopiaExcel(){
   var texto = $("#txtListadoEntrega").val();
   var listExcelFinal = texto.split('\n');
   var listRecurso = [];
   var listEppRepe = [];
   var listFullNombres = "";
   var listExcel = [];
	
   listExcelFinal.forEach(function(val){
      if(val.length > 0){
         listExcel.push(val)
      }
   });
	
   var validado = "";
	
   if(texto.length < 100000){
      listExcel.every(function(val){
         var listCells = val.split('\t');
			
         if(validado.length < 1 && listCells.length != 7){
	    validado = "No coincide el numero de celdas. ("+listCells.length+" != 7)";
				
	    return false;
         }else{
	    var entrega = {};
				
	    listCells.forEach(function(val1,index1){
	       val1 = val1.trim();
					
	       switch(index1){
	          case 0:
		     var reconoceTrabEntrega = false;
						
		     listTrabajadoresResponsables.forEach(function(v){
		        if(v.dni.trim() == val1){
			   reconoceTrabEntrega = true;
			   entrega.trabajadorEntrega = {trabajadorId: v.trabajadorId}
			}
		     });
						
		     if(!reconoceTrabEntrega){
			validado = "Sin reconocer dni trabajador entrega "+index1+" - "+val1;
			return false;
		     }
						  
		     break;
					
	          case 1:
		     try{
			var fechaTexto = val1;
			var parts = fechaTexto.split('/');
			var dateNac = new Date(parts[2],parts[1] - 1,parts[0]);
			entrega.fechaPlanificada = dateNac;
		     }catch(err){
		        validado = "Error en el formato de fecha de planificada";
		        break;
		     }
						
		     break;
					
	          case 2:
		     entrega.horaPlanificada = getHoraFromAm(val1);
						
		     break;
					
	          case 3:
		     try{
			var fechaTexto = val1;
			var parts = fechaTexto.split('/');
			var dateNac = new Date(parts[2],parts[1] - 1,parts[0]);
			entrega.fechaEntrega = dateNac;
		     }catch(err){
		        validado = "Error en el formato de fecha de entrega";
			
		        break;
		     }
						
		     break;
					
	          case 4:
		     var reconoceTrab = false; 
						
		     listTrabajadoresResponsables.forEach(function(v){ 
		        if(v.trabajadorNombre.trim() == val1){
			   reconoceTrab = true;
			   entrega.trabajadorResponsable = {trabajadorId: v.trabajadorId}
		        }
		     });
						
		     if(!reconoceTrab){
			validado = "Sin reconocer resposanble "+index1+" - "+val1;
			return false;
	             }
						 
		     break;
					
	          case 5:
		     var reconoceEpp = false;
						
		     listEquiposEntrega.forEach(function(v){
		        if(v.equipoSeguridadNombre.trim() == val1){
			   reconoceEpp = true;
			   entrega.eppId = v.equipoSeguridadId;
		        }
		     });
						
		     if(!reconoceEpp){
			validado = "Sin reconocer epp "+index1+" - "+val1;
			return false;
	             }
						 
		     break;

	          case 6:
		     entrega.cantidad = parseInt(val1);
		     
		     break;
	       }
	    });
				 
	    entrega.motivoId = 5;
				
	    listRecurso.push(entrega);
				
	    return true;
         }
      });
   }else{
      validado = "Ha excedido los 100000 caracteres permitidos.";
   }
	
   if(validado.length < 1){
      var listFinalEntrega = [];
	
      listRecurso.forEach(function(val){
         var isNuevo = true;
			
         listFinalEntrega.forEach(function(val1){
            if(val1.trabajadorEntrega.trabajadorId == val.trabajadorEntrega.trabajadorId && 
               val1.horaPlanificada == val.horaPlanificada && val1.fechaEntrega.getTime() == val.fechaEntrega.getTime()){
	       val1.equiposObj.push({id: val.eppId,cantidad: val.cantidad});
	       isNuevo = false;
            }
         });
			
         if(isNuevo){
            listFinalEntrega.push(
	       {fechaPlanificada: val.fechaPlanificada,fechaEntrega: val.fechaEntrega,
		horaPlanificada: val.horaPlanificada,motivoId: val.motivoId,
		trabajadorEntrega: val.trabajadorEntrega,trabajadorResponsable: val.trabajadorResponsable,
		trabajadores: [val.trabajadorEntrega.trabajadorId],equiposObj: [{id: val.eppId,cantidad: val.cantidad}],
		estadoImplementacion: 2,idCompany: getSession("gestopcompanyid")});
         } 
      });
		
      var r = confirm("¿Está seguro que desea subir estas "+listFinalEntrega.length+" entregas(s)?");
		
      if(r == true){
         var dataParam={
	    listFinalEntrega: listFinalEntrega
	 };
			
         callAjaxPost(URL+'/equiposeguridad/entrega/masivo/save',listFinalEntrega,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
		  alert("Se guardaron exitosamente.");
		  programarFecha();
		  $('#mdImpDatosEntrega').modal('hide');
					
		  break;
				
	       default:
		  alert("Ocurri&oacute; un error al guardar los epps!");
            }
         });
      }
   }else{
      alert(validado);
   }
}

function getHoraFromAm(time){
   var hours = Number(time.match(/^(\d+)/)[1]);
   var minutes = Number(time.match(/:(\d+)/)[1]);
   var AMPM = time.match(/\s(.*)$/)[1];
	
   if(AMPM == "PM" && hours < 12) 
      hours = hours+12;
	
   if(AMPM == "AM" && hours == 12) 
      hours = hours-12;
	
   var sHours = hours.toString();
   var sMinutes = minutes.toString();
	
   if(hours < 10) 
      sHours = "0" + sHours;
	
   if(minutes < 10) 
      sMinutes = "0" + sMinutes;
	
   return (sHours + ":" + sMinutes +":00");
}

var progEntregaEppId,progEntregaEppObj={};
var banderaEdicionProgEntregaEpp = false;
var listFullProgEppBuscador = [];
var busquedaActivaProgEntregaEpp,numPaginaActualProgEntregaEpp;

function ocultarFiltroProgEntregaEpp(){
    $("#modalFiltroProgEntregaEpp").modal("hide");$("#modalConsolidadoProgEntregEpp").modal("show");
}

function verFiltroProgEntregaEpp(){
    $("#modalConsolidadoProgEntregEpp").modal("hide");$("#modalFiltroProgEntregaEpp").modal("show");
}

function crearFiltroProgEntregaEpp(){
    $("#modalFiltroProgEntregaEpp").remove();

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",label:"<span style='font-size:20px;font-weight:bolder;'>Fecha planificada</span>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioFiltroProgEntregaEpp' class='form-control'>"},
        {sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinFiltroProgEntregaEpp' class='form-control'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroProgEntregaEpp()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='submit' onclick='valoresFiltroProgEntregaEpp()' style='float:right;font-size:18px;'>" +
                       "<i class='fa fa-filter'></i> Aplicar" +
                   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalFiltroProgEntregaEpp",nombre:"<i class='fa fa-filter'></i> Filtros",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    var hoy = getSession("fechaHoyOrdenInversoTexto");
    var inicioDias = -365,finDias = 90;

    $("#fechaInicioFiltroProgEntregaEpp").val(sumaFechaDias(-365,hoy));
    $("#fechaFinFiltroProgEntregaEpp").val(sumaFechaDias(finDias,hoy));

    valoresFiltroProgEntregaEpp();
}

function valoresFiltroProgEntregaEpp(){
    ocultarFiltroProgEntregaEpp();

    verConsolidadoProgramacionEntregaEpp();
}

function ocultarProgramacionEntregaEpp(){
    $("#modalConsolidadoProgEntregEpp").modal("hide");
}

function verConsolidadoProgramacionEntregaEpp(){
    $("#modalConsolidadoProgEntregEpp").remove();

    var contenido = "";

    var buttonVolver =
        "<button type='button' id='btnOcultarProgEntregEpp' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarProgramacionEntregaEpp()' title='Regresar a la vista principal'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonNuevo =
        "<button id='btnNuevoProgEntregEpp' type='button' class='btn btn-success' style='margin-right:5px' " +
                "title='Registrar un nueva entrega EPP.' onclick='nuevoConsolidadoProgramacionEntregaEpp()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
        "</button>";

    var buttonCancelar =
        "<button id='btnCancelarProgEntregEpp' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='cancelarConsolidadoProgramacionEntregaEpp()' title='Cancelar'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button id='btnGuardarProgEntregEpp' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarConsolidadoProgramacionEntregaEpp()' title='Guardar'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonEliminar =
        "<button id='btnEliminarProgEntregEpp' type='button' class='btn btn-danger' style='margin-right:5px' " +
                "title='Eliminar.' onclick='eliminarConsolidadoProgramacionEntregaEpp()'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    var buttonClipboard =
        "<button id='btnClipboardProgEntregEpp' type='button' class='clipGosst btn btn-success' title='Copiar todos los registros " +
                "actuales pertenecientes al consolidado' style='margin-right:5px' onclick='obtenerTablaClipboardConsolidadoProgramacionEntregaEpp()'>" +
            "<i class='fa fa-clipboard fa-2x'></i>" +
        "</button>";

    var buttonFiltro =
        "<button id='btnFiltroProgEntregEpp' type='button' onclick='verFiltroProgEntregaEpp()' "+
                "style='margin-right:5px' title='Filtro' class='btn btn-success'>"+
            "<i class='fa fa-filter fa-2x'></i>"+
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaParcialAux' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaProgEntregEpp'><img src='../imagenes/flecha_01.png' /></a>" +
            " <em id='labelFlechasProgEntregEpp'></em> " +
            "<a id='flechaDerechaProgEntregEpp'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorProgEntregEpp' type='button' class='btn btn-success' " +
                "title='Refresh' onclick='reiniciarBuscadorConsolidadoProgramacionEntregaEpp()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorProgEntregEpp' type='button' class='btn btn-success' onclick='aplicarBuscadorConsolidadoProgramacionEntregaEpp()' " +
                "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° documento, nombre o apellido " +
                "del Responsable de la entrega y/o Trabajador(a) con las palabras ingresadas.'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorProgEntregEpp' placeholder='N° documento, nombre o apellido' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoProgEntregEpp",
        nombre:"<i class='fa fa-table'></i> Consolidado 'Entrega de Equipos de Protección Personal (EPP)'",
        contenido:
            "<form class='form-inline'>" +
                 buttonVolver+buttonCancelar+buttonNuevo+buttonGuardar+buttonEliminar+buttonClipboard+buttonFiltro+buttonFlechas+buscadorOpciones +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoProgEntregEpp'>" +
                "<table id='tblConsolidadoProgEntregEpp' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:220px'>Motivo</td>" +
                            "<td class='tb-acc' style='width:170px'>Fecha Planificada</td>" +
                            "<td class='tb-acc' style='width:150px'>Hora Planificada</td>" +
                            "<td class='tb-acc' style='width:170px'>Fecha de entrega</td>" +
                            "<td class='tb-acc' style='width:400px'>Responsable de la entrega</td>" +
                            "<td class='tb-acc' style='width:120px'>N° de EPP's</td>" +
                            "<td class='tb-acc' style='width:400px'>Trabajador(a)</td>" +
                            "<td class='tb-acc' style='width:350px'>Evidencia</td>" +
                            "<td class='tb-acc' style='width:200px'>Estado</td>" +
                            "<td class='tb-acc' style='width:200px'>Registrado el</td>" +
                            "<td class='tb-acc' style='width:200px'>Actualizado el</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoProgEntregEpp",215);
    cargarConsolidadoProgramacionEntregaEpp();

    $("#flechaIzquierdaProgEntregEpp").on('click',function(){
        numPaginaActualProgEntregaEpp = numPaginaActualProgEntregaEpp-1;
        cambiarPaginaConsolidadoProgramacionEntregaEpp();
    });

    $('#flechaDerechaProgEntregEpp').on('click',function(){
        numPaginaActualProgEntregaEpp = numPaginaActualProgEntregaEpp+1;
        cambiarPaginaConsolidadoProgramacionEntregaEpp();
    });
}

function cargarConsolidadoProgramacionEntregaEpp(){
    busquedaActivaProgEntregaEpp = 0,numPaginaActualProgEntregaEpp = 1;banderaEdicionProgEntregaEpp = false;
    $("#valBuscarValorProgEntregEpp").val("");

    $("#btnOcultarProgEntregEpp").show();$("#btnCancelarProgEntregEpp").hide();$("#btnGuardarProgEntregEpp").hide();
    $("#btnNuevoProgEntregEpp").show();$("#btnEliminarProgEntregEpp").hide();$("#btnClipboardProgEntregEpp").show();
    $("#btnFiltroProgEntregEpp").show();$("#indicadorPaginaParcialAux").show();$("#btnResetBuscadorProgEntregEpp").show();
    $("#btnAplicarBuscadorProgEntregEpp").show();$("#valBuscarValorProgEntregEpp").show();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),fechaPlanificadaInicioFiltro:$("#fechaInicioFiltroProgEntregaEpp").val(),
        fechaPlanicicadaFinFiltro:$("#fechaFinFiltroProgEntregaEpp").val()
    };

    callAjaxPostSimpleVersionDos(1,URL+'/equiposeguridad/entrega/vista_admin',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            listaFullProgEpp = data.listFullProgramacionEpp;

            cambiarPaginaConsolidadoProgramacionEntregaEpp();

            goheadfixedY("#tblConsolidadoProgEntregEpp","#wrapperConsolidadoProgEntregEpp");
            formatoCeldaSombreableTabla(true,"tblConsolidadoProgEntregEpp");
        }else{
            console.log("Error al cargar el consolidado 'Entrega de Equipos de Protección Personal (EPP)'");
        }

    });
}

function cambiarPaginaConsolidadoProgramacionEntregaEpp(){
    $("#flechaIzquierdaProgEntregEpp").show();$("#flechaDerechaProgEntregEpp").show();

    var list = (busquedaActivaProgEntregaEpp == 0?listaFullProgEpp:listFullProgEppBuscador);
    var totalSize = list.length;
    var partialSize = 100;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualProgEntregaEpp*partialSize)-partialSize;
    var finRegistro = (numPaginaActualProgEntregaEpp*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasProgEntregEpp").html("<label>"+numPaginaActualProgEntregaEpp+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualProgEntregaEpp == 1){
        $("#flechaIzquierdaProgEntregEpp").hide();
    }

    if(numPaginaActualProgEntregaEpp == numPaginaTotal){
        $("#flechaDerechaProgEntregEpp").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblConsolidadoProgEntregEpp tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre),
                responsableEntregaNombre = (val.trabajadorResponsable.nombre.length == 0?"------":val.trabajadorResponsable.nombre),
                trabajadorEntregaNombre = (val.trabajadorEntregaNombre.length == 0?"------":val.trabajadorEntregaNombre),
                fechaRegistro = val.fechaRegistroTexto+(val.usuarioRegistro.nombre.length == 0?"":"<br>(Por "+val.usuarioRegistro.nombre+")"),
                fechaActualizacion = val.fechaActualizacionTexto+(val.usuarioActualizacion.nombre.length == 0?"":"<br>(Por "+val.usuarioActualizacion.nombre+")");

            $("#tblConsolidadoProgEntregEpp tbody").append(
                "<tr id='trConsProgEntregEpp"+val.entregaEppId+"' onclick='editarConsolidadoProgramacionEntregaEpp("+index+")'>" +
                    "<td id='motivoProgEntregEpp"+val.entregaEppId+"'>"+val.motivoNombre+"</td>" +
                    "<td id='fechaPlanProgEntregEpp"+val.entregaEppId+"'>"+val.fechaPlanificadaTexto+"</td>" +
                    "<td id='horaPlanProgEntregEpp"+val.entregaEppId+"'>"+val.horaPlanificadaTexto+"</td>" +
                    "<td id='fechaRealProgEntregEpp"+val.entregaEppId+"'>"+val.fechaEntregaTexto+"</td>" +
                    "<td id='nomRespProgEntregEpp"+val.entregaEppId+"'>"+responsableEntregaNombre+"</td>" +
                    "<td id='numEppsProgEntregEpp"+val.entregaEppId+"'>"+val.numeroEquipos+"</td>" +
                    "<td id='nomTrabProgEntregEpp"+val.entregaEppId+"'>"+trabajadorEntregaNombre+"</td>" +
                    "<td id='eviProgEntregEpp"+val.entregaEppId+"'>"+evidenciaNombre+"</td>" +
                    "<td id='estadoProgEntregEpp"+val.entregaEppId+"'>"+val.estadoImplementacionNombre+"</td>" +
                    "<td id='fechaRegProgEntregEpp"+val.entregaEppId+"'>"+fechaRegistro+"</td>" +
                    "<td id='fechaActProgEntregEpp"+val.entregaEppId+"'>"+fechaActualizacion+"</td>" +
                "</tr>");
        }
    });

    $.unblockUI();
}

function cancelarConsolidadoProgramacionEntregaEpp(){
    cargarConsolidadoProgramacionEntregaEpp();
}

function editarConsolidadoProgramacionEntregaEpp(pindex){
    if(!banderaEdicionProgEntregaEpp){
        formatoCeldaSombreableTabla(false,"tblConsolidadoProgEntregEpp");
        progEntregaEppObj = (busquedaActivaProgEntregaEpp == 0?listaFullProgEpp[pindex]:listFullProgEppBuscador[pindex]);
        progEntregaEppId = progEntregaEppObj.entregaEppId;

        $("#trConsProgEntregEpp"+progEntregaEppId).addClass("fila-edicion");

        var selMotivo = crearSelectOneMenuOblig("selMotivo","",listMotivos,progEntregaEppObj.motivoId,"motivoId","motivoNombre");
        $("#motivoProgEntregEpp"+progEntregaEppId).html(selMotivo);

        $("#fechaPlanProgEntregEpp"+progEntregaEppId).html("<input id='inputFechaPlanifProgEntregaEpp' type='date' class='form-control'>");
        $("#inputFechaPlanifProgEntregaEpp").val(convertirFechaInput(progEntregaEppObj.fechaPlanificada));

        $("#horaPlanProgEntregEpp"+progEntregaEppId).html("<input id='inputHoraProgEntregaEpp' type='time' value='12:00:00' class='form-control'>");
        $("#inputHoraProgEntregaEpp").val(progEntregaEppObj.horaPlanificada);

        $("#fechaRealProgEntregEpp"+progEntregaEppId).html("<input id='inputFechaRealProgEntregaEpp' type='date' class='form-control'>");
        $("#inputFechaRealProgEntregaEpp").val(convertirFechaInput(progEntregaEppObj.fechaEntrega));

        $("#nomRespProgEntregEpp"+progEntregaEppId).html("<input id='inputResponsableProgEntregaEpp' class='form-control' type='text'>" +
            "<div id='divAutoCompletarResponsableProgEntregaEpp'></div>" +
            "<label>*Buscar responsable por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>");
        $("#inputResponsableProgEntregaEpp").val(progEntregaEppObj.trabajadorResponsable.nombre);

        $("#numEppsProgEntregEpp"+progEntregaEppId).addClass("linkGosst").on("click",function(){
            verConsolidadoEppEntregadoTrabajador();
        }).html(progEntregaEppObj.numeroEquipos+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

        $("#nomTrabProgEntregEpp"+progEntregaEppId).html("<input id='inputTrabajadorProgEntregaEpp' class='form-control' type='text'>" +
            "<div id='divAutoCompletarTrabajadorProgEntregaEpp'></div>" +
            "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>");
        $("#inputTrabajadorProgEntregaEpp").val(progEntregaEppObj.trabajadorEntregaNombre);

        var options={
            container:"#eviProgEntregEpp"+progEntregaEppId,functionCall:function(){
                validacionSubirEvidencia("ProgEntregEpp"+progEntregaEppId,bitsEvidenciaExamen,"modalConsolidadoProgEntregEpp");
            },descargaUrl:"/equiposeguridad/evidencia?progEquipoId="+progEntregaEppId,
            esNuevo:(progEntregaEppObj.evidenciaNombre.length == 0?true:false),idAux:"ProgEntregEpp"+progEntregaEppId,
            evidenciaNombre:progEntregaEppObj.evidenciaNombre,mensajeAux:"(Opcional)"
        };

        crearFormEvidenciaCompleta(options);

        $("#estadoProgEntregEpp"+progEntregaEppId).html("<label>*Automático.</label>");
        $("#fechaActProgEntregEpp"+progEntregaEppId).html("<label>*Automático.</label>");

        buscarResponsableProgEntregaEpp();buscarTrabajadorProgEntregaEpp();

        banderaEdicionProgEntregaEpp = true;

        $("#btnOcultarProgEntregEpp").hide();$("#btnCancelarProgEntregEpp").show();$("#btnGuardarProgEntregEpp").show();
        $("#btnNuevoProgEntregEpp").hide();$("#btnEliminarProgEntregEpp").show();$("#btnClipboardProgEntregEpp").hide();
        $("#btnFiltroProgEntregEpp").hide();$("#indicadorPaginaParcialAux").hide();$("#btnResetBuscadorProgEntregEpp").hide();
        $("#btnAplicarBuscadorProgEntregEpp").hide();$("#valBuscarValorProgEntregEpp").hide();
    }
}

function nuevoConsolidadoProgramacionEntregaEpp(){
    if(!banderaEdicionProgEntregaEpp){
        formatoCeldaSombreableTabla(false,"tblConsolidadoProgEntregEpp");
        progEntregaEppObj = {entregaEppId: 0};progEntregaEppId = 0;

        var selMotivo = crearSelectOneMenuOblig("selMotivo","",listMotivos,"","motivoId","motivoNombre");

        $("#tblConsolidadoProgEntregEpp tbody").prepend(
            "<tr>" +
                "<td>"+selMotivo+"</td>" +
                "<td>"+"<input id='inputFechaPlanifProgEntregaEpp' type='date' class='form-control'>"+"</td>" +
                "<td>"+"<input id='inputHoraProgEntregaEpp' type='time' value='12:00:00' class='form-control'>"+"</td>" +
                "<td>"+"<input id='inputFechaRealProgEntregaEpp' type='date' class='form-control'>"+"</td>" +
                "<td>"+"<input id='inputResponsableProgEntregaEpp' class='form-control' type='text'>" +
                       "<div id='divAutoCompletarResponsableProgEntregaEpp'></div>" +
                       "<label>*Buscar responsable por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"+"</td>" +
                "<td><label>...</label></td>" +
                "<td>"+"<input id='inputTrabajadorProgEntregaEpp' class='form-control' type='text'>" +
                       "<div id='divAutoCompletarTrabajadorProgEntregaEpp'></div>" +
                       "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"+"</td>" +
                "<td id='eviProgEntregEpp0'></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>*Automático.</label></td>" +
                "<td><label>...</label></td>" +
            "</tr>");

        buscarResponsableProgEntregaEpp();buscarTrabajadorProgEntregaEpp();

        var options={
            container:"#eviProgEntregEpp"+progEntregaEppId,functionCall:function(){
                validacionSubirEvidencia("ProgEntregEpp"+progEntregaEppId,bitsEvidenciaExamen,"modalConsolidadoProgEntregEpp");
            },descargaUrl:"",esNuevo:true,idAux:"ProgEntregEpp"+progEntregaEppId,evidenciaNombre:"",mensajeAux:"(Opcional)"
        };

        crearFormEvidenciaCompleta(options);

        $("#btnOcultarProgEntregEpp").hide();$("#btnCancelarProgEntregEpp").show();$("#btnGuardarProgEntregEpp").show();
        $("#btnNuevoProgEntregEpp").hide();$("#btnEliminarProgEntregEpp").hide();$("#btnClipboardProgEntregEpp").hide();
        $("#btnFiltroProgEntregEpp").hide();$("#indicadorPaginaParcialAux").hide();$("#btnResetBuscadorProgEntregEpp").hide();
        $("#btnAplicarBuscadorProgEntregEpp").hide();$("#valBuscarValorProgEntregEpp").hide();

        banderaEdicionProgEntregaEpp = true;
    }else{
        alert("Guarde primero.");
    }
}

var listRespBuscadorProgEntregaEppAux = [];

function buscarResponsableProgEntregaEpp(){
    var nombre = $("#inputResponsableProgEntregaEpp").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listRespBuscadorProgEntregaEppAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selResponsableProgEntregaEpp = crearSelectOneMenuOblig("selResponsableProgEntregaEpp",
                "",listRespBuscadorProgEntregaEppAux,"","trabajadorId","nombre");

            $("#divAutoCompletarResponsableProgEntregaEpp").html(selResponsableProgEntregaEpp);
            $("#inputResponsableProgEntregaEpp").attr("onkeyup","buscarResponsableProgEntregaEpp()");
        });
    }else{
        listRespBuscadorProgEntregaEppAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selResponsableProgEntregaEpp = crearSelectOneMenuOblig("selResponsableProgEntregaEpp",
            "",listRespBuscadorProgEntregaEppAux,"","trabajadorId","nombre");

        $("#divAutoCompletarResponsableProgEntregaEpp").html(selResponsableProgEntregaEpp);
        $("#inputResponsableProgEntregaEpp").attr("onkeyup","buscarResponsableProgEntregaEpp()");
    }
}

var listTrabBuscadorProgEntregaEppAux = [];

function buscarTrabajadorProgEntregaEpp(){
    var nombre = $("#inputTrabajadorProgEntregaEpp").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listTrabBuscadorProgEntregaEppAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selTrabajadorProgEntregaEpp = crearSelectOneMenuOblig("selTrabajadorProgEntregaEpp",
                "",listTrabBuscadorProgEntregaEppAux,"","trabajadorId","nombre");

            $("#divAutoCompletarTrabajadorProgEntregaEpp").html(selTrabajadorProgEntregaEpp);
            $("#inputTrabajadorProgEntregaEpp").attr("onkeyup","buscarTrabajadorProgEntregaEpp()");
        });
    }else{
        listTrabBuscadorProgEntregaEppAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selTrabajadorProgEntregaEpp = crearSelectOneMenuOblig("selTrabajadorProgEntregaEpp",
            "",listTrabBuscadorProgEntregaEppAux,"","trabajadorId","nombre");

        $("#divAutoCompletarTrabajadorProgEntregaEpp").html(selTrabajadorProgEntregaEpp);
        $("#inputTrabajadorProgEntregaEpp").attr("onkeyup","buscarTrabajadorProgEntregaEpp()");
    }
}

function guardarConsolidadoProgramacionEntregaEpp(){
    var campoVacio = true;

    var motivoEntregaId = $("#selMotivo").val();
    var fechaPlanificada = convertirFechaTexto($("#inputFechaPlanifProgEntregaEpp").val());
    var inputFechaPlanificada = (!fechaPlanificada?null:fechaPlanificada);
    var horaPlanificada = $("#inputHoraProgEntregaEpp").val();
    var fechaReal = convertirFechaTexto($("#inputFechaRealProgEntregaEpp").val());
    var inputFechaReal = (!fechaReal?null:fechaReal);
    var responsableEntregaId = $("#selResponsableProgEntregaEpp").val();
    var trabajadorEntregaId = $("#selTrabajadorProgEntregaEpp").val();
    var inputEvidencia = $("#inputEviProgEntregEpp"+progEntregaEppId).val();

    if(motivoEntregaId == -1 || inputFechaPlanificada == null || responsableEntregaId == -1 || trabajadorEntregaId == -1){
        campoVacio = false;mensajeUx="<label>Debe ingresar la fecha planificada y los trabajadores respectivos.<label>";
    }else if(inputEvidencia == "VOLVER A SUBIR"){
        campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }

    if(campoVacio){
        var listTrabajadoresSeleccionados = [trabajadorEntregaId];
        var fechaPlanificadaAux = $("#inputFechaPlanifProgEntregaEpp").val(),fechaRealAux = $("#inputFechaRealProgEntregaEpp").val();
        var progEppEstado = (fechaRealAux != ''?2:(fechaPlanificadaAux != '' && restaFechas(obtenerFechaActual(),fechaPlanificadaAux) < 0?3:1));

        var dataParam={
            entregaEppId:progEntregaEppId,motivoId:motivoEntregaId,fechaPlanificada:inputFechaPlanificada,horaPlanificada:horaPlanificada,
            fechaEntrega:inputFechaReal,trabajadorResponsable:{trabajadorId:responsableEntregaId},trabajadores:listTrabajadoresSeleccionados,
            estadoImplementacion:progEppEstado,idCompany:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPost(URL+'/equiposeguridad/entrega/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    guardarEvidenciaAuto(data.nuevoId,"fileEviProgEntregEpp"+progEntregaEppId,bitsEvidenciaExamen,"/equiposeguridad/evidencia/save",function(){
                        $("#modalConsolidadoProgEntregEpp").modal("hide");

                        mensajeUx = "<label>El registro entrega EPP fue guardado con éxito.</label>";
                        mensajesUx(mensajeUx,1,"","ActualizarProgEntregaEpp");

                        $("#modalMensajeUxActualizarProgEntregaEpp").on("hidden.bs.modal",function(){
                            $("#modalConsolidadoProgEntregEpp").modal("show");cargarConsolidadoProgramacionEntregaEpp();
                        });
                    },"progEquipoId");

                    break;

                default:
                    alert("Ocurrió un error al guardar la entrega EPP!");
            }
        });
    }else{
        $("#modalConsolidadoProgEntregEpp").modal("hide");

        mensajesUx(mensajeUx,2,"","ValidacionProgEntregaEpp");

        $("#modalMensajeUxValidacionProgEntregaEpp").on("hidden.bs.modal",function(){
            $("#modalConsolidadoProgEntregEpp").modal("show");
        });
    }
}

function eliminarConsolidadoProgramacionEntregaEpp(){
    $("#modalConsolidadoProgEntregEpp").modal("hide");

    mensajeUx="<label>¿Está seguro de eliminar el registro entrega EPP seleccionado?</label>";
    mensajesUx(mensajeUx,3,"","ConfProgEntregaEpp");

    $("#btnDevolverValorConfProgEntregaEpp").on("click",function(){
        var dataParam={
            entregaEppId:progEntregaEppId
        };

        callAjaxPost(URL+'/equiposeguridad/entrega/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    mensajeUx="<label>El registro entrega EPP seleccionado se ha eliminado " +
                        "correctamente.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarVistaAdmProgEntregaEpp");

                    $("#modalMensajeUxActualizarVistaAdmProgEntregaEpp").on("hidden.bs.modal",function(){
                        $("#modalConsolidadoProgEntregEpp").modal("show");cargarConsolidadoProgramacionEntregaEpp();
                    });
                    break;

                default:
                    alert("Ocurrió un error al eliminar el registro entrega EPP!");
            }
        });
    });

    $("#btnRegresarPrevioConfProgEntregaEpp").on("click",function(){
        $("#modalConsolidadoProgEntregEpp").modal("show");
    });
}

function aplicarBuscadorConsolidadoProgramacionEntregaEpp(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valBuscarValorProgEntregEpp = igualarStringBuscar($("#valBuscarValorProgEntregEpp").val());
    listFullProgEppBuscador = [];busquedaActivaProgEntregaEpp = 1;numPaginaActualProgEntregaEpp = 1;

    listaFullProgEpp.forEach(function(val,index){
        if(igualarStringBuscar(val.trabajadorResponsable.nombre).indexOf(valBuscarValorProgEntregEpp) != -1 ||
            igualarStringBuscar(val.trabajadorEntregaNombre).indexOf(valBuscarValorProgEntregEpp) != -1){
            listFullProgEppBuscador.push(val);
        }
    });

    cambiarPaginaConsolidadoProgramacionEntregaEpp();
}

function reiniciarBuscadorConsolidadoProgramacionEntregaEpp(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarValorProgEntregEpp").val("").focus();
    busquedaActivaProgEntregaEpp = 0;numPaginaActualProgEntregaEpp = 1;

    cambiarPaginaConsolidadoProgramacionEntregaEpp();
}

function obtenerTablaClipboardConsolidadoProgramacionEntregaEpp(){
    var texto = obtenerDatosTablaEstandar("tblConsolidadoProgEntregEpp");
    copiarAlPortapapeles(texto,"tblConsolidadoProgEntregEpp");

    $("#modalConsolidadoProgEntregEpp").modal("hide");

    mensajeUx="<label>Los registros del consolidado se copiaron en el clipboard.</label>";
    mensajesUx(mensajeUx,1,"","CopiarTabla");

    $("#modalMensajeUxCopiarTabla").on("hidden.bs.modal",function(){
        $("#modalConsolidadoProgEntregEpp").modal("show");
    });
}

var entregaEppTrabId,entregaEppTrabObj={},actualizarTblConsProgEntregEpp;
var banderaEdicionEppEntregadoTrab = false;

function ocultarConsolidadoEppEntregadoTrabajador(){
    $("#modalConsolidadoEppEntregadoTrab").modal("hide");$("#modalConsolidadoProgEntregEpp").modal("show");

    if(actualizarTblConsProgEntregEpp == 1){
        cargarConsolidadoProgramacionEntregaEpp();
    }
}

function verConsolidadoEppEntregadoTrabajador(){
    $("#modalConsolidadoProgEntregEpp").modal("hide");$("#modalConsolidadoEppEntregadoTrab").remove();

    actualizarTblConsProgEntregEpp = 0;

    var contenido = "";

    var buttonVolver =
        "<button type='button' id='btnOcultarEppEntregadoTrab' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoEppEntregadoTrabajador()' title='Regresar a la vista anterior'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonNuevo =
        "<button id='btnNuevoEppEntregadoTrab' type='button' class='btn btn-success' style='margin-right:5px' " +
                "title='Registrar un nueva entrega EPP.' onclick='nuevoConsolidadoEppEntregadoTrabajador()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
        "</button>";

    var buttonCancelar =
        "<button id='btnCancelarEppEntregadoTrab' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='cancelarConsolidadoEppEntregadoTrabajador()' title='Cancelar'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button id='btnGuardarEppEntregadoTrab' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarConsolidadoEppEntregadoTrabajador()' title='Guardar'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonEliminar =
        "<button id='btnEliminarEppEntregadoTrab' type='button' class='btn btn-danger' style='margin-right:5px' " +
                "title='Eliminar.' onclick='eliminarConsolidadoEppEntregadoTrabajador()'>" +
            "<i class='fa fa-times fa-2x'></i>" +
        "</button>";

    var modalOptions={
        maxWidth:"50%",id:"modalConsolidadoEppEntregadoTrab",btnCerrarHabilitado:0,
        nombre:"<i class='fa fa-table'></i> Consolidado 'Equipo(s) de Protección Personal (EPP) entregado(s) a "+progEntregaEppObj.trabajadorEntregaNombre+"'",
        contenido:
            "<form class='form-inline'>" +
                 buttonVolver+buttonCancelar+buttonNuevo+buttonGuardar+buttonEliminar +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoEppEntregadoTrab'>" +
                "<table id='tblConsolidadoEppEntregadoTrab' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:300px'>Equipos de Protección Personal (EPP)</td>" +
                            "<td class='tb-acc' style='width:100px'>Talla</td>" +
                            "<td class='tb-acc' style='width:100px'>Cantidad</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoEppEntregadoTrab",215);
    cargarConsolidadoEppEntregadoTrabajador();
}

function cargarConsolidadoEppEntregadoTrabajador(){
    banderaEdicionEppEntregadoTrab = false;

    $("#btnOcultarEppEntregadoTrab").show();$("#btnCancelarEppEntregadoTrab").hide();$("#btnGuardarEppEntregadoTrab").hide();
    $("#btnNuevoEppEntregadoTrab").show();$("#btnEliminarEppEntregadoTrab").hide();

    var dataParam={
        entregaEppId:progEntregaEppId,idCompany:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/equiposeguridad/entrega/equiposeguridad',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            listEquipos = data.list;

            $("#tblConsolidadoEppEntregadoTrab tbody tr").remove();

            listEquipos.forEach(function(val,index){
                var textoTallas = "";

                val.tallas.forEach(function(val1,index1){
                    textoTallas += val1.nombre+"-"+val1.numTrabsTalla+"<br>";
                });

                $("#tblConsolidadoEppEntregadoTrab tbody").append(
                    "<tr id='trConsEppEntregTrab"+val.id+"' onclick='editarConsolidadoEppEntregadoTrabajador("+index+")'>" +
                        "<td id='equipoEppEntregTrab"+val.id+"'>"+val.equipoSeguridadNombre+"</td>" +
                        "<td id='tallaEppEntregTrab"+val.id+"'>"+textoTallas+"</td>" +
                        "<td id='cantidadEppEntregTrab"+val.id+"'>"+val.cantidad+"</td>" +
                    "</tr>");
            });

            goheadfixedY("#tblConsolidadoEppEntregadoTrab","#wrapperConsolidadoEppEntregadoTrab");
            formatoCeldaSombreableTabla(true,"tblConsolidadoEppEntregadoTrab");
        }else{
            console.log("Error al cargar el consolidado 'Equipos de Protección Personal (EPP) entregados a "+progEntregaEppObj.trabajadorEntregaNombre+"'");
        }
    });
}

function cancelarConsolidadoEppEntregadoTrabajador(){
    cargarConsolidadoEppEntregadoTrabajador();
}

function editarConsolidadoEppEntregadoTrabajador(pindex){
    if(!banderaEdicionEppEntregadoTrab){
        formatoCeldaSombreableTabla(false,"tblConsolidadoEppEntregadoTrab");
        entregaEppTrabObj = listEquipos[pindex];
        entregaEppTrabId = entregaEppTrabObj.id;

        $("#trConsEppEntregTrab"+entregaEppTrabId).addClass("fila-edicion");

        banderaEdicionEppEntregadoTrab = true;

        $("#btnOcultarEppEntregadoTrab").hide();$("#btnCancelarEppEntregadoTrab").show();$("#btnGuardarEppEntregadoTrab").hide();
        $("#btnNuevoEppEntregadoTrab").hide();$("#btnEliminarEppEntregadoTrab").show();
    }
}

function nuevoConsolidadoEppEntregadoTrabajador(){
    if(!banderaEdicionEppEntregadoTrab){
        formatoCeldaSombreableTabla(false,"tblConsolidadoEppEntregadoTrab");
        entregaEppTrabObj = {id: 0};entregaEppTrabId = 0;

        var selEquipoEntregaTrabEpp = crearSelectOneMenuOblig("selEquipoEntregaTrabEpp","",listFullEquipos,"","equipoSeguridadId","equipoSeguridadNombre");

        $("#tblConsolidadoEppEntregadoTrab tbody").prepend(
            "<tr>" +
                "<td>"+selEquipoEntregaTrabEpp+"</td>" +
                "<td>"+"<label>*Automático.</label>"+"</td>" +
                "<td>"+"<input id='inputCantidadEntregaTrabEpp' type='number' min='0' step='1' " +
                              "oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"+"</td>" +
            "</tr>");

        $("#inputCantidadEntregaTrabEpp").val(0);

        $("#btnOcultarEppEntregadoTrab").hide();$("#btnCancelarEppEntregadoTrab").show();$("#btnGuardarEppEntregadoTrab").show();
        $("#btnNuevoEppEntregadoTrab").hide();$("#btnEliminarEppEntregadoTrab").hide();

        banderaEdicionEppEntregadoTrab = true;
    }else{
        alert("Guarde primero.");
    }
}

function guardarConsolidadoEppEntregadoTrabajador(){
    var campoVacio = true;

    var equipoEntregaTrabEppId = $("#selEquipoEntregaTrabEpp").val();
    var cantidad = $("#inputCantidadEntregaTrabEpp").val();

    if(equipoEntregaTrabEppId == -1 || cantidad.length == 0){
        campoVacio = false;mensajeUx="<label>Debe completar los campos activos.<label>";
    }else if(parseInt(cantidad) == 0){
        campoVacio = false;mensajeUx="<label>La cantidad del EPP no puede ser 0.<label>";
    }

    if(campoVacio){
        var dataParam={
            id:equipoEntregaTrabEppId,cantidad:cantidad,entregaId:progEntregaEppId
        };

        callAjaxPost(URL+'/equiposeguridad/entrega/equipo/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalConsolidadoEppEntregadoTrab").modal("hide");

                    mensajeUx = "<label>El registro EPP entregado al trabajador(a) fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarEppEntregadoTrab");

                    $("#modalMensajeUxActualizarEppEntregadoTrab").on("hidden.bs.modal",function(){
                        $("#modalConsolidadoEppEntregadoTrab").modal("show");actualizarTblConsProgEntregEpp = 1;
                        cargarConsolidadoEppEntregadoTrabajador();
                    });

                    break;

                default:
                    alert("Ocurrió un error al guardar el EPP entregado al trabajador(a)!");
            }
        });
    }else{
        $("#modalConsolidadoEppEntregadoTrab").modal("hide");

        mensajesUx(mensajeUx,2,"","ValidacionEppEntregadoTrab");

        $("#modalMensajeUxValidacionEppEntregadoTrab").on("hidden.bs.modal",function(){
            $("#modalConsolidadoEppEntregadoTrab").modal("show");
        });
    }
}

function eliminarConsolidadoEppEntregadoTrabajador(){
    $("#modalConsolidadoEppEntregadoTrab").modal("hide");

    mensajeUx="<label>¿Está seguro de eliminar el registro EPP entregado al trabajador(a) seleccionado?</label>";
    mensajesUx(mensajeUx,3,"","ConfEppEntregadoTrab");

    $("#btnDevolverValorConfEppEntregadoTrab").on("click",function(){
        var dataParam={
            id:entregaEppTrabId
        };

        callAjaxPost(URL+'/equiposeguridad/entrega/equipo/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    mensajeUx="<label>El registro EPP entregado al trabajador(a) seleccionado se ha eliminado " +
                        "correctamente.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarVistaAdmEppEntregadoTrab");

                    $("#modalMensajeUxActualizarVistaAdmEppEntregadoTrab").on("hidden.bs.modal",function(){
                        $("#modalConsolidadoEppEntregadoTrab").modal("show");actualizarTblConsProgEntregEpp = 1;
                        cargarConsolidadoEppEntregadoTrabajador();
                    });
                    break;

                default:
                    alert("Ocurrió un error al eliminar el EPP entregado al trabajador(a)!");
            }
        });
    });

    $("#btnRegresarPrevioConfEppEntregadoTrab").on("click",function(){
        $("#modalConsolidadoEppEntregadoTrab").modal("show");
    });
}
