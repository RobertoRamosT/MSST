
var banderaedicion10;
var involucradoId;
var dni;
var nombre;
var sexo;
var edad;
var area;
var puesto;
var tiempoPuesto;
var parteCuerpoId;
var tipoLesionId;
var trabAccidId;
var trabajadorId;
var turno;
var horasTrabajadas;
var diasDescanso;
var fechaInicioDescanso;
var listadnitrab;
var listanombretab;
var listTrabAccFull;
var listTrabInvolucrados;

function verInvolucrados(){
	$("#mdInvolucrados").modal('show');
}	

$('#mdInvolucrados').on('show.bs.modal',function(e){
	cargarModalInvo();
});

function cambiarFechaDesc(){
	var dias= restaFechas($("#fechaDescanso").val(),$("#fechaFinDescanso").val());
	$("#diasDescanso").html(dias);
	 
	return restringirFecha("fechaDescanso","fechaFinDescanso","advFechaDesca");
}

function llenarCamposAutoTrab(){
	var nombreTrab = $("#invNombre").val();
	
	if($("#listTipoTrab").val() == 1){
		for(var index = 0;index < listDniNombre.length;index++){
			if(listDniNombre[index]["nombre"] == nombreTrab){
			    $("#thdni").html(listDniNombre[index]["dni"]);
				$("#thArea").html(listDniNombre[index]["areaNombre"]);
				$("#thPuesto").html(listDniNombre[index]["puestoNombre"]);
				$("#thSexo").html(listDniNombre[index]["sexoNombre"]);
				$("#thEdad").html(listDniNombre[index]["edad"]);

				var antiguedadPuesto= restaFechas(listDniNombre[index].fechaInicioPuesto,accDgFecha);
			 
				$("#thAntiguedadPuesto").html(antiguedadPuesto+" días");
				trabajadorId = listDniNombre[index]["trabajadoresId"];

				break;
			}else{
				$("#thdni").html("");$("#thArea").html("");$("#thPuesto").html("");
				$("#thSexo").html("");$("#thEdad").html("");$("#thAntiguedadPuesto").html("");
			}
		}
	}	
}

function modificarAcordeTipoInvo(){
    var tipoSeleccionado= parseInt($("#listTipoTrab").val());

	$("#invNombre").val("");$("#theviTrabInvo").html("");
    // listanombretab = listarStringsDesdeArray(listDniNombre,"nombre");
	
   	if(tipoSeleccionado == 2){
        $("#btnGuardarInvo").attr("onclick","javascript:guardarInvo();");
      	$("#btnEliminarInvo").attr("onclick","javascript:eliminarInvo();");
      	$("#datos2").html("*No llenar");
      	//$("#datost").html("no llenar");$("#datosh").html("no llenar");
      	$("#thant").html("<input id='invAntiguedad' class='form-control'>");
      	$("#thdni").html("<input type='text' id='invDni'>");
      	$("#invNombre").autocomplete({source:""});
      
      	$("#thArea").html('<input type="text" id="invArea" class="form-control">');
      	$("#thPuesto").html('<input type="text" id="invPuesto" class="form-control">');
      	$("#thSexo").html('<select class="form-control" id="slcSexo">' +
				'<option value="1">Masculino</option>' +
				'<option value="2">Femenino</option>' +
			'</select></th>');
		
      	$("#thEdad").html('<input type="text" class="form-control"   id="invEdad">');
      	$("#thAntiguedadPuesto").html('<input type="text" class="form-control" id="invAntiguedad">');
      	$("#thVerDatosLaborales").html("<a onclick='verDatosLaborales()'>Datos Laborales</a>");
      
      	$("#thtrabnuevo").html("");$("#invNombre").attr("onkeyup","");$("#datosMedicos").hide();
   	}else{
      	$("#thVerDatosLaborales").html("*Automático");
      	$("#datosLaborales").hide();
		
      	$("#btnGuardarInvo").attr("onclick", "javascript:guardarTrabAcc()");
      	$("#btnEliminarInvo").attr("onclick", "javascript:eliminarTrabAcc()");
      	$("#datos2").html("<a onclick='verDescanso()'>Descanso Laboral</a>");
      	$("#invNombre").attr("onkeyup","verAutoCompletarTrabAccidentado()");
		
      	var options={
			container:"#theviTrabInvo",functionCall:function(){},descargaUrl:"",
			esNuevo:true,idAux:"Accidentado0",evidenciaNombre:""
		};
		
      	crearFormEvidenciaCompleta(options);
		
      	$("#datosh").html("<input type='text' id='invHoras'>");
      	$("#thant").html("*Automático");$("#thdni").html("*Automático");

		verAutoCompletarTrabAccidentado();
      
      	$("#datost").html("<select class='form-control' id='selTurno'>" +
				"<option value=1>Mañana</option>" +
				"<option value=2>Tarde</option>" +
				"<option value=3>Noche</option>" +
				"<option value=4>Madrugada</option>" +
			"</select>");
    }

    $("#tblInvo tbody tr input").addClass("form-control");
}

var listTrabajadoresInvolucrados = [];

function verAutoCompletarTrabAccidentado(){
    var nombre = $("#invNombre").val().trim();

	if(nombre == ""){
		nombre = null;
	}

	var dataParam={
		trabajadorNombre:"%"+nombre+"%",empresaId:getSession("gestopcompanyid")
	};

	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({trabajadorId:-1,nombre:"Sin asignar",puesto:{positionName:""}});
		}

		listTrabajadoresInvolucrados = data.trabajadores;

		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajadorAccidente","verAcordeTrabajadorAccidentado()",
			data.trabajadores,"trabajadorId","nombre","#thtrabnuevo","");

		verAcordeTrabajadorAccidentado();

		$("#invNombre").attr("onkeyup","verAutoCompletarTrabAccidentado()");
	});
}

function verAcordeTrabajadorAccidentado(){
    
}

function cargarModalInvo(){
	$("#datosLaborales").hide();$("#datosMedicos").hide();
	
   	$("#btnAgregarInvo").attr("onclick","javascript:nuevoInvo();");$("#btnCancelarInvo").attr("onclick","javascript:cancelarInvo();");
	
   	$("#btnCancelarInvo").hide();$("#btnAgregarInvo").show();$("#btnEliminarInvo").hide();
   	$("#btnGuardarInvo").hide();

   	$("#epNombre").html(sessionStorage.getItem("gestopcompanyname"));$("#epRuc").html(sessionStorage.getItem("gestopcompanyruc"));
	
   	banderaedicion10 = false;involucradoId = 0;nombre = "";sexo = "";
	edad = 0;area = "";puesto = "";tiempoPuesto = 0;parteCuerpoId = 0;

   	var dataParam={
	    accidenteId:accidenteId
	};
   
   	$("#tblInvo tbody tr").remove();

   	callAjaxPost(URL+'/accidente/involucrado',dataParam,function(data2){
      	switch(data2.CODE_RESPONSE){
         	case "05":
	     		listTrabInvolucrados = data2.list;
				//Externo
				listTrabInvolucrados.forEach(function(val,index){
					var turno = (parseInt(val.turno) == 1?"Mañana":(parseInt(val.turno) == 2?"Tarde":
						(parseInt(val.turno) == 3?"Noche":(parseInt(val.turno) == 4?"Madrugada":"------"))));

	        	    $("#tblInvo tbody").append(
						"<tr id='tr"+val.involucradoId+"' onclick='javascript:editarInvo("+index+")'>" +
			                "<td id='tdtipo'>"+"Externo</td>" +
			    			"<td id='tddni"+val.involucradoId+"'>"+val.dni+"</td>" +
			    			"<td id='tdnombre"+val.involucradoId+"'>"+val.nombre+"</td>" +
			    			"<td id='tdtipconinv"+val.involucradoId+"'>"+val.tipoContrato+"</td>" +
			    			"<td id='thAntiguedadPuesto"+val.involucradoId+"'>"+val.tiempoPuesto+"</td>" +
						    "<td id='thExperienciaPuesto"+val.involucradoId+"'>"+val.tiempoExperienciaPuesto+"</td>" +
			    			"<td id='tdturno"+val.involucradoId+"'>"+turno+"</td>" +
			    			"<td id='tdhoras"+val.involucradoId+"'>"+val.horasTrabajadas+"</td>" +
			    			"<td id='tdlesion"+val.involucradoId+"'>"+val.tipoLesion.nombre+"</td>" +
			    			"<td id='tdparte"+val.involucradoId+"'>"+val.parteCuerpoNombre+"</td>" +
			    			"<td id='tdapartesec"+val.involucradoId+"'>"+val.partesAfectadasNombre+"</td>" +
			    			"<td id='tdobsmed"+val.involucradoId+"'>"+val.observaciones+"</td>" +
			    			"<td id='tdMedidaSanitizacion"+val.involucradoId+"'>"+val.medidaSanitizacion+"</td>" +
			    			"<td id='datoLaboral"+val.involucradoId+"'>"+val.puesto+"</td>" +
			    			"<td id='descansoMedico"+val.involucradoId+"'>*No es necesario</td>" +
			 			"</tr>");
	     		});

				break;
	     
         	default:
	    		alert("Ocurrió un error al traer las programaciones!");
		}
   	});
	
   	callAjaxPost(URL+'/accidente/trabacc',dataParam,function(data){
       	switch(data.CODE_RESPONSE){
         	case "05":
             	var list = data.list;listTrabAccFull = list;
             	//Interno
             	list.forEach(function(val,index){
					var turno = (parseInt(val.turno) == 1?"Mañana":(parseInt(val.turno) == 2?"Tarde":
						(parseInt(val.turno) == 3?"Noche":(parseInt(val.turno) == 4?"Madrugada":"------"))));

	        		$("#tblInvo tbody").append(
						"<tr id='tr"+val.trabAccidId+"' onclick='javascript:editarTrabAc("+index+")' >" +
							"<td id='tdatipo'>"+"Interno</td>" +
			    			"<td id='tdadni"+val.trabAccidId+"'>"+val.dni+"</td>" +
			    			"<td id='tdanombre"+val.trabAccidId+"'>"+val.nombre+"</td>" +
			    			"<td id='tdatipconinv"+val.trabAccidId+"'>"+val.tipoContrato+"</td>" +
			    			"<td id='thAntiguedadPuestoa"+val.trabAccidId+"'>"+val.tiempoPuesto+"</td>" +
						    "<td id='thExperienciaPuestoa"+val.trabAccidId+"'>"+val.tiempoExperienciaPuesto+"</td>" +
			    			"<td id='tdaturno"+val.trabAccidId+"'>"+turno+"</td>" +
			    			"<td id='tdahoras"+val.trabAccidId+"'>"+val.horasTrabajadas+"</td>" +
			    			"<td id='tdalesiona"+val.trabAccidId+"'>"+val.tipoLesion.nombre+"</td>" +
			    			"<td id='tdaparte"+val.trabAccidId+"'>"+val.parteCuerpoNombre+"</td>" +
			    			"<td id='tdapartesec"+val.trabAccidId+"'>"+val.partesAfectadasNombre+"</td>" +
			    			"<td id='tdobsmed"+val.trabAccidId+"'>"+val.observaciones+"</td>" +
			    			"<td id='tdaMedidaSanitizacion"+val.trabAccidId+"'>"+val.medidaSanitizacion+"</td>" +
			    			"<td id='adatoLaboral"+val.trabAccidId+"'>"+val.puestoNombre+"</td>" +
			    			"<td id='adescansoMedico"+val.trabAccidId+"'>"+val.diasDescanso+"</td>" +
			 			"</tr>");
             	});

				break;
		
         	default:
	    		alert("Ocurrió un error al traer las programaciones!");
      	}
   	});
}

function cancelarInvo(){
    cargarModalInvo();
}

function nuevoInvo(){
    var selParteCuerpo = crearSelectOneMenuOblig("selParteCuerpo","",listPartesCuerpo,
		"-1","parteCuerpoId","parteCuerpoNombre");
   
    var selTipoLesion = crearSelectOneMenuOblig("selTipoLesion","",listTipoLesion, 
		"-1","id","nombre");
	
   	if(!banderaedicion10){
      	var textExterno= ($("#accRpta1").prop("checked")?"<option value='2'>Externo</option>":""),
			textInterno= ($("#accRpta2").prop("checked")?"<option value='1'>Interno</option>":"");

      	involucradoId = 0;trabAccidId = 0;
		
      	$("#tblInvo tbody").append(
			"<tr id='0'>" +
		   	    "<th>" +
			        "<select class='form-control' id='listTipoTrab' onclick='modificarAcordeTipoInvo()'>" +
		                textInterno+textExterno +
		            "</select>" +
			    "</th>" +
		   		"<th id='thdni'><input type='text' class='form-control' id='invDni'></th>" +
		   		"<th><input type='text' class='form-control' id='invNombre'><div id='thtrabnuevo'></div></th>" +
		   		"<th><input type='text' class='form-control' id='invTipoContrato'></th>" +
		   		"<th id='thant'><input type='text' class='form-control' id='invAntiguedad'></th>" +
			    "<th>"+"<input id='inputTiempoExperienciaPuesto' type='number' min='0' step='1' " +
			                  "oninput='this.validity.valid || (this.value=\"\");' class='form-control'>"+"</th>" +
		        "<th id='datost'>" +
			        "<select class='form-control' id='selTurno'>" +
		                "<option value=1>Mañana</option>"+"<option value=2>Tarde</option>" +
		      			"<option value=3>Noche</option>"+"<option value=4>Madrugada</option>" +
	                "</select>" +
				"</th>" +
	            "<th id='datosh'><input type='text' id='invHoras'></th>" +
	            "<th>"+selTipoLesion+"</th>" +
	            "<th>"+selParteCuerpo+"</th>" +
	            "<th id='tdapartesec0'></th>" +
	            "<th>"+"<input type='text' id='invObservacion' class='form-control'>"+"</th>" +
	            "<th><input type='text' id='invMedidaSanitizacion' class='form-control'></th>" +
	            "<th id='thVerDatosLaborales'></th>" +
	            "<th id='datos2'><a onclick='verDescanso()'>Descanso</a></th>" +
	        "</tr>");
		
      	listPartesCuerpo.forEach(function(val1,index1){
         	val1.selected = 0;
      	});
		
      	var slcPartesAfectadas=crearSelectOneMenuObligMultipleCompleto("slcPartesAfectadas","",listPartesCuerpo,
			"parteCuerpoId","parteCuerpoNombre","#tdapartesec"+trabAccidId,"Ninguna");
      
      	modificarAcordeTipoInvo();
		
      	$("#btnCancelarInvo").show();$("#btnAgregarInvo").hide();$("#btnEliminarInvo").hide();
      	$("#btnGuardarInvo").show();

		banderaedicion10 = true;
   	}else{
        alert("Guarde primero.");
   	};
}

function eliminarInvo(){
	var r = confirm("¿Está seguro de eliminar el involucrado?");

	if(r == true){
		var dataParam={
			involucradoId:involucradoId
		};

		callAjaxPost(URL+'/accidente/involucrado/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					cargarModalInvo();

					break;

				default:
					alert("Ocurrió un error al eliminar la programacion!");
			}
		});
	}
}

function editarInvo(pindex){
	$("#btnGuardarInvo").attr("onclick","javascript:guardarInvo()");$("#btnEliminarInvo").attr("onclick","javascript:eliminarInvo()");

	if(!banderaedicion10){
		$("#thArea").html('<input type="text" id="invArea" class="form-control">');
		$("#thPuesto").html('<input type="text" id="invPuesto" class="form-control">');
		$("#thSexo").html('<select id="slcSexo" class="form-control">' +
				'<option value="1">Masculino</option>' +
				'<option value="2">Femenino</option>' +
			'</select></th>');
		$("#thEdad").html('<input type="number" class="form-control"   id="invEdad">');

		var invoAccidenteObj = listTrabInvolucrados[pindex];
		involucradoId = invoAccidenteObj.involucradoId;dni = invoAccidenteObj.dni;nombre = invoAccidenteObj.nombre;
		sexo = invoAccidenteObj.sexo;edad = invoAccidenteObj.edad;area = invoAccidenteObj.area;
		puesto = invoAccidenteObj.puesto;turno = invoAccidenteObj.turno;horasTrabajadas = invoAccidenteObj.horasTrabajadas;
		parteCuerpoId = invoAccidenteObj.parteCuerpoId;tipoLesionId = invoAccidenteObj.tipolesion;
		//
		$("#tr"+involucradoId).addClass("fila-edicion");

		var partes = invoAccidenteObj.partesAfectadasId;
		var partesId=partes.split(",");

		listPartesCuerpo.forEach(function(val,index){
			val.selected = 0;

			partesId.forEach(function(val1,index1){
				if(val.parteCuerpoId==val1){
					val.selected=1;
				}
			});
		});

		var slcPartesAfectadas=crearSelectOneMenuObligMultipleCompleto("slcPartesAfectadas","",
			listPartesCuerpo,"parteCuerpoId","parteCuerpoNombre","#tdapartesec"+involucradoId,"Ninguna");

		$("#tdtipconinv"+involucradoId).html("<input id='invTipoContrato' class='form-control'>");
		$("#invTipoContrato").val(invoAccidenteObj.tipoContrato);
		//
		$("#thAntiguedadPuesto"+involucradoId).html('<input type="text" class="form-control" id="invAntiguedad">');
		$("#invAntiguedad").val(invoAccidenteObj.tiempoPuesto);
			 
		var observacionMedica = listTrabInvolucrados[pindex].observaciones;
		$("#tdobsmed"+involucradoId).html("<input type='text' id='invObservacion' class='form-control'>");
		$("#invObservacion").val(observacionMedica);
		 
		var medidaSanitizacion = listTrabInvolucrados[pindex].medidaSanitizacion;
		$("#tdMedidaSanitizacion"+involucradoId).html("<input type='text' id='invMedidaSanitizacion' class='form-control'>");
		$("#invMedidaSanitizacion").val(medidaSanitizacion);
		 
		var selParteCuerpo = crearSelectOneMenuOblig("selParteCuerpo","",listPartesCuerpo,
			parteCuerpoId,"parteCuerpoId","parteCuerpoNombre");
		var selTipoLesion = crearSelectOneMenuOblig("selTipoLesion","",listTipoLesion,
			tipoLesionId,"id","nombre");

		$("#tdparte" + involucradoId).html(selParteCuerpo);$("#tdlesion"+involucradoId).html(selTipoLesion);

		$("#tddni"+involucradoId).html("<input type='text' class='form-control' id='invDni'>");
		$("#tdnombre"+involucradoId).html("<input type='text' id='invNombre' class='form-control'>");

		var selectTurno= "<select id='selTurno' class='form-control'>" +
				"<option value=1>Mañana</option>" +
				"<option value=2>Tarde</option>" +
				"<option value=3>Noche</option>" +
				"<option value=4>Madrugada</option>" +
		    "</select>";
		
		$("#tdturno"+involucradoId).html(selectTurno);
		$('#selTurno > option[value="'+turno+'"]').attr('selected','selected');
		$("#invTurno").val(turno);
		
		$("#tdhoras"+involucradoId).html("<input type='text' id='invHoras' class='form-control'>");
		$("#invHoras").val(horasTrabajadas);

		$("#datoLaboral"+involucradoId).html("<a onclick='verDatosLaborales()'>Datos Laborales</a>");
		$("#descansoMedico"+involucradoId).html("No es necesario llenar");
		
		nombrarInput("invDni",dni);nombrarInput("invNombre",nombre);nombrarInput("invArea",area);
		nombrarInput("invPuesto",puesto);nombrarInput("invEdad",edad);

		$('#slcSexo > option[value="'+sexo+'"]').attr('selected','selected');

		$("#thExperienciaPuesto"+involucradoId).html("<input id='inputTiempoExperienciaPuesto' type='number' " +
			"min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>");
		$("#inputTiempoExperienciaPuesto").val(invoAccidenteObj.tiempoExperienciaPuesto);

		banderaedicion10 = true;

		$("#btnCancelarInvo").show();$("#btnAgregarInvo").hide();$("#btnEliminarInvo").show();
		$("#btnGuardarInvo").show();
	}
}

function guardarInvo(){
    var campoVacio = true;
	
    var invDni = $("#invDni").val();
    var invNombre = $("#invNombre").val();
   	var invArea	= $("#invArea").val();
   	var invPuesto = $("#invPuesto").val();
   	var invSexo = $("#slcSexo").val();
   	var invEdad= parseInt($("#invEdad").val());
   	var invAntiguedad = $("#invAntiguedad").val();
   	var parte= ($("#selParteCuerpo").val() == '-1'?41:$("#selParteCuerpo").val());
	var tipoLesion= ($("#selTipoLesion").val() == '-1'?null:$("#selTipoLesion").val());
	var observaciones = $("#invObservacion").val();
	var medidaSanitizacion = $("#invMedidaSanitizacion").val();
	var tiempoExperienciaPuesto = $("#inputTiempoExperienciaPuesto").val();
   
   	var partesId = $("#slcPartesAfectadas").val();
   	var partesFinal= [];
	
   	if(partesId != null){
      	partesId.forEach(function(val,index){
         	partesFinal.push({id:val});
      	});
   	}
	 
   	var tipoContrato = $("#invTipoContrato").val();
   
   	turno = $("#selTurno").val();horasTrabajadas = $("#invHoras").val();
	
   	if(campoVacio){
      	var dataParam={
	      	accidenteId:accidenteId,partes:partesFinal,involucradoId:involucradoId,tipoContrato:tipoContrato,dni:invDni,
	      	nombre:invNombre,edad:invEdad,sexo:invSexo,observaciones:observaciones,area:invArea,puesto:invPuesto,
	      	tiempoPuesto:invAntiguedad,parteCuerpoId:parte,tipoLesion:{id:tipoLesion},turno:turno,horasTrabajadas:horasTrabajadas,
	      	medidaSanitizacion:medidaSanitizacion,tiempoExperienciaPuesto:tiempoExperienciaPuesto
		};

      	callAjaxPost(URL+'/accidente/involucrado/save',dataParam,function(data){
	    	switch(data.CODE_RESPONSE){
	       		case "05":
		   			cargarModalInvo();

					break;
					
	       		default:
		  			alert("Ocurrió un error al guardar el involucrado!");
	    	}
		});
   	}else{
      	alert("Debe ingresar todos los campos.");
   	}
}

function editarTrabAc(pindex){
	$("#btnGuardarInvo").attr("onclick","javascript:guardarTrabAcc()");$("#btnEliminarInvo").attr("onclick","javascript:eliminarTrabAcc()");

	if(!banderaedicion10) {
		var trabAccidenteObj = listTrabAccFull[pindex];trabAccidId = trabAccidenteObj.trabAccidId;trabajadorId = trabAccidenteObj.trabajadoresId;
		parteCuerpoId = trabAccidenteObj.parteCuerpoId;turno = trabAccidenteObj.turno;horasTrabajadas = trabAccidenteObj.horasTrabajadas;
		diasDescanso = trabAccidenteObj.diasDescanso;fechaInicioDescanso = trabAccidenteObj.fechaInicioDescanso;
		tipoLesionId = listTrabAccFull[pindex].tipoLesion.id;
		var fechaInicioPuesto = listTrabAccFull[pindex].fechaInicioPuesto;
		// var antiguedadPuesto = listTrabAccFull[pindex].tiempoPuesto;
		var observacionMedica = listTrabAccFull[pindex].observaciones;
		//
		$("#tr"+trabAccidId).addClass("fila-edicion");

		var partes = trabAccidenteObj.partesAfectadasId;
		var partesId = partes.split(",");

		listPartesCuerpo.forEach(function(val1,index1){
			val1.selected = 0;
		});

		partesId.forEach(function(val,index){
			listPartesCuerpo.forEach(function(val1,index1){
				if(val == val1.parteCuerpoId){
					val1.selected = 1;
				}
			});
		});

		var slcPartesAfectadas=crearSelectOneMenuObligMultipleCompleto("slcPartesAfectadas","",
			listPartesCuerpo,"parteCuerpoId","parteCuerpoNombre","#tdapartesec"+trabAccidId,"Ninguna");
			 
		//
		$("#tdatipconinv"+trabAccidId).html("<input type='text' id='invTipoContrato' class='form-control'>");
		$("#invTipoContrato").val(trabAccidenteObj.tipoContrato);
		 
		$("#tdobsmed"+trabAccidId).html("<input type='text' id='invObservacion' class='form-control'>");
		$("#invObservacion").val(observacionMedica);

		$("#tdaMedidaSanitizacion"+trabAccidId).html("<input type='text' id='invMedidaSanitizacion' class='form-control'>");
		$("#invMedidaSanitizacion").val(listTrabAccFull[pindex].medidaSanitizacion);
		 
		var selectTurno= "<select id='selTurno' class='form-control'>" +
			    "<option value=1>Mañana</option>" +
				"<option value=2>Tarde</option>" +
				"<option value=3>Noche</option>" +
				"<option value=4>Madrugada</option>" +
		    "</select>";

		var selParteCuerpo = crearSelectOneMenuOblig("selParteCuerpo","",listPartesCuerpo,
			parteCuerpoId,"parteCuerpoId","parteCuerpoNombre");

		var selTipoLesion = crearSelectOneMenuOblig("selTipoLesion","",listTipoLesion,
			tipoLesionId,"id","nombre");

		$("#tdalesiona"+trabAccidId).html(selTipoLesion);
		$("#tdadni"+trabAccidId).html(trabAccidenteObj.dni);
		$("#tdanombre"+trabAccidId).html(trabAccidenteObj.nombre);
		$("#tdaturno"+trabAccidId).html(selectTurno);
		$('#selTurno > option[value="'+turno+'"]').attr('selected','selected');
		
		$("#tdahoras"+trabAccidId).html("<input type='text' id='invHoras' class='form-control'>");
		$("#tdaparte"+trabAccidId).html(selParteCuerpo);
		
		$("#adatoLaboral"+trabAccidId).html("<a onclick='verDatosLaborales()'>Datos Laborales</a>");
		$("#adescansoMedico"+trabAccidId).html("<a onclick='verDescanso()'>Descanso</a>");

		$("#invTurno").val(turno);$("#invHoras").val(horasTrabajadas);
		$("#thArea").html(trabAccidenteObj.areaNombre);
		$("#thPuesto").html(trabAccidenteObj.puestoNombre);

		var genero= (trabAccidenteObj.sexoId == 1?"Masculino":"Femenino");
		$("#thSexo").html(genero);

		$("#thEdad").html(trabAccidenteObj.edad);
		//$("#thAntiguedadPuesto").html(antiguedadPuesto);
		$("#diasDescanso").html(diasDescanso);
		$("#fechaDescanso").val(fechaInicioDescanso);
		
		var options={
			container:"#theviTrabInvo",functionCall:function(){guardarTrabAcc()},
			descargaUrl:"/accidente/involucrado/evidencia?id="+trabAccidId,
			esNuevo:false,idAux:"Accidentado"+trabAccidId,
			evidenciaNombre:listTrabAccFull[pindex].evidenciaDescansoNombre
		};

		crearFormEvidenciaCompleta(options);
		var fechaAux = fechaInicioDescanso.split('-');
	    var fecha= new Date(fechaAux[0],fechaAux[1],fechaAux[2]);

	    //Obtenemos los milisegundos desde media noche del 1/1/1970
	    var tiempo= fecha.getTime();
	    //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
	    var milisegundos= parseInt(diasDescanso*24*60*60*1000);
	    //Modificamos la fecha actual
	    var total= fecha.setTime(tiempo+milisegundos);
	    var day= fecha.getUTCDate();
	    var month= fecha.getUTCMonth();
	    
	    if(parseInt(month) < 10){
	    	month = "0"+month;
	    }
	   
	    var year = fecha.getUTCFullYear();
	    
	    if(parseInt(day) < 10){
	    	day = "0"+day;
	    }

		var fechaModificada=year+"-"+month+"-"+day;

	    $("#fechaFinDescanso").val(fechaModificada);

		$("#thExperienciaPuestoa"+trabAccidId).html("<input id='inputTiempoExperienciaPuesto' type='number' " +
			"min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>");
		$("#inputTiempoExperienciaPuesto").val(trabAccidenteObj.tiempoExperienciaPuesto);

		banderaedicion10 = true;

		$("#btnCancelarInvo").show();$("#btnAgregarInvo").hide();$("#btnEliminarInvo").show();
		$("#btnGuardarInvo").show();
	}
}

function guardarTrabAcc(){
    var campoVacio = true;
   
   	turno = $("#selTurno").val();;
   	horasTrabajadas = $("#invHoras").val();
   	fechaInicioDescanso = $("#fechaDescanso").val();
   	diasDescanso = restaFechas(fechaInicioDescanso,$("#fechaFinDescanso").val());
	
   	if(fechaInicioDescanso == ""){
        fechaInicioDescanso = null;
   	}
	
   	var observaciones = $("#invObservacion").val();
   	var medidaSanitizacion = $("#invMedidaSanitizacion").val();
   	var parteCuerpoId = $("#selParteCuerpo").val();
   	var tipoLesion = $("#selTipoLesion").val();
	var tiempoExperienciaPuesto = $("#inputTiempoExperienciaPuesto").val();
   
   	var partesId = $("#slcPartesAfectadas").val();
   	var partesFinal= [];
	 
    if(partesId == null){
        partesId = [];
    }

   	partesId.forEach(function(val,index){
        partesFinal.push({id:val});
   	});
	 
   	var tipoContrato = $("#invTipoContrato").val();
	
   	if(campoVacio){
      	var dataParam={
	      	accidenteId:accidenteId,partes:partesFinal,trabAccidId:trabAccidId,tipoContrato:tipoContrato,trabajadoresId:$("#selAutoTrabajadorAccidente").val(),
	      	parteCuerpoId:parteCuerpoId,turno:turno,observaciones:observaciones,medidaSanitizacion:medidaSanitizacion,horasTrabajadas:horasTrabajadas,
	      	diasDescanso:diasDescanso,fechaInicioDescanso:fechaInicioDescanso,tipoLesion:{id:tipoLesion},tiempoExperienciaPuesto:tiempoExperienciaPuesto
		};

      	callAjaxPost(URL+'/accidente/trabacc/save',dataParam,function(data){
			switch(data.CODE_RESPONSE){
	       		case "05":
					guardarEvidenciaAuto(data.nuevoId,"fileEviAccidentado"+trabAccidId,bitsEvidenciaAccidente,
						"/accidente/involucrado/evidencia/save",cargarModalInvo);

					break;

				default:
		  			alert("Ocurrió un error al guardar el involucrado!");
			}
		});
	}else{
		alert("Debe ingresar todos los campos.");
   	}
}

function eliminarTrabAcc(){
	var r = confirm("¿Está seguro de eliminar el involucrado?");

	if(r == true){
		var dataParam={
			trabAccidId:trabAccidId
		};

		callAjaxPost(URL+'/accidente/trabacc/delete',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					cargarModalInvo();

					break;

				default:
					alert("Ocurrió un error al eliminar la programacion!");
			}
		});
	}
}

function verDatosLaborales(){
	$("#datosLaborales").toggle();
}

function verDescanso(){	
	$("#datosMedicos").toggle();	
}