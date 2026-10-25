var hojaVidaTrabajadorId;
var subContratistaPreguntaObj=[];
var listPreguntas;
var estadoHojaVida;
var contratistaId;
var preguntaId;

/**
 * 
 */
function toggleMenuOpcionPreguntaSubContratista(obj,pindex){
   subContratistaPreguntaObj=listPreguntas[pindex]; 
   $(obj).parent(".detalleAccion").find("ul").toggle();	
   $(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
}
 
var funcionalidadesPreguntaSubContratista=[ 
    {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i>&nbspEditar",functionClick:function(data){editarPreguntaSubContratista()}},
    					  ]

function marcarSubOpcionPreguntaSubContratista(pindex){
	funcionalidadesPreguntaSubContratista[pindex].functionClick();
	$(".listaGestionGosst").hide();
}

function cargarPreguntaSubContratista(pindex){
   console.log("****** "+pindex);
   pindex=defaultFor(pindex,indexSubContratistaPregunta);
   //
   $(".divMovilPreguntaSubContratista").html("");	
   $("#divPreguntaSubCon"+listSubContratista[pindex].id)
   .siblings(".divMovilPreguntaSubContratista").hide();
   console.log("======> "+pindex);
   console.log(listSubContratista[pindex].id);
   $("#divPreguntaSubCon"+listSubContratista[pindex].id).show()
   //
   contratistaId = listSubContratista[pindex].id; 
	
   var dataParamAux={
	  id:contratistaId
		    };
    
   objSubContratista.id = contratistaId;
   indexSubContratistaPregunta = pindex;
	
   callAjaxPost(URL+'/contratista/subcontratista/pregunta',dataParamAux,function(data){
      if(data.CODE_RESPONSE == "05"){
         var menuOpcion="<ul class='list-group listaGestionGosst' >";
		 
         funcionalidadesPreguntaSubContratista.forEach(function(val1,index1){
            menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionPreguntaSubContratista("+index1+")'>"+
                            val1.nombre+
                        "</li>";
         });
	         
         menuOpcion+="</ul>";
					
         listPreguntas = data.listPreguntas;
         banderaEdicion69 = false;
	         
         var indicadorPositivo=0,indicadorTotal=0; 
					
         $("#divPreguntaSubCon"+listSubContratista[pindex].id).html("");
					
         listPreguntas.forEach(function(val,index){
            var eviNombre = (val.evidenciaPreguntaNombre==""?
        	             "<strong>(Sin Archivo)</strong>":
        	             "<a class='efectoLink' target='_blank' " +
			        "href='"+URL+"/contratista/subcontratista/pregunta/evidencia?id="+val.id+"'>"+
			         val.evidenciaPreguntaNombre+
			     "</a>");
		       
            var colorRegistro="";
//          console.log(val.tipoNota.id);
            switch(val.tipoNota.id){
	       case 1:
	          colorRegistro = "gosst-aprobado";
	          break;
			   
	       case 2:
		  colorRegistro = "gosst-desaprobado";
		  break;
			   
	       case 3:
		  colorRegistro = "gosst-advertencia";
		  break;
			   
	       case 4:
		  colorRegistro = "gosst-advertencia";
		  break;
			   
	       default:
		  colorRegistro = "gosst-neutral";
	       	  break;
            }
		         
            $("#divPreguntaSubCon"+listSubContratista[pindex].id)
	    .append("<div class='detalleAccion "+colorRegistro+"'> " +
	               "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionPreguntaSubContratista(this,"+index+")'>" +
		          "Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
		       "</a>"+ 
		        menuOpcion+
		       "<i aria-hidden='true' class='fa fa-book'></i><strong> Documento: "+val.pregunta.nombre + "<br>"+
		       "<i aria-hidden='true' class='fa fa-calendar'></i><strong> Fecha de registro: "+val.fechaRegistroTexto +"<br>"+
		       "<i aria-hidden='true' class='fa fa-download'></i>"+"<strong> Evidencia: "+eviNombre+
		           (val.tipoNota.id == 0?"":
		            "<br>"+val.tipoNota.icono+" Estado: "+val.tipoNota.nombre+
		                (val.evaluacionObservacion.length > 0?
			         "<br><i aria-hidden='true' class='fa fa-search'></i> Observación: "+val.evaluacionObservacion:""))+
		    "</div>");
         });
					
         $(".listaGestionGosst").hide();
         //$("#trPlanProyecto"+objTrabajadorContratista.id+" .celdaIndicadorProyecto").html(indicadorPositivo+" / "+listFullHojaVidaTrabajador.length)
         //formatoCeldaSombreableTabla(true,"tblActProyecto");
      }else{
         console.log("NOPNPO");	
      }
   });
}

function editarPreguntaSubContratista() {

   var listItemsExam=[
           {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviDocPregunta"},
           {sugerencia:"",label:"Observación",inputForm:"<input class='form-control' id='inputObservacionPreguntaSubCon'>"},
           {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
     		     ];

   var textFormExamen="";

   listItemsExam.forEach(function(val,index){
      textFormExamen+=obtenerSubPanelModulo(val);
   });

   var opciones={
      id:"modalEditarSubContratistaPregunta",nombre:"Editar registro documento",
      contenido:"<form id='formEditarSubContratistaPregunta' class='eventoGeneral'>"+textFormExamen+"</form>"
                }

   crearModalPrincipalUsuario(opciones,function(){},false,true);

   var editarDivPreguntaSubCon=$("#formEditarSubContratistaPregunta");

   editarDivPreguntaSubCon.on('submit',function(e){  
      e.preventDefault();
      guardarPreguntaSubContratista();
   });

   var options={
	  container:"#formEditarSubContratistaPregunta #eviDocPregunta",
	  functionCall:function(){},
	  descargaUrl: "/contratista/subcontratista/pregunta/evidencia?id="+subContratistaPreguntaObj.id,
	  esNuevo:false,
	  idAux:"DocPregunta"+subContratistaPreguntaObj.id,
	  evidenciaNombre:subContratistaPreguntaObj.evidenciaPreguntaNombre
	       };
	
   crearFormEvidenciaCompleta(options);
   
   editarDivPreguntaSubCon.find("#inputObservacionPreguntaSubCon").val(subContratistaPreguntaObj.observacion);
}

function guardarPreguntaSubContratista() {
    
   var textDiv ="#formEditarSubContratistaPregunta"; //Al editar el formulario
   var formDiv=$(textDiv);
   var campoVacio = true;
	
   var observacionPregunta=formDiv.find("#inputObservacionPreguntaSubCon").val();
   
   if(campoVacio){
      var dataParam={
	      id:subContratistaPreguntaObj.id,
	      pregunta:{id:subContratistaPreguntaObj.pregunta.id},
	      contratista:{id:contratistaId},
	      observacion:observacionPregunta
		    }

      callAjaxPost(URL+'/contratista/subcontratista/pregunta/save',dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":  		
		   guardarEvidenciaAuto(data.nuevaPreguntaId,"fileEviDocPregunta"+subContratistaPreguntaObj.id
					,bitsEvidenciaAccionMejora,"/contratista/subcontratista/pregunta/evidencia/save",
				       function(){
				          alert("Se registró correctamente su documento");
				          cargarPreguntaSubContratista(indexSubContratistaPregunta);
					  $("#modalEditarSubContratistaPregunta").modal("hide");
				          $("#modalEditarSubContratistaPregunta").remove();
				       }); 
		   break;
						
	       default:
		  console.log("Ocurrió un error al guardar!");
	    }
      });
			 
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoActProyecto(){
	cargarActProyectosSeguridad();
}
