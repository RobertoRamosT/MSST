var listFullComunicado; 
var listFullTipoComunicado,listContratistas;
var comunicadoId, comunicadoObj;
var listOpc=[];
var banderaEdicion=false;
$(function(){
	//Era attr no atrr
	$("#btnNuevoComunicado").attr("onclick","javascript: nuevoComunicado();");
	$("#btnCancelarComunicado").attr("onclick","javascript: cancelarComunicado();");
	$("#btnGuardarComunicado").attr("onclick","javascript: guardarComunicado();");
	$("#btnEliminarComunicado").attr("onclick","javascript: eliminarComunicado();");
	//Cuando se utiliza $(function) quiere decir que se va a realizar lo que está dentro una vez carguen todos los 
	//recursos de la página, por tanto lo de cargar comunicados no debería ir
	//insertMenu(cargarComunicado);
});

function volverComunicado()
{
	$("#tabComunicado .container-fluid").hide();
	$("#divComunicado").show();
	$("#tabComunicado").find("h2").html("Comunicados");
}
function cargarComunicado(mensajeExito){
        var valorResize= 160;
        resizeDivWrapper("wrapComunicado",valorResize);
      //console.log("Con "+valorResize);
    
    
	$("#btnCancelarComunicado").hide();
	$("#btnNuevoComunicado").show();
	$("#btnEliminarComunicado").hide();
	$("#btnGuardarComunicado").hide();
	volverComunicado();
	callAjaxPost(URL + '/contratista/comunicado', {
		empresaId : getSession("gestopcompanyid")},
		function(data) {
			if (data.CODE_RESPONSE = "05") {
				banderaEdicion = false;
				listOpc=[
					{
						id:1,
						nombre:"Si"
					},
					{
						id:0,
						nombre:"No"
					}
				];
				
				listFullComunicado = data.list;
				listFullTipoComunicado=data.listTipos; 
				listContratistas=data.contratistas;
				$("#tblComunicado tbody tr").remove(); 
				listFullComunicado.forEach(function(val, index) {
					$("#tblComunicado tbody").append(
							"<tr id='trcomun"+val.id+"' onclick='editarComunicado("+index+")'>" +
								"<td id='comuntipo"+val.id+"'>"+val.tipo.tipoComunicadoTexto+"</td>" 
								+"<td id='comunfechamens"+val.id+"'>"+val.fechaMensajeTexto+"</td>"
								+"<td id='comunhora"+val.id+"'>"+val.horaTexto+"</td>"
								+"<td id='comuncomentario"+val.id+"'>"+val.comunicado +"</td>"
								+"<td id='comunevidencia"+val.id+"'>"+val.evidenciaNombre +"</td>"
								+"<td id='comunfechaImpl"+val.id+"'>"+val.fechaImplementacionTexto +"</td>"
								+"<td id='comunevi"+val.id+"'>"+"</td>"
								+"<td id='comunenviar"+val.id+"'>...</td>"
								+"<td id='comuncontr"+val.id+"'>"+val.contratistasNombre+"</td>"
							+"</tr>");
					if(val.tipo.idTipo==1)//Aplicativo
					{
						$("#comunevi"+val.id).append(val.numAprob+" / "+val.numTotal);
					}
					else 
					{
						$("#comunevi"+val.id).append(val.numRevisados+" / "+val.numTotal);
					}
					if(val.enviarTodos==1)
					{
						$("#comunenviar"+val.id).html("Si");
					}
					else 
					{
						$("#comunenviar"+val.id).html("No");
					}
				});
			
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblComunicado");
				// P-A00019: el aviso se muestra al terminar de cargar la lista; antes quedaria tapado por la ruedita de carga
				if(typeof mensajeExito==="string" && mensajeExito.length>0)
				{
					verAlertaSistemaGosst(1,mensajeExito);
				}
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		});
}
function nuevoComunicado(){
	if(!banderaEdicion){
		comunicadoId=0;
		var selTipo=crearSelectOneMenuOblig("inputComunTipo","tipoCamposComunicado()",listFullTipoComunicado,"","idTipo","tipoComunicadoTexto")
		var selEnviar=crearSelectOneMenuOblig("inputComunEnviarTodos","selecTodosContratistas()",listOpc,"","id","nombre");
		$("#tblComunicado tbody").prepend(
			"<tr>" 
				+"<td>" +selTipo+"</td>"
				+"<td>" +"<input type='date' id='inputComunFechaMens' class='form-control' disabled>"+"</td>"
				+"<td>" +"<input type='time' id='inputComunHora' value='0' class='form-control' disabled>"+"</td>"
				+"<td>" +"<textarea id='inputComunComent' class='form-control'></textarea>"	+"</td>"
				+"<td id='comunevidencia0'>...</td>"  
				+"<td>" +"<input type='date' id='inputComunFechaImpl' value='0' class='form-control'>"+"</td>"
				+"<td id='inputComunEvidencia'>...</td>"    
				+"<td >"+selEnviar+"</td>"  
				+"<td id='comuncontr0'>...</td>" 
			+"</tr>");
		 var fechaMens=obtenerFechaActual();
		$("#inputComunFechaMens").val(fechaMens);
		var horaActual=obtenerHoraActual();
		$("#inputComunHora").val(horaActual);
		
		crearSelectOneMenuObligMultipleCompleto("selContratistasComun","",
				listContratistas,"id","nombre","#comuncontr"+comunicadoId,"Contratistas....");
		var options={
				container:"#comunevidencia"+comunicadoId,
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Comunicado",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options); 
		  
		$("#btnCancelarComunicado").show();
		$("#btnNuevoComunicado").hide();
		$("#btnEliminarComunicado").hide();
		$("#btnGuardarComunicado").show(); 
		banderaEdicion=true;
		formatoCeldaSombreableTabla(false,"tblComunicado");
	}
	else{
		alert("Guarde Primero.");
	}

}
 
function editarComunicado(pindex){
	if(!banderaEdicion){
		formatoCeldaSombreableTabla(false,"tblComunicado");
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
		$("#comuncomentario"+comunicadoId).html("<textarea id='inputComunComent' class='form-control'></textarea>");
		$("#inputComunComent").val(comentario);
		var fechaImpl=convertirFechaInput(comunicadoObj.fechaImplementacion); 
		$("#comunfechaImpl"+comunicadoId).html("<input type='date' id='inputComunFechaImpl' class='form-control'>");
		$("#inputComunFechaImpl").val(fechaImpl);
		var options={
				container:"#comunevidencia"+comunicadoId,
				functionCall: function(){},
				descargaUrl:"/contratista/comunicado/evidencia?id="+comunicadoId,
				esNuevo:false,
				idAux:"Comunicado",
				evidenciaNombre:comunicadoObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		if(tipo==1)
		{  
			var evidencias=$("#comunevi"+comunicadoId).text(); 
			$("#comunevi"+comunicadoId).addClass("linkGosst")
			.on("click",function(){verEstados();})
			.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+evidencias); 
			$("#inputComunFechaImpl").prop("disabled",false);
			$(".input-group").show();
		}
		else if(tipo==2)
		{    
			// P-A00018: el administrador puede adjuntar un archivo tambien en un informativo (antes solo en los aplicativos)
			// P-A00018: el administrador ve que contratistas revisaron el comunicado y cuales faltan
			var revisados=$("#comunevi"+comunicadoId).text();
			$("#comunevi"+comunicadoId).addClass("linkGosst")
			.on("click",function(){verEstados();})
			.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+revisados);
			$("#inputComunFechaImpl").prop("disabled",true); 
		} 
		$("#inputComunTipo").prop("disabled",true); 
		var enviar=comunicadoObj.enviarTodos;
		 
		var enviar=comunicadoObj.enviarTodos;
		var selEnviar=crearSelectOneMenuOblig("inputComunEnviarTodos","selecTodosContratistas()",listOpc,enviar,"id","nombre");
		$("#comunenviar"+comunicadoId).html(selEnviar);
		$("#inputComunEnviarTodos").val(enviar);    
		
		var contratistas=comunicadoObj.contratistasId; 
		var listaIdsContratistas=contratistas.split(",");
		listaIdsContratistas.forEach(function(val)
		{
			listContratistas.forEach(function(val1){ 
				if(val==val1.id)
				{
					val1.selected=1;
				}
			});
		});
		
		crearSelectOneMenuObligMultipleCompleto("selContratistasComun","",
				listContratistas,"id","nombre","#comuncontr"+comunicadoId,"Contratistas....");
		// P-A00018: con "enviar a todos" = No, selecTodosContratistas() vuelve a armar el selector con todas las contratistas desmarcadas
		// y al guardar el comunicado quedaba sin destinatarios (desaparecia para las contratistas); solo se llama cuando es "Si"
		if(enviar==1)
		{
			selecTodosContratistas();
		}
		
	
		banderaEdicion=true;  
		$("#btnCancelarComunicado").show();
		$("#btnNuevoComunicado").hide();
		$("#btnEliminarComunicado").show();
		$("#btnGuardarComunicado").show();
	} 
}
function guardarComunicado(){
	var campoVacio=true;
	var fechaImpl="";
	var tipo=$("#inputComunTipo").val();
	var fechaMens=convertirFechaTexto($("#inputComunFechaMens").val());
	var hora=$("#inputComunHora").val(); 
	var comentario=$("#inputComunComent").val(); 
	var empresaid= getSession("gestopcompanyid");
	var categoriaId=1;
	var enviar=$("#inputComunEnviarTodos").val();
	
	var listContratistasInput=$("#selContratistasComun").val();
	var listContratistasFinal=[];
	if(listContratistasInput!=null)
	{
		listContratistasInput.forEach(function(val)
		{
			listContratistasFinal.push({id:parseInt(val)});
		});
	} 
	if(tipo==1)
	{ 
		var fechaImpl=convertirFechaTexto($("#inputComunFechaImpl").val());
	}
 
	if(enviar==0 && listContratistasFinal.length==0)
	{
		// P-A00018: un comunicado dirigido a contratistas especificas sin ninguna elegida no lo veria nadie
		alert("Seleccione al menos una contratista o envie el comunicado a todas.");
		return;
	}
	if(campoVacio){
		var dataParam=
		{
			id:comunicadoId,
			fechaMensaje:fechaMens,
			hora:hora,
			tipo:{idTipo: tipo},
			comunicado:comentario,
			fechaImplementacion:fechaImpl,
			empresaId: empresaid,
			categoria:{id:categoriaId},
			enviarTodos:enviar,
			contratistas:listContratistasFinal
		};
		callAjaxPost(URL+'/contratista/comunicado/save',dataParam,
				procesarResultadoGuardarComunicado);
	}
	else{
		alert("Debe ingresar todos los campos.");
	}
}

function procesarResultadoGuardarComunicado(data)
{
	switch (data.CODE_RESPONSE) {
	case "05":
		var inputArchivo=document.getElementById("fileEviComunicado");
		var hayArchivo=!!(inputArchivo && inputArchivo.files && inputArchivo.files.length>0);
		guardarEvidenciaAuto(data.nuevoId,"fileEviComunicado",
				bitsEvidenciaComunicado,"/contratista/comunicado/evidencia/save",
				function(respuestaSubida){comunicadoGuardado(hayArchivo,respuestaSubida);},"id"); 
		break; 
	default:
		alert("No se pudo guardar el comunicado. Intente de nuevo.");
	}
}
// P-A00019: guardarEvidenciaAuto apaga la ruedita (complete) justo despues de llamar a esta funcion; si la lista se recargara ahora mismo,
// su ruedita se apagaria al instante y la lista (unos 3,6 MB) se descargaria sin ninguna señal. Con setTimeout corre cuando ya termino.
function comunicadoGuardado(hayArchivo,respuestaSubida)
{
	var archivoAdjuntado=!hayArchivo || (respuestaSubida!=null && respuestaSubida.CODE_RESPONSE=="05");
	var mensaje=archivoAdjuntado?"Comunicado guardado correctamente":"Comunicado guardado, pero el archivo no se adjuntó";
	setTimeout(function(){cargarComunicado(mensaje);},0);
}
function eliminarComunicado(){
	var r= confirm("¿Está  de eliminar este Comunicado?");
	if(r==true)
	{
		var dataParam={	id:comunicadoId};
		callAjaxPost(URL+'/contratista/comunicado/delete',dataParam,
				function(data){
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarComunicado("Comunicado eliminado correctamente");
						break; 
					default:
						alert("No se puede eliminar.");
					}
		});
	}
}
function cancelarComunicado(){
	cargarComunicado();
}
function tipoCamposComunicado()
{ 	var tipo=$("#inputComunTipo").val();  
	if(tipo==1)
	{  
		$("#inputComunFechaImpl").prop("disabled",false);  
		$(".input-group").show();
	}
	else if(tipo==2)
	{    
		$("#inputComunFechaImpl").prop("disabled",true); 
		$("#inputComunFechaImpl").val("---");   
		// el archivo adjunto del comunicado se puede cargar tambien en un informativo
		$(".input-group").show();
	
	}
}
function selecTodosContratistas()
{
	var si=$("#inputComunEnviarTodos").val();
	if(si==1)
	{
		msg="..."; 
		$("#comuncontr"+comunicadoId+ " select").remove();
		$("#comuncontr"+comunicadoId+ " div").remove();
		$("#comuncontr"+comunicadoId+ " input").remove();
		$("#comuncontr"+comunicadoId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}
	else 
	{
		listContratistas.forEach(function(val){ 
			val.selected=0;
		});
		crearSelectOneMenuObligMultipleCompleto("selContratistasComun","",
				listContratistas,"id","nombre","#comuncontr"+comunicadoId,"Contratistas....");  
	} 
	
}






