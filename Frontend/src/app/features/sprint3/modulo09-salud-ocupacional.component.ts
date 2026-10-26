import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { apiErrorMessage, GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';
import { IntentKeys } from '../../core/services/workflow-api.service';

export interface MedicalCatalogRow {category:string;code:string;label:string;enabled:boolean;version:string;}

export interface ExamenMedicoItem {
  id: number;
  version: string;
  dni: string;
  trabajador: string;
  puesto: string;
  tipoExamen: string;
  clinica: string;
  fechaExamen: string;
  fechaVencimiento: string;
  aptitud: string;
  restricciones: string;
  medico: string;
  estado: string;
}

export interface VigilanciaCovidItem {
  id: number;
  version: string;
  dni: string;
  trabajador: string;
  tipoPrueba: string;
  esquemaDosis: string;
  resultado: string;
  fichaSintomatologica: string;
  fechaControl: string;
  medicoResponsable: string;
  estado: string;
}

export interface EvaluacionPsicologicaItem {
  id: number;
  version: string;
  dni: string;
  trabajador: string;
  bateriaEvaluacion: string;
  trabajoCritico: string;
  nivelEstresFatiga: string;
  aptitudPsicologica: string;
  psicologoEvaluador: string;
  fechaEvaluacion: string;
  estado: string;
}

export interface PolizaSctrItem {
  id: number;
  version: string;
  numeroPoliza: string;
  contratistaEmpresa: string;
  aseguradoraSalud: string;
  aseguradoraPension: string;
  periodoVigencia: string;
  fechaVencimiento: string;
  trabajadoresCubiertos: number;
  estado: string;
}

export function readMedicalRecord<T>(raw:Record<string,any>):T {
  if(!Number.isSafeInteger(raw['id'])||raw['id']<=0||typeof raw['version']!=='string'||!raw['version'])throw new Error('El servidor no confirmó identidad y versión del registro médico.');
  return structuredClone(raw) as T;
}
export function readMedicalMutation(raw:Record<string,any>,requestId:string,expectedId?:number):Record<string,any> {
  if(typeof raw['requestId']!=='string'||raw['requestId'].toLowerCase()!==requestId.toLowerCase())throw new Error('El recibo médico corresponde a otra solicitud.');
  const snapshot=raw['snapshot'];
  if(snapshot===null||typeof snapshot!=='object'||typeof snapshot['version']!=='string'||!snapshot['version']||
      snapshot['record']===null||typeof snapshot['record']!=='object'||Array.isArray(snapshot['record']))throw new Error('Falta el registro médico persistido.');
  const record=readMedicalRecord<Record<string,any>>({...snapshot['record'],version:snapshot['version']});
  if(expectedId!==undefined&&record['id']!==expectedId)throw new Error('El servidor confirmó otro registro médico.');
  return record;
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
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ examenesEmo().length }} Registros</div>
                <div style="font-size: 11px; color: #28a745;">Dictámenes y revisiones registrados por separado</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">VIGILANCIA EPIDEMIOLÓGICA COVID-19</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ registrosCovid().length }} Controles</div>
                <div style="font-size: 11px; color: #888;">Resultados recuperados de los controles registrados</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #6f42c1; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PSICOLOGÍA Y RIESGOS PSICOSOCIALES</div>
                <div style="font-size: 20px; font-weight: bold; color: #6f42c1;">{{ evaluacionesPsicologia().length }} Evaluaciones</div>
                <div style="font-size: 11px; color: #888;">Métodos y resultados de cada evaluación</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">COBERTURA SCTR SALUD Y PENSIÓN</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ totalTrabajadoresSctr() ?? 'Sin dato completo' }} Trabajadores declarados</div>
                <div style="font-size: 11px; color: #888;">{{ polizasSctr().length }} Pólizas registradas</div>
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

      @if (puedeAdministrarCatalogos()) {
        <section class="panel panel-default" aria-label="Catálogos médicos">
          <div class="panel-heading"><strong>Catálogos médicos configurados</strong></div>
          <div class="panel-body">
            <p>Los códigos disponibles y sus etiquetas se guardan por empresa. Una edición requiere la versión consultada.</p>
            <button type="button" class="btn btn-default" (click)="cargarAdministracionCatalogos()">Actualizar catálogo</button>
            <form (ngSubmit)="guardarCatalogo()" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
              <label>Categoría <select name="categoriaCatalogo" class="form-control" [(ngModel)]="edicionCatalogo.category" [disabled]="!!edicionCatalogo.expectedVersion" required>
                <option value="">Seleccione</option>@for (tipo of tiposCatalogo(); track tipo.code) {<option [value]="tipo.code">{{ tipo.label }}</option>}
              </select></label>
              <label>Código <input name="codigoCatalogo" class="form-control" [(ngModel)]="edicionCatalogo.code" [readonly]="!!edicionCatalogo.expectedVersion" maxlength="100" required></label>
              <label>Etiqueta <input name="etiquetaCatalogo" class="form-control" [(ngModel)]="edicionCatalogo.label" maxlength="250" required></label>
              <label><input type="checkbox" name="habilitarCatalogo" [(ngModel)]="edicionCatalogo.enabled"> Habilitado</label>
              <button class="btn btn-primary" type="submit" [disabled]="guardandoCatalogo()">Guardar catálogo</button>
              <button class="btn btn-default" type="button" (click)="nuevoCatalogo()">Nuevo elemento</button>
            </form>
            <table class="table table-condensed"><thead><tr><th>Categoría</th><th>Código</th><th>Etiqueta</th><th>Habilitado</th><th>Edición</th></tr></thead><tbody>
              @for (item of catalogosAdministrables(); track item.category + ':' + item.code) {
                <tr><td>{{ item.category }}</td><td>{{ item.code }}</td><td>{{ item.label }}</td><td>{{ item.enabled ? 'Sí' : 'No' }}</td><td><button class="btn btn-xs btn-default" (click)="editarCatalogo(item)">Editar</button></td></tr>
              } @empty {<tr><td colspan="5">No se han recuperado elementos de catálogo.</td></tr>}
            </tbody></table>
          </div>
        </section>
      }

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
                  @for (option of catalogo('examType'); track option.code) {<option [value]="option.code">{{ option.label }}</option>}
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
                      <td><span class="label label-primary">{{ etiquetaCatalogo('examType', e.tipoExamen) }}</span></td>
                      <td>{{ e.clinica }}</td>
                      <td>{{ e.fechaExamen }}</td>
                      <td>{{ e.fechaVencimiento }}</td>
                      <td>
                        <span class="label label-default">{{ etiquetaCatalogo('outcome', e.aptitud) }}</span>
                      </td>
                      <td style="font-size: 11px;">{{ e.restricciones }}</td>
                      <td>{{ e.medico }}</td>
                      <td>
                        <span class="label label-default">
                          {{ etiquetaCatalogo('reviewState', e.estado) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarEmo()" title="Solicitar revisión del dictamen sin cambiar la aptitud">
                            <i class="fa fa-tasks"></i> Revisar expediente
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
                      <td><span class="label label-info">{{ etiquetaCatalogo('covidTestType', c.tipoPrueba) }}</span></td>
                      <td><code>{{ c.esquemaDosis }}</code></td>
                      <td>
                        <span class="label label-default">
                          {{ etiquetaCatalogo('covidResult', c.resultado) }}
                        </span>
                      </td>
                      <td>
                        <span class="label label-default">
                          {{ c.fichaSintomatologica }}
                        </span>
                      </td>
                      <td>{{ c.fechaControl }}</td>
                      <td>{{ c.medicoResponsable }}</td>
                      <td>
                        <span class="label label-default">
                          {{ etiquetaCatalogo('reviewState', c.estado) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarCovid()" title="Revisar control sin convertir el resultado">
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
            <h4 class="panel-title"><i class="fa fa-user-md"></i> Psicología Ocupacional y Trabajos Críticos</h4>
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
                      <td><span class="label label-primary">{{ etiquetaCatalogo('psychWorkType', p.trabajoCritico) }}</span></td>
                      <td>
                        <span class="label label-default">{{ etiquetaCatalogo('psychStress', p.nivelEstresFatiga) }}</span>
                      </td>
                      <td>
                        <span class="label label-default">{{ etiquetaCatalogo('psychOutcome', p.aptitudPsicologica) }}</span>
                      </td>
                      <td>{{ p.psicologoEvaluador }}</td>
                      <td>{{ p.fechaEvaluacion }}</td>
                      <td>
                        <span class="label label-default">
                          {{ etiquetaCatalogo('reviewState', p.estado) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarPsicologia()">
                            <i class="fa fa-tasks"></i> Revisar expediente
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
                        <span>Consulte la evaluación vigente de garita.</span>
                      </td>
                      <td>
                        <span class="label label-default">
                          {{ etiquetaCatalogo('sctrState', s.estado) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarSctr()">
                            <i class="fa fa-tasks"></i> Revisar expediente
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
                  <label>Tipo de Examen:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoEmo.tipoExamen"><option value="">Seleccione</option> @for (option of catalogo('examType'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Clínica evaluadora:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEmo.clinica">
                </div>
                <div class="col-md-3 form-group">
                  <label>Fecha Examen:</label>
                  <input type="date" class="form-control input-sm" [(ngModel)]="nuevoEmo.fechaExamen">
                </div>
                <div class="col-md-3 form-group">
                  <label>Fecha Vencimiento:</label>
                  <input type="date" class="form-control input-sm" [(ngModel)]="nuevoEmo.fechaVencimiento">
                </div>
              </div>
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Aptitud Médica:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoEmo.aptitud"><option value="">Seleccione</option> @for (option of catalogo('outcome'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
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
                  <select class="form-control input-sm" [(ngModel)]="nuevoCovid.tipoPrueba"><option value="">Seleccione</option> @for (option of catalogo('covidTestType'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
                <div class="col-md-6 form-group">
                  <label>Esquema de dosis registrado:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCovid.esquemaDosis">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Resultado:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoCovid.resultado"><option value="">Seleccione</option> @for (option of catalogo('covidResult'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Control:</label>
                  <input type="date" class="form-control input-sm" [(ngModel)]="nuevoCovid.fechaControl">
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
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.trabajoCritico"><option value="">Seleccione</option> @for (option of catalogo('psychWorkType'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Nivel Estrés/Fatiga:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.nivelEstresFatiga"><option value="">Seleccione</option> @for (option of catalogo('psychStress'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Aptitud Psicológica:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaPsicologia.aptitudPsicologica"><option value="">Seleccione</option> @for (option of catalogo('psychOutcome'); track option.code) { <option [value]="option.code">{{ option.label }}</option> }</select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha de evaluación:</label><input type="date" class="form-control input-sm" [(ngModel)]="nuevaPsicologia.fechaEvaluacion"><label>Psicólogo Evaluador:</label>
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
                  <input type="date" class="form-control input-sm" [(ngModel)]="nuevoSctr.fechaVencimiento">
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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly pestana = signal<'EMO' | 'COVID' | 'PSICOLOGIA' | 'SCTR' | 'VISOR'>('EMO');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });

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

  readonly examenesEmo = signal<ExamenMedicoItem[]>([]);

  readonly registrosCovid = signal<VigilanciaCovidItem[]>([]);

  readonly evaluacionesPsicologia = signal<EvaluacionPsicologicaItem[]>([]);

  readonly polizasSctr = signal<PolizaSctrItem[]>([]);

  readonly tiposCatalogo=signal<{code:string;label:string}[]>([]);
  readonly catalogosAdministrables=signal<MedicalCatalogRow[]>([]);
  readonly guardandoCatalogo=signal(false);
  edicionCatalogo:{category:string;code:string;label:string;enabled:boolean;expectedVersion?:string}={category:'',code:'',label:'',enabled:true};
  puedeAdministrarCatalogos():boolean { return this.session.snapshot()?.permissions.includes('medical:catalog:write')===true; }
  nuevoCatalogo():void {this.edicionCatalogo={category:'',code:'',label:'',enabled:true};}
  editarCatalogo(item:MedicalCatalogRow):void {this.edicionCatalogo={category:item.category,code:item.code,label:item.label,enabled:item.enabled,expectedVersion:item.version};}
  cargarAdministracionCatalogos():void {
    if(!this.puedeAdministrarCatalogos())return;
    this.http.get<Record<string,unknown>>('/sst/medical/catalogs/types').subscribe({next:res=>{try{
      const rows=this.listaConfirmada(res);
      if(rows.some(x=>typeof x['code']!=='string'||!x['code']||typeof x['label']!=='string'))throw new Error('El servidor no confirmó los tipos de catálogo.');
      this.tiposCatalogo.set(rows as {code:string;label:string}[]);
    }catch(error){this.mostrarAviso(apiErrorMessage(error));}},error:error=>this.mostrarAviso(apiErrorMessage(error))});
    this.http.get<Record<string,unknown>>('/sst/medical/catalogs/admin').subscribe({next:res=>{try{
      const rows=this.listaConfirmada(res);
      if(rows.some(x=>typeof x['code']!=='string'||typeof x['label']!=='string'||typeof x['category']!=='string'||typeof x['enabled']!=='boolean'||typeof x['version']!=='string'||!x['version']))throw new Error('Falta el catálogo y su versión persistida.');
      this.catalogosAdministrables.set(rows as MedicalCatalogRow[]);
    }catch(error){this.mostrarAviso(apiErrorMessage(error));}},error:error=>this.mostrarAviso(apiErrorMessage(error))});
  }
  guardarCatalogo():void {
    if(!this.puedeAdministrarCatalogos()||this.guardandoCatalogo())return;
    const data={...this.edicionCatalogo};
    if(!data.category||!data.code.trim()||!data.label.trim()){this.mostrarAviso('Complete categoría, código y etiqueta.');return;}
    const payload={...data,idempotencyKey:this.intents.key('medical:catalog:save',data)};
    this.guardandoCatalogo.set(true);
    this.http.put<Record<string,any>>('/sst/medical/catalogs',payload).subscribe({next:res=>{this.guardandoCatalogo.set(false);try{
      if(res['CODE_RESPONSE']!=='05'||res['STATUS_CODE']!=='01')throw new Error(typeof res['mensajeRespuesta']==='string'?res['mensajeRespuesta']:'El catálogo no se confirmó.');
      const snapshot=res['snapshot'],row=snapshot?.['record'];
      if(res['requestId']!==payload.idempotencyKey||!snapshot||typeof snapshot['version']!=='string'||!snapshot['version']||!row||row['category']!==data.category||row['code']!==data.code||row['label']!==data.label||row['enabled']!==data.enabled)throw new Error('El recibo no corresponde al elemento enviado.');
      this.edicionCatalogo={...data,expectedVersion:snapshot['version']};
      this.cargarDatosDesdeSql();this.cargarAdministracionCatalogos();this.mostrarAviso('Catálogo confirmado por el servidor.');
    }catch(error){this.mostrarAviso(apiErrorMessage(error));}},error:error=>{this.guardandoCatalogo.set(false);this.mostrarAviso(apiErrorMessage(error));}});
  }
  readonly catalogos = signal<{code:string;label:string;category:string}[]>([]);
  private readonly intents = new IntentKeys();
  nuevoEmo = { dni:'', trabajador:'', puesto:'', tipoExamen:'', clinica:'', fechaExamen:'', fechaVencimiento:'', aptitud:'', restricciones:'', medico:'' };
  nuevoCovid = { dni:'', trabajador:'', tipoPrueba:'', esquemaDosis:'', resultado:'', fechaControl:'', medicoResponsable:'' };
  nuevaPsicologia = { dni:'', trabajador:'', bateriaEvaluacion:'', trabajoCritico:'', nivelEstresFatiga:'', aptitudPsicologica:'', psicologoEvaluador:'', fechaEvaluacion:'' };
  nuevoSctr = { numeroPoliza:'', contratistaEmpresa:'', aseguradoraSalud:'', aseguradoraPension:'', periodoVigencia:'', fechaVencimiento:'', trabajadoresCubiertos:0 };
  etiquetaCatalogo(category:string,code:string):string {return this.catalogo(category).find(x=>x.code===code)?.label??code;}
  catalogo(category:string):{code:string;label:string;category:string}[] { return this.catalogos().filter(x=>x.category===category); }

  readonly totalTrabajadoresSctr = computed<number|null>(() => {
    const rows=this.polizasSctr();
    if(rows.some(s=>!Number.isSafeInteger(s.trabajadoresCubiertos)||s.trabajadoresCubiertos<0))return null;
    return rows.reduce((total,s)=>total+s.trabajadoresCubiertos,0);
  });

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
    this.cargarAdministracionCatalogos();
  }

  cargarDatosDesdeSql(): void {
    if(!this.session.snapshot()){ this.mostrarAviso('Inicie sesión para consultar información médica autorizada.'); return; }
    this.api.callAjaxPost('/medical/catalogs',{}).subscribe({
      next:res=>{try{
        const list=this.listaConfirmada(res);
        if(list.some(x=>typeof x['code']!=='string'||typeof x['label']!=='string'||typeof x['category']!=='string')) throw new Error('Catálogo médico inválido.');
        this.catalogos.set(list as {code:string;label:string;category:string}[]);
      }catch(error){this.mostrarAviso(apiErrorMessage(error));}},
      error:error=>this.mostrarAviso(apiErrorMessage(error))
    });
    this.cargarLista('/examenmedico/lista',rows=>this.examenesEmo.set(rows.map(r=>this.medicalRecord<ExamenMedicoItem>(r))));
    this.cargarLista('/covid/lista',rows=>this.registrosCovid.set(rows.map(r=>this.medicalRecord<VigilanciaCovidItem>(r))));
    this.cargarLista('/psicologia/lista',rows=>this.evaluacionesPsicologia.set(rows.map(r=>this.medicalRecord<EvaluacionPsicologicaItem>(r))));
    this.cargarLista('/sctr/lista',rows=>this.polizasSctr.set(rows.map(r=>this.medicalRecord<PolizaSctrItem>(r))));
  }

  private listaConfirmada(res:Record<string,any>):Record<string,any>[] {
    if(res['CODE_RESPONSE']!=='05'||res['STATUS_CODE']!=='01')throw new Error(typeof res['mensajeRespuesta']==='string'?res['mensajeRespuesta']:'La consulta no se confirmó.');
    const rows:unknown=res['list'];
    if(!Array.isArray(rows)||rows.some(r=>r===null||typeof r!=='object'||Array.isArray(r))) throw new Error('El servidor no confirmó la lista solicitada.');
    return rows as Record<string,any>[];
  }
  private medicalRecord<T>(raw:Record<string,any>):T{return readMedicalRecord<T>(raw);}
  private cargarLista(route:string,apply:(rows:Record<string,any>[])=>void):void {
    this.api.callAjaxPost(route,{}).subscribe({
      next:res=>{try{apply(this.listaConfirmada(res));}catch(error){this.mostrarAviso(apiErrorMessage(error));}},
      error:error=>this.mostrarAviso(apiErrorMessage(error))
    });
  }
  private registrarOperacion(route:string,data:Record<string,unknown>,apply:(record:Record<string,any>)=>void):void {
    if(!this.session.snapshot()){this.mostrarAviso('Inicie sesión para continuar.');return;}
    const payload={...data,idempotencyKey:this.intents.key(route,data)};
    this.api.callAjaxPost(route,payload).subscribe({
      next:res=>{try{
        const record=readMedicalMutation(res,payload.idempotencyKey,typeof data['id']==='number'?data['id']:undefined);
        apply(record);
        this.mostrarAviso(typeof res['mensajeRespuesta']==='string'?res['mensajeRespuesta']:'Cambio confirmado por el servidor.');
      }catch(error){this.mostrarAviso(apiErrorMessage(error));}},
      error:error=>this.mostrarAviso(apiErrorMessage(error))
    });
  }

  private coincide(value:unknown,query:string):boolean {return typeof value==='string'&&value.toLowerCase().includes(query);}
  examenesEmoFiltrados(): ExamenMedicoItem[] {
    const q = this.filtroEmo.trim().toLowerCase();
    return this.examenesEmo().filter(e => {
      const okTipo = this.filtroTipoEmo === 'TODOS' || e.tipoExamen === this.filtroTipoEmo;
      const okTexto = !q || this.coincide(e.trabajador,q) || this.coincide(e.dni,q) || this.coincide(e.clinica,q) || this.coincide(e.medico,q);
      return okTipo && okTexto;
    });
  }

  registrosCovidFiltrados(): VigilanciaCovidItem[] {
    const q = this.filtroCovid.trim().toLowerCase();
    if (!q) return this.registrosCovid();
    return this.registrosCovid().filter(c =>
      this.coincide(c.trabajador,q) || this.coincide(c.dni,q) || this.coincide(c.esquemaDosis,q)
    );
  }

  evaluacionesPsicologiaFiltradas(): EvaluacionPsicologicaItem[] {
    const q = this.filtroPsicologia.trim().toLowerCase();
    if (!q) return this.evaluacionesPsicologia();
    return this.evaluacionesPsicologia().filter(p =>
      this.coincide(p.trabajador,q) || this.coincide(p.dni,q) || this.coincide(p.bateriaEvaluacion,q)
    );
  }

  polizasSctrFiltradas(): PolizaSctrItem[] {
    const q = this.filtroSctr.trim().toLowerCase();
    if (!q) return this.polizasSctr();
    return this.polizasSctr().filter(s =>
      this.coincide(s.numeroPoliza,q) || this.coincide(s.contratistaEmpresa,q) || this.coincide(s.aseguradoraSalud,q)
    );
  }

  guardarNuevoEmo(): void {
    if(!this.nuevoEmo.dni.trim()||!this.nuevoEmo.trabajador.trim()||!this.nuevoEmo.aptitud||!this.nuevoEmo.tipoExamen){this.mostrarAviso('Complete sujeto, tipo y resultado según el catálogo vigente.');return;}
    this.registrarOperacion('/examenmedico/insert',{...this.nuevoEmo},record=>{
      this.examenesEmo.update(rows=>[this.medicalRecord<ExamenMedicoItem>(record),...rows.filter(x=>x.id!==record['id'])]);
      this.mostrarModalEmo.set(false);
    });
  }
  aprobarEmo():void { void this.router.navigate(['/workflow']); }
  eliminarEmo(item:ExamenMedicoItem):void {
    this.registrarOperacion('/examenmedico/delete',{id:item.id,expectedVersion:item.version},()=>this.examenesEmo.update(rows=>rows.filter(x=>x.id!==item.id)));
  }
  guardarNuevoCovid():void {
    if(!this.nuevoCovid.dni.trim()||!this.nuevoCovid.trabajador.trim()||!this.nuevoCovid.tipoPrueba||!this.nuevoCovid.resultado){this.mostrarAviso('Complete sujeto, prueba y resultado del control.');return;}
    this.registrarOperacion('/covid/insert',{...this.nuevoCovid},record=>{
      this.registrosCovid.update(rows=>[this.medicalRecord<VigilanciaCovidItem>(record),...rows.filter(x=>x.id!==record['id'])]);this.mostrarModalCovid.set(false);
    });
  }
  aprobarCovid():void { void this.router.navigate(['/workflow']); }
  eliminarCovid(item:VigilanciaCovidItem):void {
    this.registrarOperacion('/covid/delete',{id:item.id,expectedVersion:item.version},()=>this.registrosCovid.update(rows=>rows.filter(x=>x.id!==item.id)));
  }
  guardarNuevaPsicologia():void {
    if(!this.nuevaPsicologia.dni.trim()||!this.nuevaPsicologia.trabajador.trim()||!this.nuevaPsicologia.aptitudPsicologica){this.mostrarAviso('Complete sujeto y dictamen psicológico.');return;}
    this.registrarOperacion('/psicologia/insert',{...this.nuevaPsicologia},record=>{
      this.evaluacionesPsicologia.update(rows=>[this.medicalRecord<EvaluacionPsicologicaItem>(record),...rows.filter(x=>x.id!==record['id'])]);this.mostrarModalPsicologia.set(false);
    });
  }
  aprobarPsicologia():void { void this.router.navigate(['/workflow']); }
  eliminarPsicologia(item:EvaluacionPsicologicaItem):void {
    this.registrarOperacion('/psicologia/delete',{id:item.id,expectedVersion:item.version},()=>this.evaluacionesPsicologia.update(rows=>rows.filter(x=>x.id!==item.id)));
  }
  guardarNuevoSctr():void {
    if(!this.nuevoSctr.numeroPoliza.trim()||!this.nuevoSctr.contratistaEmpresa.trim()){this.mostrarAviso('Complete los datos reales de la póliza.');return;}
    this.registrarOperacion('/sctr/insert',{...this.nuevoSctr},record=>{
      this.polizasSctr.update(rows=>[this.medicalRecord<PolizaSctrItem>(record),...rows.filter(x=>x.id!==record['id'])]);this.mostrarModalSctr.set(false);
    });
  }
  aprobarSctr():void { void this.router.navigate(['/workflow']); }
  eliminarSctr(item:PolizaSctrItem):void {
    this.registrarOperacion('/sctr/delete',{id:item.id,expectedVersion:item.version},()=>this.polizasSctr.update(rows=>rows.filter(x=>x.id!==item.id)));
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
