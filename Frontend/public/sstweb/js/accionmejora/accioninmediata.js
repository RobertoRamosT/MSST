var accionMejoraId;var accionMejoraObj;
var banderaEdicionCorr;
var accionEstado;
var accionEstadoNombre;var listFullAcciones;
var mensajeUx;

$(function(){
   resizeDivWrapper("wrapCorrInmediata",200);
   resizeDivWrapper("wrapCorr",200);
});
function cargarModalAccionInmediata() {
	banderaEdicionCorr = false;
	$("#btnCancelarCorrInmediata").hide();
	$("#btnNuevaCorrInmediata").show();
	$("#btnGuardarCorrInmediata").hide();
	$("#btnEliminarCorrInmediata").hide();

	$("#btnNuevaCorrInmediata").attr("onclick", "javascript:nuevaAccionInmediata();");
	$("#btnCancelarCorrInmediata").attr("onclick", "javascript:cancelarAccionInmediata();");
	$("#btnGuardarCorrInmediata").attr("onclick", "javascript:guardarAccionInmediata();");
	$("#btnEliminarCorrInmediata").attr("onclick", "javascript:eliminarAccionInmediata();");

	var dataParam = {
		accionMejoraTipoId : accionMejoraTipoIdActual,
		gestionAccionMejoraId : gestionAccionMejoraId
	};

	callAjaxPost(URL + '/gestionaccionmejora/accionmejora', dataParam,
			procesarDataListadoAccionInmediata);
}
var listClasificacionAcciones = [];

function procesarDataListadoAccionInmediata(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;accionMejoraObj={id:0};
            listFullAcciones=list;
            listClasificacionAcciones=data.clasificacion;
            
		$("#tblCorrInmediata tbody tr").remove();

		var nro = 0;
		list.forEach(function(val,index){
			nro++;
			
			$("#tblCorrInmediata tbody").append(
					          "<tr id='tr" + val.accionMejoraId
							+ "' onclick='javascript:editarAccionInmediata("
							+index+")' >"

							+ "<td id='tddesc" + val.accionMejoraId
							+ "'>" + val.descripcion + "</td>"
							
							+ "<td id='tdclaacc" + val.accionMejoraId
							+ "'>" + val.clasificacion.nombre+ "</td>"
							
							+ "<td id='tdrespnom" + val.accionMejoraId
							+ "'>" + val.responsableNombre + "</td>"

							+ "<td id='tdrespmail" + val.accionMejoraId
							+ "'>" + val.responsableMail + "</td>"

							+ "<td id='tdfec" + val.accionMejoraId
							+ "'>" + val.fechaRevisionTexto + "</td>"
							+ "<td id='tdhorapla" + val.accionMejoraId
							+ "'>" + val.horaPlanificadaTexto + "</td>"
							
							+ "<td id='tdfecreal" + val.accionMejoraId
							+ "'>" + val.fechaRealTexto + "</td>"
							+ "<td id='tdinversion" + val.accionMejoraId
							+ "'>" + val.inversionAccion + "</td>"
							+ "<td id='tdpel" + val.accionMejoraId
							+ "'>" + val.peligrosAsociados + "</td>"
							+ "<td id='tdcontrol" + val.accionMejoraId
							+ "'>" + val.controlesRealizados+" / "+val.controlesPlanificados + "</td>"
							+ "<td id='estadoAccion" + val.accionMejoraId
							+ "'>" + val.estadoCumplimientoNombre
							+ "</td>"
							+ "<td id='tdobsacc" + val.accionMejoraId
							+ "'>"+ val.observacion+"</td>"
							+ "<td id='tdevi" + val.accionMejoraId
							+ "'>"+ val.evidenciaNombre+"</td>"

							+ "</tr>");
		});
		
		
			 if(getSession("linkCalendarioSubAccMejoraId")!=null){
					listFullAcciones.every(function(val,index3){
						if(val.accionMejoraId==parseInt(getSession("linkCalendarioSubAccMejoraId"))){
							editarAccionMejora(index3);
							if(getSession("linkCalendarioControlId")!=null){
								verControlesAsociados();
							}
							
							sessionStorage.removeItem("linkCalendarioSubAccMejoraId");
							return false;
						}else{
							return true;
						}
					});
				}
		break;
	default:
		alert("Ocurrió un error al traer las acciones de mejora!");
	}
}

var name2;

function editarAccionInmediata(pindex) {
	accionMejoraObj=listFullAcciones[pindex];
	var pfechaReal=accionMejoraObj.fechaReal;
	var pestadoCumpId=accionMejoraObj.estadoId;
	var ptipoAccionId=accionMejoraObj.tipoAccionId;
	var pinversion=accionMejoraObj.inversionAccion;
	
	if (!banderaEdicionCorr) {
		accionMejoraId = accionMejoraObj.accionMejoraId ;
		var inversionAcc=parseFloat($("#tdinversion"+accionMejoraId).text());
		var peligroRelacionado=$("#tdpel"+accionMejoraId).text();
		var controlRelacionado=$("#tdcontrol"+accionMejoraId).text();
		var horaPlanificada=accionMejoraObj.horaPlanificada;
		$("#tdpel"+accionMejoraId).html(
				"<a onclick='verPeligrosAsoiados()'>"+peligroRelacionado+"</a>");
		$("#tdcontrol"+accionMejoraId).html(
				"<a onclick='verControlesAsociados()'>"+controlRelacionado+"</a>");
		$("#tdinversion"+accionMejoraId).html(
				"<label for='inputInversion'>S/</label><input type='number' id='inputInversion' name='inputInversion'" +
				"class='form-control' value='"+inversionAcc+"'>");
		var name = $("#tddesc" + accionMejoraId).text();
		$("#tddesc" + accionMejoraId)
				.html(
						"<textarea type='text' id='inputDesc' class='form-control' placeholder='Resumen' rows='2'>"
								+ name + "</textarea>");

		var name1 = $("#tdrespnom" + accionMejoraId).text();
		$("#tdrespnom" + accionMejoraId)
				.html("<input type='text' id='inputRespNom'  placeholder='Ingresar nombre y seleccionar' class='form-control '>" +
						"<div id='divAutoCompletarTrabAccInmediata'></div>");
		verAutoCompletarTrabAccInmediata(accionMejoraObj.trabajadorResponsableId);
		$("#tdhorapla" + accionMejoraId)
				.html(
						"<input type='time' id='inputHora' class='form-control' value='"
								+ horaPlanificada + "'>");
		
		 name2 = $("#tdrespmail" + accionMejoraId).text();
		$("#tdrespmail" + accionMejoraId)
				.html(
						"<input type='text' id='inputRespMail' class='form-control' value='"
								+ name2 + "'>");
		   //
		$("#tdobsacc" + accionMejoraId)
		.html("<input type='text' id='inputObservacionAcc' class='form-control'  >");
		$("#inputObservacionAcc").val(accionMejoraObj.observacion);
		//
		var optionEvidencia={
			     isImagen: false,
			     container: "#tdevi"+accionMejoraId,
				 idAux: "AccMej",
				 esNuevo: false,
				 functionCall: function(){},
				 evidenciaNombre: accionMejoraObj.evidenciaNombre,
				 descargaUrl: "/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+accionMejoraId+"",
			}
			
		crearFormEvidenciaCompleta(optionEvidencia);
		 
		//
		var selClasifAccion = crearSelectOneMenu("selClasifAccion", "", listClasificacionAcciones, accionMejoraObj.clasificacion.id,
				"id", "nombre");
		$("#tdclaacc" + accionMejoraId).html(selClasifAccion);
		//
		$("#tdfec" + accionMejoraId).html(
				"<input type='date' id='inputFec' class='form-control' onchange='hallarEstadoImplementacion("+accionMejoraId+")'>");
		var myDate = convertirFechaInput(accionMejoraObj.fechaRevision );
		$("#inputFec").val(myDate);
		
		
		$("#tdfecreal" + accionMejoraId).html(
				"<input type='date' id='inputFecReal' class='form-control' onchange='hallarEstadoImplementacion("+accionMejoraId+")'>");
		var myDateReal = convertirFechaInput(accionMejoraObj.fechaReal );
		$("#inputFecReal").val(myDateReal);
		
	
		hallarEstadoImplementacion(accionMejoraId);
		banderaEdicionCorr = true;
		
		$("#btnCancelarCorrInmediata").show();
		$("#btnNuevaCorrInmediata").hide();
		$("#btnGuardarCorrInmediata").show();
		$("#btnEliminarCorrInmediata").show();
	}
}

function nuevaAccionInmediata(){
   if(!banderaEdicionCorr){
      var selEstado = crearSelectOneMenu("selEstadoCorr","",
	 listEstado,"-1","estadoCumpId","estadoCumplientoNombre");
      
      var selTipoAcc = "Inmediata";
		
      if(accionMejoraTipoIdActual != 1){
         selTipoAcc = crearSelectOneMenu("selTipoAcc","",listTipoAccionMejoraDepurado,
            accionMejoraTipoIdActual,"tipoAccionId","tipoAccionNombre");	
      }
		
      var selClasifAccion = crearSelectOneMenu("selClasifAccion","",
	 listClasificacionAcciones,"","id","nombre");
		
      accionMejoraId = 0;
		
      $("#tblCorrInmediata tbody").append(
         "<tr id='0'>" +
//	    "<td>"+selTipoAcc+"</td>" +
	    "<td><textarea type='text' id='inputDesc' class='form-control' " +
	                  "placeholder='Resumen' rows='2'/>"+"</td>" +
	    "<td>"+selClasifAccion+"</td>" +
	    "<td><input type='text' id='inputRespNom' class='form-control' " +
	               "placeholder='Ingresar nombre y seleccionar'>" +
		"<div id='divAutoCompletarTrabAccInmediata'></div></td>" +
	    "<td><input type='text' id='inputRespMail' class='form-control' " +
	               "placeholder='Correo'></td>" +
	    "<td><input type='date' id='inputFec' class='form-control' " +
		       "onchange='hallarEstadoImplementacion("+accionMejoraId+")'></td>" +
	    "<td><input type='time' value='12:00:00' id='inputHora' " +
		       "class='form-control'></td>" +
	    "<td><input type='date' id='inputFecReal' class='form-control' " +
	               "onchange='hallarEstadoImplementacion("+accionMejoraId+")'></td>" +
	    "<td><label for='inputInversion'>S/</label>" +
	        "<input class='form-control' type='number' id='inputInversion' " +
	               "name='inputInversion' class='form-control'></td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td id='estadoAccion0'></td>" +
	    "<td><input type='text' id='inputObservacionAcc' class='form-control'></td>" +
	    "<td id='tdevi0'></td>" +
	 "</tr>");

      verAutoCompletarTrabAccInmediata(gestionAccionMejoraObj.responsableId);
		
      var optionEvidencia={
	 isImagen: false,
	 container: "#tdevi"+accionMejoraId,
	 idAux: "AccMej",
	 esNuevo: true,
	 functionCall: function(){},
	 evidenciaNombre: "",
	 descargaUrl: "",
      };
			
      crearFormEvidenciaCompleta(optionEvidencia);
		
      $("#btnCancelarCorrInmediata").show();
      $("#btnNuevaCorrInmediata").hide();
      $("#btnGuardarCorrInmediata").show();
      $("#btnEliminarCorrInmediata").hide();
      banderaEdicionCorr = true;
   }else{
      alert("Guarde primero.");
   }
}

var listTrabajadorAccInmediata = [];

function verAutoCompletarTrabAccInmediata(trabajadorIdAux){
	var nombre = $("#inputRespNom").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorId : trabajadorIdAux,
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")};
	if(trabajadorIdAux != null){
	    dataParam = {
		    empresaId : getSession("gestopcompanyid"),
		    trabajadorId : trabajadorIdAux
	    }
	}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
			})
		}else if(trabajadorIdAux != null){
		    $("#inputRespNom").val(data.trabajadores[0].trabajadorNombre);
		}
		listTrabajadorAccInmediata= data.trabajadores;
		
		listTrabajadorAccInmediata.forEach(function(val){
		    val.selected = 0;
		    if(val.trabajadorId == accionMejoraObj.trabajadorResponsableId){
			val.selected = 1;
		    }
		});
		crearSelectOneMenuObligUnitarioCompleto("selTrabajadorAccInmediata", 
				"verCorreoAcordeTrabajadorAccInmediata()", data.trabajadores, "trabajadorId","nombre",
				"#divAutoCompletarTrabAccInmediata","");
		verCorreoAcordeTrabajadorAccInmediata();
		$("#inputRespNom")
		.attr("onkeyup","verAutoCompletarTrabAccInmediata()");
	});
}
function verCorreoAcordeTrabajadorAccInmediata(){
    var trabId = parseInt($("#selTrabajadorAccInmediata").val());
    listTrabajadorAccInmediata.forEach(function(val){
	if(val.trabajadorId == trabId){
	    $("#inputRespMail").val(val.correo);
	}
    });
}
function cancelarAccionInmediata() {
	cargarModalAccionInmediata();
}

function eliminarAccionInmediata() {
	var r = confirm("¿Está seguro de eliminar la Acción inmediata?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : accionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, procesarResultadoEliminarAccionInmediata);
	}
}

function procesarResultadoEliminarAccionInmediata(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarModalAccionInmediata();
		break;
	default:
		alert("Ocurrió un error al eliminar la Acción inmediata!");
	}
}

function guardarAccionInmediata(){
   var campoVacio = true;
	
   var inversionAcc=$("#inputInversion").val();
   var inputDesc = $("#inputDesc").val();
   var inputRespNom = $("#inputRespNom").val();
   var inputRespMail = $("#inputRespMail").val();
       
   var horaPlanificada = $("#inputHora").val();
        
   if(!$("#inputHora").val()){
      horaPlanificada = null;
   }

   var inputFecha = convertirFechaTexto($("#inputFec").val());
   var inputFechaReal = convertirFechaTexto($("#inputFecReal").val());
   var accionTipoId = 1;
	
   hallarEstadoImplementacion(accionMejoraId);
	
   if(inputDesc.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe ingresar la descripción.</label>";
      $("#inputDesc").focus();
   }
	
   var clasificacionId = $("#selClasifAccion").val();
   var observacion = $("#inputObservacionAcc").val();
   var evidenciaNombre = $("#inputEviAccMej").val();

   if(inputFechaReal != null && evidenciaNombre.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe subir la evidencia porque ingresó la " +
      		  "Fecha realizada.</label>";
      $("#inputEviAccMej").focus();
   }
	
   if(campoVacio){
      var dataParam={
	 accionMejoraId: accionMejoraId,observacion: observacion,
         clasificacion: {id: clasificacionId},descripcion: inputDesc,
         trabajadorResponsableId: $("#selTrabajadorAccInmediata").val(),
	 responsableNombre: inputRespNom,responsableMail: inputRespMail,
	 fechaRevision: inputFecha,horaPlanificada: horaPlanificada,
	 fechaReal: inputFechaReal,accionMejoraTipoId: accionTipoId, //= a 1
	 estadoId: accionEstado,inversionAccion: inversionAcc,
	 companyId: getSession("gestopcompanyid"),
         gestionAccionMejoraId: gestionAccionMejoraId
      };
		 
      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,
         procesarResultadoGuardarAccionInmediata);
   }else{
      $("#mdCorrInmediata").modal("hide");
      
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposAccionInmVistaAdm");

      $("#modalMensajeUxAvisoCompletarCamposAccionInmVistaAdm").on("hidden.bs.modal",function(){
         $("#mdCorrInmediata").modal("show");
      });
   }
}

function procesarResultadoGuardarAccionInmediata(data){
   switch(data.CODE_RESPONSE){
      case "05":
	 guardarEvidenciaAuto(data.nuevoId,"fileEviAccMej",bitsMega*10,
	 "/gestionaccionmejora/accionmejora/evidencia/save",function(){
	    cargarModalAccionInmediata();
	 },"accionMejoraId");
		
		
	 if(accionMejoraTipoIdActual != 1){
	    accionMejoraTipoIdActual = -1;
	 }
		
	 cargarModalAccionInmediata();
	
	 break;
	
      default:
	 alert("Ocurrió un error al guardar la Accion inmediata!");
   }
}
/*
function cargarEvidenciaInmediata() {
	$("#modalAccInmediata").hide();
	$("#modalAccInmediataUpload").show();
}

function cancelarAccInmediataUploadEvidencia() {
	$("#modalAccInmediata").show();
	$("#modalAccInmediataUpload").hide();
}

function uploadAccInmediataEvidencia() {
	$.blockUI({message:'Cargando...'});
	guardarEvidenciaAuto(accionMejoraId,"fileAccEvi",bitsEvidenciaAccionMejora,'/gestionaccionmejora/accionmejora/evidencia/save',function(){
		$.unblockUI();
		$("#modalAccInmediata").show();
		$("#modalAccInmediataUpload").hide();
	},"accionMejoraId"); 
}
*/

function llenarCorreoAutoTrab(){
	

	
	
	
}
function hallarEstadoImplementacion(accionId){
	var fechaPlanificada=$("#inputFec").val();
	var fechaReal=$("#inputFecReal").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		accionEstado=2;
		accionEstadoNombre="COMPLETADO";
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				accionEstado=3;
				accionEstadoNombre="RETRASADO";
			}else{
				accionEstado=1;
				accionEstadoNombre="EN PROCESO";
			}
			
		}else{
			
			accionEstado=1;
			accionEstadoNombre="EN PROCESO";
			
		}
	}
	
	$("#estadoAccion"+accionId).html(accionEstadoNombre);
	
}


function comprobarEstadoGestion(estadoAccion){
	


}
