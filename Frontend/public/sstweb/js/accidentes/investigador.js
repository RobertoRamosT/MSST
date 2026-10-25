
var banderaedicion9;
var investigadorId;
var listInvestigadoresAccidente;
var listTrabajadoresInvestigadores = [];
var investigadorObj = {};
function volverDivInvestigacion(){
    $("#generalModuloAccidente .container-fluid").hide();
    $("#mdInvestigacion").show();
    $("#generalModuloAccidente h2")
    .html("<a onclick='volverDivAccidente()'>"+accidenteObj.tipo.nombre+"</a> " +
    		"> Investigación <button onclick='guardarAuxInvestigacion()' class='btn btn-success'> " +
    		"<i class='fa fa-floppy-o'></i>Guardar</button>")
}
function guardarAuxInvestigacion(){
    guardarModalAccidente(5);
    alert("Datos guardados!");
    volverDivAccidente();
}
function verInvestigacion(){
    volverDivInvestigacion();
	restringirFechaInv();
	cargarModalInve();
	cargarEventosAcc();
	cargarModalTesti();
	
	$("#invFehcaFin").attr("onchange", "javascript:restringirFechaInv();");
	$("#invFechaInicio").attr("onchange", "javascript:restringirFechaInv();");
}


function restringirFechaInv(){	
	return	restringirFecha("invFechaInicio","invFehcaFin","advFechaInv");
}

function modAcordeTipoAgente(){
	var listaagente=listarStringsDesdeArrayY(listAgente, "investigacionAgente","investigacionClasifAgenteId",$("#selClasifAgente").val());
	
	
	 $( "#inputAgente").autocomplete({
	        source: listaagente,
	        minLength : 0
	      }).focus(function() {
				$(this).autocomplete('search', '');
			});


}

function cargarModalEditarInve(){
   
   var contenido="<button id='btnCancelarInve' type='button' class='btn btn-success' "
	                +"title='Cancelar'>"
	           +"<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>"
	        +"</button>"
	        +"<button id='btnAgregarInve' type='button' class='btn btn-success' "
	                +"title='Agregar Nuevo Investigador'> "
	           +"<i class='fa fa-file-o fa-2x'></i> "
	        +"</button>"
	        +"<button id='btnGuardarInve' type='button' class='btn btn-success'" 
	                +"title='Guardar'>"
	          +"<i class='fa fa-floppy-o fa-2x'></i>"
	        +"</button>"
	        +"<button id='btnEliminarInve' type='button' class='btn btn-danger' "
	                +"title='Eliminar'> "
	          +"<i class='fa fa-times fa-2x'></i> "
	        +"</button> "
	        +"<table class='table table-striped table-bordered table-hover table-fixed' " 
	               +"id='tblInve'>"
	           +"<thead>"
	              +"<tr>"
                         +"<th class='tb-acc' style='width : 220px'>Nombre</th>"
                         +"<th class='tb-acc' style='width : 220px'>Cargo</th>"
                         +"<th class='tb-acc' style='width : 220px'>Proceso de investigación</th>"
                      +"</tr>"
                   +"</thead>"
                   +"<tbody>"
                      +"<tr>"
                      +"</tr>"
                   +"</tbody>"
                 +"</table>";
   
   var modalOptions = {id:"conted",nombre:"Investigadores",contenido:contenido,maxWidth:"1650px"};
    
   crearModalPrincipalUsuario(modalOptions,function(){},false,true);
	
   $("#btnAgregarInve").attr("onclick", "javascript:nuevoInve();");
   $("#btnCancelarInve").attr("onclick", "javascript:cancelarInve();");
   $("#btnGuardarInve").attr("onclick", "javascript:guardarInve();");
   $("#btnEliminarInve").attr("onclick", "javascript:eliminarInve();");
   
   traerDatosInvestigacion();
}

function traerDatosInvestigacion(){
    banderaedicion9 = false;
    $("#btnCancelarInve").hide();
	$("#btnAgregarInve").show();
	$("#btnEliminarInve").hide();
	$("#btnGuardarInve").hide();
	var dataParam = {
		accidenteId : accidenteId
	};

	callAjaxPost(URL + '/accidente/investigador', dataParam, function(data) {
	    procesarCargaInvestigadoreAccidene(data);
			});
}

function cargarModalInve(){
	
   var selClasifAgente = crearSelectOneMenu("selClasifAgente", "modAcordeTipoAgente()", listClasifAgente,
				            "-1", "investigacionClasifAgenteId", "investigacionClasifAgenteNombre");

   $("#listTipoAgente").html(selClasifAgente);
   $('#selClasifAgente > option[value="'+ClasifAgente+'"]').attr('selected', 'selected');
   banderaedicion9=0;
   investigadorId=0;
   nombre="";
   cargo="";
   proceso="";
	
   var dataParam={
	   accidenteId : accidenteId
		 };

   callAjaxPost(URL+'/accidente/investigador',dataParam,function(data){
	        procesarCargaInvestigadoreAccidene(data);
   });
	
}

function procesarCargaInvestigadoreAccidene(data){

   switch(data.CODE_RESPONSE){
      case "05":
	  listInvestigadoresAccidente = data.list;
	  $("#tblInve tbody tr").remove();
	  $("#tblInveTexto tbody tr").remove();
		
	  listInvestigadoresAccidente.forEach(function(val,index){
	     var textFila = "<tr id='tr"+val.id+"' onclick='javascript:editarInve("+index+")'>"
	     		     + "<td id='tdnombre"+val.investigadorId+"'>"+val.nombre+"</td>"
			     + "<td id='tdcargo"+val.investigadorId+"'>"+val.cargo+"</td>"
			     + "<td id='tdproceso"+val.investigadorId+"'>"+val.proceso+"</td>"
			  + "</tr>";
	     
	     var textFilaTexto = "<tr>"
		 		  + "<td>"+val.nombre+"</td>"
		 		  + "<td>"+val.cargo + "</td>"
		 		  + "<td>"+val.proceso+"</td>"
			       + "</tr>";

	     $("#tblInveTexto tbody").append(textFilaTexto);
	     $("#tblInve tbody").append(textFila);
	  });
	  break;
	  
      default:
	 alert("Ocurrió un error al traer las investigadoes!");
   }
}

function cancelarInve(){
	
    traerDatosInvestigacion();	
}

function nuevoInve(){
	
	if (!banderaedicion9) {

		$("#tblInve tbody")
				.append(
						"<tr id='0'>"
						+"<th><input type='text' id='inveNombre'>" +
								"<div id='divAutoCompletarTrabInve'></div></th>"
						+"<th><input type='text' id='inveCargo'></th>"
						+"<th><input type='text' id='inveProceso'></th>"
						+ "</tr>");
		$("#inveNombre")
		.attr("onkeyup","verAutoCompletarTrabInvestigador()");
		
		investigadorId = 0;
		$("#btnCancelarInve").show();
		$("#btnAgregarInve").hide();
		$("#btnEliminarInve").hide();
		$("#btnGuardarInve").show();
		$("#tblInve tbody tr input").addClass("form-control");
		banderaedicion9 = true;
	} else {
		alert("Guarde primero.");
	};



}

function verAutoCompletarTrabInvestigador(){
	var nombre = $("#inveNombre").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
			})
		}
		listTrabajadoresInvestigadores= data.trabajadores;
		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajadorInvestigador", 
				"verPuestoAcordeTrabajadorInve()", data.trabajadores, "trabajadorId","nombre",
				"#divAutoCompletarTrabInve","");
		verPuestoAcordeTrabajadorInve();
		$("#inveNombre")
		.attr("onkeyup","verAutoCompletarTrabInvestigador()");
	});
}
function verPuestoAcordeTrabajadorInve(){
	var trabId = parseInt($("#selAutoTrabajadorInvestigador").val());
	listTrabajadoresInvestigadores.forEach(function(val){
		if(val.trabajadorId == trabId){
			$("#inveCargo").val(val.puesto.positionName)
		}
	})
	
}

function eliminarInve(){
	var r = confirm("¿Está seguro de eliminar el investigador?");
	if (r == true) {
		var dataParam = {
				investigadorId : investigadorId,
		};

		callAjaxPost(URL + '/accidente/investigador/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    traerDatosInvestigacion();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
}

function editarInve(pindex) {

	if (!banderaedicion9) {
		

		investigadorObj = listInvestigadoresAccidente[pindex]
		investigadorId=investigadorObj.investigadorId  ;
		 
		

		$("#tdnombre" + investigadorId)
				.html(
						"<input type='text'  id='inveNombre'>" +
						"<div id='divAutoCompletarTrabInve'></div>");

		$("#tdcargo" + investigadorId)
		.html(
				"<input type='text' id='inveCargo'>");
		$("#tdproceso" + investigadorId)
		.html(
				"<input type='text' id='inveProceso'>");
		
		
		$("#inveNombre").val(investigadorObj.nombre);
		$("#inveCargo").val(investigadorObj.cargo);
		$("#inveProceso").val(investigadorObj.proceso);
		
		$("#tblInve tbody tr input").addClass("form-control");
		verAutoCompletarTrabInvestigador();
		$("#selAutoTrabajadorInvestigador").val(investigadorObj.trabajadorId)
		banderaedicion9 = true;
		$("#btnCancelarInve").show();
		$("#btnAgregarInve").hide();
		$("#btnEliminarInve").show();
		
		$("#btnGuardarInve").show();
		
	}
}


function guardarInve() {

	var campoVacio = true;

	var inveNombre=$("#inveNombre").val();
	var inveCargo=$("#inveCargo").val();
	var inveProceso=$("#inveProceso").val();
	var trabId = parseInt( $("#selAutoTrabajadorInvestigador").val() );
	
	if (campoVacio) {

		var dataParam = {
			accidenteId: accidenteId,
			investigadorId : investigadorId,
			nombre: inveNombre,
			cargo:inveCargo,
			proceso:inveProceso,
			trabajadorId : trabId
			
		};

		callAjaxPost(URL + '/accidente/investigador/save', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    traerDatosInvestigacion();
						cargarModalTesti()
						break;
					default:
						alert("Ocurrió un error al guardar la investigador!");
					}
				});
	} else {
		alert("Debe ingresar todos los campos.");
	}
}
