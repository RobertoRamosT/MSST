var PreguntaCursoId;
var banderaEdicionObj;
var listFullPreguntas,listPregCategorias = [];
var preguntaCursoEdicion;
var countTblPreguntas = 0;
var mensajeUx;

function llamarPreguntasCurso(){
   PreguntaCursoId = 0;banderaEdicionObj = false;listFullPreguntas = [],listPregCategorias = [];
   
   $("#btnAgregarPregunta").show();$("#btnCancelarPregunta").hide();$("#btnEliminarPregunta").hide();
   $("#btnGuardarPregunta").hide();$("#btnImportarPreguntas").show();$("#btnClipboardPreguntas").show();
   $("#btnImportarPreguntas").attr("onclick","importarPreguntasCurso()");
   $("#btnClipboardPreguntas").attr("onclick","copiarClipboardPreguntasCurso()");
   
   var dataParam={
      id:cursoCapacitacionId
   };
	
   callAjaxPost(URL+'/capacitacion/curso/preguntas',dataParam,procesarRespuestaPreguntasCurso);
}

function procesarRespuestaPreguntasCurso(data){
   listFullPreguntas = data.list;listPregCategorias = data.listPregCategoria;
	
   $("#tblPregCurso tbody").html("");
	
   listFullPreguntas.forEach(function(val,index){
      var estadoObligatorio = (val.isObligatorio == 1?"Si":"No"),numContestadasTotal = val.numCorrectas+val.numIncorrectas,
         justificacion = (val.justificacion.length == 0?"------":val.justificacion),
         imagenNombre = (val.imagenNombre.length == 0?"------":val.imagenNombre);
       
      $("#tblPregCurso tbody").append(
         "<tr id='trPreg"+val.id+"' onclick='javascript:editarPregunta("+index+")'>" +
	    "<td id='preNom"+val.id+"' style='word-break:break-all;'>"+val.nombre+"</td>" +
	    "<td id='preOblig"+val.id+"'>"+estadoObligatorio+"</td>" +
	    "<td id='preCategoria"+val.id+"'>"+val.categoria.nombre+"</td>" +
	    "<td id='preNumOpc"+val.id+"'>"+val.numOpciones+"</td>" +
	    "<td id='preJust"+val.id+"'>"+justificacion+"</td>" +
	    "<td id='preImg"+val.id+"'>"+imagenNombre+"</td>" +
	    "<td id='precumpl"+val.id+"'>"+val.numCorrectas+"</td>" +
	    "<td id='preincumpl"+val.id+"'>"+val.numIncorrectas+"</td>" +
	    "<td id='preincumpl"+val.id+"'>"+numContestadasTotal+"</td>" +
         "</tr>");
   });
	
   if(countTblPreguntas == 0){
      countTblPreguntas++;
      $("#wrapper8").css({"height":$(window).height()-220+"px"});
      goheadfixedY("#tblPregCurso","#wrapper8");
   }
	
   formatoCeldaSombreableTabla(true,"tblPregCurso");
}

function verImagenPreviaPregunta(pindex){
   $('#mdCursoFecha').modal('hide'); 
    
   var dataParam={
      id:listFullPreguntas[pindex].id
   };
   
   var imagenNombre = listFullPreguntas[pindex].imagenNombre;
   
   $("#modalPreviewImagen").find(".modal-body").html("<i class='fa fa-spin fa-spinner'></i> Cargando");
   $("#modalPreviewImagen").find(".modal-body").show();$("#modalPreviewImagen").modal("show");
	
   if(imagenNombre != null){
      callAjaxPost(URL+'/capacitacion/curso/pregunta/imagen/preview',dataParam,function(data){
         var preguntaImagen = data.pregunta.imagen;
			
         $("#modalPreviewImagen").find(".modal-body").html(insertarImagenParaTablaMovil(preguntaImagen,"800px","100%"))
      });
   }else{
      alert("No hay imagen guardada");
   }

   $("#modalPreviewImagen").on("hidden.bs.modal",function(){
      $("#mdCursoFecha").modal("show");        
   });
}

function editarPregunta(pindex){
   if(!banderaEdicionObj){
      banderaEdicionObj = true;
	
      PreguntaCursoId = listFullPreguntas[pindex].id;
      preguntaCursoEdicion = listFullPreguntas[pindex];
      
      $("#trPreg"+PreguntaCursoId).addClass("fila-edicion");
      
      var selCategoriaPregunta = crearSelectOneMenu("selCategoriaPregunta","",listPregCategorias,
	 preguntaCursoEdicion.categoria.id,"id","nombre");
	      
      $("#preCategoria"+PreguntaCursoId).html(selCategoriaPregunta);
      
      var isOblig = (listFullPreguntas[pindex].isObligatorio == 1?true:false);
      $("#preOblig"+PreguntaCursoId).html("<input id='checkPregOblig' type='checkbox' class='form-control'>");
      $("#checkPregOblig").prop("checked",isOblig);
	
      $("#preNumOpc"+PreguntaCursoId).addClass("linkGosst").on("click",function(){verOpcionesPregunta();})
      .html(preguntaCursoEdicion.numOpciones+"<br><i class='fa fa-list-ul fa-2x' aria-hidden='true'></i>");
		
      $("#preNom"+PreguntaCursoId).html("<textarea id='textPreNom' class='form-control' rows='3'></textarea>");
      $("#textPreNom").val(listFullPreguntas[pindex].nombre);
      
      $("#preJust"+PreguntaCursoId).html("<input id='inputPreJust' class='form-control'>");
      $("#inputPreJust").val(listFullPreguntas[pindex].justificacion);
		
      var options={
         container:"#preImg"+PreguntaCursoId,functionCall:function(){
            validacionSubirEvidencia("ImagenPreg"+PreguntaCursoId,bitsEvidenciaImagenPregunta,"mdCursoFecha");
         },descargaUrl:"/capacitacion/curso/pregunta/imagen?preguntaId="+PreguntaCursoId,
         esNuevo:(listFullPreguntas[pindex].imagenNombre.length == 0?true:false),
         idAux:"ImagenPreg"+PreguntaCursoId,evidenciaNombre:listFullPreguntas[pindex].imagenNombre,
         mensajeAux:(listFullPreguntas[pindex].imagenNombre.length == 0?"":
            "<a class='efectoLink' onclick='verImagenPreviaPregunta("+pindex+")'>" +
               "<i class='fa fa-eye'></i> Vista previa" +
            "</a>")
      };

      crearFormEvidenciaCompleta(options);
      
      $("#btnAgregarPregunta").hide();$("#btnCancelarPregunta").show();$("#btnEliminarPregunta").show();
      $("#btnGuardarPregunta").show();$("#btnImportarPreguntas").hide();$("#btnClipboardPreguntas").hide();
		
      formatoCeldaSombreableTabla(false,"tblPregCurso");
   }
}

function verOpcionesPregunta(){
   $('#mdCursoFecha').modal('hide');
   
//   $("#mdCursoFecha .modal-title").html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> > " +
//      "<a onclick='volverPreguntasCurso()'>Pregunta '"+preguntaCursoEdicion.nombre+"'</a> > Opciones");
	
//   $("#btnAgregarOpcion").attr("onclick","nuevoOpcion()");$("#btnCancelarOpcion").attr("onclick","llamarOpcionesPregunta()");
//   $("#btnEliminarOpcion").attr("onclick","eliminarOpcion()");$("#btnGuardarOpcion").attr("onclick","guardarOpcionPregunta()");
   
   llamarOpcionesPregunta();
}

function volverPreguntasCurso(){
   $("#modalOpcionesPregunta").modal("hide");$('#mdCursoFecha').modal('show');$(".modal-body").hide();$("#modalPreguntasCurso").show();
   
   $("#mdCursoFecha .modal-title").html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> > Preguntas");
   
   if(actualizarModalPreguntas == 1){
      llamarPreguntasCurso();
   }
}

function nuevoPregunta(){
   if(!banderaEdicionObj){
      banderaEdicionObj = true;PreguntaCursoId = 0;
       
      var selCategoriaPregunta = crearSelectOneMenu("selCategoriaPregunta","",listPregCategorias,
	 "","id","nombre");
	
      $("#tblPregCurso tbody").append(
         "<tr id='trPreg0'>" +
            "<td>"+"<textarea id='textPreNom' class='form-control' rows='3'></textarea>"+"</td>" +
            "<td>"+"<input id='checkPregOblig' type='checkbox' class='form-control'>"+"</td>" +
            "<td>"+selCategoriaPregunta+"</td>" +
            "<td>...</td>" +
            "<td>"+"<input class='form-control' id='inputPreJust'>"+"</td>" +
            "<td id='preImg0'></td>" +
            "<td>0</td>" +
            "<td>0</td>" +
            "<td>0</td>" +
         "</tr>");
	
      formatoCeldaSombreableTabla(false,"tblPregCurso");
      
      var options={
         container:"#preImg"+PreguntaCursoId,functionCall:function(){
            validacionSubirEvidencia("ImagenPreg"+PreguntaCursoId,bitsEvidenciaImagenPregunta,"mdCursoFecha");
         },descargaUrl:"",esNuevo:true,idAux:"ImagenPreg"+PreguntaCursoId,evidenciaNombre:""
      };

      crearFormEvidenciaCompleta(options);
   
      $("#btnAgregarPregunta").hide();$("#btnCancelarPregunta").show();$("#btnEliminarPregunta").hide();
      $("#btnGuardarPregunta").show();$("#btnImportarPreguntas").hide();$("#btnClipboardPreguntas").hide();
   }else{
      alert("Guarde primero.");
   }
}

function eliminarPregunta(){
   $('#mdCursoFecha').modal('hide');
   
   var numContestadasTotal = preguntaCursoEdicion.numCorrectas+preguntaCursoEdicion.numIncorrectas;
   
   if(numContestadasTotal == 0){
      mensajeUx="<label>¿Está seguro de eliminar el registro de la pregunta seleccionada?" +
         "<br>(en caso de tener opciones adjuntas, también serán eliminadas en el proceso).</label>";
      mensajesUx(mensajeUx,3,"","EliminarPregCurso");
   
      $("#btnDevolverValorEliminarPregCurso").on("click",function(){
         var dataParam={
            id:PreguntaCursoId
         };

         callAjaxPostSimpleVersionDos(1,URL+'/capacitacion/curso/pregunta/delete',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
               case "05":
                  mensajeUx="<label>El registro de la pregunta seleccionada se ha eliminado correctamente.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarPregCurso");
        	
	          $("#modalMensajeUxActualizarPregCurso").on("hidden.bs.modal",function(){
		     $('#mdCursoFecha').modal('show');llamarPreguntasCurso();  
	          });
	       
	       break;
						
               default:
	          alert("Ocurrió un error al eliminar el registro de la pregunta!");
            }
         });
      });
      
      $("#btnRegresarPrevioEliminarPregCurso").on("click",function(){
         $('#mdCursoFecha').modal('show');
      });  
   }else{
      mensajeUx="<label>No puede eliminarse esta pregunta porque ha sido respondida una o más veces.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionPregCurso");
       
      $("#modalMensajeUxValidacionPregCurso").on("hidden.bs.modal",function(){
 	 $('#mdCursoFecha').modal('show');
      });
   }
}

function guardarPregunta(){
   var campoVacio = true; 
    
   var nombre = $("#textPreNom").val();
   var justificacion = $("#inputPreJust").val();
   var isOblig = ($("#checkPregOblig").prop("checked")?1:0);
   var inputEviImagenPreg = $("#inputEviImagenPreg"+PreguntaCursoId).val();
   var categoriaPreg = $("#selCategoriaPregunta").val();
	
   if(nombre.length == 0){
      campoVacio = false;mensajeUx = "<label>La descripción es obligatoria.</label>";
   }else if(inputEviImagenPreg == "VOLVER A SUBIR"){
      campoVacio = false;mensajeUx = "<label>Debe volver a subir la imagen descriptiva.</label>";
   }
	
   if(campoVacio){
      var dataParam={
	 id:PreguntaCursoId,nombre:nombre,isObligatorio:isOblig,justificacion:justificacion,cursoCapacitacionId:cursoCapacitacionId,
	 categoria: {id:categoriaPreg}
      };
		
      callAjaxPostSimpleVersionDos(1,URL+'/capacitacion/curso/pregunta/save',dataParam,1,0,function(data){
	 guardarEvidenciaAutoVersionTres(1,data.idNuevo,"fileEviImagenPreg"+PreguntaCursoId,bitsEvidenciaImagenPregunta,
	 0,1,"/capacitacion/curso/pregunta/imagen/save",function(){
            $('#mdCursoFecha').modal('hide');
             
            mensajeUx="<label>El registro de la pregunta fue guardado correctamente.</label>";
	    mensajesUx(mensajeUx,1,"","ActualizarPregCurso"); 
							   
	    $("#modalMensajeUxActualizarPregCurso").on("hidden.bs.modal",function(){
	       $('#mdCursoFecha').modal('show');llamarPreguntasCurso();
	    });
         },"preguntaId");
      });
   }else{
      $('#mdCursoFecha').modal('hide');
      mensajesUx(mensajeUx,2,"","ValidacionPregCurso");
      
      $("#modalMensajeUxValidacionPregCurso").on("hidden.bs.modal",function(){
	 $('#mdCursoFecha').modal('show');
      });
   }
}

function importarPreguntasCurso(){	
   $("#btnGuardarPregNuevos").attr("onclick","javascript:guardarMasivoPreguntasExcel();");
   $('#mdCursoFecha').modal('hide');$('#mdImpPregs').modal('show');$('#mdImpPregs .modal-body').show();
   
   $("#mdImpPregs").on("hidden.bs.modal",function(){
      $("#mdCursoFecha").modal("show");        
   });     
}

function guardarMasivoPreguntasExcel(){
   var texto = $("#txtListadoPreg").val();
   var listExcel = texto.split('\n');
   var listPregs = [];
   var preg = {};
   var listOpciones = [];
   var validado = "";
	
   if(texto.length < 20000){
      console.log(listExcel);
      for(var int=0;int<listExcel.length;int++){	
         var listCells = listExcel[int].split('\t');
         var filaTexto = listExcel[int];
			
         if(filaTexto.trim().length < 1){
	    validado = "Existen filas vacias.";
	    break;
         }

         if(validado.length < 1 && listCells.length != 3){
            validado = "No coincide el numero de celdas. "+listCells.length;
            break;
         }else{
	    var genero = {};
	    var opcion={
		   nombre:"",isCorrecto:0
		       };
				
	    for(var j=0;j<listCells.length;j++){
	       var element = listCells[j];
					
	       if(j == 1){
	          opcion.nombre = element.trim();
	       }
					
	       if(j == 2){
		  opcion.isCorrecto = parseInt(element.trim());
	       }
					
	       if(j == 0){
		  if(element.trim() == 0){
		  }else{
		     preg={
		        cursoCapacitacionId: cursoCapacitacionId,
		        nombre: element.trim(),
		        opciones: [],
		        justificacion: ""
			  };
		  }
	       }
	    }
			
	    preg.opciones.push(opcion);
				
	    if(listCells[0].length > 0){
	       listPregs.push(preg);
	    }else{
	    }
         }
      }
   }else{
      validado = "Ha excedido los 10000 caracteres permitidos.";
   }

   if(validado.length < 1){
      var r = confirm("¿Está seguro que desea subir estas "+listPregs.length+" pregunta(s)?");
		
      if(r == true){		
         console.log(listPregs);
         callAjaxPostNoLoad(URL+'/capacitacion/curso/preguntas/import',listPregs,
            funcionResultadoMasivoPreguntas,function(){
	       $('#mdImpPregs').modal('hide');
	       $("#tblPregCurso").find("tbody")
	       .html("<tr>" +
	       	        "<td colspan='4'>" +
		           "<i class='fa fa-spin fa-spinner'></i> Guardando Preguntas" +
		        "</td>" +
		     "</tr>")
						
	       return true;
         },{});
      }
   }else{
      alert(validado);
   }
}

function funcionResultadoMasivoPreguntas(){
   setTimeout(function(){
      $('#mdImpPregs').modal('hide');
      llamarPreguntasCurso();
   },2000)
}

function ordenarOpcionesRespondidas(tipoOrden,isAscendente){
   var factorAscendente = (parseInt(isAscendente) == 0?-1:1);
   var isNuevoAscendete = (parseInt(isAscendente) == 0?1:0);
	
   switch(parseInt(tipoOrden)){
      case 1:
         listFullPreguntas.sort(function(a,b){
	    return (a.numCorrectas - b.numCorrectas)*factorAscendente;
         });
         
         break;
         
      case 2:
         listFullPreguntas.sort(function(a,b){
	    return (a.numIncorrectas - b.numIncorrectas)*factorAscendente;
         });
         
         break;
         
      case 3:
         listFullPreguntas.sort(function(a,b){
	    return ((a.numCorrectas+a.numIncorrectas) - (b.numCorrectas+b.numIncorrectas))*factorAscendente;
         });
         
         break;
   }
	
   var data = {CODE_RESPONSE:"05",list:listFullPreguntas};
   procesarRespuestaPreguntasCurso(data)
	
   $(".fix-head #iconSortOpc"+tipoOrden+"").attr("onclick","ordenarOpcionesRespondidas("+tipoOrden+","+isNuevoAscendete+")")
   $("#iconSortOpc"+tipoOrden+"").attr("onclick","ordenarOpcionesRespondidas("+tipoOrden+","+isNuevoAscendete+")")	
}

function copiarClipboardPreguntasCurso(){
   var copytext = obtenerDatosBodyTablaEstandar("tblPregCurso");
   copiarAlPortapapeles(copytext,"btnClipboardPreguntas");
   
   $('#mdCursoFecha').modal('hide');
   
   mensajeUx="<label>Se ha copiado todo el contenido de la tabla actual en el clipboard.</label>";
   mensajesUx(mensajeUx,1,"","ActualizarPregCurso"); 
						   
   $("#modalMensajeUxActualizarPregCurso").on("hidden.bs.modal",function(){
      $('#mdCursoFecha').modal('show');
   });
}
