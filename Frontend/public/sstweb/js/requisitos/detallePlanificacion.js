var listFullPlanificacion,listNormasTotales,listPuntajes,listTipoPerdida;
var listTipoSolicitudReqLegal=[];
var planificacionId, planificacionObj;
var banderaEdicion = false; 
var indexTit;  
var filtroEval=0; 
var objtemp=[];
var indexTemp;

$(function() {
	$("#btnCancelarNormaLegalEmpresa").attr("onclick","javascript: cancelarNuevoNormaEmpresa();"); 
	insertMenu(cargarNormaLegalEmpresa);
	$("#mdVerif").load("agregaraccionmejora.html");
	
	$('#mdVerif').on('hidden.bs.modal', function(e) {
		cargarDetallePlanificacion();
	});
})

function verPlanificacion(){
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#tabNormaLegalEmpresa #divContainNormaLegalRevision").hide(); 
	$("#tabNormaLegalEmpresa #divContainDetallePlanificacion").show();
	$("#tabNormaLegalEmpresa").find("h2")
	.html("<a onclick=' volverNormaRevision()'>Programacion de Revisión></a>Detalle de Evaluacion: "); 
	cargarDetallePlanificacion();
} 

var indexFunction=0;

function toggleMenuOpcion(obj,pindex,menu){
	indexFunction=pindex;
	$(obj).parent("#container"+menu+pindex).find("ul").toggle();
	$(obj).parent("#container"+menu+index).siblings().find("ul").hide();
	switch (menu) {
	case "Evaluacion": 
		$("#containerAccionMejora"+pindex+" .listaGestionGosst").hide();  
		break;
	case "AccionMejora":
		$("#containerEvaluacion"+pindex+" .listaGestionGosst").hide(); 
		break;	
	default:
		break;
	}
}

var funcionalidadesMenu=[
	{menu:"Evaluacion", opcion:
		[
			{id:"opcEvaluarEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Evaluar/Editar",
				functionClick:function(data){ 
					evaluarRevision(indexFunction);    
				;}
			}
			,
			{id:"opcVerAccMejora",nombre:"<i class='fa fa-check-square-o'></i> Asignar/Editar Acción de Mejora",
				functionClick:function(data){solicAccionMejor(indexFunction);}
			},
			{id:"opcRequInform",nombre:"<i class='fa fa-info'></i> Aplicar como requ. Informativo",
				functionClick:function(data){selecInform(indexFunction,1);}
			},
			{id:"opcRequiNoAplicar",nombre:"<i class='fa fa-ban'></i> No Aplicar",
				functionClick:function(data){noAplicarUno(indexFunction,1);}
			}
		]
	},
	{menu:"NoAplica", opcion:
		[
			{id:"opcNoAplica",nombre:"<i class='fa fa-ban' style='color:red;'></i> No Aplica",
				functionClick:function(data){
					alert("No se Aplica a este Articulo");
					$("#containerEvaluacion"+indexFunction+" .listaGestionGosst").hide(); 
				}
			},
			{id:"opcRequiNoAplicar",nombre:"<i class='fa fa-check'></i> Aplicar Requsito",
				functionClick:function(data){noAplicarUno(indexFunction,0);}
			}
		]
	},
	{menu:"AgregarSolicitud", opcion:
		[
			{id:"opcEvaluarEditar",nombre:"<i class='fa fa-plus'></i> Agregar Solicitud",
				functionClick:function(data){ 
					agregarSolicitudRevision(indexFunction);    
				;}
			} 
		]
	},
	{menu:"AgregarAccionSolicitud", opcion:
		[
			{id:"opcEvaluarEditar",nombre:"<i class='fa fa-plus'></i> Agregar Corrección/Acciones",
				functionClick:function(data){ 
					evaluarRevision(indexFunction);    
				;}
			} 
		]
	},
	{menu:"VolverNoInformativo", opcion:
		[
			{id:"opcRequInform",nombre:"<i class='fa fa-info'></i> Volver Requisito No Informativo",
				functionClick:function(data){selecInform(indexFunction,0);}
			}
		]
	}
];

function marcarSubOpcionMenu(pindex,pindex1,menu){ 
	$("#container"+menu+indexFunction+" .listaGestionGosst").hide(); 
	funcionalidadesMenu[pindex].opcion[pindex1].functionClick();
}

var menuOpcionDetall=[];

function ListarOpcionesDetalle(idpindex){
	funcionalidadesMenu.forEach(function(val1,index1){
		var menu=val1.menu;
		var opciones=val1.opcion;
		menuOpcionDetall[index1]="<ul class='listaGestionGosst list-group ' style='display:none;'>";
		opciones.forEach(function(val2,index2){
			menuOpcionDetall[index1]+="<li id='"+val2.id+menu+idpindex+"'style='width:185px; top:-18px;'class='list-group-item' onclick='marcarSubOpcionMenu("+index1+","+index2+",\""+menu+"\")'>"+val2.nombre+"</li>";
		});
		menuOpcionDetall[index1]+="</ul>";
	}); 
}

function cargarDetallePlanificacion() {  
	var  empresa=getSession("gestopcompanyid"); 
	callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion',
		{
			revision:{id:revisionId},
			articulo:{normalegal: {id:revisionObj.norma.id}},
			filtro:{id:filtroEval}
		},
		function(data)
		{
			if (data.CODE_RESPONSE = "05"){ 
				banderaEdicion = false;
				listFullPlanificacion = data.list;  
				listNormasTotales=data.norma;
				listPuntajes=data.puntaje;
				listTipoPerdida=data.perdida;
				listTipoSolicitudReqLegal=data.tipo_solicitud;
				listArticulosTitulos=data.titulos;
				listFiltroEval=data.filtros;
				procesarDetallePlanificacion();
			} else{
				console.log("ERROR, no entro al IF :''v");
			}	
				
			});  
} 

function procesarDetallePlanificacion(data){ 
		var listArticulosTitulosSelect=[];
		listArticulosTitulos.forEach(function(val1,index1)
		{
			listArticulosTitulosSelect.push({id:index1,tituloImprimir:val1.tituloImprimir});
		});
		var selArticulosTotales=crearSelectOneMenuOblig("inputTituloArticulo","filtroTitulo()",listArticulosTitulosSelect,"","id","tituloImprimir");
		var selFiltroEvaluacion=crearSelectOneMenuOblig("inputFiltroEval","filtroEvaluacion()",listFiltroEval,"","id","nombre");
		$("#tblDetallePlanificacion tbody tr").remove(); 
		$("#tblDetallePlanificacion tbody").append(
				"<tr id='trencabezado' >"
					+"<td>"+
						"<div class='row'>" +
							"<section class='col col-xs-7'>" +
								"<label style='float:left;'>"+normaLegalEmpresaObj.codigo+"</label>"+
							"</section>"+
							"<section class='col col-xs-2'>" +
								"<div class='row'>" +
									"<section class='col col-xs-6'>" +
										"Filtro por título"+
									"</section>"+
									"<section class='col col-xs-6'>" +
										selArticulosTotales+
									"</section>"+ 
								"</div>"+
							"</section>"+
							"<section class='col col-xs-3'>" +
								"<div class='row'>" +
									"<section class='col col-xs-6'>" +
										"Filtro por Evaluacion"+
									"</section>"+
									"<section class='col col-xs-6'>" +
										selFiltroEvaluacion+
									"</section>"+ 
								"</div>"+
							"</section>"+
						"</div>"+
						"<div class='row' style='border-top: 2px dotted #2e9e8f;margin-top:10px;'>" 
							 +"<br>"+//normaLegalEmpresaObj.titulo+
						"</div>"
					+"</td>"   
				+"</tr>" 
		); 
		var textArticulos="<div class='container' id='articulos'>"; 
		listArticulosTitulos.forEach(function(val1,index1)
		{
			textArticulos+=
				"<div class='eventoGeneral resaltar row col-xs-10' onclick='toggleTituloDiv("+index1+")'>"
					+val1.titulo+" <label style='color:#0EA54C'>("+val1.normalegal.numArtEval+" / "+val1.normalegal.numArtTotal+")</label>"+
				"</div>"+
				"<div class='col col-xs-1'>" +
					"<input type='checkbox' id='NoAplica"+index1+"'   onclick='seleccionarTodoCheck("+index1+",1)' class='form-control'" +(val1.numNoAplica==val1.normalegal.numArticulos?"checked":"")+">No Aplica" +
				"</div>"+
				"<div class='col col-xs-1'>" +
					"<input type='checkbox' id='Informativo"+index1+"'   onclick='seleccionarTodoCheck("+index1+",2)' class='form-control'" +(val1.numInformativo==val1.normalegal.numArticulos?"checked":"")+">Informativo" +
				"</div><br>"+
				"<div class='row' id='titulo"+index1+"' "+(filtroEval==0 || filtroEval==1?"style='display:none;'":"")+">";
			listFullPlanificacion.forEach(function(val,index){ 
				var listFullDescripcion=(val.articuloCambio.articulodermod.descripcion).split("\n");
				var texto="";
				listFullDescripcion.forEach(function(val)
				{
					texto+="<p>"+val+"</p>";
				});
				var listFullMensaje=(val.articuloCambio.mensaje).split("\n");
				var mensaje="";
				listFullMensaje.forEach(function(val)
				{
					mensaje+="<p>"+val+"</p>";
				});
				if(val1.titulo==val.articuloCambio.articulodermod.titulo)
				{
					ListarOpcionesDetalle(index);
					textArticulos+=	
						"<div id='containerArticulo"+val.articuloCambio.articulodermod.id+"' class='row' style='text-align:justify;padding-top:40px;'>" +
							"<section class='col col-xs-12'>"+
						(val.articuloCambio.tipocambio.id==1?
								"<div class='container notificacion' style='width:85%;'>"+
									"<section class='col col-xs-12'>" +
										"<strong style='color: #FF8700;'>"+val.articuloCambio.tipocambio.nombre+ "</strong>"+
										" Este articulo fue modificado por la "+val.articuloCambio.articulo.normalegal.codigo+" - "+val.articuloCambio.articulo.descripcion+
										//" <a class='efectoLink' href='"+URL+"/requisitos/norma/articulo/evidencia?id="+val.articuloCambio.articulo.id+"'>"+val.articuloCambio.articulo.evidenciaNombre+"</a>"+
									"</section>"+ 
								"</div>"
								:
								(val.articuloCambio.tipocambio.id==2?
									"<div class='container notificacion' style='width:85%;'>"+
										"<section class='col col-xs-12'>" +
											"<strong style='color: #FF8700;'>Derogado "+val.articuloCambio.tipoderogar.nombre +"</strong>"+
											". Este articulo se deroga por la "+val.articuloCambio.articulo.normalegal.codigo+"  - "+val.articuloCambio.articulo.descripcion+
											//" <a class='efectoLink' href='"+URL+"/requisitos/norma/articulo/evidencia?id="+val.articuloCambio.articulo.id+"'>"+val.articuloCambio.articulo.evidenciaNombre+"</a>"+
										"</section>"+ 
									"</div>"
									:
									"")
							)+  
							"<br></section>"+
							"<br><div id='original"+index+"' "+(val.articuloCambio.tipocambio.id==null?"":"style='display:none;'")+">" +
								"<div class='row'>" +
								(val.articuloCambio.articulodermod.comentario == ""? "":
								"<section class='col col-xs-11' style='text-align: justify;"+ (val.noAplica!=0?"background-color: #c6c6c6;":"")+"'>" +
								"<strong>Comentario:  </strong>"+val.articuloCambio.articulodermod.comentario+
								"</section>")+
									"<section class='col col-xs-11' style='text-align: justify;"+ (val.noAplica!=0?"background-color: #c6c6c6;":"")+"'>" +
										texto+
									"</section>"+
								"</div>"+
							"</div>"+ 
							//Si el id es null es porque no ha sido derogado o modificado por lo tanto no habra lista de versiones
							(val.articuloCambio.tipocambio.id==null?""
								: 
								"<div id='actual"+index+"' >" +
									
									"<div class='row'>" +
										"<section class='col col-xs-11'>" +
											mensaje+
										"</section>"+
									"</div>"+
								"</div>"+
								"<div class='row' style='border-top: 2px dotted #2e9e8f;margin-top:10px;'>" +
								"</div>"+
								"<div class='row'>" +
									"<section class='col col-xs-8'>" +
										"<label class='radio-inline'>" + 
											"<input type='radio' name='fecha"+index+"' id='actualVersion' value='1' onchange='verDescripcionArticulo("+index+")' checked> Ver útlima actualización publicada el: "+val.articuloCambio.articulo.fechaRegistroTexto+"<br>"+
											"<input type='radio' name='fecha"+index+"' id='original' value='2' onchange='verDescripcionArticulo("+index+")'> Ver requisito original publicado el: "+val.articuloCambio.articulodermod.fechaRegistroTexto+
										"</label>"+
									"</section>"+
								"</div>"
							)+ 
							//Si es informativo, no se evalua.
							(val.articuloCambio.articulodermod.tipoArticulo.idTipo==2 || val.inform==1?
								(val.inform==1?
									"<div class='row'>" + 
										"<section class='col col-xs-3'>" +
											 
										"</section>"+  
										"<section class='col col-xs-9' id='containerEvaluacion"+index+"'>" +
											"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+index+",\"Evaluacion\"); indexTitulo("+index1+");'>Ver Opciones <i class='fa fa-angle-double-down'></i></a>"+
												menuOpcionDetall[4]+
										"</section>"+
									"</div>":""
								)+""	:
							"<div class='row'>" + 
								"<section class='col col-xs-3'>" +
									"<a class='efectoLink' onclick='toggleDivEvaluacion("+index+")'><i class='fa fa-commenting-o'></i> Evaluación <i class='fa fa-angle-double-down'></i> </a>"+
								(val.id==null || val.puntaje_id?"<label style='color:#F33333'>(Pendiente)</label>":"")+
								"</section>"+  
								"<section class='col col-xs-9' id='containerEvaluacion"+index+"'>" +
									"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+index+",\"Evaluacion\"); indexTitulo("+index1+");'>Ver Opciones <i class='fa fa-angle-double-down'></i></a>"+
									(val1.numNoAplica!=0 && val.noAplica==1?menuOpcionDetall[1]:menuOpcionDetall[0])+
								"</section>"+
							"</div>"+
							"<div class='row' id='divEvaluacion"+index+"' style='display:none;'>" + 
								"<div class='row' style='border-top: 2px dotted #2e9e8f;margin-top:10px;margin-left: 0px;margin-right:0px;'>" +
								"</div>"+
								"<section class='col col-xs-11' style='padding-left: 35px;'>" + 
								"<div class='row'>" + 
								"<section class='col col-xs-3'>" +
									"<i class='fa fa-check-circle-o'></i> Nivel de impacto en la empresa: <br>"+ 
								"</section>"+
								"<section class='col col-xs-5'>" +
									val.perdida.nombre+" <br>"+
								"</section>"+ 
							"</div>"+	
								"<div class='row'>" + 
										"<section class='col col-xs-3'>" +
											"<i class='fa fa-check-circle-o'></i> Evaluación: <br>"+ 
										"</section>"+
										"<section class='col col-xs-5'>" +
											val.puntaje.nombre+" <br>"+
										"</section>"+ 
									"</div>"+
									"<div class='row'>" + 
										"<section class='col col-xs-3'>" +
											"<i class='fa fa-align-justify'></i> Comentario: <br>"+
										"</section>"+
										"<section class='col col-xs-5'>" +
											val.observaciones+" <br>"+
										"</section>"+ 
									"</div>"+
									"<div class='row'>" + 
										"<section class='col col-xs-3'>" +
											"<i class='fa fa-download'></i> Evidencia: <br>"+
										"</section>"+
										"<section class='col col-xs-5'>" +
											"<a class='efectoLink' href='"+URL+"/requisitos/norma/empresa/revision/evaluacion/evidencia?id="+val.id+"'>" +
												val.evidenciaNombre+
											"</a>"+
										"</section>"+ 
									"</div>"+ 
								"</section>"+
							"</div>"+
							"<div class='row'>" + 
								"<section class='col col-xs-3'>" +
									"<a class='efectoLink' onclick='toggleDivAccionMejora("+index+")'><i class='fa fa-check-square-o'></i> Solicitud de mejora asociada <i class='fa fa-angle-double-down'></i> </a>"+
								"</section>"+
								//En caso pidan
								//"<section class='col col-xs-9' id='containerAccionMejora"+index+"'>" +
								//"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+index+",\"AccionMejora\"); indexTitulo("+index1+");'>Ver Opciones <i class='fa fa-angle-double-down'></i></a>"+
								//(val.gestion.id==null?menuOpcionDetall[2]:menuOpcionDetall[3])+
								//"</section>"+
								//
							"</div>"+   
							"<div class='row' id='divAccionMejora"+index+"' style='display:none'>" +
								"<div class='row' style='border-top: 2px dotted #2e9e8f;margin-top:10px;margin-left: 0px;margin-right:0px;'>" +
								"</div>"+
								(val.gestion.id==null?"Sin asignar":
								"<section class='col col-xs-3' style='padding-left: 35px;'>" +
									"<i class='fa fa-check'></i> Descripción: <br>"+
									"<i class='fa fa-align-justify'></i> Tipo de solicitud: <br>"+
									"<i class='fa fa-align-justify'></i> Responsable: <br>"+
									"<i class='fa fa-check-square-o'></i> Estado: "+
								"</section>"+
								"<section class='col col-xs-5'>" +
								
									val.gestion.resumen+" <br>"+
									val.gestion.solicitud.nombre+" <br>"+
									val.gestion.responsable+"<br>"+
									val.gestion.estadoCumplimientoNombre+"")+
								"</section>"+
							"</div>")+ 
							"<div class='row' style='border-top: 2px solid #2e9e8f;margin-top:10px;'>" +
							"</div>"+
						"</div>";
				}
			});
			textArticulos+="</div><br>";
		});
		$("#trencabezado td").append(textArticulos);
		$(".listaGestionGosst").hide(); 
		$("#titulo"+indexTit).show();
		$("#actualVersion").prop('checked', true);   
}

function verDescripcionArticulo(pindex){
	var radio=$("input:radio[name=fecha"+pindex+"]:checked").val();
	if(radio==1)//actual
	{
		$("#original"+pindex).hide();
		$("#actual"+pindex).show();
	}
	else if(radio==2)//original
	{
		$("#original"+pindex).show();
		$("#actual"+pindex).hide();
	}
}

function toggleDivEvaluacion(pindex){
	$("#divEvaluacion"+pindex).toggle(); 
} 

function toggleTituloDiv(pindex){
	$("#titulo"+pindex).toggle();  
} 

function toggleDivAccionMejora(pindex){
	$("#divAccionMejora"+pindex).toggle();
}

function filtroTitulo(){
	var filtro=$("#inputTituloArticulo").val();
	listArticulosTitulos.forEach(function(val,index)
	{
		if(filtro==index)
		{
			$("#titulo"+index).show();
		}
		else
		{
			$("#titulo"+index).hide();
		}
	});

}

function evaluarRevision(pindex){
	planificacionId=listFullPlanificacion[pindex].id;
	planificacionObj=listFullPlanificacion[pindex];
	indexTemp=pindex; 
	$("#modalEvaluacion").modal("hide");
	$("#modalEvaluacion").modal("show");  
	
	var inicializarPerdida={
			id: 0,
			nombre: "Por Evaluar",
			nombreAux: null,
			observaciones: null
	}
	
	var inicializarPuntaje= {
			id: 0,
			nombre: "Por Evaluar",
			nombreAux: null
	}
	
	listTipoPerdida.push(inicializarPerdida);
	listPuntajes.push(inicializarPuntaje);
	
	if(planificacionId==null){
		planificacionId=0;
		var selPuntaje=crearSelectOneMenuOblig("inputEvalPuntaje","",listPuntajes,0,"id","nombre")
		var selTipoPerdida=crearSelectOneMenuOblig("selTipoPerdida","",listTipoPerdida,0,"id","nombre")
		$(".modal-header").find("h4").html("Nueva Evaluación");
		$("#modalEvaluacion .modal-body").html(
				"<div class='row'>" +
				"<section class='col col-xs-4'>" +
					"<i class='fa fa-check-circle-o'></i> Nivel de impacto en la empresa:"+ 
				"</section>" +
				"<section class='col col-xs-4'>" +
				selTipoPerdida+
				"</section>" +
			"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
						"<i class='fa fa-check-circle-o'></i> Evaluación:"+ 
					"</section>" +
					"<section class='col col-xs-4'>" +
						selPuntaje+
					"</section>" +
				"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
						"<i class='fa fa-align-justify'></i> Comentario:"+
					"</section>" +
					"<section class='col col-xs-6'>" +
						"<textarea class='form-control' id='inputEvalObs'></textarea>"+
					"</section>" +
				"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
					"<i class='fa fa-download'></i> Evidencia: <br><br>"+
					"</section>" +
					"<section class='col col-xs-6' id='inputEvalEvi'>" + 
					"</section>" +
				"</div>"
		); 
		var options={
				container:"#inputEvalEvi",
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Evaluacion",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options);
		
	}else{
		var selPuntaje=crearSelectOneMenuOblig("inputEvalPuntaje","",listPuntajes,planificacionObj.puntaje.id,"id","nombre")
		var selTipoPerdida=crearSelectOneMenuOblig("selTipoPerdida","",listTipoPerdida,planificacionObj.perdida.id,"id","nombre")
		$(".modal-header").find("h4").html("Editar Evaluación");
		$("#modalEvaluacion .modal-body").html(
				"<div class='row'>" +
				"<section class='col col-xs-4'>" +
					"<i class='fa fa-check-circle-o'></i> Nivel de impacto en la empresa:"+ 
				"</section>" +
				"<section class='col col-xs-4'>" +
					selTipoPerdida+
				"</section>" +
			"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
						"<i class='fa fa-check-circle-o'></i> Evaluación:"+ 
					"</section>" +
					"<section class='col col-xs-4'>" +
						selPuntaje+
					"</section>" +
				"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
						"<i class='fa fa-align-justify'></i> Comentario:"+
					"</section>" +
					"<section class='col col-xs-6'>" +
					"<textarea class='form-control' id='inputEvalObs'>"+planificacionObj.observaciones +"</textarea>"+
					"</section>" +
				"</div><br>"+
				"<div class='row'>" +
					"<section class='col col-xs-4'>" +
					"<i class='fa fa-download'></i> Evidencia: <br><br>"+
					"</section>" +
					"<section class='col col-xs-6' id='inputEvalEvi'>" + 
					"</section>" +
				"</div>"
		);
		 
		var options={
				container:"#inputEvalEvi",
				functionCall: function(){},
				descargaUrl:"/requisitos/norma/empresa/revision/evaluacion/evidencia?id="+planificacionId,
				esNuevo:false,
				idAux:"Evaluacion",
				evidenciaNombre:planificacionObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		
	}
	  //desde 0 creas el modal . hmmmm
	$("#modalEvaluacion .modal-footer").html(
			 "<button type='button' class='btn btn-success'  onclick='guardarEvaluacion()'><i class='fa fa-save'></i>Guardar</button>"+
			 "<button type='button' class='btn btn-default'	data-dismiss='modal'>Cerrar</button>"
	);
} 
function agregarSolicitudRevision(pindex){
	planificacionId=listFullPlanificacion[pindex].id;
	planificacionObj=listFullPlanificacion[pindex]; 
	$("#modalEvaluacion").modal("hide");
	$("#modalEvaluacion").modal("show");
	var selTipoSolicitudAux = crearSelectOneMenuOblig("selTipoSolicitudAux", "", 
			listTipoSolicitudReqLegal, "1", "id", "nombre","");
	$(".modal-header").find("h4").html("Solicitud Acción de mejora");
	$("#modalEvaluacion .modal-body").html(
			"<div class='row'>" +
			"<section class='col col-xs-4'>" +
				"<i class='fa fa-check-circle-o'></i> Nivel de impacto en la empresa:"+ 
			"</section>" +
			"<section class='col col-xs-4'>" +
			"<textarea class='form-control' id='descSolicitudAgregar'></textarea> "+
			"</section>" +
		"</div><br>"+
			"<div class='row'>" +
				"<section class='col col-xs-4'>" +
					"<i class='fa fa-check-circle-o'></i> Evaluación:"+ 
				"</section>" +
				"<section class='col col-xs-4'>" +
				selTipoSolicitudAux+
				"</section>" +
			"</div><br>"+
			 
			"<div class='row'>" +
				"<section class='col col-xs-4'>" +
				"<i class='fa fa-download'></i> Evidencia: <br><br>"+
				"</section>" +
				"<section class='col col-xs-6' id='divSelTrabajadorSolicitud'>" + 
				"</section>" +
			"</div>"
	);
	
	if(planificacionId==null){
		planificacionId=0;
		
	} 
	  //desde 0 creas el modal . hmmmm
	$("#modalEvaluacion .modal-footer").html(
			 "<button type='button' class='btn btn-success'  onclick='guardarSolicitudEvaluacion()' data-dismiss='modal'><i class='fa fa-save'></i>Guardar y agregar <br> Corrección inmediata</button>"+
			  "<button type='button' class='btn btn-success'  onclick='guardarSolicitudEvaluacion()' data-dismiss='modal'><i class='fa fa-save'></i>Guardar y cerrar</button>"+
			 "<button type='button' class='btn btn-default'	data-dismiss='modal'>Cerrar</button>"
	);
}
function guardarEvaluacion(){ 
	objtemp=[];
	var puntaje = $("#inputEvalPuntaje").val()
	var articuloId=planificacionObj.articuloCambio.articulodermod.id;
	var revisionprogramId=revisionId;
	var observaciones=$("#inputEvalObs").val();  
	var perdida = $("#selTipoPerdida").val()
	var fechaHoy=convertirFechaTexto(obtenerFechaActual());  
	var evidenciaNombre=$("#inputEviEvaluacion").val()
	if(puntaje==0)
	{
		alert("Evaluacion obligatoria !");
		return;
	}
	if(perdida==0)
	{
		alert("Nivel de Impacto obligatorio !");
		return;
	}
	var dataParam=
	{
			id:planificacionId,
			puntaje:{id:puntaje},
			perdida:{id:perdida},
			articulo:{id:articuloId}, 
			revision:{id:revisionprogramId},
			fechaRegistro:fechaHoy,
			observaciones:observaciones,
			noAplica:0,
			inform:0
	}
	var nombrePuntaje="";
	var nombrePerdida="";
	if(puntaje==1)
	{
		nombrePuntaje="Si Cumple";
	}
	else if(puntaje==2)
	{
		nombrePuntaje="Cumple Parcialmente";
	}else if(puntaje==3)
	{
		nombrePuntaje="No Cumple";
	}
	
	if(perdida==2)
	{
		nombrePerdida="Alto";
	}
	else if(perdida==3)
	{
		nombrePerdida="Medio";
	}else if(perdida==4)
	{
		nombrePerdida="Bajo";
	}
	objtemp=
	{
			id:planificacionId,
			puntaje:{id:puntaje,nombre:nombrePuntaje},
			perdida:{id:perdida,nombre:nombrePerdida},
			articulo:{id:articuloId}, 
			revision:{id:revisionprogramId},
			fechaRegistro:fechaHoy,
			observaciones:observaciones,
			noAplica:0,
			inform:0,
			evidenciaNombre:evidenciaNombre
	}
	callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion/save', dataParam, 
			function(data)
			{
				procesarResultadoGuardarEvaluacion(data);
				procesarGuardarEvidenciaEvaluacion(data);
				$("#modalEvaluacion").modal("hide");
			});	  
}


function procesarGuardarEvidenciaEvaluacion(data)
{
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviEvaluacion",
				bitsEvidenciaNormaLegal,"/requisitos/norma/empresa/revision/evaluacion/evidencia/save",
				function(){},"id"); 
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
function procesarResultadoGuardarEvaluacion(data1)
{
	switch (data1.CODE_RESPONSE) {
	case "05":
		if(planificacionId==0)
		{
			planificacionId=data1.nuevoId;
			callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion/id', 
					{
						id:planificacionId,
						revision:{id:revisionId},
						articulo:{normalegal: {id:revisionObj.norma.id}},
						filtro:{id:filtroEval}
					},
					function (data)
					{
						var evaluacionPlanObj; 
						evaluacionPlanObj=data.listById;
						evaluacionPlanObj.forEach(function(val,index)
						{ 
							listFullPlanificacion[indexTemp]=val;
							listFullPlanificacion[indexTemp].evidenciaNombre=objtemp.evidenciaNombre; 
						}); 
						procesarDetallePlanificacion();
					});	 
					$.unblockUI();
		}
		else 
		{
			listFullPlanificacion.forEach(function(val,index)
			{
				if(val.id==planificacionId)
				{ 
					val.puntaje=objtemp.puntaje;
					val.perdida=objtemp.perdida;
					val.articulo=objtemp.articulo;
					val.revision=objtemp.revision;
					val.fechaRegistro=objtemp.fechaRegistro; 
					val.observaciones=objtemp.observaciones;
					val.noAplica=objtemp.noAplica;
					val.inform=objtemp.inform;
					val.evidenciaNombre=objtemp.evidenciaNombre; 
				}
			});
			procesarDetallePlanificacion();
		}
		break;

	default:
		break;
	}
}
function seleccionarTodoCheck(pindex,opc){ 
	objArtTituloSeccion=listArticulosTitulos[pindex];
	var puntaje=null;
	var articuloId;
	var revisionprogramId=revisionId;
	var observaciones=null;  
	var noAplicar;
	var informat;
	
	if(opc==1){
		var noAplicar=$("#NoAplica"+pindex).prop("checked");
		
		if(noAplicar==true){
			noAplicar=1; 
		}else{
			noAplicar=0;
		}  
		informat=0;
	}else if(opc==2){
		var informat=$("#Informativo"+pindex).prop("checked");
		
		if(informat==true){
			informat=1; 
		}else{
			informat=0;
		}  
		noAplicar=0;
	}
	
	listFullPlanificacion.forEach(function(val,index)
	{
		if(val.articuloCambio.articulodermod.titulo==objArtTituloSeccion.titulo){
			if(val.id==null){
				planificacionId=0;
			}else{
				planificacionId=val.id
			}
			articuloId=val.articuloCambio.articulodermod.id;
			
			var dataParam={
					id:planificacionId,
					puntaje:{id:puntaje},
					articulo:{id:articuloId}, 
					revision:{id:revisionprogramId},
					observaciones:observaciones,
					noAplica:noAplicar,
					inform:informat
			}
			callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion/save', dataParam,
					cargarDetallePlanificacion);	  
		} 
	});
}
function selecInform(pindex,inf){ 
	objArticulo=listFullPlanificacion[pindex];
	planificacionId=listFullPlanificacion[pindex].id;
	var puntaje=null;
	var articuloId=objArticulo.articuloCambio.articulodermod.id;
	var revisionprogramId=revisionId;
	var observaciones=null;  
	var noAplica=null; 
	
	if(planificacionId==null){
		planificacionId=0
	}
	
	var dataParam={
			id:planificacionId,
			puntaje:{id:puntaje},
			articulo:{id:articuloId}, 
			revision:{id:revisionprogramId},
			observaciones:observaciones,
			noAplica:noAplica,
			inform:inf
	}
	
	callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion/save', dataParam,
			cargarDetallePlanificacion);	  
}

function noAplicarUno(pindex,noApl){ 
	objArticulo=listFullPlanificacion[pindex];
	planificacionId=listFullPlanificacion[pindex].id;
	var puntaje=null;
	var articuloId=objArticulo.articuloCambio.articulodermod.id;
	var revisionprogramId=revisionId;
	var observaciones=null;  
	var noAplica=noApl; 
	var infor=0;
	
	if(planificacionId==null){
		planificacionId=0
	}
	
	var dataParam={
			id:planificacionId,
			puntaje:{id:puntaje},
			articulo:{id:articuloId}, 
			revision:{id:revisionprogramId},
			observaciones:observaciones,
			noAplica:noAplica,
			inform:infor
	}
	callAjaxPost(URL + '/requisitos/norma/empresa/revision/evaluacion/save', dataParam,
			cargarDetallePlanificacion);	  
}

function solicAccionMejor(pindex){

	planificacionId=listFullPlanificacion[pindex].id;
	planificacionObj=listFullPlanificacion[pindex];
	agregarAccionMejora(7, planificacionId,2);
	
}

function indexTitulo(pindex){
	indexTit=pindex;
}

function filtroEvaluacion(){
	filtroEval=$("#inputFiltroEval").val(); 
	cargarDetallePlanificacion();
}