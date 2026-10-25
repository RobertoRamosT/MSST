var listaSubConId,listaSubConNombre;
var objListaSubCon={};
var banderaEdicion88=false;
var listFullListasSubCon;
var mensajeUx;

$(function(){
   $("#btnNuevoListaSubCon").attr("onclick","javascript:nuevaListaSubContratista();");
   $("#btnCancelarListaSubCon").attr("onclick","javascript:cancelarNuevoListaSubContratista();");
   $("#btnGuardarListaSubCon").attr("onclick","javascript:guardarListaSubContratista();");
   $("#btnEliminarListaSubCon").attr("onclick","javascript:eliminarListaSubContratista();");
});
/**
 * 
 */
function volverListasSubContratista(){
   $("#tabListasSubContratista .container-fluid").hide();
   $("#divContainListaSubContratista").show(); 
   $("#tabListasSubContratista").find("h2").html("Listas de evaluación Sub Contratista");
}

function cargarListasSubContratista(){
   $("#btnCancelarListaSubCon").hide();$("#btnNuevoListaSubCon").show();
   $("#btnEliminarListaSubCon").hide();$("#btnGuardarListaSubCon").hide();
	
   volverListasSubContratista();
   
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),
      isSubContratista: 1   
   };
	
   callAjaxPost(URL+'/contratista/listas/subcontratista/vista_admin',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         banderaEdicion88 = false;
         listFullListasSubCon = data.list;
					
         $("#tblListasSubCon tbody tr").remove();
					
         listFullListasSubCon.forEach(function(val,index){
	       /*var numActiv=0;
	       var proyects=val.proyectos;
						
	       proyects.forEach(function(val2,index2){
	          if(val2.isActivo==1){
		     numActiv++;
		  }
	       });*/
						
            $("#tblListasSubCon tbody").append(
               "<tr id='trlissubcon"+val.id+"' onclick='editarListaSubContratista("+index+")'>" +
	          "<td id='lisnomsubcon"+val.id+"'>"+val.nombre+"</td>" +
	          "<td id='listpresubcon"+val.id+"'>"+val.numPreguntas+"</td>" +
	          "<td id='listAsocSubCon"+val.id+"'>"+val.numSubContratistasAsociados+"</td>" +
	          //"<td id='listpro"+val.id+"'>"+numActiv+" / "+val.proyectos.length+"</td>" +
	       "</tr>");
         });
            
         formatoCeldaSombreableTabla(true,"tblListasSubCon");
      }else{
         console.log("NOPNPO")
      }
   });	
}

function editarListaSubContratista(pindex){
   if(!banderaEdicion88){
      formatoCeldaSombreableTabla(false,"tblListasSubCon");
      objListaSubCon = listFullListasSubCon[pindex];
      listaSubConId = listFullListasSubCon[pindex].id;
		
      $("#trlissubcon"+listaSubConId).addClass("fila-edicion");
      
      var descripcion = listFullListasSubCon[pindex].nombre;
      listaSubConNombre = descripcion;
	
      $("#lisnomsubcon"+listaSubConId).html("<input type='text' id='inputNombreListaSubCon' class='form-control'>");
      $("#inputNombreListaSubCon").val(descripcion);
      
      var textInfoSubCon = $("#listpresubcon"+listaSubConId).text();
      
      $("#listpresubcon"+listaSubConId).addClass("linkGosst")
      .on("click",function(){verPreguntasListaSubContratista();})
      .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true'></i> "+textInfoSubCon);
      
      $("#listAsocSubCon"+listaSubConId).addClass("linkGosst")
      .on("click",function(){verAsociadosListaSubcontratista();})
      .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true'></i> "+objListaSubCon.numSubContratistasAsociados);
      
      /*
      var textInfoProye=$("#listpro"+listaSubConId).text();
      $("#listpro"+listaSubConId).addClass("linkGosst")
         .on("click",function(){verProyectosListaSubCon();})
            .html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i>"+textInfoProye);
      */
      banderaEdicion88 = true;
      
      $("#btnCancelarListaSubCon").show();$("#btnNuevoListaSubCon").hide();
      $("#btnEliminarListaSubCon").show();$("#btnGuardarListaSubCon").show();
      //$("#btnGenReporte").hide();	
   }	
}

/*
function verProyectosListaSubCon(){
	
	$("#tabListas .container-fluid").hide();
	$("#divProyListas").show();
	$("#tabListas").find("h2").html("<a onclick='volverListas()'> Lista "+listaNombre+"</a> > Proyectos Asociados");
	$("#tblProyListas tbody").html("");
	listFullListas.forEach(function(val,index){ 
		 if(val.id==listaSubConId){ 
			var proyects=val.proyectos;
			proyects.every(function(val2,index2){
				
				$("#tblProyListas tbody").append(
						"<tr id=' "+val2.id+"'  >" +
						"<td id=' "+val2.id+"'>"+val2.titulo+"</td>" +
						"<td id=' "+val2.id+"'>"+val2.postulante.contratista.nombre+"</td>" + 
						"<td id=' "+val2.id+"'>"+val2.fechaInicioTexto+"</td>" + 
						"<td id=' "+val2.id+"'>"+val2.fechaFinTexto+"</td>" + 
						
						"<td id=' "+val2.id+"'>"+(val2.isActivo==1?"Activo":val2.estado.nombre)+"</td>" + 
						 
						"</tr>");
			 
				 
			 
					return true;
				 
			});
			 
		 }
	 
});
		
}
*/
function nuevaListaSubContratista(){
   if(!banderaEdicion88){		
      listaSubConId = 0;
      //var slcLista = crearSelectOneMenuOblig("slcLista", "",listFullListas, "", "id", "nombre");
		
      $("#tblListasSubCon tbody").append(
         "<tr>" +
            "<td>"+"<input type='text' id='inputNombreListaSubCon' class='form-control'>"+"</td>" +
            "<td>0</td>" +
            "<td>0</td>" +
	 "</tr>");
		
      $("#btnCancelarListaSubCon").show();$("#btnNuevoListaSubCon").hide();
      $("#btnEliminarListaSubCon").hide();$("#btnGuardarListaSubCon").show();
      //$("#btnGenReporte").hide();
      banderaEdicion88 = true;
      formatoCeldaSombreableTabla(false,"tblListasSubContratista");
   }else{
      alert("Guarde primero.");
   }
}

/*function cancelarLista() {
   cargarListasContratista();
}*/

function eliminarListaSubContratista(){
   if(objListaSubCon.numSubContratistasAsociados == 0){
      mensajeUx="<label>¿Está seguro de eliminar la lista de evaluación - " +
         "Subcontratista seleccionada?</label>";
      mensajesUx(mensajeUx,3,"","ConfListaSubcontratista");

      $("#btnDevolverValorConfListaSubcontratista").on("click",function(){
         var dataParam={
	    id: listaSubConId
         };
		
         callAjaxPost(URL+'/contratista/lista/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	       case "05":
	          mensajeUx="<label>La lista de evaluación - Subcontratista seleccionada " +
	             "se ha eliminado correctamente.</label>"
                  mensajesUx(mensajeUx,1,"");
		
	          cargarListasSubContratista();
		   
	          break;
					
	       default:
	          alert("Error al eliminar la lista.");
            }
         });
      });
   }else{
      mensajeUx="<label>No se puede eliminar el registro seleccionado porque la lista " +
         "tiene asociados uno o más subcontratistas.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function guardarListaSubContratista(){
   var campoVacio = true;
   var descripcion = $("#inputNombreListaSubCon").val();  
 
   if(descripcion.length < 1){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
	 id: listaSubConId,nombre: descripcion,isSubContratista: 1,
	 empresa: {empresaId: getSession("gestopcompanyid")}
      };

      callAjaxPost(URL+'/contratista/lista/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       cargarListasSubContratista();
		   
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la lista!");
         }
      });				
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoListaSubContratista(){
   cargarListasSubContratista();
}

var listSubcontratistas=[];

function volverPrincipalListaSubcontratista(){
   $("#modalAsociadosListaSubcontratista").modal("hide");
}

function verAsociadosListaSubcontratista(){
   $("#modalAsociadosListaSubcontratista").remove();

   var contenido = "";
   
   var buttonVolver =
      "<button type='button' id='btnVolverListaSubCon' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPrincipalListaSubcontratista()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalAsociadosListaSubcontratista",
      nombre:"<i class='fa fa-table'></i> Lista "+objListaSubCon.nombre+" - Subcontratistas asociados",
      contenido: 
	  buttonVolver +
         "<div class='wrapper' id='wrapperAsocListaSubcontratista'>" +
            "<table id='tblAsocListaSubcontratista' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' colspan='3' style='width:900px'>Subcontratista</th>" +
		     "<th class='tb-acc' rowspan='2' style='width:300px'>Contratista</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:300px'>Razón social</th>" +
		     "<th class='tb-acc' style='width:300px'>RUC</th>" +
		     "<th class='tb-acc' style='width:300px'>Detalle del proyecto</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperAsocListaSubcontratista",190);
   cargarAsociadosListaSubcontratista();
}

function cargarAsociadosListaSubcontratista(){
   var dataParam={
      id: listaSubConId
   };
    
   callAjaxPost(URL+"/contratista/listas/subcontratista/asociados",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listSubcontratistas = data.listSubcontratistas;
	 
	 $("#tblAsocListaSubcontratista tbody tr").remove();
	 
	 listSubcontratistas.forEach(function(val,index){
	    $("#tblAsocListaSubcontratista tbody").append(
	       "<tr id='fsc"+val.id+"'>" +
	          "<td>"+val.nombre+"</td>" +
		  "<td>"+val.ruc+"</td>" +
		  "<td>"+val.detalle+"</td>" +
		  "<td>"+val.nombreContratistaPadre+"</td>" +
               "</tr>");
	 });
      }else{
         console.log("NOPNPO");
      }
	
      goheadfixedY("#tblAsocListaSubcontratista","#wrapperAsocListaSubcontratista");
   });
}
