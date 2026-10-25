
function verBuscarDatosEquipoHerramienta(){ 
   var containerWelcome = $("#containerWelcome");
     
   containerWelcome
   .append($("<div>",{class:"seccionInduccion contenidoEquipoHerramienta",
                      id:"seccionBuscarEquipoHerramienta",
                      html:$("<div>",{class:"divTituloSeccion",html:"Búsqueda"})}));
   
   $("#seccionBuscarEquipoHerramienta")
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-4'> Contratista:</div>" +
                       	   "<div class='col-sm-8'>" +
			      "<input class='form-control' type='text' id='inputIngresarRucNombreContratista'>" +
     		              "<div id='divSelAutoContratistaPorNombre'></div>" +
     		              "<label>*Buscar contratista por RUC y/o nombre (debe ingresar 3 caracteres como mínimo).</label>" +
                       	   "</div>"}))
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-4'>Equipo/Herramienta:</div>" +
                       	   "<div class='col-sm-8'>" +
                       	      "<input class='form-control' type='text' id='inputEquipoHerramientaConsulta'>" +
     		              "<div id='divAutoCompletarEquipoHerramientaConsulta'></div>" +
     		              "<label>*Buscar equipo/herramienta por código (debe ingresar 3 caracteres como mínimo).</label>" +                   	   
                           "</div>"}))
   .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",
                       html:$("<button>",{class:"btn btn-success",style:"float:right;font-size:18px;",
                 	                 html:"<i class='fa fa-search'></i> Buscar",
                 	                 click:buscarDatosEquipoHerramienta})}));
   
   buscarContratistaEmpresaConsulta();
}

var listEquiposHerramientasBuscadorAux = [];

function verAutoCompletarEquipoHerramientaConsulta(){
   var contratistaId = parseInt($("#selContratistaConsulta").val());
   var equipoHerramienta = $("#inputEquipoHerramientaConsulta").val().trim();
   
   document.getElementById("inputEquipoHerramientaConsulta").disabled = (contratistaId != -1?false:true); 

   if(contratistaId != -1){
      if(equipoHerramienta.length >= 3){
         var dataParam={
	    codigo:"%"+equipoHerramienta+"%",isBuscador:1,contratistaId:contratistaId
         };

         callAjaxPostNoLoad(URL+"/public/contratista/equipo_herramienta/buscar/simple",dataParam,function(data){
	    listEquiposHerramientasBuscadorAux = (data.equiposHerramientas.length == 0?[{id:-1,codigo:"No encontrado"}]:data.equiposHerramientas);
	   
    	    var selAutoEquipoHerramientaConsulta = crearSelectOneMenuOblig("selAutoEquipoHerramientaConsulta","",
    	       listEquiposHerramientasBuscadorAux,"","id","codigo");
	
    	    $("#divAutoCompletarEquipoHerramientaConsulta").html(selAutoEquipoHerramientaConsulta);
    	    $("#inputEquipoHerramientaConsulta").attr("onkeyup","verAutoCompletarEquipoHerramientaConsulta()");
         });
      }else{
         listEquiposHerramientasBuscadorAux = [{id:-1,codigo:"No encontrado"}];
	     
         var selAutoEquipoHerramientaConsulta = crearSelectOneMenuOblig("selAutoEquipoHerramientaConsulta","",
	    listEquiposHerramientasBuscadorAux,"","id","codigo");
	    		       
         $("#divAutoCompletarEquipoHerramientaConsulta").html(selAutoEquipoHerramientaConsulta);
         $("#inputEquipoHerramientaConsulta").attr("onkeyup","verAutoCompletarEquipoHerramientaConsulta()");
      }
   }else{
      $("#inputEquipoHerramientaConsulta").val("");$("#divAutoCompletarEquipoHerramientaConsulta").html("");
   }
}

var equipoHerramientaObj,estadoActualEquHerr;

function ocultarDatosEquipoHerramienta(){
   $("#modalEstadoActualEquipoHerramienta").modal("hide");
}

function buscarDatosEquipoHerramienta(){
   $("#modalEstadoActualEquipoHerramienta").remove();
    
   var idContratista = parseInt($("#selContratistaConsulta").val());
   var idEquipoHerramienta = parseInt($("#selAutoEquipoHerramientaConsulta").val());
     
   if(idContratista != -1 && idEquipoHerramienta != -1){
      var dataParam={
 	 id:idEquipoHerramienta
      };
      
      callAjaxPost(URL+"/public/consulta/contratista/equipo_herramienta",dataParam,function(data){   
         equipoHerramientaObj = data.equipoHerramienta;estadoActualEquHerr = data.estadoActualEquHerr;
         
         var estadoDocActual = (estadoActualEquHerr.habilitado == "Sí"?iconoGosst.aprobado+" Completo":
            iconoGosst.advertir+" Incompleto <br>(documentos no vigentes y/o sin aprobar)");
          
         var styleEstadoDocActual = (estadoActualEquHerr.habilitado == "Sí"?"#A9DE9B":"#DD6055");
         
         var proyectoAsignadoTexto = (equipoHerramientaObj.proyectoAsignadoTexto.length == 0?"------":equipoHerramientaObj.proyectoAsignadoTexto);
	            
         var contenido = "";
         
         var listContenido=[
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list-alt'></i> Contratista:",inputForm:equipoHerramientaObj.contratistaNombre},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-barcode'></i> Código:",inputForm:equipoHerramientaObj.codigo},
   	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:equipoHerramientaObj.tipoEquipoHerramienta.nombre},
   	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Descripción:",inputForm:equipoHerramientaObj.descripcion},
   	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Año de fabricación:",inputForm:equipoHerramientaObj.anioFabricacion},
   	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Proyecto asignado:",inputForm:proyectoAsignadoTexto},
   	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      	  
            {sugerencia:"",styleAux:"background-color:"+styleEstadoDocActual+";",
       	     label:"<i class='fa fa-inbox'></i> Estado documentos - Nivel equipo/herramienta:",
       	     inputForm:"<label>"+estadoDocActual+"</label>" +
                "<br><a class='efectoLink' style='color:black;float:right;' id='idDetalleDocumentoEquipoHerramienta'></a>"},
            
      	    {sugerencia:"",clase:"divDescripcionDocumentoEquHerr",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
         ];
      	    
         if(equipoHerramientaObj.habilitadoCertificadoOperatividadEquHerr == 1){
            listContenido.push({sugerencia:"",clase:"divDescripcionDocumentoEquHerr",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de operatividad:",
               inputForm:estadoActualEquHerr.estadoActualCertificadoOperatividad});
         }
             
         if(equipoHerramientaObj.habilitadoInspeccionEquHerr == 1){
            listContenido.push({sugerencia:"",clase:"divDescripcionDocumentoEquHerr",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Inspección:",
               inputForm:estadoActualEquHerr.estadoActualInspeccion});
         }

         listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarDatosEquipoHerramienta()'>" +
                      "<i class='fa fa-arrow-left'></i> Volver" +
                   "</button>",inputForm:""});
         
         listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloVersionDos(val);
         });
       	  				
         var modalOptions={
       	    id:"modalEstadoActualEquipoHerramienta",nombre:"<i class='fa fa-search'></i> Resultado de la búsqueda - equipo/herramienta",
       	    contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
         };
       	  				
         crearModalPrincipalUsuario(modalOptions,function(){},true,true);
          
         ocultarDetalleDocumentosEquipoHerramienta();
      });
   }else{
      mensajeUx = (idContratista == -1?"<label>Debe ingresar el RUC y/o nombre de la contratista en el buscador y " +
         "seleccionarla.</label>":"<label>Debe ingresar el código del equipo/herramienta en el buscador y seleccionarla.</label>");
      mensajesUx(mensajeUx,2,"","");
   }
}

function verDetalleDocumentosEquipoHerramienta(){
   $(".divDescripcionDocumentoEquHerr").show();
   
   $("#idDetalleDocumentoEquipoHerramienta").html("Ocultar detalle <i class='fa fa-angle-double-up'></i>");
   $("#idDetalleDocumentoEquipoHerramienta").attr("onclick","ocultarDetalleDocumentosEquipoHerramienta()");
}

function ocultarDetalleDocumentosEquipoHerramienta(){
   $(".divDescripcionDocumentoEquHerr").hide();
   
   $("#idDetalleDocumentoEquipoHerramienta").html("Ver detalle <i class='fa fa-angle-double-down'></i>");
   $("#idDetalleDocumentoEquipoHerramienta").attr("onclick","verDetalleDocumentosEquipoHerramienta()");
}
