
var equipoHerramientaId,indexEquipoHerramienta,equipoHerramientaObj = {};
var listEquiposHerramientas = [],listTipoEquiposHerramientas = [];
var mapCodigoEquiposHerramientas;
var mensajeUx;

// P-A00040: la lista se pagina de 100 en 100 y tiene buscador por codigo o descripcion, con el mismo diseno de Trabajadores y de los documentos (la pieza comun es
// documento_nivel_vigencia_busqueda.js; aqui no se usa nada de la vigencia). Hay contratistas con casi mil equipos.
var controlSecEquHerr = crearControlDocNivel({
   clave:"SecEquHerr",paginar:true,idBtnAnterior:"btnAnteriorSecEquHerr",idBtnSiguiente:"btnSiguienteSecEquHerr",
   idSelVigencia:"selVigenciaSecEquHerr",idNotaFechas:"notaFechasSecEquHerr",idFechaInicio:"#fechaInicioSecEquHerr",idFechaFin:"#fechaFinSecEquHerr",
   idInputBusqueda:"inputBusquedaSecEquHerr",idAvisoBusqueda:"avisoBusquedaSecEquHerr",idAvisoFechas:"avisoFechasSecEquHerr",
   placeholder:"Buscar por código o descripción",ariaBuscador:"Buscar equipos o herramientas por el código o la descripción",
   recargar:function(){verRegistrosEquiposHerramientas();}
});

function toggleMenuOpcionRegistrosEquiposHerramientas(obj,pindex){
   equipoHerramientaObj = listEquiposHerramientas[pindex];
   indexEquipoHerramienta = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesRegistrosEquiposHerramientas=[  
   {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",
    functionClick:function(data){registroEquipoHerramienta(1);}},
   {id:"opcEliminar",nombre:"<i class='fa fa-trash-o'></i> Eliminar",
    functionClick:function(data){eliminarRegistroEquipoHerramienta();}}
];

function marcarSubOpcionRegistrosEquiposHerramientas(pindex){
   funcionalidadesRegistrosEquiposHerramientas[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function verRegistrosEquiposHerramientas(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId")),
      pagina:controlSecEquHerr.parametros().pagina,busqueda:controlSecEquHerr.parametros().busqueda
   };

   controlSecEquHerr.cargando = true;

   callAjaxPost(URL+'/contratista/equipo_herramienta',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listEquiposHerramientas = data.listEquiposHerramientas;listTipoEquiposHerramientas = data.listTipoEquiposHerramientas;
            controlSecEquHerr.guardarRespuesta({pagina:data.pagina,totalPaginas:data.totalPaginas,numTotalDocumentos:data.numTotalEquipos});
            mapCodigoEquiposHerramientas =  new Map();

            // con la lista paginada ya no estan todos los equipos en pantalla: el servidor manda todos los codigos para avisar de un codigo repetido antes de guardar
            (data.listCodigosEquHerr || []).forEach(function(codigo){
               mapCodigoEquiposHerramientas.set(codigo.toUpperCase(),1);
            });

  	    var listPanelesPrincipal = [],textEquiposHerramientas = "";

  	    $(".divListPrincipal").html("");

  	    listEquiposHerramientas.forEach(function(val,index){
  	       mapCodigoEquiposHerramientas.set(val.codigo.toUpperCase(),1);

 	       var btnOpcion = "",menuOpcion = "";
 	       
	       menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	          funcionalidadesRegistrosEquiposHerramientas.forEach(function(val1,index1){
		     menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionRegistrosEquiposHerramientas("+index1+")'>" +
				       val1.nombre +
				   "</li>";
	          });		    
	       menuOpcion += "</ul>";
				    
	       btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionRegistrosEquiposHerramientas(this,"+index+")'>" +
			      "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			   "</a>";
	       
	       var enlaceVerEstado =
                  "<a class='efectoLink' target='_blank' onclick='verEstadoActualEquipoHerramienta("+index+")'>"+
                     "<i class='fa fa-eye' aria-hidden='true'></i> Ver detalle" +
		  "</a>";
	       
	       var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto);
 	       
 	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
 		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-barcode'></i> Código:",inputForm:val.codigo},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Tipo:",inputForm:val.tipoEquipoHerramienta.nombre},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-tag'></i> Descripción:",inputForm:val.descripcion},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-calendar'></i> Año de fabricación:",inputForm:val.anioFabricacion},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-book'></i> Proyecto asignado:",inputForm:proyectoAsignadoTexto},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info-circle'></i> Estado actual:",inputForm:enlaceVerEstado},
 		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 		  {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",styleAux:"margin:0px 0px 0px -15px;",
 		   label:"<small style='font-weight:bolder;'>*Registrado el "+val.fechaCreacionTexto+"</small>",inputForm:""}
 	       ];  
 	       		
 	       textEquiposHerramientas += "<div class='eventoGeneral'>" +
 	                                      "<form class='eventoGeneral'>";	
 	          listTotal.forEach(function(val,index){
 	             textEquiposHerramientas += obtenerSubPanelModuloVersionDos(val);
 	          });
 	       textEquiposHerramientas +=    "</form>" +
 		                           "</div>";   
 	    });
  	    
  	    var btnConsolidadoAux = 
	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
	               "onclick='verConsolidadoEquiposHerramientasEstadoActual()' title='Ver consolidado con el estado actual de todos los equipos/herramientas.'>" +
	          "<i class='fa fa-table fa-4x'></i>" +
	       "</button>";
  	    
    	  var btnDescargaConsolidadoAux = 
  	       "<button type='button' class='btn btn-success' style='padding:4px 6px;margin-right:10px' " +
  	               "onclick='verValoresPdfConsolidadoEquiposHerramientasEstadoActual()' title='Descargar consolidado con el estado actual de todos los equipos/herramientas.'>" +
  	          "<i class='fa fa-file-text-o fa-4x'></i>" +
  	       "</button>";
  	    	  				
     	    listPanelesPrincipal.push(
     	       {id: "registroMovilHabilitarEquipoHerramienta",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"registroEquipoHerramienta(0)",
            	btnIconoAux:"fa-pencil",btnTitleAux:"Nuevo registro de vehículo/maquinaria",nombre:"Registrar nuevo equipo/herramienta",contenido:""},
               {id: "buscadorSecEquHerr",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Buscar equipo o herramienta",contenido:controlSecEquHerr.htmlBuscador()},
               {id: "infoMovilHabilitarEquipoHerramienta",clase:"",styleAux:"",buttonAd:btnConsolidadoAux+btnDescargaConsolidadoAux,btnOnclickAux:"",btnIconoAux:"",
    		btnTitleAux:"",nombre:"Equipos/Herramientas registradas ("+controlSecEquHerr.totalRegistros(listEquiposHerramientas)+")",
    		contenido:controlSecEquHerr.htmlPaginacion()+textEquiposHerramientas});

	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);

            // el buscador no se pliega: sin boton de plegar y siempre a la vista; lo escrito vuelve al campo como texto
            controlSecEquHerr.restaurarBusqueda();
            $("#buscadorSecEquHerr").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
            $("#buscadorSecEquHerr").children(".contenidoSubList").show();

     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
         
  	    break;
      }
   },null,null,null,function(){
      controlSecEquHerr.terminarCarga();
   });
}

function ocultarRegistroEquipoHerramienta(){
   $("#modalRegistroEquipoHerramienta").modal("hide");
}

function registroEquipoHerramienta(opcionId){
   $("#modalRegistroEquipoHerramienta").remove();  
   
   equipoHerramientaId = (parseInt(opcionId) == 0?0:equipoHerramientaObj.id);
 	     
   var selTipoEquHerr = crearSelectOneMenu("selTipoEquHerr","",listTipoEquiposHerramientas,
      (equipoHerramientaId == 0?"":equipoHerramientaObj.tipoEquipoHerramienta.id),"id","nombre");
   
   var contenido = "";
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Código",inputForm:"<input id='inputCodigoEquHerr' class='form-control' type='text'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Tipo",inputForm:selTipoEquHerr},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Descripción",inputForm:"<textarea id='textDescripcionEquHerr' class='form-control' rows='3'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Año de fabricación",inputForm:"<input id='inputAnioFabricacionEquHerr' class='form-control' type='number'>"}, 
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Proyecto asignado",inputForm:"<input id='inputProyectoAsigEquHerr' class='form-control'>"},      
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarRegistroEquipoHerramienta()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
	      		 "onclick='guardarRegistroEquipoHerramienta()'>" +
	            "<i class='fa fa-floppy-o'></i> Guardar" +
	         "</button>"}
   ];
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   var modalOptions={
      id: "modalRegistroEquipoHerramienta",
      nombre: "<i class='fa fa-pencil'></i> Registro equipo/herramienta",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   if(equipoHerramientaId > 0){
      $("#inputCodigoEquHerr").val(equipoHerramientaObj.codigo);$("#textDescripcionEquHerr").val(equipoHerramientaObj.descripcion);
      $("#inputAnioFabricacionEquHerr").val(equipoHerramientaObj.anioFabricacion);$("#inputProyectoAsigEquHerr").val(equipoHerramientaObj.proyectoAsignadoTexto);
      
      $("#inputCodigoEquHerr").prop("disabled",(equipoHerramientaObj.codigo.length > 0?true:false));
      $("#inputProyectoAsigEquHerr").prop("disabled",(equipoHerramientaObj.proyectoAsignadoTexto.length > 0?true:false));
   }
}

function eliminarRegistroEquipoHerramienta(){
   if(equipoHerramientaObj.hasDocumentoAsociado == 0){
   $("#modalRegistroEquipoHerramienta").modal("hide");
    
   mensajeUx="<label>¿Está seguro de eliminar el registro equipo/herramienta seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarEquHerr");

   $("#btnDevolverValorEliminarEquHerr").on("click",function(){
      var dataParam={
         id:equipoHerramientaObj.id
      };

      callAjaxPost(URL+'/contratista/equipo_herramienta/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               $("#modalRegistroEquipoHerramienta").modal("hide");	
		
 	       mensajeUx = "<label>El registro equipo/herramienta fue eliminado con éxito.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarEquHerr"); 
 								   
 	       $("#modalMensajeUxActualizarEquHerr").on("hidden.bs.modal",function(){
 		  verRegistrosEquiposHerramientas();  
 	       });
 	       
               break;
			
            default:
               alert("Ocurrió un error al eliminar el registro equipo/herramienta!");
         }
      });
   });
   }else{
      mensajeUx="<label>No se puede eliminar este registro equipo/herramienta porque tiene documentos asociados.</label>";
      mensajesUx(mensajeUx,2,"","");
   }
}

function guardarRegistroEquipoHerramienta(){
   var campoVacio = true;
   
   var codigo = $("#inputCodigoEquHerr").val().trim();
   var tipoEquipoHerramientaId = parseInt($("#selTipoEquHerr").val());
   var descripcion = $("#textDescripcionEquHerr").val().trim();
   var anioFabricacion = $("#inputAnioFabricacionEquHerr").val().trim();
   var proyectoAsignadoTexto = $("#inputProyectoAsigEquHerr").val().trim();
   var validacionInteger = /^[0-9]+$/
   
   if(codigo.length == 0 || tipoEquipoHerramientaId == -1 || descripcion.length == 0 || anioFabricacion.length == 0){
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";campoVacio = false;  
   }else if(mapCodigoEquiposHerramientas.get(codigo.toUpperCase()) == 1 && (equipoHerramientaId == 0 || 
      (equipoHerramientaId > 0 && codigo.toUpperCase() != equipoHerramientaObj.codigo.toUpperCase()))){
      mensajeUx = "<label>Código ("+codigo+") ya registrado.</label>";campoVacio = false;
   }else if(!validacionInteger.test(anioFabricacion)){
      mensajeUx = "<label>El año de fabricación debe ser un número entero.</label>";campoVacio = false;      
   }else if(anioFabricacion < 1900){
      mensajeUx = "<label>El año de fabricación no puede ser menor a 1900.</label>";campoVacio = false;   
   }
    
   if(campoVacio){
      var dataParam={
	 id:equipoHerramientaId,codigo:codigo,tipoEquipoHerramientaId:tipoEquipoHerramientaId,descripcion:descripcion,
	 anioFabricacion:anioFabricacion,proyectoAsignadoTexto:proyectoAsignadoTexto
      };
      
      dataParam.contratistaId = (equipoHerramientaId == 0?parseInt(getSession("contratistaGosstId")):null);
	        
      callAjaxPostSimple(URL+'/contratista/equipo_herramienta/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":  
	       $.unblockUI();$("#modalRegistroEquipoHerramienta").modal("hide");	
		
	       mensajeUx = "<label>El registro equipo/herramienta fue guardado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarEquHerr"); 
								   
	       $("#modalMensajeUxActualizarEquHerr").on("hidden.bs.modal",function(){
		  verRegistrosEquiposHerramientas();  
	       });
		
	       break;
						
	    default:
	       alert("Ocurrió un error al guardar el registro equipo/herramienta.");
	 }
      });	
   }else{
      $("#modalRegistroEquipoHerramienta").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionEquHerr");
      
      $("#modalMensajeUxValidacionEquHerr").on("hidden.bs.modal",function(){
	 $("#modalRegistroEquipoHerramienta").modal("show");
      });
   }	
}

function ocultarEstadoActualEquipoHerramienta(){
   $("#modalEstadoActualEquipoHerramienta").modal("hide");
}

function verEstadoActualEquipoHerramienta(pIndexEquHerr){
   $("#modalEstadoActualEquipoHerramienta").remove();
    
   equipoHerramientaObj = listEquiposHerramientas[pIndexEquHerr];
	    
   callAjaxPost(URL+"/contratista/equipo_herramienta/estado_actual",equipoHerramientaObj,function(data){  
      var estadoActualEquHerrObj = data.estadoActualEquHerr;
      
      var contenido = "";
      
      var listContenido=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-barcode' aria-hidden='true'></i> Código:",
	  inputForm:estadoActualEquHerrObj.codigo},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  label:"<i class='fa fa-tag' aria-hidden='true'></i> Tipo:",
	  inputForm:estadoActualEquHerrObj.tipoEquipoHerramienta.nombre},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
   	 {sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",
   	  label:"<i class='fa fa-inbox' aria-hidden='true'></i> ¿Habilitado?",
   	  inputForm:"<label>"+estadoActualEquHerrObj.habilitado+"</label>"},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""}
      ];
      
      if(equipoHerramientaObj.habilitadoCertificadoOperatividadEquHerr == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Certificado de operatividad:",
             inputForm:estadoActualEquHerrObj.estadoActualCertificadoOperatividad});
      }
      
      if(equipoHerramientaObj.habilitadoInspeccionEquHerr == 1){
         listContenido.push({sugerencia:"",anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"Inspección:",
             inputForm:estadoActualEquHerrObj.estadoActualInspeccion});
      }
     
      listContenido.push({sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-success' type='button' style='font-size:18px;' onclick='ocultarEstadoActualEquipoHerramienta()'>" +
                   "<i class='fa fa-arrow-left'></i> Volver" +
                "</button>",inputForm:""});
      
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
    	  				
      var modalOptions={
    	 id:"modalEstadoActualEquipoHerramienta",
    	 nombre:"<i class='fa fa-list-ul'></i> Estado actual del equipo/herramienta",
    	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
    	  				
      crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   });
}

function volverConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoEquipoHerramientaEstadoActual").modal("hide");
}

function verConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoEquipoHerramientaEstadoActual").remove();
   
   var contenido = "";
   
   var buttonVolver =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConsolidadoEquiposHerramientasEstadoActual()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
       
   var modalOptions={
      maxWidth:"90%",id:"modalConsolidadoEquipoHerramientaEstadoActual",
      nombre:"<i class='fa fa-table'></i> Consolidado equipos/herramientas - Estado actual",
      contenido: 
	  buttonVolver +
         "<div class='wrapper' id='wrapperConsolidadoEquipoHerramientaEstadoActual'>" +
            "<table id='tblConsolidadoEquipoHerramientaEstadoActual' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:150px'>¿Habilitado?</th>" +
	             "<th class='tb-acc' colspan='5' style='width:1250px'>Equipo/Herramienta</th>" +
		     "<th class='tb-acc' colspan='2' style='width:600px'>Documentos a nivel equipo/herramienta</th>" +
		  "</tr>" +
		  "<tr>" +
		     "<th class='tb-acc' style='width:250px'>Código</th>" +
		     "<th class='tb-acc' style='width:250px'>Tipo</th>" +
		     "<th class='tb-acc' style='width:250px'>Descripción</th>" +
		     "<th class='tb-acc' style='width:250px'>Año de fabricación</th>" +
		     "<th class='tb-acc' style='width:250px'>Proyecto asignado</th>" +
		     "<th class='tb-acc' style='width:300px'>Certificado de operatividad</th>" +
		     "<th class='tb-acc' style='width:300px'>Inspección</th>" +
                  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConsolidadoEquipoHerramientaEstadoActual",190);
   cargarConsolidadoEquiposHerramientasEstadoActual();
}

// P-A00040: la lista de la pantalla es solo una pagina y el consolidado es de todos los equipos/herramientas: se piden todos (sin pagina, como antes) y con ellos se arma
// el consolidado. Solo se piden cuando se abre el consolidado.
function cargarConsolidadoEquiposHerramientasEstadoActual(){
   callAjaxPost(URL+'/contratista/equipo_herramienta',{contratistaId:parseInt(getSession("contratistaGosstId"))},function(dataTodos){
      if(dataTodos.CODE_RESPONSE == "05"){
         cargarConsolidadoEquiposHerramientasEstadoActualDe(dataTodos.listEquiposHerramientas);
      }else{
         console.log("NOPNPO");
      }
   });
}

function cargarConsolidadoEquiposHerramientasEstadoActualDe(listEquiposTodos){
   var dataParam={
      equiposHerramientasInfoAux:listEquiposTodos
   };

   callAjaxPost(URL+'/contratista/equipo_herramienta/consolidado_estado_actual',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 var listConsolidadoEquiposHerramientasEstado = data.listConsolidadoEquiposHerramientasEstado;
 	 
 	 $("#tblConsolidadoEquipoHerramientaEstadoActual tbody tr").remove();
 	 
 	 listConsolidadoEquiposHerramientasEstado.forEach(function(val,index){ 	  
 	    var proyectoAsignadoTexto = (val.proyectoAsignadoTexto.length == 0?"------":val.proyectoAsignadoTexto);
 	     
 	    $("#tblConsolidadoEquipoHerramientaEstadoActual tbody").append(
 	       "<tr>" +
 	          "<td>"+val.habilitado+"</td>" +
	          "<td>"+val.codigo+"</td>" +
	          "<td>"+val.tipoEquipoHerramienta.nombre+"</td>" +
	          "<td style='word-break:break-all;'>"+val.descripcion+"</td>" +
	          "<td>"+val.anioFabricacion+"</td>" +
	          "<td style='word-break:break-all;'>"+proyectoAsignadoTexto+"</td>" +
 	          "<td>"+val.estadoActualCertificadoOperatividad+"</td>" +
 	          "<td>"+val.estadoActualInspeccion+"</td>" +
 	       "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConsolidadoEquipoHerramientaEstadoActual","#wrapperConsolidadoEquipoHerramientaEstadoActual");
   });
}

var listEquiposHerramientasFiltroPdf = [];

function ocultarValoresPdfConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoPdfEquHerrEstadoActual").modal("hide");
}

function verValoresPdfConsolidadoEquiposHerramientasEstadoActual(){
   $("#modalConsolidadoPdfEquHerrEstadoActual").remove();  
    
   var dataParam={ 
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
   
   callAjaxPost(URL+'/contratista/equipo_herramienta/descarga_pdf/filtro',dataParam,function(data){
      listEquiposHerramientasFiltroPdf = data.listEquiposHerramientasSimple;
   
      var contenido = "";
    
      var listContenido=[
	 {sugerencia:"",label:"Equipos/Herramientas",inputForm:"",divContainer:"divPdfEquHerr"},
	 {sugerencia:"",label:"Detalle de la actividad",
	  inputForm:"<textarea class='form-control' id='textAreaDetallePdfEquHerr' rows='5'></textarea>",
	  divContainer:""},
	 {sugerencia:"",label:"",inputForm:"",divContainer:""},
	 {sugerencia:"",
	  label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	  		"onclick='ocultarValoresPdfConsolidadoEquiposHerramientasEstadoActual()'>" +
	           "<i class='fa fa-times'></i> Cancelar" +
	        "</button>",
          inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
           		    "onclick='descargarPdfConsolidadoEquiposHerramientasEstadoActual()'>" +
           	       "<i class='fa fa-download'></i> Descargar" +
           	    "</button>"}
      ];
	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
	
      var modalOptions={
	 id:"modalConsolidadoPdfEquHerrEstadoActual",
	 nombre:"<i class='fa fa-file-text-o'></i> Valores PDF Consolidado equipos/herramientas - Estado actual",
	 contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
      };
      console.log(listEquiposHerramientasFiltroPdf);
      crearModalPrincipalUsuario(modalOptions,function(){
	 crearSelectOneMenuObligMultipleCompleto("selMulEquiposHerramientasPdf","",listEquiposHerramientasFiltroPdf,
            "id","codigo","#divPdfEquHerr","Todos");
      },true,true);
   });
}

function descargarPdfConsolidadoEquiposHerramientasEstadoActual(){
   var detalleActividad = $("#textAreaDetallePdfEquHerr").val();
   
   var listEquiposHerramientasId = [];
   var equHerrAsigId = $("#selMulEquiposHerramientasPdf").val();
   
   if(equHerrAsigId.length > 0){
      equHerrAsigId.forEach(function(val){
	 listEquiposHerramientasId.push(parseInt(val));
      });
   }else{
      listEquiposHerramientasFiltroPdf.forEach(function(val){
	 listEquiposHerramientasId.push(parseInt(val.id));
      });
   }
   
   window.open(URL+"/contratista/equipo_herramienta/descarga_pdf/consolidado_estado_actual?contratistaId="+getSession("contratistaGosstId") +
      "&detalleActividad="+detalleActividad+"&listEquiposHerramientasId="+listEquiposHerramientasId,'_blank'); 
   
   $("#modalConsolidadoPdfEquHerrEstadoActual").modal("hide");
}
