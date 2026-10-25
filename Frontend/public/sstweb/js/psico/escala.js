/**
 * 
 */
var escalaId,escalaObj;
var banderaEdicion2=false;
var listFullEscalas;

$(function(){
   $("#btnNuevoEscala").attr("onclick", "javascript:nuevoEscala();");
   $("#btnCancelarEscala").attr("onclick", "javascript:cancelarNuevoEscalaPsico();");
   $("#btnGuardarEscala").attr("onclick", "javascript:guardarEscala();");
   $("#btnEliminarEscala").attr("onclick", "javascript:eliminarEscala();");
})
/**
 * 
 */

function volverEscalas(){
   $("#divGeneralPsicologia .container-fluid").hide();
   $("#divGeneralPsicologia #divContainEscalas").show();
   $( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Escalas de evaluación");
}

function cargarEscalasListaPsicologia() {
    
   var valorResize= 180;
   resizeDivWrapper("wrapperEscalas",valorResize);    
    
   $("#btnCancelarEscala").hide();
   $("#btnNuevoEscala").show();
   $("#btnEliminarEscala").hide();
   $("#btnGuardarEscala").hide();	
   volverEscalas();
   
   callAjaxPost(URL + '/psicologia/escalas', 
		{id: listaObj.id}, 
		function(data){
		   if(data.CODE_RESPONSE=="05"){
		         banderaEdicion2=false;
		         listFullEscalas=data.list; 
		         $("#tblEscalas tbody tr").remove();
			
		         listFullEscalas.forEach(function(val,index){			
			    $("#tblEscalas tbody").append(
			       "<tr id='tresc"+val.id+"' onclick='editarEscala("+index+")'>" +
				   "<td>"+(index+1)+"</td>"+
				   "<td id='escnom"+val.id+"'>"+val.nombre+"</td>"+  				 
			       "</tr>");
			 });
			 formatoCeldaSombreableTabla(true,"tblEscalas");
		   }else{
		      console.log("NOPNPO")
		   }
		   goheadfixedY("#tblEscalas","#wrapperEscalas");
	        });
}

function editarEscala(pindex) {
   if(!banderaEdicion2){
         formatoCeldaSombreableTabla(false,"tblEscalas");
	 escalaId = listFullEscalas[pindex].id;
	 escalaObj=listFullEscalas[pindex];
		
	 var nombre=listFullEscalas[pindex].nombre;
	 
	 $("#escnom" + escalaId).html("<input type='text' id='inputNombreEscala' class='form-control'>");
	 $("#inputNombreEscala").val(nombre);
	 //  
	 banderaEdicion2 = true;
	 $("#btnCancelarEscala").show();
	 $("#btnNuevoEscala").hide();
	 $("#btnEliminarEscala").show();
	 $("#btnGuardarEscala").show();	
   }
}

function nuevoEscala(){
   if(!banderaEdicion2){
         escalaId = 0; 
	 $("#tblEscalas:first tbody")
	       .prepend(
		   "<tr>" +
		      "<td>...</td>" +
		      "<td><input type='text' id='inputNombreEscala' class='form-control' autofocus></td>" + 
		   "</tr>");
		
	 $("#btnCancelarEscala").show();
	 $("#btnNuevoEscala").hide();
	 $("#btnEliminarEscala").hide();
	 $("#btnGuardarEscala").show(); 
	 banderaEdicion2 = true;
	 formatoCeldaSombreableTabla(false,"tblEscalas");
   }else{
       alert("Guarde primero.");
   }
}

function cancelarEscala() {
   cargarEscalasListaPsicologia();
}

function eliminarEscala() {
   var r = confirm("¿Está seguro de eliminar la escala?");
   if(r == true){
      var dataParam = {
	     id : escalaId,
      };
      
      callAjaxPost(URL + '/psicologia/escala/delete', dataParam,
		   function(data){
		      switch(data.CODE_RESPONSE){
		         case "05":
			     cargarEscalasListaPsicologia();
			     break;
			 
		         default:
			    alert("No se puede eliminar, hay items asociados a esta escala.");
		       }
		    });
	}
}

function guardarEscala() {

   var campoVacio = true;
   var nombre=$("#inputNombreEscala").val();   

   if(nombre.length<1 ){
         campoVacio = false;
   }

   if(campoVacio){
         var dataParam = {
		id: escalaId,
		nombre: nombre, 
		examenPsicologia: {id:listaObj.id}
	 };

	 callAjaxPost(URL + '/psicologia/escala/save', dataParam,
		      function(data){
		         switch(data.CODE_RESPONSE){
			    case "05":		
				cargarEscalasListaPsicologia();
			        break;
				
			        default:
				console.log("Ocurrió un error al guardar la escala!");
			  }
		       });	
     }else{
	 alert("Debe ingresar todos los campos.");
     }
}

function cancelarNuevoEscalaPsico(){
   cargarEscalasListaPsicologia();
}
