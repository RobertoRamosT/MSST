
var listFullIzajeTrabajador=[],listFullEquipo=[],
    listFullDocumentacionIzaje=[],listFullTrabajadorIzaje;
var evi1=false,evi2=false,ev3=false,evi4=false;
var izajeId,izajeObj;
var indexFunctionIzaje; 
var indexListIzajeEditar;

function toggleMenuOpcionIzaje(obj,pindex,menu,indexlist){

   indexFunctionIzaje=pindex;	
   indexListIzajeEditar=indexlist;
	
   $(obj).parent(".container"+menu+pindex).find("ul").toggle();
   $(obj).parent(".container"+menu+pindex).siblings().find("ul").hide(); 
	
   switch(menu){
      case "IzajeOperador":  
	  $(".containerIzajeRigger"+indexFunctionIzaje+" .listaGestionGosst").hide(); 
	  break;
      
      case "IzajeRigger":
	  $(".containerIzajeOperador"+indexFunctionIzaje+" .listaGestionGosst").hide();  
	  break;
      
      default:
	  break;
	}
} 

var funcionalidadIzaje=[
       {menu:"IzajeOperador",
	opcion:[{id:"opcEditarOperador",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
		    function(data){
	               editarIzaje(indexListIzajeEditar,1);
	            }},
		{id:"opcEliminarOperador",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:
		    function(data){
		       eliminarIzaje(indexListIzajeEditar,1);
		    }}
	       ]},
       {menu:"IzajeRigger",
	opcion:[{id:"opcEditarRigger",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
		    function(data){
	               editarIzaje(indexListIzajeEditar,2);
	            }},
		{id:"opcEliminarRigger",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:
		    function(data){
		       eliminarIzaje(indexListIzajeEditar,2);
		    }}
	       ]},
       {menu:"IzajeEquipo",
	opcion:[{id:"opcEditarEquipo",nombre:"<i class='fa fa-pencil-square-o'></i> Editar",functionClick:
		    function(data){
	               editarIzajeEquipo(indexListIzajeEditar);
	            }},
		{id:"opcEliminarEquipo",nombre:"<i class='fa fa-trash'></i> Eliminar",functionClick:
		    function(data){
		       eliminarIzajeEquipo(indexListIzajeEditar);
		    }}
	      ]}
	       		];

function marcarSubOpcionIzaje(pindex,pindex1){ 
	
   $(".listaOpciones"+pindex).hide();
   funcionalidadIzaje[pindex].opcion[pindex1].functionClick();
}

var menuOpcionIzaje=[];

function ListarOpcionesIzaje(idpindex){
	
   funcionalidadIzaje.forEach(
      function(val1,index1){
         var menu=val1.menu;
         var opciones=val1.opcion;
		
         menuOpcionIzaje[index1]="<ul class='list-group listaGestionGosst listaOpciones"+index1+"' style='display:none;top:40px;'>";
		
         opciones.forEach(function(val2,index2){
	    menuOpcionIzaje[index1]+="<li id='"+val2.id+menu+idpindex+"' style='' class='list-group-item' " +
	    		                 "onclick='marcarSubOpcionIzaje("+index1+","+index2+")'>"+val2.nombre+"</li>";
			});
		menuOpcionIzaje[index1]+="</ul>";
      });
}

function habilitarIzaje(){
	
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var dataParam={ 
	   id:contratistaId,
	   empresaId:parseInt(getSession("gestopcompanyid")),
	   seccion:2
		 };
	
   callAjaxPost(URL+'/contratista/izaje/trabajador',dataParam,function(data){
      switch(data.CODE_RESPONSE){
         case "05":
	     var listPanelesPrincipalOperador=[];
	     var txtOperadores="",txtRiggers="";
	     var numOperador=0,numRigger=0;
					
	     listFullIzajeTrabajador=data.operadores;
	     listFullTrabajadorIzaje=data.trabajadores;
	     listFullEquipos=data.equipos;
	     listFullDocumentacionIzaje=data.documentacion
	
	     $(".divListPrincipal").html("");
	     izajeId=0;
					
	     //------------------------------Inicio Seccion Operador de Grua y Rigger-----------------------------------------------------
	     listFullIzajeTrabajador.forEach(
	        function(val,index){
		   ListarOpcionesIzaje(val.id);
		   var evidenciaNombre;
						
		   if(val.evidenciaNombre!="Sin Registrar"){
		      evidenciaNombre="<a class='efectoLink' href='"+URL+"/contratista/izaje/trabajador/evidencia?id="+val.id+"'>"+val.evidenciaNombre+"</a>";
		   }else{
		      evidenciaNombre=val.evidenciaNombre;
		   }
						
		   var eval4=obtenerTextoEvaluacion(val.evaluacionEvidencia);
						
		   if(val.tipoTrabajador.id==1){
							
		      var listDatoTrabajador=[
			      {sugerencia:"",label:"<i class='fa fa-info'></i> Estado:",inputForm: eval4.textoEval.replace("<br>",""),divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador:",inputForm:val.trabajador.nombre,divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado del Operador:",inputForm: evidenciaNombre,divContainer:""},
			      {sugerencia:"",label:"<br>",inputForm:"<br>",divContainer:""}
					     ];
							
		      var textOperador="";
							
		      listDatoTrabajador.forEach(function(val){
			 textOperador+=obtenerSubPanelModuloIzaje(val);
		      });
							
		      txtOperadores+="<div id='izajeOperador"+val.id+"'class='eventoGeneral'>" +  
				        "<div class=''>" +
					   "<section class='containerIzajeOperador"+val.id+"'>" +
					      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionIzaje(this,"+val.id+",\"IzajeOperador\","+index+")'>" +
					         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					      "</a>"+menuOpcionIzaje[0]+
					   "</section>"+
					"</div>"+
					textOperador+
				     "</div>";
		      numOperador++;
		   }else if(val.tipoTrabajador.id==2){
							
		      var listDatoRiggerr=[
			      {sugerencia:"",label:"<i class='fa fa-info'></i> Estado:",inputForm: eval4.textoEval.replace("<br>",""),divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador:",inputForm:val.trabajador.nombre,divContainer:""},
			      {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado del Rigger:",inputForm: evidenciaNombre,divContainer:""},
			      {sugerencia:"",label:"<br>",inputForm:"<br>",divContainer:""}
					  ];
							
		      var textRigger="";
							
		      listDatoRiggerr.forEach(function(val){
			 textRigger+=obtenerSubPanelModuloIzaje(val);
		      });
							
		      txtRiggers+="<div id='izajeRigger"+val.id+"'class='eventoGeneral'>" +  
				     "<div class=''>" +
				        "<section class='containerIzajeRigger"+val.id+"'>" +
					   "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionIzaje(this,"+val.id+",\"IzajeRigger\","+index+")'>" +
					      "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
					   "</a>"+menuOpcionIzaje[1]+
					"</section>"+
				     "</div>"+
				     textRigger+
				  "</div>";
		      numRigger++;
		   }
	        });
	     
	     var selOperadorIzaje=crearSelectOneMenuOblig("selOperadorIzaje", "", listFullTrabajadorIzaje, 
							  "", "trabajadorId","nombre");
	     var selRiggerIzaje=crearSelectOneMenuOblig("selRiggerIzaje", "", listFullTrabajadorIzaje, 
						 	"", "trabajadorId","nombre");
	     var listDatoNuevoOperadorGrua=[
		     {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador:",inputForm:selOperadorIzaje,divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado del Operador:",inputForm: "<div id='eviOper' ></div>",divContainer:""},
		     {sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarOperadorGrua' onclick='guardarIzajeTrabajador(1);' class='btn btn-success' >" +
							    "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							 "</button>"}
					   ];
	     
	     var listDatoNuevoRigger=[
		     {sugerencia:"",label:"<i class='fa fa-user'></i> Trabajador:",inputForm:selRiggerIzaje,divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado del Rigger:",inputForm: "<div id='eviRigg' ></div>",divContainer:""},
		     {sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarRigger' onclick='guardarIzajeTrabajador(2);' class='btn btn-success' >" +
							    "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							 "</button>"}
				     ];
					
	     var textNuevoOperador="";
					
	     listDatoNuevoOperadorGrua.forEach(function(val){ 
		textNuevoOperador+=obtenerSubPanelModuloIzajeNuevo(val);
	     });
					
	     var textNuevoRigger="";
					
	     listDatoNuevoRigger.forEach(function(val){ 
	        textNuevoRigger+=obtenerSubPanelModuloIzajeNuevo(val);
	     });
					
	     listPanelesPrincipalOperador.push(
	         {id:"izajeOperadorAgregar",clase:"",nombre:""+"Nuevo Operador de Grúa",
	          contenido:"<div class='eventoGeneral divIzajeOperadorGruaNuevo'>"+
			        textNuevoOperador+
			    "</div>"},
		 {id:"izajeOperadorGruaListar",clase:"",nombre:""+"Operadores de Grúa ("+numOperador+")",
		  contenido:"<div class='eventoGeneral divIzajeOperadorLista'>"+ 
			        (numOperador==0?"<label style='color:#01529b; font-size:17px;'>" +
						   "<strong>Sin Operadores de Grúa... </strong>" +
						"</label>":txtOperadores)+
			    "</div>"},
		 {id:"izajeRiggerAgregar",clase:"",nombre:""+"Nuevo Rigger",
		  contenido:"<div class='eventoGeneral divIzajeRiggerNuevo'>"+
			        textNuevoRigger+
			    "</div>"},
		 {id:"izajeRiggerListar",clase:"",nombre:""+"Rigger ("+numRigger+")",
		  contenido:"<div class='eventoGeneral divIzajeRiggerLista'>"+ 
			        (numRigger==0?"<label style='color:#01529b; font-size:17px;'>" +
					         "<strong>Sin Rigger... </strong>" +
					      "</label>":txtRiggers)+
			    "</div>"});
						
	     agregarPanelesDivPrincipal(listPanelesPrincipalOperador); 
						
	     var options1={
		     container:"#eviOper",
		     functionCall:function(){},
		     descargaUrl:"",
		     esNuevo:true,
		     idAux:"OperadorGrua",
		     evidenciaNombre:""
			  };
						
	     crearFormEvidenciaCompleta(options1);
						
	     var options2={
		    container:"#eviRigg",
		    functionCall:function(){},
		    descargaUrl:"",
		    esNuevo:true,
		    idAux:"Rigger",
		    evidenciaNombre:""
			  };
						
	     crearFormEvidenciaCompleta(options2);
						
	     //-----------------------------Fin Seccion Operador de Grua y Rigger-----------------------------------------------------
						
	     //----------------------------Inicio Seccion Equipos -------------------------------------------------------------------------
	     var listPanelesPrincipalEquipos=[];
	     var txtEquipos="";
	     var numEquipos=0;
						
	     listFullEquipos.forEach(function(val,index){
							
		 ListarOpcionesIzaje(val.id);
		 var evidenciaRevision="",evidenciaOperatividad="",evidenciaSoat="",evidenciaCertificado="";
							
		 if(val.evidenciaOperatividadNombre!="Sin Registrar"){
		    evidenciaOperatividad="<a class='efectoLink' href='"+URL+"/contratista/izaje/equipo/evidencia1?id="+val.id+"'>"+val.evidenciaOperatividadNombre+"</a>";
		 }else{
		    evidenciaOperatividad=val.evidenciaOperatividadNombre;
		 }
							
		 if(val.evidenciaRevisionNombre!="Sin Registrar"){
		    evidenciaRevision="<a class='efectoLink' href='"+URL+"/contratista/izaje/equipo/evidencia2?id="+val.id+"'>"+val.evidenciaRevisionNombre+"</a>";
		 }else{
		    evidenciaRevision=val.evidenciaRevisionNombre;
		 }
							
		 if(val.evidenciaSoatNombre!="Sin Registrar"){
		    evidenciaSoat="<a class='efectoLink' href='"+URL+"/contratista/izaje/equipo/evidencia3?id="+val.id+"'>"+val.evidenciaSoatNombre+"</a>";
		 }else{
		    evidenciaSoat=val.evidenciaSoatNombre;
		 }
							
		 if(val.evidenciaCertificadoNombre!="Sin Registrar"){
		    evidenciaCertificado="<a class='efectoLink' href='"+URL+"/contratista/izaje/equipo/evidencia4?id="+val.id+"'>"+val.evidenciaCertificadoNombre+"</a>";
		 }else{
		    evidenciaCertificado=val.evidenciaCertificadoNombre;
		 }

		 var eval1=obtenerTextoEvaluacion(val.evaluacionEvidenciaOperatividad);
		 var eval2=obtenerTextoEvaluacion(val.evaluacionEvidenciaRevision);
		 var eval3=obtenerTextoEvaluacion(val.evaluacionEvidenciaSoat);
		 var eval4=obtenerTextoEvaluacion(val.evaluacionEvidenciaCertificado);
							
		 var listDatoEquipo=[
			 {sugerencia:"",label:"<i class='fa fa-indent'></i> Nº de Identificación del Equipo:",inputForm:val.descripcion,divContainer:""},
			 {sugerencia:"",label:"",inputForm:val.identificador,divContainer:""},
								
			 {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Operatividad del Camión:",inputForm: eval1.textoEval.replace("<br>",""),divContainer:""},
			 {sugerencia:"",label:"",inputForm:evidenciaOperatividad,divContainer:""},
								
			 {sugerencia:"",label:"<i class='fa fa-wrench'></i> Revisión técnica vehicular :",inputForm: eval2.textoEval.replace("<br>",""),divContainer:""},
			 {sugerencia:"",label:"",inputForm:evidenciaRevision,divContainer:""},
								
			 {sugerencia:"",label:"<i class='fa fa-bus'></i> SOAT:",inputForm: eval3.textoEval.replace("<br>",""),divContainer:""},
			 {sugerencia:"",label:"",inputForm:evidenciaSoat,divContainer:""},
								
			 {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Eslinga, Faja con rachet y estrobo:",inputForm: eval4.textoEval.replace("<br>",""),divContainer:""},
			 {sugerencia:"",label:"",inputForm:evidenciaCertificado,divContainer:""}, 
								
			 {sugerencia:"5",label:"<br>",inputForm:"<br>",divContainer:""}
				    ];
							
		 var textEquipo="";
							
		 listDatoEquipo.forEach(function(val){
		    textEquipo+=obtenerSubPanelModuloEquipoMovil(val);
		 });
							
		 txtEquipos+="<div id='isajeEquipo"+val.id+"'class='eventoGeneral'>" +  
			        "<div class=''>" +
				   "<section class='containerIzajeEquipo"+val.id+"'>" +
				      "<a class='efectoLink btn-gestion' onclick='toggleMenuOpcionIzaje(this,"+val.id+",\"IzajeEquipo\","+index+")'>" +
				         "Ver Opciones <i class='fa fa-angle-double-down'></i>" +
				      "</a>"+menuOpcionIzaje[2]+
				   "</section>"+
				"</div>"+
				 textEquipo+
		             "</div>";
		 numEquipos++;
	     });
						
	     var listDatoNuevoEquipo=[
		     {sugerencia:"",label:"<i class='fa fa-truck'></i> Descripción del Equipo:",inputForm:"<textarea id='inputDescripcion' class='form-control' placeholder='Especifique el modelo, marca y año de antiguedad de la unidad'></textarea>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-indent'></i> Nº de Identificación del Equipo:",inputForm:"<input type='text' id='inputIdentificador' class='form-control'>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Operatividad:",inputForm:"<div id='eviOperatividad'></div>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-wrench'></i> Revisión técnica vehicular:",inputForm:"<div id='eviRevision'></div>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-bus'></i> SOAT:",inputForm:"<div id='eviSoat'></div>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-certificate'></i> Certificado de Eslinga, Faja con rachet y estrobo:",inputForm: "<div id='eviCertificado'></div>",divContainer:""},
		     {sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarIzajeEquipo' onclick='guardarIzajeEquipo();' class='btn btn-success' >" +
							    "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							 "</button>"}
				     ];
						
	     var textNuevoEquipo="";
						
	     listDatoNuevoEquipo.forEach(function(val){ 
	        textNuevoEquipo+=obtenerSubPanelModuloEquipoMovilNuevo(val);
	     });
						
	     listPanelesPrincipalEquipos.push(
	        {id:"izajeEquipoAgregar",clase:"",nombre:""+"Nuevo Equipo",
	         contenido:"<div class='eventoGeneral divIzajeEquipoNuevo'>"+ 
			       textNuevoEquipo+
			   "</div>"},
		{id:"izajeEquipoListar",clase:"",nombre:""+"Equipos ("+numEquipos+")",
		 contenido:"<div class='eventoGeneral divEquipoLista'>"+ 
			       (numEquipos==0?"<label style='color:#01529b; font-size:17px;'>" +
					         "<strong>Sin Equipos ... </strong>" +
					      "</label>":txtEquipos)+
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
		    container:"#eviRevision",
		    functionCall:function(){},
		    descargaUrl:"",
		    esNuevo:true,
		    idAux:"Revision",
		    evidenciaNombre:""
			  };
						
	     crearFormEvidenciaCompleta(options2);	
						
	     var options3={
		    container:"#eviSoat",
		    functionCall:function(){},
		    descargaUrl:"",
		    esNuevo:true,
		    idAux:"Soat",
		    evidenciaNombre:""
			  };
						
	     crearFormEvidenciaCompleta(options3);
						
	     var options4={
		    container:"#eviCertificado",
		    functionCall:function(){},
		    descargaUrl:"",
		    esNuevo:true,
		    idAux:"Certificado",
		    evidenciaNombre:""
			  };
						
	     crearFormEvidenciaCompleta(options4);
						
	     //---------------------------Fin-Inicio Seccion Equipos -------------------------------------------------------------------------
						
	     //-------------------------------Seccion Docuemntacion-----------------------------------------------------
	     var listPanelesPrincipalDocumentacion=[];
	     var txtDoc="";
	     var numDoc=0;
	     var docId=0;
						
	     listFullDocumentacionIzaje.forEach(function(val,index){
	        docId=val.id;
		ListarOpcionesIzaje(val.id);
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
							
		listDatoDoc.forEach(function(val){					
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
		     {sugerencia:"",label:"<i class='fa fa-black-tie'></i> Procedimiento de Trabajo:",inputForm:"<div id='evi'></div>",divContainer:""},
		     {sugerencia:"",label:"<i class='fa fa-briefcase'></i> IPER de la Actividad:",inputForm:"<div id='eviIper'></div>",divContainer:""},
		     {sugerencia:" ",label:" ",inputForm:"<button id='btnGuardarEquipo' onclick='guardarDocumentacionIzaje("+docId+");' class='btn btn-success' >" +
						            "<i aria-hidden='true' class='fa fa-save'></i> Guardar" +
							 "</button>"}
				  ];
						
	     var textNuevoDoc="";
	     equipoMovilId=0;
						
	     listDatoNuevoDoc.forEach(function(val){ 
	        textNuevoDoc+=obtenerSubPanelModuloEquipoMovilNuevo(val);
	     });
						
	     listPanelesPrincipalDocumentacion.push(
		 {id:"izajeDocAgregar" ,clase:"",nombre:""+"Nuevo / Editar Documentación",
		  contenido:"<div class='eventoGeneral divIzajeDocNuevo'>"+ 
			        textNuevoDoc+
			    "</div>"},
		 {id:"izajeDocListar" ,clase:"",nombre:""+"Documentacion Registrada ("+numDoc+")",
		  contenido:"<div class='eventoGeneral divIzajeLista'>"+ 
			        (numDoc==0?"<label style='color:#01529b; font-size:17px;'>" +
					      "<strong>Sin Documentación ... </strong>" +
					   "</label>":txtDoc)+
			    "</div>"});
						
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

function editarIzaje(pindex,tipo){
	
   izajeObj=listFullIzajeTrabajador[pindex];
   izajeId=izajeObj.id;
	
   var trabajador=izajeObj.trabajador.trabajadorId;
	
   if(tipo==1){
      $("#inputEviOperadorGrua").val(izajeObj.evidenciaNombre);
      $("#selOperadorIzaje").val(trabajador);
      $("#izajeOperadorGruaListar").hide();
      $("#izajeRiggerAgregar").hide();
      $("#izajeRiggerListar").hide();
      $("#izajeEquipoAgregar").hide();
      $("#izajeEquipoListar").hide();
      $("#izajeDocAgregar").hide();
      $("#izajeDocListar").hide();
      $("#izajeOperadorAgregar .tituloSubList")
         .html("<button class='btn btn-success' style='float:left' onclick='habilitarIzaje()'><i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>"+
	       "<button class='btn btn-success' onclick='cambiarDivSubContenido(this,undefined)'><i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>"
		+"Editar Operador de Grúa");
      
      $("#selOperadorIzaje").prop("disabled",true);
      $("#izajeOperadorAgregar .contenidoSubList").show();
      
   }else if(tipo==2){
      $("#inputEviRigger").val(izajeObj.evidenciaNombre);
      $("#selRiggerIzaje").val(trabajador);
      $("#izajeOperadorAgregar").hide();
      $("#izajeOperadorGruaListar").hide();
      $("#izajeRiggerListar").hide();
      $("#izajeEquipoAgregar").hide();
      $("#izajeEquipoListar").hide();
      $("#izajeDocAgregar").hide();
      $("#izajeDocListar").hide();
      $("#izajeRiggerAgregar .tituloSubList")
         .html("<button class='btn btn-success' style='float:left' onclick='habilitarIzaje()'><i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>"+
               "<button class='btn btn-success' onclick='cambiarDivSubContenido(this,undefined)'><i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>"
	        +"Editar Rigger");
      
      $("#selRiggerIzaje").prop("disabled",true);
      $("#izajeRiggerAgregar .contenidoSubList").show();
   }
}

function eliminarIzaje(pindex,tipo){
	
   izajeObj=listFullIzajeTrabajador[pindex];
   izajeId=izajeObj.id;
   var mensaje="";
	
   if(tipo==1){
      mensaje="operador de grúa";
   }else if(tipo==2){
      mensaje="rigger";
   }
	
   var r=confirm("¿Está seguro de eliminar el "+mensaje+"?");
	
   if(r==true){
      var dataParam={
	      id:izajeId,
		    };
      
      callAjaxPost(URL+'/contratista/izaje/trabajador/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
	    case "05":
	        habilitarIzaje();
	        break;
					
	    default:
	       alert("No se puede eliminar .");
         }
      });
   }
}

function guardarIzajeTrabajador(tipoTrab){
	
   var izaje=izajeId;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var trabajador;
   var evidencia1,mensaje="";
	
   if(tipoTrab==1){
      trabajador=$("#selOperadorIzaje").val();
      evidencia1=$("#inputEviOperadorGrua").val();
      mensaje="Operador";
   }else if(tipoTrab==2){
      trabajador=$("#selRiggerIzaje").val();
      evidencia1=$("#inputEviRigger").val();
      mensaje="Rigger";
   } 
	
   evi1=false;
	
   if(evidencia1!=""){
      evi1=true;
   }else if(evidencia1==""){
      evi1=false
      alert("El certificado del "+mensaje+" es obligatorio!");
      return;
   }
	
   var dataParam={
	   id:izaje,
	   trabajador:{trabajadorId:trabajador},
	   tipoTrabajador:{id:tipoTrab},
	   contratista:{id:contratistaId}
		 }
   
   callAjaxPost(URL+'/contratista/izaje/trabajador/save',dataParam,
      function(data){
         procesarGuardarIzajeOperador(data,tipoTrab);
      }); 
}

function procesarGuardarIzajeOperador(data,tipo){
	
   switch(data.CODE_RESPONSE){
      case "05":
	  if(evi1){
	     var tipoText="";
	     izajeId=data.nuevoId;
			
	     if(tipo==1){
		tipoText="OperadorGrua";
	     }else if(tipo==2){
		tipoText="Rigger";
	     }
			
	     guardarEvidenciaAuto(izajeId,"fileEvi"+tipoText,bitsEvidenciaEquipOperadorCap,
		                  "/contratista/izaje/trabajador/evidencia/save",
				  function(){
				     $(".divListPrincipal").html("");
				     habilitarIzaje();
				     $("#equipoOperadorListar .contenidoSubList").show();
				  },"id");
	  }
	  break;
	  
      default:
	 alert("Ocurrio un error al guardar el archivo!");
   }
}

function editarIzajeEquipo(pindex){
	
   izajeObj=listFullEquipos[pindex];
   izajeId=izajeObj.id;
   var descripcion=izajeObj.descripcion;
   var identificador=izajeObj.identificador;
   $("#inputDescripcion").val(descripcion);
   $("#inputIdentificador").val(identificador);

   $("#inputEviOperatividad").val(izajeObj.evidenciaOperatividadNombre);
   $("#inputEviRevision").val(izajeObj.evidenciaRevisionNombre);
   $("#inputEviSoat").val(izajeObj.evidenciaSoatNombre);
   $("#inputEviCertificado").val(izajeObj.evidenciaCertificadoNombre);
	
   $("#izajeOperadorAgregar").hide();
   $("#izajeOperadorGruaListar").hide();
   $("#izajeRiggerAgregar").hide();
   $("#izajeRiggerListar").hide();
   $("#izajeEquipoListar").hide();
   $("#izajeDocAgregar").hide();
   $("#izajeDocListar").hide();
   $("#izajeEquipoAgregar .tituloSubList")
      .html("<button class='btn btn-success' style='float:left' onclick='habilitarIzaje()'><i class='fa fa-arrow-left fa-2x' aria-hidden='true'></i></button>"+
	    "<button class='btn btn-success' onclick='cambiarDivSubContenido(this,undefined)'><i class='fa fa-arrows-v fa-2x' aria-hidden='true'></i></button>"
	      +"Editar Equipo");
   
   $("#izajeEquipoAgregar .contenidoSubList").show();
}

function eliminarIzajeEquipo(pindex,tipo){
	
   izajeObj=listFullEquipos[pindex];
   izajeId=izajeObj.id;
	
   var r=confirm("¿Está seguro de eliminar el Equipo?");
	
   if(r==true){
      var dataParam={
	      id : izajeId,
		    };
      
      callAjaxPost(URL+'/contratista/izaje/equipo/delete', dataParam,
	 function(data){
	    switch(data.CODE_RESPONSE){
	       case "05":
		   habilitarIzaje();
		   break;
					
	       default:
		  alert("No se puede eliminar .");
	    }
         });
   }
}
function guardarIzajeEquipo(tipoTrab){
	
   var izaje=izajeId;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var identificador=$("#inputIdentificador").val();
   var descrip=$("#inputDescripcion").val();
   var evidencia1=$("#inputEviOperatividad").val();
   var evidencia2=$("#inputEviRevision").val();
   var evidencia3=$("#inputEviSoat").val();
   var evidencia4=$("#inputEviCertificado").val();
	
   evi1=false;
   evi2=false;
   evi3=false;
   evi4=false;
	
   if(evidencia1!=""){
      evi1=true;
   }else if(evidencia1==""){
      evi1=false
      alert("El certificado de Operatividad del camión es obligatorio!");
      return;
   }
	
   if(evidencia2!=""){
      evi2=true;
   }else if(evidencia2==""){
      evi2=false
      alert("El certificado de revisión técnica es obligatorio!");
      return;
   }
	
   if(evidencia3!=""){
      evi3=true;
   }else if(evidencia3==""){
      evi3=false
      alert("El SOAT es obligatorio!");
      return;
   }
	
   if(evidencia4!=""){
      evi4=true;
   }else if(evidencia4==""){
      evi4=false
      alert("El certificado de Eslinga, Faja con rachet y estrobo es obligatorio!");
      return;
   }
	
   var dataParam={
	   id:izaje,
	   descripcion:descrip,
	   identificador:identificador,
	   contratista:{id:contratistaId}
		 }
	
   callAjaxPost(URL+'/contratista/izaje/equipo/save',dataParam,
		procesarGuardarIzajeEquipo); 
}
function procesarGuardarIzajeEquipo(data){
	
   switch (data.CODE_RESPONSE){
      case "05":
	  if(evi1){  
	     izajeId=data.nuevoId;
	     guardarEvidenciaAuto(izajeId,"fileEviOperatividad",bitsEvidenciaEquipOperadorCap,
		                  "/contratista/izaje/equipo/evidencia1/save",
				  function(){
				     $(".divListPrincipal").html("");
				     habilitarIzaje();
				  },"id");
	  }
		
	  if(evi2){  
	     guardarEvidenciaAuto(izajeId,"fileEviRevision",bitsEvidenciaEquipOperadorCap,
		                  "/contratista/izaje/equipo/evidencia2/save",
				  function(){
				     $(".divListPrincipal").html("");
				     habilitarIzaje();
				  },"id");
	  }
		
	  if(evi3){  
	     guardarEvidenciaAuto(izajeId,"fileEviSoat",bitsEvidenciaEquipOperadorCap,
		                  "/contratista/izaje/equipo/evidencia3/save",
				  function(){
				     $(".divListPrincipal").html("");
				     habilitarIzaje();
				  },"id");
	  }
		
	  if(evi4){  
	     guardarEvidenciaAuto(izajeId,"fileEviCertificado",bitsEvidenciaEquipOperadorCap,
		                  "/contratista/izaje/equipo/evidencia4/save",
				  function(){
				     $(".divListPrincipal").html("");
				     habilitarIzaje();
				  },"id");
	  }
	  break;
	  
      default:
	 alert("Ocurrio un error al guardar el archivo!");
   }
}

function guardarDocumentacionIzaje(id){
	
   var docId=id;
   var contratistaId=parseInt(getSession("contratistaGosstId"));
   var evidencia1=$("#inputEviProcedimiento").val();
   var evidencia2=$("#inputEviIper").val();
   var seccion=2;
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
	
   callAjaxPost(URL + '/contratista/equipomovil/documentacion/save', dataParam,procesarGuardarIzajeDocEvidencia);
}

function procesarGuardarIzajeDocEvidencia(data) {
	
   switch(data.CODE_RESPONSE){
   case "05":
       if(evi1){
	  izajeId=data.nuevoId;
	  guardarEvidenciaAuto(izajeId,"fileEviProcedimiento",bitsEvidenciaEquipOperadorCap,
		  	       "/contratista/equipomovil/documentacion/evidencia1/save",
		  	       function(data){
				  $(".divListPrincipal").html("");
				  habilitarIzaje();
			       },"id");
	}

       if(evi2){
	  guardarEvidenciaAuto(izajeId,"fileEviIper",bitsEvidenciaEquipOperador,
		  	       "/contratista/equipomovil/documentacion/evidencia2/save",
		  	       function(data){
				  $(".divListPrincipal").html("");
				  habilitarIzaje();
			       },"id");
       }
       break;
       
   default:
       alert("Ocurrio un error al guardar el archivo!");
   }
}

function obtenerSubPanelModuloIzajeNuevo(val){
	
   var estiloDefault="";
   
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault="border-top: 1px solid #a5aaae;"
   }
	
   return "<div class='form-group row' style='"+estiloDefault+"'>"+
	     "<label for='colFormLabel' class='col-sm-5 col-form-label'>"+val.label+"</label>"+
	     "<div class='col-sm-7' id='"+val.divContainer+"'>"+
	        " "+val.inputForm+
	        "<small>"+val.sugerencia+"</small>"+
	     "</div>"+
	 "</div>";
}

function obtenerSubPanelModuloIzaje(val){
	
   var estiloDefault="";
	
   if(val.inputForm=="" &&  val.sugerencia=="" && val.label==""){
      estiloDefault="border-top: 1px solid #a5aaae;"
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
