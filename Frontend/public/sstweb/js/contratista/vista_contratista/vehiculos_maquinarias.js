
var vehiculoMaquinariaId,indexVehiculoMaquinaria,vehiculoMaquinariaObj = {};
var listVehiculosMaquinarias = [],listTipoLicencias = [];
var mapPlacaVehiculosMaquinarias;
var mensajeUx;

function toggleMenuOpcionRegistrosVehiculosMaquinarias(obj,pindex){
   vehiculoMaquinariaObj = listVehiculosMaquinarias[pindex];
   indexVehiculoMaquinaria = pindex;
    
   if(!$(obj).parent().parent().parent(".eventoGeneral").find("ul").is(":visible")){
      $(".listaFinalGestionGosst").hide();
   }
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesRegistrosVehiculosMaquinarias=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroVehiculoMaquinaria(1);}},
   {id:"opcFotocheck",nombre:"<i class='fa fa-newspaper-o'></i> Descargar fotocheck",  
    functionClick:function(data){generarFotocheckCodigoQrVehiculoMaquinaria(0)}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroVehiculoMaquinaria();}}
];

function marcarSubOpcionRegistrosVehiculosMaquinarias(pindex){
   funcionalidadesRegistrosVehiculosMaquinarias[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function verRegistrosVehiculosMaquinarias(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
    
   callAjaxPost(URL+'/contratista/vehiculo_maquinaria',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listVehiculosMaquinarias = data.listVehiculosMaquinarias;listTipoLicencias = data.listTipoLicencias;
            mapPlacaVehiculosMaquinarias =  new Map();
            
  	    var listPanelesPrincipal = [],textVehiculosMaquinarias = "";
  	    
  	    $(".divListPrincipal").html("");
  	     
  	    listVehiculosMaquinarias.forEach(function(val,index){
  	       mapPlacaVehiculosMaquinarias.set(val.placa.toUpperCase(),1); 
  		
 	       var btnOpcion = "",menuOpcion = "";
 	       
	       menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	          funcionalidadesRegistrosVehiculosMaquinarias.forEach(function(val1,index1){
		     menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosVehiculosMaquinarias("+index1+")'>" +
				       val1.nombre +
				   "</li>";
	          });		    
	       menuOpcion += "</ul>";
				    
	       btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosVehiculosMaquinarias(this,"+index+")'>" +
			      "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			   "</a>";
	       
	       var enlaceVerEstado =
                  "<a class='efectoLink' target='_blank' onclick='verEstadoActualVehiculoMaquinaria("+index+")'>"+
                     "<i class='fa fa-eye' aria-hidden='true'></i> Ver detalle" +
		  "</a>";
	       
	       var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto),
	           detalle = (val.detalle.length == 0?"------":val.detalle);
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-7",anchoDiv:"col-sm-5",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-barcode'></i> Placa:",inputForm:val.placa},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-list'></i> Tipo:",inputForm:val.tipoLicenciaConductor.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Marca:",inputForm:val.marca},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Año de fabricación:",inputForm:val.anioFabricacion},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-pencil'></i> Detalle:",inputForm:detalle},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Proyecto asignado:",inputForm:proyectoAsignadoTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info-circle'></i> Estado actual:",inputForm:enlaceVerEstado},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",styleAux:"margin:0px 0px 0px -15px;",
 		   label:"<small style='font-weight:bolder;'>*Registrado el "+val.fechaCreacionTexto+"</small>",inputForm:""}
 	       ];  
 	       		
 	       textVehiculosMaquinarias += "<div class='eventoGeneral'>" +
 	                                      "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textVehiculosMaquinarias += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textVehiculosMaquinarias +=    "</form>" +
 		                           "</div>";   
 	    });
  	    
  	    var btnConsolidadoAux = 
	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
	               "onclick='verConsolidadoVehiculosMaquinariasEstadoActual()' title='Ver consolidado con el estado actual de todos los vehículos/maquinarias.'>" +
	          "<i class='fa fa-table fa-4x'></i>" +
	       "</button>";
  	    
  	  var btnDescargaConsolidadoAux = 
	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
	               "onclick='verValoresPdfConsolidadoVehiculosMaquinariasEstadoActual()' title='Descargar consolidado con el estado actual de todos los vehículos/maquinarias.'>" +
	          "<i class='fa fa-file-text-o fa-4x'></i>" +
	       "</button>";
  	    	  				
     	    listPanelesPrincipal.push(
     	       {id:"registroMovilHabilitarConductor",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroVehiculoMaquinaria(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro de vehículo/maquinaria",nombre:"Registrar nuevo vehículo/maquinaria",contenido:""},
               {id:"infoMovilHabilitarConductor",clase:"",styleAux:"",buttonAd:btnConsolidadoAux+btnDescargaConsolidadoAux,btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Vehículos/Maquinarias registradas ("+listVehiculosMaquinarias.length+")",
    		contenido:textVehiculosMaquinarias});

	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   });
}

function ocultarRegistroVehiculoMaquinaria(){
   $("#modalRegistroVehiculoMaquinaria").modal("hide");
}

function registroVehiculoMaquinaria(opcionId){
   $("#modalRegistroVehiculoMaquinaria").remove();  
   
   vehiculoMaquinariaId = (parseInt(opcionId) == 0?0:vehiculoMaquinariaObj.id);
 	     
   var selTipoLicenciasConductorVehMaq = crearSelectOneMenu("selTipoLicenciasConductorVehMaq","",listTipoLicencias,
      (vehiculoMaquinariaId == 0?"":vehiculoMaquinariaObj.tipoLicenciaConductor.id),"id","nombre");
   
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Placa",inputForm:"<input id='inputPlacaVehMaq' class='form-control' type='text'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:selTipoLicenciasConductorVehMaq},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Marca",inputForm:"<input id='inputMarcaVehMaq' class='form-control' type='text'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Año de fabricación",inputForm:"<input id='inputAnioFabricacionVehMaq' class='form-control' type='number'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Detalle",inputForm:"<input id='inputDetalleVehMaq' class='form-control'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Proyecto asignado",inputForm:"<input id='inputProyectoAsigVehMaq' class='form-control'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroVehiculoMaquinaria()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroVehiculoMaquinaria()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalRegistroVehiculoMaquinaria",
      nombre: "<i class='fa fa-pencil'></i> Registro vehículo/maquinaria",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   if(vehiculoMaquinariaId > 0){
      $("#inputPlacaVehMaq").val(vehiculoMaquinariaObj.placa);$("#inputMarcaVehMaq").val(vehiculoMaquinariaObj.marca);
      $("#inputAnioFabricacionVehMaq").val(vehiculoMaquinariaObj.anioFabricacion);$("#inputProyectoAsigVehMaq").val(vehiculoMaquinariaObj.proyectoAsignadoTexto);
      $("#inputDetalleVehMaq").val(vehiculoMaquinariaObj.detalle);
      
      $("#inputPlacaVehMaq").prop("disabled",(vehiculoMaquinariaObj.placa.length > 0?true:false));
      $("#inputProyectoAsigVehMaq").prop("disabled",(vehiculoMaquinariaObj.proyectoAsignadoTexto.length > 0?true:false));
   }
}

function eliminarRegistroVehiculoMaquinaria(){
   if(vehiculoMaquinariaObj.hasDocumentoAsociado == 0){
      $("#modalRegistroVehiculoMaquinaria").modal("hide");
    
      mensajeUx="<label>¿Está seguro de eliminar el registro vehículo/maquinaria seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","EliminarVehMaq");

      $("#btnDevolverValorEliminarVehMaq").on("click",function(){
         var dataParam={
            id:vehiculoMaquinariaObj.id
         };

         callAjaxPost(URL+'/contratista/vehiculo_maquinaria/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
               case "05":
                  $("#modalRegistroVehiculoMaquinaria").modal("hide");	
		
                  mensajeUx = "<label>El registro vehículo/maquinaria fue eliminado con éxito.</label>";
                  mensajesUx(mensajeUx,1,"","ActualizarVehMaq"); 
 								   
                  $("#modalMensajeUxActualizarVehMaq").on("hidden.bs.modal",function(){
 		     verRegistrosVehiculosMaquinarias();  
                  });
 	       
                  break;
			
               default:
                  alert("Ocurrió un error al eliminar el registro vehículo/maquinaria!");
            }
         });
      });
   }else{
      mensajeUx="<label>No se puede eliminar este registro vehículo/maquinaria porque tiene documentos asociados.</label>";
      mensajesUx(mensajeUx,2,"","");
   }
}

function guardarRegistroVehiculoMaquinaria(){
   var campoVacio = true;
   
   var placa = $("#inputPlacaVehMaq").val().trim();
   var tipoLicenciaConductorId = parseInt($("#selTipoLicenciasConductorVehMaq").val());
   var marca = $("#inputMarcaVehMaq").val().trim();
   var anioFabricacion = $("#inputAnioFabricacionVehMaq").val().trim();
   var detalle = $("#inputDetalleVehMaq").val().trim();
   var proyectoAsignadoTexto = $("#inputProyectoAsigVehMaq").val().trim();
   var validacionInteger = /^[0-9]+$/
   
   if(placa.length == 0 || tipoLicenciaConductorId == -1 || marca.length == 0 || anioFabricacion.length == 0){
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";campoVacio = false;  
   }else if(mapPlacaVehiculosMaquinarias.get(placa.toUpperCase()) == 1 && (vehiculoMaquinariaId == 0 || 
	      (vehiculoMaquinariaId > 0 && placa.toUpperCase() != vehiculoMaquinariaObj.placa.toUpperCase()))){
      mensajeUx = "<label>Placa ("+placa+") ya registrada.</label>";campoVacio = false;
   }else if(!validacionInteger.test(anioFabricacion)){
      mensajeUx = "<label>El año de fabricación debe ser un número entero.</label>";campoVacio = false;      
   }else if(anioFabricacion < 1900){
      mensajeUx = "<label>El año de fabricación no puede ser menor a 1900.</label>";campoVacio = false;   
   }
    
   if(campoVacio){
      var dataParam={
	 id:vehiculoMaquinariaId,placa:placa,tipoLicenciaConductorId:tipoLicenciaConductorId,marca:marca,
	 anioFabricacion:anioFabricacion,proyectoAsignadoTexto:proyectoAsignadoTexto,detalle:detalle
      };
      
      dataParam.contratistaId = (vehiculoMaquinariaId == 0?parseInt(getSession("contratistaGosstId")):null);
	        
      callAjaxPostSimple(URL+'/contratista/vehiculo_maquinaria/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalRegistroVehiculoMaquinaria").modal("hide");	
		
	       mensajeUx = "<label>El registro vehículo/maquinaria fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVehMaq"); 
								   
	       $("#modalMensajeUxActualizarVehMaq").on("hidden.bs.modal",function(){
		  verRegistrosVehiculosMaquinarias();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro vehículo/maquinaria.");
	 }
      });	
   }else{
      $("#modalRegistroVehiculoMaquinaria").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionVehMaq");
      
      $("#modalMensajeUxValidacionVehMaq").on("hidden.bs.modal",function(){
	 $("#modalRegistroVehiculoMaquinaria").modal("show");
      });
   }	
}

function ocultarEstadoActualVehiculoMaquinaria(){
   $("#modalEstadoActualVehiculoMaquinaria").modal("hide");
}

function verEstadoActualVehiculoMaquinaria(pIndexVehMaq){
   $("#modalEstadoActualVehiculoMaquinaria").remove();
    
   vehiculoMaquinariaObj = listVehiculosMaquinarias[pIndexVehMaq];
	    
   callAjaxPost(URL+"/contratista/vehiculo_maquinaria/estado_actual",vehiculoMaquinariaObj,function(data){  
      var estadoActualVehMaqObj = data.estadoActualVehMaq;
      
      var contenido = "";
      
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-barcode' aria-hidden='true'></i> Placa:",inputForm:estadoActualVehMaqObj.placa},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-list' aria-hidden='true'></i> Tipo:",
	  inputForm:estadoActualVehMaqObj.tipoLicenciaConductor.nombre},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
   	  label:"<i class='fa fa-inbox' aria-hidden='true'></i> ¿Habilitado?",
   	  inputForm:"<label>"+estadoActualVehMaqObj.habilitado+"</label>"},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
      ];
      
      if(vehiculoMaquinariaObj.habilitarCheckListIngreso == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Check list de ingreso:",
             inputForm:estadoActualVehMaqObj.estadoActualCheckListIngreso});
      }
      
      if(vehiculoMaquinariaObj.habilitarInspeccionTecnica == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Inspección técnica:",
             inputForm:estadoActualVehMaqObj.estadoActualInspeccionTecnica});
      }
     
      if(vehiculoMaquinariaObj.habilitarPolizaContraTodo == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Póliza contra todo riesgo:",
             inputForm:estadoActualVehMaqObj.estadoActualPolizaContraTodo});
      }
   
      if(vehiculoMaquinariaObj.habilitarSoat == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"SOAT:",
             inputForm:estadoActualVehMaqObj.estadoActualSoat});
      }
          
      if(vehiculoMaquinariaObj.habilitarTarjetaConstanciaPropiedadEquipo == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Tarjeta/Constancia de propiedad del equipo:",
             inputForm:estadoActualVehMaqObj.estadoActualTarjetaConstanciaPropiedadEquipo});
      }
      
      if(vehiculoMaquinariaObj.habilitarCertificadoOperatividad == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de operatividad:",
             inputForm:estadoActualVehMaqObj.estadoActualCertificadoOperatividad});
      }
		 
      if(vehiculoMaquinariaObj.habilitarProgMantenimientoPreventivo == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Programa de mantenimiento preventivo:",
             inputForm:estadoActualVehMaqObj.estadoActualProgMantenimientoPreventivo});
      }
      
      if(vehiculoMaquinariaObj.habilitarCertifMantenimientoPreventivo == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de mantenimiento preventivo:",
             inputForm:estadoActualVehMaqObj.estadoActualCertifMantenimientoPreventivo});
      }
      
      if(vehiculoMaquinariaObj.habilitarPermisoEspecialTransporteMercancia == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Permiso especial para el transporte de mercancía:",
            inputForm:estadoActualVehMaqObj.estadoActualPermisoEspecialTransporteMercancia});
      }
      
      if(vehiculoMaquinariaObj.habilitarPolizaTrec == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Póliza TREC:",
             inputForm:estadoActualVehMaqObj.estadoActualPolizaTrec});
      }
      
      if(vehiculoMaquinariaObj.habilitarCertificadoOpacidad == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de opacidad:",
             inputForm:estadoActualVehMaqObj.estadoActualCertificadoOpacidad});
      }
      
      if(vehiculoMaquinariaObj.habilitarManualEquipoFichaTecnica == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Manual del equipo/Ficha técnica:",
             inputForm:estadoActualVehMaqObj.estadoActualManualEquipoFichaTecnica});
      }
      
      if(vehiculoMaquinariaObj.habilitarCertificadoDghOsinergmin == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado DGH - Osinergmin:",
             inputForm:estadoActualVehMaqObj.estadoActualCertificadoDghOsinergmin});
      }
         
      if(vehiculoMaquinariaObj.habilitarCertifCubicacionHermeticidad == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de cubicación y hermeticidad:",
             inputForm:estadoActualVehMaqObj.estadoActualCertifCubicacionHermeticidad});
      }
         
      if(vehiculoMaquinariaObj.habilitarTarjetaCirculacionMtc == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Tarjeta de circulación emitida por el MTC:",
             inputForm:estadoActualVehMaqObj.estadoActualTarjetaCirculacionMtc});
      }
      
      if(vehiculoMaquinariaObj.habilitarCertifGravamenVehicular == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de gravamen vehicular:",
             inputForm:estadoActualVehMaqObj.estadoActualCertifGravamenVehicular});
      }
      
      if(vehiculoMaquinariaObj.habilitarVerifGpsVehicular == 1){
	 listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Verificación - GPS vehicular:",
             inputForm:estadoActualVehMaqObj.estadoActualVerifGpsVehicular});
      }
      
      if(vehiculoMaquinariaObj.habilitarExamNivelVehMaq18 == 1){
	  listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de hermeticidad de la bombona:",
	      inputForm:estadoActualVehMaqObj.estadoActualExamNivelVehMaq18});
      }
         
      listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarEstadoActualVehiculoMaquinaria()'>" +
                   "<i class='fa fa-arrow-left'></i> Volver" +
                "</button>",inputForm:""});
      
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	  				
      var modalOptions={
    	 id: "modalEstadoActualVehiculoMaquinaria",
    	 nombre: "<i class='fa fa-list-ul'></i> Estado actual del vehículo/maquinaria",
    	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
      };
    	  				
      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   });
}

function volverConsolidadoVehiculosMaquinariasEstadoActual(){
   $("#modalConsolidadoVehiculoMaquinariaEstadoActual").modal("hide");
}

function verConsolidadoVehiculosMaquinariasEstadoActual(){
   $("#modalConsolidadoVehiculoMaquinariaEstadoActual").remove();
   
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoVehiculosMaquinariasEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoVehiculoMaquinariaEstadoActual",
      nombre:"<i class='fa fa-table'></i> Consolidado vehículos/maquinarias - Estado actual",
      contenido: 
	  buttonVolver +
         "<div class='wrapper' id='wrapperConsolidadoVehiculoMaquinariaEstadoActual'>" +
            "<table id='tblConsolidadoVehiculoMaquinariaEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>¿Habilitado?</th>" +
		         "<th class='tb-acc' colspan='6' style='width:1500px'>Vehículo/Maquinaria</th>" +
		         "<th class='tb-acc' colspan='18' style='width:4800px'>Documentos a nivel vehículo/maquinaria</th>" +
			     "<th class='tb-acc' rowspan='2' style='width:150px'>¿Sin sanciones en curso?</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:250px'>Placa</th>" +
		     "<th class='tb-acc' style='width:250px'>Tipo</th>" +
		     "<th class='tb-acc' style='width:250px'>Marca</th>" +
		     "<th class='tb-acc' style='width:250px'>Año de fabricación</th>" +
		     "<th class='tb-acc' style='width:250px'>Detalle</th>" +
		     "<th class='tb-acc' style='width:250px'>Proyecto asignado</th>" +
		     "<th class='tb-acc' style='width:300px'>Check list de ingreso</th>" +
		     "<th class='tb-acc' style='width:300px'>Inspección técnica</th>" +
		     "<th class='tb-acc' style='width:300px'>Póliza contra todo riesgo</th>" +
		     "<th class='tb-acc' style='width:300px'>SOAT</th>" +
		     "<th class='tb-acc' style='width:300px'>Tarjeta/Constancia de propiedad del equipo</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de operatividad</th>" +
		     "<th class='tb-acc' style='width:300px'>Programa de mantenimiento preventivo</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de mantenimiento preventivo</th>" +
		     "<th class='tb-acc' style='width:300px'>Permiso especial para el transporte de mercancía</th>" +
		     "<th class='tb-acc' style='width:300px'>Póliza TREC</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de opacidad</th>" +
		     "<th class='tb-acc' style='width:300px'>Manual del equipo/Ficha técnica</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado DGH - Osinergmin</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de cubicación y hermeticidad</th>" +
		     "<th class='tb-acc' style='width:300px'>Tarjeta de circulación emitida por el MTC</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de gravamen vehicular</th>" +
		     "<th class='tb-acc' style='width:300px'>Verificación - GPS vehicular</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de hermeticidad de la bombona</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoVehiculoMaquinariaEstadoActual",190);
   cargarConsolidadoVehiculosMaquinariasEstadoActual();
}

function cargarConsolidadoVehiculosMaquinariasEstadoActual(){
   var dataParam={
      vehiculosMaquinariasInfoAux:listVehiculosMaquinarias
   };
    
   callAjaxPost(URL+'/contratista/vehiculo_maquinaria/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 var listConsolidadoVehiculosMaquinariasEstado = data.listConsolidadoVehiculosMaquinariasEstado;
 	 
 	 $("#tblConsolidadoVehiculoMaquinariaEstadoActual tbody tr").remove();
 	 
 	 listConsolidadoVehiculosMaquinariasEstado.forEach(function(val){
 	    var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto),
 	        detalle = (val.detalle.length == 0?"------":val.detalle),hasSancion = (val.indicadorBlacklist != null?
					iconoGosst.desaprobado+" Sí <br><strong>(Hasta "+val.indicadorBlacklist+")</strong>":iconoGosst.aprobado+" No");
 	     
 	    $("#tblConsolidadoVehiculoMaquinariaEstadoActual tbody").append(
 	       "<tr>" +
 	          "<td>"+val.habilitado+"</td>" +
 	          "<td>"+val.placa+"</td>" +
	          "<td>"+val.tipoLicenciaConductor.nombre+"</td>" +
	          "<td>"+val.marca+"</td>" +
	          "<td>"+val.anioFabricacion+"</td>" +
	          "<td style='word-break:break-all;'>"+detalle+"</td>" +
	          "<td style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
 	          "<td>"+val.estadoActualCheckListIngreso+"</td>" +
 	          "<td>"+val.estadoActualInspeccionTecnica+"</td>" +
 	          "<td>"+val.estadoActualPolizaContraTodo+"</td>" +
 	          "<td>"+val.estadoActualSoat+"</td>" +
 	          "<td>"+val.estadoActualTarjetaConstanciaPropiedadEquipo+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOperatividad+"</td>" +
 	          "<td>"+val.estadoActualProgMantenimientoPreventivo+"</td>" +
 	          "<td>"+val.estadoActualCertifMantenimientoPreventivo+"</td>" +
 	          "<td>"+val.estadoActualPermisoEspecialTransporteMercancia+"</td>" +
 	          "<td>"+val.estadoActualPolizaTrec+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOpacidad+"</td>" +
 	          "<td>"+val.estadoActualManualEquipoFichaTecnica+"</td>" +
 	          "<td>"+val.estadoActualCertificadoDghOsinergmin+"</td>" +
 	          "<td>"+val.estadoActualCertifCubicacionHermeticidad+"</td>" +
 	          "<td>"+val.estadoActualTarjetaCirculacionMtc+"</td>" +
 	          "<td>"+val.estadoActualCertifGravamenVehicular+"</td>" +
 	          "<td>"+val.estadoActualVerifGpsVehicular+"</td>" +
 	          "<td>"+val.estadoActualExamNivelVehMaq18+"</td>" +
			  "<td>"+hasSancion+"</td>" +
 	       "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConsolidadoVehiculoMaquinariaEstadoActual","#wrapperConsolidadoVehiculoMaquinariaEstadoActual");
   });
}

var listVehiculosMaquinariasFiltroPdf = [];

function ocultarValoresPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    $("#modalConsolidadoPdfVehMaqEstadoActual").modal("hide");
}

function verValoresPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    $("#modalConsolidadoPdfVehMaqEstadoActual").remove();  
    
    var dataParam={ 
        contratistaId: parseInt(getSession("contratistaGosstId"))
    };
   
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/vehiculo_maquinaria/descarga_pdf/filtro',dataParam,1,1,function(data){
        listVehiculosMaquinariasFiltroPdf = data.listVehiculosMaquinariasSimple;
   
        if(!listVehiculosMaquinariasFiltroPdf || listVehiculosMaquinariasFiltroPdf.length === 0){
	  	    alert("No hay vahículos/maquinarias seleccionados para generar el PDF.");
	  	    return;
	  	}
	     
	    var contenido = "";
	  		
	  	var listContenido=[
	  	    {label:"Vehículos/Maquinarias",inputForm:"",idDivContainer:"divPdfVehMaq"},
	  		{label:"Detalle de la actividad",inputForm:"<textarea id='textAreaDetallePdfVehMaq' class='form-control' rows='5'></textarea>"},
	  		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
	  		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarValoresPdfConsolidadoVehiculosMaquinariasEstadoActual()'>" +
	  			       "<i class='fa fa-times'></i> Cancelar" +
	  			   "</button>",
	  		 inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarPdfConsolidadoVehiculosMaquinariasEstadoActual()'>" +
	  		               "<i class='fa fa-download'></i> Descargar" +
	  		           "</button>"}
        ];
	  			    
	  	listContenido.forEach(function(val){
	  		contenido += obtenerSubPanelModuloVersionTres(val);
	  	});
	  		
	  	var modalOptions={
	  		id:"modalConsolidadoPdfVehMaqEstadoActual",nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado vehículos/maquinarias - Estado actual",
	  		contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
	  	};
	  			
	    crearModalPrincipalUsuario(modalOptions,function(){
	  	    crearSelectOneMenuObligMultipleCompleto("selMulVehiculosMaquinariasPdf","",listVehiculosMaquinariasFiltroPdf,"id","placa","#divPdfVehMaq","Todos");
	    },true,true);
    });
}

function descargarPdfConsolidadoVehiculosMaquinariasEstadoActual(){
    var detalleActividad = $("#textAreaDetallePdfVehMaq").val();
   
    var listVehiculosMaquinariasId = [];
    var vehMaqAsigId = $("#selMulVehiculosMaquinariasPdf").val();
   
    if(vehMaqAsigId != null && vehMaqAsigId.length > 0){
        vehMaqAsigId.forEach(function(val){
	        listVehiculosMaquinariasId.push(parseInt(val));
        });
    }else{
        listVehiculosMaquinariasFiltroPdf.forEach(function(val){
	        listVehiculosMaquinariasId.push(parseInt(val.id));
        });
    }
	
	var dataParam={
		contratistaId:getSession("contratistaGosstId"),detalleActividad:encodeURIComponent(detalleActividad || ""),
		listVehiculosMaquinariasId:listVehiculosMaquinariasId.join(",")
	};

	descargarArchivoPost(URL+"/contratista/vehiculo_maquinaria/descarga_pdf/consolidado_estado_actual",dataParam);
   
   $("#modalConsolidadoPdfVehMaqEstadoActual").modal("hide");
}
