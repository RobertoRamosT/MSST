
var listOpcConsolidadoNivProyInd=[
    {id:1,nombre:"Documentos a nivel empresa"},{id:2,nombre:"Documentos a nivel proyecto"},
    {id:3,nombre:"Documentos a nivel trabajador contratista"},{id:4,nombre:"Documentos a nivel conductor"},
    {id:5,nombre:"Documentos a nivel vehículo/maquinaria"}
];

function ocultarConsolidadosExcelNivProyInd(){
    $("#modalConsolidadosExcelNivProyInd").modal("hide");$("#modalIndicadoresProyecto").modal("show");
}

function verConsolidadosExcelNivProyInd(){
    $("#modalIndicadoresProyecto").modal("hide");$("#modalConsolidadosExcelNivProyInd").remove();

    var selOpcConExcelNivProyInd = crearSelectOneMenuOblig("selOpcConExcelNivProyInd",
        "",listOpcConsolidadoNivProyInd,"1","id","nombre");

    var contenido = "";

    var listContenido=[
        {sugerencia:"",anchoLabel:"col-sm-2",anchoDiv:"col-sm-10",label:"Consolidado",inputForm:selOpcConExcelNivProyInd},
//        {sugerencia:"",clase:"campo-doc-niv-bloque",anchoLabel:"col-sm-3",anchoDiv:"col-sm-9",label:"Bloque",inputForm:"",divContainer:"divBloqueNivAux"},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",label:"",inputForm:""},
        {sugerencia:"",anchoLabel:"",anchoDiv:"",
         label:"<button class='btn btn-danger' type='button' style='font-size:18px;' onclick='ocultarConsolidadosExcelNivProyInd()'>" +
                   "<i class='fa fa-times'></i> Cancelar" +
               "</button>",
         inputForm:"<button class='btn btn-success' style='float:right;font-size:18px;' type='button' onclick='descargarConsolidadosExcelNivProyInd()'>" +
                       "<i class='fa fa-download'></i> Descargar" +
                   "</button>"}
    ];

    listContenido.forEach(function(val){
        contenido += obtenerSubPanelModuloVersionDos(val);
    });

    var modalOptions={
        id:"modalConsolidadosExcelNivProyInd",nombre:"<i class='fa fa-file-excel-o'></i> Seleccionar - Consolidado excel",
        contenido:"<form class='eventoGeneral'>"+contenido+"</form>"
    };

    crearModalPrincipalUsuario(modalOptions,function(){},true,true);
    
//    habilitarCampoAdicionalExcelNivProyInd();
}

function habilitarCampoAdicionalExcelNivProyInd(){
    if([1,2].includes(parseInt($("#selOpcConExcelNivProyInd").val()))){
	$(".campo-doc-niv-bloque").hide();
    }else if([3,4,5].includes(parseInt($("#selOpcConExcelNivProyInd").val()))){
	var dataParam={
            empresaId:parseInt(getSession("gestopcompanyid")),opcionSelectLista:parseInt($("#selOpcConExcelNivProyInd").val())
	};
	
	callAjaxPostSimpleVersionDos(1,URL+'/contratista/previo/cantidad_auxiliar',dataParam,1,1,function(data){
            switch(data.CODE_RESPONSE){
                case "05":
                    var listValoresBloque = [];
                    
                    var cantidadBloques = Math.ceil(data.cantidad/300);
                    
                    for(var i = 0;i < cantidadBloques;i++){
                	var inicio = (i*300)+1;
                	var fin = Math.min((i+1)*300,data.cantidad);
                	
                	listValoresBloque.push({id:i+1,nombre:inicio+" - "+fin});
                    }
                    
                    var selBloqueExcelNivAux = crearSelectOneMenuOblig("selBloqueExcelNivAux","",listValoresBloque,"1","id","nombre");
                    
                    $("#divBloqueNivAux").html(selBloqueExcelNivAux);
                    
                    $(".campo-doc-niv-bloque").show();

                    break;

                default:
                    alert("Ocurrió un error al finalizar la inspección.");
            }
        });
    }
}

function descargarConsolidadosExcelNivProyInd(){
    var opcConsolidadoExcel = $("#selOpcConExcelNivProyInd").val();
//    var valOffSet = ([1,2].includes(parseInt($("#selOpcConExcelNivProyInd").val()))?0:((parseInt($("#selBloqueExcelNivAux").val())-1)*300));

    window.open(URL+"/contratista/excel/consolidado/documento_nivel/opciones?"+"empresaId="+getSession("gestopcompanyid") +
        "&opcionSelectLista="+opcConsolidadoExcel);/*+"&pValOffSet="+valOffSet);*/
}
