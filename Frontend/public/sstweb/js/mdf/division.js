var divisionIdEdicion;
var nombreDivisionEdicion;
var listFullDivTrabajadores;
var listaFullDivisiones;
var numMacroprocesosDivi;

var divisionObj;

function listarDivisiones(matrixId) {
	banderaEdicion = false;
	deshabilitarBotonesEdicion();
	$("#btnDetalle").hide();
	$("#btnNuevos").hide();
	$("#btnAsociadoMdf").hide();
	$("#btnAsociarNuevaDivision").hide();
	$("#btnNuevo").attr("onclick", "nuevaDivision()");
	$("#btnCancelar").attr("onclick", "cancelarDivision()");
	$("#btnGuardar").attr("onclick","guardarDivision()");
	$("#btnEliminar").attr("onclick","eliminarDivision()");
	$("#btnPreview").show();
	$("#btnDescargar").hide();
	$("#btnInformeAnual").hide();
	$("#btnAsignarResp").hide();
	$("#btnTransferPuesto").hide();
	
   if([154,714].includes(parseInt(getSession("gestopcompanyid")))){
      $("#btnAsociarMacroprocesoDivision").show();  
   }else{
      $("#btnAsociarMacroprocesoDivision").hide(); 
   }
	 
	divisionIdEdicion = 0;

   var dataParam={
      matrixId:matrixId,companyId:parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/division',dataParam,procesarListarDivisiones);
}

function procesarListarDivisiones(data) {
   switch(data.CODE_RESPONSE) {
      case "05":
         var list = data.list; 
	 listaFullDivisiones = list;numMacroprocesosDivi = data.listMacroprocesos.length;
	 
		$("#tblMatrices tbody tr").remove();
		$("#thMatriz").html(""+getSession("gestopdivision"));
		$("#h2Titulo")
				.html(
						"<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("+nombreMatrizEdicion+")</a>  > "+getSession("gestopdivision"));

		for (index = 0; index < list.length; index++) {
			$("#tblMatrices tbody").append( 
					"<tr id='trm" + list[index].divisionId + "' onclick='javascript:editarDivision("+list[index].divisionId+","+index+")' >"
							+ "<td id='tdm" + list[index].divisionId + "'>"

								+"<div class='row'>" + 
									"<div class='col-md-3' id='div" + list[index].divisionId + "'>"
										+ list[index].divisionName +
									"</div>" 
								+"</div>"
								+"<div class='row' id='trabInterDiv"+list[index].divisionId +"'>" + 
									"<div class='col-md-3'>"
										+"Trabajadores Interesados<br> ("+ list[index].divisionTrabajadoresNombre +
									")</div>" 
								+"</div>"
							+ "</td>" + 
					"</tr>");
		}
		formatoCeldaSombreable(true);
		break;
	default:
		alert("Ocurrió un error al traer !");
	}

}

function nuevaDivision() {
	
	
	if (!banderaEdicion) {
      $("#btnAsociarMacroprocesoDivision").hide();	    
	    
	    
		formatoCeldaSombreable(false);
		$("#tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputDivision' class='form-control'   autofocus='true'></td>"
								+ "</tr>");
		divisionIdEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
	} else {
		alert("Guarde primero la division.");
	}
}

function guardarDivision() {

	var campoVacio = true;
	var nuevaEmpresa = 0;

	if ($("#inputDivision").val().length == 0) {
		campoVacio = false;
	}
	var listDivTrabs=$("#selDivisionTrab").val(); 
	var listDivTrabsFinal=[];
	if(listDivTrabs!=null)
	{
		listDivTrabs.forEach(function(val)
		{
			listDivTrabsFinal.push({trabajadorId:parseInt(val)});
		});
	}
	if (campoVacio) {

		var dataParam = {
			divisionName : $("#inputDivision").val().toUpperCase(),
			divisionId : divisionIdEdicion,
			matrixId : idMatrizEdicion,
			listTrabajadorDivision:listDivTrabsFinal
		};

		callAjaxPost(URL + '/division/save', dataParam, procesarGuardarDivision);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarDivision(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarDivisiones(idMatrizEdicion);
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function cancelarDivision() {
	// listarTareasEdicion(idMatrizEdicion);
	listarDivisiones(idMatrizEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function editarDivision(divisionId,pindex) {
   if(!banderaEdicion){
      var indexDivEdicion = 0;
      
      divisionObj = listaFullDivisiones[pindex];
      
      $("#trm"+divisionObj.divisionId).addClass("fila-edicion");
		
      listaFullDivisiones.forEach(function(val,index){
			if(val.divisionId==divisionId)
			{
				indexDivEdicion=index; 
			}
		}); 
		divisionIdEdicion = divisionId;
		formatoCeldaSombreable(false);
		var name = $("#div" + divisionId).text();
		nombreDivisionEdicion=name;
		$("#div" + divisionId)
		.html(
				"<input type='text' id='inputDivision' class='form-control'   value='"
						+ name + "'>"+"<br><div id='divtrab'><div>");
		$("#trabInterDiv"+divisionIdEdicion).remove();
		callAjaxPost(URL + '/division/trabajadores', {divisionId:divisionIdEdicion},
				function(data){
					if(data.CODE_RESPONSE=="05"){
						listFullDivTrabajadores=data.listTrabDiv; 
						var msg;
						if(listFullDivTrabajadores.length!=0)
						{
							msg="Trabajadores de "+getSession("gestopdivision"); 
							var listaDivisionTrab=listaFullDivisiones[indexDivEdicion].divisionTrabajadoresId; //Trabajadores de la Division
							var listaIdsDivisionTrab=listaDivisionTrab.split(",");
							listaIdsDivisionTrab.forEach(function (val)
							{
								listFullDivTrabajadores.forEach(function (val1){
									if(val==val1.trabajadorId)
									{
										val1.selected=1;
									}
								});
							});
							crearSelectOneMenuObligMultipleCompleto("selDivisionTrab","",
									listFullDivTrabajadores,"trabajadorId","trabajadorNombre","#divtrab",msg);	
						}
						else 
						{
							msg="Sin Trabajadores para Seleccionar ..."; 
							$("#divtrab select").remove();
							$("#divtrab div").remove();
							$("#divtrab input").remove();
							$("#divtrab").append(
									"<input class='form-control' type='text' value='"+msg+"' disabled >");
						}
					}
					else{
						console.log("NOPNPO")
					}
			}); 
		habilitarBotonesEdicion();
		$("#btnDetalle").show();
		$("#btnAsociadoMdf").show();
		$("#btnDetalle").attr("onclick","listarAreasMdf()");

		$("#btnAsociarMacroprocesoDivision").hide();

		banderaEdicion = true;
	
		areaIdEdicion=null;
		puestoIdEdicion=null;
		actividadIdEdicion=null;
		tareaIdEdicion=null;
		pasoIdreal=null;
	}

}

function eliminarDivision(){
   if(divisionObj.numMacroprocesosAsociados == 0){
      var r = confirm("¿Está seguro de eliminar la "+getSession("gestopdivision")+" seleccionada?");
	
      if(r == true){
         var dataParam={
	    divisionId:divisionIdEdicion,mdfTypeId:tipoMdfId
         };

         callAjaxPost(URL+'/division/delete',dataParam,procesarEliminarDivision);
      }
   }else{
      mensajeUx = "<label>No puede eliminarse la "+getSession("gestopdivision")+" seleccionada porque tiene " +
         divisionObj.numMacroprocesosAsociados+" macroproceso(s) asociado(s).</label>";
      mensajesUx(mensajeUx,2,"","");
   }
}

function procesarEliminarDivision(data) {
switch (data.CODE_RESPONSE) {
case "05":
	listarDivisiones(idMatrizEdicion);
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
	break;
case "08": 
	alert("No se puede eliminar, tiene "+data.areaSons.length+ getSession("gestoparea")+"   asociada(s)."); 
	break;
default:
	alert("Ocurrió un error al eliminar !");
}
}

var macroDiviId,macroDiviObj;
var banderaEdicionMacroDivi = false;
var listFullDivisiones = [],listMacroprocesos = [];

function regresarVistaAnteriorMacroprocesoDivision(){
   $("#modalMacroprocesoDivision").modal("hide");
}

function verMacroprocesoDivision(){
   if(numMacroprocesosDivi != 0){ 
      $("#modalMacroprocesoDivision").remove();
   
      var btnVolverPrincipal = "<button id='btnVolverPrincipalMacroDivi' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                                    "onclick='regresarVistaAnteriorMacroprocesoDivision()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-exchange fa-2x'></i> <i class='fa fa-list-alt'></i>" +
         "</button>";
         
      var btnVolver = "<button id='btnVolverMacroDivi' class='btn btn-success' style='margin-left:5px' " +
                           "title='Deshacer las acciones hechas en el registro.' onclick='cancelarMacroprocesoDivision()'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
         "</button>";

      var listModal={
         id:"modalMacroprocesoDivision",maxWidth:"70%",nombre:"<i class='fa fa-exchange'></i> "+getSession("gestopdivision")+" - macroproceso",
         contenido:
	     btnVolverPrincipal+btnVolver +
            "<div class='wrapper' id='wrapMacroprocesoDivi'>" +
               "<table id='tblMacroprocesoDivi' class='table table-striped table-bordered table-hover table-fixed'>" +
                  "<thead>" +
                     "<tr>" +
                        "<td class='tb-acc' style='width:200px'>"+getSession("gestopdivision")+"</td>" +
                        "<td class='tb-acc' style='width:300px'>Macroprocesos asociados</td>" +
                     "</tr>" +
                  "</thead>" +
                  "<tbody></tbody>" +
               "</table>" +
            "</div>"
      };

      crearModalPrincipalUsuario(listModal,function(){},true,true);
      resizeDivWrapper("wrapMacroprocesoDivi",210);    
      cargarMacroprocesoDivision();
   }else{
      mensajeUx = "<label>No hay macroprocesos registrados en la empresa.</label>";
      mensajesUx(mensajeUx,2,"","");
   }
}

function cargarMacroprocesoDivision(){
   $("#btnVolverPrincipalMacroDivi").show();$("#btnVolverMacroDivi").hide();

   var dataParam={
      companyId:parseInt(getSession("gestopcompanyid")),matrixId:idMatrizEdicion
   };

   callAjaxPost(URL+'/division/asociar_macroproceso',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionMacroDivi = false;
	 listFullDivisiones = data.listDivisiones;listMacroprocesos = data.listMacroprocesos;

         $("#tblMacroprocesoDivi tbody tr").remove();

         listFullDivisiones.forEach(function(val,index){
            $("#tblMacroprocesoDivi tbody").append(
               "<tr id='trMacroprocesoDivi"+val.divisionId+"' onclick='editarMacroprocesoDivision("+index+")'>" +
                  "<td id='tdDivisionMacroDivi"+val.divisionId+"'>"+val.divisionName+"</td>" +
                  "<td id='tdMacroprocesoAsocMacroDivi"+val.divisionId+"'>"+val.macroprocesosAsociadosNombre+"</td>" +
               "</tr>");
         });

         goheadfixedY("#tblMacroprocesoDivi","#wrapMacroprocesoDivi");
         formatoCeldaSombreableTabla(true,"tblMacroprocesoDivi");
      }else{
         console.log("NOPNPO");
      }
   });
}

function cancelarMacroprocesoDivision(){
   cargarMacroprocesoDivision();
}

function editarMacroprocesoDivision(pindex){
   if(!banderaEdicionMacroDivi){
      formatoCeldaSombreableTabla(false,"tblMacroprocesoDivi");

      macroDiviId = listFullDivisiones[pindex].divisionId;
      macroDiviObj = listFullDivisiones[pindex];

      $("#trMacroprocesoDivi"+macroDiviId).addClass("fila-edicion");
      
      $("#tdMacroprocesoAsocMacroDivi"+macroDiviId).addClass("linkGosst").on("click",function(){
         verMacroprocesosAsociadosDivision();
      }).html(macroDiviObj.macroprocesosAsociadosNombre+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

      banderaEdicionMacroDivi = true;

      $("#btnVolverPrincipalMacroDivi").hide();$("#btnVolverMacroDivi").show();
   }
}

function volverMacroprocesosAsociadosDivision(){
   $("#modalMacroprocesoAsociadoDivision").modal("hide");$("#modalMacroprocesoDivision").modal("show");
}

function verMacroprocesosAsociadosDivision(){
   $("#modalMacroprocesoDivision").modal("hide");$("#modalMacroprocesoAsociadoDivision").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverMacroprocesosAsociadosDivision()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarMacroprocesosAsociadosDivision()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblMacroprocesoAsocDivi\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblMacroprocesoAsocDivi\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalMacroprocesoAsociadoDivision",
      nombre:"<i class='fa fa-table'></i> Asociar macroproceso",
      contenido: 
	 "<div id='divMacroprocesoAsocDivi' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperMacroprocesoAsocDivi'>" +
            "<table id='tblMacroprocesoAsocDivi' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asociado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Macroproceso</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperMacroprocesoAsocDivi",200);
   cargarMacroprocesosAsociadosDivision();
}

function cargarMacroprocesosAsociadosDivision(){    
   $("#tblMacroprocesoAsocDivi tbody tr").remove();

   listMacroprocesos.forEach(function(val,index){   
      var isAsignado = 0;
       
      if(macroDiviObj.macroprocesosAsociadosId.length != 0){
 	 var macroprocesosAsociadosId = macroDiviObj.macroprocesosAsociadosId.split(",");
 		
 	 macroprocesosAsociadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
 	 });
      }
       
      var inputCheckAsignado = "<input id='checkAsignadoMacroprocesoAsocDivi"+val.id+"' type='checkbox' " +
         "class='form-control' "+(isAsignado == 1?"checked":"")+">";
        
      $("#tblMacroprocesoAsocDivi tbody").append(
         "<tr id='trMacroprocesoAsocDivi"+val.id+"'>" +
  	    "<td>"+inputCheckAsignado+"</td>" +
  	    "<td>"+val.nombre+"</td>" +
  	 "</tr>");
   });
      	
   goheadfixedY("#tblMacroprocesoAsocDivi","#wrapperMacroprocesoAsocDivi");
}

function guardarMacroprocesosAsociadosDivision(){
   var campoVacio = true;
   
   var listMacroprocesosAsociados = [];
   
   listMacroprocesos.forEach(function(val){
      var isAsignado = ($("#checkAsignadoMacroprocesoAsocDivi"+val.id).prop("checked")?1:0);
 	  
      if(isAsignado == 1){
	 listMacroprocesosAsociados.push({id:val.id});
      }
   });	

   if(campoVacio){
      var dataParam={
	 divisionId:macroDiviId,macroprocesosAsociados:listMacroprocesosAsociados
      };

      callAjaxPost(URL+'/division/asociar_macroproceso/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalMacroprocesoAsociadoDivision").modal("hide");
		
	       mensajeUx="<label>El registro de la asociación de macroprocesos fue actualizado con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarMacroprocesoAsocDivi");
  		
  	       $("#modalMensajeUxActualizarMacroprocesoAsocDivi").on("hidden.bs.modal",function(){
  		  $("#modalMacroprocesoDivision").modal("show");
  		  cargarMacroprocesoDivision(); 
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la asociación de macroprocesos!");
         }
      });
   }else{
       
   }	
}
