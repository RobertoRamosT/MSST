/**
 * 
 */

var objGeneracionResiduo={};
var listFullGeneracionsResiduo;
var listClasificacionGeneracionResiduo;
var listTipoResiduoDetalle;
function toggleMenuOpcionGeneracion(obj,pindex){
	objGeneracionResiduo=listFullGeneracionsResiduo[pindex];
	objGeneracionResiduo.index=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
var funcionalidadesGeneracion=[ 
{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
	window.open(URL+"/residuo/cambio/evidencia?id="+objGeneracionResiduo.id,'_blank')
	}  },
	
	{id:"opcNuevoDetalle",nombre:"Nuevo Detalle",functionClick:function(data){nuevaDetalleGeneracion()} } , 
    {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarGeneracionResiduo()}  },
   {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarGeneracionResiduo()}  
   
    
    }
                           ]
function marcarSubOpcionGeneracion(pindex){
	funcionalidadesGeneracion[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
}
function habilitarGeneracionsResiduo(){
	var dataParam={
			empresaId:getSession("gestopcompanyid")
			};
	objGeneracionResiduo={id:0};
	var listPanelesPrincipal=[];
	
	callAjaxPost(URL + '/residuo/cambios', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			var textIn= "";
			listFullGeneracionsResiduo=data.list;
			$(".divListPrincipal").html("");
			listFullGeneracionsResiduo.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesGeneracion.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionGeneracion("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var estiloGosst="gosst-neutral";
				 
				textIn+=("<div class='eventoGeneral "+estiloGosst+"'>" +
						"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionGeneracion(this,"+index+")'>" +
						"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
						menuOpcion+ 
						"<strong>"+val.fechaTexto+"_"+val.horaTexto+"</strong><br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Clasificación: "+val.clasificacion.nombre+"<br>"+ 
						"<i class='fa fa-info' aria-hidden='true'></i>Responsable: " +val.responsable.nombre+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Evidencia: " +val.evidenciaNombre+"<br>"+

						"<a onclick='verDetallesGeneracionResiduo("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Cantidad de residuos: " +val.indicadorResiduos+"</a><br>"+
						 "</div>"+
						 "<div class='divDetalleGeneracion divRelacionado' id='divResGen"+val.id+"'>" +
						"" +
						"</div>"
						
				
				);
				 
				
			});
			listClasificacionGeneracionResiduo=data.clasificacion;
			var slcClasificacionCambioResiduo=crearSelectOneMenuOblig("slcClasificacionCambioResiduo", "",
					listClasificacionGeneracionResiduo, "", "id", "nombre");
			var listItemsExam=[
				{sugerencia:"",label:"Fecha",inputForm:"<input type='date' class='form-control' id='inputFechaCambioResiduo'>"},
				{sugerencia:"",label:"Hora",inputForm:"<input type='time' class='form-control' id='inputHoraCambioResiduo'>"},
				{sugerencia:"",label:"Responsable",inputForm:"<input class='form-control' id='inputRespCambioResiduo'>"}, 
				{sugerencia:"",label:"Clasificación",inputForm:slcClasificacionCambioResiduo,divContainer:""},
      			 
       			 {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviGeneracionResiduo"},
       			 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
             		];
			var textFormExamen="";
			listItemsExam.forEach(function(val,index){
				textFormExamen+=obtenerSubPanelModulo(val);
			});
			listTipoResiduoDetalle=data.tipo_detalle;
			var slcClasificacionDetalle=crearSelectOneMenuOblig("slcClasificacionDetalle", "", data.clasificacion_detalle, 
					 "", "id","nombre");
			var slcTipoDetalleCambio=crearSelectOneMenuOblig("slcTipoDetalleCambio", "", data.tipo_detalle, 
					 "", "id","nombre");
					   			
			 var listItemsDeta=[
			             		{sugerencia:"",label:"Área",inputForm:  slcClasificacionDetalle,divContainer:""},
			             		{sugerencia:"",label:"Residuo",inputForm:  slcTipoDetalleCambio,divContainer:"divTipoResDetalle"},
			             		{sugerencia:"",label:"Cantidad (kg)",inputForm:"<input type='number'  class='form-control' id='inputCantidadDetalleCambio'>"},
			             		{sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"},
			                    {sugerencia:"",label:"",inputForm:"<button type='button' id='btnGuardarAgregarDetGeneracion' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar y agregar otro</button>"} 
			                         		];
 			   			var textFormDeta="";
 			   		listItemsDeta.forEach(function(val,index){
 			   		textFormDeta+=obtenerSubPanelModulo(val);
 			   			});
			
			
			
			
			listPanelesPrincipal.push(
					{id:"nuevoMovilGeneracion" ,clase:"",
							nombre:""+"Nueva Generacion",
							contenido:"<form id='formNuevoGeneracion' class='eventoGeneral'>"+textFormExamen+"</form>"},
					{id:"editarMovilGeneracion" ,clase:"contenidoFormVisible",
						nombre:""+"Editar Generacion",
						contenido:"<form id='formEditarGeneracion' class='eventoGeneral'>"+textFormExamen+"</form>"},
						{id:"editarMovilDetalleGeneracion" ,clase:"contenidoFormVisible",
							nombre:""+"Editar Detalle",
							contenido:"<form id='formEditarDetalleGeneracion' class='eventoGeneral'>"+textFormDeta+"</form>"},
							
						
					{id:"locatarioResiduo",clase:"divGeneracionResiduoGeneral",
							nombre:"Generación y Segregación de Residuos"+" (" +listFullGeneracionsResiduo.length+")",
							contenido:textIn}    
						
			
			);
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			var options=
			{container:"#eviGeneracionResiduo",
					functionCall:function(){ },
					descargaUrl: "",
					esNuevo:true,
					idAux:"CambioResiduo"+objGeneracionResiduo.id,
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			 $('#formNuevoGeneracion').on('submit', function(e) {  
			        e.preventDefault();
			        objGeneracionResiduo={id:0}
			        guardarGeneracionResiduo();
			 });
			 $('#formEditarGeneracion').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarGeneracionResiduo();
			 });
			 $('#formEditarDetalleGeneracion').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarDetalleGeneracion();
			 });
			 $('#btnGuardarAgregarDetGeneracion').on('click', function(e) {
			        guardarDetalleGeneracion(nuevaDetalleGeneracion);
			 });
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
function editarGeneracionResiduo(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilGeneracion");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Generacion");
	
	editarDiv.find("#inputFechaCambioResiduo").val(convertirFechaInput(objGeneracionResiduo.fecha));
	editarDiv.find("#inputHoraCambioResiduo").val(objGeneracionResiduo.hora);
	editarDiv.find("#slcClasificacionCambioResiduo").val(objGeneracionResiduo.clasificacion.id);
	editarDiv.find("#inputRespCambioResiduo").val(objGeneracionResiduo.responsable.nombre);
	var options=
	{container:"#editarMovilGeneracion #eviGeneracionResiduo",
			functionCall:function(){},
			descargaUrl: "/residuo/cambio/evidencia?id="+ objGeneracionResiduo.id,
			esNuevo:false,
			idAux:"CambioResiduo"+objGeneracionResiduo.id,
			evidenciaNombre:objGeneracionResiduo.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
	
}
function eliminarGeneracionResiduo(){
	var r = confirm("¿Está seguro de eliminar el registro ?");
	if (r == true) {
		var dataParam = {
				id : objGeneracionResiduo.id,
		};
		callAjaxPost(URL + '/residuo/cambio/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarGeneracionsResiduo();
						break;
					default:
						alert("No se puede eliminar, hay alquileres/actividades asociados.");
					}
				});
	}
}
function guardarGeneracionResiduo(){
	var formDiv=$("#editarMovilGeneracion");
	if(objGeneracionResiduo.id==0){
		formDiv=$("#nuevoMovilGeneracion");
	}
	var campoVacio = true;
	var fecha=formDiv.find("#inputFechaCambioResiduo").val();
	var hora=formDiv.find("#inputHoraCambioResiduo").val();
	var clas=formDiv.find("#slcClasificacionCambioResiduo").val();
	var responsable=formDiv.find("#inputRespCambioResiduo").val();
	
	
		if (campoVacio) {

			var dataParam = {
					id : objGeneracionResiduo.id,  
					fecha:convertirFechaTexto(fecha),
					hora:hora,
					clasificacion:{id:clas},
					responsable:{nombre:responsable},
					empresa :{empresaId :getSession("gestopcompanyid")}
			}

			callAjaxPost(URL + '/residuo/cambio/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							
							guardarEvidenciaAuto(data.nuevoId,"fileEviCambioResiduo"+objGeneracionResiduo.id
									,bitsEvidenciaAccionMejora,"/residuo/cambio/evidencia/save",
									function(){
								habilitarGeneracionsResiduo();
							}); 
							break;
						default:
							console.log("Ocurrió un error al guardar   !");
						}
					});
			 
		} else {
			alert("Debe ingresar todos los campos.");
		}
}