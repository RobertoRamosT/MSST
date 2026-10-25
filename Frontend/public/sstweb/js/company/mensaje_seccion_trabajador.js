var listSeccionTrabajadorMensaje = [];
var seccionTrabajadorMensajeObj = {id : 0};

function verMensajesSeccionTrabajador(){
   resizeDivWrapper("wrapperMensajeSeccionTrabajador",200)
   callAjaxPost(URL+"/empresa/mensaje_seccion_trabajador",{empresaId : getSession("gestopcompanyid")},function(data){
      listSeccionTrabajadorMensaje = data.list;
      $("#tblMensajeSeccionTrabajador tbody tr").remove();
      listSeccionTrabajadorMensaje.forEach(function(val,index){
	 $("#tblMensajeSeccionTrabajador tbody")
	    .append("<tr id='trmensectra"+val.seccionTrabajador.id+"' onclick='seleccionarMensajeSeccionTrabajadorEmpresa("+index+")'>" +
	    	       "<td>"+val.seccionTrabajador.nombre+"</td>" +
	    	       "<td>"+val.mensajeInicialBloqueo+"</td>" +
	    	       "<td>"+val.mensajeCompletarFormulario+"</td>" +
	    	    "</tr>");
      });
      formatoCeldaSombreableTabla(true,"tblMensajeSeccionTrabajador");
   });
   $("#listOpcionMensajeSeccionTrabajador li").addClass("disabled");
}

function seleccionarMensajeSeccionTrabajadorEmpresa(pindex){
   listSeccionTrabajadorMensaje.forEach(function(val,index){
      $("#trmensectra"+val.seccionTrabajador.id).removeClass("fila-edicion");
      if(index == pindex){
	 seccionTrabajadorMensajeObj = val;
	 $("#trmensectra"+val.seccionTrabajador.id).addClass("fila-edicion");
      }
   });
   $("#listOpcionMensajeSeccionTrabajador li").removeClass("disabled");
}

function verEditarMensajeSeccionTrabajadorEmpresa(){
   var textTotal="";
   var listTotal=[ 
           {sugerencia:"",label:"Sección Trabajador" +
           		"",inputForm:seccionTrabajadorMensajeObj.seccionTrabajador.nombre},
           {sugerencia:"",label:"Mensaje Inicial - Sospechoso Covid-19",
            inputForm:"<textarea class='form-control' rows='10' id='textMensajeInicialBloqueo'></textarea>"},
           {sugerencia:"",label:"Mensaje Final - Formulario completado",
            inputForm:"<textarea class='form-control' rows='10' id='textMensajeCompletarFormulario'></textarea>"},
           {sugerencia:"",label:" ",inputForm:"<button class='btn btn-success' onclick='guardarMensajeModulo()'>Guardar</button>"},
                 ];
   
   textTotal+="<div class='eventoGeneral'>";	   							
   listTotal.forEach(function(val,index){
      textTotal+=""+obtenerSubPanelModuloGeneral(val);
   });
   textTotal+="</div>";
	
   var modalOptions = {
	    id : "modalMensajeSeccionTrabajador",
	    nombre:"Editar Mensaje Sección Trabajador ",
	    contenido:textTotal
	              }
   
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   $("#textMensajeInicialBloqueo").val(seccionTrabajadorMensajeObj.mensajeInicialBloqueo);
   $("#textMensajeCompletarFormulario").val(seccionTrabajadorMensajeObj.mensajeCompletarFormulario);
}

function guardarMensajeModulo(){
   var dataParam = {
	   seccionTrabajador : seccionTrabajadorMensajeObj.seccionTrabajador,
	   mensajeInicialBloqueo : $("#textMensajeInicialBloqueo").val(),
	   mensajeCompletarFormulario : $("#textMensajeCompletarFormulario").val(),
	   empresaId : getSession("gestopcompanyid")
   	           };
   
   callAjaxPost(URL+"/empresa/mensaje_seccion_trabajador/save",dataParam,function(data){
      $("#modalMensajeSeccionTrabajador").modal("hide");
      verMensajesSeccionTrabajador();
   });
}
