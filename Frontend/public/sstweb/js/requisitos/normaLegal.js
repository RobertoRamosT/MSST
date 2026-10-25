var listFullNorma,listTema,listRangoLey,listEmisor;
var normaId, normaObj;
var banderaEdicion = false;
var normaEstado;
var listSub2EmpImportar=[];
var estadoImportar=false;
var listaSub2Empresas;
var listTipoNormaLegal;
var ordenby=1;
$(function() {
	$("#btnNuevoNormaLegal").attr("onclick", "javascript: nuevoNorma();");
	$("#btnCancelarNormaLegal").attr("onclick","javascript: cancelarNuevoNorma();");
	$("#btnGuardarNormaLegal").attr("onclick","javascript: guardarNorma();");
	$("#btnEliminarNormaLegal").attr("onclick","javascript: eliminarNorma();");
	$("#btnImportarAlcance").attr("onclick","javascript: importarAlcanceNorma();");
	$("#btnImportarNormaLegal").attr("onclick","javascript: importarNorma();");

	$("#ordenId").append(" <button class='btn btn-default' onclick='ordenSegun(1)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenRango").append(" <button class='btn btn-default' onclick='ordenSegun(2)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenEntidad").append(" <button class='btn btn-default' onclick='ordenSegun(3)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	$("#ordenFecha").append(" <button class='btn btn-default' onclick='ordenSegun(4)' style='padding: 0px 4px 0px 4px;'><i class='fa fa-caret-down'></i></button>");
	
	if(getSession("accesoUsuarios")=="8"){
		$("#liAbogado").show();
		$("#tabNormaLegalEmpresa").removeClass("active"); 
		$("#tabNormaLegal").addClass("active");
		$("#liUsuario").hide();
		insertMenu(cargarNormaLegal);
	}else{
		$("#liUsuario").show();  
		$("#tabNormaLegalEmpresa").addClass("active"); 
		$("#tabNormaLegal").removeClass("active");
		$("#liAbogado").hide();
		insertMenu(function(){
			cargarNormaLegalEmpresa();
			cargarOtrasNormas();
		});
	}
})
function volverNorma(){
	$("#tabNormaLegal .container-fluid").hide();
	$("#divContainNormaLegal").show();
	$("#divContainArticulos").hide();
	$("#tabNormaLegal").find("h2").html("Norma Legal");
}
function importarAlcanceNorma(){
	$("#mdImportAlcanceNorma").modal("show");
	$("#mdImportAlcanceNorma").find("textarea").val("");
	$("#btnGuardarNuevosAlcances").attr("onclick", "javascript:guardarImportAlcance();"); 
}
function guardarImportAlcance(){
	listSub2EmpImportar=[];
	estadoImportar=true;
	var texto=$("#txtListadoAlcance").val(); 
	var listExcel=texto.split("\n");
	var listAlcance=[];
	var listAlcanceRepe=[];
	var listFullDescripcion="";
	var validado=""; 
	
	if(texto.length<1000000){ 
		var ultimotitulo="";
		for(var int=0;int<listExcel.length-1;int++){   
			var listCells=listExcel[int].split("\t");
			var filaTexto=listExcel[int];
			
			if(filaTexto.trim().length<1){
				validado="Existen filas vacias !.";
				break;
			}
			if(validado.length<1 && listCells.length!=1){
				validado="No coincide el numero de las celdas ->> ("+listCells.length+"!=1)";		
			}else{
				var alcance={};
				for(var j=0;j<listCells.length;j++){
					var element=listCells[j];
					switch(j){
					case 0:
						alcance.descripcion=element.trim(); 
						if($.inArray(alcance.descripcion,listAlcanceRepe) === -1){
							listAlcanceRepe.push(alcance.descripcion); 
						}else{
							listFullDescripcion= listFullDescripcion+alcance.descripcion+", ";
						}
						break; 
					default:
						break;
					}
				}
			}
			
			var normaid=normaObj.id; 
			listAlcance.push(alcance);
		}  
		
		if(listAlcanceRepe.length<listExcel.length-1)
		{
			validado="Existen Categorias repetidas. \n"+listFullDescripcion; 
		}
	}
	else 
	{
		validado="Ha excedido el 1 000 000 de caracteres para el registro";
	} 
	if(validado.length<1)
	{
		var r=confirm("¿Está seguro que desea subir estos "+(listExcel.length-1)+" elemento(s)");
		if(r==true)
		{
			listaSub2Empresas.forEach(function(val,index)
			{
				listAlcance.forEach(function(val1)
				{ 
					if(val1.descripcion==val.nombre)
					{
						listSub2EmpImportar.push({id:val.id}); 
					}
				}); 
			});  
			guardarNorma();
		}
	}
	else 
	{
		alert(validado);
	}
}

function importarNorma()
{
	$("#mdImportNormaLegal").modal("show");
	$("#mdImportNormaLegal").find("textarea").val("");
	$("#btnGuardarNuevasNormas").attr("onclick", "javascript:guardarImportNorma();"); 
}
function guardarImportNorma()
{
	var texto=$("#txtListadoNormas").val(); 
	var listExcel=texto.split("@");
	var listNormas={};
	var listNormasRepe=[]
	var listFullDescripcion="";
	var validado="";
	if(texto.length<1000000)
	{ 
		var ultimotitulo="";
		for(var int=0;int<listExcel.length-1;int++)
		{    
			normaId=0;
			var primerEspacio=listExcel[int].indexOf("\t") 
			var segundoEspacio=listExcel[int].indexOf("\t",primerEspacio+1);
			var tercerEspacio=listExcel[int].indexOf("\t",segundoEspacio+1); 

			var cuartoEspacio=listExcel[int].indexOf("\t",tercerEspacio+1); 
			var quintoEspacio=listExcel[int].indexOf("\t",cuartoEspacio+1); 
			var sextoEspacio=listExcel[int].indexOf("\t",quintoEspacio+1); 
			var septimoEspacio=listExcel[int].indexOf("\t",sextoEspacio+1); 
			var octavoEspacio=listExcel[int].indexOf("\t",septimoEspacio+1); 
			
			var codigo=listExcel[int].substring(0,primerEspacio);
			var titulo=listExcel[int].substring(primerEspacio+1,segundoEspacio); 
			var rango=listExcel[int].substring(segundoEspacio+1,tercerEspacio);  
			
			var emisor=listExcel[int].substring(tercerEspacio+1,cuartoEspacio);  
			var temaG=listExcel[int].substring(cuartoEspacio+1,quintoEspacio);  
			var temaE=listExcel[int].substring(quintoEspacio+1,sextoEspacio);  
			var fechaP=listExcel[int].substring(sextoEspacio+1,septimoEspacio);  
			var plazo=listExcel[int].substring(septimoEspacio+1,octavoEspacio);  
			var sumilla=listExcel[int].substring(octavoEspacio+1,listExcel[int].length-1);  
		 
			listRangoLey.forEach(function(val,index){
				if(rango==val.nombre){
					rango=val.id;
				}
			});
			
			listEmisor.forEach(function(val,index){
				if(emisor==val.nombre){
					emisor=val.id;
				}
			}); 
			
			var listaFecha=fechaP.split("/");
			var dia=listaFecha[0];
			var mes=listaFecha[1];
			var año=listaFecha[2];
			
			var fechaP=año+"-"+mes+"-"+dia;  
			var campoVacio = true; 
			
			if(campoVacio){
				var dataParam=
				{
					id:normaId,
					codigo:codigo,
					titulo:titulo,
					rango:{id:rango},
					emision:{id:emisor},
					temaGeneral:temaG,
					temaEspecifico:temaE,
					fechaPublicacion:fechaP,
					fechaVigencia:"",
					plazoImplementacion:plazo,
					sumilla: sumilla,
					estado:{id:"3",nombre:"Completado"}, 
					subsubTipoEmpresa:[]
				};
				callAjaxPost(URL+'/requisitos/norma/save',dataParam,
						cargarNormaLegal);
			}else{
				alert("Debe ingresar todos los campos.");
			}
		}
	}else{
		validado="Ha excedido el 1 000 000 de caracteres para el registro";
	} 
	
} 
function cargarNormaLegal() {
	$("#btnCancelarNormaLegal").hide();
	$("#btnNuevoNormaLegal").show();
	$("#btnEliminarNormaLegal").hide();
	$("#btnGuardarNormaLegal").hide();
	$("#btnImportarAlcance").hide(); 
	$("#btnImportarNormaLegal").show(); 
	volverNorma();
	callAjaxPost(URL + '/requisitos/norma', {
		orden :ordenby},
		function(data) {
			if (data.CODE_RESPONSE = "05") {

				banderaEdicion = false;
				listTipoNormaLegal = data.listTipos;
				listFullNorma = data.list; 
				listRangoLey=data.rango;
				listEmisor=data.emisor;
				listTema=data.tema;
				listaSub2Empresas=data.Sub2empresas;
				
				$("#tblNormaLegal tbody tr").remove(); 
				listFullNorma.forEach(function(val, index) {
				    
				    var verifVigencia="No";
				   // console.log(val.validarVigencia);
					if(val.validarVigencia=='1'){
					     verifVigencia="Sí"
					}
					
					$("#tblNormaLegal tbody").append(
							"<tr id='trnorma"+val.id+"' onclick='editarNormaLegal("+index+")'>" +
								"<td id='normaid"+val.id+"'>"+val.id+"</td>" 
								+"<td id='normacod"+val.id+"'>"+val.codigo+"</td>" 
								+"<td id='normatit"+val.id+"' style='text-align: justify;'>"+val.titulo+"</td>"
								+"<td id='normarango"+val.id+"'>"+val.rango.nombre+"</td>"
								+"<td id='normaemit"+val.id+"'>"+val.emision.nombre +"</td>"
								+"<td id='normatip"+val.id+"'>"+val.tipo.nombre +"</td>"
								+"<td id='normatemaG"+val.id+"' style='text-align: justify;'>"+val.temaGeneral +"</td>"
								+"<td id='normatemaE"+val.id+"' style='text-align: justify;'>"+val.temaEspecifico +"</td>"
								+"<td id='normafechP"+val.id+"'>"+val.fechaPublicacionTexto +"</td>"
								+"<td id='normaplazo"+val.id+"'>"+val.plazoImplementacion +"</td>"
								+"<td id='normafechVig"+val.id+"'>"+val.fechaVigenciaTexto +"</td>"
								+"<td id='normasumilla"+val.id+"'>"+val.sumilla +"</td>"
								+"<td id='normaalcance"+val.id+"'><i class='fa fa-slack'></i> "+val.subsubTipoEmpresaNombre+"</td>"
								+"<td id='normaart"+val.id+"'>"+val.numArticulos +"</td>"
								+"<td id='normaevi"+val.id+"'>"+val.evidenciaNombre +"</td>"
								+"<td id='normaestado"+val.id+"'>"+val.estado.nombre +"</td>"
								+"<td id='normaValVigencia"+val.id+"'>"+ verifVigencia +"</td>"
							+"</tr>");
				});
				completarBarraCarga();
				resizeDivWrapper("wrapNormaLegal",250)
				goheadfixedY("#tblNormaLegal","#wrapNormaLegal");
				formatoCeldaSombreableTabla(true, "tblNormaLegal");
			} else {
				console.log("ERROR, no entro al IF :''v");
			}
		});
}
function nuevoNorma(){
	if(!banderaEdicion){
		normaId=0;
		$("#btnImportarAlcance").hide();
		$("#btnImportarNormaLegal").hide();
		var selRangoLey=crearSelectOneMenuOblig("inputNormRango","",listRangoLey,"","id","nombre");
		var selEmisor=crearSelectOneMenuOblig("inputNormEmi","",listEmisor,"","id","nombre");
		var selTipoNormalLegal=crearSelectOneMenuOblig("selTipoNormalLegal","",listTipoNormaLegal,"","id","nombre")
		
		//var selTemaGeneral=crearSelectOneMenuOblig("inputNormTemaG","",listTema,"","id","nombre");
		
		$("#tblNormaLegal tbody").prepend(
			"<tr>" 
				+"<td>...</td>"
				+"<td>" +"<input type='text' id='inputNormCod' class='form-control'>"+"</td>"
				+"<td>" +"<textarea type='text' id='inputNormTit' class='form-control'></textarea>"+"</td>"
				+"<td>" +selRangoLey+"</td>"
				+"<td>" +selEmisor+"</td>"
				+"<td>" +selTipoNormalLegal+"</td>"
				+"<td>" +"<textarea type='text' id='inputNormTemaG' class='form-control'></textarea>"+"</td>"
				+"<td>" +"<textarea type='text' id='inputNormTemaE' class='form-control'></textarea>"+"</td>"
				+"<td>" +"<input type='date' id='inputNormFechaP' onchange='hallarEstadoNorma()' class='form-control'>"	+"</td>"
				+"<td>" +"<input type='number' id='inputNormPlazo' onchange='hallarFechaVigencia()' class='form-control'>"+"</td>"
				+"<td>" +"<input type='date' id='inputNormFechaVig' onchange='hallarEstadoNorma()' class='form-control'>"	+"</td>"
				+"<td>" +"<input type='text' id='inputNormSumilla' class='form-control'>"+"</td>"
				+"<td id='normaalcance0'>...</td>"
				+"<td>..,.</td>"
				+"<td id='inputNormEvidencia'>...</td>" 
				+"<td id='normaestado0'>...</td>"
				+"<td><input type='checkbox' id='checkValidarVig' class='form-control'></td>"
			+"</tr>");
		crearSelectOneMenuObligMultipleCompleto("selNormaSub2Empr","",
				listaSub2Empresas,"id","nombre","#normaalcance"+normaId,"Grupos....");
		$("#normaalcance"+normaId).prepend("<button class='btn btn-success' onclick='seleccionarAllAlcance(1)'>Marcar Todo</button>");
		var options={
				container:"#inputNormEvidencia",
				functionCall: function(){},
				descargaUrl:"",
				esNuevo:true,
				idAux:"NormaLegal",
				evidenciaNombre:""
		};
		crearFormEvidenciaCompleta(options); 
		  
		$("#btnCancelarNormaLegal").show();
		$("#btnNuevoNormaLegal").hide();
		$("#btnEliminarNormaLegal").hide();
		$("#btnGuardarNormaLegal").show();
		banderaEdicion=true;
		formatoCeldaSombreableTabla(false,"tblNormaLegal");
	}
	else{
		alert("Guarde Primero.");
	}

}
function editarNormaLegal(pindex){
	if(!banderaEdicion){
            formatoCeldaSombreableTabla(false,"tblNormaLegal");
            normaId=listFullNorma[pindex].id;
            normaObj=listFullNorma[pindex]; 
            
                var verifVig=normaObj.validarVigencia;
		var textoVerifVig="";
		    console.log(verifVig);
		if(verifVig==1){
		   textoVerifVig="checked";
		}
		    console.log(textoVerifVig);
		$("#normaValVigencia"+normaId)
		.html("<input type='checkbox' id='checkValidarVig' class='form-control' "+textoVerifVig+">");
		
		
		var codigo=normaObj.codigo;
		$("#normacod"+normaId).html("<input type='text' id='inputNormCod' class='form-control'>");
		$("#inputNormCod").val(codigo);
		var titulo=normaObj.titulo;
		$("#normatit"+normaId).html("<textarea type='text' id='inputNormTit' class='form-control'></textarea>");
		$("#inputNormTit").val(titulo); 
		var rango=normaObj.rango.id;
		var selRangoLey=crearSelectOneMenuOblig("inputNormRango","",listRangoLey,rango,"id","nombre")
		$("#normarango" + normaId).html(selRangoLey);   
		var emision=normaObj.emision.id;
		var selEmisor=crearSelectOneMenuOblig("inputNormEmi","",listEmisor,emision,"id","nombre")
		$("#normaemit" + normaId).html(selEmisor);  
		
		//
		var selTipoNormalLegal=crearSelectOneMenuOblig("selTipoNormalLegal","",listTipoNormaLegal,normaObj.tipo.id,"id","nombre")
		$("#normatip" + normaId).html(selTipoNormalLegal);
		//
		
		//var temaGeneral=normaObj.temaGeneral;
		//var selTemaGeneral=crearSelectOneMenuOblig("inputNormTemaG","",listTema,temaGeneral,"id","nombre");
		//$("#normatemaG" + normaId).html(selTemaGeneral);  
		var temaGeneral=normaObj.temaGeneral; 
		$("#normatemaG"+normaId).html("<textarea type='text' id='inputNormTemaG' class='form-control'></textarea>");
		$("#inputNormTemaG").val(temaGeneral);  
		
		var temaEspecifico=normaObj.temaEspecifico;
		$("#normatemaE"+normaId).html("<textarea type='text' id='inputNormTemaE' class='form-control'></textarea>");
		$("#inputNormTemaE").val(temaEspecifico);
		
		var fechaP=convertirFechaInput(normaObj.fechaPublicacion);  
		$("#normafechP"+normaId).html("<input type='date' id='inputNormFechaP' onchange='hallarEstadoNorma()'  class='form-control'>");
		$("#inputNormFechaP").val(fechaP);
		var fechaVigencia=convertirFechaInput(normaObj.fechaVigencia); 
		$("#normafechVig"+normaId).html("<input type='date' id='inputNormFechaVig' onchange='hallarEstadoNorma()'  class='form-control'>");
		$("#inputNormFechaVig").val(fechaVigencia);
		
		var plazo=normaObj.plazoImplementacion;
		$("#normaplazo"+normaId).html("<input type='number' id='inputNormPlazo' onchange='hallarFechaVigencia()' class='form-control'>");
		$("#inputNormPlazo").val(plazo); 
		var sumilla=normaObj.sumilla;
		$("#normasumilla"+normaId).html(	"<input type='text' id='inputNormaSumilla' class='form-control'>");
		$("#inputNormaSumilla").val(sumilla); 
		
		var Sub2Empr=normaObj.subsubTipoEmpresaId; 
		var listaIdsSub2Empresas=Sub2Empr.split(",");
		listaIdsSub2Empresas.forEach(function(val)
		{
			listaSub2Empresas.forEach(function(val1)
			{
				if(val==val1.id)
				{
					val1.selected=1;
				}
			});
		});
		crearSelectOneMenuObligMultipleCompleto("selNormaSub2Empr","",
				listaSub2Empresas,"id","nombre","#normaalcance"+normaId,"Grupos....");
		$("#normaalcance"+normaId).prepend("<button class='btn btn-success' onclick='seleccionarAllAlcance(1)'>Marcar Todo</button>");
		$("#normaalcance"+normaId).prepend("<button class='btn btn-success' onclick='seleccionarAllAlcance(0)'>Desmarcar Todo</button>");
		var articulo=$("#normaart"+normaId).text();
		$("#normaart"+normaId).addClass("linkGosst")
		.on("click",function(){verArticulos();})
		.html("<i class='fa fa-list-ul fa-2x' aria-hidden='true' ></i> "+articulo);
		
	 	
		var options={
				container:"#normaevi"+normaId,
				functionCall: function(){},
				descargaUrl:"/requisitos/norma/evidencia?id="+normaId,
				esNuevo:false,
				idAux:"NormaLegal",
				evidenciaNombre:normaObj.evidenciaNombre
		};
		crearFormEvidenciaCompleta(options);
		hallarEstadoNorma();
		hallarFechaVigencia();
		banderaEdicion=true;
		$("#btnCancelarNormaLegal").show();
		$("#btnNuevoNormaLegal").hide();
		$("#btnEliminarNormaLegal").show();
		$("#btnGuardarNormaLegal").show();
		$("#btnImportarAlcance").show(); 
		$("#btnImportarNormaLegal").hide();
	}
}

function guardarNorma(){
	var campoVacio=true;
	
	var codigo=$("#inputNormCod").val();
	var titulo=$("#inputNormTit").val();
	var rangoId=$("#inputNormRango").val(); 
	var emisionid=$("#inputNormEmi").val();
	var temaGen=$("#inputNormTemaG").val();
	var temaEspe=$("#inputNormTemaE").val();
	var fechaP=convertirFechaTexto($("#inputNormFechaP").val());
	var fechaVig=convertirFechaTexto($("#inputNormFechaVig").val());
	var plazo=$("#inputNormPlazo").val(); 
	var sumilla=$("#inputNormaSumilla").val();
	var listSub2EmprInput=$("#selNormaSub2Empr").val();
	var tipoId = $("#selTipoNormalLegal").val();
	var listSub2EmpFinal=[];
	
	var validarVig=($("#checkValidarVig").prop("checked")?1:0);
	var valorVig;
	console.log(validarVig);
	
	if(validarVig != null){
	   if(validarVig== 1){
	      valorVig= 1;
	   }else{
	      valorVig= 2; 
	   }
	}
	
	if(estadoImportar)
	{
		listSub2EmpFinal=listSub2EmpImportar;
		estadoImportar=false;
	}
	else 
	{
		if(listSub2EmprInput!=null)
		{
			listSub2EmprInput.forEach(function(val)
			{
				listSub2EmpFinal.push({id:parseInt(val)});
			});
		} 
	}
	
	if(campoVacio){
		var dataParam=
		{
			id:normaId,tipo: {id : tipoId},
			codigo:codigo,
			titulo:titulo,
			rango:{id:rangoId},
			emision:{id:emisionid},
			temaGeneral:temaGen,
			temaEspecifico:temaEspe,
			fechaPublicacion:fechaP,
			fechaVigencia:fechaVig,
			plazoImplementacion:plazo,
			sumilla: sumilla,
			estado:normaEstado, 
			subsubTipoEmpresa:listSub2EmpFinal,
			validarVigencia:validarVig,
			vigencia:{id:valorVig}
		};
		callAjaxPost(URL+'/requisitos/norma/save',dataParam,
				procesarResultadoGuardarNorma);
	}
	else{
		alert("Debe ingresar todos los campos.");
	}
}
function procesarResultadoGuardarNorma(data){
	switch (data.CODE_RESPONSE) {
	case "05":
		guardarEvidenciaAuto(data.nuevoId,"fileEviNormaLegal",
				bitsEvidenciaNormaLegal,"/requisitos/norma/evidencia/save",cargarNormaLegal,"id"); 
		break; 
	default:
		alert("Ocurrio un error al guardar el archivo!");
	}
}
function eliminarNorma(){
	var r= confirm("¿Está  de eliminar esta Norma?");
	if(r==true)
	{
		var dataParam={	id:normaId};
		callAjaxPost(URL+'/requisitos/norma/delete',dataParam,
				function(data){
					switch (data.CODE_RESPONSE) {
					case "05":
						cargarNormaLegal();
						break; 
					default:
						alert("No se puede eliminar.");
					}
		});
	}
}
function cancelarNuevoNorma(){
	cargarNormaLegal();
}

function hallarEstadoNorma(){
	var fechaInicio=$("#inputNormFechaP").val();
	var fechaFin=$("#inputNormFechaVig").val();
	var hoyDia=obtenerFechaActual();
	var difInicio= restaFechas(hoyDia,fechaInicio);
	var difFinal= restaFechas(hoyDia,fechaFin);
	if(difInicio>0){
		normaEstado={id:"1",nombre:"Pendiente"};
	}else{
		if(difFinal>0){
			normaEstado={id:"2",nombre:"En Curso"};
		}else{
			normaEstado={id:"3",nombre:"Completado"};
		}
	} 
	$("#normaestado"+normaId).html(normaEstado.nombre+"");
	
}
function hallarFechaVigencia()
{	 
	var fechaTemp=convertirFechaInput($("#inputNormFechaP").val());
	var plazo=$("#inputNormPlazo").val();    
	$("#inputNormFechaVig").val(sumaFechaDias(plazo,fechaTemp));
	$("#inputNormFechaVig").prop("disabled",true);
}
function seleccionarAllAlcance(opc)
{ 
	$("#normaalcance"+normaId+ " select").remove();
	$("#normaalcance"+normaId+ " div").remove();
	$("#normaalcance"+normaId+ " input").remove();
	listaSub2Empresas.forEach(function(val)
	{
		if(opc==1)
		{
			val.selected=1;
		}
		else if(opc==0)
		{
			val.selected=0;
		}
	});
	
	crearSelectOneMenuObligMultipleCompleto("selNormaSub2Empr","",
			listaSub2Empresas,"id","nombre","#normaalcance"+normaId,"Grupos....");
	$("#normaalcance"+normaId).prepend("<button class='btn btn-success' onclick='seleccionarAllAlcance(0)' id='desmarcar'>Desmarcar Todo</button>");
	$("#normaalcance"+normaId).prepend("<button class='btn btn-success' onclick='seleccionarAllAlcance(1)' id='marcar'>Marcar Todo</button>");
	if(opc==1)
	{
		$("#desmarcar").show();
		$("#marcar").hide();
	}
	else if(opc==0)
	{
		$("#desmarcar").hide();
		$("#marcar").show();
	}
	
}
function ordenSegun(variable)
{
	ordenby=variable;
	cargarNormaLegal();  
}



