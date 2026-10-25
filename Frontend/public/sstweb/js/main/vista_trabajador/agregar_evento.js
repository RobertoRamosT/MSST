
var listContenidoGeneralColab = [];
var listTipoFormacionColaborador = [],listFormacionColaborador = [],listCategoriaFormacionColaborador=[];
var listTipoAuditoriaColaborador = [],listClasificacionAuditoriaColaborador = [], listAreasAuditoriaColaborador = [],
    listUnidadesEvento = [],listDivisionesEvento = [],listAreasEvento = [];
var listTrabajadoresColaborador = [];

var nuevoRegAsigPuestoTrab = 0;

var mensajeUx;

function verAcordeTipoActividadColaborador(){
   $(".atributo-actividad").remove(); 
   var tipoId = parseInt($("#selTipoActividadMovil").val());
    
    switch(tipoId){
        case 10:
	        var dataParam={
	            idCompany:getSession("gestopcompanyid"),trabajadorId:getSession("trabajadorGosstId"),hasResponsablesArea:1
    	    };
	 
	        if(numAreasResponsable == 0){
	            dataParam.autoInspeccion = 1;
	        }
	 
	        var selectRespPlanificado = crearSelectOneMenuOblig("selRespPlanificado","",
                listBoolean,"1","id","nombre");
	 
	        var lugarTexto = (parseInt(getSession("gestopcompanyid")) == 647?"Lugar de inspección":(numAreasResponsable == 0?"Dirección":"Lugar"));
            var unidadTexto = (parseInt(getSession("gestopcompanyid")) == 714?"País - Empresa*":"Unidad*"),
                divisionTexto = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"Sede*":"División*"),
	            areaTexto = (parseInt(getSession("gestopcompanyid")) == 647?"Área de inspección*":(parseInt(getSession("gestopcompanyid")) == 670?"Agente*":
                    (parseInt(getSession("gestopcompanyid")) == 714?"Área - Proceso*":"Área*")));
	        var detalleTexto = (parseInt(getSession("gestopcompanyid")) == 647?"Detalle de la inspección":(numAreasResponsable == 0?"¿Presenta alguna discapacidad?":"Detalle del evento"));
	
	        listContenidoGeneralColab = [
                {sugerencia:"",clase:"atributo-actividad campos-programacionInspeccion",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	            {sugerencia:"",clase:"atributo-actividad campos-programacionInspeccion",anchoLabel:"",anchoDiv:"",
                 label:"Sub tipo de evento",inputForm:"",divContainer:"divSelClasificacionAudiColab"},
	            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",
                 label:"Tipo de inspección",inputForm:"",divContainer:"divSelTipoAudiColab"},
	            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",
                 label:lugarTexto,inputForm:"<input type='text' id='lugarActivdadMovil' class='form-control'>"}
            ];

            if(parseInt(getSession("gestopcompanyid")) == 500){
                listContenidoGeneralColab.push({sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:unidadTexto,inputForm:"",divContainer:"divSelUnidadEvent"},
                    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:divisionTexto,inputForm:"",divContainer:"divSelDivisionEvent"},
                    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:areaTexto,inputForm:"",divContainer:"divSelAreaEvent"},
                    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""});
            }

            listContenidoGeneralColab.push({sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:detalleTexto,
                 inputForm:"<textarea class='form-control' rows='4' id='textObservacionAudiColab'></textarea>"},
                {sugerencia:"",clase:"atributo-actividad campos-programacionInspeccion",anchoLabel:"",anchoDiv:"",
                 label:"¿Inspección planificada?",inputForm:selectRespPlanificado},
	            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Fecha planificada",
                 inputForm:"<input type='date' id='dateActivdadMovil' class='form-control'>"},
	            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Hora",
                 inputForm:"<input type='time' id='timeActivdadMovil' class='form-control'>"},
                {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:""});
	 
	        callAjaxPost(URL+"/auditoria/general/filtro",dataParam,procesarCamposInspeccion);
	 
	    break;
	 
      case 3:
	 nuevoRegAsigPuestoTrab = 0; 
	  
	 var dataParam={
	    idCompany:getSession("gestopcompanyid"),wantsOrdenNombre:1
         };
	 
	 listContenidoGeneralColab=[
            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Elegir tipo de formación",
             inputForm:"",divContainer:"divSelTipoFormColab"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Elegir categoría de formación",
             inputForm:"",divContainer:"divSelCategoriaFormacion"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Elegir tema de formación",
             inputForm:"",divContainer:"divSelFormacion"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Detalle del tema",
             inputForm:"<input type='text' id='inputDescripcionEvFormacion' class='form-control'>"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Duración (horas)",
             inputForm:"<input type='number' id='inputTiempoEvFormacion' class='form-control'>"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Fecha planificada",
             inputForm:"<input type='date' id='dateActivdadMovil' class='form-control'>"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Hora",
             inputForm:"<input type='time' id='timeActivdadMovil' class='form-control'>"},
            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Trabajadores",inputForm:""},
            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",
             label:"",inputForm:"<span></span>",divContainer:"divTrabFormacion"},
            {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"Puestos de trabajo",
             inputForm:"<a class='efectoLink' onclick='verAsignacionPuestoTrabajador()'>" +
   	                  "Seleccionar <i class='fa fa-table' aria-hidden='true'></i>" +
   	               "</a>"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",
             label:"Importar Excel por DNI (opcional)",inputForm:"",divContainer:"divListaTrabFormacion"},
	    {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
	 ];
	 
	 callAjaxPost(URL+"/capacitacion/programacion/filtro",dataParam,procesarCamposFormacion);
	 
	 break;
	 
        case 5:
	        var dataParam={
	            idCompany:getSession("gestopcompanyid"),equipoSeguridadTipoId:1
    	    };
	
//	 if(parseInt(getSession("habilitarValidacion")) == 1){
//	    listContenidoGeneralColab=[
//	       {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
//	       {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",
//		label:"<i class='fa fa-search'></i> Buscar Trabajador",
//	        inputForm:"<input class='form-control' id='inputTrabNombreEntregaEpp'>",divContainer:""},
//	       {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",
//	        label:"Trabajador asignado",inputForm:"",divContainer:"divSelTrabajadorEntregaEpp"},
//	       {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"¿Validado por DNI?",
//	        inputForm:"",divContainer:"divTextoResValidacionTrabEpp"},
//	       {sugerencia:"",clase:"atributo-actividad validacion-segundaParteTrabEpp",
//	        anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},     
//	       {sugerencia:"",clase:"atributo-actividad validacion-segundaParteTrabEpp",anchoLabel:"",anchoDiv:"",
//		label:"DNI del trabajador asignado",inputForm:"",divContainer:"divTextoDniTrabAsigEpp"},
//	       {sugerencia:"",clase:"atributo-actividad validacion-segundaParteTrabEpp",anchoLabel:"",anchoDiv:"",
//		label:"Foto - Trabajador asignado",inputForm:"",divContainer:"divFotoTrabajadorEntregaEpp"},
//	       {sugerencia:"",clase:"atributo-actividad",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
//	    ];
//	 }else{
            listContenidoGeneralColab=[
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Motivo",inputForm:"",divContainer:"divSelMotivoEntregaEppColab"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador responsable de la entrega",
                 inputForm:"<input type='text' id='inputTrabRespNombreEntregaEpp' class='form-control'>" +
                           "<div id='divSelTrabajadorRespEntregaEpp'></div>" +
                           "<label>*Buscar responsable por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador asignado",
                 inputForm:"<input type='text' id='inputTrabNombreEntregaEpp' class='form-control'>" +
                           "<div id='divSelTrabajadorEntregaEpp'></div>" +
                           "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
//	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Validado por DNI?",inputForm:"",divContainer:"divTextoResValidacionTrabEpp"},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"EPP's asignados",divContainer:"divInicioEppEntrega",inputForm:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de entrega",
	             inputForm:"<input type='date' id='dateActivdadMovil' class='form-control'>",divContainer:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora de entrega",
	             inputForm:"<input type='time' id='timeActivdadMovil' class='form-control'>",divContainer:""},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Descargar reporte?",inputForm:"",divContainer:"divSelWantsReporte"},
	            {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
	        ];
//	 }
	
	        callAjaxPost(URL+"/equiposeguridad/entrega/filtro",dataParam,procesarCamposEntregaEquipo);

            break;

        case 13://compra de equipo [pendiente de evaluación por la implementación hecha].
            var dataParam={
               idCompany:getSession("gestopcompanyid"),equipoSeguridadTipoId:2
            };

            listContenidoGeneralColab=[
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Motivo",inputForm:"",divContainer:"divSelMotivoCompraEquipoColab"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador responsable de la entrega",
                 inputForm:"<input type='text' id='inputTrabRespNombreEntregaEpp' class='form-control'>" +
                           "<div id='divSelTrabajadorRespEntregaEpp'></div>" +
                           "<label>*Buscar responsable por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Trabajador que recibe el equipo",
                 inputForm:"<input type='text' id='inputTrabNombreEntregaEpp' class='form-control'>" +
                           "<div id='divSelTrabajadorEntregaEpp'></div>" +
                           "<label>*Buscar trabajador(a) por DNI y/o nombre (debe ingresar 3 caracteres como mínimo) [obligatorio].</label>"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Equipo entregado",inputForm:"",divContainer:"divSelCompraEquipo"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Cantidad",inputForm:"<input type='number' id='inputCantidadCompraEquipoColab' class='form-control'>",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de entrega",inputForm:"<input type='date' id='dateActivdadMovil' class='form-control'>",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora",inputForm:"<input type='time' id='timeActivdadMovil' class='form-control'>",divContainer:""},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Descargar reporte?",inputForm:"",divContainer:"divSelWantsReporte"},
                {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""}
            ];

           callAjaxPost(URL+"/equiposeguridad/compra/filtro",dataParam,procesarCamposCompraEquipo);

           break;
   }
   
   $(".botones-actividadTrabGeneral").show();
   
//   if(parseInt(getSession("habilitarValidacion")) == 1){
//      if(tipoId == 5){
//         $(".botones-actividadTrabGeneral").hide();
//         $(".botones-actividadEntregaEppValidar").show();
//      }else{
//	 $(".botones-actividadTrabGeneral").show();
//	 $(".botones-actividadEntregaEppValidar").hide(); 
//      }
//   }
}

function cancelarNuevoEppEntrega(){
   $("#modalNuevaEppEntrega").modal("hide");
}

function verModalAgregarEppsEntrega(){
   $("#modalNuevaEppEntrega").remove();
   estadoModalRegistroEntregaEppPrincipal(0);
       
   var selEquipoEntregaEpp = crearSelectOneMenuOblig("selEquipoEntregaEpp","verTallasAcordeEppColab()",
      listEquiposEntregaEppColaborador,"","id","nombre");
    
   var list=[
      {sugerencia:"",label:"EPP",inputForm:""+selEquipoEntregaEpp,divContainer:""},
      {sugerencia:"",label:"Cantidad",
       inputForm:"<input value='1' class='form-control' type='number' id='cantidadNuevoEppColab'>",
       divContainer:""},
//    {sugerencia:"",label:"Talla",inputForm:"",divContainer:"divContainerTallaEpp"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
  	             "onclick='cancelarNuevoEppEntrega()'>" +
  	        "<i class='fa fa-times'></i> Cancelar" +
  	     "</button>",
       inputForm:"<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
       		         "onclick='guardarNuevoEppEntrega()'>" +
              	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
              	 "</button>"} 
   ];
   
   var contenido = "";
    
   list.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   var modalOptions={
      id: "modalNuevaEppEntrega",
      nombre: "Asignar EPP entrega",/*dontRemoveBack: true,*/
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
   
   $("#modalNuevaEppEntrega").on("hidden.bs.modal",function(){
      estadoModalRegistroEntregaEppPrincipal(1);
   });	
   //verTallasAcordeEppColab();
}

function verTallasAcordeEppColab(){
    return; // por ahora no es necesaario
    
   var dataparam={
      eppId:$("#selEquipoEntregaEpp").val()
   }
   
   callAjaxPost(URL+"/equiposeguridad/talla",dataparam,function(data){
      var selTallasEpp = crearSelectOneMenuOblig("selTallasEpp","",
         data.list,"", "id","nombre");
      $("#divContainerTallaEpp").html(selTallasEpp)
   });
}

var listEppsEntregarColab = [];

function guardarNuevoEppEntrega(){
   var eppId = parseInt($("#selEquipoEntregaEpp").val());
   var cantidad = parseInt($("#cantidadNuevoEppColab").val());
   var eppObj = listEquiposEntregaEppColaborador.filter(function(val){return val.id == eppId})[0];
   
   listEppsEntregarColab.push({epp: eppObj ,cantidad: cantidad});
    
   actualizarEppsEntregaEppColab();
}

function actualizarEppsEntregaEppColab(){
    var contenido = "", cantidadTotal = 0;
    
    listEppsEntregarColab.forEach(function(val,index){
        cantidadTotal += val.cantidad;

        contenido += obtenerSubPanelModuloGeneral({clase:"classContainerEpp atributo-actividad",sugerencia:"",label:"",
    	    inputForm:"<button onclick='eliminarEppEntregaColab("+index+")' class='btn btn-info'>" +
    	                  "<i class='fa fa-trash'></i>" +
    	              "</button> "+val.epp.nombre+" ("+val.cantidad+")",divContainer:""});
    });
    
    $("#divInicioEppEntrega").html("<button onclick='verModalAgregarEppsEntrega()' class='btn btn-success'>" +
                                       "<i class='fa fa-plus'></i>" +
                                   "</button> Total <strong>("+cantidadTotal+")</strong>");

    $(".classContainerEpp").remove();$("#divInicioEppEntrega").parent().after(contenido);
    
    cancelarNuevoEppEntrega();
}

function eliminarEppEntregaColab(pindex){
   listEppsEntregarColab = listEppsEntregarColab.filter(function(val,index){
      return index != parseInt(pindex);
   });
    
   actualizarEppsEntregaEppColab();
}

var listMotivoEntregaEppColaborador = [];
var listEquiposEntregaEppColaborador = [];

function procesarCamposEntregaEquipo(data){
    listMotivoEntregaEppColaborador = data.motivos;
    listEquiposEntregaEppColaborador = data.equipos;
    listEppsEntregarColab = [];
	   
    var selMotivoEntregaEpp = crearSelectOneMenuOblig("selMotivoEntregaEpp","",
        listMotivoEntregaEppColaborador,"","id","nombre");
	   
    var selWantsReporte = crearSelectOneMenuOblig("selWantsReporte","",listBoolean,"1","id","nombre");
	   
    var contenido = "";
	    	
    listContenidoGeneralColab.forEach(function(val){
        val.clase = "atributo-actividad";
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
		
    $("#divSelTipoActividad").parent().after(contenido);
    $("#divSelMotivoEntregaEppColab").html(selMotivoEntregaEpp);
    $("#divSelWantsReporte").html(selWantsReporte);
    $("#dateActivdadMovil").val(convertirFechaInputNoUTC(new Date()));
    $("#timeActivdadMovil").val(obtenerHoraActual());

    $("#inputTrabRespNombreEntregaEpp").val(getSession("gestopusername"));

    buscarResponsableProgEntregaEppVistaColab();buscarTrabajadorProgEntregaEppVistaColab();actualizarEppsEntregaEppColab();
}

var listRespBuscadorProgEntregaEppVistaColabAux = [];

function buscarResponsableProgEntregaEppVistaColab(){
    var nombre = $("#inputTrabRespNombreEntregaEpp").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listRespBuscadorProgEntregaEppVistaColabAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selResponsableProgEntregaEppVistaColab = crearSelectOneMenuOblig("selResponsableProgEntregaEppVistaColab",
                "",listRespBuscadorProgEntregaEppVistaColabAux,"","trabajadorId","nombre");

            $("#divSelTrabajadorRespEntregaEpp").html(selResponsableProgEntregaEppVistaColab);
            $("#inputTrabRespNombreEntregaEpp").attr("onkeyup","buscarResponsableProgEntregaEppVistaColab()");
        });
    }else{
        listRespBuscadorProgEntregaEppVistaColabAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selResponsableProgEntregaEppVistaColab = crearSelectOneMenuOblig("selResponsableProgEntregaEppVistaColab",
            "",listRespBuscadorProgEntregaEppVistaColabAux,"","trabajadorId","nombre");

        $("#divSelTrabajadorRespEntregaEpp").html(selResponsableProgEntregaEppVistaColab);
        $("#inputTrabRespNombreEntregaEpp").attr("onkeyup","buscarResponsableProgEntregaEppVistaColab()");
    }
}

var listTrabBuscadorProgEntregaEppVistaColabAux = [];

function buscarTrabajadorProgEntregaEppVistaColab(){
    var nombre = $("#inputTrabNombreEntregaEpp").val().trim();

    if(nombre.length >= 3){
        var dataParam={
            trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
            listTrabBuscadorProgEntregaEppVistaColabAux = (data.trabajadores.length == 0?[{trabajadorId:-1,nombre:"Sin asignar"}]:data.trabajadores);

            var selTrabajadorProgEntregaEppVistaColab = crearSelectOneMenuOblig("selTrabajadorProgEntregaEppVistaColab",
                "",listTrabBuscadorProgEntregaEppVistaColabAux,"","trabajadorId","nombre");

            $("#divSelTrabajadorEntregaEpp").html(selTrabajadorProgEntregaEppVistaColab);
            $("#inputTrabNombreEntregaEpp").attr("onkeyup","buscarTrabajadorProgEntregaEppVistaColab()");
        });
    }else{
        listTrabBuscadorProgEntregaEppVistaColabAux = [{trabajadorId:-1,nombre:"Sin asignar"}];

        var selTrabajadorProgEntregaEppVistaColab = crearSelectOneMenuOblig("selTrabajadorProgEntregaEppVistaColab",
            "",listTrabBuscadorProgEntregaEppVistaColabAux,"","trabajadorId","nombre");

        $("#divSelTrabajadorEntregaEpp").html(selTrabajadorProgEntregaEppVistaColab);
        $("#inputTrabNombreEntregaEpp").attr("onkeyup","buscarTrabajadorProgEntregaEppVistaColab()");
    }
}

var nombreTrabValidadoEntregaEpp,dniTrabValidadoEntregaEpp;

function procesarCamposEntregaEquipoTrabValidado(data){
   listMotivoEntregaEppColaborador = data.motivos;
   listEquiposEntregaEppColaborador = data.equipos;
   listEppsEntregarColab = [];
 	   
   var contenido = "";
 	    	
   listContenidoGeneralColab.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 		
   $("#divSelTipoActividad").parent().after(contenido);

   var optionsEvi={
      container: "#divFotoTrabajadorEntregaEpp",
      functionCall: function(){
         validacionSubirEvidencia("FotoTrabEntregaEpp",bitsImagenExterno,"modalNuevaActividad");
      },
      descargaUrl: "",esNuevo: true,
      idAux: "FotoTrabEntregaEpp",evidenciaNombre: ""
   };

   crearFormEvidenciaCompleta(optionsEvi);
 		
    verAcordeBuscarTrabajadorEntregaEpp();
}

var listTrabajadoresEntregaEppColaborador =[];

function verAcordeBuscarTrabajadorEntregaEpp(){
    var nombre = $("#inputTrabNombreEntregaEpp").val().trim();
		
    if(nombre == ""){
        nombre = null;
    }
	    
    var dataParam={
        trabajadorNombre:"%"+nombre+"%",empresaId:parseInt(getSession("gestopcompanyid")),isBuscador:1
    };
		
    callAjaxPostNoLoad(URL+"/trabajador/buscar/simple",dataParam,function(data){
        if(data.trabajadores.length == 0){
            data.trabajadores.push({trabajadorId:-1,nombre:"Sin asignar",puesto:{positionName:""}});
        }
			
        listTrabajadoresEntregaEppColaborador = data.trabajadores;
			
        var asd = crearSelectOneMenuOblig("selAutoTrabajadorEntregaEpp","resultadoValidacionTrabajadorEntregaEpp()",
            data.trabajadores,"","trabajadorId","nombre");
	       
        $("#divSelTrabajadorEntregaEpp").html(asd);
        $("#inputTrabNombreEntregaEpp").attr("onkeyup","verAcordeBuscarTrabajadorEntregaEpp()");
//      resultadoValidacionTrabajadorEntregaEpp();
    });
}

function resultadoValidacionTrabajadorEntregaEpp(){
   var trabajadorId = parseInt($("#selAutoTrabajadorEntregaEpp").val());
   var trabajadorEncontrado = 0;
   dniTrabValidadoEntregaEpp = 0;
   
   if(trabajadorId != -1){
      listTrabajadoresEntregaEppColaborador.forEach(function(val){
         if(trabajadorId == val.trabajadorId){
	    if(val.hasValidacion == 1){
	       nombreTrabValidadoEntregaEpp = val.nombre;
	       dniTrabValidadoEntregaEpp = val.dni;
	    }
	    
	    trabajadorEncontrado = 1;
         }	
      });
   }
   
   if(trabajadorEncontrado == 1 && dniTrabValidadoEntregaEpp != 0){
      $("#divTextoResValidacionTrabEpp").html("<label>Sí</label>");
      $("#divTextoDniTrabAsigEpp").html("<label>"+dniTrabValidadoEntregaEpp+"</label>"); 
      $(".validacion-segundaParteTrabEpp").show();
   }else{
      $("#divTextoResValidacionTrabEpp").html("<label>No</label>"); 
      $("#divTextoDniTrabAsigEpp").html("<label>------</label>");
      $(".validacion-segundaParteTrabEpp").hide();
   }
   
   $("#inputEviFotoTrabEntregaEpp").val("");
}

var nombrePadreTrabValidado,nombreMadreTrabValidado,fechaCumpleTrabValidado;

function autentificarTrabajadorEntregaEpp(){
   var campoVacio = true;
   
   var nombreFotoTrab = $("#inputEviFotoTrabEntregaEpp").val();
   
   if(dniTrabValidadoEntregaEpp == 0){
      campoVacio = false; 
      mensajeUx="<label>El colaborador aún no está validado." +
         "<br>Debe completar ese paso para poder autentificarse.</label>"; 
   }else if(nombreFotoTrab.length == 0 || nombreFotoTrab == "VOLVER A SUBIR"){
      campoVacio = false; 
      mensajeUx="<label>Debe subir la foto del colaborador y/o " +
         "volver a subirla para continuar.</label>";  
   }
    
   if(campoVacio){
   console.log(dniTrabValidadoEntregaEpp);
      var dataParamAux={
         dni: dniTrabValidadoEntregaEpp   
      };
      
      convertirImagenABase64("fileEviFotoTrabEntregaEpp",1,function(data1){
         dataParamAux.face = data1.EviBase64Aux;
         
	 var dataParamError={
	    esModal: 1, contenedorModal: "modalNuevaActividad"
	 };
	 
	 enviarParametrosExterno("https://umgqc5c4wf.execute-api.us-west-2.amazonaws.com" +
	 "/dev/certifications/verify-document-by-epp",dataParamAux,dataParamError,0,1,function(data){
	    console.log(data.statusCode);
	    $.unblockUI();$("#modalNuevaActividad").modal("hide");
	    var codigoValidacion = data.statusCode;
	    
	    switch(codigoValidacion){
	       case 101:  
		  var fechaAux = data.birthDate;
		  var anho = fechaAux.substring(0,4),mes = fechaAux.substring(4,6),dia = fechaAux.substring(6);
		  
		  nombrePadreTrabValidado = data.fatherName;nombreMadreTrabValidado = data.motherName;
		  fechaCumpleTrabValidado = dia+"/"+mes+"/"+anho;
		   
		  mensajeUx = "<label>La autentificación se realizó con éxito.</label>";
		  mensajesUx(mensajeUx,1,"","ActEventoVistaCol");
					    
		  $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
		     preguntaSecretaEntregaEquipoTrabValidado();
		  });
				
	          break;
	          
	       case 400: 
		  mensajeUx = "<label>No se alcanzó el porcentaje mínimo de autentificación." +
		     "<br><br>Revise que el trabajador seleccionado corresponde a la foto subida " +
		     "y/o vuelva a subir esto último antes de volver a intentarlo.</label>";
		  mensajesUx(mensajeUx,2,"","ActEventoVistaCol");
						    
		  $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
		     $("#modalNuevaActividad").modal("show");      
		  });
		   
		  break;
		    
	       default:
	          $.unblockUI();
                  console.log("Ocurrió un error al autentificar al colaborador!");
	    }
	 });
      });
   }else{
      $("#modalNuevaActividad").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
  	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalNuevaActividad").modal("show");    
      });   
   }
}

function ocultarPreguntaSecretaEntregaEquipoTrabValidado(){
   $("#modalPreguntaSecretaTrabValidado").modal("hide");     
}

function preguntaSecretaEntregaEquipoTrabValidado(){
   $("#modalPreguntaSecretaTrabValidado").remove();
   
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",
       label:"*Seleccione alguna de las preguntas clave cuya respuesta es dada por el colaborador: ",inputForm:""},                    
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"¿Cuál es el nombre de su padre? " +
          "<br>[Respuesta: "+nombrePadreTrabValidado+"]",
       inputForm:"<input type='checkbox' class='form-control' id='inputNombrePadreTrabValidado' " +
       		        "onclick='cambiarEstadoRespuestaPreguntaClaveTrabEpp(1)'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"¿Cuál es el nombre de su madre? " +
          "<br>[Respuesta: "+nombreMadreTrabValidado+"]",
       inputForm:"<input type='checkbox' class='form-control' id='inputNombreMadreTrabValidado' " +
       		        "onclick='cambiarEstadoRespuestaPreguntaClaveTrabEpp(2)'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"¿Cuál es su fecha de cumpleaños? " +
          "<br>[Respuesta: "+fechaCumpleTrabValidado+"]",
       inputForm:"<input type='checkbox' class='form-control' id='inputFechaCumpleTrabValidado' " +
       		        "onclick='cambiarEstadoRespuestaPreguntaClaveTrabEpp(3)'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"col-sm-10",anchoDiv:"col-sm-2",
       label:"**En caso no recuerde algunas de las respuestas anteriores, seleccione esta opción para " +
       	      "registrar la observación respectiva.",
       inputForm:"<input type='checkbox' class='form-control' id='inputObservacionTrabValidado' " +
       		        "onclick='cambiarEstadoRespuestaPreguntaClaveTrabEpp(4)'>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",
       label:"Observación:<br><span id='auxObservacionTrabValidado'></span>",
       inputForm:"<textarea id='textAreaObservacionTrabValidado' class='form-control' rows='5'></textarea>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
  	             "onclick='ocultarPreguntaSecretaEntregaEquipoTrabValidado()'>" +
  	        "<i class='fa fa-times'></i> Cancelar" +
  	     "</button>",
       inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
              	    "<i aria-hidden='true' class='fa fa-arrow-right'></i> Siguiente" +
              	 "</button>"} 
   ];
       
   var textFormRegistro = "";
    	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
     
   var opciones={
      id: "modalPreguntaSecretaTrabValidado",
      nombre: "Pregunta secreta - Colaborador(a) "+nombreTrabValidadoEntregaEpp,
      contenido: "<form id='formPregSecTrabVal' class='eventoGeneral'>"+textFormRegistro+"</form>"
   };
       
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   cambiarEstadoRespuestaPreguntaClaveTrabEpp(0);
   
   var editarDiv = $("#formPregSecTrabVal");
   
   editarDiv.on('submit',function(e){  
      e.preventDefault();
      confirmarPreguntaSecretaEntregaEquipoTrabValidado();
   }); 
}

function cambiarEstadoRespuestaPreguntaClaveTrabEpp(opcion){
   var opcionAux = parseInt(opcion);
   var checkNombrePadre = document.querySelector('#inputNombrePadreTrabValidado');    
   var checkNombreMadre = document.querySelector('#inputNombreMadreTrabValidado');   
   var checkFechaCumple = document.querySelector('#inputFechaCumpleTrabValidado');   
   var checkObservacion = document.querySelector('#inputObservacionTrabValidado');   
   var textObservacion = document.querySelector('#textAreaObservacionTrabValidado'); 
   
   if(opcionAux == 1 && checkNombrePadre.checked){
      checkNombreMadre.checked = false;checkFechaCumple.checked = false;
      checkObservacion.checked = false;
      
      $("#textAreaObservacionTrabValidado").val("");
      textObservacion.disabled = true;
      document.querySelector('#auxObservacionTrabValidado').innerText = "";   
   }else if(opcionAux == 2 && checkNombreMadre.checked){
      checkNombrePadre.checked = false;checkFechaCumple.checked = false;
      checkObservacion.checked = false; 
      
      $("#textAreaObservacionTrabValidado").val("");
      textObservacion.disabled = true;
      document.querySelector('#auxObservacionTrabValidado').innerText = "";   
   }else if(opcionAux == 3 && checkFechaCumple.checked){
      checkNombrePadre.checked = false;checkNombreMadre.checked = false;
      checkObservacion.checked = false; 
      
      $("#textAreaObservacionTrabValidado").val("");
      textObservacion.disabled = true;
      document.querySelector('#auxObservacionTrabValidado').innerText = "";   
   }else if(opcionAux == 4 && checkObservacion.checked){
      checkNombrePadre.checked = false;checkNombreMadre.checked = false;
      checkFechaCumple.checked = false;
       
      $("#textAreaObservacionTrabValidado").val("");
      textObservacion.disabled = false;
      document.querySelector('#auxObservacionTrabValidado').innerText = "(obligatorio)";   
      document.getElementById('auxObservacionTrabValidado').style.color = "red"; 
   }else if(opcionAux == 0 || (!checkNombrePadre.checked && !checkNombreMadre.checked && 
      !checkFechaCumple.checked && !checkObservacion.checked)){
      $("#textAreaObservacionTrabValidado").val("");
      textObservacion.disabled = true;
      document.querySelector('#auxObservacionTrabValidado').innerText = "";
   }
}

var observacionConfirmacionTrabEpp;

function confirmarPreguntaSecretaEntregaEquipoTrabValidado(){
   var campoVacio = true;
   
   var respNombrePadre = ($("#inputNombrePadreTrabValidado").prop("checked")?1:0);
   var respNombreMadre = ($("#inputNombreMadreTrabValidado").prop("checked")?1:0);
   var respFechaCumple = ($("#inputFechaCumpleTrabValidado").prop("checked")?1:0);
   var respObservacion = ($("#inputObservacionTrabValidado").prop("checked")?1:0);
   var observacionAux = $("#textAreaObservacionTrabValidado").val();
   
   if(respNombrePadre == 0 && respNombreMadre == 0 && respFechaCumple == 0 && respObservacion == 0){
      campoVacio = false;
      mensajeUx="<label>Debe seleccionar una de las preguntas clave habilitadas.</label>";
   }else if(respObservacion == 1 && observacionAux.length == 0){
      campoVacio = false;
      mensajeUx="<label>Debe ingresar la observación respectiva para continuar.</label>";
   }
   
   if(campoVacio){ 
      observacionConfirmacionTrabEpp = (respNombrePadre == 1?"Nombre del padre":(respNombreMadre == 1?
         "Nombre de la madre":(respFechaCumple == 1?"Fecha de cumpleaños":observacionAux)));
      
      $("#modalPreguntaSecretaTrabValidado").modal("hide");
      
      registroEntregaEquipoEppTrabValidado(); 
   }else{
      $("#modalPreguntaSecretaTrabValidado").modal("hide");
       
      mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
  	       
      $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
         $("#modalPreguntaSecretaTrabValidado").modal("show");    
      });   
   }
}

function ocultarRegistroEntregaEquipoEppTrabValidado(){
   $("#modalEntregaEquipoEppTrabValidado").modal("hide");     
}

function registroEntregaEquipoEppTrabValidado(){
   $("#modalEntregaEquipoEppTrabValidado").remove();
   
   var selMotivoEntregaEpp = crearSelectOneMenuOblig("selMotivoEntregaEpp","",
      listMotivoEntregaEppColaborador,"","id","nombre");
		   
   var selWantsReporte = crearSelectOneMenuOblig("selWantsReporte","",
      listBoolean,"1","id","nombre");
		   
   var listItemsRegistro=[
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Trabajador(a) asignado(a)",inputForm:nombreTrabValidadoEntregaEpp},          
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"Pregunta clave:",inputForm:observacionConfirmacionTrabEpp},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Motivo",inputForm:selMotivoEntregaEpp},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"EPP's asignados",
       divContainer:"divInicioEppEntrega",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Fecha de entrega",
       inputForm:"<input type='date' id='dateActivdadMovil' class='form-control'>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hora de entrega",
       inputForm:"<input type='time' id='timeActivdadMovil' class='form-control'>",divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"¿Descargar reporte?",inputForm:selWantsReporte},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' style='font-size:18px;' type='button' " +
	             "onclick='ocultarRegistroEntregaEquipoEppTrabValidado()'>" +
	        "<i class='fa fa-times'></i> Cancelar" +
	     "</button>",
       inputForm:"<button type='button' class='btn btn-success' style='float:right;font-size:18px;' " +
       		         "onclick='guardarNuevaActividadColaborador()'>" +
           	    "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
           	 "</button>"} 
   ];
    
   var textFormRegistro = "";
 	
   listItemsRegistro.forEach(function(val,index){
      textFormRegistro += obtenerSubPanelModuloVersionDos(val);
   });
  
   var opciones={
      id: "modalEntregaEquipoEppTrabValidado",
      nombre: "Entrega Epp - Colaborador(a) "+nombreTrabValidadoEntregaEpp,
      contenido: "<div class='eventoGeneral'>"+textFormRegistro+"</div>"
   };
    
   crearModalPrincipalUsuario(opciones,function(){},true,true);
   
   $("#dateActivdadMovil").val(convertirFechaInputNoUTC(new Date()));
   $("#timeActivdadMovil").val(obtenerHoraActual());

   actualizarEppsEntregaEppColab();
}

function verAcordeTipoCategoriaFormacionColaborador(){
   var tipoFormacionId = parseInt($("#selTipoFormacion").val());
   var categoriaFormacionId = parseInt($("#selCategoriaFormacion").val());

   var selFormacion = crearSelectOneMenuOblig("selFormacion","",listFormacionColaborador.filter(function(val){
      return val.capacitacionTipoId == tipoFormacionId && val.categoriaCapacitacion.id == categoriaFormacionId
   }),"","capacitacionId","capacitacionNombreLong");
    
   $("#divSelFormacion").html(selFormacion);
}

function procesarCamposInspeccion(data){
    var contenido = "";
    
    listContenidoGeneralColab.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });
 	
    listTipoAuditoriaColaborador = data.tipos;listClasificacionAuditoriaColaborador = data.clasificaciones;
    listUnidadesEvento = data.listUnidadesEvento;listDivisionesEvento = data.listDivisionesEvento;listAreasEvento = data.listAreasEvento;
   // listAreasAuditoriaColaborador = data.listAreasFiltrar;

    $("#divSelTipoActividad").parent().after(contenido);

    $("#lugarActivdadMovil").val("");$("#dateActivdadMovil").val(convertirFechaInputNoUTC(new Date()));
    $("#timeActivdadMovil").val(obtenerHoraActual());
   
    if(parseInt(getSession("gestopcompanyid")) == 647){
        var listClasificacionAux = [];
      
        listClasificacionAuditoriaColaborador.forEach(function(val){
	        if(val.id == 2){
	            listClasificacionAux.push(val);
	        }
        });
	  
        listClasificacionAuditoriaColaborador = listClasificacionAux;
    }
 	
    var selClasificacionAudiColab = crearSelectOneMenuOblig("selClasificacionAudiColab",
        "verAcordeClasificacionAuditoriaColaborador()",listClasificacionAuditoriaColaborador,"2","id","nombre");

    $("#divSelClasificacionAudiColab").html(selClasificacionAudiColab);

    verAcordeClasificacionAuditoriaColaborador();

    if(parseInt(getSession("gestopcompanyid")) == 500){
        var selUnidadEventoInspeccion = crearSelectOneMenu("selUnidadEventoInspeccion","filtrarDivisionesSegunUnidadEventoInspeccion()",
            listUnidadesEvento,(parseInt(getSession("gestopcompanyid")) == 500?"927":"-1"),"id","nombre",(listUnidadesEvento.length == 0?"Sin unidades registradas":null));

        $("#divSelUnidadEvent").html(selUnidadEventoInspeccion);

        filtrarDivisionesSegunUnidadEventoInspeccion();
    }

    if(numAreasResponsable == 0){
        $(".campos-programacionInspeccion").hide();
    }
}

function verAcordeClasificacionAuditoriaColaborador(){
    var clasificacionid = parseInt($("#selClasificacionAudiColab").val());
    
    var selTipoAudiColab = crearSelectOneMenuOblig("selTipoAudiColab","",
        listTipoAuditoriaColaborador.filter(function(val){
            return val.clasificacion.id == clasificacionid
        }),"","id","nombre");

    $("#divSelTipoAudiColab").html(selTipoAudiColab);
}

var selDivisionEventoInspeccion,selAreaEventoInspeccion,textoAdicional,textoSelectVacioAux1,textoSelectVacioAux2;

function filtrarDivisionesSegunUnidadEventoInspeccion(){
    var listDivisionEventoInspeccionAux = [];selDivisionEventoInspeccion = "";

    textoSelectVacioAux1 = ([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sedes":"divisiones");
    textoSelectVacioAux2 = (parseInt(getSession("gestopcompanyid")) == 714?"el país - empresa seleccionado":"la unidad seleccionada");

    var unidadIdAux = parseInt($("#selUnidadEventoInspeccion").val());

    if(listDivisionesEvento.length != 0 && unidadIdAux != -1){
        listDivisionesEvento.forEach(function(val){
            if(val.matrixId == unidadIdAux){
                listDivisionEventoInspeccionAux.push(val);
            }
        });

        selDivisionEventoInspeccion = crearSelectOneMenu("selDivisionEventoInspeccion","filtrarAreasSegunDivisionEventoInspeccion()",listDivisionEventoInspeccionAux,
            (parseInt(getSession("gestopcompanyid")) == 500?"2430":""),"divisionId","divisionName",(listDivisionEventoInspeccionAux.length == 0?"Sin "+textoSelectVacioAux1+" asociadas":null));

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(unidadIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" para seleccionar")+".</small>";
    }

    $("#divSelDivisionEvent").html(selDivisionEventoInspeccion+textoAdicional);

    filtrarAreasSegunDivisionEventoInspeccion();
}

function filtrarAreasSegunDivisionEventoInspeccion(){
    var listAreaEventoInspeccionAux = [];selAreaEventoInspeccion = "";

    textoSelectVacioAux1 = (parseInt(getSession("gestopcompanyid")) == 714?"áreas - procesos":"áreas");
    textoSelectVacioAux2 = "la "+([714,716].includes(parseInt(getSession("gestopcompanyid")))?"sede":"división")+" seleccionada";

    var divisionIdAux = (selDivisionEventoInspeccion.length == 0?-1:parseInt($("#selDivisionEventoInspeccion").val()));

    if(listAreasEvento.length != 0 && divisionIdAux != -1){
        listAreasEvento.forEach(function(val){
            if(val.divisionId == divisionIdAux){
                listAreaEventoInspeccionAux.push(val);
            }
        });

        if(listAreaEventoInspeccionAux.length > 0){
            selAreaEventoInspeccion = crearSelectOneMenuObligMultipleCompleto("selAreaEventoInspeccion","",
                listAreaEventoInspeccionAux,"areaId","areaNameShort","#divSelAreaEvent","Todos");
        }else{
            $("#divSelAreaEvent").html("<label>Sin "+textoSelectVacioAux1+" con responsables</label><br>");
        }

        textoAdicional = "<small style='font-weight:bold;'>*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2+".</small>";

        $("#divSelAreaEvent").append(textoAdicional);
    }else{
        textoAdicional = "<small style='font-weight:bold;'>"+(divisionIdAux == -1?"*Las "+textoSelectVacioAux1+" se muestran según "+textoSelectVacioAux2:
            "<small style='font-weight:bold;'>*No hay "+textoSelectVacioAux1+" con responsables para seleccionar")+".</small>";

        $("#divSelAreaEvent").html(selAreaEventoInspeccion+textoAdicional);
    }
}

function procesarCamposFormacion(data){
   listTipoFormacionColaborador = data.listTipo;
   listFormacionColaborador = data.listCaps;
   listCategoriaFormacionColaborador = data.listCategorias;
	   
   var selTipoFormacion = crearSelectOneMenuOblig("selTipoFormacion","verAcordeTipoCategoriaFormacionColaborador()",
      listTipoFormacionColaborador,"","id","nombre");
	   
   var selCategoriaFormacion = crearSelectOneMenuOblig("selCategoriaFormacion","verAcordeTipoCategoriaFormacionColaborador()",
      listCategoriaFormacionColaborador,"","id","nombre");
	   
   var contenido = "";
	    	
   listContenidoGeneralColab.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
		
   $("#divSelTipoActividad").parent().after(contenido);
   $("#divSelTipoFormColab").html(selTipoFormacion);
   $("#divSelCategoriaFormacion").html(selCategoriaFormacion);
   $("#inputDescripcionActivdadMovil").val("Nuevo evento");
   $("#dateActivdadMovil").val(convertirFechaInputNoUTC(new Date()));
   $("#timeActivdadMovil").val(obtenerHoraActual());
		
   verAcordeTipoCategoriaFormacionColaborador();
   
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),hasLimit:0
   };
		
   callAjaxPost(URL+"/trabajador/buscar",dataParam,function(data1){
      listTrabajadoresColaborador = data1.trabajadores;
		    
      crearSelectOneMenuObligMultipleCompleto("selMultipleTrabFormacion","",listTrabajadoresColaborador,
	 "trabajadorId","nombre","#divTrabFormacion","Seleccionar...");
			
      var options={
	 container:"#divListaTrabFormacion",functionCall:function(){
	    verificarDocumentoTrabajadoresFormacion();
	 },descargaUrl:"",esNuevo:true,idAux:"ListaTrabajadorForm",evidenciaNombre:""
      };
			
      crearFormEvidenciaCompleta(options);
			
      $("#divListaTrabFormacion").append(
         "<a class='efectoLink' target='_blank' href='"+URL+"/trabajador/formato/dni'>" +
            "<i class='fa fa-download'></i> Descargar formato lista" +
         "</a>");		
   });
}

function verificarDocumentoTrabajadoresFormacion(){
   guardarEvidenciaAuto(0,"fileEviListaTrabajadorForm",bitsEvidenciaExamen,
   "/trabajador/formato/dni/analizar",function(data){
      if(data.CODE_RESPONSE == "05"){
         if(data.trabajadores == null){
	    alert("Archivo no compatible");return;
         }
		
         var numSelected = 0;
		
         listTrabajadoresColaborador.forEach(function(val){
            val.selected = 0;
			
            data.trabajadores.forEach(function(val1){
	       if(val.trabajadorId == val1.trabajadorId){
		  numSelected++;
		  val.selected = 1;
	       } 
            });
         });
		
         var slcTrabajadoresExamen = crearSelectOneMenuObligMultipleCompleto("selMultipleTrabFormacion","",
	    listTrabajadoresColaborador,"trabajadorId","nombre","#divTrabFormacion","Seleccionar...");
		
         alert(numSelected+" trabajador(es) asociado(s)")
      }else{
	 alert("Archivo no compatible");
      }
   },"",[{id:"trabajadorId",value:getSession("trabajadorGosstId")}]);
}

function procesarCamposCompraEquipo(data){
    var selMotivoCompraEquipo = crearSelectOneMenuOblig("selMotivoCompraEquipo","",
        data.motivos,"","motivoId","motivoNombre");

    var selCompraEquipo = crearSelectOneMenuOblig("selCompraEquipo","",
        data.equipos,"","id","nombre");

    var selWantsReporte = crearSelectOneMenuOblig("selWantsReporte","",
        listBoolean,"","id","nombre");

    var contenido = "";

    listContenidoGeneralColab.forEach(function(val){
        val.clase = "atributo-actividad";
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    $("#divSelTipoActividad").parent().after(contenido);
    $("#divSelMotivoCompraEquipoColab").html(selMotivoCompraEquipo);
    $("#divSelCompraEquipo").html(selCompraEquipo);
    $("#divSelWantsReporte").html(selWantsReporte);
    $("#selWantsReporte").val(0).prop("disabled",true);
    $("#dateActivdadMovil").val(convertirFechaInputNoUTC(new Date()));
    $("#timeActivdadMovil").val(obtenerHoraActual());

    $("#inputTrabRespNombreEntregaEpp").val(getSession("gestopusername"));

    buscarResponsableProgEntregaEppVistaColab();buscarTrabajadorProgEntregaEppVistaColab();
}

function guardarNuevaActividadColaborador(){
    var dataParam = {};
    
   var fechaPlanificada = convertirFechaTexto($("#dateActivdadMovil").val());
   var horaPlanificada = $("#timeActivdadMovil").val();
   var tipoId = parseInt($("#selTipoActividadMovil").val());
   var nombreTipoAudi;
    
   listTipoAuditoriaColaborador.forEach(function(val){
      if(val.id == $("#selTipoAudiColab").val()){
	 nombreTipoAudi = val.nombre;
      }
   });
    
   var trabsPlanificados = [];
   var lugar = $("#lugarActivdadMovil").val();

   if($("#selClasificacionAudiColab").val() == 2){
      var auditoriaNombre = "Inspeccion - "+nombreTipoAudi+" - "+getSession("gestopusername");
   }else{
      var auditoriaNombre = "Auditoría - "+nombreTipoAudi+" - "+getSession("gestopusername");
   }
    
    switch(tipoId){
        case 10:
            var campoVacio = true;

	        var respuestaInspecPlanId = parseInt($("#selRespPlanificado").val());
	        var auditoriaTipo = parseInt($("#selTipoAudiColab").val());

            var listAreasAd= [];

            if(parseInt(getSession("gestopcompanyid")) == 500){
                var listAreasAux = $("#selAreaEventoInspeccion").val();

                if(listAreasAux != null){
                    listAreasAux.forEach(function(val,index){
                        listAreasAd.push({areaId:parseInt(val)});
                    });
                }
            }else{
                listAreasAd.push({areaId:parseInt(getSession("areaGosstId"))});
            }

            if(listAreasAd.length == 0){
                campoVacio = false;mensajeUx = "<label>Debe seleccionar al menos un área.</label>";
            }

            if(campoVacio){
	            dataParam={
	                auditoriaId:0,auditoriaNombre:auditoriaNombre,auditoriaTipo:auditoriaTipo,trabajador:{trabajadorId:getSession("trabajadorGosstId")},
	                horaPlanificada:horaPlanificada,fechaPlanificada:fechaPlanificada,estadoImplementacion:1,inversionAuditoria:0,lugar:lugar,listAreas:listAreasAd,
	                observacion: $("#textObservacionAudiColab").val(),respInspeccPlanificada: respuestaInspecPlanId,
	                idCompany: getSession("gestopcompanyid")
                };

	            getLocation(function(){
	                dataParam.posicion={
	                    x:posicionX,y:posicionY
	                };

	                callAjaxPost(URL+"/auditoria/save",dataParam,function(data){
	                    $("#modalNuevaActividad").modal("hide");

                        if(![94,194,300,303,304].includes(auditoriaTipo) && parseInt(getSession("gestopcompanyid")) != 739){
                            mensajeUx="<label>El evento fue registrado con éxito.<label>" +
                                "<br><label>¿Desea empezar '"+nombreTipoAudi+"' de inmediato?</label>";
                            mensajesUx(mensajeUx,9,"","RespEmpezarInspecc");

                            $("#modalNuevaActividad").remove();

                            $("#btnDevolverValorRespEmpezarInspecc").on("click",function(){
                                directoRealizarInspeccionMovilGenV3(data.nuevoId);
                            });

                            $("#btnRegresarPrevioRespEmpezarInspecc").on("click",function(){
                                traerEventosTrabajador();
                            });
                        }else if(auditoriaTipo == 300 || auditoriaTipo == 303 || auditoriaTipo == 304){
	                        mensajeUx="<label>El evento fue registrado con éxito.<label>";
  	                        mensajesUx(mensajeUx,1,"","ActEventoVistaCol");

  	                        $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
  		                        $("#modalNuevaActividad").remove();traerEventosTrabajador();
  	                        });
	                    }else{
		                    mensajeUx="<label>El evento fue registrado con éxito.<label>" +
		                        "<br><label>¿Desea empezar '"+nombreTipoAudi+"' de inmediato?</label>";
	  	                    mensajesUx(mensajeUx,9,"","RespEmpezarInspecc");

	  	                    $("#modalNuevaActividad").remove();

	                        $("#btnDevolverValorRespEmpezarInspecc").on("click",function(){
	                            accesoDirectoRealizarInspeccionMovil(data.nuevoId,auditoriaTipo,1);
	                        });

	                        $("#btnRegresarPrevioRespEmpezarInspecc").on("click",function(){
	                            traerEventosTrabajador();
	                        });
	                    }
	                });
	            });
            }else{
                estadoModalRegistroEntregaEppPrincipal(0);

                mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");

                $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
                    estadoModalRegistroEntregaEppPrincipal(1);
                });
            }
	  
	        break;
	
      case 3:
	 var trabsPrev = $("#selMultipleTrabFormacion").val();
	 var trabsFinal = [];
	 
	 var capId = parseInt($("#selFormacion").val());
	
	 if(!capId > 0){
	    alert("Capacitación obligatoria");return;
	 }
	
	 if(trabsPrev != null){
	    trabsPrev.forEach(function(val){
	       trabsFinal.push(parseInt(val)); 
	    });   
	 }
	
	 dataParam={
	    programacionCapId: 0,
	    isFromColaborador: 1,
	    tiempoSolucion: $("#inputTiempoEvFormacion").val(),
	    descripcion: $("#inputDescripcionEvFormacion").val(),
	    capacitacionId: capId,
	    responsableId: getSession("trabajadorGosstId"),responsable:"",
	    horaPlanificada: horaPlanificada,
	    fechaPlanificada: fechaPlanificada,
	    progCapEstado: 1,
	    inversionProgramacionCap: 0,
	    trabajadoresPlanificados: trabsFinal,
	    tipoNotaTrabId: 1
	 };
	 
	 callAjaxPost(URL+"/capacitacion/programacion/save",dataParam,function(){
	    alert("Evento guardado");
	    cancelarNuevaActividadColaborador();
	    traerEventosTrabajador();
	 });
	 
	 break;
	 
        case 5:
	        var campoVacio = true;
	  
	        var motivoId = $("#selMotivoEntregaEpp").val();
	        var trabajadorId = parseInt($("#selTrabajadorProgEntregaEppVistaColab").val());
	
	        if(trabajadorId == -1){
	            campoVacio = false;mensajeUx = "<label>Debe seleccionar al trabajador asignado.</label>";
	        }

            var trabsFinal = [trabajadorId];

            var trabajadorResponsableId = parseInt($("#selResponsableProgEntregaEppVistaColab").val());

            if(trabajadorResponsableId == -1){
                campoVacio = false;mensajeUx = "<label>Debe seleccionar al trabajador responsable.</label>";
            }
	 
	        var eppsEntrega = listEppsEntregarColab.map(function(val){
	            return {id:val.epp.id,cantidad:val.cantidad};
	        });
	
	        if(listEppsEntregarColab.length == 0){
	            campoVacio = false;mensajeUx = "<label>Debe seleccionar al menos un EPP.</label>";
	        }
	 
	        if(campoVacio){
	            dataParam={
	                entregaEppId:0,isFromColaborador:1,equiposObj:eppsEntrega,idCompany:getSession("gestopcompanyid"),
	                trabajadorResponsable:{trabajadorId:trabajadorResponsableId},motivoId:motivoId,horaPlanificada:horaPlanificada,
                    fechaPlanificada:fechaPlanificada,fechaEntrega:fechaPlanificada,estadoImplementacion:2,inversionEntregaEpp:0,
	                trabajadores:trabsFinal,trabajadorRegistroId:parseInt(getSession("trabajadorGosstId"))
	            };
	 
//	    if(parseInt(getSession("habilitarValidacion")) == 1){
//	       dataParam.preguntaClave = observacionConfirmacionTrabEpp;
//	       
//	       callAjaxPostSimple(URL+"/equiposeguridad/entrega/save",dataParam,1,function(data){
//		  $("#modalEntregaEquipoEppTrabValidado").modal("hide");
//		   
//		  var conectarConApi = 0,telefonoEnviarMsm = "";
//			 
//		  listTrabajadoresEntregaEppColaborador.forEach(function(val){
//	             if(trabajadorId == val.trabajadorId && val.hasValidacion == 1 && 
//			val.telefono.length == 9){
//			conectarConApi = 1;telefonoEnviarMsm = val.telefono;
//	             }	
//		  });
//		     
//		  var dataParamAux={};
//		  
//		  if(conectarConApi == 1){
//		     var contenidoSms = "Estimado usuario, en el siguiente enlace, se encuentra la " +
//		     	"lista de EPP entregados:" +
//		     	"<br> "+URL+"/public/entrega_epp/informe?entregaEppId="+data.nuevoId+" "+"<br>"; 
//		      
//		     dataParamAux = {cellNumber: telefonoEnviarMsm,messageText: contenidoSms};
//		  }
//		 
//		  var dataParamError={
//		     esModal: 1, contenedorModal: "modalEntregaEquipoEppTrabValidado"
//		  };
//		 
//		  console.log(conectarConApi); 
//		   
//	          enviarParametrosExterno("https://umgqc5c4wf.execute-api.us-west-2.amazonaws.com" +
//		  "/dev/certifications/sms-certificate",dataParamAux,dataParamError,0,conectarConApi,function(data4){
//	             $.unblockUI(); 
//		       
//	             var mensajeMsm = (conectarConApi == 0?"":
//		        "<br><br>(se envió un sms al teléfono '"+telefonoEnviarMsm+"')");
//			
//	             if(parseInt($("#selWantsReporte").val()) == 0){
//		        mensajeUx="<label>Evento guardado con éxito."+mensajeMsm+"<label>";
//	             }else{
//		        mensajeUx="<label>Evento guardado con éxito, se descargará " +
//		           "el reporte de inmediato."+mensajeMsm+"<label>";
//		          
//		        window.open(URL+"/equiposeguridad/informe?entregaEppId="+data.nuevoId);
//	             }
//		
//	             mensajesUx(mensajeUx,1,"","ActEventoVistaCol");
//		       
//	             $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
//	                traerEventosTrabajador();
//	             });
//		  });
//	       });
//            }else{
    	        callAjaxPost(URL+"/equiposeguridad/entrega/save",dataParam,function(data){
    	            $("#modalNuevaActividad").modal("hide");
    		
    	            if(parseInt($("#selWantsReporte").val()) == 0){
    	                mensajeUx="<label>Evento guardado con éxito.<label>";
    	            }else{
    	                mensajeUx="<label>Evento guardado con éxito, se descargará el reporte de inmediato.<label>";
    	          
    	                window.open(URL+"/equiposeguridad/informe?entregaEppId="+data.nuevoId);
    	            }
    	
      	            mensajesUx(mensajeUx,1,"","ActEventoVistaCol");
    	       
      	            $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
    	                traerEventosTrabajador();
      	            });
    	        });
//            }
	        }else{
	            estadoModalRegistroEntregaEppPrincipal(0);
		       
	            mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");
	  	       
	            $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
	                estadoModalRegistroEntregaEppPrincipal(1);
	            });
	        }
	
	        break;

        case 13:
            var campoVacio = true;

            var motivoId = $("#selMotivoCompraEquipo").val();
            var trabajadorId = parseInt($("#selTrabajadorProgEntregaEppVistaColab").val());

            if(trabajadorId == -1){
                campoVacio = false;mensajeUx = "<label>Debe seleccionar al trabajador que recibe el equipo.</label>";
            }

            var trabajadorResponsableId = parseInt($("#selResponsableProgEntregaEppVistaColab").val());

            if(trabajadorResponsableId == -1){
                campoVacio = false;mensajeUx = "<label>Debe seleccionar al responsable.</label>";
            }

            var equipoId = $("#selCompraEquipo").val();
            var cantidad = $("#inputCantidadCompraEquipoColab").val();

            if(campoVacio){
                dataParam={
                    id:0,trabajadorRecibio:{trabajadorId:trabajadorId},trabajadorResponsable:{trabajadorId:trabajadorResponsableId},
                    motivoId:motivoId,eppId:equipoId,horaPlanificada:horaPlanificada,fechaPlanificada:fechaPlanificada,fechaReal:fechaPlanificada,
                    cantidad:cantidad,estadoImplementacion:2,inversion:0
                };

                callAjaxPost(URL+"/equiposeguridad/compra/save",dataParam,function(data){
                    $("#modalNuevaActividad").modal("hide");

                // if(parseInt($("#selWantsReporte").val()) == 0){
                    mensajeUx="<label>Evento guardado con éxito.<label>";
                // }else{
                //     mensajeUx="<label>Evento guardado con éxito, se descargará el reporte de inmediato.<label>";
                //
                //     window.open(URL+ "/equiposeguridad/compra/informe?id="+data.nuevoId);
                // }

                    mensajesUx(mensajeUx,1,"","ActEventoVistaCol");

                    $("#modalMensajeUxActEventoVistaCol").on("hidden.bs.modal",function(){
                        traerEventosTrabajador();
                    });
                });
            }else{
                estadoModalRegistroEntregaEppPrincipal(0);

                mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");

                $("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
                    estadoModalRegistroEntregaEppPrincipal(1);
                });
            }

            break;
    }
}

function estadoModalRegistroEntregaEppPrincipal(estadoAux){
   var estado = (parseInt(estadoAux) == 1?"show":"hide"); 
   
   $("#modalNuevaActividad").modal(estado);
    
//   if(parseInt(getSession("habilitarValidacion")) == 1){
//      $("#modalEntregaEquipoEppTrabValidado").modal(estado);
//   }else{
//      $("#modalNuevaActividad").modal(estado);  
//   }	    
}

var listUnidades = [],listDivisiones = [],listAreas = [];
var listUnidadesFiltro = [],listDivisionesFiltro = [],listAreasFiltro = [];
var listPuestosAsignados = [];
var hashAsigPuestosTrab = new Map();

function regresarFiltroAsignacionPuestoTrabajador(){
   hashAsigPuestosTrab = new Map(); 
    
   listPuestosAsignados.forEach(function(val){
      var isAsignado = ($("#checkAsigPuestoTrab"+val.positionId).prop("checked")?1:0);
	          
      if(isAsignado == 1){
	 hashAsigPuestosTrab.set(val.positionId,1);  
      }
   });	
   
   $("#modalAsigPuestoTrab").modal("hide");$("#modalNuevaActividad").modal("show");
   
   listTrabajadoresColaborador.forEach(function(val){
      val.selected = (hashAsigPuestosTrab.get(val.puesto.positionId) == 1?1:0);
   });
	
   crearSelectOneMenuObligMultipleCompleto("selMultipleTrabFormacion","",
      listTrabajadoresColaborador,"trabajadorId","nombre","#divTrabFormacion","Seleccionar...");
}

function ocultarFiltroAsignacionPuestoTrabajador(){
   $("#modalFiltroAsigPuestoTrab").modal("hide");$("#modalAsigPuestoTrab").modal("show"); 
}

function verFiltroAsignacionPuestoTrabajador(){
   $("#modalAsigPuestoTrab").modal("hide");$("#modalFiltroAsigPuestoTrab").modal("show");
}

function crearFiltroAsignacionPuestoTrabajador(){
   if(nuevoRegAsigPuestoTrab == 0){
      $(".filtro-despliegue-conectado").remove();
   } 
   
   var dataParamAux={
      companyId:parseInt(getSession("gestopcompanyid"))
   }; 

   callAjaxPost(URL+'/trabajador/asignacion_puesto/filtro',dataParamAux,function(data){
      listUnidades = data.listUnidades,listDivisiones = data.listDivisiones,listAreas = data.listAreas;
					
      var contenido = "";
					
      var listContenido=[
         {sugerencia:"",label:"Unidad",inputForm:"",divContainer:"divFiltroUnidad"},
         {sugerencia:"",label:"Division",inputForm:"",divContainer:"divFiltroDivision"},
         {sugerencia:"",label:"Área",inputForm:"",divContainer:"divFiltroArea"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",
	  label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroAsignacionPuestoTrabajador()' " +
	  		"style='font-size:18px;'>" +
		   "<i class='fa fa-times'></i> Cancelar" +
		"</button>",
          inputForm:"<button class='btn btn-success' type='submit' onclick='valoresFiltroAsignacionPuestoTrabajador()' " +
          		    "style='float:right;font-size:18px;'>" +
	  	        "<i class='fa fa-filter'></i> Aplicar filtro" +
	  	     "</button>"}
      ];
						
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloVersionDos(val);
      });
					
      var modalOptions={
	 id:"modalFiltroAsigPuestoTrab",nombre:"<i class='fa fa-filter'></i> Asignación puesto - Filtros",
	 contenido: "<div class='eventoGeneral'>"+contenido+"</div>",classAux:"filtro-despliegue-conectado"
      };
						
      crearModalPrincipalUsuario(modalOptions,function(){
         if($("#selMulUnidadesFiltro").length > 0){
            return;
         }
					       
         crearSelectOneMenuObligMultipleCompleto("selMulUnidadesFiltro","filtrarValoresDivisiones()",listUnidades,
            "id","nombre","#divFiltroUnidad","Todos");	
         
         filtrarValoresDivisiones();
      },true,true);
			 
      valoresFiltroAsignacionPuestoTrabajador();
   });
}

function valoresFiltroAsignacionPuestoTrabajador(){
   hashAsigPuestosTrab = new Map(); 
   listUnidadesFiltro = [];listDivisionesFiltro = [];listAreasFiltro = []; 
    
   ocultarFiltroAsignacionPuestoTrabajador();

   var listMultiUnidades = $("#selMulUnidadesFiltro").val();
   listUnidadesFiltro = [];
   
   if(listMultiUnidades != null){
      listMultiUnidades.forEach(function(val,index){
	 listUnidadesFiltro.push(parseInt(val));
      });
   }
   
   var listMultiDivisiones = $("#selMulDivisionesFiltro").val();
   listDivisionesFiltro = [];
   
   if(listMultiDivisiones != null){
      listMultiDivisiones.forEach(function(val,index){
	 listDivisionesFiltro.push(parseInt(val));
      });
   }
   
   var listMultiAreas = $("#selMulAreasFiltro").val();
   listAreasFiltro = [];
   
   if(listMultiAreas != null){
      listMultiAreas.forEach(function(val,index){
	 listAreasFiltro.push(parseInt(val));
      });
   }
   
   cargarAsignacionPuestoTrabajador();
}

function verAsignacionPuestoTrabajador(){
   $("#modalNuevaActividad").modal("hide"); 
    
   if(nuevoRegAsigPuestoTrab == 0){
      $("#modalAsigPuestoTrab").remove();
      
   var contenido = "";
    
    var buttonVolverPrincipal =
       "<button type='button' class='btn btn-info' style='margin-right:5px' " +
               "onclick='regresarFiltroAsignacionPuestoTrabajador()' title='Regresar a la vista anterior.'>" +
          "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
          "<i class='fa fa-table fa-2x'></i>" +
       "</button>";
    
    var buttonFiltro = 
       "<button class='btn btn-success' style='margin-right:5px' onclick='verFiltroAsignacionPuestoTrabajador()' " +
               "title='Filtro para el listado de los puestos.'>" +
          "<i class='fa fa-filter fa-2x'></i>" +
       "</button>";
    
    var buttonCheckTodo = 
       "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblAsigPuestoTrab\")' " +
               "title='Marcar todas las filas con un check.'>" +
          "<i class='fa fa-check fa-2x'></i>" +
       "</button>";
    
    var buttonCheckNada = 
       "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblAsigPuestoTrab\")' " +
               "title='Desmarcar todas las filas con un check.'>" +
          "<i class='fa fa-times fa-2x'></i>" +
       "</button>";
    
   var modalOptions={
      maxWidth:"95%",id:"modalAsigPuestoTrab",
      nombre:"<i class='fa fa-table'></i> Asignación - Puesto trabajador",
      contenido: 
	 buttonVolverPrincipal+buttonFiltro+buttonCheckTodo+buttonCheckNada +
         "<div class='wrapper' id='wrapperAsigPuestoTrab'>" +
          "<table id='tblAsigPuestoTrab' class='table table-striped table-bordered table-hover table-fixed'>" +
 	   "<thead>" +
 	    "<tr>" +
             "<th class='tb-acc' style='width:250px'>Unidad</th>" +
             "<th class='tb-acc' style='width:250px'>División</th>" +
             "<th class='tb-acc' style='width:250px'>Área</th>" +
             "<th class='tb-acc' style='width:250px'>Puesto de trabajo</th>" +
 	     "<th class='tb-acc' style='width:100px'>Asignación</th>" +
            "</tr>" +
 	   "</thead>" +
 	   "<tbody></tbody>" +
 	  "</table>" +
 	 "</div>"
   };
 		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperAsigPuestoTrab",190);
   
   
      $("#modalAsigPuestoTrab").modal("hide"); 
       
      crearFiltroAsignacionPuestoTrabajador();
   }else{
       $("#modalAsigPuestoTrab").modal("show"); 
       
      cargarAsignacionPuestoTrabajador(); 
   }
}

function cargarAsignacionPuestoTrabajador(){
   var dataParam={
      companyId:parseInt(getSession("gestopcompanyid")),
      listUnidadesId:(listUnidadesFiltro.length == 0?null:listUnidadesFiltro),
      listDivisionesId:(listUnidadesFiltro.length == 0 || listDivisionesFiltro.length == 0?null:listDivisionesFiltro),
      listAreasId:(listDivisionesFiltro.length == 0 || listAreasFiltro.length == 0?null:listAreasFiltro)
   };
     
   callAjaxPost(URL+"/trabajador/asignacion_puesto",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listPuestosAsignados = data.listPuestos;
 	    
	 $("#tblAsigPuestoTrab tbody tr").remove();
 	 
	 listPuestosAsignados.forEach(function(val,index){   
 	    $("#tblAsigPuestoTrab tbody").append(
 	       "<tr id='trPuestoAsig"+val.positionId+"'>" +
 	          "<td id='unidadNombre"+val.positionId+"'>"+val.matrixName+"</td>" +
 	          "<td id='divisionNombre"+val.positionId+"'>"+val.divisionName+"</td>" +
 	          "<td id='areaNombre"+val.positionId+"'>"+val.areaName+"</td>" +
 	          "<td id='puestoTrabNombre"+val.positionId+"'>"+val.positionName+"</td>" +
 	          "<td id='asigPuesto"+val.positionId+"'><input id='checkAsigPuestoTrab"+val.positionId+"' type='checkbox' " +
                      "class='form-control' "+(hashAsigPuestosTrab.get(val.positionId) == 1?"checked":"")+"></td>" +
 	       "</tr>");
	 });
      }else{
         console.log("NOPNPO");
      }
      
      if(nuevoRegAsigPuestoTrab == 0){
         nuevoRegAsigPuestoTrab = 1;
      }
 	
      goheadfixedY("#tblAsigPuestoTrab","#wrapperAsigPuestoTrab");
   });    
}
