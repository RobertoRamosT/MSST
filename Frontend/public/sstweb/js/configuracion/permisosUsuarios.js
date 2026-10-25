var banderaEdicion;
var listFullPerfiles;
var listFullSubUsuarios;
var perfilId;
var subUsuarioId;var subUsuarioObj={};
var listAcceso=[];var listEmpresasSubUsuario=[],listTrabajadoresSubUsuario=[];

var mensajeUx;

$(document).ready(function() {
	
	llamarPefiles();
	// llamarSubUsuarios();
	llamarModulos();
	$("thead th").addClass("tb-acc");
	$("thead td").addClass("tb-acc");
	
$("#btnNuevoPerfil").attr("onclick","nuevoPerfil()");
////////////autor: (AntoniTito3)  Tema:  Reporte en excel de Terminos y condiciones.
$("#fsBotones1")
.append("<button id='btnReportExcel' type='button' "
  + " class='btn btn-success btn-excel'" 
  +	" title='Exportar indicadores de trabajadores, contratistas, visitantes - quienes aceptaron los terminos y condiciones" +
  		
  		" para el procesamiento de sus datos personales '>"
	+"<i class='fa fa-file-excel-o fa-2x'></i></button>");


$("#btnReportExcel").on("click",function(){
	window.open(URL
			+ "/perfil/reporte/excel?idCompany="	+ getSession("gestopcompanyid") + '&nada=_blank');	
});
////////////Fin3 Reporte en excel de Terminos y condiciones.

	$("#btnVolverPerfil").attr("onclick","llamarPefiles()");
	$("#btnGuardarPerfil").attr("onclick","guardarPerfil()");
	

	$("#btnVolverSubUsuario").attr("onclick","llamarSubUsuarios()");
	$("#btnGuardarSubUsuario").attr("onclick","guardarSubUsuario()");
	
});
function llamarModulos(){
	var dataObj={perfilId:getSession("perfilGosstId") };
	callAjaxPost(URL + '/perfil/modulos', dataObj,
			procesarResultadoModulosASWAN);
	
}
function procesarResultadoModulosASWAN(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
		$("#tableModulos tbody tr").remove();

		for (var index = 0; index < list.length; index++) {

			$("#tableModulos tbody").append(
					
			"<tr><td>"+list[index].moduloNombre+"</td><td>" 
			+"<input type='checkbox' id='checkModulo"+list[index].moduloId+"' " 
			+"onchange='marcarModuloPerfil("+list[index].moduloId+")'>"+
			"</td>" +
			"<td>" +"<input type='checkbox' id='checkModEditar"+list[index].moduloId+"' " 
			+">"+
			"</td>" +
			"<td>" +"<input type='checkbox' id='checkModEliminar"+list[index].moduloId+"' " 
			+">"+
			"</td>      </tr>"
			)
		}
		formatoCeldaSombreableTabla(true,"subUsuariosTable");
		
		break;
	default:
		alert("Ocurrió un error al traer los subusuarios!");
	}
	
}

function llamarSubUsuarios(){
   subUsuarioId = 0;banderaEdicion = false;subUsuarioObj = {};
   
   $("#btnVolverSubUsuario").hide();$("#btnGuardarSubUsuario").hide();	
   $("#btnConfiguracionSubUsuario").show();$("#empresasSubUsuario").hide();

   callAjaxPost(URL+'/subusuario',"",procesarLlamadaSubUsuarios);
}

function procesarLlamadaSubUsuarios(data){
    switch(data.CODE_RESPONSE){
        case "05":
	        listFullSubUsuarios = data.list;listAcceso = data.accesos;listEmpresasSubUsuario = data.empresasTotal;
	 		listTrabajadoresSubUsuario = data.trabajadoresTotal;
		
	 		$("#subUsuariosTable tbody tr").remove();

	 		listFullSubUsuarios.forEach(function(val,index){
            	$("#subUsuariosTable tbody:first").append(
               		"<tr id='tr"+val.userId+"' onclick='javascript:editarSubUsuario("+index+")'>" +
						"<td id='tdacceso"+val.userId+"'>"+val.tipoAcceso.nombre+"</td>" +
						"<td id='tdnombre"+val.userId+"'>"+val.userName+"</td>" +
		  				"<td id='tdperfil"+val.userId+"'>"+val.perfilDescripcion+"</td>" +
		  				"<td id='tdfirmante"+val.userId+"'>"+(val.isFirmante == 1?"Si":"No")+"</td>" +
		  				"<td id='tdemp"+val.userId+"'>("+val.numEmpresas+") "+val.empresasNombre+"</td>" +
		  				"<td id='tdtrab"+val.userId+"'>("+val.numTrabajadores+") "+val.trabajadoresNombre+"</td>" +
	       			"</tr>");
         	});

	 		formatoCeldaSombreableTabla(true,"subUsuariosTable");
		
	 		break;
	
      	default:
         	alert("Ocurrió un error al traer los subusuarios!");
   	}
}

function editarSubUsuario(pindex){
   if(!banderaEdicion){
      $("#btnVolverSubUsuario").show();$("#btnGuardarSubUsuario").show();
      $("#btnConfiguracionSubUsuario").hide();
	////////////autor: (AntoniTito3)  Tema:  Reporte en excel de Terminos y condiciones.
		$("#btnReportExcel").hide();
		////////////Fin3 Reporte en excel de Terminos y condiciones.

		banderaEdicion=true;
		formatoCeldaSombreable(false);
		subUsuarioObj=listFullSubUsuarios[pindex];
		subUsuarioId=subUsuarioObj.userId;

	   $("#tr"+subUsuarioId).addClass("fila-edicion");

		var usuarioNombre=subUsuarioObj.userName;
		var idPerfilSubUsuario=subUsuarioObj.idPerfil;
	
		$("#tdnombre"+subUsuarioId).html(
		"<input class='form-control' id='nombreSubUsuarioInput' type='text'>"		
		);
		nombrarInput("nombreSubUsuarioInput",usuarioNombre);
		var selTipoPerfil = crearSelectOneMenu("selTipoPerfil", "", listFullPerfiles,
				idPerfilSubUsuario, "perfilId", "perfilNombre");
		var selAcceso= crearSelectOneMenu("selAcceso", "  ", listAcceso,
				subUsuarioObj.accesoUsuarios, "id", "nombre");
		$("#tdperfil" + subUsuarioId).html(selTipoPerfil);
		$("#tdacceso" + subUsuarioId).html(selAcceso);
		
		//
		var empresasId=subUsuarioObj.empresasId.split(",")
		listEmpresasSubUsuario.forEach(function(val){
			val.selected=0;
			empresasId.forEach(function(val1){
				if(parseInt(val1)==val.idCompany){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcAccesoEmpresasSubUsu", "",
				listEmpresasSubUsuario,  "idCompany", "name","#tdemp"+subUsuarioId,"Acceso...");
		//
		var trabajadoresId=subUsuarioObj.trabajadoresId.split(",")
		listTrabajadoresSubUsuario.forEach(function(val){
			val.selected=0;
			trabajadoresId.forEach(function(val1){
				if(parseInt(val1)==val.trabajadorId){
					val.selected=1;
				}
			})
		});	
		//
		var isFirmante=(subUsuarioObj.isFirmante==1);
		$("#tdfirmante"+subUsuarioId).html("<input class='form-control' id='checkFirmante' type='checkbox' >");
		$("#checkFirmante").prop("checked",isFirmante)
		crearSelectOneMenuObligMultipleCompleto("slcAccesoTrabajadorSubUsu", "",
				listTrabajadoresSubUsuario,  "trabajadorId", "nombre","#tdtrab"+subUsuarioId,"Acceso...");
		
	}
}
function guardarSubUsuario(){
	
	var empresasId=[];
	var usuarioNombre=$("#nombreSubUsuarioInput").val();
	var isFirmante=$("#checkFirmante").prop("checked");
	
	var dataParam={
		idPerfil:$("#selTipoPerfil").val(),isFirmante:(isFirmante?1:0),
		userId:subUsuarioId,
			userName:usuarioNombre
			
	};
	
	callAjaxPost(URL + '/administrador/usuario/exists', dataParam,
			procesarExistenciaUsuario);
	
	
}

function  procesarExistenciaUsuario(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var usuarioTaken=data.usuarioTaken;
		if(usuarioTaken){
			alert("El Usuario existe, introduce otro nombre");
			
		}else{
			var empresasId=[],trabajadoresId=[];
			var usuarioNombre=$("#nombreSubUsuarioInput").val();
			var isFirmante=$("#checkFirmante").prop("checked");
			var empresas=$("#slcAccesoEmpresasSubUsu").val();
			empresas.forEach(function(val,index){
				empresasId.push({empresaId:val});
			});
			var trabajadores=$("#slcAccesoTrabajadorSubUsu").val();
			trabajadores.forEach(function(val,index){
				trabajadoresId.push({trabajadorId:val});
			});
			var dataParam={
					idPerfil:$("#selTipoPerfil").val(),
					userId:subUsuarioId,isFirmante:(isFirmante?1:0),
						userName:usuarioNombre,
						empresas:empresasId,trabajadores:trabajadoresId,
						accesoUsuarios:$("#selAcceso").val()
						
				};

			callAjaxPost(URL + '/subusuario/save', dataParam,
					procesarResultadoGuardarSubUsuario);
		}
		break;
	default:
		alert("Ocurrió un error al guardar la capacitacion!");
	}
	
}


function procesarResultadoGuardarSubUsuario(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		llamarSubUsuarios();
		break;
	default:
		alert("Ocurrió un error al guardar el acto inseguro!");
	}
}

//// Gestio´pon d e Perfiles
function llamarPefiles(){
	perfilId=0;
	banderaEdicion=false;
	$("#btnVolverPerfil").hide();
	$("#btnGuardarPerfil").hide();
	$("#btnNuevoPerfil").show();
////////////autor: (AntoniTito3)  Tema:  Reporte en excel de Terminos y condiciones.
	$("#btnReportExcel").show();
////////////Fin3 Reporte en excel de Terminos y condiciones.
	
	$("#modulosPefil").hide();

	callAjaxPost(URL + '/perfil', "",
			procesarLlamadaPerfiles);
	
}

function procesarLlamadaPerfiles(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var list = data.list;
	listFullPerfiles=list;
		$("#perfilesTable tbody tr").remove();

		for (index = 0; index < list.length; index++) {

			$("#perfilesTable tbody:first").append(

					"<tr id='tr" + list[index].perfilId
							+ "' onclick='javascript:editarPerfil("
							+ list[index].perfilId +","+index
							+ ")' >"

							+ "<td id='tdnombre" + list[index].perfilId
							+ "'>" + list[index].perfilNombre + "</td>"
							
							+ "<td id='tdmods" + list[index].perfilId
							+ "'>" + list[index].nombreModulosFull + " </td>"

							+ "</tr>");
		}
		formatoCeldaSombreable(true);
		
		break;
	default:
		alert("Ocurrió un error al traer las actos inseguros!");
	}

}

function nuevoPerfil(){
	if(!banderaEdicion){
		if(listFullSubUsuarios.length>listFullPerfiles.length){
			$("#btnVolverPerfil").show();
			$("#btnGuardarPerfil").show();
			$("#btnNuevoPerfil").hide();
		////////////autor: (AntoniTito3)  Tema:  Reporte en excel de Terminos y condiciones.
			$("#btnReportExcel").hide();
			////////////Fin3 Reporte en excel de Terminos y condiciones.
			
			
			
			banderaEdicion=true;
			formatoCeldaSombreable(false);

		$("#perfilesTable tbody").append(
			"<tr id='tr0'>"
				+"<td><input type='text' class='form-control' id='nombrePerfilInput'>" +
						"</td>"
				+"<td>..." +
				"</td>"
			
				+"</tr>"	
		);
			
		}else{
			
			alert("Ya no puede crear perfiles")
		}
	
	}
}

function editarPerfil(pperfilId,pindex){
	if(!banderaEdicion){
		$("#btnVolverPerfil").show();
		$("#btnGuardarPerfil").show();
		$("#btnNuevoPerfil").hide();
	////////////autor: (AntoniTito3)  Tema:  Reporte en excel de Terminos y condiciones.
		$("#btnReportExcel").hide();
		////////////Fin3 Reporte en excel de Terminos y condiciones.
		
		banderaEdicion=true;
		formatoCeldaSombreable(false);
			perfilId=pperfilId;
		var perfilNombre=listFullPerfiles[pindex].perfilNombre
		
		
		$("#tdnombre"+pperfilId).html(
		"<input class='form-control' id='nombrePerfilInput'>"		
		);
		nombrarInput("nombrePerfilInput",perfilNombre);
	var numModulos=	$("#tdmods"+pperfilId).text();
		
	$("#tdmods"+pperfilId).html(
			"<a onclick='verModulosPerfil("+pperfilId+")'>Seleccionar "+numModulos+"</a>"	
		);
	
$("#modulosPefil input[type='checkbox']").each(function(){
		$(this).prop("checked",false);
	})
	var dataParam={
			perfilId:perfilId
	}
	callAjaxPost(URL + '/perfil/modulos', dataParam,
			procesarResultadoModulosPerfil);
		
	}
}
function verModulosPerfil(perfilId){
	$("#modulosPefil").show();
	
}
function procesarResultadoModulosPerfil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		var listModulos=data.list;
		if(listModulos.length>0){
		for(var i=0;i<listModulos.length;i++){
			if(listModulos[i]){
			$("#checkModulo"+listModulos[i].moduloId).prop("checked",true);
			var editChecked=pasarNumberBool(listModulos[i].canEdit);
			$("#checkModEditar"+listModulos[i].moduloId).prop("checked",editChecked);
			var deleteChecked=pasarNumberBool(listModulos[i].canDelete);
			$("#checkModEliminar"+listModulos[i].moduloId).prop("checked",deleteChecked)
		}}
		}
		break;
	default:
		alert("Ocurrió un error al guardar el acto inseguro!");
	}
	
}
function guardarPerfil(){
	
	var modulosId=[];
	var perfilNombre=$("#nombrePerfilInput").val();
	if(perfilId>0){
	$("#modulosPefil input[id^='checkModulo']").each(function(){
		
		if($(this).prop('checked')){
			var idcheck=$(this).prop("id");
			var moduloId=parseInt(idcheck.substr(11,14));
			var edit_checked=$("#checkModEditar"+moduloId).prop("checked");
			var eliminate_checked=$("#checkModEliminar"+moduloId).prop("checked");
			var menu_perfil={
					moduloId:moduloId,
					estadoModulo:1,
					canEdit:pasarBoolInt(edit_checked),
					canDelete:pasarBoolInt(eliminate_checked)
			};
			modulosId.push(menu_perfil);
			
		
		}
	})
	

	
	}else{
		modulosId=null;
		
	}
	
	
	console.log(modulosId);
	var dataParam={
			perfilId:perfilId,
			perfilNombre:perfilNombre,
			modulosId:modulosId
			
	};
	callAjaxPost(URL + '/perfil/save', dataParam,
			procesarResultadoGuardarPerfil);
}

function procesarResultadoGuardarPerfil(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		llamarPefiles();
		break;
	default:
		alert("Ocurrió un error al guardar el acto inseguro!");
	}
}
function eliminarPerfil(){
	
	
	
}


function marcarModuloPerfil(id){

	var accesoMarcado=$("#checkModulo"+id).prop("checked");
	
	if(accesoMarcado){
		$("#checkModEditar"+id).prop("checked",true);
		$("#checkModEliminar"+id).prop("checked",true);
		$("#checkModEditar"+id).prop("disabled",false);
		$("#checkModEliminar"+id).prop("disabled",false);
	}else{
		$("#checkModEditar"+id).prop("checked",false);
		$("#checkModEliminar"+id).prop("checked",false);
		$("#checkModEditar"+id).prop("disabled",true);
		$("#checkModEliminar"+id).prop("disabled",true);
	}
	
	
	switch(id){
	case 4:
		var opcionRecursosTotales=$("#checkModulo4").prop("checked");
		if(opcionRecursosTotales){
			$("#checkModulo5").prop("checked",true);
			$("#checkModulo6").prop("checked",true);
			$("#checkModulo7").prop("checked",true);
			$("#checkModulo8").prop("checked",true);
			$("#checkModulo21").prop("checked",true);

			$("#checkModEditar5").prop("disabled",false);
			$("#checkModEditar6").prop("disabled",false);
			$("#checkModEditar7").prop("disabled",false);
			$("#checkModEditar8").prop("disabled",false);
			$("#checkModEditar21").prop("disabled",false);
			
			$("#checkModEliminar5").prop("disabled",false);
			$("#checkModEliminar6").prop("disabled",false);
			$("#checkModEliminar7").prop("disabled",false);
			$("#checkModEliminar8").prop("disabled",false);
			$("#checkModEliminar21").prop("disabled",false);
			}else{
			$("#checkModulo5").prop("checked",false);
			$("#checkModulo6").prop("checked",false);
			$("#checkModulo7").prop("checked",false);
			$("#checkModulo8").prop("checked",false);
			$("#checkModulo21").prop("checked",false);
			
			$("#checkModEditar5").prop("disabled",true);
			$("#checkModEditar6").prop("disabled",true);
			$("#checkModEditar7").prop("disabled",true);
			$("#checkModEditar8").prop("disabled",true);
			$("#checkModEditar21").prop("disabled",true);
			
			$("#checkModEliminar5").prop("disabled",true);
			$("#checkModEliminar6").prop("disabled",true);
			$("#checkModEliminar7").prop("disabled",true);
			$("#checkModEliminar8").prop("disabled",true);
			$("#checkModEliminar21").prop("disabled",true);
			
			
			$("#checkModEditar5").prop("checked",false);
			$("#checkModEditar6").prop("checked",false);
			$("#checkModEditar7").prop("checked",false);
			$("#checkModEditar8").prop("checked",false);
			$("#checkModEditar21").prop("checked",false);
				
			$("#checkModEliminar5").prop("checked",false);
			$("#checkModEliminar6").prop("checked",false);
			$("#checkModEliminar7").prop("checked",false);
			$("#checkModEliminar8").prop("checked",false);
			$("#checkModEliminar21").prop("checked",false);
		}
		break;
	}
	
	var opcionRecurso1=$("#checkModulo5").prop("checked");
	var opcionRecurso2=$("#checkModulo6").prop("checked");
	var opcionRecurso3=$("#checkModulo7").prop("checked");
	var opcionRecurso4=$("#checkModulo8").prop("checked");
	var opcionRecurso5=$("#checkModulo21").prop("checked");
	if(opcionRecurso1 || opcionRecurso2 || opcionRecurso3 || opcionRecurso4 || opcionRecurso5){
		$("#checkModulo4").prop("checked",true);
	}
	
	if(!opcionRecurso1 && !opcionRecurso2 && !opcionRecurso3 && !opcionRecurso4 && !opcionRecurso5){
		$("#checkModulo4").prop("checked",false);
	}
	
}

var usuarioConfigId,usuarioConfigObj={};
var banderaEdicionUsuConfig = false;
var listFullUsuConfigBuscador = [];
var busquedaActivaUsuConfig,numPaginaActualUsuConfig;

function ocultarConsolidadoUsuarioConfiguracion(){
	$("#modalConsolidadoUsuarioConfiguracion").modal("hide");
}

function verConsolidadoUsuarioConfiguracion(){
	$("#modalConsolidadoUsuarioConfiguracion").remove();

	var contenido = "";

	var buttonVolver =
		"<button id='btnOcultarUsuConfig' type='button' class='btn btn-info' style='margin-right:5px' " +
				"onclick='ocultarConsolidadoUsuarioConfiguracion()' title='Regresar a la vista principal'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
		"</button>";

	var buttonCancelar =
		"<button id='btnCancelarUsuConfig' type='button' class='btn btn-success' style='margin-right:5px' " +
				"onclick='cancelarConsolidadoUsuarioConfiguracion()' title='Cancelar'>" +
			"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
		"</button>";

	var buttonGuardar =
		"<button id='btnGuardarUsuConfig' type='button' class='btn btn-success' style='margin-right:5px' " +
				"onclick='guardarConsolidadoUsuarioConfiguracion()' title='Guardar'>" +
			"<i class='fa fa-floppy-o fa-2x'></i>" +
		"</button>";

	var buttonFlechas =
		"<span id='indicadorPaginaParcialAuxUsuConfig' style='margin:5px;margin-top:10px;'>" +
			"<a id='flechaIzquierdaUsuConfig'><img src='../imagenes/flecha_01.png' /></a>" +
			" <em id='labelFlechasUsuConfig'></em> " +
			"<a id='flechaDerechaUsuConfig'><img src='../imagenes/flecha_02.png' /></a>" +
		"</span>";

	var buscadorOpciones =
		"<button id='btnResetBuscadorUsuConfig' type='button' class='btn btn-success' " +
				"title='Refresh' onclick='reiniciarBuscadorConsolidadoUsuarioConfiguracion()' style='float:right;'>" +
			"<i class='fa fa-refresh fa-2x'></i>" +
		"</button>" +
		"<button id='btnAplicarBuscadorUsuConfig' type='button' class='btn btn-success' onclick='aplicarBuscadorConsolidadoUsuarioConfiguracion()' " +
				"style='float:right;margin-right:5px;' title='Buscar los registros cuyo nombre o acceso coincida con las palabras ingresadas.'>" +
			"<i class='fa fa-search fa-2x'></i>" +
		"</button>" +
		"<input id='valBuscarValorUsuConfig' placeholder='Nombre o acceso' class='form-control' " +
			   "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

	var modalOptions={
		maxWidth:"90%",id:"modalConsolidadoUsuarioConfiguracion",nombre:"<i class='fa fa-cubes'></i> Usuarios",
		contenido:
			"<form class='form-inline'>" +
			     buttonVolver+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
			"</form>" +
			"<div class='wrapper' id='wrapperConsolidadoUsuConfig'>" +
				"<table id='tblConsolidadoUsuConfig' class='table table-striped table-bordered table-hover table-fixed'>" +
					"<thead>" +
						"<tr>" +
							"<td class='tb-acc' style='width:300px'>Acceso</td>" +
							"<td class='tb-acc' style='width:350px'>Nombre</td>" +
							"<td class='tb-acc' style='width:250px'>Perfil</td>" +
							"<td class='tb-acc' style='width:150px'>¿Aprueba documentos?</td>" +
							"<td class='tb-acc' style='width:350px'>Acceso a empresa(s)</td>" +
							"<td class='tb-acc' style='width:350px'>Trabajador asignado</td>" +
							"<td class='tb-acc' style='width:350px'>Acceso a trabajadores (opcional)</td>" +
							"<td class='tb-acc' style='width:200px'>Actualizado el</td>" +
						"</tr>" +
					"</thead>" +
					"<tbody></tbody>" +
				"</table>" +
			"</div>"};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	resizeDivWrapper("wrapperConsolidadoUsuConfig",215);
	cargarConsolidadoUsuarioConfiguracion();

	$("#flechaIzquierdaUsuConfig").on('click',function(){
		numPaginaActualUsuConfig = numPaginaActualUsuConfig-1;
		cambiarPaginaConsolidadoUsuarioConfiguracion();
	});

	$('#flechaDerechaUsuConfig').on('click',function(){
		numPaginaActualUsuConfig = numPaginaActualUsuConfig+1;
		cambiarPaginaConsolidadoUsuarioConfiguracion();
	});
}

function cargarConsolidadoUsuarioConfiguracion(){
	busquedaActivaUsuConfig = 0,numPaginaActualUsuConfig = 1;banderaEdicionUsuConfig = false;
	$("#valBuscarValorUsuConfig").val("");

	$("#btnOcultarUsuConfig").show();$("#btnCancelarUsuConfig").hide();$("#btnGuardarUsuConfig").hide();
	$("#indicadorPaginaParcialAuxUsuConfig").show();$("#btnResetBuscadorUsuConfig").show();$("#btnAplicarBuscadorUsuConfig").show();
	$("#valBuscarValorUsuConfig").show();

	callAjaxPostSimpleVersionDos(1,URL+'/subusuario/vista_admin',{},1,0,function(data){
		if(data.CODE_RESPONSE == "05"){
			listFullSubUsuarios = data.list;listAcceso = data.accesos;listEmpresasSubUsuario = data.empresasTotal;
			listTrabajadoresSubUsuario = data.trabajadoresTotal;

			cambiarPaginaConsolidadoUsuarioConfiguracion();

			goheadfixedY("#tblConsolidadoUsuConfig","#wrapperConsolidadoUsuConfig");
			formatoCeldaSombreableTabla(true,"tblConsolidadoUsuConfig");
		}else{
			console.log("Error al cargar los usuarios.");
		}
	});
}

function cambiarPaginaConsolidadoUsuarioConfiguracion(){
	$("#flechaIzquierdaUsuConfig").show();$("#flechaDerechaUsuConfig").show();

	var list = (busquedaActivaUsuConfig == 0?listFullSubUsuarios:listFullUsuConfigBuscador);
	var totalSize = list.length;
	var partialSize = 100;

	var numPaginaTotal = Math.ceil(totalSize/partialSize);

	var inicioRegistro = (numPaginaActualUsuConfig*partialSize)-partialSize;
	var finRegistro = (numPaginaActualUsuConfig*partialSize)-1;

	if(numPaginaTotal == 0){
		numPaginaTotal = 1;
	}

	$("#labelFlechasUsuConfig").html("<label>"+numPaginaActualUsuConfig+" de "+numPaginaTotal+"</label>");

	if(numPaginaActualUsuConfig == 1){
		$("#flechaIzquierdaUsuConfig").hide();
	}

	if(numPaginaActualUsuConfig == numPaginaTotal){
		$("#flechaDerechaUsuConfig").hide();
	}

	if(finRegistro >= totalSize){
		finRegistro = totalSize-1;
	}

	$("#tblConsolidadoUsuConfig tbody tr").remove();

	list.forEach(function(val,index){
		if(inicioRegistro <= index && index <= finRegistro){
			var userName = (val.userName.trim().length == 0?"------":val.userName),
				isFirmante = (val.isFirmante == 1?"Si":"No"),trabajadorAsignado = ([0,1,14].includes(val.accesoUsuarios)?
				(val.trabajadorNombre.trim().length == 0?"------":val.trabajadorNombre):"<label>*No aplica.</label>");

			$("#tblConsolidadoUsuConfig tbody").append(
				"<tr id='trConsUsuConfig"+val.userId+"' onclick='editarConsolidadoUsuarioConfiguracion("+index+")'>" +
					"<td id='accesoUsuConfig"+val.userId+"'>"+val.tipoAcceso.nombre+"</td>" +
					"<td id='nombreUsuConfig"+val.userId+"' style='word-break:break-all;'>"+userName+"</td>" +
					"<td id='perfilUsuConfig"+val.userId+"'>"+val.perfilDescripcion+"</td>" +
					"<td id='hasFirmUsuConfig"+val.userId+"'>"+isFirmante+"</td>" +
					"<td id='empUsuConfig"+val.userId+"' style='word-break:break-all;'>("+val.numEmpresas+") "+val.empresasNombre+"</td>" +
					"<td id='trabAsigUsuConfig"+val.userId+"' style='word-break:break-all;'>"+trabajadorAsignado+"</td>" +
					"<td id='trabUsuConfig"+val.userId+"' style='word-break:break-all;'>("+val.numTrabajadores+") "+val.trabajadoresNombre+"</td>" +
					"<td id='fechaActUsuConfig"+val.userId+"'>"+val.fechaActualizacionTexto+"</td>" +
				"</tr>");
		}
	});

	$.unblockUI();
}

function cancelarConsolidadoUsuarioConfiguracion(){
	cargarConsolidadoUsuarioConfiguracion();
}

function editarConsolidadoUsuarioConfiguracion(pindex){
	if(!banderaEdicionUsuConfig){
		formatoCeldaSombreableTabla(false,"tblConsolidadoUsuConfig");
		usuarioConfigObj = (busquedaActivaUsuConfig == 0?listFullSubUsuarios[pindex]:listFullUsuConfigBuscador[pindex]);
		usuarioConfigId = usuarioConfigObj.userId;

		$("#trConsUsuConfig"+usuarioConfigId).addClass("fila-edicion");

		$("#nombreUsuConfig"+usuarioConfigId).html("<input class='form-control' id='nombreSubUsuarioInputUsuConfig' type='text'>");
		$("#nombreSubUsuarioInputUsuConfig").val(usuarioConfigObj.userName);

		var selTipoPerfilUsuConfig = crearSelectOneMenu("selTipoPerfilUsuConfig","",listFullPerfiles,usuarioConfigObj.idPerfil,"perfilId","perfilNombre");

		$("#perfilUsuConfig"+usuarioConfigId).html(selTipoPerfilUsuConfig);

		var textoIsFirmante = (usuarioConfigObj.isFirmante == 1?"checked":"");
		$("#hasFirmUsuConfig"+usuarioConfigId).html("<input class='form-control' id='checkFirmanteUsuConfig' type='checkbox' "+textoIsFirmante+">");

		var empresasId = usuarioConfigObj.empresasId.split(",");

		listEmpresasSubUsuario.forEach(function(val){
			val.selected = 0;

			empresasId.forEach(function(val1){
				if(parseInt(val1) == val.idCompany){
					val.selected = 1;
				}
			})
		});

		crearSelectOneMenuObligMultipleCompleto("slcAccesoEmpresasSubUsuUsuConfig","",listEmpresasSubUsuario,"idCompany","name",
			"#empUsuConfig"+usuarioConfigId,"Acceso...");

		var trabajadoresId = usuarioConfigObj.trabajadoresId.split(",");

		listTrabajadoresSubUsuario.forEach(function(val){
			val.selected = 0;

			trabajadoresId.forEach(function(val1){
				if(parseInt(val1) == val.trabajadorId){
					val.selected = 1;
				}
			})
		});

		crearSelectOneMenuObligMultipleCompleto("slcAccesoTrabajadorSubUsuUsuConfig","",listTrabajadoresSubUsuario,"trabajadorId","nombre",
			"#trabUsuConfig"+usuarioConfigId,"Acceso...");

		if([0,1,14].includes(usuarioConfigObj.accesoUsuarios) && usuarioConfigObj.trabajadorNombre.trim().length > 0){
			$("#selAccesoUsuConfig").prop("disabled",true);$("#nombreSubUsuarioInputUsuConfig").prop("disabled",true);
		}else if([0,1,14].includes(usuarioConfigObj.accesoUsuarios) && usuarioConfigObj.trabajadorNombre.trim().length == 0){
			$("#trabAsigUsuConfig"+usuarioConfigId).html("<input id='inputTrabajadorAsigUsuConfig' class='form-control' type='text'>" +
				"<div id='divAutoCompletarTrabajadorAsigUsuConfig'></div>" +
				"<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>");

			buscarTrabajadorUsuarioConfiguracion();
		}

		banderaEdicionUsuConfig = true;

		$("#btnOcultarUsuConfig").hide();$("#btnCancelarUsuConfig").show();$("#btnGuardarUsuConfig").show();
		$("#indicadorPaginaParcialAuxUsuConfig").hide();$("#btnResetBuscadorUsuConfig").hide();$("#btnAplicarBuscadorUsuConfig").hide();
		$("#valBuscarValorUsuConfig").hide();
	}
}

var listTrabBuscadorUsuConfigAux = [];

function buscarTrabajadorUsuarioConfiguracion(){
	var nombre = $("#inputTrabajadorAsigUsuConfig").val().trim();

	if(nombre.length >= 3){
		var dataParam={
			trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),hasUsuarioAsignado:1,
			accesoUsuario:usuarioConfigObj.accesoUsuarios
		};

		callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
			listTrabBuscadorUsuConfigAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

			var selTrabajadorAsigUsuConfig = crearSelectOneMenuOblig("selTrabajadorAsigUsuConfig",
				"",listTrabBuscadorUsuConfigAux,"","trabajadorId","nombre");

			$("#divAutoCompletarTrabajadorAsigUsuConfig").html(selTrabajadorAsigUsuConfig);
			$("#inputTrabajadorAsigUsuConfig").attr("onkeyup","buscarTrabajadorUsuarioConfiguracion()");
		});
	}else{
		listTrabBuscadorUsuConfigAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

		var selTrabajadorAsigUsuConfig = crearSelectOneMenuOblig("selTrabajadorAsigUsuConfig",
			"",listTrabBuscadorUsuConfigAux,"","trabajadorId","nombre");

		$("#divAutoCompletarTrabajadorAsigUsuConfig").html(selTrabajadorAsigUsuConfig);
		$("#inputTrabajadorAsigUsuConfig").attr("onkeyup","buscarTrabajadorUsuarioConfiguracion()");
	}
}

function guardarConsolidadoUsuarioConfiguracion(){
	var campoVacio = true;

	var nombreUsuario = $("#nombreSubUsuarioInputUsuConfig").val().trim();
	var perfilId = parseInt($("#selTipoPerfilUsuConfig").val());
	var isFirmante = ($("#checkFirmanteUsuConfig").prop("checked")?1:0);

	var empresasId = [],trabajadoresId = [];

	var empresas = $("#slcAccesoEmpresasSubUsuUsuConfig").val();

	empresas.forEach(function(val,index){
		empresasId.push({empresaId:val});
	});

	var trabajadores = $("#slcAccesoTrabajadorSubUsuUsuConfig").val();

	trabajadores.forEach(function(val,index){
		trabajadoresId.push({trabajadorId:val});
	});

	if(nombreUsuario.length == 0 || perfilId == -1){
		campoVacio = false;mensajeUx="<label>Debe ingresar el nombre y seleccionar el perfil.<label>";
	}

	if(campoVacio){
		var usuarioObj={
			userId:usuarioConfigId,userName:nombreUsuario,accesoUsuarios:usuarioConfigObj.accesoUsuarios,idPerfil:perfilId,
			empresas:empresasId,trabajadores:trabajadoresId,isFirmante:isFirmante
		};

		if([0,1,14].includes(usuarioConfigObj.accesoUsuarios) && usuarioConfigObj.trabajadorNombre.trim().length == 0){
			usuarioObj.trabajadorId = (parseInt($("#selTrabajadorAsigUsuConfig").val()) == -1?null:parseInt($("#selTrabajadorAsigUsuConfig").val()));
		}

		callAjaxPostSimpleVersionDos(1,URL+'/administrador/usuario/exists',usuarioObj,1,0,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					var usuarioTaken = data.usuarioTaken;

					if(usuarioTaken){
						$.unblockUI();$("#modalConsolidadoUsuarioConfiguracion").modal("hide");

						mensajeUx="<label>El usuario ya existe. Debe introducir otro nombre.<label>";
						mensajesUx(mensajeUx,2,"","ValidacionUsuConfig");

						$("#modalMensajeUxValidacionUsuConfig").on("hidden.bs.modal",function(){
							$("#modalConsolidadoUsuarioConfiguracion").modal("show");
						});
					}else{
						callAjaxPostSimpleVersionDos(1,URL+'/subusuario/save',usuarioObj,0,1,function(data){
							switch(data.CODE_RESPONSE){
								case "05":
									$("#modalConsolidadoUsuarioConfiguracion").modal("hide");

									mensajeUx = "<label>El registro usuario fue guardado con éxito.</label>";
									mensajesUx(mensajeUx,1,"","ActualizarUsuConfig");

									$("#modalMensajeUxActualizarUsuConfig").on("hidden.bs.modal",function(){
										$("#modalConsolidadoUsuarioConfiguracion").modal("show");cargarConsolidadoUsuarioConfiguracion();
									});

									break;

								default:
									alert("Ocurrió un error al guardar el usuario!");
							}
						});
					}

					break;

				default:
					alert("Ocurrió un error al guardar el usuario!");
			}
		});
	}else{
		$("#modalConsolidadoUsuarioConfiguracion").modal("hide");

		mensajesUx(mensajeUx,2,"","ValidacionUsuConfig");

		$("#modalMensajeUxValidacionUsuConfig").on("hidden.bs.modal",function(){
			$("#modalConsolidadoUsuarioConfiguracion").modal("show");
		});
	}
}

function aplicarBuscadorConsolidadoUsuarioConfiguracion(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

	var valBuscarValorUsuConfig = igualarStringBuscar($("#valBuscarValorUsuConfig").val());
	listFullUsuConfigBuscador = [];busquedaActivaUsuConfig = 1;numPaginaActualUsuConfig = 1;

	listFullSubUsuarios.forEach(function(val,index){
		if(igualarStringBuscar(val.userName).indexOf(valBuscarValorUsuConfig) != -1 ||
			igualarStringBuscar(val.tipoAcceso.nombre).indexOf(valBuscarValorUsuConfig) != -1){
			listFullUsuConfigBuscador.push(val);
		}
	});

	cambiarPaginaConsolidadoUsuarioConfiguracion();
}

function reiniciarBuscadorConsolidadoUsuarioConfiguracion(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
	$("#valBuscarValorUsuConfig").val("").focus();
	busquedaActivaUsuConfig = 0;numPaginaActualUsuConfig = 1;

	cambiarPaginaConsolidadoUsuarioConfiguracion();
}