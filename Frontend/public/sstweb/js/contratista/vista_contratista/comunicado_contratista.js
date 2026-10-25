/**
 * 
 */
var listFullEstadosContratistas=[]; 
var listMotivoSugerencia=[]; 
var comunicadoContratistaId;
var objComunicadoContratista={id:0}; 
var indexEvidenciaFunction; 
var contratistaId;
var tipoAplic=""; 
function toggleInform(idcomun)
{ 
	$("#comInfor"+idcomun).toggle();
	estadoVisible=false;
	estadoVisible=$("#comInfor"+idcomun).is(":visible"); 
	$("#iconoToggleInform"+idcomun+" i").remove();
	if(estadoVisible)
	{ 
		$("#iconoToggleInform"+idcomun).append("<i class='fa fa-angle-double-up fa-2x'></i>"); 
	}
	else 
	{
		$("#iconoToggleInform"+idcomun).append("<i class='fa fa-angle-double-down fa-2x'></i>"); 
	} 
}
 function toggleAplic(tipo)
{
	$(".comu"+tipo).toggle(); 
	estadoVisible=false;
	estadoVisible=$(".comu"+tipo).is(":visible"); 
	$("#iconoToggle"+tipo+" i").remove();
	if(estadoVisible)
	{ 
		$("#iconoToggle"+tipo).append("<i class='fa fa-caret-up'></i>"); 
	}
	else 
	{
		$("#iconoToggle"+tipo).append("<i class='fa fa-caret-down'></i>"); 
	} 
}function toggleAplicComun(idcomun,tipo)
{
	indexEvidenciaFunction=idcomun;
	estadoVisible=false;
	estadoVisible=$("#comAplic"+idcomun+tipo).is(":visible"); 
	$("#iconoToggle"+idcomun+" i").remove();
	if(estadoVisible)
	{ 
		$("#iconoToggle"+idcomun).append("<i class='fa fa-angle-double-down fa-2x'></i>"); 
	}
	else 
	{
		$("#iconoToggle"+idcomun).append("<i class='fa fa-angle-double-up fa-2x'></i>"); 
	} 
	$("#comAplic"+idcomun+tipo).toggle();	
}

function toggleEvidenciaAplic(pindex,tipo)
{ 
	indexEvidenciaFunction=pindex;
	$("#evidencia"+tipo+pindex).toggle();  
}
function toggleMenuOpcionComunicado(obj,pindex,menu)
{
	indexEvidenciaFunction=pindex;
	indexOpc=pindex;
	$(obj).parent(".containerEvidencia"+menu+pindex).find("ul").toggle();
	$(obj).parent(".containerEvidencia"+menu+pindex).siblings().find("ul").hide(); 
	
	switch (menu) {
	case "SinAtender":  
		$(".containerEvidenciaSinEval"+indexEvidenciaFunction+" .listaGestionGosst").hide();
		$(".containerEvidenciaConEval"+indexEvidenciaFunction+" .listaGestionGosst").hide();
		break;
	case "SinEval":
		$(".containerEvidenciaSinAtender"+indexEvidenciaFunction+" .listaGestionGosst").hide(); 
		$(".containerEvidenciaConEval"+indexEvidenciaFunction+" .listaGestionGosst").hide();
		break;
	case "ConEval":
		$(".containerEvidenciaSinAtender"+indexEvidenciaFunction+" .listaGestionGosst").hide();
		$(".containerEvidenciaSinEval"+indexEvidenciaFunction+" .listaGestionGosst").hide(); 
		break;
	default:
		break;
	}
	
	
} 
var funcionalidadCambiarEvidencia=
	[
		{menu:"SinAtender",opcion:
			[{id:"opcNuevaEvi",nombre:"<i class='fa fa-upload'></i> Subir mi respuesta",functionClick:
				function(data){
					$("#evidenciaSubirSinAtender"+indexEvidenciaFunction).toggle(); 
					var options={
							container:".evidenciaSubirSinAtender"+indexEvidenciaFunction,
							functionCall:function(){},
							descargaUrl:"",
							esNuevo:true,
							idAux:"SinAtender",
							evidenciaNombre:""
					};
					crearFormEvidenciaCompleta(options);
					$("#opcOcultarSinAtender"+indexOpc).show();
					$("#opcNuevaEviSinAtender"+indexOpc).hide();
				}
			},
			{id:"opcOcultar",nombre:"<i class='fa fa-refresh'></i> Cancelar",functionClick:
					function(data){ 
					$("#opcOcultarSinAtender"+indexOpc).hide();
					$("#opcNuevaEviSinAtender"+indexOpc).show();
					$("#evidenciaSubirSinAtender"+indexEvidenciaFunction).hide(); 
				}
			}
		]},
		{menu:"SinEval",opcion:
			[{id:"opcCambEvi",nombre:"<i class='fa fa-refresh'></i> Cambiar mi respuesta",functionClick: 
				function(data){ 
					$("#evidenciaSubirSinEval"+indexEvidenciaFunction).toggle(); 
					var options={
							container:".evidenciaSubirSinEval"+indexEvidenciaFunction,
							functionCall:function(){},
							descargaUrl:"",
							esNuevo:true,
							idAux:"SinEval",
							evidenciaNombre:""
					};
					crearFormEvidenciaCompleta(options);
					$("#opcOcultarSinEval"+indexOpc).show();
					$("#opcCambEviSinEval"+indexOpc).hide();
					}
			},
			{id:"opcOcultar",nombre:"<i class='fa fa-refresh'></i> Cancelar",functionClick:
				function(data){ 
				$("#opcOcultarSinEval"+indexOpc).hide();
				$("#opcCambEviSinEval"+indexOpc).show();
				$("#evidenciaSubirSinEval"+indexEvidenciaFunction).hide(); 
			}
		}
		]},
		{menu:"ConEval",opcion:[{id:"opcCambEvi",nombre:"<i class='fa fa-refresh'></i> Cambiar mi respuesta",functionClick:function(data){alert("xdConvEval");}}]}
	];
function marcarSubOpcionComunicado(pindex,pindex1)
{ 
	$(".containerEvidenciaSinAtender"+indexEvidenciaFunction+" .listaGestionGosst").hide();
	$(".containerEvidenciaSinEval"+indexEvidenciaFunction+" .listaGestionGosst").hide();
	$(".containerEvidenciaConEval"+indexEvidenciaFunction+" .listaGestionGosst").hide();
	funcionalidadCambiarEvidencia[pindex].opcion[pindex1].functionClick();
}
var menuOpcionEvi=[];
function ListarOpcionesEvi(idpindex)
{
	funcionalidadCambiarEvidencia.forEach(function(val1,index1){
		var menu=val1.menu;
		var opciones=val1.opcion;
		menuOpcionEvi[index1]="<ul class='list-group listaGestionGosst' style='display:none;'>";
		opciones.forEach(function(val2,index2){
			if(val2.id=="opcOcultar")
			{
				menuOpcionEvi[index1]+="<li id='"+val2.id+menu+idpindex+"'style='width:140px;top:-22px; display:none;'class='list-group-item' onclick='marcarSubOpcionComunicado("+index1+","+index2+")'>"+val2.nombre+"</li>";					
			}
			else
			{
				menuOpcionEvi[index1]+="<li id='"+val2.id+menu+idpindex+"'style='width:170px;top:-22px;'class='list-group-item' onclick='marcarSubOpcionComunicado("+index1+","+index2+")'>"+val2.nombre+"</li>";
			}
			});
		menuOpcionEvi[index1]+="</ul>";
	});
}
function habilitarComunicadoContratista(){

	objComunicadoContratista={id:0}
	contratistaId=parseInt(getSession("contratistaGosstId"));
	empresaId=parseInt(getSession("gestopcompanyid"));
	var dataParam={ 
				id:contratistaId,
				empresaId:empresaId,
				numHorasHombre:0};
	callAjaxPost(URL + '/contratista/comunicado/reporteestado', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			var textInform="";  
			var  numComunInformativo=0, numComunAplicativo=0;
			var  numComuSinEvaluar=0, numComuConEvaluar=0, numComuSinAtender=0, numComuPendEval=0;
			var textSinAtender="";
			var textSinEval="";
			var textPendEval="";
			var textConEval="";
			var textComunTemp="";
			listFullEstadosContratistas=data.list;   
			$(".divListPrincipal").html("");
			var comunicadosYaPintados={};
			listFullEstadosContratistas.forEach(function(val,index){ 
				if(comunicadosYaPintados[val.comunicado.id]){return;}
				comunicadosYaPintados[val.comunicado.id]=true;
				ListarOpcionesEvi(val.comunicado.id); 
				if((val.comunicado.comunicado).length>=35)
				{
					textComunTemp=(val.comunicado.comunicado).substring(0,35)+"...";
				}
				else{
					textComunTemp=val.comunicado.comunicado;
				} 
				if(val.isVisto==0)
				{
					icono="<i class='fa fa-envelope-o fa-2x' aria-hidden='true'></i>" +
							"<div class='iconoAlerta'>" +
								"<i class='fa fa-exclamation-circle'></i>" +
							"</div>";
				} 
				else if(val.isVisto==1)
				{
					icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>";
				}
				textComunTemp+=cmEtiquetaNotificado(val);
				if(cmEstaPendiente(val))
				{
					icono="<i class='fa fa-envelope fa-2x' style='color:#d9534f' aria-hidden='true'></i>" +
							"<div class='iconoAlerta'>" +
								"<i class='fa fa-exclamation-circle' style='color:#d9534f'></i>" +
							"</div>";
				}
				if(val.comunicado.enviarTodos==1 ||(val.comunicado.enviarTodos==0 && val.contratista.id==contratistaId))
				{
					if(val.comunicado.tipo.idTipo==2){ //Si es tipo Informativo
						numComunInformativo++;
						var iconoInform="";  
						textInform+=
								"<div style='border: 2px solid #2e9e8f;'class='eventoGeneral'>" +
									"<table class='table '>" +
										"<thead>" +
											"<tr>" +
												"<th style='width:50px;  border-right:2px solid #2e9e8f ;'>" +
												icono+" "+
												"</th>"+
												"<th style='    padding-left: 20px; font-weight:900' >" +
													"  "+textComunTemp+" "+
												"</th>"+
												"<th style='width:100px;     text-align: center;'>" +
													"<strong>" +val.comunicado.fechaMensajeTexto+"</strong>"+
												"</th>"+
												"<th     style='width: 20px;'>" +
													"<a id='iconoToggleInform"+val.comunicado.id+"' onclick='toggleInform("+val.comunicado.id+"); insertarComunicadoContratista("+val.comunicado.id+",\"Informativo\","+val.id+",0)' class='efectoLink'><i class='fa fa-angle-double-down fa-2x'></i> </a>"+
												"</th>"+
											"</tr>"+
										"</thead>"+ 
									"</table>"+ 
								 "</div>" +
								 "<div id='comInfor"+val.comunicado.id+"'class='eventoGeneral' style='display:none;'>" +  
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
												"<i class='fa fa-file-text-o'></i> Comunicado: "+
											"</section>"+
											"<section class='col col-xs-8'>" +
												val.comunicado.fechaMensajeTexto+ "<br><br>"+
												val.comunicado.comunicado+ 
											"</section>"+
										"</div>"+
										cmArchivoDelCliente(val)+
								 "</div>" ; 
					}
					else if(val.comunicado.tipo.idTipo==1) //si es tipo Aplicativo
					{
						var descargaEvidencia=URL+"/contratista/comunicado/reporteestado/evidencia?id="+val.id;
						numComunAplicativo++;
						var tipomensaje="";
						var textBaseAplic="";
						var menu=0;
						// P-A00018: estado de la evaluacion del cliente (1 aprobada, 2 observada, 3 pendiente, 4 por re-evaluar; sin estado = pendiente)
						var evalId=((val.evaluacion && val.evaluacion.id!=null)?Number(val.evaluacion.id):0);
						if(!cmRespondido(val))//Sin Atender
						{
							menu=2;
							tipoAplic="SinAtender";
							numComuSinAtender++; 
							tipomensaj="Requiere respuesta del Contratista";
						} 
						else if(evalId==2)//Observada por el cliente: requiere nueva respuesta
						{ 
							 tipoAplic="SinEval";
							 numComuSinEvaluar++;
							 tipomensaj="Requiere nueva respuesta del Contratista";
							 icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
									"<i class='fa fa-exclamation-circle'></i>" +
								"</div>"; 
						}
						else if(evalId==1)//Si esta aprobado
						{
							tipoAplic="ConEval"
							numComuConEvaluar++;
							tipomensaj="Aprobado por el Cliente";
							 icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
								"<i style='color:green' class='fa fa-check-circle'></i>"+
								"</div>";
						}
						else//Respuesta enviada, pendiente de evaluacion del cliente
						{
							tipoAplic="SinEval";
							numComuPendEval++;
							tipomensaj="Respuesta enviada, pendiente de evaluación del Cliente";
							icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
									"<i style='color:#f0a30a' class='fa fa-clock-o'></i>" +
								"</div>";
						}   
						textBaseAplic=
							"<div style='border: 2px solid #2e9e8f;'class='eventoGeneral'>" +
								"<table  class='table '>" +
									"<thead>" +
										"<tr>" +
											"<th style='width:50px;  border-right:2px solid #2e9e8f ;'>" +
											icono+" "+
											"</th>"+
											"<th  >" +
												"&nbsp&nbsp&nbsp<strong>"+textComunTemp+"</strong>"+
											"</th>"+
											"<th style='width:100px'>" +
												"<strong>" +val.comunicado.fechaMensajeTexto+"</strong>"+
											"</th>"+
											"<th style='width:40px'>" +
												"<a id='iconoToggle"+val.comunicado.id+"'onclick='toggleAplicComun("+val.comunicado.id+",\""+tipoAplic+"\"); insertarComunicadoContratista("+val.comunicado.id+",\""+tipoAplic+"\","+val.id+",0)' class='efectoLink'>" +
														"<i class='fa fa-angle-double-down fa-2x'></i> " +
												"</a>"+
											"</th>"+
										"</tr>"+
									"</thead>"+ 
								"</table>"+ 
							"</div>";
						 var listDatoComunicado=[
							{sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha de Mensaje:",inputForm:val.comunicado.fechaMensajeTexto,divContainer:""},
							{sugerencia:"",label:"<i class='fa fa-envelope-o'></i> Tipo de Mensaje:",inputForm:tipomensaj,divContainer:""},
							{sugerencia:"",label:"<i class='fa fa-file-text-o'></i> Comunicado: ",inputForm:val.comunicado.comunicado,divContainer:""},
							{sugerencia:"",label:"<i class='fa fa-calendar-check-o'></i> Plazo de Cumplimiento:",inputForm:val.comunicado.fechaImplementacionTexto,divContainer:""},
							{sugerencia:"",label:"<i class='fa fa-paperclip'></i> Archivo adjunto del Cliente: ",inputForm:""+ (val.comunicado.evidenciaNombre=="----"?"Sin Registro"
									:"<a class='efectoLink' href='"+URL+"/contratista/comunicado/evidencia?id="+Number(val.comunicado.id)+"'>"+cmEsc(val.comunicado.evidenciaNombre)+"</a>"),divContainer:""},
							{sugerencia:"",label:"<i class='fa fa-upload'></i> Mi respuesta: ",inputForm:cmMiRespuesta(val,descargaEvidencia),divContainer:""},
							{sugerencia:"",label:"",inputForm:" ",divContainer:""}
							];
						 var textComunicado="";
								 listDatoComunicado.forEach(function(val){
									textComunicado+=obtenerSubPanelModulo(val) 
								 });
						if(!cmRespondido(val)){
							//Si no han respondido
							textSinAtender+=textBaseAplic+
								"<div id='comAplic"+val.comunicado.id+"SinAtender' class='eventoGeneral' style='display:none;'>" +
									"<form class='eventoGeneral'>" +
										textComunicado+
									"</form>" +
									cmBloqueRespuesta(val,"Aplicativo")+
								"</div>" ;
						}else{ 
							if(evalId!=1){
								//Observada o pendiente de evaluacion
								var tarjetaSinEval=textBaseAplic+
										 "<div id='comAplic"+val.comunicado.id+"SinEval' class='eventoGeneral' style='display:none; padding:0px'>" +
											"<form class='eventoGeneral'>" +
												textComunicado+
											"</form>" +
											cmBloqueRespuesta(val,"Aplicativo")+
										"</div>" ;
							 if(evalId==2){textSinEval+=tarjetaSinEval;}else{textPendEval+=tarjetaSinEval;}
							 }else{
									//Si la evaluación del cliente es aprobada 
								 textConEval+=textBaseAplic+
								 "<div id='comAplic"+val.comunicado.id+"ConEval'class='eventoGeneral' style='display:none; ; padding:0px' >" +  
									 
									 "<form class='eventoGeneral'>" +
										textComunicado+
										"</form>" + 
										"<div class='row'>" +
											"<section class='col col-xs-12   '>" +
												"<a class='efectoLink' onclick='toggleEvidenciaAplic("+val.comunicado.id+",\"ConEval\")'>" +
													"Ver mi respuesta <i class='fa fa-angle-double-down'></i>" +
											"</a>"+ 
											"</section>"+
										"</div>"+
									"<div class='modal-footer' style='border-color:#2e9e8f;'></div>"+
									"<div  id='evidenciaConEval"+val.comunicado.id+"' style='display:none;'>" +
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<i class='fa fa-calendar'></i> Fecha de mi respuesta: <br><br>"+
												"<i class='fa fa-download'></i> Mi respuesta: <br><br>"+
												"</section>"+
											"<section class='col col-xs-5'>" +
												val.fechaSubidaTexto+"<br><br>"+
												"<a class='efectoLink' href='"+descargaEvidencia+"'>"+ val.evidenciaNombre+"</a><br><br>"+ 
											"</section>"+
										"</div>"+
									"</div>"+
								"</div>" ;
							 }
							 
						}
					}
				} 
					 
			}); 
			
			listPanelesPrincipal.push( 
					{id:"comunInform" ,clase:"",nombre:""+"Comunciados Informativos ("+numComunInformativo+")",
						contenido:	"<div class='eventoGeneral divComunInform'>"+ 
										( numComunInformativo==0? 
										"<label style='color:#2e9e8f; font-size:17px;'>" +
											"<strong>Sin Comunicados... </strong>" +
										"</label>":textInform)+
									"</div>"},
					{id:"comunAplic" ,clase:"",nombre:""+"Comunicados del Cliente que Requieren Respuesta ("+numComunAplicativo+")",
						contenido:	"<div class='eventoGeneral divComunAplic'>" +
										"<div style='border: 2px solid #2e9e8f;' class='eventoGeneral'>"+
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Sin atender("+numComuSinAtender+")</strong> " +
											"<button id='iconoToggleSinAtender'class='btn btn-success'  style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;'onclick='toggleAplic(\"SinAtender\")'>" +
												"<i class='fa fa-caret-down'></i>" +
											"</button>" +
										"</div> " +	
										"<div class='comuSinAtender eventoGeneral' style='display:none; padding: 0px;'>"+
											(numComuSinAtender==0? 
												"<label style='color:#2e9e8f; font-size:17px;'>" +
													"<strong>Sin Comunicados... </strong>" +
												"</label>":textSinAtender)+
										"</div>" +
										"<div class='eventoGeneral divPendEval' style='border: 2px solid #2e9e8f;'>" +
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Respuesta enviada / Pendiente de evaluación ("+numComuPendEval+")</strong>" +
											"<button id='iconoTogglePendEval' style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;' class='btn btn-success' onclick='toggleAplic(\"PendEval\")'>" +
												"<i class='fa fa-caret-down'></i> " +
										"</button> " +
									"</div>" +
									"<div class='comuPendEval eventoGeneral' style='display:none; padding: 0px;'>"+
										(numComuPendEval==0? 
											"<label style='color:#2e9e8f; font-size:17px;'>" +
												"<strong>Sin Comunicados... </strong>" +
											"</label>":textPendEval)+
									"</div>" +

										"<div  class='eventoGeneral divSinEval' style='border: 2px solid #2e9e8f; '>" +
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Respuesta / Observado ("+numComuSinEvaluar+") </strong>" +
											"<button id='iconoToggleSinEval' style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;' class='btn btn-success' onclick='toggleAplic(\"SinEval\")'>" +
												"<i class='fa fa-caret-down'></i> " +
											"</button> " +
										"</div>" + 
										"<div class='comuSinEval eventoGeneral' style='display:none  '>"+
												(numComuSinEvaluar==0? 
												"<label style='color:#2e9e8f; font-size:17px;'>" +
													"<strong>Sin Comunicados... </strong>" +
												"</label>":textSinEval)+
										"</div>" +
										"<div  class='eventoGeneral divConEval'  style='border: 2px solid #2e9e8f;'>" +
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Respuesta / Aprobado ("+numComuConEvaluar+")</strong>" +
											"<button id='iconoToggleConEval' style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;' class='btn btn-success' onclick='toggleAplic(\"ConEval\")'>" +
												"<i class='fa fa-caret-down'></i> " +
											"</button> " +
										"</div>" +
										"<div class='comuConEval eventoGeneral' style='display:none;  padding: 0px '>"+ 
												(numComuConEvaluar==0? 
												"<label style='color:#2e9e8f; font-size:17px;'>" +
													"<strong>Sin Comunicados... </strong>" +
												"</label>":textConEval)+
										"</div>" + 
									"</div> "}		
			); 
		  
			agregarPanelesDivPrincipal(listPanelesPrincipal); 
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
// Al abrir un comunicado por primera vez se crea el registro de la contratista y queda "visto" (todavia no "notificado").
// La respuesta (texto y/o archivo) ya no pasa por aqui: se envia en una sola peticion con cmEnviarRespuesta.
function insertarComunicadoContratista(idcomunicado,tipoMenu,id,opc)
{
	if(id==null)
	{
		var dataParam=
		{
			id: 0,
			comunicado:{id:idcomunicado},
			contratista:{id:contratistaId},
			isVisto: 1
		};
		callAjaxPost(URL + '/contratista/comunicado/reporteestado/save',dataParam,function(){
			$("#iconoToggle"+idcomunicado+"").attr("onclick","toggleAplicComun("+idcomunicado+",\""+"SinAtender"+"\");")   });
	}
}
 //-------------------------------------------------------------------
 


//-------------------------------------------------------------------
// P-A00018: aviso destacado de comunicados y constancia de lectura ("Notificado")
//-------------------------------------------------------------------
var cmPendientes = [];

function cmEsc(texto) {
	return $("<div>").text(texto == null ? "" : String(texto)).html();
}

// Comunicado nuevo (registrado desde P-A00018, trae fecha de creacion) que la contratista aun no notifica
function cmEstaPendiente(val) {
	return !!(val && val.comunicado && val.comunicado.fechaCreacionTexto && !val.fechaNotificadoTexto);
}

function cmEtiquetaNotificado(val) {
	if (val && val.fechaNotificadoTexto) {
		return " <span class='label label-success' style='font-size:11px'>Notificado el " + cmEsc(val.fechaNotificadoTexto) + "</span>";
	}

	if (cmEstaPendiente(val)) {
		return " <span class='label label-danger' style='font-size:11px'>Sin notificar</span>";
	}

	return "";
}

// Estilos del aviso (una sola vez): propios del aviso, no dependen de las hojas de estilo de la pagina
function cmInyectarEstilos() {
	if ($("#cmEstilos").length) {
		return;
	}

	$("head").append("<style id='cmEstilos'>"
		+ "@keyframes cmCampana{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(16deg)}70%{transform:rotate(-14deg)}78%{transform:rotate(10deg)}86%{transform:rotate(-6deg)}94%{transform:rotate(2deg)}}"
		+ "#cmFranjaAviso{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;padding:9px 16px;color:#fff;font-size:15px;cursor:pointer;"
		+ "background:linear-gradient(90deg,#b93a2e,#e04b3a);box-shadow:0 2px 6px rgba(0,0,0,.22)}"
		+ "#cmFranjaAviso .cm-franja-campana{display:inline-block;margin-right:10px;font-size:18px;animation:cmCampana 2.6s ease-in-out infinite;transform-origin:50% 0}"
		+ "#cmFranjaAviso .cm-franja-boton{margin-left:14px;background:#fff;color:#b93a2e;border:0;border-radius:18px;padding:4px 16px;font-weight:700;font-size:13px}"
		+ "#cmModalAviso .modal-content{border:0;border-radius:14px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.38)}"
		+ "#cmModalAviso .cm-cabecera{padding:22px 26px 18px;background:#fff;border-top:6px solid #e04b3a;overflow:hidden}"
		+ "#cmModalAviso .cm-cabecera-icono{float:left;width:48px;height:48px;line-height:48px;margin-right:16px;border-radius:50%;text-align:center;font-size:23px;background:#fdecea;color:#e04b3a}"
		+ "#cmModalAviso .cm-titulo{margin:0;font-size:23px;font-weight:700;color:#1f2d3d}"
		+ "#cmModalAviso .cm-subtitulo{margin:4px 0 0;font-size:14px;line-height:1.4;color:#667587}"
		+ "#cmModalAviso .cm-cuerpo{padding:4px 26px;background:#f4f6f9;max-height:56vh;overflow-y:auto}"
		+ "#cmModalAviso .cm-tarjeta{margin:14px 0;padding:16px 18px 14px;background:#fff;border:1px solid #e2e7ee;border-left:6px solid #2b78c2;border-radius:10px;box-shadow:0 1px 3px rgba(20,40,70,.07)}"
		+ "#cmModalAviso .cm-tarjeta.cm-aplicativo{border-left-color:#f0a30a}"
		+ "#cmModalAviso .cm-meta{margin-bottom:10px}"
		+ "#cmModalAviso .cm-chip{display:inline-block;margin-right:10px;padding:3px 11px;border-radius:12px;font-size:12px;font-weight:700;color:#fff;background:#2b78c2}"
		+ "#cmModalAviso .cm-aplicativo .cm-chip{background:#f0a30a;color:#3b2a00}"
		+ "#cmModalAviso .cm-fecha{font-size:13px;color:#667587}"
		+ "#cmModalAviso .cm-texto{margin:0 0 12px;font-size:16px;line-height:1.55;color:#1f2d3d;white-space:pre-wrap;word-wrap:break-word}"
		+ "#cmModalAviso .cm-nota{margin:0 0 12px;padding:9px 12px;font-size:13px;line-height:1.45;color:#6b4e00;background:#fff7e0;border:1px solid #f6df9d;border-radius:7px}"
		+ "#cmModalAviso .cm-plazo{margin:0 0 12px;font-size:13px;color:#44566a}"
		+ "#cmModalAviso .cm-plazo b{color:#1f2d3d}"
		+ "#cmModalAviso .cm-acciones{text-align:right}"
		+ "#cmModalAviso .cm-boton{border:0;border-radius:8px;padding:11px 24px;font-size:15px;font-weight:700;color:#fff;background:#1f9d57;cursor:pointer}"
		+ "#cmModalAviso .cm-boton:hover{background:#188548}"
		+ "#cmModalAviso .cm-boton[disabled]{opacity:.6;cursor:wait}"
		+ "#cmModalAviso .cm-pie{padding:14px 26px;background:#fff;border-top:1px solid #e2e7ee;overflow:hidden}"
		+ "#cmModalAviso .cm-contador{float:left;margin-top:8px;font-size:13px;color:#667587}"
		+ "#cmModalAviso .cm-cerrar{float:right;padding:8px 20px;font-size:14px;color:#44566a;background:#fff;border:1px solid #c3ccd7;border-radius:8px;cursor:pointer}"
		+ "#cmModalAviso .cm-cerrar:hover{background:#f1f4f8}"
		+ "#cmModalAviso .cm-listo{padding:34px 10px;text-align:center;color:#1f9d57}"
		+ "#cmModalAviso .cm-listo i{display:block;margin-bottom:10px;font-size:54px}"
		+ "#cmModalAviso .cm-listo span{font-size:18px;font-weight:700;color:#1f2d3d}"
		+ "@media (max-width:600px){#cmModalAviso .cm-cabecera,#cmModalAviso .cm-cuerpo,#cmModalAviso .cm-pie{padding-left:14px;padding-right:14px}"
		+ "#cmModalAviso .cm-titulo{font-size:19px}#cmModalAviso .cm-acciones{text-align:center}#cmModalAviso .cm-boton{width:100%}}"
		+ "</style>");
}

// Pide los comunicados nuevos sin notificar. Es silencioso: si falla, la contratista sigue trabajando sin aviso
function cargarAvisoComunicados() {
	$.ajax({
		url: URL + "/contratista/comunicado/pendientes", type: "post", xhrFields: {withCredentials: true},
		data: "{}", contentType: "application/json",
		success: function (data) {
			if (data && data.CODE_RESPONSE === "05" && data.list) {
				cmPendientes = data.list;
				pintarAvisoComunicados(true);
			}
		}
	});
}

function cmTarjetaComunicado(c) {
	var aplicativo = (Number(c.tipoId) === 1);
	var h = "<div id='cmItem" + Number(c.id) + "' class='cm-tarjeta" + (aplicativo ? " cm-aplicativo" : "") + "'>"
		+ "<div class='cm-meta'><span class='cm-chip'><i class='fa " + (aplicativo ? "fa-reply" : "fa-info-circle") + "' aria-hidden='true'></i> "
		+ (aplicativo ? "Requiere respuesta" : "Informativo") + "</span>"
		+ "<span class='cm-fecha'><i class='fa fa-calendar-o' aria-hidden='true'></i> " + cmEsc(c.fecha) + (c.hora ? " &middot; " + cmEsc(c.hora) : "") + "</span></div>"
		+ "<p class='cm-texto'>" + cmEsc(c.texto) + "</p>"
		+ (c.archivoNombre ? "<p class='cm-plazo'><i class='fa fa-paperclip' aria-hidden='true'></i> Archivo adjunto del Cliente: <a href='" + cmEsc(URL + "/contratista/comunicado/evidencia?id=" + Number(c.id)) + "' target='_blank' rel='noopener'>" + cmEsc(c.archivoNombre) + "</a></p>" : "");

	if (aplicativo) {
		h += "<p class='cm-nota'><i class='fa fa-exclamation-triangle' aria-hidden='true'></i> Este comunicado requiere que usted envíe su respuesta (un texto, un archivo o ambos). "
			+ "<b>Notificado</b> confirma que lo leyó; la respuesta se envía desde la sección Comunicados.</p>";

		if (c.fechaImplementacion) {
			h += "<p class='cm-plazo'><i class='fa fa-calendar-check-o' aria-hidden='true'></i> Plazo de cumplimiento: <b>" + cmEsc(c.fechaImplementacion) + "</b></p>";
		}
	}

	return h + "<div class='cm-acciones'><button type='button' class='cm-boton' onclick='notificarComunicado(" + Number(c.id) + ")'>"
		+ "<i class='fa fa-check' aria-hidden='true'></i> Notificado</button></div></div>";
}

function pintarAvisoComunicados(abrir) {
	var n = cmPendientes.length, i, h = "";

	cmInyectarEstilos();
	$("#cmFranjaAviso").remove();

	if (!n) {
		// si el aviso esta abierto se muestra un "listo" un instante antes de cerrarlo
		if ($("#cmModalAviso").hasClass("in")) {
			$("#cmModalAvisoCuerpo").html("<div class='cm-listo'><i class='fa fa-check-circle' aria-hidden='true'></i><span>Listo, no tiene comunicados pendientes</span></div>");
			$("#cmModalAvisoContador").text("");
			$("#cmModalAvisoTitulo").text("Comunicados al día");
			setTimeout(function () {
				$("#cmModalAviso").modal("hide");
			}, 1400);
		}

		return;
	}

	var texto = (n === 1 ? "Tiene 1 comunicado sin notificar" : "Tiene " + n + " comunicados sin notificar");
	var franja = "<div id='cmFranjaAviso' role='alert' onclick='abrirAvisoComunicados()'><i class='fa fa-bell cm-franja-campana' aria-hidden='true'></i>"
		+ "<span>" + cmEsc(texto) + "</span><span class='cm-franja-boton'>Ver comunicados</span></div>";

	if ($("#barraMenu").length) {
		$("#barraMenu").after(franja);
	} else {
		$("body").prepend(franja);
	}

	for (i = 0; i < n; i++) {
		h += cmTarjetaComunicado(cmPendientes[i]);
	}

	if (!$("#cmModalAviso").length) {
		$("body").append(
			"<div class='modal fade' id='cmModalAviso' tabindex='-1' role='dialog' aria-labelledby='cmModalAvisoTitulo' data-backdrop='static'>"
			+ "<div class='modal-dialog' style='width:680px;max-width:94%'><div class='modal-content'>"
			+ "<div class='cm-cabecera'><div class='cm-cabecera-icono'><i class='fa fa-bell' aria-hidden='true'></i></div>"
			+ "<h4 class='cm-titulo' id='cmModalAvisoTitulo'></h4>"
			+ "<p class='cm-subtitulo'>Confirme con <b>Notificado</b> que leyó cada comunicado. Mientras tenga pendientes, verá este aviso en la parte superior.</p></div>"
			+ "<div class='cm-cuerpo' id='cmModalAvisoCuerpo'></div>"
			+ "<div class='cm-pie'><span class='cm-contador' id='cmModalAvisoContador'></span>"
			+ "<button type='button' class='cm-cerrar' data-dismiss='modal'>Cerrar</button></div>"
			+ "</div></div></div>");
	}

	$("#cmModalAvisoTitulo").text(n === 1 ? "Tiene 1 comunicado sin notificar" : "Tiene " + n + " comunicados sin notificar");
	$("#cmModalAvisoCuerpo").html(h);
	$("#cmModalAvisoContador").text(n === 1 ? "1 comunicado pendiente" : n + " comunicados pendientes");

	if (abrir) {
		$("#cmModalAviso").modal("show");
	}
}

function abrirAvisoComunicados() {
	if (cmPendientes.length) {
		$("#cmModalAviso").modal("show");
	}
}

// "Notificado": el servidor guarda la fecha y hora (solo la primera vez) y el comunicado sale del aviso
function notificarComunicado(id) {
	id = Number(id);

	$("#cmItem" + id + " button").prop("disabled", true);

	$.ajax({
		url: URL + "/contratista/comunicado/notificar", type: "post", xhrFields: {withCredentials: true},
		data: JSON.stringify({comunicadoId: id}), contentType: "application/json",
		success: function (data) {
			if (data && data.CODE_RESPONSE === "05") {
				cmPendientes = $.grep(cmPendientes, function (c) {
					return Number(c.id) !== id;
				});

				$("#cmItem" + id).fadeOut(180, function () {
					pintarAvisoComunicados(false);
				});

				return;
			}

			cmErrorNotificar(id);
		},
		error: function () {
			cmErrorNotificar(id);
		}
	});
}

function cmErrorNotificar(id) {
	$("#cmItem" + id + " button").prop("disabled", false);
	alert("No se pudo registrar la notificación. Intente nuevamente.");
}

// Un comunicado esta atendido si la contratista envio un texto, un archivo o ambos
function cmRespondido(val) {
	return !!((val.evidenciaNombre && val.evidenciaNombre.length > 0) || (val.respuestaTexto && val.respuestaTexto.length > 0));
}

// Fila "Mi respuesta": lo que la contratista ya envio (texto y/o archivo con enlace para abrirlo) o aviso de que falta
function cmMiRespuesta(val, urlDescarga) {
	var h = "";

	if (val.respuestaTexto && val.respuestaTexto.length > 0) {
		h += "<div style='white-space:pre-wrap'>" + cmEsc(val.respuestaTexto) + "</div>";
	}

	if (val.evidenciaNombre && val.evidenciaNombre.length > 0) {
		h += "<div><i class='fa fa-paperclip' aria-hidden='true'></i> <a class='efectoLink' href='" + cmEsc(urlDescarga) + "'>" + cmEsc(val.evidenciaNombre) + "</a></div>";
	}

	if (h === "") {
		return "<span style='color:#c0392b'>Aún no ha enviado su respuesta</span>";
	}

	if (val.fechaSubidaTexto && val.fechaSubidaTexto !== "----") {
		h += "<small>Enviada el " + cmEsc(val.fechaSubidaTexto) + "</small>";
	}

	return h;
}

// Bloque para responder un comunicado Aplicativo: un texto, un archivo o ambos
function cmBloqueRespuesta(val, tipo) {
	var cid = Number(val.comunicado.id);
	var yaRespondio = cmRespondido(val);
	var titulo = (yaRespondio ? "Cambiar mi respuesta" : "Enviar mi respuesta");
	var h = "<div id='cmResp" + cid + "' style='margin:12px 0 4px;padding:12px 14px;border-top:1px solid #2e9e8f;background:#f7fbfa'>";

	h += "<p><strong>" + cmEsc(titulo) + "</strong></p>"
		+ "<label for='cmTexto" + cid + "'>Texto de la respuesta</label>"
		+ "<textarea id='cmTexto" + cid + "' class='form-control' rows='3' maxlength='1000' placeholder='Escriba aquí su respuesta (máximo 1000 caracteres)'>"
		+ cmEsc(val.respuestaTexto) + "</textarea>"
		+ "<label for='cmArchivo" + cid + "' style='margin-top:10px'>Archivo (opcional)</label>"
		+ "<input type='file' id='cmArchivo" + cid + "' class='form-control'>"
		+ "<small class='text-muted'>Puede enviar un texto, un archivo o ambos. Máximo 15 MB."
		+ (val.evidenciaNombre ? " Si no elige un archivo nuevo se conserva el ya enviado (" + cmEsc(val.evidenciaNombre) + ")." : "") + "</small>"
		+ "<div style='margin-top:12px'><button type='button' class='btn btn-success' id='cmBtnResp" + cid + "' onclick='cmEnviarRespuesta(" + cid + ")'>"
		+ "<i class='fa fa-paper-plane' aria-hidden='true'></i> Enviar respuesta</button><span id='cmMsgResp" + cid + "' style='margin-left:10px'></span></div></div>";

	return h;
}

// Envia el texto y/o el archivo en una sola peticion; el servidor toma la contratista de la sesion y deja el estado en pendiente
function cmEnviarRespuesta(cid) {
	cid = Number(cid);

	var texto = $.trim($("#cmTexto" + cid).val() || "");
	var input = document.getElementById("cmArchivo" + cid);
	var archivo = (input && input.files && input.files.length ? input.files[0] : null);
	var mensaje = $("#cmMsgResp" + cid);
	var boton = $("#cmBtnResp" + cid);

	function error(motivo) {
		boton.prop("disabled", false);
		mensaje.css("color", "#c0392b").text(motivo);
	}

	if (!texto && !archivo) {
		error("Escriba un texto o adjunte un archivo.");
		return;
	}

	if (texto.length > 1000) {
		error("El texto no puede pasar de 1000 caracteres.");
		return;
	}

	if (archivo && archivo.size > 15360000) {
		error("El archivo no puede pasar de 15 MB.");
		return;
	}

	if (archivo && archivo.name.length > 200) {
		error("El nombre del archivo es muy largo (máximo 200 caracteres).");
		return;
	}

	var datos = new FormData();
	datos.append("comunicadoId", cid);
	datos.append("texto", texto);

	if (archivo) {
		datos.append("fileEvi", archivo);
	}

	boton.prop("disabled", true);
	mensaje.css("color", "#44566a").text("Enviando...");

	$.ajax({
		url: URL + "/contratista/comunicado/respuesta", type: "post", data: datos, processData: false, contentType: false,
		xhrFields: {withCredentials: true},
		success: function (data) {
			if (data && data.CODE_RESPONSE === "05") {
				habilitarComunicadoContratista();
				return;
			}

			error((data && data.MENSAJE) || "No se pudo enviar su respuesta. Intente nuevamente.");
		},
		error: function (xhr) {
			var motivo = null;

			try {
				motivo = JSON.parse(xhr.responseText).MENSAJE;
			} catch (e) {
				motivo = null;
			}

			error(motivo || "No se pudo enviar su respuesta. Intente nuevamente.");
		}
	});
}

// Fila "Archivo adjunto del Cliente" de un informativo: el archivo que el administrador adjunto al comunicado (con enlace para abrirlo)
function cmArchivoDelCliente(val) {
	var nombre = val.comunicado.evidenciaNombre;

	if (!nombre || nombre === "----") {
		return "";
	}

	return "<div class='row' style='margin-top:10px'>"
		+ "<section class='col col-xs-4'><i class='fa fa-paperclip' aria-hidden='true'></i> Archivo adjunto del Cliente: </section>"
		+ "<section class='col col-xs-8'><a class='efectoLink' href='" + cmEsc(URL + "/contratista/comunicado/evidencia?id=" + Number(val.comunicado.id)) + "'>" + cmEsc(nombre) + "</a></section>"
		+ "</div>";
}
