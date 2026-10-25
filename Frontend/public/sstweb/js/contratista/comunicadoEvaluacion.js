// P-A00018: el nombre de la contratista y la fecha se escapan antes de pintarlos
function escapeHtmlComunicado(texto){
	return $("<div>").text(texto==null?"":String(texto)).html();
}
var banderaEdicion2=false;
var estadoId=0,estadoObj;
var listFullEstado,listFullTipoEstado,listFullContratista;   

$(function(){
	$("#btnNuevoEstados").attr("onclick", "javascript:nuevoEstado();");
	$("#btnCancelarEstados").attr("onclick", "javascript:cancelarEstado();");
	$("#btnGuardarEstados").attr("onclick", "javascript:guardarEstado();");
	$("#btnEliminarEstados").attr("onclick", "javascript:eliminarEstado();"); 
}) 
function verEstados(){ 
	$("#tabComunicado .container-fluid").hide();
	$("#tabComunicado #divComunicado").hide(); 
	$("#tabComunicado #divEstados").show();
	$("#tabComunicado").find("h2")
	.html("<a onclick=' volverComunicado()'>Comunicado </a>"
			+"> Registro de contratistas:");
	cargarEstados();
}
function cargarEstados() {
	$("#btnCancelarEstados").hide();
	$("#btnNuevoEstados").show();
	$("#btnEliminarEstados").hide();
	$("#btnGuardarEstados").hide();
	callAjaxPost(URL + '/contratista/comunicado/evaluacion',
			{
				id:comunicadoObj.id
			},
		function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				banderaEdicion2=false;
				listFullEstado=data.list;
				listFullTipoEstado=data.listTipoEstado;
				$("#tblEstados tbody tr").remove();

				// P-A00018: un comunicado informativo no tiene respuestas ni evaluacion: solo importa quien lo reviso y quien falta
				var esInformativo=(comunicadoObj && comunicadoObj.tipo && Number(comunicadoObj.tipo.idTipo)===2);
				$("#tblEstados th:nth-child(2), #tblEstados th:nth-child(3), #tblEstados th:nth-child(4), #tblEstados th:nth-child(5)").toggle(!esInformativo);
				$("#tblEstados th:nth-child(6)").text(esInformativo?"Revisión del comunicado":"Notificado el");

				var filas=[],numNotificados=0;
				listFullEstado.forEach(function(val,index){
					var notificado=!!val.fechaNotificadoTexto;
					if(notificado){numNotificados++;}
					filas.push({val:val,index:index,notificado:notificado});
				});
				// primero los que faltan, despues los que ya notificaron; cada grupo por nombre
				filas.sort(function(a,b){
					if(a.notificado!==b.notificado){return a.notificado?1:-1;}
					return String(a.val.contratista.nombre||"").localeCompare(String(b.val.contratista.nombre||""));
				});

				$("#resumenNotificados").remove();
				$("#tblEstados").closest(".table-responsive").before(
					"<p id='resumenNotificados' style='font-size:15px'><strong>Notificados: "+numNotificados+" de "+listFullEstado.length+" destinatarios</strong>"
					+" &middot; <span style='color:#c0392b;font-weight:bold'>Faltan: "+(listFullEstado.length-numNotificados)+"</span></p>");

				filas.forEach(function(fila){
					var val=fila.val,index=fila.index;
					var nombre=escapeHtmlComunicado(val.contratista.nombre);
					var ocultar=(esInformativo?" style='display:none'":"");
					var revision;

					if(fila.notificado){
						revision="<span style='color:#1e8449;font-weight:bold'><i class='fa fa-check-circle'></i> Notificado el "+escapeHtmlComunicado(val.fechaNotificadoTexto)+"</span>";
					}else if(Number(val.isVisto)===1){
						revision="<span style='color:#b9770e;font-weight:bold'><i class='fa fa-eye'></i> Abri&oacute; el comunicado, a&uacute;n sin notificar</span>";
					}else{
						revision="<span style='color:#c0392b;font-weight:bold'><i class='fa fa-times-circle'></i> Sin abrir</span>";
					}

					if(val.id==null)
					{
						// destinatario que aun no abre el comunicado: sin registro, solo lectura
						$("#tblEstados tbody").append(
							"<tr>"
								+"<td>"+nombre+"</td>"
								+"<td"+ocultar+"></td><td"+ocultar+">Sin respuesta</td><td"+ocultar+"></td><td"+ocultar+">No Hay Evidencia</td>"
								+"<td>"+revision+"</td>"
							+"</tr>");
					}
					else
					{
						var nombEviTemp=(val.evidenciaNombre==""?"No Hay Evidencia":val.evidenciaNombre);
						var estadoNombre=(val.evaluacion && val.evaluacion.nombre?val.evaluacion.nombre:"Sin respuesta");

						$("#tblEstados tbody").append(
							"<tr id='trart"+val.id+"'"+(esInformativo?"":" onclick='editarEstado("+index+")'")+">"
								+"<td id='contrnombre"+val.id+"'>"+nombre+"</td>"
								+"<td id='controbs"+val.id+"'"+ocultar+">"+escapeHtmlComunicado(val.observaciones)+"</td>"
								+"<td id='contrestado"+val.id+"'"+ocultar+">"+escapeHtmlComunicado(estadoNombre)+"</td>"
								+"<td id='contrtexto"+val.id+"'"+ocultar+" style='white-space:pre-wrap'>"+escapeHtmlComunicado(val.respuestaTexto)+"</td>"
								+"<td id='contrevi"+val.id+"'"+ocultar+">"+(val.evidenciaNombre==""?"No Hay Evidencia":"<a class='efectoLink' href='"+URL+"/contratista/comunicado/reporteestado/evidencia?id="+val.id+"' onclick='event.stopPropagation();'>"+escapeHtmlComunicado(val.evidenciaNombre)+"</a>")+"</td>"
								+"<td id='contrnotif"+val.id+"'>"+revision+"</td>"
							+"</tr>");
					}
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true,"tblEstados");
				break;
			default:
				alert("nop");
				break;
			}
		});
}
function editarEstado(pindex) 
{
	if(!banderaEdicion2){
		estadoObj=listFullEstado[pindex]; 
		estadoId=estadoObj.id; 
		var descargaEvidencia=URL+"/contratista/comunicado/reporteestado/evidencia?id="+estadoId;
		
		var contratistaNombre=estadoObj.contratista.nombre; 
		$("#contrnombre"+estadoId).val(contratistaNombre);
		
		var obs=estadoObj.observaciones;
		$("#controbs"+estadoId).html("<textarea id='inputObs' class='form-control'></textarea>"	);
		$("#inputObs").val(obs);  
		
		var tipo=(estadoObj.evaluacion?estadoObj.evaluacion.id:"");
		var selTipoEstado=crearSelectOneMenuOblig("inputTipoEstado","",listFullTipoEstado,"","id","nombre");
		$("#contrestado"+estadoId).html(selTipoEstado); 
		$("#inputTipoEstado").val(tipo);  
		
		if(estadoObj.evidenciaNombre=="")
		{
			//No es necesario el link <a> si no hay evidencia
			$("#contrevi"+estadoId).html("No Hay Evidencia" ); 
		}
		else 
		{
			$("#contrevi"+estadoId).html("<a class='efectoLink' href='"+descargaEvidencia+"'>"+ estadoObj.evidenciaNombre+"</a>" ); 			
		}
		//$("#contrevi"+estadoId).prop("disabled",false); 
	
		$("#btnCancelarEstados").show();
		$("#btnNuevoEstados").hide();
		$("#btnEliminarEstados").hide();
		$("#btnGuardarEstados").show(); 
		banderaEdicion2=true;
		formatoCeldaSombreableTabla(false,"tblEstados");
	}

}
function guardarEstado()
{
	var campoVacio=true;
	var idcomuncontr=estadoObj.id;
	var estado=	$("#inputTipoEstado").val();  
	var obs=$("#inputObs").val();  
	if(campoVacio){
		var dataParam=
		{
			id:idcomuncontr,  
			evaluacion:{id: estado},    
			observaciones:obs
		};
		callAjaxPost(URL+'/contratista/comunicado/evaluacion/save',dataParam,
				cargarEstados);
	}
	else{
		alert("Debe ingresar todos los campos.");
	}
}

function cancelarEstado(){
	cargarEstados();
}


