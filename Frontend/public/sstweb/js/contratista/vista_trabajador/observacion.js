/**
 * 
 */

var objObservacionTrabajador={};
var listFullObservacionTrabajador;
var listTipoDirigidoObsTrab=[{id:0,nombre:"Mi empresa"},{id:1,nombre:"Empresa "+getSession("gestopcompanyname")}];
var listTipoFactoresObsTrab;
var listTipoPerdidaObsTrab;
var listTipoReporteObsTrab;
var listTipoProyectoObsTrab;
function toggleMenuOpcionObsTrab(obj,pindex){
	objObservacionTrabajador=listFullObservacionTrabajador[pindex];
	objObservacionTrabajador.index=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
var funcionalidadesObsTrab=[ 
{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
	window.open(URL+"/contratista/observacion/evidencia?observacionId="+objObservacionTrabajador.id,'_blank')
	}  },
	
    {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarObservacionTrabajador()}  },
   {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarObservacionTrabajador()}  
   
    
    }
                           ]
function marcarSubOpcionObsTrab(pindex){
	funcionalidadesObsTrab[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
}
var escondioAvisoObs=false;
function eliminarAvisoObsGosst(){
	$(".gosst-aviso").remove();
	escondioAvisoObs=true;
}
function habilitarObservacionesTrabajador(){
	var textoConfidencial="Estimado colaborador: " 
		+"<br><br>En conformidad con la Ley N° 29783 “Ley de Seguridad y Salud en el trabajo”, el siguiente reporte es de carácter anónimo y los análisis serán confidenciales y evaluados de manera global. Para garantizar ello, el equipo GOSST ha tomado las medidas necesarias para proteger la información que ingresen los colaboradores, no pudiendo relacionarse un reporte particular con un colaborador determinado. Una vez guardada, no quedará un rastro electrónico que permita asociar a los colaboradores con sus reportes. Cualquier duda sobre este aspecto no dude en consultarnos al correo adrian.cox@aswan.pe" 
		+"<br><br>Muchas gracias por su participación. "
		+"<br><br>GOSST"
		+"<br><br>Tu Seguridad, Nuestra Cultura." +
		"<br><br><button class='btn btn-success' onclick='eliminarAvisoObsGosst()'>Esconder aviso</button>";
	$(".gosst-aviso").remove();
if(!escondioAvisoObs){
$(".divTituloFull").append("<div class='gosst-aviso'>"+textoConfidencial+"</div>"); 
 

}
	var dataParam={
			trabajadorId:getSession("trabajadorGosstId")
			};
	objObservacionTrabajador={id:0};
	var listPanelesPrincipal=[];
	
	callAjaxPost(URL + '/contratista/trabajador/observaciones', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var dataEmpresa=data.empresa;
			var textIn= "";
			var textSinAtender="",textAtenderSinRespuesta="",textAtenderConRespuesta="";
			var numSin=0,numConSinRespuesta=0,numConConRespuesta=0;
			listFullObservacionTrabajador=data.list;
			$(".divListPrincipal").html("");
			listFullObservacionTrabajador.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesObsTrab.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionObsTrab("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var estiloGosst="gosst-neutral";
				var tiempoTranscurrido=obtenerTiempoTranscurrido(val.fecha,val.hora);
				 
				var textAcciones="<a onclick='verDetallesAccionesObservacion("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Ver Acciones ("+val.indicadorAcciones+")</a><br>";
				if(val.reporte.id==3){
					textAcciones="";
				}
				textIn=("<div class='eventoGeneral "+estiloGosst+"'>" +
						//"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionObsTrab(this,"+index+")'>" +
						//"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
						//menuOpcion+ 
						"<strong>"+val.fechaTexto+"_"+val.horaTexto+"</strong><br>"+
						"<i class='fa fa-clock-o' aria-hidden='true'></i>"+tiempoTranscurrido+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>Reporte: "+val.reporte.nombre+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>Proyecto: "+val.proyectoNombre+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>Descripción: "+val.descripcion+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia: " +val.evidenciaNombre+"<br>"+

						textAcciones+
						 "</div>"+
						 "<div class='divDetalleObsTrab divRelacionado' id='ObsTrab"+val.id+"'>" +
						"" +
						"</div>");
				 if(val.accionesPlanificadas==0){
					
					 if(val.reporte.id==3){
						 textAtenderConRespuesta+=textIn;
						 numConConRespuesta++
					 }else{
						 textSinAtender+=textIn;
						 numSin++
					 }
				 }else{
					 
					 
					 if(val.accionesPlanificadas==val.accionesPlanificadas){
						 textAtenderConRespuesta+=textIn;
						 numConConRespuesta++
					 }else{
						 textAtenderSinRespuesta+=textIn;
						 numConSinRespuesta++
					 }
				 }
				
			});
			
			
			listTipoFactoresObsTrab=data.listFactores;
			listTipoPerdidaObsTrab=data.listPerdida;
			listTipoReporteObsTrab=data.listReporte;
			listTipoProyectoObsTrab=data.proyectos;
			listTipoDirigidoObsTrab.forEach(function(val,index){
				if(val.id==1){
					val.nombre=""+dataEmpresa.name+" "
				}
			});
			listTipoDirigidoObsTrab=data.listDirigido;
			var slcTipoDirigidoObs=crearSelectOneMenuOblig("slcTipoDirigidoObs", "",
					listTipoDirigidoObsTrab, "", "id", "nombre");
			var slcTipoProyectoObs=crearSelectOneMenuOblig("slcTipoProyectoObs", "",listTipoProyectoObsTrab, 
					 "", "id","titulo");
			var slcTipoReporteObs=crearSelectOneMenuOblig("slcTipoReporteObs", "verAcordeTipoReporteActo()",listTipoReporteObsTrab, 
					 "", "id","nombre");
			listTipoPerdidaObsTrab=listTipoPerdidaObsTrab.filter(function(val){
				if(val.id!=1){
					return true;
				}else{
					return false;
				}
			});
			var slcTipoPerdidaObs=crearSelectOneMenuOblig("slcTipoPerdidaObs", "",listTipoPerdidaObsTrab, 
					 "", "id","nombre");
			var listItemsExam=[ 
				{sugerencia:"",label:"Dirigido a",inputForm:slcTipoDirigidoObs,divContainer:""},
				{sugerencia:"",label:"Proyecto",inputForm:slcTipoProyectoObs,divContainer:""},
				{sugerencia:"",label:"Tipo de reporte",inputForm:slcTipoReporteObs,divContainer:""},
				 {sugerencia:"",label:"Descripción",inputForm:"<input   class='form-control' id='inputDescObsTrab'>"},
				
				{sugerencia:"",label:"Nivel de riesgo",inputForm:slcTipoPerdidaObs,divContainer:"divNivelRiesgo"}, 
       			 {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviObservacionTrabajador"},
       			 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
             		];
			var textFormExamen="";
			listItemsExam.forEach(function(val,index){
				textFormExamen+=obtenerSubPanelModulo(val);
			});
			listPanelesPrincipal.push(
					{id:"nuevoMovilObsTrab" ,clase:"",
							nombre:""+"Nueva reporte de observación",
							contenido:"<form id='formNuevoObsTrab' class='eventoGeneral'>"+textFormExamen+"</form>"},
					{id:"editarMovilObsTrab" ,clase:"contenidoFormVisible",
						nombre:""+"Editar ObsTrab",
						contenido:"<form id='formEditarObsTrab' class='eventoGeneral'>"+textFormExamen+"</form>"},
					 
						
					{id:"ObservacionesSinAtender",clase:"divObservacionTrabajadorGeneral",
							nombre:"Reportes Sin atender"+" (" +numSin+")",
							contenido:textSinAtender},
					{id:"ObservacionesAtenderSinRespuesta",clase:"divObservacionTrabajadorGeneral",
						nombre:"Reportes Atendidos Sin Implementar"+" (" +numConSinRespuesta+")",
						contenido:textAtenderSinRespuesta} ,
					{id:"ObservacionesAtenderConRespuesta",clase:"divObservacionTrabajadorGeneral",
						nombre:"Reportes Atendidos e Implementados"+" (" +numConConRespuesta+")",
						contenido:textAtenderConRespuesta} 
						
			
			);
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);verAcordeTipoReporteActo();
			var options=
			{container:"#eviObservacionTrabajador",
					functionCall:function(){ },
					descargaUrl: "",
					esNuevo:true,
					idAux:"ObsTrabajador"+objObservacionTrabajador.id,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			 $('#formNuevoObsTrab').on('submit', function(e) {  
			        e.preventDefault();
			        objObservacionTrabajador={id:0}
			        guardarObservacionTrabajador();
			 });
			 $('#formEditarObsTrab').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarObservacionTrabajador();
			 });
			 
			break;
			default:
				alert("nop");
				break;
		}
	})
}
function verAcordeTipoReporteActo(){
	var tipoId=parseInt($("#slcTipoReporteObs").val());
	$("#divNivelRiesgo").parent().show();
	if(tipoId==3){
		$("#divNivelRiesgo").parent().hide();
	}
}
function editarObservacionTrabajador(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilObsTrab");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Observación");
	 
	editarDiv.find("#selTipoReporteObs").val(objObservacionTrabajador.reporte.id); 
	editarDiv.find("#slcTipoPerdidaObs").val(objObservacionTrabajador.perdida.id); 
	editarDiv.find("#selEstadoObsContratista").val(objObservacionTrabajador.nivel); 
	editarDiv.find("#slcTipoProyectoObs").val(objObservacionTrabajador.proyectoId); 
	editarDiv.find("#inputDescObsTrab").val(objObservacionTrabajador.descripcion);  
	var eviNombre=objObservacionTrabajador.evidenciaNombre;
	var options=
	{container:"#eviObsContr",
			functionCall:function(){ },
			descargaUrl: "/contratista/observacion/evidencia?observacionId="+objObservacionTrabajador.id,
			esNuevo:false,
			idAux:"Observacion",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);verAcordeTipoReporteActo();
	
}
function eliminarObservacionTrabajador(){
	var r = confirm("¿Está seguro de eliminar la observacion ?");
	if (r == true) {
		var dataParam = {
				id : objObservacionTrabajador.id,
		};
		callAjaxPost(URL + '/contratista/observacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarObservacionesTrabajador();
						break;
					default:
						alert("No se puede eliminar, hay   asociados.");
					}
				});
	}
}
function guardarObservacionTrabajador(){
	var formDiv=$("#editarMovilObsTrab");
	if(objObservacionTrabajador.id==0){
		formDiv=$("#nuevoMovilObsTrab");
	}
	var campoVacio = true;
	var descripcion=formDiv.find("#inputDescObsTrab").val();  
	var fecha=new Date();
	var tipo=parseInt(formDiv.find("#slcTipoReporteObs").val());
	var factor=4;
	var perdida=formDiv.find("#slcTipoPerdidaObs").val();
	var proyectoId=formDiv.find("#slcTipoProyectoObs").val(); 
	var lugar=formDiv.find("#inputLugarObsTrab").val();
	var contratistaObj={id:getSession("contratistaGosstId")};
	var quienId=formDiv.find("#slcTipoDirigidoObs").val();
	if(parseInt(quienId)==0){
		contratistaObj={id:null}
	}
	var isactivo=comprobarFieInputExiste("fileEviObsTrabajador"+objObservacionTrabajador.id);
	if(isactivo.isValido){
		
	}else{
		alert(isactivo.mensaje)
		return;
	}
	var nivel=1;
	if(tipo==3){
		nivel=2;
	}
		if (campoVacio) {

			var dataParam = {
					id : objObservacionTrabajador.id, 
					proyectoId: proyectoId ,tipo:{id:1},
					descripcion:descripcion,
					nivel:nivel,
					fecha:fecha,hora:obtenerHoraActual(),
					perdida:{id:perdida},
					factor:{id:factor},
					reporte:{id:tipo}, trabajador:{id:getSession("trabajadorGosstId")},
					contratistaAsociado:contratistaObj
			}

			callAjaxPost(URL + '/contratista/observacion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							
							guardarEvidenciaAuto(data.nuevoId,"fileEviObsTrabajador"+objObservacionTrabajador.id
									,bitsEvidenciaAccionMejora,"/contratista/observacion/evidencia/save",
									function(){
								habilitarObservacionesTrabajador();
							},"observacionId"); 
							break;
						default:
							console.log("Ocurrió un error al guardar   !");
						}
					});
			 
		} else {
			alert("Debe ingresar todos los campos.");
		}
}

function verDetallesAccionesObservacion(pindex){
	  
	//
	 $(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
	
	// 
var audiObj={accionMejoraTipoId : 1,
		observacionId:listFullObservacionTrabajador[pindex].id}; 
callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){
					detalleAccAuditoriaFull=data.list;
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						var btnDescarga="<a class='btn btn-success' href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.id+"' target='_blank'><i class='fa fa-download'></i>Descargar</a>"
						if(val.evidenciaNombre==""){
							btnDescarga="";
						} 
						//
						 $("#ObsTrab"+listFullObservacionTrabajador[pindex].id).show()
							.append("<div class='detalleAccion  gosst-neutral' style='border-color:"+val.estadoColor+"'>" +
									 
									"<i class='fa fa-file' aria-hidden='true'></i>" +val.evidenciaNombre+"  "+btnDescarga+"<br>"+
									"<i class='fa fa-info' aria-hidden='true'></i>" +val.descripcion+ "<br>"+
									"<i class='fa fa-clock-o' aria-hidden='true'></i>" +val.fechaRevisionTexto+ 
									""+
									"</div> " ); 
					});
					$(".subDetalleAccion ul").hide();
					formatoCeldaSombreableTabla(true,"tblAccAudi");
				}else{
					console.log("NOPNPO")
				}
			});
}