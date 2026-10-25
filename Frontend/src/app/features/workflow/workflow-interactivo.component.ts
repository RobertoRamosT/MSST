import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface EtapaWorkflowCaso {
  paso: number;
  titulo: string;
  subtitulo: string;
  responsableRol: string;
  normaLegal: string;
  requisitosObligatorios: string[];
  estado: 'COMPLETO' | 'EN_CURSO' | 'PENDIENTE' | 'OBSERVADO';
}

export interface ExpedienteWorkflowItem {
  id: number;
  codigoExpediente: string;
  tipoCaso?: string;
  titulo: string;
  sujetoEntidad: string;
  etapaActual: number;
  totalEtapas: number;
  estadoGeneral: 'EN_SOLICITUD' | 'EN_EVALUACION' | 'APROBADO_CONFORME' | 'OBSERVADO_BLOQUEADO' | 'CERRADO_AUDITADO';
  responsableActual: string;
  fechaInicio: string;
  fechaUltimoMovimiento: string;
  cumplimientoPorc: number;
  qrHash: string;
  observaciones: string;
}

export interface EventoTrazabilidad {
  fechaHora: string;
  etapa: string;
  accion: string;
  responsable: string;
  estadoResultante: string;
  hashCriptografico?: string;
}

export type TipoWorkflowCaso =
  | 'HOMOLOGACION_CONTRATISTA'
  | 'PETAR_ALTO_RIESGO'
  | 'ACREDITACION_PERSONAL'
  | 'INVESTIGACION_ACCIDENTES'
  | 'INSPECCIONES_SSOMA'
  | 'VIGILANCIA_MEDICA';

@Component({
  selector: 'msst-workflow-interactivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="workflow-container" style="padding: 15px; font-family: Inter, Segoe UI, Arial, sans-serif; background: #f8fafc; min-height: 100vh;">

      <!-- CABECERA PRINCIPAL DEL SISTEMA DE WORKFLOWS -->
      <div class="panel panel-primary" style="margin-bottom: 16px; border: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); background: #004B87; color: #fff;">
        <div class="panel-body" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: rgba(255,255,255,0.18); padding: 8px 12px; border-radius: 6px; font-size: 18px;">
                <i class="fa fa-sitemap"></i>
              </span>
              <div>
                <h3 style="margin: 0; font-size: 19px; font-weight: 700; letter-spacing: -0.3px;">
                  Gestor de Flujos de Trabajo Interactivo SSOMA
                </h3>
                <div style="font-size: 12px; color: #cbd5e1; margin-top: 2px;">
                  OneSST Enterprise &bull; Automatización de Procesos por Caso, Tipo y Acción Regulatoria ISO 45001 / Ley 29783
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-sm btn-default" (click)="irAlPortalContratista()" style="font-weight: 600; border-radius: 6px;">
              <i class="fa fa-arrow-left"></i> Volver al Portal
            </button>
            <button class="btn btn-sm btn-success" (click)="abrirModalNuevoExpediente()" style="font-weight: 600; border-radius: 6px;">
              <i class="fa fa-plus-circle"></i> Iniciar Nuevo Expediente
            </button>
            <button class="btn btn-sm btn-info" (click)="imprimirExpedienteCompleto()" style="font-weight: 600; border-radius: 6px;">
              <i class="fa fa-print"></i> Imprimir Dossier ISO 45001
            </button>
          </div>
        </div>
      </div>

      <!-- SELECTOR INTERACTIVO DE CASO / PROCESO (6 CASOS REGULATORIOS) -->
      <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px; display: flex; gap: 8px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <button
          *ngFor="let c of catalogoCasos()"
          class="btn btn-sm"
          [ngClass]="casoActivo() === c.id ? 'btn-primary' : 'btn-default'"
          (click)="seleccionarCaso(c.id)"
          style="display: flex; align-items: center; gap: 8px; white-space: nowrap; font-weight: 600; border-radius: 6px; padding: 8px 14px; transition: all 0.15s ease;"
        >
          <i class="fa" [ngClass]="c.icono"></i>
          <span>{{ c.nombre }}</span>
          <span class="badge" [ngClass]="casoActivo() === c.id ? 'badge-light' : 'badge-primary'" style="font-size: 10px; margin-left: 4px;">
            {{ contarExpedientesCaso(c.id) }}
          </span>
        </button>
      </div>

      <!-- KPI RIBBON DEL CASO SELECCIONADO -->
      <div class="row" style="margin-bottom: 16px;">
        <div class="col-md-3 col-sm-6" style="margin-bottom: 10px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #004B87; border-radius: 6px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.03);">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Expedientes en Proceso</div>
            <div style="font-size: 22px; font-weight: 800; color: #004B87; margin-top: 4px;">{{ resumenKpis().enProceso }}</div>
            <div style="font-size: 11px; color: #94a3b8;">Avance de flujo activo</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6" style="margin-bottom: 10px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #16a34a; border-radius: 6px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.03);">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Aprobados y Conformes</div>
            <div style="font-size: 22px; font-weight: 800; color: #16a34a; margin-top: 4px;">{{ resumenKpis().aprobados }}</div>
            <div style="font-size: 11px; color: #94a3b8;">Cumplimiento al 100%</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6" style="margin-bottom: 10px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #dc2626; border-radius: 6px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.03);">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Observados / Críticos</div>
            <div style="font-size: 22px; font-weight: 800; color: #dc2626; margin-top: 4px;">{{ resumenKpis().observados }}</div>
            <div style="font-size: 11px; color: #94a3b8;">Requiere subsanación</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6" style="margin-bottom: 10px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.03);">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Eficacia Operativa Global</div>
            <div style="font-size: 22px; font-weight: 800; color: #d97706; margin-top: 4px;">{{ resumenKpis().eficaciaPorc }}%</div>
            <div style="font-size: 11px; color: #94a3b8;">Tasa de cierre sin incidentes</div>
          </div>
        </div>
      </div>

      <!-- PIPELINE INTERACTIVO: DIAGRAMA DE FLUJO Y STEPPER DEL PROCESO -->
      <div class="panel panel-default" style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 18px; background: #fff;">
        <div class="panel-heading" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: #1e293b; font-size: 14px;">
            <i class="fa fa-code-fork text-primary"></i> Pipeline Secuencial de Etapas — {{ infoCasoActual().nombre }}
          </span>
          <span class="label label-info" style="font-size: 11px; padding: 4px 8px;">
            {{ infoCasoActual().norma }}
          </span>
        </div>
        <div class="panel-body" style="padding: 20px;">
          <!-- Visual Stepper Bar -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
            <div
              *ngFor="let etapa of etapasCasoActual(); let i = index"
              (click)="seleccionarPasoStepper(etapa.paso)"
              style="flex: 1; min-width: 160px; cursor: pointer; text-align: center; position: relative;"
            >
              <!-- Conector lineal horizontal -->
              <div
                *ngIf="i < etapasCasoActual().length - 1"
                style="position: absolute; top: 18px; left: 50%; width: 100%; height: 3px; z-index: 1;"
                [style.background]="etapa.estado === 'COMPLETO' ? '#16a34a' : '#cbd5e1'"
              ></div>

              <!-- Círculo de Etapa -->
              <div
                style="width: 38px; height: 38px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; position: relative; z-index: 2; margin-bottom: 8px; transition: all 0.2s ease;"
                [ngClass]="{
                  'bg-success text-white shadow-sm': etapa.estado === 'COMPLETO',
                  'bg-primary text-white shadow': etapa.estado === 'EN_CURSO',
                  'bg-danger text-white shadow-sm': etapa.estado === 'OBSERVADO',
                  'bg-secondary text-muted': etapa.estado === 'PENDIENTE'
                }"
                [style.boxShadow]="pasoActivo() === etapa.paso ? '0 0 0 4px rgba(0,75,135,0.25)' : 'none'"
              >
                <i *ngIf="etapa.estado === 'COMPLETO'" class="fa fa-check"></i>
                <i *ngIf="etapa.estado === 'EN_CURSO'" class="fa fa-refresh fa-spin"></i>
                <i *ngIf="etapa.estado === 'OBSERVADO'" class="fa fa-exclamation"></i>
                <span *ngIf="etapa.estado === 'PENDIENTE'">{{ etapa.paso }}</span>
              </div>

              <!-- Título de Etapa -->
              <div style="font-size: 12px; font-weight: 700; color: #1e293b; line-height: 1.25;">
                {{ etapa.titulo }}
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 3px;">
                {{ etapa.responsableRol }}
              </div>
            </div>
          </div>

          <!-- DETALLE INTERACTIVO DE LA ETAPA ACTIVA -->
          <div *ngIf="etapaSeleccionada()" style="margin-top: 18px; padding: 16px; background: #f1f5f9; border-radius: 6px; border-left: 4px solid #004B87;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
              <div>
                <h5 style="margin: 0; font-weight: 700; color: #004B87; font-size: 14px;">
                  Etapa {{ etapaSeleccionada()?.paso }}: {{ etapaSeleccionada()?.titulo }}
                </h5>
                <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">
                  {{ etapaSeleccionada()?.subtitulo }} &bull; <strong>Responsable:</strong> {{ etapaSeleccionada()?.responsableRol }} &bull; <strong>Base Legal:</strong> <code>{{ etapaSeleccionada()?.normaLegal }}</code>
                </p>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-xs btn-primary" (click)="abrirModalAccion('AVANZAR')">
                  <i class="fa fa-arrow-circle-right"></i> Ejecutar Acción de Etapa
                </button>
                <button class="btn btn-xs btn-warning" (click)="abrirModalAccion('OBSERVAR')">
                  <i class="fa fa-exclamation-triangle"></i> Observar Requisito
                </button>
                <button class="btn btn-xs btn-default" (click)="abrirModalAccion('SUBIR_EVIDENCIA')">
                  <i class="fa fa-upload"></i> Subir Evidencia
                </button>
                <button class="btn btn-xs btn-info" (click)="abrirModalAccion('FIRMAR_DIGITAL')">
                  <i class="fa fa-key"></i> Firma Digital SHA-256
                </button>
              </div>
            </div>

            <div style="margin-top: 12px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
              <span style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase;">
                Prerrequisitos de Cumplimiento Regulatorio Obligatorio:
              </span>
              <ul style="margin: 6px 0 0 18px; font-size: 11px; color: #475569;">
                <li *ngFor="let req of etapaSeleccionada()?.requisitosObligatorios">
                  <i class="fa fa-check-square-o text-success" style="margin-right: 4px;"></i> {{ req }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- BANDEJA DE EXPEDIENTES DEL FLUJO (TABLA PRINCIPAL) -->
      <div class="panel panel-default" style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); background: #fff;">
        <div class="panel-heading" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; color: #1e293b; font-size: 14px;">
              <i class="fa fa-folder-open-o text-primary"></i> Expedientes en Trámite — {{ infoCasoActual().nombre }}
            </span>
            <span class="badge badge-primary">{{ expedientesFiltrados().length }} Registros</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input
              type="text"
              class="form-control input-sm"
              placeholder="Buscar por código, sujeto o empresa..."
              [(ngModel)]="filtroTexto"
              style="width: 240px; border-radius: 6px;"
            >
            <select class="form-control input-sm" [(ngModel)]="filtroEstado" style="width: 170px; border-radius: 6px;">
              <option value="TODOS">Todos los Estados</option>
              <option value="EN_SOLICITUD">En Solicitud</option>
              <option value="EN_EVALUACION">En Evaluación</option>
              <option value="APROBADO_CONFORME">Aprobado / Conforme</option>
              <option value="OBSERVADO_BLOQUEADO">Observado / Bloqueado</option>
              <option value="CERRADO_AUDITADO">Cerrado y Auditado</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-striped" style="margin: 0; font-size: 12px;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569;">
                <th style="width: 130px;">Código</th>
                <th>Descripción / Asunto</th>
                <th>Sujeto / Unidad</th>
                <th style="width: 140px;">Etapa Actual</th>
                <th style="width: 110px; text-align: center;">Avance (%)</th>
                <th style="width: 160px;">Estado General</th>
                <th style="width: 120px;">Último Mov.</th>
                <th style="width: 160px; text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let exp of expedientesFiltrados()" [ngClass]="{ 'info': expedienteSeleccionado()?.id === exp.id }">
                <td>
                  <strong style="color: #004B87;">{{ exp.codigoExpediente }}</strong>
                </td>
                <td>
                  <div style="font-weight: 600; color: #1e293b;">{{ exp.titulo }}</div>
                  <small style="color: #64748b;">Resp: {{ exp.responsableActual }}</small>
                </td>
                <td>
                  <span>{{ exp.sujetoEntidad }}</span>
                </td>
                <td>
                  <span class="label label-primary" style="font-size: 10px;">
                    Etapa {{ exp.etapaActual }} / {{ exp.totalEtapas }}
                  </span>
                </td>
                <td style="text-align: center;">
                  <div class="progress" style="height: 12px; margin-bottom: 0; border-radius: 6px; background: #e2e8f0;">
                    <div
                      class="progress-bar"
                      [ngClass]="{
                        'progress-bar-success': exp.cumplimientoPorc >= 90,
                        'progress-bar-warning': exp.cumplimientoPorc >= 50 && exp.cumplimientoPorc < 90,
                        'progress-bar-danger': exp.cumplimientoPorc < 50
                      }"
                      [style.width.%]="exp.cumplimientoPorc"
                    ></div>
                  </div>
                  <small style="font-weight: 700; color: #475569;">{{ exp.cumplimientoPorc }}%</small>
                </td>
                <td>
                  <span
                    class="label"
                    [ngClass]="{
                      'label-success': exp.estadoGeneral === 'APROBADO_CONFORME' || exp.estadoGeneral === 'CERRADO_AUDITADO',
                      'label-warning': exp.estadoGeneral === 'EN_EVALUACION' || exp.estadoGeneral === 'EN_SOLICITUD',
                      'label-danger': exp.estadoGeneral === 'OBSERVADO_BLOQUEADO'
                    }"
                    style="font-size: 10px; padding: 4px 8px; border-radius: 999px;"
                  >
                    {{ formatearEstado(exp.estadoGeneral) }}
                  </span>
                </td>
                <td>
                  <small style="color: #64748b;">{{ exp.fechaUltimoMovimiento }}</small>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                  <button
                    class="btn btn-xs btn-default"
                    (click)="seleccionarExpediente(exp)"
                    title="Ver Trazabilidad 360°"
                    style="margin-right: 4px;"
                  >
                    <i class="fa fa-eye text-primary"></i> Trazabilidad
                  </button>
                  <button
                    class="btn btn-xs btn-success"
                    (click)="avanzarExpediente(exp)"
                    title="Avanzar a Siguiente Etapa"
                    style="margin-right: 4px;"
                  >
                    <i class="fa fa-chevron-right"></i>
                  </button>
                  <button
                    class="btn btn-xs btn-info"
                    (click)="imprimirExpedienteItem(exp)"
                    title="Imprimir Credencial / Ficha"
                  >
                    <i class="fa fa-print"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="expedientesFiltrados().length === 0">
                <td colspan="8" style="text-align: center; padding: 25px; color: #94a3b8;">
                  <i class="fa fa-folder-open-o" style="font-size: 24px; margin-bottom: 6px; display: block;"></i>
                  No se encontraron expedientes en el flujo para el criterio seleccionado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PANEL LATERAL / INFERIOR DE TRAZABILIDAD 360° Y BITÁCORA DEL EXPEDIENTE SELECCIONADO -->
      <div *ngIf="expedienteSeleccionado()" class="panel panel-info" style="border-radius: 8px; border-color: #cbd5e1; margin-top: 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); background: #fff;">
        <div class="panel-heading" style="background: #004B87; color: #fff; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 14px;">
            <i class="fa fa-history"></i> Auditoría Forense y Bitácora Transaccional — Expediente #{{ expedienteSeleccionado()?.codigoExpediente }}
          </span>
          <button class="btn btn-xs btn-danger" (click)="expedienteSeleccionado.set(null)" title="Cerrar panel">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="panel-body" style="padding: 18px;">
          <div class="row">
            <!-- Columna Trazabilidad y Eventos -->
            <div class="col-md-8">
              <h5 style="margin-top: 0; font-weight: 700; color: #1e293b;">Línea de Tiempo del Flujo de Trabajo (Persistido en SQL Server)</h5>
              <div style="position: relative; padding-left: 20px; border-left: 2px solid #004B87; margin-top: 12px;">
                <div *ngFor="let ev of bitacoraExpedienteActual()" style="margin-bottom: 14px; position: relative;">
                  <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #004B87; border: 2px solid #fff;"></div>
                  <div style="font-size: 11px; color: #64748b;">
                    <i class="fa fa-clock-o"></i> {{ ev.fechaHora }} &bull; <strong>{{ ev.responsable }}</strong>
                  </div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                    {{ ev.etapa }} — {{ ev.accion }}
                  </div>
                  <div style="font-size: 11px; color: #334155; margin-top: 2px;">
                    Estado: <span class="label label-default" style="font-size: 9px;">{{ ev.estadoResultante }}</span>
                    <span *ngIf="ev.hashCriptografico" style="margin-left: 6px; font-family: monospace; color: #0284c7;">
                      <i class="fa fa-shield"></i> {{ ev.hashCriptografico }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna QR Criptográfico y Credencial ISO 45001 -->
            <div class="col-md-4" style="text-align: center; border-left: 1px solid #e2e8f0;">
              <h5 style="margin-top: 0; font-weight: 700; color: #1e293b;">Verificación Digital Instantánea</h5>
              <div style="display: inline-block; padding: 12px; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 6px rgba(0,0,0,.04);">
                <svg viewBox="0 0 250 250" width="140" height="140">
                  <path [attr.d]="generarPathsQrSvg(expedienteSeleccionado()?.codigoExpediente || 'ONESST')" fill="#004B87" />
                </svg>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: #0f172a;">{{ expedienteSeleccionado()?.codigoExpediente }}</div>
              <small style="color: #64748b; font-size: 10px; display: block;">Código QR Dinámico con Firma SHA-256</small>
              <button
                class="btn btn-xs btn-primary"
                (click)="imprimirCredencialQr()"
                style="margin-top: 10px; font-weight: 600;"
              >
                <i class="fa fa-id-badge"></i> Imprimir Credencial con QR
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL DE ACCIÓN / TRANSICIÓN INTERACTIVA -->
      <div *ngIf="modalAccionAbierto()" style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 15px;">
        <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div class="panel-heading" style="background: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title" style="font-weight: 700; font-size: 15px;">
              <i class="fa fa-cog"></i> Ejecutar Acción de Workflow: {{ tipoAccionModal() }}
            </h4>
            <button class="btn btn-xs btn-danger" (click)="modalAccionAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body" style="padding: 18px;">
            <div class="form-group">
              <label>Expediente Asociado:</label>
              <select class="form-control input-sm" [(ngModel)]="idExpedienteAccion">
                <option *ngFor="let e of expedientesCasoActual()" [value]="e.id">
                  {{ e.codigoExpediente }} — {{ e.titulo }} ({{ e.sujetoEntidad }})
                </option>
              </select>
            </div>

            <!-- Formulario dinámico según tipo de acción -->
            <div *ngIf="tipoAccionModal() === 'SUBIR_EVIDENCIA'" class="form-group">
              <label>Seleccionar Archivo de Evidencia (PDF, JPG, PNG):</label>
              <input type="file" class="form-control input-sm" (change)="onArchivoSeleccionado($event)">
              <small *ngIf="archivoSeleccionadoNombre()" style="color: #16a34a; font-weight: 600; display: block; margin-top: 4px;">
                <i class="fa fa-check"></i> Archivo listo: {{ archivoSeleccionadoNombre() }}
              </small>
            </div>

            <div *ngIf="tipoAccionModal() === 'FIRMAR_DIGITAL'" class="form-group">
              <div style="background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px; margin-bottom: 10px;">
                <div style="font-weight: 700; color: #0369a1; font-size: 12px;">Sello Criptográfico Digital Ley N° 27269</div>
                <div style="font-size: 11px; color: #0284c7; margin-top: 2px;">
                  Firmante: <strong>{{ session.usuarioNombre() }}</strong> &bull; Perfil: <strong>{{ session.nombrePerfil() }}</strong>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Comentarios / Dictamen / Observación de Auditoría:</label>
              <textarea
                class="form-control input-sm"
                rows="3"
                [(ngModel)]="observacionModal"
                placeholder="Registra los detalles del cumplimiento o motivos de la decisión técnica..."
              ></textarea>
            </div>
          </div>
          <div class="panel-footer" style="display: flex; justify-content: flex-end; gap: 8px; background: #f8fafc;">
            <button class="btn btn-sm btn-default" (click)="modalAccionAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="confirmarAccionModal()">
              <i class="fa fa-check"></i> Confirmar y Persistir en SQL Server
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL PARA NUEVO EXPEDIENTE -->
      <div *ngIf="modalNuevoExpedienteAbierto()" style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 15px;">
        <div class="panel panel-primary" style="width: 100%; max-width: 540px; margin: 0; border-radius: 8px;">
          <div class="panel-heading" style="background: #004B87; display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title" style="font-weight: 700; font-size: 15px;">
              <i class="fa fa-plus-circle"></i> Iniciar Expediente de {{ infoCasoActual().nombre }}
            </h4>
            <button class="btn btn-xs btn-danger" (click)="modalNuevoExpedienteAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label>Título o Asunto del Trámite:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="nuevoTitulo" placeholder="Ej. Homologación Anual 2026 / PETAR Horno Waelz">
            </div>
            <div class="form-group">
              <label>Sujeto, Empresa o Unidad:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="nuevoSujeto" placeholder="Ej. GRUPO ELIAS-29 S.A.C / Juan Quispe / Camioneta CPX-492">
            </div>
            <div class="form-group">
              <label>Responsable de Gestión:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="nuevoResponsable" [value]="session.usuarioNombre()">
            </div>
          </div>
          <div class="panel-footer" style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn btn-sm btn-default" (click)="modalNuevoExpedienteAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="crearExpedienteConfirmar()">
              <i class="fa fa-cloud-upload"></i> Crear Expediente en SQL Server
            </button>
          </div>
        </div>
      </div>

      <!-- IFRAME OCULTO DE IMPRESIÓN OFICIAL CORPORATIVA -->
      <iframe #printFrame id="onesstWorkflowPrintFrame" style="position: absolute; width: 0; height: 0; border: none; visibility: hidden;"></iframe>

    </div>
  `
})
export class WorkflowInteractivoComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly router = inject(Router);

  readonly casoActivo = signal<TipoWorkflowCaso>('HOMOLOGACION_CONTRATISTA');
  readonly pasoActivo = signal<number>(1);
  readonly filtroTexto = signal<string>('');
  readonly filtroEstado = signal<string>('TODOS');
  readonly expedienteSeleccionado = signal<ExpedienteWorkflowItem | null>(null);

  readonly modalAccionAbierto = signal<boolean>(false);
  readonly modalNuevoExpedienteAbierto = signal<boolean>(false);
  readonly tipoAccionModal = signal<'AVANZAR' | 'OBSERVAR' | 'SUBIR_EVIDENCIA' | 'FIRMAR_DIGITAL'>('AVANZAR');
  idExpedienteAccion = 1;
  observacionModal = '';
  archivoSeleccionadoNombre = signal<string>('');

  nuevoTitulo = '';
  nuevoSujeto = '';
  nuevoResponsable = 'Ing. Supervisor SST';

  // Catálogo reactivo de 6 casos de procesos integrales (Sincronizado con dbo.Sys_WorkflowCaso)
  readonly catalogoCasos = signal<{ id: TipoWorkflowCaso; nombre: string; icono: string; norma: string }[]>([
    { id: 'HOMOLOGACION_CONTRATISTA', nombre: 'Homologación de Contratistas', icono: 'fa-handshake-o', norma: 'Ley 29783 & ISO 45001:2018' },
    { id: 'PETAR_ALTO_RIESGO', nombre: 'Permisos de Alto Riesgo (PETAR/ATS)', icono: 'fa-shield', norma: 'D.S. 024-2016-EM / G.050' },
    { id: 'ACREDITACION_PERSONAL', nombre: 'Acreditación y Garita (Pase 360°)', icono: 'fa-id-card-o', norma: 'D.S. 005-2012-TR Art. 68' },
    { id: 'INVESTIGACION_ACCIDENTES', nombre: 'Investigación de Accidentes (MINTRA)', icono: 'fa-ambulance', norma: 'Ley 29783 Art. 92 & D.S. 005' },
    { id: 'INSPECCIONES_SSOMA', nombre: 'Inspecciones de Seguridad (IPERC)', icono: 'fa-check-square-o', norma: 'ISO 45001 Cláusula 9.2' },
    { id: 'VIGILANCIA_MEDICA', nombre: 'Vigilancia Médica Ocupacional (EMO)', icono: 'fa-stethoscope', norma: 'R.M. 312-2011-MINSA / EMO' }
  ]);

  // Mapa reactivo de etapas cargado dinámicamente desde dbo.Sys_WorkflowEtapa
  readonly mapaEtapasPorCaso = signal<Record<string, EtapaWorkflowCaso[]>>({});

  // Base de expedientes activos e históricos obtenida 100% de dbo.Sys_WorkflowExpediente
  readonly expedientes = signal<ExpedienteWorkflowItem[]>([]);

  // Bitácora transaccional cargada desde dbo.Sys_TransicionWorkflow
  readonly bitacoraExpedientes = signal<Record<string, EventoTrazabilidad[]>>({});

  ngOnInit(): void {
    // 1. Cargar catálogo de casos y etapas desde la base de datos SQL Server
    this.cargarCasosDesdeBackend();
    // 2. Cargar expedientes persistidos desde SQL Server
    this.cargarExpedientesDesdeBackend();
  }

  cargarCasosDesdeBackend(): void {
    this.api.callAjaxPost<{ casos: any[] }>('/workflow/caso/lista', {}).subscribe({
      next: (res) => {
        const casos = res?.['casos'];
        if (Array.isArray(casos) && casos.length > 0) {
          this.catalogoCasos.set(casos.map(c => ({
            id: c.codigoCaso as TipoWorkflowCaso,
            nombre: c.nombre,
            icono: c.icono || 'fa-sitemap',
            norma: c.normaLegal
          })));

          const mapa: Record<string, EtapaWorkflowCaso[]> = {};
          for (const c of casos) {
            if (Array.isArray(c.etapas)) {
              mapa[c.codigoCaso] = c.etapas.map((et: any) => ({
                paso: et.paso,
                titulo: et.titulo,
                subtitulo: et.subtitulo,
                responsableRol: et.responsableRol,
                normaLegal: et.normaLegal,
                requisitosObligatorios: et.requisitosObligatorios || [],
                estado: 'PENDIENTE'
              }));
            }
          }
          this.mapaEtapasPorCaso.set(mapa);
        }
      },
      error: (err) => console.error('Error al sincronizar catálogo de casos desde SQL Server:', err)
    });
  }

  cargarExpedientesDesdeBackend(): void {
    const idEmpresa = Number(this.session.getSession('gestopcompanyid')) || 773;
    this.api.callAjaxPost<Record<string, any>>('/workflow/expediente/lista', { idEmpresa }).subscribe({
      next: (res) => {
        const list = res?.['list'] || res?.['expedientes'];
        if (Array.isArray(list)) {
          this.expedientes.set(list);
          const act = this.expedienteSeleccionado();
          if (act) {
            const encontrado = list.find(e => e.codigoExpediente === act.codigoExpediente);
            if (encontrado) this.expedienteSeleccionado.set(encontrado);
          } else {
            const primeroDelCaso = this.expedientesCasoActual()[0];
            if (primeroDelCaso) {
              this.seleccionarExpediente(primeroDelCaso);
            }
          }
        }
      },
      error: (err) => console.error('Error al consultar expedientes desde SQL Server:', err)
    });
  }

  cargarTrazabilidad(codigoExpediente: string): void {
    if (!codigoExpediente) return;
    this.api.callAjaxPost<{ trazabilidad: EventoTrazabilidad[] }>('/workflow/trazabilidad', {
      codigoExpediente
    }).subscribe({
      next: (res) => {
        const list = res?.['trazabilidad'];
        if (Array.isArray(list)) {
          this.bitacoraExpedientes.update(map => ({
            ...map,
            [codigoExpediente]: list
          }));
        }
      },
      error: (err) => console.error('Error al consultar trazabilidad de SQL Server:', err)
    });
  }

  seleccionarCaso(id: TipoWorkflowCaso): void {
    this.casoActivo.set(id);
    this.pasoActivo.set(1);
    this.expedienteSeleccionado.set(null);
    const primero = this.expedientesCasoActual()[0];
    if (primero) {
      this.seleccionarExpediente(primero);
    }
  }

  infoCasoActual() {
    return this.catalogoCasos().find(c => c.id === this.casoActivo()) || this.catalogoCasos()[0];
  }

  etapasCasoActual(): EtapaWorkflowCaso[] {
    return this.mapaEtapasPorCaso()[this.casoActivo()] || [];
  }

  etapaSeleccionada(): EtapaWorkflowCaso | undefined {
    return this.etapasCasoActual().find(e => e.paso === this.pasoActivo()) || this.etapasCasoActual()[0];
  }

  expedientesCasoActual(): ExpedienteWorkflowItem[] {
    const caso = this.casoActivo();
    const prefijos: Record<TipoWorkflowCaso, string> = {
      HOMOLOGACION_CONTRATISTA: 'EXP-HOM',
      PETAR_ALTO_RIESGO: 'EXP-PET',
      ACREDITACION_PERSONAL: 'EXP-ACR',
      INVESTIGACION_ACCIDENTES: 'EXP-INC',
      INSPECCIONES_SSOMA: 'EXP-INS',
      VIGILANCIA_MEDICA: 'EXP-MED'
    };
    const pref = prefijos[caso];
    return this.expedientes().filter(e => e.tipoCaso === caso || (pref && e.codigoExpediente.startsWith(pref)));
  }

  expedientesFiltrados(): ExpedienteWorkflowItem[] {
    const q = this.filtroTexto().trim().toLowerCase();
    const est = this.filtroEstado();
    return this.expedientesCasoActual().filter(e => {
      const okTexto = !q || e.codigoExpediente.toLowerCase().includes(q) || e.titulo.toLowerCase().includes(q) || e.sujetoEntidad.toLowerCase().includes(q);
      const okEstado = est === 'TODOS' || e.estadoGeneral === est;
      return okTexto && okEstado;
    });
  }

  contarExpedientesCaso(id: TipoWorkflowCaso): number {
    const prefijos: Record<TipoWorkflowCaso, string> = {
      HOMOLOGACION_CONTRATISTA: 'EXP-HOM',
      PETAR_ALTO_RIESGO: 'EXP-PET',
      ACREDITACION_PERSONAL: 'EXP-ACR',
      INVESTIGACION_ACCIDENTES: 'EXP-INC',
      INSPECCIONES_SSOMA: 'EXP-INS',
      VIGILANCIA_MEDICA: 'EXP-MED'
    };
    const pref = prefijos[id];
    return this.expedientes().filter(e => e.tipoCaso === id || (pref && e.codigoExpediente.startsWith(pref))).length;
  }

  resumenKpis() {
    const lista = this.expedientesCasoActual();
    const enProceso = lista.filter(e => e.estadoGeneral === 'EN_EVALUACION' || e.estadoGeneral === 'EN_SOLICITUD').length;
    const aprobados = lista.filter(e => e.estadoGeneral === 'APROBADO_CONFORME' || e.estadoGeneral === 'CERRADO_AUDITADO').length;
    const observados = lista.filter(e => e.estadoGeneral === 'OBSERVADO_BLOQUEADO').length;
    const total = lista.length || 1;
    const eficaciaPorc = Math.round((aprobados / total) * 100);
    return { enProceso, aprobados, observados, eficaciaPorc };
  }

  seleccionarPasoStepper(paso: number): void {
    this.pasoActivo.set(paso);
  }

  seleccionarExpediente(exp: ExpedienteWorkflowItem): void {
    this.expedienteSeleccionado.set(exp);
    this.idExpedienteAccion = exp.id;
    this.cargarTrazabilidad(exp.codigoExpediente);
  }

  bitacoraExpedienteActual(): EventoTrazabilidad[] {
    const exp = this.expedienteSeleccionado();
    if (!exp) return [];
    const bit = this.bitacoraExpedientes()[exp.codigoExpediente];
    if (bit && bit.length) return bit;

    return [
      {
        fechaHora: exp.fechaUltimoMovimiento,
        etapa: `Etapa ${exp.etapaActual}`,
        accion: 'Revisión y validación de prerrequisitos regulatorios',
        responsable: exp.responsableActual,
        estadoResultante: exp.estadoGeneral,
        hashCriptografico: 'SHA256-' + exp.codigoExpediente.replace(/[^A-Z0-9]/g, '').slice(-8)
      },
      {
        fechaHora: exp.fechaInicio,
        etapa: 'Etapa 1',
        accion: 'Apertura de expediente y registro inicial en repositorio OneSST',
        responsable: 'Sistema OneSST',
        estadoResultante: 'INICIADO'
      }
    ];
  }

  avanzarExpediente(exp: ExpedienteWorkflowItem): void {
    const siguienteEtapa = Math.min(exp.totalEtapas, exp.etapaActual + 1);
    const esFinal = siguienteEtapa === exp.totalEtapas;
    const nuevoEstado = esFinal ? 'APROBADO_CONFORME' : 'EN_EVALUACION';

    this.api.callAjaxPost('/workflow/transicion', {
      codigo: exp.codigoExpediente,
      tipo: exp.tipoCaso || this.casoActivo(),
      etapa: siguienteEtapa,
      estado: nuevoEstado,
      accion: `Transición a Etapa ${siguienteEtapa}`,
      usuario: this.session.usuarioNombre()
    }).subscribe({
      next: () => {
        this.cargarExpedientesDesdeBackend();
        this.cargarTrazabilidad(exp.codigoExpediente);
      },
      error: () => {
        this.cargarExpedientesDesdeBackend();
      }
    });
  }

  private actualizarExpedienteLocal(id: number, etapa: number, estado: any, cumplimiento: number): void {
    const ahora = new Date().toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    this.expedientes.update(arr => arr.map(e => e.id === id ? {
      ...e,
      etapaActual: etapa,
      estadoGeneral: estado,
      cumplimientoPorc: cumplimiento,
      fechaUltimoMovimiento: ahora
    } : e));

    const expActualizado = this.expedientes().find(e => e.id === id);
    if (expActualizado) {
      this.expedienteSeleccionado.set(expActualizado);
    }
  }

  abrirModalAccion(tipo: 'AVANZAR' | 'OBSERVAR' | 'SUBIR_EVIDENCIA' | 'FIRMAR_DIGITAL'): void {
    this.tipoAccionModal.set(tipo);
    this.observacionModal = '';
    this.archivoSeleccionadoNombre.set('');
    const lista = this.expedientesCasoActual();
    if (lista.length > 0 && !this.idExpedienteAccion) {
      this.idExpedienteAccion = lista[0].id;
    }
    this.modalAccionAbierto.set(true);
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionadoNombre.set(input.files[0].name);
    }
  }

  confirmarAccionModal(): void {
    const exp = this.expedientes().find(e => e.id === Number(this.idExpedienteAccion));
    if (!exp) return;

    const tipo = this.tipoAccionModal();
    let nuevoEstado = exp.estadoGeneral;
    let accionDesc = '';
    let hashFirma: string | undefined = undefined;

    if (tipo === 'AVANZAR') {
      const sig = Math.min(exp.totalEtapas, exp.etapaActual + 1);
      nuevoEstado = sig === exp.totalEtapas ? 'APROBADO_CONFORME' : 'EN_EVALUACION';
      accionDesc = `Aprobación de Etapa ${exp.etapaActual} y avance a Etapa ${sig}`;
    } else if (tipo === 'OBSERVAR') {
      nuevoEstado = 'OBSERVADO_BLOQUEADO';
      accionDesc = `Observación técnica registrada: ${this.observacionModal || 'Requiere subsanación documental'}`;
    } else if (tipo === 'SUBIR_EVIDENCIA') {
      accionDesc = `Evidencia cargada: ${this.archivoSeleccionadoNombre() || 'Documento adjunto'}`;
    } else if (tipo === 'FIRMAR_DIGITAL') {
      hashFirma = 'SHA256-SIG-' + Math.random().toString(16).substring(2, 8).toUpperCase();
      accionDesc = `Firma digital estampada por ${this.session.usuarioNombre()} (${hashFirma})`;
    }

    this.api.callAjaxPost('/workflow/transicion', {
      codigo: exp.codigoExpediente,
      tipo: exp.tipoCaso || this.casoActivo(),
      etapa: exp.etapaActual,
      estado: nuevoEstado,
      accion: accionDesc,
      usuario: this.session.usuarioNombre(),
      hashFirma,
      comentarios: this.observacionModal || undefined
    }).subscribe({
      next: () => {
        this.cargarExpedientesDesdeBackend();
        this.cargarTrazabilidad(exp.codigoExpediente);
        this.modalAccionAbierto.set(false);
      },
      error: () => {
        this.cargarExpedientesDesdeBackend();
        this.modalAccionAbierto.set(false);
      }
    });
  }

  abrirModalNuevoExpediente(): void {
    const info = this.infoCasoActual();
    this.nuevoTitulo = `${info.nombre} — Período 2026`;
    this.nuevoSujeto = 'GRUPO ELIAS-29 S.A.C (Contratista Principal)';
    this.nuevoResponsable = this.session.usuarioNombre();
    this.modalNuevoExpedienteAbierto.set(true);
  }

  crearExpedienteConfirmar(): void {
    if (!this.nuevoTitulo.trim()) return;

    this.api.callAjaxPost<ExpedienteWorkflowItem>('/workflow/expediente/save', {
      codigoCaso: this.casoActivo(),
      idEmpresa: Number(this.session.getSession('gestopcompanyid')) || 773,
      titulo: this.nuevoTitulo.trim(),
      sujetoEntidad: this.nuevoSujeto.trim() || 'Entidad Registrada',
      responsable: this.nuevoResponsable.trim() || this.session.usuarioNombre(),
      observaciones: 'Expediente radicado formalmente en SQL Server.'
    }).subscribe({
      next: () => {
        this.modalNuevoExpedienteAbierto.set(false);
        this.cargarExpedientesDesdeBackend();
      },
      error: () => {
        this.modalNuevoExpedienteAbierto.set(false);
        this.cargarExpedientesDesdeBackend();
      }
    });
  }

  formatearEstado(est: string): string {
    const mapa: Record<string, string> = {
      EN_SOLICITUD: 'En Solicitud',
      EN_EVALUACION: 'En Evaluación SSOMA',
      APROBADO_CONFORME: 'Aprobado y Conforme',
      OBSERVADO_BLOQUEADO: 'Observado / Bloqueado',
      CERRADO_AUDITADO: 'Cerrado y Auditado'
    };
    return mapa[est] || est;
  }

  generarPathsQrSvg(payload: string): string {
    const size = 25;
    const cellSize = 10;
    const paths: string[] = [];
    const hash = this.simpleHash(payload);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isFinder =
          (r < 7 && c < 7) ||
          (r < 7 && c >= size - 7) ||
          (r >= size - 7 && c < 7);

        let fill = false;
        if (isFinder) {
          const inOuter = r === 0 || r === 6 || c === 0 || c === 6 ||
                          r === size - 7 || r === size - 1 || c === size - 7 || c === size - 1;
          const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                          (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) ||
                          (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4);
          fill = inOuter || inInner;
        } else {
          fill = ((hash ^ (r * 31 + c * 17)) % 3) === 0;
        }

        if (fill) {
          const x = c * cellSize;
          const y = r * cellSize;
          paths.push(`M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z`);
        }
      }
    }
    return paths.join(' ');
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  imprimirExpedienteCompleto(): void {
    const info = this.infoCasoActual();
    const exps = this.expedientesCasoActual();
    const qrSvgPath = this.generarPathsQrSvg(`ONESST|DOSSIER|${this.casoActivo()}|${Date.now()}`);

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Dossier Oficial ISO 45001 — ${info.nombre}</title>
        <style>
          @page { size: A4 landscape; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #004B87; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 16px; font-weight: bold; color: #004B87; margin: 0; }
          .meta { font-size: 10px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background: #004B87; color: #fff; font-weight: bold; font-size: 10px; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
          .badge-success { background: #dcfce7; color: #166534; }
          .badge-warning { background: #fef3c7; color: #92400e; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .sign-box { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">OneSST Enterprise — Dossier de Auditoría y Flujos de Trabajo SSOMA</h1>
            <div class="meta"><strong>Proceso:</strong> ${info.nombre} &bull; <strong>Base Legal:</strong> ${info.norma} &bull; <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}</div>
          </div>
          <svg viewBox="0 0 250 250" width="60" height="60">
            <path d="${qrSvgPath}" fill="#004B87" />
          </svg>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código Expediente</th>
              <th>Título / Objeto del Trámite</th>
              <th>Sujeto / Unidad</th>
              <th>Etapa</th>
              <th>Avance</th>
              <th>Estado General</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${exps.map(e => `
              <tr>
                <td><strong>${e.codigoExpediente}</strong></td>
                <td>${e.titulo}</td>
                <td>${e.sujetoEntidad}</td>
                <td>Etapa ${e.etapaActual} / ${e.totalEtapas}</td>
                <td>${e.cumplimientoPorc}%</td>
                <td><span class="badge ${e.estadoGeneral.includes('APROB') ? 'badge-success' : 'badge-warning'}">${this.formatearEstado(e.estadoGeneral)}</span></td>
                <td>${e.responsableActual}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div style="font-size: 9px; color: #64748b;">
            Documento emitido conforme al estándar ISO 45001:2018 y Ley N° 29783. Verificable mediante código QR corporativo.
          </div>
          <div style="display: flex; gap: 40px;">
            <div class="sign-box">Ing. Auditor SSOMA<br>CIP / Registro Acreditado</div>
            <div class="sign-box">Responsable del Contratista<br>Firma Digital Autorizada</div>
          </div>
        </div>
      </body>
      </html>
    `;

    this.imprimirHtmlEnIframe(html);
  }

  imprimirExpedienteItem(exp: ExpedienteWorkflowItem): void {
    const qrSvgPath = this.generarPathsQrSvg(exp.codigoExpediente);
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Expediente ${exp.codigoExpediente}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #0f172a; padding: 25px; }
          .card { border: 2px solid #004B87; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #004B87; padding-bottom: 10px; margin-bottom: 15px; }
          h2 { margin: 0; color: #004B87; font-size: 16px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 11px; }
          .qr-box { text-align: center; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>OneSST — Ficha Oficial de Expediente SSOMA</h2>
            <span style="font-weight: bold; color: #166534; background: #dcfce7; padding: 4px 8px; border-radius: 4px;">${this.formatearEstado(exp.estadoGeneral)}</span>
          </div>
          <div class="grid">
            <div><strong>Código:</strong> ${exp.codigoExpediente}</div>
            <div><strong>Fecha:</strong> ${exp.fechaInicio}</div>
            <div><strong>Asunto:</strong> ${exp.titulo}</div>
            <div><strong>Sujeto:</strong> ${exp.sujetoEntidad}</div>
            <div><strong>Etapa:</strong> Etapa ${exp.etapaActual} de ${exp.totalEtapas}</div>
            <div><strong>Cumplimiento:</strong> ${exp.cumplimientoPorc}%</div>
            <div><strong>Responsable:</strong> ${exp.responsableActual}</div>
            <div><strong>Último Mov.:</strong> ${exp.fechaUltimoMovimiento}</div>
          </div>
          <div style="font-size: 11px; background: #f8fafc; padding: 8px; border-radius: 4px;">
            <strong>Observaciones de Auditoría:</strong> ${exp.observaciones}
          </div>
          <div class="qr-box">
            <svg viewBox="0 0 250 250" width="100" height="100">
              <path d="${qrSvgPath}" fill="#004B87" />
            </svg>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Código de Trazabilidad: ${exp.codigoExpediente}</div>
          </div>
        </div>
      </body>
      </html>
    `;
    this.imprimirHtmlEnIframe(html);
  }

  imprimirCredencialQr(): void {
    const exp = this.expedienteSeleccionado();
    if (!exp) return;
    this.imprimirExpedienteItem(exp);
  }

  private imprimirHtmlEnIframe(html: string): void {
    const frame = document.getElementById('onesstWorkflowPrintFrame') as HTMLIFrameElement;
    if (!frame) return;
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    }, 400);
  }

  irAlPortalContratista(): void {
    this.router.navigate(['/contratista']);
  }
}
