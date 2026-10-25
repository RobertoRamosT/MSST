var aceptoTerminosCondiciones;
var mensajeUx;

/*Buscar ruc empresa*/
$(function(){
   $("form").hide();
   
   if(parseInt(getSession("visitanteId")) > 0 || parseInt(getSession("trabajadorContratistaId")) > 0){
      cargarInduccionesVisitante();
      verTopGosst();
   }else{
      if(getUrlParameter("empresaId")){
	 buscarEmpresaRuc();
      }else{
	 $("#formBuscarEmpresa").show().on("submit",buscarEmpresaRuc);   
      }
	 
      $("#formIngresarTipoVisitante").on("submit",verFormAcordeTipoVisitante);
      $("#formNuevoVisitante").on("submit",guardarNuevoVisitante);
   }
});

function cargarInduccionesVisitante(){
	
   $("form").remove();
   $("#tituloSaludo")
   .html("Bienvenido a la plataforma de <u>"+getSession("empresaNombre")+"</u> para Personal Externo");
   $(".seccionInduccion").remove();
   $(".divDescripcionInduccion").remove();
   $("#containerWelcome")
   .append($("<div>",{class:"seccionInduccion",
                      id:"seccionInduccionPorLlevar",
                      html:$("<div>",{class:"divTituloSeccion",
                	              html:"Inducciones por llevar<label></label>"})}))
   .append($("<div>",{class:"seccionInduccion",
                      id:"seccionInduccionCompletada",
                      html:$("<div>",{class:"divTituloSeccion",
                	              html:"Inducciones completadas<label></label>"})}));

   if(getSession("visitanteId")){
      var dataParam={
    	     id: getSession("visitanteId")
                    }
      
      callAjaxPost(URL+"/public/visitante/inducciones",dataParam,procesarInduccionesGeneral);   
   }
   
   if(getSession("trabajadorContratistaId")){
      var dataParam={
    	     id: getSession("trabajadorContratistaId")
                    }
    
      callAjaxPost(URL+"/public/trabajador_contratista/inducciones",dataParam,procesarInduccionesGeneral);   
   }
}

function procesarInduccionesGeneral(data){ 
   switch(data.CODE_RESPONSE){
      case "05": 
         listInduccionesVisitante =data.cursos;
   
         var numCompletada = 0,numPorLlevar = 0;
   
         listInduccionesVisitante.forEach(function(val,index){
            if(val.evaluacion.isAprobado == 1){
	       numCompletada++;
	       var nombreEvidencia = "<a class='efectoLink' onclick='verDetallesCursoVisitante("+index+")'>Click para subir evidencia</a>";
	       var nombreRenovar ="";
	 
	       if(val.evaluacion.evidenciaCargoNombre != ""){
	          nombreEvidencia="<strong>Evidencia</strong> "+val.evaluacion.evidenciaCargoNombre;
	          nombreRenovar = 
	    	     "<br><a class='efectoLink' onclick='verDetallesCursoVisitante("+index+")'>Click para ver detalle</a>" +
	    	     "<br><a class='efectoLink' onclick='empezarCursoVisitanteIndex("+index+")'>Click para renovar</a>";
	       }
		
	       $("#seccionInduccionCompletada").append($("<div>",
	          {class:"divCursoVisitante",
	           html:val.nombre+""+
	              "<br><strong>Nota</strong> "+pasarDecimalPorcentaje(val.evaluacion.puntajeAlcanzado)+
		      "<br>"+nombreEvidencia+""+nombreRenovar}));
            }else{
               numPorLlevar++;
               var nombrePorLlevar = "<u>Click para llevar curso</u>";
		
               $("#seccionInduccionPorLlevar").append($("<div>",
                  {class:"divCursoVisitante",
	           html:val.nombre +
		      "<br><strong>Intentos</strong> "+val.evaluacion.numIntentos+
		      "<br>"+nombrePorLlevar,
		   click: function(){verDetallesCursoVisitante(index)}}));
            }
         });
	
         $("#seccionInduccionCompletada label").html(" ("+numCompletada+")");
         $("#seccionInduccionPorLlevar label").html(" ("+numPorLlevar+")");
   
         break;
   
      default:
	 alert("nop");
	     
         break;
   } 
}

var visitanteObj = {};
var listTipoVisitante = [];
var trabajadorContratistaObj = {};

function verTopGosst(){
    $("body").prepend($("<div>",{class:"topGosst",html:"<button onclick='verMenuVisitante()'>Ver Perfil <i class='fa fa-list'></i>  </button>"}))
    $(".topGosst").append($("<div>",{ id:"menuVisitante" ,click:verMenuVisitante}));
   var menu =  $("#menuVisitante");
   menu
    .hide()
    .append($("<div>",{class:"opcionMenuVisitante",html:"<i class='fa fa-graduation-cap'></i> Inducciones",click:cargarInduccionesVisitante}))
    .append($("<div>",{class:"opcionMenuVisitante",html:"<i class='fa fa-download'></i> Descargar pase",click:descargarPaseVisitante}))

    if(getSession("visitanteId")){
	menu.append($("<div>",{class:"opcionMenuVisitante",html:"<i class='fa fa-cog'></i> Modificar datos",click:verModificarDatosVisitante}));
	var dataVisitante = {
		    id : getSession("visitanteId")
	    }
	    callAjaxPost(URL+"/public/visitante/id",dataVisitante,function(data){
		listTipoVisitante = data.tipos;
		visitanteObj = data.visitante;
	    });
    }
   if(getSession("trabajadorContratistaId")){
	menu.append($("<div>",{class:"opcionMenuVisitante",html:"<i class='fa fa-cog'></i> Ver datos",click:verDatosTrabajadorContratista}));
	var dataVisitante = {
		    id : getSession("trabajadorContratistaId")
	    }
	    callAjaxPost(URL+"/public/trabajador_contratista/id",dataVisitante,function(data){
		
		trabajadorContratistaObj = data.trabajadorContratista;
	    });
   }
    
    menu
    .append($("<div>",{class:"opcionMenuVisitante opcionCerrarSession",html:"<i class='fa fa-sign-out fa-rotate-180'></i> Cerrar sesión",click:cerrarSesionVisitante}));
    
}
function verMenuVisitante(){
    $(".topGosst button").toggleClass("topButtonActive");
    $("#menuVisitante").toggle();
}

var empresaVisitante = {};

function buscarEmpresaRuc(e){
   if(e){
      e.preventDefault();
   }
    
   var empresaRuc = $("#inputEmpresaRucBuscar").val().trim();
    
   var dataParam = {
      ruc: empresaRuc,
      codigo: (getUrlParameter("empresaId")?getUrlParameter("empresaId"):null),
      cargarLogo: 1
   };
   
   callAjaxPost(URL+"/public/consulta/ruc",dataParam,function(data){
      if(data.empresa){
	 empresaVisitante = data.empresa;
	 
	 sessionStorage.setItem("empresaNombre",data.empresa.name);
	    
	 $("form").hide();$("#formNeutral").show();
	 $("#formNeutral h2").html("<i class='fa fa-spinner fa-spin fa-fw'></i>Accediendo a plataforma de: "+data.empresa.name);
	  
	 if(data.empresa.logo != null){
	    $("#logoLoginVisitante").html("<img src='data:image/png;base64,"+data.empresa.logo+"' style='width:200px;heigth:210px'>"); 
	 }
	 
	 $("#tituloSaludo").html("Bienvenido a la plataforma de <u>"+data.empresa.name+"</u> para Personal Externo");
	    
	 listTipoVisitante = data.tiposVisitante;
	    
	 setTimeout(function(){
	    $("form").hide();
	    $("#formIngresarTipoVisitante").show();
		
	    var selTipoVisitante = crearSelectOneMenuOblig("selTipoVisitante","",listTipoVisitante,2,"id","nombre");
	    $("#divSelectTipoVisitante ").append(selTipoVisitante);
	    $("#selTipoVisitante").focus();
	    
	    if(getUrlParameter("tipoVisitanteId") != undefined){
	       $("#selTipoVisitante").val(2);
	       verFormAcordeTipoVisitante();
	    }
	 },1600);
      }else{
	    $("#msj").html("Empresa no encontrada");
	}
    });
}

function verFormAcordeTipoVisitante(e){
   if(e){
      e.preventDefault();
   }
   
   var tipoId = parseInt($("#selTipoVisitante").val());
    
   $("form").hide();
   $("#formIngresarDni").show();
    
   if(tipoId == 1){
      $("#formIngresarDni").on("submit",ingresarDniVisitante);
      $("#inputIngresarRuc").parent().hide();
      $("#inputIngresarDni").focus();
      $("#inputIngresarDni").parent().find("label").html("Ingrese su DNI ");
   }
    
   if(tipoId == 2){
      $("#formIngresarDni").on("submit",ingresarDniTrabajadorContratista);
      $("#inputIngresarRuc").focus();
      $("#inputIngresarDni").parent().find("label").html("Ingrese su DNI (solo podrá ingresar si está registrado por su supervisor) ");
      
      if(getUrlParameter("contratistaRuc") != undefined){
         $("#inputIngresarRuc").val(getUrlParameter("contratistaRuc"));
         $("#inputIngresarDni").focus();
      }
   }
}

function ingresarDniTrabajadorContratista(e){
   e.preventDefault();
    
   var dni = $("#inputIngresarDni").val().trim();
   var ruc = $("#inputIngresarRuc").val().trim();
    
   $("#msgIngresarDni").html("");
    
   if(dni.length < 8){
//    $("#msgIngresarDni").html("Documento debe ser mayor a 8 números/letras");
   }
    
   var dataParam={
	  empresaId: empresaVisitante.empresaId,
	  nroDocumento: dni,
	  contratista: {ruc: ruc}
	   	 }
   
   callAjaxPost(URL+"/public/consulta/trabajador_contratista/empresa",dataParam,function(data){
      if(!data.trabajadorContratista){
         $("#msgIngresarDni").html("No se encontró el trabajador");
      }else{
////////////autor: (AntoniTito2) Tema: validar Terminos y condiciones.   
         if(data.trabajadorContratista.aceptaTerminosCondiciones == 0){
	    habilitarTerminosCondicionesContratista();
		   
	    $("#msgIngresarDni").html("Se encontró el trabajador");
		    // aceptar terminos y condiciones
	    $('#btnDevolverValor' + parteFinalModal).attr("onclick", "cambiarDeVentana()");
	////////////Fin2 de terminos y condiciones	    
	    trabajadorContratistaObj = data.trabajadorContratista;    
	////////////autor: (AntoniTito2) Tema: validar Terminos y condiciones.   
		    // cerrar terminos y condiciones
	    $('#cerrar').attr("onclick", "noAceptoTerminos()");
	    console.log('HOLA ' +  data.trabajadorContratista.aceptaTerminosCondiciones);
	////////////Fin2 de terminos y condiciones	    
         }else{
	    trabajadorContratistaObj = data.trabajadorContratista;
		 
	    var dataParamAux={
		   trabajadorContratistaAsociado: {id :trabajadorContratistaObj.id} 
			     }
			 
	    callAjaxPost(URL+"/login/validated",dataParamAux,function(data){
	       if(data.CODE_RESPONSE =="01"){
		  console.log(data.PATH);
		  createSession("gestopusername",""+data.usuarioNombre);
		  createSession("accesoUsuarios",""+data.accesoUsuarios);
		  createSession("fechaHoyTexto",data.fechaHoyTexto);
		  createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);
		  document.location.href=(data.PATH);	    				
	       }
	    });
         }
      }
   });
}

function cambiarDeVentana(){ 
   var dni = $("#inputIngresarDni").val().trim();
   var ruc = $("#inputIngresarRuc").val().trim();
    
   aceptoTerminosCondiciones= 1;
    
   var dataParam={
          terminosCondiciones: aceptoTerminosCondiciones,
          empresaId: empresaVisitante.empresaId,
          nroDocumento: dni,
          contratista: {ruc: ruc}
	         }
    //sessionStorage.setItem("trabajadorContratistaId",data.trabajadorContratista.id);
//    sessionStorage.setItem("trabajadorContratistaId",trabajadorContratistaObj.id);
//    verTopGosst();
//    cargarInduccionesVisitante();
   ocultarMensajesUx();
    
   callAjaxPostNoLoad(URL+"/public/consulta/trabajador_contratista/empresa/aceptarTerminosCondiciones",dataParam,function(data){
      var dataParamAux={
	     trabajadorContratistaAsociado: {id: trabajadorContratistaObj.id} 
		       }
		 
      callAjaxPost(URL+"/login/validated",dataParamAux,function(data){
         if(data.CODE_RESPONSE =="01"){
	    console.log(data.PATH);
	    createSession("gestopusername",""+data.usuarioNombre);
	    createSession("accesoUsuarios",""+data.accesoUsuarios);
	    createSession("fechaHoyTexto",data.fechaHoyTexto);
	    createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);
	    document.location.href=(data.PATH);	    				
         }
      });
   });  
}


function noAceptoTerminos(){
    $("#msgIngresarDni").html("No aceptó los terminos y condiciones, vuelva a intentar.");
    aceptoTerminosCondiciones = 0;
}

////////////Fin2 de terminos y condiciones

var listPerfilVisitante=[];

function ingresarDniVisitante(e){
   e.preventDefault();
   
   var dni = $("#inputIngresarDni").val().trim();
   $("#msgIngresarDni").html("");
   
   if(dni.length < 8){
      $("#msgIngresarDni").html("Documento debe ser mayor a 8 números/letras.");
   }
   
   var dataParam={
      empresaId: empresaVisitante.empresaId,
      dni: dni
   };
   
   callAjaxPost(URL+"/public/consulta/visitante/empresa",dataParam,function(data){
      visitanteObj = data.visitante;
      listPerfilVisitante = data.listPerfilVisitante;
         
      if(!visitanteObj){
    	 var selTipoVisitante = crearSelectOneMenuOblig("selTipoVisitante","",listTipoVisitante,1,"id","nombre");
    		 //$("#divSelectTipoVisitante").append(selTipoVisitante);
    	 var selPerfilVisitante = crearSelectOneMenuOblig("selPerfilVisitante","",listPerfilVisitante,1,"id","nombre");
    	 $("#divSelectPerfilVisitante").append(selPerfilVisitante);
    	 $("#inputDni").val(dni).prop("disabled",true);
    	 $("form").hide();
    	 $("#formNeutral").show();
    	 $("#formNeutral h2").html("<i class='fa fa-spinner fa-spin fa-fw'></i> Accediendo a registro de nuevo visitante.");
    		    
    	 setTimeout(function(){
    	    $("form").hide();
    	    $("#formNuevoVisitante").show();
    	    $("#inputApellidoPaterno").focus();
    	 },1600);
      }else{
 ////////////autor: (AntoniTito2visitante) Tema: validar Terminos y condiciones.
         if(data.visitante.aceptaTerminosCondiciones == 0){
    	    habilitarTerminosCondicionesVisitante();
    	    $('#btnDevolverValor'+parteFinalModal).attr("onclick","actualizarVisitanteTerminosCondiciones()");
    	    $('#cerrar').attr("onclick","noAceptoTerminos()");
    	    console.log('Tiene que aceptar los terminos y condiciones, para entrar.');
     ////////////Fin2visitante de terminos y condiciones
         }else{
       	    visitanteObj = data.visitante;
       	    $("#msgIngresarDni").html("Se encontró el visitante.");
       	
       	    entrarVistaVisitante();
         }
      }
   });
}

////////////autor: (AntoniTito2visitante) Tema: validar Terminos y condiciones.
function actualizarVisitanteTerminosCondiciones(){
   var dni = $("#inputIngresarDni").val().trim();
	 
   aceptoTerminosCondiciones = 1;
   ocultarMensajesUx();
   entrarVistaVisitante();
	   
   var dataParam={
      empresaId: empresaVisitante.empresaId,
      dni: dni,
      aceptaTerminosCondiciones: aceptoTerminosCondiciones 
   };
	
   callAjaxPost(URL+"/public/consulta/visitante/empresa/terminosCondiciones",dataParam,function(data){});
}
////////////Fin2visitante de terminos y condiciones

function entrarVistaVisitante(){
   var dataParamAux={
      visitanteAsociado: {id :visitanteObj.id} 
   };
		 
   callAjaxPost(URL+"/login/validated",dataParamAux,function(data){
      if(data.CODE_RESPONSE == "01"){
         createSession("gestopusername",""+data.usuarioNombre);
         createSession("accesoUsuarios",""+data.accesoUsuarios);
         createSession("fechaHoyTexto",data.fechaHoyTexto);
         createSession("fechaHoyOrdenInversoTexto",data.fechaHoyOrdenInversoTexto);
         createSession("perfilVisitanteId",data.perfilVisitanteId);
	   
         document.location.href=(data.PATH);	 
      }
   }); 	  
}

function guardarUpdateNuevoVisitante(){
    var dni = $("#inputDni").val();
    var nombre = $("#inputNombre").val();
    //var apellidos = $("#inputApellido").val();
    var apellidoPaterno = $("#inputApellidoPaterno").val();
    var apellidoMaterno = $("#inputApellidoMaterno").val();
    var empresaTrabajaNombre = $("#inputEmpresa").val();
    var tipoVisitanteId = $("#selTipoVisitante").val();
    var empresaTrabajaRuc = $("#inputEmpresaRuc").val();
    
    var msgError = "";
    if(nombre.length == 0){msgError = "Nombre obligatorio" };
    if(apellidoPaterno.length == 0){msgError = "Apellidos obligatorio" };
    if(empresaTrabajaNombre.length == 0){msgError = "Empresa trabaja obligatorio" };
    
    if(msgError.length > 0){$("#msgNuevoVisitante").val(msgError); return;}
    var dataParam = {
	    id :visitanteObj.id,
	    nombre : nombre,
	   // apellidos : apellidos,
	    apellidoPaterno : apellidoPaterno,
	    apellidoMaterno : apellidoMaterno,
	    empresaTrabajaRuc : empresaTrabajaRuc,
	    dni : dni,
	    empresaTrabajaNombre : empresaTrabajaNombre,
	    tipo :{ id : tipoVisitanteId},
	    empresaId : visitanteObj.empresa.empresaId
    }
    callAjaxPost(URL+"/public/visitante/save",dataParam,function(data){
	    
		if(data.mensaje.length >0){
		    alert(data.mensaje);return;
		}else{
		    sessionStorage.setItem("visitanteId",data.nuevoId);
		}
	callAjaxPost(URL+"/public/visitante/id",{id : visitanteObj.id},function(data1){
	    visitanteObj = data1.visitante;
		verModificarDatosVisitante();
	})
	
    });
    
}


function guardarNuevoVisitante(e){
   if(e){
      e.preventDefault()
   }
		
   habilitarTerminosCondicionesVisitante();
   
   $('#btnDevolverValor' + parteFinalModal).attr("onclick", "irVentanaVisitante()");
   $('#cerrar').attr("onclick", "noAceptoTerminos()");
}

////////////autor: (AntoniTito2visitante) Tema: validar Terminos y condiciones.
function irVentanaVisitante(){
   var dni = $("#inputDni").val();
   var nombre = $("#inputNombre").val();
   //var apellidos = $("#inputApellido").val();
   var apellidoPaterno = $("#inputApellidoPaterno").val();
   var apellidoMaterno = $("#inputApellidoMaterno").val();
   var correo = $("#inputCorreo").val();
   var empresaTrabajaNombre = $("#inputEmpresa").val();
   var tipoVisitanteId = $("#selTipoVisitante").val();
   var empresaTrabajaRuc = $("#inputEmpresaRuc").val();
   var perfilVisitanteId = $("#selPerfilVisitante").val();
   
   var campoVacio = true;
    
//   var msgError = "";
//   if(nombre.length == 0){msgError = "Nombre obligatorio" };
//   if(apellidoPaterno.length == 0){msgError = "Primer Apellido obligatorio" };
//   if(apellidoMaterno.length == 0){msgError = "Segundo Apellido obligatorio" };
//   if(empresaTrabajaNombre.length == 0){msgError = "Empresa trabaja obligatorio" };
//   if(empresaTrabajaRuc.length == 0){msgError = "RUC Empresa trabaja obligatorio" };
//   if(msgError.length > 0){$("#msgNuevoVisitante").val(msgError); return;}
    
   if(nombre.length == 0 || apellidoPaterno.length == 0 || apellidoMaterno.length == 0 ||
      empresaTrabajaNombre.length == 0 || correo.length == 0){
      mensajeUx = "<label>Debe completar todos los campos obligatorios para continuar.</label>"; 
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: 0,
	 nombre: nombre,
	 //apellidos : apellidos,
	 apellidoPaterno: apellidoPaterno,
	 apellidoMaterno: apellidoMaterno,
	 empresaTrabajaRuc: empresaTrabajaRuc,
	 dni: dni,
	 empresaTrabajaNombre: empresaTrabajaNombre,
	 tipo: {id: tipoVisitanteId},
	 perfil: {id: perfilVisitanteId},
	 empresaId: empresaVisitante.empresaId,
	 correo: correo,
	 validacionDni: 1,
	 aceptaTerminosCondiciones: 1
      };
    
      callAjaxPostNoUnlock(URL+"/public/visitante/save",dataParam,function(data){		
         var dataParamAux1={
            empresaId: empresaVisitante.empresaId,
	    dni: dni
         };
       
         callAjaxPostNoUnlock(URL+"/public/consulta/visitante/empresa",dataParamAux1,function(data){		 
            visitanteObj = data.visitante;
            
            entrarVistaVisitante();
         });
      }); 
   }else{
      $("#modalMensajeUxmensajeInicialForCov").remove(); 
      mensajesUx(mensajeUx,2,"");
   }
}
////////////Fin2visitante de terminos y condiciones
var listInduccionesVisitante = [];

var cursoVisitanteObj = {};
function verDetallesCursoVisitante(pindex){
    cursoVisitanteObj = listInduccionesVisitante[pindex];
    
    $(".seccionInduccion").hide();
    var dataParam = {
	    id : cursoVisitanteObj.id
    }
    callAjaxPost(URL+"/public/curso/enlaces",dataParam,function(data){
	var containerWelcome = $("#containerWelcome");
	containerWelcome
	    .append($("<div>",{class:"seccionInduccion",id:"seccionDetalleInduccion",html:
			$("<div>",{class:"divTituloSeccion",html:"<button onclick='cargarInduccionesVisitante()' class='btn btn-success'><i class='fa fa-angle-left'></i>Volver</button> " +
					""+cursoVisitanteObj.nombre+" ("+cursoVisitanteObj.numPreguntas+" preguntas)"})
			}
	    ))
	    .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Descripción: </strong>"+cursoVisitanteObj.descripcion}) )
	    .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Vigencia: </strong>"+cursoVisitanteObj.capacitacionAsociada.vigencia.nombre}) )
	    //.append($("<div>",{class:"divDescripcionInduccion",id:"divEvidenciaInduccionCurso",html:"<strong>Enlace inducción de curso: </strong>"+""}) )
	    .append($("<div>",{class:"divDescripcionInduccion",id:"divMaterialCurso",html:"<strong>Material de curso: </strong>"+""}) )
	    ;
	if(cursoVisitanteObj.examen){
	if(cursoVisitanteObj.examen.id > 0){
	//    $("#divEvidenciaInduccionCurso").append("<br><a class='efectoLink' target='_blank' href='"+URL+"/contratista/examen/evidencia?id="+cursoVisitanteObj.examen.id+" '>Descargar evidencia</a>");    
	}   
	}
	
	 data.enlaces.forEach(function(val){
	     $("#divMaterialCurso").append("<br><a class='efectoLink' target='_blank' href='"+val.nombre+"'>Ver "+val.nombreMostrar+"</a>");
	    // containerWelcome
	    // .append($("<div>",{class:"divDescripcionInduccion",html:"<a class='efectoLink' target='_blank' href='"+val.nombre+"'>Ver "+val.nombreMostrar+"</a>"}) )
	 });
	 if(cursoVisitanteObj.evaluacion.isAprobado != 1){
	     containerWelcome
		    .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"Empezar evaluación",click:empezarCursoVisitante})     }) )   
	 }else{
	     containerWelcome
	     .append($("<div>",{class:"divDescripcionInduccion",html:"Formato de cargo : <br><a class='efectoLink' onclick='descargarCargoVisitante()'><i class='fa fa-download'></i>Descargar</a>"}) )
	     .append($("<div>",{class:"divDescripcionInduccion",html:"",id:"divContainerCargo" }) )
	     .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Nota: </strong>"+""+pasarDecimalPorcentaje(cursoVisitanteObj.evaluacion.puntajeAlcanzado)  }) )
	     .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Inicio vigencia:  </strong>"+"  "+cursoVisitanteObj.evaluacion.fechaInicioVigenciaTexto}) )
	     .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Fin vigencia:  </strong>"+"  "+cursoVisitanteObj.evaluacion.fechaFinVigenciaTexto}) )
	     
	     var optionsY=
		{container:"#divContainerCargo",
				functionCall:function(){guardarCargoEvaluacionVisitante() },
				descargaUrl:"/public/visitante/induccion/cargo?id="+cursoVisitanteObj.evaluacion.id,
				esNuevo:false,
				idAux: "CargoEvaluacion"+cursoVisitanteObj.evaluacion.id,
				evidenciaNombre:cursoVisitanteObj.evaluacion.evidenciaCargoNombre};
		crearFormEvidenciaCompleta(optionsY); 
		$("#divContainerCargo").prepend("Subir cargo firmado");
	     
	 }
	 
    })
}
function guardarCargoEvaluacionVisitante(){
	guardarEvidenciaAuto(cursoVisitanteObj.evaluacion.id,"fileEviCargoEvaluacion"+cursoVisitanteObj.evaluacion.id
			,bitsEvidenciaProcedimiento,"/public/visitante/induccion/cargo/save",
			function(){
		alert("Se guardó el documento satisfactoriamente")
		})
}
function empezarCursoVisitanteIndex(pindex){
    cursoVisitanteObj = listInduccionesVisitante[pindex];
    empezarCursoVisitante();
}
var preguntasCursoVisitante = []
function empezarCursoVisitante(){
    var dataParam = {
	    id : cursoVisitanteObj.id,
	    verImagenPregunta : 1
    }
    $(".seccionInduccion").remove();
    $(".divDescripcionInduccion").remove();
    callAjaxPost(URL+"/public/curso/preguntas",dataParam,function(data){
	var containerWelcome = $("#containerWelcome");
	preguntasCursoVisitante = data.preguntas;

	var preguntasObligadas=preguntasCursoVisitante.filter(function(val){return val.isObligatorio==1});
	var preguntasOpcionales=preguntasCursoVisitante.filter(function(val){return val.isObligatorio!=1});
	containerWelcome
	    .append($("<div>",{class:"seccionInduccion",id:"seccionDetalleInduccion",html:
			$("<div>",{class:"divTituloSeccion",html:"<button onclick='cargarInduccionesVisitante()' class='btn btn-success'><i class='fa fa-angle-left'></i>Volver</button> " +
					""+cursoVisitanteObj.nombre+" ("+cursoVisitanteObj.numPreguntas+" preguntas)"})
			}
	    ));

	shuffleTest(preguntasObligadas);
	shuffleTest(preguntasOpcionales);
	preguntasCursoVisitante = preguntasObligadas.concat(preguntasOpcionales);
	
	preguntasCursoVisitante.forEach(function(val,index){
	    /*Delete later*/
	    if(index<cursoVisitanteObj.numPreguntas){
	    val.isEvaluado = 1;
	    val.ordenExamen = index+1;
	     containerWelcome
	     .append($("<div>",{class:"divDescripcionInduccion divPreguntaCurso",html:(index+1)+". "+val.nombre+"</a>"}) );
	     val.opciones.forEach(function(val1){
		 containerWelcome
		 .append($("<div>",{class:"divDescripcionInduccion opcionGosstCss",html:"<input name='pregunta"+val.id+"' id='optionId"+val1.id+"'   type='radio'>" +
		     		"<label  >"+val1.nombre+"</label>",click:function(){marcarOpcionPregunta(val1.id)  }}) )
	     })
	    }else{
		val.isEvaluado = 0;
	    }
	 });
	 containerWelcome
	 .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"Completar evaluación",click:completarCursoVisitante})     }) )
	 
    });
}
function completarCursoVisitante(){
    preguntasCursoVisitante.forEach(function(val){
	val.opciones.forEach(function(val1){
	    val1.isCorrecto=($("#optionId"+val1.id).is(':checked')?1:0);
	})
    });
    $(".seccionInduccion").remove();
    $(".divDescripcionInduccion").remove();
    cursoVisitanteObj.evaluacion.visitanteId = getSession("visitanteId");
    cursoVisitanteObj.evaluacion.trabajadorContratistaId = getSession("trabajadorContratistaId");
    cursoVisitanteObj.preguntas = preguntasCursoVisitante;
    cursoVisitanteObj.preguntas.sort(function(a,b){
	return a.id -b.id;
    });
    callAjaxPost(URL + '/public/curso/preguntas/evaluacion', cursoVisitanteObj, function(data) {
	var containerWelcome = $("#containerWelcome");
	    containerWelcome
	    .append($("<div>",{class:"seccionInduccion",id:"seccionDetalleInduccion",html:
			$("<div>",{class:"divTituloSeccion",html:"<button onclick='cargarInduccionesVisitante()' class='btn btn-success'><i class='fa fa-angle-left'></i>Volver</button> " +
					""+cursoVisitanteObj.nombre+" ("+cursoVisitanteObj.numPreguntas+" preguntas)"})
			}
	    ));
	    if(data.list.evaluacion.isAprobado == 1){
		containerWelcome
		 .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Aprobó </strong> la inducción"}) )
	    }else{
		containerWelcome
		 .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Desaprobó </strong> la inducción"}) )
	    }
	    containerWelcome 
		 .append($("<div>",{class:"divDescripcionInduccion",html:"<strong>Nota: </strong> "+pasarDecimalPorcentaje(data.list.evaluacion.puntajeAlcanzado)  }) );

	    if(data.list.evaluacion.isAprobado == 1){
		containerWelcome
		 .append($("<div>",{class:"divDescripcionInduccion",html:"(El pase actualizado también lo encontrará en 'Perfil' en la vista principal)"}) )
		 .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"<i class='fa fa-download'></i>Descargar cargo para firmar",click:descargarCargoVisitante})
		     }))
		 .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"<i class='fa fa-download'></i>Descargar pase actualizado",click:descargarPaseVisitante})
		     }))
	    }else{
		containerWelcome
		 .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"Volver a la vista principal",click:cargarInduccionesVisitante})
		     }))
	    }
	    
	   
    })
    
}
function descargarCargoVisitante(){
    if(trabajadorContratistaObj.empresaId > 0){
	empresaVisitante.empresaId = trabajadorContratistaObj.empresaId;
    }
    window.open(URL+"/public/visitante/cargo/plantilla?companyId="
	    +(visitanteObj.empresa? visitanteObj.empresa.empresaId:empresaVisitante.empresaId),"_blank");
}
function descargarPaseVisitante(){
    if(getSession("visitanteId")){
	window.open(URL+"/public/visitante/pase?id="+getSession("visitanteId"),"_blank");
    }
    if(getSession("trabajadorContratistaId")){
	window.open(URL+"/public/trabajador_contratista/pase?id="+getSession("trabajadorContratistaId"),"_blank");
    }
    
}
function verModificarDatosVisitante(){
    $(".seccionInduccion").remove();
    $(".divDescripcionInduccion").remove();
    var containerWelcome = $("#containerWelcome");
    containerWelcome
    .append($("<div>",{class:"seccionInduccion",id:"seccionDatosVisitante",html:
    		$("<div>",{class:"divTituloSeccion",html:"Datos de visitante"  })
    		}
    ));
    $("#seccionDatosVisitante")
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>DNI: </div> <div class='col-sm-8'>"+visitanteObj.dni+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Trabaja empresa: </div> <div class='col-sm-8'>"+visitanteObj.empresaTrabajaNombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>RUC empresa : </div> <div class='col-sm-8'>"+visitanteObj.empresaTrabajaRuc+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Nombre: </div> <div class='col-sm-8'>"+visitanteObj.nombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Primer Apellido: </div> <div class='col-sm-8'>"+visitanteObj.apellidoPaterno+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Segundo Apellido: </div> <div class='col-sm-8'>"+visitanteObj.apellidoMaterno+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Relación con la empresa a la que brinda servicios: </div> <div class='col-sm-8'>"+visitanteObj.tipo.nombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"Modificar datos",click:modificarDatosVisitante})     }) )
}
function verDatosTrabajadorContratista(){
    $(".seccionInduccion").remove();
    $(".divDescripcionInduccion").remove();
    var containerWelcome = $("#containerWelcome");
    containerWelcome
    .append($("<div>",{class:"seccionInduccion",id:"seccionDatosVisitante",html:
    		$("<div>",{class:"divTituloSeccion",html:"Datos de visitante"  })
    		}
    ));
    $("#seccionDatosVisitante")
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Nombre: </div> <div class='col-sm-8'>"+trabajadorContratistaObj.nombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Apellido: </div> <div class='col-sm-8'>"+trabajadorContratistaObj.apellido+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Contratista: </div> <div class='col-sm-8'>"+trabajadorContratistaObj.contratista.nombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Tipo documento: </div> <div class='col-sm-8'>"+trabajadorContratistaObj.tipoDocumento.nombre+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>N° documento: </div> <div class='col-sm-8'>"+trabajadorContratistaObj.nroDocumento+"</div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:"<div class'col-sm-12'>Si necesita modificar un dato, comuníquese con el jefe de seguridad de su área.</div>"    }) )

}
function modificarDatosVisitante(){
    $(".seccionInduccion").remove();
    $(".divDescripcionInduccion").remove();
    var containerWelcome = $("#containerWelcome");
    containerWelcome
    .append($("<div>",{class:"seccionInduccion",id:"seccionDatosVisitante",html:
    		$("<div>",{class:"divTituloSeccion",html:"<button onclick='verModificarDatosVisitante()' class='btn btn-success'><i class='fa fa-angle-left'></i>Volver</button>Datos de visitante"  })
    		}
    ));
    var selTipoVisitante= crearSelectOneMenuOblig("selTipoVisitante","",listTipoVisitante,visitanteObj.tipo.id,"id","nombre");
    $("#seccionDatosVisitante")
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>DNI: </div> <div class='col-sm-8'> <input class='form-control' id='inputDni'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Trabaja empresa: </div> <div class='col-sm-8'> <input class='form-control' id='inputEmpresa'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>RUC empresa trabaja: </div> <div class='col-sm-8'> <input class='form-control' id='inputEmpresaRuc'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Nombre: </div> <div class='col-sm-8'> <input class='form-control' id='inputNombre'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Primer Apellido: </div> <div class='col-sm-8'> <input class='form-control' id='inputApellidoPaterno'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Segundo Apellido: </div> <div class='col-sm-8'> <input class='form-control' id='inputApellidoMaterno'> </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",html:"<div class='col-sm-4'>Relación con la empresa a la que brinda servicios: </div> <div class='col-sm-8'> "+selTipoVisitante+" </div>"}))
    .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",html:$("<button>",{class:"btn btn-success",html:"<i class='fa fa-floppy-o'></i>Guardar",click:guardarUpdateNuevoVisitante})     }) )
    $("#inputDni").val(visitanteObj.dni);
     $("#inputNombre").val(visitanteObj.nombre);
    $("#inputApellidoPaterno").val(visitanteObj.apellidoPaterno);
    $("#inputApellidoMaterno").val(visitanteObj.apellidoMaterno);
     $("#inputEmpresa").val(visitanteObj.empresaTrabajaNombre);
     $("#inputEmpresaRuc").val(visitanteObj.empresaTrabajaRuc);
}
function cerrarSesionVisitante(){
    removeAllSession();
    window.location.href = "login.html"
}
function marcarOpcionPregunta(pid){
    $("#optionId"+pid).prop("checked",true);
}