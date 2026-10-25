
var listEstadoAccesoTraCon = [];
var mensajeUx;

function consultaEstadoAccesoVisitante(){
   var dataParam={};
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/public/visitante/documento/consulta',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn= "";
 			
 	    listEstadoAccesoTraCon = data.estadoAcceso;
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal="";
 	     
 	    listEstadoAccesoTraCon.forEach(function(val,index){
 	       var colorEstadoVigenciaInduccion = 
 		  (val.vigenciaInduccionTexto == "Sin registro"?"red;":"blue;");
 		
 	       var colorEstadoRegistroVisita = 
 		  (val.respuestaVisLugRiesgo == 0?"blue;":(val.respuestaVisLugRiesgo == -1?"red;":
	 	    (val.indicadorDocRegVisita == 1?"blue;":
	             (val.indicadorDocRegVisita == 0 || val.indicadorDocRegVisita == 2?"red;":"#D1D619;"))));
 	       
 	       var estadoRegistroVisita =
 		  (val.respuestaVisLugRiesgo == 0?"Cumple":
 		   (val.respuestaVisLugRiesgo == -1?"No Cumple":    
	 	    (val.indicadorDocRegVisita == 1?"Cumple":
	 	     (val.indicadorDocRegVisita == 0 || val.indicadorDocRegVisita == 2?
	 	      "No Cumple":"En evaluación"))));
 	       
 	       var vigenciaRegistroVisita = 
 		  (val.respuestaVisLugRiesgo == 0 || val.respuestaVisLugRiesgo == -1?"":
	 	   (val.indicadorDocRegVisita == 1?"(Hasta el "+val.fechaFinVigRegVisTexto+")":""));
 	       
 	       if(val.perfil.id == 1){
 		  var colorEstadoPruebaCovid,estadoPruebaCovid,vigenciaPruebaCovid;
 		  
 		  if(val.indicadorDocPruebaCovid == 1){
 		     colorEstadoPruebaCovid = "blue;";
 		     estadoPruebaCovid = "Cumple";
 		     vigenciaPruebaCovid = "(Hasta el "+val.fechaFinVigDocPruCovTexto+")";
 		  }else if(val.indicadorDocPruebaCovid == 0 || val.indicadorDocPruebaCovid == 2){
 		     colorEstadoPruebaCovid = "red;";
 		     estadoPruebaCovid = "No Cumple";
 		     vigenciaPruebaCovid = "";
 		  }else{
 		     colorEstadoPruebaCovid = "#D1D619;";
 		     estadoPruebaCovid = "En evaluación";
 		     vigenciaPruebaCovid = ""; 
 		  }
 	       }
 	       
 	       var colorEstadoFichaSintomatologia,estadoFichaSintomatologia,vigenciaFichaSintomatologia;
 	       
 	       if(val.indicadorDocFichaSint == 1){
 		  colorEstadoFichaSintomatologia = "blue;";
 		  estadoFichaSintomatologia = "Cumple";
 		  vigenciaFichaSintomatologia = "(Hasta el "+val.fechaFinVigDocFicSinTexto+")";
 	       }else if(val.indicadorDocFichaSint == 0 || val.indicadorDocFichaSint == 2){
 		  colorEstadoFichaSintomatologia = "red;";
 		  estadoFichaSintomatologia = "No Cumple";
 		  vigenciaFichaSintomatologia = "";
 	       }else{
 		  colorEstadoFichaSintomatologia = "#D1D619;";
 		  estadoFichaSintomatologia = "En evaluación";
 		  vigenciaFichaSintomatologia = "";
 	       }
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
                   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                            "DATOS GENERALES " +
                         "</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 		   label:"<i class='fa fa-check-square-o'></i> Nombre",
 		   inputForm:val.nombre},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 		   label:"<i class='fa fa-check-square-o'></i> N° del documento ",
 		   inputForm:val.dni},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	           label:"<i class='fa fa-check-square-o'></i> Perfil ",
 	 	   inputForm:val.perfil.nombre},
 	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
 	 	  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
 	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
 	                    "ESTADOS DOCUMENTOS ASOCIADOS " +
 	                 "</span>"},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	           label:"<i class='fa fa-pencil-square-o'></i> Vigencia de la inducción ",
 	 	   inputForm:"<label style='color:"+colorEstadoVigenciaInduccion+"'>"+
 	 		         val.vigenciaInduccionTexto+
 	 		     "</label>"},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	           label:"<i class='fa fa-pencil-square-o'></i> Estado del documento <br>" +
 	 	 	    "Registro de visitas ",
 	           inputForm:"<label style='color:"+colorEstadoRegistroVisita+"'>"+
 	                         estadoRegistroVisita+
 	 	 	     "</label>"+
 	 	 	     "<label style='float:right;'>"+
 	 	 	         vigenciaRegistroVisita+
 	 	 	     "</label>"}
 	       ]; 
 	       
 	       if(parseInt(getSession("gestopcompanyid")) == 148){
 		  listTotal.push(
 	 	     {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	      label:"<i class='fa fa-pencil-square-o'></i> Estado del documento <br>" +
 	 	 	       "Ficha sintomatología - COVID-19",
 	 	      inputForm:"<label style='color:"+colorEstadoFichaSintomatologia+"'>" +
 	 	 	 	    estadoFichaSintomatologia+
 		 	 	"</label>" +
 	 	 	 	"<label style='float:right;'>" +
 	 	 	 	    vigenciaFichaSintomatologia+
 	 	 	 	"</label>"});
 	       }
 	       
// 	 	       {sugerencia:"",
// 	 	 	label:"<i class='fa fa-pencil-square-o'></i> Estado del documento <br>" +
// 	 	 	      "Grupo de riesgo - COVID-19 ",
// 	 	 	inputForm:"<label style='color:"+(val.indicadorDocGrupoRiesgo == 1?"blue;":
//	 	 		   (val.indicadorDocGrupoRiesgo == 0 || val.indicadorDocGrupoRiesgo == 2?
//	 	 	                                  "red;":"#D1D619;"))+"'>"+
// 	 	 	           (val.indicadorDocGrupoRiesgo == 1?"Cumple":
// 	 	 		    (val.indicadorDocGrupoRiesgo == 0 || val.indicadorDocGrupoRiesgo == 2?
// 	 	 		     "No Cumple":"En evaluación"))+
// 	 	 		  "</label>"},
// 	 	       {sugerencia:"",label:"",inputForm:""},
// 	 	       {sugerencia:"",
// 	 	 	label:"<i class='fa fa-pencil-square-o'></i> Acceso del trabajador ",
// 	 	 	inputForm:"<label style='color:"+(val.indicadorDocGrupoRiesgo == 1 && 
// 	 	 		    val.indicadorDocPruebaCovid == 1 && val.indicadorDocFichaSint == 1?
// 	 	 			                  "blue;":"red;")+"'>"+
// 	 	 	          (val.indicadorDocGrupoRiesgo == 1 && val.indicadorDocPruebaCovid == 1
// 	 	 		   && val.indicadorDocFichaSint == 1?"Autorizado":"No autorizado")+
// 	 	 		  "</label>"}
 	      
 	       
// 	       if(val.perfil.id == 1){
// 		  listTotal.push(
// 		     {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
// 	 	      label:"<i class='fa fa-pencil-square-o'></i> Estado del documento <br>" +
//	 	               "Prueba COVID-19 ",
//	 	      inputForm:"<label style='color:"+colorEstadoPruebaCovid+"'>"+
//	 	                    estadoPruebaCovid+
//	 	 	        "</label>"+
//	 	 	        "<label style='float:right;'>"+
//	 	 	 	    vigenciaPruebaCovid+
//	 	 	        "</label>"});
// 	       }
 				
 	       textTotal+="<div class='eventoGeneral'>" +
 	       		     "<form class='eventoGeneral'>";	   					
 		
 	       listTotal.forEach(function(val,index){
 	          textTotal += ""+obtenerSubPanelModuloVersionDos(val);
 	       });
 		   
 	       textTotal+=   "</form>" +
 	       		  "</div>";
 	    });
 	     
 	    listPanelesPrincipal.push(
 	       {id: "infoMovilAccesoVisitante",clase: "",
 	 	nombre: ""+"Status del trabajador",
 	        contenido: ""+textTotal});
 			
 	    agregarPanelesDivPrincipal(listPanelesPrincipal);
 			
 	    $(".listaFinalGestionGosst").hide();
 	    $(".contenidoFormVisible").hide();
 	    
 	    break;
 	     
 	 default:
 	    alert("nop");
 	 
 	    break;
      }
   });
}

function obtenerSubPanelModuloEstadoVisitante(val){
    var estiloDefault="";
 	
    if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
       estiloDefault="    border-top: 1px dashed #a5aaae;"
    }
 	
    return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
 	 " <label for='colFormLabel' class='col-sm-6 col-form-label'>"+val.label+"</label>"+
 	     "<div class='col-sm-6' id='"+val.divContainer+"'>"+
 	     " "+val.inputForm+
 	        "<small>"+val.sugerencia+" </small>"+
 	     "</div>"+
 	  "</div>";
 }
