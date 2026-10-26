import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface EstadisticaMensualItem {
  id: number;
  periodo: string | null;
  nombre: string | null;
  hht: number | null;
  accidentesIncapacitantes: number | null;
  diasPerdidos: number | null;
  indiceFrecuencia: number | null;
  indiceSeveridad: number | null;
  indiceAccidentabilidad: number | null;
  estado: 'CERRADO_MINTRA' | 'PRELIMINAR' | null;
}

export interface ObjetivoSstItem {
  id: number;
  codigo: string | null;
  nombreIndicador: string | null;
  responsable: string | null;
  metaPorcentaje: number | null;
  avancePorcentaje: number | null;
  periodo: string | null;
  estado: 'META_CUMPLIDA' | 'EN_EJECUCION' | null;
}

export interface ModeloPredictivoIaItem {
  id: number;
  codigoModelo: string | null;
  motorIa: 'OCR_NLP_DOCUMENTAL' | 'PREDICCION_ACCIDENTABILIDAD' | 'DETECCION_FATIGA' | null;
  descripcionAnalisis: string | null;
  confianzaPrecision: number | null;
  alertaGenerada: string | null;
  estado: 'ACTIVO_PRODUCCION' | 'ENTRENANDO' | null;
}

export interface ConsultaVisitanteQrItem {
  id: number;
  dniOPlaca: string | null;
  nombreVisitante: string | null;
  empresaProcedencia: string | null;
  motivoVisita: string | null;
  areaAutorizada: string | null;
  anfitrionHolcim: string | null;
  fechaHoraIngreso: string | null;
  paseQrHabilitado: boolean | null;
}

@Component({
  selector: 'msst-modulo12-bi',
  standalone: true,
  imports: [QueryPagesComponent,WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera Corporativa Módulo 12 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-line-chart"></i>  Business Intelligence (HHT, IF, IS, IA), Objetivos PASST, Analítica Predictiva IA y Consultas QR
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalEstadistica.set(true)">
              <i class="fa fa-plus-circle"></i> + Cierre Mensual HHT
            </button>
            <button class="btn btn-xs btn-warning" (click)="mostrarModalObjetivo.set(true)">
              <i class="fa fa-bullseye"></i> + Nuevo Objetivo PASST
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalVisitante.set(true)">
              <i class="fa fa-qrcode"></i> + Emitir Pase QR
            </button>
          </div>
        </div>

        <!-- KPIs Superiores -->
        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">HORAS HOMBRE TRABAJADAS (HHT)</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ totalHhtAcumuladas() | number }} HHT</div>
                <div style="font-size: 11px; color: #28a745;">Indicadores por período confirmado</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CUMPLIMIENTO OBJETIVOS PASST</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ promedioAvanceObjetivos() }}% Avance</div>
                <div style="font-size: 11px; color: #888;">{{ objetivos().length }} Metas Estratégicas SST</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #6f42c1; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">PRECISIÓN MOTOR IA PREDICTIVA</div>
                <div style="font-size: 20px; font-weight: bold; color: #6f42c1;">Sin medición confirmada</div>
                <div style="font-size: 11px; color: #888;">Consulte resultados registrados</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CONSULTAS QR Y VISITANTES</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ visitantes().length }} visitas registradas</div>
                <div style="font-size: 11px; color: #888;">Validación Instantánea DNI / Placa</div>
              </div>
            </div>
          </div>

          <!-- Navegación 4 Pestañas Interactivas -->
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 4px;">
            <button class="btn btn-sm" [ngClass]="pestana() === 'ESTADISTICAS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('ESTADISTICAS')">
              <i class="fa fa-bar-chart"></i> 1. Estadísticas BI: HHT, IF, IS e IA
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'OBJETIVOS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('OBJETIVOS')">
              <i class="fa fa-bullseye"></i> 2. Objetivos y Metas PASST
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'ANALITICA_IA' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('ANALITICA_IA')">
              <i class="fa fa-microchip"></i> 3. Motor de Inteligencia Artificial SST
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'VISITANTES' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('VISITANTES')">
              <i class="fa fa-qrcode"></i> 4. Consultas Públicas QR y Visitantes
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: ESTADÍSTICAS BI E INDICADORES MENSUALES (IF, IS, IA) -->
      @if (pestana() === 'ESTADISTICAS') {
        <!-- Calculadora Interactiva en Vivo ANSI Z16.1 / MINTRA -->
        <div class="panel panel-info" style="margin-bottom: 16px;">
          <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
            <h4 class="panel-title">
              <i class="fa fa-calculator"></i> Calculadora de referencia de índices de seguridad (factor 1,000,000)
            </h4>
            <span class="badge">IA = (IF &times; IS) / 1,000</span>
          </div>
          <div class="panel-body" style="background: #f9fbfd;">
            <div class="row">
              <div class="col-md-3 form-group">
                <label>Horas Hombre Trabajadas (HHT):</label>
                <input type="number" min="1" class="form-control input-sm" [(ngModel)]="calcHht">
              </div>
              <div class="col-md-3 form-group">
                <label>N° Accidentes Incapacitantes:</label>
                <input type="number" min="0" class="form-control input-sm" [(ngModel)]="calcAccidentes">
              </div>
              <div class="col-md-2 form-group">
                <label>Días Perdidos (DM):</label>
                <input type="number" min="0" class="form-control input-sm" [(ngModel)]="calcDiasPerdidos">
              </div>
              <div class="col-md-4">
                <div style="background: #fff; border: 1px solid #cbd5e1; border-radius: 5px; padding: 8px 12px; display: flex; justify-content: space-around; text-align: center;">
                  <div>
                    <div style="font-size: 10px; color: #666;">ÍNDICE FRECUENCIA (IF)</div>
                    <div style="font-size: 16px; font-weight: bold; color: #004B87;">{{ calcularIfVivo() }}</div>
                  </div>
                  <div>
                    <div style="font-size: 10px; color: #666;">ÍNDICE SEVERIDAD (IS)</div>
                    <div style="font-size: 16px; font-weight: bold; color: #d39e00;">{{ calcularIsVivo() }}</div>
                  </div>
                  <div>
                    <div style="font-size: 10px; color: #666;">ACCIDENTABILIDAD (IA)</div>
                    <div style="font-size: 16px; font-weight: bold; color: #28a745;">{{ calcularIaVivo() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-bar-chart"></i> Histórico Mensual de Estadísticas de Seguridad y Salud en el Trabajo</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvEstadisticas()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalEstadistica.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Cierre Mensual HHT
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por periodo (2026-10) o descripción de reporte..." [(ngModel)]="filtroEstadistica">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Periodo</th>
                    <th>Descripción del Reporte Mensual Consolidado</th>
                    <th style="text-align:right;">HHT Mes</th>
                    <th style="text-align:center;">Acc. Incap.</th>
                    <th style="text-align:center;">Días Perdidos</th>
                    <th style="text-align:right;">IF</th>
                    <th style="text-align:right;">IS</th>
                    <th style="text-align:right;">IA</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (est of estadisticasFiltradas(); track est.id) {
                    <tr>
                      <td><strong>#{{ est.id }}</strong></td>
                      <td><code>{{ est.periodo }}</code></td>
                      <td><strong>{{ est.nombre }}</strong></td>
                      <td style="text-align:right;"><strong>{{ est.hht | number }}</strong></td>
                      <td style="text-align:center;">{{ est.accidentesIncapacitantes }}</td>
                      <td style="text-align:center;">{{ est.diasPerdidos }}</td>
                      <td style="text-align:right;"><code>{{ est.indiceFrecuencia?.toFixed(2) ?? 'Sin dato' }}</code></td>
                      <td style="text-align:right;"><code>{{ est.indiceSeveridad?.toFixed(2) ?? 'Sin dato' }}</code></td>
                      <td style="text-align:right;"><strong>{{ est.indiceAccidentabilidad?.toFixed(2) ?? 'Sin dato' }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="est.estado === 'CERRADO_MINTRA' ? 'label-success' : 'label-warning'">
                          {{ est.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarEstadistica(est)" title="Cerrar Periodo">
                            <i class="fa fa-check"></i> Validar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarEstadistica(est)" title="Eliminar">
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

      <!-- PESTAÑA 2: SEGUIMIENTO DE OBJETIVOS Y METAS DEL PROGRAMA ANUAL DE SST -->
      @if (pestana() === 'OBJETIVOS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-bullseye"></i> Seguimiento de Objetivos y Metas del Programa Anual de SST — PASST</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvObjetivos()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalObjetivo.set(true)">
                <i class="fa fa-plus-circle"></i> Nuevo Objetivo PASST
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por indicador, código o responsable..." [(ngModel)]="filtroObjetivo">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código</th>
                    <th>Indicador y Objetivo Estratégico del PASST</th>
                    <th>Responsable</th>
                    <th style="text-align:center;">Meta Anual</th>
                    <th style="width: 190px;">Avance Actual (%)</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (obj of objetivosFiltrados(); track obj.id) {
                    <tr>
                      <td><strong>#{{ obj.id }}</strong></td>
                      <td><code>{{ obj.codigo }}</code></td>
                      <td><strong>{{ obj.nombreIndicador }}</strong></td>
                      <td>{{ obj.responsable }}</td>
                      <td style="text-align:center;"><span class="badge">{{ obj.metaPorcentaje }}%</span></td>
                      <td>
                        <div class="progress" style="margin-bottom: 0; height: 18px; background: #e2e8f0;">
                          <div class="progress-bar progress-bar-success"
                               [style.width.%]="obj.avancePorcentaje"
                               style="line-height: 18px; font-size: 11px; font-weight: bold;">
                            {{ obj.avancePorcentaje }}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="label" [ngClass]="obj.avancePorcentaje !== null && obj.metaPorcentaje !== null && obj.avancePorcentaje >= obj.metaPorcentaje ? 'label-success' : 'label-info'">
                          {{ obj.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarObjetivo(obj)" title="Consultar el proceso">
                            <i class="fa fa-check"></i> Ver proceso
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarObjetivo(obj)" title="Eliminar">
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

      <!-- PESTAÑA 3: MOTOR DE INTELIGENCIA ARTIFICIAL PREDICTIVA SST -->
      @if (pestana() === 'ANALITICA_IA') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-microchip"></i> Motor de Inteligencia Artificial Predictiva, Validación OCR/NLP y Alertas Tempranas</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvIa()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalIa.set(true)">
                <i class="fa fa-plus-circle"></i> Ejecutar Nuevo Modelo Predictivo
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código Modelo</th>
                    <th>Motor IA Especializado</th>
                    <th>Análisis Predictivo / Validación Automatizada Ejecutada</th>
                    <th style="text-align:center;">Confianza IA</th>
                    <th>Alerta / Recomendación Prescriptiva</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (m of modelosIa(); track m.id) {
                    <tr>
                      <td><strong>#{{ m.id }}</strong></td>
                      <td><code>{{ m.codigoModelo }}</code></td>
                      <td><span class="label label-primary">{{ m.motorIa }}</span></td>
                      <td><strong>{{ m.descripcionAnalisis }}</strong></td>
                      <td style="text-align:center;"><span class="badge" style="background:#28a745;">{{ m.confianzaPrecision }}%</span></td>
                      <td style="font-size: 11px;">{{ m.alertaGenerada }}</td>
                      <td><span class="label label-success">{{ m.estado }}</span></td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarModeloIa(m)">
                            <i class="fa fa-bolt"></i> Recalibrar
                          </button>
                          <button title="Eliminar registro" class="btn btn-xs btn-danger" (click)="eliminarModeloIa(m)">
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

      <!-- PESTAÑA 4: PORTAL DE CONSULTAS PÚBLICAS QR Y CONTROL DE VISITANTES -->
      @if (pestana() === 'VISITANTES') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-qrcode"></i> Portal de Consultas Públicas QR por DNI/Placa y Control de Visitantes</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvVisitantes()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalVisitante.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Pase de Visitante QR
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-6">
                <input type="text" class="form-control input-sm" placeholder="Consulta rápida QR en Garita por DNI, Placa, Nombre o Empresa Visitante..." [(ngModel)]="filtroVisitante">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>DNI / Placa QR</th>
                    <th>Visitante / Auditor Externo</th>
                    <th>Empresa / Entidad de Procedencia</th>
                    <th>Motivo de Visita</th>
                    <th>Área Autorizada</th>
                    <th>Anfitrión Holcim</th>
                    <th>Fecha/Hora</th>
                    <th>Pase QR</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (v of visitantesFiltrados(); track v.id) {
                    <tr>
                      <td><strong>#{{ v.id }}</strong></td>
                      <td><code>{{ v.dniOPlaca }}</code></td>
                      <td><strong>{{ v.nombreVisitante }}</strong></td>
                      <td>{{ v.empresaProcedencia }}</td>
                      <td>{{ v.motivoVisita }}</td>
                      <td>{{ v.areaAutorizada }}</td>
                      <td>{{ v.anfitrionHolcim }}</td>
                      <td>{{ v.fechaHoraIngreso }}</td>
                      <td>
                        <span class="label" [ngClass]="v.paseQrHabilitado ? 'label-success' : 'label-danger'">
                          {{ v.paseQrHabilitado ? 'QR ACTIVO' : 'BLOQUEADO' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button type="button" class="btn btn-xs btn-primary onesst-btn-qr" title="Generar e Imprimir Pase QR">
                            <i class="fa fa-qrcode"></i> Pase QR
                          </button>
                          <button class="btn btn-xs btn-success" (click)="aprobarVisitante(v)" title="Autorizar Pase QR">
                            <i class="fa fa-check"></i> Autorizar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarVisitante(v)" title="Eliminar">
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

      <!-- MODAL NUEVA ESTADÍSTICA MENSUAL -->
      @if (mostrarModalEstadistica()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-bar-chart"></i> Registrar Cierre Estadístico Mensual HHT</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalEstadistica.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Periodo (Año-Mes):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaEstadistica.periodo">
                </div>
                <div class="col-md-8 form-group">
                  <label>Título del Cierre Mensual:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaEstadistica.nombre">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>HHT del Mes:</label>
                  <input type="number" min="1000" class="form-control input-sm" [(ngModel)]="nuevaEstadistica.hht">
                </div>
                <div class="col-md-4 form-group">
                  <label>Acc. Incapacitantes:</label>
                  <input type="number" min="0" class="form-control input-sm" [(ngModel)]="nuevaEstadistica.accidentesIncapacitantes">
                </div>
                <div class="col-md-4 form-group">
                  <label>Días Perdidos:</label>
                  <input type="number" min="0" class="form-control input-sm" [(ngModel)]="nuevaEstadistica.diasPerdidos">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalEstadistica.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaEstadistica()">
                <i class="fa fa-save"></i> Guardar Estadística
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO OBJETIVO SST -->
      @if (mostrarModalObjetivo()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-bullseye"></i> Registrar Objetivo y Meta del PASST</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalObjetivo.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código Objetivo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoObjetivo.codigo">
                </div>
                <div class="col-md-8 form-group">
                  <label>Responsable de Meta:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoObjetivo.responsable">
                </div>
              </div>
              <div class="form-group">
                <label>Descripción del Indicador / Meta Anual:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoObjetivo.nombreIndicador">
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Meta Programada (%):</label>
                  <input type="number" min="1" max="100" class="form-control input-sm" [(ngModel)]="nuevoObjetivo.metaPorcentaje">
                </div>
                <div class="col-md-6 form-group">
                  <label>Avance Actual (%):</label>
                  <input type="number" min="0" max="100" class="form-control input-sm" [(ngModel)]="nuevoObjetivo.avancePorcentaje">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalObjetivo.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoObjetivo()">
                <i class="fa fa-save"></i> Guardar Objetivo
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO MODELO IA -->
      @if (mostrarModalIa()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-microchip"></i> Registrar Regla o Modelo Predictivo IA</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalIa.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Código Modelo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoModeloIa.codigoModelo">
                </div>
                <div class="col-md-7 form-group">
                  <label>Motor IA:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoModeloIa.motorIa">
                    <option value="PREDICCION_ACCIDENTABILIDAD">PREDICCION_ACCIDENTABILIDAD</option>
                    <option value="OCR_NLP_DOCUMENTAL">OCR_NLP_DOCUMENTAL</option>
                    <option value="DETECCION_FATIGA">DETECCION_FATIGA</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descripción del Análisis Automatizado:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoModeloIa.descripcionAnalisis">
              </div>
              <div class="form-group">
                <label>Alerta / Prescripción Generada:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoModeloIa.alertaGenerada">
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalIa.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoModeloIa()">
                <i class="fa fa-save"></i> Guardar Modelo IA
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVO VISITANTE QR -->
      @if (mostrarModalVisitante()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-qrcode"></i> Emitir Pase QR de Visitante / Consulta Pública</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalVisitante.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>DNI / Placa:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.dniOPlaca">
                </div>
                <div class="col-md-8 form-group">
                  <label>Nombre Completo del Visitante:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.nombreVisitante">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Empresa / Institución:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.empresaProcedencia">
                </div>
                <div class="col-md-6 form-group">
                  <label>Motivo de Visita:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.motivoVisita">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group">
                  <label>Área Autorizada:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.areaAutorizada">
                </div>
                <div class="col-md-6 form-group">
                  <label>Anfitrión Responsable:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoVisitante.anfitrionHolcim">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalVisitante.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoVisitante()">
                <i class="fa fa-save"></i> Emitir Pase QR
              </button>
            </div>
          </div>
        </div>
      }

    </div>

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo12BiEstadisticasIaVisitantesComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'ESTADISTICAS' | 'OBJETIVOS' | 'ANALITICA_IA' | 'VISITANTES'>('ESTADISTICAS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');

  readonly mostrarModalEstadistica = signal<boolean>(false);
  readonly mostrarModalObjetivo = signal<boolean>(false);
  readonly mostrarModalIa = signal<boolean>(false);
  readonly mostrarModalVisitante = signal<boolean>(false);

  calcHht:number|null = null;
  calcAccidentes:number|null = null;
  calcDiasPerdidos:number|null = null;

  filtroEstadistica = '';
  filtroObjetivo = '';
  filtroVisitante = '';

  readonly estadisticas = signal<EstadisticaMensualItem[]>([]);

  readonly objetivos = signal<ObjetivoSstItem[]>([]);

  readonly modelosIa = signal<ModeloPredictivoIaItem[]>([]);

  readonly visitantes = signal<ConsultaVisitanteQrItem[]>([]);

  nuevaEstadistica = {
    periodo: '',
    nombre: '',
    hht: 0,
    accidentesIncapacitantes: 0,
    diasPerdidos: 0
  };

  nuevoObjetivo = {
    codigo: '',
    nombreIndicador: '',
    responsable: '',
    metaPorcentaje: 0,
    avancePorcentaje: 0
  };

  nuevoModeloIa = {
    codigoModelo: '',
    motorIa: '' as ModeloPredictivoIaItem['motorIa'],
    descripcionAnalisis: '',
    alertaGenerada: ''
  };

  nuevoVisitante = {
    dniOPlaca: '',
    nombreVisitante: '',
    empresaProcedencia: '',
    motivoVisita: '',
    areaAutorizada: '',
    anfitrionHolcim: ''
  };

  readonly totalHhtAcumuladas = computed(() =>
    this.estadisticas().reduce((acc, e) => acc + (Number(e.hht) || 0), 0)
  );

  readonly promedioAvanceObjetivos = computed(() => {
    const list = this.objetivos();
    if (!list.length) return 0;
    const sum = list.reduce((acc, o) => acc + (Number(o.avancePorcentaje) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });


  readonly pageRoutes=['/estadistica/lista', '/ia/lista', '/objetivo/lista', '/visitante/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/estadistica/lista', { ...{} }).subscribe({next:(response)=>{try{this.estadisticas.set(confirmedList<EstadisticaMensualItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"periodo","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"hht","kind":"number","optional":false,"nullable":true},{"name":"accidentesIncapacitantes","kind":"number","optional":false,"nullable":true},{"name":"diasPerdidos","kind":"number","optional":false,"nullable":true},{"name":"indiceFrecuencia","kind":"number","optional":false,"nullable":true},{"name":"indiceSeveridad","kind":"number","optional":false,"nullable":true},{"name":"indiceAccidentabilidad","kind":"number","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/objetivo/lista', { ...{} }).subscribe({next:(response)=>{try{this.objetivos.set(confirmedList<ObjetivoSstItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"nombreIndicador","kind":"string","optional":false,"nullable":true},{"name":"responsable","kind":"string","optional":false,"nullable":true},{"name":"metaPorcentaje","kind":"number","optional":false,"nullable":true},{"name":"avancePorcentaje","kind":"number","optional":false,"nullable":true},{"name":"periodo","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
    this.api.callAjaxPost('/visitante/lista', { ...{} }).subscribe({next:(response)=>{try{this.visitantes.set(confirmedList<ConsultaVisitanteQrItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"dniOPlaca","kind":"string","optional":false,"nullable":true},{"name":"nombreVisitante","kind":"string","optional":false,"nullable":true},{"name":"empresaProcedencia","kind":"string","optional":false,"nullable":true},{"name":"motivoVisita","kind":"string","optional":false,"nullable":true},{"name":"areaAutorizada","kind":"string","optional":false,"nullable":true},{"name":"anfitrionHolcim","kind":"string","optional":false,"nullable":true},{"name":"fechaHoraIngreso","kind":"string","optional":false,"nullable":true},{"name":"paseQrHabilitado","kind":"boolean","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
    this.api.callAjaxPost('/ia/lista', {}).subscribe({next:r=>{try{this.modelosIa.set(confirmedList<ModeloPredictivoIaItem>(r));}catch(e){this.mensajeOperacion.set(apiErrorMessage(e));}},error:e=>this.mensajeOperacion.set(apiErrorMessage(e))});
  }

  calcularIfVivo(): string {
    if(this.calcHht===null||this.calcHht<=0||this.calcAccidentes===null||this.calcDiasPerdidos===null||this.calcAccidentes<0||this.calcDiasPerdidos<0)return 'Sin datos válidos';
    const hht=this.calcHht;
    const acc = Math.max(0, Number(this.calcAccidentes) || 0);
    return ((acc * 1000000) / hht).toFixed(2);
  }

  calcularIsVivo(): string {
    if(this.calcHht===null||this.calcHht<=0||this.calcAccidentes===null||this.calcDiasPerdidos===null||this.calcAccidentes<0||this.calcDiasPerdidos<0)return 'Sin datos válidos';
    const hht=this.calcHht;
    const dp = Math.max(0, Number(this.calcDiasPerdidos) || 0);
    return ((dp * 1000000) / hht).toFixed(2);
  }

  calcularIaVivo(): string {
    if(this.calcHht===null||this.calcHht<=0||this.calcAccidentes===null||this.calcDiasPerdidos===null||this.calcAccidentes<0||this.calcDiasPerdidos<0)return 'Sin datos válidos';
    const hht=this.calcHht;
    const indF = (Math.max(0, Number(this.calcAccidentes) || 0) * 1000000) / hht;
    const indS = (Math.max(0, Number(this.calcDiasPerdidos) || 0) * 1000000) / hht;
    return ((indF * indS) / 1000).toFixed(2);
  }

  estadisticasFiltradas(): EstadisticaMensualItem[] {
    const q = this.filtroEstadistica.trim().toLowerCase();
    if (!q) return this.estadisticas();
    return this.estadisticas().filter(e =>
      (e.periodo??'').toLowerCase().includes(q) || (e.nombre??'').toLowerCase().includes(q)
    );
  }

  objetivosFiltrados(): ObjetivoSstItem[] {
    const q = this.filtroObjetivo.trim().toLowerCase();
    if (!q) return this.objetivos();
    return this.objetivos().filter(o =>
      (o.codigo??'').toLowerCase().includes(q) || (o.nombreIndicador??'').toLowerCase().includes(q) || (o.responsable??'').toLowerCase().includes(q)
    );
  }

  visitantesFiltrados(): ConsultaVisitanteQrItem[] {
    const q = this.filtroVisitante.trim().toLowerCase();
    if (!q) return this.visitantes();
    return this.visitantes().filter(v =>
      (v.dniOPlaca??'').toLowerCase().includes(q) || (v.nombreVisitante??'').toLowerCase().includes(q) || (v.empresaProcedencia??'').toLowerCase().includes(q)
    );
  }

  guardarNuevaEstadistica(): void {
    if (!this.nuevaEstadistica.nombre.trim()) return;
    this.api.callAjaxPost('/estadistica/insert', { ...this.nuevaEstadistica, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalEstadistica.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarEstadistica(item: EstadisticaMensualItem): void {this.workflowSelectionOpen.set(true);}

  eliminarEstadistica(item: EstadisticaMensualItem): void {
    this.api.callAjaxPost('/estadistica/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevoObjetivo(): void {
    if (!this.nuevoObjetivo.nombreIndicador.trim()) return;
    this.api.callAjaxPost('/objetivo/insert', { ...this.nuevoObjetivo, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalObjetivo.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarObjetivo(item: ObjetivoSstItem): void {this.workflowSelectionOpen.set(true);}

  eliminarObjetivo(item: ObjetivoSstItem): void {
    this.api.callAjaxPost('/objetivo/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevoModeloIa(): void {
    if (!this.nuevoModeloIa.descripcionAnalisis.trim()) return;
    this.api.callAjaxPost('/ia/insert', { ...this.nuevoModeloIa, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalIa.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarModeloIa(item: ModeloPredictivoIaItem): void {this.workflowSelectionOpen.set(true);}

  eliminarModeloIa(item: ModeloPredictivoIaItem): void {
    this.api.callAjaxPost('/ia/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevoVisitante(): void {
    if (!this.nuevoVisitante.nombreVisitante.trim()) return;
    this.api.callAjaxPost('/visitante/insert', { ...this.nuevoVisitante, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalVisitante.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarVisitante(item: ConsultaVisitanteQrItem): void {this.workflowSelectionOpen.set(true);}

  eliminarVisitante(item: ConsultaVisitanteQrItem): void {
    this.api.callAjaxPost('/visitante/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  exportarCsvEstadisticas(): void {
    const rows = this.estadisticas().map(e =>
      `${e.id};"${e.periodo}";"${e.nombre}";${e.hht};${e.accidentesIncapacitantes};${e.diasPerdidos};${e.indiceFrecuencia};${e.indiceSeveridad};${e.indiceAccidentabilidad}`
    );
    this.descargarArchivoCsv('MSST_Modulo12_EstadisticasBI.csv', 'ID;Periodo;Reporte;HHT;Accidentes;DiasPerdidos;IF;IS;IA\n' + rows.join('\n'));
  }

  exportarCsvObjetivos(): void {
    const rows = this.objetivos().map(o =>
      `${o.id};"${o.codigo}";"${o.nombreIndicador}";"${o.responsable}";${o.metaPorcentaje};${o.avancePorcentaje};"${o.estado}"`
    );
    this.descargarArchivoCsv('MSST_Modulo12_ObjetivosPASST.csv', 'ID;Codigo;Indicador;Responsable;Meta;Avance;Estado\n' + rows.join('\n'));
  }

  exportarCsvIa(): void {
    const rows = this.modelosIa().map(m =>
      `${m.id};"${m.codigoModelo}";"${m.motorIa}";"${m.descripcionAnalisis}";${m.confianzaPrecision};"${m.alertaGenerada}"`
    );
    this.descargarArchivoCsv('MSST_Modulo12_AnaliticaIA.csv', 'ID;Modelo;Motor;Analisis;Confianza;Alerta\n' + rows.join('\n'));
  }

  exportarCsvVisitantes(): void {
    const rows = this.visitantes().map(v =>
      `${v.id};"${v.dniOPlaca}";"${v.nombreVisitante}";"${v.empresaProcedencia}";"${v.motivoVisita}";"${v.areaAutorizada}";"${v.anfitrionHolcim}"`
    );
    this.descargarArchivoCsv('MSST_Modulo12_VisitantesQR.csv', 'ID;DNI_Placa;Visitante;Empresa;Motivo;Area;Anfitrion\n' + rows.join('\n'));
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
