var hojaVidaTrabajadorId;
var hojaVidaTrabajadorObj=[];
var banderaEdicion69=false;
var listFullHojaVidaTrabajador;
var estadoHojaVida;
var tipoHojaTrabContratista;
 
var listTrabContratista;
var objHojaVidaTraCon={};
var indexHojaVidaTraCon;
var mensajeUx;

var listTrabajadoresAsigHojaVida = [],listTipoNotaHojaVida = [];
var listTipoNotaIdHojaVida = [];

function toggleMenuOpcionHojaVidaTraCon(obj,pindex){
   objHojaVidaTraCon = listFullHojaVidaTrabajador[pindex]; 
   indexHojaVidaTraCon = pindex;
   $(obj).parent().parent().parent(".eventoGeneral").find("ul").toggle();
   $(obj).parent().parent().parent(".eventoGeneral").siblings().find("ul").hide(); 	
}

var funcionalidadesHojaVidaTraCon=[ 
   {id:"opcEditar", nombre:"<i class='fa fa-pencil-square-o'></i> Editar ",
    functionClick:function(data){editarHojaVidaTra()}},
   {id:"opcElimnar", nombre:"<i class='fa fa-times'></i> Eliminar",
    functionClick:function(data){eliminarHojaVidaTra()}}
];

function marcarSubOpcionHojaVidaTraCon(pindex){
   funcionalidadesHojaVidaTraCon[pindex].functionClick();
   $(".subDetalleAccion ul").hide();
   $(".listaFinalGestionGosst").hide();
}

function ocultarFiltroHabilitarHojaVida(){
   $("#modalFiltroHabilitarHojaVida").modal("hide");
}

function verFiltroHabilitarHojaVida(){
   $("#modalFiltroHabilitarHojaVida").modal("show");
}

function crearFiltroHabilitarHojaVida(functionCallBack){
    // P-A00039: cada vez que se abre la seccion se borra la busqueda
    busquedaHojaVida = "";

    var dataParam={};
	  		
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/examenes/hoja_vida/filtro',dataParam,1,0,function(data){
		switch(data.CODE_RESPONSE){
		    case "05":
		        listTipoNotaHojaVida = data.nota;

      			var contenido = "";
  				
      			var listContenido=[
         			{label:"Estado de la evaluación",inputForm:"",idDivContainer:"divFiltroEstadosEvaluacionHojaVida"},
  	        		{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
  	        		{label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarFiltroHabilitarHojaVida()'>" +
               	       		   "<i class='fa fa-times'></i> Cancelar" +
               	   		   "</button>",
  	         		 inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' onclick='valoresFiltroHabilitarHojaVida()'>" +
  	                               "<i class='fa fa-filter'></i> Aplicar" +
  	                           "</button>"},
        		]; 
  				
      			listContenido.forEach(function(val){
            		contenido += obtenerSubPanelModuloVersionTres(val);
      			});
   
      			var modalOptions={
 	 				id:"modalFiltroHabilitarHojaVida",nombre:"<i class='fa fa-filter'></i> Filtros - Hoja(s) de vida",
  	 				contenido:"<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
      			};
  				
      			crearModalPrincipalUsuario(modalOptions,function(){
	 				if($("#filtroEstadosEvaluacionHojaVida").length > 0){
	    				return;
	 				}
	                   
	 				crearSelectOneMenuObligMultipleCompleto("filtroEstadosEvaluacionHojaVida","",listTipoNotaHojaVida,
	    				"id","nombre","#divFiltroEstadosEvaluacionHojaVida","Todos");
      			},true,true);
   
	    		functionCallBack();
				
				break;
				 	     
			default:
			    alert("Ocurrió un error al cargar la página. Por favor, actualice la misma.");$.unblockUI();
				 	     
				break;
		}
    });
}

function valoresFiltroHabilitarHojaVida(){
    ocultarFiltroHabilitarHojaVida(); 
    
    listTipoNotaIdHojaVida = [];
    
    var estadoEvaluacionId = $("#filtroEstadosEvaluacionHojaVida").val(); 
   
    if(estadoEvaluacionId != null){
        estadoEvaluacionId.forEach(function(val){
            listTipoNotaIdHojaVida.push(parseInt(val));
        });
    }
   
    habilitarHojaVida(1);
}

var paginaActualHojaVida = 1,totalPaginasHojaVida = 0,numTotalHojaVida = 0;

// P-A00039: buscador de Hoja de vida, con el mismo estilo del de la seccion Trabajadores: un panel «Buscar trabajador» con un campo de ancho completo. Busca en el servidor
// (la lista va de 100 en 100) por nombre, apellido o numero de documento, con palabras de 3 caracteres o mas, y espera un momento despues de la ultima tecla.
var busquedaHojaVida = "",temporizadorBusquedaHojaVida = null,enfocarBusquedaHojaVida = false;
var MIN_CARACTERES_BUSQUEDA_HOJA_VIDA = 3,ESPERA_BUSQUEDA_HOJA_VIDA = 300;

function textoBuscadorHojaVida(){
   return "<div class='eventoGeneral'>" +
             "<input type='text' id='inputBusquedaHojaVida' class='form-control' maxlength='100' autocomplete='off' " +
                    "placeholder='Buscar por nombre, apellido o documento (mínimo "+MIN_CARACTERES_BUSQUEDA_HOJA_VIDA+" caracteres)' " +
                    "aria-label='Buscar hojas de vida por nombre, apellido o documento del trabajador' oninput='buscarHojaVida()'>" +
             "<div id='avisoBusquedaHojaVida' style='margin-top:8px;font-size:13px;' aria-live='polite'></div>" +
          "</div>";
}

// Lo que escribio el usuario se pone como valor del campo (nunca como HTML) y, si estaba escribiendo, el cursor vuelve al final.
function restaurarBusquedaHojaVida(){
   var campo = $("#inputBusquedaHojaVida");

   if(campo.length == 0){
      return;
   }

   campo.val(busquedaHojaVida);

   if(enfocarBusquedaHojaVida){
      campo.focus();
      var largo = campo.val().length;
      campo[0].setSelectionRange(largo,largo);
      enfocarBusquedaHojaVida = false;
   }
}

function palabrasValidasBusquedaHojaVida(texto){
   return $.trim(texto).split(/\s+/).filter(function(palabra){
      return palabra.length >= MIN_CARACTERES_BUSQUEDA_HOJA_VIDA;
   });
}

function aplicarBusquedaHojaVida(){
   var texto = $.trim($("#inputBusquedaHojaVida").val());
   var aviso = $("#avisoBusquedaHojaVida");

   if(texto.length > 0 && palabrasValidasBusquedaHojaVida(texto).length == 0){
      aviso.text("Escribe al menos "+MIN_CARACTERES_BUSQUEDA_HOJA_VIDA+" caracteres.");
      return;
   }

   aviso.text("");

   if(texto == busquedaHojaVida){
      return;
   }

   busquedaHojaVida = texto;
   enfocarBusquedaHojaVida = true;
   habilitarHojaVida(1);
}

function buscarHojaVida(){
   clearTimeout(temporizadorBusquedaHojaVida);
   temporizadorBusquedaHojaVida = setTimeout(aplicarBusquedaHojaVida,ESPERA_BUSQUEDA_HOJA_VIDA);
}

function cambiarPaginaHojaVida(pagina){
    if(pagina < 1 || pagina > totalPaginasHojaVida){
        return;
    }

    habilitarHojaVida(pagina);
}

function actualizarBotonesPaginacionHojaVida(){
    $("#btnAnteriorHojaVida").toggle(totalPaginasHojaVida > 0 && paginaActualHojaVida > 1).prop("disabled",false);

    $("#btnSiguienteHojaVida").toggle(paginaActualHojaVida < totalPaginasHojaVida).prop("disabled",false);
}

function obtenerBotonesPaginacionHojaVida(){
    var textoPagina = (totalPaginasHojaVida == 0?"Sin registros":"Página "+paginaActualHojaVida+" de "+totalPaginasHojaVida);

    return "<span class='controlesPaginacionHojaVida' style='display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;'>" +
               "<button type='button' id='btnAnteriorHojaVida' class='btn btn-success' disabled style='padding:2px 8px' " +
                       "onclick='cambiarPaginaHojaVida("+(paginaActualHojaVida-1)+")' title='Página anterior' aria-label='Página anterior'>" +
                   "<i class='fa fa-chevron-left fa-4x' aria-hidden='true'></i>" +
               "</button>" +
               "<span style='font-size:14px;font-weight:bold;white-space:nowrap;margin:0 4px;' aria-live='polite'>"+textoPagina+"</span>" +
               "<button type='button' id='btnSiguienteHojaVida' class='btn btn-success' disabled style='padding:2px 8px' " +
                       "onclick='cambiarPaginaHojaVida("+(paginaActualHojaVida+1)+")' title='Página siguiente' aria-label='Página siguiente'>" +
                   "<i class='fa fa-chevron-right fa-4x' aria-hidden='true'></i>" +
               "</button>" +
           "</span>";
}

function habilitarHojaVida(pagina){
    objHojaVidaTraCon = {id: 0}; 

    var paginaSolicitada = (pagina == null ?1:pagina);
    
    var dataParam={
        contratista:{id:parseInt(getSession("contratistaGosstId"))},isSeccionHojaVida:1,paginaHojaVida:paginaSolicitada,
	    listEstadoId:listTipoNotaIdHojaVida,busquedaHojaVida:busquedaHojaVida
    };
    
    var listPanelesPrincipal = [];
 	
    callAjaxPostSimpleVersionDos(1,URL+'/contratista/examenes/hoja_vida/vista_contratista',dataParam,1,1,function(data){
        switch(data.CODE_RESPONSE){
            case "05":
                listFullHojaVidaTrabajador = data.list;listTrabContratista = data.listTrabContratista;
				paginaActualHojaVida = data.pagina;totalPaginasHojaVida = data.totalPaginas;numTotalHojaVida = data.numTotalHojaVida;
 	    
 	    		listTrabajadoresAsigHojaVida=[
 	       			{nombre:"Sin asignar",subtipos:[]},
 	       			{nombre:"Asignados (En evaluación)",subtipos:[]},
 	       			{nombre:"Asignados (Aprobados)",subtipos:[]}
 	    		];
 	    
 	    		listTrabContratista.forEach(function(val){
 	       			var indice = (val.notaHojaVida == 0?0:(val.notaHojaVida == 1?2:1));	
 		
 	       			listTrabajadoresAsigHojaVida[indice].subtipos.push(val);
 	    		});
 	    
 	    		$(".divListPrincipal").html("");
				
				var textFormHojaVida = "";
 			
 	    		var listItemsHojaVida=[
 	       			{label:"Trabajador*",inputForm:"",idDivContainer:"divSelTrabContHojaVida"},
					{label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
 	       			{label:"Evidencia",inputForm:"",idDivContainer:"eviHojaVidaTra"},
					{label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
 	       			{label:"Detalle",inputForm:"<input class='form-control' id='inputObsHojaVidaTra'>"},
 	       			{label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
               		{label:"",inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
        	    	                        "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
        	    	                    "</button>"} 
            	]; 
 			
 	    		textFormHojaVida += "<div class='eventoGeneral'>";	
				listItemsHojaVida.forEach(function(val){
 	          		textFormHojaVida += obtenerSubPanelModuloVersionTres(val);
 	       		});
 	    		textFormHojaVida += "</div>";	
 	    
 	    		var textTotal = "";
 			
            	listFullHojaVidaTrabajador.forEach(function(val,index){
               		var menuOpcion = "",btnOpcion = "";
        	
                	if(val.evaluacion.nota.id != 1){
 	          	    	menuOpcion = "<ul class='list-group listaFinalGestionGosst'>";
 	             		funcionalidadesHojaVidaTraCon.forEach(function(val1,index1){
 	                    	menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionHojaVidaTraCon("+index1+")'>"+val1.nombre+"</li>";
 	             		});
 	          			menuOpcion+="</ul>"; 
 		
 	          			btnOpcion = "<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionHojaVidaTraCon(this,"+index+")'>" +
 	                                	"<i class='fa fa-caret-down' aria-hidden='true'></i> Ver Opciones" +
 		     						"</a>";
               		}
               
 	       			var evidencia = (val.evidenciaNombre.length == 0?"------":
		  			    "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/amazon_s3/examen/hojavida/evidencia?id="+val.id+"'>" +
		      			     val.evidenciaNombre +
		  				"</a>");
 				
 	       			var listTotal=[
                  		{anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:btnOpcion+menuOpcion,
	                     label:"<span style='font-size:18px;font-weight:bolder;'>"+"*** DATOS DEL REGISTRO ***"+"</span>"},
	          			{label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
 		  				{label:"<i class='fa fa-user'></i> Trabajador(a)",inputForm:val.trabajador.nombreCompleto},
 		  				{label:"<i class='fa fa-list-ol'></i> Evidencia",inputForm: evidencia},
 		  				{label:"<i class='fa fa-file-text'></i> Detalle",inputForm:val.observacion},
 		  				{label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
 		  				{anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
 		   				 label:"<span style='font-size:18px;font-weight:bolder;'>"+"*** EVALUACIÓN ***"+"</span>"},
 		  				{label:"",inputForm:"",styleTotal:styleLineaPunteadaClasica},
 		  				{label:val.evaluacion.nota.icono+" Estado",inputForm:val.evaluacion.nota.nombre}
 	       			]; 
 	       
 	       			if(val.evaluacion.nota.id != 3 && val.evaluacion.nota.id != 4){
 		  				if(val.evaluacion.nota.id == 2){
 		     				listTotal.push({label:"<i class='fa fa-exclamation-circle'></i> Observación",inputForm:val.evaluacion.observacion});  
 		  				} 
 		  
 		  				var detalleEvaluacion = val.evaluacion.fechaTexto+(val.evaluacion.usuario.nombre.length == 0?"":"<br>(Por "+val.evaluacion.usuario.nombre+")");
 		  
 		  				listTotal.push({label:"<i class='fa fa-calendar'></i> Evaluado el",inputForm:detalleEvaluacion});  
 	       			}
					
					var estiloGosst = (val.evaluacion.nota.id == 1?"gosst-aprobado":(val.evaluacion.nota.id == 2?"gosst-desaprobado":"gosst-advertencia"));
 				
 	       			textTotal += "<div class='eventoGeneral "+estiloGosst+"'>" +
                                     "<div class='eventoGeneral'>";	   					
 		  			listTotal.forEach(function(val){
 	   	     			textTotal += obtenerSubPanelModuloVersionTres(val);
 	   	  			});	
 	       			textTotal +=    "</div>" +
	                    		 "</div>";
            	});
				
				var btnFiltro = "<button type='button' class='btn btn-success' style='padding:2px 8px;margin-right:10px' onclick='verFiltroHabilitarHojaVida()' title='Ver filtros' aria-label='Ver filtros'>" +
				        "<i class='fa fa-filter fa-4x' aria-hidden='true'></i>" +
					"</button>"
 			
 	    		listPanelesPrincipal.push(
 	                {id:"nuevoMovilHojaVida",clase:"",nombre:""+"Nuevo registro - Hoja de vida",contenido:"<form id='formNuevoHojaVidaTra' class='eventoGeneral'>"+textFormHojaVida+"</form>"},
					{id:"opcionesHojaVida",clase:"",nombre:"Opciones",buttonAd:btnFiltro,contenido:""},
					{id:"buscadorHojaVida",clase:"",nombre:"Buscar trabajador",contenido:textoBuscadorHojaVida()},
					{id:"totalHojaVida" ,clase:"",nombre:"<span class='tituloHojaVidaPaginados'>"+"Hojas de vida registradas ("+numTotalHojaVida+")</span>",
					 buttonAd:obtenerBotonesPaginacionHojaVida(),contenido:(listFullHojaVidaTrabajador.length == 0?"<div class='eventoGeneral'>Sin registros.</div>":textTotal)});
 			
 	    		agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);

				actualizarBotonesPaginacionHojaVida();
				restaurarBusquedaHojaVida();

				$("#opcionesHojaVida").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
				$("#opcionesHojaVida").children(".contenidoSubList").hide();

				$("#buscadorHojaVida").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
				$("#buscadorHojaVida").children(".contenidoSubList").show();

                $("#totalHojaVida").children(".tituloSubList").find("i.fa-caret-down").closest("button").hide();
                $("#totalHojaVida").children(".contenidoSubList").show();
				
				var cabecera = $("#totalHojaVida").children(".tituloSubList");
							 
				cabecera.css({display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"});
				cabecera.children(".tituloHojaVidaPaginados").css("order",0);
				cabecera.children(".controlesPaginacionHojaVida").css({order:1,marginLeft:"auto"});
 	    
 	    		crearSelectMultipleGrupoCompletoVersionDos("selTrabContHojaVida"+objHojaVidaTraCon.id,"",listTrabajadoresAsigHojaVida,
               		"id","nombreCompleto","#nuevoMovilHojaVida #divSelTrabContHojaVida","Solo uno...",1);
 	    
 	    		$("#nuevoMovilHojaVida #divSelTrabContHojaVida").append("<label style='font-size:12px;'>*Búsqueda por N° de documento y/o nombre.</label>");
 			
 	    		$(".listaFinalGestionGosst").hide();$(".contenidoFormVisible").hide();
 			 
 	    		$('#formNuevoHojaVidaTra').on('submit',function(e){  
 	       			e.preventDefault();objHojaVidaTraCon = {id: 0};guardarHojaVidaTra();
 	    		}); 
 	     
 	    		var options={
	       			container:"#eviHojaVidaTra",functionCall:function(){
	          			validacionSubirEvidencia("HojaVida",bitsEvidenciaExamen,"");
	       			},descargaUrl:"",esNuevo:true,idAux:"HojaVida",evidenciaNombre:""
	    		};
				
	    		crearFormEvidenciaCompleta(options);
 	     
	    		break;
 	     
         	default:
 	   	 		alert("Ocurrió un error al cargar la página. Por favor, actualice la misma.");
 	     
            	break;
    	}
   	});
}

function ocultarHojaVidaTra(){
   $("#modalEditarHojaVida").modal("hide");
}

function editarHojaVidaTra(){
   $("#modalEditarHojaVida").remove();
 	
   var listItemsHojaVida=[
      {sugerencia:"",label:"Trabajador*",inputForm:"",divContainer:"divSelTrabContHojaVida"},
      {sugerencia:"",label:"Evidencia",inputForm:"<div id='inputHojaVidaTraAux'></div>",divContainer:""},
      {sugerencia:"",label:"Detalle",inputForm:"<input class='form-control' id='inputObsHojaVidaTra'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
		     "onclick='ocultarHojaVidaTra()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
               	    "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
               	 "</button>"} 
   ];
    
   var textFormHojaVida = "";    
   
   listItemsHojaVida.forEach(function(val,index){
      textFormHojaVida += obtenerSubPanelModuloVersionDos(val);
   });	
   	
   var opciones={
      id: "modalEditarHojaVida",
      nombre: "Editar registro - Hoja Vida",
      contenido: "<form id='formEditarHojaVida' class='eventoGeneral'>"+textFormHojaVida+"</form>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){
      listTrabajadoresAsigHojaVida.forEach(function(val){
	 val.subtipos.forEach(function(val1){
	    val1.selected = (objHojaVidaTraCon.trabajador.id == val1.id?1:0);
	 }); 
      });

      crearSelectMultipleGrupoCompletoVersionDos("selTrabContHojaVida"+objHojaVidaTraCon.id,"",listTrabajadoresAsigHojaVida,
         "id","nombreCompleto","#formEditarHojaVida #divSelTrabContHojaVida","Solo uno...",1);
      
      $("#formEditarHojaVida #divSelTrabContHojaVida").append("<label style='font-size:12px;'>*Búsqueda por " +
         "número de documento y/o nombre.</label>");
   },true,true);
 	
   var editarDiv = $("#formEditarHojaVida");
 	
   editarDiv.find("#inputObsHojaVidaTra").val(objHojaVidaTraCon.observacion);
   
   var options={
      container:"#inputHojaVidaTraAux",functionCall:function(){
         validacionSubirEvidencia("HoViAux",bitsEvidenciaExamen,"modalEditarHojaVida");
      },
      descargaUrl: "/contratista/amazon_s3/examen/hojavida/evidencia?id="+objHojaVidaTraCon.id,
      esNuevo:(objHojaVidaTraCon.evidenciaNombre.length == 0?true:false),idAux:"HoViAux",
      evidenciaNombre:objHojaVidaTraCon.evidenciaNombre
   };
	
   crearFormEvidenciaCompleta(options); 
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      guardarHojaVidaTra();
   });
}

function eliminarHojaVidaTra(){ 
   mensajeUx = "<label>¿Está seguro de eliminar la hoja de vida?</label>";
   mensajesUx(mensajeUx,3,"","EliminarHojaVida");

   $("#btnDevolverValorEliminarHojaVida").on("click",function(){
      var dataParam={
	 id:objHojaVidaTraCon.id,trabajadorContratistaId:objHojaVidaTraCon.trabajador.id,bucketNombre:BUCKETAMAZONS3
      };
	         
      callAjaxPost(URL+'/contratista/trabajador/hojavida/delete',dataParam,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>La hoja de vida fue eliminada con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","ActualizarVistaHojaVidaTraCon");
			   
	       $("#modalMensajeUxActualizarVistaHojaVidaTraCon").on("hidden.bs.modal",function(){
		  habilitarHojaVida(1);
	       });
		
	       break;
					
	    default:
	       alert("Ocurrió un error al eliminar la programacion!");
	 }
      });
   });
}
 
function guardarHojaVidaTra(){
   var textDiv = (objHojaVidaTraCon.id == 0?"#nuevoMovilHojaVida":"#formEditarHojaVida");
   var formDiv = $(textDiv);
   var campoVacio = true; 
   
   var trabsId = formDiv.find("#selTrabContHojaVida"+objHojaVidaTraCon.id).val();
   var trabajadoresFinal = [],trabContratistaId = -1;
     
   trabsId.forEach(function(val,index){
      trabContratistaId = parseInt(val);
   }); 
  
   var observacion = formDiv.find("#inputObsHojaVidaTra").val(); 
   var nombreEvidencia = (objHojaVidaTraCon.id == 0?$("#inputEviHojaVida").val():
      $("#inputEviHoViAux").val());
   
   if(observacion.length == 0 || trabContratistaId == -1 || nombreEvidencia.length == 0){
      mensajeUx="<label>Debe ingresar la información respectiva en todos los campos.</label>";
      campoVacio = false; 
   }else if(nombreEvidencia == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }
   
   if(campoVacio){
      var dataParam={
	 id: objHojaVidaTraCon.id,tipo: {id: 4}, 
	 observacion: observacion,trabajador: {id: trabContratistaId}
      };

      callAjaxPostSimpleVersionDos(1,URL+'/contratista/trabajador/hojavida/save',dataParam,1,0,function(data){
          if(data.CODE_RESPONSE == "05"){
	      guardarEvidenciaAutoVersionS3(1,data.nuevoId,(objHojaVidaTraCon.id == 0?"fileEviHojaVida":"fileEviHoViAux"),bitsEvidenciaExamen,
	      0,1,"/contratista/amazon_s3/examen/hojavida/evidencia/save","hoja-vida-trabajador-contratista/evidencia",function(){
	          $("#modalEditarHojaVida").modal("hide");
		  
	          mensajeUx="<label>El registro hoja de vida fue guardado con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarVistaHojaVidaTraCon");
					   
	          $("#modalMensajeUxActualizarVistaHojaVidaTraCon").on("hidden.bs.modal",function(){
		      habilitarHojaVida(1);
		      $("#modalEditarHojaVida").remove();
	          });
	      }); 
          }else{
              console.log("Ocurrió un error al guardar la hoja vida!");
          }
      }); 
   }else{
      $("#modalEditarHojaVida").modal("hide");
      mensajesUx(mensajeUx,2,"","ActualizarHojaVida");
      
      $("#modalMensajeUxActualizarHojaVida").on("hidden.bs.modal",function(){
	 if(objHojaVidaTraCon.id > 0){ 
	    $("#modalEditarHojaVida").modal("show");
	 }
      }); 
   }
}
