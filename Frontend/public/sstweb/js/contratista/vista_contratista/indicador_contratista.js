/**
 * 
 */
var listFullTrabajoHombresContratistas=[];
var objTrabajoHombreContratista={id:0};
function toggleMenuOpcionTrHom(obj,pindex){
	objTrabajoHombreContratista=listFullTrabajoHombresContratistas[pindex];
	$(obj).parent(".eventoGeneral").find("ul").toggle();
	$(obj).parent(".eventoGeneral").parent().siblings().find("ul").hide(); 	
}
var funcionalidadesTrabajoHombres=[
   {id:"opcEditar",nombre:"<i class='fa fa-exchange'></i>&nbsp Editar",functionClick:function(data){editarTrabajoHombreContratista()}  },
   {id:"opcElimnar",nombre:"<i class='fa fa-trash-o'></i>&nbsp Eliminar",functionClick:function(data){eliminarTrabajoHombreContratista()}  }
                               ]
function marcarSubOpcionTrabajoHombre(pindex){ 
	funcionalidadesTrabajoHombres[pindex].functionClick();
	$(".listaGestionGosst").hide();
}  

function habilitarTrabajoHombresContratista(){
	objTrabajoHombreContratista={id:0}
	var contratistaId=parseInt(getSession("contratistaGosstId"));
	var dataParam={ 
			id:(contratistaId) 
			};
	callAjaxPost(URL + '/contratista/trabajo_hombre', dataParam, function(data) {
		switch (data.CODE_RESPONSE) {
		case "05":
			var listPanelesPrincipal=[];
			var textIn= "";
			var textSinRevisar="",textRevisar="",textCompletos="";
			var numTrabajoHombresSinRevisar=0,numTrabajoHombresRevisadas=0,numTrabajoHombresCompletadas=0;
			listFullTrabajoHombresContratistas=data.list;
			$(".divListPrincipal").html("");
			listFullTrabajoHombresContratistas.forEach(function(val,index){
				var menuOpcion="<ul class='list-group listaGestionGosst' >";
				funcionalidadesTrabajoHombres.forEach(function(val1,index1){
					menuOpcion+="<li class='list-group-item' onclick='marcarSubOpcionTrabajoHombre("+index1+")'>"+val1.nombre+" </li>"
				});
				menuOpcion+="</ul>";
				var textEvi="Sin registrar evidencia";
				 if(val.evidenciaNombre!=""){
					 textEvi="<a class='efectoLink' target='_blank' href='"+URL+"/contratista/trabajo_hombre/evidencia?id="+val.id+"'  >" +
					 		"<i class='fa fa-download' aria-hidden='true'></i>" +val.evidenciaNombre+"</a>";
				 }
						numTrabajoHombresCompletadas++;
						textCompletos+=("<div class='eventoGeneral '>" +
								"<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionTrHom(this,"+index+")'>" +
								"Ver Opciones&nbsp<i class='fa fa-angle-double-down' aria-hidden='true'></i></a>" +
								menuOpcion+
								"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.year+"</strong><br>"+ 
								"<i class='fa fa-calendar' aria-hidden='true'></i><strong>" +val.month.nombre+"</strong><br>"+ 
								"<i class='fa fa-users' aria-hidden='true'></i><strong>Trabajador(es): " +val.numTrabajadores+"</strong><br>"+ 
								"<i class='fa fa-clock-o' aria-hidden='true'></i><strong>" +val.numHoras+"</strong><br>"+ 
								 //textEvi+
								 "</div>"  );
				 
				
				
			});
			var listYear=[];
			var listMonth=data.month;
			var current=new Date();
			for(var i=-2;i<2;i++){
				listYear.push({id:current.getFullYear()+i,nombre:current.getFullYear()+i})
			}
			var selYearTrabajoHombre= crearSelectOneMenuOblig("selYearTrabajoHombre", "", listYear, current.getFullYear(), 
					"id","nombre");
			var selMonthTrabajoHombre= crearSelectOneMenuOblig("selMonthTrabajoHombre", "", listMonth, current.getMonth(), 
					"id","nombre");
			var listItemsFormTrab=[ 
            		{sugerencia:"",label:"Año",inputForm:selYearTrabajoHombre},
            		 {sugerencia:"",label:"Mes",inputForm:selMonthTrabajoHombre } ,
            		 {sugerencia:"",label:"# de trabajadores",inputForm:"<input class='form-control' type='number' id='numberTrabajoTrab'>"},  
            		 {sugerencia:"",label:"Total de HH trabajadas",inputForm:"<input class='form-control' type='number' id='numberTrabajoHoras'>"},  
            		  //{sugerencia:"Ej: registro de HH",label:"Evidencia",inputForm:"" ,divContainer:"divEviTrabajoHombre"} ,
            		 
            		 
            		 {sugerencia:"",label:"",inputForm:"<button type='submit' class='btn btn-success' ><i aria-hidden='true' class='fa fa-paper-plane'></i>Guardar</button>"} 
             		];
			var textSug="";
			var textFormSug="";
			listItemsFormTrab.forEach(function(val,index){
				textFormSug+=obtenerSubPanelModulo(val);
			});  
		 listPanelesPrincipal.push( 
					{id:"nuevoMovilTrabHora" ,clase:"",
							nombre:""+"Nuevo registro",
							contenido:"<form id='formNuevaTrabajoHombre' class='eventoGeneral'>"+textFormSug+"</form>"},
						{id:"editarMovilTrabHora" ,clase:"contenidoFormVisible",
							nombre:""+"Editar asd",
							contenido:"<form id='formEditarTrabajoHombre' class='eventoGeneral'>"+textFormSug+"</form>"},
							
						{id:"sugCompletadasContratista",clase:"divTrabajoHombreContratistaGeneral",
							nombre:"Registro Trabajo HH (" +numTrabajoHombresCompletadas+")",
							contenido:textCompletos});
		 
		 
			
			agregarPanelesDivPrincipal(listPanelesPrincipal);
			var options=
			{container:"#divEviTrabajoHombre",
					functionCall:function(){},
					descargaUrl: "",
					esNuevo:true,
					idAux:"TrabajoHombre0",
					evidenciaNombre:""};
			crearFormEvidenciaCompleta(options);
			
			
			$(".listaGestionGosst").hide();
			$(".contenidoFormVisible").hide();
			
			 $('#formNuevaTrabajoHombre').on('submit', function(e) {  
			        e.preventDefault();
			        objTrabajoHombreContratista={id:0}
			        guardarTrabajoHombreContratista();
			 });
			 $('#formEditarTrabajoHombre').on('submit', function(e) {  
			        e.preventDefault(); 
			        guardarTrabajoHombreContratista();
			 });
			break;
			default:
				alert("nop");
				break;
		}
	})
	
} 
  
function editarTrabajoHombreContratista(){
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilTrabHora");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar ");
	
	editarDiv.find("#selYearTrabajoHombre").val(objTrabajoHombreContratista.year); 
	editarDiv.find("#selMonthTrabajoHombre").val(objTrabajoHombreContratista.month.id); 
	editarDiv.find("#numberTrabajoTrab").val(objTrabajoHombreContratista.numTrabajadores); 
	editarDiv.find("#numberTrabajoHoras").val(objTrabajoHombreContratista.numHoras); 
	 
	var options=
	{container:"#editarMovilTrabHora #divEviTrabajoHombre",
			functionCall:function(){},
			descargaUrl: "/contratista/trabajo_hombre/evidencia?id="+objTrabajoHombreContratista.id,
			esNuevo:false,
			idAux:"TrabajoHombre"+objTrabajoHombreContratista.id,
			evidenciaNombre:objTrabajoHombreContratista.evidenciaNombre};
	crearFormEvidenciaCompleta(options);
}

function guardarTrabajoHombreContratista(){
	
	var formDiv=$("#editarMovilTrabHora");
	if(objTrabajoHombreContratista.id==0){
		formDiv=$("#nuevoMovilTrabHora");
	}
	var campoVacio = true; 
var year=formDiv.find("#selYearTrabajoHombre").val();
var month=formDiv.find("#selMonthTrabajoHombre").val();
var numTrabajadores=formDiv.find("#numberTrabajoTrab").val();
var numHoras=formDiv.find("#numberTrabajoHoras").val();
var textoCampos=""; 
		if (textoCampos.length==0) {

			var dataParam = {
				id : objTrabajoHombreContratista.id,   
				year:year,month:{id:month},numTrabajadores:numTrabajadores,numHoras:numHoras,
				contratista:{id:getSession("contratistaGosstId")}
			};

			callAjaxPost(URL + '/contratista/trabajo_hombre/save', dataParam,
					function(data) {
						switch (data.CODE_RESPONSE) {
						case "05":  
						//	guardarEvidenciaAuto(data.nuevoId,"fileEviTrabajoHombre"+ objTrabajoHombreContratista.id
							//		,bitsEvidenciaPostulante,"/contratista/trabajo_hombre/evidencia/save",
							//		habilitarTrabajoHombresContratista); 
							habilitarTrabajoHombresContratista();
							break;
						default:
							console.log("Ocurrió un error al guardar la sug!");
						}
					});
			 
		} else {
			alert("Debe ingresar los campos: "+textoCampos);
		} 
	
}

function eliminarTrabajoHombreContratista() {
	 
	var r = confirm("¿Está seguro de eliminar la sugerencia?");
	if (r == true) {
		var dataParam = {
				id :  objTrabajoHombreContratista.id,
		};

		callAjaxPost(URL + '/contratista/trabajo_hombre/delete', dataParam,
				function(data) {
					switch (data.CODE_RESPONSE) {
					case "05":
						habilitarTrabajoHombresContratista();
						 
						break;
					default:
						alert("Ocurrió un error al eliminar la sug!");
					}
				});
	}
}



