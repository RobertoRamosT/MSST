
//Inicio de accion de Evaluacion
var objEvaluacion={};
var listConfirmEvaluacionFull=[];
var banderaEdicionConfirmacion=false;
var objConfirmEvaluacion={}; 

var funcionalidadesExtForm=[
                           /* {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
                            	window.open(URL+"/capacitacion/curso/evaluacion/confirmacion/evidencia?id="+objConfirmEvaluacion.id,'_blank')
                            	}  },
                            */{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:function(data){editarConfirmacion()}  },
                            {id:"opcElimnar",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:function(data){eliminarConfirmacion()}  }];
function volverDivFormaciones(){
	$("#tabProyectos .container-fluid").hide();
	$("#divCompletarCursoProyecto").show();
	$("#tabProyectos h4")
	.html("<a onclick='volverDivProyectos()'>Proyecto ("
			+listFullProyectoSeguridad[indexPostulante].titulo+") </a> > Formaciones asignadas");
	verCompletarCursoProyecto();
}
function toggleMenuOpcionExtForm(obj,pindex){
	objConfirmEvaluacion=listConfirmEvaluacionFull[pindex]; 
	$(obj).parent(".subDetalleAccion").find("ul").toggle();
	$(obj).parent(".subDetalleAccion").siblings().find("ul").hide(); 	
}
function marcarSubOpcionFormacion(pindex){
	funcionalidadesExtForm[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
}
function verConfirmacionesEvaluacion(pindex){
	 pindex=defaultFor(pindex,objEvaluacion.index);
	 //
	 objEvaluacion={index:pindex};
	 $(".detalleDocumentosProyecto").html("");
	
	 $(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
	//
		 
	var audiObj={ 
			id:listCursosProyectos[pindex].id};
	banderaEdicionConfirmacion=false; 
	objConfirmEvaluacion={evaluacionId:listCursosProyectos[pindex].id};
	callAjaxPost(URL + '/capacitacion/curso/evaluacion/confirmaciones', 
				audiObj, function(data){
					if(data.CODE_RESPONSE=="05"){
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesExtForm.forEach(function(val,index){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionFormacion("+index+")'>"+val.nombre+" </li>"
						});
						menuOpcion+="</ul>"
						listConfirmEvaluacionFull=data.list;
						$("#divMovilFormacion"+objConfirmEvaluacion.evaluacionId+" .opcionesAccion .linkVerFormacion").html(
								"Ver extensión ("+listConfirmEvaluacionFull.length+")")
						listConfirmEvaluacionFull.forEach(function(val,index){
							  //
							 $("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
								.find("#divMovilFormacion"+listCursosProyectos[pindex].id+" .subOpcionAccion").show()
								.append("<div class='subDetalleAccion'>" +
										"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionExtForm(this,"+index+")'>" +
										"Ver Opciones <i class='fa fa fa-angle-double-down' aria-hidden='true'></i></a>" +
										menuOpcion+
										"<strong>EXTENSIÓN "+(index+1)+"</strong><br>"+
										"<i class='fa fa-clock-o' aria-hidden='true'></i>Fecha Planificada:  " +val.fechaPlanificadaTexto+"<br>"+ 
										"<i class='fa fa-calendar' aria-hidden='true'></i>Fecha Subida:  " +val.fechaRealTexto+ "<br>"+
										"<i class='fa fa-search' aria-hidden='true'></i> Observación: " +val.observacion+ "<br>"+
										"<i class='fa fa-download' aria-hidden='true'></i> Evidencia: " +
										(val.evidenciaNombre==""?"Sin Registrar":
											"<a class='efectoLink' href='"+URL+"/capacitacion/curso/evaluacion/confirmacion/evidencia?id="+val.id+"'>" +
												val.evidenciaNombre+	
											"</a>")+
										"</div> " );
							 //
						});
						$(".subDetalleAccion ul").hide();
						formatoCeldaSombreableTabla(true,"tblConfirmacion");
					}else{
						console.log("NOPNPO")
					}
				});
 }


function nuevaAccionEvaluacion(formacionIndex){
	if (!banderaEdicionConfirmacion) {
		objEvaluacion={index:formacionIndex};
		objConfirmEvaluacion={evaluacionId:listCursosProyectos[formacionIndex].id};
		$(".divListPrincipal>div").hide();
		$("#editarMovilFormProy").show();
		$("#editarMovilFormProy").find("form input").val("");
		$("#editarMovilFormProy").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nueva extensión de formación de '"
				+listFullProyectoSeguridad[indexPostulante].titulo+"' ");
		var options=
		{container:"#eviDocumentoFormacion",
				functionCall:function(){ },
				descargaUrl:"",
				esNuevo:true,
				idAux:"FormacionProy",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);
		
		
		
		objConfirmEvaluacion.id = 0;
		banderaEdicionConfirmacion = false; 
	} else {
		alert("Guarde primero.");
	}
}
function editarConfirmacion(){
	if(!banderaEdicionConfirmacion){
		$("#editarMovilFormProy").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Editar extensión de formación de '"
				+listFullProyectoSeguridad[indexPostulante].titulo+"' ");
		$(".divListPrincipal>div").hide();
		$("#editarMovilFormProy").show();
		 $("#inputFecConf").val(convertirFechaInput(objConfirmEvaluacion.fechaPlanificada));
		 $("#inputObsConf").val(objConfirmEvaluacion.observacion);
		  
		 var eviNombre=objConfirmEvaluacion.evidenciaNombre;
	var options=
	{container:"#eviDocumentoFormacion",
			functionCall:function(){ },
			descargaUrl:"/capacitacion/curso/evaluacion/confirmacion/evidencia?id="+objConfirmEvaluacion.id,
			esNuevo:false,
			idAux:"FormacionProy",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);

	
		banderaEdicionConfirmacion = false;
	}
}
function guardarConfirmacion(functionCallBack){

	var campoVacio = false; 

	var inputFecha =convertirFechaTexto( $("#inputFecConf").val()); 
	 var observacion=$("#inputObsConf").val();
	if (!campoVacio) {

		var dataParam = {
				id:objConfirmEvaluacion.id,
			fechaPlanificada : inputFecha,
			fechaReal:null, observacion:observacion,
			estado : objConfirmEvaluacion.estado,
			evaluacionId:objConfirmEvaluacion.evaluacionId
		};
		 
		callAjaxPost(URL + "/capacitacion/curso/evaluacion/confirmacion/save", dataParam,
				function(data){
	guardarEvidenciaAuto(data.nuevoId,"fileEviFormacionProy"
		,bitsEvidenciaAccionMejora,"/capacitacion/curso/evaluacion/confirmacion/evidencia/save",
		function(){
		if(functionCallBack!=null){
			functionCallBack()
		}else{
			volverDivSubContenido();
			verConfirmacionesEvaluacion();
		}
		
	} ); 
				
			
		},null,null,null,null,false);
	} else {
		alert("Debe ingresar todos los campos.");
	}
	
}
function eliminarConfirmacion(pindex) {
	var r = confirm("¿Está seguro de eliminar la extensión?");
	if (r == true) {
		var dataParam = {
				id : objConfirmEvaluacion.id 
		};

		callAjaxPost(URL + '/capacitacion/curso/evaluacion/confirmacion/delete',
				dataParam, function(){
			volverDivSubContenido();
			verConfirmacionesEvaluacion();
		});
	}
}
function hallarEstadoImplementacionConfirmacion(){
	var fechaPlanificada=$("#inputFecConf").val();
	var fechaReal=convertirFechaInput(objConfirmEvaluacion.fechaReal);
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		objConfirmEvaluacion.estado={id:2,nombre:"Completado"} 
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				objConfirmEvaluacion.estado={id:3,nombre:"Retrasado"}
			}else{
				objConfirmEvaluacion.estado={id:1,nombre:"En proceso"} 
			}
			
		}else{
			
			objConfirmEvaluacion.estado={id:1,nombre:"En proceso"} 
			
		}
	}
	
	$("#confest"+objConfirmEvaluacion.id).html(objConfirmEvaluacion.estado.nombre);
}










