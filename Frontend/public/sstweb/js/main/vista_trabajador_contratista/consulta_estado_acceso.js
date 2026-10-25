
var listEstadoAccesoTraCon = [];
var mensajeUx;

function consultaEstadoAccesoTrabajadorContratista(){
    
   var dataParam={};
   
   var listPanelesPrincipal=[];
 	
   callAjaxPost(URL+'/contratista/trabajador_contratista/documento/consulta',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
 	    var textIn = "";
 			
 	    listEstadoAccesoTraCon = data.estadoAcceso;
 	    
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal = "";
 	     
 	    listEstadoAccesoTraCon.forEach(function(val,index){
 	       var colorEstadoInduccion = (val.vigenciaInduccionTexto == "Sin registro"?
	          "red;":"blue;")
	       var colorEstadoFichaSintoma = (val.indicadorDocFichaSint == 1?"blue;":
	 	  (val.indicadorDocFichaSint == 0 || val.indicadorDocFichaSint == 2?"red;":"#D1D619;"));
 	       
 	       var estadoFichaSintoma = (val.indicadorDocFichaSint == 1?"Cumple":
	          (val.indicadorDocFichaSint == 0 || val.indicadorDocFichaSint == 2?"No Cumple":"En evaluación"));
 	       
 	       var vigenciaFichaSintoma = (val.indicadorDocFichaSint == 1?"(Hasta el "+val.fechaFinVigDocFicSinTexto+")":"");
 	       
 	       var nombreCompleto = (val.apellido.length == 0 && val.nombre.length == 0?"------":
 	          ((val.apellido.length == 0?"":val.apellido+", ")+(val.nombre.length == 0?"":val.nombre)));
 	 	  
 	       var listTotal=[
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 		   label:"<i class='fa fa-check-square-o'></i> Nombre",inputForm:nombreCompleto},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 		   label:"<i class='fa fa-check-square-o'></i> N° del documento:",inputForm:val.nroDocumento},
 		  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
 	 	   label:"<i class='fa fa-pencil-square-o'></i> Vigencia de la inducción ",
 	 	   inputForm:"<label style='color:"+colorEstadoInduccion+"'>" +
 	 	 	         val.vigenciaInduccionTexto+
 	 	 	     "</label>"},
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
// 	 	       {sugerencia:"",
// 	 	 	label:"<i class='fa fa-pencil-square-o'></i> Estado del documento <br>" +
// 	 	 	      "Prueba COVID-19 ",
// 	 	 	inputForm:"<label style='color:"+
// 	 	 	           (val.indicadorDocPruebaCovid == 1 || val.hasExoneracionPruCov == 1?"blue;":
//	 	 		      (val.indicadorDocPruebaCovid == 0 || val.indicadorDocPruebaCovid == 2?
//	 	                         "red;":"#D1D619;"))+"'>"+
//	 	                   (val.hasExoneracionPruCov == 1?"Exonerado":
//	 	                      (val.indicadorDocPruebaCovid == 1?"Cumple":
//	 	 		         (val.indicadorDocPruebaCovid == 0 || val.indicadorDocPruebaCovid == 2?
//	 	 	                    "No Cumple":"En evaluación")))+
//	 	 	           "</label>"+
//	 	 	           "<label style='float:right;'>"+
//	 	 	           (val.hasExoneracionPruCov == 1?"(Hasta el "+val.fechaFinExoneracionPruCovTexto+")":
//	 	 	              (val.indicadorDocPruebaCovid == 1?"(Hasta el "+val.fechaFinVigDocPruCovTexto+")":""))+
//	 	 	          "<label>"},
// 	 	  {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
// 	 	   label:"<i class='fa fa-pencil-square-o'></i> Estado del documento " +
// 	 	         "<br> Ficha sintomatología - COVID-19",
// 	 	   inputForm:"<label style='color:"+colorEstadoFichaSintoma+"'>"+estadoFichaSintoma +"</label>"+
//	 	 	     "<label style='float:right;'>"+vigenciaFichaSintoma+"</label>"}
// 	 	       {sugerencia:"",label:"",inputForm:""},
// 	 	       {sugerencia:"",
// 	 	 	label:"<i class='fa fa-pencil-square-o'></i> Acceso del trabajador ",
// 	 	 	inputForm:"<label style='color:"+(val.indicadorDocGrupoRiesgo == 1 && 
// 	 	 		    val.indicadorDocPruebaCovid == 1 && val.indicadorDocFichaSint == 1?
// 	 	 			                  "blue;":"red;")+"'>"+
// 	 	 	          (val.indicadorDocGrupoRiesgo == 1 && val.indicadorDocPruebaCovid == 1
// 	 	 		   && val.indicadorDocFichaSint == 1?"Autorizado":"No autorizado")+
// 	 	 		  "</label>"}
               ];
 				
 	       textTotal += "<div class='eventoGeneral'>" +
 	       		       "<form class='eventoGeneral'>";	   					
 	          listTotal.forEach(function(val,index){
 	             textTotal += ""+obtenerSubPanelModuloVersionDos(val);
 	          }); 
 	       textTotal +=    "</form>" +
 	       		    "</div>";
 	    });
 	     
 	    listPanelesPrincipal.push(
 	       {id:"infoMovilAccesoTrabContratista",clase:"",
 	 	nombre:""+"Status del trabajador",
 	        contenido:""+textTotal});
 			
 	    agregarPanelesDivPrincipal(listPanelesPrincipal);
 			
 	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
 	     
 	    break;
 	     
 	 default:
 	    alert("Ocurrió un error.");
 	     
 	    break;
      }
   });
}
