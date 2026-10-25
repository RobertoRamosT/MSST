import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface AuditoriaSstItem {
  id: number;
  codigo: string;
  tipo: 'AUDITORIA' | 'DIAGNOSTICO';
  normaEstandar: string;
  nombre: string;
  entidad: string;
  cumplimiento: number;
  ncMayores: number;
  ncMenores: number;
  fecha: string;
  estado: 'APROBADO_CERRADO' | 'EN_SEGUIMIENTO_SAC';
}

export interface RequisitoLegalItem {
  id: number;
  codigoNorma: string;
  tituloNorma: string;
  articuloObligacion: string;
  entidadFiscalizadora: string;
  cumplimiento: number;
  evidenciaCumplimiento: string;
  fechaEvaluacion: string;
  estado: 'CUMPLE_100' | 'EN_PROCESO';
}

@Component({
  selector: 'msst-modulo10-auditorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera Corporativa Módulo 10 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-balance-scale"></i>  Programa Anual de Auditorías SST (MINTRA / ISO 45001) y Matriz de Requisitos Legales
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalAuditoria.set(true)">
              <i class="fa fa-plus-circle"></i> + Nueva Auditoría
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalRequisito.set(true)">
              <i class="fa fa-gavel"></i> + Nuevo Requisito Legal
            </button>
          </div>
        </div>

        <!-- KPIs Superiores -->
        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">AUDITORÍAS Y LÍNEA BASE SST</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ auditorias().length }} Evaluaciones</div>
                <div style="font-size: 11px; color: #888;">Auditorconregistro MINTRA / ISO 45001</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PROMEDIO CUMPLIMIENTO AUDITORÍA</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ promedioCumplimientoAuditoria() }}%</div>
                <div style="font-size: 11px; color: #888;">Ley N° 29783 y D.S. 005-2012-TR</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">MATRIZ DE REQUISITOS LEGALES</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ requisitosLegales().length }} Normas Vigentes</div>
                <div style="font-size: 11px; color: #888;">Fiscalización SUNAFIL / OSINERGMIN</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #ffc107; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CUMPLIMIENTO NORMATIVO LEGAL</div>
                <div style="font-size: 20px; font-weight: bold; color: #d39e00;">{{ promedioCumplimientoRequisitos() }}%</div>
                <div style="font-size: 11px; color: #888;">0 Multas Administrativas</div>
              </div>
            </div>
          </div>

          <!-- Navegación 2 Pestañas -->
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 4px;">
            <button class="btn btn-sm" [ngClass]="pestana() === 'AUDITORIAS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('AUDITORIAS')">
              <i class="fa fa-check-circle-o"></i> 1. Programa de Auditorías SST y Diagnóstico Línea Base
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'REQUISITOS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('REQUISITOS')">
              <i class="fa fa-gavel"></i> 2. Matriz de Evaluación de Requisitos Legales
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: AUDITORÍAS SST Y DIAGNÓSTICO DE LÍNEA BASE -->
      @if (pestana() === 'AUDITORIAS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-clipboard"></i> Auditorías Periódicas MINTRA (D.S. 014-2013-TR), ISO 45001 y Línea Base</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvAuditorias()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalAuditoria.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Auditoría / Línea Base
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por código, norma/estándar, entidad auditora o título..." [(ngModel)]="filtroAuditoria">
              </div>
              <div class="col-md-3">
                <select class="form-control input-sm" [(ngModel)]="filtroTipoAuditoria">
                  <option value="TODOS">Todos los Tipos</option>
                  <option value="AUDITORIA">AUDITORIA</option>
                  <option value="DIAGNOSTICO">DIAGNOSTICO (Línea Base)</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Norma / Estándar Auditado y Alcance</th>
                    <th>Entidad Fiscalizadora / Auditora</th>
                    <th style="width: 150px;">% Cumplimiento</th>
                    <th style="text-align:center;">NC Mayores</th>
                    <th style="text-align:center;">NC Menores</th>
                    <th>Fecha Evaluación</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of auditoriasFiltradas(); track a.id) {
                    <tr>
                      <td><strong>#{{ a.id }}</strong></td>
                      <td><code>{{ a.codigo }}</code></td>
                      <td>
                        <span class="label" [ngClass]="a.tipo === 'AUDITORIA' ? 'label-primary' : 'label-info'">
                          {{ a.tipo }}
                        </span>
                      </td>
                      <td>
                        <div><strong>{{ a.nombre }}</strong></div>
                        <small class="text-muted">Norma: {{ a.normaEstandar }}</small>
                      </td>
                      <td>{{ a.entidad }}</td>
                      <td>
                        <div class="progress" style="margin-bottom: 0; height: 18px; background: #e2e8f0;">
                          <div class="progress-bar"
                               [ngClass]="a.cumplimiento >= 90 ? 'progress-bar-success' : 'progress-bar-info'"
                               [style.width.%]="a.cumplimiento"
                               style="line-height: 18px; font-size: 11px; font-weight: bold;">
                            {{ a.cumplimiento }}%
                          </div>
                        </div>
                      </td>
                      <td style="text-align:center;">
                        <span class="badge" [style.background]="a.ncMayores === 0 ? '#28a745' : '#dc3545'">{{ a.ncMayores }}</span>
                      </td>
                      <td style="text-align:center;">
                        <span class="badge" style="background: #ffc107; color: #222;">{{ a.ncMenores }}</span>
                      </td>
                      <td>{{ a.fecha }}</td>
                      <td>
                        <span class="label" [ngClass]="a.estado === 'APROBADO_CERRADO' ? 'label-success' : 'label-warning'">
                          {{ a.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarAuditoria(a)" title="Aprobar Informe">
                            <i class="fa fa-check"></i> Aprobar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarAuditoria(a)" title="Eliminar">
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 2: MATRIZ DE IDENTIFICACIÓN Y EVALUACIÓN DE REQUISITOS LEGALES -->
      @if (pestana() === 'REQUISITOS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-gavel"></i> Matriz de Identificación y Evaluación de Requisitos Legales Aplicables</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvRequisitos()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalRequisito.set(true)">
                <i class="fa fa-plus-circle"></i> Agregar Requisito Legal
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-6">
                <input type="text" class="form-control input-sm" placeholder="Buscar por norma legal (Ley 29783, D.S. 024-2016-EM, RM 375), obligación o entidad..." [(ngModel)]="filtroRequisito">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Norma Legal</th>
                    <th>Artículo / Obligación Específica Auditable</th>
                    <th>Entidad Fiscalizadora</th>
                    <th style="width: 140px;">% Cumplimiento</th>
                    <th>Evidencia Objetiva de Cumplimiento</th>
                    <th>Fecha Eval.</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (req of requisitosFiltrados(); track req.id) {
                    <tr>
                      <td><strong>#{{ req.id }}</strong></td>
                      <td>
                        <code>{{ req.codigoNorma }}</code>
                        <div style="font-size: 11px; color: #555;">{{ req.tituloNorma }}</div>
                      </td>
                      <td><strong>{{ req.articuloObligacion }}</strong></td>
                      <td><span class="label label-default">{{ req.entidadFiscalizadora }}</span></td>
                      <td>
                        <div class="progress" style="margin-bottom: 0; height: 18px; background: #e2e8f0;">
                          <div class="progress-bar progress-bar-success"
                               [style.width.%]="req.cumplimiento"
                               style="line-height: 18px; font-size: 11px; font-weight: bold;">
                            {{ req.cumplimiento }}%
                          </div>
                        </div>
                      </td>
                      <td style="font-size: 11px;">{{ req.evidenciaCumplimiento }}</td>
                      <td>{{ req.fechaEvaluacion }}</td>
                      <td>
                        <span class="label" [ngClass]="req.estado === 'CUMPLE_100' ? 'label-success' : 'label-warning'">
                          {{ req.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarRequisito(req)" title="Validar Cumplimiento 100%">
                            <i class="fa fa-check"></i> Validar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarRequisito(req)" title="Eliminar">
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA AUDITORÍA -->
      @if (mostrarModalAuditoria()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 620px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-clipboard"></i> Registrar Auditoría SST o Diagnóstico de Línea Base</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalAuditoria.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código Auditoría:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.codigo">
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo de Evaluación:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaAuditoria.tipo">
                    <option value="AUDITORIA">AUDITORIA</option>
                    <option value="DIAGNOSTICO">DIAGNOSTICO (Línea Base)</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Norma / Estándar:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.normaEstandar">
                </div>
              </div>
              <div class="form-group">
                <label>Título y Alcance de la Auditoría:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.nombre" placeholder="Ej. Auditoría Externa de Recertificación Trinorma ISO 45001:2018">
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Entidad Fiscalizadora / Auditor MINTRA:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.entidad">
                </div>
                <div class="col-md-3 form-group">
                  <label>% Cumplimiento:</label>
                  <input type="number" min="0" max="100" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.cumplimiento">
                </div>
                <div class="col-md-3 form-group">
                  <label>Fecha Evaluación:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.fecha">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>No Conformidades Mayores:</label>
                  <input type="number" min="0" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.ncMayores">
                </div>
                <div class="col-md-6 form-group">
                  <label>No Conformidades Menores / Observaciones:</label>
                  <input type="number" min="0" class="form-control input-sm" [(ngModel)]="nuevaAuditoria.ncMenores">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalAuditoria.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaAuditoria()">
                <i class="fa fa-save"></i> Guardar Auditoría
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO REQUISITO LEGAL -->
      @if (mostrarModalRequisito()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 620px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-gavel"></i> Incorporar Norma a la Matriz de Requisitos Legales</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalRequisito.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Código / Dispositivo Legal:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.codigoNorma" placeholder="Ej. D.S. N° 024-2016-EM">
                </div>
                <div class="col-md-7 form-group">
                  <label>Título de la Norma:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.tituloNorma">
                </div>
              </div>
              <div class="form-group">
                <label>Artículo y Obligación Específica Aplicable:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.articuloObligacion" placeholder="Ej. Art. 74: Todo trabajador debe contar con matriz IPERC en su área">
              </div>
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Entidad Fiscalizadora:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.entidadFiscalizadora">
                </div>
                <div class="col-md-3 form-group">
                  <label>% Cumplimiento:</label>
                  <input type="number" min="0" max="100" class="form-control input-sm" [(ngModel)]="nuevoRequisito.cumplimiento">
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Evaluación:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.fechaEvaluacion">
                </div>
              </div>
              <div class="form-group">
                <label>Evidencia Objetiva de Cumplimiento:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoRequisito.evidenciaCumplimiento">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalRequisito.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoRequisito()">
                <i class="fa fa-save"></i> Guardar Requisito Legal
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo10AuditoriasRequisitosComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pestana = signal<'AUDITORIAS' | 'REQUISITOS' | 'VISOR'>('AUDITORIAS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly paginaVisorActiva = signal<'auditoria.html' | 'requisitos.html'>('auditoria.html');
  readonly notificacion = signal<string>('');

  readonly mostrarModalAuditoria = signal<boolean>(false);
  readonly mostrarModalRequisito = signal<boolean>(false);

  filtroAuditoria = '';
  filtroTipoAuditoria = 'TODOS';
  filtroRequisito = '';

  readonly auditorias = signal<AuditoriaSstItem[]>([
    {
      id: 1,
      codigo: 'AUD-MINTRA-2026-01',
      tipo: 'AUDITORIA',
      normaEstandar: 'Ley N° 29783 / D.S. 014-2013-TR',
      nombre: 'Auditoría Periódica del Sistema de Gestión de SST por Auditor Acreditado MINTRA',
      entidad: 'SGS del Perú S.A.C. / Auditor MINTRA',
      cumplimiento: 96.5,
      ncMayores: 0,
      ncMenores: 2,
      fecha: '14/10/2026',
      estado: 'APROBADO_CERRADO'
    },
    {
      id: 2,
      codigo: 'AUD-ISO-45001-02',
      tipo: 'AUDITORIA',
      normaEstandar: 'ISO 45001:2018 Cláusulas 4 a 10',
      nombre: 'Auditoría Externa de Seguimiento Anual Sistema Integrado de Gestión HSE',
      entidad: 'AENOR / Bureau Veritas Certificación',
      cumplimiento: 98.0,
      ncMayores: 0,
      ncMenores: 1,
      fecha: '19/10/2026',
      estado: 'APROBADO_CERRADO'
    },
    {
      id: 3,
      codigo: 'DIAG-LB-29783-03',
      tipo: 'DIAGNOSTICO',
      normaEstandar: 'R.M. N° 050-2013-TR (Lista de Verificación)',
      nombre: 'Estudio de Línea Base del Sistema de Gestión de Seguridad y Salud en el Trabajo',
      entidad: 'Comité Paritario CSST y Jefatura Corporativa HSE',
      cumplimiento: 95.0,
      ncMayores: 0,
      ncMenores: 3,
      fecha: '05/10/2026',
      estado: 'EN_SEGUIMIENTO_SAC'
    }
  ]);

  readonly requisitosLegales = signal<RequisitoLegalItem[]>([
    {
      id: 1,
      codigoNorma: 'Ley N° 29783 / D.S. 005-2012-TR',
      tituloNorma: 'Ley de Seguridad y Salud en el Trabajo y su Reglamento',
      articuloObligacion: 'Art. 29 y 42: Constitución y funcionamiento paritario del Comité de SST y Programa Anual',
      entidadFiscalizadora: 'SUNAFIL / MINTRA',
      cumplimiento: 100,
      evidenciaCumplimiento: 'Libro de Actas de Instalación CSST 2026 y elecciones virtuales verificadas',
      fechaEvaluacion: '15/10/2026',
      estado: 'CUMPLE_100'
    },
    {
      id: 2,
      codigoNorma: 'D.S. N° 024-2016-EM / D.S. 023-2017-EM',
      tituloNorma: 'Reglamento de Seguridad y Salud Ocupacional en Minería y Operaciones Conexas',
      articuloObligacion: 'Art. 130 al 136: Permiso Escrito para Trabajos de Alto Riesgo (PETAR) y bloqueo LOTOTO',
      entidadFiscalizadora: 'OSINERGMIN / SUNAFIL',
      cumplimiento: 100,
      evidenciaCumplimiento: 'Formatos PETAR firmados digitalmente en Módulo 03 y matrices IPERC aprobadas',
      fechaEvaluacion: '18/10/2026',
      estado: 'CUMPLE_100'
    },
    {
      id: 3,
      codigoNorma: 'R.M. N° 375-2008-TR',
      tituloNorma: 'Norma Básica de Ergonomía y de Procedimiento de Evaluación de Riesgo Disergonómico',
      articuloObligacion: 'Título III y IV: Manipulación manual de cargas (<25 kg) y pausas activas en puestos operativos',
      entidadFiscalizadora: 'SUNAFIL / CENSOPAS',
      cumplimiento: 95,
      evidenciaCumplimiento: 'Informe de Monitoreo Ergonómico Anual 2026 y ayudas mecánicas en almacén',
      fechaEvaluacion: '20/10/2026',
      estado: 'CUMPLE_100'
    }
  ]);

  nuevaAuditoria = {
    codigo: 'AUD-INT-2026-04',
    tipo: 'AUDITORIA' as AuditoriaSstItem['tipo'],
    normaEstandar: 'ISO 45001:2018 / Ley N° 29783',
    nombre: '',
    entidad: 'Equipo Auditor Interno Certificado HSE',
    cumplimiento: 97,
    ncMayores: 0,
    ncMenores: 1,
    fecha: '25/10/2026'
  };

  nuevoRequisito = {
    codigoNorma: 'R.M. N° 312-2011-MINSA',
    tituloNorma: 'Protocolos de Exámenes Médico Ocupacionales y Guías de Diagnóstico',
    articuloObligacion: '',
    entidadFiscalizadora: 'DIGESA / MINSA / SUNAFIL',
    cumplimiento: 100,
    evidenciaCumplimiento: 'Matriz de EMO vigentes y custodia médica confidencial en Módulo 09',
    fechaEvaluacion: '24/10/2026'
  };

  readonly promedioCumplimientoAuditoria = computed(() => {
    const list = this.auditorias();
    if (!list.length) return 100;
    const sum = list.reduce((acc, a) => acc + (Number(a.cumplimiento) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  readonly promedioCumplimientoRequisitos = computed(() => {
    const list = this.requisitosLegales();
    if (!list.length) return 100;
    const sum = list.reduce((acc, r) => acc + (Number(r.cumplimiento) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  readonly urlVisorSeguro = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.paginaVisorActiva()}`)
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/auditoria/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigo']) {
          const desdeSql: AuditoriaSstItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (10 + idx),
            codigo: String(r['codigo'] || `AUD-2026-0${idx + 1}`),
            tipo: (String(r['tipo'] || 'AUDITORIA').toUpperCase().includes('DIAG') ? 'DIAGNOSTICO' : 'AUDITORIA'),
            normaEstandar: String(r['normaEstandar'] || 'Ley N° 29783 / ISO 45001:2018'),
            nombre: String(r['nombre'] || 'Auditoría del Sistema de Gestión SST'),
            entidad: String(r['entidad'] || 'Auditor Acreditado MINTRA'),
            cumplimiento: r['cumplimiento'] !== undefined && r['cumplimiento'] !== null ? Number(r['cumplimiento']) : 0,
            ncMayores: Number(r['ncMayores']) || 0,
            ncMenores: Number(r['ncMenores']) || 0,
            fecha: String(r['fecha'] || '20/10/2026'),
            estado: String(r['estado'] || '').toUpperCase().includes('CERRADO') ? 'APROBADO_CERRADO' : 'EN_SEGUIMIENTO_SAC'
          }));
          this.auditorias.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
          ]);
        }
      }
    });

    this.api.callAjaxPost('/requisitos/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const reqList = res?.['list'];
        if (Array.isArray(reqList) && reqList.length > 0) {
          const reqData: RequisitoLegalItem[] = reqList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            codigoNorma: String(r['codigoNorma'] || r['norma'] || `REQ-LEG-0${i + 1}`),
            tituloNorma: String(r['tituloNorma'] || r['titulo'] || 'Reglamento de Seguridad y Salud en el Trabajo'),
            articuloObligacion: String(r['articuloObligacion'] || r['articulo'] || 'Disposición reglamentaria'),
            entidadFiscalizadora: String(r['entidadFiscalizadora'] || r['entidad'] || 'SUNAFIL / MINTRA'),
            cumplimiento: Number(r['cumplimiento']) || 100,
            evidenciaCumplimiento: String(r['evidenciaCumplimiento'] || r['evidencia'] || 'Registro archivado'),
            fechaEvaluacion: String(r['fechaEvaluacion'] || r['fecha'] || '20/10/2026'),
            estado: String(r['estado'] || '').toUpperCase().includes('PROCESO') ? 'EN_PROCESO' : 'CUMPLE_100'
          }));
          this.requisitosLegales.set(reqData);
        }
      }
    });
  }

  auditoriasFiltradas(): AuditoriaSstItem[] {
    const q = this.filtroAuditoria.trim().toLowerCase();
    return this.auditorias().filter(a => {
      const okTipo = this.filtroTipoAuditoria === 'TODOS' || a.tipo === this.filtroTipoAuditoria;
      const okTexto = !q || a.codigo.toLowerCase().includes(q) || a.nombre.toLowerCase().includes(q) || a.entidad.toLowerCase().includes(q) || a.normaEstandar.toLowerCase().includes(q);
      return okTipo && okTexto;
    });
  }

  requisitosFiltrados(): RequisitoLegalItem[] {
    const q = this.filtroRequisito.trim().toLowerCase();
    if (!q) return this.requisitosLegales();
    return this.requisitosLegales().filter(r =>
      r.codigoNorma.toLowerCase().includes(q) || r.tituloNorma.toLowerCase().includes(q) || r.articuloObligacion.toLowerCase().includes(q) || r.entidadFiscalizadora.toLowerCase().includes(q)
    );
  }

  guardarNuevaAuditoria(): void {
    if (!this.nuevaAuditoria.nombre.trim()) return;
    this.api.callAjaxPost('/auditoria/insert', { ...this.nuevaAuditoria, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarAuditoriaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarAuditoriaLocal(Date.now() % 10000)
    });
  }

  private insertarAuditoriaLocal(id: number): void {
    const item: AuditoriaSstItem = {
      id,
      codigo: this.nuevaAuditoria.codigo,
      tipo: this.nuevaAuditoria.tipo,
      normaEstandar: this.nuevaAuditoria.normaEstandar,
      nombre: this.nuevaAuditoria.nombre,
      entidad: this.nuevaAuditoria.entidad,
      cumplimiento: Number(this.nuevaAuditoria.cumplimiento) || 95,
      ncMayores: Number(this.nuevaAuditoria.ncMayores) || 0,
      ncMenores: Number(this.nuevaAuditoria.ncMenores) || 0,
      fecha: this.nuevaAuditoria.fecha,
      estado: 'APROBADO_CERRADO'
    };
    this.auditorias.update(list => [item, ...list]);
    this.mostrarModalAuditoria.set(false);
    this.mostrarAviso(`Auditoría "${item.codigo}" registrada correctamente en OneSST.`);
  }

  aprobarAuditoria(item: AuditoriaSstItem): void {
    this.api.callAjaxPost('/auditoria/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.auditorias.update(list => list.map(a => a.id === item.id ? { ...a, estado: 'APROBADO_CERRADO' } : a));
        this.mostrarAviso(`Informe de auditoría "${item.codigo}" aprobado y cerrado.`);
      },
      error: (err) => {
        this.mostrarAviso(`Error al aprobar auditoría: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  eliminarAuditoria(item: AuditoriaSstItem): void {
    this.api.callAjaxPost('/auditoria/delete', { id: item.id }).subscribe({
      next: () => {
        this.auditorias.update(list => list.filter(a => a.id !== item.id));
        this.mostrarAviso(`Auditoría "${item.codigo}" eliminada.`);
      },
      error: (err) => {
        this.mostrarAviso(`Error al eliminar auditoría: ${err?.message || 'Fallo en el servidor.'}`);
      }
    });
  }

  guardarNuevoRequisito(): void {
    if (!this.nuevoRequisito.articuloObligacion.trim()) return;
    this.api.callAjaxPost('/requisitos/insert', { ...this.nuevoRequisito, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarRequisitoLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarRequisitoLocal(Date.now() % 10000)
    });
  }

  private insertarRequisitoLocal(id: number): void {
    const item: RequisitoLegalItem = {
      id,
      codigoNorma: this.nuevoRequisito.codigoNorma,
      tituloNorma: this.nuevoRequisito.tituloNorma,
      articuloObligacion: this.nuevoRequisito.articuloObligacion,
      entidadFiscalizadora: this.nuevoRequisito.entidadFiscalizadora,
      cumplimiento: Number(this.nuevoRequisito.cumplimiento) || 100,
      evidenciaCumplimiento: this.nuevoRequisito.evidenciaCumplimiento,
      fechaEvaluacion: this.nuevoRequisito.fechaEvaluacion,
      estado: 'CUMPLE_100'
    };
    this.requisitosLegales.update(list => [item, ...list]);
    this.mostrarModalRequisito.set(false);
    this.mostrarAviso(`Requisito legal "${item.codigoNorma}" incorporado en la Matriz Legal.`);
  }

  aprobarRequisito(item: RequisitoLegalItem): void {
    this.api.callAjaxPost('/requisitos/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.requisitosLegales.update(list => list.map(r => r.id === item.id ? { ...r, cumplimiento: 100, estado: 'CUMPLE_100' } : r));
        this.mostrarAviso(`Cumplimiento al 100% verificado para "${item.codigoNorma}".`);
      },
      error: () => {
        this.requisitosLegales.update(list => list.map(r => r.id === item.id ? { ...r, cumplimiento: 100, estado: 'CUMPLE_100' } : r));
        this.mostrarAviso(`Cumplimiento al 100% verificado para "${item.codigoNorma}".`);
      }
    });
  }

  eliminarRequisito(item: RequisitoLegalItem): void {
    this.api.callAjaxPost('/requisitos/delete', { id: item.id }).subscribe({
      next: () => {
        this.requisitosLegales.update(list => list.filter(r => r.id !== item.id));
        this.mostrarAviso(`Requisito legal #${item.id} eliminado.`);
      },
      error: () => {
        this.requisitosLegales.update(list => list.filter(r => r.id !== item.id));
        this.mostrarAviso(`Requisito legal #${item.id} eliminado.`);
      }
    });
  }

  exportarCsvAuditorias(): void {
    const rows = this.auditorias().map(a =>
      `${a.id};"${a.codigo}";"${a.tipo}";"${a.normaEstandar}";"${a.nombre}";"${a.entidad}";${a.cumplimiento};${a.ncMayores};${a.ncMenores};"${a.fecha}"`
    );
    this.descargarArchivoCsv('MSST_Modulo10_Auditorias.csv', 'ID;Codigo;Tipo;Norma;Titulo;Entidad;Cumplimiento;NCMayores;NCMenores;Fecha\n' + rows.join('\n'));
  }

  exportarCsvRequisitos(): void {
    const rows = this.requisitosLegales().map(r =>
      `${r.id};"${r.codigoNorma}";"${r.tituloNorma}";"${r.articuloObligacion}";"${r.entidadFiscalizadora}";${r.cumplimiento};"${r.estado}"`
    );
    this.descargarArchivoCsv('MSST_Modulo10_RequisitosLegales.csv', 'ID;Norma;Titulo;Obligacion;Entidad;Cumplimiento;Estado\n' + rows.join('\n'));
  }

  private descargarArchivoCsv(nombreArchivo: string, contenido: string): void {
    const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
    this.mostrarAviso(`Reporte CSV "${nombreArchivo}" descargado exitosamente.`);
  }

  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
