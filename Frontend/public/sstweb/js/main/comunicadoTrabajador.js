var listFullComunicado; 
var listFullTipoComunicado,listFullEmpresaContratista;
var listFullTrabajadoresComunicado;
var comunicadoId, comunicadoObj;
var mensajeUx;
var banderaEdicion=false;
$(function(){
	//Era attr no atrr
	$("#btnNuevoComunicadoTrabajador").attr("onclick","javascript: nuevoComunicadoTrabajador();");
	$("#btnCancelarComunicadoTrabajador").attr("onclick","javascript: cancelarComunicadoTrabajador();");
	$("#btnGuardarComunicadoTrabajador").attr("onclick","javascript: guardarComunicadoTrabajador();");
	$("#btnEliminarComunicadoTrabajador").attr("onclick","javascript: eliminarComunicadoTrabajador();");
	//Cuando se utiliza $(function) quiere decir que se va a realizar lo que está dentro una vez carguen todos los 
	//recursos de la página, por tanto lo de cargar comunicados no debería ir
	//insertMenu(cargarComunicado);
});


function volverComunicadoTrabajador()
{ 
	$("#divComunicadosTrabajador").show(); 
}
function cargarComunicadoTrabajador()
{
	
	$("#btnCancelarComunicadoTrabajador").hide();
	$("#btnNuevoComunicadoTrabajador").show();
	$("#btnEliminarComunicadoTrabajador").hide();
	$("#btnGuardarComunicadoTrabajador").hide();
	volverComunicadoTrabajador();
	callAjaxPost(URL + '/scheduler/comunicado', {
		empresaId : getSession("gestopcompanyid")},
		function(data) {
			if (data.CODE_RESPONSE = "05") {
				banderaEdicion = false;
				listFullComunicado = data.list;
				listFullTipoComunicado=data.listTipos;  
				$("#tblComunicadosTrabajador tbody tr").remove(); 
				listFullComunicado.forEach(function(val, index) {
					if(val.categoria.id==2)
					{
						$("#tblComunicadosTrabajador tbody").append(
								"<tr id='trcomun"+val.id+"' onclick='editarComunicadoTrabajador("+index+")'>" +
									"<td id='comuntipo"+val.id+"' style='vertical-align: middle;'>"+val.tipo.tipoComunicadoTexto+"</td>" 
									+"<td id='comunfechamens"+val.id+"' style='vertical-align: middle;'>"+val.fechaMensajeTexto+"</td>"
									+"<td id='comunhora"+val.id+"' style='vertical-align: middle;'>"+val.horaTexto+"</td>"
									+"<td id='comuncomentario"+val.id+"' style='vertical-align: middle;'>"+val.comunicado+"</td>"
									+"<td id='comunlink"+val.id+"' style='vertical-align: middle; overflow-wrap:anywhere;'>"+(val.link=="" ? "-" : val.link)+"</td>"
									+"<td id='comunevidencia"+val.id+"' style='vertical-align: middle;'>"+(val.evidenciaNombre==null ? "-" : val.evidenciaNombre)+"</td>" 
									+"<td id='comunvisto"+val.id+"' style='vertical-align: middle;'>"+"</td>"
									+"<td id='comunoculto"+val.id+"' style='vertical-align: middle;'>"+(val.isOculto==0 ? "NO" : "SI")+"</td>"
								+"</tr>");
						if(val.tipo.idTipo==1)//Aplicativo
						{
							$("#comunvisto"+val.id).append(val.numAprob+" / "+val.numTotal);
						}
						else 
						{
							$("#comunvisto"+val.id).append(val.numVisto+" / "+val.numTotal);
						}						
					}
				});
			
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblComunicadosTrabajador");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		});
}
function nuevoComunicadoTrabajador(){
	if(!banderaEdicion){
		comunicadoId=0;
		var selTipo=crearSelectOneMenuOblig("inputComunTipo","",listFullTipoComunicado,"2","idTipo","tipoComunicadoTexto")
		
		$("#tblComunicadosTrabajador tbody").prepend(
			"<tr>" 
				+"<td style='vertical-align: middle;'>"+selTipo+"</td>"
				+"<td style='vertical-align: middle;'><input type='date' id='inputComunFechaMens' class='form-control' disabled></td>"
				+"<td style='vertical-align: middle;'><input type='time' id='inputComunHora' value='0' class='form-control' disabled></td>"
				+"<td style='vertical-align: middle;'><textarea id='inputComunComent' class='form-control'></textarea></td>"
				+"<td style='vertical-align: middle;'><input type='text' id='inputLink' class='form-control'></td>"
				+"<td style='vertical-align: middle;'>*Primero debe guardar el registro</td>" 
				+"<td id='inputComunVisto' style='vertical-align: middle;'>...</td>" 
				+"<td style='vertical-align: middle;'><input type='checkbox' id='radioBotonIsOculto' class='form-control'></td>" 
			+"</tr>");
		var fechaMens=obtenerFechaActual();
		$("#inputComunFechaMens").val(fechaMens);
		var horaActual=obtenerHoraActual();
		$("#inputComunHora").val(horaActual); 
		$("#inputComunTipo").prop("disabled",true);
		 
		$("#btnCancelarComunicadoTrabajador").show();
		$("#btnNuevoComunicadoTrabajador").hide();
		$("#btnEliminarComunicadoTrabajador").hide();
		$("#btnGuardarComunicadoTrabajador").show(); 
		banderaEdicion=true;
		formatoCeldaSombreableTabla(false,"tblComunicadosTrabajador");
	}
	else{
		alert("Guarde Primero.");
	}

}
 
function editarComunicadoTrabajador(pindex){
	if(!banderaEdicion){
		formatoCeldaSombreableTabla(false,"tblComunicadosTrabajador");
		comunicadoId=listFullComunicado[pindex].id;
		comunicadoObj=listFullComunicado[pindex];
		var tipo=comunicadoObj.tipo.idTipo;
		var selTipo=crearSelectOneMenuOblig("inputComunTipo","tipoCamposComunicado()",listFullTipoComunicado,tipo,"idTipo","tipoComunicadoTexto");
		$("#comuntipo"+comunicadoId).html(selTipo);
		$("#inputComunTipo").val(tipo);   
		var fechaMens=convertirFechaInput(comunicadoObj.fechaMensaje); 
		$("#comunfechamens"+comunicadoId).html("<input type='date' id='inputComunFechaMens' class='form-control' disabled>");
		$("#inputComunFechaMens").val(fechaMens);
		var hora=comunicadoObj.hora;
		$("#comunhora"+comunicadoId).html("<input type='time' id='inputComunHora' class='form-control' disabled>");
		$("#inputComunHora").val(hora);
		var comentario=comunicadoObj.comunicado;
		$("#comuncomentario"+comunicadoId).html("<textarea id='inputComunComent' class='form-control' style='height:75px; resize:none;'></textarea>");
		$("#inputComunComent").val(comentario);
		var link=comunicadoObj.link;
		$("#comunlink"+comunicadoId).html("<input type='text' id='inputLink' class='form-control'>");
		$("#inputLink").val(link);
		var fechaImpl=convertirFechaInput(comunicadoObj.fechaImplementacion); 
		$("#comunfechaImpl"+comunicadoId).html("<input type='date' id='inputComunFechaImpl' class='form-control'>");
		$("#inputComunFechaImpl").val(fechaImpl);
	 
		//evidencia
		$("#comunevidencia"+comunicadoId).html("<input type='text' id='inputEvidencia' class=");
		var optionEvi = {
			isImage:false,
			container:"#comunevidencia"+comunicadoId,
			idAux:"ComunicadoEvidencia",
			esNuevo:false,
			functionCall:function(){},
			evidenciaNombre:comunicadoObj.evidenciaNombre,
			descargaUrl: "/scheduler/comunicado/evidencia?id="+comunicadoId
		}
		crearFormEvidenciaCompleta(optionEvi);
		
		$("#comunvisto"+comunicadoId).html("<a class='efectoLink' onclick='cargarModalVistoComunicadoTrab()'>" +
			      "<i class='fa fa-list'></i> "+ $("#comunvisto"+comunicadoId).text()+" </a>");
		
		$("#comunoculto"+comunicadoId).html("<input type='checkbox' id='radioBotonIsOculto' class='form-control'>");
		$("#radioBotonIsOculto").prop("checked",(comunicadoObj.isOculto==0 ? false : true));
		 
		$("#inputComunTipo").prop("disabled",true); 
		banderaEdicion=true;   
		
		
		$("#btnCancelarComunicadoTrabajador").show();
		$("#btnNuevoComunicadoTrabajador").hide();
		$("#btnEliminarComunicadoTrabajador").show();
		$("#btnGuardarComunicadoTrabajador").show(); 
		
	} 
}

function cargarModalVistoComunicadoTrab(){
    $("#modalVistosComunicado").modal("show");
    
    var count = 0;
    
    var dataParams = {
	    id : comunicadoId,
	    empresaId : getSession("gestopcompanyid")
    }
    
    callAjaxPost(URL+"/scheduler/comunicado/trabajadores",dataParams,
	function(data){
		if(data.CODE_RESPONSE=="05"){
		    banderaEdicion=false;
		    listFullTrabajadoresComunicado = data.list;
		    $("#tblVistosComunicado tbody tr").remove();
		    listFullTrabajadoresComunicado.forEach(function(val,index){
			
			var color = "white";
			(val.fechaVistoTexto==null ? color="#ff7474" : color="#5dcd5d");
			
			count++;
			
			$("#tblVistosComunicado tbody").append(
				"<tr id='trTrabComunicado"+val.trabajador.trabajadorId+"'>" +
					"<td id='tdnumero"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+count+"</td>" + 
					"<td id='tdunidad"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+val.trabajador.unidadNombre+"</td>" +
					"<td id='tddivision"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+val.trabajador.divisionNombre+"</td>" +
					"<td id='tdarea"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+val.trabajador.areaNombre+"</td>" + 
					"<td id='tdtrabajador"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+val.trabajador.trabajadorNombre+"</td>" + 
					"<td id='tdfechavisto"+val.trabajador.trabajadorId+"' style='background-color:"+color+"'>"+(val.fechaVistoTexto==null ? "*NO VISTO*" : val.fechaVistoTexto)+"</td>" + 
				"</tr>"
			);
		    });
		    formatoCeldaSombreableTabla(true,"tblVistosComunicado");
		}else{
		    console.log("NOPNPO");
		}
		goheadfixedY("#tblVistosComunicado","#divTblVistosComunicado");
    })
}

function guardarComunicadoTrabajador(){
	var campoVacio=true;
	//var fechaImpl="";
	var tipo=$("#inputComunTipo").val();
	var fechaMens=convertirFechaTexto($("#inputComunFechaMens").val());
	var hora=$("#inputComunHora").val(); 
	var comentario=$("#inputComunComent").val();
	var link=$("#inputLink").val();
	var categoriaId=2; 
	var empresaid= getSession("gestopcompanyid");
	var isOculto=($("#radioBotonIsOculto").prop("checked") ? 1 : 0);
	console.log(link);
	console.log(isOculto);
 
	if(campoVacio){
		var dataParam={
			id:comunicadoId,
			fechaMensaje:fechaMens,
			hora:hora,
			tipo:{idTipo: tipo},
			comunicado:comentario,
			link:link,
			empresaId: empresaid,
			categoria:{id:categoriaId},
			isOculto:isOculto  
		};
		
		if(comunicadoId==0){
		    callAjaxPost(URL+'/scheduler/comunicado/save',dataParam,
			function(data){
				
				switch(data.CODE_RESPONSE){
				case "05":
				    cargarComunicadoTrabajador();
				    mensajeUx="<label>Se ha guardado correctamente el Comunicado.</label>";
				    mensajesUx(mensajeUx,1,"","Comunicado"); 
				    break;
				default:
				    mensajeUx="<label>¡Ocurrió un error al guardar el Comunicado!</label>";
				    mensajesUx(mensajeUx,2,"","Comunicado");
				}
		    });
		}else{
		    callAjaxPost(URL+'/scheduler/comunicado/save',dataParam,
			    procesarResultadoGuardarComunicado);
		}
		
	}
	else{
		//alert("Debe ingresar todos los campos.");
		mensajeUx="<label>¡Debe ingresar todos los campos.!</label>";
    		mensajesUx(mensajeUx,2,"","Comunicado");
	}
}

function procesarResultadoGuardarComunicado(data){
    switch(data.CODE_RESPONSE){
    case "05":
	guardarEvidenciaAuto(data.nuevoId,"fileEviComunicadoEvidencia",bitsMega*10,
		"/scheduler/comunicado/evidencia/save",
		function(){
	    		cargarComunicadoTrabajador();
	});
	mensajeUx="<label>Se ha guardado correctamente el Comunicado.</label>";
	mensajesUx(mensajeUx,1,"","Comunicado");
	break;
	
    default:
	mensajeUx="<label>¡Ocurrió un error al guardar el Comunicado!</label>";
	mensajesUx(mensajeUx,2,"","Comunicado");
    }
}

function cancelarComunicadoTrabajador(){
	cargarComunicadoTrabajador();
}






