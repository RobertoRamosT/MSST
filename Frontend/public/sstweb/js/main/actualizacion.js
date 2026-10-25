var actualizacionId,actualizacionObj,actualizacionNombre;
var banderaEdicion12=false;
var listFullActualizacion,listFiltroActualizacion;
var listVersionActualizacion,listModuloActualizacion;
var arrayFiltroVersion=[],toggleFiltroVersion=false;
var arrayFiltroModulo=[],toggleFiltroModulo=false;
var fechaInicioFiltroActua="2000-01-01";
var fechaFinFiltroActu="2057-12-31";

$(function(){
	$("#btnNuevoActualizacion").attr("onclick", "javascript:nuevoActualizacion();");
	$("#btnCancelarActualizacion").attr("onclick", "javascript:cancelarNuevoActualizacion();");
	$("#btnGuardarActualizacion").attr("onclick", "javascript:guardarActualizacion();");
	$("#btnEliminarActualizacion").attr("onclick", "javascript:eliminarActualizacion();");
	resizeDivGosst("wrapperactual");
	$(document).on("click","#filtroFechaActu",function(){
		 $(".filtroMenuGosst").hide();
		 if($("#opcionesFiltroFecha").length>0){
			 $("#opcionesFiltroFecha").show(); 
		 } else{
			 $("body").append("<div class='filtroMenuGosst' id='opcionesFiltroFecha'></div>");
				var topDiv=$(this).position().top;
				var leftDiv=$(this).position().left;
				var cssFiltro={"top":199,"left":leftDiv+30 };
				var opcionesDiv=$("#opcionesFiltroFecha");
				opcionesDiv.css(cssFiltro).append("<div class='opcionFiltro'>" +
						"Desde: <input type='date' id='fechaInicioActualizacion' class='form-control'  value='2018-01-01'> " + 
						"Hasta: <input type='date' id='fechaFinActualizacion' class='form-control'  value='2018-12-31'> " + 
			"</div>");
				opcionesDiv.append("<br><button class='btn btn-danger' ><i class='fa fa-times' aria-hidden='true'> </i>Cancelar </button>");
				opcionesDiv.find(".btn-danger").on("click",function(){
					 $(".filtroMenuGosst").hide();
				});
				opcionesDiv.append("<button class='btn btn-success' ><i class='fa fa-check' aria-hidden='true'> </i>Listo </button>");
				opcionesDiv.find(".btn-success").on("click",function(){
					  fechaInicioFiltroActua=$("#fechaInicioActualizacion").val();
					  fechaFinFiltroActu=$("#fechaFinActualizacion").val();
					
					  listFiltroActualizacion=filtrarListActualizaciones();
					  cargarFiltroActualizaciones();
					$(".filtroMenuGosst").hide();
					});
		 }
		
	});
})
/**
 * 
 */
function filtrarListActualizaciones(){ 
	 var listReturn=[];
listReturn=listFullActualizacion.filter(function(val,index){
			if( fechaIncluidaEnRango(convertirFechaNormal2(val.fecha),fechaInicioFiltroActua,fechaFinFiltroActu)
					&& arrayFiltroVersion.indexOf(parseInt(val.version.id))!=-1
					&& arrayFiltroModulo.indexOf(parseInt(val.modulo.id))!=-1 ){
				return true;
			}else{ 
				return false;
			}
		});
	return listReturn;
}
function volverActualizaciones(){
	$("#divActualizacionesGosst").show();
	$("#divActualizacionesGosst .container-fluid").hide();
	$("#divContainActualizaciones").show();
	$("#divActualizacionesGosst").find("h2").html("Actualizaciones Gosst");
}
function cargarActualizaciones() {
	$("#btnCancelarActualizacion").hide();
	$("#btnNuevoActualizacion").show();
	$("#btnEliminarActualizacion").hide();
	$("#btnGuardarActualizacion").hide();
	volverActualizaciones();
	callAjaxPost(URL + '/scheduler/actualizaciones', 
			{  }, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion12=false;
				 listFullActualizacion=data.list;
				 listVersionActualizacion=data.versiones;
				 listModuloActualizacion=data.modulos;
					 arrayFiltroVersion=listarStringsDesdeArray(listVersionActualizacion, "id");
				 arrayFiltroModulo=listarStringsDesdeArray(listModuloActualizacion, "id");
					$("#tblActualizacion tbody tr").remove();
					listFullActualizacion.forEach(function(val,index){
						var iconoDescarga=
							"<a href='"+URL+"/scheduler/actualizacion/evidencia?id="+val.id+"' target='_blank'>" +
									"<i class='fa fa-download fa-2x' aria-hidden='true'></i></a>";
						if(val.evidenciaNombre==""){
							iconoDescarga="";
						}
						$("#tblActualizacion tbody").append(
								"<tr id='tractu"+val.id+"' >" 
								+"<td id='actuver"+val.id+"'>"+val.version.nombre+"</td>"  
								+"<td id='actufe"+val.id+"'>"+val.fechaTexto+"</td>" 
								+"<td id='actumo"+val.id+"'>"+val.modulo.nombre+"</td>"
								+"<td id='actudesc"+val.id+"'>"+val.descripcion+"</td>"
								+"<td id='actuevi"+val.id+"'>"+val.evidenciaNombre+iconoDescarga+"</td>"
								+"</tr>");
						var contarNuevos=0;
						if(val.isNuevo==1){
							contarNuevos++;
						}
					});
					
					agregarFiltroGosst("filtroVersionActu","opcionesFiltroVersion",listVersionActualizacion,"id","nombre",
							toggleFiltroVersion,arrayFiltroVersion,function(lista){
						arrayFiltroVersion=lista;
						listFiltroActualizacion=filtrarListActualizaciones();
						cargarFiltroActualizaciones();

					},true); 
					agregarFiltroGosst("filtroModuloActu","opcionesFiltroModulo",listModuloActualizacion,"id","nombre",
							toggleFiltroModulo,arrayFiltroModulo,function(lista){
						arrayFiltroModulo=lista;
						listFiltroActualizacion=filtrarListActualizaciones();
						cargarFiltroActualizaciones();

					},true);
					
					callAjaxPost(URL + '/scheduler/actualizaciones/vistas', 
							{  },function(){
								$("#alertaActualizaciones").remove();
								
								
							});
				}else{
					console.log("NOPNPO")
				}
			});

	
}   

function cargarFiltroActualizaciones(){
	$("#tblActualizacion tbody tr").remove();
	listFiltroActualizacion.forEach(function(val,index){
		$("#tblActualizacion tbody").append(
				"<tr id='tractu"+val.id+"' >" 
				+"<td id='actuver"+val.id+"'>"+val.version.nombre+"</td>"  
				+"<td id='actufe"+val.id+"'>"+val.fechaTexto+"</td>" 
				+"<td id='actumo"+val.id+"'>"+val.modulo.nombre+"</td>"
				+"<td id='actudesc"+val.id+"'>"+val.descripcion+"</td>"
				+"</tr>");
	});
}


















