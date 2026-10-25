var userAgent = isMobile.any();
var eleccionVirtualId,eleccionVirtualObj;
var banderaEdicion1=false;
var listTipoEleccionVirtual;
var listFullEleccionVirtual;
var eleccionVirtualEstadoNombreHTML;
var eleccionVirtualEstadoNombre;
var eleccionVirtualEstado;
var listTrabajadoresResponsableEleccionVirtual =[];
var mensajeUx;
var menuSel = false;
var eleccionVirtualDescripcion;
var listFullAlternativaAux;
var listFullEleccionVirtualAux = [];
var listTipoEvento = [
                      {id:0, nombre:"Elecciones"},
                      {id:1, nombre:"Consulta confidencial"},
                      {id:2, nombre:"Consulta NO confidencial"}
                                  ]
var listTabs=[
              {id:1,nombre:"Plantilla" },
             // {id:2,nombre:"Extras"    }, °
              ];
$(function(){
	$("#btnNuevoEleccionVirtual").attr("onclick", "javascript:nuevoEleccionVirtual();");
	$("#btnCancelarEleccionVirtual").attr("onclick", "javascript:cancelarEleccionVirtual();");
	$("#btnGuardarEleccionVirtual").attr("onclick", "javascript:guardarEleccionVirtual();");
	$("#btnDescargarInformeEleccionVirtual").attr("onclick", "javascript:descargarInformeEleccionVirtual();");
	$("#btnResultadosEleccionVirtual").attr("onclick", "javascript:crearModalResultadosEleccionVirtual();");
	$("#btnConfiguracionEleccionVirtual").attr("onclick", "javascript:crearModalConfiguracionEleccionVirtual();")
	$("#btnEliminarEleccionVirtual").attr("onclick", "javascript:eliminarEleccionVirtual();");
	//div
	$("#divAlternativas").hide();
	$("#divEvidencias").hide();
	
	insertMenuPrimeraVez(function(){	
	    cargarEleccionesVirtuales();
	    completarBarraCarga();
	    $("#tabEleccionVirtual").show();
	});
	
	
})
	
//function verAcordeTabParticipacionYConsulta(){
//	var tabId=$("#selTabParticipacionYConsulta").val();
//	var tabNombre="";
//	$(".tab-content .tab-pane").hide();
//	switch(parseInt(tabId)){
//	case 1:
//		tabNombre="tabParticipacionYConsulta";
//		cargarPlantillas();
//		break;
//		/*
//	case 2:
//		tabNombre="tabExtra"
//		cargarExtra();
//		break;
//		*/ 
//	}
//	completarBarraCarga();
//	$("#"+tabNombre).show();
//}

function cargarEleccionesVirtuales(){
   resizeDivWrapper("wrapperEleccionVirtual",160);
    	
   $("#btnCancelarEleccionVirtual").hide();$("#btnNuevoEleccionVirtual").show();$("#btnEliminarEleccionVirtual").hide();
   $("#btnDescargarInformeEleccionVirtual").hide();$("#btnGuardarEleccionVirtual").hide();$("#btnResultadosEleccionVirtual").hide();
   $("#btnConfiguracionEleccionVirtual").hide();$("#btnAgregarImagenesAImagenAuxiliar").hide();
	
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid"))   
   };
   
   callAjaxPost(URL+'/eleccion_virtual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicion1 = false;	
	 
	 listFullEleccionVirtual = data.list;

	 var listEnCurso = [],listFuturo = [],listCompletado = [];
	 var bColor = "white";
					
	 listFullEleccionVirtualAux = [];

	 $("#tblEleccionVirtual tbody tr").remove();
					
	 listFullEleccionVirtual.forEach(function(val,index){
	    var estadoInicial = hallarEstadoEV(val.idEleccionVirtual,val.fechaInicio,val.horaInicio,val.fechaFin,val.horaFin);
					    
	    if(estadoInicial == 0){
	       listCompletado.push(listFullEleccionVirtual[index]);
	    }else if(estadoInicial == 1){
	       listEnCurso.push(listFullEleccionVirtual[index]);
	    }else{
	       listFuturo.push(listFullEleccionVirtual[index]);
	    }
	 });  
					
	 listEnCurso.forEach(function(val,index){listFullEleccionVirtualAux.push(listEnCurso[index]);});
	 listFuturo.forEach(function(val,index){listFullEleccionVirtualAux.push(listFuturo[index]);});
	 listCompletado.forEach(function(val,index){listFullEleccionVirtualAux.push(listCompletado[index]);});

	 listFullEleccionVirtualAux.forEach(function(val,index){
	    $("#tblEleccionVirtual tbody").append(
	       "<tr id='trEleccionVirtual"+val.idEleccionVirtual+"' onclick='editarEleccionVirtual("+index+")'>" +
	          "<td id='tdideleccion_virtual"+val.idEleccionVirtual+"' style='vertical-align: middle; position:sticky; left:0; z-index:1011;'>"+(index+1)+"</td>" +
		  "<td id='tdtipo_evento"+val.idEleccionVirtual+"' style='vertical-align: middle; position:sticky; left:100px; z-index:1011;'>"+listTipoEvento[val.tipoEvento].nombre+"</td>" +
		  "<td id='tddescripcion"+val.idEleccionVirtual+"' style='vertical-align: middle; position:sticky; left:330px; z-index:1011;'>"+val.descripcion+"</td>" +
		  "<td id='tdresponsable"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.trabajador.nombre+"</td>" +
		  "<td id='tdjunta"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.listJuntaNombre+"</td>" +
		  "<td id='tdfecha_inicio"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.fechaInicioTexto+"</td>" +
		  "<td id='tdhora_inicio"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.horaInicioTexto+"</td>" +
		  "<td id='tdfecha_fin"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.fechaFinTexto+"</td>" +
		  "<td id='tdhora_fin"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.horaFinTexto+"</td>" +
	          "<td id='tdpuestos_asociados"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.numPuestosAsociados+"</td>" +
	          "<td id='tdexcepciones"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.numExcepciones+"</td>" +
		  "<td id='tdalternativas"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.numAlternativas+"</td>" +
		  "<td id='tdvotantes"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.numVotantes+"/"+val.numTrabajadoresAptos+"</td>" +
		  "<td id='tdevidencias"+val.idEleccionVirtual+"' style='vertical-align: middle;'>"+val.numEvidencias+"</td>" +
		  "<td id='tdestado"+val.idEleccionVirtual+"' style='vertical-align: middle;'></td>" +
	       "</tr>");
						
	    hallarEstadoEV(val.idEleccionVirtual,val.fechaInicio,val.horaInicio,val.fechaFin,val.horaFin);
	 });
					
	 formatoCeldaSombreableTabla(true,"tblEleccionVirtual");
	 $("#tblEleccionVirtual").css("border-collapse","inherit");
      }else{
	 console.log("NOPNPO");
      }
   });
}

var estadoEleccionVirtual;

function editarEleccionVirtual(pindex) {
	if (!banderaEdicion1) {
	    
	    	formatoCeldaSombreableTabla(false,"tblEleccionVirtual");
	    	eleccionVirtualId = listFullEleccionVirtualAux[pindex].idEleccionVirtual;
		eleccionVirtualObj = listFullEleccionVirtualAux[pindex];
		
		$("#tdideleccion_virtual"+eleccionVirtualId).css("background-color","#FFE4E1");
			$("#tdideleccion_virtual"+eleccionVirtualId).css("z-index","1011");
		$("#tdtipo_evento"+eleccionVirtualId).css("background-color","#FFE4E1");
			$("#tdtipo_evento"+eleccionVirtualId).css("z-index","1011");
		$("#tddescripcion"+eleccionVirtualId).css("background-color","#FFE4E1");
			$("#tddescripcion"+eleccionVirtualId).css("z-index","1011");
		$("#tdresponsable"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdjunta"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdfecha_inicio"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdhora_inicio"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdfecha_fin"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdhora_fin"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdpuestos_asociados"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdexcepciones"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdalternativas"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdvotantes"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdevidencias"+eleccionVirtualId).css("background-color","#FFE4E1");
		$("#tdestado"+eleccionVirtualId).css("background-color","#FFE4E1");
		
		$("#trEleccionVirtual"+eleccionVirtualId).addClass("fila-edicion");
		
		var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
		estadoEleccionVirtual = estado;
		//Tipo de evento
		$("#tdtipo_evento" + eleccionVirtualId).html(listTipoEvento[eleccionVirtualObj.tipoEvento].nombre);
		
		switch(estado){
			case 0: //completado
			    
			    //Descripcion
			    $("#tddescripcion"+ eleccionVirtualId).html(eleccionVirtualObj.descripcion + "<input type='text' id='inputDescripcion' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputDescripcion").val(eleccionVirtualObj.descripcion);
			    
			    //Responsable
			    var name1 = $("#tdresponsable" + eleccionVirtualId).html();
			    $("#tdresponsable" + eleccionVirtualId).html(eleccionVirtualObj.trabajador.nombre +"<input type='text' id='inputResponsable' class='form-control' placeholder='Responsable' autocomplete='off' style='height:0; visibility:hidden; margin-top:-10px'>"+
			    	"<div style='height:0; visibility:hidden; margin-top:-10px' id='divAutoCompletarTrabEleccionVirtual'></div>");
				
			    $("#inputResponsable").val(name1);
			    verAutoCompletarTrabEleccionVirtual();
			    $("#selAutoTrabajador").val(eleccionVirtualObj.trabajador.trabajadorId);
			    
			    //Junta
			    $("#tdjunta"+eleccionVirtualId).html(eleccionVirtualObj.listJuntaNombre);
			    
			    //Fecha Inicio
			    $("#tdfecha_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.fechaInicioTexto + "<input type='date' id='inputFechaInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputFechaInicio").val(eleccionVirtualObj.fechaInicio);
			    
			    //Hora Inicio
			    $("#tdhora_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.horaInicioTexto + "<input type='time' id='inputHoraInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputHoraInicio").val(eleccionVirtualObj.horaInicio);
			    
			    //Fecha Fin
			    $("#tdfecha_fin"+ eleccionVirtualId).html(eleccionVirtualObj.fechaFinTexto + "<input type='date' id='inputFechaFin' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputFechaFin").val(eleccionVirtualObj.fechaFin);
			
			    //Hora Fin
			    $("#tdhora_fin"+ eleccionVirtualId).html(eleccionVirtualObj.horaFinTexto + "<input type='time' id='inputHoraFin' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputHoraFin").val(eleccionVirtualObj.horaFin);
			    
			    break;
			    
			case 1: //en curso
			    
			    //Descripcion
			    $("#tddescripcion"+ eleccionVirtualId).html("<input type='text' id='inputDescripcion' class='form-control'>");
			    $("#inputDescripcion").val(eleccionVirtualObj.descripcion);
			    
			    //Responsable
			    var name1 = $("#tdresponsable" + eleccionVirtualId).html();
			    $("#tdresponsable" + eleccionVirtualId).html("<input type='text' id='inputResponsable' class='form-control' placeholder='Responsable' autocomplete='off'>"+
			    	"<div id='divAutoCompletarTrabEleccionVirtual'></div>");
				
			    $("#inputResponsable").val(name1);
			    verAutoCompletarTrabEleccionVirtual();
			    $("#selAutoTrabajador").val(eleccionVirtualObj.trabajador.trabajadorId);
			    
			    //Junta
			    obtenerListaJunta(eleccionVirtualId);
			    
			    //Fecha Inicio
			    $("#tdfecha_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.fechaInicioTexto + "<input type='date' id='inputFechaInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputFechaInicio").val(eleccionVirtualObj.fechaInicio);
			    
			    //Hora Inicio
			    $("#tdhora_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.horaInicioTexto + "<input type='time' id='inputHoraInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
			    $("#inputHoraInicio").val(eleccionVirtualObj.horaInicio);
			    
			    //Fecha Fin
			    var f_f = new Date(eleccionVirtualObj.fechaFin);
			    var f_f_day = ("0" + f_f.getUTCDate()).slice(-2);
			    var f_f_month = ("0" + (f_f.getUTCMonth() + 1)).slice(-2);
			    var f_f_final = f_f.getUTCFullYear() + "-" + (f_f_month) + "-" + (f_f_day);
			
			    $("#tdfecha_fin"+ eleccionVirtualId).html("<input type='date' id='inputFechaFin' class='form-control' onchange='hallarEstadoEV("+eleccionVirtualId+","+null+","+null+","+null+","+null+")'>");
			    $("#inputFechaFin").val(f_f_final);
			
			    //Hora Fin
			    var h_f = new Date(eleccionVirtualObj.fechaFin+" "+ eleccionVirtualObj.horaFin);
			    var h_f_hour= ("0" + h_f.getHours()).slice(-2);
			    var h_f_minutes=("0" + h_f.getMinutes()).slice(-2);
			    var h_f_final= h_f_hour + ":" + h_f_minutes;
			
			    $("#tdhora_fin"+ eleccionVirtualId).html("<input type='time' id='inputHoraFin' class='form-control'>");
			    $("#inputHoraFin").val(h_f_final);
			    
			    break;
			    
			case 2: //futuro
			    
			    //Descripcion
			    $("#tddescripcion"+ eleccionVirtualId).html("<input type='text' id='inputDescripcion' class='form-control'>");
			    $("#inputDescripcion").val(eleccionVirtualObj.descripcion);
			    
			    //Responsable
			    var name1 = $("#tdresponsable" + eleccionVirtualId).html();
			    $("#tdresponsable" + eleccionVirtualId).html("<input type='text' id='inputResponsable' class='form-control' placeholder='Responsable' autocomplete='off'>"+
			    	"<div id='divAutoCompletarTrabEleccionVirtual'></div>");
				
			    $("#inputResponsable").val(name1);
			    verAutoCompletarTrabEleccionVirtual();
			    $("#selAutoTrabajador").val(eleccionVirtualObj.trabajador.trabajadorId);
			    
			    //Junta
			    obtenerListaJunta(eleccionVirtualId);
			    
			    //Fecha Inicio
			    var f_i = new Date(eleccionVirtualObj.fechaInicio);
			    var f_i_day = ("0" + f_i.getUTCDate()).slice(-2);
			    var f_i_month = ("0" + (f_i.getUTCMonth() + 1)).slice(-2);
			    var f_i_final = f_i.getUTCFullYear() + "-" + (f_i_month) + "-" + (f_i_day);
			
			    $("#tdfecha_inicio"+ eleccionVirtualId).html("<input type='date' id='inputFechaInicio' class='form-control' onchange='hallarEstadoEV("+eleccionVirtualId+","+null+","+null+","+null+","+null+")'>");
			    $("#inputFechaInicio").val(f_i_final);
			
			    //Hora Inicio
			    var h_i = new Date(eleccionVirtualObj.fechaInicio +" "+ eleccionVirtualObj.horaInicio);
			    var h_i_hour= ("0" + h_i.getHours()).slice(-2);
			    var h_i_minutes=("0" + h_i.getMinutes()).slice(-2);
			    var h_i_final= h_i_hour + ":" + h_i_minutes;
			
			    $("#tdhora_inicio"+ eleccionVirtualId).html("<input type='time' id='inputHoraInicio' class='form-control'>");
			    $("#inputHoraInicio").val(h_i_final);
			    
			    //Fecha Fin
			    var f_f = new Date(eleccionVirtualObj.fechaFin);
			    var f_f_day = ("0" + f_f.getUTCDate()).slice(-2);
			    var f_f_month = ("0" + (f_f.getUTCMonth() + 1)).slice(-2);
			    var f_f_final = f_f.getUTCFullYear() + "-" + (f_f_month) + "-" + (f_f_day);
			
			    $("#tdfecha_fin"+ eleccionVirtualId).html("<input type='date' id='inputFechaFin' class='form-control' onchange='hallarEstadoEV("+eleccionVirtualId+","+null+","+null+","+null+","+null+")'>");
			    $("#inputFechaFin").val(f_f_final);
			
			    //Hora Fin
			    var h_f = new Date(eleccionVirtualObj.fechaFin+" "+ eleccionVirtualObj.horaFin);
			    var h_f_hour= ("0" + h_f.getHours()).slice(-2);
			    var h_f_minutes=("0" + h_f.getMinutes()).slice(-2);
			    var h_f_final= h_f_hour + ":" + h_f_minutes;
			
			    $("#tdhora_fin"+ eleccionVirtualId).html("<input type='time' id='inputHoraFin' class='form-control'>");
			    $("#inputHoraFin").val(h_f_final);
			    
			    break;
		}
		
		
		
		


		
		
		
		
		
//		/* Tipo de evento */
//		$("#tdtipo_evento" + eleccionVirtualId).html(listTipoEvento[eleccionVirtualObj.tipoEvento].nombre);
//		
//		/* Descripcion */
//		$("#tddescripcion"+ eleccionVirtualId).html("<input type='text' id='inputDescripcion' class='form-control'>");
//		$("#inputDescripcion").val(eleccionVirtualObj.descripcion);
//		
//		/* Responsable */
//		//
//		var name1 = $("#tdresponsable" + eleccionVirtualId).html();
//		$("#tdresponsable" + eleccionVirtualId).html("<input type='text' id='inputResponsable' class='form-control' placeholder='Responsable' autocomplete='off'>"+
//				     "<div id='divAutoCompletarTrabEleccionVirtual'></div>");
//		
//  	        $("#inputResponsable").val(name1);
//	        verAutoCompletarTrabEleccionVirtual();
//		$("#selAutoTrabajador").val(eleccionVirtualObj.trabajador.trabajadorId);
//		// 
//		
//		
//		var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
//		
//		
//		/* Junta */
//		//
//		if(estado != 0){
//        		var dataParam = {
//        			empresaId : getSession("gestopcompanyid"),
//        			idEleccionVirtual : eleccionVirtualId
//        		};
//        		
//        		callAjaxPost(URL+"/eleccion_virtual/excepcion/trabajadores",dataParam,function(data){
//        		    var listAux = data.list;
//        		    var listFullTrabajadores = [];
//        		    var juntaExiste = false;
//        			
//        		    if(eleccionVirtualObj.listJuntaId != null){
//        			var juntaIdVector = eleccionVirtualObj.listJuntaId.split(",");
//        			juntaExiste = true;
//        		    }
//        		    
//        		    var isSelected = 0;
//        		    
//        		    if(juntaExiste){
//        			listAux.forEach(function(val){
//        			    for(var i=0;i<juntaIdVector.length;i++){
//        				if(val.trabajadorId == juntaIdVector[i]){
//        				    isSelected = 1;
//        				    break;
//        				}else{
//        				    isSelected = 0;
//        				}
//        			    }
//        			    listFullTrabajadores.push(
//        				    {id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", selected:isSelected}
//        			    );
//        			})
//        		    }else{
//        			listAux.forEach(function(val){
//        			    listFullTrabajadores.push(
//        				    {id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", selected:isSelected}
//        			    )
//        			})
//        		    }
//        
//        		    crearSelectOneMenuObligMultipleCompleto("slcJuntaEleccionVirtual", "",listFullTrabajadores,"id",
//        				"nombre","#tdjunta"+eleccionVirtualId,"Trabajadores...");
//        		})
//		}
//		//
//		
//		if(eleccionVirtualObj.numVotantes>0 || estado==1 || estado==0){
//		    /* Fecha Inicio y Hora Inicio */
//		    $("#tdfecha_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.fechaInicioTexto + "<input type='date' id='inputFechaInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
//		    $("#inputFechaInicio").val(eleccionVirtualObj.fechaInicio);
//		    
//		    $("#tdhora_inicio"+ eleccionVirtualId).html(eleccionVirtualObj.horaInicioTexto + "<input type='time' id='inputHoraInicio' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
//		    $("#inputHoraInicio").val(eleccionVirtualObj.horaInicio);
//		    
//		}else{
//		    /* Fecha Inicio */
//			var f_i = new Date(eleccionVirtualObj.fechaInicio);
//			var f_i_day = ("0" + f_i.getUTCDate()).slice(-2);
//			var f_i_month = ("0" + (f_i.getUTCMonth() + 1)).slice(-2);
//			var f_i_final = f_i.getUTCFullYear() + "-" + (f_i_month) + "-" + (f_i_day);
//		
//			$("#tdfecha_inicio"+ eleccionVirtualId).html("<input type='date' id='inputFechaInicio' class='form-control' onchange='hallarEstadoEV("+eleccionVirtualId+","+null+","+null+","+null+","+null+")'>");
//			$("#inputFechaInicio").val(f_i_final);
//		
//		   /* Hora Inicio */
//			var h_i = new Date(eleccionVirtualObj.fechaInicio +" "+ eleccionVirtualObj.horaInicio);
//			var h_i_hour= ("0" + h_i.getHours()).slice(-2);
//			var h_i_minutes=("0" + h_i.getMinutes()).slice(-2);
//			var h_i_final= h_i_hour + ":" + h_i_minutes;
//		
//			$("#tdhora_inicio"+ eleccionVirtualId).html("<input type='time' id='inputHoraInicio' class='form-control'>");
//			$("#inputHoraInicio").val(h_i_final);
//		}
//		
//		if(estado==0){
//		    /* Fecha Fin y Hora Fin*/
//		    $("#tdfecha_fin"+ eleccionVirtualId).html(eleccionVirtualObj.fechaFinTexto + "<input type='date' id='inputFechaFin' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
//		    $("#inputFechaFin").val(eleccionVirtualObj.fechaFin);
//		    
//		    $("#tdhora_fin"+ eleccionVirtualId).html(eleccionVirtualObj.horaFinTexto + "<input type='time' id='inputHoraFin' class='form-control' style='height:0; visibility:hidden; margin-top:-10px'>");
//		    $("#inputHoraFin").val(eleccionVirtualObj.horaFin);
//		}else{
//		    	/* Fecha Fin */
//		    	var f_f = new Date(eleccionVirtualObj.fechaFin);
//			var f_f_day = ("0" + f_f.getUTCDate()).slice(-2);
//			var f_f_month = ("0" + (f_f.getUTCMonth() + 1)).slice(-2);
//			var f_f_final = f_f.getUTCFullYear() + "-" + (f_f_month) + "-" + (f_f_day);
//		
//			$("#tdfecha_fin"+ eleccionVirtualId).html("<input type='date' id='inputFechaFin' class='form-control' onchange='hallarEstadoEV("+eleccionVirtualId+","+null+","+null+","+null+","+null+")'>");
//			$("#inputFechaFin").val(f_f_final);
//		
//			/* Hora Fin */
//			var h_f = new Date(eleccionVirtualObj.fechaFin+" "+ eleccionVirtualObj.horaFin);
//			var h_f_hour= ("0" + h_f.getHours()).slice(-2);
//			var h_f_minutes=("0" + h_f.getMinutes()).slice(-2);
//			var h_f_final= h_f_hour + ":" + h_f_minutes;
//		
//			$("#tdhora_fin"+ eleccionVirtualId).html("<input type='time' id='inputHoraFin' class='form-control'>");
//			$("#inputHoraFin").val(h_f_final);
//		}
		
		/********* Enlaces *********/
		/* Puestos Asociados */
		$("#tdpuestos_asociados"+ eleccionVirtualId)
		.html("<a class='efectoLink' onclick='cargarModalFiltroAsignacion(verPuestosEleccionVirtual)'>" +
		      "<i class='fa fa-list'></i>"+ $("#tdpuestos_asociados"+eleccionVirtualId).text()+" </a>");
		
		/* Excepciones */
		$("#tdexcepciones"+ eleccionVirtualId)
		.html("<a class='efectoLink' onclick='verEleccionVirtualEnlaceExcepciones()'>" +
		      "<i class='fa fa-list'></i>"+ $("#tdexcepciones"+eleccionVirtualId).text()+" </a>");
		
		/* Alternativas */
		eleccionVirtualDescripcion=$("#inputDescripcion").val();
		
		$("#tdalternativas"+ eleccionVirtualId)
		.html("<a class='efectoLink' onclick='verEleccionVirtualEnlaceAlternativas()'>" +
		      "<i class='fa fa-list'></i>"+ $("#tdalternativas"+eleccionVirtualId).text()+" </a>");
		
		/* Votantes */
		$("#tdvotantes"+ eleccionVirtualId)
		.html("<a class='efectoLink' onclick='verEleccionVirtualEnlaceVotantes()'>" +
		      "<i class='fa fa-list'></i>"+ $("#tdvotantes"+eleccionVirtualId).text()+" </a>");
		
		/* Evidencias */
		$("#tdevidencias"+ eleccionVirtualId)
		.html("<a class='efectoLink' onclick='verEleccionVirtualEnlaceEvidencias()'>" +
		      "<i class='fa fa-list'></i>"+ $("#tdevidencias"+eleccionVirtualId).text()+" </a>");
		//
		var fecha1=$("#inputFechaInicio").val();
		var hora1=$("#inputHoraInicio").val();
		var fecha2=$("#inputFechaFin").val();
		var hora2=$("#inputHoraFin").val();
		hallarEstadoEV(eleccionVirtualId,fecha1,hora1,fecha2,hora2);
		
		banderaEdicion1 = true;
		$("#btnCancelarEleccionVirtual").show();
		$("#btnNuevoEleccionVirtual").hide();
		$("#btnGuardarEleccionVirtual").show();
		$("#btnDescargarInformeEleccionVirtual").show();
		$("#btnResultadosEleccionVirtual").show();
		$("#btnEliminarEleccionVirtual").show();
		$("#btnConfiguracionEleccionVirtual").show();
	}

}

function nuevoEleccionVirtual() {
	if (!banderaEdicion1) {
	    
	    	formatoCeldaSombreableTabla(false,"tblEleccionVirtual");
	    	eleccionVirtualObj = {id : 0};
		eleccionVirtualId = 0;
		
		$("#tblEleccionVirtual tbody").prepend(
			"<tr>" 
				+"<td id='tdideleccion_virtual0' style='position:sticky; left:0; z-index:1011'>...</td>"
				+"<td id='tdtipo_evento0' style='position:sticky; left:100px; z-index:1011'>"+crearSelectOneMenu("selTipoEvento","",listTipoEvento,-1,"id","nombre","-Tipo de Evento-")+"</td>"
				+"<td id='tddescripcion0' style='position:sticky; left:330px; z-index:1011'><input type='text' id='inputDescripcion' class='form-control'></td>"
				+"<td><input type='text' id='inputResponsable' class='form-control' placeholder='Responsable' autocomplete='off'>" 
			        	+"<div id='divAutoCompletarTrabEleccionVirtual'></div></td>"
			        +"<td id='inputJunta"+eleccionVirtualId+"' style='padding-top:10px'></td>"
			        +"<td><input type='date' id='inputFechaInicio' class='form-control'></td>"
			        +"<td><input type='time' id='inputHoraInicio' class='form-control'></td>"
			        +"<td><input type='date' id='inputFechaFin' class='form-control'></td>"
			        +"<td><input type='time' id='inputHoraFin' class='form-control'></td>"
			        +"<td>*Primero debe guardar el registro</td>"
			        +"<td>*Primero debe guardar el registro</td>"
			        +"<td>*Primero debe guardar el registro</td>"
			        +"<td>*Primero debe guardar el registro</td>"
			        +"<td>*Primero debe guardar el registro</td>"
			        +"<td>*Automático</td>"
				//Agregar necesarios
			+ "</tr>");
		
		var dataParam = {
			empresaId : getSession("gestopcompanyid"),
			idEleccionVirtual : eleccionVirtualId
		};
		
		callAjaxPost(URL+"/eleccion_virtual/excepcion/trabajadores",dataParam,function(data){
		    var listAux = data.list;
		    var listFullTrabajadores = [];
				
		    listAux.forEach(function(val){
			listFullTrabajadores.push(
				{id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", isTomado:val.isTomado}
			)
		    })
		    
		    crearSelectOneMenuObligMultipleCompleto("slcJuntaEleccionVirtual", "",listFullTrabajadores,"id",
				"nombre","#inputJunta"+eleccionVirtualId,"Trabajadores...");
		})
		
		$("#inputResponsable").attr("onkeyup","verAutoCompletarTrabEleccionVirtual()");
		
		$("#btnCancelarEleccionVirtual").show();
		$("#btnNuevoEleccionVirtual").hide();
		$("#btnEliminarEleccionVirtual").hide();
		$("#btnGuardarEleccionVirtual").show();
		$("#btnDescargarInformeEleccionVirtual").hide();
		banderaEdicion1 = true;
	} else {
	    mensajeUx="<label>Guarde primero.</label>";
	    mensajesUx(mensajeUx,2,"","EleccionVirtual");
	}
}

function cancelarEleccionVirtual() {
	cargarEleccionesVirtuales();
}

function eliminarEleccionVirtual() {
    mensajeUx="<label>¿Está seguro de eliminar la Elección Virtual?</label>";
    mensajesUx(mensajeUx,3,"","EleccionVirtual");
    
    $("#btnDevolverValorEleccionVirtual").on("click",function(){
	if(eleccionVirtualObj.numEvidencias == 0 && eleccionVirtualObj.numVotantes == 0){ 
	    var dataParam = {			
			idEleccionVirtual : eleccionVirtualId,
		};
		
		callAjaxPost(URL+'/eleccion_virtual/delete',dataParam,
			function(data){
		    		switch(data.CODE_RESPONSE){
		    		case "05":
		    		    cargarEleccionesVirtuales();
				    mensajeUx="<label>Se ha eliminado correctamente la Elección Virtual.</label>";
				    mensajesUx(mensajeUx,1,"","EleccionVirtual"); 
				    break;
				default:
				    mensajeUx="<label>¡Ocurrió un error al eliminar la Elección Virtual!</label>";
				    mensajesUx(mensajeUx,2,"","EleccionVirtual");
		    		}
			}
		)
//	}else if(eleccionVirtualObj.numEvidencias > 0){ //&& eleccionVirtualObj.numVotantes = 0
//	    mensajeUx="<label>La Elección Virtual no puede ser eliminada porque aún hay evidencias almacenadas.</label>";
//	    mensajesUx(mensajeUx,2,"","EleccionVirtual");
//	}else if(eleccionVirtualObj.numEvidencias = 0){ //&& eleccionVirtualObj.numVotantes != 0
//	    mensajeUx="<label>La Elección Virtual no puede ser eliminada porque ya se han registrados votos.</label>";
//	    mensajesUx(mensajeUx,2,"","EleccionVirtual");
	}else{
	    mensajeUx="<label>La Elección Virtual no puede ser eliminada porque ya se han registrados votos y aún hay evidencias almacenadas.</label>";
	    mensajesUx(mensajeUx,2,"","EleccionVirtual"); 
	}
	
		
    });
}

function guardarEleccionVirtual() {
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==0 && eleccionVirtualId!=0){
	cargarEleccionesVirtuales();
	mensajeUx="<label>Se ha guardado correctamente el evento.</label>";
	mensajesUx(mensajeUx,1,"","EleccionVirtual"); 
    }else{
        var campoVacio = true;
        var fechasValidas = true;
        //Programa lógica de acceso de guardado
        
        var descripcion=$("#inputDescripcion").val();
        var responsable=$("#inputResponsable").val();
        var trabId=parseInt($("#selAutoTrabajador").val());
        var fechaInicioTexto=$("#inputFechaInicio").val();
        var fechaInicio=convertirFechaTexto($("#inputFechaInicio").val());
        var horaInicio=$("#inputHoraInicio").val();
        var fechaFinTexto=$("#inputFechaFin").val();
        var fechaFin=convertirFechaTexto($("#inputFechaFin").val());
        var horaFin=$("#inputHoraFin").val();
        var tipoEvento=$("#selTipoEvento").val();
        
        if(descripcion=="" || Number.isNaN(trabId)==true || fechaInicio == null || fechaFin == null || horaInicio=="" || horaFin==""){
    	campoVacio=false;
    	mensajeUx="<label>Debe completar todos los campos antes de guardar.</label>";
    	mensajesUx(mensajeUx,2,"");
        }else if(trabId==-1){
    	campoVacio=false;
    	mensajeUx="<label>Debe asignar algún representante antes de guardar.</label>";
    	mensajesUx(mensajeUx,2,"");
        }else if(tipoEvento==-1){
    	campoVacio=false;
    	mensajeUx="<label>Debe seleccionar un tipo de evento antes de guardar.</label>";
    	mensajesUx(mensajeUx,2,"");
        }else{
    	campoVacio=true;
        }
        
        if(restaDatetimes(fechaInicioTexto,horaInicio,fechaFinTexto,horaFin)<=0){
    	fechasValidas = false;
    	mensajeUx="<label>La Fecha de Fin del evento es menor que la Fecha de Inicio. Por favor, introduzca unas fechas correctas.</label>";
    	mensajesUx(mensajeUx,2,"");
        }else{
    	fechasValidas = true;
        }
        
        if (campoVacio && fechasValidas) {
            var dataParam = {
            	idEleccionVirtual : eleccionVirtualId,
        		descripcion : descripcion,
        		trabajador : {trabajadorId:trabId},
        		fechaInicio : fechaInicio,
        		horaInicio: horaInicio,
        		fechaFin : fechaFin,
        		horaFin : horaFin,
        		tipoEvento : tipoEvento,
        		empresaId : getSession("gestopcompanyid")
        	};
            
            callAjaxPost(URL + '/eleccion_virtual/save',dataParam,function(data){
        		switch (data.CODE_RESPONSE) {
        			case "05":
        			    var listJunta = $("#slcJuntaEleccionVirtual").val();
        			    var listGuardar = [];
        			    
        			    listGuardar.push({
        				eleccionVirtual : {idEleccionVirtual:data.nuevaEleccionVirtualId},
        				trabajadorId : null,
        				isAsociado : 0
        			    })
        			    listJunta.forEach(function(val){
        				listGuardar.push({	
        				    eleccionVirtual : {idEleccionVirtual:data.nuevaEleccionVirtualId},
        				    trabajadorId : val,
        				    isAsociado : 1
        				})
        			    });
        			    console.log(listGuardar);
        			    
//    			    if(listGuardar.length>0){
            			    callAjaxPost(URL + '/eleccion_virtual/junta/save',listGuardar,function(data){
            				switch(data.CODE_RESPONSE){
            		        	case "05":
            	    			    cargarEleccionesVirtuales();
            	    			    mensajeUx="<label>Se ha guardado correctamente el evento.</label>";
            	    			    mensajesUx(mensajeUx,1,"","EleccionVirtual"); 
            	    			    break;
            		        	default:
            		        	    mensajeUx="<label>¡Ocurrió un error al guardar la junta del evento!</label>";
            		            	    mensajesUx(mensajeUx,2,"","AsignacionEleccionVirtual");
            		        	}
            			    })
//    			    }else{
//    				cargarEleccionesVirtuales();
//    	    			mensajeUx="<label>Se ha guardado correctamente el evento.</label>";
//    	    			mensajesUx(mensajeUx,1,"","EleccionVirtual");
//    			    }    
        			    break;
        			    
        			default:
        			    mensajeUx="<label>¡Ocurrió un error al guardar el evento!</label>";
        			    mensajesUx(mensajeUx,2,"","EleccionVirtual");
        		}
            });	
        }
	
    }
}

function descargarInformeEleccionVirtual(){
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==1){
	mensajeUx="<label>No es posible descargar el informe porque el evento aún está EN CURSO.</label>";
    	mensajesUx(mensajeUx,2,"","EleccionVirtual");
    }else if(estado==2){
	mensajeUx="<label>No es posible descargar el informe porque el evento aún no ha comenzado.</label>";
    	mensajesUx(mensajeUx,2,"","EleccionVirtual");
    }else{
	window.open(URL+"/eleccion_virtual/informe?idEleccionVirtual="+eleccionVirtualId+"&empresaId="+getSession("gestopcompanyid"),'_blank');
    }
}

function ocultarModalResultadosEleccionVirtual(){
    $("#modalResultadosEV").modal("hide");
}

function crearModalResultadosEleccionVirtual(){
    
    var estado = hallarEstadoEV(eleccionVirtualId, eleccionVirtualObj.fechaInicio, eleccionVirtualObj.horaInicio, eleccionVirtualObj.fechaFin, eleccionVirtualObj.horaFin);
    
    if(estado==1){
	mensajeUx="<label>No es posible mostrar los resultados porque el evento aún está EN CURSO.</label>";
    	mensajesUx(mensajeUx,2,"","EleccionVirtual");
    }else if(estado==2){
	mensajeUx="<label>No es posible mostrar los resultados porque el evento aún no ha comenzado.</label>";
    	mensajesUx(mensajeUx,2,"","EleccionVirtual");
    }else{
    
    	var listItems=[]

    	var textTablaResultadosEV="";
    
    	listItems.forEach(function(valx,index){
    	    textTablaResultadosEV += obtenerSubPanelModuloVersionDos(valx);
    	})
    
    	var opciones ={
		id:"modalResultadosEV",
		nombre:"Resultados - " + eleccionVirtualObj.descripcion,
		contenido: "<form id='formResultadosEV' class='eventoGeneral'>"+textTablaResultadosEV+"</form>",
		maxWidth:(userAgent==true ? null : "1000px")
    	}
    
    	crearModalPrincipalUsuario(opciones,function(){},true,true);
    
    	var contenidoBody="<tr></tr>";
    	var contenidoHeader="";
    
    	callAjaxPost(URL+"/eleccion_virtual/alternativa", { eleccionVirtual :{idEleccionVirtual : eleccionVirtualId}, isResultados:1 },
	    function(data){
		listFullAlternativaAux = data.list;
		
		var count = 0;
		
		for(var i=0; i<Math.ceil(listFullAlternativaAux.length/4); i++){
			
		    contenidoBody += "<tr>";
			    
		    
		    var indexAux;
		    i == Math.ceil(listFullAlternativaAux.length/4)-1 ? indexAux = listFullAlternativaAux.length - ((i)*4) : indexAux = 4;
			
		    for(var j=0; j<indexAux; j++){ 
			    contenidoBody += "<td>" +
    						"<label style='font-weight:500; margin-left:5px; padding-top:5px'>"+listFullAlternativaAux[count].texto+"</label>"+
    						"<div style='text-align: center;'>" +
    							(listFullAlternativaAux[count].foto!=null?"<img style='width:220px; object-fit:contain;' class='cropGosst' src='data:image/png;base64,"+listFullAlternativaAux[count].foto+"'>":"") +
    						"</div>" +
    						"<label style='font-weight:500; margin-left:5px; max-width:160px; padding-top:10px'><b>Número de votos:</b> "+listFullAlternativaAux[count].numVotos+"</label>"+
    					      "</td>";
			    count++;
		    }
    			
    			contenidoBody += "</tr>";
		}
		    
		    
		contenidoHeader += "<tr>" +
					"<th style='width:235px; text-align:center'></td>" +
					"<th style='width:235px; text-align:center'></td>" +
					"<th style='width:235px; text-align:center'></td>" +
					"<th style='width:235px; text-align:center'></td>" +
				   "</tr>";
		    
		$("#formResultadosEV")
		.html("<table class='table table-user-information' style='margin-bottom:0px'>" +
			"<thead>" +
				"<label style='padding-left:10px; padding-top:5px; font-size:20px'>Resultado al "+obtenerFechaActualNormal()+" "+obtenerHoraActual(1)+"</label>" +
				contenidoHeader +
			"</thead>" +
			"<tbody>" +
				contenidoBody +
			"</tbody>" +
		      "</table>");
		    
    	})
    	
    }	//fin del else
    	
}

function ocultarModalConfiguracionEleccionVirtual(){
    $("#modalConfiguracionEV").modal("hide");
}

function validarNumAlternativasSeleccionables(){
    var numAlternativasSeleccionables = $("#inputNumeroAlternativasSeleccionables").val();
    if(numAlternativasSeleccionables<1 || numAlternativasSeleccionables>(eleccionVirtualObj.numAlternativas>1 ? eleccionVirtualObj.numAlternativas-1 : 1) ){
	$("#advertenciaNumAlt").css("visibility","visible");
	$("#inputNumeroAlternativasSeleccionables").css("color","red");
    }else{
	$("#advertenciaNumAlt").css("visibility","hidden");
	$("#inputNumeroAlternativasSeleccionables").css("color","black");
    }
}

function crearModalConfiguracionEleccionVirtual(){
   var estado = hallarEstadoEV(eleccionVirtualId,eleccionVirtualObj.fechaInicio,eleccionVirtualObj.horaInicio,eleccionVirtualObj.fechaFin,eleccionVirtualObj.horaFin);
   var textAdvertencia = "",styleTextAdvertencia = "",disabled = "";
    
   if(estado == 1 || eleccionVirtualObj.numVotantes > 0){
      textAdvertencia = "<i class='fa fa-info-circle'></i> La configuración no se puede modificar porque el evento ya está EN CURSO.";
      disabled = "disabled";styleTextAdvertencia = "margin-top:0";
   }else if(estado == 0){
      textAdvertencia = "<i class='fa fa-info-circle'></i> La configuración no se puede modificar porque el evento ya está COMPLETADO.";
      disabled = "disabled";styleTextAdvertencia = "margin-top:0";
   }else{
      textAdvertencia = "";disabled = "";styleTextAdvertencia = "margin-top:-35px";
   }
    
   var listItems=[
      {label:"<label style='color:blue'>"+textAdvertencia+"</label>",anchoLabel:"col-sm-12",styleAux:styleTextAdvertencia,inputForm:"",anchoDiv:"",sugerencia:""},
      {label:"Número de alternativas seleccionables<span id='advertenciaNumAlt' style='color:red; visibility:hidden'> (No válido)</span>",anchoLabel:"col-sm-10",styleAux:"display:flex; align-items:center",
       inputForm:"<input type='number' id='inputNumeroAlternativasSeleccionables' value='"+eleccionVirtualObj.numAlternativasSeleccionables+"' min='1' max='"+(eleccionVirtualObj.numAlternativas > 1?eleccionVirtualObj.numAlternativas-1:1) +
       "' style='width:50px; height:32px; text-align-last:center; margin-left:5px' onchange='validarNumAlternativasSeleccionables()' "+disabled+">",anchoDiv:"col-sm-2",sugerencia:""},
      {label:"Permitir voto en blanco",anchoLabel:"col-sm-10",styleAux:"display:flex; align-items:center",
       inputForm:"<input type='checkbox' id='radioBotonPermitirVotoBlanco' onclick='' style='' class='form-control' "+(eleccionVirtualObj.isVotoBlanco == 1?"checked":"")+" "+disabled+">",anchoDiv:"col-sm-2",sugerencia:""},
      {label:"Agregar opción OTROS que le permita al colaborador agregar una SUGERENCIA",anchoLabel:"col-sm-10",styleAux:"margin-bottom:10px; display:flex; align-items:center",
       inputForm:"<input type='checkbox' id='radioBotonPermitirSugerenciaColab' onclick='' style='margin-top:0' class='form-control' "+(eleccionVirtualObj.isSugerencia == 1?"checked":"")+" "+disabled+">",anchoDiv:"col-sm-2",sugerencia:""},
      {label:"Permitir que el colaborador pueda agregar un COMENTARIO junto con su participación",anchoLabel:"col-sm-10",styleAux:"display:flex; align-items:center",
       inputForm:"<input type='checkbox' id='radioBotonPermitirComentarioColab' onclick='' style='margin-top:0' class='form-control' "+(eleccionVirtualObj.isComentario == 1?"checked":"")+" "+disabled+">",anchoDiv:"col-sm-2",sugerencia:""},
      {label:"¿Solicitar la fecha de nacimiento para la confirmación del voto?",anchoLabel:"col-sm-10",styleAux:"display:flex; align-items:center",
       inputForm:"<input type='checkbox' id='radioBotonSolicitarFechaNac' style='margin-top:0' class='form-control' "+(eleccionVirtualObj.isFechaConfirmacion == 1?"checked":"")+" "+disabled+">",anchoDiv:"col-sm-2",sugerencia:""}, 
      {label:"<button id='botonRegresarConfiguracion' type='button' class='btn btn-danger' style='float:right;font-size:18px;' onclick='ocultarModalConfiguracionEleccionVirtual()'>" +
      	        "<i class='fa fa-arrow-left'></i> Regresar" +
      	     "</button>",anchoLabel:"col-sm-6",styleAux:"margin:20px 0 0 0",
       inputForm:"<button id='botonGuardarConfiguracion' type='button' class='btn btn-success' style='font-size:18px;' onclick='guardarConfiguracionEV()' "+disabled+">" +
       		    "<i class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>",anchoDiv:"col-sm-6",sugerencia:""}
   ];

   var textConfiguracionEV = "";
    
   listItems.forEach(function(valx,index){
      textConfiguracionEV += obtenerSubPanelModuloVersionDos(valx);
   });
    
   var opciones ={
      id:"modalConfiguracionEV",nombre:"<i class='fa fa-cog'></i> Configuración - "+eleccionVirtualObj.descripcion,
      contenido: "<form id='formConfiguracionEV' class='eventoGeneral'>"+textConfiguracionEV+"</form>",maxWidth:"600px"
   }
    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
}

function guardarConfiguracionEV(){
   var numAlternativasSeleccionables = $("#inputNumeroAlternativasSeleccionables").val();
   var isVotoBlanco = ($("#radioBotonPermitirVotoBlanco").prop("checked")?1:0);
   var isSugerencia= ($("#radioBotonPermitirSugerenciaColab").prop("checked")?1:0);
   var isComentario = ($("#radioBotonPermitirComentarioColab").prop("checked")?1:0);
   var isFechaConfirmacion = ($("#radioBotonSolicitarFechaNac").prop("checked")?1:0);
    
   if(numAlternativasSeleccionables < 1 || numAlternativasSeleccionables > (eleccionVirtualObj.numAlternativas > 1?eleccionVirtualObj.numAlternativas-1:1)){
      $("#textAdvertencia").css("visibility","visible");
   }else{
      $("#textAdvertencia").css("visibility","hidden");
	
      var dataParams={
	 isConfig:1,idEleccionVirtual:eleccionVirtualId,numAlternativasSeleccionables:numAlternativasSeleccionables,
	 isVotoBlanco:isVotoBlanco,isSugerencia:isSugerencia,isComentario:isComentario,isFechaConfirmacion:isFechaConfirmacion
      };
    	
      eleccionVirtualObj.numAlternativasSeleccionables = numAlternativasSeleccionables;eleccionVirtualObj.isVotoBlanco = isVotoBlanco;
      eleccionVirtualObj.isSugerencia = isSugerencia;eleccionVirtualObj.isComentario = isComentario;eleccionVirtualObj.isFechaConfirmacion = isFechaConfirmacion;
    
      callAjaxPost(URL+"/eleccion_virtual/save",dataParams,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>Se ha guardado correctamente la configuración.</label>";
	       mensajesUx(mensajeUx,1,"","EleccionVirtual"); 
			    
	       break;
			
	    default:
	       mensajeUx = "<label>¡Ocurrió un error al guardar la configuración!</label>";
	       mensajesUx(mensajeUx,2,"","EleccionVirtual");
         }
      });
    
      $("#modalConfiguracionEV").modal("hide");
   }
}

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

function verAutoCompletarTrabEleccionVirtual(){
    var nombre = $("#inputResponsable").val().trim();
    
    if(nombre.length<3){
	nombre=null;
    }
    
    if(nombre == "  "){
       nombre = null
    };
	    
          var dataParam={
        	  trabajadorNombre : "%"+nombre+"%",
        	  empresaId : getSession("gestopcompanyid")
 	  }
 	
          callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,
	  function(data){
          	if(data.trabajadores.length == 0){
              	data.trabajadores.push({
              	    trabajadorId : -1,nombre:"Sin asignar"//,puesto:{positionName:""}
 	    	})
          }
 		
          listTrabajadoresResponsableEleccionVirtual= data.trabajadores;
 		
          crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","verPuestoAcordeTrabajadorInve()", data.trabajadores,
         	                                 "trabajadorId","nombre","#divAutoCompletarTrabEleccionVirtual","");
 	  
          //verPuestoAcordeTrabajadorEleccionVirtual();
 		
          $("#inputResponsable").attr("onkeyup","verAutoCompletarTrabEleccionVirtual()");
       });
   
}

//function verPuestoAcordeTrabajadorEleccionVirtual(){
//	
//    var trabId = parseInt($("#selAutoTrabajador").val());
// 	
//    listTrabajadoresResponsableEleccionVirtual.forEach(
//       function(val){
//          if(val.trabajadorId == trabId){
//             //$("#inputCar").val(val.puesto.positionName)
//          }
//       })
// }

function verEleccionVirtualEnlaceAlternativas(){
    $("#tabEleccionVirtual").hide();
    $("#tabEleccionVirtual .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divAlternativas").show();                                                            //******
	$("#divAlternativas h3")                                                                      //******
	.html("<a onclick='volverDivEleccionVirtual()'> "+eleccionVirtualDescripcion+" </a> " +                             //******
			"    " +                                                                 //******
			"> Alternativas"); 
	
    cargarAlternativas();	
}

function verEleccionVirtualEnlaceExcepciones(){
    cargarModalExcepcionesEV();
    $("#modalExcepcionesTitulo").html(eleccionVirtualDescripcion+" > Excepciones");
}

function verEleccionVirtualEnlaceVotantes(){
    cargarSelOneMenuObligTabVotante(eleccionVirtualObj.tipoEvento,cargarModalVotantesAcordeTabVotante);
    $("#modalVotantesTitulo").html(eleccionVirtualDescripcion+" > Votantes");
}

function verEleccionVirtualEnlaceEvidencias(){
    $("#tabEleccionVirtual").hide();
    $("#tabEleccionVirtual .container-fluid").hide();
    
    $("#divEvidencias").show();
    $("#divEvidencias h3").html("<a onclick='volverDivEleccionVirtual()'>"+eleccionVirtualDescripcion+"</a>"+
	    "    "+"> Evidencias");
    cargarEvidencias();
}

function volverDivEleccionVirtual() {
    $("#divAlternativas").hide();
    $("#divAlternativas .container-fluid").hide();
    $("#divVotantes").hide();
    $("#divVotantes .container-fluid").hide();
    $("#divEvidencias").hide();
    $("#divEvidencias .container-fluid").hide();
    
    $("#tabEleccionVirtual").show();
}

//

function ocultarModalAgregarImagenAuxiliar(){
    $("#modalAgregarImagenAuxiliar").modal("hide");
}

function mostrarModalAgregarImagenAuxiliar(){
    $("#modalAgregarImagenAuxiliar").modal("show");
}

function agregarImagenesAImagenAuxiliar(){
    $("#modalAgregarImagenAuxiliar").modal("show");
    
    var contenido ="";
    
    var listContenido=[
       {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"<label style='padding-top:4px'>Imagen:</label>",inputForm:"",divContainer:"divInputImagenAuxiliar"},
       {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",label:"<label style='padding-top:7px'>Descripción</label>",inputForm:"<textarea style='height:100px; resize:none' type='text' id='inputDescripcion' class='form-control' autocomplete='off'></textarea>"},
       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
       {sugerencia:"",anchoLabel:"",anchoDiv:"",styleAux:"margin-bottom:0",
	    label:"",inputForm:"<button class='btn btn-success' style='float:right;font-size:16px;' type='button' onclick='guardarImagenAuxiliar()'>" +
	                		"<i class='fa fa-download'></i> Guardar" +
       			       "</button>"},
	              	  ];
	    
    listContenido.forEach(function(val){
	contenido += obtenerSubPanelModuloVersionDos(val);
    });
	
    var modalOptions={
	id: "modalAgregarImagenAuxiliar",
	nombre: "Agregar Imagen a Imagen Auxiliar",
	contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
    };
	
    crearModalPrincipalUsuario(modalOptions,function(){
	var options={
		isImage:false,
		container: "#divInputImagenAuxiliar",
		idAux: "ImagenAuxiliar",
		esNuevo: true,
		functionCall: function(){},
		evidenciaNombre: "",
		descargaUrl: ""
	}
	crearFormEvidenciaCompleta(options);
    },false);
    
    $("#modalAgregarImagenAuxiliar").modal("show");
}

function guardarImagenAuxiliar(){
    var descripcion = $("#inputDescripcion").val();
    
    var dataParam={
	    descripcion:descripcion
    }
    
    callAjaxPost(URL+'/contratista/imagen_auxiliar/save',dataParam,function(data){
	switch(data.CODE_RESPONSE){
	    case "05":
		guardarEvidenciaAuto(data.nuevaImagenAuxiliarId,"fileEviImagenAuxiliar",bitsMega*10,
			"/contratista/imagen_auxiliar/foto/save",function(){
		    		console.log("Imagen guardada con id="+data.nuevaImagenAuxiliarId+" y descripcion="+descripcion);
		   		$("#modalAgregarImagenAuxiliar").modal("hide");
		    		mensajeUx="<label>Hecho.</label>";
		    		mensajesUx(mensajeUx,1,"ocultarMensajesUx();mostrarModalAgregarImagenAuxiliar();","ImagenAuxiliar");
		    	});
		break;
		
	    default:
		$("#modalAgregarImagenAuxiliar").modal("hide");
		mensajeUx="<label>Error</label>";
		mensajesUx(mensajeUx,2,"ocultarMensajesUx();mostrarModalAgregarImagenAuxiliar();","Alternativa");
	}
    })
}

function obtenerListaJunta(eleccionVirtualId){
    var dataParam = {
	    empresaId : getSession("gestopcompanyid"),
	    idEleccionVirtual : eleccionVirtualId
    };
	
    callAjaxPost(URL+"/eleccion_virtual/excepcion/trabajadores",dataParam,function(data){
	var listAux = data.list;
	var listFullTrabajadores = [];
	var juntaExiste = false;
		
	if(eleccionVirtualObj.listJuntaId != null){
	    var juntaIdVector = eleccionVirtualObj.listJuntaId.split(",");
	    juntaExiste = true;
	}
	    
	var isSelected = 0;
	    
	if(juntaExiste){
	    listAux.forEach(function(val){
		for(var i=0;i<juntaIdVector.length;i++){
		    if(val.trabajadorId == juntaIdVector[i]){
			isSelected = 1;
			break;
		    }else{
			isSelected = 0;
		    }
		}
		listFullTrabajadores.push(
			{id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", selected:isSelected}
		);
	    })
	}else{
	    listAux.forEach(function(val){
		listFullTrabajadores.push(
			{id:val.trabajadorId, nombre:val.trabajadorNombre + " (" + val.dni + ")", selected:isSelected}
		)
	    })
	}

	crearSelectOneMenuObligMultipleCompleto("slcJuntaEleccionVirtual", "",listFullTrabajadores,"id",
		"nombre","#tdjunta"+eleccionVirtualId,"Trabajadores...");
	})
}