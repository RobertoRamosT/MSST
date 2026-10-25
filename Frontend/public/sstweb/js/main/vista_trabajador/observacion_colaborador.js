/**
 * 
 */
var listFullObservacionesColaborador=[];
var listTipoReporte=[];
var listFactorSeguridad=[];
var listPotencialPerdida=[];
var objObservacionContratista={id:0};
var selEstadoObs=[
                  {id:1,nombre:"En proceso"},
                  {id:2,nombre:"Cerrado"}];
function toggleMenuOpcionObsColab(obj,pindex){
	objObservacionContratista=listFullObservacionesColaborador[pindex]; 
	$(obj).parent(".detalleAccion").find(".listaGestionGosst").toggle();
	$(obj).parent(".detalleAccion").parent().siblings().find(".listaGestionGosst").hide(); 	
}
var funcionalidadesObservacionContratista=[ 

/*{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
		window.open(URL+"/contratista/observacion/evidencia?observacionId="+objObservacionContratista.id,"_blank")}  }, */
{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:function(data){editarObservacionContratista()}  },
{id:"opcElimnar",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:function(data){eliminarObservacionColaborador()}  }
                               ]
function marcarSubOpcionObservacionColaborador(pindex){ 
	funcionalidadesObservacionContratista[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
   
function verCompletarObsColaborador(pindex){
   objObservacionContratista = {id:0};
	
   pindex = defaultFor(pindex,indexPostulante);
   indexPostulante = pindex; 
	
   var dataParam={  
      id: listFullProyectoSeguridad[pindex].id
   };
   //  
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings()
   .find(".detalleObservacionesColaborador").hide();
	
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
   .find(".detalleObservacionesColaborador").toggle() 
   //
   callAjaxPost(URL+'/contratista/proyecto/observaciones',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05": 
	    listFullObservacionesColaborador = data.list;
	    listTipoReporte = data.listReporte;
	    listFactorSeguridad = data.listFactores;
	    listPotencialPerdida = data.listPerdida; 
			
	    var menuOpcion = "<ul class='list-group listaGestionGosst'>";
			
	    funcionalidadesObservacionContratista.forEach(function(val1,index1){
	       menuOpcion += "<li class='list-group-item' " +
	       		         "onclick='marcarSubOpcionObservacionColaborador("+index1+")'>"+val1.nombre+"</li>";
	    });
			
	    menuOpcion += "</ul>";
			
	    $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	    .find(".detalleObservacionesColaborador").html("<td colspan='3'></td>");
			
	    var numPositivo = 0;
			
	    listFullObservacionesColaborador.forEach(function(val,index){  
	       var claseGosst = "gosst-neutral"; 
				
	       if(val.nota.id == 1){
	            claseGosst = "gosst-aprobado";
	         }else if(val.nota.id == 2){
	             claseGosst = "gosst-desaprobado";
	         }else{
	             claseGosst = "gosst-advertencia";
	         }
	       
//	       if(val.nivel == 2){
//		  numPositivo++;
//		  claseGosst="gosst-aprobado"
//	       }
				
	       $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	       .find(".detalleObservacionesColaborador td").append(
	          "<div id='divMovilObservacionContr"+val.id+"'>" +
		     "<div class='detalleAccion "+claseGosst+"'>" +
		        "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionObsColab(this,"+index+")'>" +
			"Ver Opciones <i class='fa fa-caret-down' aria-hidden='true'></i></a>" +
			 menuOpcion+ 
			"<strong>*** OBSERVACIÓN "+(index+1)+" ***</strong><br>"+
			"<strong><i aria-hidden='true' class='fa fa-eye'></i> Tipo de Observación: </strong>" +
			 val.tipo.nombre+"<br>"+
			"<strong><i aria-hidden='true' class='fa fa-info-circle'></i> Reportado por </strong>" + 
			 (val.reportadoPor.length == 0?"------":val.reportadoPor)+"<br>"+
			"<strong><i aria-hidden='true' class='fa fa-calendar'></i> Fecha del Reporte: </strong>" + 
			 val.fechaTexto+"<br>"+
			"<strong><i aria-hidden='true' class='fa fa-file-text-o'></i> Descripcion: </strong>"+
			 val.descripcion+"<br>" +
			"<strong><i aria-hidden='true' class='fa fa-book'></i> Acciones inmediatas tomadas: </strong>"+
			 (val.accionInmediataTomada.length == 0?"------":val.accionInmediataTomada)+"<br>" +
			"<div style='border-top:2px solid black;'></div>"+
			"<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Tipo de Reporte: </strong>"+
			 val.reporte.nombre+"<br>"+
			"<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Potencial de pérdida: </strong>"+
			 val.perdida.nombre+"<br>"+
			"<strong><i aria-hidden='true' class='fa fa-list-ul'></i> Sistema de gestión asociado:  </strong>"+
			 val.gestion.nombre+"<br>"+
			"<div style='border-top:2px solid black;'></div>"+
			"<strong><i aria-hidden='true' class='fa fa-pencil'></i> Calificación por administrador: </strong>"+
		         val.nota.icono+val.nota.nombre+"<br>" +
			"<strong><i class='fa fa-download'></i> Evidencia: </strong>" +
		         (val.evidenciaNombre == "----"?"Sin Registro":
			  "<a class='efectoLink' href='"+URL+"/contratista/observacion/evidencia?observacionId="+val.id+"'>" +
			   val.evidenciaNombre+"</a>")+"<br>"+ 
	             "</div>" + 
		     "<div class='opcionesAccion'>" +
		   //"<a onclick='nuevaAccionObservacionContratista("+index+")'>Agregar acción mejora </a>" +
	           //"<i aria-hidden='true' class='fa fa-minus'></i>" +
		        "<a onclick='verCompletarAccioneObservacionColab("+index+")'> " +
		           "Ver acciones de mejora ("+val.indicadorAcciones+")</a> " +
		     "</div>" +
		     "<div class='subOpcionAccion'></div>" +
		     "</div>");
            });
			
	    $("#trObsColab"+listFullProyectoSeguridad[pindex].id).find(".celdaIndicadorProyecto")
	    .html(""+numPositivo+" / "+listFullObservacionesColaborador.length)
			
	    $(".listaGestionGosst").hide();
			
	    var listPanelesPrincipal=[];
			
	    var selTipoReporteObs = crearSelectOneMenuOblig("selTipoReporteObs","",
	       listTipoReporte,"","id","nombre");
			
	    var selFactorObs = crearSelectOneMenuOblig("selFactorObs","",
	       listFactorSeguridad,"","id","nombre");
			
	    var selPerdidaObs = crearSelectOneMenuOblig("selPerdidaObs","",
	       listPotencialPerdida,"","id","nombre");
	    
	    var selEstadoObsContratista= crearSelectOneMenuOblig("selEstadoObsContratista","",
	       selEstadoObs,"","id","nombre");
	    
	    var listItemsFormTrab=[
	       {sugerencia:"",label:"Descripción",
		inputForm:"<input class='form-control' id='inputDescObsContr' placeholder=' '>"},
	       {sugerencia:"",label:"Fecha reporte ",
		inputForm:"<input  class='form-control' type='date' id='dateObsContr' placeholder=' '>"},
	       {sugerencia:"",label:"Tipo Reporte",inputForm:selTipoReporteObs},
//	       {sugerencia:"",label:"Factor Seguridad",inputForm:selFactorObs},
	       {sugerencia:"",label:"Potencial de Pérdida",inputForm:selPerdidaObs},
	       {sugerencia:"Si solucionó la observación, seleccione 'Cerrado'",label:"Estado Observación",
		inputForm:selEstadoObsContratista},
	       {sugerencia:" ",label:"Evidencia",divContainer:"eviObsContr"},
	       {sugerencia:"",label:"",
		inputForm:"<button type='submit' class='btn btn-success'>" +
			     "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
			  "</button>"} 
	    ];

	    var textFormTrabajador = "";
			
	    listItemsFormTrab.forEach(function(val,index){
	       textFormTrabajador+=obtenerSubPanelModulo(val);
	    }); 
			
	    $("#nuevoMovilObsContratista").remove();
	    $("#editarMovilObsColaborador").remove();
			
	    listPanelesPrincipal.push( 
	       {id:"editarMovilObsColaborador" ,clase:"contenidoFormVisible",
		nombre:""+"Editar ",
		contenido:"<form id='formEditarObsColaborador' class='eventoGeneral'>"+
		              textFormTrabajador+"</form>"});
	    //HASTA ACA
	    agregarPanelesDivPrincipal(listPanelesPrincipal); 
			
	    $("#editarMovilObsColaborador").hide();
	    $(".listaGestionGosst").hide();  
	    
	    $('#formEditarObsColaborador').on('submit',function(e){  
	       e.preventDefault(); 
	       guardarObservacionContratista();
	    }); 
			
	    break;
			
         default:
	    alert("nop");
         
            break;
      }
   });	
}

function nuevaObservacionProyectoColaborador(pindex){
	proyectoObj=listFullProyectoSeguridad[pindex];
	indexPostulante=pindex;
 objObservacionContratista={id:0};
	var dataParam={  
			id:proyectoObj.id
			};
	// 
	$("#proyectoTable"+proyectoObj.id).parent("#tituloEvento")
	.parent(".eventoGeneral").parent(".contenidoSubList")
	.parent(".divProyectoGeneral").siblings()
	.find(".detalleObservacionesColaborador").hide();
	
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleObservacionesColaborador").toggle() 
	//
	callAjaxPost(URL + '/contratista/proyecto/observaciones', dataParam, function(data) {

		var listPanelesPrincipal=[];
		var textIn= "";
		listFullObservacionesColaborador=data.list;
		listTipoReporte=data.listReporte;
		listFactorSeguridad=data.listFactores;
		listPotencialPerdida=data.listPerdida; 
	var selTipoReporteObs= crearSelectOneMenuOblig("selTipoReporteObs", "", listTipoReporte, "", 
			"id","nombre")
	var selFactorObs= crearSelectOneMenuOblig("selFactorObs", "", listFactorSeguridad, "", 
			"id","nombre")
	var selPerdidaObs= crearSelectOneMenuOblig("selPerdidaObs", "", listPotencialPerdida, "", 
			"id","nombre")
	var selEstadoObsContratista= crearSelectOneMenuOblig("selEstadoObsContratista", "", selEstadoObs, "", 
	"id","nombre")
	var listItemsFormTrab=[
    		{sugerencia:"",label:"Descripción",inputForm:"<input class='form-control'   id='inputDescObsContr' placeholder=' '>"},
    		 {sugerencia:"",label:"Fecha reporte ",inputForm:"<input  class='form-control' type='date' id='dateObsContr' placeholder=' '>" } ,
    		 {sugerencia:"",label:"Tipo Reporte",inputForm:selTipoReporteObs},
//    		 {sugerencia:"",label:"Factor Seguridad",inputForm:selFactorObs},
    		 {sugerencia:"",label:"Potencial de Pérdida",inputForm:selPerdidaObs},
     		 
    		 {sugerencia:"Si solucionó la observación, seleccione 'Cerrado'",label:"Estado Observación",inputForm:selEstadoObsContratista},
    		 {sugerencia:" ",label:"Evidencia",divContainer:"eviObsContr"},
    		  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
     		];

	 
	var textFormTrabajador="";
	listItemsFormTrab.forEach(function(val,index){
		textFormTrabajador+=obtenerSubPanelModulo(val);
	}); 
	$("#nuevoMovilObsContratista").remove();
	$("#editarMovilObsColaborador").remove();
	
	 listPanelesPrincipal.push( 
			 {id:"editarMovilObsColaborador" ,clase:"contenidoFormVisible",
				nombre:""+"Editar trabajador",
				contenido:"<form id='formEditarObsColaborador' class='eventoGeneral'>"+textFormTrabajador+"</form>"}
					);
	//HASTA ACA
	agregarPanelesDivPrincipal(listPanelesPrincipal); 
	$("#editarMovilObsColaborador").find("#dateObsContr").val(obtenerFechaActual());
	
	$(".listaGestionGosst").hide();  
	 $('#formEditarObsColaborador').on('submit', function(e) {  
	        e.preventDefault(); 
	        guardarObservacionContratista();
	 }); 
		$("#editarMovilObsColaborador").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nuevo Observación del proyecto '"
				+proyectoObj.titulo+"'  ");
		$("#editarMovilObsColaborador").find("form input").val("");
		
		$(".divListPrincipal>div").hide();
		$("#editarMovilObsColaborador").show();
		var options=
		{container:"#eviObsContr",
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"Observacion",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
	})
	
}



function editarObservacionContratista(){
	
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilObsColaborador");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar observación ");
	
	editarDiv.find("#inputDescObsContr").val(objObservacionContratista.descripcion); 
	editarDiv.find("#dateObsContr").val(convertirFechaInput(objObservacionContratista.fecha));
	editarDiv.find("#selTipoReporteObs").val(objObservacionContratista.reporte.id);
//	editarDiv.find("#selFactorObs").val(objObservacionContratista.factor.id );
	editarDiv.find("#selPerdidaObs").val(objObservacionContratista.perdida.id); 
	editarDiv.find("#selEstadoObsContratista").val(objObservacionContratista.nivel); 
	var eviNombre=objObservacionContratista.evidenciaNombre;
	var options=
	{container:"#eviObsContr",
			functionCall:function(){ },
			descargaUrl: "/contratista/observacion/evidencia?observacionId="+objObservacionContratista.id,
			esNuevo:false,
			idAux:"Observacion",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);
}

function guardarObservacionContratista(){ 
	var formDiv=$("#editarMovilObsColaborador");
	 
	var campoVacio = true;
	var descripcion=formDiv.find("#inputDescObsContr").val();  
var fecha=formDiv.find("#dateObsContr").val();
var tipo=formDiv.find("#selTipoReporteObs").val();
//var factor=formDiv.find("#selFactorObs").val();
var perdida=formDiv.find("#selPerdidaObs").val(); 
var nivel=formDiv.find("#selEstadoObsContratista").val(); 

		if (campoVacio) {

			var dataParam = {
				id : objObservacionContratista.id, 
				proyectoId: proyectoObj.id ,
				descripcion:descripcion,
				nivel:nivel,
				fecha:convertirFechaTexto(fecha),
				perdida:{id:perdida},
//				factor:{id:factor},
				reporte:{id:tipo} ,
				empresaId: parseInt(getSession("gestopcompanyid")),
				contratistaAsociado:{id:null}
			};

			callAjaxPost(URL + '/contratista/observacion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							 
							guardarEvidenciaAuto(data.nuevoId,"fileEviObservacion",
									bitsEvidenciaObservacion,
									'/contratista/observacion/evidencia/save',
									function(){
								volverDivSubContenido();
								verCompletarObsColaborador();
							},"observacionId")
						 
									break;
						default:
							console.log("Ocurrió un error al guardar la programacion!");
						}
					});
			 
		} else {
			alert("Debe ingresar todos los campos.");
		} 
	
}


function eliminarObservacionColaborador(pindex) {
	 
	var r = confirm("¿Está seguro de eliminar la obsevación?");
	if (r == true) {
		var dataParam = {
				id :  objObservacionContratista.id,
		};

		callAjaxPost(URL + '/contratista/observacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05": 
						verCompletarObsColaborador();
						break;
					default:
						alert("Hay acciones de mejora asociadas, elimínelas primero");
					}
				});
	}
} 

             
var funcionalidadesAccionMejoraObsContr=[
                            {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
                            	window.open(URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objAccAuditoria.id,'_blank')
                            	}  }
                            //, {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarAccionContrObs()}  },
                            //{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarAccionMejoraAudiContrObs()}  }
                            ];
function marcarSubOpcionAccMejoraObsContr(pindex){
	funcionalidadesAccionMejoraObsContr[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".subSubDetalleAccion ul").hide();
} 
function verCompletarAccioneObservacionColab(pindex){
	 
	pindex=defaultFor(pindex,objAuditoria.index);
	//
	 $(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
	
	// 
var audiObj={accionMejoraTipoId : 1,
		observacionId:listFullObservacionesColaborador[pindex].id};
 
objAuditoria={index:pindex};
objAccAuditoria={observacionId:listFullObservacionesColaborador[pindex].id};
callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){ 
					$("#tblAccAudi tbody tr").remove();
					detalleAccAuditoriaFull=data.list;
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						val.observacionId=objAccAuditoria.observacionId;
						 //
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesAccionMejoraObsContr.forEach(function(val1,index1){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionAccMejoraObsContr("+index1+")'>"+val1.nombre+" </li>"
						});
						menuOpcion+="</ul>"
						var claseAux="gosst-neutral";
						if(val.respuesta=="" && val.estadoId==2){
							claseAux="gosst-aprobado"
						}
						 $("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
							.find("#divMovilObservacionContr"+listFullObservacionesColaborador[pindex].id+" .subOpcionAccion").show()
							.append("<div class='subDetalleAccion  "+claseAux+"' style='border-color:"+val.estadoColor+"'>" +
									"<button class='btn btn-success' onclick='toggleMenuOpcionAccMejora(this,"+index+")'>" +
									"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
									menuOpcion+
									"<i class='fa fa-file' aria-hidden='true'></i>" +val.evidenciaNombre+"<br>"+
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
function guardarAccionObservacionContratista(functionCallBack){
	var editarDiv=$("#editarMovilObsContr");
	var campoVacio = false;
	var inputDesc = editarDiv.find("#inputDescAcc").val();

	var inputFecha =convertirFechaTexto( editarDiv.find("#inputFecAcc").val());
	var obsevacion=editarDiv.find("#inputObsAcc").val()
	  
	if(inputFecha==null){
		campoVacio=true;
	}
	hallarEstadoImplementacionAccAuditoria();
	if (!campoVacio) {

		var dataParam = {
				accionMejoraId : objAccAuditoria.id ,
				observacion:obsevacion,
			descripcion : inputDesc,
			fechaRevision : inputFecha,
			fechaReal:null,
			responsableNombre:"Contratista",responsableMail:"@asd",
			accionMejoraTipoId : 1,
			estadoId : objAccAuditoria.accionEstado,
			companyId : getSession("gestopcompanyid"),
			gestionAccionMejoraId : null,
			observacionId:objAccAuditoria.observacionId
		};
		 
		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam,
				function(data){ 
				guardarEvidenciaAuto(data.nuevoId,"fileEviAccionMejoraObsContr" 
						,bitsEvidenciaAccionMejora,"/gestionaccionmejora/accionmejora/evidencia/save",function(){
					volverDivSubContenido();
					verCompletarObsColaborador(indexPostulante);
					$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
					.find(".detalleObservacionesColaborador").show();
					if(functionCallBack!=null){ 
						functionCallBack();
					}
				},"accionMejoraId"); 
				
			 
		},null,null,null,null,false);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function nuevaAccionObservacionContratista(observacionIndex){ 
	$("#editarMovilObsContr").find("form input").val("");
		objAccAuditoria={observacionId:listFullObservacionesColaborador[observacionIndex].id};
		objAccAuditoria.id = 0;
		objAuditoria={index:observacionIndex};
		
		$(".divListPrincipal>div").hide();
		$("#editarMovilObsContr").show();
		$("#editarMovilObsContr").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nueva acción de mejora de observación de '"
				+listFullObservacionesColaborador[observacionIndex].descripcion+"' ");
		var options=
		{container:"#editarMovilObsContr #eviAccionMejora",
				functionCall:function(){ },
				descargaUrl:"",
				esNuevo:true,
				idAux:"AccionMejoraObsContr",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);  
}

function eliminarAccionMejoraAudiContrObs() {
	var r = confirm("¿Está seguro de eliminar la Accion de mejora?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : objAccAuditoria.id 
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, function(){ 
					volverDivSubContenido();
					verCompletarObsColaborador(indexPostulante);
					$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
					.find(".detalleObservacionesColaborador").show() 
				 
				 
		});
	}
}

function editarAccionContrObs(){

	$(".divListPrincipal>div").hide();
	var editarObs=$("#editarMovilObsContr");
	editarObs.show(); 
	editarObs.find(".tituloSubList")
		.html(textoBotonVolverContenido+"Editar acción de la observación '"
				+objAuditoria.descripcion+"' ");
	 
	
	objAccAuditoria.id=objAccAuditoria.accionMejoraId; 
  
	editarObs.find("#inputDescAcc").val(objAccAuditoria.descripcion);
	// 
	editarObs.find("#inputFecAcc").val(convertirFechaInput(objAccAuditoria.fechaRevision));
	editarObs.find("#inputFecAcc").attr("disabled",true);
	// 
	editarObs.find("#inputObsAcc").val(objAccAuditoria.observacion);
	//
	 var eviNombre=objAccAuditoria.evidenciaNombre;
var options=
{container:"#editarMovilObsContr #eviAccionMejora",
		functionCall:function(){ },
		descargaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objAccAuditoria.id,
		esNuevo:false,
		idAux:"AccionMejoraObsContr",
		evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options); 
}







