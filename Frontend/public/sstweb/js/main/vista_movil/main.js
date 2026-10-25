var usuarioMovilObj = {};
function habilitarPerfilGeneralMovil(){
    var	listPanelesPrincipalResumen=
	[
    {id:"subConfiguracion",clase:"divProyectoGeneral",
	nombre:"Configuración de cuenta  ",contenido:""} ,];
    agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);
    cargarPerfilCuenta();
}

var funcionalidadesPerfilCuenta=[ 
   {id:"opcCambContrasenia", nombre:"<i class='fa fa-cog'></i>Cambiar contraseña",functionClick:function(data){verCambiarContraseniaUsuario()}  },
   {id:"opcCambDatos", nombre:"<i class='fa fa-cog'></i>Cambiar datos",functionClick:function(data){verCambiarDatosUsuario()}  },    
]
function marcarSubOpcionPerfilCuenta(pindex){
	funcionalidadesPerfilCuenta[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaFinalGestionGosst").hide();
}
function toggleMenuOpcionPerfilCuenta(obj,pindex){
	$(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
function cargarPerfilCuenta(){
    var dataParam = {};
    callAjaxPost(URL+"/scheduler/perfil/usuario",dataParam,function(data){
	usuarioMovilObj = data.usuario;
	$("#subConfiguracion .contenidoSubList").html("");
		var textTotal="";
		var menuOpcion="<ul class='list-group listaFinalGestionGosst' >";
		funcionalidadesPerfilCuenta.forEach(function(val1,index1){
				menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionPerfilCuenta("+index1+")'>"+val1.nombre+" </li>";
		});
		menuOpcion+="</ul>";
		var btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionPerfilCuenta(this)'>" +
		"<i class='fa  fa-caret-down' aria-hidden='true'></i> Ver Opciones</a>" ;
		var listTotal=[
		               {sugerencia:"",label:"Nombre personal",inputForm:data.usuario.nombrePersonal+""+btnOpcion+menuOpcion},
		               {sugerencia:"",label:"Correo",inputForm:data.usuario.correo+""},
		               {sugerencia:"",label:"Teléfono",inputForm:data.usuario.telefono+""},
		               {sugerencia:"",label:"Contraseña",inputForm:"*******"},
		               ];
		textTotal+="<div class='eventoGeneral'>";	   			
		listTotal.forEach(function(val,index){
			textTotal+=""+obtenerSubPanelModulo(val);
		});
		textTotal+="</div>";		
		 $("#subConfiguracion .contenidoSubList").html(textTotal);		 
		 $("#subConfiguracion .contenidoSubList").show();

		$(".listaFinalGestionGosst").hide();
		$(".contenidoFormVisible").hide();
	
	
    });
}
function verCambiarContraseniaUsuario(){
    var listTotal=[
	               {sugerencia:"",label:"Actual contraseña",inputForm:"<input type='password' class='form-control' id='inputAnteriorContrasenia'>"},
	               {sugerencia:"",label:"Nueva contraseña",inputForm:"<input type='password' class='form-control' id='inputNuevaContrasenia'>"},
	               {sugerencia:"",label:"Confirmat nueva contraseña",inputForm:"<input type='password' class='form-control' id='inputConfirmarNuevaContrasenia'>"},
	               {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'><i class='fa fa-floppy-o'></i>Guardar</button>"},
	               ];
	var textTotal = "<form class='eventoGeneral'>";	   			
	listTotal.forEach(function(val,index){
		textTotal+=""+obtenerSubPanelModulo(val);
	});
	textTotal+="</form>";
	var modalOptions= { id:"modalCambiarContrasenia",nombre:"<i class='fa fa-cog'></i> Cambiar contraseña",
		contenido: ""+textTotal};
crearModalPrincipalUsuario(modalOptions,function(){},false,true);
$("#modalCambiarContrasenia form").on("submit",function(e){
   e.preventDefault();
   cambiarPassworUsuariodMovil();
});
	
}

function cambiarPassworUsuariodMovil() {
	var psw1 = $("#inputAnteriorContrasenia").val();
	var psw2 = $("#inputNuevaContrasenia").val();
	var psw3 = $("#inputConfirmarNuevaContrasenia").val();
	var band = true;
	
	if(psw3.length == 0 || psw2.length == 0 || psw1.length == 0){
		band = false;
	}
	
	if(band){
		var dataParam = {
				psw1 : psw1.trim(),
				psw2 : psw2.trim(),
				psw3 : psw3.trim()
			};

			callAjaxPost(URL + '/login/password/save', dataParam,
				procesarCambiarContraseniaMovil);	
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarCambiarContraseniaMovil(data){
	switch (data.CODE_RESPONSE) {
	case "02":
		alert("El password actual es incorrecto.!");
		break;
	case "03":
		alert("El password se ha bloqueado por demasiados intentos fallidos.!");
		break;
	case "05":
		alert("El password se guardo correctamente.!");
		$("#modalCambiarContrasenia").modal("hide");
		break;
	case "17":
		alert("La confirmacion del nuevo password es incorrecta.!");
		break;
	default:
		alert("Ocurrió un error al guardar el trabajador!");
	}
}
function verCambiarDatosUsuario(){
    var listTotal=[
	               {sugerencia:"",label:"Nombre personal",inputForm:"<input class='form-control' id='inputNombrePersonalUsuarioMovil'>"},
	               {sugerencia:"",label:"Teléfono",inputForm:"<input class='form-control' id='inputTelefonoUsuarioMovil'>"},
	               {sugerencia:"",label:"Correo",inputForm:"<input class='form-control' id='inputCorreoUsuarioMovil'>"},
	               {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'><i class='fa fa-floppy-o'></i>Guardar</button>"},
	               ];
	var textTotal = "<form class='eventoGeneral'>";	   			
	listTotal.forEach(function(val,index){
		textTotal+=""+obtenerSubPanelModulo(val);
	});
	textTotal+="</form>";
	var modalOptions= { id:"modalCambiarDatos",nombre:"<i class='fa fa-cog'></i> Cambiar datos",
		contenido: ""+textTotal};
crearModalPrincipalUsuario(modalOptions,function(){},false,true);
$("#inputNombrePersonalUsuarioMovil").val(usuarioMovilObj.nombrePersonal);
$("#inputTelefonoUsuarioMovil").val(usuarioMovilObj.telefono);
$("#inputCorreoUsuarioMovil").val(usuarioMovilObj.correo);

$("#modalCambiarDatos form").on("submit",function(e){
   e.preventDefault();
   cambiarDatosUsuarioMovil();
});
}
function cambiarDatosUsuarioMovil(){
    var nombrePersonal=$("#inputNombrePersonalUsuarioMovil").val();
    var telefono=$("#inputTelefonoUsuarioMovil").val();
    var correo= $("#inputCorreoUsuarioMovil").val();
    
    var dataParam ={
	    correo : correo,
	    telefono : telefono,
	    nombrePersonal : nombrePersonal
    }
    callAjaxPost(URL + '/scheduler/usuario/datos/save', dataParam,
		procesarCambiarDatosUsuarioMovil);
}
function procesarCambiarDatosUsuarioMovil(data){
    alert("Datos actualizados");
    $("#modalCambiarDatos").modal("hide");
    cargarPerfilCuenta();
}