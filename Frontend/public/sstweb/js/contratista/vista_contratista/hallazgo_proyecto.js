/**
 * 
 */
var listAreasHallazgoColaborador;
var listNivelesHallazgoColaborador;
var listTipoReporteHallazgoColaborador;
var listFactorHallazgoColaborador;
var listSeccionesInteresadasHallazgoColaborador;
var listFullHallazgosColaborador;
var objHallazgoColaborador;
var funcionalidadesHallazgo=[
         {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
        window.open(URL+"/auditoria/hallazgo/evidencia?hallazgoId="+objHallazgoColaborador.id,'_blank')
         	}  },
         {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarHallazgoColaborador()}  },
         {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarHallazgoColaborador()}  }];

 function marcarSubOpcionHallazgo(pindex){
	 funcionalidadesHallazgo[pindex].functionClick();
 	$(".subDetalleAccion ul").hide(); 	
 }
 function toggleMenuOpcionHallazgo(obj,pindex){
	 objHallazgoColaborador=listFullHallazgosColaborador[pindex]; 
 	$(obj).parent(".subDetalleAccion").parent().find("ul").toggle();
$(obj).parent(".subDetalleAccion").parent().siblings().find("ul").hide(); 
 }
function verCompletarHallazgos(pindex){
	pindex=defaultFor(pindex,objAuditoriaGeneral.index);
	var val1=listFullAuditoriaGeneral[pindex];
	objAuditoriaGeneral.index=pindex;
	$(".subOpcionAccion").hide();
	$(".subOpcionAccion").html("");
			var dataParam = {
					auditoriaId : val1.auditoriaId,
					auditoriaTipo : val1.auditoriaTipo
				};
			detalleAuditoriaFull=[]
				callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
						function(data1){
					listFullHallazgosColaborador=data1.list;
					var bodyText=""; 
					listFullHallazgosColaborador.forEach(function(val2,index2){
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesHallazgo.forEach(function(val,index){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionHallazgo("+index+")'>"+val.nombre+" </li>"
						});
						menuOpcion+="</ul>";
						var btnOpcion="<button class='btn btn-success' onclick='toggleMenuOpcionHallazgo(this,"+index2+")'>" +
									"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>"; 
						 
						var textEvi=" ";
						if(val2.evidenciaNombre=="----"){
							textEvi="";
						} 
						var aprobado="gosst-neutral"	 
						$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
						.find("#divMovilAuditoria"+listFullAuditoriaGeneral[pindex].auditoriaId+" .subOpcionAccion").show()
						.append("<div id='subDivMovilDetalleAudi"+val2.id+"'>" +
								"<div class='subDetalleAccion  "+aprobado+"'   >" +
								btnOpcion+ 
								menuOpcion+
								"<i class='fa fa-info' aria-hidden='true'></i>" +val2.descripcion+ "<br>"+
								"<i class='fa fa-info' aria-hidden='true'></i>" +val2.lugar+ "<br>"+
								
								"<i class='fa fa-file' aria-hidden='true'></i>" +val2.evidenciaNombre+ 
								 
								"</div> " +
								"<div class='opcionesDetalleAccion'>" +
								
									"<a onclick='verCompletarAccioneHallazgoColaborador("+index2+")'> Ver Acciones ("+val2.numAcciones+")</a>" +
									"<div class='subOpcionDetalleAccion'>" + 
									"</div>"+
								"</div>" +
									"</div>" );
					 
						
					});
					$(".subDetalleAccion ul").hide();
					agregarFormsHallazgo(data1);
					$("#editarMovilHallProyColab").hide();
					
				});
}
function agregarHallazgoInspeccion(pindex){
	
	objHallazgoColaborador={id:0};
	
	pindex=defaultFor(pindex,objAuditoriaGeneral.index);
	var val1=listFullAuditoriaGeneral[pindex];
	objHallazgoColaborador.auditoriaId=val1.auditoriaId;
	objAuditoriaGeneral.index=pindex;
	$(".subOpcionAccion").hide();
	$(".subOpcionAccion").html("");
	
	var dataParam = {
			auditoriaId : val1.auditoriaId,
			auditoriaTipo : val1.auditoriaTipo
		};
	detalleAuditoriaFull=[]
		callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
				function(data){
			agregarFormsHallazgo(data);
			$(".divListPrincipal>div").hide();
			$("#editarMovilHallProyColab").show();
		})
	
	
}
function agregarFormsHallazgo(data){
	var listPanelesPrincipal=[];
	var textIn= "";
	
	listAreasHallazgoColaborador=data.areas;
	listNivelesHallazgoColaborador=data.niveles;
	listTipoReporteHallazgoColaborador=data.tiposReporte;
	listFactorHallazgoColaborador=data.factor;
	listSeccionesInteresadasHallazgoColaborador=data.secciones;
	var selAreaHallColab= crearSelectOneMenuOblig("selAreaHallColab", "", listAreasHallazgoColaborador, "", 
			"areaId","areaName")
	var selNivelHallColab= crearSelectOneMenuOblig("selNivelHallColab", "", listNivelesHallazgoColaborador, "", 
			"id","nombre");
	var selTipoReporteHallazgo= crearSelectOneMenuOblig("selTipoReporteHallazgo", "", listTipoReporteHallazgoColaborador, "", 
			"id","nombre");
	var selFactorHallazgo= crearSelectOneMenuOblig("selFactorHallazgo", "", listFactorHallazgoColaborador, "", 
			"id","nombre");
	var listItemsFormHall=[
       		{sugerencia:"",label:"Descripción",inputForm:"<input class='form-control' autofocus='true'  id='inputDescHallColab'  >"},
       		// {sugerencia:"",label:"Área ",inputForm: selAreaHallColab } ,
       	 {sugerencia:"",label:"Nivel de riesgo",inputForm:selNivelHallColab},
    	 {sugerencia:"",label:"Tipo de reporte",inputForm:selTipoReporteHallazgo},
       	 {sugerencia:"",label:"Factor de seguridad",inputForm:selFactorHallazgo},
		 {sugerencia:"",divContainer:"divSeccHallColab",label:"Parte interesada (nivel empresa)",inputForm:""},
       		// {sugerencia:"",label:"Causa",inputForm:"<input class='form-control'   id='inputCausaHallColab'  >"},
       		 {sugerencia:"",label:"Lugar específico",inputForm:"<input class='form-control'   id='inputLugarHallColab'  >"},
        		  
       		 {sugerencia:" ",label:"Evidencia",divContainer:"divEviHallazgoProy"},
       		  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"}, 
       		 {sugerencia:"",label:"",inputForm:"<button id='btnAgregarNuevoHallazgo' type='button' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar y registrar otro Hallazgo</button>"} 
     			];
	 
   	var textFormHall="";
   	listItemsFormHall.forEach(function(val,index){
   		textFormHall+=obtenerSubPanelModulo(val);
   	});
   	var listEditarPrincipal=[ 
			{id:"editarMovilHallProyColab" ,clase:"contenidoFormVisible",
				nombre:textoBotonVolverContenido+""+"Nuevo Hallazgo",
				contenido:"<form id='formEditarHallColab' class='eventoGeneral'>"+textFormHall+"</form>"}
					];
   	$("#editarMovilHallProyColab").remove();
   	agregarPanelesDivPrincipal(listEditarPrincipal);
   	$("#editarMovilHallProyColab").find("form input").val("");
   	listSeccionesInteresadasHallazgoColaborador.forEach(function(val){
		val.selected=0;
	});
   	crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo", "",
			listSeccionesInteresadasHallazgoColaborador,  "id", "nombre","#divSeccHallColab","Secciones interesadas ...");
	
	
	$("#editarMovilHallProyColab").find(".tituloSubList")
	.html(textoBotonVolverContenido+"Nuevo Hallazgo");
	var options=
	{container:"#divEviHallazgoProy",
			functionCall:function(){ },
			descargaUrl: "",
			esNuevo:true,
			idAux:"HallazgoProy",
			evidenciaNombre:""};
	crearFormEvidenciaCompleta(options);
	$('#formEditarHallColab').on('submit', function(e) {  
        e.preventDefault(); 
        guardarHallazgoColaborador();
	});
	$("#btnAgregarNuevoHallazgo").on("click",function(e){
		e.preventDefault(); 
		guardarHallazgoColaborador(function(){
			agregarHallazgoInspeccion(objAuditoriaGeneral.index)
		});
	 });
}
function guardarHallazgoColaborador(functionCallBack) {

	var campoVacio = true;
	var inputDesc = $("#inputDescHallColab").val();
	if(inputDesc=="")
	{
		alert("El almacenamiento es solo valido para Hallazgo con Descripción");
		return;
	}
	var inputCausa = $("#inputCausaHallColab").val();
	var inputLugar = $("#inputLugarHallColab").val();
	var area = $("#selAreaHallColab").val();
	var nivel= $("#selNivelHallColab").val();
	
	var factor= $("#selFactorHallazgo").val();
	var tipoReporte = $("#selTipoReporteHallazgo").val();
	var secciones=$("#slcSeccionesPermitidaHallazgo").val();
	var listSecciones=[];
	if(secciones != null){
        	if($("#slcSeccionesPermitidaHallazgo").length>0){
        		secciones.forEach(function(val,index){
        			listSecciones.push({id:val});
        		});
        	}
	}
	if (campoVacio) {

		var dataParam = {
			id : objHallazgoColaborador.id,
			factor:{id:factor},tipoReporte: {id:tipoReporte},
			secciones:listSecciones,
			descripcion : inputDesc,
			//area:{areaId:area},
			nivel:{id:nivel},
			//causa: inputCausa,
			lugar:inputLugar,
			auditoriaId: objHallazgoColaborador.auditoriaId
		};

		callAjaxPost(URL + '/auditoria/hallazgo/save', dataParam,
				function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				guardarEvidenciaAuto(data.nuevoId,"fileEviHallazgoProy",bitsEvidenciaHallazgo,
						"/auditoria/hallazgo/evidencia/save",function(){
					if(functionCallBack!=null){
						 alert("Guardado");
						functionCallBack();
					}else{
						volverDivSubContenido();
						verCompletarHallazgos(objHallazgoColaborador.index);
					}
					
				},"hallazgoId");
				
				break;
			default:
				alert("Ocurrió un error al guardar la auditoria!");
			}
			
		});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function editarHallazgoColaborador(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilHallProyColab");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar hallazgo ");
	
	editarDiv.find("#inputDescHallColab").val(objHallazgoColaborador.descripcion); 
	//editarDiv.find("#inputCausaHallColab").val(objHallazgoColaborador.causa); 
	editarDiv.find("#inputLugarHallColab").val(objHallazgoColaborador.lugar); 
	
	//editarDiv.find("#selAreaHallColab").val(objHallazgoColaborador.area.areaId);
	editarDiv.find("#selNivelHallColab").val(objHallazgoColaborador.nivel.id );  
	editarDiv.find("#selTipoReporteHallazgo").val(objHallazgoColaborador.tipoReporte.id );  
	editarDiv.find("#selFactorHallazgo").val(objHallazgoColaborador.factor.id );  
	//
	var seccionesId=objHallazgoColaborador.seccionesId.split(",")
	listSeccionesInteresadasHallazgoColaborador.forEach(function(val){
		val.selected=0;
		seccionesId.forEach(function(val1){
			if(parseInt(val1)==val.id){
				val.selected=1;
			}
		})
	});	
	crearSelectOneMenuObligMultipleCompleto("slcSeccionesPermitidaHallazgo", "",
			listSeccionesInteresadasHallazgoColaborador,  "id", "nombre","#divSeccHallColab","Secciones interesadas ...");
							
	
	
	//
	
	var eviNombre=objHallazgoColaborador.evidenciaNombre;
	var options=
	{container:"#eviObsContr",
			functionCall:function(){ },
			descargaUrl: "/auditoria/hallazgo/evidencia?hallazgoId="+objHallazgoColaborador.id,
			esNuevo:false,
			idAux:"HallazgoProy",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);
}

function eliminarHallazgoColaborador(){
	var r = confirm("¿Está seguro de eliminar el hallazgo?");
	if (r == true) {
		var dataParam = {
				id : objHallazgoColaborador.id,
		};

		callAjaxPost(URL + '/auditoria/hallazgo/delete', dataParam,
				function(data){
			switch (data.CODE_RESPONSE) {
			case "05":
				volverDivSubContenido();
				verCompletarHallazgos(objHallazgoColaborador.index);
				break;
			default:
				alert("Ocurrió un error al eliminar la auditoria!");
			}
		});
	}
}

function verCompletarAccioneHallazgoColaborador(pindex){
	pindex=defaultFor(pindex,objAuditoria.index);
	//
	 $(".subOpcionDetalleAccion").html("");
	 $(".subOpcionDetalleAccion").hide();
	
	 objHallazgoColaborador=listFullHallazgosColaborador[pindex];
var audiObj={accionMejoraTipoId : 1,
		hallazgoId:objHallazgoColaborador.id};

banderaEdicionAccAuditoria=false;
objAuditoria={index:pindex};
objAccAuditoria={hallazgoId:objHallazgoColaborador.id};

callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){
					detalleAccAuditoriaFull=data.list; 
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						val.hallazgoId=objHallazgoColaborador.id;
						 //
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesAccionMejoraColaborador.forEach(function(val1,index1){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionAccMejoraColaborador("+index1+")'>"+val1.nombre+" </li>"
						});
						menuOpcion+="</ul>"
						var textResp="";
						if(val.respuesta.length>0){
							textResp=iconoGosst.advertir+" "+val.respuesta+"<br>"
						}
						var claseAux="gosst-neutral";
						if(val.respuesta=="" && val.estadoId==2){
							claseAux="gosst-aprobado"
						}
						 $("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
							.find("#subDivMovilDetalleAudi"+objHallazgoColaborador.id+" .subOpcionDetalleAccion").show()
							.append("<div class='subDetalleAccion "+claseAux+"' >" +
									"<button class='btn btn-success' onclick='toggleMenuOpcionAccMejoraColaborador(this,"+index+")'>" +
									"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
									menuOpcion+
									textResp+
									"<i class='fa fa-file' aria-hidden='true'></i>" +val.evidenciaNombre+"<br>"+
									"<i class='fa fa-info' aria-hidden='true'></i>" +val.descripcion+ "<br>"+
									"<i class='fa fa-clock-o' aria-hidden='true'></i>" +val.fechaRevisionTexto+ 
									""+
									"</div> " );
						 
					});
					$(".subDetalleAccion ul").hide(); 
				}else{
					console.log("NOPNPO")
				}
			});
}