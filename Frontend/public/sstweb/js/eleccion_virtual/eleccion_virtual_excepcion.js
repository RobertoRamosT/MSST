var excepcionId,excepcionObj;
var banderaEdicionEx=false;
var listFullTrabajadores;
var mensajeUx;
var listFullExcepciones = [];
var listTipoExcepcion = [
                      {id:0, nombre:"Exonerar trabajador(es)"},
                      {id:1, nombre:"Agregar trabajador(es)"}
                                  ]
//var listPosiblesVotantes = [];

$(function(){
	$("#btnNuevoExcepcion").attr("onclick", "javascript:nuevoExcepcionEV();");
	$("#btnSmartUploadExcepcion").attr("onclick", "javascript:cargarModalSmartUploadExcepcion();");
	$("#btnCancelarExcepcion").attr("onclick", "javascript:cancelarExcepcionEV();");
	$("#btnGuardarExcepcion").attr("onclick", "javascript:guardarExcepcionEV();");
	$("#btnEliminarExcepcion").attr("onclick", "javascript:eliminarExcepcionEV();");
})
/**
 * 
 */
function ocultarModalExcepciones(){
    $("#modalExcepciones").modal("hide");
}

function mostrarModalExcepciones(){
    $("#modalExcepciones").modal("show");
}

function cargarModalExcepcionesEV(){
    $("#modalExcepciones").modal("show");
    
    $("#btnNuevoExcepcion").show();
    $("#btnSmartUploadExcepcion").show();
    $("#btnCancelarExcepcion").hide();
    $("#btnGuardarExcepcion").hide();
    $("#btnEliminarExcepcion").hide();
    
    listFullTrabajadores = [];
    
    var dataParam = {
	empresaId : getSession("gestopcompanyid"),
	idEleccionVirtual : eleccionVirtualId
    };
    
    callAjaxPost(URL+"/eleccion_virtual/excepcion/trabajadores",dataParam,
	    function(data){
		var listAux = data.list;
		//listFullTrabajadores = listAux;
		
		listAux.forEach(function(val){
		    listFullTrabajadores.push(
		          {id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", isTomado:val.isTomado}
		                              )
		})
    })
    
    var count = 0;
    
    //consulta que traiga todas las excepciones
    callAjaxPost(URL+"/eleccion_virtual/excepcion",{ idEleccionVirtual : eleccionVirtualId },
	    function(data){
		if(data.CODE_RESPONSE=="05"){
		    banderaEdicionEx=false;
		    listFullExcepciones = data.list;
		    
		    $("#tblExcepcion tbody tr").remove();
		    listFullExcepciones.forEach(function(val,index){
			count++;
			
			var color="";
			(val.tipoExcepcion==0 ? color="#ff7474" : color="#5dcd5d");
			
			$("#tblExcepcion tbody").append(
				//Editar sufijo
				"<tr id='trExcepcion"+val.idExcepcion+"' onclick='editarExcepcionEV("+index+")'>" +
					"<td id='tdidexcepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+count+"</td>" +
					"<td id='tdtipo_excepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+(val.tipoExcepcion==0 ? "Exonerar" : "Agregar")+"</td>" +
					"<td id='tdtrab_excepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>("+val.trabajador.dni+") "+val.trabajador.trabajadorNombre+"</td>" +
					"<td id='tdmotivo"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+val.motivoExcepcion+"</td>" +
					"<td id='tdfecha_hora_excepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+val.fechaExcepcionTexto+" "+val.horaExcepcionTexto+"</td>" +
					//Agregar filas
					
				"</tr>");
		    });
		    formatoCeldaSombreableTabla(true,"tblExcepcion");
		    
		}else{
		    console.log("NOPNPO");
		}
		goheadfixedY("#tblExcepcion","#divTblExcepcion");
    })
}

function ocultarModalSmartUploadExcepcion(){
    $("#modalSmartUploadExcepcion").modal("hide");
}

function cargarModalSmartUploadExcepcion(){
    $("#modalExcepciones").modal("hide");
    
    var textBackup = "<a style='font-size:16px;padding-left:2px' class='efectoLink' href='"+URL+"/eleccion_virtual/excepcion/backup?idEleccionVirtual="+eleccionVirtualId+"' target='_blank'>" +
    			   "<i class='fa fa-download'></i> Descargar" +
    		     "</a>";
    
    var listItems = [
        {sugerencia:"",anchoLabel:"col-sm-5",label:"<label style='font-size:16px'>Plantilla Excepciones:</label>",
            anchoDiv:"col-sm-7",inputForm:textBackup,divContainer:"",styleAux:"margin-bottom:5px"},
        {sugerencia:"",anchoLabel:"col-sm-5",label:"<label style='padding-top:5px;font-size:16px'>Archivo Excel a importar:</label>",
            anchoDiv:"col-sm-7",inputForm:"",divContainer:"divExcelImportExcepciones",styleAux:"margin-bottom:0"},
        {sugerencia:"",anchoLabel:"",label:"",anchoDiv:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"",label:"",styleAux:"margin-top:-12px;margin-bottom:-5px",
            anchoDiv:"",inputForm:"<button id='btnGuardarImportExcepcion' onclick='guardarImportExcepcion();' type='button' style='float:right; font-size:16px;' class='btn btn-success'><i class='fa fa-floppy-o'></i> Importar</button>",divContainer:""}
                     ]
    
    var textImportExcepcion = "";
    
    listItems.forEach(function(valx,index){
	textImportExcepcion += obtenerSubPanelModuloVersionDos(valx);
    })
    
    var opciones={
	id:"modalSmartUploadExcepcion",
	nombre:"Actualizar Excepciones (Import)",
	contenido:"<form id='formInfoEleccionVirtual' class='eventoGeneral'>"+textImportExcepcion+"</form>",
	maxWidth:(userAgent==true ? null : "600px")
    }
    
    crearModalPrincipalUsuario(opciones,function(){},true,true);
    
    var opcionesImport={
	    container: "#divExcelImportExcepciones",
	    functionCall: function(){},
	    descargaUrl: "",
	    esNuevo: true,
	    idAux: "ImportExcelExcepcion",
	    evidenciaNombre: ""
    };
    crearFormEvidenciaCompleta(opcionesImport);
    
    $('#modalSmartUploadExcepcion').on('hidden.bs.modal', function(e) {
	ocultarModalSmartUploadExcepcion();
	cargarModalExcepcionesEV();
    });
}

function guardarImportExcepcion(){
    
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible importar Excepciones porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalSmartUploadExcepcion();","ExcepcionEV");
    }else if(eleccionVirtualObj.numVotantes>0 || estado==1){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible importar Excepciones porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalSmartUploadExcepcion();","ExcepcionEV");
    }else{
    
    	var campoVacio = true;
    	var nombreExcel = $("#inputEviImportExcelExcepcion").val();
    
    	(nombreExcel.length==0 ? campoVacio=true : campoVacio=false);
    
    	if(!campoVacio){
    	    guardarEvidenciaAuto(0,"fileEviImportExcelExcepcion",bitsEvidenciaActoInseguro,
    		    "/eleccion_virtual/excepcion/excel/masivo/save",function(data){
    		if(data.mensaje.length > 0){
    		    mensajeUx= "<label style='text-align:left;'>"+data.mensaje+"</label>";
    		    mensajesUx(mensajeUx,4,"ocultarMensajesUx();ocultarModalSmartUploadExcepcion();","ActualizarVistaModExcepciones");
    		}else{
    		    cargarModalExcepcionesEV();
    		}
    	    },"id",[
    	            {id:"idEleccionVirtual",value:eleccionVirtualId},
    	            {id:"empresaId",value:getSession("gestopcompanyid")}
	    ]);
	
    	}else{
    	    mensajeUx="<label>No se ha subido ningún archivo Excel<br>para importar.</label>";
    	    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalSmartUploadExcepcion()","ExcepcionEV");
    	}	
    
    }	
}

function editarExcepcionEV(pindex) {
	if (!banderaEdicionEx) {
	    	formatoCeldaSombreableTabla(false,"tblExcepcion");
		excepcionId = listFullExcepciones[pindex].idExcepcion;
		excepcionObj = listFullExcepciones[pindex];
		
		$("#trExcepcion"+excepcionId).addClass("fila-edicion");
	    	$("#trExcepcion"+excepcionId+" td").css("vertical-align","middle");
	    	
	    	/* Tipo Excepcion */
	    	$("#tdtipo_excepcion"+excepcionId).html(crearSelectOneMenu("selTipoExcepcion","",listTipoExcepcion,-1,"id","nombre","-Tipo de Excepción-"));
	    	$("#selTipoExcepcion").val(excepcionObj.tipoExcepcion);
		
		/* Trabajadores */	
		var listTrabajadoresExcepcion = [];
		    
		listFullTrabajadores.forEach(function(val){
		    val.selected=0;
		    
		    if(parseInt(excepcionObj.trabajador.trabajadorId)==val.id){
			val.selected=1;
		    }
		    
		    if(val.isTomado==1 && val.selected==1){
			listTrabajadoresExcepcion.push(val); 
		    }else if(val.isTomado==0 && val.selected==0){
			listTrabajadoresExcepcion.push(val); 
		    }
		    
		});
	    	
	    	crearSelectOneMenuObligMultipleCompleto("slcTrabExcepcion", "",listTrabajadoresExcepcion,"id",
			"nombre","#tdtrab_excepcion"+excepcionId,"Trabajadores...",1);
	    	
	    	/* Motivo de la excepcion */
	    	$("#tdmotivo"+excepcionId).html("<input type='text' id='inputMotivoExcepcion' class='form-control'>");
	    	$("#inputMotivoExcepcion").val(excepcionObj.motivoExcepcion);
		
		banderaEdicionEx = true;
		$("#btnCancelarExcepcion").show();
		$("#btnNuevoExcepcion").hide();
		$("#btnSmartUploadExcepcion").hide();
		$("#btnEliminarExcepcion").show();
		$("#btnGuardarExcepcion").show();
	}
	
} 

function nuevoExcepcionEV() {
    	//listPosiblesVotantes=[];

	if (!banderaEdicionEx) {
	    	formatoCeldaSombreableTabla(false,"tblExcepcion");
	    	excepcionObj = {idExcepcion : 0};
		excepcionId = 0; 
		
		var listTrabajadoresExcepcion = [];
		    
		listFullTrabajadores.forEach(function(val){
		    if(val.isTomado!=1){
			listTrabajadoresExcepcion.push(val); 
		    } 
		});
		
		$("#tblExcepcion tbody").prepend(
			"<tr  >" 
				+"<td>...</td>"
				+"<td>"+crearSelectOneMenu("selTipoExcepcion","",listTipoExcepcion,-1,"id","nombre","-Tipo de Excepción-")+"</td>"
				+"<td id='tdtrab_excepcion"+excepcionId+"' style='vertical-align:middle'>...</td>"
				+"<td><input type='text' id='inputMotivoExcepcion' class='form-control'></td>"
				+"<td>*Automático</td>"
				//Agregar necesarios
			+ "</tr>");
		
		crearSelectOneMenuObligMultipleCompleto("slcTrabExcepcion", "",listTrabajadoresExcepcion,"id",
			"nombre","#tdtrab_excepcion"+excepcionId,"Trabajadores...",1);
		
		$("#slcTrabExcepcion_chosen").css("width","280px");
		
		$("#btnCancelarExcepcion").show();
		$("#btnNuevoExcepcion").hide();
		$("#btnSmartUploadExcepcion").hide();
		$("#btnEliminarExcepcion").hide();
		$("#btnGuardarExcepcion").show();
		banderaEdicionEx = true;
	} else {
	    	$("#modalExcepciones").modal("hide");
		mensajeUx="<label>Guarde primero.</label>";
		mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","Excepcion");
	}
}

function cancelarExcepcionEV() {	
    cargarModalExcepcionesEV();
}

function eliminarExcepcionEV() {
    $("#modalExcepciones").modal("hide");
    
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(eleccionVirtualObj.numVotantes>0 || estado==1){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible eliminar Excepciones porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    }else if(estado==0){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible eliminar Excepciones porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    }else{
    
    	mensajeUx="<label>¿Está seguro de eliminar la Excepción?</label>";
    	mensajesUx(mensajeUx,3,"","ExcepcionEV");
    
    	$("#btnRegresarPrevioExcepcionEV").on("click",function(){
    	    ocultarMensajesUx();
    	    $("#modalExcepciones").modal("show");
    	})
    
    	$("#btnDevolverValorExcepcionEV").on("click",function(){
    	    var dataParam = {
		idExcepcion : excepcionId
    	    };
	
    	    callAjaxPost(URL+"/eleccion_virtual/excepcion/delete",dataParam,
		function(data){
    	    		switch(data.CODE_RESPONSE){
    	    		case "05":
    	    		    $("#modalExcepciones").modal("hide");
    	    		    mensajeUx="<label>Se ha eliminado correctamente la Excepción.</label>";
    	    		    mensajesUx(mensajeUx,1,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV"); 
    	    		    break;
    	    		default:
    	    		    $("#modalExcepciones").modal("hide");
    	    		    mensajeUx="<label>¡Ocurrió un error al eliminar la Excepción!</label>";
    	    		    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    	    		}
		}
    	    )
    	})
    }	
}

function guardarExcepcionEV() {
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible agregar ni editar Excepciones porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    }else if(eleccionVirtualObj.numVotantes>0 && estado==1){
	$("#modalExcepciones").modal("hide");
	mensajeUx="<label>No es posible agregar ni editar Excepciones porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    }else{
    
    	var campoVacio = true;
    
    	var tipoExcepcion = $("#selTipoExcepcion").val();
    	var trabajadorId = $("#slcTrabExcepcion").val()[0];
    		var numTrabajadoresId = $("#slcTrabExcepcion").val().length;
    	var motivoExcepcionTexto = $("#inputMotivoExcepcion").val();
    	var fechaExcepcion = obtenerFechaActual();
    	var horaExcepcion = obtenerHoraActual();
    
    	(tipoExcepcion==-1 ? campoVacio=true : campoVacio=false);
    	if(!campoVacio){
    	    (numTrabajadoresId==0 ? campoVacio=true : campoVacio=false);
    	    if(!campoVacio){
    		(motivoExcepcionTexto=="" ? campoVacio=true : campoVacio=false);
    	    }
    	}    	
    
    	if (!campoVacio) {
    	    var dataParam = {
        	idExcepcion : excepcionId,
    		eleccionVirtual : {idEleccionVirtual : eleccionVirtualId},
    		trabajador :{ trabajadorId : trabajadorId},
    		tipoExcepcion : tipoExcepcion,
    		motivoExcepcion : motivoExcepcionTexto,
    		fechaExcepcion : fechaExcepcion,
    		horaExcepcion : horaExcepcion
    	    };
    	    callAjaxPost(URL + '/eleccion_virtual/excepcion/save', dataParam,
    		function(data) {
    			switch (data.CODE_RESPONSE) {
    			case "05":
    			    $("#modalExcepciones").modal("hide");
			    mensajeUx="<label>La excepción se ha guardado correctamente.</label>";
			    mensajesUx(mensajeUx,1,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
			    break;
    			default:
    			    $("#modalExcepciones").modal("hide");
    			    mensajeUx="<label>¡Ocurrió un error al guardar le excepción!.</label>";
			    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesEV()","ExcepcionEV");
    			}
    	    });	
    	    
    	}else{
    	    $("#modalExcepciones").modal("hide");
    	    mensajeUx="<label>Debe completar todos los campos antes de guardar la Excepción.</label>";
    	    mensajesUx(mensajeUx,2,"ocultarMensajesUx();mostrarModalExcepciones()","ExcepcionEV");
    	}
    }
} 
