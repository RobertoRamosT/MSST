/**
 * 
 */
var banderaEdicionVigMedica;
var vigilanciaMedicaObj;
var listFullVigilanciaMedica;
var listTipoVigilanciaMedica;var listTipoVigilanciaMedicaFull;
var listCategoriaVigilanciaMedica;

var listTrabajadoresVigilanciaMedica;
var trabajadorAsociadoVigilanciaId;

var isContinuacion=false;
function volverVigilanciaMedica(){
	$("#divModulo .container-fluid").hide();
	$("#divVigMedica").show();
	
	$("h2").html("<a onclick='volverExamenesGeneral()'>Exámenes Médicos</a> > Vigilancia Médica");
	
}

function iniciarVigilanciaMedica(){
	$("#divModulo .container-fluid").hide();
	$("#divVigMedica").show();
	
	$("h2").html("<a onclick='volverExamenesGeneral()'>Exámenes Médicos</a> > Vigilancia Médica");
	
	
	isContinuacion=false;
	banderaEdicionVigMedica=false;
	var dataParam = {
			empresa:{empresaId : getSession("gestopcompanyid")}
		};
	vigilanciaMedicaObj={id:0,hallazgoPadre:{id:null}}
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgos', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullVigilanciaMedica= data.list;
				listTipoVigilanciaMedica=data.tipos;
				listTipoVigilanciaMedicaFull=data.tipos;
				listTipoVigilanciaMedica=listTipoVigilanciaMedica.filter(function(val){
					if(val.id==1 || val.id==2){
						return false;
					}else{
						return true;
					}
				});
				listCategoriaVigilanciaMedica=data.categorias
				listTrabajadoresVigilanciaMedica=data.trabajadores;
				trabajadorAsociadoVigilanciaId=null;
				insertarTablaVigMedica();
				formatoCeldaSombreableTabla(true,"wrapVigMedica table");
				break;
			default:
				alert("Ocurrió un error al traer las vigilancias!");
			}
		})
	
}
function insertarTablaVigMedica(){
	$("#btnCancelarVig").hide().attr("onclick","cancelarVigilanciaMedica()");
	$("#btnAgregarVig").show().attr("onclick","agregarVigilanciaMedica()");
	$("#btnEliminarVig").hide().attr("onclick","eliminarVigilanciaMedica()");
	$("#btnGuardarVig").hide().attr("onclick","guardarVigilanciaMedica()");
	$("#btnControlVig").hide().attr("onclick","agregarContinuacionVigMedica()");
	
	
	$("#wrapVigMedica table tbody tr").remove();
	listFullVigilanciaMedica.forEach(function(val,index) {
		
		if(val.tipo.id==1 ){
			val.ultimoResultado=val.descripcion;
			val.ultimaRecomendacion=val.recomendacion;
			val.ultimoExamenMedico=val.evaluacion.evidenciaExamenNombre;
			val.ultimoCertificado=val.evaluacion.evidenciaNombre;
		}else if(val.tipo.id==2){
			val.descripcion=val.hallazgoPrimero.descripcion;
			val.ultimoResultado=val.hallazgoPrimero.descripcion;
			val.ultimaRecomendacion=val.hallazgoPrimero.recomendacion;
			val.ultimoExamenMedico=val.hallazgoPrimero.evaluacion.evidenciaExamenNombre;
			val.ultimoCertificado=val.hallazgoPrimero.evaluacion.evidenciaNombre;
		}else{
			val.ultimoResultado="--";
			val.ultimaRecomendacion="--";
			val.ultimoExamenMedico="--";
			val.ultimoCertificado="--";
		}
		$("#wrapVigMedica table tbody").append(
				"<tr  onclick='editarVigilanciaMedica("+index+")'>"
						+ "<td id='vigtip"
						+ val.id + "'>"
						+val.tipo.nombre +"</td>"
						+ "<td id='vigcat"
						+ val.id + "'>"
						+val.categoria.nombre +"</td>"
						+ "<td id='vigtr"
						+ val.id + "'>"
						+val.trabajador.nombre+" - "+val.trabajador.dni+"</td>" 
						+ "<td id='vigfp"
						+ val.id + "'>"
						+val.fechaPlanificadaTexto+"</td>" 
						+ "<td id='vighp"
						+ val.id + "'>"
						+val.horaPlanificadaTexto+"</td>" 
						
						+ "<td id='vigultres"
						+ val.id + "' style='border-left:solid #a6a1a1 4px'>"
						+val.ultimoResultado+"</td>" 
						+ "<td id='vigultreco"
						+ val.id + "'>"
						+val.ultimaRecomendacion+"</td>" 
						+ "<td id='vigultex"
						+ val.id + "'>"
						+val.ultimoExamenMedico+"</td>" 
						+ "<td id='vigultcer"
						+ val.id + "'>"
						+val.ultimoCertificado+"</td>" 
						
						+ "<td id='vigfr"
						+ val.id + "' style='border-left:solid #a6a1a1 4px'>"
						+val.fechaRealTexto+"</td>" 
						+ "<td id='vighr"
						+ val.id + "'>"
						+val.horaRealTexto+"</td>" 
						+ "<td id='vigres"
						+ val.id + "'>"
						+val.resultadoVigilancia+"</td>" 
						+ "<td id='vigotro"
						+ val.id + "'>"
						+(val.hasOtroHallazgo==1?"Sí":"No")+"</td>" 
						+ "<td id='vignumh"
						+ val.id + "'>"
						+val.numHallazgosHijos+"</td>" 
						
						+ "<td id='vignuevo"
						+ val.id + "'>"
						+val.recomendacionNueva+"</td>" 
						+ "<td id='vigevi"
						+ val.id + "'>"
						+val.evidenciaNombre+"</td>" 
						
						+ "<td id='vigest"
						+ val.id + "'>"
						+val.estado.nombre+"</td>" 
							+"</tr>");
		
	});
}
function agregarVigilanciaMedica(){
	if(!banderaEdicionVigMedica){
		banderaEdicionVigMedica=true;trabajadorAsociadoVigilanciaId=null;vigilanciaMedicaObj={id:0,hallazgoPadre:{id:null}}
		$("#btnCancelarVig").show() 
		$("#btnAgregarVig").hide() 
		$("#btnEliminarVig").hide() 
		$("#btnGuardarVig").show()
		var selCategoriaHallMedico= crearSelectOneMenuOblig("selCategoriaHallMedico", "", 
				listCategoriaVigilanciaMedica, "", 
				"id","nombre");
		var selTipoHallMedico= crearSelectOneMenuOblig("selTipoHallMedico", "cambiarAcordeTipoVigilanciaMedica()", 
				listTipoVigilanciaMedica, "", 
				"id","nombre");
		var selHasOtroVigMedica= crearSelectOneMenuOblig("selHasOtroVigMedica", "", 
				listBoolean, "", 
				"id","nombre");
		
		$("#wrapVigMedica table tbody").prepend(
				"<tr  >"
						+ "<td>"+selTipoHallMedico +"</td>"
						+ "<td>"+selCategoriaHallMedico +"</td>"
						+ "<td><input id='inputTrabVig' class='form-control'>" +"</td>"
						+ "<td><input type='date' id='datePlanVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'></td>" 
						+ "<td><input type='time' id='timePlanVigMedica' class='form-control' ></td>" 
						+ "<td>...</td>" 
						+ "<td>...</td>" 
						+ "<td>...</td>" 
						+ "<td>...</td>"
						+ "<td><input type='date' id='dateRealVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'></td>" 
						+ "<td><input type='time' id='timeRealVigMedica' class='form-control' ></td>" 
						+ "<td><input  id='inputResultadoVigMedica' class='form-control' ></td>" 
						+ "<td>"+selHasOtroVigMedica +"</td>"
						+"<td>...</td>"
						+ "<td><input  id='inputRecoNuevaVigMedica' class='form-control' ></td>" 
						+ "<td id='vigevi0'>...</td>" 
						
						+ "<td id='vigest0'>...</td>" 
							+"</tr>");
		$("#wrapVigMedica").find("#datePlanVigMedica").val(obtenerFechaActual())
		$("#wrapVigMedica").find("#timePlanVigMedica").val("12:00:00")
		formatoCeldaSombreableTabla(false,"wrapVigMedica table");
		
		var listaTrabs=listarStringsDesdeArray(listTrabajadoresVigilanciaMedica,"nombre");
		
		ponerListaSugerida("inputTrabVig",listaTrabs,true);
		$("#inputTrabVig").on("autocompleteclose", function(){
			var nombreTrab=$("#inputTrabVig").val();
			listTrabajadoresVigilanciaMedica.every(function(val) {
					if(val.nombre.trim()==nombreTrab.trim()){
						trabajadorAsociadoVigilanciaId=val.trabajadorId;
					return false;
					}
					return true;
				})
		});
		cambiarAcordeTipoVigilanciaMedica();
		var options=
		{container:"#vigevi"+vigilanciaMedicaObj.id,
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"VigMedica",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
	}
}
function cambiarAcordeTipoVigilanciaMedica(){
	var tipoId=$("#selTipoHallMedico").val();
}

function guardarVigilanciaMedica(){
	var campoVacio = true;
var tipo=$("#selTipoHallMedico").val() ;
var categoria=$("#selCategoriaHallMedico").val(); 
var fechaPlanificada=convertirFechaTexto($("#datePlanVigMedica").val());
var horaPlanificada=$("#timePlanVigMedica").val();
var fechaReal=convertirFechaTexto($("#dateRealVigMedica").val());
var horaReal=$("#timeRealVigMedica").val();
var resultadoVigilancia=$("#inputResultadoVigMedica").val();
var hasOtroHallazgo=$("#selHasOtroVigMedica").val();
var recomendacionNueva=$("#inputRecoNuevaVigMedica").val();
var descripcion="";
var recomendacion="";
var restriccion="";
if(isContinuacion){
	tipo=vigilanciaMedicaObj.tipo.id;
	
}else{
	
}

if(vigilanciaMedicaObj.id!=0){

	if(vigilanciaMedicaObj.tipo.id==1 || vigilanciaMedicaObj.tipo.id==2){
		tipo=vigilanciaMedicaObj.tipo.id;

	}
}
		if (campoVacio) {

			var dataParam = {
				id : vigilanciaMedicaObj.id, 
				descripcion:descripcion,
				recomendacion:recomendacion,
				restriccion:restriccion,
				
				tipo:{id:tipo},
				categoria:{id:categoria},
				trabajador:{trabajadorId:trabajadorAsociadoVigilanciaId},
				fechaPlanificada:fechaPlanificada,
				horaPlanificada:horaPlanificada,
				fechaReal:fechaReal,
				horaReal:(horaReal==""?null:horaReal),
				resultadoVigilancia:resultadoVigilancia,
				hasOtroHallazgo:hasOtroHallazgo,
				recomendacionNueva:recomendacionNueva,
				estado:vigilanciaMedicaObj.estado,
				
				hallazgoPadre:{id:vigilanciaMedicaObj.hallazgoPadre.id},
				hallazgoPrimero:vigilanciaMedicaObj.hallazgoPrimero,
				
				evaluacion:vigilanciaMedicaObj.evaluacion,
				empresa:{empresaId:getSession("gestopcompanyid")}
			};
			
			callAjaxPost(URL + '/examenmedico/vigilancia_medica/hallazgo/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							guardarEvidenciaAuto(data.nuevoId,"fileEviVigMedica"
									,bitsEvidenciaObservacion,"/examenmedico/vigilancia_medica/hallazgo/evidencia/save"
									,iniciarVigilanciaMedica); 
						 
							break;
						default:
							console.log("Ocurrió un error al guardar la programacion!");
						}
					});
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
}
function editarVigilanciaMedica(pindex){
	if(!banderaEdicionVigMedica){
		banderaEdicionVigMedica=true;
		vigilanciaMedicaObj=listFullVigilanciaMedica[pindex];
		
		var selCategoriaHallMedico= crearSelectOneMenuOblig("selCategoriaHallMedico", "", 
				listCategoriaVigilanciaMedica, vigilanciaMedicaObj.categoria.id, 
				"id","nombre");
		$("#vigcat"+vigilanciaMedicaObj.id).html(selCategoriaHallMedico)
		//
		var selTipoHallMedico= crearSelectOneMenuOblig("selTipoHallMedico", "cambiarAcordeTipoVigilanciaMedica()", 
				listTipoVigilanciaMedica, vigilanciaMedicaObj.tipo.id, 
				"id","nombre");
		$("#vigtip"+vigilanciaMedicaObj.id).html(selTipoHallMedico)
		//
		trabajadorAsociadoVigilanciaId=vigilanciaMedicaObj.trabajador.trabajadorId
		//
		$("#vigfp"+vigilanciaMedicaObj.id)
		.html("<input type='date' id='datePlanVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'>")
		$("#datePlanVigMedica").val(convertirFechaInput(vigilanciaMedicaObj.fechaPlanificada));
		//
		$("#vighp"+vigilanciaMedicaObj.id)
		.html("<input type='time' id='timePlanVigMedica' class='form-control'  >")
		$("#timePlanVigMedica").val(vigilanciaMedicaObj.horaPlanificada);
		//
		$("#vigfr"+vigilanciaMedicaObj.id)
		.html("<input type='date' id='dateRealVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'>")
		$("#dateRealVigMedica").val(convertirFechaInput(vigilanciaMedicaObj.fechaReal));
		//
		$("#vighr"+vigilanciaMedicaObj.id)
		.html("<input type='time' id='timeRealVigMedica' class='form-control'  >")
		$("#timeRealVigMedica").val(vigilanciaMedicaObj.horaReal);
		//
		$("#vigres"+vigilanciaMedicaObj.id)
		.html("<input  id='inputResultadoVigMedica' class='form-control'  >")
		$("#inputResultadoVigMedica").val(vigilanciaMedicaObj.resultadoVigilancia);
		//
		var selHasOtroVigMedica= crearSelectOneMenuOblig("selHasOtroVigMedica", "", 
				listBoolean, vigilanciaMedicaObj.hasOtroHallazgo, 
				"id","nombre");
		$("#vigotro"+vigilanciaMedicaObj.id).html(selHasOtroVigMedica);
		//
		$("#vignuevo"+vigilanciaMedicaObj.id)
		.html("<input  id='inputRecoNuevaVigMedica' class='form-control'  >")
		$("#inputRecoNuevaVigMedica").val(vigilanciaMedicaObj.recomendacionNueva);
		
		
		var options=
		{container:"#vigevi"+vigilanciaMedicaObj.id,
				functionCall:function(){ },
				descargaUrl: "/examenmedico/vigilancia_medica/hallazgo/evidencia?id="+vigilanciaMedicaObj,
				esNuevo:false,
				idAux:"VigMedica",
				evidenciaNombre:""+vigilanciaMedicaObj.evidenciaNombre};
		crearFormEvidenciaCompleta(options);
		cambiarAcuerdoFechaVigilancia();
		
		if(vigilanciaMedicaObj.tipo.id==1 || vigilanciaMedicaObj.tipo.id==2 ){
			$("#vigtip"+vigilanciaMedicaObj.id).html(vigilanciaMedicaObj.tipo.nombre);
			
			
		}
		var buttonNext="<i class='fa fa-table  fa-2x'></i>"
			$("#vignumh"+vigilanciaMedicaObj.id).addClass("linkGosst")
			.on("click",function(){verControlesVigenciaAsociados();})
			.html(buttonNext+vigilanciaMedicaObj.numHallazgosHijos);
		
		
		$("#btnCancelarVig").show()
		$("#btnAgregarVig").hide()
		$("#btnEliminarVig").show()
		$("#btnGuardarVig").show();
		$("#btnControlVig").show();
		formatoCeldaSombreableTabla(false,"wrapVigMedica table");
		
	}
}
function verControlesVigenciaAsociados(){
	$("#divModulo .container-fluid").hide();
	$("#divControlesVigMedica").show();
	
	$("h2").html("<a onclick='volverExamenesGeneral()'>Exámenes Médicos</a> > " +
			"<a onclick='volverVigilanciaMedica()' >Vigilancia Médica "+vigilanciaMedicaObj.categoria.nombre+" "+
			vigilanciaMedicaObj.fechaPlanificadaTexto+" de "+
			vigilanciaMedicaObj.trabajador.nombre+""+
			" </a> > " +
					"Controles subsiguientes");
	
	$("#wrapControlVigMedica table tbody").find("tr").remove();
	listFullVigilanciaMedica.forEach(function(val){
		if(val.hallazgoPadre==null){
			
		}else{
			if(val.hallazgoPadre.id==vigilanciaMedicaObj.id){
				$("#wrapControlVigMedica table tbody")
				.append("<tr >"
						+ "<td id='vigtip"
						+ val.id + "'>"
						+val.tipo.nombre +"</td>"
						+ "<td id='vigcat"
						+ val.id + "'>"
						+val.categoria.nombre +"</td>"
						+ "<td id='vigtr"
						+ val.id + "'>"
						+val.trabajador.nombre+" - "+val.trabajador.dni+"</td>" 
						+ "<td id='vigfp"
						+ val.id + "'>"
						+val.fechaPlanificadaTexto+"</td>" 
						+ "<td id='vighp"
						+ val.id + "'>"
						+val.horaPlanificadaTexto+"</td>" 
						
						
						
						+ "<td id='vigfr"
						+ val.id + "' style='border-left:solid #a6a1a1 4px'>"
						+val.fechaRealTexto+"</td>" 
						+ "<td id='vighr"
						+ val.id + "'>"
						+val.horaRealTexto+"</td>" 
						+ "<td id='vigres"
						+ val.id + "'>"
						+val.resultadoVigilancia+"</td>" 
						
						+ "<td id='vigevi"
						+ val.id + "'>"
						+val.evidenciaNombre+"</td>" 
						
						+ "<td id='vigest"
						+ val.id + "'>"
						+val.estado.nombre+"</td>" 
							+"</tr>")
			}
		}
		
	});
	
}
function agregarContinuacionVigMedica(){
	insertarTablaVigMedica();
	isContinuacion=true;
	var tipoContinuacion=vigilanciaMedicaObj.tipo;
	if(vigilanciaMedicaObj.tipo.id==1 || vigilanciaMedicaObj.tipo.id==2){
		tipoContinuacion=listTipoVigilanciaMedicaFull[1];
	}
	banderaEdicionVigMedica=true;
	trabajadorAsociadoVigilanciaId=vigilanciaMedicaObj.trabajador.trabajadorId
	vigilanciaMedicaObj={id:0,hallazgoPadre:{id:vigilanciaMedicaObj.id},hallazgoPrimero:vigilanciaMedicaObj.hallazgoPrimero,
			trabajador:vigilanciaMedicaObj.trabajador,tipo:tipoContinuacion,
			descripcion:vigilanciaMedicaObj.descripcion,evaluacion:vigilanciaMedicaObj.evaluacion};
	$("#btnCancelarVig").show() 
	$("#btnAgregarVig").hide() 
	$("#btnEliminarVig").hide() 
	$("#btnGuardarVig").show()
	var selCategoriaHallMedico= crearSelectOneMenuOblig("selCategoriaHallMedico", "", 
			listCategoriaVigilanciaMedica, "", 
			"id","nombre");
	var selTipoHallMedico= vigilanciaMedicaObj.tipo.nombre+"   <br>"+vigilanciaMedicaObj.descripcion.substr(0,30)+"...";
	var selHasOtroVigMedica= crearSelectOneMenuOblig("selHasOtroVigMedica", "", 
			listBoolean, "", 
			"id","nombre");
	
	$("#wrapVigMedica table tbody").prepend(
			"<tr  >"
					+ "<td>"+selTipoHallMedico +"</td>"
					+ "<td>"+selCategoriaHallMedico +"</td>"
					+ "<td>"+vigilanciaMedicaObj.trabajador.nombre +"</td>"
					+ "<td><input autofocus='true' type='date' id='datePlanVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'></td>" 
					+ "<td><input type='time' id='timePlanVigMedica' class='form-control' ></td>" 
					+ "<td>"+"..."+"</td>" 
					+ "<td>"+"..."+"</td>" 
					+ "<td>"+"..."+"</td>" 
					+ "<td>"+"..."+"</td>" 
					//+ "<td>"+vigilanciaMedicaObj.ultimoResultado+"</td>" 
					//+ "<td>"+vigilanciaMedicaObj.ultimaRecomendacion+"</td>" 
					//+ "<td>"+vigilanciaMedicaObj.ultimoExamenMedico+"</td>" 
					//+ "<td>"+vigilanciaMedicaObj.ultimoCertificado+"</td>"
					+ "<td><input type='date' id='dateRealVigMedica' class='form-control' onchange='cambiarAcuerdoFechaVigilancia()'></td>" 
					+ "<td><input type='time' id='timeRealVigMedica' class='form-control' ></td>" 
					+ "<td><input  id='inputResultadoVigMedica' class='form-control' ></td>" 
					+ "<td>"+selHasOtroVigMedica +"</td>"
					+"<td>...</td>"
					+ "<td><input  id='inputRecoNuevaVigMedica' class='form-control' ></td>" 
					+ "<td id='vigevi0'>...</td>" 
					
					+ "<td id='vigest0'>...</td>" 
						+"</tr>");
	$("#wrapVigMedica").find("#datePlanVigMedica").val(obtenerFechaActual())
	$("#wrapVigMedica").find("#timePlanVigMedica").val("12:00:00")
	formatoCeldaSombreableTabla(false,"wrapVigMedica table");
	var options=
	{container:"#vigevi"+vigilanciaMedicaObj.id,
			functionCall:function(){ },
			descargaUrl: "",
			esNuevo:true,
			idAux:"VigMedica",
			evidenciaNombre:""};
	crearFormEvidenciaCompleta(options);
}
function eliminarVigilanciaMedica(){
	var r=confirm("¿Esta seguro de eliminar el registro?");
	if(r){
	var objHallazgo={
			id:vigilanciaMedicaObj.id 
	}
	callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgo/delete', objHallazgo, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			iniciarVigilanciaMedica();
			
			break;
			default:alert("Error: elimine los controles subsiguientes asociados antes de eliminar este registro.")
				break;
		}
	})
	}
}
function volverExamenesGeneral(){
	$("#divModulo .container-fluid").hide();
	$("#divExamenGeneral").show();
	
	$("h2").html("Listado Exámenes Médicos")

}
function cancelarVigilanciaMedica(){
	iniciarVigilanciaMedica();
}
function cambiarAcuerdoFechaVigilancia(){
	var fechaPlanificada=$("#datePlanVigMedica").val();
	var fechaReal=$("#dateRealVigMedica").val();
	 
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		vigilanciaMedicaObj.estado={
				id:2,nombre:"Completado"
		}
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				vigilanciaMedicaObj.estado={
						id:3,nombre:"Retrasado"
				}
			}else{
				vigilanciaMedicaObj.estado={
						id:1,nombre:"Por Implementar"
				}
			}
			
		}else{
			vigilanciaMedicaObj.estado={
					id:1,nombre:"Por Implementar"
			}
		}
	}
	
	$("#vigest"+vigilanciaMedicaObj.id).html(vigilanciaMedicaObj.estado.nombre);
}
var listUnidadesVigilancia=[];
function verResultadosVigilanciaMedica(){
	$("#divModulo .container-fluid").hide();
	$("#divResultVigMedica").show();
	
	$("h2").html("<a onclick='volverExamenesGeneral()'>Exámenes Médicos</a> > Resultados Vigilancia Médica");
	
	var dataParam = {
			empresaId : getSession("gestopcompanyid")
		};
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgos/resumen/ayuda', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listFullVigilanciaMedica= data.list;
				listTipoVigilanciaMedica=data.tipos;
				listTipoVigilanciaMedicaFull=data.tipos;
				
				listTipoVigilanciaMedica=listTipoVigilanciaMedica.filter(function(val){
					if(val.id==1 || val.id==2){
						return false;
					}else{
						return true;
					}
				});
				listCategoriaVigilanciaMedica=data.categorias;
				resizeDivWrapper("wrapResultVigMedica",380);
				$("#tblResultVigMedico thead tr").html("<td class='tb-acc'>...</td>" +
						"<td class='tb-acc' style='width:140px'>Estado</td>" +
						"<td class='tb-acc' style='width:140px'>Fecha  último examen</td>" +
						"<td class='tb-acc' style='width:140px'>Fecha vigencia </td>" +
						"<td class='tb-acc' style='width:140px'>Evaluación</td>");
				listCategoriaVigilanciaMedica.forEach(function(val){
					$("#tblResultVigMedico thead tr").append("<td class='tb-acc'>"+val.nombre+"</td>")
				});
				 
				//
				
				listUnidadesVigilancia=data.unidades;
				var objTodo=[{matrixName:"TODOS",mdfId:0 }];
				listUnidadesVigilancia = objTodo.concat(listUnidadesVigilancia);
				crearSelectOneMenuObligUnitarioCompleto("selUnidadVigMedica", "verAcordeUnidadVigMedica()", 
						listUnidadesVigilancia, "mdfId",
						"matrixName","#divSelUnidadResult","Unidades");
				verAcordeUnidadVigMedica();
				//
				break;
			default:
				alert("Ocurrió un error al traer las vigilancias!");
			}
		})
	
}

function verAcordeUnidadVigMedica(){
	var unidadId=parseInt($("#selUnidadVigMedica").val());
	$("#divSelDivisionResult").show();$("#labelSelDivisionResult").show();
	$("#divSelAreaResult").show();$("#labelSelAreaResult").show();
	$("#divSelPuestoResult").show();$("#labelSelPuestoResult").show();
	if(unidadId==0){
		$("#divSelDivisionResult").hide();$("#labelSelDivisionResult").hide();
		$("#divSelAreaResult").hide();$("#labelSelAreaResult").hide();
		$("#divSelPuestoResult").hide();$("#labelSelPuestoResult").hide();
		$("#wrapResultVigMedica").hide();
	}else{
		listUnidadesVigilancia.forEach(function(val){
			if(val.mdfId==unidadId){
				var objTodo=[{divisionName:"TODOS",divisionId:0 }];
				val.divisiones=val.divisiones.filter(function(v){
					if(v.divisionId==0){return false;}else{return true;}
				})
				val.divisiones = objTodo.concat(val.divisiones);
				crearSelectOneMenuObligUnitarioCompleto("selDivisionVigMedica", "verAcordeDivisionVigMedica()", val.divisiones, "divisionId",
						"divisionName","#divSelDivisionResult","Divisiones");
				verAcordeDivisionVigMedica();
			}
		});
	}
}

function verAcordeDivisionVigMedica(){
	var unidadId=parseInt($("#selUnidadVigMedica").val());
	var divisionId=parseInt($("#selDivisionVigMedica").val());
	$("#divSelAreaResult").show();$("#labelSelAreaResult").show();
	$("#divSelPuestoResult").show();$("#labelSelPuestoResult").show();
	if(divisionId==0){
		$("#divSelAreaResult").hide();$("#labelSelAreaResult").hide();
		$("#divSelPuestoResult").hide();$("#labelSelPuestoResult").hide();
		$("#wrapResultVigMedica").hide();
	}else{
		listUnidadesVigilancia.forEach(function(val){
			if(val.mdfId==unidadId){
				val.divisiones.forEach(function(val1){
					if(val1.divisionId==divisionId){
						var objTodo=[{areaName:"TODOS",areaId:0 }];
						val1.areas=val1.areas.filter(function(v){
							if(v.areaId==0){return false;}else{return true;}
						})
						val1.areas = objTodo.concat(val1.areas);
						crearSelectOneMenuObligUnitarioCompleto("selAreaVigMedica", "verAcordeAreaVigMedica()", val1.areas, "areaId",
								"areaName","#divSelAreaResult","Areas");
						verAcordeAreaVigMedica();
					}
					
				})
			}
		});
	}
}

function verAcordeAreaVigMedica(){
	var unidadId=parseInt($("#selUnidadVigMedica").val());
	var divisionId=parseInt($("#selDivisionVigMedica").val());
	var areaId=parseInt($("#selAreaVigMedica").val());
	$("#divSelPuestoResult").show();$("#labelSelPuestoResult").show();
	if(areaId==0){
		$("#divSelPuestoResult").hide();$("#labelSelPuestoResult").hide();
		$("#wrapResultVigMedica").hide();
	}else{
		listUnidadesVigilancia.forEach(function(val){
			if(val.mdfId==unidadId){
				val.divisiones.forEach(function(val1){
					if(val1.divisionId==divisionId){
						val1.areas.forEach(function(val2){
							if(val2.areaId==areaId){
								var objTodo=[{positionName:"TODOS",positionId:0 }];
								val2.puestos=val2.puestos.filter(function(v){
									if(v.positionId==0){return false;}else{return true;}
								})
								val2.puestos = objTodo.concat(val2.puestos);
								crearSelectOneMenuObligUnitarioCompleto("selPuestoVigMedica", "verAcordePuestoVigMedica()", val2.puestos, "positionId",
										"positionName","#divSelPuestoResult","Puestos");
								verAcordePuestoVigMedica();
							}
						})
					}
					
				})
			}
		})
	}
}

function verAcordePuestoVigMedica(){
	$("#wrapResultVigMedica").hide();
}


function verResultadosVigilanciaMedicaTrabajadores(){
	var dataParam = {
			empresaId : getSession("gestopcompanyid"),
			unidadId:(parseInt($("#selUnidadVigMedica").val())>0?parseInt($("#selUnidadVigMedica").val()):null),
			divisionId:(parseInt($("#selDivisionVigMedica").val())>0?parseInt($("#selDivisionVigMedica").val()):null),
			areaId:(parseInt($("#selAreaVigMedica").val())>0?parseInt($("#selAreaVigMedica").val()):null),
			puestoId:(parseInt($("#selPuestoVigMedica").val())>0?parseInt($("#selPuestoVigMedica").val()):null),
			
		};
	$("#wrapResultVigMedica").show();
		callAjaxPost(URL + '/examenmedico/programacion/evaluacion/hallazgos/resumen', dataParam, function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
				listTrabajadoresVigilanciaMedica=data.trabajadores;
				$("#tblResultVigMedico tbody").html("");
				
				listTrabajadoresVigilanciaMedica.forEach(function(val){
					$("#tblResultVigMedico tbody")
					.append("<tr id='vigres"+val.trabajadorId+"'><td>"+val.nombre+"</td></tr>");
					val.resultadosCategorias=listCategoriaVigilanciaMedica;
					var estado="Sin examenes";
					var fecha="";var fechaReal="";
					var evaluacion="";
					if(val.ultimoExamen.id==null){
						estado="Sin examenes"
					}else if(val.ultimoExamen.isVigente==0){
						if(val.ultimoExamen.resultadoNombre==null){
							val.ultimoExamen.resultadoNombre="--";
						}
						estado="Examen vencido";
						fecha=val.ultimoExamen.fechaVigenciaTexto;
						fechaReal=val.ultimoExamen.fechaFinTexto;
						evaluacion=val.ultimoExamen.resultadoNombre;
					}else  {
						if(val.ultimoExamen.resultadoNombre==null){
							val.ultimoExamen.resultadoNombre="--";
						}
						estado="Examen vigente";
						fecha=val.ultimoExamen.fechaVigenciaTexto;
						fechaReal=val.ultimoExamen.fechaFinTexto;
						evaluacion=val.ultimoExamen.resultadoNombre;
					}
					$("#vigres"+val.trabajadorId).append(
							"<td>"+estado+"</td>" +
							"<td>"+fechaReal+"</td>"+
							"<td>"+fecha+"</td>"+
							"<td>"+evaluacion+"</td>");
					
					val.resultadosCategorias.forEach(function(val1){
						val1.resultado="Sin examenes";
						if(val.ultimoExamen.id==null){
							val1.resultado="--";
						}else if(val.ultimoExamen.tipoNotaTrabId==null){
							val1.resultado=iconoGosst.por_evaluar+"Sin evaluar";
						}else if(val.ultimoExamen.isVigente==0){
							val1.resultado=iconoGosst.advertir+" Examen no vigente   ";
						}else if(val.ultimoExamen.tipoNotaTrabId==1 || true){
							val1.resultado=iconoGosst.aprobado+"Sin observaciones";
							val.ultimoExamen.hallazgos.every(function(val2){
								if(val2.categoria.id==val1.id){
									var textOtro="";
									if(val2.hasOtroHallazgo==0){
										textOtro="<br>"+iconoGosst.aprobado+" Levantado"
									}
									val1.resultado=iconoGosst.desaprobado+"Con observaciones"+textOtro;
									return false;
								}else{
									val1.resultado=iconoGosst.aprobado+"Sin observaciones";
									return true;
								}
							});
						}
						
						$("#vigres"+val.trabajadorId).append("<td>"+val1.resultado+"</td>");
						
					});
					
					
				});

				break;
			default:
				alert("Ocurrió un error al traer las vigilancias!");
			}
		})
	
}










