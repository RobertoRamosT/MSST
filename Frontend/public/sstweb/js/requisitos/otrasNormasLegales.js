
var listFullNormaOtras;
var normaOtrasId,normaEmpresaAplicarId;
var banderaEdicionOtras = false;
var ordenNormaByFiltro=null;

var listFiltro =[
	{id:0,nombre:"Sin Filtro"},
	{id:1,nombre:"Normas asignadas de forma automática"},
	{id:2,nombre:"Normas asignadas por el usuario"},
	{id:3,nombre:"Normas no asignadas de forma automática"},
	{id:4,nombre:"Normas no asignadas por el usuario"}
	];
$(function(){
	$("#btnCancelarNormaLegalOtras").attr("onclick","javascript: cancelarNormaLegalOtras();"); 
	
	var selFiltro=crearSelectOneMenuOblig("inputFiltroNorma","filtroNormaLegalOtras()",listFiltro,"","id","nombre");
	
	$("#filtroPorNormalLegal").append(
			"<section class='col col-xs-2'>" +
				"<i class='fa fa-search'></i> Filtrar: " +
			"</section>"+
			"<section class='col col-xs-5' id='inputFiltroBuscar' >" +
				selFiltro+
			"</section>"+"");
});

function filtroNormaLegalOtras(){
	var opc=$("#inputFiltroNorma").val();
	if(opc==0)
	{
		opc=null;
	}
	ordenNormaByFiltro=(opc);
	cargarOtrasNormas();
}
function mostrarTodasNormas(){
	$("#tabNormaLegalEmpresa .container-fluid").hide();
	$("#tabNormaLegalEmpresa #divContainNormaLegalEmpresa").hide(); 
	$("#tabNormaLegalEmpresa #divContainNormaLegalOtras").show();
	$("#tabNormaLegalEmpresa").find("h2")
	.html("<a onclick=' volverNormaEmpresaOtras()'>Normas Legales Aplicables></a> Listado de Normas Legales:");
	$("#tblNormaLegalOtras").show();
	$("#filtroPalabraClaveArticulos").hide();
} 

function cargarOtrasNormas(){
	empresa=getSession("gestopcompanyid"); 
	callAjaxPost(URL + '/requisitos/norma/otras', {
		idCompany :empresa,
		orden:ordenNormaByFiltro
	},
		function(data) {
			if (data.CODE_RESPONSE = "05") {
				banderaEdicionOtras=false;
				listFullNormaOtras = data.list;  
				$("#tblNormaLegalOtras tbody tr").remove(); 
				listFullNormaOtras.forEach(function(val, index) {
					var estado="";
					if(val.noAplica==2 && val.idNormaLegalEmpresaExist==null){
						estado="Por Evaluar";
					}else if(val.noAplica==1){
						estado="No Asignado";
					}else if(val.noAplica==0){
						estado="Asignado";
					}
					if(val.noAplica==2 && val.idNormaLegalEmpresaExist!=null){
						estado="Asignado por el Software";
					}
					$("#tblNormaLegalOtras tbody").append(
							"<tr id='trnormempOt"+val.id+"' onclick='editarNormaLegalOtras("+index+")'>"
								+"<td id='normempOtid"+val.normaOtra.id+"'>"+val.normaOtra.id+"</td>" 
								+"<td id='normempOtcod"+val.normaOtra.id+"'>"+val.normaOtra.codigo+"</td>" 
								+"<td id='normempOttit"+val.normaOtra.id+"'>"+val.normaOtra.titulo+"</td>" 
								+"<td id='normempOtrango"+val.normaOtra.id+"'>"+val.normaOtra.rango.nombre+"</td>" 
								+"<td id='normempOtemi"+val.normaOtra.id+"'>"+val.normaOtra.emision.nombre +"</td>"
								+"<td id='normempOttip"+val.normaOtra.id+"'>"+val.normaOtra.tipo.nombre +"</td>"
								+"<td id='normempOtfechP"+val.normaOtra.id+"'>"+val.normaOtra.fechaPublicacionTexto +"</td>"
								+"<td id='normempOtcantart"+val.normaOtra.id+"'>"+val.normaOtra.numArticulos +"</td>"  
								+"<td id='normempOtevi"+val.normaOtra.id+"'>"+val.normaOtra.evidenciaNombre+"</td>" 
								+"<td id='normempOtestado"+val.normaOtra.id+"'>"+estado+"</td>" 
							+"</tr>");
				});
				completarBarraCarga();
				formatoCeldaSombreableTabla(true, "tblNormaLegalOtras");
				$("#btnCancelarNormaLegalOtras").hide();
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		}); 
}

function editarNormaLegalOtras(pindex){
	if(!banderaEdicionOtras){ 
		normaEmpresaAplicarId=listFullNormaOtras[pindex].id;
		normaOtrasId=listFullNormaOtras[pindex].normaOtra.id;
		normaOtrasObj=listFullNormaOtras[pindex];
		
		
		$("#normempOtestado"+normaOtrasId).html("No Asignar<input id='noAplicaNorma' type='checkbox' onclick='guardarNormaSelect()' class='form-control' "+(normaOtrasObj.noAplica==1?"checked":"")+">");
		$("#normempOtevi"+normaOtrasId).html("<a class='efectoLink' href='"+URL+"/requisitos/norma/evidencia?id="+normaOtrasId+"'>"+normaOtrasObj.normaOtra.evidenciaNombre+"</a>");
		
		banderaEdicionOtras=true;
		$("#btnCancelarNormaLegalOtras").show(); 
	} 
}

function guardarNormaSelect(){
	var noAplica=$("#noAplicaNorma").prop("checked"); 

	if(normaEmpresaAplicarId==null){
		normaEmpresaAplicarId=0;
	} 
	if(noAplica){
		noAplicar=1;
	}else{
		noAplicar=0;
	}  
	
	var normaOtraId=normaOtrasId; 
	var dataParam={
			id:normaEmpresaAplicarId,
			empresa:{idCompany:getSession("gestopcompanyid")},
			normaOtra:{id:normaOtraId}, 
			noAplica:noAplicar
	}
	callAjaxPost(URL+'/requisitos/norma/otras/save',dataParam,
			cargarOtrasNormas);
}

function cancelarNormaLegalOtras(){
	cargarOtrasNormas();
}
