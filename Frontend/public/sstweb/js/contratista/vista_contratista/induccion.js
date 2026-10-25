
var listTrabajadoresInduccion;
var objInduccionContratista;
var listFullInduccionesContratista;
var mensajeUx;

var funcionalidadesInduccion=[ 
   {id:"opcDescarga",nombre:"<i class='fa fa-download'></i> Descargar",
    functionClick:function(data){
       window.open(URL+"/contratista/induccion/informe?contratistaId="+getSession("contratistaGosstId") +
		   "&induccionId="+objInduccionContratista.id,'_blank')
   }},
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Inscribir trabajadores",
    functionClick:function(data){editarTrabajadoresInduccionContratista()}},
   {id:"opcEditasdfr",nombre:"<i class='fa fa-check-square-o'></i> Evaluación trabajadores",
    functionClick:function(data){verEvaluacionInduccionTrabajadores()}}
];

function marcarSubOpcionInduccion(pindex){
   funcionalidadesInduccion[pindex].functionClick();
	
   $(".subDetalleAccion ul").hide();
   $(".listaGestionGosst").hide();
}

function toggleMenuOpcionInduccion(obj,pindex){
   objInduccionContratista = listFullInduccionesContratista[pindex]; 
	
   $(obj).parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

function habilitarInduccionesEmpresaContratista(){
   objInduccionContratista = {id: 0};  
	
   var dataParam={ 
      id: parseInt(getSession("contratistaGosstId")),
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
	
   callAjaxPost(URL+'/contratista/inducciones/contratista/vista_contratista',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var listPanelesPrincipal=[];
	    var textIn = "",textInImplementar = "",textInCompletado = "",textInEnProceso = "";
	    var induccionesImplementar = 0,induccionesCompletadas = 0,induccionesEnProceso = 0;
			
	    listFullInduccionesContratista = data.examenes; 
			
	    $(".divListPrincipal").html("");
			
	    listFullInduccionesContratista.forEach(function(val,index){
	       var hoy = new Date();
			   
	       var aF = convertirFechaInput(val.fecha).split("-");
	       var aH = (val.hora).split(":");
	       var fecha = new Date(aF[0],parseInt(aF[1])-1,aF[2],aH[0]-8,aH[1]);
	       // 
	       var dias = 0,horas = 0,minutos = 0,segundos = 0;
	       var diferencia = (fecha.getTime()-hoy.getTime())/1000;
		       
	       dias = Math.floor(diferencia/86400);
	       diferencia = diferencia-(86400*dias);
	       horas = Math.floor(diferencia/3600);
	       diferencia = diferencia-(3600*horas);
	       minutos = Math.floor(diferencia/60);
	       diferencia = diferencia-(60*minutos);
	       segundos = Math.floor(diferencia);
	       
	       var estiloGosst = "",btnOpcion = "",menuOpcion = "",textFechaExamen = "",textHora = "";
		        
	       if(hoy < fecha){
		  estiloGosst = "gosst-neutral";
		  btnOpcion = "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionInduccion(this,"+index+")'>" +
		                 "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
	                      "</a>";
		  
		  menuOpcion = "<ul class='list-group listaGestionGosst'>";
		  funcionalidadesInduccion.forEach(function(val1,index1){
		     if(val1.id == "opcDescarga" || val1.id == "opcEditar"){ 
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionInduccion("+index1+")'>"+val1.nombre+"</li>";
		     }
		  });
		  menuOpcion += "</ul>";
		  
		  textFechaExamen = 
	             "<strong style='color:red'><i class='fa fa-calendar'></i> Fecha planificada: "+val.fechaTexto+" "+val.horaTexto+"</strong><br>";
		  textHora = 
		     "<i class='fa fa-calendar' aria-hidden='true'></i>" +
		     "<strong>Quedan "+dias+" dia(s) " +horas+" hora(s) "+minutos+" minuto(s) para inscribirse</strong><br>";
	       }else if(val.fechaReal == null && val.numTrabajadores > 0){
		  estiloGosst = "gosst-advertencia";btnOpcion = "";menuOpcion = "";  
		  textFechaExamen = "<i class='fa fa-calendar' aria-hidden='true'></i> Fecha planificada: "+val.fechaTexto+" "+val.horaTexto+"<br>";
	       }else if (val.fechaReal != null && val.numTrabajadores > 0){
		  estiloGosst = "gosst-aprobado"; 
		  btnOpcion = "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionInduccion(this,"+index+")'>" +
	                         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
                              "</a>";
		   
		  menuOpcion = "<ul class='list-group listaGestionGosst'>"; 
		  funcionalidadesInduccion.forEach(function(val1,index1){
		     if(val1.id == "opcDescarga" || val1.id == "opcEditasdfr"){ 
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionInduccion("+index1+")'>"+val1.nombre+"</li>";
		     }
	          });
	          menuOpcion += "</ul>";
	          
	          textFechaExamen = "<i class='fa fa-calendar' aria-hidden='true'></i> Fecha realizada: "+val.fechaRealTexto+"<br>";  
	       }
		           
	       var textFilaEvidencia = (val.evidenciaNombre.length == 0?"":
		  "<i class='fa fa-file' aria-hidden='true'></i>"+val.evidenciaNombre+"<br>");
		        
	       textIn = 
	          ("<div class='eventoGeneral "+estiloGosst+"'>"+btnOpcion+menuOpcion +
		      "<i class='fa fa-book' aria-hidden='true'></i> Tema: "+val.tema+"<br>" + 
		      "<i class='fa fa-building' aria-hidden='true'></i> Lugar: " +"<span style='word-break:break-all;'>"+val.lugar+"</span>"+"<br>" + 
		      "<i class='fa fa-user' aria-hidden='true'></i> Profesor: "+val.profesor+"<br>" + 
		      "<i class='fa fa-info' aria-hidden='true'></i> Duración: "+val.horas+" hora(s)<br>" + 
		      "<i class='fa fa-clock-o' aria-hidden='true'></i> Vigencia: "+val.vigencia.nombre+"<br>" + 
		      "<i class='fa fa-users' aria-hidden='true'></i>" +val.numTrabajadores+" Trabajador(es) registrados por su empresa<br>" +
		      "<a class='efectoLink' id='idLinkListInducTrabCon"+index+"' onclick='cambiarContLinkListInduccionTrabCon("+index+",0);'>" +
	                 "Ver lista trabajadores <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	              "</a><br>" +
	              "<div id='idDivListInducTrabCon"+index+"' style='display:none;font-weight:bold;background:#E4DCDC;'>" +
		          val.trabajadoresNombre.replace(/-/gi,"<br>") +
	              "</div>" +
	               textFechaExamen+textHora+textFilaEvidencia + 
	           "</div>");
				
	       if(hoy < fecha){
		  textInImplementar += textIn;
		  induccionesImplementar++;
	       }else if(val.fechaReal == null && val.numTrabajadores > 0){
		  textInEnProceso += textIn;
		  induccionesEnProceso++;  
	       }else if(val.fechaReal != null && val.numTrabajadores > 0){
		  textInCompletado += textIn;
		  induccionesCompletadas++;
	       }
	    }); 
			
	    var listItemsExam=[
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	        label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>CUPOS</span>"},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",label:"Totales",inputForm:"",divContainer:"divTotalCupoInduc"},
               {sugerencia:"",label:"Cubiertos",inputForm:"",divContainer:"divCubiertosCupoInduc"},
               {sugerencia:"",label:"Disponibles",inputForm:"",divContainer:"divCupoInduc"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
               {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>MIS TRABAJADORES</span>"},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",label:"Inscritos",inputForm:"",divContainer:"divTrabCupoInduc"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"",label:"Registrar",inputForm:"",divContainer:"divSelTrabInduc"},
               {sugerencia:"",label:"",divContainer:"",
        	inputForm:"<span style='font-size:12px;font-weight:bolder;color:red;'>" +
        		  "[Una vez registrado(s) su(s) trabajador(es), no podrá(n) ser retirado(s) de la inducción]</span>"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
               {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
   		label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>DATOS ADICIONALES</span>"},
   	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",label:"Vigencia",inputForm:"",divContainer:"divVigInduc"},
               {sugerencia:"",label:"Fecha planificada",inputForm:" ",divContainer:"divFechaInduc"}, 
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
               {sugerencia:"Ej. documentos, escaneos",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
               {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
       	       {sugerencia:"",label:"",divContainer:"divSubmitButton",
        	inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
        	             "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
        	          "</button>"} 
            ];
			
	    var textFormExamen = "";
			
	    listItemsExam.forEach(function(val,index){
	       textFormExamen += obtenerSubPanelModuloVersionDos(val);
	    });
			
	    listPanelesPrincipal.push( 
	       {id:"editarMovilInduccion",clase:"contenidoFormVisible",nombre:""+"Editar asd",
		contenido:"<form id='formEditarInduccion' class='eventoGeneral'>"+textFormExamen+"</form>"},
	       {id:"inducImplementarContratista",clase:"divInduccionContratistaGeneral",
		nombre:"Inducciones en fase de inscripción ("+induccionesImplementar+")",contenido:textInImplementar},
	       {id:"inducEnProcesoContratista",clase:"divInduccionContratistaGeneral",
		nombre:"Inducciones en proceso ("+induccionesEnProceso+")",contenido:textInEnProceso},
	       {id:"inducCompletadasContratista",clase:"divInduccionContratistaGeneral",
		nombre:"Inducciones completadas ("+induccionesCompletadas+")",contenido:textInCompletado},
	       {id:"inducEvaluacion",clase:"contenidoFormVisible",nombre:"",contenido:""});
			
	    agregarPanelesDivPrincipal(listPanelesPrincipal);
			  
	    $(".listaGestionGosst").hide();
	    $(".contenidoFormVisible").hide();
			 
	    $('#formEditarInduccion').on('submit',function(e){  
	       e.preventDefault(); 
	       guardarInduccionContratista();
	    });
			
	    break;
			
         default:
	    alert("nop");
            break;
      }
   });
}

function cambiarContLinkListInduccionTrabCon(pindex,val){
   if(val == 0){
      document.getElementById("idDivListInducTrabCon"+pindex).style.display = "";
        
      document.getElementById("idLinkListInducTrabCon"+pindex)
         .innerHTML = "Ocultar lista trabajadores <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListInducTrabCon"+pindex).onclick = function(){cambiarContLinkListInduccionTrabCon(pindex,1);}
   }else{
      document.getElementById("idDivListInducTrabCon"+pindex).style.display = "none";
        
      document.getElementById("idLinkListInducTrabCon"+pindex)
         .innerHTML = "Ver lista trabajadores <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListInducTrabCon"+pindex).onclick = function(){cambiarContLinkListInduccionTrabCon(pindex,0);}
   }
}

function verEvaluacionInduccionTrabajadores(){
   $(".divListPrincipal>div").hide();
	
   var divEval=$("#inducEvaluacion");
	
   divEval.show();
	
   divEval.find(".tituloSubList").html(
      textoBotonVolverContenido +
      "Evaluaciones de Induccion del "+objInduccionContratista.fechaTexto+
      " Tema: "+objInduccionContratista.tema);
	
   divEval.find(".contenidoSubList").html("");
	
   var dataParam={
      id: objInduccionContratista.id,
      contratista: {id: getSession("contratistaGosstId")}
   };
	
   callAjaxPost(URL+'/contratista/induccion/trabajadores',dataParam,function(data){
      var textIn = "";
      var evala = data.trabajadores;
		
      listTrabajadoresInduccion = data.trabsExamen;
		
      var textTrabs = "";
		
      listTrabajadoresInduccion.forEach(function(val,index){
         val.selected = 0;
			
         evala.forEach(function(val1,index1){
	    var estiloGosst = "gosst-neutral";
				
	    if(val1.trabajador.id == val.id){
	       var btnOpcion = (val1.evaluacion.id != 1?"":
		  "<a class='btn-gestion efectoLink' " +
		     "onclick='descargarCertificadoInduccionTrabajadorCon("+val1.trabajador.id+","+val1.id+");'>" +
                     "<i class='fa fa-certificate' aria-hidden='true'></i> Certificado" +
                  "</a>");
		
	       if(val1.evaluacion.id == 1){
		  estiloGosst="gosst-aprobado";
	       }
					
	       textIn += 
	          ("<div class='eventoGeneral "+estiloGosst+"'>" +
	               btnOpcion +
		      "<i class='fa fa-info' aria-hidden='true'></i> Trabajador(a): <strong>"+val.nombreCompleto+"</strong><br>"+ 
		      "<i class='fa fa-info' aria-hidden='true'></i> Asistencia: "+val1.asistencia.nombre+"<br>"+ 
		      "<i class='fa fa-info' aria-hidden='true'></i> Evaluación: " +val1.evaluacion.nombre+"<br>"+
		   "</div>");
	    }
         });  
      });
		
      divEval.find(".contenidoSubList").html(""+textIn);
   });	
}

function descargarCertificadoInduccionTrabajadorCon(trabajadorAuxId,evalExamAuxId){
   var trabajadorId = trabajadorAuxId;
   var examenId = objInduccionContratista.id;
   var evalExamId = evalExamAuxId;
   
   window.open(URL+"/contratista/induccion/trabajador_contratista/certificado?" +
      "trabajadorId="+trabajadorId+"&examenId="+examenId+"&evalExamId="+evalExamId +
      "&empresaId="+getSession("gestopcompanyid"),'_blank');
}

var listTrabajadoresInduccionRegistrados = [];
var listTrabajadoresInduccionRegistrar = [];

function editarTrabajadoresInduccionContratista(indexInduccion){
   if(indexInduccion!=null){
      objInduccionContratista=listFullInduccionesContratista[indexInduccion];
   }
   //
   var dataParam={
      id: objInduccionContratista.id,
      contratista: {id: getSession("contratistaGosstId")}
   }
	
   callAjaxPost(URL+'/contratista/induccion/trabajadores/status',dataParam,function(data){
      $(".divListPrincipal>div").hide();
      var editarDiv = $("#editarMovilInduccion");
      editarDiv.show();
      editarDiv.find(".tituloSubList").html(
         textoBotonVolverContenido +
         " Editar Induccion del "+objInduccionContratista.fechaTexto +
         " Tema: "+objInduccionContratista.tema);
		
      var evala = data.trabajadores;
      listTrabajadoresInduccion = data.trabsExamen;
      var induccionStatus = data.induccionStatus;
		
      var textTrabs = "";
      
      listTrabajadoresInduccionRegistrar = [];
      listTrabajadoresInduccionRegistrados = [];
      var textNomTrabsRegistrados = "";
      var estadoRegistro;
		
      listTrabajadoresInduccion.forEach(function(val,index){
         val.selected = 0;
         estadoRegistro = 0;
         
         evala.forEach(function(val1,index1){
	    if(val1.trabajador.id == val.id){
	       textTrabs += ""+val.nombre+" ("+val1.asistencia.nombre+" - "+val1.evaluacion.nombre+") <br>"
	       val.selected = 1;
	       val.nombre = val.nombre;
	       textNomTrabsRegistrados += val.nombreCompleto+"<br>";
	       listTrabajadoresInduccionRegistrados.push(val1);
	       estadoRegistro = 1;
	    }
         });
         
         if(estadoRegistro == 0){
            listTrabajadoresInduccionRegistrar.push(val); 
         }
      });
		
      editarDiv.find("#divSelTrabInduc").html("");
		
      var cuposDisponibles = 
	 induccionStatus.cupo - induccionStatus.numTrabajadoresInscritos;
      var cuposDisponiblesTrabajador = 
	 induccionStatus.cupo-induccionStatus.numTrabajadoresInscritos+induccionStatus.numTrabajadores;
      var difDias = restaFechas(convertirFechaInput(objInduccionContratista.fecha),obtenerFechaActualNoUTC());
		
      var eviNombre = (objInduccionContratista.evidenciaNombre.length == 0?"------":objInduccionContratista.evidenciaNombre);
		 
      var linkDescarg = (objInduccionContratista.evidenciaNombre.length == 0?"":
	 "<br><a target='_blank' class='btn btn-success' href='"+urlArchivo(objInduccionContratista.evidenciaUrl)+"' " +
                ">Descargar</a>");
		
      if(false){
         editarDiv.find("#divSelTrabInduc").html(textTrabs);
         $("#formEditarInduccion #divSubmitButton").hide();
         editarDiv.find("#eviExamContratista").html(eviNombre+linkDescarg);
      }else{
	 $("#formEditarInduccion #divSubmitButton").show();
	 
	 if(cuposDisponibles != 0){
	    var slcTrabajadoresInduccion = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresInduccion"+objInduccionContratista.id,"",
               listTrabajadoresInduccionRegistrar,"id","nombreCompleto","#editarMovilInduccion #divSelTrabInduc","Trabajadores ...",cuposDisponibles);
	 }else{
	    editarDiv.find("#divSelTrabInduc").html("*Se acabaron los cupos disponibles."); 
	    $("#formEditarInduccion #divSubmitButton").hide();
	 }	
	 
	 editarDiv.find("#eviExamContratista").html("<strong>Disponible luego de inducción</strong>");
      }
		
      editarDiv.find("#divTotalCupoInduc").html(induccionStatus.cupo); //
      editarDiv.find("#divCubiertosCupoInduc").html(induccionStatus.numTrabajadoresInscritos); 
      editarDiv.find("#divCupoInduc").html(cuposDisponibles);
      editarDiv.find("#divTrabCupoInduc").html(induccionStatus.numTrabajadores+(induccionStatus.numTrabajadores == 0?"":"<br>" +
         "<a class='efectoLink' id='idLinkListInscritosInducTrabCon"+objInduccionContratista.id+"' " +
            "onclick='cambiarContLinkListInscritosInduccionTrabCon("+objInduccionContratista.id+",0);'>" +
            "Ver lista trabajadores inscritos <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
         "</a><br>" +
         "<div id='idDivListInscritosInducTrabCon"+objInduccionContratista.id+"' style='display:none;font-weight:bold;background:#E4DCDC;'>"+
             textNomTrabsRegistrados+
         "</div>"));  
      editarDiv.find("#divVigInduc").html(objInduccionContratista.vigencia.nombre); 
      editarDiv.find("#divFechaInduc").html((objInduccionContratista.fechaTexto+" "+objInduccionContratista.horaTexto));
   });	
}

function cambiarContLinkListInscritosInduccionTrabCon(pindex,val){
   if(val == 0){
      document.getElementById("idDivListInscritosInducTrabCon"+pindex).style.display = "";
         
      document.getElementById("idLinkListInscritosInducTrabCon"+pindex)
         .innerHTML = "Ocultar lista trabajadores inscritos <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
     
      document.getElementById("idLinkListInscritosInducTrabCon"+pindex)
         .onclick = function(){cambiarContLinkListInscritosInduccionTrabCon(pindex,1);}
   }else{
      document.getElementById("idDivListInscritosInducTrabCon"+pindex).style.display = "none";
         
      document.getElementById("idLinkListInscritosInducTrabCon"+pindex)
         .innerHTML = "Ver lista trabajadores inscritos <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
     
      document.getElementById("idLinkListInscritosInducTrabCon"+pindex)
         .onclick = function(){cambiarContLinkListInscritosInduccionTrabCon(pindex,0);}
   }
}

function guardarInduccionContratista(functionCallBack){
   var formDiv = $("#editarMovilInduccion"); 
   var campoVacio = true; 
   
   var trabajadoresFinalAux=[];
   listTrabajadoresInduccionRegistrados.forEach(function(val1,index){
      trabajadoresFinalAux.push({trabajador:{id:val1.trabajador.id}}); 
   });
   
   var trabsId = formDiv.find("#slcTrabajadoresInduccion"+objInduccionContratista.id).val();
   var trabajadoresFinal=[];
   
   trabsId.forEach(function(val,index){
      trabajadoresFinal.push({trabajador:{id:val}});
      trabajadoresFinalAux.push({trabajador:{id:val}});
   });
	
   var numCuposSolicitados = trabajadoresFinal.length;

   if(numCuposSolicitados == 0){
//      alert("Campo trabajadores Obligatorio");
      mensajeUx="<label>Campo trabajadores Obligatorio</label>";
      mensajesUx(mensajeUx,2,"");
      return;
   }
	
   if(campoVacio){
      var dataParam={
	 id: objInduccionContratista.id,   
	 evaluaciones: trabajadoresFinalAux,
	 fechaTexto: objInduccionContratista.fechaTexto,
	 numCuposSolicitados: numCuposSolicitados,
	 contratista: {id: getSession("contratistaGosstId")}
      };

      callAjaxPost(URL+'/contratista/induccion/validacion/trabajadores/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       if(data.mensaje.length > 0){
//		  alert(data.mensaje);
		  
		  mensajeUx="<label>"+data.mensaje+"</label>";
		  mensajesUx(mensajeUx,2,"");
		  
		  var cuposDisponibles = data.induccionStatus.cupo - data.induccionStatus.numTrabajadoresInscritos;
		  var editarDiv = $("#editarMovilInduccion");
		  
		  editarDiv.find("#divTotalCupoInduc").html(data.induccionStatus.cupo); //
		  editarDiv.find("#divCubiertosCupoInduc").html(data.induccionStatus.numTrabajadoresInscritos); 
		  editarDiv.find("#divCupoInduc").html(cuposDisponibles);
		  
		  if(cuposDisponibles == 0){
		     editarDiv.find("#divSelTrabInduc").html("*Se acabaron los cupos disponibles."); 
		     $("#formEditarInduccion #divSubmitButton").hide();
		  }
		  
		  $.unblockUI();
		  return;
	       }else{
		   mensajeUx="<label>El registro de los trabajadores se realizó con éxito.</label>";
		   mensajesUx(mensajeUx,1,""); 
	       }
					
	if(functionCallBack != null){
	  functionCallBack();
    }else{
	  habilitarInduccionesEmpresaContratista();
    }
							
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar   !");
         }
      },null,null,null,null,false);
   }else{
      alert("Debe ingresar todos los campos.");	
   }	
}
