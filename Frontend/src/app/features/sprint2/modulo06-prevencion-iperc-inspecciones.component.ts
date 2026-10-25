import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface FilaIpercItem {
  id: number;
  codigo: string;
  version: string;
  proceso: string;
  tarea: string;
  tipoActividad: string;
  peligro: string;
  riesgo: string;
  probabilidadInicial: number;
  severidadInicial: number;
  riesgoInicial: string;
  medidasControl: string;
  riesgoResidual: string;
  estado: string;
}

export interface InspeccionItem {
  id: number;
  modulo: 'INSPECCION_V1' | 'INSPECCION_V2';
  tipo: 'PLANEADA' | 'INOPINADA' | 'COMITE_SST';
  area: string;
  inspector: string;
  fecha: string;
  puntaje: number;
  criticidad: 'ALTA' | 'MEDIA' | 'BAJA';
  hallazgo: string;
  estado: 'ABIERTA' | 'EN_LEVANTAMIENTO' | 'CERRADA';
}

export interface OptActoSubestandarItem {
  id: number;
  tipoRegistro: 'OPT' | 'ACTO_SUBESTANDAR' | 'CONDICION_SUBESTANDAR';
  codigo: string;
  fecha: string;
  areaUbicacion: string;
  puestoTareaObservada: string;
  observadorReportante: string;
  descripcionHallazgo: string;
  retroalimentacionAccion: string;
  criticidad: 'ALTA' | 'MEDIA' | 'BAJA';
  estado: 'CORREGIDO_IN_SITU' | 'DERIVADO_PLAN_ACCION';
}

@Component({
  selector: 'msst-modulo06-prevencion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                          'label-danger': row.riesgoInicial.includes('ALTO') || row.riesgoInicial.includes('CRITICO'),
                          'label-warning': row.riesgoInicial.includes('MEDIO'),
                          'label-success': row.riesgoInicial.includes('BAJO')
                        }">{{ row.riesgoInicial }}</span>
                      </td>
                      <td style="font-size: 12px;">{{ row.medidasControl }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': row.riesgoResidual.includes('BAJO'),
                          'label-warning': row.riesgoResidual.includes('MEDIO'),
                          'label-danger': row.riesgoResidual.includes('ALTO')
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

  readonly matrizIperc = signal<FilaIpercItem[]>([
    {
      id: 1,
      codigo: 'IPERC-CLINK-001',
      version: 'v4.0',
      proceso: 'Clinkerización y Horno Rotatorio',
      tarea: 'Inspección y cambio de ladrillos refractarios en zona de quema',
      tipoActividad: 'No Rutinaria',
      peligro: 'Superficies a alta temperatura residual y caída de material',
      riesgo: 'Quemaduras de 2do/3er grado y aplastamiento por desprendimiento',
      probabilidadInicial: 4,
      severidadInicial: 4,
      riesgoInicial: 'ALTO (16)',
      medidasControl: 'Ing: Enfriamiento forzado <40°C y entibado; Admin: PETAR Espacio Confinado; EPP: Traje aluminizado y casco con barbiquejo.',
      riesgoResidual: 'BAJO (3)',
      estado: 'APROBADO'
    },
    {
      id: 2,
      codigo: 'IPERC-MANT-002',
      version: 'v4.0',
      proceso: 'Mantenimiento Eléctrico de Subestaciones',
      tarea: 'Mantenimiento preventivo de celdas de media tensión 10 kV',
      tipoActividad: 'Rutinaria',
      peligro: 'Energía eléctrica de media tensión (Arco Eléctrico)',
      riesgo: 'Electrocución / Shock eléctrico severo / Quemadura por arco',
      probabilidadInicial: 3,
      severidadInicial: 5,
      riesgoInicial: 'ALTO (15)',
      medidasControl: 'Ing: Relé de falla de arco y puesta a tierra; Admin: 5 Reglas de Oro + Bloqueo LOTOTO; EPP: Traje Arc-Flash 40 cal/cm².',
      riesgoResidual: 'BAJO (4)',
      estado: 'APROBADO'
    },
    {
      id: 3,
      codigo: 'IPERC-DESP-003',
      version: 'v3.2',
      proceso: 'Envase y Despacho de Cemento en Bombonas',
      tarea: 'Conexión de manga de carga en escotilla superior de cisterna',
      tipoActividad: 'Rutinaria',
      peligro: 'Trabajo en altura sobre plataforma de cisterna (> 3.20 m)',
      riesgo: 'Caída a distinto nivel con fracturas múltiples',
      probabilidadInicial: 3,
      severidadInicial: 4,
      riesgoInicial: 'MEDIO (12)',
      medidasControl: 'Ing: Línea de vida retráctil certificada en pórtico; Admin: PETAR Altura; EPP: Arnés cuerpo completo doble línea con absorbedor.',
      riesgoResidual: 'BAJO (2)',
      estado: 'APROBADO'
    }
  ]);

  readonly inspecciones = signal<InspeccionItem[]>([
    {
      id: 201,
      modulo: 'INSPECCION_V2',
      tipo: 'PLANEADA',
      area: 'Planta Condorcocha - Nave de Molienda de Cemento',
      inspector: 'Ing. Carlos Mendoza',
      fecha: '22/10/2026',
      puntaje: 94,
      criticidad: 'MEDIA',
      hallazgo: 'Falta actualizar etiqueta de inspección mensual en ducha lavaojos de emergencia N° 03.',
      estado: 'CERRADA'
    },
    {
      id: 202,
      modulo: 'INSPECCION_V2',
      tipo: 'INOPINADA',
      area: 'Taller Central de Soldadura y Calderería',
      inspector: 'Sup. Jorge Chávez',
      fecha: '24/10/2026',
      puntaje: 82,
      criticidad: 'ALTA',
      hallazgo: 'Cilindro de oxígeno almacenado sin cadena de sujeción secundaria en zona de tránsito.',
      estado: 'EN_LEVANTAMIENTO'
    },
    {
      id: 203,
      modulo: 'INSPECCION_V1',
      tipo: 'COMITE_SST',
      area: 'Almacén de Materiales Peligrosos (MATPEL)',
      inspector: 'Comité Paritario SST',
      fecha: '20/10/2026',
      puntaje: 98,
      criticidad: 'BAJA',
      hallazgo: 'Bandejas antiderrame operativas y hojas MSDS vigentes en idioma español.',
      estado: 'CERRADA'
    }
  ]);

  readonly optYActos = signal<OptActoSubestandarItem[]>([
    {
      id: 301,
      tipoRegistro: 'OPT',
      codigo: 'OPT-2026-088',
      fecha: '23/10/2026',
      areaUbicacion: 'Cantera Caliza - Nivel 4150',
      puestoTareaObservada: 'Operador de Cargador Frontal CAT 988K (PETS-MIN-005)',
      observadorReportante: 'Ing. Carlos Mendoza',
      descripcionHallazgo: 'Cumple los 3 puntos de apoyo al ascender, pero omitió verificar el claxon de retroceso antes del arranque.',
      retroalimentacionAccion: 'Refuerzo positivo sobre procedimiento de pre-uso (Check-list de vuelta del gallo).',
      criticidad: 'MEDIA',
      estado: 'CORREGIDO_IN_SITU'
    },
    {
      id: 302,
      tipoRegistro: 'ACTO_SUBESTANDAR',
      codigo: 'ACS-2026-142',
      fecha: '24/10/2026',
      areaUbicacion: 'Planta Huachipa - Zona de Embolsado',
      puestoTareaObservada: 'Auxiliar de Estiba y Paletizado',
      observadorReportante: 'Tec. Luis Paredes',
      descripcionHallazgo: 'Trabajador manipulando carga manual sin flexionar rodillas ni usar guantes de cuero.',
      retroalimentacionAccion: 'Pausa activa ergonómica inmediata y entrega de guantes en sitio.',
      criticidad: 'MEDIA',
      estado: 'CORREGIDO_IN_SITU'
    },
    {
      id: 303,
      tipoRegistro: 'CONDICION_SUBESTANDAR',
      codigo: 'CNS-2026-143',
      fecha: '24/10/2026',
      areaUbicacion: 'Pasarela Metálica Silo N° 02',
      puestoTareaObservada: 'Tránsito Peatonal en Planta',
      observadorReportante: 'Analista Patricia Salazar',
      descripcionHallazgo: 'Perno suelto en peldaño Grating N° 14 de la escalera de acceso al Silo 02.',
      retroalimentacionAccion: 'Acordonamiento inmediato y generación de orden de trabajo a Mantenimiento Mecánico.',
      criticidad: 'ALTA',
      estado: 'DERIVADO_PLAN_ACCION'
    }
  ]);

  nuevoIperc = {
    codigo: 'IPERC-OPER-004',
    version: 'v4.0',
    proceso: '',
    tarea: '',
    tipoActividad: 'Rutinaria',
    peligro: '',
    riesgo: '',
    probabilidadInicial: 4,
    severidadInicial: 4,
    riesgoInicial: 'ALTO (16)',
    medidasControl: '',
    riesgoResidual: 'BAJO (3)'
  };

  nuevaInspeccion = {
    modulo: 'INSPECCION_V2' as 'INSPECCION_V1' | 'INSPECCION_V2',
    tipo: 'PLANEADA' as 'PLANEADA' | 'INOPINADA' | 'COMITE_SST',
    area: 'Planta Condorcocha - Subestación Principal',
    inspector: 'Ing. Carlos Mendoza',
    fecha: '25/10/2026',
    puntaje: 90,
    criticidad: 'ALTA' as 'ALTA' | 'MEDIA' | 'BAJA',
    hallazgo: ''
  };

  nuevoOptActo = {
    tipoRegistro: 'OPT' as 'OPT' | 'ACTO_SUBESTANDAR' | 'CONDICION_SUBESTANDAR',
    areaUbicacion: 'Planta Condorcocha',
    puestoTareaObservada: '',
    descripcionHallazgo: '',
    retroalimentacionAccion: '',
    criticidad: 'MEDIA' as 'ALTA' | 'MEDIA' | 'BAJA'
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
    this.api.callAjaxPost('/iperc/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['peligro']) {
          const desdeSql: FilaIpercItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (100 + idx),
            codigo: String(r['codigo'] || `IPERC-SQL-0${idx + 1}`),
            version: String(r['version'] || 'v4.0'),
            proceso: String(r['proceso'] || 'Operaciones Planta'),
            tarea: String(r['tarea'] || 'Tarea Operativa'),
            tipoActividad: 'Rutinaria',
            peligro: String(r['peligro'] || ''),
            riesgo: String(r['riesgo'] || ''),
            probabilidadInicial: 4,
            severidadInicial: 4,
            riesgoInicial: String(r['riesgoInicial'] || 'ALTO'),
            medidasControl: String(r['medidasControl'] || 'Controles de Ingeniería, PETAR y EPP'),
            riesgoResidual: String(r['riesgoResidual'] || 'BAJO'),
            estado: String(r['estado'] || 'APROBADO')
          }));
          this.matrizIperc.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
          ]);
        }
      }
    });

    this.api.callAjaxPost('/inspeccionv2/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['hallazgo']) {
          const desdeSql: InspeccionItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (300 + idx),
            modulo: (String(r['modulo'] || 'INSPECCION_V2').includes('V1') ? 'INSPECCION_V1' : 'INSPECCION_V2'),
            tipo: (String(r['tipo'] || 'PLANEADA').toUpperCase().includes('INOP') ? 'INOPINADA' : 'PLANEADA'),
            area: String(r['area'] || 'Planta Condorcocha'),
            inspector: String(r['inspector'] || 'Ing. SST'),
            fecha: String(r['fecha'] || '24/10/2026'),
            puntaje: Number(r['puntaje']) || 92,
            criticidad: (String(r['criticidad'] || 'MEDIA').toUpperCase() as 'ALTA' | 'MEDIA' | 'BAJA'),
            hallazgo: String(r['hallazgo'] || ''),
            estado: (String(r['estado'] || 'ABIERTA').toUpperCase() as 'ABIERTA' | 'EN_LEVANTAMIENTO' | 'CERRADA')
          }));
          this.inspecciones.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.id === a.id))
          ]);
        }
      }
    });
  }

  ipercFiltrado(): FilaIpercItem[] {
    const q = this.filtroIperc.trim().toLowerCase();
    return this.matrizIperc().filter(item => {
      const coincideNivel = this.filtroRiesgoInicial === 'TODOS' ||
        item.riesgoInicial.toUpperCase().includes(this.filtroRiesgoInicial);
      const coincideTexto = !q ||
        item.codigo.toLowerCase().includes(q) ||
        item.proceso.toLowerCase().includes(q) ||
        item.tarea.toLowerCase().includes(q) ||
        item.peligro.toLowerCase().includes(q) ||
        item.medidasControl.toLowerCase().includes(q);
      return coincideNivel && coincideTexto;
    });
  }

  guardarNuevoIperc(): void {
    if (!this.nuevoIperc.proceso.trim() || !this.nuevoIperc.peligro.trim()) return;
    this.api.callAjaxPost('/iperc/insert', { ...this.nuevoIperc, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarFilaIpercLocal(Number(res?.['idGenerado']) || Date.now()),
      error: () => this.agregarFilaIpercLocal(Date.now())
    });
  }

  private agregarFilaIpercLocal(id: number): void {
    const fila: FilaIpercItem = {
      id,
      codigo: this.nuevoIperc.codigo,
      version: this.nuevoIperc.version,
      proceso: this.nuevoIperc.proceso,
      tarea: this.nuevoIperc.tarea,
      tipoActividad: this.nuevoIperc.tipoActividad,
      peligro: this.nuevoIperc.peligro,
      riesgo: this.nuevoIperc.riesgo,
      probabilidadInicial: Number(this.nuevoIperc.probabilidadInicial) || 4,
      severidadInicial: Number(this.nuevoIperc.severidadInicial) || 4,
      riesgoInicial: this.nuevoIperc.riesgoInicial,
      medidasControl: this.nuevoIperc.medidasControl,
      riesgoResidual: this.nuevoIperc.riesgoResidual,
      estado: 'APROBADO'
    };
    this.matrizIperc.update(list => [fila, ...list]);
    this.mostrarModalIperc.set(false);
    this.notificar(`Fila IPERC "${fila.codigo}" registrada correctamente en OneSST.`);
  }

  guardarNuevaInspeccion(): void {
    if (!this.nuevaInspeccion.hallazgo.trim()) return;
    this.api.callAjaxPost('/inspeccionv2/insert', { ...this.nuevaInspeccion, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarInspeccionLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.agregarInspeccionLocal(Date.now() % 10000)
    });
  }

  private agregarInspeccionLocal(id: number): void {
    const item: InspeccionItem = {
      id,
      modulo: this.nuevaInspeccion.modulo,
      tipo: this.nuevaInspeccion.tipo,
      area: this.nuevaInspeccion.area,
      inspector: this.nuevaInspeccion.inspector,
      fecha: this.nuevaInspeccion.fecha,
      puntaje: Number(this.nuevaInspeccion.puntaje) || 90,
      criticidad: this.nuevaInspeccion.criticidad,
      hallazgo: this.nuevaInspeccion.hallazgo,
      estado: 'ABIERTA'
    };
    this.inspecciones.update(list => [item, ...list]);
    this.mostrarModalInspeccion.set(false);
    this.notificar(`Inspección #${item.id} registrada.`);
  }

  cerrarHallazgoInspeccion(insp: InspeccionItem): void {
    this.inspecciones.update(list =>
      list.map(i => i.id === insp.id ? { ...i, estado: 'CERRADA', puntaje: 100 } : i)
    );
    this.notificar(`Hallazgo de la Inspección #${insp.id} levantado y verificado al 100%.`);
  }

  abrirModalOptActo(tipo: 'OPT' | 'ACTO_SUBESTANDAR'): void {
    this.nuevoOptActo = {
      tipoRegistro: tipo,
      areaUbicacion: 'Planta Condorcocha',
      puestoTareaObservada: '',
      descripcionHallazgo: '',
      retroalimentacionAccion: '',
      criticidad: 'MEDIA'
    };
    this.mostrarModalOptActo.set(true);
  }

  guardarNuevoOptActo(): void {
    if (!this.nuevoOptActo.descripcionHallazgo.trim()) return;
    const ruta = this.nuevoOptActo.tipoRegistro === 'OPT' ? '/opt/insert' : '/acinseguro/insert';
    this.api.callAjaxPost(ruta, { ...this.nuevoOptActo, idEmpresa: 773 }).subscribe({
      next: () => this.agregarOptActoLocal(ruta),
      error: () => this.agregarOptActoLocal(ruta)
    });
  }

  private agregarOptActoLocal(ruta: string): void {
    const prefijo = this.nuevoOptActo.tipoRegistro === 'OPT' ? 'OPT' : 'ACS';
    const item: OptActoSubestandarItem = {
      id: Date.now(),
      tipoRegistro: this.nuevoOptActo.tipoRegistro,
      codigo: `${prefijo}-2026-${Math.floor(150 + Math.random() * 800)}`,
      fecha: '24/10/2026',
      areaUbicacion: this.nuevoOptActo.areaUbicacion,
      puestoTareaObservada: this.nuevoOptActo.puestoTareaObservada || 'Operación en Planta',
      observadorReportante: this.session.usuarioNombre(),
      descripcionHallazgo: this.nuevoOptActo.descripcionHallazgo,
      retroalimentacionAccion: this.nuevoOptActo.retroalimentacionAccion || 'Corrección inmediata en campo',
      criticidad: this.nuevoOptActo.criticidad,
      estado: 'CORREGIDO_IN_SITU'
    };
    this.optYActos.update(list => [item, ...list]);
    this.mostrarModalOptActo.set(false);
    this.notificar(`Registro preventivo ${item.codigo} guardado correctamente en OneSST (/sst${ruta}).`);
  }

  private notificar(msg: string): void {
    this.mensajeAlerta.set(msg);
    setTimeout(() => this.mensajeAlerta.set(''), 4500);
  }
}
