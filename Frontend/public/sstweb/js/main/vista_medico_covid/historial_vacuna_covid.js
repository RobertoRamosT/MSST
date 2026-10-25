var listHistorialVacCovTrab=[];

function habilitarSeccionHistorialVacunaMedicoCovid(){
   var listPanelesPrincipalResumen=[
      {id:"subConsolidadoHistorialVacuna",clase:"divProyectoGeneral",
       nombre:"consolidado historial vacuna",contenido:""},
      {id:"subConsolidadoEvaluacionCarneVacunacion",clase:"divProyectoGeneral",
       nombre:"consolidado carné vacunación",contenido:""},
      {id:"subGraficoNumDosisNumTrabajadoresVacunacion",clase:"divProyectoGeneral",
       nombre:"gráfico dosis vacunación - número trabajadores",contenido:""},
      {id:"subParametroTrabajadorVacCov",clase:"divProyectoGeneral",
       nombre:"<i class='fa fa-search'></i> Buscar trabajador",contenido:""},
      {id:"subResultadoTrabajadorVacCov",clase:"divProyectoGeneral",
       nombre:"Resultado de búsqueda",contenido:""}
   ];
   
   agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);

   var listContenidoGeneralColab=[
      {sugerencia:"",label:"<i class='fa fa-search'></i> Buscar Trabajador",
       inputForm:"<input class='form-control' id='inputTrabNombreVacunaCovid'>",divContainer:""},
      {sugerencia:"",label:"Trabajador asignado",
       inputForm:"",divContainer:"divSelTrabajadorVacunaCovid"},
      {sugerencia:"",label:"",
       inputForm:"<button class='btn btn-success'>" +
   	            "<i class='fa fa-search'></i> Buscar" +
   	       	 "</button>",
       divContainer:"divSelTrabajadorVacunaCovid",lineaFull:true},
   ];
   
   var contenido="<form class='eventoGeneral'>";

      listContenidoGeneralColab.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
	   
   contenido+="</form>";

   $("#subParametroTrabajadorVacCov")
   .find(".contenidoSubList").html(contenido).show();
   
   $("#subParametroTrabajadorVacCov").find(".contenidoSubList form").on("submit",function(e){
      e.preventDefault();
      verHistorialVacunaCovidTrabajador();
   });
   
   var btnConsolidadoHistorialCov = 
      "<button onclick='verTablaConsolidadoHistorialVacunaCovid()' class='btn btn-success' " +
              "title='Ver Consolidado Historial de vacunas COVID-19'>" +
         "<i class='fa fa-4x fa-arrow-right'></i>" +
      "</button>";

   $("#subConsolidadoHistorialVacuna .tituloSubList")
   .html("<i aria-hidden='true' class='fa fa-table'></i> " +
         "Ver Consolidado - Historial de vacunas COVID-19 "+btnConsolidadoHistorialCov);
   
   var btnConsolidadoEvalCarVac = 
      "<button onclick='verTablaConsolidadoEvaluacionVacunacionCovid()' class='btn btn-success' " +
               "title='Realizar evaluación - Carné vacunación COVID-19'>" +
         "<i class='fa fa-4x fa-arrow-right'></i>" +
      "</button>";

   $("#subConsolidadoEvaluacionCarneVacunacion .tituloSubList")
   .html("<i aria-hidden='true' class='fa fa-pencil-square-o'></i> " +
         "Evaluación - Carné vacunación COVID-19 "+btnConsolidadoEvalCarVac);
    
   var btnConsolidadoEvalCarVac = 
      "<button onclick='verGraficoDosisTrabajadoresVacunacion()' class='btn btn-success' " +
	      "title='Ver gráfico Dosis COVID-19 - Número de trabajadores'>" +
         "<i class='fa fa-4x fa-eye'></i>" +
      "</button>";

   $("#subGraficoNumDosisNumTrabajadoresVacunacion .tituloSubList")
   .html("<i aria-hidden='true' class='fa fa-bar-chart'></i> " +
	 "Gráfico Dosis COVID-19 - Número de trabajadores "+btnConsolidadoEvalCarVac); 
   
   verAcordeBuscarTrabajadorVacunaCovid();
}

function verHistorialVacunaCovidTrabajador(){
   var dataParam={
      trabajadorId : parseInt($("#selAutoTrabajadorVacunaCovid").val())
   };
   
   callAjaxPost(URL+"/covid/vacuna",dataParam,function(data){
      listHistorialVacCovTrab = data.listVacunaCovid;
      var textTotal="";
	  
      listHistorialVacCovTrab.forEach(function(val,index){
         var menuOpcion = "",btnOpcion = "";
		  
         var listTotal=[
	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
             label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
		      "Fecha de registro: "+val.fechaRegistroTexto+
		   "</span>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-eyedropper'></i> Tipo de vacuna",
	     inputForm:val.tipoVacunaCovid.nombre},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
             label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Primera dosis</span>"},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
	     label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
	     inputForm:val.fechaPrimeraDosisTexto},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	    {sugerencia:"",anchoLabel:"",anchoDiv:"",
             label:"<i class='fa fa-pencil'></i> Observación",
             inputForm:val.observacionPrimeraDosis}
	 ]; 
		 	       
         if(val.fechaSegundaDosisTexto != ''){
	    listTotal.push(
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
		label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Segunda dosis</span>"},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
		label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
		inputForm:val.fechaSegundaDosisTexto},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
		label:"<i class='fa fa-pencil'></i> Observación",
		inputForm:val.observacionSegundaDosis});  
         }
		 
         if(val.fechaTerceraDosisTexto != ''){
	    listTotal.push(
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	        label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Tercera dosis</span>"},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
	        label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
	        inputForm:val.fechaTerceraDosisTexto},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
	        label:"<i class='fa fa-pencil'></i> Observación",
	        inputForm:val.observacionTerceraDosis});  
         }
         
         if(val.fechaCuartaDosisTexto != ''){
 	    listTotal.push(
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
 	        label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>Cuarta dosis</span>"},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	        label:"<i class='fa fa-calendar'></i> Fecha de aplicación",
 	        inputForm:val.fechaCuartaDosisTexto},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
 	       {sugerencia:"",anchoLabel:"",anchoDiv:"",
 	        label:"<i class='fa fa-pencil'></i> Observación",
 	        inputForm:val.observacionCuartaDosis});  
         }
		 	       
         textTotal+="<div class='eventoGeneral'>";	   			   
	    listTotal.forEach(function(val,index){
	       textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	    });
	 textTotal+="</div>";
      });
	  
      if(listHistorialVacCovTrab.length == 0){
         var listTotal=[
	    {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",inputForm:"",
	     label:"No tiene vacuna(s) registrada(s)."}
	 ];
		 
         textTotal+="<div class='eventoGeneral'>";	   	  
	    listTotal.forEach(function(val,index){
	       textTotal+=""+obtenerSubPanelModuloVersionDos(val);
	    });
	 textTotal+="</div>";
      }
	  	
      $("#subResultadoTrabajadorVacCov").find(".contenidoSubList").html(textTotal).show();	
      $(".listaFinalGestionGosst").hide();
      $(".contenidoFormVisible").hide();	
   });
}

function verAcordeBuscarTrabajadorVacunaCovid(){
   var nombre = $("#inputTrabNombreVacunaCovid").val().trim();
		
   if(nombre == ""){
      nombre = null;
   }
	    
   var dataParam={
		  trabajadorNombre: "%"+nombre+"%",
		  empresaId: getSession("gestopcompanyid")
		         }
		
   callAjaxPostNoLoad(URL+"/covid/buscar/trabajador/simple",dataParam,function(data){
      if(data.trabajadores.length == 0){
		 data.trabajadores.push({
		    trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
		                        })
      }
			 
      var asd = crearSelectOneMenuOblig("selAutoTrabajadorVacunaCovid","",
    		       data.trabajadores,"","trabajadorId","nombre");
	   
      $("#divSelTrabajadorVacunaCovid").html(asd);
      $("#inputTrabNombreVacunaCovid").attr("onkeyup","verAcordeBuscarTrabajadorVacunaCovid()");
   });
}

function verGraficoDosisTrabajadoresVacunacion(){
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
 
   callAjaxPost(URL+"/covid/vacuna/valores_grafico",dataParam,function(data){
      $("#modalGraficoVacunacionTrab").remove();
      
      var soloUnaDosis = data.company.numTrabajadoresConSoloUnaDosis;
      var soloDosDosis = data.company.numTrabajadoresConSoloDosDosis;
      var soloTresDosis = data.company.numTrabajadoresConSoloTresDosis;
      var noVacunados = data.company.numTrabajadoresActivos - (soloUnaDosis+soloDosDosis+soloTresDosis);
       
      var modalOptions={
         id: "modalGraficoVacunacionTrab",
         maxWidth: "900px",
         nombre: "Gráfico Dosis COVID-19 - Número de trabajadores ["+data.company.name+"]",
         dontRemoveBack: true,
 	 contenido: "<div id='divGraficoVacunacionTrab'></div>"
      };
    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
 	
      Highcharts.chart('divGraficoVacunacionTrab',{
         chart: {
 	    type: 'column'},
 	 title: {
 	    text: "Gráfico Dosis COVID-19 - Número de trabajadores"},
 	 xAxis: {
 	    categories: ["1ra dosis","2da dosis","3ra dosis","No vacunados"]},
 	 yAxis: {
 	    title: {
 	       text: "Número de trabajadores"}},
 	 plotOptions: {
 	    column: {
 	       dataLabels: {
 	          enabled: true},
 	       enableMouseTracking: false}},
 	 series: [{
 	    name: "Número de trabajadores",
 	    data: [soloUnaDosis,soloDosDosis,soloTresDosis,noVacunados]}]
      });
   });
}
