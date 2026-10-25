
var statusContratistaObj = {},statusProyectoObj = {};
var mensajeUx;

function habilitarStatusContratista(){
   var dataParam={
      id:parseInt(getSession("contratistaGosstId")),estadoProyecto:2,cargarIndicadores:1
   };
    
   var listPanelesPrincipal = [];
  	
    callAjaxPost(URL+'/contratista/status_contratista',dataParam,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                listFullProyectoSeguridad = data.listProyectosAsig;
            	statusContratistaObj = data.contratista;
  	   
  	    		$(".divListPrincipal").html("");
  	     
  	    		var estadoDocumentosNivelEmpresaConObj = verificarIndicadorDocNivelEmpresaContratista(statusContratistaObj);
  	      
  	    		var estadoDocActual = (estadoDocumentosNivelEmpresaConObj.isHabilitado?iconoGosst.aprobado+" Completo":
  	                iconoGosst.advertir+" Incompleto <br>(documentos no vigentes y/o sin aprobar)");
  	    
  	    		var estiloGosst = (estadoDocumentosNivelEmpresaConObj.isHabilitado?"gosst-aprobado":"gosst-desaprobado");
  	      
  	    		var contenido = "";
  	    
  	    		var listContenido=[
  	        		{label:"<i class='fa fa-building-o' aria-hidden='true'></i> Contratista:",inputForm:statusContratistaObj.nombre},
  	        		{label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
  	        		{anchoLabel:"col-sm-5",anchoDiv:"col-sm-7",label:"<i class='fa fa-inbox' aria-hidden='true'></i> Estado documentos - Nivel empresa:",inputForm:"<label>"+estadoDocActual+"</label>"}
  	    		];
		
				var listContenidoDneAux = [];
							                     
				listContenidoDneAux = obtenerContratistaListaDocumentosNivelEmpresa(statusContratistaObj,estadoDocumentosNivelEmpresaConObj,"");
							            
				for(var i = 0;i < listContenidoDneAux.length;i++){
		    		listContenido.push(listContenidoDneAux[i]);
				}
  	      
  	    		contenido += "<div class='eventoGeneral "+estiloGosst+"'>" +
		            		     "<form class='eventoGeneral'>";	
  	    
  	    		listContenido.forEach(function(val){
  	       			contenido += obtenerSubPanelModuloVersionTres(val);
  	    		});
  	    
  	    		contenido +=     "</form>" +
		                     "</div>";
  	    	  				
     	    	listPanelesPrincipal.push({id:"infoMovilStatusProyectosAsigDocNivProy",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verIndicadoresTotalProyecto()",
            	     btnIconoAux:"fa-table",btnTitleAux:"Ver detalle asociado a los proyectos",nombre:"Indicadores de la contratista",contenido:""},
                    {id:"infoMovilStatusConsolidadosGenerales",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"verConsolidadosExcelGeneralStatusContratista()",
                     btnIconoAux:"fa-file-excel-o",btnSubIconoAux:"<i class='fa fa-list fa-2x' aria-hidden='true'></i>",
                     btnTitleAux:"Ver la lista de consolidados en formato excel",nombre:"Consolidados generales",contenido:""});
					  
			    if([643,644].includes(parseInt(getSession("gestopcompanyid")))){
					listPanelesPrincipal.push({id:"infoMovilStatusContratistaDocNivEmpresa",clase:"",styleAux:"",buttonAd:"",btnOnclickAux:"",
					     btnIconoAux:"",btnTitleAux:"",nombre:"Documentos a nivel empresa",contenido:contenido});
				}
			
	    		agregarPanelesDivPrincipalVersionTres(listPanelesPrincipal);
  			
     	   		$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
     	    
//     	        if(parseInt(getSession("gestopcompanyid")) == 154){
//     	            crearMensajeInformativoContratista();
//     	        }
     	        
     	    	break;
  	     
         	default:
  	    		alert("nop");
  	    		break;
      	}
   	});
}

var listOpcConsolidadoGeneralStatusContratista=[
    {id:2,nombre:"Informe general de la Contratista"},{id:1,nombre:"Documentos próximos a vencerse por nivel"}
];

function ocultarConsolidadosExcelGeneralStatusContratista(){
   $("#modalConsolidadosExcelStatusCont").modal("hide");
}

function verConsolidadosExcelGeneralStatusContratista(){
   $("#modalConsolidadosExcelStatusCont").remove();

   var selOpcConExcelStatusContratista = crearSelectOneMenuOblig("selOpcConExcelStatusContratista",
      "verAcordeConsolidadosExcelGeneralStatusContratista()",listOpcConsolidadoGeneralStatusContratista,"2","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelStatusContratista,divContainer:"divSelConExcelStatusContratista"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelGeneralStatusContratista()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelGeneralStatusContratista()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalConsolidadosExcelStatusCont",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelGeneralStatusContratista();
}

function verAcordeConsolidadosExcelGeneralStatusContratista(){
   $(".atributo-consolidadoExcelStatusCont").remove(); 
   var listContenidoDivSelConExcelStatusCont = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelStatusContratista").val());
   
   var contenido = "";
   
   listContenidoDivSelConExcelStatusCont.forEach(function(val){
      val.clase = "atributo-consolidadoExcelStatusCont";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelConExcelStatusContratista").parent().after(contenido);
}

// El informe se arma en el momento y en contratistas grandes tarda cerca de 30 s (P-A00016). La descarga se hace desde esta misma pagina
// (fetch) mientras una pestana nueva muestra el aviso "Generando el informe...". Cuando el archivo llega, se descarga desde esta pagina, el aviso
// cambia a "Listo" y la pestana se cierra sola; si falla, el aviso lo dice y la pestana queda abierta. Si el navegador bloquea la ventana nueva o
// no tiene fetch, se abre la URL directo, como antes.
function abrirDescargaConsolidadoStatusContratista(urlDescarga){
   var ventana = (window.fetch?window.open("","_blank"):null);

   if(!ventana){
      window.open(urlDescarga);

      return;
   }

   ventana.document.write("<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'><title>Generando el informe...</title>" +
      "<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;color:#333;margin:0;display:flex;align-items:center;" +
      "justify-content:center;min-height:100vh;text-align:center}.caja{background:#fff;padding:40px 48px;border-radius:8px;" +
      "box-shadow:0 2px 10px rgba(0,0,0,.12);max-width:480px}.rueda{width:48px;height:48px;margin:0 auto 20px;border:5px solid #d6dde3;" +
      "border-top-color:#008b8b;border-radius:50%;animation:giro 1s linear infinite}@keyframes giro{to{transform:rotate(360deg)}}" +
      ".listo{font-size:48px;color:#2e9e4f;margin-bottom:12px}.error{font-size:48px;color:#c0392b;margin-bottom:12px}" +
      "h2{margin:0 0 12px}p{margin:6px 0;line-height:1.4}</style></head><body><div class='caja'><div id='icono' class='rueda'></div>" +
      "<h2 id='titulo'>Generando el informe...</h2>" +
      "<p id='detalle'>Puede tardar cerca de un minuto en contratistas con muchos trabajadores. La descarga empezar&aacute; sola.</p></div></body></html>");
   ventana.document.close();

   function actualizarAviso(claseIcono,simbolo,titulo,detalle){
      if(ventana.closed){return;}

      var icono = ventana.document.getElementById("icono");
      icono.className = claseIcono;icono.textContent = simbolo;
      ventana.document.getElementById("titulo").textContent = titulo;
      ventana.document.getElementById("detalle").textContent = detalle;
      ventana.document.title = titulo;
   }

   // "URL" esta redefinida por constantes.js (direccion del servidor): la API nativa (createObjectURL) se toma de un marco oculto, que tiene la suya
   var marcoNativo = document.createElement("iframe");
   marcoNativo.style.display = "none";document.body.appendChild(marcoNativo);
   var urlNativa = marcoNativo.contentWindow.URL;

   function quitarMarco(){if(marcoNativo.parentNode){marcoNativo.parentNode.removeChild(marcoNativo);}}

   fetch(urlDescarga,{credentials:"include"}).then(function(respuesta){
      if(!respuesta.ok){
         throw new Error("codigo "+respuesta.status);
      }

      var disposicion = respuesta.headers.get("Content-Disposition") || "";
      var coincidencia = /filename\*?=\s*"?([^";]+)"?/i.exec(disposicion);
      var nombreArchivo = (coincidencia?coincidencia[1].trim():"informe.xlsx");

      return respuesta.blob().then(function(archivo){
         var enlaceTemporal = urlNativa.createObjectURL(archivo);
         var enlace = document.createElement("a");
         enlace.href = enlaceTemporal;enlace.download = nombreArchivo;enlace.style.display = "none";
         document.body.appendChild(enlace);enlace.click();document.body.removeChild(enlace);

         setTimeout(function(){urlNativa.revokeObjectURL(enlaceTemporal);quitarMarco();},60000);

         actualizarAviso("listo","✔","Listo","El informe se descargó. Esta pestaña se cerrará sola.");
         setTimeout(function(){if(!ventana.closed){ventana.close();}},2500);
      });
   }).catch(function(error){
      quitarMarco();
      actualizarAviso("error","!","No se pudo generar el informe","Inténtalo de nuevo. Si vuelve a pasar, avisa al soporte de la plataforma ("+error.message+"). Puedes cerrar esta pestaña.");
   });
}

function descargarConsolidadosExcelGeneralStatusContratista(){
   var campoVacio = true;
   
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelStatusContratista").val());
    
   if(campoVacio){
      if([1,2].includes(opcConsolidadoExcel)){
         abrirDescargaConsolidadoStatusContratista(URL+"/contratista/informe/general?opcionSelectLista="+opcConsolidadoExcel);
      }
   }else{
      $("#modalConsolidadosExcelStatusCont").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionConsolidadoExcel");
      
      $("#modalMensajeUxValidacionConsolidadoExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelStatusCont").modal("show");
      });
   }
}

function ocultarMensajeInformativoContratista(){
    $("#modalMensajeInfoCont").modal("hide");
}

function crearMensajeInformativoContratista(){
    $("#modalMensajeInfoCont").remove();

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",label:"PRUEBA MENSAJE"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
        {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",inputForm:"",label:"ENLACE",inputForm:"www."},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' onclick='ocultarMensajeInformativoContratista()'>" +
                       "<i class='fa fa-check-circle'></i> Aceptar" +
                   "</button>"}
    ];

    listContenido.forEach(function (val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalMensajeInfoCont",nombre:"<i class='fa fa-bell'></i> Notificación",btnCerrarHabilitado:0,
        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

