var listFullFormacionesTrabajador=[];
var cursoExamenActual={};
var escondioAvisoCapacitacion=true;

function eliminarAvisoCapacitacionGosst(){
   $(".gosst-aviso").remove();
   escondioAvisoCapacitacion=true;
}

function verTutorialCapacitacion(){
   $("#videoCap").show();
   $("#videoCap").get(0).play();
}

function habilitarCapacitacionOnlineUsuario(){
    
   var capObj={
          contratistaAsociado:{id:getSession("contratistaGosstId")}
	      }
   
   $(".divListPrincipal").html("");
	
   callAjaxPost(URL+'/capacitacion',capObj,function(data){
      var capImplCounter = 0,capComplCounter = 0,capPasadoCounter = 0,capFuturoCounter = 0;
      var textImplementar="", textCompletado="", textFuturo="", textPasado="";
		
      var listPanelesPrincipal=[];
		
      listPanelesPrincipal.push(
         {id:"cursosImplementar",clase:"divProyectoGeneral",
	  nombre:"Por Llevar (<label></label>)",
	  contenido:textImplementar},
	 {id:"cursosCompletados",clase:"divProyectoGeneral",
	  nombre:"Completados (<label></label>)",
	  contenido:textCompletado},
	 {id:"cursosFuturos",clase:"divProyectoGeneral",
	  nombre:"Futuros (<label></label>)",
	  contenido:textFuturo},
	 {id:"cursosPasados",clase:"divProyectoGeneral",
	  nombre:"Anteriores (<label></label>)",
	  contenido:textPasado},
	 {id:"cursoExamenMovil",clase:"divCursoExamenMovil",
	  nombre:" Cargando",
	  contenido:""},
	 {id:"cursoEncuestaExamenMovil",clase:"divCursoExamenMovil",
	  nombre:" Cargando",
	  contenido:""} ,
	 {id:"cursoPreguntasExamenMovil",clase:"divCursoExamenMovil",
	  nombre:" Cargando",
	  contenido:""},
	 {id:"cursoResultadoExamenMovil",clase:"divCursoExamenMovil",
	  nombre:" Cargando",
	  contenido:""});
	
      agregarPanelesDivPrincipal(listPanelesPrincipal);
		
      var linkVIdeo="https://drive.google.com/open?id=1GXNXp5KGTcMJyNLh1GaV8DmYRPDtv2sp";
      var textoConfidencial=" Hola, si deseas ver un tutorial sobre como dar cursos online, " +
      		            "haz click <a href='"+linkVIdeo+"' target='_blank'> aquí </a>" +
			    "<br><br> GOSST" +
			    "<br><br> Tu Seguridad, Nuestra Cultura"+"<br>" +
			    "<video style='display:none' width='100%' id='videoCap' controls>"+
			       "<source src='../videos/video.mp4' type='video/mp4'>"+
		            "</video>" + "<br>" +
			    "<button class='btn btn-success' onclick='eliminarAvisoCapacitacionGosst()'>" +
			       "Esconder aviso" +
			    "</button>";
      
      $(".gosst-aviso").remove();
		
      if(!escondioAvisoCapacitacion){
         $(".divTituloFull").append("<div class='gosst-aviso'>"+textoConfidencial+"</div>"); 
      } 
		
      listFullFormacionesTrabajador=data.list;
		
      listFullFormacionesTrabajador.forEach(function(val,index){
         var cursosCap = val.cursos;
			
         cursosCap.forEach(function(val1,index1){
	    if(parseInt(val1.isOculto)!=1){ 
	       var textoSuspensivo = "";
	       var textoAvance = "("+val1.numPreguntas+" preguntas)";
				
	       if(val1.nombre.length > 90){
		  textoSuspensivo=" ..."
	       }
				
	       var textoCap=""+val1.nombre.substring(0,90)+textoSuspensivo+" ";
				
	       var textoCertificado=" "+"<a class='btn btn-success' onclick='verDetallesCurso("+index+","+index1+")'>" +
	       		                   "Ver Detalles" +
	       		                "</a>";
	       
	       var puntajeNoAprobado = true;
	       var textoPuntaje = ""; 
				
	       if(val1.evaluacion == null){
		  puntajeNoAprobado = true;
	       }else{ 
		  textoPuntaje="Puntaje Alcanzado: "+pasarDecimalPorcentaje(val1.evaluacion.puntajeAlcanzado,2)+"<br>";
				
		  if((val1.puntajeMinimo/100) > val1.evaluacion.puntajeAlcanzado){
		     puntajeNoAprobado = true;
		     textoCertificado = "<a class='btn btn-success' role='button' " +
		     		           "onclick='verDetallesCurso("+index+","+index1+")'>" +
		     		           "Ver Detalles" +
		     		        "</a>"
		  }else{
		     puntajeNoAprobado = false;
					
		     textoCertificado = "<a class='btn btn-success' style='margin-bottom: 10px; margin-top: 5px;' role='button'  " +
					   "onclick='javascript:descargarCertificadoCurso("+val1.id+")' title=''>" +
					   "<i class='fa fa-certificate' aria-hidden='true'></i> Descargar Certificado" +
					"</a><br>" +
				        "<a class='btn btn-success' role='button' " +
					   "onclick='verDetallesCurso("+index+","+index1+")'>" +
					   "Ver Detalles" +
					"</a>";
		  }
	       }
				
	       var noticia = "<div class='cropGosst'>"+
	                         insertarImagenParaTablaMovil(val1.evidencia,"300px","100%");+
	                     "</div>";
	                         
	       var divCursoAsoc;
	       var textoAuxiliar = "";
				
	       if(val1.estado.id==2 && puntajeNoAprobado){
		  capImplCounter+=1;
		  divCursoAsoc=$("#cursosImplementar"); 
	       }else{
	          if(val1.estado.id==1){
		     divCursoAsoc = $("#cursosFuturos");
		     capFuturoCounter+=1;
		     textoCertificado = "Disponible: "+convertirFechaNormal(val1.fechaInicio);
	          }
					
	          if(val1.estado.id==2){
		     textoCertificado=(val1.wantsCertificado==1?
			               textoCertificado:
			               "<a class='btn btn-success' role='button' " +
			                  "onclick='verDetallesCurso("+index+","+index1+")'>" +
			                  "Ver Detalles" +
			               "</a>");
						
		     divCursoAsoc = $("#cursosCompletados");
		     capComplCounter+=1; 
	          }
					
	          if(val1.estado.id==3){
		     textoCertificado=(val1.wantsCertificado==1?
			               textoCertificado:
			               "<a class='btn btn-success' role='button' " +
			                  "onclick='verDetallesCurso("+index+","+index1+")'>" +
			                  "Ver Detalles" +
			               "</a>");
						
		     divCursoAsoc=$("#cursosPasados");
		     capPasadoCounter++; 
	          }
					
	          var btnIniciarCurso="<button class='btn-success btn' " +
	          		              "onclick='iniciarCursoPsicologia("+index+","+index1+")'>" +
	          		         "<i class='fa fa-image' aria-hidden='true'></i> Iniciar evaluación" +
	          		      "</button>";
	          
	          if(val1.estado.id == 2 && puntajeNoAprobado){ 
		     textoAuxiliar = btnIniciarCurso;
	          }else{ 
		     if(val1.estado.id == 1){  
		        textoAuxiliar = "Disponible: "+convertirFechaNormal(val1.fechaInicio); 
		     }
						
		     if(val1.estado.id == 2){ 
		        textoAuxiliar = "<label>Completado <label>";
		     }
						
		     if(val1.estado.id == 3){
		        textoAuxiliar = "<label>Cerrado<label>"; 
		     }
	          }
					
	          if(val1.estado.id == 3){
		     textoAuxiliar= "<label>Cerrado<label>"; 
	          } 
	       } 
					
	       divCursoAsoc.find(".contenidoSubList")
	       .append("<div class='eventoGeneral' id='cursoMovil"+val1.id+"'>" +
		          "<div id='tituloEvento'>" +
			     "<table class='table table-capacitacion-movil'>" +
			        "<tbody>" +
				   "<tr>" +
				      "<td>"+"<i aria-hidden='true' class='fa fa-graduation-cap'></i>"+"</td>" +
				      "<td>"+"<strong>"+val.capacitacionNombre+"</strong></td>" +
				   "</tr>" +
				   "<tr>" +
				      "<td>"+"<i aria-hidden='true' class='fa fa-info'></i>"+"</td>" +
				      "<td>"+"<strong>"+textoCap+" "+textoAvance+"</strong></td>" +
				   "</tr>" +
				   "<tr>" +
				      "<td>"+"<i aria-hidden='true' class='fa  fa-check-square-o'></i>"+"</td>" +
				      "<td>"+"Puntaje Mínimo: "+pasarDecimalPorcentaje(val1.puntajeMinimo/100,2)+"</td>" +
				   "</tr>" +
				   "<tr>" +
				      "<td colspan='3'>"+noticia+"</td>" +
				   "</tr>"+
				   "<tr>" + 
				      "<td colspan='3' style='text-align:center;font-size:15px;'>"+
				          textoPuntaje+" "+textoCertificado+
				      "</td>" + 
				   "</tr>" +
				"</tbody>" +
		             "</table>"+ 
			  "</div>"+
		       "</div>" );
	    }		
         });
      });
		
      $("#cursosImplementar").find(".tituloSubList label").html(capImplCounter);
      $("#cursosCompletados").find(".tituloSubList label").html(capComplCounter);
      $("#cursosFuturos").find(".tituloSubList label").html(capFuturoCounter);
      $("#cursosPasados").find(".tituloSubList label").html(capPasadoCounter);
   }); 
}

function verDetallesCurso(indCap,indCurso){
	var capObj=listFullFormacionesTrabajador[indCap];
	var capActual=listFullFormacionesTrabajador[indCap].cursos
	cursoExamenActual=capActual[indCurso];
	$(".divListPrincipal>div").hide();
	$("#cursoExamenMovil").show();
	$("#cursoExamenMovil").find(".tituloSubList").html(textoBotonVolverContenido+" Curso '"+cursoExamenActual.nombre+"'");
	$("#cursoExamenMovil").find(".tituloSubList").find("button").hide();
	var textCarga="" +
	"<table  class='table tableCursoGosst table-bordered ' >" +
	"<thead>" +
	"<tr>" +
	"<td>" +
	"<i class='fa fa-spin fa-spinner fa 2x' style='color:#19958E; font-size: 20px;'></i><label style='font-size:20px'>Cargando</label>" +
	"</td>" +
	"</thead>" +
	"</table"; 
	$("#cursoExamenMovil").find(".contenidoSubList").show().html("<div class='cargaDetalleCurso'>"+textCarga+"</div>");
	
	var imagenCap="<img></img>";
	if(cursoExamenActual.evidencia!=null){
		imagenCap=	insertarImagenParaTablaMovil(cursoExamenActual.evidencia,"250px","100%");	
	}
	var dataParam={
				id:cursoExamenActual.id,
				contratistaAsociado:{ id: getSession("contratistaGosstId") }
				};

	
	var butonFinal="<button class='btn btn-success' onclick='verEncuestaCurso();'>" +
	"<i class='fa fa-align-left'> </i>" +
	"&nbsp;Encuesta y Evaluación" +
	"&nbsp;<i class='fa fa-angle-right'> </i></button>";
	
	
	var isPasado=2;
	var puntajeNoAprobado=true;
	if(cursoExamenActual.evaluacion==null){
		puntajeNoAprobado=true;
	}else{
		if((cursoExamenActual.puntajeMinimo/100)>
		cursoExamenActual.evaluacion.puntajeAlcanzado){
			puntajeNoAprobado=true;
			isPasado=2	
		}else{
			puntajeNoAprobado=false;
			isPasado=1
		}
		
	}
	if(cursoExamenActual.estado.id==2 && puntajeNoAprobado){
		isPasado=0
	}else{
		if(cursoExamenActual.estado.id==1){
			 
		}
		if(cursoExamenActual.estado.id==2){
			if(puntajeNoAprobado){
				isPasado=2;
			}else{ 
				isPasado=1;
			}
		}
		if(cursoExamenActual.estado.id==3){
			if(puntajeNoAprobado){
				isPasado=2;
			}else{ 
				isPasado=1;
			}
		}
	}
	
	if(isPasado==1){
		butonFinal="<button class='btn btn-success' onclick='descargarCertificadoCurso("+cursoExamenActual.id+");' '>" +
		"<i class='fa fa-certificate'> </i>" +
		"&nbsp;Descargar Certificado" +
		"</button>";
		butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
	}
	if(isPasado==2){
		butonFinal="<button class='btn btn-info' onclick='alertarCertificado()' '>" +
		"<i class='fa fa-certificate'> </i>" +
		"&nbsp;Descargar Certificado" +
		"</button>";
		butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
	}
	$("#cursoExamenMovil").find(".contenidoSubList")  
	.append("<div class='imgDetalleCurso'>"+""+"</div>" +
			"<div class='textDetalleCurso'>"+""+"</div>" +
			"<div class='relDetalleCurso'>"+""+"</div>" +
			"<div class='ratingDetalleCurso'>"+""+"</div>" +
			"<div class='objDetalleCurso'>"+""+"</div>" +
			"<div class='profeDetalleCurso'>"+""+"</div>" +
			"<div class='videoDetalleCurso'>"+""+"</div>" +
			"<div class='archDetalleCurso'>"+""+"</div>" +
			"<div class='enlDetalleCurso'>"+""+"</div>"  +
			"<div class='btnDetalleCurso'>"+""+"</div>"  
			);
	$(".divDetalleCurso button").hide();
	$(".imgDetalleCurso").html(
	crearDivInformacionCurso("Imagen curso",[imagenCap]) 
 
	);
	$(".textDetalleCurso").html(
	crearDivInformacionCurso("Información general",
			["<strong>Nota Mínima:  </strong>"+cursoExamenActual.puntajeMinimo+"% <br>" +
			"<strong>Tiempo de resolución: </strong>"+cursoExamenActual.tiempoSolucion+" hora(s) <br>" +
			"<strong>Descripción: </strong>"+cursoExamenActual.descripcion]) 
 
	 
			); 
$(".relDetalleCurso").hide();
$(".ratingDetalleCurso").hide();
$(".objDetalleCurso").hide();
$(".profeDetalleCurso").hide();
$(".relDetalleCurso").hide();
$(".archDetalleCurso").hide();
$(".enlDetalleCurso").hide();
$(".videoDetalleCurso").hide();
var llamadasRealizadas=0;
function mostrarTodoDiv(){
	llamadasRealizadas++;
	if(llamadasRealizadas==5){		
		llamadasRealizadas=0;
		$(".relDetalleCurso").show(); 
		$(".objDetalleCurso").show();
		$(".profeDetalleCurso").show();
		$(".relDetalleCurso").show();
		$(".archDetalleCurso").show();
		$(".enlDetalleCurso").show();
		$(".videoDetalleCurso").show();
		$(".cargaDetalleCurso").remove();
		$("#cursoExamenMovil").find(".tituloSubList").find("button").show();
		$(".btnDetalleCurso").html(	crearDivInformacionCurso(butonFinal,[]) );
		window.scrollTo(0,0);
	}
}
callAjaxPostNoLoad(URL + '/capacitacion/curso/evaluacion', dataParam, function(data) {
	var eval=data.list;
	mostrarTodoDiv();
	
	if(eval.length==0){
		eval={
				id:0,
				numIntentos:0,
				cursoId:cursoExamenActual.id,
				rating:0,
				puntajeAlcanzado:0,
				trabajadorId:(sessionStorage.getItem("trabajadorGosstId"))
		}
		if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
			eval={
					id:0,
					numIntentos:0,
					cursoId:cursoExamenActual.id,
					rating:0,
					puntajeAlcanzado:0,
					contratistaAsociado:{id:(sessionStorage.getItem("contratistaGosstId"))}
			}
		}
		cursoExamenActual.evaluacion=eval;
	}else{
		cursoExamenActual.evaluacion=eval[0];
	}
	//Rating Promedio
	var ratingProm=cursoExamenActual.ratingPromedio;
	var ratingPersonal=cursoExamenActual.evaluacion.rating;
	var textRatingPersonal="";
	for(var i=0;i<5;i++){
		if(i<ratingPersonal){
			textRatingPersonal+="<i class='fa fa-star fa-2x ' id='ratingGosst"+(i+1)+"'></i>";
		}else{
			textRatingPersonal+="<i class='fa fa-star-o fa-2x ' id='ratingGosst"+(i+1)+"'></i>";
		}
		
	}
	if(cursoExamenActual.evaluacion.id==0){
		textRatingPersonal="Sin evaluar";
	}
	$(".ratingDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
			"<thead>" +
			"<tr>" +
			"<td>Valoración </td>" +
			"</tr>" +
			"</thead>" +
			"<tbody>" +
			"<tr><td>Promedio: "+ratingProm+"</td></tr>" +
			"<tr><td style='color: #19958e;'>Personal: "+textRatingPersonal+"</td></tr>" +
			"" +
			"</tbody>" +
			"</table>");
	
	
	
	

});
 
callAjaxPostNoLoad(URL + '/capacitacion/curso/relacionados/trabajador', dataParam, function(data) {
	var relacionados=data.list;
	$(".relDetalleCurso").html( "<div class='divInformacionCurso'>" +
			"<div class='divNombrePregunta'>Cursos relacionados</div>" +
			"<div class='divDetalleInformacion'> </div>" +
			"</div>");
	var listCursosTexto=[];
	relacionados.forEach(function(val,index){
		var cursoRelacionadoId=val.id;
		var evaluacion=val.evaluacion;
		if(evaluacion==null){
			evaluacion={evaluacionNombre:"No",puntajeAlcanzado:"--",evaluacionId:2}
		}
		if(evaluacion.evaluacionId!=1){
			butonFinal="<button class='btn btn-success' onclick='alertMensajeCurso();'>" +
			"<i class='fa fa-align-left'> </i>" +
			"&nbsp;Cursos pendientes" +
			"&nbsp;<i class='fa fa-angle-right'> </i></button>";
		}
		listCursosTexto
		.push("" +
				"<label style='font-size: 21px'>" +val.nombre+"</label>"+
				"<br> Puntaje Alcanzado: " +pasarDecimalPorcentaje(evaluacion.puntajeAlcanzado)+" "+
				"<br> Puntaje Mínimo" +pasarDecimalPorcentaje(val.puntajeMinimo/100)+
				"<br><strong>" +evaluacion.evaluacionNombre+" Cumple </strong> " );
	});
$(".relDetalleCurso").html( 
	crearDivInformacionCurso("Cursos relacionados",listCursosTexto)
	)
	if(relacionados.length==0){
		$(".relDetalleCurso").remove();
	}
	mostrarTodoDiv();
	
});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/objetivos', dataParam, function(data) {
		var objetivos=data.list;
		var listObjetivoTexto=[];
		mostrarTodoDiv(); 
		objetivos.forEach(function(val,index){
		listObjetivoTexto
		.push(" &#8226; " +val.nombre ); 
		})
	$(".objDetalleCurso").html( 
	crearDivInformacionCurso("Objetivos del curso",listObjetivoTexto)
	)
		
	});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/archivos', dataParam, function(data) {
		var archivos=data.list;
		var listArchivoTexto=[];
		mostrarTodoDiv(); 
		archivos.forEach(function(val,index){
			var archivoCursoId=val.id;
			listArchivoTexto
			.push(	" " +val.nombre+" " +
						(val.observacion==""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+""+
					"<br><br><a class='btn btn-success' target='_blank' href='"+URL
				+ "/capacitacion/curso/archivo/evidencia?archivoId="
				+ archivoCursoId+"''><i class='fa fa-download'></i>Descargar</a>" );
		})
		$(".archDetalleCurso").html( 
		crearDivInformacionCurso("Material del curso",listArchivoTexto)
		);
	});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/enlaces', dataParam, function(data) {
		var enlaces=data.list;
		var listVideoTexto=[];
		var listEnlaceTexto=[];
		mostrarTodoDiv();  
		
		enlaces.forEach(function(val,index){
			var enlaceId=val.id;
			if(val.tipo.id==1){
				listVideoTexto
				.push( 
						" " +val.nombre+" " +
						(val.observacion==""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+""+
						"<br><br><a class='btn btn-success' target='_blank' href='"+val.nombre+"'>" +
								"<i class='fa  fa-external-link'></i>Ir al sitio</a>" );
			}else{
				listEnlaceTexto
				.push( 
						" " +val.nombre+" " +
						(val.observacion==""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+""+
						"<br><br><a class='btn btn-success' target='_blank' href='"+val.nombre+"'>" +
								"<i class='fa  fa-external-link'></i>Ir al sitio</a>" );
			}
			
		});
		$(".videoDetalleCurso").html( 
		crearDivInformacionCurso("Video del curso",listVideoTexto)
		);
		$(".enlDetalleCurso").html( 
		crearDivInformacionCurso("Enlaces de apoyo",listEnlaceTexto)
		);
	});
	
	//Info del profe
	callAjaxPostNoLoad(URL + '/capacitacion/curso/profesor', dataParam, function(data) {
		var profesor=data.profesor;
		mostrarTodoDiv();  
		
		var listProfesorTexto=[
		insertarImagenParaTablaMovil(profesor.foto,"250px","100%"),
		"<strong>Nombre:</strong> "+profesor.nombre+
		"<br><strong>Experiencia:</strong> "+profesor.experiencia+
		"<br><strong>Correo:</strong> "+profesor.correo];
		$(".profeDetalleCurso").html(
			crearDivInformacionCurso("Facilitador",listProfesorTexto)
			 );
		
	})
	
}


 

function verEncuestaCurso(){
	//
	window.scrollTo(0,0);
	$(".divListPrincipal>div").hide();
	$("#cursoEncuestaExamenMovil").show(); 
	
	$("#cursoEncuestaExamenMovil").find(".contenidoSubList").show().html("");  
	$("#cursoEncuestaExamenMovil").find(".tituloSubList").html(textoBotonVolverContenido+" Encuesta Curso '"+cursoExamenActual.nombre+"'");
	
	var textoRatingList=["¿La plataforma es sencilla y manejable?" 
	," ¿Considera que el contenido del curso es claro y entendible?" 
	,"¿Considera que el curso tendrá un impacto positivo en su seguridad laboral?" 
	,"En términos generales, ¿Cuán satisfecho se siente con el curso?" 
	,"Bridanos tus comentario con respecto al curso. ¿Que aspectos son " +
			"de mayor agrado y provecho para ti? y ¿Que aspectos de mejoras consideras que se deben tomar?" ]
var estrellasRating=
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst1'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst2'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst3'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst4'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst5'></i>";
	var buttonEnviar="<button class='btn btn-success'><i class='fa fa-paper-plane '></i>Enviar</button>";
	
	textoRatingList.forEach(function(val,index){
		if(index+1==5){
			$("#cursoEncuestaExamenMovil").find(".contenidoSubList").append(
					crearDivInformacionCurso(val,["<textarea style='height:100px' id='comentarioRating' class='form-control'></textarea>"],"pregEncuesta"+(index+1) )
					 );
		}else{
			$("#cursoEncuestaExamenMovil").find(".contenidoSubList").append(
					crearDivInformacionCurso(val,[ 
                       "<div style='width:50%;display:inline-block'>Totalmente en desacuerdo</div>" +
                   		"<div style='width:50%;display:inline-block'>Totalmente de acuerdo</div>",estrellasRating ],"pregEncuesta"+(index+1) )
					 );	 
		}
		
	});
		$("#cursoEncuestaExamenMovil").find(".contenidoSubList").append(
				"<div class='btnEmpezarCurso'>"+
			crearDivInformacionCurso(buttonEnviar,[])+
			"</div>"
			 ); 
	
	$("#pregEncuesta1 i").hover(function(){
		$(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).removeClass("fa-star").addClass("fa-star-o");
		
		$(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
		$(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
		$(this).addClass("fa-star");
		$(this).removeClass("fa-star-o");
		
	});
	$("#pregEncuesta2 i").hover(function(){
		$(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).removeClass("fa-star").addClass("fa-star-o");
		
		$(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
		$(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
		$(this).addClass("fa-star");
		$(this).removeClass("fa-star-o");
		
	});
	$("#pregEncuesta3 i").hover(function(){
		$(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).removeClass("fa-star").addClass("fa-star-o");
		
		$(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
		$(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
		$(this).addClass("fa-star");
		$(this).removeClass("fa-star-o");
		
	});
	$("#pregEncuesta4 i").hover(function(){
		$(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
		$(this).removeClass("fa-star").addClass("fa-star-o");
		
		$(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
		$(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
		$(this).addClass("fa-star");
		$(this).removeClass("fa-star-o");
		
	});
	
	$("#cursoEncuestaExamenMovil .btnEmpezarCurso button").on("click",function(){
		var nivel_sencillo=0;
		var nivel_claro=0;
		var nivel_impacto=0;
		var rating=0;
		
		
		$("#pregEncuesta1 i").each(function(index,elem){
			if($(elem).hasClass("fa-star")){
				nivel_sencillo++;
			}
		});
		$("#pregEncuesta2 i").each(function(index,elem){
			if($(elem).hasClass("fa-star")){
				nivel_claro++;
			}
		});
		$("#pregEncuesta3 i").each(function(index,elem){
			if($(elem).hasClass("fa-star")){
				nivel_impacto++;
			}
		});
		$("#pregEncuesta4 i").each(function(index,elem){
			if($(elem).hasClass("fa-star")){
				rating++;
			}
		}); 
		cursoExamenActual.evaluacion.nivelSencillo=nivel_sencillo;
		cursoExamenActual.evaluacion.nivelClaro=nivel_claro;
		cursoExamenActual.evaluacion.nivelImpacto=nivel_impacto;
		cursoExamenActual.evaluacion.rating=rating;
		cursoExamenActual.evaluacion.sugerencia=$("#comentarioRating").val();

		verAlertaSistemaGosst(3,"¡Gracias por participar en la encuesta!")
		empezarExamenCurso();
	});
	
	//
}

function crearDivInformacionCurso(tittuloDiv,contenidoListDiv,idDiv){
	var textoIn="";
	contenidoListDiv.forEach(function(val,index){
	textoIn+="<div class='divSubDetalleInformacion'>"+
				val+
				"</div>";
	});
if(idDiv!=null){
	idDiv="id='"+idDiv+"'";
}
	return "<div class='divInformacionCurso' "+idDiv+ " >" +
				"<div class='divNombrePregunta'>"+tittuloDiv+"</div>" +
				"<div class='divDetalleInformacion'>"+
				   textoIn
				" </div>" +
				"</div>" ;
}
var textoBotonTogglePregunta="<button class='btn btn-success'  onclick='cambiarDivSubPregunta(this)'>" +
"<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>";
function cambiarDivSubPregunta(obj){
	$(obj).parent(".divNombrePregunta").siblings( ".divOpcionesGosst" ).toggle();
}
function crearDivExamenCurso(tittuloDiv,contenidoListDiv,idDiv){
	var textoIn="";
	contenidoListDiv.forEach(function(val,index){
		var clickFunction="llenarRespuestaPreguntaCapacitacion(this)"
		if(val.isImagen){
			clickFunction="";
		}
	textoIn+="<div class='opcionGosstCss' onclick='"+clickFunction+"'>"+
				val.nombre+
				"</div>";
	});
if(idDiv!=null){
	idDiv="id='"+idDiv+"'";
}
	return "<div class='divInformacionCurso' "+idDiv+ " >" +
				"<div class='divNombrePregunta'>"+textoBotonTogglePregunta+
				tittuloDiv+"" +
						"<br><label class='respuestaPregunta'></label></div>" +
				"<div class='divOpcionesGosst'>"+
				   textoIn
				" </div>" +
				"</div>" ;
}
var resolviendoExamen=false;
var contadorNoIniciado=true;
var isInduccionVirtual = 0;
function empezarExamenCursoVirtual(isInduccion){
	if(isInduccion != null){
		isInduccionVirtual = parseInt(isInduccion);
	}
	$(".divListPrincipal>div").hide();
	$("#cursoPreguntasExamenMovil").show(); 
	
	 resolviendoExamen=true;
	 $("#cursoPreguntasExamenMovil").find(".tituloSubList")
		.html(" ");
	$("#cursoPreguntasExamenMovil").find(".tituloSubList")
	.html("<div class='col-md-8 divCursoNombreMovil'>" +
			"<i class='fa fa-file-text-o' aria-hidden='true'></i>"+
			"Examen del Curso "+cursoExamenActual.nombre+"<br>"+
			
			"<div id='timerActual'></div>"+
			"</div>" +
			"<div class='col-md-4'>"+
			"<i class='fa fa-check-circle-o' aria-hidden='true'></i>" +
			
			" Intentos: "+cursoExamenActual.evaluacion.numIntentos+
			
			"</div>"
			);
   var cursoAux={
      id:cursoExamenActual.id,verImagenPregunta: 1
   };

   callAjaxPostNoLoad(URL+'/capacitacion/curso/preguntas',cursoAux,function(data){
      setTimeout(function(){
         var preguntasImagen = data.list;
         
         var preguntasObligadas = [],preguntasOpcionales = [];
         
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList").show().html("");  
		
         preguntasImagen.forEach(function(val,index){
	    if(val.isObligatorio == 1){
	       preguntasObligadas.push(val);
	    }else{
	       preguntasOpcionales.push(val);
	    }
         });
		
         shuffleTest(preguntasObligadas);
         shuffleTest(preguntasOpcionales);
         cursoExamenActual.preguntas = preguntasObligadas.concat(preguntasOpcionales);
         
         if(cursoExamenActual.numPreguntas == null || cursoExamenActual.numPreguntas == 0){
	    cursoExamenActual.numPreguntas = cursoExamenActual.preguntas.length;
         }
         
         var numPregCategoria1 = 0,numPregCategoria2 = 0,numPregCategoria3 = 0,indexCategoria = 0;
		
         cursoExamenActual.preguntas.forEach(function(val,index){
            var evaluarPregunta = false;
             
            if(cursoExamenActual.aplicarCategoria == 0 && index < cursoExamenActual.numPreguntas){
               evaluarPregunta = true;
            }else if(cursoExamenActual.aplicarCategoria == 1){
               if((val.categoria.id == 1 && numPregCategoria1 < cursoExamenActual.numPreguntasCategoria1) || 
         	  (val.categoria.id == 2 && numPregCategoria2 < cursoExamenActual.numPreguntasCategoria2) || 
         	  (val.categoria.id == 3 && numPregCategoria3 < cursoExamenActual.numPreguntasCategoria3)){
         	  evaluarPregunta = true; 
               }
            }
              
 	    if(evaluarPregunta){
	       var opciones = val.opciones,textOpc = [],textImagen = "";
	       val.isEvaluado = 1;val.ordenExamen = (cursoExamenActual.aplicarCategoria == 0?index+1:indexCategoria+1);
			
	       if(val.imagen != null){
		  textImagen = insertarImagenParaTablaMovil(val.imagen,"","100%");
		  textOpc.push({nombre:textImagen,isImagen:true});
	       }
			
	       opciones.forEach(function(val1,index1){
	          textOpc.push({nombre:"<input type='radio' name='optionFamily"+val.id+"' id='optionId"+val1.id+"'>" +
	          		       "<label for='optionId"+val1.id+"'>"+val1.nombre+"</label>",isImagen:false});
	       }); 
			
	       $("#cursoPreguntasExamenMovil").find(".contenidoSubList")
	       .append(crearDivExamenCurso((val.ordenExamen)+".&nbsp;"+val.nombre,textOpc,"preguntaId"+val.id));
	       

	       if(cursoExamenActual.aplicarCategoria == 1){
		  if(val.categoria.id == 1){
		     numPregCategoria1++; 
		  }else if(val.categoria.id == 2){
		     numPregCategoria2++;  
		  }else if(val.categoria.id == 3){
		     numPregCategoria3++;  
		  }
		  
		  indexCategoria++;
	       }
 	    }else{
	       val.isEvaluado=0;
 	    }
         });
		
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList").append(
				"<div class='btnCompletarCurso'>"+
			crearDivInformacionCurso("<button class='btn btn-success' " +
					"onclick='completarExamenCurso("+isInduccionVirtual+")'>Completar Examen" +
					"&nbsp;<i class='fa fa-angle-right'> </i></button>",[])+
			"</div>"
			 ); 
		window.scrollTo(0,0);
		contadorNoIniciado=true;console.log("inicio");
		countdown();
	},2000)},preCargaExamenImagen,{});
	
}

function empezarExamenCurso(){
   $(".divListPrincipal>div").hide();
   $("#cursoPreguntasExamenMovil").show(); 
	
   resolviendoExamen=true;
	 
   $("#cursoPreguntasExamenMovil").find(".tituloSubList")
   .html(" ");
	
   $("#cursoPreguntasExamenMovil").find(".tituloSubList")
   .html("<div class='col-md-8'>" +
            "<i class='fa fa-file-text-o' aria-hidden='true'></i> "+
	       "Examen del Curso "+cursoExamenActual.nombre+"<br>"+
	    "<div id='timerActual'></div>"+
	 "</div>" +
	 "<div class='col-md-4'>"+
	    "<i class='fa fa-check-circle-o' aria-hidden='true'></i> " +
	       "Intentos: "+cursoExamenActual.evaluacion.numIntentos+
	 "</div>");
   
   var cursoAux={
          id: cursoExamenActual.id,
          verImagenPregunta: 1
   		}
   
   callAjaxPostNoLoad(URL+'/capacitacion/curso/preguntas',cursoAux,function(data){
      setTimeout(function(){
		
         var preguntasImagen=data.list;
         var preguntasObligadas=[];
         var preguntasOpcionales=[];
		
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList").show().html("");  
		
         preguntasImagen.forEach(function(val,index){
	    if(val.isObligatorio==1){
	       preguntasObligadas.push(val);
	    }else{
	       preguntasOpcionales.push(val);
	    }
         });
		
         shuffleTest(preguntasObligadas);
         shuffleTest(preguntasOpcionales);
		
         cursoExamenActual.preguntas=preguntasObligadas.concat(preguntasOpcionales);
		
         if(cursoExamenActual.numPreguntas==null || cursoExamenActual.numPreguntas==0){
	    cursoExamenActual.numPreguntas=cursoExamenActual.preguntas.length
         }
		
         cursoExamenActual.preguntas.forEach(function(val,index){
	    if(index<cursoExamenActual.numPreguntas){
	       var opciones=val.opciones;
	       var textOpc=[];
	       var textImagen="";
			
	       val.isEvaluado=1;
	       val.ordenExamen=index+1;
			
	       if(val.imagen!=null){
	          textImagen=insertarImagenParaTablaMovil(val.imagen,"","100%");
	          textOpc.push({nombre:textImagen,isImagen:true});
	       }
			
	       opciones.forEach(function(val1,index1){
	          textOpc.push({
	             nombre:"<input type='radio' name='optionFamily"+val.id+"' " +
				   "id='optionId"+val1.id+"'>" +
		            "<label for='optionId"+val1.id+"'>"+val1.nombre+"</label>" +
			    " ",isImagen:false});
	       }); 
			
	       $("#cursoPreguntasExamenMovil").find(".contenidoSubList").append(
		  crearDivExamenCurso((index+1)+".&nbsp;"+val.nombre,textOpc,"preguntaId"+val.id)
	       )
	    }else{
	       val.isEvaluado = 0;
	    }
         });
		
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList")
         .append("<div class='btnCompletarCurso'>"+
		     crearDivInformacionCurso("<button class='btn btn-success' " +
					              "onclick='completarExamenCurso()'>" +
					         "Completar Examen"+"&nbsp;<i class='fa fa-angle-right'></i>" +
					      "</button>",[])+
	         "</div>");
         
         window.scrollTo(0,0);
         contadorNoIniciado=true;
         countdown();
      },2000)},preCargaExamenImagen,{});
}

function llenarRespuestaPreguntaCapacitacion(obj){
   $(obj).find("input").prop("checked",true);
	
   var opcionTexto=$(obj).find("label").text(); 
	
   $(obj).parent(".divOpcionesGosst").hide();
   $(obj).parent(".divOpcionesGosst").parent(".divInformacionCurso")
   .find(".respuestaPregunta").show().html(opcionTexto);
}

function preCargaExamenImagen(){
   $("#cursoPreguntasExamenMovil").show(); 
   $("#cursoPreguntasExamenMovil").find(".contenidoSubList").show()
   .html('<i class="fa fa-spinner fa-pulse fa-2x" style="color:#19958E; font-size: 20px;" aria-hidden="true"></i>'+
	 "<strong style='color:#19958E;font-size: 20px; '>Procesando</strong>");
	 
   return true;
}

function countdown(id){
    
    var hoy=new Date();
    var hoyAux=new Date();
   var fecha=cursoExamenActual.tiempoLimite;
    if(contadorNoIniciado){
    	fecha=new Date(hoyAux.setSeconds(cursoExamenActual.tiempoSolucion*60*60));
    	cursoExamenActual.tiempoLimite=fecha;
        contadorNoIniciado=false;
    }
    
    var dias=0
    var horas=0
    var minutos=0
    var segundos=0
    if ((fecha>=hoy) && resolviendoExamen){
        var diferencia=(fecha.getTime()-hoy.getTime())/1000;
        dias=Math.floor(diferencia/86400)
        diferencia=diferencia-(86400*dias)
        horas=Math.floor(diferencia/3600)
        diferencia=diferencia-(3600*horas)
        minutos=Math.floor(diferencia/60)
        diferencia=diferencia-(60*minutos)
        segundos=Math.floor(diferencia);
$("#cursoPreguntasExamenMovil .tituloSubList .divCursoNombreMovil #timerActual").html(
		'<label>  Quedan ' + horas + ' Horas, ' + minutos + ' Minutos, ' + segundos + ' Segundos</label>')

		if(horas == 0 && minutos == 2 && segundos == 0){
        	verModalEntenderTiempoRestante();
        }else if ( (horas>0 || minutos>0 || segundos>0) ){
            setTimeout(countdown,1000) 
        } else{
        	completarExamenCurso(isInduccionVirtual);
        }
    }else{
    	
    }
}

function verModalEntenderTiempoRestante(){
	           	var opciones={
	           			id:"modalEntenderTiempoRestante",nombre:"Tiempo restante",
	           			contenido : "<div class='eventoGeneral'>"+
	           			"<div style='width : 100%;text-align: center;'> Le queda 2 minutos para resolver el examen</div>" +
	           			"<div style='width: 100%;  text-align: center;  margin-top: 10px;'>" +
	           			
	           			"<button onclick='entenderTiempoRestante()' class='btn btn-success' ><i aria-hidden='true' class='fa fa-check'></i>Entendido</button>" +
	           			"</div>" +
	           			""+"</div>"
	           	}
	           	crearModalPrincipalUsuario(opciones,function(){},false,true);
}
function entenderTiempoRestante(){
	$("#modalEntenderTiempoRestante").modal("hide");
}

function completarExamenCurso(){
    $(".divListPrincipal>div").hide();
	$("#cursoResultadoExamenMovil").show();
	resolviendoExamen=false;
	
	cursoExamenActual.preguntas.forEach(function(val,index){
		var opciones=val.opciones;
		opciones.forEach(function(val1,index1){
			val1.isCorrecto=($("#optionId"+val1.id).is(':checked')?1:0);
		});
	});
	cursoExamenActual.evidencia=null;
	if(isInduccionVirtual == 1){
		var formDiv=$("#nuevaMovilInduccionVirtual");
		var campoVacio = true;
		var trabajadorContratistaId=formDiv.find("#selTrabajadorInduccionVirtual").val();
		var induccionVirtualId=formDiv.find("#selInduccionVirtual").val();
		cursoExamenActual.trabajadorContratistaAsociado={id:trabajadorContratistaId};
		cursoExamenActual.examen = {id : induccionVirtualId};
	}else if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
		cursoExamenActual.contratistaAsociado={id:( getSession("contratistaGosstId"))};
		cursoExamenActual.trabajadorAsociadoId=null;		
	}else{
		cursoExamenActual.trabajadorAsociadoId=(getSession("trabajadorGosstId"));
		cursoExamenActual.contratistaAsociado=null;
	}
	cursoExamenActual.preguntas.sort(function(a, b) { 
	    return (a.id - b.id) ; 
	});
	callAjaxPost(URL + '/capacitacion/curso/preguntas/evaluacion', cursoExamenActual, function(data) {
		setTimeout(function(){
			cursoExamenActual.evaluacion.id=data.list.evaluacion.id;
			if(isInduccionVirtual != 1){
				enviarRatingCurso(cursoExamenActual.evaluacion);
			}
			
		var cursoCorregido=data.list;
		var textResult=(cursoCorregido.evaluacion.isAprobado==1?"APROBADO":"DESAPROBADO");
		var textCerti=(cursoCorregido.evaluacion.isAprobado==1?"<button onclick='descargarCertificadoCurso("+cursoExamenActual.id+")' class='btn btn-success'>Descargar Certificado" +
				"<br>No es necesario enviar al área SASS</button>":"");
		textCerti=(cursoExamenActual.wantsCertificado==1?textCerti:"No disponible");
		textCerti=(isInduccionVirtual == 1 && cursoCorregido.evaluacion.isAprobado==1 ?
				"<a class='efectoLink' target='_blank' href='"+URL
				+"/empresa/documento/evidencia?id="+getSession("gestopcompanyid")+"&tipoId="+
						7+"'>" +
						"<i class='fa fa-download'></i>Descargar cargo para firmar</a><br>" +
						"<br>En caso de haber aprobado, no olvide descargar el cargo de trabajador, hacerlo firmar" +
						" y subirlo en el registro del trabajador para que sea revisado por" +
						" personal PEPSICO":textCerti);
		
		var textPreg="";
		var numPreguntasMalas=0;
		$(".containerResultadosGosst")
		.html("<div class='tituloResultado'></div><br>" +
				"<div class='divCertificadoResultado'></div>" +
				"<div class='divPreguntasMalas'></div>");
		cursoCorregido.preguntas.sort(function(a, b) { 
		    return (a.ordenExamen - b.ordenExamen) ; 
		});
		cursoCorregido.preguntas.forEach(function(val,index){
			if(val.evaluacionCorrecta==0){
				numPreguntasMalas++;
				var opciones=val.opciones;
				var textOpc="";
				opciones.forEach(function(val1,index1){
					if(val1.isCorrecto){
						textOpc+="<div class='opcionGosstCss'><input type='radio'>" +
								"<label for='optionId"+val1.id+"'>"+val1.nombre+"</label></div>";
			
					}
				});
				
				textPreg+="<div class='divPreguntaCurso row'>" 
				+"<div class='divNombrePregunta'>"+(index+1)+".&nbsp;"+val.nombre+"</div>" +"" 
				+"<br>" +textOpc+"" +
						"<div class='opcionGosstCss justificacionGosst'>" +
						"<strong>Justificación: </strong>"+val.justificacion+
						"</div>"+
						"</div>";
			}else{
				var opciones=val.opciones;
				var textOpc="";
				opciones.forEach(function(val1,index1){
					if(val1.isCorrecto){
						textOpc+="<div class='opcionGosstCss'><input type='radio'><label for='optionId"+val1.id+"'>"+val1.nombre+"</label></div>";
			
					}
				});
				
				textPreg+="<div class='divPreguntaCurso row'>" 
				+"<div class='divNombrePregunta'>"+(index+1)+".&nbsp;"+val.nombre+"</div>" +"" 
				+"<br>" +textOpc+"" +
						"<div class='opcionGosstCss correctoGosst'>" +
						"<strong>Correcto: </strong>"+
						"</div>"+
						"</div>";
			}
			
		});
		var porce=pasarDecimalSobreVeinte (1-(numPreguntasMalas/cursoCorregido.preguntas.length),2);
		 $("#cursoResultadoExamenMovil").find(".contenidoSubList").html("");
		 var nombreFuncion = "habilitarCapacitacionOnlineUsuario()";
		 if(isInduccionVirtual == 1){
			 nombreFuncion  = "habilitarInduccionesVirtuales()";
		 }
		$("#cursoResultadoExamenMovil").find(".tituloSubList").html(
"<button class='btn btn-success' style='float:left'  onclick='"+nombreFuncion+"'>" +
"<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>"+"Evaluación completa" );
		 $("#cursoResultadoExamenMovil").find(".contenidoSubList")
		 .append(
			 crearDivInformacionCurso("Resultado del examen" ,[textResult+"(" +porce+")" ]) 
			+ crearDivInformacionCurso((isInduccionVirtual == 1 ?"Formato Cargo Empresa":"Certificado") ,[textCerti]) 
			+ (isInduccionVirtual == 1 ?"":crearDivInformacionCurso("Resultado de preguntas" ,[textPreg])) 
			   );  
		 $.unblockUI();
		},2000)
	},algoCHido,{},null,null,false);
}
function algoCHido(){

	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>'
		+'Procesando resultados del examen...'});
	 $("#cursoResultadoExamenMovil").find(".contenidoSubList").show()
	 .html('<i class="fa fa-spinner fa-pulse fa-2x" aria-hidden="true"></i>'+
			 "Procesando");  
}
function enviarRatingCurso(objectEvaluacion){
	callAjaxPostNoLoad(URL + '/capacitacion/curso/rating/trabajador', objectEvaluacion, 
			function(data) {
	$(".ratingCursoResultado").html("GRACIAS POR TU OPINIÓN<br>")
	},function(){
		$(".ratingCursoResultado").html('<i class="fa fa-spinner fa-pulse fa-2x" style="color:#19958E; font-size: 20px;" aria-hidden="true"></i>'+
		 "<strong style='color:#19958E;font-size: 20px; '>Procesando</strong>");

	},{});
	
} 
function descargarCertificadoCurso(cursoId,trabajadorId){
	var trabId=getSession("trabajadorGosstId");
	var contratistaId=getSession("contratistaGosstId");
	if(parseInt(getSession("accesoUsuarios")) == 2){
		trabajadorId = typeof trabajadorId !== 'undefined' ? trabajadorId : contratistaId;
		window.open(URL
				+ "/capacitacion/curso/contratista/certificado?contratistaId="+contratistaId+"&cursoId="
				+ cursoId , '_blank');
	}else{
	    trabajadorId = typeof trabajadorId !== 'undefined' ? trabajadorId : trabId;
	
	    if(trabajadorId && trabajadorId !== 'null' && cursoId && cursoId !== 'null'){
	        window.open(URL
			+ "/capacitacion/curso/certificado?trabajadorId="+trabajadorId+"&cursoId="
			+ cursoId , '_blank');
	    }else{
		alert("Error al cargar la información.");
	    }
	}
	
}
function alertMensajeCurso(){
	alert("Faltan aprobar cursos .");
}
function alertarCertificado(){
	alert('No fue aprobado');
}