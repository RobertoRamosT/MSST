/**
 * 
 */
var listFullAuditoriaResumenFinal;
function elegirAuditoriaResumen(pindex){
	auditoriaObj = listFullAuditoriaResumenFinal[pindex];
	auditoriaId = auditoriaObj.auditoriaId
}
function cargarFiltrosResumenAuditoriaFinal(tipo){
	if(tipo > 0){
		auditoriaClasif=tipo;
	}
	
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			auditoriaClasifId : auditoriaClasif
		};
	callAjaxPost(URL + '/auditoria/filtro', dataParamAudi,
			function(data){
	    var objTodos = [{id : -2,nombre : "Todos"}];
		var listGerencia=objTodos.concat(data.listGerencia);
		var listAMA=data.listAMA;
		
		 
		var selTipoEvaluacionTotal=crearSelectOneMenuOblig("selEvalAudiRes","verAcordeEvalAudi()",
				listGerencia,3,"id","nombre");
		var selTipoEvaluacionAMATotal=crearSelectOneMenuOblig("selEvalAMAAudiRes","",
				listAMA,"","id","nombre");
		
		var contenido ="";
		var listContenido = [
     {sugerencia:"",label:"Desde",inputForm:"<input type='date' id='fechaInicioResFinalAudi' class='form-control'>"},
     {sugerencia:"",label:"Hasta",inputForm:"<input type='date' id='fechaFinResFinalAudi' class='form-control'>"},
      
     {sugerencia:"",label:"Filtro Validación por Gerencia",inputForm:selTipoEvaluacionTotal},
     {sugerencia:"",label:"Filtro por evaluación de A.M.A:",inputForm: selTipoEvaluacionAMATotal,divContainer:"divSelEvalAMA"},
     {sugerencia:"",label:"Contratistas",inputForm:"",divContainer:"filtroContratistaInsLibre"},
      {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroAuditoriaInspeccionLibre()'><i class='fa fa-times'></i>Cancelar</button>",
    	 inputForm:"<button class='btn btn-success' type='button' onclick='ocultarFiltroAuditoriaInspeccionLibre();cargarResumenAuditoriaFinal()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
		                     ];
		listContenido.forEach(function(val){
			contenido +=obtenerSubPanelModuloGeneral(val);
		});
		var modalOptions= {id:"modalFiltroAudiInspeccionLibre",nombre:"<i class='fa fa-filter'></i>Filtros",
				contenido: contenido};
		crearModalPrincipalUsuario(modalOptions,function(){
		    
if($("#selMultipleContratistaFiltroInspLibre").length > 0){return;};
			crearSelectOneMenuObligMultipleCompleto("selMultipleContratistaFiltroInspLibre", "",
				data.contratistas,"id","nombre","#filtroContratistaInsLibre","Todas ");    
		},false,false);
		
		var hoy = obtenerFechaActual();
		$("#fechaInicioResFinalAudi").val(sumaFechaDias(-90,hoy));
		$("#fechaFinResFinalAudi").val(sumaFechaDias(35,hoy));
		verAcordeEvalAudi();
		cargarResumenAuditoriaFinal(tipo);
		
	});	
}

function verFiltroAuditoriaInspeccionLibre(){
	$("#modalFiltroAudiInspeccionLibre").modal("show");
}

function ocultarFiltroAuditoriaInspeccionLibre(){
	$("#modalFiltroAudiInspeccionLibre").modal("hide");
}
function volverResumenAuditoriaTab(){
	$("#tabResumenAuditoria .container-fluid").hide();
	$("#divGeneResumenAudi").show();
	$("#tabResumenAuditoria h2").html("Resumen Auditoría / Inspecciones");
}
function verAcordeEvalAudi(){
    if(parseInt( $("#selEvalAudiRes").val() ) == 1){
    	$("#divSelEvalAMA").parent().show();
    }else{
	$("#divSelEvalAMA").parent().hide();
    }
}
function cargarResumenAuditoriaFinal(tipo){
    
    var valorResize= 160;
    resizeDivWrapper("wrapResumAudiFinal",valorResize);
    
	volverResumenAuditoriaTab()
	if(tipo > 0){
		auditoriaClasif=tipo;
	}
	$("#tdResultRes").html("Ver Resultados");
	if(auditoriaClasif == 2){
	    $("#tdResultRes").html("Ver Hallazgos");
	}
	var evalAMAid = 0;
	var estadoImpl = parseInt( $("#selEvalAudiRes").val() );
	if(estadoImpl == 1){
		evalAMAid = $("#selEvalAMAAudiRes").val();
	}else{
		evalAMAid=0;
	}
	var listContratista = $("#selMultipleContratistaFiltroInspLibre").val();
	var listContratistaId = [];
	if(listContratista != null){
	    listContratista.forEach(function(val){
		listContratistaId.push(parseInt(val));
	    });
	}
	var dataParamAudi = {
			idCompany : getSession("gestopcompanyid"),
			listContratistaId : (listContratistaId.length == 0?null:listContratistaId),
			estadoImplementacion : (estadoImpl == -2?null:estadoImpl),
			estadoEvaluacionAMA:(evalAMAid==0?null:evalAMAid),
			auditoriaClasifId : auditoriaClasif,
			isInforme : 1,
			fechaInicioPresentacion:$("#fechaInicioResFinalAudi").val(),
			fechaFinPresentacion:$("#fechaFinResFinalAudi").val()
		};
	
	callAjaxPost(URL + '/auditoria', dataParamAudi,
			function(data){
		$("#tblResFinalAudi tbody tr").remove();
		listTipoEvaluacionGeneral=data.tipo_evaluacion;
		listTipoEvaluacionGerencia=data.tipo_evaluacion_gerencia;
		listFullAuditoriaResumenFinal=data.list;
		listFullAuditoriaResumenFinal.forEach(function(val,index){
			var rptaSi=val.rptaSi;
			var rptaParc=val.rptaParcial;
			var rptaNo=val.rptaNo;
			var rptaRP=val.rptaRP;
			var puntaje=rptaSi*1+rptaParc*0.5+rptaRP*0.75+rptaNo*0;
			var puntajeMax=rptaSi+rptaParc+rptaRP+rptaNo;
			var textEvi="---";
			if(val.evidenciaNombre != '---'){
				var textSuspensivo="";
				if(val.evidenciaNombre.length > 12){
					textSuspensivo="...";
				}
				textEvi="<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/evidencia?auditoriaId="+val.auditoriaId+"'>"
					+"<i class='fa fa-download'></i>"
					+val.evidenciaNombre.substr(0,12)+textSuspensivo+"</a>"
					 ;
			};
			var celdaResultado="<td  style='color:"+
			colorPuntaje(val.puntajePonderado)+";font-weight:bold'>"
			+ pasarDecimalPorcentaje(val.puntajePonderado,2) 
			+"<br> ("+puntajeMax+" / "+val.numPreguntas +")" +
					"<br><br><a  onclick='elegirAuditoriaResumen("+index+");getInformeExcelAuditoriaProyecto()' " +
						"class='efectoLink'><i class='fa fa-list'></i>Ver Informe Excel</a></td>"+
			"" ;
			var textAcciones="<a class='efectoLink' onclick='elegirAuditoriaResumen("+index+");verModalAccionesAsociadasAuditoria()'>"
			+val.accionesDirectasTotal+"</a>";
			
			var textAccSinObs,DivisionValores,PorcentajeAccSinObs;
			
			if(auditoriaClasif == 2){
				celdaResultado ="<td>"+val.numHallazgos+
				"<br><a  onclick='elegirAuditoriaResumen("+index+");getInformeWebAuditoriaProyecto()' " +
						"class='efectoLink'><i class='fa fa-list'></i>Ver Informe </a>"+"</td>";
				textAcciones="<a class='efectoLink' onclick='elegirAuditoriaResumen("+index+");verModalAccionesAsociadasInspecciones()'>"+
					val.numAccionesCompletasHallazgoProyecto+"/"+val.numAccionesHallazgoProyecto+"</a>";
				
				if(val.numAccionesHallazgoProyecto !=0){
				        textAccSinObs=""+val.numAccionesHallazgoProyectoSinObservacion+"/"+val.numAccionesHallazgoProyecto+""; 
				        DivisionValores= val.numAccionesHallazgoProyectoSinObservacion/val.numAccionesHallazgoProyecto; 
				        PorcentajeAccSinObs=pasarDecimalPorcentaje(DivisionValores);
				}else{
				        textAccSinObs="0/0";
				        PorcentajeAccSinObs="0%"
				}
			}
			
			var btnNotificar = "<br><a onclick='notificarAuditoriaContratistaResumen("+val.auditoriaId+")'" +
					"class='efectoLink' onclick=''><i class='fa fa-envelope-o'></i> Notificar contratista</a>";
			if(val.evaluacionGerencia.id != 1){
			    btnNotificar="";
			}
			if(val.evaluacionGerencia.id == 1 && val.evaluacion.id == 1){
			    btnNotificar=""; 
			}
			var btnInformeGosst = crearButtonExcel( "/contratista/auditoria/informe?auditoriaId="+ val.auditoriaId+"&auditoriaNombre="+val.auditoriaNombre);
			var btnInformeAudiGosst= crearButtonExcel("/contratista/auditoria/detalle/excel?id="+ val.auditoriaId +"&tipoId="+val.auditoriaTipo+"&auditoriaNombre="+val.auditoriaNombre);
			var btnDescargaFinal = "";
			if(val.auditoriaTipo == 94){
			    btnDescargaFinal = btnInformeGosst
			}else{
			    btnDescargaFinal = btnInformeAudiGosst;
			}
		$("#tblResFinalAudi tbody")
		.append("<tr>" +
			  // "<td>"+val.nroCaso+"</td>" + 
			     "<td>"+val.auditoriaNombre+"</td>" +
			     "<td>"+val.auditoriaFechaTexto+" ("+val.horaPlanificadaTexto+")</td>" +
			     "<td>"+val.contratistaNombre+"</td>" +
			     "<td>"+val.proyecto.titulo+"</td>" +
			     "<td>"+val.trabajador.nombre+"</td>" +
			     celdaResultado+
			     "<td>"+textEvi+"</td>"+
			     "<td>" +val.evaluacionGerencia.icono+
				  "<a class='efectoLink' onclick='elegirAuditoriaResumen("+index+");validarAuditoriaGerencia(1)'>"+
				      val.evaluacionGerencia.nombre+"</a>" +
				      "<br>("+val.usuarioGerencia.userName+")</td>" +
			     "<td>"+(val.fechaNotificarTexto=="Sin Notificar"?"<span style='color: red; font-weight: bold;'>"+val.fechaNotificarTexto+"</span>"
					                                     :"<span style='color: green; font-weight: bold;'>"+val.fechaNotificarTexto+"</span>") +
		                  "<br>"+(val.contratistaContacto==null?" ":"- "+val.contratistaContacto+" -")+
				  "<br>"+(val.vistoContratista==0?"<span style='color: red; font-weight: bold;'>- Sin revisar por contratista - </span>":
					     "<span style='color: green; font-weight: bold;'>- Revisado por contratista - </span>")+btnNotificar+"</td>" +
			     "<td>"+textAcciones+"</td>" +
			     "<td>"+btnDescargaFinal+"</td>" +
			     "<td>"+val.evaluacion.icono+
				  "<a class='efectoLink' onclick='elegirAuditoriaResumen("+index+");validarAuditoriaResponsable(1)'>" +
				  val.evaluacion.nombre+"</a>" +"<br>("+val.trabajador.nombre+")</td>" +
			     "<td>"+val.evaluacion.fechaTexto+"</td>" +
			     "<td>"+textAccSinObs+" ("+PorcentajeAccSinObs+")</td>" + 
			  "</tr>")	
		});
		goheadfixedY("#tblResFinalAudi","#wrapResumAudiFinal")
		
	});
}
function notificarAuditoriaContratistaResumen(pauditoriaId){
	callAjaxPost(URL + '/auditoria/notificar', {auditoriaId:pauditoriaId},
			function(data){
		if(data.CODE_RESPONSE=="05"){
			alert("Se notifico al contratista "+data.contratista.nombre+" al correo " +
					data.contratista.contactoCorreo+". Revise el signo de admiración en la vista " +
							"de proyectos para ver si el contratista toma acciones.")
		}else{
			alert("No se pudo notificar al contratista, correo no válido")
		}
		cargarResumenAuditoriaFinal();
		
	});
}
function getInformeWebAuditoriaProyecto(){
	$("#modalResHallazgo").modal("show");
	
	var dataParam = {
			
			auditoriaId : auditoriaId
		};
		
		callAjaxPost(URL + '/auditoria/hallazgos', dataParam,
				function(data){
			
			$("#tblHallazgoResumenFinal tbody tr").remove();
			var isCompleto = true;
			data.list.forEach(function(val){
				$("#tblHallazgoResumenFinal tbody").append(
						"<tr >"

						+ "<td>" + val.descripcion + "</td>"
						+ "<td>" + val.tipoReporte.nombre + "</td>"						
						+ "<td>" + val.nivel.nombre + "</td>"

						+ "<td>" + val.factor.nombre + "</td>"
						
						+ "<td>" + val.causa
						+ "</td>" 
						+ "<td>" + val.lugar
						+ "</td>" 
												
						+ "<td >" + val.seccionesNombre
						+ "</td>" 
						 
						+ "<td  >"
						+ (isCompleto?(val.evidenciaNombre=="----"?"Sin registrar":"<a class='efectoLink' target='_blank' href='"+URL+"/auditoria/hallazgo/evidencia?hallazgoId="+val.id+"'  >" +
								"<i class='fa fa-download'></i>"+val.evidenciaNombre+"</a>"):val.evidenciaNombre)+"</td>"
						+ "</tr>"
				
				);
			});
			
			
		});
}