/**
 * 
 */
var listFullSugerenciasContratistas=[]; 
var listMotivoSugerencia=[]; 
var objSugerenciaContratista={id:0};
var indexSugContratista;
function toggleMenuOpcionSug(obj,pindex){
	objSugerenciaContratista=listFullSugerenciasContratistas[pindex];
	indexSugContratista=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").parent().siblings().find("ul").hide(); 	
}
var funcionalidadesSugerencias=[
                              /*  {id:"opcDescarga",nombre:"<i class='fa fa-download'></i>&nbspDescargar",functionClick:function(data){
                                window.open(URL+"/contratista/sugerencia/evidencia?id="+objSugerenciaContratista.id,"_blank");	
                                } 
                                },*/
 //   {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarSugerenciaContratista()}  },
                                {id:"opcElimnar",nombre:"<i class='fa fa-trash-o'></i>&nbspEliminar",functionClick:function(data){eliminarSugerenciaContratista()}  }
                               ]
function marcarSubOpcionSugerencia(pindex){ 
	funcionalidadesSugerencias[pindex].functionClick();
	$(".listaGestionGosst").hide();
}  

function habilitarSugerenciasContratista(){
	objSugerenciaContratista={id:0}
	var contratistaId=parseInt(getSession("contratistaGosstId"));
	var dataParam={ 
			id:(contratistaId) 
			};
	callAjaxPost(URL + '/contratista/sugerencias', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			var textIn= "";
			var textSinRevisar="",textRevisar="",textCompletos="";
			var numSugerenciasSinRevisar=0,numSugerenciasRevisadas=0,numSugerenciasCompletadas=0;
			listFullSugerenciasContratistas=data.list; 
			listMotivoSugerencia=data.motivos; 
			$(".divListPrincipal").html("");
			listFullSugerenciasContratistas.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesSugerencias.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionSugerencia("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				
				var claseGosst="gosst-neutral";
				 
				if(true ){
					claseGosst="gosst-aprobado"
				}
				if(val.fechaPlanificada!=null){
					if(val.fechaReal!=null){
						numSugerenciasCompletadas++;
						textCompletos+=("<div class='eventoGeneral "+claseGosst+"'>" +
								"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionSug(this,"+index+")'>" +
								"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
								menuOpcion+
								"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.fechaSolicitudTexto+"</strong><br>"+
								"<i class='fa fa-building-o' aria-hidden='true'></i>Motivo: " +val.motivo.nombre+"<br>"+ 
								"<i class='fa fa-address-card-o' aria-hidden='true'></i>" +val.descripcion+"<br>"+
								"<i class='fa fa-download' aria-hidden='true'></i>" +
								(val.evidenciaNombre==null?"Sin evidencia": "<a class='efectoLink' target='_blank' "
									 +"href='"+URL+"/contratista/sugerencia/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>")+"<br><br>"+
								"<strong>Datos Revisión</strong>"+"<br><br>"+
								 "<i class='fa fa-calendar' aria-hidden='true'></i>Fecha Realizada: "+val.fechaRealTexto+"<br>"+
								"<i class='fa  fa-info' aria-hidden='true'></i>Observaciones: "+val.observaciones+"<br>"+
								
								"<i class='fa  fa-arrow-right fa-2x' style='font-size: 20px;' aria-hidden='true'></i><a onclick='verCalificacionSugerencia("+index+")'> " +
								 		" Calificación de respuesta ("+(val.notaTiempo==null?"Sin calificar":val.notaTiempo)+")</a>"+
								 "</div>"  );
					}else{
						numSugerenciasRevisadas++;
						textRevisar+=("<div class='eventoGeneral "+claseGosst+"'>" +
								"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionSug(this,"+index+")'>" +
								"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
								menuOpcion+
								"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.fechaSolicitudTexto+"</strong><br>"+
								"<i class='fa fa-building-o' aria-hidden='true'></i>Motivo: " +val.motivo.nombre+"<br>"+ 
								"<i class='fa  fa-address-card-o' aria-hidden='true'></i>" +val.descripcion+"<br>"+
								"<i class='fa  fa-download' aria-hidden='true'></i>" +
								(val.evidenciaNombre==null?"Sin evidencia":"<a class='efectoLink' target='_blank' "
									 +"href='"+URL+"/contratista/sugerencia/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>")+"<br><br>"+
								"<strong>Datos Revisión</strong>"+"<br><br>"+
								"<i class='fa fa-calendar' aria-hidden='true'></i>Fecha Planificada: "+val.fechaPlanificadaTexto+"<br>"+
								 "<i class='fa  fa-info' aria-hidden='true'></i>Observaciones: "+val.observaciones+
								 "</div>"  );	
					}
					
					
					
				}else{
					numSugerenciasSinRevisar++;
					textSinRevisar+=("<div class='eventoGeneral'>" +
							"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionSug(this,"+index+")'>" +
							"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
							menuOpcion+
							"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.fechaSolicitudTexto+"</strong><br>"+
							"<i class='fa fa-building-o' aria-hidden='true'></i>Motivo: " +val.motivo.nombre+"<br>"+ 
							"<i class='fa  fa-info' aria-hidden='true'></i>" +val.descripcion+"<br>"+
							"<i class='fa  fa-download' aria-hidden='true'></i>" +(val.evidenciaNombre==null?"Sin evidencia":"<a class='efectoLink' target='_blank' "
								 +"href='"+URL+"/contratista/sugerencia/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>")+"<br>"+
							 
							 "</div>"  );
				}
				
				
			}); 
			var selMotivoSug= crearSelectOneMenuOblig("selMotivoSug", "", listMotivoSugerencia, "", 
					"id","nombre");
			
			var listItemsFormTrab=[ 
            		{sugerencia:"",label:"Fecha Solicitud",inputForm:"<input class='form-control' disabled type='date' id='inputFechaSug' >"},
            		 {sugerencia:"",label:"Motivo ",inputForm:selMotivoSug } ,
            		 {sugerencia:"",label:"Descripción solicitud",inputForm:"<input class='form-control' type='text' id='inputDescSolicitud' placeholder=' '>"},  
            		  {sugerencia:"Ej: Captura de pantalla",label:"Archivo referencia",inputForm:"" ,divContainer:"divEviSugerencia"} ,
            		 
            		 
            		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
             		];
			var listNivelSugerencia=[{id:0,nombre:"No"},{id:1,nombre:"Sí"}];
			var listTiempoSugerencia=[{id:1,nombre:"Muy Malo"},
			                          {id:2,nombre:"Malo"},
			                          {id:3,nombre:"Regular"},
			                          {id:4,nombre:"Bueno"},
			                          {id:5,nombre:"Muy Bueno"}];
			var selNivelSolucion= crearSelectOneMenuOblig("selNivelSolucion", "", listNivelSugerencia, "", 
					"id","nombre");
			var selTiempoSolucion= crearSelectOneMenuOblig("selTiempoSolucion", "", listTiempoSugerencia, "", 
					"id","nombre");
			var textSug="";
			var listItemsFormSug=[ 
			               		{sugerencia:"",label:"¿La solución resuelve su problema? ",inputForm:selNivelSolucion }  ,
			               		{sugerencia:"",label:"El tiempo de solución fue adecuado? ",inputForm:selTiempoSolucion }  ,
			               		{sugerencia:"Gracias por involucrarse con su software GOSST",label:"Comentarios",inputForm:"<input class='form-control'  id='inputComentarioSolucion' >"},
			               		  
			               		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
			                		];
			var textFormSug="";
			listItemsFormTrab.forEach(function(val,index){
				textFormSug+=obtenerSubPanelModulo(val);
			}); 
			listItemsFormSug.forEach(function(val,index){
				textSug+=obtenerSubPanelModulo(val);
			}); 
		 listPanelesPrincipal.push( 
					{id:"nuevoMovilSug" ,clase:"",
							nombre:""+"Nueva sugerencia",
							contenido:"<form id='formNuevaSugerencia' class='eventoGeneral'>"+textFormSug+"</form>"},
					{id:"calificarMovilSug" ,clase:"contenidoFormVisible",
						nombre:""+"Editar calificación de sugerencia",
						contenido:"<form id='formEditarCalSugerencia' class='eventoGeneral'>"+textSug+"</form>"},
						
						{id:"editarMovilSug" ,clase:"contenidoFormVisible",
							nombre:""+"Editar asd",
							contenido:"<form id='formEditarSugerencia' class='eventoGeneral'>"+textFormSug+"</form>"},
							
						{id:"sugCompletadasContratista",clase:"divSugerenciaContratistaGeneral",
							nombre:"Sugerencias Completadas (" +numSugerenciasCompletadas+")",
							contenido:textCompletos},
						{id:"sugRevisadasContratista",clase:"divSugerenciaContratistaGeneral",
							nombre:"Sugerencias Revisadas (" +numSugerenciasRevisadas+")",
							contenido:textRevisar},
						{id:"sugContratista",clase:"divSugerenciaContratistaGeneral",
							nombre:"Sugerencias Sin Revisar (" +numSugerenciasSinRevisar+")",
							contenido:textSinRevisar});
		 
		 
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			var hoy=new Date();
			var hoyTexto=convertirFechaInput(hoy);
			$("#nuevoMovilSug #inputFechaSug").val(hoyTexto);
			var options=
			{container:"#divEviSugerencia",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"Sugerencia0",
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
			
			
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			
			 $('#formNuevaSugerencia').on('submit', function(e) {  
			        e.preventDefault();
			        objSugerenciaContratista={id:0}
			        guardarSugerenciaContratista();
			 });
			 $('#formEditarSugerencia').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarSugerenciaContratista();
			 });
			 $('#formEditarCalSugerencia').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarCalificacionSugerenciaContratista();
			 }); 
			break;
			default:
				alert("nop");
				break;
		}
	})
	
} 
  
function editarSugerenciaContratista(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilSug");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar sugerencia "); 
	editarDiv.find("#inputFechaSug").val(convertirFechaInput(objSugerenciaContratista.fechaSolicitud));  
	editarDiv.find("#selMotivoSug").val(objSugerenciaContratista.motivo.id); 
editarDiv.find("#inputDescSolicitud").val(objSugerenciaContratista.descripcion); 
 
	var options=
	{container:"#editarMovilSug #divEviSugerencia",
			functionCall:function(){},
			descargaUrl: "/contratista/trabajador/foto/evidencia?id="+objSugerenciaContratista.id,
			esNuevo:false,
			idAux:"Sugerencia"+objSugerenciaContratista.id,
			evidenciaNombre:objSugerenciaContratista.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
}

function guardarSugerenciaContratista(){
	
	var formDiv=$("#editarMovilSug");
	if(objSugerenciaContratista.id==0){
		formDiv=$("#nuevoMovilSug");
	}
	var campoVacio = true; 
var motivo=formDiv.find("#selMotivoSug").val();
var descripcion=formDiv.find("#inputDescSolicitud").val();
var inputFechaSug=formDiv.find("#inputFechaSug").val();
var textoCampos=""; 
		if (textoCampos.length==0) {

			var dataParam = {
				id : objSugerenciaContratista.id,   
				motivo:{id:motivo},
				descripcion:descripcion,modulos:[{id:22}],
				contratista:{id:getSession("contratistaGosstId")}
			};
 
			callAjaxPost(URL + '/contratista/sugerencia/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							guardarEvidenciaAuto(data.nuevoId,"fileEviSugerencia"+ objSugerenciaContratista.id
									,bitsEvidenciaPostulante,"/contratista/sugerencia/evidencia/save",
									function(){
								verAlertaSistemaGosst(1,"Sugerencia guardada correctamente")
								habilitarSugerenciasContratista();
							}); 
							
							break;
						default:
							console.log("Ocurrió un error al guardar la sug!");
						}
					});
			 
		} else {
			alert("Debe ingresar los campos: "+textoCampos);
		} 
	
}
function guardarCalificacionSugerenciaContratista(){
	
	var formDiv=$("#calificarMovilSug"); 
	var campoVacio = true; 
var notaResuelve=formDiv.find("#selNivelSolucion").val();
var notaTiempo=formDiv.find("#selTiempoSolucion").val();
var comentario=formDiv.find("#inputComentarioSolucion").val();
var textoCampos=""; 
		if (textoCampos.length==0) {

			var dataParam = {
				id : objSugerenciaContratista.id,   
				notaTiempo:notaTiempo,
				notaResuelve:notaResuelve,comentario:comentario
			};

			callAjaxPost(URL + '/contratista/calificacion/sugerencia/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							habilitarSugerenciasContratista();
							
							break;
						default:
							console.log("Ocurrió un error al guardar la sug!");
						}
					});
			 
		} else {
			alert("Debe ingresar los campos: "+textoCampos);
		} 
	
}

function eliminarSugerenciaContratista() {
	 
	var r = confirm("¿Está seguro de eliminar la sugerencia?");
	if (r == true) {
		var dataParam = {
				id :  objSugerenciaContratista.id,
		};

		callAjaxPost(URL + '/contratista/sugerencia/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarSugerenciasContratista();
						 
						break;
					default:
						alert("Ocurrió un error al eliminar la sug!");
					}
				});
	}
}


 
function verCalificacionSugerencia(pindex){
	objSugerenciaContratista=listFullSugerenciasContratistas[pindex];
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#calificarMovilSug");
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar calificación sugerencia "); 
	editarDiv.show();
	editarDiv.find("#selNivelSolucion").val(objSugerenciaContratista.notaResuelve);
	editarDiv.find("#selTiempoSolucion").val(objSugerenciaContratista.notaTiempo);
	editarDiv.find("#inputComentarioSolucion").val(objSugerenciaContratista.comentario);
	
	
	
	
	
	
}


