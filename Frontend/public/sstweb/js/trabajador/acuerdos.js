var acuerdoId;
var tipoGrupoId;
var fechaEntrega;
var banderaEdicion4;
var listEquipos;
var listTiposAcu;
var listEstados;
var listFullAcuerdos;
var acuerdoEstadoId;
var acuerdoEstadoNombre;
var gestionAccionMejoraId;

$(function(){ 
   $("#mdVerif").load("agregaraccionmejora.html");
	
   $("#btnClipTablaAcuerdo").on("click",function(){
      var listFullTablaProgramacion = ""; 
      listFullTablaProgramacion = obtenerDatosTablaEstandar("tblAcu");
      copiarAlPortapapeles(listFullTablaProgramacion,"btnClipTablaAcuerdo");
		
      alert("Se han guardado al clipboard la tabla Acuerdos" );
   });
	
   resizeDivWrapper("wrapper3",200);
});

var tablaFijaAcuerdo = false;
 
function cargarAcuerdosReunion(){
   $("#mdProgFecha .modal-body").hide();
   $("#mdProgFecha .modal-title")
   .html("<a onclick='volverGruposTrabajo()'>Grupo</a> > " +
         "<a onclick='volverReunionesGrupo()'>Reunión </a> > Acuerdos");
	
   $('#modalAcuerdo').show('slow',function(){
      cargarModalAcuerdoSeguridad();
   });	
}

function volverReuniones(){
   $("#modalReunion").show();
   $("#modalTrabsReu").hide();	
   $("#modalAcuerdo").hide();
}

function cargarModalAcuerdoSeguridad(){
   $("#btnVolverReuniones").attr("onclick","javascript:volverReuniones();");
   $("#btnAgregarAcuerdo").attr("onclick","javascript:nuevaAcuerdoSeguridad();");
   $("#btnCancelarAcuerdo").attr("onclick","javascript:cancelarAcuerdoSeguridad();");
   $("#btnGuardarAcuerdo").attr("onclick","javascript:guardarAcuerdoSeguridad();");
   $("#btnEliminarAcuerdo").attr("onclick","javascript:eliminarAcuerdoSeguridad();");
	
   $("#btnCancelarAcuerdo").hide();
   $("#btnAgregarAcuerdo").show();
   $("#btnEliminarAcuerdo").hide();
   $("#btnGuardarAcuerdo").hide();

   $("#modalReunion").hide();
   $("#modalTrabsReu").hide();
   
   $("#modalAcuerdo").show(500,function(){
      acuerdoId = 0;
      gestionAccionMejoraId = null;
      banderaEdicion4 = false;
      listFullAcuerdos = [];
		
      var dataParam={
	     reunionId: reunionId
		    };
      
      callAjaxPost(URL+'/trabajador/acuerdos',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       listTiposAcu = data.listTiposAcuerdo;
	       listFullAcuerdos = data.list;
				
	       $("#tblAcu tbody tr").remove();
				
	       listFullAcuerdos.forEach(function(val,index){
	          $("#tblAcu tbody")
		  .append("<tr id='tr"+val.id+"' onclick='javascript:editarAcuerdoSeguridad("+index+")'>" +
			     "<td id='tdtipoacu"+val.id+"'>"+val.tipo.nombre+"</td>" +
			     "<td id='tddescacu"+val.id+"'>"+(val.tipo.id != 1?val.descripcion:val.resumenAccion)+"</td>" +
			     "<td id='tdhallacu"+val.id+"'>"+(val.tipo.id != 1?val.hallazgo:"------")+"</td>" +
			     "<td id='tdrespacu"+val.id+"'>"+(val.tipo.id != 1?val.responsable:"------")+"</td>" +	
			     "<td id='tdfechaplaacu"+val.id+"'>"+(val.tipo.id != 1?val.fechaPlanificadaTexto:"------")+"</td>" +
			     "<td id='tdhoraplaacu"+val.id+"'>"+(val.tipo.id != 1?val.horaPlanificadaTexto:"------")+"</td>" +
			     "<td id='tdfecharealacu"+val.id+"'>"+(val.tipo.id != 1?val.fechaRealizadaTexto:"------")+"</td>" +
			     "<td id='tdinv"+val.id+"'>"+(val.tipo.id != 1?val.inversion:"------")+"</td>" +
			     "<td id='tdobsacu"+val.id+"'>"+(val.tipo.id != 1?val.observacion:"------")+"</td>" +
	                     "<td id='tdeviacu"+val.id+"'>"+(val.tipo.id != 1?val.evidenciaNombre:"------")+"</td>" +
			     "<td id='tdestadoacu"+val.id+"'>"+(val.tipo.id != 1?val.estado.estadoCumplientoNombre:
				                                                 val.estadoAccion.estadoCumplientoNombre)+"</td>" +
			  "</tr>");
	       });
				 
	       goheadfixedY('#tblAcu',"#wrapper3");
				
	       if(getSession("linkCalendarioAcuerdoId") != null){
		  listFullAcuerdos.every(function(val,index3){
		     if(val.id == parseInt(getSession("linkCalendarioAcuerdoId"))){
		        editarAcuerdoSeguridad(index3);
		        sessionStorage.removeItem("linkCalendarioAcuerdoId");
		        return false;
		     }else{
		        return true;
		     }
		  });
	       }
				
	       formatoCeldaSombreableTabla(true,"tblAcu");
	       break;
			
	    default:
	       alert("Ocurrió un error al traer las reuniones!");
         }
      });
   });	
}

function editarAcuerdoSeguridad(pindex){
   if(!banderaEdicion4){
      acuerdoId = listFullAcuerdos[pindex].id;
      
      var fechaPlanificada = listFullAcuerdos[pindex].fechaPlanificada;
      var fechaRealizada = listFullAcuerdos[pindex].fechaRealizada;
      var tipoId = listFullAcuerdos[pindex].tipo.id;
      var observaciones = listFullAcuerdos[pindex].observacion;
      var horaPlanificada = listFullAcuerdos[pindex].horaPlanificada;
      var descripcion = listFullAcuerdos[pindex].descripcion;
      var inversion = listFullAcuerdos[pindex].inversion;
      var respAcu = listFullAcuerdos[pindex].responsable;
		
      var funcAux = "javascript:cambiarAcordeTipoAcuerdo("+pindex+")";
		
      $("#tr"+acuerdoId).addClass("fila-edicion");
		
      formatoCeldaSombreableTabla(false,"tblAcu");
			
      var selMotivo = crearSelectOneMenu("selTipoAcu",funcAux,listTiposAcu,
	     tipoId,"id","nombre");
		
      $("#tdtipoacu"+acuerdoId).html(selMotivo);
		
      $("#tdobsacu"+acuerdoId)
      .html("<input type='text' id='inputObsAcu' class='form-control'>");
		
      $("#tddescacu"+acuerdoId)
      .html("<input type='text' id='inputDesc' class='form-control' style='width:361px;'>");
		
      $("#tdinv"+acuerdoId)
      .html("<input type='number' id='inputInv' class='form-control'>");
		
      $("#tdrespacu"+acuerdoId)
      .html("<input type='text' id='inputRespAcu' class='form-control'>");
		
      $("#tdfechaplaacu"+acuerdoId)
      .html("<input type='date' id='inputPlanAcu' class='form-control' onchange='hallarEstadoAcuerdo("+acuerdoId+")'>");
		
      $("#tdfecharealacu"+acuerdoId)
      .html("<input type='date' id='inputRealAcu' class='form-control' onchange='hallarEstadoAcuerdo("+acuerdoId+")'>");
		
      $("#tdhoraplaacu"+acuerdoId)
      .html("<input type='time' id='inputHoraPlaAcu' class='form-control'>");
	
      $("#inputObsAcu").val(observaciones);
      $("#inputDesc").val(descripcion);
      $("#inputInv").val(inversion);
      $("#inputRespAcu").val(respAcu);
      $("#inputPlanAcu").val(convertirFechaInput(fechaPlanificada));
      $("#inputRealAcu").val(convertirFechaInput(fechaRealizada));
      $("#inputHoraPlaAcu").val(horaPlanificada);
		
      var listNombresTrabs = listarStringsDesdeArray(listTrabajadoresReunion,"nombre");

      ponerListaSugerida("inputRespAcu",listNombresTrabs,true);
		
      var nombreEvidencia = listFullAcuerdos[pindex].evidenciaNombre;
		
      var options={
	     container: "#tdeviacu"+acuerdoId,
	     functionCall: function(){},
	     descargaUrl: "/trabajador/acuerdo/evidencia?acuerdoId="+acuerdoId,
	     esNuevo: false,
	     idAux: "Acuerdo",
	     evidenciaNombre:nombreEvidencia
		  };
      
      crearFormEvidenciaCompleta(options);
			
      banderaEdicion4 = true;
      $("#btnCancelarAcuerdo").show();
      $("#btnAgregarAcuerdo").hide();
      $("#btnEliminarAcuerdo").show();
      $("#btnGuardarAcuerdo").show();
		
      hallarEstadoAcuerdo(acuerdoId);
      cambiarAcordeTipoAcuerdo(pindex);
   }
}

function nuevaAcuerdoSeguridad(){        
   if(!banderaEdicion4){
      formatoCeldaSombreableTabla(false,"tblAcu");
		
      var selMotivo = crearSelectOneMenu("selTipoAcu","cambiarAcordeTipoAcuerdo()",
	     listTiposAcu,"","id","nombre");
		
      $("#tblAcu tbody")
      .append("<tr id='0'>" +
	         "<td>"+selMotivo+"</td>" +
	         "<td><input type='text' id='inputDesc' class='form-control'></td>" +
	         "<td><input type='text' id='inputHallAcu' class='form-control'></td>" +
	         "<td><input type='text' id='inputRespAcu' class='form-control'></td>" +
	         "<td><input type='date' id='inputPlanAcu' class='form-control' onchange='hallarEstadoAcuerdo(0)'></td>" +
	         "<td>"+"<input type='time' value='12:00:00' id='inputHoraPlaAcu' class='form-control'>"+"</td>" +
	         "<td><input type='date' id='inputRealAcu' class='form-control' onchange='hallarEstadoAcuerdo(0)'></td>" +
	         "<td><input type='number' id='inputInv' class='form-control'></td>" +
	         "<td><input type='text' id='inputObsAcu' class='form-control'></td>" +
	         "<td id='tdeviacu0'></td>" +
	         "<td id='tdestadoacu0'>...</td>" +
	      "</tr>");
		
      acuerdoId = 0;
			
      var options={
	     container: "#tdeviacu0",
	     functionCall: function(){},
	     descargaUrl: "",
	     esNuevo: true,
	     idAux: "Acuerdo",
	     evidenciaNombre: "" 
		  };
		
      crearFormEvidenciaCompleta(options);
		
      $("#btnCancelarAcuerdo").show();
      $("#btnAgregarAcuerdo").hide();
      $("#btnEliminarAcuerdo").hide();
      $("#btnGuardarAcuerdo").show();
	
      var listNombresTrabs = listarStringsDesdeArray(listTrabajadoresReunion,"nombre");
		
      ponerListaSugerida("inputRespAcu",listNombresTrabs,true);
		
      banderaEdicion4 = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarAcuerdoSeguridad(){
   cargarModalAcuerdoSeguridad();
}

function eliminarAcuerdoSeguridad() {
   var r = confirm("¿Está seguro de eliminar la reunión?");
	
   if(r == true){
      var dataParam={
	     id: acuerdoId
		    };

      callAjaxPost(URL+'/trabajador/acuerdo/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       cargarModalAcuerdoSeguridad();
	       break;
					
	    default:
	       alert("Para eliminar una acción de mejora, se debe eliminar desde " +
	       	     "el módulo Acción de Mejora.");
         }
      });
   }
}

function guardarAcuerdoSeguridad(){
   var campoVacio = true;
   var tipoId = $("#selTipoAcu").val();
    
   if(parseInt(tipoId) != 1){
      var inputObsAcu = $("#inputObsAcu").val();
      var inputPlanAcu = convertirFechaTexto($("#inputPlanAcu").val());
      var inputRealAcu = convertirFechaTexto($("#inputRealAcu").val());
       
      var horaPlan = $("#inputHoraPlaAcu").val();

      if(!$("#inputHoraPlaAcu").val()){		
         horaPlan = null;
      }
       
      if(tipoId == "-1" || inputPlanAcu == null){
         campoVacio=false;
      };
	
      var descripcion=$("#inputDesc").val();
      var inversion=$("#inputInv").val();
      var responsable=$("#inputRespAcu").val();
    //console.log(listTrabajadoresReunion);
      var trabajadorResponsableId=null;
      var tipoGrupoSeguridadId= $("#selTipo").val();
	
      listTrabajadoresReunion.every(function(val){
         if(val.nombre.trim().toUpperCase() == responsable.trim().toUpperCase()){
	    trabajadorResponsableId=val.trabajadorId;
	    return false;
         }
         return true;
      });
	
      var hallazgo = $("#inputHallAcu").val();
        
      if(campoVacio){
         var dataParam={
	        fechaPlanificada: inputPlanAcu,
	        hallazgo: hallazgo,
		trabajadorResponsableId: trabajadorResponsableId,
		fechaRealizada: inputRealAcu,
		horaPlanificada: horaPlan,
		inversion: parseFloat(inversion),
		descripcion: descripcion,
		observacion: inputObsAcu,
	        id: acuerdoId,
		reunionId: reunionId,
		estado: {estadoCumpId: acuerdoEstadoId},
		tipo: {id: parseInt(tipoId)},
		gestionAccionId: gestionAccionMejoraId,
		tipoGrupoSeguridadId: tipoGrupoSeguridadId,
		responsable: responsable
	               };

         callAjaxPost(URL+'/trabajador/acuerdo/save',dataParam,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		  guardarEvidenciaAuto(data.nuevoId,"fileEviAcuerdo",bitsEvidenciaAcuerdo,
		     '/trabajador/acuerdo/evidencia/save',cargarModalAcuerdoSeguridad,"acuerdoId"); 
		  break;
			     
	       default:
		  alert("Ocurrió un error al guardar el acuerdo!");
	    }
         });
      }else{
	 alert("Debe ingresar la fecha planificada y el tipo de acuerdo");
      }
   }else{
      if(tipoId == "-1"){
         campoVacio = false;
      };
	
      if(campoVacio){
         var dataParam={
		fechaPlanificada: null,
		fechaRealizada: null,
		horaPlanificada: null,
		inversion: parseFloat(0.0),
		descripcion: "",
		observacion: "",
		id: acuerdoId,
		reunionId: reunionId,
		estado: {estadoCumpId: 1},
		tipo: {id: parseInt(tipoId)},
		gestionAccionId: null,
		tipoGrupoSeguridadId: tipoGrupoSeguridadId,
		responsable: ""
	               };
	     
         callAjaxPost(URL+'/trabajador/acuerdo/save',dataParam,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		  guardarEvidenciaAuto(data.nuevoId,"fileEviAcuerdo",bitsEvidenciaAcuerdo,
		     '/trabajador/acuerdo/evidencia/save',cargarModalAcuerdoSeguridad,"acuerdoId"); 
		  break;
			     
	       default:
	          alert("Ocurrió un error al guardar el acuerdo!");
	    }
         });
      }else{
         alert("Debe ingresar  el tipo de acuerdo");
      }
   }
}

function procesarEvidenciaAcuerdo(progEquipoId,tipoId) {
   $.blockUI({
      message : 'cargando...'
   });
	 
   guardarEvidenciaAuto(progEquipoId,"fileEvi",bitsEvidenciaAcuerdo,'/trabajador/acuerdo/evidencia/save',function(){
      $.unblockUI();
      $('#mdUpload').modal('hide');
   },"acuerdoId");	 
}

function hallarEstadoAcuerdo(progId){
   var fechaPlanificada = $("#inputPlanAcu").val();
   var fechaReal = $("#inputRealAcu").val();
   var fechaHoy = getSession("fechaHoyOrdenInversoTexto");
   
   if(fechaReal != ''){
      acuerdoEstadoId = 2;
      acuerdoEstadoNombre = "Completado";
   }else{
      if(fechaPlanificada != ""){
         var dif = restaFechas(fechaHoy,fechaPlanificada)

         if(dif < 0){
	    acuerdoEstadoId = 3;
	    acuerdoEstadoNombre = "Retrasado";
         }else{
	    acuerdoEstadoId = 1;
	    acuerdoEstadoNombre = "Por implementar";
         }
      }else{
         acuerdoEstadoId = 1;
         acuerdoEstadoNombre = "Por implementar";
      }
   }
	
   $("#tdestadoacu"+progId).html(acuerdoEstadoNombre);	
}

function cambiarAcordeTipoAcuerdo(pindex){
   var tipoId = $("#selTipoAcu").val();
	
   if(pindex == null){
      acuerdoId = 0;

      if(parseInt(tipoId) == 1){
         $("#tblAcu input").hide();
         $("#tblAcu #fileEviAcuerdo").hide();
         $("#tblAcu #fileEviAcuerdo").parent().hide();
      }else{
	 $("#tblAcu input").show();
	 $("#tblAcu #fileEviAcuerdo").hide();
	 $("#tblAcu #fileEviAcuerdo").parent().show();
      }
   }else{
      acuerdoId = listFullAcuerdos[pindex].id;
		
      if(parseInt(tipoId) != 1){
         var fechaPlanificada = listFullAcuerdos[pindex].fechaPlanificada;
         var fechaRealizada = listFullAcuerdos[pindex].fechaRealizada;
         var tipoId = listFullAcuerdos[pindex].tipo.id;
         var observaciones = listFullAcuerdos[pindex].observacion;
         var horaPlanificada = listFullAcuerdos[pindex].horaPlanificada;
         var descripcion = listFullAcuerdos[pindex].descripcion;
         var inversion = listFullAcuerdos[pindex].inversion;
         var respAcu = listFullAcuerdos[pindex].responsable;
			
         $("#tdhallacu"+acuerdoId)
         .html("<input type='text' id='inputHallAcu' class='form-control'>");
			
         $("#inputHallAcu").val(listFullAcuerdos[pindex].hallazgo);
			
         $("#tdobsacu"+acuerdoId)
         .html("<input type='text' id='inputObsAcu' class='form-control'>");
			
         $("#tddescacu"+acuerdoId)
         .html("<input type='text' id='inputDesc' class='form-control'>");
			
         $("#tdinv"+acuerdoId)
         .html("<input type='number' id='inputInv' class='form-control'>");
			
         $("#tdrespacu"+acuerdoId)
         .html("<input type='text' id='inputRespAcu' class='form-control'>");
			
         $("#tdfechaplaacu"+acuerdoId)
         .html("<input type='date' id='inputPlanAcu' class='form-control' onchange='hallarEstadoAcuerdo("+acuerdoId+")'>");
			
         $("#tdfecharealacu"+acuerdoId)
         .html("<input type='date' id='inputRealAcu' class='form-control' onchange='hallarEstadoAcuerdo("+acuerdoId+")'>");
			
         $("#tdhoraplaacu"+acuerdoId)
         .html("<input type='time' id='inputHoraPlaAcu' class='form-control'>");

         $("#inputDesc").val(descripcion);
         $("#inputInv").val(inversion);
         $("#inputRespAcu").val(respAcu);
         $("#inputPlanAcu").val(convertirFechaInput(fechaPlanificada));
         $("#inputRealAcu").val(convertirFechaInput(fechaRealizada));
         $("#inputHoraPlaAcu").val(horaPlanificada);
         $("#inputObsAcu").val(observaciones);
			
         var listNombresTrabs = listarStringsDesdeArray(listTrabajadoresReunion,"nombre");

         ponerListaSugerida("inputRespAcu",listNombresTrabs,true);
			
         if(acuerdoId == 0){
	    var options={
		   container: "#tdeviacu0",
		   functionCall: function(){},
		   descargaUrl: "",
		   esNuevo: true,
		   idAux: "Acuerdo",
		   evidenciaNombre: "" 
			};
				
	    crearFormEvidenciaCompleta(options);
         }else{
	    var nombreEvidencia = listFullAcuerdos[pindex].evidenciaNombre;
				
	    var options={
		   container: "#tdeviacu" + acuerdoId,
		   functionCall: function(){},
		   descargaUrl: "/trabajador/acuerdo/evidencia?acuerdoId="+acuerdoId,
		   esNuevo: false,
		   idAux: "Acuerdo",
		   evidenciaNombre: nombreEvidencia
		        };
				
	    crearFormEvidenciaCompleta(options);
         }
      }else{
         $("#tdobsacu"+acuerdoId).html("------");
			
         $("#tddescacu"+acuerdoId)
         .html(listFullAcuerdos[pindex].estado.icono+
               "<a href='#' onclick='javascript:agregarAccionMejora(5,"+listFullAcuerdos[pindex].id+",1);'> " +
                   listFullAcuerdos[pindex].nombreAccionMejora+"");
			
         $("#tdinv"+acuerdoId).html("------");
			
         $("#tdrespacu"+acuerdoId).html("------");
			
         $("#tdfechaplaacu"+acuerdoId).html("------");
			
         $("#tdfecharealacu"+acuerdoId).html("------");
			
         $("#tdhoraplaacu"+acuerdoId).html("------");
			
         $("#tdeviacu"+acuerdoId).html("------");
      }
   }	
}
