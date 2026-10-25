var trabajadorProyectoId;
var trabajadorProyectoObj=[];
var banderaEdicion79=false;
var listFullTrabProyecto;
var estadoActividadProy;
var mensajeUx;

function cargarTrabsProyectosSeguridad(pindex){
   pindex = defaultFor(pindex,indexPostulante);
   //
   $(".detalleTrabajadoresProyecto").html("");
   $("#editarMovilTrabProy").find(".tituloSubList").html(textoBotonVolverContenido +
      "Editar trabajadores del proyecto '"+listFullProyectoSeguridad[pindex].titulo+"'");
	
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings()
   .find(".detalleTrabajadoresProyecto").hide();
	
   $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
   .find(".detalleTrabajadoresProyecto").toggle();
   //
   var proyectoObjSend={
      id: listFullProyectoSeguridad[pindex].id,
      contratistaId: getSession("contratistaGosstId")
   };
	
   proyectoObj.id = listFullProyectoSeguridad[pindex].id;
   indexPostulante = pindex;
	
   callAjaxPost(URL+'/contratista/proyecto/trabajadores',proyectoObjSend,function(data){
      if(data.CODE_RESPONSE == "05"){
	 listFullTrabProyecto = data.list;
	 banderaEdicion79 = false;
	 
	 var indicadorPositivo = 0,indicadorTotal = 0;
	 
	 $("#proyectoTable"+listFullProyectoSeguridad[pindex].id)
	 .find(".detalleTrabajadoresProyecto").html("<td colspan='3'></td>");
					
	 listFullTrabProyecto.forEach(function(val,index){
	    if(val.proyectoActual != null && val.isActivo == 1){
	       val.selected = 1;
	       indicadorTotal++;
					
	       var verificacionObj = verificarTrabajadorContratistaHabilitado(val);
						
	       if(proyectoObj.evaluacionManual != 0){
		  verificacionObj.isHabilitado = (val.notaManual == 1?true:false);
	       }
	       
	       var claseGosst = (verificacionObj.isHabilitado?"gosst-aprobado":"gosst-neutral");  
						
	       if(verificacionObj.isHabilitado){
		  indicadorPositivo++;
	       }
						
	       var textoExam1 = "<i class='fa fa-medkit' aria-hidden='true'></i>" +verificacionObj.textoExamen.replace("<br>","")+"<br>";
	       var textoExam2 = "<i class='fa fa-folder-open-o' aria-hidden='true'></i>" +verificacionObj.textoSctr.replace("<br>","")+"<br>"; 
	       var textoExam3 = "<i class='fa fa-arrow-circle-o-down' aria-hidden='true'></i>" +verificacionObj.textoInduccion.replace("<br>","")+"<br>"; 
	       var textoExam4 = "<i class='fa fa-inbox' aria-hidden='true'></i>" +verificacionObj.textoCargo.replace("<br>","")+"<br>"; 
	       var textoExam6 = "<i class='fa fa-files-o' aria-hidden='true'></i> "+verificacionObj.textoTreg.replace("<br>","")+"<br>";
	       var textoExam8 = "<i class='fa fa-fire-extinguisher' aria-hidden='true'></i>" +verificacionObj.textoEpp.replace("<br>","")+"<br>";
	       var textHojaVida = "<i class='fa fa-info' aria-hidden='true'></i> "+verificacionObj.eval4.textoEval.replace("<br>","")+"<br>";
						
	       var docsId = proyectoObj.examenesPermitidosId.split(",");
						
	       docsId.forEach(function(val1){
	          switch(parseInt(val1)){
		     case 16:
		        textHojaVida = "";
		        break;
							
		     case 6:
			textoExam1 = "";					
			break;
							
		     case 7:
			textoExam2 = "";
			break;
							
		     case 9:
			textoExam3 = "";
			break;
							
		     case 11:
			textoExam4 = "";
			break;
							
		     case 12:
		        textoExam6 = "";
		        break;
							
		     case 8:
			textoExam8 = "";
			break;
	          }
	       });
						
	       $("#proyectoTable"+listFullProyectoSeguridad[pindex].id).find(".detalleTrabajadoresProyecto td") .append( 
	          "<div class='detalleAccion "+claseGosst+"'>" +
		     "<i class='fa fa-user' aria-hidden='true'></i>" +val.nombreCompleto+"<br>" +
		     "<i class='fa fa-building-o' aria-hidden='true'></i>" +val.area+"-"+val.cargo+"<br>" + 
		     "<i class='fa  fa-address-card-o' aria-hidden='true'></i>" +val.tipoDocumento.nombre+": "+val.nroDocumento+"<br>" +
		      textoExam1+textoExam2+textoExam3+textoExam4 +
		      textoExam6+textoExam8+textHojaVida +
		     "<a class='efectoLink' onclick='generarFotocheckTrabajadorContratista(1,"+index+")'>" +
		        "<i class='fa fa-download'></i> Generar Fotocheck" +
		     "</a>" +
		  "</div>");
//		  "<div class='opcionesAccion'>" +
//	   	     "<a onclick='eliminarTrabProyecto("+index+")'> Eliminar</a>" +
//		     "<i class='fa fa-minus' aria-hidden='true'></i>" +
//	             "<a onclick='editarActProyecto("+index+")'> Editar</a>" +
//		  "</div>");
	    }
	 });
					
	 $("#trTrabProyecto"+proyectoObj.id+" .celdaIndicadorProyecto").html(indicadorPositivo+" / "+indicadorTotal);
      }else{
         console.log("NOPNPO");
      }
   });	
}

function generarFotocheckTrabajadorContratista(acceso,pindex){
   var trabContratistaObj = (parseInt(acceso) == 1?listFullTrabProyecto[pindex]:listFullTrabajadoresProyectos[pindex]);
    
   window.open(URL+"/contratista/trabajador/fotocheck?id="+trabContratistaObj.id +"&nombre="+trabContratistaObj.nombre,"_blank");
}

function nuevoTrabProyecto(pindex){
    if(!banderaEdicion79){
        trabajadorProyectoId = 0;proyectoObj.id = listFullProyectoSeguridad[pindex].id;indexPostulante = pindex;
		
        var proyectoObjSend={
	       id:listFullProyectoSeguridad[pindex].id,contratistaId:getSession("contratistaGosstId"),numTrabajosAltoRiesgoTotal:proyectoObj.numTrabajosAltoRiesgoTotal,
		   habilitadoConstanciaAltoRiesgo:proyectoObj.habilitadoConstanciaAltoRiesgo,habilitarCargoInduccionTrabAltRie:proyectoObj.habilitarCargoInduccionTrabAltRie,
		   habilitadoTrabajoAltoRiesgo9:proyectoObj.habilitadoTrabajoAltoRiesgo9,habilitadoTrabajoAltoRiesgo10:proyectoObj.habilitadoTrabajoAltoRiesgo10,
		   habilitadoTrabajoAltoRiesgo11:proyectoObj.habilitadoTrabajoAltoRiesgo11,habilitadoTrabajoAltoRiesgo12:proyectoObj.habilitadoTrabajoAltoRiesgo12,
		   habilitadoTrabajoAltoRiesgo13:proyectoObj.habilitadoTrabajoAltoRiesgo13,habilitadoTrabajoAltoRiesgo26:proyectoObj.habilitadoTrabajoAltoRiesgo26,
		   habilitadoTrabajoAltoRiesgo27:proyectoObj.habilitadoTrabajoAltoRiesgo27,habilitadoTrabajoAltoRiesgo28:proyectoObj.habilitadoTrabajoAltoRiesgo28,
		   habilitadoTrabajoAltoRiesgo29:proyectoObj.habilitadoTrabajoAltoRiesgo29,habilitadoTrabajoAltoRiesgo30:proyectoObj.habilitadoTrabajoAltoRiesgo30,
		   habilitadoTrabajoAltoRiesgo31:proyectoObj.habilitadoTrabajoAltoRiesgo31,habilitadoTrabajoAltoRiesgo32:proyectoObj.habilitadoTrabajoAltoRiesgo32,
		   habilitadoTrabajoAltoRiesgo62:proyectoObj.habilitadoTrabajoAltoRiesgo62,habilitadoTrabajoAltoRiesgo66:proyectoObj.habilitadoTrabajoAltoRiesgo66,
		   habilitadoTrabajoAltoRiesgo80:proyectoObj.habilitadoTrabajoAltoRiesgo80,habilitadoTrabajoAltoRiesgo81:proyectoObj.habilitadoTrabajoAltoRiesgo81,
		   habilitadoTrabajoAltoRiesgo82:proyectoObj.habilitadoTrabajoAltoRiesgo82,habilitadoTrabajoAltoRiesgo83:proyectoObj.habilitadoTrabajoAltoRiesgo83,
		   habilitadoTrabajoAltoRiesgo85:proyectoObj.habilitadoTrabajoAltoRiesgo85,habilitadoTrabajoAltoRiesgo86:proyectoObj.habilitadoTrabajoAltoRiesgo86,
		   habilitadoTrabajoAltoRiesgo87:proyectoObj.habilitadoTrabajoAltoRiesgo87,habilitadoTrabajoAltoRiesgo120:proyectoObj.habilitadoTrabajoAltoRiesgo120,
		   habilitadoTrabajoAltoRiesgo121:proyectoObj.habilitadoTrabajoAltoRiesgo121,habilitadoTrabajoAltoRiesgo122:proyectoObj.habilitadoTrabajoAltoRiesgo122
        };
		
        callAjaxPost(URL+'/contratista/proyecto/trabajadores',proyectoObjSend,function(data){
            if(data.CODE_RESPONSE == "05"){
	            listFullTrabProyecto = data.list;
	    
	            $("#editarMovilTrabProy").find(".tituloSubList").html(textoBotonVolverContenido+" Nuevo trabajador del proyecto "+"'"+listFullProyectoSeguridad[pindex].titulo+"'");
						
	    		$(".divListPrincipal>div").hide();$("#editarMovilTrabProy").show();
						
	    		insertarSelectTrabajadoresProyecto();
         	}
      	});
		
      	banderaEdicion79 = false;
   	}else{
      	alert("Guarde primero.");
   	}
}

function insertarSelectTrabajadoresProyecto(){
   var listActivo = [],listInactivo = [];
	
   listFullTrabProyecto.forEach(function(val,index){
      if(val.proyectoActual != null){
         listActivo.push(val);
			
         if(val.isActivo == 1){
	    val.selected = 1;
         }
      }
   });
	
   listActivo.forEach(function(val,index){
      if(val.proyectoActual != null){
         var auxTrab={
            id: val.id,nombreCompleto: val.nombreCompleto
         };
		
         auxTrab.selected = (val.isActivo == 0?1:0);
					
         listInactivo.push(auxTrab);
      }
   });
   
   var editarDiv = $("#editarMovilTrabProy");
   editarDiv.find("#divSelTrabProy").html("");

   var slcTrabajadoresProyecto = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresProyecto","",
      listFullTrabProyecto,"id","nombreCompleto","#editarMovilTrabProy #divSelTrabProy","Trabajadores asignados...");

   var slcTrabajadoresProyectoInhabilitados = crearSelectOneMenuObligMultipleCompleto("slcTrabajadoresProyectoInhabilitados","",
      listInactivo,"id","nombreCompleto","#editarMovilTrabProy #divSelTrabProyInhab","Trabajadores inhabilitados...");
	
   $("#slcTrabajadoresProyecto").chosen().change(function(ev,val){
      listFullTrabProyecto.forEach(function(val1){
         if(val1.id == parseInt(val.selected)){
	    val1.isActivo = 1;val1.selected = 1;
	    insertarSelectTrabajadoresProyecto();
         }
			
         if(val1.id == parseInt(val.deselected)){
	    val1.isActivo = 0;val1.selected = 0;
	    insertarSelectTrabajadoresProyecto();
         }
      });
   });
	
   $("#slcTrabajadoresProyectoInhabilitados").chosen().change(function(ev,val){
      listFullTrabProyecto.forEach(function(val1){
         if(val1.id == parseInt(val.selected)){
	    val1.isActivo = 0;val1.selected = 0;
	    insertarSelectTrabajadoresProyecto();
         }
			
         if(val1.id == parseInt(val.deselected)){
	    val1.isActivo = 1;val1.selected = 0;
	    insertarSelectTrabajadoresProyecto();
         }
      });
   });
}

function eliminarTrabProyecto(pindex){
   trabajadorProyectoId = listFullTrabProyecto[pindex].id; 
	
   var r = confirm("¿Está seguro de eliminar la actividad?");

   if(r == true){
      var dataParam={
	     id: trabajadorProyectoId,
		    };

      callAjaxPost(URL+'/contratista/proyecto/actividad/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       cargarTrabsProyectosSeguridad();
	       break;
					
	    default:
	       alert("Ocurrió un error al eliminar la programacion!");
         }
      });
   }
}

function guardarTrabsProyecto(){
   var campoVacio = true;
   
   var trabsId = $("#slcTrabajadoresProyecto").val();
   var trabajadoresFinal = [];
   var textoTrabContratistaHabilitados = "";
	
   trabsId.forEach(function(val,index){
      trabajadoresFinal.push({id: val,isActivo: 1});
      
      textoTrabContratistaHabilitados += (textoTrabContratistaHabilitados.length == 0?val:","+val);
   });
	
   var trabsInactivoId = $("#slcTrabajadoresProyectoInhabilitados").val();
	
   trabsInactivoId.forEach(function(val,index){
      trabajadoresFinal.push({id: val,isActivo: 0});
   });
		
   if(campoVacio){
      var proyectoObject={
	 id: proyectoObj.id,contratistaId: getSession("contratistaGosstId"),
	 trabajadores: trabajadoresFinal,textoTrabContratistaHabilitados: textoTrabContratistaHabilitados 
      };

      callAjaxPost(URL+'/contratista/proyecto/trabajadores/save',proyectoObject,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	       mensajeUx="<label>Los trabajadores asignados al proyecto fueron actualizados.</label>";
	       mensajesUx(mensajeUx,1,"",""); 
	       
	       volverDivSubContenido();marcarIconoModuloContratista(3);
	       
	       break;
						
	    default:
	       console.log("Ocurrió un error al guardar la lista de trabajadores!");
         }
      });
   }else{
      alert("Debe ingresar todos los campos.");
   }	
}

function ordenarTrabProyecto(tipoOrden,isAscendente){
	var factorAscendente=1;
	var isNuevoAscendete=0;
	if(parseInt(isAscendente)==0){
		factorAscendente=-1;
		isNuevoAscendete=1
	}else{
		factorAscendente=1;
		isNuevoAscendete=0
	}
	listFullTrabajadoresProyectos=listFullTrabajadoresProyectos.filter(function(val){
		if(val.proyectoActual!=null && val.isActivo==1){
			return true
		}else{return false;}
	});
	switch(parseInt(tipoOrden)){
	case 1:
		listFullTrabajadoresProyectos.sort(function(a,b){
			
		    return (a.isHabilitado - b.isHabilitado)*factorAscendente;
			
		});
		break;
	case 2:
		listFullTrabajadoresProyectos.sort(function(a,b){
			if(a.nombre.toUpperCase() < b.nombre.toUpperCase()) return -1*factorAscendente;
		    if(a.nombre.toUpperCase() > b.nombre.toUpperCase()) return 1*factorAscendente;
		    return 0;
			});
		break;
	case 3:
		listFullTrabajadoresProyectos.sort(function(a,b){
			if(a.apellido.toUpperCase() < b.apellido.toUpperCase()) return -1*factorAscendente;
		    if(a.apellido.toUpperCase() > b.apellido.toUpperCase()) return 1*factorAscendente;
		    return 0;
			});
		break;
	}
	var data={CODE_RESPONSE:"05",list:listFullTrabajadoresProyectos};
	if(getSession("accesoUsuarios")=="2"){
		procesarResumenTrabajadoresProyectoVistaContratista(data);
	}else{
		procesarResumenTrabajadoresProyecto(data)
	}
	$(".fix-head #iconSortTrab"+tipoOrden+"").attr("onclick","ordenarTrabProyecto("+tipoOrden+","+isNuevoAscendete+")")
	$("#iconSortTrab"+tipoOrden+"").attr("onclick","ordenarTrabProyecto("+tipoOrden+","+isNuevoAscendete+")")
	
}

var tituloAnteriorContratista="";

function verTablaResumenTrabProyecto(index){
   $(".divContainerGeneral").hide();
	
   var buttonDescarga =
      "<a target='_blank' class='btn btn-success' href='"+URL+"/'>" +
         "<i class='fa fa-download'></i>Descargar" +
      "</a>";
   
   var buttonClip =
      "<button type='button' id='btnClipboardTrabProy' style='margin-right:10px' " +
	      "class='btn btn-success clipGosst' onclick='obtenerTablaTrabajadoresProyecto()' " +
	      "title='Clipboard - copiar el contenido de la tabla actual.'>" +
         "<i class='fa fa-clipboard fa-2x'></i>" +
      "</button>";
   
   var buttonVolver = 
      "<button type='button' class='btn btn-success' style='margin-right:10px' onclick='volverVistaMovil()' " +
              "title='Regresar a la vista anterior.'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
	
//   var buttonFiltro =
//      "<button type='button' class='btn btn-success' id='btnIniciarFiltro' style='margin-right:10px' " +
//	      "onclick='iniciarFiltroTrabProyecto()' title='Ver el filtro de la tabla actual.'>" +
//         "<i class='fa fa-filter fa-2x'></i>" +
//      "</button>";
   
//   var buttonFiltroAplicar =
//      "<button type='button' class='btn btn-success' id='btnAplicarFiltro' style='margin-right:10px' " +
//	      "onclick='aplicarFiltroTrabProyecto()' title='Aplicar la(s) opción(es) seleccionada(s) del filtro.'>" +
//         "<i class='fa fa-filter fa-2x'></i>" +
//      "</button>";
   
   var buttonFiltroRefresh =
      "<button type='button' class='btn btn-success' id='btnReiniciarFiltro' style='float:right;' " +
	      "onclick='reiniciarFiltroTrabProyecto()' title='Reiniciar los registros de la tabla actual.'>" +
         "<i class='fa fa-refresh fa-2x'></i>" +
      "</button>";
   
   var buttonBuscar = 
      "<button type='button' class='btn btn-success' style='float:right;margin-right:10px;' onclick='buscarTrabajadorProyecto()' " +
	      "title='Buscar los registros cuyo DNI, nombre o apellido coincidan con las palabras ingresadas.'>" +
         "<i class='fa fa-search fa-2x'></i>" +
      "</button>" +
      "<input placeholder='DNI, nombre o apellido' class='form-control' id='buscarTrabProy' style='float:right;margin-right:5px;'>";

	var tipoExamenContUno = (parseInt(getSession("gestopcompanyid")) == 741?"Habilitación médica ocupacional":"Certificado Aptitud Médico");

	$("body").append(
      "<div id='divTrabProyTabla' style='padding-left:40px;'>" +
         "<form class='form-inline'>"+
	     buttonVolver+buttonFiltroRefresh+buttonBuscar+buttonClip +
	 "</form>" +
	 "<div class='camposFiltroTabla'>"+
	    "<div class='contain-filtro' id='filtroProyTrab'>" +
               "<input type='checkbox' id='checkFiltroProyTrab' checked>" +
	       "<label for='checkFiltroProyTrab'>Trabajadores</label>" +
	       "<div id='divSelectFiltroProyTrab'></div>" + 
	    "</div>" +	
	 "</div>" +
	 "<div class='wrapper' id='wrapperTrabProy'>" +
	    "<table style='min-width:11980px' id='tblTrabProyecto' " +
	           "class='table table-striped table-bordered table-hover fixed'>" +
               "<thead>" +
	          "<tr>" +
		     "<td class='tb-acc' style='width:120px'>Habilitado " +
		        "<i id='iconSortTrab1' class='fa fa-sort' onclick='ordenarTrabProyecto(1,1)'></i></td>" +
		     "<td class='tb-acc' style='width:150px'>Fotocheck</td>" +
		      (proyectoObj.numTrabajosAltoRiesgoTotal == 0 || (proyectoObj.habilitadoConstanciaAltoRiesgo == 0 && proyectoObj.habilitarCargoInduccionTrabAltRie == 0 &&
		       proyectoObj.habilitadoMedicoClinica == 0)?"":"<td class='tb-acc' style='width:300px'>Trabajos de alto riesgo asignados</td>") +
		     "<td class='tb-acc' style='width:300px'>Trabajador(a)</td>" +
		     "<td class='tb-acc' style='width:250px'>Empresa</td>" +
//		     "<td class='tb-acc' style='width:200px'>Área</td>" +
		     "<td class='tb-acc' style='width:200px'>Puesto de trabajo</td>" +
		     "<td class='tb-acc' style='width:120px'>Tipo Documento</td>" +
		     "<td class='tb-acc' style='width:150px'>N° Documento</td>" +
			  (proyectoObj.habilitarEsConductor == 0?"":"<td class='tb-acc' style='width:170px'>¿Es conductor?</td>") +
		      (proyectoObj.habilitadoEsPrevencionista == 0?"":"<td class='tb-acc' style='width:170px'>¿Es prevencionista?</td>") +
		      (proyectoObj.habilitadoEsPrevencionista == 0 || proyectoObj.habilitadoEntrevistaPrevencionista == 0?"":
			   "<td class='tb-acc' style='width:170px'>Entrevista prevencionista</td>") +
		      (proyectoObj.habilitadoCertAptMedica == 0?"":"<td class='tb-acc' style='width:170px'>"+tipoExamenContUno+"</td>") +
		      (proyectoObj.habilitadoSctr == 0?"":
		       "<td class='tb-acc' style='width:170px'>SCTR</td>") +
		      (proyectoObj.habilitadoEpp == 0?"":
		       "<td class='tb-acc' style='width:170px'>EPP</td>") +
		      (proyectoObj.habilitacionInduccion3 == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducción del cliente</td>") +
		      (proyectoObj.habilitadoCargReglamento == 0?"":
	               "<td class='tb-acc' style='width:170px'>Cargo reglamento</td>") +
		      (proyectoObj.habilitadoTRegistro == 0?"":
		       "<td class='tb-acc' style='width:170px'>T-registro</td>") +
		      (proyectoObj.habilitadoInduccSstCont == 0?"":
		       "<td class='tb-acc' style='width:170px'>Inducciones SST de la contratista</td>") + 
		      (proyectoObj.habilitadoPruebaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Prueba COVID-19</td>") + 
		      (proyectoObj.habilitadoVacunaCovid == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacuna COVID-19</td>") + 
		      (proyectoObj.habilitadoCertifPolicial == 0?"":
		       "<td class='tb-acc' style='width:170px'>Certificados policiales</td>") + 
		      (proyectoObj.habilitadoAntecedentesPenales  == 0?"":
		       "<td class='tb-acc' style='width:170px'>Antecedentes penales</td>") + 
		      (proyectoObj.habilitadoSeguroAccidentes  == 0?"":
		       "<td class='tb-acc' style='width:170px'>Seguro contra accidentes</td>") + 
		      (proyectoObj.habilitadoRiesgoExposicionPuestoTrabajo  == 0?"":
		       "<td class='tb-acc' style='width:170px'>Riesgo de exposición al puesto de trabajo</td>") +
		      (proyectoObj.habilitadoVacunacionCovid  == 0?"":
		       "<td class='tb-acc' style='width:170px'>Vacunación COVID-19</td>") +
		      (proyectoObj.habilitadoCarnetSanidad  == 0?"":
		       "<td class='tb-acc' style='width:170px'>Carnet de sanidad</td>") +
			  (proyectoObj.habilitadoAcuerdoSeguridadEquElec == 0?"":"<td class='tb-acc' style='width:170px'>Acuerdo de seguridad y confidencialidad - equipos electrónicos</td>") +
		      (proyectoObj.habilitadoEvaluacionToxicologica == 0?"":"<td class='tb-acc' style='width:170px'>Evaluación toxicológica</td>") +
			  (proyectoObj.habilitadoCertifUnicoLaboral == 0?"":"<td class='tb-acc' style='width:170px'>Certificado único laboral</td>") +
			  (proyectoObj.habilitadoAntecedentesPoliciales == 0?"":"<td class='tb-acc' style='width:170px'>Antecedentes policiales</td>") +
			  (proyectoObj.habilitadoDeclaracionVerifDomicilio == 0?"":"<td class='tb-acc' style='width:170px'>Declaración jurada o verificación del domicilio</td>") +
			  (proyectoObj.habilitadoDotacionIndumentaria == 0?"":"<td class='tb-acc' style='width:170px'>Dotación indumentaria</td>") +
			  (proyectoObj.habilitadoMedicoClinica == 0?"":"<td class='tb-acc' style='width:170px'>Habilitación médica por clínica</td>") +
		      (proyectoObj.habilitadoExamNivelTrabCont84 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo RISST de la contratista</td>") +
		      (proyectoObj.habilitadoExamNivelTrabCont89 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de recepción de IPERC</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont90 == 0?"":"<td class='tb-acc' style='width:170px'>Seguro vida ley</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont99 == 0?"":"<td class='tb-acc' style='width:170px'>Documento de identidad</td>") +
			  (proyectoObj.habilitadoExamNivelTrabCont100 == 0?"":"<td class='tb-acc' style='width:170px'>Procedimiento o manual para trab. contratistas</td>") +
		      (proyectoObj.habilitadoExamNivelTrabCont101 == 0?"":"<td class='tb-acc' style='width:170px'>Cargo de procedimiento de HS</td>") +
		      (proyectoObj.habilitadoExamNivelTrabCont111 == 0?"":"<td class='tb-acc' style='width:170px'>Inducción SSOMA del cliente</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont112 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación en procedimiento de trabajo</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont113 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de política de seguridad del cliente</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont114 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de difusión de RISST del cliente</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont115 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en reporte de accidentes e incidentes (flujograma)</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont116 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de IPERC, PETS y PETAR</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont117 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación por puesto de trabajo</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont118 == 0?"":"<td class='tb-acc' style='width:170px'>Registro de capacitación de IPERC de la contratista</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont119 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación de buenas prácticas de manipulación de alimentos</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont128 == 0?"":"<td class='tb-acc' style='width:170px'>Título del profesional</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont129 == 0?"":"<td class='tb-acc' style='width:170px'>Evidencia colegiatura habilitada</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont130 == 0?"":"<td class='tb-acc' style='width:170px'>Registro nacional de especialidad</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont131 == 0?"":"<td class='tb-acc' style='width:170px'>Constancia/Carnet SUCAMEC</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont132 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - BLS (Basic Life Support)</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont133 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - PHLS (Prehospital Trauma Life Support)</td>") +
	              (proyectoObj.habilitadoExamNivelTrabCont134 == 0?"":"<td class='tb-acc' style='width:170px'>Certificado capacitacion - ACLS (Advance Cardiovascular Life Support)</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont140 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión de plan de respuesta a emergencia del cliente</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont141 == 0?"":"<td class='tb-acc' style='width:170px'>Charla de inducción SST y MA</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont142 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega de política de sostenibilidad del cliente</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont143 == 0?"":"<td class='tb-acc' style='width:170px'>Difusión y entrega plan COVID-19</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont144 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IPERC</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont145 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en matriz IAAS</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont146 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en primeros auxilios</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont147 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso extintor</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont148 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en plan contingencia</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont149 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de trabajo</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont150 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en ATS</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont151 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en capacitación uso de EPP</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont152 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en manejo de insumos químicos - hojas MSDS</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont153 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en uso de herramientas manuales</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont154 == 0?"":"<td class='tb-acc' style='width:170px'>Capacitación en procedimiento de señalización</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont155 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 1</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont156 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 2</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont157 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 3</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont158 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 4</td>") +
				  (proyectoObj.habilitadoExamNivelTrabCont159 == 0?"":"<td class='tb-acc' style='width:170px'>IBT 5</td>") +
	              (proyectoObj.habilitadoHojaVida == 0?"":"<td class='tb-acc' style='width:170px'>Hoja de Vida</td>") +
		     "<td class='tb-acc' style='width:150px'>¿Sin sanciones en curso?</td>" +
		  "</tr>" +
	       "</thead>" +
	       "<tbody></tbody>" +
            "</table>" +
	 "</div>" +  
      "</div>");
	 
   var listOpciones=[
      {id:1000,nombre:"Habilitado"},{id:0,nombre:"Sin Habilitar"},{id:2,nombre:"Sin SCTR"},
      {id:1,nombre:"Sin Examen Médico"},{id:3,nombre:"Sin Inducción"},{id:4,nombre:"Sin Cargo"},
      {id:6,nombre:"Sin T-registro"},{id:8,nombre:"Sin EPP"},{id:100,nombre:"Sin Hoja de Vida"}
   ];
	
   if(parseInt(getSession("isProyectoSimple"))==1){
      listOpciones=[
         {id:1000,nombre:"Habilitado"},
	 {id:0,nombre:"Sin Habilitar"},
	 {id:2,nombre:"Sin SCTR"},
	 {id:1,nombre:"Sin Examen Médico"},
	 {id:3,nombre:"Sin Inducción"},
	 {id:4,nombre:"Sin Cargo"},
	 {id:8,nombre:"Sin EPP"},
	 {id:100,nombre:"Sin Hoja de Vida"}
      ];
   }
	
   crearSelectOneMenuObligMultipleCompleto("selMultipleTrabProy","",listOpciones, 
      "id","nombre","#divSelectFiltroProyTrab","Seleccione criterios");
	
   $(".camposFiltroTabla").hide();
   $("#btnAplicarFiltro").hide();
   $("#buscarTrabProy").focus();
	  
   $("#divTrabProyTabla form").on("submit",function(e){
      e.preventDefault();
      buscarTrabajadorProyecto();
   });
	
   var contratistaSendId = getSession("contratistaGosstId");
	
   if(parseInt(getSession("accesoUsuarios")) == 0){
      if(proyectoObj.postulante != null){
	 contratistaSendId = proyectoObj.postulante.contratista.id;
      }else{
	 alert("No se ha asignado contratista");
	 return;
      }
   }
	
   tituloAnteriorContratista = $(".divTituloGeneral h4").text();
	
   var resizeDivAux = (parseInt(getSession("accesoUsuarios")) == 0?180:165);
   
   resizeDivWrapper("wrapperTrabProy",resizeDivAux);
   goheadfixedY("#tblTrabProyecto","#wrapperTrabProy");
	 
   var proyectoObjSend={
       id:proyectoObj.id,contratistaId:contratistaSendId,numTrabajosAltoRiesgoTotal:proyectoObj.numTrabajosAltoRiesgoTotal,
	   habilitadoConstanciaAltoRiesgo:proyectoObj.habilitadoConstanciaAltoRiesgo,habilitarCargoInduccionTrabAltRie:proyectoObj.habilitarCargoInduccionTrabAltRie,
	   habilitadoTrabajoAltoRiesgo9:proyectoObj.habilitadoTrabajoAltoRiesgo9,habilitadoTrabajoAltoRiesgo10:proyectoObj.habilitadoTrabajoAltoRiesgo10,
	   habilitadoTrabajoAltoRiesgo11:proyectoObj.habilitadoTrabajoAltoRiesgo11,habilitadoTrabajoAltoRiesgo12:proyectoObj.habilitadoTrabajoAltoRiesgo12,
	   habilitadoTrabajoAltoRiesgo13:proyectoObj.habilitadoTrabajoAltoRiesgo13,habilitadoTrabajoAltoRiesgo26:proyectoObj.habilitadoTrabajoAltoRiesgo26,
	   habilitadoTrabajoAltoRiesgo27:proyectoObj.habilitadoTrabajoAltoRiesgo27,habilitadoTrabajoAltoRiesgo28:proyectoObj.habilitadoTrabajoAltoRiesgo28,
	   habilitadoTrabajoAltoRiesgo29:proyectoObj.habilitadoTrabajoAltoRiesgo29,habilitadoTrabajoAltoRiesgo30:proyectoObj.habilitadoTrabajoAltoRiesgo30,
	   habilitadoTrabajoAltoRiesgo31:proyectoObj.habilitadoTrabajoAltoRiesgo31,habilitadoTrabajoAltoRiesgo32:proyectoObj.habilitadoTrabajoAltoRiesgo32,
	   habilitadoTrabajoAltoRiesgo62:proyectoObj.habilitadoTrabajoAltoRiesgo62,habilitadoTrabajoAltoRiesgo66:proyectoObj.habilitadoTrabajoAltoRiesgo66,
	   habilitadoTrabajoAltoRiesgo80:proyectoObj.habilitadoTrabajoAltoRiesgo80,habilitadoTrabajoAltoRiesgo81:proyectoObj.habilitadoTrabajoAltoRiesgo81,
	   habilitadoTrabajoAltoRiesgo82:proyectoObj.habilitadoTrabajoAltoRiesgo82,habilitadoTrabajoAltoRiesgo83:proyectoObj.habilitadoTrabajoAltoRiesgo83,
	   habilitadoTrabajoAltoRiesgo85:proyectoObj.habilitadoTrabajoAltoRiesgo85,habilitadoTrabajoAltoRiesgo86:proyectoObj.habilitadoTrabajoAltoRiesgo86,
	   habilitadoTrabajoAltoRiesgo87:proyectoObj.habilitadoTrabajoAltoRiesgo87,trabajosAltoRiesgoChtHabilitadosId:proyectoObj.trabajosAltoRiesgoChtHabilitadosId,
	   habilitadoMedicoClinica:proyectoObj.habilitadoMedicoClinica,habilitadoTrabajoAltoRiesgo120:proyectoObj.habilitadoTrabajoAltoRiesgo120,
	   habilitadoTrabajoAltoRiesgo121:proyectoObj.habilitadoTrabajoAltoRiesgo121,habilitadoTrabajoAltoRiesgo122:proyectoObj.habilitadoTrabajoAltoRiesgo122,
	   habilitadoTrabajoAltoRiesgo135:proyectoObj.habilitadoTrabajoAltoRiesgo135,habilitadoTrabajoAltoRiesgo136:proyectoObj.habilitadoTrabajoAltoRiesgo136,
	   habilitadoTrabajoAltoRiesgo160:proyectoObj.habilitadoTrabajoAltoRiesgo160,habilitadoTrabajoAltoRiesgo161:proyectoObj.habilitadoTrabajoAltoRiesgo161
   };
		
   callAjaxPost(URL+'/contratista/proyecto/trabajadores',proyectoObjSend,procesarResumenTrabajadoresProyectoVistaContratista);
}

function obtenerTablaTrabajadoresProyecto(){
   var texto = obtenerDatosBodyTablaEstandar("tblTrabProyecto"); 
   copiarAlPortapapeles(texto,"btnClipboardTrabProy");
   alert("Se han guardado al clipboard la tabla");	
}

function buscarTrabajadorProyecto(){
   var trabNombre = igualarStringBuscar($("#buscarTrabProy").val());
	
   listFullTrabajadoresProyectos.forEach(function(val,index){
      if(igualarStringBuscar(val.nombre).indexOf(trabNombre) != -1 || 
	 igualarStringBuscar(val.apellido).indexOf(trabNombre) != -1 ||
	 igualarStringBuscar(val.nroDocumento).indexOf(trabNombre) != -1){
         $("#trproy"+val.id).show();
      }else{
	 $("#trproy"+val.id).hide();
      }
   }); 
}

function reiniciarFiltroTrabProyecto(){
	listFullTrabajadoresProyectos.forEach(function(val,index){ 
			$("#trproy"+val.id).show(); 
	});
	$("#buscarTrabProy").val("").focus();
	$(".camposFiltroTabla").hide();
	$("#wrapperTrabProy").show();
	$("#wrapTrabProyecto").show();
}

function iniciarFiltroTrabProyecto(){
	$(".camposFiltroTabla").show();
	$("#wrapperTrabProy").hide();
	
	$("#btnIniciarFiltro").hide();
	$("#btnAplicarFiltro").show();
	
	$("#wrapTrabProyecto").hide();
}

function aplicarFiltroTrabProyecto(){
   $(".camposFiltroTabla").hide();
   $("#wrapperTrabProy").show();
   $("#btnAplicarFiltro").hide();
   $("#btnIniciarFiltro").show();
   $("#wrapTrabProyecto").show();
	
   var listAplicados = $("#selMultipleTrabProy").val();
	
   if(listAplicados == null){
      reiniciarFiltroTrabProyecto();
      return;
   } 
	
   listFullTrabajadoresProyectos.forEach(function(val,index){
      var searchExam = (listAplicados.indexOf("1") != -1);
      var searchSctr = (listAplicados.indexOf("2") != -1);
      var searchInduccion = (listAplicados.indexOf("3") != -1);
      var searchCargo = (listAplicados.indexOf("4") != -1);
      var searchRegistro = (listAplicados.indexOf("6") != -1);
      var searchEpp = (listAplicados.indexOf("8") != -1);
      var searchHojaVida = (listAplicados.indexOf("100") != -1);
      var searchHabilitado = (listAplicados.indexOf("0") != -1);
      var searchSiHabilitado = (listAplicados.indexOf("1000") != -1);
		
      var hasSiHabilitado,hasHabilitado,hasExamen,hasSctr,hasEpp,
          hasInduccion=true,hasCargo,hasTreg,hasHojaVida=true;
      //
      var verifObj=verificarTrabajadorContratistaHabilitado(val);
		
      if(proyectoObj.evaluacionManual == 0){
			
      }else{
         verifObj.isHabilitado = (val.notaManual == 1?true:false);
      }
		
      hasHabilitado = (searchHabilitado?(!verifObj.isHabilitado?false:true):false);
      //
      hasSiHabilitado = (searchSiHabilitado?(verifObj.isHabilitado?false:true):false);
      //
      hasExamen = (searchExam?(val.notaExamenMedico != 1?false:true):false);
	
      hasSctr = (searchSctr?(val.notaSctr != 1?false:true):false);
      //
      hasEpp = (searchEpp?(val.notaEpp != 1?false:true):false);
      //
      hasInduccion = (searchInduccion?(val.notaInduccion != 1?false:true):false);
      //
      hasCargo = (searchCargo?(val.notaCargo != 1?false:true):false);
      //
      hasTreg = (searchRegistro?(val.notaRegistro != 1?false:true):false);
      //
      if(searchHojaVida){
         if(val.evaluacionHojaVida == null){
	    hasHojaVida = false;
         }else{
	    if(val.evaluacionHojaVida.fecha == null){
	       hasHojaVida=false;
	    }else{
	       if(val.evaluacionHojaVida.tipo.id == 1){
		  hasHojaVida = true;
	       }else{
		  hasHojaVida = false;
	       }
	    }
         }
      }else{
         hasHojaVida = false;
      }
		
      if(!hasHabilitado && !hasSiHabilitado && !hasExamen && !hasSctr && !hasEpp && 
	 !hasInduccion && !hasCargo && !hasTreg && !hasHojaVida){
         $("#trproy"+val.id).show();
      }else{
         $("#trproy"+val.id).hide();
      }
   });	
}

function ocultarConsolidadoProyectoFijoExamenesTrabajadores(){
   $("#modalConsolidadoProyectoFijoExamenesTrabajadores").modal("hide");
}

function consolidadoProyectoFijoExamenesTrabajadores(){
   $("#modalConsolidadoProyectoFijoExamenesTrabajadores").remove();  
    
   var contenido = "";
     
   var listContenido = [];
 	
   var listContenido=[
      {sugerencia:"",label:"Proyecto asignado",inputForm:proyectoObj.titulo},
      {sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divTrabajadoresProyFijoAsig"},
	   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
	   {sugerencia:"",label:"Fecha de trabajo",inputForm:"<input type='date' id='fechaReferenciaProyFijoAsig' class='form-control'>"},
	   {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",label:"Detalle de la actividad",
       inputForm:"<textarea class='form-control' id='textAreaDetalleProyFijoAsig' rows='5'></textarea>",
       divContainer:""},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",
       label:"<button class='btn btn-danger' type='button' style='font-size:18px;' " +
       		     "onclick='ocultarConsolidadoProyectoFijoExamenesTrabajadores()'>" +
 	        "<i class='fa fa-times'></i> Cancelar" +
 	     "</button>",
       inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' " +
            		 "onclick='descargarConsolidadoProyectoFijoExamenesTrabajadores()'>" +
            	    "<i class='fa fa-download'></i> Descargar" +
            	 "</button>"}
   ];
 	    
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var modalOptions={
      id: "modalConsolidadoProyectoFijoExamenesTrabajadores",
      nombre: "<i class='fa fa-download'></i> Valores consolidado Proyecto - trabajadores <br>",
      contenido: "<div class='eventoGeneral'>"+contenido+"</div>"
   };
 	
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var hoy = getSession("fechaHoyOrdenInversoTexto");

	$("#fechaReferenciaProyFijoAsig").val(hoy);
       
   filtrarTrabajadoresProyectoFijoAsignado();
   $("#modalConsolidadoProyectoFijoExamenesTrabajadores").modal("show");
}

var listTrabajadoresProyectoAsignado = [];

function filtrarTrabajadoresProyectoFijoAsignado(){
   var dataParamAux={ 
      proyectoId: proyectoObj.id
   }; 
     
   callAjaxPost(URL+'/contratista/proyecto_asignado/trabajadores',dataParamAux,function(data){
      listTrabajadoresProyectoAsignado = data.listTrabajadoresProyectoAsignado;
        
      crearSelectOneMenuObligMultipleCompleto("selMulTrabajadoresProyectoFijoAsignado","",
	 listTrabajadoresProyectoAsignado,"id","nombre","#divTrabajadoresProyFijoAsig","Todos");   
   });
}

function descargarConsolidadoProyectoFijoExamenesTrabajadores(){
	var campoVacio = true;

	var fechaReferencia = $("#fechaReferenciaProyFijoAsig").val();

	if(fechaReferencia.length == 0){
		mensajeUx = "<label>Debe ingresar la fecha de referencia</label>";campoVacio = false;
	}

	if(campoVacio){
		var detalleActividad = $("#textAreaDetalleProyFijoAsig").val();

		var listTrabajadoresProAsiId = [];
		var trabProyAsigId = $("#selMulTrabajadoresProyectoFijoAsignado").val();

		if(trabProyAsigId != null && trabProyAsigId.length > 0){
			trabProyAsigId.forEach(function(val){
				listTrabajadoresProAsiId.push(parseInt(val));
			});
		}

		var fechaReferenciaTexto = convertirFechaNormal(fechaReferencia);

		window.open(URL+"/contratista/consolidado/proyecto_asignado_trabajadores?"+"proyectoAsignadoId="+proyectoObj.id +
			"&contratistaId="+proyectoObj.postulante.contratista.id+"&detalleActividad="+detalleActividad+"&empresaId="+getSession("gestopcompanyid") +
			"&tipoContratistaId="+proyectoObj.postulante.contratista.tipoContratistaId+"&listTrabajadoresProAsiId="+(listTrabajadoresProAsiId.length == 0?"0":listTrabajadoresProAsiId) +
			"&fechaReferencia="+fechaReferencia+"&fechaReferenciaTexto="+fechaReferenciaTexto,'_blank');

		$("#modalConsolidadoProyectoFijoExamenesTrabajadores").modal("hide");$("#modalConsolidadoProyectoFijoExamenesTrabajadores").remove();
	}else{
		$("#modalConsolidadoProyectoFijoExamenesTrabajadores").modal("hide");
		mensajesUx(mensajeUx,2,"","AvisoCompletarCampos");

		$("#modalMensajeUxAvisoCompletarCampos").on("hidden.bs.modal",function(){
			$("#modalConsolidadoProyectoFijoExamenesTrabajadores").modal("show");
		});
	}
}

function generarFotocheckCodigoQrTrabajadorContratista(acceso){
   var trabContratistaObj = (parseInt(acceso) == 1?trabContVistaAdminObj:objTrabajadorContratista);

   var dataParam={
      id:trabContratistaObj.id,contenidoCodigoQr:URL+"/pages/consultas.html?idContratista="+trabContratistaObj.contratistaId +
         "&idTrabajadorContratista="+trabContratistaObj.id,bucketNombre:BUCKETAMAZONS3
   };

   var registrarCodigoQr = (trabContratistaObj.evidenciaCodigoQrNombre.length == 0?1:0);
   
   callAjaxPostSimpleVersionDos(registrarCodigoQr,URL+"/contratista/trabajador/codigo_qr/save",dataParam,1,1,function(data){
      switch(data.CODE_RESPONSE){
	 case "05":  
	    window.open(URL+"/contratista/trabajador/foto_check?id="+trabContratistaObj.id,"_blank");
	   
	    break;
						
	 default:
	    alert("Ocurrió un error al generar el código QR");
	}
   });
}

var listTrabContratistasTotal=[],listTrabContratistasTotalBuscador=[];
var proyectoAsignadoAuxObj,busquedaActivaConTrabContHabProy,numPaginaActualConTrabContHabProy;

function ocultarConsolidadoTrabContratistaHabilitadosProyecto(){
	$("#modalConsolidadoTrabContHabProy").modal("hide");
}

function verConsolidadoTrabContratistaHabilitadosProyecto(pIndex){
	$("#modalConsolidadoTrabContHabProy").remove();

	proyectoAsignadoAuxObj = listFullProyectoSeguridad[pIndex];

	var contenido = "";

	var buttonVolver =
		"<button type='button' id='btnOcultarConTrabContHabProy' class='btn btn-info' style='margin-right:5px' " +
		        "onclick='ocultarConsolidadoTrabContratistaHabilitadosProyecto()' title='Regresar a la vista principal'>" +
		    "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
		"</button>";

	var buttonGuardar =
		"<button type='button' class='btn btn-success' style='margin-right:5px' onclick='guardarConsolidadoTrabContratistaHabilitadosProyecto()' title='Guardar.'>" +
		    "<i class='fa fa-floppy-o fa-2x'></i>" +
		"</button>";

	var buttonCheckTodo =
		"<button class='btn btn-success' onclick='opcionTodosConsolidadoTrabContratistaHabilitadosProyecto(1)' " +
		        "title='Marcar todas las filas con un check.' style='margin-right:5px'>" +
			"<i class='fa fa-check fa-2x'></i>" +
		"</button>";

	var buttonCheckNada =
		"<button class='btn btn-success' onclick='opcionTodosConsolidadoTrabContratistaHabilitadosProyecto(0)' " +
			    "title='Desmarcar todas las filas con un check.' style='margin-right:5px'>" +
			"<i class='fa fa-times fa-2x'></i>" +
		"</button>";

	var buttonImportExcel =
		"<button type='button' class='btn btn-info' onclick='verImportSmartEstadoTrabContratistaProyecto()' " +
		        "title='Import - asignar trabajadores contratista' style='margin-right:5px'>" +
			"<i class='fa fa-upload fa-2x'></i> <i class='fa fa-info'></i>" +
		"</button>";

	var buttonFlechas =
		"<span id='indicadorPaginaParcialAuxConTrabContHabProy' style='margin:5px;margin-top:10px;'>" +
		    "<a id='flechaIzquierdaConTrabContHabProy'><img src='../imagenes/flecha_01.png' /></a>" +
		    " <em id='labelFlechasConTrabContHabProy'></em> " +
		    "<a id='flechaDerechaConTrabContHabProy'><img src='../imagenes/flecha_02.png' /></a>" +
		"</span>";

	var buscadorOpciones =
		"<button type='button' class='btn btn-success' id='btnResetBuscadorConTrabContHabProy' " +
		        "title='Refresh' onclick='reiniciarBuscadorConsolidadoTrabContratistaHabilitadosProyecto()' style='float:right;'>" +
		    "<i class='fa fa-refresh fa-2x'></i>" +
		"</button>" +
		"<button type='button' class='btn btn-success' onclick='aplicarBuscadorConsolidadoTrabContratistaHabilitadosProyecto()' " +
		        "style='float:right;margin-right:5px;' title='Buscar los registros cuyo N° documento, nombre o apellido " +
		        "del trabajador contratista coincidan con las palabras ingresadas.' id='btnAplicarBuscadorConTrabContHabProy'>" +
		    "<i class='fa fa-search fa-2x'></i>" +
		"</button>" +
		"<input placeholder='N° documento, nombre o apellido' class='form-control' id='valBuscarValorConTrabContHabProy' " +
		       "onkeypress='bloquearBotonEnter(this)' style='float:right;margin-right:5px;'>";

	var modalOptions={
		maxWidth:"90%",id:"modalConsolidadoTrabContHabProy",btnCerrarHabilitado:0,
		nombre:"<i class='fa fa-table'></i> Consolidado Trabajadores contratista habilitados > contratista '"+(proyectoAsignadoAuxObj.contratistaNombre.length > 30?
			proyectoAsignadoAuxObj.contratistaNombre.substring(0,29)+"...":proyectoAsignadoAuxObj.contratistaNombre)+"' > proyecto '"+(proyectoAsignadoAuxObj.titulo.length > 30?
			proyectoAsignadoAuxObj.titulo.substring(0,29)+"...":proyectoAsignadoAuxObj.titulo)+"'",
		contenido:
			"<div class='form-inline'>" +
			     buttonVolver+buttonGuardar+buttonCheckTodo+buttonCheckNada+buttonImportExcel+buttonFlechas+buscadorOpciones +
			"</div>" +
			"<div class='wrapper' id='wrapperConsolidadoTrabContHabProy'>" +
			    "<table id='tblConsolidadoTrabContHabProy' class='table table-striped table-bordered table-hover table-fixed'>" +
			        "<thead>" +
						"<tr>" +
							"<td class='tb-acc' style='width:80px'>¿Habilitado?</td>" +
							"<td class='tb-acc' style='width:300px'>Trabajador(a)</td>" +
							"<td class='tb-acc' style='width:120px'>Tipo Documento</td>" +
							"<td class='tb-acc' style='width:200px'>N° Documento</td>" +
						"</tr>" +
					"</thead>" +
					"<tbody></tbody>" +
				"</table>" +
			"</div>"};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	resizeDivWrapper("wrapperConsolidadoTrabContHabProy",190);
	cargarConsolidadoTrabContratistaHabilitadosProyecto();

	$("#flechaIzquierdaConTrabContHabProy").on('click',function(){
		numPaginaActualConTrabContHabProy = numPaginaActualConTrabContHabProy-1;
		cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();
	});

	$('#flechaDerechaConTrabContHabProy').on('click',function(){
		numPaginaActualConTrabContHabProy = numPaginaActualConTrabContHabProy+1;
		cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();
	});
}

var hashTrabContProyHabilitados;

function cargarConsolidadoTrabContratistaHabilitadosProyecto(){
	busquedaActivaConTrabContHabProy = 0,numPaginaActualConTrabContHabProy = 1;

	var dataParam={
		id:proyectoAsignadoAuxObj.contratistaId
	};

	callAjaxPostSimpleVersionDos(1,URL+'/contratista/proyecto/trabajadores_contratista',dataParam,1,0,function(data){
		if(data.CODE_RESPONSE == "05"){
			listTrabContratistasTotal = data.listTrabContratistasTotal;

			$("#tblConsolidadoTrabContAsig tbody tr").remove();

			hashTrabContProyHabilitados = new Map();

			if(proyectoAsignadoAuxObj.trabAsignadosActivosId.length != 0){
				var trabAsignadosActivosId = proyectoAsignadoAuxObj.trabAsignadosActivosId.split(",");

				trabAsignadosActivosId.forEach(function(val){
					hashTrabContProyHabilitados.set(parseInt(val),1);
				});
			}

			listTrabContratistasTotal.forEach(function(val,index){
				val.checkHabilitar = (hashTrabContProyHabilitados.get(val.id) == 1?1:0);
			});

			cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();

			goheadfixedY("#tblConsolidadoTrabContHabProy","#wrapperConsolidadoTrabContHabProy");
		}else{
			console.log("Error al cargar el consolidado - Trabajadores contratista habilitados");
		}
	});
}

function cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});
	$("#flechaIzquierdaConTrabContHabProy").show();$("#flechaDerechaConTrabContHabProy").show();

	listTrabContratistasTotal.forEach(function(val,index){
		var checkHabilitarAux = $("#checkHabilitarTrabContProy"+val.id).prop("checked");
		val.checkHabilitar = (checkHabilitarAux === undefined?val.checkHabilitar:(checkHabilitarAux?1:0));
	});

	var list = (busquedaActivaConTrabContHabProy == 0?listTrabContratistasTotal:listTrabContratistasTotalBuscador);
	var totalSize = list.length;
	var partialSize = 100;

	var numPaginaTotal = Math.ceil(totalSize/partialSize);

	var inicioRegistro = (numPaginaActualConTrabContHabProy*partialSize)-partialSize;
	var finRegistro = (numPaginaActualConTrabContHabProy*partialSize)-1;

	if(numPaginaTotal == 0){
		numPaginaTotal = 1;
	}

	$("#labelFlechasConTrabContHabProy").html("<label>"+numPaginaActualConTrabContHabProy+" de "+numPaginaTotal+"</label>");

	if(numPaginaActualConTrabContHabProy == 1){
		$("#flechaIzquierdaConTrabContHabProy").hide();
	}

	if(numPaginaActualConTrabContHabProy == numPaginaTotal){
		$("#flechaDerechaConTrabContHabProy").hide();
	}

	if(finRegistro >= totalSize){
		finRegistro = totalSize-1;
	}

	$("#tblConsolidadoTrabContHabProy tbody tr").remove();

	list.forEach(function(val,index){
		if(inicioRegistro <= index && index <= finRegistro){
			var checkTrabCont = "<input id='checkHabilitarTrabContProy"+val.id+"' type='checkbox' class='form-control' "+(val.checkHabilitar == 1?"checked":"")+">";
			var nombreCompleto = (val.apellido.length == 0 && val.nombre.length == 0?"------":((val.apellido.length == 0?"":val.apellido+", ") +
				(val.nombre.length == 0?"":val.nombre)));

			$("#tblConsolidadoTrabContHabProy tbody").append(
				"<tr id='trTrabContratista"+val.id+"'>" +
					"<td>"+checkTrabCont+"</td>" +
					"<td>"+nombreCompleto+"</td>" +
					"<td>"+val.tipoDocumento.nombre+"</td>" +
					"<td>"+val.nroDocumento+"</td>" +
				"</tr>");
		}
	});

	$.unblockUI();
}

function aplicarBuscadorConsolidadoTrabContratistaHabilitadosProyecto(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

	listTrabContratistasTotal.forEach(function(val,index){
		var checkHabilitarAux = $("#checkHabilitarTrabContProy"+val.id).prop("checked");
		val.checkHabilitar = (checkHabilitarAux === undefined?val.checkHabilitar:(checkHabilitarAux?1:0));
	});

	var valBuscarValorConTrabContHabProy = igualarStringBuscar($("#valBuscarValorConTrabContHabProy").val());
	listTrabContratistasTotalBuscador = [];busquedaActivaConTrabContHabProy = 1;numPaginaActualConTrabContHabProy = 1;

	listTrabContratistasTotal.forEach(function(val,index){
		if(igualarStringBuscar(val.apellido).indexOf(valBuscarValorConTrabContHabProy) != -1 ||
			igualarStringBuscar(val.nombre).indexOf(valBuscarValorConTrabContHabProy) != -1 ||
			igualarStringBuscar(val.nroDocumento).indexOf(valBuscarValorConTrabContHabProy) != -1){
			listTrabContratistasTotalBuscador.push(val);
		}
	});

	cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();
}

function reiniciarBuscadorConsolidadoTrabContratistaHabilitadosProyecto(){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

	listTrabContratistasTotal.forEach(function(val,index){
		var checkHabilitarAux = $("#checkHabilitarTrabContProy"+val.id).prop("checked");
		val.checkHabilitar = (checkHabilitarAux === undefined?val.checkHabilitar:(checkHabilitarAux?1:0));
	});

	$("#valBuscarValorConTrabContHabProy").val("").focus();
	busquedaActivaConTrabContHabProy = 0;numPaginaActualConTrabContHabProy = 1;

	cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();
}

function opcionTodosConsolidadoTrabContratistaHabilitadosProyecto(valorHabilitado){
	$.blockUI({message:'<img src="../imagenes/gif/ruedita.gif"></img> Cargando...'});

	listTrabContratistasTotal.forEach(function(val,index){
		val.checkHabilitar = parseInt(valorHabilitado);
	});

	$("#valBuscarValorConTrabContHabProy").val("").focus();
	busquedaActivaConTrabContHabProy = 0;numPaginaActualConTrabContHabProy = 1;

	$("#tblConsolidadoTrabContHabProy tbody tr").remove();

	cambiarPaginaConsolidadoTrabContratistaHabilitadosProyecto();
}

function guardarConsolidadoTrabContratistaHabilitadosProyecto(){
	var trabajadoresFinal = [];
	var textoTrabContratistaHabilitados = "";

	listTrabContratistasTotal.forEach(function(val){
		var checkHabilitarAux = $("#checkHabilitarTrabContProy"+val.id).prop("checked");
		var isHabilitado = (checkHabilitarAux === undefined?val.checkHabilitar:(checkHabilitarAux?1:0));

		if(isHabilitado == 1){
			trabajadoresFinal.push({id:val.id,isActivo:1});

			textoTrabContratistaHabilitados += (textoTrabContratistaHabilitados.length == 0?val.id:","+val.id);
		}else{
			trabajadoresFinal.push({id:val.id,isActivo:0});
		}
	});

	var dataParam={
		id:proyectoAsignadoAuxObj.id,contratistaId:parseInt(getSession("contratistaGosstId")),
		trabajadores:trabajadoresFinal,textoTrabContratistaHabilitados:textoTrabContratistaHabilitados
	};

	callAjaxPost(URL+'/contratista/proyecto/trabajadores/save',dataParam,function(data){
		switch(data.CODE_RESPONSE){
			case "05":
				$("#modalConsolidadoTrabContHabProy").modal("hide");

				mensajeUx="<label>Los trabajadores asignados al proyecto fueron actualizados.</label>";
				mensajesUx(mensajeUx,1,"","ActualizarVistaCont");


				$("#modalMensajeUxActualizarVistaCont").on("hidden.bs.modal",function(){
					marcarIconoModuloContratista(3);
				});

				break;

			default:
				console.log("Ocurrió un error al guardar la lista de trabajadores!");
		}
	});
}

var listOpcionImportEstTrabConProy=[
	{id:1,nombre:"Asignar trabajadores contratista"}
];

function ocultarImportSmartEstadoTrabContratistaProyecto(){
	$("#modalImportSmartEstTrabContProy").modal("hide");$("#modalConsolidadoTrabContHabProy").modal("show");
}

function verImportSmartEstadoTrabContratistaProyecto(){
	$("#modalConsolidadoTrabContHabProy").modal("hide");$("#modalImportSmartEstTrabContProy").remove();

	var textBackUp = "<a class='efectoLink' target='_blank' href='"+URL+"/contratista/backup/proyecto/trabajador_contratista_asignado?"+"proyectoId="+proyectoAsignadoAuxObj.id+"'>" +
			"<i class='fa fa-download'></i> Descargar" +
		"</a>";

	var selOpcionImportEstTrabContProy = crearSelectOneMenuOblig("selOpcionImportEstTrabContProy","",listOpcionImportEstTrabConProy,1,"id","nombre");

	var contenido = "";

	var listContenido=[
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Lista Backup:",inputForm:textBackUp,divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Opción import:",inputForm:selOpcionImportEstTrabContProy},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"Archivo Excel:",inputForm:"",divContainer:"divExcelImportEstTrabContProy"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",
		 label:"<button type='button' class='btn btn-danger' onclick='ocultarImportSmartEstadoTrabContratistaProyecto()' style='font-size:18px;'>" +
					"<i class='fa fa-times'></i> Cancelar" +
			   "</button>",
		 inputForm:"<button type='button' class='btn btn-success' style='float:right;font-size:18px;' onclick='confirmacionImportSmartEstadoTrabContratistaProyecto()'>" +
			 	       "<i class='fa fa-floppy-o'></i> Guardar" +
			       "</button>"}
	];

	listContenido.forEach(function (val){
		contenido += obtenerSubPanelModuloVersionDos(val);
	});

	var modalOptions={
		id:"modalImportSmartEstTrabContProy",nombre:"<i class='fa fa-file-excel-o'></i> Opciones - Trabajador contratista por proyecto (import)",
		btnCerrarHabilitado:0,contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
	};

	crearModalPrincipalUsuario(modalOptions,function(){},true,true);

	var options={
		container:"#divExcelImportEstTrabContProy",functionCall:function(){
			validacionSubirEvidencia("ImportSmartEstTrabContProy",bitsEvidenciaExamen,"modalImportSmartEstTrabContProy");
		},descargaUrl:"",esNuevo:true,idAux:"ImportSmartEstTrabContProy",evidenciaNombre:""
	};

	crearFormEvidenciaCompleta(options);
}

function cancelarImportSmartEstadoTrabContratistaProyecto(){
	$("#modalConfImportSmartEstTrabContProy").modal("hide");$("#modalImportSmartEstTrabContProy").modal("show");
}

function confirmacionImportSmartEstadoTrabContratistaProyecto(){
	$("#modalImportSmartEstTrabContProy").modal("hide");$("#modalConfImportSmartEstTrabContProy").remove();

	var campoVacio = true;

	var nombreExcel = $("#inputEviImportSmartEstTrabContProy").val();

	if(nombreExcel.length == 0){
		campoVacio = false;mensajeUx = "<label>Debe subir el excel para poder continuar.</label>";
	}else if(nombreExcel == "VOLVER A SUBIR"){
		campoVacio = false;mensajeUx = "<label>Debe volver a subir el excel.</label>";
	}

	if(campoVacio){
		var contenido = "";

		var opcionImpId = parseInt($("#selOpcionImportEstTrabContProy").val());

		var valOpcionImportAux = listOpcionImportEstTrabConProy.find(function(val1){return val1.id == opcionImpId}).nombre;

		var listContenido=[
			{sugerencia:"",anchoLabel:"col-sm-6",anchoDiv:"col-sm-6",label:"<i class='fa fa-check-square-o'></i> Opción import seleccionado",
			 inputForm:"<span style='color:blue;font-weight:bolder;'>"+valOpcionImportAux+"</span>"},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
			{sugerencia:"",anchoLabel:"",anchoDiv:"",
			 label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='cancelarImportSmartEstadoTrabContratistaProyecto()'>" +
					   "<i class='fa fa-times'></i> Cancelar" +
				   "</button>",
			 inputForm:"<button type='button' class='btn btn-success' style='font-size:18px;float:right;' onclick='enviarExcelImportSmartEstadoTrabContratistaProyecto()'>" +
					       "<i class='fa fa-check'></i> Aceptar" +
					   "</button>"}
		];

		listContenido.forEach(function(val){
			contenido += obtenerSubPanelModuloVersionDos(val);
		});

		var modalOptions={
			id:"modalConfImportSmartEstTrabContProy",nombre:"<i class='fa fa-bell'></i> Estimado usuario, por favor, confirmar la siguiente información:",
			btnCerrarHabilitado:0,contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
		};

		crearModalPrincipalUsuario(modalOptions,function(){},true,true);
	}else{
		mensajesUx(mensajeUx,2,"","AvisoCompletarImport");

		$("#modalMensajeUxAvisoCompletarImport").on("hidden.bs.modal",function(){
			$("#modalImportSmartEstTrabContProy").modal("show");
		});
	}
}

function enviarExcelImportSmartEstadoTrabContratistaProyecto(){
	guardarEvidenciaAuto(0,"fileEviImportSmartEstTrabContProy",bitsEvidenciaExamen,
	"/contratista/excel/proyecto/trabajador_contratista_asignado/masivo/save",function(data){
			$("#modalConfImportSmartEstTrabContProy").remove();

			mensajeUx= "<label style='text-align:left;word-break:break-all;'>"+data.mensaje+"</label>";
			mensajesUx(mensajeUx,4,"","ActualizarVistaModTrabCon");

			$("#modalMensajeUxActualizarVistaModTrabCon").on("hidden.bs.modal",function(){
				marcarIconoModuloContratista(3);
			});
		},"id",[
			{id:"contratistaId",value:proyectoAsignadoAuxObj.contratistaId},{id:"proyectoId",value:proyectoAsignadoAuxObj.id},
			{id:"opcionImpId",value:parseInt($("#selOpcionImportEstTrabContProy").val())}]);
}
