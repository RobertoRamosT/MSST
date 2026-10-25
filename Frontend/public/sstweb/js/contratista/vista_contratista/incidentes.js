/**
 * 
 */
var listFullIncidenteesContratista=[];
var listTipoAccidente=[]; 
var listSubTipoAccidente=[];
var listTrabajadoresAccidente=[];
var listClasificacionAccidente;
var objIncidenteContratista={id:0};

var funcionalidadesIncidenteContratista=[ 
   {id:"opcDescarga",nombre:"Descargar",functionClick:function(data){
      window.open(URL+"/contratista/incidente/evidencia?id="+objIncidenteContratista.id,"_blank")}}
//,{id:"opcEditar",nombre:"Editar",functionClick:function(data){editarIncidenteContratista()}  },
//{id:"opcElimnar",nombre:"Eliminar",functionClick:function(data){eliminarIncidenteContratista()} }
];

function marcarSubOpcionIncidenteContratista(pindex){ 
   funcionalidadesIncidenteContratista[pindex].functionClick();
   $(".listaGestionGosst").hide();
}
    
function nuevoIncidenteProyecto(pindex){
   proyectoObj = listFullProyectoSeguridad[pindex];
   indexPostulante = pindex;
   objIncidenteContratista = {id:0};
	
   var dataParam={  
      id: proyectoObj.id,
      contratistaId: proyectoObj.postulante.contratista.id
   };
   // 
   $("#proyectoTable"+proyectoObj.id).parent("#tituloEvento")
   .parent(".eventoGeneral").parent(".contenidoSubList")
   .parent(".divProyectoGeneral").siblings().find(".detalleIncidentesProyecto").hide();
	
   $("#proyectoTable"+proyectoObj.id).find(".detalleIncidentesProyecto").toggle() 
   //
   callAjaxPost(URL+'/contratista/proyecto/incidentes',dataParam,function(data){
      listFullIncidenteesContratista = data.list;
      listTipoAccidente = data.tipo; 
      listSubTipoAccidente = data.clasificacionIncap;
      listClasificacionAccidente = data.clasificacion;
      listTrabajadoresAccidente = data.trabs;
		
      var listPanelesPrincipal = [];
		
      var selTipoAccidente = crearSelectOneMenuOblig("selTipoAccidente","verAcuerdoTipoAccidente()",
	 listTipoAccidente,"","id","nombre");
      
      var selSubTipoAccidente = crearSelectOneMenuOblig("selSubTipoAccidente","verAcordeTipoIncapacitante()",
	 listSubTipoAccidente,"","id","nombre"); 
	
      var selClasAccidente = crearSelectOneMenuOblig("selClasAccidente","",
	 listClasificacionAccidente,"","id","nombre");
      
      var selTrabajadorAccidente = crearSelectOneMenu("selTrabajadorAccidente","verAcordeTrabAfectado()",
	 listTrabajadoresAccidente,"","id","nombreCompleto","No hubo afectados");
	
      var listItemsFormTrab=[
         {sugerencia:"",label:"Trabajador Afectado",inputForm:selTrabajadorAccidente},
    	 {sugerencia:"",label:"Fecha reporte",
          inputForm:"<input class='form-control' type='date' id='dateInciProy' placeholder=''>"},
         {sugerencia:"",label:"Tipo",inputForm:selTipoAccidente},
   	 {sugerencia:"",label:"Sub-Tipo",inputForm:selSubTipoAccidente,divContainer:"divSelSubTipo"},
   	 {sugerencia:"",label:"Nivel Incapacitante",inputForm:selClasAccidente,divContainer:"divNivIncap"},
         {sugerencia:"",label:"Descripción",
   	  inputForm:"<input class='form-control' id='inputDescIncProy' placeholder=''>"},
    	 {sugerencia:"",label:"Lugar",inputForm:"<input class='form-control' id='inputLugarIncProy'>"},
    	 {sugerencia:"",divContainer:"divDiasPerdidosInci",label:"Días descanso",
    	  inputForm:"<input type='number' class='form-control' id='numDiasPerdidosInciProy'>"},  
    	 {sugerencia:"",label:"Evidencia",divContainer:"eviInciProy"},
    	 {sugerencia:"",label:"",
    	  inputForm:"<button type='submit' class='btn btn-success'>" +
    	               "<i aria-hidden='true' class='fa fa-paper-plane'></i> Guardar" +
    	            "</button>"} 
      ];
 
      var textFormIncidente = "";
	
      listItemsFormTrab.forEach(function(val,index){
         textFormIncidente += obtenerSubPanelModulo(val);
      }); 
	
      $("#nuevoMovilObsContratista").remove();
      $("#editarMovilIncidenteProy").remove();
	
      listPanelesPrincipal.push(
         {id:"editarMovilIncidenteProy",clase:"contenidoFormVisible",
	  nombre:""+"Editar Accidente / Incidente",
	  contenido:"<form id='formEditarIncidenteProy' class='eventoGeneral'>"+textFormIncidente+"</form>"});
      //HASTA ACA
      agregarPanelesDivPrincipal(listPanelesPrincipal);
      verAcordeTrabAfectado();
      verAcuerdoTipoAccidente();
      verAcordeTipoIncapacitante();
	
      $(".listaGestionGosst").hide();  
	 
      $('#formEditarIncidenteProy').on('submit', function(e) {  
         e.preventDefault(); 
         guardarIncidenteContratista();
      }); 
		
      $("#editarMovilIncidenteProy").find(".tituloSubList").html(
         textoBotonVolverContenido+" Nuevo Accidente / Incidente del proyecto '"+proyectoObj.titulo+"'");
      $("#editarMovilIncidenteProy").find("form input").val("");
      $("#editarMovilIncidenteProy").find("#dateInciProy").val(obtenerFechaActual());
		 
      $(".divListPrincipal>div").hide();
      $("#editarMovilIncidenteProy").show();
		
      var options ={
	 container:"#eviInciProy",
	 functionCall:function(){},
	 descargaUrl:"",esNuevo:true,
	 idAux:"Incidente",evidenciaNombre:""
      };
		
      crearFormEvidenciaCompleta(options);
   });
}

function verAcordeTrabAfectado(){
   $("#divDiasPerdidosInci").parent().show();
	
   if(parseInt($("#selTrabajadorAccidente").val()) == -1){
      $("#divDiasPerdidosInci").parent().hide();$("#numDiasPerdidosInciProy").val(0);
   }
}

function verAcuerdoTipoAccidente(){
   var tipoId = $("#selTipoAccidente").val();
	
   $("#divSelSubTipo").parent().hide();$("#divNivIncap").parent().hide();
	
   if(parseInt(tipoId) == 1){
      $("#divSelSubTipo").parent().show();
      verAcordeTipoIncapacitante();
   }
}

function verAcordeTipoIncapacitante(){
   var incapId = parseInt($("#selSubTipoAccidente").val());
   
   $("#divNivIncap").parent().hide();
	
   if(parseInt(incapId) == 2){
      $("#divNivIncap").parent().show();
   }
}

function editarIncidenteContratista(){
	
	$(".divListPrincipal>div").hide();
	var editarDiv=$("#editarMovilIncidenteProy");
	editarDiv.show();
	editarDiv.find(".tituloSubList")
	.html(textoBotonVolverContenido+"Editar observación ");
	
	editarDiv.find("#inputDescIncProy").val(objIncidenteContratista.descripcion); 
	editarDiv.find("#dateInciProy").val(convertirFechaInput(objIncidenteContratista.fecha));
	editarDiv.find("#selTipoAccidente").val(objIncidenteContratista.reporte.id);
	editarDiv.find("#selFactorObs").val(objIncidenteContratista.factor.id );
	editarDiv.find("#selPerdidaObs").val(objIncidenteContratista.perdida.id); 
	editarDiv.find("#selEstadoObsContratista").val(objIncidenteContratista.nivel);
	var eviNombre=objIncidenteContratista.evidenciaNombre;
	var options=
	{container:"#eviInciProy",
			functionCall:function(){ },
			descargaUrl: "/contratista/incidente/evidencia?id="+objIncidenteContratista.id,
			esNuevo:false,
			idAux:"Incidente",
			evidenciaNombre:eviNombre};
	crearFormEvidenciaCompleta(options);
}

function guardarIncidenteContratista(){ 
	var formDiv=$("#editarMovilIncidenteProy");
	 
	var campoVacio = true;
	var lugar=formDiv.find("#inputLugarIncProy").val();  
	var descripcion=formDiv.find("#inputDescIncProy").val();  
        var fecha=formDiv.find("#dateInciProy").val();
        var tipo=formDiv.find("#selTipoAccidente").val(); 
        var subtipo=formDiv.find("#selSubTipoAccidente").val(); 
        var clasificacion=formDiv.find("#selClasAccidente").val(); 
        var trab=formDiv.find("#selTrabajadorAccidente").val();
        var diasPerdidos=$("#numDiasPerdidosInciProy").val();
        
     if(trab=="-1"){
	trab=null;	
     }
		     if (campoVacio) {

			var dataParam = {
				accidenteId : objIncidenteContratista.id, diasPerdidos:diasPerdidos,
				idCompany:getSession("gestopcompanyid"),
				proyectoId: proyectoObj.id ,
				accidenteDescripcion:descripcion, lugar:lugar,
				fechaN:convertirFechaTexto(fecha), 
				accidenteTipoId: tipo , 
				accidenteClasificacionId: subtipo  ,
				accidenteSubClasificacionId:clasificacion,
				trabajadorContratista:{id:trab} 
				};

			callAjaxPost(URL + '/contratista/proyecto/incidente/save', dataParam,
				    function(data) {
				       switch (data.CODE_RESPONSE) {
					case "05":	 
					    guardarEvidenciaAuto(data.nuevoId,"fileEviIncidente",
				 				 bitsEvidenciaAccidente,
								 '/contratista/proyecto/incidente/evidencia/save',
								function(){
								  volverDivSubContenido();
								  verCompletarIncidenteProyecto();
							        })
					  break;
					default:
					    console.log("Ocurrió un error al guardar la programacion!");
					}
				  });
			 
		} else {
			alert("Debe ingresar todos los campos.");
		} 
	
}


function eliminarIncidenteContratista(pindex) {
	 
	var r = confirm("¿Está seguro de eliminar el incidente?");
	if (r == true) {
		var dataParam = {
				id :  objIncidenteContratista.id,
		};

		callAjaxPost(URL + '/contratista/observacion/delete', dataParam,
			     function(data) {
				switch (data.CODE_RESPONSE) {
				  case "05": 
					verCompletarIncidenteProyecto();
				    break;
				  default:
					alert("Ocurrió un error al eliminar la programacion!");
			  	 }
			   });
	}
}    







