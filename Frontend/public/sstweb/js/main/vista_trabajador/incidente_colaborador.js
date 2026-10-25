
var listFullIncidentesColaborador=[];
var listTipoAccidente=[]; 
var listSubTipoAccidente=[];
var listTrabajadoresAccidente=[];
var listClasificacionAccidente;
var objIncidenteColaborador={id:0};

function toggleMenuOpcionIncColab(obj,pindex){
   objIncidenteColaborador = listFullIncidentesColaborador[pindex]; 
   
   $(obj).parent(".detalleAccion").find(".listaGestionGosst").toggle();
   $(obj).parent(".detalleAccion").parent().siblings().find(".listaGestionGosst").hide(); 	
}

var funcionalidadesIncidenteContratista=[
   {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
    window.open(URL+"/contratista/proyecto/incidente/evidencia?id="+objIncidenteColaborador.accidenteId,"_blank")}},
   {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarIncidenteColaborador()}}
//,{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarIncidenteContratista()} }
];

function marcarSubOpcionIncidenteColaborador(pindex){ 
   funcionalidadesIncidenteContratista[pindex].functionClick();
   $(".listaGestionGosst").hide();
}
    
function verCompletarIncidenteColaborador(pindex){
	pindex=defaultFor(pindex,indexPostulante);
	indexPostulante=pindex;
	//
	 
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
	.parent(".eventoGeneral").parent(".contenidoSubList")
	.parent(".divProyectoGeneral").siblings()
	.find(".detalleIncidentesProyecto").hide();
	
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	.find(".detalleIncidentesProyecto").toggle() 
	// 
	
	var proyectoObj1 = {
			id : listFullProyectoSeguridad[pindex].id,
			contratistaId:proyectoObj.postulante.contratista.id
	};
	
	callAjaxPost(URL + '/contratista/proyecto/incidentes', proyectoObj1,
			function(data){
		var list = data.list;
		listFullIncidentesColaborador=list; 
		listTipoAccidente=data.tipo; 
		listSubTipoAccidente=data.subtipo;
		listClasificacionAccidente=data.clasificacion;
		listTrabajadoresAccidente=data.trabs;
		$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
		.find(".detalleIncidentesProyecto").html("<td colspan='3'></td>");
		list.forEach(function(val1,index1){
			var textoBotonAct="<button class='btn btn-success' style='padding:5px' onclick='verCompletarAccioneIncidente("+index1+")'>" +
			"<i class='fa fa-external-link-square' aria-hidden='true'></i></button>";
			var iconoDescarga=
				"<a href='"+URL+"/contratista/proyecto/incidente/evidencia?id="+val1.accidenteId+"' target='_blank'>" +
						"<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
			if(val1.evidenciaNombre=="----"){
				iconoDescarga="";
			}
			var menuOpcion="<ul class='list-group listaGestionGosst' >";
			funcionalidadesIncidenteContratista.forEach(function(val1,index1){
				menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionIncidenteColaborador("+index1+")'>"+val1.nombre+" </li>"
			});
			menuOpcion+="</ul>";
			
			
			var claseNotaDocumento="gosst-neutral";
			$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
			.find(".detalleIncidentesProyecto td")
			.append("<div id='divMovilIncidente"+val1.accidenteId+"'>" +
					"<div class='detalleAccion "+claseNotaDocumento+"'> " +
					"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionIncColab(this,"+index1+")'>" +
					"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
					menuOpcion+
					"<i aria-hidden='true' class='fa fa-file'></i>"+
					val1.evidenciaNombre+ "<br>" +
					"<i class='fa fa-user'></i> "+val1.trabajadorContratista.nombre+"<br>" +
					"<i aria-hidden='true' class='fa fa-caret-right'></i>"+
					val1.accidenteTipoNombre+": "+val1.accidenteDescripcion+ "<br>" +
					""+val1.accidenteSubTipoNombre+" / "+val1.accidenteClasificacionNombre+"<br>"+
					"<i class='fa fa-search'></i><strong>Estado de investigación: </strong>"+val1.accidenteInformeNombre+"<br>"+
					 val1.fecha+"</div>" +
				"<div class='opcionesAccion'>" +
				 
				 
						"<i aria-hidden='true' class='fa fa-minus'></i>" +
				"<a onclick='verCompletarAccioneIncidenteColaborador("+index1+")'> Ver Acciones de mejora ("+val1.indicadorAcciones+")</a> </div>" +
						"<div class='subOpcionAccion'></div>")
			//
						$(".listaGestionGosst").hide();  
		});
		//
		var selTipoAccidente= crearSelectOneMenuOblig("selTipoAccidente", "verAcuerdoTipoAccidente()", listTipoAccidente, "", 
				"id","nombre") 
		var selSubTipoAccidente= crearSelectOneMenuOblig("selSubTipoAccidente", "", listSubTipoAccidente, "", 
				"id","nombre") 
		var selClasAccidente= crearSelectOneMenuOblig("selClasAccidente", "", listClasificacionAccidente, "", 
				"id","nombre") 
		var selTrabajadorAccidente= crearSelectOneMenuOblig("selTrabajadorAccidente", "", listTrabajadoresAccidente, "", 
				"id","nombre") 
		var listItemsFormTrab=[
	           {sugerencia:"",label:"Trabajador Afectado",inputForm:selTrabajadorAccidente},
	    	{sugerencia:"",label:"Fecha reporte ",inputForm:"<input  class='form-control' type='date' id='dateInciProy' placeholder=' '>" } ,
	   		 {sugerencia:"",label:"Tipo",inputForm:selTipoAccidente},
	   		 	{sugerencia:"",label:"Sub-Tipo",inputForm:selSubTipoAccidente,divContainer:"divSelSubTipo"},
	   		{sugerencia:"",label:"Nivel Incapacitante",inputForm:selClasAccidente},
			{sugerencia:" ",label:"Descripción",inputForm:"<input class='form-control'   id='inputDescIncProy' placeholder=' '>"},
	    		 {sugerencia:" ",label:"Lugar",inputForm:"<input class='form-control' id='inputLugarIncProy'>"},
	     		
	    		  {sugerencia:" ",label:"Evidencia",divContainer:"eviInciProy"},
	    		  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
	     		];

		 
		var textFormTrabajador="";
		listItemsFormTrab.forEach(function(val,index){
			textFormTrabajador+=obtenerSubPanelModulo(val);
		}); 
		var listPanelesPrincipal=[];
		listPanelesPrincipal.push(
				 {id:"editarMovilIncidenteProy" ,clase:"contenidoFormVisible",
					nombre:""+"Editar trabajador",
					contenido:"<form id='formEditarIncidenteProy' class='eventoGeneral'>"+textFormTrabajador+"</form>"}
						);
		//HASTA ACA
		agregarPanelesDivPrincipal(listPanelesPrincipal); 
		 $('#formEditarIncidenteProy').on('submit', function(e) {  
		        e.preventDefault(); 
		        guardarIncidenteContratista();
		 }); 
		 $(".contenidoFormVisible").hide();
		
	});
}


function nuevoIncidenteProyectoColaborador(pindex){
	proyectoObj=listFullProyectoSeguridad[pindex];
	indexPostulante=pindex;
 objIncidenteColaborador={id:0};
	var dataParam={  
			id:proyectoObj.id,
			contratistaId:proyectoObj.postulante.contratista.id
			};
	// 
	$("#proyectoTable"+proyectoObj.id).parent("#tituloEvento")
	.parent(".eventoGeneral").parent(".contenidoSubList")
	.parent(".divProyectoGeneral").siblings()
	.find(".detalleIncidentesProyecto").hide();
	
	$("#proyectoTable"+proyectoObj.id)
	.find(".detalleIncidentesProyecto").toggle() 
	//
	callAjaxPost(URL + '/contratista/proyecto/incidentes', dataParam, function(data) {

		var listPanelesPrincipal=[];
		var textIn= "";
		listFullIncidentesColaborador=data.list;
		listTipoAccidente=data.tipo; 
		listSubTipoAccidente=data.subtipo;
		listClasificacionAccidente=data.clasificacion;
		listTrabajadoresAccidente=data.trabs;
		var selTipoAccidente= crearSelectOneMenuOblig("selTipoAccidente", "verAcuerdoTipoAccidente()", listTipoAccidente, "", 
			"id","nombre") 
	var selSubTipoAccidente= crearSelectOneMenuOblig("selSubTipoAccidente", "", listSubTipoAccidente, "", 
			"id","nombre") 
	var selClasAccidente= crearSelectOneMenuOblig("selClasAccidente", "", listClasificacionAccidente, "", 
			"id","nombre") 
	var selTrabajadorAccidente= crearSelectOneMenuOblig("selTrabajadorAccidente", "", listTrabajadoresAccidente, "", 
			"id","nombre") 
	var listItemsFormTrab=[
           {sugerencia:"",label:"Trabajador Afectado",inputForm:selTrabajadorAccidente},
    	{sugerencia:"",label:"Fecha reporte ",inputForm:"<input  class='form-control' type='date' id='dateInciProy' placeholder=' '>" } ,
   		 {sugerencia:"",label:"Tipo",inputForm:selTipoAccidente},
   		 	{sugerencia:"",label:"Sub-Tipo",inputForm:selSubTipoAccidente,divContainer:"divSelSubTipo"},
   		{sugerencia:"",label:"Nivel Incapacitante",inputForm:selClasAccidente},
		{sugerencia:" ",label:"Descripción",inputForm:"<input class='form-control'   id='inputDescIncProy' placeholder=' '>"},
    		 {sugerencia:" ",label:"Lugar",inputForm:"<input class='form-control' id='inputLugarIncProy'>"},
     		
    		  {sugerencia:" ",label:"Evidencia",divContainer:"eviInciProy"},
    		  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
     		];

	 
	var textFormTrabajador="";
	listItemsFormTrab.forEach(function(val,index){
		textFormTrabajador+=obtenerSubPanelModulo(val);
	}); 
	$("#nuevoMovilObsContratista").remove();
	$("#editarMovilIncidenteProy").remove();
	
	 listPanelesPrincipal.push(
			 {id:"editarMovilIncidenteProy" ,clase:"contenidoFormVisible",
				nombre:""+"Editar trabajador",
				contenido:"<form id='formEditarIncidenteProy' class='eventoGeneral'>"+textFormTrabajador+"</form>"}
					);
	//HASTA ACA
	agregarPanelesDivPrincipal(listPanelesPrincipal); 
	verAcuerdoTipoAccidente();
	
	$(".listaGestionGosst").hide();  
	 $('#formEditarIncidenteProy').on('submit', function(e) {  
	        e.preventDefault(); 
	        guardarIncidenteContratista();
	 }); 
		$("#editarMovilIncidenteProy").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nuevo Observación del proyecto '"
				+proyectoObj.titulo+"' al Cliente ");
		$("#editarMovilIncidenteProy").find("form input").val("");
		$("#editarMovilIncidenteProy").find("#dateInciProy").val(obtenerFechaActual());
		 
		$(".divListPrincipal>div").hide();
		$("#editarMovilIncidenteProy").show();
		var options=
		{container:"#eviInciProy",
				functionCall:function(){ },
				descargaUrl: "",
				esNuevo:true,
				idAux:"Incidente",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
	})
	
}
function verAcuerdoTipoAccidente(){
	var tipoId=$("#selTipoAccidente").val();
	var selSubTipoAccidente= crearSelectOneMenuOblig("selSubTipoAccidente", "", 
			listSubTipoAccidente.filter(function(val){
				return val.tipo.id==tipoId
			}), "", 
			"id","nombre") 
	$("#divSelSubTipo").html(selSubTipoAccidente);
}

 

function guardarIncidenteContratista(){ 
	var formDiv=$("#editarMovilIncidenteProy"); 
	var campoVacio = true;
	var lugar=formDiv.find("#inputLugarIncProy").val();  
	var descripcion=formDiv.find("#inputDescIncProy").val();  
var fecha=formDiv.find("#dateInciProy").val();
var tipo=formDiv.find("#selTipoAccidente").val(); 
var subtipo=formDiv.find("#selSubTipoAccidente").val(); 
var clasificacion=formDiv.find("#selClasAccidente").val(); 
var trab=formDiv.find("#selTrabajadorAccidente").val();
		if (campoVacio) {

			var dataParam = {
					accidenteId : objIncidenteColaborador.id, 
				idCompany:getSession("gestopcompanyid"),
				proyectoId: proyectoObj.id ,
				accidenteDescripcion:descripcion, lugar:lugar,
				fechaN:convertirFechaTexto(fecha), 
				accidenteTipoId: tipo , 
				accidenteSubTipoId: subtipo  ,
				trabajadorContratista:{id:trab},
				accidenteClasificacionId: clasificacion  
				};

			callAjaxPost(URL + '/contratista/proyecto/incidente/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							 
							guardarEvidenciaAuto(data.nuevoId,"fileEviIncidente",
									bitsEvidenciaAccidente,
									'/contratista/proyecto/incidente/evidencia/save',
									function(){
								volverDivSubContenido();
								verCompletarIncidenteProyecto();
							})
						 
									break;
						default:
							console.log("Ocurrió un error al guardar la programacion!");
						}
					});
			 
		} else {
			alert("Debe ingresar todos los campos.");
		} 
	
}


function eliminarIncidenteContratista(pindex) {
	 
	var r = confirm("¿Está seguro de eliminar el incidente?");
	if (r == true) {
		var dataParam = {
				id :  objIncidenteColaborador.id,
		};

		callAjaxPost(URL + '/contratista/observacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05": 
						verCompletarIncidenteProyecto();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}    

function editarIncidenteColaborador(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilIncidenteProy");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar observación ");

	objIncidenteColaborador.id=objIncidenteColaborador.accidenteId;
	editarDiv.find("#dateInciProy").val(convertirFechaInput(objIncidenteColaborador.fecha)); 
	editarDiv.find("#selTipoAccidente").val(objIncidenteColaborador.accidenteTipoId);
	verAcuerdoTipoAccidente();
	editarDiv.find("#selSubTipoAccidente").val(objIncidenteColaborador.accidenteSubTipoId); 
	editarDiv.find("#selTrabajadorAccidente").val(objIncidenteColaborador.trabajadorContratista.id); 
	editarDiv.find("#selClasAccidente").val(objIncidenteColaborador.accidenteClasificacionId); 
	editarDiv.find("#inputDescIncProy").val(objIncidenteColaborador.accidenteDescripcion); 
	editarDiv.find("#inputLugarIncProy").val(objIncidenteColaborador.lugar); 
	var options=
	{container:"#eviInciProy",
			functionCall:function(){ },
			descargaUrl: "/contratista/incidente/evidencia?id="+objIncidenteColaborador.id,
			esNuevo:false,
			idAux:"Incidente",
			evidenciaNombre:objIncidenteColaborador.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
}



var funcionalidadesAccionMejoraColaborador=[
                                 {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
                                 	window.open(URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objAccAuditoria.id,'_blank')
                                 	}  },
                                 {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarAccMejoraColaborador()}  } ];
function marcarSubOpcionAccMejoraColaborador(pindex){
	funcionalidadesAccionMejoraColaborador[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".subSubDetalleAccion ul").hide();
}
function toggleMenuOpcionAccMejoraColaborador(obj,pindex){
	objAccAuditoria=detalleAccAuditoriaFull[pindex]; 
	$(obj).parent(".subDetalleAccion").find("ul").toggle();
	$(obj).parent(".subDetalleAccion").siblings().find("ul").hide();
	$(obj).parent(".subSubDetalleAccion").find("ul").toggle();
	$(obj).parent(".subSubDetalleAccion").siblings().find("ul").hide(); 
}
function verCompletarAccioneIncidenteColaborador(pindex){
	pindex=defaultFor(pindex,objAuditoria.index);
	//
	 $(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
	
	 
var audiObj={accionMejoraTipoId : 1,
		accidenteId:listFullIncidentesColaborador[pindex].accidenteId};

banderaEdicionAccAuditoria=false;
objAuditoria={index:pindex};
objAccAuditoria={accidenteId:listFullIncidentesColaborador[pindex].accidenteId};
callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){ 
					$("#tblAccAudi tbody tr").remove();
					detalleAccAuditoriaFull=data.list;
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						val.accidenteId=objAccAuditoria.accidenteId;
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
							.find("#divMovilIncidente"+listFullIncidentesColaborador[pindex].accidenteId+" .subOpcionAccion").show()
							.append("<div class='subDetalleAccion "+claseAux+"' style='border-color:"+val.estadoColor+"'>" +
									"<button class='btn btn-success' onclick='toggleMenuOpcionAccMejora(this,"+index+")'>" +
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

function editarAccMejoraColaborador(){
	$(".divListPrincipal>div").hide(); 
	var formEditar=$("#editarMovilAccProyColab");
	formEditar.show();
	console.log(objAccAuditoria);
	formEditar.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Acción de Mejora")
	formEditar.find("#divDescAccColab").html(objAccAuditoria.descripcion)
	formEditar.find("#divFechaAccColab").html(objAccAuditoria.fechaRevisionTexto)
	formEditar.find("#divObsAccColab").html(objAccAuditoria.observacion)
	formEditar.find("#eviAccionMejora").html(objAccAuditoria.evidenciaNombre);
	formEditar.find("#divFechaRealAccColab").html(objAccAuditoria.fechaRealTexto);
	formEditar.find("#inpuRespAccColaborador").val(objAccAuditoria.respuesta);
	
}
function guardarAccionProyectoColaborador(){ 
	 var accSend={accionMejoraId:objAccAuditoria.accionMejoraId,
			 respuesta:$("#inpuRespAccColaborador").val()}
	 callAjaxPost(URL + '/gestionaccionmejora/accionmejora/respuesta/save', 
			 accSend, function(data){
		 volverDivSubContenido();
		 if(data.CODE_RESPONSE=="05"){
			 if(objAccAuditoria.accidenteId>0){
				 verCompletarAccioneIncidenteColaborador(); 
			 }
			 if(objAccAuditoria.hallazgoId>0){
				 verCompletarAccioneHallazgoColaborador(); 
			 }
			 if(objAccAuditoria.detalleAuditoriaId>0){
				 verCompletarAccioneAuditoriaColaborador(); 
			 }
		 }else{
			 alert("No tiene permiso para acceder");
			  
		 }
		 
	 });
	
}

