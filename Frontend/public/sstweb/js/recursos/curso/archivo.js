
var archivoCursoId;
var archivoCursoObj = {};
var banderaEdicionArch;
var listFullArchivos;
var mensajeUx;

function llamarArchivosCurso(){
    archivoCursoId = 0;banderaEdicionArch=false;
    listFullArchivos=[];
	
    $("#btnAgregarArchivo").show();$("#btnCancelarArchivo").hide();$("#btnEliminarArchivo").hide();
    $("#btnGuardarArchivo").hide();
	
    var dataParam={
	id:cursoCapacitacionId
    };
	
    callAjaxPost(URL+'/capacitacion/curso/archivos',dataParam,function(data){
        var list = data.list;
	
        listFullArchivos = data.list;
		
        $("#tblArchCurso tbody").html("");
		console.log(listFullArchivos);
        listFullArchivos.forEach(function(val,index){
            var nombre = (val.nombre.length > 0?val.nombre:"------"),
                observacion = (val.observacion.length > 0?val.observacion:"------");
            
	    $("#tblArchCurso tbody").append(
                "<tr id='trArchCursoCap"+val.id+"' onclick='javascript:editarArchivo("+index+")'>"+
		    "<td id='tdeviarchivo"+val.id+"'>"+nombre+"</td>" +
		    "<td id='archObs"+val.id+"'>"+observacion+"</td>" +
		"</tr>");
	});
	
	formatoCeldaSombreableTabla(true,"tblArchCurso");
    });
}

function editarArchivo(pindex){
    if(!banderaEdicionArch){
	banderaEdicionArch = true;
		
	$("#btnAgregarArchivo").hide();$("#btnCancelarArchivo").show();$("#btnEliminarArchivo").show();
	$("#btnGuardarArchivo").show();
		
	formatoCeldaSombreableTabla(false,"tblArchCurso");
	
	archivoCursoObj = listFullArchivos[pindex];archivoCursoId = archivoCursoObj.id;
	
	$("#trArchCursoCap"+archivoCursoId).addClass("fila-edicion");
		
	$("#archObs"+archivoCursoId).html("<input id='inputArchObs' class='form-control'>");
	$("#inputArchObs").val(archivoCursoObj.observacion); 
	 
	var options={
	    container:"#tdeviarchivo"+archivoCursoId,functionCall:function(){
	       validacionSubirEvidencia("Archivo",bitsEvidenciaArchivoCurso,"mdCursoFecha");
	    },descargaUrl:"/capacitacion/curso/archivo/evidencia?archivoId="+archivoCursoId,
	    esNuevo:(archivoCursoObj.nombre.length == 0?true:false),
	    idAux:"Archivo",evidenciaNombre:archivoCursoObj.nombre
	};
		
	crearFormEvidenciaCompleta(options);
    }
}

function nuevoArchivo(){
    $("#btnAgregarArchivo").hide();$("#btnCancelarArchivo").show();$("#btnEliminarArchivo").hide();
    $("#btnGuardarArchivo").show();
	
    banderaEdicionArch = true;archivoCursoId = 0; 
	
    $("#tblArchCurso tbody").append(
        "<tr id='trArchCursoCap0'>" +
            "<td id='tdeviarchivo0'></td>" +
	    "<td><input class='form-control' id='inputArchObs'></td>" +
	"</tr>");
    
    var options={
	container:"#tdeviarchivo"+archivoCursoId,functionCall:function(){
	    validacionSubirEvidencia("Archivo",bitsEvidenciaArchivoCurso,"mdCursoFecha");
	},descargaUrl:"",esNuevo:true,idAux:"Archivo",evidenciaNombre:""
    };
	
    crearFormEvidenciaCompleta(options);
    
    formatoCeldaSombreableTabla(false,"tblArchCurso");
}

function eliminarArchivo(){
	var ArchivoObj={
			id:archivoCursoId
	}
	var r=confirm("¿Está seguro de eliminar este Archivo?");
	if(r){
		callAjaxPost(URL + '/capacitacion/curso/archivo/delete', ArchivoObj,
				function(data) {
					
					
			llamarArchivosCurso();
					
				});
	}
	
}
 
function guardarArchivo(){
    var campoVacio = true;
    
    var observacion = $("#inputArchObs").val();
    var evidenciaNombre = $("#inputEviArchivo").val();
    
    if(observacion.length == 0 || evidenciaNombre.length == 0){
        campoVacio = false;mensajeUx = "<label>Debe completar todos los campos.</label>";
    }else if(evidenciaNombre == "VOLVER A SUBIR"){
	campoVacio = false;mensajeUx = "<label>Debe volver a subir la evidencia.</label>";
    }
	
    if(campoVacio){
        var ArchivoObj={
	    id:archivoCursoId,observacion:observacion,cursoCapacitacionId:cursoCapacitacionId
	}
		
	callAjaxPostNoUnlock(URL+'/capacitacion/curso/archivo/save',ArchivoObj,procesarResultadoGuardarArchivoCurso);
    }else{
	$("#mdCursoFecha").modal("hide");
        mensajesUx(mensajeUx,2,"","ValidacionArchCurso");

        $("#modalMensajeUxValidacionArchCurso").on("hidden.bs.modal",function(){
            $("#mdCursoFecha").modal("show");
        });
    }
}

function procesarResultadoGuardarArchivoCurso(data) {
    switch(data.CODE_RESPONSE){
	case "05":
	    var archivoIdAux = data.idNuevo;
		
	    guardarEvidenciaAuto(archivoIdAux,"fileEviArchivo",bitsEvidenciaArchivoCurso,
	    "/capacitacion/curso/archivo/evidencia/save",function(){
		$.unblockUI();$("#mdCursoFecha").modal("hide");
		
                mensajeUx = "<label>El registro archivo fue guardado con éxito.</label>"; 
    	        mensajesUx(mensajeUx,1,"","ActualizarArchCurso");
		    
    	        $("#modalMensajeUxActualizarArchCurso").on("hidden.bs.modal",function(){
    	            $("#mdCursoFecha").modal("show");llamarArchivosCurso();
    	        });
	    },"archivoId")
	 
	    break;
	
        default:
	    alert("Ocurrió un error al guardar el Archivo!");
    }
}

