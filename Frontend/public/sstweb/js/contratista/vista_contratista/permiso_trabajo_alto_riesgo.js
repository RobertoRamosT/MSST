var objPermisoTraAltRie = {};
var indexPermisoTraAltRie;
var listPermisoTraAltRie = [];
var listAnalisisTraSegSimple = [];
var listTipoExamenContratista = [];
var listPrevencionista = [];
var mensajeUx;

function toggleMenuOpcionPermisoTrabajoAltoRiesgo(obj,pindex){
   objPermisoTraAltRie = listPermisoTraAltRie[pindex];
   indexPermisoTraAltRie = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesPermisoTrabajoAltoRiesgo=[
   {id: "opcEditarPerTraAltRie",
    nombre: "<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick: function(data){rellenarPermisoTrabajoAltoRiesgo()}},
   {id: "opcEliminarPerTraAltRie",
    nombre: "<i class='fa fa-trash-o'></i> Eliminar ",
    functionClick: function(data){eliminarPermisoTrabajoAltoRiesgo()}}
];

function marcarSubOpcionPermisoTrabajoAltoRiesgo(pindex){
   funcionalidadesPermisoTrabajoAltoRiesgo[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function habilitarPermisoTrabajoAltoRiesgo(){
   var dataParam={
      contratistaId: parseInt(getSession("contratistaGosstId"))
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/contratista/permiso_trabajo_alto_riesgo',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            var textTotal = "";
            listPermisoTraAltRie = data.listPermisoTraAltRie;
            listAnalisisTraSegSimple = data.listAnalisisTraSegSimple;
            listTipoExamenContratista = data.listTipoExamenContratista;
            listPrevencionista = data.listPrevencionista;
            
  	    $(".divListPrincipal").html("");
  	     
  	    listPermisoTraAltRie.forEach(function(val,index){
  	       var menuOpcion="",btnOpcion="";
  	       var textDescarga="------";
  	       
  	       menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
		    
  	       funcionalidadesPermisoTrabajoAltoRiesgo.forEach(function(val1,index1){
	          menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionPermisoTrabajoAltoRiesgo("+index1+")'>" +
			            val1.nombre +
			        "</li>";
  	       });
			    
  	       menuOpcion += "</ul>";
			    
               btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionPermisoTrabajoAltoRiesgo(this,"+index+")'>" +
		              "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
		           "</a>";
  	       
  	       if(val.evidenciaNombre != ""){
	          textDescarga =
		     "<a class='efectoLink' target='_blank' " +
		        "href='"+URL+"/contratista/permiso_trabajo_alto_riesgo/evidencia?id="+val.id+"'>"+
		        "<i class='fa fa-download'></i> "+val.evidenciaNombre + 
		     "</a>";
  	       }
  	           
  	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
                   label:"<span style='font-size:18px;font-weight:bolder;'>*** DATOS GENERALES ***</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
                   label:"<i class='fa fa-list-alt''></i> Actividad a realizar:",
  		   inputForm:val.analisisTrabajoSeguro.descripcion},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  		   label:"<i class='fa fa-list-alt'></i> Tipo de permiso de trabajo:",
  		   inputForm:val.tipoExamenContratista.nombre},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	           label:"<i class='fa fa-file'></i> Evidencia - Formato ATS:",
  	 	   inputForm:textDescarga},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	   label:"<i class='fa fa-calendar'></i> Registrado el ",
  	           inputForm:val.fechaRegistroTexto},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
  	           label:"<span style='font-size:18px;font-weight:bolder;'>*** PREVENCIONISTA ***</span>"},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	 	   label:"<i class='fa fa-users'></i> N° de prevencionistas registrados:",
  	 	   inputForm:val.numPrevencionistasRegistrados},
  	 	  {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",
  	  	   label:"",inputForm:
  	  	      "<a class='efectoLink' id='idLinkListPrevenPerTraAltRie"+index+"' " +
		         "onclick='cambiarContLinkListPrevenPerTraAltRie("+index+",0);'>" +
	                 "Ver lista prevencionistas <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	              "</a><br>" +
	              "<div id='idDivListPrevenPerTraAltRie"+index+"' style='display:none;font-weight:bold;background:#E4DCDC;'>"+
		          val.listPrevencionistasNombre.replace(/;/gi,"<br>")+
	              "</div>"},
  	 	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	 	  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	           label:"<span style='font-size:18px;font-weight:bolder;'>*** EVALUACIÓN ***</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",
	  	   label:val.evaluacion.nota.icono+" Estado:",
	  	   inputForm:val.evaluacion.nota.nombre}
  	       ]; 
  	       
  	       if(val.evaluacion.nota.id != 3){
  		  if(val.evaluacion.nota.id == 1){
  		     listTotal.push(
  	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
  	  	         inputForm:val.evaluacion.fechaTexto+" (Por "+val.evaluacion.usuario.nombre+")"});  
  		     
  		  }else{
  		     listTotal.push(
  	                {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	  	         label:"<i class='fa fa-exclamation-circle'></i> Observación:",
  	  	         inputForm:val.evaluacion.observacion},
  	  	        {sugerencia:"",anchoLabel:"",anchoDiv:"",
  	    	         label:"<i class='fa fa-calendar'></i> Evaluado el ",
  	    	         inputForm:val.evaluacion.fechaTexto+" (Por "+val.evaluacion.usuario.nombre+")"});
  		 }
  	       }
  				
  	       textTotal+="<div class='eventoGeneral'>";	
  		   
  	          listTotal.forEach(function(val,index){
  	   	     textTotal+=""+obtenerSubPanelModuloVersionDos(val);
  	          });
  		   
  	       textTotal+="</div>"
  		   
  	       textTotal+="<div class='divMovilPermisoTraAltRie' id='divPermisoTraAltRie"+val.id+"'></div>";
  	    });
  	    
  	    var textNuevo = "";
     	     
  	    textNuevo = 
               "<div id='estadoMovilPermisoTraAltRie'>" +
     	          "<div class='tituloSubList'>" +
     	             "<i class='fa fa-plus-square'></i> Nuevo Permiso de Trabajo de Alto Riesgo (PETAR) " +
     	             "<button style='font-size:15px' title='Registrar un nuevo PETAR' " +
     	                     "class='btn btn-success' onclick='nuevoPermisoTrabajoAltoRiesgo()'>" +
     	                "<i class='fa fa-pencil'></i> Registrar" +
     	             "</button>" +
     	          "</div>" +
     	          "<div class='contenidoSubList' style='display:none'>" +
     	          "</div>" +
     	       "</div>";
  	       
  	    $(".divListPrincipal").append(textNuevo);   
  	       
     	    listPanelesPrincipal.push({
     	       id:"infoMovilPermisoTraAltRie",clase:"",styleContenido:"display:none",
     	       nombre:"<i class='fa fa-hand-o-right'></i> " +
     	       	         "Reportes Registrados ("+listPermisoTraAltRie.length+")",
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

function cambiarContLinkListPrevenPerTraAltRie(pindex,val){
   if(val == 0){
      document.getElementById("idDivListPrevenPerTraAltRie"+pindex).style.display = "";
        
      document.getElementById("idLinkListPrevenPerTraAltRie"+pindex)
         .innerHTML = "Ocultar lista prevencionistas <i class='fa fa-angle-double-up' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListPrevenPerTraAltRie"+pindex).onclick = function(){cambiarContLinkListPrevenPerTraAltRie(pindex,1);}
   }else{
      document.getElementById("idDivListPrevenPerTraAltRie"+pindex).style.display = "none";
        
      document.getElementById("idLinkListPrevenPerTraAltRie"+pindex)
         .innerHTML = "Ver lista prevencionistas <i class='fa fa-angle-double-down' aria-hidden='true'></i>";
    
      document.getElementById("idLinkListPrevenPerTraAltRie"+pindex).onclick = function(){cambiarContLinkListPrevenPerTraAltRie(pindex,0);}
   }
}


function nuevoPermisoTrabajoAltoRiesgo(){
   objPermisoTraAltRie={
      id: 0,
      analisisTrabajoSeguro: {id: -1},
      tipoExamenContratista: {id: -1}
   };
   
   rellenarPermisoTrabajoAltoRiesgo();
}

function rellenarPermisoTrabajoAltoRiesgo(){
   $("#modalRellenarPermisoTraAltRie").remove();
   
   var listPrevencionistaAux = []; 
   
   listPrevencionista.forEach(function(val){
      val.selected = 0;
   });
   
   listPrevencionistaAux = listPrevencionista;
   
   var selActividadRealizada = crearSelectOneMenu("selActividadRealizada","",
      listAnalisisTraSegSimple,objPermisoTraAltRie.analisisTrabajoSeguro.id,"id","descripcion");
  
   var selTipoPermisoTrabajo = crearSelectOneMenu("selTipoPermisoTrabajo","",
      listTipoExamenContratista,objPermisoTraAltRie.tipoExamenContratista.id,"id","nombre");
   
   var linkPermisoTrabajoAltoRiesgo = 
      "<a class='efectoLink' target='_blank' " +
	 "href='"+URL+"/empresa/documento/evidencia?tipoId=15&id="+getSession("gestopcompanyid")+"'>" +
	 "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
      "</a>";
    
   var listItems=[
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Actividad a realizar",
       inputForm:selActividadRealizada},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Tipo de Permiso de Trabajo",
       inputForm:selTipoPermisoTrabajo},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8",
       label:"Prevencionistas",
       inputForm:"",divContainer:"divPrevencionistasPerTraAltRie"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-4",anchoDiv:"col-sm-8", 
       label:"Formato Permiso de Trabajo de Alto Riesgo (PETAR)",
       inputForm:linkPermisoTrabajoAltoRiesgo},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Evidencia",
       inputForm:"",divContainer:"divEvidenciaPerTraAltRie"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",anchoLabel:"",anchoDiv:"",
       inputForm:"<button type='submit' class='btn btn-success'style='float:right;font-size:18px;'>" +
		    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
		 "</button>"} 
   ];
    
   var textForm = "";
   
   listItems.forEach(function(val,index){
      textForm += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var opciones={
      id: "modalRellenarPermisoTraAltRie",
      nombre: "<i class='fa fa-pencil'></i> Registro Permiso Trabajo de Alto Riesgo (PETAR)",
      contenido: "<form id='formRellenarPermisoTraAltRie' class='eventoGeneral'>" +
                     textForm +
                 "</form>"
   };
   
   crearModalPrincipalUsuario(opciones,function(){
      if($("#selMulPrevencionistasPerTraAltRie").length > 0){
	 return;	
      } 
       
      if(objPermisoTraAltRie.id > 0){
	 var prevensId = objPermisoTraAltRie.listPrevencionistasId.split(",");       	                               			
	 listPrevencionistaAux.forEach(function(val1){
	    val1.selected = 0;
	                		
	    prevensId.forEach(function(val,index){
	       if(val == val1.id){
	          val1.selected = 1;
	       }
	    });
	 });
      }
      
      crearSelectOneMenuObligMultipleCompleto("selMulPrevencionistasPerTraAltRie","",listPrevencionistaAux,
	 "id","trabajadoresNombre","#divPrevencionistasPerTraAltRie","Todos");
   },true,true);
   
   var options={
      container: "#divEvidenciaPerTraAltRie",
      functionCall: function(){},
      descargaUrl: (objPermisoTraAltRie.id == 0?"":
	            "/contratista/permiso_trabajo_alto_riesgo/evidencia?id="+objPermisoTraAltRie.id),
      esNuevo: (objPermisoTraAltRie.id == 0),
      idAux: "DocPerTraAltRie",
      evidenciaNombre: (objPermisoTraAltRie.id == 0?"":objPermisoTraAltRie.evidenciaNombre)
   };

   crearFormEvidenciaCompleta(options);
   
   var editarDiv = $("#formRellenarPermisoTraAltRie");
 	
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarPermisoTraAltRie();
   });
}

function guardarPermisoTraAltRie(){
   var formDiv = $("#formRellenarPermisoTraAltRie");
   var campoVacio = true;
   
   var actividadId = parseInt($("#selActividadRealizada").val());
   var tipoPermisoTrabajoId = parseInt($("#selTipoPermisoTrabajo").val());
   
   var listPrevencionistasId = [];
   var prevencionistasId = $("#selMulPrevencionistasPerTraAltRie").val();
         
   if(prevencionistasId != null){
      prevencionistasId.forEach(function(val){
         listPrevencionistasId.push({
            id: parseInt(val)
         });
      });
   }
  
   var nombreEvidencia = $("#inputEviDocPerTraAltRie").val();
   
   if(actividadId == -1 || tipoPermisoTrabajoId == -1 || listPrevencionistasId.length == 0 ||
      nombreEvidencia.length == 0){
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: objPermisoTraAltRie.id,
	 analisisTrabajoSeguro: {id: actividadId},
	 tipoExamenContratista: {id: tipoPermisoTrabajoId},
         listPrevencionistas: listPrevencionistasId,
         contratistaId: parseInt(getSession("contratistaGosstId"))
      };
	 
      callAjaxPost(URL+'/contratista/permiso_trabajo_alto_riesgo/save',dataParam,procesarGuardarEvidenciaPermisoTraAltRie);
   }else{
      $("#modalRellenarPermisoTraAltRie").modal("hide");
 	
      mensajesUx(mensajeUx,2,"","AvisoCompletarCamposPerTraAltRie");

      $("#modalMensajeUxAvisoCompletarCamposPerTraAltRie").on("hidden.bs.modal",function(){
         $("#modalRellenarPermisoTraAltRie").modal("show");
      });
   }
}

function procesarGuardarEvidenciaPermisoTraAltRie(data){
   switch(data.CODE_RESPONSE){
      case "05":
         guardarEvidenciaAuto(data.nuevoId,"fileEviDocPerTraAltRie",bitsMega*10,
            "/contratista/permiso_trabajo_alto_riesgo/evidencia/save",function(){
	       $("#modalRellenarPermisoTraAltRie").modal("hide");  
	    	
	       mensajeUx = "<label>El Permiso de Trabajo de Alto Riesgo (PETAR) " +
	       		   "fue registrado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarPerTraAltRie");
		    	 
	       $("#modalMensajeUxActualizarPerTraAltRie").on("hidden.bs.modal",function(){
	          habilitarPermisoTrabajoAltoRiesgo();     
	       });
            });
         break;

      default:
         alert("Ocurrió un error al guardar la evidencia!");
   }
}

function eliminarPermisoTrabajoAltoRiesgo(){
   $("#modalRellenarPermisoTraAltRie").modal("hide");
 	
   mensajeUx="<label>¿Está seguro de eliminar el Permiso de Trabajo de Alto " +
             "Riesgo (PETAR) seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","RegPerTraAltRie");

   $("#btnDevolverValorRegPerTraAltRie").on("click",function(){
      var dataParam={
 	 id: objPermisoTraAltRie.id
      };
 		     
      callAjaxPost(URL+'/contratista/permiso_trabajo_alto_riesgo/delete',dataParam,function(data){
 	 switch(data.CODE_RESPONSE){
            case "05":
 	       mensajeUx="<label>El Permiso de Trabajo de Alto Riesgo (PETAR) seleccionado " +
 		         "se ha eliminado correctamente.</label>";
 	       mensajesUx(mensajeUx,1,"","ActualizarPerTraAltRie");
 		       
 	       $("#modalMensajeUxActualizarPerTraAltRie").on("hidden.bs.modal",function(){
 	          habilitarPermisoTrabajoAltoRiesgo(); 
 	       });
 	       break;
 							
            default:
 	       alert("Ocurrió un error al eliminar el Permiso de Trabajo de Alto Riesgo (PETAR!");
 	 }
       });
    });
    
    $("#btnRegresarPrevioRegPerTraAltRie").on("click",function(){
       $("#modalRellenarPermisoTraAltRie").modal("show");  
    });
 }
