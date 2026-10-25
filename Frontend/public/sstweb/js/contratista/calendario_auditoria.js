var listCalendarioAuditoria = [];
function verFiltroActividadesCalendarioAuditoria(){
	$("#modalFiltroActividadAudiCalendario").modal("show");
}
function ocultarFiltroActividadCalendarioAuditoria(){
	$("#modalFiltroActividadAudiCalendario").modal("hide");
}
function cargarCalendarioActividadesAuditoria(){
	ocultarFiltroActividadCalendarioAuditoria();
	var listTipos = $("#selTipoActividadAudiCalendario").val();
	var listTipoAuditoriaId=[];
	if(listTipos != null){
		listTipos.forEach(function(val,index){
			listTipoAuditoriaId.push(parseInt(val));
		});
	}
	var listContr= $("#selContratistaActividadAudiCalendario").val();
	var listContratistaId=[];
	if(listContr != null){
		listContr.forEach(function(val,index){
			listContratistaId.push(parseInt(val));
		});
	}
	var listRespp= $("#selResponsableActividadAudiCalendario").val();
	var listTrabajadorId=[];
	if(listRespp != null){
		listRespp.forEach(function(val,index){
			listTrabajadorId.push(parseInt(val));
		});
	} 
	var dataParam ={
			isInforme : 2,
			listTipoAuditoriaId : (listTipoAuditoriaId.length == 0?null:listTipoAuditoriaId),
			listContratistaId : (listContratistaId.length == 0?null:listContratistaId),
			listTrabajadorId : (listTrabajadorId.length == 0?null:listTrabajadorId), 
			idCompany : getSession("gestopcompanyid"), 
			
	}
	 scheduler.config.xml_date = "%Y-%m-%d %H:%i";
	scheduler.config.first_hour = 8;
	scheduler.config.limit_time_select = true;
	scheduler.config.cascade_event_display = true; // enable rendering, default
	// value = false
	scheduler.config.cascade_event_count = 4; // how many events events will
	// be displayed in cascade style
	// (max), default value = 4
	scheduler.config.cascade_event_margin = 30; // margin between events,
	// default value = 30
 
	callAjaxPost(URL+"/auditoria",dataParam,function(data){
		
	    	
		listCalendarioAuditoria = data.list;
		listCalendarioAuditoria.forEach(function(val){
			if(val.horaPlanificada == null){val.horaPlanificada = "00:00:00"};
			var arrayFecha = val.fechaPlanificadaNombre.split("-");
			var arrayHora = val.horaPlanificada.split(":");
			val.start_date = arrayFecha[2]+"-"+arrayFecha[1]+"-"+arrayFecha[0]+" "+arrayHora[0]+":"+arrayHora[1];
			val.end_date = arrayFecha[2]+"-"+arrayFecha[1]+"-"+arrayFecha[0]+" "+(arrayHora[0])+":"+(parseInt(arrayHora[1])+30);
			
			val.iconoNombre = "<i class='fa fa-search'></i>";
			val.text = " "+val.auditoriaTipoNombre+'\n'+val.contratistaNombre+'\n'+val.trabajador.nombre;
			val.id = val.auditoriaId;
			//verAcordeContratistaAudiNuevo()+'\n'+data.contratista.nombre+'\n'+val.trabajador.nombre+'\n';
			val.idAux = val.auditoriaId;
			val.tipoEvento = 10;
			val.estadoEvento = val.estado.id;
			val.color = val.estado.color;
			val.textColor = "white";
			
		});
		scheduler.clearAll();
		 
		scheduler.init('wrapperCalendarioAct', new Date(), "month");
		scheduler.parse(listCalendarioAuditoria, "json"); 
		$("#month_tab").css({"right":"56px","left":"auto"});
		scheduler.attachEvent("onClick", function (id, e){
		       //any custom logic here
		    e.preventDefault();
		    var audiObj = {};
		    listCalendarioAuditoria.forEach(function(val){
			if(val.auditoriaId == id){
			    audiObj = val;
			}
		    });
		    $("#selTabContratista").val(8);
		    var str_array = [audiObj.proyecto.id];
		    $("#divSelectFiltroProyNombre #selMultipleNombreProy").val(str_array).trigger("chosen:updated");
		    $("#fechaInicioEventoAudi").val(convertirFechaInput(audiObj.fechaPlanificada));
		    $("#fechaFinEventoAudi").val(convertirFechaInput(audiObj.fechaPlanificada));
		    $("#fechaInicioEventoInsp").val(convertirFechaInput(audiObj.fechaPlanificada));
		    $("#fechaFinEventoInsp").val(convertirFechaInput(audiObj.fechaPlanificada));

		    createSession("linkCalendarioAuditoriaId",audiObj.auditoriaId);
		    createSession("linkCategoriaAuditoriaId",audiObj.auditoriaTipo);
		    createSession("linkProyectoId",audiObj.proyecto.id);
		    verAcordeTabContratista();
		    return true;
		  });
	});
}

function ocultarNuevoActividadAuditoria(){
	$("#modalNuevoActividadAudi").modal("hide");
}
function verNuevoActividadAuditoria(){
	var contenido ="";
	var selTipoAudiNuevo=crearSelectOneMenuOblig("selTipoAudiNuevo", "", listTipoActividadAudi, "3", "id",
	"nombre");
	var listContenido = [
         {sugerencia:"",label:"Actividad",inputForm:selTipoAudiNuevo},
         {sugerencia:"",label:"Detalle",inputForm:"<input  placeholder='Ingresar título' id='textTituloAudiNuevo' class='form-control'>"},
         {sugerencia:"",label:"Contratista",inputForm:"",divContainer: "divContratistaActividadAudiNuevo"},
         {sugerencia:"",label:"Proyecto",inputForm:"",divContainer: "divProyectoActividadAudiNuevo" },
         {sugerencia:"",label:"Fecha planificada",inputForm: "<input  type='date' id='dateActivAudiNuevo' class='form-control'>",divContainer: "" },
         {sugerencia:"",label:"Hora planificada",inputForm: "<input  type='time' id='timeActivAudiNuevo' class='form-control'>",divContainer: "" },
         {sugerencia:"",label:"Responsable",inputForm: "",divContainer: "divResponsableActividadAudiNuevo" },
         
         {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarNuevoActividadAuditoria()'><i class='fa fa-times'></i>Cancelar</button>",
        	 inputForm:"<button class='btn btn-success' type='button' onclick='guardarActividadAudiNuevo()'><i class='fa fa-floppy-o'></i>Guardar</button>"},
	                     ];
	listContenido.forEach(function(val){
		contenido +=obtenerSubPanelModuloGeneral(val);
	});
	var modalOptions= {id:"modalNuevoActividadAudi",nombre:"<i class='fa fa-plus'></i>Nuevo",
			contenido: contenido};
	crearModalPrincipalUsuario(modalOptions,function(){
		if($("#selContratistaActividadAudiNuevo").length > 0){
			//return;
		} 

		crearSelectOneMenuObligUnitarioCompleto("selContratistaActividadAudiNuevo", "verAcordeContratistaAudiNuevo()", listContratistasActividadAudi, 
				"id","nombre","#divContratistaActividadAudiNuevo","Todos");
		crearSelectOneMenuObligUnitarioCompleto("selResponsableActividadAudiNuevo", "", listResponsablesActividadAudi, 
				"id","nombre","#divResponsableActividadAudiNuevo","Todos"); 
		verAcordeContratistaAudiNuevo()
	},false,true);
	
	
	
	
	
}
function guardarActividadAudiNuevo(){
	var titulo = $("#textTituloAudiNuevo").val();
	if(titulo.length == 0){
		alert("Titulo obligatorio"); return;
	}
	var hora = $("#timeActivAudiNuevo").val();
	var fecha = convertirFechaTexto($("#dateActivAudiNuevo").val());
	if(fecha == null){
		alert("Fecha obligatoria"); return;
	}
	var proyectoId = $("#selProyectoActividadAudiNuevo").val();

	if(proyectoId == null){
		alert("Proyecto obligatorio"); return;
	}
	
        console.log($("#selResponsableActividadAudiNuevo").val());
	
	var dataParam = {
			auditoriaId : 0,
			observacion:"",
			trabajador:{trabajadorId:$("#selResponsableActividadAudiNuevo").val()},
			
			auditoriaNombre : titulo,
			auditoriaResponsable : "", 
			auditoriaTipo: $("#selTipoAudiNuevo").val(),
			horaPlanificada:hora,
			auditoriaFecha: null,
			areas: [],
			estadoImplementacion: 1, 
			fechaPlanificada:fecha,
			proyectoId: proyectoId,
			idCompany : getSession("gestopcompanyid")
		};

		callAjaxPost(URL + '/auditoria/save', dataParam,
				function(){
			ocultarNuevoActividadAuditoria();
			if(subModuloContratistaId == 14){
				cargarCalendarioActividadesAuditoria();
			}
			if(subModuloContratistaId == 15){
				cargarActividadesAuditoria();
			}
			
		});
}

function verAcordeContratistaAudiNuevo(){
	crearSelectOneMenuObligUnitarioCompleto("selProyectoActividadAudiNuevo", "", listProyectoActividadAudi.filter(function(val){
		return val.contratistaId == parseInt($("#selContratistaActividadAudiNuevo").val());
	}),"id","titulo","#divProyectoActividadAudiNuevo","Sin proyectos");
}



