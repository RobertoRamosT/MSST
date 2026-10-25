/** 
 */
var EnlaceCursoId;
var banderaEdicionObj;
var listFullEnlaces;
var listTipoEnlace;

function llamarEnlacesCurso(){
   EnlaceCursoId = 0;
   banderaEdicionObj=false;
   listFullEnlaces=[];
	
   $("#btnAgregarEnlace").show();$("#btnCancelarEnlace").hide();
   $("#btnEliminarEnlace").hide();$("#btnGuardarEnlace").hide();
	
   var dataParam={
      id: cursoCapacitacionId
   };
	
   callAjaxPost(URL+'/capacitacion/curso/enlaces',dataParam,function(data){
      var list = data.list;
      listTipoEnlace = data.listTipoEnlace;
      listFullEnlaces = data.list;
		
      $("#tblEnlCurso tbody").html("");
		
      listFullEnlaces.forEach(function(val,index){
         $("#tblEnlCurso tbody").append(
            "<tr onclick='javascript:editarEnlace("+index+")'>" +
	       "<td id='enlTipo"+val.id+"'>"+val.tipo.nombre+"</td>" +
	       "<td id='enlNom"+val.id+"' style='word-break:break-all;'>"+val.nombre+"</td>" +
	       "<td id='enlNomMos"+val.id+"'>"+val.nombreMostrar+"</td>" +
	       "<td id='enlImagen"+val.id+"'>"+val.imagenNombre+"</td>" +
	       "<td id='enlObs"+val.id+"'>"+val.observacion+"</td>" +
	    "</tr>");
      });
	
      formatoCeldaSombreableTabla(true,"tblEnlCurso");
   });	
}

function editarEnlace(pindex){
   if(!banderaEdicionObj){
      banderaEdicionObj = true;

      $("#btnAgregarEnlace").hide();$("#btnCancelarEnlace").show();
      $("#btnEliminarEnlace").show();$("#btnGuardarEnlace").show();
		
      formatoCeldaSombreableTabla(false,"tblEnlCurso");
		
      EnlaceCursoId = listFullEnlaces[pindex].id;
      var nombre = listFullEnlaces[pindex].nombre;
      var observacion = listFullEnlaces[pindex].observacion;
      var nombreMostrar = listFullEnlaces[pindex].nombreMostrar;
      var imagenNombre = listFullEnlaces[pindex].imagenNombre;
      var tipo = listFullEnlaces[pindex].tipo.id;
		
      $("#enlNom"+EnlaceCursoId).html("<input class='form-control' id='inputEnlNom'>");
      $("#inputEnlNom").val(nombre);
		
      $("#enlObs"+EnlaceCursoId).html("<input class='form-control' id='inputEnlObs'>");
      $("#inputEnlObs").val(observacion);
		
      var selTipoEnlace = crearSelectOneMenuOblig("selTipoEnlace","", 
	 listTipoEnlace,tipo,"id","nombre");
		//
      $("#enlTipo"+EnlaceCursoId).html(selTipoEnlace);	
		//
      $("#enlNomMos"+EnlaceCursoId).html("<input class='form-control' id='inputEnlNomMos'>");
      $("#inputEnlNomMos").val(nombreMostrar);
		
      var options={
	 container: "#enlImagen"+EnlaceCursoId,functionCall: function(){},
	 descargaUrl: "/capacitacion/curso/enlace/imagen?id="+EnlaceCursoId,
	 esNuevo: false,isImagen: true,idAux: "ImagenEnlace",
	 evidenciaNombre: imagenNombre
      };
		
      crearFormEvidenciaCompleta(options);
   }
}

function nuevoEnlace(){
   $("#btnAgregarEnlace").hide();$("#btnCancelarEnlace").show();
   $("#btnEliminarEnlace").hide();$("#btnGuardarEnlace").show();
	
   banderaEdicionObj = true;
	
   var selTipoEnlace = crearSelectOneMenuOblig("selTipoEnlace","", 
      listTipoEnlace,"","id","nombre");
	
   EnlaceCursoId = 0;
	
   $("#tblEnlCurso tbody").append(
      "<tr id='tr0'>" +
         "<td>"+selTipoEnlace+"</td>" +
	 "<td><input class='form-control' id='inputEnlNom'></td>" +
	 "<td><input class='form-control' id='inputEnlNomMos'></td>" +
	 "<td id='enlImagen0'></td>" +
	 "<td><input class='form-control' id='inputEnlObs'></td>" +
      "</tr>");
	
   formatoCeldaSombreableTabla(false,"tblEnlCurso");
	
   var options={
      container: "#enlImagen"+EnlaceCursoId,functionCall: function(){},
      descargaUrl: "",esNuevo: true,isImagen: true,
      idAux: "ImagenEnlace",evidenciaNombre: ""
   };
	
   crearFormEvidenciaCompleta(options);
}

function eliminarEnlace(){
   var EnlaceObj={
      id: EnlaceCursoId
   };
	
   var r = confirm("¿Está seguro de eliminar este Enlace?");
	
   if(r){
      callAjaxPost(URL+'/capacitacion/curso/enlace/delete',EnlaceObj,function(data){
         llamarEnlacesCurso();
      });
   }	
}

function guardarEnlace(){
   var nombre = $("#inputEnlNom").val();
   var observacion = $("#inputEnlObs").val();
   var tipo = $("#selTipoEnlace").val();
   var nombreMostrar = $("#inputEnlNomMos").val();
   var campoVacio = false;
	
   if(nombre.length == 0){
      campoVacio = true;
   }
	
   if(campoVacio){
      alert("Complete el campo")
   }else{
      var EnlaceObj={
	 id: EnlaceCursoId,nombreMostrar: nombreMostrar,
	 nombre: nombre,observacion: observacion,tipo: {id: tipo},
	 cursoCapacitacionId: cursoCapacitacionId
      };
		
      callAjaxPost(URL+'/capacitacion/curso/enlace/save',EnlaceObj,function(data){
         guardarEvidenciaAuto(data.nuevoId,"fileEviImagenEnlace",bitsEvidenciaArchivoCurso,
         '/capacitacion/curso/enlace/imagen/save',function(){
	    llamarEnlacesCurso();
         });
      });
   }	
}
