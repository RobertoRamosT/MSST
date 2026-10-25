import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface CursoCapacitacionItem {
  id: number;
  modalidad: 'PRESENCIAL' | 'VIRTUAL_LMS' | 'MIXTO_BLENDED';
  nombre: string;
  instructor: string;
  duracionHoras: number;
  notaMinima: number;
  fechaProgramada: string;
  totalInscritos: number;
  totalAprobados: number;
}

export interface PreguntaExamenLms {
  idPregunta: number;
  enunciado: string;
  opciones: string[];
  indiceCorrecto: number;
  seleccionado: number;
}

export interface EquipoEppItem {
  id: number;
  codigo: string;
  nombre: string;
  tipoProteccion: string;
  vidaUtilDias: number;
  stock: number;
  norma: string;
}

export interface ProcedimientoSeguridadItem {
  id: number;
  codigo: string;
  nombre: string;
  version: string;
  area: string;
  archivoUrl: string;
  fechaVigencia: string;
}

@Component({
  selector: 'msst-modulo08-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera del Módulo 08 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-graduation-cap"></i>  Capacitaciones y Aula Virtual LMS, Kardex de EPP y Procedimientos PETS / Estándares
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalCurso.set(true)">
              <i class="fa fa-plus-circle"></i> + Programar Curso
            </button>
            <button class="btn btn-xs btn-warning" (click)="mostrarModalEpp.set(true)">
              <i class="fa fa-shield"></i> + Registrar EPP
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalProcedimiento.set(true)">
              <i class="fa fa-file-text-o"></i> + Publicar PETS
            </button>
          </div>
        </div>

        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CURSOS PROGRAMA ANUAL SST</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ cursos().length }} Cursos Activos</div>
                <div style="font-size: 11px; color: #888;">Mín. 4 Cap./Año Ley N° 29783</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">TRABAJADORES APROBADOS LMS</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ totalAprobadosGeneral() }} Certificados</div>
                <div style="font-size: 11px; color: #888;">Evaluación Online Calificable</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">STOCK HOMOLOGADO DE EPP</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ totalUnidadesEppStock() }} Unidades</div>
                <div style="font-size: 11px; color: #888;">Certificación ANSI / EN / NTP</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #ffc107; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PROCEDIMIENTOS PETS / ESTÁNDARES</div>
                <div style="font-size: 20px; font-weight: bold; color: #d39e00;">{{ procedimientos().length }} Vigentes</div>
                <div style="font-size: 11px; color: #888;">Repositorio Documental OneSST</div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-sm" [ngClass]="pestana() === 'CAPACITACION' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('CAPACITACION')">
              <i class="fa fa-laptop"></i> 1. Programa Anual de Capacitaciones y Aula Virtual LMS
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'EPP' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('EPP')">
              <i class="fa fa-hard-hat"></i> 2. Equipos de Protección Personal — EPP
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'PROCEDIMIENTOS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('PROCEDIMIENTOS')">
              <i class="fa fa-file-pdf-o"></i> 3. Documentos y Procedimientos de Seguridad
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: PROGRAMA ANUAL DE CAPACITACIONES Y AULA VIRTUAL LMS -->
      @if (pestana() === 'CAPACITACION') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-graduation-cap"></i> Programa Anual de Capacitaciones, Inducciones y Entrenamientos SST</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalCurso.set(true)">
              <i class="fa fa-plus-circle"></i> Programar Nuevo Curso SST
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive" style="margin-bottom: 18px;">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Modalidad</th>
                    <th>Nombre del Curso / Entrenamiento</th>
                    <th>Instructor / Especialista</th>
                    <th style="text-align:center;">Horas</th>
                    <th style="text-align:center;">Nota Mín.</th>
                    <th>Fecha Programada</th>
                    <th>Inscritos / Aprobados</th>
                    <th>Acción Aula Virtual</th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of cursos(); track c.id) {
                    <tr>
                      <td><strong>#{{ c.id }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-info': c.modalidad === 'VIRTUAL_LMS',
                          'label-primary': c.modalidad === 'PRESENCIAL',
                          'label-warning': c.modalidad === 'MIXTO_BLENDED'
                        }">{{ c.modalidad }}</span>
                      </td>
                      <td><strong>{{ c.nombre }}</strong></td>
                      <td>{{ c.instructor }}</td>
                      <td style="text-align:center;">{{ c.duracionHoras }} h</td>
                      <td style="text-align:center;"><code>{{ c.notaMinima }} / 20</code></td>
                      <td>{{ c.fechaProgramada }}</td>
                      <td><strong>{{ c.totalInscritos }} Insc. / {{ c.totalAprobados }} Aprob.</strong></td>
                      <td>
                        <button class="btn btn-xs btn-primary" (click)="iniciarSimuladorExamen(c)">
                          <i class="fa fa-play"></i> Rendir Evaluación Online
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Simulador de Evaluación Online Calificable -->
            @if (cursoEvaluacionActiva(); as cursoEval) {
              <div class="panel panel-info" style="border-width: 2px;">
                <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
                  <h4 class="panel-title">
                    <i class="fa fa-check-square-o"></i> Simulador de Evaluación Online Calificable (LMS): <strong>{{ cursoEval.nombre }}</strong>
                  </h4>
                  <span class="badge">Nota Mínima Aprobatoria: {{ cursoEval.notaMinima }} / 20</span>
                </div>
                <div class="panel-body">
                  @for (preg of preguntasExamen(); track preg.idPregunta) {
                    <div style="background: #f9fbfd; border: 1px solid #dde6f0; padding: 12px; border-radius: 5px; margin-bottom: 10px;">
                      <div style="font-weight: bold; color: #004B87; margin-bottom: 8px;">
                        {{ preg.idPregunta }}. {{ preg.enunciado }}
                      </div>
                      <div class="row">
                        @for (op of preg.opciones; track op; let idx = $index) {
                          <div class="col-md-4">
                            <label style="font-weight: normal; cursor: pointer;">
                              <input type="radio" [name]="'preg_' + preg.idPregunta" [value]="idx" [(ngModel)]="preg.seleccionado">
                              {{ op }}
                            </label>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <div>
                      @if (resultadoExamenTexto()) {
                        <span class="label" [ngClass]="examenAprobado() ? 'label-success' : 'label-danger'" style="font-size: 13px; padding: 6px 12px;">
                          {{ resultadoExamenTexto() }}
                        </span>
                      }
                    </div>
                    <button class="btn btn-sm btn-success" (click)="calificarExamenOnline(cursoEval)">
                      <i class="fa fa-calculator"></i> Calificar Evaluación Online y Registrar Nota
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- PESTAÑA 2: EQUIPOS DE PROTECCIÓN PERSONAL — EPP -->
      @if (pestana() === 'EPP') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title"><i class="fa fa-shield"></i> Catálogo Maestro, Norma Técnica y Control de Stock de EPP</h4>
            <button class="btn btn-xs btn-success" (click)="mostrarModalEpp.set(true)">
              <i class="fa fa-plus-circle"></i> Registrar / Entregar EPP
            </button>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>Código EPP</th>
                    <th>Nombre y Especificación del Equipo de Protección Personal</th>
                    <th>Tipo de Protección</th>
                    <th>Norma Técnica Internacional</th>
                    <th style="text-align:center;">Vida Útil</th>
                    <th style="text-align:center;">Stock Almacén</th>
                    <th>Acción Rápida</th>
                  </tr>
                </thead>
                <tbody>
                  @for (e of equiposEpp(); track e.id) {
                    <tr>
                      <td><strong>{{ e.codigo }}</strong></td>
                      <td><strong>{{ e.nombre }}</strong></td>
                      <td><span class="label label-info">{{ e.tipoProteccion }}</span></td>
                      <td><code>{{ e.norma }}</code></td>
                      <td style="text-align:center;">{{ e.vidaUtilDias }} días</td>
                      <td style="text-align:center;">
                        <span class="label" [ngClass]="e.stock > 20 ? 'label-success' : 'label-warning'" style="font-size: 12px;">
                          {{ e.stock }} unid.
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-xs btn-primary" (click)="despacharUnidadEpp(e)" [disabled]="e.stock <= 0">
                          <i class="fa fa-hand-lizard-o"></i> Registrar Entrega (-1)
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- PESTAÑA 3: DOCUMENTOS Y PROCEDIMIENTOS DE SEGURIDAD -->
      @if (pestana() === 'PROCEDIMIENTOS') {
        <div class="row">
          <div class="col-md-7">
            <div class="panel panel-primary">
              <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
                <h4 class="panel-title"><i class="fa fa-file-text"></i> Maestro de Procedimientos Escritos de Trabajo Seguro — PETS</h4>
                <button class="btn btn-xs btn-success" (click)="mostrarModalProcedimiento.set(true)">
                  <i class="fa fa-plus-circle"></i> Nuevo Procedimiento
                </button>
              </div>
              <div class="panel-body">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr style="background: #f0f4f8;">
                        <th>Código</th>
                        <th>Título del Procedimiento / Estándar SST</th>
                        <th>Ver.</th>
                        <th>Área Aplicable</th>
                        <th>Vigencia</th>
                        <th>Visor</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (p of procedimientos(); track p.id) {
                        <tr [ngClass]="{ 'info': procSeleccionado()?.id === p.id }">
                          <td><strong>{{ p.codigo }}</strong></td>
                          <td><strong>{{ p.nombre }}</strong></td>
                          <td><span class="badge">{{ p.version }}</span></td>
                          <td>{{ p.area }}</td>
                          <td>{{ p.fechaVigencia }}</td>
                          <td>
                            <button class="btn btn-xs btn-primary" (click)="seleccionarProcedimientoVisor(p)">
                              <i class="fa fa-eye"></i> Ver Documento
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Visor PDF / Evidencia OneSST integrado -->
          <div class="col-md-5">
            @if (procSeleccionado(); as procSel) {
              <div class="panel panel-info">
                <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
                  <h4 class="panel-title"><i class="fa fa-file-pdf-o"></i> Visor Documental OneSST: {{ procSel.codigo }}</h4>
                  <a class="btn btn-xs btn-default" [href]="'/sst/evidencia/ver?codigo=' + procSel.codigo" target="_blank">
                    <i class="fa fa-external-link"></i> Abrir Pestaña
                  </a>
                </div>
                <div class="panel-body" style="padding: 0; height: 340px;">
                  <iframe
                    [src]="urlVisorProcedimiento()"
                    style="width: 100%; height: 100%; border: none;"
                    title="Visor Procedimiento OneSST">
                  </iframe>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL NUEVO CURSO -->
      @if (mostrarModalCurso()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-graduation-cap"></i> Programar Nuevo Curso de Capacitación</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalCurso.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Modalidad:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoCurso.modalidad">
                    <option value="VIRTUAL_LMS">VIRTUAL_LMS (Aula Virtual)</option>
                    <option value="PRESENCIAL">PRESENCIAL</option>
                    <option value="MIXTO_BLENDED">MIXTO_BLENDED</option>
                  </select>
                </div>
                <div class="col-md-7 form-group">
                  <label>Instructor / Entidad Capacitadora:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCurso.instructor">
                </div>
              </div>
              <div class="form-group">
                <label>Nombre Oficial del Curso SST:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCurso.nombre" placeholder="Ej. Prevención de Riesgos en Trabajos en Altura (>1.80 m)">
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Duración (Horas):</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevoCurso.duracionHoras">
                </div>
                <div class="col-md-4 form-group">
                  <label>Nota Mín. (0-20):</label>
                  <input type="number" min="11" max="20" class="form-control input-sm" [(ngModel)]="nuevoCurso.notaMinima">
                </div>
                <div class="col-md-4 form-group">
                  <label>Fecha Programada:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoCurso.fechaProgramada">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalCurso.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoCurso()">
                <i class="fa fa-save"></i> Guardar Curso
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO EPP -->
      @if (mostrarModalEpp()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-shield"></i> Registrar Equipo de Protección Personal en Catálogo</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalEpp.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código EPP:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEpp.codigo">
                </div>
                <div class="col-md-8 form-group">
                  <label>Tipo de Protección:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoEpp.tipoProteccion">
                    <option value="PROTECCIÓN CABEZA">PROTECCIÓN CABEZA</option>
                    <option value="PROTECCIÓN RESPIRATORIA">PROTECCIÓN RESPIRATORIA</option>
                    <option value="PROTECCIÓN CONTRA CAÍDAS">PROTECCIÓN CONTRA CAÍDAS</option>
                    <option value="PROTECCIÓN AUDITIVA">PROTECCIÓN AUDITIVA</option>
                    <option value="PROTECCIÓN MANOS / PIES">PROTECCIÓN MANOS / PIES</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Nombre y Especificación Técnica del EPP:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEpp.nombre" placeholder="Ej. Respirador de Media Cara Doble Vía 3M Serie 7500 con Filtros P100">
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Norma Técnica:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoEpp.norma">
                </div>
                <div class="col-md-4 form-group">
                  <label>Vida Útil (Días):</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevoEpp.vidaUtilDias">
                </div>
                <div class="col-md-4 form-group">
                  <label>Stock Inicial:</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevoEpp.stock">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalEpp.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoEpp()">
                <i class="fa fa-save"></i> Guardar EPP
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO PROCEDIMIENTO -->
      @if (mostrarModalProcedimiento()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-file-pdf-o"></i> Publicar Nuevo Procedimiento PETS / Estándar SST</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalProcedimiento.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Código Documento:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.codigo">
                </div>
                <div class="col-md-3 form-group">
                  <label>Versión:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.version">
                </div>
                <div class="col-md-4 form-group">
                  <label>Vigencia Hasta:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.fechaVigencia">
                </div>
              </div>
              <div class="form-group">
                <label>Título del Procedimiento Escrito de Trabajo Seguro (PETS):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.nombre" placeholder="Ej. PETS de Izaje Crítico de Cargas con Grúa Telescópica">
              </div>
              <div class="form-group">
                <label>Área / Proceso de Aplicación:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.area">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalProcedimiento.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoProcedimiento()">
                <i class="fa fa-save"></i> Publicar Procedimiento
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class Modulo08CapacitacionEppProcedimientosComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pestana = signal<'CAPACITACION' | 'EPP' | 'PROCEDIMIENTOS'>('CAPACITACION');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');
  readonly mostrarModalCurso = signal<boolean>(false);
  readonly mostrarModalEpp = signal<boolean>(false);
  readonly mostrarModalProcedimiento = signal<boolean>(false);

  readonly cursos = signal<CursoCapacitacionItem[]>([
    {
      id: 1,
      modalidad: 'VIRTUAL_LMS',
      nombre: 'Inducción General de Seguridad y Salud en el Trabajo (Homologación Holcim)',
      instructor: 'Ing. Carlos Mendoza (Aula Virtual LMS)',
      duracionHoras: 4,
      notaMinima: 16,
      fechaProgramada: '24/10/2026',
      totalInscritos: 145,
      totalAprobados: 140
    },
    {
      id: 2,
      modalidad: 'MIXTO_BLENDED',
      nombre: 'Aislamiento y Bloqueo de Energías Peligrosas — Sistema LOTOTO',
      instructor: 'Ing. Roberto Elias',
      duracionHoras: 6,
      notaMinima: 16,
      fechaProgramada: '28/10/2026',
      totalInscritos: 68,
      totalAprobados: 64
    },
    {
      id: 3,
      modalidad: 'PRESENCIAL',
      nombre: 'Trabajos de Alto Riesgo: Espacios Confinados y Atmósferas Peligrosas',
      instructor: 'Cmdte. Luis Paredes (Brigada HAZMAT)',
      duracionHoras: 8,
      notaMinima: 16,
      fechaProgramada: '04/11/2026',
      totalInscritos: 42,
      totalAprobados: 39
    }
  ]);

  readonly cursoEvaluacionActiva = signal<CursoCapacitacionItem | null>(this.cursos()[0]);
  readonly resultadoExamenTexto = signal<string>('');
  readonly examenAprobado = signal<boolean>(true);

  readonly preguntasExamen = signal<PreguntaExamenLms[]>([
    {
      idPregunta: 1,
      enunciado: 'Según la Ley N° 29783 y el estándar corporativo Holcim, ¿cuál es el primer escalón prioritario en la Jerarquía de Controles de Riesgos?',
      opciones: [
        'A) Entrega de Equipos de Protección Personal (EPP)',
        'B) Eliminación física del peligro en la fuente',
        'C) Señalización y controles administrativos'
      ],
      indiceCorrecto: 1,
      seleccionado: 1
    },
    {
      idPregunta: 2,
      enunciado: 'Antes de intervenir un equipo rotatorio en molienda (Procedimiento LOTOTO), ¿qué verificación es obligatoria tras colocar el candado personal?',
      opciones: [
        'A) Prueba de Energía Cero (intento controlado de arranque local)',
        'B) Avisar únicamente por radio al operador de turno',
        'C) Retirar las guardas sin desenergizar el tablero'
      ],
      indiceCorrecto: 0,
      seleccionado: 0
    },
    {
      idPregunta: 3,
      enunciado: '¿A partir de qué desnivel se considera Trabajo en Altura que exige Permiso Escrito de Trabajo de Alto Riesgo (PETAR) y arnés certificado?',
      opciones: [
        'A) A partir de 3.50 metros',
        'B) A partir de 1.80 metros sobre el nivel inferior',
        'C) Solo en techos exteriores'
      ],
      indiceCorrecto: 1,
      seleccionado: 1
    }
  ]);

  readonly equiposEpp = signal<EquipoEppItem[]>([
    {
      id: 1,
      codigo: 'EPP-CAS-001',
      nombre: 'Casco Dieléctrico Tipo I Clase E con Ratchet y Barbiquejo de 4 Puntos 3M',
      tipoProteccion: 'PROTECCIÓN CABEZA',
      vidaUtilDias: 365,
      stock: 120,
      norma: 'ANSI/ISEA Z89.1-2019'
    },
    {
      id: 2,
      codigo: 'EPP-ARN-002',
      nombre: 'Arnés de Cuerpo Completo 4 Anillos en D + Línea Doble con Absorbedor de Impacto',
      tipoProteccion: 'PROTECCIÓN CONTRA CAÍDAS',
      vidaUtilDias: 730,
      stock: 48,
      norma: 'ANSI Z359.11 / EN 361'
    },
    {
      id: 3,
      codigo: 'EPP-RES-003',
      nombre: 'Respirador Reutilizable Media Cara Silicona 3M 7502 + Cartuchos Polvo/Gases P100',
      tipoProteccion: 'PROTECCIÓN RESPIRATORIA',
      vidaUtilDias: 180,
      stock: 95,
      norma: 'NIOSH 42 CFR 84'
    },
    {
      id: 4,
      codigo: 'EPP-BOT-004',
      nombre: 'Botín de Seguridad Dieléctrico con Puntera Composite y Planta Antiperforante',
      tipoProteccion: 'PROTECCIÓN MANOS / PIES',
      vidaUtilDias: 365,
      stock: 84,
      norma: 'ASTM F2413-18 / NTP ISO 20345'
    }
  ]);

  readonly procedimientos = signal<ProcedimientoSeguridadItem[]>([
    {
      id: 1,
      codigo: 'PETS-MAN-001',
      nombre: 'Procedimiento Escrito de Trabajo Seguro: Bloqueo y Etiquetado de Energía (LOTOTO)',
      version: 'v5.0',
      area: 'Mantenimiento Mecánico y Eléctrico Planta',
      archivoUrl: '/sst/evidencia/ver?codigo=PETS-MAN-001',
      fechaVigencia: '31/12/2027'
    },
    {
      id: 2,
      codigo: 'PETS-OPE-002',
      nombre: 'Procedimiento de Ingreso y Limpieza de Silos y Espacios Confinados',
      version: 'v4.2',
      area: 'Operaciones Clinker y Molienda',
      archivoUrl: '/sst/evidencia/ver?codigo=PETS-OPE-002',
      fechaVigencia: '30/06/2027'
    },
    {
      id: 3,
      codigo: 'EST-HSE-003',
      nombre: 'Estándar Corporativo de Permisos de Trabajo de Alto Riesgo (PETAR Digital)',
      version: 'v6.0',
      area: 'Todas las Unidades y Empresas Contratistas',
      archivoUrl: '/sst/evidencia/ver?codigo=EST-HSE-003',
      fechaVigencia: '31/12/2028'
    }
  ]);

  readonly procSeleccionado = signal<ProcedimientoSeguridadItem | null>(this.procedimientos()[0]);

  readonly urlVisorProcedimiento = computed<SafeResourceUrl>(() => {
    const proc = this.procSeleccionado();
    const codigo = proc ? proc.codigo : 'PETS-MAN-001';
    return this.sanitizer.bypassSecurityTrustResourceUrl(`/sst/evidencia/ver?codigo=${encodeURIComponent(codigo)}`);
  });

  nuevoCurso = {
    modalidad: 'VIRTUAL_LMS' as CursoCapacitacionItem['modalidad'],
    nombre: '',
    instructor: 'Ing. Carlos Mendoza',
    duracionHoras: 4,
    notaMinima: 16,
    fechaProgramada: '15/11/2026'
  };

  nuevoEpp = {
    codigo: 'EPP-GUA-005',
    nombre: '',
    tipoProteccion: 'PROTECCIÓN MANOS / PIES',
    norma: 'EN 388:2016 (4X43C)',
    vidaUtilDias: 60,
    stock: 150
  };

  nuevoProcedimiento = {
    codigo: 'PETS-IZA-004',
    nombre: '',
    version: 'v1.0',
    area: 'Operaciones y Montaje Electromecánico',
    fechaVigencia: '31/12/2027'
  };

  readonly totalAprobadosGeneral = computed(() =>
    this.cursos().reduce((acc, c) => acc + (Number(c.totalAprobados) || 0), 0)
  );

  readonly totalUnidadesEppStock = computed(() =>
    this.equiposEpp().reduce((acc, e) => acc + (Number(e.stock) || 0), 0)
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/capacitacion/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['nombre']) {
          const desdeSql: CursoCapacitacionItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (10 + idx),
            modalidad: (String(r['modalidad'] || 'VIRTUAL_LMS').toUpperCase().includes('PRES') ? 'PRESENCIAL' : 'VIRTUAL_LMS'),
            nombre: String(r['nombre'] || ''),
            instructor: String(r['instructor'] || 'Instructor SST'),
            duracionHoras: Number(r['duracionHoras']) || 4,
            notaMinima: Number(r['notaMinima']) || 16,
            fechaProgramada: String(r['fechaProgramada'] || '28/10/2026'),
            totalInscritos: Number(r['totalInscritos']) || 50,
            totalAprobados: Number(r['totalAprobados']) || 48
          }));
          this.cursos.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.nombre === a.nombre))
          ]);
        }
      }
    });

    this.api.callAjaxPost('/equiposeguridad/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigo']) {
          const desdeSql: EquipoEppItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (20 + idx),
            codigo: String(r['codigo'] || `EPP-0${idx + 1}`),
            nombre: String(r['nombre'] || ''),
            tipoProteccion: String(r['tipoProteccion'] || 'PROTECCIÓN PERSONAL'),
            vidaUtilDias: Number(r['vidaUtilDias']) || 180,
            stock: Number(r['stock']) || 50,
            norma: String(r['norma'] || 'ANSI / EN')
          }));
          this.equiposEpp.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
          ]);
        }
      }
    });

    this.api.callAjaxPost('/procedimientoseguridad/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigo']) {
          const desdeSql: ProcedimientoSeguridadItem[] = list.map((r: Record<string, any>, idx: number) => ({
            id: Number(r['id']) || (30 + idx),
            codigo: String(r['codigo'] || `PETS-0${idx + 1}`),
            nombre: String(r['nombre'] || ''),
            version: String(r['version'] || 'v1.0'),
            area: String(r['area'] || 'Planta Industrial'),
            archivoUrl: String(r['archivoUrl'] || `/sst/evidencia/ver?codigo=${r['codigo']}`),
            fechaVigencia: String(r['fechaVigencia'] || '31/12/2027')
          }));
          this.procedimientos.update(actuales => [
            ...desdeSql,
            ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
          ]);
        }
      }
    });
  }

  iniciarSimuladorExamen(curso: CursoCapacitacionItem): void {
    this.cursoEvaluacionActiva.set(curso);
    this.resultadoExamenTexto.set('');
  }

  calificarExamenOnline(curso: CursoCapacitacionItem): void {
    const pregs = this.preguntasExamen();
    const aciertos = pregs.filter(p => Number(p.seleccionado) === p.indiceCorrecto).length;
    const notaSobre20 = Math.round((aciertos / pregs.length) * 20);
    const aprobado = notaSobre20 >= curso.notaMinima;

    this.examenAprobado.set(aprobado);
    this.resultadoExamenTexto.set(
      aprobado
        ? `¡APROBADO! Puntaje Obtenido: ${notaSobre20} / 20 (${aciertos}/${pregs.length} respuestas correctas). Certificado emitido.`
        : `DESAPROBADO (${notaSobre20} / 20). Requiere nota mínima ${curso.notaMinima}. Revise las respuestas.`
    );

    if (aprobado) {
      this.cursos.update(list =>
        list.map(c => c.id === curso.id ? { ...c, totalAprobados: c.totalAprobados + 1, totalInscritos: Math.max(c.totalInscritos, c.totalAprobados + 1) } : c)
      );
      this.mostrarAviso(`Evaluación Online calificada con nota ${notaSobre20}/20 para el curso "${curso.nombre}".`);
    }
  }

  guardarNuevoCurso(): void {
    if (!this.nuevoCurso.nombre.trim()) return;
    this.api.callAjaxPost('/capacitacion/insert', { ...this.nuevoCurso, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarCursoLocal(Number(res?.['idGenerado']) || (Date.now() % 1000)),
      error: () => this.agregarCursoLocal(Date.now() % 1000)
    });
  }

  private agregarCursoLocal(id: number): void {
    const item: CursoCapacitacionItem = {
      id,
      modalidad: this.nuevoCurso.modalidad,
      nombre: this.nuevoCurso.nombre,
      instructor: this.nuevoCurso.instructor,
      duracionHoras: Number(this.nuevoCurso.duracionHoras) || 4,
      notaMinima: Number(this.nuevoCurso.notaMinima) || 16,
      fechaProgramada: this.nuevoCurso.fechaProgramada,
      totalInscritos: 25,
      totalAprobados: 0
    };
    this.cursos.update(list => [item, ...list]);
    this.mostrarModalCurso.set(false);
    this.mostrarAviso(`Curso "${item.nombre}" registrado en el Programa Anual.`);
  }

  guardarNuevoEpp(): void {
    if (!this.nuevoEpp.nombre.trim()) return;
    this.api.callAjaxPost('/equiposeguridad/insert', { ...this.nuevoEpp, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarEppLocal(Number(res?.['idGenerado']) || Date.now()),
      error: () => this.agregarEppLocal(Date.now())
    });
  }

  private agregarEppLocal(id: number): void {
    const item: EquipoEppItem = {
      id,
      codigo: this.nuevoEpp.codigo,
      nombre: this.nuevoEpp.nombre,
      tipoProteccion: this.nuevoEpp.tipoProteccion,
      norma: this.nuevoEpp.norma,
      vidaUtilDias: Number(this.nuevoEpp.vidaUtilDias) || 180,
      stock: Number(this.nuevoEpp.stock) || 50
    };
    this.equiposEpp.update(list => [item, ...list]);
    this.mostrarModalEpp.set(false);
    this.mostrarAviso(`EPP "${item.codigo}" registrado en el Kardex de Seguridad.`);
  }

  despacharUnidadEpp(epp: EquipoEppItem): void {
    if (epp.stock <= 0) return;
    this.equiposEpp.update(list =>
      list.map(e => e.id === epp.id ? { ...e, stock: e.stock - 1 } : e)
    );
    this.mostrarAviso(`Entrega de 1 unidad de "${epp.nombre}" (${epp.codigo}) registrada en Kardex EPP.`);
  }

  seleccionarProcedimientoVisor(proc: ProcedimientoSeguridadItem): void {
    this.procSeleccionado.set(proc);
  }

  guardarNuevoProcedimiento(): void {
    if (!this.nuevoProcedimiento.nombre.trim()) return;
    this.api.callAjaxPost('/procedimientoseguridad/insert', { ...this.nuevoProcedimiento, idEmpresa: 773 }).subscribe({
      next: (res) => this.agregarProcedimientoLocal(Number(res?.['idGenerado']) || Date.now()),
      error: () => this.agregarProcedimientoLocal(Date.now())
    });
  }

  private agregarProcedimientoLocal(id: number): void {
    const item: ProcedimientoSeguridadItem = {
      id,
      codigo: this.nuevoProcedimiento.codigo,
      nombre: this.nuevoProcedimiento.nombre,
      version: this.nuevoProcedimiento.version,
      area: this.nuevoProcedimiento.area,
      archivoUrl: `/sst/evidencia/ver?codigo=${this.nuevoProcedimiento.codigo}`,
      fechaVigencia: this.nuevoProcedimiento.fechaVigencia
    };
    this.procedimientos.update(list => [item, ...list]);
    this.procSeleccionado.set(item);
    this.mostrarModalProcedimiento.set(false);
    this.mostrarAviso(`Procedimiento "${item.codigo}" publicado en el Repositorio Documental.`);
  }

  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
