var listInduccionesGenerales = [];
var perfilContratistaId,perfilContratistaObj={};
var banderaEdicionPerfil=false;

var listSeccionContratistaPerfil;
var listCampoTrabajadorContratistaPerfil;
var listRequisitosProyectoContratista;
var listFullPerfilesContratista = [],listSeccionDocNivelCondContratistaPerfil = [],listSeccionDocNivelVehMaqContratistaPerfil = [],
    listSeccionDocNivelEquHerrContratistaPerfil = [],listTipoLicencias = [],listTrabajosAltoRiesgo = [];
var mapTipoLicenciaCondNombre;
var mensajeUx;

$(function(){
   $("#btnNuevoPerfilContratista").attr("onclick", "javascript:nuevoPerfilContratista();");
   $("#btnCancelarPerfilContratista").attr("onclick", "javascript:cancelarNuevoPerfilContratista();");
   $("#btnGuardarPerfilContratista").attr("onclick", "javascript:guardarPerfilContratista();");
   $("#btnEliminarPerfilContratista").attr("onclick", "javascript:eliminarPerfilContratista();");
   resizeDivWrapper("wrapPerfil",300);
});

var listTextosSeccionesHabilitadasInkacrops=[
   {nombreOriginal:"Certificado Aptitud Médica",personalizado:"EMO y protocolo médico"},
   {nombreOriginal:"Cargo reglamento Cliente",personalizado:"Cargo SSOMA"},
   {nombreOriginal:"Inducciones Programadas del Cliente",personalizado:"Inducciones programadas por Inka Crops"},
   {nombreOriginal:"Prevencionista",personalizado:"Prevencionista/Encargado SST"},
   {nombreOriginal:"Programa SST asociado a la empresa",personalizado:"Programa SST"},
   {nombreOriginal:"Procedimiento de trabajo seguro para trabajos de alto riesgo",personalizado:"Procedimiento de trabajo seguro"}
];

function cargarPerfilContratistas(){
    $("#btnCancelarPerfilContratista").hide();$("#btnNuevoPerfilContratista").show();$("#btnEliminarPerfilContratista").hide();
    $("#btnGuardarPerfilContratista").hide();$("#btnVerEnlaceExamenConPerCon").hide();$("#btnVerPerfilesProyecto").show();
    $("#btnConfiguracionSubUsuario").show();$("#btnMensajesPersonalizado").show();
   
    banderaEdicionPerfil = false;
   
    volverDivPerfilContratista();
   
    resizeDivWrapper("wrapPerfil",160);
   
    var dataParam={
        empresaId: getSession("gestopcompanyid")
    };
	
    callAjaxPost(URL+'/contratista/perfiles/solo',dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
	        listFullPerfilesContratista = data.list;listSeccionContratistaPerfil = data.seccion;
	        listCampoTrabajadorContratistaPerfil = data.camposTrabajador;listRequisitosProyectoContratista = data.requisitosProyecto;
            listTrabajosAltoRiesgo = data.listTrabajosAltoRiesgo;listTipoLicencias = data.listTipoLicencias;
            listInduccionesGenerales = data.listInduccionesGenerales;
	
            mapTipoLicenciaCondNombre = new Map();
         
            listTipoLicencias.forEach(function(val){
                mapTipoLicenciaCondNombre.set(val.id,val.nombre);
            });
					
	        $("#tblPerfilContratista tbody tr").remove();
					
	        listFullPerfilesContratista.forEach(function(val,index){
	            var seccionesHabilitadasNombre = val.seccionesHabilitadasNombre;
	     
	            if(parseInt(getSession("gestopcompanyid")) == 647){
	                listTextosSeccionesHabilitadasInkacrops.forEach(function(val){
	                    seccionesHabilitadasNombre = seccionesHabilitadasNombre.replace(val.nombreOriginal,val.personalizado);
	                });
	            }

                seccionesHabilitadasNombre = (seccionesHabilitadasNombre.length >= 1000?seccionesHabilitadasNombre.substring(0,1000)+"...":seccionesHabilitadasNombre);

                var estadoHabilitarEntrevistaPrevencionista = (val.habilitarEntrevistaPrevencionista == 1?"Sí":"No"),
                    estadoHabilitarCargoInduccionTrabAltRie = (val.habilitarCargoInduccionTrabAltRie == 1?"Sí":"No"),
					creadoPor = (val.fechaCreacionTexto.length == 0?"------":val.fechaCreacionTexto+"<br>(Por "+val.usuarioCreacion.nombre+")"),
					actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.usuarioActualizacion.nombre+")");
	     
	            $("#tblPerfilContratista tbody").append(
	                "<tr id='trperf"+val.id+"' onclick='editarPerfilContratista("+index+")'>" +
	                    "<td id='pernom"+val.id+"'>"+val.nombre+"</td>" +
	                    "<td id='persecc"+val.id+"' style='word-break:break-all;'>"+seccionesHabilitadasNombre+"</td>" +
	                    "<td id='perseccDocNivelCond"+val.id+"' style='word-break:break-all;'>"+val.seccionesDocNivelConductorHabilitadosNombre+"</td>" +
	                    "<td id='perseccDocNivelVehMaq"+val.id+"' style='word-break:break-all;'>"+val.seccionesDocNivelVehMaqHabilitadosNombre+"</td>" +
	                    "<td id='perseccDocNivelEquHerr"+val.id+"' style='word-break:break-all;'>"+val.seccionesDocNivelEquHerrHabilitadosNombre+"</td>" +
		                "<td id='percampo"+val.id+"' style='word-break:break-all;'>"+val.camposTrabajadorHabilitadosNombre+"</td>" +
		                "<td id='perreq"+val.id+"' style='word-break:break-all;'>"+val.requisitosProyectoHabilitadosNombre+"</td>" +
                        "<td id='perTrabAltoRiesgo"+val.id+"' style='word-break:break-all;'>"+val.trabajosAltoRiesgoHabilitadosNombre+"</td>" +
                        "<td id='perTrabAltoRiesgoCht"+val.id+"' style='word-break:break-all;'>"+val.trabajosAltoRiesgoChtHabilitadosNombre+"</td>" +
                        "<td id='perInduccionesGenerales"+val.id+"' style='word-break:break-all;'>"+val.induccionesGeneralesHabilitadasNombre+"</td>" +
                        "<td id='perHabEntrevPreve"+val.id+"'>"+estadoHabilitarEntrevistaPrevencionista+"</td>" +
                        "<td id='perHabCargoInduccTrabAltRie"+val.id+"'>"+estadoHabilitarCargoInduccionTrabAltRie+"</td>" +
		                "<td id='percondet"+val.id+"'>"+val.numContratistasAsignados+"</td>" +
						"<td id='proyFechaCrePerfCont"+val.id+"'>"+creadoPor+"</td>" +
						"<td id='proyFechaActPerfCont"+val.id+"'>"+actualizadoPor+"</td>" +
	                "</tr>");
	        });
					
	        goheadfixedY("#tblPerfilContratista","#wrapPerfil");
	        formatoCeldaSombreableTabla(true,"tblPerfilContratista");
        }else{
            console.log("NOPNPO");
        }
    });
}

function editarPerfilContratista(pindex) {
   if(!banderaEdicionPerfil) {
      formatoCeldaSombreableTabla(false,"tblPerfilContratista");
      perfilContratistaId = listFullPerfilesContratista[pindex].id; 
      perfilContratistaObj = listFullPerfilesContratista[pindex];
      
      $("#trperf"+perfilContratistaId).addClass("fila-edicion");
//
      $("#pernom"+perfilContratistaId).html("<input type='text' id='inputNombrePerfil' class='form-control'>");
      $("#inputNombrePerfil").val(perfilContratistaObj.nombre);

      var requisitosProyectoHabilitadosId = perfilContratistaObj.requisitosProyectoHabilitadosId.split(",");
		
      listRequisitosProyectoContratista.forEach(function(val){
         val.selected = 0;
			
         requisitosProyectoHabilitadosId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcPermiteReqProyectoPerfil","",
         listRequisitosProyectoContratista,"id","nombre","#perreq"+perfilContratistaId,"Habilitar...");
		
//      $("#percondet"+perfilContratistaId).html(
//         "<a onclick='verContratistsPerfil()'>"+
//            $("#percondet"+perfilContratistaId).text()+
//         "</a>");
		
      var textDocNivelConductorAsig = $("#perseccDocNivelCond"+perfilContratistaId).html();

      $("#perseccDocNivelCond"+perfilContratistaId).addClass("linkGosst").on("click",function(){
         verDocumentosNivelConductorAsignadosPerfilContratista();
      }).html(textDocNivelConductorAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
		
      var textDocNivelVehMaqAsig = $("#perseccDocNivelVehMaq"+perfilContratistaId).html();

      $("#perseccDocNivelVehMaq"+perfilContratistaId).addClass("linkGosst").on("click",function(){
	 verDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista();
      }).html(textDocNivelVehMaqAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
      
      var textDocNivelEquHerrAsig = $("#perseccDocNivelEquHerr"+perfilContratistaId).html();

      $("#perseccDocNivelEquHerr"+perfilContratistaId).addClass("linkGosst").on("click",function(){
	 verDocumentosNivelEquipoHerramientaAsignadosPerfilContratista();
      }).html(textDocNivelEquHerrAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

        $("#perHabEntrevPreve"+perfilContratistaId).html("<input type='checkbox' id='checkHabilitarEntrePrevPerfil' class='form-control' " +
            (perfilContratistaObj.habilitarEntrevistaPrevencionista == 1?"checked":"")+">");

        $("#perHabCargoInduccTrabAltRie"+perfilContratistaId).html("<input type='checkbox' id='checkHabilitarCargoInduccionTrabAltRie' class='form-control' " +
            (perfilContratistaObj.habilitarCargoInduccionTrabAltRie == 1?"checked":"")+">");
			
		$("#proyFechaActPerfCont"+perfilContratistaId).html("<label>*Automático.</label>");
      
        banderaEdicionPerfil = true;

        crearCheckListGeneral("","Secciones habilitadas","SeccionesHabPerfCont",
            listSeccionContratistaPerfil,"SeccionesHabPerfilContratista",cargarCheckListSeccionesHabPerfilContratista);

        crearCheckListGeneral("","Campos habilitados de trabajadores","CamposHabTrabPerfCont",
            listCampoTrabajadorContratistaPerfil,"CamposHabTrabPerfilContratista",cargarCheckListCamposHabTrabPerfilContratista);

        crearCheckListGeneral("","Trabajos de alto riesgo habilitados","TrabajosAltoRiesgoHabPerfCont",
            listTrabajosAltoRiesgo,"TrabajosAltoRiesgoHabPerfilContratista",cargarCheckListTrabajosAltoRiesgoHabPerfilContratista);

       crearCheckListGeneral("","Trabajos de alto riesgo asociados al trabajador","TrabajosAltoRiesgoChtHabPerfCont",
           listTrabajosAltoRiesgo,"TrabajosAltoRiesgoChtHabPerfilContratista",cargarCheckListTrabajosAltoRiesgoChtHabPerfilContratista);

        crearCheckListGeneral("","Inducciones generales habilitadas","InduccionesGeneralesHabPerfCont",
            listInduccionesGenerales,"InduccionesGeneralesHabPerfilContratista",cargarCheckListInduccionesGeneralesHabPerfilContratista);

       $("#btnCancelarPerfilContratista").show();$("#btnNuevoPerfilContratista").hide();$("#btnEliminarPerfilContratista").show();
        $("#btnGuardarPerfilContratista").show();$("#btnVerEnlaceExamenConPerCon").show();$("#btnVerPerfilesProyecto").hide();
        $("#btnConfiguracionSubUsuario").hide();$("#btnMensajesPersonalizado").hide();
    }
}

function ocultarCheckListSeccionesHabPerfilContratista(){
    var textSeccionHabPerfContHab = "";

    listSeccionContratistaPerfil.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoSeccionesHabPerfCont"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textSeccionHabPerfContHab += (textSeccionHabPerfContHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textSeccionHabPerfContHab = (textSeccionHabPerfContHab.length == 0?"------":textSeccionHabPerfContHab);
    textSeccionHabPerfContHab = (textSeccionHabPerfContHab.length >= 1000?textSeccionHabPerfContHab.substring(0,1000)+"...":textSeccionHabPerfContHab);

    $("#persecc"+perfilContratistaId).addClass("linkGosst").on("click",function(){
        verCheckListSeccionesHabPerfilContratista();
    }).html(textSeccionHabPerfContHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListSeccionesHabPerfCont").modal("hide");
}

function verCheckListSeccionesHabPerfilContratista(){
    $("#modalCheckListSeccionesHabPerfCont").modal("show");
}

function cargarCheckListSeccionesHabPerfilContratista(){
    if(perfilContratistaObj.seccionesHabilitadasId.length != 0){
        var seccionHabPerfContHabilitadosId = perfilContratistaObj.seccionesHabilitadasId.split(",");

        seccionHabPerfContHabilitadosId.forEach(function(val1){
            var checkboxSeccHab = document.getElementById('checkAsignadoSeccionesHabPerfCont'+val1);
            checkboxSeccHab.checked = true;
        });
    }

    ocultarCheckListSeccionesHabPerfilContratista();
}

function ocultarCheckListCamposHabTrabPerfilContratista(){
    var textCampoHabTrabPerfilContHab = "";

    listCampoTrabajadorContratistaPerfil.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoCamposHabTrabPerfCont"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textCampoHabTrabPerfilContHab += (textCampoHabTrabPerfilContHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textCampoHabTrabPerfilContHab = (textCampoHabTrabPerfilContHab.length == 0?"------":textCampoHabTrabPerfilContHab);

    $("#percampo"+perfilContratistaId).addClass("linkGosst").on("click",function(){
        verCheckListCamposHabTrabPerfilContratista();
    }).html(textCampoHabTrabPerfilContHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListCamposHabTrabPerfCont").modal("hide");
}

function verCheckListCamposHabTrabPerfilContratista(){
    $("#modalCheckListCamposHabTrabPerfCont").modal("show");
}

function cargarCheckListCamposHabTrabPerfilContratista(){
    if(perfilContratistaObj.camposTrabajadorHabilitadosId.length != 0){
        var campoHabTrabPerfContHabilitadosId = perfilContratistaObj.camposTrabajadorHabilitadosId.split(",");

        campoHabTrabPerfContHabilitadosId.forEach(function(val1){
            var checkboxCamposHabTrab = document.getElementById('checkAsignadoCamposHabTrabPerfCont'+val1);
            checkboxCamposHabTrab.checked = true;
        });
    }

    ocultarCheckListCamposHabTrabPerfilContratista();
}

function ocultarCheckListTrabajosAltoRiesgoHabPerfilContratista(){
    var textTrabajoAltoRiesgoHabPerfContHab = "";

    listTrabajosAltoRiesgo.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoTrabajosAltoRiesgoHabPerfCont"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textTrabajoAltoRiesgoHabPerfContHab += (textTrabajoAltoRiesgoHabPerfContHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textTrabajoAltoRiesgoHabPerfContHab = (textTrabajoAltoRiesgoHabPerfContHab.length == 0?"------":textTrabajoAltoRiesgoHabPerfContHab);

    $("#perTrabAltoRiesgo"+perfilContratistaId).addClass("linkGosst").on("click",function(){
        verCheckListTrabajosAltoRiesgoHabPerfilContratista();
    }).html(textTrabajoAltoRiesgoHabPerfContHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListTrabajosAltoRiesgoHabPerfCont").modal("hide");
}

function verCheckListTrabajosAltoRiesgoHabPerfilContratista(){
    $("#modalCheckListTrabajosAltoRiesgoHabPerfCont").modal("show");
}

function cargarCheckListTrabajosAltoRiesgoHabPerfilContratista(){
    if(perfilContratistaObj.trabajosAltoRiesgoHabilitadosId.length != 0){
        var trabajoAltoRiesgoHabPerfContHabilitadosId = perfilContratistaObj.trabajosAltoRiesgoHabilitadosId.split(",");

        trabajoAltoRiesgoHabPerfContHabilitadosId.forEach(function(val1){
            var checkboxTrabajosAltRieHab = document.getElementById('checkAsignadoTrabajosAltoRiesgoHabPerfCont'+val1);
            checkboxTrabajosAltRieHab.checked = true;
        });
    }

    ocultarCheckListTrabajosAltoRiesgoHabPerfilContratista();
}

function ocultarCheckListTrabajosAltoRiesgoChtHabPerfilContratista(){
    var textTrabajoAltoRiesgoChtHabPerfContHab = "";

    listTrabajosAltoRiesgo.forEach(function(val,index){
        var isHabilitado = ($("#checkAsignadoTrabajosAltoRiesgoChtHabPerfCont"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textTrabajoAltoRiesgoChtHabPerfContHab += (textTrabajoAltoRiesgoChtHabPerfContHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textTrabajoAltoRiesgoChtHabPerfContHab = (textTrabajoAltoRiesgoChtHabPerfContHab.length == 0?"------":textTrabajoAltoRiesgoChtHabPerfContHab);

    $("#perTrabAltoRiesgoCht"+perfilContratistaId).addClass("linkGosst").on("click",function(){
        verCheckListTrabajosAltoRiesgoChtHabPerfilContratista();
    }).html(textTrabajoAltoRiesgoChtHabPerfContHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListTrabajosAltoRiesgoChtHabPerfCont").modal("hide");
}

function verCheckListTrabajosAltoRiesgoChtHabPerfilContratista(){
    $("#modalCheckListTrabajosAltoRiesgoChtHabPerfCont").modal("show");
}

function cargarCheckListTrabajosAltoRiesgoChtHabPerfilContratista(){
    if(perfilContratistaObj.trabajosAltoRiesgoChtHabilitadosId.length != 0){
        var trabajoAltoRiesgoChtHabPerfContHabilitadosId = perfilContratistaObj.trabajosAltoRiesgoChtHabilitadosId.split(",");

        trabajoAltoRiesgoChtHabPerfContHabilitadosId.forEach(function(val1){
            var checkboxTrabajosAltRieChtHab = document.getElementById('checkAsignadoTrabajosAltoRiesgoChtHabPerfCont'+val1);
            checkboxTrabajosAltRieChtHab.checked = true;
        });
    }

    ocultarCheckListTrabajosAltoRiesgoChtHabPerfilContratista();
}

function ocultarCheckListInduccionesGeneralesHabPerfilContratista(){
    var textInduccionesGeneralesHabPerfContHab = "";

    listInduccionesGenerales.forEach(function(val){
        var isHabilitado = ($("#checkAsignadoInduccionesGeneralesHabPerfCont"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textInduccionesGeneralesHabPerfContHab += (textInduccionesGeneralesHabPerfContHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textInduccionesGeneralesHabPerfContHab = (textInduccionesGeneralesHabPerfContHab.length == 0?"------":textInduccionesGeneralesHabPerfContHab);

    $("#perInduccionesGenerales"+perfilContratistaId).addClass("linkGosst").on("click",function(){
        verCheckListInduccionesGeneralesHabPerfilContratista();
    }).html(textInduccionesGeneralesHabPerfContHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListInduccionesGeneralesHabPerfCont").modal("hide");
}

function verCheckListInduccionesGeneralesHabPerfilContratista(){
    $("#modalCheckListInduccionesGeneralesHabPerfCont").modal("show");
}

function cargarCheckListInduccionesGeneralesHabPerfilContratista(){
    if(perfilContratistaObj.induccionesGeneralesHabilitadasId.length != 0){
        var induccionesGeneralesHabPerfContHabilitadosId = perfilContratistaObj.induccionesGeneralesHabilitadasId.split(",");

        induccionesGeneralesHabPerfContHabilitadosId.forEach(function(val1){
            var checkboxInduccionGeneralHab = document.getElementById('checkAsignadoInduccionesGeneralesHabPerfCont'+val1);

            if(checkboxInduccionGeneralHab != null){
                checkboxInduccionGeneralHab.checked = true;
            }
        });
    }

    ocultarCheckListInduccionesGeneralesHabPerfilContratista();
}

function volverDivPerfilContratista(){
   $("#tabPerfil .container-fluid").hide();
   $("#divContainPerfil").show();
   $("#tabPerfil h2").html("Perfiles de contratistas")
}

function verContratistsPerfil(){ 
   $("#tabPerfil .container-fluid").hide();
   $("#divProyPerfilContratista").show();
   $("#tblProyPerfilContratista tbody").html("");
   
   $("#tabPerfil h2").html(
      "<a onclick='volverDivPerfilContratista()'> Perfil "+perfilContratistaObj.nombre+"</a> " +
      "> Proyectos");
   
   listFullPerfilesContratista.forEach(function(val,index){ 
      if(val.id == perfilContratistaId){ 
	 var proyects = val.proyectos;

	 proyects.every(function(val2,index2){
	    $("#tblProyPerfilContratista tbody:first").prepend(
	       "<tr id='"+val2.id+"'>" +
	          "<td id='"+val2.id+"'>"+val2.titulo+"</td>" +
	          "<td id='"+val2.id+"'>"+val2.postulante.contratista.nombre+"</td>" + 
	          "<td id='"+val2.id+"'>"+val2.fechaInicioTexto+"</td>" + 
	          "<td id='"+val2.id+"'>"+val2.fechaFinTexto+"</td>" + 
	          "<td id='"+val2.id+"'>"+(val2.isActivo == 1?"Activo":val2.estado.nombre)+"</td>" +
	       "</tr>");
					 
	    return true;
	 });
      }
   });	
}

function nuevoPerfilContratista(){
    if(!banderaEdicionPerfil){
        perfilContratistaId = 0;
		
        $("#tblPerfilContratista tbody").prepend(
            "<tr id='0'>" +
                "<td><input type='text' id='inputNombrePerfil' class='form-control'></td>" +
                "<td id='persecc"+perfilContratistaId+"'>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td>...</td>" +
                "<td id='percampo"+perfilContratistaId+"'>...</td>" +
                "<td id='perreq"+perfilContratistaId+"'>...</td>" +
                "<td id='perTrabAltoRiesgo"+perfilContratistaId+"'>...</td>" +
                "<td id='perTrabAltoRiesgoCht"+perfilContratistaId+"'>...</td>" +
                "<td id='perInduccionesGenerales"+perfilContratistaId+"'>...</td>" +
                "<td>"+"<input type='checkbox' id='checkHabilitarEntrePrevPerfil' class='form-control'>"+"</td>" +
                "<td>"+"<input type='checkbox' id='checkHabilitarCargoInduccionTrabAltRie' class='form-control'>"+"</td>" +
                "<td>...</td>" +
				"<td><label>*Automático.</label></td>" +
				"<td>...</td>" +
            "</tr>");

        crearSelectOneMenuObligMultipleCompleto("slcPermiteReqProyectoPerfil","",
            listRequisitosProyectoContratista,"id","nombre","#perreq"+perfilContratistaId,"Habilitar...");
		
        formatoCeldaSombreableTabla(false,"tblPerfilContratista");

        crearCheckListGeneral("","Secciones habilitadas","SeccionesHabPerfCont",
            listSeccionContratistaPerfil,"SeccionesHabPerfilContratista",ocultarCheckListSeccionesHabPerfilContratista);

        crearCheckListGeneral("","Campos habilitados de trabajadores","CamposHabTrabPerfCont",
            listCampoTrabajadorContratistaPerfil,"CamposHabTrabPerfilContratista",ocultarCheckListCamposHabTrabPerfilContratista);

        crearCheckListGeneral("","Trabajos de alto riesgo habilitados","TrabajosAltoRiesgoHabPerfCont",
            listTrabajosAltoRiesgo,"TrabajosAltoRiesgoHabPerfilContratista",ocultarCheckListTrabajosAltoRiesgoHabPerfilContratista);

        crearCheckListGeneral("","Trabajos de alto riesgo asociados al trabajador","TrabajosAltoRiesgoChtHabPerfCont",
            listTrabajosAltoRiesgo,"TrabajosAltoRiesgoChtHabPerfilContratista",ocultarCheckListTrabajosAltoRiesgoChtHabPerfilContratista);

        crearCheckListGeneral("","Inducciones generales habilitadas","InduccionesGeneralesHabPerfCont",
            listInduccionesGenerales,"InduccionesGeneralesHabPerfilContratista",ocultarCheckListInduccionesGeneralesHabPerfilContratista);
		
        $("#btnCancelarPerfilContratista").show();$("#btnNuevoPerfilContratista").hide();$("#btnEliminarPerfilContratista").hide();
        $("#btnGuardarPerfilContratista").show();$("#btnVerEnlaceExamenConPerCon").hide();$("#btnVerPerfilesProyecto").hide();
        $("#btnConfiguracionSubUsuario").hide();$("#btnMensajesPersonalizado").hide();
      
        banderaEdicionPerfil = true;
    }else{
        alert("Guarde primero.");
    }
}

function cancelarPerfilContratista(){
   cargarTiposContratista();
}

function eliminarPerfilContratista(){
   mensajeUx="<label>¿Está seguro de eliminar el perfil seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","EliminarPerfilCont");

   $("#btnDevolverValorEliminarPerfilCont").on("click",function(){
      var dataParam={
	 id: perfilContratistaId
      };

      callAjaxPost(URL+'/contratista/perfil/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>El perfil seleccionado fue eliminado con éxito.</label>";
	       mensajesUx(mensajeUx,1,"","EliminarPerfilContAviso");
		
	       $("#modalMensajeUxEliminarPerfilContAviso").on("hidden.bs.modal",function(){
	          cargarPerfilContratistas();  
	       });
		
	       break;
		
	       default:
	          alert("Ocurrió un error al eliminar el perfil seleccionado!");
         }
      });
   });
}

function guardarPerfilContratista(){
   var campoVacio = true;
   var nombre = $("#inputNombrePerfil").val();

    var listSeccionesInhabilitadas = [];
    var textoSeccionesHabilitadas = "",textoSeccionesInhabilitadas = "",
        textoTipoExamHabilitados = "",textoTipoExamInhabilitados = "";

    listSeccionContratistaPerfil.forEach(function(val){
        var isAsignado = ($("#checkAsignadoSeccionesHabPerfCont"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoSeccionesHabilitadas += (textoSeccionesHabilitadas.length == 0?val.id:","+val.id);

            if(val.tipoExamenId != -1){
                textoTipoExamHabilitados += (textoTipoExamHabilitados.length == 0?val.tipoExamenId:","+val.tipoExamenId);
            }
        }else{
            listSeccionesInhabilitadas.push({id:val.id});
            textoSeccionesInhabilitadas += (textoSeccionesInhabilitadas.length == 0?val.id:","+val.id);

            if(val.tipoExamenId != -1){
                textoTipoExamInhabilitados += (textoTipoExamInhabilitados.length == 0?val.tipoExamenId:","+val.tipoExamenId);
            }
        }
    });

    var listCamposTrabInhabilitados = [];
    var textoCamTrabHabilitados = "";

    listCampoTrabajadorContratistaPerfil.forEach(function(val){
        var isAsignado = ($("#checkAsignadoCamposHabTrabPerfCont"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoCamTrabHabilitados += (textoCamTrabHabilitados.length == 0?val.id:","+val.id);
        }else{
            listCamposTrabInhabilitados.push({id:val.id});
        }
    });

   var requisitosProyectoHabilitadosId = $("#slcPermiteReqProyectoPerfil").val();
   var listRequisitosProyectoInhabilitados = [];
   var textoReqProyHabilitados = "",textoTipoActHabilitados = "",textoTipoActInhabilitados = "";

   listRequisitosProyectoContratista.forEach(function(val){
      var isRequisitoProyInhabilitado = 1;
  			
      requisitosProyectoHabilitadosId.forEach(function(val1){
  	 if(parseInt(val1) == val.id){
  	    isRequisitoProyInhabilitado = 0;
  	 }
      });
         
      if(isRequisitoProyInhabilitado == 1){
	 listRequisitosProyectoInhabilitados.push({id: val.id}); 
	 
	 if(val.tipoActividadId != -1){
	    textoTipoActInhabilitados += 
	       (textoTipoActInhabilitados.length == 0?val.tipoActividadId:","+val.tipoActividadId); 
	 }
      }else{
	 textoReqProyHabilitados += (textoReqProyHabilitados.length == 0?val.id:","+val.id);
	 
	 if(val.tipoActividadId != -1){
	    textoTipoActHabilitados += 
               (textoTipoActHabilitados.length == 0?val.tipoActividadId:","+val.tipoActividadId);
	 }
      }
   });

    var listInduccionesGeneralesHabilitadas = [];
    var textoInduccionesGeneralesHabilitadas = "";

    listInduccionesGenerales.forEach(function(val){
        var isAsignado = ($("#checkAsignadoInduccionesGeneralesHabPerfCont"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoInduccionesGeneralesHabilitadas += (textoInduccionesGeneralesHabilitadas.length == 0?val.id:","+val.id);
            listInduccionesGeneralesHabilitadas.push({id:val.id});
        }
    });

    var listTrabajosAltoRiesgoHabilitados = [];
    var textoTrabAltRieHabilitados = "";

    listTrabajosAltoRiesgo.forEach(function(val){
        var isAsignado = ($("#checkAsignadoTrabajosAltoRiesgoHabPerfCont"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoTrabAltRieHabilitados += (textoTrabAltRieHabilitados.length == 0?val.id:","+val.id);
            listTrabajosAltoRiesgoHabilitados.push({id:val.id});
        }
    });

    var listTrabajosAltoRiesgoChtHabilitados = [];
    var textoTrabAltRieChtHabilitados = "";
	var hashTrabajosAltoRiesgoChtHabilitados = new Map();

    listTrabajosAltoRiesgo.forEach(function(val){
        var isAsignado = ($("#checkAsignadoTrabajosAltoRiesgoChtHabPerfCont"+val.id).prop("checked")?1:0);

        if(isAsignado == 1){
            textoTrabAltRieChtHabilitados += (textoTrabAltRieChtHabilitados.length == 0?val.id:","+val.id);
            listTrabajosAltoRiesgoChtHabilitados.push({id:val.id});
			hashTrabajosAltoRiesgoChtHabilitados.set(val.id,1);
        }
    });

    var habilitarEntrevistaPrevencionista = ($("#checkHabilitarEntrePrevPerfil").prop("checked")?1:0);
    var habilitarCargoInduccionTrabAltRie = ($("#checkHabilitarCargoInduccionTrabAltRie").prop("checked")?1:0);

    if(nombre.length == 0){
        campoVacio = false;mensajeUx="<label>Debe completar el nombre del perfil.</label>";
    }else if(parseInt(getSession("gestopcompanyid")) == 741 && !hashTrabajosAltoRiesgoChtHabilitados.has(9) && (hashTrabajosAltoRiesgoChtHabilitados.has(120) ||
        hashTrabajosAltoRiesgoChtHabilitados.has(121) || hashTrabajosAltoRiesgoChtHabilitados.has(122))){
		campoVacio = false;mensajeUx="<label>Debe seleccionar el valor 'Trabajo de alto riesgo' en la columna 'Trabajos de alto riesgo asignados " +
		    "al trabajador' para continuar.</label>";
    }

    if(campoVacio){
        var dataParam={
	        id:perfilContratistaId,nombre:nombre,secciones:listSeccionesInhabilitadas,textoSeccionesHabilitadas:textoSeccionesHabilitadas,
	        camposTrabajador:listCamposTrabInhabilitados,textoCamTrabHabilitados:textoCamTrabHabilitados,
	        requisitosProyecto:listRequisitosProyectoInhabilitados,textoReqProyHabilitados:textoReqProyHabilitados,
	        textoTipoActHabilitados:textoTipoActHabilitados,textoTipoExamHabilitados:textoTipoExamHabilitados,
	        textoTipoActInhabilitados:textoTipoActInhabilitados,textoTipoExamInhabilitados:textoTipoExamInhabilitados,
	        textoSeccionesInhabilitadas:textoSeccionesInhabilitadas,empresa:{empresaId:getSession("gestopcompanyid")},
            habilitarEntrevistaPrevencionista:habilitarEntrevistaPrevencionista,trabajosAltoRiesgo:listTrabajosAltoRiesgoHabilitados,
            textoTrabAltRieHabilitados:textoTrabAltRieHabilitados,habilitarCargoInduccionTrabAltRie:habilitarCargoInduccionTrabAltRie,
            trabajosAltoRiesgoCht:listTrabajosAltoRiesgoChtHabilitados,textoTrabAltRieChtHabilitados:textoTrabAltRieChtHabilitados,
            induccionesGenerales:listInduccionesGeneralesHabilitadas,textoInduccionesGeneralesHabilitadas:textoInduccionesGeneralesHabilitadas
        };

        callAjaxPost(URL+'/contratista/perfil/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
	            case "05":
	                mensajeUx="<label>El registro del perfil fue guardado con éxito.<label>";
  	                mensajesUx(mensajeUx,1,"","ActualizarPerfilCont");
  		
  	                $("#modalMensajeUxActualizarPerfilCont").on("hidden.bs.modal",function(){
  	                    cargarPerfilContratistas();
  	                });
	       
	            break;
						
	            default:
	                console.log("Ocurrió un error al guardar el perfil!");
            }
        });
    }else{
        mensajesUx(mensajeUx,2,"","");
    }
}

function cancelarNuevoPerfilContratista(){
   cargarPerfilContratistas();
}

function volverDocumentosNivelConductorAsignadosPerfilContratista(){
   $("#modalDocNivelCondPerfCont").modal("hide");
}

function verDocumentosNivelConductorAsignadosPerfilContratista(){
   $("#modalDocNivelCondPerfCont").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' onclick='volverDocumentosNivelConductorAsignadosPerfilContratista()' " +
              "title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' onclick='guardarDocumentosNivelConductorAsignadosPerfilContratista()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelCondPerfCont\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelCondPerfCont\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalDocNivelCondPerfCont",
      nombre:"<i class='fa fa-table'></i> Perfil contratista - Documentos a nivel conductor",
      contenido: 
	 "<div id='divDocNivelCondPerfCont' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelCondPerfCont'>" +
            "<table id='tblDocNivelCondPerfCont' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
		  "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:250px'>Documento a nivel conductor</th>" +
	             "<th class='tb-acc' colspan='16' style='width:1600px'>Tipo de licencia</th>" + 
	          "</tr>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(1)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(2)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(3)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(4)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(5)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(6)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(7)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(8)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(9)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(10)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(11)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(12)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(13)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(14)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(15)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(16)+"</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelCondPerfCont",200);
   cargarDocumentosNivelConductorAsignadosPerfilContratista();
}

function cargarDocumentosNivelConductorAsignadosPerfilContratista(){    
   $("#tblDocNivelCondPerfCont tbody tr").remove();
   
   var dataParam={
      perfil: {tipoLicCond1DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond1DocNivelCondHabilitadosId,
         tipoLicCond2DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond2DocNivelCondHabilitadosId,
         tipoLicCond3DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond3DocNivelCondHabilitadosId,
         tipoLicCond4DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond4DocNivelCondHabilitadosId,
         tipoLicCond5DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond5DocNivelCondHabilitadosId,
         tipoLicCond6DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond6DocNivelCondHabilitadosId,
         tipoLicCond7DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond7DocNivelCondHabilitadosId,
         tipoLicCond8DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond8DocNivelCondHabilitadosId,
         tipoLicCond9DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond9DocNivelCondHabilitadosId,
         tipoLicCond10DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond10DocNivelCondHabilitadosId,
         tipoLicCond11DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond11DocNivelCondHabilitadosId,
         tipoLicCond12DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond12DocNivelCondHabilitadosId,
         tipoLicCond13DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond13DocNivelCondHabilitadosId,
         tipoLicCond14DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond14DocNivelCondHabilitadosId,
         tipoLicCond15DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond15DocNivelCondHabilitadosId,
         tipoLicCond16DocNivelCondHabilitadosId:perfilContratistaObj.tipoLicCond16DocNivelCondHabilitadosId}
   };
		
   callAjaxPost(URL+'/contratista/perfiles/documento_nivel_conductor',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listSeccionDocNivelCondContratistaPerfil = data.listTipoDocNivelCondContratistaPerfil;
						
         $("#tblDocNivelCondPerfCont tbody tr").remove();
 	 
         listSeccionDocNivelCondContratistaPerfil.forEach(function(val,index){   
            var inputCheckAsignadoTipoLicCond1DocNivelCond = "<input id='checkAsignadoTipoLicCond1DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond1DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond2DocNivelCond = "<input id='checkAsignadoTipoLicCond2DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond2DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond3DocNivelCond = "<input id='checkAsignadoTipoLicCond3DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond3DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond4DocNivelCond = "<input id='checkAsignadoTipoLicCond4DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond4DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond5DocNivelCond = "<input id='checkAsignadoTipoLicCond5DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond5DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond6DocNivelCond = "<input id='checkAsignadoTipoLicCond6DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond6DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond7DocNivelCond = "<input id='checkAsignadoTipoLicCond7DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond7DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond8DocNivelCond = "<input id='checkAsignadoTipoLicCond8DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond8DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond9DocNivelCond = "<input id='checkAsignadoTipoLicCond9DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond9DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond10DocNivelCond = "<input id='checkAsignadoTipoLicCond10DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond10DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond11DocNivelCond = "<input id='checkAsignadoTipoLicCond11DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond11DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond12DocNivelCond = "<input id='checkAsignadoTipoLicCond12DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond12DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond13DocNivelCond = "<input id='checkAsignadoTipoLicCond13DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond13DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond14DocNivelCond = "<input id='checkAsignadoTipoLicCond14DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond14DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond15DocNivelCond = "<input id='checkAsignadoTipoLicCond15DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond15DocNivelCondHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond16DocNivelCond = "<input id='checkAsignadoTipoLicCond16DocNivelCond"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond16DocNivelCondHabilitado == 1?"checked":"")+">";
            
            $("#tblDocNivelCondPerfCont tbody").append(
               "<tr id='trDocNivelCondPerfCont"+val.id+"'>" +
                  "<td style='word-break:break-all;'>"+val.nombre+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond1DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond2DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond3DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond4DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond5DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond6DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond7DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond8DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond9DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond10DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond11DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond12DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond13DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond14DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond15DocNivelCond+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond16DocNivelCond+"</td>" +
               "</tr>");
         });
            	
         goheadfixedY("#tblDocNivelCondPerfCont","#wrapperDocNivelCondPerfCont");
      }else{
         console.log("NOPNPO");
      }
   });
}

function guardarDocumentosNivelConductorAsignadosPerfilContratista(){
   var campoVacio = true;
   
   var listTipoLicCond1DocNivelCond = [],listTipoLicCond2DocNivelCond = [],listTipoLicCond3DocNivelCond = [],listTipoLicCond4DocNivelCond = [],
      listTipoLicCond5DocNivelCond = [],listTipoLicCond6DocNivelCond = [],listTipoLicCond7DocNivelCond = [],listTipoLicCond8DocNivelCond = [],
      listTipoLicCond9DocNivelCond = [],listTipoLicCond10DocNivelCond = [],listTipoLicCond11DocNivelCond = [],listTipoLicCond12DocNivelCond = [],
      listTipoLicCond13DocNivelCond = [],listTipoLicCond14DocNivelCond = [],listTipoLicCond15DocNivelCond = [],listTipoLicCond16DocNivelCond = [];
   var textoTipoLicCond1DocNivelCondHabilitados = "",textoTipoLicCond2DocNivelCondHabilitados = "",textoTipoLicCond3DocNivelCondHabilitados = "",
      textoTipoLicCond4DocNivelCondHabilitados = "",textoTipoLicCond5DocNivelCondHabilitados = "",textoTipoLicCond6DocNivelCondHabilitados = "",
      textoTipoLicCond7DocNivelCondHabilitados = "",textoTipoLicCond8DocNivelCondHabilitados = "",textoTipoLicCond9DocNivelCondHabilitados = "",
      textoTipoLicCond10DocNivelCondHabilitados = "",textoTipoLicCond11DocNivelCondHabilitados = "",textoTipoLicCond12DocNivelCondHabilitados = "",
      textoTipoLicCond13DocNivelCondHabilitados = "",textoTipoLicCond14DocNivelCondHabilitados = "",textoTipoLicCond15DocNivelCondHabilitados = "",
      textoTipoLicCond16DocNivelCondHabilitados = "";
   
   listSeccionDocNivelCondContratistaPerfil.forEach(function(val){
      var isAsignado1 = ($("#checkAsignadoTipoLicCond1DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado1 == 1){
	 listTipoLicCond1DocNivelCond.push({id:1,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond1DocNivelCondHabilitados += (textoTipoLicCond1DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado2 = ($("#checkAsignadoTipoLicCond2DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado2 == 1){
	 listTipoLicCond2DocNivelCond.push({id:2,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond2DocNivelCondHabilitados += (textoTipoLicCond2DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado3 = ($("#checkAsignadoTipoLicCond3DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado3 == 1){
	 listTipoLicCond3DocNivelCond.push({id:3,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond3DocNivelCondHabilitados += (textoTipoLicCond3DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado4 = ($("#checkAsignadoTipoLicCond4DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado4 == 1){
	 listTipoLicCond4DocNivelCond.push({id:4,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond4DocNivelCondHabilitados += (textoTipoLicCond4DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado5 = ($("#checkAsignadoTipoLicCond5DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado5 == 1){
	 listTipoLicCond5DocNivelCond.push({id:5,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond5DocNivelCondHabilitados += (textoTipoLicCond5DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado6 = ($("#checkAsignadoTipoLicCond6DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado6 == 1){
	 listTipoLicCond6DocNivelCond.push({id:6,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond6DocNivelCondHabilitados += (textoTipoLicCond6DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado7 = ($("#checkAsignadoTipoLicCond7DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado7 == 1){
	 listTipoLicCond7DocNivelCond.push({id:7,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond7DocNivelCondHabilitados += (textoTipoLicCond7DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado8 = ($("#checkAsignadoTipoLicCond8DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado8 == 1){
	 listTipoLicCond8DocNivelCond.push({id:8,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond8DocNivelCondHabilitados += (textoTipoLicCond8DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado9 = ($("#checkAsignadoTipoLicCond9DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado9 == 1){
	 listTipoLicCond9DocNivelCond.push({id:9,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond9DocNivelCondHabilitados += (textoTipoLicCond9DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado10 = ($("#checkAsignadoTipoLicCond10DocNivelCond"+val.id).prop("checked")?1:0); 
       
      if(isAsignado10 == 1){
	 listTipoLicCond10DocNivelCond.push({id:10,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond10DocNivelCondHabilitados += (textoTipoLicCond10DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado11 = ($("#checkAsignadoTipoLicCond11DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado11 == 1){
	 listTipoLicCond11DocNivelCond.push({id:11,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond11DocNivelCondHabilitados += (textoTipoLicCond11DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado12 = ($("#checkAsignadoTipoLicCond12DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado12 == 1){
	 listTipoLicCond12DocNivelCond.push({id:12,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond12DocNivelCondHabilitados += (textoTipoLicCond12DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado13 = ($("#checkAsignadoTipoLicCond13DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado13 == 1){
	 listTipoLicCond13DocNivelCond.push({id:13,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond13DocNivelCondHabilitados += (textoTipoLicCond13DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado14 = ($("#checkAsignadoTipoLicCond14DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado14 == 1){
	 listTipoLicCond14DocNivelCond.push({id:14,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond14DocNivelCondHabilitados += (textoTipoLicCond14DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado15 = ($("#checkAsignadoTipoLicCond15DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado15 == 1){
	 listTipoLicCond15DocNivelCond.push({id:15,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond15DocNivelCondHabilitados += (textoTipoLicCond15DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado16 = ($("#checkAsignadoTipoLicCond16DocNivelCond"+val.id).prop("checked")?1:0); 
      
      if(isAsignado16 == 1){
	 listTipoLicCond16DocNivelCond.push({id:16,tipoDocumentoConductorId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond16DocNivelCondHabilitados += (textoTipoLicCond16DocNivelCondHabilitados.length == 0?val.id:","+val.id);
      }
   });	
   
   if(campoVacio){
      var dataParam={
	 id:perfilContratistaId,tipoLicCond1DocNivelCond:listTipoLicCond1DocNivelCond,textoTipoLicCond1DocNivelCondHabilitados:textoTipoLicCond1DocNivelCondHabilitados,
         tipoLicCond2DocNivelCond:listTipoLicCond2DocNivelCond,textoTipoLicCond2DocNivelCondHabilitados:textoTipoLicCond2DocNivelCondHabilitados,
         tipoLicCond3DocNivelCond:listTipoLicCond3DocNivelCond,textoTipoLicCond3DocNivelCondHabilitados:textoTipoLicCond3DocNivelCondHabilitados,
         tipoLicCond4DocNivelCond:listTipoLicCond4DocNivelCond,textoTipoLicCond4DocNivelCondHabilitados:textoTipoLicCond4DocNivelCondHabilitados,
         tipoLicCond5DocNivelCond:listTipoLicCond5DocNivelCond,textoTipoLicCond5DocNivelCondHabilitados:textoTipoLicCond5DocNivelCondHabilitados,
         tipoLicCond6DocNivelCond:listTipoLicCond6DocNivelCond,textoTipoLicCond6DocNivelCondHabilitados:textoTipoLicCond6DocNivelCondHabilitados,
         tipoLicCond7DocNivelCond:listTipoLicCond7DocNivelCond,textoTipoLicCond7DocNivelCondHabilitados:textoTipoLicCond7DocNivelCondHabilitados,
         tipoLicCond8DocNivelCond:listTipoLicCond8DocNivelCond,textoTipoLicCond8DocNivelCondHabilitados:textoTipoLicCond8DocNivelCondHabilitados,
         tipoLicCond9DocNivelCond:listTipoLicCond9DocNivelCond,textoTipoLicCond9DocNivelCondHabilitados:textoTipoLicCond9DocNivelCondHabilitados,
         tipoLicCond10DocNivelCond:listTipoLicCond10DocNivelCond,textoTipoLicCond10DocNivelCondHabilitados:textoTipoLicCond10DocNivelCondHabilitados,
         tipoLicCond11DocNivelCond:listTipoLicCond11DocNivelCond,textoTipoLicCond11DocNivelCondHabilitados:textoTipoLicCond11DocNivelCondHabilitados,
         tipoLicCond12DocNivelCond:listTipoLicCond12DocNivelCond,textoTipoLicCond12DocNivelCondHabilitados:textoTipoLicCond12DocNivelCondHabilitados,
         tipoLicCond13DocNivelCond:listTipoLicCond13DocNivelCond,textoTipoLicCond13DocNivelCondHabilitados:textoTipoLicCond13DocNivelCondHabilitados,
         tipoLicCond14DocNivelCond:listTipoLicCond14DocNivelCond,textoTipoLicCond14DocNivelCondHabilitados:textoTipoLicCond14DocNivelCondHabilitados,
         tipoLicCond15DocNivelCond:listTipoLicCond15DocNivelCond,textoTipoLicCond15DocNivelCondHabilitados:textoTipoLicCond15DocNivelCondHabilitados,
         tipoLicCond16DocNivelCond:listTipoLicCond16DocNivelCond,textoTipoLicCond16DocNivelCondHabilitados:textoTipoLicCond16DocNivelCondHabilitados
      };

      callAjaxPost(URL+'/contratista/perfiles/documento_nivel_conductor/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalDocNivelCondPerfCont").modal("hide");
		
	       mensajeUx="<label>El registro de los documentos a nivel conductor fue guardado con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarPerfilDocCond");
  		
  	       $("#modalMensajeUxActualizarPerfilDocCond").on("hidden.bs.modal",function(){
  	          cargarPerfilContratistas();
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar el perfil!");
         }
      });
   }else{
      $("#modalDocNivelVehMaqPerfCont").modal("hide");  
      mensajesUx(mensajeUx,2,"","ActualizarPerfilDocCond");
		
      $("#modalMensajeUxActualizarPerfilDocCond").on("hidden.bs.modal",function(){ 
         $("#modalDocNivelCondPerfCont").modal("show");
      });
   }	
}

function volverDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista(){
   $("#modalDocNivelVehMaqPerfCont").modal("hide");
}

function verDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista(){
   $("#modalDocNivelVehMaqPerfCont").remove();
   
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' onclick='volverDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista()' " +
              "title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' onclick='guardarDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelVehMaqPerfCont\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelVehMaqPerfCont\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"90%",id:"modalDocNivelVehMaqPerfCont",
      nombre:"<i class='fa fa-table'></i> Perfil contratista - Documentos a nivel vehículo/maquinaria",
      contenido: 
	 "<div id='divDocNivelVehMaqPerfCont' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelVehMaqPerfCont'>" +
            "<table id='tblDocNivelVehMaqPerfCont' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:250px'>Documento a nivel vehículo/maquinaria</th>" +
	             "<th class='tb-acc' colspan='16' style='width:1600px'>Tipo</th>" + 
	          "</tr>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(1)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(2)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(3)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(4)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(5)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(6)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(7)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(8)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(9)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(10)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(11)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(12)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(13)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(14)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(15)+"</th>" +
		     "<th class='tb-acc' style='width:100px'>"+mapTipoLicenciaCondNombre.get(16)+"</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelVehMaqPerfCont",200);
   cargarDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista();
}

function cargarDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista(){    
   $("#tblDocNivelVehMaqPerfCont tbody tr").remove();
   
   var dataParam={
      perfil: {tipoLicCond1DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond1DocNivelVehMaqHabilitadosId,
         tipoLicCond2DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond2DocNivelVehMaqHabilitadosId,
         tipoLicCond3DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond3DocNivelVehMaqHabilitadosId,
         tipoLicCond4DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond4DocNivelVehMaqHabilitadosId,
         tipoLicCond5DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond5DocNivelVehMaqHabilitadosId,
         tipoLicCond6DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond6DocNivelVehMaqHabilitadosId,
         tipoLicCond7DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond7DocNivelVehMaqHabilitadosId,
         tipoLicCond8DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond8DocNivelVehMaqHabilitadosId,
         tipoLicCond9DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond9DocNivelVehMaqHabilitadosId,
         tipoLicCond10DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond10DocNivelVehMaqHabilitadosId,
         tipoLicCond11DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond11DocNivelVehMaqHabilitadosId,
         tipoLicCond12DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond12DocNivelVehMaqHabilitadosId,
         tipoLicCond13DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond13DocNivelVehMaqHabilitadosId,
         tipoLicCond14DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond14DocNivelVehMaqHabilitadosId,
         tipoLicCond15DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond15DocNivelVehMaqHabilitadosId,
         tipoLicCond16DocNivelVehMaqHabilitadosId:perfilContratistaObj.tipoLicCond16DocNivelVehMaqHabilitadosId}
   };
		
   callAjaxPost(URL+'/contratista/perfiles/documento_nivel_vehiculo_maquinaria',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
         listSeccionDocNivelVehMaqContratistaPerfil = data.listTipoDocNivelVehMaqContratistaPerfil;
						
         $("#tblDocNivelVehMaqPerfCont tbody tr").remove();
 	 
         listSeccionDocNivelVehMaqContratistaPerfil.forEach(function(val,index){   
            var inputCheckAsignadoTipoLicCond1DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond1DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond1DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond2DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond2DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond2DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond3DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond3DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond3DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond4DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond4DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond4DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond5DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond5DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond5DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond6DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond6DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond6DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond7DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond7DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond7DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond8DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond8DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond8DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond9DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond9DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond9DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond10DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond10DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoLicCond10DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond11DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond11DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
                (val.tipoLicCond11DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond12DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond12DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond12DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond13DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond13DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond13DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond14DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond14DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond14DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond15DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond15DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond15DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoLicCond16DocNivelVehMaq = "<input id='checkAsignadoTipoLicCond16DocNivelVehMaq"+val.id+"' type='checkbox' class='form-control' " +
            	(val.tipoLicCond16DocNivelVehMaqHabilitado == 1?"checked":"")+">";
            
            $("#tblDocNivelVehMaqPerfCont tbody").append(
               "<tr id='trDocNivelVehMaqPerfCont"+val.id+"'>" +
                  "<td style='word-break:break-all;'>"+val.nombre+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond1DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond2DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond3DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond4DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond5DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond6DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond7DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond8DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond9DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond10DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond11DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond12DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond13DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond14DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond15DocNivelVehMaq+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoLicCond16DocNivelVehMaq+"</td>" +
               "</tr>");
         });
            	
         goheadfixedY("#tblDocNivelVehMaqPerfCont","#wrapperDocNivelVehMaqPerfCont");
      }else{
         console.log("NOPNPO");
      }
   });
}

function guardarDocumentosNivelVehiculoMaquinariaAsignadosPerfilContratista(){
   var campoVacio = true;
   
   var listTipoLicCond1DocNivelVehMaq = [],listTipoLicCond2DocNivelVehMaq = [],listTipoLicCond3DocNivelVehMaq = [],listTipoLicCond4DocNivelVehMaq = [],
      listTipoLicCond5DocNivelVehMaq = [],listTipoLicCond6DocNivelVehMaq = [],listTipoLicCond7DocNivelVehMaq = [],listTipoLicCond8DocNivelVehMaq = [],
      listTipoLicCond9DocNivelVehMaq = [],listTipoLicCond10DocNivelVehMaq = [],listTipoLicCond11DocNivelVehMaq = [],listTipoLicCond12DocNivelVehMaq = [],
      listTipoLicCond13DocNivelVehMaq = [],listTipoLicCond14DocNivelVehMaq = [],listTipoLicCond15DocNivelVehMaq = [],listTipoLicCond16DocNivelVehMaq = [];
   var textoTipoLicCond1DocNivelVehMaqHabilitados = "",textoTipoLicCond2DocNivelVehMaqHabilitados = "",textoTipoLicCond3DocNivelVehMaqHabilitados = "",
      textoTipoLicCond4DocNivelVehMaqHabilitados = "",textoTipoLicCond5DocNivelVehMaqHabilitados = "",textoTipoLicCond6DocNivelVehMaqHabilitados = "",
      textoTipoLicCond7DocNivelVehMaqHabilitados = "",textoTipoLicCond8DocNivelVehMaqHabilitados = "",textoTipoLicCond9DocNivelVehMaqHabilitados = "",
      textoTipoLicCond10DocNivelVehMaqHabilitados = "",textoTipoLicCond11DocNivelVehMaqHabilitados = "",textoTipoLicCond12DocNivelVehMaqHabilitados = "",
      textoTipoLicCond13DocNivelVehMaqHabilitados = "",textoTipoLicCond14DocNivelVehMaqHabilitados = "",textoTipoLicCond15DocNivelVehMaqHabilitados = "",
      textoTipoLicCond16DocNivelVehMaqHabilitados = "";
   
   listSeccionDocNivelVehMaqContratistaPerfil.forEach(function(val){
      var isAsignado1 = ($("#checkAsignadoTipoLicCond1DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado1 == 1){
	 listTipoLicCond1DocNivelVehMaq.push({id:1,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond1DocNivelVehMaqHabilitados += (textoTipoLicCond1DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado2 = ($("#checkAsignadoTipoLicCond2DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado2 == 1){
	 listTipoLicCond2DocNivelVehMaq.push({id:2,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond2DocNivelVehMaqHabilitados += (textoTipoLicCond2DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado3 = ($("#checkAsignadoTipoLicCond3DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado3 == 1){
	 listTipoLicCond3DocNivelVehMaq.push({id:3,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond3DocNivelVehMaqHabilitados += (textoTipoLicCond3DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado4 = ($("#checkAsignadoTipoLicCond4DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado4 == 1){
	 listTipoLicCond4DocNivelVehMaq.push({id:4,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond4DocNivelVehMaqHabilitados += (textoTipoLicCond4DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado5 = ($("#checkAsignadoTipoLicCond5DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado5 == 1){
	 listTipoLicCond5DocNivelVehMaq.push({id:5,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond5DocNivelVehMaqHabilitados += (textoTipoLicCond5DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado6 = ($("#checkAsignadoTipoLicCond6DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado6 == 1){
	 listTipoLicCond6DocNivelVehMaq.push({id:6,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond6DocNivelVehMaqHabilitados += (textoTipoLicCond6DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado7 = ($("#checkAsignadoTipoLicCond7DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado7 == 1){
	 listTipoLicCond7DocNivelVehMaq.push({id:7,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond7DocNivelVehMaqHabilitados += (textoTipoLicCond7DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado8 = ($("#checkAsignadoTipoLicCond8DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado8 == 1){
	 listTipoLicCond8DocNivelVehMaq.push({id:8,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond8DocNivelVehMaqHabilitados += (textoTipoLicCond8DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado9 = ($("#checkAsignadoTipoLicCond9DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado9 == 1){
	 listTipoLicCond9DocNivelVehMaq.push({id:9,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond9DocNivelVehMaqHabilitados += (textoTipoLicCond9DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado10 = ($("#checkAsignadoTipoLicCond10DocNivelVehMaq"+val.id).prop("checked")?1:0); 
       
      if(isAsignado10 == 1){
	 listTipoLicCond10DocNivelVehMaq.push({id:10,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond10DocNivelVehMaqHabilitados += (textoTipoLicCond10DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado11 = ($("#checkAsignadoTipoLicCond11DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado11 == 1){
	 listTipoLicCond11DocNivelVehMaq.push({id:11,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond11DocNivelVehMaqHabilitados += (textoTipoLicCond11DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado12 = ($("#checkAsignadoTipoLicCond12DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado12 == 1){
	 listTipoLicCond12DocNivelVehMaq.push({id:12,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond12DocNivelVehMaqHabilitados += (textoTipoLicCond12DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado13 = ($("#checkAsignadoTipoLicCond13DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado13 == 1){
	 listTipoLicCond13DocNivelVehMaq.push({id:13,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond13DocNivelVehMaqHabilitados += (textoTipoLicCond13DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado14 = ($("#checkAsignadoTipoLicCond14DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado14 == 1){
	 listTipoLicCond14DocNivelVehMaq.push({id:14,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond14DocNivelVehMaqHabilitados += (textoTipoLicCond14DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado15 = ($("#checkAsignadoTipoLicCond15DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado15 == 1){
	 listTipoLicCond15DocNivelVehMaq.push({id:15,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond15DocNivelVehMaqHabilitados += (textoTipoLicCond15DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
      
      var isAsignado16 = ($("#checkAsignadoTipoLicCond16DocNivelVehMaq"+val.id).prop("checked")?1:0); 
      
      if(isAsignado16 == 1){
	 listTipoLicCond16DocNivelVehMaq.push({id:16,tipoDocumentoVehiculoMaquinariaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoLicCond16DocNivelVehMaqHabilitados += (textoTipoLicCond16DocNivelVehMaqHabilitados.length == 0?val.id:","+val.id);
      }
   });	
   
   if(campoVacio){
      var dataParam={
	 id:perfilContratistaId,tipoLicCond1DocNivelVehMaq:listTipoLicCond1DocNivelVehMaq,textoTipoLicCond1DocNivelVehMaqHabilitados:textoTipoLicCond1DocNivelVehMaqHabilitados,
         tipoLicCond2DocNivelVehMaq:listTipoLicCond2DocNivelVehMaq,textoTipoLicCond2DocNivelVehMaqHabilitados:textoTipoLicCond2DocNivelVehMaqHabilitados,
         tipoLicCond3DocNivelVehMaq:listTipoLicCond3DocNivelVehMaq,textoTipoLicCond3DocNivelVehMaqHabilitados:textoTipoLicCond3DocNivelVehMaqHabilitados,
         tipoLicCond4DocNivelVehMaq:listTipoLicCond4DocNivelVehMaq,textoTipoLicCond4DocNivelVehMaqHabilitados:textoTipoLicCond4DocNivelVehMaqHabilitados,
         tipoLicCond5DocNivelVehMaq:listTipoLicCond5DocNivelVehMaq,textoTipoLicCond5DocNivelVehMaqHabilitados:textoTipoLicCond5DocNivelVehMaqHabilitados,
         tipoLicCond6DocNivelVehMaq:listTipoLicCond6DocNivelVehMaq,textoTipoLicCond6DocNivelVehMaqHabilitados:textoTipoLicCond6DocNivelVehMaqHabilitados,
         tipoLicCond7DocNivelVehMaq:listTipoLicCond7DocNivelVehMaq,textoTipoLicCond7DocNivelVehMaqHabilitados:textoTipoLicCond7DocNivelVehMaqHabilitados,
         tipoLicCond8DocNivelVehMaq:listTipoLicCond8DocNivelVehMaq,textoTipoLicCond8DocNivelVehMaqHabilitados:textoTipoLicCond8DocNivelVehMaqHabilitados,
         tipoLicCond9DocNivelVehMaq:listTipoLicCond9DocNivelVehMaq,textoTipoLicCond9DocNivelVehMaqHabilitados:textoTipoLicCond9DocNivelVehMaqHabilitados,
         tipoLicCond10DocNivelVehMaq:listTipoLicCond10DocNivelVehMaq,textoTipoLicCond10DocNivelVehMaqHabilitados:textoTipoLicCond10DocNivelVehMaqHabilitados,
         tipoLicCond11DocNivelVehMaq:listTipoLicCond11DocNivelVehMaq,textoTipoLicCond11DocNivelVehMaqHabilitados:textoTipoLicCond11DocNivelVehMaqHabilitados,
         tipoLicCond12DocNivelVehMaq:listTipoLicCond12DocNivelVehMaq,textoTipoLicCond12DocNivelVehMaqHabilitados:textoTipoLicCond12DocNivelVehMaqHabilitados,
         tipoLicCond13DocNivelVehMaq:listTipoLicCond13DocNivelVehMaq,textoTipoLicCond13DocNivelVehMaqHabilitados:textoTipoLicCond13DocNivelVehMaqHabilitados,
         tipoLicCond14DocNivelVehMaq:listTipoLicCond14DocNivelVehMaq,textoTipoLicCond14DocNivelVehMaqHabilitados:textoTipoLicCond14DocNivelVehMaqHabilitados,
         tipoLicCond15DocNivelVehMaq:listTipoLicCond15DocNivelVehMaq,textoTipoLicCond15DocNivelVehMaqHabilitados:textoTipoLicCond15DocNivelVehMaqHabilitados,
         tipoLicCond16DocNivelVehMaq:listTipoLicCond16DocNivelVehMaq,textoTipoLicCond16DocNivelVehMaqHabilitados:textoTipoLicCond16DocNivelVehMaqHabilitados
      };

      callAjaxPost(URL+'/contratista/perfiles/documento_nivel_vehiculo_maquinaria/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalDocNivelVehMaqPerfCont").modal("hide");
		
	       mensajeUx="<label>El registro de los documentos a nivel vehículo/maquinaria fue guardado con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarPerfilDocVehMaq");
  		
  	       $("#modalMensajeUxActualizarPerfilDocVehMaq").on("hidden.bs.modal",function(){
  	          cargarPerfilContratistas();
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar el perfil!");
         }
      });
   }else{
      $("#modalDocNivelVehMaqPerfCont").modal("hide");  
      mensajesUx(mensajeUx,2,"","ActualizarPerfilDocVehMaq");
		
      $("#modalMensajeUxActualizarPerfilDocVehMaq").on("hidden.bs.modal",function(){ 
         $("#modalDocNivelVehMaqPerfCont").modal("show");
      });
   }	
}

function volverDocumentosNivelEquipoHerramientaAsignadosPerfilContratista(){
   $("#modalDocNivelEquHerrPerfCont").modal("hide");
}

function verDocumentosNivelEquipoHerramientaAsignadosPerfilContratista(){
   $("#modalDocNivelEquHerrPerfCont").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' onclick='volverDocumentosNivelEquipoHerramientaAsignadosPerfilContratista()' " +
              "title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' onclick='guardarDocumentosNivelEquipoHerramientaAsignadosPerfilContratista()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelEquHerrPerfCont\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelEquHerrPerfCont\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalDocNivelEquHerrPerfCont",
      nombre:"<i class='fa fa-table'></i> Perfil contratista - Documentos a nivel equipo/herramienta",
      contenido: 
	 "<div id='divDocNivelEquHerrPerfCont' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelEquHerrPerfCont'>" +
            "<table id='tblDocNivelEquHerrPerfCont' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
		  "<tr>" +
	             "<th class='tb-acc' rowspan='2' style='width:250px'>Documento a nivel equipo/herramienta</th>" +
	             "<th class='tb-acc' colspan='2' style='width:200px'>Tipo</th>" + 
	          "</tr>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:100px'>Equipo</th>" +
		     "<th class='tb-acc' style='width:100px'>Herramienta</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelEquHerrPerfCont",200);
   cargarDocumentosNivelEquipoHerramientaAsignadosPerfilContratista();
}

function cargarDocumentosNivelEquipoHerramientaAsignadosPerfilContratista(){    
   $("#tblDocNivelEquHerrPerfCont tbody tr").remove();
   
   var dataParam={
      perfil: {tipoEquHerr1DocNivelEquHerrHabilitadosId:perfilContratistaObj.tipoEquHerr1DocNivelEquHerrHabilitadosId,
	 tipoEquHerr2DocNivelEquHerrHabilitadosId:perfilContratistaObj.tipoEquHerr2DocNivelEquHerrHabilitadosId}
   };
		
   callAjaxPost(URL+'/contratista/perfiles/documento_nivel_equipo_herramienta',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listSeccionDocNivelEquHerrContratistaPerfil = data.listTipoDocNivelEquHerrContratistaPerfil;
						
         $("#tblDocNivelEquHerrPerfCont tbody tr").remove();
 	 
         listSeccionDocNivelEquHerrContratistaPerfil.forEach(function(val,index){   
            var inputCheckAsignadoTipoEquHerr1DocNivelEquHerr = "<input id='checkAsignadoTipoEquHerr1DocNivelEquHerr"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoEquHerr1DocNivelEquHerrHabilitado == 1?"checked":"")+">";
            var inputCheckAsignadoTipoEquHerr2DocNivelEquHerr = "<input id='checkAsignadoTipoEquHerr2DocNivelEquHerr"+val.id+"' type='checkbox' class='form-control' " +
               (val.tipoEquHerr2DocNivelEquHerrHabilitado == 1?"checked":"")+">";
            
            $("#tblDocNivelEquHerrPerfCont tbody").append(
               "<tr id='trDocNivelEquHerrPerfCont"+val.id+"'>" +
                  "<td style='word-break:break-all;'>"+val.nombre+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoEquHerr1DocNivelEquHerr+"</td>" +
        	  "<td>"+inputCheckAsignadoTipoEquHerr2DocNivelEquHerr+"</td>" +
               "</tr>");
         });
            	
         goheadfixedY("#tblDocNivelEquHerrPerfCont","#wrapperDocNivelEquHerrPerfCont");
      }else{
         console.log("NOPNPO");
      }
   });
}

function guardarDocumentosNivelEquipoHerramientaAsignadosPerfilContratista(){
   var campoVacio = true;
   
   var listTipoEquHerr1DocNivelEquHerr = [],listTipoEquHerr2DocNivelEquHerr = [];
   var textoTipoEquHerr1DocNivelEquHerrHabilitados = "",textoTipoEquHerr2DocNivelEquHerrHabilitados = "";
   
   listSeccionDocNivelEquHerrContratistaPerfil.forEach(function(val){
      var isAsignado1 = ($("#checkAsignadoTipoEquHerr1DocNivelEquHerr"+val.id).prop("checked")?1:0); 
       
      if(isAsignado1 == 1){
	 listTipoEquHerr1DocNivelEquHerr.push({id:1,tipoDocumentoEquipoHerramientaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoEquHerr1DocNivelEquHerrHabilitados += (textoTipoEquHerr1DocNivelEquHerrHabilitados.length == 0?val.id:","+val.id);
      }

      var isAsignado2 = ($("#checkAsignadoTipoEquHerr2DocNivelEquHerr"+val.id).prop("checked")?1:0); 
       
      if(isAsignado2 == 1){
	 listTipoEquHerr2DocNivelEquHerr.push({id:2,tipoDocumentoEquipoHerramientaId:val.id,perfilContratistaId:perfilContratistaId});
	 textoTipoEquHerr2DocNivelEquHerrHabilitados += (textoTipoEquHerr2DocNivelEquHerrHabilitados.length == 0?val.id:","+val.id);
      }
   });	
   
   if(campoVacio){
      var dataParam={
	 id:perfilContratistaId,tipoEquHerr1DocNivelEquHerr:listTipoEquHerr1DocNivelEquHerr,textoTipoEquHerr1DocNivelEquHerrHabilitados:textoTipoEquHerr1DocNivelEquHerrHabilitados,
         tipoEquHerr2DocNivelEquHerr:listTipoEquHerr2DocNivelEquHerr,textoTipoEquHerr2DocNivelEquHerrHabilitados:textoTipoEquHerr2DocNivelEquHerrHabilitados
      };

      callAjaxPost(URL+'/contratista/perfiles/documento_nivel_equipo_herramienta/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalDocNivelEquHerrPerfCont").modal("hide");
		
	       mensajeUx="<label>El registro de los documentos a nivel equipo/herramienta fue guardado con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarPerfilDocEquHerr");
  		
  	       $("#modalMensajeUxActualizarPerfilDocEquHerr").on("hidden.bs.modal",function(){
  	          cargarPerfilContratistas();
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar el perfil!");
         }
      });
   }else{
      $("#modalDocNivelEquHerrPerfCont").modal("hide");  
      mensajesUx(mensajeUx,2,"","ActualizarPerfilDocEquHerr");
		
      $("#modalMensajeUxActualizarPerfilDocEquHerr").on("hidden.bs.modal",function(){ 
         $("#modalDocNivelEquHerrPerfCont").modal("show");
      });
   }	
}

var enlaceExamConId,enlaceExamConObj;
var banderaEdicionEnlExaCon = false;
var listFullEnlacesExamenesContratista;
var listTipoExamenContratista;

function regresarPerfilContratista(){
   $("#modalEnlacesExamenesContratista").modal("hide"); 
}

function verEnlacesExamenesContratista(){
    
   var listModal={
      id:"modalEnlacesExamenesContratista",
      nombre:"<i class='fa fa-external-link'></i> Lista de enlaces - exámenes contratista " +
      	     "(perfil "+perfilContratistaObj.nombre+")",
      contenido:
         "<button id='btnVolverPrincipalEnlExaCon' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                 "onclick='regresarPerfilContratista()'>" +
	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
	 "</button>" +
 	 "<button id='btnVolverEnlExaCon' class='btn btn-success' style='margin-left:5px' " +
 	         "title='Deshacer las acciones hechas en el registro.' onclick='cancelarEnlaceExamenContratista()'>" +
 	    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
 	 "</button>" +
	 "<button id='btnNuevoEnlExaCon' type='button' class='btn btn-success' style='margin-left:5px' " + 
	         "title='Registrar una nuevo enlace asociado a un examen contratista.' onclick='nuevoEnlaceExamenContratista()'>" +
            "<i class='fa fa-file-o fa-2x'></i>" +
         "</button>" +
 	 "<button id='btnGuardarEnlExaCon' class='btn btn-success' style='margin-left:5px' " +
 	         "title='Guardar el enlace asociado a un examen contratista ingresado/modificado.' onclick='guardarEnlaceExamenContratista()'>" +
 	    "<i class='fa fa-floppy-o fa-2x'></i>" +
 	 "</button>" +
 	 "<button id='btnEliminarEnlExaCon' type='button' class='btn btn-danger' style='margin-left:5px' " +
 	         "title='Eliminar el enlace asociado a un examen contratista seleccionado.' onclick='eliminarEnlaceExamenContratista()'>" +
 	    "<i class='fa fa-times fa-2x'></i>" +
 	 "</button>" +
 	 "<div class='wrapper' id='wrapEnlExamenesCon'>" +
 	    "<table id='tblEnlExamenesCon' class='table table-striped table-bordered table-hover table-fixed'>" +
 	       "<thead>" +
 	          "<tr>" +
 		     "<td class='tb-acc' style='width:200px'>Nombre</td>" +
 		     "<td class='tb-acc' style='width:200px'>Enlace</td>" +
 		     "<td class='tb-acc' style='width:250px'>Examen contratista asociado</td>" +
 		  "</tr>" +
 	       "</thead>" +
 	       "<tbody></tbody>" +
 	    "</table>" +
 	 "</div>"};
 	
   agregarModalPrincipalUsuario(listModal);
   cargarEnlacesExamenesContratista();
}

function cargarEnlacesExamenesContratista(){
   $("#btnVolverPrincipalEnlExaCon").show();$("#btnVolverEnlExaCon").hide();$("#btnNuevoEnlExaCon").show();
   $("#btnGuardarEnlExaCon").hide();$("#btnEliminarEnlExaCon").hide();
     
   resizeDivWrapper("wrapEnlExamenesCon",210);
     
   var dataParam={
      perfilContratistaId: perfilContratistaId
   };
  	
   callAjaxPost(URL+'/contratista/perfiles/enlace_examen_contratista',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionEnlExaCon = false;
	 listFullEnlacesExamenesContratista = data.listFullEnlacesExamenesContratista;
         listTipoExamenContratista = data.listTipoExamenContratista;
 						
 	 $("#tblEnlExamenesCon tbody tr").remove();
 	         
 	 listFullEnlacesExamenesContratista.forEach(function(val,index){     
 	    $("#tblEnlExamenesCon tbody").append(
               "<tr id='trEnlExaCon"+val.id+"' onclick='editarEnlaceExamenContratista("+index+")'>" +
 	          "<td id='tdNombreEnlExaCon"+val.id+"'>"+val.nombre+"</td>" + 
 	          "<td id='tdEnlaceEnlExaCon"+val.id+"' style='word-break:break-all;'>"+val.enlace+"</td>" + 
 		  "<td id='tdTipoExamenConEnlExaCon"+val.id+"'>"+val.tipoExamenCon.nombre+"</td>" +
 	       "</tr>");
 	 });
 	 				
 	 goheadfixedY("#tblEnlExamenesCon","#wrapEnlExamenesCon");
 	 formatoCeldaSombreableTabla(true,"tblEnlExamenesCon");
      }else{
 	 console.log("NOPNPO");
      }
   });	
}

function cancelarEnlaceExamenContratista(){
   cargarEnlacesExamenesContratista();
}

function editarEnlaceExamenContratista(pindex){
   if(!banderaEdicionEnlExaCon){
      formatoCeldaSombreableTabla(false,"tblEnlExamenesCon");
      enlaceExamConId = listFullEnlacesExamenesContratista[pindex].id;
      enlaceExamConObj = listFullEnlacesExamenesContratista[pindex];
 		
      $("#trEnlExaCon"+enlaceExamConId).addClass("fila-edicion");
       
      $("#tdNombreEnlExaCon"+enlaceExamConId)
      .html("<input type='text' id='inputNombreEnlExaCon' class='form-control'>");
      $("#inputNombreEnlExaCon").val(enlaceExamConObj.nombre);
      
      $("#tdEnlaceEnlExaCon"+enlaceExamConId)
      .html("<input type='text' id='inputEnlaceEnlExaCon' class='form-control'>");
      $("#inputEnlaceEnlExaCon").val(enlaceExamConObj.enlace);
      
      var tipoExamenContratistaId = enlaceExamConObj.tipoExamenCon.id;
	
      var selTipoExamenContratista = crearSelectOneMenu("selTipoExamenContratista","",
	 listTipoExamenContratista,tipoExamenContratistaId,"id","nombre");
      $("#tdTipoExamenConEnlExaCon"+enlaceExamConId).html(selTipoExamenContratista);
       
      banderaEdicionEnlExaCon = true;
      
      $("#btnVolverPrincipalEnlExaCon").hide();$("#btnVolverEnlExaCon").show();$("#btnNuevoEnlExaCon").hide();
      $("#btnGuardarEnlExaCon").show();$("#btnEliminarEnlExaCon").show();
   }	
}

function nuevoEnlaceExamenContratista(){
   if(!banderaEdicionEnlExaCon){
      formatoCeldaSombreableTabla(false,"tblEnlExamenesCon");	
      enlaceExamConObj = {id: 0};
      enlaceExamConId = 0; 
      
      var selTipoExamenContratista = crearSelectOneMenu("selTipoExamenContratista","",
	 listTipoExamenContratista,"-1","id","nombre");
  		
      $("#tblEnlExamenesCon tbody").prepend(
         "<tr>" + 
  	    "<td>"+"<input type='text' id='inputNombreEnlExaCon' class='form-control'>"+"</td>" +
  	    "<td>"+"<input type='text' id='inputEnlaceEnlExaCon' class='form-control'>"+"</td>" +
  	    "<td>"+selTipoExamenContratista+"</td>" +
  	 "</tr>");
        
      $("#btnVolverPrincipalEnlExaCon").hide();$("#btnVolverEnlExaCon").show();$("#btnNuevoEnlExaCon").hide();
      $("#btnGuardarEnlExaCon").show();$("#btnEliminarEnlExaCon").hide();
      
      banderaEdicionEnlExaCon = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarEnlaceExamenContratista(){
   var campoVacio = true;
   
   var nombreEnlExaCon = $("#inputNombreEnlExaCon").val();
   var enlaceExaCon = $("#inputEnlaceEnlExaCon").val();
    
   var selTipoExamenContratista = parseInt($("#selTipoExamenContratista").val());
   
   if(nombreEnlExaCon.length == 0 || enlaceExaCon.length == 0 || 
      selTipoExamenContratista == -1){
      campoVacio = false;   
   }
   
   if(campoVacio){
      var dataParam={
      	 id: enlaceExamConId,
      	 nombre: nombreEnlExaCon,
      	 enlace: enlaceExaCon,
      	 tipoExamenCon: {id: selTipoExamenContratista},
      	 perfilContratistaId: perfilContratistaId
      };
        
      callAjaxPost(URL+'/contratista/perfiles/enlace_examen_contratista/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
      	    case "05":		
      	       $("#modalEnlacesExamenesContratista").modal("hide"); 
      		
      	       mensajeUx="<label>El enlace - examen contratista fue registrado con éxito.</label>";
      	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmEnlExaCon");
  		    
      	       $("#modalMensajeUxActualizarVistaAdmEnlExaCon").on("hidden.bs.modal",function(){
      		  $("#modalEnlacesExamenesContratista").modal("show"); 
      		  cargarEnlacesExamenesContratista();
      	       });
      	       break;
      			
      	    default:
      	       console.log("Ocurrió un error al guardar el enlace - examen contratista!");
         }
      });	
   }else{
      $("#modalEnlacesExamenesContratista").modal("hide"); 
      mensajeUx="<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionVistaAdmEnlExaCon"); 
       
      $("#modalMensajeUxValidacionVistaAdmEnlExaCon").on("hidden.bs.modal",function(){
         $("#modalEnlacesExamenesContratista").modal("show"); 
      });
   }
}

function eliminarEnlaceExamenContratista(){
   $("#modalEnlacesExamenesContratista").modal("hide"); 
   mensajeUx="<label>¿Está seguro de eliminar el enlace - examen contratista seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","ConfEnlExaCon");

   $("#btnDevolverValorConfEnlExaCon").on("click",function(){
      var dataParam={
  	 id: enlaceExamConId
      };
  	     
      callAjaxPost(URL+'/contratista/perfiles/enlace_examen_contratista/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
  	    case "05":
  	       mensajeUx="<label>El enlace - examen contratista seleccionado se ha eliminado " +
  	       		 "correctamente.</label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarVistaAdmEnlExaCon");
  				
  	       $("#modalMensajeUxActualizarVistaAdmEnlExaCon").on("hidden.bs.modal",function(){
      		  $("#modalEnlacesExamenesContratista").modal("show"); 
      		  cargarEnlacesExamenesContratista();
      	       });
  	       break;
  						
  	    default:
  	       alert("Ocurrió un error al eliminar el enlace - examen contratista!");
         }
      });
   });
    
   $("#btnRegresarPrevioConfEnlExaCon").on("click",function(){
      $("#modalEnlacesExamenesContratista").modal("show"); 
   });
}

var perfilProyectoId,perfilProyectoObj={};
var banderaEdicionPerfilProyecto = false;
var listPerfilesProyectos = [],listRequisitosProyectos = [],listExamenesTrabProyectos = [],listInduccionesGeneralesProyecto = [];

function volverPerfilesProyecto(){
   $("#modalPerfilesProy").modal("hide");
}

function verPerfilesProyecto(){
   $("#modalPerfilesProy").remove();
   
   var buttonVolverPrincipal =
      "<button id='btnVolverPerfilProy' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverPerfilesProyecto()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar = 
      "<button id='btnCancelarPerfilProy' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='cancelarPerfilesProyecto()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonNuevo = 
      "<button id='btnNuevoPerfilProy' type='button' class='btn btn-success' style='margin-right:5px' " + 
              "title='Registrar un nuevo perfil proyecto.' onclick='nuevoPerfilesProyecto()'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarPerfilProy' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarPerfilesProyecto()' title='Guardar'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonEliminar = 
      "<button id='btnEliminarPerfilProy' type='button' class='btn btn-danger' style='margin-right:5px' " +
              "title='Eliminar el perfil proyecto seleccionado.' onclick='eliminarPerfilesProyecto()'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"95%",id:"modalPerfilesProy",
      nombre:"<i class='fa fa-table'></i> Perfiles proyectos",
      contenido: 
	  buttonVolverPrincipal+buttonCancelar+buttonNuevo+buttonGuardar+buttonEliminar +
         "<div class='wrapper' id='wrapperPerfilProy'>" +
            "<table id='tblPerfilProy' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:300px'>Nombre</th>" +
		     "<th class='tb-acc' style='width:300px'>Actividad</th>" +
		     "<th class='tb-acc' style='width:450px'>Requisitos habilitados</th>" +
		     "<th class='tb-acc' style='width:450px'>Exámenes trabajador habilitados</th>" +
             "<th class='tb-acc' style='width:450px'>Inducciones generales habilitadas</th>" +
		     "<th class='tb-acc' style='width:100px'>N° de proyectos asociados</th>" +
		     "<th class='tb-acc' style='width:120px'>N° de solicitudes registro proyecto asociados</th>" +
			 "<th class='tb-acc' style='width:250px'>Registrado el</th>" +
			 "<th class='tb-acc' style='width:250px'>Actualizado el</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperPerfilProy",190);
   cargarPerfilesProyecto();
}

function cargarPerfilesProyecto(){
   banderaEdicionPerfilProyecto = false; 
   
   $("#btnVolverPerfilProy").show();$("#btnCancelarPerfilProy").hide();$("#btnGuardarPerfilProy").hide();
   $("#btnNuevoPerfilProy").show();$("#btnEliminarPerfilProy").hide();
    
   var dataParam={
      empresaId: parseInt(getSession("gestopcompanyid"))
   };
     
    callAjaxPost(URL+"/contratista/perfiles/proyecto",dataParam,function(data){
        if(data.CODE_RESPONSE == "05"){
	        listPerfilesProyectos = data.listPerfilesProyecto;listRequisitosProyectos = data.listRequisitosProyectos;
	        listExamenesTrabProyectos = data.listExamenesTrabProyectos;listInduccionesGeneralesProyecto = data.listInduccionesGenerales;
	 
 	 $("#tblPerfilProy tbody tr").remove();
 	 
 	 listPerfilesProyectos.forEach(function(val,index){
 	     var actividad = (val.actividad.length > 0?val.actividad:"------"),
		 creadoPor = (val.fechaCreacionTexto.length == 0?"------":val.fechaCreacionTexto+"<br>(Por "+val.usuarioCreacion.nombre+")"),
		 actualizadoPor = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto+"<br>(Por "+val.usuarioActualizacion.nombre+")");
		 
 	    $("#tblPerfilProy tbody").append(
 	       "<tr id='trPerfilProy"+val.id+"' onclick='editarPerfilesProyecto("+index+")'>" +
 	          "<td id='perfProyNombre"+val.id+"'>"+val.nombre+"</td>" +
 	          "<td id='perfProyActividad"+val.id+"' style='word-break:break-all;'>"+actividad+"</td>" +
 		  "<td id='perfProyReq"+val.id+"' style='word-break:break-all;'>"+val.requisitosProyectoHabilitadosNombre+"</td>" +
 		  "<td id='perfProySeccExamTrab"+val.id+"' style='word-break:break-all;'>"+val.seccionExamenesTrabProyectoHabilitadosNombre+"</td>" +
                  "<td id='perfProyInduccionesGenerales"+val.id+"' style='word-break:break-all;'>"+val.induccionesGeneralesHabilitadasNombre+"</td>" +
 		  "<td id='perfProyNumProy"+val.id+"'>"+val.numProyectosAsociados+"</td>" +
 		  "<td id='perfProyNumSolRegProy"+val.id+"'>"+val.numSolRegProyAsociados+"</td>" +
		  "<td id='perfProyFechaCre"+val.id+"'>"+creadoPor+"</td>" +
		  "<td id='perfProyFechaAct"+val.id+"'>"+actualizadoPor+"</td>" +
               "</tr>");
 	 });
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblPerfilProy","#wrapperPerfilProy");
      formatoCeldaSombreableTabla(true,"tblPerfilProy");
   });    
}

function cancelarPerfilesProyecto(){
   cargarPerfilesProyecto();
}

function editarPerfilesProyecto(pindex){
   if(!banderaEdicionPerfilProyecto){
      formatoCeldaSombreableTabla(false,"tblPerfilProy");
      perfilProyectoId = listPerfilesProyectos[pindex].id;
      perfilProyectoObj = listPerfilesProyectos[pindex];
 		
      $("#trPerfilProy"+perfilProyectoId).addClass("fila-edicion");
       
      $("#perfProyNombre"+perfilProyectoId).html("<input type='text' id='inputNombrePerfProy' class='form-control'>");
      $("#inputNombrePerfProy").val(perfilProyectoObj.nombre);
      
      $("#perfProyActividad"+perfilProyectoId).html("<input type='text' id='inputActividadPerfProy' class='form-control'>");
      $("#inputActividadPerfProy").val(perfilProyectoObj.actividad);
      
      var requisitosProyectoHabilitadosId = perfilProyectoObj.requisitosProyectoHabilitadosId.split(",");
	
      listRequisitosProyectos.forEach(function(val){
         val.selected = 0;
			
         requisitosProyectoHabilitadosId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcRequisitosPerfilProyecto","",
	 listRequisitosProyectos,"id","nombre","#perfProyReq"+perfilProyectoId,"Habilitar...");
      
      var seccionExamenesTrabProyectoHabilitadosId = perfilProyectoObj.seccionExamenesTrabProyectoHabilitadosId.split(",");
	
      listExamenesTrabProyectos.forEach(function(val){
         val.selected = 0;
			
         seccionExamenesTrabProyectoHabilitadosId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcSeccionExamenesTrabPerfilProyecto","",
	 listExamenesTrabProyectos,"id","nombre","#perfProySeccExamTrab"+perfilProyectoId,"Habilitar...");

      crearCheckListGeneral("modalPerfilesProy","Inducciones generales habilitadas","InduccionesGeneralesHabPerfProy",
          listInduccionesGeneralesProyecto,"InduccionesGeneralesHabPerfilProyecto",cargarCheckListInduccionesGeneralesHabPerfilProyecto);
	 
	 $("#perfProyFechaAct"+perfilProyectoId).html("<label>*Automático.</label>");
       
      banderaEdicionPerfilProyecto = true;
      
      $("#btnVolverPerfilProy").hide();$("#btnCancelarPerfilProy").show();$("#btnGuardarPerfilProy").show();
      $("#btnNuevoPerfilProy").hide();$("#btnEliminarPerfilProy").show();
   }	
}

function nuevoPerfilesProyecto(){
   if(!banderaEdicionPerfilProyecto){
      formatoCeldaSombreableTabla(false,"tblPerfilProy");	
      perfilProyectoObj = {id: 0};
      perfilProyectoId = 0; 
      
      $("#tblPerfilProy tbody").prepend(
         "<tr>" + 
  	    "<td>"+"<input type='text' id='inputNombrePerfProy' class='form-control'>"+"</td>" +
  	    "<td>"+"<input type='text' id='inputActividadPerfProy' class='form-control'>"+"</td>" +
  	    "<td id='perfProyReq"+perfilProyectoId+"'>...</td>" + 
            "<td id='perfProySeccExamTrab"+perfilProyectoId+"'>...</td>" +
            "<td id='perfProyInduccionesGenerales"+perfilProyectoId+"'>...</td>" +
  	    "<td>...</td>" +
  	    "<td>...</td>" +
		"<td>"+"<label>*Automático.</label>"+"</td>" +
		"<td>...</td>" +
  	 "</tr>");
      
      crearSelectOneMenuObligMultipleCompleto("slcRequisitosPerfilProyecto","",
         listRequisitosProyectos,"id","nombre","#perfProyReq"+perfilProyectoId,"Habilitar...");
	
      crearSelectOneMenuObligMultipleCompleto("slcSeccionExamenesTrabPerfilProyecto","",
	 listExamenesTrabProyectos,"id","nombre","#perfProySeccExamTrab"+perfilProyectoId,"Habilitar...");

      crearCheckListGeneral("modalPerfilesProy","Inducciones generales habilitadas","InduccionesGeneralesHabPerfProy",
          listInduccionesGeneralesProyecto,"InduccionesGeneralesHabPerfilProyecto",ocultarCheckListInduccionesGeneralesHabPerfilProyecto);
        
      $("#btnVolverPerfilProy").hide();$("#btnCancelarPerfilProy").show();$("#btnGuardarPerfilProy").show();
      $("#btnNuevoPerfilProy").hide();$("#btnEliminarPerfilProy").hide();
      
      banderaEdicionPerfilProyecto = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarPerfilesProyecto(){
   var campoVacio = true;
   var nombre = $("#inputNombrePerfProy").val().trim();
   var actividad = $("#inputActividadPerfProy").val().trim();
 
   var requisitosProyectoHabilitadosId = $("#slcRequisitosPerfilProyecto").val();
   var listRequisitosProyectoHabilitados = [];
   var textoReqProyHabilitados = "";

   requisitosProyectoHabilitadosId.forEach(function(val1){
      listRequisitosProyectoHabilitados.push({id:parseInt(val1)}); 
	 
      textoReqProyHabilitados += (textoReqProyHabilitados.length == 0?parseInt(val1):","+parseInt(val1));
   });
   
   var seccionExamenesTrabProyectoHabilitadosId = $("#slcSeccionExamenesTrabPerfilProyecto").val();
   var listSeccionExamTrabProyectoHabilitados = [];
   var textoSeccExamTrabProyHabilitados = "";

   seccionExamenesTrabProyectoHabilitadosId.forEach(function(val1){
      listSeccionExamTrabProyectoHabilitados.push({id:parseInt(val1)}); 
	 
      textoSeccExamTrabProyHabilitados += (textoSeccExamTrabProyHabilitados.length == 0?parseInt(val1):","+parseInt(val1));
   });
         
   var listInduccionesGeneralesHabilitadas = [];
   var textoInduccionesGeneralesHabilitadas = "";

   listInduccionesGeneralesProyecto.forEach(function(val){
      var isAsignado = ($("#checkAsignadoInduccionesGeneralesHabPerfProy"+val.id).prop("checked")?1:0);

      if(isAsignado == 1){
         textoInduccionesGeneralesHabilitadas += (textoInduccionesGeneralesHabilitadas.length == 0?val.id:","+val.id);
         listInduccionesGeneralesHabilitadas.push({id:val.id});
      }
   });

   if(nombre.length == 0){
      campoVacio = false;mensajeUx="<label>Debe completar el nombre del perfil proyecto.<label>";
   }else if(textoReqProyHabilitados.length == 0 || textoSeccExamTrabProyHabilitados.length == 0){
	  campoVacio = false;mensajeUx="<label>Las columnas 'Requisitos habilitados' y 'Exámenes trabajador habilitados' deben tener al menos un valor seleccionado cada uno.<label>";
   }

    if(campoVacio){
        var dataParam={
	        id:perfilProyectoId,nombre:nombre,requisitosProyecto:listRequisitosProyectoHabilitados,
	 		textoReqProyHabilitados:textoReqProyHabilitados,seccionExamenesTrabProyecto:listSeccionExamTrabProyectoHabilitados,
	 		textoSeccExamTrabProyHabilitados:textoSeccExamTrabProyHabilitados,empresaId:parseInt(getSession("gestopcompanyid")),
	 		actividad:actividad,induccionesGenerales:listInduccionesGeneralesHabilitadas,textoInduccionesGeneralesHabilitadas:textoInduccionesGeneralesHabilitadas
        };

      callAjaxPost(URL+'/contratista/perfiles/proyecto/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalPerfilesProy").modal("hide"); 	
		
	       mensajeUx="<label>El perfil proyecto fue registrado con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarPerfilProy");
  		
  	       $("#modalMensajeUxActualizarPerfilProy").on("hidden.bs.modal",function(){
  		  $("#modalPerfilesProy").modal("show");
  		  cargarPerfilesProyecto();
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar el perfil proyecto!");
         }
      });
   }else{
      $("#modalPerfilesProy").modal("hide"); 	 
       
      mensajesUx(mensajeUx,2,"","ValidacionPerfilProy");
      
      $("#modalMensajeUxValidacionPerfilProy").on("hidden.bs.modal",function(){
         $("#modalPerfilesProy").modal("show"); 
      });
   }	
}

function eliminarPerfilesProyecto(){
   $("#modalPerfilesProy").modal("hide"); 
   
   if(perfilProyectoObj.numProyectosAsociados == 0 && perfilProyectoObj.numSolRegProyAsociados == 0){
      mensajeUx="<label>¿Está seguro de eliminar el perfil proyecto seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","ConfPerfilProy");

      $("#btnDevolverValorConfPerfilProy").on("click",function(){
         var dataParam={
  	    id: perfilProyectoId
         };
  	     
         callAjaxPost(URL+'/contratista/perfiles/proyecto/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
  	       case "05":
  	          mensajeUx="<label>El perfil proyecto seleccionado se ha eliminado correctamente.</label>";
  	          mensajesUx(mensajeUx,1,"","ActualizarPerfilProy");
  				
  	          $("#modalMensajeUxActualizarPerfilProy").on("hidden.bs.modal",function(){
      		     $("#modalPerfilesProy").modal("show"); 
      		     cargarPerfilesProyecto();
      	          });
  	       
  	          break;
  						
  	       default:
  	          alert("Ocurrió un error al eliminar el perfil proyecto!");
            }
         });
      });
    
      $("#btnRegresarPrevioConfPerfilProy").on("click",function(){
         $("#modalPerfilesProy").modal("show"); 
      });
   }else{
      mensajeUx="<label>No se puede eliminar el perfil proyecto seleccionado " +
		"porque está asociado a uno o más proyectos y/o solicitudes registro proyecto.<label>"
      mensajesUx(mensajeUx,2,"","EliminarPerfilProy");
		       		
      $("#modalMensajeUxEliminarPerfilProy").on("hidden.bs.modal",function(){
         $("#modalPerfilesProy").modal("show"); 
      });
   }
}

var subUsuarioConfId,subUsuarioConfObj={};
var banderaEdicionSubUsuarioConf = false;
var listSubUsuariosConf = [],listSeccionesDocumentos = [],listTiposExamenes = [],listRequisitosProyectoUsuario =[],
    listSeccionesContratistaUsuario =[],listContratistasUsuario =[],listSeccionDocNivelCondUsuario = [],
    listSeccionDocNivelVehMaqUsuario = [],listSeccionDocNivelEquHerrUsuario = [],listTiposInduccionVirtualUsuario = [],
	listLugaresTrabajoProyUsuario = [];
var accesoUsuarioId;

function volverConfiguracionUsuarioAccesoEspecifico(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");
}

function verConfiguracionUsuarioAccesoEspecifico(accesoUsuario){
   $("#modalConfigUsuarioAccesoEspecif").remove();
   
   accesoUsuarioId = parseInt(accesoUsuario);
   var textoAccesoUsuario = "revisar documentos";
   
   var buttonVolverPrincipal =
      "<button id='btnVolverSubUsuarioConf' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverConfiguracionUsuarioAccesoEspecifico()' title='Regresar a la vista principal'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonCancelar = 
      "<button id='btnCancelarSubUsuarioConf' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='cancelarConfiguracionUsuarioAccesoEspecifico()' title='Cancelar'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardarSubUsuarioConf' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConfiguracionUsuarioAccesoEspecifico(0)' title='Guardar'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";

   var modalOptions={
      maxWidth:"95%",id:"modalConfigUsuarioAccesoEspecif",
      nombre:"<i class='fa fa-table'></i> Configuración - Usuario acceso como "+textoAccesoUsuario,
      contenido: 
	  buttonVolverPrincipal+buttonCancelar+buttonGuardar +
         "<div class='wrapper' id='wrapperConfigUsuarioAccesoEspecif'>" +
            "<table id='tblConfigUsuarioAccesoEspecif' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:300px'>Nombre</th>" +
		     "<th class='tb-acc' style='width:350px'>Secciones habilitadas</th>" +
		     "<th class='tb-acc' style='width:350px'>Documentos a nivel conductor habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Documentos a nivel vehículo/maquinaria habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Documentos a nivel equipo/herramienta habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Examenes habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Requisitos proyecto habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Documentos adicionales habilitados</th>" +
		     "<th class='tb-acc' style='width:350px'>Contratistas asignados</th>" +
		     "<th class='tb-acc' style='width:350px'>Tipos inducción virtual habilitados</th>" +
			 "<th class='tb-acc' style='width:350px'>Lugares de trabajo asociados</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperConfigUsuarioAccesoEspecif",190);
   cargarConfiguracionUsuarioAccesoEspecifico(accesoUsuario);
}

function cargarConfiguracionUsuarioAccesoEspecifico(){
   banderaEdicionSubUsuarioConf = false; 
   
   $("#btnVolverSubUsuarioConf").show();$("#btnCancelarSubUsuarioConf").hide();
   $("#btnGuardarSubUsuarioConf").hide();
    
   var dataParam={
      tipoAccesoId: accesoUsuarioId,empresaId: parseInt(getSession("gestopcompanyid")) 
   };
     
   callAjaxPost(URL+"/subusuario/configuracion",dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listSubUsuariosConf = data.listSubUsuarios;listSeccionesDocumentos = data.listSeccionesDocumentos;
	 listTiposExamenes = data.listTiposExamenes;listRequisitosProyectoUsuario = data.listRequisitosProyectoUsuario;
	 listSeccionesContratistaUsuario = data.listSeccionesContratistaUsuario;listContratistasUsuario = data.listContratistasUsuario;
	 listSeccionDocNivelCondUsuario = data.listSeccionDocNivelCondUsuario;listSeccionDocNivelVehMaqUsuario = data.listSeccionDocNivelVehMaqUsuario;
	 listSeccionDocNivelEquHerrUsuario = data.listSeccionDocNivelEquHerrUsuario;listTiposInduccionVirtualUsuario = data.listTiposInduccionVirtualUsuario;
	 listLugaresTrabajoProyUsuario = data.listLugaresTrabajoProyUsuario;
	 
	 if(listSubUsuariosConf.length > 0){
 	    $("#tblConfigUsuarioAccesoEspecif tbody tr").remove();
 	 
 	    listSubUsuariosConf.forEach(function(val,index){   
 	       $("#tblConfigUsuarioAccesoEspecif tbody").append(
 	          "<tr id='trSubUsuarioConf"+val.usuarioId+"' onclick='editarConfiguracionUsuarioAccesoEspecifico("+index+")'>" +
 	             "<td id='subUsuNombre"+val.usuarioId+"'>"+val.userName+"</td>" +
 	             "<td id='subUsuSeccDoc"+val.usuarioId+"'>"+val.seccionesHabilitadasNombre+"</td>" +
 	             "<td id='subUsuDocNivelCond"+val.usuarioId+"'>"+val.seccionesContratistaDocNivelCondHabilitadasNombre+"</td>" +
 	             "<td id='subUsuDocNivelVehMaq"+val.usuarioId+"'>"+val.seccionesContratistaDocNivelVehMaqHabilitadasNombre+"</td>" +
 	             "<td id='subUsuDocNivelEquHerr"+val.usuarioId+"'>"+val.seccionesContratistaDocNivelEquHerrHabilitadasNombre+"</td>" +
 	             "<td id='subUsuExam"+val.usuarioId+"'>"+val.examenesHabilitadosNombre+"</td>" +
 	             "<td id='subUsuReqProy"+val.usuarioId+"'>"+val.requisitosProyectoHabilitadosNombre+"</td>" +
 	             "<td id='subUsuSeccCont"+val.usuarioId+"'>"+val.seccionesContratistaHabilitadasNombre+"</td>" +
 	             "<td id='subUsuCont"+val.usuarioId+"' style='word-break:break-all;'>"+val.contratistasAsignadosNombre+"</td>" +
 	             "<td id='subUsuTipoInduccVirtual"+val.usuarioId+"'>"+val.tiposInduccionVirtualHabilitadosNombre+"</td>" +
				 "<td id='subUsuTipoLugarTrab"+val.usuarioId+"'>"+val.tiposLugaresTrabajosAsignadosNombre+"</td>" +
 	          "</tr>");
 	    });
	 }else{
	    $("#modalConfigUsuarioAccesoEspecif").modal("hide");
	    
	    mensajeUx="<label>No hay usuarios documentos registrados.<label>";
	    mensajesUx(mensajeUx,2,"","");
	 }
      }else{
         console.log("NOPNPO");
      }
 	
      goheadfixedY("#tblConfigUsuarioAccesoEspecif","#wrapperConfigUsuarioAccesoEspecif");
      formatoCeldaSombreableTabla(true,"tblConfigUsuarioAccesoEspecif");
   });    
}

function editarConfiguracionUsuarioAccesoEspecifico(pindex){
   if(!banderaEdicionSubUsuarioConf){
      formatoCeldaSombreableTabla(false,"tblConfigUsuarioAccesoEspecif");
      subUsuarioConfId = listSubUsuariosConf[pindex].usuarioId; 
      subUsuarioConfObj = listSubUsuariosConf[pindex];
      
      $("#trSubUsuarioConf"+subUsuarioConfId).addClass("fila-edicion");

      var seccionesHabilitadasId = subUsuarioConfObj.seccionesHabilitadasId.split(",");
		
      listSeccionesDocumentos.forEach(function(val){
         val.selected = 0;
			
         seccionesHabilitadasId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcHabilitarSeccionesDocumento","",listSeccionesDocumentos,
         "id","nombre","#subUsuSeccDoc"+subUsuarioConfId,"Habilitar...");	
      
      var examenesHabilitadosId = subUsuarioConfObj.examenesHabilitadosId.split(",");
		
      listTiposExamenes.forEach(function(val){
         val.selected = 0;
			
         examenesHabilitadosId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcHabilitarExamenes","",listTiposExamenes,
         "id","nombre","#subUsuExam"+subUsuarioConfId,"Habilitar...");	
      
      var requisitosProyectoId = subUsuarioConfObj.requisitosProyectoHabilitadosId.split(",");
		
      listRequisitosProyectoUsuario.forEach(function(val){
         val.selected = 0;
			
         requisitosProyectoId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcHabilitarRequisitosProy","",listRequisitosProyectoUsuario,
         "id","nombre","#subUsuReqProy"+subUsuarioConfId,"Habilitar...");
      
      var seccionesContratistaId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
		
      listSeccionesContratistaUsuario.forEach(function(val){
         val.selected = 0;
			
         seccionesContratistaId.forEach(function(val1){
	    if(parseInt(val1) == val.id){
	       val.selected = 1;
	    }
         });
      });	
		
      crearSelectOneMenuObligMultipleCompleto("slcHabilitarSeccContratista","",listSeccionesContratistaUsuario,
         "id","nombre","#subUsuSeccCont"+subUsuarioConfId,"Habilitar...");
      
      var textDocNivelConductorAsig = $("#subUsuDocNivelCond"+subUsuarioConfId).html();

      $("#subUsuDocNivelCond"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
         verDocumentosNivelConductorAsignadosUsuarioDocumento();
      }).html(textDocNivelConductorAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");		
      
      var textDocNivelVehMaqAsig = $("#subUsuDocNivelVehMaq"+subUsuarioConfId).html();

      $("#subUsuDocNivelVehMaq"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
         verDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento();
      }).html(textDocNivelVehMaqAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");	
      
      var textDocNivelEquHerrAsig = $("#subUsuDocNivelEquHerr"+subUsuarioConfId).html();

      $("#subUsuDocNivelEquHerr"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
         verDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento();
      }).html(textDocNivelEquHerrAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");	
      
      var textContratistasAsig = $("#subUsuCont"+subUsuarioConfId).html();

      $("#subUsuCont"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
         verContratistasAsignadosUsuarioDocumento();
      }).html(textContratistasAsig+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

      $("#subUsuTipoInduccVirtual"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
         verTiposInduccionVirtualAsignadosUsuarioDocumento();
      }).html(subUsuarioConfObj.tiposInduccionVirtualHabilitadosNombre+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
	  
	  $("#subUsuTipoLugarTrab"+subUsuarioConfId).addClass("linkGosst").on("click",function(){
	      verTiposLugaresTrabajoAsociadosUsuarioDocumento();
	  }).html(subUsuarioConfObj.tiposLugaresTrabajosAsignadosNombre+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");
				
      banderaEdicionSubUsuarioConf = true;
		
      $("#btnVolverSubUsuarioConf").hide();$("#btnCancelarSubUsuarioConf").show();
      $("#btnGuardarSubUsuarioConf").show();
   }	
}

function cancelarConfiguracionUsuarioAccesoEspecifico(){
   cargarConfiguracionUsuarioAccesoEspecifico();   
}

function guardarConfiguracionUsuarioAccesoEspecifico(opcionSeccion){
   var campoVacio = true;
   var opcionSeccionAux = parseInt(opcionSeccion);
   
   var seccionesHabilitadasId = $("#slcHabilitarSeccionesDocumento").val();
   var listSeccionesHabilitadas = [];
   var textoSeccionesHabilitadas = "",textoSeccionesInhabilitadas = "";

   listSeccionesDocumentos.forEach(function(val){
      var isSeccionHabilitada = 0;
			
      seccionesHabilitadasId.forEach(function(val1){
	 if(parseInt(val1) == val.id){
	    isSeccionHabilitada = 1;
	 }
      });
       
      if(isSeccionHabilitada == 1){
	 listSeccionesHabilitadas.push({id: val.id}); 
	 
	 textoSeccionesHabilitadas += (textoSeccionesHabilitadas.length == 0?val.id:","+val.id);
      }else{
	 textoSeccionesInhabilitadas += (textoSeccionesInhabilitadas.length == 0?val.id:","+val.id); 
      }
   });	
   
   var examenesHabilitadosId = $("#slcHabilitarExamenes").val();
   var listExamenesHabilitados = [];
   var textoTipoExamHabilitados = "",textoTipoExamInhabilitados = "";

   listTiposExamenes.forEach(function(val){
      var isExamenHabilitado = 0;
			
      examenesHabilitadosId.forEach(function(val1){
	 if(parseInt(val1) == val.id){
	    isExamenHabilitado = 1;
	 }
      });
       
      if(isExamenHabilitado == 1){
	 listExamenesHabilitados.push({id: val.id}); 
	 
	 textoTipoExamHabilitados += (textoTipoExamHabilitados.length == 0?val.id:","+val.id);
      }else{
	 textoTipoExamInhabilitados += (textoTipoExamInhabilitados.length == 0?val.id:","+val.id); 
      }
   });	
   
   var requisitosProyHabilitadosId = $("#slcHabilitarRequisitosProy").val();
   var listRequisitosProyHabilitados = [];
   var textoReqProyHabilitados = "",textoReqProyInhabilitados = "";

   listRequisitosProyectoUsuario.forEach(function(val){
      var isReqProyHabilitado = 0;
			
      requisitosProyHabilitadosId.forEach(function(val1){
	 if(parseInt(val1) == val.id){
	    isReqProyHabilitado = 1;
	 }
      });
       
      if(isReqProyHabilitado == 1){
	 listRequisitosProyHabilitados.push({id: val.id}); 
	 
	 textoReqProyHabilitados += (textoReqProyHabilitados.length == 0?val.id:","+val.id);
      }else{
	 textoReqProyInhabilitados += (textoReqProyInhabilitados.length == 0?val.id:","+val.id); 
      }
   });	
   
   var seccContratistaHabilitadasId = $("#slcHabilitarSeccContratista").val();
   var listSeccionesContratistaHabilitadas = [];
   var textoSeccContHabilitadas = "",textoSeccContInhabilitadas = "";

   listSeccionesContratistaUsuario.forEach(function(val){
      var isSeccContHabilitada = 0;
			
      seccContratistaHabilitadasId.forEach(function(val1){
	 if(parseInt(val1) == val.id){
	    isSeccContHabilitada = 1;
	 }
      });
       
      if(isSeccContHabilitada == 1){
	 listSeccionesContratistaHabilitadas.push({id: val.id}); 
	 
	 textoSeccContHabilitadas += (textoSeccContHabilitadas.length == 0?val.id:","+val.id);
      }else{
	 textoSeccContInhabilitadas += (textoSeccContInhabilitadas.length == 0?val.id:","+val.id); 
      }
   });	
   
   listSeccionDocNivelCondUsuario.forEach(function(val){
      var isAsignado = (opcionSeccionAux == 1?($("#checkAsignadoDocNivelCondUsuarioDoc"+val.id).prop("checked")?1:0):0);
 	  	
      if([0,2,3].includes(opcionSeccionAux)){ 
	 if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
	    var docNivelCondAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
	  		
	    docNivelCondAsignadosId.forEach(function(val1){
	       if(parseInt(val1) == val.id){
	          isAsignado = 1;
	       }
	    });
	 }
      }
          
      if(isAsignado == 1){
	 listSeccionesContratistaHabilitadas.push({id: val.id}); 
	 textoSeccContHabilitadas += (textoSeccContHabilitadas.length == 0?val.id:","+val.id);
      }else{
	 textoSeccContInhabilitadas += (textoSeccContInhabilitadas.length == 0?val.id:","+val.id);
      }
   });	

   listSeccionDocNivelVehMaqUsuario.forEach(function(val){
      var isAsignado = (opcionSeccionAux == 2?($("#checkAsignadoDocNivelVehMaqUsuarioDoc"+val.id).prop("checked")?1:0):0);
 	  	
      if([0,1,3].includes(opcionSeccionAux)){ 
	 if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
	    var docNivelVehMaqAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
	  		
	    docNivelVehMaqAsignadosId.forEach(function(val1){
	       if(parseInt(val1) == val.id){
	          isAsignado = 1;
	       }
	    });
	 }
      }
          
      if(isAsignado == 1){
	 listSeccionesContratistaHabilitadas.push({id: val.id}); 
	 textoSeccContHabilitadas += (textoSeccContHabilitadas.length == 0?val.id:","+val.id);
      }else{
	 textoSeccContInhabilitadas += (textoSeccContInhabilitadas.length == 0?val.id:","+val.id);
      }
   });	
   
   listSeccionDocNivelEquHerrUsuario.forEach(function(val){
      var isAsignado = (opcionSeccionAux == 3?($("#checkAsignadoDocNivelEquHerrUsuarioDoc"+val.id).prop("checked")?1:0):0);
 	  	
      if([0,1,2].includes(opcionSeccionAux)){ 
	 if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
	    var docNivelEquHerrAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
	  		
	    docNivelEquHerrAsignadosId.forEach(function(val1){
	       if(parseInt(val1) == val.id){
	          isAsignado = 1;
	       }
	    });
	 }
      }
          
      if(isAsignado == 1){
	 listSeccionesContratistaHabilitadas.push({id: val.id}); 
	 textoSeccContHabilitadas += (textoSeccContHabilitadas.length == 0?val.id:","+val.id);
      }else{
	 textoSeccContInhabilitadas += (textoSeccContInhabilitadas.length == 0?val.id:","+val.id);
      }
   });	

   if(campoVacio){
      var dataParam={
	 usuarioId: subUsuarioConfId,secciones: listSeccionesHabilitadas,examenes: listExamenesHabilitados,
	 textoSeccionesHabilitadas: textoSeccionesHabilitadas,textoSeccionesInhabilitadas: textoSeccionesInhabilitadas,
	 textoTipoExamHabilitados: textoTipoExamHabilitados,textoTipoExamInhabilitados: textoTipoExamInhabilitados,
	 requisitos: listRequisitosProyHabilitados,textoReqProyHabilitados: textoReqProyHabilitados,
	 textoReqProyInhabilitados: textoReqProyInhabilitados,seccionesContratista: listSeccionesContratistaHabilitadas,
	 textoSeccionesContHabilitadas: textoSeccContHabilitadas,textoSeccionesContInhabilitadas: textoSeccContInhabilitadas
      };

      callAjaxPost(URL+'/subusuario/configuracion/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       if(opcionSeccionAux == 1){
	          $("#modalDocNivelCondUsuarioDoc").modal("hide");  
	       }else if(opcionSeccionAux == 2){
		  $("#modalDocNivelVehMaqUsuarioDoc").modal("hide"); 
	       }else if(opcionSeccionAux == 3){
		  $("#modalDocNivelEquHerrUsuarioDoc").modal("hide"); 
	       }else{
		  $("#modalConfigUsuarioAccesoEspecif").modal("hide");  
	       }
		
	       mensajeUx="<label>El registro de la configuración fue actualizada con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarSubUsuarioConf");
  		
  	       $("#modalMensajeUxActualizarSubUsuarioConf").on("hidden.bs.modal",function(){
  		  $("#modalConfigUsuarioAccesoEspecif").modal("show");
  		  cargarConfiguracionUsuarioAccesoEspecifico(); 
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la configuración!");
         }
      });
   }else{
//      mensajeUx="<label>...<label>";
//      mensajesUx(mensajeUx,2,"");
   }	
}

function volverContratistasAsignadosUsuarioDocumento(){
   $("#modalContratistaAsigUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verContratistasAsignadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalContratistaAsigUsuarioDoc").remove();
   
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button id='btnVolverContAsigUsuarioDoc' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverContratistasAsignadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardaContAsigUsuarioDoc' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarContratistasAsignadosUsuarioDocumento()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button id='btnMarcarTodoContAsigUsuarioDoc' class='btn btn-success' style='margin-right:5px' " +
              "onclick='marcarTodoContratistasAsignadosUsuarioDocumento()' title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button id='btnDesmarcarTodoContAsigUsuarioDoc' class='btn btn-success' style='margin-right:5px' " +
              "onclick='desmarcarTodoContratistasAsignadosUsuarioDocumento()' title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var buttonBuscar = 
      "<button id='btnResetBuscadorContAsigUsuarioDoc' type='button' class='btn btn-success' " + 
	      "title='Refresh' onclick='reiniciarBuscadorContratistaUsuarioDocumento()' style='float:right;'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>";
		   
   var buttonRefresh =
      "<button id='btnAplicarBuscadorContAsigUsuarioDoc' type='button' class='btn btn-success' " +
              "onclick='aplicarBuscadorContratistaUsuarioDocumento()' style='float:right;margin-right:5px;' " +
              "title='Buscar los registros cuyo nombre del contratista coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>";
	       
   var inputBuscador = "<input id='valBuscarNomContAsigUsuarioDoc' placeholder='nombre contratista' class='form-control' " +
      "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>"
      
   var modalOptions={
      maxWidth:"50%",id:"modalContratistaAsigUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Contratistas asignados",
      contenido: 
	 "<div id='divContratistaAsigUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar+buttonBuscar+buttonRefresh+inputBuscador +
	 "</div>"+
         "<div class='wrapper' id='wrapperContAsigUsuarioDoc'>" +
            "<table id='tblContAsigUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Contratista</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperContAsigUsuarioDoc",200);
   cargarContratistasAsignadosUsuarioDocumento();
}

function cargarContratistasAsignadosUsuarioDocumento(){    
   $("#tblContAsigUsuarioDoc tbody tr").remove();
 	 
   listContratistasUsuario.forEach(function(val,index){   
      var isAsignado = 0;
      
      if(subUsuarioConfObj.contratistasAsignadosId.length != 0){
	 var contratistaAsignadosId = subUsuarioConfObj.contratistasAsignadosId.split(",");
		
	 contratistaAsignadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
	 });
      }
      
      var inputCheckAsignado = "<input id='checkAsignadoContUsuario"+val.id+"' type='checkbox' class='form-control' " +
         (isAsignado == 1?"checked":"")+">";
       
      $("#tblContAsigUsuarioDoc tbody").append(
         "<tr id='trContratistaUsuDoc"+val.id+"'>" +
 	    "<td>"+inputCheckAsignado+"</td>" +
 	    "<td>"+val.nombre+"</td>" +
 	 "</tr>");
   });
     	
   goheadfixedY("#tblContAsigUsuarioDoc","#wrapperContAsigUsuarioDoc");
}

function marcarTodoContratistasAsignadosUsuarioDocumento(){
   $("#tblContAsigUsuarioDoc input[type='checkbox']").each(function(index,elem){
      $(elem).prop("checked",true); 
   });   
}

function desmarcarTodoContratistasAsignadosUsuarioDocumento(){
   $("#tblContAsigUsuarioDoc input[type='checkbox']").each(function(index,elem){
      $(elem).prop("checked",false); 
   });   
}

function aplicarBuscadorContratistaUsuarioDocumento(){
   $("#btnMarcarTodoContAsigUsuarioDoc").hide();$("#btnDesmarcarTodoContAsigUsuarioDoc").hide(); 
    
   var valorBuscador = igualarStringBuscar($("#valBuscarNomContAsigUsuarioDoc").val());
  	
   listContratistasUsuario.forEach(function(val,index){
      if(igualarStringBuscar(val.nombre).indexOf(valorBuscador) != -1){
         $("#trContratistaUsuDoc"+val.id).show();
      }else{
   	 $("#trContratistaUsuDoc"+val.id).hide();
      }
   }); 
}

function reiniciarBuscadorContratistaUsuarioDocumento(){
   $("#btnMarcarTodoContAsigUsuarioDoc").show();$("#btnDesmarcarTodoContAsigUsuarioDoc").show(); 
   $("#valBuscarNomContAsigUsuarioDoc").val("").focus();
    
   listContratistasUsuario.forEach(function(val,index){
      $("#trContratistaUsuDoc"+val.id).show();
   });
}

function guardarContratistasAsignadosUsuarioDocumento(){
   var campoVacio = true;
   
   var listContratistasAsignados = [];
   var textoContratistasAsignados = "";

   listContratistasUsuario.forEach(function(val){
      var isAsignado = ($("#checkAsignadoContUsuario"+val.id).prop("checked")?1:0);
   
      if(isAsignado == 1){
	 listContratistasAsignados.push({id:val.id}); 
	 
	 textoContratistasAsignados += (textoContratistasAsignados.length == 0?val.id:","+val.id);
      }
   });	
 
   if(campoVacio){
      var dataParam={
	 usuarioId: subUsuarioConfId,contratistas: listContratistasAsignados,textoContratistasAsignados: textoContratistasAsignados
      };

      callAjaxPost(URL+'/subusuario/configuracion/save/multi_contratista',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalContratistaAsigUsuarioDoc").modal("hide");
		
	       mensajeUx="<label>Los contratistas fueron asignados al usuario con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarMultiContSubUsuarioConf");
  		
  	       $("#modalMensajeUxActualizarMultiContSubUsuarioConf").on("hidden.bs.modal",function(){
  		  $("#modalConfigUsuarioAccesoEspecif").modal("show");
  		  cargarConfiguracionUsuarioAccesoEspecifico(); 
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la configuración!");
         }
      });
   }
}

function volverDocumentosNivelConductorAsignadosUsuarioDocumento(){
   $("#modalDocNivelCondUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verDocumentosNivelConductorAsignadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalDocNivelCondUsuarioDoc").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverDocumentosNivelConductorAsignadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConfiguracionUsuarioAccesoEspecifico(1)' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelCondUsuarioDoc\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelCondUsuarioDoc\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalDocNivelCondUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Documentos a nivel conductor",
      contenido: 
	 "<div id='divDocNivelCondUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelCondUsuarioDoc'>" +
            "<table id='tblDocNivelCondUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Sección - Documento a nivel conductor</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelCondUsuarioDoc",200);
   cargarDocumentosNivelConductorAsignadosUsuarioDocumento();
}

function cargarDocumentosNivelConductorAsignadosUsuarioDocumento(){    
   $("#tblDocNivelCondUsuarioDoc tbody tr").remove();
  	 
   listSeccionDocNivelCondUsuario.forEach(function(val,index){   
      var isAsignado = 0;
       
      if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
 	 var docNivelCondAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
 		
 	 docNivelCondAsignadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
 	 });
      }
       
      var inputCheckAsignado = "<input id='checkAsignadoDocNivelCondUsuarioDoc"+val.id+"' type='checkbox' " +
         "class='form-control' "+(isAsignado == 1?"checked":"")+">";
        
      $("#tblDocNivelCondUsuarioDoc tbody").append(
         "<tr id='trDocNivelCondUsuarioDoc"+val.id+"'>" +
  	    "<td>"+inputCheckAsignado+"</td>" +
  	    "<td>"+val.nombre+"</td>" +
  	 "</tr>");
   });
      	
   goheadfixedY("#tblDocNivelCondUsuarioDoc","#wrapperDocNivelCondUsuarioDoc");
}

function volverDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento(){
   $("#modalDocNivelVehMaqUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalDocNivelVehMaqUsuarioDoc").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConfiguracionUsuarioAccesoEspecifico(2)' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelVehMaqUsuarioDoc\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelVehMaqUsuarioDoc\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalDocNivelVehMaqUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Documentos a nivel vehículo/maquinaria",
      contenido: 
	 "<div id='divDocNivelVehMaqUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelVehMaqUsuarioDoc'>" +
            "<table id='tblDocNivelVehMaqUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Sección - Documento a nivel vehículo/maquinaria</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelVehMaqUsuarioDoc",200);
   cargarDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento();
}

function cargarDocumentosNivelVehiculoMaquinariaAsignadosUsuarioDocumento(){    
   $("#tblDocNivelVehMaqUsuarioDoc tbody tr").remove();
  	 
   listSeccionDocNivelVehMaqUsuario.forEach(function(val,index){   
      var isAsignado = 0;
       
      if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
 	 var docNivelVehMaqAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
 		
 	 docNivelVehMaqAsignadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
 	 });
      }
       
      var inputCheckAsignado = "<input id='checkAsignadoDocNivelVehMaqUsuarioDoc"+val.id+"' type='checkbox' " +
         "class='form-control' "+(isAsignado == 1?"checked":"")+">";
        
      $("#tblDocNivelVehMaqUsuarioDoc tbody").append(
         "<tr id='trDocNivelVehMaqUsuarioDoc"+val.id+"'>" +
  	    "<td>"+inputCheckAsignado+"</td>" +
  	    "<td>"+val.nombre+"</td>" +
  	 "</tr>");
   });
      	
   goheadfixedY("#tblDocNivelVehMaqUsuarioDoc","#wrapperDocNivelVehMaqUsuarioDoc");
}

function volverDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento(){
   $("#modalDocNivelEquHerrUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalDocNivelEquHerrUsuarioDoc").remove();
    
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> " +
         "<i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarConfiguracionUsuarioAccesoEspecifico(3)' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='marcarTodoListaRegistro(\"tblDocNivelEquHerrUsuarioDoc\")' " +
              "title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' onclick='desmarcarTodoListaRegistro(\"tblDocNivelEquHerrUsuarioDoc\")' " +
              "title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalDocNivelEquHerrUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Documentos a nivel equipo/herramienta",
      contenido: 
	 "<div id='divDocNivelEquHerrUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperDocNivelEquHerrUsuarioDoc'>" +
            "<table id='tblDocNivelEquHerrUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Sección - Documento a nivel equipo/herramienta</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperDocNivelEquHerrUsuarioDoc",200);
   cargarDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento();
}

function cargarDocumentosNivelEquipoHerramientaAsignadosUsuarioDocumento(){    
   $("#tblDocNivelEquHerrUsuarioDoc tbody tr").remove();
  	 
   listSeccionDocNivelEquHerrUsuario.forEach(function(val,index){   
      var isAsignado = 0;
       
      if(subUsuarioConfObj.seccionesContratistaHabilitadasId.length != 0){
 	 var docNivelEquHerrAsignadosId = subUsuarioConfObj.seccionesContratistaHabilitadasId.split(",");
 		
 	 docNivelEquHerrAsignadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
 	 });
      }
       
      var inputCheckAsignado = "<input id='checkAsignadoDocNivelEquHerrUsuarioDoc"+val.id+"' type='checkbox' " +
         "class='form-control' "+(isAsignado == 1?"checked":"")+">";
        
      $("#tblDocNivelEquHerrUsuarioDoc tbody").append(
         "<tr id='trDocNivelEquHerrUsuarioDoc"+val.id+"'>" +
  	    "<td>"+inputCheckAsignado+"</td>" +
  	    "<td>"+val.nombre+"</td>" +
  	 "</tr>");
   });
      	
   goheadfixedY("#tblDocNivelEquHerrUsuarioDoc","#wrapperDocNivelEquHerrUsuarioDoc");
}

function volverTiposInduccionVirtualAsignadosUsuarioDocumento(){
   $("#modalTipoInduccVirtualUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verTiposInduccionVirtualAsignadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalTipoInduccVirtualUsuarioDoc").remove();
   
   var contenido = "";
   
   var buttonVolverPrincipal =
      "<button id='btnVolverTipoInduccVirtualAsigUsuarioDoc' type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverTiposInduccionVirtualAsignadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button id='btnGuardaTipoInduccVirtualAsigUsuarioDoc' type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarTiposInduccionVirtualAsignadosUsuarioDocumento()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button id='btnMarcarTodoTipoInduccVirtualAsigUsuarioDoc' class='btn btn-success' style='margin-right:5px' " +
              "onclick='marcarTodoListaRegistro(\"tblTipoInduccVirtualUsuarioDoc\")' title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button id='btnDesmarcarTodoTipoInduccVirtualAsigUsuarioDoc' class='btn btn-success' style='margin-right:5px' " +
              "onclick='desmarcarTodoListaRegistro(\"tblTipoInduccVirtualUsuarioDoc\")' title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalTipoInduccVirtualUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Tipos inducción virtual habilitados",
      contenido: 
	 "<div id='divTipoInduccVirtualUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperTipoInduccVirtualUsuarioDoc'>" +
            "<table id='tblTipoInduccVirtualUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Tipo inducción virtual</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperTipoInduccVirtualUsuarioDoc",200);
   cargarTiposInduccionVirtualAsignadosUsuarioDocumento();
}

function cargarTiposInduccionVirtualAsignadosUsuarioDocumento(){    
   $("#tblTipoInduccVirtualUsuarioDoc tbody tr").remove();
 	 
   listTiposInduccionVirtualUsuario.forEach(function(val,index){   
      var isAsignado = 0;
      
      if(subUsuarioConfObj.tiposInduccionVirtualHabilitadosId.length != 0){
	 var tipoInduccionVirtualAsignadosId = subUsuarioConfObj.tiposInduccionVirtualHabilitadosId.split(",");
		
	 tipoInduccionVirtualAsignadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
	 });
      }
      
      var inputCheckAsignado = "<input id='checkAsignadoTipoInduccVirtualUsuario"+val.id+"' type='checkbox' class='form-control' " +
         (isAsignado == 1?"checked":"")+">";
       
      $("#tblTipoInduccVirtualUsuarioDoc tbody").append(
         "<tr id='trTipoInduccVirtualUsuDoc"+val.id+"'>" +
 	    "<td>"+inputCheckAsignado+"</td>" +
 	    "<td>"+val.nombre+"</td>" +
 	 "</tr>");
   });
     	
   goheadfixedY("#tblTipoInduccVirtualUsuarioDoc","#wrapperTipoInduccVirtualUsuarioDoc");
}

function guardarTiposInduccionVirtualAsignadosUsuarioDocumento(){
   var campoVacio = true;
   
   var listTiposInduccionVirtualAsignados = [];
   var textoTiposInduccionVirtualAsignados = "";

   listTiposInduccionVirtualUsuario.forEach(function(val){
      var isAsignado = ($("#checkAsignadoTipoInduccVirtualUsuario"+val.id).prop("checked")?1:0);
   
      if(isAsignado == 1){
	 listTiposInduccionVirtualAsignados.push({id:val.id}); 
	 
	 textoTiposInduccionVirtualAsignados += (textoTiposInduccionVirtualAsignados.length == 0?val.id:","+val.id);
      }
   });	
 
   if(campoVacio){
      var dataParam={
	 usuarioId:subUsuarioConfId,tiposInduccionVirtual:listTiposInduccionVirtualAsignados,
	 textoTiposInduccionVirtualAsignados:textoTiposInduccionVirtualAsignados
      };

      callAjaxPost(URL+'/subusuario/configuracion/save/multi_tipo_induccion_virtual',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalTipoInduccVirtualUsuarioDoc").modal("hide");
		
	       mensajeUx="<label>Los tipos de inducción virtual fueron asignados al usuario con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarMultiTipoInduccVirtualSubUsuarioConf");
  		
  	       $("#modalMensajeUxActualizarMultiTipoInduccVirtualSubUsuarioConf").on("hidden.bs.modal",function(){
  		  $("#modalConfigUsuarioAccesoEspecif").modal("show");
  		  cargarConfiguracionUsuarioAccesoEspecifico(); 
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la configuración!");
         }
      });
   }
}

function volverTiposLugaresTrabajoAsociadosUsuarioDocumento(){
   $("#modalTipoLugarTrabajoUsuarioDoc").modal("hide");$("#modalConfigUsuarioAccesoEspecif").modal("show");
}

function verTiposLugaresTrabajoAsociadosUsuarioDocumento(){
   $("#modalConfigUsuarioAccesoEspecif").modal("hide");$("#modalTipoLugarTrabajoUsuarioDoc").remove();
   
   var buttonVolverPrincipal =
      "<button type='button' class='btn btn-info' style='margin-right:5px' " +
              "onclick='volverTiposLugaresTrabajoAsociadosUsuarioDocumento()' title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-table fa-2x'></i>" +
      "</button>";
   
   var buttonGuardar =
      "<button type='button' class='btn btn-success' style='margin-right:5px' " +
              "onclick='guardarTiposLugaresTrabajoAsociadosUsuarioDocumento()' title='Guardar.'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var buttonCheckTodo = 
      "<button class='btn btn-success' style='margin-right:5px' " +
              "onclick='marcarTodoListaRegistro(\"tblTipoLugarTrabajoUsuarioDoc\")' title='Marcar todas las filas con un check.'>" +
         "<i class='fa fa-check fa-2x'></i>" +
      "</button>";
   
   var buttonCheckNada = 
      "<button class='btn btn-success' style='margin-right:5px' " +
              "onclick='desmarcarTodoListaRegistro(\"tblTipoLugarTrabajoUsuarioDoc\")' title='Desmarcar todas las filas con un check.'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";
   
   var modalOptions={
      maxWidth:"50%",id:"modalTipoLugarTrabajoUsuarioDoc",
      nombre:"<i class='fa fa-table'></i> Configuración - Lugar(es) de trabajo asociado(s)",
      contenido: 
	 "<div id='divTipoLugarTrabajoUsuarioDoc' class='form-inline' style='margin-top:10px;'>"+
	     buttonVolverPrincipal+buttonCheckTodo+buttonCheckNada+buttonGuardar +
	 "</div>"+
         "<div class='wrapper' id='wrapperTipoLugarTrabajoUsuarioDoc'>" +
            "<table id='tblTipoLugarTrabajoUsuarioDoc' class='table table-striped table-bordered table-hover table-fixed'>" +
	       "<thead>" +
	          "<tr>" +
		     "<th class='tb-acc' style='width:50px'>¿Asignado?</th>" +
		     "<th class='tb-acc' style='width:200px'>Lugar de trabajo</th>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
	    "</table>" +
	 "</div>"};
		
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);   
   resizeDivWrapper("wrapperTipoLugarTrabajoUsuarioDoc",200);
   cargarTiposLugaresTrabajoAsociadosUsuarioDocumento();
}

function cargarTiposLugaresTrabajoAsociadosUsuarioDocumento(){    
   $("#tblTipoLugarTrabajoUsuarioDoc tbody tr").remove();
 	 
   listLugaresTrabajoProyUsuario.forEach(function(val){   
      var isAsignado = 0;
      
      if(subUsuarioConfObj.tiposLugaresTrabajosAsignadosId.length != 0){
	 var tipoLugarTrabajoAsociadosId = subUsuarioConfObj.tiposLugaresTrabajosAsignadosId.split(",");
		
	 tipoLugarTrabajoAsociadosId.forEach(function(val1){
            if(parseInt(val1) == val.id){
               isAsignado = 1;
            }
	 });
      }
      
      var inputCheckAsignado = "<input id='checkAsignadoTipoLugarTrabajoUsuario"+val.id+"' type='checkbox' class='form-control' " +
         (isAsignado == 1?"checked":"")+">";
       
      $("#tblTipoLugarTrabajoUsuarioDoc tbody").append(
         "<tr id='trTipoLugarTrabajoUsuDoc"+val.id+"'>" +
 	    "<td>"+inputCheckAsignado+"</td>" +
 	    "<td>"+val.nombre+"</td>" +
 	 "</tr>");
   });
     	
   goheadfixedY("#tblTipoLugarTrabajoUsuarioDoc","#wrapperTipoLugarTrabajoUsuarioDoc");
}

function guardarTiposLugaresTrabajoAsociadosUsuarioDocumento(){
   var campoVacio = true;
   
   var listTiposLugaresTrabajoAsociados = [];
   var textoTiposLugaresTrabajoAsociados = "";

   listLugaresTrabajoProyUsuario.forEach(function(val){
      var isAsignado = ($("#checkAsignadoTipoLugarTrabajoUsuario"+val.id).prop("checked")?1:0);
   
      if(isAsignado == 1){
	 listTiposLugaresTrabajoAsociados.push({id:val.id}); 
	 
	 textoTiposLugaresTrabajoAsociados += (textoTiposLugaresTrabajoAsociados.length == 0?val.id:","+val.id);
      }
   });	
 
   if(campoVacio){
      var dataParam={
	 usuarioId:subUsuarioConfId,tiposLugaresTrabajo:listTiposLugaresTrabajoAsociados,
	 textoTiposLugaresTrabajoAsociados:textoTiposLugaresTrabajoAsociados
      };

      callAjaxPost(URL+'/subusuario/configuracion/save/multi_tipo_lugar_trabajo',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       $("#modalTipoLugarTrabajoUsuarioDoc").modal("hide");
		
	       mensajeUx="<label>Los lugares de trabajo fueron asociados al usuario con éxito.<label>";
  	       mensajesUx(mensajeUx,1,"","ActualizarMultiTipoLugarTrabajoSubUsuarioConf");
  		
  	       $("#modalMensajeUxActualizarMultiTipoLugarTrabajoSubUsuarioConf").on("hidden.bs.modal",function(){
  		  $("#modalConfigUsuarioAccesoEspecif").modal("show");
  		  cargarConfiguracionUsuarioAccesoEspecifico(); 
  	       });
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la configuración!");
         }
      });
   }
}

var menPerDosNivId,menPerDosNivObj={},tipoExamContId;
var banderaEdicionMenPerDosNiv = false;
var listFullMenPerDosNiv = [];
var listFullMenPerDosNivBuscador = [];
var busquedaActivaMenPerDosNiv,numPaginaActualMenPerDosNiv;

function ocultarConsolidadoMensajePersonalizadoDosNiveles(){
    $("#modalConsolidadoMenPerDosNiv").modal("hide");
}

function verConsolidadoMensajePersonalizadoDosNiveles(){
    $("#modalConsolidadoMenPerDosNiv").remove();

    var contenido = "";

    var buttonVolver =
        "<button type='button' id='btnOcultarMenPerDosNiv' class='btn btn-info' style='margin-right:5px' " +
                "onclick='ocultarConsolidadoMensajePersonalizadoDosNiveles()' title='Regresar a la vista principal'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonCancelar =
        "<button id='btnCancelarMenPerDosNiv' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='cancelarConsolidadoMensajePersonalizadoDosNiveles()' title='Cancelar'>" +
            "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
        "</button>";

    var buttonGuardar =
        "<button id='btnGuardarMenPerDosNiv' type='button' class='btn btn-success' style='margin-right:5px' " +
                "onclick='guardarConsolidadoMensajePersonalizadoDosNiveles()' title='Guardar'>" +
            "<i class='fa fa-floppy-o fa-2x'></i>" +
        "</button>";

    var buttonFlechas =
        "<span id='indicadorPaginaParcialAuxMenPerDosNiv' style='margin:5px;margin-top:10px;'>" +
            "<a id='flechaIzquierdaMenPerDosNiv'><img src='../imagenes/flecha_01.png' /></a>" +
            " <em id='labelFlechasMenPerDosNiv'></em> " +
            "<a id='flechaDerechaMenPerDosNiv'><img src='../imagenes/flecha_02.png' /></a>" +
        "</span>";

    var buscadorOpciones =
        "<button id='btnResetBuscadorMenPerDosNiv' type='button' class='btn btn-success' " +
                "title='Refresh' onclick='reiniciarBuscadorConsolidadoMensajePersonalizadoDosNiveles()' style='float:right;'>" +
            "<i class='fa fa-refresh fa-2x'></i>" +
        "</button>" +
        "<button id='btnAplicarBuscadorMenPerDosNiv' type='button' class='btn btn-success' onclick='aplicarBuscadorConsolidadoMensajePersonalizadoDosNiveles()' " +
                "style='float:right;margin-right:5px;' title='Buscar los registros cuya sección coincida con las palabras ingresadas.'>" +
            "<i class='fa fa-search fa-2x'></i>" +
        "</button>" +
        "<input id='valBuscarValorMenPerDosNiv' placeholder='Sección' class='form-control' " +
               "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

    var modalOptions={
        maxWidth:"90%",id:"modalConsolidadoMenPerDosNiv",
        nombre:"<i class='fa fa-table'></i> Consolidado 'Mensaje personalizado - secciones de documentos a nivel empresa/trabajador contratista'",
        contenido:
            "<form class='form-inline'>" +
                 buttonVolver+buttonCancelar+buttonGuardar+buttonFlechas+buscadorOpciones +
            "</form>" +
            "<div class='wrapper' id='wrapperConsolidadoMenPerDosNiv'>" +
                "<table id='tblConsolidadoMenPerDosNiv' class='table table-striped table-bordered table-hover table-fixed'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td class='tb-acc' style='width:200px'>Sección</td>" +
                            "<td class='tb-acc' style='width:400px'>Mensaje</td>" +
                            "<td class='tb-acc' style='width:150px'>Fecha de registro</td>" +
                            "<td class='tb-acc' style='width:150px'>Fecha de actualización</td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                "</table>" +
            "</div>"};

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    resizeDivWrapper("wrapperConsolidadoMenPerDosNiv",215);
    cargarConsolidadoMensajePersonalizadoDosNiveles();

    $("#flechaIzquierdaMenPerDosNiv").on('click',function(){
	numPaginaActualMenPerDosNiv = numPaginaActualMenPerDosNiv-1;
        cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles();
    });

    $('#flechaDerechaMenPerDosNiv').on('click',function(){
	numPaginaActualMenPerDosNiv = numPaginaActualMenPerDosNiv+1;
        cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles();
    });
}

function cargarConsolidadoMensajePersonalizadoDosNiveles(){
    busquedaActivaMenPerDosNiv = 0,numPaginaActualMenPerDosNiv = 1;banderaEdicionMenPerDosNiv = false;
    $("#valBuscarValorMenPerDosNiv").val("");

    $("#btnOcultarMenPerDosNiv").show();$("#btnCancelarMenPerDosNiv").hide();$("#btnGuardarMenPerDosNiv").hide();
    $("#indicadorPaginaParcialAuxMenPerDosNiv").show();$("#btnResetBuscadorMenPerDosNiv").show();$("#btnAplicarBuscadorMenPerDosNiv").show();
    $("#valBuscarValorMenPerDosNiv").show();

    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid"))
    };

    callAjaxPostSimpleVersionDos(1,URL+'/contratista/tipo_examen_contratista/mensaje_personalizado',dataParam,1,0,function(data){
        if(data.CODE_RESPONSE == "05"){
            listFullMenPerDosNiv = data.listFullMenPerDosNiv;

            cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles();

            goheadfixedY("#tblConsolidadoMenPerDosNiv","#wrapperConsolidadoMenPerDosNiv");
            formatoCeldaSombreableTabla(true,"tblConsolidadoMenPerDosNiv");
        }else{
            console.log("Error al cargar el consolidado 'Mensaje personalizado - secciones de documentos a nivel empresa/trabajador contratista'");
        }
    });
}

function cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles(){
    $("#flechaIzquierdaMenPerDosNiv").show();$("#flechaDerechaMenPerDosNiv").show();

    var list = (busquedaActivaMenPerDosNiv == 0?listFullMenPerDosNiv:listFullMenPerDosNivBuscador);
    var totalSize = list.length;
    var partialSize = 50;

    var numPaginaTotal = Math.ceil(totalSize/partialSize);

    var inicioRegistro = (numPaginaActualMenPerDosNiv*partialSize)-partialSize;
    var finRegistro = (numPaginaActualMenPerDosNiv*partialSize)-1;

    if(numPaginaTotal == 0){
        numPaginaTotal = 1;
    }

    $("#labelFlechasMenPerDosNiv").html("<label>"+numPaginaActualMenPerDosNiv+" de "+numPaginaTotal+"</label>");

    if(numPaginaActualMenPerDosNiv == 1){
        $("#flechaIzquierdaMenPerDosNiv").hide();
    }

    if(numPaginaActualMenPerDosNiv == numPaginaTotal){
        $("#flechaDerechaMenPerDosNiv").hide();
    }

    if(finRegistro >= totalSize){
        finRegistro = totalSize-1;
    }

    $("#tblConsolidadoMenPerDosNiv tbody tr").remove();

    list.forEach(function(val,index){
        if(inicioRegistro <= index && index <= finRegistro){
            var mensaje = (val.mensaje.length == 0?"------":val.mensaje),fechaRegistro = (val.fechaRegistroTexto.length == 0?"------":val.fechaRegistroTexto),
                fechaActualizacionTexto = (val.fechaActualizacionTexto.length == 0?"------":val.fechaActualizacionTexto);
            
            $("#tblConsolidadoMenPerDosNiv tbody").append(
                "<tr id='trConsMenPerDosNiv"+val.tipoExamenContratista.id+"' onclick='editarConsolidadoMensajePersonalizadoDosNiveles("+index+")'>" +
                    "<td id='seccionMenPerDosNiv"+val.tipoExamenContratista.id+"'>"+val.tipoExamenContratista.nombre+"</td>" +
                    "<td id='mensajeMenPerDosNiv"+val.tipoExamenContratista.id+"'>"+mensaje+"</td>" +
                    "<td id='fechaRegMenPerDosNiv"+val.tipoExamenContratista.id+"'>"+fechaRegistro+"</td>" +
                    "<td id='fechaActMenPerDosNiv"+val.tipoExamenContratista.id+"'>"+fechaActualizacionTexto+"</td>" +
                "</tr>");
        }
    });

    $.unblockUI();
}

function cancelarConsolidadoMensajePersonalizadoDosNiveles(){
    cargarConsolidadoMensajePersonalizadoDosNiveles();
}

function editarConsolidadoMensajePersonalizadoDosNiveles(pindex){
    if(!banderaEdicionMenPerDosNiv){
        formatoCeldaSombreableTabla(false,"tblConsolidadoMenPerDosNiv");
        
        menPerDosNivObj = (busquedaActivaMenPerDosNiv == 0?listFullMenPerDosNiv[pindex]:listFullMenPerDosNivBuscador[pindex]);
        menPerDosNivId = menPerDosNivObj.id;tipoExamContId = menPerDosNivObj.tipoExamenContratista.id;

        $("#trConsMenPerDosNiv"+tipoExamContId).addClass("fila-edicion");

        $("#mensajeMenPerDosNiv"+tipoExamContId).html("<textarea id='textMensajeMenPerDosNiv' class='form-control' rows='4'></textarea>");
        $("#textMensajeMenPerDosNiv").val(menPerDosNivObj.mensaje);

        if(menPerDosNivObj.fechaRegistroTexto.length == 0){
            $("#fechaRegMenPerDosNiv"+tipoExamContId).html("<label>*Automático.</label>");
        }else{
            $("#fechaActMenPerDosNiv"+tipoExamContId).html("<label>*Automático.</label>");
        }
       
        banderaEdicionMenPerDosNiv = true;

        $("#btnOcultarMenPerDosNiv").hide();$("#btnCancelarMenPerDosNiv").show();$("#btnGuardarMenPerDosNiv").show();
        $("#indicadorPaginaParcialAuxMenPerDosNiv").hide();$("#btnResetBuscadorMenPerDosNiv").hide();$("#btnAplicarBuscadorMenPerDosNiv").hide();
        $("#valBuscarValorMenPerDosNiv").hide();
    }
}

function guardarConsolidadoMensajePersonalizadoDosNiveles(){
    var campoVacio = true;

    var mensaje = $("#textMensajeMenPerDosNiv").val();

    if(campoVacio){
        var dataParam={
            id:menPerDosNivId,mensaje:mensaje,tipoExamenContratistaId:tipoExamContId,empresaId:parseInt(getSession("gestopcompanyid"))
        };

        callAjaxPost(URL+'/contratista/tipo_examen_contratista/mensaje_personalizado/save',dataParam,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    $("#modalConsolidadoMenPerDosNiv").modal("hide");

                    mensajeUx = "<label>El registro del mensaje fue guardado con éxito.</label>";
                    mensajesUx(mensajeUx,1,"","ActualizarMenPerDosNiv");

                    $("#modalMensajeUxActualizarMenPerDosNiv").on("hidden.bs.modal",function(){
                        $("#modalConsolidadoMenPerDosNiv").modal("show");cargarConsolidadoMensajePersonalizadoDosNiveles();
                    });

                    break;

                default:
                    alert("Ocurrió un error al guardar el registro del mensaje!");
            }
        });
    }else{
        $("#modalConsolidadoMenPerDosNiv").modal("hide");

        mensajesUx(mensajeUx,2,"","ValidacionMenPerDosNiv");

        $("#modalMensajeUxValidacionMenPerDosNiv").on("hidden.bs.modal",function(){
            $("#modalConsolidadoMenPerDosNiv").modal("show");
        });
    }
}

function aplicarBuscadorConsolidadoMensajePersonalizadoDosNiveles(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

    var valBuscarValorMenPerDosNiv = igualarStringBuscar($("#valBuscarValorMenPerDosNiv").val());
    listFullMenPerDosNivBuscador = [];busquedaActivaMenPerDosNiv = 1;numPaginaActualMenPerDosNiv = 1;

    listFullMenPerDosNiv.forEach(function(val,index){
        if(igualarStringBuscar(val.tipoExamenContratista.nombre).indexOf(valBuscarValorMenPerDosNiv) != -1){
            listFullMenPerDosNivBuscador.push(val);
        }
    });

    cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles();
}

function reiniciarBuscadorConsolidadoMensajePersonalizadoDosNiveles(){
    $.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
    $("#valBuscarValorMenPerDosNiv").val("").focus();
    busquedaActivaMenPerDosNiv = 0;numPaginaActualMenPerDosNiv = 1;

    cambiarPaginaConsolidadoMensajePersonalizadoDosNiveles();
}

function ocultarCheckListInduccionesGeneralesHabPerfilProyecto(){
    var textInduccionesGeneralesHabPerfProyHab = "";

    listInduccionesGeneralesProyecto.forEach(function(val){
        var isHabilitado = ($("#checkAsignadoInduccionesGeneralesHabPerfProy"+val.id).prop("checked")?1:0);

        if(isHabilitado == 1){
            textInduccionesGeneralesHabPerfProyHab += (textInduccionesGeneralesHabPerfProyHab.length == 0?val.nombre:", "+val.nombre);
        }
    });

    textInduccionesGeneralesHabPerfProyHab = (textInduccionesGeneralesHabPerfProyHab.length == 0?"------":textInduccionesGeneralesHabPerfProyHab);

    $("#perfProyInduccionesGenerales"+perfilProyectoId).addClass("linkGosst").on("click",function(){
        verCheckListInduccionesGeneralesHabPerfilProyecto();
    }).html(textInduccionesGeneralesHabPerfProyHab+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

    $("#modalCheckListInduccionesGeneralesHabPerfProy").modal("hide");
    $("#modalPerfilesProy").modal("show");
}

function verCheckListInduccionesGeneralesHabPerfilProyecto(){
    $("#modalPerfilesProy").modal("hide");
    $("#modalCheckListInduccionesGeneralesHabPerfProy").modal("show");
}

function cargarCheckListInduccionesGeneralesHabPerfilProyecto(){
    if(perfilProyectoObj.induccionesGeneralesHabilitadasId.length != 0){
        var induccionesGeneralesHabPerfContHabilitadosId = perfilProyectoObj.induccionesGeneralesHabilitadasId.split(",");

        induccionesGeneralesHabPerfContHabilitadosId.forEach(function(val1){
            var checkboxInduccionGeneralHab = document.getElementById('checkAsignadoInduccionesGeneralesHabPerfProy'+val1);

            if(checkboxInduccionGeneralHab != null){
                checkboxInduccionGeneralHab.checked = true;
            }
        });
    }

    ocultarCheckListInduccionesGeneralesHabPerfilProyecto();
}
