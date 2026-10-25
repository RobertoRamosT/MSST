/**
 * 
 */
function habilitarSeccionGeneralMedicoCovid(){
   var listPanelesPrincipalResumen=[
//      {id:"subDescarga",clase:"divProyectoGeneral",
//       nombre:"asds",contenido:""},
      {id:"subDescargaOpcionesExcel",clase:"divProyectoGeneral",
       nombre:"excel consolidado estado trabajador obs med",contenido:""},
           {id:"subConsolidado",clase:"divProyectoGeneral",nombre:"consolidado",contenido:""},
           {id:"subConsolidadoResumen",clase:"divProyectoGeneral",nombre:"consolidado resumen",contenido:""},
           {id:"subConsolidadoSeguimiento",clase:"divProyectoGeneral",nombre:"consolidado seguimiento",contenido:""},
           {id:"subParametroTrabajador",clase:"divProyectoGeneral",nombre:"<i class='fa fa-search'></i>Buscar trabajador",contenido:""},
           {id:"subResultadoTrabajador",clase:"divProyectoGeneral",nombre:"Resultado de búsqueda",contenido:""},
	   			   ];
   agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);

  var  listContenidoGeneralColab = [
   	                    
   	                     {sugerencia:"",label:"<i class='fa fa-search'></i>Buscar Trabajador",
   	                    	 inputForm:"<input class='form-control' id='inputTrabNombreFormCovid' >",divContainer:""},
   	                     {sugerencia:"",label:"Trabajador asignado",inputForm:"",divContainer:"divSelTrabajadorFormCovid"},
   	                  { inputForm:"<button class='btn btn-success' ><i class='fa fa-search'></i>Buscar</button>",divContainer:"divSelTrabajadorFormCovid",lineaFull : true},
   	                        ];
  var contenido = "<form  class='eventoGeneral'>";
	listContenidoGeneralColab.forEach(function(val){
		contenido +=obtenerSubPanelModuloGeneral(val);
	});
	contenido+="</form>";
$("#subParametroTrabajador").find(".contenidoSubList").html(contenido).show();
$("#subParametroTrabajador").find(".contenidoSubList form").on("submit",function(e){
   e.preventDefault();
   verFormularioCovidTrabajador();
});
   
//   var buttonDescarga =
//      "<button style='float:right;font-size:12px;' class='btn btn-success' " +
//              "onclick='verModalExcelTrabajadorCovid()'>" +
//         "<i class='fa fa-download' aria-hidden='true'></i>" +
//      "</button>";
//
//   $(".divListPrincipal").find("#subDescarga .tituloSubList")
//   .html(buttonDescarga+"<i class='fa fa-download'></i> Descargar matriz resumen de Formularios COVID-19 - Trabajadores" );
   
   var buttonDescargaOpcionesExcel = 
      "<button style='float:right;font-size:12px;padding:4px 8px 4px 8px;' class='btn btn-success' " +
              "onclick='elegirOpcionGenerarExcelVistaMedCov()'>" +
         "<i class='fa fa-file-excel-o fa-2x' aria-hidden='true'></i>" +
      "</button>";

   $(".divListPrincipal").find("#subDescargaOpcionesExcel .tituloSubList")
   .html(buttonDescargaOpcionesExcel+"<i class='fa fa-list'></i> Lista de consolidados - Excel");
   
   var btnConsolidado = "<button onclick='verTablaConsolidadoTrabajadoresCovid()' class='btn btn-success' title='Ver Consolidado Trabajadores - COVID-19'>" +
	"<i class='fa fa-2x fa-arrow-right'></i></button>";
   
   $("#subConsolidado .tituloSubList")
      .html("<i aria-hidden='true' class='fa fa-table'></i> Ver Consolidado - Trabajadores"+btnConsolidado);
   
   var btnConsolidadoResumen = "<button onclick='verTablaConsolidadoResumenCovid()' class='btn btn-success' title='Ver Consolidado Resumen - Casos activos COVID-19'>" +
	"<i class='fa fa-2x fa-arrow-right'></i></button>";

   $("#subConsolidadoResumen .tituloSubList")
      .html("<i aria-hidden='true' class='fa fa-medkit'></i> Ver Consolidado Resumen - Casos activos COVID-19"+btnConsolidadoResumen);

   var btnConsolidadoSeguimiento = "<button onclick='verTablaConsolidadoSeguimientoCovid()' class='btn btn-success' title='Ver Consolidado Seguimiento - Trabajadores COVID-19'>" +
	"<i class='fa fa-2x fa-arrow-right'></i></button>";

   $("#subConsolidadoSeguimiento .tituloSubList")
      .html("<i aria-hidden='true' class='fa fa-book'></i> Ver Consolidado - Seguimiento COVID-19"+btnConsolidadoSeguimiento);

   
   verAcordeBuscarTrabajadorFormCovid();
}
function verFormularioCovidTrabajador(){
    var menuOpcion="<ul class='list-group listaFinalGestionGosst' >";
	
    funcionalidadesTrabajadorCovidRevisar.forEach(function(val1,index1){
	       menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionTrabajadorCovidRevisar("+index1+")'>"+val1.nombre+" </li>";
    });
			
    menuOpcion+="</ul>";
    var dataParam ={
	    trabajadorId : parseInt($("#selAutoTrabajadorFormCovid").val())
    }
    callAjaxPost(URL+"/covid/trabajadores/revisar",dataParam,function(data){
	 listTrabajadoresCovidRevisar=data.trabajadores;
	 var textTotal="";
	 listTrabajadoresCovidRevisar.forEach(function(val,index){
	     var btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionTrabajadorCovidRevisar(this,"+index+")'>" +
		    "<i class='fa  fa-caret-down' aria-hidden='true'></i> Ver Opciones</a>" ;
		    var listTotal=obtenerListaDatosTrabajadorCovid(val,btnOpcion,menuOpcion);
		     textTotal="<div class='eventoGeneral'>";
		    listTotal.forEach(function(val,index){
		    textTotal+=""+obtenerSubPanelModulo(val);
		    });
		    textTotal+="</div>";
	 });
	 estadoEspecificoCovidGlobalId = listTrabajadoresCovidRevisar[0].estadoEspecificoCovid.id;
	 $("#subResultadoTrabajador").find(".contenidoSubList").html(textTotal).show();
	 $(".listaFinalGestionGosst").hide();
	 $(".contenidoFormVisible").hide();
	 
	
    });
}
function verAcordeBuscarTrabajadorFormCovid(){
	 var nombre = $("#inputTrabNombreFormCovid").val().trim();
		
	   if(nombre == ""){
	      nombre = null
	   };
	    
	   var dataParam={
		   trabajadorNombre : "%"+nombre+"%",
		   empresaId : getSession("gestopcompanyid")
		   }
		
	   callAjaxPostNoLoad(URL+"/covid/buscar/trabajador",dataParam,
	      function(data){
	         if(data.trabajadores.length == 0){
		    data.trabajadores.push({
		       trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
		    })
	         }
			 
	       var asd=  crearSelectOneMenuOblig("selAutoTrabajadorFormCovid","", data.trabajadores,"",
	        	                                 "trabajadorId","nombre");
	       $("#divSelTrabajadorFormCovid").html(asd);
	         $("#inputTrabNombreFormCovid").attr("onkeyup","verAcordeBuscarTrabajadorFormCovid()");
	      });
}
function verModalExcelTrabajadorCovid(){
    var selPeriodoInforme = crearSelectOneMenuOblig("selPeriodoInforme","",
	    [{id:1,nombre:"30 días"},{id:2,nombre:"60 días"},{id:10,nombre:"Todo el periodo"}],"10", "id","nombre");
    
   var list = [
      {sugerencia:"",label:"Tiempo del informe",inputForm:""+selPeriodoInforme,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
   ];
   
   var contenido = "";
    
   list.forEach(function(val){
      contenido +=obtenerSubPanelModuloVersionDos(val);
   });
   
    contenido+="<div class='divContainerButton'>";
    contenido+="<div class='divButtonDuo' ><button onclick='cancelarExcelTrabajadoresCovid()' class='btn btn-danger'><i class='fa fa-times'></i>Cancelar</button></div>";
    contenido+="<div class='divButtonDuo' ><button onclick='descargarInformeExcelTrabajadoresCovid()' class='btn btn-success'><i class='fa fa-file-excel-o'></i>Generar</button></div>";
    contenido+="</div>";
	
   var modalOptions = {
      id: "modalInformeExcel",
      nombre: "Descargar Excel trabajadores",dontRemoveBack:true,
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}
function cancelarExcelTrabajadoresCovid(){
    $("#modalInformeExcel").modal("hide");
}
function descargarInformeExcelTrabajadoresCovid(){
    
    window.open(URL+"/covid/formulario_covid/excel?empresaId="+getSession("gestopcompanyid")+"&tipoPeriodoId="+$("#selPeriodoInforme").val());
    $("#modalInformeExcel").modal("hide");
}

function ocultarOpcionGenerarExcelVistaMedCov(){
   $("#modalAplicarOpcionGenerarExcelVistaMedCov").modal("hide");
}

function elegirOpcionGenerarExcelVistaMedCov(){
   $("#modalAplicarOpcionGenerarExcelVistaMedCov").remove();
    
   var listOpcionesGenerarExcelVisMedCov=[
      {id:1,nombre:"Matriz resumen de Formularios COVID-19 - Trabajadores"},
      {id:2,nombre:"Consolidado Estado trabajadores según observación médica"}
   ];
  	                            
   var selOpcionConsolidadoExcelMedCov = crearSelectOneMenuOblig("selOpcionConsolidadoExcelMedCov","",
      listOpcionesGenerarExcelVisMedCov,"","id","nombre");
  	
   var contenido = "";
  	
   var listContenido=[
      {sugerencia:"",label:"Excel",
       inputForm:selOpcionConsolidadoExcelMedCov},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
       		     "onclick='ocultarOpcionGenerarExcelVistaMedCov()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button id='btnAplicarOpcionGenExcVisMedCov' class='btn btn-success' style='float:right;font-size:18px;' " +
  	            	 "type='submit' onclick='seleccionarOpcionGenerarExcelVistaMedCov()'>" +
  	            "<i class='fa fa-check-circle'></i> Aceptar" +
  	         "</button>"}
   ];
  				
    listContenido.forEach(function(val){
       contenido += obtenerSubPanelModuloVersionDos(val);
    });
      
    var modalOptions={
       id:"modalAplicarOpcionGenerarExcelVistaMedCov",
       nombre:"<i class='fa fa-list'></i> Opciones - Excel para generar",
       contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
  		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
  	
   $("#btnAplicarOpcionGenExcVisMedCov").on("click",function(){
      ocultarOpcionGenerarExcelVistaMedCov(); 
   });
     
   $("#modalAplicarOpcionGenerarExcelVistaMedCov").modal("show");
}

function seleccionarOpcionGenerarExcelVistaMedCov(){
   var opcion = parseInt($("#selOpcionConsolidadoExcelMedCov").val());
    
   if(opcion == 1){
      verModalExcelTrabajadorCovid();
   }else if(opcion == 2){
      filtrarPrevioObsMedicaEstadoTrabCovid();
   }
}

function ocultarFiltroPrevioObsMedicaEstadoTrabCovid(){
   $("#modalFiltroPreObsMedEstTrabCov").modal("hide");
}

function filtrarPrevioObsMedicaEstadoTrabCovid(){
   $("#modalFiltroPreObsMedEstTrabCov").remove();
     
   var contenido = "";
   				
   var listContenido=[
      {sugerencia:"",label:"Desde",
       inputForm:"<input type='date' class='form-control' id='fechaInicioPreObsMedEstTrabCov'>"},
      {sugerencia:"",label:"Hasta",
       inputForm:"<input type='date' class='form-control' id='fechaFinPreObsMedEstTrabCov'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarFiltroPrevioObsMedicaEstadoTrabCovid()'>" +
   	        "<i class='fa fa-times'></i> Cancelar" +
   	     "</button>",
       inputForm:"<button id='btnAplicarFiltroPreObsMedEstTrabCov' class='btn btn-success' type='submit' " +
   	   		 "onclick='generarConsolidadoEstadoTrabajadorObservacionMedica()' style='float:right;font-size:18px;'>" +
   	   	    "<i class='fa fa-file-excel-o'></i> Generar" +
   	   	 "</button>"}
   ];
   				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   				
   var modalOptionsCov={
       id: "modalFiltroPreObsMedEstTrabCov",
       nombre: "<i class='fa fa-file-excel-o'></i> Excel - Registros Consolidado Estado del " +
       	      "trabajador según observación médica",
       contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
   				
   crearModalPrincipalUsuario(modalOptionsCov,function(){},true,true);
   				
   $("#btnAplicarFiltroPreObsMedEstTrabCov").on("click",function(){
      ocultarFiltroPrevioObsMedicaEstadoTrabCovid();
   });
     
   var hoy = getSession("fechaHoyOrdenInversoTexto");
     
   $("#fechaInicioPreObsMedEstTrabCov").val(sumaFechaDias(-180,hoy));
   $("#fechaFinPreObsMedEstTrabCov").val(hoy);
   				
   $("#modalFiltroPreObsMedEstTrabCov").modal("show");
}

function generarConsolidadoEstadoTrabajadorObservacionMedica(){
   var campoVacio = true;
      
   var valFechaInicioCon = $("#fechaInicioPreObsMedEstTrabCov").val();
   var valFechaFinCon = $("#fechaFinPreObsMedEstTrabCov").val();
   var fechaInicioConText = convertirFechaNormal(valFechaInicioCon);
   var fechaFinConText = convertirFechaNormal(valFechaFinCon);
    
   if(valFechaInicioCon.length == 0 || valFechaFinCon.length == 0){
      campoVacio = false
   }
      
   if(campoVacio){
      window.open(URL+"/covid/excel/consolidado_estado_trabajador_observacion_medica?empresaId=" +
         getSession("gestopcompanyid")+"&fechaInicioConsolidado="+valFechaInicioCon +
         "&fechaFinConsolidado="+valFechaFinCon+"&fechaInicioConsolidadoNormal="+
  	 fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
   }else{
      mensajeUx="<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","RegresarInicioModCovid");
        
      $("#modalMensajeUxRegresarInicioModCovid").on("hidden.bs.modal",function(){
         $("#modalFiltroPreObsMedEstTrabCov").modal("show");
      });
   }
}