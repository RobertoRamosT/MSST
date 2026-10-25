
var listEstadosDiarioTrabajador=[];
var listEstadosTrabajadorCaso1=[];
var listEstadosTrabajadorCaso2=[];
var listEstadosTrabajadorFinal=[];
var listEstadosEntorno=[];
var mensajeFinalEstadoDiario;
var hasFormularioEstadoDiarioVigente;
var mensajeUx;

function habilitarEstadoDiario(hasSeccionActualCovid){
    
   var hoy = obtenerFechaActual(); 
    
   var dataParam={
 	   empresaId:getSession("gestopcompanyid"),
 	   trabajadorId:getSession("trabajadorGosstId")
   	         };
    
   var listPanelesPrincipal=[];
   
   callAjaxPost(URL + '/covid/estado_diario',dataParam,
    function(data){
       switch(data.CODE_RESPONSE){
          case "05":
              listEstadosDiarioTrabajador = data.listEstadosDiarioTrabajador;
              listEstadosTrabajadorCaso1 = data.listEstadosTrabajadorCaso1;
              listEstadosTrabajadorCaso2 = data.listEstadosTrabajadorCaso2;
              listEstadosEntorno = data.listEstadosEntorno;
              hasFormularioEstadoDiarioVigente = data.trabajadorCovid.hasFormularioEstadoDiarioVigente;
              mensajeFinalEstadoDiario = data.mensajeCovid.mensajeCompletarFormulario;
 	      $(".divListPrincipal").html("");
 	     
 	      var textTotal="";
 	      var registroEncabezado=0;
 	      var fechaUltimoGuardado="";
 	      
 	      if(listEstadosDiarioTrabajador == ''){
  		 fechaUltimoGuardado="<strong style='color:red'>Sin Registro</strong>";
  	      }
 	  
 	      listEstadosDiarioTrabajador.forEach(function(val,index){
 		  registroEncabezado++;
 		 
 		  if(registroEncabezado==1){
 		     fechaUltimoGuardado="<strong style='color:blue'>"+val.fechaGuardadoTexto+"</strong>";
 		  }
 	        
 		  var listTotal=[
 		          {sugerencia:"",label:"Fecha de registro: "+val.fechaGuardadoTexto,inputForm:""},
 		          {sugerencia:"",label:"<i class='fa fa-user'></i> Estado del trabajador :",inputForm:val.estadoTrabajadorCovid.nombre},
 		          {sugerencia:"",label:"<i class='fa fa-arrows'></i> Estado del entorno :",inputForm:val.estadoEntornoCovid.nombre}
	 		        ];
 				
 		  textTotal+="<div class='eventoGeneral'>";
 		  
 		 var count = 0;
 		   
 		  listTotal.forEach(function(val,index){
 		     count++;
 	   	     textTotal+=""+obtenerSubPanelModuloEstadoDiarioCovid(val,count);
 	   	  });
 		   
 		  textTotal+="</div>"
 		  textTotal+="<div class='divMovilEstadoDiarioCovid' id='divEstadoDiarioCovid"+val.id+"'></div>";
 	     });
 	      
 	     var userAgent = isMobile.any(); //se encuentra en el util.js
    	     
    	     var sizeLetter;
    	     
    	     if(userAgent == true){
    		sizeLetter = "14px;";
    	     }else{
    		sizeLetter = "18px;";
    	     }
 	     
    	     var textNuevo ="";
    	     
    	     textNuevo ="<div id='estadoMovilEstadoDiarioCovid'>" +
    	                   "<div class='tituloSubList'>Fecha de registro - Estado diario: " +fechaUltimoGuardado+"<br>"+
                              "<strong style='color:red;'>*Recuerde que debe renovarlo cada día.</strong><br>"+
                              "<button title='Nueva observación del estado actual' " +
                                      "class='btn btn-success' style='font-size:"+sizeLetter+"float:left;' " +
                                      "onclick='mensajePrevioFormularioEstadoDiario("+hasSeccionActualCovid+")'>"+
                                 "<i class='fa fa-pencil'></i> Registrar formulario" +
                              "</button>" +
    	                   "</div>" +
    	                   "<div class='contenidoSubList' style='display:none'>" +
    	                   "</div>" +
    	                "</div>";
    	     
    	    $(".divListPrincipal").append(textNuevo);
    	     
 	     listPanelesPrincipal.push(
 		{id:"infoMovilEstadoDiarioCovid",clase:"",
 	 	 nombre:""+"Formularios de estado diario registrados ("+listEstadosDiarioTrabajador.length+")",
 	         contenido:""+textTotal}
 	     );
 			
 	     agregarPanelesDivPrincipal(listPanelesPrincipal,"display:none");
 			
 	     $(".listaFinalGestionGosst").hide();
 	     $(".contenidoFormVisible").hide();
 	     break;
 	     
 	  default:
 	     alert("nop");
 	     break;
       }
       
    })
}

function mensajePrevioFormularioEstadoDiario(hasSeccionActualCovid){
    
   mensajeUx="<label style='color:black;'>Estimado(a), "+getSession("gestopusername")+"</label>" +
    	     "<br><br><label style='color:black;'>Recuerde que, de tus respuestas, depende la salud de tu familia y " +
 	  			           "también la salud de la familia de cada uno de tus compañeros.</label>" ;
 	  
   mensajesUx(mensajeUx,7,"","MensajePrevioEstDia");
    
   $("#modalMensajeUxMensajePrevioEstDia").on("hidden.bs.modal",function(){
      rellenarEstadoDiarioCovid(hasSeccionActualCovid);
   });  
 }

function rellenarEstadoDiarioCovid(hasSeccionActualCovid){
    
   switch(hasSeccionActualCovid){
      case 1:
	  listEstadosTrabajadorFinal = listEstadosTrabajadorCaso2;
          break;
  
      default:
	  listEstadosTrabajadorFinal = listEstadosTrabajadorCaso1;
	  break;
   }
    
    
   var selEstadosTrabajador = crearSelectOneMenu("selEstadosTrabajador","",listEstadosTrabajadorFinal,
	                                         "-1","id","nombre"); 
   
   var selEstadosEntorno = crearSelectOneMenu("selEstadosEntorno","",listEstadosEntorno,
                                                 "-1","id","nombre"); 
    
   var listItemsEstadoDiario=[ 
           {sugerencia:"",label:"1.- Estado Actual",inputForm:selEstadosTrabajador,divContainer:""},
           {sugerencia:"",label:"2.- Estado del entorno",inputForm:selEstadosEntorno,divContainer:""},
           {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success'style='float:right;'>" +
           		                        "<i aria-hidden='true' class='fa fa-floppy-o'></i>Guardar</button>"} 
             	             ];
   
   var textFormEstadoDiario="";
   
	
   listItemsEstadoDiario.forEach(function(val,index){
      textFormEstadoDiario+=obtenerSubPanelModulo(val);
   });
	
   var opciones={
	 id:"modalRellenarEstadoDiario",nombre:"Registro formulario estado diario - Covid-19",
	 contenido:"<form id='formRellenarEstadoDiario' class='eventoGeneral'>"+textFormEstadoDiario+"</form>"
   		 }
   
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   var editarDiv=$("#formRellenarEstadoDiario");
	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarEstadoDiarioCovid();
   });
}

function guardarEstadoDiarioCovid(){
    
    var textDiv = "#formRellenarEstadoDiario";
    
    var formDiv=$(textDiv);
    
    var campoVacio = true;
 	
    var valListEstadoTrabajador = parseInt(formDiv.find("#selEstadosTrabajador").val());
    var valListEstadoEntorno = parseInt(formDiv.find("#selEstadosEntorno").val());
    
    if(valListEstadoTrabajador == '-1' || valListEstadoEntorno == '-1'){
       campoVacio = false;
    }
    
    if(campoVacio){
       var dataParam={
	       id:0,
 	       estadoTrabajadorCovid:{id:valListEstadoTrabajador},
 	       estadoEntornoCovid:{id:valListEstadoEntorno},
 	       trabajadorId:getSession("trabajadorGosstId"),
 	       empresaId:getSession("gestopcompanyid")
 		      }

       callAjaxPost(URL+'/covid/estado_diario/save',dataParam, 
          function(data){
 	     switch(data.CODE_RESPONSE){
 	        case "05":  
 		    $("#modalRellenarEstadoDiario").remove();
 		    
 		    //mensajeUx="El formulario del estado diario fue registrado con éxito."
 		    mensajeUx="<label style='color:black;text-align:justify;'>"+mensajeFinalEstadoDiario+"</label>";
 		    mensajesUx(mensajeUx,8,"","ActualizarVistaEstDiaCov");
 		    
 		    $("#btnDevolverValorActualizarVistaEstDiaCov").on("click",function(){
 		       $("#modalMensajeUxCompletarObligatorio").modal("hide");
 		       $("#modalMensajeUxCompletarObligatorio").remove();
 		       habilitarEstadoDiario();   
 		    });
 		    break;
 		   
 	        default:
 		    alert("Ocurrió un error al guardar!");
 	    }
         }); 
    }else{
       $("#modalRellenarEstadoDiario").modal("hide");
       mensajeUx="Debe ingresar la información respectiva en todos los campos."
       mensajesUx(mensajeUx,2,"","AvisoCompletarCamposEstDiaCov");
       
       $("#btnDevolverValorAvisoCompletarCamposEstDiaCov").on("click",function(){
	  $("#modalMensajeUxAvisoCompletarCamposEstDiaCov").modal("hide");
	  $("#modalRellenarEstadoDiario").modal("show");  
       });
       
       $("#modalMensajeUxAvisoCompletarCamposEstDiaCov").on("hidden.bs.modal",function(){
	  $("#modalMensajeUxAvisoCompletarCamposEstDiaCov").modal("hide");
	  $("#modalRellenarEstadoDiario").modal("show");    
       });
    }
}

function obtenerSubPanelModuloEstadoDiarioCovid(val,count){
	
   var estiloDefault="";
 	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
       estiloDefault="    border-top: 1px solid #a5aaae;"
   }

    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
              (count == 1 ?"<label style='color:blue;' for='colFormLabel' class='col-sm-9 col-form-label'>"+val.label+"</label>":
        	  	   "<label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>")+
 	      (count == 1 ?"<div class='col-sm-3' id='"+val.divContainer+"'>"+val.inputForm+"":
 		           "<div class='col-sm-8' id='"+val.divContainer+"'>"+val.inputForm)+
 	        "<small>"+val.sugerencia+" </small>"+
 	     "</div>"+
 	  "</div>";
}

