
var banderaedicion11;
var testigoId;
var nombre;
var testigoFecha;
var declaracion;
var lugar;
var horaInicio;
var horaFin;
var investigadorId;
var tipoTestigo;
 
var listInvestigadores;
var listFullTestigos=[];
var testigoObj = {};
function modificarAcordeTipoTesti(){
	var tipoSeleccionado= $("#testigoTipo").val();
	 
	var listanombretab=listarStringsDesdeArray(listDniNombre, "nombre");
	if(tipoSeleccionado==2){
		

		
		$("#testigoNombre").autocomplete({
			
			source : ""
		});
	
		
		
	}else{
		
		$("#testigoNombre").autocomplete({
			
			source : listanombretab,
			minLength : 0
		}).focus(function() {
			$(this).autocomplete('search', '');
		});
		
		$("#testigoNombre").keypress(function(e){
			llenarCamposAutoTrab();		});
		$("#testigoNombre").keyup(function(e){
			llenarCamposAutoTrab();		});
		$("#testigoNombre").keydown(function(e){
			llenarCamposAutoTrab();		});
		$(document).click( function(){
			llenarCamposAutoTrab();
			});
		
	

	}
	
	
}


function cargarModalTesti() {
	$("#btnAgregarTesti").attr("onclick", "javascript:nuevoTesti();");
	$("#btnCancelarTesti").attr("onclick", "javascript:cancelarTesti();");
	$("#btnGuardarTesti").attr("onclick", "javascript:guardarTesti();");
	$("#btnEliminarTesti").attr("onclick", "javascript:eliminarTesti();");
	$("#testigoTipo").attr("onchange", "javascript:modificarAcordeTipoTesti();");
	
	$("#btnCancelarTesti").hide();
	$("#btnAgregarTesti").show();
	$("#btnEliminarTesti").hide();
	$("#btnGuardarTesti").hide();

	$("#declaracionTesti").hide();
	$("#theviTestigo").html("");
	$("#declaracionTesti input").val("");	
	$("#declaracionTesti textarea").val("");	
	 banderaedicion11=false;
	 testigoId=0;
	 nombre="";
	 declaracion="";
	 lugar="";
	 horaInicio="";
	 horaFin="";
	 investigadorId=0;
	 tipoTestigo=0;

	var dataParam = {
			accidenteId : accidenteId
	};

	callAjaxPost(URL + '/accidente/testigo', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
		    listFullTestigos = data.lista;
			listInvestigadores=data.listInvestigadores;
			$("#tblTesti tbody tr").remove();
			listFullTestigos.forEach(function(val,index){
				
				$("#tblTesti tbody").append(
						"<tr id='tr" + val.testigoId
								+ "' onclick='javascript:editarTesti("+index+")' >"

								+ "<td id='tdtipo"
								+ val.testigoId + "'>"
								+ val.testigoTipoNombre + "</td>"
								+ "<td id='tdnombre"+ val.testigoId + "'>"
								+ val.nombre + "</td>"
								+ "<td id='tddecl" +val.testigoId +"'>"
								+val.declaracion+"</td>"
								+ "<td id='tddnfec"+ val.testigoId + "'>"
								+ val.testigoFecha + "</td>"
								+ "<td id='tddlugar"+ val.testigoId + "'>"
								+ val.lugarDeclarado + "</td>"
								+ "<td id='tddinve"+ val.testigoId + "'>"
								+ val.investigadorNombre + "</td>"
								+ "<td id='tddhorai"+ val.testigoId + "'>"
								+ val.horaInicioTexto + "</td>"
								+ "<td id='tddhoraf"+ val.testigoId + "'>"
								+ val.horaFinTexto + "</td>"
								+ "<td id='tddevi"+ val.testigoId + "'>"
								+ val.evidenciaNombre + "</td>"
								
								+ "</tr>"); 
			});
			

			break;
		default:
			alert("Ocurrió un error al traer las programaciones!");
		}
	});
}

function cancelarTesti(){
	cargarModalTesti();
}
function nuevoTesti(){
	 banderaedicion11=false;

	if (!banderaedicion11) {

		var selInvestigador = crearSelectOneMenuOblig("selInvestigador", "", listInvestigadores,
				"-1", "investigadorId", "nombre");
		var testigoTipo = crearSelectOneMenuOblig("testigoTipo", "modificarAcordeTipoTesti()", listInterno,
			"1", "id", "nombre");	
		$("#tblTesti tbody")
				.append(
						"<tr>"
						+"<th>"+testigoTipo+"</th>"
						+"<th><input class='form-control' type='text' id='testigoNombre'></th>"
						
						+"<th><textarea class='form-control' type='text' id='testigoDeclara'></textarea></th>"
						
						+"<th><input class='form-control' type='date' id='testigoFecha'></th>"
						+"<th><input class='form-control' type='text' id='testigoLugar'></th>"
						+"<th> "+selInvestigador+"</th>"
						+"<th><input class='form-control' type='time' id='testigoHoraInicio'></th>"
						+"<th><input class='form-control' type='time' id='testigoHoraFin'></th>"
						+"<th id='theviTestigo0'> </th>"
						+ "</tr>");
		testigoId = 0;
		modificarAcordeTipoTesti();
		
		$("#btnCancelarTesti").show();
		$("#btnAgregarTesti").hide();
		$("#btnEliminarTesti").hide();
		$("#btnGuardarTesti").show();
		
		var options=
		{container:"#theviTestigo"+testigoId,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"Testigo0",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		banderaedicion11 = true;
	} else {
		alert("Guarde primero.");
	};
}

function eliminarTesti(){
	var r = confirm("¿Está seguro de eliminar el testigo?");
	if (r == true) {
		var dataParam = {
				testigoId : testigoId,
		};

		callAjaxPost(URL + '/accidente/testigo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarModalTesti();
						break;
					default:
						alert("Ocurrió un error al eliminar el testigo!");
					}
				});
	}
}

function editarTesti(pindex) {

	if (!banderaedicion11) {
	    testigoObj = listFullTestigos[pindex];
		 testigoId=testigoObj.testigoId;
		 nombre=testigoObj.nombre;
		 declaracion=testigoObj.declaracion;
		 lugar=testigoObj.lugarDeclarado;
		 horaInicio=testigoObj.horaInicio;
		 horaFin=testigoObj.horaFin;
		 investigadorId=testigoObj.investigadorId;
		 tipoTestigo=testigoObj.testigoTipoId;

		var testigoTipo = crearSelectOneMenuOblig("testigoTipo", "modificarAcordeTipoTesti()", listInterno,
			tipoTestigo, "id", "nombre");
		$("#tdtipo"+testigoId).html(testigoTipo);
		 var selInvestigador = crearSelectOneMenu("selInvestigador", "", listInvestigadores,
					investigadorId, "investigadorId", "nombre");
		$("#tddinve"+testigoId).html(selInvestigador);
		
		$("#tdnombre" + testigoId)
		.html("<input class='form-control' type='text' id='testigoNombre'>");		
		$("#testigoNombre").val(nombre);

		$("#tddnfec" + testigoId)
		.html("<input class='form-control' type='date' id='testigoFecha'>");		
		$("#testigoFecha").val(convertirFechaInput(testigoObj.testigoFechaDate));
		
		$("#tddlugar" + testigoId)
		.html("<input class='form-control' type='text' id='testigoLugar'>");
		$("#testigoLugar").val(lugar);
		
		$("#tddhorai" + testigoId)
		.html("<input class='form-control' type='time' id='testigoHoraInicio'>");
		$("#testigoHoraInicio").val(horaInicio);

		$("#tddhoraf" + testigoId)
		.html("<input class='form-control' type='time' id='testigoHoraFin'>");
		$("#testigoHoraFin").val(horaFin);
		
		$("#tddecl" + testigoId)
		.html("<textarea class='form-control'   id='testigoDeclara'></textarea>");
		$("#testigoDeclara").val(declaracion);

		modificarAcordeTipoTesti();
		var options={container:"#tddevi"+testigoId,
				functionCall:function(){guardarTesti() },
				descargaUrl: "/accidente/testigo/evidencia?id="+ testigoId,
				esNuevo:false,
				idAux:"Testigo"+testigoId,
				evidenciaNombre:testigoObj.evidenciaNombre};
		 crearFormEvidenciaCompleta(options);
		
		banderaedicion11 = true;
		$("#btnCancelarTesti").show();
		$("#btnAgregarTesti").hide();
		$("#btnEliminarTesti").show();
		$("#btnGuardarTesti").show();
	}
}

function guardarTesti() {

	var campoVacio = true;

	/***Poner atributos a guardar*****/
	tipoTestigo=$('#testigoTipo').val();
	testigoFecha=convertirFechaTexto($("#testigoFecha").val());
	if(testigoFecha ==null){
		testigoFecha=null;
	}
	declaracion=$("#testigoDeclara").val();
	nombre=$("#testigoNombre").val();
	lugar=$("#testigoLugar").val();
	horaInicio=$("#testigoHoraInicio").val();
	horaFin=$("#testigoHoraFin").val();
	investigadorId=$("#selInvestigador").val();
	if (campoVacio) {

		var dataParam = {
				accidenteId: accidenteId,
			testigoId:testigoId,
			 nombre:nombre,
			 testigoFechaDate:testigoFecha,
			 declaracion:declaracion,
			 lugarDeclarado:lugar,
			 horaInicio:horaInicio,
			 horaFin:horaFin,
			 investigadorId:investigadorId,
			 testigoTipoId:  tipoTestigo
			
		};

		callAjaxPost(URL + '/accidente/testigo/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						guardarEvidenciaAuto(data.nuevoId,"fileEviTestigo"+testigoId
								,bitsEvidenciaAccidente,"/accidente/testigo/evidencia/save",
								cargarModalTesti); 
					 
						break;
					default:
						alert("Ocurrió un error al guardar el involucrado!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}





function verDeclaracion(){
	
	$("#declaracionTesti").toggle();
}

