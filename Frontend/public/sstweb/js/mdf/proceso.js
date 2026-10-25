
var procesoId,procesoObj,actualizarMacroproceso;
var banderaEdicionProceso = false;
var listFullProcesos = [];

function regresarVistaAnteriorProcesosAsociadosMacroproceso(){
   $("#modalProcesosAsociadosMacroproceso").modal("hide");$("#modalMacroproceso").modal("show");
   
   if(actualizarMacroproceso == 1){
      cargarMacroproceso();
   }
}

function verProcesosAsociadosMacroproceso(){
   $("#modalMacroproceso").modal("hide");$("#modalProcesosAsociadosMacroproceso").remove();actualizarMacroproceso = 0;
   
   var btnVolverPrincipal = "<button id='btnVolverPrincipalProcAsocMacro' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                                    "onclick='regresarVistaAnteriorProcesosAsociadosMacroproceso()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
         
   var btnVolver = "<button id='btnVolverProcAsocMacro' class='btn btn-success' style='margin-left:5px' " +
                           "title='Deshacer las acciones hechas en el registro.' onclick='cancelarProcesosAsociadosMacroproceso()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var btnNuevo = "<button id='btnNuevoProcAsocMacro' type='button' class='btn btn-success' style='margin-left:5px' " +
                          "title='Registrar un nuevo proceso.' onclick='nuevoProcesosAsociadosMacroproceso()'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
   
   var btnGuardar = "<button id='btnGuardarProcAsocMacro' class='btn btn-success' style='margin-left:5px' " +
                            "title='Guardar el proceso ingresado/modificado.' onclick='guardarProcesosAsociadosMacroproceso()'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var btnEliminar = "<button id='btnEliminarProcAsocMacro' type='button' class='btn btn-danger' style='margin-left:5px' " +
                             "title='Eliminar el proceso seleccionado.' onclick='eliminarProcesosAsociadosMacroproceso()'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";

   var listModal={
      id:"modalProcesosAsociadosMacroproceso",maxWidth:"50%",nombre:"<i class='fa fa-book'></i> Procesos asociados",
      contenido:
	  btnVolverPrincipal+btnVolver+btnNuevo+btnGuardar+btnEliminar +
         "<div class='wrapper' id='wrapProcesosAsociadosMacroproceso'>" +
            "<table id='tblProcesosAsociadosMacroproceso' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
                  "<tr>" +
                     "<td class='tb-acc' style='width:300px'>Proceso</td>" +
                     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
                     "<td class='tb-acc' style='width:150px'>Modificado el</td>" +
                  "</tr>" +
               "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"
   };

   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapProcesosAsociadosMacroproceso",210);    
   cargarProcesosAsociadosMacroproceso();
}

function cargarProcesosAsociadosMacroproceso(){
   $("#btnVolverPrincipalProcAsocMacro").show();$("#btnVolverProcAsocMacro").hide();$("#btnNuevoProcAsocMacro").show();
   $("#btnGuardarProcAsocMacro").hide();$("#btnEliminarProcAsocMacro").hide();

   var dataParam={
      macroprocesoId:macroprocesoId
   };

   callAjaxPost(URL+'/mdf/macroproceso/proceso',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionProceso = false;
	 listFullProcesos = data.listProcesos;

         $("#tblProcesosAsociadosMacroproceso tbody tr").remove();

         listFullProcesos.forEach(function(val,index){
            $("#tblProcesosAsociadosMacroproceso tbody").append(
               "<tr id='trProceso"+val.id+"' onclick='editarProcesosAsociadosMacroproceso("+index+")'>" +
                  "<td id='tdNombreProceso"+val.id+"'>"+val.nombre+"</td>" +
                  "<td id='tdFechaCreProceso"+val.id+"'>"+val.fechaCreacionTexto+"</td>" +
                  "<td id='tdFechaModProceso"+val.id+"'>"+val.fechaModificacionTexto+"</td>" +
               "</tr>");
         });

         goheadfixedY("#tblProcesosAsociadosMacroproceso","#wrapProcesosAsociadosMacroproceso");
         formatoCeldaSombreableTabla(true,"tblProcesosAsociadosMacroproceso");
      }else{
         console.log("NOPNPO");
      }
   });
}

function cancelarProcesosAsociadosMacroproceso(){
   cargarProcesosAsociadosMacroproceso();
}

function editarProcesosAsociadosMacroproceso(pindex){
   if(!banderaEdicionProceso){
      formatoCeldaSombreableTabla(false,"tblProcesosAsociadosMacroproceso");

      procesoId = listFullProcesos[pindex].id;
      procesoObj = listFullProcesos[pindex];

      $("#trProceso"+procesoId).addClass("fila-edicion");

      $("#tdNombreProceso"+procesoId).html("<input type='text' id='inputNombreProceso' class='form-control'>");
      $("#inputNombreProceso").val(procesoObj.nombre);
      
      $("#tdFechaModProceso"+procesoId).html("<label>*Automático</label>");

      banderaEdicionProceso = true;

      $("#btnVolverPrincipalProcAsocMacro").hide();$("#btnVolverProcAsocMacro").show();$("#btnNuevoProcAsocMacro").hide();
      $("#btnGuardarProcAsocMacro").show();$("#btnEliminarProcAsocMacro").show();
   }
}

function nuevoProcesosAsociadosMacroproceso(){
   if(!banderaEdicionProceso){
      formatoCeldaSombreableTabla(false,"tblProcesosAsociadosMacroproceso");
      procesoObj = {id:0};procesoId = 0;
      
      $("#tblProcesosAsociadosMacroproceso tbody").prepend(
         "<tr>" +
            "<td>"+"<input type='text' id='inputNombreProceso' class='form-control'>"+"</td>" +
            "<td><label>*Automático</label></td>" +
            "<td>...</td>" +
         "</tr>");

      $("#btnVolverPrincipalProcAsocMacro").hide();$("#btnVolverProcAsocMacro").show();$("#btnNuevoProcAsocMacro").hide();
      $("#btnGuardarProcAsocMacro").show();$("#btnEliminarProcAsocMacro").hide();

      banderaEdicionProceso = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarProcesosAsociadosMacroproceso(){
   var campoVacio = true;

   var nombre = $("#inputNombreProceso").val();

   if(nombre.length == 0){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
         id:procesoId,nombre:nombre,macroprocesoId:macroprocesoId,empresaId:parseInt(getSession("gestopcompanyid"))
      };

      callAjaxPost(URL+'/mdf/macroproceso/proceso/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               $("#modalProcesosAsociadosMacroproceso").modal("hide");

               mensajeUx = "<label>El registro del proceso fue guardado con éxito.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarProceso");

               $("#modalMensajeUxActualizarProceso").on("hidden.bs.modal",function(){
                  $("#modalProcesosAsociadosMacroproceso").modal("show");
                  actualizarMacroproceso = 1;cargarProcesosAsociadosMacroproceso();
               });

               break;

            default:
               console.log("Ocurrió un error al guardar el proceso!");
         }
      });
   }else{
      $("#modalProcesosAsociadosMacroproceso").modal("hide");
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionProceso");

      $("#modalMensajeUxValidacionProceso").on("hidden.bs.modal",function(){
         $("#modalProcesosAsociadosMacroproceso").modal("show");
      });
   }
}

function eliminarProcesosAsociadosMacroproceso(){
   $("#modalProcesosAsociadosMacroproceso").modal("hide");

   mensajeUx = "<label>¿Está seguro de eliminar el registro del proceso seleccionado?</label>";
   mensajesUx(mensajeUx,3,"","ConfProceso");

   $("#btnDevolverValorConfProceso").on("click",function(){
      var dataParam={
         id:procesoId
      };

      callAjaxPost(URL+'/mdf/macroproceso/proceso/delete',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               mensajeUx = "<label>El registro del proceso seleccionado se ha eliminado correctamente.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarProceso");

               $("#modalMensajeUxActualizarProceso").on("hidden.bs.modal",function(){
                  $("#modalProcesosAsociadosMacroproceso").modal("show");
                  actualizarMacroproceso = 1;cargarProcesosAsociadosMacroproceso();
               });
                    
               break;

            default:
               alert("Ocurrió un error al eliminar el proceso!");
         }
      });
   });

   $("#btnRegresarPrevioConfProceso").on("click",function(){
      $("#modalProcesosAsociadosMacroproceso").modal("show");
   });
}
