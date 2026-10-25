 
var actividadId,actividadObj;
var banderaEdicion3=false;
var listFullActividad;
var listTrabajadoresResponsableObjEspActividad=[];
var actividadEstado;
var actividadEstadoNombre;

$(function(){
    
	$("#btnNuevoActividad").attr("onclick", "javascript:nuevoActividad();");
	$("#btnCancelarActividad").attr("onclick", "javascript:cancelarActividad();");
	$("#btnGuardarActividad").attr("onclick", "javascript:guardarActividad();");
	$("#btnEliminarActividad").attr("onclick", "javascript:eliminarActividad();");	
})

function cargarActividades(){
    
    	var count = 0;
    	var valorResize= 160;
    	resizeDivWrapper("wrapActividad",valorResize);
    
	$("#btnCancelarActividad").hide();
	$("#btnNuevoActividad").show();
	$("#btnEliminarActividad").hide();
	$("#btnGuardarActividad").hide();
	
	callAjaxPost(URL + '/objetivo/objetivo_especifico/actividad', 
		        {objetivoEspecifico:{id:objetivoEspecificoObj.id}}, function(data){
				if(data.CODE_RESPONSE=="05"){
				    
					banderaEdicion3=false;
					listFullActividad = data.list;
					$("#tblActividad tbody tr").remove();
					
					listFullActividad.forEach(function(val,index){
					    
					    count++;
						 
					$("#tblActividad tbody").append(
						//Editar sufijo
						"<tr id='trActividad"+val.id+"' onclick='editarActividad("+index+")'>" +
							"<td id='tdid"+val.id+"'>"+count+"</td>" + 
							"<td id='tdactividaddes"+val.id+"' style='word-break: break-all;'>"+val.actividad+"</td>" +
							"<td id='tdpresupuestoact"+val.id+"'>S/."+val.presupuesto+"</td>" +
							"<td id='tdrecurso"+val.id+"' style='word-break: break-all;'>"+val.recurso+"</td>" +
							"<td id='tdfechaplanificada"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
						      //"<td id='tdhoraplanificada"+val.id+"'>"+val.horaPlanificadaTexto+"</td>" +
							"<td id='tdresponsableact"+val.id+"'>"+val.trabajador.nombre+"</td>" +
							"<td id='tdfecharealizada"+val.id+"'>"+val.fechaRealizadaTexto+"</td>" +
							"<td id='tdevidenciaActividades"+val.id+"'>"+val.evidenciaActividadNombre+"</td>" +
							"<td id='tdcomentario"+val.id+"' style='word-break: break-all;'>"+val.comentario+"</td>" +
							"<td id='tdestado"+val.id+"'>"+val.estadoImplementacionNombre+"</td>" +
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblActividad");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblActividad","#wrapActividad");
			});
}

function editarActividad(pindex) {
	if (!banderaEdicion3) {
	    	formatoCeldaSombreableTabla(false,"tblActividad");
		actividadId = listFullActividad[pindex].id;
		actividadObj = listFullActividad[pindex];
		
		$("#trActividad"+actividadId).addClass("fila-edicion");
		
		$("#tdactividaddes"+ actividadId).html("<input type='text' id='inputActividad' class='form-control'>");
		$("#inputActividad").val(actividadObj.actividad);
		
		$("#tdrecurso"+ actividadId).html("<input type='text' id='inputRecurso' class='form-control'>");
		$("#inputRecurso").val(actividadObj.recurso);
		
		$("#tdpresupuestoact"+actividadId).html("<input type='number' id='inputInversion' class='form-control' value='" +
			                                  actividadObj.presupuesto+"'>");
		
		$("#tdfechaplanificada"+actividadId).html("<input type='date' id='inputFechaPlanificada' onchange='hallarEstadoImplementacion("+actividadId+")' class='form-control'>");
		$("#inputFechaPlanificada").val(convertirFechaInput(actividadObj.fechaPlanificada));	
		
	     /* $("#tdhoraplanificada"+actividadId).html("<input type='time' id='inputHoraPlanificada' class='form-control'>");
		$("#inputHoraPlanificada").val(actividadObj.horaPlanificada); */
		
		$("#tdfecharealizada"+actividadId).html("<input type='date' id='inputFechaRealizada' onchange='hallarEstadoImplementacion("+actividadId+")' class='form-control'>");
		$("#inputFechaRealizada").val(convertirFechaInput(actividadObj.fechaRealizada));
		
		/****** Trabajador ******/
		
		$("#tdresponsableact"+actividadId).html("<input type='text' id='inputResponsableAct' class='form-control' placeholder='Responsable de la actividad'>"+
					                "<div id='divAutoCompletarTrabObjEspAct'></div>");
		
		$("#inputResponsableAct").val(actividadObj.trabajador.nombre);
		verAutoCompletarTrabObjEspAct()
		$("#selAutoTrabajadorAct").val(actividadObj.trabajador.trabajadorId);
		
		/***************************/
		
		hallarEstadoImplementacion(actividadId);
		
		$("#tdcomentario"+ actividadId).html("<input type='text' id='inputComentarioAct' class='form-control'>");
		$("#inputComentarioAct").val(actividadObj.comentario);
		
		var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaActividades"+actividadId,
			    idAux:"Acti",
			    esNuevo:false,
			    functionCall:function(){},
			    evidenciaNombre:actividadObj.evidenciaActividadNombre,
			    descargaUrl:"/objetivo/objetivo_especifico/actividad/evidencia_actividad?id="+actividadId+"",
			}
		
		crearFormEvidenciaCompleta(optionEvidencia);
		
		banderaEdicion3 = true;
		$("#btnCancelarActividad").show();
		$("#btnNuevoActividad").hide();
		$("#btnEliminarActividad").show();
		$("#btnGuardarActividad").show();
	}
} 

function nuevoActividad(){
	if (!banderaEdicion3) {
	    	formatoCeldaSombreableTabla(false,"tblActividad");
	    	actividadObj = {id : 0};
		actividadId = 0; 
		$("#tblActividad tbody:first").prepend(
			"<tr>" 
			   +"<td>...</td>"
			   +"<td><input type='text' id='inputActividad' class='form-control'></td>"
			   + "<td><input type='number' id='inputInversion' class='form-control'></td>"
			   +"<td><input type='text' id='inputRecurso' class='form-control'></td>"
			   +"<td><input type='date' id='inputFechaPlanificada' onchange='hallarEstadoImplementacion("+actividadId+")' class='form-control'></td>"
		       //  +"<td><input type='time' id='inputHoraPlanificada' onchange='hallarEstadoImplementacion("+actividadId+")' class='form-control'></td>"
			   +"<td><input type='text' id='inputResponsableAct' class='form-control' placeholder='Responsable de la actividad'>" +
			        "<div id='divAutoCompletarTrabObjEspAct'></div></td>"
		           +"<td><input type='date' id='inputFechaRealizada' onchange='hallarEstadoImplementacion("+actividadId+")' class='form-control'></td>"
		           +"<td id='tdevidenciaActividades0'></td>"
			   +"<td><input type='text' id='inputComentarioAct' class='form-control'></td>"
			   +"<td>...</td>"
                           //Agregar necesarios
		     + "</tr>");
		
		var optionEvidencia={
			    isImage: false,
			    container:"#tdevidenciaActividades"+actividadId,
			    idAux:"Acti",
			    esNuevo:true,
			    evidenciaNombre:"",
			    functionCall:function(){},
			    descargaUrl:"",
			}
			
		crearFormEvidenciaCompleta(optionEvidencia);
		
		$("#inputResponsableAct").attr("onkeyup","verAutoCompletarTrabObjEspAct()");
		
		$("#btnCancelarActividad").show();
		$("#btnNuevoActividad").hide();
		$("#btnEliminarActividad").hide();
		$("#btnGuardarActividad").show();
		banderaEdicion3 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarActividad() {
	cargarActividades();
}

function eliminarActividad() {
	var r = confirm("¿Está seguro de eliminar la actividad?");
	if (r == true) {
		var dataParam = {
				id : actividadId,
		};
		callAjaxPost(URL + '/objetivo/objetivo_especifico/actividad/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarActividades();
						break;
					default:
						alert("Ocurrió un error al eliminar la actividad.");
					}
				});
	}
}

function guardarActividad() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
    var actividad = $("#inputActividad").val();
    var presupuesto = $("#inputInversion").val();
    var recurso = $("#inputRecurso").val();
    var fechaPlanificada = convertirFechaTexto($("#inputFechaPlanificada").val());
    var horaPlanificada=$("#inputHoraPlanificada").val();
    var comentario =$("#inputComentarioAct").val();
    
    if(!$("#inputHoraPlanificada").val()){
          horaPlanificada=null;
    }
    
    var trabId = parseInt($("#selAutoTrabajadorAct").val());
    var fechaRealizada = convertirFechaTexto($("#inputFechaRealizada").val());
    
    if (campoVacio) {
        var dataParam = {
    		id : actividadId,
    		actividad: actividad,
    		presupuesto: presupuesto,
    		recurso: recurso,
    		fechaPlanificada: fechaPlanificada,
    		horaPlanificada: horaPlanificada,
    		fechaRealizada: fechaRealizada,
    		trabajador:{trabajadorId:trabId},
    		comentario: comentario,
    		estadoImplementacion: actividadEstado,
    		objetivoEspecifico: {id:objetivoEspecificoObj.id}
    	};
        
        callAjaxPost(URL + '/objetivo/objetivo_especifico/actividad/save', dataParam,
        	procesarResultadoGuardarActividad);	
    }	
}

function procesarResultadoGuardarActividad(data){
	switch (data.CODE_RESPONSE) {
	case "05":
	   guardarEvidenciaAuto(data.nuevaActividadId,"fileEviActi",bitsMega*10,
		   "/objetivo/objetivo_especifico/actividad/evidencia_actividad/save",
       function(){
	          cargarActividades();
	       });
	    
	   break;

	default:
	   alert("Ocurrió un error al guardar la evidencia!");
	}
}

function verAutoCompletarTrabObjEspAct(){
    
        var nombre = $("#inputResponsableAct").val().trim();
	if(nombre == ""){
	   nombre = null
	}
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
		      data.trabajadores.push({
			 trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
		      })
		}
		
		listTrabajadoresResponsableObjEspActividad= data.trabajadores;
		
		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajadorAct","", 
			data.trabajadores,"trabajadorId","nombre","#divAutoCompletarTrabObjEspAct","");
		
		$("#inputResponsableAct").attr("onkeyup","verAutoCompletarTrabObjEspAct()");
	});
}

function hallarEstadoImplementacion(progId){
	var fechaPlanificada=$("#inputFechaPlanificada").val();
	var fechaReal=$("#inputFechaRealizada").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
	      actividadEstado=2;
	      actividadEstadoNombre="Completado";
	}else{
	    if(fechaPlanificada!=""){
	       var dif=restaFechas(fechaHoy,fechaPlanificada)
	       
	       if(dif<0){
		  actividadEstado=3;
		  actividadEstadoNombre="Retrasado";
	       }else{
		  actividadEstado=1;
		  actividadEstadoNombre="Por implementar";
	       }	
	     }else{
		actividadEstado=1;
		actividadEstadoNombre="Por implementar";
	     }
	}
	$("#tdestado"+progId).html(actividadEstadoNombre);
	
	
} 
