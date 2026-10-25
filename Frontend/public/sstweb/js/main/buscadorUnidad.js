/**
 * logica de buscador en unidades
 */
var empresaSeleccionada=true;
var unidadSeleccionadaId=null;
var divisionSeleccionadaId=null;
var areaSeleccionadaId=null;
var puestoSeleccionadaId=null;
var trabajadorSeleccionadaId=null;
$(document).ready(function() {
	 $("#buscadorProy").on("keydown",function(event){
		 if ( event.which == 13 ) {
		     event.preventDefault();
		     $("#buscadorProy").autocomplete("close");
		  }
		
		 
	 });
	$("#buscadorProy").on("autocompleteclose",function(){			
		var tipoNivelId=$("#slcNivel").val();
		switch(parseInt(tipoNivelId)){
		
		case 1:
			buscarSegunEmpresa();
			break;
		case 2:
			buscarSegunUnidad();
			break;
		case 3:
			buscarSegunDivision();
			break;
		case 4:
			buscarSegunArea();
			break;
		case 5:
			buscarSegunPuesto();
			break;
		case 6:
			buscarSegunTrabajador();
			break;
			
		}
		
		
	});
})

function cambiarAcordeNivel(){
	var tipoNivelId=$("#slcNivel").val();
	$("#buscadorProy").val("");
	$("#buscadorProy").hide();
	empresaSeleccionada=false;
	 unidadSeleccionadaId=null;
	 divisionSeleccionadaId=null;
	 areaSeleccionadaId=null;
	 puestoSeleccionadaId=null;
	 trabajadorSeleccionadaId=null;
	$("#indicadorBusqueda").html("..");
	switch(parseInt(tipoNivelId)){
	
	case 1:
		buscarSegunEmpresa();
		break;
	case 2:
		buscarSegunUnidad();
		$("#buscadorProy").show();
		break;
	case 3:
		buscarSegunDivision();
		$("#buscadorProy").show();
		break;
	case 4:
		buscarSegunArea();
		$("#buscadorProy").show();
		break;
	case 5:
		buscarSegunPuesto();
		$("#buscadorProy").show();
		break;
	case 6:
		buscarSegunTrabajador();
		$("#buscadorProy").show();
		break;
		
	}
}

function buscarSegunEmpresa(){
	empresaSeleccionada=true;
	 unidadSeleccionadaId=null;
	 divisionSeleccionadaId=null;
	 areaSeleccionadaId=null;
	 puestoSeleccionadaId=null;
	 trabajadorSeleccionadaId=null;
	
}
var busquedaExitosa="<i class='fa fa-check-circle' aria-hidden='true'></i>";
var busquedaFallida="<i class='fa fa-question-circle' aria-hidden='true'></i>";
function buscarSegunUnidad(){
	var listBuscar=listarStringsDesdeArray(unidadesBuscar, "matrixName");
	ponerListaSugerida("buscadorProy",listBuscar,true);
		

	unidadesBuscar.every(function(val,index){
		var seguirBusqueda=true;
		$("#indicadorBusqueda").html(busquedaFallida);
		if(val.matrixName==$("#buscadorProy").val()){
			seguirBusqueda=false;
			unidadSeleccionadaId=val.matrixId;
			$("#indicadorBusqueda").html(busquedaExitosa);
			hallarProyeccion();
		}
		if (!seguirBusqueda)
		    return false;
		else return true;
	})
}


function buscarSegunDivision(){
	var listBuscar=listarStringsDesdeArray(divisionesBuscar, "divisionName");
	ponerListaSugerida("buscadorProy",listBuscar,true);
	divisionesBuscar.every(function(val,index){
		var seguirBusqueda=true;
		$("#indicadorBusqueda").html(busquedaFallida);
		if(val.divisionName==$("#buscadorProy").val()){
			seguirBusqueda=false;
			divisionSeleccionadaId=val.divisionId;
			$("#indicadorBusqueda").html(busquedaExitosa);
			hallarProyeccion();
		}
		if (!seguirBusqueda)
		    return false;
		else return true;
	})
}
function buscarSegunArea(){
	var listBuscar=listarStringsDesdeArray(areasBuscar, "areaName");
	ponerListaSugerida("buscadorProy",listBuscar,true);
	areasBuscar.every(function(val,index){
		var seguirBusqueda=true;
		$("#indicadorBusqueda").html(busquedaFallida);
		if(val.areaName==$("#buscadorProy").val()){
			seguirBusqueda=false;
			areaSeleccionadaId=val.areaId;
			$("#indicadorBusqueda").html(busquedaExitosa);
			hallarProyeccion();
		}
		if (!seguirBusqueda)
		    return false;
		else return true;
	})
}
function buscarSegunPuesto(){
	var listBuscar=listarStringsDesdeArray(puestoBuscar, "puestoNombre");
	ponerListaSugerida("buscadorProy",listBuscar,true);
	puestoBuscar.every(function(val,index){
		var seguirBusqueda=true;
		$("#indicadorBusqueda").html(busquedaFallida);
		if(val.puestoNombre==$("#buscadorProy").val()){
			seguirBusqueda=false;
			puestoSeleccionadaId=val.puestoId;
			$("#indicadorBusqueda").html(busquedaExitosa);
			hallarProyeccion();
		}
		if (!seguirBusqueda)
		    return false;
		else return true;
	})
}

function buscarSegunTrabajador(){
	var listBuscar=listarStringsDesdeArray(trabajadoresBuscar, "trabajadorNombre");
	ponerListaSugerida("buscadorProy",listBuscar,true);
	trabajadoresBuscar.every(function(val,index){
		var seguirBusqueda=true;
		$("#indicadorBusqueda").html(busquedaFallida);
		if(val.trabajadorNombre==$("#buscadorProy").val()){
			seguirBusqueda=false;
			trabajadorSeleccionadaId=val.trabajadorId;
			$("#indicadorBusqueda").html(busquedaExitosa);
			hallarProyeccion();
		}
		if (!seguirBusqueda)
		    return false;
		else return true;
	})
}