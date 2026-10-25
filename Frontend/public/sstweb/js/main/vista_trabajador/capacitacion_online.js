
var listFullFormacionesTrabajador=[];
var listHistorialCapCompletadasTra=[];
var cursoExamenActual={};
var escondioAvisoCapacitacion=false;
var listEstadoCapOnlineTrabId = [];
var mensajeUx;

var listEstadoCapOnline=[
       {id:1,nombre:"Futuros"},
       {id:2,nombre:"Por llevar - Completados"},
       {id:3,nombre:"Anteriores"}
                        ];

function ocultarFiltroEstadoCapOnlineTrab(){
   $("#modalFiltroEstadoCapOnlineTrab").modal("hide");
}

function verFiltroEstadoCapOnlineTrab(){
   $("#modalFiltroEstadoCapOnlineTrab").modal("show");
}

function crearFiltroEstadosCapOnlineTrab(functionCallBack){
   $("#modalFiltroEstadoCapOnlineTrab").remove();
    
   var contenido = "";
					
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Estado",inputForm:"",
       divContainer:"divFiltroEstadosCapOnlineTrab"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroEstadoCapOnlineTrab()' " +
                     "style='font-size:18px;'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button id='btnAplicarFiltroEstadoCapOnlineTrab' class='btn btn-success' type='submit' " +
	   		 "onclick='valoresFiltroEstadoCapOnlineTrab()' style='float:right;font-size:18px;'>" +
		    "<i class='fa fa-filter'></i> Aplicar filtro" +
		 "</button>"}
   ];
					
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
					
   var modalOptionsCapOnline={
      id:"modalFiltroEstadoCapOnlineTrab",nombre:"<i class='fa fa-filter'></i> Filtros",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
					
   crearModalPrincipalUsuario(modalOptionsCapOnline,function(){
      if($("#filtroEstadosCapOnlineTrab").length > 0){
	 return;
      }
      
      listEstadoCapOnline.forEach(function(val){
         if(val.id == 2){
            val.selected = 1;
         }    
      });
	         
      crearSelectOneMenuObligMultipleCompleto("filtroEstadosCapOnlineTrab","",listEstadoCapOnline,
         "id","nombre","#divFiltroEstadosCapOnlineTrab","Todos");
   },true,true);
	
   functionCallBack();
}

function valoresFiltroEstadoCapOnlineTrab(){
   ocultarFiltroEstadoCapOnlineTrab(); 
    
   listEstadoCapOnlineTrabId = [];
   var estadoId = $("#filtroEstadosCapOnlineTrab").val();
   
   if(estadoId != null){
      estadoId.forEach(function(val){
	 listEstadoCapOnlineTrabId.push(parseInt(val));
      });
   }
   
   habilitarCapacitacionOnlineUsuario();
}

function eliminarAvisoCapacitacionGosst(){
   $(".gosst-aviso").remove();
   escondioAvisoCapacitacion = true;
}

function verTutorialCapacitacion(){
   $("#videoCap").show();
   $("#videoCap").get(0).play();
} 

var indexCurso = null;
var puntajeCertificado = null;
var indexFunction = null;
var indexCertificado = null;

function toggleMenuOpcionCap(obj,pindex,curso){
   indexFunction = pindex;
   indexCurso = curso;
   $(obj).parent("#opciones"+indexFunction).find("ul").toggle();
   $(obj).parent("#opciones"+indexFunction).siblings().find("ul").hide();
}

var funcionalidadesCap=[
   {id:"opcDetalle",nombre:"<i class='fa fa-file-text-o'></i>&nbspVer Detalles",
    functionClick:function(data){verDetallesCurso(indexFunction,indexCurso);}},
   {id:"opcPuntaje",nombre:"<i class='fa fa-flag'></i>&nbspPuntaje Alcanzado",
    functionClick:function(data){alert(""+pasarDecimalPorcentaje(puntajeCertificado,2));}},
   {id:"opcDescarga",nombre:"<i class='fa fa-certificate'></i>&nbspDescarga Certificado",
    functionClick:function(data){descargarCertificadoCurso(data);}}	
];

function marcarSubOpcionCap(pindex,pcursoId){
   funcionalidadesCap[pindex].functionClick(pcursoId);
   $(".listaGestionGosst").hide();
}

function habilitarCapacitacionOnlineUsuario(){
   var capObj={
      empresaId:parseInt(getSession("gestopcompanyid")),trabajadorId:parseInt(getSession("trabajadorGosstId")),
      puestoTrabajoId:parseInt(getSession("puestoGosstId")),
      listEstadoCapOnlineTrabId:(listEstadoCapOnlineTrabId.length == 0?null:listEstadoCapOnlineTrabId)
   };
	
   $(".divListPrincipal").html("");
	
   callAjaxPost(URL+'/capacitacion/vista_colaborador',capObj,function(data){
      var capImplCounter = 0,capComplCounter = 0,capPasadoCounter = 0,capFuturoCounter = 0;
      var textImplementar = "",textCompletado = "",textFuturo = "",textPasado = "",textHisCapCompletadas = "";
      var listPanelesPrincipal = [];
      
      listHistorialCapCompletadasTra = data.listHistorialCapCompletadasTra;
      
      var nombreConsolidado = "",nombrePorLlevar = "",nombreEnCurso = "",nombreCompletadasAnterior = "";
      
      if(parseInt(getSession("gestopcompanyid")) == 647){
	 nombreConsolidado = "Personal programado";nombrePorLlevar = "Cursos pendientes";nombreCompletadasAnterior = "Cursos completados"; 
      }else{
	 nombreConsolidado = "Ver consolidado Trabajadores planificados";nombrePorLlevar = "Capacitaciones por llevar";
	 nombreEnCurso = "Capacitaciones Completadas en curso";nombreCompletadasAnterior = "Capacitaciones completadas anteriormente";  
      }
      
      listPanelesPrincipal.push({id:"cursosConsolidadoGeneral",clase:"divProyectoGeneral",nombre:"",contenido:""},
         {id:"contenedorQuickSightCapOnline",clase:"divProyectoGeneral",nombre:"",contenido:""},
//       {id:"cursosFiltro",clase:"divProyectoGeneral",nombre:"",contenido:""},
         {id:"cursosImplementar",clase:"",nombre:nombrePorLlevar+" (<label></label>)",contenido:textImplementar});
      
      if(parseInt(getSession("gestopcompanyid")) != 647){
	 listPanelesPrincipal.push({id:"cursosCompletados",clase:"divProyectoGeneral",nombre:nombreEnCurso+" (<label></label>)",contenido:textCompletado});  
      }
      
      listPanelesPrincipal.push(
//	 {id:"cursosFuturos",clase:"divProyectoGeneral",nombre:"Futuros (<label></label>)",contenido:textFuturo},
//	 {id:"cursosPasados",clase:"divProyectoGeneral",nombre:"Anteriores (<label></label>)",contenido:textPasado},
	 {id:"historialCursosCompletados",clase:"divProyectoGeneral",nombre:nombreCompletadasAnterior+" (<label></label>)",contenido:textHisCapCompletadas},
	 {id:"cursoExamenMovil",clase:"divCursoExamenMovil",nombre:" Cargando",contenido:""},
	 {id:"cursoEncuestaExamenMovil",clase:"divCursoExamenMovil",nombre:" Cargando",contenido:""} ,
         {id:"cursoPreguntasExamenMovil",clase:"divCursoExamenMovil",nombre:" Cargando",contenido:""},
	 {id:"cursoResultadoExamenMovil",clase:"divCursoExamenMovil",nombre:" Cargando",contenido:""});
		
      agregarPanelesDivPrincipalColaborador(listPanelesPrincipal);
		
      if(numAreasResponsable > 0){
         var btnConsolidadoCurso = "<button onclick='verTablaConsolidadoTrabajadoresAsignadosCO()' style='font-size:15px;' " +
	          "class='btn btn-success' title='Ver consolidado Trabajadores planificados'>" +
	       "<i class='fa fa-2x fa-arrow-right'></i>" +
	    "</button>";
				  
         $(".divListPrincipal").find("#cursosConsolidadoGeneral .tituloSubList")
         .html("<i aria-hidden='true' class='fa fa-table'></i> "+nombreConsolidado+btnConsolidadoCurso);
	    
	 var btnConsolidadoQuickSight = "<button onclick='verQuicksightCapacitacionOnline()' style='font-size:15px;' " +
	          "class='btn btn-success' title='Ver gráficos en QuickSight'>" +
	       "<i class='fa fa-2x fa-arrow-right'></i>" +
	    "</button>";
				  
	 $(".divListPrincipal").find("#contenedorQuickSightCapOnline .tituloSubList")
         .html("<i aria-hidden='true' class='fa fa-pie-chart'></i> Ver análisis de datos "+btnConsolidadoQuickSight);
      }else{
	 $(".divListPrincipal").find("#cursosConsolidadoGeneral .tituloSubList").hide();
	 $(".divListPrincipal").find("#contenedorQuickSightCapOnline .tituloSubList").hide();
      }
      
//    var btnFiltroCurso = "<button onclick='verFiltroEstadoCapOnlineTrab()' style='font-size:15px;' class='btn btn-success' title='Ver filtro cursos'>" +
//	    "<i class='fa fa-2x fa-filter'></i>" +
//	 "</button>";
//
//     $(".divListPrincipal").find("#cursosFiltro .tituloSubList").html("<i aria-hidden='true' class='fa fa-list-alt'></i> Ver filtro - Cursos "+btnFiltroCurso);
		
      var linkVIdeo = "https://drive.google.com/open?id=1GXNXp5KGTcMJyNLh1GaV8DmYRPDtv2sp";
      var textoConfidencial = " Hola, si deseas ver un tutorial sobre como dar cursos online, haz click " +
      	 "<a href='"+linkVIdeo+"' target='_blank'> aquí </a>" +
	 "<br><br> GOSST" +
	 "<br><br> Tu Seguridad, Nuestra Cultura" +
	 "<br>" +"<video style='display:none' width='100%' id='videoCap' controls>" +
	            "<source src='../videos/video.mp4' type='video/mp4'>" +
	         "</video>" +
	 "<br>"+"<button class='btn btn-success' onclick='eliminarAvisoCapacitacionGosst()'>" +
	           "Esconder aviso" +
	        "</button>";
      
      $(".gosst-aviso").remove();
		
      if(!escondioAvisoCapacitacion){
	 $(".divTituloFull").append("<div class='gosst-aviso'>"+textoConfidencial+"</div>");$(".gosst-aviso").remove();
      }
		
      listFullFormacionesTrabajador = data.list;
	
      listFullFormacionesTrabajador.forEach(function(val,index){
	 var cursosCap = val.cursos;
         
         cursosCap.forEach(function(val1,index1){
	    if(parseInt(val1.isOculto) != 1){ 
	       var textoSuspensivo = (val1.nombre.length > 90?"...":"");
	       var textoAvance = "("+val1.numPreguntas+" preguntas)";			
	       var textoCap = ""+val1.nombre.substring(0,90)+textoSuspensivo+" ";
	       
	       var textoCertificado = " "+"<a class='btn btn-success' onclick='verDetallesCurso("+index+","+index1+")'>" +
	       		                     "Ver Detalles" +
	       		                  "</a>";
	       
	       var puntajeNoAprobado = true;
	       var textoPuntaje = ""; 
				
	       if(val1.evaluacion == null){
		  puntajeNoAprobado = true;
	       }else{ 
		  if(parseInt(getSession("gestopcompanyid")) == 647){
		     textoPuntaje = "Puntaje Alcanzado: "+(val1.evaluacion.puntajeAlcanzado*20).toFixed(0)+"<br>"; 
		  }else{
		     textoPuntaje = "Puntaje Alcanzado: "+pasarDecimalPorcentaje(val1.evaluacion.puntajeAlcanzado,2)+"<br>";     
		  }
					
		  puntajeCertificado = val1.evaluacion.puntajeAlcanzado;
					
		  if((val1.puntajeMinimo/100) > val1.evaluacion.puntajeAlcanzado){
		     indexCertificado = null;puntajeCertificado = "0.00%";puntajeNoAprobado = true;
		     textoCertificado = "<a class='btn btn-success' role='button' " +
		     		           "onclick='verDetallesCurso("+index+","+index1+")'>" +
		     		           "Ver Detalles" +
		     		        "</a>";
		  }else{
		     puntajeNoAprobado = false;indexCertificado = val1.id;
		  }
	       }
				
	       var noticia = (val1.evidenciaNombre.length == 0?"":
		  "<div class='cropGosst'>"+insertarImagenParaTablaMovil(val1.evidencia,"300px","100%")+"</div>");
	       var divCursoAsoc;
	       var textoAuxiliar = "";
	       var fechaRango = fechaIncluidaEnRango(getSession("fechaHoyOrdenInversoTexto"),
		  convertirFechaInput(val1.fechaInicio),convertirFechaInput(val1.fechaFin));
				
	       if(puntajeNoAprobado && fechaRango){
		  divCursoAsoc = $("#cursosImplementar");capImplCounter += 1;
		  textoCertificado = " "+"<a class='btn btn-success' onclick='verDetallesCurso("+index+","+index1+")'>" +
		  		            "Ingresar al curso" +
		  		         "</a>";
	       }else{
		  if(val1.estado.id == 1){
		     divCursoAsoc = $("#cursosFuturos");capFuturoCounter += 1;
		     textoCertificado = "Disponible: "+convertirFechaNormal(val1.fechaInicio);
		  }
					
		  if(val1.estado.id == 2){
		     divCursoAsoc = $("#cursosCompletados");capComplCounter += 1;  
		      
		     textoCertificado = (val1.wantsCertificado == 1?textoCertificado:
			                 "<a class='btn btn-success' role='button' onclick='verDetallesCurso("+index+","+index1+")'>" +
			                    "Ver Detalles" +
			                 "</a>");
		  }
					
		  if(val1.estado.id == 3){
		     divCursoAsoc = $("#cursosPasados");capPasadoCounter++;  
		      
		     textoCertificado = (val1.wantsCertificado == 1?textoCertificado:
			                 "<a class='btn btn-success' role='button' onclick='verDetallesCurso("+index+","+index1+")'>" +
			                    "Ver Detalles" +
			                 "</a>");
		  }
					
		  var btnIniciarCurso = "<button class='btn-success btn' onclick='iniciarCursoPsicologia("+index+","+index1+")'>" +
		  		           "<i class='fa fa-image' aria-hidden='true'></i> Iniciar evaluación" +
		  		        "</button>";
					
		  if(val1.estado.id == 2 && puntajeNoAprobado){ 
		     textoAuxiliar = btnIniciarCurso;
		  }else{ 
		     if(val1.estado.id == 1){  
			textoAuxiliar = "Disponible: "+convertirFechaNormal(val1.fechaInicio);
		     }
						
		     if(val1.estado.id == 2){ 
			textoAuxiliar="<label>Completado<label>";
		     }
						
		     if(val1.estado.id == 3){
			textoAuxiliar= "<label>Cerrado<label>"; 
		     }
		  }
					
		  if(val1.estado.id == 3){
		     textoAuxiliar = "<label>Cerrado<label>"; 
		  } 
	       }
				
	       var menuOpcion = "<ul class='list-group listaGestionGosst'>";
	          funcionalidadesCap.forEach(function(val2,index2){
		     menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionCap("+index2+","+val1.id+")'>" +
		                       val2.nombre +
		                   "</li>";
	          });	
	       menuOpcion += "</ul>";
	       
	       var valorPuntajeMinimo = (val1.numPreguntas == 0?"------":pasarDecimalPorcentaje(val1.puntajeMinimo/100,2));
	       
	       if(parseInt(getSession("gestopcompanyid")) == 647){
		  valorPuntajeMinimo = (val1.numPreguntas == 0?"------":(val1.puntajeMinimo/100)*20);    
	       }
					
	       divCursoAsoc.find(".contenidoSubList")
	       .append("<div class='eventoGeneral' id='cursoMovil"+val1.id+"'>" +
		          "<div id='tituloEvento'>" +
			     "<table class='table table-capacitacion-movil'>" +
			        "<tbody>" +
				   "<tr>" +
				      "<td colspan='3' id='opciones"+index+"'>"+
				         "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionCap(this,"+index+","+index1+")'>" +
					    "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					 "</a>"+menuOpcion+
				      "</td>" +
				   "</tr>" +
				   "<tr>" +
				      "<td style='width:50px'>"+"<i aria-hidden='true' class='fa fa-graduation-cap'></i>"+"</td>" +
				      "<td colspan='2'>"+"<strong>"+val.capacitacionNombre+"</strong></td>" +
				   "</tr>" +
				   "<tr>" +
				      "<td>"+"<i aria-hidden='true' class='fa fa-info'></i>"+"</td>" +
				      "<td colspan='2'>"+"<strong>"+textoCap+"  "+textoAvance+"</strong></td>" +
			           "</tr>" +
				   "<tr>" +
				      "<td>"+"<i aria-hidden='true' class='fa fa-check-square-o'></i>"+"</td>" +
				      "<td colspan='2'>"+" "+"Puntaje Mínimo: "+valorPuntajeMinimo+"</td>" +
				   "</tr>" +
				   (val1.evidenciaNombre.length == 0?"":"<tr>"+"<td colspan='3'>"+noticia+"</td>"+"</tr>") +
			           "<tr>" + 
				      "<td colspan='3' style='text-align:center;font-size:15px;'>"+textoPuntaje+" "+textoCertificado+"</td>" + 
				   "</tr>" +
				"</tbody>" +
			     "</table>"+ 
			  "</div>"+
		       "</div>");
	    }
				
	    if(puntajeNoAprobado == true){
	       $("#opciones"+index).hide();
	    }
         });
      });
      
      var textTotal = "";
      
      listHistorialCapCompletadasTra.forEach(function(val,index){ 
	 var valorPuntajeMinimo = pasarDecimalPorcentaje(val.puntajeAlcanzado,2);
	       
	 if(parseInt(getSession("gestopcompanyid")) == 647){
            valorPuntajeMinimo = (val.puntajeAlcanzado*20).toFixed(0); 
	 }
	  
	 var listTotal=[
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i aria-hidden='true' class='fa fa-graduation-cap'></i> Capacitación",
	     inputForm:val.capacitacionNombre},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i aria-hidden='true' class='fa fa-info'></i> Curso",inputForm:""+val.curso},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-book'></i> Puntaje alcanzado",
	     inputForm:valorPuntajeMinimo},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
	 ];
	 
	 if(val.tipoNotaId == 1){
	    var descargarCertificado = 
	       "<a class='efectoLink' target='_blank' style='font-size:16px;' " +
		  "onclick='descargarCertificadoCurso("+val.cursoId+")'>" +
	          "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	       "</a>";
	             
	    listTotal.push(
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
		label:"<i class='fa fa-certificate'></i> Certificado",
		inputForm:descargarCertificado},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
	 }	
	         
	 listTotal.push(
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-calendar'></i> Registrado el",
             inputForm:""+val.fechaRealizadaTexto});
		
	 textTotal+="<div class='eventoGeneral'>";	   	
         
            listTotal.forEach(function(val,index){
	       textTotal+=""+obtenerSubPanelModuloVersionDos(val);
            });
	   
         textTotal+="</div>";
      });
		
      $(".listaGestionGosst").hide();
      
      $("#cursosImplementar").find(".tituloSubList label").html(capImplCounter);
      $("#cursosCompletados").find(".tituloSubList label").html(capComplCounter);
//      $("#cursosFuturos").find(".tituloSubList label").html(capFuturoCounter);
//      $("#cursosPasados").find(".tituloSubList label").html(capPasadoCounter);
		
      $("#cursosImplementar .tituloSubList").css({"color":colorPuntajeGosst(0.5)+" !important"});
      $("#cursosCompletados .tituloSubList").css({"color":colorPuntajeGosst(1.0)+" !important"});
      //$("#cursosFuturos .tituloSubList").css({"color":colorPuntajeGosst(0.5)+" !important"});
//      $("#cursosPasados .tituloSubList").css({"color":colorPuntajeGosst(0.0)+" !important"});
      
      $("#historialCursosCompletados").find(".contenidoSubList").html(""+textTotal);
      $("#historialCursosCompletados").find(".tituloSubList label").html(listHistorialCapCompletadasTra.length);
      
      $("#liMenuTrabajador8 .alertaMenu").html(capImplCounter);
   }); 
}

function verDetallesCurso(indCap,indCurso){
   var capObj = listFullFormacionesTrabajador[indCap];
   var capActual = listFullFormacionesTrabajador[indCap].cursos;
   cursoExamenActual = capActual[indCurso];
     
   var textoBotonEnlace = 
      "<i class='fa fa-external-link'></i> Ir al sitio";
   var textoBotonFinal = 
      "<i class='fa fa-align-left'></i>" +
         "&nbsp;Encuesta y Evaluación" +"&nbsp;" +
      "<i class='fa fa-angle-right'></i>";
   
   var textoPuntajeMinimo = 
      (cursoExamenActual.numPreguntas == 0?
       "------":cursoExamenActual.puntajeMinimo+"%");
    
   if(parseInt(getSession("gestopcompanyid")) == 647){
      textoBotonEnlace = 
	 "<i class='fa fa-eye'></i> Ver video";
      
      textoBotonFinal = 
	 "<i class='fa fa-align-left'></i>" +
	 " Realizar encuesta y luego la evaluación " +
	 "<i class='fa fa-angle-right'></i>";
      
      textoPuntajeMinimo = 
	 (cursoExamenActual.numPreguntas == 0?
          "------":(cursoExamenActual.puntajeMinimo/100)*20);
   }
    
   $(".divListPrincipal>div").hide();
   $("#cursoExamenMovil").show();
   $("#cursoExamenMovil").find(".tituloSubList")
   .html(textoBotonVolverContenido+" Curso '"+cursoExamenActual.nombre+"'");
	
   $("#cursoExamenMovil").find(".contenidoSubList").show();
	
   var textCarga=""+"<table class='table tableCursoGosst table-bordered'>" +
	               "<thead>" +
	                  "<tr>" +
	                     "<td>" +
	                        "<i class='fa fa-spin fa-spinner fa 2x' style='color:#19958E; font-size: 20px;'></i>" +
	                        "<label style='font-size:20px'>Cargando</label>" +
	                     "</td>" +
	               "</thead>" +
	            "</table"; 
	
   $("#cursoExamenMovil").find(".contenidoSubList").html("<div class='cargaDetalleCurso'>"+textCarga+"</div>");
	
   var imagenCap="<img></img>";
	
   if(cursoExamenActual.evidencia != null){
      imagenCap = insertarImagenParaTablaMovil(cursoExamenActual.evidencia,"250px","100%");	
   }
	
   var dataParam={
          id: cursoExamenActual.id,
          trabajadorAsociadoId: getSession("trabajadorGosstId"),
          isForExam: 1
		 };
   
   if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
      dataParam={
	 id: cursoExamenActual.id,
	 contratistaAsociado: {id: getSession("contratistaGosstId")},
	 isForExam : 1
		};
   }
	
   var butonFinal =
      "<button class='btn btn-success' onclick='verEncuestaCurso();'>" +
          textoBotonFinal
      "</button>";
	
   var isPasado = 2;
   var puntajeNoAprobado = true;
	
   if(cursoExamenActual.evaluacion == null){
      puntajeNoAprobado=true;
   }else{
      if((cursoExamenActual.puntajeMinimo/100)>
	  cursoExamenActual.evaluacion.puntajeAlcanzado){
         puntajeNoAprobado = true;
         isPasado = 2;	
      }else{
	 puntajeNoAprobado = false;
	 isPasado = 1;
      }
   }
   
   var fechaRango = fechaIncluidaEnRango(obtenerFechaActual(),convertirFechaInput(cursoExamenActual.fechaInicio),
	                                 convertirFechaInput(cursoExamenActual.fechaFin));
	
   if(fechaRango && puntajeNoAprobado){
      isPasado = 0;
   }else{
      if(cursoExamenActual.estado.id == 1){
      }
		
      if(cursoExamenActual.estado.id == 2){
         if(puntajeNoAprobado){
	    isPasado = 2;
         }else{ 
	    isPasado = 1;
         }
      }
		
      if(cursoExamenActual.estado.id == 3){
         if(puntajeNoAprobado){
	    isPasado = 2;
         }else{ 
	    isPasado=1;
         }	
      }
   }
	
   if(isPasado == 1){
      butonFinal="<button class='btn btn-success' onclick='descargarCertificadoCurso("+cursoExamenActual.id+");' '>" +
		    "<i class='fa fa-certificate'></i>" +
		    "&nbsp;Descargar Certificado" +
		 "</button>";
		butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
   }
	
   if(isPasado == 2){
      butonFinal="<button class='btn btn-info' onclick='alertarCertificado()' '>" +
		    "<i class='fa fa-certificate'> </i>" +
		    "&nbsp;Descargar Certificado" +
		 "</button>";
		
      butonFinal=(cursoExamenActual.wantsCertificado==1?butonFinal:"");
   }
	
   $("#cursoExamenMovil").find(".contenidoSubList")  
   .append(//"<div class='imgDetalleCurso'>"+""+"</div>" +
	   "<div class='textDescripcionCurso'>"+""+"</div>" +
	   "<div class='objDetalleCurso'>"+""+"</div>" +
	   "<div class='textDetalleCurso'>"+""+"</div>" +
	   "<div class='relDetalleCurso'>"+""+"</div>" +
	   "<div class='ratingDetalleCurso'>"+""+"</div>" +
	   "<div class='profeDetalleCurso'>"+""+"</div>" +
	   "<div class='videoDetalleCurso'>"+""+"</div>" +
	   "<div class='archDetalleCurso'>"+""+"</div>" +
	   "<div class='enlDetalleCurso'>"+""+"</div>" +
	   "<div class='btnDetalleCurso'>"+""+"</div>");
	
   $(".divDetalleCurso button").hide();
//   $(".imgDetalleCurso").html(crearDivInformacionCurso("Imagen curso",[imagenCap]));
	
   $(".textDescripcionCurso")
   .html(crearDivInformacionCurso("Descripción",
	 ["<strong>"+cursoExamenActual.descripcion+"</strong><br>"]));
   
   $(".textDetalleCurso")
   .html(crearDivInformacionCurso("Información general",
	 ["<strong>Nota Mínima: </strong>"+textoPuntajeMinimo+"<br>" +
	  "<strong>Tiempo de resolución: </strong>" +
	      (cursoExamenActual.numPreguntas == 0?"------":convertirHoraMinutos(cursoExamenActual.tiempoSolucion))+" <br>" +
//          "<strong>Descripción: </strong>"+cursoExamenActual.descripcion+" <br>"+
	   (cursoExamenActual.enlaceInfoGeneral == ""?"":"<br>"+
	       "<a class='btn btn-success' target='_blank' href='"+cursoExamenActual.enlaceInfoGeneral+"'>" +
	          "<i class='fa fa-external-link'></i> Información del curso" +
	       "</a>")]));
   
   $(".relDetalleCurso").hide();
   $(".ratingDetalleCurso").hide();
   $(".objDetalleCurso").hide();
   $(".profeDetalleCurso").hide();
   $(".relDetalleCurso").hide();
   $(".archDetalleCurso").hide();
   $(".enlDetalleCurso").hide();
   $(".videoDetalleCurso").hide();

   var llamadasRealizadas = 0;

   function convertirHoraMinutos(doubleHora){
      var horaBaja = Math.floor(doubleHora);
      var minutos = doubleHora - horaBaja;
      var textoMinutos = "",textoHoras="";
    
      if(horaBaja > 0){
	 textoHoras = ""+horaBaja+" hora(s)"
      };
    
      if(minutos > 0){
	 textoMinutos = ""+Math.floor(minutos*60)+" minuto(s)"
      };
    
      return textoHoras+" "+textoMinutos;
   }
   
   function mostrarTodoDiv(){
      llamadasRealizadas++;
	
      if(llamadasRealizadas == 5){		
	 llamadasRealizadas = 0;
	 $(".relDetalleCurso").show(); 
	 $(".objDetalleCurso").show();
	 $(".profeDetalleCurso").show();
	 $(".relDetalleCurso").show();
	 $(".archDetalleCurso").show();
	 $(".enlDetalleCurso").show();
	 $(".videoDetalleCurso").show();
	 $(".cargaDetalleCurso").remove();
	 $(".btnDetalleCurso").html(crearDivInformacionCurso(butonFinal,[]));
		
	 window.scrollTo(0,0);
      }
   }
   
   callAjaxPostNoLoad(URL+'/capacitacion/curso/evaluacion',dataParam,function(data){
      var eval = data.list;
      mostrarTodoDiv();
	
      if(eval.length==0){
         eval={
	    id: 0,
	    numIntentos: 0,
	    cursoId: cursoExamenActual.id,
	    puntajeAlcanzado: 0,
	    rating: 0,
	    trabajadorId: (sessionStorage.getItem("trabajadorGosstId"))
	      }
		
         if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
	    eval={
	       id: 0,
	       numIntentos: 0,
	       cursoId: cursoExamenActual.id,
	       puntajeAlcanzado: 0,
	       rating: 0,
	       contratistaAsociado: {id: (sessionStorage.getItem("contratistaGosstId"))}
		 }
         }
		
         cursoExamenActual.evaluacion = eval;
      }else{
         cursoExamenActual.evaluacion=eval[0];
      }
      
      //Rating Promedio
      var ratingProm = cursoExamenActual.ratingPromedio;
      var ratingPersonal = cursoExamenActual.evaluacion.rating;
      var textRatingPersonal = "";
      
      for(var i=0;i<5;i++){
         if(i < ratingPersonal){
	    textRatingPersonal+="<i class='fa fa-star fa-2x' id='ratingGosst"+(i+1)+"'></i>";
         }else{
	    textRatingPersonal+="<i class='fa fa-star-o fa-2x' id='ratingGosst"+(i+1)+"'></i>";
         }	
      }
	
      if(cursoExamenActual.evaluacion.id == 0){
         textRatingPersonal = "Sin evaluar";
      }
	
      $(".ratingDetalleCurso")
      .html("<table class='table tableCursoGosst table-bordered'>" +
	       "<thead>" +
	          "<tr><td>Valoración</td></tr>" +
	       "</thead>" +
	       "<tbody>" +
	          "<tr><td>Promedio: "+ratingProm+"</td></tr>" +
		  "<tr><td style='color:#19958e;'>Personal: "+textRatingPersonal+"</td></tr>"+"" +
	       "</tbody>" +
	    "</table>");
   });
 
   callAjaxPostNoLoad(URL+'/capacitacion/curso/relacionados/trabajador',dataParam,function(data){
      var relacionados = data.list;
	
      $(".relDetalleCurso")
      .html("<div class='divInformacionCurso'>" +
	       "<div class='divNombrePregunta'>Cursos relacionados</div>" +
	       "<div class='divDetalleInformacion'> </div>" +
	    "</div>");
      
      var listCursosTexto = [];
	
      relacionados.forEach(function(val,index){
	 var cursoRelacionadoId = val.id;
	 var evaluacion = val.evaluacion;
		
	 if(evaluacion == null){
	    evaluacion={
	       evaluacionNombre:"No",
	       puntajeAlcanzado:"--",
	       evaluacionId:2
	               }
	 }
		
	 if(evaluacion.evaluacionId != 1){
	    butonFinal="<button class='btn btn-success' onclick='alertMensajeCurso();'>" +
		          "<i class='fa fa-align-left'> </i>"+"&nbsp;Cursos pendientes" +
			  "&nbsp;<i class='fa fa-angle-right'> </i></button>";
	 }
		
	 listCursosTexto
	 .push(""+"<label style='font-size:21px'>"+val.nombre+"</label>"+
		  "<br> Puntaje Alcanzado: "+pasarDecimalPorcentaje(evaluacion.puntajeAlcanzado)+" "+
		  "<br> Puntaje Mínimo: " +pasarDecimalPorcentaje(val.puntajeMinimo/100)+
		  "<br><strong>"+evaluacion.evaluacionNombre+" Cumple </strong>");
      });

      $(".relDetalleCurso").html(crearDivInformacionCurso("Cursos relacionados",listCursosTexto));
      
      if(relacionados.length == 0){
         $(".relDetalleCurso").remove();
      }
	
      mostrarTodoDiv();
   });
	
   callAjaxPostNoLoad(URL+'/capacitacion/curso/objetivos',dataParam,function(data){
      var objetivos = data.list;
      var listObjetivoTexto=[];
		
      mostrarTodoDiv(); 
		
      objetivos.forEach(function(val,index){
         listObjetivoTexto.push(" &#8226; " +val.nombre); 
      });
      
      $(".objDetalleCurso").html(crearDivInformacionCurso("Objetivos del curso",listObjetivoTexto));
   });
	
   callAjaxPostNoLoad(URL+'/capacitacion/curso/archivos',dataParam,function(data){
      var archivos = data.list;
      var listArchivoTexto=[];
		
      mostrarTodoDiv(); 
		
      archivos.forEach(function(val,index){
         var archivoCursoId = val.id;
			
         listArchivoTexto.push(" "+val.nombre+" " +
	    (val.observacion == ""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+""+
	     "<br><br><a class='btn btn-success' target='_blank' href='"+URL + 
	     "/capacitacion/curso/archivo/evidencia?archivoId="+archivoCursoId+"''>" +
	     "<i class='fa fa-download'></i>Descargar</a>");
      });
		
      if(listArchivoTexto.length == 0){
//         listArchivoTexto.push("Este curso no tiene material en esta sección");
         $(".archDetalleCurso").hide();
      }else{
	 $(".archDetalleCurso").html(crearDivInformacionCurso("Material del curso",listArchivoTexto));  
      }
   });
	
   //Información de los enlaces habilitados
   callAjaxPostNoLoad(URL+'/capacitacion/curso/enlaces',dataParam,function(data){
      var enlaces=data.list;
      var listVideoTexto=[];
      var listEnlaceTexto=[];
		
      mostrarTodoDiv();  
      
      enlaces.forEach(function(val,index){
         var enlaceId = val.id;
			
         if(val.tipo.id == 1){
	    var test={
		   sugerencia:"",label:"Área",inputForm:"  ",divContainer:""
		     };
				
	    listVideoTexto.push(insertarImagenParaTablaMovil(val.imagenEvidencia,"100%","60px") +
	       " " +val.nombreMostrar+" "+(val.observacion==""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+"" +
	       "<br><br>" +
	       "<a class='btn btn-success' target='_blank' href='"+val.nombre+"'>"+textoBotonEnlace+"</a>");
         }else{
	    listEnlaceTexto.push(insertarImagenParaTablaMovil(val.imagenEvidencia,"100%","60px") +
	       " " +val.nombreMostrar+" "+(val.observacion==""?"":"<br> <strong>Detalle:</strong> "+val.observacion)+"" +
	       "<br><br>" +
	       "<a class='btn btn-success' target='_blank' onclick='seleccionarEnlaceApoyo("+enlaceId+")' " +
	       	  "href='"+val.nombre+"'>"+textoBotonEnlace+"</a>");
         }
      });
		
      if(listVideoTexto.length == 0){
//         listVideoTexto.push("Este curso no tiene material en esta sección" );
         $(".videoDetalleCurso").hide();
      }else{
	 $(".videoDetalleCurso").html(crearDivInformacionCurso("Video del curso",listVideoTexto));
      }
		
      if(listEnlaceTexto.length == 0){
//         listEnlaceTexto.push("Este curso no tiene material en esta sección" );
         $(".enlDetalleCurso").hide();
      }else{
	 $(".enlDetalleCurso").html(crearDivInformacionCurso("Enlaces de apoyo",listEnlaceTexto)); 
      }
   });
	
   //Info del profe
   callAjaxPostNoLoad(URL+'/capacitacion/curso/profesor',dataParam,function(data){
      var profesor = data.profesor;
		
      mostrarTodoDiv();  
		
//      var listProfesorTexto=[
//	     insertarImagenParaTablaMovil(profesor.foto,"200px","100%"),
//	     "<strong>Nombre:</strong> "+profesor.nombre+
//	     "<br><strong>Experiencia:</strong> "+profesor.experiencia+
//	     "<br><strong>Correo:</strong> "+profesor.correo
//	                    ];
      
      $(".profeDetalleCurso").html(crearDivInformacionCurso("Facilitador",
         ["<img src='data:image/png;base64,"+profesor.foto+"' " +
	       "style='float:right;max-height:140px;max-width:100%'>" +
          "<br><br><strong>Nombre:</strong> "+profesor.nombre+
	  "<br><strong>Experiencia:</strong> "+profesor.experiencia+
	  "<br><strong>Correo:</strong> "+profesor.correo+
	  "<br><br>"]));	
   });
}

function seleccionarEnlaceApoyo(enlaceId){
   var dataParam={
      id: enlaceId,
      trabajadorAsociadoId: getSession("trabajadorGosstId"),
      isSeleccionado: 1
   };
    
   callAjaxPostNoLoad(URL+'/capacitacion/curso/seleccionar',dataParam, 
   function(data){});
}

function verEncuestaCurso(){    
   var dataParam={
      id: cursoExamenActual.id
   };
    
   callAjaxPostNoLoad(URL+'/capacitacion/curso/consultar/enlace',dataParam,function(data){
      var validar = data.verificarNumEnlaces;
	
      if(validar == 1){
         //
	 window.scrollTo(0,0);
	 $(".divListPrincipal>div").hide();
	 $("#cursoEncuestaExamenMovil").show(); 
	
	 $("#cursoEncuestaExamenMovil").find(".contenidoSubList").html("").show();  
	 $("#cursoEncuestaExamenMovil").find(".tituloSubList")
	 .html(textoBotonVolverContenido+" Encuesta Curso '"+cursoExamenActual.nombre+"'");
	
	 var textoRatingList=[
	    "¿La plataforma es sencilla y manejable?",
	    "¿Considera que el contenido del curso es claro y entendible?",
	    "¿Considera que el curso tendrá un impacto positivo en su ambiente de trabajo?",
	    "En términos generales, ¿Cuán satisfecho se siente con el curso?",
	    "Bridanos tus comentario con respecto al curso. ¿Qué aspectos son " +
            "de mayor agrado y provecho para ti? y ¿Qué aspectos de mejoras consideras que se deben tomar?"
	 ];
         
	 var estrellasRating=
	    "<i class='fa fa-star-o fa-2x' style='color:rgba(6,141,133,0.92)' id='ratingGosst1'></i>" +
            "<i class='fa fa-star-o fa-2x' style='color:rgba(6,141,133,0.92)' id='ratingGosst2'></i>" +
	    "<i class='fa fa-star-o fa-2x' style='color:rgba(6,141,133,0.92)' id='ratingGosst3'></i>" +
	    "<i class='fa fa-star-o fa-2x' style='color:rgba(6,141,133,0.92)' id='ratingGosst4'></i>" +
	    "<i class='fa fa-star-o fa-2x' style='color:rgba(6,141,133,0.92)' id='ratingGosst5'></i>";
	 
	 var buttonEnviar = 
	    (cursoExamenActual.numPreguntas == 0?
	     "<button class='btn btn-success'>" +
	        "<i class='fa fa-paper-plane'></i> Prueba" +
	     "</button>":
	     "<button class='btn btn-success'>" +
	        "<i class='fa fa-paper-plane'></i> Enviar" +
	     "</button>");
	
	 textoRatingList.forEach(function(val,index){
	    if(index+1 == 5){
	       $("#cursoEncuestaExamenMovil").find(".contenidoSubList")
	       .append(crearDivInformacionCurso(val,["<textarea style='height:100px' id='comentarioRating' class='form-control'>" +
	       		                             "</textarea>"],"pregEncuesta"+(index+1)));
	    }else{
	       $("#cursoEncuestaExamenMovil").find(".contenidoSubList")
	       .append(crearDivInformacionCurso(val,["<div style='width:50%;display:inline-block'>Totalmente en desacuerdo</div>" +
                   		                     "<div style='width:50%;display:inline-block'>Totalmente de acuerdo</div>",
                   		                     estrellasRating],"pregEncuesta"+(index+1)));	 
	    }
	 });
		
	 $("#cursoEncuestaExamenMovil").find(".contenidoSubList")
	 .append("<div class='btnEmpezarCurso'>"+
		     crearDivInformacionCurso(buttonEnviar,[])+
		 "</div>"); 
	 
	 for(j = 1;j < 5;j++){
	    $("#pregEncuesta"+j+" i").hover(function(){
	       $(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
	       $(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
	       $(this).removeClass("fa-star").addClass("fa-star-o");
	       $(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
	       $(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
	       $(this).addClass("fa-star");
	       $(this).removeClass("fa-star-o");
	    }); 
	 }

	 $("#cursoEncuestaExamenMovil .btnEmpezarCurso button").on("click",function(){
	    var nivel_sencillo = 0;
	    var nivel_claro = 0;
	    var nivel_impacto = 0;
	    var rating = 0;
		
	    $("#pregEncuesta1 i").each(function(index,elem){
	       if($(elem).hasClass("fa-star")){
	          nivel_sencillo++;
	       }
	    });
		
	    $("#pregEncuesta2 i").each(function(index,elem){
	       if($(elem).hasClass("fa-star")){
		  nivel_claro++;
	       }
	    });
		
	    $("#pregEncuesta3 i").each(function(index,elem){
	       if($(elem).hasClass("fa-star")){
		  nivel_impacto++;
	       }
	    });
		
	    $("#pregEncuesta4 i").each(function(index,elem){
	       if($(elem).hasClass("fa-star")){
		  rating++;
	       }
	    }); 
		
	    cursoExamenActual.evaluacion.nivelSencillo = nivel_sencillo;
	    cursoExamenActual.evaluacion.nivelClaro = nivel_claro;
	    cursoExamenActual.evaluacion.nivelImpacto = nivel_impacto;
	    cursoExamenActual.evaluacion.rating = rating;
	    cursoExamenActual.evaluacion.sugerencia = $("#comentarioRating").val();
	    
	    if(cursoExamenActual.numPreguntas > 0){
	       empezarExamenCurso();
	    }else{
	       registrarEvaluacionCursoExonerado();
	    }
	 });
      }else{
	 mensajeUx="<br><label>Debe acceder a todos los enlaces de apoyo antes de " +
	 		      "pasar a Encuesta y Evaluación.</label>";
	 mensajesUx(mensajeUx,8,"");
      }
   });
}

function crearDivInformacionCurso(tittuloDiv,contenidoListDiv,idDiv){
   var textoIn="";
	
   contenidoListDiv.forEach(function(val,index){
      textoIn+="<div class='divSubDetalleInformacion' style='color:black;'>"+val+"</div>";
   });
   
   if(idDiv!=null){
      idDiv="id='"+idDiv+"'";
   }
	
   return "<div class='divInformacionCurso' "+idDiv+">" +
	     "<div class='divNombrePregunta'>"+tittuloDiv+"</div>" +
	     "<div class='divDetalleInformacion'>"+textoIn+"</div>" +
	  "</div>" ;
}

function crearDivExamenCurso(tittuloDiv,contenidoListDiv,idDiv){
   var textoIn="";
	
   contenidoListDiv.forEach(function(val,index){
      var clickFunction = "llenarRespuestaPreguntaCapacitacion(this)";
		
      if(val.isImagen){
         clickFunction = "";
      }
	
      textoIn+="<div class='opcionGosstCss' onclick='"+clickFunction+"' style='color:black;'>"+
		   val.nombre+
	       "</div>";
   });
   
   if(idDiv!=null){
      idDiv = "id='"+idDiv+"'";
   }
	
   return "<div class='divInformacionCurso' "+idDiv+ " >" +
	     "<div class='divNombrePregunta'>"+textoBotonTogglePregunta+tittuloDiv+"" +
	        "<br><label class='respuestaPregunta'></label>" +
	     "</div>" +
	     "<div class='divOpcionesGosst'>"+textoIn+"</div>" +
	  "</div>" ;
}

var resolviendoExamen = false;
var contadorNoIniciado = true;
var isForTrabajadorExterno = 0;

function empezarExamenCurso(pisForTrabajadorExterno){
   isForTrabajadorExterno = parseInt(pisForTrabajadorExterno);
	
   $(".divListPrincipal>div").hide();
   $("#cursoPreguntasExamenMovil").show(); 
	
   resolviendoExamen = true;
	 
   $("#cursoPreguntasExamenMovil").find(".contenidoSubList").show();
   $("#cursoPreguntasExamenMovil").find(".tituloSubList").html(" ");	
   $("#cursoPreguntasExamenMovil").find(".tituloSubList")
   .html("<div class='col-md-8'>" +
	    "<i class='fa fa-file-text-o' aria-hidden='true'></i>"+
	    " Examen del Curso "+cursoExamenActual.nombre+"<br>"+
	    "<div id='timerActual'></div>"+
	 "</div>" +
	 "<div class='col-md-4'>"+
	    "<i class='fa fa-check-circle-o' aria-hidden='true'></i>" +
	    " Intentos: "+cursoExamenActual.evaluacion.numIntentos+
	 "</div>");

   var cursoAux={
      id: cursoExamenActual.id,
      verImagenPregunta: 1
   };
	
   callAjaxPostNoLoad(URL+'/capacitacion/curso/preguntas',cursoAux,function(data){
      setTimeout(function(){
         var preguntasImagen = data.list;
        
         var preguntasObligadas = [],preguntasOpcionales = [];
		
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList").html("");  
		
         preguntasImagen.forEach(function(val,index){
	    if(val.isObligatorio == 1){
	       preguntasObligadas.push(val);
	    }else{
	       preguntasOpcionales.push(val);
	    }
         });
		
         shuffleTest(preguntasObligadas);
         shuffleTest(preguntasOpcionales);
         cursoExamenActual.preguntas = preguntasObligadas.concat(preguntasOpcionales);
		
         if(cursoExamenActual.numPreguntas == null || cursoExamenActual.numPreguntas == 0){
	    cursoExamenActual.numPreguntas = cursoExamenActual.preguntas.length;
         }
         
         var numPregCategoria1 = 0,numPregCategoria2 = 0,numPregCategoria3 = 0,indexCategoria = 0;
		
         cursoExamenActual.preguntas.forEach(function(val,index){
            var evaluarPregunta = false;
            
            if(cursoExamenActual.aplicarCategoria == 0 && index < cursoExamenActual.numPreguntas){
               evaluarPregunta = true;
            }else if(cursoExamenActual.aplicarCategoria == 1){
               if((val.categoria.id == 1 && numPregCategoria1 < cursoExamenActual.numPreguntasCategoria1) || 
        	  (val.categoria.id == 2 && numPregCategoria2 < cursoExamenActual.numPreguntasCategoria2) || 
        	  (val.categoria.id == 3 && numPregCategoria3 < cursoExamenActual.numPreguntasCategoria3)){
        	  evaluarPregunta = true; 
               }
            }
             
	    if(evaluarPregunta){
	       var opciones = val.opciones,textOpc = [],textImagen="";
	       val.isEvaluado = 1;val.ordenExamen = (cursoExamenActual.aplicarCategoria == 0?index+1:indexCategoria+1);
			
	       if(val.imagen != null){
		  textImagen = insertarImagenParaTablaMovil(val.imagen,"","100%");
		  textOpc.push({nombre:textImagen,isImagen:true});
	       }
			
	       opciones.forEach(function(val1,index1){
	          textOpc.push({nombre:"<input type='radio' name='optionFamily"+val.id+"' id='optionId"+val1.id+"' " +
	          		              "style='width:"+(isMobile.any() == true?"20%":"10%")+";height:2em;'>" +
				       "<label for='optionId"+val1.id+"' style='width:"+(isMobile.any() == true?
					      "80%":"90%")+";font-weight:bold;'>"+val1.nombre+"</label>",
				isImagen:false});
	       }); 
			
	       $("#cursoPreguntasExamenMovil").find(".contenidoSubList")
	       .append(crearDivExamenCurso((val.ordenExamen)+".&nbsp;"+val.nombre.split("|").join("<br>"),textOpc,"preguntaId"+val.id));
	       
	       if(cursoExamenActual.aplicarCategoria == 1){
		  if(val.categoria.id == 1){
		     numPregCategoria1++; 
		  }else if(val.categoria.id == 2){
		     numPregCategoria2++;  
		  }else if(val.categoria.id == 3){
		     numPregCategoria3++;  
		  }
		  
		  indexCategoria++;
	       }
	    }else{
	       val.isEvaluado = 0;
	    }
         });
		
         $("#cursoPreguntasExamenMovil").find(".contenidoSubList")
         .append("<div class='btnCompletarCurso'>" +
		     crearDivInformacionCurso("<button class='btn btn-success' style='font-size:18px;' " +
		     		                      "onclick='completarExamenCurso()'> " +
		     		                 "Completar Examen&nbsp;<i class='fa fa-angle-right'> </i>" +
		     		              "</button>",[]) +
		 "</div>");
         
         window.scrollTo(0,0);
         contadorNoIniciado = true;
         countdown();
      },2000)},preCargaExamenImagen,{});	
}

function llenarRespuestaPreguntaCapacitacion(obj){
   $(obj).find("input").prop("checked",true);
   var opcionTexto=$(obj).find("label").text(); 
   $(obj).parent(".divOpcionesGosst").hide();
   $(obj).parent(".divOpcionesGosst").parent(".divInformacionCurso").find(".respuestaPregunta").show().html(opcionTexto);
}

function preCargaExamenImagen(){	
   $("#cursoPreguntasExamenMovil").show(); 
   $("#cursoPreguntasExamenMovil").find(".contenidoSubList")
   .html('<i class="fa fa-spinner fa-pulse fa-2x" style="color:#19958E; font-size: 20px;" aria-hidden="true"></i>'+
	 "<strong style='color:#19958E;font-size: 20px; '>Procesando</strong>");
	 
   return true;
}

function countdown(id){    
   var hoy = new Date();
   var hoyAux = new Date();
   var fecha = cursoExamenActual.tiempoLimite;
    
   if(contadorNoIniciado){
      fecha = new Date(hoyAux.setSeconds(cursoExamenActual.tiempoSolucion*60*60));
      cursoExamenActual.tiempoLimite = fecha;
      contadorNoIniciado = false;
   }
    
   var dias = 0;
   var horas = 0;
   var minutos = 0;
   var segundos = 0;
   
   if((fecha >= hoy) && resolviendoExamen){
      var diferencia = (fecha.getTime()-hoy.getTime())/1000;
      dias = Math.floor(diferencia/86400)
      diferencia = diferencia-(86400*dias)
      horas = Math.floor(diferencia/3600)
      diferencia = diferencia-(3600*horas)
      minutos = Math.floor(diferencia/60)
      diferencia = diferencia-(60*minutos)
      segundos = Math.floor(diferencia);
       
      $("#cursoPreguntasExamenMovil .tituloSubList #timerActual")
      .html('<label>  Quedan ' + horas + ' Horas, ' + minutos + ' Minutos, ' + segundos + ' Segundos</label>')

      if((horas>0 || minutos>0 || segundos>0)){
         setTimeout(countdown,1000) 
      }else{
         completarExamenCurso();
      }
   }else{
   }
}

function completarExamenCurso(){
   $(".divListPrincipal>div").hide();
   $("#cursoResultadoExamenMovil").show();
   $("#cursoResultadoExamenMovil").find(".contenidoSubList").show();
	
   resolviendoExamen = false;
	
   cursoExamenActual.preguntas.forEach(function(val,index){
      var opciones = val.opciones;
		
      opciones.forEach(function(val1,index1){
	 val1.isCorrecto=($("#optionId"+val1.id).is(':checked')?1:0);
      });
   });
	
   cursoExamenActual.evidencia = null;
	
   if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
      cursoExamenActual.contratistaAsociado = {id: (sessionStorage.getItem("contratistaGosstId"))};
      cursoExamenActual.trabajadorAsociadoId = null;		
   }else if(parseInt(getSession("accesoUsuarios")) == 6 || parseInt(getSession("accesoUsuarios")) == 13){
      //Se asigna el id desde el backend
      console.log("****NUMERO 6 || NUMERO 13****");
      console.log("*****> "+parseInt(getSession("accesoUsuarios")));
      cursoExamenActual.trabajadorAsociadoId = null;
      cursoExamenActual.contratistaAsociado = null;
   }else{
      //Id del colaborador
      cursoExamenActual.trabajadorAsociadoId = parseInt(getSession("trabajadorGosstId"));
      cursoExamenActual.contratistaAsociado = null;
   }
	
   cursoExamenActual.preguntas.sort(function(a,b){ 
      return (a.id - b.id); 
   });
	
   callAjaxPost(URL+'/capacitacion/curso/preguntas/evaluacion',cursoExamenActual,function(data){
      setTimeout(function(){
         cursoExamenActual.evaluacion.id = data.list.evaluacion.id;
        
         enviarRatingCurso(cursoExamenActual.evaluacion);
		
         var cursoCorregido = data.list;
         var textResult = (cursoCorregido.evaluacion.isAprobado == 1?"APROBADO":"DESAPROBADO");
         var colorTextResult = (cursoCorregido.evaluacion.isAprobado == 1?"blue":"red");
         var textCertiAux = (parseInt(getSession("gestopcompanyid")) == 647?"":"<br> No es necesario enviar al área SST");
         var textCerti = 
            (cursoCorregido.evaluacion.isAprobado == 1?
             "<button onclick='descargarCertificadoCurso("+cursoExamenActual.id+")' class='btn btn-success'>" +
                "Descargar Certificado" +
        	 textCertiAux +
             "</button>":"");
         
         textCerti = (cursoExamenActual.wantsCertificado == 1?textCerti:"No disponible");
		
         var textPreg="";
         var numPreguntasMalas = 0;
		
         $(".containerResultadosGosst")
	 .html("<div class='tituloResultado'></div><br>" +
	       "<div class='divCertificadoResultado'></div>" +
	       "<div class='divPreguntasMalas'></div>");
		
         cursoCorregido.preguntas.sort(function(a,b){ 
	    return (a.ordenExamen - b.ordenExamen) ; 
         });
		
         cursoCorregido.preguntas.forEach(function(val,index){
	    if(val.evaluacionCorrecta == 0){
	       numPreguntasMalas++;
				
	       var opciones = val.opciones;
	       var textOpc = "";
				
	       opciones.forEach(function(val1,index1){
		  if(val1.isCorrecto){
		     textOpc+="<div class='opcionGosstCss'>" +
				 "<label for='optionId"+val1.id+"' style='color:black;'>"+val1.nombre+"</label>" +
			      "</div>";
		  }
	       });
			
	       textPreg+="<div class='divPreguntaCurso row'>" + 
			    "<div class='divNombrePregunta' style='color:black;'>" +
			     iconoGosst.desaprobado+" "+(index+1)+".&nbsp;"+val.nombre +
			    "</div>" + 
			    "<br>"+textOpc +
			    "<div class='opcionGosstCss justificacionGosst'>" +
			       "<strong style='color:black;'>" +
			          "Usted marcó otra alternativa." +
			          (val.justificacion.length == 0?"":"<br>*Justificación:") +
			       "</strong> "+val.justificacion +
			    "</div>" +
			 "</div>";
	    }else{
	       var opciones = val.opciones;
	       var textOpc = "";
				
	       opciones.forEach(function(val1,index1){
	          if(val1.isCorrecto){
		     textOpc += "<div class='opcionGosstCss'>" +
		     		   "<label for='optionId"+val1.id+"' style='color:black;'>"+val1.nombre+"</label>" +
		     		"</div>";
		  }
	       });
				
	       textPreg+="<div class='divPreguntaCurso row'>" +
	                    "<div class='divNombrePregunta' style='color:black;'>" +
	                     iconoGosst.aprobado+" "+(index+1)+".&nbsp;"+val.nombre +
	                    "</div>" + 
			    "<br>"+textOpc +
			    "<div class='opcionGosstCss correctoGosst'>" +
			       "<strong style='color:black;'>Usted marcó correctamente.</strong>"+
			    "</div>"+
			 "</div>";
	    }
         });
		
         var porce = pasarDecimalPorcentaje(1-(numPreguntasMalas/cursoCorregido.preguntas.length),2);
		 
         $("#cursoResultadoExamenMovil").find(".contenidoSubList").html("");
	 
         $("#cursoResultadoExamenMovil").find(".tituloSubList")
         .html("<button class='btn btn-success' style='float:left' " +
                       "onclick='"+(parseInt(getSession("accesoUsuarios")) == 6?
        	                   "habilitarInduccionesTrabajadorContratista()":
        	                      (parseInt(getSession("accesoUsuarios")) == 13?
        	                      "habilitarInduccionesVisitante()":
        	                      "habilitarCapacitacionOnlineUsuario()"))+"'>" +
                  "<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i>" +
               "</button> Evaluación completa");
         
         var textResultExamen;
         
         textResultExamen = 
  	    "<label style='color:"+colorTextResult+"'>"+textResult +
  	        (parseInt(getSession("gestopcompanyid")) == 647?": "+
                 ((1-(numPreguntasMalas/cursoCorregido.preguntas.length))*20).toFixed(0)+" PUNTOS":" (" +porce+") ") +
            "</label>" +
             ([6,13].includes(parseInt(getSession("accesoUsuarios"))) && cursoCorregido.evaluacion.isAprobado == 1?"<br><br>" +
              "<button class='btn btn-success' style='font-size:18px;' onclick='subirCargoExamenCursoAprobado()'> " +
	         "<i class='fa fa-upload fa-lg'></i> Subir cargo" +
	      "</button>":"");
         
         $("#cursoResultadoExamenMovil").find(".contenidoSubList").append(
            crearDivInformacionCurso("Resultado del examen",[textResultExamen]) +
  	    crearDivInformacionCurso("Certificado",[textCerti]) + 
  	    crearDivInformacionCurso("Respuestas correctas",[textPreg]));
		
		if([6,13].includes(parseInt(getSession("accesoUsuarios"))) && cursoCorregido.evaluacion.isAprobado == 1){
			mensajeUx="<label>¡Ya casi termina! Solo debe subir el cargo para finalizar su inducción.</label>";
			mensajesUx(mensajeUx,1,"",""); 	
		}
      },2000);
   },algoCHido,{},null,null,false);
}

function algoCHido(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img>'
	      +'Procesando resultados del examen...'});
	 
   $("#cursoResultadoExamenMovil").find(".contenidoSubList")
   .html('<i class="fa fa-spinner fa-pulse fa-2x" aria-hidden="true"></i>'+
	 "Procesando");  
}

function enviarRatingCurso(objectEvaluacion){
   callAjaxPostNoLoad(URL+'/capacitacion/curso/rating/trabajador',objectEvaluacion,function(data){
      $(".ratingCursoResultado").html("GRACIAS POR TU OPINIÓN<br>")
   },function(){
      $(".ratingCursoResultado")
      .html('<i class="fa fa-spinner fa-pulse fa-2x" style="color:#19958E;font-size:20px;" aria-hidden="true"></i>'+
	    "<strong style='color:#19958E;font-size:20px;'>Procesando</strong>");
   },{});	
} 

function descargarCertificadoCurso(cursoId,trabajadorId){
   var trabId = getSession("trabajadorGosstId");
   var contratistaId = getSession("contratistaGosstId");
	
   if(parseInt(getSession("accesoUsuarios")) == 2){
      trabajadorId = typeof trabajadorId !== 'undefined' ? trabajadorId : contratistaId;
		
      window.open(URL+"/capacitacion/curso/contratista/certificado?contratistaId="+contratistaId+
	          "&cursoId="+cursoId,'_blank');
   }else{
      trabajadorId = typeof trabajadorId !== 'undefined' ? trabajadorId : trabId;
      
      if(trabajadorId && trabajadorId !== 'null' && cursoId && cursoId !== 'null'){
	        window.open(URL
			+ "/capacitacion/curso/certificado?trabajadorId="+trabajadorId+"&cursoId="
			+ cursoId , '_blank');
        }else{
		alert("Error al cargar la información.");
	    }
   }	
}

function alertMensajeCurso(){
   alert("Faltan aprobar cursos.");
}

function alertarCertificado(){
   alert('No fue aprobado.');
}

function registrarEvaluacionCursoExonerado(){
   var dataParam={
          cursoId: cursoExamenActual.evaluacion.cursoId,
          trabajadorId: parseInt(getSession("trabajadorGosstId")),
          isAprobado: 1,
          numIntentos: 1,
          puntajeAlcanzado: 0.9999,
          nivelSencillo: cursoExamenActual.evaluacion.nivelSencillo,
          nivelClaro: cursoExamenActual.evaluacion.nivelClaro,
          nivelImpacto: cursoExamenActual.evaluacion.nivelImpacto,
          rating: cursoExamenActual.evaluacion.rating,
          sugerencia: cursoExamenActual.evaluacion.sugerencia
                 };
   
   callAjaxPost(URL+'/capacitacion/curso/exonerado/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":  
	    mensajeUx="<label>No es necesario realizar la evaluación.<br><br>" +
	    	      "Regresará a la vista principal de la sección Capacitación online.</label>";
	    mensajesUx(mensajeUx,1,"","ActualizarVistaCapOnlVisTra");
		    
	    $("#modalMensajeUxActualizarVistaCapOnlVisTra").on("hidden.bs.modal",function(){
		marcarIconoModuloSeleccionado(8);
	    });	
	    break;
		   
         default:
	    alert("Ocurrió un error al guardar!");
      }
   }); 
}

function ocultarSubirCargoExamenCursoAprobado(){
   $("#modalSubirCargoVirtual").modal("hide");
}

function subirCargoExamenCursoAprobado(){
   $("#modalSubirCargoVirtual").remove();
    
   var contenido = "";
   
   var hrefContenido = (parseInt(getSession("accesoUsuarios")) == 6?
      "/empresa/documento/evidencia?id="+parseInt(getSession("gestopcompanyid"))+"&tipoId="+(cursoExamenActual.examen.tipo.id == 3?7:16):
      "/empresa/documento/evidencia?id="+parseInt(getSession("gestopcompanyid"))+"&tipoId="+4);
  				
   var listContenido=[
      {sugerencia:"",label:"Plantilla cargo para firmar",
       inputForm:"<a target='_blank' href='"+URL+hrefContenido+"' class='efectoLink'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</a>"},
      {sugerencia:"",label:"Cargo firmado",inputForm:"",divContainer:"divEviSubirCargoVirtual"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          	     "onclick='ocultarSubirCargoExamenCursoAprobado()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
       		         "onclick='guardarSubirCargoExamenCursoAprobado()'>" +
  	            "<i class='fa fa-floppy-o'></i> Guardar" +
  	         "</button>"}
   ]; 
  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
  		
   var modalOptionsDocPerExt={
      id:"modalSubirCargoVirtual",
      nombre:"<i class='fa fa-upload fa-lg'></i> Subir Cargo",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
  				
   crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){},true,true);
   
   var options={
      container: "#divEviSubirCargoVirtual",functionCall: function(){
         validacionSubirEvidencia("SubirCargoVirtual",bitsEvidenciaExamen,"modalSubirCargoVirtual");
      },descargaUrl: "",esNuevo: true,idAux: "SubirCargoVirtual",evidenciaNombre: ""
   };
			
   crearFormEvidenciaCompleta(options);
}

function guardarSubirCargoExamenCursoAprobado(){
    var campoVacio = true;
    var cargoNombre = $("#inputEviSubirCargoVirtual").val();
    
    if(cargoNombre.length == 0){
       	mensajeUx = "<label>Debe subir la evidencia.</label>";campoVacio = false;
    }else if(cargoNombre == "VOLVER A SUBIR"){
      	mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      	campoVacio = false;
    }
    
    if(campoVacio){
	if(parseInt(getSession("accesoUsuarios")) == 6){
	    guardarEvidenciaAutoVersionS3(1,cursoExamenActual.evaluacion.id,"fileEviSubirCargoVirtual",bitsEvidenciaExamen,
	    1,1,"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo/save","contratista-has-examen-trabajador/evidencia-cargo",function(){
		$("#modalSubirCargoVirtual").modal("hide");
		 			
		mensajeUx = "<label>El cargo fue registrado con éxito.</label>";
		mensajesUx(mensajeUx,1,"","ActualizarExamenVirtual");
					   
		$("#modalMensajeUxActualizarExamenVirtual").on("hidden.bs.modal",function(){
		    habilitarInduccionesTrabajadorContratista();
		    
		    $("#modalSubirCargoVirtual").remove();
		});
	    });
	}else{
	    guardarEvidenciaAutoVersionTres(1,cursoExamenActual.evaluacion.id,"fileEviSubirCargoVirtual",bitsEvidenciaExamen,
	    1,1,"/public/visitante/induccion_virtual/evidencia/cargo/save",function(){
		$("#modalSubirCargoVirtual").modal("hide");
			 			
		mensajeUx = "<label>El cargo fue registrado con éxito.</label>";
		mensajesUx(mensajeUx,1,"","ActualizarExamenVirtual");
						   
		$("#modalMensajeUxActualizarExamenVirtual").on("hidden.bs.modal",function(){
		    habilitarInduccionesVisitante();
			    
		    $("#modalSubirCargoVirtual").remove();
		});
	    });
	}
    }else{
        $("#modalSubirCargoVirtual").modal("hide");
        mensajesUx(mensajeUx,2,"","ActualizarExamenVirtual");
       
        $("#modalMensajeUxActualizarExamenVirtual").on("hidden.bs.modal",function(){
            $("#modalSubirCargoVirtual").modal("show");
        }); 
    }
}

function verQuicksightCapacitacionOnline(){
   $("#divQuickSightCapOnline").remove();$("#wrapperConsolidadoTrabajadoresAsignadosCO").remove();
   $(".divContainerGeneral").hide();

   var buttonVolver = "<button type='button' class='btn btn-info' style='margin-right:10px;' onclick='volverVistaTraConTraAsig()'>" +
         "<i class='fa fa-2x fa-sign-out fa-rotate-180'></i>" +
      "</button>";

   $("body").append(
      "<div id='divQuickSightCapOnline' style='padding-left:40px;'>" +
         "<form class='form-inline' id='formBtnGeneral'>"+buttonVolver+"</form>" +
         "<div class='container-fluid' id='divContainQuickSightCapOnline' style='padding-right:40px;padding-left:0px;'></div>" +
      "</div>");

    tituloAnteriorColaborador = $(".divTituloGeneral h4").text();
    $(".divTituloGeneral h4").html("QuickSight - Capacitación online");

    cargarQuicksightCapacitacionOnline();
 }

 function cargarQuicksightCapacitacionOnline(){
    $('#divContainQuickSightCapOnline').html('<div class="loading">Cargando...</div>');

    var dataParam={
       idEmpresa:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPost(URL+'/quicksight/capacitacion_online',dataParam,function(data){
       if(data.CODE_RESPONSE === "05"){
          var urlDelIframe = data.embedUrl;

          var $iframe = $('<iframe>',{
                src:urlDelIframe,width:'100%',height:'750px',frameborder:'0',css:{border:'none'}
             }).on('load',function(){
                $('.loading').remove();
                console.log('El contenido de QuickSight ha terminado de cargar.');
             });

             $('#divContainQuickSightCapOnline').empty().append($iframe);
       }else{
          console.log("No se pudieron cargar los datos asociado a las capacitaciones online.");
          $('#divContainQuicksightActos').html('<div class="error">Error al cargar los datos.</div>');
       }
    });
 }
 