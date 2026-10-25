
var contratistaPerfilObj = {};

function habilitarPerfilContratista(){
	$(".divListPrincipal").html("");

	var listItemsForm=[
		{sugerencia:"",label:"Anterior contraseña",inputForm:"<input id='inputOldPass' type='password' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"<label>*Debe incluir una letra minúscula, una letra mayúscula y un número (mínimo 8 caracteres).</label>",
		 label:"Nueva contraseña",inputForm:"<input id='inpuNewPass' type='password' class='form-control' placeholder=''>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",label:"Confirmación nueva contraseña",inputForm:"<input id='inpuNewNewPass' type='password' class='form-control'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",label:"",
		 inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
				       "<i aria-hidden='true' class='fa fa-paper-plane'></i> Cambiar" +
				   "</button>"}
	];

	var textoForm = "";

	textoForm += "<div class='eventoGeneral'>";
	    listItemsForm.forEach(function(val,index){
		    textoForm += obtenerSubPanelModuloVersionDos(val);
	    });
	textoForm += "</div>";

	var listPerfilPrincipal = [];

	if(activoTipoExam79 == 1){
	    listPerfilPrincipal.push({id:"subListBloqueoSeccionContratista",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verBloqueoSeccionContratistaPerfil()",btnIconoAux:"fa-lock",
	        btnTitleAux:"Registro/Modificación del correo asociado al bloqueo.",nombre:"Configuración bloqueo sección 'Habilitación médica por clínica'",contenido:""});
	}else if(activoCorreoHabilitacionMedica == 1){
		listPerfilPrincipal.push({id:"subListCorreoHabilitacionMedica",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verCorreoHabilitacionMedicaPerfil()",btnIconoAux:"fa-envelope-o",
		    btnTitleAux:"Registro/Modificación del correo.",nombre:"Correo para habilitación médica por clínica",contenido:""});
	}

	listPerfilPrincipal.push({id:"subListInfoPersonaContacto",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"editarInformacionPersonaContactoPerfilUsuContratista()",btnIconoAux:"fa-pencil",
	     btnTitleAux:"Editar la información del responsable general.",nombre:"Información persona de contacto/contacto extra",contenido:""},
	    {id:"subListPassword",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Cambiar Contraseña",
	     contenido:"<form class='eventoGeneral' id='nuevoPassTrabajador'>"+textoForm+"</form>"},
	    {id:"subListInfoExtra",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Información general",contenido:""},
	    {id:"subListCerrarSession",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"cerrarSesionVistaContratista()",btnIconoAux:"fa-times",btnTitleAux:"Finalizar la sesión actual.",
	     nombre:"Cerrar sesión",contenido:""});

	agregarPanelesDivPrincipalVersionTres(listPerfilPrincipal);

	var dataParam = {
	    id:parseInt(getSession("contratistaGosstId"))
	};

	callAjaxPost(URL+'/contratista/usuario/perfil',dataParam,function(data){
		var licencia = data.licencia;
		
		contratistaPerfilObj = data.contratista;

		var infoArray=[
			{sugerencia:"",label:"Usuario",inputForm:getSession("gestopusername")},
			{sugerencia:"",label:"Cliente",inputForm:licencia.empresaNombre},
//			{sugerencia:"",divContainer:"divCorreoContratista",label:"Correo",
//			 inputForm:"<strong>"+licencia.correo+"</strong>"+"<br>" +
//			     "<button onclick='modificarDatosContratista()' class='btn btn-success'>" +
//				     "<i class='fa fa-pencil-square-o'></i> Cambiar" +
//				 "</button>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",label:"Logo Cliente",inputForm:insertarImagenParaTablaMovil(licencia.logo,"","100%")},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			{sugerencia:"",label:"Logo Contratista",inputForm:insertarImagenParaTablaMovil(licencia.logoContratista,"","100%") +
			     "<div id='logoContratista'></div>"}
		];

		var informacionTexto = "";

		informacionTexto += "<div class='eventoGeneral'>";
			infoArray.forEach(function(val,index){
				informacionTexto += obtenerSubPanelModuloVersionDos(val);
			});
		informacionTexto += "</div>";

		$("#subListInfoExtra").find(".contenidoSubList").html("<div class='eventoGeneral'>"+informacionTexto+"</div>");

		var options={
			container:"#logoContratista",functionCall:function(){
				guardarEvidenciaAuto(getSession("contratistaGosstId"),"fileEviContratista",
					bitsLogoEmpresa,"/contratista/logo/evidencia/save",habilitarPerfilContratista)},
			descargaUrl:"/contratista/logo/evidencia?id="+getSession("contratistaGosstId"),
			esNuevo:false,isImagen:true,idAux:"Contratista",evidenciaNombre:"Modificar Logo"
		};

		crearFormEvidenciaCompleta(options);
	});

	$('#nuevoPassTrabajador').on('submit',function(e){
		e.preventDefault();
		cambiarClaveAccesoVistaContratista();
	});
}

function cambiarClaveAccesoVistaContratista(){
	var campoVacio = true;

	var psw1 = $("#inputOldPass").val().trim();
	var psw2 = $("#inpuNewPass").val().trim();
	var psw3 = $("#inpuNewNewPass").val().trim();

	var valMinVerifNewPass = /[a-z]/.test(psw2);
	var valMayVerifNewPass = /[A-Z]/.test(psw2);
	var valNumVerifNewPass = /[0-9]/.test(psw2);
	var validacionNewNewPass = (psw3 == psw2?1:0);

	if(psw1.length == 0 || psw2.length == 0 || psw3.length == 0){
		campoVacio = false;
		mensajeUx = "<label>Debe completar todos los campos activos.</label>";
	}else if(psw2.length < 8){
		campoVacio = false;
		mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, 8 caracteres.</label>";
	}else if(!valMinVerifNewPass || !valMayVerifNewPass || !valNumVerifNewPass){
		campoVacio = false;
		mensajeUx = "<label>La nueva contraseña debe tener, como mínimo, una letra " +
			"minúscula, una letra mayúscula y un número entre sus caracteres.</label>";
	}else if(validacionNewNewPass == 0){
		campoVacio = false;
		mensajeUx = "<label>La nueva contraseña y la confirmación, de la nueva contraseña, " +
			"no coinciden.</label>";
	}

	if(campoVacio){
	    var dataParam={
		id:parseInt(getSession("contratistaGosstId")),fechaUltimaActClaveTexto:contratistaPerfilObj.fechaUltimaActClaveTexto,
	        contraseniaAuxiliar:contratistaPerfilObj.contraseniaAuxiliar,contraseniaAnterior:psw1,contraseniaNueva:psw2
	    };

	    callAjaxPost(URL+'/contratista/password/validacion/save',dataParam,function(data){
		switch(data.CODE_RESPONSE){
		    case "05":
		        var iconoMensajeFinal = (data.mensaje.includes("éxito")?1:2);

		        mensajeUx = data.mensaje;
		        mensajesUx(mensajeUx,iconoMensajeFinal,"","ActualizarPerfil");

		        $("#modalMensajeUxActualizarPerfil").on("hidden.bs.modal",function(){
		            if(iconoMensajeFinal == 1){
		                $("#inputOldPass").val("");$("#inpuNewPass").val("");$("#inpuNewNewPass").val("");
		                $("#subListPassword").find(".contenidoSubList").hide();
		            }
		        });

			break;

                    default:
                	alert("Ocurrió un error al guardar la contraseña!");
                }
            });
	}else{
		mensajesUx(mensajeUx,2,"");
	}
}

function modificarDatosContratista(){
	$("#divCorreoContratista").html("<input class='form-control' id='inputCorreoContratista'>" +
		"<button class='btn btn-success' onclick='guardarDatosContratista()'><i class='fa fa-save'></i> Guardar</button> " +
		"<button class='btn btn-danger' onclick='habilitarPerfilContratista()'><i class='fa fa-times'></i> Cancelar</button>");

	$("#inputCorreoContratista").val("");
}

function guardarDatosContratista(){
	var contactoCorreo = $("#inputCorreoContratista").val();

	var dataParam={
		id:getSession("contratistaGosstId"),contactoCorreo:contactoCorreo
	};

	callAjaxPost(URL+"/contratista/datos/save",dataParam,function(data){
		habilitarPerfilContratista()
	});
}

var bloqueoSeccionContratistaId,indexBloqSeccContPerfil,objBloqSeccContPerfil = {};
var listBloqueoSeccionContratistaPerfil = [];

function toggleMenuOpcionBloqueoSeccionContratistaPerfil(obj,pindex){
	objBloqSeccContPerfil = listBloqueoSeccionContratistaPerfil[pindex];
	indexBloqSeccContPerfil = pindex;

	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesBloqueoSeccionContratistaPerfil=[
	{id:"opcHistorial",nombre:"<i class='fa fa-table'></i> Historial de cambios",
	 functionClick:function(data){verHistorialBloqueoSeccionContratistaPerfil()}},
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
	 functionClick:function(data){registroBloqueoSeccionContratistaPerfil(1)}},
	{id:"opcCambiarClave",nombre:"<i class='fa fa-unlock-alt'></i> Cambiar contraseña",
	 functionClick:function(data){cambiarClaveBloqueoSeccionContratistaPerfil()}},
];

function marcarSubOpcionBloqueoSeccionContratistaPerfil(pindex){
	funcionalidadesBloqueoSeccionContratistaPerfil[pindex].functionClick();
	$(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalBloqSeccContPerfil(){
	$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("hide");
}

function verBloqueoSeccionContratistaPerfil(){
	$("#modalPrincipalBloqueoSeccionContratistaPerfil").remove();

	var listModal={
		id:"modalPrincipalBloqueoSeccionContratistaPerfil",nombre:"Configuración bloqueo sección 'Habilitación médica por clínica'",
		contenido:"<div id='estadoMovilPrincipalBloqSeccContPerfil'></div>",btnCerrarHabilitado:0
	};

	crearModalPrincipalUsuario(listModal,function(){},true,true);

	cargarBloqueoSeccionContratistaPerfil();
}

function cargarBloqueoSeccionContratistaPerfil(){
	$("#estadoMovilPrincipalBloqSeccContPerfil").html("");

	var dataParam={
		contratistaId:parseInt(getSession("contratistaGosstId"))
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/bloqueo_seccion_contratista',dataParam,1,1,function(data){
		if(data.CODE_RESPONSE == "05"){
			var listPanelesPrincipal = [];
			var textTotalRegistros= "";

			listBloqueoSeccionContratistaPerfil = data.listBloqueoSeccionContratistaPerfil;

			listBloqueoSeccionContratistaPerfil.forEach(function(val,index){
				var btnOpcion="",menuOpcion="";

				menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
					funcionalidadesBloqueoSeccionContratistaPerfil.forEach(function(val1,index1){
						menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionBloqueoSeccionContratistaPerfil("+index1+")'>"+val1.nombre+"</li>";
					});
				menuOpcion += "</ul>";

				btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionBloqueoSeccionContratistaPerfil(this,"+index+")'>" +
					            "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
					        "</a>";

				var listTotal=[];

				listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-envelope-o'></i> Correo:",inputForm:val.correo+btnOpcion+menuOpcion},
					{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});

				if(val.fechaRegistroTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",inputForm:val.fechaRegistroTexto});
				}

				if(val.fechaActualizacionTexto.length > 0){
					listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",inputForm:val.fechaActualizacionTexto});
				}

				textTotalRegistros += "<div class='eventoGeneral'>" +
					                      "<div class='eventoGeneral'>";
				listTotal.forEach(function(val,index){
					textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
				});
				textTotalRegistros +=     "</div>" +
					                  "</div>";
			});

			listPanelesPrincipal.push({id:"volverBloqSeccContPerfil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"regresarVistaPrincipalBloqSeccContPerfil()",
				btnIconoAux:"fa-sign-out fa-rotate-180",btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""});

			if(listBloqueoSeccionContratistaPerfil.length == 0){
				listPanelesPrincipal.push({id:"nuevoRegBloqSeccContPerfil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroBloqueoSeccionContratistaPerfil(0)",
					btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar correo",contenido:""});
			}else{
				listPanelesPrincipal.push({id:"registroBloqSeccContPerfil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
					btnIconoAux:"",btnTitleAux:"",nombre:"Correo registrado",contenido:textTotalRegistros});
			}

			agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoMovilPrincipalBloqSeccContPerfil");

			$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
		}else{
			console.log("NOPNPO")
		}
	});
}

function ocultarRegistroBloqueoSeccionContratistaPerfil(){
	$("#modalRegistroBloqueoSeccionContratistaPerfil").modal("hide");$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
}

function registroBloqueoSeccionContratistaPerfil(opcRegistro){
	var opcionRegistro = parseInt(opcRegistro);

	$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("hide");$("#modalRegistroBloqueoSeccionContratistaPerfil").remove();

	bloqueoSeccionContratistaId = (opcionRegistro == 0?0:objBloqSeccContPerfil.id);

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Correo",inputForm:"<input id='inputCorreoBloqSeccContPerfil' class='form-control' type='text'>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroBloqueoSeccionContratistaPerfil()'>" +
				   "<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarRegistroBloqueoSeccionContratistaPerfil()'>" +
				       "<i class='fa fa-floppy-o'></i> Guardar" +
				   "</button>"}
	];

	listContenido.forEach(function(val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalRegistroBloqueoSeccionContratistaPerfil",nombre:"<i class='fa fa-pencil-square-o'></i> Registro correo",
		contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	if(opcionRegistro == 1){
		$("#inputCorreoBloqSeccContPerfil").val(objBloqSeccContPerfil.correo);
	}
}

function guardarRegistroBloqueoSeccionContratistaPerfil(){
	var campoVacio = true;

	var correo = $("#inputCorreoBloqSeccContPerfil").val();

	if(correo.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe completar el campo activo.</label>";
	}else if(!correo.includes("@")){
		campoVacio = false;mensajeUx = "<label>Debe ingresar un correo.</label>";
	}

	if(campoVacio){
		var dataParam={
			id:bloqueoSeccionContratistaId,correo:correo,contratistaId:parseInt(getSession("contratistaGosstId")),
			contratistaNombre:getSession("gestopusername"),empresaNombre:getSession("gestopcompanyname")
		};

		callAjaxPostSimpleVersionDos(1,URL+'/contratista/bloqueo_seccion_contratista/save',dataParam,1,1,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					$("#modalRegistroBloqueoSeccionContratistaPerfil").modal("hide");

					mensajeUx="<label>El registro correo fue guardado con éxito.</label>";

					if(bloqueoSeccionContratistaId == 0){
						mensajeUx+="<br><br><label>*Se envió la contraseña al email indicado.</label>";
					}

					mensajesUx(mensajeUx,1,"","ActualizarBloqSeccContPerfil");

					$("#modalMensajeUxActualizarBloqSeccContPerfil").on("hidden.bs.modal",function(){
					    $("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
						cargarBloqueoSeccionContratistaPerfil();
					});

					break;

				default:
					alert("Ocurrió un error al guardar el registro correo.");
			}
		});
	}else{
		$("#modalRegistroBloqueoSeccionContratistaPerfil").modal("hide");
		mensajesUx(mensajeUx,2,"","ValidacionBloqSeccContPerfil");

		$("#modalMensajeUxValidacionBloqSeccContPerfil").on("hidden.bs.modal",function(){
			$("#modalRegistroBloqueoSeccionContratistaPerfil").modal("show");
		});
	}
}

function volverHistorialBloqueoSeccionContratistaPerfil(){
	$("#modalConsolidadoHistorialBloqueoSeccCont").modal("hide");$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
}

function verHistorialBloqueoSeccionContratistaPerfil(){
	$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("hide");

	if(objBloqSeccContPerfil.numRegHistorialCambios > 0){
		$("#modalConsolidadoHistorialBloqueoSeccCont").remove();

		var contenido = "";

		var buttonVolver =
			"<button type='button' class='btn btn-info' style='margin-right:5px' " +
			        "onclick='volverHistorialBloqueoSeccionContratistaPerfil()' title='Regresar a la vista principal'>" +
			    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
			"</button>";

		var modalOptions={
			maxWidth:"50%",id:"modalConsolidadoHistorialBloqueoSeccCont",btnCerrarHabilitado:0,nombre:"<i class='fa fa-table'></i> Historial de cambios",
			contenido:
				 buttonVolver +
				"<div class='wrapper' id='wrapperConsolidadoHistorialBloqueoSeccCont'>" +
				    "<table id='tblConsolidadoHistorialBloqueoSeccCont' class='table table-striped table-bordered table-hover table-fixed'>" +
				        "<thead>" +
				            "<tr>" +
								"<td class='tb-acc' style='width:100px'>N° Orden</td>" +
								"<td class='tb-acc' style='width:300px'>Correo</td>" +
								"<td class='tb-acc' style='width:150px'>Registrado el</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody></tbody>" +
					"</table>" +
				"</div>"
		};

		crearModalPrincipalUsuario(modalOptions,function(){},true,true);
		resizeDivWrapper("wrapperHistorialCorreoObs",190);

		var dataParam={
			bloqueoSeccionContratistaId:objBloqSeccContPerfil.id
		};

		callAjaxPost(URL+"/contratista/bloqueo_seccion_contratista/historial",dataParam,function(data){
			if(data.CODE_RESPONSE == "05"){
				var listHistorialBloqueoSeccionContratista = data.listHistorialBloqueoSeccionContratista;

				$("#tblConsolidadoHistorialBloqueoSeccCont tbody tr").remove();

				listHistorialBloqueoSeccionContratista.forEach(function(val,index){
					$("#tblConsolidadoHistorialBloqueoSeccCont tbody").append(
						"<tr id='fcorreo"+val.id+"'>" +
						    "<td>"+(index+1)+"</td>" +
						    "<td>"+val.correo+"</td>" +
							"<td>"+val.fechaRegistroTexto+"</td>" +
						"</tr>");
				});
			}else{
				console.log("NOPNPO");
			}

			goheadfixedY("#tblConsolidadoHistorialBloqueoSeccCont","#wrapperConsolidadoHistorialBloqueoSeccCont");
		});
	}else{
		mensajeUx="<label>No hay cambios registrados en el historial.</label>";
		mensajesUx(mensajeUx,4,"","ValidacionBloqSeccContPerfil");

		$("#modalMensajeUxValidacionBloqSeccContPerfil").on("hidden.bs.modal",function(){
			$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
		});
	}
}

function cambiarClaveBloqueoSeccionContratistaPerfil(){
	$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("hide");

	mensajeUx="<label>¿Está seguro de cambiar la contraseña del correo '"+objBloqSeccContPerfil.correo+"' para el acceso a " +
		"la sección 'Habilitación médica por clínica'?</label>";
	mensajesUx(mensajeUx,3,"","ConfirmarBloqSeccContPerfil");

	$("#btnDevolverValorConfirmarBloqSeccContPerfil").on("click",function(){
		var dataParam={
			id:objBloqSeccContPerfil.id,correo:objBloqSeccContPerfil.correo,contratistaNombre:getSession("gestopusername"),
			empresaNombre:getSession("gestopcompanyname")
		};

		callAjaxPost(URL+'/contratista/bloqueo_seccion_contratista/cambiar_clave',dataParam,function(data){
			switch(data.CODE_RESPONSE){
				case "05":
					mensajeUx = "<label>La clave fue cambiada con éxito.</label>" +
					    "<br><br><label>*Se envió la contraseña al email respectivo.</label>";
					mensajesUx(mensajeUx,1,"","ActualizarBloqSeccContPerfil");

					$("#modalMensajeUxActualizarBloqSeccContPerfil").on("hidden.bs.modal",function(){
						$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
						cargarBloqueoSeccionContratistaPerfil();
					});

					break;

				default:
					alert("Ocurrió un error al intentar cambiar la clave de acceso!");
			}
		});
	});

	$("#btnRegresarPrevioConfirmarBloqSeccContPerfil").on("click",function(){
		$("#modalPrincipalBloqueoSeccionContratistaPerfil").modal("show");
	});
}

function ocultarInformacionPersonaContactoPerfilUsuContratista(){
    $("#modalEditarInfoPersonaContactoPerfCont").modal("hide");
}

function editarInformacionPersonaContactoPerfilUsuContratista(){
    $("#modalEditarInfoPersonaContactoPerfCont").remove();

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",label:"<label style='color:blue;font-size:18px;'>*** PERSONA DE CONTACTO ***</label>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre",inputForm:"<input id='inputPersonaContactoPerfCont' class='form-control' type='text'>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Correo",inputForm:"<input id='inputPersonaContactoCorreoPerfCont' class='form-control' type='text'>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",label:"<label style='color:blue;font-size:18px;'>*** PERSONA DE CONTACTO EXTRA ***</label>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Nombre",inputForm:"<input id='inputPersonaContactoExtraPerfCont' class='form-control' type='text'>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Correo",inputForm:"<input id='inputPersonaContactoExtraCorreoPerfCont' class='form-control' type='text'>"},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	{sugerencia:"",anchoLabel:"",anchoDiv:"",
	 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarInformacionPersonaContactoPerfilUsuContratista()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	       "</button>",
         inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='guardarInformacionPersonaContactoPerfilUsuContratista()'>" +
		       "<i class='fa fa-floppy-o'></i> Guardar" +
		   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
	id:"modalEditarInfoPersonaContactoPerfCont",nombre:"<i class='fa fa-pencil-square-o'></i> Editar - persona de contacto/contacto extra",
	contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    $("#inputPersonaContactoPerfCont").val(contratistaPerfilObj.contacto);$("#inputPersonaContactoCorreoPerfCont").val(contratistaPerfilObj.contactoCorreo);
    $("#inputPersonaContactoExtraPerfCont").val(contratistaPerfilObj.contactoExtra);$("#inputPersonaContactoExtraCorreoPerfCont").val(contratistaPerfilObj.contactoExtraCorreo);
}

function guardarInformacionPersonaContactoPerfilUsuContratista(){
    var campoVacio = true;

    var contacto = $("#inputPersonaContactoPerfCont").val().trim();
    var contactoCorreo = $("#inputPersonaContactoCorreoPerfCont").val().trim();
    var contactoExtra = $("#inputPersonaContactoExtraPerfCont").val().trim();
    var contactoExtraCorreo = $("#inputPersonaContactoExtraCorreoPerfCont").val().trim();

    if(contacto.length == 0 || contactoCorreo.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar el nombre y correo de la persona de contacto.</label>";
    }else if(contactoCorreo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoCorreo)){
	campoVacio = false;mensajeUx = "<label>Debe registrar un correo válido de la persona de contacto.</label>";
    }else if(contactoExtraCorreo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoExtraCorreo)){
	campoVacio = false;mensajeUx = "<label>Debe registrar un correo válido de la persona de contacto extra.</label>";
    }

    if(campoVacio){
        var dataParam={
	    id:parseInt(getSession("contratistaGosstId")),contacto:contacto,contactoCorreo:contactoCorreo,contactoExtra:contactoExtra,
	    contactoExtraCorreo:contactoExtraCorreo
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/info_persona_contacto/save',dataParam,1,1,function(data){
	    switch(data.CODE_RESPONSE){
	        case "05":
		    $("#modalEditarInfoPersonaContactoPerfCont").modal("hide");

		    mensajeUx="<label>El registro de la información de la persona contacto/contacto extra fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarPerfUsuCont");

                    $("#modalMensajeUxActualizarPerfUsuCont").on("hidden.bs.modal",function(){
		        habilitarPerfilContratista();
                    });

                    break;

	        default:
		    alert("Ocurrió un error al guardar el registro de la información de la persona contacto/contacto extra.");
	    }
	});
    }else{
	$("#modalEditarInfoPersonaContactoPerfCont").modal("hide");
	mensajesUx(mensajeUx,2,"","ValidacionPerfUsuCont");

	$("#modalMensajeUxValidacionPerfUsuCont").on("hidden.bs.modal",function(){
	    $("#modalEditarInfoPersonaContactoPerfCont").modal("show");
	});
    }
}

var correoHabilitacionMedicaId,indexCorreoHabilitacionMedicaPerfil;
var objCorreoHabilitacionMedicaPerfil = {};
var listCorreoHabilitacionMedicaPerfil = [];

function toggleMenuOpcionCorreoHabilitacionMedicaPerfil(obj,pindex){
    objCorreoHabilitacionMedicaPerfil = listCorreoHabilitacionMedicaPerfil[pindex];
    indexCorreoHabilitacionMedicaPerfil = pindex;

    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesCorreoHabilitacionMedicaPerfil=[
    {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
     functionClick:function(data){registroCorreoHabilitacionMedicaPerfil(1)}}
];

function marcarSubOpcionCorreoHabilitacionMedicaPerfil(pindex){
    funcionalidadesCorreoHabilitacionMedicaPerfil[pindex].functionClick();
    $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function regresarVistaPrincipalCorreoHabilitacionMedicaPerfil(){
    $("#modalPrincipalCorreoHabilitacionMedicaPerfil").modal("hide");
}

function verCorreoHabilitacionMedicaPerfil(){
    $("#modalPrincipalCorreoHabilitacionMedicaPerfil").remove();

    var listModal={
        id:"modalPrincipalCorreoHabilitacionMedicaPerfil",nombre:"Correo para habilitación médica por clínica",
        contenido:"<div id='estadoPrincipalCorreoHabilitacionMedicaPerfil'></div>",btnCerrarHabilitado:0
    };

    crearModalPrincipalUsuario(listModal,function(){},true,true);

    cargarCorreoHabilitacionMedicaPerfil();
}

function cargarCorreoHabilitacionMedicaPerfil(){
    $("#estadoPrincipalCorreoHabilitacionMedicaPerfil").html("");

    var dataParam = {
		contratistaId:parseInt(getSession("contratistaGosstId"))
	};

    callAjaxPostSimpleVersionDos(1,URL+'/contratista/bloqueo_seccion_contratista',dataParam,1,1,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listPanelesPrincipal = [];
            var textTotalRegistros = "";

            listCorreoHabilitacionMedicaPerfil = data.listBloqueoSeccionContratistaPerfil;

            listCorreoHabilitacionMedicaPerfil.forEach(function(val,index){
                var btnOpcion = "",menuOpcion = "";

                menuOpcion += "<ul class='list-group listaFinalGestionGosst'>";
                    funcionalidadesCorreoHabilitacionMedicaPerfil.forEach(function(val1,index1){
                        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionCorreoHabilitacionMedicaPerfil("+index1+")'>"+val1.nombre+"</li>";
                    });
                menuOpcion += "</ul>";

                btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionCorreoHabilitacionMedicaPerfil(this,"+index+")'>" +
                                "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
                            "</a>";

                var listTotal=[
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-envelope-o'></i> Correo:",inputForm:val.correo+btnOpcion+menuOpcion},
                    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
                ];

                if(val.fechaRegistroTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Registrado el",inputForm:val.fechaRegistroTexto});
                }

                if(val.fechaActualizacionTexto.length > 0){
                    listTotal.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Actualizado el",inputForm:val.fechaActualizacionTexto});
                }

                textTotalRegistros += "<div class='eventoGeneral'>" +
                                          "<div class='eventoGeneral'>";
                listTotal.forEach(function(val){
                    textTotalRegistros += obtenerSubPanelModuloVersionDos(val);
                });
                textTotalRegistros +=     "</div>" +
                                      "</div>";
            });

            listPanelesPrincipal.push({id:"volverCorreoHabilitacionMedicaPerfil",clase:"",styleAux:"",buttonAd:"",
                btnOnclickAux:"regresarVistaPrincipalCorreoHabilitacionMedicaPerfil()",btnIconoAux:"fa-sign-out fa-rotate-180",
                btnTitleAux:"Volver a la vista principal",nombre:"Regresar a la vista principal",contenido:""});

            if(listCorreoHabilitacionMedicaPerfil.length == 0){
                listPanelesPrincipal.push({id:"nuevoCorreoHabilitacionMedicaPerfil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroCorreoHabilitacionMedicaPerfil(0)",
					btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro",nombre:"Registrar correo",contenido:""});
            }else{
                listPanelesPrincipal.push({id:"registroCorreoHabilitacionMedicaPerfil",clase:"",styleAux:"",buttonAd:"",
                    btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"Correo registrado",contenido:textTotalRegistros});
            }

            agregarPanelesDivPrincipalModalVersionTres(listPanelesPrincipal,"estadoPrincipalCorreoHabilitacionMedicaPerfil");

            $("#estadoPrincipalCorreoHabilitacionMedicaPerfil").find(".listaFinalGestionGosst,.contenidoFormVisible").hide();
        }else{
            alert("Ocurrió un error al consultar el correo.");
        }
    });
}

function ocultarRegistroCorreoHabilitacionMedicaPerfil(){
    $("#modalRegistroCorreoHabilitacionMedicaPerfil").modal("hide");$("#modalPrincipalCorreoHabilitacionMedicaPerfil").modal("show");
}

function registroCorreoHabilitacionMedicaPerfil(opcRegistro){
    var opcionRegistro = parseInt(opcRegistro);

    $("#modalPrincipalCorreoHabilitacionMedicaPerfil").modal("hide");$("#modalRegistroCorreoHabilitacionMedicaPerfil").remove();

    correoHabilitacionMedicaId = (opcionRegistro == 0?0:objCorreoHabilitacionMedicaPerfil.id);

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Correo",
         inputForm:"<input id='inputCorreoHabilitacionMedicaPerfil' class='form-control' type='text' maxlength='300'>"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarRegistroCorreoHabilitacionMedicaPerfil()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' onclick='guardarRegistroCorreoHabilitacionMedicaPerfil()'>" +
                       "<i class='fa fa-floppy-o'></i> Guardar" +
                   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalRegistroCorreoHabilitacionMedicaPerfil",nombre:"<i class='fa fa-pencil-square-o'></i> Registro correo",
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);

    if(opcionRegistro == 1){
        $("#inputCorreoHabilitacionMedicaPerfil").val(objCorreoHabilitacionMedicaPerfil.correo);
    }
}

function guardarRegistroCorreoHabilitacionMedicaPerfil(){
    var campoVacio = true;

    var correo = $("#inputCorreoHabilitacionMedicaPerfil").val().trim();

    if(correo.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar el campo correo.</label>";
    }else if(correo.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
        campoVacio = false;mensajeUx = "<label>Debe registrar un correo válido.</label>";
    }

    if(campoVacio){
        var dataParam={
            id:correoHabilitacionMedicaId,correo:correo,contratistaId:parseInt(getSession("contratistaGosstId"))
        };

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/bloqueo_seccion_contratista/simple/save',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalRegistroCorreoHabilitacionMedicaPerfil").modal("hide");

                    mensajeUx = "<label>El registro correo fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarCorreoHabilitacionMedicaPerfil");

                    $("#modalMensajeUxActualizarCorreoHabilitacionMedicaPerfil").on("hidden.bs.modal",function(){
                        $("#modalPrincipalCorreoHabilitacionMedicaPerfil").modal("show");
                        cargarCorreoHabilitacionMedicaPerfil();
                    });

                    break;

                default:
                    alert("Ocurrió un error al guardar el registro correo.");
            }
        });
    }else{
        $("#modalRegistroCorreoHabilitacionMedicaPerfil").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionCorreoHabilitacionMedicaPerfil");

        $("#modalMensajeUxValidacionCorreoHabilitacionMedicaPerfil").on("hidden.bs.modal",function(){
            $("#modalRegistroCorreoHabilitacionMedicaPerfil").modal("show");
        });
    }
}
