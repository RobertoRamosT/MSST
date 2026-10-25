
function verBuscarDatosTrabInterno(){ 
   $(".contenidoVisitante").remove();$(".contenidoTrabContratista").remove();
   $(".contenidoContratista").remove();$(".contenidoTrabInterno").remove();
    
   var containerWelcome = $("#containerWelcome");
     
   containerWelcome
   .append($("<div>",{class:"seccionInduccion contenidoTrabInterno",
                      id:"seccionBuscarTrabajadorInterno",
                      html:$("<div>",{class:"divTituloSeccion",
                 	              html:"Buscar trabajador interno"})}))
   .append($("<div>",{class:"seccionInduccion contenidoTrabInterno",
                      id:"seccionDatosTrabajadorInterno",
                      html:$("<div>",{class:"divTituloSeccion",
 	                              html:"Datos de trabajador interno"})}));
   
   $("#seccionBuscarTrabajadorInterno")
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-4'>DNI y/o nombre del trabajador interno: </div>" +
                       	   "<div class='col-sm-8'>" +
                       	      "<form class='form-inline'>" +
                       	         "<input type='text' class='form-control' id='inputIngresarDniNombreTrabInterno' " +
                       	                "style='margin-right:10px;width:100%;'>" +
	                      "</form>" +
	                      "<small>" +
	                         "<label style='color:red;'>" +
	                            "*Debe ingresar 3 caracteres para activar la búsqueda." +
	                         "</label>" +
			      "</small>" +
                       	   "</div>"}))
   .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                      html:"<div class='col-sm-4'>Trabajador interno seleccionado* </div>" +
                       	    "<div class='col-sm-8' id='divSelAutoTrabInternoPorNombre'></div>"}))
   .append($("<div>",{class:"divDescripcionInduccion divButtonStartInduccion",
                       html:$("<button>",{class:"btn btn-success",
                 	                 html:"<i class='fa fa-search'></i>Buscar",
                 	                 click:buscarDatosTrabInterno})}));
   
//   $("#seccionDocumentosEmpresaContratista").hide();
//   $("#seccionSeleccionarProyectoActivo").hide();$("#seccionDocumentosProyectoContratista").hide();
   $("#seccionDatosTrabajadorInterno").hide();
   
   buscarTrabInternoEmpresaConsulta();
}

var listTrabInternosConsulta=[];

function buscarTrabInternoEmpresaConsulta(){
   var nombre = $("#inputIngresarDniNombreTrabInterno").val().trim();
 	
   if(nombre.length >= 3){
      var dataParam={
	 trabajadorNombre: "%"+nombre+"%",
         empresaId: parseInt(getSession("empresaId")),
         isBuscador: 1
      };
 		
      callAjaxPostNoLoad(URL+"/public/trabajador_interno/solo/buscar",dataParam,function(data){
	 listTrabInternosConsulta = data.trabajadores;
        
         if(listTrabInternosConsulta.length == 0){
            listTrabInternosConsulta.push({
               trabajadorId: -1,nombre:"Sin asignar"
 	    });
         }
 			
         var selTrabInternoConsulta = crearSelectOneMenuOblig("selTrabInternoConsulta",
            "buscarContratistaProyectoConsulta()",listTrabInternosConsulta,"","trabajadorId","nombre");
 	       
         $("#divSelAutoTrabInternoPorNombre").html(selTrabInternoConsulta);
         $("#inputIngresarDniNombreTrabInterno").attr("onkeyup","buscarTrabInternoEmpresaConsulta()");
      });
   }else{
      listTrabInternosConsulta = [];
       
      listTrabInternosConsulta.push({
         trabajadorId: -1,nombre:"No encontrado"
      });
        
      var selTrabInternoConsulta = crearSelectOneMenuOblig("selTrabInternoConsulta",
	 "",listTrabInternosConsulta,"","trabajadorId","nombre");
 		       
      $("#divSelAutoTrabInternoPorNombre").html(selTrabInternoConsulta);
      $("#inputIngresarDniNombreTrabInterno").attr("onkeyup","buscarTrabInternoEmpresaConsulta()");
   }
}

function buscarDatosTrabInterno(){
   var idTrabajadorInterno = parseInt($("#selTrabInternoConsulta").val());
    
   if(idTrabajadorInterno != -1){
      $("#seccionDatosTrabajadorInterno")
      .html($("<div>",{class:"divTituloSeccion",html:"Datos de trabajador interno"}));
    
      var dataParam={
 	 trabajadorId: idTrabajadorInterno
      };
     
      callAjaxPost(URL+"/public/consulta/trabajador_interno/empresa/completa",dataParam,function(data){     
       
         if(data.trabajadoresInterno.length != 0){
 	    $("#seccionDatosTrabajadorInterno").show();
 	 
            var trabInternoObj = data.trabajadoresInterno[0];
            var styleEstadoDocActual = (trabInternoObj.estadoEspecificoCovid.id == 2?"#A9DE9B":"#DD6055");
          
            var listContenidoDatoTrabInterno=[
               {claseAux:"divDescripcionInduccion divDatoVisitante",
                textoIzquierda:"Nombre: ",anchoIzquierda:"col-sm-4",
                textoDerecha:trabInternoObj.nombre,anchoDerecha:"col-sm-8"},
               {claseAux:"divDescripcionInduccion divDatoVisitante",style:"background-color:"+styleEstadoDocActual+";",
                textoIzquierda:"<label><i class='fa fa-inbox' aria-hidden='true'></i> Estado actual:</label>",
                anchoIzquierda:"col-sm-5",
                textoDerecha:"<label>"+trabInternoObj.estadoEspecificoCovid.nombre+"</label>" +
                             "<br><a class='efectoLink' style='color:black;float:right;' id='idDetalleEstadoActualTrabInterno'>",
                anchoDerecha:"col-sm-7"},
               {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
		textoIzquierda:"Último formulario completado el",anchoIzquierda:"col-sm-5",
	        textoDerecha:trabInternoObj.ultimoFormulario.fechaActualizacionTexto,anchoDerecha:"col-sm-7"},
	       {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
                textoIzquierda:"Síntomas",anchoIzquierda:"col-sm-5",
		textoDerecha:trabInternoObj.ultimoFormulario.listSintomasNombre,anchoDerecha:"col-sm-7"},
	       {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
	        textoIzquierda:"Fecha de síntomas",anchoIzquierda:"col-sm-5",
	        textoDerecha:trabInternoObj.ultimoFormulario.fechaInicioSintomaTexto,anchoDerecha:"col-sm-7"}, 
	       {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
		textoIzquierda:"¿Contacto con un caso confirmado COVID-19?",anchoIzquierda:"col-sm-5",
	        textoDerecha:(trabInternoObj.ultimoFormulario.respuestaUno.id == 0?"No":"Sí"),anchoDerecha:"col-sm-7"},
	       {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
		textoIzquierda:"Fecha de contacto",anchoIzquierda:"col-sm-5",
	        textoDerecha:trabInternoObj.ultimoFormulario.fechaInicioContactoTexto,anchoDerecha:"col-sm-7"}
	    ];
            
            if(parseInt(getSession("empresaId")) == 648 || parseInt(getSession("empresaId")) == 649){
               listContenidoDatoTrabInterno.push(
                  {claseAux:"divDescripcionDetalleEstadoTrabInterno divDatoVisitante",style:"",
	           textoIzquierda:"Resultado - Prueba COVID-19",anchoIzquierda:"col-sm-5",
		   textoDerecha:trabInternoObj.ultimoFormulario.resultadoPruebaCovid.nombre,anchoDerecha:"col-sm-7"});
            }
					        
             
            listContenidoDatoTrabInterno.forEach(function(val){
               $("#seccionDatosTrabajadorInterno").append(
                  $("<div>",{class:val.claseAux,style:val.style,
                             html:"<div class='"+val.anchoIzquierda+"'>"+val.textoIzquierda+"</div>" +
                                  "<div class='"+val.anchoDerecha+"'>"+val.textoDerecha+"</div>"})); 
            }); 
            
            ocultarDetalleEstadoActualTrabInterno();
         }else{
            $("#seccionDatosTrabajadorInterno")
            .append($("<div>",{class:"divDescripcionInduccion divDatoVisitante",
                               html:"Trabajador interno no encontrado"}));
          }
       });
   }else{
      $("#seccionDatosTrabajadorInterno").hide();
      mensajeUx = "<label>Debe ingresar el DNI y/o nombre del trabajador interno " +
		  "en el buscador y/o seleccionarlo.</label>";
      mensajesUx(mensajeUx,2,"");
   }
}

function verDetalleEstadoActualTrabInterno(){
   $(".divDescripcionDetalleEstadoTrabInterno").show();
   $("#idDetalleEstadoActualTrabInterno").html("Ocultar detalle <i class='fa fa-angle-double-up'></i>");
   $("#idDetalleEstadoActualTrabInterno").attr("onclick","ocultarDetalleEstadoActualTrabInterno()");
}

function ocultarDetalleEstadoActualTrabInterno(){
   $(".divDescripcionDetalleEstadoTrabInterno").hide();
   $("#idDetalleEstadoActualTrabInterno").html("Ver detalle <i class='fa fa-angle-double-down'></i>");
   $("#idDetalleEstadoActualTrabInterno").attr("onclick","verDetalleEstadoActualTrabInterno()");
}
