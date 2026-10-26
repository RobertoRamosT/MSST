import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface FilaIpercItem {
  id: number;
  codigo: string | null;
  version: string;
  proceso: string | null;
  tarea: string | null;
  tipoActividad: string | null;
  peligro: string | null;
  riesgo: string | null;
  probabilidadInicial: number | null;
  severidadInicial: number | null;
  riesgoInicial: string | null;
  medidasControl: string | null;
  riesgoResidual: string | null;
  estado: string | null;
}

export interface InspeccionItem {
  id: number;
  modulo: 'INSPECCION_V1' | 'INSPECCION_V2' | null;
  tipo: 'PLANEADA' | 'INOPINADA' | 'COMITE_SST' | null;
  area: string | null;
  inspector: string | null;
  fecha: string | null;
  puntaje: number | null;
  criticidad: 'ALTA' | 'MEDIA' | 'BAJA' | null;
  hallazgo: string | null;
  estado: 'ABIERTA' | 'EN_LEVANTAMIENTO' | 'CERRADA' | null;
}

export interface OptActoSubestandarItem {
  id: number;
  tipoRegistro: 'OPT' | 'ACTO_SUBESTANDAR' | 'CONDICION_SUBESTANDAR' | null;
  codigo: string | null;
  fecha: string | null;
  areaUbicacion: string | null;
  puestoTareaObservada: string | null;
  observadorReportante: string | null;
  descripcionHallazgo: string | null;
  retroalimentacionAccion: string | null;
  criticidad: 'ALTA' | 'MEDIA' | 'BAJA' | null;
  estado: 'CORREGIDO_IN_SITU' | 'DERIVADO_PLAN_ACCION' | null;
}

@Component({
  selector: 'msst-modulo06-prevencion',
  standalone: true,
  imports: [WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera del Módulo 06 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-shield"></i>  Gestión Preventiva Operativa — Matriz IPERC, Inspecciones V1/V2, OPT y Actos/Condiciones Subestándar
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalIperc.set(true)">
              <i class="fa fa-plus-circle"></i> + Evaluar Peligro IPERC
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalInspeccion.set(true)">
              <i class="fa fa-search-plus"></i> + Nueva Inspección
            </button>
            <button class="btn btn-xs btn-warning" (click)="abrirModalOptActo('OPT')">
              <i class="fa fa-eye"></i> + Registrar OPT
            </button>
          </div>
        </div>

        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">FILAS EN MATRIZ IPERC VIGENTE</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ matrizIperc().length }} Peligros Evaluados</div>
                <div style="font-size: 11px; color: #888;">Jerarquía de Controles ISO 45001</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">INSPECCIONES V1 / V2 EJECUTADAS</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ inspecciones().length }} Inspecciones</div>
                <div style="font-size: 11px; color: #888;">Promedio Cumplimiento: {{ promedioPuntajeInspeccion() }}%</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">OBSERVACIONES PLANEADAS (OPT)</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ totalOpts() }} OPT Registradas</div>
                <div style="font-size: 11px; color: #888;">Verificación de PETS en Campo</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">ACTOS / CONDICIONES SUBESTÁNDAR</div>
                <div style="font-size: 20px; font-weight: bold; color: #dc3545;">{{ totalActosCondiciones() }} Reportes</div>
                <div style="font-size: 11px; color: #888;">Intervención Preventiva Temprana</div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-sm" [ngClass]="pestana() === 'IPERC' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('IPERC')">
              <i class="fa fa-table"></i> 1. Matriz IPERC Continua y Línea Base
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'INSPECCIONES' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('INSPECCIONES')">
              <i class="fa fa-search-plus"></i> 2. Inspecciones Planeadas e Inopinadas V1 y V2
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'OPT_ACTOS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('OPT_ACTOS')">
              <i class="fa fa-eye"></i> 3. Observaciones Planeadas (OPT) y Actos/Condiciones Subestándar
            </button>
          </div>
        </div>
      </div>

      @if (mensajeAlerta()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ mensajeAlerta() }}
        </div>
      }

      <!-- PESTAÑA 1: MATRIZ IPERC -->
      @if (pestana() === 'IPERC') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-exclamation-triangle"></i> Matriz de Identificación de Peligros, Evaluación de Riesgos y Medidas de Control</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalIperc.set(true)">
              <i class="fa fa-plus-circle"></i> Agregar Fila a Matriz IPERC
            </button>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Filtrar por proceso, tarea, peligro o medida de control..." [(ngModel)]="filtroIperc">
              </div>
              <div class="col-md-3">
                <select class="form-control input-sm" [(ngModel)]="filtroRiesgoInicial">
                  <option value="TODOS">Todos los Niveles de Riesgo Inicial</option>
                  <option value="ALTO">Riesgo Inicial ALTO / CRÍTICO</option>
                  <option value="MEDIO">Riesgo Inicial MEDIO</option>
                  <option value="BAJO">Riesgo Inicial BAJO</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código / Ver.</th>
                    <th>Proceso Operativo</th>
                    <th>Tarea / Actividad</th>
                    <th>Peligro Identificado</th>
                    <th>Riesgo / Consecuencia</th>
                    <th style="text-align:center;">P x S</th>
                    <th>Riesgo Inicial</th>
                    <th>Jerarquía de Controles (Eliminación / Ing. / Admin. / EPP)</th>
                    <th>Riesgo Residual</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of ipercFiltrado(); track row.id) {
                    <tr>
                      <td><strong>{{ row.codigo }}</strong> <span class="badge">{{ row.version }}</span></td>
                      <td>{{ row.proceso }}</td>
                      <td><strong>{{ row.tarea }}</strong> <div style="font-size:10px; color:#666;">{{ row.tipoActividad }}</div></td>
                      <td>{{ row.peligro }}</td>
                      <td>{{ row.riesgo }}</td>
                      <td style="text-align:center;"><code>{{ row.probabilidadInicial }}x{{ row.severidadInicial }}</code></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': (row.riesgoInicial??'').includes('ALTO') || (row.riesgoInicial??'').includes('CRITICO'),
                          'label-warning': (row.riesgoInicial??'').includes('MEDIO'),
                          'label-success': (row.riesgoInicial??'').includes('BAJO')
                        }">{{ row.riesgoInicial }}</span>
                      </td>
                      <td style="font-size: 12px;">{{ row.medidasControl }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': (row.riesgoResidual??'').includes('BAJO'),
                          'label-warning': (row.riesgoResidual??'').includes('MEDIO'),
                          'label-danger': (row.riesgoResidual??'').includes('ALTO')
                        }">{{ row.riesgoResidual }}</span>
                      </td>
                      <td><span class="label label-primary">{{ row.estado }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 2: INSPECCIONES PLANEADAS E INOPINADAS V1 Y V2 -->
      @if (pestana() === 'INSPECCIONES') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-check-square"></i> Registro de Inspecciones Planeadas e Inopinadas de Seguridad V1 y V2</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalInspeccion.set(true)">
              <i class="fa fa-plus-circle"></i> Nueva Inspección SST
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Versión Motor</th>
                    <th>Tipo Inspección</th>
                    <th>Fecha</th>
                    <th>Área / Ubicación Inspeccionada</th>
                    <th>Inspector Responsable</th>
                    <th>Puntaje</th>
                    <th>Criticidad</th>
                    <th>Hallazgo Principal Detectado</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (insp of inspecciones(); track insp.id) {
                    <tr>
                      <td><strong>#{{ insp.id }}</strong></td>
                      <td><span class="label label-default">{{ insp.modulo }}</span></td>
                      <td><strong>{{ insp.tipo }}</strong></td>
                      <td>{{ insp.fecha }}</td>
                      <td>{{ insp.area }}</td>
                      <td>{{ insp.inspector }}</td>
                      <td><strong>{{ insp.puntaje }}%</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': insp.criticidad === 'ALTA',
                          'label-warning': insp.criticidad === 'MEDIA',
                          'label-success': insp.criticidad === 'BAJA'
                        }">{{ insp.criticidad }}</span>
                      </td>
                      <td>{{ insp.hallazgo }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': insp.estado === 'CERRADA',
                          'label-info': insp.estado === 'EN_LEVANTAMIENTO',
                          'label-danger': insp.estado === 'ABIERTA'
                        }">{{ insp.estado }}</span>
                      </td>
                      <td>
                        @if (insp.estado !== 'CERRADA') {
                          <button class="btn btn-xs btn-primary" (click)="cerrarHallazgoInspeccion(insp)">
                            <i class="fa fa-check"></i> Levantar Hallazgo
                          </button>
                        } @else {
                          <span class="text-success"><i class="fa fa-check-circle"></i> Verificado</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 3: OBSERVACIONES PLANEADAS DE TRABAJO (OPT) Y ACTOS/CONDICIONES SUBESTÁNDAR -->
      @if (pestana() === 'OPT_ACTOS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-eye"></i> Observaciones Planeadas de Trabajo (OPT) y Reportes de Actos / Condiciones Subestándar</h4>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-xs btn-warning" (click)="abrirModalOptActo('OPT')">
                <i class="fa fa-plus"></i> Registrar Nueva OPT
              </button>
              <button class="btn btn-xs btn-danger" (click)="abrirModalOptActo('ACTO_SUBESTANDAR')">
                <i class="fa fa-bolt"></i> Reportar Acto / Condición Subestándar
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Área / Ubicación</th>
                    <th>Tarea / Puesto Observado</th>
                    <th>Observador / Reportante</th>
                    <th>Hallazgo o Desviación Detectada</th>
                    <th>Retroalimentación / Medida Inmediata</th>
                    <th>Criticidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of optYActos(); track item.id) {
                    <tr>
                      <td><strong>{{ item.codigo }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-primary': item.tipoRegistro === 'OPT',
                          'label-danger': item.tipoRegistro === 'ACTO_SUBESTANDAR',
                          'label-warning': item.tipoRegistro === 'CONDICION_SUBESTANDAR'
                        }">{{ item.tipoRegistro }}</span>
                      </td>
                      <td>{{ item.fecha }}</td>
                      <td>{{ item.areaUbicacion }}</td>
                      <td><strong>{{ item.puestoTareaObservada }}</strong></td>
                      <td>{{ item.observadorReportante }}</td>
                      <td>{{ item.descripcionHallazgo }}</td>
                      <td>{{ item.retroalimentacionAccion }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': item.criticidad === 'ALTA',
                          'label-warning': item.criticidad === 'MEDIA',
                          'label-success': item.criticidad === 'BAJA'
                        }">{{ item.criticidad }}</span>
                      </td>
                      <td><span class="label label-success">{{ item.estado }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- MODAL AGREGAR FILA A MATRIZ IPERC -->
      @if (mostrarModalIperc()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 680px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-plus-circle"></i> Registrar Peligro y Evaluación de Riesgo en Matriz IPERC</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalIperc.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código Matriz:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoIperc.codigo">
                </div>
                <div class="col-md-4 form-group">
                  <label>Proceso Operativo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoIperc.proceso" placeholder="Ej. Molienda de Crudo">
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo de Actividad:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoIperc.tipoActividad">
                    <option value="Rutinaria">Rutinaria</option>
                    <option value="No Rutinaria">No Rutinaria</option>
                    <option value="Emergencia">Situación de Emergencia</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Tarea / Paso Específico:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoIperc.tarea" placeholder="Ej. Desatoro e inspección interna de chute de transferencia">
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Peligro Identificado (Fuente o Situación):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoIperc.peligro" placeholder="Ej. Energía mecánica acumulada en faja">
                </div>
                <div class="col-md-6 form-group">
                  <label>Riesgo / Evento Peligroso:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoIperc.riesgo" placeholder="Ej. Atrapamiento de extremidades superiores">
                </div>
              </div>
              <div class="row">
                <div class="col-md-3 form-group">
                  <label>Probabilidad (1-5):</label>
                  <input type="number" min="1" max="5" class="form-control input-sm" [(ngModel)]="nuevoIperc.probabilidadInicial">
                </div>
                <div class="col-md-3 form-group">
                  <label>Severidad (1-5):</label>
                  <input type="number" min="1" max="5" class="form-control input-sm" [(ngModel)]="nuevoIperc.severidadInicial">
                </div>
                <div class="col-md-3 form-group">
                  <label>Riesgo Inicial:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoIperc.riesgoInicial">
                    <option value="ALTO (16)">ALTO (Intolerable)</option>
                    <option value="MEDIO (9)">MEDIO (Moderado)</option>
                    <option value="BAJO (4)">BAJO (Tolerable)</option>
                  </select>
                </div>
                <div class="col-md-3 form-group">
                  <label>Riesgo Residual:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoIperc.riesgoResidual">
                    <option value="BAJO (3)">BAJO (Controlado)</option>
                    <option value="MEDIO (6)">MEDIO</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Jerarquía de Controles (Ingeniería / Administrativos / PETAR / EPP):</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevoIperc.medidasControl" placeholder="Ej. Ing: Guardas fijas con enclavamiento; Admin: Bloqueo LOTOTO y PETAR; EPP: Guantes anticorte Nivel 5."></textarea>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalIperc.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoIperc()">
                <i class="fa fa-save"></i> Guardar Fila IPERC
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA INSPECCIÓN -->
      @if (mostrarModalInspeccion()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-search-plus"></i> Registrar Nueva Inspección de Seguridad</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalInspeccion.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Versión Motor:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaInspeccion.modulo">
                    <option value="INSPECCION_V2">INSPECCION_V2 (Checklist Dinámico)</option>
                    <option value="INSPECCION_V1">INSPECCION_V1 (Clásica)</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo de Inspección:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaInspeccion.tipo">
                    <option value="PLANEADA">PLANEADA</option>
                    <option value="INOPINADA">INOPINADA</option>
                    <option value="COMITE_SST">COMITE_SST</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Criticidad Hallazgo:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaInspeccion.criticidad">
                    <option value="ALTA">ALTA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="BAJA">BAJA</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Área / Planta Inspeccionada:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaInspeccion.area">
                </div>
                <div class="col-md-6 form-group">
                  <label>Inspector Responsable:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaInspeccion.inspector">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Puntaje Cumplimiento (%):</label>
                  <input type="number" min="0" max="100" class="form-control input-sm" [(ngModel)]="nuevaInspeccion.puntaje">
                </div>
                <div class="col-md-8 form-group">
                  <label>Fecha Inspección:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaInspeccion.fecha">
                </div>
              </div>
              <div class="form-group">
                <label>Descripción del Hallazgo u Observación:</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevaInspeccion.hallazgo" placeholder="Describa la condición detectada durante el recorrido..."></textarea>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalInspeccion.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaInspeccion()">
                <i class="fa fa-save"></i> Guardar Inspección
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL REGISTRAR OPT O ACTO/CONDICIÓN SUBESTÁNDAR (/opt/insert o /acinseguro/insert) -->
      @if (mostrarModalOptActo()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title">
                <i class="fa fa-eye"></i> Registrar {{ nuevoOptActo.tipoRegistro }} ({{ nuevoOptActo.tipoRegistro === 'OPT' ? '/sst/opt/insert' : '/sst/acinseguro/insert' }})
              </h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalOptActo.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Tipo de Registro:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoOptActo.tipoRegistro">
                    <option value="OPT">Observación Planeada de Trabajo (OPT)</option>
                    <option value="ACTO_SUBESTANDAR">Acto Subestándar (Comportamiento)</option>
                    <option value="CONDICION_SUBESTANDAR">Condición Subestándar (Entorno/Equipo)</option>
                  </select>
                </div>
                <div class="col-md-6 form-group">
                  <label>Nivel de Criticidad:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoOptActo.criticidad">
                    <option value="ALTA">ALTA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="BAJA">BAJA</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Área / Ubicación:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoOptActo.areaUbicacion">
                </div>
                <div class="col-md-6 form-group">
                  <label>Puesto / Tarea Observada (PETS):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoOptActo.puestoTareaObservada" placeholder="Ej. Soldador Homologado - PETS-MAN-014">
                </div>
              </div>
              <div class="form-group">
                <label>Descripción de la Desviación / Hallazgo:</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevoOptActo.descripcionHallazgo"></textarea>
              </div>
              <div class="form-group">
                <label>Retroalimentación al Trabajador y Compromiso In Situ:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoOptActo.retroalimentacionAccion" placeholder="Ej. Se paralizó brevemente la tarea y se colocó biombo ignífugo.">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalOptActo.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoOptActo()">
                <i class="fa fa-save"></i> Guardar Registro Preventivo
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo06PrevencionIpercInspeccionesComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'IPERC' | 'INSPECCIONES' | 'OPT_ACTOS'>('IPERC');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly mensajeAlerta = signal<string>('');
  readonly mostrarModalIperc = signal<boolean>(false);
  readonly mostrarModalInspeccion = signal<boolean>(false);
  readonly mostrarModalOptActo = signal<boolean>(false);

  filtroIperc = '';
  filtroRiesgoInicial = 'TODOS';

  readonly matrizIperc = signal<FilaIpercItem[]>([]);

  readonly inspecciones = signal<InspeccionItem[]>([]);

  readonly optYActos = signal<OptActoSubestandarItem[]>([]);

  nuevoIperc = {
    codigo: '',
    version: '',
    proceso: '',
    tarea: '',
    tipoActividad: '',
    peligro: '',
    riesgo: '',
    probabilidadInicial: 0,
    severidadInicial: 0,
    riesgoInicial: '',
    medidasControl: '',
    riesgoResidual: ''
  };

  nuevaInspeccion = {
    modulo: '' as 'INSPECCION_V1' | 'INSPECCION_V2',
    tipo: '' as 'PLANEADA' | 'INOPINADA' | 'COMITE_SST',
    area: '',
    inspector: '',
    fecha: '',
    puntaje: 0,
    criticidad: '' as '' | 'ALTA' | 'MEDIA' | 'BAJA',
    hallazgo: ''
  };

  nuevoOptActo = {
    tipoRegistro: '' as 'OPT' | 'ACTO_SUBESTANDAR' | 'CONDICION_SUBESTANDAR',
    areaUbicacion: '',
    puestoTareaObservada: '',
    descripcionHallazgo: '',
    retroalimentacionAccion: '',
    criticidad: '' as '' | 'ALTA' | 'MEDIA' | 'BAJA'
  };

  readonly promedioPuntajeInspeccion = computed(() => {
    const list = this.inspecciones();
    if (!list.length) return 0;
    const sum = list.reduce((a, b) => a + (Number(b.puntaje) || 0), 0);
    return Math.round(sum / list.length);
  });

  readonly totalOpts = computed(() =>
    this.optYActos().filter(x => x.tipoRegistro === 'OPT').length
  );

  readonly totalActosCondiciones = computed(() =>
    this.optYActos().filter(x => x.tipoRegistro !== 'OPT').length
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/iperc/lista', { ...{} }).subscribe({next:(response)=>{try{this.matrizIperc.set(confirmedList<FilaIpercItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"version","kind":"string","optional":false,"nullable":true},{"name":"proceso","kind":"string","optional":false,"nullable":true},{"name":"tarea","kind":"string","optional":false,"nullable":true},{"name":"tipoActividad","kind":"string","optional":false,"nullable":true},{"name":"peligro","kind":"string","optional":false,"nullable":true},{"name":"riesgo","kind":"string","optional":false,"nullable":true},{"name":"probabilidadInicial","kind":"number","optional":false,"nullable":true},{"name":"severidadInicial","kind":"number","optional":false,"nullable":true},{"name":"riesgoInicial","kind":"string","optional":false,"nullable":true},{"name":"medidasControl","kind":"string","optional":false,"nullable":true},{"name":"riesgoResidual","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/inspeccionv2/lista', { ...{} }).subscribe({next:(response)=>{try{this.inspecciones.set(confirmedList<InspeccionItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"modulo","kind":"string","optional":false,"nullable":true},{"name":"tipo","kind":"string","optional":false,"nullable":true},{"name":"area","kind":"string","optional":false,"nullable":true},{"name":"inspector","kind":"string","optional":false,"nullable":true},{"name":"fecha","kind":"string","optional":false,"nullable":true},{"name":"puntaje","kind":"number","optional":false,"nullable":true},{"name":"criticidad","kind":"string","optional":false,"nullable":true},{"name":"hallazgo","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  ipercFiltrado(): FilaIpercItem[] {
    const q = this.filtroIperc.trim().toLowerCase();
    return this.matrizIperc().filter(item => {
      const coincideNivel = this.filtroRiesgoInicial === 'TODOS' ||
        (item.riesgoInicial??'').toUpperCase().includes(this.filtroRiesgoInicial);
      const coincideTexto = !q ||
        (item.codigo??'').toLowerCase().includes(q) ||
        (item.proceso??'').toLowerCase().includes(q) ||
        (item.tarea??'').toLowerCase().includes(q) ||
        (item.peligro??'').toLowerCase().includes(q) ||
        (item.medidasControl??'').toLowerCase().includes(q);
      return coincideNivel && coincideTexto;
    });
  }

  guardarNuevoIperc(): void {
    if (!this.nuevoIperc.proceso.trim() || !this.nuevoIperc.peligro.trim()) return;
    this.api.callAjaxPost('/iperc/insert', { ...this.nuevoIperc, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalIperc.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  guardarNuevaInspeccion(): void {
    if (!this.nuevaInspeccion.hallazgo.trim()) return;
    this.api.callAjaxPost('/inspeccionv2/insert', { ...this.nuevaInspeccion, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalInspeccion.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  cerrarHallazgoInspeccion(insp: InspeccionItem): void {this.workflowSelectionOpen.set(true);}

  abrirModalOptActo(tipo: 'OPT' | 'ACTO_SUBESTANDAR'): void {
    this.nuevoOptActo = {
      tipoRegistro: tipo,
      areaUbicacion: '',
      puestoTareaObservada: '',
      descripcionHallazgo: '',
      retroalimentacionAccion: '',
      criticidad: ''
    };
    this.mostrarModalOptActo.set(true);
  }

  guardarNuevoOptActo(): void {
    if (!this.nuevoOptActo.descripcionHallazgo.trim()) return;
    const ruta = this.nuevoOptActo.tipoRegistro === 'OPT' ? '/opt/insert' : '/acinseguro/insert';
    this.api.callAjaxPost(ruta, { ...this.nuevoOptActo, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalOptActo.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  private notificar(msg: string): void {
    this.mensajeAlerta.set(msg);
    setTimeout(() => this.mensajeAlerta.set(''), 4500);
  }
}
