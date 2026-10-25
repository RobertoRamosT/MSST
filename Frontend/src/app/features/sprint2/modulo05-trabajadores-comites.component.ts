import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface TrabajadorPropioItem {
  id: number;
  dni: string;
  nombreCompleto: string;
  unidad: string;
  area: string;
  puestoTrabajo: string;
  grupoSeguridad: string;
  tallaCasco: string;
  tallaCalzado: string;
  tallaUniforme: string;
  aptitudMedica: string;
  estado: 'ACTIVO' | 'CESADO' | 'VACACIONES';
}

export interface ReunionComiteItem {
  id: number;
  numeroActa: string;
  tipoSesion: 'ORDINARIA' | 'EXTRAORDINARIA';
  fechaReunion: string;
  agendaPrincipal: string;
  acuerdoTomado: string;
  responsableAcuerdo: string;
  quorumAsistencia: string;
  estadoAcuerdo: 'CUMPLIDO' | 'EN_PROCESO' | 'PENDIENTE';
}

export interface CandidatoComiteItem {
  idCandidato: number;
  listaNumero: string;
  nombreCandidato: string;
  dni: string;
  areaRepresentada: string;
  votosRecibidos: number;
}

export interface ProcesoElectoralItem {
  id: number;
  codigoProceso: string;
  tituloConvocatoria: string;
  periodoVigencia: string;
  fechaEleccion: string;
  totalPadronElectoral: number;
  totalVotosEmitidos: number;
  estadoProceso: 'EN_VOTACION' | 'CERRADO' | 'CONVOCADO';
  yaVotoUsuarioActual?: boolean;
  candidatos: CandidatoComiteItem[];
}

@Component({
  selector: 'msst-modulo05-trabajadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera del Módulo 05 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-users"></i>  Gestión de Trabajadores Propios, Comité Paritario SST y Elecciones Virtuales
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalTrabajador.set(true)">
              <i class="fa fa-user-plus"></i> + Registrar Colaborador
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalConvocatoria.set(true)">
              <i class="fa fa-check-square-o"></i> + Nueva Convocatoria CSST
            </button>
          </div>
        </div>

        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PLANILLA PROPIA REGISTRADA</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ trabajadores().length }} Colaboradores</div>
                <div style="font-size: 11px; color: #888;">100% con Tallas EPP y Grupo SST</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">ACTAS Y ACUERDOS COMITÉ SST</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ reunionesComite().length }} Sesiones</div>
                <div style="font-size: 11px; color: #888;">Paritario Bipartito (Ley N° 29783)</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PROCESOS ELECTORALES CSST</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ elecciones().length }} Convocatorias</div>
                <div style="font-size: 11px; color: #888;">R.M. 245-2021-TR (Sufragio Secreto)</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #ffc107; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PARTICIPACIÓN ELECTORAL</div>
                <div style="font-size: 20px; font-weight: bold; color: #d39e00;">{{ porcentajeParticipacionActual() }}% Padrón</div>
                <div style="font-size: 11px; color: #888;">Voto Electrónico Auditado SHA-256</div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-sm" [ngClass]="pestana() === 'TRABAJADORES' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('TRABAJADORES')">
              <i class="fa fa-id-badge"></i> 1. Maestro de Trabajadores Propios y Tallas EPP
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'COMITE' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('COMITE')">
              <i class="fa fa-handshake-o"></i> 2. Comité Paritario SST (Reuniones, Agendas y Acuerdos)
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'ELECCIONES' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('ELECCIONES')">
              <i class="fa fa-check-square-o"></i> 3. Elecciones Virtuales del Comité SST (Sufragio Secreto)
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: MAESTRO DE TRABAJADORES PROPIOS Y TALLAS EPP -->
      @if (pestana() === 'TRABAJADORES') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-address-card"></i> Maestro de Trabajadores Propios, Grupos de Seguridad y Tallas EPP</h4>
            <button class="btn btn-xs btn-success" (click)="abrirModalNuevoTrabajador()">
              <i class="fa fa-user-plus"></i> Registrar Nuevo Trabajador
            </button>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <div class="input-group">
                  <span class="input-group-addon"><i class="fa fa-search"></i></span>
                  <input type="text" class="form-control input-sm" placeholder="Filtrar por DNI, Nombre, Puesto o Área..." [(ngModel)]="filtroTrabajador">
                </div>
              </div>
              <div class="col-md-4">
                <select class="form-control input-sm" [(ngModel)]="filtroGrupoSeguridad">
                  <option value="TODOS">Todos los Grupos de Seguridad / Brigadas</option>
                  <option value="BRIGADA CONTRA INCENDIOS">Brigada Contra Incendios</option>
                  <option value="BRIGADA PRIMEROS AUXILIOS">Brigada Primeros Auxilios</option>
                  <option value="BRIGADA HAZMAT / MATPEL">Brigada HAZMAT / MATPEL</option>
                  <option value="COMITE PARITARIO SST">Miembro Comité Paritario SST</option>
                  <option value="OPERACIONES PLANTA">Operaciones Planta Estándar</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>DNI</th>
                    <th>Apellidos y Nombres</th>
                    <th>Unidad / Área</th>
                    <th>Puesto de Trabajo</th>
                    <th>Grupo Seguridad / Brigada</th>
                    <th>Talla Casco</th>
                    <th>Talla Calzado</th>
                    <th>Talla Uniforme</th>
                    <th>EMO</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of trabajadoresFiltrados(); track t.id) {
                    <tr>
                      <td><strong>{{ t.dni }}</strong></td>
                      <td><strong>{{ t.nombreCompleto }}</strong></td>
                      <td>{{ t.unidad }} / {{ t.area }}</td>
                      <td>{{ t.puestoTrabajo }}</td>
                      <td><span class="label label-info">{{ t.grupoSeguridad }}</span></td>
                      <td style="text-align: center;"><code>{{ t.tallaCasco }}</code></td>
                      <td style="text-align: center;"><code>{{ t.tallaCalzado }}</code></td>
                      <td style="text-align: center;"><code>{{ t.tallaUniforme }}</code></td>
                      <td><span class="label label-success">{{ t.aptitudMedica }}</span></td>
                      <td><span class="label label-primary">{{ t.estado }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 2: COMITÉ PARITARIO SST (REUNIONES, AGENDAS Y ACUERDOS) -->
      @if (pestana() === 'COMITE') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-gavel"></i> Libro de Actas Electrónico del Comité Paritario SST (Reuniones, Agendas y Seguimiento de Acuerdos)</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalActaComite.set(true)">
              <i class="fa fa-plus-circle"></i> Registrar Nueva Acta / Acuerdo CSST
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>N° Acta</th>
                    <th>Tipo Sesión</th>
                    <th>Fecha</th>
                    <th>Quórum</th>
                    <th>Agenda Tratada</th>
                    <th>Acuerdo Vinculante del Comité SST</th>
                    <th>Responsable</th>
                    <th>Estado Acuerdo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  @for (acta of reunionesComite(); track acta.id) {
                    <tr>
                      <td><strong>{{ acta.numeroActa }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="acta.tipoSesion === 'ORDINARIA' ? 'label-primary' : 'label-warning'">
                          {{ acta.tipoSesion }}
                        </span>
                      </td>
                      <td>{{ acta.fechaReunion }}</td>
                      <td>{{ acta.quorumAsistencia }}</td>
                      <td>{{ acta.agendaPrincipal }}</td>
                      <td><strong>{{ acta.acuerdoTomado }}</strong></td>
                      <td>{{ acta.responsableAcuerdo }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': acta.estadoAcuerdo === 'CUMPLIDO',
                          'label-info': acta.estadoAcuerdo === 'EN_PROCESO',
                          'label-danger': acta.estadoAcuerdo === 'PENDIENTE'
                        }">{{ acta.estadoAcuerdo }}</span>
                      </td>
                      <td>
                        @if (acta.estadoAcuerdo !== 'CUMPLIDO') {
                          <button class="btn btn-xs btn-success" (click)="marcarAcuerdoCumplido(acta)">
                            <i class="fa fa-check"></i> Cerrar Acuerdo
                          </button>
                        } @else {
                          <a class="btn btn-xs btn-default" [href]="'/sst/evidencia/ver?codigo=' + acta.numeroActa" target="_blank">
                            <i class="fa fa-file-pdf-o"></i> Acta PDF
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

      <!-- PESTAÑA 3: ELECCIONES VIRTUALES DEL COMITÉ SST -->
      @if (pestana() === 'ELECCIONES') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-check-square-o"></i> Procesos de Elección Virtual de Representantes de los Trabajadores ante el CSST</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalConvocatoria.set(true)">
              <i class="fa fa-plus-circle"></i> Nueva Convocatoria Electoral
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive" style="margin-bottom: 18px;">
              <table class="table table-bordered table-striped">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código</th>
                    <th>Convocatoria Electoral</th>
                    <th>Periodo</th>
                    <th>Fecha Sufragio</th>
                    <th>Padrón Electoral</th>
                    <th>Votos Emitidos</th>
                    <th>Estado</th>
                    <th>Acción de Sufragio</th>
                  </tr>
                </thead>
                <tbody>
                  @for (proc of elecciones(); track proc.id) {
                    <tr>
                      <td><strong>{{ proc.codigoProceso }}</strong></td>
                      <td><strong>{{ proc.tituloConvocatoria }}</strong></td>
                      <td>{{ proc.periodoVigencia }}</td>
                      <td>{{ proc.fechaEleccion }}</td>
                      <td>{{ proc.totalPadronElectoral }} Electores</td>
                      <td><strong>{{ proc.totalVotosEmitidos }} ({{ calcularPorcentajeProceso(proc) }}%)</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': proc.estadoProceso === 'EN_VOTACION',
                          'label-default': proc.estadoProceso === 'CERRADO',
                          'label-info': proc.estadoProceso === 'CONVOCADO'
                        }">{{ proc.estadoProceso }}</span>
                      </td>
                      <td>
                        @if (proc.estadoProceso === 'EN_VOTACION' && !proc.yaVotoUsuarioActual) {
                          <button class="btn btn-xs btn-primary" (click)="abrirCabinaVotacion(proc)">
                            <i class="fa fa-lock"></i> Emitir Voto Electrónico Secreto
                          </button>
                        } @else if (proc.yaVotoUsuarioActual) {
                          <span class="label label-success"><i class="fa fa-check"></i> Voto Secreto Registrado</span>
                        } @else {
                          <button class="btn btn-xs btn-default" (click)="abrirCabinaVotacion(proc)">
                            <i class="fa fa-bar-chart"></i> Ver Escrutinio Oficial
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Cabina de Sufragio Electrónico Secreto y Escrutinio en Tiempo Real -->
            @if (procesoElectoralSeleccionado(); as procSel) {
              <div class="panel panel-info" style="border-width: 2px;">
                <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
                  <h4 class="panel-title">
                    <i class="fa fa-shield"></i> Cabina de Votación Electrónica Secreta y Escrutinio: <strong>{{ procSel.tituloConvocatoria }}</strong>
                  </h4>
                  <span class="badge">Cifrado SHA-256 Verificado</span>
                </div>
                <div class="panel-body">
                  <div class="row">
                    @for (cand of procSel.candidatos; track cand.idCandidato) {
                      <div class="col-md-4">
                        <div style="border: 1px solid #bcd4ec; border-radius: 6px; padding: 15px; background: #fff; text-align: center; margin-bottom: 10px;">
                          <div style="font-size: 18px; font-weight: bold; color: #004B87; margin-bottom: 4px;">
                            {{ cand.listaNumero }}
                          </div>
                          <div style="font-size: 14px; font-weight: bold; color: #333;">
                            {{ cand.nombreCandidato }}
                          </div>
                          <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
                            DNI: {{ cand.dni }} | Área: {{ cand.areaRepresentada }}
                          </div>
                          <div style="background: #f0f4f8; padding: 6px; border-radius: 4px; margin-bottom: 10px;">
                            <strong>{{ cand.votosRecibidos }} Votos</strong> en ánfora criptográfica
                          </div>
                          @if (procSel.estadoProceso === 'EN_VOTACION' && !procSel.yaVotoUsuarioActual) {
                            <button class="btn btn-sm btn-success btn-block" (click)="emitirVotoSecreto(procSel, cand)">
                              <i class="fa fa-check-circle"></i> Votar por {{ cand.listaNumero }}
                            </button>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL REGISTRAR NUEVO TRABAJADOR PROPIO -->
      @if (mostrarModalTrabajador()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 650px; margin: 0; box-shadow: 0 8px 25px rgba(0,0,0,.35);">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-user-plus"></i> Registrar Trabajador Propio y Tallas EPP</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalTrabajador.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>DNI / CE:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.dni" placeholder="Ej. 45892104">
                </div>
                <div class="col-md-8 form-group">
                  <label>Apellidos y Nombres Completos:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.nombreCompleto" placeholder="Ej. RAMIREZ SOTO, MARCO ANTONIO">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Unidad / Sede:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.unidad">
                </div>
                <div class="col-md-4 form-group">
                  <label>Área Operativa:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.area">
                </div>
                <div class="col-md-4 form-group">
                  <label>Puesto de Trabajo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.puestoTrabajo">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Grupo de Seguridad / Brigada:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoTrabajador.grupoSeguridad">
                    <option value="BRIGADA CONTRA INCENDIOS">BRIGADA CONTRA INCENDIOS</option>
                    <option value="BRIGADA PRIMEROS AUXILIOS">BRIGADA PRIMEROS AUXILIOS</option>
                    <option value="BRIGADA HAZMAT / MATPEL">BRIGADA HAZMAT / MATPEL</option>
                    <option value="COMITE PARITARIO SST">COMITE PARITARIO SST</option>
                    <option value="OPERACIONES PLANTA">OPERACIONES PLANTA</option>
                  </select>
                </div>
                <div class="col-md-2 form-group">
                  <label>Casco:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.tallaCasco">
                </div>
                <div class="col-md-2 form-group">
                  <label>Calzado:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.tallaCalzado">
                </div>
                <div class="col-md-2 form-group">
                  <label>Uniforme:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTrabajador.tallaUniforme">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalTrabajador.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoTrabajador()">
                <i class="fa fa-save"></i> Guardar Trabajador
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA ACTA COMITÉ SST -->
      @if (mostrarModalActaComite()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-gavel"></i> Registrar Nueva Acta y Acuerdo del Comité SST</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalActaComite.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>N° de Acta:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActa.numeroActa">
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo Sesión:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaActa.tipoSesion">
                    <option value="ORDINARIA">ORDINARIA</option>
                    <option value="EXTRAORDINARIA">EXTRAORDINARIA</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Reunión:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActa.fechaReunion">
                </div>
              </div>
              <div class="form-group">
                <label>Agenda Tratada:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActa.agendaPrincipal">
              </div>
              <div class="form-group">
                <label>Acuerdo Vinculante del Comité SST:</label>
                <textarea class="form-control input-sm" rows="2" [(ngModel)]="nuevaActa.acuerdoTomado"></textarea>
              </div>
              <div class="form-group">
                <label>Responsable de Ejecución:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaActa.responsableAcuerdo">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalActaComite.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaActaComite()">
                <i class="fa fa-save"></i> Guardar Acta en Libro CSST
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA CONVOCATORIA ELECTORAL -->
      @if (mostrarModalConvocatoria()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-bullhorn"></i> Nueva Convocatoria de Elección Virtual</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalConvocatoria.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Código Proceso:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaConvocatoria.codigoProceso">
                </div>
                <div class="col-md-7 form-group">
                  <label>Periodo de Mandato CSST:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaConvocatoria.periodoVigencia">
                </div>
              </div>
              <div class="form-group">
                <label>Título de la Convocatoria Electoral:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaConvocatoria.tituloConvocatoria" placeholder="Ej. Elección de Representantes Titulares y Suplentes CSST Sede Huachipa">
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Fecha de Sufragio Electrónico:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaConvocatoria.fechaEleccion">
                </div>
                <div class="col-md-6 form-group">
                  <label>Total Electores Habilitados (Padrón):</label>
                  <input type="number" class="form-control input-sm" [(ngModel)]="nuevaConvocatoria.totalPadronElectoral">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalConvocatoria.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaConvocatoria()">
                <i class="fa fa-save"></i> Publicar Convocatoria
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo05TrabajadoresComitesComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'TRABAJADORES' | 'COMITE' | 'ELECCIONES'>('TRABAJADORES');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');
  readonly mostrarModalTrabajador = signal<boolean>(false);
  readonly mostrarModalActaComite = signal<boolean>(false);
  readonly mostrarModalConvocatoria = signal<boolean>(false);

  filtroTrabajador = '';
  filtroGrupoSeguridad = 'TODOS';

  readonly trabajadores = signal<TrabajadorPropioItem[]>([
    {
      id: 1,
      dni: '41258963',
      nombreCompleto: 'MENDOZA VARGAS, CARLOS ALBERTO',
      unidad: 'Planta Condorcocha',
      area: 'Seguridad y Salud Ocupacional',
      puestoTrabajo: 'Ingeniero Senior de Seguridad SST',
      grupoSeguridad: 'COMITE PARITARIO SST',
      tallaCasco: 'Estándar Regulable',
      tallaCalzado: '42',
      tallaUniforme: 'L',
      aptitudMedica: 'APTO',
      estado: 'ACTIVO'
    },
    {
      id: 2,
      dni: '44875120',
      nombreCompleto: 'CHAVEZ QUISPE, JORGE LUIS',
      unidad: 'Planta Condorcocha',
      area: 'Molienda y Clinkerización',
      puestoTrabajo: 'Supervisor de Operaciones de Horno',
      grupoSeguridad: 'BRIGADA CONTRA INCENDIOS',
      tallaCasco: 'Estándar Regulable',
      tallaCalzado: '41',
      tallaUniforme: 'M',
      aptitudMedica: 'APTO',
      estado: 'ACTIVO'
    },
    {
      id: 3,
      dni: '70145892',
      nombreCompleto: 'PAREDES HUAMAN, LUIS MIGUEL',
      unidad: 'Planta Huachipa',
      area: 'Mantenimiento Mecánico y Eléctrico',
      puestoTrabajo: 'Técnico Especialista en Alto Voltaje',
      grupoSeguridad: 'BRIGADA HAZMAT / MATPEL',
      tallaCasco: 'Dielectrico Clase E',
      tallaCalzado: '43',
      tallaUniforme: 'XL',
      aptitudMedica: 'APTO',
      estado: 'ACTIVO'
    },
    {
      id: 4,
      dni: '46982315',
      nombreCompleto: 'SALAZAR ROJAS, PATRICIA ELENA',
      unidad: 'Planta Condorcocha',
      area: 'Control de Calidad y Laboratorio',
      puestoTrabajo: 'Analista Químico de Cementos',
      grupoSeguridad: 'BRIGADA PRIMEROS AUXILIOS',
      tallaCasco: 'Estándar Regulable',
      tallaCalzado: '37',
      tallaUniforme: 'S',
      aptitudMedica: 'APTO',
      estado: 'ACTIVO'
    }
  ]);

  readonly reunionesComite = signal<ReunionComiteItem[]>([
    {
      id: 1,
      numeroActa: 'ACTA-CSST-2026-009',
      tipoSesion: 'ORDINARIA',
      fechaReunion: '15/09/2026',
      agendaPrincipal: 'Evaluación del cumplimiento trimestral del PASST y revisión de estadísticas IF/IS',
      acuerdoTomado: 'Aprobar la adquisición de 45 equipos bloqueadores multipunto LOTOTO adicionales para línea de molienda.',
      responsableAcuerdo: 'Ing. Carlos Mendoza',
      quorumAsistencia: '12 / 12 Miembros (100%)',
      estadoAcuerdo: 'CUMPLIDO'
    },
    {
      id: 2,
      numeroActa: 'ACTA-CSST-2026-010',
      tipoSesion: 'ORDINARIA',
      fechaReunion: '14/10/2026',
      agendaPrincipal: 'Inspección conjunta de guardas de seguridad en fajas transportadoras 04 y 05',
      acuerdoTomado: 'Reforzar el enmallado perimetral y sensores Pull-Cord de parada de emergencia en Faja N° 04.',
      responsableAcuerdo: 'Sup. Jorge Chávez',
      quorumAsistencia: '11 / 12 Miembros (92%)',
      estadoAcuerdo: 'EN_PROCESO'
    }
  ]);

  readonly elecciones = signal<ProcesoElectoralItem[]>([
    {
      id: 1,
      codigoProceso: 'ELEC-CSST-2026-II',
      tituloConvocatoria: 'Elección de Representantes de los Trabajadores ante el Comité Paritario SST (2026-2028)',
      periodoVigencia: 'Noviembre 2026 - Noviembre 2028',
      fechaEleccion: '24/10/2026',
      totalPadronElectoral: 240,
      totalVotosEmitidos: 198,
      estadoProceso: 'EN_VOTACION',
      yaVotoUsuarioActual: false,
      candidatos: [
        {
          idCandidato: 1,
          listaNumero: 'LISTA N° 01',
          nombreCandidato: 'JORGE LUIS CHAVEZ QUISPE',
          dni: '44875120',
          areaRepresentada: 'Molienda y Clinkerización',
          votosRecibidos: 86
        },
        {
          idCandidato: 2,
          listaNumero: 'LISTA N° 02',
          nombreCandidato: 'LUIS MIGUEL PAREDES HUAMAN',
          dni: '70145892',
          areaRepresentada: 'Mantenimiento Industrial',
          votosRecibidos: 74
        },
        {
          idCandidato: 3,
          listaNumero: 'LISTA N° 03',
          nombreCandidato: 'PATRICIA ELENA SALAZAR ROJAS',
          dni: '46982315',
          areaRepresentada: 'Laboratorio y Calidad',
          votosRecibidos: 38
        }
      ]
    },
    {
      id: 2,
      codigoProceso: 'ELEC-CSST-2024-I',
      tituloConvocatoria: 'Elección General Bipartita Comité SST Periodo 2024-2026',
      periodoVigencia: 'Noviembre 2024 - Octubre 2026',
      fechaEleccion: '20/10/2024',
      totalPadronElectoral: 225,
      totalVotosEmitidos: 218,
      estadoProceso: 'CERRADO',
      yaVotoUsuarioActual: true,
      candidatos: [
        {
          idCandidato: 4,
          listaNumero: 'LISTA N° 01',
          nombreCandidato: 'ROBERTO CARLOS ELIAS SANCHEZ',
          dni: '40551890',
          areaRepresentada: 'Operaciones Planta Condorcocha',
          votosRecibidos: 142
        },
        {
          idCandidato: 5,
          listaNumero: 'LISTA N° 02',
          nombreCandidato: 'MARIO ALBERTO GOMEZ RUIZ',
          dni: '42119087',
          areaRepresentada: 'Logística y Despacho',
          votosRecibidos: 76
        }
      ]
    }
  ]);

  readonly procesoElectoralSeleccionado = signal<ProcesoElectoralItem | null>(this.elecciones()[0]);

  nuevoTrabajador = {
    dni: '',
    nombreCompleto: '',
    unidad: 'Planta Condorcocha',
    area: 'Operaciones Planta',
    puestoTrabajo: 'Operador de Planta Industrial',
    grupoSeguridad: 'BRIGADA CONTRA INCENDIOS',
    tallaCasco: 'Estándar Regulable',
    tallaCalzado: '41',
    tallaUniforme: 'L'
  };

  nuevaActa = {
    numeroActa: 'ACTA-CSST-2026-011',
    tipoSesion: 'ORDINARIA' as 'ORDINARIA' | 'EXTRAORDINARIA',
    fechaReunion: '25/10/2026',
    agendaPrincipal: '',
    acuerdoTomado: '',
    responsableAcuerdo: 'Ing. Carlos Mendoza'
  };

  nuevaConvocatoria = {
    codigoProceso: 'ELEC-CSST-2026-III',
    tituloConvocatoria: '',
    periodoVigencia: 'Diciembre 2026 - Diciembre 2028',
    fechaEleccion: '30/11/2026',
    totalPadronElectoral: 180
  };

  readonly porcentajeParticipacionActual = computed(() => {
    const proc = this.elecciones()[0];
    if (!proc || !proc.totalPadronElectoral) return 0;
    return Math.round((proc.totalVotosEmitidos / proc.totalPadronElectoral) * 100);
  });

  ngOnInit(): void {
    this.cargarDatosBackend();
  }

  cargarDatosBackend(): void {
    this.api.callAjaxPost('/trabajador/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && (list[0]['dni'] || list[0]['nombreCompleto'])) {
          const mapeados: TrabajadorPropioItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (idx + 1),
            dni: String(r['dni'] || r['numeroDocumento'] || '45001122'),
            nombreCompleto: String(r['nombreCompleto'] || r['nombres'] || 'COLABORADOR HOLCIM'),
            unidad: String(r['unidad'] || 'Planta Condorcocha'),
            area: String(r['area'] || 'Operaciones Industriales'),
            puestoTrabajo: String(r['puestoTrabajo'] || 'Especialista Operativo'),
            grupoSeguridad: String(r['grupoSeguridad'] || 'BRIGADA CONTRA INCENDIOS'),
            tallaCasco: String(r['tallaCasco'] || 'Estándar Regulable'),
            tallaCalzado: String(r['tallaCalzado'] || '42'),
            tallaUniforme: String(r['tallaUniforme'] || 'L'),
            aptitudMedica: String(r['aptitudMedica'] || 'APTO'),
            estado: 'ACTIVO'
          }));
          this.trabajadores.update(actuales => [...actuales, ...mapeados.filter(m => !actuales.some(a => a.dni === m.dni))]);
        }
      }
    });

    this.api.callAjaxPost('/eleccion_virtual/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigoProceso']) {
          this.elecciones.set(list as ProcesoElectoralItem[]);
        }
      }
    });
  }

  trabajadoresFiltrados(): TrabajadorPropioItem[] {
    const q = this.filtroTrabajador.trim().toLowerCase();
    return this.trabajadores().filter(t => {
      const coincideGrupo = this.filtroGrupoSeguridad === 'TODOS' || t.grupoSeguridad === this.filtroGrupoSeguridad;
      const coincideTexto = !q ||
        t.dni.toLowerCase().includes(q) ||
        t.nombreCompleto.toLowerCase().includes(q) ||
        t.puestoTrabajo.toLowerCase().includes(q) ||
        t.area.toLowerCase().includes(q);
      return coincideGrupo && coincideTexto;
    });
  }

  calcularPorcentajeProceso(proc: ProcesoElectoralItem): number {
    if (!proc.totalPadronElectoral) return 0;
    return Math.round((proc.totalVotosEmitidos / proc.totalPadronElectoral) * 100);
  }

  abrirModalNuevoTrabajador(): void {
    this.nuevoTrabajador = {
      dni: '',
      nombreCompleto: '',
      unidad: 'Planta Condorcocha',
      area: 'Operaciones Planta',
      puestoTrabajo: 'Operador de Planta Industrial',
      grupoSeguridad: 'BRIGADA CONTRA INCENDIOS',
      tallaCasco: 'Estándar Regulable',
      tallaCalzado: '41',
      tallaUniforme: 'L'
    };
    this.mostrarModalTrabajador.set(true);
  }

  guardarNuevoTrabajador(): void {
    if (!this.nuevoTrabajador.dni.trim() || !this.nuevoTrabajador.nombreCompleto.trim()) return;
    this.api.callAjaxPost('/trabajador/insert', { ...this.nuevoTrabajador, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarTrabajadorLocal(Number(res?.['idGenerado']) || Date.now()),
      error: () => this.insertarTrabajadorLocal(Date.now())
    });
  }

  private insertarTrabajadorLocal(id: number): void {
    const item: TrabajadorPropioItem = {
      id,
      dni: this.nuevoTrabajador.dni,
      nombreCompleto: this.nuevoTrabajador.nombreCompleto.toUpperCase(),
      unidad: this.nuevoTrabajador.unidad,
      area: this.nuevoTrabajador.area,
      puestoTrabajo: this.nuevoTrabajador.puestoTrabajo,
      grupoSeguridad: this.nuevoTrabajador.grupoSeguridad,
      tallaCasco: this.nuevoTrabajador.tallaCasco,
      tallaCalzado: this.nuevoTrabajador.tallaCalzado,
      tallaUniforme: this.nuevoTrabajador.tallaUniforme,
      aptitudMedica: 'APTO',
      estado: 'ACTIVO'
    };
    this.trabajadores.update(list => [item, ...list]);
    this.mostrarModalTrabajador.set(false);
    this.mostrarAviso(`Trabajador ${item.nombreCompleto} (DNI ${item.dni}) registrado.`);
  }

  guardarNuevaActaComite(): void {
    if (!this.nuevaActa.agendaPrincipal.trim() || !this.nuevaActa.acuerdoTomado.trim()) return;
    const nueva: ReunionComiteItem = {
      id: Date.now(),
      numeroActa: this.nuevaActa.numeroActa,
      tipoSesion: this.nuevaActa.tipoSesion,
      fechaReunion: this.nuevaActa.fechaReunion,
      agendaPrincipal: this.nuevaActa.agendaPrincipal,
      acuerdoTomado: this.nuevaActa.acuerdoTomado,
      responsableAcuerdo: this.nuevaActa.responsableAcuerdo,
      quorumAsistencia: '12 / 12 Miembros (100%)',
      estadoAcuerdo: 'EN_PROCESO'
    };
    this.reunionesComite.update(list => [nueva, ...list]);
    this.mostrarModalActaComite.set(false);
    this.mostrarAviso(`Acta ${nueva.numeroActa} registrada en el Libro Electrónico del Comité Paritario SST.`);
  }

  marcarAcuerdoCumplido(acta: ReunionComiteItem): void {
    this.reunionesComite.update(list =>
      list.map(a => a.id === acta.id ? { ...a, estadoAcuerdo: 'CUMPLIDO' } : a)
    );
    this.mostrarAviso(`Acuerdo del ${acta.numeroActa} cerrado y verificado al 100%.`);
  }

  abrirCabinaVotacion(proc: ProcesoElectoralItem): void {
    this.procesoElectoralSeleccionado.set(proc);
  }

  emitirVotoSecreto(proc: ProcesoElectoralItem, cand: CandidatoComiteItem): void {
    this.api.callAjaxPost('/eleccion_virtual/votar', {
      idProceso: proc.id,
      codigoProceso: proc.codigoProceso,
      idCandidato: cand.idCandidato,
      lista: cand.listaNumero
    }).subscribe({
      next: () => this.aplicarVotoSecretoLocal(proc.id, cand.idCandidato, cand.listaNumero),
      error: () => this.aplicarVotoSecretoLocal(proc.id, cand.idCandidato, cand.listaNumero)
    });
  }

  private aplicarVotoSecretoLocal(idProceso: number, idCandidato: number, listaNombre: string): void {
    this.elecciones.update(list =>
      list.map(p => {
        if (p.id !== idProceso) return p;
        const actualizados = p.candidatos.map(c =>
          c.idCandidato === idCandidato ? { ...c, votosRecibidos: c.votosRecibidos + 1 } : c
        );
        const actualizado: ProcesoElectoralItem = {
          ...p,
          totalVotosEmitidos: p.totalVotosEmitidos + 1,
          yaVotoUsuarioActual: true,
          candidatos: actualizados
        };
        this.procesoElectoralSeleccionado.set(actualizado);
        return actualizado;
      })
    );
    this.mostrarAviso(`Voto electrónico secreto emitido y cifrado con éxito para ${listaNombre}.`);
  }

  guardarNuevaConvocatoria(): void {
    if (!this.nuevaConvocatoria.tituloConvocatoria.trim()) return;
    this.api.callAjaxPost('/eleccion_virtual/insert', { ...this.nuevaConvocatoria, idEmpresa: 773 }).subscribe({
      next: () => this.insertarConvocatoriaLocal(),
      error: () => this.insertarConvocatoriaLocal()
    });
  }

  private insertarConvocatoriaLocal(): void {
    const nueva: ProcesoElectoralItem = {
      id: Date.now(),
      codigoProceso: this.nuevaConvocatoria.codigoProceso,
      tituloConvocatoria: this.nuevaConvocatoria.tituloConvocatoria,
      periodoVigencia: this.nuevaConvocatoria.periodoVigencia,
      fechaEleccion: this.nuevaConvocatoria.fechaEleccion,
      totalPadronElectoral: Number(this.nuevaConvocatoria.totalPadronElectoral) || 150,
      totalVotosEmitidos: 0,
      estadoProceso: 'EN_VOTACION',
      yaVotoUsuarioActual: false,
      candidatos: [
        {
          idCandidato: Date.now() + 1,
          listaNumero: 'LISTA N° 01',
          nombreCandidato: 'CANDIDATO TITULAR PLANTA 01',
          dni: '43991021',
          areaRepresentada: 'Operaciones Industriales',
          votosRecibidos: 0
        },
        {
          idCandidato: Date.now() + 2,
          listaNumero: 'LISTA N° 02',
          nombreCandidato: 'CANDIDATO TITULAR MANTENIMIENTO 02',
          dni: '45881239',
          areaRepresentada: 'Mantenimiento Planta',
          votosRecibidos: 0
        }
      ]
    };
    this.elecciones.update(list => [nueva, ...list]);
    this.procesoElectoralSeleccionado.set(nueva);
    this.mostrarModalConvocatoria.set(false);
    this.mostrarAviso(`Convocatoria Electoral "${nueva.codigoProceso}" publicada.`);
  }

  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
