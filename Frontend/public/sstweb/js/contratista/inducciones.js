var induccionObj={};
var banderaEdicion4i=false;  
var listFullInduccion;
var listTipoInduccion;
var listTipoVigenciaInduccion;
var listFullEvaluacionInduccion=[];
var fechaFinVigencia;
var listTipoVirtualInduccion = [];
var listCapacitacionOnlineInduccion = [];
var listPefilContratistaInduccion = [];

var mensajeUx;

$(function(){
	$("#btnNuevoInduccion").attr("onclick", "javascript:nuevoInduccion();");
	$("#btnCancelarInduccion").attr("onclick", "javascript:cancelarNuevoInduccion();");
	$("#btnGuardarInduccion").attr("onclick", "javascript:guardarInduccion();");
	$("#btnEliminarInduccion").attr("onclick", "javascript:eliminarInduccion();");
	$("#btnGenReporteInd").attr("onclick", "verModalReporteInduccion();");
	$("#btnRegularizarInducc").attr("onclick", "verRegulizarInduccion();");

	$("#btnGenReporteIndFinal").attr("onclick", "generarReporteInduccionContratista();");
	var hoy=obtenerFechaActual();
	$("#fechaInicioEventoInducc").val(sumaFechaDias(-7,hoy));
	$("#fechaFinEventoInducc").val(sumaFechaDias(365,hoy));
	
})
/**
 * 
 */
var listContratistasRegularizar=[];
function verRegulizarInduccion(){
	$("#tabInduccion .container-fluid").hide();
	$("#divRegularizarInduccion").show();
	$("#tblTrabInduccion tbody").html("");
	$("#tabInduccion h2").html("<a onclick='volverDivInduccion()'> " +
			"Inducciones </a> >  Regularización");
	$("#btnGuardarRegularizarInduccion").attr("onclick","guardarRegularizacionInduccion()");
	
   callAjaxPost(URL + '/contratista', 
			{empresaId:getSession("gestopcompanyid")}, function(data){
      $("#tblRegInduccion tbody tr").remove();
					
				listContratistasRegularizar=data.list
		 crearSelectOneMenuObligMultipleCompleto("selMultipleContratistas", "verAcordeContratistaTrabs()", data.list, 
					"id","nombre","#divSelectContratistasReg","Seleccione Contratistas");
      var options={
	 container:"#eviRegularizacionInduccion",functionCall:function(){
	    validacionSubirEvidencia("InduccionReg",bitsEvidenciaExamen,"");
         },descargaUrl:"",esNuevo:true,idAux:"InduccionReg",
         evidenciaNombre:""
      };
			
      crearFormEvidenciaAmazonS3Completa(options);
      resizeDivWrapper("wrapperInduccReg",220)
   });	
}
var listTrabajadoresContratistasRegularizar = [];
function verAcordeContratistaTrabs(){
	$("#tblRegInduccion tbody tr").remove();
	var listSelect=$("#selMultipleContratistas").val();
	var contratistasList = [];
	listSelect.forEach(function(val){
		contratistasList.push(parseInt(val));
	});
	//Es mejor asegurar la mayoría de la lógica en el BACKEND
	//if(contratistasList.length == 0){
	//	contratistasList = null;
	//}
	callAjaxPost(URL+"/contratista/trabajadores/buscar",{empresaId:getSession("gestopcompanyid"),
	    hasLimit:0,listContratistasId : contratistasList},function(data){
		listTrabajadoresContratistasRegularizar = data.trabajadores;
		listTrabajadoresContratistasRegularizar.forEach(function(val,index){
					$("#tblRegInduccion tbody")
					.append("<tr>" +
							"<td>"+"<input id='checkRegInduc"+val.id+"' type='checkbox' class='form-control' >"+"</td>" +
							"<td>"+val.contratista.nombre+"</td>" +
							"<td>"+val.tipoDocumento.nombre+": "+val.nroDocumento+"</td>" +
							"<td>"+val.nombre+" "+val.apellido+"</td>" +
							"" +
							"" +
							"</tr>")
				 
			
		});
	});
	
}

function guardarRegularizacionInduccion(){
   var campoVacio = true; 
    
	var listTrabs=[];
	listTrabajadoresContratistasRegularizar.forEach(function(val,index){ 
				var ischeck=$("#checkRegInduc"+val.id).prop("checked");
				if(ischeck){
					listTrabs.push({
						evaluacion:{id:1},
						asistencia:{id:1},
						trabajador:{id:val.id}
					})
				}
			 
		
	});
	
   var fechaSend = convertirFechaTexto($("#dateRegularizacionInduccion").val());
   var inputFechaSend = (!fechaSend?null:fechaSend);
	
   var evidenciaNombre = $("#inputEviInduccionReg").val();
   
   if(inputFechaSend == null){
      campoVacio = false;
      mensajeUx = "<label>Debe ingresar la 'fecha realizada'.</label>";
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      campoVacio = false
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
   }
	
   if(campoVacio){
	var induccionSend={
		id:0,
		tipo:{id:3},
		fechaReal:inputFechaSend,
		fecha:inputFechaSend,
		hora:"12:00:00",
		cupo:100,
		vigencia:{id:4},
		tema:"REGULARIZACIÓN "+listTrabs.length+" TRABAJADOR(ES)",
		profesor:"",
		horas:"1",
		evaluaciones:listTrabs,
		empresa:{empresaId:getSession("gestopcompanyid")}
		
	};
	
      callAjaxPostSimple(URL+'/contratista/induccion/regularizacion/save',induccionSend,1,function(data){
         guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviInduccionReg",bitsEvidenciaExamen,
         0,1,"/contratista/amazon_s3/examen/evidencia/save","contratista-has-examen/evidencia",function(){
            mensajeUx = "<label>Se guardó la inducción.</label>";
	    mensajesUx(mensajeUx,1,"","");
         
            cargarInduccionsSeguridad();  
         }); 
      });
   }else{
      mensajesUx(mensajeUx,2,"","");
   }
}
		
function cargarInduccionsSeguridad(){
   resizeDivWrapper("wrapInduccEmpresa",160);
    
   $("#btnCancelarInduccion").hide();$("#btnNuevoInduccion").show();$("#btnEliminarInduccion").hide();
   $("#btnGuardarInduccion").hide();$("#btnGenReporteInd").hide();$("#btnRegularizarInducc").show();
   $("#btnListaConsolidadoInducciones").show();
	
   induccionObj = {};volverDivInduccion();
   
   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid")),fechaInicioPresentacion:$("#fechaInicioEventoInducc").val(),
      fechaFinPresentacion:$("#fechaFinEventoInducc").val()   
   };
	
   callAjaxPost(URL+'/contratista/inducciones',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         listFullInduccion = data.examenes;listTipoInduccion = data.tipo;listTipoVigenciaInduccion = data.vigencia;
         listTipoVirtualInduccion = data.tipoVirtual;listCapacitacionOnlineInduccion = data.capacitacionesOnline;
         listPefilContratistaInduccion = data.perfilesContratista;	
         banderaEdicion4i = false;
					
         $("#tblInduccions tbody tr").remove();
					
         listFullInduccion.forEach(function(val,index){  
            var tema = (val.tema.length == 0?"------":val.tema),profesor = (val.profesor.length == 0?"------":val.profesor),
               lugar = (val.lugar.length == 0?"------":val.lugar),link = (val.link.length == 0?"------":val.link),
               evidenciaNombre = (val.evidenciaNombre.length == 0?"------":val.evidenciaNombre),
               curso = (val.tipoVirtual.id == 2?val.curso.nombre:"<label>*No aplica.</label>");
             
            $("#tblInduccions tbody:first").append(
	       "<tr id='trind"+val.id+"' onclick='editarInduccion("+index+")'>" +
	          "<td id='indtipo"+val.id+"'>"+val.tipo.nombre+"</td>" +
	          "<td id='indperfc"+val.id+"'>"+val.perfilesContratistaNombre+"</td>" +
	          "<td id='indfecha"+val.id+"'>"+val.fechaTexto+"</td>" +
	          "<td id='indtime"+val.id+"'>"+val.horaTexto+"</td>" + 
	          "<td id='indvig"+val.id+"'>"+val.vigencia.nombre+"</td>" + 
	          "<td id='indtema"+val.id+"'>"+tema+"</td>" +
	          "<td id='indlugar"+val.id+"'>"+lugar+"</td>" +
	          "<td id='indprofe"+val.id+"'>"+profesor+"</td>" +
	          "<td id='indhoras"+val.id+"'>"+val.horas+"</td>" +
	          "<td id='indcupo"+val.id+"'>"+val.cupo+"</td>" +
	          "<td id='indtrabs"+val.id+"'>"+val.numTrabajadores+"</td>" +
	          "<td id='fecharealind"+val.id+"'>"+val.fechaRealTexto+"</td>" +
	          "<td id='indfechafin"+val.id+"'>"+val.fechaFinVigenciaTexto+"</td>" +
	          "<td id='eviinduc"+val.id+"'>"+evidenciaNombre+"</td>" +
	          "<td id='indtipvir"+val.id+"'>"+val.tipoVirtual.nombre+"</td>" + 
	          "<td id='indcapvir"+val.id+"'>"+curso+"</td>" + 
	          "<td id='indlinkvir"+val.id+"'>"+link+"</td>" + 
            "</tr>");
         });

         formatoCeldaSombreableTabla(true,"tblInduccions"); 

         goheadfixedY("#tblInduccions","#wrapInduccEmpresa");
					
         listFullInduccion.forEach(function(val,index){ 
            if(parseInt(getSession("linkCalendarioInduccionId")) == val.id){
	       editarInduccion(index);
	       sessionStorage.removeItem("linkCalendarioInduccionId");
            }
         });
      }else{
	 console.log("NOPNPO")
      }
   });
}

function editarInduccion(pindex){
   if(!banderaEdicion4i){
      formatoCeldaSombreableTabla(false,"tblInduccions"); 
      induccionObj = listFullInduccion[pindex];
      
      $("#trind"+induccionObj.id).addClass("fila-edicion");
		
      var fechaFinVigencia = convertirFechaInput(induccionObj.fechaFinVigencia);
		
      var perfilesId = induccionObj.perfilesContratistaId.split(",");
      
      listPefilContratistaInduccion.forEach(function(val){
         val.selected = 0;
			
         perfilesId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected=1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcPermitePerfilesInduccion","",listPefilContratistaInduccion,
         "id","nombre","#indperfc"+induccionObj.id,"Asociados...");
								
      var selTipoVirtualInduccionContratista = crearSelectOneMenuOblig("selTipoVirtualInduccionContratista","habilitarCapacitacionOnlineCursoInduccion()",
	 listTipoVirtualInduccion,induccionObj.tipoVirtual.id,"id","nombre");
			
      $("#indtipvir"+induccionObj.id).html(selTipoVirtualInduccionContratista); 
			 
      $("#indlinkvir"+induccionObj.id).html("<input type='text' id='inputLinkInduc' class='form-control'>");
      $("#inputLinkInduc").val(induccionObj.link);	
			
      var selTipoInduccionContratista = crearSelectOneMenuOblig("selTipoInduccionContratista","",listTipoInduccion,
	 induccionObj.tipo.id,"id","nombre");
		
      $("#indtipo"+induccionObj.id).html(selTipoInduccionContratista); 
      
      var fecha = convertirFechaInput(induccionObj.fecha);
		  
      $("#indfecha"+induccionObj.id).html("<input type='date' id='inputFechaInduc' class='form-control'>");
      $("#inputFechaInduc").val(fecha);
      
      var fechaReal = convertirFechaInput(induccionObj.fechaReal);
      
      $("#fecharealind"+induccionObj.id).html("<input type='date' id='inputFechaRealInduc' class='form-control' onblur='hallarFechaFinVigencia("+induccionObj.id+")'>");
      $("#inputFechaRealInduc").val(fechaReal);

    /*$("#indfechafin" + induccionObj.id).html(	"<input type='date' id='inputFechaVigenciaInduc' class='form-control'>");
      $("#inputFechaVigenciaInduc").val(fechaFinVigencia); */
		
      $("#indtime"+induccionObj.id).html("<input type='time' id='inputTimeInduc' class='form-control'>");
      $("#inputTimeInduc").val(induccionObj.hora);	
			
      var selTipoVigenciaInduccion = crearSelectOneMenuOblig("selTipoVigenciaInduccion","hallarFechaFinVigencia("+induccionObj.id+")",
	 listTipoVigenciaInduccion ,induccionObj.vigencia.id,"id","nombre");
		
      $("#indvig"+induccionObj.id).html(selTipoVigenciaInduccion); 

      $("#indtema"+induccionObj.id).html("<input type='text' id='inputTemaInduc' class='form-control'>");
      $("#inputTemaInduc").val(induccionObj.tema);
		
      $("#indlugar"+induccionObj.id).html("<input type='text' id='inputLugarInduc' class='form-control'>");
      $("#inputLugarInduc").val(induccionObj.lugar);		
      
      $("#indprofe"+induccionObj.id).html("<input type='text' id='inputProfeInduc' class='form-control'>");
      $("#inputProfeInduc").val(induccionObj.profesor); 
      
      $("#indhoras"+induccionObj.id).html("<input type='number' id='inputHorasInduc' class='form-control'>");
      $("#inputHorasInduc").val(induccionObj.horas);

      $("#indcupo"+induccionObj.id).html("<input type='number' id='inputCupoInduc' class='form-control'>");
      $("#inputCupoInduc").val(induccionObj.cupo);
		
      var textTrab = $("#indtrabs"+induccionObj.id).text();
		
      $("#indtrabs"+induccionObj.id).addClass("linkGosst").on("click",function(){verTrabajadoresInduccion();})
      .html("<i class='fa fa-list fa-2x' aria-hidden='true' ></i>"+textTrab);
	
      var options={
	 container:"#eviinduc"+induccionObj.id,functionCall:function(){
            validacionSubirEvidencia("InduccionEmp",bitsEvidenciaExamen,"");
	 },descargaUrl:induccionObj.evidenciaUrl,
	 esNuevo:(induccionObj.evidenciaNombre.length == 0?true:false),
	 idAux:"InduccionEmp",evidenciaNombre:induccionObj.evidenciaNombre
      };
			
      crearFormEvidenciaAmazonS3Completa(options);
      
      habilitarCapacitacionOnlineCursoInduccion();
      
      if(induccionObj.numTrabajadores > 0){
	 $("#selTipoInduccionContratista").prop("disabled",true);$("#selTipoVirtualInduccionContratista").prop("disabled",true);
	 $("#selCapacitacionInduccionContratista").prop("disabled",true);
      }
			
      banderaEdicion4i = true;
		
      $("#btnCancelarInduccion").show();$("#btnNuevoInduccion").hide();$("#btnEliminarInduccion").show();
      $("#btnGuardarInduccion").show();$("#btnGenReporteInd").show();$("#btnRegularizarInducc").hide();
      $("#btnListaConsolidadoInducciones").hide();
   }
}

function verTrabajadoresInduccion(){
   $("#tabInduccion .container-fluid").hide();
   $("#divTrabInduccion").show();
   $("#tblTrabInduccion tbody").html("");
   $("#tabInduccion h2").html("<a onclick='volverDivInduccion()'> " +
      "Induccion "+induccionObj.tema+"</a> > Trabajadores");
	
   $("#btnGuardarEvalsInduccion").attr("onclick","guardarEvaluacionInduccionTrabajadorGeneral()");
   
   resizeDivWrapper("wrapTrabInducc",180);
	
   callAjaxPost(URL+'/contratista/induccion/trabajadores',{id: induccionObj.id},function(data){
      listFullEvaluacionInduccion = data.trabajadores;
      var tipoNota = data.nota;
      var tipoAsistencia = data.asistencia;
      
      tipoNota = tipoNota.filter(function(val,index){
         if(val.id == 2){
	    val.nombre = "Desaprobado";
         }
			 
         return true;
      }); 
			
      listFullEvaluacionInduccion.every(function(val2,index2){
         var selAsistInduccion = crearSelectOneMenuOblig("selAsistInduccion",
            "guardarEvaluacionInduccionTrabajador("+val2.id+")",tipoAsistencia,val2.asistencia.id,"id","nombre");
				
         var selNotaInduccion = crearSelectOneMenuOblig("selNotaInduccion","guardarEvaluacionInduccionTrabajador("+val2.id+")",
            tipoNota,val2.evaluacion.id,"id","nombre");
         
         $("#tblTrabInduccion tbody").append(
	    "<tr id='evalTrabInd"+val2.id+"'>" +
	       "<td id='"+val2.id+"'>"+val2.trabajador.contratista.nombre+"</td>" +
	       "<td id='"+val2.id+"'>"+val2.trabajador.apellido+" , "+val2.trabajador.nombre+"</td>" + 
	       "<td id='"+val2.id+"'>"+selAsistInduccion+"</td>" +  
	       "<td id='"+val2.id+"'>"+selNotaInduccion+"</td>" +  
	       "<td id='"+val2.id+"'>"+"<input class='form-control' id='inputObsEvalTrab"+val2.id+"'>"+"</td>" +  
	    "</tr>");
			 
         $("#inputObsEvalTrab"+val2.id).val(val2.observacion);
				 
         return true;
      });
      
      goheadfixedY("#tblTrabInduccion","#wrapTrabInducc");
   }); 	
}

function guardarEvaluacionInduccionTrabajadorGeneral(){
	var evalTotal=[]
	listFullEvaluacionInduccion.forEach(function(val,index){
		var evalId=val.id;
		var evaluacion=$("#evalTrabInd"+evalId).find("#selNotaInduccion").val();
		var asistencia=$("#evalTrabInd"+evalId).find("#selAsistInduccion").val();
		var observacion=$("#evalTrabInd"+evalId).find("#inputObsEvalTrab"+evalId).val();
		var evalObj={id:evalId ,
			observacion:observacion,
			asistencia:{id:asistencia},
			evaluacion:{id:evaluacion}}
		evalTotal.push(evalObj)
	});
	
	callAjaxPostNoLoad(URL + '/contratista/induccion/trabajador/evaluacion/general/save', 
			evalTotal, function(data){
				volverDivInduccion();
				alert("Evaluaciones guardadas");
			 });
	
}
function guardarEvaluacionInduccionTrabajador(evalId){
	var evaluacion=$("#evalTrabInd"+evalId).find("#selNotaInduccion").val();
	var asistencia=$("#evalTrabInd"+evalId).find("#selAsistInduccion").val();
	var observacion=$("#evalTrabInd"+evalId).find("#inputObsEvalTrab").val();
	
	callAjaxPostNoLoad(URL + '/contratista/induccion/trabajador/evaluacion/save', 
			 {id:evalId ,
		observacion:observacion,
		asistencia:{id:asistencia},
		evaluacion:{id:evaluacion}}, function(data){
				 
			 });
}
function verModalReporteInduccion(){
	$("#modalReporteInduccion").modal("show");
	callAjaxPost(URL + '/contratista/induccion/trabajadores', 
			 {id:induccionObj.id  }, function(data){
				var contratistasSelInducc=[];
				var contratistasListaId=[];
				var trabajadores=data.trabajadores;
				trabajadores.forEach(function(val,index){
					var contratistaIdval=val.trabajador.contratista.id; 
					if(contratistasListaId.indexOf(contratistaIdval)==-1){
						contratistasListaId.push(contratistaIdval);
						contratistasSelInducc.push(val.trabajador.contratista);
					}
				});
				
			var selContratsitaInduc=	crearSelectOneMenuOblig("selContratsitaInduc", "", contratistasSelInducc, "",
					"id","nombre");
			$("#divSelContratistaInduccion").html(selContratsitaInduc);
				
			 })
	
}
function generarReporteInduccionContratista(){
	window.open(URL
			+ "/contratista/induccion/informe?induccionId="+induccionObj.id 
			+"&contratistaId="
			+$("#selContratsitaInduc").val() , '_blank');	
}
function volverDivInduccion(){
	$("#tabInduccion .container-fluid").hide();
	$("#divContainInduccion").show();
	$("#tabInduccion h2").html("Inducciones de Seguridad Interno")
}
 
function nuevoInduccion(){
   if(!banderaEdicion4i){
      induccionObj.id = 0;induccionObj.tipoVirtual = {};induccionObj.curso = {};
		
      var selTipoInduccionContratista = crearSelectOneMenuOblig("selTipoInduccionContratista","",listTipoInduccion,
	 "","id","nombre");
      
      var selTipoVigenciaInduccion = crearSelectOneMenuOblig("selTipoVigenciaInduccion","hallarFechaFinVigencia("+induccionObj.id+")",
	 listTipoVigenciaInduccion,"","id","nombre"); 

      var selTipoVirtualInduccionContratista = crearSelectOneMenuOblig("selTipoVirtualInduccionContratista","habilitarCapacitacionOnlineCursoInduccion()",
	 listTipoVirtualInduccion,induccionObj.tipoVirtual.id,"id","nombre");
	
      $("#tblInduccions tbody:first").prepend(
         "<tr id='0'>" + 
            "<td>"+selTipoInduccionContratista+"</td>" +
            "<td id='indperfc0'></td>" +
            "<td><input type='date' id='inputFechaInduc' class='form-control'></td>" +
            "<td><input type='time' id='inputTimeInduc' class='form-control'></td>" +
            "<td>"+selTipoVigenciaInduccion+"</td>" +
            "<td><input type='text' id='inputTemaInduc' class='form-control'></td>" +
            "<td><input type='text' id='inputLugarInduc' class='form-control'></td>" +
            "<td><input type='text' id='inputProfeInduc' class='form-control'></td>" +
            "<td><input type='number' id='inputHorasInduc' class='form-control'></td>" +
            "<td><input type='number' id='inputCupoInduc' class='form-control'></td>" +
            "<td>...</td>" +
            "<td><input type='date' id='inputFechaRealInduc' class='form-control' onblur='hallarFechaFinVigencia("+induccionObj.id+")'></td>" +
            "<td id='indfechafin0'>(Ingresar fecha realizada y seleccionar vigencia)</td>" +
            "<td id='eviinduc0'></td>" +
	    "<td id='indtipvir0'>"+selTipoVirtualInduccionContratista+"</td>" +
	    "<td id='indcapvir0'></td>" +
	    "<td id='indlinkvir'><input type='text' id='inputLinkInduc' class='form-control'></td>" +
	 "</tr>");

      crearSelectOneMenuObligMultipleCompleto("slcPermitePerfilesInduccion","",listPefilContratistaInduccion,
         "id","nombre","#indperfc"+induccionObj.id,"Asociados...");
      
      var options={
	 container:"#eviinduc0",functionCall:function(){
	    validacionSubirEvidencia("InduccionEmp",bitsEvidenciaExamen,"");
	 },descargaUrl:"",esNuevo:true,idAux:"InduccionEmp",evidenciaNombre:""
      };
				
      crearFormEvidenciaAmazonS3Completa(options);
      
      habilitarCapacitacionOnlineCursoInduccion();
		
      $("#inputTimeInduc").val("12:00:00");
      
      $("#btnCancelarInduccion").show();$("#btnNuevoInduccion").hide();$("#btnEliminarInduccion").hide();
      $("#btnGuardarInduccion").show();$("#btnGenReporteInd").hide();$("#btnRegularizarInducc").hide();
      $("#btnListaConsolidadoInducciones").hide();
      
      banderaEdicion4i = true;
      formatoCeldaSombreableTabla(false,"tblInduccions"); 
   }else{
      alert("Guarde primero.");
   }
}

function habilitarCapacitacionOnlineCursoInduccion(){
   var modalidadInduccion = parseInt($("#selTipoVirtualInduccionContratista").val());
   
   if(modalidadInduccion == 2){
      var selCapacitacionInduccionContratista = crearSelectOneMenuOblig("selCapacitacionInduccionContratista","",listCapacitacionOnlineInduccion,
 	 induccionObj.curso.id,"id","nombre"); 
      
      $("#indcapvir"+induccionObj.id).html(selCapacitacionInduccionContratista); 
   }else{
      $("#indcapvir"+induccionObj.id).html("<label>*No aplica.</label>"); 
   }
}

function cancelarInduccion(){
   cargarTiposContratista();
}

function eliminarInduccion(){
   mensajeUx="<label>¿Está seguro de eliminar el registro de inducción seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","InduccionSegInt");

   $("#btnDevolverValorInduccionSegInt").on("click",function(){
      var dataParam={
    	 id:induccionObj.id,bucketNombre:BUCKETAMAZONS3
      };
			
      callAjaxPost(URL+'/contratista/induccion/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx = "<label>El registro de inducción fue eliminado con éxito.</label>"; 
	       mensajesUx(mensajeUx,1,"","ActualizarInduccionSegInt");
	               
	       $("#modalMensajeUxActualizarInduccionSegInt").on("hidden.bs.modal",function(){
		  cargarInduccionsSeguridad(); 
	       });
	  	       
	       break;
						
	    default:
	       alert("Ocurrió un error al eliminar el registro de inducción!");
         }	
      });
   });
}

function guardarInduccion(){
   var campoVacio = true;
   
   var tipo = $("#selTipoInduccionContratista").val();   
   var vigencia = $("#selTipoVigenciaInduccion").val();   
   var fecha = $("#inputFechaInduc").val();
   var fechaReal = $("#inputFechaRealInduc").val();   
   var fechaFinVigenciaAuto = convertirFechaTexto(fechaFinVigencia);  
   var tema = $("#inputTemaInduc").val();   
   var profesor = $("#inputProfeInduc").val();   
   var horas = $("#inputHorasInduc").val();   
   var cupo = $("#inputCupoInduc").val();   
   var time = $("#inputTimeInduc").val();
   var lugar = $("#inputLugarInduc").val();
   var tipoVirtualId = $("#selTipoVirtualInduccionContratista").val();
   var link = $("#inputLinkInduc").val();
   var capacitacionId = $("#selCapacitacionInduccionContratista").val();
   
   var perfiles = $("#slcPermitePerfilesInduccion").val();
   var listPerfiles = [];
   
   perfiles.forEach(function(val,index){
      listPerfiles.push({id:val});
   });
   
   var evidenciaNombre = $("#inputEviInduccionEmp").val();
   
   if(tipoVirtualId == 2 && listCapacitacionOnlineInduccion.length == 0){
      mensajeUx = "<label>No hay cursos registrados para asignar a una inducción virtual.</label>";
      campoVacio = false;
   }else if(evidenciaNombre == "VOLVER A SUBIR"){
      mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
      campoVacio = false;
   }
   
   if(campoVacio){
      var nombreInduccion = "";
	
      listTipoInduccion.forEach(function(val){
         if(val.id == tipo){
	    nombreInduccion = val.nombre;
         }
      });
      
      var dataParam={
	 id:induccionObj.id,perfilesContratista:listPerfiles,link:link,curso: {id:capacitacionId},tipoVirtual: {id:tipoVirtualId},
	 tipo: {id:tipo,nombre:nombreInduccion},hora:time,lugar:lugar,fecha:convertirFechaTexto(fecha),vigencia: {id:vigencia},
	 fechaTexto:convertirFechaNormal(convertirFechaTexto(fecha)),fechaReal:convertirFechaTexto(fechaReal),horas:horas,
	 fechaFinVigencia:fechaFinVigenciaAuto,tema:tema,profesor:profesor,cupo:cupo,empresa: {empresaId:getSession("gestopcompanyid"),
	 name:getSession("gestopcompanyname")}
      };

      callAjaxPostSimple(URL+'/contratista/induccion/save',dataParam,1,function(data){
	 switch(data.CODE_RESPONSE){
	    case "05":
	       guardarEvidenciaAutoVersionS3(1,data.nuevoId,"fileEviInduccionEmp",bitsEvidenciaExamen,
	       0,1,"/contratista/amazon_s3/examen/evidencia/save","contratista-has-examen/evidencia",function(){
	          mensajeUx = "<label>El registro de la inducción se guardo correctamente.</label>";
	          mensajesUx(mensajeUx,1,"","ActualizarInduccionSegInt");
	               
	          $("#modalMensajeUxActualizarInduccionSegInt").on("hidden.bs.modal",function(){
		     cargarInduccionsSeguridad(); 
	          });
	       }); 
	    
	       break;

	    default:
	       console.log("Ocurrió un error al guardar la inducción!");
	 }
      });
   }else{
      mensajesUx(mensajeUx,2,"","");
   }	
}

function cancelarNuevoInduccion(){
   cargarInduccionsSeguridad();
}

function hallarFechaFinVigencia(progId){
	
   var frecuenciaRevision = parseInt($("#selTipoVigenciaInduccion").val());
   
   var fechaPlanificadaTexto = $("#inputFechaRealInduc").val();
   
   //var fechaHoy=obtenerFechaActual();
   
   if(frecuenciaRevision != -1 && fechaPlanificadaTexto!=''){
      switch(frecuenciaRevision){
         case 1:
            fechaFinVigencia = sumaFechaDias(30,fechaPlanificadaTexto);
	 break;
	 case 2:
	    fechaFinVigencia = sumaFechaDias(90,fechaPlanificadaTexto);
	 break;
	 case 3:
	    fechaFinVigencia = sumaFechaDias(180,fechaPlanificadaTexto);
	 break;
	 case 4:
	    fechaFinVigencia = sumaFechaDias(360,fechaPlanificadaTexto);
	 break;
	 case 5:
	    fechaFinVigencia = sumaFechaDias(720,fechaPlanificadaTexto);
	 break;
	 case 6:
	    fechaFinVigencia = sumaFechaDias(10800,fechaPlanificadaTexto);
	 break;
       }
      
       //console.log(fechaFinVigencia);
       $("#indfechafin"+progId).html(fechaFinVigencia.split('-').reverse().join('-'));
	 
    }else{
       $("#indfechafin"+progId).html("(Ingresar fecha realizada y seleccionar vigencia)");
    }
}

var listOpcConsolidadoInduccion=[
   {id:1,nombre:"Trabajadores inscritos según inducción programada por el cliente"}
];

function ocultarConsolidadosExcelInduccion(){
   $("#modalConsolidadosExcelInducc").modal("hide");
}

function verConsolidadosExcelInduccion(){
   $("#modalConsolidadosExcelInducc").remove();

   var selOpcConExcelInducc = crearSelectOneMenuOblig("selOpcConExcelInducc",
      "verAcordeConsolidadosExcelInduccion()",listOpcConsolidadoInduccion,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcConExcelInducc,divContainer:"divSelConExcelInducc"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarConsolidadosExcelInduccion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='descargarConsolidadosExcelInduccion()'>" +
                    "<i class='fa fa-download'></i> Descargar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalConsolidadosExcelInducc",nombre:"<i class='fa fa-list'></i> Seleccionar - Consolidado excel",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeConsolidadosExcelInduccion();
}

function verAcordeConsolidadosExcelInduccion(){
   $(".atributo-consolidadoExcelInducc").remove(); 
   var listContenidoDivSelConExcelInducc = [];
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelInducc").val());
   
   if([1].includes(opcConsolidadoExcel)){
      listContenidoDivSelConExcelEvalDocProy=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
          inputForm:"<input type='date' id='fechaInicioConsolidadoInducc' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
          inputForm:"<input type='date' id='fechaFinConsolidadoInducc' class='form-control'>"}                                        
      ]; 
   }
   
   var contenido = "";
   
   listContenidoDivSelConExcelEvalDocProy.forEach(function(val){
      val.clase = "atributo-consolidadoExcelInducc";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelConExcelInducc").parent().after(contenido);
   
   if([1].includes(opcConsolidadoExcel)){
      var hoy = getSession("fechaHoyOrdenInversoTexto");
      var inicioDias = -365;
       
      $("#fechaInicioConsolidadoInducc").val(sumaFechaDias(inicioDias,hoy));
      $("#fechaFinConsolidadoInducc").val(hoy);
   }
}

function descargarConsolidadosExcelInduccion(){
   var campoVacio = true;
   
   var opcConsolidadoExcel = parseInt($("#selOpcConExcelInducc").val());
   var fechaInicioConsolidado = $("#fechaInicioConsolidadoInducc").val();
   var fechaFinConsolidado = $("#fechaFinConsolidadoInducc").val();
    
   if([1].includes(opcConsolidadoExcel)){
      if(fechaInicioConsolidado.length == 0 || fechaFinConsolidado.length == 0){
	 campoVacio = false;  
	 mensajeUx = "<label>Debe ingresar la fecha inicio y la fecha fin.</label>";
      } 
   }
    
   if(campoVacio){
      var fechaInicioConText = convertirFechaNormal(fechaInicioConsolidado);
      var fechaFinConText = convertirFechaNormal(fechaFinConsolidado);
   
      if([1].includes(opcConsolidadoExcel)){
         window.open(URL+"/contratista/inducciones/excel/lista/consolidado?" +
            "empresaId="+getSession("gestopcompanyid")+"&opcionSelectLista="+opcConsolidadoExcel +
            "&fechaInicioConsolidado="+fechaInicioConsolidado+"&fechaFinConsolidado="+fechaFinConsolidado +
            "&fechaInicioConsolidadoNormal="+fechaInicioConText+"&fechaFinConsolidadoNormal="+fechaFinConText);
      }
   }else{
      $("#modalConsolidadosExcelInducc").modal("hide");
      mensajesUx(mensajeUx,2,"","ValidacionConsolidadoExcel");
      
      $("#modalMensajeUxValidacionConsolidadoExcel").on("hidden.bs.modal",function(){
         $("#modalConsolidadosExcelInducc").modal("show");
      });
   }
}

var listOpcGraficoSimpleInduccion=[
   {id:1,nombre:"Trabajadores inscritos en inducciones según contratista"}
];

function ocultarGraficosSimpleInduccion(){
   $("#modalGraficosSimpleInducc").modal("hide");
}

function verGraficosSimpleInduccion(){
   $("#modalGraficosSimpleInducc").remove();

   var selOpcGraficoSimpleInducc = crearSelectOneMenuOblig("selOpcGraficoSimpleInducc",
      "verAcordeGraficosSimpleInduccion()",listOpcGraficoSimpleInduccion,"1","id","nombre");

   var contenido = "";

   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",
       inputForm:selOpcGraficoSimpleInducc,divContainer:"divSelGraficoSimpleInducc"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
                     "onclick='ocultarGraficosSimpleInduccion()'>" +
                "<i class='fa fa-times'></i> Cancelar" +
             "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
                         "onclick='opcionGenerarGraficosSimpleInduccion()'>" +
                    "<i class='fa fa-bar-chart'></i> Generar" +
                 "</button>"}
   ];

   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });

   var modalOptions={
      id:"modalGraficosSimpleInducc",nombre:"<i class='fa fa-list'></i> Seleccionar - Gráfico simple",
      contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
   };

   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

   verAcordeGraficosSimpleInduccion();
}

function verAcordeGraficosSimpleInduccion(){
   $(".atributo-graficoSimpleInducc").remove(); 
   var listContenidoDivSelGraficoSimpleInducc = [];
   var opcGraficoSimple = parseInt($("#selOpcGraficoSimpleInducc").val());
   
   if([1].includes(opcGraficoSimple)){
      listContenidoDivSelGraficoSimpleInducc=[
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Desde",
          inputForm:"<input type='date' id='fechaInicioGraficoSimpleInducc' class='form-control'>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Hasta",
          inputForm:"<input type='date' id='fechaFinGraficoSimpleInducc' class='form-control'>"}                                        
      ]; 
   }
   
   var contenido = "";
   
   listContenidoDivSelGraficoSimpleInducc.forEach(function(val){
      val.clase = "atributo-graficoSimpleInducc";
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
   
   $("#divSelGraficoSimpleInducc").parent().after(contenido);
   
   if([1].includes(opcGraficoSimple)){
      var hoy = getSession("fechaHoyOrdenInversoTexto");
      var inicioDias = -365;
       
      $("#fechaInicioGraficoSimpleInducc").val(sumaFechaDias(inicioDias,hoy));
      $("#fechaFinGraficoSimpleInducc").val(hoy);
   }
}

function opcionGenerarGraficosSimpleInduccion(){
   var opcGraficoSimple = parseInt($("#selOpcGraficoSimpleInducc").val());
   
   if(opcGraficoSimple = 1){
      generarGraficoTrabajadoresInscritosContratistaInduccion();
   }
}

function generarGraficoTrabajadoresInscritosContratistaInduccion(){
   var fechaInicioConsolidado = $("#fechaInicioGraficoSimpleInducc").val();
   var fechaFinConsolidado = $("#fechaFinGraficoSimpleInducc").val();

   var dataParam={ 
      empresaId:parseInt(getSession("gestopcompanyid")),fechaInicioConsolidado:$("#fechaInicioGraficoSimpleInducc").val(),
      fechaFinConsolidado:$("#fechaFinGraficoSimpleInducc").val()
   };
   	   
   callAjaxPost(URL+'/contratista/inducciones/grafico/trabajador_inscrito_induccion',dataParam,function(data){
      var listContratistaTrabInscritoInduccion = data.listContratistaTrabInscritoInduccion;
      
      var listContratistasAux=[],listNumAprobadosAux=[],listNumDesaprobadosAux=[],listNumPorEvaluarAux=[],maxTotalValorInscritos = 0;
       
      listContratistaTrabInscritoInduccion.forEach(function(val,index){
         listContratistasAux.push(val.nombre);
         listNumAprobadosAux.push(val.numTrabajadoresInscritosAprobados);
         listNumDesaprobadosAux.push(val.numTrabajadoresInscritosDesaprobados);
         listNumPorEvaluarAux.push(val.numTrabajadoresInscritosPorEvaluar);
            
         var maxTotalValorInscritosAux = Math.max(val.numTrabajadoresInscritosAprobados, 
            Math.max(val.numTrabajadoresInscritosDesaprobados,val.numTrabajadoresInscritosPorEvaluar));
            
         if(maxTotalValorInscritosAux > maxTotalValorInscritos){
            maxTotalValorInscritos = maxTotalValorInscritosAux;	
         }
      });
      
      $("#modalGraficosSimpleInducc").modal("hide");
      $("#modalGraficoCombinacionTrabCapacitacionOnline").remove();
          
      var modalOptions={
         id:"modalGraficoCombinacionTrabCapacitacionOnline",maxWidth:"90%",
         nombre:"Gráfico Trabajadores inscritos en inducciones según contratista",
         contenido: "<div id='divGraficoTrabInscritosContInduccion'></div>"
      };
      	    
      crearModalPrincipalUsuario(modalOptions,function(){},false,true);
      resizeDivWrapper("divGraficoTrabInscritosContInduccion",170);
        
      Highcharts.chart('divGraficoTrabInscritosContInduccion',{
         chart:{type:'column',marginBottom:100},
 	 title:{text:"Trabajadores inscritos en inducciones según contratista",
 	        align:'left',style:{fontWeight:'bold',fontSize:'20px'}},
 	 xAxis:{
 	    categories:listContratistasAux,labels:{style:{fontWeight:'bold'}},
 	    title:{text:'Contratistas',style:{fontWeight:'bold',fontSize:'18px'}}},
 	 yAxis:{
 	    min:0,max:maxTotalValorInscritos,tickInterval:Math.ceil(maxTotalValorInscritos / 10),
 	    title:{text:'N° de trabajadores inscritos',style:{fontWeight:'bold',fontSize:'18px'}},
 	    labels:{style:{fontWeight:'bold',fontSize:'18px'}}},
 	 legend:{
 	    align:'right',x:-30,verticalAlign:'top',y:0,floating:true,
 	    backgroundColor:Highcharts.defaultOptions.legend.backgroundColor || 'white',
 	    borderColor:'#CCC',borderWidth:1,shadow:false},
 	 tooltip:{
            headerFormat:'<b>{point.x}</b><br/>',
 	    pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>' +
 	                '<br/>Total: {point.stackTotal} (100%)'}, 
 	 plotOptions:{
            column:{
 	       dataLabels:{
 	          enabled:true,allowOverlap:true,color:'black',style:{fontSize:'18px'}}}},
 	 series:[
 	    {name:'Aprobado',data:listNumAprobadosAux,color:'#5dcd5d'},
 	    {name:'Desaprobado',data:listNumDesaprobadosAux,color:'#D8D808'},
 	    {name:'Por evaluar',data:listNumPorEvaluarAux,color:'#ff7474'}]
      });	   
   });
}
