/**
 * 
 */
var objetivoCursoId;
var banderaEdicionObj;
var listFullObjetivos;

function llamarObjetivosCurso(){
   objetivoCursoId = 0;
   banderaEdicionObj = false;
   listFullObjetivos = [];
	
   $("#btnAgregarObjetivo").show();
   $("#btnCancelarObjetivo").hide();
   $("#btnEliminarObjetivo").hide();
   $("#btnGuardarObjetivo").hide();
	
   var dataParam={
	  id: cursoCapacitacionId
	         };
	
   callAjaxPost(URL+'/capacitacion/curso/objetivos',dataParam,function(data){	
      var list = data.list;
      listFullObjetivos = data.list;
		
      $("#tblObjCurso tbody").html("");
		
      listFullObjetivos.forEach(function(val,index){
         $("#tblObjCurso tbody")
         .append("<tr onclick='javascript:editarObjetivo("+index+")'>"+
		    "<td id='objNom"+list[index].id+"'>"+list[index].nombre+"</td>" +
		 "</tr>");
      });
		
      resizeDivGosst("progCursosDiv",180);
      goheadfixedY("#tblObjCurso","#progCursosDiv");
      formatoCeldaSombreableTabla(true,"tblObjCurso");
   });	
}

function editarObjetivo(pindex){
   if(!banderaEdicionObj){
      banderaEdicionObj = true;
      
      $("#btnAgregarObjetivo").hide();
      $("#btnCancelarObjetivo").show();
      $("#btnEliminarObjetivo").show();
      $("#btnGuardarObjetivo").show();
		
      formatoCeldaSombreableTabla(false,"tblObjCurso");
		
      objetivoCursoId = listFullObjetivos[pindex].id;
		
      var nombre = listFullObjetivos[pindex].nombre;

      $("#objNom"+objetivoCursoId).html("<input class='form-control' id='inputObjNom'>");
      $("#inputObjNom").val(nombre);
   }
}
function nuevoObjetivo(){
   $("#btnAgregarObjetivo").hide();
   $("#btnCancelarObjetivo").show();
   $("#btnEliminarObjetivo").hide();
   $("#btnGuardarObjetivo").show();
   banderaEdicionObj=true;
	
   objetivoCursoId = 0;
	
   $("#tblObjCurso tbody")
   .append("<tr id='tr0'>" +
	      "<td><input class='form-control' id='inputObjNom'></td>" +
	   "</tr>");
	
   formatoCeldaSombreableTabla(false,"tblObjCurso");
}

function eliminarObjetivo(){
   var objetivoObj={
          id: objetivoCursoId
	           };
   
   var r = confirm("¿Está seguro de eliminar este objetivo?");
	
   if(r){
      callAjaxPost(URL+'/capacitacion/curso/objetivo/delete',objetivoObj,function(data){	
         llamarObjetivosCurso();
      });
   }	
}

function guardarObjetivo(){
   var nombre = $("#inputObjNom").val();
   var campoVacio = false;
	
   if(nombre.length == 0){
      campoVacio=true;
   }
	
   if(campoVacio){
      alert("Complete el campo");
   }else{
      var objetivoObj={
	     id: objetivoCursoId,
	     nombre: nombre,
	     cursoCapacitacionId:cursoCapacitacionId
		      }
		
      callAjaxPost(URL+'/capacitacion/curso/objetivo/save',objetivoObj,function(data){
         llamarObjetivosCurso();
      });
   }
}
