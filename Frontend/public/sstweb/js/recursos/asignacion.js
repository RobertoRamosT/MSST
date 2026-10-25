/**
 * 
 */
var recursoEdicionObj = {};
var listFullPuestosRecurso=[],listFullSitesRecurso=[],listFullContratistasRecurso=[];
var recursoIdAux;
var recursoIndexAux;
var rutaPrincipal="capacitacion";
var mensajeUx;

function verModalFiltroAsignacion(){
   $("#modalAsig").modal("hide");
   $("#modalFiltroAsignacion").modal("show");
}

function ocultarModalFiltroAsignacion(){
   $("#modalFiltroAsignacion").modal("hide");
   $("#modalAsig").modal("show");
}

$(document).ready(function(){
   var dataParamAux={
      companyId: getSession("gestopcompanyid")
   }; 

   if(rutaPrincipal != ""){
      callAjaxPost(URL+'/'+rutaPrincipal+'/asignacion/filtro',dataParamAux,function(data){
         var listUnidades = data.listUnidades;
         var listDivisiones = data.listDivisiones;
         var listAreas = data.listAreas;
				
         var contenido = "";
				
         var listContenido=[
	    {sugerencia:"",label:"Unidad",inputForm:"",divContainer:"divFiltroUnidad"},
	    {sugerencia:"",label:"Division",inputForm:"",divContainer:"divFiltroDivision"},
	    {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroArea"},
	    {sugerencia:"",
             label:"<button class='btn btn-danger' type='button' onclick='ocultarModalFiltroAsignacion()'>" +
	              "<i class='fa fa-times'></i> Cancelar" +
	           "</button>",
	     inputForm:"<button id='btnFiltrarAsignacion' class='btn btn-success' type='button'>" +
	                  "<i class='fa fa-filter'></i> Aplicar filtro" +
	               "</button>"}
         ];
				
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloGeneral(val);
         });
				
         var modalOptions={
            id:"modalFiltroAsignacion",
            nombre:"<i class='fa fa-filter'></i> Asignación - Filtros",
	    contenido: contenido
	 };
				
         crearModalPrincipalUsuario(modalOptions,function(){
	    if($("#selMulUnidadesFiltro").length > 0){
	       return;
	    }
				       
	    crearSelectOneMenuObligMultipleCompleto("selMulUnidadesFiltro","",listUnidades,
	       "matrixId","matrixNameSimple","#divFiltroUnidad","Todos");
				       
	    crearSelectOneMenuObligMultipleCompleto("selMulDivisionesFiltro","",listDivisiones,
	       "divisionId","divisionNormalName","#divFiltroDivision","Todos");   
				    
	    crearSelectOneMenuObligMultipleCompleto("selMulAreasFiltro","",listAreas,
	       "areaId","areaName","#divFiltroArea","Todos");		
         },false);
		 
         $('#modalFiltroAsignacion').on('hidden.bs.modal',function(e){
	    $("#modalAsig").modal("show");
         });
		 
         $("#btnFiltrarAsignacion").on("click",function(){
	    $("#modalFiltroAsignacion").modal("hide");
	    verPuestosRecurso(recursoIdAux,recursoIndexAux);
         });
		 
         $("#modalFiltroAsignacion").modal("hide");
      }); 
   }   
});

function verPuestosRecurso(recursoId,recursoIndex){
    
   $("#modalFiltroAsignacion").modal("hide");
    
   recursoId = parseInt(recursoId);
   recursoIdAux = recursoId;
   recursoIndexAux = recursoIndex;
   
   var listUnidadesId = [];
   var unidadesId = $("#selMulUnidadesFiltro").val();
      
   if(unidadesId != null){
      unidadesId.forEach(function(val){
	 listUnidadesId.push(parseInt(val));	
      });
   }

   var listDivisionesId = [];
   var divisionesId = $("#selMulDivisionesFiltro").val();
	 
   if(divisionesId != null){
      divisionesId.forEach(function(val){
         listDivisionesId.push(parseInt(val));
      });
   }
	
   var listAreasId = [];
   var areasId = $("#selMulAreasFiltro").val();
   
   if(areasId != null){
      areasId.forEach(function(val){
         listAreasId.push(parseInt(val));
      });
   } 
	
   var listModal={
      id:"modalAsig",nombre:"Asignación",
      contenido:
	 "<button class='btn btn-success' id='btnVolverTabla' title='Regresar a la tabla anterior.'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnSaveAsigRecurso' style='margin-left:5px' " +
	         "title='Guardar las filas marcadas con un check.'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnMarcarTodo' style='margin-left:5px' " +
	         "title='Marcar todas las filas con un check.'>" +
	    "<i class='fa fa-check fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnDesmarcarTodo' style='margin-left:5px' " +
	         "title='Desmarcar todas las filas con un check.'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnFiltroAsignacion' style='margin-left:5px' " +
	         "title='Permite filtrar los registros según División, Área y Unidad.'>" +
	    "<i class='fa fa-filter fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapAsigRecuro'>" +
	    "<table id='tblAsigRecuro' " +
		   "class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
                  "<tr>" +
	             "<td class='tb-acc'>Unidad</td>" +
		     "<td class='tb-acc'>División</td>" +
		     "<td class='tb-acc'>Área</td>" +
		     "<td class='tb-acc'>Puesto de trabajo</td>" +
		     "<td class='tb-acc' style='width:120px'>Asignación</td>" +
		      (recursoId == 80?"<td class='tb-acc'># Trabajadores aprobados / # Trabajadores total</td>":"") +
	          "</tr>" +
	       "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"};
	
   agregarModalPrincipalUsuario(listModal);
   resizeDivWrapper("wrapAsigRecuro",200);
   goheadfixedY("#tblAsigRecuro","#wrapAsigRecuro");
	
   var functionText = "";
   
   var dataParam={
      empresaId:getSession("gestopcompanyid"),
      listUnidadesIdFiltro:(listUnidadesId.length==0?null:listUnidadesId),
      listDivisionesIdFiltro:(listDivisionesId.length==0?null:listDivisionesId),
      listAreasIdFiltro:(listAreasId.length==0?null:listAreasId)
   };
	
   $("#tblAsigRecuro tbody tr").remove();
	
   switch(recursoId){
      case 1:
	 functionText = "guardarAsignacionFormacion()"
	 recursoEdicionObj = listFullFormaciones[recursoIndex];
	 dataParam.capacitacionId = recursoEdicionObj.capacitacionId;
	 callAjaxPost(URL+"/capacitacion/asignacion/puestos",dataParam,procesarAsignacionPuestoRecursoSinTrabajadores);
	 rutaPrincipal="capacitacion";
	  
	 break;
	
      case 2:
	 functionText = "guardarAsignacionExMedico()"
	 recursoEdicionObj = listFullExamMedico[recursoIndex];
	 dataParam.examenMedicoId = recursoEdicionObj.examenMedicoId;
	 callAjaxPost(URL+"/examenmedico/asignacion/puestos",dataParam,procesarAsignacionPuestoRecursoSinTrabajadores);
	 rutaPrincipal="examenmedico";
	 
	 break;
	
      case 3:
	 functionText = "guardarAsignacionEquipoSeguridad()"
	 recursoEdicionObj = listFullEquipos[recursoIndex];
	 dataParam.equipoSeguridadId = recursoEdicionObj.equipoSeguridadId;
	 callAjaxPost(URL+"/equiposeguridad/asignacion/puestos",dataParam,procesarAsignacionPuestoRecursoSinTrabajadores);
	 rutaPrincipal="equiposeguridad";
	  
	 break;
	  
      case 4:
	 functionText = "guardarAsignacionProcedimiento()"
	 recursoEdicionObj = listFullProcedimiento[recursoIndex];
	 dataParam.procedimientoSeguridadId = recursoEdicionObj.procedimientoSeguridadId;
	 callAjaxPost(URL+"/procedimientoseguridad/asignacion/puestos",dataParam,procesarAsignacionPuestoRecursoSinTrabajadores);
	 rutaPrincipal="procedimientoseguridad";
	  
	 break;
	  
      case 5:
	 
	 break;
   }
	
   $("#btnSaveAsigRecurso").attr("onclick",functionText);
	
   $("#btnMarcarTodo").on("click",function(){
      $("#tblAsigRecuro input[type='checkbox']").each(function(index,elem){
	 $(elem).prop("checked",true); 
      });
   });
   
   $("#btnDesmarcarTodo").on("click",function(){
      $("#tblAsigRecuro input[type='checkbox']").each(function(index,elem){
         $(elem).prop("checked",false); 
      });
   });
   
   $("#btnVolverTabla").on("click",function(){
      $("#modalAsig").modal("hide"); 
   });
   
   $("#btnFiltroAsignacion").on("click",function(){
      verModalFiltroAsignacion();
   });
	
   /*$("#modalAsig").on("hidden.modal.bs",function(){
          $("#btnSaveAsigRecurso").click(); 
     });*/
}

function procesarAsignacionPuestoRecurso(data){
	listFullPuestosRecurso = data.list;
	listFullPuestosRecurso.forEach(function(val){
		$("#tblAsigRecuro tbody").append("<tr>" +
				"<td>"+val.positionName+"</td>" +
				"<td><input type='checkbox' class='form-control' id='posAsig"+val.positionId+"' "+
					
					(val.isAsignado==1?"checked":"")+"></td>" +
				"<td><a class='efectoLink' onclick='verDetalleTrabajadoresAsigandosRecurso()'>"+
				val.numTrabajadoresAprobados+" / "+val.numTrabajadoresTotal+"</a></td>" +
				 
				"</tr>")
	});
}

function procesarAsignacionPuestoRecursoSinTrabajadores(data){
   listFullPuestosRecurso = data.list;
   
   listFullPuestosRecurso.forEach(function(val){
      $("#tblAsigRecuro tbody").append(
         "<tr>" +
	    "<td>"+val.matrixName+"</td>" +
	    "<td>"+val.divisionName+"</td>" +
	    "<td>"+val.areaName+"</td>" +
	    "<td>"+val.positionName+"</td>" +
	    "<td><input type='checkbox' class='form-control' id='posAsig"+val.positionId+"' "+
	     (val.isAsignado == 1?"checked":"")+"></td>" +
         "</tr>");
   });
}

function guardarAsignacionFormacion(){
   var listFormacion = [];
   
   listFullPuestosRecurso.forEach(function(val){
      listFormacion.push({
	 capacitacionId: recursoEdicionObj.capacitacionId,
	 positionId: val.positionId,
	 isAsociado: ($("#posAsig"+val.positionId).prop("checked")?1:0)});
   });
	 
   callAjaxPost(URL+"/capacitacion/asignacion/puestos/save",listFormacion,function(data){
      $(".modal").modal("hide");
      alert("Asignaciones guardadas");
      cargarPrimerEstado();
   });
}

function guardarAsignacionExMedico(){
	var listExMedico = [];
	listFullPuestosRecurso.forEach(function(val){
		listExMedico.push({examenMedicoId : recursoEdicionObj.examenMedicoId,
			positionId : val.positionId,
			isAsociado : ($("#posAsig"+val.positionId).prop("checked")?1:0) })
	});
	 
	callAjaxPost(URL+"/examenmedico/asignacion/puestos/save",listExMedico,function(data){
		$(".modal").modal("hide");
		alert("Asignaciones guardadas");
		cargarPrimerEstado();
	});
}
function guardarAsignacionEquipoSeguridad(){
	var listEpp = [];
	listFullPuestosRecurso.forEach(function(val){
		listEpp.push({equipoSeguridadId : recursoEdicionObj.equipoSeguridadId,
			positionId : val.positionId,
			isAsociado : ($("#posAsig"+val.positionId).prop("checked")?1:0) })
	});
	 
	callAjaxPost(URL+"/equiposeguridad/asignacion/puestos/save",listEpp,function(data){
		$(".modal").modal("hide");
		alert("Asignaciones guardadas");
		cargarPrimerEstado();
	});
}

function guardarAsignacionProcedimiento(){
   var listProc = [];
	
   listFullPuestosRecurso.forEach(function(val){
      listProc.push({
         procedimientoSeguridadId: recursoEdicionObj.procedimientoSeguridadId,
         positionId: val.positionId,
         isAsociado: ($("#posAsig"+val.positionId).prop("checked")?1:0)
      });
   });
	 
   callAjaxPost(URL+"/procedimientoseguridad/asignacion/puestos/save",listProc,function(data){
      $(".modal").modal("hide");
      alert("Asignaciones guardadas");
      cargarPrimerEstado();
   });
}

function ocultarSitesRecursoAsignacion(){
   $("#modalSiteAsignacion").modal("hide");    
}

function verSitesRecursoAsignacion(recursoId,recursoIndex){
   $("#modalFiltroAsignacion").modal("hide");
   $("#modalSiteAsignacion").remove(); 
    
   recursoIdAux = parseInt(recursoId);recursoIndexAux = parseInt(recursoIndex);

   var listModal={
      id:"modalSiteAsignacion",nombre:"Asignación Site",maxWidth:"40%",
      contenido:
	 "<button class='btn btn-success' id='btnVolverSiteTabla' onclick='ocultarSitesRecursoAsignacion()' " +
	         "title='Regresar a la tabla anterior.'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnSiteSaveAsigRecurso' style='margin-left:5px' " +
	         "title='Guardar las filas marcadas con un check.'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnSiteMarcarTodo' style='margin-left:5px' " +
	         "title='Marcar todas las filas con un check.'>" +
	    "<i class='fa fa-check fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnSiteDesmarcarTodo' style='margin-left:5px' " +
	         "title='Desmarcar todas las filas con un check.'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapperSiteAsignacionRecurso'>" +
	    "<table id='tblSiteAsignacionRecurso' " +
		   "class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
                  "<tr>" +
	             "<td class='tb-acc'>Site</td>" +
		     "<td class='tb-acc' style='width:120px'>Asignación</td>" +
	          "</tr>" +
	       "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"};
	
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapperSiteAsignacionRecurso",200);
   
   var functionText = "";
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
	
   $("#tblSiteAsignacionRecurso tbody tr").remove();
	
   switch(recursoId){
      case 4:
	 functionText = "guardarAsignacionSiteProcedimiento()";
	 recursoEdicionObj = listFullProcedimiento[recursoIndex];
	 dataParam.procedimientoSeguridadId = recursoEdicionObj.procedimientoSeguridadId;
	 callAjaxPost(URL+"/procedimientoseguridad/asignacion/sites",dataParam,procesarAsignacionSite);
	  
	 break;
   }
   
   goheadfixedY("#tblSiteAsignacionRecurso","#wrapperSiteAsignacionRecurso");
	
   $("#btnSiteSaveAsigRecurso").attr("onclick",functionText);
	
   $("#btnSiteMarcarTodo").on("click",function(){
      $("#tblSiteAsignacionRecurso input[type='checkbox']").each(function(index,elem){
	 $(elem).prop("checked",true); 
      });
   });
   
   $("#btnSiteDesmarcarTodo").on("click",function(){
      $("#tblSiteAsignacionRecurso input[type='checkbox']").each(function(index,elem){
         $(elem).prop("checked",false); 
      });
   });
}

function procesarAsignacionSite(data){
   listFullSitesRecurso = data.listSites;
   
   listFullSitesRecurso.forEach(function(val){
      $("#tblSiteAsignacionRecurso tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	    "<td><input type='checkbox' class='form-control' id='siteAsig"+val.id+"' " +
	                (val.isAsignado == 1?"checked":"")+"></td>" +
         "</tr>");
   });
   
   if(listFullSitesRecurso.length == 0){
      $("#modalSiteAsignacion").modal("hide"); 
      
      mensajeUx="<label>No hay site(s) registrado(s) en la empresa.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarAsignacionSiteProcedimiento(){
   var listProc = [];
	
   listFullSitesRecurso.forEach(function(val){
      listProc.push({
         procedimientoSeguridadId: recursoEdicionObj.procedimientoSeguridadId,
         siteId: val.id,
         isAsociado: ($("#siteAsig"+val.id).prop("checked")?1:0)
      });
   });
	 
   callAjaxPost(URL+"/procedimientoseguridad/asignacion/sites/save",listProc,function(data){
      $("#modalSiteAsignacion").modal("hide"); 
      
      mensajeUx="<label>Los sites fueron asignados con éxito.<label>";
      mensajesUx(mensajeUx,1,"","ActualizarProcSeg");
		
      $("#modalMensajeUxActualizarProcSeg").on("hidden.bs.modal",function(){
         cargarPrimerEstado();
      });
   });
}

function ocultarContratistasRecursoAsignacion(){
   $("#modalContratistaAsignacion").modal("hide");    
}

function verContratistasRecursoAsignacion(recursoId,recursoIndex){
   $("#modalFiltroAsignacion").modal("hide");
   $("#modalContratistaAsignacion").remove(); 
    
   recursoIdAux = parseInt(recursoId);recursoIndexAux = parseInt(recursoIndex);

   var listModal={
      id:"modalContratistaAsignacion",nombre:"Asignación Contratista",maxWidth:"50%",
      contenido:
	 "<button class='btn btn-success' id='btnVolverContratistaTabla' onclick='ocultarContratistasRecursoAsignacion()' " +
	         "title='Regresar a la tabla anterior.'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnContratistaSaveAsigRecurso' style='margin-left:5px' " +
	         "title='Guardar las filas marcadas con un check.'>" +
	    "<i class='fa fa-floppy-o fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnContratistaMarcarTodo' style='margin-left:5px' " +
	         "title='Marcar todas las filas con un check.'>" +
	    "<i class='fa fa-check fa-2x'></i>" +
	 "</button>" +
	 "<button class='btn btn-success' id='btnContratistaDesmarcarTodo' style='margin-left:5px' " +
	         "title='Desmarcar todas las filas con un check.'>" +
	    "<i class='fa fa-times fa-2x'></i>" +
	 "</button>" +
	 "<div class='wrapper' id='wrapperContratistaAsignacionRecurso'>" +
	    "<table id='tblContratistaAsignacionRecurso' " +
		   "class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
                  "<tr>" +
	             "<td class='tb-acc'>Contratista</td>" +
		     "<td class='tb-acc' style='width:120px'>Asignación</td>" +
	          "</tr>" +
	       "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"};
	
   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapperContratistaAsignacionRecurso",200);
   
   var functionText = "";
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
	
   $("#tblContratistaAsignacionRecurso tbody tr").remove();
	
   switch(recursoId){
      case 4:
	 functionText = "guardarAsignacionContratistaProcedimiento()";
	 recursoEdicionObj = listFullProcedimiento[recursoIndex];
	 dataParam.procedimientoSeguridadId = recursoEdicionObj.procedimientoSeguridadId;
	 callAjaxPost(URL+"/procedimientoseguridad/asignacion/contratistas",dataParam,procesarAsignacionContratista);
	  
	 break;
   }
   
   goheadfixedY("#tblContratistaAsignacionRecurso","#wrapperContratistaAsignacionRecurso");
	
   $("#btnContratistaSaveAsigRecurso").attr("onclick",functionText);
	
   $("#btnContratistaMarcarTodo").on("click",function(){
      $("#tblContratistaAsignacionRecurso input[type='checkbox']").each(function(index,elem){
	 $(elem).prop("checked",true); 
      });
   });
   
   $("#btnContratistaDesmarcarTodo").on("click",function(){
      $("#tblContratistaAsignacionRecurso input[type='checkbox']").each(function(index,elem){
         $(elem).prop("checked",false); 
      });
   });
}

function procesarAsignacionContratista(data){
   listFullContratistasRecurso = data.listContratistas;
   
   listFullContratistasRecurso.forEach(function(val){
      $("#tblContratistaAsignacionRecurso tbody").append(
         "<tr>" +
	    "<td>"+val.nombre+"</td>" +
	    "<td><input type='checkbox' class='form-control' id='contratistaAsig"+val.id+"' " +
	                (val.isAsignado == 1?"checked":"")+"></td>" +
         "</tr>");
   });
   
   if(listFullContratistasRecurso.length == 0){
      $("#modalContratistaAsignacion").modal("hide"); 
      
      mensajeUx="<label>No hay contratista(s) registrado(s) en la empresa.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarAsignacionContratistaProcedimiento(){
   var listProc = [];
	
   listFullContratistasRecurso.forEach(function(val){
      listProc.push({
         procedimientoSeguridadId: recursoEdicionObj.procedimientoSeguridadId,
         contratistaId: val.id,
         isAsociado: ($("#contratistaAsig"+val.id).prop("checked")?1:0)
      });
   });
	 
   callAjaxPost(URL+"/procedimientoseguridad/asignacion/contratistas/save",listProc,function(data){
      $("#modalContratistaAsignacion").modal("hide"); 
      
      mensajeUx="<label>Los contratistas fueron asignados con éxito.<label>";
      mensajesUx(mensajeUx,1,"","ActualizarProcSeg");
		
      $("#modalMensajeUxActualizarProcSeg").on("hidden.bs.modal",function(){
         cargarPrimerEstado();
      });
   });
}
