var objBitacoraContactoCovid={};
var listBitacoraContactoCovid=[];
var listTipoPersonaContacto=[];
var indexBitacoraContactoCovid;
var mensajeUx;
var banderaEdicionRegistroAux=false;
var opcionRegistroBitCon;
var registroBitacoraContactoId,registroBitacoraContactoObj={};
var listFullRegistroBitacoraContacto=[];

function toggleMenuOpcionBitacoraContactoCovid(obj,pindex){
    objBitacoraContactoCovid=listBitacoraContactoCovid[pindex]; 
    indexBitacoraContactoCovid=pindex;
    $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
    $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesBitacoraContactoCovid=[
     {id:"opcEditar", nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",functionClick:function(data){pruebaNuevaBitacoraContacto(1)}},
     {id:"opcElimnar", nombre:"<i class='fa fa-times'></i> Eliminar",functionClick:function(data){eliminarBitacoraContactoCovid()}}
                                         ]

function marcarSubOpcionBitacoraContactoCovid(pindex){
    funcionalidadesBitacoraContactoCovid[pindex].functionClick();
    $(".subDetalleAccion ul").hide();
    $(".listaFinalGestionGosst").hide();
}

function habilitarBitacoraContactoCovid(){
    
    var dataParam={
	    id:null,
 	    empresaId:getSession("gestopcompanyid"),
 	    trabajadorId:getSession("trabajadorGosstId")
    };
    
    var listPanelesPrincipal=[];
    
    
    callAjaxPost(URL + '/covid/bitacora_contacto_covid',dataParam,
    function(data){
       switch(data.CODE_RESPONSE){
          case "05":
 	     var textIn= "";
 			
 	     listBitacoraContactoCovid=data.listBitacoraContactoCovid;
 	     listTipoPersonaContacto = data.listTipoPersonaContacto;
 	     $(".divListPrincipal").html("");
 	     
 	     var textTotal="";
 	      
 	     var registroEncabezado=0;
 	  
 	     listBitacoraContactoCovid.forEach(function(val,index){
 	       registroEncabezado++;
 	       var menuOpcion="";
 	       var btnOpcion="";
 	        
 	       var menuOpcion="<ul class='list-group listaFinalGestionGosst' >";
 		
 		
 	       funcionalidadesBitacoraContactoCovid.forEach(function(val1,index1){
 		  menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionBitacoraContactoCovid("+index1+")'>"+val1.nombre+" </li>";
 	       });
 		
 	       menuOpcion+="</ul>";
 			
 	       var btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionBitacoraContactoCovid(this,"+index+")'>" +
 			       "<i class='fa  fa-caret-down' aria-hidden='true'></i>Ver Opciones</a>" ;
 		 	
 	       var listTotal=[
 		       {sugerencia:"",label:"Fecha de registro: "+val.fechaRegistroActualizacionTexto,inputForm:btnOpcion+menuOpcion},
 		       {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha de la bitácora :",inputForm:val.fechaBitacoraTexto},
 		       {sugerencia:"",label:"<i class='fa fa-puzzle-piece'></i> Número de personas contactadas :",inputForm:val.numPersonasContactadas}
 			     ];
 				
 	       textTotal+="<div class='eventoGeneral'>";	   					
 	       var count=0;
 		   
 	       listTotal.forEach(function(val,index){
 	          count++;
 	   	  textTotal+=""+obtenerSubPanelModuloBitacoraContactoDatos(val,count);
 	       });
 		   
 	       textTotal+="</div>"
 	       textTotal+="<div class='divMovilBitacoraContactoCovid' id='divBitacoraContactoCovid"+val.id+"'></div>";
 	     });
 	     
 	     
    	     var textNuevo ="";
    	      
    	     textNuevo ="<div id='estadoMovilFechaActualizacionBitConCov'>" +
    	                   "<div class='tituloSubList'>Nuevo registro en la bitácora de contacto "+
    	                      "<button style='font-size:18px;' title='Nueva bitácora contacto' " +
    	                      	      "class='btn btn-success' onclick='pruebaNuevaBitacoraContacto(0)'>"+
    	                         "<i class='fa fa-plus-square'></i> Nuevo" +
    	                      "</button>" +
    	                   "</div>" +
    	                   "<div class='contenidoSubList' style='display:none'>" +
    	                   "</div>" +
    	                "</div>";
    	     
    	     $(".divListPrincipal").append(textNuevo);
    	 
 	     listPanelesPrincipal.push(
 		{id:"infoMovilBitacoraContactoCovid",clase:"",
 	 	 nombre:""+"Bitácoras de contacto registradas ("+listBitacoraContactoCovid.length+")",
 	         contenido:""+textTotal}
 	     );
 			
 	     agregarPanelesDivPrincipalCovid(listPanelesPrincipal,"display:none");
 			
 	     $(".listaFinalGestionGosst").hide();
 	     $(".contenidoFormVisible").hide();
 	     break;
 	     
 	  default:
 	     alert("nop");
 	     break;
       }
       
    })
}

/*function rellenarBitacoraContactoCovid(val){
    
    var count = 0;
    var funcionBasica = val;

    if(funcionBasica == 1){
       objBitacoraContactoCovid={id:0};
    }
   
    var listItemsExam=[
           {sugerencia:"",label:"*Fecha y hora de registro",inputForm:obtenerFechaActualTotal(),divContainer:""},
           {sugerencia:"",label:"*Fecha de la bitácora",
            inputForm:"<input type='date' id='inputFechaBitacoraBitConCov' class='form-control'>",divContainer:""},
 	   {sugerencia:"",label:"*Definición de contacto ",
            inputForm:"'Persona con quien haya interactuado a una distancia menor a 2 metros.'",divContainer:""},
           {sugerencia:"",label:"",
            inputForm:"<textarea name='textarea' id='textAreaDefinicionContactoBitConCov' rows='12' cols='75'></textarea>",divContainer:""},
 	   {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'style='float:right;'><i aria-hidden='true' class='fa fa-floppy-o'></i>Guardar</button>"} 
 	             ];
    
    var textFormExamen="";
 	
    listItemsExam.forEach(function(val,index){
       count++;
       textFormExamen+=obtenerSubPanelModuloBitacoraContacto(val,count);
    });
 	
    var opciones={
 	 id:"modalEditarBitacoraContactoCovid",nombre:"Registro bitácora de contacto - Covid-19",
 	 contenido:"<form id='formEditarBitacoraContactoCovid' class='eventoGeneral'>"+textFormExamen+"</form>"
    		 }
    
    crearModalPrincipalUsuario(opciones,function(){},false,true);
 	
    var editarDiv=$("#formEditarBitacoraContactoCovid");
 	
    editarDiv.on('submit',function(e){  
       e.preventDefault();
       guardarBitacoraContactoCovid();
    });
    
    if(objBitacoraContactoCovid.id == 0){
       $('#modalEditarBitacoraContactoCovid').on('hidden.bs.modal',function(e){
          mensajeUx="Debe completar el formulario Registro bitácora de contacto - Covid-19 antes de continuar.";
	  mensajesUx(mensajeUx,4,"","CompletarObligatorioBitConCov");
	   
	  $("#modalMensajeUxCompletarObligatorioBitConCov").on("hidden.bs.modal",function(){
             $("#modalEditarBitacoraContactoCovid").modal("show");
	  });
	});
    }
    
    if(objBitacoraContactoCovid.id > 0){
       editarDiv.find("#inputFechaBitacoraBitConCov").val(objBitacoraContactoCovid.fechaBitacora);
       editarDiv.find("#textAreaDefinicionContactoBitConCov").val(objBitacoraContactoCovid.definicionContacto);
       
    }
}
*/

function pruebaNuevaBitacoraContacto(opcion){
   
   opcionRegistroBitCon = opcion;
   console.log(opcionRegistroBitCon);
   //opción -> 0 = Nuevo registro , 1 = Editar Registro
    
   if(opcionRegistroBitCon == 0){
      objBitacoraContactoCovid={id:0};
   }
   
   console.log(objBitacoraContactoCovid.id);
    
    var listModal = {id:"modalBitacoraContacto",nombre:"Bitácora de contacto",contenido:
	   "<button class='btn btn-success' id='btnNuevoRegistroBitCon' title='Nuevo registro en la actual bitácora' onclick='nuevoRegistroBitacoraContacto()'><i class='fa fa-plus fa-2x'></i></button>" +
	   "<button class='btn btn-success' id='btnCancelarRegistroBitCon' style='margin-left: 5px' title='Cancelar acción' onclick='cancelarRegistroBitacoraContacto()'><i class='fa fa-sign-out fa-rotate-180 fa-2x'></i></button>" +
	   "<button class='btn btn-success' id='btnGuardarRegistroBitCon' style='margin-left: 5px' title='Guardar el nuevo registro en la actual bitácora.' " +
	           "onclick='"+(objBitacoraContactoCovid.id == 0 ?"guardarBitacoraContactoCovid()":"guardarRegistroBitacoraContacto()")+"'><i class='fa fa-floppy-o fa-2x'></i></button>" +
	   "<button class='btn btn-success' id='btnEliminarRegistroBitCon' style='margin-left: 5px' title='Eliminar el nuevo registro en la actual bitácora.'><i class='fa fa-times fa-2x'></i></button>" +
	   "<div class='wrapper' id='wrapBitacoraContacto'>" +
	      "<table id='tblBitacoraContacto' " +
		     "class='table table-striped table-bordered table-hover table-fixed'>" +
	         "<thead>" +
		    "<tr>" +
		       "<td class='tb-acc' style='width:120px'>Tipo</td>" +
		       "<td class='tb-acc' style='width:120px'>Nombre</td>" +
		       "<td class='tb-acc' style='width:120px'>Detalle</td>" +
		    "</tr>" +
		 "</thead>" +
		 "<tbody></tbody>" +
	      "</table>"};
	
    agregarModalPrincipalUsuarioBitacoraContacto(listModal);
    resizeDivWrapper("wrapBitacoraContacto",320);
    goheadfixedY("#tblBitacoraContacto","#wrapBitacoraContacto");
    
    banderaEdicionRegistroAux = false;
    
    if(opcionRegistroBitCon != 0){
    
    var dataParamAux={
	    bitacoraContactoCovidId: objBitacoraContactoCovid.id
    };
    
    
    callAjaxPost(URL+'/covid/bitacora_contacto_covid/detalle',dataParamAux,function(data){
       switch(data.CODE_RESPONSE){
          case "05":
 	      var textIn= "";
 			
 	      listFullRegistroBitacoraContacto = data.listBitacoraContactoDetalle;
 	      
 	      $("#tblBitacoraContacto tbody tr").remove();
 	    
 	      listFullRegistroBitacoraContacto.forEach(function(val,index){
		 $("#tblBitacoraContacto tbody").append(
	            //Editar sufijo
		    "<tr id='trRegistroBitacoraContacto"+val.id+"' onclick='editarRegistroBitacoraContacto("+index+")'>" +
		       "<td id='tdtipoperconregbitcon"+val.id+"'>"+val.tipoPersonaContacto.nombre+"</td>" +
		       "<td id='tdnombreregbitcon"+val.id+"' style='word-break: break-all;'>"+val.nombre+"</td>" +
		       "<td id='tddescripcionregbitcon"+val.id+"' style='word-break: break-all;'>"+val.detalle+"</td>" +
		    "</tr>");
		});
 	      formatoCeldaSombreableTabla(true,"tblBitacoraContacto");
 	     break;
 	     
          default:
 	     alert("nop");
 	  break;
       }
       goheadfixedY("#tblBitacoraContacto","#wrapBitacoraContacto");
    })
   }
}

function nuevoRegistroBitacoraContacto(){
    
   if(!banderaEdicionRegistroAux){
      formatoCeldaSombreableTabla(false,"tblBitacoraContacto");
      registroBitacoraContactoObj = {id : 0};
	
      var selTipoPersonaContactoDetCon = crearSelectOneMenu("selTipoPersonaContactoDetCon", "",
	     listTipoPersonaContacto, "-1", "id", "nombre");
	
      $("#tblBitacoraContacto tbody")
      .prepend("<tr id='trRegistroBitacoraContacto0'>" +
	          "<td>"+ selTipoPersonaContactoDetCon+ "</td>" +
		  "<td><input type='text' id='inputNombreDetCon' class='form-control'></td>" +
		  "<td><input type='text' id='inputDetalleDetCon' class='form-control'></td>" +
	       "</tr>");
	
      $("#btnCancelarRegistroBitCon").show();
      $("#btnNuevoRegistroBitCon").hide();
      $("#btnEliminarRegistroBitCon").hide();
      $("#btnGuardarRegistroBitCon").show();
      banderaEdicionRegistroAux = true;
      
   }else{
      alert("Guarde primero.");
   }
}

function editarRegistroBitacoraContacto(pindex){
	
   if(!banderaEdicionRegistroAux){
      formatoCeldaSombreableTabla(false,"tblBitacoraContacto");
      registroBitacoraContactoId = listFullRegistroBitacoraContacto[pindex].id;
      registroBitacoraContactoObj = listFullRegistroBitacoraContacto[pindex];
		
      $("#trRegistroBitacoraContacto"+registroBitacoraContactoId).addClass("fila-edicion");
		
      $("#tdnombreregbitcon"+registroBitacoraContactoId).html("<input type='text' id='inputNombreDetCon' class='form-control'>");
      $("#inputNombreDetCon").val(registroBitacoraContactoObj.nombre);
		
      $("#tddescripcionregbitcon"+registroBitacoraContactoId).html("<input type='text' id='inputDetalleDetCon' class='form-control'>");
      $("#inputDetalleDetCon").val(registroBitacoraContactoObj.detalle);
			
      var tipoPersonaContactoId = listFullRegistroBitacoraContacto[pindex].tipoPersonaContacto.id;
		
      var selTipoPersonaContactoDetCon = crearSelectOneMenu("selTipoPersonaContactoDetCon","",
	     listTipoPersonaContacto,tipoPersonaContactoId,"id","nombre");
      $("#tdtipoperconregbitcon"+registroBitacoraContactoId).html(selTipoPersonaContactoDetCon);
	        
                
      banderaEdicionRegistroAux = true;
      $("#btnCancelarRegistroBitCon").show();
      $("#btnNuevoRegistroBitCon").hide();
      $("#btnEliminarRegistroBitCon").show();
      $("#btnGuardarRegistroBitCon").show();
      $("#btnActualizarRegistroBitCon").hide();
   }
}

function cancelarRegistroBitacoraContacto(){
   if(objBitacoraContactoCovid.id == 0){
      pruebaNuevaBitacoraContacto(0);
   }else{
      pruebaNuevaBitacoraContacto(1);
   }
}

function guardarBitacoraContactoCovid(){
    
    var campoVacio = true;
     
       var fechaBitacora = convertirFechaTexto($("#inputFechaBitacoraBitConCov").val());
       var inputFechaBitacora;
       
       if(!fechaBitacora){  
          inputFechaBitacora = null;
       }else{
 	 inputFechaBitacora = fechaBitacora;
       }
       
       if(inputFechaBitacora == null){
          campoVacio = false;
       }
     
       if(campoVacio){
          var dataParam={
  	         id:objBitacoraContactoCovid.id,
  	         fechaBitacora:inputFechaBitacora,
  	         trabajadorId:getSession("trabajadorGosstId"),
  	         empresaId:getSession("gestopcompanyid")
  		       }

        callAjaxPost(URL+'/covid/bitacora_contacto_covid/save',dataParam, 
           function(data){
  	     switch(data.CODE_RESPONSE){
  	        case "05":  
  	            opcionRegistroBitCon = 1;
  	            objBitacoraContactoCovid={id:data.bitacoraContactoCovidAux.id,
  	               fechaBitacoraTexto:data.bitacoraContactoCovidAux.fechaBitacoraTexto,
  	               fechaRegistroActualizacionTexto:data.bitacoraContactoCovidAux.fechaRegistroActualizacionTexto};
  	            console.log("Bitácora creada.");
  	            guardarRegistroBitacoraContacto();
  		    break;
  		   
  	        default:
  		    alert("Ocurrió un error al guardar!");
  	    }
          }); 
       }else{
          $("#modalBitacoraContacto").modal("hide");
          mensajeUx="Debe ingresar la fecha de la bitácora."
          mensajesUx(mensajeUx,2,"","AvisoCompletarCampoBitCon");
 	       
 	 $("#modalMensajeUxAvisoCompletarCampoBitCon").on("hidden.bs.modal",function(){
             $("#modalBitacoraContacto").modal("show");    
 	 });
       }
}

function guardarRegistroBitacoraContacto(){

   var campoVacio = true;
  
      var valListTipoPersonaContacto= $("#selTipoPersonaContactoDetCon").val();
      var nombreDetCon=$("#inputNombreDetCon").val();
      var detalleDetCon=$("#inputDetalleDetCon").val();
      
      if(valListTipoPersonaContacto == -1 || nombreDetCon == '' || detalleDetCon == ''){
	 campoVacio = false;
      }
      
      if(campoVacio){
         var dataParam={
	 	 id:registroBitacoraContactoObj.id,
	 	 bitacoraContactoCovidId:objBitacoraContactoCovid.id,
	 	 tipoPersonaContacto:{id:valListTipoPersonaContacto},
	 	 nombre:nombreDetCon,
	 	 detalle:detalleDetCon
	 	       }

         callAjaxPost(URL+'/covid/bitacora_contacto_covid/detalle/save',dataParam,function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":  
	          pruebaNuevaBitacoraContacto(1);
	          console.log("Registros de bitácora creado.");
	          break;
	 		   
	       default:
	 	  alert("Ocurrió un error al guardar!");
	    }
         }); 
      }else{
         $("#modalBitacoraContacto").modal("hide");
	 mensajeUx="Debe ingresar completar todos los campos."
	 mensajesUx(mensajeUx,2,"","AvisoCompletarCamposTablaBitCon");
		       	
	 $("#modalMensajeUxAvisoCompletarCamposTablaBitCon").on("hidden.bs.modal",function(){
	    $("#modalBitacoraContacto").modal("show");    
	 });
      } 
}
 
function eliminarBitacoraContactoCovid(){
    
}


/*function eliminarBitacoraContactoCovid(){
    
    mensajeUx="¿Está seguro de eliminar el registro en la bitácora de contacto seleccionado?";

    mensajesUx(mensajeUx,3,"","EliminarBitConCov");

    $("#btnDevolverValorEliminarBitConCov").on("click",function(){
       var dataParam = {
 	      id:objBitacoraContactoCovid.id
       };

       callAjaxPost(URL+'/covid/bitacora_contacto_covid/delete',dataParam,function(data){
          switch(data.CODE_RESPONSE){
 	    case "05":
 		mensajeUx="El registro en la bitácora de contacto seleccionado fue eliminado con éxito."
  		mensajesUx(mensajeUx,1,"","EliminarVistaBitConCov");
 		
  		$("#modalMensajeUxEliminarVistaBitConCov").on("hidden.bs.modal",function(){
   		   habilitarBitacoraContactoCovid();     
  		});
 		break;
 		
 	    default:
 		alert("Ocurrió un error al eliminar la bitácora!");
          }
       });
    });
 }
function guardarBitacoraContactoCovid(){
   
   var textDiv = "#formEditarBitacoraContactoCovid";
    
   var formDiv=$(textDiv);
    
   var campoVacio = true;
   
   var definicionContacto = formDiv.find("#textAreaDefinicionContactoBitConCov").val();
   var fechaBitacora = convertirFechaTexto(formDiv.find("#inputFechaBitacoraBitConCov").val());
   
   if(campoVacio){
      var dataParam={
	       id:objBitacoraContactoCovid.id,
	       definicionContacto:definicionContacto,
	       fechaBitacora:fechaBitacora,
	       trabajadorId:getSession("trabajadorGosstId"),
	       empresaId:getSession("gestopcompanyid")
		      }

      callAjaxPost(URL+'/covid/bitacora_contacto_covid/save',dataParam, 
         function(data){
	     switch(data.CODE_RESPONSE){
	        case "05":  
		    $("#modalEditarBitacoraContactoCovid").remove();
		    
		    mensajeUx="La bitácora de contacto fue registrada con éxito."
		    mensajesUx(mensajeUx,1,"","ActualizarVistaBitConCov");
		    
		   
		       $("#modalMensajeUxActualizarVistaBitConCov").on("hidden.bs.modal",function(){
	 	          $("#modalMensajeUxCompletarObligatorioBitConCov").modal("hide");
	  		  $("#modalMensajeUxCompletarObligatorioBitConCov").remove();
	  		     habilitarBitacoraContactoCovid();
	 	       });
		    break;
		   
	        default:
		    alert("Ocurrió un error al guardar!");
	    }
        }); 
   }else{
       
   }
}
*/
function obtenerSubPanelModuloBitacoraContacto(val,count){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px dashed #a5aaae;"
	}
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	          (count == 4 ?"<label for='colFormLabel' class='col-sm-0 col-form-label'>":
	              	      "<label for='colFormLabel' class='col-sm-4 col-form-label'>")+val.label+"</label>"+
	          (count == 4 ?"<div class='col-sm-12' id='"+val.divContainer+"'>":
	              	       "<div class='col-sm-8' id='"+val.divContainer+"'>")+" "+val.inputForm+
	          "<small>"+val.sugerencia+" </small>"+
	          "</div>"+
	      "</div>";
}
 
function obtenerSubPanelModuloBitacoraContactoDatos(val,count){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px dashed #a5aaae;"
	}
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	          (count == 1 ?"<label style='color:blue;' for='colFormLabel' class='col-sm-9 col-form-label'>":
	              	      "<label for='colFormLabel' class='col-sm-4 col-form-label'>")+val.label+"</label>"+
	          (count == 1 ?"<div class='col-sm-3' id='"+val.divContainer+"'>":
	              	       "<div class='col-sm-8' id='"+val.divContainer+"'>")+" "+val.inputForm+
	          "<small>"+val.sugerencia+" </small>"+
	          "</div>"+
	      "</div>";
}

function agregarModalPrincipalUsuarioBitacoraContacto(modalOptions,functionCallBack,isStatic){
	
   $(".modal-backdrop").remove();
   $("#"+modalOptions.id).remove();
   $("body").append("<div class='modal' id='"+modalOptions.id+"' role='dialog'>"+

   "<div class='modal-dialog modal-dialog-centered' style='width:100%;max-width: 700px;'>"+
      "<div class='modal-content'>"+
         "<div class='modal-header'>"+
            "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
            "<h4 class='modal-title'>"+modalOptions.nombre+"</h4>"+
         "</div>"+
         
         "<div class='form-group row'>"+
            "<label for='colFormLabel' class='col-sm-4 col-form-label'" +
            	   "style='margin-left:30px;margin-top:10px;font-size:17px;'>*Fecha y hora del registro</label>"+
               "<div class='col-sm-6' style='margin-left: 30px;margin-top:10px;font-size:17px;'>"+
               (opcionRegistroBitCon == 0?obtenerFechaActualTotal():
			   		  objBitacoraContactoCovid.fechaRegistroActualizacionTexto)+
               "</div>"+
         "</div>"+
         
         "<div class='form-group row'>"+
         "<label for='colFormLabel' class='col-sm-4 col-form-label'" +
                "style='margin-left:30px;font-size:17px;'>*Fecha de la bitácora</label>"+
            "<div class='col-sm-6' style='margin-left:30px;"+(opcionRegistroBitCon == 0 ?"":"font-size:17px;")+"'>" +
               (opcionRegistroBitCon == 0 ?"<input type='date' id='inputFechaBitacoraBitConCov' class='form-control'>":
        	   			    objBitacoraContactoCovid.fechaBitacoraTexto)+
            "</div>"+
        "</div>"+
         
         "<div class='modal-body'>"+
             modalOptions.contenido+
         "</div>"+
         
         (opcionRegistroBitCon == 0 ?"":
        	                     "<button class='btn btn-success' id='btnActualizarRegistroBitCon' title='Actualizar la bitácora' " +
         		                     "style='margin-left:500px;'><i class='fa fa-refresh fa-2x'></i> Actualizar bitácora</button>") +
	   
      "</div>"+
   "</div>");
   
   $("#"+modalOptions.id).on('shown.bs.modal', functionCallBack);
   if(isStatic){
      $('#'+modalOptions.id).modal({
         keyboard: true,
         show : true,
         backdrop : false
      })	
   }else{
      $("#"+modalOptions.id).modal("show");
   }
   

   $("#btnActualizarRegistroBitCon").on("click",function(){
      $("#modalBitacoraContacto").modal("hide");
      habilitarBitacoraContactoCovid();
   });
   
   $("#btnCancelarRegistroBitCon").hide();
   $("#btnGuardarRegistroBitCon").hide();
   $("#btnEliminarRegistroBitCon").hide();
}
