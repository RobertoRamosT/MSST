import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { isGuid } from '../../core/services/workflow-api.service';
import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface CursoCapacitacionItem {
  id: number;
  modalidad: 'PRESENCIAL' | 'VIRTUAL_LMS' | 'MIXTO_BLENDED' | null;
  nombre: string | null;
  instructor: string | null;
  duracionHoras: number | null;
  notaMinima: number | null;
  fechaProgramada: string | null;
  totalInscritos: number | null;
  totalAprobados: number | null;
}


export interface EquipoEppItem {
  id: number;
  codigo: string | null;
  nombre: string | null;
  tipoProteccion: string | null;
  vidaUtilDias: number | null;
  stock: number | null;
  norma: string | null;
}

export interface ProcedimientoSeguridadItem {
  id: number;
  codigo: string | null;
  nombre: string | null;
  version:string;
  documentVersion:string|null;
  area: string | null;
  archivoUrl: string | null;
  fechaVigencia: string | null;
}

@Component({
  selector: 'msst-modulo08-recursos',
  standalone: true,
  imports: [QueryPagesComponent,WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

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
                        <button class="btn btn-xs btn-primary" (click)="abrirProcesoCapacitacion(c)">
                          <i class="fa fa-play"></i> Ver proceso de capacitación
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <p>Las evaluaciones y su aprobación se registran en el expediente de capacitación.</p><button class="btn btn-primary" (click)="workflowSelectionOpen.set(true)">Abrir expediente de capacitación</button>
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
                        <span class="label" [ngClass]="(e.stock !== null && e.stock > 20) ? 'label-success' : 'label-warning'" style="font-size: 12px;">
                          {{ e.stock }} unid.
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-xs btn-primary" (click)="despacharUnidadEpp(e)" [disabled]="e.stock === null || e.stock <= 0">
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
                          <td><span class="badge">{{ p.documentVersion }}</span></td>
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
                  @if(urlVisorProcedimiento()){<a class="btn btn-xs btn-default" [href]="urlVisorProcedimiento()" target="_blank" rel="noopener">
                    <i class="fa fa-external-link"></i> Abrir Pestaña
                  </a>}
                </div>
                <div class="panel-body" style="padding: 0; height: 340px;">
                  @if(urlVisorProcedimiento()){<iframe
                    [src]="urlVisorProcedimiento()"
                    style="width: 100%; height: 100%; border: none;"
                    title="Visor Procedimiento OneSST">
                  </iframe>}@else{<p>Este registro no tiene una evidencia persistida verificable. Cargue el documento en su expediente.</p>}
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
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoProcedimiento.documentVersion">
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

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo08CapacitacionEppProcedimientosComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

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

  readonly cursos = signal<CursoCapacitacionItem[]>([]);



  readonly equiposEpp = signal<EquipoEppItem[]>([]);

  readonly procedimientos = signal<ProcedimientoSeguridadItem[]>([]);

  readonly procSeleccionado = signal<ProcedimientoSeguridadItem | null>(null);

  readonly urlVisorProcedimiento = computed<SafeResourceUrl|null>(() => {
    const proc = this.procSeleccionado();
    const value=proc?.archivoUrl;
    const match=typeof value==='string'?/^\/sst\/evidence\/([0-9a-f-]{36})\/content$/i.exec(value):null;
    const id=isGuid(value)?value:match&&isGuid(match[1])?match[1]:null;
    return id?this.sanitizer.bypassSecurityTrustResourceUrl('/sst/evidence/'+id+'/content'):null;
  });

  nuevoCurso = {
    modalidad: '' as CursoCapacitacionItem['modalidad'],
    nombre: '',
    instructor: '',
    duracionHoras: 0,
    notaMinima: 0,
    fechaProgramada: ''
  };

  nuevoEpp = {
    codigo: '',
    nombre: '',
    tipoProteccion: '',
    norma: '',
    vidaUtilDias: 0,
    stock: 0
  };

  nuevoProcedimiento = {
    codigo: '',
    nombre: '',
    documentVersion: '',
    area: '',
    fechaVigencia: ''
  };

  readonly totalAprobadosGeneral = computed(() =>
    this.cursos().reduce((acc, c) => acc + (Number(c.totalAprobados) || 0), 0)
  );

  readonly totalUnidadesEppStock = computed(() =>
    this.equiposEpp().reduce((acc, e) => acc + (Number(e.stock) || 0), 0)
  );

  readonly pageRoutes=['/capacitacion/lista', '/equiposeguridad/lista', '/procedimientoseguridad/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/capacitacion/lista', { ...{} }).subscribe({next:(response)=>{try{this.cursos.set(confirmedList<CursoCapacitacionItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"modalidad","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"instructor","kind":"string","optional":false,"nullable":true},{"name":"duracionHoras","kind":"number","optional":false,"nullable":true},{"name":"notaMinima","kind":"number","optional":false,"nullable":true},{"name":"fechaProgramada","kind":"string","optional":false,"nullable":true},{"name":"totalInscritos","kind":"number","optional":false,"nullable":true},{"name":"totalAprobados","kind":"number","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/equiposeguridad/lista', { ...{} }).subscribe({next:(response)=>{try{this.equiposEpp.set(confirmedList<EquipoEppItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"tipoProteccion","kind":"string","optional":false,"nullable":true},{"name":"vidaUtilDias","kind":"number","optional":false,"nullable":true},{"name":"stock","kind":"number","optional":false,"nullable":true},{"name":"norma","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/procedimientoseguridad/lista', { ...{} }).subscribe({next:(response)=>{try{this.procedimientos.set(confirmedList<ProcedimientoSeguridadItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"documentVersion","kind":"string","optional":false,"nullable":true},{"name":"area","kind":"string","optional":false,"nullable":true},{"name":"archivoUrl","kind":"string","optional":false,"nullable":true},{"name":"fechaVigencia","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  abrirProcesoCapacitacion(_curso:CursoCapacitacionItem):void{this.workflowSelectionOpen.set(true);}


  guardarNuevoCurso(): void {
    if (!this.nuevoCurso.nombre.trim()) return;
    this.api.callAjaxPost('/capacitacion/insert', { ...this.nuevoCurso, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalCurso.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  guardarNuevoEpp(): void {
    if (!this.nuevoEpp.nombre.trim()) return;
    this.api.callAjaxPost('/equiposeguridad/insert', { ...this.nuevoEpp, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalEpp.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  despacharUnidadEpp(_epp:EquipoEppItem):void{this.workflowSelectionOpen.set(true);}

  seleccionarProcedimientoVisor(proc: ProcedimientoSeguridadItem): void {
    this.procSeleccionado.set(proc);
  }

  guardarNuevoProcedimiento(): void {
    if (!this.nuevoProcedimiento.nombre.trim()) return;
    this.api.callAjaxPost('/procedimientoseguridad/insert', { ...this.nuevoProcedimiento, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalProcedimiento.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  private mostrarAviso(msg: string): void {
    this.notificacion.set(msg);
    setTimeout(() => this.notificacion.set(''), 4500);
  }
}
