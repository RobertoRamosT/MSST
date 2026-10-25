var postulanteId;var postulanteProyectoObj;
var indexEvalPostulante;
var nombrePostulante;
var banderaEdicion48=false;
var banderaEdicionEval=false;
var listAprobacion=[{id:0,nombre:"No"},{id:1,nombre:"Sí"}];
var listCumple=[{id:0,nombre:"No Cumple"},{id:1,nombre:"Cumple"}];
var listFullPostulanteSeguridad;
var listContratistaProy;

var listTrabajadores;
var contadorListTrab;
var postulanteEstado;
var listEvaluacionPostulante;
var evaluacionActual;
var mensajeUx;

$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
  });
 $(document).on('fileselect',"input:file", function(event, numFiles, label) {
	 
	          var input = $(this).parents('.input-group').find(':text'),
	              log = numFiles > 1 ? numFiles + ' files selected' : label;

	          if( input.length ) {
	              input.val(log);
	          } else {
	              if( log ) console.log(log);
	          }

	      });
 
$(function(){
   $("#btnNuevoPost").attr("onclick","javascript:nuevoPostulante();");
   $("#btnCancelarPost").attr("onclick","javascript:cancelarNuevoPostulante();");
   $("#btnGuardarPost").attr("onclick","javascript:guardarPostulante(1);");
   $("#btnEliminarPost").attr("onclick","javascript:eliminarPostulante();");
   $("#btnListarVerificaciones").attr("onclick","javascript:cargarEvaluacionesPostulante();");	
});
/**
 * 
 */

function verPostulantesProyecto(){
   $("#mdPostuProy").modal("show");
   cargarPostulantesProyecto();
}

function cargarPostulantesProyecto(){
   $("#btnCancelarPost").hide();$("#btnNuevoPost").show();
   $("#btnEliminarPost").hide();$("#btnGuardarPost").hide();
   $("#btnListarVerificaciones").hide();
	
   $("#modalEvalPostulante").hide();$("#modalPostulante").show();
	
   $("#btnCancelarEval").attr("onclick","volverPostulanteEvaluacion()");
   $("#btnGuardarEval").attr("onclick","guardarPostulanteEvaluacion()");
	
   postulanteProyectoObj={isNotificado:0,asignado:0};
   listEvaluacionPostulante=[];
	
   var dataParam={
      id: ProyectoId,
      empresaId: getSession("gestopcompanyid")
   };
   
   callAjaxPost(URL+'/contratista/proyecto/postulantes',dataParam,function(data){
      switch (data.CODE_RESPONSE){
         case "05":
	    banderaEdicion48 = false;
	    
	    $("#tblPostulantes tbody tr").remove();
	    
	    listFullPostulanteSeguridad = data.listPostulantes;
	    listContratistaProy = data.listContratistaProy;
			
	    listFullPostulanteSeguridad.forEach(function(val,index){
	       var evidenciaNombre = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre);	
		
	       $("#tblPostulantes tbody").append(
	          "<tr id='trtip"+val.id+"' onclick='editarPostulante("+index+")'>" +
		     "<td id='postcont"+val.id+"'>"+val.contratista.nombre+"</td>" +
		     "<td id='postresp"+val.id+"'>"+val.responsable+"</td>" +
		     "<td id='postTelef"+val.id+"'>"+val.telefono+"</td>" +
		     "<td id='postcorreo"+val.id+"'>"+val.correo+"</td>" +
		     "<td id='postfp"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
		     "<td id='postfr"+val.id+"'>"+val.fechaRealTexto+"</td>" +
		     "<td id='postestado"+val.id+"'>"+val.estado.nombre+"</td>" +
		     "<td id='posteval"+val.id+"'>"+val.evaluacionNotaTexto+"</td>" +
		     "<td id='postevi"+val.id+"'>"+evidenciaNombre+"</td>" +
		     "<td id='postasig"+val.id+"'>"+val.asignacionNombre+"</td>" +
		  "</tr>"); 
				
	       listContratistaProy.forEach(function(val1,index1){  
	          if(val1.id == val.contratista.id){
		     listContratistaProy.splice(index1,1);
	          }
	       });
	    });
		
	    formatoCeldaSombreableTabla(true,"tblPostulantes");
	    
	    break;
		
         default:
	    alert("Ocurrió un error al traer a los postulantes del proyecto!");
      }
   });	
}

function editarPostulante(pindex){
   if(!banderaEdicion48){
      formatoCeldaSombreableTabla(false,"tblPostulantes");
		
      postulanteId = listFullPostulanteSeguridad[pindex].id;
      postulanteProyectoObj = listFullPostulanteSeguridad[pindex];
      nombrePostulante = listFullPostulanteSeguridad[pindex].contratista.nombre;
      
      $("#trtip"+postulanteId).addClass("fila-edicion");
		
      var responsable = postulanteProyectoObj.responsable;
      var correo = postulanteProyectoObj.correo;
      var telefono = postulanteProyectoObj.telefono;
		
      listContratistaProy.push({
	 id: postulanteProyectoObj.contratista.id,
	 nombre: postulanteProyectoObj.contratista.nombre
      });
		
      var slcContratistaProy = crearSelectOneMenu("slcContratistaProy","",listContratistaProy,
	 postulanteProyectoObj.contratista.id,"id","nombre");
		
      var slcContratistaAprobacion = crearSelectOneMenuOblig("slcContratistaAprobacion","",listAprobacion,
	 postulanteProyectoObj.asignacion,"id","nombre");
	
      listFullPostulanteSeguridad.forEach(function(val,index){
         if(val.asignacion == 1 && val.id != postulanteId){
	    slcContratistaAprobacion = crearSelectOneMenuOblig("slcContratistaAprobacion","",
	       [listAprobacion[0]],"","id","nombre");
         }
			
         if(val.asignacion == 1 && val.id == postulanteId){
	    slcContratistaAprobacion = crearSelectOneMenuOblig("slcContratistaAprobacion","",
	       [listAprobacion[1]],"","id","nombre");
         }
      });
		
      var fechaPlanificada = postulanteProyectoObj.fechaPlanificada;
      var fechaReal = postulanteProyectoObj.fechaReal;
		
      $("#postcont"+postulanteId).html(slcContratistaProy);
      
      $("#postasig"+postulanteId).html(slcContratistaAprobacion);
		 
      $("#postfp"+postulanteId)
      .html("<input type='date' id='inputPostulantePlan' onchange='hallarEstadoPostulante()' class='form-control'>");
		
      var today2 = convertirFechaInput(fechaPlanificada);
      $("#inputPostulantePlan").val(today2);

      $("#postfr"+postulanteId)
      .html("<input type='date' id='inputPostulanteReal' onchange='hallarEstadoPostulante()' class='form-control'>");
		
      var today1 = convertirFechaInput(fechaReal);
      $("#inputPostulanteReal").val(today1);

      hallarEstadoPostulante();	
      //
      $("#postresp"+postulanteId).html("<input id='inputPostulanteResponsable' class='form-control'>");
      $("#inputPostulanteResponsable").val(responsable);
      //
      $("#postcorreo"+postulanteId).html("<input id='inputPostulanteCorreo' class='form-control'>");
      $("#inputPostulanteCorreo").val(correo);
      //
      $("#postTelef"+postulanteId).html("<input id='inputPostulanteTelefono' class='form-control'>");
      $("#inputPostulanteTelefono").val(telefono);
      
      banderaEdicion48 = true;
		 
      var options={
	 idAux: "Postul",container: "#postevi"+postulanteId,
	 descargaUrl: "/contratista/proyecto/postulante/evidencia?id="+postulanteId,
	 functionCall: function(){
	    validacionSubirEvidencia("Postul",bitsEvidenciaPostulante,"mdPostuProy");   
	 },esNuevo: (postulanteProyectoObj.evidenciaNombre.length == 0?true:false),
	 evidenciaNombre: postulanteProyectoObj.evidenciaNombre
      }; 
		
      crearFormEvidenciaCompleta(options); 
		
      $("#btnCancelarPost").show();$("#btnNuevoPost").hide();$("#btnEliminarPost").show();
      $("#btnGuardarPost").show();$("#btnGenReporte").hide();$("#btnListarVerificaciones").show();	
   }	
}

function volverModalPostulante(){
   $("#modalEvalPostulante").hide();
   $("#modalPostulante").show();
   $("#mdPostuProy .modal-title").html("Postulantes")
}

function cargarEvaluacionesPostulante(){
   $("#btnCancelarEval").hide();
   $("#btnGuardarEval").hide();
   $("#btnEliminarEval").hide();
	
   evaluacionActual = null;
   banderaEdicionEval = false;
	
   $("#mdPostuProy .modal-title").html(
      "<a onclick='volverModalPostulante()'>Postulante '"+nombrePostulante+"'</a> > Evaluaciones");
			
   $("#modalEvalPostulante").show();
   $("#modalPostulante").hide(); 
			
   var dataParam = {
      id: postulanteId
   };
  
   callAjaxPost(URL+'/contratista/proyecto/postulante/evaluacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05": 
	    listEvaluacionPostulante = data.list;  
	    
	    $("#tblEvalPost tbody tr").remove();  
							
	    listEvaluacionPostulante.forEach(function(val,index){
	       var evalId = val.id;
	       var pregunta = val.preguntaNombre;
	       var pregInput = "<input id='pregunta"+evalId+"' class='form-control'>";
	       var preguntaId = val.preguntaId;
	       var observacionPostulante = val.observacionPostulante;
	       var eviNombre = val.evidenciaNombre;
	       var observacion = val.observacion;
	       var nota = "Sin evaluar";
							
	       listCumple.forEach(function(val1,index1){
	          if(val1.id == val.isAprobado){
		     nota = val1.nombre;
	          }
	       });
							 
	       $("#tblEvalPost tbody").append(
	          "<tr id='evalpost"+index+"' onclick='editarEvaluacionPostulante("+index+")'>" +
		     "<td>"+pregunta+"</td>"+ 
		     "<td id='selEval"+index+"'>"+
		        "("+val.fechaEvaluacionTexto+")<br>"+nota+"</td>" +
		     "<td id='obsEval"+index+"'>"+observacion+"</td>" +
		     "<td id='eviEvalPost"+index+"'>"+"("+val.fechaTexto+")<br>"+val.evidenciaNombre+"</td>" +
		     "<td>"+observacionPostulante+"</td>" +
		  "</tr>");
	    });
							
	    formatoCeldaSombreableTabla(true,"tblEvalPost");
							
	    break;
						
         default:
            alert("Ocurrió un error al cargar el arbol de trabajadores!");
      }
   });
}

function editarEvaluacionPostulante(pindex){
	if(!banderaEdicionEval){
		banderaEdicionEval=true;
		indexEvalPostulante=pindex;
		formatoCeldaSombreableTabla(false,"tblEvalPost");
		
		$("#btnCancelarEval").show();
		$("#btnGuardarEval").show();
		
	var val=listEvaluacionPostulante[pindex];
	evaluacionActual=val;
	var evalId=val.id;
	 var preguntaId=val.preguntaId;
		var observacionPostulante=val.observacionPostulante;
		var eviNombre=val.evidenciaNombre;
	var observacionInput="<input id='observacionEval' class='form-control'>";
	var notaSelect = crearSelectOneMenuOblig("slcEvalPostulante", "",
			listCumple, val.isAprobado, "id", "nombre"); 
	var options={
			idAux:"EvalPost",
			container:"#eviEvalPost"+pindex,
			descargaUrl:"/contratista/proyecto/postulante/evaluacion/evidencia?id="+ val.id,
			functionCall:function(){},
			esNuevo:false,
			evidenciaNombre:eviNombre
	}
	
	crearFormEvidenciaCompleta(options); 
	$(options.container).find(".label-upload").remove();
	$("#obsEval"+pindex).html(observacionInput);
	$("#observacionEval").val(val.observacion)
	$("#selEval"+pindex).html(notaSelect)
}
}

function volverPostulanteEvaluacion(){
   cargarEvaluacionesPostulante()
}

function guardarPostulanteEvaluacion(){
	var observacion=$("#observacionEval").val();
	var isAprobado=$("#slcEvalPostulante").val(); 
	var dataParam={
			observacion:observacion,
			observacionPostulante:evaluacionActual.observacionPostulante,
			isAprobado:isAprobado,
			preguntaId:evaluacionActual.preguntaId,
			postulanteId:postulanteId,
			id:evaluacionActual.id
	};
	
	callAjaxPost(URL + '/contratista/proyecto/postulante/evaluacion/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 	
					cargarEvaluacionesPostulante();
					break;
				default:
					console.log("Ocurrió un error al guardar el postulante!");
				}
			},loadingCelda,"tblPostulantes #tr"+postulanteId);
}
function hallarDatosPostulante(){
	listContratistaProy.forEach(function(val,index){
		if($("#slcContratistaProy").val()==val.id){
			$("#inputPostulanteResponsable").val(val.contacto);
			$("#inputPostulanteCorreo").val(val.contactoCorreo);
			}
	});
}

function nuevoPostulante(){
   if(!banderaEdicion48){
      postulanteId = 0;
		
      var slcContratistaProy = crearSelectOneMenuOblig("slcContratistaProy","hallarDatosPostulante()",
	     listContratistaProy,"","id","nombre");
		
      $("#tblPostulantes tbody")
      .append("<tr id='0'>" + 
	         "<td>"+slcContratistaProy+"</td>" +
		 "<td><input id='inputPostulanteResponsable' class='form-control'></td>" +
		 "<td><input id='inputPostulanteTelefono' class='form-control'></td>" +
	         "<td><input id='inputPostulanteCorreo' class='form-control'></td>" +
		 "<td><input type='date' id='inputPostulantePlan' onchange='hallarEstadoPostulante()' class='form-control'></td>" +
		 "<td><input type='date' id='inputPostulanteReal' onchange='hallarEstadoPostulante()' class='form-control'></td>" +
		 "<td id='postestado0'>...</td>" +
		 "<td>...</td>" +
		 "<td id='postevi0'>...</td>" +
		 "<td>...</td>" +
	      "</tr>");
      
      var options={
	     idAux:"Postul",
	     container:"#postevi"+postulanteId,
	     descargaUrl:"",
	     functionCall:function(){
		 validacionSubirEvidencia("Postul",bitsEvidenciaPostulante,"mdPostuProy");   
	     },
	     esNuevo:true,
	     evidenciaNombre:""
		  } 
		
      crearFormEvidenciaCompleta(options); 
		
      hallarDatosPostulante();
      
      formatoCeldaSombreableTabla(false,"tblPostulantes");
		
      $("#btnCancelarPost").show();
      $("#btnNuevoPost").hide();
      $("#btnEliminarPost").hide();
      $("#btnGuardarPost").show();
      $("#btnGenReporte").hide();
      banderaEdicion48 = true;
   }else{
      alert("Guarde primero.");
   }
}

function cancelarPostulante() {
	cargarTiposContratista();
}

function eliminarPostulante() {
   $("#mdPostuProy").modal("hide");
   
   if(postulanteProyectoObj.asignacion == 0){
      mensajeUx="<label>¿Está seguro de eliminar al postulante seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","EliminarPostulanteProy");

      $("#btnDevolverValorEliminarPostulanteProy").on("click",function(){
         var dataParam={
            id: postulanteId
         };

         callAjaxPost(URL+'/contratista/proyecto/postulante/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
  	       case "05":
  	          mensajeUx="<label>El postulante fue eliminado con éxito.</label>";
  	          mensajesUx(mensajeUx,1,"","EliminarPostProyAviso");
  		
  	          $("#modalMensajeUxEliminarPostProyAviso").on("hidden.bs.modal",function(){
  		     $("#mdPostuProy").modal("show");
  		     cargarPostulantesProyecto();     
  	          });
  		
  	          break;
  		
  	       default:
  	          alert("Ocurrió un error al eliminar al postulante!");
            }
         });
      });
    
      $("#btnRegresarPrevioEliminarPostulanteProy").on("click",function(){
         $("#mdPostuProy").modal("show");
      });     
   }else{
      mensajeUx="<label>No se puede eliminar al postulante seleccionado porque " +
         "fue asignado como el ganador de este proceso de postulación.</label>";
      mensajesUx(mensajeUx,2,"","EliminarPostProyAviso");
	
      $("#modalMensajeUxEliminarPostProyAviso").on("hidden.bs.modal",function(){
         $("#mdPostuProy").modal("show"); 
      }); 
   }
}

function guardarPostulante(idFinal){
   var campoVacio = false;
	
   var contratistaPostulanteId = $("#slcContratistaProy").val();
   var responsable = $("#inputPostulanteResponsable").val();
   var correo = $("#inputPostulanteCorreo").val();
   var telefono = $("#inputPostulanteTelefono").val();
   var fechaPlan = convertirFechaTexto($("#inputPostulantePlan").val());
   var fechaReal = convertirFechaTexto($("#inputPostulanteReal").val()); 
   var responsableId = $("#slcContratistaProy").val();
   var asignacion = $("#slcContratistaAprobacion").val();
   var r = true;
	
   if(parseInt(asignacion) == 1){
      r = confirm("Sólo se podrá asignar una vez, ¿está seguro de seguir?")
   }
	
   if(postulanteId == 0){
      asignacion=0;
   }
		
   if(r){
      var dataParam={
	     id: postulanteId, 
	     fechaPlanificada: fechaPlan,
	     telefono: telefono,
	     correo: correo,
	     isNotificado: postulanteProyectoObj.isNotificado,
	     responsable: responsable,
	     proyectoId: ProyectoId,
	     fechaReal: fechaReal ,
	     asignacion: (parseInt(asignacion) == -1?null:asignacion),
	     estado: postulanteEstado,
	     contratista:{id: contratistaPostulanteId}
		    }; 
			
      callAjaxPost(URL+'/contratista/proyecto/postulante/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05": 
	       if(idFinal == 1){
	          guardarEvidenciaAuto(data.nuevoId,"fileEviPostul",bitsEvidenciaPostulante,
	          "/contratista/proyecto/postulante/evidencia/save",cargarPostulantesProyecto,"postulanteId"); 
	       }
							
	       $("#modalEvalPostulante").hide();
	       $("#modalPostulante").show();	
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar el postulante!");
         }
      });		
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoPostulante(){
	cargarPostulantesProyecto();
}


function hallarEstadoPostulante(){
	var fechaInicio=$("#inputPostulantePlan").val();
	var fechaFin=$("#inputPostulanteReal").val();
	var hoyDia=obtenerFechaActual();
	var difInicio= restaFechas(hoyDia,fechaInicio);
	var difFinal= restaFechas(hoyDia,fechaFin);
	if(difInicio>0){
		postulanteEstado={id:"1",nombre:"Pendiente"};
	}else{
		if(difFinal>0){
			postulanteEstado={id:"2",nombre:"En Curso"};
		}else{
			postulanteEstado={id:"3",nombre:"Completado"};
		}
	}
	
	$("#postestado"+postulanteId).html(postulanteEstado.nombre+"");
	
}
 