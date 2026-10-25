var banderaEdicion;
var capacitacionId;
var capacitacionNombre;
var capacitacionTipo;
var clasificacionId;
var listClasificacion;
var listCapacitacionTipo;
var listCategoriaCapacitacion;
var listTiposVigencia;
var contador2 = 0;
var listValidarEstado=[{id:-1,nombre:"Todos"},
                       {id:1,nombre:"Activo"},
                       {id:0,nombre:"Cesado"}];
var listCaps;
var listCursos= [];
var asigAux= [];
var vigAux= [];
var asigAuxCorreo= [];
var vigAuxCorreo= [];
var asigAuxNombre= [];
var vigAuxNombre= [];
var listProfesor=[];
var listFullFormaciones;
var listTrabajdores;
var listanombretab;
var capacitacionObj;
var userAgent = isMobile.any();

var listCategoriaCapacitacionId=[];

var listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
    listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[];

var mensajeUx;

$(document).ready(function(){ 
   insertMenu();
   
   if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){
      crearFiltroCapacitacionOnline(valoresFiltroCapacitacionOnline);
   }else{
      cargarPrimerEstado(); 
   }
   
   resizeDivWrapper("wrapper",160);resizeDivWrapper("wrapperEval",200);
   resizeDivWrapper("wrapTrabEvalCurso",220);resizeDivWrapper("progCursosDiv",160);
	
   $("#btnClipboardEvals").on("click",function(){
      var textoTabla = obtenerDatosTablaEstandarNoFija("tblEvalsCurso");
      copiarAlPortapapeles(textoTabla,"btnClipboardEvals");
      alert("Se ha guardado al clipboard la tabla.");
   });
	
   $("#btnClipboardResum").on("click",function(){
      var texto = obtenerDatosTablaEstandarNoFija("tblResumenCurso");
      copiarAlPortapapeles(texto,"btnClipboardResum");
      alert("Se han guardado al clipboard la tabla.");
   });
	
   $("#btnClipTablaCurso").on("click",function(){
      var texto = obtenerDatosTablaEstandarNoFija("tblCurso");
      copiarAlPortapapeles(texto,"btnClipTablaCurso");
      alert("Se han guardado al clipboard la tabla.");
   });
	
   var dataParam={
      empresaId: getSession("gestopcompanyid")
   } 
	
   callAjaxPost(URL+'/capacitacion/curso/filtro',dataParam,function(data){
      listCaps = data.listCaps;
			
      listCaps.forEach(function(val){
         listCursos = listCursos.concat(val.cursos);
      });

      var selValidarEstado = crearSelectOneMenuOblig("selValidarEstado","",
	 listValidarEstado,1,"id","nombre");
		    
      var contenido = "";
			
      var listContenido=[
         {sugerencia:"",label:"Estado",inputForm: selValidarEstado},
         {sugerencia:"",label:"Cursos",inputForm:"",divContainer: "divFiltroCursos"},
         {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroCursos()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
                "</button>",
  	  inputForm:"<button class='btn btn-success' type='button' onclick='verResumenCursos()'>" +
  	  	       "<i class='fa fa-filter'></i> Aplicar filtro" +
  	  	    "</button>"}
      ]; 
			
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
			
      var modalOptions={
	 id: "modalFiltroCursos",
	 nombre: "<i class='fa fa-filter'></i>Filtros",
	 contenido: contenido
      };
			
      crearModalPrincipalUsuario(modalOptions,function(){
         if($("#selMulFiltroCursos").length > 0){
	    return;
         }
			    
         crearSelectOneMenuObligMultipleCompleto("selMulFiltroCursos","",listCursos,
            "id","nombre","#divFiltroCursos","Todos");
      },false);
			
      $("#modalFiltroCursos").modal("hide");
   });
	
   $(document).on("click","#btnClipTabla",function(){
      var fullDatosTabla = "";
      
//      $(".fix-head #"+"tblCap"+" thead tr").each(function(index){   
//         $(this).children("th").each(function(index2){
//	    if(index2 < 7){
//	       fullDatosTabla = fullDatosTabla + $(this).text()+"\t";
//	    }
//         });
//			         
//         fullDatosTabla = fullDatosTabla+"\n";
//      });
				 
      for(index = 0;index < listFullFormaciones.length;index++){
         if(listFullFormaciones[index].capacitacionTipoId == 5){
//	    var lastListAprobadosReal = dividirLista(listFullFormaciones[index].lastListTrabVigentesAprobados);
            var indicadorTrabAsig = (listFullFormaciones[index].tipoVisitante.id == -1?
      	       listFullFormaciones[index].numTrabAsignadosAprobadosTotal+"//"+listFullFormaciones[index].numTrabAsignadosTotal:"------");
            var indicadorTraProg = (listFullFormaciones[index].tipoVisitante.id == -1?
      	       listFullFormaciones[index].numProgramacionesRealizadas+"//"+listFullFormaciones[index].numProgramacionesPlaneadas:"------");
      		       						
	    fullDatosTabla = fullDatosTabla +
	       listFullFormaciones[index].capacitacionNombre.replace("\t","")+"\t" +
               listFullFormaciones[index].clasificacionNombre.replace("\t","")+"\t" +
               listFullFormaciones[index].responsable.replace("\t","")+"\t" +
               listFullFormaciones[index].tema.replace("\t","")+"\t" +
               (listFullFormaciones[index].vigencia.id == null?"------":listFullFormaciones[index].vigencia.nombre)+"\t" +
	       indicadorTrabAsig+""+"\t" +
	       indicadorTraProg+"\n";
         }
      }
				
      copiarAlPortapapeles(fullDatosTabla); 
				
      alert("Se han guardado al clipboard la tabla de este módulo");	
   });
});

function ocultarFiltroCapacitacionOnline(){
   $("#modalFiltroCapOnline").modal("hide");
}

function verFiltroCapacitacionOnline(){
   $("#modalFiltroCapOnline").modal("show");
   $("#modalFiltroCapOnline .modal-body").show();
}

var listCategoriaCapacitacionAux=[];
var valoresFijosCategoriaAux;

function crearFiltroCapacitacionOnline(functionCallBack){
   var dataParam={}; 
	  		
   callAjaxPost(URL+'/capacitacion/filtro_admin',dataParam,function(data){
      listCategoriaCapacitacionAux = data.listCategoriaCapacitacion;
      valoresFijosCategoriaAux = data.valoresFijosCategoria;
 
      if(valoresFijosCategoriaAux != 0){
	 listCategoriaCapacitacionAux.forEach(function(val){
	    if((valoresFijosCategoriaAux == 1 && (val.id == 1 || val.id == 2)) || 
	       (valoresFijosCategoriaAux == 2 && val.id == 4)){
	       val.selected = 1;
	    }    
	 });
      }
	   
      var contenido = "";
  				
      var listContenido=[
         {sugerencia:"",label:"Categoría",inputForm:"",
          divContainer:"divFiltroCategoriaCapOnline"},
  	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
  	 {sugerencia:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
          		"onclick='ocultarFiltroCapacitacionOnline()'>" +
               	   "<i class='fa fa-times'></i> Cancelar" +
               	"</button>",
  	  inputForm:"<button id='btnAplicarFiltroCapOnline' class='btn btn-success' " +
  	  		    "type='submit' style='font-size:18px;float:right;' " +
  	      		    "onclick='valoresFiltroCapacitacionOnline()'>" +
  	               "<i class='fa fa-filter'></i> Aplicar filtro" +
  	            "</button>"},
      ]; 
  				
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
   	
      var modalOptionsDocPerExt={
 	 id: "modalFiltroCapOnline",
 	 nombre: "<i class='fa fa-filter'></i> Filtros",
  	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
  				
      crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){
	 if($("#filtroCategoriaCapOnline").length > 0){
	    return;
	 }
	                   
	 crearSelectOneMenuObligMultipleCompleto("filtroCategoriaCapOnline","",listCategoriaCapacitacionAux,
	    "id","nombre","#divFiltroCategoriaCapOnline","Todos");
      },true,true);
   				
      $("#btnAplicarFiltroCapOnline").on("click",function(){
	 ocultarFiltroCapacitacionOnline();
      });
  	
      $("#modalFiltroCapOnline").modal("hide");
      functionCallBack();
   });
}

function valoresFiltroCapacitacionOnline(){
   listCategoriaCapacitacionId = [];  
   var categoriaCapacitacionId = $("#filtroCategoriaCapOnline").val(); 
   
   if(categoriaCapacitacionId != null){
      categoriaCapacitacionId.forEach(function(val){
	 listCategoriaCapacitacionId.push(parseInt(val));
      });
   }
   
   cargarPrimerEstado();
}

function ocultarModalConsolidadoExcelFormacion(){
   $("#modalConsolidadoExcel").modal("hide");
}

function verModalConsolidadoExcelFormacion(){
   $("#modalConsolidadoExcel").remove();
   
   var selEstadoActivo = crearSelectOneMenu("selEstadoActivo","",
      listBoolean,1,"id","nombre","Todos");
    
   var contenido = "";
    
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha inicio",
       inputForm:"<input type='date' class='form-control' id='dateInicioConsolidadoInsEmpresa'>",divContainer:""}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha fin",
       inputForm:"<input type='date' class='form-control' id='dateFinConsolidadoInsEmpresa'>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Capacitación online",inputForm:"",divContainer:"divFiltroFormacionesCapOnline"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Categoría",inputForm:"",divContainer:"divGenerarExcelConsolidadoCapOnline"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
       label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS DE LOS TRABAJADORES ***</span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Activo en la empresa?",inputForm:selEstadoActivo},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarModalConsolidadoExcelFormacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='button' style='float:right;font-size:18px;' " +
             		 "onclick='consolEmpresaExcelFormacion()'>" +
               	    "<i class='fa fa-file-excel-o'></i> Generar" +
               	 "</button>"}
   ];
               	        
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
               	 
   var modalOptions={
      id: "modalConsolidadoExcel",
      nombre: "<i class='fa fa-list-alt'></i> Consolidado Formación online",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
               	 
   crearModalPrincipalUsuario(modalOptions,function(){
      crearSelectOneMenuObligMultipleCompleto("opcionExcelConsolidadoCategoriaCapOnline","",
 	 listCategoriaCapacitacionAux,"id","nombre","#divGenerarExcelConsolidadoCapOnline","Todos");
      
      crearSelectOneMenuObligMultipleCompleto("selMulFiltroFormacionesCapOnline","",listCapacitacionOnlineAux,
	 "capacitacionId","capacitacionNombre","#divFiltroFormacionesCapOnline","Todos");
   },true,true);
     
   var hoy = getSession("fechaHoyOrdenInversoTexto");
               		
   $("#dateInicioConsolidadoInsEmpresa").val(sumaFechaDias(-30,hoy));
   $("#dateFinConsolidadoInsEmpresa").val(sumaFechaDias(7,hoy));
    
   $("#modalConsolidadoExcel").modal("show");
}

function consolEmpresaExcelFormacion(){
   var estadoActivoId = $("#selEstadoActivo").val();
    
   var listCategoriasCapId = [];
   var categoriasId = $("#opcionExcelConsolidadoCategoriaCapOnline").val();
     
   if(categoriasId != null){
      categoriasId.forEach(function(val){
	 listCategoriasCapId.push(parseInt(val));
      });
   }
   
   var listFormacionesId = [];
   var formacionesId = $("#selMulFiltroFormacionesCapOnline").val();
    
   if(formacionesId != null){
      formacionesId.forEach(function(val){
	 listFormacionesId.push(parseInt(val));
      });
   }
 
   window.open(URL+"/capacitacion/online/consolidado/excel?empresaId="+getSession("gestopcompanyid") +
      "&fechaInicio="+$("#dateInicioConsolidadoInsEmpresa").val()+"&fechaFin="+$("#dateFinConsolidadoInsEmpresa").val() +
      "&listCategoriasId="+(listCategoriasCapId.length == 0?"-1":listCategoriasCapId)+"&estadoActivoId="+estadoActivoId +
      "&listCapacitacionesId="+(listFormacionesId.length == 0?"-1":listFormacionesId)); 
}

function verFiltroCursos(){
   $("#modalFiltroCursos").modal("show");
   $("#mdCursoFecha").modal("hide");	
}

function ocultarFiltroCursos(){
   $("#modalFiltroCursos").modal("hide");
   $("#mdCursoFecha").modal("show");
}

function verResumenCursos(){
   var valorResize= 160;
   resizeDivWrapper("wrapperCurso",valorResize);
        
   var listCursosId = [];
   
   var cursoId = $("#selMulFiltroCursos").val();
   if(cursoId != null){
      cursoId.forEach(function(val){
         listCursosId.push(parseInt(val));
      });
   }
    
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      validarEstado: ($("#selValidarEstado").val() == -1?
	              -1:($("#selValidarEstado").val() == 1?1:0)),
      listCursosIdFiltro: (listCursosId.length == 0?null:listCursosId)
   };
	
   $("#mdCursoFecha").modal("show");
   $("#modalFiltroCursos").modal("hide");
   $("#mdCursoFecha").find(".modal-body").hide();
   $("#mdCursoFecha").find(".modal-title").html("Resumen Cursos de la empresa");
   $("#mdCursoFecha").find("#modalResumenCurso").show();
	
   callAjaxPost(URL+'/capacitacion/cursos/resumen',dataParam,function(data){
      var caps = data.caps;
      var trabs = data.trabs;
		
      $("#tblResumenCurso tbody").html("");
      $("#tblResumenCurso thead").html("");
	
      $("#tblResumenCurso thead").append(
         "<tr>" +
	    "<td class='tb-acc' style='width:170px'>DNI </td>" +
	    "<td class='tb-acc' style='width:270px'>Trabajador</td>" +
	    "<td class='tb-acc' style='width:140px'>Estado </td>" +
	 "</tr>");
		
      // Imprimir nombre de los campos - Parte superior
      caps.forEach(function(val,index){
         val.cursos.forEach(function(val1,index1){
	    $("#tblResumenCurso thead tr").append(
	       "<td class='tb-acc' style='width:170px'>"+val1.nombre+"</td>");
         });
      });
		
      // Mostrar el contenido de la tabla	
      trabs.forEach(function(val,index){
         $("#tblResumenCurso tbody").append(
            "<tr id='trabRes"+val.trabajadorId+"'>" +
	       "<td>"+val.dni+"</td>" +
	       "<td>"+val.trabajadorNombre+"</td>" +
	       "<td>"+(val.fechaRetiroTexto == null?"Activo":"Cesado")+"</td>" +
	    "</tr>");
			
         caps.forEach(function(val2,index2){
	    val2.cursos.forEach(function(val1,index1){
	       $("#tblResumenCurso tbody #trabRes"+val.trabajadorId).append(
	          "<td id='cursoRes"+val1.id+"'>"+"----"+"</td>");
	    });
         });
			
         val.caps.forEach(function(val2,index2){
	    val2.cursos.forEach(function(val1,index1){
	       var cssAux={color:"black"};
	       var certificadoNombre="";
	       var textoIn="";
					
	       if(val1.evaluacion == null){
	          textoIn = "Pendiente";
	       }else{
		  var diasDif = restaFechasNormales(obtenerFechaActualNormal(),val1.evaluacion.fechaValidaTexto);
						 
		  if(diasDif >= 0){
		     if(val1.evaluacion.evaluacionId == 1){
		        certificadoNombre =
			   "<i onclick='javascript:descargarCertificadoCurso("+val1.id+","+val.trabajadorId+")' " +
			      "class='fa fa-certificate fa-2x aprobado-gosst' title='Descargar Certificado'></i>" ;
							 
		        cssAux={"color":"green","font-weight":"800"}; 
		     }else{
			cssAux={"color":"red","font-weight":"800"}; 
		     }
								
		     textoIn = val1.evaluacion.evaluacionNombre+certificadoNombre;
		  }else{
		     cssAux={"font-weight":"800"}; 
		     textoIn = "Por Renovar";
		  }
	       }
					
	       $("#tblResumenCurso tbody #trabRes"+val.trabajadorId+" #cursoRes"+val1.id+"").html(textoIn).css(cssAux);
	    });
         });
      });

      goheadfixedY("#tblResumenCurso","#wrapperCurso");
   });             
}

var htmlVideo;
var listTipoVisitanteCapacitacion = [];

function cargarPrimerEstado(){
   banderaEdicion = false;
   
   capacitacionId = 0;capacitacionTipo = 0;clasificacionId = 0;
	
   removerBotones();crearBotones();
   
   if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){
      $("#fsBotones").append(
         "<button id='btnFiltroCapacitacionOnline' onclick='verFiltroCapacitacionOnline()' " +
	         "type='button' class='btn btn-success' title='Filtro'>" +
            "<i class='fa fa-filter fa-2x'></i>" +
         "</button>");
   }
	
   $("#fsBotones").append(
      "<button id='btnProgFecha' type='button' class='btn btn-success' title='Programar Fecha'>" + 
         "<i class='fa fa-calendar fa-2x'></i>" + 
      "</button>");
	
   $("#fsBotones").append(
      "<button id='btnProfeCursos' type='button' class='btn btn-success' title='Profesores'>" +
         "<i class='fa fa-user fa-2x'></i>" + 
      "</button>");
	
   $("#btnProfeCursos").on("click",function(){
      verProfesoresTrabajador();
   });
	
   $("#fsBotones").append(
      "<button id='btnResumenCurso' type='button' class='btn btn-success' title='Resumen Cursos'>" +
         "<i class='fa fa-book fa-2x'></i>" + 
      "</button>");
	
   $("#btnResumenCurso").on("click",function(){
      verResumenCursos();
   });
	
   $("#fsBotones").append(
      "<button id='btnClipTabla' type='button' class='btn btn-success' title='Tabla Clipboard'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" + 
      "</button>");
	
   $("#fsBotones").append(
      "<button id='btnModalConExcelFormacion' type='button' class='btn btn-success' title='Consolidado Formaciones' " +
              "onclick='verModalConsolidadoExcelFormacion();'>" +
         "<i class='fa fa-list-alt fa-2x'></i>" +
      "</button>");
	
   $("#btnUpload").attr("onclick","javascript:importarDatos();");
   
   $("#fsBotones").append(
      "<button id='btnGraficoCapOnline' class='btn btn-info' title='Elaborar un gráfico con los valores seleccionados.' " +
              "type='button' onclick='seleccionarOpcionGraficoCapOnline();'>" +
         "<i class='fa fa-bar-chart fa-2x'></i>" +
         "<i class='fa fa-info-circle'></i>" +
      "</button>");

    // $("#fsBotones").append(
    //     "<button id='btnInfoCapacitacionIA' class='btn btn-primary rounded-circle' title='Cursos' " +
    //     "type='button' onclick='abrirMdCursos();'>" +
    //     "<i class='fa fa-question-circle fa-2x'></i>" +
    //     "</button>"
    // );

   deshabilitarBotonesEdicion();
   $("#btnProgFecha").hide();

   $("#btnNuevo").attr("onclick","javascript:nuevoCapacitacion();");
   $("#btnCancelar").attr("onclick","javascript:cancelarCapacitacion();");
   $("#btnGuardar").attr("onclick","javascript:guardarCapacitacion();");
   $("#btnEliminar").attr("onclick","javascript:eliminarCapacitacion();");
   $("#btnProgFecha").attr("onclick","javascript:programarCurso();");
   $("#btnImportar").attr("onclick","javascript:importarDatos();");
	
   var dataParam={
      idCompany: sessionStorage.getItem("gestopcompanyid")
   };
	
   if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 0){
      htmlVideo = $("#modalTutorial").find(".modal-body").html();
		
      var capObj={
	 trabajadorId: parseInt(sessionStorage.getItem("trabajadorGosstId"))
      };
		
      $("#containerFormacionGosst").remove();
		
      callAjaxPost(URL+'/capacitacion',capObj,procesarDataCapacitacionOnline);
   }else if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 1){
      dataParam.esCapacitacionOnline = 1;
      dataParam.listCategoriaIdFiltro = 
         (listCategoriaCapacitacionId.length == 0?null:listCategoriaCapacitacionId);
       
      $("#containerFormacionTrabajador").remove();
		 
      callAjaxPost(URL+'/capacitacion/vista_admin',dataParam,procesarDataDescargadaPrimerEstado);
   }else if(parseInt(sessionStorage.getItem("accesoUsuarios")) == 2){
      htmlVideo = $("#modalTutorial").find(".modal-body").html();
		
      var capObj={
         contratistaAsociado: {id: parseInt(sessionStorage.getItem("contratistaGosstId"))}
      }
		
      $("#containerFormacionGosst").remove();
	
      callAjaxPost(URL+'/capacitacion',capObj,procesarDataCapacitacionOnline);		
   }	
}

function verTutorialCapacitacion(){
   $("#modalTutorial").find(".modal-body").html(htmlVideo);
   $("#modalTutorial").modal("show");
}

function entenderTutorial(){
   finalizarTutorial();
   $("#modalTutorial").modal("show");
   var myVideo = document.getElementById("videoCap"); 
   myVideo.play();
}

function procesarDataCapacitacionOnline(data){
   $("#icoTutorial").remove();$("#icoInicio").remove();
	
   $(".navbar-right").prepend(
      "<span id='icoTutorial' title='Tutorial'>" +
         "<a onclick='verTutorialCapacitacion()' class='iconoLink'>" +
	    "<i class='fa fa-desktop fa-2x' aria-hidden='true'><span style='font-size:18px'></span></i>" +
	 "</a>" + 
      "</span>");
	
   $(".navbar-right").prepend(
      "<span id='icoInicio' title='Inicio'><a onclick='irHacia(12)' class='iconoLink'>" +
         "<span style='font-size:19px'>Inicio</span></a>" +
      "</span>");
	 
   if(isMobile.any()){
      $("#barraMenu").css({"position": "fixed",
			   "width": "100%"});  
   }
   
   if(parseInt(sessionStorage.getItem("hasTutorialCap")) == 0){
      $("#modalTutorial").on("hidden.modal.bs",function(){
         htmlVideo = $(this).find(".modal-body").html();
         $(this).find(".modal-body").html("");
      });
		
      createSession("hasTutorialCap",1);
      
      var msjObject={};
      msjObject.titulo = "Recomendación ";
      msjObject.cuerpo=("Estimado usuario, antes de iniciar con su capacitación, " +
		        "vea el tutorial de como utilizar la plataforma de capacitación online" +
			"<br><button class='btn btn-success' onclick='entenderTutorial()'>Entendido</button>");
      crearOverlaySobreDiv(msjObject);
   }else{
   
   }
	
   listFullFormaciones = data.list;
   listProfesor = data.listProfesor;
	
   $("#cursosImplementar .divListCursos").html("");$("#cursosCompletados .divListCursos").html("");
   $("#cursosFuturos .divListCursos").html("");$("#cursosPasados .divListCursos").html("");
	
   var capImplCounter = 0,capComplCounter = 0,capPasadoCounter = 0,capFuturoCounter = 0;
	
   listFullFormaciones.forEach(function(val,index){
      var cursosCap = val.cursos;
		
      cursosCap.forEach(function(val1,index1){
         var imagenCap = "<img></img>";
			
         if(val1.evidencia != null){
	    imagenCap =	insertarImagenParaTablaMovil(val1.evidencia,"300px","100%");	
         }
			
         var classFormacionHide = "";
         var textoSuspensivo = "";
			
         if(val1.nombre == null){
	    val1.nombre = "";
         }
			
         if(val1.nombre.length > 90){
	    textoSuspensivo = " ...";
         }
			
         var textoCap = ""+val1.nombre.substring(0,90)+textoSuspensivo+"<br>";
         var textoCertificado = 
            "<i class='fa fa-certificate fa-2x cerrado-gosst' title='Curso cerrado'></i>" +
	    "<a class='btn btn-success' onclick='verDetallesCurso("+index+","+index1+",2)'>Ver Detalles</a>";
         
         var puntajeNoAprobado = true;
			
         if(val1.evaluacion == null){
	    puntajeNoAprobado = true;
         }else{
	    if((val1.puntajeMinimo/100) > val1.evaluacion.puntajeAlcanzado){
	       puntajeNoAprobado = true;
	       
	       textoCertificado = 
	          "<i class='fa fa-certificate fa-2x cerrado-gosst' title='Curso cerrado'></i>" +
		  "<a class='btn btn-success' role='button' onclick='verDetallesCurso("+index+","+index1+",2)'>Ver Detalles</a>"
	    }else{
	       puntajeNoAprobado = false;
					
	       textoCertificado =
		  "<i onclick='javascript:descargarCertificadoCurso("+val1.id+")' class='fa fa-certificate fa-2x aprobado-gosst' " +
		     "title='Descargar Certificado'></i>" +
		  "<a class='btn btn-success' role='button' onclick='verDetallesCurso("+index+","+index1+",1)'>Ver Detalles</a>";
	    }
         }
			
         if(val1.estado.id == 2 && puntajeNoAprobado){
	    capImplCounter += 1;
				
	    if(capImplCounter > 4){
	       classFormacionHide = "classFormacionHide";
	    }else{
	       classFormacionHide = "";
	    }
				
	    if(parseInt(val1.isOculto) != 1){
	       $("#cursosImplementar .divListCursos").append(
	          "<div class='divFormacionOnline "+classFormacionHide+" col-sm-6 col-md-3 col-lg-2'>" +
		     "<div class='imgFormacion thumbnail'> " +
		        "<a>"+imagenCap+"</a>" +
		        "<div class='divDescFormacion'>" +
		            textoCap +
		            "<br><a class='btn btn-success' role='button' " +
		                   "onclick='verDetallesCurso("+index+","+index1+",0)'>Iniciar Curso</a>" +
			"</div>" +
		     "</div>" +
		  "</div>");
	    }
         }else{
	    var divCursoAsoc;
				
	    if(val1.estado.id == 1){
	       divCursoAsoc = $("#cursosFuturos");
	       capFuturoCounter += 1;
	       textoCertificado = "Disponible: "+convertirFechaNormal(val1.fechaInicio); 
					
	       if(capFuturoCounter > 4){
	          classFormacionHide = "classFormacionHide";
	       }else{
		  classFormacionHide = "";
	       }
	    }
				
	    if(val1.estado.id == 2){
	       textoCertificado = (val1.wantsCertificado == 1?textoCertificado:
		                   "<a class='btn btn-success' role='button' " +
		                      "onclick='verDetallesCurso("+index+","+index1+",1)'>Ver Detalles</a>");
					
	       divCursoAsoc = $("#cursosCompletados");
	       capComplCounter += 1;
					
	       if(capComplCounter > 4){
		  classFormacionHide = "classFormacionHide";
	       }else{
		  classFormacionHide = "";
	       }
	    }
				
	    if(val1.estado.id == 3){
	       textoCertificado = (val1.wantsCertificado == 1?textoCertificado:
		                   "<a class='btn btn-success' role='button' " +
		                      "onclick='verDetallesCurso("+index+","+index1+",1)'>Ver Detalles</a>");
					
	       divCursoAsoc = $("#cursosPasados");
	       capPasadoCounter += 1;
					
	       if(capPasadoCounter > 4){
		  classFormacionHide = "classFormacionHide";
	       }else{
		  classFormacionHide = "";
	       }
	    }
				
	    if(parseInt(val1.isOculto) != 1){
	       divCursoAsoc.find(".divListCursos").append(
	          "<div class='divFormacionOnline "+classFormacionHide+" col-sm-6 col-md-3 col-lg-2'>" +
		     "<div class='imgFormacion thumbnail'> " +
		        "<a>"+imagenCap+"</a>"+
			"<div class='divDescFormacion'>" +
			    textoCap +
			    "<br>"+textoCertificado +
			"</div>" +
		     "</div>" +
	          "</div>");
	    }else{
					
	    }
         }
      });
   });
	
   completarBarraCarga();
}

function nombreClasifCap(idTipo,nombreTipo){
   if(idTipo == 4){
      return nombreTipo
   }else{
      return "Ninguna"
   }
}

var listCapacitacionOnlineAux=[];

function procesarDataDescargadaPrimerEstado(data){
   switch (data.CODE_RESPONSE){
      case "05":
         var list = data.list;
         listFullFormaciones = list;
         listProfesor = data.listProfesor;
         listClasificacion = data.listCla;
         listCapacitacionTipo = data.listCapTipo;
         listTiposVigencia = data.listTiposVigencia;
         listCategoriaCapacitacion = data.listCategoriaCapacitacion;
         listTipoVisitanteCapacitacion = data.tiposVisitante;
         listCapacitacionOnlineAux=[];
		
         $("#h2Titulo").html("<a onclick='javascript:cargarPrimerEstado();' href='#'>Capacitaciones</a>");
         $("#tblCap tbody tr").remove(); 
		
         list.forEach(function(val,index){
            if(val.capacitacionTipoId == 5){
	       var indicadorTrabAsig = (val.tipoVisitante.id == -1?val.numTrabAsignadosAprobadosTotal+"/"+val.numTrabAsignadosTotal:"<label>*No aplica.</label>"),
	          indicadorTraProg = (val.tipoVisitante.id == -1?val.numProgramacionesRealizadas+"/"+val.numProgramacionesPlaneadas:"<label>*No aplica.</label>"),
	          numPuestosAsociados = (val.tipoVisitante.id == -1?val.numPuestosAsociados:"<label>*No aplica.</label>"),
	          numExcepciones = (val.tipoVisitante.id == -1?val.numExcepciones:"<label>*No aplica.</label>"),
	          cantidadIntentosMax = ([2,3].includes(val.tipoVisitante.id)?val.cantidadIntentosMaximo:"<label>*No aplica.</label>"),
	          intervaloTiempo = ([2,3].includes(val.tipoVisitante.id)?val.intervaloTiempoEspera:"<label>*No aplica.</label>"),
	          intervaloBloqueoInicial = ([2,3].includes(val.tipoVisitante.id)?val.intervaloBloqueoInicial:"<label>*No aplica.</label>");
	       
	       if(val.tipoVisitante.id == -1){
		  listCapacitacionOnlineAux.push(val); 
	       }
				
	       $("#tblCap tbody").append(
                  "<tr id='tr"+val.capacitacionId+"' onclick='javascript:editarCapacitacion("+index+")'>" +
	             "<td id='tdnom"+val.capacitacionId+"'>"+val.capacitacionNombre+"</td>" +
		     "<td id='tdcla"+val.capacitacionId+"'>"+val.clasificacionNombre+"</td>" + 
		     "<td id='tdcatcap"+val.capacitacionId+"'>"+val.categoriaCapacitacion.nombre+"</td>" +
		     "<td id='tdtviscap"+val.capacitacionId+"'>"+val.tipoVisitante.nombre+"</td>" +
		     "<td id='tdres"+val.capacitacionId+"'>"+val.responsable+"</td>" +
		     "<td id='tdtem"+val.capacitacionId+"'>"+val.tema+"</td>" + 
		     "<td id='tdvig"+val.capacitacionId+"'>"+val.vigencia.nombre+"</td>" + 
		     "<td id='tdNumIntentosMax"+val.capacitacionId+"'>"+cantidadIntentosMax+"</td>" + 
		     "<td id='tdIntervaloTiempo"+val.capacitacionId+"'>"+intervaloTiempo+"</td>" + 
		     "<td id='tdIntervaloBloqueoInicial"+val.capacitacionId+"'>"+intervaloBloqueoInicial+"</td>" +
		     "<td id='tdTrabAsig"+val.capacitacionId+"'>"+indicadorTrabAsig+"</td>" +
		     "<td id='tdProg"+val.capacitacionId+"'>"+indicadorTraProg+"</td>" +
		     "<td id='tdasig"+val.capacitacionId+"'>"+numPuestosAsociados+"</td>" +
		     "<td id='tdExcep"+val.capacitacionId+"'>"+numExcepciones+"</td>" +
	          "</tr>");
            }
         });
		
         formatoCeldaSombreableTabla(true,"tblCap");completarBarraCarga();
			
         if(getSession("linkCalendarioCapId") != null){
	    var indexIpercAux = 0;
			
	    listFullFormaciones.every(function(val,index3){
	       if(val.capacitacionId == parseInt(getSession("linkCalendarioCapId"))){
		  editarCapacitacion(index3);
		  programarFecha();
					
		  sessionStorage.removeItem("linkCalendarioCapId");
		  return false;
	       }else{
		  return true;
	       }
	    });
         }
		
         break;
	
      default:
         alert("Ocurrió un error al traer las capacitaciones!");
   }
	
   if(contador2 == 0){
      goheadfixed('table.fixed');
   }
	
   contador2 = contador2 + 1;
}

function editarCapacitacion(pindex){
   if(!banderaEdicion){
      capacitacionObj = listFullFormaciones[pindex];
      capacitacionId = listFullFormaciones[pindex].capacitacionId ;
      capacitacionNombre = listFullFormaciones[pindex].capacitacionNombre ;
      capacitacionTipo = listFullFormaciones[pindex].capacitacionTipoId;
      clasificacionId = listFullFormaciones[pindex].clasificacionId;
		
      $("#tr"+capacitacionId).addClass("fila-edicion");
		
      var vigenciaId = listFullFormaciones[pindex].vigencia.id;
      formatoCeldaSombreableTabla(false,"tblCap");
		
      var name1 = $("#tdres"+capacitacionId).text();
      
      $("#tdres"+capacitacionId).html(
         "<input type='text' id='inputRes' class='form-control' " +
                "placeholder='Responsable' value='"+name1+"'>");
      
      ponerListaSugerida("inputRes",listanombretab,true);
		
      var name2 = $("#tdtem"+capacitacionId).text();
      
      $("#tdtem"+capacitacionId).html(
         "<input type='text' id='inputTem' class='form-control' " +
      		"placeholder='Tema' autofocus='true' value='"+name2+"'>");
		
      var name3 = $("#tdhor"+capacitacionId).text();
      
      $("#tdhor"+capacitacionId).html("<input type='number' id='inputHor' class='form-control' placeholder='Hora programada' value='"+name3+"'>");
		
      var name4 = $("#tdvid"+capacitacionId).text();
      
      $("#tdvid"+capacitacionId).html(
         "<input type='text' id='inputUrlVideo' class='form-control' " +
      		"placeholder='Url Video' autofocus='true' value='"+name4+"'>");
      /****************************************************************************/
      var selClaTipo = crearSelectOneMenu("selClaTipo","",listClasificacion,
	 clasificacionId,"clasificacionId","nombre");
      
      $("#tdcla"+capacitacionId).html(selClaTipo);

      var selTipoVig = crearSelectOneMenu("selTipoVig","",listTiposVigencia,
	 vigenciaId,"id","nombre");
      
      $("#tdvig"+capacitacionId).html(selTipoVig);
      // ******
      var categoriaCapacitacionId = listFullFormaciones[pindex].categoriaCapacitacion.id;
			
      var selCategoriaCapacitacion = crearSelectOneMenu("selCategoriaCapacitacion","",listCategoriaCapacitacion,
	 categoriaCapacitacionId,"id","nombre");
      
      $("#tdcatcap"+capacitacionId).html(selCategoriaCapacitacion);
		   
      var selTipoVisitanteCapacitacion = crearSelectOneMenu("selTipoVisitanteCapacitacion","",listTipoVisitanteCapacitacion,
	 capacitacionObj.tipoVisitante.id,"id","nombre","No aplica");
	
      $("#tdtviscap"+capacitacionId).html(selTipoVisitanteCapacitacion);
      $("#selTipoVisitanteCapacitacion").prop("disabled",true);
      
      var name = $("#tdnom" + capacitacionId).text();
      
      $("#tdnom"+capacitacionId).html(
         "<input type='text' id='inputCap' class='form-control' placeholder='Capacitacion' " +
                "autofocus='true' value='"+name+"'>");
      
      if(capacitacionObj.tipoVisitante.id == -1){
         var iconoSmart = "<i class='fa fa-magic' aria-hidden='true'></i>";
		
         $("#tdTrabAsig"+capacitacionId).append(iconoSmart);
      
         $("#tdTrabAsig"+capacitacionId+" i").on("click",function(){
	    verResumenTrabCapacitacionOnline();
         });
		
         $("#mdProgFechaLabel").html("Programaci&oacute;n de '"+name+"'");
		
         $("#tdasig"+capacitacionId).html(
            "<a onclick='verPuestosRecurso("+1+","+pindex+")' class='efectoLink'>" +
	       "<i class='fa fa-list'></i>"+capacitacionObj.numPuestosAsociados +
            "</a>");
      
         $("#tdExcep"+capacitacionId).html(
            "<a onclick='verExcepcionesCapacitacionOnline()' class='efectoLink'>" +
	       "<i class='fa fa-list'></i>" +capacitacionObj.numExcepciones +
	    "</a>");
      }else if([2,3].includes(capacitacionObj.tipoVisitante.id)){
	 habilitarCamposAsociadosIntentos();
      }
      
      banderaEdicion = true;
      
      habilitarBotonesEdicion();
      $("#btnProgFecha").show();$("#btnGraficoCapOnline").hide();$("#btnFiltroCapacitacionOnline").hide();
      $("#btnProfeCursos").hide();$("#btnResumenCurso").hide();$("#btnClipTabla").hide();
      $("#btnModalConExcelFormacion").hide();
   }
}

function nuevoCapacitacion(){
   if(!banderaEdicion){
      capacitacionId = 0;
       
      var selCapTipo = crearSelectOneMenu("selCapTipo","",
         listCapacitacionTipo,"-1","selCapId","nombre");
		
      var selClaTipo = crearSelectOneMenu("selClaTipo","",
	 listClasificacion,"-1","clasificacionId","nombre");
		
      var selTipoVig = crearSelectOneMenu("selTipoVig","",
	 listTiposVigencia,"-1","id","nombre");
		
      var selCategoriaCapacitacion = crearSelectOneMenu("selCategoriaCapacitacion","",
	 listCategoriaCapacitacion,"-1","id","nombre");
		
      var selTipoVisitanteCapacitacion = crearSelectOneMenu("selTipoVisitanteCapacitacion","habilitarCamposAsociadosIntentos()",
	 listTipoVisitanteCapacitacion,"","id","nombre","No aplica");
		
      $("#tblCap tbody:first").append(
         "<tr id='tr0'>" + 
            "<td><input type='text' id='inputCap' class='form-control' placeholder='Formaci&oacute;n' " +
                       "required='true' autofocus='true'></td>" +
	    "<td>"+selClaTipo+"</td>" +
	    "<td>"+selCategoriaCapacitacion+"</td>" +
	    "<td>"+selTipoVisitanteCapacitacion+"</td>" +
	    "<td><input type='text' id='inputRes' class='form-control' placeholder='Responsable' " +
	               "required='true' autofocus='true'></td>" +
	    "<td><input type='text' id='inputTem' class='form-control' placeholder='Tema' " +
	               "required='true' autofocus='true'></td>" +
	    "<td>"+selTipoVig+"</td>" +
	    "<td id='tdNumIntentosMax"+capacitacionId+"'></td>" +
	    "<td id='tdIntervaloTiempo"+capacitacionId+"'></td>" +
	    "<td id='tdIntervaloBloqueoInicial"+capacitacionId+"'></td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
	    "<td>...</td>" +
         "</tr>");
      
      $("#inputCap").focus();
      formatoCeldaSombreableTabla(false,"tblCap");
      ponerListaSugerida("inputRes",listanombretab,true);
      habilitarBotonesNuevo();
      
      banderaEdicion = true;
      
      habilitarCamposAsociadosIntentos();
		
      $("#btnGraficoCapOnline").hide();$("#btnFiltroCapacitacionOnline").hide();
      $("#btnProfeCursos").hide();$("#btnResumenCurso").hide();
      $("#btnClipTabla").hide();$("#btnModalConExcelFormacion").hide();
   }else{
      alert("Guarde primero.");
   }
}

function habilitarCamposAsociadosIntentos(){
   var tipoVisitanteCapacitacionId = parseInt($("#selTipoVisitanteCapacitacion").val());
    
   if([2,3].includes(tipoVisitanteCapacitacionId)){
      var cantidadIntentosMaximo = (capacitacionId == 0?0:capacitacionObj.cantidadIntentosMaximo);
    
      $("#tdNumIntentosMax"+capacitacionId).html("<input id='inputCantidadIntentosMaximo' type='number' " +
         "min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>");
      $("#inputCantidadIntentosMaximo").val(cantidadIntentosMaximo);		
	 
      var intervaloTiempoEspera = (capacitacionId == 0?0:capacitacionObj.intervaloTiempoEspera);
	      
      $("#tdIntervaloTiempo"+capacitacionId).html("<input id='inputIntervaloTiempoEspera' type='number' " +
         "min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>");
      $("#inputIntervaloTiempoEspera").val(intervaloTiempoEspera);    
      
      var intervaloBloqueoInicial = (capacitacionId == 0?0:capacitacionObj.intervaloBloqueoInicial);
	      
      $("#tdIntervaloBloqueoInicial"+capacitacionId).html("<input id='inputIntervaloBloqueoInicial' type='number' " +
         "min='0' step='1' oninput='this.validity.valid || (this.value=\"\");' class='form-control'>");
      $("#inputIntervaloBloqueoInicial").val(intervaloBloqueoInicial);
   }else{
      $("#tdNumIntentosMax"+capacitacionId).html("<label>*No aplica.</label>");$("#tdIntervaloTiempo"+capacitacionId).html("<label>*No aplica.</label>");
      $("#tdIntervaloBloqueoInicial"+capacitacionId).html("<label>*No aplica.</label>");
   }
}

function cancelarCapacitacion(){
   cargarPrimerEstado();
}

function eliminarCapacitacion(){
   mensajeUx="<label>¿Está seguro de eliminar el registro de capacitación online seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarCapOnline");
   
   $("#btnDevolverValorEliminarCapOnline").on("click",function(){
      var dataParam={
	 capacitacionId:capacitacionId
      };

      callAjaxPostSimpleVersionDos(1,URL+"/capacitacion/delete",dataParam,1,1,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx="<label>El registro de capacitación online seleccionado se ha eliminado correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarCapOnline");
        	
	       $("#modalMensajeUxActualizarCapOnline").on("hidden.bs.modal",function(){
		  cargarPrimerEstado(); 
	       });
	       
	       break;
						
            default:
               alert("Verificar que el tema de formación no tenga programaciones registradas, " +
                  "y también verificar que el tema de formación no esté asignado a puestos de trabajo");
         }
      });
   });
}

function guardarCapacitacion(){
   var campoVacio = true;
	
   var capacitacionTipo = 5;
   var clasificacionTipo = $("#selClaTipo option:selected").val();
   var tipoVisitaId = parseInt($("#selTipoVisitanteCapacitacion").val());
   var selTipoVig = $("#selTipoVig").val();
   var inputCap = $("#inputCap").val();
   var inputRes = $("#inputRes").val();
   var inputTem = $("#inputTem").val();  
   var selCategoriaCapacitacion = $("#selCategoriaCapacitacion").val();
   var cantidadIntentosMaximo = $("#inputCantidadIntentosMaximo").val();
   var intervaloTiempoEspera = $("#inputIntervaloTiempoEspera").val();
   var intervaloBloqueoInicial = $("#inputIntervaloBloqueoInicial").val();

   if(capacitacionTipo == '-1' || clasificacionTipo == '-1' || inputCap.length == 0 || inputRes.length == 0 || 
      inputTem.length == 0){
      campoVacio = false;
   }
   
   if([2,3].includes(tipoVisitaId)){
      if(cantidadIntentosMaximo.length == 0 || intervaloTiempoEspera.length == 0 || intervaloBloqueoInicial.length == 0){
	 campoVacio = false;
      } 
   }

   if(selTipoVig == "-1"){
      selTipoVig = null;
   }
	
   if(campoVacio){
      var dataParam={
	 capacitacionId:capacitacionId,tipoVisitante: {id:tipoVisitaId},capacitacionTipoId:5,clasificacionId:clasificacionTipo,
	 capacitacionNombre:inputCap,responsable:inputRes,tema:inputTem,capacitacionTipoId:capacitacionTipo, 
	 vigencia: {id:selTipoVig},categoriaCapacitacion: {id:selCategoriaCapacitacion},idCompany:sessionStorage.getItem("gestopcompanyid")
      };
      
      dataParam.cantidadIntentosMaximo = ([2,3].includes(tipoVisitaId)?cantidadIntentosMaximo:null);
      dataParam.intervaloTiempoEspera = ([2,3].includes(tipoVisitaId)?intervaloTiempoEspera:null);
      dataParam.intervaloBloqueoInicial = ([2,3].includes(tipoVisitaId)?intervaloBloqueoInicial:null);

      callAjaxPostSimpleVersionDos(1,URL+"/capacitacion/save",dataParam,1,1,function(data){
         switch(data.CODE_RESPONSE){
            case "05":  
	       mensajeUx="<label>El registro de capacitación online fue guardado correctamente.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarCapOnline"); 
								   
	       $("#modalMensajeUxActualizarCapOnline").on("hidden.bs.modal",function(){
	          cargarPrimerEstado();
	       });
		 
	       break;
							
            default:
	       alert("Ocurrió un error al guardar la capacitacion online!");	
         }
      });
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function importarDatos(){
   $("#btnGuardarNuevos").attr("onclick","javascript:guardarMasivoCopiaExcel();");

   $('#mdImpDatos').modal('show');	
}

function guardarMasivoCopiaExcel(){
   var texto = $("#txtListado").val();
   var listExcel = texto.split('\n');
   var listRecurso = [];
   var listFormacionRepe = [];
   var listFullNombres = "";
   var validado = "";
	
   if(texto.length < 10000){
      for(var int = 0;int < listExcel.length;int++){
         var listCells = listExcel[int].split('\t');
	 var filaTexto = listExcel[int];
			
	 if(filaTexto.trim().length < 1) {
	    validado = "Existen filas vacias.";
	    
	    break;
	 }

	 if(validado.length < 1 && listCells.length != 5){
	    validado = "No coincide el numero de celdas. ("+listCells.length+" != 6)";
				
	    break;
         }else{
	    var recurs = {};
	    var tipo = {};
	    var clas = {};
				
	    recurs.capacitacionTipoId = 5;
				
	    for(var j = 0;j < listCells.length;j++){
               var element = listCells[j];
					
               if(j === 0){
		  recurs.capacitacionNombre = element.trim();
						
		  if($.inArray(recurs.capacitacionNombre,listFormacionRepe) === -1){
		     listFormacionRepe.push(recurs.capacitacionNombre);
		  }else{
		     listFullNombres = listFullNombres+recurs.capacitacionNombre+", ";
		  }
               }
								
               if(j === 1){
		  for(var k = 0;k < listClasificacion.length;k++){
		     if(listClasificacion[k].nombre == element.trim()){
		        recurs.clasificacionId = listClasificacion[k].clasificacionId;
		     }
		  }

		  if(!recurs.clasificacionId){
		     validado = "Clasificación de Formación no reconocida.";
							
		     break;
		  }
               }
					
               if(j === 2){
		  recurs.responsable = element.trim();
               }
					
               if(j === 3){
		  recurs.tema = element.trim();
               }
					
               if(j === 4){
		  recurs.horasProgramadas = element.trim();
						
		  if(isNaN(parseFloat(recurs.horasProgramadas))){
		     validado = "Horas ingresadas no reconocidas";
		  }
               }
					
               recurs.idCompany = sessionStorage.getItem("gestopcompanyid");
	    }

	    listRecurso.push(recurs);
				
	    if(listFormacionRepe.length < listRecurso.length){
	       validado = "Existen fomaciones repetidos."+listFullNombres;
					
	       break;
	    }
         }
      }
   }else{
      validado = "Ha excedido los 10000 caracteres permitidos.";
   }

   if(validado.length < 1){
      var r = confirm("¿Está seguro que desea subir estos "+listExcel.length+" elemento(s)?");
		
      if(r == true){
         var dataParam={
	    listRecurso: listRecurso
         };
			
         callAjaxPost(URL+'/capacitacion/masivo/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
		  alert("Se guardaron exitosamente.");
		  cargarPrimerEstado();
		  $('#mdImpDatos').modal('hide');
					
		  break;
				
	       default:
		  alert("Ocurri&oacute; un error al guardar el trabajador!");
            }
         });
      }
   }else{
      alert(validado);
   }
}

var listTrabajadoresEstadoCapOnline=[];

function volverPrincipalCapOnline(){
   $("#modalResumenTrabCapacitacionOnline").modal("hide");
}

function verResumenTrabCapacitacionOnline(){
   $("#modalResumenTrabCapacitacionOnline").remove();
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
   
   if(capacitacionObj.listPuestosAsignadosId.length != 0){
      var puestosAsignadosId = capacitacionObj.listPuestosAsignadosId.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabAgregadosId.length != 0){
      var trabAgregadosId = capacitacionObj.listTrabAgregadosId.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabExoneradosId.length != 0){
      var trabExoneradosId = capacitacionObj.listTrabExoneradosId.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listTrabGrupoSeguridadId.length != 0){
      var trabGrupoSeguridadId = capacitacionObj.listTrabGrupoSeguridadId.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
   
   if(capacitacionObj.listCursosVigentesId.length != 0){
      var cursosVigentesId = capacitacionObj.listCursosVigentesId.split(","); 
   
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }
    
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverCapOnline' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalCapOnline()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var btnClipBoard = 
      "<button id='btnClipboardSmartResCapOnline' type='button' class='btn btn-success clipGosst' style='margin-right:5px' " +
              "onclick='copiarContenidoResumenTrabCapacitacionOnline()' title='Copiar Clipboard'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" +
      "</button>";
	
//   var btnProgramacionCap =
//      "<button id='btnSmartProgResCapOnline' type='button' class='btn btn-success' style='margin-right:5px' " +
//              "title='Smart Programacion'>" +
//         "<i class='fa fa-magic fa-2x'></i>" +
//      "</button>";
   
   var btnEnviarCorreo = 
      "<button id='btnEnviarCorreoResCapOnline' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='enviarCorreoTrabPendientesCapOnline()' title='Enviar correo - Trabajadores Sin Asignar'>" +
	 "<i class='fa fa-envelope fa-2x'></i>" +
      "</button>";
   
   var btnGrafico = 
      "<button id='btnGraficoResumenCapOnline' type='button' class='btn btn-success' style='margin-right:5px' " +
               "onclick='verGraficoResumenCapacitacionOnline()' title='Gráfico - Resumen Capacitación online'>" +
 	 "<i class='fa fa-bar-chart fa-2x'></i>" +
      "</button>";

   var btnHistorialCorreo = 
      "<button id='btnHistorialCorreoCapOnline' type='button' class='btn btn-success' " +
              "onclick='verHistoriaCorreoCapacitacionOnline()' title='Historial de correos enviados asociados a la capacitación online.'>" +
         "<i class='fa fa-list-ol fa-2x'></i> " +
         "<i class='fa fa-envelope'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalResumenTrabCapacitacionOnline",
      nombre:"<i class='fa fa-table'></i> Resumen de capacitación: "+capacitacionObj.capacitacionNombre+" - "+capacitacionObj.tema,
      contenido: 
	  buttonVolver+btnClipBoard+btnEnviarCorreo+btnGrafico+btnHistorialCorreo +
         "<div class='wrapper' id='wrapperResumenTrabCapacitacionOnline'>" +
            "<table id='tblResumenTrabCapacitacionOnline' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' colspan='7' style='width:2100px'>Datos del trabajador(a)</th>" +
		     "<th class='tb-acc' colspan='5' style='width:1250px'>Capacitación online</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:300px'>DNI</th>" +
		     "<th class='tb-acc' style='width:300px'>Unidad</th>" +
		     "<th class='tb-acc' style='width:300px'>División</th>" +
		     "<th class='tb-acc' style='width:300px'>Área</th>" +
		     "<th class='tb-acc' style='width:300px'>Puesto de trabajo</th>" +
		     "<th class='tb-acc' style='width:300px'>Nombre</th>" +
		     "<th class='tb-acc' style='width:300px'>Correo</th>" +
		     "<th class='tb-acc' style='width:250px'>Estado</th>" +
		     "<th class='tb-acc' style='width:250px'>Nota</th>" +
		     "<th class='tb-acc' style='width:250px'>Días de vigencia</th>" +
		     "<th class='tb-acc' style='width:250px'>N° de intentos</th>" +
		     "<th class='tb-acc' style='width:250px'>Fecha próxima</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperResumenTrabCapacitacionOnline",190);
   cargarResumenCapacitacionOnlineVersionDos();
}

var numTrabCapOnlineTotal,numTrabCapOnlineAprobado,numTrabCapOnlineDesaprobado;

function cargarResumenCapacitacionOnlineVersionDos(){
   numTrabCapOnlineTotal = 0,numTrabCapOnlineAprobado = 0,
   numTrabCapOnlineDesaprobado = 0;
   
   asigAuxCorreo = [],asigAuxNombre = [];
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionId,ultimoCursoId: capacitacionObj.ultimoCursoId,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
         (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
         (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
         (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
         (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux)
   };
    
   callAjaxPost(URL+"/capacitacion/trabajador/formacion/online/version_dos",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listTrabajadoresEstadoCapOnline = data.listTrabajadoresEstadoCapOnline;
	 
	 $("#tblResumenTrabCapacitacionOnline tbody tr").remove();
	 
	 listTrabajadoresEstadoCapOnline.forEach(function(val,index){
	    var estadoCapOnline = (val.tipoNotaId == 3?"------":
	       (val.tipoNotaId == 1?"Aprobado":"Desaprobado"));
	    var calificacionCapOnline = (val.tipoNotaId == 3?"------":val.resultadoUltimo);
	    var diasRestantesCapOnline = (val.tipoNotaId == 3?"------":val.diasRestantes);
	    var intentosCapOnline = (val.tipoNotaId == 3?"------":val.intentos);
	    var fechaFuturaCapOnline = (val.tipoNotaId == 3?"------":val.fechaFutura);
	    
	    $("#tblResumenTrabCapacitacionOnline tbody").append(
	       "<tr id='ft"+val.trabajadorId+"'>" +
	          "<td>"+val.dni+"</td>" +
		  "<td>"+val.unidadNombre+"</td>" +
		  "<td>"+val.divisionNombre+"</td>" +
		  "<td>"+val.areaNombre+"</td>" +
		  "<td>"+val.puestoNombre+"</td>" + 
		  "<td>"+val.trabajadorNombre+"</td>" +
		  "<td>"+val.emailTrabajador+"</td>" +
		  "<td>"+estadoCapOnline+"</td>" +
		  "<td>"+calificacionCapOnline+"</td>" +
		  "<td>"+diasRestantesCapOnline+"</td>" +
		  "<td>"+intentosCapOnline+"</td>" +
		  "<td>"+fechaFuturaCapOnline+"</td>" +
               "</tr>");
	    
	    var colorFondoFila = (val.tipoNotaId == 1?"#5dcd5d":(val.tipoNotaId == 2?"#D8D808":"#ff7474"));
	    
	    $("#ft"+val.trabajadorId+" td").css({"background-color":colorFondoFila});
	    
	    if(val.tipoNotaId == 1){
	       numTrabCapOnlineAprobado++;
	    }else{
	       if(val.tipoNotaId == 2){
		  numTrabCapOnlineDesaprobado++; 
	       }
		
	       asigAuxCorreo.push(val.emailTrabajador);asigAuxNombre.push(val.trabajadorNombre);
	    }
	    
	    numTrabCapOnlineTotal++;
	 });
	 
	 if(asigAuxCorreo.length == 0){
	    $("#btnEnviarCorreoResCapOnline").hide(); 
	 }
	 
	 if(capacitacionObj.numRegHistorialCorreo == 0){
            $("#btnHistorialCorreoCapOnline").hide(); 
	 }
      }else{
         console.log("NOPNPO");
      }
	
      goheadfixedY("#tblResumenTrabCapacitacionOnline","#wrapperResumenTrabCapacitacionOnline");
   });
}

function copiarContenidoResumenTrabCapacitacionOnline(){
   var texto = obtenerDatosBodyTablaEstandar("tblResumenTrabCapacitacionOnline");
   copiarAlPortapapeles(texto,"btnClipboardSmartResCapOnline");
		
   $("#modalResumenTrabCapacitacionOnline").modal("hide");
		    
   mensajeUx = "<label>Se han copiado todas las filas de la tabla " +
	       "Resumen de capacitación.</label>";
   mensajesUx(mensajeUx,1,"","MensajeExitoFilasCopiadasCapOnline");  
		   
   $("#modalMensajeUxMensajeExitoFilasCopiadasCapOnline").on("hidden.bs.modal",function(){
      $("#modalResumenTrabCapacitacionOnline").modal("show");
   });
}

function enviarCorreoTrabPendientesCapOnline(){
   $("#modalResumenTrabCapacitacionOnline").modal("hide");
  
   mensajeUx="<label>¿Desea enviar un correo a todos los trabajadores que no han "+
      "llevado o aprobado aún la capacitación online? ("+asigAuxCorreo.length+")</label>";
   mensajesUx(mensajeUx,3,"","EnviarCorreoCapOnline");

   $("#btnDevolverValorEnviarCorreoCapOnline").on("click",function(){
      var dataParam={
	 capacitacionId: capacitacionId,
	 correoTrabajadoresSinAsignar: asigAuxCorreo,
	 nombreTrabajadores: asigAuxNombre
      };
	    
      callAjaxPost(URL+'/capacitacion/online/curso/correo',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>Correo(s) enviado(s) con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarResumenCapOnline");
  		
  	       $("#modalMensajeUxActualizarResumenCapOnline").on("hidden.bs.modal",function(){
  	          $("#modalResumenTrabCapacitacionOnline").modal("show");
  	          $("#btnHistorialCorreoCapOnline").show();
  	       });
	       
  	       break;
				
	    default:
	       console.log("Ocurrió un error al enviar los correos!");
         }
      });
   });
	      
   $("#btnRegresarPrevioEnviarCorreoCapOnline").on("click",function(){
      $("#modalResumenTrabCapacitacionOnline").modal("show");
   });  
}

function verGraficoResumenCapacitacionOnline(){
   $("#modalResumenTrabCapacitacionOnline").modal("hide");
   $("#modalGraficoResumenTrabCapacitacionOnline").remove();
   
   var numTrabajadoresPendientes = 
      numTrabCapOnlineTotal - (numTrabCapOnlineAprobado + numTrabCapOnlineDesaprobado);
     
   var modalOptions={
      id: "modalGraficoResumenTrabCapacitacionOnline",
      maxWidth: "90%",
      nombre: "Gráfico - Resumen de capacitación: "+capacitacionObj.capacitacionNombre+" - "+capacitacionObj.tema,
      dontRemoveBack: true,
      contenido: "<div id='divGraficoResTrabCapOnline'></div>"
   };
 	    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
   resizeDivWrapper("divGraficoResTrabCapOnline",190);
 	 	
   Highcharts.chart('divGraficoResTrabCapOnline',{
      chart: {type: 'column'},
      title: {text: "Gráfico - Resumen Capacitación online"},
      xAxis: {categories: [""]},
      yAxis: {
         title: {
 	    text: "Número de trabajadores"}},
      plotOptions: {
 	 column: {
            dataLabels: {
 	       enabled: true},
 	    enableMouseTracking: false}},
      series: [
         {name: "Trabajadores con capacitación online pendiente",data: [numTrabajadoresPendientes],color: "#ff7474"},
	 {name: "Trabajadores con capacitación online desaprobado",data: [numTrabCapOnlineDesaprobado],color: "#D8D808"},
 	 {name: "Trabajadores con capacitación online aprobado",data: [numTrabCapOnlineAprobado],color: "#5dcd5d"}]
   }); 
   
   $("#modalGraficoResumenTrabCapacitacionOnline").on("hidden.bs.modal",function(){
      $("#modalResumenTrabCapacitacionOnline").modal("show");
   });
}

function ocultarValoresPreviosParametrosGraficoCapOnline(){
   $("#modalValParamGraficoCapOnline").modal("hide");
}

function valoresPreviosParametrosGraficoCapOnline(){
   if(listCapacitacionOnlineAux.length > 0){
      $("#modalValParamGraficoCapOnline").remove();
   
      var selCapacitacion = crearSelectOneMenuOblig("selCapacitacion","",
         listCapacitacionOnlineAux,"","capacitacionId","capacitacionNombre");
     
      var contenido = "";
  
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"Capacitación online",inputForm:selCapacitacion},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	                "onclick='ocultarValoresPreviosParametrosGraficoCapOnline()'>" +
    	           "<i class='fa fa-times'></i> Cancelar" +
    	        "</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		    "onclick='verResultadoGraficoCapacitacionOnline()'>" +
    	               "<i class='fa fa-bar-chart'></i> Gráfico" +
    	            "</button>"}
      ];
    	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	
      var modalOptions={
         id: "modalValParamGraficoCapOnline",
         nombre: "<i class='fa fa-list-ul'></i> Gráfico - Valores",
         contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
      };
    	
      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
      $("#modalValParamGraficoCapOnline").modal("show");
   }else{
      mensajeUx = "<label>Para utilizar esta función, debe tener al menos " +
      		  "una capacitación online registrada.</label>";
      mensajesUx(mensajeUx,2,""); 
   }
}

function verResultadoGraficoCapacitacionOnline(){
   var nombreCapacitacion="";
   var puestosAsignadosIdAux,trabAgregadosIdAux,trabExoneradosIdAux,
       trabGrupoSeguridadIdAux,cursosVigentesIdAux,ultimoCursoIdAux;
   var capacitacionIdAux = parseInt($("#selCapacitacion").val());

   listCapacitacionOnlineAux.forEach(function(val,index){
      if(capacitacionIdAux == val.capacitacionId){
	 nombreCapacitacion = val.capacitacionNombre;puestosAsignadosIdAux = val.listPuestosAsignadosId;
	 trabAgregadosIdAux = val.listTrabAgregadosId;trabExoneradosIdAux = val.listTrabExoneradosId;
	 trabGrupoSeguridadIdAux = val.listTrabGrupoSeguridadId;cursosVigentesIdAux = val.listCursosVigentesId;
	 ultimoCursoIdAux = val.ultimoCursoId; 
      }    
   });
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
   
   if(puestosAsignadosIdAux.length != 0){
      var puestosAsignadosId = puestosAsignadosIdAux.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabAgregadosIdAux.length != 0){
      var trabAgregadosId = trabAgregadosIdAux.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabExoneradosIdAux.length != 0){
      var trabExoneradosId = trabExoneradosIdAux.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(trabGrupoSeguridadIdAux.length != 0){
      var trabGrupoSeguridadId = trabGrupoSeguridadIdAux.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
   
   if(cursosVigentesIdAux.length != 0){
      var cursosVigentesId = cursosVigentesIdAux.split(","); 
   
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }

   var dataParam={ 
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionIdAux,ultimoCursoId: ultimoCursoIdAux,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
	 (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
	 (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
	 (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
	 (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux)
   };
  	   
   callAjaxPost(URL+'/capacitacion/online/trabajador/formacion/grafico',dataParam,function(data){
      var listValoresCapOnlineGrafico = data.valoresCapacitacionOnlineGrafico;
      var listAreasAux=[],listNumAprobadosAux=[],listNumDesaprobadosAux=[],listNumPendientesAux=[];
      var numCumplimientoTotal = 0,numAsignadosTotal = 0,resultadoDecimal;
      
      listValoresCapOnlineGrafico.forEach(function(val,index){
         if(val.numTrabajadoresAsignados > 0){
            var numTrabPendientes = 
               val.numTrabajadoresAsignados - (val.numTrabAprobados + val.numTrabDesaprobados); 
            
            numCumplimientoTotal = numCumplimientoTotal + val.numTrabAprobados + val.numTrabDesaprobados;
            numAsignadosTotal = numAsignadosTotal + val.numTrabajadoresAsignados;
              
            listAreasAux.push(val.areaName);
            listNumAprobadosAux.push(val.numTrabAprobados);
            listNumDesaprobadosAux.push(val.numTrabDesaprobados);
            listNumPendientesAux.push(numTrabPendientes);
         }
      });
      
      resultadoDecimal = (numAsignadosTotal == 0?0:pasarDecimalPorcentaje((numCumplimientoTotal/numAsignadosTotal),2));
         
      $("#modalValParamGraficoCapOnline").modal("hide");
      $("#modalGraficoResultadoTrabCapacitacionOnline").remove();
         
      var modalOptions={
         id: "modalGraficoResultadoTrabCapacitacionOnline",
         maxWidth: "90%",
         nombre: "Gráfico - Resumen de capacitación: "+nombreCapacitacion,
//         dontRemoveBack: true,
         contenido: "<div id='divGraficoResultadoTrabCapOnline'></div>"
      };
     	    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      resizeDivWrapper("divGraficoResultadoTrabCapOnline",170);
       
      Highcharts.chart('divGraficoResultadoTrabCapOnline',{
         chart:{type: 'column'},
	 title:{text: "% de cumplimiento: "+resultadoDecimal+" ("+numCumplimientoTotal+"/"+numAsignadosTotal+")",
	        align: 'left',
	        style: {fontWeight: 'bold',fontSize: '20px'}},
	 xAxis:{
	    categories: listAreasAux,
	    labels: {
	       style: {fontWeight: 'bold'}},
	    title: {
	       text: 'Área',
	       style: {fontWeight: 'bold',fontSize: '18px'}}},
	 yAxis:{
	    min: 0,max: 100,tickInterval: 10,
	    title: {
	       text: 'Porcentajes',
	       style: {fontWeight: 'bold',fontSize: '18px'}},
	    labels: {
	       style: {fontWeight: 'bold',fontSize: '18px'},
	       formatter: function(){
	          return this.value+ '%'
	       }},
	    stackLabels: {
	       enabled: true,
	          style: {
	             fontWeight: 'bold',
	             color: ( // theme
	                Highcharts.defaultOptions.title.style &&
	                Highcharts.defaultOptions.title.style.color) || 'gray',
	             textOutline: 'none'}}},
	 legend: {
	    align: 'right',x: -30,verticalAlign: 'top',y: 0,floating: true,
	    backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
	    borderColor: '#CCC',borderWidth: 1,shadow: false},
	 tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
	    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>' +
	                 '<br/>Total: {point.stackTotal} (100%)'}, 
	 plotOptions: {
            column: {
	       stacking: 'percent',
	       dataLabels: {
	          enabled: true,color: 'black',style: {fontSize: '25px'}}}},
	 series: [
	    {name: 'Aprobado',data: listNumAprobadosAux,color: '#5dcd5d'},
	    {name: 'Desaprobado',data: listNumDesaprobadosAux,color: '#D8D808'},
	    {name: 'Pendiente',data: listNumPendientesAux,color: '#ff7474'}]
      });	   
   });
}

var listOpcionesGraficoCapOnline=[
   {id:1,nombre:"Resumen de capacitación online"},
   {id:2,nombre:"Combinación Capacitación online - Formación"}
];

function ocultarSeleccionarOpcionGraficoCapOnline(){
   $("#modalSelOpcionGraficoCapOnline").modal("hide");
}

function seleccionarOpcionGraficoCapOnline(){
   $("#modalSelOpcionGraficoCapOnline").remove();
   
   var selOpcionGraficoCapOnline = crearSelectOneMenuOblig("selOpcionGraficoCapOnline","",
      listOpcionesGraficoCapOnline,"","id","nombre");
     
   var contenido = "";
  
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Gráfico",inputForm:selOpcionGraficoCapOnline},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	             "onclick='ocultarSeleccionarOpcionGraficoCapOnline()'>" +
    	        "<i class='fa fa-times'></i> Cancelar" +
    	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		 "onclick='redireccionarGraficoCapacitacionOnline()'>" +
    	            "<i class='fa fa-check'></i> Aceptar" +
    	         "</button>"}
   ];
    	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    	
   var modalOptions={
      id: "modalSelOpcionGraficoCapOnline",
      nombre: "<i class='fa fa-list-ul'></i> Debe seleccionar una de las opciones",
      contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
   };
    	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
   $("#modalSelOpcionGraficoCapOnline").modal("show");
}

function redireccionarGraficoCapacitacionOnline(){
   $("#modalSelOpcionGraficoCapOnline").modal("hide");
   
   var opcionId = parseInt($("#selOpcionGraficoCapOnline").val());
  
   if(opcionId == 1){
      valoresPreviosParametrosGraficoCapOnline();
   }else if(opcionId == 2){
      valoresPreviosParamGraficoCombinacionCapOnline(); 
   }
}

var listCapacitacionesAux=[],listCursosVigentesIdCapAux=[];

function ocultarValoresPreviosParamGraficoCombinacionCapOnline(){
   $("#modalValParamGraficoCombinacionCapOnline").modal("hide");
}

function valoresPreviosParamGraficoCombinacionCapOnline(){
   var dataParam={
      idCompany: parseInt(getSession("gestopcompanyid")),
      esCapacitacionOnline: 0
   }; 
		  		
   callAjaxPost(URL+'/capacitacion/vista_admin/simple',dataParam,function(data){
      listCapacitacionesAux = data.list;
    
      if(listCapacitacionOnlineAux.length > 0 && listCapacitacionesAux.length > 0){
         $("#modalValParamGraficoCombinacionCapOnline").remove();
   
         var selCapacitacionOnlineBase = crearSelectOneMenuOblig("selCapacitacionOnlineBase","",
            listCapacitacionOnlineAux,"","capacitacionId","capacitacionNombre");
         
         var selCapacitacionAuxiliar = crearSelectOneMenuOblig("selCapacitacionAuxiliar","",
            listCapacitacionesAux,"","capacitacionId","capacitacionNombre");
     
         var contenido = "";
  
         var listContenido=[
            {sugerencia:"<label>*Se considerará a todos los trabajadores asignados (aprobados y pendientes).</label>",
             anchoLabel:"",anchoDiv:"",label:"Capacitación online*",inputForm:selCapacitacionOnlineBase},
            {sugerencia:"<label>**Para considerará solo a los trabajadores aprobados.</label>",
             anchoLabel:"",anchoDiv:"",label:"Formación**",inputForm:selCapacitacionAuxiliar},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             label:"'Para obtener el gráfico exacto, recuerde seleccionar la misma opción (tema general) tanto en " +
             	   "Capacitación online como en Formación (en caso el tema general tenga el mismo nombre en ambos módulos).'",
             inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
    	                   "onclick='ocultarValoresPreviosParamGraficoCombinacionCapOnline()'>" +
    	              "<i class='fa fa-times'></i> Cancelar" +
    	           "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
    	   		       "onclick='verResultadoGraficoCombinacionCapacitacionOnline()'>" +
    	                  "<i class='fa fa-bar-chart'></i> Gráfico" +
    	               "</button>"}
            ];
    	    
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
         });
    	
         var modalOptions={
            id: "modalValParamGraficoCombinacionCapOnline",
            nombre: "<i class='fa fa-list-ul'></i> Gráfico - Valores",
            contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
         };
    	
         crearModalPrincipalUsuario(modalOptions,function(){},true,true);
        
         $("#modalValParamGraficoCombinacionCapOnline").modal("show");
      }else{
         mensajeUx = "<label>Para utilizar esta función, debe tener al menos " +
      		     "una capacitación online y una formación registrada.</label>";
         mensajesUx(mensajeUx,2,""); 
      }
   });
}

function verResultadoGraficoCombinacionCapacitacionOnline(){
   var nombreCapacitacionOnline="";
   var puestosAsignadosIdAux,trabAgregadosIdAux,trabExoneradosIdAux,
       trabGrupoSeguridadIdAux,cursosVigentesIdAux,ultimoCursoIdAux;
   var capacitacionOnlineIdAux = parseInt($("#selCapacitacionOnlineBase").val());

   listCapacitacionOnlineAux.forEach(function(val,index){
      if(capacitacionOnlineIdAux == val.capacitacionId){
	 nombreCapacitacionOnline = val.capacitacionNombre;puestosAsignadosIdAux = val.listPuestosAsignadosId;
	 trabAgregadosIdAux = val.listTrabAgregadosId;trabExoneradosIdAux = val.listTrabExoneradosId;
	 trabGrupoSeguridadIdAux = val.listTrabGrupoSeguridadId;cursosVigentesIdAux = val.listCursosVigentesId;
	 ultimoCursoIdAux = val.ultimoCursoId;
      }    
   });
   
   listPuestosAsignadosIdAux=[],listTrabAgregadosIdAux=[],listTrabExoneradosIdAux=[],
   listTrabGrupoSeguridadIdAux=[],listCursosVigentesIdAux=[]; 
   
   if(puestosAsignadosIdAux.length != 0){
      var puestosAsignadosId = puestosAsignadosIdAux.split(","); 
   
      puestosAsignadosId.forEach(function(val){
 	 listPuestosAsignadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabAgregadosIdAux.length != 0){
      var trabAgregadosId = trabAgregadosIdAux.split(","); 
   
      trabAgregadosId.forEach(function(val){
	 listTrabAgregadosIdAux.push(parseInt(val));
      });
   }
   
   if(trabExoneradosIdAux.length != 0){
      var trabExoneradosId = trabExoneradosIdAux.split(","); 
   
      trabExoneradosId.forEach(function(val){
	 listTrabExoneradosIdAux.push(parseInt(val));
      });
   }
   
   if(trabGrupoSeguridadIdAux.length != 0){
      var trabGrupoSeguridadId = trabGrupoSeguridadIdAux.split(","); 
   
      trabGrupoSeguridadId.forEach(function(val){
	 listTrabGrupoSeguridadIdAux.push(parseInt(val));
      });
   }
   
   if(cursosVigentesIdAux.length != 0){
      var cursosVigentesId = cursosVigentesIdAux.split(","); 
   
      cursosVigentesId.forEach(function(val){
         listCursosVigentesIdAux.push(parseInt(val));
      });
   }
   
   var nombreCapacitacion="";
   var cursosVigentesIdCapAux;
   var capacitacionIdAux = parseInt($("#selCapacitacionAuxiliar").val());

   listCapacitacionesAux.forEach(function(val,index){
      if(capacitacionIdAux == val.capacitacionId){
	 nombreCapacitacion = val.capacitacionNombre;cursosVigentesIdCapAux = val.listCursosVigentesId;
      }    
   });
   
   listCursosVigentesIdCapAux=[];
   
   if(cursosVigentesIdCapAux.length != 0){
      var cursosVigentesCapId = cursosVigentesIdCapAux.split(","); 
   
      cursosVigentesCapId.forEach(function(val){
         listCursosVigentesIdCapAux.push(parseInt(val));
      });
   }

   var dataParam={ 
      empresaId: parseInt(getSession("gestopcompanyid")),
      capacitacionId: capacitacionIdAux,ultimoCursoId: ultimoCursoIdAux,
      listPuestosAsignadosIdAux: 
         (listPuestosAsignadosIdAux.length == 0?null:listPuestosAsignadosIdAux),
      listTrabAgregadosIdAux: 
	 (listTrabAgregadosIdAux.length == 0?null:listTrabAgregadosIdAux),
      listTrabExoneradosIdAux: 
	 (listTrabExoneradosIdAux.length == 0?null:listTrabExoneradosIdAux),
      listTrabGrupoSeguridadIdAux: 
	 (listTrabGrupoSeguridadIdAux.length == 0?null:listTrabGrupoSeguridadIdAux),
      listCursosVigentesIdAux: 
	 (listCursosVigentesIdAux.length == 0?null:listCursosVigentesIdAux),
      listCursosVigentesIdCapAux: 
	 (listCursosVigentesIdCapAux.length == 0?null:listCursosVigentesIdCapAux)
   };
  	   
   callAjaxPost(URL+'/capacitacion/online/trabajador/formacion/grafico/combinacion',dataParam,function(data){
      var listValoresCapOnlineGrafico = data.valoresCapacitacionOnlineGrafico;
      var listAreasAux=[],listNumAprobadosAux=[],listNumDesaprobadosAux=[],listNumPendientesAux=[];
      var numCumplimientoTotal = 0,numAsignadosTotal = 0,resultadoDecimal;
      
      listValoresCapOnlineGrafico.forEach(function(val,index){
         if(val.numTrabajadoresAsignados > 0){
            var numTrabPendientes = val.numTrabajadoresAsignados - (val.numTrabAprobados + val.numTrabDesaprobados); 
            
            numCumplimientoTotal = numCumplimientoTotal + val.numTrabAprobados + val.numTrabDesaprobados;
            numAsignadosTotal = numAsignadosTotal + val.numTrabajadoresAsignados;
              
            listAreasAux.push(val.areaName);
            listNumAprobadosAux.push(val.numTrabAprobados);
            listNumDesaprobadosAux.push(val.numTrabDesaprobados);
            listNumPendientesAux.push(numTrabPendientes);
         }
      });
      
      resultadoDecimal = (numAsignadosTotal == 0?0:pasarDecimalPorcentaje((numCumplimientoTotal/numAsignadosTotal),2));
         
      $("#modalValParamGraficoCombinacionCapOnline").modal("hide");
      $("#modalGraficoCombinacionTrabCapacitacionOnline").remove();
         
      var modalOptions={
         id: "modalGraficoCombinacionTrabCapacitacionOnline",
         maxWidth: "90%",
         nombre: "Gráfico Combinación - Capacitación Online ["+nombreCapacitacionOnline+"] + " +
                 "Formación ["+nombreCapacitacion+"]",
//         dontRemoveBack: true,
         contenido: "<div id='divGraficoCombinacionTrabCapOnline'></div>"
      };
     	    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      resizeDivWrapper("divGraficoCombinacionTrabCapOnline",170);
       
      Highcharts.chart('divGraficoCombinacionTrabCapOnline',{
         chart:{type: 'column'},
	 title:{text: "% de cumplimiento: "+resultadoDecimal+" ("+numCumplimientoTotal+"/"+numAsignadosTotal+")",
	        align: 'left',
	        style: {fontWeight: 'bold',fontSize: '20px'}},
	 xAxis:{
	    categories: listAreasAux,
	    labels: {
	       style: {fontWeight: 'bold'}},
	    title: {
	       text: 'Área',
	       style: {fontWeight: 'bold',fontSize: '18px'}}},
	 yAxis:{
	    min: 0,max: 100,tickInterval: 10,
	    title: {
	       text: 'Porcentajes',
	       style: {fontWeight: 'bold',fontSize: '18px'}},
	    labels: {
	       style: {fontWeight: 'bold',fontSize: '18px'},
	       formatter: function(){
	          return this.value+ '%'
	       }},
	    stackLabels: {
	       enabled: true,
	          style: {
	             fontWeight: 'bold',
	             color: ( // theme
	                Highcharts.defaultOptions.title.style &&
	                Highcharts.defaultOptions.title.style.color) || 'gray',
	             textOutline: 'none'}}},
	 legend: {
	    align: 'right',x: -30,verticalAlign: 'top',y: 0,floating: true,
	    backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
	    borderColor: '#CCC',borderWidth: 1,shadow: false},
	 tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
	    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>' +
	                 '<br/>Total: {point.stackTotal} (100%)'}, 
	 plotOptions: {
            column: {
	       stacking: 'percent',
	       dataLabels: {
	          enabled: true,color: 'black',style: {fontSize: '25px'}}}},
	 series: [
	    {name: 'Aprobado',data: listNumAprobadosAux,color: '#5dcd5d'},
	    {name: 'Desaprobado',data: listNumDesaprobadosAux,color: '#D8D808'},
	    {name: 'Pendiente',data: listNumPendientesAux,color: '#ff7474'}]
      });	   
   });
}

function volverResumenCapacitacionOnline(){
   $("#modalConsolidadoHistorialCorreoCapOnline").modal("hide");$("#modalResumenTrabCapacitacionOnline").modal("show");
}

function verHistoriaCorreoCapacitacionOnline(){
   $("#modalResumenTrabCapacitacionOnline").modal("hide");$("#modalConsolidadoHistorialCorreoCapOnline").remove();
    
   var contenido = "";
    
   var buttonVolver =
      "<button type='button' id='btnVolverCapacitacionOnline' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverResumenCapacitacionOnline()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
    
   var modalOptions={
      maxWidth:"50%",id:"modalConsolidadoHistorialCorreoCapOnline",
      nombre:"<i class='fa fa-table'></i> Historial de correos",
      contenido: 
 	 buttonVolver +
         "<div class='wrapper' id='wrapperHistorialCorreoCapOnline'>" +
            "<table id='tblHistorialCorreoCapOnline' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 	             "<td class='tb-acc' style='width:100px'>N° Orden</td>" +
 		     "<td class='tb-acc' style='width:300px'>Correo</td>" +
 		     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperHistorialCorreoCapOnline",190);    
    
   var dataParam={
      capacitacionId: capacitacionId
   }; 
    
   callAjaxPost(URL+"/capacitacion/online/historial_correo",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
 	 var listHistorialCorreo = data.listHistorialCorreo;
 	 
 	 $("#tblHistorialCorreoCapOnline tbody tr").remove();
 	 
 	 listHistorialCorreo.forEach(function(val,index){
 	    $("#tblHistorialCorreoCapOnline tbody").append(
 	       "<tr id='fcorreo"+val.id+"'>" +
 	          "<td>"+(index+1)+"</td>" +
 		  "<td>"+val.correo+"</td>" +
 		  "<td>"+val.fechaRegistroTexto+"</td>" +
               "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblHistorialCorreoCapOnline","#wrapperHistorialCorreoCapOnline");
   });
}

//Eliminar en caso conflicto
//Eliminar en caso conflicto