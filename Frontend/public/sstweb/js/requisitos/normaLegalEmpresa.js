var listFullNormaEmpresa,listFullNormasEmpresaOtras;
var normaLegalEmpresaId, normaLegalEmpresaObj;
var banderaEdicion = false;
var normaEstado;
var ordenEmpby=1;
var empresa;
var palabraClave=null;
$(function(){
	$("#btnCancelarNormaLegalEmpresa").attr("onclick","javascript: cancelarNuevoNormaEmpresa();"); 
	
	$("#ordenIdEmp").append(" <button class='btn btn-default' onclick='ordenSegunEmp(1)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenRangoEmp").append(" <button class='btn btn-default' onclick='ordenSegunEmp(2)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenEntidadEmp").append(" <button class='btn btn-default' onclick='ordenSegunEmp(3)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenFechaEmp").append(" <button class='btn btn-default' onclick='ordenSegunEmp(4)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");

	$("#btnOtrasNormas").attr("onclick","javascript: mostrarTodasNormas();"); 
	$("#btnExportarExcel").attr("onclick","javascript: exportarNormasDeEmpresas();");
	
	$("#btnIndicadoresRequisitos").attr("onclick","javascript: verIndicadoresRequisitos();");
	
	$("#filtroPalabraClaveArticulos").append(
			"<section class='col col-xs-8'>" +
				"<input id='inputBuscarArticulo' type='text' class='form-control' placeholder='Ingrese título/descripción de artículo'>" +
			"</section>"+
			"<section class='col col-xs-3'>" +
				"<button class='btn btn-success' id='btnBuscarArt' onclick='cargarNormaLegalEmpresa()'><i class='fa fa-search'></i> Buscar</button>" +
			"</section>"+
	"");
});

function ordenSegunEmp(variable){
	ordenEmpby=variable;
	cargarNormaLegalEmpresa();  
}

function exportarNormasDeEmpresas(){
	window.open(URL	+ "/requisitos/norma/empresa/excel?idCompany="+ sessionStorage.getItem("gestopcompanyid"));
}

function volverNormaEmpresa(){
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#divContainNormaLegalEmpresa").show();
	$("#divContainNormaLegalRevision").hide();
	$("#tabNormaLegalEmpresa").find("h2").html("Normas Legales Aplicables");
}

function volverNormaEmpresaOtras(){
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#divContainNormaLegalEmpresa").show();
	$("#divContainNormaLegalOtras").hide();
	$("#tabNormaLegalEmpresa").find("h2").html("Normas Legales Aplicables");
	$("#filtroPalabraClaveArticulos").show();
	cargarNormaLegalEmpresa();
}

function cargarNormaLegalEmpresa(){
	$("#btnCancelarNormaLegalEmpresa").hide();
	$("#btnOtrasNormas").show();
	$("#btnIndicadoresRequisitos").show();
	$("#btnExportarExcel").show();

	palabraClave=$("#inputBuscarArticulo").val(); 
	volverNormaEmpresa();
	empresa=getSession("gestopcompanyid"); 
	callAjaxPost(URL + '/requisitos/norma/empresa', {
		idCompany :empresa,
		orden:ordenEmpby,
		palabraClaveBuscar:(palabraClave == ""?null:"%"+palabraClave+"%")
	},
		function(data){
			if (data.CODE_RESPONSE = "05"){
				banderaEdicion = false;
				listFullNormaEmpresa = data.list; 
				listFullNormasEmpresaOtras=data.otras;
				
				if(listFullNormaEmpresa.length==0 && listFullNormasEmpresaOtras.length==0){
					$("#btnIndicadoresRequisitos").hide();
				}else{
					$("#btnIndicadoresRequisitos").show();
				}
				$("#tblNormaLegalEmpresa tbody tr").remove();
				
				listFullNormaEmpresa.forEach(function(val, index){
				    console.log(val.vigencia.nombre);
					$("#tblNormaLegalEmpresa tbody").append(
							"<tr id='trnormemp"+val.id+"'' onclick='editarNormaLegalEmpresa("+index+",1)'>"
								+"<td id='normempprogrevi"+val.id+"'>"+val.numPlanRevision+"</td>" 
								+"<td id='normemprango"+val.id+"'>"+val.rango.nombre+"</td>" 
								+"<td id='normempcod"+val.id+"'>"+val.codigo+"</td>" 
								+"<td id='normemptit"+val.id+"'>"+val.titulo+"\n("+val.numArtEval+"/"+val.numArticulos+")"+"</td>"
								+"<td id='normempest"+val.id+"'>"+val.vigencia.nombre+"</td>"
								+"<td id='normempemi"+val.id+"'>"+val.emision.nombre +"</td>"
								+"<td id='normemptip"+val.id+"'>"+val.tipo.nombre +"</td>"
								+"<td id='normempfechP"+val.id+"'>"+val.fechaPublicacionTexto +"</td>"
								+"<td id='normempplazo"+val.id+"'>"+val.plazoImplementacion+" dias..." +"</td>"
								+"<td id='normempcantart"+val.id+"'>"+val.numArticulos+"</td>" 
								+"<td id='normempartvig"+val.id+"'>"+(val.numArticulos-val.numArtDerogados)+"</td>"
								+"<td id='normempartderr"+val.id+"'>"+val.numArtDerogados+"</td>"
								+"<td id='normemparinfo"+val.id+"'>"+val.numArtInformativos+"</td>"
								+"<td id='normemparaplic"+val.id+"'>"+val.numArtAplicables+"</td>"  
								+"<td id='normempevi"+val.id+"'>"+val.evidenciaNombre+"</td>" 
								+"<td id='normempPor"+val.id+"'>Automatico</td>" 
							+"</tr>");
				});
				
				if(listFullNormasEmpresaOtras.length>0){
					cargarNormaLegalEmpresaOtros();
				} 
				
				completarBarraCarga();
				resizeDivWrapper("wrapNormaLegalEmpresa",250)
				goheadfixedY("#tblNormaLegalEmpresa","#wrapNormaLegalEmpresa");// Para mantener el encabezado congelado
				formatoCeldaSombreableTabla(true, "tblNormaLegalEmpresa");
		        }else{
				console.log("ERROR, no entro al IF :''v");
			}
		});
}

function cargarNormaLegalEmpresaOtros(){
    
		listFullNormasEmpresaOtras.forEach(function(val, index){  
			$("#tblNormaLegalEmpresa tbody").append(
					"<tr id='trnormempOtras"+val.id+"' onclick='editarNormaLegalEmpresa("+index+",2)'>"
						+"<td id='normempprogrevi"+val.id+"'>"+val.numPlanRevision+"</td>" 
						+"<td id='normemprango"+val.id+"'>"+val.rango.nombre+"</td>" 
						+"<td id='normempcod"+val.id+"'>"+val.codigo+"</td>" 
						+"<td id='normemptit"+val.id+"'>"+val.titulo+"\n("+val.numArtEval+"/"+val.numArticulos+")"+"</td>"
						+"<td id='normempest"+val.id+"'>"+val.vigencia.nombre+"</td>"
						+"<td id='normempemi"+val.id+"'>"+val.emision.nombre +"</td>"
						+"<td id='normemptip"+val.id+"'>"+val.tipo.nombre +"</td>"
						+"<td id='normempfechP"+val.id+"'>"+val.fechaPublicacionTexto +"</td>"
						+"<td id='normempplazo"+val.id+"'>"+val.plazoImplementacion+" dias..." +"</td>"
						+"<td id='normempcantart"+val.id+"'>"+val.numArticulos+"</td>" 
						+"<td id='normempartvig"+val.id+"'>"+(val.numArticulos-val.numArtDerogados)+"</td>"
						+"<td id='normempartderr"+val.id+"'>"+val.numArtDerogados+"</td>"
						+"<td id='normemparinfo"+val.id+"'>"+val.numArtInformativos+"</td>"
						+"<td id='normemparaplic"+val.id+"'>"+val.numArtAplicables+"</td>"  
						+"<td id='normempevi"+val.id+"'>"+val.evidenciaNombre+"</td>" 
						+"<td id='normempPor"+val.id+"'>Por el Usuario</td>" 
					+"</tr>");
		});
		completarBarraCarga();
		formatoCeldaSombreableTabla(true, "tblNormaLegalEmpresa");
}

function editarNormaLegalEmpresa(pindex,opc){ //si opc=1 se refiere a la lista automatica, si es opc=2 se refiere a la lista de aplicacion
	if(!banderaEdicion){
		formatoCeldaSombreableTabla(false,"tblNormaLegalEmpresa");
		$("#filtroPalabraClaveArticulos").hide();
		if(opc==1){
			normaLegalEmpresaId=listFullNormaEmpresa[pindex].id;
			normaLegalEmpresaObj=listFullNormaEmpresa[pindex]; 
		}else if(opc==2){
			normaLegalEmpresaId=listFullNormasEmpresaOtras[pindex].id;
			normaLegalEmpresaObj=listFullNormasEmpresaOtras[pindex]; 
		}
		
		$("#normempprogrevi"+normaLegalEmpresaId).addClass("linkGosst")
		.on("click",function(){verProgramacion();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+normaLegalEmpresaObj.numPlanRevision);
		
		$("#normempevi"+normaLegalEmpresaId).html(
				"<a class='efectoLink' href='"+URL+"/requisitos/norma/evidencia?id="+normaLegalEmpresaId+"'>" +
					normaLegalEmpresaObj.evidenciaNombre+
				"</<a>");
		if(normaLegalEmpresaObj.articulosTotales.length>0){
			$("#normempcantart"+normaLegalEmpresaId).addClass("linkGosst")
			.on("click",function(){verArticulosBusqueda();})
			.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+normaLegalEmpresaObj.articulosTotales.length);
		}
		
		banderaEdicion=true;	
		$("#btnCancelarNormaLegalEmpresa").show();
		$("#btnOtrasNormas").hide();
		$("#btnIndicadoresRequisitos").hide();
		$("#btnExportarExcel").hide();
	}
}
function verArticulosBusqueda(){
	$("#modalArticulosEncontrados").modal("show"); 
	$("#tblArtEncontrados tbody tr").remove();
	normaLegalEmpresaObj.articulosTotales.forEach(function(val,index){
		var listFullDescripcion=(val.descripcion).split("\n");
		var texto="";
		
		listFullDescripcion.forEach(function(val){
			texto+="<p>"+val+"</p>";
		});
		
		$("#tblArtEncontrados tbody").append(
				"<tr id='trartenc"+val.id+"'>"
					+"<td id='artenc"+val.id+"'>"+val.id+"</td>" 
					+"<td id='artenc"+val.id+"'>"+val.titulo+"</td>" 
					+"<td id='artenc"+val.id+"' style='text-align:justify'>"+texto+"</td>" 
					+"<td id='artenc"+val.id+"'><a class='efectoLink' href='"+URL+"/requisitos/norma/articulo/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a></td>" 
				+"</tr>");
	});
}
function cancelarNuevoNormaEmpresa(){
	cargarNormaLegalEmpresa();
}