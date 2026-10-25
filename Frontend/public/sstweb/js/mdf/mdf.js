/** *************variables de empresa*********** */
var banderaEdicion;
var idMatrizEdicion;
var nombreMatrizEdicion;

var listMdfType;
var listMdfFull;
var tipoMdfId;

var totalD;
var totalA;
var totalP;
var totalAc;
var totalT;
var totalStep;

var esNuevo;
var accesoUnidades;

var mensajeUx;

window.onresize = function(event) {
	resizeDiv();
}

function resizeDiv() {
	var vpw = $(window).width();
	var vph = $(window).height();
	vph = vph - 250+factorMovil;
	$("#wrapperMdf").css({
		"height" : vph + "px"
	});
}

$(document).ready(function() {
	resizeDiv();
	idMatrizEdicion = 0;
	nombreMatrizEdicion = "";
	accesoUnidades=true;
	volverVistaMatrices();
	insertMenu(listarMatrices);
	listarTipoMatrices();
	
});
function volverVistaAsignarResponsable(){
	$(".divContainerGeneralFull > .container-fluid").hide();
	$(".divContainerGeneralFull > #divAsignarResponsables").show();
	$("#h2Titulo")
	.html(
			"<a onclick='javascript:volverVistaMatrices();' href='#' style='font-size:30px'>"+getSession("gestopunidad")+"</a>" +
					"> Asignar Responsables");
}
var listFullAreasAsignar = [];
var listTrabajadoresAsignar = [];
var areaAsingarObj ={};
var banderaEdicionAreaAsignar = false;
function asignarResponsableArea(){
	volverVistaAsignarResponsable();
	resizeDivWrapper("wrapAsignarResp",140);
	callAjaxPost(URL+"/mdf/area/responsables",{matrixId :  idMatrizEdicion},
			procesarAsignarResponsables);
}
function procesarAsignarResponsables(data){
	$("#btnVolverAsignarArea").hide().attr("onclick","cancelarAsignarResponsables()");
	$("#btnGuardarAsignarArea").hide().attr("onclick","guardarAsignarResponsables()");
	
	$("#tblAsingarResponsable tbody tr").remove();
	listFullAreasAsignar = data.list;
	//listTrabajadoresAsignar = data.trabajadores;
	
	listFullAreasAsignar.forEach(function(val,index){
		$("#tblAsingarResponsable tbody")
		.append("<tr id='trasigar"+val.areaId+"' onclick='editarAsignarResponsable("+index+")'>" +
				"<td>"+val.divisionName+"</td>" +
				"<td>"+val.areaName+"</td>" +
				"<td id='trareatraba"+val.areaId+"'>"+val.areaSupervisoresNombre+"</td>" +
				"<td id='trareatrabb"+val.areaId+"'>"+val.areaJefesNombre+"</td>" +
				"<td id='trareatrabc"+val.areaId+"'>"+val.areaGerentesNombre+"</td>" +
				"<tr>");
		formatoCeldaSombreableTabla(true,"tblAsingarResponsable");
		banderaEdicionAreaAsignar = false;
	});
}
function cancelarAsignarResponsables(){
	var dataAux ={};
	dataAux.list = listFullAreasAsignar;
	dataAux.trabajadores = listTrabajadoresAsignar;
	procesarAsignarResponsables(dataAux)
}
function editarAsignarResponsable(pindex){
	if(!banderaEdicionAreaAsignar){
	    callAjaxPost(URL+"/mdf/area/responsable/trabajadores",{areaId : listFullAreasAsignar[pindex].areaId},function(data){
		listTrabajadoresAsignar = data.trabajadores;
		formatoCeldaSombreableTabla(false,"tblAsingarResponsable");
		$("#btnVolverAsignarArea").show();
		$("#btnGuardarAsignarArea").show();
		
		banderaEdicionAreaAsignar = true;
		areaAsingarObj = listFullAreasAsignar[pindex];
		var msg="";
		msg="Trabajadores de la "+getSession("gestoparea");

		var listTrabajadoresAsignarA = [];
		var listTrabajadoresAsignarB = [];
		var listTrabajadoresAsignarC = [];
		listTrabajadoresAsignar.forEach(function(val){
			listTrabajadoresAsignarA.push(
					{trabajadorId : val.trabajadorId,
						trabajadorNombre: val.trabajadorNombre, selected : (val.nivelArea.id ==1?1:0)  });
			listTrabajadoresAsignarB.push(
					{trabajadorId : val.trabajadorId,
						trabajadorNombre: val.trabajadorNombre, selected : (val.nivelArea.id ==2?1:0)});
			listTrabajadoresAsignarC.push(
					{trabajadorId : val.trabajadorId,
						trabajadorNombre: val.trabajadorNombre, selected : (val.nivelArea.id ==3?1:0)});
		});
		crearSelectOneMenuObligMultipleCompleto("selAreaTrabAsignarA","",
				listTrabajadoresAsignarA,"trabajadorId","trabajadorNombre","#trareatraba"+areaAsingarObj.areaId,msg);
		crearSelectOneMenuObligMultipleCompleto("selAreaTrabAsignarB","",
				listTrabajadoresAsignarB,"trabajadorId","trabajadorNombre","#trareatrabb"+areaAsingarObj.areaId,msg);
		crearSelectOneMenuObligMultipleCompleto("selAreaTrabAsignarC","",
				listTrabajadoresAsignarC,"trabajadorId","trabajadorNombre","#trareatrabc"+areaAsingarObj.areaId,msg);
		volverAgregarTrabajadorArea();
	    });
		
		
	}
}
function volverAgregarTrabajadorArea(){
    $(".btn-ver-agregar").remove();
    $("#textTrabAreaResp").remove();
    $("#divTrabAreaResp").remove();
    $(".chosen-container").show();
    $("#trareatraba"+areaAsingarObj.areaId).prepend("<button class='btn btn-success btn-agregar' onclick='verAgregarTrabajadorArea(1)'>" +
	"<i class=' fa fa-plus'></i>Agregar </button>");
    $("#trareatrabb"+areaAsingarObj.areaId).prepend("<button class='btn btn-success btn-agregar' onclick='verAgregarTrabajadorArea(2)'>" +
	"<i class=' fa fa-plus'></i>Agregar </button>");
    $("#trareatrabc"+areaAsingarObj.areaId).prepend("<button class='btn btn-success btn-agregar' onclick='verAgregarTrabajadorArea(3)'>" +
	"<i class=' fa fa-plus'></i>Agregar </button>");
}
function verAgregarTrabajadorArea(pnivelAreaId){
    $(".btn-agregar").remove();
    $(".chosen-container").hide();
    var letraNivelArea ="";
    switch(parseInt(pnivelAreaId)){
    case 1:
        letraNivelArea = "a"
		break;
    case 2:
        letraNivelArea = "b"
		break;
    case 3:
        letraNivelArea = "c"
		break;
    }
    $("#trareatrab"+letraNivelArea+areaAsingarObj.areaId).prepend("" +
    		"<input class='form-control' id='textTrabAreaResp'><div id='divTrabAreaResp'> </div>" +
    		"<button class='btn btn-danger btn-ver-agregar' onclick='volverAgregarTrabajadorArea()'>" +
	"<i class=' fa fa-times'></i>Cancelar </button>" +
	"<button class='btn btn-success btn-ver-agregar' onclick='guardarAgregarTrabajadorArea("+pnivelAreaId+")'>" +
	"<i class=' fa fa-floppy-o'></i>Guardar</button>");
    verAutoCompletarTrabAreaResp(); 
}

function verAutoCompletarTrabAreaResp(){
	var nombre = $("#textTrabAreaResp").val().trim();
	if(nombre == ""){nombre = null};
	var dataParam = {
			trabajadorNombre : "%"+nombre+"%",
			empresaId : getSession("gestopcompanyid")}
	callAjaxPostNoLoad(URL+"/trabajador/buscar",dataParam,function(data){
		if(data.trabajadores.length == 0  ){
			data.trabajadores.push({
				trabajadorId : -1,nombre:"Sin asignar",puesto:{positionName:""}
			})
		}
		//listTrabajadoresInvestigadores= data.trabajadores;
		crearSelectOneMenuObligUnitarioCompleto("selAutoTrabAreaResp", 
				" ", data.trabajadores, "trabajadorId","nombre",
				"#divTrabAreaResp","");
		 
		$("#textTrabAreaResp")
		.attr("onkeyup","verAutoCompletarTrabAreaResp()");
	});
}
function guardarAgregarTrabajadorArea(pnivelAreaId){
    var trabId = parseInt($("#selAutoTrabAreaResp").val());
    if(trabId == -1){alert("Seleccionar Trabajador"); return;};
    callAjaxPost(URL+"/mdf/area/responsable/save",{nivelArea : {id:pnivelAreaId},trabajadorId : trabId,areaId : areaAsingarObj.areaId},function(data){
	listFullAreasAsignar.forEach(function(val,index){
	   if(val.areaId == areaAsingarObj.areaId){
		banderaEdicionAreaAsignar = false;
		editarAsignarResponsable(index);
	   }
	});
    });
}
function guardarAsignarResponsables(){
	var listAreaTrabsA=$("#selAreaTrabAsignarA").val(); 
	var listAreaTrabsB=$("#selAreaTrabAsignarB").val(); 
	var listAreaTrabsC=$("#selAreaTrabAsignarC").val(); 
	var listAreaTrabsFinal=[];
	if(listAreaTrabsA!=null){
		listAreaTrabsA.forEach(function(val){
			listAreaTrabsFinal.push({trabajadorId:parseInt(val) ,nivelArea : {id : 1} });
		});
	}
	if(listAreaTrabsB!=null){
		listAreaTrabsB.forEach(function(val){
			listAreaTrabsFinal.push({trabajadorId:parseInt(val) ,nivelArea : {id : 2} });
		});
	}
	if(listAreaTrabsC!=null){
		listAreaTrabsC.forEach(function(val){
			listAreaTrabsFinal.push({trabajadorId:parseInt(val) ,nivelArea : {id : 3} });
		});
	}
	
	var dataParam = {
			areaName : areaAsingarObj.areaName,
		areaId : areaAsingarObj.areaId,
		divisionId : areaAsingarObj.divisionId,
		listTrabajadorArea:listAreaTrabsFinal
	};

	callAjaxPost(URL + '/area/save', dataParam, function(data){
		alert("Responsable(s) guardados");
		var dataAux ={};
		var newListAreas = [];
		listFullAreasAsignar.forEach(function(val){
			if(val.areaId == data.nuevaArea.areaId){
				newListAreas.push(data.nuevaArea);
			}else{
				newListAreas.push(val);
			}
		});
		dataAux.list = newListAreas;
		dataAux.trabajadores = listTrabajadoresAsignar;
		procesarAsignarResponsables(dataAux);
	});
}
function volverVistaMatrices(){
	$(".divContainerGeneralFull > .container-fluid").hide();
	$(".divContainerGeneralFull > #containerUnidades").show();
	$("#h2Titulo")
	.html(
			"<a onclick='javascript:listarMatrices();' href='#' style='font-size:30px'>"+getSession("gestopunidad")+"</a>");
}
function guardarMasivoDetallesMatriz(){
	var texto = $("#txtListado").val().toUpperCase();
	var listObject = texto.split('\n');
	var validado="";
	listObject=listObject.filter(function(val){
		return val.length>0;
	});

	var objDivisiones=[],arrayDivisiones=[];
	listObject.every(function(val,index){
		var celdasFila=val.split('\t');
		if (validado.length < 1 && celdasFila.length != 3) {
			validado = "No coincide el numero de celdas."
					+ celdasFila.length;
			return false;
		}
		var divisionName=celdasFila[0];
		if(arrayDivisiones.indexOf(divisionName)==-1){
			arrayDivisiones.push(divisionName);
			objDivisiones.push({divisionName:divisionName,areas:[]})
		}
		 return true;
	});
	var objAreas=[],arrayAreas=[];
	objDivisiones.forEach(function(val,index){
		arrayAreas=[];
		listObject.forEach(function(val1,index1){
			var celdasFila=val1.split('\t'); 
			var divisionName=celdasFila[0];
			var areaName=celdasFila[1];
			if(divisionName ==val.divisionName){ 
				if(arrayAreas.indexOf(areaName)==-1){
					arrayAreas.push(areaName);
					val.areas.push({areaName:areaName,puestos:[]})
				} 
			} 
		}); 
	});
	var objPuestos=[],arrayPuestos=[];
	objDivisiones.forEach(function(val,index){
		 val.areas.forEach(function(val1,index1){
			 arrayPuestos=[];
			 listObject.forEach(function(val2,index2){
					var celdasFila=val2.split('\t'); 
					var divisionName=celdasFila[0];
					var areaName=celdasFila[1];
					var positionName=celdasFila[2];
					if(divisionName ==val.divisionName
							&& areaName==val1.areaName){ 
						if(arrayPuestos.indexOf(positionName)==-1){
							arrayPuestos.push(positionName);
							val1.puestos.push({positionName:positionName })
						} 
					} 
				}); 
		 })
	});
	if (validado.length < 1) {
		var r = confirm("¿Está seguro que desea subir estos "
				+ objDivisiones.length +getSession("gestopdivision")+ "  ?");
		if (r == true) {
			var dataParam = {
					mdfId:idMatrizEdicion,
				divisiones : objDivisiones
			}; 
		 callAjaxPost(URL + '/mdf/despliegue/masivo/save', dataParam,
		 		function(data){
			 switch (data.CODE_RESPONSE) {
				case "05":
					if (data.MENSAJE.length > 0) {
						alert(data.MENSAJE);
					} else {
						alert("Se guardaron exitosamente.");
						listarMatrices();
						$('#mdNuevos').modal('hide');
					}
					break;
				default:
					alert("Ocurrió un error al guardar el trabajador!");
				}
		 });
		}
	} else {
		alert(validado);
	} 
}

function listarMatrices() {
	banderaEdicion = false;
	esNuevo = false;
	$("#btnNuevo").show();
	
	$("#btnGuardar").hide();
	$("#btnCancelar").hide();
	$("#btnEliminar").hide();
	$("#btnDetalle").hide();
	$("#btnPreview").hide();
	$("#btnNuevos").hide();
	$("#btnGuardarNuevos").attr("onclick",
			"javascript:guardarMasivoDetallesMatriz();");
$("#btnDescargar").hide();	
	$("#btnInformeAnual").hide();
	$("#btnAsignarResp").hide();
	
	$("#btnAsociadoMdf").hide();
	$("#btnResponsabilidadPuesto").hide();
	$("#btnAsociarNuevaDivision").hide();
	$("#btnTransferPuesto").hide();
	
   if([154,714].includes(parseInt(getSession("gestopcompanyid")))){
      $("#btnListaMacroproceso").show();  
   }else{
      $("#btnListaMacroproceso").hide(); 
   }
   
   $("#btnAsociarMacroprocesoDivision").hide(); 
	
	$("#btnAsociadoMdf").attr("onclick","verAsociadosMdf()");
	$("#btnNuevo").attr("onclick", "nuevaMatriz()");
	$("#btnCancelar").attr("onclick", "cancelarMatriz()");
	$("#btnGuardar").attr("onclick", "guardarMatriz()");
	$("#btnEliminar").attr("onclick", "eliminarMatriz()");
	$("#btnNuevos").attr("onclick", "addListado()");
	$("#btnDescargar").attr("onclick", "descargarMatriz()");
	$("#btnDescargarDetalle").attr("onclick", "descargarMatriz()");
	
	$("#btnInformeAnual").attr("onclick", "verModalDescargaAnual()");
	$("#btnInformeAnualDetalle").attr("onclick", "verModalDescargaAnual()");
	$("#btnAsignarResp").attr("onclick", "asignarResponsableArea()");
	volverVerMatrices();
	
   var dataParam={
      companyId:parseInt(getSession("gestopcompanyid"))
   }; 
	
   if(isMobile.any()){
      callAjaxPost(URL+'/mdf',dataParam,procesarListarMatricesMovil,function(){},function(){});
   }else{
      callAjaxPost(URL+'/mdf',dataParam,procesarListarMatrices);
   }
}

function listarTipoMatrices() {

	var dataParam = {
	
	};

	callAjaxPost(URL + '/mdf/tipo', dataParam, procesarListarTipoMatrices);
}

function procesarListarTipoMatrices(data) {

	switch (data.CODE_RESPONSE) {
	case "05":
		listMdfType = data.list;

		break;
	default:
		alert("Ocurrió un error al traer los tipo de matrices!");
	}

}

function figurasAcordeTipoMdf(tipoMdf, totalTareas, totalPasos) {
	var htmlFiguras = "";
	var htmlFiguraTarea = "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>"
			+ "<div class='panel panel-success'>"
			+ "<div class='panel-heading'>" + "    <div class='row'>"
			+ "        <div class='col-xs-3'>"
			+ "            <i class='fa fa-tasks fa-4x'></i>"
			+ "        </div>" + "        <div class='col-xs-9 text-right'>"
			+ "            <div class='huge'>" + totalTareas + " Tareas</div>"
			+ "        </div>" + "    </div>" + "</div>" + "</div>" + "</div>";

	var htmlFiguraPaso = "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>"
			+ "<div class='panel panel-success'>"
			+ "<div class='panel-heading'>" + "    <div class='row'>"
			+ "        <div class='col-xs-3'>"
			+ "            <i class='fa fa-tasks fa-4x'></i>"
			+ "        </div>" + "        <div class='col-xs-9 text-right'>"
			+ "            <div class='huge'>" + totalPasos + " Pasos</div>"
			+ "        </div>" + "    </div>" + "</div>" + "</div>" + "</div>"

			+ "</div>"
	switch (tipoMdf) {

	case "1":
		htmlFiguras = "";
		break;
	case "2":
		htmlFiguras = htmlFiguraTarea;
		break;

	case "3":
		htmlFiguras = htmlFiguraTarea + htmlFiguraPaso;

		break;

	}
	return htmlFiguras;
}

function mensajeLimiteUnidad(){
	$("#modalLimiteUnidades .modal-body").html
	("Estimado usuario:<br> ha excedido " +
			"el número de "+getSession("gestopunidad")+" permitido " +
			"en su licencia ("+getSession("numUnidades")+"). " +
					"Contáctese con ventas@aswan.pe para obtener más<br>Atentamente,<br><br>El equipo Aswan")
	$("#modalLimiteUnidades").modal('show');
}
function procesarListarMatricesMovil(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#containerUnidades").remove();  
		var list = data.list;
	var numUnidadActual=data.numUnidadActual;
		var numUnidadesPermitido=getSession("numUnidades");
		listMdfFull=list;
		console.log(numUnidadesPermitido+"/"+numUnidadActual);
		accesoUnidades=comprobarNumEmpresasUnidades(numUnidadesPermitido,numUnidadActual);
		verUnidadesMovil();
		  
		
		
		
		completarBarraCarga(); 
		
		break;
	default:
		alert("Ocurrió un error al traer las matrices!");
	}

}
function procesarListarMatrices(data) {
        var valorResize= 160;
          resizeDivWrapper("wrapperMdf",valorResize);

	switch (data.CODE_RESPONSE) {
	case "05":	$("#unidadesGosstMovil").remove();  
		var list = data.list;
	var numUnidadActual=data.numUnidadActual;
		var numUnidadesPermitido=getSession("numUnidades");
		listMdfFull=list;
		 
		var acceso=comprobarNumEmpresasUnidades(numUnidadesPermitido,numUnidadActual);
		crearSubMenu(9, 10, "Puesto de Trabajo");
		
		crearSubMenu(11, 30, "Trabajador");

		crearSubMenu(15, 16, "A/C Subest&aacute;ndar");
		if(!acceso){
	 
			$("#btnNuevo").attr("onclick", "mensajeLimiteUnidad()");
		}else{
			$("#btnNuevo").attr("onclick", "nuevaMatriz()");
		}
		
		$("#thMatriz").html("");

		$("#tblMatrices tbody tr").remove();
		listMdfFull.forEach(function(val,index){

			$("#tblMatrices tbody")
					.append(

							"<tr onclick='editarMatriz ("
									+ val.matrixId
									+ ", "
									+ val.divisionTotal
									+ ", "
									+ val.areaTotal
									+ ","
									+ val.positionTotal
									+ " , "
									+ val.activityTotal
									+ ", "
									+ val.taskTotal
									+ ", "
									+ val.stepTotal
									+ ", "
									+ val.mdfTypeId+","+index
									+ ")' " 
							
							+	"id='trm"
									+ val.matrixId
									+ "'>"
									+ "<td id='tdm"
									+ val.matrixId
									+ "'>"

									+ "<h4  id='h4"
									+ val.matrixId
									+ "'>"
									
									+ val.matrixName 
									
									+(val.isActivo==1?"  (Activo)":"  (Inactivo)")
									+ "</h4>" +
									"<h4 id='h4trabuni"+val.matrixId+"'>Trabajadores Interesados<br>("+
									val.unidadTrabajadorNombre+")</h4>"+
									"<h4 id='h4Combo"
									+ val.matrixId
									+ "'>"
									+ "("
									+ val.mdfTypeName
									+ ")"
									+ "</h4>"

									+ "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>"
									+ "<div class='panel panel-success'>"
									+ "<div class='panel-heading'>"
									+ "    <div class='row'>"
									+ "        <div class='col-xs-3'>"
									+ "            <i class='fa fa-university fa-4x'></i>"
									+ "        </div>"
									+ "        <div class='col-xs-9 text-right'>"
									+ "            <div class='huge'>"
									+ val.divisionTotal+" "
									+ getSession("gestopdivision")+" </div>"
									+ "        </div>"
									+ "    </div>"
									+ "</div>"
									+ "</div>"
									+ "</div>"

									+ "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2 '>"
									+ "<div class='panel panel-success'>"
									+ "<div class='panel-heading'>"
									+ "    <div class='row'>"
									+ "        <div class='col-xs-3'>"
									+ "            <i class='fa fa-users fa-4x'></i>"
									+ "        </div>"
									+ "        <div class='col-xs-9 text-right'>"
									+ "            <div class='huge'>"
									+ val.areaTotal+" "
									+ getSession("gestoparea")+" </div>"
									+ "        </div>"
									+ "    </div>"
									+ "</div>"
									+ "</div>"
									+ "</div>"

									+ "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>"
									+ "<div class='panel panel-success'>"
									+ "<div class='panel-heading'>"
									+ "    <div class='row'>"
									+ "        <div class='col-xs-3'>"
									+ "            <i class='fa fa-user fa-4x'></i>"
									+ "        </div>"
									+ "        <div class='col-xs-9 text-right'>"
									+ "            <div class='huge'>"
									+ val.positionTotal
									+ " Puestos</div>"
									+ "        </div>"
									+ "    </div>"
									+ "</div>"
									+ "</div>"
									+ "</div>"

									+ "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>"
									+ "<div class='panel panel-success'>"
									+ "<div class='panel-heading'>"
									+ "    <div class='row'>"
									+ "        <div class='col-xs-3'>"
									+ "            <i class='fa fa-sitemap fa-4x'></i>"
									+ "        </div>"
									+ "        <div class='col-xs-9 text-right'>"
									+ "            <div class='huge'>"
									+ val.activityTotal
									+ " Actividades</div>"
									+ "        </div>"
									+ "    </div>"
									+ "</div>"
									+ "</div>"
									+ "</div>"
									+ figurasAcordeTipoMdf(
											val.mdfTypeId,
											val.taskTotal,
											val.stepTotal)

									+ "</td>" + "</tr>");
		});
		 
		if(list.length==0){
			var divObjectBienvenida={
					divId:"",
					titulo:"¡Bienvenido!",
					cuerpo:"Tutorial de creación de unidad<br><br><button id='startTutorial' class='btn btn-success'>Empezar</button>"};
			crearOverlaySobreDiv(divObjectBienvenida);
			$("#startTutorial").on("click",function(){
				$(".mensajeBienvenida").remove();
				var divObject={
						divId:"btnNuevo",
						titulo:"Creando una "+getSession("gestopunidad")+"",
						cuerpo:"Empecemos registrando los datos de la unidad dentro de nuestra empresa"};
				resaltarDivTutorial(divObject);
			});
		
		}else{
			 
		}
		formatoCeldaSombreable(true);
		completarBarraCarga();
		 goheadfixed('table.fixed');
		break;
	default:
		alert("Ocurrió un error al traer las matrices!");
	}

}

function editarMatriz(idMatriz, ptotalD, ptotalA, ptotalP, ptotalAc, ptotalT,
		ptotalStep, mdfTypeId,pindex) {
	if (!banderaEdicion) {
		idMatrizEdicion = idMatriz;
		totalD = ptotalD;
		totalA = ptotalA;
		totalP = ptotalP;
		totalAc = ptotalAc;
		totalT = ptotalT;
		totalStep = ptotalStep;
		var mdfNombre=listMdfFull[pindex].matrixName;
		var isActivo=listMdfFull[pindex].isActivo;
		formatoCeldaSombreable(false);
		var name =listMdfFull[pindex].matrixName;
		var nameTypeMdf;
		var selectActivo=[{
			id:0,nombre:"Inactivo"
		},
		{
			id:1,nombre:"Activo"
		}]
	var slcActivo=	crearSelectOneMenuOblig("selectActivo", "", selectActivo, isActivo, "id",
				"nombre");
		nombreMatrizEdicion = name;
		$("#h4trabuni"+idMatriz).remove();
		$("#h4" + idMatriz)
					.html(
							"<input type='text' " +
							"id='inputMatriz' " +
							"class='form-control' " +
							"placeholder='Nombre' value='"
									+ name + "'  autofocus='true'>"+slcActivo+"<br><div id='unidtrab'><div>");
			callAjaxPost(URL + '/mdf/unidad/trab', {matrixId:idMatrizEdicion},
					function(data){
						if(data.CODE_RESPONSE=="05"){
							listFullUnidTrabajadores=data.listTrabUnid; 
							var msg;
							if(listFullUnidTrabajadores.length!=0)
							{
								msg="Trabajadores Interesados";
								var listaUnidadTrab=listMdfFull[pindex].unidadTrabajadorId; //Trabajadores de la Unidad
								var listaIdsUnidadTrab=listaUnidadTrab.split(",");
								listaIdsUnidadTrab.forEach(function (val)
								{
									listFullUnidTrabajadores.forEach(function (val1){
										if(val==val1.trabajadorId)
										{
											val1.selected=1;
										}
									});
								});
								crearSelectOneMenuObligMultipleCompleto("selUnidadTrab","",
										listFullUnidTrabajadores,"trabajadorId","trabajadorNombre","#unidtrab",msg);	
							}
							else 
							{
								msg="Sin Trabajadores para Seleccionar ..."; 
								$("#unidtrab select").remove();
								$("#unidtrab div").remove();
								$("#unidtrab input").remove();
								$("#unidtrab").append(
										"<input class='form-control' type='text' value='"+msg+"' disabled >");
							}
						}
						else{
							console.log("NOPNPO")
						}
				}); 
		nombrarInput("inputMatriz",name);
		var selectOneBox = "<select id='idSelTipoMdf' class='form-control'><option value='-1'>Escoja una opci&oacute;n</option>";
		for (index = 0; index < listMdfType.length; index++) {
			selectOneBox = selectOneBox + "<option value='"
					+ listMdfType[index].mdfTypeId + "' ";
			if (mdfTypeId == listMdfType[index].mdfTypeId) {
				selectOneBox = selectOneBox + "selected>"
						+ listMdfType[index].mdfTypeName + "</option>";
				tipoMdfId = listMdfType[index].mdfTypeId;
				nameTypeMdf = listMdfType[index].mdfTypeName;
			} else {
				selectOneBox = selectOneBox + ">"
						+ listMdfType[index].mdfTypeName + "</option>";
			}
		}
		selectOneBox = selectOneBox + "</select>";

		$("#h4Combo" + idMatriz).html(nameTypeMdf);

		habilitarBotonesEdicion();
		$("#btnDetalle").show();
		$("#btnDescargar").show();
		$("#btnDetalle").attr("onclick", "listarDivisionesMdf()");
		$("#btnPreview").show();
		$("#btnPreview").attr("onclick", "listarDetalleMdf()");
	
		$("#btnNuevos").show();
		$("#btnAsociadoMdf").show();
		$("#btnInformeAnual").show();
		$("#btnAsignarResp").show();
      $("#btnListaMacroproceso").hide();
		banderaEdicion = true;
		divisionIdEdicion=null;
		areaIdEdicion=null;
		puestoIdEdicion=null;
		actividadIdEdicion=null;
		tareaIdEdicion=null;
		pasoIdreal=null;
	}

}

function listarDivisionesMdf() {

	listarDivisiones(idMatrizEdicion);
}

function listarAreasMdf() {

	listarAreas(divisionIdEdicion);
}

function listarPuestosMdf() {

	listarPuestos(areaIdEdicion);
}

function listarActividadesMdf() {

	listarActividades(puestoIdEdicion);
}

function listarTareasMdf() {

	listarTareas(actividadIdEdicion);

}

function listarPasosMdf() {

	listarPasos(tareaIdEdicion);

}
/*
 * function editarMatriz(matrixId){ nombreMatrizEdicion=$("#h4" +
 * matrixId).text(); listarTareasEdicion(matrixId); idMatrizEdicion=matrixId; }
 */

function cancelarMatriz() {
	// listarTareasEdicion(idMatrizEdicion);
	listarMatrices();
	deshabilitarBotonesEdicion();
	banderaEdicion = false;
}

function nuevaMatriz() {
	if (!banderaEdicion) {
      $("#btnListaMacroproceso").hide();
	    
		esNuevo = true;
		$("#wrapperMdf").animate(
				{ scrollTop: 
					$('#wrapperMdf')[0].scrollHeight}, 1000);
		formatoCeldaSombreable(false);
		var selectOneBox = "<select id='idSelTipoMdf' class='form-control'><option value='-1'>Escoja una opcion</option>";
		for (index = 0; index < listMdfType.length; index++) {
			selectOneBox = selectOneBox + "<option value='"
					+ listMdfType[index].mdfTypeId + "' ";
			selectOneBox = selectOneBox + ">" + listMdfType[index].mdfTypeName
					+ "</option>";

		}
		selectOneBox = selectOneBox + "</select>";

		$(".fix-inner #tblMatrices tbody")
				.append(
						"<tr id='0'><td><input type='text' id='inputMatriz' class='form-control' " +
						"placeholder='Nombre' autofocus='true'>"
								+ selectOneBox + "</td>" + "</tr>");

		idMatrizEdicion = 0;
		habilitarBotonesNuevo();
		banderaEdicion = true;
		if(tutorialOn){
			$("#btnCancelar").hide();
			$("#btnObjetivo").hide();
			$("#h2Titulo")
			.html("Unidad");
			var divObject={
					divId:"containerUnidades",
					divAnteriorId:"btnNuevo",
					mensajeOn:false,
					titulo:"Registrando Datos de "+getSession("gestopunidad")+"",
					cuerpo:"Estos son datos que se usarán para armar un buen despliegue"};
			siguientePasoTutorial(divObject);
		}
	} else {
		alert("Guarde primero la matriz.");
	}
}

function guardarMatriz() {

	var campoVacio = true;
	var isActivo=$("#selectActivo").val();
	if (esNuevo) {
		tipoMdfId = $("#idSelTipoMdf option:selected").val();
	}

	if ($("#inputMatriz").val().length == 0) {
		campoVacio = false;
	}

	if (tipoMdfId == '-1') {
		campoVacio = false;
	}
	var listUnidTrabs=$("#selUnidadTrab").val(); 
	var listUnidTrabsFinal=[];
	if(listUnidTrabs!=null)
	{
		listUnidTrabs.forEach(function(val)
		{
			listUnidTrabsFinal.push({trabajadorId:parseInt(val)});
		});
	}
	if (campoVacio) {

		var dataParam = {
		
			matrixName : $("#inputMatriz").val().toUpperCase(),
			matrixId : idMatrizEdicion,
			mdfTypeId : tipoMdfId,
			isActivo:isActivo,
			companyId : sessionStorage.getItem("gestopcompanyid"),
			listTrabajadorUnidad:listUnidTrabsFinal
		};

		callAjaxPost(URL + '/mdf/save', dataParam, procesarGuardarMatriz);
	} else {
		alert("Debe ingresar todos los campos.");
	}
}

function procesarGuardarMatriz(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
		$("#tblMatrices tbody tr").remove();
		listarMatrices();
		deshabilitarBotonesEdicion();
		if(tutorialOn){
			var divObject={
					divAnteriorId:"containerUnidades"	
			};
			finalizarTutorial(divObject);
			var divObjectBienvenida={
					divId:"",
					titulo:"¡Listo!",
					cuerpo:"Creaste tu primera unidad, ahora podrás acceder " +
							"a los demás módulos. Si tienes alguna duda puedes revisar el manual en la parte superior o " +
							"contactarnos a informes@aswan.pe.  <br><br>"+
							"<button id='followTutorial' class='btn btn-success'>Terminar Tutorial</button>"};
			crearOverlaySobreDiv(divObjectBienvenida);
			
			$("#followTutorial").on("click",function(){
				
				finalizarTutorial();
			});
		}
		
		banderaEdicion = false;
		break;
	default:
		alert("Reducir longitud de caracteres ingresados");
	}
}

function eliminarMatriz() {
	var r = confirm("¿Está seguro de eliminar la matriz de funciones?");
	if (r == true) {
		var dataParam = {
				mdfId:idMatrizEdicion,
			matrixId : idMatrizEdicion,
			mdfTipoId:parseInt(tipoMdfId)
		};

		callAjaxPost(URL + '/mdf/delete', dataParam, procesarEliminarMatriz);
	}

}

function procesarEliminarMatriz(data) {
	switch (data.CODE_RESPONSE) {
	case "05":
	
		listarMatrices();
		deshabilitarBotonesEdicion();
		banderaEdicion = false;
		break;
	case "08": 
		alert("No se puede eliminar, tiene "+data.divSons.length+ " division(es) asociada(s)."); 
		break;
	default:
	
	
	alert("Ocurrió un error al eliminar la matriz!");
	}
}

function verAsociadosMdf(){
	var dataParam = {
		mdfId:idMatrizEdicion,matrixId:idMatrizEdicion,mdfTipoId:parseInt(tipoMdfId),divisionId:divisionIdEdicion,areaId:areaIdEdicion,
		positionId:puestoIdEdicion,activityId:actividadIdEdicion,taskId:tareaIdEdicion,stepId:pasoIdreal
	};

	callAjaxPost(URL+'/mdf/delete/pre',dataParam,procesarAsociadosMdf);
}

function procesarAsociadosMdf(data){
	switch(data.CODE_RESPONSE){
	    case "05":
			$("#modalAsociadosMdf").modal("show");
			var listaAsociados = data.listaAsociados;

			if(listaAsociados.length > 0){
				$("#asociadosTable tbody tr").remove();

				listaAsociados.forEach(function(val,index){
			    	var textBotonBorrar = "";

					if(val.asociadoNombre == "Puestos sin trabajadores"){
						textBotonBorrar = "<button onclick='borrarPuestosSinTrabajador()' class='btn btn-success'>" +
								"<i class='fa fa-trash'></i>" +
							"</button>";
			    	}

					if(val.asociadoNombre == "Áreas sin puestos"){
						textBotonBorrar = "<button onclick='borrarAreasSinPuestos()' class='btn btn-success'>" +
								"<i class='fa fa-trash'></i>" +
							"</button>";
			    	}

					$("#asociadosTable tbody").append(
						"<tr>" +
							"<td>"+val.asociadoNombre+"</td>" +
        					"<td>"+val.numeroAsociado+" "+textBotonBorrar+"</td>" +
						"</tr>");
				});
			}

			break;

		default:
			alert("Ocurrió un error al traer los asociados a la matriz!");
	}
}

function borrarPuestosSinTrabajador(){
    var r = confirm("¿Está seguro de eliminar estos puestos sin trabajadores?");

	if(r){
	   callAjaxPost(URL+"/mdf/puestos/delete",{mdfId:idMatrizEdicion},function(data){
	       if(data.CODE_RESPONSE == "05"){
			   alert("Puestos borrados!");
			   $("#modalAsociadosMdf").modal("hide");
		   }else{
			   alert("Ocurrió un error al eliminar puestos");
		   }
	   });
	}
}

function borrarAreasSinPuestos(){
    var r = confirm("¿Está seguro de eliminar estos áreas sin puestos?");
    if(r){
	callAjaxPost(URL+"/mdf/areas/delete",{mdfId:idMatrizEdicion},function(data){
	    if(data.CODE_RESPONSE == "05"){
		alert("Áreas borradas!");
		$("#modalAsociadosMdf").modal("hide");
	    }else{
		alert("Ocurrió un error al eliminar áreas");
	    }
	});
    }
}


/**
 * *************************************preview de la
 * matriz**************************************************
 */

function listarDetalleMdf() {

	banderaEdicion = false;
	 
	divisionIdEdicion = 0;

	var dataParam = {

		matrixId : idMatrizEdicion
	};

	callAjaxPost(URL + '/mdf/detail', dataParam, procesarListarDetalleMDF);
}


function realizarFuncion(idLink, division, area, puesto, actividad, tarea,
		Namedivision, Namearea, Namepuesto, Nameactividad, Nametarea) {
	nombreDivisionEdicion = Namedivision;
	nombreAreaEdicion = Namearea;
	nombrePuestoEdicion = Namepuesto;
	nombreActividadEdicion = Nameactividad;
	nombreTareaEdicion = Nametarea;
	$(".divContainerGeneralFull > .container-fluid").hide();
	$("#containerUnidades").show();
	switch (idLink) {
	case 1:
		listarDivisiones(idMatrizEdicion);
		break;
	case 2:
		listarAreas(division)
		break;
	case 3:
		listarPuestos(area)
		break;
	case 4:
		listarActividades(puesto)
		break;
	case 5:
		listarTareas(actividad)
		break;
	case 6:
		listarPasos(tarea)
		break;
	}

	divisionIdEdicion = division;
	areaIdEdicion = area;
	puestoIdEdicion = puesto;
	actividadIdEdicion = actividad;
	tareaIdEdicion = tarea;

}

function agregarLinkMDF(textoLink, idLink, division, area, puesto, actividad,
		tarea, Namedivision, Namearea, Namepuesto, Nameactividad, Nametarea) {
	var link = "<a onclick='realizarFuncion(" + idLink + "," + division + ","
			+ area + "," + puesto + "," + actividad + "," + tarea + ",&quot;"
			+ Namedivision + "&quot;,&quot;" + Namearea + "&quot;,&quot;"
			+ Namepuesto + "&quot;,&quot;" + Nameactividad + "&quot;,&quot;"
			+ Nametarea + "&quot;)'>" + textoLink + "</a>";

	return link;
}

function columnasAcordeTipoMdf(tipoMdfId) {
	switch (parseInt(tipoMdfId)) {
	case 1:
		$('#tblDetalleMatrices td:nth-child(5),#tblMatrices th:nth-child(5)').hide();
		$('#tblDetalleMatrices td:nth-child(6),#tblMatrices th:nth-child(6)').hide();

		break;
	case 2:
		$('#tblDetalleMatrices td:nth-child(5),#tblMatrices th:nth-child(5)').show();
		$('#tblDetalleMatrices td:nth-child(6),#tblMatrices th:nth-child(6)').hide();

		break;
	case 3:
		$('#tblDetalleMatrices td:nth-child(5),#tblMatrices th:nth-child(5)').show();
		$('#tblDetalleMatrices td:nth-child(6),#tblMatrices th:nth-child(6)').show();

		break;

	}
}
function volverVerMatrices(){
	$(".divContainerGeneralFull > .container-fluid").hide();
	$("#containerUnidades").show();
	$("#h2Titulo").html(
			""+getSession("gestopunidad")+"");
}
function procesarListarDetalleMDF(data) {
        
        var valorResize= 160;
        resizeDivWrapper("wrapperDetaleMdf",valorResize);
    
    
	switch (data.CODE_RESPONSE) {
	case "05":
	    
		$(".divContainerGeneralFull > .container-fluid").hide();
		$("#divDetalleMdf").show();
		var list = data.list;
		$(".tdDivision").html(getSession("gestopdivision"))
		$(".tdArea").html(getSession("gestoparea"))
		$("#tblDetalleMatrices tbody tr").remove();
		  
		$("#h2Titulo").html(
				"<a onclick='javascript:listarMatrices();' href='#'>"+getSession("gestopunidad")+"("
						+ nombreMatrizEdicion + ")</a> : Listado Total");

		var countDiv = 0;
		var countAre = 0;
		var countPto = 0;
		var countAct = 0;
		var countTask = 0;
		var countStep = 0;
		switch (parseInt(tipoMdfId)) {
		case 1:
			list.forEach(function(val,index){

				countDiv++;
				countAre++;
				countPto++;
				countAct++;
				countTask++;
				countStep++;

				var div = val.divisionId;
				var area = val.areaId;
				var posit = val.positionId;
				var acti = val.positionActivityId;
				var tarea = val.activityTaskId;

				var divName = val.divisionName;
				var areaName = val.areaName;
				var positName = val.positionName;
				var actiName = val.activityName;
				var tareaName = val.taskName;

				var row = "<tr>";

				if (countDiv == 1) {
					row = row
							+ "<td rowspan='"
							+ val.divisionTotal
							+ "'>"
							+ agregarLinkMDF(val.divisionName, 1, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countDiv == val.divisionTotal) {
					countDiv = 0;
				}

				if (countAre == 1) {
					row = row
							+ "<td rowspan='"
							+ val.areaTotal
							+ "'>"
							+ agregarLinkMDF(val.areaName, 2, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAre == val.areaTotal) {
					countAre = 0;
				}

				if (countPto == 1) {
					row = row
							+ "<td rowspan='"
							+ val.positionTotal
							+ "'>"
							+ agregarLinkMDF(val.positionName, 3, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
									+ "<div title='"+val.nombrePuestosHijos+"'>("+val.numPuestosHijos+")</div>"
							+ "</td>";
				}

				if (countPto == val.positionTotal) {
					countPto = 0;
				}

				if (countAct == 1) {
					row = row
							+ "<td rowspan='"
							+ val.activityTotal
							+ "'>"
							+ agregarLinkMDF(val.activityName, 4, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAct == val.activityTotal) {
					countAct = 0;
				}

				row = row + "</tr>";

				$("#tblDetalleMatrices tbody").append(row);
			});
			 
			break;
		case 2:
			list.forEach(function(val,index){

				countDiv++;
				countAre++;
				countPto++;
				countAct++;
				countTask++;
				countStep++;

				var div = val.divisionId;
				var area = val.areaId;
				var posit = val.positionId;
				var acti = val.positionActivityId;
				var tarea = val.activityTaskId;

				var divName = val.divisionName;
				var areaName = val.areaName;
				var positName = val.positionName;
				var actiName = val.activityName;
				var tareaName = val.taskName;

				var row = "<tr>";

				if (countDiv == 1) {
					row = row
							+ "<td rowspan='"
							+ val.divisionTotal
							+ "'>"
							+ agregarLinkMDF(val.divisionName, 1, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countDiv == val.divisionTotal) {
					countDiv = 0;
				}

				if (countAre == 1) {
					row = row
							+ "<td rowspan='"
							+ val.areaTotal
							+ "'>"
							+ agregarLinkMDF(val.areaName, 2, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAre == val.areaTotal) {
					countAre = 0;
				}

				if (countPto == 1) {
					row = row
							+ "<td rowspan='"
							+ val.positionTotal
							+ "'>"
							+ agregarLinkMDF(val.positionName, 3, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countPto == val.positionTotal) {
					countPto = 0;
				}

				if (countAct == 1) {
					row = row
							+ "<td rowspan='"
							+ val.activityTotal
							+ "'>"
							+ agregarLinkMDF(val.activityName, 4, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAct == val.activityTotal) {
					countAct = 0;
				}

				if (countTask == 1) {
					row = row
							+ "<td rowspan='"
							+ val.taskTotal
							+ "'>"
							+ agregarLinkMDF(val.taskName, 5, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countTask == val.taskTotal) {
					countTask = 0;
				}

				row = row + "</tr>";

				$("#tblDetalleMatrices tbody").append(row);
			});
			 
			break;
		case 3:
			for (index = 0; index < list.length; index++) {
				countDiv++;
				countAre++;
				countPto++;
				countAct++;
				countTask++;
				countStep++;

				var div = list[index].divisionId;
				var area = list[index].areaId;
				var posit = list[index].positionId;
				var acti = list[index].positionActivityId;
				var tarea = list[index].activityTaskId;

				var divName = list[index].divisionName;
				var areaName = list[index].areaName;
				var positName = list[index].positionName;
				var actiName = list[index].activityName;
				var tareaName = list[index].taskName;

				var row = "<tr>";

				if (countDiv == 1) {
					row = row
							+ "<td rowspan='"
							+ list[index].divisionTotal
							+ "'>"
							+ agregarLinkMDF(list[index].divisionName, 1, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countDiv == list[index].divisionTotal) {
					countDiv = 0;
				}

				if (countAre == 1) {
					row = row
							+ "<td rowspan='"
							+ list[index].areaTotal
							+ "'>"
							+ agregarLinkMDF(list[index].areaName, 2, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAre == list[index].areaTotal) {
					countAre = 0;
				}

				if (countPto == 1) {
					row = row
							+ "<td rowspan='"
							+ list[index].positionTotal
							+ "'>"
							+ agregarLinkMDF(list[index].positionName, 3, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countPto == list[index].positionTotal) {
					countPto = 0;
				}

				if (countAct == 1) {
					row = row
							+ "<td rowspan='"
							+ list[index].activityTotal
							+ "'>"
							+ agregarLinkMDF(list[index].activityName, 4, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countAct == list[index].activityTotal) {
					countAct = 0;
				}

				if (countTask == 1) {
					row = row
							+ "<td rowspan='"
							+ list[index].taskTotal
							+ "'>"
							+ agregarLinkMDF(list[index].taskName, 5, div,
									area, posit, acti, tarea, divName,
									areaName, positName, actiName, tareaName)
							+ "</td>";
				}

				if (countTask == list[index].taskTotal) {
					countTask = 0;
				}

				row = row
						+ "<td>"
						+ agregarLinkMDF(list[index].stepName, 6, div, area,
								posit, acti, tarea, divName, areaName,
								positName, actiName, tareaName) + "</td>";

				row = row + "</tr>";

				$("#tblDetalleMatrices tbody").append(row);

			}
			break;

		}

		$("#tblDetalleMatrices tbody").append(
				"<tr><td><h4>" + totalD + "</h4></td><td><h4>" + totalA
						+ "</h4></td><td><h4>" + totalP + "</h4></td>"
						+ "<td><h4>" + totalAc + "</h4></td><td><h4>" + totalT
						+ "</h4></td><td><h4>" + totalStep + "</h4></td></tr>");
		//resizeDivGosst("wrapperDetaleMdf",200)
		goheadfixedY("#tblDetalleMatrices","#wrapperDetaleMdf");
		
		columnasAcordeTipoMdf(tipoMdfId); 
		break;
	default:
		alert("Ocurrió un error al traer la matriz!");
	}

}

function addListado() {
	$('#txtListado').val('');
	$('#mdNuevos').modal('show');
	$("#btnGuardarNuevos").show();
}

function descargarMatriz(){
	window.open(URL
			+ "/mdf/detail/excel?matrixId="
			+ idMatrizEdicion 
			+ "&matrixName="
			+ nombreMatrizEdicion, '_blank');	
}

function verModalDescargaAnual(){
    var contenido ="";
    var listYear =[];
    for(var i = 0;i < 5;i++){
	var anioActual = (new Date).getFullYear();
	listYear.push({id:anioActual-i,nombre : anioActual-i})
    }
   var selAnioReporte = crearSelectOneMenuOblig("selAnioReporte", "", listYear, "", "id",
		"nombre") ;
    var listContenido = [
                        {sugerencia:"",label:"Año ",inputForm: selAnioReporte,divContainer:""},
		       	{sugerencia:" ",label:"",inputForm: "<button class='btn btn-success' onclick='descargarInformeAnual()' ><i class='fa fa-floppy-o'></i> Generar</button>",divContainer:""}
    ];
    listContenido.forEach(function(val){
	contenido+=obtenerSubPanelModuloGeneral(val);
    });
    var modalOptions = {id : "modalReporteAnual",nombre:"Reporte Anual",contenido : contenido};
    crearModalPrincipalUsuario(modalOptions,function(){},false,true);
}
function descargarInformeAnual(){
	
	//Enviar usario,session, mdfId y companyId
	window.open(URL
			+ "/mdf/reporteanual?anioReporte="+$("#selAnioReporte").val()
			+"&mdfId="+ idMatrizEdicion
			+ "&companyId="+getSession("gestopcompanyid"), '_blank');	
}
