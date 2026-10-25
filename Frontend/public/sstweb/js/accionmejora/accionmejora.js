var accionMejoraId;var accionMejoraObj;
var banderaEdicionCorr;
var accionEstado;
var accionEstadoNombre;var listFullAcciones;
var mensajeUx;

function cargarModalAccionMejora() {
   banderaEdicionCorr = false;

   $("#btnCancelarCorr").hide();$("#btnNuevaCorr").show();
   $("#btnGuardarCorr").hide();$("#btnEliminarCorr").hide();

   $("#btnNuevaCorr").attr("onclick", "javascript:nuevaAccionMejora();");
   $("#btnCancelarCorr").attr("onclick", "javascript:cancelarAccionMejora();");
   $("#btnGuardarCorr").attr("onclick", "javascript:guardarAccionMejora();");
   $("#btnEliminarCorr").attr("onclick", "javascript:eliminarAccionMejora();");

   var dataParam={
      accionMejoraTipoId: accionMejoraTipoIdActual,
      gestionAccionMejoraId: gestionAccionMejoraId
   };
	
   callAjaxPost(URL+'/gestionaccionmejora/accionmejora',dataParam,
      procesarDataListadoAccionMejora);
}

var listClasificacionAcciones = [];

function procesarDataListadoAccionMejora(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;accionMejoraObj={id:0};
            listFullAcciones=list;
            listClasificacionAcciones=data.clasificacion;
            
		$("#tblCorr tbody tr").remove();

		var nro = 0;
		list.forEach(function(val,index){
			nro++;
			
			$("#tblCorr tbody").append(
					          "<tr id='tr" + val.accionMejoraId
							+ "' onclick='javascript:editarAccionMejora("
							+index+")' >"

							+ "<td id='tddesc" + val.accionMejoraId
							+ "'>" + val.descripcion + "</td>"
							
							+ "<td id='tdclaacc" + val.accionMejoraId
							+ "'>" + val.clasificacion.nombre+ "</td>"
							
							+ "<td id='tdtipoa"+ val.accionMejoraId + "'>"
						        + val.tipoAccionNombre+ "</td>"
							
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

function editarAccionMejora(pindex) {
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
				.html("<input type='text' id='inputRespNom' class='form-control' placeholder='Ingresar nombre y seleccionar'  >" +
						"<div id='divAutoCompletarTrabAccMejora'></div>");
		verAutoCompletarTrabAccMejora(accionMejoraObj.trabajadorResponsableId);
		$("#tdhorapla" + accionMejoraId)
				.html("<input type='time' id='inputHora' class='form-control' value='"
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
			
		if(accionMejoraTipoIdActual != 1){
			var selTipoAcc = crearSelectOneMenu("selTipoAcc", "", listTipoAccionMejoraDepurado, ptipoAccionId,
					"tipoAccionId", "tipoAccionNombre");
			$("#tdtipoa" + accionMejoraId).html(selTipoAcc);			
		}
		// ********************************************************************************
		
		
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
		 
		$("#btnCancelarCorr").show();
		$("#btnNuevaCorr").hide();
		$("#btnGuardarCorr").show();
		$("#btnEliminarCorr").show();
	}
}

function nuevaAccionMejora(){
   if(!banderaEdicionCorr){
      var selEstado = crearSelectOneMenu("selEstadoCorr","",
	 listEstado,"-1","estadoCumpId","estadoCumplientoNombre");
		
      var selTipoAcc = "Inmediata";
		
      if(accionMejoraTipoIdActual != 1){
	 selTipoAcc = crearSelectOneMenu("selTipoAcc","",listTipoAccionMejoraDepurado,
            accionMejoraTipoIdActual,"tipoAccionId","tipoAccionNombre");	
      }
		
      var slcTipoSoli = crearSelectOneMenuOblig("slcTipoSoli","",
	 listSolicitud,"-1","id","nombre");

      var selClasifAccion = crearSelectOneMenu("selClasifAccion","",
         listClasificacionAcciones,"","id","nombre");
		
      accionMejoraId = 0;
		
      $("#tblCorr tbody").append(
         "<tr id='0'>" + 
            "<td><textarea type='text' id='inputDesc' class='form-control' " +
                          "placeholder='Resumen' rows='2'/></td>" +
	    "<td>"+selClasifAccion+"</td>" +
	    "<td>"+selTipoAcc+"</td>" +
	    "<td><input type='text' id='inputRespNom' class='form-control' " +
	               "placeholder='Ingresar nombre y seleccionar'>" +
		"<div id='divAutoCompletarTrabAccMejora'></div></td>" +
	    "<td><input type='text' id='inputRespMail' class='form-control' placeholder='Correo'></td>" +
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
		
      verAutoCompletarTrabAccMejora(gestionAccionMejoraObj.responsableId);
		
      var optionEvidencia={
	 isImagen: false,
	 container: "#tdevi"+accionMejoraId,
	 idAux: "AccMej",
	 esNuevo: true,
	 evidenciaNombre: "",
	 functionCall: function(){},
	 descargaUrl: "",
      };
		
      crearFormEvidenciaCompleta(optionEvidencia);
	 
      $("#btnCancelarCorr").show();$("#btnNuevaCorr").hide();
      $("#btnGuardarCorr").show();$("#btnEliminarCorr").hide();
		
      banderaEdicionCorr = true;
   }else{
      alert("Guarde primero.");
   }  
}

var listTrabajadorAccMejora = [];
function verAutoCompletarTrabAccMejora(trabajadorIdAux){
	var nombre = $("#inputRespNom").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
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
		listTrabajadorAccMejora= data.trabajadores;
		listTrabajadorAccMejora.forEach(function(val){
		    val.selected = 0;
		    if(val.trabajadorId == accionMejoraObj.trabajadorResponsableId){
			val.selected = 1;
		    }
		});
		crearSelectOneMenuObligUnitarioCompleto("selTrabajadorAccMejora", 
				"verCorreoAcordeTrabajadorAccMejora()", data.trabajadores, "trabajadorId","nombre",
				"#divAutoCompletarTrabAccMejora","");
		verCorreoAcordeTrabajadorAccMejora();
		$("#inputRespNom")
		.attr("onkeyup","verAutoCompletarTrabAccMejora()");
	});
}
function verCorreoAcordeTrabajadorAccMejora(){
    var trabId = parseInt($("#selTrabajadorAccMejora").val());
    listTrabajadorAccMejora.forEach(function(val){
	if(val.trabajadorId == trabId){
	    $("#inputRespMail").val(val.correo);
	}
    });
}
function cancelarAccionMejora() {
	cargarModalAccionMejora();
}

function eliminarAccionMejora() {
	var r = confirm("¿Está seguro de eliminar la Acción mejora?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : accionMejoraId
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, procesarResultadoEliminarAccionMejora);
	}
}

function procesarResultadoEliminarAccionMejora(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		cargarModalAccionMejora();
		break;
	default:
		alert("Ocurrió un error al eliminar la Acción de mejora!");
	}
}

function guardarAccionMejora(){
   var campoVacio = true;
   
   var inversionAcc = $("#inputInversion").val();
   var selTipoAcc = parseInt($("#selTipoAcc option:selected").val()); //Ahora lo trabajamos como integer
   var inputDesc = $("#inputDesc").val();
   var inputRespNom = $("#inputRespNom").val();
   var inputRespMail = $("#inputRespMail").val();
   var horaPlanificada = $("#inputHora").val();
    
   if(!$("#inputHora").val()){
      horaPlanificada = null;
   }
 
   var inputFecha = convertirFechaTexto($("#inputFec").val());
   var inputFechaReal = convertirFechaTexto($("#inputFecReal").val());
	 
   hallarEstadoImplementacion(accionMejoraId);
	
   if(inputDesc.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe ingresar la descripción.</label>";
      $("#inputDesc").focus();
   }
	
   var observacion = $("#inputObservacionAcc").val();
   var clasificacionId = $("#selClasifAccion").val();
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
	 trabajadorResponsableId: $("#selTrabajadorAccMejora").val(),     
	 responsableNombre: inputRespNom,responsableMail: inputRespMail,
	 fechaRevision: inputFecha,horaPlanificada: horaPlanificada,
	 fechaReal: inputFechaReal,accionMejoraTipoId: selTipoAcc, /*antes accionMejoraTipoIdActual*/
	 estadoId: accionEstado,inversionAccion: inversionAcc,
	 companyId: getSession("gestopcompanyid"),
	 gestionAccionMejoraId: gestionAccionMejoraId
      };
		 
      callAjaxPost(URL+'/gestionaccionmejora/accionmejora/save',dataParam,
         procesarResultadoGuardarAccionMejora);
   }else{
      $("#mdCorr").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposAccionInmVistaAdm");

      $("#modalMensajeUxAvisoCompletarCamposAccionInmVistaAdm").on("hidden.bs.modal",function(){
         $("#mdCorr").modal("show");
      });
   }
}

function procesarResultadoGuardarAccionMejora(data) {
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevoId,"fileEviAccMej",bitsMega*10,
         "/gestionaccionmejora/accionmejora/evidencia/save",function(){
	    cargarModalAccionMejora();
	 },"accionMejoraId");
		
         if(accionMejoraTipoIdActual != 1){
	    accionMejoraTipoIdActual = -1;
         }
		
         cargarModalAccionMejora();
		
         break;
	
      default:
	 alert("Ocurrió un error al guardar la Accion de mejora!");
   }
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