var listRespuestas;
var respuestaId;
var banderaEdicion2;
var mensajeUx;

function verRespuestaSeguridad(){
   $('#modalRespuesta').on('show.bs.modal',function(e){
      cargarRespuestas();
   });
	
   $('#mdReporte').modal('hide');
   $("#modalRespuesta").modal("show");
}

function cargarRespuestas(){
   banderaEdicion2 = false;
   respuestaId = 0;
	
   $("#btnNuevoRpta").show();
   $("#btnVolverRpta").hide();
   $("#btnGuardarRpta").hide();
   $("#btnEliminarRpta").hide();
	
   $("#btnNuevoRpta").attr("onclick","javascript:nuevoRespuestas();");
   $("#btnVolverRpta").attr("onclick","javascript:cancelarRespuestas();");
   $("#btnGuardarRpta").attr("onclick","javascript:guardarRespuestas();");
   $("#btnEliminarRpta").attr("onclick","javascript:eliminarRespuestas();");
	
   var dataParam={
	  acInseguroId: acInseguroId
	         };

   callAjaxPost(URL+'/acinseguro/respuestas',dataParam,
      procesarRespuestaDescargadaPrimerEstado);
}

function procesarRespuestaDescargadaPrimerEstado(data){
   switch(data.CODE_RESPONSE){
      case "05":
         var list = data.list;
         listRespuestas = list;
	
         $("#tblRespuestasSeguridad tbody tr").remove();

         for(index=0;index<listRespuestas.length;index++){
            $("#tblRespuestasSeguridad tbody:first")
            .append("<tr id='tr"+listRespuestas[index].respuestaId+"' " +
            		"onclick='javascript:editarRespuesta("+listRespuestas[index].respuestaId+","+index+")'>" +
                       "<td id='tddescripcion"+listRespuestas[index].respuestaId+"'>"+listRespuestas[index].descripcion+"</td>" +
                       "<td id='tdeviR"+listRespuestas[index].respuestaId+"'>"+listRespuestas[index].evidenciaNombre+"</td>"+ 
                    "</tr>");
         }
		
         formatoCeldaSombreableTabla(true,"tblRespuestasSeguridad");
         break;
	
      default:
         alert("Ocurrió un error al traer las actos inseguros!");
   }
}

function editarRespuesta(prespuestaId,index){
   if(!banderaEdicion2){
      respuestaId = prespuestaId;

      $("#btnNuevoRpta").hide();
      $("#btnVolverRpta").show();
      $("#btnGuardarRpta").show();
      $("#btnEliminarRpta").show();
				
      var nombreEvidencia = listRespuestas[index].evidenciaNombre ;
	
      formatoCeldaSombreableTabla(false,"tblRespuestasSeguridad");
		
      var name = $("#tddescripcion"+respuestaId).text();
		
      $("#tddescripcion"+respuestaId)
      .html("<input type='text' id='inputDesc' class='form-control' placeholder='Descripci&oacute;n'>");
		
      nombrarInput("inputDesc",name);
		 
      var options={
	     container: "#tdeviR"+respuestaId,
	     functionCall: function(){},
	     descargaUrl: "/acinseguro/respuesta/evidencia?respuestaId="+respuestaId,
	     esNuevo: false,
	     idAux: "Respuesta",
	     evidenciaNombre: listRespuestas[index].evidenciaNombre,
	     isImage: false,
	          };
								
      crearFormEvidenciaCompleta(options);
      /*************************************************************************** */
		
      banderaEdicion2 = true;	
   }
}

function nuevoRespuestas(){
   if(!banderaEdicion2){
      $("#btnNuevoRpta").hide();
      $("#btnVolverRpta").show();
      $("#btnGuardarRpta").show();
      $("#btnEliminarRpta").hide();
		
      formatoCeldaSombreableTabla(false,"tblRespuestasSeguridad");
      
      respuestaId = 0;
		
      $("#tblRespuestasSeguridad tbody")
      .append("<tr id='0'>" +
	         "<td><input type='text' id='inputDesc' class='form-control' placeholder='Descripcion'></td>" +
//	         "<td>...</td>" +
		 "<td id='tdeviR0'>...</td>" +
	      "</tr>");
      
      var options={
             container: "#tdeviR"+respuestaId,
	     functionCall: function(){},
	     descargaUrl: "",
	     esNuevo: true,
	     idAux: "Respuesta",
	     evidenciaNombre: "",
	     isImage: false,
		  };
						
      crearFormEvidenciaCompleta(options);
		
      habilitarBotonesNuevo();
      banderaEdicion2 = true;	
   }else{
      alert("Guarde primero.");
   }
}

function cancelarRespuestas(){
   verRespuestaSeguridad();
}

function eliminarRespuestas(){
   var r = confirm("¿Está seguro de eliminar el acto inseguro?");
	
   if(r == true){
      var dataParam={
	     respuestaId: respuestaId
		    };

      callAjaxPost(URL+'/acinseguro/respuesta/delete',dataParam,
         procesarResultadoEliminarRespuesta);
   }
}

function procesarResultadoEliminarRespuesta(data){
   switch (data.CODE_RESPONSE){
      case "05":
         cargarRespuestas();
         break;
	
      default:
         alert("Ocurrió un error al eliminar el acto inseguro!");
   }
}

function guardarRespuestas(){
   var campoVacio = true;
   var inputDesc = $("#inputDesc").val();	
//   console.log(respuestaId+""+inputDesc);
   if(campoVacio){
      var dataParam={
	     respuestaId: respuestaId,
	     descripcion: inputDesc,
	     acInseguroId: acInseguroId
		    };

      callAjaxPost(URL+'/acinseguro/respuesta/save',dataParam,
         procesarResultadoGuardarRespuesta);
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function procesarResultadoGuardarRespuesta(data){
   switch(data.CODE_RESPONSE){
      case "05": 
         guardarEvidenciaAuto(data.nuevoId,"fileEviRespuesta",bitsEvidenciaAccidente,
	    '/acinseguro/respuesta/evidencia/save',function(){
             
//            mensajeUx="<label>El sanción fue registrada con éxito.</label>";
//            mensajesUx(mensajeUx,1,"","ActualizarVistaForCov");
             
               cargarRespuestas();
            },"respuestaId");
         break;
		
      default:
         alert("Ocurrió un error al guardar el acto inseguro!");
   }
}

function mostrarCargarEvidenciaRespuesta(respuestaId){
   $('#mdUploadRespuestas').modal('show');
   $('#btnUploadEvidenciaRespuesta')
   .attr("onclick","javascript:uploadEvidenciaRespuesta("+respuestaId+");");
}

function uploadEvidenciaRespuesta(respuestaId){
   $.blockUI({message: 'cargando...'});
   
   guardarEvidenciaAuto(respuestaId,"fileEviResp",bitsEvidenciaRespuestaSeguridad,
      "/acinseguro/respuesta/evidencia/save",function(){
         var inputFileImage = document.getElementById("fileEvi");
         var file = inputFileImage.files[0];
		
         $("#tdeviR"+respuestaId).html(file.name);
         $.unblockUI();
         $("#modalProg").show();
         $("#modalTree").hide();
         $('#mdUploadRespuestas').modal('hide');
      },"respuestaId");
}
/** *********************JsTree************** */
