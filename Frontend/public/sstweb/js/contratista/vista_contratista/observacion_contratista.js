/**
 * 
 */
var listFullObservacionesContratista=[];
var listTipoReporte=[];
var listFactorSeguridad=[];
var listPotencialPerdida=[],listGestiones=[],listGrupoRiesgo=[];
var objObservacionContratista={id:0};
var indexObsContr;
var mensajeUx;

function toggleMenuOpcionObsContr(obj,pindex){
	indexObsContr=pindex;
	objObservacionContratista=listFullObservacionesContratista[pindex];
	$(obj).parent(".detalleAccion").find(".listaGestionGosst").toggle();
	$(obj).parent(".detalleAccion").parent().siblings().find(".listaGestionGosst").hide(); 	
}
var funcionalidadesObservacionContratista=[ 

/*{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
		window.open(URL+"/contratista/observacion/evidencia?observacionId="+objObservacionContratista.id,"_blank")}  }, */
	//{id:"opcAgregar",nombre:"<i class='fa fa-plus-square' ></i> Agregar acción de mejora",functionClick:function(data){nuevaAccionObservacionContratista(indexObsContr)}  },
	{id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o' ></i> Editar",functionClick:function(data){editarObservacionContratista()}  },
	{id:"opcElimnar",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:function(data){eliminarObservacionContratista()}  }
                               ]
function marcarSubOpcionObservacionContratista(pindex){ 
	funcionalidadesObservacionContratista[pindex].functionClick();
	$(".listaGestionGosst").hide();
}
   
function verCompletarObsContratista(pindex){
    
	objObservacionContratista={id:0};
	pindex=defaultFor(pindex,indexPostulante);
	indexPostulante=pindex;
	var contratistaId=parseInt(getSession("contratistaGosstId"));
	var dataParam={ 
			contratistaId:(contratistaId),
			id:listFullProyectoSeguridad[pindex].id
			};
	//  
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
	.parent(".eventoGeneral").parent(".contenidoSubList")
	.parent(".divProyectoGeneral").siblings()
	.find(".detalleObservacionesContratista").hide();
	
	$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	.find(".detalleObservacionesContratista").toggle() 
	//
	callAjaxPost(URL + '/contratista/proyecto/observaciones', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05": 
			listFullObservacionesContratista=data.list;
			listTipoReporte=data.listReporte;
			listFactorSeguridad=data.listFactores;
			listPotencialPerdida=data.listPerdida; 
			var menuOpcion="<ul class='list-group listaGestionGosst' >";
			funcionalidadesObservacionContratista.forEach(function(val1,index1){
				menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionObservacionContratista("+index1+")'>"+val1.nombre+" </li>"
			});
			menuOpcion+="</ul>";
			$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
			.find(".detalleObservacionesContratista").html("<td colspan='3'></td>");
			var numPositivo=0;
			listFullObservacionesContratista.forEach(function(val,index){  
				var claseGosst="gosst-neutral"; 
				if(val.nivel==2 ){
					numPositivo++;
					claseGosst="gosst-aprobado"
				}
				$("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
				.find(".detalleObservacionesContratista td")
				.append(
						"<div id='divMovilObservacionContr"+val.id+"'>" +
							"<div class='detalleAccion "+claseGosst+"'>" +
								"<a class='btn-gestion efectoLink' onclick='toggleMenuOpcionObsContr(this,"+index+")'>" +
									"Ver Opciones <i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
								"</a>" +
									menuOpcion+
								"<strong>OBSERVACIÓN "+(index+1)+"</strong><br>"+
								"<i aria-hidden='true' class='fa fa-eye'></i> Tipo de Observacion: " +
								"<strong>"+val.tipo.nombre+"</strong><br>"+
								"<i aria-hidden='true' class='fa fa-list-ul'></i> Tipo de Reporte: "+
								val.reporte.nombre+"<br>"+
								"<i aria-hidden='true' class='fa fa-file-text-o'></i> Descripcion: "+
								val.descripcion+"<br>" +
//								"<i aria-hidden='true' class='fa fa-lock'></i> Factor de Seguridad: "+
//								val.factor.nombre+"<br>"+ 
								(val.nivel==1?
										"<i class='fa fa-star-half-o'></i> Estado: Proceso"
										:
										"<i style='font-size:19px;color: #c5c54b' class='fa fa-star'></i>Estado: Cerrado")+"<br>"+
								"<i aria-hidden='true' class='fa fa-calendar'></i> Fecha de Reporte: "+val.fechaTexto+"<br>"+
								"<i class='fa fa-download' ></i> Evidencia: "+
								(val.evidenciaNombre=="----"?
										"Sin Registro"
										:
										"<a class='efectoLink' href='"+URL+"/contratista/observacion/evidencia?observacionId="+val.id+"'>" +
											val.evidenciaNombre	+
										"</a>")+"<br>"+
								"<a class='efectoLink' onclick='verCompletarAccioneObservacionContr("+index+")'>" +
									"Ver Acción de Mejora ("+val.indicadorAcciones+") <i class='fa fa-angle-double-down'></i> "+
								"</a>"+
							"</div>" + 
							"<div class='opcionesAccion'>" +
							//"<a onclick='nuevaAccionObservacionContratista("+index+")'>Agregar acción mejora </a>" +
							//	"<i aria-hidden='true' class='fa fa-minus'></i>" +
							//"<a onclick='verCompletarAccioneObservacionContr("+index+")'> Ver ("+val.indicadorAcciones+")</a> " +
							"</div>" +
							"<div class='subOpcionAccion'></div>"+
						"</div>" );
			});
			$("#trObsCon"+listFullProyectoSeguridad[pindex].id).find(".celdaIndicadorProyecto")
			.html(""+numPositivo+" / "+listFullObservacionesContratista.length)
			$(".listaGestionGosst").hide();
			var listPanelesPrincipal=[];
			var selTipoReporteObs= crearSelectOneMenuOblig("selTipoReporteObs", "", listTipoReporte, "", 
					"id","nombre")
			var selFactorObs= crearSelectOneMenuOblig("selFactorObs", "", listFactorSeguridad, "", 
					"id","nombre")
			var selPerdidaObs= crearSelectOneMenuOblig("selPerdidaObs", "", listPotencialPerdida, "", 
					"id","nombre")
			var selEstadoObsContratista= crearSelectOneMenuOblig("selEstadoObsContratista", "", selEstadoObs, "", 
			"id","nombre")
			var listItemsFormTrab=[
		    		{sugerencia:"",label:"Descripción",inputForm:"<input class='form-control'   id='inputDescObsContr' placeholder=' '>"},
		    		 {sugerencia:"",label:"Fecha reporte ",inputForm:"<input  class='form-control' type='date' id='dateObsContr' placeholder=' '>" } ,
		    		 {sugerencia:"",label:"Tipo Reporte",inputForm:selTipoReporteObs},
//		    		 {sugerencia:"",label:"Factor Seguridad",inputForm:selFactorObs},
		    		 {sugerencia:"",label:"Potencial de Pérdida",inputForm:selPerdidaObs},
		     		 
		    		 {sugerencia:"Si solucionó la observación, seleccione 'Cerrado'",label:"Estado Observación",inputForm:selEstadoObsContratista},
		    		 {sugerencia:" ",label:"Evidencia",divContainer:"eviObsContr"},
		    		  {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
		     		];

			 
			var textFormTrabajador="";
			listItemsFormTrab.forEach(function(val,index){
				textFormTrabajador+=obtenerSubPanelModulo(val);
			}); 
			$("#nuevoMovilObsContratista").remove();
			$("#editarMovilObsContratista").remove();
			
			 listPanelesPrincipal.push( 
					 {id:"editarMovilObsContratista" ,clase:"contenidoFormVisible",
						nombre:""+"Editar ",
						contenido:"<form id='formEditarObsContratista' class='eventoGeneral'>"+textFormTrabajador+"</form>"}
							);
			//HASTA ACA
			agregarPanelesDivPrincipal(listPanelesPrincipal); 
			$("#editarMovilObsContratista").hide();
			$(".listaGestionGosst").hide();  
			 $('#formEditarObsContratista').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarObservacionContratista();
			 }); 
			break;
			default:
				alert("nop");
				break;
		}
	})
	
}

function nuevaObservacionContratista(pindex){
   proyectoObj = listFullProyectoSeguridad[pindex];
   indexPostulante = pindex;
 
   objObservacionContratista={id:0};
	
   var dataParam={ 
      contratistaId: (getSession("contratistaGosstId")),
      id: proyectoObj.id
   };
   // 
   $("#proyectoTable"+proyectoObj.id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings()
   .find(".detalleObservacionesContratista").hide();
	
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleObservacionesContratista").toggle() 
   //
   callAjaxPost(URL+'/contratista/proyecto/observaciones',dataParam,function(data){
      var listPanelesPrincipal = [];
      var textIn = "";
	
      listFullObservacionesContratista = data.list;
      listTipoReporte = data.listReporte;
      listFactorSeguridad = data.listFactores;
      listPotencialPerdida = data.listPerdida; 
      listGestiones = data.listGestiones;
	
      var selTipoReporteObs = crearSelectOneMenuOblig("selTipoReporteObs","",
	 listTipoReporte,"","id","nombre");
	
      var selFactorObs = crearSelectOneMenuOblig("selFactorObs","",
	 listFactorSeguridad,"","id","nombre");
      
      var selPerdidaObs = crearSelectOneMenuOblig("selPerdidaObs","",
	 listPotencialPerdida,"","id","nombre");
      
      var selEstadoObsContratista = crearSelectOneMenuOblig("selEstadoObsContratista","",
	 selEstadoObs,"","id","nombre");
      
      var selGestionObs = crearSelectOneMenu("selGestionObs","",
	 listGestiones,"","id","nombre");
      
      var listItemsFormTrab=[
         {sugerencia:"",label:"Descripción",
          inputForm:"<input class='form-control' id='inputDescObsContr' placeholder=' '>"},
    	 {sugerencia:"",label:"Fecha reporte ",
          inputForm:"<input class='form-control' type='date' id='dateObsContr' placeholder=' '>"} ,
    	 {sugerencia:"",label:"Reportado por",
   	  inputForm:"<input class='form-control' id='inputReportadoPorObsContr'>"},
   	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"",label:"Tipo Reporte",
   	  inputForm:selTipoReporteObs},
//    	 {sugerencia:"",label:"Factor Seguridad",
//   	  inputForm:selFactorObs},
    	 {sugerencia:"",label:"Potencial de Pérdida",
   	  inputForm:selPerdidaObs},
    	 {sugerencia:"",label:"Sistema de gestión asociado",
   	  inputForm:selGestionObs,divContainer:""},
       	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"Si solucionó la observación, seleccione 'Cerrado'",
       	  label:"Estado Observación",inputForm:selEstadoObsContratista},
    	 {sugerencia:" ",label:"Evidencia",divContainer:"eviObsClienteContr"},
    	 {sugerencia:"",label:"",
    	  inputForm:"<button type='submit' class='btn btn-success'>" +
    	               "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
    	            "</button>"} 
      ];

      var textFormTrabajador = "";
      
      textFormTrabajador += "<div class='eventoGeneral'>";
	
      listItemsFormTrab.forEach(function(val,index){
         textFormTrabajador += obtenerSubPanelModuloVersionDos(val);
      });
      
      textFormTrabajador += "</div>";
      
      $("#nuevoMovilObsContratista").remove();
      $("#editarMovilObsContratista").remove();
	
      listPanelesPrincipal.push({
	 id: "editarMovilObsContratista",
         clase:"contenidoFormVisible",
	 nombre:""+"Editar trabajador",
	 contenido:"<form id='formEditarObsContratista' class='eventoGeneral'>"+textFormTrabajador+"</form>"});
	
      //HASTA ACA
      agregarPanelesDivPrincipal(listPanelesPrincipal); 
	
      $("#editarMovilObsContratista").find("#dateObsContr").val(obtenerFechaActual());
	
      $(".listaGestionGosst").hide();  
	 
      $('#formEditarObsContratista').on('submit',function(e){  
         e.preventDefault(); 
	 guardarObservacionContratista();
      }); 
		
      $("#editarMovilObsContratista").find(".tituloSubList")
      .html(textoBotonVolverContenido+"Nuevo Observación del proyecto '"+proyectoObj.titulo+"' al Cliente ");
		
      $("#editarMovilObsContratista").find("form input").val("");
		
      $(".divListPrincipal>div").hide();
      $("#editarMovilObsContratista").show();
		
      var options={
	 container: "#eviObsClienteContr",
	 functionCall: function(){},
	 descargaUrl: "",
	 esNuevo: true,
	 idAux: "Observacion",
	 evidenciaNombre: ""
      };
		
      crearFormEvidenciaCompleta(options);
   });
}

function nuevoObservacionInternaContratista(pindex){
   proyectoObj = listFullProyectoSeguridad[pindex];
   indexPostulante = pindex;
 
   objObservacionContratista={id:0};
	
   var dataParam={ 
      contratistaId: (getSession("contratistaGosstId")),	
      id: proyectoObj.id
   };
   // 
   $("#proyectoTable"+proyectoObj.id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings()
   .find(".detalleObservacionesProyecto").hide();
	
   $("#proyectoTable"+proyectoObj.id)
   .find(".detalleObservacionesProyecto").toggle() 
   //
   callAjaxPost(URL+'/contratista/proyecto/observaciones',dataParam,function(data){
      var listPanelesPrincipal=[];
      var textIn= "";
		
      listFullObservacionesContratista = data.list;
      listTipoReporte = data.listReporte;
      listFactorSeguridad = data.listFactores;
      listPotencialPerdida = data.listPerdida; 
      listGestiones = data.listGestiones;
      listGrupoRiesgo = data.listGrupoRiesgo;
	
      var selTipoReporteObs = crearSelectOneMenuOblig("selTipoReporteObs","",listTipoReporte,
	 "","id","nombre");
      
      var selFactorObs = crearSelectOneMenuOblig("selFactorObs","",listFactorSeguridad,
	 "","id","nombre");
      
      var selPerdidaObs = crearSelectOneMenuOblig("selPerdidaObs","",listPotencialPerdida,
	 "","id","nombre");
      
      var selGestionObs = crearSelectOneMenu("selGestionObs","",listGestiones,
	 "","id","nombre");
      
      var selGrupoRiesgoObs = crearSelectOneMenu("selGrupoRiesgoObs","",listGrupoRiesgo,
	 "","id","nombre");
      
      var selEstadoObsContratista= crearSelectOneMenuOblig("selEstadoObsContratista","",selEstadoObs,
	 "","id","nombre");
	     
      var listItemsFormTrab=[
    	 {sugerencia:"",label:"Descripción",
    	  inputForm:"<input class='form-control' id='inputDescObsContr' placeholder=''>"},
    	 {sugerencia:"",label:"Fecha reporte ",
    	  inputForm:"<input class='form-control' type='date' id='dateObsContr' placeholder=''>"},
    	 {sugerencia:"",label:"Hora reporte ",
    	  inputForm:"<input class='form-control' type='time' id='timeObsContr' placeholder=''>"},
    	 {sugerencia:"",label:"Reportado por",
	  inputForm:"<input class='form-control' id='inputReportadoPorObsContr'>"},
	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"",label:"Tipo Reporte",
	  inputForm:selTipoReporteObs},
//    	 {sugerencia:"",label:"Factor Seguridad",
//	  inputForm:selFactorObs},
    	 {sugerencia:"",label:"Potencial de Pérdida",
	  inputForm:selPerdidaObs},
    	 {sugerencia:"",label:"Sistema de gestión asociado",
	  inputForm:selGestionObs,divContainer:""},
	 {sugerencia:"",label:"Grupo de Riesgo",
	  inputForm:selGrupoRiesgoObs,divContainer:""},
    	 {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
    	 {sugerencia:"<label>*Si solucionó la observación, seleccione 'Cerrado'</label>",
    	  label:"Estado Observación",inputForm:selEstadoObsContratista},
    	 {sugerencia:"",label:"Evidencia",divContainer:"eviObsContr"},
    	 {sugerencia:"",label:"",
    	  inputForm:"<button type='submit' class='btn btn-success'>" +
    	               "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
    	      	    "</button>"} 
      ];
	
      var textFormTrabajador = "";
	
      textFormTrabajador += "<div class='eventoGeneral'>";
	  
      listItemsFormTrab.forEach(function(val,index){
         textFormTrabajador += obtenerSubPanelModuloVersionDos(val);
      }); 
      
      textFormTrabajador += "</div>";
	
      $("#nuevoMovilObsContratista").remove();
      $("#editarMovilObsContratista").remove();
	
      listPanelesPrincipal.push( 
         {id:"editarMovilObsInternContratista",
          clase:"contenidoFormVisible",
          nombre:""+"Editar trabajador",
          contenido:"<form id='formEditarInternObsContratista' class='eventoGeneral'>"+
                        textFormTrabajador+
                    "</form>"}
      );
      //HASTA ACA
      agregarPanelesDivPrincipal(listPanelesPrincipal); 
     
      $("#editarMovilObsInternContratista").find("#dateObsContr").val(getSession("fechaHoyOrdenInversoTexto"));
	
      $(".listaGestionGosst").hide();  
      
      $('#formEditarInternObsContratista').on('submit',function(e){  
         e.preventDefault(); 
         guardarObservacionInternaContratista();
      }); 
		
      $("#editarMovilObsInternContratista").find(".tituloSubList")
      .html(textoBotonVolverContenido+"Nuevo Observación del proyecto '" +
	    proyectoObj.titulo+"'  ");
		
      $("#editarMovilObsInternContratista").find("form input").val("");
		
      $(".divListPrincipal>div").hide();
      $("#editarMovilObsInternContratista").show();
		
      var options={
	 container: "#eviObsContr",
	 functionCall: function(){},
	 descargaUrl: "",
	 esNuevo: true,
	 idAux: "Observacion",
	 evidenciaNombre: ""
      }; 
	     
      crearFormEvidenciaCompleta(options);
   });
}

function editarObservacionContratista(){
	
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilObsContratista");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar observación ");
	
	editarDiv.find("#inputDescObsContr").val(objObservacionContratista.descripcion); 
	editarDiv.find("#dateObsContr").val(convertirFechaInput(objObservacionContratista.fecha));
	editarDiv.find("#selTipoReporteObs").val(objObservacionContratista.reporte.id);
//	editarDiv.find("#selFactorObs").val(objObservacionContratista.factor.id );
	editarDiv.find("#selPerdidaObs").val(objObservacionContratista.perdida.id); 
	editarDiv.find("#selEstadoObsContratista").val(objObservacionContratista.nivel); 
	var eviNombre=objObservacionContratista.evidenciaNombre;
	var options=
	{container:"#eviObsContr",
			functionCall:function(){ },
			descargaUrl: "/contratista/observacion/evidencia?observacionId="+objObservacionContratista.id,
			esNuevo:false,
			idAux:"Observacion",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);
}

function guardarObservacionContratista(){ 
   var formDiv = $("#editarMovilObsContratista");
	 
   var campoVacio = true;
	
   var descripcion = formDiv.find("#inputDescObsContr").val();  
   var fecha = formDiv.find("#dateObsContr").val();
   var tipo = formDiv.find("#selTipoReporteObs").val();
//   var factor = formDiv.find("#selFactorObs").val();
   var perdida = formDiv.find("#selPerdidaObs").val(); 
   var nivel = formDiv.find("#selEstadoObsContratista").val(); 
   
   var gestionId = parseInt(formDiv.find("#selGestionObs").val());
   var reportadoPor = formDiv.find("#inputReportadoPorObsContr").val();

   if(campoVacio){
      var dataParam={
	 id: objObservacionContratista.id, 
	 proyectoId: proyectoObj.id,
	 tipo:{id:2},
	 descripcion: descripcion,
	 nivel: nivel,
	 fecha: convertirFechaTexto(fecha),
	 perdida: {id: perdida},
//	 factor: {id: factor},
	 reporte: {id: tipo}, 
	 gestion: {id: gestionId},
	 reportadoPor: reportadoPor,
	 contratistaAsociado: {id: getSession("contratistaGosstId")},
	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/contratista/observacion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       guardarEvidenciaAuto(data.nuevoId,"fileEviObservacion",bitsEvidenciaObservacion,
	          '/contratista/observacion/evidencia/save',function(){
		     mensajeUx = "<label>La observación fue registrada con éxito.</label>";
		     mensajesUx(mensajeUx,1,"");
		   
		     volverDivSubContenido();
		     verCompletarObsContratista();
	          },"observacionId");
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la programacion!");
         }
      });
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function guardarObservacionInternaContratista(){
   var formDiv = $("#editarMovilObsInternContratista");
   var campoVacio = true;
	
   var descripcion = formDiv.find("#inputDescObsContr").val();  
   var fecha = convertirFechaTexto(formDiv.find("#dateObsContr").val());
   var hora = formDiv.find("#timeObsContr").val();
   var tipo = parseInt(formDiv.find("#selTipoReporteObs").val());
//   var factor = formDiv.find("#selFactorObs").val();
   var perdida = formDiv.find("#selPerdidaObs").val(); 
   var nivel = formDiv.find("#selEstadoObsContratista").val(); 
   
   var gestionId = parseInt(formDiv.find("#selGestionObs").val());
   var grupoRiesgoId = formDiv.find("#selGrupoRiesgoObs").val();
   var reportadoPor = formDiv.find("#inputReportadoPorObsContr").val();
   
   if(tipo == 3){
      nivel = 2;
   }
   
   if(fecha == null || hora == ""){
       campoVacio = false;
   }
  
   if(campoVacio){
      var dataParam={
	 id: objObservacionContratista.id, 
	 proyectoId: proyectoObj.id ,
	 tipo:{id:1},
	 descripcion: descripcion,
	 nivel: nivel,
	 fecha: fecha,
	 horaReal: hora,
	 perdida: {id: perdida},
//	 factor: {id: factor},
	 reporte: {id: tipo},
	 contratistaAsociado: {id: null},
	 gestion: {id: gestionId},
	 grupoRiesgo: {id:grupoRiesgoId},
	 reportadoPor: reportadoPor,
	 empresaId: getSession("gestopcompanyid")
      };

      callAjaxPost(URL+'/contratista/observacion/save',dataParam,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":
	       guardarEvidenciaAuto(data.nuevoId,"fileEviObservacion",bitsEvidenciaObservacion,
	       '/contratista/observacion/evidencia/save',function(){
	          mensajeUx = "<label>La observación fue registrada con éxito.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarObsProyVistaCon");
	              
	          $("#modalMensajeUxActualizarObsProyVistaCon").on("hidden.bs.modal",function(){
		     volverDivSubContenido();
	             verCompletarObsProyecto();    
	          });
	       },"observacionId")
						 
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la programacion!");
	 }
      });
   }else{
      alert("Debe ingresar todos los campos.");
   }
}

function eliminarObservacionContratista(pindex) {
	 
	var r = confirm("¿Está seguro de eliminar la obsevación?");
	if (r == true) {
		var dataParam = {
				id :  objObservacionContratista.id,
		};

		callAjaxPost(URL + '/contratista/observacion/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05": 
						verCompletarObsContratista();
						break;
					default:
						alert("Ocurrió un error al eliminar la programacion!");
					}
				});
	}
} 

             
var funcionalidadesAccionMejoraObsContr=[
                            /*{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
                            	window.open(URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objAccAuditoria.id,'_blank')
                            	}  }
                            , {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarAccionContrObs()}  },
                            id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarAccionMejoraAudiContrObs()}  }
                            */];
function marcarSubOpcionAccMejoraObsContr(pindex){
	funcionalidadesAccionMejoraObsContr[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".subSubDetalleAccion ul").hide();
} 
function verCompletarAccioneObservacionContr(pindex){
	 
	pindex=defaultFor(pindex,objAuditoria.index);
	//
	 $(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
	
	// 
var audiObj={accionMejoraTipoId : 1,
		observacionId:listFullObservacionesContratista[pindex].id};
 
objAuditoria={index:pindex};
objAccAuditoria={observacionId:listFullObservacionesContratista[pindex].id};
callAjaxPost(URL + '/gestionaccionmejora/accionmejora', 
			audiObj, function(data){
				if(data.CODE_RESPONSE=="05"){ 
					$("#tblAccAudi tbody tr").remove();
					detalleAccAuditoriaFull=data.list;
					detalleAccAuditoriaFull.forEach(function(val,index){
						val.id=val.accionMejoraId;
						val.observacionId=objAccAuditoria.observacionId;
						 //
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesAccionMejoraObsContr.forEach(function(val,index){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionAccMejoraObsContr("+index+")'>"+val.nombre+" </li>"
						});
						menuOpcion+="</ul>"
						
						 $("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
							.find("#divMovilObservacionContr"+listFullObservacionesContratista[pindex].id+" .subOpcionAccion").show()
							.append("<div class='subDetalleAccion  gosst-neutral' style='border-color:"+val.estadoColor+"'>" +
									/*"<button class='btn btn-success' onclick='toggleMenuOpcionAccMejora(this,"+index+")'>" +
									"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
									menuOpcion+*/
									"<strong>ACCIÓN DE MEJORA "+(index+1)+"</strong><br>"+
									"<i class='fa fa-info' aria-hidden='true'></i> Descripción: " +val.descripcion+ "<br>"+
									"<i class='fa fa-calendar' aria-hidden='true'></i> Fecha de Planificación:" +val.fechaRevisionTexto+"<br>"+ 
									"<i class='fa fa-download' aria-hidden='true'></i> Evidencia: " +
									(val.evidenciaNombre=="----"?
											"Sin Registro"
											:
											"<a class='efectoLink' href='"+URL+"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val.id+"'>" +
												val.evidenciaNombre+
											"</a>")+"<br>"+
									"</div> " ); 
					});
					$(".subDetalleAccion ul").hide();
					formatoCeldaSombreableTabla(true,"tblAccAudi");
				}else{
					console.log("NOPNPO")
				}
			});
}
function guardarAccionObservacionContratista(functionCallBack){
	var editarDiv=$("#editarMovilObsContr");
	var campoVacio = false;
	var inputDesc = editarDiv.find("#inputDescAcc").val();

	var inputFecha =convertirFechaTexto( editarDiv.find("#inputFecAcc").val());
	var obsevacion=editarDiv.find("#inputObsAcc").val()
	  
	if(inputFecha==null){
		campoVacio=true;
	}
	hallarEstadoImplementacionAccAuditoria();
	if (!campoVacio) {

		var dataParam = {
				accionMejoraId : objAccAuditoria.id ,
				observacion:obsevacion,
			descripcion : inputDesc,
			fechaRevision : inputFecha,
			fechaReal:null,
			responsableNombre:"Contratista",responsableMail:"@asd",
			accionMejoraTipoId : 1,
			estadoId : objAccAuditoria.accionEstado,
			companyId : getSession("gestopcompanyid"),
			gestionAccionMejoraId : null,
			observacionId:objAccAuditoria.observacionId
		};
		 
		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/save', dataParam,
				function(data){ 
				guardarEvidenciaAuto(data.nuevoId,"fileEviAccionMejoraObsContr" 
						,bitsEvidenciaAccionMejora,"/gestionaccionmejora/accionmejora/evidencia/save",function(){
					volverDivSubContenido();
					verCompletarObsContratista(indexPostulante);
					$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
					.find(".detalleObservacionesContratista").show();
					if(functionCallBack!=null){ 
						functionCallBack();
					}
				},"accionMejoraId"); 
				
			 
		},null,null,null,null,false);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function nuevaAccionObservacionContratista(observacionIndex){ 
	$("#editarMovilObsContr").find("form input").val("");
		objAccAuditoria={observacionId:listFullObservacionesContratista[observacionIndex].id};
		objAccAuditoria.id = 0;
		objAuditoria={index:observacionIndex};
		
		$(".divListPrincipal>div").hide();
		$("#editarMovilObsContr").show();
		$("#editarMovilObsContr").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nueva acción de mejora de observación de '"
				+listFullObservacionesContratista[observacionIndex].descripcion+"' ");
		var options=
		{container:"#editarMovilObsContr #eviAccionMejora",
				functionCall:function(){ },
				descargaUrl:"",
				esNuevo:true,
				idAux:"AccionMejoraObsContr",
				evidenciaNombre:""};
		crearFormEvidenciaCompleta(options);  
}

function eliminarAccionMejoraAudiContrObs() {
	var r = confirm("¿Está seguro de eliminar la Accion de mejora?");
	if (r == true) {
		var dataParam = {
				accionMejoraId : objAccAuditoria.id 
		};

		callAjaxPost(URL + '/gestionaccionmejora/accionmejora/delete',
				dataParam, function(){ 
					volverDivSubContenido();
					verCompletarObsContratista(indexPostulante);
					$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
					.find(".detalleObservacionesContratista").show() 
				 
				 
		});
	}
}

function editarAccionContrObs(){

	$(".divListPrincipal>div").hide();
	var editarObs=$("#editarMovilObsContr");
	editarObs.show(); 
	editarObs.find(".tituloSubList")
		.html(textoBotonVolverContenido+"Editar acción de la observación '"
				+objAuditoria.descripcion+"' ");
	 
	
	objAccAuditoria.id=objAccAuditoria.accionMejoraId; 
  
	editarObs.find("#inputDescAcc").val(objAccAuditoria.descripcion);
	// 
	editarObs.find("#inputFecAcc").val(convertirFechaInput(objAccAuditoria.fechaRevision));
	editarObs.find("#inputFecAcc").attr("disabled",true);
	// 
	editarObs.find("#inputObsAcc").val(objAccAuditoria.observacion);
	//
	 var eviNombre=objAccAuditoria.evidenciaNombre;
var options=
{container:"#editarMovilObsContr #eviAccionMejora",
		functionCall:function(){ },
		descargaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+objAccAuditoria.id,
		esNuevo:false,
		idAux:"AccionMejoraObsContr",
		evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options); 
}


function verTablaResumenObsProyecto(proyIndex){
   $(".divContainerGeneral").hide();
	
   var buttonClip = 
      "<button type='button' id='btnClipboardTrabProy' style='margin-right:10px' " +
	      "class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()'>" + 
         "<i class='fa fa-clipboard'></i> Clipboard" +
      "</button>";
   
   var buttonVolver =
      "<button type='button' class='btn btn-success ' style='margin-right:10px' " +
	      "onclick='volverVistaMovil()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	
   var buttonFiltro = 
      "<button type='button' class='btn btn-success' id='btnIniciarFiltro' style='margin-right:10px' " +
	      "title='Ver filtros' onclick='iniciarFiltroObsProyecto()'>" +
         "<i class='fa fa-filter fa-2x'></i>" +
      "</button>";
   
   var buttonFiltroAplicar =
      "<button type='button' class='btn btn-success' id='btnAplicarFiltro' style='margin-right:10px' " +
              "title='Aplicar filtros' onclick='aplicarFiltroObsProyecto()'>" +
         "<i class='fa fa-filter fa-2x'></i>" +
      "</button>";
	
   var buttonFiltroRefresh = 
      "<button type='button' class='btn btn-success' id='btnReiniciarFiltro' style='margin-right:10px' " +
	      "title='Refresh' onclick='reiniciarFiltroObsProyecto()'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>";
   
   buttonClip="";
	
   $("body").append(
      "<div id='divObsProyTabla' style='padding-left:40px;'>" +
         "<form class='form-inline'>"+
	     buttonVolver+buttonFiltroRefresh+buttonFiltroAplicar +
	     buttonFiltro+buttonClip +
	 "</form>" +
	 "<div class='camposFiltroTabla'>" +
	    "<div class='contain-filtro' id='divFiltroObs'>" +
	       "<input type='checkbox' id='checkFiltroObs' checked>" +
	       "<label for='checkFiltroObs'>Estado</label>" +
	       "<div id='divSelectFiltroObs'></div>" + 
            "</div>"+
	    "<div class='contain-filtro' id='divFiltroFechaObs'>" +
	       "<label for='checkFiltroFechaInicioObs'>Desde</label>" +
	       "<input class='form-control' type='date' id='dateInicioFiltroObs'>" +
	       "<label for='checkFiltroFechaFinObs'>Hasta</label>" +
	       "<input class='form-control' type='date' id='dateFinFiltroObs'>" +
	    "</div>"+
	 "</div>" +
	 "<div class='wrapper' id='wrapperObsProy'>" +
	    "<table style='min-width:1450px' " +
		   "id='tblObsProyecto' class='table table-striped table-bordered table-hover fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:140px'>Reportado</td>" +
	             "<td class='tb-acc' style=''>Descripción</td>" + 
	             "<td class='tb-acc' style='width:180px'>Fecha de reporte</td>" +
	             "<td class='tb-acc' style='width:180px'>Hora de reporte</td>" +
	             "<td class='tb-acc' style='width:180px'>Factor de seguridad</td>" +
	             "<td class='tb-acc' style='width:180px'>Potencial de Perdida</td>" +
	             "<td class='tb-acc' style='width:160px'>Estado de observación</td>" +
	             "<td class='tb-acc' style='width:150px'>Acciones de mejora completadas / asociadas</td>" +
	          "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>" +
      "</div>");
	 
      crearSelectOneMenuObligMultipleCompleto("selMultipleObsProy","",selEstadoObs, 
         "id","nombre","#divSelectFiltroObs","Seleccione estados");
	
      $(".camposFiltroTabla").hide();
      $("#btnAplicarFiltro").hide();
	
      $("#divObsProyTabla form").on("submit",function(e){
         e.preventDefault(); 
      });
	
      resizeDivWrapper("wrapperObsProy",160);
      
      tituloAnteriorContratista = $(".divTituloGeneral h4").text();
      $(".divTituloGeneral h4").html("Consolidado Observaciones al contratista");
      
      var proyectoObjSend={
	 id: proyectoObj.id 
      };
		
      callAjaxPost(URL+'/contratista/proyecto/observaciones', 
         proyectoObjSend,procesarResumenobservacionesProyectoVistaContratista);
}

function reiniciarFiltroObsProyecto(){
	listFullObservacionesContratista.forEach(function(val,index){ 
		$("#trproyobs"+val.id).show(); 
	}); 
	$(".camposFiltroTabla").hide();
	$("#wrapperObsProy").show();
	
	$("#btnIniciarFiltro").show();
	$("#btnAplicarFiltro").hide();
}
function iniciarFiltroObsProyecto(){
	$(".camposFiltroTabla").show();
	$("#wrapperObsProy").hide();
	
	$("#btnIniciarFiltro").hide();
	$("#btnAplicarFiltro").show(); 
}
function aplicarFiltroObsProyecto(){
	$(".camposFiltroTabla").hide();
	$("#wrapperObsProy").show();
	$("#btnAplicarFiltro").hide();
	$("#btnIniciarFiltro").show(); 
	
	var listAplicados=$("#selMultipleObsProy").val();
	if(listAplicados==null){
		reiniciarFiltroObsProyecto();
		return;
	}
	var fechaInicio=$("#dateInicioFiltroObs").val();
	var fechaFin=$("#dateFinFiltroObs").val();
	listFullObservacionesContratista.forEach(function(val,index){
		var searchEstado=(listAplicados.indexOf(val.nivel+"")!=-1) 
		var hasEstado=true  ;
		var enRango=fechaEnRango(convertirFechaInput(val.fecha),fechaInicio,fechaFin);
		
		if(searchEstado){
			hasEstado=true
		}else{
			hasEstado=false;
		} 
		
		
		if( hasEstado && enRango){
			$("#trproyobs"+val.id).show();
		}else{
			$("#trproyobs"+val.id).hide();
		}
		
	});
	
}

function procesarResumenobservacionesProyectoVistaContratista(data){
   resizeDivWrapper("wrapperObsProy",160);
    
   listFullObservacionesContratista = data.list;
	
   $("#tblObsProyecto tbody tr").remove();
	
   listFullObservacionesContratista.forEach(function(val,index){
      $("#tblObsProyecto tbody").append(
         "<tr id='trproyobs"+val.id+"'>" +
	    "<td>"+val.tipo.nombre+"</td>" +
	    "<td>"+(val.descripcion.length == 0?"------":val.descripcion)+"</td>" +
	    "<td>"+val.fechaTexto+"</td>" +
	    "<td>"+(val.horaRealTexto.length == 0?"------":val.horaRealTexto)+"</td>" +
	    "<td>"+(val.factor.nombre.length == 0?"------":val.factor.nombre)+"</td>" +
	    "<td>"+val.perdida.nombre+"</td>" +
	    "<td>"+(val.nivel == 1?"En proceso":"Cerrado")+"</td>" +
	    "<td>"+val.indicadorAcciones+"</td>" +
	 "</tr>");
   });
	
   goheadfixedY("#tblObsProyecto","#wrapperObsProy");
}
