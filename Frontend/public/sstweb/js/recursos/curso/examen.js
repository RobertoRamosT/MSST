/**
 * 
 */
var cursoExamenActual;
var resolviendoExamen;
var contadorNoIniciado=true;
function verTodosCursosDiv(cursoDivId){
	var heightAux= $(window).height();
	var nombreDiv=""
	switch(parseInt(cursoDivId)){
	case 1:
		nombreDiv="#cursosImplementar";
		break;
	case 2:
		nombreDiv="#cursosCompletados";
		break;
	case 3:
		nombreDiv="#cursosFuturos";
		break;
	case 4:
		nombreDiv="#cursosPasados";
		break;
	}
	
	$("#cursosTrabajadorGosst>div").hide();
	var divCurso=$(nombreDiv);console.log(divCurso);
	divCurso.show();
	divCurso.find(".linkVerTodos").hide()
	.attr("onclick","ocultarTodosCursosDiv("+cursoDivId+")")
	.html("<i class='fa fa-angle-left' aria-hidden='true'></i>Volver");
	divCurso.find(".divListCursos .classFormacionHide").show();
	divCurso.find(".divListCursos" ).css({"overflow-y":"auto"}).animate({
		    height:heightAux-200+"px"
		  }, 800,function(){
			  divCurso.find(".linkVerTodos").show()
		  } );
}

function ocultarTodosCursosDiv(cursoDivId){
	var nombreDiv="";
	switch(parseInt(cursoDivId)){
	case 1:
		nombreDiv="#cursosImplementar";
		break;
	case 2:
		nombreDiv="#cursosCompletados";
		break;
	case 3:
		nombreDiv="#cursosFuturos";
		break;
	case 4:
		nombreDiv="#cursosPasados";
		break;
	}
	var divCurso=$(nombreDiv);
	divCurso.find(".divListCursos .classFormacionHide").hide();
	
	divCurso.find(".linkVerTodos")
	.attr("onclick","verTodosCursosDiv("+cursoDivId+") ")
	.html("Ver todos<i class='fa fa-angle-right' aria-hidden='true'></i>");
	divCurso.find(".divListCursos" ).css({"overflow-y":"auto","height":""});
	$("#cursosTrabajadorGosst>div").show();
}
 
function verDetallesCurso(indCap,indCurso,isPasado){
	var heightAux= $(window).height();
	var capActual=listFullFormaciones[indCap].cursos
	cursoExamenActual=capActual[indCurso];
	var imagenCap="<img></img>";
	if(cursoExamenActual.evidencia!=null){
		imagenCap=	insertarImagenParaTablaMovil(cursoExamenActual.evidencia,"250px","100%");	
	}
	var dataParam={
			id:cursoExamenActual.id,
			trabajadorAsociadoId:(sessionStorage.getItem("trabajadorGosstId"))
			};
	if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
		dataParam={
				id:cursoExamenActual.id,
				contratistaAsociado:{id:(sessionStorage.getItem("contratistaGosstId"))}
				};
	}
	
	var butonFinal="<button class='btn btn-success' onclick='verEncuestaCurso();'>" +
	"<i class='fa fa-align-left'> </i>" +
	"&nbsp;Encuesta y Evaluación" +
	"&nbsp;<i class='fa fa-angle-right'> </i></button>";
	
	if(isPasado==1){
		butonFinal="<button class='btn btn-success' onclick='descargarCertificadoCurso("+cursoExamenActual.id+");' style='font-size: 20px;'>" +
		"<i class='fa fa-certificate'> </i>" +
		"&nbsp;Descargar Certificado" +
		"</button>";
		butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
	}
	if(isPasado==2){
		butonFinal="<button class='btn btn-info' onclick='alertarCertificado()' style='font-size: 20px;'>" +
		"<i class='fa fa-certificate'> </i>" +
		"&nbsp;Descargar Certificado" +
		"</button>";
		butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
	}
	var textCarga="" +
			"<table  class='table tableCursoGosst table-bordered ' >" +
			"<thead>" +
			"<tr>" +
			"<td>" +
			"<i class='fa fa-spin fa-spinner fa 2x' style='color:#19958E; font-size: 20px;'></i><label style='font-size:20px'>Cargando</label>" +
			"</td>" +
			"</thead>" +
			"</table";
	$("#cursoEspecificoGosst").show();
	$("#cursosTrabajadorGosst").hide();
	$("#cursoExamenGosst").hide();
	$("#cursoResultadosGosst").hide();
	$(".divDetalleCurso").css({"max-height":heightAux-200+"px"})
	.html("")
	.append("<div class='imgDetalleCurso'>"+""+"</div>" +
			"<div class='textDetalleCurso'>"+""+"</div>" +
			"<div class='relDetalleCurso'>"+""+"</div>" +
			"<div class='ratingDetalleCurso'>"+""+"</div>" +
			"<div class='objDetalleCurso'>"+""+"</div>" +
			"<div class='profeDetalleCurso'>"+""+"</div>" +
			"<div class='videoDetalleCurso'>"+""+"</div>" +
			"<div class='archDetalleCurso'>"+""+"</div>" +
			"<div class='enlDetalleCurso'>"+""+"</div>" +
			
			"<div class='cargaDetalleCurso'>"+textCarga+"</div>" 
			);
	$(".divDetalleCurso button").hide();
	$(".imgDetalleCurso").html(imagenCap);
	$(".textDetalleCurso").html(
			"<strong>Nota Mínima: </strong>"+cursoExamenActual.puntajeMinimo+"% <br>" +
			"<strong>Tiempo de resolución: </strong>"+cursoExamenActual.tiempoSolucion+" hora(s) <br>" +
	"<strong>Descripción: </strong>"+cursoExamenActual.descripcion);
$("#cursoEspecificoGosst .titleDivCursos .col-md-10").html("Curso Online '"+cursoExamenActual.nombre+"'");
	
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
		//$(".ratingDetalleCurso").show();
		$(".objDetalleCurso").show();
		$(".profeDetalleCurso").show();
		$(".relDetalleCurso").show();
		$(".archDetalleCurso").show();
		$(".enlDetalleCurso").show();
		$(".videoDetalleCurso").show();
		$(".cargaDetalleCurso").remove();
		$(".divDetalleCurso").append(butonFinal);
	}
}
callAjaxPostNoLoad(URL + '/capacitacion/curso/evaluacion', dataParam, function(data) {
	var eval=data.list;mostrarTodoDiv();
	
	if(eval.length==0){
		eval={
				id:0,
				numIntentos:0,
				cursoId:cursoExamenActual.id,
				rating:0,
				trabajadorId:(sessionStorage.getItem("trabajadorGosstId"))
		}
		if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
			eval={
					id:0,
					numIntentos:0,
					cursoId:cursoExamenActual.id,
					rating:0,
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
	$(".relDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
			"<thead>" +
			"<tr>" +
			"<td>Curso Requerido</td>" +
			"<td style='width:5%'>Cumple</td>" +
			
			"<td style='width:45%'> Último Puntaje</td>" +
			"<td> Puntaje Necesario</td>" +
		"</tr>" +
			"</thead>" +
			"<tbody></tbody>" +
			"</table>");
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
		$(".relDetalleCurso table tbody")
		.append("<tr>" +
				"<td >" +val.nombre+"</td>"+
				"<td >" +evaluacion.evaluacionNombre+"</td>"+
				
				"<td >" +evaluacion.puntajeAlcanzado*100+"</td>"+
				"<td >" +val.puntajeMinimo+"</td>"+
		"</tr>");
	});
	if(relacionados.length==0){
		$(".relDetalleCurso").remove();
	}
	mostrarTodoDiv();
	
});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/objetivos', dataParam, function(data) {
		var objetivos=data.list;mostrarTodoDiv();
		$(".objDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
				"<thead>" +
				"<tr>" +
				"<td>Objetivos del curso</td>" +
				"</tr>" +
				"</thead>" +
				"<tbody></tbody>" +
				"</table>");
		objetivos.forEach(function(val,index){
			$(".objDetalleCurso table")
			.append("<tr>" +
					"<td>&#8226; " +val.nombre+"</td>"+
			"</tr>");
		})
	});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/archivos', dataParam, function(data) {
		var archivos=data.list;mostrarTodoDiv();
		$(".archDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
				"<thead>" +
				"<tr>" +
				"<td style='width:5%'>...</td>" +
				"<td style='width:45%'>Material del curso</td>" +
				"<td> Detalle del material</td>" +
				"</tr>" +
				"</thead>" +
				"<tbody></tbody>" +
				"</table>");
		archivos.forEach(function(val,index){
			var archivoCursoId=val.id;
			$(".archDetalleCurso table")
			.append("<tr>" +
					"<td style='text-align: center;'>" +"<a  target='_blank' href='"+URL
				+ "/capacitacion/curso/archivo/evidencia?archivoId="
				+ archivoCursoId+"''><i class='fa fa-2x fa-download'></i></a>"+"</td>"+
					"<td>&#8226;" +val.nombre+"</td>"+"<td>" +val.observacion+"</td>"+
			"</tr>");
		})
	});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/enlaces', dataParam, function(data) {
		var enlaces=data.list;
		mostrarTodoDiv();
		$(".enlDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
				"<thead>" +
				"<tr>" +
				"<td style='width:5%'>...</td>" +
				"<td style='width:45%'>Enlaces de apoyo</td>" +
				"<td> Detalle de los enlaces</td>" +
				"</tr>" +
				"</thead>" +
				"<tbody></tbody>" +
				"</table>");
		$(".videoDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
				"<thead>" +
				"<tr>" +
				"<td style='width:5%'>...</td>" +
				"<td style='width:45%'>Video del Curso</td>" +
				"<td> Detalle </td>" +
				"</tr>" +
				"</thead>" +
				"<tbody></tbody>" +
				"</table>");
		var numEnlaces = 0,numVideo = 0;
		enlaces.forEach(function(val,index){
			var enlaceId=val.id;
			if(val.tipo.id==1){
				numVideo++;
				$(".videoDetalleCurso table")
				.append("<tr>" +
						"<td style='text-align: center;'>" +"<a target='_blank' href='"+val.nombre+"'>" +
								"<i class='fa fa-2x fa-external-link'></i></a>"+"</td>"+
						"<td>&#8226;" +val.nombre+"</td>"+"<td>" +val.observacion+"</td>"+
				"</tr>");
			}else{
				numEnlaces++;
				$(".enlDetalleCurso table")
				.append("<tr>" +
						"<td style='text-align: center;'>" +"<a target='_blank' href='"+val.nombre+"'>" +
								"<i class='fa fa-2x fa-external-link'></i></a>"+"</td>"+
						"<td>&#8226;" +val.nombre+"</td>"+"<td>" +val.observacion+"</td>"+
				"</tr>");
			}
			
		});
		if(numVideo == 0){
			$(".videoDetalleCurso table")
			.append("<tr>" +
					"<td colspan='2'>Este curso no tiene material en esta sección</td>"+
					"</tr>");
		}
		if(numEnlaces == 0){
			$(".enlDetalleCurso table")
			.append("<tr>" +
					"<td colspan='2'>Este curso no tiene material en esta sección</td>"+
					"</tr>");
		}
	});
	
	//Info del profe
	var profesor=cursoExamenActual.profesor;
	
	$(".profeDetalleCurso").html("<table class='table tableCursoGosst table-bordered ' >" +
			"<thead>" +
			"<tr>" +
			"<td>Facilitador</td>" +
			"<td> </td>"+
			"</tr>" +
			"</thead>" +
			"<tbody>" +
			"<tr><td>Nombre: "+profesor.nombre+"</td>" +
					"<td rowspan='3'>"+insertarImagenParaTablaMovil(profesor.foto,"250px","100%")+"</td></tr>" +
			"<tr><td>Experiencia: "+profesor.experiencia+"</td></tr>" +
			"<tr><td>Correo: "+profesor.correo+"</td></tr>" +
			"" +
			"" +
			"</tbody>" +
			"</table>");
	
}
function alertMensajeCurso(){
	alert("Faltan aprobar cursos .");
}
function alertarCertificado(){
	alert('No fue aprobado');
}
function verTodosCursosTrabajador(){
	$("#cursoEspecificoGosst").hide();
	$("#cursosTrabajadorGosst").show();
}


function empezarExamenCurso(){
	$("#cursoEspecificoGosst").hide();
	$("#cursosTrabajadorGosst").hide();
	$("#cursoExamenGosst").show();
	resolviendoExamen=true;
	$("#cursoExamenGosst .titleDivCursos")
	.html("<div class='col-md-10'>" +
			"<i class='fa fa-file-text-o' aria-hidden='true'></i>"+
			"Examen del Curso "+cursoExamenActual.nombre+"<br>"+
			
			"<div id='timerActual'></div>"+
			"</div>" +
			"<div class='col-md-2'>"+
			"<i class='fa fa-check-circle-o' aria-hidden='true'></i>" +
			
			" Intentos: "+cursoExamenActual.evaluacion.numIntentos+
			"</div>"
			);
	var heightAux= $(window).height();
	
	$(".containerExamenGosst")
	.html("");
	var cursoAux={
			id: cursoExamenActual.id,
			verImagenPregunta: 1
	}
	callAjaxPostNoLoad(URL + '/capacitacion/curso/preguntas', cursoAux, function(data) {
		setTimeout(function(){
			$(".containerExamenGosst")
			.html("");
		var preguntasImagen=data.list;
		var preguntasObligadas=[];
		var preguntasOpcionales=[];
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
			var textOpc="";
			var textImagen="";
			var alternateFila=true;
			val.isEvaluado=1;
			val.ordenExamen=index+1;
			opciones.forEach(function(val1,index1){
				var colorFondo="white";
				if(alternateFila){
					colorFondo="#f9f9f9";
				}
				alternateFila=!alternateFila;
				textOpc+="<div class='opcionGosstCss' style='background-color:"+colorFondo+"'><input type='radio' name='optionFamily"+val.id+"' " +
						"id='optionId"+val1.id+"'><label for='optionId"+val1.id+"'>"+val1.nombre+"</label></div>";
			});
			
			if(val.imagen!=null){
				textImagen=insertarImagenParaTablaMovil(val.imagen,(heightAux-200-200)/2+"px","100%");
			}
			$(".containerExamenGosst")
			.append("<div class='divPreguntaCurso row' id='preguntaId"+val.id+"'>"
					+"<div class='divNombrePregunta'>"+(index+1)+".&nbsp;"+val.nombre+"</div>" +
					"<div class='divOpcionesGosst col-md-6'>"+textOpc+"</div>"+
					"<div class='divImagenPregunta col-md-6'>"+textImagen+"</div>"+
					
					
					"</div>");
			$(".containerExamenGosst").css({"height":heightAux-200+"px","overflow-y":"auto"});
			}else{
				val.isEvaluado=0;
			}
		});
		$(".containerExamenGosst")
		.append("<button class='btn btn-success' onclick='completarExamenCurso()'>Completar Examen&nbsp;<i class='fa fa-angle-right'> </i></button>")
		contadorNoIniciado=true;
		countdown();
	},2000)},preCargaExamenImagen,{});
	
}

		
		
	
function verEncuestaCurso(){
	//
	$("#cursoEspecificoGosst").hide();
	$("#cursosTrabajadorGosst").hide();
	$("#cursoExamenGosst").show();
	$("#cursoExamenGosst .titleDivCursos").html("");
	$(".containerExamenGosst")
	.html("<div class='ratingCursoResultado'></div>");
	 
	var texto1Rating="¿La plataforma es sencilla y manejable?" ;
	var texto2Rating=" ¿Considera que el contenido del curso es claro y entendible?" ;
	var texto3Rating="¿Considera que el curso tendrá un impacto positivo en su seguridad laboral?" ;
	var texto4Rating="En términos generales, ¿Cuán satisfecho se siente con el curso?" ;
	var texto5Rating="Bridanos tus comentario con respecto al curso. ¿Que aspectos son " +
			"de mayor agrado y provecho para ti? y ¿Que aspectos de mejoras consideras que se deben tomar?" ;
var estrellasRating=
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst1'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst2'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst3'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst4'></i>"+
			"<i class='fa fa-star-o fa-2x ' style='color:rgba(6, 141, 133, 0.92)' id='ratingGosst5'></i>";
	var buttonEnviar="<button class='btn btn-success'><i class='fa fa-paper-plane fa-2x'></i>Enviar</button>";
	
	$(".ratingCursoResultado").html("<table class='table tableCursoGosst table-bordered'>" +
			"<thead><tr><td colspan='2'>Encuesta de Calidad - Seguridad y Salud (Obligatoria)</td></tr></thead>" +
			"<tbody>" +
			"<tr id='pregEncuesta1' ><td>"+texto1Rating+"</td><td style='text-align:center'>Muy complicado"+estrellasRating+" Muy sencillo</td></tr>"+
			"<tr id='pregEncuesta2' ><td>"+texto2Rating+"</td><td style='text-align:center'>Totalmente en desacuerdo"+estrellasRating+"Totalmente de acuerdo</td></tr>"+
			"<tr id='pregEncuesta3'><td>"+texto3Rating+"</td><td style='text-align:center'>Totalmente en desacuerdo"+estrellasRating+" Totalmente de acuerdo</td></tr>"+
			"<tr id='pregEncuesta4'><td>"+texto4Rating+"</td><td style='text-align:center'>Muy insatisfecho "+estrellasRating+"Muy satisfecho</td></tr>"+
			"<tr id='pregEncuesta5'><td>"+texto5Rating+"</td><td style='text-align:center'>"+"<textarea style='height:100px' id='comentarioRating' class='form-control'></textarea>"+"</td></tr>"+
			"<tr><td></td><td>"+buttonEnviar+"</td></tr>"+
			"</tbody></table>");
	
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
	
	$(".ratingCursoResultado button").on("click",function(){
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
		empezarExamenCurso();
	});
	
	//
}

function completarExamenCurso(){
	$("#cursoResultadosGosst").show();
	$("#cursoExamenGosst").hide();
	resolviendoExamen=false;
	
	cursoExamenActual.preguntas.forEach(function(val,index){
		var opciones=val.opciones;
		opciones.forEach(function(val1,index1){
			val1.isCorrecto=($("#optionId"+val1.id).is(':checked')?1:0);
		});
	});
	cursoExamenActual.evidencia=null;
	if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
		cursoExamenActual.contratistaAsociado={id:(sessionStorage.getItem("contratistaGosstId"))};
		cursoExamenActual.trabajadorAsociadoId=null;		
	}else{
		cursoExamenActual.trabajadorAsociadoId=(sessionStorage.getItem("trabajadorGosstId"));
		cursoExamenActual.contratistaAsociado=null;
	}
	cursoExamenActual.preguntas.sort(function(a, b) { 
	    return (a.id - b.id) ; 
	});
	callAjaxPostNoLoad(URL + '/capacitacion/curso/preguntas/evaluacion', cursoExamenActual, function(data) {
		setTimeout(function(){
			cursoExamenActual.evaluacion.id=data.list.evaluacion.id;
			enviarRatingCurso(cursoExamenActual.evaluacion);
		var cursoCorregido=data.list;
		var textResult=(cursoCorregido.evaluacion.isAprobado==1?"APROBADO":"DESAPROBADO");
		var textCerti=(cursoCorregido.evaluacion.isAprobado==1?"<button class='btn btn-success'>Descargar Certificado" +
				"<br>No es necesario enviar al área SASS</button>":"");
		textCerti=(cursoExamenActual.wantsCertificado==1?textCerti:"");
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
		var porce=pasarDecimalPorcentaje (1-(numPreguntasMalas/cursoCorregido.preguntas.length),2);
		var tablaResult="<table class='table tableCursoGosst table-bordered'>" +
		"<thead>" +
		"<tr>" +
		"<td>" +
		"RESULTADO DEL EXAMEN (" +porce+")"+
		"</td><tr>" +
		"</thead>" +
		"<tbody>" +
		"<tr>" +
		"<td>" +
		textResult+
		"</td><tr>" +
		"</tbody>" +
		"</table>";
		
		$(".tituloResultado").html(" " +tablaResult);
		$(".divCertificadoResultado").html(textCerti);
		$(".divCertificadoResultado button").on("click",function(){
			descargarCertificadoCurso(cursoExamenActual.id)
		});
		
		if(textPreg.length==0){
			$(".divPreguntasMalas").hide();
		}else{
			$(".divPreguntasMalas").append("<br>Examen Resuelto "
					+textPreg);
		}
		},2000)
	}
		
	 
		
		,algoCHido,{});
}
function preCargaExamenImagen(){
	
	 $(".containerExamenGosst").html('<i class="fa fa-spinner fa-pulse fa-2x" style="color:#19958E; font-size: 20px;" aria-hidden="true"></i>'+
			 "<strong style='color:#19958E;font-size: 20px; '>Procesando</strong>");
	 
	 return true;

}
function algoCHido(){
	
		 $(".containerResultadosGosst").html('<i class="fa fa-spinner fa-pulse fa-2x" aria-hidden="true"></i>'+
				 "Procesando");
		 
		 return true;
	
}
function descargarCertificadoCurso(cursoId,trabajadorId){
	var trabId=sessionStorage.getItem("trabajadorGosstId");
	var contratistaId=sessionStorage.getItem("contratistaGosstId");
	if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
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


function verCursosCapacitacion(){
	cargarPrimerEstado();
	$("#cursoResultadosGosst").hide();
	$("#cursosTrabajadorGosst").show();
	$("#containerResultadosGosst").html("");
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
       
$("#cursoExamenGosst .titleDivCursos #timerActual").html(
		'<label>  Quedan ' + horas + ' Horas, ' + minutos + ' Minutos, ' + segundos + ' Segundos</label>')

        if ( (horas>0 || minutos>0 || segundos>0) ){
            setTimeout(countdown,1000) 
        }else{
        	completarExamenCurso();
        }
    }
    else{
}
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

