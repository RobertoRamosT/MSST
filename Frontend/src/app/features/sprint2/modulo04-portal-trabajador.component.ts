import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface PendienteTrabajadorItem {
  id: number;
  codigo: string | null;
  categoria: 'DOCUMENTO_SST' | 'ENTREGA_EPP' | 'CURSO_LMS' | 'COMITE_SST' | null;
  titulo: string | null;
  descripcion: string | null;
  fechaLimite: string | null;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA' | null;
  estadoFirma: 'PENDIENTE' | 'FIRMADO' | null;
  hashFirma?: string;
}

export interface ActividadSchedulerItem {
  id: number;
  codigo: string | null;
  titulo: string | null;
  modulo: string | null;
  tipoActividad: string | null;
  mes: string | null;
  fechaProgramada: string | null;
  horaInicio: string | null;
  responsable: string | null;
  ubicacion: string | null;
  avance: number | null;
  estado: 'PROGRAMADO' | 'EN_EJECUCION' | 'EJECUTADO' | 'REPROGRAMADO' | null;
}

export interface CapituloManualItem {
  id: number;
  numero: string | null;
  titulo: string | null;
  moduloRef: string | null;
  resumen: string | null;
  pasosClave: string[];
  paginaHtml: string | null;
}

@Component({
  selector: 'msst-modulo04-portal-trabajador',
  standalone: true,
  imports: [WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera del Módulo 04 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-home"></i> Portal Principal del Colaborador, Calendario PASST y Guía Interactiva
            </h4>
            <div style="font-size: 11.5px; color: #d0e4ff; margin-top: 3px;">
              Colaborador: <strong>{{ session.usuarioNombre() }}</strong> | Empresa: <strong>{{ session.empresaNombre() }}</strong>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalScheduler.set(true)">
              <i class="fa fa-calendar-plus-o"></i> + Agendar Actividad PASST
            </button>
            <button class="btn btn-xs btn-info" (click)="subTab.set('AUTOSERVICIO')">
              <i class="fa fa-bullhorn"></i> Reporte Preventivo
            </button>
          </div>
        </div>

        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <!-- Frase motivacional corporativa desde /sst/empresa/mensaje -->
          <div style="background: #fff; border-left: 4px solid #004B87; padding: 10px 15px; border-radius: 4px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
              <i class="fa fa-quote-left text-primary"></i>
              <em style="margin: 0 8px; color: #333; font-weight: 500;">{{ fraseSeguridad() }}</em>
              <small class="text-muted">— {{ autorFrase() }}</small>
            </div>
            <span class="label label-primary"><i class="fa fa-shield"></i> Cultura Cero Daño</span>
          </div>

          <!-- KPIs Rápidos del Colaborador -->
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">DOCUMENTOS / EPP POR FIRMAR</div>
                <div style="font-size: 20px; font-weight: bold; color: #dc3545;">{{ totalPendientesSinFirmar() }} Pendientes</div>
                <div style="font-size: 11px; color: #888;">Firma Electrónica Ley N° 29783</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">ACTIVIDADES PASST AGENDADAS</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ actividadesCalendario().length }} Actividades</div>
                <div style="font-size: 11px; color: #888;">Cumplimiento Anual: {{ promedioCumplimientoPasst() }}%</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">APTITUD MÉDICA OCUPACIONAL</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">Consultar dictamen registrado</div>
                <div style="font-size: 11px; color: #888;">Consulte la vigencia confirmada en Salud Ocupacional</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">REPORTES PREVENTIVOS ENVIADOS</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ reportesEnviadosCount() }} Reportes</div>
                <div style="font-size: 11px; color: #888;">Autoservicio Colaborador / Móvil</div>
              </div>
            </div>
          </div>

          <!-- Navegación de Sub-pestañas del Módulo 04 -->
          <div class="btn-group">
            <button class="btn btn-sm" [ngClass]="subTab() === 'BANDEJA' ? 'btn-primary' : 'btn-default'" (click)="subTab.set('BANDEJA')">
              <i class="fa fa-inbox"></i> 1. Bandeja de Pendientes y Firma Digital ({{ totalPendientesSinFirmar() }})
            </button>
            <button class="btn btn-sm" [ngClass]="subTab() === 'CALENDARIO' ? 'btn-primary' : 'btn-default'" (click)="subTab.set('CALENDARIO')">
              <i class="fa fa-calendar"></i> 2. Calendario Anual/Mensual PASST ({{ actividadesCalendario().length }})
            </button>
            <button class="btn btn-sm" [ngClass]="subTab() === 'AUTOSERVICIO' ? 'btn-primary' : 'btn-default'" (click)="subTab.set('AUTOSERVICIO')">
              <i class="fa fa-mobile"></i> 3. Autoservicio del Colaborador y Manual Interactivo
            </button>
          </div>
        </div>
      </div>

      @if (mensajeExito()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ mensajeExito() }}
        </div>
      }

      <!-- SUB-PESTAÑA 1: BANDEJA DE PENDIENTES DEL TRABAJADOR -->
      @if (subTab() === 'BANDEJA') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-pencil-square-o"></i> Bandeja de Pendientes del Trabajador (Firmas SST, Recepción EPP y Cursos Asignados)</h4>
            <div>
              <button class="btn btn-xs btn-warning" (click)="firmarTodosPendientes()" [disabled]="totalPendientesSinFirmar() === 0">
                <i class="fa fa-certificate"></i> Firmar Todos los Pendientes ({{ totalPendientesSinFirmar() }})
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-4">
                <input type="text" class="form-control input-sm" placeholder="Filtrar por código, documento, EPP o curso..." [(ngModel)]="filtroPendientes">
              </div>
              <div class="col-md-3">
                <select class="form-control input-sm" [(ngModel)]="filtroCategoriaPendiente">
                  <option value="TODOS">Todas las Categorías</option>
                  <option value="DOCUMENTO_SST">Documentos / RISST / IPERC</option>
                  <option value="ENTREGA_EPP">Cargo de Entrega de EPP</option>
                  <option value="CURSO_LMS">Cursos de Capacitación Asignados</option>
                  <option value="COMITE_SST">Actas del Comité SST</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código</th>
                    <th>Categoría</th>
                    <th>Documento / Actividad Asignada</th>
                    <th>Detalle</th>
                    <th>Fecha Límite</th>
                    <th>Prioridad</th>
                    <th>Estado Firma</th>
                    <th style="width: 170px;">Acción Colaborador</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of pendientesFiltrados(); track item.id) {
                    <tr>
                      <td><strong>{{ item.codigo }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-primary': item.categoria === 'DOCUMENTO_SST',
                          'label-info': item.categoria === 'ENTREGA_EPP',
                          'label-warning': item.categoria === 'CURSO_LMS',
                          'label-default': item.categoria === 'COMITE_SST'
                        }">{{ item.categoria }}</span>
                      </td>
                      <td><strong>{{ item.titulo }}</strong></td>
                      <td>{{ item.descripcion }}</td>
                      <td>{{ item.fechaLimite }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': item.prioridad === 'ALTA',
                          'label-warning': item.prioridad === 'MEDIA',
                          'label-success': item.prioridad === 'BAJA'
                        }">{{ item.prioridad }}</span>
                      </td>
                      <td>
                        @if (item.estadoFirma === 'FIRMADO') {
                          <span class="label label-success"><i class="fa fa-check"></i> FIRMADO ({{ item.hashFirma }})</span>
                        } @else {
                          <span class="label label-danger"><i class="fa fa-clock-o"></i> PENDIENTE FIRMA</span>
                        }
                      </td>
                      <td>
                        @if (item.estadoFirma === 'PENDIENTE') {
                          <button class="btn btn-xs btn-primary" (click)="firmarPendiente(item)">
                            <i class="fa fa-pencil"></i> Firmar Digitalmente
                          </button>
                        } @else {
                          <a class="btn btn-xs btn-default" [href]="'/sst/evidencia/ver?codigo=' + item.codigo" target="_blank">
                            <i class="fa fa-file-pdf-o"></i> Ver Cargo Firmado
                          </a>
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

      <!-- SUB-PESTAÑA 2: CALENDARIO ANUAL / MENSUAL DE ACTIVIDADES SST (/scheduler/lista & /scheduler/insert) -->
      @if (subTab() === 'CALENDARIO') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-calendar-check-o"></i> Programa Anual y Calendario Mensual de Actividades SST</h4>
            <button class="btn btn-xs btn-success" (click)="abrirModalScheduler()">
              <i class="fa fa-plus-circle"></i> Agendar Nueva Actividad SST
            </button>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-3">
                <label style="font-size: 11px;">Filtrar por Mes Programado:</label>
                <select class="form-control input-sm" [(ngModel)]="filtroMesCalendario">
                  <option value="TODOS">Todos los Meses (Anual)</option>
                  <option value="OCTUBRE">Octubre</option>
                  <option value="NOVIEMBRE">Noviembre</option>
                  <option value="DICIEMBRE">Diciembre</option>
                </select>
              </div>
              <div class="col-md-3">
                <label style="font-size: 11px;">Filtrar por Módulo SST:</label>
                <select class="form-control input-sm" [(ngModel)]="filtroModuloCalendario">
                  <option value="TODOS">Todos los Módulos</option>
                  <option value="IPERC">Matriz IPERC</option>
                  <option value="INSPECCIONES">Inspecciones SST</option>
                  <option value="CAPACITACION">Capacitaciones</option>
                  <option value="SIMULACRO">Simulacros / Emergencias</option>
                  <option value="COMITE">Comité Paritario SST</option>
                </select>
              </div>
              <div class="col-md-6" style="text-align: right; padding-top: 18px;">
                <span class="label label-success" style="margin-right: 6px;">EJECUTADO</span>
                <span class="label label-info" style="margin-right: 6px;">EN EJECUCIÓN</span>
                <span class="label label-primary" style="margin-right: 6px;">PROGRAMADO</span>
                <span class="label label-warning">REPROGRAMADO</span>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código</th>
                    <th>Mes</th>
                    <th>Fecha / Hora</th>
                    <th>Módulo</th>
                    <th>Actividad Programada (PASST)</th>
                    <th>Ubicación / Planta</th>
                    <th>Responsable</th>
                    <th>Avance</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (act of actividadesFiltradas(); track act.id) {
                    <tr>
                      <td><strong>{{ act.codigo }}</strong></td>
                      <td>{{ act.mes }}</td>
                      <td>{{ act.fechaProgramada }} ({{ act.horaInicio }})</td>
                      <td><span class="label label-default">{{ act.modulo }}</span></td>
                      <td><strong>{{ act.titulo }}</strong> <div style="font-size:11px; color:#666;">{{ act.tipoActividad }}</div></td>
                      <td>{{ act.ubicacion }}</td>
                      <td>{{ act.responsable }}</td>
                      <td><strong>{{ act.avance }}%</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': act.estado === 'EJECUTADO',
                          'label-info': act.estado === 'EN_EJECUCION',
                          'label-primary': act.estado === 'PROGRAMADO',
                          'label-warning': act.estado === 'REPROGRAMADO'
                        }">{{ act.estado }}</span>
                      </td>
                      <td>
                        @if (act.estado !== 'EJECUTADO') {
                          <button class="btn btn-xs btn-success" (click)="marcarActividadEjecutada(act)">
                            <i class="fa fa-check"></i> Ejecutar 100%
                          </button>
                        } @else {
                          <span class="text-success"><i class="fa fa-check-circle"></i> Cumplido</span>
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

      <!-- SUB-PESTAÑA 3: AUTOSERVICIO DEL COLABORADOR Y MANUAL INTERACTIVO -->
      @if (subTab() === 'AUTOSERVICIO') {
        <div class="row">
          <!-- Reporte Rápido Móvil de Condición / Acto Subestándar y Buzón de Sugerencias -->
          <div class="col-md-5">
            <div class="panel panel-info">
              <div class="panel-heading">
                <h4 class="panel-title"><i class="fa fa-bullhorn"></i> Autoservicio Móvil: Reporte Rápido / Sugerencia SST</h4>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label>Tipo de Comunicación del Trabajador:</label>
                  <select class="form-control input-sm" [(ngModel)]="formAutoservicio.tipo">
                    <option value="CONDICION_SUBESTANDAR">Reporte de Condición Subestándar (Peligro en Área)</option>
                    <option value="ACTO_SUBESTANDAR">Reporte de Acto Subestándar</option>
                    <option value="DERECHO_DECIR_NO">Activación "Derecho a Decir NO" (Trabajo Inseguro)</option>
                    <option value="BUZON_SUGERENCIA">Sugerencia de Mejora SST al Comité</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Área / Ubicación Exacta:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="formAutoservicio.ubicacion" placeholder="Ej. Planta Condorcocha - Zona Molienda Línea 2">
                </div>
                <div class="form-group">
                  <label>Descripción del Hallazgo o Sugerencia:</label>
                  <textarea class="form-control input-sm" rows="3" [(ngModel)]="formAutoservicio.descripcion" placeholder="Describa la condición detectada o la propuesta de mejora..."></textarea>
                </div>
                <div class="form-group">
                  <label>Nivel de Urgencia Percibida:</label>
                  <select class="form-control input-sm" [(ngModel)]="formAutoservicio.urgencia">
                    <option value="ALTA">ALTA (Atención Inmediata)</option>
                    <option value="MEDIA">MEDIA (Programar en 24-48h)</option>
                    <option value="BAJA">BAJA (Mejora Continua)</option>
                  </select>
                </div>
                <button class="btn btn-primary btn-block" (click)="enviarReporteAutoservicio()">
                  <i class="fa fa-paper-plane"></i> Enviar Reporte al Centro de Control SST
                </button>
              </div>
            </div>

            <!-- Consulta Rápida de Ficha Médica Ocupacional del Colaborador -->
            <div class="panel panel-success">
              <div class="panel-heading">
                <h4 class="panel-title"><i class="fa fa-stethoscope"></i> Mi Ficha Médica Ocupacional (Resumen Confidencial)</h4>
              </div>
              <div class="panel-body" style="font-size: 12px;">
                <p><strong>Colaborador:</strong> {{ session.usuarioNombre() }}</p>
                <p><strong>Último EMO Periódico:</strong> Sin fecha confirmada — <span class="label label-success">Sin dictamen confirmado en esta vista</span></p>
                <p><strong>Grupo Sanguíneo:</strong> O Rh Positivo (+) | <strong>Restricciones:</strong> Uso obligatorio de protección auditiva doble en zona de chancado.</p>
                <p><strong>Vacunación Ocupacional:</strong> Consulte el registro clínico autorizado.</p>
                <a class="btn btn-xs btn-success" (click)="workflowSelectionOpen.set(true)" target="_blank">
                  <i class="fa fa-download"></i> Descargar Certificado de Aptitud Médica (PDF)
                </a>
              </div>
            </div>
          </div>

          <!-- Manual Interactivo del Usuario OneSST -->
          <div class="col-md-7">
            <div class="panel panel-primary">
              <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
                <h4 class="panel-title"><i class="fa fa-book"></i> Guía Interactiva del Usuario OneSST</h4>
                <span class="label label-info">Información del repositorio</span>
              </div>
              <div class="panel-body">
                <div class="input-group" style="margin-bottom: 12px;">
                  <span class="input-group-addon"><i class="fa fa-search"></i></span>
                  <input type="text" class="form-control input-sm" placeholder="Buscar guía paso a paso (ej. IPERC, Inspecciones, Contratistas, Accidentes)..." [(ngModel)]="filtroManual">
                </div>

                @for (cap of capitulosManualFiltrados(); track cap.id) {
                  <div style="border: 1px solid #dce4ec; border-radius: 5px; padding: 12px; margin-bottom: 10px; background: #fafcfe;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong style="color: #004B87; font-size: 13px;">Capítulo {{ cap.numero }}: {{ cap.titulo }}</strong>
                      <span class="label label-info">{{ cap.moduloRef }}</span>
                    </div>
                    <p style="font-size: 12px; color: #555; margin: 6px 0;">{{ cap.resumen }}</p>
                    <ul style="font-size: 11px; color: #333; margin-bottom: 0; padding-left: 18px;">
                      @for (paso of cap.pasosClave; track paso) {
                        <li>{{ paso }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- MODAL AGENDAR NUEVA ACTIVIDAD SST -->
      @if (mostrarModalScheduler()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0; box-shadow: 0 8px 25px rgba(0,0,0,.35);">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-calendar-plus-o"></i> Programar Nueva Actividad SST en Calendario</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalScheduler.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Código Actividad PASST:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.codigo">
                </div>
                <div class="col-md-6 form-group">
                  <label>Módulo SST Relacionado:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaActividad.modulo">
                    <option value="IPERC">IPERC</option>
                    <option value="INSPECCIONES">INSPECCIONES</option>
                    <option value="CAPACITACION">CAPACITACION</option>
                    <option value="SIMULACRO">SIMULACRO</option>
                    <option value="COMITE">COMITE</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Título de la Actividad:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.titulo" placeholder="Ej. Simulacro Multipeligro de Sismo e Incendio Industrial">
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Mes Programado:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaActividad.mes">
                    <option value="OCTUBRE">OCTUBRE</option>
                    <option value="NOVIEMBRE">NOVIEMBRE</option>
                    <option value="DICIEMBRE">DICIEMBRE</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha (DD/MM/YYYY):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.fechaProgramada">
                </div>
                <div class="col-md-4 form-group">
                  <label>Hora Inicio:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.horaInicio">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Ubicación / Sede:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.ubicacion">
                </div>
                <div class="col-md-6 form-group">
                  <label>Responsable SST:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActividad.responsable">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalScheduler.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaActividadScheduler()">
                <i class="fa fa-save"></i> Guardar Registro
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo04PortalTrabajadorComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly subTab = signal<'BANDEJA' | 'CALENDARIO' | 'AUTOSERVICIO'>('BANDEJA');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.subTab.set(t as never);

    }

  });
  readonly fraseSeguridad = signal<string>('La seguridad no es negociable: cada trabajador regresa sano y salvo a casa.');
  readonly autorFrase = signal<string>('');
  readonly mensajeExito = signal<string>('');
  readonly mostrarModalScheduler = signal<boolean>(false);
  readonly reportesEnviadosCount = signal<number>(0);

  filtroPendientes = '';
  filtroCategoriaPendiente = 'TODOS';
  filtroMesCalendario = 'TODOS';
  filtroModuloCalendario = 'TODOS';
  filtroManual = '';

  readonly pendientes = signal<PendienteTrabajadorItem[]>([]);

  readonly actividadesCalendario = signal<ActividadSchedulerItem[]>([]);

  readonly capitulosManual = signal<CapituloManualItem[]>([]);

  formAutoservicio = {
    tipo: '',
    ubicacion: '',
    descripcion: '',
    urgencia: ''
  };

  nuevaActividad = {
    codigo: '',
    titulo: '',
    modulo: '',
    tipoActividad: '',
    mes: '',
    fechaProgramada: '',
    horaInicio: '',
    ubicacion: '',
    responsable: ''
  };

  readonly totalPendientesSinFirmar = computed(() =>
    this.pendientes().filter(p => p.estadoFirma === 'PENDIENTE').length
  );

  readonly promedioCumplimientoPasst = computed(() => {
    const lista = this.actividadesCalendario();
    if (!lista.length) return 0;
    const suma = lista.reduce((acc, item) => acc + (Number(item.avance) || 0), 0);
    return Math.round(suma / lista.length);
  });

  ngOnInit(): void {
    this.cargarDatosBackend();
  }

  cargarDatosBackend(): void {
    this.api.getEmpresaMensaje().subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0) {
          this.fraseSeguridad.set(list[0]['frase'] || this.fraseSeguridad());
          this.autorFrase.set(list[0]['autor'] || this.autorFrase());
        }
      }
    });

    this.api.callAjaxPost('/scheduler/lista', { ...{}, ...{} }).subscribe({next:(response)=>{try{this.actividadesCalendario.set(confirmedList<ActividadSchedulerItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"titulo","kind":"string","optional":false,"nullable":true},{"name":"modulo","kind":"string","optional":false,"nullable":true},{"name":"tipoActividad","kind":"string","optional":false,"nullable":true},{"name":"mes","kind":"string","optional":false,"nullable":true},{"name":"fechaProgramada","kind":"string","optional":false,"nullable":true},{"name":"horaInicio","kind":"string","optional":false,"nullable":true},{"name":"responsable","kind":"string","optional":false,"nullable":true},{"name":"ubicacion","kind":"string","optional":false,"nullable":true},{"name":"avance","kind":"number","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  pendientesFiltrados(): PendienteTrabajadorItem[] {
    const q = this.filtroPendientes.trim().toLowerCase();
    return this.pendientes().filter(item => {
      const coincideCat = this.filtroCategoriaPendiente === 'TODOS' || item.categoria === this.filtroCategoriaPendiente;
      const coincideTexto = !q ||
        (item.codigo??'').toLowerCase().includes(q) ||
        (item.titulo??'').toLowerCase().includes(q) ||
        (item.descripcion??'').toLowerCase().includes(q);
      return coincideCat && coincideTexto;
    });
  }

  actividadesFiltradas(): ActividadSchedulerItem[] {
    return this.actividadesCalendario().filter(act => {
      const coincideMes = this.filtroMesCalendario === 'TODOS' || act.mes === this.filtroMesCalendario;
      const coincideMod = this.filtroModuloCalendario === 'TODOS' || act.modulo === this.filtroModuloCalendario;
      return coincideMes && coincideMod;
    });
  }

  capitulosManualFiltrados(): CapituloManualItem[] {
    const q = this.filtroManual.trim().toLowerCase();
    if (!q) return this.capitulosManual();
    return this.capitulosManual().filter(c =>
      (c.titulo??'').toLowerCase().includes(q) ||
      (c.resumen??'').toLowerCase().includes(q) ||
      (c.moduloRef??'').toLowerCase().includes(q)
    );
  }

  async firmarPendiente(item: PendienteTrabajadorItem): Promise<void> {this.workflowSelectionOpen.set(true);}



  async firmarTodosPendientes(): Promise<void> {this.workflowSelectionOpen.set(true);}



  private aplicarFirmaMasiva(_hashLote:string):void{this.workflowSelectionOpen.set(true);}

  abrirModalScheduler():void{this.nuevaActividad={codigo:'',titulo:'',modulo:'',tipoActividad:'',mes:'',fechaProgramada:'',horaInicio:'',ubicacion:'',responsable:''};this.mostrarModalScheduler.set(true);}

  guardarNuevaActividadScheduler(): void {
    if (!this.nuevaActividad.titulo.trim()) return;
    const payload = {
      ...this.nuevaActividad,
      ...{},
      avance: 0,
      estado: 'PROGRAMADO'
    };

    this.api.callAjaxPost('/scheduler/insert', payload).subscribe({next:()=>{this.ngOnInit();this.mostrarModalScheduler.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  marcarActividadEjecutada(act: ActividadSchedulerItem): void {this.workflowSelectionOpen.set(true);}



  enviarReporteAutoservicio(): void {
    if (!this.formAutoservicio.descripcion.trim()) return;
    this.api.callAjaxPost('/acinseguro/insert', {
      tipo: this.formAutoservicio.tipo,
      ubicacion: this.formAutoservicio.ubicacion,
      descripcion: this.formAutoservicio.descripcion,
      urgencia: this.formAutoservicio.urgencia,
      reportadoPor: this.session.usuarioNombre()
    }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  private finalizarEnvioAutoservicio():void{this.cargarDatosBackend();}

  private mostrarNotificacion(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
