var preguntaId;
var banderaEdicion99=false;
var listFullPreguntas;
$(function(){
	$("#btnNuevoPreguntaSubCon").attr("onclick", "javascript:nuevoListaPreguntaSubContratista();");
	$("#btnCancelarPreguntaSubCon").attr("onclick", "javascript:cancelarNuevoListaPreguntaSubContratista();");
	$("#btnGuardarPreguntaSubCon").attr("onclick", "javascript:guardarListaPreguntaSubContratista();");
	$("#btnEliminarPreguntaSubCon").attr("onclick", "javascript:eliminarListaPreguntaSubContratista();");
})
/**
 * 
 */
function verPreguntasListaSubContratista(){
   $("#divContainListaSubContratista").hide();
   $("#divContainPregSubCon").show();
   $("#tabListasSubContratista").find("h2").html("<a onclick='volverListasSubContratista()'>Lista '"+listaSubConNombre+"'</a> > Documentos");
   cargarListaPreguntasSubContratista();
}

function cargarListaPreguntasSubContratista() {
	
   $("#btnCancelarPreguntaSubCon").hide();
   $("#btnNuevoPreguntaSubCon").show();
   $("#btnEliminarPreguntaSubCon").hide();
   $("#btnGuardarPreguntaSubCon").hide();
	
   callAjaxPost(URL+'/contratista/lista/preguntas',{id:listaSubConId},
      function(data){
         if(data.CODE_RESPONSE=="05"){
	    banderaEdicion99=false;
	    listFullPreguntas=data.list;
	    $("#tblPreguntasSubCon tbody tr").remove();
					
	    listFullPreguntas.forEach(function(val,index){
	       $("#tblPreguntasSubCon tbody")
	          .append("<tr id='trlis"+val.id+"' onclick='editarListaPreguntaSubContratista("+index+")'>" 
			    +"<td>"+(index+1)+"</td>"
			    +"<td id='listpnomsubcon"+val.id+"'>"+val.nombre+"</td>"  
			 +"</tr>");
	    });
		
	    formatoCeldaSombreableTabla(true,"tblPreguntasSubCon");
         }else{
            console.log("NOPNPO")
         }
     });
}

function editarListaPreguntaSubContratista(pindex){

   if(!banderaEdicion99){
      formatoCeldaSombreableTabla(false,"tblPreguntasSubCon");
      preguntaId = listFullPreguntas[pindex].id;
		
      var descripcion=listFullPreguntas[pindex].nombre;
	
      $("#listpnomsubcon"+preguntaId).html("<input type='text' id='inputNombrePreguntaDocumento' class='form-control'>");
      $("#inputNombrePreguntaDocumento").val(descripcion);
   //
      banderaEdicion99 = true;
      $("#btnCancelarPreguntaSubCon").show();
      $("#btnNuevoPreguntaSubCon").hide();
      $("#btnEliminarPreguntaSubCon").show();
      $("#btnGuardarPreguntaSubCon").show();
      $("#btnGenReporteSubCon").hide();	
   }	
}

function nuevoListaPreguntaSubContratista(){
	
   if(!banderaEdicion99){
      preguntaId = 0;
      //var slcPregunta = crearSelectOneMenuOblig("slcPregunta", "",listFullPreguntas, "", "id", "nombre");
		
      $("#tblPreguntasSubCon tbody")
         .append("<tr>"+
		    "<td>...</td>"+ 
		    "<td>"+"<input type='text' id='inputNombrePreguntaDocumento' class='form-control'>"+"</td>"+
		 "</tr>");
		
      formatoCeldaSombreableTabla(false,"tblPreguntasSubCon");	
      $("#btnCancelarPreguntaSubCon").show();
      $("#btnNuevoPreguntaSubCon").hide();
      $("#btnEliminarPreguntaSubCon").hide();
      $("#btnGuardarPreguntaSubCon").show();
      $("#btnGenReporteSubCon").hide();
      banderaEdicion99 = true;
	
   }else{
      alert("Guarde primero.");
   }
}

function cancelarListaPreguntaSubContratista() {
	cargarListaPreguntasSubContratista();
}

function eliminarListaPreguntaSubContratista() {
	
   var r = confirm("¿Está seguro de eliminar la pregunta?");
   
   if(r == true){
      var dataParam={
	      id : preguntaId,
		    };
      
      callAjaxPost(URL + '/contratista/lista/pregunta/delete', dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
	           cargarListaPreguntasSubContratista();
		   break;
				
	       default:
		   alert("Ocurrió un error al eliminar la programacion!");
	    }
         });
   }
}

function guardarListaPreguntaSubContratista() {

   var campoVacio = true;
   var descripcion=$("#inputNombrePreguntaDocumento").val();  
 
   if(descripcion.length<1 ){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
	      id:preguntaId,
	      nombre:descripcion,
	      listaAsociada:{id:listaSubConId}
		    };

      callAjaxPost(URL + '/contratista/lista/pregunta/save', dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		   cargarListaPreguntasSubContratista();
		   break;
		   
	       default:
		   console.log("Ocurrió un error al guardar la pregunta!");
	    }
         });		
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoListaPreguntaSubContratista(){
   cargarListaPreguntasSubContratista();
}
