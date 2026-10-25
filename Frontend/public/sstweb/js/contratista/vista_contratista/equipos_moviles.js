var listFullOperador=[],listFullEquiposMoviles=[],
listFullTrabajador=[],listFullDocumentacion=[];
var evi1=false,evi2=false;
var equipoMovilId,equipoMovilObj;
var indexFunctionEquipo; 
var indexListEditar;
var mensajeUx;

function toggleMenuOpcion(obj,pindex,menu,indexlist){
	
   indexFunctionEquipo=pindex;
   indexListEditar=indexlist;
	
   $(obj).parent(".container"+menu+pindex).find("ul").toggle();
   $(obj).parent(".container"+menu+pindex).siblings().find("ul").hide(); 
	
   switch(menu){
      case "EquipoOperador":  
	  $(".containerEquipoMovil"+indexFunctionEquipo+" .listaGestionGosst").hide(); 
	  break;
	  
      case "EquipoMovil":
	  $(".containerEquipoOperador"+indexFunctionEquipo+" .listaGestionGosst").hide();  
	  break;
	  
      default:
	  break;
	}
} 

var funcionalidadEquiposMoviles=[
		{menu:"EquipoOperador",
		 opcion:
		       [{id:"opcEditarOperador",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
		          function(data){editarEquipoOperador(indexListEditar);}
			},
			{id:"opcEliminarOperador",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:
		          function(data){eliminarEquipoOperador(indexListEditar);}
			}
		]},
		{menu:"EquipoMovil",
		 opcion:
		       [{id:"opcEditarEquipo",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
			  function(data){editarEquipoMovil(indexListEditar);}
			},
			{id:"opcEliminarEquipo",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:
			  function(data){eliminarEquipoMovil(indexListEditar);}
			}
		]}
			        ];

function marcarSubOpcion(pindex,pindex1){ 

   $(".listaOpciones"+pindex).hide();
   //$(".containerEquipoOperador"+indexFunctionEquipo+" .listaGestionGosst").hide();
   //$(".containerEquipoMovil"+indexFunctionEquipo+" .listaGestionGosst").hide(); 
   funcionalidadEquiposMoviles[pindex].opcion[pindex1].functionClick();
}

var menuOpcionEquipo=[];

function ListarOpcionesEquipo(idpindex){
	
   funcionalidadEquiposMoviles.forEach(function(val1,index1){
      var menu=val1.menu;
      var opciones=val1.opcion;
      menuOpcionEquipo[index1]="<ul class='list-group listaGestionGosst listaOpciones"+index1+"' style='display:none;top:40px;'>";
	
      opciones.forEach(function(val2,index2){
         menuOpcionEquipo[index1]+="<li id='"+val2.id+menu+idpindex+"' style='' class='list-group-item' onclick='marcarSubOpcion("+index1+","+index2+")'>"+val2.nombre+"</li>";
      });
		
      menuOpcionEquipo[index1]+="</ul>";
   });
}

function habilitarEquiposMoviles(){
	
   var contratistaId=parseInt(getSession("contratistaGosstId"));
	
   var dataParam={ 
	   id:contratistaId,
	   empresaId:parseInt(getSession("gestopcompanyid")),
	   seccion:1
	   };
   
   callAjaxPost(URL+'/contratista/equipomovil/operador',dataParam, 
      function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
		var listPanelesPrincipalOperador=[];
		var txtOperadores="";
		var numOperador=0;
				
		listFullOperador=data.operadores;
		listFullTrabajador=data.trabajadores; 
		listFullEquiposMoviles=data.equipos;
		listFullDocumentacion=data.documentacion;
		$(".divListPrincipal").html("");
		//------------------------------Inicio Seccion Operador-----------------------------------------------------
		listFullOperador.forEach(
		   function(val,index){
		      ListarOpcionesEquipo(val.id);
					
		      var evidenciaCap="",evidenciaOper="";
					
		      if(val.evidenciaCapacitacionNombre!="Sin Registrar"){
			 evidenciaCap="<a class='efectoLink' href='"+URL+"/contratista/equipomovil/operador/evidencia1?id="+val.id+"'>"+val.evidenciaCapacitacionNombre+"</a>";
		      }else{
			 evidenciaCap=val.evidenciaCapacitacionNombre;
		      }
					
		      if(val.evidenciaOperadorNombre!="Sin Registrar"){
		         evidenciaOper="<a class='efectoLink' href='"+URL+"/contratista/equipomovil/operador/evidencia2?id="+val.id+"'>"+val.evidenciaOperadorNombre+"</a>";
		      }else{
		         evidenciaOper=val.evidenciaOperadorNombre;
		      }

		      var eval1=obtenerTextoEvaluacion(val.evaluacionEvidenciaCapacitacion);
					
		      var listDatoOperador=[
			      {sugerencia:"",label:"<i class='fa fa-info'></i> Estado",inputForm: eval1.textoEval.replace("<br>",""),divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador Autorizado:",inputForm:val.trabajador.nombre,divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Capacitación:",inputForm: evidenciaCap,divContainer:""},
			      //{sugerencia:"",label:"<i class='fa fa-briefcase'></i> Certificado del Operador: ",inputForm: evidenciaOper,divContainer:""},
			      {sugerencia:"",label:"<br>",inputForm:"<br>",divContainer:""}
					   ];
		      
		      var textOperador="";
		      listDatoOperador.forEach(function(val){
		          textOperador+=obtenerSubPanelModuloEquipoMovil(val);
		      });
					
		      txtOperadores+="<div id='equipoMovilOperador"+val.id+"Operador'class='eventoGeneral'>" +  
				        "<div class=''>" +
					   "<section class='containerEquipoOperador"+val.id+"'>" +
					      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+val.id+",\"EquipoOperador\","+index+")'>" +
					         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					      "</a>"+menuOpcionEquipo[0]+
					   "</section>"+
					 "</div>"+
					 textOperador+
				      "</div>";
		      numOperador++;
		   });
				
		var selTrabajadores=crearSelectOneMenuOblig("selTrabajadores", "", listFullTrabajador, 
							    "", "trabajadorId","nombre");
				
		var listDatoNuevoOperador=[
			{sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador Autorizado:",inputForm:selTrabajadores,divContainer:""},
			{sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Capacitación:",inputForm: "<div id='eviCap' ></div>",divContainer:""},
			//{sugerencia:"",label:"<i class='fa fa-briefcase'></i> Certificado del Operador: ",inputForm:  "<div id='eviOper' ></div>",divContainer:""},
			{sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarOperador' onclick='guardarOperador();' class='btn btn-success' >" +
							       "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							    "</button>"}
					  ];
				
		var textNuevoOperador="";
				
		listDatoNuevoOperador.forEach(function(val){ 
		   textNuevoOperador+=obtenerSubPanelModuloEquipoMovilNuevo(val);
		});
				
		listPanelesPrincipalOperador
		   .push({id:"equipoOperadorAgregar",clase:"",nombre:""+"Nuevo Operador",
		          contenido:"<div class='eventoGeneral divEquipoOperadorNuevo'>"+
			                textNuevoOperador+
			    	    "</div>"},
			 {id:"equipoOperadorListar",clase:"",nombre:""+"Operadores ("+numOperador+")",
			  contenido:"<div class='eventoGeneral divEquipoOperadorLista'>"+ 
			                (numOperador==0?"<label style='color:#01529b; font-size:17px;'>" +
					                "<strong>Sin Operadores... </strong>" +
					                "</label>"
					               :txtOperadores)+
				    "</div>"}
		   );
				
		agregarPanelesDivPrincipal(listPanelesPrincipalOperador); 
				
		var options1={
		       container:"#eviCap",
		       functionCall:function(){},
		       descargaUrl:"",
		       esNuevo:true,
		       idAux:"Capacitacion",
		       evidenciaNombre:""
			     };
				
		crearFormEvidenciaCompleta(options1);
				
		/*var options2={ 
			 container:"#eviOper",
			 functionCall:function(){},
			 descargaUrl:"",
			 esNuevo:true,
			 idAux:"Operador",
			 evidenciaNombre:""
			       };		
		crearFormEvidenciaCompleta(options2);*/
				
		//------------------------------Fin Seccion Operador-------------------------------------------------------------------------------
		//-------------------------------Seccion Equipos Moviles-----------------------------------------------------
				
		var listPanelesPrincipalEquipos=[];
		var txtEquipos="";
		var numEquipos=0;
				
		listFullEquiposMoviles.forEach(function(val,index){
		   ListarOpcionesEquipo(val.id);
		
		   var evidenciaOperatividad = (val.evidenciaOperatividadNombre.length == 0?"------":
		      "<a class='efectoLink' href='"+URL+"/contratista/equipomovil/evidencia1?id="+val.id+"'>" +
		          val.evidenciaOperatividadNombre +
		      "</a>");
		   
		   var evidenciaMantenimiento=(val.evidenciaMantenimientoNombre.length == 0?"------":
		      "<a class='efectoLink' href='"+URL+"/contratista/equipomovil/evidencia2?id="+val.id+"'>" +
		          val.evidenciaMantenimientoNombre +
		      "</a>");
					
		   var eval1=obtenerTextoEvaluacion(val.evaluacionEvidenciaOperatividad);
		   var eval2=obtenerTextoEvaluacion(val.evaluacionEvidenciaMantenimiento);
					 
		   //{sugerencia:"",label:"<i class='fa fa-info'></i>  Estado",inputForm: eval1.textoEval.replace("<br>",""),divContainer:""},
						
		   var listDatoEquipo=[
			   {sugerencia:"",label:"<i class='fa fa-car'></i> Descripción del Equipo:",inputForm:val.descripcion,divContainer:""},
			   {sugerencia:"",label:"<i class='fa fa-indent'></i> Nº de Identificación del Equipo:",inputForm:val.identificador,divContainer:""},
			   {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Operatividad:",inputForm: eval1.textoEval.replace("<br>",""),divContainer:""},
			   {sugerencia:"",label:" ",inputForm: evidenciaOperatividad,divContainer:""},
			   {sugerencia:"",label:"<i class='fa fa-wrench'></i> Certificado del último Mantenimiento: ",inputForm: eval2.textoEval.replace("<br>",""),divContainer:""},
			   {sugerencia:"",label:" ",inputForm: evidenciaMantenimiento,divContainer:""},
			   {sugerencia:"5",label:"<br>",inputForm:"<br>",divContainer:""}
				      ];
		   
		   var textEquipo="";
					
		   listDatoEquipo.forEach(function(val){
		      textEquipo+=obtenerSubPanelModuloEquipoMovil(val);
		   });
			
		   txtEquipos +=
		      "<div id='equipoMovil"+val.id+"'class='eventoGeneral'>" +  
		          (val.evaluacionEvidenciaOperatividad.id == 1 && val.evaluacionEvidenciaMantenimiento.id == 1?"":
			   "<div class=''>" +
			      "<section class='containerEquipoMovil"+val.id+"'>" +
			         "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcion(this,"+val.id+",\"EquipoMovil\","+index+")'>" +
				    "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				 "</a>"+menuOpcionEquipo[1] +
		              "</section>"+
		           "</div>") +
			  textEquipo  +
		      "</div>";
		  
		   numEquipos++;
		});
		
		var listDatoNuevoEquipo=[
			{sugerencia:"",label:"<i class='fa fa-car'></i> Descripción del Equipo:",inputForm:"<textarea id='inputDescripcionEquipo' class='form-control' placeholder='Especifique el modelo, marca y año de antiguedad de la unidad'></textarea>",divContainer:""},
			{sugerencia:"",label:"<i class='fa fa-indent'></i> Nº de Identificación del Equipo:",inputForm:"<input type='text' id='inputIdentificador' class='form-control'>",divContainer:""},
			{sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Operatividad:",inputForm: "<div id='eviOperatividad'></div>",divContainer:""},
			{sugerencia:"",label:"<i class='fa fa-wrench'></i> Certificado del último Mantenimiento: ",inputForm:  "<div id='eviMantenimiento'></div>",divContainer:""},
			{sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarEquipo' onclick='guardarEquipoMovil();' class='btn btn-success' >" +
				                               "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							    "</button>"}
					];
		
		var textNuevoEquipo="";
				
		listDatoNuevoEquipo.forEach(function(val){ 
		   textNuevoEquipo+=obtenerSubPanelModuloEquipoMovilNuevo(val);
		});
				
		listPanelesPrincipalEquipos.push(
		   {id:"equipoAgregar" ,clase:"",nombre:""+"Nuevo Equipo Movil",
		    contenido:"<div class='eventoGeneral divEquipoNuevo'>"+ 
			          textNuevoEquipo+
			      "</div>"},
		   {id:"equipoListar" ,clase:"",nombre:""+"Equipos Moviles ("+numEquipos+")",
		    contenido:"<div class='eventoGeneral divEquipoLista'>"+ 
			         (numEquipos==0?"<label style='color:#01529b; font-size:17px;'>" +
						   "<strong>Sin Equipos Moviles... </strong>" +
						"</label>"
					       :txtEquipos)+
			     "</div>"});
		
		agregarPanelesDivPrincipal(listPanelesPrincipalEquipos); 
				
		var options1={
		       container:"#eviOperatividad",
		       functionCall:function(){},
		       descargaUrl:"",
		       esNuevo:true,
		       idAux:"Operatividad",
		       evidenciaNombre:""
			     };
		
		crearFormEvidenciaCompleta(options1);
			
		var options2={
		       container:"#eviMantenimiento",
		       functionCall:function(){},
		       descargaUrl:"",
		       esNuevo:true,
		       idAux:"Mantenimiento",
		       evidenciaNombre:""
			     };
		
		crearFormEvidenciaCompleta(options2);

		//-------------------------------Fin Seccion Equipos Moviles-----------------------------------------------------
		//-------------------------------Seccion Docuemntacion-----------------------------------------------------
				
		var listPanelesPrincipalDocumentacion=[];
		var txtDoc="";
		var numDoc=0;
		var docId=0;
				
		listFullDocumentacion.forEach(
	           function(val,index){
		      docId=val.id;
		      ListarOpcionesEquipo(val.id);
		      var evidencia="",evidenciaIperc="";
					
		      if(val.evidenciaNombre!="Sin Registrar"){
			 evidencia="<a class='efectoLink' href='"+URL+"/contratista/equipomovil/documentacion/evidencia1?id="+val.id+"'>"+val.evidenciaNombre+"</a>";
		      }else{
			 evidencia=val.evidenciaNombre;
		      }
					
		      if(val.evidenciaIpercNombre!="Sin Registrar"){
			 evidenciaIperc="<a class='efectoLink' href='"+URL+"/contratista/equipomovil/documentacion/evidencia2?id="+val.id+"'>"+val.evidenciaIpercNombre+"</a>";
		      }else{
			 evidenciaIperc=val.evidenciaIpercNombre;
		      }
					
		      var eval1=obtenerTextoEvaluacion(val.evaluacionEvidencia);
		      var eval2=obtenerTextoEvaluacion(val.evaluacionEvidenciaIperc);
					
		      var listDatoDoc=[ 
		              {sugerencia:"",label:"<i class='fa fa-black-tie'></i> Procedimiento de Trabajo:",inputForm: eval1.textoEval.replace("<br>",""),divContainer:""},
		              {sugerencia:"",label:"",inputForm: evidencia,divContainer:""},
		              {sugerencia:"",label:"<i class='fa fa-briefcase'></i> IPER de la Actividad:",inputForm: eval2.textoEval.replace("<br>",""),divContainer:""},
		              {sugerencia:"",label:"",inputForm: evidenciaIperc,divContainer:""},
		              {sugerencia:"5",label:"",inputForm:" ",divContainer:""} 
				      ];
					
		      var textDoc="";
					
		      listDatoDoc.forEach(
		         function(val){
			    if(val.sugerencia!=5){
			       textDoc+=obtenerSubPanelModuloEquipoMovil(val) 
			    }else if(val.sugerencia=="5"){
			       textDoc+="<div class='row' style='border-top: 1px solid #01529b;margin-top:20px;margin-left: 0px; margin-right: 0px;'></div><br>";
			    }
		         });
		      
		      txtDoc+=textDoc;
		      numDoc++;
	           });
				
		var listDatoNuevoDoc=[
			{sugerencia:"",label:"<i class='fa fa-black-tie'></i> Procedimiento de Trabajo:",inputForm: "<div id='evi'></div>",divContainer:""},
			{sugerencia:"",label:"<i class='fa fa-briefcase'></i> IPER de la Actividad:",inputForm:  "<div id='eviIper'></div>",divContainer:""},
			{sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarEquipo' onclick='guardarDocumentacion("+docId+");' class='btn btn-success' >" +
							       "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							    "</button>"}
				     ];
		
		var textNuevoDoc="";
		equipoMovilId=0;
				
		listDatoNuevoDoc.forEach(function(val){ 
		   textNuevoDoc+=obtenerSubPanelModuloEquipoMovilNuevo(val);
		});
				
		listPanelesPrincipalDocumentacion.push(
		    {id:"equipoDocAgregar" ,clase:"",nombre:""+"Nuevo / Editar Documentación",
		     contenido:"<div class='eventoGeneral divEquipoDocNuevo'>"+ 
				   textNuevoDoc+
			       "</div>"},
		    {id:"equipoDocListar" ,clase:"",nombre:""+"Documentacion Registrada ("+numDoc+")",
		     contenido:"<div class='eventoGeneral divEquipoLista' >"+ 
				   (numDoc==0?"<label style='color:#01529b; font-size:17px;'>" +
					         "<strong>Sin Documentación ... </strong>" +
					      "</label>"
					     :txtDoc)+
			       "</div>"}
		);
				
		agregarPanelesDivPrincipal(listPanelesPrincipalDocumentacion); 
				
		var options1={
		       container:"#evi",
		       functionCall:function(){},
		       descargaUrl:"",
		       esNuevo:true,
		       idAux:"Procedimiento",
		       evidenciaNombre:""
			     };
				
		crearFormEvidenciaCompleta(options1);
				
		var options2={
			container:"#eviIper",
			functionCall:function(){},
			descargaUrl:"",
			esNuevo:true,
			idAux:"Iper",
			evidenciaNombre:""
			     };
				
		crearFormEvidenciaCompleta(options2);
		//-------------------------------Fin Seccion Documentacion-----------------------------------------------------
		$(".contenidoSubList").hide();
		break;
			
	    default:
	        alert("nop");
	    	break;
         }
   });
}

function editarEquipoOperador(pindex){
    
   equipoMovilObj=listFullOperador[pindex];
   equipoMovilId=equipoMovilObj.id;
   var trabajador=equipoMovilObj.trabajador.trabajadorId;
	
   $("#selTrabajadores").val(trabajador);
   $("#inputEviCapacitacion").val(equipoMovilObj.evidenciaCapacitacionNombre);
	
   $("#equipoOperadorListar").hide();
   $("#equipoAgregar").hide();
   $("#equipoListar").hide();
   $("#equipoDocAgregar").hide();
   $("#equipoDocListar").hide();
   $("#equipoOperadorAgregar .tituloSubList")
      .html("<button class='btn btn-success' style='float:left' onclick='habilitarEquiposMoviles()'><i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>"+
	    "<button class='btn btn-success' onclick='cambiarDivSubContenido(this,undefined)'><i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>"
	    +"Editar Operador");
   
   $("#selTrabajadores").prop("disabled",true);
   $("#equipoOperadorAgregar .contenidoSubList").show();
}

function eliminarEquipoOperador(pindex){
    
   equipoMovilObj=listFullOperador[pindex];
   equipoMovilId=equipoMovilObj.id;
	
   var r = confirm("¿Está seguro de eliminar el operador?");
	
   if(r == true){
      var dataParam={
	      id : equipoMovilId,
		    };
      
      callAjaxPost(URL+'/contratista/equipomovil/operador/delete', dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		   habilitarEquiposMoviles();
		   break;
					
	       default:
	           alert("No se puede eliminar .");
	    }
      });
   }
}

function guardarOperador(){
	
   var operadorId=equipoMovilId;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var trabajador=$("#selTrabajadores").val();
   var evidencia1=$("#inputEviCapacitacion").val();
   //var evidencia2=$("#inputEviOperador").val();
   evi1=false;
   //evi2=false;
   if(evidencia1!=""){
      evi1=true;
   }else if(evidencia1==""){
      evi1=false
      alert("El certificado de Capacitación es obligatorio!");
      return;
   }
   /*if(evidencia2!=""){
        evi2=true;
     }else if(evidencia2==""){
	evi2=false;
	alert("Debe subir la evidencia");
	return;
     }*/
   var dataParam={
	   id:operadorId,
	   trabajador:{trabajadorId:trabajador},
	   contratista:{id:contratistaId}
	         }
   
   callAjaxPost(URL+'/contratista/equipomovil/operador/save',dataParam,procesarGuardarOperadorCap);
   $("#equipoOperadorListar").show();
}

function procesarGuardarOperadorCap(data){
   switch(data.CODE_RESPONSE){
      case "05":
          if(evi1){
	     equipoMovilId=data.nuevoId;
	     guardarEvidenciaAuto(equipoMovilId,"fileEviCapacitacion",bitsEvidenciaEquipOperadorCap,
		     		  "/contratista/equipomovil/operador/evidencia1/save",
	        function(){
		   $(".divListPrincipal").html("");
		   habilitarEquiposMoviles();
		   $("#equipoOperadorListar .contenidoSubList").show();
		   
		   mensajeUx="Operador(a) registrado(a) con éxito";
		   mensajesUx(mensajeUx,1,"");
		},"id");
          }
	  break;
	  
      default:
	 alert("Ocurrio un error al guardar el archivo!");
   }
}
/* *** No sirve ***
function procesarGuardarOperador()
{
   if(evi2){
      guardarEvidenciaAuto(equipoMovilId,"fileEviOperador",bitsEvidenciaEquipOperador,
	                   "/contratista/equipomovil/operador/evidencia2/save",
         function(){
	    $(".divListPrincipal").html("");
	    habilitarEquiposMoviles();
	 },"id");
   }	
} */

function editarEquipoMovil(pindex){
    
   equipoMovilObj=listFullEquiposMoviles[pindex];
   equipoMovilId=equipoMovilObj.id;
   
   var descripcion=equipoMovilObj.descripcion;
   $("#inputDescripcionEquipo").val(descripcion);
   
   var identificador=equipoMovilObj.identificador;
   $("#inputIdentificador").val(identificador);
	
   $("#inputEviOperatividad").val(equipoMovilObj.evidenciaOperatividadNombre);
   $("#inputEviMantenimiento").val(equipoMovilObj.evidenciaMantenimientoNombre);

   $("#equipoOperadorAgregar").hide();
   $("#equipoOperadorListar").hide();
   $("#equipoListar").hide();
   $("#equipoDocAgregar").hide();
   $("#equipoDocListar").hide();
   $("#equipoAgregar .tituloSubList")
      .html("<button class='btn btn-success' style='float:left' onclick='habilitarEquiposMoviles()'>" +
      	       "<i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i>" +
      	    "</button>"+
	    "<button class='btn btn-success' onclick='cambiarDivSubContenido(this,undefined)'>" +
	       "<i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>"
	   +"Editar Equipo Movil");
   $("#equipoAgregar .contenidoSubList").show();
}

function eliminarEquipoMovil(pindex){
	
   equipoMovilObj=listFullEquiposMoviles[pindex];
   equipoMovilId=equipoMovilObj.id;
	
   var r=confirm("¿Está seguro de eliminar el equipo movil?");
	
   if(r==true){
      
      var dataParam={
	      id:equipoMovilId,
		    };
		
      callAjaxPost(URL+'/contratista/equipomovil/delete',dataParam,
         function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		   habilitarEquiposMoviles();
		   $("#equipoListar .contenidoSubList").show();
		   break;
					
	       default:
		  alert("No se puede eliminar .");
	    }
         });
   }
}

function guardarEquipoMovil(){
	
   var equipoId=equipoMovilId;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var identificador=$("#inputIdentificador").val();
   var descrip=$("#inputDescripcionEquipo").val();
   var evidencia1=$("#inputEviOperatividad").val();
   var evidencia2=$("#inputEviMantenimiento").val();
	
   evi1=false;
   evi2=false;
	
   if(evidencia1!=""){
      evi1=true;
   }else if(evidencia1==""){
      evi1=false;
      alert("El certificado de operatividad es obligatorio");
      return;
   }
	
   if(evidencia2!=""){
      evi2=true;
   }else if(evidencia2==""){
      evi2=false;
      alert("El certificado del ultimo mantenimiento es obligatorio");
      return;
   }
	
   var dataParam={
	   id:equipoId,
	   descripcion:descrip,
	   identificador:identificador,
	   contratista:{id:contratistaId}
		 }
   
   callAjaxPost(URL+'/contratista/equipomovil/save',dataParam,procesarGuardarEquipOperatividad);
}

function procesarGuardarEquipOperatividad(data){
	
   switch(data.CODE_RESPONSE){
      case "05":
	  if(evi1){
	     equipoMovilId=data.nuevoId;
	     guardarEvidenciaAuto(equipoMovilId,"fileEviOperatividad",bitsEvidenciaEquipOperadorCap,
		     		  "/contratista/equipomovil/evidencia1/save",procesarGuardarEquipMantenimiento,"id");
	  }
	  break;
	  
      default:
	 alert("Ocurrio un error al guardar el archivo!");
   }
}

function procesarGuardarEquipMantenimiento(){
    
   if(evi2){
      guardarEvidenciaAuto(equipoMovilId,"fileEviMantenimiento",
			   bitsEvidenciaEquipOperador,"/contratista/equipomovil/evidencia2/save",
         function(data){
	    $(".divListPrincipal").html("");
	    habilitarEquiposMoviles();
	    $("#equipoListar .contenidoSubList").show();
	    
	    mensajeUx="El equipo móvil fue registrado con éxito";
	    mensajesUx(mensajeUx,1,"");
         },"id");
   }
}

function guardarDocumentacion(id){
   var docId=id;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var evidencia1=$("#inputEviProcedimiento").val();
   var evidencia2=$("#inputEviIper").val();
   var seccion=1;
	
   evi1=false;	
   evi2=false;
	
   if(evidencia1!=""){
      evi1=true;
   }else if(evidencia1==""){
      evi1=false;
      alert("Debe subir la evidencia");
      return;
   }
	
   if(evidencia2!=""){
      evi2=true;
   }else if(evidencia2==""){
      evi2=false;
      alert("Debe subir la evidencia");
      return;
   }
	
   var dataParam={
	   id:docId,
	   contratista:{id:contratistaId},
	   seccion:{id:seccion}
		 }
   
   callAjaxPost(URL+'/contratista/equipomovil/documentacion/save', dataParam,procesarGuardarEquipDocEvidencia);
}

function procesarGuardarEquipDocEvidencia(data) {

   switch(data.CODE_RESPONSE){
      case "05":
	  if(evi1){
	     equipoMovilId=data.nuevoId;
	     guardarEvidenciaAuto(equipoMovilId,"fileEviProcedimiento",bitsEvidenciaEquipOperadorCap,
		                  "/contratista/equipomovil/documentacion/evidencia1/save",
				  procesarGuardarEquipDocEvidenciaIper,"id");
	  }
	  break;
	  
	  default:
	     alert("Ocurrio un error al guardar el archivo!");
   }
}

function procesarGuardarEquipDocEvidenciaIper(){
    
   if(evi2){
      guardarEvidenciaAuto(equipoMovilId,"fileEviIper",bitsEvidenciaEquipOperador,
	      		   "/contratista/equipomovil/documentacion/evidencia2/save",
         function(data){
	    $(".divListPrincipal").html("");
	    habilitarEquiposMoviles();
	    
	    mensajeUx="La documentación fue registrada con éxito";
	    mensajesUx(mensajeUx,1,"");
	 },"id");
   }
}

function obtenerSubPanelModuloEquipoMovilNuevo(val){
	
   var estiloDefault="";
	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault=" border-top: 1px solid #a5aaae;"
   }
	
   return "<div class='form-group row' style='"+estiloDefault+"'>"+
	     "<label for='colFormLabel' class='col-sm-5 col-form-label'>"+val.label+"</label>"+
	     "<div class='col-sm-7' id='"+val.divContainer+"'>"+
	        " "+val.inputForm+
	        "<small>"+val.sugerencia+" </small>"+
	     "</div>"+
	  "</div>";
}

function obtenerSubPanelModuloEquipoMovil(val){

   var estiloDefault="";
	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault=" border-top: 1px solid #a5aaae;"
   }
	
   return "<div class='row' style='"+estiloDefault+"'>"+
	     "<section class='col col-xs-5'>"
	        +val.label+
	     "</section>"+
	     "<section class='col col-xs-4' id='"+val.divContainer+"'>"
	        +val.inputForm+
	     "</section>"+ 
	  "</div>";
}