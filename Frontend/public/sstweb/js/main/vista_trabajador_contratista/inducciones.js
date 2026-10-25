var listFullInduccionesTrabajadorContratista = [];
var mapInduccionesPorLlevar,mapInduccionesPorRenovar;
var mensajeUx;

function habilitarInduccionesTrabajadorContratista(){
    var dataParam = {};
    
    var listPanelesPrincipal=[];
     
    callAjaxPost(URL+'/public/trabajador_contratista/inducciones',dataParam,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
 	            $(".divListPrincipal").html("");
 	            listFullInduccionesTrabajadorContratista = data.cursos;
 	     
 	    		var sinIndPorLlevar = 0,sinIndPorRenovar = 0;
 	    		var listPorLlevar = [],listPorRenovar = [],listCompletados = [];
 	    		mapInduccionesPorLlevar = new Map();mapInduccionesPorRenovar = new Map();
			 
	    		listFullInduccionesTrabajadorContratista.forEach(function(val,index){
					if(objPrincipalTrabContInfo.hasTrabAltRiePerfilContActivado == 0 || val.examen.tipo.id == 3 || hashTrabAltoRieTrabContDirecto.has(val.examen.tipo.id)){
	            		if(val.evaluacion.isAprobado != 1 && val.evaluacion.numRegistros < 2){
		        			listPorLlevar.push(val);mapInduccionesPorLlevar.set(val.id,val);
	       				}else if((val.evaluacion.isAprobado != 1 && val.evaluacion.numRegistros > 1) || (val.evaluacion.isAprobado == 1 &&
	            			((val.evaluacion.hasVigenciaVencida == 1 && val.evaluacion.numRegistros > 0) || val.evaluacion.hasRenovacionActiva == 1))){
		  					if(val.evaluacion.hasRenovacionActiva == 1){
		     					val.evaluacion.numIntentos = 0;
		  					}
		   
		  					listPorRenovar.push(val);mapInduccionesPorRenovar.set(val.id,val);
	       				}else if(val.evaluacion.isAprobado == 1 && val.evaluacion.hasVigenciaVencida == 0){
		  					listCompletados.push(val);
	       				}
					}
	    		});
 	  
 	    if(listPorLlevar.length == 0){
 	       listPorLlevar.push({id:-1,nombre:"Sin inducciones por llevar"});sinIndPorLlevar = 1;
 	    }
 	   
 	    var selPorLlevar = crearSelectOneMenuOblig("selPorLlevar","verAcordeCursoPorLlevar()",listPorLlevar,"","id","nombre");

 	    var contenidoPorLlevarSelect = "";
 	  				
 	    var listContenidoPorLlevarSelect=[
 	       {sugerencia:"",label:"Inducción:",inputForm:""+selPorLlevar},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar",label:"Tipo:",inputForm:"",divContainer:"divTipoCursoPorLlevar"},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar",label:"Vigencia:",inputForm:"",divContainer:"divVigenciaCursoPorLlevar"},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar",label:"N° de intentos:",inputForm:"",divContainer:"divNumIntentosCursoPorLlevar"},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar campoTiempoRevisarMaterialPorLlevar",label:"Tiempo para revisar el material:",
 	 	inputForm:"",divContainer:"divTiempoRevisarMaterialPorLlevar"},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	       {sugerencia:"",clase:"campoInduccionPorLlevar",label:"",
 	  	inputForm:"<button id='btnLlevarCursoIndVir' class='btn btn-success' style='float:right;font-size:18px;' " +
 	  	  		  "onclick='validacionDetalleCursoTrabajadorContratista(0)'>" +
 	  	             "<i class='fa fa-pencil-square-o'></i> Ingresar al curso" +
 	  	          "</button>"},
 	    ]; 
 	      
 	    contenidoPorLlevarSelect += "<div class='eventoGeneral'>" +
 	                                   "<div class='eventoGeneral'>";
 	       listContenidoPorLlevarSelect.forEach(function(val){
 		  contenidoPorLlevarSelect += obtenerSubPanelModuloVersionDos(val);
 	       });
 	    contenidoPorLlevarSelect +=    "</div>" +
 	                                "</div>";   
 	    
 	    if(listPorRenovar.length == 0){
 	       listPorRenovar.push({id:-1,nombre:"Sin inducciones por renovar"});sinIndPorRenovar = 1;
 	    }
 	    
	    var selRenovarInd = crearSelectOneMenuOblig("selRenovarInd","verAcordeCursoRenovar()",listPorRenovar,"","id","nombre");

 	    var contenidoPorRenovarSelect = "";
 	  				
 	    var listContenidoPorLlevarSelect=[
 	       {sugerencia:(sinIndPorRenovar == 0?"":"<label>* La inducción se habilitará desde 30 días antes del fin de " +
	        "la vigencia de la evaluación registrada.</label>"),label:"Inducción:",inputForm:""+selRenovarInd},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar",label:"Tipo:",inputForm:"",divContainer:"divTipoCursoPorRenovar"},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar",label:"Vigencia:",inputForm:"",divContainer:"divVigenciaCursoPorRenovar"},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar",label:"N° de intentos:",inputForm:"",divContainer:"divNumIntentosCursoPorRenovar"},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar campoTiempoRevisarMaterialPorRenovar",label:"Tiempo para revisar el material:",
 		inputForm:"",divContainer:"divTiempoRevisarMaterialPorRenovar"},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	       {sugerencia:"",clase:"campoInduccionPorRenovar",label:"",
 	  	inputForm:"<button id='btnRenovarCursoIndVir' class='btn btn-success' style='float:right;font-size:18px;' " +
 	  	  		  "onclick='validacionDetalleCursoTrabajadorContratista(1)'>" +
 	  	             "<i class='fa fa-pencil-square-o'></i> Ingresar al curso" +
 	  	          "</button>"},
 	    ]; 
 	      
 	    contenidoPorRenovarSelect += "<div class='eventoGeneral'>" +
 	                                    "<div class='eventoGeneral'>";
 	       listContenidoPorLlevarSelect.forEach(function(val){
 		  contenidoPorRenovarSelect += obtenerSubPanelModuloVersionDos(val);
 	       });
 	    contenidoPorRenovarSelect +=    "</div>" +
 	                                 "</div>";   
 	    
 	    var textTotal = "";
 	     
 	    listCompletados.forEach(function(val,index){
 	        var btnOpcion = "<a class='btn-gestion efectoLink' style='float:right' onclick='verDetalleCursoTrabajadorContratista("+val.id+",1)'>" +
	                                   "<i class='fa fa-eye' aria-hidden='true'></i> Ver detalle" +
                                   "</a>",
				resultado = (val.evaluacion.puntajeAlcanzado == -1?val.evaluacion.evaluacionNombre:val.evaluacion.evaluacionNombre+" ("+val.evaluacion.puntajeAlcanzado+")"),
		nombreEvi = (val.evaluacion.evidenciaCargoNombre.length == 0?"Pendiente - Agregarlo en Ver detalle":"<a href='"+URL+"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+val.evaluacion.id+"' " +
		    "target='_blank' class='efectoLink'>"+val.evaluacion.evidenciaCargoNombre+"</a>");
				
	       var listTotal=[
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion,
		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>"+"*** DATOS GENERALES ***"+"</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	          {sugerencia:"",label:"<i class='fa fa-list'></i> Inducción:",inputForm:val.nombre},
	          {sugerencia:"",label:"<i class='fa fa-info-circle'></i> Tipo:",inputForm:val.examen.tipo.nombre},
	          {sugerencia:"",label:"<i class='fa fa-book'></i> Tema:",inputForm:val.capacitacionAsociada.tema},
	          {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha y hora:",inputForm:val.evaluacion.fechaInicioVigenciaTexto},
	          {sugerencia:"",label:val.evaluacion.icono+" Resultado:",inputForm:resultado},
	          {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha fin de vigencia:",inputForm:val.evaluacion.fechaFinVigenciaTexto},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>"+"*** CARGO ***"+"</span>"},
		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		  {sugerencia:"",label:"<i class='fa fa-download'></i> Evidencia",inputForm:nombreEvi}
	       ];
	       
 	       if(val.evaluacion.evidenciaCargoNombre.length != 0 || val.fechaEvaluacionTexto.length != 0){
 		  listTotal.push({sugerencia:"",label:val.evaluacionCargo.icono+" Evaluación",inputForm:val.evaluacionCargo.nombre});  
 	       }
	       
	       if([2,3].includes(val.evaluacionCargo.id) && val.evaluacionCargo.observacion.length != 0){
		  var textObservacion = (val.evaluacionCargo.observacion.length == 0?"------":val.evaluacionCargo.observacion); 
			    	  
		  listTotal.push({sugerencia:"",label:"<i class='fa fa-exclamation-circle'></i> Observación",inputForm:textObservacion});
	       }  
	       
	       if([1,2].includes(val.evaluacionCargo.id) && val.fechaEvaluacionTexto.length != 0){
		  var evaluacionDetalle = (val.fechaEvaluacionTexto.length == 0?"------":val.fechaEvaluacionTexto +
		     (val.evaluacionCargo.usuario.userName.length == 0?"":"<br>(Por "+val.evaluacionCargo.usuario.userName+")"));
		   
	          listTotal.push({sugerencia:"",label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:evaluacionDetalle}); 
	       }
	       
	       var estiloGosst = (val.evaluacionCargo.id == 1?"gosst-aprobado":(val.evaluacionCargo.id == 2?"gosst-desaprobado":"gosst-advertencia"));
	       
 	       textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
                               "<div class='eventoGeneral'>";
 	          listTotal.forEach(function(val){
 	 	     textTotal += obtenerSubPanelModuloVersionDos(val);
 	 	  });
 	       textTotal +=    "</div>" +
	                    "</div>";
 	    });
 	     
 	    listPanelesPrincipal.push(
 	       {id:"divInduccionesPorLlevarSelect",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
 	        nombre:"Inducciones disponibles ("+(sinIndPorLlevar == 1?0:listPorLlevar.length)+")",contenido:contenidoPorLlevarSelect},
 	       {id:"divInduccionesRenovacionSelect",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
 	 	nombre:"Inducciones - Renovación ("+(sinIndPorRenovar == 1?0:listPorRenovar.length)+")",contenido:contenidoPorRenovarSelect},
 	       {id:"divInducionesCompletadas",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",
 	 	nombre:"Inducciones completadas ("+listCompletados.length+")",contenido:textTotal},
 	       {id:"divDetalleInduccion",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"----",contenido:""},
 	       {id:"cursoPreguntasExamenMovil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"----",contenido:""},
 	       {id:"cursoResultadoExamenMovil",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",btnTitleAux:"",nombre:"----",contenido:""});
 	    	
 	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
 	    
 	    verAcordeCursoPorLlevar();verAcordeCursoRenovar();volverInduccionesTrabajadorContratista(0);
 	     
 	    break;
 	     
         default:
 	    alert("nop");
         
 	    break;
      } 
   });
}

function verAcordeCursoPorLlevar(){
   var cursoLlevarId = parseInt($("#selPorLlevar").val());
	
   if(cursoLlevarId == -1){
      $(".campoInduccionPorLlevar").hide(); 
   }else{
      var cursoObj = mapInduccionesPorLlevar.get(cursoLlevarId);
      var numIntentos = (cursoObj.capacitacionAsociada.cantidadIntentosMaximo == 0?cursoObj.evaluacion.numIntentos:
	 cursoObj.evaluacion.numIntentos+"/"+cursoObj.capacitacionAsociada.cantidadIntentosMaximo);
      
      $("#divTipoCursoPorLlevar").html(cursoObj.examen.tipo.nombre);$("#divVigenciaCursoPorLlevar").html(cursoObj.capacitacionAsociada.vigencia.nombre);
      $("#divNumIntentosCursoPorLlevar").html(numIntentos);
      
      if(cursoObj.evaluacion.numIntentos == 0 && cursoObj.capacitacionAsociada.intervaloBloqueoInicial > 0){
	 $(".campoTiempoRevisarMaterialPorLlevar").show();$("#divTiempoRevisarMaterialPorLlevar").html(cursoObj.capacitacionAsociada.intervaloBloqueoInicial+" minuto(s)"); 
      }else{
	 $(".campoTiempoRevisarMaterialPorLlevar").hide();
      }
   }
}

function verAcordeCursoRenovar(){
   var cursoRenovarId = parseInt($("#selRenovarInd").val());
	
   if(cursoRenovarId == -1){
      $(".campoInduccionPorRenovar").hide(); 
   }else{
      var cursoObj = mapInduccionesPorRenovar.get(cursoRenovarId);
      var numIntentos = (cursoObj.capacitacionAsociada.cantidadIntentosMaximo == 0?cursoObj.evaluacion.numIntentos:
	 cursoObj.evaluacion.numIntentos+"/"+cursoObj.capacitacionAsociada.cantidadIntentosMaximo);
      
      $("#divTipoCursoPorRenovar").html(cursoObj.examen.tipo.nombre);$("#divVigenciaCursoPorRenovar").html(cursoObj.capacitacionAsociada.vigencia.nombre);
      $("#divNumIntentosCursoPorRenovar").html(numIntentos);

      if(cursoObj.evaluacion.numIntentos == 0 && cursoObj.capacitacionAsociada.intervaloBloqueoInicial > 0){
	 $(".campoTiempoRevisarMaterialPorRenovar").show();$("#divTiempoRevisarMaterialPorRenovar").html(cursoObj.capacitacionAsociada.intervaloBloqueoInicial+" minuto(s)"); 
      }else{
	 $(".campoTiempoRevisarMaterialPorRenovar").hide();
      }
   }
}

function validacionDetalleCursoTrabajadorContratista(isRenovacion){
   var renovar = parseInt(isRenovacion);
   var cursoId = parseInt((renovar == 1?$("#selRenovarInd").val():$("#selPorLlevar").val()));
   var cursoObj = (renovar == 1?mapInduccionesPorRenovar.get(cursoId):mapInduccionesPorLlevar.get(cursoId));
   
   if(cursoObj.evaluacion.numIntentos > 0 && cursoObj.capacitacionAsociada.cantidadIntentosMaximo != 0 && 
      cursoObj.capacitacionAsociada.cantidadIntentosMaximo == cursoObj.evaluacion.numIntentos){
      mensajeUx = "<label>No puede volver a llevar la inducción porque alcanzó el número máximo de intentos.</label>";
      mensajesUx(mensajeUx,2,"","");
   }else if(cursoObj.evaluacion.numIntentos > 0 && cursoObj.capacitacionAsociada.intervaloTiempoEspera != 0){
      var dataParam={
	 id:cursoObj.evaluacion.id
      };
	    
      callAjaxPostSimpleVersionDos(1,URL+"/public/trabajador_contratista/inducciones/validacion_intervalo_tiempo",dataParam,1,1,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":  
	       if(data.evaluacionTrabajadorContratista.habilitarIntento == 1){
		  verDetalleCursoTrabajadorContratista(0,0,renovar);
	       }else{
	          mensajeUx = "<label>Aún no puede volver a llevar la inducción (estará disponible desde el " +
	             data.evaluacionTrabajadorContratista.fechaIntervaloTiempoTexto+")." +
	             "<br><br>*En ese tiempo, revise de nuevo el material del curso.</label>";
	          mensajesUx(mensajeUx,2,"",""); 
	       }
			 
	       break;
								
	    default:
	       alert("Ocurrió un error al validar el intervalo de tiempo de la inducción.");
         }
      });
   }else{
      verDetalleCursoTrabajadorContratista(0,0,renovar);  
   }
}

var listEnlacesApoyo = [];

function verDetalleCursoTrabajadorContratista(examenId,isCompletado,isRenovacion){
   isCompletado = parseInt(isCompletado);
   examenId = parseInt(examenId);
	
   if(examenId == 0){
      if(parseInt(isRenovacion) == 0){
         examenId = parseInt($("#selPorLlevar").val());
      }else{
         examenId = parseInt($("#selRenovarInd").val());
      }
   }
   
   var cursoObj = listFullInduccionesTrabajadorContratista.find( x => x.id == examenId);
   
   var dataParam={
      id:cursoObj.cursoId,induccionBloqueoInicialId:cursoObj.induccionBloqueoInicialId
   };
   
   cursoExamenActual = cursoObj;cursoExamenActual.id = cursoObj.cursoId;
   
   if(cursoObj.evaluacion.isAprobado == 1){
      cursoObj.evaluacion.numIntentos = 0;
   }
   
   $(".divListPrincipal > div").hide();
	
   callAjaxPost(URL+"/public/curso/enlaces",dataParam,function(data){
      listEnlacesApoyo = data.enlaces;
		  
      $("#divDetalleInduccion .tituloSubList").html(
         "<button onclick='volverInduccionesTrabajadorContratista(1)' style='float:left' class='btn btn-success'>" +
            "<i class='fa fa-arrow-left fa-2x'></i>" +
      	 "</button> "+cursoObj.nombre);
      
      var listContenido=[
         {sugerencia:"",label:"Descripción del curso",inputForm:""+cursoObj.descripcion}
      ]; 
      
      if(listEnlacesApoyo.length != 0){
         listContenido.push(
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",label:"Enlace(s) del curso",inputForm: ""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
         
         listEnlacesApoyo.forEach(function(val,index){
            var textEnlace = 
     	       "<a target='_blank' class='efectoLink' href='"+val.nombre+"'>" +
				   "Ver "+(val.nombreMostrar.length == 0?"Enlace #"+(index+1):"'"+val.nombreMostrar+"'") +
               "</a>"+(val.nombre.length == 0?"":" ("+val.nombre+")");	
     	
            listContenido.push(
     	       {sugerencia:"",anchoLabel:"col-sm-1",anchoDiv:"col-sm-11",label:"",
     	        inputForm:textEnlace+(val.observacion.length != 0?"<br>("+val.observacion+")":"")});
            
            if(listEnlacesApoyo.length != (index+1)){
     	       listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});  
            }
         });
         
         listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
      }
      
      var hrefContenido = "/empresa/documento/evidencia?id="+getSession("gestopcompanyid")+"&tipoId="+(cursoObj.examen.tipo.id == 3?
	 (cursoObj.capacitacionAsociada.tipoAccesoTrabajador.id == 1?(cursoObj.examen.tipoContratista.id == 2?9:7):
	  (cursoObj.examen.tipoContratista.id == 2?10:8)):16);
      
      if(isCompletado == 1){
	 listContenido.push(
            {sugerencia:"",label:"Vigencia",inputForm:""+cursoObj.capacitacionAsociada.vigencia.nombre},
	    {sugerencia:"",label:"Fecha y hora en que completó el examen",inputForm:cursoObj.evaluacion.fechaInicioVigenciaTexto+""},
	    {sugerencia:"",label:"Plantilla cargo para firmar",
	     inputForm:"<a target='_blank' href='"+URL+hrefContenido+"' class='efectoLink'>" +
		          "<i class='fa fa-download'></i> Descargar" +
		       "</a>"},
	    {sugerencia:"",label:"Cargo firmado ",inputForm:"",divContainer:"divEviCargoVirtual"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	    {sugerencia:"",
	     label:"<button class='btn btn-success' style='font-size:18px;' onclick='volverInduccionesTrabajadorContratista(1)'>" +
	    	      "<i class='fa fa-arrow-left'></i> Volver" +
	    	   "</button>",
	     inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
		               "onclick='guardarEvidenciaCargoInduccionVirtual("+cursoObj.evaluacion.id+")'>" +
	  	          "<i class='fa fa-floppy-o'></i> Guardar" +
	  	       "</button>"});
		 
	 $("#divDetalleInduccion .contenidoSubList").html(
            "<div class='eventoGeneral'>"+
	        listContenido.reduce((x,y)=>x+obtenerSubPanelModuloVersionDos(y),"" )+
	    "</div>");

         var options={
	         container:"#divEviCargoVirtual",functionCall:function(){
	       	    validacionSubirEvidencia("InduccionVirtual",bitsEvidenciaExamen,"");
			 },
	     descargaUrl:"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo?id="+cursoObj.evaluacion.id,
	    	 esNuevo:(cursoObj.evaluacion.evidenciaCargoNombre.length == 0?true:false),
	    	 idAux:"InduccionVirtual",evidenciaNombre:""+cursoObj.evaluacion.evidenciaCargoNombre
         };
			  	
	 crearFormEvidenciaCompleta(options);
      }else{
	 var funcionEmpezarCurso = (cursoObj.induccionBloqueoInicialId != -1?
            "validacionBloqueoInicialTrabajadorContratista("+cursoObj.cursoId+")":"empezarExamenCurso(1)"); 
	  
         listContenido.push(
            {sugerencia:"",label:"Vigencia",inputForm:""+cursoObj.capacitacionAsociada.vigencia.nombre},
            {sugerencia:"",label:"# de intentos",inputForm:""+cursoObj.evaluacion.numIntentos},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             label:"*Revise el material antes de empezar la evaluación",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",label:"",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' " +
             		       "onclick='"+funcionEmpezarCurso+"'>" +
                          "<i class='fa fa-pencil-square-o'></i> Empezar evaluación" +
                       "</button>"});
	  
	 $("#divDetalleInduccion .contenidoSubList").html(
            "<div class='eventoGeneral'>" +
	        listContenido.reduce((x,y)=>x+obtenerSubPanelModuloVersionDos(y),"" ) +
	    "</div>");
      }
      
      $("#divDetalleInduccion").show();
   });
}

function validacionBloqueoInicialTrabajadorContratista(cursoId){
   var cursoId = parseInt(cursoId);
   
   var dataParam={
      cursoId:cursoId
   };
	    
   callAjaxPostSimpleVersionDos(1,URL+"/public/trabajador_contratista/inducciones/validacion_bloqueo_inicial",dataParam,1,1,function(data){
      switch(data.CODE_RESPONSE){
         case "05":  
	    if(data.evaluacionTrabajadorContratista.habilitarInicioCurso == 1){
	       empezarExamenCurso(1)
	    }else{
	       mensajeUx = "<label>Aún no puede empezar la evaluación (estará disponible desde el " +
	          data.evaluacionTrabajadorContratista.fechaBloqueoInicialTexto+").</label>";
	       mensajesUx(mensajeUx,2,"",""); 
	    }
			 
	    break;
								
	 default:
	    alert("Ocurrió un error al validar el intervalo de tiempo de la inducción.");
      }
   });
}

function guardarEvidenciaCargoInduccionVirtual(idEval){
    var campoVacio = true;
    var cargoNombre = $("#inputEviInduccionVirtual").val();
    
    if(cargoNombre.length == 0){
        mensajeUx = "<label>Debe subir la evidencia.</label>";campoVacio = false;
    }else if(cargoNombre == "VOLVER A SUBIR"){
      	mensajeUx = "<label>Debe volver a subir la evidencia.</label>";campoVacio = false;
    }
    
    if(campoVacio){
        guardarEvidenciaAutoVersionS3(1,parseInt(idEval),"fileEviInduccionVirtual",bitsEvidenciaExamen,
	1,1,"/contratista/amazon_s3/induccion_virtual/trabajador_contratista/evidencia/cargo/save","contratista-has-examen-trabajador/evidencia-cargo",function(){
	    mensajeUx = "<label>El cargo fue registrado con éxito.</label>";
	    mensajesUx(mensajeUx,1,"","ActualizarExamenVirtual");

	    $("#modalMensajeUxActualizarExamenVirtual").on("hidden.bs.modal",function(){
	        habilitarInduccionesTrabajadorContratista();
	    });
        });
    }else{
      	mensajesUx(mensajeUx,2,"","");
    }
}

function volverInduccionesTrabajadorContratista(opcionCarga){
   $(".divListPrincipal > div").hide();
 //$("#divInduccionesPorLlevar").show();
   $("#divInduccionesPorLlevarSelect").show();
   $("#divInduccionesRenovacionSelect").show();
   $("#divInducionesCompletadas").show();
   
   if(parseInt(opcionCarga) == 1){
      habilitarInduccionesTrabajadorContratista();
   }
}
