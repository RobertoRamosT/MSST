
var trabInformacionId,indexTrabInformacion,eventoTrabInformacionObj = {};
var listTrabajadoresInformacion = [];
var mensajeUx;

function toggleMenuOpcionTrabajadorInformacion(obj,pindex){
   eventoTrabInformacionObj = listTrabajadoresInformacion[pindex];
   indexTrabInformacion = pindex;
    
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide();
}

var funcionalidadesTrabajadorInformacion=[
//   {id: "opcEvaluar",nombre: "<i class='fa fa-pencil-square-o'></i> Subir con evidencia",
//    functionClick: function(data){verPreguntasListaHomologacionContratista()}},
   {id:"opcSubirDibujo",nombre:"<i class='fa fa-pencil-square-o'></i> Subir con trazo",
    functionClick: function(data){subirFirmaDigitalPorTrazoTrabajadorInformacion()}}
];

function marcarSubOpcionTrabajadorInformacion(pindex){
   funcionalidadesTrabajadorInformacion[pindex].functionClick();
   $(".subDetalleAccion ul").hide();$(".listaFinalGestionGosst").hide();
}

function ocultarFiltroTrabajadorInformacion(){
   $("#modalFiltroTrabInformacion").modal("hide");
}

function verFiltroTrabajadorInformacion(){
   $("#modalFiltroTrabInformacion").modal("show");
}

function crearFiltroTrabajadorInformacion(functionCallBack){
   var contenido = "";
  				
   var listContenido=[
      {sugerencia:"",label:"Buscar",inputForm:"<input id='inputBuscarTrabajadorInfo' class='form-control'>" +
       "<label>*Buscar trabajador por N° documento y/o nombre/apellido.</label>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarFiltroTrabajadorInformacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
  	  		 "onclick='valoresFiltroTrabajadorInformacion()'>" +
  	            "<i class='fa fa-filter'></i> Aplicar filtro" +
  	         "</button>"},
   ]; 
  				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   		
   var modalOptionsDocPerExt={
      id:"modalFiltroTrabInformacion",
      nombre:"<i class='fa fa-filter'></i> Filtros - Trabajadores",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
  				
   crearModalPrincipalUsuario(modalOptionsDocPerExt,function(){},true,true);
  				
   functionCallBack();
}

function valoresFiltroTrabajadorInformacion(){
   ocultarFiltroTrabajadorInformacion(); 
   
   habilitarTrabajadorInformacion();
}

function habilitarTrabajadorInformacion(){
   var buscarTrabajador = $("#inputBuscarTrabajadorInfo").val().trim();
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid")),estadoActivo: 1,
      trabajadorNombre: (buscarTrabajador.length == 0?null:"%"+buscarTrabajador+"%")
   };
    
   var listPanelesPrincipal=[];
  	
   callAjaxPost(URL+'/trabajador/informacion',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            listTrabajadoresInformacion = data.listTrabajadoresInformacion;
  	    
  	    $(".divListPrincipal").html("");
  	    
  	    var textTrabInformacion = "";
  	     
  	    listTrabajadoresInformacion.forEach(function(val,index){
  	       var btnOpcion = "",menuOpcion = "";
  	       
	          menuOpcion = "<ul class='list-group listaFinalGestionGosst'>"; 
	          funcionalidadesTrabajadorInformacion.forEach(function(val1,index1){
		        menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionTrabajadorInformacion("+index1+")'>" +
				          val1.nombre +
				      "</li>";
	             });		    
	          menuOpcion += "</ul>";
				    
	          btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionTrabajadorInformacion(this,"+index+")'>" +
			         "<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
			      "</a>";
  	       
	       var estiloGosst = (val.firmaDigitalNombre.length > 0?"gosst-aprobado":"gosst-desaprobado"),
	          estadoFirma = (val.firmaDigitalNombre.length > 0?"Sí":"No");
	       
               var enlaceFirmaDigital = (val.firmaDigitalNombre.length == 0?"------":
	          "<a class='efectoLink' target='_blank' href='"+URL+"/scheduler/firma_digital/imagen?id="+val.trabajadorId+"'>"+
		      val.firmaDigitalNombre +
	          "</a>");
  	       
  	       var listTotal=[
                  {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
  		   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
  			    "*** DATOS GENERALES ***"+
  			 "</span>"},
                  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-user'></i> Trabajador(a):",inputForm:val.nombre},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-building'></i> Puesto de trabajo:",inputForm:val.puesto.nombre},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-question-circle'></i> ¿Subió su firma digital?",inputForm:estadoFirma},
  		  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-file'></i> Firma digital:",inputForm:enlaceFirmaDigital}
  	       ];  
  	       		
  	       textTrabInformacion += "<div class='eventoGeneral "+estiloGosst+"'>" +
  	                                 "<form class='eventoGeneral'>";	
  	          listTotal.forEach(function(val,index){
  	             textTrabInformacion += obtenerSubPanelModuloVersionDos(val);
  	          });
  	       textTrabInformacion +=    "</form>" +
  		                      "</div>";
  	       
  	    });
  	    
  	    var btnFiltro = 
  	       "<button type='button' class='btn btn-success' style='padding:0px 4px 0px 4px;margin-right:10px' " +
                       "onclick='verFiltroTrabajadorInformacion()' title='Ver valores del filtro para aplicarlo a esta sección.'>" +
                  "<i class='fa fa-filter fa-4x'></i>" +
               "</button>";
  	    
     	    listPanelesPrincipal.push(
               {id: "infoMovilTrabInformacion",clase:"",styleAux:"",buttonAd:btnFiltro,btnOnclickAux:"",btnIconoAux:"",
		btnTitleAux:"",nombre:"Trabajadores activos en la empresa ("+listTrabajadoresInformacion.length+")",
		contenido:textTrabInformacion});
			
	    agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	    $(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
     	    break;
  	     
         default:
  	    alert("nop");
  	    break;
      }
   });
}

function ocultarSubirFirmaDigitalPorTrazoTrabajadorInformacion(){
   $("#modalSubirFirmaDigitalTrazoTrabInfo").modal("hide");
}

function subirFirmaDigitalPorTrazoTrabajadorInformacion(){
   $("#modalSubirFirmaDigitalTrazoTrabInfo").remove();
    
   var contenido = "";
	
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Firma digital:",inputForm:"",divContainer:""},
      {sugerencia:"",label:"",fullRow:1,divContainer:"",
       inputForm:"<canvas style='border:1px solid black;width:100%;height:160px' id='idCanvasFirmaDigital'></canvas>"},
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"<span style='color:red;font-size:10px;font-weight:bolder;'>NOTA:</span> " +
	     "<span style='font-size:10px;font-weight:bolder;'>*Las firmas solo se utilizarán para completar los formatos de la " +
	     "R.M. 050 2013 TR de formaciones presenciales. Además se acompañará esta evidencia con una validación de asistencia de " +
	     "voz / video de participación / foto de todos los asistentes.</span>",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarSubirFirmaDigitalPorTrazoTrabajadorInformacion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
 	      		 "onclick='guardarFirmaDigitalPorTrazoTrabajadorInformacion()'>" +
 	            "<i class='fa fa-floppy-o'></i> Guardar" +
 	         "</button>"}
   ];
 				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
    
   var modalOptions={
      id: "modalSubirFirmaDigitalTrazoTrabInfo",	
      nombre: "<i class='fa fa-pencil'></i> Subir firma digital por trazo - "+eventoTrabInformacionObj.nombre,
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
					
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
   var accesoCelular = (isMobile.any() == true?1:0);
   
   initCanvas("idCanvasFirmaDigital",accesoCelular);
}

function guardarFirmaDigitalPorTrazoTrabajadorInformacion(){
   var dataURL = canvas.toDataURL();
   var blobBin = atob(dataURL.split(',')[1]);
   var array = [];
    
   for(var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
   }
    
   var fileBlob = new Blob([new Uint8Array(array)],{type:'image/png'});
   
   var fileName = 'fd_'+eventoTrabInformacionObj.dni+'.jpg'.replace(/,/g,"_");
   var file = new File([fileBlob],fileName,{type:'image/png'});
   
   var dataParam={
      id:eventoTrabInformacionObj.trabajadorId,file:file
   };
   
   guardarInitCanvasEvidenciaAuto(URL+"/trabajador/firma_digital/imagen/save",dataParam,1,1,1,function(data){
      switch(data.CODE_RESPONSE){
         case "05":  
            $("#modalSubirFirmaDigitalTrazoTrabInfo").remove();
 	    
            mensajeUx="<label>El registro de la firma digital se guardó con éxito.</label>";
            mensajesUx(mensajeUx,1,"","ActualizarVistaTrab");
       		    
            $("#modalMensajeUxActualizarVistaTrab").on("hidden.bs.modal",function(){
               habilitarTrabajadorInformacion();    
            });
             
            break;
						
         default:
	    alert("Ocurrió un error al guardar el registro de la firma digital");
         
            break;
      }
   });
}
