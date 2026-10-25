/**
 * 
 */


var relacionId;
var banderaEdicionRelacionado;
var listFullRelacionados;
var listRelacionesPermitidas;
function verRelacionadosTrabajador(){
	$("#mdCursoFecha").modal("show");
	$("#mdCursoFecha").find(".modal-body").hide();
	$("#mdCursoFecha").find(".modal-title").html("<a onclick='volverCursoCapacitacion()'>Curso '"+cursoCapacitacionEdicion.nombre+"'</a> > Relaciones ");
	$("#mdCursoFecha").find("#modalRelacionadosCurso").show();
	
	llamarRelacionados();
}
function llamarRelacionados(){
	relacionId=0;
	banderaEdicionRelacionado=false;
	listFullRelacionados=[];
	$("#btnAgregarRelacionado").show().attr("onclick","nuevoRelacionado()");
	$("#btnCancelarRelacionado").hide().attr("onclick","llamarRelacionados()");
	$("#btnEliminarRelacionado").hide().attr("onclick","eliminarRelacionado()");
	$("#btnGuardarRelacionado").hide().attr("onclick","guardarRelacionado()");
	var dataParam={id:cursoCapacitacionId,empresaId: sessionStorage.getItem("gestopcompanyid")}
	callAjaxPost(URL + '/capacitacion/curso/relacionados', dataParam, function(data) {
		
		var list = data.list;
		listFullRelacionados=data.list;
		listRelacionesPermitidas=data.listRelacionesPermitidas;
		$("#tblRelacionados tbody").html("");
		listFullRelacionados.forEach(function(val,index){
			$("#tblRelacionados tbody").append("<tr onclick='javascript:editarRelacionado("+
					index+")' >"+
					
					"<td id='cursPred"+
					val.id + "'>"+
					val.cursoPredecesor.nombre+ "</td>" +
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblRelacionados");
	
});
	
}
function editarRelacionado(pindex){
	if(!banderaEdicionRelacionado){
		banderaEdicionRelacionado=true;
		$("#btnAgregarRelacionado").hide();
		$("#btnCancelarRelacionado").show();
		$("#btnEliminarRelacionado").show();
		$("#btnGuardarRelacionado").show();
		formatoCeldaSombreableTabla(false,"tblRelacionados");
		relacionId=listFullRelacionados[pindex].id;
		
		//
		var listPermitdoAux=listRelacionesPermitidas;
		listPermitdoAux.push(listFullRelacionados[pindex].cursoPredecesor)
		var cursoPredecesor=listFullRelacionados[pindex].cursoPredecesor.id;
		var selCursoPredecesor=crearSelectOneMenuOblig("selCursoPredecesor", "", 
				listPermitdoAux, cursoPredecesor, "id","nombre") ;
		$("#cursPred"+relacionId).html(selCursoPredecesor);
		//
	}
}
function nuevoRelacionado(){
	$("#btnAgregarRelacionado").hide();
	$("#btnCancelarRelacionado").show();
	$("#btnEliminarRelacionado").hide();
	$("#btnGuardarRelacionado").show();
	banderaEdicionRelacionado=true;
	relacionId = 0;
	var selCursoPredecesor=crearSelectOneMenuOblig("selCursoPredecesor", "", 
			listRelacionesPermitidas, "", "id","nombre") ;
	$("#tblRelacionados tbody")
			.append(
					"<tr id='tr0'>"
					+"<td>"+selCursoPredecesor+"</td>"
							+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblRelacionados");
}

function eliminarRelacionado(){
	var objetivoObj={
			id:relacionId
	}
	var r=confirm("¿Está seguro de eliminar este relacion?");
	if(r){
		callAjaxPost(URL + '/capacitacion/curso/relacionado/delete', objetivoObj,
				function(data) {
					
					
			llamarRelacionados();
					
				});
	}
	
}

function guardarRelacionado(){
	var predecesorId=$("#selCursoPredecesor").val();
	var campoVacio=false;
	 
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var objetivoObj={
				id:relacionId,
				cursoPredecesor:{id:predecesorId},
				cursoMeta:{id:cursoCapacitacionId}
		}
		console.log(objetivoObj);
		callAjaxPost(URL + '/capacitacion/curso/relacionado/save', objetivoObj,
				function(data) {
				var nuevoId=	data.nuevoId
				llamarRelacionados();
			
					
				});
	}
	
}


	

	
	
	
	

