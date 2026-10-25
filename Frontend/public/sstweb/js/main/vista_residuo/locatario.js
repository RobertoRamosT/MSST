/**
 * 
 */

var objLocatarioResiduo={};
var listFullLocatariosResiduo;
var listTipoResiduo;
function toggleMenuOpcionLocatario(obj,pindex){
	objLocatarioResiduo=listFullLocatariosResiduo[pindex];
	objLocatarioResiduo.index=pindex;
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").siblings().find("ul").hide(); 	
}
var funcionalidadesLocatario=[ 
 
   {id:"opcEditar",nombre:"Editar",functionClick:function(data){editarLocatarioResiduo()}  },
   {id:"opcAlq",nombre:"Nuevo Alquiler",functionClick:function(data){nuevoAlquilerLocatario()}  },
   {id:"opcAct",nombre:"Nueva Actividad",functionClick:function(data){nuevaActividadLocatario()}  },
   {id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarLocatarioResiduo()}  
   
    
    }
                           ]
function marcarSubOpcionLocatario(pindex){
	funcionalidadesLocatario[pindex].functionClick();
	$(".subDetalleAccion ul").hide();
	$(".listaGestionGosst").hide();
}
function habilitarLocatariosResiduo(){
	var dataParam={
			empresaId:getSession("gestopcompanyid")
			};
	objLocatarioResiduo={id:0};
	var listPanelesPrincipal=[];
	
	callAjaxPost(URL + '/residuo/clientes', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			
			var textIn= "";
			listFullLocatariosResiduo=data.list;
			$(".divListPrincipal").html("");
			listFullLocatariosResiduo.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesLocatario.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionLocatario("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var estiloGosst="gosst-neutral";
				 
				textIn+=("<div class='eventoGeneral "+estiloGosst+"'>" +
						"<button class='btn-gestion btn btn-success ' onclick='toggleMenuOpcionLocatario(this,"+index+")'>" +
						"<i class='fa  fa-caret-down' aria-hidden='true'></i></button>" +
						menuOpcion+ 
						"<strong>"+val.nombre+"</strong><br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Responsable: " +val.responsable+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Correo: " +val.responsableCorreo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Teléfono: " +val.responsableTelefono+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Metraje: " +val.metraje+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i>Aforo: " +val.aforo+"<br>"+
						"<i class='fa fa-info' aria-hidden='true'></i># trabajadores: " +val.numTrabajadores+"<br>"+
						"<a onclick='verAlquileresLocatarioResiduo("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Alguileres: " +val.indicadorAlquiler+"</a><br>"+
						"<a onclick='verActividadesLocatarioResiduo("+index+")'><i class='fa fa-info' aria-hidden='true'></i>Actividades: " +val.indicadorActividad+"</a><br>"+
						"</div>"+
						"<div class='divAlquilerLocatario' id='divAlqLoca"+val.id+"'>" +
						"" +
						"</div>"+
						"<div class='divActividadLocatario divRelacionado' id='divActLoca"+val.id+"'>" +
						"" +
						"</div>"
						
				
				);
				 
				
			});
			 
			var listItemsExam=[
				{sugerencia:"",label:"Nombre",inputForm:"<input class='form-control' id='inputNombreLoca'>"},
				{sugerencia:"",label:"Responsable",inputForm:"<input class='form-control' id='inputRespLoca'>"},
				{sugerencia:"",label:"Correo",inputForm:"<input class='form-control' id='inputCorreoLoca'>"},
				{sugerencia:"",label:"Teléfono",inputForm:"<input class='form-control' id='inputTelLoca'>"},
	 
            	 
            	 {sugerencia:"",label:"Metraje (m2)",inputForm:"<input class='form-control' type='number' id='inputMetroLoca'>"},
            	 {sugerencia:"",label:"Aforo",inputForm:"<input class='form-control' type='number' id='inputAforoLoca'>"},
       			 {sugerencia:"",label:"# trabajadores",inputForm:"<input class='form-control' type='number' id='inputNumTraLoca'>"},
       			 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
             		];
			var textFormExamen="";
			listItemsExam.forEach(function(val,index){
				textFormExamen+=obtenerSubPanelModulo(val);
			});
			var listItemsAlqui=[
		{sugerencia:"",label:"Fecha Inicio",inputForm:"<input onchange='estadoPeriodoAlquiler()' type='date' class='form-control' id='dateInicioAlquiler'>"},
		{sugerencia:"",label:"Fecha Fin",inputForm:"<input onchange='estadoPeriodoAlquiler()' type='date' class='form-control' id='dateFinAlquiler'>"},
		{sugerencia:"",label:"Estado",inputForm:  "",divContainer:"divEstAlquiler"},
		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
            		];
			   			var textFormAlqui="";
			   			listItemsAlqui.forEach(function(val,index){
			   				textFormAlqui+=obtenerSubPanelModulo(val);
			   			});
			   			listTipoResiduo=data.tipo_actividad;
		var selClasifResidActividad=crearSelectOneMenuOblig("selClasifResidActividad", "verAcordeClasificacionActividad()", data.clasificacion_actividad, 
			 "", "id","nombre");
	 var selTipoResidActividad=crearSelectOneMenuOblig("selTipoResidActividad", "", data.tipo_actividad, 
			 "", "id","nombre");
	 var selCategoriaResidActividad=crearSelectOneMenuOblig("selCategoriaResidActividad", "", data.categoria_actividad, 
			 "", "id","nombre");
			   			
	 var listItemsActi=[
	             		{sugerencia:"",label:"Actividad",inputForm:"<input  class='form-control' id='inputDescActividad'>"},
	             		{sugerencia:"",label:"Insumos",inputForm:"<input   class='form-control' id='inputInsuActividad'>"},
	             		{sugerencia:"",label:"Clasificacion de Residuo",inputForm:  selClasifResidActividad,divContainer:""},
	             		{sugerencia:"",label:"Residuo",inputForm:  selTipoResidActividad,divContainer:"divSelResActividad"},
	             		{sugerencia:"",label:"Tipo de Residuo",inputForm:  selCategoriaResidActividad,divContainer:""},
	             		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Enviar</button>"} 
	                         		];
	             			   			var textFormActiqui="";
	             			   		listItemsActi.forEach(function(val,index){
	             			   		textFormActiqui+=obtenerSubPanelModulo(val);
	             			   			}); 			
			listPanelesPrincipal.push(
					{id:"nuevoMovilLocatario" ,clase:"",
							nombre:""+"Nueva Área",
							contenido:"<form id='formNuevoLocatario' class='eventoGeneral'>"+textFormExamen+"</form>"},
					{id:"editarMovilLocatario" ,clase:"contenidoFormVisible",
						nombre:""+"Editar Locatario",
						contenido:"<form id='formEditarLocatario' class='eventoGeneral'>"+textFormExamen+"</form>"},
						{id:"editarMovilAlquilerLoca" ,clase:"contenidoFormVisible",
							nombre:""+" ",
							contenido:"<form id='formEditarAlquiler' class='eventoGeneral'>"+textFormAlqui+"</form>"},
							{id:"editarMovilActividadLoca" ,clase:"contenidoFormVisible",
								nombre:""+" ",
								contenido:"<form id='formEditarActividad' class='eventoGeneral'>"+textFormActiqui+"</form>"},
								
								
						
					{id:"locatarioResiduo",clase:"divLocatarioResiduoGeneral",
							nombre:"Áreas"+" (" +listFullLocatariosResiduo.length+")",
							contenido:textIn}    
						
			
			);
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			$("#editarMovilLocatario").hide();
			 $('#formNuevoLocatario').on('submit', function(e) {  
			        e.preventDefault();
			        objLocatarioResiduo={id:0}
			        guardarLocatarioResiduo();
			 });
			 $('#formEditarLocatario').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarLocatarioResiduo();
			 });
			 $('#formEditarAlquiler').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarAlquilerLocatario();
			 });
			 $('#formEditarActividad').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarActividadLocatario();
			 });
			 
			break;
			default:
				alert("nop");
				break;
		}
	})
} 
function editarLocatarioResiduo(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilLocatario");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar Área");
	 
	editarDiv.find("#inputNombreLoca").val(objLocatarioResiduo.nombre); 
	editarDiv.find("#inputRespLoca").val(objLocatarioResiduo.responsable);
	editarDiv.find("#inputCorreoLoca").val(objLocatarioResiduo.responsableCorreo);
	editarDiv.find("#inputTelLoca").val(objLocatarioResiduo.responsableTelefono);
	editarDiv.find("#inputMetroLoca").val(objLocatarioResiduo.metraje);
	editarDiv.find("#inputAforoLoca").val(objLocatarioResiduo.aforo);
	editarDiv.find("#inputNumTraLoca").val(objLocatarioResiduo.numTrabajadores);
}
function eliminarLocatarioResiduo(){
	var r = confirm("¿Está seguro de eliminar el locatario ?");
	if (r == true) {
		var dataParam = {
				id : objLocatarioResiduo.id,
		};
		callAjaxPost(URL + '/residuo/cliente/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarLocatariosResiduo();
						break;
					default:
						alert("No se puede eliminar, hay alquileres/actividades asociados.");
					}
				});
	}
}
function guardarLocatarioResiduo(){
	var formDiv=$("#editarMovilLocatario");
	if(objLocatarioResiduo.id==0){
		formDiv=$("#nuevoMovilLocatario");
	}
	var campoVacio = true;
	var nombre=formDiv.find("#inputNombreLoca").val();
	var responsable=formDiv.find("#inputRespLoca").val();
	var responsableCorreo=formDiv.find("#inputCorreoLoca").val();
	var responsableTelefono=formDiv.find("#inputTelLoca").val();
	var metraje=formDiv.find("#inputMetroLoca").val();
	var aforo=formDiv.find("#inputAforoLoca").val();
	var numTrabajadores=formDiv.find("#inputNumTraLoca").val();
	
	
		if (campoVacio) {

			var dataParam = {
					id : objLocatarioResiduo.id,  
					nombre:nombre,
					responsable:responsable,
					responsableCorreo:responsableCorreo,
					responsableTelefono:responsableTelefono,
					metraje:metraje,
					aforo:aforo,
					numTrabajadores:numTrabajadores,
					empresa :{empresaId :getSession("gestopcompanyid")}
			}

			callAjaxPost(URL + '/residuo/cliente/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
							habilitarLocatariosResiduo();
						 
							break;
						default:
							console.log("Ocurrió un error al guardar   !");
						}
					});
			 
		} else {
			alert("Debe ingresar todos los campos.");
		}
}