
var listEvalInspeccTrabajadoresEpp=[];
var listCategoriasPreguntaTrabEpp=[];
var auditoriaTrabajadoEppId;
var evalInspeccTrabajadorEppObj = {};
var indexEvalInspeccTrabajadorEpp;
var mensajeUx;

function toggleMenuOpcionEvalInspeccTrabajadoresEpp(obj,pindex){
   evalInspeccTrabajadorEppObj = listEvalInspeccTrabajadoresEpp[pindex]; 
   indexEvalInspeccTrabajadorEpp = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesEvalInspeccTrabajadorEpp=[
   {id:"opcEvaluar",nombre:"<i class='fa fa-list-alt'></i> Evaluar ",
    functionClick:function(data){realizarEvaluacionInspeccionTrabajadorEpp()}},
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarSeleccionarTrabajadorEppEvaluacion()}},
   {id:"opcEliminar",nombre:"<i class='fa fa-times'></i> Eliminar ",
    functionClick:function(data){eliminarSeleccionarTrabajadorEppEvaluacion()}}
];

function marcarSubOpcionEvalInspeccTrabajadorEpp(pindex){
   funcionalidadesEvalInspeccTrabajadorEpp[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function procesarListaInspeccionMovilTrabajadorEpp(data){
   if(data.CODE_RESPONSE == "05"){
      $.unblockUI();window.scrollTo({top: 0,behavior: 'smooth'});
      $("#subRealizarInspecciones").find(".contenidoSubList").html("");
       
      auditoriaObjMovil = data.auditoriaAux[0];
      listEvalInspeccTrabajadoresEpp = data.listEvalInspeccTrabajadoresEpp;
      listCategoriasPreguntaTrabEpp = data.listCategoriasPregunta;
      valTipoId = 2;
       
      $("#subRealizarInspecciones").find(".tituloSubList").html(
         textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
       
      $("#infoMovilTrabajadorEppInspeccEvalPendiente").remove();
      $("#infoMovilTrabajadorEppInspeccEvalCompletado").remove();
      $("#estadoMovilRegTrabajadorEppInspeccionFin").remove();
       
      var textPendiente="",textCompletado="";
      var numEvalInsTrabEppApr=0,numEvalInsTrabEppDes=0;
        
      listEvalInspeccTrabajadoresEpp.forEach(function(val,index){
 	 var menuOpcion = "",btnOpcion = "",numPreguntasMarcadas=0,numPreguntasAplican=0;
 	 
 	 menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
 	    funcionalidadesEvalInspeccTrabajadorEpp.forEach(function(val1,index1){
               menuOpcion += 
 	          "<li class='list-group-item' " +
 		      "onclick='marcarSubOpcionEvalInspeccTrabajadorEpp("+index1+")'>" +
 		      val1.nombre +
 		  "</li>";
 	    });
 	 menuOpcion+="</ul>";
 			
 	 btnOpcion = 
 	    "<a class='btn-gestion efectoLink' " +
 	       "onclick='toggleMenuOpcionEvalInspeccTrabajadoresEpp(this,"+index+")'>" +
 	       "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
 	    "</a>";
 	 
 	 numPreguntasMarcadas = val.numRespuestasMarcadasSi + val.numRespuestasMarcadasNo;
 	 
 	 listCategoriasPreguntaTrabEpp.forEach(function(val1){ 
 	    if(val.listCategoriasPreguntaId.indexOf(val1.id) != -1){
               numPreguntasAplican++;   
 	    }
 	 });
 	 
 	 var btnOpcionAux1 = 
 	    "<a id='btnVerInspeccTraEpp"+val.id+"' class='btn-gestion efectoLink' " +
               "onclick='verDetallesInspeccionTrabajadorEpp("+index+")'>" +
               "<i class='fa fa-eye' aria-hidden='true'></i> Ver Detalles" +
            "</a>";

         var btnOpcionAux2 = 
            "<a id='btnOcultarInspeccTraEpp"+val.id+"' style='display:none' class='btn-gestion efectoLink' " +
               "onclick='ocultarDetallesInspeccionTrabajadorEpp("+index+")'>" +
               "<i class='fa fa-eye-slash' aria-hidden='true'></i> Ocultar Detalles" +
            "</a>";

 	 var listTotal=[
 	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 	     label:"<span style='color:blue;font-size:"+(isMobile.any()?"14px":"18px")+";font-weight:bolder;'>" +
 	 	      "*** Datos del trabajador asociado***" +
 	 	   "</span>"},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	     label:"<i class='fa fa-barcode'></i> Apellidos y nombre:",inputForm:val.trabajador.nombre+btnOpcionAux1+btnOpcionAux2},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"<i class='fa fa-building'></i> Puesto de trabajo:",inputForm:val.trabajador.puesto.positionName},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"",inputForm:"",divContainer:""},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"<i class='fa fa-briefcase'></i> EPPs asignados a su evaluación:",inputForm:val.listCategoriasPreguntaNombre},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
             label:"",inputForm:"",divContainer:""},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"<i class='fa fa-calendar'></i> Registrado el",
 	     inputForm:val.fechaCreacionTexto+" (por "+val.registradoPor+")"},
 	    {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
             label:"",inputForm:""},
 	    {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
             clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,inputForm:"",
             label:"<span style='color:blue;font-size:"+(isMobile.any()?"14px":"18px")+";font-weight:bolder;'>" +
 		      "*** Estado de la evaluación ***" +
 		   "</span>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
             label:"<i class='fa fa-info-circle'></i> N° de preguntas con observaciones:",inputForm:val.numRespuestasMarcadasNo},
            {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"<i class='fa fa-info-circle'></i> N° de preguntas sin observación:",
 	     inputForm:val.numRespuestasMarcadasSi},
 	    {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	     label:"<i class='fa fa-info-circle'></i> N° total de preguntas:",inputForm:numPreguntasMarcadas+" / "+numPreguntasAplican},
 	 ]; 
 	 
 	 if(val.numRespuestasMarcadasNo > 0){
 	    listTotal.push(
               {sugerencia:"",anchoLabel:"",anchoDiv:"",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 		label:"",inputForm:""},
 	       {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
 		clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,inputForm:"",
 		label:"<span style='color:blue;font-size:"+(isMobile.any()?"14px":"18px")+";font-weight:bolder;'>" +
 		         "*** Estado de la(s) medida(s) correctiva(s) ***" +
 	              "</span>"},
 	       {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",clase:"detalle-seccionInspeccTraEpp detalle-inspeccTraEpp"+val.id,
 	        label:"<i class='fa fa-info-circle'></i> N° de medidas correctivas oompletadas:",
 	        inputForm:val.numAccCorCompletadas+" / "+val.numRespuestasMarcadasNo}); 
 	 }
 	 
 	 if(numPreguntasMarcadas == numPreguntasAplican){
 	    textCompletado += "<div class='eventoGeneral'>" +
 	                         "<form class='eventoGeneral'>";

 	    listTotal.forEach(function(val,index){
 	       textCompletado += ""+obtenerSubPanelModuloVersionDos(val);
 	    });

 	    textCompletado +=    "</form>" +
 	    		      "</div>";
 	    
 	    numEvalInsTrabEppApr++;
 	 }else{
 	    textPendiente += "<div class='eventoGeneral'>" +
 	                        "<form class='eventoGeneral'>";

 	    listTotal.forEach(function(val,index){
 	       textPendiente += ""+obtenerSubPanelModuloVersionDos(val);
 	    });

 	    textPendiente +=    "</form>" +
 		             "</div>";
 	    
 	    numEvalInsTrabEppDes++;
         }
      });
       
      $("#subRealizarInspecciones").find(".contenidoSubList").append(
         "<div id='estadoMovilSeleccionarTrabajadorEppInspeccion'>" +
            "<div class='tituloSubList'> Lista de trabajadores " +
 	       "<button style='font-size:19px' title='Seleccionar uno de los trabajadores " +
 	               "disponibles para realizar la evaluación respectiva.' " +
 		       "class='btn btn-success' onclick='nuevoSeleccionarTrabajadorEppEvaluacion()'>"+
 	          "<i class='fa fa-list'></i> Seleccionar" +
 	       "</button>" +
 	    "</div>" +
         "</div>");
       
      var listPanelesPrincipal=[];
       
      listPanelesPrincipal.push(
         {id:"infoMovilTrabajadorEppInspeccEvalPendiente",clase:"divSubEvento",styleAux:"", 
 	  nombre:"Evaluación de trabajadores pendientes ("+numEvalInsTrabEppDes+")",
 	  buttonAd:"",contenido:textPendiente},
 	 {id:"infoMovilTrabajadorEppInspeccEvalCompletado",clase:"divSubEvento",styleAux:"display:none", 
 	  nombre:"Evaluación de trabajadores completados ("+numEvalInsTrabEppApr+")",
 	  buttonAd:"",contenido:textCompletado});
 			
      agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
       
      if(numEvalInsTrabEppDes == 0 && numEvalInsTrabEppApr > 0){
 	 $(".divListPrincipal").append(
            "<div id='estadoMovilRegTrabajadorEppInspeccionFin'>" +
 	       "<div class='tituloSubList'> Registrar inspección uso adecuado de EPP como finalizada " +
                  "<button style='font-size:19px;' title='Registrar la inspección uso adecuado de EPP como finalizada.' " +
 		          "class='btn btn-success' onclick='completarCamposAdicionalesFinalizarInspeccion(1)'>"+
 	             "<i class='fa fa-check-square-o'></i> Marcar" +
 	          "</button>" +
               "</div>" +
            "</div>");
      } 
       
      $(".detalle-seccionInspeccTraEpp").hide();
      $(".listaFinalGestionGosst").hide(); 
      $(".contenidoFormVisible").hide();
   }else{ 
      alert("Ocurrió un error al cargar las preguntas de la inspección!");
   }
}

function verDetallesInspeccionTrabajadorEpp(pindex){
   var trabajadorEppId = listEvalInspeccTrabajadoresEpp[pindex].id;
   $("#btnVerInspeccTraEpp"+trabajadorEppId).hide();
   $("#btnOcultarInspeccTraEpp"+trabajadorEppId).show();
  	
   $(".detalle-inspeccTraEpp"+trabajadorEppId).show();
}

function ocultarDetallesInspeccionTrabajadorEpp(pindex){
   var trabajadorEppId = listEvalInspeccTrabajadoresEpp[pindex].id;

   $("#btnVerInspeccTraEpp"+trabajadorEppId).show();
   $("#btnOcultarInspeccTraEpp"+trabajadorEppId).hide();
     
   $(".detalle-inspeccTraEpp"+trabajadorEppId).hide();
}

function ocultarSeleccionarTrabajadorEppEvaluacion(){
   $("#modalSeleccionarTrabajadorEppEval").modal("hide");
}

function nuevoSeleccionarTrabajadorEppEvaluacion(){
   evalInspeccTrabajadorEppObj = { 
      id: 0,
      listCategoriasPreguntaId:""
   }; 
    
   editarSeleccionarTrabajadorEppEvaluacion();
}

function editarSeleccionarTrabajadorEppEvaluacion(){
   $("#modalSeleccionarTrabajadorEppEval").remove();
   auditoriaTrabajadoEppId = evalInspeccTrabajadorEppObj.id;
   
   var radiosCategoriaPreg = crearRadiosAutoOpciones("radioCatPregInspeccTrabEpp",listCategoriasPreguntaTrabEpp,
      evalInspeccTrabajadorEppObj.listCategoriasPreguntaId,"id","nombre","checkbox","left");
 	    
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-search'></i> Buscar Trabajador por dni y/o nombres/apellidos*",
       inputForm:"<input class='form-control' id='inputBuscarTrabajadorEppInspecc'>" +
	         "<label>*Debe ingresar 3 caracteres como mínimo.</label>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador seleccionado para la inspección",
       inputForm:"",divContainer:"divSelTrabajadorEppInspecc"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"<i class='fa fa-building-o'></i> Puesto de trabajo",anchoLabel:"",anchoDiv:"",
       inputForm:"<span id='puestoTrabajoInfoTrabEpp' style='font-weight:bolder;'></span>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
       label:"¿Cuáles EPPs aplican para esta evaluación?",inputForm:"",divContainer:""},
      {sugerencia:"",inputForm:radiosCategoriaPreg,anchoLabel:"",anchoDiv:"",
       label:"",divContainer:"",fullRow:1,clase:"containerCheckbox"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
  		     "onclick='ocultarSeleccionarTrabajadorEppEvaluacion()'>" +
      	        "<i class='fa fa-times'></i> Cancelar" +
      	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' " +
        		 "style='float:right;font-size:18px;'>" +
 	            "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
 	         "</button>"} 
   ]; 
 	    
   var textFormRegistro = "";
 	 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
 	 
   var opciones={
      id: "modalSeleccionarTrabajadorEppEval",
      nombre: "<i class='fa fa-list'></i> Lista de trabajadores",
      contenido: "<form id='formEditarSeleccionarTrabajadorEppEval' " +
       		       "class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
 	    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
           
   if(evalInspeccTrabajadorEppObj.id > 0){
      $("#inputBuscarTrabajadorEppInspecc").val(evalInspeccTrabajadorEppObj.trabajador.nombre);
   }
       
   buscarDisponibleTrabajadorEppInspecc();
       
   var editarDiv = $("#formEditarSeleccionarTrabajadorEppEval");
 	 
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarSeleccionarTrabajadorEppEvaluacion();
   });
}

var listTrabajadoresEppBuscador=[],listTrabajadoresEppBuscadorAux=[];

function buscarDisponibleTrabajadorEppInspecc(){
   var nombre = $("#inputBuscarTrabajadorEppInspecc").val().trim();
	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid")),
         auditoriaId: inspeccionEvento.idAux
      };
		
      callAjaxPostNoLoad(URL+"/auditoria/auditoria_trabajador_epp/trabajador/buscar",dataParam,function(data){
         listTrabajadoresEppBuscador = [];
         listTrabajadoresEppBuscadorAux = data.trabajadores;
       
         if(listTrabajadoresEppBuscadorAux.length == 0){
	    listTrabajadoresEppBuscador.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
	    });
         }else{
	    listTrabajadoresEppBuscadorAux.forEach(function(val){
	       if(auditoriaTrabajadoEppId == 0){
	          if(val.hasInspeccTrabEppAsociada == 0){
	             listTrabajadoresEppBuscador.push(val);  
	          }
	       }else{
		  if(val.hasInspeccTrabEppAsociada == 0 || 
	             evalInspeccTrabajadorEppObj.trabajador.trabajadorId == val.trabajadorId){
		     listTrabajadoresEppBuscador.push(val);  
	          }
	       }
	    });
	  
	    if(listTrabajadoresEppBuscador.length == 0){
	       listTrabajadoresEppBuscador.push({
	          trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
	       }); 
	    }
         }
			
         var selTrabajadorEppInspeccionar = crearSelectOneMenuOblig("selTrabajadorEppInspeccionar",
            "informacionTrabajadorEppSeleccionado()",listTrabajadoresEppBuscador,"","trabajadorId","nombre");
	       
         $("#divSelTrabajadorEppInspecc").html(selTrabajadorEppInspeccionar);
         $("#inputBuscarTrabajadorEppInspecc").attr("onkeyup","buscarDisponibleTrabajadorEppInspecc()");
      
         informacionTrabajadorEppSeleccionado();
      });
   }else{
      listTrabajadoresEppBuscador = [];
      
      listTrabajadoresEppBuscador.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
       
      var selTrabajadorEppInspeccionar = crearSelectOneMenuOblig("selTrabajadorEppInspeccionar","",
         listTrabajadoresEppBuscador,"","trabajadorId","nombre");
		       
      $("#divSelTrabajadorEppInspecc").html(selTrabajadorEppInspeccionar);
      $("#inputBuscarTrabajadorEppInspecc").attr("onkeyup","buscarDisponibleTrabajadorEppInspecc()");
	      
      informacionTrabajadorEppSeleccionado();
   }
}

function informacionTrabajadorEppSeleccionado(){
   var trabajadorId = parseInt($("#selTrabajadorEppInspeccionar").val());
     
   if(trabajadorId != -1){
      listTrabajadoresEppBuscador.forEach(function(val){
 	 if(val.trabajadorId == trabajadorId){
 	    document.querySelector('#puestoTrabajoInfoTrabEpp').innerText = val.puesto.positionName;   
 	    document.getElementById('puestoTrabajoInfoTrabEpp').style.color = "black";
 	 }
      });
   }else{
      document.querySelector('#puestoTrabajoInfoTrabEpp').innerText = "------";
      document.getElementById('puestoTrabajoInfoTrabEpp').style.color = "black";
   } 
}

function guardarSeleccionarTrabajadorEppEvaluacion(){
   var campoVacio = true; 
     
   var trabajadorId = parseInt($("#selTrabajadorEppInspeccionar").val());
   
   var listCategoriasPreguntaTrabEppId = [];

   listCategoriasPreguntaTrabEpp.forEach(function(val,index){
      if(($("#"+val.id+"radioCatPregInspeccTrabEpp").prop("checked")?1:0) == 1){
	 listCategoriasPreguntaTrabEppId.push({
	    id: parseInt(val.id)
         });
      }
   });
   
   var countAux = listCategoriasPreguntaTrabEppId.length;
   var idRespAux = "";
     
   listCategoriasPreguntaTrabEppId.forEach(function(val,index){
      if(countAux == (index+1)){
	 idRespAux += val.id;
      }else{
	 idRespAux += val.id+", "; 
      }	 
   });
   
   if(trabajadorId == -1){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar el trabajador cuyas EPP asignadas " +
      		  "se van a inspeccionar.</label>";
   }else if(listCategoriasPreguntaTrabEppId.length == 0){
      campoVacio = false;
      mensajeUx = "<label>Debe seleccionar al menos un EPP para la evaluación.</label>";  
   }
     
   if(campoVacio){
      var dataParam={
 	 id: auditoriaTrabajadoEppId,
  	 auditoria: {auditoriaId: inspeccionEvento.idAux},
  	 trabajador: {trabajadorId: trabajadorId},
  	 listCategoriasPregunta: listCategoriasPreguntaTrabEppId,
  	 trabajadorId: parseInt(getSession("trabajadorGosstId"))
      }; 
         
      callAjaxPost(URL+'/auditoria/auditoria_trabajador_epp/save',dataParam,function(data){
 	 $("#modalSeleccionarTrabajadorEppEval").remove();
 	 
 	 if(auditoriaTrabajadoEppId == 0){ 
 	    mensajeUx="<label>El trabajador se asoció a la inspección con éxito.<br><br>" +
 	 	      "Empezará el despliegue de las preguntas para la evaluación.</label>";
 	 }else{
 	    mensajeUx="<label>El registro del trabajador se actualizó con éxito.</label>"; 
 	 }
 	 
 	 mensajesUx(mensajeUx,1,"","ActualizarVistaSelTrabEppEva");
 	       
 	 $("#modalMensajeUxActualizarVistaSelTrabEppEva").on("hidden.bs.modal",function(){ 
 	    if(auditoriaTrabajadoEppId == 0){ 
 	       evalInspeccTrabajadorEppObj.id = data.nuevoId;
 	       evalInspeccTrabajadorEppObj.listCategoriasPreguntaId = idRespAux;
 	       
 	       realizarEvaluacionInspeccionTrabajadorEpp();
 	    }else{
 	       realizarInspeccionMovil(idEvento);
 	    }
 	 });
      });
   }else{
      $("#modalSeleccionarTrabajadorEppEval").modal("hide");
        
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposSelTrabEppEva");

      $("#modalMensajeUxAvisoCompletarCamposSelTrabEppEva").on("hidden.bs.modal",function(){
 	 $("#modalSeleccionarTrabajadorEppEval").modal("show");
      });
   }   
}

function eliminarSeleccionarTrabajadorEppEvaluacion(){
   mensajeUx="<label>¿Está seguro de eliminar este registro de trabajador " +
     	     "<br>(DNI: "+evalInspeccTrabajadorEppObj.trabajador.dni+") seleccionado?" +
     	     "<br>(también se eliminará la evaluación relacionada al mismo).</label>";

   mensajesUx(mensajeUx,3,"","RespEliminarSeleccionarTrabEppEval");

   $("#btnDevolverValorRespEliminarSeleccionarTrabEppEval").on("click",function(){
      var dataParam={
  	 id: evalInspeccTrabajadorEppObj.id
      };

      callAjaxPost(URL+'/auditoria/auditoria_trabajador_epp/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El registro del trabajador asociado a la inspección se ha " +
  	       		 "eliminado correctamente.</label>";
  	       mensajesUx(mensajeUx,1,"");
  		
  	       realizarInspeccionMovil(idEvento);
  	       break;
  		
  	    default:
  	       mensajeUx="<label>Error al eliminar el registro.</label>";
  	       mensajesUx(mensajeUx,2,"");	
         }
      });
   });
}

var listFullEvaluacionesInspeccionTrabEpp=[];
var listOpcionesObsInspeccTrabEpp=[
   {id:0,nombre:"Entrega"},{id:1,nombre:"Uso"},{id:2,nombre:"Estado"}
];

function realizarEvaluacionInspeccionTrabajadorEpp(){
   var dataParam={
      id: evalInspeccTrabajadorEppObj.id,
      tipoAuditoriaId: inspeccionEvento.linkAuxiliarId2
   };

   callAjaxPost(URL+'/auditoria/verificaciones/version_dos/auditoria_trabajador_epp/evaluacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listFullEvaluacionesInspeccionTrabEpp = data.listEvaluacionesTrabajadorEpp;
         
            $("#infoMovilTrabajadorEppInspeccEvalPendiente").remove();
            $("#infoMovilTrabajadorEppInspeccEvalCompletado").remove();
            $("#estadoMovilRegTrabajadorEppInspeccionFin").remove();
            $("#subRealizarInspecciones").find(".contenidoSubList").html("");

            $("#subRealizarInspecciones").find(".tituloSubList").html(
               textoBotonVolverContenidoColaborador+" "+inspeccionEvento.text);
	
            listFullEvaluacionesInspeccionTrabEpp.forEach(function(val,index){ 
               $("#subRealizarInspecciones").find(".contenidoSubList")
               .append(crearDivEvalInspeccionTrabajadorEppVersionDos(val,index));
  
               var options={
	          container: "#tdEviPregTrabEpp"+val.verificacionId,
	          functionCall: function(){},
	          descargaUrl: (val.respuestaSimple == 1 || val.respuestaSimple == 2?"":
	             "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/evidencia?" +
	             "detalleAuditoriaTrabajadorEppId="+val.detalleAuditoriaTrabajadorEppId),
	          esNuevo: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaNombre == ""?true:false),
	          idAux: "PregInspeccTrabEpp"+val.verificacionId,
	          evidenciaNombre: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaNombre == ""?
		                    "":val.evidenciaNombre)
               }; 
  
               crearFormEvidenciaCompleta(options);
          
               var optionsMedCor={
 	          container: "#tdEviMedCorTrabEpp"+val.verificacionId,
 	          functionCall: function(){
 	             estadoAccionCorrectivaInspeccTrabEpp(val.verificacionId);
 	          },
 	          descargaUrl: (val.respuestaSimple == 1 || val.respuestaSimple == 2?"":
 	             "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia?" +
 	             "detalleAuditoriaTrabajadorEppId="+val.detalleAuditoriaTrabajadorEppId),
 	          esNuevo: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaAccCorNombre == ""?true:false),
 	          idAux: "MedCorInspeccTrabEpp"+val.verificacionId,
 	          evidenciaNombre: (val.respuestaSimple == 1 || val.respuestaSimple == 2 || val.evidenciaAccCorNombre == ""?
 		                    "":val.evidenciaAccCorNombre),
 		  mensajeAux: "*Al subir la evidencia, el estado de la medida correctiva cambiará de 'Pendiente' a 'Completado'."
               }; 
       
               crearFormEvidenciaCompleta(optionsMedCor);
	 
               $("#textObsAudiTrabEppMovil"+val.verificacionId).val(val.comentario);
          
               habilitarCamposPreguntaInspeccionTrabajadorEppMovil(val.respuestaSimple,val.verificacionId);
               
               if(val.respuestaSimple == 0){
    	          $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val(val.accionCorrectiva); 
    	  
    	          var valFechaPlanificada = convertirFechaInput(val.fechaPlanificacion);
    	          $("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val(valFechaPlanificada);
    	          
    	          listOpcionesObsInspeccTrabEpp.forEach(function(val1){
    		     if((val1.id == 0 && val.hasObservacionEntrega == 1) || (val1.id == 1 && val.hasObservacionUso == 1) ||
    		        (val1.id == 2 && val.hasObservacionEstado == 1)){
    		        document.getElementById(val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).checked = true;  
    		     }
    	          });
    	          
    	          $("#inputBuscarResponsableTrabEppMedCorrMovil"+val.verificacionId).val(val.responsable);
    	          buscarResponsableAccionCorrectivaInspeccTrabEpp(val.verificacionId);
    	       }
                
               if(evalInspeccTrabajadorEppObj.listCategoriasPreguntaId.indexOf(val.categoriaPreguntaId) == -1){
         	  $("#pregInsTrabEppMovil"+index).hide();
               }
  
               if(val.respuestaSimple == 1 || (val.respuestaSimple == 0 && val.evidenciaAccCorNombre.length != 0)){
                  $("#pregInsTrabEppMovil"+index+">div").hide();
               }
          
               $("#pregInsTrabEppMovil"+index+" .divNombrePregunta").show(); 
            });

            $("#subRealizarInspecciones").find(".contenidoSubList").append(
               "<div class='divInformacionCurso' style='padding:20px;'>" +
                  "<button type='button' class='btn btn-danger' style='font-size:18px;' " +
	                  "onclick='realizarInspeccionMovil("+idEvento+")'>" +
	             "<i class='fa fa-times'></i> Cancelar" +
	          "</button>" +
	          "<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
                          "onclick='guardarEvaluacionInspeccionTrabajadorEpp()'>" +
                     "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
                  "</button>" +
               "</div>");
       
//       if(lastHeightInspeccion != 0){
//          $(window).scrollTop(lastHeightInspeccion-$("#barraMenu").height()-60);
//          lastHeightInspeccion = 0;
//       }
       
            break;

         default:
	    alert("nop");
	    break;
      }
   });
}

var listRespuestasInspeccTrabEpp=[{id:0,nombre:"No cumple"},{id:1,nombre:"Cumple"}];
var listNoAplicaInspeccTrabEpp=[{id:-1,nombre:"No aplica"}];

function crearDivEvalInspeccionTrabajadorEppVersionDos(contenidoVal,contenidoIndex){
   var textoBotonToggleReportar =
      "<button class='btn btn-danger' onclick='cambiarDivSubPreguntaInspeccTrabEpp(this,"+contenidoVal.verificacionId+")'>" +
         "<i class='fa fa-bullhorn fa-3x' aria-hidden='true'></i>" +
      "</button>";
   
   var listBooleanResp = listRespuestasInspeccTrabEpp.sort(function(val,val2){
      return val2.id - val.id;
   });
   
   var respuestaAux = (contenidoVal.detalleAuditoriaTrabajadorEppId > 0?contenidoVal.respuestaSimple:"");
   
   if(evalInspeccTrabajadorEppObj.listCategoriasPreguntaId.indexOf(contenidoVal.categoriaPreguntaId) == -1){
      listBooleanResp = listNoAplicaInspeccTrabEpp;
      respuestaAux = -1; 
   }
    
   var radiosPregInsMovil = crearRadiosAutoVersionDos("radioPreguntaInsTrabEppMovil"+contenidoVal.verificacionId,
      listBooleanResp,respuestaAux,"id","nombre","habilitarCamposPreguntaInspeccionTrabajadorEppMovil",contenidoVal.verificacionId);
   
   var radiosDetalleObs = crearCheckAutoOpcionesMultiple("radioDetalleObsInspeccTrabEpp"+contenidoVal.verificacionId,
      listOpcionesObsInspeccTrabEpp,"","id","nombre",(isMobile.any()?"70px":"100px"),"left");
     
   return "<div class='divInformacionCurso' id='pregInsTrabEppMovil"+contenidoIndex+"'>" +
 	     "<div class='divNombrePregunta'>"+textoBotonToggleReportar +
 		 contenidoVal.verificacion +" " +
                "<span id='estadoRespPregEvalInspeccTrabEpp"+contenidoVal.verificacionId+"' " +
                      "style='font-weight:bolder;'></span>" +
 	     "</div>" +
 	     "<div class='divOpcionesGosst form-group' style='padding:20px;margin:0px 0px -10px 20px;'>" +
 	         radiosPregInsMovil +
 	        "<strong>Observación:</strong>" +
 	        "<span id='auxInfoTextObsAudiTrabEppMovil"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:red;font-weight:bold;'></span>" +
 	        "<textarea rows='4' class='form-control' " +
 	                  "id='textObsAudiTrabEppMovil"+contenidoVal.verificacionId+"'></textarea>" +
 	        "<br><strong>Evidencia - Observación:</strong>" +
 	        "<span id='auxInfoTextEviPregTrabEpp"+contenidoVal.verificacionId+"' " +
 	              "style='float:right;color:blue;font-weight:bold;'></span>" +
 	        "<span id='tdEviPregTrabEpp"+contenidoVal.verificacionId+"'></span>" +
             "</div>" +
             "<div class='general-inspeccTraEppMedCor inspeccTrabEppMedCor"+contenidoVal.verificacionId+"' " +
             	  "style='border-top:2px solid black;margin:10px 0px 20px 0px;'></div>" +
             "<div class='general-inspeccTraEppMedCor inspeccTrabEppMedCor"+contenidoVal.verificacionId+" eventoGeneral' style='margin:10px;'>" +
             "<div class='general-inspeccTraEppMedCor inspeccTrabEppMedCor"+contenidoVal.verificacionId+"'>" +
             	"<strong>¿Qué aspectos están asociados a la observación?</strong>" +
   	        "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
   	         radiosDetalleObs+"<br>" +	  	  
   	        "<div style='border-top:5px solid black;margin:-10px -10px 10px -10px;'></div>" +
                "<label style='font-size:"+(isMobile.any()?"14px":"18px")+";'>*** MEDIDA CORRECTIVA ***</label>" +
                "<div style='border-top:2px solid black;margin:5px -10px 10px -10px;'></div>" +
                "<strong>Descripción:</strong>" +
	        "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	        "<textarea rows='4' class='form-control' id='textDescAudiTrabEppMedCorMovil"+contenidoVal.verificacionId+"'></textarea>" +
	        "<br><strong>Fecha planificada:</strong>" +
	        "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	  	"<input type='date' id='inputFechaPlanAudiTrabEppMedCorMovil"+contenidoVal.verificacionId+"' class='form-control'>" +
	  	"<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	  	"<strong>Responsable de la medida correctiva:</strong>" +
                "<span style='float:right;color:red;font-weight:bold;'>(obligatorio)</span>" +
	        "<input class='form-control' id='inputBuscarResponsableTrabEppMedCorrMovil"+contenidoVal.verificacionId+"'>" +
	        "<div id='divSelResponsableTrabEppMedCorrMovil"+contenidoVal.verificacionId+"'></div>" +
	        "<small>*Buscar responsable por DNI y/o nombres/apellidos (debe ingresar 3 caracteres como mínimo).</small>" +
                "<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
    	        "<strong>Evidencia - Medida correctiva*:</strong>" +
    		"<span id='tdEviMedCorTrabEpp"+contenidoVal.verificacionId+"'>(obligatorio)</span>" +
    		"<div style='border-top:2px dashed black;margin:15px -10px 15px -10px;'></div>" +
	        "<strong style='font-size:"+(isMobile.any()?"15px":"18px")+"'>Estado:</strong> " +
	        "<span id='auxInfoEstadoAudiTrabEppMedCorMovil"+contenidoVal.verificacionId+"' " +
	              "style='color:red;font-weight:bold;font-size:"+(isMobile.any()?"15px":"18px")+"'></span>" +
             "</div>" +
             "</div>" +
 	  "</div>";
}

function habilitarCamposPreguntaInspeccionTrabajadorEppMovil(valResp,auxId){
   var valRespVisita = valResp;
     
   if(valRespVisita == 0){
      document.getElementById("textObsAudiTrabEppMovil"+auxId).disabled = false; 
      document.querySelector('#auxInfoTextObsAudiTrabEppMovil'+auxId).innerText = "(obligatorio)";
        
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).disabled = false;
      document.querySelector('#auxInfoTextEviPregTrabEpp'+auxId).innerText = "(opcional)";
       
      document.querySelector('#estadoRespPregEvalInspeccTrabEpp'+auxId).innerText = "(con observación)";   
      document.getElementById('estadoRespPregEvalInspeccTrabEpp'+auxId).style.color = "red";
      
      $(".inspeccTrabEppMedCor"+auxId).show();
      
      $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId).val("");
      
      buscarResponsableAccionCorrectivaInspeccTrabEpp(auxId);
   }else{
      document.getElementById("textObsAudiTrabEppMovil"+auxId).disabled = true;
      document.getElementById("textObsAudiTrabEppMovil"+auxId).value = null;
      document.querySelector('#auxInfoTextObsAudiTrabEppMovil'+auxId).innerText = "";
        
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).disabled = true;
      document.getElementById("fileEviPregInspeccTrabEpp"+auxId).value = null;
      document.getElementById("inputEviPregInspeccTrabEpp"+auxId).value = null;
      document.querySelector('#auxInfoTextEviPregTrabEpp'+auxId).innerText = "";
       
      if(valRespVisita == 1){
         document.querySelector('#estadoRespPregEvalInspeccTrabEpp'+auxId).innerText = "(sin observación)";   
         document.getElementById('estadoRespPregEvalInspeccTrabEpp'+auxId).style.color = "blue";
      }else{
	 document.querySelector('#estadoRespPregEvalInspeccTrabEpp'+auxId).innerText = "(pendiente)";   
	 document.getElementById('estadoRespPregEvalInspeccTrabEpp'+auxId).style.color = "#D1D619";
      }
      
      $(".inspeccTrabEppMedCor"+auxId).hide();
      
      document.getElementById("textDescAudiTrabEppMedCorMovil"+auxId).value = null;
      
      listOpcionesObsInspeccTrabEpp.forEach(function(val){
	 document.getElementById(val.id+"radioDetalleObsInspeccTrabEpp"+auxId).checked = false;  
      });
      
      document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+auxId).value = null;
      
      document.getElementById("fileEviMedCorInspeccTrabEpp"+auxId).value = null;
      document.getElementById("inputEviMedCorInspeccTrabEpp"+auxId).value = null;
   }
   
   estadoAccionCorrectivaInspeccTrabEpp(auxId);
}

function estadoAccionCorrectivaInspeccTrabEpp(auxId){
   var nombreAccCorEvidencia = $("#inputEviMedCorInspeccTrabEpp"+auxId).val();
   
   if(nombreAccCorEvidencia.length == 0){
      document.querySelector('#auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).innerText = "Pendiente";   
      document.getElementById('auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).style.color = "#D1D619";
   }else{
      document.querySelector('#auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).innerText = "Completado";   
      document.getElementById('auxInfoEstadoAudiTrabEppMedCorMovil'+auxId).style.color = "blue";
   }
}

var listResponsablesAccCorInsTrabEpp=[];

function buscarResponsableAccionCorrectivaInspeccTrabEpp(auxId){
   var nombre = $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId).val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
         trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
 		
      callAjaxPostNoLoad(URL+"/auditoria/responsable/accion_correctiva",dataParam,function(data){
	 listResponsablesAccCorInsTrabEpp = data.listResponsablesAccCorIns;
        
         if(listResponsablesAccCorInsTrabEpp.length == 0){
            listResponsablesAccCorInsTrabEpp.push({
               trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
 	    });
         }
 			
         var selResponsableAccCorInsTrabEpp = crearSelectOneMenuOblig("selResponsableAccCorInsTrabEpp"+auxId,
            "",listResponsablesAccCorInsTrabEpp,"","trabajadorId","nombre");
 	       
         $("#divSelResponsableTrabEppMedCorrMovil"+auxId).html(selResponsableAccCorInsTrabEpp);
         $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId)
            .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccTrabEpp("+auxId+")");
      });
   }else{
      listResponsablesAccCorInsTrabEpp = [];
       
      listResponsablesAccCorInsTrabEpp.push({
         trabajadorId: -1,nombre:"Sin asignar",puesto:{positionName:""}
      });
        
      var selResponsableAccCorInsTrabEpp = crearSelectOneMenuOblig("selResponsableAccCorInsTrabEpp"+auxId,
	 "",listResponsablesAccCorInsTrabEpp,"","trabajadorId","nombre");
 		       
      $("#divSelResponsableTrabEppMedCorrMovil"+auxId).html(selResponsableAccCorInsTrabEpp);
      $("#inputBuscarResponsableTrabEppMedCorrMovil"+auxId)
         .attr("onkeyup","buscarResponsableAccionCorrectivaInspeccTrabEpp("+auxId+")");
   }
}

var indiceActualEvaIndTrabEpp;

function guardarEvaluacionInspeccionTrabajadorEpp(){
   $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'}); 
    
   var campoVacio = true; 
   
   var bitRespuesta,observacion,medidaCorrectiva,inputFechaPlanificada,nombrePregunta;
    
   listFullEvaluacionesInspeccionTrabEpp.forEach(function(val,index){
      bitRespuesta = parseInt($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
      observacion = $("#textObsAudiTrabEppMovil"+val.verificacionId).val();
      medidaCorrectiva = $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val();
      
      listCategoriasPreguntaTrabEpp.forEach(function(val2){
	 if(val.categoriaPreguntaId == val2.id){
	    nombrePregunta = val2.nombre;
	 }
      });
      
      if(isNaN(bitRespuesta) && campoVacio){
	 campoVacio = false;
	 mensajeUx = "<label>Falta la respuesta en "+nombrePregunta+".</label>";
	 
	 document.getElementById("1radioPreguntaInsTrabEppMovil"+val.verificacionId).focus();
      }else if(bitRespuesta == 0 && campoVacio){
	 var respuestaEntrega,respuestaUso,respuestaEstado;

	 listOpcionesObsInspeccTrabEpp.forEach(function(val1){
	    if(val1.id == 0){
	       respuestaEntrega = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	    }else if(val1.id == 1){
	       respuestaUso = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	    }else if(val1.id == 2){
	       respuestaEstado = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	    }
	 });
	  
	 var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val());
	 inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
	 
	 var nombreEvidenciaMedCor = $("#inputEviMedCorInspeccTrabEpp"+val.verificacionId).val();
	 
	 var responsableId = parseInt($("#selResponsableAccCorInsTrabEpp"+val.verificacionId).val());
	 
	 if(observacion.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la observación - "+nombrePregunta+".</label>";
	    
	    document.getElementById("textObsAudiTrabEppMovil"+val.verificacionId).focus();
	 }else if(respuestaEntrega == 0 && respuestaUso == 0 && respuestaEstado == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe seleccionar algunos(s) de los aspectos asociados a " +
	            	"la observación - "+nombrePregunta+".</label>";
			    
	    document.getElementById("0radioDetalleObsInspeccTrabEpp"+val.verificacionId).focus();
	 }else if(medidaCorrectiva.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la descripción de la medida correctiva - " +
	    		 nombrePregunta+".</label>";  
	    
	    document.getElementById("textDescAudiTrabEppMedCorMovil"+val.verificacionId).focus();
	 }else if(inputFechaPlanificada == null && nombreEvidenciaMedCor.length == 0){
	    campoVacio = false;
	    mensajeUx = "<label>Debe registrar la fecha planificada o subir la evidencia de la " +
 	                "medida correctiva - "+nombrePregunta+".</label>"; 
	    
	    document.getElementById("inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).focus();
	 }else if(responsableId == -1){
	    campoVacio = false;
            mensajeUx = "<label>Debe seleccionar al responsable de la medida correctiva - " +
		         nombrePregunta+".</label>";  
            
            document.getElementById("inputBuscarResponsableTrabEppMedCorrMovil"+val.verificacionId).focus();
	 }
      }  
   });
   
   if(campoVacio){
      indiceActualEvaIndTrabEpp = 1;
      guardarRespuestaInspeccionTrabajadorEpp(guardarRespuestaInspeccionTrabajadorEpp);
   }else{
      $.unblockUI();
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarRespuestaInspeccionTrabajadorEpp(functionCallBack){
   var respuesta,respAux,observacion,validacionId,medidaCorrectiva,inputFechaPlanificada,
       respuestaEntrega,respuestaUso,respuestaEstado,responsableId;
   var dataParam;
    
   listFullEvaluacionesInspeccionTrabEpp.forEach(function(val,index){
      if((index + 1) == indiceActualEvaIndTrabEpp){
         respuesta = parseFloat($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
         respAux = parseInt($("input[name='radioPreguntaInsTrabEppMovil"+val.verificacionId+"']:checked").val());
         observacion = $("#textObsAudiTrabEppMovil"+val.verificacionId).val();
         validacionId = val.verificacionId;
       //var nombreEvi = $("#inputEviPregInspeccTrabEpp"+val.verificacionId).val();
         if(respAux == 0){
            medidaCorrectiva =  $("#textDescAudiTrabEppMedCorMovil"+val.verificacionId).val();
            responsableId = parseInt($("#selResponsableAccCorInsTrabEpp"+val.verificacionId).val());
             
            var fechaPlanificadaMedCor = convertirFechaTexto($("#inputFechaPlanAudiTrabEppMedCorMovil"+val.verificacionId).val());
    	    inputFechaPlanificada = (!fechaPlanificadaMedCor?null:fechaPlanificadaMedCor);
    	    
    	    listOpcionesObsInspeccTrabEpp.forEach(function(val1){
	       if(val1.id == 0){
	          respuestaEntrega = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }else if(val1.id == 1){
	          respuestaUso = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }else if(val1.id == 2){
	          respuestaEstado = ($("#"+val1.id+"radioDetalleObsInspeccTrabEpp"+val.verificacionId).prop("checked")?1:0);
	       }
    	    });
         }else{
            medidaCorrectiva = null;inputFechaPlanificada = null;responsableId = null;
            respuestaEntrega = null;respuestaUso = null;respuestaEstado = null;
         }
         
         dataParam={
            detalleAuditoriaTrabajadorEppId: val.detalleAuditoriaTrabajadorEppId,
            auditoriaTrabajadorEppId: evalInspeccTrabajadorEppObj.id, 
            verificacionId: val.verificacionId,
            respuestaSimple: respuesta,
            comentario: observacion,
            trabajadorId: parseInt(getSession("trabajadorGosstId")),
            accionCorrectiva: medidaCorrectiva,
            hasObservacionEntrega: respuestaEntrega,
            hasObservacionUso: respuestaUso,
            hasObservacionEstado: respuestaEstado,
            fechaPlanificacion: inputFechaPlanificada,
            responsableId: responsableId
         };
      }
   });  
   
   callAjaxPostSimple(URL+'/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/save',dataParam,0,function(data){
      guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviPregInspeccTrabEpp"+validacionId,bitsEvidenciaVerificacion,
      "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/evidencia/save",function(){
	 guardarEvidenciaAutoVersionDosNoUnlock(data.nuevoId,"fileEviMedCorInspeccTrabEpp"+validacionId,bitsEvidenciaVerificacion,
	 "/auditoria/verificaciones/respuesta/version_dos/auditoria_trabajador_epp/accion_correctiva/evidencia/save",function(){
            if(indiceActualEvaIndTrabEpp == listFullEvaluacionesInspeccionTrabEpp.length){
               $.unblockUI();
               mensajeUx = "<label>Inspección guardada con éxito.</label>";
               mensajesUx(mensajeUx,1,"","EvaluacionCompletadaInsTrabEpp");
					
               $("#modalMensajeUxEvaluacionCompletadaInsTrabEpp").on("hidden.bs.modal",function(){
	          realizarInspeccionMovil(idEvento);   
               });
            }else{
               indiceActualEvaIndTrabEpp++;
               functionCallBack(guardarRespuestaInspeccionTrabajadorEpp);
            }
	 },"detalleAuditoriaTrabajadorEppId");
      },"detalleAuditoriaTrabajadorEppId");
   });
}

function cambiarDivSubPreguntaInspeccTrabEpp(obj,verificacionId){
   $(obj).parent(".divNombrePregunta").siblings(".divOpcionesGosst").toggle();
   
   var respuesta = parseInt($("input[name='radioPreguntaInsTrabEppMovil"+verificacionId+"']:checked").val());
   
   if(respuesta == 0){
      $(obj).parent(".divNombrePregunta").siblings(".general-inspeccTraEppMedCor").toggle();
   }
}
