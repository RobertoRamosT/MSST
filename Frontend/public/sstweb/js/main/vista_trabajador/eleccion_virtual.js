var userAgent = isMobile.any();
var mensajeUx;
var listFullEleccionVirtualAux;
var eleccionVirtualId,eleccionVirtualObj;
var listFullAlternativa;
var alternativaId,alternativaObj;
var indiceSeleccionado;
var listRespuestas = [];
var listRespuestasTexto;
var numAlternativasSeleccionables;
var textSugerencia;
var textComentario;

var votanteEspecifico;
var empresaId = getSession("gestopcompanyid");

function habilitarEleccionesVirtuales(){
	$(".divListPrincipal").html( 
		"<div id='subListEVEnCurso'>" +
			"<div class='tituloSubList'></div>" +
			"<div class='contenidoSubList'></div>" +
		"</div>" +
		"<div id='subListEVCompletadas'>" +
			"<div class='tituloSubList'></div>" +
			"<div class='contenidoSubList' style='display:none'></div>" +
		"</div>"
	);
	
	var dataParams={
		empresaId : getSession("gestopcompanyid"),
		trabajador : {trabajadorId : getSession("trabajadorGosstId")}
	}
	
	callAjaxPost(URL+"/eleccion_virtual/vista_colaborador",dataParams,
	procesarCargaEleccionesVirtuales);
}

function procesarCargaEleccionesVirtuales(data){

    var textEVEnCurso="", textEVCompletadas="";
    var numEVEnCurso=0, numEVCompletadas=0;

    listFullEleccionVirtualAux = data.list;
    
    if(listFullEleccionVirtualAux.length>0){
        listFullEleccionVirtualAux.forEach(function(val,index){
    
        	eleccionVirtualId = val.idEleccionVirtual;
        	eleccionVirtualObj = listFullEleccionVirtualAux[index];
        	
        	//Validacion del estado y llenado de el list de cada tipo de EV
        	var estadoEV = hallarEstadoEV(val.idEleccionVirtual,val.fechaInicio,val.horaInicio,val.fechaFin,val.horaFin);
        	var botonVotar = "";
        	if(userAgent==true){
        	    botonVotar = "<label style='color:#5dcd5d; max-width:200px'>Puede emitir su voto hasta las "+val.horaFinTexto+" del "+val.fechaFinTexto+".</label>" +
        		"<button id='botonVotar"+val.idEleccionVirtual+"' class='btn btn-success' onclick='crearModalInfoEleccionVirtual("+index+")' style='float:right; margin:5px 0 20px 0'>Votar</button>";
        	}else{
        	    botonVotar = "<button id='botonVotar"+val.idEleccionVirtual+"' class='btn btn-success' onclick='crearModalInfoEleccionVirtual("+index+")' style='float:right; margin-top:5px'>Votar</button>";
        	}
        	
        	var text="";	
        	
        	//Validacion para ver si hay un voto de este trabajador en la especifica EV
        	
        	if(val.votoEspecifico.estado==1 || val.votoEspecifico.estado==null){ //si hay voto registrado pero esta observado || no hay voto registrado previamente
        	    
        	    var listTotal=[
        		{sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm: (estadoEV==1 ? botonVotar : ""),styleAux:(estadoEV==0?"margin-bottom:0px":"padding-top:5px; margin-bottom:0"),
        		    divContainer:"divBotonVotarEV"+val.idEleccionVirtual,label:"<label style='color:"+(estadoEV==0 ? "black" : "orange")+"; font-size:18px; font-weight:bolder; padding-top:5px; margin-bottom:0'>"+val.descripcion+"</label>"}	               
        		          ]
        		
        		estadoEV==0 ? listTotal.push({sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",styleAux:"margin-bottom:5px",
        		    label:"<label style='color:blue'>Evento finalizado.</label>"}) : "";
        		    
        		if(userAgent!=true && estadoEV==1){
        		    listTotal.push({sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",styleAux:"margin-bottom:5px",
        			    label:"<label style='color:#5dcd5d;'>Puede emitir su voto hasta las "+val.horaFinTexto+" del "+val.fechaFinTexto+".</label>"})
        		}
        		    
        	}else{ // si hay voto registrado previamente pero esta emitido
        	    
        	    if(estadoEV==1){
        		var listTotal=[
        		               {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm: (val.votoEspecifico.estado==1?botonVotar:""),styleAux:(val.votoEspecifico.estado==0?"margin-bottom:0px":"padding-top:5px"),
        		        	   divContainer:"divBotonVotarEV"+val.idEleccionVirtual,label:"<label style='color:#5dcd5d; font-size:18px; font-weight:bolder;'>"+val.descripcion+"</label>"}	               
        		               ]
        		
        				val.votoEspecifico.estado==0 ? listTotal.push({sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",styleAux:"margin-bottom:5px",
        				    label:"<label style='color:blue'>Voto emitido el "+val.votoEspecifico.fechaVotoTexto+" a las "+val.votoEspecifico.horaVotoTexto+".</label>"}) : "";
        				    
        	    }else if(estadoEV==0){
        		
        		var listTotal=[
        		               {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"", styleAux:"margin-bottom:0px;",
        		        	   divContainer:"divBotonVotarEV"+val.idEleccionVirtual,label:"<span style='color:#5dcd5d; font-size:18px; font-weight:bolder;'>"+val.descripcion+"</span>"},
        		               {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",styleAux:"margin-bottom:5px",
        				    label:"<label style='color:blue'>Evento Finalizado. "+(userAgent==true ? "<br>" : "")+"Voto emitido el "+val.votoEspecifico.fechaVotoTexto+" a las "+val.votoEspecifico.horaVotoTexto+".</label>"}	               
        		               ]
        	    }
        	}
        	
        	text += "<div class='eventoGeneral' id='divEVEnCurso"+val.idEleccionVirtual+"' style='border-left:8px solid; "+(val.votoEspecifico.estado==0 ? "padding:15px 15px 0 15px" : "padding:5px 15px 0 15px")+"'>" +
        			"<div id='tituloEVEnCurso"+val.idEleccionVirtual+"'>";	
        
        	listTotal.forEach(function(valx){
        	    text += ""+obtenerSubPanelModuloVersionDos(valx);
        	});
        
        	text += 	 "</div>" +
        		"</div>";
        
        	if(estadoEV == 1){
        	    numEVEnCurso++;
        	    textEVEnCurso += text;
        
        	}else if(estadoEV == 0){
        	    numEVCompletadas++;
        	    textEVCompletadas += text;
        	}
        	
        	$("#subListEVEnCurso").find(".tituloSubList").html("EVENTOS EN CURSO ("+numEVEnCurso+")"+textoBotonToggleContenidoColaborador);
        	$("#subListEVEnCurso").find(".contenidoSubList").html(textEVEnCurso);
        	   	
        	$("#subListEVCompletadas").find(".tituloSubList").html("EVENTOS COMPLETADOS ("+numEVCompletadas+")"+textoBotonToggleContenidoColaborador);
        	$("#subListEVCompletadas").find(".contenidoSubList").html(textEVCompletadas);
    	
       })
       
    }else{
	$("#subListEVEnCurso").find(".tituloSubList").html("EVENTOS EN CURSO (0)");
	$("#subListEVCompletadas").find(".tituloSubList").html("EVENTOS COMPLETADOS (0)");
    }
   
    listFullEleccionVirtualAux.forEach(function(val){
	$("#tituloEVEnCurso"+val.idEleccionVirtual).children().css("margin-bottom",0);
    })
	    
   
//   listFullEleccionVirtualAux.forEach(function(val,index){
//       $("#divBotonVotarEV"+val.idEleccionVirtual).css("display","flex");
//       $("#divBotonVotarEV"+val.idEleccionVirtual).css("justify-content","flex-end");
//   })
   	 
}

function ocultarModalInfoEleccionVirtual(){
    $("#modalInfoEleccionVirtual").modal("hide");
}

function mostrarModalInfoEleccionVirtual(){
    $("#modalInfoEleccionVirtual").modal("show");
}

function crearModalInfoEleccionVirtual(pindex){
   eleccionVirtualId = listFullEleccionVirtualAux[pindex].idEleccionVirtual;
   eleccionVirtualObj = listFullEleccionVirtualAux[pindex];
    
   var tipoEventoTexto = "";
    
   if(eleccionVirtualObj.tipoEvento == 0){
      tipoEventoTexto = "ELECCIONES";
   }else if(eleccionVirtualObj.tipoEvento == 1){
      tipoEventoTexto = "CONSULTA CONFIDENCIAL";
   }else{
      tipoEventoTexto = "CONSULTA NO CONFIDENCIAL"
   }
    
   var isVotoBlancoTexto = "";(eleccionVirtualObj.isVotoBlanco == 0?isVotoBlancoTexto = "NO":isVotoBlancoTexto = "SI");
    
   var listItems=[
      {sugerencia:"",label:"Estimado(a) "+getSession('gestopusername')+":" +
       "<br><br>"+"El siguiente evento es de tipo <span style='color:blue'>"+tipoEventoTexto+"</span>." +
       "<br><br>"+"Tiene la posibilidad de marcar hasta <span style='color:blue'>"+eleccionVirtualObj.numAlternativasSeleccionables+"</span> alternativa(s)." +
       "<br>"+"<span style='color:blue'>"+isVotoBlancoTexto+"</span> está permitido el voto en blanco." +
       "<br><br>"+(eleccionVirtualObj.isSugerencia == 1?"Además, si así lo desea, puede agregar una sugerencia en la sección <span style='color:blue'>'OTROS'</span> ubicada al final de las alternativas mostradas a continuación.<br><br>":"") +
                  (eleccionVirtualObj.isComentario == 1?"Por último, tiene la posibilidad de agregar un <span style='color:blue'>COMENTARIO</span> que acompañe a su participación, al final de la ventana mostrada a continuación.<br><br>":"") +
       "Este evento comenzó el día <span style='color:blue'>"+eleccionVirtualObj.fechaInicioTexto+"</span> a las <span style='color:blue'>"+eleccionVirtualObj.horaInicioTexto+"</span> y estará disponible hasta el día <span style='color:blue'>" +
        eleccionVirtualObj.fechaFinTexto+"</span> a las <span style='color:blue'>"+eleccionVirtualObj.horaFinTexto+"</span>." +
       "<br><br><br>"+"<span style='float:right; padding-right:15px'>Atte. "+getSession("gestopcompanyname")+"</span>",anchoLabel:"col-sm-12",styleAux:"font-size:16px;text-align: justify;",inputForm:"",anchoDiv:""},
      {sugerencia:"",label:"<button id='botonContinuarInfo' type='button' class='btn btn-success' style='font-size:18px;' onclick='crearModalVotarEleccionVirtual()'>" +
      		              "Continuar" +
      		           "</button>",anchoLabel:"col-sm-12",styleAux:"text-align:center;margin:15px 0 0 0;",inputForm:"",anchoDiv:""}
   ];
    
   var textInfoEV = "";
    
   listItems.forEach(function(valx,index){
      textInfoEV += obtenerSubPanelModuloVersionDos(valx);
   });
    
   var opciones={
      id:"modalInfoEleccionVirtual",nombre:"Acerca del evento Participación y Consulta",
      contenido:"<form id='formInfoEleccionVirtual' class='eventoGeneral'>"+textInfoEV+"</form>",
      maxWidth:(userAgent == true?null:"550px")
   };
    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   $("#formInfoEleccionVirtual").children().last().css("text-align","center");
}

function ocultarModalVotarEleccionVirtual(){
    $("#modalVotarEleccionVirtual").modal("hide");
}

function crearModalVotarEleccionVirtual(){
//    eleccionVirtualId = listFullEleccionVirtualAux[pindex].idEleccionVirtual;
//    eleccionVirtualObj = listFullEleccionVirtualAux[pindex];
    $("#modalInfoEleccionVirtual").modal("hide");
    
    listRespuestas = [];
    listRespuestasTexto = "";
    textSugerencia = "";
    textComentario = "";
    
    var listItems=[]
    
    var textFormVotarEV="";
    
    listItems.forEach(function(valx,index){
	textFormVotarEV += obtenerSubPanelModuloVersionDos(valx);
    })
    
    var opciones={
	id:"modalVotarEleccionVirtual",
	nombre:eleccionVirtualObj.descripcion,
	contenido:"<form id='formVotarEleccionVirtual' class='eventoGeneral'>"+textFormVotarEV+"</form>",
	maxWidth:(userAgent==true ? null : "1000px")
    }
    
    crearModalPrincipalUsuario(opciones,function(){},true,true);
    
    var contenidoBody="<tr></tr>";
    var contenidoHeader="";
    var contenidoBotones="";
    var contenidoSugerencia="";
    var contenidoComentario="";
    var radioAlternativaVotacion;
    
    callAjaxPost(URL+"/eleccion_virtual/alternativa", { eleccionVirtual:{idEleccionVirtual:eleccionVirtualId}, isResultados:0 } ,function(data){
	listFullAlternativa = data.list;
	
	//Creacion del contenido del tbody de la tabla
	   
	listFullAlternativa.forEach(function(val,index){
		
	    var botonDescargarEvidencia = "";
	    if(val.evidencia!=null){
		botonDescargarEvidencia = "<a href='"+URL+"/eleccion_virtual/alternativa/evidencia_alternativa?idAlternativa="+val.idAlternativa+"' target='_blank'>" +
						"<button id='botonDescargarEvidenciaAlt"+val.idAlternativa+"' type='button' class='btn btn-success'>" +
							"<i class='fa fa-download fa-lg'></i> Descargar evidencia</button>" +
					  "</a>";
	    }else{
		botonDescargarEvidencia = "";
	    }
		
	    if(userAgent==true){
		contenidoBody += "<tr id='trAlternativa"+val.idAlternativa+"'>" + 
					"<td>" +
						"<div style='display:flex; justify-content:space-between;'>" +
							"<label style='font-size:18px; margin-left:5px; padding-top:5px'>Alternativa "+(index+1)+": <br></label>"+
							"<input id='radioBotonAlternativa"+val.idAlternativa+"' onclick='marcarRadioBotonAlternativaEV("+index+")' " +
								"style='margin-right:-130px;' type='checkbox' class='form-control'>" +
						"</div>" +
						"<label style='font-size:18px; margin:0 5px 10px 5px; font-weight:500'>"+val.texto+"</label>" +
				   		"<div style='text-align: center;'>" +
				   			(val.foto!=null?"<img style='width:220px; object-fit:contain;' class='cropGosst' src='data:image/png;base64,"+val.foto+"'>":"") +
				   		"</div>" +
				   			"<label style='font-size:18px; font-weight:500; margin: 10px 5px 5px 5px; text-align:justify;'>"+val.detalle+"</label>" +
    				   			(val.evidencia!=null ? "<div style='margin:10px 0; text-align:center'>"+botonDescargarEvidencia+"</div>" : "") +
				   			
    				   			
    				   	"</td>" +
				   			
    				  "</tr>"
	    }else{
		contenidoBody += "<tr id='trAlternativa"+val.idAlternativa+"'>" + 
					"<td style='font-size:18px; vertical-align:middle; text-align:center;'>"+val.texto+"</td>" +
					"<td style='text-align: center; vertical-align:middle'>" + 
						(val.foto!=null?"<img style='width:220px; object-fit:contain;' class='cropGosst' src='data:image/png;base64,"+val.foto+"' style=''>":"") +
					"</td>" +
					"<td style='text-align:center; font-size:18px; vertical-align:middle'>"+
						val.detalle + 
						(val.evidencia!=null ? "<br><br>"+botonDescargarEvidencia : "") +
					"</td>" +
					"<td style='vertical-align:middle'>" +
						"<input id='radioBotonAlternativa"+val.idAlternativa+"' onclick='marcarRadioBotonAlternativaEV("+index+")' type='checkbox' class='form-control'>" +
					"</td>" +
				"</tr>";				
    					
	    }
		
		
	})
	    
	    
//	    
//	(eleccionVirtualObj.isSugerencia==1 ? listFullAlternativa[(listFullAlternativa.length)] = {idAlternativa:-1, texto:"*OTROS"} : "");
	if(eleccionVirtualObj.isSugerencia == 1){
	   listFullAlternativa.push({idAlternativa:-1,texto:"*OTROS"});
	}
//	    
	    //Creacion y llenado de tabla
	    
	    if(userAgent==true){
		    contenidoHeader +=  "";
		    
		    contenidoBotones += "<tr style='border-bottom:none; display:flex; justify-content:center;'>" +
		    				"<td style='margin-top:15px;'>" +
		    					"<button id='botonRegresarVoto' type='button' class='btn btn-danger' style='float:left;font-size:18px;margin-right:15px;' onclick='ocultarModalVotarEleccionVirtual();mostrarModalInfoEleccionVirtual()'>Regresar</button>" +
		    					"<button id='botonConfirmarVoto' type='button' class='btn btn-success' style='float:left;font-size:18px;' onclick='crearModalConfirmarVoto()' "+(eleccionVirtualObj.isVotoBlanco==1 ? "" : "disabled")+">Confirmar</button>" +
		    				"</td>" +
		    			"</tr>";
		    
		    if(eleccionVirtualObj.isSugerencia==1){
			contenidoSugerencia += "<tr id='trAlternativa-1'>" +
							"<td>" +
								"<div style='display:flex; justify-content:space-between;'>" +
									"<label style='font-size:18px; margin:5px 0 0 5px'>OTROS: <br><span style='font-weight:500'>(opcional)</span></label>" +
									"<input id='radioBotonAlternativa-1' onclick='marcarRadioBotonAlternativaEV("+(listFullAlternativa.length-1)+")' " +
										"style='margin-right:-130px;' type='checkbox' class='form-control'>" +
								"</div>" +
								"<textarea id='inputSugerencia' type='text' style='height:80px; margin:15px 0 10px 0; resize:none' class='form-control'></textarea>" +
							"</td>" +
					       "</tr>";
		    }else{
			contenidoSugerencia += "";
		    }
		    
		    if(eleccionVirtualObj.isComentario==1){
			contenidoComentario += "<tr id='trComentario'>" +
							"<td>" +
								"<label style='margin:5px 0 0 5px; font-size:18px'>En la siguiente casilla puede insertar un comentario:</label>" +
								"<textarea id='inputComentario' type='text' maxlength='300' style='resize:none; height:80px; margin:15px 0 10px 0' class='form-control'></textarea>" +
							"</td>" +
					       "</tr>";
		    }else{
			contenidoComentario += "";
		    }
	    
		    
	    }else{
		    contenidoHeader +=	"<tr style='background-color:white'>" +
						"<th style='font-size:18px; width:250px; text-align:center'>Alternativa</td>" +
						"<th style='font-size:18px; width:200px; text-align:center'>Foto</td>" +
						"<th style='font-size:18px; width:250px; text-align:center'>Detalle</td>" +
						"<th style='font-size:18px; width:100px; text-align:center'>Marcar</td>" +
					"</tr>";
						
		    contenidoBotones += "<tr style='border-bottom:none'>" + 
						"<td colspan='4' style='margin-top:15px; text-align:center'>" +
							"<button id='botonRegresarVoto' type='button' class='btn btn-danger' style='font-size:18px;margin:15px 5px 0 0;' onclick='ocultarModalVotarEleccionVirtual();mostrarModalInfoEleccionVirtual()'>Regresar</button>" +
							"<button id='botonConfirmarVoto' type='button' class='btn btn-success' style='font-size:18px;margin:15px -15px 0 0;' onclick='crearModalConfirmarVoto()'  "+(eleccionVirtualObj.isVotoBlanco==1 ? "" : "disabled")+">Confirmar</button></td>" + 
					"</tr>";
		    
		    if(eleccionVirtualObj.isSugerencia==1){
			contenidoSugerencia += "<tr id='trAlternativa-1'>" +
							"<td style='font-size:18px; vertical-align:middle; text-align:center'>OTROS:<br>(opcional)</td>" +
							"<td colspan='2'>" +
								"<textarea id='inputSugerencia' type='text' maxlength='300' style='resize:none; height:80px; margin:10px 0' class='form-control'></textarea>" +
							"</td>" +
							"<td style='vertical-align:middle'>" +
								"<input id='radioBotonAlternativa-1' onclick='marcarRadioBotonAlternativaEV("+(listFullAlternativa.length-1)+")' type='checkbox' style='margin-bottom:5px' class='form-control'>" +
							"</td>" +
					       "</tr>";
		    }else{
			contenidoSugerencia += "";
		    }
		    
		    if(eleccionVirtualObj.isComentario==1){
			contenidoComentario += "<tr id='trComentario'>" +
							"<td colspan='4'>" +
								"<label style='margin:10px 0 10px 15px; font-size:18px'>En la siguiente casilla puede insertar un comentario:</label>" +
								"<textarea id='inputComentario' type='text' maxlength='300' style='resize:none; width:875px; height:80px; margin:10px 15px' class='form-control'></textarea>" +
							"</td>" +
					       "</tr>";
		    }else{
			contenidoComentario += "";
		    }
	    }
	    
	    
	    
	    $("#formVotarEleccionVirtual")
	    .html("<label id='textNumAlternativasSeleccionables' style='font-size:18px; color:blue; margin:0 0 10px 15px'>*Alternativas restantes: "+ eleccionVirtualObj.numAlternativasSeleccionables +
		    	(eleccionVirtualObj.isVotoBlanco==1 ? "<br>*Se permite voto en blanco (no seleccione ninguna alternativa)" : "") + "</label>" + 
		    
		  (userAgent==true ? "" : "<div class='table-responsive' id='divTblVotarEV' style='max-height:515px'>") +		    
		    	"<table id='tblVotarEleccionVirtual' class='table table-user-information' style='margin-bottom:0px'>" +
		    		"<thead>" +
		    			contenidoHeader +
		    		"</thead>" +
		    		"<tbody>" +
		    			contenidoBody +
		    			contenidoSugerencia +
		    			contenidoComentario +
		    			contenidoBotones +
		    		"</tbody>" +
		    	"</table>" +
		  (userAgent==true ? "" : "</div>")
	    );
	    
	    goheadfixedY("#tblVotarEleccionVirtual","#divTblVotarEV");
	    
    })
    
    
    
    $('#modalVotarEleccionVirtual').on('hidden.bs.modal', function(e) {
	ocultarModalVotarEleccionVirtual();
	mostrarModalInfoEleccionVirtual();
    });
}

function marcarRadioBotonAlternativaEV(indexSel){
    alternativaId = listFullAlternativa[indexSel].idAlternativa;
    alternativaObj = listFullAlternativa[indexSel];

    numAlternativasSeleccionables = eleccionVirtualObj.numAlternativasSeleccionables;
    var numAlternativasRestantes;
    var countAlternativasMarcadas=0;
	    
    listRespuestas = [];
    listRespuestasTexto = "<br>";

    listFullAlternativa.forEach(function(val){
	    
	    if( $("#radioBotonAlternativa"+val.idAlternativa).prop("checked") ){
		listRespuestas.push({id:val.idAlternativa, nombre:val.texto});
		listRespuestasTexto += val.texto+", ";
		$("#trAlternativa"+val.idAlternativa).css("background-color","#FFE4E1");
		countAlternativasMarcadas++;
	    }else{
		$("#trAlternativa"+val.idAlternativa).css("background-color","#FFFFFF"); 
	    }
	    
    })
   
    numAlternativasRestantes = numAlternativasSeleccionables - countAlternativasMarcadas;
    $("#textNumAlternativasSeleccionables").html("*Alternativas restantes: "+ numAlternativasRestantes +
	    (eleccionVirtualObj.isVotoBlanco==1 ? "<br>*Se permite voto en blanco (no seleccione ninguna alternativa)" : ""));
    
    listFullAlternativa.forEach(function(val){
    
	if(numAlternativasRestantes==0){
	    if( $("#radioBotonAlternativa"+val.idAlternativa).prop("checked")==false ){
		$("#radioBotonAlternativa"+val.idAlternativa).prop("disabled",true);
	    }else if( $("#radioBotonAlternativa-1").prop("checked")==false ) {
		$("#inputSugerencia").prop("disabled",true);
	    }
	}else{
	    $("#radioBotonAlternativa"+val.idAlternativa).prop("disabled",false);
	    $("#inputSugerencia").prop("disabled",false);
	}
	
    })
	    
    listRespuestasTexto = listRespuestasTexto.substring(0,listRespuestasTexto.length - 2);

    if(eleccionVirtualObj.isVotoBlanco==0){
    	if(listRespuestas.length>0){  //en lugar de 0 poner el numero de alternativas que puedan marcarse (dada por el admin)
		$("#botonConfirmarVoto").prop("disabled",false);
    	}else{
		$("#botonConfirmarVoto").prop("disabled",true);
    	}
    }     
}

function ocultarModalConfirmarVoto(){
    $("#modalConfirmarVotoEV").modal("hide");
    $("#modalVotarEleccionVirtual").modal("show");
}

function crearModalConfirmarVoto(){
   if(eleccionVirtualObj.isSugerencia == 1 && $("#radioBotonAlternativa-1").prop("checked")){
      ($("#inputSugerencia").val() == ""?textSugerencia = "-":textSugerencia = $("#inputSugerencia").val());
   }else{
      textSugerencia = "-";
   }
    
   if(eleccionVirtualObj.isComentario == 1){
      ($("#inputComentario").val() == ""?textComentario = "-":textComentario = $("#inputComentario").val());
   }else{
      textComentario = "-";
   }
    
   $("#modalVotarEleccionVirtual").modal("hide");$("#modalInfoEleccionVirtual").modal("hide");
    
   var listItems=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"",inputForm:"",styleAux:"font-size:22px; padding-bottom:10px; border-bottom:inset;",
       label:"Voto(s) seleccionado(s): <span style='color:blue'>"+(listRespuestasTexto == ""?"<br>VOTO NULO":listRespuestasTexto)+"</span>"}
   ];
    
   if(eleccionVirtualObj.isFechaConfirmacion == 1){
      listItems.push({sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"",inputForm:"",styleAux:(userAgent == true?"":"font-size:15px"),
          label:"Estimado(a) "+getSession('gestopusername')+", para una posterior validación de su voto electrónico, se solicita que "+
          "ingrese la <b style='color:blue'>Fecha de nacimiento</b> de su Documento Nacional de Identidad, ubicada en la parte frontal de su documento."},
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-4",inputForm:"<input id='inputFechaEmisionDni' type='date' class='form-control'>" +
          "<label id='etiquetaFechaEmisionDniObligatoria' style='color:red;visibility:hidden;'>*Obligatorio</label>",
          label:"<label style='font-size:16px; margin-top:5px;'>Fecha de nacimiento:</label>",styleAux:(userAgent == true?"text-align:center":"text-align:right")});
   }
   
   listItems.push({sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",inputForm:"<button onclick='guardarVotoEleccionVirtual()' class='btn btn-success' type='button' " +
       "style='margin-top:3px;font-size:18px'>Emitir voto</button>",styleAux:(userAgent == true?"display:flex;justify-content:center;margin-bottom:0;":null),
       label:"<button onclick='ocultarModalConfirmarVoto()' class='btn btn-danger' type='button' style='float:right;margin-top:3px;font-size:18px;padding:5px 18px;" +
       (userAgent == true?"margin-left:-15px":"")+"'>Regresar</button>"});
   
   var textFormVotarEV="";
    
   listItems.forEach(function(valx,index){
      textFormVotarEV += obtenerSubPanelModuloVersionDos(valx);
   });
    
   var opciones={
      id:"modalConfirmarVotoEV",nombre:"Confirmar voto electrónico",
      contenido:"<form id='formConfirmarVotoEV' class='eventoGeneral' style='padding-bottom:0;'>"+textFormVotarEV+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
    
   $('#modalConfirmarVotoEV').on('hidden.bs.modal',function(e){
      ocultarModalConfirmarVoto();
   });
}

function guardarVotoEleccionVirtual(){
   var eventoEnCurso = false;
   var estado2 = hallarEstadoEV(eleccionVirtualId,eleccionVirtualObj.fechaInicio,eleccionVirtualObj.horaInicio,eleccionVirtualObj.fechaFin,eleccionVirtualObj.horaFin);
    
   //Verificacion de si el estado del evento aun es EN CURSO al momento de guardar el voto
   if(estado2 == 1){
      eventoEnCurso = true;
   }else{
      eventoEnCurso = false;
      
      mensajeUx="<label>¡Este evento ya ha finalizado!</label>";	
      mensajesUx(mensajeUx,2,"","VotanteEV");
	
      $("#modalConfirmarVotoEV").modal("hide");
	
      habilitarEleccionesVirtuales();
   }
    
   if(eventoEnCurso == true){
      var fechaEmisionDni = $("#inputFechaEmisionDni").val();
      var fechaEmisionDniVacia = true;
	
      //Validacion que verifica si se ha ingresado fecha de Emision de DNI o no
      if(eleccionVirtualObj.isFechaConfirmacion == 1){
         if(fechaEmisionDni == ""){
            fechaEmisionDniVacia = true;
            $("#etiquetaFechaEmisionDniObligatoria").css("visibility","visible");
         }else{
            fechaEmisionDniVacia = false;
         }
      }else{
	 fechaEmisionDni = null;fechaEmisionDniVacia = false;
      }
	
      if(!fechaEmisionDniVacia){
	 $("#modalConfirmarVotoEV").modal("hide");
	    
	 var fechaVoto = obtenerFechaActual(); 
	 var horaVoto = obtenerHoraActual();
	    
	 var dataParams = {};
	    
	 //Validacion para ver si hay un voto de este trabajador en la especifica EV
	 if(eleccionVirtualObj.votoEmitido == 0){ //no hay voto registrado, se inserta nuevo votante
	    var dataParams={
	       idVotante:0,trabajador:{trabajadorId:getSession("trabajadorGosstId")},
	       eleccionVirtual:{idEleccionVirtual:eleccionVirtualId},fechaVoto:fechaVoto,horaVoto:horaVoto,
	       fechaEmisionDni:fechaEmisionDni,sugerencia:textSugerencia,comentario:textComentario
	    };
	 }else{ //si hay voto registrado, se actualiza
	    var dataParams={
	       idVotante:eleccionVirtualObj.votoEspecifico.idVotante,fechaVoto:fechaVoto,horaVoto:horaVoto,
	       fechaEmisionDni:fechaEmisionDni,sugerencia:textSugerencia,comentario:textComentario
	    };
	 }
	    
	 callAjaxPost(URL+"/eleccion_virtual/votante/vista_colaborador/save",dataParams,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		  var listRespuestasGuardar = [];
			    
		  listRespuestas.forEach(function(val){
		     listRespuestasGuardar.push({eleccionVirtualVotante:{idVotante:data.nuevoVotanteId},alternativaId:val.id});
	          });
			    
		  callAjaxPost(URL+"/eleccion_virtual/votante/vista_colaborador/respuestas/save",listRespuestasGuardar,function(data){
		     switch(data.CODE_RESPONSE){
		        case "05":
			   $("#modalVotarEleccionVirtual").modal("hide");$("#modalInfoEleccionVirtual").modal("hide");
					    
			   habilitarEleccionesVirtuales();
					    
			   mensajeUx = "<label>Su voto ha sido emitido correctamente.</label>";
			   mensajesUx(mensajeUx,1,"","GuardarVotante"); 
					    
			   break;
					
		        default:
			   $("#modalVotarEleccionVirtual").modal("hide");$("#modalInfoEleccionVirtual").modal("hide");
					    
			   mensajeUx = "<label>¡Ocurrió un error al guardar el voto!</label>";
			   mensajesUx(mensajeUx,2,"","GuardarVotante");
		     }
		  });
			    
		  break;
			
	       default:
		  $("#modalVotarEleccionVirtual").modal("hide");$("#modalInfoEleccionVirtual").modal("hide");
			    
		  mensajeUx = "<label>¡Ocurrió un error al guardar el voto!</label>";
		  mensajesUx(mensajeUx,2,"","GuardarVotante");
	    }
	 });		
      } // fin del if(fechaEmisionDniVacia == false)
   }// fin del if(eventoEnCurso == true)
}

//Funcion creada y usada principalmente en el eleccion_virtual.js original
function hallarEstadoEV(evId,fecha1,hora1,fecha2,hora2){
    var fechaHoy = obtenerFechaActualNoUTC();
    fechaHoy = fechaHoy.split("-")[2]+"-"+fechaHoy.split("-")[1]+"-"+fechaHoy.split("-")[0];
    var horaHoy = obtenerHoraActual(1);
    
    if(fecha1!=null && hora1!=null && fecha2!=null && hora2!=null){
	eleccionVirtualEstadoNombre = "...";
	    
	if(restaDatetimes(fechaHoy,horaHoy,fecha1,hora1)>0){
		eleccionVirtualEstadoNombre = "FUTURO";
		eleccionVirtualEstado = 2;
	}else{
	    if(restaDatetimes(fecha2,hora2,fechaHoy,horaHoy)>=0){
		    eleccionVirtualEstadoNombre = "COMPLETADO";
		    eleccionVirtualEstado = 0;
	    }else{
		    eleccionVirtualEstadoNombre = "EN CURSO";
		    eleccionVirtualEstado = 1;
	    }
	}
    }else{
	eleccionVirtualEstadoNombre = "*Automático";
    }

    $("#tdestado"+evId).html(eleccionVirtualEstadoNombre);

    return eleccionVirtualEstado;
}