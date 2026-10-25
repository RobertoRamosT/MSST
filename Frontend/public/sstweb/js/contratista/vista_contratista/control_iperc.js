var controlIpercId;
var controlIpercObj=[];
var banderaEdicionContr=false;
var listFullControlIperc;
var estadoControlIperc; 
var funcionalidadesControl=[
                                 /*{id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
                                 	window.open(URL+"/contratista/proyecto/iperc/evaluacion/control/evidencia?id="+controlIpercObj.id,'_blank')
                                 	}  },*/
                                 {id:"opcEditar",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:function(data){editarControlIperc()}  },
                                 {id:"opcElimnar",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:function(data){eliminarControlIperc()}  }];
function marcarSubOpcionControl(pindex){
	funcionalidadesControl[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".subSubDetalleAccion ul").hide();
}
function toggleMenuOpcionControl(obj,pindex){
	controlIpercObj=listFullControlIperc[pindex]; 
	$(obj).parent(".subDetalleAccion").find("ul").toggle();
	$(obj).parent(".subDetalleAccion").siblings().find("ul").hide(); 	
}
function cargarControlesIperc(pindex) { 
	pindex=defaultFor(pindex,indexIperc);
	 //
	$(".subOpcionAccion").html("");
	 $(".subOpcionAccion").hide();
		
	 ipercProyObj=listFullIpercProyecto[pindex] ; 
	//
	var ipercProyObjSend = {
			id : ipercProyObj.id
	}; 
	indexIperc=pindex;
	callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/controles', 
			ipercProyObjSend, function(data){
				if(data.CODE_RESPONSE=="05"){
					listFullControlIperc=data.list;
					banderaEdicionContr=false;   
					listFullControlIperc.forEach(function(val,index){
						var menuOpcion="<ul class='list-group' >";
						funcionalidadesControl.forEach(function(val1,index1){
							menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionControl("+index1+")'>"+val1.nombre+" </li>"
						});
						menuOpcion+="</ul>";
						var btnOpcion=	"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionControl(this,"+index+")'>" +
											"Ver Opciones<i class='fa fa-angle-double-down' aria-hidden='true'></i>" +
										"</a>"; 
						var clase="gosst-neutral";
						if(val.estado.id==2){
							clase="gosst-aprobado"
						}
						 var eviNombre=(val.evidenciaNombre==""?
								 "Sin Registro"
								 : 
							 	"<a class='efectoLink' href='"+URL+"/contratista/proyecto/iperc/evaluacion/control/evidencia?id="+val.id+"'>" +
							 		val.evidenciaNombre+
							 	"</a>");
						 
						$("#proyectoTable"+listFullProyectoSeguridad[indexPostulante].id)
						.find("#detalleMovilIperc"+ipercProyObj.id+" .subOpcionAccion").show()
						.append("<div class='subDetalleAccion  "+clase+"'  >" +
									btnOpcion+
									menuOpcion+
									"<strong>CONTROL "+(index+1)+"<strong><br>"+ 
									"<i class='fa fa-info' aria-hidden='true'></i> Descripción: " +val.descripcion+ "<br>"+
									"<i class='fa fa-list-ul' aria-hidden='true'></i> Tipo de Control: " +val.tipo.nombre+ "<br>"+
									"<i class='fa fa-clock-o' aria-hidden='true'></i> Fecha Planificada: " +val.fechaPlanificadaTexto+ "<br>"+
									"<i class='fa fa-calendar-check-o' aria-hidden='true'></i> Fecha Subida: "+val.fechaRealTexto+"<br>"+
									"<i class='fa fa-download' aria-hidden='true'></i> Evidencia: " 
									+eviNombre+
								"</div> " ); 
					});
					$(".subDetalleAccion ul").hide(); 
				}else{
					console.log("NOPNPO")
				}
			});
	
}

function editarControlIperc() {


	if (!banderaEdicionContr) {
		$("#editarMovilControlIperc").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Editar control  "); 
		
		var descripcion=controlIpercObj.descripcion;
		var fechaPlan=convertirFechaInput(controlIpercObj.fechaPlanificada); 
		
		var selTipoControlIperc=crearSelectOneMenuOblig("selTipoControlIperc", "", listTiposControlIperc, controlIpercObj.tipo.id
				, "id", "nombre");
		$("#divSelTipoControlIperc").html(selTipoControlIperc);
		
		//
		$(".divListPrincipal>div").hide();
		$("#editarMovilControlIperc").show(); 
		
		
		$("#inputDescControl").val(descripcion);
		$("#inputFechaControl").val(fechaPlan); 
		
		var eviNombre=controlIpercObj.evidenciaNombre;
		var options=
		{container:"#eviControl",
				functionCall:function(){ },
				descargaUrl: "/contratista/proyecto/iperc/evaluacion/control/evidencia?id="+controlIpercObj.id,
				esNuevo:false,
				idAux:"ControlIperc",
				evidenciaNombre:eviNombre};
		crearFormEvidenciaCompleta(options);
		  
				hallarEstadoImplementacionActividad();
			//
			  
				
		banderaEdicionContr = false;   
	}
	
}

function agregarControlIperc(pindex) { 
	controlIpercObj={id: 0};
		ipercProyObj =listFullIpercProyecto[pindex];
		indexIperc=pindex;
		$("#editarMovilControlIperc").find(".tituloSubList")
		.html(textoBotonVolverContenido+"Nuevo control de la evaluación IPERC 'Actividad: "
				+ipercProyObj.actividad+" , Peligro: " 
						+ipercProyObj.peligro+" ' ");
		
		$("#inputDescControl").focus();
		var selTipoControlIperc=crearSelectOneMenuOblig("selTipoControlIperc", "", listTiposControlIperc, ""
				, "id", "nombre");
		$("#divSelTipoControlIperc").html(selTipoControlIperc);
			
			var options=
			{container:"#eviControl",
					functionCall:function(){ },
					descargaUrl: "",
					esNuevo:true,
					idAux:"ControlIperc",
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
			$(".divListPrincipal>div").hide();
			$("#editarMovilControlIperc").find("form input").val("");
			$("#editarMovilControlIperc").show();  	
		 
}

function cancelarActProyecto() {
	cargarTiposContratista();
}

function eliminarControlIperc() { 
	var r = confirm("¿Está seguro de eliminar el control?");
	if (r == true) {
		var dataParam = {
				id : controlIpercObj.id
		};

		callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/control/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarControlesIperc();
						break;
					default:
						alert("Ocurrió un error al eliminar !");
					}
				});
	}
}

function guardarControlIperc(functionCallBack) {

	var campoVacio = true;
	var tipo=$("#selTipoControlIperc").val();   
	var descripcion=$("#inputDescControl").val();   
	var fecha=$("#inputFechaControl").val();    

		if (campoVacio) {

			var dataParam = {
				id : controlIpercObj.id, 
				tipo:{id:tipo}, 
				descripcion:descripcion,
				fechaPlanificada:convertirFechaTexto(fecha), 
				iperc:{id:ipercProyObj.id}
			};

			callAjaxPost(URL + '/contratista/proyecto/iperc/evaluacion/control/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05": 
							guardarEvidenciaAuto(data.nuevoId,"fileEviControlIperc"
									,bitsEvidenciaControl,"/contratista/proyecto/iperc/evaluacion/control/evidencia/save"
									,function(){
								volverDivSubContenido();
								cargarIpercProyecto(); 
								if(functionCallBack!=null){
									functionCallBack();
								}
							});
						 
							break;
						default:
							console.log("Ocurrió un error al guardar !");
						}
					},null,null,null,null,false);
			 
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}

 

 


