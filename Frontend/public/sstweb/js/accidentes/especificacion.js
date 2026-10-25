var especificacionId;
var respuesta1;
var respuesta2;
var respuesta3;
var respuesta4;
var respuesta5;
var respuesta6;
var respuesta7;
var respuesta8;

function verCategorias(){
	if(parseInt(accidenteTipoId) == 3){
	    $("#listaCategoria").hide();$("#mdCategorias").modal('show');
	}else{
	    $("#listaCategoria").show();$("#mdCategorias").modal('show');
	}
}

$('#mdCategorias').on('show.bs.modal',function(e){
	cargarModalEsp();
});

$('#mdCategorias').on('hidden.bs.modal',function(e){
	guardarEspi();
});

function cargarModalEsp(){
	var dataParam={
		accidenteId:accidenteId
	};
	 
	callAjaxPost(URL+'/accidente/especificacion',dataParam,function(data){
		switch(data.CODE_RESPONSE){
		    case "05":
			   	var list = data.list;
				especificacionId = (list.length > 0?list[0].accidenteEspecificacionId:0);
				
				marcarChechBox((list.length > 0?list[0].respuestaUno:0),"accRpta1");
				marcarChechBox((list.length > 0?list[0].respuestaDos:0),"accRpta2");
				marcarChechBox((list.length > 0?list[0].respuestaTres:0),"accRpta3");
				marcarChechBox((list.length > 0?list[0].respuestaCuatro:0),"accRpta4");
				marcarChechBox((list.length > 0?list[0].respuestaCinco:0),"accRpta5");
				marcarChechBox((list.length > 0?list[0].respuestaSeis:0),"accRpta6");
				marcarChechBox((list.length > 0?list[0].respuestaSiete:0),"accRpta7");
				marcarChechBox((list.length > 0?list[0].respuestaOcho:0),"accRpta8");

				if(list.length > 0 && (list[0].respuestaUno+list[0].respuestaDos+list[0].respuestaTres+list[0].respuestaCinco+list[0].respuestaSeis +
					list[0].respuestaSiete+list[0].respuestaOcho) > 0){
					mostrarCat();
				}

				break;

			default:
				alert("Ocurrió un error al traer las programaciones!");
		}
	});
}

function guardarEspi() {

	var campoVacio = true;
	var respuesta1= pasarBoolInt($("#accRpta1").prop("checked"));
	
	var respuesta2= pasarBoolInt($("#accRpta2").prop("checked"));
	var respuesta3= pasarBoolInt($("#accRpta3").prop("checked"));
	var respuesta4= pasarBoolInt($("#accRpta4").prop("checked"));
	var respuesta5= pasarBoolInt($("#accRpta5").prop("checked"));
	var respuesta6= pasarBoolInt($("#accRpta6").prop("checked"));
	var respuesta7= pasarBoolInt($("#accRpta7").prop("checked"));
	var respuesta8= pasarBoolInt($("#accRpta8").prop("checked"));
	
	var cantidadCheck= 0;
	
	if(respuesta1 == 1){
	    cantidadCheck++;
	}
	if(respuesta2 == 1){
	    cantidadCheck++;
	}
	if(respuesta3 == 1){
	    cantidadCheck++;
	}
	if(respuesta4 == 1){
	    cantidadCheck++;
	}
	if(respuesta5 == 1){
	    cantidadCheck++;
	}
	if(respuesta6 == 1){
	    cantidadCheck++;
	}
	if(respuesta7 == 1){
	    cantidadCheck++;
	}
	if(respuesta8 == 1){
	    cantidadCheck++;
	}
	
	if(!especificacionId){
		especificacionId = 0;
	}

	if (campoVacio) {

		var dataParam = {
			accidenteId : accidenteId,
			accidenteEspecificacionId : especificacionId,
			respuestaUno : respuesta1,
			respuestaDos : respuesta2,
			respuestaTres : respuesta3,
			respuestaCuatro : respuesta4,
			respuestaCinco : respuesta5,
			respuestaSeis : respuesta6,
			respuestaSiete : respuesta7,
			respuestaOcho : respuesta8,
			cantidadCheck : cantidadCheck
			};

	callAjaxPost(URL + '/accidente/especificacion/save', dataParam,
		    function(data) {
			    switch (data.CODE_RESPONSE) {
				  case "05":
					  if(cantidadCheck > 0){
						  mostrarCat();
					  }else{
						  verCategAcordeInforme();verCategAcordeTipoAccidente();
					  }

					  break;
					
				  default:
					alert("Ocurrió un error al guardar la especificación!");
				  }
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
