
var macroprocesoId,macroprocesoObj;
var banderaEdicionMacroproceso = false;
var listFullMacroprocesos = [];

function regresarVistaAnteriorMacroproceso(){
   $("#modalMacroproceso").modal("hide");
}

function verMacroproceso(){
   $("#modalMacroproceso").remove();
   
   var btnVolverPrincipal = "<button id='btnVolverPrincipalMacroproceso' class='btn btn-info' title='Regresar a la tabla anterior.' " +
                                    "onclick='regresarVistaAnteriorMacroproceso()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i> <i class='fa fa-book fa-2x'></i> <i class='fa fa-list-alt'></i>" +
      "</button>";
         
   var btnVolver = "<button id='btnVolverMacroproceso' class='btn btn-success' style='margin-left:5px' " +
                           "title='Deshacer las acciones hechas en el registro.' onclick='cancelarMacroproceso()'>" +
         "<i class='fa fa-sign-out fa-rotate-180 fa-2x'></i>" +
      "</button>";
   
   var btnNuevo = "<button id='btnNuevoMacroproceso' type='button' class='btn btn-success' style='margin-left:5px' " +
                          "title='Registrar un nuevo macroproceso.' onclick='nuevoMacroproceso()'>" +
         "<i class='fa fa-file-o fa-2x'></i>" +
      "</button>";
   
   var btnGuardar = "<button id='btnGuardarMacroproceso' class='btn btn-success' style='margin-left:5px' " +
                            "title='Guardar el macroproceso ingresado/modificado.' onclick='guardarMacroproceso()'>" +
         "<i class='fa fa-floppy-o fa-2x'></i>" +
      "</button>";
   
   var btnEliminar = "<button id='btnEliminarMacroproceso' type='button' class='btn btn-danger' style='margin-left:5px' " +
                             "title='Eliminar el macroproceso seleccionado.' onclick='eliminarMacroproceso()'>" +
         "<i class='fa fa-times fa-2x'></i>" +
      "</button>";

   var listModal={
      id:"modalMacroproceso",maxWidth:"70%",nombre:"<i class='fa fa-book'></i> Macroprocesos",
      contenido:
	  btnVolverPrincipal+btnVolver+btnNuevo+btnGuardar+btnEliminar +
         "<div class='wrapper' id='wrapMacroproceso'>" +
            "<table id='tblMacroproceso' class='table table-striped table-bordered table-hover table-fixed'>" +
               "<thead>" +
                  "<tr>" +
                     "<td class='tb-acc' style='width:300px'>Macroproceso</td>" +
                     "<td class='tb-acc' style='width:150px'>N° de procesos asociados</td>" +
                     "<td class='tb-acc' style='width:150px'>N° de "+getSession("gestopdivision")+" asociadas</td>" +
                     "<td class='tb-acc' style='width:150px'>Registrado el</td>" +
                     "<td class='tb-acc' style='width:150px'>Modificación el</td>" +
                  "</tr>" +
               "</thead>" +
               "<tbody></tbody>" +
            "</table>" +
         "</div>"
   };

   crearModalPrincipalUsuario(listModal,function(){},true,true);
   resizeDivWrapper("wrapMacroproceso",210);    
   cargarMacroproceso();
}

function cargarMacroproceso(){
   $("#btnVolverPrincipalMacroproceso").show();$("#btnVolverMacroproceso").hide();$("#btnNuevoMacroproceso").show();
   $("#btnGuardarMacroproceso").hide();$("#btnEliminarMacroproceso").hide();

   var dataParam={
      empresaId:parseInt(getSession("gestopcompanyid"))
   };

   callAjaxPost(URL+'/mdf/macroproceso',dataParam,function(data){
      if(data.CODE_RESPONSE == "05"){
	 banderaEdicionMacroproceso = false;
	 listFullMacroprocesos = data.listMacroprocesos;

         $("#tblMacroproceso tbody tr").remove();

         listFullMacroprocesos.forEach(function(val,index){
            $("#tblMacroproceso tbody").append(
               "<tr id='trMacroproceso"+val.id+"' onclick='editarMacroproceso("+index+")'>" +
                  "<td id='tdNombreMacroproceso"+val.id+"'>"+val.nombre+"</td>" +
                  "<td id='tdNumProcesosAsocMacroproceso"+val.id+"'>"+val.numProcesosAsociados+"</td>" +
                  "<td id='tdNumSedesAsocMacroproceso"+val.id+"'>"+val.numSedesAsociadas+"</td>" +
                  "<td id='tdFechaCreMacroproceso"+val.id+"'>"+val.fechaCreacionTexto+"</td>" +
                  "<td id='tdFechaModMacroproceso"+val.id+"'>"+val.fechaModificacionTexto+"</td>" +
               "</tr>");
         });

         goheadfixedY("#tblMacroproceso","#wrapMacroproceso");
         formatoCeldaSombreableTabla(true,"tblMacroproceso");
      }else{
         console.log("NOPNPO");
      }
   });
}

function cancelarMacroproceso(){
   cargarMacroproceso();
}

function editarMacroproceso(pindex){
   if(!banderaEdicionMacroproceso){
      formatoCeldaSombreableTabla(false,"tblMacroproceso");

      macroprocesoId = listFullMacroprocesos[pindex].id;
      macroprocesoObj = listFullMacroprocesos[pindex];

      $("#trMacroproceso"+macroprocesoId).addClass("fila-edicion");

      $("#tdNombreMacroproceso"+macroprocesoId).html("<input type='text' id='inputNombreMacroproceso' class='form-control'>");
      $("#inputNombreMacroproceso").val(macroprocesoObj.nombre);
      
      $("#tdNumProcesosAsocMacroproceso"+macroprocesoId).addClass("linkGosst").on("click",function(){
         verProcesosAsociadosMacroproceso();
      }).html(macroprocesoObj.numProcesosAsociados+"<br><i class='fa fa-list-alt fa-2x' style='text-align:center;'></i>");

      $("#tdFechaModMacroproceso"+macroprocesoId).html("<label>*Automático</label>");

      banderaEdicionMacroproceso = true;

      $("#btnVolverPrincipalMacroproceso").hide();$("#btnVolverMacroproceso").show();$("#btnNuevoMacroproceso").hide();
      $("#btnGuardarMacroproceso").show();$("#btnEliminarMacroproceso").show();
   }
}

function nuevoMacroproceso(){
   if(!banderaEdicionMacroproceso){
      formatoCeldaSombreableTabla(false,"tblMacroproceso");
      macroprocesoObj = {id:0};macroprocesoId = 0;
      
      $("#tblMacroproceso tbody").prepend(
         "<tr>" +
            "<td>"+"<input type='text' id='inputNombreMacroproceso' class='form-control'>"+"</td>" +
            "<td>...</td>" +
            "<td><label>*Automático</label></td>" +
            "<td>...</td>" +
         "</tr>");

      $("#btnVolverPrincipalMacroproceso").hide();$("#btnVolverMacroproceso").show();$("#btnNuevoMacroproceso").hide();
      $("#btnGuardarMacroproceso").show();$("#btnEliminarMacroproceso").hide();

      banderaEdicionMacroproceso = true;
   }else{
      alert("Guarde primero.");
   }
}

function guardarMacroproceso(){
   var campoVacio = true;

   var nombre = $("#inputNombreMacroproceso").val();

   if(nombre.length == 0){
      campoVacio = false;
   }

   if(campoVacio){
      var dataParam={
         id:macroprocesoId,nombre:nombre,empresaId:parseInt(getSession("gestopcompanyid"))
      };

      callAjaxPost(URL+'/mdf/macroproceso/save',dataParam,function(data){
         switch(data.CODE_RESPONSE){
            case "05":
               $("#modalMacroproceso").modal("hide");

               mensajeUx = "<label>El registro del macroproceso fue guardado con éxito.</label>";
               mensajesUx(mensajeUx,1,"","ActualizarMacroproceso");

               $("#modalMensajeUxActualizarMacroproceso").on("hidden.bs.modal",function(){
                  $("#modalMacroproceso").modal("show");
                  cargarMacroproceso();
               });

               break;

            default:
               console.log("Ocurrió un error al guardar el macroproceso!");
         }
      });
   }else{
      $("#modalMacroproceso").modal("hide");
      mensajeUx = "<label>Debe completar todos los campos activos.</label>";
      mensajesUx(mensajeUx,2,"","ValidacionMacroproceso");

      $("#modalMensajeUxValidacionMacroproceso").on("hidden.bs.modal",function(){
         $("#modalMacroproceso").modal("show");
      });
   }
}

function eliminarMacroproceso(){
   $("#modalMacroproceso").modal("hide");

   if(macroprocesoObj.numSedesAsociadas == 0 && macroprocesoObj.numProcesosAsociados == 0){
      mensajeUx = "<label>¿Está seguro de eliminar el registro del macroproceso seleccionado?</label>";
      mensajesUx(mensajeUx,3,"","ConfMacroproceso");

      $("#btnDevolverValorConfMacroproceso").on("click",function(){
         var dataParam={
            id:macroprocesoId
         };

         callAjaxPost(URL+'/mdf/macroproceso/delete',dataParam,function(data){
            switch(data.CODE_RESPONSE){
               case "05":
                  mensajeUx = "<label>El registro del macroproceso seleccionado se ha eliminado correctamente.</label>";
                  mensajesUx(mensajeUx,1,"","ActualizarMacroproceso");

                  $("#modalMensajeUxActualizarMacroproceso").on("hidden.bs.modal",function(){
                     $("#modalMacroproceso").modal("show");
                     cargarMacroproceso();
                  });
                    
                  break;

               default:
                  alert("Ocurrió un error al eliminar al macroproceso!");
            }
         });
      });

      $("#btnRegresarPrevioConfMacroproceso").on("click",function(){
         $("#modalMacroproceso").modal("show");
      });
   }else{
      mensajeUx = "<label>No puede eliminarse el macroproceso seleccionado porque tiene " +
         getSession("gestopdivision")+" y/o proceso(s) asociado(s).</label>";
      mensajesUx(mensajeUx,2,"","ValidacionMacroproceso");

      $("#modalMensajeUxValidacionMacroproceso").on("hidden.bs.modal",function(){
         $("#modalMacroproceso").modal("show");
      }); 
   }
}
