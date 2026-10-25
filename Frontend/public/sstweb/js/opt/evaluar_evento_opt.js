var listFullEvalEvent;
var evalObj,evalId;
var preguntaEvalId;
var indexEvalOpt = 0;
$(function(){

	$("#mdVerif").load("agregaraccionmejora.html");
        $('#mdVerif').on('hidden.bs.modal', function(e) {
    	cargarEvaluacionEventosOpt();
        });
})
function verEvaluacionEventosOpt(){ 
	
	$("#tabObservaciones .container-fluid").hide();
	$("#tabObservaciones #divContainEventos").hide(); 
	$("#tabObservaciones #divContainEvaluarEventos").show();
	$("#tabObservaciones").find("h2")
	.html("<a onclick=' volverEventosOpt()'>Evento OPT - Lista: "+obsOptObj.nombre+" </a>"
			+"> Evaluación OPT");
	cargarEvaluacionEventosOpt();
}
function cargarEvaluacionEventosOpt()
{
	callAjaxPost(URL + '/opt/eventos/evaluacion', 
		{
			id:eventsOptObj.id,
			lista:{id:eventsOptObj.lista.id},
			vistaTrabajador:null
		},
		function(data) {
			if (data.CODE_RESPONSE = "05") 
			{
				listFullEvalEvent=data.evaluaciones;
				$("#tblEvaluarEventos tbody tr").remove(); 
				listFullEvalEvent.forEach(function(val, index) {
					var activarNoAplica="";
					if(val.aplica!=1)
					{
						activarNoAplica="disabled";
					}
					var btnEliminar = "";
					if(val.detalleSolicitudAccionMejoraId > 0){
						btnEliminar = "<br>"+iconoGosst.desaprobado+"<a class='efectoLink' onclick='eliminarSolicitudAccionOpt("+index+","+val.detalleSolicitudAccionMejoraId+")'>Eliminar</a>"
						
					}else{
						val.nombreSolicitudAccionMejora = "Sin Asignar";
						val.iconoSolicitudAccionMejora = "";
					}
					$("#tblEvaluarEventos tbody").append(
							"<tr id='trevaleven"+val.pregunta.id+"'>" +
								"<td id='evalevenreq"+val.pregunta.id+"'>"+val.pregunta.nombre+"</td>"+
								"<td id='evalevenapl"+val.pregunta.id+"'>" +
										"<input type='checkbox' class='check' onclick='guardarRptaEvalEvent("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' id='aplica"+val.pregunta.id+"' "+(val.aplica==1?"checked":"")+">" +
								"</td>"+
								"<td id='evalevensi"+val.pregunta.id+"'><input type='radio'  onclick='guardarRptaEvalEvent("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' name='rpta"+val.pregunta.id+"' value='1' "+activarNoAplica+"></td>"+
								"<td id='evalevenparc"+val.pregunta.id+"'><input type='radio'  onclick='guardarRptaEvalEvent("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' name='rpta"+val.pregunta.id+"' value='2' "+activarNoAplica+"></td>"+
								"<td id='evalevenno"+val.pregunta.id+"'><input type='radio'  onclick='guardarRptaEvalEvent("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' name='rpta"+val.pregunta.id+"' value='3' "+activarNoAplica+"></td>"+
								
								"<td id='evalevenriesgo"+val.pregunta.id+"'><input type='checkbox'  onclick='guardarRptaEvalEvent("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' class='check' id='riesgo"+val.pregunta.id+"' "+(val.riesgo==1?"checked":"")+"></td>"+
								"<td id='evalevenobs"+val.pregunta.id+"'>" +
										"<input type='text' id='inputObs"+val.pregunta.id+"' onclick='aparecerBtnGuardarEval("+val.id+","+eventsOptObj.id+","+val.pregunta.id+")' class='form-control' value='"+val.observaciones+"' >" +
								"</td>"+
								"<td id='evalevenevi"+val.pregunta.id+"'>"+
								"</td>"+
								"<td id='evalevenacc"+val.pregunta.id+"'>"+val.iconoSolicitudAccionMejora+"<a href='#' onclick='indexEvalOpt = "+index+";javascript:agregarAccionMejora(9, "
								+ val.id + ","+0+");'>"+val.nombreSolicitudAccionMejora+btnEliminar+"</a></td>"+
							+"</tr>");
					
					if(val.puntaje.id==1)
					{
						$("#evalevensi"+val.pregunta.id).css({"background-color":"green"});
						$("input:radio[name='rpta"+val.pregunta.id+"'][value='1']").prop('checked', true);
					}
					else if(val.puntaje.id==2)
					{
						$("#evalevenparc"+val.pregunta.id).css({"background-color":"yellow"});
						$("input:radio[name='rpta"+val.pregunta.id+"'][value='2']").prop('checked', true);
					}
					else if(val.puntaje.id==3)
					{
						$("#evalevenno"+val.pregunta.id).css({"background-color":"red"});
						$("input:radio[name='rpta"+val.pregunta.id+"'][value='3']").prop('checked', true);
					}
					var options;
					if(val.evidenciaNombre!="Sin Registrar")
					{
						options={
								container:"#evalevenevi"+val.pregunta.id,
								functionCall: function(){},
								descargaUrl:"/opt/eventos/evaluacion/evidencia?id="+val.id,
								esNuevo:false,
								idAux:"EvaluacionEvento"+val.pregunta.id,
								evidenciaNombre:val.evidenciaNombre
						};
					}
					else if(val.evidenciaNombre=="Sin Registrar")
					{
						options={
							container:"#evalevenevi"+val.pregunta.id,
							functionCall: function(){},
							descargaUrl:"",
							esNuevo:true,
							idAux:"EvaluacionEvento"+val.pregunta.id,
							evidenciaNombre:""
						};
					}
					crearFormEvidenciaCompleta(options); 
					$("#evalevenevi"+val.pregunta.id+" div").attr("onclick", "aparecerBtnGuardarEvalEvi("+val.id+","+eventsOptObj.id+","+val.pregunta.id+");");
				});
				completarBarraCarga();
			}
		});
}
function eliminarSolicitudAccionOpt(pindex,pdetalleGestAccionMejoraId){
    var r = confirm("¿Está seguro de eliminar esta solicitud asociada?");
	if(!r){return;};
	var dataParam = {detalleGestAccionMejoraId : pdetalleGestAccionMejoraId};
	callAjaxPost(URL+"/gestionaccionmejora/detalle/delete",dataParam,function(){
	    cargarEvaluacionEventosOpt();
	});
}
function aparecerBtnGuardarEval(evalId,eventoId,preguntaId) {
	if (!($("#btnGuardarObs").length > 0)) {
		$("#evalevenobs" + preguntaId).append(
				"<button id='btnGuardarObs' type='button' class='btn  btn-warning' "
						+ "title='Guardar Observación' onclick='javascript:guardarRptaEvalEvent("+evalId+","+eventoId+","+preguntaId+")'>"
						+ "<i class='fa fa-floppy-o fa-lg'></i>" +
				"</button>");
	}
}
function aparecerBtnGuardarEvalEvi(evalId,eventoId,preguntaId) {
	if (!($("#btnGuardarEvi").length > 0)) {
		$("#evalevenevi"+preguntaId).append(
				"<button id='btnGuardarEvi' type='button' class='btn  btn-warning' "
						+ "title='Guardar Evidencia' onclick='javascript:guardarRptaEvalEvent("+evalId+","+eventoId+","+preguntaId+")'>"
						+ "<i class='fa fa-floppy-o fa-lg'></i>" +
				"</button>");
	}
}
function guardarRptaEvalEvent(evalId,eventoId,preguntaId)
{
	var evento=eventoId;
	var pregunta=preguntaId;
	preguntaEvalId=pregunta
	var id=evalId;
	var aplica =$("#aplica" + preguntaId).is(':checked');
	var riesgo =$("#riesgo" + preguntaId).is(':checked');
	var puntaje=$("input[name='rpta" + preguntaId + "']:checked").val(); 
	var obs=$("#inputObs"+preguntaId).val();
	if(id==null)
	{
		id=0;
	}
	if(aplica==true)
	{
		aplica=1;
	}
	else if(aplica==false)
	{
		aplica=0;
		puntaje=null;
	}
	if(riesgo==true)
	{
		riesgo=1;
	}
	else if(riesgo==false)
	{
		riesgo=0;
	}
	if(puntaje==undefined)
	{
		puntaje=null;
	}
	
	var dataParam=
	{
			id:id,
			aplica:aplica,
			puntaje:{id:puntaje},
			riesgo:riesgo,
			observaciones:obs,
			evento:
			{
				id:evento,
				vistaTrabajador:null
			},
			pregunta:{id:pregunta}
	};
	//alert ("id:"+id+"\npregunta: "+pregunta+"\nevento:"+evento+"\naplica: "+aplica+"\nriesgo: "+riesgo+"\npuntaje:"+puntaje+"\nobservacion:"+obs);
	callAjaxPost(URL+'/opt/eventos/evaluacion/save',dataParam,
			procesarResultadoGuardarEvalEvi);
}
function procesarResultadoGuardarEvalEvi(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviEvaluacionEvento"+preguntaEvalId,
				bitsEvidenciaEvalEvento,"/opt/eventos/evaluacion/evidencia/save",cargarEvaluacionEventosOpt,"id"); 
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
		
		
		