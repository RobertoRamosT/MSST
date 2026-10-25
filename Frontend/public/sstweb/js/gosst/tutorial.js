/**
 * Para no usar intro.js que cuesta mucho :P
 */

var tutorialOn=false;



function crearOverlaySobreDiv(divObject){
	tutorialOn=true;
	$("body").append("<div class='overlayGosst'></div>");
	
	
	if(divObject!=null){
		var cuerpoTexto=divObject.cuerpo;
		var tituloTexto=divObject.titulo;
		$("body").append("<div class='mensajeBienvenida'></div>");
		var tituloTutorial="<div class='tituloTutorial'>"+tituloTexto+"</div>";
		var cuerpoTutorial="<div class='cuerpoTutorial'>"+cuerpoTexto+"</div>";
		var imagenUrl="<img src='../imagenes/logo3.png'>";
		$(".mensajeBienvenida").append(tituloTutorial)
		.append(imagenUrl)
		.append(cuerpoTutorial);
	}
}

function resaltarDivTutorial(divObject){
	var divId=divObject.divId;
	var cuerpoTexto=divObject.cuerpo;
	var tituloTexto=divObject.titulo;
	var position=divObject.position;
	
	var divSeleccionado=$("#"+divId);
	divSeleccionado.addClass("divTutorial");
	var topDiv=divSeleccionado.position().top;
	var leftDiv=divSeleccionado.position().left;
	var widthDiv=divSeleccionado.css("width");
	var widthNumberDiv=parseInt(widthDiv.replace("px",""));
	var heightDiv=divSeleccionado.css("height");
	var heightNumberDiv=parseInt(heightDiv.replace("px",""));
	var cssPaso={"top":topDiv,"left":leftDiv,"width":widthDiv,"height":heightDiv};
	var widthWindow=$(window).width();
	var cssMensaje={"top":"0px","left":widthNumberDiv+10+1+"px","max-width":widthWindow-widthNumberDiv-30+"px"};
	switch(position){
	case "bottom":
		cssMensaje={"left":"0px","top":heightNumberDiv+10+"px"};
		break;
	};
	var anteriorTutorial="<i class='fa fa-arrow-left fa-2x' style='position:absolute;bottom:0px' aria-hidden='true'></i>";
	var siguienteTutorial="<i class='fa fa-arrow-right fa-2x' style='right:0px;position:absolute;bottom:0px' aria-hidden='true'></i>";
	var tituloTutorial="<div class='tituloTutorial'>"+tituloTexto+"</div>";
	var cuerpoTutorial="<div class='cuerpoTutorial'>"+cuerpoTexto+"</div>";
		$("body").append("<div class='pasoTutorial'> </div>");
	$(".pasoTutorial").css(cssPaso);
	$(".pasoTutorial").append("<div class='mensajeTutorial'> </div>");
	$(".mensajeTutorial")
	.css(cssMensaje)
	.append(tituloTutorial)
	.append(cuerpoTutorial); 
}

function siguientePasoTutorial(divObject){
	var divAnteriorId=divObject.divAnteriorId;
	var divId=divObject.divId;
	var cuerpoTexto=divObject.cuerpo;
	var tituloTexto=divObject.titulo;
	var mensajeOn=(typeof divObject.mensajeOn  !== 'undefined' ? divObject.mensajeOn  : true );
	 
	var divAnterior=$("#"+divAnteriorId);
	var divSeleccionado=$("#"+divId);
	divAnterior.removeClass("divTutorial");
	divSeleccionado.addClass("divTutorial");
	
	var topDiv=divSeleccionado.position().top;
	var leftDiv=divSeleccionado.position().left;
	var widthDiv=divSeleccionado.css("width");
	var heightDiv=divSeleccionado.css("height");

	var widthNumberDiv=parseInt(widthDiv.replace("px",""));
	var heightNumberDiv=parseInt(heightDiv.replace("px",""));

	var heightDiv=divSeleccionado.css("height");
	var cssPaso={"top":topDiv,"left":leftDiv,"width":widthDiv,"height":heightDiv};
	var cssMensaje={"left":"0px","top":heightNumberDiv+10+"px"};
	
	$(".tituloTutorial").html(tituloTexto);
	$(".cuerpoTutorial").html(cuerpoTexto);
	$(".pasoTutorial").css(cssPaso); 
	if(mensajeOn){
		$(".mensajeTutorial").show();
	}else{
		$(".mensajeTutorial").hide();
	}
	$(".mensajeTutorial").css(cssMensaje);
	
}

function finalizarTutorial(divObject){
	tutorialOn=false; 
	var divAnteriorId=(typeof divObject  !== 'undefined' ? divObject.divAnteriorId  : "no" );
	$(".overlayGosst").remove();
	$(".mensajeBienvenida").remove();
	$(".pasoTutorial").remove();
	$("#"+divAnteriorId).removeClass("divTutorial");
	
	
}
