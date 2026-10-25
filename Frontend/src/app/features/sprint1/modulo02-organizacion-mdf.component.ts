import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

@Component({
  selector: 'msst-modulo02-organizacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Encabezado Corporativo del Módulo 02 -->
    <div class="panel panel-primary" style="margin-bottom: 16px; border-color: #004B87;">
      <div class="panel-heading" style="background-color: #004B87; color: #fff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 class="panel-title" style="font-size: 16px; font-weight: bold;">
            <i class="fa fa-sitemap"></i> Organización Corporativa, Mapa de Procesos (MDF), Puestos y Solicitudes
          </h3>
          <div style="font-size: 11.5px; color: #cce0ff; margin-top: 3px;">
            OneSST Enterprise &bull; Gestión de Sedes Operativas, Despliegue Funcional de Procesos y Perfiles de Puesto
          </div>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevaArea()">
            <i class="fa fa-plus-circle"></i> + Nueva Unidad / Área
          </button>
          <button class="btn btn-xs btn-info" (click)="abrirModalNuevoMdf()">
            <i class="fa fa-code-fork"></i> + Nuevo Nodo MDF
          </button>
          <button class="btn btn-xs btn-warning" (click)="abrirModalNuevoPuesto()">
            <i class="fa fa-id-card"></i> + Nuevo Puesto
          </button>
          <button class="btn btn-xs btn-default" (click)="cargarEstructuraOrganizacional()">
            <i class="fa fa-refresh"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Barra de Sub-pestañas del Módulo 02 -->
      <div class="panel-body" style="background: #f4f7fa; padding: 10px 15px; border-bottom: 1px solid #dce4ec; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'EMPRESA' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('EMPRESA')">
            <i class="fa fa-building"></i> 1. Empresas, Unidades, Divisiones y Áreas
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'MDF' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('MDF')">
            <i class="fa fa-code-fork"></i> 2. Mapa de Procesos (MDF)
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'PUESTOS' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('PUESTOS')">
            <i class="fa fa-id-card"></i> 3. Puestos de Trabajo y Solicitudes
          </button>
        </div>

        <div style="font-size: 12px; color: #004B87;">
          <i class="fa fa-industry"></i> Holding: <strong>{{ empresaActual().name }} (RUC: {{ empresaActual().ruc }})</strong>
          @if (mensajeExito()) {
            <span class="label label-success" style="margin-left: 8px; font-size: 11px;">
              <i class="fa fa-check"></i> {{ mensajeExito() }}
            </span>
          }
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PESTAÑA 1: EMPRESAS, UNIDADES, DIVISIONES Y ÁREAS          -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'EMPRESA') {
      <div class="row" style="margin-bottom: 15px;">
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #004B87; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">EMPRESA MATRIZ</div>
            <div style="font-size:17px; font-weight:bold; color:#004B87; margin-top:3px;">{{ empresaActual().name }}</div>
            <div style="font-size:11px; color:#28a745;">RUC: {{ empresaActual().ruc }} | Cód: {{ empresaActual().codigo }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #28a745; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">UNIDADES / PLANTAS OPERATIVAS</div>
            <div style="font-size:22px; font-weight:bold; color:#28a745;">{{ unidades().length }} Unidades</div>
            <div style="font-size:11px; color:#666;">Sedes Industriales Activas</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #17a2b8; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">DIVISIONES Y GERENCIAS</div>
            <div style="font-size:22px; font-weight:bold; color:#17a2b8;">{{ divisiones().length }} Divisiones</div>
            <div style="font-size:11px; color:#666;">Estructura Corporativa</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #ffc107; box-shadow:0 1px 3px rgba(0,0,0,.08); display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:11px; color:#666;">ÁREAS REGISTRADAS ({{ areas().length }})</div>
            <button class="btn btn-sm btn-primary" style="margin-top:6px;" (click)="abrirModalNuevaArea()">
              <i class="fa fa-plus-circle"></i> Registrar Unidad / Área
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Unidades Operativas -->
        <div class="col-md-4">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-map-marker"></i> Unidades Operativas</h4>
              <button title="Actualizar listado" class="btn btn-xs btn-default" (click)="cargarEstructuraOrganizacional()">
                <i class="fa fa-refresh"></i>
              </button>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                <thead>
                  <tr style="background:#f0f4f8;">
                    <th>ID</th>
                    <th>Nombre Unidad / Planta</th>
                    <th>Ubicación / Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of unidades(); track u['id']) {
                    <tr>
                      <td><strong>#{{ u['id'] }}</strong></td>
                      <td><strong>{{ u['nombre'] }}</strong></td>
                      <td>{{ u['direccion'] }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Divisiones -->
        <div class="col-md-4">
          <div class="panel panel-info">
            <div class="panel-heading">
              <h4 class="panel-title"><i class="fa fa-th-large"></i> Divisiones y Gerencias</h4>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                <thead>
                  <tr style="background:#f0f4f8;">
                    <th>ID</th>
                    <th>División / Gerencia</th>
                    <th>Unidad ID</th>
                  </tr>
                </thead>
                <tbody>
                  @for (d of divisiones(); track d['id']) {
                    <tr>
                      <td><strong>#{{ d['id'] }}</strong></td>
                      <td><strong>{{ d['nombre'] }}</strong></td>
                      <td><span class="label label-primary">Unidad #{{ d['idUnidad'] }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Áreas -->
        <div class="col-md-4">
          <div class="panel panel-success">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-cubes"></i> Áreas Operativas</h4>
              <button class="btn btn-xs btn-success" (click)="abrirModalNuevaArea()">
                <i class="fa fa-plus"></i> Nueva Área
              </button>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                <thead>
                  <tr style="background:#f0f4f8;">
                    <th>ID</th>
                    <th>Nombre del Área</th>
                    <th>Unidad</th>
                    <th>División</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of areas(); track a['id']) {
                    <tr>
                      <td><strong>#{{ a['id'] }}</strong></td>
                      <td><strong>{{ a['nombre'] }}</strong></td>
                      <td>U-{{ a['idUnidad'] }}</td>
                      <td>D-{{ a['idDivision'] }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- PESTAÑA 2: DESPLIEGUE ORGANIZACIONAL MDF                       -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'MDF') {
      <div class="row">
        <!-- Árbol Jerárquico de Procesos -> Actividades -> Tareas -> Pasos -->
        <div class="col-md-4">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-tree"></i> Árbol Jerárquico MDF (4 Niveles)</h4>
              <button class="btn btn-xs btn-success" (click)="abrirModalNuevoMdf()">
                <i class="fa fa-plus"></i> Agregar Nodo
              </button>
            </div>
            <div class="panel-body" style="max-height: 500px; overflow-y: auto;">
              <div style="font-size:12px; margin-bottom:10px; color:#555;">
                Jerarquía normativa Ley 29783 / ISO 45001 vinculada a las Matrices IPERC:
              </div>
              <ul class="list-group" style="margin-bottom:0; font-size:12px;">
                @for (item of mdfLista(); track item['id']) {
                  <li
                    class="list-group-item efectoLink"
                    [ngClass]="{ 'list-group-item-info': mdfSeleccionado()['id'] === item['id'] }"
                    (click)="mdfSeleccionado.set(item)"
                    style="cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <strong style="color:#004B87;"><i class="fa fa-folder-open"></i> {{ item['proceso'] }}</strong>
                      <span class="label" [ngClass]="item['tipoActividad'] === 'RUTINARIA' ? 'label-success' : 'label-warning'">
                        {{ item['tipoActividad'] }}
                      </span>
                    </div>
                    <div style="padding-left:14px; margin-top:4px; color:#333;">
                      <i class="fa fa-angle-right"></i> <strong>Act:</strong> {{ item['actividad'] }}
                    </div>
                    <div style="padding-left:28px; color:#555;">
                      <i class="fa fa-angle-double-right"></i> <strong>Tarea:</strong> {{ item['tarea'] }}
                    </div>
                    <div style="padding-left:42px; color:#777; font-size:11px;">
                      <i class="fa fa-check-circle-o"></i> <strong>Paso:</strong> {{ item['paso'] }}
                    </div>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- Tabla Maestra de Despliegue MDF -->
        <div class="col-md-8">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title">
                <i class="fa fa-table"></i> Matriz de Despliegue Funcional MDF
              </h4>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-xs btn-success" (click)="abrirModalNuevoMdf()">
                  <i class="fa fa-plus-circle"></i> Nuevo Registro MDF
                </button>
              </div>
            </div>
            <div class="panel-body">
              <div class="row" style="margin-bottom:10px;">
                <div class="col-md-8">
                  <input
                    type="text"
                    class="form-control input-sm"
                    placeholder="Filtrar por proceso, actividad, tarea, paso o puesto de trabajo..."
                    [(ngModel)]="filtroMdf">
                </div>
                <div class="col-md-4 text-right" style="padding-top:5px; font-size:12px;">
                  Nodos MDF: <strong>{{ mdfFiltrados().length }}</strong>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                  <thead>
                    <tr style="background:#f0f4f8;">
                      <th>Código</th>
                      <th>1. Proceso Operativo</th>
                      <th>2. Actividad</th>
                      <th>3. Tarea</th>
                      <th>4. Paso Crítico</th>
                      <th>Tipo</th>
                      <th>Área / Puesto</th>
                      <th>IPERC</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (m of mdfFiltrados(); track m['id']) {
                      <tr [ngClass]="{ 'info': mdfSeleccionado()['id'] === m['id'] }" (click)="mdfSeleccionado.set(m)">
                        <td><code>{{ m['codigo'] }}</code></td>
                        <td><strong>{{ m['proceso'] }}</strong></td>
                        <td>{{ m['actividad'] }}</td>
                        <td>{{ m['tarea'] }}</td>
                        <td>{{ m['paso'] }}</td>
                        <td>
                          <span class="label" [ngClass]="m['tipoActividad'] === 'RUTINARIA' ? 'label-primary' : 'label-warning'">
                            {{ m['tipoActividad'] }}
                          </span>
                        </td>
                        <td>{{ m['area'] }} / <strong>{{ m['puesto'] }}</strong></td>
                        <td><span class="label label-success">{{ m['codigoIperc'] }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- PESTAÑA 3: PUESTOS DE TRABAJO Y BANDEJA DE SOLICITUDES                    -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'PUESTOS') {
      <div class="row">
        <!-- Puestos de Trabajo y Asignación de EPP/Riesgos -->
        <div class="col-md-7">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-hard-hat"></i> Puestos de Trabajo y Recursos SST</h4>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-xs btn-success" (click)="abrirModalNuevoPuesto()">
                  <i class="fa fa-plus"></i> Nuevo Puesto
                </button>
              </div>
            </div>
            <div class="panel-body">
              <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                  <thead>
                    <tr style="background:#f0f4f8;">
                      <th>ID</th>
                      <th>Puesto de Trabajo</th>
                      <th>Descripción / Función</th>
                      <th>Área ID</th>
                      <th>EPP Obligatorios Asignados</th>
                      <th>Perfil EMO</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of puestos(); track p['id']) {
                      <tr>
                        <td><strong>#{{ p['id'] }}</strong></td>
                        <td><strong>{{ p['nombre'] }}</strong></td>
                        <td>{{ p['descripcion'] }}</td>
                        <td><span class="badge">Área #{{ p['idArea'] }}</span></td>
                        <td>
                          <span class="label label-info" style="display:inline-block; margin:1px;">
                            {{ p['eppAsignado'] || 'Casco ANSI Z89.1, Lentes Z87.1, Botín Dieléctrico, Arnés' }}
                          </span>
                        </td>
                        <td><span class="label label-success">{{ p['perfilEmo'] || 'ALTURA + POLVO' }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Bandeja de Solicitudes Organizacionales -->
        <div class="col-md-5">
          <div class="panel panel-warning">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-inbox"></i> Bandeja de Solicitudes Organizacionales</h4>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped" style="font-size:12px;">
                <thead>
                  <tr style="background:#fcf8e3;">
                    <th>Código</th>
                    <th>Tipo Solicitud</th>
                    <th>Detalle / Solicitante</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (s of solicitudes(); track s['id']) {
                    <tr>
                      <td><strong>{{ s['codigo'] }}</strong></td>
                      <td>{{ s['tipo'] }}</td>
                      <td>
                        <div><strong>{{ s['detalle'] }}</strong></div>
                        <small class="text-muted">{{ s['solicitante'] }} ({{ s['fecha'] }})</small>
                      </td>
                      <td>
                        <span class="label" [ngClass]="s['estado'] === 'APROBADO' ? 'label-success' : 'label-warning'">
                          {{ s['estado'] }}
                        </span>
                      </td>
                      <td>
                        @if (s['estado'] !== 'APROBADO') {
                          <button class="btn btn-xs btn-success" (click)="aprobarSolicitud(s)">
                            <i class="fa fa-check"></i> Aprobar
                          </button>
                        } @else {
                          <span class="text-success"><i class="fa fa-check-circle"></i> OK</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL: REGISTRAR NUEVA UNIDAD / ÁREA                       -->
    <!-- ========================================================================= -->
    @if (modalAreaAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:520px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-cubes"></i> Registrar Nueva Área / Unidad Operativa</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalAreaAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label>Nombre del Área Operativa:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formArea.nombre" placeholder="Ej. Trituración Primaria y Fajas">
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Unidad / Planta:</label>
                <select class="form-control input-sm" [(ngModel)]="formArea.idUnidad">
                  @for (u of unidades(); track u['id']) {
                    <option [ngValue]="u['id']">{{ u['nombre'] }}</option>
                  }
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>División / Gerencia:</label>
                <select class="form-control input-sm" [(ngModel)]="formArea.idDivision">
                  @for (d of divisiones(); track d['id']) {
                    <option [ngValue]="d['id']">{{ d['nombre'] }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalAreaAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarArea()">
              <i class="fa fa-save"></i> Guardar Área
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL: REGISTRAR NUEVO NODO MDF                                           -->
    <!-- ========================================================================= -->
    @if (modalMdfAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:620px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-code-fork"></i> Registrar Despliegue MDF (Proceso -> Actividad -> Tarea -> Paso)</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalMdfAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-6 form-group">
                <label>1. Proceso Operativo:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.proceso" placeholder="Ej. Molienda de Crudo y Clinker">
              </div>
              <div class="col-md-6 form-group">
                <label>2. Actividad:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.actividad" placeholder="Ej. Mantenimiento Mecánico de Molino">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>3. Tarea Específica:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.tarea" placeholder="Ej. Cambio de blindajes internos">
              </div>
              <div class="col-md-6 form-group">
                <label>4. Paso Crítico:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.paso" placeholder="Ej. Bloqueo LOTO e ingreso a espacio confinado">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>Tipo de Actividad:</label>
                <select class="form-control input-sm" [(ngModel)]="formMdf.tipoActividad">
                  <option value="RUTINARIA">RUTINARIA</option>
                  <option value="NO RUTINARIA">NO RUTINARIA</option>
                  <option value="EMERGENCIA">EMERGENCIA</option>
                </select>
              </div>
              <div class="col-md-4 form-group">
                <label>Área Asociada:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.area" placeholder="Mantenimiento Planta">
              </div>
              <div class="col-md-4 form-group">
                <label>Puesto de Trabajo:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formMdf.puesto" placeholder="Técnico Mecánico">
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalMdfAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarMdf()">
              <i class="fa fa-save"></i> Guardar Registro MDF
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL: REGISTRAR NUEVO PUESTO DE TRABAJO                                  -->
    <!-- ========================================================================= -->
    @if (modalPuestoAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:560px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-id-card"></i> Registrar Puesto de Trabajo y Recursos EPP</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalPuestoAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label>Nombre del Puesto de Trabajo:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formPuesto.nombre" placeholder="Ej. Operador de Grúa Telescópica">
            </div>
            <div class="form-group">
              <label>Descripción de Funciones y Riesgos Críticos:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formPuesto.descripcion" placeholder="Izaje de cargas críticas en planta industrial">
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Área Asignada:</label>
                <select class="form-control input-sm" [(ngModel)]="formPuesto.idArea">
                  @for (a of areas(); track a['id']) {
                    <option [ngValue]="a['id']">{{ a['nombre'] }}</option>
                  }
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Perfil Médico Ocupacional (EMO):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formPuesto.perfilEmo" placeholder="ALTURA + PSICOSENSOMÉTRICO">
              </div>
            </div>
            <div class="form-group">
              <label>EPP Obligatorios por Puesto:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formPuesto.eppAsignado" placeholder="Casco c/barbiquejo, Lentes Z87.1, Arnés 4 argollas, Guantes kevlar">
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalPuestoAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarPuesto()">
              <i class="fa fa-save"></i> Guardar Puesto
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class Modulo02OrganizacionMdfComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly tabActiva = signal<'EMPRESA' | 'MDF' | 'PUESTOS'>('EMPRESA');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.tabActiva.set(t as never);

    }

  });
  readonly mensajeExito = signal<string>('');

  readonly empresaActual = signal({
    idCompany: 773,
    name: 'HOLCIM PERU S.A.',
    ruc: '20100128218',
    codigo: 'HOLCIM01',
    color: '#004B87'
  });

  readonly unidades = signal<Record<string, any>[]>([
    { id: 1, nombre: 'Planta Condorcocha (Tarma - Junín)', direccion: 'Carretera Central Km 198, La Unión Leticia' },
    { id: 2, nombre: 'Planta Huachipa (Lima Este)', direccion: 'Av. Las Torres Mz. D Lote 4, Lurigancho-Chosica' },
    { id: 3, nombre: 'Terminal Portuario & Concretera Callao', direccion: 'Av. Néstor Gambetta Km 8.5, Callao' }
  ]);

  readonly divisiones = signal<Record<string, any>[]>([
    { id: 1, nombre: 'Gerencia de Operaciones Industriales y Clinker', idUnidad: 1 },
    { id: 2, nombre: 'Gerencia de Mantenimiento Mecánico y Eléctrico', idUnidad: 1 },
    { id: 3, nombre: 'Gerencia Corporativa HSE & Sostenibilidad', idUnidad: 2 },
    { id: 4, nombre: 'División de Proyectos CAPEX y Contratistas', idUnidad: 1 }
  ]);

  readonly areas = signal<Record<string, any>[]>([
    { id: 1, nombre: 'Horno Rotatorio Waelz y Precalentador', idUnidad: 1, idDivision: 1 },
    { id: 2, nombre: 'Molienda de Crudo, Carbón y Cemento', idUnidad: 1, idDivision: 1 },
    { id: 3, nombre: 'Subestación Eléctrica 60kV y Sala CCM', idUnidad: 1, idDivision: 2 },
    { id: 4, nombre: 'Cantera y Trituración Primaria', idUnidad: 1, idDivision: 1 },
    { id: 5, nombre: 'Despacho de Bolsas y Granel (Silos)', idUnidad: 2, idDivision: 3 }
  ]);

  // Estado MDF
  filtroMdf = '';
  readonly mdfLista = signal<Record<string, any>[]>([
    {
      id: 1,
      codigo: 'MDF-001',
      proceso: 'Producción de Clinker (Horno Waelz)',
      actividad: 'Parada Mayor de Horno Rotatorio',
      tarea: 'Demolición e instalación de ladrillos refractarios',
      paso: 'Aplicación de bloqueo LOTO multipunto y ventilación forzada',
      tipoActividad: 'NO RUTINARIA',
      area: 'Horno Rotatorio Waelz',
      puesto: 'Supervisor Mecánico / Refractarista',
      codigoIperc: 'IPERC-2026-001'
    },
    {
      id: 2,
      codigo: 'MDF-002',
      proceso: 'Mantenimiento Eléctrico de Planta',
      actividad: 'Mantenimiento Preventivo en Subestación 60kV',
      tarea: 'Pruebas de aislamiento y termografía en celdas de media tensión',
      paso: 'Verificación de ausencia de tensión (5 Reglas de Oro)',
      tipoActividad: 'RUTINARIA',
      area: 'Subestación Eléctrica 60kV',
      puesto: 'Técnico Electricista Liniero',
      codigoIperc: 'IPERC-2026-002'
    },
    {
      id: 3,
      codigo: 'MDF-003',
      proceso: 'Proyectos CAPEX y Montaje Estructural',
      actividad: 'Montaje de Estructura Metálica en Silo de Clinker',
      tarea: 'Izaje de vigas principales con grúa telescópica de 120 Ton',
      paso: 'Delimitación de radio de giro, plan de izaje crítico y anemómetro',
      tipoActividad: 'NO RUTINARIA',
      area: 'Despacho y Silos',
      puesto: 'Rigger Acreditado / Soldador 6G',
      codigoIperc: 'IPERC-2026-003'
    },
    {
      id: 4,
      codigo: 'MDF-004',
      proceso: 'Molienda y Transporte por Fajas',
      actividad: 'Inspección y Cambio de Polines en Faja Transportadora',
      tarea: 'Alineamiento de banda y ajuste de guardas de seguridad',
      paso: 'Desenergización de motor principal y bloqueo de cuerda pull-cord',
      tipoActividad: 'RUTINARIA',
      area: 'Cantera y Trituración Primaria',
      puesto: 'Operario de Mantenimiento Mecánico',
      codigoIperc: 'IPERC-2026-004'
    }
  ]);
  readonly mdfSeleccionado = signal<Record<string, any>>(this.mdfLista()[0]);

  // Estado Puestos y Solicitudes
  readonly puestos = signal<Record<string, any>[]>([
    { id: 1, nombre: 'Supervisor SST de Campo', descripcion: 'Supervisión HSE de trabajos de alto riesgo (PETAR)', idArea: 1, eppAsignado: 'Casco ANSI Z89.1, Lentes Z87.1, Respirador Silicona, Botín Dieléctrico', perfilEmo: 'ALTURA + ESPACIO CONFINADO' },
    { id: 2, nombre: 'Soldador Homologado 6G', descripcion: 'Soldadura estructural en caliente y oxicorte en planta', idArea: 2, eppAsignado: 'Careta facial soldador, Mandil cuero cromo, Escarpines, Respirador humos', perfilEmo: 'ALTURA + HUMOS METÁLICOS' },
    { id: 3, nombre: 'Técnico Electricista de Media Tensión', descripcion: 'Maniobras en subestación y tableros CCM', idArea: 3, eppAsignado: 'Traje antiflama 40 cal/cm2, Guantes dieléctricos Clase 4, Banqueta aislante', perfilEmo: 'ELÉCTRICO + ALTURA' },
    { id: 4, nombre: 'Operador de Grúa / Rigger', descripcion: 'Maniobras de izaje crítico de cargas pesadas', idArea: 5, eppAsignado: 'Casco con barbiquejo, Chaleco reflectivo, Radio trunking, Guantes badana', perfilEmo: 'PSICOSENSOMÉTRICO + ALTURA' }
  ]);

  readonly solicitudes = signal<Record<string, any>[]>([
    { id: 1, codigo: 'SOL-2026-014', tipo: 'CREACIÓN PUESTO', detalle: 'Alta de Puesto: Inspector QA/QC Refractarios', solicitante: 'GRUPO ELIAS-29 S.A.C', fecha: '18/03/2026', estado: 'PENDIENTE' },
    { id: 2, codigo: 'SOL-2026-015', tipo: 'HOMOLOGACIÓN EPP', detalle: 'Asignación de Arnés Kevlar Ignífugo para Soldadores', solicitante: 'Gerencia Mantenimiento', fecha: '19/03/2026', estado: 'APROBADO' },
    { id: 3, codigo: 'SOL-2026-016', tipo: 'NUEVA TAREA MDF', detalle: 'Inclusión de Limpieza Criogénica en Tableros CCM', solicitante: 'Ing. Carlos Mendoza', fecha: '20/03/2026', estado: 'PENDIENTE' }
  ]);

  // Modales
  readonly modalAreaAbierto = signal<boolean>(false);
  formArea = { nombre: '', idUnidad: 1, idDivision: 1 };

  readonly modalMdfAbierto = signal<boolean>(false);
  formMdf = {
    proceso: '',
    actividad: '',
    tarea: '',
    paso: '',
    tipoActividad: 'RUTINARIA',
    area: 'Horno Rotatorio Waelz',
    puesto: 'Supervisor SST de Campo'
  };

  readonly modalPuestoAbierto = signal<boolean>(false);
  formPuesto = {
    nombre: '',
    descripcion: '',
    idArea: 1,
    perfilEmo: 'ALTURA ESTRUCTURAL + ESPACIO CONFINADO',
    eppAsignado: 'Casco ANSI Z89.1, Lentes Z87.1, Arnés cuerpo completo, Botín punta acero'
  };

  // Visor 1:1
  readonly visor1a1Abierto = signal<boolean>(false);
  readonly visorArchivo = signal<string>('empresa.html');
  readonly visorTitulo = signal<string>('Gestión de Empresas');
  readonly visorUrlSegura = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.visorArchivo()}`)
  );

  ngOnInit(): void {
    this.cargarEstructuraOrganizacional();
  }

  mdfFiltrados(): Record<string, any>[] {
    const q = this.filtroMdf.trim().toLowerCase();
    if (!q) return this.mdfLista();
    return this.mdfLista().filter(
      m =>
        String(m['proceso'] || '').toLowerCase().includes(q) ||
        String(m['actividad'] || '').toLowerCase().includes(q) ||
        String(m['tarea'] || '').toLowerCase().includes(q) ||
        String(m['paso'] || '').toLowerCase().includes(q) ||
        String(m['puesto'] || '').toLowerCase().includes(q)
    );
  }

  cargarEstructuraOrganizacional(): void {
    this.api.getEmpresaById(773).subscribe({
      next: (res) => {
        const emp = res?.['empresa'];
        if (emp && emp['name']) {
          this.empresaActual.set({
            idCompany: emp['idCompany'] || 773,
            name: emp['name'],
            ruc: emp['ruc'] || '20100128218',
            codigo: emp['codigo'] || 'HOLCIM01',
            color: emp['color'] || '#004B87'
          });
        }
      }
    });

    this.api.callAjaxPost('/unidad/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['nombre']) {
          this.unidades.set(list);
        }
      }
    });

    this.api.callAjaxPost('/division/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['nombre']) {
          this.divisiones.set(list);
        }
      }
    });

    this.api.callAjaxPost('/area/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['nombre']) {
          this.areas.set(list);
        }
      }
    });

    this.api.callAjaxPost('/mdf/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['proceso']) {
          this.mdfLista.set(list);
          this.mdfSeleccionado.set(list[0]);
        }
      }
    });

    this.api.callAjaxPost('/puesto/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['nombre']) {
          this.puestos.set(list);
        }
      }
    });
  }

  abrirModalNuevaArea(): void {
    this.formArea = { nombre: '', idUnidad: 1, idDivision: 1 };
    this.modalAreaAbierto.set(true);
  }

  guardarArea(): void {
    if (!this.formArea.nombre.trim()) return;
    this.api.callAjaxPost('/area/insert', this.formArea).subscribe({
      next: (res) => {
        const nuevoId = res?.['idGenerado'] || (this.areas().length + 1);
        const item = { id: nuevoId, ...this.formArea };
        this.areas.update(arr => [...arr, item]);
        this.modalAreaAbierto.set(false);
        this.notificarExito(`Área "${item.nombre}" registrada en OneSST (#${nuevoId})`);
      },
      error: () => {
        const item = { id: this.areas().length + 1, ...this.formArea };
        this.areas.update(arr => [...arr, item]);
        this.modalAreaAbierto.set(false);
        this.notificarExito(`Área "${item.nombre}" agregada`);
      }
    });
  }

  abrirModalNuevoMdf(): void {
    this.formMdf = {
      proceso: '',
      actividad: '',
      tarea: '',
      paso: '',
      tipoActividad: 'RUTINARIA',
      area: 'Horno Rotatorio Waelz',
      puesto: 'Supervisor SST de Campo'
    };
    this.modalMdfAbierto.set(true);
  }

  guardarMdf(): void {
    if (!this.formMdf.proceso.trim()) return;
    this.api.callAjaxPost('/mdf/insert', this.formMdf).subscribe({
      next: (res) => {
        const nextNum = this.mdfLista().length + 1;
        const nuevo = {
          id: res?.['idGenerado'] || nextNum,
          codigo: `MDF-00${nextNum}`,
          ...this.formMdf,
          codigoIperc: `IPERC-2026-00${nextNum}`
        };
        this.mdfLista.update(arr => [nuevo, ...arr]);
        this.mdfSeleccionado.set(nuevo);
        this.modalMdfAbierto.set(false);
        this.notificarExito(`Nodo MDF "${nuevo.codigo}" creado y vinculado a IPERC`);
      },
      error: () => {
        const nextNum = this.mdfLista().length + 1;
        const nuevo = {
          id: nextNum,
          codigo: `MDF-00${nextNum}`,
          ...this.formMdf,
          codigoIperc: `IPERC-2026-00${nextNum}`
        };
        this.mdfLista.update(arr => [nuevo, ...arr]);
        this.modalMdfAbierto.set(false);
        this.notificarExito(`Nodo MDF "${nuevo.codigo}" agregado`);
      }
    });
  }

  abrirModalNuevoPuesto(): void {
    this.formPuesto = {
      nombre: '',
      descripcion: '',
      idArea: 1,
      perfilEmo: 'ALTURA ESTRUCTURAL + ESPACIO CONFINADO',
      eppAsignado: 'Casco ANSI Z89.1, Lentes Z87.1, Arnés cuerpo completo, Botín punta acero'
    };
    this.modalPuestoAbierto.set(true);
  }

  guardarPuesto(): void {
    if (!this.formPuesto.nombre.trim()) return;
    this.api.callAjaxPost('/puesto/insert', this.formPuesto).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (this.puestos().length + 1);
        const item = { id: idGen, ...this.formPuesto };
        this.puestos.update(arr => [...arr, item]);
        this.modalPuestoAbierto.set(false);
        this.notificarExito(`Puesto "${item.nombre}" registrado en OneSST`);
      },
      error: () => {
        const item = { id: this.puestos().length + 1, ...this.formPuesto };
        this.puestos.update(arr => [...arr, item]);
        this.modalPuestoAbierto.set(false);
        this.notificarExito(`Puesto "${item.nombre}" registrado`);
      }
    });
  }

  aprobarSolicitud(sol: Record<string, any>): void {
    this.api.callAjaxPost('/empresa/solicitud/aprobar', { idSolicitud: sol['id'] }).subscribe({
      next: () => {
        this.solicitudes.update(arr =>
          arr.map(x => (x['id'] === sol['id'] ? { ...x, estado: 'APROBADO' } : x))
        );
        this.notificarExito(`Solicitud ${sol['codigo']} aprobada satisfactoriamente`);
      },
      error: () => {
        this.solicitudes.update(arr =>
          arr.map(x => (x['id'] === sol['id'] ? { ...x, estado: 'APROBADO' } : x))
        );
        this.notificarExito(`Solicitud ${sol['codigo']} aprobada`);
      }
    });
  }

  abrirVisor1a1(archivo: string, titulo: string): void {
    this.visorArchivo.set(archivo);
    this.visorTitulo.set(titulo);
    this.visor1a1Abierto.set(true);
  }

  private notificarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
