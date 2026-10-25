var banderaedicion15;
var eventoAccidId;var eventoAccidObj;

var eventoTipoId;
var eventoNombre;

var listeventos;

var isFallo;

var listFullEventosAccidente;

var listCausasRelacionadas=[];

function cargarModalEditarEventoInseguro(tipoId){
    
   tipoId = parseInt(tipoId);
    
   var contenidoEvento ="<button id='btnCancelarEvento' type='button' class='btn btn-success' "
		               +"title='Cancelar'>"
		          +"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
		       +"</button>"
		       +"<button id='btnAgregarEvento' type='button' class='btn btn-success' "
		               +"title='Agregar '> "
		          +"<i class='fa fa-file-o fa-2x'></i> "
		       +"</button> "
		       +"<button id='btnGuardarEvento' type='button' class='btn btn-success'" 
		               +"title='Guardar'>"
		          +"<i class='fa fa-floppy-o fa-2x'></i>"
		       +"</button>"
		       +"<button id='btnEliminarEvento' type='button' class='btn btn-danger' "
		               +"title='Eliminar'> "
		          +"<i class='fa fa-times fa-2x'></i> "
		       +"</button>" +
		        "<div class='wrapper'> "
		          +"<table class='table table-striped table-bordered table-hover table-fixed' " 
		                 +"id='tblEventAcc'>"
		             +"<thead>"
		                +"<tr>"
	                           +"<th class='tb-acc' style='width : 220px'>Tipo</th>"
	                           +"<th class='tb-acc' style='width : 220px'>Causa inmediata</th>"
	                           +"<th class='tb-acc' style='width : 220px'>Detalle</th>"
	                        +"</tr>"
	                     +"</thead>"
	                     +"<tbody>"
	                        +"<tr>"
	                        +"</tr>"
	                     +"</tbody>"
	                  +"</table>"+
			"</div>";
   
   var contenidoCausaBasica ="<button id='btnCancelarCausaBasica' type='button' class='btn btn-success' "
		                    +"title='Cancelar'>"
		               +"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
		            +"</button>"
		            +"<button id='btnAgregarCausaBasica' type='button' class='btn btn-success' "
		                    +"title='Agregar '> "
		               +"<i class='fa fa-file-o fa-2x'></i> "
		            +"</button> "
		            +"<button id='btnGuardarCausaBasica' type='button' class='btn btn-success'" 
		                    +"title='Guardar'>"
		               +"<i class='fa fa-floppy-o fa-2x'></i>"
		            +"</button>"
		            +"<button id='btnEliminarCausaBasica' type='button' class='btn btn-danger' "
		                    +"title='Eliminar'> "
		               +"<i class='fa fa-times fa-2x'></i> "
		            +"</button>" +
			     "<div class='wrapper'> "
		               +"<table class='table table-striped table-bordered table-hover table-fixed' " 
		                      +"id='tblCausaBasica'>"
		                  +"<thead>"
		                     +"<tr>"
	                                +"<th class='tb-acc' style='width : 220px'>Tipo</th>"
	                                +"<th class='tb-acc' style='width : 220px'>Categoría</th>"
	                                +"<th class='tb-acc' style='width : 220px'>Sub categoría</th>"
	                                +"<th class='tb-acc' style='width : 220px'>Detalle</th>"
	                             +"</tr>"
	                          +"</thead>"
	                          +"<tbody>"
	                             +"<tr>"
	                             +"</tr>"
	                          +"</tbody>"
	                       +"</table>" +
			     "</div>";
   
    var contenidoFallo ="<button id='btnCancelarFallo' type='button' class='btn btn-success' "
		               +"title='Cancelar'>"
		          +"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
		       +"</button>"
	 	       +"<button id='btnAgregarFallo' type='button' class='btn btn-success' "
		               +"title='Agregar'> "
		          +"<i class='fa fa-file-o fa-2x'></i> "
		       +"</button> "
		       +"<button id='btnGuardarFallo' type='button' class='btn btn-success'" 
		               +"title='Guardar'>"
		          +"<i class='fa fa-floppy-o fa-2x'></i>"
		       +"</button>"
		       +"<button id='btnEliminarFallo' type='button' class='btn btn-danger' "
		               +"title='Eliminar'> "
		          +"<i class='fa fa-times fa-2x'></i> "
		       +"</button>" +
			"<div class='wrapper'> "
		          +"<table class='table table-striped table-bordered table-hover table-fixed' " 
		          	 +"id='tblFalloSST'>"
		             +"<thead>"
		                +"<tr>"
	                           +"<th class='tb-acc' style='width : 220px'>Fallo en el sistema de gestión</th>"
	                           +"<th class='tb-acc' style='width : 220px'>Descripción de fallos a nivel de Sistema de Gestión</th>"
	                        +"</tr>"
	                     +"</thead>"
	                     +"<tbody>"
	                        +"<tr>"
	                        +"</tr>"
	                     +"</tbody>"
	                  +"</table>" +
			"</div>";
    
   var tituloFinal ="";
   var contenidoFinal = "";
   
   switch(tipoId){
      case 1:
	  tituloFinal ="Causas inmediatas (A/C subestándar)";
	  contenidoFinal = contenidoEvento;
	  break;
	  
      case 2:
	  tituloFinal ="Causas básicas";
	  contenidoFinal = contenidoCausaBasica;
	  
	  if(numCausasInmediatas == 0){
	     alert("Ingresar causas inmediatas primero!"); return;
	  }
	  break;
	  
      case 3:
	  tituloFinal ="Fallo en sistema de Gestión";
	  contenidoFinal = contenidoFallo;
	  break;
   }
	    
   var modalOptions = {id:"conted",nombre:tituloFinal,contenido:contenidoFinal,maxWidth:"99%"};
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
	    
   $("#btnAgregarCausaBasica").attr("onclick", "javascript:nuevoCausaBasica();");
   $("#btnCancelarCausaBasica").attr("onclick", "javascript:cancelarEventoAcc();");
   $("#btnGuardarCausaBasica").attr("onclick", "javascript:guardarEventoAcc();");
   $("#btnEliminarCausaBasica").attr("onclick", "javascript:eliminarEventoAcc();");
		
   $("#btnAgregarEvento").attr("onclick", "javascript:nuevoEventoAcc();");
   $("#btnCancelarEvento").attr("onclick", "javascript:cancelarEventoAcc();");
   $("#btnGuardarEvento").attr("onclick", "javascript:guardarEventoAcc();");
   $("#btnEliminarEvento").attr("onclick", "javascript:eliminarEventoAcc();");
   isFallo=false;
		
   $("#btnAgregarFallo").attr("onclick", "javascript:nuevoFallo();");
   $("#btnCancelarFallo").attr("onclick", "javascript:cancelarEventoAcc();");
   $("#btnGuardarFallo").attr("onclick", "javascript:guardarEventoAcc();");
   $("#btnEliminarFallo").attr("onclick", "javascript:eliminarEventoAcc();");
				
   traerDatosEventosAcc();
}

function traerDatosEventosAcc(){
	banderaedicion15=false;
	var dataParam = {
		accidenteId : accidenteId
    };

	$("#btnCancelarCausaBasica").hide();
	$("#btnAgregarCausaBasica").show();
	$("#btnEliminarCausaBasica").hide();
	$("#btnGuardarCausaBasica").hide();

	$("#btnCancelarEvento").hide();
	$("#btnAgregarEvento").show();
	$("#btnEliminarEvento").hide();
	$("#btnGuardarEvento").hide();
	
	$("#btnCancelarFallo").hide();
	$("#btnAgregarFallo").show();
	$("#btnEliminarFallo").hide();
	$("#btnGuardarFallo").hide();
    callAjaxPost(URL + '/accidente/eventacc', dataParam, function(data) {
        procesarDateEventosAcc(data);
    });
}
function cargarEventosAcc(){	
	banderaedicion15=false;
	 eventoAccidId=0;
	 eventoAccidObj = {id : 0, causa : {id:0}, subSubTipoEvento : {id:0}}
	 eventoNombre="";
	 eventoTipoId=0;

	var dataParam = {
		accidenteId : accidenteId
	};
	callAjaxPost(URL + '/accidente/eventacc', dataParam, function(data) {
	    procesarDateEventosAcc(data);
	});
}
var numCausasInmediatas = 0;
function procesarDateEventosAcc(data) {
	switch (data.CODE_RESPONSE) {
	case "05":

		 $("#tblEventAcc tbody tr").remove();
		 $("#tblFalloSST tbody tr").remove();
		 $("#tblCausaBasica tbody tr").remove();
		 
		 $("#tblEventAccTexto tbody tr").remove();
		 $("#tblFalloSSTTexto tbody tr").remove();
		 $("#tblCausaBasicaTexto tbody tr").remove();
		var list = data.list;
		listFullEventosAccidente=list;
		
		listCausasRelacionadas=[];
		numCausasInmediatas = 0;
		listFullEventosAccidente.forEach(function(val,index){

			var tipoEvento=val.eventoTipoNombre;
			var nombreEvento=val.eventoNombre;
			
				switch(val.eventoTipoId){
				case 1:
				case 2:
				    numCausasInmediatas++;
					 $("#tblEventAcc tbody").append(
							 " <tr onclick='editarEventoAcc(" 
								+index
							 + " )'>" 
							 +	 "<th id='sel"+val.eventoInseguroAccidenteId+"'>"+ tipoEvento+"</th> " 
							 +	 "<th id='tdSubTipoEve"+val.eventoInseguroAccidenteId+"'>"+ val.causa.nombre+"</th> " 
							  +" <th id='thnombre"+val.eventoInseguroAccidenteId+"'>"+ nombreEvento+"</th> </tr>  "
							 
					 );
					 $("#tblEventAccTexto tbody").append(
						 "<tr>" 
						 +"<th style='text-align:center;'>"+ tipoEvento+"</th> " 
						 +"<th>"+ val.causa.nombre+"</th> " 
						 +"<th>"+ nombreEvento+"</th> </tr>  "
						 
				 );
					 listCausasRelacionadas.push({nombre:nombreEvento,id:0});
					break;
				 
				case 3:
				case 4:
					 $("#tblCausaBasica tbody").append(
						 " <tr onclick='editarEventoAcc(" 
							+index
							 + ")'>" 
							 +	 "<th id='sel"+val.eventoInseguroAccidenteId+"'>"+ tipoEvento+"</th> " 
							 +	 "<th id='thsubtipo"+val.eventoInseguroAccidenteId+"'>"+ val.subTipoEventoNombre+"</th> " 
							 +" <th id='thsubcat"+val.eventoInseguroAccidenteId+"'>"+ val.subSubTipoEvento.nombre+"</th> " 
							+ "<th id='thnombre"+val.eventoInseguroAccidenteId+"'>"+  nombreEvento+"</th> "
							 		+"" +
							 		"</tr>  "
						 
				 );
					 $("#tblCausaBasicaTexto tbody").append(
						 " <tr >" 
							 +	 "<th >"+ tipoEvento+"</th> " 
							 +	 "<th  >"+ val.subTipoEventoNombre+"</th> " 
							 +" <th  >"+ val.subSubTipoEvento.nombre+"</th> " 
							+ "<th >"+  nombreEvento+"</th> "
							 		+"" +
							 		"</tr>  "
						 
				 );
					break; 
				case 5:
					 $("#tblFalloSST tbody").append(
						 " <tr onclick='editarEventoAcc("+index+ ")'>" 
						 +	 "<th id='tdSubTipoEve"+val.eventoInseguroAccidenteId+"'>"
						 + val.causa.nombre+"</th> " 
							 +" <th id='thnombre"+val.eventoInseguroAccidenteId+"'>"
							 + nombreEvento+"</th> " +
							 		"</tr>  "
						 
				 );
					 $("#tblFalloSSTTexto tbody").append(
						 " <tr >" 
						 + "<th  >"+ val.causa.nombre+"</th> " 
						+" <th >"+ nombreEvento+"</th> " +
						"</tr>  "
						 
				 );
					break;
				}
		});
		 
		
		
		break;
	default:
		alert("Ocurrió un error al traer las programaciones!");
	}
 
}

function editarEventoAcc(pindex) {
	if (!banderaedicion15) {
		eventoAccidObj = listFullEventosAccidente[pindex];
		 eventoAccidId=listFullEventosAccidente[pindex].eventoInseguroAccidenteId;
		 eventoNombre=listFullEventosAccidente[pindex].eventoNombre;
		 eventoTipoId=listFullEventosAccidente[pindex].eventoTipoId;
var subTipoEventoId=listFullEventosAccidente[pindex].subTipoEventoId;
		switch(eventoTipoId){
		case 1:
		case 2:
			
			$("#sel" + eventoAccidId)
			.html("<select id='listTipoEvento' onchange='verCausasAcordeTipoEvento()' class='form-control'>"
					+"<option value='1'>Acto Subestándar</option>"
					+"<option value='2'>Condicion Subestándar</option>"
					+"</select>");
			$("#listTipoEvento").val(eventoTipoId);
			
			verCausasAcordeTipoEvento();
			$("#thnombre" + eventoAccidId).html(
						"<input id='invEventoInseguro' class='form-control'>");
			nombrarInput("invEventoInseguro",eventoNombre);
				
				banderaedicion15 = true;
				$("#btnCancelarEvento").show();
				$("#btnAgregarEvento").hide();
				$("#btnEliminarEvento").show();
				
				$("#btnGuardarEvento").show();
			break; 
		case 3:
		case 4:
			$("#sel" + eventoAccidId)
			.html("<select id='listTipoEvento' onchange='verSubTipoAcordeTipo()' class='form-control'>"
					+"<option value='3'>Factores de trabajo</option>"
					+"<option value='4'>Factores personales</option>"
					+"</select>");
			var selSubTipoEvento = crearSelectOneMenuY("selSubTipoEvento", "verSubSubTipoAcordeSubTipo()", subTiposEventos,
					subTipoEventoId, "subTipoEventoId","eventoAccidenteTipoId", "subTipoEventoNombre");
			$("#thsubtipo" + eventoAccidId)
			.html(selSubTipoEvento);
				
			$("#thnombre" + eventoAccidId)
				.html("<input type='text'  id='invEventoInseguro' class='form-control'>");
				
				$('#listTipoEvento > option[value="'+eventoTipoId+'"]').attr('selected', 'selected');
				nombrarInput("invEventoInseguro",eventoNombre);
				
				verSubTipoAcordeTipo();
				verSubSubTipoAcordeSubTipo(1);
				banderaedicion15 = true;
				$("#btnCancelarCausaBasica").show();
				$("#btnAgregarCausaBasica").hide();
				$("#btnEliminarCausaBasica").show();
				
				$("#btnGuardarCausaBasica").show();
			break;
		case 5:
		
			isFallo=true;
				$("#thnombre" + eventoAccidId)
				.html("<input type='text' class='form-control' id='invEventoInseguro'>");
				$("#invEventoInseguro").val(eventoNombre);
				verCausasAcordeTipoEvento();
				
			
				banderaedicion15 = true;
				$("#btnCancelarFallo").show();
				$("#btnAgregarFallo").hide();
				$("#btnEliminarFallo").show();
				$("#btnGuardarFallo").show();
			break;
		} 
	}
}
function cancelarEventoAcc(){
    traerDatosEventosAcc();
}
function guardarEventoAcc() {

	var campoVacio = true;
	eventoNombre=$("#invEventoInseguro").val();
	if(isFallo){
		eventoTipoId=5;
	}else{
		eventoTipoId=$("#listTipoEvento").val();
	}
		
var subTipo=$("#selSubTipoEvento").val();
var causaId = $("#selCausaEvento").val();
var subSubTipoEvento = $("#selSubSubTipoEvento").val();
	obtenerIdEvento();
	if (campoVacio) {

		var dataParam = {
			accidenteId: accidenteId,
			subSubTipoEvento : {id : subSubTipoEvento},
			eventoInseguroAccidenteId : eventoAccidId,
			eventoTipoId: eventoTipoId,
			eventoNombre: eventoNombre,
			subTipoEventoId:subTipo,
			causa : {id : causaId}
			
			
		};

		callAjaxPost(URL + '/accidente/eventacc/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    traerDatosEventosAcc();
						break;
					default:
						alert("Ocurrió un error al guardar el evento!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
function eliminarEventoAcc(){
	var r = confirm("¿Está seguro de eliminar?");
	if (r == true) {
		var dataParam = {
				eventoInseguroAccidenteId : eventoAccidId
		};

		callAjaxPost(URL + '/accidente/eventacc/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    traerDatosEventosAcc();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}
function verCausasAcordeTipoEvento(){
	var listaCausas=[];
	var subTipoAcc=$("#selAccSub").val().split('-');
	var tipoAux=$("#listTipoEvento").val();
	if(isFallo){tipoAux = 5};
var aux1=subTipoAcc[0];
	causasSugeridas.forEach(function(val,index){
		if(val.eventoTipoId==parseInt(tipoAux) && val.subTipoAccId==parseInt(aux1))
		listaCausas.push(val);
		
	});
	var selCausaEvento = crearSelectOneMenuOblig("selCausaEvento", "", listaCausas,
			eventoAccidObj.causa.id,"id","nombre");
	$("#tdSubTipoEve"+eventoAccidId).html(selCausaEvento);
}
function nuevoEventoAcc(){
	 banderaedicion15=false;
	if (!banderaedicion15) {
		 
		$("#tblEventAcc tbody")
				.prepend(
						"<tr id='0'>"
						+"<th><select id='listTipoEvento' onchange='verCausasAcordeTipoEvento()' class='form-control'>"
						+"<option value='1'>Acto Subestándar</option>"
						+"<option value='2'>Condicion Subestándar</option>"
						+"</select></th>"
						+"<th id='tdSubTipoEve0'></th>"
						+"<th><input id='invEventoInseguro' class='form-control'></th>"
						+ "</tr>");
		eventoAccidId = 0;
		verCausasAcordeTipoEvento();
		$("#btnCancelarEvento").show();
		$("#btnAgregarEvento").hide();
		$("#btnEliminarEvento").hide();
		$("#btnGuardarEvento").show();
		
		banderaedicion15 = true;
	} else {
		alert("Guarde primero.");
	};
}
function verSubSubTipoAcordeSubTipo(idFinal){
	 
	var subTipoAcc=$("#selSubTipoEvento").val();
	
	if(idFinal==null){
		$("#invEventoInseguro").val("");
	}
	var selSubSubTipoEvento = crearSelectOneMenuOblig("selSubSubTipoEvento", "", subSubTiposSugeridos.filter(function(val){
		return (val.subTipoEventoId==parseInt(subTipoAcc) );
	}),
	eventoAccidObj.subSubTipoEvento.id, "subSubTipoEventoId", "subSubTipoEventoNombre");
	$("#thsubcat"+eventoAccidId).html(selSubSubTipoEvento);
	
}
function verSubTipoAcordeTipo(){
	var tipoEvento=$("#listTipoEvento").val();

	listCausasRelacionadas.forEach(function(val,index){
		causasSugeridas.forEach(function(val1,index1){
			if(val.nombre==val1.casuaNombre){
				val.id=val1.causaId;
				return false;
			}
		})
	});
	var listSubTiposId=[];
	var subTiposEventosAux = [];
	subTiposEventos.forEach(function(val,index){
		
		listCausasRelacionadas.forEach(function(val1,index1){
			if(val.eventoAccidenteTipoId==parseInt(tipoEvento) 
					&& val.causasRelacionadas.indexOf(val1.id)!=-1
					&& listSubTiposId.indexOf(val.subTipoEventoId)==-1){
			    
			    subTiposEventosAux.push({id:val.subTipoEventoId,nombre:val.subTipoEventoNombre});
				listSubTiposId.push(val.subTipoEventoId);
			}
			
		});
	
	});
	var selSubTipoEvento = crearSelectOneMenuOblig("selSubTipoEvento", "verSubSubTipoAcordeSubTipo()", subTiposEventosAux,
		eventoAccidObj.subTipoEventoId, "id", "nombre");
	$("#thsubtipo"+eventoAccidId).html(selSubTipoEvento);

}
function nuevoCausaBasica(){
	 banderaedicion15=false;
	if (!banderaedicion15) {
		$("#tblCausaBasica tbody")
				.append(
						"<tr id='0'>"
						+"<th><select id='listTipoEvento' onchange='verSubTipoAcordeTipo()' class='form-control'>"
						+"<option value='3'>Factores de trabajo</option>"
						+"<option value='4'>Factores personales</option>"
						+"</select></th>"
						+"<th id='thsubtipo0'>   </th>"
						+"<th id='thsubcat0'></th>"
						+"<th><input type='text' class='form-control' id='invEventoInseguro'></th>"
						+ "</tr>");
		eventoAccidId = 0;
		$("#btnCancelarCausaBasica").show();
		$("#btnAgregarCausaBasica").hide();
		$("#btnEliminarCausaBasica").hide();
		$("#btnGuardarCausaBasica").show();
		verSubTipoAcordeTipo();
		verSubSubTipoAcordeSubTipo();
		banderaedicion15 = true;
	} else {
		alert("Guarde primero.");
	};

	
}
function nuevoFallo(){
	 banderaedicion15=false;
	 isFallo=true;
	if (!banderaedicion15) {
		$("#tblFalloSST tbody")
				.append(
						"<tr id='0'>"
						+"<th id='tdSubTipoEve0'></th>"
						+"<th><input class='form-control' id='invEventoInseguro'></th>"
						+ "</tr>");
		eventoAccidId = 0;
		verCausasAcordeTipoEvento();
		$("#btnCancelarFallo").show();
		$("#btnAgregarFallo").hide();
		$("#btnEliminarFallo").hide();
		$("#btnGuardarFallo").show();
		
		banderaedicion15 = true;
	} else {
		alert("Guarde primero.");
	};

	
}
function modificarAcordeTipoEvento(){
var listaevento=listarStringsDesdeArrayY(listeventos, "eventoNombre","eventoTipoId",$("#listTipoEvento").val());
	
$( "#invEventoInseguro" ).val("");
	
	
	 $( "#invEventoInseguro" ).autocomplete({
	        source: listaevento,
	        minLength : 0
	      }).focus(function() {
				$(this).autocomplete('search', '');
			});
}
function obtenerIdEvento(){
	
var nombreEvento=$("#invEventoInseguro").val();
	
	
		for (index = 0; index < listeventos.length; index++) {
			
			if(listeventos[index]["eventoNombre"]==nombreEvento){
			
				eventoId=listeventos[index]["eventoId"];
			break;
			}
		}
	
	
}
