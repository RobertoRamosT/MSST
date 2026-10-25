var responsableId,responsableObj={},trabajadorAsociadoResponsableId;
var banderaEdicion4=false;
var listClasificacion=[{id:1,nombre:"DAF"},{id:2,nombre:"DINF"}];

//var listTrabajadoresResponsable;
var contadorListTrab;
var listFullResponsableSeguridad;
var mensajeUx;

$(function(){
	$("#btnNuevoResponsable").attr("onclick", "javascript:nuevoResponsable();");
	$("#btnCancelarResponsable").attr("onclick", "javascript:cancelarNuevoResponsable();");
	$("#btnGuardarResponsable").attr("onclick", "javascript:guardarResponsable();");
	$("#btnEliminarResponsable").attr("onclick", "javascript:eliminarResponsable();");
})
/**
 * 
 */

function cargarResponsablesSeguridad(){
   resizeDivWrapper("wrapResp",170);
    
   $("#btnCancelarResponsable").hide();$("#btnNuevoResponsable").show();$("#btnEliminarResponsable").hide();
   $("#btnGuardarResponsable").hide();$("#btnImportResponsable").show();
	
   trabajadorAsociadoResponsableId = null;
   volverDivResponsable();
   
   var dataParam={
      empresaId: getSession("gestopcompanyid")   
   };
	
   callAjaxPost(URL+'/contratista/responsables/vista_admin',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listFullResponsableSeguridad = data.listResponsableSeguridad;
//	 listTrabajadoresResponsable = data.trabajadores;
	 banderaEdicion4 = false;
	 $("#tblResponsables tbody tr").remove();
					
	 listFullResponsableSeguridad.forEach(function(val,index){
//	    var proyects = val.proyectos;
//	    var numActiv = 0;
//	    
//	    proyects.forEach(function(val2,index2){
//	       if(val2.isActivo == 1){
//	          numActiv++;
//	       }
//	    });
	    
	    var enviarCorreoInduccion = (val.enviarCorreoInduccion == 0?"No":"Sí"),
	        snCorreoSolRegProyTexto = (val.snCorreoSolRegProy == 1?"Sí":"No");
	
	    $("#tblResponsables tbody").append(
	       "<tr id='trtip"+val.id+"' onclick='editarResponsable("+index+")'>" +
	          "<td id='respnom"+val.id+"'>"+val.nombre+"</td>" +
		  "<td id='respcorreo"+val.id+"'>"+val.correo+"</td>" +
		  "<td id='respSnCorreoSolRegProyTexto"+val.id+"'>"+snCorreoSolRegProyTexto+"</td>" +
		  "<td id='respEnviarCorreoInd"+val.id+"'>"+enviarCorreoInduccion+"</td>" +
		  "<td id='tipobs"+val.id+"'>"+val.numProyectosAsigEnCurso+" / "+val.numProyectosAsigTotal+"</td>" +
	       "</tr>");
	 });
					
	 goheadfixedY("#tblResponsables","#wrapResp");
	 formatoCeldaSombreableTabla(true,"tblResponsables");
      }else{
         console.log("NOPNPO");
      }
   });
}

function editarResponsable(pindex){
    if(!banderaEdicion4){
        formatoCeldaSombreableTabla(false,"tblResponsables");
      
        responsableId = listFullResponsableSeguridad[pindex].id; 
        responsableObj = listFullResponsableSeguridad[pindex]
		
        $("#trtip"+responsableId).addClass("fila-edicion");
      
//      *********************** Trabajador *************************
        $("#respnom" + responsableId)
        .html("<input type='text' id='inputNombreResppp' class='form-control' " +
                     "placeholder='Ingresar un caracter para empezar la búsqueda.'>" +
	      "<div id='divAutoCompletarTrabResponsable'></div>");
      
        $("#inputNombreResppp").val(responsableObj.nombre);
        verAutoCompletarTrabResponsable();
        $("#selAutoTrabajador").val(responsableObj.trabajadorId);
//      ************************************************************
	 
        $("#respcorreo"+responsableId).html("<input type='text' id='inputCorreoResppp' class='form-control'>");
	$("#inputCorreoResppp").val(responsableObj.correo);
			
//	$("#tipobs"+responsableId).html("<a onclick='verProyectosResponsable()'>"+$("#tipobs"+responsableId).text()+"</a>");
	
	$("#respEnviarCorreoInd"+responsableId).html("<input type='checkbox' id='checkEnviarCorreoInduccion' class='form-control' " +
	    (responsableObj.enviarCorreoInduccion == 1?"checked":"")+">");
	
	$("#respSnCorreoSolRegProyTexto"+responsableId).html("<input id='checkSnCorreoSolRegProyResp' type='checkbox' class='form-control' " +
	    (responsableObj.snCorreoSolRegProy == 1?"checked":"")+">");
      
	banderaEdicion4 = true;
		
	$("#btnCancelarResponsable").show();$("#btnNuevoResponsable").hide();$("#btnEliminarResponsable").show();
	$("#btnGuardarResponsable").show();$("#btnGenReporte").hide();$("#btnImportResponsable").hide();
			//
//      trabajadorAsociadoResponsableId = responsableObj.trabajadorId;
//      
//      listTrabajadoresResponsable.forEach(function(val){
//         if(responsableObj.trabajadorId != null){
//	    if(val.trabajadorId == responsableObj.trabajadorId){
//	       $("#inputNombreResppp").val(val.nombre);
//	    }
//         }
//      });
//		
//      var listaTrabs = listarStringsDesdeArray(listTrabajadoresResponsable,"nombre");
//      
//      ponerListaSugerida("inputNombreResppp",listaTrabs,true);
//	
//      $("#inputNombreResppp").on("autocompleteclose",function(){
//         var nombreTrab = $("#inputNombreResppp").val();
//			
//         listTrabajadoresResponsable.every(function(val){
//	    if(val.nombre.trim()==nombreTrab.trim()){
//	       trabajadorAsociadoResponsableId=val.trabajadorId;
//	       $("#inputCorreoResppp").val(val.correo);
//	       return false;
//	    }
//	    return true;
//         });
//      });	
   }
}

function volverDivResponsable(){
   $("#tabResponsable .container-fluid").hide();
   $("#divContainResponsables").show();
   $("#tabResponsable h2").html("Responsables de Seguridad Interno")
}

function verProyectosResponsable(){ 
   $("#tabResponsable .container-fluid").hide();
   $("#divProyResponsable").show();
   $("#tblProyResponsable tbody").html("");
   $("#tabResponsable h2")
   .html("<a onclick='volverDivResponsable()'> Responsable "+responsableObj.nombre+"</a> > Proyectos")
	
   listFullResponsableSeguridad.forEach(function(val,index){ 
      if(val.id == responsableId){ 
         var proyects = val.proyectos;
	
         proyects.every(function(val2,index2){
	    $("#tblProyResponsable tbody").append(
	       "<tr id='"+val2.id+"'>" +
	          "<td id='"+val2.id+"'>"+val2.titulo+"</td>" +
		  "<td id='"+val2.id+"'>"+val2.postulante.contratista.nombre+"</td>" + 
		  "<td id='"+val2.id+"'>"+val2.fechaInicioTexto+"</td>" + 
		  "<td id='"+val2.id+"'>"+val2.fechaFinTexto+"</td>" + 
		  "<td id='"+val2.id+"'>"+(val2.isActivo == 1?
	             "Activo":val2.estado.nombre)+"</td>" + 
	       "</tr>");
	    
	    return true;
         });
      }
   });	
}

function nuevoResponsable(){
    if(!banderaEdicion4){
        responsableId = 0; 
	
        $("#tblResponsables tbody:first").prepend(
            "<tr id='0'>" +					
	        "<td>" +
	            "<input type='text' id='inputNombreResppp' class='form-control' " +
	                   "placeholder='Ingresar un caracter para empezar la búsqueda.'>" +
	            "<div id='divAutoCompletarTrabResponsable'></div>" +
	        "</td>" +
                "<td><input type='text' id='inputCorreoResppp' class='form-control'></td>" +
                "<td><input id='checkSnCorreoSolRegProyResp' type='checkbox' class='form-control'></td>" +
                "<td><input type='checkbox' id='checkEnviarCorreoInduccion' class='form-control'></td>" +
	        "<td>...</td>" +
            "</tr>");
		
//      var listaTrabs=listarStringsDesdeArray(listTrabajadoresResponsable,"nombre");
//      
//      ponerListaSugerida("inputNombreResppp",listaTrabs,true);
//		
//      $("#inputNombreResppp").on("autocompleteclose", function(){
//         var nombreTrab = $("#inputNombreResppp").val();
//         var correo;
//	 listTrabajadoresResponsable.every(function(val){
//	    if(val.nombre.trim() == nombreTrab.trim()){
//	       correo = val.correo;
//	       trabajadorAsociadoResponsableId = val.trabajadorId;
//	       responsableObj.nombre = val.nombre;
//	       $("#inputCorreoResppp").val(correo);
//	       return false;
//	    }
//	    return true;
//	 });
//      });
      
        $("#inputNombreResppp").attr("onkeyup","verAutoCompletarTrabResponsable()");
		
        formatoCeldaSombreableTabla(false,"tblResponsables");
		
        $("#btnCancelarResponsable").show();$("#btnNuevoResponsable").hide();$("#btnEliminarResponsable").hide();
        $("#btnGuardarResponsable").show();$("#btnGenReporte").hide();$("#btnImportResponsable").hide();
      
        banderaEdicion4 = true;
    }else{
        alert("Guarde primero.");
    }
}

var listTrabajadoresResponsableAux;

function verAutoCompletarTrabResponsable(){
   var nombre = $("#inputNombreResppp").val().trim();
	
   if(nombre == ""){
      nombre = null;
   }
	
   var dataParam={
      trabajadorNombre: "%"+nombre+"%",
      empresaId: getSession("gestopcompanyid")
   };
	
   callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
      if(data.trabajadores.length == 0){
	 data.trabajadores.push({
	    trabajadorId: -1,nombre: "Sin asignar",
	    correo: "",puesto: {positionName: ""}
		                });
	 
         $("#inputCorreoResppp").val("");
      }
		
      listTrabajadoresResponsableAux = data.trabajadores;
		
      crearSelectOneMenuObligUnitarioCompleto("selAutoTrabajador","completarDatosTrabajadorResp()",
	 listTrabajadoresResponsableAux,"trabajadorId","nombre","#divAutoCompletarTrabResponsable","");
      
      completarDatosTrabajadorResp();
		
      $("#inputNombreResppp").attr("onkeyup","verAutoCompletarTrabResponsable()");
   });
}

function completarDatosTrabajadorResp(){
   listTrabajadoresResponsableAux.forEach(function(val){
      if(val.trabajadorId == parseInt($("#selAutoTrabajador").val())){
         $("#inputCorreoResppp").val(val.correo);
      }
   });	 
}

function cancelarResponsable() {
   cargarTiposContratista();
}

function eliminarResponsable() {
    if(responsableObj.numProyectosAsigTotal == 0){
       var r = confirm("¿Está seguro de eliminar al responsable seleccionado?");
       
       if(r == true){
          var dataParam={
                 id: responsableId,
          		    };
    
          callAjaxPost(URL+'/contratista/responsable/delete',dataParam,function(data){
             switch(data.CODE_RESPONSE){
    	    case "05":
    	       cargarResponsablesSeguridad();
    	       break;
    					
    	    default:
    	       alert("Ocurrió un error al eliminar la programacion!");
             }
          });
       }
    }else{
	mensajeUx = "<label>No se puede borrar al responsable porque tiene proyectos asignados.</label>";
        mensajesUx(mensajeUx,2,"",""); 
    }
}

function guardarResponsable(){
   var campoVacio = true;
	
// var perdida = $("#slcClasificacion").val();  
   trabajadorAsociadoResponsableId = parseInt($("#selAutoTrabajador").val());
   var nombre = $("#inputNombreResppp").val();
   var correo = $("#inputCorreoResppp").val(); 
   var wantsEnviarCorreoInduccion = ($("#checkEnviarCorreoInduccion").prop("checked")?1:0);
    var snCorreoSolRegProy = ($("#checkSnCorreoSolRegProyResp").prop("checked")?1:0);
   
   if(trabajadorAsociadoResponsableId == -1 || nombre.length == 0){
      campoVacio = false;
   }
 
    if(campoVacio){
        var dataParam={
	    id:responsableId,nombre:nombre,correo:correo,enviarCorreoInduccion:wantsEnviarCorreoInduccion,trabajadorId:trabajadorAsociadoResponsableId,
	    empresaId:getSession("gestopcompanyid"),snCorreoSolRegProy:snCorreoSolRegProy
        };

      callAjaxPost(URL+'/contratista/responsable/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>El registro responsable fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"");
		 
	       cargarResponsablesSeguridad();
	       break;
						
	    default:
	        console.log("Ocurrió un error al guardar al responsable!");
         }
      });
   }else{
//      alert("Debe ingresar todos los campos.");
      mensajeUx = "Debe ingresar un caracter y seleccionar al trabajador " +
      		  "en la columna Nombre.";

      mensajesUx(mensajeUx,2,"");
   }	
}

function cancelarNuevoResponsable(){
   cargarResponsablesSeguridad();
}
