/**
 * 
 */
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
		              if( log ) alert(log);
		          }

		      });
$("#graficoResumenEventos").on("click",function(){
	$("#graficoResumenEventos").hide();
	$("#nuevoEventoGosst").hide();
	$("#buscarEventoGosst").hide();
	$("#empresaGosstMovil").append("<div id='grafEventosGosst'></div>");
	cambiarGraficoEvento();
	$("#empresaGosstMovil").prepend("<div class='cancelarFormMovil' >" +
	"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>  ");
	$(".cancelarFormMovil").on("click",function(){
		$("#empresaGosstMovil #grafEventosGosst").remove(); 
		$("#empresaGosstMovil .seguirFormMovil").remove();
		$("#empresaGosstMovil .cancelarFormMovil").remove();
		
		$("#graficoResumenEventos").show();
		$("#nuevoEventoGosst").show();
		$("#buscarEventoGosst").show();
	});
});
$("#buscarEventoGosst").on("click",function(){
	var dataParam = {
			matrixId : getUrlParameter("mdfId")
			};
	callAjaxPost(URL + '/acinseguro/movil/historial', dataParam,
			function(data){
		switch (data.CODE_RESPONSE) {
		case "05":
			listTabla=data.actos;
			$("#graficoResumenEventos").hide();
			$("#nuevoEventoGosst").hide();
			$("#buscarEventoGosst").hide();
			
			$("#empresaGosstMovil").append("<div id='vistaEventosGosst'></div>");
			listTabla.forEach(function(val,index){
				$("#vistaEventosGosst").append("<div class='imagenEventoGosst'>"+insertarImagenParaTabla(val.evidencia, "100%",
				"50%")+"<div style='float:right;width:50%;word-wrap: break-word'>"+
				(index+1)+" de "+listTabla.length+"<br>"+
				val.acInseguroCausaNombre +" - <br>"+
				val.acInseguroNombre+"</div></div>")
			});
			$("#empresaGosstMovil").prepend("<div class='cancelarFormMovil' >" +
			"<i class='fa fa-chevron-circle-left fa-2x' aria-hidden='true'></i>Volver</div>");
			$(".cancelarFormMovil").on("click",function(){
				$("#empresaGosstMovil #vistaEventosGosst").remove(); 
				$("#empresaGosstMovil .seguirFormMovil").remove();
				$("#empresaGosstMovil .cancelarFormMovil").remove();
				
				$("#graficoResumenEventos").show();
				$("#nuevoEventoGosst").show();
				$("#buscarEventoGosst").show();
			});
			break;
		default:
			alert("Ocurrió un error al traer las actos inseguros!");
		}
	});
	
	
	
});



function nextEventoMovil(){
	$(".formNuevoEvento1").hide();
	$(".formNuevoEvento2").show();
	
}

function guardarEmpresaMovil(){ 
 
	var inputFileImage = document.getElementById("fileEviMovil");
	var file = inputFileImage.files[0];
	var dataParam = {
			ruc : $("#inputRuc").val(),
			name : $("#inputRS").val(),
			address : $("#inputDom").val(),
			category : $("#inputRub").val(),
			insurance : $("#inputAseg").val(),
			activityInitialYear : $("#inputAnInic").val(),
			idCompany : idCompanyEdicion,
			objetivoFormacion:12/100,
			objetivoExam:12/100,
			objetivoEpp:12/100,		
			objetivoParticipacion:12,
			objetivoDisponibilidad:12/100,			
			objetivoIperc:12/100
		};
	var sizeFile=$("#fileEviMovil").val().length;
	if(sizeFile==0){
		callAjaxPostNoUnlock(URL + '/empresa/save', dataParam,
				procesarResultadoGuardarMovilEmpresa,function(){
			$.blockUI({
				message:'<img src="../imagenes/gif/ruedita.gif"></img>Guardando Información'});
		}); 
	}else 
		
		{
		if (file.size > bitsLogoEmpresa) {
		alert("Lo sentimos, solo se pueden subir archivos menores a "+bitsLogoEmpresa/1000000+" MB");
	}else{
		
	
		callAjaxPostNoUnlock(URL + '/empresa/save', dataParam,
					procesarResultadoGuardarMovilEmpresa,function(){
				$.blockUI({
					message:'<img src="../imagenes/gif/ruedita.gif"></img>Guardando Información'});
			});
	}
	
		}
	
	
	
}
function procesarResultadoGuardarMovilEmpresa(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var empresaNueva=data.idNuevo;
		$("#menuEmpresa").append(
				"<li><a href='#' onclick='javascript:seleccionaEmpresa("
				+ empresaNueva+ ", &#34;"		
				+$("#inputRS").val() + "&#34;, &#34;"
						+  $("#inputRuc").val()+ "&#34;);'>" + $("#inputRS").val()
						+ "</a></li>");
		$("#companySelected").html("<strong>Empresa Actual:</strong>"+$("#inputRS").val());
		 
		guardarEvidenciaAuto(empresaNueva,"fileEviMovil",
				bitsEvidenciaActoInseguro,
				"/empresa/logo/save",function(){
			$.blockUI({
				message : '<i class="fa fa-check-square" style="color:green" aria-hidden="true"></i> Guardado'
			});
			 
			setTimeout(listarEmpresa,1300); 
			$("#empresaGosstMovil .principalMovil").remove();
			$("#empresaGosstMovil .secundarioMovil").remove();
			$("#empresaGosstMovil .seguirFormMovil").remove();
			$("#empresaGosstMovil .cancelarFormMovil").remove();
			$("#empresaGosstMovil label").remove(); 
			$("#empresaGosstMovil").css({ "top":"25px"});
			 
			$("#nuevoEventoGosst").show(); 
			$("#barraMenu").show();
		},"companyId")
		 
		
		break;
	default:
		alert("Ocurrió un error al guardar el acto inseguro!");
	}
} 
function cambiarGraficoEvento(){
	
}