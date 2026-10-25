
var seccionInteresadaId,seccionInteresadaNombre;
var banderaEdicion88=false;
var listFullSeccionInteresadas;
var listTrabajadoresSeccionesInteresadas;
var listNivelesSeccionInteresada;

$(function(){
   $("#btnNuevoSeccionInteresada").attr("onclick", "javascript:nuevoSeccionInteresada();");
   $("#btnCancelarSeccionInteresada").attr("onclick", "javascript:cancelarNuevoSeccionInteresadaEmpresa();");
   $("#btnGuardarSeccionInteresada").attr("onclick", "javascript:guardarSeccionInteresada();");
   $("#btnEliminarSeccionInteresada").attr("onclick", "javascript:eliminarSeccionInteresada();");
})
/**
 * 
 */
function volverSeccionInteresadas(){
   $("#tabEmpresa .container-fluid").hide();
   $("#divContainSeccionInteresada").show(); 
   $("#tabEmpresa").find("h2")
      .html("<a onclick='volverVistaEmpresa()'>Empresa  :"+companyObj.name+"</a> > " +
			"Secciones Interesadas de evaluación");
}

function cargarSeccionInteresadasEmpresa(){
   resizeDivWrapper("wrapperSeccionInteresada",230);
   
   $("#btnCancelarSeccionInteresada").hide();
   $("#btnNuevoSeccionInteresada").show();
   $("#btnEliminarSeccionInteresada").hide();
   $("#btnGuardarSeccionInteresada").hide();
	
   volverSeccionInteresadas();
	
   callAjaxPost(URL+'/empresa/secciones_interesadas',{empresaId : getSession("gestopcompanyid")},function(data){
      if(data.CODE_RESPONSE=="05"){
         banderaEdicion88=false;
	 listFullSeccionInteresadas=data.list;
	 listTrabajadoresSeccionesInteresadas=data.listTrab;
	 listNivelesSeccionInteresada=data.listNivelesSeccionInteresada;
					
	 $("#tblSeccionInteresadas tbody tr").remove();
					
	 listFullSeccionInteresadas.forEach(function(val,index){
	    $("#tblSeccionInteresadas tbody")
	       .append("<tr id='trlis"+val.id+"' onclick='editarSeccionInteresada("+index+")'>" +
		          "<td id='seccnom"+val.id+"'>"+val.nombre+"</td>" +
			  "<td id='secctra"+val.id+"'>"+val.trabajadoresNombre+"</td>" +
			  "<td id='seccnivel"+val.id+"'>"+val.nivelSeccionInteresada.nombre+"</td>" +
		       "</tr>");
	 });
					
	 formatoCeldaSombreableTabla(true,"tblSeccionInteresadas");
	 goheadfixedY("#tblSeccionInteresadas","#wrapperSeccionInteresada");
      }else{
         console.log("NOPNPO")
      }
   });
}

function editarSeccionInteresada(pindex){
   if(!banderaEdicion88){
      formatoCeldaSombreableTabla(false,"tblSeccionInteresadas");
      seccionInteresadaId = listFullSeccionInteresadas[pindex].id;
      var seccionObj=listFullSeccionInteresadas[pindex];
		
      var descripcion=listFullSeccionInteresadas[pindex].nombre;
      seccionInteresadaNombre=descripcion;
			
      $("#seccnom"+seccionInteresadaId)
         .html("<input type='text' id='inputNombreSeccionInteresada' class='form-control'>");
         
      $("#inputNombreSeccionInteresada").val(descripcion);
      //
      
      var nivelSeccionInteresadaId=listFullSeccionInteresadas[pindex].nivelSeccionInteresada.id;
	
      var selNivelSeccionInteresada = crearSelectOneMenu("selNivelSeccionInteresada","",listNivelesSeccionInteresada,
	      						 nivelSeccionInteresadaId,"id","nombre");
      $("#seccnivel"+seccionInteresadaId).html(selNivelSeccionInteresada);
      
      //
      var listaSeccionTrab = seccionObj.trabajadoresId; //Secciones del Trabajador
      var listaIdsSeccionTrab=listaSeccionTrab.split(",");
		console.log(listaIdsSeccionTrab);
      listaIdsSeccionTrab.forEach(function (val){
         listTrabajadoresSeccionesInteresadas.forEach(function (val1){
            if(val==val1.trabajadorId){
	       val1.selected=1;
            }
         });
      });
		
      crearSelectOneMenuObligMultipleCompleto("selTrabSeccionInteresada","",listTrabajadoresSeccionesInteresadas,
	                             "trabajadorId","trabajadorNombre","#secctra"+seccionObj.id,"Trabajadores ...");	 
			
      banderaEdicion88 = true;
		
      $("#btnCancelarSeccionInteresada").show();
      $("#btnNuevoSeccionInteresada").hide();
      $("#btnEliminarSeccionInteresada").show();
      $("#btnGuardarSeccionInteresada").show();
      $("#btnGenReporte").hide();
			
   }	
}

function nuevoSeccionInteresada(){
   if(!banderaEdicion88){
      seccionInteresadaId = 0;
      var slcSeccionInteresada = crearSelectOneMenuOblig("slcSeccionInteresada","",listFullSeccionInteresadas,
	      						 "","id", "nombre");
      var selNivelSeccionInteresada = crearSelectOneMenu("selNivelSeccionInteresada", "",listNivelesSeccionInteresada,
	      						 "-1", "id", "nombre");
      
      $("#tblSeccionInteresadas tbody")
         .append("<tr>"	
		   +"<td>"+"<input type='text' id='inputNombreSeccionInteresada' class='form-control'>"
		        +"<td id='secctra0'>0</td>"
		   +"</td>"
		   + "<td>"+ selNivelSeccionInteresada+ "</td>"
	       + "</tr>");
		
      crearSelectOneMenuObligMultipleCompleto("selTrabSeccionInteresada","",listTrabajadoresSeccionesInteresadas,
	                                      "trabajadorId","trabajadorNombre","#secctra"+0,"Trabajadores ...");	 
			
      $("#btnCancelarSeccionInteresada").show();
      $("#btnNuevoSeccionInteresada").hide();
      $("#btnEliminarSeccionInteresada").hide();
      $("#btnGuardarSeccionInteresada").show();
      $("#btnGenReporte").hide();
      banderaEdicion88 = true;
      formatoCeldaSombreableTabla(false,"tblSeccionInteresadas");
   }else{
      alert("Guarde primero.");
   }
}

function cancelarSeccionInteresada(){
   cargarSeccionInteresadasEmpresa();
}

function eliminarSeccionInteresada(){
   var r = confirm("¿Está seguro de eliminar la seccionInteresada?");
	
   if(r==true){
      var dataParam={
	      id:seccionInteresadaId,
		    };
      
      callAjaxPost(URL+'/empresa/seccion_interesada/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	        cargarSeccionInteresadasEmpresa();
		break;
	    default:
		alert("No se puede eliminar, hay trabajadores asociados a esta seccion interesada.");
         }
      });
   }
}

function guardarSeccionInteresada() {

   var campoVacio = true;
   var descripcion=$("#inputNombreSeccionInteresada").val();  
   var listTrabInteresados=$("#selTrabSeccionInteresada").val(); 
   var selNivelSeccionInteresada= $("#selNivelSeccionInteresada").val();
   var listTrabInteresadosFinal=[];
	
   if(listTrabInteresados!=null){
      listTrabInteresados.forEach(function(val){
         listTrabInteresadosFinal.push({trabajadorId:parseInt(val)});
      });
   }

   if(descripcion.length<1 ){
	campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
	      id:seccionInteresadaId,
	      trabajadores:listTrabInteresadosFinal,
	      nombre:descripcion,
	      nivelSeccionInteresada:{id:selNivelSeccionInteresada},
	      empresa:{empresaId:getSession("gestopcompanyid")}
		    };

      callAjaxPost(URL+'/empresa/seccion_interesada/save',dataParam,
	 function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		   cargarSeccionInteresadasEmpresa();
		   break;
	       default:
		   console.log("Ocurrió un error al guardar la seccionInteresada!");
	    }
      });		
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function cancelarNuevoSeccionInteresadaEmpresa(){
   cargarSeccionInteresadasEmpresa();
}
