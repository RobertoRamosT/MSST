/**
 * 
 */
var listFullComunTrabajador=[];  
var comunicadoTrabajadorId; 
//var indexEvidenciaFunction; 
var trabajadorId;
//var tipoAplic=""; 
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
/* function toggleAplic(tipo)
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
function toggleMenuOpcion(obj,pindex,menu)
{
	$(".listaGestionGosst").hide();
	indexEvidenciaFunction=pindex;
	indexOpc=pindex;
	$(obj).parent(".containerEvidencia"+menu+pindex).find("ul").toggle();
	$(obj).parent(".containerEvidencia"+menu+pindex).siblings().find("ul").hide();
	
} 
var funcionalidadCambiarEvidencia=
	[
		{menu:"SinAtender",opcion:
			[{id:"opcNuevaEvi",nombre:"<i class='fa fa-refresh'></i> Subir Evidencia",functionClick:
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
			[{id:"opcCambEvi",nombre:"<i class='fa fa-refresh'></i> Cambiar Evidencia",functionClick: 
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
		{menu:"ConEval",opcion:[{id:"opcCambEvi",nombre:"<i class='fa fa-refresh'></i> Cambiar Evidencia",functionClick:function(data){alert("xdConvEval");}}]}
	];
function marcarSubOpcion(pindex,pindex1)
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
				menuOpcionEvi[index1]+="<li id='"+val2.id+menu+idpindex+"'style='width:140px;top:-22px; display:none;'class='list-group-item' onclick='marcarSubOpcion("+index1+","+index2+")'>"+val2.nombre+"</li>";					
			}
			else
			{
				menuOpcionEvi[index1]+="<li id='"+val2.id+menu+idpindex+"'style='width:170px;top:-22px;'class='list-group-item' onclick='marcarSubOpcion("+index1+","+index2+")'>"+val2.nombre+"</li>";
			}
			});
		menuOpcionEvi[index1]+="</ul>";
	});
}*/
function habilitarComunicadoTrabajador(){
    
	trabajadorId=parseInt(getSession("trabajadorGosstId")); 
	empresaId=parseInt(getSession("gestopcompanyid"));
	var dataParam={ 
				trabajadorId:trabajadorId,
				empresaId:empresaId};
	callAjaxPost(URL + '/scheduler/comunicado/reporteestado', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			var textInform="";  
			var  numComunInformativo=0, numComunAplicativo=0;
			//var  numComuSinEvaluar=0, numComuConEvaluar=0, numComuSinAtender=0;
			/*var textSinAtender="";
			var textSinEval="";
			var textConEval="";*/
			var textComunTemp="";
			listFullComunTrabajador=data.list;  
			$(".divListPrincipal").html("");
			listFullComunTrabajador.forEach(function(val,index){ 
					//ListarOpcionesEvi(val.comunicado.id); 
			    if(val.comunicado.isOculto==0){
			    
					var icono;	
					if((val.comunicado.comunicado).length>=35)
					{
						textComunTemp=(val.comunicado.comunicado).substring(0,35)+"...";
					}
					else{
						textComunTemp=val.comunicado.comunicado;
					}  
					if(val.fechaVistoTexto==null)
					{
						icono="<i class='fa fa-envelope-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
									"<i class='fa fa-exclamation-circle'></i>" +
								"</div>";
					} 
					else 
					{
						icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>";
					}
					    
					if(val.comunicado.tipo.idTipo==2){ //Si es tipo Informativo
					    numComunInformativo++; 
					    textInform+=
								"<div style='border: 2px solid #2e9e8f;'class='eventoGeneral'>" +
									"<table>" +
										"<thead>" +
											"<tr>" +
												"<th style='width:180px;  border-right:2px solid #2e9e8f ;'>" +
												icono+"&nbsp<strong>Comunicado "+val.comunicado.id+"</strong>"+
												"</th>"+
												"<th style='width:350px; padding-left:10px'>" +
													//"&nbsp&nbsp&nbsp<strong>"+textComunTemp+"</strong>"+
													"<strong>"+textComunTemp+"</strong>"+
												"</th>"+
												"<th style='width:100px'>" +
													"<strong>" +val.comunicado.fechaMensajeTexto+"</strong>"+
												"</th>"+
												"<th>" +
													"<a id='iconoToggleInform"+val.comunicado.id+"' onclick='toggleInform("+val.comunicado.id+"); insertarComunicadoTrabajador("+val.comunicado.id+",\"Informativo\","+val.id+",0)' class='efectoLink'><i class='fa fa-angle-double-down fa-2x'></i> </a>"+
												"</th>"+
											"</tr>"+
										"</thead>"+ 
									"</table>"+ 
								 "</div>" +
								 "<div id='comInfor"+val.comunicado.id+"'class='eventoGeneral' style='display:none;'>" +  
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
											"</section>" +
											"<section class='col col-xs-8'>" +
											val.comunicado.fechaMensajeTexto+ "<br><br>"+
											"</section>"+
										"</div>"+
										
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<i class='fa fa-file-text-o'></i> Comunicado:"+
											"</section>" +
											"<section class='col col-xs-8'>" +
												val.comunicado.comunicado+
											"</section>"+
										"</div>"+
										
										(val.comunicado.link!="" ? 
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<br><i class='fa fa-link'></i> Link URL:" +
											"</section>" +
											"<section class='col col-xs-8'>" +
												"<br><a style='color:blue; overflow-wrap:anywhere;' href='"+val.comunicado.link+"' target='_blank'>"+val.comunicado.link+"</a>" +
											"</section>" +
										"</div>" : "") +
						
										
										
										(val.comunicado.evidencia!=null ? 
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<br><i class='fa fa-link'></i> Evidencia: " +
												"<a href='"+URL+"/scheduler/comunicado/evidencia?id="+val.comunicado.id+"' target='_blank'>" +
													"<button id='botonDescargarEvidenciaCom"+val.comunicado.id+"' type='button' class='btn btn-success' style='"+(userAgent==true ? "padding:2px 5px" : "padding:0 2px")+"'>" +
													"<i class='fa fa-download fa-lg'></i></button>" +
												"</a>" +
											"</section>" +
											"<section class='col col-xs-8'>" +
												"<br><img style='width:"+(userAgent==true ? "-webkit-fill-available" : "345px")+"; object-fit:contain;' class='cropGosst' src='data:image/png;base64,"+val.comunicado.evidencia+"'>" +
											"</section>" +
										"</div>" : "");
										
									
									// Asi se hacia antes >>
									
//								 		"<div class='row'>" +
//											"<section class='col col-xs-4'>" +
//												"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
//												"<i class='fa fa-file-text-o'></i> Comunicado: "+
//											"</section>"+
//											"<section class='col col-xs-8'>" +
//												val.comunicado.fechaMensajeTexto+ "<br><br>"+
//												val.comunicado.comunicado+ 
//											"</section>"+
//										"</div>"+
									
									// <<
								 +"</div>" ; 
						}
					/*else if(val.comunicado.tipo.idTipo==1) //si es tipo Aplicativo
					{
						var descargaEvidencia=URL+"/contratista/comunicado/reporteestado/evidencia?id="+val.id;
						numComunAplicativo++;
						var tipomensaje="";
						var textBaseAplic="";
						var menu=0;
						if((val.evidenciaNombre).length<1)//Sin Atender
						{
							menu=2;
							tipoAplic="SinAtender";
							numComuSinAtender++; 
							tipomensaj="Requiere respuesta del Contratista";
						} 
						else if(val.evaluacion.id==2)//Sin Evaluacion, Desaprobado u Observacion
						{ 
							 tipoAplic="SinEval";
							 numComuSinEvaluar++;
							 tipomensaj="Requiere nueva respuesta del Contratista";
							 icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
									"<i class='fa fa-exclamation-circle'></i>" +
								"</div>"; 
						}
						else if(val.evaluacion.id==1)//Si esta aprobado
						{
							tipoAplic="ConEval"
							numComuConEvaluar++;
							tipomensaj="Aprobado por el Cliente";
							 icono="<i class='fa fa-envelope-open-o fa-2x' aria-hidden='true'></i>" +
								"<div class='iconoAlerta'>" +
								"<i style='color:green' class='fa fa-check-circle'></i>"+
								"</div>";
						}   
						textBaseAplic=
							"<div style='border: 2px solid #2e9e8f;'class='eventoGeneral'>" +
								"<table>" +
									"<thead>" +
										"<tr>" +
											"<th style='width:180px;  border-right:2px solid #2e9e8f ;'>" +
											icono+"&nbsp<strong>Comunicado "+val.comunicado.id+"</strong>"+
											"</th>"+
											"<th style='width:350px'>" +
												"&nbsp&nbsp&nbsp<strong>"+textComunTemp+"</strong>"+
											"</th>"+
											"<th style='width:100px'>" +
												"<strong>" +val.comunicado.fechaMensajeTexto+"</strong>"+
											"</th>"+
											"<th>" +
												"<a id='iconoToggle"+val.comunicado.id+"'onclick='toggleAplicComun("+val.comunicado.id+",\""+tipoAplic+"\"); insertarComunicadoContratista("+val.comunicado.id+",\""+tipoAplic+"\","+val.id+",0)' class='efectoLink'>" +
														"<i class='fa fa-angle-double-down fa-2x'></i> " +
												"</a>"+
											"</th>"+
										"</tr>"+
									"</thead>"+ 
								"</table>"+ 
							"</div>";
						if((val.evidenciaNombre).length<1){ 
							//Si no han respondido
							textSinAtender+=textBaseAplic+ 
								"<div id='comAplic"+val.comunicado.id+"SinAtender'class='eventoGeneral' style='display:none;' >" +  
									"<div class='row'>" +
										"<section class='col col-xs-4'>" +
											"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
											"<i class='fa fa-envelope-o'></i> Tipo de Mensaje: <br><br>"+
											"<i class='fa fa-file-text-o'></i> Comunicado: <br><br>"+
											"<i class='fa fa-calendar-check-o'></i> Plazo de &nbsp&nbsp&nbsp&nbsp&nbspCumplimiento:"+
										"</section>"+
										"<section class='col col-xs-8'>" +
											val.comunicado.fechaMensajeTexto+ "<br><br>"+
											tipomensaj+ "<br><br>"+
											val.comunicado.comunicado+ "<br><br>"+
											val.comunicado.fechaImplementacionTexto+ 
										"</section>"+
									"</div>" + 
									"<div class='row'>" +
										"<section class='col col-xs-12 containerEvidenciaSinAtender"+val.comunicado.id+"'>" +
											"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+val.comunicado.id+",\"SinAtender\")'>" +
													"Ver Opción <i class='fa fa-angle-double-down'></i>" +
											"</a>"+menuOpcionEvi[0]+
										"</section>"+
									"</div>"+
									"<div class='modal-footer' style='border-color:#2e9e8f;'></div>"+
										"<div id='evidenciaSubirSinAtender"+val.comunicado.id+"' style='display:none;'class='row'>" +
											"<section class='col col-xs-3'><br>" +
												"<i class='fa fa-upload'></i> Evidencia: <br><br>"+ 
											"</section>"+
											"<section class='col col-xs-6'><br>" +
												"<div class='evidenciaSubirSinAtender"+val.comunicado.id+"' >" +
												"</div><br>"+
												"<button class='btn btn-success' onclick='insertarComunicadoContratista("+val.comunicado.id+",\""+tipoAplic+"\","+val.id+",1)'>Guardar</button>"+
											"</section>"+
										"</div>"+
								"</div>" ;
						}else{ 
							if(val.evaluacion.id==2){
								//Si la evaluación es desaprobada u otros 
								textSinEval+=textBaseAplic+ 
										 "<div id='comAplic"+val.comunicado.id+"SinEval'class='eventoGeneral' style='display:none;' >" +  
											"<div class='row'>" +
												"<section class='col col-xs-4'>" +
													"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
													"<i class='fa fa-envelope-o'></i> Tipo de Mensaje: <br><br>"+
													"<i class='fa fa-file-text-o'></i> Comunicado: <br><br>"+
													"<i class='fa fa-calendar-check-o'></i> Plazo de &nbsp&nbsp&nbsp&nbsp&nbspCumplimiento: <br><br>"+
													"<i class='fa fa-calendar-check-o'></i> Observaciones : <br><br>"+
													"<a class='efectoLink' onclick='toggleEvidenciaAplic("+val.comunicado.id+",\"SinEval\")'>" +
															"Ver Evidencia <i class='fa fa-angle-double-down'></i>" +
													"</a>"+
												"</section>"+
												"<section class='col col-xs-8'>" +
													val.comunicado.fechaMensajeTexto+ "<br><br>"+
													tipomensaj+ "<br><br>"+
													val.comunicado.comunicado+ "<br><br>"+
													val.comunicado.fechaImplementacionTexto+"<br><br><br>"+
													val.observaciones+
												"</section>"+
											"</div>" + 
											"<br><div class='modal-footer' style='border-color:#2e9e8f;'></div>"+
											"<div  id='evidenciaSinEval"+val.comunicado.id+"' style='display:none;'>" +
												"<div class='row'>" +
													"<section class='col col-xs-4'>" +
														"<i class='fa fa-calendar'></i> Fecha de Evidencia: <br><br>"+
														"<i class='fa fa-download'></i> Evidencia: <br><br>"+
														"</section>"+
													"<section class='col col-xs-5'>" +
														val.fechaSubidaTexto+"<br><br>"+
														"<a class='efectoLink' href='"+descargaEvidencia+"'>"+ val.evidenciaNombre+"</a><br><br>"+ 
													"</section>"+
													"<section class='col col-xs-3 containerEvidenciaSinEval"+val.comunicado.id+"'>" +
														"<a class='efectoLink' onclick='toggleMenuOpcion(this,"+val.comunicado.id+",\"SinEval\")'>" +
																"Ver Opción <i class='fa fa-angle-double-down'></i>" +
														"</a>"+menuOpcionEvi[1]+
													"</section>"+ 
												"</div>"+
												"<div id='evidenciaSubirSinEval"+val.comunicado.id+"' style='display:none;'class='row'>" +
													"<section class='col col-xs-3'><br>" +
														"<i class='fa fa-upload'></i>Nueva Evidencia: <br><br>"+ 
													"</section>"+
													"<section class='col col-xs-6'><br>" +
														"<div class='evidenciaSubirSinEval"+val.comunicado.id+"' >" +
														"</div><br>"+
														"<button class='btn btn-success' onclick='insertarComunicadoContratista("+val.comunicado.id+",\""+tipoAplic+"\","+val.id+",1)');'>Guardar</button>"+
													"</section>"+
												"</div>"+
											"</div>"+
										"</div>" ;
							 }else if(val.evaluacion.id==1){
									//Si la evaluación del cliente es aprobada 
								 textConEval+=textBaseAplic+
								 "<div id='comAplic"+val.comunicado.id+"ConEval'class='eventoGeneral' style='display:none;' >" +  
									"<div class='row'>" +
										"<section class='col col-xs-4'>" +
											"<i class='fa fa-calendar'></i> Fecha de Mensaje: <br><br>"+
											"<i class='fa fa-envelope-o'></i> Tipo de Mensaje: <br><br>"+
											"<i class='fa fa-file-text-o'></i> Comunicado: <br><br>"+
											"<i class='fa fa-calendar-check-o'></i> Plazo de &nbsp&nbsp&nbsp&nbsp&nbspCumplimiento: <br><br>"+
											"<a class='efectoLink' onclick='toggleEvidenciaAplic("+val.comunicado.id+",\"ConEval\")'>" +
													"Ver Evidencia <i class='fa fa-angle-double-down'></i>" +
											"</a>"+
										"</section>"+
										"<section class='col col-xs-8'>" +
											val.comunicado.fechaMensajeTexto+ "<br><br>"+
											tipomensaj+ "<br><br>"+
											val.comunicado.comunicado+ "<br><br>"+
											val.comunicado.fechaImplementacionTexto+ 
										"</section>"+
									"</div>" + 
									"<div class='modal-footer' style='border-color:#2e9e8f;'></div>"+
									"<div  id='evidenciaConEval"+val.comunicado.id+"' style='display:none;'>" +
										"<div class='row'>" +
											"<section class='col col-xs-4'>" +
												"<i class='fa fa-calendar'></i> Fecha de Evidencia: <br><br>"+
												"<i class='fa fa-download'></i> Evidencia: <br><br>"+
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
					}	*/
			    }		
			}); 
			
			listPanelesPrincipal.push( 
					{id:"comunInform" ,clase:"",nombre:""+"Comunciados Informativos ("+numComunInformativo+")",
						contenido:"<div class='eventoGeneral divComunInform'>"+( numComunInformativo==0? "<label style='color:#2e9e8f; font-size:17px;'><strong>Sin Comunicados... </strong></label>":textInform)+"</div>"}
					/*{id:"comunAplic" ,clase:"",nombre:""+"Comunicados del Cliente que Requieren Respuesta ("+numComunAplicativo+")",
						contenido:	"<div class='eventoGeneral divComunAplic'>" +
										"<div style='border: 2px solid #2e9e8f;' class='eventoGeneral'>"+
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Sin atender("+numComuSinAtender+")</strong> " +
											"<button id='iconoToggleSinAtender'class='btn btn-success'  style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;'onclick='toggleAplic(\"SinAtender\")'>" +
												"<i class='fa fa-caret-down'></i>" +
											"</button>" +
										"</div> " +	
										"<div class='comuSinAtender eventoGeneral' style='display:none;'>"+
											textSinAtender+
										"</div>" +
										"<div style='border: 2px solid #2e9e8f;' class='eventoGeneral divSinEval'>" +
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Respuesta / Observado ("+numComuSinEvaluar+") </strong>" +
											"<button id='iconoToggleSinEval' style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;' class='btn btn-success' onclick='toggleAplic(\"SinEval\")'>" +
												"<i class='fa fa-caret-down'></i> " +
											"</button> " +
										"</div>" + 
										"<div class='comuSinEval eventoGeneral' style='display:none;'>"+
											textSinEval+
										"</div>" +
										"<div style='border: 2px solid #2e9e8f;'  class='eventoGeneral divConEval'>" +
											"<strong style='color:#2e9e8f;font-size:1.25em;'>Respuesta / Aprobado ("+numComuConEvaluar+")</strong>" +
											"<button id='iconoToggleConEval' style='float: right;	font-size:15px;padding: 0px 4px 0px 4px;' class='btn btn-success' onclick='toggleAplic(\"ConEval\")'>" +
												"<i class='fa fa-caret-down'></i> " +
											"</button> " +
										"</div>" +
										"<div class='comuConEval eventoGeneral' style='display:none;'>"+
											textConEval+
										"</div>" + 
									"</div> "}		*/
			); 
			agregarPanelesDivPrincipal(listPanelesPrincipal); 
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
function insertarComunicadoTrabajador(idcomunicado,tipoMenu,id,opc)
{
	// opc puede tener los siguientes valores :
	// 1: si lo ha visto y sube evidencia 0: si lo ha visto y aun no sube evidencia
	//tipoAplic=tipoMenu; 
	var campoVacio=true;
	var fechaHoy=convertirFechaTexto(obtenerFechaActual());  
	//var evaluacionId;
	if(campoVacio)
	{	
		if(id==null)
		{
			comunicadoTrabajadorId=0;
			if(tipoMenu="Informativo")
			{
				evaluacionId=null; 			
			}
			else 
			{
				evaluacionId=3; 
			}
			var dataParam=
			{
				id: comunicadoTrabajadorId,
				comunicado:{id:idcomunicado},
				trabajador:{trabajadorId:trabajadorId}, 
				fechaVisto: fechaHoy
			}; 
			callAjaxPost(URL + '/scheduler/comunicado/reporteestado/save',dataParam,habilitarComunicadoTrabajador);
		}
		/*else if(opc==1)
		{ 
			comunicadoContratistaId=id;
			var fechaHoy=convertirFechaTexto(obtenerFechaActual());
			var dataParam=
			{
				id: comunicadoContratistaId, 
				fechaSubida: fechaHoy,
				evaluacion: {id: 2}
			};
			callAjaxPost(URL + '/contratista/comunicado/reporteestado/save',dataParam,procesarResultadoGuardarComunicadoContratista);
		}*/
	}
	 else
	 {
		 alert("Error :''v");
	 }
}

/*function procesarResultadoGuardarComunicadoContratista(data)
{
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,'fileEvi'+tipoAplic,
				bitsEvidenciaComunicado,"/contratista/comunicado/reporteestado/evidencia/save",habilitarComunicadoContratista,"id");
		break;
	default:
		alert("no se guarda :''v");
	}
}*/

