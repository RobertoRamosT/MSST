/**
 * 
 */
var listFullVersiones;
var banderaEdicionVersion;
var versionProcedimientoId;
var versionProcedimientoObj;
var estadoVersion;
var indice1;

function llamarVersionesProcedimiento(){
   $("#divAnexo").hide(); 
    
   banderaEdicionVersion=false;
   estadoVersion={};
	
   $("#btnAgregarVersion").show().attr("onclick","nuevaVersionProcedimiento()");
   $("#btnCancelarVersion").hide().attr("onclick","cancelarVersionProcedimiento()");
   $("#btnGuardarVersion").hide().attr("onclick","guardarVersionProcedimiento()");
   $("#btnEliminarVersion").hide().attr("onclick","eliminarVersionProcedimiento()");
	
   $("#modalUpload").hide();
   $("#tblVersionesProcedimiento tbody").html("");
	
   var dataParam={
      procedimientoSeguridadId: procedimientoSeguridadId,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/procedimientoseguridad/versiones',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listFullVersiones = data.versiones;
			
	 data.versiones.forEach(function(val,index){
	    $("#tblVersionesProcedimiento tbody").append(
	       "<tr id='trver"+val.id+"' onclick='editarVersionProcedimiento("+index+")'>" +
	          "<td id='desc"+val.id+"'>"+val.descripcion+"</td>" +
	          "<td id='fecpla"+val.id+"'>"+val.fechaPlanificadaTexto+"</td>" +
	          "<td id='horpla"+val.id+"'>"+val.horaPlanificadaTexto+"</td>" +
	          "<td id='fecact"+val.id+"'>"+val.fechaActualizacionTexto+"</td>" +"<td id='tdresp"+val.id+"'>"+val.responsable+"</td>" + 
	          "<td id='tdinvver"+val.id+"'>"+val.inversion+"</td>" +
	          "<td id='tdmodi"+val.id+"'>"+val.modificacion+"</td>" +
	          "<td id='tdevi"+val.id+"'>"+val.evidenciaNombre+"</td>" + 
	          "<td id='tdestver"+val.id+"'>"+val.estado.nombre+"</td>" +
	          "<td id='tdanexo"+val.id+"'>"+val.numAnexos+"</td>" +
		  "<td id='tdTrabAsig"+val.id+"'>"+val.numTrabajadoresDescargaron+"/"+val.numTrabajadoresAsignados+"</td>" +
	       "</tr>");
	 });
			
	 if(getSession("linkCalendarioVersionId") != null){
	    listFullVersiones.every(function(val,index3){
	       if(val.id == parseInt(getSession("linkCalendarioVersionId"))){
	          editarVersionProcedimiento(index3);
	          sessionStorage.removeItem("linkCalendarioVersionId");
	          return false;
	       }else{
		  return true;
	       }
	    });
	 }
			
	 formatoCeldaSombreableTabla(true,"tblVersionesProcedimiento");
      }
   });	
}

function editarVersionProcedimiento(pindex){
   if(!banderaEdicionVersion){
      versionProcedimientoId = listFullVersiones[pindex].id;
      versionProcedimientoObj = listFullVersiones[pindex];
		
      formatoCeldaSombreableTabla(false,"tblVersionesProcedimiento");
		
      $("#trver"+versionProcedimientoId).addClass("fila-edicion");
		
      var descripcion = listFullVersiones[pindex].descripcion;
      var fechaPlanificada = convertirFechaInput(listFullVersiones[pindex].fechaPlanificada);
      var horaPlanificada = listFullVersiones[pindex].horaPlanificada;
      var fechaActualizacion = convertirFechaInput(listFullVersiones[pindex].fechaActualizacion);
      var responsable = listFullVersiones[pindex].responsable;
      var modificacion = listFullVersiones[pindex].modificacion;
      var inversion = listFullVersiones[pindex].inversion;
		
      $("#desc"+versionProcedimientoId).html("<input class='form-control' id='descVersion'>");
      $("#fecpla"+versionProcedimientoId).html(
         "<input class='form-control' id='fechaPlaVersion' onchange='hallarEstadoImplementacionVersion()' type='date'>");
      $("#horpla"+versionProcedimientoId).html("<input class='form-control' id='horaPlaVersion' type='time'>");
      $("#fecact"+versionProcedimientoId).html(
	 "<input class='form-control' id='fechaActVersion' type='date' onchange='hallarEstadoImplementacionVersion()'>");
      $("#tdresp"+versionProcedimientoId).html("<input class='form-control' id='respVersion'>");
	
      var iconoSmart = "<i class='fa fa-magic' aria-hidden='true'></i>";
	
      $("#tdTrabAsig"+versionProcedimientoId).append(iconoSmart);
		
      $("#tdTrabAsig"+versionProcedimientoId+" i").on("click",function(){
	 verResumenTrabDescargaVersion();
      });
	
      var options={
	 container: "#tdevi"+versionProcedimientoId,
	 functionCall: function(){},
	 descargaUrl: "/procedimientoseguridad/version/evidencia?versionId="+versionProcedimientoId,
	 esNuevo: false,
	 idAux: "Version",
	 evidenciaNombre: listFullVersiones[pindex].evidenciaNombre
      };
		
      crearFormEvidenciaCompleta(options);
		
      $("#tdmodi"+versionProcedimientoId).html("<input class='form-control' id='modVersion'>");
      $("#tdinvver"+versionProcedimientoId).html("<input type='number' class='form-control' id='inversionVersion'>");
      ponerListaSugerida("respVersion",listanombretab,true);
      $("#descVersion").val(descripcion);
      $("#fechaPlaVersion").val(fechaPlanificada);
      $("#horaPlaVersion").val(horaPlanificada);
      $("#fechaActVersion").val(fechaActualizacion);
      $("#respVersion").val(responsable);
      $("#modVersion").val(modificacion);
      $("#inversionVersion").val(inversion);
		
      //*** Enlace Anexo ***
      indice1= $("#descVersion").val();
		
      $("#tdanexo"+versionProcedimientoId).html(
         "<a class='efectoLink' onclick='verAnexo()'>"+$("#tdanexo"+versionProcedimientoId).text()+"</a>");
      //********************
      hallarEstadoImplementacionVersion();
		
      banderaEdicionVersion=true;
      $("#btnAgregarVersion").hide();
      $("#btnCancelarVersion").show();
      $("#btnGuardarVersion").show();
      $("#btnEliminarVersion").show();
   }
}

function editarEvidencia(){
	$("#modalVersion").hide();
	$("#modalUpload").show();
}
function cancelarUploadEvidenciaVersion(){
	$("#modalVersion").show();
	$("#modalUpload").hide();
}
function uploadEvidenciaVersion(){
	var inputFileImage = document.getElementById("fileEviVersion");
	var file = inputFileImage.files[0];
	$("#tdevi"+versionProcedimientoId+" ").html(file.name);
	$.blockUI({message:'cargando...'}); 
	guardarEvidenciaAuto(versionProcedimientoId,"fileEviVersion",bitsEvidenciaVersion,
			"/procedimientoseguridad/version/evidencia/save",function(){
		$.unblockUI();
		$("#modalVersion").show();
		$("#modalUpload").hide();
	},"versionId")
}
function guardarVersionProcedimiento(){
	var campoVacio = true; 
	var descripcion=$("#descVersion").val();
	var fechaPlanificada=convertirFechaTexto($("#fechaPlaVersion").val());
	var fechaActualizacion=convertirFechaTexto($("#fechaActVersion").val());
	var horaPlanificada=$("#horaPlaVersion").val();
	var inversion=$("#inversionVersion").val();
	var responsable=$("#respVersion").val();
	var modificacion=$("#modVersion").val();
	var codigo=$("#codigoAnexo").val();
	var titulo=$("#tituloAnexo").val();
	
	if ($("#descVersion").val().length == 0) {
		campoVacio = false;
	} 
	if (campoVacio) {

		var dataParam = { 
				id:versionProcedimientoId,
				descripcion:descripcion,
				fechaPlanificada:fechaPlanificada,
				horaPlanificada:horaPlanificada,
				fechaActualizacion:fechaActualizacion,
				modificacion:modificacion,
				responsable:responsable,
				inversion:inversion,
				estado:estadoVersion,
				procedimientoId:procedimientoSeguridadId
		};
		//console.log(dataParam);
		callAjaxPost(URL + '/procedimientoseguridad/version/save', dataParam, procesarResultadoEvidenciaGuardar);
	} else {
		alert("Debe ingresar la versión");
	}
}

function procesarResultadoEvidenciaGuardar(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviVersion",bitsEvidenciaVersion,
				"/procedimientoseguridad/version/evidencia/save",llamarVersionesProcedimiento,"id")
	                 
	     break;
	default:
	     break;
	}
}
function eliminarVersionProcedimiento() {
	var r = confirm("¿Está seguro de eliminar la versión de Procedimiento?");
	if (r == true) {
		var dataParam = {
				id : versionProcedimientoId,
		};

		callAjaxPost(URL + '/procedimientoseguridad/version/delete', dataParam, procesarEliminarVersionProcedimiento);
	}

}

function procesarEliminarVersionProcedimiento(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		 
		llamarVersionesProcedimiento(); 
		break;
	default:
		alert("Ocurrió un error al eliminar la versión!");
	}
}

function nuevaVersionProcedimiento(){
	if(!banderaEdicionVersion){
		$("#btnAgregarVersion").hide();
		$("#btnCancelarVersion").show();
		$("#btnGuardarVersion").show();
		$("#btnEliminarVersion").show();
		banderaEdicionVersion=true;
		versionProcedimientoId=0;
		$("#tblVersionesProcedimiento tbody").append("<tr id='trver0'>" +
				"<td><input class='form-control' id='descVersion'></td>" +
				"<td><input class='form-control' id='fechaPlaVersion' type='date' onchange='hallarEstadoImplementacionVersion()'></td>" +
				"<td><input class='form-control' id='horaPlaVersion' value='12:00:00' type='time'></td>" +
				"<td><input class='form-control' id='fechaActVersion' type='date' onchange='hallarEstadoImplementacionVersion()'></td>" +

				"<td><input class='form-control' id='respVersion'></td>" +
				"<td><input class='form-control' id='inversionVersion' type='number'></td>" +
				"<td><input class='form-control' id='modVersion'></td>" +
				"<td id=evidenciaVersion>...</td>"+
				"<td id='tdestver0'> ...</td>" +
				"<td>...</td>"+
				"<tr>");
		var options=
		{
				container:"#evidenciaVersion",
				functionCall:function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Version",
				evidenciaNombre:""
		};
		
		crearFormEvidenciaCompleta(options);
		ponerListaSugerida("respVersion",listanombretab,true);
		formatoCeldaSombreableTabla(false,"tblVersionesProcedimiento");
	}
	
}

function cancelarVersionProcedimiento(){
	llamarVersionesProcedimiento();
}


function hallarEstadoImplementacionVersion(){
	
	var fechaPlanificada=$("#fechaPlaVersion").val();
	var fechaReal=$("#fechaActVersion").val();
	var fechaHoy=obtenerFechaActual();
	if(fechaReal!=''){
		estadoVersion={id:2,
		nombre:"Completado"};
	}else{
		
		if(fechaPlanificada!=""){
			var dif=restaFechas(fechaHoy,fechaPlanificada)
			if(dif<0){
				estadoVersion={
						id:3,
						nombre:"Retrasado"};
			}else{
				estadoVersion={
						id:1,
						nombre:"Por implementar"};
			}
			
		}else{
			estadoVersion={
					id:1,
					nombre:"Por implementar"};
			
		}
	}
	
	$("#tdestver"+versionProcedimientoId).html(estadoVersion.nombre);
	
}

function verAnexo(){
    
    $("#modalVersion").hide();
    $("#mdProgFechaLabel").hide();  //Ocultar título del modal
    $("#divHeaderVersion").hide();  //Ocultar contenedero del título
    $("#modalVersion .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
    	$("#divAnexo").show();
    	$("#divHeaderAnexo").show();  
    	$("#tituloAnexo").show();  							    //******
	$("#divAnexo h4")                                                                      //******
	.html("<a onclick='volverDivVersion()'> "+indice1+" </a> " +                             //******
			"    " +                                                                 //******
			"> Anexos"); 
	
    cargarAnexos();	
}

function volverDivVersion(){

   $("#divAnexo").hide();
   $("#divHeaderAnexo").hide();  
   $("#tituloAnexo").hide();  
   
   $("#modalVersion").show();
   $("#mdProgFechaLabel").show();  
   $("#divHeaderVersion").show();  
   $("#modalVersion .container-fluid").show();
   
}

function volverVersionesProcedimiento(){
   $("#modalResumenTrabDescargaVersion").modal("hide");
   $("#mdVersionProcedimiento").modal("show");
}

function ImprimirListaDocumentosSeguridad(){
   var procedimientoSeguridadId = procedimientoSeguridadObj.procedimientoSeguridadId;
   var procedimientoVersionId = versionProcedimientoObj.id;
   var empresaId = getSession("gestopcompanyid");

   window.open(URL+"/procedimientoseguridad/versiones/resumen_pdf?empresaId="+empresaId+"&procedimientoSeguridadId=" + 
      procedimientoSeguridadId+"&procedimientoVersionId="+procedimientoVersionId);
}

function verResumenTrabDescargaVersion(){
   $("#mdVersionProcedimiento").modal("hide");
   $("#modalResumenTrabDescargaVersion").remove();
      
   var contenido = "";
     
   var buttonVolver =
      "<button type='button' id='btnVolverVersionesProc' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverVersionesProcedimiento()' title='Regresar a las versiones del procedimiento seleccionado.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	var buttonGuardar =
		"<button type='button' id='btnImprimirVersionesProc' class='btn btn-success' style='margin-right:5px' " +
		"onclick='ImprimirListaDocumentosSeguridad()' title='Imprimir lista documentos de seguridad.'>" +
		"<i class='fa fa-file-pdf-o fa-2x'></i>" +
		"</button>";

     
   var modalOptions={
      maxWidth:"90%",id:"modalResumenTrabDescargaVersion",
      nombre:"<i class='fa fa-table'></i> Resumen descarga (Documento: "+procedimientoSeguridadObj.procedimientoSeguridadNombre + 
             " / Version: "+versionProcedimientoObj.descripcion+")",
      contenido: 
  	 buttonVolver + buttonGuardar +
         "<div class='wrapper' id='wrapperResumenTrabDescargaVersion'>" +
            "<table id='tblResumenTrabDescargaVersion' class='table table-striped table-bordered table-hover table-fixed'>" +
  	       "<thead>" +
  	          "<tr>" +
  		     "<th class='tb-acc' colspan='6' style='width:1800px'>Datos del trabajador(a)</th>" +
  		     "<th class='tb-acc' colspan='3' style='width:750px'>Descarga de la version</th>" +
  		  "</tr>" +
  		  "<tr>" +
  		     "<th class='tb-acc' style='width:300px'>DNI</th>" +
  		     "<th class='tb-acc' style='width:300px'>Unidad</th>" +
  		     "<th class='tb-acc' style='width:300px'>División</th>" +
  		     "<th class='tb-acc' style='width:300px'>Área</th>" +
  		     "<th class='tb-acc' style='width:300px'>Puesto de trabajo</th>" +
  		     "<th class='tb-acc' style='width:300px'>Nombre</th>" +
  		     "<th class='tb-acc' style='width:250px'>¿Lo ha descargado?</th>" +
  		     "<th class='tb-acc' style='width:250px'>N° de veces descargado</th>" +
  		     "<th class='tb-acc' style='width:250px'>Fecha de descarga</th>" +
                  "</tr>" +
  	       "</thead>" +
  	       "<tbody></tbody>" +
  	    "</table>" +
  	 "</div>"};
  		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperResumenTrabDescargaVersion",190);
   cargarResumenTrabDescargaVersion();
}

var listResumenTrabDescargaVersion=[];

function cargarResumenTrabDescargaVersion(){
   var dataParam={
      procedimientoSeguridadId: procedimientoSeguridadObj.procedimientoSeguridadId,
      procedimientoVersionId: versionProcedimientoObj.id,
      empresaId: parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/procedimientoseguridad/versiones/resumen_descarga',dataParam,function(data){  
      if(data.CODE_RESPONSE == "05"){
 	 listResumenTrabDescargaVersion = data.listResumenTrabDescargaVersion;
  						
  	 $("#tblResumenTrabDescargaVersion tbody tr").remove();
  	 
  	 listResumenTrabDescargaVersion.forEach(function(val,index){	
 	    $("#tblResumenTrabDescargaVersion tbody").append(
 	       "<tr id='estadoDescargaTrabajador"+val.trabajadorId+"'>" +
 	          "<td>"+val.dni+"</td>" +
 	          "<td>"+val.area.matrixName+"</td>" +
 	          "<td>"+val.area.divisionName+"</td>" +
 	          "<td>"+val.area.areaName+"</td>" +
 	          "<td>"+val.puesto.positionName+"</td>" +
 	          "<td>"+val.nombre+"</td>" +
 	          "<td>"+(val.descargarVersionId != 0?"SÍ":"NO")+"</td>" +
 	          "<td>"+val.numVecesDescargado+"</td>" +
 	          "<td>"+val.fechaDescargaTexto+"</td>" +
 	       "</tr>");
 	    
 	    if(val.descargarVersionId != 0){
 	       $("#estadoDescargaTrabajador"+val.trabajadorId+" td").css({"background-color":"#5dcd5d"});
 	    }else{
 	       $("#estadoDescargaTrabajador"+val.trabajadorId+" td").css({"background-color":"#ff7474"});
 	    }
 	 });
  	         
  	 goheadfixedY("#tblResumenTrabDescargaVersion","#wrapperResumenTrabDescargaVersion");
      }else{
         console.log("NOP");
      }
   });    
}
