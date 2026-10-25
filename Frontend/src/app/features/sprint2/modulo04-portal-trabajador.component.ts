import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface PendienteTrabajadorItem {
  id: number;
  codigo: string;
  categoria: 'DOCUMENTO_SST' | 'ENTREGA_EPP' | 'CURSO_LMS' | 'COMITE_SST';
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  estadoFirma: 'PENDIENTE' | 'FIRMADO';
  hashFirma?: string;
}

export interface ActividadSchedulerItem {
  id: number;
  codigo: string;
  titulo: string;
  modulo: string;
  tipoActividad: string;
  mes: string;
  fechaProgramada: string;
  horaInicio: string;
  responsable: string;
  ubicacion: string;
  avance: number;
  estado: 'PROGRAMADO' | 'EN_EJECUCION' | 'EJECUTADO' | 'REPROGRAMADO';
}

export interface CapituloManualItem {
  id: number;
  numero: string;
  titulo: string;
  moduloRef: string;
  resumen: string;
  pasosClave: string[];
  paginaHtml: string;
}

@Component({
  selector: 'msst-modulo04-portal-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">APTO VIGENTE</div>
                <div style="font-size: 11px; color: #888;">Vence: 15/11/2026 (Clínica Internacional)</div>
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
                  <option value="TODOS">Todos los Meses (Anual 2026)</option>
                  <option value="OCTUBRE">Octubre 2026</option>
                  <option value="NOVIEMBRE">Noviembre 2026</option>
                  <option value="DICIEMBRE">Diciembre 2026</option>
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
                <p><strong>Último EMO Periódico:</strong> 15/11/2025 — <span class="label label-success">APTO PARA TRABAJO EN ALTURA Y ESPACIOS CONFINADOS</span></p>
                <p><strong>Grupo Sanguíneo:</strong> O Rh Positivo (+) | <strong>Restricciones:</strong> Uso obligatorio de protección auditiva doble en zona de chancado.</p>
                <p><strong>Vacunación Ocupacional:</strong> Tétanos (3 dosis completas), Influenza 2026, Fiebre Amarilla.</p>
                <a class="btn btn-xs btn-success" href="/sst/evidencia/ver?codigo=CERT-EMO-2026" target="_blank">
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
                <span class="label label-info">Actualizado 2026</span>
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
  readonly autorFrase = signal<string>('HOLCIM PERÚ — Gestión Corporativa OneSST');
  readonly mensajeExito = signal<string>('');
  readonly mostrarModalScheduler = signal<boolean>(false);
  readonly reportesEnviadosCount = signal<number>(4);

  filtroPendientes = '';
  filtroCategoriaPendiente = 'TODOS';
  filtroMesCalendario = 'TODOS';
  filtroModuloCalendario = 'TODOS';
  filtroManual = '';

  readonly pendientes = signal<PendienteTrabajadorItem[]>([
    {
      id: 1,
      codigo: 'DOC-RISST-2026',
      categoria: 'DOCUMENTO_SST',
      titulo: 'Entrega de Reglamento Interno de Seguridad y Salud en el Trabajo (RISST 2026)',
      descripcion: 'Cargo obligatorio de recepción y lectura conforme al Art. 75 del D.S. 005-2012-TR.',
      fechaLimite: '30/10/2026',
      prioridad: 'ALTA',
      estadoFirma: 'PENDIENTE'
    },
    {
      id: 2,
      codigo: 'DOC-IPERC-PUESTO-08',
      categoria: 'DOCUMENTO_SST',
      titulo: 'Recomendaciones de Seguridad y Matriz IPERC por Puesto de Trabajo',
      descripcion: 'Anexo adjunto al contrato de trabajo con peligros y controles del puesto operativo.',
      fechaLimite: '31/10/2026',
      prioridad: 'ALTA',
      estadoFirma: 'PENDIENTE'
    },
    {
      id: 3,
      codigo: 'EPP-CARGO-2026-041',
      categoria: 'ENTREGA_EPP',
      titulo: 'Cargo de Renovación de Casco Dielectrico 3M y Botines Punta Composite',
      descripcion: 'Validación biométrica/digital de entrega en almacén central Planta Condorcocha.',
      fechaLimite: '02/11/2026',
      prioridad: 'MEDIA',
      estadoFirma: 'PENDIENTE'
    },
    {
      id: 4,
      codigo: 'LMS-LOTOTO-2026',
      categoria: 'CURSO_LMS',
      titulo: 'Declaración Jurada de Aprobación Curso Aislamiento de Energía (LOTOTO)',
      descripcion: 'Constancia de evaluación aprobada con nota 19/20 en el Aula Virtual SST.',
      fechaLimite: '25/10/2026',
      prioridad: 'MEDIA',
      estadoFirma: 'FIRMADO',
      hashFirma: 'SHA256-9F8A2C'
    },
    {
      id: 5,
      codigo: 'ACTA-CSST-2026-10',
      categoria: 'COMITE_SST',
      titulo: 'Acta de Reunión Ordinaria Mensual del Comité Paritario SST - Octubre 2026',
      descripcion: 'Revisión y firma digital como miembro titular del CSST.',
      fechaLimite: '28/10/2026',
      prioridad: 'BAJA',
      estadoFirma: 'FIRMADO',
      hashFirma: 'SHA256-4B1E7D'
    }
  ]);

  readonly actividadesCalendario = signal<ActividadSchedulerItem[]>([
    {
      id: 101,
      codigo: 'PASST-2026-01',
      titulo: 'Inspección Mensual de Sistemas Contra Incendios y Extintores PQS/CO2',
      modulo: 'INSPECCIONES',
      tipoActividad: 'Inspección Planeada Mensual',
      mes: 'OCTUBRE',
      fechaProgramada: '26/10/2026',
      horaInicio: '08:30',
      responsable: 'Ing. Carlos Mendoza (Jefe SST)',
      ubicacion: 'Planta Condorcocha - Almacén y Molienda',
      avance: 100,
      estado: 'EJECUTADO'
    },
    {
      id: 102,
      codigo: 'PASST-2026-02',
      titulo: 'Actualización Participativa de Matriz IPERC Línea de Clinkerización',
      modulo: 'IPERC',
      tipoActividad: 'Revisión Anual IPERC (Art. 57 Ley 29783)',
      mes: 'OCTUBRE',
      fechaProgramada: '28/10/2026',
      horaInicio: '10:00',
      responsable: 'Sup. Jorge Chávez / Comité SST',
      ubicacion: 'Planta Condorcocha - Horno Principal',
      avance: 75,
      estado: 'EN_EJECUCION'
    },
    {
      id: 103,
      codigo: 'PASST-2026-03',
      titulo: 'Simulacro Nacional Multipeligro y Respuesta de Brigada HAZMAT',
      modulo: 'SIMULACRO',
      tipoActividad: 'Simulacro de Emergencia Programado',
      mes: 'NOVIEMBRE',
      fechaProgramada: '05/11/2026',
      horaInicio: '15:00',
      responsable: 'Cmdte. Brigada Luis Paredes',
      ubicacion: 'Todas las Sedes (Condorcocha y Huachipa)',
      avance: 20,
      estado: 'PROGRAMADO'
    },
    {
      id: 104,
      codigo: 'PASST-2026-04',
      titulo: 'Sesión Ordinaria N° 11 del Comité de Seguridad y Salud en el Trabajo',
      modulo: 'COMITE',
      tipoActividad: 'Sesión Mensual CSST',
      mes: 'NOVIEMBRE',
      fechaProgramada: '12/11/2026',
      horaInicio: '09:00',
      responsable: 'Presidente CSST - Ing. Roberto Elias',
      ubicacion: 'Sala de Directorio SST / Microsoft Teams',
      avance: 0,
      estado: 'PROGRAMADO'
    },
    {
      id: 105,
      codigo: 'PASST-2026-05',
      titulo: 'Capacitación Específica: Trabajos en Caliente y Espacios Confinados (PETAR)',
      modulo: 'CAPACITACION',
      tipoActividad: 'Capacitación Presencial + Evaluación Online',
      mes: 'DICIEMBRE',
      fechaProgramada: '03/12/2026',
      horaInicio: '14:00',
      responsable: 'Ing. Elena Vargas (Instructora HSEQ)',
      ubicacion: 'Auditorio Central Planta Huachipa',
      avance: 0,
      estado: 'PROGRAMADO'
    }
  ]);

  readonly capitulosManual = signal<CapituloManualItem[]>([
    {
      id: 1,
      numero: '01',
      titulo: 'Portal Principal del Trabajador, Firma Electrónica y Calendario PASST',
      moduloRef: 'Módulo 04',
      resumen: 'Guía operativa para revisar documentos pendientes, firmar cargos de EPP/RISST y consultar las actividades programadas en el calendario anual SST.',
      pasosClave: [
        'Acceder a la Bandeja de Pendientes y verificar el documento PDF.',
        'Hacer clic en "Firmar Digitalmente" para estampar el sello criptográfico SHA-256.',
        'Programar nuevas actividades en el Calendario anual mediante el botón Agendar Actividad.'
      ],
      paginaHtml: 'main.html'
    },
    {
      id: 2,
      numero: '02',
      titulo: 'Gestión de Trabajadores Propios, Comité Paritario y Elección Virtual',
      moduloRef: 'Módulo 05',
      resumen: 'Administración de fichas de personal, tallas de EPP, seguimiento de acuerdos del Comité SST y sufragio electrónico secreto.',
      pasosClave: [
        'Filtrar colaboradores por DNI, área o puesto y actualizar sus tallas de casco, calzado y uniforme.',
        'Registrar actas de reunión del Comité Paritario SST.',
        'Emitir voto electrónico cifrado en procesos electorales vigentes.'
      ],
      paginaHtml: 'trabajador.html'
    },
    {
      id: 3,
      numero: '03',
      titulo: 'Elaboración de Matriz IPERC, Inspecciones V2, OPT y Actos Subestándar',
      moduloRef: 'Módulo 06',
      resumen: 'Metodología para evaluar riesgos iniciales, aplicar jerarquía de controles (Eliminación, Sustitución, Ingeniería, Administrativo, EPP) y ejecutar inspecciones.',
      pasosClave: [
        'Seleccionar proceso, tarea, peligro y calcular el Nivel de Riesgo Inicial (Probabilidad x Severidad).',
        'Definir controles y verificar la reducción al Nivel de Riesgo Residual.',
        'Registrar Inspecciones V2, OPT y reportes de Actos/Condiciones Subestándar.'
      ],
      paginaHtml: 'iperc.html'
    },
    {
      id: 4,
      numero: '04',
      titulo: 'Investigación de Accidentes / Incidentes y Motor de Acciones de Mejora',
      moduloRef: 'Módulo 07',
      resumen: 'Flujo completo de reporte preliminar 24h, análisis de causalidad (Causas Inmediatas y Básicas) y trazabilidad de planes de acción.',
      pasosClave: [
        'Registrar el evento indicando gravedad, días de descanso médico y relato detallado.',
        'Determinar causas raíz y vincular medidas correctivas en el Motor Transversal.',
        'Actualizar el porcentaje de avance hasta el cierre verificado al 100%.'
      ],
      paginaHtml: 'accidentes.html'
    },
    {
      id: 5,
      numero: '05',
      titulo: 'Capacitaciones LMS, Kardex de EPP y Procedimientos PETS / Estándares',
      moduloRef: 'Módulo 08',
      resumen: 'Gestión del Programa Anual de Capacitaciones, evaluaciones calificables en línea, control de stock de EPP y repositorio documental PDF.',
      pasosClave: [
        'Inscribir personal en cursos del Programa Anual y rendir el Examen Online.',
        'Controlar el stock y vida útil de equipos de protección personal según norma ANSI/EN.',
        'Consultar procedimientos PETS vigentes con visor documental integrado.'
      ],
      paginaHtml: 'capacitacion.html'
    }
  ]);

  formAutoservicio = {
    tipo: 'CONDICION_SUBESTANDAR',
    ubicacion: 'Planta Condorcocha - Zona Chancado Primario',
    descripcion: '',
    urgencia: 'ALTA'
  };

  nuevaActividad = {
    codigo: 'PASST-2026-06',
    titulo: '',
    modulo: 'INSPECCIONES',
    tipoActividad: 'Inspección Planeada de Seguridad',
    mes: 'NOVIEMBRE',
    fechaProgramada: '18/11/2026',
    horaInicio: '09:00',
    ubicacion: 'Planta Condorcocha - Área de Mantenimiento',
    responsable: 'Ing. Carlos Mendoza'
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
    this.api.getEmpresaMensaje(773).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0) {
          this.fraseSeguridad.set(list[0]['frase'] || this.fraseSeguridad());
          this.autorFrase.set(list[0]['autor'] || this.autorFrase());
        }
      }
    });

    this.api.callAjaxPost('/scheduler/lista', { idEmpresa: 773, anio: 2026 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['titulo']) {
          this.actividadesCalendario.set(list as ActividadSchedulerItem[]);
        }
      }
    });
  }

  pendientesFiltrados(): PendienteTrabajadorItem[] {
    const q = this.filtroPendientes.trim().toLowerCase();
    return this.pendientes().filter(item => {
      const coincideCat = this.filtroCategoriaPendiente === 'TODOS' || item.categoria === this.filtroCategoriaPendiente;
      const coincideTexto = !q ||
        item.codigo.toLowerCase().includes(q) ||
        item.titulo.toLowerCase().includes(q) ||
        item.descripcion.toLowerCase().includes(q);
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
      c.titulo.toLowerCase().includes(q) ||
      c.resumen.toLowerCase().includes(q) ||
      c.moduloRef.toLowerCase().includes(q)
    );
  }

  async firmarPendiente(item: PendienteTrabajadorItem): Promise<void> {
    const dni = '45892103';
    const rawData = `${item.id}|${item.codigo}|${item.titulo}|${dni}|${new Date().toISOString()}`;
    const hash = await this.generarHashSha256(rawData);
    this.api.callAjaxPost('/trabajador/documento/firmar', {
      idDocumento: item.id,
      codigo: item.codigo,
      hashFirma: hash,
      dniFirmante: dni
    }).subscribe({
      next: () => {
        this.actualizarEstadoFirmaLocal(item.id, hash);
      },
      error: (err) => {
        // F14: En caso de fallo de transporte, conservar pendiente y comunicar el error
        this.mostrarNotificacion(`Error al firmar: ${err?.message || 'No se pudo comunicar con el servidor para registrar la firma digital.'}`);
      }
    });
  }

  private actualizarEstadoFirmaLocal(id: number, hash: string): void {
    this.pendientes.update(lista =>
      lista.map(p => p.id === id ? { ...p, estadoFirma: 'FIRMADO', hashFirma: hash } : p)
    );
    this.mostrarNotificacion(`Documento firmado digitalmente con éxito. Sello criptográfico: ${hash}`);
  }

  async firmarTodosPendientes(): Promise<void> {
    const dni = '45892103';
    const rawData = `LOTE|${dni}|${new Date().toISOString()}`;
    const hashLote = await this.generarHashSha256(rawData);
    this.api.callAjaxPost('/trabajador/documento/firmarMasivo', {
      hashLote,
      dniFirmante: dni
    }).subscribe({
      next: () => this.aplicarFirmaMasiva(hashLote),
      error: (err) => {
        // F14: En caso de error, no marcar firmados
        this.mostrarNotificacion(`Error en firma masiva: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  private async generarHashSha256(texto: string): Promise<string> {
    try {
      const msgBuffer = new TextEncoder().encode(texto);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return 'SHA256-' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
    } catch {
      return 'SHA256-DIGITAL-' + Math.abs(texto.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).toUpperCase();
    }
  }

  private aplicarFirmaMasiva(hashLote: string): void {
    this.pendientes.update(lista =>
      lista.map(p => p.estadoFirma === 'PENDIENTE' ? { ...p, estadoFirma: 'FIRMADO', hashFirma: hashLote } : p)
    );
    this.mostrarNotificacion(`Todos los documentos pendientes fueron firmados digitalmente (${hashLote}).`);
  }

  abrirModalScheduler(): void {
    const nextNum = this.actividadesCalendario().length + 1;
    this.nuevaActividad = {
      codigo: `PASST-2026-0${nextNum}`,
      titulo: '',
      modulo: 'INSPECCIONES',
      tipoActividad: 'Actividad Preventiva Programada',
      mes: 'NOVIEMBRE',
      fechaProgramada: '20/11/2026',
      horaInicio: '09:30',
      ubicacion: 'Planta Condorcocha',
      responsable: 'Ing. Carlos Mendoza'
    };
    this.mostrarModalScheduler.set(true);
  }

  guardarNuevaActividadScheduler(): void {
    if (!this.nuevaActividad.titulo.trim()) return;
    const payload = {
      ...this.nuevaActividad,
      idEmpresa: 773,
      avance: 0,
      estado: 'PROGRAMADO'
    };

    this.api.callAjaxPost('/scheduler/insert', payload).subscribe({
      next: (res) => {
        const nuevoId = Number(res?.['idGenerado']) || (Date.now() % 100000);
        this.agregarActividadLocal(nuevoId);
      },
      error: () => {
        this.agregarActividadLocal(Date.now() % 100000);
      }
    });
  }

  private agregarActividadLocal(id: number): void {
    const nueva: ActividadSchedulerItem = {
      id,
      codigo: this.nuevaActividad.codigo,
      titulo: this.nuevaActividad.titulo,
      modulo: this.nuevaActividad.modulo,
      tipoActividad: this.nuevaActividad.tipoActividad,
      mes: this.nuevaActividad.mes,
      fechaProgramada: this.nuevaActividad.fechaProgramada,
      horaInicio: this.nuevaActividad.horaInicio,
      responsable: this.nuevaActividad.responsable,
      ubicacion: this.nuevaActividad.ubicacion,
      avance: 0,
      estado: 'PROGRAMADO'
    };
    this.actividadesCalendario.update(list => [nueva, ...list]);
    this.mostrarModalScheduler.set(false);
    this.mostrarNotificacion(`Actividad "${nueva.titulo}" agendada correctamente en OneSST.`);
  }

  marcarActividadEjecutada(act: ActividadSchedulerItem): void {
    this.api.callAjaxPost('/scheduler/updateAvance', { id: act.id, avance: 100, estado: 'EJECUTADO' }).subscribe({
      next: () => this.actualizarActividadLocal(act.id),
      error: () => this.actualizarActividadLocal(act.id)
    });
  }

  private actualizarActividadLocal(id: number): void {
    this.actividadesCalendario.update(list =>
      list.map(a => a.id === id ? { ...a, avance: 100, estado: 'EJECUTADO' } : a)
    );
    this.mostrarNotificacion('Actividad marcada al 100% (EJECUTADO) en el Programa Anual SST.');
  }

  enviarReporteAutoservicio(): void {
    if (!this.formAutoservicio.descripcion.trim()) return;
    this.api.callAjaxPost('/acinseguro/insert', {
      tipo: this.formAutoservicio.tipo,
      ubicacion: this.formAutoservicio.ubicacion,
      descripcion: this.formAutoservicio.descripcion,
      urgencia: this.formAutoservicio.urgencia,
      reportadoPor: this.session.usuarioNombre()
    }).subscribe({
      next: () => this.finalizarEnvioAutoservicio(),
      error: () => this.finalizarEnvioAutoservicio()
    });
  }

  private finalizarEnvioAutoservicio(): void {
    this.reportesEnviadosCount.update(c => c + 1);
    this.formAutoservicio.descripcion = '';
    this.mostrarNotificacion('Reporte preventivo enviado desde el Autoservicio del Colaborador al Centro de Control SST.');
  }

  private mostrarNotificacion(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
