var listDetalleAcc;
var listDetalleEvInseg;
function llamarAccArea(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var auxUnidad=$("#selUnidad").val().split('-')
	 unidadId=parseInt(auxUnidad[0]);
	 unidadTipoId=parseInt(auxUnidad[1]);

	 var dataParam = {
			
				empresaId : sessionStorage.getItem("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin ,
				mdfId: (unidadId>0?unidadId:null) ,
				mdfTipoId:unidadTipoId,
				tipoBusqueda:3
				};
			callAjaxPost(URL + '/estadistica/accidentes/area', dataParam,
					procesarllamarAccArea);
	
}


function procesarllamarAccArea(data){
	

	switch (data.CODE_RESPONSE) {
	case "05":
		var areasInvolucradas = data.areasInvolucradas;
		var evenInseguroRegistrado=data.eventoArea;console.log(evenInseguroRegistrado);
		var accidenteRegistrado=data.accidenteArea;console.log(accidenteRegistrado);
		 listDetalleAcc=data.listDetalleAcc;
		 listDetalleEvInseg=data.listDetalleEvInseg;
		$("#tblAccidentesGeneral thead tr").remove();
		$("#tblAccidentesGeneral tbody tr").remove();

		$("#tblAccidentesGeneral thead ").append(
				
				"<tr>"
				+"<td>"
		
		+"		</td>"
		+"</tr>"
	
		)
		$("#tblAccidentesGeneral tbody ").append(
				
				'<tr id="actInseguro">'
				+'<td>Actos Subest&aacute;ndar</td>'
		+'</tr>'
		+'<tr id="conInsegura">'
		+'<td>Condiciones Subest&aacute;ndar</td>'
		+'</tr>'
		+'<tr id="incid">'
		+'<td>Incidentes</td>'
		+'</tr>'
		+'<tr id="accLeve">'
		+'<td>Accidentes Leves</td>'
		+'</tr>'
		+'		<tr id="accInc">'
		+'<td>Accidentes Incapacitantes</td>'
		+'</tr>'
		+'<tr id="accFat">'
		+'		<td>Accidentes Fatales</td>'
		+' </tr>'	
		)
	
		for (index = 0; index < areasInvolucradas.length; index++) {
			
			var nombre=areasInvolucradas[index].areaNombre;
				
			$("#tblAccidentesGeneral thead tr").append(
				
					"<th>"+nombre+"</th>"
		
			)
			
			$("#tblAccidentesGeneral tbody tr").append(
				
				"<td id='areaId"+areasInvolucradas[index].areaId+"'>" +
					"0</td>"
	
		)
			
		}
		
	
	
		for (index = 0; index < evenInseguroRegistrado.length; index++) {
			comprobarEventoInseguro(
					evenInseguroRegistrado[index].areaId,
					evenInseguroRegistrado[index].numActos,
					evenInseguroRegistrado[index].numCond);
			
		}
	
		for (index = 0; index < accidenteRegistrado.length; index++) {
			comprobarNumAccidentes(
					accidenteRegistrado[index].areaId,
					accidenteRegistrado[index].numIncidente,
					accidenteRegistrado[index].numAccLeve,
					accidenteRegistrado[index].numAccIncap,
					accidenteRegistrado[index].numAccFatal);
			
		}
		
	$("#tblAccidentesGeneral thead tr th").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	
}
}


function comprobarNumAccidentes(areaId,numInc,numLeve,numIncap,numFatal){
	
	$("#incid #areaId"+areaId+"").html("<a onclick='verDetalleAccidente(2,null,"+areaId+")'>"+numInc+"</a>");
	$("#accLeve #areaId"+areaId+"").html("<a onclick='verDetalleAccidente(1,1,"+areaId+")'>"+numLeve+"</a>");
	$("#accInc #areaId"+areaId+"").html("<a onclick='verDetalleAccidente(1,2,"+areaId+")'>"+numIncap+"</a>");
	$("#accFat #areaId"+areaId+"").html("<a onclick='verDetalleAccidente(1,3,"+areaId+")'>"+numFatal+"</a>");
	
	
}

function comprobarEventoInseguro(areaId,numActos,numCond){
	
	$("#actInseguro #areaId"+areaId+"").html("<a onclick='verDetalleActosSub(1,"+areaId+")'>"+numActos+"</a>");
	$("#conInsegura #areaId"+areaId+"").html("<a onclick='verDetalleActosSub(2,"+areaId+")'>"+numCond+"</a>");
	
}


function verDetalleAccidente(tipoAccidente,tipoSubAcc,areaId){
	$("#mdDetalleAccidentesArea").modal("show");
	var titulo="Detalle de ";
	var subtitulo="";
	var nombreArea;

	switch(tipoAccidente){

	case 1:
		subtitulo="Accidentes";
		break;
	case 2:
		subtitulo="Incidentes";
		break;
	
		
	}
	
	$("#tblDetalleAccidentesArea").show();
	$("#tblDetalleAccidentesArea tbody tr td").remove();
	$("#tblDetalleAccidentesArea thead tr th").addClass("tb-acc");
		for (var index = 0; index < listDetalleAcc.length; index++) {
				if(listDetalleAcc[index].subTipoAccidenteId==tipoSubAcc &&
						listDetalleAcc[index].areaId==areaId &&
						listDetalleAcc[index].tipoAccidenteId==tipoAccidente){
				$("#tblDetalleAccidentesArea tbody").append(
						"<tr>"
						+"<td>"+listDetalleAcc[index].descripcionDetalle+"</td>"
						+"<td>"+listDetalleAcc[index].subDescripcionDetalle+"</td>"
						+"<td>"+listDetalleAcc[index].fechaRegistradaTexto+"</td>"
						
						+"</tr>"
							
					);
				}
			nombreArea=listDetalleAcc[index].areaNombre;
		}
	
		$("#tituloDetalleAccidentes").html(titulo+" "+subtitulo+" en el area '"+nombreArea+"'");
}

function verDetalleActosSub(tipoEventInseg,areaId){
	$("#mdDetalleAccidentesArea").modal("show");
	var titulo="Detalle de ";
	var subtitulo="";
	var nombreArea;

	switch(tipoEventInseg){

	case 1:
		subtitulo="Actos Subestándar";
		break;
	case 2:
		subtitulo="Condiciones Subestándar";
		break;
	
		
	}
	
	$("#tblDetalleAccidentesArea").show();
	$("#tblDetalleAccidentesArea tbody tr td").remove();
	$("#tblDetalleAccidentesArea thead tr th").addClass("tb-acc");
		for (var index = 0; index < listDetalleEvInseg.length; index++) {
				if(
						listDetalleEvInseg[index].areaId==areaId &&
						listDetalleEvInseg[index].tipoAccidenteId==tipoEventInseg){
				$("#tblDetalleAccidentesArea tbody").append(
						"<tr>"
						+"<td>"+listDetalleEvInseg[index].descripcionDetalle+"</td>"
						+"<td>"+listDetalleEvInseg[index].subDescripcionDetalle+"</td>"
						+"<td>"+listDetalleEvInseg[index].fechaRegistradaTexto+"</td>"
						
						+"</tr>"
							
					);
				nombreArea=listDetalleEvInseg[index].areaNombre;
				}
			
		}
	
		$("#tituloDetalleAccidentes").html(titulo+" "+subtitulo+" en el area '"+nombreArea+"'");
	
}


var listDetalleAccUnidad;
var listDetalleEvInsegUnidad;
function llamarAccUnidad(){
	fechaInicio= $("#fechaIniciaEst").val();
	 fechaFin= $("#fechaFinEst").val();
	 var dataParam = {
			 companyId: getSession("gestopcompanyid"),
				empresaId : getSession("gestopcompanyid"),
				fechaInicio: fechaInicio,
				fechaFin: fechaFin 
				};
			callAjaxPost(URL + '/estadistica/accidentes/unidad', dataParam,
					procesarllamarAccUnidad);
	
}


function procesarllamarAccUnidad(data){
	

	switch (data.CODE_RESPONSE) {
	case "05":
		var unidadesInvolucradas = data.unidadesInvolucradas;
		var evenInseguroRegistrado=data.eventoArea;console.log(evenInseguroRegistrado);
		var accidenteRegistrado=data.accidenteArea;console.log(accidenteRegistrado);
		 listDetalleAccUnidad=data.listDetalleAccUnidad;
		 listDetalleEvInsegUnidad=data.listDetalleEvInsegUnidad;
		$("#tblAccidentesGeneral thead tr").remove();
		$("#tblAccidentesGeneral tbody tr").remove();

		$("#tblAccidentesGeneral thead ").append(
				"<tr>"
					+"<td>"
					+"</td>"
				+"</tr>"
		)
		$("#tblAccidentesGeneral tbody ").append(
				
				'<tr id="actInseguro">'
				+'<td>Actos Subest&aacute;ndar</td>'
		+'</tr>'
		+'<tr id="conInsegura">'
		+'<td>Condiciones Subest&aacute;ndar</td>'
		+'</tr>'
		+'<tr id="incid">'
		+'<td>Incidentes</td>'
		+'</tr>'
		+'<tr id="accLeve">'
		+'<td>Accidentes Leves</td>'
		+'</tr>'
		+'		<tr id="accInc">'
		+'<td>Accidentes Incapacitantes</td>'
		+'</tr>'
		+'<tr id="accFat">'
		+'		<td>Accidentes Fatales</td>'
		+' </tr>'	
		)
	unidadesInvolucradas.forEach(function(val){
		val.numActos=0;
		val.mumCond=0;
		val.numIncidente=0;
		val.numAccLeve=0;
		val.numAccIncap=0;
		val.numAccFatal=0;
		val.id=val.mdfId;
		val.nombre=val.mdfNombre;
		listDetalleAccUnidad.forEach(function(val1){
			if(val1.unidadId==val.id){
				if( val1.tipoAccidenteId==2)
				{
				val.numIncidente=val.numIncidente+1;
				}
				if(val1.subTipoAccidenteId==1 && val1.tipoAccidenteId==1)
				{
				val.numAccLeve=val.numAccLeve+1;
				}
				if(val1.subTipoAccidenteId==2 && val1.tipoAccidenteId==1)
				{
				val.numAccIncap=val.numAccIncap+1;
				}
				if(val1.subTipoAccidenteId==3 && val1.tipoAccidenteId==1)
				{
				val.numAccFatal=val.numAccFatal+1;
				}
			}
		});
		listDetalleEvInsegUnidad.forEach(function(val1){
			if(val1.unidadId==val.id){
				if(val1.tipoAccidenteId==1 )
				{
				val.numActos=val.numActos+1;
				}
				if(val1.tipoAccidenteId==2 )
				{
				val.mumCond=val.mumCond+1;
				}
			}
		});
		$("#tblAccidentesGeneral thead tr").append(
				"<td>"+val.nombre+"</td>"
		)
		
		$("#tblAccidentesGeneral tbody tr#actInseguro").append(
			"<td id='unidadId"+val.id+"'>" +
			"<a onclick='verDetalleActosSubUnidad(1,"+val.id+")'>"+val.numActos+"</a></td>")
		$("#tblAccidentesGeneral tbody tr#conInsegura").append(
	"<td id='unidadId"+val.id+"'>" +
	"<a onclick='verDetalleActosSubUnidad(2,"+val.id+")'>"+val.mumCond+"</a></td>")
		$("#tblAccidentesGeneral tbody tr#incid").append(
	"<td id='unidadId"+val.id+"'>" +
	"<a onclick='verDetalleAccidenteUnidad(2,null,"+val.id+")'>"+val.numIncidente+"</a></td>")
		$("#tblAccidentesGeneral tbody tr#accLeve").append(
	"<td id='unidadId"+val.id+"'>" +
	"<a onclick='verDetalleAccidenteUnidad(1,1,"+val.id+")'>"+val.numAccLeve+"</a></td>")
		$("#tblAccidentesGeneral tbody tr#accInc").append(
	"<td id='unidadId"+val.id+"'>" +
	"<a onclick='verDetalleAccidenteUnidad(1,2,"+val.id+")'>"+val.numAccIncap+"</a></td>")
		$("#tblAccidentesGeneral tbody tr#accFat").append(
	"<td id='unidadId"+val.id+"'>" +
	"<a onclick='verDetalleAccidenteUnidad(1,3,"+val.id+")'>"+val.numAccFatal+"</a></td>")
	});
		
		
	$("#tblAccidentesGeneral thead tr td").addClass("tb-acc");
		
		
			
			break;
			
	default:
		alert("Ocurrió un error al traer indicadores!"+data.CODE_RESPONSE);

	
}
}



function verDetalleAccidenteUnidad(tipoAccidente,tipoSubAcc,areaId){
	$("#mdDetalleAccidentesArea").modal("show");
	var titulo="Detalle de ";
	var subtitulo="";
	var nombreArea;

	switch(tipoAccidente){

	case 1:
		subtitulo="Accidentes";
		break;
	case 2:
		subtitulo="Incidentes";
		break;
	
		
	}
	
	$("#tblDetalleAccidentesArea").show();
	$("#tblDetalleAccidentesArea tbody tr td").remove();
	$("#tblDetalleAccidentesArea thead tr th").addClass("tb-acc");
		for (var index = 0; index < listDetalleAccUnidad.length; index++) {
				if(listDetalleAccUnidad[index].subTipoAccidenteId==tipoSubAcc &&
						listDetalleAccUnidad[index].unidadId==areaId &&
						listDetalleAccUnidad[index].tipoAccidenteId==tipoAccidente){
				$("#tblDetalleAccidentesArea tbody").append(
						"<tr>"
						+"<td>"+listDetalleAccUnidad[index].descripcionDetalle+"</td>"
						+"<td>"+listDetalleAccUnidad[index].subDescripcionDetalle+"</td>"
						+"<td>"+listDetalleAccUnidad[index].fechaRegistradaTexto+"</td>"
						
						+"</tr>"
							
					);
				}
			nombreArea=listDetalleAccUnidad[index].unidadNombre;
		}
	
		$("#tituloDetalleAccidentes").html(titulo+" "+subtitulo+" en el area '"+nombreArea+"'");
}

function verDetalleActosSubUnidad(tipoEventInseg,areaId){
	$("#mdDetalleAccidentesArea").modal("show");
	var titulo="Detalle de ";
	var subtitulo="";
	var nombreArea;

	switch(tipoEventInseg){

	case 1:
		subtitulo="Actos Subestándar";
		break;
	case 2:
		subtitulo="Condiciones Subestándar";
		break;
	
		
	}
	
	$("#tblDetalleAccidentesArea").show();
	$("#tblDetalleAccidentesArea tbody tr td").remove();
	$("#tblDetalleAccidentesArea thead tr th").addClass("tb-acc");
		for (var index = 0; index < listDetalleEvInsegUnidad.length; index++) {
				if(
						listDetalleEvInsegUnidad[index].unidadId==areaId &&
						listDetalleEvInsegUnidad[index].tipoAccidenteId==tipoEventInseg){
				$("#tblDetalleAccidentesArea tbody").append(
						"<tr>"
						+"<td>"+listDetalleEvInsegUnidad[index].descripcionDetalle+"</td>"
						+"<td>"+listDetalleEvInsegUnidad[index].subDescripcionDetalle+"</td>"
						+"<td>"+listDetalleEvInsegUnidad[index].fechaRegistradaTexto+"</td>"
						
						+"</tr>"
							
					);
				nombreArea=listDetalleEvInsegUnidad[index].unidadNombre;
				}
			
		}
	
		$("#tituloDetalleAccidentes").html(titulo+" "+subtitulo+" en el area '"+nombreArea+"'");
	
}