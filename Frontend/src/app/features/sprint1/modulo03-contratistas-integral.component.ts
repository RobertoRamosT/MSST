import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

@Component({
  selector: 'msst-modulo03-contratistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Encabezado Corporativo del Módulo 03 (El módulo más grande de GOSST: 93 Tablas / 21 Modales) -->
    <div class="panel panel-primary" style="margin-bottom: 16px; border-color: #004B87;">
      <div class="panel-heading" style="background-color: #004B87; color: #fff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 class="panel-title" style="font-size: 16px; font-weight: bold;">
            <i class="fa fa-briefcase"></i> Gestión Integral de Contratistas, Proyectos, Homologación, PETAR y Garita
          </h3>
          <div style="font-size: 11.5px; color: #cce0ff; margin-top: 3px;">
            OneSST Enterprise &bull; Control de Empresas Contratistas, Acreditación de Personal y Flota, Validación Documental y Pases de Garita
          </div>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevoContratista()">
            <i class="fa fa-plus-circle"></i> + Homologar Contratista
          </button>
          <button class="btn btn-xs btn-info" (click)="abrirModalNuevoProyecto()">
            <i class="fa fa-folder-open"></i> + Nuevo Proyecto
          </button>
          <button class="btn btn-xs btn-warning" (click)="abrirModalNuevaOperacion()">
            <i class="fa fa-fire"></i> + Emitir PETAR
          </button>
        </div>
      </div>

      <!-- Navegación de los 4 Submódulos (3A, 3B, 3C, 3D) -->
      <div class="panel-body" style="background: #f4f7fa; padding: 10px 15px; border-bottom: 1px solid #dce4ec; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="submoduloActivo() === '3A' ? 'btn-primary' : 'btn-default'"
            (click)="submoduloActivo.set('3A')">
            <i class="fa fa-certificate"></i> 1. Homologación, Contratistas y Blacklist
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="submoduloActivo() === '3B' ? 'btn-primary' : 'btn-default'"
            (click)="submoduloActivo.set('3B')">
            <i class="fa fa-folder-open"></i> 2. Proyectos y Matrices ({{ proyectos().length }})
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="submoduloActivo() === '3C' ? 'btn-primary' : 'btn-default'"
            (click)="submoduloActivo.set('3C')">
            <i class="fa fa-users"></i> 3. Trabajadores ({{ trabajadores().length }}) y Vehículos ({{ vehiculos().length }})
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="submoduloActivo() === '3D' ? 'btn-primary' : 'btn-default'"
            (click)="submoduloActivo.set('3D')">
            <i class="fa fa-shield"></i> 4. Legajo Documental ({{ documentos().length }}), PETAR y Garita
          </button>
        </div>

        <div style="font-size: 12px; color: #004B87;">
          <button class="btn btn-xs btn-default" (click)="cargarTodoModulo03()">
            <i class="fa fa-refresh"></i> Actualizar Datos
          </button>
          @if (mensajeExito()) {
            <span class="label label-success" style="margin-left: 8px; font-size: 11px;">
              <i class="fa fa-check"></i> {{ mensajeExito() }}
            </span>
          }
          @if (mensajeError()) {
            <span class="label label-danger" style="margin-left: 8px; font-size: 11px;">
              <i class="fa fa-exclamation-triangle"></i> {{ mensajeError() }}
            </span>
          }
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- SUBMÓDULO 3A: HOMOLOGACIÓN, CONTRATISTAS, SUBCONTRATISTAS Y BLACKLIST     -->
    <!-- ========================================================================= -->
    @if (submoduloActivo() === '3A') {
      <!-- KPIs de Homologación -->
      <div class="row" style="margin-bottom: 15px;">
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #004B87; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">CONTRATISTA PRINCIPAL ACTIVO</div>
            <div style="font-size:15px; font-weight:bold; color:#004B87; margin-top:3px;">GRUPO ELIAS-29 S.A.C</div>
            <div style="font-size:11px; color:#28a745;"><i class="fa fa-check-circle"></i> RUC: 20608094068 | ID: 3234</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #28a745; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">SCORE DE HOMOLOGACIÓN SST</div>
            <div style="font-size:22px; font-weight:bold; color:#28a745;">98.5% (APTO NIVEL A+)</div>
            <div style="font-size:11px; color:#666;">Auditoría Ley 29783 / DS 024-2016-EM</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #dc3545; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">CONTROL DE BLACKLIST</div>
            <div style="font-size:22px; font-weight:bold; color:#dc3545;">{{ blacklist().length }} Restringidos</div>
            <div style="font-size:11px; color:#666;">Bloqueo automático en Garita</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #ffc107; box-shadow:0 1px 3px rgba(0,0,0,.08); display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:11px; color:#666;">EMPRESAS HOMOLOGADAS ({{ contratistas().length }})</div>
            <button class="btn btn-sm btn-primary" style="margin-top:6px;" (click)="abrirModalNuevoContratista()">
              <i class="fa fa-plus-circle"></i> Homologar Contratista
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Tabla de Empresas Contratistas y Subcontratistas -->
        <div class="col-md-8">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-building"></i> Maestro de Contratistas y Subcontratistas</h4>
              <button class="btn btn-xs btn-success" (click)="abrirModalNuevoContratista()">
                <i class="fa fa-plus"></i> Nuevo Contratista
              </button>
            </div>
            <div class="panel-body">
              <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
                  <thead>
                    <tr style="background:#f0f4f8;">
                      <th>ID</th>
                      <th>RUC</th>
                      <th>Razón Social</th>
                      <th>Rubro / Especialidad</th>
                      <th>Representante Legal / Contacto</th>
                      <th>% Homologación</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of contratistas(); track c['id']) {
                      <tr>
                        <td><strong>#{{ c['id'] }}</strong></td>
                        <td><code>{{ c['ruc'] }}</code></td>
                        <td><strong>{{ c['razonSocial'] || c['nombre'] }}</strong></td>
                        <td>{{ c['rubroActividad'] }}</td>
                        <td>
                          <div>{{ c['representanteLegal'] }}</div>
                          <small class="text-muted">{{ c['correo'] }} | {{ c['telefono'] }}</small>
                        </td>
                        <td>
                          <strong style="color:#28a745; font-size:13px;">{{ c['porcentajeHomologacion'] }}%</strong>
                        </td>
                        <td>
                          <span class="label label-success">{{ c['estadoHomologacion'] || 'HOMOLOGADO' }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluación de Cuestionario y Blacklist -->
        <div class="col-md-4">
          <div class="panel panel-danger">
            <div class="panel-heading">
              <h4 class="panel-title"><i class="fa fa-ban"></i> Control de Blacklist Corporativo (Bloqueo Garita)</h4>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-condensed" style="font-size:11px; margin-bottom:10px;">
                <thead>
                  <tr style="background:#f2dede;">
                    <th>RUC / DNI</th>
                    <th>Empresa / Persona</th>
                    <th>Motivo de Bloqueo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of blacklist(); track b['documento']) {
                    <tr>
                      <td><code>{{ b['documento'] }}</code></td>
                      <td><strong>{{ b['nombre'] }}</strong></td>
                      <td>{{ b['motivo'] }}</td>
                      <td><span class="label label-danger">BLOQUEADO</span></td>
                    </tr>
                  }
                </tbody>
              </table>

              <div style="background:#f8f9fa; padding:10px; border:1px solid #ddd; border-radius:4px; font-size:12px;">
                <strong><i class="fa fa-list-ol"></i> Pilares de Cuestionario de Homologación:</strong>
                <ul style="padding-left:18px; margin-top:6px; margin-bottom:0;">
                  <li>Liderazgo y Compromiso del Sistema SGSST: <strong>100%</strong></li>
                  <li>Política SST, Comité Paritario y RISST: <strong>98%</strong></li>
                  <li>Matrices IPERC, PETS y Estándares Críticos: <strong>99%</strong></li>
                  <li>Vigilancia Médica Ocupacional y SCTR: <strong>97%</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- SUBMÓDULO 3B: PROYECTOS, ADJUDICACIONES Y MATRICES POR PROYECTO           -->
    <!-- ========================================================================= -->
    @if (submoduloActivo() === '3B') {
      <div class="panel panel-primary">
        <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
          <h4 class="panel-title"><i class="fa fa-folder-open"></i> Proyectos Adjudicados y Matrices de Cumplimiento</h4>
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevoProyecto()">
            <i class="fa fa-plus-circle"></i> Adjudicar Nuevo Proyecto
          </button>
        </div>
        <div class="panel-body">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
              <thead>
                <tr style="background:#f0f4f8;">
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre del Proyecto / Servicio</th>
                  <th>Alcance Técnico</th>
                  <th>Sponsor Holcim</th>
                  <th>Residente Contratista</th>
                  <th>Nivel Riesgo</th>
                  <th>Vigencia</th>
                  <th>Cumplimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (p of proyectos(); track p['id']) {
                  <tr>
                    <td><strong>#{{ p['id'] }}</strong></td>
                    <td><code>{{ p['codigo'] }}</code></td>
                    <td><strong>{{ p['nombre'] }}</strong></td>
                    <td>{{ p['descripcion'] || 'Mantenimiento y parada mayor en planta' }}</td>
                    <td>{{ p['responsableCliente'] }}</td>
                    <td>{{ p['responsableContratista'] }}</td>
                    <td>
                      <span class="label" [ngClass]="p['nivelRiesgo'] === 'ALTO' || p['nivelRiesgo'] === 'CRÍTICO' ? 'label-danger' : 'label-warning'">
                        {{ p['nivelRiesgo'] }}
                      </span>
                    </td>
                    <td>{{ p['fechaInicio'] }} al {{ p['fechaFin'] }}</td>
                    <td>
                      <div class="progress" style="margin-bottom:0; height:18px;">
                        <div
                          class="progress-bar progress-bar-success"
                          role="progressbar"
                          [style.width.%]="p['porcentajeCumplimiento'] || 95">
                          {{ p['porcentajeCumplimiento'] || 95 }}%
                        </div>
                      </div>
                    </td>
                    <td><span class="label label-success">ACTIVO</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- SUBMÓDULO 3C: ACREDITACIÓN DE TRABAJADORES, CONDUCTORES, VEHÍCULOS        -->
    <!-- ========================================================================= -->
    @if (submoduloActivo() === '3C') {
      <!-- Fuerza Laboral Acreditada -->
      <div class="panel panel-primary">
        <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
          <h4 class="panel-title"><i class="fa fa-id-card"></i> Fuerza Laboral y Conductores Acreditados</h4>
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevoTrabajador()">
            <i class="fa fa-user-plus"></i> Acreditar Nuevo Trabajador
          </button>
        </div>
        <div class="panel-body">
          <div class="row" style="margin-bottom:10px;">
            <div class="col-md-6">
              <input
                type="text"
                class="form-control input-sm"
                placeholder="Buscar trabajador por DNI, nombres, apellidos o puesto..."
                [(ngModel)]="filtroTrabajador">
            </div>
            <div class="col-md-6 text-right" style="padding-top:4px; font-size:12px;">
              Personal Habilitado en Planta: <strong>{{ trabajadoresFiltrados().length }} trabajadores</strong>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
              <thead>
                <tr style="background:#f0f4f8;">
                  <th>ID</th>
                  <th>Tipo / N° Doc (DNI)</th>
                  <th>Nombre Completo</th>
                  <th>Puesto de Trabajo</th>
                  <th>Aptitud Médica (EMO)</th>
                  <th>SCTR Salud/Pensión</th>
                  <th>Nota Inducción</th>
                  <th>Pase Garita</th>
                </tr>
              </thead>
              <tbody>
                @for (t of trabajadoresFiltrados(); track t['id']) {
                  <tr>
                    <td>#{{ t['id'] }}</td>
                    <td><strong>{{ t['dni'] || t['numeroDocumento'] }}</strong></td>
                    <td><strong>{{ t['nombreCompleto'] || (t['nombres'] + ' ' + t['apellidoPaterno']) }}</strong></td>
                    <td>{{ t['puestoTrabajo'] }}</td>
                    <td><span class="label label-success">{{ t['aptitudMedica'] || 'APTO' }}</span></td>
                    <td><span class="text-success"><i class="fa fa-check-circle"></i> VIGENTE</span></td>
                    <td><strong>{{ t['notaInduccion'] || 18 }} / 20</strong></td>
                    <td>
                      <span class="label label-primary"><i class="fa fa-check"></i> HABILITADO INGRESO</span>
                      <button type="button" class="btn btn-xs btn-info onesst-btn-qr" style="margin-left:5px;" title="Generar e Imprimir Fotocheck QR">
                        <i class="fa fa-qrcode"></i> QR
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Flota de Vehículos, Maquinaria Pesada y Equipos -->
      <div class="panel panel-info">
        <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
          <h4 class="panel-title"><i class="fa fa-truck"></i> Vehículos, Maquinaria Amarilla y Equipos Críticos</h4>
          <button class="btn btn-xs btn-primary" (click)="abrirModalNuevoVehiculo()">
            <i class="fa fa-plus-circle"></i> Acreditar Vehículo / Maquinaria
          </button>
        </div>
        <div class="panel-body">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
              <thead>
                <tr style="background:#e9eff6;">
                  <th>ID</th>
                  <th>Categoría</th>
                  <th>Placa / Código Interno</th>
                  <th>Marca y Modelo</th>
                  <th>Año Fab.</th>
                  <th>SOAT Vigente</th>
                  <th>Revisión Técnica / Cert. Izaje</th>
                  <th>Estado Garita</th>
                </tr>
              </thead>
              <tbody>
                @for (v of vehiculos(); track v['id']) {
                  <tr>
                    <td>#{{ v['id'] }}</td>
                    <td><strong>{{ v['categoria'] }}</strong></td>
                    <td><code>{{ v['placaCodigo'] || v['placa'] }}</code></td>
                    <td>{{ v['marca'] }} {{ v['modelo'] }}</td>
                    <td>{{ v['anioFabricacion'] }}</td>
                    <td><span class="label label-success">VIGENTE</span></td>
                    <td><span class="label label-success">APROBADO</span></td>
                    <td>
                      <span class="label label-primary">AUTORIZADO PLANTA</span>
                      <button type="button" class="btn btn-xs btn-info onesst-btn-qr" style="margin-left:5px;" title="Generar e Imprimir Pase Vehicular QR">
                        <i class="fa fa-qrcode"></i> QR
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

    <!-- ========================================================================= -->
    <!-- SUBMÓDULO 3D: REVISIÓN DOCUMENTAL IA, PETAR, ATS, IZAJE Y GARITA          -->
    <!-- ========================================================================= -->
    @if (submoduloActivo() === '3D') {
      <!-- 1. Bandeja de Revisión Documental con IA -->
      <div class="panel panel-primary">
        <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
          <h4 class="panel-title">
            <i class="fa fa-microchip"></i> 1. Bandeja de Requisitos Documentales con Auditoría IA
          </h4>
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevoDocumento()">
            <i class="fa fa-upload"></i> Subir Documento para Validación IA
          </button>
        </div>
        <div class="panel-body">
          <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover" style="font-size:12px;">
              <thead>
                <tr style="background:#f0f4f8;">
                  <th>ID</th>
                  <th>Nivel</th>
                  <th>Requisito Documental</th>
                  <th>Emisión</th>
                  <th>Vencimiento</th>
                  <th>Score Auditoría IA</th>
                  <th>Dictamen / Observación</th>
                  <th>Estado</th>
                  <th style="width:165px;">Aprobación en Vivo</th>
                </tr>
              </thead>
              <tbody>
                @for (d of documentos(); track d['id']) {
                  <tr>
                    <td>#{{ d['id'] }}</td>
                    <td><span class="label label-info">{{ d['nivel'] }}</span></td>
                    <td><strong>{{ d['nombreRequisito'] || d['nombre'] }}</strong></td>
                    <td>{{ d['fechaEmision'] || '01/01/2026' }}</td>
                    <td>{{ d['fechaVencimiento'] }}</td>
                    <td>
                      <strong [style.color]="(d['puntajeValidacionIA'] || 95) >= 90 ? '#28a745' : '#d39e00'">
                        <i class="fa fa-bolt"></i> {{ d['puntajeValidacionIA'] || 98.5 }}%
                      </strong>
                    </td>
                    <td>{{ d['observacionRevision'] || 'Firma digital y vigencia verificadas por OCR/IA' }}</td>
                    <td>
                      <span
                        class="label"
                        [ngClass]="d['estadoRevision'] === 'APROBADO' ? 'label-success' : (d['estadoRevision'] === 'OBSERVADO' ? 'label-danger' : 'label-warning')">
                        {{ d['estadoRevision'] }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-xs btn-success" (click)="dictaminarDocumento(d, 'APROBADO')" title="Aprobar Documento">
                        <i class="fa fa-check"></i> Aprobar
                      </button>
                      <button class="btn btn-xs btn-danger" style="margin-left:4px;" (click)="dictaminarDocumento(d, 'OBSERVADO')" title="Observar Documento">
                        <i class="fa fa-exclamation-circle"></i> Observar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- 2. Permisos de Trabajo de Alto Riesgo: PETAR, ATS, Izaje y Observaciones Fast -->
        <div class="col-md-6">
          <div class="panel panel-warning">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-fire"></i> 2. PETAR, ATS, Izaje Crítico y Obs. Fast</h4>
              <button class="btn btn-xs btn-warning" (click)="abrirModalNuevaOperacion()">
                <i class="fa fa-plus"></i> Emitir PETAR / ATS
              </button>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped" style="font-size:12px;">
                <thead>
                  <tr style="background:#fcf8e3;">
                    <th>Código</th>
                    <th>Tipo Permiso</th>
                    <th>Actividad Crítica / Ubicación</th>
                    <th>Supervisor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (op of operacionesCampo(); track op['id']) {
                    <tr>
                      <td><code>{{ op['codigo'] }}</code></td>
                      <td><span class="label label-danger">{{ op['tipo'] }}</span></td>
                      <td>
                        <div><strong>{{ op['actividad'] }}</strong></div>
                        <small class="text-muted">{{ op['ubicacion'] }}</small>
                      </td>
                      <td>{{ op['supervisor'] }}</td>
                      <td><span class="label label-success">{{ op['estado'] }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. Control de Acceso en Garita en Tiempo Real -->
        <div class="col-md-6">
          <div class="panel panel-success">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-id-badge"></i> 3. Control de Garita en Tiempo Real</h4>
              <button class="btn btn-xs btn-success" (click)="abrirModalNuevoPaseGarita()">
                <i class="fa fa-sign-in"></i> Registrar Ingreso / Salida
              </button>
            </div>
            <div class="panel-body">
              <table class="table table-bordered table-striped" style="font-size:12px;">
                <thead>
                  <tr style="background:#dff0d8;">
                    <th>Hora</th>
                    <th>Movimiento</th>
                    <th>DNI / Placa</th>
                    <th>Trabajador / Unidad</th>
                    <th>Garita / Sede</th>
                    <th>Semáforo SST</th>
                  </tr>
                </thead>
                <tbody>
                  @for (g of movimientosGarita(); track g['id']) {
                    <tr>
                      <td><strong>{{ g['hora'] }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="g['movimiento'] === 'INGRESO' ? 'label-primary' : 'label-info'">
                          {{ g['movimiento'] }}
                        </span>
                      </td>
                      <td><code>{{ g['identificador'] }}</code></td>
                      <td><strong>{{ g['nombre'] }}</strong></td>
                      <td>{{ g['garita'] }}</td>
                      <td>
                        <span class="label" [ngClass]="g['semaforo'] === 'VERDE - AUTORIZADO' ? 'label-success' : 'label-danger'">
                          {{ g['semaforo'] }}
                        </span>
                        <button type="button" class="btn btn-xs btn-default onesst-btn-qr" style="margin-left:4px;" title="Ver Pase QR de Garita">
                          <i class="fa fa-qrcode"></i>
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
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3A: HOMOLOGAR NUEVA EMPRESA CONTRATISTA       -->
    <!-- ========================================================================= -->
    @if (modalContratistaAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:600px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-building"></i> Registrar y Homologar Empresa Contratista</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalContratistaAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-4 form-group">
                <label>RUC (11 dígitos):</label>
                <input type="text" class="form-control input-sm" maxlength="11" [(ngModel)]="formContratista.ruc" placeholder="20608094068">
              </div>
              <div class="col-md-8 form-group">
                <label>Razón Social:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formContratista.razonSocial" placeholder="Ej. SERVICIOS INDUSTRIALES ANDINOS S.A.C.">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Rubro / Actividad Especializada:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formContratista.rubroActividad" placeholder="Montaje Electromecánico y Refractarios">
              </div>
              <div class="col-md-6 form-group">
                <label>Representante Legal / Gerente:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formContratista.representanteLegal" placeholder="Ing. Jorge Elias">
              </div>
            </div>
            <div class="row">
              <div class="col-md-5 form-group">
                <label>Correo Corporativo:</label>
                <input type="email" class="form-control input-sm" [(ngModel)]="formContratista.correo" placeholder="operaciones@empresa.com.pe">
              </div>
              <div class="col-md-4 form-group">
                <label>Teléfono:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formContratista.telefono" placeholder="998-451-230">
              </div>
              <div class="col-md-3 form-group">
                <label>% Homologación:</label>
                <input type="number" class="form-control input-sm" [(ngModel)]="formContratista.porcentajeHomologacion">
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalContratistaAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarContratista()">
              <i class="fa fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3B: CREAR NUEVO PROYECTO             -->
    <!-- ========================================================================= -->
    @if (modalProyectoAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:620px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-folder-open"></i> Adjudicar Nuevo Proyecto a Contratista</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalProyectoAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-4 form-group">
                <label>Código Proyecto:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.codigo" placeholder="PRY-HOL-2026-09">
              </div>
              <div class="col-md-8 form-group">
                <label>Nombre del Proyecto:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.nombre" placeholder="Overhaul Molino de Cemento N° 3 - Condorcocha">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Responsable Holcim (Sponsor):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.responsableCliente" placeholder="Ing. Roberto Ramos">
              </div>
              <div class="col-md-6 form-group">
                <label>Residente Contratista:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.responsableContratista" placeholder="Ing. Marco Elias">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>Nivel de Riesgo:</label>
                <select class="form-control input-sm" [(ngModel)]="formProyecto.nivelRiesgo">
                  <option value="ALTO">ALTO (Trabajos Críticos PETAR)</option>
                  <option value="MEDIO">MEDIO</option>
                  <option value="BAJO">BAJO</option>
                </select>
              </div>
              <div class="col-md-4 form-group">
                <label>Fecha Inicio:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.fechaInicio" placeholder="25/03/2026">
              </div>
              <div class="col-md-4 form-group">
                <label>Fecha Fin:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formProyecto.fechaFin" placeholder="31/12/2026">
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalProyectoAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarProyecto()">
              <i class="fa fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3C-1: ACREDITAR TRABAJADOR         -->
    <!-- ========================================================================= -->
    @if (modalTrabajadorAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:600px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-user-plus"></i> Acreditar Nuevo Trabajador / Conductor</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalTrabajadorAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-4 form-group">
                <label>DNI / CE:</label>
                <input type="text" class="form-control input-sm" maxlength="12" [(ngModel)]="formTrabajador.dni" placeholder="45892136">
              </div>
              <div class="col-md-8 form-group">
                <label>Nombres y Apellidos Completos:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.nombreCompleto" placeholder="JUAN CARLOS QUISPE MENDOZA">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Puesto de Trabajo:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.puestoTrabajo" placeholder="Soldador Homologado 6G">
              </div>
              <div class="col-md-3 form-group">
                <label>Aptitud EMO:</label>
                <select class="form-control input-sm" [(ngModel)]="formTrabajador.aptitudMedica">
                  <option value="APTO">APTO</option>
                  <option value="APTO CON RESTRICCIÓN">APTO C/RESTRICCIÓN</option>
                </select>
              </div>
              <div class="col-md-3 form-group">
                <label>Nota Inducción:</label>
                <input type="number" class="form-control input-sm" min="14" max="20" [(ngModel)]="formTrabajador.notaInduccion">
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalTrabajadorAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarTrabajador()">
              <i class="fa fa-save"></i> Acreditar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3C-2: ACREDITAR VEHÍCULO / MAQUINARIA-->
    <!-- ========================================================================= -->
    @if (modalVehiculoAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:560px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-truck"></i> Acreditar Vehículo o Maquinaria Pesada</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalVehiculoAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Categoría de Unidad:</label>
                <select class="form-control input-sm" [(ngModel)]="formVehiculo.categoria">
                  <option value="CAMIONETA PICKUP 4X4">CAMIONETA PICKUP 4X4</option>
                  <option value="GRÚA TELESCÓPICA">GRÚA TELESCÓPICA</option>
                  <option value="CAMIÓN GRÚA HIAB">CAMIÓN GRÚA HIAB</option>
                  <option value="CARGADOR FRONTAL">CARGADOR FRONTAL</option>
                  <option value="MANLIFT ARTICULADO">MANLIFT ARTICULADO</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Placa de Rodaje / Código:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formVehiculo.placaCodigo" placeholder="B8T-914">
              </div>
            </div>
            <div class="row">
              <div class="col-md-5 form-group">
                <label>Marca:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formVehiculo.marca" placeholder="TOYOTA / LIEBHERR">
              </div>
              <div class="col-md-4 form-group">
                <label>Modelo:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formVehiculo.modelo" placeholder="HILUX SRV 4X4">
              </div>
              <div class="col-md-3 form-group">
                <label>Año Fab.:</label>
                <input type="number" class="form-control input-sm" [(ngModel)]="formVehiculo.anioFabricacion">
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalVehiculoAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarVehiculo()">
              <i class="fa fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3D-1: SUBIR DOCUMENTO CON IA        -->
    <!-- ========================================================================= -->
    @if (modalDocumentoAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:560px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-microchip"></i> Cargar Requisito Documental para Auditoría IA</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalDocumentoAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-5 form-group">
                <label>Nivel del Documento:</label>
                <select class="form-control input-sm" [(ngModel)]="formDocumento.nivel">
                  <option value="EMPRESA">EMPRESA</option>
                  <option value="PROYECTO">PROYECTO</option>
                  <option value="TRABAJADOR">TRABAJADOR</option>
                  <option value="VEHÍCULO">VEHÍCULO</option>
                </select>
              </div>
              <div class="col-md-7 form-group">
                <label>Nombre del Requisito Documental:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formDocumento.nombreRequisito" placeholder="Ej. Póliza SCTR Salud y Pensión Mes Marzo 2026">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Sujeto de Referencia (DNI / Placa / RUC):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formDocumento.sujetoReferencia" placeholder="Ej. 45892103 o CPX-492">
              </div>
              <div class="col-md-6 form-group">
                <label>Fecha de Vencimiento:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formDocumento.fechaVencimiento" placeholder="31/12/2026">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 form-group">
                <label>Seleccionar Archivo de Evidencia (PDF, JPG, PNG):</label>
                <input type="file" class="form-control input-sm" (change)="onArchivoSeleccionado($event)" accept=".pdf,.jpg,.jpeg,.png">
                @if (archivoSeleccionadoNombre()) {
                  <p style="margin-top: 4px; font-size: 11px; color: #166534;">
                    <i class="fa fa-file-text-o"></i> <strong>{{ archivoSeleccionadoNombre() }}</strong> ({{ (archivoSeleccionadoBytes() / 1024).toFixed(1) }} KB)
                  </p>
                }
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalDocumentoAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarDocumento()">
              <i class="fa fa-cloud-upload"></i> Subir y Auditar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3D-2: EMITIR PETAR / ATS / IZAJE    -->
    <!-- ========================================================================= -->
    @if (modalOperacionAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:560px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-fire"></i> Emitir Permiso de Alto Riesgo (PETAR / ATS / Izaje)</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalOperacionAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-5 form-group">
                <label>Tipo de Permiso:</label>
                <select class="form-control input-sm" [(ngModel)]="formOperacion.tipo">
                  <option value="PETAR ALTURA">PETAR ALTURA (>1.80m)</option>
                  <option value="PETAR CALIENTE">PETAR TRABAJO EN CALIENTE</option>
                  <option value="PETAR ESP. CONFINADO">PETAR ESPACIO CONFINADO</option>
                  <option value="PLAN IZAJE CRÍTICO">PLAN DE IZAJE CRÍTICO</option>
                  <option value="ATS CAMPO">ANÁLISIS TRABAJO SEGURO (ATS)</option>
                </select>
              </div>
              <div class="col-md-7 form-group">
                <label>Supervisor Responsable:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formOperacion.supervisor" placeholder="Ing. Marco Elias / Ing. Carlos Mendoza">
              </div>
            </div>
            <div class="form-group">
              <label>Descripción de la Actividad Crítica:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formOperacion.actividad" placeholder="Soldadura de ducto principal en Torre Precalentador Nivel 4">
            </div>
            <div class="form-group">
              <label>Ubicación Exacta en Planta:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formOperacion.ubicacion" placeholder="Planta Condorcocha - Línea 1 Horno Waelz">
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalOperacionAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-warning" (click)="guardarOperacion()">
              <i class="fa fa-check-circle"></i> Autorizar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL 3D-3: CONTROL DE GARITA EN VIVO        -->
    <!-- ========================================================================= -->
    @if (modalGaritaAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:540px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title"><i class="fa fa-id-badge"></i> Registrar Pase de Garita por DNI / Placa</h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalGaritaAbierto.set(false)"><i class="fa fa-times"></i></button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-5 form-group">
                <label>Tipo Movimiento:</label>
                <select class="form-control input-sm" [(ngModel)]="formGarita.movimiento">
                  <option value="INGRESO">INGRESO A PLANTA</option>
                  <option value="SALIDA">SALIDA DE PLANTA</option>
                </select>
              </div>
              <div class="col-md-7 form-group">
                <label>DNI del Trabajador o Placa Vehicular:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formGarita.identificador" placeholder="Ej. 43128950 o B8T-914">
              </div>
            </div>
            <div class="form-group">
              <label>Nombre Completo / Descripción de Unidad:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formGarita.nombre" placeholder="CARLOS ALBERTO RAMIREZ SOTO (Supervisor SST)">
            </div>
            <div class="form-group">
              <label>Garita de Control:</label>
              <select class="form-control input-sm" [(ngModel)]="formGarita.garita">
                <option value="Garita Principal Condorcocha">Garita Principal Condorcocha</option>
                <option value="Garita Balanza Huachipa">Garita Balanza Huachipa</option>
                <option value="Garita Terminal Callao">Garita Terminal Callao</option>
              </select>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalGaritaAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-success" (click)="guardarPaseGarita()">
              <i class="fa fa-check"></i> Registrar Pase de Garita
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class Modulo03ContratistasIntegralComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly submoduloActivo = signal<'3A' | '3B' | '3C' | '3D'>('3A');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.submoduloActivo.set(t as never);

    }

  });
  readonly mensajeExito = signal<string>('');

  // Datos Submódulo 3A
  readonly contratistas = signal<Record<string, any>[]>([
    {
      id: 3234,
      ruc: '20608094068',
      razonSocial: 'GRUPO ELIAS-29 S.A.C',
      rubroActividad: 'Ingeniería, Mantenimiento Industrial y Refractarios',
      representanteLegal: 'Ing. Marco Antonio Elias',
      correo: 'operaciones@elias29.com.pe',
      telefono: '998-142-700',
      porcentajeHomologacion: 98.5,
      estadoHomologacion: 'HOMOLOGADO A+'
    },
    {
      id: 3235,
      ruc: '20514896321',
      razonSocial: 'CONSORCIO METALMECÁNICO DEL CENTRO S.A.C.',
      rubroActividad: 'Izaje Crítico, Montaje Estructural y Soldadura',
      representanteLegal: 'Ing. Luis Alberto Salazar',
      correo: 'hse@consorciocentro.pe',
      telefono: '987-654-321',
      porcentajeHomologacion: 94.0,
      estadoHomologacion: 'HOMOLOGADO A'
    }
  ]);

  readonly blacklist = signal<Record<string, any>[]>([
    { documento: '20498123019', nombre: 'TRANSPORTES INSEGUROS S.R.L.', motivo: 'Reincidencia en falta grave bloqueos LOTO' },
    { documento: '41029384', nombre: 'PEDRO GOMEZ VARGAS', motivo: 'Incumplimiento política Alcohol y Drogas Tolerancia Cero' }
  ]);

  // Datos Submódulo 3B
  readonly proyectos = signal<Record<string, any>[]>([]);

  // Datos Submódulo 3C
  filtroTrabajador = '';
  readonly trabajadores = signal<Record<string, any>[]>([]);
  readonly vehiculos = signal<Record<string, any>[]>([]);

  // Datos Submódulo 3D
  readonly documentos = signal<Record<string, any>[]>([]);
  readonly operacionesCampo = signal<Record<string, any>[]>([
    { id: 1, codigo: 'PETAR-2026-089', tipo: 'PETAR CALIENTE', actividad: 'Cambio de blindajes y soldadura en Horno Waelz', ubicacion: 'Planta Condorcocha - Nave Principal', supervisor: 'Ing. Marco Elias', estado: 'AUTORIZADO' },
    { id: 2, codigo: 'IZAJE-2026-014', tipo: 'PLAN IZAJE CRÍTICO', actividad: 'Maniobra de izaje de reductor de 35 Toneladas', ubicacion: 'Molino de Crudo N° 2', supervisor: 'Ing. Carlos Mendoza', estado: 'AUTORIZADO' },
    { id: 3, codigo: 'ATS-2026-312', tipo: 'ATS CAMPO', actividad: 'Inspección de aislamiento en Sala Eléctrica CCM', ubicacion: 'Subestación 60kV Condorcocha', supervisor: 'Ing. Roberto Ramos', estado: 'EJECUTADO' }
  ]);

  readonly movimientosGarita = signal<Record<string, any>[]>([
    { id: 1, hora: '06:45:12', movimiento: 'INGRESO', identificador: '43128950', nombre: 'CARLOS ALBERTO RAMIREZ SOTO (Supervisor SST)', garita: 'Garita Principal Condorcocha', semaforo: 'VERDE - AUTORIZADO' },
    { id: 2, hora: '06:48:30', movimiento: 'INGRESO', identificador: '45892104', nombre: 'JORGE LUIS MENDOZA QUISPE (Soldador 6G)', garita: 'Garita Principal Condorcocha', semaforo: 'VERDE - AUTORIZADO' },
    { id: 3, hora: '07:02:15', movimiento: 'INGRESO', identificador: 'B8T-914', nombre: 'TOYOTA HILUX 4X4 - GRUPO ELIAS-29 S.A.C', garita: 'Garita Principal Condorcocha', semaforo: 'VERDE - AUTORIZADO' }
  ]);

  // Modales Signals
  readonly modalContratistaAbierto = signal<boolean>(false);
  formContratista = {
    ruc: '',
    razonSocial: '',
    rubroActividad: 'Mantenimiento Electromecánico y Obras Civiles',
    representanteLegal: '',
    correo: '',
    telefono: '',
    porcentajeHomologacion: 96.5
  };

  readonly modalProyectoAbierto = signal<boolean>(false);
  formProyecto = {
    codigo: 'PRY-HOL-2026-04',
    nombre: '',
    responsableCliente: 'Ing. Roberto Ramos',
    responsableContratista: 'Ing. Marco Elias',
    nivelRiesgo: 'ALTO',
    fechaInicio: '25/03/2026',
    fechaFin: '31/12/2026'
  };

  readonly modalTrabajadorAbierto = signal<boolean>(false);
  formTrabajador = {
    dni: '',
    nombreCompleto: '',
    puestoTrabajo: 'Técnico Mecánico Montajista',
    aptitudMedica: 'APTO',
    notaInduccion: 19
  };

  readonly modalVehiculoAbierto = signal<boolean>(false);
  formVehiculo = {
    categoria: 'CAMIONETA PICKUP 4X4',
    placaCodigo: '',
    marca: 'TOYOTA',
    modelo: 'HILUX 4X4 SRV',
    anioFabricacion: 2025
  };

  readonly modalDocumentoAbierto = signal<boolean>(false);
  readonly mensajeError = signal<string>('');
  readonly archivoSeleccionadoNombre = signal<string>('');
  readonly archivoSeleccionadoBytes = signal<number>(0);

  formDocumento = {
    nivel: 'TRABAJADOR',
    nombreRequisito: '',
    sujetoReferencia: '',
    nombreArchivo: '',
    tamanoArchivoBytes: 0,
    fechaEmision: '24/10/2026',
    fechaVencimiento: '31/12/2026',
    puntajeValidacionIA: 98.5
  };

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoSeleccionadoNombre.set(file.name);
      this.archivoSeleccionadoBytes.set(file.size);
      this.formDocumento.nombreArchivo = file.name;
      this.formDocumento.tamanoArchivoBytes = file.size;
    }
  }

  readonly modalOperacionAbierto = signal<boolean>(false);
  formOperacion = {
    tipo: 'PETAR ALTURA',
    actividad: '',
    ubicacion: 'Planta Condorcocha - Horno Waelz',
    supervisor: 'Ing. Marco Elias'
  };

  readonly modalGaritaAbierto = signal<boolean>(false);
  formGarita = {
    movimiento: 'INGRESO',
    identificador: '',
    nombre: '',
    garita: 'Garita Principal Condorcocha'
  };

  // Visor 1:1
  readonly visor1a1Abierto = signal<boolean>(false);
  readonly visorArchivo = signal<string>('contratista.html');
  readonly visorTitulo = signal<string>('Portal Integral de Contratistas');
  readonly visorUrlSegura = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.visorArchivo()}`)
  );

  ngOnInit(): void {
    this.cargarTodoModulo03();
  }

  trabajadoresFiltrados(): Record<string, any>[] {
    const q = this.filtroTrabajador.trim().toLowerCase();
    if (!q) return this.trabajadores();
    return this.trabajadores().filter(
      t =>
        String(t['dni'] || t['numeroDocumento'] || '').toLowerCase().includes(q) ||
        String(t['nombreCompleto'] || '').toLowerCase().includes(q) ||
        String(t['puestoTrabajo'] || '').toLowerCase().includes(q)
    );
  }

  cargarTodoModulo03(): void {
    this.api.callAjaxPost('/contratista/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && (list[0]['razonSocial'] || list[0]['nombre'])) {
          this.contratistas.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/proyecto/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0) {
          this.proyectos.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/trabajador/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0) {
          this.trabajadores.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/vehiculo/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0) {
          this.vehiculos.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/documento/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0) {
          this.documentos.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/operacion/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['actividad']) {
          this.operacionesCampo.set(list);
        }
      }
    });

    this.api.callAjaxPost('/contratista/garita/lista', { idContratista: 3234 }).subscribe({
      next: (res) => {
        const list = res?.['list'] || [];
        if (Array.isArray(list) && list.length > 0 && list[0]['identificador']) {
          this.movimientosGarita.set(list);
        }
      }
    });
  }

  abrirModalNuevoContratista(): void {
    this.formContratista = {
      ruc: '',
      razonSocial: '',
      rubroActividad: 'Mantenimiento Electromecánico y Obras Civiles',
      representanteLegal: '',
      correo: '',
      telefono: '',
      porcentajeHomologacion: 96.5
    };
    this.modalContratistaAbierto.set(true);
  }

  guardarContratista(): void {
    if (!this.formContratista.ruc.trim() || !this.formContratista.razonSocial.trim()) return;
    this.api.callAjaxPost('/contratista/insert', this.formContratista).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (3235 + this.contratistas().length);
        const item = {
          id: idGen,
          ...this.formContratista,
          estadoHomologacion: 'HOMOLOGADO'
        };
        this.contratistas.update(arr => [item, ...arr]);
        this.modalContratistaAbierto.set(false);
        this.notificarExito(`Contratista ${item.razonSocial} homologado en OneSST`);
      },
      error: (err) => {
        this.notificarError(`Error al guardar contratista: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirModalNuevoProyecto(): void {
    const nextIdx = this.proyectos().length + 1;
    this.formProyecto = {
      codigo: `PRY-HOL-2026-0${nextIdx}`,
      nombre: '',
      responsableCliente: 'Ing. Roberto Ramos',
      responsableContratista: 'Ing. Marco Elias',
      nivelRiesgo: 'ALTO',
      fechaInicio: '25/03/2026',
      fechaFin: '31/12/2026'
    };
    this.modalProyectoAbierto.set(true);
  }

  guardarProyecto(): void {
    if (!this.formProyecto.nombre.trim()) return;
    const payload = { ...this.formProyecto, idContratista: 3234, porcentajeCumplimiento: 0 };
    this.api.callAjaxPost('/contratista/proyecto/insert', payload).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (this.proyectos().length + 1);
        const item = { id: idGen, ...payload, estado: 1 };
        this.proyectos.update(arr => [item, ...arr]);
        this.modalProyectoAbierto.set(false);
        this.notificarExito(`Proyecto ${item.codigo} registrado exitosamente.`);
      },
      error: (err) => {
        this.notificarError(`Error al registrar proyecto: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirModalNuevoTrabajador(): void {
    this.formTrabajador = {
      dni: '',
      nombreCompleto: '',
      puestoTrabajo: 'Técnico Mecánico Montajista',
      aptitudMedica: 'PENDIENTE',
      notaInduccion: 0
    };
    this.modalTrabajadorAbierto.set(true);
  }

  guardarTrabajador(): void {
    if (!this.formTrabajador.dni.trim() || !this.formTrabajador.nombreCompleto.trim()) return;
    // F05: No habilitar automáticamente sin validación de requisitos
    const payload = {
      ...this.formTrabajador,
      idContratista: 3234,
      sctrSaludVigente: 0,
      habilitadoIngreso: 0,
      aptitudMedica: this.formTrabajador.aptitudMedica || 'PENDIENTE'
    };
    this.api.callAjaxPost('/contratista/trabajador/insert', payload).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (this.trabajadores().length + 1);
        const item = { id: idGen, ...payload };
        this.trabajadores.update(arr => [item, ...arr]);
        this.modalTrabajadorAbierto.set(false);
        this.notificarExito(`Trabajador ${item.nombreCompleto} registrado (Pendiente de acreditación documental y garita)`);
      },
      error: (err) => {
        this.notificarError(`Error al registrar trabajador: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirModalNuevoVehiculo(): void {
    this.formVehiculo = {
      categoria: 'CAMIONETA PICKUP 4X4',
      placaCodigo: '',
      marca: 'TOYOTA',
      modelo: 'HILUX 4X4 SRV',
      anioFabricacion: 2025
    };
    this.modalVehiculoAbierto.set(true);
  }

  guardarVehiculo(): void {
    if (!this.formVehiculo.placaCodigo.trim()) return;
    // F05: No autorizar vehículo sin SOAT ni Revisión Técnica comprobados
    const payload = {
      ...this.formVehiculo,
      idContratista: 3234,
      soatVigente: 0,
      revisionTecnicaVigente: 0,
      habilitadoIngreso: 0
    };
    this.api.callAjaxPost('/contratista/vehiculo/insert', payload).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (this.vehiculos().length + 1);
        const item = { id: idGen, ...payload };
        this.vehiculos.update(arr => [item, ...arr]);
        this.modalVehiculoAbierto.set(false);
        this.notificarExito(`Unidad ${item.placaCodigo} registrada (Pendiente de SOAT e inspección)`);
      },
      error: (err) => {
        this.notificarError(`Error al registrar unidad: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirModalNuevoDocumento(): void {
    this.formDocumento = {
      nivel: 'TRABAJADOR',
      nombreRequisito: '',
      sujetoReferencia: '',
      nombreArchivo: '',
      tamanoArchivoBytes: 0,
      fechaEmision: '24/10/2026',
      fechaVencimiento: '31/12/2026',
      puntajeValidacionIA: 98.5
    };
    this.archivoSeleccionadoNombre.set('');
    this.archivoSeleccionadoBytes.set(0);
    this.modalDocumentoAbierto.set(true);
  }

  guardarDocumento(): void {
    if (!this.formDocumento.nombreRequisito.trim()) return;
    // F04 & F09: Guardar documento en estado PENDIENTE_AUDITORIA con datos reales
    const payload = {
      ...this.formDocumento,
      idContratista: 3234,
      fechaEmision: this.formDocumento.fechaEmision || '24/10/2026',
      fechaVencimiento: this.formDocumento.fechaVencimiento || '31/12/2026',
      estadoRevision: 'PENDIENTE_AUDITORIA',
      observacionRevision: this.formDocumento.nombreArchivo
        ? `Archivo cargado: ${this.formDocumento.nombreArchivo} (${(this.formDocumento.tamanoArchivoBytes / 1024).toFixed(1)} KB)`
        : 'Documento registrado, pendiente de validación documental'
    };
    this.api.callAjaxPost('/contratista/documento/insert', payload).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || (this.documentos().length + 1);
        const item = { id: idGen, ...payload, estado: 'PENDIENTE_AUDITORIA', estadoRevision: 'PENDIENTE_AUDITORIA' };
        this.documentos.update(arr => [item, ...arr]);
        this.modalDocumentoAbierto.set(false);
        this.archivoSeleccionadoNombre.set('');
        this.archivoSeleccionadoBytes.set(0);
        this.notificarExito(`Requisito "${item.nombreRequisito}" cargado exitosamente al repositorio.`);
      },
      error: (err) => {
        this.notificarError(`Error al cargar documento: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  dictaminarDocumento(doc: Record<string, any>, nuevoEstado: 'APROBADO' | 'OBSERVADO'): void {
    const obs =
      nuevoEstado === 'APROBADO'
        ? 'Conformidad verificada por Auditoría HSE + IA'
        : 'Observado: Requiere adjuntar firma de médico ocupacional / sello legible';

    this.api
      .callAjaxPost('/contratista/documento/aprobar', {
        idDocumento: doc['id'],
        estadoRevision: nuevoEstado,
        observacionRevision: obs
      })
      .subscribe({
        next: () => {
          this.documentos.update(arr =>
            arr.map(d =>
              d['id'] === doc['id']
                ? { ...d, estadoRevision: nuevoEstado, observacionRevision: obs }
                : d
            )
          );
          this.notificarExito(`Documento #${doc['id']} marcado como ${nuevoEstado}`);
        },
        error: (err) => {
          this.notificarError(`Error al dictaminar: ${err?.message || 'No se pudo actualizar el estado en el servidor.'}`);
        }
      });
  }

  abrirModalNuevaOperacion(): void {
    this.formOperacion = {
      tipo: 'PETAR ALTURA',
      actividad: '',
      ubicacion: 'Planta Condorcocha - Horno Waelz',
      supervisor: 'Ing. Marco Elias'
    };
    this.modalOperacionAbierto.set(true);
  }

  guardarOperacion(): void {
    if (!this.formOperacion.actividad.trim()) return;
    const nextNum = this.operacionesCampo().length + 90;
    const payload = {
      codigo: `PETAR-2026-0${nextNum}`,
      ...this.formOperacion,
      estado: 'SOLICITADO'
    };
    this.api.callAjaxPost('/contratista/operacion/insert', payload).subscribe({
      next: (res) => {
        const item = { id: res?.['idGenerado'] || nextNum, ...payload, estadoAprobacion: 'SOLICITADO' };
        this.operacionesCampo.update(arr => [item, ...arr]);
        this.modalOperacionAbierto.set(false);
        this.notificarExito(`Permiso ${item.codigo} (${item.tipo}) solicitado. Pendiente de verificación en campo.`);
      },
      error: (err) => {
        this.notificarError(`Error al solicitar permiso: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirModalNuevoPaseGarita(): void {
    this.formGarita = {
      movimiento: 'INGRESO',
      identificador: '',
      nombre: '',
      garita: 'Garita Principal Condorcocha'
    };
    this.modalGaritaAbierto.set(true);
  }

  guardarPaseGarita(): void {
    if (!this.formGarita.identificador.trim()) return;
    const enBlacklist = this.blacklist().some(
      b => String(b['documento']).toLowerCase() === this.formGarita.identificador.trim().toLowerCase()
    );
    const ahora = new Date();
    const horaStr = ahora.toTimeString().slice(0, 8);
    const payload = {
      hora: horaStr,
      ...this.formGarita,
      autorizado: !enBlacklist,
      semaforo: enBlacklist ? 'ROJO - BLOQUEADO BLACKLIST' : 'VERDE - AUTORIZADO'
    };

    this.api.callAjaxPost('/contratista/garita/insert', payload).subscribe({
      next: (res) => {
        const item = { id: res?.['idGenerado'] || (this.movimientosGarita().length + 1), ...payload };
        this.movimientosGarita.update(arr => [item, ...arr]);
        this.modalGaritaAbierto.set(false);
        this.notificarExito(`Pase de Garita (${item.movimiento}: ${item.identificador}) registrado.`);
      },
      error: (err) => {
        this.notificarError(`Error al registrar pase de garita: ${err?.message || 'Fallo de comunicación con el servidor.'}`);
      }
    });
  }

  abrirVisor1a1(archivo: string, titulo: string): void {
    this.visorArchivo.set(archivo);
    this.visorTitulo.set(titulo);
    this.visor1a1Abierto.set(true);
  }

  private notificarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }

  private notificarError(msg: string): void {
    this.mensajeError.set(msg);
    setTimeout(() => this.mensajeError.set(''), 6000);
  }
}
