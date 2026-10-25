
var listFullInduccionesVisitante = [];
var mensajeUx;

function habilitarInduccionesVisitante(){
    
   var dataParam={};
    
   var listPanelesPrincipalVis=[];
     
   callAjaxPost(URL+'/public/visitante/inducciones',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05": 
 	     $(".divListPrincipal").html("");
 	     listFullInduccionesVisitante = data.cursos;
 	     
 	     var sinIndPorLlevar = 0;
 	     var sinIndPorRenovar = 0;
 			 
 	     var listPorLlevar = listFullInduccionesVisitante
 	                         .filter( x => x.evaluacion.isAprobado != 1 && x.evaluacion.numRegistros < 2);
 	     
 	     var listPorRenovar = listFullInduccionesVisitante
 	                          .filter( x => (x.evaluacion.isAprobado == 1 && x.evaluacion.hasVigenciaVencida == 1 &&
 		                                 x.evaluacion.numRegistros > 0) ||
 		                                (x.evaluacion.isAprobado != 1 && x.evaluacion.numRegistros > 1) ||
 		                                (x.evaluacion.isAprobado == 1 && x.evaluacion.hasRenovacionActiva == 1));
 	     
 	     var listCompletados = listFullInduccionesVisitante.filter( x => x.evaluacion.isAprobado == 1 &&
 		     							     x.evaluacion.hasVigenciaVencida == 0);
 	  
 	     listPorLlevar.forEach( x => x.nombreSelect = x.nombre);
 	     
 	     if(listPorLlevar.length == 0){
 		listPorLlevar.push({id: -1,nombreSelect: "Sin inducciones por llevar"});
 		
 		sinIndPorLlevar = 1;
 	     }
 	   
 	     var selPorLlevarVisitante = crearSelectOneMenuOblig("selPorLlevarVisitante","verAcordeCursoPorLlevarVis()",
 		    listPorLlevar,"","id","nombreSelect");
 			 
 	     var contenidoPorLlevarSelectVis = 
 		    "<div class='eventoGeneral'>"+[ 
 	   	        {sugerencia:"",label:"Elegir inducción:",inputForm:""+selPorLlevarVisitante},
 	  	        {sugerencia:"",label:"Vigencia",inputForm:"",divContainer:"divVigenciaCursoPorLlevarVis"},
 	  	        {sugerencia:"",clase:"divButtonOne",label:"",
 	  	         inputForm:"<button onclick='verDetalleCursoVisitante(0,0,0)' " +
 	  	         		   "id='btnLlevarCursoIndVirVis' class='btn btn-success'>" +
 	  	         	      "Ingresar al curso" +
 	  	         	   "</button>",isFull:1},
 	  	     ].reduce(((total,current) => total+ ""+obtenerSubPanelModuloGeneral(current)+""),"")+
 	  	    "</div>";
 	     
 	     if(listPorRenovar.length == 0){
 		listPorRenovar.push({id: -1,nombre: "Sin inducciones por renovar"});
 		
 		sinIndPorRenovar = 1;
 	     }
 	     
 	     var selRenovarIndVisitante = crearSelectOneMenuOblig("selRenovarIndVisitante","verAcordeCursoRenovarVis()",
 		    listPorRenovar,"","id","nombre");
		 
	     var contenidoRenovarSelectVis = 
		    "<div class='eventoGeneral'>"+[ 
	   	        {sugerencia:(sinIndPorRenovar == 0?"":
	   	                     "<label>* La inducción se habilitará desde 30 días antes del fin de " +
		   	             "la vigencia de la evaluación registrada.</label>"),
	   	         label:"Elegir inducción:",inputForm:""+selRenovarIndVisitante},
	  	        {sugerencia:"",label:"Vigencia",inputForm:"",divContainer:"divVigenciaCursoRenovarVis"},
	  	     // {sugerencia:"",clase:"divButtonOne",label:"",inputForm:"<a onclick='verDetalleCursoVisitante(0,0)' class='efectoLink'>Ingresar al curso</a>",isFull:1},
	  	        {sugerencia:"",clase:"divButtonOne",label:"",
	  	         inputForm:"<button onclick='verDetalleCursoVisitante(0,0,1)' " +
	  	         		   "id='btnRenovarCursoIndVirVis' class='btn btn-success'>" +
	  	         	      "Ingresar al curso" +
	  	         	   "</button>",isFull:1},
	  	     ].reduce(((total,current) => total+ ""+obtenerSubPanelModuloGeneral(current)+""),"")+
	  	    "</div>";
  	  
 	     var contenidoCompletadoVis = listCompletados.map( x => [ 
                    {sugerencia:"",label:"Inducción",inputForm:x.nombre+"<a onclick='verDetalleCursoVisitante("+x.id+",1)' style='float : right' class='efectoLink'>Ver detalle</a>",isFull:1},
	            {sugerencia:"",label:"Tema",inputForm:x.capacitacionAsociada.tema,isFull:1},
 	            {sugerencia:"",label:"Nota",inputForm:pasarDecimalPorcentaje(x.evaluacion.puntajeAlcanzado)},
 	            {sugerencia:"",label:"Vigencia hasta:",inputForm:	x.evaluacion.fechaFinVigenciaTexto},
 	            {sugerencia:"",label:"Cargo",inputForm:(x.evaluacion.evidenciaCargoNombre.length==0?
 	             "Sin cargo - Agregarlo en Ver detalle":
 	             "<a href='"+URL+"/public/visitante/induccion_virtual/evidencia/cargo?id="+x.evaluacion.id+"' class='efectoLink' target='_blank'>" +
 	                "<i class='fa fa-download'></i> Descargar" +
 	             "</a>")},
 	            {sugerencia:"",label:"Evaluación Cargo",
 	             inputForm:x.evaluacionCargo.icono+x.evaluacionCargo.nombre+"<br><strong>"+x.evaluacionCargo.observacion+"</strong>"}
 	         ]).reduce((total,current) => total+ "<div class='eventoGeneral'>"+current.map(obtenerSubPanelModuloGeneral).reduce((x,y)=>x+y,"" )+"</div>","");
 	     
 	     listPanelesPrincipalVis.push(
 	        {id:"divInduccionesPorLlevarSelectVis",clase:"",
 	         nombre:"Inducciones por llevar ("+(sinIndPorLlevar == 1?0:listPorLlevar.length)+")", contenido:contenidoPorLlevarSelectVis},
 	        {id:"divInduccionesRenovacionSelectVis",clase:"",
 	         nombre:"Inducciones - Renovación ("+(sinIndPorRenovar == 1?0:listPorLlevar.length)+")", contenido:contenidoRenovarSelectVis},
 		{id:"divInducionesCompletadasVis",clase:"",nombre:"Inducciones completadas ("+listCompletados.length+")", contenido:contenidoCompletadoVis},
 		{id:"divDetalleInduccion",clase:"",nombre:"---- ", contenido:""},
 		{id:"cursoPreguntasExamenMovil",clase:"",nombre:"---- ", contenido:""},
 		{id:"cursoResultadoExamenMovil",clase:"",nombre:"---- ", contenido:""});
 	    	
 	     agregarPanelesDivPrincipalGeneral(listPanelesPrincipalVis);
 	    
 	     if(listPorLlevar.length > 0 && sinIndPorLlevar == 0){
 	        verAcordeCursoPorLlevarVis();	
 	     }
 	     
 	     if(listPorRenovar.length > 0 && sinIndPorRenovar == 0){
 		verAcordeCursoRenovarVis();	
 	     }
 	    
 	     if(parseInt($("#selPorLlevarVisitante").val()) == -1){
 	        document.getElementById("btnLlevarCursoIndVirVis").disabled = true;
 	     }
 	     
 	     if(parseInt($("#selRenovarIndVisitante").val()) == -1){
 	        document.getElementById("btnRenovarCursoIndVirVis").disabled = true;
 	     }  
 	     
 	     volverInduccionesVisitante();
 	     
 	    break;
 	     
         default:
 	    alert("nop");
         
 	    break;
      } 
   });
}

function verAcordeCursoPorLlevarVis(){
   var cursoObj = listFullInduccionesVisitante.find( x => x.id == parseInt($("#selPorLlevarVisitante").val()));
   $("#divVigenciaCursoPorLlevarVis").html(cursoObj.capacitacionAsociada.vigencia.nombre);
   
   if(parseInt($("#selPorLlevarVisitante").val()) == -1){
      document.getElementById("btnLlevarCursoIndVirVis").disabled = true;
   }else{
      document.getElementById("btnLlevarCursoIndVirVis").disabled = false; 
   }
}

function verAcordeCursoRenovarVis(){
   var cursoObj = listFullInduccionesVisitante.find( x => x.id == parseInt($("#selRenovarIndVisitante").val()));
   $("#divVigenciaCursoRenovarVis").html(cursoObj.capacitacionAsociada.vigencia.nombre);
   
   if(parseInt($("#selRenovarIndVisitante").val()) == -1){
      document.getElementById("btnRenovarCursoIndVirVis").disabled = true;
   }else{
      document.getElementById("btnRenovarCursoIndVirVis").disabled = false;
   }
}

var listEnlacesApoyo = [];

function verDetalleCursoVisitante(examenId,isCompletado,isRenovacion){
   isCompletado = parseInt(isCompletado);
   examenId = parseInt(examenId);
   
   if(examenId == 0){
      if(parseInt(isRenovacion) == 0){
	 examenId = parseInt($("#selPorLlevarVisitante").val());
      }else{
	 examenId = parseInt($("#selRenovarIndVisitante").val());
      }
   }
   
   var cursoObj = listFullInduccionesVisitante.find( x => x.id == examenId);
   
   var dataParam={
      id: cursoObj.cursoId,
   };
	
   cursoExamenActual = cursoObj;
   cursoExamenActual.id = cursoObj.cursoId;
   
   if(cursoObj.evaluacion.isAprobado == 1){
      cursoObj.evaluacion.numIntentos = 0;
   }
   
   $(".divListPrincipal > div").hide();
	
   callAjaxPost(URL+"/public/curso/enlaces",dataParam,function(data){
      listEnlacesApoyo = data.enlaces;
      
      var textEnlace = (listEnlacesApoyo === undefined || listEnlacesApoyo.length == 0?"------":
	 data.enlaces.reduce((total,current,index) => total+
            "<a target='_blank' class='efectoLink' href='"+current.nombre+"' >"+
    	       "Ver Enlace "+(index+1)+
            "</a><br><br> ",""));
		
      var listContenido=[
             {sugerencia:"",label:"Descripción del curso",inputForm:""+cursoObj.descripcion},
	         {sugerencia:"",label:"Vigencia",inputForm:""+cursoObj.capacitacionAsociada.vigencia.nombre},
    	     {sugerencia:"",label:"Enlaces del curso",inputForm:	textEnlace+""},
    	     {sugerencia:"",label:"# de intentos",
              inputForm:""+cursoObj.evaluacion.numIntentos},
    	     {sugerencia:"",label:" ",inputForm:"*Revise el material antes de empezar la evaluación",isFull:1},
    	     {sugerencia:"",label:"",inputForm:	"<button class='btn btn-success' style='float:right;font-size:18px;' " +
    	     		                                "onclick='empezarExamenCurso(1)'>Empezar evaluación</button>"},
    	                ];
		
      $("#divDetalleInduccion .tituloSubList")
      .html("<button onclick='volverInduccionesVisitante()' style='float:left' class='btn btn-success'>" +
      		   "<i class='fa fa-arrow-left fa-2x'></i>" +
      		"</button>"+cursoObj.nombre);
		
      if(isCompletado == 1){
	      var listContenidoCompleto=[
	             {sugerencia:"",label:"Descripción del curso",inputForm:""+cursoObj.descripcion+""},
			     {sugerencia:"",label:"Enlaces del curso",inputForm:	textEnlace+""},
			     {sugerencia:"",label:"Fecha y hora en que completó el examen",inputForm:	cursoObj.evaluacion.fechaInicioVigenciaTexto+""},
		         {sugerencia:"",label:"Vigencia",inputForm:""+cursoObj.capacitacionAsociada.vigencia.nombre},
	    	     {sugerencia:"",label:"Plantilla cargo para firmar",
		          inputForm:"<a target='_blank' href='"+URL+"/empresa/documento/evidencia?id="+
		                        getSession("gestopcompanyid")+"&tipoId="+4+
		   		             "' class='efectoLink'>" +
		   		               "<i class='fa fa-download'></i> Descargar" +
		   		            "</a>"},
	    	     {sugerencia:"",label:"Cargo firmado ",inputForm:"",divContainer:"divEviCargoVirtual"},
	    	     {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	    	     {sugerencia:"",
	              label:"<button class='btn btn-success' style='font-size:18px;' onclick='volverInduccionesVisitante()'>" +
	    	               "<i class='fa fa-arrow-left'></i> Volver" +
	    	      	    "</button>",
	    	      inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
		                        "onclick='guardarEvidenciaCargoInduccionVirtualVisitante("+cursoObj.evaluacion.id+")'>" +
		                   "<i class='fa fa-floppy-o'></i> Guardar" +
		                "</button>"},
	    	                        ];
			  
	     $("#divDetalleInduccion .contenidoSubList")
	     .html("<div class='eventoGeneral'>"+
	    		   listContenidoCompleto.reduce((x,y)=>x+obtenerSubPanelModuloVersionDos(y),"" )+
	    	   "</div>");
	     
	     var options={
	        container:"#divEviCargoVirtual",functionCall:function(){
	        validacionSubirEvidencia("InduccionVirtual",bitsEvidenciaExamen,"");},
		descargaUrl:"/public/visitante/induccion_virtual/evidencia/cargo?id="+cursoObj.evaluacion.id ,
		esNuevo:(cursoObj.evaluacion.evidenciaCargoNombre.length == 0?true:false),
		idAux:"InduccionVirtual",evidenciaNombre:cursoObj.evaluacion.evidenciaCargoNombre
	     };
			  	
	     crearFormEvidenciaCompleta(options);
      }else{
	     $("#divDetalleInduccion .contenidoSubList")
	     .html("<div class='eventoGeneral'>"+
	    		   listContenido.reduce((x,y)=>x+obtenerSubPanelModuloVersionDos(y),"" )+
	    	   "</div>");
      }
      
      $("#divDetalleInduccion").show();
   });
}

function guardarEvidenciaCargoInduccionVirtualVisitante(idEval){
   var campoVacio = true;
   var cargoNombre = $("#inputEviInduccionVirtual").val();
    
   if(cargoNombre.length == 0){
      mensajeUx = "<label>Debe subir la evidencia.</label>";
      campoVacio = false;
   }else if(cargoNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }
    
   if(campoVacio){
      $.blockUI({message: '<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'}); 
       
      guardarEvidenciaAuto(parseInt(idEval),"fileEviInduccionVirtual",bitsEvidenciaExamen,
      "/public/visitante/induccion_virtual/evidencia/cargo/save",function(){
	 $.unblockUI();
	 mensajeUx="<label>El cargo fue registrado con éxito.</label>";
	 mensajesUx(mensajeUx,1,"","ActualizarExamenVirtual");
				   
	 $("#modalMensajeUxActualizarExamenVirtual").on("hidden.bs.modal",function(){
	    habilitarInduccionesVisitante();
	 });
      });
   }else{
      mensajesUx(mensajeUx,2,"","");
   }
}

function volverInduccionesVisitante(){
   $(".divListPrincipal > div").hide();
 //$("#divInduccionesPorLlevar").show();
   $("#divInduccionesPorLlevarSelectVis").show();
   $("#divInduccionesRenovacionSelectVis").show();
   $("#divInducionesCompletadasVis").show();
}
