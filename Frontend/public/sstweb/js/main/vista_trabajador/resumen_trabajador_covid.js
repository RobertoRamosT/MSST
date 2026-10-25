
var listFullTrabajadorCovid=[];
var listAreasId = [];
var listEstadosFormularioCovidId = [];
var fechaHoyTextoVal;

function ocultarFiltroResumenTrabajadorCovid(){
   $("#modalFiltroResTraCov").modal("hide");
}

function verFiltroResumenTrabajadorCovid(){
   $("#modalFiltroResTraCov").modal("show");
}

function crearFiltroResumenTrabajadorCovid(functionCallBack){
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      idCompany: getSession("gestopcompanyid"),
      trabajadorId: getSession("trabajadorGosstId")
   }; 
 		
    callAjaxPost(URL + '/covid/trabajadores/filtro',dataParam,function(data){
       var listAreas= data.listAreas;
       var listEstadosFormularioCovid= data.listEstadosFormularioCovid;
//       fechaHoyTextoVal = data.fechaHoyTextoVal;
//       var hoy=fechaHoyTextoVal;
       
       var contenido = "";
 				
       var listContenido=[
//        {sugerencia:"",anchoLabel:"",anchoDiv:"",
//         label:"Fecha",inputForm:"<input type='date' id='fechaResTraCov' class='form-control'>"},
//        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",
           label:"Área",inputForm:"",divContainer: "divFiltroAreasResTraCov"},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",
           label:"Estado del formulario renovable",inputForm:"",divContainer:"divFiltroEstadosFormularioResTraCov"},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
          {sugerencia:"",anchoLabel:"",anchoDiv:"",
           label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		         "onclick='ocultarFiltroResumenTrabajadorCovid()'>" +
		    "<i class='fa fa-times'></i> Cancelar" +
		 "</button>",
           inputForm:"<button id='btnAplicarFiltroResTraCov' class='btn btn-success' type='submit' " +
	                     "style='float:right;font-size:18px;'>" +
	                "<i class='fa fa-filter'></i> Aplicar filtro" +
	             "</button>"}
 	];
 				
       listContenido.forEach(function(val){
          contenido += obtenerSubPanelModuloVersionDos(val);
       });
 				
       var modalOptionsCov={
	  id: "modalFiltroResTraCov",
	  nombre: "<i class='fa fa-filter'></i> Filtros - Trabajadores a cargo",
	  contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
       };
 				
       crearModalPrincipalUsuario(modalOptionsCov,function(){
          if($("#filtroAreasResTraCov").length > 0){
 	     return;
          }
          
//        listEstadosFormularioCovid.forEach(function(val){
//           if(val.id == 3){
//    	        val.selected = 1;
//     	     }else{
//     	        val.selected = 0; 
//     	     }
//        });
          
          crearSelectOneMenuObligMultipleCompleto("filtroAreasResTraCov","",listAreas,"areaId",
         	    "areaName","#divFiltroAreasResTraCov","Todos");
          crearSelectOneMenuObligMultipleCompleto("filtroEstadosFormularioResTraCov","",listEstadosFormularioCovid,"id",
       	    "nombre","#divFiltroEstadosFormularioResTraCov","Todos");
       },false);
       
//       $("#fechaResTraCov").val(hoy);
 				
       $("#btnAplicarFiltroResTraCov").on("click",function(){
	  ocultarFiltroResumenTrabajadorCovid();
	  functionCallBack(cargarResumenTrabajador);
       });
 				
       $("#modalFiltroResTraCov").modal("hide");
       functionCallBack(cargarResumenTrabajador);
    });
}

function valoresFiltroResumenTrabajadorCovid(functionCallBack){
   listAreasId = [];
   var areaId = $("#filtroAreasResTraCov").val();
    
   if(areaId != null){
      areaId.forEach(function(val){
 	 listAreasId.push(parseInt(val));
      });
   }
    
   listEstadosFormularioCovidId = [];
   var estadosFormularioId = $("#filtroEstadosFormularioResTraCov").val();
   
   if(estadosFormularioId != null){
      estadosFormularioId.forEach(function(val){
	 listEstadosFormularioCovidId.push(parseInt(val));
      });
   }
    
   functionCallBack();
}
 
function habilitarResumenTrabajador(){
   $("#modalFiltroResTraCov").remove(); 
   crearFiltroResumenTrabajadorCovid(valoresFiltroResumenTrabajadorCovid);
}

function cargarResumenTrabajador(){
//   valoresFiltroResumenTrabajadorCovid();
//   var hoy = fechaHoyTextoVal; 
    
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      trabajadorResponsableId: getSession("trabajadorGosstId"),
// 	   fechaFormularioRenovable:($("#fechaResTraCov").val() == undefined ?hoy:$("#fechaResTraCov").val()),
      listAreasIdFiltro: (listAreasId.length == 0?null:listAreasId),
      listEstadosFormularioIdFiltro: (listEstadosFormularioCovidId.length == 0?null:listEstadosFormularioCovidId),
      trabajadorEsResponsable: (listAreasId.length == 0?1:0)
   };
    
   var listPanelesPrincipal=[];
   
   callAjaxPost(URL+'/covid/trabajadores/revisar/vista_colaborador',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            $("#wrapper").block({message:'<img src="../imagenes/gif/ruedita.gif"></img>cargando...'});
              	
            listFullTrabajadorCovid = data.trabajadores;
 	    $(".divListPrincipal").html("");
 	     
 	    var textTotal="";
 	      
 	    listFullTrabajadorCovid.forEach(function(val,index){
               var colorEstadoFormRen = 
	          (val.estadoFormularioFecha == 'Completado'?"blue":
	           (val.estadoFormularioFecha == 'Sin Completar'?"red":"green"));
	       	   
	       var colorEstadoTrab = 
	          (val.estadoTrabajadorObsMedFecha == 'Pendiente  - Revisión médica del día'?"red":
	           (val.estadoTrabajadorObsMedFecha == 'Habilitado'?"blue":"#ffc644"));
	       	   
	       var listTotal=[
	          {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	           label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Datos generales</span>"},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",label:"<i class='fa fa-user'></i> Nombre:",inputForm:val.nombre},
	          {sugerencia:"",label:"<i class='fa fa-plus-square'></i> Área:",inputForm:val.area.areaName},
	          {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	          {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	     	   label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Estado Actual</span>"},
	     	  {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    	  {sugerencia:"",label:"<i class='fa fa-list-alt'></i> Estado del formulario renovable:",
	           inputForm:"<span style='color:"+colorEstadoFormRen+";font-weight:bold;'>"+
	    		         val.estadoFormularioFecha +
	    		     "</span>"},
	          {sugerencia:"",label:"<i class='fa fa-list-alt'></i> Estado del trabajador:",
	           inputForm:"<span style='color:"+colorEstadoTrab+";font-weight:bold;'>"+
	    	                 val.estadoTrabajadorObsMedFecha +
	    	             "</span>"}
	       ]; 
	     	       	   
	       if(val.estadoTrabajadorObsMedFecha != 'Habilitado'){ 
	    	  listTotal.push(
	    	     {sugerencia:"",label:"<i class='fa fa-calendar'></i> Estado según la última observación médica:",
		      inputForm:val.ultimaObservacionMedica.estadoMedicoCovid.nombre},
	    	     {sugerencia:"",label:"<i class='fa fa-calendar'></i> Fecha estimada de retorno:",
	    	      inputForm:val.fechaEstimadaRetornoTexto});  
	       }
 				
	       textTotal+="<div class='eventoGeneral'>";	   
 		   
	       listTotal.forEach(function(val,index){
 	          textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	       });
 		   
	       textTotal+="</div>";
 	    });
 	     
    	    var textNuevo ="";
    	     
    	     textNuevo ="<div id='estadoMovilResumenTrabajadorCovid'>" +
    	                   "<div style='font-size:20px;' class='tituloSubList'> " +
                              "Consolidado Historial de vacunas COVID-19"+
                              "<button title='Ver el consolidado Historial de vacunas COVID-19' " +
                                      "class='btn btn-success' onclick='verTablaConsolidadoHistorialVacunaCovid()'>"+
                                 "<i class='fa fa-table fa-2x'></i>" +
                              "</button>" +
                           "</div>" +
                           "<div style='font-size:20px;' class='tituloSubList'> " +
                              "Evaluación - Carné vacunación COVID-19"+
                              "<button title='Realizar evaluación - Carné vacunación COVID-19' " +
                                      "class='btn btn-success' onclick='verTablaConsolidadoEvaluacionVacunacionCovid()'>"+
                                 "<i class='fa fa-pencil-square-o fa-2x'></i>" +
                              "</button>" +
                           "</div>" +
    	                   "<div style='font-size:20px;' class='tituloSubList'>Filtro"+
    	                         "<button title='Filtro trabajador a cargo' " +
    	                                 "class='btn btn-success' onclick='verFiltroResumenTrabajadorCovid()'>"+
    	                            "<i class='fa fa-filter fa-2x'></i>" +
    	                         "</button>" +
    	                   "</div>" +
    	                   "<div class='contenidoSubList' style='display:none'>" +
    	                   "</div>" +
    	                "</div>";
    	     
    	     $(".divListPrincipal").append(textNuevo);
    	     
 	     listPanelesPrincipal.push(
 		{id:"infoMovilResumenTrabajadorCovid",clase:"",
 	 	 nombre:""+"Trabajadores a cargo ("+listFullTrabajadorCovid.length+")",
 	         contenido:""+textTotal}
 	     );
 			
 	     agregarPanelesDivPrincipal(listPanelesPrincipal,"display:none");
 			
 	     $(".listaFinalGestionGosst").hide();
 	     $(".contenidoFormVisible").hide();
 	     break;
 	     
 	  default:
 	     alert("nop");
 	     break;
       }
       
    })
}

