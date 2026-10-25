var configImpactId;
var configImpactObj;
var configImpactPregId;
var configImpactPregObj;
var listFullTipoAuditoria=[],listFullPreguntasAudiClas=[];
var tipoAudi;
var listFullClasificacion=[];
var banderClasEdicion=false;
var titulo="";
var mensajeUx;

function verConfigImpacto(){
   if(auditoriaClasif == 1){
      titulo = "Auditoría";
   }else if(auditoriaClasif == 2){
      titulo = "Inspección";
   }else if(auditoriaClasif == 3){
      titulo = "Proyecto";
   }
	
   $("#divAudi").hide();$("#fsBotones").hide();$("#divConfigImpacto").show();
   $("#divListClasif").hide();$("#btnResetBuscadorAuditoria").hide();$("#btnAplicarBuscadorAuditoria").hide();
   $("#valBuscarValorAuditoria").hide();
   
   $("#tituloAuditoria").html("<a onclick='cancelarAuditoria();'>"+titulo+"</a> > Configuración del impacto");
   $("#btnCancelarClasif").attr("onclick","javascript: cargarConfugrarPorTipoAuditoria();");
   $("#btnGuardarClasif").attr("onclick","javascript: guardarConfigImpactoPregunta();");
   
   cargarConfiguracionImpacto();
}

function cargarConfiguracionImpacto(){
   resizeDivWrapper("wrapperConfigImpacto",140);

   var dataParam={
      auditoriaClasifId: auditoriaClasif,
      empresaId: parseInt(getSession("gestopcompanyid"))   
   };
   
   callAjaxPost(URL+'/auditoria/tipos/calificacion',dataParam,function(data){
      if(data.CODE_RESPONSE = "05"){
	 listFullTipoAuditoria = data.list;
	    
	 $("#tblConfigImpacto tbody tr").remove();
	    
	 listFullTipoAuditoria.forEach(function(val,index){
	    var enlaceConfiguracion = (val.numPreguntas == 0?"":"<br>" +
	       "<a onclick='configurarPorTipoAuditoria("+index+");' class='efectoLink' " +
	          "title='Enlace Configurar - Permite acceder a una tabla para realizar los respectivos cambios " +
	          "(en las columnas, pregunta, clasificación y peso) de la lista asociada a una determinada fila.'>" + 
	          "<i class='fa fa-cog'></i> Configurar" + 
               "</a>");
		
	     
            $("#tblConfigImpacto tbody").append(
               "<tr id='trconfig"+val.audiTipoId+"'>" +
	          "<td id='configlistnomb"+val.audiTipoId+"'>"+val.audiTipoNombre+"</td>" +
	          "<td id='configfech"+val.audiTipoId+"'>"+val.fechaUltimaModificacionTexto+"</td>" +  
	          "<td id='confignumpre"+val.audiTipoId+"'>"+val.numPreguntas+enlaceConfiguracion+"</td>" +   
	          "<td id='confignummuyalto"+val.audiTipoId+"'>"+val.numPreguntasMuyAlto+"</td>" +   
	          "<td id='confignumalto"+val.audiTipoId+"'>"+val.numPreguntasAlto+"</td>" +  
	          "<td id='confignummedio"+val.audiTipoId+"'>"+val.numPreguntasMedio+"</td>" +
		  "<td id='confignumbajo"+val.audiTipoId+"'>"+val.numPreguntasBajo+"</td>" +
	       "</tr>");
	 });
				
	 completarBarraCarga();
	 formatoCeldaSombreableTabla(true,"tblConfigImpacto");
      }
	 
      goheadfixedY("#tblConfigImpacto","#wrapperConfigImpacto");
   });
}

function configurarPorTipoAuditoria(pindex){
   configImpactObj = listFullTipoAuditoria[pindex];
   configImpactId = configImpactObj.audiTipoId;
   
   cargarConfugrarPorTipoAuditoria();
}

function cargarConfugrarPorTipoAuditoria(){
   resizeDivWrapper("wrapperListClasificaciones",160);
	
   $("#divAudi").hide();$("#fsBotones").hide();$("#divConfigImpacto").hide();
   $("#divListClasif").show();$("#btnCancelarClasif").hide();$("#btnGuardarClasif").hide();
   
   $("#tituloAuditoria").html("<a onclick='cancelarAuditoria();'>"+titulo+"</a> > " +
      "<a onclick='verConfigImpacto()'>Configuración de Impacto </a> > Lista "+configImpactObj.audiTipoNombre);
   
   var dataParam={
      auditoriaTipo: configImpactObj.audiTipoId,
      empresaId: parseInt(getSession("gestopcompanyid"))   
   };
   
   callAjaxPost(URL+'/auditoria/tipos/calificacion/preguntas',dataParam,function(data){
      if(data.CODE_RESPONSE = "05"){
         banderClasEdicion = false;
            
         listFullPreguntasAudiClas = data.list_preguntas;
         listFullClasificacion = data.clasificacion;
            
         $("#tblListClasif tbody tr").remove();
				
         listFullPreguntasAudiClas.forEach(function(val,index){
            $("#tblListClasif tbody").append(
               "<tr id='trpregclas"+val.pregunta.id+"' onclick='editarListClasifPreguntas("+index+")'>" +
	          "<td id='pregid"+val.pregunta.id+"'>"+val.pregunta.id+"</td>" +
	          "<td id='pregclasnomb"+val.pregunta.id+"'>"+val.pregunta.nombre+"</td>" +
	          "<td id='pregclasclasnomb"+val.pregunta.id+"'>"+val.clasificacion.nombre+"</td>" +
	          "<td id='pregpeso"+val.pregunta.id+"'>"+val.peso+"</td>" +
		  "<td id='pregclasfecha"+val.pregunta.id+"'>"+val.fechaModificacion+"</td>" + 
	       "</tr>");
         });
            
         completarBarraCarga();
         formatoCeldaSombreableTabla(true,"tblListClasif");  
      }
         
      goheadfixedY("#tblListClasif","#wrapperListClasificaciones");
   });
}

function editarListClasifPreguntas(pindex){
	
   if(!banderClasEdicion){
		
      $("#btnCancelarClasif").show();
      $("#btnGuardarClasif").show();
      configImpactPregId=listFullPreguntasAudiClas[pindex].id;
      configImpactPregObj=listFullPreguntasAudiClas[pindex];
      
      $("#trpregclas"+configImpactPregObj.pregunta.id).addClass("fila-edicion");
      //console.log(configImpactPregObj.pregunta.id);
      var clasificacion=configImpactPregObj.clasificacion.id;
      var selClasificacionPregImpact;
		
      if(clasificacion==0){
         selClasificacionPregImpact=crearSelectOneMenuOblig("inputClasificacionImpacto","",listFullClasificacion,"","id","nombre");
      }else{
	 selClasificacionPregImpact=crearSelectOneMenuOblig("inputClasificacionImpacto","",listFullClasificacion,clasificacion,"id","nombre");
      }
		
      $("#pregclasclasnomb"+configImpactPregObj.pregunta.id).html(selClasificacionPregImpact);
      $("#pregpeso"+configImpactPregObj.pregunta.id).html("<input class='form-control' id='numPesoPreg' type='number'>");
      $("#numPesoPreg").val(configImpactPregObj.peso);
         formatoCeldaSombreableTabla(false,"tblListClasif");
         banderClasEdicion=true;
      }
}

function guardarConfigImpactoPregunta(){

   var clasificacion=$("#inputClasificacionImpacto").val();
   var pregunta=configImpactPregObj.pregunta.id;
   var empresa= getSession("gestopcompanyid");
   var peso=$("#numPesoPreg").val();
	
   var dataParam={
	   id:configImpactPregId,
	   pregunta:{id:pregunta},peso:peso,
	   empresa:{empresaId:empresa},
	   clasificacion:{id:clasificacion}
       }
	
   callAjaxPost(URL+'/auditoria/tipos/calificacion/preguntas/save',dataParam,
      function(data){
         if(data.CODE_RESPONSE=="05"){
            mensajeUx= "Su registro se ha guardado correctamente";
            mensajesUx(mensajeUx,1,""); 
            cargarConfugrarPorTipoAuditoria();
	 }else{
	    //alert("ERROR AL GUARDAR !");
	    mensajeUx="Error al guardar.";
	    mensajesUx(mensajeUx,2,"");
	 }
      });
}
