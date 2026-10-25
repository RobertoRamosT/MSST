/**
 * 
 */
var categoriaId,categoriaObj;
var banderaEdicion3=false;
var listFullCategorias;
$(function(){
	$("#btnNuevoCategoria").attr("onclick", "javascript:nuevoCategoria();");
	$("#btnCancelarCategoria").attr("onclick", "javascript:cancelarNuevoCategoriaPsico();");
	$("#btnGuardarCategoria").attr("onclick", "javascript:guardarCategoria();");
	$("#btnEliminarCategoria").attr("onclick", "javascript:eliminarCategoria();");
 
})
/**
 * 
 */
function volverCategorias(){
	$("#divGeneralPsicologia .container-fluid").hide();
	$("#divGeneralPsicologia #divContainCategorias").show();
	$( "h2").html("<a onclick='volverListas()'>"+listaObj.nombre+"</a> > Categorias de evaluación");
}
function cargarCategoriasListaPsicologia() {
    
    var valorResize= 180;
    resizeDivWrapper("wrapperCategorias",valorResize);     
    
	$("#btnCancelarCategoria").hide();
	$("#btnNuevoCategoria").show();
	$("#btnEliminarCategoria").hide();
	$("#btnGuardarCategoria").hide();
	
	volverCategorias();
	callAjaxPost(URL + '/psicologia/categorias', 
			{id : listaObj.id}, function(data){
				if(data.CODE_RESPONSE=="05"){
					banderaEdicion3=false;
				 listFullCategorias=data.list; 
					$("#tblCategorias tbody tr").remove();
					listFullCategorias.forEach(function(val,index){
						
						$("#tblCategorias tbody").append(
								"<tr id='trcat"+val.id+"' onclick='editarCategoria("+index+")'>" +
								"<td>"+(index+1)+"</td>"+
								"<td id='catnom"+val.id+"'>"+val.nombre+"</td>"  +
								 +"</tr>");
					});
					formatoCeldaSombreableTabla(true,"tblCategorias");
				}else{
					console.log("NOPNPO")
				}
				goheadfixedY("#tblCategorias","#wrapperCategorias"); 
			});
}

function editarCategoria(pindex) {

	if (!banderaEdicion3) {
		formatoCeldaSombreableTabla(false,"tblCategorias");
		categoriaId = listFullCategorias[pindex].id;
		categoriaObj=listFullCategorias[pindex];
		
		var nombre=listFullCategorias[pindex].nombre;
		$("#catnom" + categoriaId).html(
				"<input type='text' id='inputNombreCategoria' class='form-control'>");
		$("#inputNombreCategoria").val(nombre);
		// 
		 
		banderaEdicion3 = true;
		$("#btnCancelarCategoria").show();
		$("#btnNuevoCategoria").hide();
		$("#btnEliminarCategoria").show();
		$("#btnGuardarCategoria").show();
		
		
		
		
	}
	
}


function nuevoCategoria() {
	if (!banderaEdicion3) {
		categoriaId = 0; 
		$("#tblCategorias:first tbody")
				.prepend(
						"<tr  >"
						+"<td>...</td>"
						+"<td>"+"<input type='text' id='inputNombreCategoria' " +
						" class='form-control' autofocus></td>" 
						 
								+ "</tr>");
		$("#inputNombreCategoria").focus();
		$("#btnCancelarCategoria").show();
		$("#btnNuevoCategoria").hide();
		$("#btnEliminarCategoria").hide();
		$("#btnGuardarCategoria").show(); 
		banderaEdicion3 = true;
		formatoCeldaSombreableTabla(false,"tblCategorias");
	} else {
		alert("Guarde primero.");
	}
}

function cancelarCategoria() {
	cargarCategoriasListaPsicologia();
}

function eliminarCategoria() {
	var r = confirm("¿Está seguro de eliminar la categoria?");
	if (r == true) {
		var dataParam = {
				id : categoriaId,
		};
		callAjaxPost(URL + '/psicologia/categoria/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarCategoriasListaPsicologia();
						break;
					default:
						alert("No se puede eliminar, hay items asociados a esta categoria.");
					}
				});
	}
}

function guardarCategoria() {

	var campoVacio = true;
	var nombre=$("#inputNombreCategoria").val();   
if (nombre.length<1 ) {
	campoVacio = false;
	}

		if (campoVacio) {

			var dataParam = {
				id : categoriaId,
				nombre:nombre, 
				examenPsicologia :{id :listaObj.id}
			};

			callAjaxPost(URL + '/psicologia/categoria/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":
						
							cargarCategoriasListaPsicologia();
							break;
						default:
							console.log("Ocurrió un error al guardar la categoria!");
						}
					});
			
		
		
			
			
			
			
		} else {
			alert("Debe ingresar todos los campos.");
		}
	
	
}


function cancelarNuevoCategoriaPsico(){
	cargarCategoriasListaPsicologia();
}

