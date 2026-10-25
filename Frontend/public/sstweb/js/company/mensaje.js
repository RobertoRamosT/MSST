var listModulosMensaje = [];
var moduloMensajeObj = {id : 0};

function verMensajesModulos(){
   resizeDivWrapper("wrapperMensaje",200)
   callAjaxPost(URL+"/empresa/mensaje",{empresaId : getSession("gestopcompanyid")},function(data){
      listModulosMensaje = data.list;
      $("#tblMensaje tbody tr").remove();
      listModulosMensaje.forEach(function(val,index){
	 $("#tblMensaje tbody")
	    .append("<tr id='trmenem"+val.modulo.id+"' onclick='seleccionarMensajeEmpresa("+index+")'>" +
	    	       "<td>"+val.modulo.nombre+"</td>" +
	    	       "<td>"+val.nombreAux+"</td>" +
	    	       "<td>"+val.frase+"</td>" +
	    	       "<td>"+val.autor+"</td>" +
	    	    "</tr>");
      });
      formatoCeldaSombreableTabla(true,"tblMensaje");
   });
   $("#listOpcionMensaje li").addClass("disabled");
}

function seleccionarMensajeEmpresa(pindex){
   listModulosMensaje.forEach(function(val,index){
      $("#trmenem"+val.modulo.id).removeClass("fila-edicion");
      if(index == pindex){
         moduloMensajeObj = val;
	 $("#trmenem"+val.modulo.id).addClass("fila-edicion");
      }
   });
   $("#listOpcionMensaje li").removeClass("disabled");
}

function verEditarMensajeEmpresa(){
   var textTotal="";
   var listTotal=[ 
           {sugerencia:"",label:"Módulo",inputForm:moduloMensajeObj.modulo.nombre},
           {sugerencia:"",label:"Nombre Alternativo",inputForm:"<input id='inputNombreAltMensaje' class='form-control'>"},
           {sugerencia:"",label:"Frase",inputForm:"<textarea class='form-control' id='textFraseMensaje'></textarea>"},
           {sugerencia:"",label:"Autor",inputForm:"<textarea class='form-control' id='textAutorMensaje'></textarea>"}, 
           {sugerencia:"",label:" ",inputForm:"<button class='btn btn-success' onclick='guardarMensajeModulo()'>Guardar</button>"},
                 ];
   
   textTotal+="<div class='eventoGeneral'>";	   							
   listTotal.forEach(function(val,index){
      textTotal+=""+obtenerSubPanelModuloGeneral(val);
   });
   textTotal+="</div>";
	
   var modalOptions = {
	    id : "modalMensajeModulo",
	    nombre:"Evaluación ",
	    contenido:textTotal
	              }
   
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   $("#inputNombreAltMensaje").val(moduloMensajeObj.nombreAux);
   $("#textFraseMensaje").val(moduloMensajeObj.frase);
   $("#textAutorMensaje").val(moduloMensajeObj.autor);
}

function guardarMensajeModulo(){
   var dataParam = {
	   modulo : moduloMensajeObj.modulo,
	   nombreAux : $("#inputNombreAltMensaje").val(),
	   frase : $("#textFraseMensaje").val(),
	   autor : $("#textAutorMensaje").val(),
	   empresaId : getSession("gestopcompanyid")
   	           };
   callAjaxPost(URL+"/empresa/mensaje/save",dataParam,function(data){
      $("#modalMensajeModulo").modal("hide");
      verMensajesModulos();
   });
}
