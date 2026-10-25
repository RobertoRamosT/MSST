var clasificacionId;
var clasificacionObj;
var banderaEdicion8=false;
var listFullClasificaciones;
$(function(){
     $("#btnNuevoClasificacion").attr("onclick", "javascript:nuevoClasificacion();");
     $("#btnCancelarClasificacion").attr("onclick", "javascript:cancelarNuevoClasificacionContratista();");
     $("#btnGuardarClasificacion").attr("onclick", "javascript:guardarClasificacion();");
     $("#btnEliminarClasificacion").attr("onclick", "javascript:eliminarClasificacion();");
})
/**
 * 
 */
function cargarClasificacionsContratista() {
    
    var valorResize= 160;
    resizeDivWrapper("wrapUnidades",valorResize);
	
   $("#btnCancelarClasificacion").hide();
   $("#btnNuevoClasificacion").show();
   $("#btnEliminarClasificacion").hide();
   $("#btnGuardarClasificacion").hide();
	
   callAjaxPost(URL + '/contratista/clasificaciones', 
		{empresaId : getSession("gestopcompanyid") }, 
		function(data){
		   if(data.CODE_RESPONSE=="05"){
		      banderaEdicion8=false;
		      listFullClasificaciones=data.list;
		      $("#tblClasificacions tbody tr").remove();
					
		      listFullClasificaciones.forEach(function(val,index){
		         $("#tblClasificacions tbody").append(
			     "<tr id='trcla"+val.id+"' onclick='editarClasificacion("+index+")'>" +
				 "<td id='clanom"+val.id+"'>"+val.nombre+"</td>" + 
				 "<td id='tdclaresponsable"+val.id+"'>"+val.responsable+"</td>" + 
				 "<td id='tdclacorreo"+val.id+"'>"+val.correo+"</td>" + 
				 "<td>"+val.numUnidades+"</td>" +
		             "</tr>");
		      });
		   }else{
		       console.log("NOPNPO")
		   }
		   goheadfixedY("#tblClasificacions","#wrapUnidades");
	        });
}

function editarClasificacion(pindex) {

   if(!banderaEdicion8){
      formatoCeldaSombreableTabla(false,"tblObservacion");
      clasificacionId = listFullClasificaciones[pindex].id;
      clasificacionObj = listFullClasificaciones[pindex];
		
      $("#clanom" + clasificacionId).html("<input type='text' id='inputNombreClasificacion' class='form-control'>");
      $("#inputNombreClasificacion").val(clasificacionObj.nombre);
		
      $("#tdclaresponsable"+ clasificacionId).html("<input type='text' id='inputResponsableClasificacion' class='form-control'>");
      $("#inputResponsableClasificacion").val(clasificacionObj.responsable);
		
      $("#tdclacorreo"+ clasificacionId).html("<input type='text' id='inputCorreoClasificacion' class='form-control'>");
      $("#inputCorreoClasificacion").val(clasificacionObj.correo);
		
      banderaEdicion8 = true;
      $("#btnCancelarClasificacion").show();
      $("#btnNuevoClasificacion").hide();
      $("#btnEliminarClasificacion").show();
      $("#btnGuardarClasificacion").show();
      $("#btnGenReporte").hide();
		
   }
}


function nuevoClasificacion() {
   if(!banderaEdicion8){
      clasificacionId = 0;
      var slcClasificacion = crearSelectOneMenuOblig("slcClasificacion", "",
	                     listFullClasificaciones, "", "id", "nombre");
		
      $("#tblClasificacions tbody")
	     .append("<tr>"+
		         "<td><input type='text' id='inputNombreClasificacion' class='form-control'></td>" +
			 "<td><input type='text' id='inputResponsableClasificacion' class='form-control'></td>" +
			 "<td><input type='text' id='inputCorreoClasificacion' class='form-control'></td>" +
                         "<td>0</td>" +
	             "</tr>");
		
      $("#btnCancelarClasificacion").show();
      $("#btnNuevoClasificacion").hide();
      $("#btnEliminarClasificacion").hide();
      $("#btnGuardarClasificacion").show();
      $("#btnGenReporte").hide();
      banderaEdicion8 = true;	
	
   }else{
       alert("Guarde primero.");
   }
}

function cancelarClasificacion() {
	cargarClasificacionsContratista();
}

function eliminarClasificacion() {
	
   var r = confirm("¿Está seguro de eliminar la clasificacion?");
   if(r == true){
      var dataParam = {
	     id : clasificacionId,
      };
		
      callAjaxPost(URL + '/contratista/clasificacion/delete', dataParam,
		   function(data){
	  	      switch(data.CODE_RESPONSE){
			 case "05":
			     cargarClasificacionsContratista();
			     break;
					
			     default:
			        alert("Ocurrió un error al eliminar la programacion!");
	  	      }
		  });
   }
}

function guardarClasificacion() {

   var campoVacio = true;
   var descripcion = $("#inputNombreClasificacion").val();  
   var responsable = $("#inputResponsableClasificacion").val();
   var correo = $("#inputCorreoClasificacion").val();
 
   if(descripcion.length<1){
      campoVacio = false;
   }
   
   if(responsable.length<1){
       campoVacio = false;
    }
   
   if(correo.length<1){
       campoVacio = false;
    }

   if(campoVacio){
       var dataParam = {
	      id : clasificacionId,
	      nombre: descripcion,
	      responsable: responsable,
	      correo: correo,
	      empresaId : getSession("gestopcompanyid")
       };

    callAjaxPost(URL + '/contratista/clasificacion/save', dataParam,
		 function(data){
		    switch(data.CODE_RESPONSE){
		       case "05":
			   cargarClasificacionsContratista();
			   break;
						
		       default:
			   console.log("Ocurrió un error al guardar la clasificacion!");
		    }
		 });
			
   }else{
       alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoClasificacionContratista(){
   cargarClasificacionsContratista();
}
