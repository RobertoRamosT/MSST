var eleccionVirtualIdAux;
var eleccionVirtualIndexAux;

var marcarTodo=0;
var listFullPuestosEV = [];

function verModalFiltroAsignacion(){
    $("#modalAsignacion").modal("hide");
    $("#modalFiltroAsignacion").modal("show");
}

function ocultarModalFiltroAsignacion(){
    $("#modalFiltroAsignacion").modal("hide");
    $("#modalAsignacion").modal("show");
}

function cargarModalFiltroAsignacion(functionCallBack){
	    
    var dataParamAux={
	    companyId : getSession("gestopcompanyid")
    };
	    
    callAjaxPost(URL+'/eleccion_virtual/asignacion/filtro',dataParamAux,
	    function(data){
		var listUnidades = data.listUnidades;
		var listDivisiones = data.listDivisiones;
		var listAreas = data.listAreas;
			
		var contenido = "";
			
		var listContenido = [
		      {sugerencia:"",label:"Unidad",inputForm:"",divContainer:"divFiltroUnidad"},
		      {sugerencia:"",label:"División",inputForm:"",divContainer:"divFiltroDivision"},
		      {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroArea"},
		      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarModalFiltroAsignacion()'>" +
			  	"<i class='fa fa-times'></i>Cancelar</button>",
			  inputForm:"<button id='btnFiltrarAsignacion' class='btn btn-success' type='button'>" + 
			        "<i class='fa fa-filter'></i>Aplicar filtro</button>"}
			             ];
			
		listContenido.forEach(function(val){
		    contenido += obtenerSubPanelModuloGeneral(val); //Cuerpo del submodal filtro asignacion
		});
			
		var modalOptions = {id:"modalFiltroAsignacion",nombre:"<i class='fa fa-filter'></i> Asignación - Filtros",
				    contenido:contenido}; //Header + Cuerpo del submodal Filtro Asignacion
			
		crearModalPrincipalUsuario(modalOptions, function(){ //Creacion de todo el submodal Filtro Asignacion
		    if($("#selMulUnidadesFiltro").length > 0){
			return;
		    }
			    
		    crearSelectOneMenuObligMultipleCompleto("selMulUnidadesFiltro","",listUnidades,"matrixId",
				    "matrixNameSimple","#divFiltroUnidad","Todos");
		    crearSelectOneMenuObligMultipleCompleto("selMulDivisionesFiltro","",listDivisiones,"divisionId",
				    "divisionNormalName","#divFiltroDivision","Todos");
		    crearSelectOneMenuObligMultipleCompleto("selMulAreasFiltro","",listAreas,"areaId",
				    "areaName","#divFiltroArea","Todos");
		}, false);
			
		$("#modalFiltroAsignacion").on("hidden.bs.modal",function(e){
		    $("#modalAsignacion").modal("show"); 
		});
			
		$("#btnFiltrarAsignacion").on("click",function(){
		    $("#modalFiltoAsignacion").modal("hide");
		    verPuestosEleccionVirtual();
		});
			
		$("#modalFiltroAsignacion").modal("hide");
		
		functionCallBack();
	    }//fin function(data)
    );//fin callAjaxPost
}

function verPuestosEleccionVirtual(){
    
    $("#modalFiltroAsignacion").modal("hide");
    
    var listUnidadesId = [];
    var unidadesId = $("#selMulUnidadesFiltro").val();
    if(unidadesId != null){
	unidadesId.forEach(function(val){
	    listUnidadesId.push(parseInt(val));
	});
    }
    
    var listDivisionesId = [];
    var divisionesId = $("#selMulDivisionesFiltro").val();
    if(divisionesId != null){
	divisionesId.forEach(function(val){
	    listDivisionesId.push(parseInt(val));
	});
    }
    
    var listAreasId = [];
    var areasId = $("#selMulAreasFiltro").val();
    if(areasId != null){
	areasId.forEach(function(val){
	    listAreasId.push(parseInt(val));
	});
    }
    
    var listModal = {id:"modalAsignacion",nombre:"Asignacion",contenido:
	"<button class='btn btn-success' id='btnVolverTabla' title='Regresar a la tabla anterior.'><i class='fa fa-sign-out fa-rotate-180 fa-2x'></i></button>" +
	"<button class='btn btn-success' id='btnSaveAsignacionEleccionVirtual' style='margin-left: 5px' title='Guardar las filas marcadas con un check.'><i class='fa fa-floppy-o fa-2x'></i></button>" +
	"<button class='btn btn-success' id='btnMarcarTodo' style='margin-left: 5px' title='Marcar todas las filas con un check.'><i class='fa fa-check fa-2x'></i></button>" +
	"<button class='btn btn-success' id='btnDesmarcarTodo' style='margin-left: 5px' title='Desmarcar todas las filas con un check.'><i class='fa fa-times fa-2x'></i></button>" +
	"<button class='btn btn-success' id='btnFiltroAsignacion' style='margin-left: 5px' title='Permite filtrar los registrros según División, Área y Unidad.'><i class='fa fa-filter fa-2x'></i></button>" +
	"<h5 id='mensajeFiltro' style='visibility: hidden; display:inline-block; margin-left: 5px'><b>¡Filtro aplicado!</b><h5>" +
	"<div class='wrapper' id='wrapAsignacionEleccionVirtual'>" +
		"<table id='tblAsignacionEleccionVirtual' class='table table-striped table-bordered table-hover table-fixed'>" +
			"<thead>" +
				"<tr>" +
					"<td class='tb-acc'>Unidad</td>" +
					"<td class='tb-acc'>División</td>" +
					"<td class='tb-acc'>Área</td>" +
					"<td class='tb-acc'>Puesto de trabajo</td>" +
					"<td class='tb-acc' style='width: 120px'>Asignación</td>" +
					//
				"</tr>" +
			"</thead>" +
			"<tbody></tbody>" +
		"</table>"	
    };//fin listModal
    
    agregarModalPrincipalUsuario(listModal); //Crea el modal de Asignacion
    resizeDivWrapper("wrapAsignacionEleccionVirtual",200);
    goheadfixedY("#tblAsignacionEleccionVirtual","#wrapAsignacionEleccionVirtual");
    
    var dataParam={
	    empresaId:getSession("gestopcompanyid"),
	    idEleccionVirtual:eleccionVirtualId,
	    listUnidadesIdFiltro:(listUnidadesId.length==0?null:listUnidadesId),
	    listDivisionesIdFiltro:(listDivisionesId.length==0?null:listDivisionesId),
	    listAreasIdFiltro:(listAreasId.length==0?null:listAreasId)
    };
    
    //Condicional para que aparezca el mensaje filtro
    if(listUnidadesId.length==0 && listDivisionesId.length==0 && listAreasId ==0){
	$("#mensajeFiltro").css("visibility","hidden");
    }else{
	$("#mensajeFiltro").css("visibility","visible");
    }
    
    $("#tblAsignacionEleccionVirtual tbody tr").remove();
    
    callAjaxPost(URL+'/eleccion_virtual/asignacion/puestos',dataParam,procesarAsignacionEleccionVirtualSinTrabajadores);
    
    $("#btnSaveAsignacionEleccionVirtual").attr("onclick","guardarAsignacionEleccionVirtual()");
    $("#btnMarcarTodo").on("click",function(){
	$("#tblAsignacionEleccionVirtual input[type='checkbox']").each(function(index,elem){
	    $(elem).prop("checked",true);
	});
    });
    $("#btnDesmarcarTodo").on("click",function(){
	$("#tblAsignacionEleccionVirtual input[type='checkbox']").each(function(index,elem){
	    $(elem).prop("checked",false);
	});
    });
    $("#btnVolverTabla").on("click",function(){
	$("#modalAsignacion").modal("hide");
    });
    $("#btnFiltroAsignacion").on("click",function(){
	verModalFiltroAsignacion();
    });
 }

function procesarAsignacionEleccionVirtualSinTrabajadores(data){
    listFullPuestosEV = data.listPuestos;
    
    if(marcarTodo != 1){
	listFullPuestosEV.forEach(function(val){
	    $("#tblAsignacionEleccionVirtual tbody").append("<tr>" +
		    "<td>"+val.matrixName+"</td>" +
		    "<td>"+val.divisionName+"</td>" +
		    "<td>"+val.areaName+"</td>" +
		    "<td>"+val.positionName+"</td>" +
		    "<td><input type='checkbox' class='form-control' id='posAsignacion"+val.positionId+"' "+
		    		(val.isAsignado==1?"checked":"")+"></td>" + 
		    "</tr>")
	});
	
    }else{
	listFullPuestosEV.forEach(function(val){
	   $("#tblAsignacionEleccionVirtual tbody").append("<tr>" +
		   "<td>"+val.matrixName+"</td>" +
		   "<td>"+val.divisioName+"</td>" +
		   "<td>"+val.areaName+"</td>" +
		   "<td>"+val.positionName+"</td>" +
		   "<td><input type='checkbox' class='form-control' id='posAsignacion"+val.positionId+"'"+
		   		"checked></td>" +
		   "</tr>") 
	});
	marcarTodo=0;
    }
}

function guardarAsignacionEleccionVirtual(){
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0){
	$("#modalAsignacion").modal("hide");
	mensajeUx="<label>No es posible agregar ni editar los puestos asociados porque el evento ya ha concluído.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalFiltroAsignacion(verPuestosEleccionVirtual);","Alternativa");
    }else if(eleccionVirtualObj.numVotantes>0 && estado==1){
	$("#modalAsignacion").modal("hide");
	mensajeUx="<label>No es posible agregar ni editar los puestos asociados porque el evento ya está EN CURSO.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalFiltroAsignacion(verPuestosEleccionVirtual);","Alternativa");
    }else{
        var listGuardar = [];
        listFullPuestosEV.forEach(function(val){
    	listGuardar.push({idEleccionVirtual : eleccionVirtualId,
    	    		  positionId : val.positionId,
    	    		  isAsociado : ($("#posAsignacion"+val.positionId).prop("checked")?1:0)
    	    		  })
        });
        
        callAjaxPost(URL+"/eleccion_virtual/asignacion/puestos/save",listGuardar,function(data){
        	$(".modal").modal("hide");
        	
        	switch(data.CODE_RESPONSE){
        	case "05":
        	    cargarEleccionesVirtuales();
        	    mensajeUx="<label>Se ha guardado correctamente los Puestos Asociados a la Elección Virtual.</label>";
        	    mensajesUx(mensajeUx,1,"","AsignacionEleccionVirtual");
        	    break;
        	default:
        	    mensajeUx="<label>¡Ocurrió un error al guardar los Puestos Asociados a la Elección Virtual!</label>";
            	    mensajesUx(mensajeUx,2,"","AsignacionEleccionVirtual");
        	}
    	
        });
    }
}