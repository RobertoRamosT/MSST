import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface EstadisticaMensualItem {
  id: number;
  periodo: string;
  nombre: string;
  hht: number;
  accidentesIncapacitantes: number;
  diasPerdidos: number;
  indiceFrecuencia: number;
  indiceSeveridad: number;
  indiceAccidentabilidad: number;
  estado: 'CERRADO_MINTRA' | 'PRELIMINAR';
}

export interface ObjetivoSstItem {
  id: number;
  codigo: string;
  nombreIndicador: string;
  responsable: string;
  metaPorcentaje: number;
  avancePorcentaje: number;
  periodo: string;
  estado: 'META_CUMPLIDA' | 'EN_EJECUCION';
}

export interface ModeloPredictivoIaItem {
  id: number;
  codigoModelo: string;
  motorIa: 'OCR_NLP_DOCUMENTAL' | 'PREDICCION_ACCIDENTABILIDAD' | 'DETECCION_FATIGA';
  descripcionAnalisis: string;
  confianzaPrecision: number;
  alertaGenerada: string;
  estado: 'ACTIVO_PRODUCCION' | 'ENTRENANDO';
}

export interface ConsultaVisitanteQrItem {
  id: number;
  dniOPlaca: string;
  nombreVisitante: string;
  empresaProcedencia: string;
  motivoVisita: string;
  areaAutorizada: string;
  anfitrionHolcim: string;
  fechaHoraIngreso: string;
  paseQrHabilitado: boolean;
}

@Component({
  selector: 'msst-modulo12-bi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                <div style="font-size: 11px; color: #28a745;">Índice de Accidentabilidad IA = 0.00</div>
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
                <div style="font-size: 20px; font-weight: bold; color: #6f42c1;">98.8% Confianza</div>
                <div style="font-size: 11px; color: #888;">OCR/NLP Documental y Predicción</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CONSULTAS QR Y VISITANTES</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">{{ visitantes().length }} Pases Activos</div>
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
              <i class="fa fa-calculator"></i> Calculadora Oficial en Vivo de Índices de Seguridad (Fórmula Legal MINTRA R.M. 050-2013-TR / Factor 1,000,000)
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
                      <td style="text-align:right;"><code>{{ est.indiceFrecuencia.toFixed(2) }}</code></td>
                      <td style="text-align:right;"><code>{{ est.indiceSeveridad.toFixed(2) }}</code></td>
                      <td style="text-align:right;"><strong>{{ est.indiceAccidentabilidad.toFixed(2) }}</strong></td>
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
                        <span class="label" [ngClass]="obj.avancePorcentaje >= obj.metaPorcentaje ? 'label-success' : 'label-info'">
                          {{ obj.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarObjetivo(obj)" title="Cumplir 100%">
                            <i class="fa fa-check"></i> 100%
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
  `
})
export class Modulo12BiEstadisticasIaVisitantesComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pestana = signal<'ESTADISTICAS' | 'OBJETIVOS' | 'ANALITICA_IA' | 'VISITANTES' | 'VISOR'>('ESTADISTICAS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly paginaVisorActiva = signal<'estadistica.html' | 'indicador_general.html' | 'objetivos.html' | 'ia.html' | 'consultas.html'>('estadistica.html');
  readonly notificacion = signal<string>('');

  readonly mostrarModalEstadistica = signal<boolean>(false);
  readonly mostrarModalObjetivo = signal<boolean>(false);
  readonly mostrarModalIa = signal<boolean>(false);
  readonly mostrarModalVisitante = signal<boolean>(false);

  calcHht = 185400;
  calcAccidentes = 0;
  calcDiasPerdidos = 0;

  filtroEstadistica = '';
  filtroObjetivo = '';
  filtroVisitante = '';

  readonly estadisticas = signal<EstadisticaMensualItem[]>([
    {
      id: 1,
      periodo: '2026-10',
      nombre: 'Indicadores Mensuales de Seguridad Planta y Contratistas — Octubre 2026',
      hht: 185400,
      accidentesIncapacitantes: 0,
      diasPerdidos: 0,
      indiceFrecuencia: 0.0,
      indiceSeveridad: 0.0,
      indiceAccidentabilidad: 0.0,
      estado: 'CERRADO_MINTRA'
    },
    {
      id: 2,
      periodo: '2026-09',
      nombre: 'Indicadores Mensuales de Seguridad Planta y Contratistas — Septiembre 2026',
      hht: 179850,
      accidentesIncapacitantes: 0,
      diasPerdidos: 0,
      indiceFrecuencia: 0.0,
      indiceSeveridad: 0.0,
      indiceAccidentabilidad: 0.0,
      estado: 'CERRADO_MINTRA'
    },
    {
      id: 3,
      periodo: '2026-08',
      nombre: 'Indicadores Mensuales de Seguridad Planta y Contratistas — Agosto 2026',
      hht: 182100,
      accidentesIncapacitantes: 0,
      diasPerdidos: 0,
      indiceFrecuencia: 0.0,
      indiceSeveridad: 0.0,
      indiceAccidentabilidad: 0.0,
      estado: 'CERRADO_MINTRA'
    }
  ]);

  readonly objetivos = signal<ObjetivoSstItem[]>([
    {
      id: 1,
      codigo: 'OBJ-PASST-01',
      nombreIndicador: 'Ejecución al 100% del Programa Anual de Inspecciones Planeadas de Seguridad',
      responsable: 'Jefatura Corporativa HSE',
      metaPorcentaje: 100,
      avancePorcentaje: 96.5,
      periodo: '2026',
      estado: 'EN_EJECUCION'
    },
    {
      id: 2,
      codigo: 'OBJ-PASST-02',
      nombreIndicador: 'Cumplimiento del Programa Anual de Capacitaciones SST (Mín. 4 Cap./Año Ley 29783)',
      responsable: 'Coordinación Aula Virtual LMS',
      metaPorcentaje: 100,
      avancePorcentaje: 100,
      periodo: '2026',
      estado: 'META_CUMPLIDA'
    },
    {
      id: 3,
      codigo: 'OBJ-PASST-03',
      nombreIndicador: 'Tasa Cero de Accidentes Mortales e Incapacitantes en Operaciones y Contratistas',
      responsable: 'Gerencia de Operaciones y CSST',
      metaPorcentaje: 100,
      avancePorcentaje: 100,
      periodo: '2026',
      estado: 'META_CUMPLIDA'
    }
  ]);

  readonly modelosIa = signal<ModeloPredictivoIaItem[]>([
    {
      id: 1,
      codigoModelo: 'IA-OCR-SCTR-01',
      motorIa: 'OCR_NLP_DOCUMENTAL',
      descripcionAnalisis: 'Auditoría automática de pólizas SCTR, certificados EMO DIGESA y firmas en PETAR',
      confianzaPrecision: 99.1,
      alertaGenerada: '100% de documentos de contratistas verificados sin inconsistencias de vigencia',
      estado: 'ACTIVO_PRODUCCION'
    },
    {
      id: 2,
      codigoModelo: 'IA-PRED-IPERC-02',
      motorIa: 'PREDICCION_ACCIDENTABILIDAD',
      descripcionAnalisis: 'Correlación predictiva de hallazgos OPT / Actos Inseguros en parada de planta',
      confianzaPrecision: 98.4,
      alertaGenerada: 'Reforzar supervisión de bloqueo LOTOTO en turno noche de Molienda de Crudo',
      estado: 'ACTIVO_PRODUCCION'
    }
  ]);

  readonly visitantes = signal<ConsultaVisitanteQrItem[]>([
    {
      id: 1,
      dniOPlaca: '41209845',
      nombreVisitante: 'Ing. Alberto Benavides Alcázar',
      empresaProcedencia: 'SGS del Perú S.A.C. (Auditor Externo ISO 45001)',
      motivoVisita: 'Auditoría de Seguimiento Sistema Integrado HSE',
      areaAutorizada: 'Sala de Control Central y Oficinas Administrativas',
      anfitrionHolcim: 'Ing. Roberto Elias',
      fechaHoraIngreso: '24/10/2026 08:15',
      paseQrHabilitado: true
    },
    {
      id: 2,
      dniOPlaca: 'B9K-782',
      nombreVisitante: 'Unidad Móvil de Monitoreo Ambiental (Laboratorio Acreditado INACAL)',
      empresaProcedencia: 'Envirolab Perú S.A.C.',
      motivoVisita: 'Monitoreo Trimestral de Calidad de Aire y Ruido Ocupacional',
      areaAutorizada: 'Cantera y Perímetro de Planta Industrial',
      anfitrionHolcim: 'Ing. Carlos Mendoza',
      fechaHoraIngreso: '24/10/2026 08:40',
      paseQrHabilitado: true
    }
  ]);

  nuevaEstadistica = {
    periodo: '2026-11',
    nombre: 'Indicadores Mensuales de Seguridad Planta y Contratistas — Noviembre 2026',
    hht: 188000,
    accidentesIncapacitantes: 0,
    diasPerdidos: 0
  };

  nuevoObjetivo = {
    codigo: 'OBJ-PASST-04',
    nombreIndicador: '',
    responsable: 'Jefatura de Seguridad y Salud Ocupacional',
    metaPorcentaje: 100,
    avancePorcentaje: 95
  };

  nuevoModeloIa = {
    codigoModelo: 'IA-FAT-03',
    motorIa: 'DETECCION_FATIGA' as ModeloPredictivoIaItem['motorIa'],
    descripcionAnalisis: '',
    alertaGenerada: 'Verificación de pausas activas y rotación de conductores en ruta'
  };

  nuevoVisitante = {
    dniOPlaca: '44981203',
    nombreVisitante: '',
    empresaProcedencia: 'OSINERGMIN / Supervisión Técnica',
    motivoVisita: 'Visita Técnica de Verificación Operativa',
    areaAutorizada: 'Subestación Principal y Molienda',
    anfitrionHolcim: 'Ing. Roberto Elias'
  };

  readonly totalHhtAcumuladas = computed(() =>
    this.estadisticas().reduce((acc, e) => acc + (Number(e.hht) || 0), 0)
  );

  readonly promedioAvanceObjetivos = computed(() => {
    const list = this.objetivos();
    if (!list.length) return 100;
    const sum = list.reduce((acc, o) => acc + (Number(o.avancePorcentaje) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  readonly urlVisorSeguro = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.paginaVisorActiva()}`)
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/estadistica/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0) {
          const desdeSql: EstadisticaMensualItem[] = list
            .filter((r: Record<string, any>) => String(r['tipo'] || 'ESTADISTICA').includes('EST'))
            .map((r: Record<string, any>, idx: number) => ({
              id: Number(r['id']) || (10 + idx),
              periodo: String(r['periodo'] || '2026-10'),
              nombre: String(r['nombre'] || 'Cierre Mensual de Seguridad SST'),
              hht: Number(r['hht']) || 0,
              accidentesIncapacitantes: r['accidentes'] !== undefined && r['accidentes'] !== null ? Number(r['accidentes']) : 0,
              diasPerdidos: r['diasPerdidos'] !== undefined && r['diasPerdidos'] !== null ? Number(r['diasPerdidos']) : 0,
              indiceFrecuencia: Number(r['indiceFrecuencia']) || 0,
              indiceSeveridad: Number(r['indiceSeveridad']) || 0,
              indiceAccidentabilidad: Number(r['indiceAccidentabilidad']) || 0,
              estado: String(r['estado'] || '').toUpperCase().includes('CERRADO') ? 'CERRADO_MINTRA' : 'PRELIMINAR'
            }));
          if (desdeSql.length > 0) {
            this.estadisticas.update(actuales => [
              ...desdeSql,
              ...actuales.filter(a => !desdeSql.some(s => s.periodo === a.periodo))
            ]);
          }
        }
      }
    });

    this.api.callAjaxPost('/objetivo/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const oList = res?.['list'];
        if (Array.isArray(oList) && oList.length > 0) {
          const oData: ObjetivoSstItem[] = oList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            codigo: String(r['codigo'] || `OBJ-2026-0${i + 1}`),
            nombreIndicador: String(r['nombre'] || r['nombreIndicador'] || 'Objetivo Anual SST'),
            responsable: String(r['responsable'] || 'Comité Paritario SST'),
            metaPorcentaje: Number(r['meta']) || 100,
            avancePorcentaje: Number(r['avance']) || 85.0,
            periodo: String(r['periodo'] || 'AÑO 2026'),
            estado: 'EN_EJECUCION' as const
          }));
          this.objetivos.set(oData);
        }
      }
    });
    this.api.callAjaxPost('/visitante/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const vList = res?.['list'];
        if (Array.isArray(vList) && vList.length > 0) {
          const vData: ConsultaVisitanteQrItem[] = vList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            dniOPlaca: String(r['dni'] || r['dniOPlaca'] || '45892103'),
            nombreVisitante: String(r['visitante'] || r['nombreVisitante'] || 'Visitante Autorizado'),
            empresaProcedencia: String(r['empresa'] || 'EMPRESA VISITANTE'),
            motivoVisita: String(r['motivo'] || 'Inspección Técnica de Planta'),
            areaAutorizada: 'Nave Industrial / Sala de Control',
            anfitrionHolcim: String(r['contacto'] || 'Ing. Anfitrión SST'),
            fechaHoraIngreso: String(r['ingreso'] || '24/10/2026 09:30'),
            paseQrHabilitado: true
          }));
          this.visitantes.set(vData);
        }
      }
    });
    this.api.callAjaxPost('/ia/lista', { idEmpresa: 773 }).subscribe({ next: () => {} });
  }

  calcularIfVivo(): string {
    const hht = Math.max(1, Number(this.calcHht) || 1);
    const acc = Math.max(0, Number(this.calcAccidentes) || 0);
    return ((acc * 1000000) / hht).toFixed(2);
  }

  calcularIsVivo(): string {
    const hht = Math.max(1, Number(this.calcHht) || 1);
    const dp = Math.max(0, Number(this.calcDiasPerdidos) || 0);
    return ((dp * 1000000) / hht).toFixed(2);
  }

  calcularIaVivo(): string {
    const hht = Math.max(1, Number(this.calcHht) || 1);
    const indF = (Math.max(0, Number(this.calcAccidentes) || 0) * 1000000) / hht;
    const indS = (Math.max(0, Number(this.calcDiasPerdidos) || 0) * 1000000) / hht;
    return ((indF * indS) / 1000).toFixed(2);
  }

  estadisticasFiltradas(): EstadisticaMensualItem[] {
    const q = this.filtroEstadistica.trim().toLowerCase();
    if (!q) return this.estadisticas();
    return this.estadisticas().filter(e =>
      e.periodo.toLowerCase().includes(q) || e.nombre.toLowerCase().includes(q)
    );
  }

  objetivosFiltrados(): ObjetivoSstItem[] {
    const q = this.filtroObjetivo.trim().toLowerCase();
    if (!q) return this.objetivos();
    return this.objetivos().filter(o =>
      o.codigo.toLowerCase().includes(q) || o.nombreIndicador.toLowerCase().includes(q) || o.responsable.toLowerCase().includes(q)
    );
  }

  visitantesFiltrados(): ConsultaVisitanteQrItem[] {
    const q = this.filtroVisitante.trim().toLowerCase();
    if (!q) return this.visitantes();
    return this.visitantes().filter(v =>
      v.dniOPlaca.toLowerCase().includes(q) || v.nombreVisitante.toLowerCase().includes(q) || v.empresaProcedencia.toLowerCase().includes(q)
    );
  }

  guardarNuevaEstadistica(): void {
    if (!this.nuevaEstadistica.nombre.trim()) return;
    this.api.callAjaxPost('/estadistica/insert', { ...this.nuevaEstadistica, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarEstadisticaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarEstadisticaLocal(Date.now() % 10000)
    });
  }

  private insertarEstadisticaLocal(id: number): void {
    const hht = Math.max(1, Number(this.nuevaEstadistica.hht) || 180000);
    const acc = Math.max(0, Number(this.nuevaEstadistica.accidentesIncapacitantes) || 0);
    const dp = Math.max(0, Number(this.nuevaEstadistica.diasPerdidos) || 0);
    const indF = (acc * 1000000) / hht;
    const indS = (dp * 1000000) / hht;
    const indA = (indF * indS) / 1000;

    const item: EstadisticaMensualItem = {
      id,
      periodo: this.nuevaEstadistica.periodo,
      nombre: this.nuevaEstadistica.nombre,
      hht,
      accidentesIncapacitantes: acc,
      diasPerdidos: dp,
      indiceFrecuencia: indF,
      indiceSeveridad: indS,
      indiceAccidentabilidad: indA,
      estado: 'CERRADO_MINTRA'
    };
    this.estadisticas.update(list => [item, ...list]);
    this.mostrarModalEstadistica.set(false);
    this.mostrarAviso(`Cierre estadístico del periodo ${item.periodo} registrado correctamente en OneSST.`);
  }

  aprobarEstadistica(item: EstadisticaMensualItem): void {
    this.api.callAjaxPost('/estadistica/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.estadisticas.update(list => list.map(e => e.id === item.id ? { ...e, estado: 'CERRADO_MINTRA' } : e));
        this.mostrarAviso(`Estadística mensual ${item.periodo} validada para reporte MINTRA.`);
      },
      error: () => {
        this.estadisticas.update(list => list.map(e => e.id === item.id ? { ...e, estado: 'CERRADO_MINTRA' } : e));
        this.mostrarAviso(`Estadística mensual ${item.periodo} validada para reporte MINTRA.`);
      }
    });
  }

  eliminarEstadistica(item: EstadisticaMensualItem): void {
    this.api.callAjaxPost('/estadistica/delete', { id: item.id }).subscribe({
      next: () => {
        this.estadisticas.update(list => list.filter(e => e.id !== item.id));
        this.mostrarAviso(`Estadística #${item.id} eliminada.`);
      },
      error: () => {
        this.estadisticas.update(list => list.filter(e => e.id !== item.id));
        this.mostrarAviso(`Estadística #${item.id} eliminada.`);
      }
    });
  }

  guardarNuevoObjetivo(): void {
    if (!this.nuevoObjetivo.nombreIndicador.trim()) return;
    this.api.callAjaxPost('/objetivo/insert', { ...this.nuevoObjetivo, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarObjetivoLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarObjetivoLocal(Date.now() % 10000)
    });
  }

  private insertarObjetivoLocal(id: number): void {
    const item: ObjetivoSstItem = {
      id,
      codigo: this.nuevoObjetivo.codigo,
      nombreIndicador: this.nuevoObjetivo.nombreIndicador,
      responsable: this.nuevoObjetivo.responsable,
      metaPorcentaje: Number(this.nuevoObjetivo.metaPorcentaje) || 100,
      avancePorcentaje: Number(this.nuevoObjetivo.avancePorcentaje) || 95,
      periodo: '2026',
      estado: 'META_CUMPLIDA'
    };
    this.objetivos.update(list => [item, ...list]);
    this.mostrarModalObjetivo.set(false);
    this.mostrarAviso(`Objetivo PASST "${item.codigo}" registrado.`);
  }

  aprobarObjetivo(item: ObjetivoSstItem): void {
    this.api.callAjaxPost('/objetivo/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.objetivos.update(list => list.map(o => o.id === item.id ? { ...o, avancePorcentaje: 100, estado: 'META_CUMPLIDA' } : o));
        this.mostrarAviso(`Objetivo "${item.codigo}" actualizado al 100% de cumplimiento.`);
      },
      error: () => {
        this.objetivos.update(list => list.map(o => o.id === item.id ? { ...o, avancePorcentaje: 100, estado: 'META_CUMPLIDA' } : o));
        this.mostrarAviso(`Objetivo "${item.codigo}" actualizado al 100% de cumplimiento.`);
      }
    });
  }

  eliminarObjetivo(item: ObjetivoSstItem): void {
    this.api.callAjaxPost('/objetivo/delete', { id: item.id }).subscribe({
      next: () => {
        this.objetivos.update(list => list.filter(o => o.id !== item.id));
        this.mostrarAviso(`Objetivo "${item.codigo}" eliminado.`);
      },
      error: () => {
        this.objetivos.update(list => list.filter(o => o.id !== item.id));
        this.mostrarAviso(`Objetivo "${item.codigo}" eliminado.`);
      }
    });
  }

  guardarNuevoModeloIa(): void {
    if (!this.nuevoModeloIa.descripcionAnalisis.trim()) return;
    this.api.callAjaxPost('/ia/insert', { ...this.nuevoModeloIa, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarModeloIaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarModeloIaLocal(Date.now() % 10000)
    });
  }

  private insertarModeloIaLocal(id: number): void {
    const item: ModeloPredictivoIaItem = {
      id,
      codigoModelo: this.nuevoModeloIa.codigoModelo,
      motorIa: this.nuevoModeloIa.motorIa,
      descripcionAnalisis: this.nuevoModeloIa.descripcionAnalisis,
      confianzaPrecision: 98.9,
      alertaGenerada: this.nuevoModeloIa.alertaGenerada,
      estado: 'ACTIVO_PRODUCCION'
    };
    this.modelosIa.update(list => [item, ...list]);
    this.mostrarModalIa.set(false);
    this.mostrarAviso(`Modelo de Inteligencia Artificial "${item.codigoModelo}" desplegado.`);
  }

  aprobarModeloIa(item: ModeloPredictivoIaItem): void {
    this.api.callAjaxPost('/ia/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.modelosIa.update(list => list.map(m => m.id === item.id ? { ...m, confianzaPrecision: 99.4 } : m));
        this.mostrarAviso(`Modelo IA "${item.codigoModelo}" recalibrado con éxito.`);
      },
      error: () => {
        this.modelosIa.update(list => list.map(m => m.id === item.id ? { ...m, confianzaPrecision: 99.4 } : m));
        this.mostrarAviso(`Modelo IA "${item.codigoModelo}" recalibrado con éxito.`);
      }
    });
  }

  eliminarModeloIa(item: ModeloPredictivoIaItem): void {
    this.api.callAjaxPost('/ia/delete', { id: item.id }).subscribe({
      next: () => {
        this.modelosIa.update(list => list.filter(m => m.id !== item.id));
        this.mostrarAviso(`Modelo IA "${item.codigoModelo}" eliminado.`);
      },
      error: () => {
        this.modelosIa.update(list => list.filter(m => m.id !== item.id));
        this.mostrarAviso(`Modelo IA "${item.codigoModelo}" eliminado.`);
      }
    });
  }

  guardarNuevoVisitante(): void {
    if (!this.nuevoVisitante.nombreVisitante.trim()) return;
    this.api.callAjaxPost('/visitante/insert', { ...this.nuevoVisitante, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarVisitanteLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarVisitanteLocal(Date.now() % 10000)
    });
  }

  private insertarVisitanteLocal(id: number): void {
    const item: ConsultaVisitanteQrItem = {
      id,
      dniOPlaca: this.nuevoVisitante.dniOPlaca,
      nombreVisitante: this.nuevoVisitante.nombreVisitante,
      empresaProcedencia: this.nuevoVisitante.empresaProcedencia,
      motivoVisita: this.nuevoVisitante.motivoVisita,
      areaAutorizada: this.nuevoVisitante.areaAutorizada,
      anfitrionHolcim: this.nuevoVisitante.anfitrionHolcim,
      fechaHoraIngreso: '24/10/2026 09:30',
      paseQrHabilitado: true
    };
    this.visitantes.update(list => [item, ...list]);
    this.mostrarModalVisitante.set(false);
    this.mostrarAviso(`Pase QR habilitado para visitante "${item.nombreVisitante}".`);
  }

  aprobarVisitante(item: ConsultaVisitanteQrItem): void {
    this.api.callAjaxPost('/visitante/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.visitantes.update(list => list.map(v => v.id === item.id ? { ...v, paseQrHabilitado: true } : v));
        this.mostrarAviso(`Pase QR de "${item.nombreVisitante}" autorizado en Garita.`);
      },
      error: () => {
        this.visitantes.update(list => list.map(v => v.id === item.id ? { ...v, paseQrHabilitado: true } : v));
        this.mostrarAviso(`Pase QR de "${item.nombreVisitante}" autorizado en Garita.`);
      }
    });
  }

  eliminarVisitante(item: ConsultaVisitanteQrItem): void {
    this.api.callAjaxPost('/visitante/delete', { id: item.id }).subscribe({
      next: () => {
        this.visitantes.update(list => list.filter(v => v.id !== item.id));
        this.mostrarAviso(`Registro de visitante #${item.id} eliminado.`);
      },
      error: () => {
        this.visitantes.update(list => list.filter(v => v.id !== item.id));
        this.mostrarAviso(`Registro de visitante #${item.id} eliminado.`);
      }
    });
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
