/**
 * 
 */
var textoBotonToggleContenido =
   "<button class='btn btn-success' onclick='cambiarDivSubContenido(this)'>" +
      "<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i>" +
   "</button>";

var textoBotonVolverContenido = 
   "<button class='btn btn-success' style='float:left' onclick='volverDivSubContenido(this)'>" +
      "<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i>" +
   "</button>";

var mensajeUx;

var listTipoAccMej=[
   {id:1,nombre:"Accion Correctiva"},
   {id:2,nombre:"Preventiva"},
   {id:3,nombre:"Correctiva"},
   {id:4,nombre:"Mejora"}
];

function cambiarDivSubContenido(obj,proyectoId){
   if(proyectoId != null){
      proyectoId = parseInt(proyectoId);
		
      listFullProyectoSeguridad.forEach(function(val,index){
         if(val.id == proyectoId){
	    proyectoObj = val;
         }
      });
   }
	
   $(obj).parent(".tituloSubList").parent(".divProyectoGeneral").siblings().find(".contenidoSubList").hide();
   $(obj).parent(".tituloSubList").siblings( ".contenidoSubList" ).toggle();	
}

function volverDivSubContenido(obj){
	
   $(".divListPrincipal>div").show();
	
   $("#editarMovilDocProy").hide();
   $("#editarMovilFormProy").hide();
   $("#editarMovilActivProy").hide();
   $("#editarMovilObsProy").hide();
   $("#editarMovilAuditoriaProy").hide();
   $("#editarMovilIncidentProy").hide();
   $("#editarMovilTrabProy").hide();
   $("#editarMovilExamen").hide();
   $("#editarMovilTrabProy").hide();
   $("#editarMovilInduccion").hide();
   $("#editarMovilHojaVidaTrab").hide();
   $(".contenidoFormVisible").hide();
	
   $("#subRealizarInspecciones").hide();
	
   $(".divCursoExamenMovil").hide();
	
   if(lastHeight>0){
      $(window).scrollTop(lastHeight-$("#barraMenu").height()-60);
      lastHeight=0;
   }
}

var menuDerecha=[
//   {id:1,icono:"fa-calendar",ident:"icoPendientes",onclick:"marcarIconoModuloContratista(1)",titulo:"Actividades",adicional:""},
   {id:4,icono:"fa-book",ident:"icoManual",onclick:"enlaceManualVistaContratista()",titulo:"Manual de uso",
    adicional:"",clase:"iconoLink"},
   {id:2,icono:"fa-user-circle",ident:"icoPerfil",onclick:"",titulo:"Perfil",adicional:"",
    clase:"iconoLink dropdown-toggle' data-toggle='dropdown"},
//   {id:3,icono:"fa-question-circle",ident:"icoPreguntas",onclick:"marcarIconoModuloContratista(14)",
//    titulo:"Consultas",adicional:"",clase:"iconoLink"}
];

var listipoexam=[
   {id:1,nombre:"Certificado Aptitud Médica"}
];

var menuFuncionesIzquierda=[];
var textoAyuda;

function marcarIconoModuloContratista(menuId,variableAux){
   $(document).scrollTop(0);
   var menuObject=[];
   
   menuFuncionesIzquierda.forEach(function(val,index){
      if(val.id == parseInt(menuId)){
         menuObject = val;
      }
   });
   
   textoAyuda = menuObject.textoAyuda;
	 
   $("#menuExplicativo").hide();
   $(".gosst-aviso").remove();
   $(".divContainerGeneral").show();
   $(".divListModulos").find("li").removeClass("activeMenu");
		
   switch(menuObject.id){
      case 28:
      case 29:
      case 78:
      case 85:
      case 105: 
         break;
      
      default:
	 $(".divListPrincipal").html("");
	 $(".divTituloFull").find("h4").html(menuObject.nombre)
         
	 break;
   }
		
   $(".divListModulos #liMenuContratista"+menuObject.id).addClass("activeMenu");
   
   var isPermitido=false;
   
   listaModulosPermitidos.forEach(function(val){
      var moduloPermitido = val.isPermitido;
			
      if(val.menuOpcionId == menuObject.moduloId && moduloPermitido == 1){
         isPermitido = true;
      }
 
      var numerSubModulos = val.subMenus;
			
      numerSubModulos.forEach(function(val1){
         var subModuloPermitido = val1.isPermitido;
				
	 if(val1.menuOpcionId == menuObject.moduloId && subModuloPermitido == 1){
	    isPermitido = true;
	 }
      });
   }); 
		
    if(isPermitido){
        switch(menuObject.id){
	        case 9:
	            crearFiltroInduccionesVirtuales(valoresFiltroInduccionesVirtuales);

				break;
			
	 case 1:
	    habilitarVistaActividadesContratista(null,variableAux);
	    break;
			
	 case 2:
	    habilitarProyectosContratista(4);
	    break;
			
	 case 3:
	    habilitarProyectosContratista(2);
	    break;
			
	 case 4:
	    habilitarProyectosContratista(3);
	    break;
			
	 case 5:
	    habilitarTrabajadoresContratista();
	    break;
			
	 case 6:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,1);
	    break;
			
	 case 7:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,2);
	    break;
			
	 case 8:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,8);
	    break;
			
	        case 33:
	            habilitarInduccionesEmpresaContratista();

			    break;
			
	 case 10:
//	    NOTA: En caso vuelva a utilizarse la sección, debe adaptarse la implementación de las categorías.
//	    habilitarCapacitacionOnlineUsuario();
	    
	    break;
			
	 case 11:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,4);
	    break;
			
	 case 12:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,6);
	    break;
			
	 case 13:
	    habilitarComunicadoContratista();
	    break;
			
	 case 14:
	    habilitarSugerenciasContratista();
	    break;
			
	 case 15:
	    habilitarPerfilContratista();
	    break;
			
	 case 16:
	    habilitarTrabajoHombresContratista();
	    break;
			
	 case 17:
	    crearFiltroObservacionesFast(valoresFiltroObservacionesFast);
	    break;
			
	 case 18: 
	    habilitarHojaQuimicaContratista(); 
	    break;
	    
	 case 19:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,15);
	    break;
	    
	 case 21:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,14);
	    break;
	    
	 case 23:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,16);
	    break;
			
	 case 24:
	    habilitarEquiposMoviles();
	    break;
			
	 case 25:
	    habilitarIzaje();
	    break;
			
	 case 27: 
	    habilitarSubContratista(); 
	    break;
			
	 case 28:
	 case 29:
	 case 78:
	 case 85:
	 case 105:
	    menuFuncionesIzquierda.forEach(function(val){
	       if(val.seccionPadreId == menuObject.id){
		  $(".divListModulos #liMenuContratista"+val.id).toggle();
		  $("#menuFigureti #liMenuContratista"+val.id).toggle();
	       }					
	    });
	    
	    break;
			
	 case 44:
	     crearFiltroHabilitarHojaVida(valoresFiltroHabilitarHojaVida);
	    
		 break;
	    
	 case 45:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,23);
            break;
            
	 case 46:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,24);
	    break;
	    
	 case 47:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,25);
	    break;
	    
	 case 48:
            habilitarAnalisisTrabajoSeguro();
            break;
            
	 case 49:
	    habilitarPermisoTrabajoAltoRiesgo();
	    break;
	    
	 case 50:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,34);
	    break;
	    
	 case 51:
	    habilitarDocumentosSst();
	    break;
	    
	 case 52:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,35);
            break;
            
	 case 53:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,36);
	    break;
	            
	 case 54:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,37);
	    break;
	            
	 case 55:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,38);
	    break;
	            
	 case 56:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,39);
	    break;
	            
	 case 57:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,40);
	    break;
	    
	 case 58:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,41);
            break;
		    
	 case 59:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,42);
	    break;
		    
	 case 60:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,43);
	    break;
	    
	 case 61:
	    habilitarHomologacionContratista();
	    break;
	    
	 case 62:
	    habilitarStatusContratista();
	    break;
	    
	 case 63:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,44);
            break;

	 case 64:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,45);
            break;

	 case 65:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,46);
            break;

	 case 66:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,47);
            break;

	 case 67:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,48);
            break;

	 case 68:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,49);
            break;

	 case 69:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,50);
            break;

	 case 70:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,51);
            break;

	 case 71:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,52);
            break;

	 case 72:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,53);
            break;

	 case 73:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,54);
            break;

	 case 74:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,55);
            break;

	 case 75:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,56);
            break;

	 case 76:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,57);
            break;

	 case 77:
            crearFiltroExamenContratista(valoresFiltroExamenesContratista,58);
            break;
            
	 case 79:
	    verRegistrosConductores();
	    
	    break;
	    
	 case 80:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,1);
		    
            break;
            
	 case 81:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,2);
		    
            break;
            
	 case 82:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,3);
		    
            break;
            
	 case 83:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,4);
		    
            break;
            
	 case 84:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,5);
		    
            break;
            
	 case 86:
	    verRegistrosVehiculosMaquinarias();
	    
	    break;
	    
	 case 87:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,1);
		    
            break;

	 case 88:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,2);
		    
            break;

	 case 89:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,3);
		    
            break;

	 case 90:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,4);
		    
            break;

	 case 91:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,5);
		    
            break;

	 case 92:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,6);
		    
            break;

	 case 93:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,7);
		    
            break;

	 case 94:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,8);
		    
            break;

	 case 95:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,9);
		    
            break;

	 case 96:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,10);
		    
            break;

	 case 97:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,11);
		    
            break;

	 case 98:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,12);
		    
            break;

	 case 99:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,13);
		    
            break;

	 case 100:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,14);
		    
            break;
            
	 case 101:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,59);
	     
	    break;
	     
	 case 102:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,60);
	     
	    break;
	     
	 case 103:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,61);
	     
	    break;
	    
	 case 104:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,6);
		    
            break;
            
	 case 106:
	    controlSecEquHerr.reiniciar();
	    verRegistrosEquiposHerramientas();
	    
	    break;
	    
	 case 107:
	    crearFiltroRegistrosDocumentoNivelEquipoHerramienta(valoresFiltroRegistrosDocumentoNivelEquipoHerramienta,1);
		    
            break;
            
	 case 108:
	    crearFiltroRegistrosDocumentoNivelEquipoHerramienta(valoresFiltroRegistrosDocumentoNivelEquipoHerramienta,2);
		    
            break;
            
	 case 109:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,63);
	     
	    break;

	 case 110:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,64);
	     
	    break;

	 case 111:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,65);
	     
	    break;
	    
	 case 112:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,7);
	    
	    break;
	    
	 case 113:
	    crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,8);
	     
	    break;
	    
	 case 114:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,15);
	     
	    break;
	    
	 case 115:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,67);
	     
	    break;
	     
	 case 116:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,68);
	     
	    break;

	 case 117:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,69);
	     
	    break;
	    
	 case 118:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,70);
	     
	    break;

	 case 119:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,71);
	     
	    break;

	 case 120:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,72);
	     
	    break;

	 case 121:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,73);
	     
	    break;

	 case 122:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,74);
	     
	    break;

	 case 123:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,75);
	     
	    break;

	 case 124:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,76);
	     
	    break;

	 case 125:
	    crearFiltroExamenContratista(valoresFiltroExamenesContratista,77);
	     
	    break;
	    
	 case 126:
            crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,16);
		     
            break;
            
	 case 127:
	    crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,17);
		     
	    break;

		  case 128:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,78);

			  break;

		  case 129:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,79);

			  break;

		  case 130:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,84);

			  break;

		  case 131:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,88);

			  break;

		  case 132:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,89);

			  break;

		  case 133:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,90);

			  break;

		  case 134:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,91);

			  break;

		  case 135:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,92);

			  break;

		  case 136:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,93);

			  break;

		  case 137:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,94);

			  break;

		  case 138:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,95);

			  break;

		  case 139:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,96);

			  break;

		  case 140:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,97);

			  break;

		  case 141:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,98);

			  break;

		  case 142:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,99);

			  break;

		  case 143:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,100);

			  break;

		  case 144:
			  crearFiltroExamenContratista(valoresFiltroExamenesContratista,101);

			  break;
			  
		  case 145:
		      crearFiltroSolicitudRegistroProyecto();

		      break;
		      
            case 146:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,102);

		break;
		
            case 147:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,103);

		break;
		
            case 148:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,104);

		break;
		
            case 149:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,105);

		break;
		
            case 150:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,106);

		break;
		
            case 151:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,107);

		break;
		
            case 152:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,108);

		break;
		
            case 153:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,109);

		break;
		
            case 154:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,110);

		break;
		
            case 155:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,111);

		break;
		
            case 156:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,112);

		break;
		
            case 157:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,113);

		break;
		
            case 158:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,114);

		break;
		
            case 159:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,115);

		break;
		
            case 160:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,116);

		break;
		
            case 161:
    	        habilitarProyectosContratista(1);
    	    
    	        break;
    	        
            case 162:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,117);

		break;
		
            case 163:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,118);

		break;
		
            case 164:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,119);

		break;
		
            case 165:
    	        crearFiltroRegistrosDocumentoNivelConductor(valoresFiltroRegistrosDocumentoNivelConductor,9);
    	     
    	        break;
    	        
            case 166:
    	        crearFiltroRegistrosDocumentoNivelVehiculoMaquinaria(valoresFiltroRegistrosDocumentoNivelVehiculoMaquinaria,18);
    		     
    	        break;
    	        
            case 167:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,123);

		break;
		
            case 168:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,124);

		break;
		
            case 169:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,125);

		break;
		
            case 170:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,126);

		break;
		
            case 171:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,127);

		break;
		
            case 172:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,128);

		break;
		
            case 173:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,129);

		break;
		
            case 174:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,130);

		break;
		
            case 175:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,131);

		break;
		
            case 176:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,132);

		break;
		
            case 177:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,133);

		break;
		
            case 178:
		crearFiltroExamenContratista(valoresFiltroExamenesContratista,134);

		break;
		
            case 179:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,137);

				break;
				
			case 180:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,138);

				break;
				
			case 181:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,139);

				break;
				
			case 182:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,140);

				break;
				
			case 183:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,141);

				break;
				
			case 184:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,142);

				break;
				
			case 185:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,143);

				break;
				
			case 186:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,144);

				break;
				
			case 187:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,145);

				break;
				
			case 188:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,146);

				break;
				
			case 189:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,147);

				break;
				
			case 190:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,148);

				break;
				
			case 191:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,149);

				break;
				
			case 192:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,150);

				break;
				
			case 193:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,151);

				break;
				
			case 194:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,152);

				break;
				
			case 195:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,153);

				break;
				
			case 196:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,154);

				break;
				
			case 197:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,155);

				break;
				
			case 198:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,156);

				break;
				
			case 199:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,157);

				break;
				
			case 200:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,158);

				break;
				
			case 201:
				crearFiltroExamenContratista(valoresFiltroExamenesContratista,159);

				break;
				
      }
   }else{
      verSeccionRestringida();
   }			
}

function verInformacionSeccionContratista(){
   mensajeUx = "<label>"+textoAyuda+"</label>";
   mensajesUx(mensajeUx,10,"");
}

var numProyectosTipo4 = 0,numProyectosTipo2 = 0,
    numProyectosTipo3 = 0;
var perfilContratista=[];

function verIndicadoresProyectos(functionCallBack){ 
	var dataParam={
			empresaId:getSession("gestopcompanyid"),
			contratistaId:getSession("contratistaGosstId")
			};
	callAjaxPost(URL + '/contratista/proyectos', dataParam, function(data) {
		perfilContratista=data.perfil;
		data.proyectos.forEach(function(val,index){
			var condicionPostulante=true;
			if(val.postulante.contratista==null){
				condicionPostulante=true;
			}else {
				if(val.postulante.contratista.id!=getSession("contratistaGosstId")){
					condicionPostulante=false;
				}
				if(val.postulante.contratista.id==null){
					condicionPostulante=true;
				}
			}  
			var condicionAgregar4=(
					val.postulante.asignacion!=1 && val.estado.id==1); 
			if(condicionAgregar4 && condicionPostulante){
				numProyectosTipo4++;
			} 
			var condicionAgregar2=( 
						(val.estado.id==2
								&& val.postulante.asignacion==1) ); 
			if(condicionAgregar2 && condicionPostulante){
				numProyectosTipo2++;
			} 
			var condicionAgregar3=( 
						(val.estado.id==3
								&& val.postulante.asignacion==1) ); 
			if(condicionAgregar3 && condicionPostulante){
				numProyectosTipo3++;
			}
		});
		$("#menuFigureti").html("<ul class='list-group'></ul>");
		menuFuncionesIzquierda.forEach(function(val){
		    if(val.id==15){
			val.titulo="Perfil "+getSession("gestopusername").substr(0,20);
		    }
		$(".divListModulos").find("ul").append("" +
				"<li class='list-group-item' id='liMenuContratista"+val.id+"' onclick='marcarIconoModuloContratista("+val.id+")'>" +
				"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
				"<span></span></i> "+val.titulo+
				"</li>");
		$("#menuFigureti").find("ul").append("" +
				"<li class='list-group-item' style='color: #2e9e8f'  id='liMenuContratista"+val.id+"' onclick='marcarIconoModuloContratista("+val.id+")'>" +
				"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
				"<span  ></span></i> "+val.titulo+
				"</li>");
		});
		$("#menuMovilGosst").on("click",function(){
			$(".divContainerGeneral").toggle();
		});
		if(perfilContratista==null){
			$(".divListModulos #liMenuContratista2").remove();
			$(".divListModulos #liMenuContratista4").remove();
			
			$("#menuFigureti").find("#liMenuContratista2").remove();
			$("#menuFigureti").find("#liMenuContratista4").remove();
		}else{
			$(".divListModulos ul").html("");
			$("#menuFigureti").html("<ul class='list-group'></ul>");
			perfilContratista.secciones.forEach(function(val){
			$(".divListModulos").find("ul").append("" +
					"<li class='list-group-item' id='liMenuContratista"+val.id+"' onclick='marcarIconoModuloContratista("+val.id+")'>" +
					"<i class='fa "+val.icono+" ' aria-hidden='true'>"+
					"<span  ></span></i> "+val.nombre+""+
					"</li>");
			$("#menuFigureti").find("ul").append("" +
					"<li class='list-group-item' style='color: #2e9e8f'  id='liMenuContratista"+val.id+"' onclick='marcarIconoModuloContratista("+val.id+")'>" +
					"<i class='fa "+val.icono+" ' style='width:16px;' aria-hidden='true'>"+
					"<span  ></span></i> "+val.nombre+
					"</li>");
			});
			
			
		}
		if(parseInt(getSession("isProyectoSimple"))==1 ){
			$(".divListModulos #liMenuContratista12").remove();
			$("#menuFigureti").find("#liMenuContratista12").remove();
		}
		$(".divListModulos #liMenuContratista2").prepend(" ("+numProyectosTipo4+") ")
		$(".divListModulos #liMenuContratista3").prepend(" ("+numProyectosTipo2+") ")
		$(".divListModulos #liMenuContratista4").prepend(" ("+numProyectosTipo3+") ");
			if(functionCallBack != null){
			    functionCallBack();
			}
		});
}

//var seccionContratistaMod = new Map([
//   [3,"Documentos asignados a proyectos en curso"],[4,"Documentos asignados a proyectos completados"],
//   [28,"Documentos a nivel trabajador - contratista"],[29,"Documentos a nivel empresa"]
//]);

var datosEmpresaAux={},hasBloqueoSeccion,activoTipoExam79,activoCorreoHabilitacionMedica;

function verLateralesFijosContratista(){ 
   // *** Barra de Menú ***    
   $("#wrapperList").remove(); $("#divListaTabs").remove();	
   $("#menuPrincipal").html("" +
//    "<input placeholder='Buscar ' type='text' class='buscadorGosst' style='width:280px'>" +
      "<h5> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;" +
      "Tu Gestor Online de Seguridad y Salud en el Trabajo te da la Bienvenida</h5>")
   .css({color:"white"});
   
   $(".buscadorGosst")
   .css({"margin-top": "8px",
	 "border-radius": "21px",
	 "color": "black",
	 "background-color": "#ffffff"});
   
   $(".navbar")
   .css({"min-height": "48px",
         "margin-bottom": "0px",
         "top":"0px"});

   var logo = $("#logoMenu");
	
   logo.css({"background-color":"#2e9e8f",
             "margin-top":"-18px"})
   .attr("onclick","volverMenuInicio()");
	
   $("#barraMenu").css({"position": "fixed",
                        "width": "100%"});
   $("#barraMenu").find(".navbar-right").html("<ul></ul> ");
   
   // ***********************
   menuDerecha.forEach(function(val,index){
      $("#barraMenu").find(".navbar-right").append(
         "<li id='"+val.ident+"' title='"+val.titulo+"'>" +
            "<a onclick='"+val.onclick+"' class='"+val.clase+"'>" +
               "<i class='fa "+val.icono+" fa-2x' aria-hidden='true'>" +
	       "</i> "+(val.id != 2?"":getSession("gestopusername").substr(0,12)+".") +
            "</a>" +
         "</li>");
   });
   
   $("#icoPerfil").append(
      "<ul class='dropdown-menu' style='color:white'>" +
         "<li onclick='marcarIconoModuloContratista(15)'>" +
	    "<a><i class='fa fa-user-o' aria-hidden='true'></i> Perfil</a>" +
	 "</li>" +
	 "<li onclick='marcarIconoModuloContratista(15)'>" +
	    "<a><i class='fa fa-exchange' aria-hidden='true'></i> Cambiar Contraseña</a>" +
	 "</li>" +
	 "<li class='dropdown-divider' role='presentation'></li>" +
	 "<li onclick='cerrarSesionVistaContratista()'>" +
	    "<a><i class='fa fa-power-off' aria-hidden='true'></i> Salir</a>" +
	 "</li>" +
      "</ul>" +
      "</div>");
   
   var listInfoAdicional=[
          {id:"infoTrabs",nombre:"Trabajadores",faIcon:"users",
           infoAyuda:"info de ayuda 123"},
          {id:"infoDoc",nombre:"Documentos",faIcon:"files-o",
           infoAyuda:"Documentos que necesita revisar el contratante antes de aprobar el proyecto al contratista"},
          {id:"infoPlan",nombre:"Programa SSOMA",faIcon:"sort-amount-asc",
           infoAyuda:"info de ayuda 2"},
          {id:"infoForm",nombre:"Capacitaciones Online",faIcon:"graduation-cap",
           infoAyuda:"info de ayuda 3"},
          {id:"infoObs",nombre:"Observaciones",faIcon:"eye",
           infoAyuda:"info de ayuda 7"},
          {id:"infoAudi",nombre:"Auditorías",faIcon:"check-square-o",
           infoAyuda:"info de ayuda 4"},
          {id:"infoIncid1",nombre:"Incidentes",faIcon:"warning",
           infoAyuda:"info de ayuda 6"},
          {id:"infoIncid2",nombre:"Matriz de riesgos",faIcon:"crosshair",
           infoAyuda:"info de ayuda 612"},
          {id:"infoIncid3",nombre:"Cargo RISST",faIcon:"warning",
           infoAyuda:"info de ayuda 62"}
                         ];
	
   var textInfoAdicional = "";
    
   listInfoAdicional.forEach(function(val,index){
      textInfoAdicional+=
         "<div class='panel panel-default'>"+
	    "<div class='panel-heading' data-toggle='collapse' data-parent='#accordion' href='#"+val.id+"'>"+
	       "<h4 class='panel-title'>"+
	          "<i aria-hidden='true' class='fa fa-"+val.faIcon+"'></i>"+val.nombre+
	       "</h4>"+
	    "</div>"+
	    "<div id='"+val.id+"' class='panel-collapse collapse'>"+
	       "<div class='panel-body'>"+
	           val.infoAyuda+ 
	       "</div>"+
	    "</div>"+
	 "</div>"});
	
   $("body").find("#tabProyectos").remove();
   
   $("body").append(
      "<div class='divTituloFull'>" +
         "<div class='divTituloGeneral'>" +
   	    "<h4>Mis Actividades SST</h4>" +
   	 "</div>" +
      "</div>" + 
      "<div class='divContainerGeneral'>" +
         "<div class='divListModulos'>" +
	    "<ul class='list-group'></ul>" +
	 "</div>" +
	 "<div class='divListPrincipal'></div>" +
	 "<div class='divListSecundaria'>" +
            "<div id='divObjetivos' style='min-height:120px'>" +
               "<div class='subDivTitulo'>" +
	          "<i aria-hidden='true' class='fa fa-info-circle'></i> Información adicional" +
	       "</div>" +
	       "<div class='subDivContenido'>" +
	          "<div class='panel-group' id='accordionContratista'>" + 
		      textInfoAdicional+
		  "</div>" +
	       "</div>" +
	    "</div>" +
         "</div>" +
      "</div>");

    hasBloqueoSeccion = 1;activoTipoExam79 = 0;activoCorreoHabilitacionMedica = 0;
   
    var dataParam={
        empresaId:parseInt(getSession("gestopcompanyid")),contratistaId:getSession("contratistaGosstId")
    };
	
   callAjaxPost(URL+"/contratista/perfiles",dataParam,function(data){
      menuFuncionesIzquierda = data.seccion;
      datosEmpresaAux = data.empresa;
   
      $("#menuFigureti").html("<ul class='list-group'></ul>");
      
      menuFuncionesIzquierda.forEach(function(val){
//	 val.nombre = (seccionContratistaMod.has(val.id)?seccionContratistaMod.get(val.id):val.nombre);
	  
         var textOpcionMenu = 
            "<li class='list-group-item' id='liMenuContratista"+val.id+"' onclick='marcarIconoModuloContratista("+val.id+")'>" +
                (val.id == 50?"<img src='../imagenes/iconos/fa-syringe-blanco.png' width='20px' height='20px'> ":
                 "<i class='fa "+val.icono+"' style='width:16px;' aria-hidden='true'></i> ")+val.nombre +
	    "</li>";
					
         $(".divListModulos").find("ul").append(textOpcionMenu);
         $("#menuFigureti").find("ul").append(textOpcionMenu);
					
         if([28,29,78,85,105].includes(val.id)){
	    $(".divListModulos #liMenuContratista"+val.id).append(" <i class='fa fa-plus-circle'></i>");
	    $("#menuFigureti #liMenuContratista"+val.id).append(" <i class='fa fa-plus-circle'></i>");
         }
         
         if(parseInt(getSession("gestopcompanyid")) == 647 && ([3,28,29].includes(val.id))){
 	    $(".divListModulos #liMenuContratista"+val.id).addClass("subMenuImportantInkacrops").show();
 	    $("#menuFigureti #liMenuContratista"+val.id).addClass("subMenuImportantInkacrops").show();
 	 }else if([3,28,29,78,85,105,161].includes(val.id)){
 	    $(".divListModulos #liMenuContratista"+val.id).addClass("subMenuImportantGeneral").show();
 	    $("#menuFigureti #liMenuContratista"+val.id).addClass("subMenuImportantGeneral").show(); 
 	 }
					
         if(val.numAlerta > 0){
	    $(".divListModulos #liMenuContratista"+val.id).prepend("<div class='alertaMenu'>"+val.numAlerta+"</div>");
	    $("#menuFigureti #liMenuContratista"+val.id).prepend("<div class='alertaMenu'>"+val.numAlerta+"</div>");
         }
						
         if(val.seccionPadreId > 0){
	    $(".divListModulos #liMenuContratista"+val.id).remove();
	    $("#menuFigureti #liMenuContratista"+val.id).remove();

	    $(".divListModulos #liMenuContratista"+val.seccionPadreId).after(textOpcionMenu);
	    $("#menuFigureti #liMenuContratista"+val.seccionPadreId).after(textOpcionMenu);

	    $(".divListModulos #liMenuContratista"+val.id).addClass("subMenu").hide();
	    $("#menuFigureti #liMenuContratista"+val.id).addClass("subMenu").hide();
         }

		    if(val.id == 129){
                if([741,747,775].includes(parseInt(getSession("gestopcompanyid")))){
		      		activoTipoExam79 = 1;
		  		}else{
				    activoCorreoHabilitacionMedica = 1;
				}
			}
        });
				 
      $("#menuMovilGosst").on("click",function(){
         $(".divContainerGeneral").toggle();
      }); 

      if(parseInt(getSession("tipoContratistaGosstId")) == 4){
	 marcarIconoModuloContratista(15);  
      }else{
	 marcarIconoModuloContratista(62); 
      }
      
      $(".divListSecundaria").html("");

      // P-A00018: aviso destacado de los comunicados sin notificar (solo si la contratista tiene la seccion Comunicados)
      if(typeof cargarAvisoComunicados === "function" && $.grep(menuFuncionesIzquierda,function(s){return s.id == 13;}).length > 0){
         cargarAvisoComunicados();
      }
   });
}

function alterarTextoBoton(obj,pId,auxId,nombreObjeto){
   var boolCambiarFinal = true;
	
   switch(pId){
      case 1:
         boolCambiarFinal = $(".detalleDocumentosProyecto").is(":visible");
         break;
	
      case 2:
	 boolCambiarFinal = $(".detalleTrabajadoresProyecto").is(":visible");
	 break;
	
      case 3:
	 boolCambiarFinal = $(".detalleActividadesProyecto"+auxId).is(":visible");
	 break;
	
      case 4:
	 boolCambiarFinal = $(".detalleFormacionProyecto").is(":visible");
	 break;
	
      case 5:
	 boolCambiarFinal = $(".detalleObservacionesProyecto").is(":visible");
	 break;
	
      case 6:
	 boolCambiarFinal = $(".detalleAuditoriasProyecto").is(":visible");
	 break;
	
      case 7:
	 boolCambiarFinal = $(".detalleIncidentesProyecto").is(":visible");
	 break;
	
      case 8:
	 boolCambiarFinal = $(".detalleInduccionProyecto").is(":visible");
	 break;
	
      case 9:
	 boolCambiarFinal = $(".detalleIpercProyecto").is(":visible");
	 break;
	
      case 10:
	 boolCambiarFinal = $(".detalleObservacionesContratista").is(":visible");
	 break;
	
      case 11:
	 boolCambiarFinal = $(".detalleObservacionesColaborador").is(":visible");
	 break;
	
      case 12:
	 boolCambiarFinal = $(".detalleInspeccionProyecto").is(":visible");
	 break;	
   }

    if(!boolCambiarFinal){
        $(obj).html("Ver "+nombreObjeto+" <i class='fa fa-angle-double-down' aria-hidden='true'></i>");
    }else{
        $(obj).html("Ocultar "+ nombreObjeto+" <i class='fa fa-angle-double-up' aria-hidden='true'></i>");
    }
}

var indexFunction;

function toggleMenuOpcionProy(obj,pindex,menu){ 
    indexFunction = pindex;       
   
    $(obj).parent(".containerProy"+menu+pindex).find("ul").toggle();
    $(obj).parent(".containerProy"+menu+pindex).siblings().find("ul").hide();
	
    funcionalidadOpcProy.forEach(function(opcion){
        if(opcion.menu !== menu){
            $(".containerProy"+opcion.menu+pindex+" .listaGestionGosst").hide();
        }
    });
}

var funcionalidadOpcProy=[
    {menu:"Trabajadores",
     opcion:[
         {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Modificar",
	      functionClick:function(data){//nuevoTrabProyecto(indexFunction);
			  verConsolidadoTrabContratistaHabilitadosProyecto(indexFunction)}},
         {id:"opcVerTbl",nombre:"<i class='fa fa-table'></i> Ver Tabla Resumen",
		  functionClick:function(data){verTablaResumenTrabProyecto(indexFunction);}},
         {id:"opcConsolidadoProyectoTrabAsig",nombre:"<i class='fa fa-file-o'></i> Consolidado Proyecto - Trabajadores",
	      functionClick:function(data){consolidadoProyectoFijoExamenesTrabajadores();}}]},
    {menu:"ActSSOMA",
    opcion:[
       {id:"opcAgregar",
	nombre:"<i class='fa fa-plus-square'></i> Agregar Actividad",
	functionClick:function(data){
	   nuevoActProyecto(indexFunction,1);}}
    ]},
   {menu:"PlanEmergencia",
    opcion:[
       {id:"opcAgregar",
        nombre:"<i class='fa fa-plus-square'></i> Agregar P. Emergencia",
        functionClick:function(data){
           nuevoActProyecto(indexFunction,2);}}
    ]},
   {menu:"PlanResiduo",
    opcion:[ 
       {id:"opcAgregar",
	nombre:"<i class='fa fa-plus-square'></i> Agregar P. Residuo",
	functionClick:function(data){
	   nuevoActProyecto(indexFunction,4);}}
    ]},
   {menu:"DocSSOMA",
    opcion:[ 
       {id:"opcAgregar",
	nombre:"<i class='fa fa-plus-square'></i> Agregar Doc. SSOMA",
	functionClick:function(data){
	   nuevoActProyecto(indexFunction,5);}}
    ]},
   {menu:"ObsContratista",
    opcion:[
       {id:"opcAgregarReporte",
	nombre:"<i class='fa fa-plus-square'></i> Agregar rep. interno",
	functionClick:function(data){
	   nuevoObservacionInternaContratista(indexFunction);}},
       {id:"opcVerTabla",
	nombre:"<i class='fa fa-table'></i> Ver Tabla Resumen",
	functionClick:function(data){
	   verTablaResumenObsProyecto(indexFunction);}}
    ]},
    {menu:"ObsCliente",
     opcion:[
        {id:"opcAgregar",
         nombre:"<i class='fa fa-plus-square'></i> Agregar Observacion",
         functionClick:function(data){
            nuevaObservacionContratista(indexFunction);}}
     ]},
    {menu:"Incidente",
     opcion:[
        {id:"opcAgregar",
         nombre:"<i class='fa fa-plus-square'></i> Agregar Accidente / Incidente",
         functionClick:function(data){
            nuevoIncidenteProyecto(indexFunction);}}
     ]},
    {menu:"Matriz",
     opcion:[
        {id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar",
	 functionClick:function(data){
	    nuevoIpercProyecto(indexFunction);}},
        {id:"opcVerTabla",
         nombre:"<i class='fa fa-table'></i> Ver Tabla",
         functionClick:function(data){
            verTablaIpercProyecto(indexFunction);}},
	{id:"opcImpDatos",
	 nombre:"<i class='fa fa-upload'></i> Importar Datos",
         functionClick:function(data){
	    importarDetalleIpercProyecto(indexFunction);}}
     ]},
    {menu:"PlanCovid",
     opcion:[
        {id:"opcAgregar",
         nombre:"<i class='fa fa-plus-square'></i> Agregar P. COVID",
         functionClick:function(data){
            nuevoActProyecto(indexFunction,6);}}
     ]},
    {menu:"MatrizRiesgoSimple",
     opcion:[
        {id:"opcAgregar",
         nombre:"<i class='fa fa-plus-square'></i> Agregar Documento",
         functionClick:function(data){
	    nuevoActProyecto(indexFunction,7);}}
     ]},
    {menu:"RegistroCapTrab",
     opcion:[
	{id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar R. Capacitaciones Trabajadores",
	 functionClick:function(data){
            nuevoActProyecto(indexFunction,10);}}
     ]},
    {menu:"OrdenCompraContratoFirm",
     opcion:[
        {id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar O. de compra o contrato firmado",
	 functionClick:function(data){
	    nuevoActProyecto(indexFunction,11);}}
     ]},
    {menu:"CronogramaTrabajo",
     opcion:[
        {id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar Cronograma de trabajo",
	 functionClick:function(data){
//	    nuevoActProyecto(indexFunction,12);
	    registroActividadProyectoVersionDos(indexFunction,12,1,0);}}
     ]},
    {menu:"ProgramaCharlaSeguridad",
     opcion:[
        {id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar P. de charlas diarias de seguridad",
	 functionClick:function(data){
	    nuevoActProyecto(indexFunction,13);}}
     ]},
    {menu:"ProcedimientoATS",
     opcion:[
        {id:"opcAgregar",
	 nombre:"<i class='fa fa-plus-square'></i> Agregar P. escrito de trabajo seguro (PETS)",
	 functionClick:function(data){
	    nuevoActProyecto(indexFunction,14);}}
     ]},
    {menu:"HojaMsds",opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Hoja Msds",
	 functionClick:function(data){
         nuevoActProyecto(indexFunction,15);
	}}]},
   {menu:"InstructivoTrabAltoRiesgo",
    opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar I. de trabajo seguro para el trabajo alto riesgo",
       functionClick:function(data){nuevoActProyecto(indexFunction,16);}}]},
   {menu:"MatrizAspectoAmbiental",
    opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Matriz de aspecto ambiental",
       functionClick:function(data){nuevoActProyecto(indexFunction,18);}}]},
	{menu:"Act19Aux",
		opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Memoria descriptiva",
			functionClick:function(data){nuevoActProyecto(indexFunction,19);}}]},
	{menu:"Act20Aux",
		opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Póliza de responsabilidad civil",
			functionClick:function(data){nuevoActProyecto(indexFunction,20);}}]},
	{menu:"Act21Aux",
		opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Póliza CAR",
			functionClick:function(data){nuevoActProyecto(indexFunction,21);}}]},
	{menu:"Act22Aux",
		opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Carta fianza",
			functionClick:function(data){nuevoActProyecto(indexFunction,22);}}]},
	{menu:"Act23Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Plan de rescate",
	 functionClick:function(data){nuevoActProyecto(indexFunction,23);}}]},
	{menu:"Act24Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Plan de izaje",
	 functionClick:function(data){nuevoActProyecto(indexFunction,24);}}]},
	{menu:"Act25Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Matriz de procesos y actividades",
	 functionClick:function(data){nuevoActProyecto(indexFunction,25);}}]},
	{menu:"Act26Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Estructura de SST para el servicio",
	 functionClick:function(data){nuevoActProyecto(indexFunction,26);}}]},
	{menu:"Act27Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Plan de contingencia",
	 functionClick:function(data){nuevoActProyecto(indexFunction,27);}}]},
	{menu:"Act28Aux",
	 opcion:[{id:"opcAgregar",nombre:"<i class='fa fa-plus-square'></i> Agregar Señalización de obras e instalaciones",
	 functionClick:function(data){nuevoActProyecto(indexFunction,28);}}]}
];

function marcarSubOpcionProy(pindex,pindex1,menu){  
   $(".containerProy"+menu+indexFunction+" .listaGestionGosst").hide(); 
   funcionalidadOpcProy[pindex].opcion[pindex1].functionClick();
}

var menuOpcionProy=[];

function ListarOpcionesProy(idpindex){
   funcionalidadOpcProy.forEach(function(val1,index1){
      var menu = val1.menu;
      var opciones = val1.opcion;
		
      menuOpcionProy[index1] = "<ul class='listaGestionGosst list-group ' style='display:none;'>";
		
      opciones.forEach(function(val2,index2){
         menuOpcionProy[index1]+="<li id='"+val2.id+menu+idpindex+"' style='width:185px;top:-18px;' " +
         		             "class='list-group-item' onclick='marcarSubOpcionProy("+index1+","+index2+",\""+menu+"\")'>"+
         		             val2.nombre+
         		         "</li>";
      });
		
      menuOpcionProy[index1]+="</ul>";
   }); 
}

var mapTipoActividadesProy;

function habilitarProyectosContratista(tipoProyecto){
   var contratistaId = parseInt(getSession("contratistaGosstId"));
	
   var dataParam={
      empresaId: getSession("gestopcompanyid"),
      contratistaId: (contratistaId > 0?contratistaId:null),
      hasProyectoAsignado: (parseInt(tipoProyecto) == 4?0:1)
   };
   
   if(parseInt(tipoProyecto) != 4){
      dataParam.estado = {id: parseInt(tipoProyecto)};
   }
   
   callAjaxPost(URL+'/contratista/proyectos/solo',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    var listPanelesPrincipal = [];mapTipoActividadesProy = new Map();
	    perfilContratista = data.perfil;listFullProyectoSeguridad = data.proyectos;listTipoActividades = data.tipo_actividades;
	   
	    listTipoActividades.forEach(function(val,index){
	       mapTipoActividadesProy.set(val.id,val);
	    });
	    
	    data.proyectos.forEach(function(val,index){
	       ListarOpcionesProy(index);
	       var condicionPostulante = true;
		
	       if(val.postulante.contratista == null){
		  condicionPostulante = true;
	       }else{
	          if(val.postulante.contratista.id != contratistaId){
		     condicionPostulante = false;
		  }
		
		  if(val.postulante.contratista.id == null){
		     condicionPostulante = true;
		  }
	       }
				
	       tipoProyecto = parseInt(tipoProyecto);
				
	       var condicionAgregar = (tipoProyecto == 4?(val.postulante.asignacion != 1 && val.estado.id == 1):
	          (val.estado.id == tipoProyecto && val.postulante.asignacion == 1));
				
	       if(condicionAgregar && condicionPostulante){
		  var textoAsignacion = (val.postulante.asignacion == 1?"(Asignado) ":"(No asignado) ");
		  var textoBoton = "",textoBotonAct1 = "",textoBotonAct2 = "",textoBotonAct3 = "",textoBotonAct4 = "",textoBotonAct5 = "",
		     textoBotonAct6 = "",textoBotonAct7 = "",textoBotonAct10 = "",textoBotonAct11 = "",textoBotonAct12 = "",textoBotonAct13 = "",
		     textoBotonAct14 = "",textoBotonAudi = "",textoBotonTrab = "",textoBotonObs = "",textoBotonObsContr = "",textoBotonForm = "",
		     textoBotonInci = "",textoBotonInduccion = "",textoBotonIperc = "",textoBotonInspecc = "",textoBotonAct15 = "",textoBotonAct16 = "",
		     textoBotonAct18 = "",textoBotonAct19 = "",textoBotonAct20 = "",textoBotonAct21 = "",textoBotonAct22 = "",textoBotonAct23 = "",
			 textoBotonAct24 = "",textoBotonAct25 = "",textoBotonAct26 = "",textoBotonAct27 = "",textoBotonAct28 = "";
					 
		  if(val.postulante.estado.id == 1){
		     textoBoton = "Desde: "+val.postulante.fechaPlanificadaTexto;
		  }
		   
		  if(val.postulante.estado.id == 2){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
	                "<button class='btn btn-success' style='padding:5px' " +
			        "onclick='verCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
			   "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
		        "</button>";
		  }
					
		  if(val.postulante.estado.id == 3){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>"+
		        "<button class='btn btn-success' style='padding:5px' " +
			        "onclick='verSinEditarCompletarProyecto("+index+");alterarTextoBoton(this,1)'>" +
	                   "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
		        "</button>";
		  }
		   
		  if(val.postulante.asignacion == 1){
		     textoBotonObs = 
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyObsContratista"+index+"'>" +
	                      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"ObsContratista\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
		              "</a>"+menuOpcionProy[5]+
			   "</section>"+
		        "</div>";
						
		     textoBotonObsContr = 
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyObsCliente"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"ObsCliente\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[6]+
	                   "</section>"+
			"</div>";
		      
		     textoBotonAct1 =
		        "<div class='row' style='margin-top:-40px;'>" +
			   "<section class='col col-xs-12 containerProyActSSOMA"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"ActSSOMA\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[1]+
			   "</section>"+
		        "</div>";
						
		     textoBotonAct2 = 
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyPlanEmergencia"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"PlanEmergencia\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[2]+
		           "</section>"+
		        "</div>";
						
		     textoBotonAct3 = 
		        "<button class='btn btn-success' style='padding:5px' " +
		                "onclick='cargarActProyectosSeguridad("+index+",3);alterarTextoBoton(this,3,3)'>" +
		           "<i class='fa fa-arrow-down' aria-hidden='true'></i>Ver" +
		        "</button>" +
			"<br><br>" +
			"<button class='btn btn-success' style='padding:5px' onclick='nuevoActProyecto("+index+",3)'>" +
		           "<i class='fa fa-plus' aria-hidden='true'></i>Agregar" +
		        "</button>";
						
		     textoBotonAct4 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyPlanResiduo"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"PlanResiduo\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[3]+
		           "</section>"+
		        "</div>";
						
		     textoBotonAct5 =
		        "<div class='row' style='margin-top:-40px;'>" +
			   "<section class='col col-xs-12 containerProyDocSSOMA"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"DocSSOMA\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[4]+
			   "</section>"+
		        "</div>";
						 
		     textoBotonAct6 = 
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyPlanCovid"+index+"'>" +
		              "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"PlanCovid\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[9]+
			   "</section>"+
			"</div>";
		      
		     textoBotonAct7 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyMatrizRiesgoSimple"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"MatrizRiesgoSimple\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[10]+
			   "</section>"+
		        "</div>";
		     
		     textoBotonAct10 =
	                "<div class='row' style='margin-top:-40px;'>" +
			   "<section class='col col-xs-12 containerProyRegCapacitacionTrab"+index+"'>" +
		              "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"RegCapacitacionTrab\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[11]+
		           "</section>"+
		        "</div>";
		     
		     textoBotonAct11 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyOrdenCompraContratoFirm"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"OrdenCompraContratoFirm\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
		              "</a>"+menuOpcionProy[12]+
			   "</section>"+
			"</div>";
		     
		     textoBotonAct12 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyCronogramaTrabajo"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"CronogramaTrabajo\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[13]+
			   "</section>"+
			"</div>";
		     
		     textoBotonAct13 =
		        "<div class='row' style='margin-top:-40px;'>" +
			   "<section class='col col-xs-12 containerProyProgramaCharlaSeguridad"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"ProgramaCharlaSeguridad\");'>" +
		                 "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
		              "</a>"+menuOpcionProy[14]+
			   "</section>"+
			"</div>";
		     
		     textoBotonAct14 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyProcedimientoATS"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"ProcedimientoATS\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[15]+
			   "</section>"+
			"</div>";
		     
		     textoBotonAct15 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyHojaMsds"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"HojaMsds\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[16]+
			   "</section>"+
			"</div>";

		     textoBotonAct16 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyInstructivoTrabAltoRiesgo"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"InstructivoTrabAltoRiesgo\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[17]+
			   "</section>"+
			"</div>";
		     
		     textoBotonAct18 =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyMatrizAspectoAmbiental"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"MatrizAspectoAmbiental\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[18]+
			   "</section>"+
			"</div>";

			 textoBotonAct19 = "<div class='row' style='margin-top:-40px;'>" +
				 	 "<section class='col col-xs-12 containerProyAct19Aux"+index+"'>" +
				 		 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act19Aux\");'>" +
				 		 	 "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				 		 "</a>"+menuOpcionProy[19]+
				 	 "</section>"+
				 "</div>";

			 textoBotonAct20 = "<div class='row' style='margin-top:-40px;'>" +
				 	 "<section class='col col-xs-12 containerProyAct20Aux"+index+"'>" +
				 	     "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act20Aux\");'>" +
				             "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				  	     "</a>"+menuOpcionProy[20]+
				  	 "</section>"+
				 "</div>";

			 textoBotonAct21 = "<div class='row' style='margin-top:-40px;'>" +
				     "<section class='col col-xs-12 containerProyAct21Aux"+index+"'>" +
				         "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act21Aux\");'>" +
				             "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				         "</a>"+menuOpcionProy[21]+
				     "</section>"+
				 "</div>";

			 textoBotonAct22 = "<div class='row' style='margin-top:-40px;'>" +
				     "<section class='col col-xs-12 containerProyAct22Aux"+index+"'>" +
				         "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act22Aux\");'>" +
				             "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				         "</a>"+menuOpcionProy[22]+
				     "</section>"+
				 "</div>";
				 
		     textoBotonAct23 = "<div class='row' style='margin-top:-40px;'>" +
			         "<section class='col col-xs-12 containerProyAct23Aux"+index+"'>" +
				 	     "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act23Aux\");'>" +
				 	         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				 		 "</a>"+menuOpcionProy[23]+
				     "</section>"+
			     "</div>";
								 
			 textoBotonAct24 = "<div class='row' style='margin-top:-40px;'>" +
					 "<section class='col col-xs-12 containerProyAct24Aux"+index+"'>" +
					 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act24Aux\");'>" +
						     "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					     "</a>"+menuOpcionProy[24]+
				     "</section>"+
			     "</div>";

			 textoBotonAct25 = "<div class='row' style='margin-top:-40px;'>" +
					 "<section class='col col-xs-12 containerProyAct25Aux"+index+"'>" +
					 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act25Aux\");'>" +
						     "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					     "</a>"+menuOpcionProy[25]+
				     "</section>"+
			     "</div>";

			 textoBotonAct26 = "<div class='row' style='margin-top:-40px;'>" +
					 "<section class='col col-xs-12 containerProyAct26Aux"+index+"'>" +
					 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act26Aux\");'>" +
						     "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					     "</a>"+menuOpcionProy[26]+
				     "</section>"+
			     "</div>";

			 textoBotonAct27 = "<div class='row' style='margin-top:-40px;'>" +
					 "<section class='col col-xs-12 containerProyAct27Aux"+index+"'>" +
					 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act27Aux\");'>" +
						     "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					     "</a>"+menuOpcionProy[27]+
				     "</section>"+
			     "</div>";

			 textoBotonAct28 = "<div class='row' style='margin-top:-40px;'>" +
					 "<section class='col col-xs-12 containerProyAct28Aux"+index+"'>" +
					 "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Act28Aux\");'>" +
						     "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					     "</a>"+menuOpcionProy[28]+
				     "</section>"+
			     "</div>";
				 
		     textoBotonTrab =
		        "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='containerProyTrabajadores"+index+" col col-xs-12 '>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Trabajadores\");'>" +
		                 "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
		              "</a>"+menuOpcionProy[0]+
		           "</section>"+
		        "</div>";
						
		     textoBotonAudi = "";textoBotonInspecc = "";textoBotonForm = "";
		      
		     textoBotonInci =
	                "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyIncidente"+index+"'>" +
			      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionProy(this,"+index+",\"Incidente\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[7]+
		           "</section>"+
		        "</div>";
		      
		     textoBotonInduccion = 
		        "<button class='btn btn-success' style='padding:5px' " +
		                "onclick='verCompletarInduccionesProyecto("+index+");alterarTextoBoton(this,8)'>" +
		           "<i class='fa fa-arrow-down' aria-hidden='true'></i> Ver" +
			"</button>";
					         
		     textoBotonIperc = 
	                "<div class='row' style='margin-top:-40px;'>" +
		           "<section class='col col-xs-12 containerProyMatriz"+index+"'>" +
			      "<a class='efectoLink btn-gestion' " +
			         "onclick='toggleMenuOpcionProy(this,"+index+",\"Matriz\");'>" +
			         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
			      "</a>"+menuOpcionProy[8]+
			   "</section>"+
		        "</div>";
		  }
					
		  if(val.estado.id == 2){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>"
		  }
					
		  if(val.estado.id == 3){
		     textoBoton = "Hasta: "+val.postulante.fechaRealTexto+"<br>";
		     textoBotonTrab = "";textoBotonAct1 = "";textoBotonAct2 = "";textoBotonAct6 = "";textoBotonAct3 = "";textoBotonAct4 = "";
		     textoBotonAct10 = "";textoBotonAct11 = "";textoBotonAct12 = "";textoBotonAct13 = "";textoBotonAct14 = "";textoBotonAudi = "";
		     textoBotonInspecc = "";textoBotonObs = "";textoBotonObsContr = "";textoBotonForm = "";textoBotonInci = "";textoBotonInduccion = "";
		     textoBotonIperc = "";textoBotonAct7 = "";textoBotonAct5 = "";textoBotonAct15 = "";textoBotonAct16 = "";textoBotonAct18 = "";textoBotonAct19 = "";
			  textoBotonAct20 = "";textoBotonAct21 = "";textoBotonAct22 = "";textoBotonAct23 = "";textoBotonAct24 = "";textoBotonAct25 = "";textoBotonAct26 = "";
			  textoBotonAct27 = "";textoBotonAct28 = "";
		  }
					
		  // *** CREACIÓN DE DIV ***
		  var filaAct1 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(1).nombre,"fa fa-sort-amount-asc","tr1PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal1,
		     "cargarActProyectosSeguridad",index,3,1,"Programa",val.postulante.indicadorActividades1,val.postulante.observacionesActividades1,textoBotonAct1,"detalleActividadesProyecto1");
		   
		  var filaAct2 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(2).nombre,"fa fa-sort-amount-asc","tr2PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal2,
		     "cargarActProyectosSeguridad",index,3,2,"P. Emergencia",val.postulante.indicadorActividades2,val.postulante.observacionesActividades2,textoBotonAct2,"detalleActividadesProyecto2");
		
		  var filaAct4 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(4).nombre,"fa fa-sort-amount-asc","tr4PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal4,
		     "cargarActProyectosSeguridad",index,3,4,"P. Residuo",val.postulante.indicadorActividades4,val.postulante.observacionesActividades4,textoBotonAct4,"detalleActividadesProyecto4");
			   
		  var filaAct5 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(5).nombre,"fa fa-sort-amount-asc","tr5PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal5,
		     "cargarActProyectosSeguridad",index,3,5,"Doc. SSOMA",val.postulante.indicadorActividades5,val.postulante.observacionesActividades5,textoBotonAct5,"detalleActividadesProyecto5");
		  
		  var filaAct6 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(6).nombre,"fa fa-sort-amount-asc","tr6PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal6,
		     "cargarActProyectosSeguridad",index,3,6,"P. COVID",val.postulante.indicadorActividades6,val.postulante.observacionesActividades6,textoBotonAct6,"detalleActividadesProyecto6");
		   
		  var filaAct7 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(7).nombre,"fa fa-sort-amount-asc","tr7PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal7,
		     "cargarActProyectosSeguridad",index,3,7,"Matriz riesgo simple",val.postulante.indicadorActividades7,val.postulante.observacionesActividades7,textoBotonAct7,"detalleActividadesProyecto7");
		
		  var filaAct10 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(10).nombre,"fa fa-sort-amount-asc","tr10PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal10,
		     "cargarActProyectosSeguridad",index,3,10,"R. Capacitaciones Trabajadores",val.postulante.indicadorActividades10,val.postulante.observacionesActividades10,textoBotonAct10,"detalleActividadesProyecto10");
		   
		  var filaAct11 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(11).nombre,"fa fa-sort-amount-asc","tr11PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal11,
		     "cargarActProyectosSeguridad",index,3,11,"O. de compra o contrato firmado",val.postulante.indicadorActividades11,val.postulante.observacionesActividades11,textoBotonAct11,"detalleActividadesProyecto11");
			
		  var filaAct12 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(12).nombre,"fa fa-sort-amount-asc","tr12PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal12,
		     "cargarActProyectosSeguridad",index,3,12,"Cronograma de trabajo",val.postulante.indicadorActividades12,val.postulante.observacionesActividades12,textoBotonAct12,"detalleActividadesProyecto12");

		  var filaAct13 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(13).nombre,"fa fa-sort-amount-asc","tr13PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal13,
		     "cargarActProyectosSeguridad",index,3,13,"P. de charlas diarias de seguridad",val.postulante.indicadorActividades13,val.postulante.observacionesActividades13,textoBotonAct13,"detalleActividadesProyecto13");
		   
		  var filaAct14 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(14).nombre,"fa fa-sort-amount-asc","tr14PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal14,
		     "cargarActProyectosSeguridad",index,3,14,"P. escrito de trabajo seguro (PETS)",val.postulante.indicadorActividades14,val.postulante.observacionesActividades14,textoBotonAct14,"detalleActividadesProyecto14");

		  var filaAct15 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(15).nombre,"fa fa-sort-amount-asc","trx15PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal15,
		     "cargarActProyectosSeguridad",index,3,15,"Hoja Msds",val.postulante.indicadorActividades15,val.postulante.observacionesActividades15,textoBotonAct15,"detalleActividadesProyecto15");
		   
		  var filaAct16 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(16).nombre,"fa fa-sort-amount-asc","trx16PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal16,
		     "cargarActProyectosSeguridad",index,3,16,"I. de trabajo seguro para el trabajo alto riesgo",val.postulante.indicadorActividades16,val.postulante.observacionesActividades16,textoBotonAct16,"detalleActividadesProyecto16");

		  var filaAct18 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(18).nombre,"fa fa-sort-amount-asc","trx18PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal18,
		     "cargarActProyectosSeguridad",index,3,18,"Matriz de aspecto ambiental",val.postulante.indicadorActividades18,"",textoBotonAct18,"detalleActividadesProyecto18");

		  var filaAct19 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(19).nombre,"fa fa-sort-amount-asc","trx19PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal19,
			  "cargarActProyectosSeguridad",index,3,19,"Memoria descriptiva",val.postulante.indicadorActividades19,"",textoBotonAct19,"detalleActividadesProyecto19");

		  var filaAct20 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(20).nombre,"fa fa-sort-amount-asc","trx20PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal20,
			  "cargarActProyectosSeguridad",index,3,20,"Póliza de responsabilidad civil",val.postulante.indicadorActividades20,"",textoBotonAct20,"detalleActividadesProyecto20");

		  var filaAct21 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(21).nombre,"fa fa-sort-amount-asc","trx21PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal21,
			  "cargarActProyectosSeguridad",index,3,21,"Póliza CAR",val.postulante.indicadorActividades21,"",textoBotonAct21,"detalleActividadesProyecto21");

		  var filaAct22 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(22).nombre,"fa fa-sort-amount-asc","trx22PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal22,
			  "cargarActProyectosSeguridad",index,3,22,"Carta fianza",val.postulante.indicadorActividades22,"",textoBotonAct22,"detalleActividadesProyecto22");

		  var filaAct23 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(23).nombre,"fa fa-sort-amount-asc","trx23PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal23,
			  "cargarActProyectosSeguridad",index,3,23,"Plan de rescate",val.postulante.indicadorActividades23,"",textoBotonAct23,"detalleActividadesProyecto23");
	  
		  var filaAct24 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(24).nombre,"fa fa-sort-amount-asc","trx24PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal24,
			  "cargarActProyectosSeguridad",index,3,24,"Plan de izaje",val.postulante.indicadorActividades24,"",textoBotonAct24,"detalleActividadesProyecto24");

		  var filaAct25 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(25).nombre,"fa fa-sort-amount-asc","trx25PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal25,
			  "cargarActProyectosSeguridad",index,3,25,"Matriz de procesos y actividades",val.postulante.indicadorActividades25,"",textoBotonAct25,"detalleActividadesProyecto25");

		  var filaAct26 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(26).nombre,"fa fa-sort-amount-asc","trx26PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal26,
			  "cargarActProyectosSeguridad",index,3,26,"Estructura de SST para el servicio",val.postulante.indicadorActividades26,"",textoBotonAct26,"detalleActividadesProyecto26");

		  var filaAct27 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(27).nombre,"fa fa-sort-amount-asc","trx27PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal27,
			  "cargarActProyectosSeguridad",index,3,27,"Plan de contingencia",val.postulante.indicadorActividades27,"",textoBotonAct27,"detalleActividadesProyecto27");

		  var filaAct28 = crearDivRequisitosProyectoContratista(mapTipoActividadesProy.get(28).nombre,"fa fa-sort-amount-asc","trx28PlanProyecto"+val.id,val.postulante.indicadorActividadesDecimal28,
			  "cargarActProyectosSeguridad",index,3,28,"Señalización de obras e instalaciones",val.postulante.indicadorActividades28,"",textoBotonAct28,"detalleActividadesProyecto28");
			  
		  var filaExtForm = crearDivRequisitosProyectoContratista("Extensión Capacitaciones Online Asignadas","fa fa-graduation-cap","",val.postulante.indicadorFormacionesDecimal,
		     "verCompletarCursoProyecto",index,4,null,"Ext. Cap.",val.postulante.indicadorFormaciones,"",textoBotonForm,"detalleFormacionProyecto");
		   
		  var textoFilaObsCont = (getSession("gestopcompanyid") == 617?"Observaciones / Accidentes / Incidentes":"Observaciones al Contratista");
		  var detalleFilaObsCont = (getSession("gestopcompanyid") == 617?"Obs./Acc./Inc.":"Observaciones al Contratista");
		  
		  var filaObsCont = crearDivRequisitosProyectoContratista(textoFilaObsCont,"fa fa-eye","",val.postulante.indicadorObservacionesDecimal,
		     "verCompletarObsProyecto",index,5,null,detalleFilaObsCont,val.postulante.indicadorObservaciones,"",textoBotonObs,"detalleObservacionesProyecto");
		  
		  var filaObsCLiente = crearDivRequisitosProyectoContratista("Observaciones al Cliente","fa fa-eye","",val.postulante.indicadorObservacionesContratistaDecimal,
		     "verCompletarObsContratista",index,10,null,"Obs. Cliente",val.postulante.indicadorObservacionesContratista,"",textoBotonObsContr,"detalleObservacionesContratista");
		   
//		  var filaIperc = crearDivRequisitosProyectoContratista("Matriz de Riesgos<br>"+val.tipoIperc.nombre,"fa fa-crosshairs","trIperProyecto"+val.id,val.postulante.indicadorIpercDecimal,
//		     "cargarIpercProyecto",index,9,null,"Matriz de Riesgos",val.postulante.indicadorIperc,"",textoBotonIperc,"detalleIpercProyecto");
		   
		  // var filaAuditoria = crearDivRequisitosProyectoContratista("Auditorías","fa fa-check-square-o","",val.postulante.indicadorAuditoriaDecimal,
		  //    "verCompletarAuditoriaGenral",index,6,null,"Auditoria",val.postulante.indicadorAuditoria,"",textoBotonAudi,"detalleAuditoriasProyecto");
		  //
		  // var filaInspecciones = crearDivRequisitosProyectoContratista("Inspecciones","fa fa-check-square-o","",val.postulante.indicadorHallazgosDecimal,
		  //    "verCompletarInspeccionesGenral",index,12,null,"Inspecciones",val.postulante.indicadorHallazgos,"",textoBotonInspecc,"detalleInspeccionProyecto");
				
		  var filaIncidentes = crearDivRequisitosProyectoContratista("Accidentes / Incidentes","fa fa-warning","",val.postulante.indicadorIncidentesDecimal,
		     "verCompletarIncidenteProyecto",index,7,null,"Accidentes / Incidentes",val.postulante.indicadorIncidentes,"",textoBotonInci,"detalleIncidentesProyecto");
		  
		  var filaTrabajador = crearDivRequisitosProyectoContratista("Trabajadores Asignados","fa fa-sort-amount-asc","",val.postulante.indicadorTrabajadoresDecimal,
		     "cargarTrabsProyectosSeguridad",index,2,null,"",val.postulante.indicadorTrabajadores,"",textoBotonTrab,"detalleTrabajadoresProyecto");			   
		  // ******	
		  var filasRelevantesProyecto = "" +
		     filaTrabajador+filaAct1+filaAct6+filaAct4+filaAct5+filaAct7+filaAct2+filaAct10+filaAct11+filaAct12+filaAct13+filaAct14+filaAct15+filaAct16+filaAct18+filaAct19+filaAct20+filaAct21+filaAct22 +
		     filaAct23+filaAct24+filaAct25+filaAct26+filaAct27+filaAct28+filaExtForm+filaObsCont+filaObsCLiente+filaIncidentes;/*filaAuditoria+filaInspecciones+filaIperc*/
					
		  var filasProyectoFinal = "";
		
		  if(val.postulante.asignacion == 1){
		     if(perfilContratista == null){
		        filasProyectoFinal = filasRelevantesProyecto;
		     }else{
		        filasProyectoFinal += filaTrabajador;
		      
		        var requisitosProyectoIdAux = "";
			
		        perfilContratista.requisitosProyecto.forEach(function(val){
			   requisitosProyectoIdAux += "#"+val.id+".-,";
		        });
		        
//		        filasProyectoFinal += (requisitosProyectoIdAux.indexOf("#13.-") != -1?filaIperc:"");
		        filasProyectoFinal += (val.habilitadoActividad7 == 1?filaAct7:"");
		        filasProyectoFinal += (val.habilitadoActividad1 == 1?filaAct1:"");
		        filasProyectoFinal += (val.habilitadoActividad2 == 1?filaAct2:"");
		        filasProyectoFinal += (val.habilitadoActividad4 == 1?filaAct4:"");
		        filasProyectoFinal += (val.habilitadoActividad5 == 1?filaAct5:"");
		        filasProyectoFinal += (val.habilitadoActividad6 == 1?filaAct6:"");
		        filasProyectoFinal += (val.habilitadoActividad10 == 1?filaAct10:"");
		        filasProyectoFinal += (val.habilitadoActividad11 == 1?filaAct11:"");
		        filasProyectoFinal += (val.habilitadoActividad12 == 1?filaAct12:"");
		        filasProyectoFinal += (val.habilitadoActividad13 == 1?filaAct13:"");
		        filasProyectoFinal += (val.habilitadoActividad14 == 1?filaAct14:"");
		        filasProyectoFinal += (val.habilitadoActividad15 == 1?filaAct15:"");
		        filasProyectoFinal += (val.habilitadoActividad16 == 1?filaAct16:"");
		        filasProyectoFinal += (val.habilitadoActividad18 == 1?filaAct18:"");
				 filasProyectoFinal += (val.habilitadoActividad19 == 1?filaAct19:"");
				 filasProyectoFinal += (val.habilitadoActividad20 == 1?filaAct20:"");
				 filasProyectoFinal += (val.habilitadoActividad21 == 1?filaAct21:"");
				 filasProyectoFinal += (val.habilitadoActividad22 == 1?filaAct22:"");
				 filasProyectoFinal += (val.habilitadoActividad23 == 1?filaAct23:"");
				 filasProyectoFinal += (val.habilitadoActividad24 == 1?filaAct24:"");
				 filasProyectoFinal += (val.habilitadoActividad25 == 1?filaAct25:"");
				 filasProyectoFinal += (val.habilitadoActividad26 == 1?filaAct26:"");
				 filasProyectoFinal += (val.habilitadoActividad27 == 1?filaAct27:"");
				 filasProyectoFinal += (val.habilitadoActividad28 == 1?filaAct28:"");
		        filasProyectoFinal += (requisitosProyectoIdAux.indexOf("#7.-") != -1?filaExtForm:"");
		        filasProyectoFinal += (val.habilitadoObservacion == 1?filaObsCont:"");
		        filasProyectoFinal += (val.habilitadoObservacionCont == 1?filaObsCLiente:"");
		        // filasProyectoFinal += (requisitosProyectoIdAux.indexOf("#10.-") != -1?filaAuditoria:"");
		        // filasProyectoFinal += (requisitosProyectoIdAux.indexOf("#11.-") != -1?filaInspecciones:"");
		        filasProyectoFinal += (val.habilitadoIncidente == 1?filaIncidentes:"");
		     }
		  }else{
	             var textDocPostulado = crearDivRequisitosProyectoContratista("Documentos postulación","fa fa-files-o","trDocProyecto"+val.id,val.postulante.indicadorDocumentosDecimal,
			"verSinEditarCompletarProyecto",index,1,null,"Documento",val.postulante.indicadorDocumentos,"",textoBoton,"detalleDocumentosProyecto");
			   		
		     filasProyectoFinal += textDocPostulado;
		  }
		   
		   var descripcionProy =
		          "<div class='eventoGeneral'>" +
			     "<div id='tituloEvento'>" +
			        "<table class='table table-movil' id='proyectoTable"+val.id+"'>" +
				   "<tbody>" +
				      "<tr>" +
				          "<td>" +
				              "<i aria-hidden='true' class='fa fa-barcode'></i> Código" +
				          "</td>" + 
					  "<td colspan='2'>"+val.codigo+"</td>" +
			              "</tr>" +
				      "<tr>" +
				         "<td>" +
				            "<i aria-hidden='true' class='fa fa-user'></i> Responsable SST" +
				         "</td>" + 
					 "<td colspan='2'>" +
					    "<strong>*Nombre:</strong> "+val.responsableSstNombre+"<br>" +
					    "<strong>*Teléfono:</strong> "+val.responsableSstTelefono+"<br>" +
					    "<strong>*Correo:</strong> "+val.responsableSstCorreo+"<br>" +
					 "</td>" +
			              "</tr>" +
				      "<tr>" +
				         "<td>" +
				            "<i aria-hidden='true' class='fa fa-hourglass-start'></i> Fecha Inicio" +
				         "</td>" + 
					 "<td colspan='2'>"+val.fechaInicioTexto+"</td>" +
			              "</tr>" +
				      "<tr>" +
				         "<td>" +
				            "<i aria-hidden='true' class='fa fa-hourglass-end'></i> Fecha Fin" +
				         "</td>" + 
					 "<td colspan='2'>"+val.fechaFinTexto+"</td>" + 
			              "</tr>" +
				      "<tr>" +
				         "<td>" +
					    "<i aria-hidden='true' class='fa fa-info'></i> Descripción"+
					 "</td>" + 
					 "<td colspan='2'>"+textoAsignacion+val.descripcion+"</td>" + 
				      "</tr>" +
				       filasProyectoFinal+
				   "</tbody>" +
			        "</table>"+ 
			     "</div>"+
			  "</div>"; 
				
		   listPanelesPrincipal.push({
		      id:"pro"+val.id,clase:"divProyectoGeneral",
		      styleAux:"display:none",proyectoId:val.id,
		      nombre:"["+val.codigo+"] "+val.titulo+" ("+pasarDecimalPorcentaje(val.notaFinal)+") ",
		      buttonAd:
		         "<button type='button' id='btnEditarDatosProyContratista' " +
		                 "class='btn btn-success' style='padding:2px 8px 2px 8px;margin-right:10px' " +
                                 "onclick='editarDatosResponsableSst("+val.responsableSstId+")' " +
                                 "title='Modificar datos del responsable SST del proyecto.'>" +
                            "<i class='fa fa-user fa-4x'></i>" +
                         "</button>",
		      contenido:descripcionProy});
	        }
	     });
			
	     //*** Formularios***
	     $(".divTituloFull h4").append(" ("+listPanelesPrincipal.length+")");
	     
	     var textoForm="",textFormFormacion="",textFormActividad="";
	     var textObservacion="",textAuditorias="",textIncidentes="",textTrabajdor="",textIperc="",
		 textControlIperc="",textFinalIperc="",textoObsContratista="";
			
	     var listItemsFinalIperc=[
                    {sugerencia:"",label:"Evaluación actual",inputForm:"",divContainer:"divSeparador"},
                    {sugerencia:"",label:"Actividad",inputForm:"",divContainer:"divActivIperc"},
           	    {sugerencia:"",label:"Nivel de Riesgo",divContainer:"divNivRiesgoIperc"},
           	    {sugerencia:"",label:"Controles",divContainer:"divControlesIperc"},
           	    {sugerencia:"",label:"Evaluación residual",inputForm:"",divContainer:"divSeparador"},
           	    {sugerencia:"",label:"Da",divContainer:"divSelProbEsp1ResidualIperc"},
           	    {sugerencia:"",label:"Niv",divContainer:"divSelProbEsp2ResidualIperc"},
           	    {sugerencia:"",label:"Nive",divContainer:"divSelProbEsp3ResidualIperc"},
           	    {sugerencia:"",label:"Factor n",divContainer:"divSelProbEsp4ResidualIperc"},
           	    {sugerencia:"",label:"",divContainer:"divSelProbEsp5ResidualIperc"},
           	    {sugerencia:"",label:"",divContainer:"divSelProbEsp6ResidualIperc"},
           	    {sugerencia:"",label:"",divContainer:"divSelProbEsp7ResidualIperc"},
           	    {sugerencia:"",label:"",divContainer:"divSelProbEsp8ResidualIperc"},
           	    {sugerencia:"",label:"",divContainer:"divSelProbEsp9ResidualIperc"},
           	    {sugerencia:"",label:"Nivel de probabilidad",divContainer:"divSelProbEspFinalResidualIperc"},
           	    {sugerencia:"",label:"Consecuencia",divContainer:"divSelConsecEspFinalResidualIperc"},
           	    {sugerencia:"",label:"Nivel de Riesgo",divContainer:"divSelRiesgoEspFinalResidualIperc"},
       		    {sugerencia:"",label:" ",
                     inputForm:"<button type='submit' class='btn btn-success'>" +
                     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
                     	       "</button>"}
       				     ];
	     var listItemsIperc=[
	            {sugerencia:"",label:"Datos iniciales",inputForm:"",divContainer:"divDatos"},
       		    {sugerencia:"",label:"División",
	             inputForm:"<input type='text' class='form-control' id='inputDiviIperc'>"},
       		    {sugerencia:"",label:"Área",
	             inputForm:"<input type='text' class='form-control' id='inputAreaIperc'>"},
       		    {sugerencia:"",label:"Puesto de trabajo / Perfil",
	             inputForm:"<input type='text' class='form-control' id='inputPuestoIperc'>"},
       		    {sugerencia:"",label:"Actividad",
	             inputForm:"<input type='text' class='form-control' id='inputActividadIperc'>"},
       		    {sugerencia:"",label:"Tarea",
	             inputForm:"<input type='text' class='form-control' id='inputTareaIperc'>"},
       		    {sugerencia:"",label:"Lugar",
	             inputForm:"<input type='text' class='form-control' id='inputLugarIperc'>"},
       		    {sugerencia:"",label:"Tipo",divContainer:"divSelTipoIperc"},
       		    {sugerencia:"",label:"Sub-Tipo",divContainer:"divSelSubTipoIperc"},
       		    {sugerencia:"",label:"Frecuencia",divContainer:"divSelFrecuenciaIperc"},
       		    {sugerencia:"",label:"Peligro alla",divContainer:"divPeligroIperc",
       		     inputForm:"<input type='text' class='form-control' id='inputPelIperc'>"},
       		    {sugerencia:"",label:"Descripción",
       		     inputForm:"<input type='text' class='form-control' id='inputPelDescIperc'>"},
       		    {sugerencia:"",label:"Riesgo",
       		     inputForm:"<input type='text' class='form-control' id='inputRiesgoIperc'>"},
       		    {sugerencia:"",label:"Consec cto",divContainer:"divConsecIperc",
       	             inputForm:"<input type='text' class='form-control' id='inputConsecuenciaIperc'>"},
       		    {sugerencia:"",label:"Requisito Legal",
       	             inputForm:"<input type='text' class='form-control' id='inputReqLegalIperc'>"},
       		    {sugerencia:"",label:"",inputForm:"",divContainer:""}, 
       		    {sugerencia:"",label:"Controles Existentes",inputForm:"",divContainer:"divExistentes"},
       		    {sugerencia:"",label:"Control de ingeniería",
       		     inputForm:"<input type='text' class='form-control' id='inputControl1Iperc'>"},
       		    {sugerencia:"",label:"Control de administrativo",
       		     inputForm:"<input type='text' class='form-control' id='inputControl2Iperc'>"},
       		    {sugerencia:"Puede ser personal o colectivo",label:"Control de Equipo de Protección",
       		     inputForm:"<input type='text' class='form-control' id='inputControl3Iperc'>"},
       		    {sugerencia:"",label:"",inputForm:"",divContainer:""},
       		    {sugerencia:"",label:"Evaluación actual",inputForm:"",divContainer:"divEvalActual"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp1Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp2Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp3Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp4Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp5Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp6Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp7Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp8Iperc"},
       		    {sugerencia:"",label:"",divContainer:"divSelProbEsp9Iperc"},
       		    {sugerencia:"Calculado a partir de las opciones anteriores",
       		     label:"Nivel de probabilidad",divContainer:"divSelProbEspFinalIperc"},
       		    {sugerencia:"",label:"Consecuencia (Seguridad y Salud)",divContainer:"divSelConsecEspFinalIperc"},
       		    {sugerencia:"",label:"Consecuencia (Reputación)",divContainer:"divSelConsecRepuEspFinalIperc"},
       		    {sugerencia:"",label:"Nivel de Riesgo",divContainer:"divSelRiesgoEspFinalIperc"},
       		    {sugerencia:"",label:"¿Es significativo?",divContainer:"divSelSignificativoIperc"},
       		    {sugerencia:"",label:" ",
       		     inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"}
   				];
	     
	     var listItemsTrab=[
	        {sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:" ",
	         inputForm:"<button type='button' class='btn btn-success' onclick='marcarTodosTrabajadoresProyecto()'>" +
	             	      "<i aria-hidden='true' class='fa fa-check'></i> Asignar a todos" +
	             	   "</button>"+" " +
	             	   "<button type='button' class='btn btn-danger' onclick='desmarcarTodosTrabajadoresProyecto()'>" +
             	              "<i aria-hidden='true' class='fa fa-times'></i> Inhabilitar a todos" +
             	           "</button>"},
             	{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Trabajadores asignados",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTrabProy"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:"Trabajadores inhabilitados",inputForm:"",divContainer:""},
		{sugerencia:"",anchoLabel:"col-sm-0",anchoDiv:"col-sm-12",label:"<br>",inputForm:"",divContainer:"divSelTrabProyInhab"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
		{sugerencia:" ",label:"Fecha de modificación",inputForm:"<h5>"+obtenerFechaActualNormal()+"</h5>"},
		{sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
		{sugerencia:"",label:"",
		 inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
		     	      "<i aria-hidden='true' class='fa fa-floppy-o'></i> Guardar" +
		     	   "</button>"}
	     ];
	     
	     var listItemsForm=[
		    {sugerencia:"",label:"Item a evaluar",inputForm:"<h5 id='trMovilItem'></h5>"},
		    {sugerencia:"Ej: Necesito más información, ¿Involucra todo el proyecto?",
	             label:"Observación del Contratista",
	             inputForm:"<input type='text' class='form-control' id='observacionEval' placeholder=' '>"},
		    {sugerencia:"Ej: Documento legal, Foto",label:"Evidencia",inputForm:"",divContainer:"eviDocumento"},
		    {sugerencia:"",label:"Observación del Contratante",inputForm:"<h5 id='trMovilObservacion'></h5>"},
		    {sugerencia:"",label:" ",
		     inputForm:"<button type='submit' class='btn btn-success'>" +
		     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
		     	       "</button>"}
		               ];
	     
	     var listItemsFormFormacion=[
                    {sugerencia:"Si ya ha realizado la actividad, solo introduzca la evidencia",
                     label:"Fecha planificada",
                     inputForm:"<input type='date' class='form-control' id='inputFecConf' placeholder=' '>"},
                    {sugerencia:"",label:"Observación",
                     inputForm:"<input class='form-control' id='inputObsConf' placeholder=' '>"},
		    {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviDocumentoFormacion"},
		    {sugerencia:"",label:" ",
	             inputForm:"<button type='submit' class='btn btn-success'>" +
	             	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
	             	       "</button>"}
		                        ];

		 var linkMemoriaDescriptiva =
		     "<a class='efectoLink' target='_blank' href='https://drive.google.com/file/d/1kmR7xUl6ucRo3FpbAIoK2M9xgNlTFSHF/view?usp=sharing'>" +
		         "<i class='fa fa-external-link' aria-hidden='true'></i> Enlace" +
	             "</a>";
		 
		 var linkFormatoHojaMSDS =
			 "<a class='efectoLink' target='_blank' href='https://docs.google.com/document/d/1IIrbH1cCc5p3FSH2jMDsB2zXCwakr9I3" +
			     "/edit?usp=sharing&ouid=100934550188082775780&rtpof=true&sd=true'>" +
				 "<i class='fa fa-external-link' aria-hidden='true'></i> Enlace" +
			 "</a>";

	     var listItemsFormActividad=[
                 {sugerencia:"",clase:"enlaceMemoriaDesc-SJ",label:"Enlace:",inputForm:linkMemoriaDescriptiva},
                 {sugerencia:"",clase:"enlaceMemoriaDesc-SJ",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			 {sugerencia:"",clase:"formatoHojaMsds-AGP",label:"Formato",inputForm:linkFormatoHojaMSDS},
			 {sugerencia:"",clase:"formatoHojaMsds-AGP",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
			 {sugerencia:"",label:"Categoria",divContainer:"divCategActiv",inputForm:""},
			 {sugerencia:"",label:"Actividad",divContainer:"divDescActiv",
			  inputForm:"<input type='text' class='form-control' id='inputDescActProy' placeholder=' '>"},
			 {sugerencia:"Si ya ha realizado la actividad, solo introduzca la evidencia",
              divContainer:"divFechaPlanActiv",label:"Fecha planificada",
              inputForm:"<input type='date' class='form-control' id='inputFecPlanActProy' placeholder=' '>"},
			 {sugerencia:"Completar estos campos una vez se haya completado la actividad",
              divContainer:"divMensajeActividad",label:"",inputForm:""},
			 {sugerencia:"",divContainer:"divSeparatorActividad",label:"",inputForm:""},
			 {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviActividad"},
			 {sugerencia:"",label:"Procedimiento de IPERC",inputForm:"",divContainer:"eviActProcActAltRiesgo"},
			 {sugerencia:"valor del 0 al 100",divContainer:"divPuntajeActividad",label:"% de cumplimiento",
              inputForm:"<input min='0' max='100' step='1' type='number' class='form-control' id='inputPuntajeActProy'>"},
           	 {sugerencia:"",divContainer:"expoActividad",label:"Expositor",
              inputForm:"<input type='text' class='form-control' id='inputExpoActProy' placeholder=' '>"},
           	 {sugerencia:"",divContainer:"numTrabActividad",label:"# Trabajadores",
              inputForm:"<input type='number' class='form-control' id='inputNumTrabActProy' placeholder=' '>"},
           	 {sugerencia:"",divContainer:"duracionActividad",label:"Duración (minutos)",
              inputForm:"<input type='number' class='form-control' id='inputDuraActProy' placeholder=' '>"},
           	 {sugerencia:"",label:"Observación del Contratista",divContainer:"divObsActProy",
              inputForm:"<input type='text' class='form-control' id='inputObsActProy' placeholder=' '>"},
             {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
           	 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
            	     	                           "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
            	     	                       "</button>"}
		 ];
		   
	     var selTipoAccMej = crearSelectOneMenuOblig("selTipoAccMej","",listTipoAccMej,0,"id","nombre");
		
	     var listItemsFormObservacion=[
                    {sugerencia:"",label:"Acción de mejora",
                     inputForm:"<input type='text' class='form-control' id='inputDescAcc' placeholder=' '>"},
                    {sugerencia:"",label:"Tipo Acción de mejora",inputForm:selTipoAccMej},
                    {sugerencia:"Si ya ha realizado la acción, solo introduzca la evidencia",label:"Fecha planificada",
                     inputForm:"<input type='date' class='form-control' id='inputFecAcc' placeholder=' '>"},
                    {sugerencia:"Ej: El incidente fue causado por un peatón, fue un evento fortuito ",
                     label:"Observación del contratista",
                     inputForm:"<input type='text' class='form-control' id='inputObsAcc' placeholder=' '>"},
                    {sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviAccionMejora"}, 
                    {sugerencia:"",label:" ",
                     inputForm:"<button type='submit' class='btn btn-success'>" +
                     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
                     	       "</button>"},
                    {sugerencia:"",label:" ",
                     inputForm:"<button type='button' id='btnAgregarNuevoAccion' class='btn btn-success'>" +
                     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar y agregar otro" +
                     	       "</button>"}
  		 			  ];
		
	     var listItemsControl=[
	            {sugerencia:"",label:"Tipo de control",inputForm:" ",divContainer:"divSelTipoControlIperc"},
	            {sugerencia:" ",label:"Descripción",
	             inputForm:"<input type='text' class='form-control' id='inputDescControl' placeholder=' '>"},
	            {sugerencia:"Si ya ha realizado la acción, solo introduzca la evidencia",
	             label:"Fecha planificada",
	             inputForm:"<input type='date' class='form-control' id='inputFechaControl' placeholder=' '>"},
	            {sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviControl"},  
	            {sugerencia:"",label:" ",
	             inputForm:"<button type='submit' class='btn btn-success'>" +
	             	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
	             	       "</button>"} 
  		 		  ];
	     
	     var listItemsFormAuditorias = [];
	     var listItemsFormIncidentes = []; 
		 
	     listItemsFinalIperc.forEach(function(val,index){
	        textFinalIperc+=obtenerSubPanelModulo(val)
	     });
		
	     listItemsControl.forEach(function(val,index){
	        textControlIperc+=obtenerSubPanelModulo(val)
	     });
	     
	     listItemsIperc.forEach(function(val,index){
	        textIperc+=obtenerSubPanelModulo(val)
	     });
	     
	     textTrabajdor += "<div class='eventoGeneral'>" +
                                 "<form class='eventoGeneral'>";
	     listItemsTrab.forEach(function(val,index){
	        textTrabajdor += obtenerSubPanelModuloVersionDos(val);
	     });
	     textTrabajdor +=    "</form>" +
	                      "</div>";
			
	     listItemsForm.forEach(function(val,index){
	        textoForm+=obtenerSubPanelModulo(val)
	     });
		
	     listItemsFormFormacion.forEach(function(val,index){
	        textFormFormacion+=obtenerSubPanelModulo(val);
	     });
		
	     textFormActividad += "<div class='eventoGeneral'>" +
                                     "<form id='formEditarActividad' class='eventoGeneral'>";
	     listItemsFormActividad.forEach(function(val,index){
	        textFormActividad += obtenerSubPanelModuloVersionDos(val);
	     });
	     textFormActividad +=    "</form>" +
                                  "</div>";
	     
	     listItemsFormObservacion.forEach(function(val,index){
	        textObservacion+=obtenerSubPanelModulo(val);
	        textoObsContratista+=obtenerSubPanelModulo(val);
	     });
	     
	     listItemsFormAuditorias.forEach(function(val,index){
	        textAuditorias+=obtenerSubPanelModulo(val);
	     });
		
	     listItemsFormIncidentes.forEach(function(val,index){
	        textIncidentes+=obtenerSubPanelModulo(val);
	     });
		
	     var listItemsImportIperc=[ 
                    {sugerencia:"",label:"Plantilla",
                     inputForm:"<a class='btn btn-success' onclick='generarExcelAyudaIperc()'>" +
                     	          "<i class='fa fa-download'></i> Descargar" +
                     	       "</a> ",divContainer:""},  
                    {sugerencia:"",label:"Datos",
                     inputForm:"<textarea class='form-control' style='resize:vertical' id='textImportIperc'></textarea>",
                     divContainer:"divAreaImportIperc"},
                    {sugerencia:"",label:" ",
                     inputForm:"<button type='submit' class='btn btn-success'>" +
                     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
                     	       "</button>"} 
  		 		      ];
	     
	     var textImportIperc="";
		
	     listItemsImportIperc.forEach(function(val,index){
	        textImportIperc+=obtenerSubPanelModulo(val);
	     });

	     var listItemsImportIpercCinco=[
                    {sugerencia:"",label:"Tipo",divContainer:"divSelSubTipoIpercImport"},
                    {sugerencia:"",label:"Plantilla",
                     inputForm:"<a class='btn btn-success' onclick='generarExcelAyudaIpercCinco()'>" +
                     	          "<i class='fa fa-download'></i> Descargar" +
                     	       "</a> ",divContainer:""},  
                    {sugerencia:"No incluir # de fila",label:"Datos",
                     inputForm:"<textarea class='form-control' style='resize:vertical' id='textImportIpercCinco'></textarea>",
                     divContainer:"divAreaImportIperc"},
                    {sugerencia:"",label:" ",
                     inputForm:"<button type='submit' class='btn btn-success'>" +
                     	          "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
                     	       "</button>"} 
					   ];
	     
	     var textImportIpercCinco="";
   		
	     listItemsImportIpercCinco.forEach(function(val,index){
   	        textImportIpercCinco+=obtenerSubPanelModulo(val);
	     });

	     agregarPanelesDivPrincipalVersionDos(listPanelesPrincipal);
			
	     data.proyectos.forEach(function(val){
	        var actividadesId = val.actividadesPermitidasId.split(",");
			
	        actividadesId.forEach(function(val1){
		   $("#tr"+val1+"PlanProyecto"+val.id).remove();
	        });
	     });
			
	     var listEditarPrincipal=[
	            {id:"importIpercProyecto",clase:"contenidoFormVisible",
	             nombre:""+"Editar tr s",
	             contenido:"<form id='formImportIperc' class='eventoGeneral'>"+textImportIperc+"</form>"},
	            {id:"importIpercProyectoCinco",clase:"contenidoFormVisible",
	             nombre:""+"Editar tr s",
		     contenido:"<form id='formImportIpercCinco' class='eventoGeneral'>"+textImportIpercCinco+"</form>"},
		    {id:"editarMovilTrabProy",clase:"contenidoFormVisible",
		     nombre:""+"Editar trabajdresdsssss",
		     contenido:"<form id='formEditarTrabajadores' class='eventoGeneral'>"+textTrabajdor+"</form>"},
		    {id:"editarMovilDocProy",clase:"contenidoFormVisible",
		     nombre:""+"Editar documento",
		     contenido:"<form id='formEditarDocumento' class='eventoGeneral'>"+textoForm+"</form>"},
		    {id:"editarMovilFormProy",clase:"contenidoFormVisible",
		     nombre:""+"Editar formación",
		     contenido:"<form id='formEditarFormacion' class='eventoGeneral'>"+textFormFormacion+"</form>"},
		    {id:"editarMovilActivProy",clase:"contenidoFormVisible",nombre:""+"Editar act",contenido:textFormActividad},
		    {id:"editarMovilObsProy" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar observacion",
		     contenido:"<form id='formEditarObservacion' class='eventoGeneral'>"+textObservacion+"</form>"},
		    {id:"editarMovilObsContr" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar observacion",
		     contenido:"<form id='formEditarObservacionContr' class='eventoGeneral'>"+textoObsContratista+"</form>"},	
		    {id:"editarMovilAuditoriaProy" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar formación",
		     contenido:"<form id='formEditarAuditoria' class='eventoGeneral'>"+textAuditorias+"</form>"},
		    {id:"editarMovilIncidentProy" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar act",
		     contenido:"<form id='formEditarIncidente' class='eventoGeneral'>"+textIncidentes+"</form>"},
		    {id:"editarMovilIpercProy" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar iperc",
		     contenido:"<form id='formEditarIperc' class='eventoGeneral'>"+textIperc+"</form>"},
		    {id:"editarMovilControlIperc" ,clase:"contenidoFormVisible",
		     nombre:""+"Editar iperc",
		     contenido:"<form id='formEditarControlIperc' class='eventoGeneral'>"+textControlIperc+"</form>"},
		    {id:"editarMovilFinalIperc" ,clase:"contenidoFormVisible",
		     nombre:""+" ",
		     contenido:"<form id='formEditarFinalIperc' class='eventoGeneral'>"+textFinalIperc+"</form>"}
				     ];
			
	     agregarPanelesDivPrincipal(listEditarPrincipal);
	     //
	     var inputPeligro = $("#inputPelIperc"); 
			
	     ponerListaSugerida("inputPelIperc",[],true);
	     ponerListaSugerida("inputRiesgoIperc",[],true);
	     ponerListaSugerida("inputConsecuenciaIperc",[],true);
	     inputPeligro.on( "autocompleteclose", buscarSugeridoPeligro);
	     //
	     $('#formEditarDocumento').on('submit',function(e){  
	        e.preventDefault();   
	        guardarPostulanteEvaluacionOnline();
	     });
			 
	     $('#formEditarFormacion').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarConfirmacion();
	     });       
			 
	     $('#formEditarActividad').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarActProyecto();
	     });
			 
	     $('#formEditarObservacion').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarAccionAuditoria();
	     });
			 
	     $('#formEditarTrabajadores').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarTrabsProyecto();
	     });
			 
	     $('#formEditarIperc').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarIpercProyecto();
	     });
			 
	     $('#formEditarControlIperc').on('submit',function(e){ 
	        e.preventDefault();   
	        guardarControlIperc();
	     });
			 
	     $('#formEditarFinalIperc').on('submit', function(e) { 
	        e.preventDefault();   
	        guardarFinalIperc();
	     });
	     
	     $('#formEditarObservacionContr').on('submit', function(e) { 
	        e.preventDefault();   
	        guardarAccionObservacionContratista();
	     });
			 
	     $('#importIpercProyecto').on('submit', function(e) { 
	        e.preventDefault();   
	        guardarImportIpercProyecto();
	     });
	
	     $('#importIpercProyectoCinco').on('submit', function(e) { 
	        e.preventDefault();   
	        guardarImportIpercProyectoCinco();
	     });
			 
	     $("#btnAgregarNuevoAccion").on("click",function(e){
		e.preventDefault();
		guardarAccionAuditoria(function(){
		   alert("Acción Guardada!");
		   if(objAccAuditoria.observacionId > 0){
		      nuevaAccionAuditoria(indexObs);
		   }else if(objAccAuditoria.accidenteId > 0){
		      nuevaAccionIncidente(indexIncidente);
		   }else if(objAccAuditoria.detalleAuditoriaId > 0){
		      nuevaAccionDetalleAuditoria(indexDetalleAudi);
		   }else if(objAccAuditoria.hallazgoId > 0){
		      nuevaAccionHallazgoAuditoria(objAuditoria.index);
		   }
					
		   $.unblockUI();
		});
	     });
			 
	     $(".contenidoFormVisible").hide();
//	     completarBarraCarga();
	     break;
      }
   });
   
   completarBarraCarga();	
}

function crearDivRequisitosProyectoContratista(nombreRequisito,nombreStyle,idRequisito,indicadorDecimal,
   nombreFuncion,pindex,idAux,idActividad,nombreEnlace,indicador,observacion,textoBoton,nombreClass){
   var observacionAux = (observacion == null || observacion == ""?"":
      iconoGosst.advertir+"<strong style='color:#c0504d'>"+observacion+"</strong>");
	    
   var funcionPrincipal = (idActividad == null?
      nombreFuncion+"("+pindex+");":nombreFuncion+"("+pindex+","+idActividad+");")
	    
   var divRequisitos =   
      "<tr title='"+nombreRequisito+"' "+(idRequisito.length == 0?"":"id='"+idRequisito+"'")+">" +
         "<td>" +
	    "<i aria-hidden='true' class='"+nombreStyle+"'></i> "+nombreRequisito +
	    "<div class='barraIndicadorProyecto' " +
		 "style='width:"+pasarDecimalPorcentaje(indicadorDecimal)+";" +
	         "background-color:"+colorPuntajeGosst(indicadorDecimal)+";'>" +
	    "</div>" +
	     (nombreEnlace.length == 0?"<br>":
	      "<div class='row'>" + 
	         "<a class='efectoLink' onclick='"+funcionPrincipal+"alterarTextoBoton(this,"+idAux+","+idActividad+",\""+nombreEnlace+"\")'>" +
	            "Ver "+nombreEnlace+" <i class='fa fa-angle-double-down'></i>" +
	         "</a>" +
	      "</div>") + 
	 "</td>" + 
	 "<td class='celdaIndicadorProyecto' title='Aprobados/Total'>"+indicador+observacionAux+"</td>" +
	 "<td>"+textoBoton+"</td>"+
      "</tr>" +
      "<tr class='"+nombreClass+"' style='display:none;'></tr>";
	   
   return divRequisitos;
}

function marcarTodosTrabajadoresProyecto(){
   listFullTrabProyecto.forEach(function(val1){
      val1.isActivo = 1;val1.selected = 1;
   });
	
   insertarSelectTrabajadoresProyecto();
}

function desmarcarTodosTrabajadoresProyecto(){
   listFullTrabProyecto.forEach(function(val1){
      val1.isActivo = 0;val1.selected = 0;
   });
 	
   insertarSelectTrabajadoresProyecto();
}

function verificarProyectoId(proyectoIndex){
	indexPostulante=proyectoIndex;
	proyectoObj=listFullProyectoSeguridad[indexPostulante];
}
function toggleMenuOpcionActividadesContratista(obj,pindex){
	//objSugerenciaContratista=listFullSugerenciasContratistas[pindex];
	//indexSugContratista=pindex;
	$(obj).parent("#tituloEvento").find("ul").toggle();
	$(obj).parent("#tituloEvento").parent().siblings().find("ul").hide(); 	
}
function marcarSubOpcionActividadesContratista(pindex){ 
	funcionalidadesActividadesContratista[pindex].functionClick();
	$(".listaGestionGosst").hide();
}  

function habilitarVistaActividadesContratista(functionCallBack,fechaFiltro,deleteCalendar,habilitarBotones){
   var contadorImplementar=0,textImplementar="",contadorCompletado=0,
       textCompletado="",contadorRetrasado=0,textRetrasado="";
   var textFechaAppend="";
   
   $(".divTituloGeneral h4").html("Resumen de actividades");
	
   if(fechaFiltro == null){
   }else{
      var fechaTitulo = new Date(fechaFiltro);
      $(".divTituloGeneral h4").append(
         "<br> ("+fechaTitulo.getDate()+"-"+listMeses[(fechaTitulo.getMonth()+1)]+"-"+fechaTitulo.getFullYear()+")");
   }
	
   $(".divListPrincipal").html("");

   var listFullEventosContratista = []; 
	
   var dataParam={
	  empresaId:getSession("gestopcompanyid"),
	  contratistaId:getSession("contratistaGosstId"),
	  estado: {id: 2}
		 };
   
   callAjaxPost(URL+'/contratista/proyectos/resumen/contratista',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	    listFullProyectoSeguridad = data.proyectos;
	    listCategoriaActividad = data.categorias_actividades;
	    var indexAuxDoc=0,indexAuxTrab=0,indexAuxActiv=0,
		indexAuxForm=0,indexAuxObs=0,indexAuxAcc=0,indexInduccion=0;

	    listEvaluacionPostulanteOnline=[];
	    listFullTrabProyecto=[];
	    listFullActProyectoSeguridad=[];
	    listConfirmEvaluacionFull=[];
	    detalleObservacionFull=[],detalleAccAuditoriaFull=[];
	    detalleIncidenteFull=[];
	    listFullInduccionesContratista=[];
			
	    data.inducciones.forEach(function(val1,index1){
	       if(val1.evidenciaNombre != ""){
		  val1.evidenciaNombre=val1.evidenciaNombre+" ("+val1.fechaRealTexto+" )"
	       }
				
	       var eventoObj={
		      evidenciaNombre: val1.evidenciaNombre,
		      btnClick: "editarTrabajadoresInduccionContratista("+indexInduccion+") ",
		      evidenciaUrl: val1.evidenciaUrl,
		      textInicio: "("+"Inducción"+") Actividad a completar por el administrador",
		      text: " "+val1.tema,
		      proyectoIndex: "",
		      proyectoNombre: "",
		      fecha: (val1.fechaReal == null?val1.fecha:val1.fecha),
		      fechaTexto: "Fecha Planificada: "+val1.fechaTexto,
		      fechaRealTexto: ""+val1.fechaRealTexto,
		      estadoEvento: val1.estado.id,
		      iconoNombre: "<i aria-hidden='true' class='fa fa-arrow-circle-o-down '></i>"
			     };
				
				
	       if(val1.fechaReal != null || val1.fecha < new Date()){
		  if(val1.numTrabajadores > 0){ 
		     listFullEventosContratista.push(eventoObj);
		     indexInduccion++;
		     listFullInduccionesContratista.push(val1);
		  }
	       }else{
		  listFullEventosContratista.push(eventoObj);
		  indexInduccion++;
		  listFullInduccionesContratista.push(val1);
	       }
	    });
			listFullProyectoSeguridad=data.proyectos;
			listFullProyectoSeguridad.forEach(function(val,index){
				if(val.estado.id!=1){
					var indicadorPositivo=0,indicadorTotal=0;
					var estadoEvento="",claseEvento="";
					 
					val.trabajadores.forEach(function(val1,index1){
						if(val1.proyectoActual!=null){
							indicadorTotal++; 
						if(val1.indicadorExamenMedico!=null && val1.indicadorSctr!=null ){
							indicadorPositivo++;
							 estadoEvento=2;
							 claseEvento="gosst-aprobado";
						}else{
							 estadoEvento=1;
							 claseEvento="gosst-neutral"; 
						}  
						//indexAuxTrab++; 
						}
					});
					
				
					var eventoObj={
							evidenciaNombre: "",
							btnClick:"nuevoTrabProyecto("+index+")",
							evidenciaUrl:"",textInicio:"Trabajadores",
							text:indicadorPositivo+" de "+indicadorTotal+" trabajador(es) apto(s)",
							proyectoIndex:index,
							proyectoNombre:val.titulo,
							fecha:0,
							fechaTexto:"",
							iconoNombre:"<i aria-hidden='true' class='fa fa-medkit'></i>"};
					 
					if(indicadorPositivo==indicadorTotal && indicadorTotal>0){
						eventoObj.estadoEvento=2;
						eventoObj.clase="gosst-aprobado";
					}else{
						eventoObj.estadoEvento=1;
						 eventoObj.clase="gosst-neutral"; 
					} 
				//	listFullEventosContratista.push(eventoObj);
				}
				if(val.estado.id!=3 && val.postulante.estado.id==2){
					 
						val.documentos.forEach(function(val1,index1){
							var nota = "";
							listCumple.forEach(function(val2,index2){
								if(val2.id==val1.isAprobado){
									nota=val2.nombre;
								}
							});
							var eventoObj={
									evidenciaNombre: val1.evidenciaNombre,
									btnClick:"editarEvaluacionPostulanteOnline("+indexAuxDoc+")",
									evidenciaUrl:"/contratista/proyecto/postulante/evaluacion/evidencia?id="+val1.id,
									textInicio:"("+"Documento postulante"+" )",
									text:""+nota+" - "+val1.preguntaNombre,
									proyectoIndex:index,
									proyectoNombre:val.titulo,
									fecha:0,
									fechaReal:0,
									fechaTexto:"",
									iconoNombre:"<i aria-hidden='true' class='fa fa-files-o'></i>"};
							
							if(val1.isAprobado==1){ 
								eventoObj.estadoEvento=2;
								eventoObj.clase="gosst-aprobado";
							}else{
								eventoObj.estadoEvento=1;
								eventoObj.clase="gosst-neutral"; 
							} 
						//	listFullEventosContratista.push(eventoObj);
						//	indexAuxDoc++;
						//	listEvaluacionPostulanteOnline.push(val1);
						});
					 
				}
				if(val.estado.id!=1 ){ 
					val.actividades.forEach(function(val1,index1){
						if(val1.tipo.id==1){
						if(val1.evidenciaNombre!=""){
							val1.evidenciaNombre=val1.evidenciaNombre+" ("+val1.fechaRealTexto+" )"
						} 
						var eventoObj={
								evidenciaNombre: val1.evidenciaNombre,
								btnClick:"editarActProyecto("+indexAuxActiv+")",
								evidenciaUrl:"/contratista/proyecto/actividad/evidencia?id="+val1.id,
								textInicio:"("+val1.tipo.nombre+") ",
								text:val1.descripcion,
								proyectoIndex:index, 
								proyectoNombre:val.titulo,
								fecha:(val1.fechaReal==null?val1.fechaPlanificada:val1.fechaReal),
								 
								fechaTexto:"Fecha Planificada: "+val1.fechaPlanificadaTexto,
								fechaRealTexto:""+val1.fechaRealTexto,
								estadoEvento:val1.estado.id,
								iconoNombre:"<i aria-hidden='true' class='fa fa-sort-amount-asc'></i>"};
						
						 
						listFullEventosContratista.push(eventoObj);
						indexAuxActiv++;
						listFullActProyectoSeguridad.push(val1);
						}
					});
				 
				}
				if(val.estado.id!=1 ){
					 
					val.formaciones.forEach(function(val1,index1){

						
						if(val1.evaluacionId==1){
						val1.extensiones.forEach(function(val2,index2){
							if(val2.evidenciaNombre!=""){
								val2.evidenciaNombre=val2.evidenciaNombre+" ("+val2.fechaRealTexto+" )"
							}
							var eventoObj={
									evidenciaNombre: val2.evidenciaNombre,
									btnClick:"objConfirmEvaluacion=" +
											"listConfirmEvaluacionFull["+indexAuxForm+"];" +
													"editarConfirmacion("+indexAuxForm+")",
									evidenciaUrl:"/capacitacion/curso/evaluacion/confirmacion/evidencia?id="+val2.id,
									textInicio:"("+val2.estado.nombre+") Extensión Capacitación Online ",
									text:"("+val1.cursoNombre+")" ,
									proyectoIndex:index,
									proyectoNombre:val.titulo,
									fecha:(val2.fechaReal==null?val2.fechaPlanificada:val2.fechaReal),
									fechaTexto:"Fecha Planificada: "+val2.fechaPlanificadaTexto,
									fechaRealTexto:""+val2.fechaRealTexto,
									estadoEvento:val2.estado.id,
									iconoNombre:"<i aria-hidden='true' class='fa fa-graduation-cap'></i>"};
							
							 
							listFullEventosContratista.push(eventoObj);
							indexAuxForm++;
							listConfirmEvaluacionFull.push(val2);
						}); 
						} 
					}); 
				}
				if(val.estado.id!=1 ){ 
					val.observacionesList.forEach(function(val1,index1){
						val1.acciones.forEach(function(val2,index2){ 
						if(true){
							if(val2.evidenciaNombre!="" &&   val2.evidenciaNombre!="----" ){
								val2.evidenciaNombre=val2.evidenciaNombre+" ("+val2.fechaRealTexto+" )"
							}
							var eventoObj={
									evidenciaNombre: val2.evidenciaNombre,
									btnClick:"objAuditoria="+
											 "{index:"+index1+" };objAccAuditoria=" +
											"detalleAccAuditoriaFull["+indexAuxObs+"];" +
													"editarAccAuditoria("+indexAuxObs+")",
									evidenciaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.id,
									textInicio:"("+"Acción de mejora"+") / Observación ("+val1.reporte.nombre+
									" - "+val1.factor.nombre+" - "+val1.descripcion+")",
									
									text:val2.descripcion ,
									proyectoIndex:index,
									proyectoNombre:val.titulo,
									fecha:(val2.fechaReal==null?val2.fechaRevision:val2.fechaReal),
									fechaTexto:"Fecha Planificada: "+val2.fechaRevisionTexto,
									fechaRealTexto:""+val2.fechaRealTexto,
									estadoEvento:val2.estadoId,
									iconoNombre:"<i aria-hidden='true' class='fa fa-eye'></i>"};
							
							 
							listFullEventosContratista.push(eventoObj);
							indexAuxObs++;
							val2.id=val2.accionMejoraId;
							val2.observacionId=val1.id;
							
							detalleAccAuditoriaFull.push(val2);
						}
						}); 
						detalleObservacionFull.push(val1);
					});
					val.accidentes.forEach(function(val1,index1){
						val1.acciones.forEach(function(val2,index2){
							if(val2.evidenciaNombre!="" &&   val2.evidenciaNombre!="----" ){
								val2.evidenciaNombre=val2.evidenciaNombre+" ("+val2.fechaRealTexto+" )"
							}
							var eventoObj={
									evidenciaNombre: val2.evidenciaNombre,
									btnClick:"objAuditoria="+
											 "{index:"+index1+" };objAccAuditoria=" +
											"detalleAccAuditoriaFull["+indexAuxObs+"];" +
													"editarAccAuditoria("+indexAuxObs+")",
									evidenciaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.id,
									textInicio:"("+"Acción de mejora"+") / Incidente (  "+val1.accidenteTipoNombre+")",
									text:val2.descripcion ,
									proyectoIndex:index,
									proyectoNombre:val.titulo,
									fecha:(val2.fechaReal==null?val2.fechaRevision:val2.fechaReal),
									fechaTexto:"Fecha Planificada: "+val2.fechaRevisionTexto,
									fechaRealTexto:""+val2.fechaRealTexto,
									estadoEvento:val2.estadoId,
									iconoNombre:"<i aria-hidden='true' class='fa fa-warning'></i>"};
							
							 
							listFullEventosContratista.push(eventoObj);
							indexAuxObs++;
							val2.id=val2.accionMejoraId;
							val2.accidenteId=val1.accidenteId;
							
							detalleAccAuditoriaFull.push(val2);
						}); 
						detalleIncidenteFull.push(val1);
					});
					val.auditorias.forEach(function(val4,index4){
						val4.respuestas.forEach(function(val1,index1){
							if(val1.detalleAuditoriaId>0 && val1.bitAplica==1){
							val1.acciones.forEach(function(val2,index2){
								if(val2.evidenciaNombre!="" &&   val2.evidenciaNombre!="----" ){
									val2.evidenciaNombre=val2.evidenciaNombre+" ("+val2.fechaRealTexto+" )"
								}
								var eventoObj={
										evidenciaNombre: val2.evidenciaNombre,
										btnClick:"objAuditoria="+
												 "{index:"+index1+" };objAccAuditoria=" +
												"detalleAccAuditoriaFull["+indexAuxObs+"];" +
														"editarAccAuditoria("+indexAuxObs+")",
										evidenciaUrl:"/gestionaccionmejora/accionmejora/evidencia?accionMejoraId="+val2.id,
										textInicio:"("+"Acción de mejora"+") / Auditoría (  "+val4.auditoriaTipoNombre+")" ,
										text:
												   val1.verificacion +
												"<br>" +val2.descripcion,
										proyectoIndex:index,
										proyectoNombre:val.titulo,
										fecha:(val2.fechaReal==null?val2.fechaRevision:val2.fechaReal),
										fechaTexto:"Fecha Planificada: "+val2.fechaRevisionTexto,
										fechaRealTexto:""+val2.fechaRealTexto,
										estadoEvento:val2.estadoId,
										iconoNombre:"<i aria-hidden='true' class='fa fa-check-square-o'></i>"};
								
								 
								listFullEventosContratista.push(eventoObj);
								indexAuxObs++;
								val2.id=val2.accionMejoraId;
								val2.detalleAuditoriaId=val1.detalleAuditoriaId;
								
								detalleAccAuditoriaFull.push(val2);
							}); 
							detalleAuditoriaFull.push(val1);
							}
						});
						
					});	
				}
			});
			//////////////7
			listFullEventosContratista.sort(function(a,b){ 
				  return new Date(b.fecha) - new Date(a.fecha);
				});
			listFullEventosContratista.filter(function(val,index){
				var condicionFecha=false;
				
				if(fechaFiltro==null){
					condicionFecha=true;
				}else{
					var fechaAux=new Date(fechaFiltro);
					var fechaEvento=new Date(val.fecha);
					//fechaAux.setTime(fechaFiltro)
					if(fechaAux.getFullYear()==fechaEvento.getUTCFullYear()
							&& fechaAux.getMonth()==fechaEvento.getUTCMonth()
							&& fechaAux.getDate()==fechaEvento.getUTCDate()){
						condicionFecha=true;
					}
				}
				return condicionFecha;
			}).forEach(function(val,index){
				var respAux=val.responsable; 
				var iconoEvi=""+val.evidenciaNombre;
				if(val.evidenciaNombre=="" || val.evidenciaNombre=="----"){
					iconoEvi="Sin evidencia"
				}
				var evidenciaFinalTexto="";
				if(val.evidenciaNombre!=""  && val.evidenciaNombre!="----"){
					evidenciaFinalTexto="<a  id='evidenciaEvento"+val.id+"' href='"+URL+val.evidenciaUrl+" ' class='efectoLink' target='_blank'>" +
					iconoEvi+
					
					"</a>";
				}
				if(evidenciaFinalTexto==""){
					evidenciaFinalTexto="No hay evidencia";
				}
				var textoBoton="<button class='btn btn-success'  >" +
				"<i class='fa fa-external-link-square' aria-hidden='true'></i>Editar</button>";
				var textoButonAux="<button class='btn btn-success' id='irModulo"+val.id+"'>" +
				"<i class='fa fa-chevron-circle-right' aria-hidden='true'></i> " +
				"Editar</button>" ;
				textoButonAux="";
				textoBoton="";
				var divContainer;
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				menuOpcion+="<li class='list-group-item' onclick='verificarProyectoId("+val.proyectoIndex+");"+val.btnClick+"'> <i class='fa fa-trash-o'></i> &nbsp Editar </li>"
				
				menuOpcion+="</ul>";
				 var textIn="<div class='eventoGeneral '  >" +
					"<div id='tituloEvento'>"+
					"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionActividadesContratista(this,"+index+")'>" +
					"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
					menuOpcion+
					"<table class='actividadMovil'>" +
						"<tbody>" +
							"<tr>" +
							" <td colspan='2' style='font-weight: 900; color: black;font-size: 16px;'> "+val.textInicio+" </td>" +
							"</tr>"+
							"<tr>"+
							"<td style='width:30px'>"+val.iconoNombre+"</td><td>"+val.text+"</td>" +
							"</tr>" +
							"<tr>" +
							"<td>"+""+"</td><td>"+"<strong >(Proyecto: " +val.proyectoNombre+")  </strong>"+"</td>" +
							"</tr>" +
							"<tr>" +
							"<td>"+"<i class='fa fa-calendar' aria-hidden='true'></i>"+"</td> <td>"+val.fechaTexto+"</td>" +
							"</tr>" +
							"<tr>" +
							"<td>"+"<i class='fa fa-calendar-check-o' aria-hidden='true'></i>"+"</td> <td>Fecha Real"+val.fechaRealTexto+"</td>" +
							"</tr>" +
							"<tr>" +
							"<td>"+"<i class='fa fa-download' aria-hidden='true'></i>"+"</td><td>"+evidenciaFinalTexto+"</td>" +
							"</tr>" +
						"</tbody>" +
					"</table>" + 
						"<div id='btnAcceso'>" +
						textoBoton+
						textoButonAux+
						"</div>"+
					"</div>" +
					"</div>" ;
						switch(val.estadoEvento){
						case 1:
							contadorImplementar++;
							textImplementar+=textIn;
							divContainer="subListImplementar";
							break;
						case 2:
							contadorCompletado++;
							textCompletado+=textIn;
							divContainer="subListCompletado";
							textoBoton="";
							break;
						case 3:
							contadorRetrasado++;
							textRetrasado+=textIn;  
							divContainer="subListRetrasado";
							break;
						}  
			});
			if(functionCallBack!=null){
				functionCallBack(listFullEventosContratista);
				}
			if(habilitarBotones==null){
				
			
			var listPanelesPrincipal=[];
		listPanelesPrincipal.push(
				{id:"subListImplementar",clase:"divProyectoGeneral",
					nombre:"Por Implementar  ("+contadorImplementar+")",
					contenido:textImplementar},
				{id:"subListCompletado",clase:"divProyectoGeneral",
					nombre:"Completado  ("+contadorCompletado+")",
					contenido:textCompletado},
				{id:"subListRetrasado",clase:"divProyectoGeneral",
					nombre:"Retrasado ("+contadorRetrasado+")",
					contenido:textRetrasado}); 
		if(contadorRetrasado+contadorImplementar>0){ 
			$("#alertaActividadTrabajador").remove();
			$("#icoPendientes a").append("<div class='numAlertas' id='alertaActividadTrabajador'>"+(contadorRetrasado+contadorImplementar)+"</div>")
		}
		agregarPanelesDivPrincipal(listPanelesPrincipal);
		$(".listaGestionGosst").hide();
		$(".divListPrincipal #subListImplementar .tituloSubList").css({"color":"#df9226"})
		$(".divListPrincipal #subListRetrasado .tituloSubList").css({"color":"#C0504D"})
		$(".divListPrincipal #subListCompletado .tituloSubList").css({"color":"#9BBB59"})
		var textoForm="",textFormFormacion="",textFormActividad="";
		var textObservacion="",textAuditorias="",textIncidentes="",textTrabajdor="";
	var listItemsTrab=[
	{sugerencia:"",label:" ",inputForm:"<button type='button' class='btn btn-success' onclick='marcarTodosTrabajadoresProyecto()' ><i aria-hidden='true' class='fa fa-check'></i>Agregar Todos</button>"},
	{sugerencia:"",label:"Trabajadores",inputForm:"",divContainer:"divSelTrabProy"},
	{sugerencia:"",label:"Trabajadores Inactivos",inputForm:"",divContainer:"divSelTrabProyInhab"},
	{sugerencia:" ",label:"Fecha de modificación",inputForm:"<h5>"+obtenerFechaActualNormal()+"</h5>"},
	 {sugerencia:"",label:" ",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"}
						];
	var listItemsForm=[
	           		{sugerencia:"",label:"Item a evaluar",inputForm:"<h5 id='trMovilItem'></h5>"},
	           		{sugerencia:"Ej: Necesito más información, ¿Involucra todo el proyecto?",label:"Observación del Contratista",inputForm:"<input type='text' class='form-control' id='observacionEval' placeholder=' '>"},
	           		{sugerencia:"Ej: Documento legal, Foto",label:"Evidencia",inputForm:"",divContainer:"eviDocumento"},
	           		{sugerencia:"",label:"Observación del Contratante",inputForm:"<h5 id='trMovilObservacion'></h5>"},
	           		{sugerencia:"",label:" ",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"}
	           							];
	var listItemsFormFormacion=[
{sugerencia:"Si ya ha realizado la actividad, solo introduzca la evidencia",label:"Fecha planificada",inputForm:"<input type='date' class='form-control' id='inputFecConf' placeholder=' '>"},
 {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviDocumentoFormacion"},
	           		{sugerencia:"",label:" ",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"}];
	
	var listItemsFormActividad=[  
	   {sugerencia:"",label:"Categoria",divContainer:"divCategActiv",inputForm:""},
	   {sugerencia:"",label:"Actividad",divContainer:"divDescActiv",
	    inputForm:"<input type='text' class='form-control' id='inputDescActProy' placeholder=''>"},
	   {sugerencia:"Si ya ha realizado la actividad, solo introduzca la evidencia",
            divContainer:"divFechaPlanActiv",label:"Fecha planificada",
            inputForm:"<input type='date' class='form-control' id='inputFecPlanActProy' placeholder=''>"},
	   {sugerencia:"Completar estos campos una vez se haya completado la actividad",
            divContainer:"divMensajeActividad",label:"",inputForm:""},
	   {sugerencia:"",divContainer:"divSeparatorActividad",label:"",inputForm:""},
	   {sugerencia:"",label:"Evidencia",inputForm:"",divContainer:"eviActividad"},
	   {sugerencia:"",label:"Procedimiento de actividad de alto riesgo" +
                                "<br><span style='color:blue;font-weight:bolder;'>(Opcional)</span>",
            inputForm:"",divContainer:"eviActProcActAltRiesgo"},
	   {sugerencia:"valor del 0 al 100",divContainer:"divPuntajeActividad",label:"% de cumplimiento",
	    inputForm:"<input min='0' max='100' step='1' type='number' class='form-control' id='inputPuntajeActProy'>"},
	   {sugerencia:"",divContainer:"expoActividad",label:"Expositor",
            inputForm:"<input type='text' class='form-control' id='inputExpoActProy' placeholder=''>"},
	   {sugerencia:"",divContainer:"numTrabActividad",label:"# Trabajadores",
            inputForm:"<input type='number' class='form-control' id='inputNumTrabActProy' placeholder=''>"},
	   {sugerencia:"",divContainer:"duracionActividad",label:"Duración (minutos)",
            inputForm:"<input type='number' class='form-control' id='inputDuraActProy' placeholder=''>"},
	   {sugerencia:"",label:"Observación del Contratista",divContainer:"divObsActProy",
            inputForm:"<input type='text' class='form-control' id='inputObsActProy' placeholder=''>"},
           {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	   {sugerencia:"",label:"",
            inputForm:"<button type='submit' class='btn btn-success' style='float:right;font-size:18px;'>" +
            	         "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
            	      "</button>"} 
        ];
	
	var listItemsFormObservacion=[
{sugerencia:"",label:"Acción de mejora",inputForm:"<input type='text' class='form-control' id='inputDescAcc' placeholder=' '>"},
{sugerencia:"Si ya ha realizado la acción, solo introduzca la evidencia",label:"Fecha planificada",inputForm:"<input type='date' class='form-control' id='inputFecAcc' placeholder=' '>"},
{sugerencia:"Ej: El incidente fue causado por un peatón, fue un evento fortuito ",label:"Observación del contratista",inputForm:"<input type='text' class='form-control' id='inputObsAcc' placeholder=' '>"},
{sugerencia:"",label:"Evidencia",inputForm:" ",divContainer:"eviAccionMejora"}, 
{sugerencia:"",label:" ",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
		
	                              ];
	var listItemsFormAuditorias=[ ];
	var listItemsFormIncidentes=[ ];
	listItemsTrab.forEach(function(val,index){
		textTrabajdor+=obtenerSubPanelModulo(val)
	})
	listItemsForm.forEach(function(val,index){
		textoForm+=obtenerSubPanelModulo(val)
	});
	listItemsFormFormacion.forEach(function(val,index){
		textFormFormacion+=obtenerSubPanelModulo(val);
	});
	
	textFormActividad += "<div class='eventoGeneral'>" +
                                "<form id='formEditarActividad' class='eventoGeneral'>";
        listItemsFormActividad.forEach(function(val,index){
           textFormActividad += obtenerSubPanelModuloVersionDos(val);
        });
        textFormActividad +=    "</form>" +
                             "</div>";
	
	listItemsFormObservacion.forEach(function(val,index){
		textObservacion+=obtenerSubPanelModulo(val)
	});
	listItemsFormAuditorias.forEach(function(val,index){
		textAuditorias+=obtenerSubPanelModulo(val);
	});
	listItemsFormIncidentes.forEach(function(val,index){
		textIncidentes+=obtenerSubPanelModulo(val);
	});
	
      var listItemsExam=[ 
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
          label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
                "CUPOS</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Totales",inputForm:"",divContainer:"divTotalCupoInduc"},
         {sugerencia:"",label:"Cubiertos",inputForm:"",divContainer:"divCubiertosCupoInduc"},
         {sugerencia:"",label:"Disponibles",inputForm:"",divContainer:"divCupoInduc"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	  label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	        "MIS TRABAJADORES</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Inscritos",inputForm:"",divContainer:"divTrabCupoInduc"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Registrar",inputForm:"",divContainer:"divSelTrabInduc"},
         {sugerencia:"",label:"",divContainer:"",
     	  inputForm:"<span style='font-size:12px;font-weight:bolder;color:red;'>" +
     		    "[Una vez registrado(s) su(s) trabajador(es), no podrá(n) ser retirado(s) de la inducción]</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
         {sugerencia:"",anchoLabel:"col-sm-8",anchoDiv:"col-sm-4",inputForm:"",
	  label:"<span style='color:blue;font-size:18px;font-weight:bolder;'>" +
	        "DATOS ADICIONALES</span>"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"",label:"Vigencia",inputForm:"",divContainer:"divVigInduc"},
         {sugerencia:"",label:"Fecha planificada",inputForm:" ",divContainer:"divFechaInduc"}, 
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
         {sugerencia:"Ej. documentos, escaneos",label:"Evidencia",inputForm:"",divContainer:"eviExamContratista"},
         {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
	 {sugerencia:"",label:"",divContainer:"divSubmitButton",
	  inputForm:"<button type='submit' class='btn btn-success'>" +
	               "<i aria-hidden='true' class='fa fa-paper-plane'></i> Enviar" +
	            "</button>"} 
      ];
      
      var textInducciones = "";
	  		
      listItemsExam.forEach(function(val,index){
         textInducciones += obtenerSubPanelModuloVersionDos(val);
      });
      
      var listEditarPrincipal=[
								{id:"editarMovilTrabProy" ,clase:"contenidoFormVisible",
								nombre:""+"Editar trabajdresdsssss",
								contenido:"<form id='formEditarTrabajadores' class='eventoGeneral'>"+textTrabajdor+"</form>"},
		 						{id:"editarMovilDocProy" ,clase:"contenidoFormVisible",
		 							nombre:""+"Editar documento",
		 							contenido:"<form id='formEditarDocumento' class='eventoGeneral'>"+textoForm+"</form>"},
	 							{id:"editarMovilFormProy" ,clase:"contenidoFormVisible",
		 							nombre:""+"Editar formación",
		 							contenido:"<form id='formEditarFormacion' class='eventoGeneral'>"+textFormFormacion+"</form>"},
	 {id:"editarMovilActivProy" ,clase:"contenidoFormVisible",nombre:""+"Editar act",contenido:textFormActividad},
	 							{id:"editarMovilObsProy" ,clase:"contenidoFormVisible",
		 							nombre:""+"Editar observacion",
		 							contenido:"<form id='formEditarObservacion' class='eventoGeneral'>"+textObservacion+"</form>"},
	 							{id:"editarMovilAuditoriaProy" ,clase:"contenidoFormVisible",
		 							nombre:""+"Editar formación",
		 							contenido:"<form id='formEditarAuditoria' class='eventoGeneral'>"+textAuditorias+"</form>"},
	 							{id:"editarMovilIncidentProy" ,clase:"contenidoFormVisible",
		 							nombre:""+"Editar act",
		 							contenido:"<form id='formEditarIncidente' class='eventoGeneral'>"+textIncidentes+"</form>"},
	 							{id:"editarMovilInduccion" ,clase:"contenidoFormVisible",
			 							nombre:""+"Editar act",
			 							contenido:"<form id='formEditarInduccion' class='eventoGeneral'>"+textInducciones+"</form>"}];
		agregarPanelesDivPrincipal(listEditarPrincipal);
		var fechaAyuda=new Date();
		 $('#formEditarTrabajadores').on('submit', function(e) { 
		        e.preventDefault();   
		        guardarTrabsProyecto(
		        		function(){
		        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
		        		});
		 });
		$('#formEditarDocumento').on('submit', function(e) {  
	        e.preventDefault();   
	        guardarPostulanteEvaluacionOnline(
	        		function(){
	        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
	        		});
		 });
		 $('#formEditarFormacion').on('submit', function(e) { 
		        e.preventDefault();   
		        guardarConfirmacion(
		        		function(){
		        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
		        		});
		 });       
		 $('#formEditarActividad').on('submit', function(e) { 
		        e.preventDefault();   
		        guardarActProyecto(
		        		function(){
		        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
		        		});
		 });
		 $('#formEditarObservacion').on('submit', function(e) { 
		        e.preventDefault();   
		        guardarAccionAuditoria(
		        		function(){
		        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
		        		});
		 });
		
		 $('#formEditarInduccion').on('submit', function(e) { 
		        e.preventDefault();   
		        guardarInduccionContratista(
		        		function(){
		        			habilitarVistaActividadesContratista(organizarActividadesContratistas,fechaFiltro);
		        		});
		 });
			$(".contenidoFormVisible").hide();
			
			if(deleteCalendar!=null){
				$("#subListImplementar:first").remove();
				$("#subListCompletado:first").remove();
				$("#subListRetrasado:first").remove();
			}
			completarBarraCarga();
			}
		break;
		}
	
	});
	
		
}

var idRespSstAux;

function ocultarEditarDatosResponsableSst(){
   $("#modalEditarResponsableSst").modal("hide");
}

function editarDatosResponsableSst(idRespSst){
    
   idRespSstAux = parseInt(idRespSst);
   
   $("#modalEditarResponsableSst").remove();
 
   var dataParam={ 
          id: idRespSstAux
	         }
	   
   callAjaxPost(URL+'/contratista/proyecto/responsablesst',dataParam,function(data){
      var responsableSst = data.responsableSst;
     
      var contenido ="";
	    
      var listContenido = [];
	
      var listContenido=[
	     {sugerencia:"",label:"Responsable",
	      inputForm:"<input id='responsableSstNombre' class='form-control'>"},
	     {sugerencia:"",label:"Telefono",
	      inputForm:"<input id='responsableSstTelefono' class='form-control'>"},
	     {sugerencia:"",label:"Correo",
	      inputForm:"<input id='responsableSstCorreo' class='form-control'>"},
	     {sugerencia:"",label:"",inputForm:""}, 
	     {sugerencia:"",
	      label:"<button class='btn btn-danger' type='button' " +
	   		    "onclick='ocultarEditarDatosResponsableSst()'>" +
	       	       "<i class='fa fa-times'></i> Cancelar" +
	       	    "</button>",
	      inputForm:"<button class='btn btn-success' style='float:right;' type='button' " +
	      		        "onclick='actualizarDatosResponsableSst()'>" +
	                   "<i class='fa fa-floppy-o'></i> Guardar" +
	                "</button>"},
	                ];
	    
      listContenido.forEach(function(val){
         contenido += obtenerSubPanelModuloGeneral(val);
      });
	
      var modalOptions={
	     id: "modalEditarResponsableSst",
	     nombre: "<i class='fa fa-user'></i> Editar Datos - Responsable SST",
	     contenido: "<form class='eventoGeneral'>"+contenido+"</form>"
	               };
	
    crearModalPrincipalUsuario(modalOptions,function(){},false);
    
    $("#responsableSstNombre").val(responsableSst.responsable);
    $("#responsableSstTelefono").val(responsableSst.telefono);
    $("#responsableSstCorreo").val(responsableSst.correo);
    
    $("#modalEditarResponsableSst").modal("show");
   });
}

function actualizarDatosResponsableSst(idAux){
   var campoVacio = true;

   var responsable = $("#responsableSstNombre").val();
   var telefono = $("#responsableSstTelefono").val();
   var correo = $("#responsableSstCorreo").val();
 	    
   var dataParam={
 	  id: idRespSstAux,
 	  responsable: responsable,
 	  telefono: telefono,
 	  correo: correo
 	         };
 	        
   callAjaxPost(URL+'/contratista/proyecto/responsablesst/save',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":	    
 	    $("#modalEditarResponsableSst").modal("hide");
 	    mensajeUx = "<label>Los datos del responsable fueron actualizados con éxito.</label>";
 	    mensajesUx(mensajeUx,1,"");
 	    	   
 	    break;
 	    	     
         default:
 	    console.log("Ocurrió un error al actualizar los datos!");
      }
   });	    	
}

function obtenerSubPanelModulo(val){
	var estiloDefault="";
	if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
		estiloDefault="    border-top: 1px solid #a5aaae;"
	}
	return "<div class='form-group row "+val.clase+"' style='"+estiloDefault+"'>"+
	   " <label for='colFormLabel' class='col-sm-4 col-form-label'>"+val.label+"</label>"+
	    "<div class='col-sm-8' id='"+val.divContainer+"'>"+
	     " "+val.inputForm+
	     "<small>"+val.sugerencia+" </small>"+
	    "</div>"+
	  "</div>";
}

function verSeccionRestringida(){
   $(".divListPrincipal").append(
      "<div id='subListCapacitacion'>" +
         "<div class='tituloSubList' style='background:#e8e6e6'>" +
            "Sin acceso al módulo.<br> " +
            "Más información consulte al administrador del sistema." +
         "</div>" +
	 "<div class='contenidoSubList'></div>" +
      "</div>");
};

function agregarPanelesDivPrincipal(listPanelesPrincipal){
   if(listPanelesPrincipal.length == 0){
      $(".divListPrincipal")
      .append("<div id='divNoResultados'>" +
	         "<div class='tituloSubList'></div>" +
		    "<div class='contenidoSubList'></div>" +
		    "</div>");
      
      $("#divNoResultados").find(".tituloSubList")
      .html(//"<i aria-hidden='true' class='fa fa-list'></i>"+ 
	    "Sin resultados"); 
   }
	
   listPanelesPrincipal.forEach(function(val,index){
      $(".divListPrincipal")
      .append("<div id='"+val.id+"' class='"+val.clase+"'>" +
	         "<div class='tituloSubList'></div>" +
		 "<div class='contenidoSubList'></div>" +
	      "</div>");
      
      var textoBtn="<button class='btn btn-success' style='padding:0px 4px 0px 4px' " +
      		           "onclick='cambiarDivSubContenido(this,"+val.proyectoId+")' " +
      		           "title='Mostrar/Ocultar los registros de esta sección.'>" +
	              "<i class='fa fa-caret-down fa-4x' aria-hidden='true'></i>" +
	           "</button>";
		
      $("#"+val.id).find(".tituloSubList")
      .html(textoBtn +//+"<i aria-hidden='true' class='fa fa-list'></i>"
	    val.nombre); 
		
      $("#"+val.id).find(".contenidoSubList").html(val.contenido);
   });	
}

function ocultarEnlaceAccesoTrabajadorContratista(){
   $("#modalAccesoTrabContratista").modal("hide"); 
}

function verEnlaceAccesoTrabajadorContratista(){
   $("#modalAccesoTrabContratista").remove(); 
    
   var contenido = "";
   
   var mensaje = (parseInt(getSession("gestopcompanyid")) == 647?
      "*Este link deberá ser transmitido a sus trabajadores para que lleven a cabo la inducción virtual ssoma " +
      "y para poder realizar trabajos en Inka Crops, la nota mínima aprobatoria es 14 y deberán adjuntar los cargos de inducción " +
      "disponibles en la sección 'Documentos compartidos por inka crops', en la casilla que aparecerá posterior a la aprobación del " +
      "examen de inducción.":"*Este link deberá ser transmitido a sus trabajadores para que lleven a cabo la inducción virtual.");
   
   var ref = URLCorto+"/pages/login_visitante.html?empresaId="+datosEmpresaAux.codigo+"&tipoVisitanteId=2" +
   	     "&contratistaRuc="+getSession("contratistaGosstRuc");
				
   var listContenido=[
      {sugerencia:"",anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",label:mensaje,inputForm:""},   
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:"",divContainer:""},
      {sugerencia:"",
       anchoLabel:"col-sm-12",anchoDiv:"col-sm-0",inputForm:"",
       label:"Acceso trabajador contratista:" +
             "<br>"+ref+
             "<br><a href='"+ref+"' class='efectoLink' target='_blank'>Ir al enlace</a>"},
      {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
      {sugerencia:"",inputForm:"",
       label:"<button class='btn btn-success' type='button' style='font-size:18px;' " +
        		"onclick='ocultarEnlaceAccesoTrabajadorContratista()'>" +
             	   "<i class='fa fa-arrow-left'></i> Volver" +
             	"</button>"}
   ]; 
				
   listContenido.forEach(function(val){
      contenido += obtenerSubPanelModuloVersionDos(val);
   });
 	
   var modalOptions={
      id:"modalAccesoTrabContratista",
      nombre:"<i class='fa fa-external-link'></i> Información",
      contenido:"<div class='eventoGeneral'>"+contenido+"</div>"
   };
				
   crearModalPrincipalUsuario(modalOptions,function(){},true,true);
}

function enlaceManualVistaContratista(){
   window.open("https://drive.google.com/file/d/1EdMfezzyJ7cKRcSUoW9zsM8ryZ4M_S62/view?usp=sharing","_blank");
}

function cerrarSesionVistaContratista(){
    (getSession("paramUrlLogin").length != 0?cerrarSesionPersonalizadoContratista():cerrarSesion());
}
