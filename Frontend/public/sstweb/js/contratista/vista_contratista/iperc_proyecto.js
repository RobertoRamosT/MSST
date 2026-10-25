var ipercProyectoId;
var indexIperc;
var ipercProyObj={};
var nivRiesgoObj={};
var banderaEdicionIp=false;
var listFullIpercProyecto;
var estadoActividadProy;
var listConsecuenciasIperc=[];
var listProbabilidadesIperc=[];
var listNivelRiesgoIperc=[];
var listCategoriaProbabilidadEspecifica=[];
var listCategoriaConsecuenciaEspecifica=[];
var listFrecuenciaIperc=[];
var listTiposControlIperc=[];
var listSugeridosDetalleIperc=[];
var indexIperc;
function toggleMenuOpcionIperc(obj,pindex){
	indexIperc=pindex;
	ipercProyObj=listFullIpercProyecto[pindex]; 
	$(obj).parent(".detalleAccion").find("ul").toggle();
	$(obj).parent(".detalleAccion").siblings().find("ul").hide(); 	
}
var funcionalidadesIperc=[  
		 {id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Control",functionClick:function(data){agregarControlIperc(indexIperc)}  },
		 {id:"opcEvaluar",nombre:"<i class='fa fa-file-text-o'></i> Evaluar Residual",functionClick:
			 function(data)
			 { 
			 	if(ipercProyObj.indicadorControlTotal.total>0)
			 	{
			 		editarEvaluacionResidualIperc(indexIperc);
			 	}
			 	else 
			 	{
			 		alertarEvaluacionResidual();
			 	}
			 }  
		 },
         {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i>Editar",functionClick:function(data){editarIpercProyecto()}  },
	     {id:"opcElimnar",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:function(data){eliminarIpercProyecto()}  }
                        ];
function marcarSubOpcionIperc(pindex){
	funcionalidadesIperc[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
	
	
}
function generarExcelAyudaIperc(){
	
	window.open(URL+"/contratista/plantilla/iperc?tipoId="+proyectoObj.tipoIperc.id,"_blank")
	
	 
}
function generarExcelAyudaIpercCinco(){
	
	window.open(URL+"/contratista/plantilla/iperc?tipoId="+proyectoObj.tipoIperc.id+"&subTipoId="+$("#selSubTipoIpercImport").val(),"_blank")
	
	 
}
function guardarImportIpercProyecto(){
	var listImport=[];
	callAjaxPost(URL + '/contratista/proyecto/iperc/ayuda', {},
			function(data) {
		var listSubs=[];
		var listSubEval=[];
		listCategoriaConsecuenciaEspecifica=data.categoria_consecuencia;
		listCategoriaConsecuenciaEspecifica=listCategoriaConsecuenciaEspecifica.filter(filtrarAcordeTipoIperc);
		listCategoriaConsecuenciaEspecifica.forEach(function(val){
			listSubs=val.subCategorias
		});
		listFrecuenciaIperc=data.frecuencia;
		listCategoriaProbabilidadEspecifica=data.categoria_probabilidad;
		listCategoriaProbabilidadEspecifica.forEach(function(val){
			val.probabilidades.forEach(function(val1,index1){
				listSubEval.push(val1);
			});
			
		}); 
		listConsecuenciasIperc=data.consecuencias;
		listBoolean;
		listProbabilidadesIperc=data.probabilidades;
		listProbabilidadesIperc=
			listProbabilidadesIperc.filter(filtrarAcordeTipoIperc);
		listNivelRiesgoIperc=data.nivel_riesgo;
		listNivelRiesgoIperc=
			listNivelRiesgoIperc.filter(filtrarAcordeTipoIperc);
		
		
		var texto = $("#textImportIperc").val();
		var listExcelInicial = texto.split('\n');
		var listExcel=[];
		var validado = "";
		listExcelInicial.forEach(function(val,index){
			if(val.length>0){
				listExcel.push(val);
			} 
		});
		if (texto.length < 100000) {
			for (var int = 0; int < listExcel.length; int++) {

				var listCells = listExcel[int].split('\t');
				var filaTexto = listExcel[int];

				if (validado.length < 1 && listCells.length != 21) {
					validado = "No coincide el numero de celdas."
							+ listCells.length;
					break;
				} else {
					var detalle = {
							evaluacion:{}
					};
					var subCat = {};
					var frecuencia={};
					var evaluacion={
							probEspecif1:{},
							probEspecif2:{},
							probEspecif3:{},
							probEspecif4:{},
							consecuencia:{}
					}
					for (var j = 0; j < listCells.length; j++) {
						var element = listCells[j].trim();
						switch(j){
						case 0:
							detalle.division=element
							break;
						case 1:
							detalle.area=element
							break;
						case 2:
							detalle.puesto=element
							break;
						case 3:
							detalle.actividad=element
							break;
						case 4:
							detalle.tarea=element
							break;
						case 5:
							detalle.lugar=element
							break;
						case 6:
							listSubs.forEach(function(val,index){
								if(val.nombre==element){
									subCat.id=val.id;
									detalle.subTipo=subCat;
								}
							});
							if (!subCat.id) {
								validado = "Categoría no reconocida no reconocido."; 
							}
							break;
						case 7:
							listFrecuenciaIperc.forEach(function(val,index){
								if(val.nombre==element){
									frecuencia.id=val.id;
									detalle.frecuencia=frecuencia;
								}
							});
							if (!frecuencia.id) {
								validado = "Frecuencia no reconocida no reconocido."; 
							}
							break;
						case 8:
							detalle.peligro=element
							break;
						case 9:
							detalle.riesgo=element
							break;
						case 10:
							detalle.consecuencia=element
							break;
						case 11:
							detalle.requisitoLegal=element
							break;
						case 12:
							detalle.control1=element
							break;
						case 13:
							detalle.control2=element
							break;
						case 14:
							detalle.control3=element
							break;
							
						case 12+3:
							listSubEval.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.probEspecif1.id=val.id; 
								}
							});
							if (!evaluacion.probEspecif1.id) {
								validado = "Detalle Probabilidad 1 no reconocida no reconocido."; 
							}
							break;
						case 13+3:
							listSubEval.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.probEspecif2.id=val.id; 
								}
							});
							if (!evaluacion.probEspecif2.id) {
								validado = "Detalle Probabilidad 2 no reconocida no reconocido."; 
							}
							break;
						case 14+3:
							listSubEval.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.probEspecif3.id=val.id; 
								}
							});
							if (!evaluacion.probEspecif3.id) {
								validado = "Detalle Probabilidad 3 no reconocida no reconocido."; 
							}
							break;
						case 15+3:
							listSubEval.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.probEspecif4.id=val.id;
									detalle.evaluacion=evaluacion;
								}
							});
							if (!evaluacion.probEspecif4.id) {
								validado = "Detalle Probabilidad 4 no reconocida no reconocido."; 
							}
							break;
							//
						case 16+3:
							listConsecuenciasIperc.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.consecuencia.id=val.id;
									detalle.evaluacion.consecuenciaEspecifica=evaluacion.consecuencia;
								}
							});
							if (!evaluacion.consecuencia.id) {
								validado = "Consecuencia no reconocida no reconocido."; 
							}
							break;
						case 17+3:
							listBoolean.forEach(function(val,index){
								if(val.nombre==element){
									evaluacion.isSignificativo=val.id;
									detalle.evaluacion.isSignificativo=evaluacion.isSignificativo;
								}
							});
							if (evaluacion.isSignificativo==null) {
								validado = "Significativo no reconocida no reconocido."; 
							}
							detalle.evaluacion.probEspecifFinal=
								calculoProbEspFinal(evaluacion.probEspecif1,
									evaluacion.probEspecif2,
									evaluacion.probEspecif3,
									evaluacion.probEspecif4);
							detalle.evaluacion.nivelRiesgo=
								calculoNivelRiesgoFinal(detalle.evaluacion.probEspecifFinal,
										detalle.evaluacion.consecuenciaEspecifica);
							break;
						}   
						detalle.descripcionPeligro="";
						detalle.tipo={id:4};
						detalle.id=0;
						detalle.proyecto={id:proyectoObj.id}
					}

					listImport.push(detalle);
					 
				}
			}
		} else {
			validado = "Ha excedido los 100000 caracteres permitidos.";
		}
		
		if (validado.length < 1) { 
			var proyrctoObjSend={
				id:proyectoObj.id,
				evaluacionesIperc:listImport
			}
			var r = confirm("¿Está seguro que desea subir estos "
					+ listExcel.length + " elemento(s)?");
			if (r == true) {  
		 	callAjaxPost(URL + '/contratista/proyecto/iperc/masivo/save', proyrctoObjSend,
				 	function(data){
		 		switch (data.CODE_RESPONSE) {
		 		case "05":
		 			if (data.MENSAJE.length > 0) {
		 				alert(data.MENSAJE);
		 			} else {
		 				alert("Se guardaron exitosamente.");
		 				volverDivSubContenido(); 
		 			}
		 			break;
		 		default:
		 			alert("Ocurrió un error al guardar las evaluaciones!");
		 		} 
		 	});
			}
		} else {
			alert(validado);
		}
		
	})
}
function guardarImportIpercProyectoCinco(){
	var listImport=[];
	callAjaxPost(URL + '/contratista/proyecto/iperc/ayuda', {},
			function(data) {
		var listSubs=[];
		var listSubEval1=[],listSubEval2=[],listSubEval3=[],listSubEval4=[],listSubEval5=[];
		listCategoriaConsecuenciaEspecifica=data.categoria_consecuencia;
		listCategoriaConsecuenciaEspecifica=listCategoriaConsecuenciaEspecifica.filter(filtrarAcordeTipoIperc);
		listCategoriaConsecuenciaEspecifica.forEach(function(val){
			listSubs=val.subCategorias
		});
		listFrecuenciaIperc=data.frecuencia;
		listCategoriaProbabilidadEspecifica=data.categoria_probabilidad;
		listCategoriaProbabilidadEspecifica.forEach(function(val){
			val.probabilidades.forEach(function(val1,index1){
				switch(val.id){
				case 1:
					listSubEval1.push(val1);
					break;
				case 2:
					listSubEval2.push(val1);
					break;
				case 3:
					listSubEval3.push(val1);
					break;
				case 4:
					listSubEval4.push(val1);
					break;
				case 5:
					listSubEval5.push(val1);
					break;
				}
			});
			
		});
		listConsecuenciasIperc=data.consecuencias;
		listConsecuenciasIperc=listConsecuenciasIperc.filter(filtrarAcordeTipoIperc);
		listBoolean;
		listProbabilidadesIperc=data.probabilidades;
		listProbabilidadesIperc=
			listProbabilidadesIperc.filter(filtrarAcordeTipoIperc);
		listNivelRiesgoIperc=data.nivel_riesgo;
		listNivelRiesgoIperc=
			listNivelRiesgoIperc.filter(filtrarAcordeTipoIperc);
		
		var numColumnas=0;
		var subTipoId=parseInt($("#selSubTipoIpercImport").val());
		switch(subTipoId){
		case 1:
			numColumnas=26;
			break;
		case 2:
			numColumnas=25;
			break;
		case 3:
			numColumnas=24;
			break;
		}
		
		var textoInicial = $("#textImportIpercCinco").val();
		var texto="";
		var listConEspacion=textoInicial.split("\t");
		listConEspacion.forEach(function(val,index){
			if((index)% (numColumnas-1)==0   ){
				texto+=val+"\t";
			}else{
				texto+=val.replace(/\n/g," ")+"\t"
				
			}
		});
		var listExcelInicial = texto.split('\n');
		var listExcel=[];
		var validado = "";
		
		listExcelInicial.forEach(function(val,index){
			if(val.trim().length>0){
				listExcel.push(val);
			} 
		});
		if (texto.length < 100000) {
			
			for (var int = 0; int < listExcel.length; int++) {

				var listCells = listExcel[int].split('\t');
				var filaTexto = listExcel[int];

				if (validado.length < 1 && listCells.length != numColumnas) {
					validado = "No coincide el numero de celdas."
							+ listCells.length;
					break;
				} else {
					var detalle = {
							evaluacion:{}
					};
					var subCat = {};
					var frecuencia={};
					var evaluacion={
							probEspecif1:{},
							probEspecif2:{},
							probEspecif3:{},
							probEspecif4:{},
							probEspecif5:{},
							consecuencia:{}
					}
					for (var j = 0; j < listCells.length; j++) {
						var element = listCells[j].trim();
						if(subTipoId==1){
							switch(j){
							case 0:
								detalle.division=element
								break;
							case 1:
								detalle.area=element
								break;
							case 2:
								detalle.puesto=element
								break;
							case 3:
								detalle.actividad=element
								break;
							case 4:
								detalle.tarea=element
								break;
							case 5:
								detalle.lugar=element
								break;
							case 6:
								listFrecuenciaIperc.forEach(function(val,index){
									if(val.nombre==element){
										frecuencia.id=val.id;
										detalle.frecuencia=frecuencia;
									}
								});
								if (!frecuencia.id) {
									validado = "Frecuencia no reconocida no reconocido."; 
								}
								break;
							case 7:
								detalle.peligro=element
								break;
							case 8:
								detalle.descripcionPeligro=element
								break;
							case 9:
								detalle.riesgo=element
								break;
							case 10:
								detalle.consecuencia=element
								break;
							case 11:
								detalle.requisitoLegal=element
								break;
							case 12:
								detalle.control1=element
								break;
							case 13:
								detalle.control2=element
								break;
							case 14:
								detalle.control3=element
								break;
								
							case 12+3:
								listSubEval1.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif1=val; 
									}
								});
								if (!evaluacion.probEspecif1.id) {
									validado = "Detalle Probabilidad 1 no reconocida no reconocido."; 
								}
								break;
							case 13+3:
								listSubEval2.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif2=val; 
									}
								});
								if (!evaluacion.probEspecif2.id) {
									validado = "Detalle Probabilidad 2 no reconocida no reconocido."; 
								}
								break;
							case 14+3:
								listSubEval3.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif3=val; 
									}
								});
								if (!evaluacion.probEspecif3.id) {
									validado = "Detalle Probabilidad 3 no reconocida no reconocido."; 
								}
								break;
							case 15+3:
								listSubEval4.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif4=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif4.id) {
									validado = "Detalle Probabilidad 4 no reconocida no reconocido."; 
								}
								break;
							case 16+3:
								listSubEval5.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif5=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif5.id) {
									validado = "Detalle Probabilidad 5 no reconocida no reconocido."; 
								}
								break;
								//
							case 18+3:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuencia=val;
										detalle.evaluacion.consecuenciaEspecifica=evaluacion.consecuencia;
									}
								});
								if (!evaluacion.consecuencia.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 19+3:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuenciaReputacion=val;
										detalle.evaluacion.consecuenciaReputacion=evaluacion.consecuenciaReputacion;
									}
								});
								if (!evaluacion.consecuenciaReputacion.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 22+3:
								listBoolean.forEach(function(val,index){
									if(val.nombre==element){
										evaluacion.isSignificativo=val.id;
										detalle.evaluacion.isSignificativo=evaluacion.isSignificativo;
									}
								});
								if (evaluacion.isSignificativo==null) {
									validado = "Significativo no reconocido"; 
								}
								detalle.evaluacion.probEspecifFinal=
									calculoProbEspFinalCinco(evaluacion.probEspecif1,
										evaluacion.probEspecif2,
										evaluacion.probEspecif3,
										evaluacion.probEspecif4,
										evaluacion.probEspecif5);
								if(detalle.evaluacion.consecuenciaEspecifica.puntaje>detalle.evaluacion.consecuenciaReputacion.puntaje){
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaEspecifica.id);
								}else{
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaReputacion.id);
								}
								
								break;
							}
						}
						if(subTipoId==2){
							switch(j){
							case 0:
								detalle.division=element
								break;
							case 1:
								detalle.area=element
								break;
							case 2:
								detalle.puesto=element
								break;
							case 3:
								detalle.actividad=element
								break;
							case 4:
								detalle.tarea=element
								break;
							case 5:
								detalle.lugar=element
								break;
							case 6:
								listFrecuenciaIperc.forEach(function(val,index){
									if(val.nombre==element){
										frecuencia.id=val.id;
										detalle.frecuencia=frecuencia;
									}
								});
								if (!frecuencia.id) {
									validado = "Frecuencia no reconocida no reconocido."; 
								}
								break;
							case 7:
								detalle.peligro=element
								break;
							case 8:
								detalle.descripcionPeligro=element
								break;
							case 9:
								detalle.consecuencia=element
								break;
							case 10:
								detalle.requisitoLegal=element
								break;
							case 11:
								detalle.control1=element
								break;
							case 12:
								detalle.control2=element
								break;
							case 13:
								detalle.control3=element
								break;
								
							case 12+2:
								listSubEval1.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif1=val; 
									}
								});
								if (!evaluacion.probEspecif1.id) {
									validado = "Detalle Probabilidad 1 no reconocida no reconocido."; 
								}
								break;
							case 13+2:
								listSubEval2.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif2=val; 
									}
								});
								if (!evaluacion.probEspecif2.id) {
									validado = "Detalle Probabilidad 2 no reconocida no reconocido."; 
								}
								break;
							case 14+2:
								listSubEval3.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif3=val; 
									}
								});
								if (!evaluacion.probEspecif3.id) {
									validado = "Detalle Probabilidad 3 no reconocida no reconocido."; 
								}
								break;
							case 15+2:
								listSubEval4.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif4=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif4.id) {
									validado = "Detalle Probabilidad 4 no reconocida no reconocido."; 
								}
								break;
							case 16+2:
								listSubEval5.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif5=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif5.id) {
									validado = "Detalle Probabilidad 5 no reconocida no reconocido."; 
								}
								break;
								//
							case 18+2:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuencia=val;
										detalle.evaluacion.consecuenciaEspecifica=evaluacion.consecuencia;
									}
								});
								if (!evaluacion.consecuencia.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 19+2:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuenciaReputacion=val;
										detalle.evaluacion.consecuenciaReputacion=evaluacion.consecuenciaReputacion;
									}
								});
								if (!evaluacion.consecuenciaReputacion.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 22+2:
								listBoolean.forEach(function(val,index){
									if(val.nombre==element){
										evaluacion.isSignificativo=val.id;
										detalle.evaluacion.isSignificativo=evaluacion.isSignificativo;
									}
								});
								if (evaluacion.isSignificativo==null) {
									validado = "Significativo no reconocido"; 
								}
								detalle.evaluacion.probEspecifFinal=
									calculoProbEspFinalCinco(evaluacion.probEspecif1,
										evaluacion.probEspecif2,
										evaluacion.probEspecif3,
										evaluacion.probEspecif4,
										evaluacion.probEspecif5);
								if(detalle.evaluacion.consecuenciaEspecifica.puntaje>detalle.evaluacion.consecuenciaReputacion.puntaje){
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaEspecifica.id);
								}else{
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaReputacion.id);
								}
								
								break;
							}
						
						}
						if(subTipoId==3){
							switch(j){
							case 0:
								detalle.division=element
								break;
							case 1:
								detalle.area=element
								break;
							case 2:
								detalle.puesto=element
								break;
							case 3:
								detalle.actividad=element
								break;
							case 4:
								detalle.tarea=element
								break;
							case 5:
								detalle.lugar=element
								break;
							case 6:
								listFrecuenciaIperc.forEach(function(val,index){
									if(val.nombre==element){
										frecuencia.id=val.id;
										detalle.frecuencia=frecuencia;
									}
								});
								if (!frecuencia.id) {
									validado = "Frecuencia no reconocida no reconocido."; 
								}
								break;
							case 7:
								detalle.peligro=element
								break;
							case 8:
								detalle.descripcionPeligro=element
								break;
							case 9:
								detalle.requisitoLegal=element
								break;
							case 10:
								detalle.control1=element
								break;
							case 11:
								detalle.control2=element
								break;
							case 12:
								detalle.control3=element
								break;
								
							case 12+1:
								listSubEval1.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif1=val; 
									}
								});
								if (!evaluacion.probEspecif1.id) {
									validado = "Detalle Probabilidad 1 no reconocida no reconocido."; 
								}
								break;
							case 13+1:
								listSubEval2.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif2=val; 
									}
								});
								if (!evaluacion.probEspecif2.id) {
									validado = "Detalle Probabilidad 2 no reconocida no reconocido."; 
								}
								break;
							case 14+1:
								listSubEval3.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif3=val; 
									}
								});
								if (!evaluacion.probEspecif3.id) {
									validado = "Detalle Probabilidad 3 no reconocida no reconocido."; 
								}
								break;
							case 15+1:
								listSubEval4.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif4=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif4.id) {
									validado = "Detalle Probabilidad 4 no reconocida no reconocido."; 
								}
								break;
							case 16+1:
								listSubEval5.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.probEspecif5=val;
										detalle.evaluacion=evaluacion;
									}
								});
								if (!evaluacion.probEspecif5.id) {
									validado = "Detalle Probabilidad 5 no reconocida no reconocido."; 
								}
								break;
								//
							case 18+1:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuencia=val;
										detalle.evaluacion.consecuenciaEspecifica=evaluacion.consecuencia;
									}
								});
								if (!evaluacion.consecuencia.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 19+1:
								listConsecuenciasIperc.forEach(function(val,index){
									if(val.puntaje==element){
										evaluacion.consecuenciaReputacion=val;
										detalle.evaluacion.consecuenciaReputacion=evaluacion.consecuenciaReputacion;
									}
								});
								if (!evaluacion.consecuenciaReputacion.id) {
									validado = "Consecuencia no reconocida no reconocido."; 
								}
								break;
							case 22+1:
								listBoolean.forEach(function(val,index){
									if(val.nombre==element){
										evaluacion.isSignificativo=val.id;
										detalle.evaluacion.isSignificativo=evaluacion.isSignificativo;
									}
								});
								if (evaluacion.isSignificativo==null) {
									validado = "Significativo no reconocido"; 
								}
								detalle.evaluacion.probEspecifFinal=
									calculoProbEspFinalCinco(evaluacion.probEspecif1,
										evaluacion.probEspecif2,
										evaluacion.probEspecif3,
										evaluacion.probEspecif4,
										evaluacion.probEspecif5);
								if(detalle.evaluacion.consecuenciaEspecifica.puntaje>detalle.evaluacion.consecuenciaReputacion.puntaje){
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaEspecifica.id);
								}else{
									detalle.evaluacion.nivelRiesgo=
										verNivelRiesgoIpercCinco(detalle.evaluacion.probEspecifFinal.id,
												detalle.evaluacion.consecuenciaReputacion.id);
								}
								
								break;
							}
						
						}
						
					}
					var subAux=1;
					if(subTipoId==1){
						subAux=4;
					}else{
						subAux=subTipoId
					}
					detalle.tipo={id:subAux};
					detalle.id=0;
					detalle.proyecto={id:proyectoObj.id}
					listImport.push(detalle);
					 
				}
			}
		} else {
			validado = "Ha excedido los 100000 caracteres permitidos.";
		}
		
		if (validado.length < 1) { 
			var proyrctoObjSend={
				id:proyectoObj.id,
				evaluacionesIperc:listImport
			}
			var r = confirm("¿Está seguro que desea subir estos "
					+ listExcel.length + " elemento(s)?");
			if (r == true) {console.log(proyrctoObjSend);
				
		 	callAjaxPost(URL + '/contratista/proyecto/iperc/masivo/save', proyrctoObjSend,
				 	function(data){
		 		switch (data.CODE_RESPONSE) {
		 		case "05":
	 				$("#textImportIpercCinco").val("");
		 			if (data.MENSAJE.length > 0) {
		 				alert(data.MENSAJE);
		 			} else {
		 				alert("Se guardaron exitosamente.");
		 				volverDivSubContenido(); 
		 			}
		 			break;
		 		default:
		 			alert("Ocurrió un error al guardar las evaluaciones!");
		 		} 
		 	});
			}
		} else {
			alert(validado);
		}
		
	})
}
function importarDetalleIpercProyecto(){
	if(proyectoObj.tipoIperc.id==1){
	$(".divListPrincipal>div").hide();
	$("#importIpercProyecto").show(); 
	$("#importIpercProyecto").find(".tituloSubList")
	.html(textoBotonVolverContenido+" Importar evaluaciones Matriz de Riesgo");
	}else{
		$(".divListPrincipal>div").hide();
		$("#importIpercProyectoCinco").show(); 
		$("#importIpercProyectoCinco").find(".tituloSubList")
		.html(textoBotonVolverContenido+" Importar evaluaciones Matriz de Riesgo");
		var listSub=[{id:1,nombre:"Seguridad y Salud"},{id:2,nombre:"Medio Ambiente"},{id:3,nombre:"Operacional"}]
		var selSubTipoIpercImport=crearSelectOneMenuOblig("selSubTipoIpercImport", "", listSub, ""
				, "id", "nombre");
		$("#divSelSubTipoIpercImport").html(""+selSubTipoIpercImport);
	}
}
function verAcordeTipoMatriz(){
	var textoPeligro="";
	var textoConsecuencia="";
	if(proyectoObj.tipoIperc.id==3){
		$("#divSelSubTipoIperc").parent().hide();
		textoPeligro="Peligro / Aspecto / Falla";
		textoConsecuencia="Consecuencia / Impacto";
		}
	
	if(proyectoObj.tipoIperc.id==1){
		textoPeligro="Peligro";
		textoConsecuencia="Consecuencia";
		$("#divSelSubTipoIperc").parent().show();
	}
	
	$("#divPeligroIperc").parent().find("label")
	.html(textoPeligro);
	$("#divConsecIperc").parent().find("label")
	.html(textoConsecuencia);
	
	
	
}
function cargarIpercProyecto(pindex) {
	verAcordeTipoMatriz();
	pindex=defaultFor(pindex,indexPostulante);
	 //
	$(".detalleIpercProyecto").html("");
	$("#trIperProyecto"+listFullProyectoSeguridad[pindex].id)
	.find("button:first")
	.html("<i class='fa fa-arrow-down' aria-hidden='true' ></i>Ver");
	
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
	.parent(".eventoGeneral").parent(".contenidoSubList")
	.parent(".divProyectoGeneral").siblings()
	.find(".detalleIpercProyecto").hide();
	
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
						.find(".detalleIpercProyecto").toggle()
	//
	var proyectoObjSend = {
			id : listFullProyectoSeguridad[pindex].id
	};
	proyectoObj.id=listFullProyectoSeguridad[pindex].id;
	indexPostulante=pindex;
	callAjaxPost(URL + '/contratista/proyecto/iperc/evaluaciones', 
			proyectoObjSend, function(data){
				if(data.CODE_RESPONSE=="05"){
					listTiposControlIperc=data.tipo_control;
					listFullIpercProyecto=data.list;
					listProbabilidadesIperc=data.probabilidades;
					listProbabilidadesIperc=listProbabilidadesIperc.filter(filtrarAcordeTipoIperc);
					listConsecuenciasIperc=data.consecuencias;
					listConsecuenciasIperc=listConsecuenciasIperc.filter(filtrarAcordeTipoIperc);
					listNivelRiesgoIperc=data.nivel_riesgo;
					listNivelRiesgoIperc=listNivelRiesgoIperc.filter(filtrarAcordeTipoIperc);
					listCategoriaProbabilidadEspecifica=data.categoria_probabilidad;
					listCategoriaProbabilidadEspecifica.forEach(function(val){
						$("#divSelProbEsp"+val.id+"Iperc").parent().hide();
						$("#divSelProbEsp"+val.id+"ResidualIperc").parent().hide();
					});
					listCategoriaProbabilidadEspecifica=listCategoriaProbabilidadEspecifica.filter(filtrarAcordeTipoIperc);
					listCategoriaConsecuenciaEspecifica=data.categoria_consecuencia;
					listCategoriaConsecuenciaEspecifica=listCategoriaConsecuenciaEspecifica.filter(filtrarAcordeTipoIperc);
					listFrecuenciaIperc=data.frecuencia;
					listSugeridosDetalleIperc=data.sugeridos;
					banderaEdicionIp=false;
					var indicadorPositivo=0,indicadorTotal=0;
					$("#tblActProyecto tbody tr").remove();
					$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
					.find(".detalleIpercProyecto").html("<td colspan='3'></td>");
					listFullIpercProyecto.forEach(function(val,index){
						 var eviNombre=(val.evidenciaNombre==""?"<br><strong>(Sin Archivo)</strong>": "<br><strong>"+val.evidenciaNombre+"</strong>");
						 var menuOpcion="<ul class='list-group listaGestionGosst' >";
							funcionalidadesIperc.forEach(function(val1,index1){
								menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionIperc("+index1+")'>"+val1.nombre+" </li>"
							});
							menuOpcion+="</ul>";
						 if(val.evaluacion.isSignificativo==0){
							 indicadorPositivo++;
						 }else{
							
						 }
						 var textEvalFinal="<a onclick='editarEvaluacionResidualIperc("+index+")'>Evaluación residual</a>";
						 if(val.indicadorControlTotal.total>0){
							 textEvalFinal="<a onclick='editarEvaluacionResidualIperc("+index+")'>Evaluación residual</a>"; 
						 }else{
							 textEvalFinal="<a onclick='alertarEvaluacionResidual()'>Evaluación residual</a>";
						 }
						 var nivelResidual="<i aria-hidden='true' class='fa fa-info'></i>Nivel Riesgo Residual: <strong>" +
						 					val.evaluacionResidual.nivelRiesgo.nombre+"</strong>";
						 if(val.evaluacionResidual.nivelRiesgo.id==null){
							 nivelResidual="";
						 }
						$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
						.find(".detalleIpercProyecto td") 
						.append("<div id='detalleMovilIperc"+val.id+"'>" +
									"<div class='detalleAccion gosst-neutral' " +
											"style='border-color:"+val.evaluacion.nivelRiesgo.color+" !important; " +
											"border-right:8px solid "+val.evaluacionResidual.nivelRiesgo.color+" !important'> " +
										"<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionIperc(this,"+index+")'>" +
											"Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
										"</a>" +
										menuOpcion+
										"<strong><i class='fa fa-calendar-check-o'></i> Actividad: </strong> "+
										val.actividad+"<br>" +
										"<strong> <i class='fa fa-calendar-check-o'></i> Tarea: </strong> "+val.tarea+"<br>" +
										"<strong><i class='fa fa-check-circle-o'></i>Controles Existentes: </strong> "+val.control1+" / "+ 
										val.control2+" / "+val.control3+"<br>"+
										"<strong> <i class='fa fa-exclamation-triangle'></i> Peligro: </strong> " +val.peligro+"<br>" +
										"<strong><i class='fa fa-exclamation-circle'></i> Riesgo: </strong> "+val.riesgo+"<br>" +
										"<strong><i class='fa fa-frown-o'></i> Consecuencia: </strong> "+val.consecuencia+" <br>"+
										"<strong><i class='fa fa-times-circle'></i> Nivel Riesgo: " +val.evaluacion.nivelRiesgo.nombre+
											(val.evaluacion.isSignificativo==1?" (Significativo)":"")+"</strong><br>" +
												""+nivelResidual+"<br>"+
										"<a class='efectoLink' onclick='cargarControlesIperc("+index+")'>" +
											"Ver Controles ("+val.indicadorControl+") <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
										"</a>" +
									"</div>" +
									"<div class='opcionesAccion'>" +
										/*"<a onclick='agregarControlIperc("+index+")'>Agregar Control</a>" +
										"<i aria-hidden='true' class='fa fa-minus'></i>" +
										"<a onclick='cargarControlesIperc("+index+")'>Ver controles ("+val.indicadorControl+")</a>" +
										"<i aria-hidden='true' class='fa fa-minus'></i>" +
										textEvalFinal+*/
									"</div>"+
									 "<div class='subOpcionAccion'></div>" +
								 "</div>" +
							 "</div>")
							
					 $(".listaGestionGosst").hide();
					});
					$("#trIperProyecto"+proyectoObj.id+" .celdaIndicadorProyecto").html(indicadorPositivo+" / "+listFullIpercProyecto.length)
					formatoCeldaSombreableTabla(true,"tblActProyecto");
				}else{
					console.log("NOPNPO")
				}
			});
	
}
function alertarEvaluacionResidual(){
	alert("No puede realizar la evaluación residual proyectada sin registrar al menos 1 control");
}
function editarIpercProyecto() {
		var selSignificativoIperc=crearSelectOneMenuOblig("selSignificativoIperc", "", listBoolean, ipercProyObj.evaluacion.isSignificativo
			, "id", "nombre");
		$("#divSelSignificativoIperc").html(selSignificativoIperc);
		
		var selTipoIperc=crearSelectOneMenuOblig("selTipoIperc", "verAcordeTipoIperc()", listCategoriaConsecuenciaEspecifica, ""
			, "id", "nombre");
		$("#divSelTipoIperc").html(selTipoIperc);
		
		var selFrecuenciaIperc=crearSelectOneMenuOblig("selFrecuenciaIperc", " ", listFrecuenciaIperc, ""
			, "id", "nombre");
		$("#divSelFrecuenciaIperc").html(selFrecuenciaIperc);
		
		listCategoriaProbabilidadEspecifica.forEach(function(val,index){
			var nombreFuncion="verAcordeProbEspecificaLegalIperc()";
			if(proyectoObj.tipoIperc.id==3){
				nombreFuncion="verAcordeProbEspecificaIperc()"
			}
			$("#divSelProbEsp"+val.id+"Iperc").parent().show();
			var selProbEspIperc=crearSelectOneMenuOblig("selProbEsp"+val.id+"Iperc",nombreFuncion, 
					val.probabilidades, ""
					, "id", "nombre");
			$("#divSelProbEsp"+val.id+"Iperc").html(selProbEspIperc+"<small></small>");
			$("#divSelProbEsp"+val.id+"Iperc").parent()
			.find("label").html(val.nombre);
		
		}); 
		var selProbEspFinalIperc=crearSelectOneMenuOblig("selProbEspFinalIperc", " ", listProbabilidadesIperc, ""
			, "id", "nombre");
		$("#divSelProbEspFinalIperc").html(selProbEspFinalIperc);
		$("#selProbEspFinalIperc").attr("disabled","true");
		var nombreFuncionConsec="verNivelRiesgoLegalIperc()";
		if(proyectoObj.tipoIperc.id==3){
			nombreFuncionConsec="verNivelRiesgoIperc()"
		}else{
			$("#divSelConsecRepuEspFinalIperc").parent().hide();
		}
		var selConsecEspFinalIperc=crearSelectOneMenuOblig("selConsecEspFinalIperc", nombreFuncionConsec, listConsecuenciasIperc, ""
			, "id", "nombre");
		$("#divSelConsecEspFinalIperc").html(selConsecEspFinalIperc+"<small></small>");
		var selConsecEspRepuFinalIperc=crearSelectOneMenuOblig("selConsecEspRepuFinalIperc", nombreFuncionConsec, listConsecuenciasIperc, ""
				, "id", "nombre");
		$("#divSelConsecRepuEspFinalIperc").html(selConsecEspRepuFinalIperc+"<small></small>");
			
		
	//
		$("#editarMovilIpercProy").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Editar evaluación iperc del proyecto '"
				+listFullProyectoSeguridad[indexPostulante].titulo+"' ");
		ipercProyectoId = ipercProyObj.id;  
			
		$("#inputDiviIperc").val(ipercProyObj.division); 
		$("#inputAreaIperc").val(ipercProyObj.area); 
		$("#inputPuestoIperc").val(ipercProyObj.puesto); 
		$("#inputActividadIperc").val(ipercProyObj.actividad); 
		$("#inputTareaIperc").val(ipercProyObj.tarea); 
		$("#inputLugarIperc").val(ipercProyObj.lugar);
		
		$("#selTipoIperc").val(ipercProyObj.tipo.id); 
		$("#selSubTipoIperc").val(ipercProyObj.subTipo.id); 
		$("#selFrecuenciaIperc").val(ipercProyObj.frecuencia.id);
		
		$("#inputPelIperc").val(ipercProyObj.peligro); 
		$("#inputPelDescIperc").val(ipercProyObj.descripcionPeligro); 
		$("#inputRiesgoIperc").val(ipercProyObj.riesgo); 
		$("#inputConsecuenciaIperc").val(ipercProyObj.consecuencia); 
		$("#inputReqLegalIperc").val(ipercProyObj.requisitoLegal); 
		$("#inputControl1Iperc").val(ipercProyObj.control1); 
		$("#inputControl2Iperc").val(ipercProyObj.control2); 
		$("#inputControl3Iperc").val(ipercProyObj.control3); 
		
		
		$("#selProbEspFinalIperc").val(ipercProyObj.evaluacion.probEspecifFinal.id); 
		$("#selConsecEspFinalIperc").val(ipercProyObj.evaluacion.consecuenciaEspecifica.id);
		if(proyectoObj.tipoIperc.id==3){console.log(ipercProyObj.evaluacion)
			$("#selProbEsp1Iperc").val(ipercProyObj.evaluacion.probEspecif1.id); 
			$("#selProbEsp2Iperc").val(ipercProyObj.evaluacion.probEspecif2.id); 
			$("#selProbEsp3Iperc").val(ipercProyObj.evaluacion.probEspecif3.id); 
			$("#selProbEsp4Iperc").val(ipercProyObj.evaluacion.probEspecif4.id); 
			$("#selProbEsp5Iperc").val(ipercProyObj.evaluacion.probEspecif5.id);
			$("#selConsecEspRepuFinalIperc").val(ipercProyObj.evaluacion.consecuenciaReputacion.id);
			verAcordeTipoIperc(); 
			verAcordeProbEspecificaIperc();
			}
		if(proyectoObj.tipoIperc.id==1){
			$("#selProbEsp6Iperc").val(ipercProyObj.evaluacion.probEspecif1.id); 
			$("#selProbEsp7Iperc").val(ipercProyObj.evaluacion.probEspecif2.id); 
			$("#selProbEsp8Iperc").val(ipercProyObj.evaluacion.probEspecif3.id); 
			$("#selProbEsp9Iperc").val(ipercProyObj.evaluacion.probEspecif4.id);
			verAcordeTipoIperc(); 
			verAcordeProbEspecificaLegalIperc();
			}
		//
		
		
		//
		$(".divListPrincipal>div").hide();
		$("#editarMovilIpercProy").show(); 
		
		
		
		
		var eviNombre=ipercProyObj.evidenciaNombre;
		var options=
		{container:"#eviActividad",
				functionCall:function(){ },
				descargaUrl: "/contratista/proyecto/actividad/evidencia?id="+ipercProyObj.id,
				esNuevo:false,
				idAux:"ActividadProy",
				evidenciaNombre:eviNombre};
		crearFormEvidenciaCompleta(options);
		   
	 
}
function editarEvaluacionResidualIperc(pindex){
	
	ipercProyObj=listFullIpercProyecto[pindex];
	$("#editarMovilFinalIperc").find(".tituloSubList")
	.html(textoBotonVolverContenido+" Evaluación residual IPERC ");
	callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/controles', 
			{id:ipercProyObj.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					$(".divListPrincipal>div").hide();
					$("#editarMovilFinalIperc").show(); 
				$("#divActivIperc").html(ipercProyObj.actividad);
				$("#divNivRiesgoIperc").html(ipercProyObj.evaluacion.nivelRiesgo.nombre);
				$("#divControlesIperc").html(""); 
				data.list.forEach(function(val,index){
					$("#divControlesIperc").append("<strong>("+val.tipo.nombre+")</strong> "+val.descripcion+""+"<br>");
						
				});
				listCategoriaProbabilidadEspecifica.forEach(function(val,index){
					$("#divSelProbEsp"+val.id+"ResidualIperc").parent().show();
					var nombreFuncion="verAcordeProbEspecificaResidualIperc()";
					if(proyectoObj.tipoIperc.id==1){
						nombreFuncion="verAcordeProbEspecificaResidualLegalIperc()";
					}
					var selProbEspIperc=crearSelectOneMenuOblig("selProbEsp"+val.id+"ResidualIperc", nombreFuncion, 
						val.probabilidades, ""
						, "id", "nombre");
					$("#divSelProbEsp"+val.id+"ResidualIperc").html(selProbEspIperc+"<small></small>");
					$("#divSelProbEsp"+val.id+"ResidualIperc").parent()
					.find("label").html(val.nombre);
		
				});
				var selProbEspFinalResidIperc=crearSelectOneMenuOblig("selProbEspFinalResidualIperc", " ", listProbabilidadesIperc, ""
						, "id", "nombre");
				$("#divSelProbEspFinalResidualIperc").html(selProbEspFinalResidIperc);
				$("#selProbEspFinalResidualIperc").attr("disabled","true");
				
				// 
				var nombreFuncion="verNivelRiesgoResidualIperc()";
				if(proyectoObj.tipoIperc.id==1){
					nombreFuncion="verNivelRiesgoResidualLegalIperc()";
				}
				var selConsecEspFinalResidualIperc=crearSelectOneMenuOblig("selConsecEspFinalResidualIperc", nombreFuncion, listConsecuenciasIperc, ""
						, "id", "nombre");
				$("#divSelConsecEspFinalResidualIperc").html(selConsecEspFinalResidualIperc+"<small></small>");
				if(proyectoObj.tipoIperc.id==3){
					$("#selProbEsp1ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif1.id); 
					$("#selProbEsp2ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif2.id); 
					$("#selProbEsp3ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif3.id); 
					$("#selProbEsp4ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif4.id); 
					$("#selProbEsp5ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif5.id);
				}else{
					$("#selProbEsp6ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif1.id); 
					$("#selProbEsp7ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif2.id); 
					$("#selProbEsp8ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif3.id); 
					$("#selProbEsp9ResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecif4.id);  
				}
				 
				$("#selProbEspFinalResidualIperc").val(ipercProyObj.evaluacionResidual.probEspecifFinal.id); 
				$("#selConsecEspFinalResidualIperc").val(ipercProyObj.evaluacionResidual.consecuenciaEspecifica.id);  
				// 
				if(proyectoObj.tipoIperc.id==3){
					verAcordeProbEspecificaResidualIperc();
				}else{
					verAcordeProbEspecificaResidualLegalIperc();
				}
				
				//
			}
	});
}
function filtrarAcordeTipoIperc(val,index){
	return val.tipoIperc.id==proyectoObj.tipoIperc.id;
}
function nuevoIpercProyecto(pindex) {
	if (!banderaEdicionIp) {
		verAcordeTipoMatriz();
		ipercProyectoId = 0;
		proyectoObj.id=listFullProyectoSeguridad[pindex].id;
		indexPostulante=pindex;
		$("#editarMovilIpercProy").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nueva evaluación IPERC del proyecto '"
				+listFullProyectoSeguridad[pindex].titulo+"' ");
		ipercProyObj={
				tipo:{id:0}
				,subTipo:{id:0}
		}
		callAjaxPost(URL + '/contratista/proyecto/iperc/ayuda', {},
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						listProbabilidadesIperc=data.probabilidades;
						listProbabilidadesIperc=
							listProbabilidadesIperc.filter(filtrarAcordeTipoIperc);
						listConsecuenciasIperc=data.consecuencias;
						listConsecuenciasIperc=
							listConsecuenciasIperc.filter(filtrarAcordeTipoIperc);
						listNivelRiesgoIperc=data.nivel_riesgo;
						listNivelRiesgoIperc=
							listNivelRiesgoIperc.filter(filtrarAcordeTipoIperc);
						listCategoriaProbabilidadEspecifica=data.categoria_probabilidad;
						listCategoriaProbabilidadEspecifica.forEach(function(val){
							$("#divSelProbEsp"+val.id+"Iperc").parent().hide();
						});
						listCategoriaProbabilidadEspecifica=
							listCategoriaProbabilidadEspecifica.filter(filtrarAcordeTipoIperc);
						listCategoriaConsecuenciaEspecifica=data.categoria_consecuencia;
						listCategoriaConsecuenciaEspecifica=
							listCategoriaConsecuenciaEspecifica.filter(filtrarAcordeTipoIperc);
						listFrecuenciaIperc=data.frecuencia;
						
						//
						listSugeridosDetalleIperc=data.sugeridos;
						
						 
						
						//
						$("#editarMovilIpercProy").find("form input").val("");
						$("#inputDiviIperc").focus();
			var selTipoIperc=crearSelectOneMenuOblig("selTipoIperc", "verAcordeTipoIperc()", 
					listCategoriaConsecuenciaEspecifica, ""
					, "id", "nombre");
			$("#divSelTipoIperc").html(selTipoIperc);
			verAcordeTipoIperc(); 
			var selFrecuenciaIperc=crearSelectOneMenuOblig("selFrecuenciaIperc", " ", listFrecuenciaIperc, ""
					, "id", "nombre");
			$("#divSelFrecuenciaIperc").html(selFrecuenciaIperc);
			 
			listCategoriaProbabilidadEspecifica.forEach(function(val,index){
				var nombreFuncion="verAcordeProbEspecificaLegalIperc()";
				if(proyectoObj.tipoIperc.id==3){
					nombreFuncion="verAcordeProbEspecificaIperc()"
				}
				$("#divSelProbEsp"+val.id+"Iperc").parent().show();
				var selProbEspIperc=crearSelectOneMenuOblig("selProbEsp"+val.id+"Iperc", nombreFuncion, 
						val.probabilidades, ""
						, "id", "nombre");
				$("#divSelProbEsp"+val.id+"Iperc").html(selProbEspIperc+"<small></small>");
				$("#divSelProbEsp"+val.id+"Iperc").parent()
				.find("label").html(val.nombre);
				
			}); 
			var selProbEspFinalIperc=crearSelectOneMenuOblig("selProbEspFinalIperc", " ", listProbabilidadesIperc, ""
					, "id", "nombre");
			$("#divSelProbEspFinalIperc").html(selProbEspFinalIperc);
			$("#selProbEspFinalIperc").attr("disabled","true");
			
			// 
			var nombreFuncion="verNivelRiesgoLegalIperc()";
			if(proyectoObj.tipoIperc.id==3){
				nombreFuncion="verNivelRiesgoIperc()"
			}
			var selConsecEspFinalIperc=crearSelectOneMenuOblig("selConsecEspFinalIperc",  nombreFuncion, listConsecuenciasIperc, ""
					, "id", "nombre");
			$("#divSelConsecEspFinalIperc").html(selConsecEspFinalIperc+"<small></small>");
			
			var selConsecEspRepuFinalIperc=crearSelectOneMenuOblig("selConsecEspRepuFinalIperc", nombreFuncion, listConsecuenciasIperc, ""
					, "id", "nombre");
			$("#divSelConsecRepuEspFinalIperc").html(selConsecEspRepuFinalIperc+"<small></small>");
			
			verAcordeProbEspecificaIperc();
			if(proyectoObj.tipoIperc.id==1){
				verAcordeProbEspecificaLegalIperc();
			}
						break;
					default:
						alert("Ocurrió un error al traer evaluaciones IPERC");
					}
				});
		var selSignificativoIperc=crearSelectOneMenuOblig("selSignificativoIperc", "", listBoolean, ""
				, "id", "nombre");
			$("#divSelSignificativoIperc").html(selSignificativoIperc);
		
		
		$(".divListPrincipal>div").hide();
		$("#editarMovilIpercProy").show(); 
		
		
		
		banderaEdicionIp = false;
	} else {
		alert("Guarde primero.");
	}
}
function verAcordeTipoIperc(){
	var tipoIper=$("#selTipoIperc").val();
	var subCategorias=[];
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		if(val.id==tipoIper){
			subCategorias=val.subCategorias;
		}
	});
	var selSubTipoIperc=crearSelectOneMenuOblig("selSubTipoIperc", "verAcordeSubTipoIperc()",subCategorias , ipercProyObj.subTipo.id
			, "id", "nombre");
	$("#divSelSubTipoIperc").html(selSubTipoIperc);
	verAcordeSubTipoIperc();
	verNivelRiesgoIperc();
}
function verAcordeSubTipoIperc(){ 
	var subtipoIper=$("#selSubTipoIperc").val();
	var subPeligrosCategoria=[],subRiesgosCategoria=[],subConsecuenciaCategoria=[];
	
	
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		val.subCategorias.forEach(function(val1,index1){
			if(val1.id==subtipoIper ){ 
				subPeligrosCategoria=val1.peligros.filter(function(val2){return proyectoObj.tipoIperc.id==val2.tipoIperc.id});
				subRiesgosCategoria=val1.riesgos.filter(function(val2){return proyectoObj.tipoIperc.id==val2.tipoIperc.id});
				subConsecuenciaCategoria=val1.consecuencias.filter(function(val2){return proyectoObj.tipoIperc.id==val2.tipoIperc.id});
				}
		});
	});
	var inputPeligro=$("#inputPelIperc");   
	inputPeligro.autocomplete( "option", "source",listarStringsDesdeArray(subPeligrosCategoria,"nombre") );

	if(proyectoObj.tipoIperc.id==1){
		ponerListaSugerida("inputRiesgoIperc",listarStringsDesdeArray(subRiesgosCategoria,"nombre"),true);
		ponerListaSugerida("inputConsecuenciaIperc",listarStringsDesdeArray(subConsecuenciaCategoria,"nombre"),true);
	}else{
		ponerListaSugerida("inputRiesgoIperc",[],false);
		ponerListaSugerida("inputConsecuenciaIperc",[],false);
	}
}

function buscarSugeridoPeligro( event, ui ) {
	var inputPeligro=$("#inputPelIperc");
	if( inputPeligro.val()!=ipercProyObj.peligro){
	listSugeridosDetalleIperc.every(function(val,index){ 
			if(inputPeligro.val()==val.peligro.replace("\n","")
					){
				$("#inputRiesgoIperc").val(val.riesgo);
				$("#inputConsecuenciaIperc").val(val.consecuencia);
				
				return false;
			}else{ 
				if(inputPeligro.val()==val.aspecto.replace("\n","")){
					$("#inputRiesgoIperc").val("");
					$("#inputConsecuenciaIperc").val(val.impacto);
					return false;
				}else{
					$("#inputRiesgoIperc").val("");
					$("#inputConsecuenciaIperc").val("");
					return true;
				}
				
				$("#inputRiesgoIperc").val("");
				$("#inputConsecuenciaIperc").val("");
				return true;
			} 
		});
	}
}

function verAcordeProbEspecificaResidualIperc(){
	 var puntajesArray=[];
		listCategoriaProbabilidadEspecifica.forEach(function(val,index){
		  var probEspId=$("#selProbEsp"+(index+1)+"ResidualIperc").val();
		 
		  val.probabilidades.forEach(function(val1,index1){
			  if(probEspId==val1.id){
				  puntajesArray.push(val1.puntaje)
				  $("#divSelProbEsp"+val.id+"ResidualIperc").find("small").html(val1.ayuda);
			  }
		  }); 
		});
		puntajesArray.sort(function(a, b) {
			  return a - b;
			});
		puntajesArray.pop();
		puntajesArray.shift();
		var sumTotal=0;
		puntajesArray.forEach(function(val,index){
			sumTotal+=val;
		});
		var promProbEspecifica=Math.ceil(sumTotal/puntajesArray.length);
		
		listProbabilidadesIperc.forEach(function(val,index){
			if(val.puntaje==promProbEspecifica){
				$("#selProbEspFinalResidualIperc").val(val.id)
			}
		});
		verNivelRiesgoResidualIperc();
}
function verAcordeProbEspecificaResidualLegalIperc(){
	 var sumTotal=0;
		listCategoriaProbabilidadEspecifica.forEach(function(val,index){
		  var probEspId=$("#selProbEsp"+val.id+"ResidualIperc").val(); 
		  val.probabilidades.forEach(function(val1,index1){
			  if(probEspId==val1.id){
				  sumTotal+=val1.puntaje;
			  }
		  }); 
		});
		var probObj={};
		if(sumTotal>8){
			probObj=listProbabilidadesIperc[2]
		}else if(sumTotal>4){
			probObj=listProbabilidadesIperc[1]
		}else{
			probObj=listProbabilidadesIperc[0]
		} 
		$("#selProbEspFinalResidualIperc").val(probObj.id)
	    verNivelRiesgoResidualLegalIperc();
}
function verAcordeProbEspecificaIperc(){
	 var puntajesArray=[];
	listCategoriaProbabilidadEspecifica.forEach(function(val,index){
	  var probEspId=$("#selProbEsp"+val.id+"Iperc").val();
	 
	  val.probabilidades.forEach(function(val1,index1){
		  if(probEspId==val1.id){
			  puntajesArray.push(val1.puntaje); 
			  $("#divSelProbEsp"+val.id+"Iperc").find("small").html(val1.ayuda);
		  }
	  }); 
	});
	puntajesArray.sort(function(a, b) {
		  return a - b;
		});
	puntajesArray.pop();
	puntajesArray.shift();
	var sumTotal=0;
	puntajesArray.forEach(function(val,index){
		sumTotal+=val;
	});
	var promProbEspecifica=Math.ceil(sumTotal/puntajesArray.length);
	
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.puntaje==promProbEspecifica){
			$("#selProbEspFinalIperc").val(val.id)
		}
	});
	verNivelRiesgoIperc();
}
function calculoProbEspFinal(prob1,prob2,prob3,prob4){
	var probObj={};
	 var sumTotal=0;
		listCategoriaProbabilidadEspecifica.forEach(function(val,index){ 
		  val.probabilidades.forEach(function(val1,index1){
			  if(prob1.id ==val1.id ||
					  prob2.id ==val1.id ||
					  prob3.id ==val1.id ||
					  prob4.id ==val1.id){
				  sumTotal+=val1.puntaje;
			  }
		  }); 
		});
		if(sumTotal>8){
			probObj=listProbabilidadesIperc[2]
		}else if(sumTotal>4){
			probObj=listProbabilidadesIperc[1]
		}else{
			probObj=listProbabilidadesIperc[0]
		} 
	return probObj;
}
function calculoProbEspFinalCinco(prob1,prob2,prob3,prob4,prob5){
	var probObj={};
		 var puntajesArray=[];
		 puntajesArray.push(prob1.puntaje); 
		 puntajesArray.push(prob2.puntaje); 
		 puntajesArray.push(prob3.puntaje); 
		 puntajesArray.push(prob4.puntaje); 
		 puntajesArray.push(prob5.puntaje);
				puntajesArray.sort(function(a, b) {
				  return a - b;
				});
			puntajesArray.pop();
			puntajesArray.shift();
			var sumTotal=0;
			puntajesArray.forEach(function(val,index){
				sumTotal+=val;
			});
			var promProbEspecifica=Math.ceil(sumTotal/puntajesArray.length);
			
			listProbabilidadesIperc.forEach(function(val,index){
				if(val.puntaje==promProbEspecifica){
					probObj=val;
				}
			});
	return probObj;
}
function calculoNivelRiesgoFinal(probFinal,consecFinal){
	var puntajeProb=0,idProb=probFinal.id;
	var puntajeCons=0,idCons=consecFinal.id;
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
	});
	var nivRiesgoObj={};
	var puntajeRiesgo=puntajeProb*puntajeCons; 
	if(puntajeRiesgo>=25){
		nivRiesgoObj=listNivelRiesgoIperc[4]
	}else if(puntajeRiesgo>=17){
		nivRiesgoObj=listNivelRiesgoIperc[3]
	}else if(puntajeRiesgo>=9){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	}
	return nivRiesgoObj;
}
function verAcordeProbEspecificaLegalIperc(){ 
	 var sumTotal=0;
	listCategoriaProbabilidadEspecifica.forEach(function(val,index){
	  var probEspId=$("#selProbEsp"+val.id+"Iperc").val();
	  val.probabilidades.forEach(function(val1,index1){
		  if(probEspId==val1.id){
			  sumTotal+=val1.puntaje;
		  }
	  }); 
	});
	var probObj={};
	if(sumTotal>8){
		probObj=listProbabilidadesIperc[2]
	}else if(sumTotal>4){
		probObj=listProbabilidadesIperc[1]
	}else{
		probObj=listProbabilidadesIperc[0]
	} 
	$("#selProbEspFinalIperc").val(probObj.id)
    verNivelRiesgoLegalIperc();
}
function verNivelRiesgoResidualLegalIperc(){
	var puntajeProb=0,idProb=$("#selProbEspFinalResidualIperc").val();
	var puntajeCons=0,idCons=$("#selConsecEspFinalResidualIperc").val();
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
	});
	var puntajeRiesgo=puntajeProb*puntajeCons; 
	if(puntajeRiesgo>=25){
		nivRiesgoObj=listNivelRiesgoIperc[4]
	}else if(puntajeRiesgo>=17){
		nivRiesgoObj=listNivelRiesgoIperc[3]
	}else if(puntajeRiesgo>=9){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	}
	
	$("#divSelRiesgoEspFinalResidualIperc").css({"border-left":"20px solid "+nivRiesgoObj.color}).html("<strong>"+nivRiesgoObj.nombre+"</strong>")
	var consEspText="";
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		if(val.id==$("#selTipoIperc").val()){
			val.consecuencias.forEach(function(val1,index1){
				if(puntajeCons==val1.puntaje){
					consEspText=val1.nombre;
				}
			});
		}
	});
}
function verNivelRiesgoResidualIperc(){
	var puntajeProb=0,idProb=$("#selProbEspFinalResidualIperc").val();
	var puntajeCons=0,idCons=$("#selConsecEspFinalResidualIperc").val();
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
	});
	var puntajeRiesgo=puntajeProb*puntajeCons;
	
	if(puntajeRiesgo>=12){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	}
	$("#divSelRiesgoEspFinalResidualIperc").css({"border-left":"20px solid "+nivRiesgoObj.color}).html("<strong>"+nivRiesgoObj.nombre+"</strong>")
	var consEspText="";
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		if(val.id==ipercProyObj.tipo.id){
			val.consecuencias.forEach(function(val1,index1){
				if(puntajeCons==val1.puntaje){
					consEspText=val1.nombre;
				}
			});
		}
	});
	$("#divSelConsecEspFinalResidualIperc").find("small").html(consEspText)
}
function verNivelRiesgoIperc(){
	var puntajeProb=0,idProb=$("#selProbEspFinalIperc").val();
	var puntajeCons=0,idCons=$("#selConsecEspFinalIperc").val(),puntajeReputa=0,idConsReputa=$("#selConsecEspRepuFinalIperc").val();
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
		if(val.id==idConsReputa){
			puntajeReputa=val.puntaje;
		}
	});
	if(puntajeReputa>puntajeCons){
		puntajeCons=puntajeReputa
	}
	var puntajeRiesgo=puntajeProb*puntajeCons;
	
	if(puntajeRiesgo>=12){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	} 
	$("#divSelRiesgoEspFinalIperc").css({"border-left":"20px solid "+nivRiesgoObj.color}).html("<strong>"+nivRiesgoObj.nombre+"</strong>")
	var consEspText="";
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		if(val.id==$("#selTipoIperc").val()){
			val.consecuencias.forEach(function(val1,index1){
				if(puntajeCons==val1.puntaje){
					consEspText=val1.nombre;
				}
			});
		}
	});
	if(proyectoObj.tipoIperc.id==3){
		$("#divSelConsecEspFinalIperc").find("small").html(consEspText);	
	}
	
	
}
function verNivelRiesgoIpercCinco(idProb,idCons){
	var puntajeProb=0
	var puntajeCons=0
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
	});
	var puntajeRiesgo=puntajeProb*puntajeCons;
	
	if(puntajeRiesgo>=12){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	} 
	 return nivRiesgoObj;
	
	
	
}
function verNivelRiesgoLegalIperc(){
	var puntajeProb=0,idProb=$("#selProbEspFinalIperc").val();
	var puntajeCons=0,idCons=$("#selConsecEspFinalIperc").val();
	listProbabilidadesIperc.forEach(function(val,index){
		if(val.id==idProb){
			puntajeProb=val.puntaje
		}
	});
	listConsecuenciasIperc.forEach(function(val,index){
		if(val.id==idCons){
			puntajeCons=val.puntaje
		}
	});
	var puntajeRiesgo=puntajeProb*puntajeCons; 
	if(puntajeRiesgo>=25){
		nivRiesgoObj=listNivelRiesgoIperc[4]
	}else if(puntajeRiesgo>=17){
		nivRiesgoObj=listNivelRiesgoIperc[3]
	}else if(puntajeRiesgo>=9){
		nivRiesgoObj=listNivelRiesgoIperc[2]
	}else if(puntajeRiesgo>=5){
		nivRiesgoObj=listNivelRiesgoIperc[1]
	}else{
		nivRiesgoObj=listNivelRiesgoIperc[0]
	}
	
	$("#divSelRiesgoEspFinalIperc").css({"border-left":"20px solid "+nivRiesgoObj.color}).html("<strong>"+nivRiesgoObj.nombre+"</strong>")
	var consEspText="";
	listCategoriaConsecuenciaEspecifica.forEach(function(val,index){
		if(val.id==$("#selTipoIperc").val()){
			val.consecuencias.forEach(function(val1,index1){
				if(puntajeCons==val1.puntaje){
					consEspText=val1.nombre;
				}
			});
		}
	});
	//$("#divSelConsecEspFinalIperc").find("small").html(consEspText)
	
	
}

function cancelarActProyecto() {
	cargarTiposContratista();
}

function eliminarIpercProyecto() { 
	var r = confirm("¿Está seguro de eliminar la evaluación IPERC?");
	if (r == true) {
		var dataParam = {
				id : ipercProyObj.id,
		};

		callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarIpercProyecto();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function guardarIpercProyecto(functionCallBack) {

	var campoVacio = false,mensajeCampos="Debe ingresar obligatoriamente ";
	var division=$("#inputDiviIperc").val();  
var area=$("#inputAreaIperc").val();
var puesto=$("#inputPuestoIperc").val();
var actividad=$("#inputActividadIperc").val();
var tarea=$("#inputTareaIperc").val();
var lugar=$("#inputLugarIperc").val();

var tipo=$("#selTipoIperc").val();
var subTipo=$("#selSubTipoIperc").val();
var frecuencia=$("#selFrecuenciaIperc").val();

var peligro=$("#inputPelIperc").val();
var descripcionPeligro=$("#inputPelDescIperc").val();
var riesgo=$("#inputRiesgoIperc").val();
var consecuencia=$("#inputConsecuenciaIperc").val();
var requisitoLegal=$("#inputReqLegalIperc").val();
var control1=$("#inputControl1Iperc").val();
var control2=$("#inputControl2Iperc").val();
var control3=$("#inputControl3Iperc").val();

var probEspecif1=$("#selProbEsp1Iperc").val();
var probEspecif2=$("#selProbEsp2Iperc").val();
var probEspecif3=$("#selProbEsp3Iperc").val();
var probEspecif4=$("#selProbEsp4Iperc").val();
var probEspecif5=$("#selProbEsp5Iperc").val();

 if(proyectoObj.tipoIperc.id==1){
	 probEspecif1=$("#selProbEsp6Iperc").val();
	  probEspecif2=$("#selProbEsp7Iperc").val();
	  probEspecif3=$("#selProbEsp8Iperc").val();
	  probEspecif4=$("#selProbEsp9Iperc").val();
 }

var probFinalEspecif=$("#selProbEspFinalIperc").val();
var consecuenciaEspecifica=$("#selConsecEspFinalIperc").val();
var consecuenciaReputacion=$("#selConsecEspRepuFinalIperc").val();
var nivelRiesgo=nivRiesgoObj;
var isSignificativo=$("#selSignificativoIperc").val();
if(actividad.length==0){
	campoVacio=true;
	mensajeCampos+=" Actividad";
}
if(peligro.length==0){
	campoVacio=true;
	mensajeCampos+=" Peligro";
}
		if (!campoVacio) {

			var dataParam = {
				id : ipercProyectoId, 
				division:division,
				area:area,
				puesto:puesto,
				actividad:actividad,
				tarea:tarea,
				lugar:lugar,
				
				tipo:{id:tipo},
				subTipo:{id:subTipo},
				frecuencia:{id:frecuencia},
				
				peligro:peligro,
				descripcionPeligro:descripcionPeligro,
				riesgo:riesgo,
				consecuencia:consecuencia,
				requisitoLegal:requisitoLegal,
				control1:control1,
				control2:control2,
				control3:control3,
				evaluacion:{
				probEspecif1:{id:probEspecif1},
				probEspecif2:{id:probEspecif2},
				probEspecif3:{id:probEspecif3},
				probEspecif4:{id:probEspecif4},
				probEspecif5:{id:probEspecif5},
				probEspecifFinal:{id:probFinalEspecif},
				consecuenciaEspecifica:{id:consecuenciaEspecifica},consecuenciaReputacion:{id:consecuenciaReputacion},
				nivelRiesgo:nivelRiesgo,
				isSignificativo:isSignificativo
				},
				proyecto:{id:proyectoObj.id}
			};

			callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
							var nuevoId=data.nuevoId;
							volverDivSubContenido();
							cargarIpercProyecto();
						 
							break;
						default:
							console.log("Ocurrió un error al guardar la evaluación!");
						}
					},null,null,null,null,false);
			 
		} else {
			alert(mensajeCampos);
		}
	
	
}

function guardarFinalIperc(){
	var probEspecif1=$("#selProbEsp1ResidualIperc").val();
	var probEspecif2=$("#selProbEsp2ResidualIperc").val();
	var probEspecif3=$("#selProbEsp3ResidualIperc").val();
	var probEspecif4=$("#selProbEsp4ResidualIperc").val();
	var probEspecif5=$("#selProbEsp5ResidualIperc").val();
	if(proyectoObj.tipoIperc.id==1){
			probEspecif1=$("#selProbEsp6ResidualIperc").val();
		  probEspecif2=$("#selProbEsp7ResidualIperc").val();
		  probEspecif3=$("#selProbEsp8ResidualIperc").val();
		  probEspecif4=$("#selProbEsp9ResidualIperc").val();
	 }
	var probFinalEspecif=$("#selProbEspFinalResidualIperc").val();
	var consecuenciaEspecifica=$("#selConsecEspFinalResidualIperc").val();
	var nivelRiesgo=nivRiesgoObj;
	
	var dataParam = {
			id : ipercProyObj.id,  
			evaluacionResidual:{
			probEspecif1:{id:probEspecif1},
			probEspecif2:{id:probEspecif2},
			probEspecif3:{id:probEspecif3},
			probEspecif4:{id:probEspecif4},
			probEspecif5:{id:probEspecif5},
			probEspecifFinal:{id:probFinalEspecif},
			consecuenciaEspecifica:{id:consecuenciaEspecifica},
			nivelRiesgo:nivelRiesgo, 
			} 
		};
	callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/residual/save', dataParam,
			function(data) {
				switch (data.CODE_RESPONSE) {
				case "05": 
					volverDivSubContenido();
					cargarIpercProyecto();
					alert("Evaluación residual guardada")
					break;
				default:
					console.log("Ocurrió un error al guardar la evaluación!");
				}
			});
	
}
function cancelarNuevoActProyecto(){
	cargarIpercProyecto();
}

function verTablaIpercProyecto(){
	$(".divContainerGeneral").hide();
	var buttonDescarga="<a target='_blank' class='btn btn-success'" +
			" href='"+URL+"/'>" +
			"<i class='fa fa-download'></i>Descargar</a>"
	var buttonClip="<button id='btnClipboardIpercProy'   style='margin-right:10px' title='Clipboard' " +
			" class='btn btn-success clipGosst' onclick='obtenerTablaIpercContratista()'>" +
					"<i class='fa fa-clipboard fa-2x'></i></button>"
	var buttonVolver="<button class='btn btn-success ' style='margin-right:10px'" +
			" onclick='volverVistaMovil()'>" +
						"<i class='fa fa-sign-out fa-rotate-180'></i>Volver</button>";
	var buttonFiltro="<button type='button' class='btn btn-success ' id='filtroIniciarBuscador' style='margin-right:10px'" +
	" title='Ver filtros' onclick='iniciarFiltroIperc()'>" +
				"<i class='fa fa-filter fa-2x'></i></button>";
	var buttonFiltroAplicar="<button type='button' class='btn btn-success ' id='filtroAplicarBuscador' style='margin-right:10px'" +
	" onclick='aplicarFiltroIperc()'>" +
				"<i class='fa fa-filter'></i>Aplicar filtros</button>";
	var buttonFiltroRefresh="<button type='button' class='btn btn-success ' id='btnReiniciarFiltro' style='margin-right:10px'" +
	" title='Refresh' onclick='reiniciarFiltroIpercProyecto()'>" +
				"<i class='fa fa-refresh fa-2x'></i></button>";
	$("body") 
	.append("<div class='table-responsive' id='divIpercTabla' style='padding-left: 40px;'>" +
			buttonVolver+buttonFiltro+buttonFiltroAplicar+buttonFiltroRefresh+
			buttonClip+
			"<div class='camposFiltroTabla'>"+
				
			"</div>"+ 
			"<div class='wrapper' id='wrapperIperc'>" +
			"<table  style='min-width:6200px ' " +
			"id='tblMatrices' class='table table-striped table-bordered table-hover fixed'>" +
			"<thead>" +
			"</thead>" +
			"<tbody></tbody>" +
			"</table>" +
			"</div>" +
			" </div>");
	crearSelectOneMenuObligMultipleCompleto("selMultiplePuestoIperc", "", [], 
			"id","nombre","#divSelectFiltroProyIpercPuesto","Seleccione puestos");
	
	var dataParamAux = {
			id : proyectoObj.id 
	};
	callAjaxPost(URL+"/contratista/proyecto/iperc/evaluaciones",dataParamAux,
			procesarListarTablaDetalleIperc)
}

function volverVistaMovil(){
   contadorFijoY = 0;
	 
   $(".divTituloGeneral h4").html(tituloAnteriorContratista);
   $("#divIpercTabla").remove();$("#divTrabProyTabla").remove();
   $("#divObsProyTabla").remove();$("#divStatDocTabla").remove();
   $(".divContainerGeneral").show();
}
