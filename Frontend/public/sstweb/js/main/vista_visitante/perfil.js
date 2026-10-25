
var listTipoVisitante = [];
var listPerfilVisitante = [];
var visitanteObj;
var mensajeUx;

function habilitarPerfilVisitante(){
   var dataParam={};
    
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/info',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn= "";
 			
 	    var visitante = data.visitante;
 	    visitanteObj = visitante;
 	    listTipoVisitante = data.tipos;
 	    listPerfilVisitante = data.listPerfilVisitante;
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal="";
 		    
 	    var listTotal=[
 	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	        label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 	                 "DATOS GENERALES " +
 	              "</span>"},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",
 		label:"<i class='fa fa-check-square-o'></i> DNI",
 		inputForm:visitante.dni},
 	       {sugerencia:"",
 	        label:"<i class='fa fa-check-square-o'></i> Nombre",
 	 	inputForm:visitante.nombre},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> Primer apellido",
 	 	inputForm:visitante.apellidoPaterno},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> Segundo apellido",
 	 	inputForm:visitante.apellidoMaterno},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> Correo",
 	 	inputForm:visitante.correo},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> Perfil",
 	 	inputForm:visitante.perfil.nombre},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	 	label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 	 	         "DATOS EMPRESA " +
 	 	      "</span>"},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",
 		label:"<i class='fa fa-check-square-o'></i> Trabaja en empresa: ",
 		inputForm:visitante.empresaTrabajaNombre},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> RUC - Empresa donde trabaja",
 	 	inputForm:visitante.empresaTrabajaRuc},
 	       {sugerencia:"",
 	 	label:"<i class='fa fa-check-square-o'></i> Relación - Empresa donde brinda servicios",
 	 	inputForm:visitante.tipo.nombre}
 	    ]; 
 				
 	    textTotal+="<div class='eventoGeneral'>" +
 	     	          "<form class='eventoGeneral'>";	   					
 		
 	    listTotal.forEach(function(val,index){
 	       textTotal+=""+obtenerSubPanelModuloVersionDos(val);
 	    });
 		   
 	    textTotal+=   "</form>" +
 	     	       "</div>";
 	    
    	    var textNuevo ="";
    	     
    	    textNuevo = 
    	       "<div id='estadoMovilModificarDatosVisitante'>" +
    	          "<div class='tituloSubList'> Modificar datos actuales - Perfil " +
    	             "<button style='font-size:19px' title='Editar datos del visitante' " +
    	                     "class='btn btn-success' onclick='editarRegistroVigilante()'>"+
    	                "<i class='fa fa-pencil'></i> Editar registro" +
    	             "</button>" +
    	          "</div>" +
    	          "<div class='contenidoSubList' style='display:none'>" +
    	          "</div>" +
    	       "</div>";
    	     
    	    $(".divListPrincipal").append(textNuevo);
    	 
 	    listPanelesPrincipal.push(
               {id: "infoMovilPerfilVisitante",clase: "",
 	 	nombre: ""+"Datos del visitante ",
 	        contenido: ""+textTotal});
 			
 	    agregarPanelesDivPrincipal(listPanelesPrincipal);
 			
 	    $(".listaFinalGestionGosst").hide();
 	    $(".contenidoFormVisible").hide();
 	    break;
 	     
         default:
 	    alert("nop");
 	    break;
      }
   });
}

function editarRegistroVigilante(){
//   var selTipoVisitante = crearSelectOneMenuOblig("selTipoVisitante","",listTipoVisitante,
//		             visitanteObj.tipo.id,"id","nombre");
   
   var selPerfilVisitante = crearSelectOneMenuOblig("selPerfilVisitante","",
      listPerfilVisitante,visitanteObj.perfil.id,"id","nombre");
    
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                "DATOS GENERALES " +
             "</span>"},
      {sugerencia:"",label:"DNI",
       inputForm:"<input class='form-control' id='inputDni'>",
       divContainer:""},  
      {sugerencia:"",label:"Nombre",
       inputForm:"<input class='form-control' id='inputNombre'>",
       divContainer:""},
      {sugerencia:"",label:"Primer apellido",
       inputForm:"<input class='form-control' id='inputApellidoPaterno'>",
       divContainer:""},
      {sugerencia:"",label:"Segundo apellido",
       inputForm:"<input class='form-control' id='inputApellidoMaterno'>",
       divContainer:""},
      {sugerencia:"",label:"Correo",
       inputForm:"<input class='form-control' id='inputCorreo'>",
       divContainer:""},
      {sugerencia:"",label:"Perfil ",
       inputForm:selPerfilVisitante,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 	        "DATOS EMPRESA " +
 	     "</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Trabaja en empresa <span style='color:blue;'>(opcional)</span>",
       inputForm:"<input class='form-control' id='inputEmpresa'>",
       divContainer:""},
      {sugerencia:"",label:"RUC - Empresa donde trabaja",
       inputForm:"<input class='form-control' id='inputEmpresaRuc'>",
       divContainer:""},
      {sugerencia:"",label:"Relación - Empresa donde brinda servicios ",
       inputForm:visitanteObj.tipo.nombre,divContainer:""},
      {sugerencia:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;'>" +
           	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
           	 "</button>"} 
   ];
    
   var textFormRegistro="";
 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalEditarRegistroVisitante",
      nombre: "Registro antedecente médico - Covid-19",
      contenido: "<form id='formEditarRegistroVisitante' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},false,true);
   	
   var editarDiv = $("#formEditarRegistroVisitante");
 	
   editarDiv.find("#inputDni").val(visitanteObj.dni);
   editarDiv.find("#inputEmpresa").val(visitanteObj.empresaTrabajaNombre);
   editarDiv.find("#inputEmpresaRuc").val(visitanteObj.empresaTrabajaRuc);
   editarDiv.find("#inputNombre").val(visitanteObj.nombre);
   editarDiv.find("#inputApellidoPaterno").val(visitanteObj.apellidoPaterno);
   editarDiv.find("#inputApellidoMaterno").val(visitanteObj.apellidoMaterno);
   editarDiv.find("#inputCorreo").val(visitanteObj.correo);
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarRegistroVisitante();
   });
}

function guardarRegistroVisitante(){
   var campoVacio = true; 
    
   var dni = $("#inputDni").val();
   var nombre = $("#inputNombre").val();
   var apellidoPaterno = $("#inputApellidoPaterno").val();
   var apellidoMaterno = $("#inputApellidoMaterno").val();
   var correo = $("#inputCorreo").val();
   var empresaTrabajaNombre = $("#inputEmpresa").val();
   var tipoVisitanteId = visitanteObj.tipo.id;
   var perfilVisitanteId = parseInt($("#selPerfilVisitante").val());
   var empresaTrabajaRuc = $("#inputEmpresaRuc").val();
   var validacionDni = 1;
    
   if(nombre.length == 0 || apellidoPaterno.length == 0 || apellidoMaterno.length == 0 ||
      empresaTrabajaNombre.length == 0 || correo.length == 0){
      mensajeUx = "<label>Debe completar todos los campos obligatorios para continuar.</label>"; 
      campoVacio = false;
   }
   
   if(dni == visitanteObj.dni){
      validacionDni = 0;
   }
    
   if(campoVacio){
      var dataParam={
	 id: visitanteObj.id,
	 nombre: nombre,
	 // apellidos : apellidos,
	 apellidoPaterno: apellidoPaterno,
	 apellidoMaterno: apellidoMaterno,
	 empresaTrabajaRuc: empresaTrabajaRuc,
	 dni: dni,
	 empresaTrabajaNombre: empresaTrabajaNombre,
	 tipo: {id: tipoVisitanteId},
	 perfil: {id: perfilVisitanteId},
	 correo: correo,
	 validacionDni: validacionDni,
	 empresaId: visitanteObj.empresa.empresaId
      }
      
      callAjaxPost(URL+"/public/visitante/save",dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":  
	       $("#modalEditarRegistroVisitante").remove();
		    
	       mensajeUx="<label>Los datos del visitante fueron guardados con éxito.</label>"
	       mensajesUx(mensajeUx,1,"","ActualizarVistaVisitante");
		    
	       $("#modalMensajeUxActualizarVistaVisitante").on("hidden.bs.modal",function(){
		  habilitarPerfilVisitante();
	       });
		    
	       break;
		   
	    default:
//               alert("Ocurrió un error al guardar!");
	       $("#modalEditarRegistroVisitante").modal("hide");
	    
	       mensajeUx = (data.mensaje.length != 0?"<label>"+data.mensaje+"</label>":
		            "Ocurrió un error al guardar!!!!!!");
	       
	       mensajesUx(mensajeUx,2,"","AvisoMensajeError");
		       
	       $("#modalMensajeUxAvisoMensajeError").on("hidden.bs.modal",function(){
	          $("#modalEditarRegistroVisitante").modal("show");    
	       });
	    }
      });
   }else{
      $("#modalEditarRegistroVisitante").modal("hide");
	       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalEditarRegistroVisitante").modal("show");    
      });
   } 
}
