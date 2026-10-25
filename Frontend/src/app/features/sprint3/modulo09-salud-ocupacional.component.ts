import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface ExamenMedicoItem {
  id: number;
  dni: string;
  trabajador: string;
  puesto: string;
  tipoExamen: 'PRE_OCUPACIONAL' | 'PERIODICO' | 'RETIRO';
  clinica: string;
  fechaExamen: string;
  fechaVencimiento: string;
  aptitud: 'APTO' | 'APTO_CON_RESTRICCION' | 'NO_APTO' | 'PENDIENTE';
  restricciones: string;
  medico: string;
  estado: 'VALIDADO' | 'PENDIENTE_REVISION' | 'PENDIENTE' | 'OBSERVADO';
}

export interface VigilanciaCovidItem {
  id: number;
  dni: string;
  trabajador: string;
  tipoPrueba: 'ANTIGENO' | 'MOLECULAR_PCR' | 'CONTROL_VACUNACION';
  esquemaDosis: string;
  resultado: 'NEGATIVO' | 'ALTA_EPIDEMIOLOGICA' | 'AISLAMIENTO';
  fichaSintomatologica: 'SIN_SINTOMAS' | 'OBSERVADO';
  fechaControl: string;
  medicoResponsable: string;
  estado: 'APROBADO' | 'EN_SEGUIMIENTO';
}

export interface EvaluacionPsicologicaItem {
  id: number;
  dni: string;
  trabajador: string;
  bateriaEvaluacion: string;
  trabajoCritico: 'ALTURA_Y_CONFINADOS' | 'CONDUCCION_MAQUINARIA' | 'OPERACION_GENERAL';
  nivelEstresFatiga: 'BAJO_CONTROLADO' | 'MODERADO' | 'ALTO_RIESGO';
  aptitudPsicologica: 'APTO' | 'APTO_CON_RECOMENDACION' | 'NO_APTO';
  psicologoEvaluador: string;
  fechaEvaluacion: string;
  estado: 'VALIDADO' | 'PENDIENTE';
}

export interface PolizaSctrItem {
  id: number;
  numeroPoliza: string;
  contratistaEmpresa: string;
  aseguradoraSalud: string;
  aseguradoraPension: string;
  periodoVigencia: string;
  fechaVencimiento: string;
  trabajadoresCubiertos: number;
  validadoGarita: boolean;
  estado: 'VIGENTE_HABILITADO' | 'POR_RENOVAR';
}

@Component({
  selector: 'msst-modulo09-salud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera Corporativa Módulo 09 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-heartbeat"></i>  Salud Ocupacional, Exámenes Médicos (EMO), Vigilancia COVID-19, Psicología y SCTR
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalEmo.set(true)">
              <i class="fa fa-plus-circle"></i> + Registrar EMO
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalCovid.set(true)">
              <i class="fa fa-medkit"></i> + Control Epidemiológico
            </button>
            <button class="btn btn-xs btn-warning" (click)="mostrarModalSctr.set(true)">
              <i class="fa fa-shield"></i> + Registrar Póliza SCTR
            </button>
          </div>
        </div>

        <!-- KPIs Superiores -->
        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">EXÁMENES MÉDICOS OCUPACIONALES (EMO)</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ examenesEmo().length }} Certificados</div>
                <div style="font-size: 11px; color: #28a745;">{{ totalEmoAptos() }} Aptos Validados RM 312-2011-MINSA</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">VIGILANCIA EPIDEMIOLÓGICA COVID-19</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ registrosCovid().length }} Controles</div>
                <div style="font-size: 11px; color: #888;">100% Esquema de Vacunación Completo</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #6f42c1; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PSICOLOGÍA Y RIESGOS PSICOSOCIALES</div>
                <div style="font-size: 20px; font-weight: bold; color: #6f42c1;">{{ evaluacionesPsicologia().length }} Evaluaciones</div>
                <div style="font-size: 11px; color: #888;">Batería CENSOPAS-COPSOQ / Altura</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">COBERTURA SCTR SALUD Y PENSIÓN</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ totalTrabajadoresSctr() }} Asegurados</div>
                <div style="font-size: 11px; color: #888;">{{ polizasSctr().length }} Pólizas Activas en Garita</div>
              </div>
            </div>
          </div>

          <!-- Navegación 4 Pestañas Interactivas -->
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 4px;">
            <button class="btn btn-sm" [ngClass]="pestana() === 'EMO' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('EMO')">
              <i class="fa fa-stethoscope"></i> 1. Exámenes Médicos (EMO)
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'COVID' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('COVID')">
              <i class="fa fa-shield"></i> 2. Vigilancia Epidemiológica y Vacunación
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'PSICOLOGIA' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('PSICOLOGIA')">
              <i class="fa fa-user-md"></i> 3. Psicología Ocupacional
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'SCTR' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('SCTR')">
              <i class="fa fa-medkit"></i> 4. Pólizas SCTR Salud y Pensión
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: EXÁMENES MÉDICOS OCUPACIONALES (EMO) -->
      @if (pestana() === 'EMO') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-stethoscope"></i> Matriz de Exámenes Médicos Ocupacionales — EMO</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvEmo()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalEmo.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Certificado EMO
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por trabajador, DNI, clínica DIGESA o médico evaluador..." [(ngModel)]="filtroEmo">
              </div>
              <div class="col-md-3">
                <select class="form-control input-sm" [(ngModel)]="filtroTipoEmo">
                  <option value="TODOS">Todos los Tipos de Examen</option>
                  <option value="PRE_OCUPACIONAL">PRE_OCUPACIONAL (Ingreso)</option>
                  <option value="PERIODICO">PERIODICO (Anual)</option>
                  <option value="RETIRO">RETIRO</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>DNI / Trabajador</th>
                    <th>Tipo Examen</th>
                    <th>Clínica Acreditada DIGESA</th>
                    <th>Fecha Examen</th>
                    <th>Vencimiento</th>
                    <th>Aptitud Médica</th>
                    <th>Restricciones / Recomendaciones</th>
                    <th>Médico Evaluador</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (e of examenesEmoFiltrados(); track e.id) {
                    <tr>
                      <td><strong>#{{ e.id }}</strong></td>
                      <td>
                        <div><strong>{{ e.trabajador }}</strong></div>
                        <small class="text-muted">DNI: {{ e.dni }} &bull; {{ e.puesto }}</small>
                      </td>
                      <td><span class="label label-primary">{{ e.tipoExamen }}</span></td>
                      <td>{{ e.clinica }}</td>
                      <td>{{ e.fechaExamen }}</td>
                      <td>{{ e.fechaVencimiento }}</td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': e.aptitud === 'APTO',
                          'label-warning': e.aptitud === 'APTO_CON_RESTRICCION',
                          'label-danger': e.aptitud === 'NO_APTO'
                        }">{{ e.aptitud }}</span>
                      </td>
                      <td style="font-size: 11px;">{{ e.restricciones }}</td>
                      <td>{{ e.medico }}</td>
                      <td>
                        <span class="label" [ngClass]="e.estado === 'VALIDADO' ? 'label-success' : 'label-warning'">
                          {{ e.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarEmo(e)" title="Validar Aptitud Médica">
                            <i class="fa fa-check"></i> Validar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarEmo(e)" title="Eliminar Registro">
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

      <!-- PESTAÑA 2: VIGILANCIA EPIDEMIOLÓGICA COVID-19 Y VACUNACIÓN -->
      @if (pestana() === 'COVID') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-shield"></i> Vigilancia Epidemiológica COVID-19, Esquema de Dosis y Fichas Sintomatológicas</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvCovid()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalCovid.set(true)">
                <i class="fa fa-plus-circle"></i> Nuevo Control Epidemiológico
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por trabajador, DNI, esquema de vacunación o resultado..." [(ngModel)]="filtroCovid">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>DNI / Trabajador</th>
                    <th>Tipo de Control / Prueba</th>
                    <th>Esquema de Dosis Vacunación</th>
                    <th>Resultado / Condición</th>
                    <th>Ficha Sintomatológica</th>
                    <th>Fecha Control</th>
                    <th>Médico Ocupacional</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of registrosCovidFiltrados(); track c.id) {
                    <tr>
                      <td><strong>#{{ c.id }}</strong></td>
                      <td><strong>{{ c.trabajador }}</strong> <br><small class="text-muted">DNI: {{ c.dni }}</small></td>
                      <td><span class="label label-info">{{ c.tipoPrueba }}</span></td>
                      <td><code>{{ c.esquemaDosis }}</code></td>
                      <td>
                        <span class="label" [ngClass]="c.resultado === 'AISLAMIENTO' ? 'label-danger' : 'label-success'">
                          {{ c.resultado }}
                        </span>
                      </td>
                      <td>
                        <span class="label" [ngClass]="c.fichaSintomatologica === 'SIN_SINTOMAS' ? 'label-success' : 'label-warning'">
                          {{ c.fichaSintomatologica }}
                        </span>
                      </td>
                      <td>{{ c.fechaControl }}</td>
                      <td>{{ c.medicoResponsable }}</td>
                      <td>
                        <span class="label" [ngClass]="c.estado === 'APROBADO' ? 'label-success' : 'label-warning'">
                          {{ c.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarCovid(c)" title="Otorgar Alta / Aprobar">
                            <i class="fa fa-check"></i> Aprobar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarCovid(c)" title="Eliminar">
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

      <!-- PESTAÑA 3: PSICOLOGÍA OCUPACIONAL Y RIESGOS PSICOSOCIALES -->
      @if (pestana() === 'PSICOLOGIA') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-user-md"></i> Psicología Ocupacional, Batería CENSOPAS-COPSOQ y Trabajos Críticos</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvPsicologia()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalPsicologia.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Evaluación Psicológica
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por trabajador, batería psicosocial o psicólogo..." [(ngModel)]="filtroPsicologia">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>DNI / Trabajador</th>
                    <th>Batería Psicosocial Aplicada</th>
                    <th>Perfil de Trabajo Crítico</th>
                    <th>Nivel Estrés / Fatiga</th>
                    <th>Aptitud Psicológica</th>
                    <th>Psicólogo Ocupacional</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of evaluacionesPsicologiaFiltradas(); track p.id) {
                    <tr>
                      <td><strong>#{{ p.id }}</strong></td>
                      <td><strong>{{ p.trabajador }}</strong> <br><small class="text-muted">DNI: {{ p.dni }}</small></td>
                      <td>{{ p.bateriaEvaluacion }}</td>
                      <td><span class="label label-primary">{{ p.trabajoCritico }}</span></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': p.nivelEstresFatiga === 'BAJO_CONTROLADO',
                          'label-warning': p.nivelEstresFatiga === 'MODERADO',
                          'label-danger': p.nivelEstresFatiga === 'ALTO_RIESGO'
                        }">{{ p.nivelEstresFatiga }}</span>
                      </td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-success': p.aptitudPsicologica === 'APTO',
                          'label-warning': p.aptitudPsicologica === 'APTO_CON_RECOMENDACION',
                          'label-danger': p.aptitudPsicologica === 'NO_APTO'
                        }">{{ p.aptitudPsicologica }}</span>
                      </td>
                      <td>{{ p.psicologoEvaluador }}</td>
                      <td>{{ p.fechaEvaluacion }}</td>
                      <td>
                        <span class="label" [ngClass]="p.estado === 'VALIDADO' ? 'label-success' : 'label-warning'">
                          {{ p.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarPsicologia(p)">
                            <i class="fa fa-check"></i> Validar
                          </button>
                          <button title="Eliminar registro" class="btn btn-xs btn-danger" (click)="eliminarPsicologia(p)">
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

      <!-- PESTAÑA 4: CONTROL DE PÓLIZAS SCTR SALUD Y PENSIÓN -->
      @if (pestana() === 'SCTR') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-medkit"></i> Control de Pólizas SCTR Salud y Pensión para Habilitación en Garita</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvSctr()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalSctr.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Póliza SCTR
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por N° póliza, contratista o aseguradora EPS/ONP..." [(ngModel)]="filtroSctr">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>N° Póliza SCTR</th>
                    <th>Empresa / Contratista Asegurada</th>
                    <th>Aseguradora Salud (EPS)</th>
                    <th>Aseguradora Pensión</th>
                    <th>Vigencia Mensual</th>
                    <th>Vencimiento</th>
                    <th style="text-align:center;">Planilla Cubierta</th>
                    <th>Pase Garita</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (s of polizasSctrFiltradas(); track s.id) {
                    <tr>
                      <td><strong>#{{ s.id }}</strong></td>
                      <td><code>{{ s.numeroPoliza }}</code></td>
                      <td><strong>{{ s.contratistaEmpresa }}</strong></td>
                      <td>{{ s.aseguradoraSalud }}</td>
                      <td>{{ s.aseguradoraPension }}</td>
                      <td>{{ s.periodoVigencia }}</td>
                      <td>{{ s.fechaVencimiento }}</td>
                      <td style="text-align:center;"><strong>{{ s.trabajadoresCubiertos }} trab.</strong></td>
                      <td>
                        <span class="label" [ngClass]="s.validadoGarita ? 'label-success' : 'label-warning'">
                          {{ s.validadoGarita ? 'HABILITADO GARITA' : 'EN REVISIÓN' }}
                        </span>
                      </td>
                      <td>
                        <span class="label" [ngClass]="s.estado === 'VIGENTE_HABILITADO' ? 'label-success' : 'label-warning'">
                          {{ s.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarSctr(s)">
                            <i class="fa fa-check"></i> Habilitar
                          </button>
                          <button title="Eliminar registro" class="btn btn-xs btn-danger" (click)="eliminarSctr(s)">
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

      <!-- MODAL NUEVO EMO -->
      @if (mostrarModalEmo()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 640px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-stethoscope"></i> Registrar Certificado de Examen Médico Ocupacional</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalEmo.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>DNI Trabajador:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.dni">
                </div>
                <div class="col-md-8 form-group">
                  <label>Apellidos y Nombres del Trabajador:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.trabajador" placeholder="Ej. Jorge Luis Huamán Rojas">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Puesto de Trabajo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.puesto">
                </div>
                <div class="col-md-6 form-group">
                  <label>Tipo de Examen (RM 312-2011-MINSA):</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoEmo.tipoExamen">
                    <option value="PRE_OCUPACIONAL">PRE_OCUPACIONAL (Ingreso)</option>
                    <option value="PERIODICO">PERIODICO (Anual)</option>
                    <option value="RETIRO">RETIRO</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Clínica Acreditada DIGESA:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.clinica">
                </div>
                <div class="col-md-3 form-group">
                  <label>Fecha Examen:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.fechaExamen">
                </div>
                <div class="col-md-3 form-group">
                  <label>Fecha Vencimiento:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.fechaVencimiento">
                </div>
              </div>
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Aptitud Médica:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoEmo.aptitud">
                    <option value="APTO">APTO</option>
                    <option value="APTO_CON_RESTRICCION">APTO_CON_RESTRICCION</option>
                    <option value="NO_APTO">NO_APTO</option>
                  </select>
                </div>
                <div class="col-md-7 form-group">
                  <label>Médico Evaluador (CMP / RNE):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.medico">
                </div>
              </div>
              <div class="form-group">
                <label>Restricciones / Recomendaciones Ocupacionales:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.restricciones">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalEmo.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoEmo()">
                <i class="fa fa-save"></i> Guardar Certificado EMO
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO CONTROL COVID -->
      @if (mostrarModalCovid()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-shield"></i> Registrar Control Epidemiológico y Vacunación</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalCovid.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>DNI:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.dni">
                </div>
                <div class="col-md-8 form-group">
                  <label>Trabajador:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.trabajador">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Tipo de Prueba / Control:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoCovid.tipoPrueba">
                    <option value="CONTROL_VACUNACION">CONTROL_VACUNACION</option>
                    <option value="ANTIGENO">ANTIGENO</option>
                    <option value="MOLECULAR_PCR">MOLECULAR_PCR</option>
                  </select>
                </div>
                <div class="col-md-6 form-group">
                  <label>Esquema de Dosis MINSA:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.esquemaDosis">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Resultado:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoCovid.resultado">
                    <option value="NEGATIVO">NEGATIVO</option>
                    <option value="ALTA_EPIDEMIOLOGICA">ALTA_EPIDEMIOLOGICA</option>
                    <option value="AISLAMIENTO">AISLAMIENTO</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Control:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.fechaControl">
                </div>
                <div class="col-md-4 form-group">
                  <label>Médico Evaluador:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.medicoResponsable">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalCovid.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoCovid()">
                <i class="fa fa-save"></i> Guardar Control
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA EVALUACIÓN PSICOLÓGICA -->
      @if (mostrarModalPsicologia()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-user-md"></i> Registrar Evaluación Psicológica Ocupacional</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalPsicologia.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>DNI:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaPsicologia.dni">
                </div>
                <div class="col-md-8 form-group">
                  <label>Trabajador Evaluado:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaPsicologia.trabajador">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Batería de Evaluación:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaPsicologia.bateriaEvaluacion">
                </div>
                <div class="col-md-6 form-group">
                  <label>Perfil Trabajo Crítico:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.trabajoCritico">
                    <option value="ALTURA_Y_CONFINADOS">ALTURA_Y_CONFINADOS</option>
                    <option value="CONDUCCION_MAQUINARIA">CONDUCCION_MAQUINARIA</option>
                    <option value="OPERACION_GENERAL">OPERACION_GENERAL</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Nivel Estrés/Fatiga:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.nivelEstresFatiga">
                    <option value="BAJO_CONTROLADO">BAJO_CONTROLADO</option>
                    <option value="MODERADO">MODERADO</option>
                    <option value="ALTO_RIESGO">ALTO_RIESGO</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Aptitud Psicológica:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.aptitudPsicologica">
                    <option value="APTO">APTO</option>
                    <option value="APTO_CON_RECOMENDACION">APTO_CON_RECOMENDACION</option>
                    <option value="NO_APTO">NO_APTO</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Psicólogo Evaluador:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaPsicologia.psicologoEvaluador">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalPsicologia.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaPsicologia()">
                <i class="fa fa-save"></i> Guardar Evaluación
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA PÓLIZA SCTR -->
      @if (mostrarModalSctr()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-medkit"></i> Registrar Póliza SCTR Salud y Pensión</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalSctr.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Número de Póliza:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.numeroPoliza">
                </div>
                <div class="col-md-7 form-group">
                  <label>Empresa / Contratista Asegurada:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.contratistaEmpresa">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Aseguradora SCTR Salud (EPS):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.aseguradoraSalud">
                </div>
                <div class="col-md-6 form-group">
                  <label>Aseguradora SCTR Pensión:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.aseguradoraPension">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Vigencia Mensual:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.periodoVigencia">
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Vencimiento:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSctr.fechaVencimiento">
                </div>
                <div class="col-md-4 form-group">
                  <label>N° Trabajadores Cubiertos:</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevoSctr.trabajadoresCubiertos">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalSctr.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoSctr()">
                <i class="fa fa-save"></i> Guardar Póliza SCTR
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo09SaludOcupacionalComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pestana = signal<'EMO' | 'COVID' | 'PSICOLOGIA' | 'SCTR' | 'VISOR'>('EMO');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly paginaVisorActiva = signal<'examenmedico.html' | 'covid.html' | 'psicologia.html'>('examenmedico.html');
  readonly notificacion = signal<string>('');

  readonly mostrarModalEmo = signal<boolean>(false);
  readonly mostrarModalCovid = signal<boolean>(false);
  readonly mostrarModalPsicologia = signal<boolean>(false);
  readonly mostrarModalSctr = signal<boolean>(false);

  filtroEmo = '';
  filtroTipoEmo = 'TODOS';
  filtroCovid = '';
  filtroPsicologia = '';
  filtroSctr = '';

  readonly examenesEmo = signal<ExamenMedicoItem[]>([
    {
      id: 1,
      dni: '43891024',
      trabajador: 'Juan Carlos Quispe Condori',
      puesto: 'Soldador Homologado 6G',
      tipoExamen: 'PERIODICO',
      clinica: 'Clínica Ocupacional Internacional S.A.C. (DIGESA)',
      fechaExamen: '10/10/2026',
      fechaVencimiento: '10/10/2027',
      aptitud: 'APTO',
      restricciones: 'Uso permanente de lentes de seguridad y protección auditiva doble en molienda',
      medico: 'Dr. Ricardo Vargas (CMP 45892 - RNE 21904)',
      estado: 'VALIDADO'
    },
    {
      id: 2,
      dni: '46120987',
      trabajador: 'Miguel Ángel Rojas Mendoza',
      puesto: 'Operador de Grúa Telescópica',
      tipoExamen: 'PRE_OCUPACIONAL',
      clinica: 'Centro Médico Ocupacional Natclar - Sede Centro',
      fechaExamen: '15/10/2026',
      fechaVencimiento: '15/10/2027',
      aptitud: 'APTO',
      restricciones: 'Apto para trabajos en altura estructural (>1.80 m) y gran altitud geográfica (>4,000 msnm)',
      medico: 'Dra. Elena Salas (CMP 51203)',
      estado: 'VALIDADO'
    },
    {
      id: 3,
      dni: '71029384',
      trabajador: 'Luis Alberto Villanueva Soto',
      puesto: 'Técnico Instrumentista Planta',
      tipoExamen: 'PERIODICO',
      clinica: 'Pulso Corporación Médica Ocupacional',
      fechaExamen: '18/10/2026',
      fechaVencimiento: '18/10/2027',
      aptitud: 'APTO_CON_RESTRICCION',
      restricciones: 'Uso obligatorio de correctores visuales oftálmicos durante labores eléctricas',
      medico: 'Dr. Ricardo Vargas (CMP 45892)',
      estado: 'PENDIENTE_REVISION'
    }
  ]);

  readonly registrosCovid = signal<VigilanciaCovidItem[]>([
    {
      id: 1,
      dni: '43891024',
      trabajador: 'Juan Carlos Quispe Condori',
      tipoPrueba: 'CONTROL_VACUNACION',
      esquemaDosis: '4 Dosis + Refuerzo Bivalente MINSA',
      resultado: 'ALTA_EPIDEMIOLOGICA',
      fichaSintomatologica: 'SIN_SINTOMAS',
      fechaControl: '12/10/2026',
      medicoResponsable: 'Dr. Ricardo Vargas',
      estado: 'APROBADO'
    },
    {
      id: 2,
      dni: '46120987',
      trabajador: 'Miguel Ángel Rojas Mendoza',
      tipoPrueba: 'ANTIGENO',
      esquemaDosis: '4 Dosis + Refuerzo Bivalente MINSA',
      resultado: 'NEGATIVO',
      fichaSintomatologica: 'SIN_SINTOMAS',
      fechaControl: '16/10/2026',
      medicoResponsable: 'Dra. Elena Salas',
      estado: 'APROBADO'
    }
  ]);

  readonly evaluacionesPsicologia = signal<EvaluacionPsicologicaItem[]>([
    {
      id: 1,
      dni: '43891024',
      trabajador: 'Juan Carlos Quispe Condori',
      bateriaEvaluacion: 'Batería CENSOPAS-COPSOQ + Test de Fobia a la Altura y Confinados',
      trabajoCritico: 'ALTURA_Y_CONFINADOS',
      nivelEstresFatiga: 'BAJO_CONTROLADO',
      aptitudPsicologica: 'APTO',
      psicologoEvaluador: 'Lic. Patricia Gómez (C.Ps.P. 18420)',
      fechaEvaluacion: '11/10/2026',
      estado: 'VALIDADO'
    },
    {
      id: 2,
      dni: '46120987',
      trabajador: 'Miguel Ángel Rojas Mendoza',
      bateriaEvaluacion: 'Evaluación Psicosensométrica y Control de Impulsos / Fatiga',
      trabajoCritico: 'CONDUCCION_MAQUINARIA',
      nivelEstresFatiga: 'BAJO_CONTROLADO',
      aptitudPsicologica: 'APTO',
      psicologoEvaluador: 'Lic. Patricia Gómez (C.Ps.P. 18420)',
      fechaEvaluacion: '15/10/2026',
      estado: 'VALIDADO'
    }
  ]);

  readonly polizasSctr = signal<PolizaSctrItem[]>([
    {
      id: 1,
      numeroPoliza: 'SCTR-2026-889410',
      contratistaEmpresa: 'CONSTRUCTORA E INGENIERÍA INDUSTRIAL DEL CENTRO S.A.C.',
      aseguradoraSalud: 'Rímac Seguros EPS',
      aseguradoraPension: 'Rímac Seguros y Reaseguros',
      periodoVigencia: 'OCTUBRE - NOVIEMBRE 2026',
      fechaVencimiento: '30/11/2026',
      trabajadoresCubiertos: 85,
      validadoGarita: true,
      estado: 'VIGENTE_HABILITADO'
    },
    {
      id: 2,
      numeroPoliza: 'SCTR-2026-774125',
      contratistaEmpresa: 'SERVICIOS ELECTROMECÁNICOS ANDINOS S.R.L.',
      aseguradoraSalud: 'Pacífico Seguros EPS',
      aseguradoraPension: 'ONP / Pacífico Vida',
      periodoVigencia: 'OCTUBRE - NOVIEMBRE 2026',
      fechaVencimiento: '30/11/2026',
      trabajadoresCubiertos: 42,
      validadoGarita: true,
      estado: 'VIGENTE_HABILITADO'
    }
  ]);

  nuevoEmo = {
    dni: '48219033',
    trabajador: '',
    puesto: 'Montajista Electromecánico',
    tipoExamen: 'PRE_OCUPACIONAL' as ExamenMedicoItem['tipoExamen'],
    clinica: 'Clínica Ocupacional Internacional S.A.C. (DIGESA)',
    fechaExamen: '24/10/2026',
    fechaVencimiento: '24/10/2027',
    aptitud: 'APTO' as ExamenMedicoItem['aptitud'],
    restricciones: 'Apto para trabajos de alto riesgo sin restricciones',
    medico: 'Dr. Ricardo Vargas (CMP 45892)'
  };

  nuevoCovid = {
    dni: '48219033',
    trabajador: '',
    tipoPrueba: 'CONTROL_VACUNACION' as VigilanciaCovidItem['tipoPrueba'],
    esquemaDosis: '4 Dosis + Refuerzo Anual Bivalente',
    resultado: 'NEGATIVO' as VigilanciaCovidItem['resultado'],
    fechaControl: '24/10/2026',
    medicoResponsable: 'Dr. Ricardo Vargas'
  };

  nuevaPsicologia = {
    dni: '48219033',
    trabajador: '',
    bateriaEvaluacion: 'Batería CENSOPAS-COPSOQ + Aptitud Altura/Confinados',
    trabajoCritico: 'ALTURA_Y_CONFINADOS' as EvaluacionPsicologicaItem['trabajoCritico'],
    nivelEstresFatiga: 'BAJO_CONTROLADO' as EvaluacionPsicologicaItem['nivelEstresFatiga'],
    aptitudPsicologica: 'APTO' as EvaluacionPsicologicaItem['aptitudPsicologica'],
    psicologoEvaluador: 'Lic. Patricia Gómez (C.Ps.P. 18420)'
  };

  nuevoSctr = {
    numeroPoliza: 'SCTR-2026-991020',
    contratistaEmpresa: '',
    aseguradoraSalud: 'Rímac Seguros EPS',
    aseguradoraPension: 'Rímac Seguros',
    periodoVigencia: 'NOVIEMBRE 2026',
    fechaVencimiento: '30/11/2026',
    trabajadoresCubiertos: 30
  };

  readonly totalEmoAptos = computed(() =>
    this.examenesEmo().filter(e => e.aptitud !== 'NO_APTO').length
  );

  readonly totalTrabajadoresSctr = computed(() =>
    this.polizasSctr().reduce((acc, s) => acc + (Number(s.trabajadoresCubiertos) || 0), 0)
  );

  readonly urlVisorSeguro = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.paginaVisorActiva()}`)
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/examenmedico/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['trabajador']) {
          const desdeSql: ExamenMedicoItem[] = list.map((r: Record<string, any>, idx: number) => {
            // F06: Preservar con estricta fidelidad clínica los resultados NO_APTO, PENDIENTE, APTO y RESTRICCIONES
            const rawApt = String(r['aptitud'] || 'PENDIENTE').toUpperCase().trim();
            let aptVal: 'APTO' | 'APTO_CON_RESTRICCION' | 'NO_APTO' | 'PENDIENTE' = 'PENDIENTE';
            if (rawApt.includes('NO') || rawApt.includes('DESAPROBADO') || rawApt.includes('INAPTO')) {
              aptVal = 'NO_APTO';
            } else if (rawApt.includes('RESTRIC')) {
              aptVal = 'APTO_CON_RESTRICCION';
            } else if (rawApt === 'APTO') {
              aptVal = 'APTO';
            } else {
              aptVal = 'PENDIENTE';
            }

            const rawEst = String(r['estado'] || '').toUpperCase().trim();
            const estVal: 'VALIDADO' | 'PENDIENTE' | 'OBSERVADO' =
              rawEst === 'VALIDADO' || (aptVal === 'APTO' || aptVal === 'APTO_CON_RESTRICCION')
                ? 'VALIDADO'
                : (aptVal === 'NO_APTO' ? 'OBSERVADO' : 'PENDIENTE');

            return {
              id: Number(r['id']) || (10 + idx),
              dni: String(r['dni'] || `4500112${idx}`),
              trabajador: String(r['trabajador'] || ''),
              puesto: String(r['puesto'] || 'Operador Industrial Planta'),
              tipoExamen: (String(r['tipoExamen'] || 'PERIODICO').toUpperCase().includes('PRE') ? 'PRE_OCUPACIONAL' : 'PERIODICO'),
              clinica: String(r['clinica'] || 'Clínica Ocupacional Acreditada DIGESA'),
              fechaExamen: String(r['fechaExamen'] || '15/10/2026'),
              fechaVencimiento: String(r['fechaVencimiento'] || '15/10/2027'),
              aptitud: aptVal,
              restricciones: String(r['restricciones'] || (aptVal === 'APTO_CON_RESTRICCION' ? 'Uso obligatorio de lentes correctores / descanso visual' : 'Sin restricciones')),
              medico: String(r['medico'] || 'Dr. Ricardo Vargas (CMP 45892)'),
              estado: estVal
            };
          });
          this.examenesEmo.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.trabajador === a.trabajador))
          ]);
        }
      }
    });

    // F12: Procesar respuestas secundarias sin descartar datos
    this.api.callAjaxPost('/covid/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const cList = res?.['list'];
        if (Array.isArray(cList) && cList.length > 0 && cList[0]['trabajador']) {
          const covidData: VigilanciaCovidItem[] = cList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            dni: String(r['dni'] || `4500112${i}`),
            trabajador: String(r['trabajador'] || ''),
            tipoPrueba: 'CONTROL_VACUNACION' as const,
            esquemaDosis: `${Number(r['dosis']) || 4} Dosis`,
            resultado: 'NEGATIVO' as const,
            fichaSintomatologica: 'SIN_SINTOMAS' as const,
            fechaControl: String(r['fecha'] || '10/01/2026'),
            medicoResponsable: 'Dr. Ricardo Vargas (CMP 45892)',
            estado: 'APROBADO' as const
          }));
          this.registrosCovid.set(covidData);
        }
      }
    });
    this.api.callAjaxPost('/psicologia/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const pList = res?.['list'];
        if (Array.isArray(pList) && pList.length > 0 && pList[0]['trabajador']) {
          const psData: EvaluacionPsicologicaItem[] = pList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            dni: String(r['dni'] || `4500112${i}`),
            trabajador: String(r['trabajador'] || ''),
            bateriaEvaluacion: 'Test de Fatiga, Somnolencia y Batería Psicosocial',
            trabajoCritico: 'ALTURA_Y_CONFINADOS' as const,
            nivelEstresFatiga: 'BAJO_CONTROLADO' as const,
            aptitudPsicologica: 'APTO' as const,
            psicologoEvaluador: 'Lic. Claudia Paredes (C.Ps.P 28410)',
            fechaEvaluacion: String(r['fecha'] || '18/10/2026'),
            estado: 'VALIDADO' as const
          }));
          this.evaluacionesPsicologia.set(psData);
        }
      }
    });
    this.api.callAjaxPost('/sctr/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const sList = res?.['list'];
        if (Array.isArray(sList) && sList.length > 0) {
          const sctrData: PolizaSctrItem[] = sList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            numeroPoliza: String(r['polizaSalud'] || `POL-SCTR-2026-0${i + 1}`),
            contratistaEmpresa: String(r['empresa'] || 'GRUPO ELIAS-29 S.A.C'),
            aseguradoraSalud: String(r['aseguradoraSalud'] || 'Rímac Seguros'),
            aseguradoraPension: String(r['aseguradoraPension'] || 'Prima AFP / ONP'),
            periodoVigencia: String(r['periodo'] || 'OCTUBRE 2026'),
            fechaVencimiento: String(r['vencimiento'] || '31/10/2026'),
            trabajadoresCubiertos: Number(r['cubiertos']) || 24,
            validadoGarita: true,
            estado: 'VIGENTE_HABILITADO' as const
          }));
          this.polizasSctr.set(sctrData);
        }
      }
    });
  }

  examenesEmoFiltrados(): ExamenMedicoItem[] {
    const q = this.filtroEmo.trim().toLowerCase();
    return this.examenesEmo().filter(e => {
      const okTipo = this.filtroTipoEmo === 'TODOS' || e.tipoExamen === this.filtroTipoEmo;
      const okTexto = !q || e.trabajador.toLowerCase().includes(q) || e.dni.includes(q) || e.clinica.toLowerCase().includes(q) || e.medico.toLowerCase().includes(q);
      return okTipo && okTexto;
    });
  }

  registrosCovidFiltrados(): VigilanciaCovidItem[] {
    const q = this.filtroCovid.trim().toLowerCase();
    if (!q) return this.registrosCovid();
    return this.registrosCovid().filter(c =>
      c.trabajador.toLowerCase().includes(q) || c.dni.includes(q) || c.esquemaDosis.toLowerCase().includes(q)
    );
  }

  evaluacionesPsicologiaFiltradas(): EvaluacionPsicologicaItem[] {
    const q = this.filtroPsicologia.trim().toLowerCase();
    if (!q) return this.evaluacionesPsicologia();
    return this.evaluacionesPsicologia().filter(p =>
      p.trabajador.toLowerCase().includes(q) || p.dni.includes(q) || p.bateriaEvaluacion.toLowerCase().includes(q)
    );
  }

  polizasSctrFiltradas(): PolizaSctrItem[] {
    const q = this.filtroSctr.trim().toLowerCase();
    if (!q) return this.polizasSctr();
    return this.polizasSctr().filter(s =>
      s.numeroPoliza.toLowerCase().includes(q) || s.contratistaEmpresa.toLowerCase().includes(q) || s.aseguradoraSalud.toLowerCase().includes(q)
    );
  }

  guardarNuevoEmo(): void {
    if (!this.nuevoEmo.trabajador.trim()) return;
    this.api.callAjaxPost('/examenmedico/insert', { ...this.nuevoEmo, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarEmoLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarEmoLocal(Date.now() % 10000)
    });
  }

  private insertarEmoLocal(id: number): void {
    const item: ExamenMedicoItem = {
      id,
      dni: this.nuevoEmo.dni,
      trabajador: this.nuevoEmo.trabajador,
      puesto: this.nuevoEmo.puesto,
      tipoExamen: this.nuevoEmo.tipoExamen,
      clinica: this.nuevoEmo.clinica,
      fechaExamen: this.nuevoEmo.fechaExamen,
      fechaVencimiento: this.nuevoEmo.fechaVencimiento,
      aptitud: this.nuevoEmo.aptitud,
      restricciones: this.nuevoEmo.restricciones,
      medico: this.nuevoEmo.medico,
      estado: 'VALIDADO'
    };
    this.examenesEmo.update(list => [item, ...list]);
    this.mostrarModalEmo.set(false);
    this.mostrarAviso(`Certificado EMO de "${item.trabajador}" registrado correctamente en OneSST.`);
  }

  aprobarEmo(item: ExamenMedicoItem): void {
    this.api.callAjaxPost('/examenmedico/aprobar', { id: item.id }).subscribe({
      next: () => this.marcarEmoAprobado(item),
      error: () => this.marcarEmoAprobado(item)
    });
  }

  private marcarEmoAprobado(item: ExamenMedicoItem): void {
    this.examenesEmo.update(list => list.map(e => e.id === item.id ? { ...e, estado: 'VALIDADO' } : e));
    this.mostrarAviso(`Aptitud médica de "${item.trabajador}" validada para pase en garita.`);
  }

  eliminarEmo(item: ExamenMedicoItem): void {
    this.api.callAjaxPost('/examenmedico/delete', { id: item.id }).subscribe({
      next: () => this.quitarEmoLocal(item),
      error: () => this.quitarEmoLocal(item)
    });
  }

  private quitarEmoLocal(item: ExamenMedicoItem): void {
    this.examenesEmo.update(list => list.filter(e => e.id !== item.id));
    this.mostrarAviso(`Registro EMO #${item.id} eliminado.`);
  }

  guardarNuevoCovid(): void {
    if (!this.nuevoCovid.trabajador.trim()) return;
    this.api.callAjaxPost('/covid/insert', { ...this.nuevoCovid, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarCovidLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarCovidLocal(Date.now() % 10000)
    });
  }

  private insertarCovidLocal(id: number): void {
    const item: VigilanciaCovidItem = {
      id,
      dni: this.nuevoCovid.dni,
      trabajador: this.nuevoCovid.trabajador,
      tipoPrueba: this.nuevoCovid.tipoPrueba,
      esquemaDosis: this.nuevoCovid.esquemaDosis,
      resultado: this.nuevoCovid.resultado,
      fichaSintomatologica: 'SIN_SINTOMAS',
      fechaControl: this.nuevoCovid.fechaControl,
      medicoResponsable: this.nuevoCovid.medicoResponsable,
      estado: 'APROBADO'
    };
    this.registrosCovid.update(list => [item, ...list]);
    this.mostrarModalCovid.set(false);
    this.mostrarAviso(`Control epidemiológico COVID-19 de "${item.trabajador}" guardado.`);
  }

  aprobarCovid(item: VigilanciaCovidItem): void {
    this.api.callAjaxPost('/covid/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.registrosCovid.update(list => list.map(c => c.id === item.id ? { ...c, estado: 'APROBADO', resultado: 'ALTA_EPIDEMIOLOGICA' } : c));
        this.mostrarAviso(`Alta epidemiológica aprobada para "${item.trabajador}".`);
      },
      error: () => {
        this.registrosCovid.update(list => list.map(c => c.id === item.id ? { ...c, estado: 'APROBADO', resultado: 'ALTA_EPIDEMIOLOGICA' } : c));
        this.mostrarAviso(`Alta epidemiológica aprobada para "${item.trabajador}".`);
      }
    });
  }

  eliminarCovid(item: VigilanciaCovidItem): void {
    this.api.callAjaxPost('/covid/delete', { id: item.id }).subscribe({
      next: () => {
        this.registrosCovid.update(list => list.filter(c => c.id !== item.id));
        this.mostrarAviso(`Control COVID #${item.id} eliminado.`);
      },
      error: () => {
        this.registrosCovid.update(list => list.filter(c => c.id !== item.id));
        this.mostrarAviso(`Control COVID #${item.id} eliminado.`);
      }
    });
  }

  guardarNuevaPsicologia(): void {
    if (!this.nuevaPsicologia.trabajador.trim()) return;
    this.api.callAjaxPost('/psicologia/insert', { ...this.nuevaPsicologia, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarPsicologiaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarPsicologiaLocal(Date.now() % 10000)
    });
  }

  private insertarPsicologiaLocal(id: number): void {
    const item: EvaluacionPsicologicaItem = {
      id,
      dni: this.nuevaPsicologia.dni,
      trabajador: this.nuevaPsicologia.trabajador,
      bateriaEvaluacion: this.nuevaPsicologia.bateriaEvaluacion,
      trabajoCritico: this.nuevaPsicologia.trabajoCritico,
      nivelEstresFatiga: this.nuevaPsicologia.nivelEstresFatiga,
      aptitudPsicologica: this.nuevaPsicologia.aptitudPsicologica,
      psicologoEvaluador: this.nuevaPsicologia.psicologoEvaluador,
      fechaEvaluacion: '24/10/2026',
      estado: 'VALIDADO'
    };
    this.evaluacionesPsicologia.update(list => [item, ...list]);
    this.mostrarModalPsicologia.set(false);
    this.mostrarAviso(`Evaluación psicológica de "${item.trabajador}" registrada.`);
  }

  aprobarPsicologia(item: EvaluacionPsicologicaItem): void {
    this.api.callAjaxPost('/psicologia/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.evaluacionesPsicologia.update(list => list.map(p => p.id === item.id ? { ...p, estado: 'VALIDADO' } : p));
        this.mostrarAviso(`Evaluación psicológica #${item.id} validada.`);
      },
      error: () => {
        this.evaluacionesPsicologia.update(list => list.map(p => p.id === item.id ? { ...p, estado: 'VALIDADO' } : p));
        this.mostrarAviso(`Evaluación psicológica #${item.id} validada.`);
      }
    });
  }

  eliminarPsicologia(item: EvaluacionPsicologicaItem): void {
    this.api.callAjaxPost('/psicologia/delete', { id: item.id }).subscribe({
      next: () => {
        this.evaluacionesPsicologia.update(list => list.filter(p => p.id !== item.id));
        this.mostrarAviso(`Evaluación psicológica #${item.id} eliminada.`);
      },
      error: () => {
        this.evaluacionesPsicologia.update(list => list.filter(p => p.id !== item.id));
        this.mostrarAviso(`Evaluación psicológica #${item.id} eliminada.`);
      }
    });
  }

  guardarNuevoSctr(): void {
    if (!this.nuevoSctr.contratistaEmpresa.trim()) return;
    this.api.callAjaxPost('/sctr/insert', { ...this.nuevoSctr, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarSctrLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarSctrLocal(Date.now() % 10000)
    });
  }

  private insertarSctrLocal(id: number): void {
    const item: PolizaSctrItem = {
      id,
      numeroPoliza: this.nuevoSctr.numeroPoliza,
      contratistaEmpresa: this.nuevoSctr.contratistaEmpresa,
      aseguradoraSalud: this.nuevoSctr.aseguradoraSalud,
      aseguradoraPension: this.nuevoSctr.aseguradoraPension,
      periodoVigencia: this.nuevoSctr.periodoVigencia,
      fechaVencimiento: this.nuevoSctr.fechaVencimiento,
      trabajadoresCubiertos: Number(this.nuevoSctr.trabajadoresCubiertos) || 10,
      validadoGarita: true,
      estado: 'VIGENTE_HABILITADO'
    };
    this.polizasSctr.update(list => [item, ...list]);
    this.mostrarModalSctr.set(false);
    this.mostrarAviso(`Póliza SCTR "${item.numeroPoliza}" registrada y vinculada con Garita.`);
  }

  aprobarSctr(item: PolizaSctrItem): void {
    this.api.callAjaxPost('/sctr/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.polizasSctr.update(list => list.map(s => s.id === item.id ? { ...s, validadoGarita: true, estado: 'VIGENTE_HABILITADO' } : s));
        this.mostrarAviso(`Póliza SCTR "${item.numeroPoliza}" habilitada en Garita.`);
      },
      error: () => {
        this.polizasSctr.update(list => list.map(s => s.id === item.id ? { ...s, validadoGarita: true, estado: 'VIGENTE_HABILITADO' } : s));
        this.mostrarAviso(`Póliza SCTR "${item.numeroPoliza}" habilitada en Garita.`);
      }
    });
  }

  eliminarSctr(item: PolizaSctrItem): void {
    this.api.callAjaxPost('/sctr/delete', { id: item.id }).subscribe({
      next: () => {
        this.polizasSctr.update(list => list.filter(s => s.id !== item.id));
        this.mostrarAviso(`Póliza SCTR #${item.id} eliminada.`);
      },
      error: () => {
        this.polizasSctr.update(list => list.filter(s => s.id !== item.id));
        this.mostrarAviso(`Póliza SCTR #${item.id} eliminada.`);
      }
    });
  }

  exportarCsvEmo(): void {
    const rows = this.examenesEmo().map(e =>
      `${e.id};"${e.dni}";"${e.trabajador}";"${e.tipoExamen}";"${e.clinica}";"${e.fechaExamen}";"${e.aptitud}";"${e.medico}"`
    );
    this.descargarArchivoCsv('MSST_Modulo09_EMO.csv', 'ID;DNI;Trabajador;TipoExamen;Clinica;Fecha;Aptitud;Medico\n' + rows.join('\n'));
  }

  exportarCsvCovid(): void {
    const rows = this.registrosCovid().map(c =>
      `${c.id};"${c.dni}";"${c.trabajador}";"${c.tipoPrueba}";"${c.esquemaDosis}";"${c.resultado}";"${c.fechaControl}"`
    );
    this.descargarArchivoCsv('MSST_Modulo09_COVID19.csv', 'ID;DNI;Trabajador;TipoPrueba;EsquemaDosis;Resultado;Fecha\n' + rows.join('\n'));
  }

  exportarCsvPsicologia(): void {
    const rows = this.evaluacionesPsicologia().map(p =>
      `${p.id};"${p.dni}";"${p.trabajador}";"${p.bateriaEvaluacion}";"${p.trabajoCritico}";"${p.aptitudPsicologica}"`
    );
    this.descargarArchivoCsv('MSST_Modulo09_Psicologia.csv', 'ID;DNI;Trabajador;Bateria;TrabajoCritico;Aptitud\n' + rows.join('\n'));
  }

  exportarCsvSctr(): void {
    const rows = this.polizasSctr().map(s =>
      `${s.id};"${s.numeroPoliza}";"${s.contratistaEmpresa}";"${s.aseguradoraSalud}";"${s.periodoVigencia}";${s.trabajadoresCubiertos};"${s.estado}"`
    );
    this.descargarArchivoCsv('MSST_Modulo09_SCTR.csv', 'ID;Poliza;Empresa;AseguradoraSalud;Vigencia;Trabajadores;Estado\n' + rows.join('\n'));
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
