var excepcionProcSegId,excepcionProcSegObj;
var banderaEdicionExcepcion=false;
var listFullTrabajadores;
var mensajeUx;
var listFullExcepciones=[];
var listTipoExcepcion=[
    {id:0, nombre:"Exonerar trabajador"},
    {id:1, nombre:"Agregar trabajador"}
                       ]

$(function(){
    $("#btnNuevoExcepcion").attr("onclick","javascript:nuevoExcepcionProcSeg();");
    $("#btnSmartUploadExcepcion").attr("onclick","javascript:cargarModalSmartUploadExcepcionProcSeg();");
    $("#btnCancelarExcepcion").attr("onclick","javascript:cancelarExcepcionProcSeg();");
    $("#btnGuardarExcepcion").attr("onclick","javascript:guardarExcepcionProcSeg();");
    $("#btnEliminarExcepcion").attr("onclick","javascript:eliminarExcepcionProcSeg();");
})

function ocultarModalExcepcionesProcSeg(){
    $("#modalExcepcionesProcSeg").modal("hide");
}

function mostrarModalExcepcionesProcSeg(){
    $("#modalExcepcionesProcSeg").modal("show");
}

function cargarModalExcepcionesProcSeg(){
    $("#modalExcepcionesProcSeg").modal("show");
    
    $("#btnNuevoExcepcion").show();
    $("#btnSmartUploadExcepcion").show();
    $("#btnCancelarExcepcion").hide();
    $("#btnGuardarExcepcion").hide();
    $("#btnEliminarExcepcion").hide();
    
    listFullTrabajadores=[];
    
    var dataParam = {
	    empresaId : getSession("gestopcompanyid"),
	    procedimientoSeguridadId : procedimientoSeguridadId
    };
    
    callAjaxPost(URL+"/procedimientoseguridad/excepcion/trabajadores",dataParam,function(data){
	var listTrabajadoresAux = data.list;
	
	listTrabajadoresAux.forEach(function(val){
	    listFullTrabajadores.push(
		{id:val.trabajadorId, nombre:val.trabajadorNombre+" ("+val.dni+")", isTomado:val.isTomado}    
	    )
	})
    });
    
    var count = 0;
    
    callAjaxPost(URL+"/procedimientoseguridad/excepcion",{procedimientoSeguridadId:procedimientoSeguridadId},function(data){
	if(data.CODE_RESPONSE=="05"){
	    banderaEdicionExcepcion=false;
	    listFullExcepciones = data.list;
	    
	    $("#tblExcepcionProcSeg tbody tr").remove();
	    listFullExcepciones.forEach(function(val,index){
		count++;
		
		var color="";
		(val.tipoExcepcion==0 ? color="#ff7474" : color="#5dcd5d");
		
		$("#tblExcepcionProcSeg tbody").append(
			//Editar sufijo
			"<tr id='trExcepcionProcSeg"+val.idExcepcion+"' onclick='editarExcepcionProcSeg("+index+")'>" +
				"<td id='tdidexcepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+count+"</td>" +
				"<td id='tdtipo_excepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+(val.tipoExcepcion==0 ? "Exonerar" : "Agregar")+"</td>" +
				"<td id='tdtrab_excepcion"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>("+val.trabajador.dni+") "+val.trabajador.trabajadorNombre+"</td>" +
				"<td id='tdmotivo"+val.idExcepcion+"' style='vertical-align: middle; background-color:"+color+"'>"+val.motivoExcepcion+"</td>" +
			"</tr>");
	    });
	    formatoCeldaSombreableTabla(true,"tblExcepcionProcSeg");
	}else{
	    console.log("NOPNPO");
	}
	goheadfixedY("#tblExcepcionProcSeg","#divTblExcepcionProcSeg");
    });
}

function editarExcepcionProcSeg(pindex){
    
    if (!banderaEdicionExcepcion) {
    	formatoCeldaSombreableTabla(false,"tblExcepcionProcSeg");
    	excepcionProcSegId = listFullExcepciones[pindex].idExcepcion;
    	excepcionProcSegObj = listFullExcepciones[pindex];
	
	$("#trExcepcionProcSeg"+excepcionProcSegId).addClass("fila-edicion");
    	$("#trExcepcionProcSeg"+excepcionProcSegId+" td").css("vertical-align","middle");
    	
    	/* Tipo Excepcion */
    	$("#tdtipo_excepcion"+excepcionProcSegId).html(crearSelectOneMenu("selTipoExcepcion","",listTipoExcepcion,-1,"id","nombre","-Tipo de Excepción-"));
    	$("#selTipoExcepcion").val(excepcionProcSegObj.tipoExcepcion);
	
	/* Trabajadores */	
	var listTrabajadoresExcepcion = [];
	    
	listFullTrabajadores.forEach(function(val){
	    val.selected=0;
	    
	    if(parseInt(excepcionProcSegObj.trabajador.trabajadorId)==val.id){
		val.selected=1;
	    }
	    
	    if(val.isTomado==1 && val.selected==1){
		listTrabajadoresExcepcion.push(val); 
	    }else if(val.isTomado==0 && val.selected==0){
		listTrabajadoresExcepcion.push(val); 
	    }
	    
	});
    	
    	crearSelectOneMenuObligMultipleCompleto("slcTrabExcepcion", "",listTrabajadoresExcepcion,"id",
		"nombre","#tdtrab_excepcion"+excepcionProcSegId,"Trabajadores...",1);
	
    	/* Motivo de la excepcion */
    	$("#tdmotivo"+excepcionProcSegId).html("<input type='text' id='inputMotivoExcepcion' class='form-control'>");
    	$("#inputMotivoExcepcion").val(excepcionProcSegObj.motivoExcepcion);
    	
    	banderaEdicionExcepcion = true;
	$("#btnCancelarExcepcion").show();
	$("#btnNuevoExcepcion").hide();
	$("#btnSmartUploadExcepcion").hide();
	$("#btnEliminarExcepcion").show();
	$("#btnGuardarExcepcion").show();
    }
}

function nuevoExcepcionProcSeg(){
    if (!banderaEdicionExcepcion) {
    	formatoCeldaSombreableTabla(false,"tblExcepcionProcSeg");
    	excepcionProcSegObj = {idExcepcion : 0};
    	excepcionProcSegId = 0; 
	
	var listTrabajadoresExcepcion = [];
	    
	listFullTrabajadores.forEach(function(val){
	    if(val.isTomado!=1){
		listTrabajadoresExcepcion.push(val); 
	    } 
	});
	
	$("#tblExcepcionProcSeg tbody").prepend(
		"<tr  >" 
			+"<td>...</td>"
			+"<td>"+crearSelectOneMenu("selTipoExcepcion","",listTipoExcepcion,-1,"id","nombre","-Tipo de Excepción-")+"</td>"
			+"<td id='tdtrab_excepcion"+excepcionProcSegId+"' style='vertical-align:middle'>...</td>"
			+"<td><input type='text' id='inputMotivoExcepcion' class='form-control'></td>"
			//Agregar necesarios
		+ "</tr>");
	
	crearSelectOneMenuObligMultipleCompleto("slcTrabExcepcion", "",listTrabajadoresExcepcion,"id",
		"nombre","#tdtrab_excepcion"+excepcionProcSegId,"Trabajadores...",1);
	
	$("#slcTrabExcepcion_chosen").css("width","100%");
	
	$("#btnCancelarExcepcion").show();
	$("#btnNuevoExcepcion").hide();
	$("#btnSmartUploadExcepcion").hide();
	$("#btnEliminarExcepcion").hide();
	$("#btnGuardarExcepcion").show();
	banderaEdicionExcepcion = true;
    } else {
    	$("#modalExcepcionesProcSeg").modal("hide");
	mensajeUx="<label>Guarde primero.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesProcSeg()","ExcepcionProcSeg");
    }
}

function cancelarExcepcionProcSeg(){
    cargarModalExcepcionesProcSeg();
}

function eliminarExcepcionProcSeg(){
    $("#modalExcepcionesProcSeg").modal("hide");
    
    mensajeUx="<label>¿Está seguro de eliminar la Excepción?</label>";
    mensajesUx(mensajeUx,3,"","ExcepcionProcSeg");
    
    $("#btnRegresarPrevioExcepcionProcSeg").on("click",function(){
	ocultarMensajesUx();
	$("#modalExcepcionesProcSeg").modal("show");
    })
    
    $("#btnDevolverValorExcepcionProcSeg").on("click",function(){
	var dataParam = {
		idExcepcion : excepcionProcSegId
	};
	
	callAjaxPost(URL+"/procedimientoseguridad/excepcion/delete",dataParam,
		function(data){
    	    		switch(data.CODE_RESPONSE){
    	    		case "05":
    	    		    $("#modalExcepcionesProcSeg").modal("hide");
    	    		    mensajeUx="<label>Se ha eliminado correctamente la Excepción.</label>";
    	    		    mensajesUx(mensajeUx,1,"ocultarMensajesUx();cargarModalExcepcionesProcSeg()","ExcepcionProcSeg"); 
    	    		    break;
    	    		default:
    	    		    $("#modalExcepcionesProcSeg").modal("hide");
    	    		    mensajeUx="<label>¡Ocurrió un error al eliminar la Excepción!</label>";
    	    		    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesProcSeg()","ExcepcionProcSeg");
    	    		}
		}
	)
    })
}

function guardarExcepcionProcSeg(){
    var campoVacio = true;
    
    var tipoExcepcion = $("#selTipoExcepcion").val();
    var trabajadorId = $("#slcTrabExcepcion").val()[0];
    	var numTrabajadoresId = $("#slcTrabExcepcion").val().length;
    var motivoExcepcionTexto = $("#inputMotivoExcepcion").val();

    (tipoExcepcion==-1 ? campoVacio=true : campoVacio=false);
    if(!campoVacio){
	(numTrabajadoresId==0 ? campoVacio=true : campoVacio=false);
	
    }    	

    if (!campoVacio) {
	var dataParam = {
		idExcepcion : excepcionProcSegId,
		procedimientoSeguridad : {procedimientoSeguridadId : procedimientoSeguridadId},
		trabajador :{ trabajadorId : trabajadorId},
		tipoExcepcion : tipoExcepcion,
		motivoExcepcion : motivoExcepcionTexto
	};
	
	callAjaxPost(URL + '/procedimientoseguridad/excepcion/save', dataParam,
		function(data) {
			switch (data.CODE_RESPONSE) {
			case "05":
			    $("#modalExcepcionesProcSeg").modal("hide");
			    mensajeUx="<label>La excepción se ha guardado correctamente.</label>";
			    mensajesUx(mensajeUx,1,"ocultarMensajesUx();cargarModalExcepcionesProcSeg()","ExcepcionProcSeg");
			    break;
			default:
			    $("#modalExcepcionesProcSeg").modal("hide");
			    mensajeUx="<label>¡Ocurrió un error al guardar le excepción!.</label>";
			    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalExcepcionesProcSeg()","ExcepcionProcSeg");
			}
	});	
	    
    }else{
	$("#modalExcepcionesProcSeg").modal("hide");
	mensajeUx="<label>Debe completar todos los campos antes de guardar la Excepción.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();mostrarModalExcepcionesProcSeg()","ExcepcionProcSeg");
    }
}

function ocultarModalSmartUploadExcepcionProcSeg(){
    $("#modalSmartUploadExcepcionProcSeg").modal("hide");
}

function cargarModalSmartUploadExcepcionProcSeg(){
    $("#modalExcepcionesProcSeg").modal("hide");
    
    var textBackup = "<a style='font-size:16px;padding-left:2px' class='efectoLink' href='"+URL+"/procedimientoseguridad/excepcion/backup?procedimientoSeguridadId="+procedimientoSeguridadId+"' target='_blank'>" +
	   		"<i class='fa fa-download'></i> Descargar" +
	   	     "</a>";
    
    var listItems = [
                     {sugerencia:"",anchoLabel:"col-sm-5",label:"<label style='font-size:16px'>Plantilla Excepciones:</label>",
                         anchoDiv:"col-sm-7",inputForm:textBackup,divContainer:"",styleAux:"margin-bottom:5px"},
                     {sugerencia:"",anchoLabel:"col-sm-5",label:"<label style='padding-top:5px;font-size:16px'>Archivo Excel a importar:</label>",
                         anchoDiv:"col-sm-7",inputForm:"",divContainer:"divExcelImportExcepciones",styleAux:"margin-bottom:0"},
                     {sugerencia:"",anchoLabel:"",label:"",anchoDiv:"",inputForm:"",divContainer:""},
                     {sugerencia:"",anchoLabel:"",label:"",styleAux:"margin-top:-12px;margin-bottom:-5px",
                         anchoDiv:"",inputForm:"<button id='btnGuardarImportExcepcion' onclick='guardarImportExcepcionProcSeg();' type='button' style='float:right; font-size:16px;' class='btn btn-success'><i class='fa fa-floppy-o'></i> Importar</button>",divContainer:""}
                    ]
                 
    var textImportExcepcion = "";
                 
    listItems.forEach(function(valx,index){
	textImportExcepcion += obtenerSubPanelModuloVersionDos(valx);
    })
                 
    var opciones={
	id:"modalSmartUploadExcepcionProcSeg",
	nombre:"Actualizar Excepciones (Import)",
	contenido:"<form id='formInfoProcSeg' class='eventoGeneral'>"+textImportExcepcion+"</form>",
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
                 
    $('#modalSmartUploadExcepcionProcSeg').on('hidden.bs.modal', function(e) {
	ocultarModalSmartUploadExcepcionProcSeg();
	cargarModalExcepcionesProcSeg();
    });
}

function guardarImportExcepcionProcSeg(){
    var campoVacio = true;
    var nombreExcel = $("#inputEviImportExcelExcepcion").val();

    (nombreExcel.length==0 ? campoVacio=true : campoVacio=false);

    if(!campoVacio){
	    guardarEvidenciaAuto(0,"fileEviImportExcelExcepcion",bitsEvidenciaActoInseguro,
		    "/procedimientoseguridad/excepcion/excel/masivo/save",function(data){
		if(data.mensaje.length > 0){
		    mensajeUx= "<label style='text-align:left;'>"+data.mensaje+"</label>";
		    mensajesUx(mensajeUx,4,"ocultarMensajesUx();ocultarModalSmartUploadExcepcionProcSeg();","ActualizarVistaModExcepciones");
		}else{
		    cargarModalExcepcionesProcSeg();
		}
	    },"id",[
	            {id:"procedimientoSeguridadId",value:procedimientoSeguridadId},
	            {id:"empresaId",value:getSession("gestopcompanyid")}
	    ]);
	
	}else{
	    mensajeUx="<label>No se ha subido ningún archivo Excel<br>para importar.</label>";
	    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalSmartUploadExcepcionProcSeg()","ExcepcionProcSeg");
	}
}