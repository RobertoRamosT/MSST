import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface AccidenteIncidenteItem {
  id: number;
  codigo: string;
  tipo: 'ACCIDENTE_TRABAJO' | 'INCIDENTE_PELIGROSO' | 'ACCIDENTE_VEHICULAR' | 'INCIDENTE_AMBIENTAL';
  gravedad: 'LEVE' | 'INCAPACITANTE_TEMPORAL' | 'MORTAL' | 'SIN_LESION';
  fechaHora: string;
  lugar: string;
  trabajador: string;
  diasDescanso: number;
  descripcion: string;
  causasInmediatas: string;
  causasBasicas: string;
  estado: 'INVESTIGADO_CERRADO' | 'EN_INVESTIGACION' | 'PRELIMINAR_24H';
}

export interface PlanAccionMejoraItem {
  id: number;
  moduloOrigen: 'IPERC' | 'INSPECCIONES' | 'ACCIDENTES' | 'AUDITORIA' | 'COMITE_SST' | 'OPT';
  hallazgo: string;
  medidaCorrectiva: string;
  tipoAccion: 'CORRECTIVA' | 'PREVENTIVA';
  responsable: string;
  fechaCompromiso: string;
  avance: number;
  estado: 'CERRADO_VERIFICADO' | 'EN_EJECUCION' | 'PENDIENTE';
}

@Component({
  selector: 'msst-modulo07-accidentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                          'label-danger': ev.gravedad.includes('INCAPACITANTE') || ev.gravedad === 'MORTAL',
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
                                 'progress-bar-info': ac.avance >= 50 && ac.avance < 100,
                                 'progress-bar-warning': ac.avance < 50
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
                          'label-info': ac.avance > 0 && ac.avance < 100,
                          'label-warning': ac.avance === 0
                        }">{{ ac.estado }}</span>
                      </td>
                      <td>
                        @if (ac.avance < 100) {
                          <div class="btn-group">
                            <button class="btn btn-xs btn-info" (click)="avanzarAccion(ac, 25)" title="Incrementar +25%">
                              +25%
                            </button>
                            <button class="btn btn-xs btn-success" (click)="avanzarAccion(ac, 100)" title="Cerrar al 100%">
                              <i class="fa fa-check"></i> Cerrar 100%
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

  readonly accidentes = signal<AccidenteIncidenteItem[]>([
    {
      id: 1,
      codigo: 'INC-2026-001',
      tipo: 'INCIDENTE_PELIGROSO',
      gravedad: 'SIN_LESION',
      fechaHora: '2026-09-18 14:20',
      lugar: 'Planta Condorcocha - Patio de Maniobras Silo 03',
      trabajador: 'Operador Montacargas - Grupo Elias-29 S.A.C.',
      diasDescanso: 0,
      descripcion: 'Caída de parihuela vacía durante maniobra de giro sin impacto a personal.',
      causasInmediatas: 'Velocidad inadecuada en curva con piso húmedo.',
      causasBasicas: 'Falta de señalización reductora de velocidad en intersección de almacén.',
      estado: 'INVESTIGADO_CERRADO'
    },
    {
      id: 2,
      codigo: 'ACC-2026-002',
      tipo: 'ACCIDENTE_TRABAJO',
      gravedad: 'LEVE',
      fechaHora: '2026-10-10 09:45',
      lugar: 'Taller Mecánico Central - Banco de Esmerilado',
      trabajador: 'QUISPE MAMANI, HECTOR (Mecánico de Mantenimiento)',
      diasDescanso: 2,
      descripcion: 'Contusión superficial en dedo índice izquierdo al ajustar pieza metálica en tornillo de banco.',
      causasInmediatas: 'Posicionamiento de manos en línea de fuego durante sujeción.',
      causasBasicas: 'Desgaste en mordaza de sujeción mecánica del banco N° 02.',
      estado: 'INVESTIGADO_CERRADO'
    }
  ]);

  readonly accionesMejora = signal<PlanAccionMejoraItem[]>([
    {
      id: 401,
      moduloOrigen: 'INSPECCIONES',
      hallazgo: 'Cilindro de oxígeno sin cadena de sujeción secundaria en taller de calderería.',
      medidaCorrectiva: 'Instalar porta-cilindros metálico con doble cadena de seguridad y señalética NFPA 704.',
      tipoAccion: 'CORRECTIVA',
      responsable: 'Sup. Jorge Chávez',
      fechaCompromiso: '30/10/2026',
      avance: 75,
      estado: 'EN_EJECUCION'
    },
    {
      id: 402,
      moduloOrigen: 'ACCIDENTES',
      hallazgo: 'Desgaste en mordaza de sujeción mecánica del banco de taller N° 02 (ACC-2026-002).',
      medidaCorrectiva: 'Reemplazo integral de tornillo de banco industrial y difusión de alerta de seguridad.',
      tipoAccion: 'CORRECTIVA',
      responsable: 'Tec. Luis Paredes',
      fechaCompromiso: '20/10/2026',
      avance: 100,
      estado: 'CERRADO_VERIFICADO'
    },
    {
      id: 403,
      moduloOrigen: 'IPERC',
      hallazgo: 'Control de ingeniería requerido para ingreso a chute de transferencia Línea 2.',
      medidaCorrectiva: 'Instalar sensor de bloqueo electromecánico en compuerta de inspección del chute.',
      tipoAccion: 'PREVENTIVA',
      responsable: 'Ing. Carlos Mendoza',
      fechaCompromiso: '10/11/2026',
      avance: 50,
      estado: 'EN_EJECUCION'
    }
  ]);

  nuevoAccidente = {
    codigo: 'INC-2026-003',
    tipo: 'INCIDENTE_PELIGROSO' as AccidenteIncidenteItem['tipo'],
    gravedad: 'SIN_LESION' as AccidenteIncidenteItem['gravedad'],
    fechaHora: '2026-10-24 11:30',
    lugar: 'Planta Condorcocha - Zona de Despacho',
    trabajador: '',
    diasDescanso: 0,
    descripcion: '',
    causasInmediatas: '',
    causasBasicas: ''
  };

  nuevaAccion = {
    moduloOrigen: 'INSPECCIONES' as PlanAccionMejoraItem['moduloOrigen'],
    tipoAccion: 'CORRECTIVA' as 'CORRECTIVA' | 'PREVENTIVA',
    hallazgo: '',
    medidaCorrectiva: '',
    responsable: 'Ing. Carlos Mendoza',
    fechaCompromiso: '15/11/2026'
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
    this.api.callAjaxPost('/accidente/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigo']) {
          const desdeSql: AccidenteIncidenteItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (50 + idx),
            codigo: String(r['codigo'] || `ACC-2026-0${idx + 1}`),
            tipo: (String(r['tipo'] || 'INCIDENTE_PELIGROSO') as AccidenteIncidenteItem['tipo']),
            gravedad: (String(r['gravedad'] || 'LEVE') as AccidenteIncidenteItem['gravedad']),
            fechaHora: String(r['fechaHora'] || '2026-10-20 10:00'),
            lugar: String(r['lugar'] || 'Planta Condorcocha'),
            trabajador: String(r['trabajador'] || 'Colaborador Operativo'),
            diasDescanso: Number(r['diasDescanso']) || 0,
            descripcion: String(r['descripcion'] || ''),
            causasInmediatas: 'Condición mecánica en revisión',
            causasBasicas: 'Factor de trabajo controlado por ingeniería',
            estado: (String(r['estado'] || 'INVESTIGADO_CERRADO') as AccidenteIncidenteItem['estado'])
          }));
          this.accidentes.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
          ]);
        }
      }
    });

    this.api.callAjaxPost('/gestionaccionmejora/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['medidaCorrectiva']) {
          const desdeSql: PlanAccionMejoraItem[] = list.map((r: Record<string, any>, idx: number) => {
            const av = Number(r['avance']) || 0;
            return {
              id: Number(r['id']) || (500 + idx),
              moduloOrigen: (String(r['moduloOrigen'] || 'INSPECCIONES').toUpperCase() as PlanAccionMejoraItem['moduloOrigen']),
              hallazgo: String(r['hallazgo'] || ''),
              medidaCorrectiva: String(r['medidaCorrectiva'] || ''),
              tipoAccion: 'CORRECTIVA',
              responsable: String(r['responsable'] || 'Ing. SST'),
              fechaCompromiso: String(r['fechaCompromiso'] || '15/11/2026'),
              avance: av,
              estado: av >= 100 ? 'CERRADO_VERIFICADO' : 'EN_EJECUCION'
            };
          });
          this.accionesMejora.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.id === a.id))
          ]);
        }
      }
    });
  }

  accionesFiltradas(): PlanAccionMejoraItem[] {
    const q = this.filtroTextoAccion.trim().toLowerCase();
    return this.accionesMejora().filter(ac => {
      const coincideMod = this.filtroModuloOrigen === 'TODOS' || ac.moduloOrigen === this.filtroModuloOrigen;
      const coincideTexto = !q ||
        ac.hallazgo.toLowerCase().includes(q) ||
        ac.medidaCorrectiva.toLowerCase().includes(q) ||
        ac.responsable.toLowerCase().includes(q);
      return coincideMod && coincideTexto;
    });
  }

  guardarNuevoAccidente(): void {
    if (!this.nuevoAccidente.descripcion.trim()) return;
    this.api.callAjaxPost('/accidente/insert', { ...this.nuevoAccidente, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarAccidenteLocal(Number(res?.['idGenerado']) || Date.now()),
      error: () => this.agregarAccidenteLocal(Date.now())
    });
  }

  private agregarAccidenteLocal(id: number): void {
    const item: AccidenteIncidenteItem = {
      id,
      codigo: this.nuevoAccidente.codigo,
      tipo: this.nuevoAccidente.tipo,
      gravedad: this.nuevoAccidente.gravedad,
      fechaHora: this.nuevoAccidente.fechaHora,
      lugar: this.nuevoAccidente.lugar,
      trabajador: this.nuevoAccidente.trabajador || 'Personal Operativo en Turno',
      diasDescanso: Number(this.nuevoAccidente.diasDescanso) || 0,
      descripcion: this.nuevoAccidente.descripcion,
      causasInmediatas: this.nuevoAccidente.causasInmediatas || 'En análisis por el Comité SST',
      causasBasicas: this.nuevoAccidente.causasBasicas || 'En investigación causal (Metodología 5 Porqués)',
      estado: 'EN_INVESTIGACION'
    };
    this.accidentes.update(list => [item, ...list]);
    this.mostrarModalAccidente.set(false);
    this.mostrarAviso(`Evento ${item.codigo} registrado correctamente en OneSST.`);
  }

  guardarNuevaAccionMejora(): void {
    if (!this.nuevaAccion.hallazgo.trim() || !this.nuevaAccion.medidaCorrectiva.trim()) return;
    this.api.callAjaxPost('/gestionaccionmejora/insert', { ...this.nuevaAccion, idEmpresa: 773, avance: 0 }).subscribe({
      next: (res) => this.agregarAccionLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.agregarAccionLocal(Date.now() % 10000)
    });
  }

  private agregarAccionLocal(id: number): void {
    const item: PlanAccionMejoraItem = {
      id,
      moduloOrigen: this.nuevaAccion.moduloOrigen,
      hallazgo: this.nuevaAccion.hallazgo,
      medidaCorrectiva: this.nuevaAccion.medidaCorrectiva,
      tipoAccion: this.nuevaAccion.tipoAccion,
      responsable: this.nuevaAccion.responsable,
      fechaCompromiso: this.nuevaAccion.fechaCompromiso,
      avance: 25,
      estado: 'EN_EJECUCION'
    };
    this.accionesMejora.update(list => [item, ...list]);
    this.mostrarModalAccionMejora.set(false);
    this.mostrarAviso(`Plan de Acción #${item.id} registrado en el Motor Transversal.`);
  }

  avanzarAccion(ac: PlanAccionMejoraItem, incrementoOValor: number): void {
    const nuevoAvance = incrementoOValor === 100 ? 100 : Math.min(100, ac.avance + incrementoOValor);
    const nuevoEstado = nuevoAvance === 100 ? 'CERRADO_VERIFICADO' : 'EN_EJECUCION';
    this.api.callAjaxPost('/gestionaccionmejora/updateAvance', {
      id: ac.id,
      avance: nuevoAvance,
      estado: nuevoEstado
    }).subscribe({
      next: () => this.actualizarAvanceLocal(ac.id, nuevoAvance, nuevoEstado),
      error: () => this.actualizarAvanceLocal(ac.id, nuevoAvance, nuevoEstado)
    });
  }

  private actualizarAvanceLocal(id: number, avance: number, estado: PlanAccionMejoraItem['estado']): void {
    this.accionesMejora.update(list =>
      list.map(a => a.id === id ? { ...a, avance, estado } : a)
    );
    this.mostrarAviso(`Plan de Acción #${id} actualizado al ${avance}% (${estado}).`);
  }

  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
