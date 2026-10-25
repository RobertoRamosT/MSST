
function habilitarPerfilTrabajadorContratista(){
    
   var dataParam={}; 
   var listPanelesPrincipal=[];
     
   callAjaxPost(URL+'/contratista/trabajador_contratista/info',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05": 
 	     $(".divListPrincipal").html("");
 	     var trab = data.trabajador;
 	     var registroEncabezado = 0;
 	     
 	    var nombreCompleto = (trab.apellido.length == 0 && trab.nombre.length == 0?"------":
                ((trab.apellido.length == 0?"":trab.apellido+", ")+(trab.nombre.length == 0?"":trab.nombre)));
 	  
 	     var listTotal=[
 	 	    {sugerencia:"",label:"Nombre ",inputForm:nombreCompleto},
 	            //{sugerencia:"",label:"Apellidos",inputForm:""+trab.apellido},
 	            {sugerencia:"",label:"Contratista",inputForm:""+trab.contratista.nombre},
 	 	    {sugerencia:"",label:"Tipo de documento",inputForm:""+trab.tipoDocumento.nombre},
 	            {sugerencia:"",label:"# de Documento",inputForm:""+trab.nroDocumento},
 	 	    {sugerencia:"",label:"",isFull:1,inputForm:"Si necesita modificar un dato, comuníquese con el jefe de seguridad de su área"},
 	 	    	   ]
 	      
    	     var contenido = listTotal.reduce((total,current) => total+obtenerSubPanelModuloGeneral(current),"");
    	 
 	     listPanelesPrincipal.push(
                {id:"divPerfil",clase:"",
                 nombre:"Datos de personal externo",
                 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"}
 	     );
 			
 	     agregarPanelesDivPrincipalGeneral(listPanelesPrincipal);	
 	     break;
 	     
         default:
 	     alert("nop");
 	     break;
      }  
   });
}