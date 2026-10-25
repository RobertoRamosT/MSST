/**
 * 
 */


var profesorId;
var banderaEdicionProfesor;
var listFullProfesores;

function verProfesoresTrabajador(){
	$("#mdCursoFecha").modal("show");
	$("#mdCursoFecha").find(".modal-body").hide();
	$("#mdCursoFecha").find(".modal-title").html("Representantes Académicos de la Empresa");
	$("#mdCursoFecha").find("#modalProfesorsCurso").show();
	
	llamarProfesores();
}
function llamarProfesores(){
	profesorId=0;
	banderaEdicionProfesor=false;
	listFullProfesores=[];
	$("#btnAgregarProfesor").show().attr("onclick","nuevoProfesor()");
	$("#btnCancelarProfesor").hide().attr("onclick","llamarProfesores()");
	$("#btnEliminarProfesor").hide().attr("onclick","eliminarProfesor()");
	$("#btnGuardarProfesor").hide().attr("onclick","guardarProfesor()");
	var dataParam={idCompany:sessionStorage.getItem("gestopcompanyid")}
	callAjaxPost(URL + '/capacitacion/profesores', dataParam, function(data) {
		
		var list = data.list;
		listFullProfesores=data.list;
		$("#tblProfesores tbody").html("");
		listFullProfesores.forEach(function(val,index){
			$("#tblProfesores tbody").append("<tr onclick='javascript:editarProfesor("+
					index+")' >"+
					
					"<td id='profeNombre"+
					val.id + "'>"+
					val.nombre+ "</td>" +
					"<td id='profeCargo"+
					val.id + "'>"+
					val.cargo+ "</td>" +
					"<td id='profeExp"+
					val.id + "'>"+
					val.experiencia+ "</td>" +
					"<td id='profeCorreo"+
					val.id + "'>"+
					val.correo+ "</td>" +
					"<td id='profeFoto"+
					val.id + "'>"+
					(val.fotoNombre==null?"---":val.fotoNombre) + "</td>" +
					"<td id='profeFirma"+
					val.id + "'>"+
					(val.firmaNombre==null?"---":val.firmaNombre) + "</td>" +
					"</tr>")
		});
	
		formatoCeldaSombreableTabla(true,"tblProfesores");
	
});
	
}
function editarProfesor(pindex){
	if(!banderaEdicionProfesor){
		banderaEdicionProfesor=true;
		$("#btnAgregarProfesor").hide();
		$("#btnCancelarProfesor").show();
		$("#btnEliminarProfesor").show();
		$("#btnGuardarProfesor").show();
		formatoCeldaSombreableTabla(false,"tblProfesores");
		profesorId=listFullProfesores[pindex].id;
		
		//
		var nombre=listFullProfesores[pindex].nombre;
		$("#profeNombre"+profesorId).html("<input  class='form-control' id='textNombreProfe' >");
		$("#textNombreProfe").val(nombre);
		//
		var correo=listFullProfesores[pindex].correo;
		$("#profeCorreo"+profesorId).html("<input  class='form-control' id='textCorreoProfe' >");
		$("#textCorreoProfe").val(correo);
		//
		var cargo=listFullProfesores[pindex].cargo;
		$("#profeCargo"+profesorId).html("<input  class='form-control' id='textCargoProfe' >");
		$("#textCargoProfe").val(cargo);
		//
		var experiencia=listFullProfesores[pindex].experiencia;
		$("#profeExp"+profesorId).html("<input  class='form-control' id='textExpProfe' >");
		$("#textExpProfe").val(experiencia);
		//
		crearFormEvidencia("Profesor",false,"#profeFoto"+profesorId);
		crearFormEvidencia("ProfesorFirma",false,"#profeFirma"+profesorId);
	var eviNombre=listFullProfesores[pindex].fotoNombre;
	var firmaNombre=listFullProfesores[pindex].firmaNombre;
	$("#btnDescargarFileProfesor").attr("onclick","location.href='"+ URL
				+ "/capacitacion/profesor/foto?profesorId="
				+ profesorId+"'");	 
		$("#inputEviProfesor").val(eviNombre);
		$("#btnDescargarFileProfesorFirma").attr("onclick","location.href='"+ URL
				+ "/capacitacion/profesor/firma?profesorId="
				+ profesorId+"'");	 
		$("#inputEviProfesorFirma").val(firmaNombre);
	}
}
function nuevoProfesor(){
	$("#btnAgregarProfesor").hide();
	$("#btnCancelarProfesor").show();
	$("#btnEliminarProfesor").hide();
	$("#btnGuardarProfesor").show();
	var inputEvi=crearFormEvidencia("Profesor",true);
	var inputEviFirma=crearFormEvidencia("ProfesorFirma",true);
banderaEdicionProfesor=true;
	profesorId = 0;
	$("#tblProfesores tbody")
			.append(
					"<tr id='tr0'>"
					+"<td>"+"<input type='text' class='form-control' id='textNombreProfe' >"+"</td>"
					+"<td>"+"<input type='text' class='form-control' id='textCargoProfe' >"+"</td>"
					+"<td>"+"<input  class='form-control' id='textExpProfe' >"+"</td>"
					+"<td>"+"<input type='text' class='form-control' id='textCorreoProfe' >"+"</td>"
					
					
					+"<td>"+inputEvi+" </td>"
					+"<td>"+inputEviFirma+" </td>"
		+ "</tr>");
	formatoCeldaSombreableTabla(false,"tblProfesores");
}

function eliminarProfesor(){
	var objetivoObj={
			id:profesorId
	}
	var r=confirm("¿Está seguro de eliminar este profesor?");
	if(r){
		callAjaxPost(URL + '/capacitacion/profesor/delete', objetivoObj,
				function(data) {
					
					
			llamarProfesores();
					
				});
	}
	
}

function guardarProfesor(){
	var nombre=$("#textNombreProfe").val();
	var correo=$("#textCorreoProfe").val();
	var experiencia=$("#textExpProfe").val();
	var cargo=$("#textCargoProfe").val();
	var campoVacio=false;
	 
	
	if(campoVacio){
		alert("Complete el campo")
	}else{
		var objetivoObj={
				id:profesorId,
				nombre:nombre,
				correo:correo,cargo:cargo,
				experiencia:experiencia,
			empresaId:sessionStorage.getItem("gestopcompanyid")
		}
		console.log(objetivoObj);
		callAjaxPost(URL + '/capacitacion/profesor/save', objetivoObj,
				function(data) {
				var nuevoId=	data.nuevoId
				guardarEvidenciaMultipleAuto(nuevoId,"fileEviProfesor"
					,bitsProfesor,"/capacitacion/profesor/foto/save",preLlamarProfesores,1);
				guardarEvidenciaMultipleAuto(nuevoId,"fileEviProfesorFirma"
						,bitsProfesor,"/capacitacion/profesor/firma/save",preLlamarProfesores,1);
					
				});
	}
	
}
var numEvidenciasGuardadas=0;
var numEvidenciasTotal=2;
function preLlamarProfesores(){
	numEvidenciasGuardadas++;
	console.log(numEvidenciasGuardadas);
	if(numEvidenciasGuardadas==numEvidenciasTotal){
		llamarProfesores();
		numEvidenciasGuardadas=0;
	};
}
	

	
	
	
	

