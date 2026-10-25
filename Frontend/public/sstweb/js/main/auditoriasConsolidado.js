var listFullAuditorias;
var banderaEdicionAud=false;
var auditoriaObj,auditoriaId;
var nombreAudi,auditoriaFecha,nombreTipoAudi,auditoriaTipo,auditoriaClasif; 
var tablaFijada=false;
var preguntas;
var buenasTotal;
var parcialTotal;
var malasTotal;
var noAplicanTotal;
var contador2=0;
var indexPregunta=0;
var tipoVerificacionId;
var listValSino=[
		{id:0,nombre:"No"},
		{id:1,nombre:"Si"}
	];
var listFullEvalGerenciaAudiA=[];
var audiGerenEvalAId;
var audiGerenEvalAObj;
var listFullUsuGerenAPorNotificar=[];
var listTipoEvaluacionGeneral;
var numAud=0;

var isCompleto=false;
var tablaFijaHallazgo=false;

var monitoreoAuditoriaId;
var objMonitoreo;
var banderaEdicionMonitoreo;
var listFullMonitoreos;
var listTipoMonitoreo;
var listTipoVigencia;
var banderaEdicionMonitoreo=false;
var banderaEdicion9;
var hallazgoMonitoreoId;
var listHallazgoMonitoreoFull;
var tablaFijaHallazgoMonitoreo=false;
var hallazgoObj;
$(function(){
	//cargarAuditoriasAtajo();
	$("#mdVerif").load("agregaraccionmejora.html");
	$("#divAuditoriasConsolidado").hide();
});


function volverAuditoriasAtajo()
{ 
	$("#btnListarVerificaciones").hide();
	$("#btnHallazgo").hide();
	$("#btnMonitoreo").hide();
	$("#divAuditoriasConsolidado").show();
	$("#divListaVerificacion").hide();
	$("#btnListarVerificaciones").attr("onclick", "javascript:listarVerificacionesAtajo();");
	$("#btnHallazgo").attr("onclick", "javascript:cargarHallazgosAtajo();");
	$("#btnMonitoreo").attr("onclick", "javascript:cargarMonitoreosAtajo();");
}
function cargarAuditoriasAtajo()
{
	$("#btnCancelarAudis").hide();
	volverAuditoriasAtajo();
	callAjaxPost(URL + '/auditoria/todo', {
		idCompany : getSession("gestopcompanyid")},
		function(data) {
			if (data.CODE_RESPONSE = "05") {
				banderaEdicionAud=false;
				listFullAuditorias=data.list
				listTipoEvaluacionGeneral=data.tipo_evaluacion;
				$("#tblAuditoriasConsolidado tbody tr").remove(); 
				var numAud = 0;
				listFullAuditorias.forEach(function(val, index) {
					numAud =val.numSinAproEval;
					var origen="";
					var eventoAsociado="";
					var areaAsoci="";
					var rptaSi=val.rptaSi;
					var rptaParc=val.rptaParcial;
					var rptaNo=val.rptaNo;
					var rptaRP=val.rptaRP;
					var rptaFaltante=val.rptaRespondida;
					
					
					var pregTotal=val.numPreguntas;
					var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
					var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
					if(val.proyectoId!=null)
					{
						if(val.auditoriaClasifId==2)
						{
							origen="Inspección a Contratistas";
						}
						else if(val.auditoriaClasifId==3)
						{
							origen="Auditoria a Contratistas";
						}
						eventoAsociado=val.contratistaNombre+" - "+val.proyectoNombre;
						areaAsoci=val.area.areaName
					}else if(val.auditoriaClasifId==2 && val.auditoriaTipo==100)
					{
						origen="Monitoreo a Unidades";
					}
					else if(val.auditoriaClasifId==2)
					{
						origen="Inspección a Unidades";
					}
					else if(val.auditoriaClasifId==1)
					{
						origen="Diagnóstico aUnidades";
					}
					if(val.proyectoId==null)
					{
						eventoAsociado=val.nombreUnidades;
						areaAsoci=val.numAreas;
					}
					var nombreEval="----";
					if(val.usuarioGerencia == null){
						val.usuarioGerencia = {};
					}
					if(val.evidenciaNombre == "---" || val.auditoriaFecha == null) //Informe se ha planificado pero no se ha realizado
					{
						nombreEval="Pendiente completar el evento" 
					} 
					else if(val.usuariosGerenciaId==null)//Informe se ha realizado pero no se ha notificado a nadie
					{
						nombreEval="Pendiente notificar a responsable"
					}
					else if(val.usuarioGerencia.userSesionId!=null && (val.evaluacionGerencia.id==null || val.evaluacionGerencia.id==3))
					//else if(val.usuariosGerenciaCalificacion==0 || val.usuariosGerenciaCalificacion==0.5 || val.usuariosGerenciaCalificacion==0.6667) //Informe se ha realizado y se ha notificado a responsable
					{
						nombreEval="<i style='font-size:19px;color: #df9226'class='fa fa-eye' aria-hidden='true'></i>Abierto - pendiente de revisión del usuario: <br><strong>"+val.usuarioGerencia.userName+"</strong>";
					}
					else if(val.usuarioGerencia.userSesionId!=null && val.evaluacionGerencia.id==2)
					{
						nombreEval=val.evaluacionGerencia.icono+"Observado por:<br> <strong>"+val.usuarioGerencia.userName+"</strong> - "+
						((val.evaluacionGerencia.observacion).length>12?(val.evaluacionGerencia.observacion).substring(0, 11)+"...":val.evaluacionGerencia.observacion);
					}
					else if(val.usuariosGerenciaCalificacion==1)
					{
						nombreEval=val.evaluacionGerencia.icono+"Aprobado"; 
					}
					
				 	$("#tblAuditoriasConsolidado tbody").append(
							"<tr id='traud"+val.auditoriaId+"' onclick='editarAuditoriasAtajo("+index+")'>" +
								"<td id='audcod"+val.auditoriaId+"'>"+val.nroCaso+"</td>" +
								"<td id='audorig"+val.auditoriaId+"'>"+origen+"</td>" +
								"<td id='audevent"+val.auditoriaId+"'>"+eventoAsociado+"</td>" +
								"<td id='audarea"+val.auditoriaId+"'>"+areaAsoci+"</td>" +
								"<td id='audtit"+val.auditoriaId+"'>"+val.auditoriaNombre+"</td>" +
								"<td id='auddetalle"+val.auditoriaId+"'>"+val.observacion+"</td>" +
								"<td id='audfecha"+val.auditoriaId+"'>"+val.auditoriaFechaTexto+"</td>" +
								"<td id='audrespon"+val.auditoriaId+"'>"+val.trabajador.nombre+"</td>" +
								"<td id='audresult"+ val.auditoriaId + "' style='color:"+
									(val.auditoriaTipo==94 || val.auditoriaTipo==194 || val.auditoriaTipo == 100?"red":colorPuntaje(puntaje/puntajeMax))+";font-weight:bold'>"
									+(val.auditoriaTipo==94 || val.auditoriaTipo==194 || val.auditoriaTipo == 100?val.numHallazgos+" hallazgo(s)":
										pasarDecimalPorcentaje(puntaje/puntajeMax,2) )+ 
								"</td>"+
								"<td id='audevi"+val.auditoriaId+"'>" +
										"<a class='efectoLink' href='"+URL+"/auditoria/evidencia?auditoriaId="+val.auditoriaId+"'>"+val.evidenciaNombre+"</a>" +
								"</td>"+ 
								"<td id='audeval"+val.auditoriaId+"'>"+nombreEval+"</td>" +
								"<td id='audevalobs"+val.auditoriaId+"'>"+val.evaluacionGerencia.observacion+"</td>" +
								"<td id='audfechanot"+val.auditoriaId+"'>"+""+"</td>" +
								"<td id='audaccmej"+val.auditoriaId+"'>"+""+"</td>" +
								"<td id='audevalaccmej"+val.auditoriaId+"'>"+""+"</td>" +
								"<td id='audfechaevalaccmej"+val.auditoriaId+"'>"+""+"</td>" 
							+"</tr>");
				});
				$("#alertaAuditoriaEval").remove();
				if(numAud>0)
				{
					$("#refAudsConsolidado").prepend("<div class='numAlertas' id='alertaAuditoriaEval'>"+(numAud)+"</div>");
				}
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblAuditoriasConsolidado");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		});
}
 
function editarAuditoriasAtajo(pindex){
	if (!banderaEdicionAud) {
		$("#btnListarVerificaciones").hide();
		$("#btnHallazgo").hide();
		$("#btnMonitoreo").hide();
		$("#btnCancelarAudis").show();
		
		auditoriaObj=listFullAuditorias[pindex];
		auditoriaId = listFullAuditorias[pindex].auditoriaId;
		auditoriaTipo = listFullAuditorias[pindex].auditoriaTipo;
		auditoriaFecha = listFullAuditorias[pindex].auditoriaFecha;
		numAreas=listFullAuditorias[pindex].numAreas;
		listAreasSelecccionados=[];
		listAreas=[];
		
		nombreAudi=auditoriaObj.auditoriaNombre;
		auditoriaFecha = auditoriaObj.auditoriaFecha;
		auditoriaTipo=auditoriaObj.auditoriaTipo;
		nombreTipoAudi= auditoriaObj.auditoriaTipoNombre;
		auditoriaClasif=auditoriaObj.auditoriaClasifId;
		$("#audeval"+auditoriaId)
		.html("<a class='efectoLink' onclick='validarAuditoriaGerencia()'>" +
				""+ $("#audeval"+auditoriaId).text()+"   </a>");
		if(auditoriaTipo==94 || auditoriaTipo==194 )
		{
			$("#btnHallazgo").show();
		}
		else if(auditoriaTipo==100)
		{
			$("#btnMonitoreo").show();
		}
		else 
		{
			$("#btnListarVerificaciones").show();			
		}
		formatoCeldaSombreableTabla(false,"tblAuditoriasConsolidado");
		banderaEdicionAud = true;
	}
	
}
function bloquearAOtraValidacion(index)
{
	var opc;
	var estado=false;
	if(index==1)
	{
		opc=$("#selSiNoOtraValidacion").val(); 
		if(opc==0)
		{
			estado=true;
			
		}
		else if(opc==1)
		{
			estado=false;
		}
		$("#selUsuariosPorNotificar").prop("disabled",estado);
		if(listFullEvalGerenciaAudiA.length==3)
		{
			alert("No se puede validar a mas usuarios por superar el limite(3)");
			$("#selSiNoOtraValidacion").val(0);
			$("#selUsuariosPorNotificar").prop("disabled",true); 
		}
	}
	else if(index==2)
	{
		opc=$("#selEvalGerenciaAuditoria").val(); 
		$("#selSiNoOtraValidacion").val(0);    
		if(opc==1)
		{
			estado=false;  
			if($("#selSiNoOtraValidacion").val()==0)
			{
				$("#selUsuariosPorNotificar").prop("disabled",true); 
			}
			else if($("#selSiNoOtraValidacion").val()==1)
			{
				$("#selUsuariosPorNotificar").prop("disabled",false); 
			}
		}
		else  
		{
			estado=true;
			if($("#selSiNoOtraValidacion").val()==0)
			{
				$("#selUsuariosPorNotificar").prop("disabled",true); 
			}
			else if($("#selSiNoOtraValidacion").val()==1)
			{
				$("#selUsuariosPorNotificar").prop("disabled",false); 
			}
		}
		$("#selSiNoOtraValidacion").prop("disabled",estado); 
	}  
}
function toggleVerEvaluacionesAGerencia()
{
	$("#listaEvaluacionesGeren").toggle();
}
function validarAuditoriaGerencia(){
	callAjaxPost(URL + '/auditoria/evaluacion/gerencia', {
		auditoriaId :auditoriaId,
		idCompany:getSession("gestopcompanyid")},
		function(data) 
		{ 
			listFullEvalGerenciaAudiA=data.evalgerencia;
			listFullUsuGerenAPorNotificar=data.usuarios_geren_notificar;
			
			if(getSession("accesoGerencia") == 1){
				var listItemsFormGeren=[];
				var indexEvalEditar=null;
				var textInformEval=""; 
				var permisoEval=false;
				listFullEvalGerenciaAudiA.forEach(function(val,index){
					if(val.user.userName!=getSession("gestopusername") && val.calificacion.id!=null)
					{
						listItemsFormGeren.push(
								{sugerencia:" ",label:"Revisado por:",inputForm:val.user.userName,divContainer:"divContainAux"+val.id},
								{sugerencia:" ",label:"Calificación:",inputForm: val.calificacion.icono+" <strong>"+val.calificacion.nombre+"</strong>", divContainer:"divContainAux"+val.id},
								{sugerencia:" ",label:"Observación",inputForm:val.observacion,divContainer:"divContainAux"+val.id},
								{sugerencia:" ",label:"Fecha de evaluación:",inputForm: val.fechaRegistroTexto,divContainer:"divContainAux"+val.id},
								{sugerencia:"5",label:"",inputForm: "",divContainer:""}
						);
					}
					else if(val.user.userName==getSession("gestopusername"))
					{
						indexEvalEditar=index;
						permisoEval=true;
					}
				}); 
				if(!permisoEval)
				{
					alert("Lo sentimos, usted no tiene permiso para realizar alguna evaluación");
					return;
				}
				listItemsFormGeren.forEach(function(val,index){ 
					if(val.sugerencia!=5)
					{
						textInformEval+=obtenerSubPanelModuloAuditoria(val); 
					}
					else if(val.sugerencia==5)
					{
						textInformEval+="<div class='row' style='border-top: 1px solid #2e9e8f;margin-top:20px;margin-left: 0px; margin-right: 0px;'></div><br>";
					}
				});  
				$("#modalAprobGerencia").modal("show");
				var textoForm="";
				var selEvalGerenciaAuditoria;
				var listItemsForm=[];
				var obs="";
				if(indexEvalEditar==null)
				{
					selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearAOtraValidacion(2)", listTipoEvaluacionGeneral, 
							 "3", "id","nombre"); 
					audiGerenEvalAId=0;
				}
				else
				{
					audiGerenEvalAId=listFullEvalGerenciaAudiA[indexEvalEditar].id;
					audiGerenEvalAObj=listFullEvalGerenciaAudiA[indexEvalEditar];
					
					selEvalGerenciaAuditoria=crearSelectOneMenuOblig("selEvalGerenciaAuditoria", "bloquearAOtraValidacion(2)", listTipoEvaluacionGeneral, 
							(audiGerenEvalAObj.calificacion.id==null?3:audiGerenEvalAObj.calificacion.id), "id","nombre");  
					obs=audiGerenEvalAObj.observacion 
				} 
				var selUsuariosNotificar=crearSelectOneMenuOblig("selUsuariosPorNotificar", "", listFullUsuGerenAPorNotificar, 
						 "", "userId","userName");
				var selOtraValidacion=crearSelectOneMenuOblig("selSiNoOtraValidacion", "bloquearAOtraValidacion(1)", listValSino, 
						 "", "id","nombre");
				var listItemsForm=[
					{sugerencia:" ",label:"Revisado por:",inputForm:getSession("gestopusername"),divContainer:"divContainAux"}, 
					{sugerencia:" ",label:"Calificación:",inputForm: selEvalGerenciaAuditoria,divContainer:"divContainAux"},
					{sugerencia:" ",label:"Observación / Retroalimentación",inputForm:"<input class='form-control' id='inputObservacionEvalAux' value='"+obs+"'>"},
					{sugerencia:" ",label:"Fecha de evaluación:",inputForm:obtenerFechaActual()+" "+obtenerHoraActual()+ "",divContainer:"divContainAux"},
					{sugerencia:" ",label:"¿Requeriere otra validación?:",inputForm:selOtraValidacion,divContainer:"divContainAux"},
					{sugerencia:" ",label:"Responsable de la Revisión",inputForm:(listFullUsuGerenAPorNotificar==0?"Sin Usuarios por Notificar":selUsuariosNotificar),divContainer:"divContainAux"},
					{sugerencia:" ",label:" ",
								inputForm:"<button id='btnGuardarEvalAudi' type='submit' class='btn btn-success' >" +
											 "<i aria-hidden='true' class='fa fa-envelope-o'></i> Guardar y Enviar" +
										  "</button>"+
										"<button style='margin-left:50px' type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>"} 
				];
				listItemsForm.forEach(function(val,index){
					textoForm+=obtenerSubPanelModuloAuditoria(val);
				});
				$("#modalAprobGerencia .modal-body").html(
					"<form class='eventoGeneral' id='formAudiEval"+auditoriaObj.auditoriaId+"' >"
							+textoForm+
							"<div id='limiteLista' style='border-bottom:1px solid #2e9e8f;height: 30px;' >" +
								"<a class='efectoLink' onclick='toggleVerEvaluacionesAGerencia()'> Ver Validaciones anteriores<i class='fa fa-angle-double-down'></i></a>" +
							"</div>"+
							"<div id='listaEvaluacionesGeren' style='display:none'><br>" +
								(textInformEval==""?"Sin Registros":textInformEval)+ 
							"</div>"+
					"</form>");
				if(audiGerenEvalAObj.calificacion.id==1)
				{
					$("#btnGuardarEvalAudi").hide();
					$("#selEvalGerenciaAuditoria").prop("disabled",true); 
					$("#inputObservacionEvalAux").prop("disabled",true);  
				}
				else 
				{
					$("#btnGuardarEvalAudi").show();
					$("#selEvalGerenciaAuditoria").prop("disabled",false); 
					$("#inputObservacionEvalAux").prop("disabled",false);  
				}
				$("#selUsuariosPorNotificar").prop("disabled",true); 
				$("#selSiNoOtraValidacion").prop("disabled",true); 
				$("#formAudiEval"+auditoriaObj.auditoriaId).on("submit",function(e){
			        e.preventDefault();
			        var opc=$("#selSiNoOtraValidacion").val(); 
			        if(audiGerenEvalAObj.calificacion.id==1)
					{
						alert("Lo sentimos, esta evaluacion ya esta cerrada y aprobada");
						return;
					}
			        if(audiGerenEvalAId!=0)
					{
			    	   var dataParam=
				        {
			        		id : audiGerenEvalAId, 
			        		auditoria:{auditoriaId : auditoriaId},
			        		user:{userSesionId:null},
			        		calificacion:{id:$("#selEvalGerenciaAuditoria").val()},
			        		observacion:$("#inputObservacionEvalAux").val()
				        }//almacenando la evaluacion
				       	callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam,
							function(data){
								if(data.CODE_RESPONSE=="05")
								{
									$("#modalAprobGerencia").modal("hide");
									alert("Se guardó la evaluación de gerencia del registro y se informó al responsable de registro!");
									var datapar=
									{
										auditoriaId:auditoriaId,
										nroCasoInt:auditoriaObj.nroCasoInt,
										usuarioGerencia:{userSesionId:null},
										evaluacionGerencia:
										{
											id:$("#selEvalGerenciaAuditoria").val(),
											observacion:$("#inputObservacionEvalAux").val()
										}
									}// se actualiza la auditoria en los campos de evaluacionGerencia 
									callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
					    				function(data){
						    				if(data.CODE_RESPONSE=="05")
						    				{
							    				console.log("Se actualizo la evaluacion en la auditoria 1");
						    				}
						    				else 
						    				{
						    					alert("error");
						    				}
					    			});
									if($("#selEvalGerenciaAuditoria").val()==2 && listFullEvalGerenciaAudiA.length>=2)//si es observado se notifica a todos los anteriores usuarios
							        {
							        	var listFullUserNotificar=[];
							        	listFullEvalGerenciaAudiA.forEach(function(val,index)
							        	{ 
							        		if(val.user.userName!=getSession("gestopusername"))
											{ 
						        	 			listFullUserNotificar.push({userSesionId:parseInt(val.user.userSesionId)});
											}
				        	 			}); 
							        	var data={
								        		auditoriaId : auditoriaId , 
								        		usuariosObsNot:listFullUserNotificar
									        }
							    			callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion/obs', data,
							    				function(data){
								    				$("#modalAprobGerencia").modal("hide");
								    				console.log("Se notificó a los usuarios de gerencia");
							    			});
							        }
									if(opc==1 && $("#selUsuariosPorNotificar").val()!=null && listFullEvalGerenciaAudiA.length<3) 
									{
										if($("#selEvalGerenciaAuditoria").val()!=1)//enviar correo para el otro usuario
										{
											alert("Lo sentimos, el evento no esta aprobado por lo que no puede solicitar otra validdacion de usuario");
											return;
										}
										var data={
							        		auditoriaId : auditoriaId , 
							        		usuarioGerencia: {userId:$("#selUsuariosPorNotificar").val()} 
								        }// solicitando otra validacion
						    			callAjaxPost(URL + '/auditoria/notificar/gerencia/validacion', data,
						    				function(data){
							    				$("#modalAprobGerencia").modal("hide");
							    				alert("Se notificó al usuario de gerencia");
							    				//alert("Nota: Le recordamos que tiene un número limitado de validaciones(3)\nValidaciones restantes: "+(3-(listFullEvalGerenciaAudiA.length+1)));
						    			});
										//------------------------------------------------------------------
									     var estadoNotificar=false;
							    	        listFullEvalGerenciaAudiA.forEach(function(val,index){
							    				if(val.user.userSesionId==$("#selUsuariosPorNotificar").val())
							    				{
							    					estadoNotificar=true;
							    				}
							       			});
							    	        if(estadoNotificar!=true)
							    	        { 
							    	        	var dataParam1=
											    	{
											        		id : 0,
											        		auditoria:{auditoriaId : auditoriaId},
											        		user:{userSesionId:$("#selUsuariosPorNotificar").val()},
											        		calificacion:{id:null},
											        		observacion:null
											        };
											       	callAjaxPost(URL + '/auditoria/save/gerencia/evaluacion', dataParam1,
														function(data){ 
															console.log("El usuario se a notificado por primera vez para su revisión");
															if(data.CODE_RESPONSE=="05")
												       		{
												       			var datapar=
																{
																	auditoriaId:auditoriaId,
																	nroCasoInt:auditoriaObj.nroCasoInt,
																	usuarioGerencia:{userSesionId:$("#selUsuariosPorNotificar").val()},
																	evaluacionGerencia:
																	{
																		id:null,
																		observacion:null
																	}
																}
																callAjaxPost(URL + '/auditoria/gerencia/update/evaluacion', datapar,
												    				function(data){
													    				if(data.CODE_RESPONSE=="05")
													    				{
														    				console.log("Se actualizo la evaluacion en la auditoria 2");
													    				}
													    				else 
													    				{
													    					alert("error");
													    				}
												    			}); 
												       		}
											       	});
							    	        } 
									}
									else if(listFullEvalGerenciaAudiA.length==3 && opc!=0)
									{
										alert("Lo sentimos,no puede notificar mas validaciones por haber superado el limite (3) ");
										return;
									}
								}
								else
								{
									alert("error al gaurdar");
								}
						});
				    }
				    else 
				    {
				    	alert("Lo sentimos, usted no puede enviar su validacion");
				    	return;
				    }
				});  
			}
		});
}
function listarVerificacionesAtajo()
{
	$("#divAuditoriasConsolidado").hide();	
	$("#divListaVerificacion").show();	
	$("#tituloRegresar").html("<a class='efectoLink' onclick='volverAuditoriasAtajo()'>Auditorias</a>" +"< Lista de Verificación");	
	
	var dataParam = {
			auditoriaId : auditoriaId,
			auditoriaTipo : auditoriaTipo
		};

		callAjaxPost(URL + '/auditoria/verificaciones', dataParam,
				function(data)
				{
			switch (data.CODE_RESPONSE) {
			case "05":
				preguntas = data.list;
				listSeccionesInteresadasDetalleAuditoria=data.secciones;
				listAreasInteresadasDetalleAuditoria=data.areas;
				$("#tblVerifAtajo tbody tr").remove();
				var fila = 0;
				var tipoVerificacion = "";
				var restriccionId;
				if(auditoriaClasif==1){
					restriccionId=2;
				}else{
					restriccionId=3;
				}
				var isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
				preguntas.forEach(function(val,index){
					fila++;
					if (tipoVerificacion != val.tipoVerificacion) {
						tipoVerificacion = val.tipoVerificacion;
						$("#tblVerif tbody").append(
								"<tr id='filaCategoria"+val.tipoVerificacionId+"'>" + 
								"<td colspan='2'></td>" +
								"<td colspan='1'>" +
									(isCompleto?"":"<input checked type='checkbox'>") +
											"</td>"+
								"<td colspan='9'  class='info''>"
										+ val.tipoVerificacion + "</td>"
										+ "</tr>");
					}
					var textParteInteresada="--",textParteInteresadaArea="--";
					if(val.respuesta!=null){
						textParteInteresada=val.seccionesNombre+"";
						textParteInteresadaArea=val.areasNombre+"";
					}
					$("#tblVerif tbody").append(
							"<tr id='trv"+ val.verificacionId+ "a"+val.tipoVerificacionId+"'>"
								+ "<td id='tdid"+ val.verificacionId+ "'>"
											+ fila
								+ "</td>"
								+ "<td id='tdnom"+ val.verificacionId+ "'>"
									+ val.verificacion
								+ "</td>"
								+ "<td id='tdaplica"+ val.verificacionId+ "'>"
										+(isCompleto?"":""+ 
												"<input type='checkbox' class='check' "	+ "id='chckaplica"
										+ val.verificacionId
										+ "' "
										+ val.chckAplica
										+ " disabled>")
								+ "</td>"
								+ "<td id='tdsi"+ val.verificacionId+ "'>"
								+ "</td>"
								+ "<td id='tdparc"+ val.verificacionId+ "'>"
								+ "</td>"
								+ "<td id='tdno"+ val.verificacionId+ "'>"	
								+ "</td>"
								+ "<td id='tdriesgo"+ val.verificacionId+ "'>"
									+ "<input type='checkbox' class='check' "
									+ "id='chckriesgo"
									+ val.verificacionId
									+ "'"+ val.chckRiesgo
									+ ">"
								+ "</td>"
								+ "<td id='tdcom"+ val.verificacionId+ "'>"
									+ val.comentario
								+"</td>"
								//	
								+ "<td id='tdperint"
									+ val.verificacionId
									+ "' style='overflow-wrap: break-word;'>"
									+ textParteInteresadaArea
								+" </td>"
								+ "<td id='tdperintsec"
									+ val.verificacionId
									+ "' style='overflow-wrap: break-word;'>"
									+ textParteInteresada
								+" </td>"
								+ "<td id='tdacc"+ val.verificacionId+ "'>"+val.iconoEstadoAccion+
										val.nombreAccionMejora+
								"</td>"

								+ "<td id='tdevi"
									+ val.verificacionId
									+ "'><a class='efectoLink' href='"
									+ URL
									+ "/auditoria/verificaciones/evidencia?verificacionId="
									+ val.verificacionId
									+ "&auditoriaId="
									+ auditoriaId
									+ "' "
									+ "target='_blank' id='descargarimagen"
									+ val.verificacionId
									+ "'>"+(val.evidenciaNombre=="----"?"":val.evidenciaNombre)+"</a>"
								+"</td>"
						+ "</tr>");
					if (val.bitAplica == 1) {
						if (val.bitSi == 1) {
							buenasTotal++;
						}

						if (val.bitParc == 1) {
							parcialTotal++;
						}

						if (val.bitNo == 1) {
							malasTotal++;
						}
						deshabilitarRiesgoPotencial(val.verificacionId);
					} else {
						noAplicanTotal++;
					}
					deshabilitarPregunta(val.verificacionId,val.tipoVerificacionId,val.detalleAuditoriaId);
					
					$("#tdnom"+ val.verificacionId).css({"text-align":"left"});
					
					
					
					resaltarInput(val.chckNo,"tdno"+val.verificacionId,"red");
					resaltarInput(val.chckParc,"tdparc"+val.verificacionId,"yellow");
					resaltarInput(val.chckSi,"tdsi"+val.verificacionId,"green");
				});
				break;
			default:
				alert("Ocurrió un error al traer las verificaciones!");
			}
			
			if(!tablaFijada){
				tablaFijada=true;
				goheadfixedY('#tblVerif',"#wrapper");
			}

				
			$(".info").css({"text-align":"center"});
			  setTextareaHeight($('textarea'));
				});
}
function deshabilitarPregunta(preguntaId,tipoId,evalId) {
	
	var bitAplica =$("#chckaplica" + preguntaId).is(':checked');
	
	if (bitAplica) {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", false);
		$("#descargarimagen" + preguntaId).attr("onclick", "");
		$("#subirimagen" + preguntaId).attr("onclick", "javascript:mostrarCargarImagen("+evalId+")");
		deshabilitarRiesgoPotencial(preguntaId);
	} else {
		
		$("#trv" + preguntaId + "a"+tipoId+" :input").attr("disabled", true);
		$("#descargarimagen" + preguntaId).attr("onclick", "return false;");
		$("#subirimagen" + preguntaId).attr("onclick", "return false;");
		$("#chckaplica" + preguntaId).attr("disabled", false);
	}
}
function resaltarInput(isChecked,inputId,color){
	if(isChecked=="checked"){
	$("#"+inputId).css("background-color",color);
	}
}
function deshabilitarRiesgoPotencial(verificacionId) {
	var bitRespuesta = parseFloat($(
			"input[name='rpta" + verificacionId + "']:checked").val());
	if(bitRespuesta<1){
		$("#chckriesgo" + verificacionId).prop("disabled", true);
	}else{
		$("#chckriesgo" + verificacionId).prop("disabled", false);
	}
}

function cancelarAuditoriasAtajo(){
	cargarAuditoriasAtajo();
}
function obtenerSubPanelModuloAuditoria(val){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px solid #a5aaae;"
	}
	return "<div class='form-group row' style='"+estiloDefault+"'>"+
	   " <label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>"+
	    "<div class='col-sm-8' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	    "</div>"+
	  "</div>";
}
function colorPuntaje(puntaje){
	var color="black";
		if(puntaje<=0.66){
			color="orange"
		}
		if(puntaje<=0.34){
		color="red"
	}
		if(puntaje>0.66){
			color="green"
		}
	return color;
}
var listHallazgoAtajo = [];
var listAreasHallazgoAtajo = [];
var listNivelRiesgoHallazgoAtajo = [];
var listSeccionesInteresadasHallazgoAtajo = [];
var listAreasInteresadasHallazgoAtajo = [];
var listFactorHallazgoAtajo = [];
var listTipoReporteHallazgoAtajo = [];
var banderaEdicionHallAtajo= false;
function cargarHallazgosAtajo()
{
	banderaEdicionHallAtajo = false;
	$("#btnVolverHall").hide();
	$("#btnGuardarHall").hide();
	$("#btnEliminarHall").hide();
	$("#btnVolverHall").attr("onclick", "javascript:cancelarHallazgoAtajo("+""+");");
	$("#btnGuardarHall").attr("onclick", "javascript:guardarHallazgoAtajo("+""+");");
	$("#btnEliminarHall").attr("onclick", "javascript:eliminarHallazgoAtajo("+""+");");
	var dataParam = {
			
			auditoriaId : auditoriaId
		};
		
		callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
			function(data)
			{
				switch (data.CODE_RESPONSE) {
				case "05":
					listHallazgoAtajo=data.list;
					listNivelRiesgoHallazgoAtajo=data.niveles;
					listSeccionesInteresadasHallazgoAtajo=data.secciones;
					listAreasInteresadasHallazgoAtajo=data.areasInteresadas;
					
					listFactorHallazgoAtajo=data.factor;
					listTipoReporteHallazgoAtajo=data.tiposReporte;
					$("#tblHallazgo tbody tr").remove();
					isCompleto=(auditoriaObj.evaluacionGerencia.id == 1);
					listHallazgoAtajo.forEach(function(val,index){
						if(val.evidenciaNombre.length>12)
						{
							val.evidenciaNombre=val.evidenciaNombre.substr(0,12)+"...";
						}
						var textoEvi ="Sin asignar";
						if(val.evidenciaNombre != "" && val.evidenciaNombre != "----"){
							textoEvi=""+val.evidenciaNombre+"<br>"+
										"<a target='_blank' href='"+URL
										+ "/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"' class='efectoLink'><i class='fa fa-download'></i>Descargar</a><br>"+
										"<a id='linkeviHall"+val.id+"' class='efectoLink'><i class='fa fa-eye'></i>Vista Previa</a>";
						}
						$("#tblHallazgo tbody").append(
	
								"<tr id='tr" + val.id+ "'>"
										+ "<td id='tddesc" + val.id	+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.descripcion 
										+ "</td>"
										+ "<td class='gosst-desaprobado-color' id='tdobsge" + val.id	+ "' onclick='editarHallazgoAtajo("+index+")'>" 
										+ val.observacionGerencia 
									+ "</td>"
									+ "<td id='tdeviHall"+ val.id + "' >"
										+ ( textoEvi)
										+"</td>"
										+ "<td id='tdtiprhall" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.tipoReporte.nombre 
										+ "</td>"
										+ "<td id='tdnivhall" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.nivel.nombre 
										+ "</td>"
										+ "<td id='tdfachall" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.factor.nombre 
										+ "</td>"
										+ "<td id='tdcausa" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.causa
										+ "</td>" 
										+ "<td id='tdlugar" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.lugar	
										+ "</td>" 
										+ "<td id='tdhaarea" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.areasNombre
										+ "</td>" 
										+ "<td id='tdhasecc" + val.id+ "' onclick='editarHallazgoAtajo("+index+")'>" 
											+ val.seccionesNombre
										+ "</td>" 
										+ "<td id='tdaccion"+ val.id + "' onclick='editarHallazgoAtajo("+index+")'>" 
											+(isCompleto?"<a class='efectoLink' onclick='agregarAccionMejora(6, "+ val.id  	 + ",4)'>"+
													"<i class='fa fa-list'></i>"+val.accion.estadoIcono+val.accion.resumen+"</a>":val.accion.estadoIcono+val.accion.resumen)
										+"</td>"
										+ "</tr>");
						$("#linkeviHall" + val.id).on("click",function(e){
							var hallzgoId=parseInt($(this).prop("id").substr(11,19));
							  
							callAjaxPost(URL + '/auditoria/hallazgos/id', {id:hallzgoId},
								function(data){
									var alturaAux=140;
									var imagenPrevia=insertarImagenParaTablaMovil(data.hallazgo.evidencia,alturaAux+"px","100%");
									$("#linkeviHall" + hallzgoId).remove();
									$("#tdeviHall"+hallzgoId).append(imagenPrevia);
								},function(){
									$("#linkeviHall" + hallzgoId).html("Cargando <i class='fa fa-cog'></i>");
								}); 

						});
						 
					});
					formatoCeldaSombreableTabla(true,"tblHallazgo");
					if(!tablaFijaHallazgo){
						tablaFijaHallazgo=true;
						$("#wrapper3").css("height",$(window).height()*0.6-50+"px");
							goheadfixedY("#tblHallazgo","#wrapper3");
						}
					
					break;
				default:
					alert("Ocurrió un error al traer las auditorias!");
				}
			});
		$("#modalHallazgos").modal("show");
}
function editarHallazgoAtajo(pindex) {
	if (!banderaEdicionHallAtajo) {
		hallazgoObj = listHallazgoAtajo[pindex];
		var hallazgoId = hallazgoObj.id;
		formatoCeldaSombreableTabla(false,"tblHallazgo");

		var descripcionHallazgo=hallazgoObj.descripcion;
		var area=hallazgoObj.area.id;
		var nivel=hallazgoObj.nivel.id;
		var factor=hallazgoObj.factor.id;
		var causaHallazgo=hallazgoObj.causa;
		var lugarHallazgo=hallazgoObj.lugar;

		var nombreEvidencia=hallazgoObj.evidenciaNombre;
		var iconoAccion=hallazgoObj.accion.estadoIcono;
		var nombreAccion=hallazgoObj.accion.resumen;
		//
		var seccionesId=hallazgoObj.seccionesId.split(",")
		listSeccionesInteresadasHallazgoAtajo.forEach(function(val){
			val.selected=0;
			seccionesId.forEach(function(val1){
				if(parseInt(val1)==val.id){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo", "",
				listSeccionesInteresadasHallazgoAtajo,  "id", "nombre","#tdhasecc"+hallazgoObj.id,"Secciones interesadas ...");
								
		
		
		//
		var areasId=hallazgoObj.areasId.split(",")
		listAreasInteresadasHallazgoAtajo.forEach(function(val){
			val.selected=0;
			areasId.forEach(function(val1){
				if(parseInt(val1)==val.areaId){
					val.selected=1;
				}
			})
		});	
		crearSelectOneMenuObligMultipleCompleto("slcAreasPermitidaHallazgo", "",
				listAreasInteresadasHallazgoAtajo,  "areaId", "areaName","#tdhaarea"+hallazgoObj.id,"Áreas interesadas ...");
								
		
		 
		var selTipoReporteHallazgo= crearSelectOneMenuOblig("selTipoReporteHallazgo", "", listTipoReporteHallazgoAtajo, hallazgoObj.tipoReporte.id, 
				"id","nombre");
		
		$("#tdtiprhall"+hallazgoId).html(selTipoReporteHallazgo)
		//
		var selNivelHallazgo= crearSelectOneMenuOblig("selNivelHallazgo", "", listNivelRiesgoHallazgoAtajo, nivel, 
				"id","nombre");
		$("#tdnivhall"+hallazgoId).html(selNivelHallazgo)
		//
		
		
		
		var selFactorHallazgo= crearSelectOneMenuOblig("selFactorHallazgo", "", listFactorHallazgoAtajo, factor, 
				"id","nombre");
		$("#tdfachall"+hallazgoId).html(selFactorHallazgo)
		 
		$("#tddesc" + hallazgoId).html("<input type='text' id='inputDesc' class='form-control' " +
						"placeholder='Descripcion'  value='"
								+ descripcionHallazgo + "'>");
		$("#tdobsge" + hallazgoId).html("<input type='text' id='inputObsGerencia' class='form-control' >");
		$("#inputObsGerencia").val(hallazgoObj.observacionGerencia);
		$("#tdcausa" + hallazgoId)
		.html(
				"<input type='text' id='inputCausa' class='form-control' " +
				"placeholder='Causa' value='"
						+ causaHallazgo + "'>");
		$("#tdlugar" + hallazgoId)
		.html(
				"<input type='text' id='inputLugarHallazgo' class='form-control' " +
				"placeholder='Lugar'  >");
		$("#inputLugarHallazgo").val(lugarHallazgo)
		$("#tdaccion" + hallazgoId).html(
				"<a href='#' onclick='javascript:agregarAccionMejora(6, "
						+ hallazgoId + ",4);'>"+nombreAccion+"</a>");
	
		
		/** ************************************************************************* */
		var textIn2="<i class='fa fa-2x fa-list'></i>"+$("#tdaccionag"+hallazgoId).text();
		$("#tdaccionag"+hallazgoId+"").html(""+textIn2)
		.addClass("linkGosst")
		.on("click",function(){
			cargarAccionesHallazgosProyecto();
		})
	
		banderaEdicionHallAtajo = true;
		//$("#btnNuevoHall").hide();
		//$("#btnEliminarHall").show();
		$("#btnVolverHall").show();
		$("#btnGuardarHall").show();
		$("#btnEliminarHall").show();
	}
	
}
function cancelarHallazgoAtajo(){
	cargarHallazgosAtajo();
}
function eliminarHallazgoAtajo(){
    var r = confirm("¿Está seguro de eliminar el hallazgo?");
    if(r){
	var dataParam = {
		id : hallazgoObj.id
	}
	callAjaxPost(URL+"/auditoria/hallazgo/delete",dataParam,function(){
	    cargarHallazgosAtajo();
	});
    }
}
function guardarHallazgoAtajo(){
	var campoVacio = true;
	var inputDesc = $("#inputDesc").val();
	var inputCausa = $("#inputCausa").val();
	var inputLugarHallazgo = $("#inputLugarHallazgo").val();
	//var area = $("#selAreaHallazgo").val();
	var nivel= $("#selNivelHallazgo").val();
	var factor= $("#selFactorHallazgo").val();
	var tipoReporte = $("#selTipoReporteHallazgo").val();
	var secciones=$("#slcSeccionesPermitidaHallazgo").val();
	var observacionGerencia = $("#inputObsGerencia").val();
	var listSecciones=[];
	if(secciones != null){
		secciones.forEach(function(val,index){
			listSecciones.push({id:val});
		});
	}
	var areas=$("#slcAreasPermitidaHallazgo").val();
	var listAreas=[];
	if(areas != null){
		areas.forEach(function(val,index){
			listAreas.push({areaId:val});
		});
	}
	
	if (campoVacio) {

		var dataParam = {
			id : hallazgoObj.id,
			observacionGerencia : observacionGerencia,
			secciones:listSecciones,
			areas:listAreas,
			tipoReporte: {id:tipoReporte},
			descripcion : inputDesc,
			//area:{areaId:area},
			nivel:{id:nivel},factor:{id:factor},
			causa: inputCausa,
			lugar:inputLugarHallazgo,
			auditoriaId: auditoriaId
		};

		callAjaxPost(URL + '/auditoria/hallazgo/save', dataParam,
				function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				cargarHallazgosAtajo();
				
				break;
			default:
				alert("Ocurrió un error al guardar la auditoria!");
			}
			
		});
	}
}
function volverMonitoreos()
{
	$("#modalHallazgoMonitoreo").modal("hide");
	
	$("#modalMonitoreo .modal-body").hide();
	$('#modalBodyMonitoreo').show();
	$("#modalMonitoreo .modal-title").html("Monitoreos");

}
function cargarMonitoreosAtajo ()
{
	monitoreoAuditoriaId=0;
	listFullMonitoreos=[];
	listTipoMonitoreo=[];
	
	volverMonitoreos();
	var dataParam={auditoriaId:auditoriaId}
	callAjaxPost(URL + '/auditoria/monitoreos', dataParam, function(data) {
		
		listFullMonitoreos=data.list;
		listTipoMonitoreo=data.listTipoMonitoreo;
		listTipoVigencia=data.listTipoVigencia;
		$("#tblMonitoreo tbody").html("");
		banderaEdicionMonitoreo=false;
		listFullMonitoreos.forEach(function(val,index){
			$("#tblMonitoreo tbody").append(
				"<tr onclick='javascript:editarMonitoreo("+index+")' >"+
					"<td id='monArea"+val.id + "'>"+
						val.area 
					+ "</td>" +
					"<td id='monTipo"+val.id + "'>"+
						val.tipo.nombre + "</td>" +
					"<td id='monAgent"+val.id + "'>"+
						val.agenteMonitoreado + "</td>" +
					"<td id='monDentro"+val.id + "'>"+
						(val.isDentroPlanes==1?"Sí":"No") + "</td>" +
					"<td id='monVig"+val.id + "'>"+
						val.vigencia.nombre + "</td>" +
					"<td id='monFec"+val.id + "'>"+
						val.fechaProximaTexto+ "</td>" +
					"<td id='monTrabs"+	val.id + "'>"+
						val.numTrabajadores + "</td>" +
					"<td id='monOrg"+val.id + "'>"+
						val.organizacion+ "</td>" +
					"<td id='monResu"+val.id + "'>"+
						val.resultado+ "</td>" +
					"<td id='monObs"+val.id + "'>"+
						val.observaciones + "</td>" +
					"<td id='monHall"+	val.id + "'>"
						+"<i class='fa fa-list'></i>"+val.numHallazgos+
					"</td>" + 
				"</tr>");
		});
	
		formatoCeldaSombreableTabla(true,"tblMonitoreo");
	
	});
	$("#modalMonitoreo").modal("show");
}
function editarMonitoreo(pindex)
{
	if(!banderaEdicionMonitoreo){
		monitoreoAuditoriaId=listFullMonitoreos[pindex].id;
		objMonitoreo=listFullMonitoreos[pindex];
		banderaEdicionMonitoreo=true;
		var textHallazgo=$("#monHall"+monitoreoAuditoriaId).text();
		$("#monHall"+monitoreoAuditoriaId).addClass("linkGosst")
		.on("click",function(){cargarHallazgoMonitoreos();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textHallazgo);
	}
}
function cargarHallazgoMonitoreos()
{
	$("#modalMonitoreo .modal-body").hide();
	$('#modalHallazgoMonitoreo').show();
	$("#modalMonitoreo .modal-title").html("<a onclick='volverMonitoreos()'>Monitoreo "+objMonitoreo.tipo.nombre+"</a> > Hallazgos");
	banderaEdicion9 = false;
	hallazgoMonitoreoId = 0;
	hallazgoObj={id:0};
	var dataParam = {
			
			id : monitoreoAuditoriaId
		};
		callAjaxPost(URL + '/auditoria/monitore/hallazgos', dataParam,
			function(data)
			{
				switch (data.CODE_RESPONSE) {
				case "05":
					listHallazgoMonitoreoFull = data.list;
					listSeccionesInteresadasMonitoreoHall=data.secciones;
					listAreasInteresadasMonitoreoHall=data.areas;
					$("#tblHallazgoMonitoreo tbody tr").remove();
					$("#tblHallazgo tbody tr").remove();
					var isCompleto = (auditoriaObj.evaluacionGerencia.id == 1);
					listHallazgoMonitoreoFull.forEach(function(val,index){
						$("#tblHallazgoMonitoreo tbody").append(
								"<tr id='tr" + val.id+ "' >"

									+ "<td id='tddesc" + val.id	+ "'>" 
										+ val.descripcion 
									+ "</td>"
									+ "<td id='tdcausa" + val.id+ "'>" 
										+ val.causa
									+ "</td>" 
									+ "<td id='tdlugar" + val.id+ "'>" 
										+ val.lugar
									+ "</td>"
									+ "<td id='tdhalarmon" + val.id	+ "'>" 
										+ val.areasNombre
									+ "</td>" 
									+ "<td id='tdhalseccmon" + val.id+ "'>" 
										+ val.seccionesNombre
									+ "</td>" 
									+ "<td id='tdaccion"+ val.id + "'>"+
										val.accion.estadoIcono+val.accion.resumen
									+"</td>"
									+ "<td id='tdeviHall"+ val.id + "'>"
										+ "<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"'  >" +
											"<i class='fa fa-download'></i>"+val.evidenciaNombre
											+"</a>"
									+"</td>"
									+ "</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblHallazgoMonitoreo");
					if(!tablaFijaHallazgoMonitoreo){
						tablaFijaHallazgoMonitoreo=true;
						$("#wrapper5").css("height",$(window).height()*0.6-50+"px");
							goheadfixedY("#tblHallazgoMonitoreo","#wrapper5");
						}
					
					break;
				default:
					alert("Ocurrió un error al traer las auditorias!");
				}
			});
}
