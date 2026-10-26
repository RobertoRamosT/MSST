import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

@Component({
  selector: 'msst-modulo02-organizacion',
  standalone: true,
  imports: [QueryPagesComponent,WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

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

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo02OrganizacionMdfComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

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

  readonly empresaActual=signal({idCompany:0,name:'',ruc:'',codigo:'',color:''});

  readonly unidades = signal<Record<string, any>[]>([]);

  readonly divisiones = signal<Record<string, any>[]>([]);

  readonly areas = signal<Record<string, any>[]>([]);

  // Estado MDF
  filtroMdf = '';
  readonly mdfLista = signal<Record<string, any>[]>([]);
  readonly mdfSeleccionado = signal<Record<string, any>>({});

  // Estado Puestos y Solicitudes
  readonly puestos = signal<Record<string, any>[]>([]);

  readonly solicitudes = signal<Record<string, any>[]>([]);

  // Modales
  readonly modalAreaAbierto = signal<boolean>(false);
  formArea = { nombre: '', idUnidad: 0, idDivision: 0 };

  readonly modalMdfAbierto = signal<boolean>(false);
  formMdf = {
    proceso: '',
    actividad: '',
    tarea: '',
    paso: '',
    tipoActividad: '',
    area: '',
    puesto: ''
  };

  readonly modalPuestoAbierto = signal<boolean>(false);
  formPuesto = {
    nombre: '',
    descripcion: '',
    idArea: 0,
    perfilEmo: '',
    eppAsignado: ''
  };

  // Visor 1:1

  readonly pageRoutes=['/area/lista', '/division/lista', '/mdf/lista', '/puesto/lista', '/unidad/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
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
    this.api.getEmpresaById().subscribe({
      next: (res) => {
        const emp = res?.['empresa'];
        if (emp && emp['name']) {
          this.empresaActual.set({
            idCompany: emp['idCompany'],
            name: emp['name'],
            ruc: emp['ruc'] ?? '',
            codigo: emp['codigo'] ?? '',
            color: emp['color'] || '#004B87'
          });
        }
      }
    });

    this.api.callAjaxPost('/unidad/lista', { ...{} }).subscribe({next:(response)=>{try{this.unidades.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/division/lista', { ...{} }).subscribe({next:(response)=>{try{this.divisiones.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/area/lista', { ...{} }).subscribe({next:(response)=>{try{this.areas.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/mdf/lista', { ...{} }).subscribe({next:(response)=>{try{this.mdfLista.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/puesto/lista', { ...{} }).subscribe({next:(response)=>{try{this.puestos.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  abrirModalNuevaArea(): void {
    this.formArea = { nombre: '', idUnidad: 0, idDivision: 0 };
    this.modalAreaAbierto.set(true);
  }

  guardarArea(): void {
    if (!this.formArea.nombre.trim()) return;
    this.api.callAjaxPost('/area/insert', this.formArea).subscribe({next:()=>{this.ngOnInit();this.modalAreaAbierto.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  abrirModalNuevoMdf(): void {
    this.formMdf = {
      proceso: '',
      actividad: '',
      tarea: '',
      paso: '',
      tipoActividad: '',
      area: '',
      puesto: ''
    };
    this.modalMdfAbierto.set(true);
  }

  guardarMdf(): void {
    if (!this.formMdf.proceso.trim()) return;
    this.api.callAjaxPost('/mdf/insert', this.formMdf).subscribe({next:()=>{this.ngOnInit();this.modalMdfAbierto.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  abrirModalNuevoPuesto(): void {
    this.formPuesto = {
      nombre: '',
      descripcion: '',
      idArea: 0,
      perfilEmo: '',
      eppAsignado: ''
    };
    this.modalPuestoAbierto.set(true);
  }

  guardarPuesto(): void {
    if (!this.formPuesto.nombre.trim()) return;
    this.api.callAjaxPost('/puesto/insert', this.formPuesto).subscribe({next:()=>{this.ngOnInit();this.modalPuestoAbierto.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  aprobarSolicitud(sol: Record<string, any>): void {this.workflowSelectionOpen.set(true);}


  private notificarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
