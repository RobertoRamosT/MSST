/**
 * 
 */
var listaId,listaObj;
var banderaEdicion1=false;
var listFullListas,listVigencia,listFullListasSugeridas;

$(function(){
     $("#btnNuevoLista").attr("onclick", "javascript:nuevoLista();");
     $("#btnCancelarLista").attr("onclick", "javascript:cancelarNuevoListaPsico();");
     $("#btnGuardarLista").attr("onclick", "javascript:guardarLista();");
     $("#btnEliminarLista").attr("onclick", "javascript:eliminarLista();");
     $("#btnValorarCategoriasLista").attr("onclick", "javascript:cargarValorizarCategoriasLista();");
     $("#btnValorarPreguntasLista").attr("onclick", "javascript:cargarValorizarPreguntasLista();");
     $("#btnProgramacionesLista").attr("onclick", "javascript:cargarProgramacionesLista();");
     $("#btnVerSugeridos").attr("onclick", "javascript:verListasSugeridas();");
     insertMenu(cargarListasPsicologia);
})
/**
 * 
 */
var listFullValoracionCategorias;

function verValorizarCategoriasLista(){
   $("#divGeneralPsicologia .container-fluid").hide();
   $("#divGeneralPsicologia #divContainValorizarCategorias").show();
   $( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Valorización de categorías");
}

var listFullValoracionPreguntas;

function verValorizarPreguntasLista(){
   $("#divGeneralPsicologia .container-fluid").hide();
   $("#divGeneralPsicologia #divContainValorizarPreguntas").show();
   $( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Valorización de preguntas");
}

function cargarValorizarCategoriasLista(){
   verValorizarCategoriasLista();
   $("#btnGuardarValorizarCategoriasLista").attr("onclick", "javascript:guardarValorizacionCategoriaLista();");
   callAjaxPost(URL + '/psicologia/valorizacion/categorias', 
	       {id: listaObj.id}, 
	            function(data){
		       if(data.CODE_RESPONSE=="05"){ 
			     listFullValoracionCategorias=data.list; 
			     $("#tblValorizarCategorias tbody tr").remove();
			     $("#tblValorizarCategorias thead tr").html("<td></td>");
			     
			     listFullValoracionCategorias.forEach(function(val,index){
				 var escalas=val.escalas;
				 var textValorizacion="";
				 escalas.forEach(function(val1,index1){
				    textValorizacion+=
				       "<td><input class='form-control' id='numberCategInferior"+val1.escala.id+"' type='number' " +
				            "value='"+val1.limiteInferior+"' ></td>"+
				       "<td><input class='form-control' id='numberCategSuperior"+val1.escala.id+"' type='number' " +
					    "value='"+val1.limiteSuperior+"' ></td>"
				    if(index==0){
					  $("#tblValorizarCategorias thead tr").append(
					    "<td class='tb-acc' colspan='2'>"+val1.escala.nombre+"<br>Desde-Hasta</td>"   );
				    }
				 });
				          $("#tblValorizarCategorias tbody").append(
					    "<tr id='trvalc"+val.id+"'>" + 
					         "<td>"+val.nombre+"</td>" + 
						  textValorizacion+
					    "</tr>");
					}); 
				}else{
				     console.log("NOPNPO")
				}
			});
}

function expandirInputObservacion(obj){
   $(obj).css({"min-width":"250px"})
}

function contraerInputObservacion(obj){
   $(obj).css({"min-width":"100%"})
}

function adaptarValorizarPreguntas(obj){
   var texto= $(obj).val();
   
   setTimeout(function () {
      texto=$(obj).val();
      var listFilas = texto.split('\n');
      listFilas.pop();
      var filas=listFullValoracionPreguntas.length;
      var columnas=listFullValoracionPreguntas[0].opciones.length*2;
      var validado="";
      
      if(listFilas.length!=filas){
	    validado="no coincide el numero de filas"+listFilas.length+", "+filas+")"
	}else{
		
	}
      
      listFilas.forEach(function(val,index){
	 var listColumnas = val.split('\t');

	 if(validado.length < 1 &&listColumnas.length!=columnas){
	    validado="No coincide numero de columnas ("+listColumnas.length+", "+columnas+")";
	 }else{
	     for(var index1=0;index1<listColumnas.length;index1=index1+2){
		    listFullValoracionPreguntas[index].opciones[index1/2].valor=listColumnas[index1];
		    listFullValoracionPreguntas[index].opciones[index1/2].observacion=listColumnas[index1+1];
	     };
	 }		
      });
      
      if(validado.length < 1) {
	    verNormalValorizarPreguntas();
      }else{
	  alert(validado);
      }
      
    },500);
}

function verTextAreaValorizarPreguntas(){
   $("#tblValorizarPreguntas tbody tr").remove();
   
   var buttonChangeImport="<button id='btnChangeImport' class='btn btn-success'>" +
	                  "<i class='fa fa-exchange' aria-hidden='true'></i></button>";
   
   $("#tblValorizarPreguntas thead tr").html("<td>"+buttonChangeImport+"</td>");
   $("#btnChangeImport").attr("onclick", "verNormalValorizarPreguntas()");
	
   var textValorizacion="" +
	                "<td rowspan='"+listFullValoracionPreguntas.length+"' " +
	                "colspan='"+(listFullValoracionPreguntas[0].opciones.length*2)+"'><textarea " +
			"onpaste='adaptarValorizarPreguntas(this)' " +
			"style='resize: vertical;' class='form-control'></textarea></td>";
   
   listFullValoracionPreguntas.forEach(function(val,index){
   
      var opciones=val.opciones;
	
      opciones.forEach(function(val1,index1){
		       if(index==0){
			   $("#tblValorizarPreguntas thead tr").append(
			     "<td class='tb-acc' colspan='2'>"+val1.opcion.nombre+"<br>Valor-Observación</td>");
			}
      });
      $("#tblValorizarPreguntas tbody").append(
	     "<tr id='trvalc"+val.id+"'>" + 
	         "<td>"+(index+1)+val.nombre+"</td>"+ 
	     "</tr>" 
      );

   });
      $("#tblValorizarPreguntas tbody tr:first").append(textValorizacion);
}

function verNormalValorizarPreguntas(){
   
    var valorResize= 180;
    resizeDivWrapper("wrapperValorizarPreguntas",valorResize);   
    
    $("#btnGuardarValorizarPreguntaLista").attr("onclick","guardarValorizacionPreguntasLista()");
    
    var buttonChangeImport="<button id='btnChangeImport' class='btn btn-success'>" +
                           "<i class='fa fa-exchange' aria-hidden='true'></i></button>"; 

    $("#tblValorizarPreguntas tbody tr").remove();
    $("#tblValorizarPreguntas thead tr").html("<td>"+buttonChangeImport+"</td>");
    $("#btnChangeImport").attr("onclick", "verTextAreaValorizarPreguntas()");

    listFullValoracionPreguntas.forEach(function(val,index){
       var opciones=val.opciones;
       var textValorizacion="";
       
       opciones.forEach(function(val1,index1){
	  textValorizacion+=
		"<td><input class='form-control' id='numberValorOpcion"+val1.opcion.id+"' type='number' " +
		     "value='"+val1.valor+"'></td>"+
		"<td><input class='form-control' id='inputObsValorOpcion"+val1.opcion.id+"' " +
		      "value='"+val1.observacion+"' onfocus='expandirInputObservacion(this)' onblur='contraerInputObservacion(this)'></td>"
	if(index==0){
		$("#tblValorizarPreguntas thead tr").append(
		       "<td class='tb-acc' colspan='2'>"+val1.opcion.nombre+"<br>Valor-Observación</td>");
	}
   });
       
   $("#tblValorizarPreguntas tbody").append(
	  "<tr id='trvalc"+val.id+"'>" + 
	      "<td >"+(index+1)+val.nombre+"</td>" + 
		 textValorizacion+
	  "</tr>");
   }); 
    
   goheadfixedY("#tblValorizarPreguntas","#wrapperValorizarPreguntas");
    
}

function cargarValorizarPreguntasLista(){
    verValorizarPreguntasLista();
    callAjaxPost(URL + '/psicologia/valorizacion/preguntas', 
		 {id: listaObj.id}, 
		 function(data){
		    if(data.CODE_RESPONSE=="05"){	 
			  listFullValoracionPreguntas=data.list; 
			  verNormalValorizarPreguntas();
		    }else{
		        console.log("NOPNPO")
		    }
		 });
}

function guardarValorizacionCategoriaLista(){
   listFullValoracionCategorias.forEach(function(val,index){
      
      var escalas=val.escalas;
      
      escalas.forEach(function(val1,index1){
		 val1.limiteInferior=$("#trvalc"+val.id).find("#numberCategInferior"+val1.escala.id).val();
		 val1.limiteSuperior=$("#trvalc"+val.id).find("#numberCategSuperior"+val1.escala.id).val();
		 val1.categoria={id:val.id}
      })
		
   });
	
   callAjaxPost(URL + '/psicologia/valorizacion/categorias/save', 
		listFullValoracionCategorias, 
		function(data){
		   alert("Se guardaron las valoraciones");
		   volverListas();
		})
}

function guardarValorizacionPreguntasLista(){
   listFullValoracionPreguntas.forEach(function(val,index){
       
      var opciones=val.opciones;
		
      opciones.forEach(function(val1,index1){
         val1.valor=$("#trvalc"+val.id).find("#numberValorOpcion"+val1.opcion.id).val();
	 val1.observacion=$("#trvalc"+val.id).find("#inputObsValorOpcion"+val1.opcion.id).val();
	 val1.pregunta={id:val.id}
      })		
   });

   callAjaxPost(URL + '/psicologia/valorizacion/preguntas/save', listFullValoracionPreguntas, 
		function(data){
		   alert("Se guardaron las valoraciones");
		   volverListas();
		})
}

function volverListas(){
   $("#divGeneralPsicologia .container-fluid").hide();
   $("#divContainLista").show();
   $( "h2").html("Listas de evaluación");
}

function cargarListasPsicologia() {
    
   var valorResize= 160;
   resizeDivWrapper("wrapperListas",valorResize);
    
   $("#btnCancelarLista").hide();
   $("#btnNuevoLista").show();
   $("#btnEliminarLista").hide();
   $("#btnGuardarLista").hide();
   $("#btnValorarCategoriasLista").hide();
   $("#btnValorarPreguntasLista").hide();
   $("#btnProgramacionesLista").remove();
   volverListas();
	
   callAjaxPost(URL + '/psicologia', 
		{empresaId: getSession("gestopcompanyid")}, 
		function(data){
		   if(data.CODE_RESPONSE=="05"){
			 banderaEdicion1=false;
			 listFullListas=data.list;
			 listFullListasSugeridas=data.sugeridos;
			 listVigencia=data.vigencias;
			 $("#tblListas tbody tr").remove();
			
			 listFullListas.forEach(function(val,index){
			    $("#tblListas tbody").append(
				   "<tr id='trlis"+val.id+"' onclick='editarLista("+index+")'>" +
				       "<td id='lisnom"+val.id+"' style='word-break: break-all;'>"+val.nombre+"</td>" +
				       "<td id='listesc"+val.id+"'>"+val.indicadorEscalas+"</td>" +
				       "<td id='listcat"+val.id+"'>"+val.indicadorCategorias+"</td>" +	
				       "<td id='listpre"+val.id+"'>"+val.indicadorPreguntas+"</td>" +
				       "<td id='listopc"+val.id+"'>"+val.indicadorOpciones+"</td>" +
				       "<td id='listprog"+val.id+"'>"+val.indicadorProgramaciones+"</td>" +			
				       "<td id='listresp"+val.id+"'>"+val.responsable+"</td>" +
				       "<td id='listvig"+val.id+"'>"+val.vigencia.nombre+"</td>" +			 
				   "</tr>");
			});
					
			formatoCeldaSombreableTabla(true,"tblListas");
			completarBarraCarga();
		   }else{
		       console.log("NOPNPO")
		   }
		       goheadfixedY("#tblListas","#wrapperListas");
	        });
}

function editarLista(pindex){ 
   if(!banderaEdicion1){
      formatoCeldaSombreableTabla(false,"tblListas");
      listaId = listFullListas[pindex].id;
      listaObj = listFullListas[pindex];
		
	   var descripcion=listFullListas[pindex].nombre;
	   $("#lisnom" + listaId).html("<input type='text' id='inputNombreLista' class='form-control'>");
	   $("#inputNombreLista").val(descripcion);
	   //
	   var textInfo1=$("#listcat"+listaId).text();
	   $("#listcat"+listaId).addClass("linkGosst")
	   .on("click",function(){cargarCategoriasListaPsicologia();})
	   .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo1);
	   //
	   var textInfo2=$("#listopc"+listaId).text();
	   $("#listopc"+listaId).addClass("linkGosst")
	   .on("click",function(){cargarOpcionesListaPsicologia();})
	   .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo2);
	   //
	   var textInfo4=$("#listpre"+listaId).text();
	   $("#listpre"+listaId).addClass("linkGosst")
	   .on("click",function(){cargarPreguntasListaPsicologia();})
	   .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo4);
	   //
	   var textInfo3=$("#listesc"+listaId).text();
	   $("#listesc"+listaId).addClass("linkGosst")
	   .on("click",function(){cargarEscalasListaPsicologia();})
	   .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfo3);
      //
      var textInfo5=$("#listprog"+listaId).text();
	   
      $("#listprog"+listaId).addClass("linkGosst")
      .on("click",function(){cargarProgrmacionesListaPsicologia();})
      .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true'></i> "+textInfo5);
	   //
	   var responsable=listFullListas[pindex].responsable;
	   $("#listresp" + listaId).html("<input type='text' id='inputResponsableLista' class='form-control'>");
	   $("#inputResponsableLista").val(responsable);
	   //
	   var vigencia=listFullListas[pindex].vigencia.id;
	   var selVigenciaLista=crearSelectOneMenuOblig("selVigenciaLista", "", listVigencia, vigencia,
				"id","nombre");
	   $("#listvig"+listaId).html(selVigenciaLista)
		
	   banderaEdicion1 = true;
	   $("#btnCancelarLista").show();
	   $("#btnNuevoLista").hide();
	   $("#btnEliminarLista").show();
	   $("#btnGuardarLista").show();
	   $("#btnValorarCategoriasLista").show();
	   $("#btnValorarPreguntasLista").show();
	   $("#btnProgramacionesLista").show();
    }
}

function nuevoLista() {
   if(!banderaEdicion1){
	 listaId = 0;
	 var selVigenciaLista=crearSelectOneMenuOblig("selVigenciaLista", "", listVigencia, "",
				"id","nombre");
	 
	 $("#tblListas:first tbody").append(
		"<tr >"				
		   +"<td><input type='text' id='inputNombreLista' class='form-control' autofocus></td>"
		   +"<td>0</td>"
		   +"<td>0</td>"
		   +"<td>0</td>"
		   +"<td>0</td>"+"<td>0</td>"
		   +"<td>"+"<input type='text' id='inputResponsableLista' class='form-control'></td>"
		   +"<td>"+selVigenciaLista+"</td>"
	     + "</tr>");
	
	$("#btnCancelarLista").show();
	$("#btnNuevoLista").hide();
	$("#btnEliminarLista").hide();
	$("#btnGuardarLista").show(); 
	banderaEdicion1 = true;
	formatoCeldaSombreableTabla(false,"tblListas");
   }else{
       alert("Guarde primero.");
   }
}

function cancelarLista() {
   cargarListasPsicologia();
}

function eliminarLista() {
   var r = confirm("¿Está seguro de eliminar la lista?");
      
      if(r == true){
	   var dataParam = {
	        id: listaId,
	   };
		
      callAjaxPost(URL + '/psicologia/delete', dataParam,
		   function(data){
		      switch(data.CODE_RESPONSE){
			 case "05":
			     cargarListasPsicologia();
			     break;
			     
			 default:
			    alert("No se puede eliminar, hay items asociados a esta lista.");
		      }
		   });
      }
}

function guardarLista() {
   var campoVacio = true;
   var descripcion=$("#inputNombreLista").val();  
   var responsable=$("#inputResponsableLista").val();  
   var vigencia=$("#selVigenciaLista").val();

   if(descripcion.length<1){
	 campoVacio = false;
   }

   if(campoVacio){
	 var dataParam = {
		id : listaId,
		nombre:descripcion,
		responsable:responsable,
		vigencia:{id:vigencia},
		empresa:{empresaId:getSession("gestopcompanyid")}
	 };

   callAjaxPost(URL + '/psicologia/save', dataParam,
		function(data){
		    switch (data.CODE_RESPONSE) {
		       case "05":		
			   cargarListasPsicologia();
			   break;
			     
			   default:
		              console.log("Ocurrió un error al guardar la lista!");
		    }
		});	
   }else{
       alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoListaPsico(){
   cargarListasPsicologia();
}
