/**
 * 
 */
var listFullTrabajadoresContratista=[];
var listTipoDocumento=[];
var listTipoSangre=[];
var listSubTipoHojaVida=[];
var objTrabajadorContratista={id:0};
var indexTrabContratista;
var listActividadesCriticasTrabajador;
var listProyectosAsignar;
var contratistaPerfil,configTarDocNivelesObsEmpresa,textoNombreDocNivelesModObsEmp;
var listTrabAltoRiesgoCht = [];
var mensajeUx;
//
function toggleMenuOpcionTrabGeneral(obj){
   $(obj).parent(".tituloSubList").find("ul").toggle();
}

var funcionalidadesTrabajadorGeneral=[ 
   {id:"opcGen1",nombre:"<i class='fa fa-plus-square'></i> Registrar nuevo trabajador",
    functionClick:function(data){verRegistroInfoTrabajadorContratista(0);}},
   {id:"opcGen3",nombre:"<i class='fa fa-download'></i> Descargar formato de hoja de vida", 
    functionClick:function(data){verAyudaImportHojaVidaTrabajadoresContratista();}}
];

// P118: la contratista registra la entrega del aviso de la revisión con IA (aviso_ia_contratista.js). Solo su sesión (acceso 2).
if(getSession("accesoUsuarios") == "2"){
   funcionalidadesTrabajadorGeneral.push({id:"opcGenAvisoIa",nombre:"<i class='fa fa-info-circle'></i> Aviso de la revisión con IA",
      functionClick:function(data){verAvisoIaContratista();}});
}

function marcarSubOpcionTrabajadorGeneral(pindex){
   $(".contenidoSubList").hide();
   funcionalidadesTrabajadorGeneral[pindex].functionClick();
   $(".listaGestionGosst").hide();
}
//
function toggleMenuOpcionTrab(obj,pindex){
    objTrabajadorContratista = listFullTrabajadoresContratista[pindex];indexTrabContratista = pindex;
   
    if(!$(obj).parent(".eventoGeneral").find("ul").is(":visible")){
        $(".listaGestionGosst").hide();
    }
   
    $(obj).parent(".eventoGeneral").find("ul").toggle();
}

var funcionalidadesTrabajador=[ 
   {id:"opcProyectosAsig",nombre:"<i class='fa fa-book'></i> Proyectos asociados al trabajador",
    functionClick:function(data){},isTitulo:true},
   {id:"opcVerProyectosAsig",nombre:"<i class='fa fa-eye'></i> Ver proyectos",
    functionClick:function(data){verTablaProyectosAsignadosTrabContratista()}},
   {id:"asdf",nombre:"<i class='fa fa-user'></i> Datos del trabajador",
    functionClick:function(data){},isTitulo:true},
   {id:"opcEditar",nombre:"<i class='fa fa-edit'></i> Editar registro",
    functionClick:function(data){verRegistroInfoTrabajadorContratista(1)}},
   {id:"opcFotocheck",nombre:"<i class='fa fa-id-card-o'></i> Descargar fotocheck", 
    functionClick:function(data){validacionPreviaGenerarFotocheckCodigoQrTrabajadorContratista()}},
   {id:"asdf",nombre:"<i class='fa fa-eye'></i> DC",
    functionClick:function(data){},isTitulo:true},
   {id:"opcHistorialSanciones",nombre:"<i class='fa fa-list-alt'></i> Historial sanciones",
    functionClick:function(data){verBlacklistTrabajadorContratista()}},
   {id:"opcHistorialExamen",nombre:"<i class='fa fa-list-alt'></i> Historial Médico",
    functionClick:function(data){verHistorialExamenTrabajadorContratista(1)}},
   {id:"opcHistorialSctr",nombre:"<i class='fa fa-list-alt'></i> Historial SCTR",
    functionClick:function(data){verHistorialExamenTrabajadorContratista(2)}},
   {id:"opcHistorialInducciones",nombre:"<i class='fa fa-list-alt'></i> Historial Inducciones",
    functionClick:function(data){verHistorialExamenTrabajadorContratista(3)}}
];

function marcarSubOpcionTrabajador(pindex){ 
   funcionalidadesTrabajador[pindex].functionClick();
   $(".listaGestionGosst").hide();
}

function verLeyendaTrabajador(){
	$("#leyendaMovilTrabProy").show();
	$("#leyendaMovilTrabProy").find(".contenidoSubList").show() 
}
function ocultarLeyendaTrabajador(){
	$("#leyendaMovilTrabProy").hide();
	$("#leyendaMovilTrabProy").find(".contenidoSubList").hide() 
}

function verHistorialExamenTrabajadorContratista(examTipoId){
   var contratistaId = parseInt(getSession("contratistaGosstId"));
   
   var dataParam={ 
      id: (contratistaId),
      examen: {tipo: {id: examTipoId}},
      perfil: {id: null}
   };
	
   callAjaxPost(URL+'/contratista/examenes',dataParam,function(data){
      $(".divMovilHistorialTrabajador").html("");
      $(".divMovilHistorialTrabajador").hide();
      $("#divHistorialTrab"+objTrabajadorContratista.id).show();
		
      data.examenes.forEach(function(val,index){ 
         var trabajadorAuxId = objTrabajadorContratista.id;
			
         if(val.trabajadoresId.indexOf(trabajadorAuxId)!=-1){
	    var textIn = 
	       "<div class='detalleAccion'>" +
	          "<i aria-hidden='true' class='fa fa-file'></i> "+val.evidenciaNombre+"<br>"+
		  "<i aria-hidden='true' class='fa fa-hourglass-start'></i> Inicio: "+val.fechaTexto+"<br>"+
		  "<i aria-hidden='true' class='fa fa-hourglass-end'></i> Vence: "+val.fechaFinVigenciaTexto +
	       "</div>" +
	       "<div class='opcionesAccion'>" +
	          "<a target='_blank' href='"+urlArchivo(val.evidenciaUrl)+"'>" +
	             "Descargar" +
	          "</a>" +
	       "</div>";
				
	    $("#divHistorialTrab"+objTrabajadorContratista.id).append(textIn);
         }
      });
   });
}

var mapCamposRegTrabContratista,mapDniTrabContratista;

// P-A00035 (issue 796): el servidor envia cada trabajador sin los campos en null (la lista pesaba 93,9 MB con 2 245 trabajadores en staging).
// Al recibirla se devuelven como null los campos que estas pantallas leen, para que todo se comporte exactamente como antes. Importa sobre todo
// en el formulario de edicion: $(...).val(undefined) no borra el campo (jQuery lo toma como una lectura) y mostraria el telefono, el correo o
// el lugar del trabajador que se abrio antes. Son los campos que la consulta trae sin IFNULL; los demas llegan siempre con valor.
var CAMPOS_TRABAJADOR_CONTRATISTA_NULABLES = ["codigoInterno","fechaNacimiento","lugarNacio","lugarResidencia","telefono","correo","nroSeguro",
   "nroCip","nroDocumento","contactoNombre","contactoTelefono"];
var CAMPOS_ANIDADOS_TRABAJADOR_CONTRATISTA = {tipoDocumento:["id","nombre"],tipoSangre:["id","nombre"],contratista:["nombre"]};

function restaurarCamposVaciosTrabajadoresContratista(lista){
   (lista || []).forEach(function(trab){
      CAMPOS_TRABAJADOR_CONTRATISTA_NULABLES.forEach(function(campo){
         if(trab[campo] === undefined){
            trab[campo] = null;
         }
      });

      Object.keys(CAMPOS_ANIDADOS_TRABAJADOR_CONTRATISTA).forEach(function(objeto){
         if(trab[objeto] === undefined){
            trab[objeto] = null;
         }else if(trab[objeto] !== null){
            CAMPOS_ANIDADOS_TRABAJADOR_CONTRATISTA[objeto].forEach(function(campo){
               if(trab[objeto][campo] === undefined){
                  trab[objeto][campo] = null;
               }
            });
         }
      });
   });
}

function habilitarTrabajadoresContratista(){
    var dataParam={
        id:parseInt(getSession("contratistaGosstId")),empresaId:parseInt(getSession("gestopcompanyid")),listEstadoId:[1,2],
        perfil:{id:parseInt(getSession("perfilContratistaGosstId"))},
    };
   
   callAjaxPost(URL+'/contratista/trabajadores',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var numTrabProyActivo = 0,numTrabProyInactivo = 0;

	    listFullTrabajadoresContratista = data.trabajadores;
	    restaurarCamposVaciosTrabajadoresContratista(listFullTrabajadoresContratista);
	    listTipoDocumento = data.tipoDocumento;
	    listTipoSangre = data.tipoSangre;
	    listSubTipoHojaVida = data.subTipoHoja;
	    listProyectosAsignar = data.proyectos;
	    contratistaPerfil = data.contratistaPerfil;listTrabAltoRiesgoCht = data.listTrabAltoRiesgoCht;
		configTarDocNivelesObsEmpresa = data.configTarDocNivelesObsEmpresa;
		
		if(configTarDocNivelesObsEmpresa.snActivarObsDocVigTar == 1){
			textoNombreDocNivelesModObsEmp = configTarDocNivelesObsEmpresa.textoNombreTarDocNivelTcObservadorHabilitados;
			textoNombreDocNivelesModObsEmp += (configTarDocNivelesObsEmpresa.textoTarHvObservadorHabilitados.length == 0?"":
				(textoNombreDocNivelesModObsEmp.length == 0?"":", ")+"Hoja de vida");
		}

	    var textSeccionesHabilitadas = contratistaPerfil.seccionesHabilitadasId;
	    proyectoObj.examenesPermitidosId = contratistaPerfil.seccionesInhabilitadasId;
	    
	    mapCamposRegTrabContratista = new Map();mapDniTrabContratista = new Map();
	    
	    if(contratistaPerfil.camTrabHabilitadosId.length != 0){
	       var camposTrabContHabId = contratistaPerfil.camTrabHabilitadosId.split(",");
		
	       camposTrabContHabId.forEach(function(val){
		  mapCamposRegTrabContratista.set(parseInt(val),1);   
	       });
	    }
			
	    $(".divListPrincipal").html("");
			
	    // P-A00035 parte B (issue 796): la lista completa sigue en memoria (otras pantallas leen listFullTrabajadoresContratista[indice]), pero cada
	    // seccion pinta solo 50 tarjetas por pagina y hay un buscador. Aqui solo se reparte cada indice entre activos e inactivos.
	    indicesTrabajadoresContratista = {activo:[],inactivo:[]};
	    paginaTrabajadoresContratista = {activo:1,inactivo:1};
	    textoBusquedaTrabajadoresContratista = "";
	    textosBusquedaTrabajadoresContratista = [];
	    
	    listFullTrabajadoresContratista.forEach(function(val,index){
	       mapDniTrabContratista.set(val.nroDocumento,1);
	       textosBusquedaTrabajadoresContratista[index] = prepararTextoBusquedaTrabajadorContratista(val);
	       
	       if(val.numProyectosHabilitados > 0){
		  indicesTrabajadoresContratista.activo.push(index);
	       }else{
		  indicesTrabajadoresContratista.inactivo.push(index);
	       }
	    });
	    
	    numTrabProyActivo = indicesTrabajadoresContratista.activo.length;
	    numTrabProyInactivo = indicesTrabajadoresContratista.inactivo.length;
			
	    var listPanelesPrincipal=[
               {id:"ExportTrabajadoresProyecto",clase:"",nombre:"",contenido:""},
	       {id:"ImportTrabajadoresContratista",clase:"",nombre:"",contenido:""},
	       {id:"nuevoMovilTrabProy",clase:"",nombre:"",contenido:""},
	       {id:"leyendaMovilTrabProy",clase:"contenidoFormVisible",
		nombre:""+"Leyenda de documentos de trabajadores",
		contenido:""+
		   "<div class='eventoGeneral'>" +
		      ""+iconoGosst.desaprobado+": Sin documento vigente <br>" +
		      ""+iconoGosst.por_realizar+": Documento vigente (por evaluar / por reevaluar) <br>" +
		      ""+iconoGosst.advertir+": Documento vigente (desaprobado) <br>" +
		      ""+iconoGosst.aprobado+": Documento vigente (aprobado) <br>" +
	           "</div>"},
	       {id:"buscadorTrabajadoresContratista",clase:"",nombre:"",contenido:""},
	       {id:"trabContratistaProyActivo",clase:"",
	        nombre:"Trabajadores - Activo en los proyectos (<span id='numTrabProyActivoTitulo'>" +numTrabProyActivo+"</span>)&nbsp " +
		   "<i onclick='ocultarLeyendaTrabajador()' onmouseenter='verLeyendaTrabajador()' class='fa fa-info-circle'></i>",
		contenido:""},
	       {id:"trabContratistaProyInactivo",clase:"",styleAux:"display:none",
	        nombre:"Trabajadores - Inactivo en los proyectos (<span id='numTrabProyInactivoTitulo'>" +numTrabProyInactivo+"</span>)&nbsp " +
		          "<i onclick='ocultarLeyendaTrabajador()' onmouseenter='verLeyendaTrabajador()' class='fa fa-info-circle'></i>",
		contenido:""}
            ];

	    agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);

	    $("#leyendaMovilTrabProy").find(".tituloSubList").hide();

	    $("#buscadorTrabajadoresContratista").find(".tituloSubList").html("Buscar trabajador");
	    $("#buscadorTrabajadoresContratista").find(".contenidoSubList").html(
	       "<div class='eventoGeneral'>" +
	          "<input type='text' id='inputBuscarTrabajadorContratista' class='form-control' maxlength='100' autocomplete='off' " +
	                 "placeholder='Buscar por nombre, apellido o documento (mínimo "+MIN_CARACTERES_BUSQUEDA_TRABAJADORES_CONTRATISTA+" caracteres)' " +
	                 "aria-label='Buscar trabajador por nombre, apellido o documento' oninput='buscarTrabajadoresContratista()'>" +
	          "<div id='resumenBusquedaTrabajadoresContratista' style='margin-top:8px;' aria-live='polite'></div>" +
	       "</div>");

	    pintarSeccionTrabajadoresContratista("activo");
	    pintarSeccionTrabajadoresContratista("inactivo");
			
	    var menuOpcion = "<ul class='list-group listaGestionGosst'>";
			
	       funcionalidadesTrabajadorGeneral.forEach(function(val1,index1){
	          menuOpcion += "<li class='list-group-item' onclick='marcarSubOpcionTrabajadorGeneral("+index1+")'>"+val1.nombre+"</li>";
	       });
	       
	    menuOpcion += "</ul>";
			
	    $("#nuevoMovilTrabProy").find(".tituloSubList").html("Agregar trabajador " +
               "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionTrabGeneral(this)'> Ver Opciones &nbsp;" +
	          "<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
	       "</a>"+menuOpcion);
			
	    $("#ExportTrabajadoresProyecto").find(".tituloSubList").html("Consolidado Proyecto - Trabajadores" +
               "<button style='font-size:19px' title='Descargar Consolidado Proyecto - Trabajadores en formato.pdf' " +
	               "class='btn btn-success' onclick='consolidadoProyectoExamenesTrabajadores()'>"+
	          "<i class='fa fa-download' aria-hidden='true'></i> Descargar" +
	       "</button>");
	    
	    $("#ImportTrabajadoresContratista").find(".tituloSubList").html("Import - Trabajadores" +
               "<button style='font-size:19px' title='Ingresar/Actualizar los registros de los trabajadores por " +
		       "medio de un excel.' class='btn btn-success' onclick='verImportSmartTrabajadoresContratista()'>" +
	          "<i class='fa fa-file-excel-o' aria-hidden='true'></i> Empezar" +
	       "</button>");
				
	    $(".listaGestionGosst").hide();$(".contenidoFormVisible").hide();
	    	 
	    break;
			
         default:
             mensajeUx = "<label>Ocurrió un error al cargar la información. Por favor, actualice la página o vuelva a iniciar sesión." +
	         "<br>De continuar todo esto, repórtelo al soporte de la plataforma GOSST.</label>";
             mensajesUx(mensajeUx,2,"","");
         
             break;
      }
   });	
}

// P-A00035 parte B (issue 796): las secciones «Activo» e «Inactivo en los proyectos» pintan 50 tarjetas por pagina y hay un buscador unico (nombre,
// apellido o documento; desde 3 caracteres) que filtra las dos secciones. Todo se hace en el navegador sobre listFullTrabajadoresContratista, que sigue
// completa y con los mismos indices: el menu de cada tarjeta, la edicion y las demas pantallas leen listFullTrabajadoresContratista[indice].
var TAM_PAGINA_TRABAJADORES_CONTRATISTA = 50;
var MIN_CARACTERES_BUSQUEDA_TRABAJADORES_CONTRATISTA = 3;
var ESPERA_BUSQUEDA_TRABAJADORES_CONTRATISTA = 300;
var SECCIONES_TRABAJADORES_CONTRATISTA = {
   activo:{panel:"trabContratistaProyActivo",numero:"numTrabProyActivoTitulo"},
   inactivo:{panel:"trabContratistaProyInactivo",numero:"numTrabProyInactivoTitulo"}
};
var indicesTrabajadoresContratista = {activo:[],inactivo:[]};
var paginaTrabajadoresContratista = {activo:1,inactivo:1};
var textoBusquedaTrabajadoresContratista = "";
var textosBusquedaTrabajadoresContratista = [];
var temporizadorBusquedaTrabajadoresContratista = null;

function textoTarjetaTrabajadorContratista(val,index){
   var btnOpcion = "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionTrab(this,"+index+")'>" +
                      "Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
                   "</a>";

   var menuOpcion = "<ul class='list-group listaGestionGosst'>";
       funcionalidadesTrabajador.forEach(function(val1,index1){
          var estiloExtra = (val1.isTitulo?"style='border:2px solid black;background:#2e9e8f !important;color:white !important;cursor:auto;'":"");

          menuOpcion += "<li "+estiloExtra+" class='list-group-item' onclick='marcarSubOpcionTrabajador("+index1+")'>"+val1.nombre+"</li>";
       });
   menuOpcion += "</ul>";

   var valorEsPrevencionista = (val.esPrevencionista == 1?"Sí":"No");

   return ("<div class='eventoGeneral'>" +
              "<div class='eventoGeneral'>" +
                 btnOpcion+menuOpcion +
                 "<strong>*** DATOS DEL TRABAJADOR(A) ***</strong><br><br>" +
                 "<div style='border-top:2px solid black;'></div>" +
                 "<i class='fa fa-user' aria-hidden='true'></i><strong> "+val.nombre+" , "+val.apellido+"</strong><br>" +
                 "<i class='fa fa-address-card-o' aria-hidden='true'></i> "+val.tipoDocumento.nombre+": "+val.nroDocumento+"<br>" +
                 (val.trabajosAltoRiesgoChtAsociadosNombre.length > 0?"<i class='fa fa-exclamation-triangle'></i> Trabajos de alto riesgo asociados: "+val.trabajosAltoRiesgoChtAsociadosNombre+"<br>":"") +
                 (mapCamposRegTrabContratista.get(22) == 1?"<i class='fa fa-info-circle'></i> ¿Es prevencionista? "+valorEsPrevencionista+"<br>":"") +
                 (mapCamposRegTrabContratista.get(21) == 1?"<i class='fa fa-building'></i> Empresa: "+(val.cliente.length == 0?"------":val.cliente)+"<br>":"") +
                 "<i class='fa fa-building-o' aria-hidden='true'></i> "+val.area+" - "+val.cargo+"<br>" +
                 "<label>*Estado actual: Revisar en la sección 'Ver indicadores de la contratista' o " +
                    "'Cargar documentos asociados a proyectos en curso'.</label>" +
              "</div>" +
           "</div>");
}

// Sin mayusculas ni tildes: «perez» encuentra «Pérez».
function normalizarTextoBusquedaTrabajadoresContratista(texto){
   var minuscula = String(texto == null?"":texto).toLowerCase();

   return (typeof minuscula.normalize == "function"?minuscula.normalize("NFD").replace(/[̀-ͯ]/g,""):minuscula);
}

// El texto de cada trabajador se prepara una sola vez, al cargar la lista; no se agrega ningun campo al objeto del trabajador (se envia al servidor al editar).
function prepararTextoBusquedaTrabajadorContratista(trab){
   var texto = normalizarTextoBusquedaTrabajadoresContratista((trab.nombre == null?"":trab.nombre)+" "+(trab.apellido == null?"":trab.apellido)+" "+
      (trab.nroDocumento == null?"":trab.nroDocumento));

   return {texto:texto,compacto:texto.replace(/[\s\-\.]/g,"")};
}

// Palabras de la busqueda: cada una debe tener al menos 3 caracteres (sin contar guiones ni puntos); las mas cortas se ignoran. Sin ninguna palabra valida no se filtra.
function palabrasBusquedaTrabajadoresContratista(texto){
   return normalizarTextoBusquedaTrabajadoresContratista(texto).split(/\s+/).filter(function(palabra){
      return palabra.replace(/[\-\.]/g,"").length >= MIN_CARACTERES_BUSQUEDA_TRABAJADORES_CONTRATISTA;
   });
}

function coincideBusquedaTrabajadorContratista(entrada,palabras){
   return palabras.every(function(palabra){
      return entrada.texto.indexOf(palabra) != -1 || entrada.compacto.indexOf(palabra.replace(/[\-\.]/g,"")) != -1;
   });
}

function indicesFiltradosTrabajadoresContratista(seccion){
   var todos = indicesTrabajadoresContratista[seccion],palabras = palabrasBusquedaTrabajadoresContratista(textoBusquedaTrabajadoresContratista);

   if(palabras.length == 0){
      return todos;
   }

   return todos.filter(function(indice){
      return coincideBusquedaTrabajadorContratista(textosBusquedaTrabajadoresContratista[indice],palabras);
   });
}

function obtenerControlesPaginacionTrabajadoresContratista(seccion,pagina,totalPaginas,desde,hasta,total){
   return "<div class='controlesPaginacionTrabajadoresContratista' style='display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0;'>" +
             "<button type='button' class='btn btn-success' style='padding:2px 8px' "+(pagina <= 1?"disabled ":"") +
                     "onclick='cambiarPaginaTrabajadoresContratista(\""+seccion+"\","+(pagina-1)+")' title='Página anterior' aria-label='Página anterior'>" +
                "<i class='fa fa-chevron-left' aria-hidden='true'></i>" +
             "</button>" +
             "<span style='font-size:14px;font-weight:bold;white-space:nowrap;margin:0 4px;' aria-live='polite'>Página "+pagina+" de "+totalPaginas+"</span>" +
             "<button type='button' class='btn btn-success' style='padding:2px 8px' "+(pagina >= totalPaginas?"disabled ":"") +
                     "onclick='cambiarPaginaTrabajadoresContratista(\""+seccion+"\","+(pagina+1)+")' title='Página siguiente' aria-label='Página siguiente'>" +
                "<i class='fa fa-chevron-right' aria-hidden='true'></i>" +
             "</button>" +
             "<span style='font-size:13px;white-space:nowrap;'>Mostrando "+(desde+1)+" a "+hasta+" de "+total+"</span>" +
          "</div>";
}

function pintarSeccionTrabajadoresContratista(seccion){
   var config = SECCIONES_TRABAJADORES_CONTRATISTA[seccion];
   var todos = indicesTrabajadoresContratista[seccion],indices = indicesFiltradosTrabajadoresContratista(seccion);
   var buscando = (palabrasBusquedaTrabajadoresContratista(textoBusquedaTrabajadoresContratista).length > 0);
   var totalPaginas = Math.max(1,Math.ceil(indices.length / TAM_PAGINA_TRABAJADORES_CONTRATISTA));
   var pagina = Math.min(Math.max(1,paginaTrabajadoresContratista[seccion]),totalPaginas);
   var desde = (pagina - 1) * TAM_PAGINA_TRABAJADORES_CONTRATISTA,hasta = Math.min(desde + TAM_PAGINA_TRABAJADORES_CONTRATISTA,indices.length);
   var tarjetas = "";

   for(var i = desde;i < hasta;i++){
      tarjetas += textoTarjetaTrabajadorContratista(listFullTrabajadoresContratista[indices[i]],indices[i]);
   }

   if(tarjetas.length == 0 && buscando){
      tarjetas = "<div class='eventoGeneral'>Sin resultados para la búsqueda.</div>";
   }

   var controles = (totalPaginas > 1?obtenerControlesPaginacionTrabajadoresContratista(seccion,pagina,totalPaginas,desde,hasta,indices.length):"");

   paginaTrabajadoresContratista[seccion] = pagina;
   $("#"+config.panel).find(".contenidoSubList").html(controles+tarjetas+controles);
   $("#"+config.numero).text(buscando?indices.length+" de "+todos.length:todos.length);
   $(".listaGestionGosst").hide();
}

function irSeccionTrabajadoresContratista(seccion){
   var panel = $("#"+SECCIONES_TRABAJADORES_CONTRATISTA[seccion].panel);

   panel.find(".contenidoSubList").show();

   if(panel.length > 0 && panel[0].scrollIntoView){
      panel[0].scrollIntoView({behavior:"smooth",block:"start"});
   }
}

function cambiarPaginaTrabajadoresContratista(seccion,pagina){
   var totalPaginas = Math.max(1,Math.ceil(indicesFiltradosTrabajadoresContratista(seccion).length / TAM_PAGINA_TRABAJADORES_CONTRATISTA));

   if(pagina < 1 || pagina > totalPaginas){
      return;
   }

   paginaTrabajadoresContratista[seccion] = pagina;
   pintarSeccionTrabajadoresContratista(seccion);
   irSeccionTrabajadoresContratista(seccion);
}

function textoChipBusquedaTrabajadoresContratista(seccion,cantidad,singular,plural){
   var estilo = "display:inline-block;padding:3px 10px;border-radius:8px;font-size:13px;" +
      (seccion == "activo"?"background:#dff0d8;color:#3c763d;":"background:#fcf8e3;color:#8a6d3b;");

   if(cantidad == 0){
      return "<span style='"+estilo+"'>0 "+plural+"</span>";
   }

   return "<a class='efectoLink' style='"+estilo+"text-decoration:underline;cursor:pointer;' onclick='irSeccionTrabajadoresContratista(\""+seccion+"\")' " +
             "title='Ir a la sección'>"+cantidad+" "+(cantidad == 1?singular:plural)+"</a>";
}

function actualizarResumenBusquedaTrabajadoresContratista(){
   var resumen = $("#resumenBusquedaTrabajadoresContratista"),texto = $.trim($("#inputBuscarTrabajadorContratista").val());

   if(texto.length == 0){
      resumen.html("");
      return;
   }

   if(palabrasBusquedaTrabajadoresContratista(texto).length == 0){
      resumen.text("Escribe al menos "+MIN_CARACTERES_BUSQUEDA_TRABAJADORES_CONTRATISTA+" caracteres.");
      return;
   }

   resumen.html("<span>Resultados para «<span class='textoBusquedaTrabajadorContratista'></span>»:</span> " +
      textoChipBusquedaTrabajadoresContratista("activo",indicesFiltradosTrabajadoresContratista("activo").length,"activo","activos") +
      " " +
      textoChipBusquedaTrabajadoresContratista("inactivo",indicesFiltradosTrabajadoresContratista("inactivo").length,"inactivo","inactivos") +
      " " +
      "<a class='efectoLink' style='cursor:pointer;font-size:13px;' onclick='limpiarBusquedaTrabajadoresContratista()'>Borrar búsqueda</a>");
   // lo escrito por el usuario va como texto, nunca como HTML
   resumen.find(".textoBusquedaTrabajadorContratista").text(texto);
}

function aplicarBusquedaTrabajadoresContratista(){
   var texto = $.trim($("#inputBuscarTrabajadorContratista").val());
   var buscando = (palabrasBusquedaTrabajadoresContratista(texto).length > 0);

   textoBusquedaTrabajadoresContratista = (buscando?texto:"");
   paginaTrabajadoresContratista = {activo:1,inactivo:1};

   pintarSeccionTrabajadoresContratista("activo");
   pintarSeccionTrabajadoresContratista("inactivo");
   actualizarResumenBusquedaTrabajadoresContratista();

   // al buscar se abren las secciones con coincidencias y se cierran las demas; sin busqueda, cada seccion queda como al cargar (activos abierta, inactivos cerrada)
   Object.keys(SECCIONES_TRABAJADORES_CONTRATISTA).forEach(function(seccion){
      var contenido = $("#"+SECCIONES_TRABAJADORES_CONTRATISTA[seccion].panel).find(".contenidoSubList");

      contenido.toggle(buscando?indicesFiltradosTrabajadoresContratista(seccion).length > 0:seccion == "activo");
   });
}

// Espera un momento despues de la ultima tecla para no redibujar las tarjetas con cada letra.
function buscarTrabajadoresContratista(){
   clearTimeout(temporizadorBusquedaTrabajadoresContratista);
   temporizadorBusquedaTrabajadoresContratista = setTimeout(aplicarBusquedaTrabajadoresContratista,ESPERA_BUSQUEDA_TRABAJADORES_CONTRATISTA);
}

function limpiarBusquedaTrabajadoresContratista(){
   clearTimeout(temporizadorBusquedaTrabajadoresContratista);
   $("#inputBuscarTrabajadorContratista").val("");
   aplicarBusquedaTrabajadoresContratista();
}

function verAyudaImportHojaVidaTrabajadoresContratista(){ 
   window.open(URL+"/empresa/documento/evidencia?tipoId=3&id="+getSession("gestopcompanyid")+"","_blank");
}

var snFormRegTrabContCreado,activarObsDocNivelesTar;

function ocultarRegistroInfoTrabajadorContratista(){
   $("#modalRegistroInfoTrabCont").modal("hide");
}

function verRegistroInfoTrabajadorContratista(opcionRegistro){	
   $("#modalRegistroInfoTrabCont").remove();
   
   if(parseInt(opcionRegistro) == 0){
      objTrabajadorContratista = {id: 0}; 
   }

    var nombreModal = (parseInt(opcionRegistro) == 0?"Registrar datos del nuevo trabajador":"Editar datos del trabajador");

    var listBooleanSiNo = listBoolean.sort(function(val,val2){
        return val2.id - val.id;
    });

    var radiosRespEsPrevencionistaTrab = crearRadiosAutoVersionDos("radiosRespEsPrevencionistaTrab",
        listBooleanSiNo,(objTrabajadorContratista.id > 0?objTrabajadorContratista.esPrevencionista:0),"id","nombre","","");

   var selTipoDocTrab = crearSelectOneMenuOblig("selTipoDocTrab","",listTipoDocumento,
      (objTrabajadorContratista.id > 0?objTrabajadorContratista.tipoDocumento.id:""),"id","nombre");
    
   if(objTrabajadorContratista.id == 0){
      var selTipoProyTrab = crearSelectOneMenuOblig("selTipoProyTrab","",
         listProyectosAsignar,"","id","titulo","Ninguno");
   }
   
   var selTipoSangreTrab = crearSelectOneMenuOblig("selTipoSangreTrab","",listTipoSangre,
      (objTrabajadorContratista.id > 0?objTrabajadorContratista.tipoSangre.id:""),"id","nombre");
    
   var contenido = "";
	
   var listContenido=[
      {label:"Tipo Documento",inputForm:selTipoDocTrab},
      {label:"N° de Documento",inputForm:"<input class='form-control' type='text' id='inputNroDocTrabajadorContr'>"},
      {label:"Nombre",inputForm:"<input class='form-control' type='text' id='inputNombreTrabajadorContr'>"},
      {label:"Apellidos",inputForm:"<input class='form-control' type='text' id='inputApellidoTrabajadorContr'>"}
   ];
   
   if(objTrabajadorContratista.id == 0){
      listContenido.push({sugerencia:"<small style='font-weight:bolder;color:red;'>*Para ver los requisitos que aplican a cada trabajador, " +
         "revisar la sección 'Ver indicadores de la contratista'.</small>",label:"Proyecto Asignado",inputForm:selTipoProyTrab});
   }

    if(mapCamposRegTrabContratista.get(22) == 1){
        listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
            {anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"¿Es prevencionista?",inputForm:radiosRespEsPrevencionistaTrab});
    }
   
   listContenido.push({label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante});
   
   if(mapCamposRegTrabContratista.get(21) == 1){
      listContenido.push({sugerencia:"<small style='font-weight:bolder;'>*Anote el nombre de la empresa a la que pertenece el trabajador.</small>",
          label:"Empresa",inputForm:"<input class='form-control' type='text' id='inputClienteTrabajadorContr'>"});
   }
   
   if(mapCamposRegTrabContratista.get(5) == 1){
       listContenido.push({sugerencia:(objTrabajadorContratista.id == 0 || objTrabajadorContratista.area.length == 0?"":"<small style='font-weight:bolder;'>*En caso requiera actualizar " +
           "el área, comunicarse con su contacto de "+getSession("gestopcompanyname")+".</small>"),
           label:"Área",inputForm:"<input class='form-control' type='text' id='inputAreaTrabajadorContr'>"});
   }
   
   listContenido.push({sugerencia:(objTrabajadorContratista.id == 0 || objTrabajadorContratista.cargo.length == 0?"":"<small style='font-weight:bolder;'>*En caso requiera actualizar " +
       "el puesto de trabajo, comunicarse con su contacto de "+getSession("gestopcompanyname")+".</small>"),
       label:"Puesto de trabajo",inputForm:"<input class='form-control' type='text' id='inputCargoTrabajadorContr'>"});
   
   if(mapCamposRegTrabContratista.get(7) == 1){
      listContenido.push({label:"Código Interno"+"<br><label style='color:blue;'>(opcional)</label>",
          inputForm:"<input class='form-control' type='text' id='inputCodigoTrabajadorContr'>"});
   }
   
   if(mapCamposRegTrabContratista.get(8) == 1 || mapCamposRegTrabContratista.get(9) == 1){
      listContenido.push({label:"Fecha Nacimiento",inputForm:"<input class='form-control' type='date' onchange='colocarEdadTrabContratista()' id='inputFechaNacTrabajadorContr'>"}, 
	      {label:"Edad*",inputForm:"",idDivContainer:"divEdadTrabContr"});
   }
   
   if(mapCamposRegTrabContratista.get(10) == 1){
      listContenido.push({label:"Lugar Nacimiento"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputNacioTrabajadorContr'>"});
   }

   if(mapCamposRegTrabContratista.get(11) == 1){
      listContenido.push({label:"Lugar Residencia"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputResidenciaTrabajadorContr'>"});
   }

   if(mapCamposRegTrabContratista.get(12) == 1){
      listContenido.push({label:"Teléfono"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputTelefonoTrabajadorContr'>"});
   }

   if(mapCamposRegTrabContratista.get(13) == 1){
      listContenido.push({label:"Correo"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputCorreoTrabajadorContr'>"});
   }
   
   if(mapCamposRegTrabContratista.get(14) == 1){
      listContenido.push({label:"N° Seguro Essalud / EPS"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputNroSeguroTrabajadorContr'>"});
   }

   if(mapCamposRegTrabContratista.get(15) == 1){
      listContenido.push({label:"N° CIP"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputNroCipTrabajadorContr'>"});
   }

   if(mapCamposRegTrabContratista.get(16) == 1){
      listContenido.push({label:"Tipo Sanguíneo",inputForm:selTipoSangreTrab});
   }
   
   if(mapCamposRegTrabContratista.get(17) == 1){
      listContenido.push({label:"Contacto emergencia"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputContactoTrabajadorContr'>"});
   }
   
   if(mapCamposRegTrabContratista.get(18) == 1){
      listContenido.push({label:"Telefono Contacto emergencia"+"<br><label style='color:blue;'>(opcional)</label>",inputForm:"<input class='form-control' type='text' id='inputFonoContactoTrabajadorContr'>"});
   }
   
    if(mapCamposRegTrabContratista.get(19) == 1){
        listContenido.push({label:"Foto**",inputForm:"",idDivContainer:"divTrabContFoto"});
    }

    if(listTrabAltoRiesgoCht.length > 0){
        listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
            {anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Trabajos de alto riesgo*",
             inputForm:"<a class='efectoLink' onclick='verCheckListAsociarTrabAltoRieTrabCont()'>"+"Seleccionar "+"<i id='iTrabAltoRieTrabCont' class='fa fa-table' style='text-align:center;'></i>"+"</a>"},
            {anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",idDivContainer:"divSelAsocTrabAltoRieTrabCont"},
            {label:"",inputForm:"",styleTotal:styleLineaPunteadaElegante},
            {anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"*Es obligatorio declarar los trabajos de alto riesgo que vaya a realizar el trabajador.",inputForm:"",styleTotal:"color:red;"});

        if(objTrabajadorContratista.id > 0){
            listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
                {anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"Historial de modificaciones",inputForm:"<a class='efectoLink' onclick='verHistorialTrabajosAltoRiesgoTrabajadorContratista(0,0)'>" +
                 "Ver registros "+"<i class='fa fa-eye' style='text-align:center;'></i>"+"</a>"});
        }
    }
   
   listContenido.push({label:"",inputForm:"",styleTotal:styleLineaRobustaClasica},
      {label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
       		     "onclick='ocultarRegistroInfoTrabajadorContratista()'>" +
  	        "<i class='fa fa-times'></i> Cancelar" +
  	     "</button>",
       inputForm:"<button class='btn btn-success' type='submit' style='float:right;font-size:18px;' " +
  	  	      	 "onclick='guardarRegistroInfoTrabajadorContratista()'>" +
  	  	    "<i class='fa fa-floppy-o'></i> Guardar" +
  	  	 "</button>"});   
   
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionTres(val);
   });

   var modalOptions={
      id: "modalRegistroInfoTrabCont",nombre:"<i class='fa fa-pencil'></i> "+nombreModal,btnCerrarHabilitado:0,
      contenido: "<div class='eventoGeneral-moderno'>"+contenido+"</div>",contenidoClassAux:"modal-content-moderno"
   };
 	  				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
    if(objTrabajadorContratista.id > 0){
      $("#inputNroDocTrabajadorContr").val(objTrabajadorContratista.nroDocumento);$("#inputNombreTrabajadorContr").val(objTrabajadorContratista.nombre);
      $("#inputApellidoTrabajadorContr").val(objTrabajadorContratista.apellido);$("#inputAreaTrabajadorContr").val(objTrabajadorContratista.area);
      $("#inputCargoTrabajadorContr").val(objTrabajadorContratista.cargo);$("#inputFechaNacTrabajadorContr").val(convertirFechaInput(objTrabajadorContratista.fechaNacimiento));
      $("#inputNacioTrabajadorContr").val(objTrabajadorContratista.lugarNacio);$("#inputResidenciaTrabajadorContr").val(objTrabajadorContratista.lugarResidencia);
      $("#inputTelefonoTrabajadorContr").val(objTrabajadorContratista.telefono);$("#inputCorreoTrabajadorContr").val(objTrabajadorContratista.correo);
      $("#inputNroSeguroTrabajadorContr").val(objTrabajadorContratista.nroSeguro);$("#inputNroCipTrabajadorContr").val(objTrabajadorContratista.nroCip); 
      $("#inputCodigoTrabajadorContr").val(objTrabajadorContratista.codigoInterno); $("#inputContactoTrabajadorContr").val(objTrabajadorContratista.contactoNombre); 
      $("#inputFonoContactoTrabajadorContr").val(objTrabajadorContratista.contactoTelefono); $("#inputClienteTrabajadorContr").val(objTrabajadorContratista.cliente);  
      
      $("#inputNombreTrabajadorContr").prop("disabled",(objTrabajadorContratista.nombre.length > 0?true:false));
      $("#inputApellidoTrabajadorContr").prop("disabled",(objTrabajadorContratista.apellido.length > 0?true:false));
      $("#inputAreaTrabajadorContr").prop("disabled",(objTrabajadorContratista.area.length > 0?true:false));
      $("#inputCargoTrabajadorContr").prop("disabled",(objTrabajadorContratista.cargo.length > 0?true:false));
    }

    if(listTrabAltoRiesgoCht.length > 0){
        snFormRegTrabContCreado = 0;

        var metodoTrabAltoRieAux = (objTrabajadorContratista.id > 0?cargarCheckListAsociarTrabAltoRieTrabCont:ocultarCheckListAsociarTrabAltoRieTrabCont);

        crearCheckListGeneral("modalRegistroInfoTrabCont","Trabajos de alto riesgo","AsocTrabAltoRieTrabContSelec",
            listTrabAltoRiesgoCht,"AsociarTrabAltoRieTrabCont",metodoTrabAltoRieAux);
    }
   
   if(mapCamposRegTrabContratista.get(19) == 1){
      var options={
         container: "#divTrabContFoto",functionCall: function(){
             validacionSubirImagenFoto("FotoTrabajador"+objTrabajadorContratista.id,bitsEvidenciaPostulante,"modalRegistroInfoTrabCont",validacionSubirEvidencia);
         },mensajeAux: "**Aparecerá en el fotocheck",
         descargaUrl: "/contratista/trabajador/foto/evidencia?id="+objTrabajadorContratista.id,
         esNuevo: (objTrabajadorContratista.id == 0 || objTrabajadorContratista.evidenciaFotoNombre.length == 0?true:false),
         idAux: "FotoTrabajador"+objTrabajadorContratista.id,
         evidenciaNombre: (objTrabajadorContratista.id == 0?"":objTrabajadorContratista.evidenciaFotoNombre)
      };
	    	
      crearFormEvidenciaCompleta(options); 
   }
   
   colocarEdadTrabContratista();activarObsDocNivelesTar = 0;
}

function colocarEdadTrabContratista(){
   var inputFechaNac = $("#inputFechaNacTrabajadorContr").val();
   
   if(inputFechaNac.length != 0){ 
      var edad = calcularEdadAuto($("#inputFechaNacTrabajadorContr").val());
   
      $("#divEdadTrabContr").html(edad);
   }else{
      $("#divEdadTrabContr").html("<label>*Debe ingresar la fecha de nacimiento</label>");
   }
}

function ocultarCheckListAsociarTrabAltoRieTrabCont(){
    var textAsocTrabAltoRieTrabContCampo = "",textAsocTrabAltoRieTrabContCampoAuxId = "";

    listTrabAltoRiesgoCht.forEach(function(val){
        var isHabilitado = ($("#checkAsignadoAsocTrabAltoRieTrabContSelec"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textAsocTrabAltoRieTrabContCampo += (textAsocTrabAltoRieTrabContCampo.length == 0?val.nombre:", "+val.nombre);
			textAsocTrabAltoRieTrabContCampoAuxId += (textAsocTrabAltoRieTrabContCampoAuxId.length == 0?val.id:","+val.id);
        }
    });

    textAsocTrabAltoRieTrabContCampo = (textAsocTrabAltoRieTrabContCampo.length == 0?"No ha asignado ningún trabajo de alto riesgo":textAsocTrabAltoRieTrabContCampo);
    textAsocTrabAltoRieTrabContCampo = (textAsocTrabAltoRieTrabContCampo.length >= 1000?textAsocTrabAltoRieTrabContCampo.substring(0,1000)+"...":textAsocTrabAltoRieTrabContCampo);

    $("#divSelAsocTrabAltoRieTrabCont").html(textAsocTrabAltoRieTrabContCampo);

    $("#modalCheckListAsocTrabAltoRieTrabContSelec").modal("hide");
	
	verModalPrincipalCheckListAsociarTrabAltoRieTrabCont();
	
	if(objTrabajadorContratista.id > 0 && configTarDocNivelesObsEmpresa.snActivarObsDocVigTar == 1){
		if(objTrabajadorContratista.trabajosAltoRiesgoChtAsociadosId.trim() != textAsocTrabAltoRieTrabContCampoAuxId.trim()){
			$("#modalRegistroInfoTrabCont").modal("hide");activarObsDocNivelesTar = 1;
			
			mensajeUx = "<label>Esta modificación afectará documentos ya aprobados." +
			    "<br><br>Al guardar, los documentos vigentes asociados a los trabajos de alto riesgo pasarán a observado y deberán cargarse nuevamente." +
			    "<br><br>Documentos: "+textoNombreDocNivelesModObsEmp+".</label>";
			mensajesUx(mensajeUx,7,"","AvisoModTarObsEmp");
			       
			$("#modalMensajeUxAvisoModTarObsEmp").on("hidden.bs.modal",function(){
			    verModalPrincipalCheckListAsociarTrabAltoRieTrabCont();
			});
		}
	}
}

function verModalPrincipalCheckListAsociarTrabAltoRieTrabCont(){
	$("#modalRegistroInfoTrabCont").modal("show");

    if(snFormRegTrabContCreado == 1){
	    document.getElementById("divSelAsocTrabAltoRieTrabCont").focus();
    }else{
        document.getElementById("divSelAsocTrabAltoRieTrabCont").setAttribute("tabindex","-1");snFormRegTrabContCreado = 1;
    }
}

function verCheckListAsociarTrabAltoRieTrabCont(){
    $("#modalRegistroInfoTrabCont").modal("hide");$("#modalCheckListAsocTrabAltoRieTrabContSelec").modal("show");
}

function cargarCheckListAsociarTrabAltoRieTrabCont(){
    if(objTrabajadorContratista.trabajosAltoRiesgoChtAsociadosId.length != 0){
        var trabAltoRiesgoAsociadosId = objTrabajadorContratista.trabajosAltoRiesgoChtAsociadosId.split(",");

        trabAltoRiesgoAsociadosId.forEach(function(val1){
            var checkboxSeccHab = document.getElementById('checkAsignadoAsocTrabAltoRieTrabContSelec'+val1);

            if(checkboxSeccHab){
                checkboxSeccHab.checked = true;
            }
        });
    }

    ocultarCheckListAsociarTrabAltoRieTrabCont();
}

function guardarRegistroInfoTrabajadorContratista(){
    var campoVacio = true;
	
    var tipoDoc = $("#selTipoDocTrab").val();
    var nroDoc = $("#inputNroDocTrabajadorContr").val().trim();
    var nombre = $("#inputNombreTrabajadorContr").val().trim();
    var apellido = $("#inputApellidoTrabajadorContr").val().trim();
    var cargo = $("#inputCargoTrabajadorContr").val().trim();
    var proyecto = (objTrabajadorContratista.id == 0?$("#selTipoProyTrab").val():null);
   
    var area = (mapCamposRegTrabContratista.get(5) == 1?$("#inputAreaTrabajadorContr").val().trim():null);
    var fechaNacimiento = (mapCamposRegTrabContratista.get(8) == 1 || mapCamposRegTrabContratista.get(9) == 1?$("#inputFechaNacTrabajadorContr").val():null);
    var lugarNacio = (mapCamposRegTrabContratista.get(10) == 1?$("#inputNacioTrabajadorContr").val().trim():null);
    var lugarResidencia = (mapCamposRegTrabContratista.get(11) == 1?$("#inputResidenciaTrabajadorContr").val().trim():null);
    var telefono = (mapCamposRegTrabContratista.get(12) == 1?$("#inputTelefonoTrabajadorContr").val().trim():null);
    var correo = (mapCamposRegTrabContratista.get(13) == 1?$("#inputCorreoTrabajadorContr").val().trim():null);
    var nroSeguro = (mapCamposRegTrabContratista.get(14) == 1?$("#inputNroSeguroTrabajadorContr").val():null);
    var nroCip = (mapCamposRegTrabContratista.get(15) == 1?$("#inputNroCipTrabajadorContr").val().trim():null);
    var codigoInterno = (mapCamposRegTrabContratista.get(7) == 1?$("#inputCodigoTrabajadorContr").val().trim():null);
    var tipoSangre = (mapCamposRegTrabContratista.get(16) == 1?$("#selTipoSangreTrab").val():null);
    var contactoNombre = (mapCamposRegTrabContratista.get(17) == 1?$("#inputContactoTrabajadorContr").val().trim():null);
    var contactoTelefono = (mapCamposRegTrabContratista.get(18) == 1?$("#inputFonoContactoTrabajadorContr").val().trim():null);
    var cliente = (mapCamposRegTrabContratista.get(21) == 1?$("#inputClienteTrabajadorContr").val().trim():null);
    var evidenciaNombre = (mapCamposRegTrabContratista.get(19) == 1?$("#inputEviFotoTrabajador"+objTrabajadorContratista.id).val():null);
    var habilitarEvidencia = (mapCamposRegTrabContratista.get(19) == 1?1:0);
    var esPrevencionista = (mapCamposRegTrabContratista.get(22) == 1?parseInt($("input[name='radiosRespEsPrevencionistaTrab']:checked").val()):null);

    var listTrabajosAltoRiesgoChtAsociados = [];
    var textoTrabAltRieChtAsociados = "",textTrabajosAltoRiesgoChtAsociadosNombre = "";
	var hashTrabajosAltoRiesgoChtAsociados = new Map();

    listTrabAltoRiesgoCht.forEach(function(val){
        var isAsignado = ($("#checkAsignadoAsocTrabAltoRieTrabContSelec"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoTrabAltRieChtAsociados += (textoTrabAltRieChtAsociados.length == 0?val.id:","+val.id);
            textTrabajosAltoRiesgoChtAsociadosNombre += (textTrabajosAltoRiesgoChtAsociadosNombre.length == 0?val.nombre:", "+val.nombre);
            listTrabajosAltoRiesgoChtAsociados.push({id:val.id});
			hashTrabajosAltoRiesgoChtAsociados.set(val.id,1);
        }
    });
 
    if(nroDoc.length == 0 || nombre.length == 0 || apellido.length == 0){
        mensajeUx = "<label>Debe completar todos los campos obligatorios.</label>";campoVacio = false;
    }else if(mapDniTrabContratista.get(nroDoc) == 1 && (objTrabajadorContratista.id == 0 ||
        (objTrabajadorContratista.id > 0 && nroDoc != objTrabajadorContratista.nroDocumento))){
        mensajeUx = "<label>N° de documento ("+nroDoc+") ya registrado.</label>";campoVacio = false;
    }else if(objTrabajadorContratista.id == 0 && listProyectosAsignar.length == 0){
        mensajeUx = "<label>No tiene proyectos asignados en curso.</label>";campoVacio = false;
    }else if(mapCamposRegTrabContratista.get(19) == 1 && evidenciaNombre == "VOLVER A SUBIR"){
        mensajeUx = "<label>Debe volver a subir la foto del trabajador</label>";campoVacio = false;
    }else if(mapCamposRegTrabContratista.get(19) == 1 && parseInt(getSession("gestopcompanyid")) == 285 && evidenciaNombre.length == 0){
        mensajeUx = "<label>Debe subir la foto del trabajador</label>";campoVacio = false;
    }else if(parseInt(getSession("gestopcompanyid")) == 741 && !hashTrabajosAltoRiesgoChtAsociados.has(9) && (hashTrabajosAltoRiesgoChtAsociados.has(120) ||
	    hashTrabajosAltoRiesgoChtAsociados.has(121) || hashTrabajosAltoRiesgoChtAsociados.has(122))){
		campoVacio = false;mensajeUx="<label>Debe seleccionar 'Trabajos en altura' en los 'Trabajos de alto riesgo'.</label>";
	}

    if(campoVacio){
        var dataParam={
	        id:objTrabajadorContratista.id,tipoDocumento:{id:tipoDoc},nroDocumento:nroDoc,area:area,cargo:cargo,fechaNacimiento:convertirFechaTexto(fechaNacimiento),
            lugarNacio:lugarNacio,lugarResidencia:lugarResidencia,telefono:telefono,correo:correo,nroSeguro:nroSeguro,nroCip:nroCip,codigoInterno:codigoInterno,
	        tipoSangre:{id:tipoSangre},contactoNombre:contactoNombre,contactoTelefono:contactoTelefono,cliente:cliente,nombre:nombre,apellido:apellido,
            esPrevencionista:esPrevencionista,hasTrabAltRiePerfilContActivado:(listTrabAltoRiesgoCht.length > 0?1:0),trabajosAltoRiesgoCht:listTrabajosAltoRiesgoChtAsociados,
            textoTrabAltRieChtAsociados:textoTrabAltRieChtAsociados,trabajosAltoRiesgoChtAsociadosNombre:textTrabajosAltoRiesgoChtAsociadosNombre
        };
      
        if(objTrabajadorContratista.id == 0){
	        dataParam.proyectoActual = {id: proyecto};dataParam.contratista = {id: parseInt(getSession("contratistaGosstId"))};
        }else{
			dataParam.empresaConfig = configTarDocNivelesObsEmpresa;dataParam.activarObsDocNivelesTar = activarObsDocNivelesTar;
		}

        callAjaxPostSimpleVersionDos(1,URL+'/contratista/trabajador/save',dataParam,1,0,function(data){
            switch(data.CODE_RESPONSE){
	            case "05":
	                guardarEvidenciaAutoVersionTres(habilitarEvidencia,data.nuevoId,"fileEviFotoTrabajador"+objTrabajadorContratista.id,
	                bitsEvidenciaPostulante,0,1,"/contratista/trabajador/foto/evidencia/save",function(){
		                $("#modalRegistroInfoTrabCont").modal("hide");
		   
	                    mensajeUx = "<label>Los datos del trabajador fueron guardados con éxito.</label>";
	                    mensajesUx(mensajeUx,1,"","ActRegInfoTrabCont");
		    
	                    $("#modalMensajeUxActRegInfoTrabCont").on("hidden.bs.modal",function(){
	                        habilitarTrabajadoresContratista();
	                    });
	                });
							
	                break;
						
	            default:
	                console.log("Ocurrió un error al guardar los datos del trabajadores!");
            }
        });
    }else{
        $("#modalRegistroInfoTrabCont").modal("hide");
        mensajesUx(mensajeUx,2,"","AvisoRegInfoTrabCont");
       
        $("#modalMensajeUxAvisoRegInfoTrabCont").on("hidden.bs.modal",function(){
 	        $("#modalRegistroInfoTrabCont").modal("show");
        });
    }
}

function ocultarConsolidadoProyectoExamenesTrabajadores(){
   $("#modalConsolidadoProyectoExamenesTrabajadores").modal("hide");
}

function consolidadoProyectoExamenesTrabajadores(){
    $("#modalConsolidadoProyectoExamenesTrabajadores").remove();
    
    var dataParam={
        id:parseInt(getSession("contratistaGosstId")),estadoProyecto:2
    };
   
    callAjaxPost(URL+'/contratista/proyecto_asignado',dataParam,function(data){
        var listProyectosAsignados = data.listProyectosAsignados;
   
        var selProyectoAsignado = crearSelectOneMenuOblig("selProyectoAsignado","filtrarTrabajadoresProyectoAsignado()",
	        listProyectosAsignados,"-1","id","titulo");
    
        var contenido ="";
    
        var listContenido = [];
	
        var listContenido=[
	        {sugerencia:"",label:"Proyecto en curso",inputForm:selProyectoAsignado},
	        {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divTrabajadoresProyAsig"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",label:"Fecha de trabajo",inputForm:"<input type='date' id='fechaReferenciaProyAsig' class='form-control'>"},
            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	        {sugerencia:"",label:"Detalle de la actividad",inputForm:"<textarea class='form-control' id='textAreaDetalleProyAsig' rows='5'></textarea>",divContainer:""},
	        {sugerencia:"",label:"",inputForm:"",divContainer:""},
	        {sugerencia:"",label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsolidadoProyectoExamenesTrabajadores()'>" +
	                                 "<i class='fa fa-times'></i> Cancelar" +
	                             "</button>",
             inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarConsolidadoProyectoExamenesTrabajadores()'>" +
           	               "<i class='fa fa-download'></i> Descargar" +
                       "</button>"}
        ];
	    
        listContenido.forEach(function(val){
            contenido += obtenerSubPanelModuloGeneral(val);
        });
	
        var modalOptions={
	        id:"modalConsolidadoProyectoExamenesTrabajadores",nombre:"<i class='fa fa-download'></i> Valores consolidado Proyecto - trabajadores <br>",
	        contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
        };
	
        crearModalPrincipalUsuario(modalOptions,function(){},true,true);

        var hoy = getSession("fechaHoyOrdenInversoTexto");

        $("#fechaReferenciaProyAsig").val(hoy);
      
        filtrarTrabajadoresProyectoAsignado();
        $("#modalConsolidadoProyectoExamenesTrabajadores").modal("show");
    });
}

var listTrabajadoresProyectoAsignado = [];

function filtrarTrabajadoresProyectoAsignado(){
   var dataParamAux={ 
      proyectoId: parseInt($("#selProyectoAsignado").val())
   }; 
    
   callAjaxPost(URL+'/contratista/proyecto_asignado/trabajadores',dataParamAux,function(data){
      listTrabajadoresProyectoAsignado = data.listTrabajadoresProyectoAsignado;
       
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadoresProyectoAsignado","",listTrabajadoresProyectoAsignado,
         "id","nombre","#divTrabajadoresProyAsig","Todos");   
   });
}

function descargarConsolidadoProyectoExamenesTrabajadores(){
    var campoVacio = true;

    var fechaReferencia = $("#fechaReferenciaProyAsig").val();

    if(fechaReferencia.length == 0){
        mensajeUx = "<label>Debe ingresar la fecha de trabajo.</label>";campoVacio = false;
    }

    if(campoVacio){
        var detalleActividad = $("#textAreaDetalleProyAsig").val();

        var listTrabajadoresProAsiId = [];
        var trabProyAsigId = $("#selMulTrabajadoresProyectoAsignado").val();

        if(trabProyAsigId != null && trabProyAsigId.length > 0){
            trabProyAsigId.forEach(function(val){
                listTrabajadoresProAsiId.push(parseInt(val));
            });
        }

        var fechaReferenciaTexto = convertirFechaNormal(fechaReferencia);

        window.open(URL+"/contratista/consolidado/proyecto_asignado_trabajadores?"+"proyectoAsignadoId="+$("#selProyectoAsignado").val() +
            "&contratistaId="+getSession("contratistaGosstId")+"&detalleActividad="+detalleActividad+"&empresaId="+getSession("gestopcompanyid") +
            "&listTrabajadoresProAsiId="+(listTrabajadoresProAsiId.length == 0?"0":listTrabajadoresProAsiId)+"&fechaReferencia="+fechaReferencia +
            "&fechaReferenciaTexto="+fechaReferenciaTexto,'_blank');

        $("#modalConsolidadoProyectoExamenesTrabajadores").modal("hide");$("#modalConsolidadoProyectoExamenesTrabajadores").remove();
    }else{
        $("#modalConsolidadoProyectoExamenesTrabajadores").modal("hide");
        mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");

        $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
            $("#modalConsolidadoProyectoExamenesTrabajadores").modal("show");
        });
    }
}

var listProyectosAsigTraCon = [];
var listEstadosProyectoId = [];
var proyAsigTrabConId;
var proyAsigTrabConObj={};
var banderaEdicionAux1;

function ocultarFiltroTablaProyectosAsignadosTrabContratista(){
   $("#modalFiltroTablaProyAsigTraCon").modal("hide");
   $("#modalProyAsigTraConLista").modal("show");
}

function verFiltroTablaProyectosAsignadosTrabContratista(){
   $("#modalProyAsigTraConLista").modal("hide");
   $("#modalFiltroTablaProyAsigTraCon").modal("show");
}

function crearFiltroTablaProyectosAsignadosTrabContratista(functionCallBack){
    
   var dataParam={}; 
 		
   callAjaxPost(URL+'/contratista/proyecto/trabajador_asignado/lista/filtro',dataParam,function(data){
      var listEstadosPer = data.listEstadosPer;
       
      var listTrabConActivo=[
             {id:-1,nombre:"Sí / No"},
	     {id:0,nombre:"No"},
	     {id:1,nombre:"Sí"}
	                    ];
      
      var selTrabConActivo = crearSelectOneMenuOblig("selTrabConActivo","",listTrabConActivo,
	     "-1","id","nombre");
       
      var contenido = "";
 				
      var listContenido=[
             {sugerencia:"",label:"Estado del proyecto",inputForm:"",
              divContainer:"divFiltroEstadosProyectoTraCon"},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",label:"¿Trabajador activo en este proyecto?",
              inputForm:selTrabConActivo,divContainer: ""},
             {sugerencia:"",label:"",inputForm:"",divContainer:""},
             {sugerencia:"",
              label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroTablaProyectosAsignadosTrabContratista()'>" +
                       "<i class='fa fa-times'></i> Cancelar" +
                    "</button>",
 	      inputForm:"<button id='btnAplicarFiltroTablaProyAsigTraCon' style='float:right;' class='btn btn-success' " +
 	      		        "type='submit' onclick='cargarProyectosAsignadosTrabContratista()'>" +
 	            	   "<i class='fa fa-filter'></i> Aplicar filtro" +
 	            	"</button>"},
 	                ];
 				
      listContenido.forEach(function(val){
         contenido +=obtenerSubPanelModuloGeneral(val);
      });
 				
      var modalOptionsCov={
	     id:"modalFiltroTablaProyAsigTraCon",
	     nombre:"<i class='fa fa-filter'></i> Filtros - Lista de proyectos asignados",
             contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
                          };
 				
      crearModalPrincipalUsuario(modalOptionsCov,function(){
         if($("#filtroEstadosProyectoTraCon").length > 0){
 	    return;
         }
          
         crearSelectOneMenuObligMultipleCompleto("filtroEstadosProyectoTraCon","",listEstadosPer,
            "id","nombre","#divFiltroEstadosProyectoTraCon","Todos");
      },true,true);
       
 				
      $("#btnAplicarFiltroTablaProyAsigTraCon").on("click",function(){
	 ocultarFiltroTablaProyectosAsignadosTrabContratista(); 
      });
 				
      $("#modalFiltroTablaProyAsigTraCon").modal("hide");
      functionCallBack();
   });
}

function ocultarTablaProyectosAsignadosTrabContratista(){
   $("#modalProyAsigTraConLista").modal("hide");
}

function verTablaProyectosAsignadosTrabContratista(){
   
   var listModal={
	  id:"modalProyAsigTraConLista",
	  nombre:"Lista de proyectos asociados - Trabajador(a) "+objTrabajadorContratista.apellido+", " +
	  							 objTrabajadorContratista.nombre,
	  contenido:
	     "<button class='btn btn-info' id='btnVolverAsigProyTraCon' title='Regresar a la vista anterior.' " +
	             "onclick='ocultarTablaProyectosAsignadosTrabContratista()'>" +
	        "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	     "</button>" +
	     "<button class='btn btn-success' id='btnCancelarAsigProyTraCon' title='Cancelar la modificaciones realizadas.' " +
                     "onclick='cancelarProyectosAsignadosTrabContratista()'>" +
                "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
             "</button>" +
	     "<button class='btn btn-success' id='btnFiltroAsigProyTraCon' style='margin-left: 5px' " +
	             "title='Permite filtrar los registros mostrados en esta tabla.' " +
	             "onclick='verFiltroTablaProyectosAsignadosTrabContratista()'>" +
	        "<i class='fa fa-filter fa-2x'></i>" +
	     "</button>" +
	     "<button class='btn btn-success' id='btnGuardarAsigProyTraCon' style='margin-left: 5px' " +
                     "title='Guardar las modificaciones realizadas al registro seleccionado.' " +
                     "onclick='guardarProyectosAsignadosTrabContratista()'>" +
                "<i class='fa fa-floppy-o fa-2x'></i>" +
             "</button>" +
             "<div class='wrapper' id='wrapProyAsigTraCon'>" +
	        "<table id='tblProyAsigTraCon' " +
		       "class='table table-striped table-bordered table-hover table-fixed'>" +
	           "<thead>" +
		      "<tr>" +
		         "<td class='tb-acc' style='width:360px'>Proyecto asignados al contratista</td>" +
		         "<td class='tb-acc' style='width:100px'>Estado del proyecto</td>" +
		         "<td class='tb-acc' style='width:100px'>¿Trabajador activo en este proyecto?</td>" +
		         "<td class='tb-acc' style='width:170px'>Fecha de asignación al proyecto</td>" +
		         "<td class='tb-acc' style='width:170px'>Fecha de desvinculación al proyecto</td>" +
		      "</tr>" +
		   "</thead>" +
		   "<tbody></tbody>" +
	        "</table>" +
	     "</div>"
	         };
	
    agregarModalPrincipalUsuario(listModal);
    resizeDivWrapper("wrapProyAsigTraCon",200);
    $("#modalProyAsigTraConLista").modal("hide");
    
    crearFiltroTablaProyectosAsignadosTrabContratista(cargarProyectosAsignadosTrabContratista);
}

function valoresFiltroProyAsignadosTrabContratista(){
   listEstadosProyectoId = [];
    
   var estadoEvaluacionId = ($("#filtroEstadosProyectoTraCon").val() == undefined?
   	                     []:$("#filtroEstadosProyectoTraCon").val()); 
    
   if(estadoEvaluacionId != null){
      estadoEvaluacionId.forEach(function(val){
	 listEstadosProyectoId.push(parseInt(val));
      });
   }
}

function cargarProyectosAsignadosTrabContratista(){
   $("#modalProyAsigTraConLista").modal("show");
   $("#btnCancelarAsigProyTraCon").hide();
   $("#btnGuardarAsigProyTraCon").hide();
   $("#btnVolverAsigProyTraCon").show();
   $("#btnFiltroAsigProyTraCon").show();
   banderaEdicionAux1 = false;
   
   valoresFiltroProyAsignadosTrabContratista();
    
   var dataParam2={
	  trabajadorId: objTrabajadorContratista.id,
          contratistaId: parseInt(getSession("contratistaGosstId")),
          isActivo: ($("#selTrabConActivo").val() == -1?null:
             parseInt($("#selTrabConActivo").val())),
          listEstadosProyectoIdFiltro: (listEstadosProyectoId.length == 0?null:
             listEstadosProyectoId)
	   	  }

   callAjaxPost(URL+'/contratista/proyecto/trabajador_asignado/lista',dataParam2,function(data){
      listProyectosAsigTraCon = data.listProyectosAsigTraCon;	
      $("#tblProyAsigTraCon tbody tr").remove();
		
      listProyectosAsigTraCon.forEach(function(val,index){
	 if(val.isActivo == null){
	    val.isActivo = 0;    
	 }
	  
         $("#tblProyAsigTraCon tbody")
         .append("<tr id='trProyAsigTraCon"+val.proyectoActual.id+"' " +
         	     "onclick='editarProyectosAsignadosTrabContratista("+index+")'>" +
	            "<td>"+val.proyectoActual.titulo+"</td>" +
		    "<td>"+val.proyectoActual.estado.nombre+"</td>" +
		    "<td id='activoProyTraCon"+val.proyectoActual.id+"'>"+(val.isActivo == 1?
		    	 "<label style='color:blue'>SÍ<label>":
		    	 "<label style='color:red'>NO<label>")+"</td>" +
		    "<td id='fecAsigProyTraCon"+val.proyectoActual.id+"'>"+val.fechaAsignacionTexto+"</td>" +
		    "<td id='fecDesvProyTraCon"+val.proyectoActual.id+"'>"+val.fechaDesvinculacionTexto+"</td>" +
	         "</tr>");
      });
	
      formatoCeldaSombreableTabla(true,"tblProyAsigTraCon");
      goheadfixedY("#tblProyAsigTraCon","#wrapProyAsigTraCon");
   });
}

function editarProyectosAsignadosTrabContratista(pindex){
   if(!banderaEdicionAux1){
      proyAsigTrabConObj = listProyectosAsigTraCon[pindex];
      proyAsigTrabConId = listProyectosAsigTraCon[pindex].proyectoActual.id;
      
      $("#trProyAsigTraCon"+proyAsigTrabConId).addClass("fila-edicion");
      
      var verifEst = proyAsigTrabConObj.isActivo;
      var textoEstActivo = "";
	 
      if(verifEst == 1){
	 textoEstActivo = "checked";
      }
	 	  	
      $("#activoProyTraCon"+proyAsigTrabConId)
      .html("<input type='checkbox' id='checkValidarEstProyTraCon' class='form-control' "+textoEstActivo+">");
      
      var fechaAsignacion = proyAsigTrabConObj.fechaAsignacion;
      var today1 = convertirFechaInput(fechaAsignacion);
      
      $("#fecAsigProyTraCon"+proyAsigTrabConId)
      .html("<input type='date' id='inputFecAsigProyTraCon' class='form-control'>");
      
      $("#inputFecAsigProyTraCon").val(today1);
      
      var fechaDesvinculacion = proyAsigTrabConObj.fechaDesvinculacion;
      var today2 = convertirFechaInput(fechaDesvinculacion);
      
      $("#fecDesvProyTraCon"+proyAsigTrabConId)
      .html("<input type='date' id='inputFecDesvProyTraCon' class='form-control'>");
      
      $("#inputFecDesvProyTraCon").val(today2);
      
      
      formatoCeldaSombreableTabla(false,"tblProyAsigTraCon");
      banderaEdicionAux1 = true;
      $("#btnCancelarAsigProyTraCon").show();
      $("#btnGuardarAsigProyTraCon").show();
      $("#btnVolverAsigProyTraCon").hide();
      $("#btnFiltroAsigProyTraCon").hide();
   }
}

function cancelarProyectosAsignadosTrabContratista(){
   cargarProyectosAsignadosTrabContratista();
}

function guardarProyectosAsignadosTrabContratista(){
   var campoVacio = true;
   
   var validarEstTraCon = ($("#checkValidarEstProyTraCon").prop("checked")?1:0);
   
   var inputFecAsig = convertirFechaTexto($("#inputFecAsigProyTraCon").val());
   var inputFecDesv = convertirFechaTexto($("#inputFecDesvProyTraCon").val());
   
   var dataParam={
      proyectoActual: {id: proyAsigTrabConId},isActivo: validarEstTraCon,
      fechaAsignacion: inputFecAsig,fechaDesvinculacion: inputFecDesv,
      empresaId: getSession("gestopcompanyid"),id: objTrabajadorContratista.id,
      proyectoId: proyAsigTrabConObj.proyectoId,contratistaId: parseInt(getSession("contratistaGosstId"))
   };

   callAjaxPost(URL+'/contratista/proyecto/trabajador_asignado/lista/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
            $("#modalProyAsigTraConLista").modal("hide");
            mensajeUx = "<label>El registro se actualizó con éxito.</label>";
 	     
	    mensajesUx(mensajeUx,1,"","ActualizarProyAsigTraCon");
	     
	    $("#modalMensajeUxActualizarProyAsigTraCon").on("hidden.bs.modal",function(){
	       cargarProyectosAsignadosTrabContratista();    
	    });   
 							
 	    break;
 						
 	 default:
 	    console.log("Ocurrió un error al guardar la asignación al trabajador!");
      }
   });		
}

var listOpcionImportTrabCon=[
   {id:1,nombre:"Registrar trabajador(es)"}
//   {id:2,nombre:"Actualizar trabajador(es)"}
];

function ocultarImportSmartTrabajadoresContratista(){
   $("#divImportTrabajadorCon").modal("hide");
}

function verImportSmartTrabajadoresContratista(){
   $("#divImportTrabajadorCon").remove(); 
    
   var textBackUp = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/trabajador_contratista/backup?" +
                       "contratistaId="+getSession("contratistaGosstId")+"'>" +
                       "<i class='fa fa-download'></i> Descargar" +
                    "</a>";
   
   var textPlantilla = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/trabajador_contratista/backup/plantilla?" +
                          "contratistaId="+getSession("contratistaGosstId")+"'>" +
                          "<i class='fa fa-download'></i> Descargar" +
                       "</a>";
   
   var selOpcionImportTraCon = crearSelectOneMenuOblig("selOpcionImportTraCon","",listOpcionImportTrabCon,1,"id","nombre");
	
   var listItemsForm=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Lista Backup ",inputForm:textBackUp,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-download'></i> Plantilla ",inputForm:textPlantilla,divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Opción import",inputForm:selOpcionImportTraCon},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"<i class='fa fa-info'></i> Archivo Excel: ",
       inputForm:"",divContainer:"divExcelImportTraCon"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",label:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
	             "onclick='ocultarImportSmartTrabajadoresContratista()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;'>" +
       		    "<i class='fa fa-floppy-o'></i> Guardar" +
       		 "</button>",divContainer:""}
   ];
	
   var text = "";
		       	
   listItemsForm.forEach(function(val,index){
      text += obtenerSubPanelModuloVersionDos(val);
   });
		       	
   var contenido = "<form id='formImportEvento' class='eventoGeneral'>" +
                      "<div id='tituloEvento'>"+text+"</div>" +
                   "</form>";  
		       	
   var listPaneles={
      id:"divImportTrabajadorCon",
      nombre:"<i class='fa fa-file-excel-o'></i> Actualizar trabajadores contratista (import)",
      clase:"listaAuxiliar",contenido:contenido
   };
		       	
   agregarModalPrincipalColaboradorGeneral(listPaneles,function(){
      var options={
	 container: "#divExcelImportTraCon",functionCall: function(){},descargaUrl: "",
	 esNuevo: true,idAux: "ImportExcelTraCon",evidenciaNombre: ""
      };
			
      crearFormEvidenciaCompleta(options);
   });
		
   $("#formImportEvento").on("submit",function(e){
      e.preventDefault();
      confirmacionSmartImportTrabajadoresContratista();
   });
}

function confirmacionSmartImportTrabajadoresContratista(){
   $("#divImportTrabajadorCon").modal("hide");$("#modalConfirmacionImportTrabCon").remove();
   
   var campoVacio = true;
   
   var nombreExcel = $("#inputEviImportExcelTraCon").val();
    
   if(nombreExcel.length == 0){
      campoVacio = false;
   }
   
   if(campoVacio){
      var contenidoAux = "";
   
      var opcionImpId = parseInt($("#selOpcionImportTraCon").val());
 	   
      var valOpcionImportAux = listOpcionImportTrabCon.find(function(val1){return val1.id == opcionImpId}).nombre;
 	   
      var listContenidoAux=[
         {sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",
          label:"<i class='fa fa-check-square-o'></i> Opción import seleccionado",
          inputForm:"<span style='color:blue;font-weight:bolder;'>"+valOpcionImportAux+"</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",
          label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
 	                "onclick='cancelarMensajeConfirmacionSmartImportTrabajadorContratista()'>" +
 	           "<i class='fa fa-times'></i> Cancelar" +
 	        "</button>",
 	  inputForm:"<button type='submit' class='btn btn-success' style='font-size:18px;float:right;'>" +
 	               "<i class='fa fa-check'></i> Aceptar" +
 	            "</button>"}
      ];
 	  
      listContenidoAux.forEach(function(val){
         contenidoAux += obtenerSubPanelModuloVersionDos(val);
      });
           		
      var modalOptionsAux={
     	 id: "modalConfirmacionImportTrabCon",
     	 nombre: "<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
     	 contenido: "<form id='formConfirmacionImportTrabCon' class='eventoGeneral'>"+contenidoAux+"</form>"
      };
           		
      crearModalPrincipalUsuario(modalOptionsAux,function(){},true,true);
       
      $("#formConfirmacionImportTrabCon").on("submit",function(e){
         e.preventDefault();
         enviarExcelImportTrabajadorContratista(); 
      }); 
   }else{
      mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";

      mensajesUx(mensajeUx,2,"","AvisoCompletarImportTrabCon");

      $("#modalMensajeUxAvisoCompletarImportTrabCon").on("hidden.bs.modal",function(){
	 $("#divImportTrabajadorCon").modal("show");   
      });   
   }
}

function cancelarMensajeConfirmacionSmartImportTrabajadorContratista(){
   $("#modalConfirmacionImportTrabCon").modal("hide");$("#divImportTrabajadorCon").modal("show");
}

function enviarExcelImportTrabajadorContratista(){
   guardarEvidenciaAuto(0,"fileEviImportExcelTraCon",bitsEvidenciaActoInseguro,
      "/contratista/trabajador_contratista/excel/masivo/save",function(data){
         $("#modalConfirmacionImportTrabCon").remove();
	    
	 mensajeUx= "<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
	 mensajesUx(mensajeUx,4,"","ActualizarVistaModTrabCon");
	    
	 $("#modalMensajeUxActualizarVistaModTrabCon").on("hidden.bs.modal",function(){
	    habilitarTrabajadoresContratista();     
	 });
   },"id",[  
      {id: "contratistaId",value: getSession("contratistaGosstId")},
      {id: "opcionImpId",value: parseInt($("#selOpcionImportTraCon").val())}]);
}

function volverBlacklistTrabajadorContratista(){
   $("#modalBlacklistTrab").modal("hide");
}

function verBlacklistTrabajadorContratista(trabId){
   $("#modalBlacklistTrab").remove();	
   
   if(objTrabajadorContratista.numBlacklistTotal > 0){
      var buttonVolver =
         "<button type='button' id='btnVolverBlacklistTrab' class='btn btn-info' style='margin-right:5px' " +
	         "onclick='volverBlacklistTrabajadorContratista()' title='Regresar a la vista anterior.'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>";
      
      var modalOptions={
         maxWidth:"70%",id:"modalBlacklistTrab",
         nombre:"<i class='fa fa-user-times'></i> Blacklist - trabajador (" +
                 objTrabajadorContratista.nroDocumento+") "+objTrabajadorContratista.nombre,
         contenido: 
             buttonVolver +
    	    "<div class='wrapper' id='wrapperBlacklistTrab'>" +
    	       "<table class='table table-striped table-bordered table-hover table-fixed' "+
    		      "id='tblBlacklistTrab'>" +
    	          "<thead>" +
    	             "<th class='tb-acc' style='width:250px'>Motivo</th>"+
    	             "<th class='tb-acc' style='width:250px'>Observación</th>"+
    	             "<th class='tb-acc' style='width:180px'>Evidencia</th>  "+
    	             "<th class='tb-acc' style='width:180px'>Estado</th>  "+
    	          "</thead>" +
    	          "<tbody></tbody>"+
               "</table>" +
            "</div>"};
    		
      crearModalPrincipalUsuario(modalOptions,function(){},true,true); 
      resizeDivWrapper("wrapperBlacklistTrab",190);
      
      var dataParam={
         trabajador:{nroDocumento: objTrabajadorContratista.nroDocumento},
         empresaId: parseInt(getSession("gestopcompanyid"))
      };
	
      callAjaxPost(URL+"/contratista/blacklists/simple",dataParam,function(data){
         var listBlacklist = data.list;
         
         listBlacklist.forEach(function(val){
	    var enlaceDescargaEvi = (val.evidenciaNombre.length == 0?"------":
	       "<a class='efectoLink' href='"+URL+"/contratista/blacklist/evidencia?id="+val.id+"'>" +
	    	   val.evidenciaNombre +
	       "</a>");
	     
	    var estadoActual = val.estado.nombre+"<br><br>(Inicio: "+val.fechaInicioTexto+"<br> Fin: "+val.fechaFinTexto+")";
					
	    $("#tblBlacklistTrab tbody").append( 
               "<tr id='trBlacklistTrab"+val.id+"'>" +
	          "<td>"+val.subCategoria.nombre+"</td>" +
	          "<td>"+val.observacion+"</td>" +
	          "<td style='word-break:break-all;'>"+enlaceDescargaEvi+"</td>" +
	          "<td>"+estadoActual+"</td>" +
	       "</tr>");
         });
      });
   }else{
      mensajeUx="<label>El trabajador no tiene sanciones registradas.</label>"; 
      mensajesUx(mensajeUx,2,"");
   }
}

function validacionPreviaGenerarFotocheckCodigoQrTrabajadorContratista(){
   var campoVacio = true;
   
   if(objTrabajadorContratista.evidenciaFotoNombre.length == 0){
      mensajeUx = "<label>Sin foto del trabajador registrada.</label>";campoVacio = false; 
   }
   
   if(campoVacio){
      generarFotocheckCodigoQrTrabajadorContratista(2);
   }else{
      mensajesUx(mensajeUx,2,"","");
   }
}

function volverPrincipalAsociarTrabajosAltoRiesgoTrabajadorContratista(acceso){
    var accesoAux = parseInt(acceso);

    $("#modalConsolidadoHistorialTrabAltoRieTrabCont").modal("hide");$("#"+(accesoAux == 0?"modalRegistroInfoTrabCont":"modalConsolidadoTrabContAsig")).modal("show");
}

function verHistorialTrabajosAltoRiesgoTrabajadorContratista(pIndex,acceso){
    var pIndexAux = parseInt(pIndex),accesoAux = parseInt(acceso);
    var objTrabContAux = (accesoAux == 0?objTrabajadorContratista:listTrabContIndicadorAux[pIndexAux]);

    $("#"+(accesoAux == 0?"modalRegistroInfoTrabCont":"modalConsolidadoTrabContAsig")).modal("hide");$("#modalConsolidadoHistorialTrabAltoRieTrabCont").remove();

    var contenido = "";

    var buttonVolver =
        "<button type='button' class='btn btn-info' style='margin-right:5px' onclick='volverPrincipalAsociarTrabajosAltoRiesgoTrabajadorContratista("+acceso+")' " +
                "title='Regresar a la vista principal'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var nombreCompletoAux = "("+objTrabContAux.nroDocumento+") "+(objTrabContAux.apellido.length == 0 && objTrabContAux.nombre.length == 0?"------":
        ((objTrabContAux.apellido.length == 0?"":objTrabContAux.apellido+", ")+(objTrabContAux.nombre.length == 0?"":objTrabContAux.nombre)));

    var modalOptions={
        maxWidth:"50%",id:"modalConsolidadoHistorialTrabAltoRieTrabCont",nombre:"<i class='fa fa-table'></i> Historial de trabajos " +
            "de alto riesgo asociados - "+nombreCompletoAux,btnCerrarHabilitado:0,
        contenido:
             buttonVolver +
            "<div id='wrapperHistorialTrabAltoRieTrabCont' class='wrapper'>" +
                "<table id='tblHistorialTrabAltoRieTrabCont' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:300px'>Trabajos de alto riesgo asociados</td>" +
                            "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperHistorialTrabAltoRieTrabCont",190);

    var dataParam={
        id:objTrabContAux.id
    };

    callAjaxPost(URL+"/contratista/trabajador/trabajos_alto_riesgo/historial",dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
            var listHistorialTrabAltoRieTrabCont = data.listHistorialTrabAltoRieTrabCont;

            if(listHistorialTrabAltoRieTrabCont.length > 0){
                $("#tblHistorialTrabAltoRieTrabCont tbody tr").remove();

                listHistorialTrabAltoRieTrabCont.forEach(function(val,index){
                    var trabajosAltoRiesgoNombre = (val.trabajosAltoRiesgoChtAsociadosNombre.length > 0?val.trabajosAltoRiesgoChtAsociadosNombre:"Ninguno");

                    $("#tblHistorialTrabAltoRieTrabCont tbody").append(
                        "<tr id='fHisTrabAltoRieTrabCont"+val.id+"'>" +
                            "<td>"+trabajosAltoRiesgoNombre+"</td>" +
                            "<td>"+val.fechaRegistroTexto+"</td>" +
                        "</tr>");
                });

                goheadfixedY("#tblHistorialTrabAltoRieTrabCont","#wrapperHistorialTrabAltoRieTrabCont");
            }else{
                $("#modalConsolidadoHistorialTrabAltoRieTrabCont").modal("hide");

                mensajeUx="<label>No tiene registros en el historial de trabajos de alto riesgo asociados al trabajador.<label>";
                mensajesUx(mensajeUx,2,"","ActualizarHisTrabAltRieTrabCont");

                $("#modalMensajeUxActualizarHisTrabAltRieTrabCont").on("hidden.bs.modal",function(){
                    $("#"+(accesoAux == 0?"modalRegistroInfoTrabCont":"modalConsolidadoTrabContAsig")).modal("show");
                });
            }
        }else{
            console.log("NOPNPO");
        }
    });
}
