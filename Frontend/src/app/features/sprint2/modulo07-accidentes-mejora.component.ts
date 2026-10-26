import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface AccidenteIncidenteItem {
  id: number;
  codigo: string | null;
  tipo: 'ACCIDENTE_TRABAJO' | 'INCIDENTE_PELIGROSO' | 'ACCIDENTE_VEHICULAR' | 'INCIDENTE_AMBIENTAL' | null;
  gravedad: 'LEVE' | 'INCAPACITANTE_TEMPORAL' | 'MORTAL' | 'SIN_LESION' | null;
  fechaHora: string | null;
  lugar: string | null;
  trabajador: string | null;
  diasDescanso: number | null;
  descripcion: string | null;
  causasInmediatas: string | null;
  causasBasicas: string | null;
  estado: 'INVESTIGADO_CERRADO' | 'EN_INVESTIGACION' | 'PRELIMINAR_24H' | null;
}

export interface PlanAccionMejoraItem {
  id: number;
  moduloOrigen: 'IPERC' | 'INSPECCIONES' | 'ACCIDENTES' | 'AUDITORIA' | 'COMITE_SST' | 'OPT' | null;
  hallazgo: string | null;
  medidaCorrectiva: string | null;
  tipoAccion: 'CORRECTIVA' | 'PREVENTIVA' | null;
  responsable: string | null;
  fechaCompromiso: string | null;
  avance: number | null;
  estado: 'CERRADO_VERIFICADO' | 'EN_EJECUCION' | 'PENDIENTE' | null;
}

@Component({
  selector: 'msst-modulo07-accidentes',
  standalone: true,
  imports: [WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera del Módulo 07 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-ambulance"></i>  Investigación de Accidentes / Incidentes y Motor Transversal de Planes de Acción de Mejora
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-danger" (click)="mostrarModalAccidente.set(true)">
              <i class="fa fa-plus-circle"></i> + Registrar Evento SST
            </button>
            <button class="btn btn-xs btn-warning" (click)="mostrarModalAccionMejora.set(true)">
              <i class="fa fa-cogs"></i> + Nuevo Plan de Acción
            </button>
          </div>
        </div>

        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">EVENTOS REGISTRADOS (AÑO 2026)</div>
                <div style="font-size: 20px; font-weight: bold; color: #dc3545;">{{ accidentes().length }} Eventos</div>
                <div style="font-size: 11px; color: #888;">0 Accidentes Mortales (Tasa Cero)</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #ffc107; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">DÍAS DE DESCANSO MÉDICO ACUM.</div>
                <div style="font-size: 20px; font-weight: bold; color: #d39e00;">{{ totalDiasDescanso() }} Días</div>
                <div style="font-size: 11px; color: #888;">Controlado por Salud Ocupacional</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PLANES DE ACCIÓN DE MEJORA</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ accionesMejora().length }} Acciones SAC/SAP</div>
                <div style="font-size: 11px; color: #888;">Motor Transversal Multi-Módulo</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">EFICACIA DE CIERRE DE ACCIONES</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ promedioAvanceAcciones() }}% Avance</div>
                <div style="font-size: 11px; color: #888;">Verificación de Eficacia SST</div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-sm" [ngClass]="pestana() === 'ACCIDENTES' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('ACCIDENTES')">
              <i class="fa fa-medkit"></i> 1. Investigación de Accidentes, Incidentes y Daños Vehiculares/Ambientales
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'ACCIONES_MEJORA' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('ACCIONES_MEJORA')">
              <i class="fa fa-cogs"></i> 2. Motor Transversal de Planes de Acción de Mejora
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: INVESTIGACIÓN DE ACCIDENTES E INCIDENTES -->
      @if (pestana() === 'ACCIDENTES') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-file-text-o"></i> Registro Oficial e Investigación Causal de Accidentes e Incidentes Peligrosos</h4>
            <button class="btn btn-xs btn-danger" (click)="mostrarModalAccidente.set(true)">
              <i class="fa fa-plus-circle"></i> Registrar Nuevo Accidente / Incidente
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código</th>
                    <th>Tipo de Evento</th>
                    <th>Gravedad</th>
                    <th>Fecha / Hora</th>
                    <th>Lugar Exacto</th>
                    <th>Trabajador / Unidad Involucrada</th>
                    <th style="text-align:center;">Días DM</th>
                    <th>Relato y Análisis de Causalidad (Causas Inmediatas / Básicas)</th>
                    <th>Estado Investigación</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ev of accidentes(); track ev.id) {
                    <tr>
                      <td><strong>{{ ev.codigo }}</strong></td>
                      <td><span class="label label-default">{{ ev.tipo }}</span></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': (ev.gravedad??'').includes('INCAPACITANTE') || ev.gravedad === 'MORTAL',
                          'label-warning': ev.gravedad === 'LEVE',
                          'label-info': ev.gravedad === 'SIN_LESION'
                        }">{{ ev.gravedad }}</span>
                      </td>
                      <td>{{ ev.fechaHora }}</td>
                      <td>{{ ev.lugar }}</td>
                      <td><strong>{{ ev.trabajador }}</strong></td>
                      <td style="text-align:center;"><strong>{{ ev.diasDescanso }}</strong></td>
                      <td style="font-size: 11px;">
                        <div><strong>Relato:</strong> {{ ev.descripcion }}</div>
                        <div class="text-danger"><strong>C. Inmediata:</strong> {{ ev.causasInmediatas }}</div>
                        <div class="text-primary"><strong>C. Básica (Raíz):</strong> {{ ev.causasBasicas }}</div>
                      </td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': ev.estado === 'INVESTIGADO_CERRADO',
                          'label-warning': ev.estado === 'EN_INVESTIGACION',
                          'label-danger': ev.estado === 'PRELIMINAR_24H'
                        }">{{ ev.estado }}</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 2: MOTOR TRANSVERSAL DE PLANES DE ACCIÓN DE MEJORA -->
      @if (pestana() === 'ACCIONES_MEJORA') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-check-square-o"></i> Motor Transversal de Planes de Acción Correctiva y Preventiva</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalAccionMejora.set(true)">
              <i class="fa fa-plus-circle"></i> Nueva Acción de Mejora
            </button>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-4">
                <select class="form-control input-sm" [(ngModel)]="filtroModuloOrigen">
                  <option value="TODOS">Todos los Módulos de Origen</option>
                  <option value="IPERC">Origen: Matriz IPERC</option>
                  <option value="INSPECCIONES">Origen: Inspecciones SST</option>
                  <option value="ACCIDENTES">Origen: Investigación de Accidentes</option>
                  <option value="AUDITORIA">Origen: Auditorías ISO 45001 / Ley 29783</option>
                  <option value="COMITE_SST">Origen: Acuerdos Comité SST</option>
                </select>
              </div>
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por hallazgo, medida correctiva o responsable..." [(ngModel)]="filtroTextoAccion">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Módulo Origen</th>
                    <th>Hallazgo / No Conformidad Detectada</th>
                    <th>Medida Correctiva / Preventiva Propuesta</th>
                    <th>Responsable</th>
                    <th>Compromiso</th>
                    <th style="width: 170px;">Porcentaje de Avance</th>
                    <th>Estado</th>
                    <th style="width: 150px;">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ac of accionesFiltradas(); track ac.id) {
                    <tr>
                      <td><strong>#{{ ac.id }}</strong></td>
                      <td><span class="label label-primary">{{ ac.moduloOrigen }}</span></td>
                      <td>{{ ac.hallazgo }}</td>
                      <td><strong>{{ ac.medidaCorrectiva }}</strong></td>
                      <td>{{ ac.responsable }}</td>
                      <td>{{ ac.fechaCompromiso }}</td>
                      <td>
                        <div class="progress" style="margin-bottom: 0; height: 18px; background: #e2e8f0;">
                          <div class="progress-bar"
                               [ngClass]="{
                                 'progress-bar-success': ac.avance === 100,
                                 'progress-bar-info': (ac.avance !== null && ac.avance >= 50) && (ac.avance !== null && ac.avance < 100),
                                 'progress-bar-warning': (ac.avance !== null && ac.avance < 50)
                               }"
                               [style.width.%]="ac.avance"
                               style="line-height: 18px; font-size: 11px; font-weight: bold;">
                            {{ ac.avance }}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': ac.avance === 100,
                          'label-info': (ac.avance !== null && ac.avance > 0) && (ac.avance !== null && ac.avance < 100),
                          'label-warning': ac.avance === 0
                        }">{{ ac.estado }}</span>
                      </td>
                      <td>
                        @if ((ac.avance !== null && ac.avance < 100)) {
                          <div class="btn-group">
                            <button class="btn btn-xs btn-info" (click)="avanzarAccion(ac, 25)" title="Consultar el proceso de mejora">
                              +25%
                            </button>
                            <button class="btn btn-xs btn-success" (click)="avanzarAccion(ac, 100)" title="Consultar el cierre del proceso">
                              <i class="fa fa-check"></i> Ver proceso
                            </button>
                          </div>
                        } @else {
                          <a class="btn btn-xs btn-default" [href]="'/sst/evidencia/ver?codigo=SAC-' + ac.id" target="_blank">
                            <i class="fa fa-file-pdf-o"></i> Evidencia
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

      <!-- MODAL REGISTRAR NUEVO ACCIDENTE / INCIDENTE -->
      @if (mostrarModalAccidente()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 680px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-ambulance"></i> Registrar Evento y Análisis de Causalidad</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalAccidente.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código Registro:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.codigo">
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo de Evento:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoAccidente.tipo">
                    <option value="INCIDENTE_PELIGROSO">INCIDENTE_PELIGROSO (Cuasi-Accidente)</option>
                    <option value="ACCIDENTE_TRABAJO">ACCIDENTE_TRABAJO</option>
                    <option value="ACCIDENTE_VEHICULAR">ACCIDENTE_VEHICULAR</option>
                    <option value="INCIDENTE_AMBIENTAL">INCIDENTE_AMBIENTAL</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Gravedad:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoAccidente.gravedad">
                    <option value="SIN_LESION">SIN_LESION (Solo Daño Material/Potencial)</option>
                    <option value="LEVE">LEVE (Primeros Auxilios)</option>
                    <option value="INCAPACITANTE_TEMPORAL">INCAPACITANTE_TEMPORAL</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Fecha y Hora del Evento:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.fechaHora">
                </div>
                <div class="col-md-5 form-group">
                  <label>Lugar Exacto:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.lugar">
                </div>
                <div class="col-md-3 form-group">
                  <label>Días Descanso Méd.:</label>
                  <input type="number" min="0" class="form-control input-sm" [(ngModel)]="nuevoAccidente.diasDescanso">
                </div>
              </div>
              <div class="form-group">
                <label>Trabajador o Unidad Involucrada:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.trabajador">
              </div>
              <div class="form-group">
                <label>Relato Circunstanciado del Evento:</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevoAccidente.descripcion"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Causas Inmediatas (Actos / Condiciones):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.causasInmediatas" placeholder="Ej. Manipulación sin herramienta adecuada">
                </div>
                <div class="col-md-6 form-group">
                  <label>Causas Básicas (Factores Personales / Trabajo):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoAccidente.causasBasicas" placeholder="Ej. Supervisión insuficiente de PETS">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalAccidente.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-danger" (click)="guardarNuevoAccidente()">
                <i class="fa fa-save"></i> Registrar Evento
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA ACCIÓN DE MEJORA -->
      @if (mostrarModalAccionMejora()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-cogs"></i> Registrar Nuevo Plan de Acción de Mejora</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalAccionMejora.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Módulo de Origen:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaAccion.moduloOrigen">
                    <option value="INSPECCIONES">INSPECCIONES</option>
                    <option value="IPERC">IPERC</option>
                    <option value="ACCIDENTES">ACCIDENTES</option>
                    <option value="AUDITORIA">AUDITORIA</option>
                    <option value="COMITE_SST">COMITE_SST</option>
                  </select>
                </div>
                <div class="col-md-6 form-group">
                  <label>Tipo de Acción:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaAccion.tipoAccion">
                    <option value="CORRECTIVA">ACCIÓN CORRECTIVA (SAC)</option>
                    <option value="PREVENTIVA">ACCIÓN PREVENTIVA (SAP)</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descripción del Hallazgo / No Conformidad:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAccion.hallazgo">
              </div>
              <div class="form-group">
                <label>Medida Correctiva / Preventiva Específica:</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevaAccion.medidaCorrectiva"></textarea>
              </div>
              <div class="row">
                <div class="col-md-7 form-group">
                  <label>Responsable de Ejecución:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAccion.responsable">
                </div>
                <div class="col-md-5 form-group">
                  <label>Fecha de Compromiso:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaAccion.fechaCompromiso">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalAccionMejora.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaAccionMejora()">
                <i class="fa fa-save"></i> Guardar Plan de Acción
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo07AccidentesMejoraComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'ACCIDENTES' | 'ACCIONES_MEJORA'>('ACCIDENTES');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');
  readonly mostrarModalAccidente = signal<boolean>(false);
  readonly mostrarModalAccionMejora = signal<boolean>(false);

  filtroModuloOrigen = 'TODOS';
  filtroTextoAccion = '';

  readonly accidentes = signal<AccidenteIncidenteItem[]>([]);

  readonly accionesMejora = signal<PlanAccionMejoraItem[]>([]);

  nuevoAccidente = {
    codigo: '',
    tipo: '' as AccidenteIncidenteItem['tipo'],
    gravedad: '' as AccidenteIncidenteItem['gravedad'],
    fechaHora: '',
    lugar: '',
    trabajador: '',
    diasDescanso: 0,
    descripcion: '',
    causasInmediatas: '',
    causasBasicas: ''
  };

  nuevaAccion = {
    moduloOrigen: '' as PlanAccionMejoraItem['moduloOrigen'],
    tipoAccion: '' as 'CORRECTIVA' | 'PREVENTIVA',
    hallazgo: '',
    medidaCorrectiva: '',
    responsable: '',
    fechaCompromiso: ''
  };

  readonly totalDiasDescanso = computed(() =>
    this.accidentes().reduce((acc, ev) => acc + (Number(ev.diasDescanso) || 0), 0)
  );

  readonly promedioAvanceAcciones = computed(() => {
    const list = this.accionesMejora();
    if (!list.length) return 0;
    const sum = list.reduce((acc, item) => acc + (Number(item.avance) || 0), 0);
    return Math.round(sum / list.length);
  });

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/accidente/lista', { ...{} }).subscribe({next:(response)=>{try{this.accidentes.set(confirmedList<AccidenteIncidenteItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"tipo","kind":"string","optional":false,"nullable":true},{"name":"gravedad","kind":"string","optional":false,"nullable":true},{"name":"fechaHora","kind":"string","optional":false,"nullable":true},{"name":"lugar","kind":"string","optional":false,"nullable":true},{"name":"trabajador","kind":"string","optional":false,"nullable":true},{"name":"diasDescanso","kind":"number","optional":false,"nullable":true},{"name":"descripcion","kind":"string","optional":false,"nullable":true},{"name":"causasInmediatas","kind":"string","optional":false,"nullable":true},{"name":"causasBasicas","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/gestionaccionmejora/lista', { ...{} }).subscribe({next:(response)=>{try{this.accionesMejora.set(confirmedList<PlanAccionMejoraItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"moduloOrigen","kind":"string","optional":false,"nullable":true},{"name":"hallazgo","kind":"string","optional":false,"nullable":true},{"name":"medidaCorrectiva","kind":"string","optional":false,"nullable":true},{"name":"tipoAccion","kind":"string","optional":false,"nullable":true},{"name":"responsable","kind":"string","optional":false,"nullable":true},{"name":"fechaCompromiso","kind":"string","optional":false,"nullable":true},{"name":"avance","kind":"number","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  accionesFiltradas(): PlanAccionMejoraItem[] {
    const q = this.filtroTextoAccion.trim().toLowerCase();
    return this.accionesMejora().filter(ac => {
      const coincideMod = this.filtroModuloOrigen === 'TODOS' || ac.moduloOrigen === this.filtroModuloOrigen;
      const coincideTexto = !q ||
        (ac.hallazgo??'').toLowerCase().includes(q) ||
        (ac.medidaCorrectiva??'').toLowerCase().includes(q) ||
        (ac.responsable??'').toLowerCase().includes(q);
      return coincideMod && coincideTexto;
    });
  }

  guardarNuevoAccidente(): void {
    if (!this.nuevoAccidente.descripcion.trim()) return;
    this.api.callAjaxPost('/accidente/insert', { ...this.nuevoAccidente, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalAccidente.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  guardarNuevaAccionMejora(): void {
    if (!this.nuevaAccion.hallazgo.trim() || !this.nuevaAccion.medidaCorrectiva.trim()) return;
    this.api.callAjaxPost('/gestionaccionmejora/insert', { ...this.nuevaAccion, ...{}, avance: 0 }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalAccionMejora.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  avanzarAccion(_ac:PlanAccionMejoraItem,_incrementoOValor:number):void{this.workflowSelectionOpen.set(true);}

  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
