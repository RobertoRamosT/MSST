/**
 * 
 */
var listFullProyectosTrabajador = [];
var listEvaluacionEvaDocProCol = [];
var listTipoActividades = [];

var indexFunction = 0;

function toggleMenuOpcionContratista(obj,pindex,menu){
   indexFunction = pindex;
   $(obj).parent("#opciones"+menu).find("ul").toggle();
   $(obj).parent("#opciones"+menu).siblings().find("ul").hide();
}

var funcionalidadesContratista=[
   //Status
   {menu:"status",
    opcion:[{ 
       id:"opcEvalDocumentos",nombre:"<i class='fa fa-table'></i> Consolidado Evaluación general",
       functionClick:function(data){verConsolidadoEvaluacionDocumentosProyectoVisCol(indexFunction)}}]
      // {id:"opcCargar",nombre:"<i class='fa fa-refresh' ></i> Cargar Status Documentos",
      //  functionClick:function(data){cargarStatusDocumentosProyectoColaborador(indexFunction);}}]
   },
   //Trabajadores
   {menu:"trabajador",
    opcion:[{
       id:"opcProyectoTrabAsig",
       nombre:"<i class='fa fa-file-o' aria-hidden='true'></i> Consolidado Proyecto - Trabajadores",
       functionClick:function(data){consolidadoProyectoFijoExamenesTrabajadores();}},
      {id:"opcTrabajadorAsig",nombre:"<i class='fa fa-table' aria-hidden='true'></i> Ver resumen",
       functionClick:function(data){verTablaResumenTrabProyecto(indexFunction);}}]
   },
   //Observacion
   {menu:"obs",
    opcion:[{
       id:"opcVer",nombre:"<i class='fa fa-eye' ></i> Ver Reporte",
       functionClick:function(data){verCompletarObsColaborador(indexFunction);
                                    $("#opcOcultarobs").show();$("#opcVerobs").hide();}},
      {id:"opcOcultar",nombre:"<i class='fa fa-eye-slash' ></i> Ocultar Reporte",
       functionClick:function(data){verCompletarObsColaborador(indexFunction); 
                                    $("#opcVerobs").show();$("#opcOcultarobs").hide();}},
      {id:"opcAgregar",nombre:"<i class='fa fa fa-plus' ></i> Agregar Reporte",
       functionClick:function(data){nuevaObservacionProyectoColaborador(indexFunction);}}]
   },
   //Incidentes
   {menu:"inci",
    opcion:[{
       id:"opcVer",nombre:"<i class='fa fa-eye' ></i> Ver Reporte",
       functionClick:function(data){verCompletarIncidenteColaborador(indexFunction); 
                                    $("#opcOcultarinci").show();$("#opcVerinci").hide();}},
      {id:"opcOcultar",nombre:"<i class='fa fa-eye-slash' ></i> Ocultar Reporte",
       functionClick:function(data){verCompletarIncidenteColaborador(indexFunction); 
                                    $("#opcVerinci").show();$("#opcOcultarinci").hide();}},
      {id:"opcAgregar",nombre:"<i class='fa fa fa-plus' ></i> Agregar Reporte",
       functionClick:function(data){nuevoIncidenteProyectoColaborador(indexFunction);}}]
   },
   //Inspecciones
   {menu:"insp",
    opcion:[{
       id:"opcVer",nombre:"<i class='fa fa-eye' ></i> Ver Reporte",
       functionClick:function(data){verCompletarInspeccionColabGenral(indexFunction,data); 
                                    $("#opcOcultarinsp").show();$("#opcVerinsp").hide();}},
      {id:"opcOcultar",nombre:"<i class='fa fa-eye-slash' ></i> Ocultar Reporte",
       functionClick:function(data){verCompletarInspeccionColabGenral(indexFunction,data); 
                                    $("#opcVerinsp").show();$("#opcOcultarinsp").hide();}}]
   },
   //Auditorias
   {menu:"audi",
    opcion:[{
       id:"opcVer",nombre:"<i class='fa fa-eye' ></i> Ver Reporte",
       functionClick:function(data){verCompletarAuditoriaColabGenral(indexFunction,data); 
                                    $("#opcOcultaraudi").show();$("#opcVeraudi").hide();}},
      {id:"opcOcultar",nombre:"<i class='fa fa-eye-slash' ></i> Ocultar Reporte",
       functionClick:function(data){verCompletarAuditoriaColabGenral(indexFunction,data); 
                                    $("#opcVeraudi").show();$("#opcOcultaraudi").hide();}}]
   }
];

function marcarSubOpcionContratista(pindex,pindex1,pidAux){
   $("#opcionesstatus .listaGestionGosst").hide();  
   $("#opcionestrabajador .listaGestionGosst").hide();
   $("#opcionesobs .listaGestionGosst").hide(); 
   $("#opcionesinci .listaGestionGosst").hide(); 
   $("#opcionesinsp .listaGestionGosst").hide(); 
   $("#opcionesaudi .listaGestionGosst").hide(); 
   funcionalidadesContratista[pindex].opcion[pindex1].functionClick(pidAux);
}

var menuOpcionContratista=[];

function ListarOpciones(){ 
   funcionalidadesContratista.forEach(function(val1,index1){
      var menu = val1.menu;
      var opciones = val1.opcion;
			
      menuOpcionContratista[index1] = "<ul class='list-group listaGestionGosst' style='width:155px;top:25px;display:none;'>";
         opciones.forEach(function(val2,index2){
	    if(val2.id == ("opcOcultar")){
	       menuOpcionContratista[index1]+=
	          "<li id='"+val2.id+menu+"' class='list-group-item' style='display:none;text-align:left;' " +
	              "onclick='marcarSubOpcionContratista("+index1+","+index2+")'>"+val2.nombre+"</li>"
	    }else{
	       menuOpcionContratista[index1]+=
	          "<li id='"+val2.id+menu+"' class='list-group-item' style='text-align:left;' " +
	              "onclick='marcarSubOpcionContratista("+index1+","+index2+")'>"+val2.nombre+"</li>"
	    }
         });
			
      menuOpcionContratista[index1]+="</ul>";
   });	 
}

function ocultarFiltroStatusDocumentoProyColaborador(){
   $("#modalFiltroEvaDocProyectoCol").modal("hide");
}

function verFiltroStatusDocumentoProyColaborador(){
   $("#modalFiltroEvaDocProyectoCol").modal("show");
}

function filtroStatusDocumentoProyColaborador(functionCallBack,pproyectoId,ptipoId,pidAux){
   var dataParam={
      empresaId: getSession("gestopcompanyid")
   }; 
   	
   callAjaxPost(URL+'/contratista/proyectos/vista_trabajador/filtro',dataParam,function(data){
      listEvaluacionEvaDocProCol = data.listEvaluacion;
      
      listEvaluacionEvaDocProCol.forEach(function(val){
         if([3,4,5,6].includes(val.id)){
            val.selected = 1;
         }    
      });
      
      var contenido = "";
   				
      var listContenido=[
   	 {sugerencia:"",label:"Estado de la evaluación",inputForm:"",
          divContainer:"divFiltroEstadosEvaluacionEvaDocProCol"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
   	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' " +
          		"onclick='ocultarFiltroStatusDocumentoProyColaborador()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
   	  inputForm:"<button id='btnAplicarFiltroEvaDocProCol' class='btn btn-success' type='submit' " +
   	      		    "onclick='habilitarProyectosContratistaUsuario("+pproyectoId+","+ptipoId+","+pidAux+")' " +
   	      		    "style='float:right;'>" +
   	               "<i class='fa fa-filter'></i> Aplicar filtro" +
   	      	    "</button>"},
      ];
   				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   				
      var modalOptionsEvaDocPro={
  	 id: "modalFiltroEvaDocProyectoCol",
  	 nombre: "<i class='fa fa-filter'></i> Filtros",
   	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
   				
      crearModalPrincipalUsuario(modalOptionsEvaDocPro,function(){
         if($("#filtroEstadosEvaluacionEvaDocProCol").length > 0){
   	    return;
         }
           
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionEvaDocProCol","",listEvaluacionEvaDocProCol,
            "id","nombre","#divFiltroEstadosEvaluacionEvaDocProCol","Todos");
      },false);
   				
      $("#btnAplicarFiltroEvaDocProCol").on("click",function(){
	 ocultarFiltroStatusDocumentoProyColaborador();
      });
   	
      $("#modalFiltroEvaDocProyectoCol").modal("hide");
      functionCallBack(pproyectoId,ptipoId,pidAux);
   });
}

function habilitarProyectosContratistaUsuario(pproyectoId,ptipoId,pidAux){ 
   $(".divListPrincipal").html("");
   ListarOpciones();
   
   var trabajadorId = getSession("trabajadorGosstId");
   
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),responsable: {trabajadorId:trabajadorId}
   };
   
   callAjaxPost(URL+'/contratista/proyectos/vista_trabajador',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var listPanelesPrincipalVigente = [],listPanelesPrincipalNoVigente = [];
	    var hoy = obtenerFechaActualNormal();
	    
	    data.proyectos.sort(function(a,b){
	       return a.notaFinal - b.notaFinal;
	    });
	     
	    listFullProyectosTrabajador = data.proyectos;
	    listFullProyectoSeguridad = data.proyectos;
	    listTipoActividades = data.listTipoActividades;
	    listEvaluacionStatusTotal = data.tipo_evaluacion;
			
	    listFullProyectosTrabajador.forEach(function(val,index){
	       var tipoProyecto = 0;
	       var condicionAgregar = 
		  (tipoProyecto == 4?val.postulante.asignacion != 1:
		                     (val.estado.id == tipoProyecto && val.postulante.asignacion == 1));
	       condicionAgregar = true;
				
	       if(condicionAgregar){
		  var textoAsignacion=(val.postulante.asignacion == 1?"(Asignado)":"(No asignado)");
		  var textoBoton="",textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="",textoBotonAct5="",
		      textoBotonAudi="",textoBotonInsp="",textoBotonTrab,textoBotonObs="",textoBotonObsContr="",
		      textoBotonForm="",textoBotonInci="",textoBotonInduccion="",textoBotonIperc="",textoBotonStatus="";
					 
		  if(val.postulante.estado.id == 1){
		     textoBoton = "Desde: "+val.postulante.fechaPlanificadaTexto;
		  }
					
		  if(val.postulante.estado.id == 2){
		     textoBoton = 
		        "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
		        "<button class='btn btn-success' style='padding:5px' " +
				"onclick='verCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
		           "<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver" +
		        "</button>";
		  }
					
		  if(val.postulante.estado.id == 3){
		     textoBoton =
		        "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
		        "<button class='btn btn-success' style='padding:5px' " +
				"onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
		           "<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver" +
		        "</button>";
		  }
					
		  alterarTextoBoton();
					
		  if(true){
		     textoBotonObs = 
		        "<div classs='row'>" +
			   "<section id='opcionesobs' class='col col-xs-12'>" +
			      "<a class='efectoLink btn-gestion' " +
				 "onclick='toggleMenuOpcionContratista(this,"+index+",\"obs\")'>" +
			         "Ver Opciones" +
			         "<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[2] +
		           "</section>" +
		        "</div>";
					 
		     textoBotonStatus = 
		        "<div classs='row'>" +
			   "<section id='opcionesstatus' class='col col-xs-12'>" +
		              "<a class='efectoLink btn-gestion' " +
				 "onclick='toggleMenuOpcionContratista(this,"+index+",\"status\")'>" +
			         "Ver Opciones" +
			         "<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[0] +
			   "</section>" +
		        "</div>";
		      
		     textoBotonTrab = 
		        "<div classs='row'>" +
		           "<section id='opcionestrabajador' class='col col-xs-12'>" +
			      "<a class='efectoLink btn-gestion' " +
				 "onclick='toggleMenuOpcionContratista(this,"+index+",\"trabajador\")'>" +
				 "Ver Opciones" +
			         "<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[1] +
			   "</section>" +
			"</div>";
						
		     textoBotonAudi = 
		        "<div classs='row'>" +
		           "<section id='opcionesaudi' class='col col-xs-12'>" +
			      "<a class='efectoLink btn-gestion' " +
				 "onclick='toggleMenuOpcionContratista(this,"+index+",\"audi\")'>" +
				 "Ver Opciones" +
				 "<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[5] +
			   "</section>" +
		        "</div>";
						
		     textoBotonInsp = 
		        "<div classs='row'>" +
		           "<section id='opcionesinsp' class='col col-xs-12'>" +
			      "<a class='efectoLink btn-gestion' " +
			         "onclick='toggleMenuOpcionContratista(this,"+index+",\"insp\")'>" +
			         "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[4] +
			   "</section>" +
		        "</div>";
						
		     textoBotonInci = 
		        "<div classs='row'>" +
			   "<section id='opcionesinci' class='col col-xs-12'>" +
	                      "<a class='efectoLink btn-gestion' " +
				 "onclick='toggleMenuOpcionContratista(this,"+index+",\"inci\")'>" +
				 "Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
			      "</a>"+menuOpcionContratista[3] +
			   "</section>" +
		        "</div>"; 
		  }
					
		  if(val.estado.id == 2){
		     textoBoton = 
		        "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
		        "<button class='btn btn-success' style='padding:5px' " +
		                "onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
		           "<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver" +
		        "</button>"; 
		  }
					
		  if(val.estado.id == 3){
		     textoBoton = 
			"Hasta: "+val.postulante.fechaRealTexto+"<br>"+
			"<button class='btn btn-success' style='padding:5px' " +
				"onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
			   "<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver" +
			"</button>";
		         textoBotonTrab="";textoBotonAct1="",textoBotonAct2="",textoBotonAct3="",textoBotonAct4="";
		         textoBotonAudi="";textoBotonInsp="";textoBotonObs="",textoBotonObsContr="";textoBotonForm="";
		         textoBotonInci="";textoBotonInduccion="",textoBotonIperc="";textoBotonStatus="";
		  } 
					
		  var filasRelevantesProyecto="" +
		     "<tr title='Status de documentos' id='trStatusColab"+val.id+"'>" +
		        "<td>"+
		           "<i aria-hidden='true' class='fa fa-eye'></i> Status de documentos"+"" +
			   "<div class='barraIndicadorProyecto'></div>" +
			"</td>" + 
			"<td class='celdaIndicadorProyecto col col-xs-5'></td>" +
			"<td class='celdaBotonAccion'>"+textoBotonStatus+"</td>"+
		     "</tr>" +
		     "<tr class='detalleStatusDocColaborador'></tr>"+
		     
		     "<tr title='Trabajadores Asignados' id='trTrabProyecto"+val.id+"'>" +
		        "<td>"+
		           "<i aria-hidden='true' class='fa fa-sort-amount-asc'></i> Trabajadores Asignados"+"" +
			   "<div class='barraIndicadorProyecto' " +
				"style='width:"+pasarDecimalPorcentaje(val.postulante.indicadorTrabajadoresDecimal)+";" +
				       "background-color:"+colorPuntajeGosst(val.postulante.indicadorTrabajadoresDecimal)+"'>" +
		           "</div>" +
		        "</td>" + 
			"<td class='celdaIndicadorProyecto'>"+val.postulante.indicadorTrabajadores+"</td>" +
			"<td>"+textoBotonTrab+"</td>"+
		     "</tr>" +
		     "<tr class='detalleTrabajadoresProyecto'></tr>"+
		      
		     "<tr title='Reportar Observación' id='trObsColab"+val.id+"'>" +
		        "<td>"+
		           "<i aria-hidden='true' class='fa fa-eye'></i> Reportar Observación"+"" +
			   "<div class='barraIndicadorProyecto' " +
				"style='width:"+pasarDecimalPorcentaje(val.postulante.indicadorObservacionesDecimal)+";" +
				       "background-color:"+colorPuntajeGosst(val.postulante.indicadorObservacionesDecimal)+"'>" +
			   "</div>" +
			"</td>" + 
			"<td class='celdaIndicadorProyecto'>"+val.postulante.indicadorObservaciones+"</td>" +
			"<td>"+textoBotonObs+"</td>"+
	             "</tr>" +
		     "<tr class='detalleObservacionesColaborador'></tr>"+
		     
		     "<tr title='Ver Incidentes'>" +
		        "<td>"+
		           "<i aria-hidden='true' class='fa fa-warning'></i> Ver Incidentes"+"" +
			   "<div class='barraIndicadorProyecto' " +
				"style='width:"+pasarDecimalPorcentaje(val.postulante.indicadorIncidentesDecimal)+";" +
				       "background-color:"+colorPuntajeGosst(val.postulante.indicadorIncidentesDecimal)+"'>" +
			   "</div>" +
			"</td>" + 
			"<td>"+val.postulante.indicadorIncidentes+"</td>" +
			"<td>"+textoBotonInci+"</td>"+
		     "</tr>" + 
		     "<tr class='detalleIncidentesProyecto'></tr>";
		     
//		     "<tr title='Realizar Inspecciones'>" +
//		        "<td>"+
//		           "<i aria-hidden='true' class='fa fa-check-square-o'></i> Realizar Inspecciones  "+"" +
//			   "<div class='barraIndicadorProyecto' " +
//				"style='width:"+pasarDecimalPorcentaje(val.postulante.indicadorHallazgosDecimal)+" ;" +
//				       "background-color:"+colorPuntajeGosst(val.postulante.indicadorHallazgosDecimal)+"'>" +
//		           "</div>" +
//		        "</td>" + 
//			"<td>"+val.postulante.indicadorHallazgos+"</td>" +
//			"<td>"+textoBotonInsp+"</td>"+
//	             "</tr>" +
//		     "<tr class='detalleInspeccionProyecto'></tr>"+
//		     
//		     "<tr title='Realizar Auditorías'>" +
//		        "<td>"+
//		           "<i aria-hidden='true' class='fa fa-check-square-o'></i> Realizar Auditorías  "+"" +
//			   "<div class='barraIndicadorProyecto' " +
//				"style='width:"+pasarDecimalPorcentaje(val.postulante.indicadorAuditoriaGeneralDecimal)+" ;" +
//					"background-color:"+colorPuntajeGosst(val.postulante.indicadorAuditoriaGeneralDecimal)+"'>" +
//			   "</div>" +
//			"</td>" + 
//			"<td> "+
//			    val.postulante.indicadorAuditoriaGeneral+
//			"</td>" +
//			"<td>"+textoBotonAudi+"</td>"+
//		     "</tr>" +
//		     "<tr class='detalleAuditoriasProyecto'></tr>"+"";
					
		  var puntajeProyecto = 0.0;
		  
		  puntajeProyecto=
		     val.postulante.indicadorDocumentosDecimal+val.postulante.indicadorFormacionesDecimal+
		     val.postulante.indicadorActividadesDecimal1+val.postulante.indicadorActividadesDecimal2+
		     val.postulante.indicadorActividadesDecimal3+val.postulante.indicadorActividadesDecimal4+
		     val.postulante.indicadorObservacionesDecimal+val.postulante.indicadorAuditoriaGeneralDecimal+
		     val.postulante.indicadorIncidentesDecimal+val.postulante.indicadorTrabajadoresDecimal +
		     val.postulante.indicadorIpercDecimal; 
		                   
		  puntajeProyecto=puntajeProyecto/11;
					
		  switch(tipoProyecto){
		     case 1:
			break;
		      
		     case 4:
			puntajeProyecto=val.postulante.indicadorDocumentosDecimal;
			filasRelevantesProyecto="";
			break;
		  }
					
		  var descripcionProy=
		     "<div class='eventoGeneral'>" +
		        "<div id='tituloEvento'>" +
			   "<table class='table table-movil' id='proyectoTable"+val.id+"'>" +
			      "<tbody>" +
			         "<tr>" +
				    "<td>"+"<i aria-hidden='true' class='fa fa-user'></i> Contratista"+"</td>" + 
				    "<td colspan='2'>"+val.contratistaNombre+"</td>" + 
				 "</tr>" +
				 "<tr>" +
				    "<td>"+"<i aria-hidden='true' class='fa fa-hourglass-start'></i> Fecha Inicio"+"</td>" + 
				    "<td colspan='2'>  "+val.fechaInicioTexto+ "</td>" +
				 "</tr>" +
				 "<tr>" +
				    "<td>"+"<i aria-hidden='true' class='fa fa-hourglass-end'></i> Fecha Fin"+"</td>" + 
				    "<td colspan='2'>"+val.fechaFinTexto+"</td>" + 
				 "</tr>" +
				 "<tr>" +
				    "<td>"+"<i aria-hidden='true' class='fa fa-info'></i> Descripción"+"</td>" + 
				    "<td colspan='2'>"+val.descripcion+" </td>" + 
				 "</tr>" +
				  filasRelevantesProyecto+
			      "</tbody>" +
			   "</table>"+ 
			"</div>"+
		     "</div>";
					
		  var iconoAlerta="";
				
		  if(val.hasNotificacionPrograma == 1 || val.hasNotificacionPlan == 1 || 
		     val.hasNotificacionResiduo == 1 || val.hasNotificacionDocumento == 1 || 
		     val.hasNotificacionObservacionContratista == 1 || val.hasNotificacionIncidente == 1 || 
		     val.hasNotificacionAuditoria == 1 || val.hasNotificacionInspeccion == 1 || 
		     val.hasNotificacionIperc == 1){
		     iconoAlerta = "<i style='color:red;font-size:1.2em;' class='fa fa-exclamation-circle'></i>";
		  }
				
		  if(restaFechasNormales(hoy,val.fechaFinTexto) > 0){
		     listPanelesPrincipalVigente.push({
			id:"pro"+val.id,
			clase:"divProyectoGeneral",
			proyectoId:val.id,
			nombre:iconoAlerta+""+val.titulo+" (Contratista: "+val.contratistaNombre+")" +
			                                 " ("+pasarDecimalPorcentaje(val.notaFinal)+")",
			contenido:descripcionProy});
		  }else{
		     listPanelesPrincipalNoVigente.push({
	                id:"pro"+val.id,
			clase:"divProyectoGeneral",
			proyectoId:val.id,
			nombre:iconoAlerta+""+val.titulo+" (Contratista: "+val.contratistaNombre+")" +
			                                 " ("+pasarDecimalPorcentaje(val.notaFinal)+")",
			contenido:descripcionProy});
		  }
	       }
	    });
			
	    $(".divTituloFull h4").append(" - "+(listPanelesPrincipalVigente.length+
		                                 listPanelesPrincipalNoVigente.length)+" proyecto(s) ");
	    
	    // ****************************** OPCIONES **************************
            var listPanelesAux = [];
            
            var btnFiltro = 
               "<button type='button' class='btn btn-success' style='font-size:19px;float:right;' " +
                       "onclick='verFiltroStatusDocumentoProyColaborador()' title='Ver valores del filtro para aplicarlo a los registros de documentos.'>" +
                  "<i class='fa fa-2x fa-filter'></i>" +
               "</button>";
            
            var btnConsulta = 
               "<button type='button' style='font-size:19px;float:right;margin-right:5px;' class='btn btn-info' " +
                       "onclick='verPerfilesInformacionVistaConsulta()' title='Mostrar la vista consulta.'>"+
                  "<i class='fa fa-2x fa-book'></i> <i class='fa fa-search'></i>" +
               "</button>";

            listPanelesAux.push({
 	       id:"infoMovilFormularioCovid",clase:"",styleAux:"display:none",buttonAd:btnFiltro+btnConsulta,nombre:"Opciones"
 	    });

 	    agregarPanelesDivPrincipalVersionDosSinContenido(listPanelesAux);
	     
	    // ****************************** Proyecto(s) en curso **************************
	    $(".divListPrincipal")
	    .append("<div id='proVigentes' class='divProyectoGeneral'>" +
		       "<div class='tituloSubList'></div>" +
		    "</div>");
	     
	    $("#proVigentes").find(".tituloSubList")
	    .html("<i class='fa fa-book'></i> " +
	     	  "<label style='color:green;'>Proyectos en curso ("+listPanelesPrincipalVigente.length+")</label>"); 
	     
	    //*******************************************************************************
	     
	    agregarPanelesDivPrincipalColaborador(listPanelesPrincipalVigente);
	     
	    // ************************** Proyecto(s) finalizado(s) *************************
	    $(".divListPrincipal")
	    .append("<div id='proFinalizados' class='divProyectoGeneral'>" +
		       "<div class='tituloSubList'></div>" +
		    "</div>");
	     
	    $("#proFinalizados").find(".tituloSubList")
	    .html("<i class='fa fa-book'></i> " +
	     	  "<label style='color:red;'>Proyectos finalizados ("+listPanelesPrincipalNoVigente.length+")</label>"); 
	     
	    //*******************************************************************************
			
	    agregarPanelesDivPrincipalColaborador(listPanelesPrincipalNoVigente);
	    
	    if(pproyectoId > 0){
	       pproyectoId = parseInt(pproyectoId);
	       ptipoId = parseInt(ptipoId);
	       $("#pro"+pproyectoId).find(".contenidoSubList").show();
				
	       listFullProyectosTrabajador.forEach(function(val,index){
		  if(val.estado.id == 2){
		     if(val.id == pproyectoId){
			indexFunction=index;
			 
			if(ptipoId == 2){
			   marcarSubOpcionContratista(4,0,pidAux);
			}
							
			if(ptipoId == 3){
			   marcarSubOpcionContratista(5,0,pidAux);
			}
		     }
		  }
	       });
				
	       var el = $("#pro"+pproyectoId).find(".detalleInspeccionProyecto");
				
	       if(ptipoId == 3){
		  el = $("#pro"+pproyectoId).find(".detalleAuditoriasProyecto");
	       }
				
	       var bottom = el.position().top + el.outerHeight(true);
				
	       $(window).scrollTop(bottom);
	    }
			
	    var textObservacion = "";
			
	    var listItemsFormObservacion=[
	       {sugerencia:"",label:"Acción de mejora",inputForm:"",divContainer:"divDescAccColab"},
	       {sugerencia:"",label:"Fecha planificada",inputForm:"",divContainer:"divFechaAccColab"},
	       {sugerencia:"",label:"Observación del contratista",inputForm:"",divContainer:"divObsAccColab"},
	       {sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviAccionMejora"}, 
	       {sugerencia:"",label:"Fecha Realizada",inputForm:"",divContainer:"divFechaRealAccColab"},
	       {sugerencia:"Si está todo conforme, dejar en blanco",label:"Respuesta de cliente",
		inputForm:"<input class='form-control' id='inpuRespAccColaborador'>",divContainer:"divFechaRealAccColab"},
	       {sugerencia:"",label:" ",
		inputForm:"<button type='submit' class='btn btn-success'>" +
		     	     "<i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar" +
		     	  "</button>"} 
	    ];
	     
	    listItemsFormObservacion.forEach(function(val,index){
	       textObservacion+=obtenerSubPanelModulo(val); 
	    });
			
	    var listEditarPrincipal=[{
	       id:"editarMovilAccProyColab",
	       clase:"contenidoFormVisible",
	       nombre:""+"Editar Acción de mejora",
	       contenido:"<form id='formEditarAccionColab' class='eventoGeneral'>"+textObservacion+"</form>"}
	    ];
			
	    agregarPanelesDivPrincipalColaborador(listEditarPrincipal);
			
	    $(".contenidoFormVisible").hide();
			 
	    $('#formEditarAccionColab').on('submit',function(e){  
	       e.preventDefault();   
	       guardarAccionProyectoColaborador();
	    }); 
	     
	    break;
      }
   });
	
   $("#opcAudiOcultar").hide();
}

var listEstadoEvaDocPro=[
   {id:1,nombre:"Aprobado"},{id:2,nombre:"Desaprobado"},
   {id:3,nombre:"Pendiente",selected:1},{id:4,nombre:"Por re-evaluar",selected:1}
];

var countPushListEstRevDoc = 0;

var listFullActividades=[];
var listFullExamenes=[];
var listFullSubContratistas=[];
var listFullHojasVida=[],listFullAnalisisTrabajoSeguro=[];
var listFullPermisoTraAltRie = [];
var listFullOperadorEquipo=[];
var listFullEquiposMovilCertificado=[];
var listFullEquiposMovilMantenimiento=[];
var listFullDocumentosEquipIzaje=[],listFullDocNivelCond = [],listFullDocNivelVehMaq = [],listFullDocNivelEquHerr = [];

var hasEvalActualizadaProy,hasDocEliminadoProy;

function verConsolidadoEvaluacionDocumentosProyectoVisCol(indexProy){
   hasEvalActualizadaProy = 0,hasDocEliminadoProy = 0;
    
   proyectoObj = listFullProyectosTrabajador[indexProy];
   listEvaluacionTotal = listEvaluacionStatusTotal;
   $(".divContainerGeneral").hide();
   
   tituloAnteriorContratista = $(".divTituloGeneral h4").text();
   
   var buttonVolver = 
      "<button type='button' class='btn btn-success' style='margin-right:10px' " +
 	      "onclick='volverVistaMovil()'>" +
         "<i class='fa fa-2x fa-sign-out fa-rotate-180'></i>" +
      "</button>";
   
   var buttonGuardar = 
      "<button class='btn btn-success' onclick='guardarEvaluacionesDocumentosProyecto()' " +
	      "id='btnGuardarEvalsTotalProyectoVisCol' title='Guardar las evaluaciones realizadas a los registros.'>" +
         "<i class='fa fa-save fa-2x'></i>" +
      "</button>";
   
   $("body").append(
      "<div class='container-fluid' id='divEvaluacionTotalDocProyectoVisCol'>" +
          buttonVolver+buttonGuardar +
         "<div style='width:500px; float:right;display: inline-flex;'>" +
            "<label>Estados:</label>" +
            "<div id='divEstadoDocsProyEvaluarVisCol' style='width:400px;'></div>" +
         "</div>" +
         "<div class='wrapper' id='wrapEvalTotalDocProyVisCol'>" +
	    "<table class='table table-striped table-bordered table-hover fixed' " +
		   "id='tblEvalTotalDocProyVisCol' style='min-width:1000px;width:100%;table-layout:fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     // "<td class='tb-acc'  style='width:300px'>Descripción</td>" +
		     // "<td class='tb-acc' style='width:180px'>Se cargó el documento el</td>" +
		     // "<td class='tb-acc' style='width:140px'>Evidencia</td>" +
		     "<td class='tb-acc' style='width:380px'>Detalle</td>" +
		     "<td class='tb-acc' style='width:120px'>Evaluación</td>" +
		     "<td class='tb-acc' style='width:250px'>Última observación realizada</td>" +
		     "<td class='tb-acc' style='width:150px'>Fecha evaluación</td>" +
		     "<td class='tb-acc' style='width:100px'>¿Eliminar documento?</td>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody>" +
	       "</tbody>" +
	    "</table>" +
         "</div>" +
      "</div>");   
   
   resizeDivWrapper("wrapEvalTotalDocProyVisCol",190);
   
   if(parseInt(getSession("gestopcompanyid")) == 154 && countPushListEstRevDoc == 0){
      listEstadoEvaDocPro.push({id:5,nombre:"Por validar",selected:1});
      countPushListEstRevDoc++;
   } 	
      
   if(parseInt(getSession("gestopcompanyid")) == 285 && countPushListEstRevDoc == 0){
      listEstadoEvaDocPro.push({id:6,nombre:"Por validar",selected:1});
      countPushListEstRevDoc++;
   } 
      
   if(parseInt(getSession("gestopcompanyid")) == 272 && countPushListEstRevDoc == 0){
      listEstadoEvaDocPro.push({id:7,nombre:"Recibido"});
      countPushListEstRevDoc++;
   }   	
   
   if(parseInt(getSession("gestopcompanyid")) == 747 && countPushListEstRevDoc == 0) {
       listEstado.push({id:8,nombre:"Por validar",selected:1});countPushListEstRevDoc++;
   }
   
   crearSelectOneMenuObligMultipleCompleto("selEstadoDocEvalTotalVisCol","registrosEvaluacionTotalProyectoRevDocVisCol()",
      listEstadoEvaDocPro,"id","nombre","#divEstadoDocsProyEvaluarVisCol","",null);
	    
   $(".divTituloGeneral h4").text("Consolidado Evaluación general - proyecto "+proyectoObj.titulo);
   
   registrosEvaluacionTotalProyectoRevDocVisCol();
}

var mapTrabContratistaVerfIa;

function registrosEvaluacionTotalProyectoRevDocVisCol(){
   var listEvaluar=[
      {nombre:listTipoActividades[0].nombre,divTr:"trActTipo1",isHabilitado:proyectoObj.habilitadoActividad1},
      {nombre:"Plan de emergencia",divTr:"trActTipo2",isHabilitado:proyectoObj.habilitadoActividad2},
      {nombre:"Plan COVID 19",divTr:"trActTipo6",isHabilitado:proyectoObj.habilitadoActividad6},
      {nombre:"Matriz de Riesgo (IPERC)",divTr:"trActTipo7",isHabilitado:proyectoObj.habilitadoActividad7},
      {nombre:"Plan de manejo de residuos",divTr:"trActTipo4",isHabilitado:proyectoObj.habilitadoActividad4},
      {nombre:listTipoActividades[3].nombre+" Asociados al proyecto",divTr:"trActTipo5",isHabilitado:proyectoObj.habilitadoActividad5},
      {nombre:"Registro de capacitaciones efectuadas relacionados a los trabajos a realizar",divTr:"trActTipo10",isHabilitado:proyectoObj.habilitadoActividad10},
      {nombre:"Orden de compra o contrato firmado",divTr:"trActTipo11",isHabilitado:proyectoObj.habilitadoActividad11},
      {nombre:"Cronograma de trabajo",divTr:"trActTipo12",isHabilitado:proyectoObj.habilitadoActividad12},
      {nombre:"Programa de charlas diarias de seguridad",divTr:"trActTipo13",isHabilitado:proyectoObj.habilitadoActividad13},
      {nombre:"Procedimiento escrito de trabajo seguro (PETS)",divTr:"trActTipo14",isHabilitado:proyectoObj.habilitadoActividad14},
      {nombre:"Hoja MSDS",divTr:"trActTipo15",isHabilitado:proyectoObj.habilitadoActividad15},
      {nombre:"Instructivo de trabajo seguro para el trabajo en alto riesgo",divTr:"trActTipo16",isHabilitado:proyectoObj.habilitadoActividad16},
      {nombre:"Matriz de aspectos ambientales",divTr:"trActTipo18",isHabilitado:proyectoObj.habilitadoActividad18},
	   {nombre:"Memoria descriptiva",divTr:"trActTipo19",isHabilitado:proyectoObj.habilitadoActividad19},
	   {nombre:"Póliza de responsabilidad civil",divTr:"trActTipo20",isHabilitado:proyectoObj.habilitadoActividad20},
	   {nombre:"Póliza CAR",divTr:"trActTipo21",isHabilitado:proyectoObj.habilitadoActividad21},
	   {nombre:"Carta fianza",divTr:"trActTipo22",isHabilitado:proyectoObj.habilitadoActividad22},
	   {nombre:"Plan de rescate",divTr:"trActTipo23",isHabilitado:proyectoObj.habilitadoActividad23},
	   {nombre:"Plan de izaje",divTr:"trActTipo24",isHabilitado:proyectoObj.habilitadoActividad24},
	   {nombre:"Matriz de procesos y actividades",divTr:"trActTipo25",isHabilitado:proyectoObj.habilitadoActividad25},
	   {nombre:"Estructura de SST para el servicio",divTr:"trActTipo26",isHabilitado:proyectoObj.habilitadoActividad26},
	   {nombre:"Plan de contingencia",divTr:"trActTipo27",isHabilitado:proyectoObj.habilitadoActividad27},
	   {nombre:"Señalización de obras e instalaciones",divTr:"trActTipo28",isHabilitado:proyectoObj.habilitadoActividad28},
      {nombre:"Hoja de vida",divTr:"trHojaVida",isHabilitado:proyectoObj.habilitadoHojaVida},
       
      {nombre:(parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificados de aptitud médica"),divTr:"trExamTipo1",isHabilitado:proyectoObj.habilitadoCertAptMedica},
      {nombre:"SCTR",divTr:"trExamTipo2",isHabilitado:proyectoObj.habilitadoSctr},
      {nombre:"Cargo RISST",divTr:"trExamTipo4",isHabilitado:proyectoObj.habilitadoCargReglamento},
      {nombre:"T-Registro",divTr:"trExamTipo6",isHabilitado:proyectoObj.habilitadoTRegistro},
      {nombre:"EPP",divTr:"trExamTipo8",isHabilitado:proyectoObj.habilitadoEpp},
      {nombre:"Inducciones SST de la contratista",divTr:"trExamTipo23",isHabilitado:proyectoObj.habilitadoInduccSstCont},
      {nombre:"Certificado de capacitación para trabajo de alto riesgo",divTr:"trExamTipo15",isHabilitado:proyectoObj.habilitadoConstanciaAltoRiesgo},
      {nombre:"Prevencionista", divTr:"trExamTipo14",isHabilitado:proyectoObj.habilitadoPrevencionista},
      {nombre:"Certificados policiales",divTr:"trExamTipo43",isHabilitado:proyectoObj.habilitadoCertifPolicial},
      {nombre:"Prueba COVID-19",divTr:"trExamTipo25",isHabilitado:proyectoObj.habilitadoPruebaCovid},
      {nombre:"Vacuna COVID-19",divTr:"trExamTipo34",isHabilitado:proyectoObj.habilitadoVacunaCovid},
      {nombre:"Antecedentes penales",divTr:"trExamTipo60",isHabilitado:proyectoObj.habilitadoAntecedentesPenales},
      {nombre:"Seguro contra accidentes",divTr:"trExamTipo61",isHabilitado:proyectoObj.habilitadoSeguroAccidentes},
      {nombre:"Riesgo de exposición al puesto de trabajo",divTr:"trExamTipo63",isHabilitado:proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo},
      {nombre:"Vacunación COVID-19",divTr:"trExamTipo64",isHabilitado:proyectoObj.habilitadoVacunacionCovid},
      {nombre:"Carnet de sanidad",divTr:"trExamTipo65",isHabilitado:proyectoObj.habilitadoCarnetSanidad},
      {nombre:"Acuerdo de seguridad y confidencialidad - equipos electrónicos",divTr:"trExamTipo72",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadEquElec},
      {nombre:"Evaluación toxicológica",divTr:"trExamTipo73",isHabilitado:proyectoObj.habilitadoEvaluacionToxicologica},
      {nombre:"Certificado único laboral",divTr:"trExamTipo74",isHabilitado:proyectoObj.habilitadoCertifUnicoLaboral},
      {nombre:"Antecedentes policiales",divTr:"trExamTipo75",isHabilitado:proyectoObj.habilitadoAntecedentesPoliciales},
      {nombre:"Declaración jurada o verificación del domicilio",divTr:"trExamTipo76",isHabilitado:proyectoObj.habilitadoDeclaracionVerifDomicilio},
      {nombre:"Dotación indumentaria",divTr:"trExamTipo77",isHabilitado:proyectoObj.habilitadoDotacionIndumentaria},
	   {nombre:"Habilitación médica por clínica",divTr:"trExamTipo79",isHabilitado:proyectoObj.habilitadoMedicoClinica},
	   {nombre:"Cargo RISST de la contratista",divTr:"trExamTipo84",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont84},
	   {nombre:"Cargo de recepción de IPERC",divTr:"trExamTipo89",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont89},
	   {nombre:"Seguro vida ley",divTr:"trExamTipo90",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont90},
	   {nombre:"Documento de identidad",divTr:"trExamTipo99",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont99},
	   {nombre:"Procedimiento o manual para trab. contratistas",divTr:"trExamTipo100",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont100},
	   {nombre:"Cargo de procedimiento de HS",divTr:"trExamTipo101",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont101},
	   {nombre:"Inducción SSOMA del cliente",divTr:"trExamTipo111",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont111},
	   {nombre:"Registro de capacitación en procedimiento de trabajo",divTr:"trExamTipo112",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont112},
	   {nombre:"Registro de difusión de política de seguridad del cliente",divTr:"trExamTipo113",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont113},
	   {nombre:"Registro de difusión de RISST del cliente",divTr:"trExamTipo114",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont114},
	   {nombre:"Capacitación en reporte de accidentes e incidentes (flujograma)",divTr:"trExamTipo115",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont115},
	   {nombre:"Difusión de IPERC, PETS y PETAR",divTr:"trExamTipo116",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont116},
	   {nombre:"Registro de capacitación por puesto de trabajo",divTr:"trExamTipo117",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont117},
	   {nombre:"Registro de capacitación de IPERC de la contratista",divTr:"trExamTipo118",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont118},
	   {nombre:"Capacitación de buenas prácticas de manipulación de alimentos",divTr:"trExamTipo119",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont119},
	   {nombre:"Título del profesional",divTr:"trExamTipo128",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont128},
	   {nombre:"Evidencia colegiatura habilitada",divTr:"trExamTipo129",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont129},
	   {nombre:"Registro nacional de especialidad",divTr:"trExamTipo130",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont130},
	   {nombre:"Constancia/Carnet SUCAMEC",divTr:"trExamTipo131",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont131},
	   {nombre:"Certificado capacitacion - BLS (Basic Life Support)",divTr:"trExamTipo132",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont132},
	   {nombre:"Certificado capacitacion - PHLS (Prehospital Trauma Life Support)",divTr:"trExamTipo133",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont133},
	   {nombre:"Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)",divTr:"trExamTipo134",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont134},
	   {nombre:"Difusión de plan de respuesta a emergencia del cliente",divTr:"trExamTipo140",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont140},
	   {nombre:"Charla de inducción SST y MA",divTr:"trExamTipo141",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont141},
	   {nombre:"Difusión y entrega de política de sostenibilidad del cliente",divTr:"trExamTipo142",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont142},
	   {nombre:"Difusión y entrega plan COVID-19",divTr:"trExamTipo143",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont143},
	   {nombre:"Capacitación en matriz IPERC",divTr:"trExamTipo144",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont144},
	   {nombre:"Capacitación en matriz IAAS",divTr:"trExamTipo145",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont145},
	   {nombre:"Capacitación en primeros auxilios",divTr:"trExamTipo146",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont146},
	   {nombre:"Capacitación en uso extintor",divTr:"trExamTipo147",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont147},
	   {nombre:"Capacitación en plan contingencia",divTr:"trExamTipo148",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont148},
	   {nombre:"Capacitación en procedimiento de trabajo",divTr:"trExamTipo149",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont149},
	   {nombre:"Capacitación en ATS",divTr:"trExamTipo150",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont150},
	   {nombre:"Capacitación en capacitación uso de EPP",divTr:"trExamTipo151",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont151},
	   {nombre:"Capacitación en manejo de insumos químicos - hojas MSDS",divTr:"trExamTipo152",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont152},
	   {nombre:"Capacitación en uso de herramientas manuales",divTr:"trExamTipo153",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont153},
	   {nombre:"Capacitación en procedimiento de señalización",divTr:"trExamTipo154",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont154},
	   {nombre:"IBT 1",divTr:"trExamTipo155",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont155},
	   {nombre:"IBT 2",divTr:"trExamTipo156",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont156},
	   {nombre:"IBT 3",divTr:"trExamTipo157",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont157},
	   {nombre:"IBT 4",divTr:"trExamTipo158",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont158},
	   {nombre:"IBT 5",divTr:"trExamTipo159",isHabilitado:proyectoObj.habilitadoExamNivelTrabCont159},
	          
      {nombre:"Acta de compromiso",divTr:"trExamTipo24",isHabilitado:proyectoObj.habilitadoActaCompromiso},
      {nombre:"Reglamento SST",divTr:"trExamTipo35",isHabilitado:proyectoObj.habilitadoReglamentoSst},
      {nombre:"Política SST",divTr:"trExamTipo36",isHabilitado:proyectoObj.habilitadoPoliticaSst},
      {nombre:"Plan anual SST",divTr:"trExamTipo37",isHabilitado:proyectoObj.habilitadoPlanAnualSst},
      {nombre:"Programa SST asociado a la empresa",divTr:"trExamTipo38",isHabilitado:proyectoObj.habilitadoProgramaSst},
      {nombre:"Plan anual de salud ocupacional",divTr:"trExamTipo39",isHabilitado:proyectoObj.habilitadoPlanAnualSaludOcupacional},
      {nombre:"Programa de vigilancia de salud ocupacional",divTr:"trExamTipo40",isHabilitado:proyectoObj.habilitadoProgVigilanciaSaludOcupacional},
      {nombre:"Certificado de homologación con el cliente",divTr:"trExamTipo41",isHabilitado:proyectoObj.habilitadoCertificadoHomologacion},
      {nombre:"Procedimiento de trabajo seguro para trabajos de alto riesgo",divTr:"trExamTipo42",isHabilitado:proyectoObj.habilitadoProcTrabajoSeguroTraAltoRiesgo},
      {nombre:"Indicador mensual SST",divTr:"trExamTipo16",isHabilitado:proyectoObj.habilitadoIndicadorMensualSst},  
      {nombre:"Constancia de registro laboral",divTr:"trExamTipo44",isHabilitado:proyectoObj.habilitadoConstanciaLaboral},
      {nombre:"Declaración de no núcleo del negocio",divTr:"trExamTipo45",isHabilitado:proyectoObj.habilitadoNoNucleoNegocio},
      {nombre:"Carta fianza",divTr:"trExamTipo46",isHabilitado:proyectoObj.habilitadoCartaFianza},
      {nombre:"Comunicado a organizaciones sindicales",divTr:"trExamTipo47",isHabilitado:proyectoObj.habilitadoComunicadoSindicales},
      {nombre:"Comunicado a representantes de trabajadores",divTr:"trExamTipo48",isHabilitado:proyectoObj.habilitadoComunicadoRepresentantes},
      {nombre:"Comunicado a trabajadores (principal)",divTr:"trExamTipo49",isHabilitado:proyectoObj.habilitadoComunicadoTrabPrincipal},
      {nombre:"Comunicado a trabajadores (contratista)",divTr:"trExamTipo50",isHabilitado:proyectoObj.habilitadoComunicadoTrabContratista},
      {nombre:"Ficha RUC",divTr:"trExamTipo51",isHabilitado:proyectoObj.habilitadoFichaRuc},
      {nombre:"Constancia registro de tercerizadoras",divTr:"trExamTipo52",isHabilitado:proyectoObj.habilitadoConstanciaTercerizadoras},
      {nombre:"Contratos con empresas usuarias",divTr:"trExamTipo53",isHabilitado:proyectoObj.habilitadoContratoEmpUsuarias},
      {nombre:"Partida registral",divTr:"trExamTipo54",isHabilitado:proyectoObj.habilitadoPartidaRegistral},
      {nombre:"Asiento de la partida registral",divTr:"trExamTipo55",isHabilitado:proyectoObj.habilitadoAsientoPartidaRegistral},
      {nombre:"Contratos de trabajos tercerizados",divTr:"trExamTipo56",isHabilitado:proyectoObj.habilitadoTrabajosTercerizados},
      {nombre:"Declaración de servicios tercerizados",divTr:"trExamTipo57",isHabilitado:proyectoObj.habilitadoServiciosTercerizados},
      {nombre:"Informe de servicio de trabajadores",divTr:"trExamTipo58",isHabilitado:proyectoObj.habilitadoServicioTrabajadores},
      {nombre:"Comité/Supervisor SST",divTr:"trExamTipo59",isHabilitado:proyectoObj.habilitadoComiteSupervisorSst},
      {nombre:"Hoja de atención del SCTR",divTr:"trExamTipo67",isHabilitado:proyectoObj.habilitadoHojaAtencionSctr},
      {nombre:"Acuerdo de confidencialidad",divTr:"trExamTipo68",isHabilitado:proyectoObj.habilitadoAcuerdoConfidencialidad},
      {nombre:"Flujo de respuesta ante accidentes",divTr:"trExamTipo69",isHabilitado:proyectoObj.habilitadoFlujoRespuestaAccidente},
      {nombre:"Acuerdo de seguridad para terceros y contratistas",divTr:"trExamTipo70",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadTerceros},
      {nombre:"Acuerdo de seguridad para proveedores",divTr:"trExamTipo71",isHabilitado:proyectoObj.habilitadoAcuerdoSeguridadProveedores},
	   {nombre:"Clínica (Certificación DIGESA)",divTr:"trExamTipo78",isHabilitado:proyectoObj.habilitadoClinicaCertDigesa},
	   {nombre:"Seguro vida ley",divTr:"trExamTipo88",isHabilitado:proyectoObj.habilitadoExamNivelCont88},
	   {nombre:"Formatos de campo",divTr:"trExamTipo91",isHabilitado:proyectoObj.habilitadoExamNivelCont91},
	   {nombre:"Declaración jurada de SST",divTr:"trExamTipo92",isHabilitado:proyectoObj.habilitadoExamNivelCont92},
	   {nombre:"Registro de seguridad del contratista",divTr:"trExamTipo93",isHabilitado:proyectoObj.habilitadoExamNivelCont93},
	   {nombre:"Declaración jurada para contratistas",divTr:"trExamTipo94",isHabilitado:proyectoObj.habilitadoExamNivelCont94},
	   {nombre:"Licencia o permiso emitido por la AMP",divTr:"trExamTipo95",isHabilitado:proyectoObj.habilitadoExamNivelCont95},
	   {nombre:"Carta de aceptación de la norma",divTr:"trExamTipo96",isHabilitado:proyectoObj.habilitadoExamNivelCont96},
	   {nombre:"Póliza de responsabilidad civil de la empresa",divTr:"trExamTipo97",isHabilitado:proyectoObj.habilitadoExamNivelCont97},
	   {nombre:"Formulario y control a terceras partes",divTr:"trExamTipo98",isHabilitado:proyectoObj.habilitadoExamNivelCont98},
	   {nombre:"Autorización Osinergmin para combustible",divTr:"trExamTipo102",isHabilitado:proyectoObj.habilitadoExamNivelCont102},
	   {nombre:"Autorización de circulación del MTC",divTr:"trExamTipo103",isHabilitado:proyectoObj.habilitadoExamNivelCont103},
	   {nombre:"Ficha técnica guantes aislantes clase 0/00",divTr:"trExamTipo104",isHabilitado:proyectoObj.habilitadoExamNivelCont104},
	   {nombre:"Certificado dieléctrico pértiga y manta aislante",divTr:"trExamTipo105",isHabilitado:proyectoObj.habilitadoExamNivelCont105},
	   {nombre:"Ficha técnica de componentes del traje contra arco eléctrico",divTr:"trExamTipo106",isHabilitado:proyectoObj.habilitadoExamNivelCont106},
	   {nombre:"Ficha técnica de botas dieléctricas",divTr:"trExamTipo107",isHabilitado:proyectoObj.habilitadoExamNivelCont107},
	   {nombre:"Certificado de ensayo dieléctrico guantes clase 1–4",divTr:"trExamTipo108",isHabilitado:proyectoObj.habilitadoExamNivelCont108},
	   {nombre:"Certificado de ensayo dieléctrico de banqueta aislante",divTr:"trExamTipo109",isHabilitado:proyectoObj.habilitadoExamNivelCont109},
	   {nombre:"Certificado de ensayo de puesta a tierra temporal",divTr:"trExamTipo110",isHabilitado:proyectoObj.habilitadoExamNivelCont110},
	   {nombre:"Constancia declaración y pago - PLAME",divTr:"trExamTipo123",isHabilitado:proyectoObj.habilitadoExamNivelCont123},
	   {nombre:"Planilla electrónica R01",divTr:"trExamTipo124",isHabilitado:proyectoObj.habilitadoExamNivelCont124},
	   {nombre:"Constancia de pago AFP",divTr:"trExamTipo125",isHabilitado:proyectoObj.habilitadoExamNivelCont125},
	   {nombre:"Constancia depósito CTS - Mayo y Noviembre",divTr:"trExamTipo126",isHabilitado:proyectoObj.habilitadoExamNivelCont126},
	   {nombre:"Constancia depósito gratificación - Julio y Diciembre",divTr:"trExamTipo127",isHabilitado:proyectoObj.habilitadoExamNivelCont127},
	   {nombre:"Procedimiento de acreditación en SST para subcontratistas",divTr:"trExamTipo137",isHabilitado:proyectoObj.habilitadoExamNivelCont137},
	   {nombre:"Declaración jurada - capacitación",divTr:"trExamTipo138",isHabilitado:proyectoObj.habilitadoExamNivelCont138},
	   {nombre:"Constancia del centro educativo de formación",divTr:"trExamTipo139",isHabilitado:proyectoObj.habilitadoExamNivelCont139},
	       
      {nombre:"Sub Contratista - Documentos",divTr:"trSubContratistaDoc",isHabilitado:proyectoObj.habilitadoSubContratista},
      {nombre:"Equipos Moviles - Operadores",divTr:"trEquipMovilOper",isHabilitado:proyectoObj.habilitadoEquipoMovilOperadores},
      {nombre:"Equipos Moviles",divTr:"trEquipMovil",isHabilitado:proyectoObj.habilitadoEquipoMovil},
      {nombre:"Equipos Moviles - Documentacion",divTr:"trEquipMovilDoc",isHabilitado:proyectoObj.habilitadoEquipoMovilDocumentos},
      {nombre:"Análisis de Trabajo Seguro (ATS)",divTr:"trAnaTraSeg",isHabilitado:proyectoObj.habilitadoAnalisisTrabajoSeguro},
      {nombre:"Permiso de Trabajo de Alto Riesgo (PETAR)",divTr:"trPerTraAltRie",isHabilitado:proyectoObj.habilitadoPermisoTrabAltoRiesgo},
      
      {nombre:"Documento a nivel conductor - Licencia de conducir",divTr:"trTipoDocCond1",isHabilitado:proyectoObj.habilitadoLicenciaConductor},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en normas de tránsito y manejo defensivo",divTr:"trTipoDocCond2",isHabilitado:proyectoObj.habilitadoCertifCapTransito},
      {nombre:"Documento a nivel conductor - Examen psicosensométrico",divTr:"trTipoDocCond3",isHabilitado:proyectoObj.habilitadoExamenPsicosensometrico},
      {nombre:"Documento a nivel conductor - Historial de manejo o récord del conductor",divTr:"trTipoDocCond4",isHabilitado:proyectoObj.habilitadoHistorialManejoCond},
      {nombre:"Documento a nivel conductor - Certificado de capacitación en manejo de camioneta 4x4",divTr:"trTipoDocCond5",isHabilitado:proyectoObj.habilitadoCertifCapManejo4x4}, 
      {nombre:"Documento a nivel conductor - Certificado de operador de maquinaria",divTr:"trTipoDocCond6",isHabilitado:proyectoObj.habilitadoCertifOperadorMaq},
      {nombre:"Documento a nivel conductor - Certificado del curso MAPTEL Nivel I",divTr:"trTipoDocCond7",isHabilitado:proyectoObj.habilitadoCertifCursoMaptelN1},
      {nombre:"Documento a nivel conductor - Curriculum Vitae",divTr:"trTipoDocCond8",isHabilitado:proyectoObj.habilitadoCurriculumVitae},
      {nombre:"Documento a nivel conductor - Capacitación como operador de descarga de cemento",divTr:"trTipoDocCond9",isHabilitado:proyectoObj.habilitadoExamNivelCond9},
	
      {nombre:"Documento a nivel vehículo/maquinaria - Check list de ingreso",divTr:"trTipoDocVehMaq1",isHabilitado:proyectoObj.habilitadoCheckListIngreso},
      {nombre:"Documento a nivel vehículo/maquinaria - Inspección técnica",divTr:"trTipoDocVehMaq2",isHabilitado:proyectoObj.habilitadoInspeccionTecnica},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza contra todo riesgo",divTr:"trTipoDocVehMaq3",isHabilitado:proyectoObj.habilitadoPolizaContraTodo},
      {nombre:"Documento a nivel vehículo/maquinaria - SOAT",divTr:"trTipoDocVehMaq4",isHabilitado:proyectoObj.habilitadoSoat},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta/Constancia de propiedad del equipo",divTr:"trTipoDocVehMaq5",isHabilitado:proyectoObj.habilitadoTarjetaConstanciaPropiedadEquipo},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de operatividad",divTr:"trTipoDocVehMaq6",isHabilitado:proyectoObj.habilitadoCertificadoOperatividad},
      {nombre:"Documento a nivel vehículo/maquinaria - Programa de mantenimiento preventivo",divTr:"trTipoDocVehMaq7",isHabilitado:proyectoObj.habilitadoProgMantenimientoPreventivo},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de mantenimiento preventivo",divTr:"trTipoDocVehMaq8",isHabilitado:proyectoObj.habilitadoCertifMantenimientoPreventivo},
      {nombre:"Documento a nivel vehículo/maquinaria - Permiso especial para el transporte de mercancía",divTr:"trTipoDocVehMaq9",isHabilitado:proyectoObj.habilitadoPermisoEspecialTransporteMercancia},
      {nombre:"Documento a nivel vehículo/maquinaria - Póliza TREC",divTr:"trTipoDocVehMaq10",isHabilitado:proyectoObj.habilitadoPolizaTrec},	
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de opacidad",divTr:"trTipoDocVehMaq11",isHabilitado:proyectoObj.habilitadoCertificadoOpacidad},
      {nombre:"Documento a nivel vehículo/maquinaria - Manual del equipo/Ficha técnica",divTr:"trTipoDocVehMaq12",isHabilitado:proyectoObj.habilitadoManualEquipoFichaTecnica},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado DGH - Osinergmin",divTr:"trTipoDocVehMaq13",isHabilitado:proyectoObj.habilitadoCertificadoDghOsinergmin},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de cubicación y hermeticidad",divTr:"trTipoDocVehMaq14",isHabilitado:proyectoObj.habilitadoCertifCubicacionHermeticidad},
      {nombre:"Documento a nivel vehículo/maquinaria - Tarjeta de circulación emitida por el MTC",divTr:"trTipoDocVehMaq15",isHabilitado:proyectoObj.habilitadoTarjetaCirculacionMtc},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de gravamen vehicular",divTr:"trTipoDocVehMaq16",isHabilitado:proyectoObj.habilitadoCertifGravamenVehicular},
      {nombre:"Documento a nivel vehículo/maquinaria - Verificación - GPS vehicular",divTr:"trTipoDocVehMaq17",isHabilitado:proyectoObj.habilitadoVerifGpsVehicular},
      {nombre:"Documento a nivel vehículo/maquinaria - Certificado de hermeticidad de la bombona",divTr:"trTipoDocVehMaq18",isHabilitado:proyectoObj.habilitadoExamNivelVehMaq18},
      
      {nombre:"Documento a nivel equipo/herramienta - Certificado de operatividad",divTr:"trTipoDocEquHerr1",isHabilitado:proyectoObj.habilitadoCertificadoOperatividadEquHerr},
      {nombre:"Documento a nivel equipo/herramienta - Inspección",divTr:"trTipoDocEquHerr2",isHabilitado:proyectoObj.habilitadoInspeccionEquHerr}
   ];
	
   $("#tblEvalTotalDocProyVisCol tbody").html("");
 	
   var selTipoEvaluacionTotal = crearSelectOneMenuOblig("selTipoEvaluacionTotal",
      "verIconoAcuerdoEval(this)",listEvaluacionStatusTotal,"","id","nombre");
   
   listEvaluar.forEach(function(val,index){
      if(val.isHabilitado == 1){
         $("#tblEvalTotalDocProyVisCol tbody").append(
            "<tr id='"+val.divTr+"'>" +
               "<td class='info' colspan='5' style='background:#D6E6E5F7;'>"+val.nombre+"</td>" +
            "</tr>");
      }
   });

   $("#btnGuardarEvalsTotalProyectoVisCol").hide();
    
   var listEstadoFinal=[];
    
   var estadosId = $("#selEstadoDocEvalTotalVisCol").val();
   estadosId.forEach(function(val){
      listEstadoFinal.push(parseInt(val));
   });
    
   var dataParamActividades={
      id: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
 	   
   var dataParamExamenes={
      id: (proyectoObj.postulante.contratista.id),proyectoActual: {id: proyectoObj.id},examen: {tipo: {id: null}},
      perfil: {id: null},listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
 	
   var dataParamSubContratista={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };  
   
   var dataParamHojasVida={
      tipo: {id: 4},listTrabAsignadosActivosId: proyectoObj.listTrabAsignadosActivosIdAux,   
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
 	   
   var dataParamEquiposMoviles={
      id: null,proyectoId: proyectoObj.id,listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
    
   var dataParamAts={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
    
   var dataParamPetar={
      contratistaId: (proyectoObj.postulante.contratista.id),proyectoId: proyectoObj.id,
      listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
   
   var dataParamTipoDocCond={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };
   
   var dataParamTipoDocVehMaq={
      contratistaId: (proyectoObj.postulante.contratista.id),listEstadoId: (listEstadoFinal.length == 0?null:listEstadoFinal)
   };

   var dataParamTipoDocEquHerr={
      contratistaId:(proyectoObj.postulante.contratista.id),listEstadoId:(listEstadoFinal.length == 0?null:listEstadoFinal)
   };
    
   cargarListConexionesVisorEvidencia(1);
    
   callAjaxPostSimple(URL+'/contratista/proyecto/actividades/revision',dataParamActividades,1,function(data){
    listFullActividades = data.list; 
    listFullActividades.forEach(agregarFilaActividadesVersionDos);

    callAjaxPostSimple(URL+'/contratista/examenes/revision',dataParamExamenes,0,function(data){
     if(data.trabajadores.length != 0){
        mapTrabContratistaVerfIa = new Map();
		
        data.trabajadores.forEach(function(val){
           mapTrabContratistaVerfIa.set(val.id,val);
        });
     } 
	
     listFullExamenes = data.examenes;
     listFullExamenes.forEach(agregarFilaExamenesVersionDos);
 					
     callAjaxPostSimple(URL+"/contratista/subcontratista/documento/revision",dataParamSubContratista,0,function(data){
      listFullSubContratistas = data.listDocumentosSubcontratista;
      listFullSubContratistas.forEach(agregarFilaSubContratistaVersionDos);
             
      callAjaxPostSimple(URL+"/contratista/trabajador/hojavidas/proyecto",dataParamHojasVida,0,function(data){
       listFullHojasVida = data.list;
       listFullHojasVida.forEach(agregarFilaHojaVidaVersionDos);
           
       callAjaxPostSimple(URL+"/contratista/analisis_trabajo_seguro/evaluacion",dataParamAts,0,function(data){
        listFullAnalisisTrabajoSeguro = data.listAnalisisTraSeg;
        listFullAnalisisTrabajoSeguro.forEach(agregarFilaAnalisisTrabajoSeguroVersionDos);
             
        callAjaxPostSimple(URL+"/contratista/permiso_trabajo_alto_riesgo/evaluacion",dataParamPetar,0,function(data){
         listFullPermisoTraAltRie = data.listPermisoTraAltRie;
         listFullPermisoTraAltRie.forEach(agregarFilaPermisoTrabajoAltoRiesgoVersionDos);
         
         callAjaxPostSimple(URL+"/contratista/documento_nivel_conductor/evaluacion",dataParamTipoDocCond,0,function(data){
          listFullDocNivelCond = data.listDocumentosNivelConductor;
          listFullDocNivelCond.forEach(agregarFilaDocumentoNivelConductorVersionDos);
          
          callAjaxPostSimple(URL+"/contratista/documento_nivel_vehiculo_maquinaria/evaluacion",dataParamTipoDocVehMaq,0,function(data){
           listFullDocNivelVehMaq = data.listDocumentosNivelVehiculoMaquinaria;
           listFullDocNivelVehMaq.forEach(agregarFilaDocumentoNivelVehiculoMaquinariaVersionDos);
           
           callAjaxPostSimple(URL+"/contratista/documento_nivel_equipo_herramienta/evaluacion",dataParamTipoDocEquHerr,0,function(data){
            listFullDocNivelEquHerr = data.listDocumentosNivelEquipoHerramienta;
            listFullDocNivelEquHerr.forEach(agregarFilaDocumentoNivelEquipoHerramientaVersionDos);
 		
            callAjaxPostSimple(URL+"/contratista/equipomovil/revision",dataParamEquiposMoviles,0,function(data){
             listFullOperadorEquipo = data.operadoresEquipo;
             listFullOperadorEquipo.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(1,val);
             });
                   
             listFullEquiposMovilMantenimiento = data.listEquiposMantenimiento;
             listFullEquiposMovilMantenimiento.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(2,val,2);
             });
                   
             listFullEquiposMovilCertificado = data.listEquiposCertificado;
             listFullEquiposMovilCertificado.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(2,val,1);
             });
                   
             listFullDocumentosEquipIzaje = data.documentos;
             listFullDocumentosEquipIzaje.forEach(function(val,index){
                agregarFilaEquipoMovilVersionDos(3,val);
             });                                                 
         	                                                      
             goheadfixedY("#tblEvalTotalDocProyVisCol","#wrapEvalTotalDocProyVisCol");
             $("#btnGuardarEvalsTotalProyectoVisCol").show();$.unblockUI();
            });
           });
          });
         });
        });
       });
      });
     });
    });
   });
}
 
function volverVistaMovil(){
   contadorFijoY = 0;
   $(".divTituloGeneral h4").html(tituloAnteriorContratista);
   $("#divIpercTabla").remove();
   $("#divTrabProyTabla").remove();
   $("#divObsProyTabla").remove();
   $("#divStatDocTabla").remove();
   $(".divTablaVisual").remove();
   $("#divEvaluacionTotalDocProyectoVisCol").remove();
   $("#divEvaluacionRespPregListHomVisCol").remove();
   $(".divContainerGeneral").show();
}

var listPerfilPersonalExterno=[
   {id:2,nombre:"Trabajador contratista"},{id:3,nombre:"Contratista"},{id:5,nombre:"Vehículo/Maquinaria"},
   {id:6,nombre:"Equipo/Herramienta"}
];

function ocultarPerfilesInformacionVistaConsulta(){
   $("#modalPerfilesInformacionVistaConsulta").modal("hide");
}

function verPerfilesInformacionVistaConsulta(){
   $("#modalPerfilesInformacionVistaConsulta").remove();

   var selOpcPerfilPersonalExterno = crearSelectOneMenuOblig("selOpcPerfilPersonalExterno",
      "verAcordePerfilesInformacionVistaConsulta()",listPerfilPersonalExterno,"3","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<label></label>",
       inputForm:selOpcPerfilPersonalExterno,divContainer:"divSelPerfilPersonalExterno"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarPerfilesInformacionVistaConsulta()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='buscarDatosSegunPerfilPersonalExterno()'>" +
                    "<i class='fa fa-search'></i> Buscar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalPerfilesInformacionVistaConsulta",nombre:"<i class='fa fa-book'></i> <i class='fa fa-search'></i> Seleccionar perfil",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordePerfilesInformacionVistaConsulta();
}

var opcPerfilPersonalExterno;

function verAcordePerfilesInformacionVistaConsulta(){
   $(".atributo-perfilesInformacionVistaConsulta").remove(); 
   
   var listContenidoDivSelPerfilPersonalExterno = [];
   opcPerfilPersonalExterno = parseInt($("#selOpcPerfilPersonalExterno").val());
   
   if([3,6].includes(opcPerfilPersonalExterno)){
      listContenidoDivSelPerfilPersonalExterno.push({sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Contratista:",
	  inputForm:"<input class='form-control' type='text' id='inputIngresarRucNombreContratista'>" +
	            "<div id='divSelAutoContratistaPorNombre'></div>" +
		    "<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo).</label>"});
   }
   
   if(opcPerfilPersonalExterno == 2){
      listContenidoDivSelPerfilPersonalExterno.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
         label:"<div class='divTituloSeccion'>Búsqueda por N° de documento</div>",inputForm:""}); 
   }else if(opcPerfilPersonalExterno == 3){
      listContenidoDivSelPerfilPersonalExterno.push({sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Proyecto activo:",
         inputForm:"<div id='divSelAutoProyectoActivoContratista'></div>"});
    }else if(opcPerfilPersonalExterno == 5){
	    listContenidoDivSelPerfilPersonalExterno.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
	        label:"<div class='divTituloSeccion'>Búsqueda por Placa</div>",inputForm:""}); 
   }else if(opcPerfilPersonalExterno == 6){
      listContenidoDivSelPerfilPersonalExterno.push({sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"Equipo/Herramienta:",
	 inputForm:"<input class='form-control' type='text' id='inputEquipoHerramientaConsulta'>" +
                   "<div id='divAutoCompletarEquipoHerramientaConsulta'></div>" +
	           "<label>*Buscar equipo/herramienta por código (debe ingresar 3 caracteres como mínimo).</label>"});
   }
   
   var contenido = "";
   
   listContenidoDivSelPerfilPersonalExterno.forEach(function(val){
      val.clase = "atributo-perfilesInformacionVistaConsulta";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelPerfilPersonalExterno").parent().after(contenido);
   
   if([3,6].includes(opcPerfilPersonalExterno)){
      buscarContratistaEmpresaConsulta();
   }
}

function buscarDatosSegunPerfilPersonalExterno(){
   if(opcPerfilPersonalExterno == 2){
      verConsultaTrabajadorContratistaPorNroDocumento();
   }else if(opcPerfilPersonalExterno == 3){
      crearFiltroDatosContratista();
    }else if(opcPerfilPersonalExterno == 5){
	    verConsultaVehiculoMaquinariaPorPlaca();
   }else if(opcPerfilPersonalExterno == 6){
      buscarDatosEquipoHerramienta();
   }  
}
