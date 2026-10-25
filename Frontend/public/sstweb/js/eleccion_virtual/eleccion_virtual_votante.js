var votanteId,votanteObj;
var banderaEdicion=false;
var listFullVotante; var listFullVotanteBackUp =[];
var mensajeUx;
var estadoIdFiltro;
var banderaEdicion=false;
var listVotantesPendientesId = [];
var tipoEventoEV;

var listTabs = [
          {id:1,nombre:"TODOS"},
          {id:2,nombre:"Votos válidos"},
          {id:3,nombre:"Votos NO válidos"},
          {id:4,nombre:"Votos faltantes"}
                ]

$(function(){
    	$("#btnCancelarVotante").attr("onclick","javascript:cancelarVotante();");
    	//$("#btnClipTablaTotalVotante").attr("onclick","javascript:obtenerClipboardTablaVotante();")
	$("#btnObservarVoto").attr("onclick", "javascript:cargarModalObservarVoto();");
})

function cargarSelOneMenuObligTabVotante(tipoEvento, functionCallBack){
    	var selTabVotante = crearSelectOneMenuOblig("selTabVotante", "cargarModalVotantesAcordeTabVotante()", listTabs, "1", "id", "nombre");
    	$("#divListaTabs").html("Filtro: "+selTabVotante);
    	tipoEventoEV = tipoEvento;
    		
    	functionCallBack();
}

function cargarModalVotantesAcordeTabVotante() {
    $("#modalVotantes").modal("show");
//    $("#divTblVotante").css("margin-top","50px");
    
    var count = 0;
    $("#btnCancelarVotante").hide();
    //$("#btnClipTablaTotalVotante").show();
    $("#btnObservarVoto").hide();$("#btnEnviarCorreoVotante").show();
       
    var tabIdFiltro = $("#selTabVotante").val();
    
    switch(tabIdFiltro){
	case "1": //TODOS
	    estadoIdFiltro = null;
	    break;
	case "2": //Votos validos
	    estadoIdFiltro = 0;
	    break;
	case "3": //votos no validos
	    estadoIdFiltro = 1;
	    break;
	case "4": //votos faltantes
	    estadoIdFiltro = 2;
	    break;
    }
    
   var dataParam={
      eleccionVirtual:{idEleccionVirtual:eleccionVirtualId},estadoIdFiltro:estadoIdFiltro
   };
	
   callAjaxPost(URL+'/eleccion_virtual/votante',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
		    	banderaEdicion = false;
			listFullVotante = data.list;
			listFullVotanteBackUp = listFullVotante;
         listVotantesPendientesId = [];
			
			$("#tblVotante tbody tr").remove();
			
         listFullVotante.forEach(function(val,index){
			    
			    var estadoTexto = "";
			    var color = "white";
			    if(val.estado==0){
				estadoTexto="Emitido";
				color="#5dcd5d";
			    }else if(val.estado==1){
				estadoTexto="Observado";
				color="orange";
			    }else{
				estadoTexto="Faltante";
				color="#ff7474";
			    }
			    
			    (val.fechaObservacion==null ? val.fechaObservacionTexto="-" : "");		
			    (val.observacion==null ? val.observacion="-" : "");		    
			    (val.usuarioAdmin==null ? val.usuarioAdmin="" : "");
			    
			    var participacionTexto = "";
			    
			    if(val.respuestasTexto!="-"){
				var participacion = val.respuestasTexto.split(",");
				participacion.forEach(function(val){
				    participacionTexto += val + " // ";
				})
				participacionTexto = participacionTexto.substring(0,participacionTexto.length - 4);
			    }else{
				if(val.estado==1){
				    participacionTexto="*VOTO EN BLANCO";
				}else{
				    participacionTexto=val.respuestasTexto;
				}
			    }
			    
			    count++;
			    
            var correo = (val.trabajador.correo.length == 0?"------":val.trabajador.correo);
			    
            $("#tblVotante tbody").append(
	       "<tr id='trVotante"+val.idVotante+"' onclick='editarVotante("+index+")'>" +
				    	"<td id='tdnumero"+val.idVotante+"' style='background-color:"+color+"'>"+count+"</td>" + 
				    	"<td id='tdunidad"+val.idVotante+"' style='background-color:"+color+"'>"+val.trabajador.unidadNombre+"</td>" +
				    	"<td id='tddivision"+val.idVotante+"' style='background-color:"+color+"'>"+val.trabajador.divisionNombre+"</td>" +
				    	"<td id='tdarea"+val.idVotante+"' style='background-color:"+color+"'>"+val.trabajador.areaNombre+"</td>" +
				    	"<td id='tdtrabajador"+val.idVotante+"' style='background-color:"+color+"'>"+ val.trabajador.trabajadorNombre+"</td>" +
				    	"<td id='tdtrabajadorCorreo"+val.idVotante+"' style='background-color:"+color+"'>"+correo+"</td>" +
				    	"<td id='tdestado_trabajador"+val.idVotante+"' style='background-color:"+color+"'>"+ val.trabajador.estadoActual+"</td>" +
				    	"<td id='tdfecha_hora_voto"+val.idVotante+"' style='background-color:"+color+"'>"+(val.fechaVoto!=null ? val.fechaVotoTexto+"  "+val.horaVotoTexto : "-")+"</td>" +
				    	"<td id='tdfecha_emision_dni"+val.idVotante+"' style='background-color:"+color+"'>"+(val.fechaEmisionDni!=null ? val.fechaEmisionDniTexto : "-")+"</td>" +
				    	"<td id='tdparticipacion"+val.idVotante+"' style='background-color:"+color+"'>"+(tipoEventoEV==2 ? participacionTexto : "*OCULTO*")+"</td>" +
				    	"<td id='tdsugerencia"+val.idVotante+"' style='background-color:"+color+"'>"+(eleccionVirtualObj.isSugerencia==1 ? val.sugerencia : "*NO HABILITADO*")+"</td>" +
				    	"<td id='tdcomentario"+val.idVotante+"' style='background-color:"+color+"'>"+(eleccionVirtualObj.isComentario==1 ? val.comentario : "*NO HABILITADO*")+"</td>" +
				    	"<td id='tdestado"+val.idVotante+"' style='background-color:"+color+"'>"+estadoTexto+"</td>" +
				    	"<td id='tdmotivo_observacion"+val.idVotante+"' style='background-color:"+color+"'>"+val.observacion+"</td>" +
				    	"<td id='tdfecha_hora_observacion"+val.idVotante+"' style='background-color:"+color+"'>"+(val.usuarioAdmin!=null ? val.fechaObservacionTexto+" "+val.horaObservacionTexto+"<br>"+val.usuarioAdmin : "-")+"</td>" +
				    	//Agregar filas
	       "</tr>");				    
	
            if(val.fechaVoto == null){
               listVotantesPendientesId.push(parseInt(val.trabajador.trabajadorId));
            }
         });
			formatoCeldaSombreableTabla(true,"tblVotante");
		}else{
		    console.log("NOPNPO")
		}
		goheadfixedY("#tblVotante","#divTblVotante");
    });
    
}

//function obtenerClipboardTablaVotante(){
//    $("#tblVotante tbody tr").remove();
//    var count=0;
//    listFullVotanteBackUp.forEach(function(val,index){
//	
//	count++;
//	
//	var estadoTexto = "";
//	    //var color = "white";
//	    if(val.estado==0){
//		estadoTexto="Emitido";
//		//color="#5dcd5d";
//	    }else if(val.estado==1){
//		estadoTexto="Observado";
//		//color="orange";
//	    }else{
//		estadoTexto="Faltante";
//		//color="#ff7474";
//	    }
//	
//	$("#tblVotante tbody").append(
//		"<tr>" +
//			"<td id='tdnumero"+val.idVotante+"'>"+count+"</td>" +
//			"<td id='tdunidad"+val.idVotante+"'>"+val.trabajador.unidadNombre+"</td>" +
//			"<td id='tddivision"+val.idVotante+"'>"+val.trabajador.divisionNombre+"</td>" +
//			"<td id='tdarea"+val.idVotante+"'>"+val.trabajador.areaNombre+"</td>" +
//			"<td id='tdtrabajador"+val.idVotante+"'>"+val.trabajador.trabajadorNombre+"</td>" +
//			"<td id='tdfecha_hora_voto"+val.idVotante+"'>"+(val.fechaVoto!=null ? val.fechaVotoTexto+"  "+val.horaVotoTexto : "-")+"</td>" +
//			"<td id='tdfecha_emision_dni"+val.idVotante+"'>"+(val.fechaEmisionDni!=null ? val.fechaEmisionDniTexto : "-")+"</td>" +
//			"<td id='tdparticipacion"+val.idVotante+"'>"+(tipoEventoEV==2 ? participacionTexto : "*OCULTO*")+"</td>" +
//			"<td id='tdsugerencia"+val.idVotante+"'>"+val.sugerencia+"</td>" +
//			"<td id='tdestado"+val.idVotante+"'>"+estadoTexto+"</td>" +
//			"<td id='tdmotivo_observacion"+val.idVotante+"'>"+val.observacion+"</td>" +
//			"<td id='tdfecha_hora_observacion"+val.idVotante+"'>"+(val.usuarioAdmin!=null ? val.fechaObservacionTexto+" "+val.horaObservacionTexto+"<br>"+val.usuarioAdmin : "-")+"</td>" +
//		"</tr>"
//	);
//    });
//    
//    var listFullTablaVotante = obtenerDatosTablaEstandar("tblVotante");
//    console.log(listFullTablaVotante);
//    copiarAlPortapapeles(listFullTablaVotante);
//    alert("Se han guardado al clipboard todos los Votantes de esta Elección Virtual" );
//}

function cancelarVotante(){
    cargarModalVotantesAcordeTabVotante();
}

function editarVotante(pindex) {
   if(!banderaEdicion){
    	$("#divTblVotante").css("margin-top","0px");

    	formatoCeldaSombreableTabla(false,"tblVotante");
    	votanteId = listFullVotante[pindex].idVotante;
    	votanteObj = listFullVotante[pindex];
    
    	$("#btnCancelarVotante").show();
    	//$("#btnClipTablaTotalVotante").hide();
    	if(votanteObj.estado==null){
    	    $("#btnObservarVoto").hide();
    	}else{
    	    $("#btnObservarVoto").show();
    	}
	
    	$("#trVotante"+votanteId).addClass("fila-edicion");
    	$("#trVotante"+votanteId+" td").css("vertical-align","middle");
    	
    	banderaEdicion=true;
    	
      $("#btnEnviarCorreoVotante").hide();
   }
}

function ocultarModalObservarVoto(){
    $("#modalObservarVotoEV").modal("hide");
}

function mostrarModalObservarVoto(){
    $("#modalObservarVotoEV").modal("show");
}

function cargarModalObservarVoto(){
    $("#modalVotantes").modal("hide");
    
    //Validacion que ver si el voto ya ha sido observado o no
    var votanteObservado = true;
    var estadoVotanteSeleccionado = votanteObj.estado;
    
    if(estadoVotanteSeleccionado == 1){
	votanteObservado = true;
	mensajeUx="<label>El voto seleccionado ya ha sido observado.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV");
	
    }else if(estadoVotanteSeleccionado == null){
	votanteObservado = true;
	mensajeUx="<label>El trabajador aún no ha emitido su voto.</label>";
	mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV");
		
    }else{
	votanteObservado = false;
	
	//Validacion para observar voto si el evento ha finalizado o no
	var fechaYHoraValida = false;
	var estado = hallarEstadoEV(eleccionVirtualId,eleccionVirtualObj.fechaInicio,eleccionVirtualObj.horaInicio,eleccionVirtualObj.fechaFin,eleccionVirtualObj.horaFin); 
	
	if(estado==0) {
	    fechaYHoraValida = false;
	    mensajeUx="<label>No se puede visualizar este voto porque el evento ya ha finalizado.</label>";
	    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV");
	}else if(estado==1){
	    fechaYHoraValida = true;
	}else if(estado==2){
	    fechaYHoraValida = false;
	    mensajeUx="<label>No se puede visualizar este voto porque el evento aún no comienza.</label>";
	    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV");
	}
    }
   
   if(votanteObservado == false && fechaYHoraValida == true){
       var listItems = [
                	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:" ",inputForm:"",
                	    	label:"Motivo por el cual se está observando el voto:"},
                	{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:" ",inputForm:"",
                		label:"<textarea id='inputObservacion' class='form-control' style='height:100px'></textarea>"},
                        {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-5",inputForm:"<button onclick='guardarObservacionVotoEV()' class='btn btn-success' type='button' style='margin-top:3px'>Guardar</button>",
                                styleAux:"margin-bottom:0",
                                label:"<button onclick='ocultarModalObservarVoto();cargarModalVotantesAcordeTabVotante()' class='btn btn-link' type='button' style='float:right; color:red;'><i class='fa fa-2x fa-arrow-right fa-rotate-180'></i></button>"}
                                     ]
                               
       var textFormObservarVotoEV="";
                               
       listItems.forEach(function(valx,index){
	   textFormObservarVotoEV += obtenerSubPanelModuloVersionDos(valx);
       })
                               
       var opciones={
                id:"modalObservarVotoEV",
                nombre:"Observación",
                contenido:"<form id='formConfirmarVotoEV' class='eventoGeneral'>"+textFormObservarVotoEV+"</form>",
       }
                               
       crearModalPrincipalUsuario(opciones,function(){},true,true);
                    
       $('#modalObservarVotoEV').on('hidden.bs.modal', function(e) {
	   ocultarModalObservarVoto();
       });
   }
}

function guardarObservacionVotoEV(){
    $("#modalObservarVotoEV").modal("hide");
    
    var observacion = $("#inputObservacion").val();
    var fechaObservacion = obtenerFechaActual();
    var horaObservacion = obtenerHoraActual();
    var usuarioAdmin = getSession("gestopusername");
    
    mensajeUx="<label style='text-align:left; margin-left:-30px; line-height:normal'>Detalles de la observación:<br><br>" +
    		     "- Trabajador: <span style='color:blue'>" + votanteObj.trabajador.trabajadorNombre + "</span><br>" +
    		     "- Motivo de la observación: <span style='color:blue'>" + observacion + "</span><br>" +
    		     "- Fecha y Hora: <span style='color:blue'>" + fechaObservacion + " " + horaObservacion + "</span><br>" +
    		     "- Registrado por: <span style='color:blue'>" + usuarioAdmin + "</span><br><br>" +
    		"¿Desea continuar?</label>";
    mensajesUx(mensajeUx,3,"","ObservarVoto");
    
    $("#btnRegresarPrevioObservarVoto").on("click",function(){
	$("#modalMensajeUxObservarVoto").modal("hide");
	mostrarModalObservarVoto();
    })

    $("#btnDevolverValorObservarVoto").on("click",function(){
	$("#modalMensajeUxObservarVoto").modal("hide");
	
	var dataParam={
		idVotante : votanteId,
		observacion : observacion,
		fechaObservacion : fechaObservacion,
		horaObservacion : horaObservacion,		
		usuarioAdmin : usuarioAdmin
	};
	
	callAjaxPost(URL + "/eleccion_virtual/votante/vista_admin/save", dataParam,
		function(data){
	    		switch (data.CODE_RESPONSE) {
			case "05":
			    mensajeUx="<label>Se ha guardado correctamente la Observación.</label>";
			    mensajesUx(mensajeUx,1,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV"); 
			    break;
			default:
			    mensajeUx="<label>¡Ocurrió un error al guardar la Observación!</label>";
			    mensajesUx(mensajeUx,2,"ocultarMensajesUx();cargarModalVotantesAcordeTabVotante()","VotanteEV");
			}	
		}
	);
    })
}

function enviarCorreoVotantesPendientesEleccionVirtual(){
   $("#modalVotantes").modal("hide");
   
   if([1,2].includes(estadoEleccionVirtual)){
      if(listVotantesPendientesId.length != 0){
         mensajeUx="<label>¿Desea enviar un correo a todos los trabajadores que no han "+
            "registrado aún su voto? ("+listVotantesPendientesId.length+")</label>";
         mensajesUx(mensajeUx,3,"","EnviarCorreoElecVirtVotante");

         $("#btnDevolverValorEnviarCorreoElecVirtVotante").on("click",function(){
            var dataParam={
               idEleccionVirtual:eleccionVirtualId,listVotantesPendientesId:listVotantesPendientesId,
               empresaId:parseInt(parseInt(getSession("gestopcompanyid"))),estadoEleccionVirtualId:estadoEleccionVirtual
            };
 	   
            callAjaxPost(URL+'/eleccion_virtual/votante/curso/correo',dataParam,function(data){
               switch(data.CODE_RESPONSE){
 	          case "05":
 	             mensajeUx="<label>Correo(s) enviado(s) con éxito.<label>";
   	             mensajesUx(mensajeUx,1,"","ActualizarResumenCapOnline");
   		
   	             $("#modalMensajeUxActualizarResumenCapOnline").on("hidden.bs.modal",function(){
   	                $("#modalVotantes").modal("show");cargarModalVotantesAcordeTabVotante();
   	             });
 	       
   	             break;
 				
 	          default:
 	             console.log("Ocurrió un error al enviar los correos!");
               }
            });
         });
 	      
         $("#btnRegresarPrevioEnviarCorreoElecVirtVotante").on("click",function(){
            $("#modalVotantes").modal("show");
         });
      }else{
         mensajeUx="<label>No hay votantes pendientes en el consolidado actual.</label>";
         mensajesUx(mensajeUx,2,"","ValidacionElecVirtVotante"); 
      
         $("#modalMensajeUxValidacionElecVirtVotante").on("click",function(){
	    $("#modalVotantes").modal("show");
         });
      }
   }else{
      mensajeUx="<label>Esta opción solo está disponible cuando la elección virtual esté 'en curso' o 'futuro'.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionElecVirtVotante"); 
       
      $("#modalMensajeUxValidacionElecVirtVotante").on("click",function(){
 	 $("#modalVotantes").modal("show");
      }); 
   }
}
