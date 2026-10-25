/**
 * 
 */
function verListasSugeridas(){
	$("#divGeneralPsicologia .container-fluid").hide();
	$("#divGeneralPsicologia #divContainSugeridos").show();
	$( "h2").html("<a onclick='volverListas()'>Listas de evaluación</a> > Listas sugeridas");

	$("#tblListasSugeridos tbody tr").remove();
	listFullListasSugeridas.forEach(function(val,index){
		
		$("#tblListasSugeridos tbody").append(
				"<tr id='strlis"+val.id+"'  >" 
				+"<td>"
					+"<button class='btn btn-success' onclick='asignarListaPsicologiaSugerida("+index+")'>" +
							"<i class='fa fa-download'></i>Descargar" +
							"</button>"+"</td>"
				+"<td id='slisnom"+val.id+"'>"+val.nombre+"</td>" 
				+"<td id='slistesc"+val.id+"'>"+val.indicadorEscalas+"</td>"
				+"<td id='slistcat"+val.id+"'>"+val.indicadorCategorias+"</td>"
				
				+"<td id='slistpre"+val.id+"'>"+val.indicadorPreguntas+"</td>"
				+"<td id='slistopc"+val.id+"'>"+val.indicadorOpciones+"</td>" 
				 
				+"</tr>");
	});
}

function asignarListaPsicologiaSugerida(pindex){
	var listVal=listFullListasSugeridas[pindex];
	callAjaxPost(URL + '/psicologia/sugerido/save', 
			{id : listVal.id,
		empresa:{empresaId:getSession("gestopcompanyid")},
		nombre:"SUGERIDO: "+listVal.nombre,
		responsable:"",
		vigencia:{id:4}}, function(data){
				if(data.CODE_RESPONSE=="05"){
					cargarListasPsicologia();
					alert("Se guardó la lista de evaluación con éxito")
				}
			});
}