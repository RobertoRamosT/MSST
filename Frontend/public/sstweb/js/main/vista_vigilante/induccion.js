/**
 * 
 */
var listTrabajadoresInduccionVigilante;
var objInduccionVIgilante;
var listFullInduccionesVigilante;
var funcionalidadesInduccionVigilante=[ 
{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
	window.open(URL+"/contratista/induccion/informe?contratistaId="+getSession("contratistaGosstId") +
			"&induccionId="+objInduccionVIgilante.id,'_blank')
	}  },
       {id:"opcEditar",nombre:"Inscribir trabajadores",functionClick:function(data){editarTrabajadoresInduccionContratista()}  
       },
       {id:"opcEditasdfr",nombre:"Evaluación trabajadores",functionClick:function(data){verEvaluacionInduccionTrabajadoresVigilante()} 
       
       }
      ];
var funcionalidadesInduccionVigilanteCompleta=[ 
{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
	window.open(URL+"/contratista/induccion/informe?contratistaId="+getSession("contratistaGosstId") +
			"&induccionId="+objInduccionVIgilante.id,'_blank')}  
},
      
       {id:"opcEditasdfr",nombre:"Evaluación trabajadores",functionClick:function(data){verEvaluacionInduccionTrabajadoresVigilante()} 
       
       }
      ];
function verEvaluacionInduccionTrabajadoresVigilante(){
	$(".divListPrincipal>div").hide();
	var divEval=$("#inducEvaluacion");
	divEval.show();
	divEval.find(".tituloSubList").html(textoBotonVolverContenido+
				"Evaluaciones de Induccion del "+objInduccionVIgilante.fechaTexto+
				" Tema: "+objInduccionVIgilante.tema);
	divEval.find(".contenidoSubList").html("");
	
	var dataParam={
			id:objInduccionVIgilante.id,
			contratista:{id:getSession("contratistaGosstId")}
	}
	callAjaxPost(URL + '/contratista/induccion/trabajadores', dataParam, function(data) {
		var textIn="";
		var evala=data.trabajadores;
		listTrabajadoresInduccionVigilante=data.trabsExamen;
		var textTrabs="";
		listTrabajadoresInduccionVigilante.forEach(function(val,index){
			val.selected=0;
			
			evala.forEach(function(val1,index1){
				var estiloGosst="gosst-neutral";
				if(val1.trabajador.id==val.id){
					if(val1.evaluacion.id==1){
						estiloGosst="gosst-aprobado";
					}
					textIn+=("<div class='eventoGeneral "+estiloGosst+"'>" +
							 
							"<i class='fa  fa-info' aria-hidden='true'></i> <strong> " +val.nombre+"</strong><br>"+ 
							"<i class='fa  fa-info' aria-hidden='true'></i> Asistencia: " +val1.asistencia.nombre +"<br>"+ 
							"<i class='fa  fa-info' aria-hidden='true'></i> Evaluación : " +val1.evaluacion.nombre+" hora(s) <br>"+
							"</div>");
				}
			});  
			
		});
		divEval.find(".contenidoSubList").html(""+textIn);
	});
	
	
}
function marcarSubOpcionInduccionVigilante(pindex){
	funcionalidadesInduccionVigilante[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
	
	
}
function marcarSubOpcionInduccionVigilanteCompleta(pindex){
	funcionalidadesInduccionVigilanteCompleta[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
	
	
}
function toggleMenuOpcionInduccionVigilante(obj,pindex){
	objInduccionVIgilante=listFullInduccionesVigilante[pindex]; 
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
function habilitarInduccionesVigilante(){
	var	listPanelesPrincipalResumen=
		[{id:"subBuscador",clase:"divProyectoGeneral",proyectoId:null,
			nombre:"",contenido:""},
			{id:"subResult",clase:"",proyectoId:null,nombre:"",contenido:""}
	 ];
agregarPanelesDivPrincipalColaborador(listPanelesPrincipalResumen);

	
	var textoForm="";
	var listItemsForm=[
       	{sugerencia:"",label:"Fecha inicio",
    		inputForm:"<input type='date' class='form-control' " +
    				"id='fechaInicioInduccionVigilante' >",divContainer:""},
		{sugerencia:"",label:"Fecha fin",
			inputForm:"<input type='date' class='form-control' " +
					"id='fechaFinInduccionVigilante' >",divContainer:""},
	];
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModulo(val); 
	});
	///
	//$(".divListPrincipal").find("#subDetalle .tituloSubList")
	//.html("Resumen de Contratista");
	$(".divListPrincipal").find("#subResult .tituloSubList")
	.html("Resultado de búsqueda");
	$(".divListPrincipal").find("#subBuscador .tituloSubList")
	.html("Buscar inducciones");
	$("#subBuscador").find(".contenidoSubList").show().html(
			"<form class='eventoGeneral' id='buscadorVigilante'>"+
			textoForm+
			 "<button type='submit' class='btn btn-success' >" +
			 "<i aria-hidden='true' class='fa fa-search'></i>Buscar</button>"+
			"</form>"
	);
	$("#fechaInicioInduccionVigilante").val(obtenerFechaActual());
	$("#fechaFinInduccionVigilante").val(obtenerFechaActual());
	$('#buscadorVigilante').on('submit', function(e) {
	    e.preventDefault();
	    buscarInduccionesVigilante();
	}); 
	buscarInduccionesVigilante();
	
} 
function buscarInduccionesVigilante(){
	objInduccionVIgilante={id:0};
	var dataParam={ 
			empresaId : getSession("gestopcompanyid"),
			fechaInicioPresentacion : convertirFechaTexto($("#fechaInicioInduccionVigilante").val()),
			fechaFinPresentacion : convertirFechaTexto($("#fechaFinInduccionVigilante").val()),
			isVigilante : 1
			};
	callAjaxPost(URL + '/contratista/inducciones/vigilante', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			var textIn= "",textInImplementar="",textInCompletado="";
			var induccionesImplementar=0,induccionesCompletadas=0;
			listFullInduccionesVigilante=data.examenes;
			
			listFullInduccionesVigilante.forEach(function(val,index){
				
				var estiloGosst="gosst-neutral";				
				if(val.isVigente==1){
					estiloGosst="gosst-aprobado"
				}
				var hoy=new Date();
			    //
				if(val.hora==null){
			    	val.hora="23:00:00"
			    }
			   var aF=convertirFechaInput(val.fecha).split("-");
			   var aH=(val.hora).split(":");
			   aH=["23","00","00"];
			   switch (val.tipo.id){
			   case 3:
				   aH=["7","00","00"];
				   var	fechaAux=new Date(aF[0],parseInt(aF[1])-1,aF[2],aH[0],aH[1]);
				   if(fechaAux.getDay() == 4){
					   aH=["10","00","00"];
				   }
				   break;
			   case 9:
				   aH=["14","30","00"];
				   break;
			   case 10:
				   aH=["15","30","00"];
				   break;
			   case 11:
				   aH=["14","30","00"];
				   break;
			   case 12:
				   aH=["13","30","00"];
				   break;
			   case 13:
				   aH=["13","30","00"];
				   break;
			   }
			   var	fecha=new Date(aF[0],parseInt(aF[1])-1,aF[2],aH[0],aH[1]);
			  //
			    var dias=0
			    var horas=0
			    var minutos=0
			    var segundos=0
			    var textHora="";
				 var diferencia=(fecha.getTime()-hoy.getTime())/1000;
		        dias=Math.floor(diferencia/86400)
		        diferencia=diferencia-(86400*dias)
		        horas=Math.floor(diferencia/3600)
		        diferencia=diferencia-(3600*horas)
		        minutos=Math.floor(diferencia/60)
		        diferencia=diferencia-(60*minutos)
		        segundos=Math.floor(diferencia);
		        
		       
			      
		        var textFilaEvidencia="";
		        if(val.evidenciaNombre.length>0){
		        	textFilaEvidencia="<i class='fa fa-file' aria-hidden='true'></i> " +val.evidenciaNombre+"<br>";
		        } 
				var infoArray=[
				               {campo:"<i class='fa  fa-calendar' aria-hidden='true'></i>  ",
				            	   descripcion:"<strong>"+val.fechaTexto+" "+val.horaTexto+"</strong>"},
				               {campo:"<i class='fa  fa-info' aria-hidden='true'></i> Tema:",
				            	   descripcion:"<strong>"+val.tema+"</strong>"},

					               {campo:"<i class='fa  fa-map-marker' aria-hidden='true'></i>  Ubicación",
					            	   descripcion:" "+val.lugar},
				            	   
				               {campo:"<i class='fa  fa-info' aria-hidden='true'></i> Tipo: ",
				            		   descripcion:" "+val.tipo.nombre+" "},
				               {campo:"<i class='fa  fa-info' aria-hidden='true'></i> Duración: ",
			            		   descripcion:" "+val.horas+" hora(s)"},

				               {campo:"<i class='fa  fa-clock-o' aria-hidden='true'></i> Vigencia: ",
			            		   descripcion:" "+val.vigencia.nombre+" "},

					               {campo:"<i class='fa  fa-users' aria-hidden='true'></i> Trabajadores: ",
				            		   descripcion:" "+val.numTrabajadores+" <a style='margin-left: 10px;' onclick='verTrabajadoresInduccionVigilante("+index+")' class='efectoLink'><i class='fa fa-eye'></i>Ver</a>"},
				            		   ];
				var informacionTexto="";
				infoArray.forEach(function(val2){
					informacionTexto+="<tr>" +
					"<td style='width:177px;'>"+val2.campo+"</td>" +
					"<td>"+val2.descripcion+"</td>" +
					"</tr>" ;
				});
				textIn=("<div class='eventoGeneral' "+estiloGosst+"'>" +
						"<table class='table table-user-information'>" +
						"<tbody>" +
						informacionTexto+
						"</tbody>" +
						"</table>" +
						"</div>");
				textInImplementar+=textIn;
				induccionesImplementar++;
			}); 
			
			$("#subResult .tituloSubList").html("Resultado de búsqueda (" +induccionesImplementar+")")
			$("#subResult .contenidoSubList").html(textInImplementar)
 
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			 
			 
			break;
			default:
				alert("nop");
				break;
		}
	})
}
function verTrabajadoresInduccionVigilante(index){
	var dataParam = { 
			id : listFullInduccionesVigilante[index].id};
	callAjaxPost(URL+"/contratista/induccion/trabajadores",dataParam,function(data){
 
		var contenido =("<table class='table table-striped table-bordered table-hover table-fixed'"+
								"id='tblInducTrab' style='width: 100%;'>" +
						"<thead>" +
						"<th class='tb-acc' style='width: 200px;'>Contratista</th>"+
							"<th class='tb-acc' style='width: 180px'>Nombre trabajador</th>  "+
							"<th class='tb-acc' style='width: 200px;'>Documento de identidad</th>"+
						"</thead>" +
						"<tbody>" +
						"</tbody>"+
					"</table>");
		var modalOptions= {id:"modalInducc",nombre:"<i class='fa fa-users'></i> Trabajadores de inducción ",
				contenido: contenido};
		crearModalPrincipalUsuario(modalOptions,function(){},false,true); 
			var list = data.trabajadores;
			list.forEach(function(val) { 
					$("#tblInducTrab tbody").append(
							"<tr id='trhoja"+val.id+"'>" +
							"<td>"+val.trabajador.contratista.nombre+"</td>"+
							"<td>"+val.trabajador.nombre+"</td>"+
							"<td  >"+val.trabajador.tipoDocumento.nombre+" "+val.trabajador.nroDocumento+"</td>"+
							 "</tr>");
				});
	});
}