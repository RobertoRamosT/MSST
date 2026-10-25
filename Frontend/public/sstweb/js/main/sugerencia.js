var sugerenciaId,sugerenciaObj,sugerenciaNombre;
var banderaEdicion11=false;
var listFullSugerencia,listFiltroSugerencia;
var listMotivoSugerencia;
var listModulosSugerencia;
var toggleFiltroEstado=false;
var listEstadoSug=[{id:1,nombre:"Por implementar"},{id:2,nombre:"Completado"},{id:3,nombre:"Retrasado"}];
var arrayFiltroEstadoSug=[];
$(function(){
	$("#btnNuevoSugerencia").attr("onclick", "javascript:nuevoSugerencia();");
	$("#btnCancelarSugerencia").attr("onclick", "javascript:cancelarNuevoSugerencia();");
	$("#btnGuardarSugerencia").attr("onclick", "javascript:guardarSugerencia();");
	$("#btnEliminarSugerencia").attr("onclick", "javascript:eliminarSugerencia();");
	resizeDivGosst("wrapperSug");
	insertMenu();
	
	cargarSugerencias();
})
/**
 * 
 */
function volverSugerencias(){
	$("#divSugerenciasGosst").show();
	$("#divSugerenciasGosst .container-fluid").hide();
	$("#divContainSugerencia").show();
	$("#divSugerenciasGosst").find("h2").html("Mis Solicitudes Gosst");
}
function cargarSugerencias() {
    
    var valorResize= 160;
    resizeDivWrapper("wrapperSug",valorResize);

	$("#btnCancelarSugerencia").hide();
	$("#btnNuevoSugerencia").show();
	$("#btnEliminarSugerencia").hide();
	$("#btnGuardarSugerencia").hide();
	volverSugerencias();
	callAjaxPost(URL + '/scheduler/sugerencias', 
			{  }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion11=false;
				 listFullSugerencia=data.list;
				 listMotivoSugerencia=data.motivos;
				 listModulosSugerencia=data.modulos;
					$("#tblSugerencia tbody tr").remove();
					listFullSugerencia.forEach(function(val,index){
						
						$("#tblSugerencia tbody").append(
								"<tr id='trsolo"+val.id+"' onclick='editarSugerencia("+index+")'>" 
								+"<td id='solfec"+val.id+"'>"+val.fechaSolicitudTexto+"</td>"  
								+"<td id='solmot"+val.id+"'>"+val.motivo.nombre+"</td>" 
								+"<td id='solmod"+val.id+"'>"+val.modulosNombre+"</td>" 
								+"<td id='soldes"+val.id+"'>"+val.descripcion+"</td>" 
								+"<td id='solevi"+val.id+"'>"+val.evidenciaNombre+"</td>" 
								+"<td id='solfecp"+val.id+"' style='border-left: 5px solid darkcyan;'>"+val.fechaPlanificadaTexto+"</td>" 
								+"<td id='solfr"+val.id+"'>"+val.fechaRealTexto+"</td>" 
								+"<td id='solest"+val.id+"'>"+val.estado.nombre+"</td>" 
								+"<td id='solobs"+val.id+"'>"+val.observaciones+"</td>"  
								+"<td id='solclas"+val.id+"' style='border-left: 5px solid darkcyan;'>"
								+(val.notaTiempo==null?"Sin calificar":val.notaTiempo)+"</td>"  
								+"</tr>");
					});
					goheadfixedY("#tblSugerencia","#wrapperSug")
					arrayFiltroEstadoSug=listarStringsDesdeArray(listEstadoSug, "id");
					
					agregarFiltroGosst("filtroEstadoSug","opcionesFiltroEstadoSuge",listEstadoSug,"id","nombre",
							toggleFiltroEstado,arrayFiltroEstadoSug,function(lista){
						arrayFiltroEstadoSug=lista;
						listFiltroSugerencia=filtrarListSugerencias();
						cargarFiltroSugerencias();

					},true);
					callAjaxPost(URL + '/scheduler/sugerencias/vistas', 
							{  },function(){
								$("#alertaSolicitud").remove();
								
								
							});
					
					completarBarraCarga();
					formatoCeldaSombreableTabla(true,"tblSugerencia");
				}else{
					console.log("NOPNPO")
				}
			});

	
}
function cargarFiltroSugerencias(){
	$("#tblSugerencia tbody tr").remove();
	listFiltroSugerencia.forEach(function(val,index){
		
		$("#tblSugerencia tbody").append(
				"<tr id='trsolo"+val.id+"' onclick='editarSugerencia("+index+")'>" 
				+"<td id='solfec"+val.id+"'>"+val.fechaSolicitudTexto+"</td>"  
				+"<td id='solmot"+val.id+"'>"+val.motivo.nombre+"</td>" 
				+"<td id='solmod"+val.id+"'>"+val.modulosNombre+"</td>" 
				+"<td id='soldes"+val.id+"'>"+val.descripcion+"</td>" 
				+"<td id='solevi"+val.id+"'>"+val.evidenciaNombre+"</td>" 
				+"<td id='solfecp"+val.id+"' style='border-left: 5px solid darkcyan;'>"+val.fechaPlanificadaTexto+"</td>" 
				+"<td id='solfr"+val.id+"'>"+val.fechaRealTexto+"</td>" 
				+"<td id='solest"+val.id+"'>"+val.estado.nombre+"</td>" 
				+"<td id='solobs"+val.id+"'>"+val.observaciones+"</td>"  
				+"<td id='solclas"+val.id+"' style='border-left: 5px solid darkcyan;'>"
				+(val.notaTiempo==null?"Sin calificar":val.notaTiempo)+"</td>"  
				+"</tr>");
	});
}
function filtrarListSugerencias(){ 
	 var listReturn=[];
listReturn=listFullSugerencia.filter(function(val,index){
			if( arrayFiltroEstadoSug.indexOf(parseInt(val.estado.id))!=-1 ){
				return true;
			}else{ 
				return false;
			}
		});
	return listReturn;
} 
function editarSugerencia(pindex) {

   if(!banderaEdicion11){
      formatoCeldaSombreableTabla(false,"tblSugerencia");
      sugerenciaId = listFullSugerencia[pindex].id;
      sugerenciaObj=listFullSugerencia[pindex];
		 
      var motivo=sugerenciaObj.motivo.id;
      var slcMotivoSugerencia=crearSelectOneMenuOblig("slcMotivoSugerencia", "",
				listMotivoSugerencia, motivo, "id", "nombre");
      $("#solmot" + sugerenciaId).html(slcMotivoSugerencia );
      //
      var modulos=sugerenciaObj.modulosId;
      var idsModulos=modulos.split(",");
		
      idsModulos.forEach(function(val,index){
	 listModulosSugerencia.forEach(function(val1,index1){
	    if(val==val1.id){
	       val1.selected=1;
	    }
	 })	
      })
		
      var slcModulosSugerencia=crearSelectOneMenuObligMultiple("slcModulosSugerencia", "verIdsmodulos()",
				listModulosSugerencia,  "id", "nombre");
	
      $("#solmod" + sugerenciaId).html(slcModulosSugerencia ); 
      $("#slcModulosSugerencia").chosen({no_results_text: "No se encontró el módulo"}); 
      //
      var descripcion=sugerenciaObj.descripcion;
      $("#soldes" + sugerenciaId).html("<textarea rows='7' id='inputDescSugerencia' class='form-control'></textarea>");
      $("#inputDescSugerencia").val(descripcion);
      //
      var options=
	      {container:"#solevi"+sugerenciaId,
	       functionCall:function(){guardarSugerencia()},
	       descargaUrl: "/scheduler/sugerencia/evidencia?id="+ sugerenciaId,
	       esNuevo:false,
	       idAux:"Sugerencia"+sugerenciaId,
	       evidenciaNombre:sugerenciaObj.evidenciaNombre};
		
      crearFormEvidenciaCompleta(options);
      //
      var textInfo=$("#solclas"+sugerenciaId).text();
		
      if(sugerenciaObj.estado.id==2){
         $("#solclas"+sugerenciaId).addClass("linkGosst").on("click",function(){verClasificacionSugerencia();})
	    .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo);
      }else{
			
      }
      //
      var notaResuelve=sugerenciaObj.notaResuelve;
      var listResuelveSugerencia=[{id:"1",nombre:"Si"},{id:"0",nombre:"No"}]
      var slcResuelveSugerencia=crearSelectOneMenuOblig("slcResuelveSugerencia", "",
				listResuelveSugerencia, notaResuelve, "id", "nombre");
		
      $("#tdResuelveSug").html(slcResuelveSugerencia);
      //
      var notaTiempo=sugerenciaObj.notaTiempo;
      var textRatingPersonal="";
      
      for(var i=0;i<5;i++){
	 if(i<notaTiempo){
	    textRatingPersonal+="<i class='fa fa-star fa-2x ' id='ratingGosst"+(i+1)+"'></i>";
	 }else{
	    textRatingPersonal+="<i class='fa fa-star-o fa-2x ' id='ratingGosst"+(i+1)+"'></i>";
	 }	
      }
		
      $("#tdTiempoSug").html(textRatingPersonal);
      $("#tdTiempoSug i").hover(
	   function(){
	      $(this).nextAll("i").removeClass("fa-star").addClass("fa-star-o");
	      $(this).prevAll("i").removeClass("fa-star").addClass("fa-star-o");
	      $(this).removeClass("fa-star").addClass("fa-star-o");	
	      $(this).prevAll("i").addClass("fa-star").removeClass("fa-star-o");
	      $(this).nextAll("i").addClass("fa-star-o").removeClass("fa-star");
	      $(this).addClass("fa-star");
	      $(this).removeClass("fa-star-o");	
		     });
      //
      var comentario=sugerenciaObj.comentario;
		
      $("#tdComentSug").html("<input id='inputComentSugerencia' class='form-control'>");
      $("#inputComentSugerencia").val(comentario);
      //
      banderaEdicion11 = true;
      $("#btnCancelarSugerencia").show();
      $("#btnNuevoSugerencia").hide();
      $("#btnEliminarSugerencia").show();
      $("#btnGuardarSugerencia").show();
      $("#btnGenReporte").hide();
   }
}

function verIdsmodulos(){
   console.log($("#slcModulosSugerencia").val());
}

function nuevoSugerencia(){
	
   if(!banderaEdicion11){
      sugerenciaId = 0;
      var slcMotivoSugerencia=crearSelectOneMenuOblig("slcMotivoSugerencia", "",
				listMotivoSugerencia, "", "id", "nombre");
      var slcModulosSugerencia=crearSelectOneMenuObligMultiple("slcModulosSugerencia", "verIdsmodulos()",
				listModulosSugerencia,  "id", "nombre");
		
      $("#tblSugerencia tbody")
         .prepend("<tr>"
		    +"<td>"+obtenerFechaActualNoUTC()+"</td>" 
		    +"<td>"+slcMotivoSugerencia+"</td>"
		    +"<td>"+slcModulosSugerencia+"</td>"
		    +"<td>"+ "<textarea rows='7' id='inputDescSugerencia' class='form-control'></textarea>"+"</td>" 
		    +"<td id='solevi0'>0</td>"
		    +"<td>"+"..."+"</td>"
		    +"<td>"+"..."+"</td>"
		    +"<td>"+"..."+"</td>"
		    +"<td>"+"..."+"</td>"
		    +"<td>"+"..."+"</td>"
		 +"</tr>");
      $("#slcModulosSugerencia").chosen({no_results_text: "No se encontró el módulo"}); 
      // 
      //
      var options=
	     {container:"#solevi"+sugerenciaId,
	      functionCall:function(){ },
	      descargaUrl: "",
	      esNuevo:true,
	      idAux:"Sugerencia"+sugerenciaId,
	      evidenciaNombre:""};
		
      crearFormEvidenciaCompleta(options);
		
      $("#btnCancelarSugerencia").show();
      $("#btnNuevoSugerencia").hide();
      $("#btnEliminarSugerencia").hide();
      $("#btnGuardarSugerencia").show(); 
      banderaEdicion11 = true;
      formatoCeldaSombreableTabla(false,"tblSugerencia");
   }else{
      alert("Guarde primero.");
   }
}

function cancelarSugerencia() {
   cargarSugerencias();
}

function eliminarSugerencia() {
   var r = confirm("¿Está seguro de eliminar la Sugerencia");
   if(r == true){
      var dataParam={
	      id : sugerenciaId,
		    };
      
      callAjaxPost(URL + '/scheduler/sugerencia/delete', dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
	          cargarSugerencias();
	          break;
	       default:
		  alert("Hay módulos asociados, elimínelos primero");
	    }
         });
   }
}

function guardarSugerencia() {

   var campoVacio = true;
   var fecha=obtenerFechaActual();   
   var motivo=$("#slcMotivoSugerencia").val();
   var modulosId=$("#slcModulosSugerencia").val();
   var modulosFinal=[];

   if(modulosId != null){
      modulosId.forEach(function(val,index){
         modulosFinal.push({id:val});
      });    
   }
   
   if(modulosFinal.length == 0){
      alert("Módulos obligatorios"); return;
   }
   
   var comentario=$("#inputComentSugerencia").val();
   var notaResuelve=$("#slcResuelveSugerencia").val();
   var notaTiempo=0;

   $("#tdTiempoSug i").each(function(index,elem){
        if($(elem).hasClass("fa-star")){
           notaTiempo++;
        }
   });
	
   var descripcion=$("#inputDescSugerencia").val();
	 
   if(campoVacio){
      var dataParam = {
	      id : sugerenciaId,
	      empresa:{empresaId:getSession("gestopcompanyid")},
	      motivo:{id:motivo},
	      modulos:modulosFinal,
	      descripcion:descripcion,
	      comentario:comentario,
	      notaTiempo:notaTiempo,
	      notaResuelve:notaResuelve
		      };

      callAjaxPost(URL + '/scheduler/sugerencia/save', dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		  guardarEvidenciaAuto(data.nuevoId,"fileEviSugerencia"+sugerenciaId
				       ,bitsEvidenciaAccionMejora,"/scheduler/sugerencia/evidencia/save",
				       cargarSugerencias); 
							 
	          break;
	       default:
		   console.log("Ocurrió un error al guardar el sugerencia!");
	    }
	 },null,null,null,null,false);
			
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}
 
function verClasificacionSugerencia(){
   $("#divSugerenciasGosst .container-fluid").hide();
   $("#divContainCalificacion").show();
   $("#divSugerenciasGosst").find("h2")
   .html("<a onclick='volverSugerencias()'>Solicitud "+sugerenciaObj.descripcion+"</a> > Calificación");
}

function cancelarNuevoSugerencia(){
   cargarSugerencias();
}
