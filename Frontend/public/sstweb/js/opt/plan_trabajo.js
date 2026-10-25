function verPlanTrabajoEvento()
{
	$("#tabObservaciones .container-fluid").hide();
	$("#tabObservaciones #divContainEventos").hide(); 
	$("#tabObservaciones #divContainPlanTrabajoEventos").show();
	$("#tabObservaciones").find("h2")
	.html("<a onclick=' volverEventosOpt()'>Evento OPT</a> - Lista: "+obsOptObj.nombre+" - Trabajador: "+eventsOptObj.trabajador.nombre);
	cargarPlanTrabajoEvento();
}
function cargarPlanTrabajoEvento()
{
	
}
