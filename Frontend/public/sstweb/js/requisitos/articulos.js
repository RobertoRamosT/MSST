var banderaEdicion2=false;
var articuloId,articuloObj;
var listFullArticulos, listFullTipoArticulo,listFullNorm,listFullArtOtros;
$(function(){
	$("#btnNuevoArticulos").attr("onclick", "javascript:nuevoArticulo();");
	$("#btnCancelarArticulos").attr("onclick", "javascript:cancelarNuevoArticulo();");
	$("#btnGuardarArticulos").attr("onclick", "javascript:guardarArticulo();");
	$("#btnEliminarArticulos").attr("onclick", "javascript:eliminarArticulo();");  
	$("#btnimportarArticulos").attr("onclick", "javascript:importarArticulo();");  
}) 
function verArticulos(){ 
	$("#tabNormaLegal .container-fluid").hide();
	$("#tabNormaLegal #divContainNormaLegal").hide(); 
	$("#tabNormaLegal #divContainArticulos").show();
	$("#tabNormaLegal").find("h2")
	.html("<a onclick=' volverNorma()'>Norma Legal:  "+normaObj.codigo+"</a>"
			+"> Articulos");
	cargarArticulo();
}
function volverArticulo() {
	$("#tabNormaLegal .container-fluid").hide();
	$("#divContainArticulos").show();
	$("#divContainModArticuloNorma").hide(); 
	$("#tabNormaLegal").find("h2")
	.html("<a onclick=' volverNorma()'>Norma Legal:  "+normaObj.titulo+"</a>"
			+"> Articulos");
}
function importarArticulo()
{
	$("#mdImportArticulos").modal("show");
	$("#mdImportArticulos").find("textarea").val("");
	$("#btnGuardarNuevosArticulos").attr("onclick", "javascript:guardarImportArticulos();"); 
}
function guardarImportArticulos()
{
	var texto=$("#txtListadoArticulos").val(); 
	var listExcelInicial=texto.split("@");
	var listExcel=[];
	var listArticulos={};
	var listArticulosRepe=[]
	var listFullDescripcion="";
	var validado="";
	
	//Usar prefiltrado
	listExcelInicial.forEach(function(val){
		if(val.length > 2 ){
			listExcel.push(val);
		}
	});
	
	if(texto.length<1000000){ 
	    
		var ultimotitulo="";
		//Evitar el for(var int=0;int<listExcel.length-1;int++)
		//no se debería restar acá, porque el cliente
		//puede subir con o sin espacio
		//en el prefiltrado se ve si está vacía
		var listEnviar = [];
		for(var int=0;int<listExcel.length;int++){  
		        // Existe un espacio en entre cada columna, por lo que se buscara la posicion exacta de cada espacio 
			//para determinar la distancia de caracteres que se va a coger desde su inicio hasta encontrar el siguiente espacio.
			// 
			articuloId=0;
			var primerEspacio=listExcel[int].indexOf("\t") 
			var segundoEspacio=listExcel[int].indexOf("\t",primerEspacio+1);
			var tercerEspacio=listExcel[int].indexOf("\t",segundoEspacio+1);
			var cuartoEspacio=listExcel[int].indexOf("\t",tercerEspacio+1);
			// se extrae la primera columna desde el inicio de la cadena hasta el primerEspacio encontrado 
			//y este se supone que es la separacion entre el siguiente valor de la celda
			var titulo=listExcel[int].substring(0,primerEspacio);
			var descripcion=listExcel[int].substring(primerEspacio+1,segundoEspacio); 
			var tipoArticulo=listExcel[int].substring(segundoEspacio+1,tercerEspacio);  
			var comentario=listExcel[int].substring(tercerEspacio+1,cuartoEspacio);
			
			//var tipoArticulo=listExcel[int].substring(tercerEspacio+1,cuartoEspacio); 
			switch (tipoArticulo) {
				case "A":
					tipoArticulo=1;
					break;
				case "I":
					tipoArticulo=2;
					break;
				case "M":
					tipoArticulo=3;
					break;
				case "D":
					tipoArticulo=4;
					break;
				default:
					alert("Por favor coloque el tipo de artticulo adecuado - (A/I/M/D)");
					return;
					
					break;
			}
			
			var fechaReg=convertirFechaTexto(obtenerFechaActual());  
			var normaArticulo=normaObj.id;   
			titulo = titulo.replace("\n","");
			var campoVacio = true; 
			
			if(campoVacio){
				var dataParam = {
					id : articuloId,
					tipoArticulo:{idTipo:tipoArticulo},
					titulo:titulo,comentario : comentario,
					descripcion:descripcion,  
					fechaRegistro:fechaReg,
					normalegal:{id:normaArticulo}
				};
				//no se deben cargar 1 por 1, eso se hace en sst
				// lo que se debería hacer es crear otra ruta /masivo/save
				// y ahí mandar la lista, para no ocupar muchas llamadas
				listEnviar.push(dataParam);
				//callAjaxPost(URL + '/requisitos/norma/articulo/save', dataParam,
				//		cargarArticulo);	 
			} else {
				alert("Debe ingresar todos los campos.");
			}
		} 
		callAjaxPost(URL + '/requisitos/norma/articulo/masivo/save', listEnviar,
				function(data){
			alert("Se guardaron con éxito")
			$("#mdImportArticulos").modal("hide");
			cargarArticulo();
		});
		
		
	}
	else{
		validado="Ha excedido el 1 000 000 de caracteres para el registro";
	} 
	
}
function cargarArticulo() {
	$("#btnCancelarArticulos").hide();
	$("#btnNuevoArticulos").show();
	$("#btnEliminarArticulos").hide();
	$("#btnGuardarArticulos").hide();
	$("#btnimportarArticulos").show(); 
	callAjaxPost(URL + '/requisitos/norma/articulo', {
		id:normaObj.id}, 
		function(data){
			if(data.CODE_RESPONSE=="05"){
				banderaEdicion2=false;
				listFullArticulos=data.list;  
				listFullTipoArticulo=data.listTipos;
				listFullNorm=data.norma;
				listFullArtOtros=data.articulos_otros;
				$("#tblArticulos tbody tr").remove();
				listFullArticulos.forEach(function(val,index){ 
				var listFullDescripcion=(val.descripcion).split("\n");
				var texto="";
				listFullDescripcion.forEach(function(val)
				{
					texto+="<p>"+val+"</p>";
				});
				$("#tblArticulos tbody").append(
						"<tr id='trart"+val.id+"' onclick='editarArticulo("+index+")'>"
							+"<td id='arttipo"+val.id+"'>"+val.tipoArticulo.tipoArticuloTexto+"</td>" 
							+"<td id='arttitulo"+val.id+"' style='text-align: justify;'>"+val.titulo+"</td>"
							+"<td id='artdescrip"+val.id+"' style='text-align: justify;'>"+texto+"</td>"
							+"<td id='artcoment"+val.id+"'>"+val.comentario+"</td>"
							+"<td id='artfechareg"+val.id+"'>"+val.fechaRegistroTexto+"</td>"
							+"<td id='artevi"+val.id+"'>"+val.evidenciaNombre+"</td>"
							+"<td id='artmodnorma"+val.id+"'>"+val.numNormModifcadas+"</td>"
							+"<td id='artderogar"+val.id+"'>"+val.numArtiDerogados+"</td>"
						+"</tr>");
				});
				
				resizeDivWrapper("wrapArticulos",250)
				goheadfixedY("#tblArticulos","#wrapArticulos");// Para mantener el encabezado congelado
				
				
				completarBarraCarga();
				formatoCeldaSombreableTabla(true,"tblArticulos");
			}else{
				console.log("NOPNPO")
			}
		}); 
}

function editarArticulo(pindex) {

	if (!banderaEdicion2) {
		formatoCeldaSombreableTabla(false,"tblArticulos");
		articuloId = listFullArticulos[pindex].id;
		articuloObj=listFullArticulos[pindex];
		
		var tipo=articuloObj.tipoArticulo.idTipo; 
		var selTipo=crearSelectOneMenuOblig("inputTipoArt","",listFullTipoArticulo,tipo,"idTipo","tipoArticuloTexto")
		$("#arttipo" + articuloId).html(selTipo); 
		var titulo=articuloObj.titulo;   
		$("#arttitulo" + articuloId).html(
				"<textarea type='text' id='inputTitulo' class='form-control' style='height:200px;'></textarea>");
		$("#inputTitulo").val(titulo); 
		var descrpcion=articuloObj.descripcion;   
		$("#artdescrip" + articuloId).html(
				"<textarea id='inputDescr' maxlength='50000' class='form-control' style='height:200px;'></textarea>");
		$("#inputDescr").val(descrpcion); 
		 
		var comentario=articuloObj.comentario;   
		$("#artcoment" + articuloId).html(
				"<input id='inputArticComentario'   class='form-control' >");
		$("#inputArticComentario").val(comentario); 
		 
		
		var options={
				container:"#artevi"+articuloId,
				functionCall: function(){},
				descargaUrl:"/requisitos/norma/articulo/evidencia?id="+articuloId,
				esNuevo:false,
				idAux:"Articulo",
				evidenciaNombre:articuloObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		
		var modifcar=$("#artmodnorma"+articuloId).text();
		$("#artmodnorma"+articuloId).addClass("linkGosst")
		.on("click",function(){verModificarArticuloNorma();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+modifcar);
		var derogar=$("#artderogar"+articuloId).text();
		$("#artderogar"+articuloId).addClass("linkGosst")
		.on("click",function(){verDerogarArticuloNorma();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+derogar);
		
		
		banderaEdicion2 = true;
		$("#btnCancelarArticulos").show();
		$("#btnNuevoArticulos").hide();
		$("#btnEliminarArticulos").show();
		$("#btnGuardarArticulos").show();
		$("#btnimportarArticulos").hide(); 
	}
	
}


function nuevoArticulo() {
	if (!banderaEdicion2) {
		articuloId = 0; 
		var selTipo=crearSelectOneMenuOblig("inputTipoArt","",listFullTipoArticulo,"","idTipo","tipoArticuloTexto") 
		 
		$("#tblArticulos tbody")
				.prepend(
					"<tr>"
						+"<td>"+ selTipo+"</td>"
						+"<td>"+"<textarea id='inputTitulo' maxlength='10000' class='form-control' style='height:200px;'></textarea>" +"</td>"
						+"<td>"+"<textarea id='inputDescr' maxlength='10000' class='form-control' style='height:200px;'></textarea>" +"</td>"
						+"<td><input id='inputArticComentario'   class='form-control' ></td>"
						
						+"<td>...</td>"
						+"<td id='inputArtEvi'>...</td>" 
						+"<td>...</td>" 
						+"<td>...</td>" 
					+ "</tr>");
	 
		var options={
				container:"#inputArtEvi",
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"Articulo",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options);
		$("#btnCancelarArticulos").show();
		$("#btnNuevoArticulos").hide();
		$("#btnEliminarArticulos").hide();
		$("#btnGuardarArticulos").show(); 
		$("#btnimportarArticulos").hide(); 
		banderaEdicion2 = true;
		formatoCeldaSombreableTabla(false,"tblArticulos");
	} else {
		alert("Guarde primero.");
	}
} 
function guardarArticulo() {

	var campoVacio = true;
	var tipo=$("#inputTipoArt").val(); 
	var titulo=$("#inputTitulo").val();  
	var descripcion=$("#inputDescr").val();
	var comentario = $("#inputArticComentario").val();
	var fechaReg=convertirFechaTexto(obtenerFechaActual());  
	var normaArticulo=normaObj.id;
	 
	if (campoVacio) {
		var dataParam = {
			id : articuloId,
			tipoArticulo:{idTipo:tipo},
			titulo:titulo,comentario : comentario,
			descripcion:descripcion,  
			fechaRegistro:fechaReg,
			normalegal:{id:normaArticulo}
		};

		callAjaxPost(URL + '/requisitos/norma/articulo/save', dataParam,
				procesarResultadoGuardarArticulo);	 
	} else {
		alert("Debe ingresar todos los campos.");
	} 	
}


function procesarResultadoGuardarArticulo(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviArticulo",
				bitsEvidenciaNormaLegal,"/requisitos/norma/articulo/evidencia/save",
				cargarArticulo,"id")
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
function eliminarArticulo() {
	var r = confirm("¿Está seguro de eliminar el detalle?");
	if (r == true) {
		var dataParam = {
				id : articuloId,
		};
		
		callAjaxPost(URL + '/requisitos/norma/articulo/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarArticulo();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}
function cancelarNuevoArticulo(){
	cargarArticulo();
}  

