
function habilitarIndicadoresResiduo(){
	
	var listPanelesPrincipal=[];
	
	var textIn= ""; 
	$(".divListPrincipal").html("");
	var selInd=crearSelectOneMenuOblig("selInd", "ocultarSeccionIndicador()", listIndicadores, "", "id",
	"nombre");
	
	
	var textIndicador="";
	 var listItemsActi=[
	             		{sugerencia:"",label:"Lista",inputForm:selInd},
	             		{sugerencia:"",label:"Inicio",inputForm:"<input type='date'  class='form-control' id='fechaInicioStock'>"},
	             		{sugerencia:"",label:"Fin",inputForm:"<input type='date'  class='form-control' id='fechaFinStock'>"},
	             		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
	                         		];
	listItemsActi.forEach(function(val,index){
	textIndicador+=obtenerSubPanelModulo(val);
		}); 	
	listPanelesPrincipal.push(
			{id:"indicador"+index,clase:"",
					nombre:"Indicadores",
					contenido:"<form id='formEditarActividad' class='eventoGeneral'>"+textIndicador+"</form>"}
	); 
	
	agregarPanelesDivPrincipal(listPanelesPrincipal);
	$('#formEditarActividad').on('submit', function(e) {  
        e.preventDefault(); 
        iniciarSeccionIndicadorMovil();
 });
	$("#selInd").val("6");
	$("#fechaInicioStock").val(sumaFechaDias(-32,convertirFechaInput(obtenerFechaActual())))
	$("#fechaFinStock").val(sumaFechaDias(32,convertirFechaInput(obtenerFechaActual())));
	
}

function iniciarSeccionIndicadorMovil(){
	$(".divContainerGeneral").hide();
	var divContainer="";
	var indicadorId=parseInt($("#selInd").val());
 var encabezado="";
	switch(indicadorId){
	case 0:
		divContainer="divStock";
		encabezado="<td class='tb-acc' style='width:150px'>Clasificación</td>" +
		"<td class='tb-acc' style='width:140px'>Tipo de residuo</td>" +
		"<td class='tb-acc' style='width:200px'>Generación (Kg)</td>" +
		"<td class='tb-acc' style='width:200px'>Transporte (Kg)</td>" +
		"<td class='tb-acc' style='width:200px'>Diferencia (Kg)</td>"
		break;
	case 1:
		divContainer="divCostoTrans";
		encabezado="<td class='tb-acc' style='width:190px'>Transportista</td>" +
		"<td class='tb-acc' style='width:190px'>Inversión (S/)</td>"
		
		break;
	case 2:
		divContainer="divGenePer";
		encabezado="<td class='tb-acc' style='width:250px'>Tipo</td>" +
		"<td class='tb-acc'  >Peso percápita (Kg / persona-dia)</td>"
		
		break;
	case 3:
		divContainer="divGeneTotal";
		encabezado="<td class='tb-acc' style='width:250px'>Tipo</td>" +
		"<td class='tb-acc'  >Peso (ton)</td>"
		
		break;
	case 4:
		divContainer="divEtapaSalida";
		encabezado=""
		
		break;
	case 5:
		divContainer="divClasif";
		encabezado="<td class='tb-acc' style='width:250px'>Clasificación</td>" +
		"<td class='tb-acc'  >Peso (ton)</td>"
		
		break;
	case 6:
		divContainer="divEdificio";
		encabezado="<td class='tb-acc' style='width:150px'><button onclick='actualizarTablaEdificiosTotal()' "+ 
									+ " class='btn btn-success'><i class='fa fa-refresh'></i>Refresh </button> </td>" +
		"<td class='tb-acc' style='width:140px'>Edificio / Empresa</td>" +
		"<td class='tb-acc' style='width:200px'>Generación (Kg)</td>" +
		"<td class='tb-acc' style='width:200px'>Transporte (Kg)</td>" +
		"<td class='tb-acc' style='width:200px'>Diferencia (Kg)</td>" ;
		break;
	case 7:
		divContainer="divEdificioTipo";
		encabezado=""
		
		break;
	case 8:
		divContainer="divClientesIndicador";
		encabezado="<td class='tb-acc' >Área</td>" +
		"<td class='tb-acc'  style='width:200px'>Generación</td>"
		
		break;
	case 9:
		divContainer="divClientesTipoIndicador";
		encabezado=""
		
		break;
	case 10:
		
		divContainer="divEdificioTipo";
		encabezado=""
		
		
		break;
	}
	
	tituloAnteriorContratista="Indicadores";
	var buttonVolver="<button type='button' class='btn btn-success ' style='margin-right:10px'" +
	" onclick='volverVistaMovil()'>" +
				"<i class='fa fa-sign-out fa-rotate-180'></i>Volver</button>";
$("body")
.append("<div id='divTrabProyTabla' style='padding-left: 40px;'>" +
	"<form class='form-inline'>"+
	buttonVolver+"</form>"+
	 
	"<div class='wrapper' id='"+divContainer+"'>" +
	"<table  style='min-width:1200px '  class='table table-striped table-bordered table-hover fixed'>" +
	"<thead>" +
		"<tr>" +
		encabezado+
		"" +
		"</tr>" +
	"</thead>" +
	"<tbody></tbody>" +
	"</table>" +
	"</div>" +
	" </div>");
	
iniciarSeccionInidicador();

}




