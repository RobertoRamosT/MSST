var listDocumentosSstCon = [];
var listTrabajadores = [];
var listTipoExamenContratista = [];
var mensajeUx;

function habilitarDocumentosSst(){
   var dataParam={
      id: parseInt(getSession("contratistaGosstId")),
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/contratista/documentos',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textTotal = "";
            listDocumentosSstCon = data.listDocumentos;
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listDocumentosSstCon.forEach(function(val,index){
  	       var textDescarga = (val.evidenciaNombre == ""?"------":
  		  "<a class='efectoLink' target='_blank' " +
		     "href='"+URL+"/procedimientoseguridad/version/evidencia?versionId="+val.positionId+"'>"+
		     "<i class='fa fa-download'></i> "+val.evidenciaNombre + 
		  "</a>");
  	       
  	       var textAnexos = (val.numAnexosVistaColaborador == 0?val.numAnexosVistaColaborador:
  		  "<a onclick='verVersionAnexosDocCon("+val.positionId+")' class='efectoLink'>" +
  		     "<i class='fa fa-list-alt'></i> "+val.numAnexosVistaColaborador +
  		  "</a>");
  	           
  	       var listTotal=[
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
                   label:"<i class='fa fa-file-text'></i> Título:",
  		   inputForm:val.procedimientoSeguridadNombre},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-file'></i> Documento:",
  	 	   inputForm:textDescarga},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-book'></i> Anexos:",
  	  	   inputForm:textAnexos}
  	       ]; 
  	       		
  	       textTotal+="<div class='eventoGeneral'>";	
  	          listTotal.forEach(function(val,index){
  	   	     textTotal+=""+obtenerSubPanelModuloVersionDos(val);
  	          });
  	       textTotal+="</div>";
  	    });
  	    
     	    listPanelesPrincipal.push({
     	       id:"infoMovilDocumentosSstCon",clase:"",styleContenido:"",
     	       nombre:"<i class='fa fa-hand-o-right'></i> " +
     	       	         "Documentos asignados ("+listDocumentosSstCon.length+")",
     	       contenido:""+textTotal});
     	    
     	    agregarPanelesDivPrincipalStyle(listPanelesPrincipal,"");
  			
     	    $(".listaFinalGestionGosst").hide();
     	    $(".contenidoFormVisible").hide();
     	    break;
  	     
         default:
  	    alert("nop");
  	    break;
      }
   });
}

function verVersionAnexosDocCon(positionId){
   $("#modalVersionAnexosDocCon").remove();
    
   var dataParam={
      versionProcedimiento: {id: positionId}	
   }; 
	
   callAjaxPost(URL+'/procedimientoseguridad/version/anexo',dataParam,function(data){
      var listFullAnexo = data.list;
      var contenido = "";
      var listContenido = [];
      
      listFullAnexo.forEach(function(val,index){
	 var textoEvidencia = (val.evidenciaNombre == ""?"------":
  	    "<a class='efectoLink' target='_blank' " +
	       "href='"+URL+ "/procedimientoseguridad/version/anexo/evidencia_archivo?id="+val.id+"' >" +
	        val.evidenciaNombre+
	    "</a>");
	  
	 var listContenido=[
	    {sugerencia:"",
             label:"<i class='fa fa-tag' aria-hidden='true'></i> Código:",
             inputForm:val.codigo},
            {sugerencia:"",
             label:"<i class='fa fa-bookmark' aria-hidden='true'></i> Título:",
             inputForm:val.titulo},
            {sugerencia:"",
             label:"<i class='fa fa-file-o' aria-hidden='true'></i> Archivo:",
             inputForm:textoEvidencia}
         ];
            
	 if(listFullAnexo.length > (index+1)){
            listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});   
         }
            
	 listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
	 });
      });
			
      var modalOptions={
	 id: "modalVersionAnexosDocCon",
	 nombre: "<i class='fa fa-book'></i> Anexos ("+listFullAnexo.length+")",
	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
			
      crearModalPrincipalUsuario(modalOptions,function(){},false);
				
      $("#modalVersionAnexosDocCon").modal("show");
   });
}
