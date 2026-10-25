/**
 * 
 */
var contratistaId;
var listFullHojasQuimicas, listTipoNota;
var mensajeUx;
 
function habilitarHojaQuimicaContratista(){

   contratistaId = parseInt(getSession("contratistaGosstId"));
   
   var dataParam={ 
	  id:contratistaId
                 }
   
   callAjaxPost(URL+'/contratista/hojaquimica',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	     var listPanelesPrincipal=[];
	     var numHojas=0;
	     var textNuevo="",txtLista="";
	     var fechaReg = getSession("fechaHoyTexto");  
			
	     listFullHojasQuimicas=data.list;   
	     listTipoNota=data.tipo;
			
	     var selTipo=crearSelectOneMenuOblig("inputTipoEvaluacion","",listTipoNota,"","id","nombre") 
			 
	     $(".divListPrincipal").html("");
			
	     txtNuevo="<div style='border: 2px solid #2e9e8f;'class='eventoGeneral'>" +
		         "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Nombre del Producto Químico (PQ):</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaNombre' class='form-control'>"+
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
		            "<section class='col col-xs-6'>" +
			       "<strong>Usado para:</strong>"+
		            "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaUso' class='form-control'>"+
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Peligros Asociados al uso del PQ:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaPeligro' class='form-control'>"+
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Puestos que manipularán el PQ:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaPuesto' class='form-control'>"+
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Equipo de Proteccion necesario:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaEppNecesario' class='form-control'>"+	
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Evidencia (Hoja MSDS):</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6' id='evi0'>" + 
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='border-top: 2px solid #2e9e8f;margin-top:10px; " +
			      "margin-left:0px;margin-right:0px;padding-bottom:15px;'>" +
			 "</div>"+
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Fecha Registrada:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6' id='evi0'>" +
			        fechaReg+
			    "</section>"+ 
			 "</div>"+ 
		       /*"<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Evaluacion del cliente:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6' id='evi0'>" +
			        selTipo+
			    "</section>"+ 
			 "</div>"+ 
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<strong>Observación del cliente:</strong>"+
			    "</section>"+ 
			    "<section class='col col-xs-6'>" +
			       "<input type='text' id='inputHojaObs' class='form-control'>"+
			    "</section>"+ 
			 "</div>"+ */
			 "<div class='row' style='padding-bottom:15px;'>" +
			    "<section class='col col-xs-6'>" +
			       "<button class='btn btn-success' onclick='guardarHojaQuimica()'>" +
			          "<i class='fa fa-save'></i> Guardar" +
			       "</button>"
			    "</section>"+ 
			 "</div>"+ 
	              "</div>";
	     
	     listFullHojasQuimicas.forEach(function(val,index){ 
	        numHojas++;  
	        txtLista+="<div class='row' style='padding-bottom:15px;'>" +
			     "<section class='col col-xs-6'>" +
			        "<i class='fa fa-flask'></i>"+"<strong>Nombre del Producto Químico (PQ):</strong>"+
			     "</section>"+ 
			     "<section class='col col-xs-6'>" +
			         val.nombre+
			     "</section>"+ 
			  "</div>"+  
		          "<div class='row' style='padding-bottom:15px;'>" +
			     "<section class='col col-xs-6'>" +
			        "<i class='fa fa-indent'></i>"+"<strong>Usado para:</strong>"+
			     "</section>"+ 
			     "<section class='col col-xs-6'>" +
			         val.uso+
			     "</section>"+ 
			  "</div>"+  
			  "<div class='row' style='padding-bottom:15px;'>" +
			     "<section class='col col-xs-6'>" +
			        "<i class='fa fa-download'></i>"+"<strong>Evidencia(PQ):</strong>"+
			     "</section>"+ 
			     "<section class='col col-xs-6'>" +
			        "<a class='efectoLink' href='"+URL+"/contratista/hojaquimica/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>"+
			     "</section>"+ 
			  "</div>"+  
			  "<div class='row' style='border-top: 2px solid #2e9e8f;margin-top:10px; " +
			       "margin-left:0px;margin-right:0px;padding-bottom:15px;'>" +
			  "</div>"  ; 
	     }); 
			
	     listPanelesPrincipal
	     .push({id:"nuevaHojaQuimica",clase:"",nombre:""+"Nueva Hoja MSDS",
		    contenido:"<div class='eventoGeneral divNuevaHoja'>"+ 
			          txtNuevo+
			      "</div>"},
		   {id:"HojasRegistradas",clase:"",nombre:""+"Hojas MSDS Registradas ("+numHojas+")",
		    contenido:"<div class='eventoGeneral divHojasRegistradas'>"+ 
			          (numHojas==0?"<label style='color:#2e9e8f; font-size:17px;'>"+
					          "<strong>Sin Hojas... </strong>"+
					       "</label>":txtLista)+
			      "</div>"}); 
		  
	     agregarPanelesDivPrincipal(listPanelesPrincipal); 
			
	     var options={
		    container:"#evi0",
		    functionCall:function(){},
		    descargaUrl:"",
		    esNuevo:true,
		    idAux:"HojaMsds",
		    evidenciaNombre:""
			 }
	     
	     crearFormEvidenciaCompleta(options);
	     break;
	
         default:
	     alert("nop");
             break;
      }
   });
} 

function guardarHojaQuimica(){
   var campoVacio = true;
   var nombre = $("#inputHojaNombre").val();  
   var uso = $("#inputHojaUso").val();  
   var peligro = $("#inputHojaPeligro").val();  
   var puesto = $("#inputHojaPuesto").val();  
   var equipo = $("#inputHojaEppNecesario").val();  
// var fechareg = obtenerFechaActual();  
   var existe=comprobarFieInputExiste("fileEviHojaMsds");
	
   if(!existe.isValido){
      alert(existe.mensaje);
      return;
   }
	 
   if(campoVacio){
      var dataParam={
	     id: 0,
	     nombre: nombre,
	     uso: uso,
	     peligro: peligro,  
	     puesto: puesto,  
	     equipoNecesario: equipo,         
	     contratista:{id: contratistaId}
//	     fechaEvidencia:fechareg
		    };

      callAjaxPost(URL+'/contratista/hojaquimica/save',dataParam,
         procesarResultadoGuardarHoja);	 
   }else{
      alert("Debe ingresar todos los campos.");
   } 
}

function procesarResultadoGuardarHoja(data){
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevoId,'fileEviHojaMsds',bitsEvidenciaHojaQuimica,
            "/contratista/hojaquimica/evidencia/save",
            function(){
               mensajeUx = "<label>La hoja MSDS fue registrada con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaConHojaMsds");
             
               $("#modalMensajeUxActualizarVistaConHojaMsds").on("hidden.bs.modal",function(){
        	  habilitarHojaQuimicaContratista();   
               });
	    });
         break;
	
      default:
	 alert("no se guarda :''v");
   }
}
 //-------------------------------------------------------------------
  