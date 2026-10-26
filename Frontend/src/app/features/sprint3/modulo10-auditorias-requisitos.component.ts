import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface AuditoriaSstItem {
  id: number;
  codigo: string | null;
  tipo: 'AUDITORIA' | 'DIAGNOSTICO' | null;
  normaEstandar: string | null;
  nombre: string | null;
  entidad: string | null;
  cumplimiento: number | null;
  ncMayores: number | null;
  ncMenores: number | null;
  fecha: string | null;
  estado: 'APROBADO_CERRADO' | 'EN_SEGUIMIENTO_SAC' | null;
}

export interface RequisitoLegalItem {
  id: number;
  codigoNorma: string | null;
  tituloNorma: string | null;
  articuloObligacion: string | null;
  entidadFiscalizadora: string | null;
  cumplimiento: number | null;
  evidenciaCumplimiento: string | null;
  fechaEvaluacion: string | null;
  estado: 'CUMPLE_100' | 'EN_PROCESO' | null;
}

@Component({
  selector: 'msst-modulo10-auditorias',
  standalone: true,
  imports: [QueryPagesComponent,WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

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
                               [ngClass]="(a.cumplimiento !== null && a.cumplimiento >= 90) ? 'progress-bar-success' : 'progress-bar-info'"
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

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo10AuditoriasRequisitosComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'AUDITORIAS' | 'REQUISITOS'>('AUDITORIAS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');

  readonly mostrarModalAuditoria = signal<boolean>(false);
  readonly mostrarModalRequisito = signal<boolean>(false);

  filtroAuditoria = '';
  filtroTipoAuditoria = 'TODOS';
  filtroRequisito = '';

  readonly auditorias = signal<AuditoriaSstItem[]>([]);

  readonly requisitosLegales = signal<RequisitoLegalItem[]>([]);

  nuevaAuditoria = {
    codigo: '',
    tipo: '' as AuditoriaSstItem['tipo'],
    normaEstandar: '',
    nombre: '',
    entidad: '',
    cumplimiento: 0,
    ncMayores: 0,
    ncMenores: 0,
    fecha: ''
  };

  nuevoRequisito = {
    codigoNorma: '',
    tituloNorma: '',
    articuloObligacion: '',
    entidadFiscalizadora: '',
    cumplimiento: 0,
    evidenciaCumplimiento: '',
    fechaEvaluacion: ''
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


  readonly pageRoutes=['/auditoria/lista', '/requisitos/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/auditoria/lista', { ...{} }).subscribe({next:(response)=>{try{this.auditorias.set(confirmedList<AuditoriaSstItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"tipo","kind":"string","optional":false,"nullable":true},{"name":"normaEstandar","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"entidad","kind":"string","optional":false,"nullable":true},{"name":"cumplimiento","kind":"number","optional":false,"nullable":true},{"name":"ncMayores","kind":"number","optional":false,"nullable":true},{"name":"ncMenores","kind":"number","optional":false,"nullable":true},{"name":"fecha","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/requisitos/lista', { ...{} }).subscribe({next:(response)=>{try{this.requisitosLegales.set(confirmedList<RequisitoLegalItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigoNorma","kind":"string","optional":false,"nullable":true},{"name":"tituloNorma","kind":"string","optional":false,"nullable":true},{"name":"articuloObligacion","kind":"string","optional":false,"nullable":true},{"name":"entidadFiscalizadora","kind":"string","optional":false,"nullable":true},{"name":"cumplimiento","kind":"number","optional":false,"nullable":true},{"name":"evidenciaCumplimiento","kind":"string","optional":false,"nullable":true},{"name":"fechaEvaluacion","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  auditoriasFiltradas(): AuditoriaSstItem[] {
    const q = this.filtroAuditoria.trim().toLowerCase();
    return this.auditorias().filter(a => {
      const okTipo = this.filtroTipoAuditoria === 'TODOS' || a.tipo === this.filtroTipoAuditoria;
      const okTexto = !q || (a.codigo??'').toLowerCase().includes(q) || (a.nombre??'').toLowerCase().includes(q) || (a.entidad??'').toLowerCase().includes(q) || (a.normaEstandar??'').toLowerCase().includes(q);
      return okTipo && okTexto;
    });
  }

  requisitosFiltrados(): RequisitoLegalItem[] {
    const q = this.filtroRequisito.trim().toLowerCase();
    if (!q) return this.requisitosLegales();
    return this.requisitosLegales().filter(r =>
      (r.codigoNorma??'').toLowerCase().includes(q) || (r.tituloNorma??'').toLowerCase().includes(q) || (r.articuloObligacion??'').toLowerCase().includes(q) || (r.entidadFiscalizadora??'').toLowerCase().includes(q)
    );
  }

  guardarNuevaAuditoria(): void {
    if (!this.nuevaAuditoria.nombre.trim()) return;
    this.api.callAjaxPost('/auditoria/insert', { ...this.nuevaAuditoria, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalAuditoria.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarAuditoria(item: AuditoriaSstItem): void {this.workflowSelectionOpen.set(true);}

  eliminarAuditoria(item: AuditoriaSstItem): void {
    this.api.callAjaxPost('/auditoria/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevoRequisito(): void {
    if (!this.nuevoRequisito.articuloObligacion.trim()) return;
    this.api.callAjaxPost('/requisitos/insert', { ...this.nuevoRequisito, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalRequisito.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarRequisito(item: RequisitoLegalItem): void {this.workflowSelectionOpen.set(true);}

  eliminarRequisito(item: RequisitoLegalItem): void {
    this.api.callAjaxPost('/requisitos/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
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
