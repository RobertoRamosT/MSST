
var opcionPreguntaId;
var banderaEdicionOpc;
var listFullOpciones;
var actualizarModalPreguntas;
var mensajeUx;

function llamarOpcionesPregunta(){
   $("#modalOpcionesPregunta").remove();actualizarModalPreguntas = 0;
        
   var contenido = "";
       
   var buttonNuevo =
      "<button id='btnNuevoOpcPreg' type='button' class='btn btn-success' style='margin-right:5px' " +
	      "onclick='nuevoOpcionPregunta()' title='Guardar.'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
       
   var buttonCancelar =
      "<button id='btnCancelarOpcPreg' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='cargarOpcionesPregunta()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var buttonEliminar =
      "<button id='btnEliminarOpcPreg' type='button' class='btn btn-danger' style='margin-right:5px' " +
	      "onclick='eliminarOpcionPregunta()' title='Guardar.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
       
   var buttonGuardar =
      "<button id='btnGuardarOpcPreg' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarOpcionPregunta()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
          
   var modalOptions={
      maxWidth:"70%",id:"modalOpcionesPregunta",
      nombre:"<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> > " +
         "<a onclick='volverPreguntasCurso()'>Pregunta '"+preguntaCursoEdicion.nombre+"'</a> > Opciones",
      contenido: 
    	 "<form class='form-inline'>" +
    	     buttonNuevo+buttonCancelar+buttonGuardar+buttonEliminar +
         "</form>" +
         "<div class='wrapper' id='wrapperOpcionesPregunta'>" +
         "<table id='tblOpcionesPregunta' class='table table-striped table-bordered table-hover table-fixed'>" +
    	  "<thead>" +
    	   "<tr>" +
            "<th class='tb-acc' style='width:400px'>Descripción</th>" +
            "<th class='tb-acc' style='width:100px'>¿Correcto?</td>" +
           "</tr>" +
    	  "</thead>" +
    	  "<tbody></tbody>" +
    	 "</table>" +
    	"</div>"};
    		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperOpcionesPregunta",190);
   cargarOpcionesPregunta(); 
}
    
function cargarOpcionesPregunta(){
   opcionPreguntaId = 0;banderaEdicionOpc = false;listFullOpciones = [];
	
   $("#btnNuevoOpcPreg").show();$("#btnCancelarOpcPreg").hide();$("#btnEliminarOpcPreg").hide();$("#btnGuardarOpcPreg").hide();
 	
   var dataParam={
      id:PreguntaCursoId
   };
 	
   callAjaxPost(URL+'/capacitacion/curso/pregunta/opciones',dataParam,function(data){
      listFullOpciones = data.list;
 		
      $("#tblOpcionesPregunta tbody").html("");
 		
      listFullOpciones.forEach(function(val,index){
 	 var estadoCorrecto = (val.isCorrecto == 1?"Sí":"No");
 	  
         $("#tblOpcionesPregunta tbody").append(
            "<tr id='trOpcionPregunta"+val.id+"' onclick='javascript:editarOpcionPregunta("+index+")'>"+
               "<td id='opcNom"+val.id+"'>"+val.nombre+"</td>" +
               "<td id='opcCorr"+val.id+"'>"+estadoCorrecto+"</td>" +
 	    "</tr>");
      });
 	
      formatoCeldaSombreableTabla(true,"tblOpcionesPregunta");goheadfixedY("#tblOpcionesPregunta","#wrapperOpcionesPregunta");
   });	
}

function editarOpcionPregunta(pindex){
   if(!banderaEdicionOpc){
      banderaEdicionOpc = true;
      
      opcionPreguntaId = listFullOpciones[pindex].id;
      
      $("#trOpcionPregunta"+opcionPreguntaId).addClass("fila-edicion");

      $("#opcNom"+opcionPreguntaId).html("<input id='inputOpcionDescripcion' type='text' class='form-control'>");
      $("#inputOpcionDescripcion").val(listFullOpciones[pindex].nombre);
      
      var checkCorrecto = (listFullOpciones[pindex].isCorrecto == 1?"checked":"");
      
      $("#opcCorr"+opcionPreguntaId).html("<input id='radioOpcCorrecto' type='radio' class='form-control' "+checkCorrecto+">");
      
      $("#btnNuevoOpcPreg").hide();$("#btnCancelarOpcPreg").show();$("#btnEliminarOpcPreg").show();$("#btnGuardarOpcPreg").show();
      
      formatoCeldaSombreableTabla(false,"tblOpcionesPregunta");
   }
}

function nuevoOpcionPregunta(){
   if(!banderaEdicionOpc){
      banderaEdicionOpc = true;opcionPreguntaId = 0;
	
      $("#tblOpcionesPregunta tbody").append(
         "<tr id='trOpcionPregunta0'>"+
            "<td><input id='inputOpcionDescripcion' type='text' class='form-control'></td>"+
	    "<td><input id='radioOpcCorrecto' type='radio' class='form-control'></td>" + 
         "</tr>");
   
      $("#btnNuevoOpcPreg").hide();$("#btnCancelarOpcPreg").show();$("#btnEliminarOpcPreg").hide();$("#btnGuardarOpcPreg").show();
	
      formatoCeldaSombreableTabla(false,"tblOpcionesPregunta");
   }
}

function eliminarOpcionPregunta(){
   $('#modalOpcionesPregunta').modal('hide');
    
   mensajeUx="<label>¿Está seguro de eliminar el registro de la opción seleccionada?</label>";
   mensajesUx(mensajeUx,3,"","EliminarOpcionPregCurso");
   
   $("#btnDevolverValorEliminarOpcionPregCurso").on("click",function(){
      var dataParam={
         id:opcionPreguntaId
      };

      callAjaxPostSimpleVersionDos(1,URL+'/capacitacion/curso/pregunta/opcion/delete',dataParam,1,1,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El registro de la opción seleccionada se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarOpcionPregCurso");
        	
               $("#modalMensajeUxActualizarOpcionPregCurso").on("hidden.bs.modal",function(){
	          $('#modalOpcionesPregunta').modal('show');actualizarModalPreguntas = 1;cargarOpcionesPregunta();  
               });
	       
	       break;
						
            default:
	       alert("Ocurrió un error al eliminar el registro de la opción!");
         }
      });
   });
      
   $("#btnRegresarPrevioEliminarOpcionPregCurso").on("click",function(){
      $('#modalOpcionesPregunta').modal('show');
   });  
}

function guardarOpcionPregunta(){
   var campoVacio = true;
    
   var descripcion = $("#inputOpcionDescripcion").val();
   var isCorrecto = ($("#radioOpcCorrecto").prop("checked")?1:0);
   
   if(descripcion.length == 0){
      campoVacio = false;mensajeUx = "<label>La descripción es obligatoria.</label>";
   }
	
   if(campoVacio){
      var dataParam={
	 id:opcionPreguntaId,nombre:descripcion,isCorrecto:isCorrecto,preguntaCursoId:PreguntaCursoId
      };
		
      callAjaxPostSimpleVersionDos(1,URL+'/capacitacion/curso/pregunta/opcion/save',dataParam,1,1,function(data){
         $("#modalOpcionesPregunta").modal("hide");
         
         mensajeUx="<label>El registro de la opción fue guardado correctamente.</label>";
	 mensajesUx(mensajeUx,1,"","ActualizarOpcionPregCurso"); 
							   
	 $("#modalMensajeUxActualizarOpcionPregCurso").on("hidden.bs.modal",function(){
	    $("#modalOpcionesPregunta").modal("show");actualizarModalPreguntas = 1;cargarOpcionesPregunta();
	 });
      });
   }else{
      $("#modalOpcionesPregunta").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionOpcionPregCurso");
       
      $("#modalMensajeUxValidacionOpcionPregCurso").on("hidden.bs.modal",function(){
	 $("#modalOpcionesPregunta").modal("show");
      }); 
   }
}

//function guardarOpcionCorrecta(pindex){
//   var campoVacio = false;
//   var nombre = listFullOpciones[pindex].nombre;
//   opcionPreguntaId = listFullOpciones[pindex].id;
//	
//   var OpcionObj={
//	  id: opcionPreguntaId,
//	  nombre: nombre,
//	  isCorrecto: 1,
//	  preguntaCursoId: PreguntaCursoId
//		 }
//		
//   callAjaxPost(URL+'/capacitacion/curso/pregunta/opcion/save',OpcionObj,function(data){
//   });	
//}
