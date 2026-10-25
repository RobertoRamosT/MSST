var fichaQuimicaId,fichaQuimicaObj;
var banderaEdicion1=false;
var listNombreProductos;
var listNombreComercialProductos;
var listProveedores;
var listFuentesInformacion;
var listTipoFichaQuimica;
var listValidarAlmacen=[{id:-1,nombre:"Todos"},
                        {id:1,nombre:"Aprobado"},
                        {id:0,nombre:"Desaprobado"}];
var listFullFichaQuimica;
var listTiposProducto;
var listPictogramas;
var listOrganos;
var listCalificacionesHMISsalud;
var listCalificacionesHMISinflamabilidad;
var listCalificacionesHMISpeligrofisico;
var listCalificacionesNFPAsalud;
var listCalificacionesNFPAinflamabilidad;
var listCalificacionesNFPAreactividad;
var listCasosEspecialesNFPA;
var listEquiposProteccionPersonal;
var listAreas;

var listTabs=[
              {id:1,nombre:"FichaQ" },
           // {id:2,nombre:"Extras"    }, 
              ];
function excelFichaQuimica(){
    window.open(URL
		+ "/fichaquimica/excel?id="
		+ fichaQuimicaObj.id+"&nombreComercial="
		+ fichaQuimicaObj.nombreComercial, '_blank');	
}
$(function(){
	$("#btnNuevoFichaQuimica").attr("onclick", "javascript:nuevoFichaQuimica();");
	$("#btnCancelarFichaQuimica").attr("onclick", "javascript:cancelarFichaQuimica();");
	$("#btnGuardarFichaQuimica").attr("onclick", "javascript:guardarFichaQuimica();");
	$("#btnExcelFicha").attr("onclick", "javascript:excelFichaQuimica();");
	$("#btnEliminarFichaQuimica").attr("onclick", "javascript:eliminarFichaQuimica();");
	$("#divMsds").hide();
	//insertMenuPrimeraVez(function(){verAcordeTabFichaQuimica()});
	insertMenuPrimeraVez(function(){
	        cargarFichasQuimica();
		completarBarraCarga();
		$("#tabFichaQuimica").show();
	});
	crearModalSubirImagenEpp();
	crearModalSubirImagenOb();
	crearModalSubirImagenPp();
})
/**
 * 
 */
/*function verAcordeTabFichaQuimica(){
    	var tabId=$("#selTabFichaQuimica").val();
	var tabNombre="";
	$(".tab-content .tab-pane").hide();
	switch(parseInt(tabId)){
	case 1:
		tabNombre="tabFichaQuimica";
		cargarFichasQuimica();
		break;
		/*
	case 2:
		tabNombre="tabExtra"
		cargarExtra();
		break;
		*/ 
/*	}
	completarBarraCarga();
	$("#"+tabNombre).show();
}*/

function verSubirImagenEpp(){
	$("#modalSubirImagenEpp").modal("show");
}

function ocultarSubirImagenEpp(){
	$("#modalSubirImagenEpp").modal("hide");
}

function verSubirImagenOb(){
	$("#modalSubirImagenOb").modal("show");
}

function ocultarSubirImagenOb(){
	$("#modalSubirImagenOb").modal("hide");
}

function verSubirImagenPp(){
	$("#modalSubirImagenPp").modal("show");
}

function ocultarSubirImagenPp(){
	$("#modalSubirImagenPp").modal("hide");
}

function verFiltroFichaQuimica(){
	$("#modalFiltroFichaQuimica").modal("show");
}

function ocultarFiltroFichaQuimica(){
	$("#modalFiltroFichaQuimica").modal("hide");
}

$(document).ready(
	
    function(){
	    
	var dataParam = {
		idCompany : getSession("gestopcompanyid"),
		empresaId : getSession("gestopcompanyid")
	}; 
	
	callAjaxPost(
		URL + '/fichaquimica/filtro',
		dataParam,
		function(data) {
			
		        listNombreProductos= data.listNombreProductos;
		        listNombreComercialProductos= data.listNombreComercialProductos;
		        listProveedores= data.listProveedores;
		        listFuentesInformacion= data.listFuentesInformacion;
		        
		        listTiposProducto= data.listTiposProducto;
		        
		        listPictogramas= data.listPictogramas;
			listOrganos= data.listOrganos;
			listEquiposProteccionPersonal= data.listEquiposProteccionPersonal;
			
		        var listAreasFiltrar= $("#filtroAreasFichaQuimica").val();
		        
		        var selValidarAlmacen= crearSelectOneMenuOblig("selValidarAlmacen","",
				listValidarAlmacen,-1,"id","nombre");
		        
		        var selTiposProducto= crearSelectOneMenu("selTiposProducto","",
		        	listTiposProducto,-1,"id","nombre","Todos");
		    
			var contenido ="";
			
			var listContenido = [
             {sugerencia:"",label:"Nombre Producto",inputForm:"",divContainer: "divFiltroNombreProducto"},
             {sugerencia:"",label:"Nombre Comercial Producto",inputForm:"",divContainer: "divFiltroNombreComercialProductos"},
             {sugerencia:"",label:"Proveedor",inputForm:"",divContainer: "divFiltroProveedores"},
             {sugerencia:"",label:"Fuente de Información",inputForm:"",divContainer: "divFiltroFuentesInformacion"},
             {sugerencia:"",label:"Pictograma",inputForm:"",divContainer: "divFiltroPictograma"},
             {sugerencia:"",label:"Órgano Blanco",inputForm:"",divContainer: "divFiltroOrganoBlanco"},
             {sugerencia:"",label:"Epp",inputForm:"",divContainer: "divFiltroEpp"},
             {sugerencia:"",label:"Área",inputForm:"",divContainer: "divFiltroAreasFichaQuimica"},
             {sugerencia:"",label:"Tipo Producto",inputForm: selTiposProducto},
             {sugerencia:"",label:"Validar Almacén",inputForm: selValidarAlmacen},
             {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarFiltroFichaQuimica()'><i class='fa fa-times'></i>Cancelar</button>",
            	 inputForm:"<button class='btn btn-success' type='button' onclick='cargarValoresSeleccionadosFiltro()'><i class='fa fa-filter'></i>Aplicar filtro</button>"},
			                     ];
			listContenido.forEach(function(val){
				contenido +=obtenerSubPanelModuloGeneral(val);
			});
			var modalOptions= {id:"modalFiltroFichaQuimica",nombre:"<i class='fa fa-filter'></i>Filtros",
					contenido: contenido};
			
			crearModalPrincipalUsuario(modalOptions,function(){
			       if($("#filtroAreasFichaQuimica").length > 0){
			          return;
			       }
			       
			    crearSelectOneMenuObligMultipleCompleto
			       ("filtroAreasFichaQuimica","",data.listAreasFiltrar, "areaId","areaNameShort",
				"#divFiltroAreasFichaQuimica","Todos");
			       
			    crearSelectOneMenuObligMultipleCompleto
			      ("selMulNombreProductosFiltro","",listNombreProductos, "id","nombre",
			       "#divFiltroNombreProducto","Todos");   
			    
			    crearSelectOneMenuObligMultipleCompleto
			      ("selMulNombreComercialProductosFiltro","",listNombreComercialProductos, "id","nombreComercial",
			       "#divFiltroNombreComercialProductos","Todos");
			    
			    crearSelectOneMenuObligMultipleCompleto
			      ("selMulProveedoresFiltro","",listProveedores, "id","proveedor",
			       "#divFiltroProveedores","Todos");
			    
			    crearSelectOneMenuObligMultipleCompleto
			      ("selMulFuentesInformacionFiltro","",listFuentesInformacion, "id","fuenteInformacion",
			       "#divFiltroFuentesInformacion","Todos");
			    
			    crearSelectOneMenuObligMultipleCompleto("selMulPictogramasFiltro"," ",listPictogramas,"id",
		             "nombre","#divFiltroPictograma","Todos");
			        
			    crearSelectOneMenuObligMultipleCompleto("selMulOrganosFiltro"," ",listOrganos,"id",
		                        "nombre","#divFiltroOrganoBlanco","Todos");
			    
			    crearSelectOneMenuObligMultipleCompleto("selMulEquiposProteccionPersonalFiltro"," ",listEquiposProteccionPersonal,"id",
		                        "nombre","#divFiltroEpp","Todos");
			    
			},false);
			
		 insertMenu();
		 cargarValoresSeleccionadosFiltro();
	       });
});

function cargarValoresSeleccionadosFiltro(){
    
    $("#modalFiltroFichaQuimica").modal("hide");
    
    var listNombreProductosId = [];
       var nombreProductosId = $("#selMulNombreProductosFiltro").val();
	if(nombreProductosId != null){
	    nombreProductosId.forEach(function(val){
		listNombreProductosId.push(parseInt(val));
	    });
	}

    var listNombreComercialProductosId = [];
       var nombreComercialProductosId = $("#selMulNombreComercialProductosFiltro").val();
	if(nombreComercialProductosId != null){
	    nombreComercialProductosId.forEach(function(val){
	       listNombreComercialProductosId.push(parseInt(val));
	   });
	}
	
    var listProveedoresId = [];
       var proveedoresId = $("#selMulProveedoresFiltro").val();
	if(proveedoresId != null){
	    proveedoresId.forEach(function(val){
	       listProveedoresId.push(parseInt(val));
	   });
	}
	
    var listFuentesInformacionId = [];
       var fuentesInformacionId = $("#selMulFuentesInformacionFiltro").val();
	if(fuentesInformacionId != null){
	    fuentesInformacionId.forEach(function(val){
	       listFuentesInformacionId.push(parseInt(val));
	   });
	}

    var listPictogramasId = [];
       var pictogramasId = $("#selMulPictogramasFiltro").val();
	if(pictogramasId != null){
	    pictogramasId.forEach(function(val){
		listPictogramasId.push(parseInt(val));
	    });
	}
	
    var listOrganosId = [];
       var organosId = $("#selMulOrganosFiltro").val();
       if(organosId != null){
	   organosId.forEach(function(val){
	       listOrganosId.push(parseInt(val));
	  });
       }
		
    var listEppsId = [];
       var eppId = $("#selMulEquiposProteccionPersonalFiltro").val();
       if(eppId != null){
	   eppId.forEach(function(val){
	      listEppsId.push(parseInt(val));
	  });
       }
       
    var listAreasId = [];
       var areaId = $("#filtroAreasFichaQuimica").val();
       if(areaId != null){
	   areaId.forEach(function(val){
	       listAreasId.push(parseInt(val));
	  });
       }
	
     var dataParam = {
	        empresaId : getSession("gestopcompanyid"),
	        tipoProductoFiltro : ($("#selTiposProducto").val()==-1?null:$("#selTiposProducto").val()),
	        validarAlmacenFiltro : ($("#selValidarAlmacen").val()==-1?null:$("#selValidarAlmacen").val()),
		listNombreProductosIdFiltro : (listNombreProductosId.length==0?null:listNombreProductosId),
	        listNombreComercialProductosIdFiltro : (listNombreComercialProductosId.length==0?null:listNombreComercialProductosId),
	        listProveedoresIdFiltro : (listProveedoresId.length==0?null:listProveedoresId),
	        listFuentesInformacionIdFiltro : (listFuentesInformacionId.length==0?null:listFuentesInformacionId),
		listPictogramasIdFiltro : (listPictogramasId.length==0?null:listPictogramasId),
		listOrganosIdFiltro : (listOrganosId.length==0?null:listOrganosId),
		listEquiposProteccionPersonalIdFiltro : (listEppsId.length==0?null:listEppsId),
		listAreasFiltrarIdFiltro: (listAreasId.length==0?null:listAreasId)
	};
     
     console.log(dataParam.tipoProductoFiltro);
     console.log(dataParam.validarAlmacenFiltro);
     
	callAjaxPost(URL + '/fichaquimica', dataParam,function(data){
		if(data.CODE_RESPONSE=="05"){
			banderaEdicion1=false;
			listTipoFichaQuimica= data.listTipo;
			listFullFichaQuimica = data.list;
			$("#tblFichaQuimica tbody tr").remove();
			
			listTiposProducto= data.listTiposProducto;
			listCalificacionesHMISsalud= data.listCalificacionesHMISsalud;
			listCalificacionesHMISinflamabilidad= data.listCalificacionesHMISinflamabilidad;
			listCalificacionesHMISpeligrofisico= data.listCalificacionesHMISpeligrofisico;
			listCalificacionesNFPAsalud= data.listCalificacionesNFPAsalud;
			listCalificacionesNFPAinflamabilidad= data.listCalificacionesNFPAinflamabilidad;
			listCalificacionesNFPAreactividad= data.listCalificacionesNFPAreactividad;
			
			listPictogramas= data.listPictogramas;
			listOrganos= data.listOrganos;
			listCasosEspecialesNFPA= data.listCasosEspecialesNFPA;
			listEquiposProteccionPersonal= data.listEquiposProteccionPersonal;
			listAreas= data.listAreas;
			
			listFullFichaQuimica.forEach(function(val,index){
				 
			    var verifAlmacen="No";
			    
			    if(val.validarAlmacen=='1'){
				verifAlmacen="Sí"
			    }
			    if(val.validarAlmacen== null){
				verifAlmacen=""
			    }
			    
			$("#tblFichaQuimica tbody").append(
				//Editar sufijo
				"<tr id='trFicha"+val.id+"' onclick='editarFichaQuimica("+index+")'>" +
					"<td id='tdcodigo"+val.id+"'>"+val.id+"</td>" + 
					"<td id='tdvalidaralmacen"+val.id+"'>"+verifAlmacen+"</td>" +
					"<td id='tdnombre"+val.id+"' style='word-break: break-all;'>"+val.nombre+"</td>" +
					"<td id='tdnombrecomercial"+val.id+"' style='word-break: break-all;'>"+val.nombreComercial+"</td>" +
					"<td id='tdfuente"+val.id+"'>"+val.fuenteInformacion+"</td>" +
					"<td id='tdtipo"+val.id+"'>"+val.tipoProducto.nombre+"</td>" +
					"<td id='tdmedioextincion"+val.id+"'>"+val.medioExtincion+"</td>" +
					"<td id='tdpictogramas"+val.id+"'>"+val.listPictogramasNombre+"</td>" +
					"<td id='tdorganos"+val.id+"'>"+val.listOrganosNombre+"</td>" +
					"<td id='tdotro"+val.id+"'>"+val.otroOrgano+"</td>" +
					"<td id='tdsalud"+val.id+"'>"+val.calificacionHmisSalud.calificacion+"</td>" +
					"<td id='tdinflamabilidad"+val.id+"'>"+val.calificacionHmisInflamabilidad.calificacion+"</td>" +
					"<td id='tdpeligrofisico"+val.id+"'>"+val.calificacionHmisPeligroFisico.calificacion+"</td>" +
					"<td id='tdsaludnfpa"+val.id+"'>"+val.calificacionNfpaSalud.calificacion+"</td>" +
					"<td id='tdinflamabilidadnfpa"+val.id+"'>"+val.calificacionNfpaInflamabilidad.calificacion+"</td>" +
					"<td id='tdreactividadnfpa"+val.id+"'>"+val.calificacionNfpaReactividad.calificacion+"</td>" +
					"<td id='tdcasosespeciales"+val.id+"'>"+val.listCasosEspecialesNFPANombre+"</td>" +
					"<td id='tdequiposproper"+val.id+"'>"+val.listEquiposProteccionPersonalNombre+"</td>" +
					"<td id='tdepp"+val.id+"'>"+val.otroEpp+"</td>" +
					"<td id='tdprodcombustion"+val.id+"' style='word-break: break-all;'>"+val.productoDeCombustion+"</td>" +
					"<td id='tdcomposicion"+val.id+"' style='word-break: break-all;'>"+val.composicion+"</td>" +
					"<td id='tdalmacenamiento"+val.id+"' style='word-break: break-all;'>"+val.almacenamiento+"</td>" +
					"<td id='tdadvertencia"+val.id+"' style='word-break: break-all;'>"+val.advertencia+"</td>" +
					"<td id='tdproveedor"+val.id+"'>"+val.proveedor+"</td>" +
					"<td id='tdareas"+val.id+"'>"+val.listAreasNombre+"</td>" +
					"<td id='tdenlacemsds"+val.id+"'>...</td>" +
					//Agregar filas
				"</tr>");
			});
			formatoCeldaSombreableTabla(true,"tblFichaQuimica");
		}else{
			console.log("NO")
		}
		goheadfixedY("#tblFichaQuimica","#wrapperFichaQuimica")
	});
}

function crearModalSubirImagenEpp(functionCallBack){
    var dataParam = {
		idCompany : getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/fichaquimica/subir_imagen', dataParam,
    		function(data){
	if(data.CODE_RESPONSE=="05"){
	listEpp= data.listEpp;
	
	var selEppAux=crearSelectOneMenu("selEppAux", "", listEpp, "-1", "id",
		"nombre", "Ninguno");
 
        var contenido ="";
        
        var listContenido = [
        {sugerencia:"",label:"Lista EPP",inputForm: selEppAux},
        {sugerencia:"",label:"Evidencia",inputForm: "",divContainer:"divEvidenciaEpp"},
        {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarSubirImagenEpp()'><i class='fa fa-times'></i> Cancelar</button>",
        inputForm:""},
                             ];
        
        listContenido.forEach(function(val){
        	contenido +=obtenerSubPanelModuloGeneral(val);
        });
        
        var modalOptions= {id:"modalSubirImagenEpp",nombre:"<i class='fa fa-filter'></i>Filtros",
        		contenido: contenido};
        
        crearModalPrincipalUsuario(modalOptions,function(){},false,false);
        
        var optionEvidenciaEpp={
		    isImage: false,
		    container:"#divEvidenciaEpp",
		    idAux:"ImagenEpp",
		    esNuevo:true,
		    evidenciaNombre:"",
		    functionCall:function(){
			guardarEvidenciaAuto(parseInt($("#selEppAux").val()),"fileEviImagenEpp",
				bitsMega*10,
				"/fichaquimica/subir_imagen_epp/save",function(){});
			
		    },
		    descargaUrl:"",
		    };
        
	crearFormEvidenciaCompleta(optionEvidenciaEpp);
   
      if(functionCallBack != null){
          functionCallBack();
      }
     }	
   });
}

function crearModalSubirImagenOb(functionCallBack){
    var dataParam = {
		idCompany : getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/fichaquimica/subir_imagen', dataParam,
    		function(data){
	if(data.CODE_RESPONSE=="05"){
	listOb= data.listOb;
	
	var selObAux=crearSelectOneMenu("selObAux", "", listOb, "-1", "id",
		"nombre", "Ninguno");
 
        var contenido ="";
        
        var listContenido = [
        {sugerencia:"",label:"Lista Ob",inputForm: selObAux},
        {sugerencia:"",label:"Evidencia",inputForm: "",divContainer:"divEvidenciaOb"},
        {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarSubirImagenOb()'><i class='fa fa-times'></i> Cancelar</button>",
        inputForm:""},
                             ];
        
        listContenido.forEach(function(val){
        	contenido +=obtenerSubPanelModuloGeneral(val);
        });
        
        var modalOptions= {id:"modalSubirImagenOb",nombre:"<i class='fa fa-filter'></i>Filtros",
        		contenido: contenido};
        
        crearModalPrincipalUsuario(modalOptions,function(){},false,false);
        
        var optionEvidenciaOb={
		    isImage: false,
		    container:"#divEvidenciaOb",
		    idAux:"ImagenOb",
		    esNuevo:true,
		    evidenciaNombre:"",
		    functionCall:function(){
			guardarEvidenciaAuto(parseInt($("#selObAux").val()),"fileEviImagenOb",
				bitsMega*10,
				"/fichaquimica/subir_imagen_ob/save",function(){});
			
		    },
		    descargaUrl:"",
		    };
        
	crearFormEvidenciaCompleta(optionEvidenciaOb);
   
      if(functionCallBack != null){
          functionCallBack();
      }
     }	
   });
}

function crearModalSubirImagenPp(functionCallBack){
    var dataParam = {
		idCompany : getSession("gestopcompanyid")
    };

    callAjaxPost(URL + '/fichaquimica/subir_imagen', dataParam,
    		function(data){
	if(data.CODE_RESPONSE=="05"){
	listPp= data.listPp;
	
	var selPpAux=crearSelectOneMenu("selPpAux", "", listPp, "-1", "id",
		"nombre", "Ninguno");
 
        var contenido ="";
        
        var listContenido = [
        {sugerencia:"",label:"Lista Pp",inputForm: selPpAux},
        {sugerencia:"",label:"Evidencia",inputForm: "",divContainer:"divEvidenciaPp"},
        {sugerencia:"",label:"<button class='btn btn-danger' type='button' onclick='ocultarSubirImagenPp()'><i class='fa fa-times'></i> Cancelar</button>",
        inputForm:""},
                             ];
        
        listContenido.forEach(function(val){
        	contenido +=obtenerSubPanelModuloGeneral(val);
        });
        
        var modalOptions= {id:"modalSubirImagenPp",nombre:"<i class='fa fa-filter'></i>Filtros",
        		contenido: contenido};
        
        crearModalPrincipalUsuario(modalOptions,function(){},false,false);
        
        var optionEvidenciaPp={
		    isImage: false,
		    container:"#divEvidenciaPp",
		    idAux:"ImagenPp",
		    esNuevo:true,
		    evidenciaNombre:"",
		    functionCall:function(){
			guardarEvidenciaAuto(parseInt($("#selPpAux").val()),"fileEviImagenPp",
				bitsMega*10,
				"/fichaquimica/subir_imagen_pp/save",function(){});
			
		    },
		    descargaUrl:"",
		    };
        
	crearFormEvidenciaCompleta(optionEvidenciaPp);
   
      if(functionCallBack != null){
          functionCallBack();
      }
     }	
   });
}

function verSmartImportFichaQuimica(){
	var textBackUp ="<a  class='efectoLink' href='"+URL+"/fichaquimica/import/plantilla' "
			+"target='_blank'><i class='fa fa-download'></i>"+"Descargar"+"</a>";
	
	var listItemsForm=[
		       			{sugerencia:"",label:"<i class='fa fa-download'></i> Lista Backup ",inputForm: textBackUp,divContainer:""},
		       			{sugerencia:"",label:"<i class='fa fa-info'></i> Archivo Excel: ",inputForm: "",divContainer:"divExcelImport"},
		       			{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-floppy-o'></i> Guardar</button>",divContainer:""}
		       		];
	
		       	var text="";
		       	
		       	listItemsForm.forEach(function(val,index)
		       	{
		       		text+=obtenerSubPanelModuloGeneral(val);
		       	});
		       	
		       	var contenido=
		       		"<form id='formImportEvento' class='eventoGeneral' >" +
		       			"<div id='tituloEvento'>" + 
		       				text+
		       			"</div>"+
		       			"</div>" +
		       		"</form>"; 
		       	
		       	var listPaneles= 
		       		 {id:"divImportFichaQuimica",nombre:"Actualizar FichaQuimica (import)",clase : "listaAuxiliar",contenido:contenido}
		       	                  ;
		       	
		       	agregarModalPrincipalColaboradorGeneral(listPaneles,function(){
			var options=
			           {container:"#divExcelImport",
				    functionCall:function(){  },
			            descargaUrl: "",
				    esNuevo:true,
				    idAux:"ImportExcel",
				    evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
		});
		       	
		$("#formImportEvento").on("submit",function(e){
			e.preventDefault();
			enviarExcelImportFichaQuimica();
		});
}

function enviarExcelImportFichaQuimica(){
	guardarEvidenciaAuto(0,"fileEviImportExcel",
			bitsEvidenciaActoInseguro,
			"/fichaquimica/excel/masivo/save",function(data){
		$("#divImportFichaQuimica").remove();
		if(data.mensaje.length > 0){
			alert(data.mensaje);
		}
		//
		 verSmartFinalizarImportFichaQuimica();
	},"id",[ 
	        {id : "empresaId",value:getSession("gestopcompanyid")}
	       ]);
}

function verSmartFinalizarImportFichaQuimica(){
	var btnDescarga = "<a class='efectoLink'" +
			"target='_blank' href='"+URL+"/trabajador/estado/excel?empresaId="+getSession("gestopcompanyid")+"' >" +
			"<i class='fa fa-download'></i>Descargar</a>"
	var listItemsForm=[
		       			{sugerencia:"",label:"<i class='fa fa-file-excel-o'></i> Informe : ",inputForm: "Se importaron las fichas químicas",divContainer:""},
		       			 {sugerencia:" ",label:"",inputForm: "<button class='btn btn-success'  ><i class='fa fa-check'></i> Finalizar</button>",divContainer:""}
		       		];
		       	var text="";
		       	listItemsForm.forEach(function(val,index)
		       	{
		       		text+=obtenerSubPanelModuloGeneral(val);
		       	});
		       	var contenido=
		       		"<form id='formImportFinalEvento' class='eventoGeneral' >" +
		       			"<div id='tituloEvento'>" + 
		       				text+
		       			"</div>"+
		       			"</div>" +
		       		"</form>";  
		       	var listPaneles= 
		       		 {id:"divImportFinalFichaQuimica",nombre:"Finalizar Actualizar FichaQuimica (import)",clase : "listaAuxiliar",contenido:contenido}
		       	                  ;
		       	agregarModalPrincipalColaboradorGeneral(listPaneles,function(){
			 
		});
		$("#formImportFinalEvento").on("submit",function(e){
			e.preventDefault();
			$(".modal").modal("hide");
			$("#divImportFichaQuimica").remove();
			$("#divImportFinalFichaQuimica").remove();
			cargarFichasQuimica();
		});
	
}

function cargarFichasQuimica(data){
    
        var valorResize= 160;
        resizeDivWrapper("wrapperFichaQuimica",valorResize);
    
	$("#btnCancelarFichaQuimica").hide();
	$("#btnNuevoFichaQuimica").show();
	$("#btnEliminarFichaQuimica").hide();
	$("#btnGuardarFichaQuimica").hide();
	$("#btnExcelFicha").hide();
	callAjaxPost(URL + '/fichaquimica', 
			{empresaId : getSession("gestopcompanyid") }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion1=false;
					listTipoFichaQuimica= data.listTipo;
					listFullFichaQuimica = data.list;
					$("#tblFichaQuimica tbody tr").remove();
					
					listTiposProducto= data.listTiposProducto;
					listCalificacionesHMISsalud= data.listCalificacionesHMISsalud;
					listCalificacionesHMISinflamabilidad= data.listCalificacionesHMISinflamabilidad;
					listCalificacionesHMISpeligrofisico= data.listCalificacionesHMISpeligrofisico;
					listCalificacionesNFPAsalud= data.listCalificacionesNFPAsalud;
					listCalificacionesNFPAinflamabilidad= data.listCalificacionesNFPAinflamabilidad;
					listCalificacionesNFPAreactividad= data.listCalificacionesNFPAreactividad;
					
					listPictogramas= data.listPictogramas;
					listOrganos= data.listOrganos;
					listCasosEspecialesNFPA= data.listCasosEspecialesNFPA;
					listEquiposProteccionPersonal= data.listEquiposProteccionPersonal;
					listAreas= data.listAreas;
					
					listFullFichaQuimica.forEach(function(val,index){
						 
					    var verifAlmacen="No";
					    
					    if(val.validarAlmacen=='1'){
						verifAlmacen="Sí"
					    }
					    if(val.validarAlmacen== null){
						verifAlmacen=""
					    }
					    
					$("#tblFichaQuimica tbody").append(
						//Editar sufijo
						"<tr id='trFicha"+val.id+"' onclick='editarFichaQuimica("+index+")'>" +
							"<td id='tdcodigo"+val.id+"'>"+val.id+"</td>" + 
							"<td id='tdvalidaralmacen"+val.id+"'>"+verifAlmacen+"</td>" +
							"<td id='tdnombre"+val.id+"' style='word-break: break-all;'>"+val.nombre+"</td>" +
							"<td id='tdnombrecomercial"+val.id+"' style='word-break: break-all;'>"+val.nombreComercial+"</td>" +
							"<td id='tdfuente"+val.id+"'>"+val.fuenteInformacion+"</td>" +
							"<td id='tdtipo"+val.id+"'>"+val.tipoProducto.nombre+"</td>" +
							"<td id='tdmedioextincion"+val.id+"'>"+val.medioExtincion+"</td>" +
							"<td id='tdpictogramas"+val.id+"'>"+val.listPictogramasNombre+"</td>" +
							"<td id='tdorganos"+val.id+"'>"+val.listOrganosNombre+"</td>" +
							"<td id='tdotro"+val.id+"'>"+val.otroOrgano+"</td>" +
							"<td id='tdsalud"+val.id+"'>"+val.calificacionHmisSalud.calificacion+"</td>" +
							"<td id='tdinflamabilidad"+val.id+"'>"+val.calificacionHmisInflamabilidad.calificacion+"</td>" +
							"<td id='tdpeligrofisico"+val.id+"'>"+val.calificacionHmisPeligroFisico.calificacion+"</td>" +
							"<td id='tdsaludnfpa"+val.id+"'>"+val.calificacionNfpaSalud.calificacion+"</td>" +
							"<td id='tdinflamabilidadnfpa"+val.id+"'>"+val.calificacionNfpaInflamabilidad.calificacion+"</td>" +
							"<td id='tdreactividadnfpa"+val.id+"'>"+val.calificacionNfpaReactividad.calificacion+"</td>" +
							"<td id='tdcasosespeciales"+val.id+"'>"+val.listCasosEspecialesNFPANombre+"</td>" +
							"<td id='tdequiposproper"+val.id+"'>"+val.listEquiposProteccionPersonalNombre+"</td>" +
							"<td id='tdepp"+val.id+"'>"+val.otroEpp+"</td>" +
							"<td id='tdprodcombustion"+val.id+"' style='word-break: break-all;'>"+val.productoDeCombustion+"</td>" +
							"<td id='tdcomposicion"+val.id+"' style='word-break: break-all;'>"+val.composicion+"</td>" +
							"<td id='tdalmacenamiento"+val.id+"' style='word-break: break-all;'>"+val.almacenamiento+"</td>" +
							"<td id='tdadvertencia"+val.id+"' style='word-break: break-all;'>"+val.advertencia+"</td>" +
							"<td id='tdproveedor"+val.id+"'>"+val.proveedor+"</td>" +
							"<td id='tdareas"+val.id+"'>"+val.listAreasNombre+"</td>" +
							"<td id='tdenlacemsds"+val.id+"'>...</td>" +
							//Agregar filas
						"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblFichaQuimica");
				}else{
					console.log("NO")
				}
				goheadfixedY("#tblFichaQuimica","#wrapperFichaQuimica");
			});
}

function editarFichaQuimica(pindex) {
	if (!banderaEdicion1) {
	    	formatoCeldaSombreableTabla(false,"tblFichaQuimica");
		fichaQuimicaId = listFullFichaQuimica[pindex].id;
		fichaQuimicaObj = listFullFichaQuimica[pindex];
		
		$("#trFicha"+fichaQuimicaId).addClass("fila-edicion");
		
		/*
		var slcTipoFichaQuimica = crearSelectOneMenuOblig("slcTipoFichaQuimica", "",
				listTipoFichaQuimica, plantillaObj.tipo.id, "id", "nombre");
		$("#divi"+plantillaId).html(slcClasificacion);
		*/
		$("#tdnombre"+ fichaQuimicaId).html("<input type='text' id='inputNombreProducto' class='form-control'>");
		$("#inputNombreProducto").val(fichaQuimicaObj.nombre);
		
		$("#tdnombrecomercial"+ fichaQuimicaId).html("<input type='text' id='inputNombreComercial' class='form-control'>");
		$("#inputNombreComercial").val(fichaQuimicaObj.nombreComercial);
		
		$("#tdfuente"+ fichaQuimicaId).html("<input type='text' id='inputFuenteInformacion' class='form-control'>");
		$("#inputFuenteInformacion").val(fichaQuimicaObj.fuenteInformacion);
		
		$("#tdmedioextincion"+ fichaQuimicaId).html("<input type='text' id='inputMedioExtincion' class='form-control'>");
		$("#inputMedioExtincion").val(fichaQuimicaObj.medioExtincion);
		
		$("#tdotro"+ fichaQuimicaId).html("<input type='text' id='inputOtroOrgano' class='form-control'>");
		$("#inputOtroOrgano").val(fichaQuimicaObj.otroOrgano);
		
		$("#tdepp"+ fichaQuimicaId).html("<input type='text' id='inputOtroEpp' class='form-control'>");
		$("#inputOtroEpp").val(fichaQuimicaObj.otroEpp);
		
		$("#tdprodcombustion"+ fichaQuimicaId).html("<input type='text' id='inputProductoDeCombustion' class='form-control'>");
		$("#inputProductoDeCombustion").val(fichaQuimicaObj.productoDeCombustion);
		
		$("#tdcomposicion"+ fichaQuimicaId).html("<input type='text' id='inputComposicion' class='form-control'>");
		$("#inputComposicion").val(fichaQuimicaObj.composicion);
		
		$("#tdalmacenamiento"+ fichaQuimicaId).html("<input type='text' id='inputAlmacenamiento' class='form-control'>");
		$("#inputAlmacenamiento").val(fichaQuimicaObj.almacenamiento);
		
		$("#tdadvertencia"+ fichaQuimicaId).html("<input type='text' id='inputAdvertencia' class='form-control'>");
		$("#inputAdvertencia").val(fichaQuimicaObj.advertencia);
		
		$("#tdproveedor"+ fichaQuimicaId).html("<input type='text' id='inputProveedor' class='form-control'>");
		$("#inputProveedor").val(fichaQuimicaObj.proveedor);
		
		/* ****** */
		
		 var verifVig=fichaQuimicaObj.validarAlmacen;
		 var textoVerifAlmacen="";
		 
		    if(verifVig==1){
		       textoVerifAlmacen="checked";
		    }
		 	  
		 $("#tdvalidaralmacen"+fichaQuimicaId)
		 .html("<input type='checkbox' id='checkValidarAlmacen' class='form-control' "+textoVerifAlmacen+">");
			
		/* ****** */
		
		var tipoProductoId=listFullFichaQuimica[pindex].tipoProducto.id;
		
		var selTipoProducto = crearSelectOneMenu("selTipoProducto","",
			listTiposProducto, tipoProductoId, "id", "nombre");
	        $("#tdtipo" + fichaQuimicaId).html(selTipoProducto);
	        
                var calificacionHMISsaludId=listFullFichaQuimica[pindex].calificacionHmisSalud.id;
		
		var selCalificacionHMISsalud = crearSelectOneMenu("selCalificacionHMISsalud","",
			listCalificacionesHMISsalud, calificacionHMISsaludId, "id", "calificacion");
	        $("#tdsalud" + fichaQuimicaId).html(selCalificacionHMISsalud);
	        
                var calificacionHMISinflamabilidadId=listFullFichaQuimica[pindex].calificacionHmisInflamabilidad.id;
		
		var selCalificacionHMISinflamabilidad = crearSelectOneMenu("selCalificacionHMISinflamabilidad","",
			listCalificacionesHMISinflamabilidad, calificacionHMISinflamabilidadId, "id", "calificacion");
	        $("#tdinflamabilidad" + fichaQuimicaId).html(selCalificacionHMISinflamabilidad);
	        
                var calificacionHMISpeligrofisicoId=listFullFichaQuimica[pindex].calificacionHmisPeligroFisico.id;
		
		var selCalificacionHMISpeligrofisico = crearSelectOneMenu("selCalificacionHMISpeligrofisico","",
			listCalificacionesHMISpeligrofisico, calificacionHMISpeligrofisicoId, "id", "calificacion");
	        $("#tdpeligrofisico" + fichaQuimicaId).html(selCalificacionHMISpeligrofisico);
	        
                var calificacionNFPAsaludId=listFullFichaQuimica[pindex].calificacionNfpaSalud.id;
		
		var selCalificacionNFPAsalud = crearSelectOneMenu("selCalificacionNFPAsalud","",
			listCalificacionesNFPAsalud, calificacionNFPAsaludId, "id", "calificacion");
	        $("#tdsaludnfpa" + fichaQuimicaId).html(selCalificacionNFPAsalud);
	        
                var calificacionNFPAinflamabilidadId=listFullFichaQuimica[pindex].calificacionNfpaInflamabilidad.id;
		
		var selCalificacionNFPAinflamabilidad = crearSelectOneMenu("selCalificacionNFPAinflamabilidad","",
			listCalificacionesNFPAinflamabilidad, calificacionNFPAinflamabilidadId, "id", "calificacion");
	        $("#tdinflamabilidadnfpa" + fichaQuimicaId).html(selCalificacionNFPAinflamabilidad);
	        
                var calificacionNFPAreactividadId=listFullFichaQuimica[pindex].calificacionNfpaReactividad.id;
		
		var selCalificacionNFPAreactividad = crearSelectOneMenu("selCalificacionNFPAreactividad","",
			listCalificacionesNFPAreactividad, calificacionNFPAreactividadId, "id", "calificacion");
	        $("#tdreactividadnfpa" + fichaQuimicaId).html(selCalificacionNFPAreactividad);
		/*
		$("#tipcont"+plantillaId).html("<a onclick='verContratistasUnidad()'>" +
				$("#tipcont"+plantillaId).text()+"</a>");
		$("#tipproy"+plantillaId).html("<a onclick='verProyectosUnidad()'>" +
				$("#tipproy"+plantillaId).text()+"</a>")
		*/
		
	        var listPictogramasAd= fichaQuimicaObj.listPictogramasId.split(",");
		listPictogramas.forEach(function(val){
		    val.selected= 0;
		    listPictogramasAd.forEach(function(val1){
			if(parseInt(val1) == val.id){
			    val.selected= 1;
			}
		    });
		});
		
		crearSelectOneMenuObligMultipleCompleto("selMulPictogramasForm"," ",listPictogramas,"id",
                        "nombre","#tdpictogramas"+fichaQuimicaId,"sin asignar");
	
		var listOrganosAd= fichaQuimicaObj.listOrganosId.split(",");
		listOrganos.forEach(function(val){
		    val.selected= 0;
		    listOrganosAd.forEach(function(val1){
			if(parseInt(val1) == val.id){
			    val.selected= 1;
			}
		    });
		});
		
		crearSelectOneMenuObligMultipleCompleto("selMulOrganosForm"," ",listOrganos,"id",
                        "nombre","#tdorganos"+fichaQuimicaId,"sin asignar");
		

		var listCasosEspecialesNfpaAd= fichaQuimicaObj.listCasosEspecialesNFPAId.split(",");
		listCasosEspecialesNFPA.forEach(function(val){
		    val.selected= 0;
		    listCasosEspecialesNfpaAd.forEach(function(val1){
			if(parseInt(val1) == val.id){
			    val.selected= 1;
			}
		    });
		});
		
		crearSelectOneMenuObligMultipleCompleto("selMulCasosEspecialesNfpaForm"," ",listCasosEspecialesNFPA,"id",
                        "nombre","#tdcasosespeciales"+fichaQuimicaId,"sin asignar");
		
		var listEquiposProteccionPersonalAd= fichaQuimicaObj.listEquiposProteccionPersonalId.split(",");
		listEquiposProteccionPersonal.forEach(function(val){
		    val.selected= 0;
		    listEquiposProteccionPersonalAd.forEach(function(val1){
			if(parseInt(val1) == val.id){
			    val.selected= 1;
			}
		    });
		});
		
		crearSelectOneMenuObligMultipleCompleto("selMulEquiposProteccionPersonalForm"," ",listEquiposProteccionPersonal,"id",
                        "nombre","#tdequiposproper"+fichaQuimicaId,"sin asignar");
		
		var listAreasAd= fichaQuimicaObj.listAreasId.split(",");
		listAreas.forEach(function(val){
		    val.selected= 0;
		    listAreasAd.forEach(function(val1){
			if(parseInt(val1) == val.areaId){
			    val.selected= 1;
			}
		    });
		});
		
		crearSelectOneMenuObligMultipleCompleto("selMulAreasForm"," ",listAreas,"areaId",
                        "areaNameShort","#tdareas"+fichaQuimicaId,"sin asignar");
		
		
		var textEnl=$("#tdenlacemsds"+fichaQuimicaId).html();
		
		$("#tdenlacemsds"+fichaQuimicaId).addClass("linkGosst")
		.on("click",function(){verFichaQuimicaEnlaceMsds();})
		.html("<i class='fa fa-search  fa-2x' aria-hidden='true' ></i>"+textEnl);
		
		//
		banderaEdicion1 = true;
		$("#btnCancelarFichaQuimica").show();
		$("#btnNuevoFichaQuimica").hide();
		$("#btnEliminarFichaQuimica").show();
		$("#btnGuardarFichaQuimica").show();
		$("#btnExcelFicha").show();
	}
	
} 
function nuevoFichaQuimica() {
	if (!banderaEdicion1) {
	    	formatoCeldaSombreableTabla(false,"tblFichaQuimica");
	    	fichaQuimicaObj = {id : 0};
		fichaQuimicaId = 0; 
		
		var selTipoProducto = crearSelectOneMenu("selTipoProducto", "",
			listTiposProducto, "-1", "id", "nombre");
		
		var selCalificacionHMISsalud = crearSelectOneMenu("selCalificacionHMISsalud", "",
			listCalificacionesHMISsalud, "-1", "id", "calificacion");
		
		var selCalificacionHMISinflamabilidad= crearSelectOneMenu("selCalificacionHMISinflamabilidad", "",
			listCalificacionesHMISinflamabilidad, "-1", "id", "calificacion");
		
		var selCalificacionHMISpeligrofisico = crearSelectOneMenu("selCalificacionHMISpeligrofisico", "",
			listCalificacionesHMISpeligrofisico, "-1", "id", "calificacion");
		
		var selCalificacionNFPAsalud = crearSelectOneMenu("selCalificacionNFPAsalud","",
			listCalificacionesNFPAsalud, "-1", "id", "calificacion");

		var selCalificacionNFPAinflamabilidad = crearSelectOneMenu("selCalificacionNFPAinflamabilidad","",
			listCalificacionesNFPAinflamabilidad,  "-1", "id", "calificacion");
		
		var selCalificacionNFPAreactividad = crearSelectOneMenu("selCalificacionNFPAreactividad","",
			listCalificacionesNFPAreactividad, "-1", "id", "calificacion");
		
		
		$("#tblFichaQuimica tbody").prepend(
			"<tr id='trFicha0' >" 
				+"<td>...</td>"
				+"<td><input type='checkbox' id='checkValidarAlmacen' class='form-control'></td>"
				+"<td><input type='text' id='inputNombreProducto' class='form-control'></td>"
				+"<td><input type='text' id='inputNombreComercial' class='form-control'></td>"
				+"<td><input type='text' id='inputFuenteInformacion' class='form-control'></td>"
				+ "<td>"+ selTipoProducto+ "</td>"
				+"<td><input type='text' id='inputMedioExtincion' class='form-control'></td>"
				+ "<td id='tdpictogramas0'></td>"
				+ "<td id='tdorganos0'></td>"
				+"<td><input type='text' id='inputOtroOrgano' class='form-control'></td>"
				+ "<td>"+ selCalificacionHMISsalud+ "</td>"
				+ "<td>"+ selCalificacionHMISinflamabilidad+ "</td>"
				+ "<td>"+ selCalificacionHMISpeligrofisico+ "</td>"
				+ "<td>"+ selCalificacionNFPAsalud+ "</td>"
				+ "<td>"+ selCalificacionNFPAinflamabilidad+ "</td>"
				+ "<td>"+ selCalificacionNFPAreactividad+ "</td>"
				+ "<td id='tdcasosespeciales0'></td>"
				+ "<td id='tdequiposproper0'></td>"
				+"<td><input type='text' id='inputOtroEpp' class='form-control'></td>"
				+"<td><input type='text' id='inputProductoDeCombustion' class='form-control'></td>"
				+"<td><input type='text' id='inputComposicion' class='form-control'></td>"
				+"<td><input type='text' id='inputAlmacenamiento' class='form-control'></td>"
				+"<td><input type='text' id='inputAdvertencia' class='form-control'></td>"
				+"<td><input type='text' id='inputProveedor' class='form-control'></td>"
				+ "<td id='tdareas0'></td>"
				+ "<td>...</td>"
				//Agregar necesarios
			+ "</tr>");
		
		crearSelectOneMenuObligMultipleCompleto("selMulPictogramasForm"," ",listPictogramas,"id",
                        "nombre","#tdpictogramas0","sin asignar");
		
		crearSelectOneMenuObligMultipleCompleto("selMulOrganosForm"," ",listOrganos,"id",
                        "nombre","#tdorganos0","sin asignar");
		
		crearSelectOneMenuObligMultipleCompleto("selMulCasosEspecialesNfpaForm"," ",listCasosEspecialesNFPA,"id",
                        "nombre","#tdcasosespeciales0","sin asignar");
		
		crearSelectOneMenuObligMultipleCompleto("selMulEquiposProteccionPersonalForm"," ",listEquiposProteccionPersonal,"id",
                        "nombre","#tdequiposproper0","sin asignar");
		
		crearSelectOneMenuObligMultipleCompleto("selMulAreasForm"," ",listAreas,"areaId",
                        "areaNameShort","#tdareas0","sin asignar");

		
		$("#btnCancelarFichaQuimica").show();
		$("#btnNuevoFichaQuimica").hide();
		$("#btnEliminarFichaQuimica").hide();
		$("#btnGuardarFichaQuimica").show();
		banderaEdicion1 = true;
	} else {
		alert("Guarde primero.");
	}
}

function cancelarFichaQuimica() {
	cargarFichasQuimica();
}

function eliminarFichaQuimica() {
	var r = confirm("¿Está seguro de eliminar la ficha química?");
	if (r == true) {
		var dataParam = {
				id : fichaQuimicaId,
		};
		callAjaxPost(URL + '/fichaquimica/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
					    cargarFichasQuimica();
						break;
					default:
						alert("Ocurrió un error al eliminar la plantilla!");
					}
				});
	}
}

function guardarFichaQuimica() {

    var campoVacio = true;
    //Programa lógica de acceso de guardado
   // var clasificacion=$("#slcClasificacion").val();
    var nombreProducto=$("#inputNombreProducto").val();
    var nombreComercial=$("#inputNombreComercial").val();
    var fuenteInformacion=$("#inputFuenteInformacion").val();
    var medioExtincion=$("#inputMedioExtincion").val();
    var otroOrgano=$("#inputOtroOrgano").val();
    var otroEpp=$("#inputOtroEpp").val();
    var productoDeCombustion=$("#inputProductoDeCombustion").val();
    var composicion=$("#inputComposicion").val();
    var almacenamiento=$("#inputAlmacenamiento").val();
    var advertencia=$("#inputAdvertencia").val();
    var proveedor=$("#inputProveedor").val();
    
    var selTipoProducto= $("#selTipoProducto").val();
    var selCalificacionHMISsalud= $("#selCalificacionHMISsalud").val();
    var selCalificacionHMISinflamabilidad= $("#selCalificacionHMISinflamabilidad").val();
    var selCalificacionHMISpeligrofisico= $("#selCalificacionHMISpeligrofisico").val();
    var selCalificacionNFPAsalud= $("#selCalificacionNFPAsalud").val();
    var selCalificacionNFPAinflamabilidad= $("#selCalificacionNFPAinflamabilidad").val();
    var selCalificacionNFPAreactividad= $("#selCalificacionNFPAreactividad").val();
    
    var validarAlmacen=($("#checkValidarAlmacen").prop("checked")?1:0);
    var valorAlm;

    if(validarAlmacen != null){
       if(validarAlmacen== 1){
          valorAlm= 1;
      }else{
          valorAlm= 2; 
      }
    }
 
    var listPict= $("#selMulPictogramasForm").val();
    var listPictogramasAd= [];
    if(listPict != null){
       listPict.forEach(function(val,index){
	   listPictogramasAd.push(
	       {id: parseInt(val)})
       });
    }
    
    var listOrg= $("#selMulOrganosForm").val();
    var listOrganosAd= [];
    if(listOrg != null){
       listOrg.forEach(function(val,index){
	   listOrganosAd.push(
	       {id: parseInt(val)})
       });
    }
    
    var listCasEsp= $("#selMulCasosEspecialesNfpaForm").val();
    var listCasosEspecialesNfpaAd= [];
    if(listCasEsp != null){
       listCasEsp.forEach(function(val,index){
	   listCasosEspecialesNfpaAd.push(
	       {id: parseInt(val)})
       });
    }
    
    var listEqui= $("#selMulEquiposProteccionPersonalForm").val();
    var listEquiposProteccionPersonalAd= [];
    if(listEqui != null){
	listEqui.forEach(function(val,index){
	   listEquiposProteccionPersonalAd.push(
	       {id: parseInt(val)})
       });
    }
    
    var listArea= $("#selMulAreasForm").val();
    var listAreasAd= [];
    if(listArea != null){
	listArea.forEach(function(val,index){
	   listAreasAd.push(
	       {areaId: parseInt(val)})
       });
    }
    
    if(campoVacio){
        var dataParam = {
    		id : fichaQuimicaId,
    		validarAlmacen:validarAlmacen,
    		nombre:nombreProducto,
    		nombreComercial:nombreComercial,
    		fuenteInformacion:fuenteInformacion,
    		medioExtincion:medioExtincion,
    		otroOrgano:otroOrgano,
    		otroEpp:otroEpp,
    		productoDeCombustion:productoDeCombustion,
    		composicion:composicion,
    		almacenamiento:almacenamiento,
    		advertencia:advertencia,
    		proveedor:proveedor,
    		tipoProducto:{id:selTipoProducto},
    		calificacionHmisSalud:{id:selCalificacionHMISsalud},
    		calificacionHmisInflamabilidad:{id:selCalificacionHMISinflamabilidad},
    		calificacionHmisPeligroFisico:{id:selCalificacionHMISpeligrofisico},
    		calificacionNfpaSalud:{id:selCalificacionNFPAsalud},
    		calificacionNfpaInflamabilidad:{id:selCalificacionNFPAinflamabilidad},
    		calificacionNfpaReactividad:{id:selCalificacionNFPAreactividad},
    		listPictogramas: listPictogramasAd,
    		listOrganos: listOrganosAd,
    		listCasosEspecialesNFPA: listCasosEspecialesNfpaAd,
    		listEquiposProteccionPersonal: listEquiposProteccionPersonalAd,
    		listAreas: listAreasAd,
    		empresaId: getSession("gestopcompanyid")
    		//clasificacion :{id:clasificacion}
    };
        
        callAjaxPost(URL + '/fichaquimica/save', dataParam,
    		function(data) {
    			switch (data.CODE_RESPONSE) {
    			case "05":
    			    
    			    cargarFichasQuimica();
    			     
    			    break;
    			default:
    				console.log("Ocurrió un error al guardar la ficha química!");
    			}
    		});	
    }	
} 

function verFichaQuimicaEnlaceMsds(){
    $("#tabFichaQuimica").hide();
    $("#tabFichaQuimica .container-fluid").hide();  //.container-fluid -> Adaptación al ancho del navegador
	$("#divMsds").show();                                                            //******
	$("#divMsds h2")                                                                      //******
	.html("<a onclick='volverDivFichaQuimica()'>Ficha Química </a> " +                             //******
			"    " +                                                                 //******
			"> Enlace MSDS"); 
    cargarEnlaceMsds();
		
}

function volverDivFichaQuimica(){

    $("#divMsds").hide();
	$("#divMsds .container-fluid").hide();
    $("#tabFichaQuimica").show();

}

