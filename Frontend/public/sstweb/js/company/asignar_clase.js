var listaFullEmpSub3,listSeccion,listDivision,listGrupo;
var listClase;
var empsubdId, empsubdObj;
var banderaEdicion2 = false;
$(function() {
	$("#btnNuevoCodigoCIIU").attr("onclick", "javascript: nuevoCiiu();");
	$("#btnCancelarCodigoCIIU").attr("onclick","javascript: cancelarnuevoEmpSub3Tipo();");
	$("#btnGuardarCodigoCIIU").attr("onclick","javascript: guardarAsignarCiiu();");
	$("#btnIngresarCodigoCIIU").attr("onclick","javascript: ingresarCodigoCIIU();");  
	$("#btnEliminarCodigoCIIU").attr("onclick","javascript: eliminarEmpSub3Tipo();");  
	//$("#btnImportarCodigoCIIU").attr("onclick","javascript: ();");
})
function verEmpSub3Tipo() {  
	listFullEmpresa.forEach(function(val,index)
	{
		if(val.idCompany==idCompanyEdicion)
		{
			companyObj=listFullEmpresa[index];
		}
	});
	$("#tabEmpresa .container-fluid").hide(); 
	$("#divContainCodigoCIIU").show();
	$("#tabEmpresa").find("h2").html("Asignar Codigo de Clasificacion Industrial Internacional Uniforme <br>"
			+"<a onclick='volverVistaEmpresa()'>Empresa  :"+companyObj.name+"</a>");
	cargarEmpSub3Tipo();
}
function cargarEmpSub3Tipo() {
	$("#btnCancelarCodigoCIIU").hide();
	$("#btnNuevoCodigoCIIU").show();
	$("#btnImportarCodigoCIIU").show();
	$("#btnGuardarCodigoCIIU").hide(); 
	$("#btnIngresarCodigoCIIU").show(); 
	$("#btnEliminarCodigoCIIU").hide(); 
	
	callAjaxPost(URL + '/empresa/ciiu', {
		idCompany : companyObj.idCompany},
		function(data) {
			if (data.CODE_RESPONSE = "05") { 
				banderaEdicion2 = false;
				listaFullEmpSub3 = data.list; 
				listSeccion = data.seccion; 
				listDivision = data.division; 
				listGrupo = data.grupo; 
				listClase = data.clase;  
				$("#tblCodigoCIIU tbody tr").remove(); 
				listaFullEmpSub3.forEach(function(val, index) {
					$("#tblCodigoCIIU tbody").append(
							"<tr id='tremp"+val.id+"' onclick='editarCiiu("+index+")'>" 
							+"<td id='empsubcod"+val.id+"'>"+val.subSubSubtipoempresa.codigo+"</td>"
								+"<td id='empsuba"+val.id+"'>"+val.subSubSubtipoempresa.subSubtipoempresa.subtipoempresa.tipoempresa.nombre+"</td>"
								+"<td id='empsubb"+val.id+"'>"+val.subSubSubtipoempresa.subSubtipoempresa.subtipoempresa.nombre+"</td>"
								+"<td id='empsubc"+val.id+"'>"+val.subSubSubtipoempresa.subSubtipoempresa.nombre+"</td>"
								+"<td id='empsubd"+val.id+"'>"+val.subSubSubtipoempresa.nombre+"</td>"  	
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblCodigoCIIU");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		});
}
function nuevoCiiu(){
	if(!banderaEdicion2){
		empsubdId=0; 
		var selSeccion=crearSelectOneMenuOblig("inputEmpreSubSecc","verDivision()",listSeccion,"","id","nombre");
		$("#tblCodigoCIIU tbody").prepend(
			"<tr>"
				+"<td id='empsubcod0'></td>"
				+"<td>"+selSeccion+"</td>"
				+"<td id='empsubb"+empsubdId+"'></td>"
				+"<td id='empsubc"+empsubdId+"'></td>" 
				+"<td id='empsubd"+empsubdId+"'></td>"
			+"</tr>"); 
		verDivision();
		$("#btnCancelarCodigoCIIU").show();
		$("#btnNuevoCodigoCIIU").hide();
		$("#btnImportarCodigoCIIU").hide();
		$("#btnGuardarCodigoCIIU").show(); 
		$("#btnIngresarCodigoCIIU").hide();   
		$("#btnEliminarCodigoCIIU").hide(); 
		banderaEdicion2=true;
		formatoCeldaSombreableTabla(false,"tblCodigoCIIU");
	}
	else{
		alert("Guarde Primero.");
	}

}
function editarCiiu(pindex){
	if(!banderaEdicion2){
		formatoCeldaSombreableTabla(false,"tblCodigoCIIU");
		empsubdId=listaFullEmpSub3[pindex].id;
		empsubdObj=listaFullEmpSub3[pindex]; 
		 
		var seccion=empsubdObj.subSubSubtipoempresa.subSubtipoempresa.subtipoempresa.tipoempresa.id;
		var selSeccion=crearSelectOneMenuOblig("inputEmpreSubSecc","verDivision()",listSeccion,seccion,"id","nombre");
		$("#empsuba" + empsubdId).html(selSeccion); 
		verDivision();	 
		banderaEdicion2=true;
		$("#btnCancelarCodigoCIIU").show();
		$("#btnNuevoCodigoCIIU").hide();
		$("#btnImportarCodigoCIIU").hide();
		$("#btnGuardarCodigoCIIU").show();
		$("#btnIngresarCodigoCIIU").hide(); 
		$("#btnEliminarCodigoCIIU").show(); 
	}
}
function guardarAsignarCiiu(){
	var empresaId=companyObj.idCompany; 
	var sub3TipoEmpresaId=$("#inputEmpreSubClas").val();
	
	if(typeof sub3TipoEmpresaId == "undefined")// si no existe lanzar alerta
	{
		alert("Clase no existente, por favor seleccione una existente");return;
	}
	var dataParam=
	{
		id:empsubdId,
		empresa:{idCompany:empresaId},
		subSubSubtipoempresa:{id:sub3TipoEmpresaId}
	}
	callAjaxPost(URL+'/empresa/ciiu/save',dataParam,verEmpSub3Tipo);
}  
function eliminarEmpSub3Tipo() {
	var r = confirm("¿Está seguro de eliminar este registro?");
	if (r == true) {
		var dataParam = {
				id : empsubdId
		};
		callAjaxPost(URL + '/empresa/ciiu/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarEmpSub3Tipo();
						break;
					default:
						alert("No se puede eliminar .");
					}
				});
	}
}
function cancelarnuevoEmpSub3Tipo(){
	cargarEmpSub3Tipo();
}

function verDivision(){
	var seccionSelecc=$("#inputEmpreSubSecc").val();  
	var listFullDivision=[]; 
	listDivision.forEach(function(val,index)
	{ 
		if(val.tipoempresa.id==seccionSelecc)
		{
			listFullDivision.push({id:val.id,nombre:val.nombre,tipoempresa:{id:val.tipoempresa.id}});
		}
	});  
	var msg="";  
	if(listFullDivision.length!=0)
	{
		var divisionSel;
		if(empsubdId!=0)
		{
			divisionSel=empsubdObj.subSubSubtipoempresa.subSubtipoempresa.subtipoempresa.id;  
		}
		else 
		{
			divisionSel=0;
		} 
		var selDivsion=crearSelectOneMenuOblig("inputEmpreSubDiv","verGrupo()",listFullDivision,divisionSel,"id","nombre")
		$("#empsubb" + empsubdId).html(selDivsion);   
	}
	else
	{
		msg="Sin Divisiones para seleccionar ..."; 
		$("#empsubb"+empsubdId+ " select").remove();
		$("#empsubb"+empsubdId+ " div").remove();
		$("#empsubb"+empsubdId+ " input").remove();
		$("#empsubb"+empsubdId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}   
	verGrupo(); 
}
function verGrupo(){
	var divisionSelecc=$("#inputEmpreSubDiv").val();  
	var listFullGrupo=[]; 
	listGrupo.forEach(function(val,index)
	{ 
		if(val.subtipoempresa.id==divisionSelecc)
		{
			listFullGrupo.push({id:val.id,nombre:val.nombre,subtipoempresa:{id:val.subtipoempresa.id}});
		}
	});  
	var msg="";  
	if(listFullGrupo.length!=0)
	{
		var grupoSel;
		if(empsubdId!=0)
		{
			grupoSel=empsubdObj.subSubSubtipoempresa.subSubtipoempresa.id;  
		}
		else 
		{
			grupoSel=0;
		} 
		var selGrupo=crearSelectOneMenuOblig("inputEmpreSubGrup","verClase()",listFullGrupo,grupoSel,"id","nombre")
		$("#empsubc" + empsubdId).html(selGrupo);   
	}
	else
	{
		msg="Sin Grupos para seleccionar ..."; 
		$("#empsubc"+empsubdId+ " select").remove();
		$("#empsubc"+empsubdId+ " div").remove();
		$("#empsubc"+empsubdId+ " input").remove();
		$("#empsubc"+empsubdId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}  
	verClase();
}
function verClase(){
	var grupoSelecc=$("#inputEmpreSubGrup").val();  
	var listFullClase=[]; 
	listClase.forEach(function(val,index)
	{
		if(val.subSubtipoempresa.id==grupoSelecc)
		{
			listFullClase.push({codigo : val.codigo,id:val.id,nombre:val.nombre,subSubtipoempresa:{id:val.subSubtipoempresa.id}});
		}
	});  
	var msg="";   
	if(listFullClase.length!=0)
	{
		var claseSel;
		if(empsubdId!=0)
		{
			claseSel=empsubdObj.subSubSubtipoempresa.id;   
		}
		else 
		{
			claseSel=0;
		} 
		var selClase=crearSelectOneMenuOblig("inputEmpreSubClas","verAcordeClase()",listFullClase,claseSel,"id","nombre")
		$("#empsubd" + empsubdId).html(selClase);
		verAcordeClase();
	}
	else
	{
		msg="Sin Clases para seleccionar ..."; 
		$("#empsubd"+empsubdId+ " select").remove();
		$("#empsubd"+empsubdId+ " div").remove();
		$("#empsubd"+empsubdId+ " input").remove();
		$("#empsubd"+empsubdId).append(
				"<input class='form-control' type='text' value='"+msg+"' disabled > </input>");
	}   
}

function verAcordeClase(){
	var claseAux = parseInt($("#inputEmpreSubClas").val());
	listClase.forEach(function(val){
		if(val.id == claseAux){
			$("#empsubcod" + empsubdId).html(val.codigo);
		}
	});
}


