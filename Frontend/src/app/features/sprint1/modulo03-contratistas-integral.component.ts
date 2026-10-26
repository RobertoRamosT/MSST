import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { apiErrorMessage, GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EvidenceApiService, WorkflowApiService, WorkflowSnapshot, IntentKeys, asObject, isGuid, isSafeId } from '../../core/services/workflow-api.service';

export function readM03ConfirmedRecord(raw:Record<string,any>,requestId:string,expectedId?:number):Record<string,any> {
  if(typeof raw['requestId']!=='string'||raw['requestId'].toLowerCase()!==requestId.toLowerCase())throw new Error('El recibo corresponde a otra solicitud.');
  const snapshot=asObject(raw['snapshot']),record=asObject(snapshot['record']);
  if(typeof snapshot['version']!=='string'||!snapshot['version']||!isSafeId(record['id'])||
    (expectedId!==undefined&&record['id']!==expectedId))throw new Error('No se confirmó el registro y su versión. Conserve los datos y consulte antes de repetir.');
  return {...record,version:snapshot['version']};
}

@Component({
  selector: 'msst-modulo03-contratistas',
  standalone: true,
  imports: [QueryPagesComponent,CommonModule, FormsModule],
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
            <i class="fa fa-plus-circle"></i> + Registrar Contratista
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
            <div style="font-size:11px; color:#666;">CONTRATISTAS CONSULTADOS</div>
            <div style="font-size:15px; font-weight:bold; color:#004B87; margin-top:3px;">{{ contratistas().length }} Registros</div>
            <div style="font-size:11px; color:#28a745;"><i class="fa fa-check-circle"></i> Ámbito de su sesión autorizada</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #28a745; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">EVALUACIÓN DE HOMOLOGACIÓN</div>
            <div style="font-size:22px; font-weight:bold; color:#28a745;">Consultar expediente</div>
            <div style="font-size:11px; color:#666;">Requisitos, evidencias y resultado registrado</div>
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
            <div style="font-size:11px; color:#666;">CONTRATISTAS REGISTRADAS ({{ contratistas().length }})</div>
            <button class="btn btn-sm btn-primary" style="margin-top:6px;" (click)="abrirModalNuevoContratista()">
              <i class="fa fa-plus-circle"></i> Registrar Contratista
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
                          <strong style="color:#28a745; font-size:13px;">{{ c['porcentajeHomologacion'] === null || c['porcentajeHomologacion'] === undefined ? 'Sin evaluación registrada' : c['porcentajeHomologacion'] + '%' }}</strong>
                        </td>
                        <td>
                          <span class="label label-success">{{ c['estadoHomologacion'] ?? 'Sin resultado de homologación' }}</span>
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
                <strong>Requisitos de homologación</strong>
                <p>Consulte el expediente para ver requisitos vigentes, sus evidencias y la evaluación realizada.</p>
                <button type="button" class="btn btn-default btn-xs" (click)="abrirWorkflow()">Abrir expedientes</button>
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
                      <span>{{ p['porcentajeCumplimiento'] === null || p['porcentajeCumplimiento'] === undefined ? 'Sin evaluación registrada' : p['porcentajeCumplimiento'] + '%' }}</span>
                    </td>
                    <td><span class="label label-default">{{ p['estado'] }}</span></td>
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
                  <th>Evaluación de acceso</th>
                </tr>
              </thead>
              <tbody>
                @for (t of trabajadoresFiltrados(); track t['id']) {
                  <tr>
                    <td>#{{ t['id'] }}</td>
                    <td><strong>{{ t['dni'] || t['numeroDocumento'] }}</strong></td>
                    <td><strong>{{ t['nombreCompleto'] || (t['nombres'] + ' ' + t['apellidoPaterno']) }}</strong></td>
                    <td>{{ t['puestoTrabajo'] }}</td>
                    <td><span class="label label-success">{{ t['aptitudMedica'] ?? 'Sin dictamen' }}</span></td>
                    <td><span>Salud: {{ t['sctrSaludVigente'] === true ? 'Vigencia registrada' : 'Sin vigencia registrada' }} / Pensión: {{ t['sctrPensionVigente'] === true ? 'Vigencia registrada' : 'Sin vigencia registrada' }}</span></td>
                    <td><strong>{{ t['notaInduccion'] ?? 'Sin resultado' }}</strong></td>
                    <td>
                      <span class="label label-default">Evaluar con la política vigente en garita</span>
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
                    <td>{{ v['soatVigente'] === true ? 'Vigencia registrada' : 'Sin vigencia registrada' }}</td>
                    <td>{{ v['revisionTecnicaVigente'] === true ? 'Vigencia registrada' : 'Sin vigencia registrada' }}</td>
                    <td>
                      <span class="label label-default">Evaluar con la política vigente en garita</span>
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
                    <td>{{ d['fechaEmision'] ?? 'Sin fecha' }}</td>
                    <td>{{ d['fechaVencimiento'] }}</td>
                    <td>
                      <strong [style.color]="d['puntajeValidacionIA'] !== null && d['puntajeValidacionIA'] !== undefined && d['puntajeValidacionIA'] >= 90 ? '#28a745' : '#d39e00'">
                        <i class="fa fa-bolt"></i> {{ d['puntajeValidacionIA'] ?? 'Sin evaluación' }}%
                      </strong>
                    </td>
                    <td>{{ d['observacionRevision'] ?? 'Sin observación registrada' }}</td>
                    <td>
                      <span
                        class="label"
                        [ngClass]="d['estadoRevision'] === 'APROBADO' ? 'label-success' : (d['estadoRevision'] === 'OBSERVADO' ? 'label-danger' : 'label-warning')">
                        {{ d['estadoRevision'] }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-xs btn-success" (click)="dictaminarDocumento(d, 'APROBADO')" title="Revisar evidencias del expediente">
                        <i class="fa fa-tasks"></i> Revisar expediente
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
                      <td><strong>{{ g['fechaRegistro'] }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="g['movimiento'] === 'INGRESO' ? 'label-primary' : 'label-info'">
                          {{ g['movimiento'] }}
                        </span>
                      </td>
                      <td><code>{{ g['documentoOPlaca'] ?? g['identificador'] }}</code></td>
                      <td><strong>{{ g['nombre'] }}</strong></td>
                      <td>{{ g['garita'] }}</td>
                      <td>
                        <span class="label" [ngClass]="g['autorizado'] === true ? 'label-success' : 'label-danger'">
                          {{ g['autorizado'] === true ? 'Autorizado por la evaluación registrada' : 'Acceso no autorizado' }}
                        </span>
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
            <div class="form-group"><label for="tipo-contratista">Código de tipo de contratista</label><input id="tipo-contratista" type="number" min="1" step="1" class="form-control input-sm" [(ngModel)]="formContratista.tipoContratistaId" required><p>Ingrese el código de clasificación definido por su organización.</p></div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>RUC (11 dígitos):</label>
                <input type="text" class="form-control input-sm" maxlength="11" [(ngModel)]="formContratista.ruc" placeholder="RUC de la contratista">
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
                <p>La homologación se calcula a partir de la evaluación del expediente.</p>
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
            @if (administradorEmpresa()) {
              <div class="form-group">
                <label for="contratista-proyecto">Contratista</label>
                <select id="contratista-proyecto" name="contractorRefId" class="form-control" [(ngModel)]="formProyecto.contractorRefId" required>
                  <option [ngValue]="null">Seleccione una contratista autorizada</option>
                  @for (c of contratistas(); track c['id']) {
                    <option [ngValue]="c['id']">{{c['razonSocial']}}</option>
                  }
                </select>
              </div>
            }

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
                <input type="date" class="form-control input-sm" [(ngModel)]="formProyecto.fechaInicio" placeholder="25/03/2026">
              </div>
              <div class="col-md-4 form-group">
                <label>Fecha Fin:</label>
                <input type="date" class="form-control input-sm" [(ngModel)]="formProyecto.fechaFin" placeholder="31/12/2026">
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
            @if (administradorEmpresa()) {
              <div class="form-group">
                <label for="contratista-trabajador">Contratista</label>
                <select id="contratista-trabajador" name="contractorRefId" class="form-control" [(ngModel)]="formTrabajador.contractorRefId" required>
                  <option [ngValue]="null">Seleccione una contratista autorizada</option>
                  @for (c of contratistas(); track c['id']) {
                    <option [ngValue]="c['id']">{{c['razonSocial']}}</option>
                  }
                </select>
              </div>
            }

            <div class="form-group"><label for="tipo-documento-trabajador">Tipo de documento</label><input id="tipo-documento-trabajador" class="form-control input-sm" [(ngModel)]="formTrabajador.tipoDocumento" maxlength="20" required></div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>Número de documento:</label>
                <input type="text" class="form-control input-sm" maxlength="12" [(ngModel)]="formTrabajador.dni" placeholder="45892136">
              </div>
              <div class="col-md-8 form-group">
                <label>Nombres:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.nombres" placeholder="JUAN CARLOS QUISPE MENDOZA"><label>Apellido paterno:</label><input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.apellidoPaterno"><label>Apellido materno:</label><input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.apellidoMaterno">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Puesto de Trabajo:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formTrabajador.puestoTrabajo" placeholder="Soldador Homologado 6G">
              </div>
              <div class="col-md-3 form-group">
                <label>Aptitud EMO:</label>
                <p>El dictamen médico se consulta en la evaluación autorizada del trabajador.</p>
              </div>
              <div class="col-md-3 form-group">
                <label>Nota Inducción:</label>
                <p>La inducción se acredita con el resultado registrado del curso.</p>
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
            @if (administradorEmpresa()) {
              <div class="form-group">
                <label for="contratista-vehiculo">Contratista</label>
                <select id="contratista-vehiculo" name="contractorRefId" class="form-control" [(ngModel)]="formVehiculo.contractorRefId" required>
                  <option [ngValue]="null">Seleccione una contratista autorizada</option>
                  @for (c of contratistas(); track c['id']) {
                    <option [ngValue]="c['id']">{{c['razonSocial']}}</option>
                  }
                </select>
              </div>
            }

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
                <label>Expediente autorizado:</label>
                <select class="form-control input-sm" [(ngModel)]="formDocumento.expedienteId" (ngModelChange)="seleccionarExpedienteDocumento()">
                  <option [ngValue]="null">Seleccione</option>
                  @for (item of expedientesDocumentales(); track item.expedienteId) {<option [ngValue]="item.expedienteId">{{ item.codigoExpediente }} · {{ item.subject.label }}</option>}
                </select>
              </div>
              <div class="col-md-7 form-group">
                <label>Requisito del expediente:</label>
                <select class="form-control input-sm" [(ngModel)]="formDocumento.fieldCode" (ngModelChange)="seleccionarRequisitoDocumento()">
                  <option value="">Seleccione</option>
                  @for (item of requisitosDocumento(); track item.requirementCode) {<option [value]="item.requirementCode">{{ item.title }}</option>}
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Sujeto de Referencia (DNI / Placa / RUC):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formDocumento.sujetoReferencia" readonly placeholder="Ej. 45892103 o CPX-492">
              </div>
              <div class="col-md-6 form-group">
                <label>Fecha de emisión:</label><input type="date" class="form-control input-sm" [(ngModel)]="formDocumento.fechaEmision"><label>Fecha de vencimiento:</label><input type="date" class="form-control input-sm" [(ngModel)]="formDocumento.fechaVencimiento">
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
              <i class="fa fa-cloud-upload"></i> Subir documento para revisión
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
                <input type="text" class="form-control input-sm" [(ngModel)]="formOperacion.tipo" placeholder="Código de tipo de permiso del catálogo autorizado">
              </div>
              <div class="col-md-7 form-group">
                <label>Supervisor Responsable:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formOperacion.supervisor" placeholder="Ing. Marco Elias / Ing. Carlos Mendoza">
              </div>
            </div>
            <div class="form-group">
              <label>ATS existente:</label><input type="number" class="form-control input-sm" [(ngModel)]="formOperacion.atsId">
<label>Proyecto:</label><select class="form-control input-sm" [(ngModel)]="formOperacion.projectId"><option [ngValue]="null">Seleccione</option>@for(item of proyectos();track item['id']){<option [ngValue]="item['id']">{{item['nombre']}}</option>}</select>
<label>Descripción de la actividad:</label>
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
              <i class="fa fa-check-circle"></i> Registrar solicitud
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
                <select class="form-control input-sm" [(ngModel)]="formGarita.movimiento"><option value="">Seleccione</option>@for (item of catalogoAcceso().directions; track item.code) {<option [value]="item.code">{{ item.label }}</option>}</select>
              </div>
              <div class="col-md-7 form-group">
                <label>DNI del Trabajador o Placa Vehicular:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formGarita.identificador" placeholder="Ej. 43128950 o B8T-914">
              </div>
            </div>
            <div class="form-group">
              <label>Nombre Completo / Descripción de Unidad:</label>
              <select class="form-control input-sm" [(ngModel)]="formGarita.subjectType"><option value="">Seleccione tipo de sujeto</option>@for(item of catalogoAcceso().subjectTypes;track item.code){<option [value]="item.code">{{item.label}}</option>}</select><select class="form-control input-sm" [(ngModel)]="formGarita.projectId"><option [ngValue]="null">Seleccione proyecto</option>@for(item of catalogoAcceso().projects;track item.id){<option [ngValue]="item.id">{{item.label}}</option>}</select>
            </div>
            <div class="form-group">
              <label>Garita de Control:</label>
              <select class="form-control input-sm" [(ngModel)]="formGarita.zoneId"><option [ngValue]="null">Seleccione zona</option>@for(item of catalogoAcceso().zones;track item.id){<option [ngValue]="item.id">{{item.label}}</option>}</select>
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

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo03ContratistasIntegralComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  private readonly http = inject(HttpClient);
  private readonly workflow = inject(WorkflowApiService);
  private readonly evidence = inject(EvidenceApiService);
  private readonly intents = new IntentKeys();
  readonly session = inject(GosstSessionService);
  private readonly router = inject(Router);

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
  readonly contratistas = signal<Record<string, any>[]>([]);

  readonly blacklist = signal<Record<string, any>[]>([]);

  // Datos Submódulo 3B
  readonly proyectos = signal<Record<string, any>[]>([]);

  // Datos Submódulo 3C
  filtroTrabajador = '';
  readonly trabajadores = signal<Record<string, any>[]>([]);
  readonly vehiculos = signal<Record<string, any>[]>([]);

  // Datos Submódulo 3D
  readonly documentos = signal<Record<string, any>[]>([]);
  readonly operacionesCampo = signal<Record<string, any>[]>([]);

  readonly movimientosGarita = signal<Record<string, any>[]>([]);

  // Modales Signals
  readonly modalContratistaAbierto = signal<boolean>(false);
  formContratista = {tipoContratistaId:null as number|null,ruc:'',razonSocial:'',rubroActividad:'',representanteLegal:'',correo:'',telefono:''};
  readonly modalProyectoAbierto = signal(false);
  formProyecto = {contractorRefId:null as number|null,codigo:'',nombre:'',responsableCliente:'',responsableContratista:'',nivelRiesgo:'',fechaInicio:'',fechaFin:''};
  readonly modalTrabajadorAbierto = signal(false);
  formTrabajador = {contractorRefId:null as number|null,tipoDocumento:'',dni:'',nombres:'',apellidoPaterno:'',apellidoMaterno:'',puestoTrabajo:''};
  readonly modalVehiculoAbierto = signal(false);
  formVehiculo = {contractorRefId:null as number|null,categoria:'',placaCodigo:'',marca:'',modelo:'',anioFabricacion:null as number|null};
  readonly modalDocumentoAbierto = signal(false);
  readonly mensajeError = signal('');
  readonly archivoSeleccionadoNombre = signal('');
  readonly archivoSeleccionadoBytes = signal(0);
  readonly expedientesDocumentales = signal<WorkflowSnapshot[]>([]);
  private archivoSeleccionado:File|null=null;
  private evidenciaDocumentoId:string|null=null;
  formDocumento = {expedienteId:null as number|null,fieldCode:'',nivel:'',nombreRequisito:'',sujetoReferencia:'',fechaEmision:'',fechaVencimiento:''};
  readonly modalOperacionAbierto = signal(false);
  formOperacion = {tipo:'',actividad:'',ubicacion:'',supervisor:'',atsId:null as number|null,projectId:null as number|null};
  readonly modalGaritaAbierto = signal(false);
  readonly catalogoAcceso = signal<{projects:{id:number;label:string}[];zones:{id:number;label:string}[];directions:{code:string;label:string}[];subjectTypes:{code:string;label:string}[]}>({projects:[],zones:[],directions:[],subjectTypes:[]});
  formGarita = {movimiento:'',identificador:'',subjectType:'',projectId:null as number|null,zoneId:null as number|null};
  private decisionPendiente:{fingerprint:string;decisionId:string;version:string}|null=null;
  requisitosDocumento(){return this.expedientesDocumentales().find(x=>x.expedienteId===this.formDocumento.expedienteId)?.requirements??[];}

  onArchivoSeleccionado(event:Event):void {
    const input=event.target as HTMLInputElement;
    this.archivoSeleccionado=input.files?.item(0)??null;this.evidenciaDocumentoId=null;
    this.archivoSeleccionadoNombre.set(this.archivoSeleccionado?.name??'');
    this.archivoSeleccionadoBytes.set(this.archivoSeleccionado?.size??0);
  }
  seleccionarExpedienteDocumento():void {
    const snapshot=this.expedientesDocumentales().find(x=>x.expedienteId===this.formDocumento.expedienteId);
    this.formDocumento.fieldCode='';this.formDocumento.nombreRequisito='';
    this.formDocumento.nivel=snapshot?.subject.subjectType??'';
    this.formDocumento.sujetoReferencia=snapshot?.subject.label??'';
    this.evidenciaDocumentoId=null;
  }
  seleccionarRequisitoDocumento():void {
    this.formDocumento.nombreRequisito=this.requisitosDocumento().find(x=>x.requirementCode===this.formDocumento.fieldCode)?.title??'';
    this.evidenciaDocumentoId=null;
  }

  readonly pageRoutes=['/contratista/documento/lista', '/contratista/garita/lista', '/contratista/lista', '/contratista/operacion/lista', '/contratista/proyecto/lista', '/contratista/trabajador/lista', '/contratista/vehiculo/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
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
    if(!this.session.snapshot()){this.notificarError('Inicie sesión para consultar el ámbito autorizado.');return;}
    const loads:[string,(rows:Record<string,any>[])=>void][]=[
      ['/contratista/lista',rows=>this.contratistas.set(rows)],
      ['/contratista/proyecto/lista',rows=>this.proyectos.set(rows)],
      ['/contratista/trabajador/lista',rows=>this.trabajadores.set(rows)],
      ['/contratista/vehiculo/lista',rows=>this.vehiculos.set(rows)],
      ['/contratista/documento/lista',rows=>this.documentos.set(rows)],
      ['/contratista/operacion/lista',rows=>this.operacionesCampo.set(rows)],
      ['/contratista/garita/lista',rows=>this.movimientosGarita.set(rows)]
    ];
    for(const[route,apply]of loads)this.api.callAjaxPost(route,{}).subscribe({
      next:res=>{try{
        if(!Array.isArray(res['list'])||res['list'].some((x:unknown)=>x===null||typeof x!=='object'||Array.isArray(x)))throw new Error('El servidor no confirmó la lista solicitada.');
        apply(res['list']); // La lista vacía también es un resultado real.
      }catch(error){this.notificarError(apiErrorMessage(error));}},
      error:error=>this.notificarError(apiErrorMessage(error))
    });
  }
  administradorEmpresa():boolean {return this.session.snapshot()?.contratistaId===null;}
  private async guardarRegistro(route:string,data:Record<string,unknown>,expectedId?:number):Promise<Record<string,any>> {
    if(!this.session.snapshot())throw new Error('Inicie sesión para continuar.');
    if(this.administradorEmpresa()&&['/contratista/proyecto/insert','/contratista/trabajador/insert','/contratista/vehiculo/insert'].includes(route)&&!isSafeId(data['contractorRefId']))throw new Error('Seleccione una contratista autorizada para este registro.');
    const requestId=this.intents.key(route,data);
    const result=await firstValueFrom(this.api.callAjaxPost(route,{...data,idempotencyKey:requestId}));
    const record=readM03ConfirmedRecord(result,requestId,expectedId);
    this.intents.confirmed(route,data,requestId);
    return record;
  }
  private reemplazarRegistro(rows:Record<string,any>[],record:Record<string,any>):Record<string,any>[] {
    return [record,...rows.filter(x=>x['id']!==record['id'])];
  }

  abrirModalNuevoContratista():void {
    this.formContratista={tipoContratistaId:null as number|null,ruc:'',razonSocial:'',rubroActividad:'',representanteLegal:'',correo:'',telefono:''};
    this.modalContratistaAbierto.set(true);
  }
  async guardarContratista():Promise<void> {
    try {
      if(!isSafeId(this.formContratista.tipoContratistaId))throw new Error('Ingrese el código de tipo de contratista definido por su organización.');
      if(!this.formContratista.ruc.trim()||!this.formContratista.razonSocial.trim())throw new Error('Complete RUC y razón social.');
      const record=await this.guardarRegistro('/contratista/insert',{...this.formContratista});
      this.contratistas.update(rows=>this.reemplazarRegistro(rows,record));this.modalContratistaAbierto.set(false);
      this.notificarExito('Alta administrativa confirmada. La homologación se evalúa en su expediente.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  abrirModalNuevoProyecto():void {
    this.formProyecto={contractorRefId:null as number|null,codigo:'',nombre:'',responsableCliente:'',responsableContratista:'',nivelRiesgo:'',fechaInicio:'',fechaFin:''};
    this.modalProyectoAbierto.set(true);
  }
  async guardarProyecto():Promise<void> {
    try {
      if(!this.formProyecto.nombre.trim()||!this.formProyecto.codigo.trim()||!this.formProyecto.fechaInicio||!this.formProyecto.fechaFin)throw new Error('Complete los datos y fechas reales del proyecto.');
      const record=await this.guardarRegistro('/contratista/proyecto/insert',{...this.formProyecto});
      this.proyectos.update(rows=>this.reemplazarRegistro(rows,record));this.modalProyectoAbierto.set(false);this.notificarExito('Proyecto confirmado por el servidor.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  abrirModalNuevoTrabajador():void {
    this.formTrabajador={contractorRefId:null as number|null,tipoDocumento:'',dni:'',nombres:'',apellidoPaterno:'',apellidoMaterno:'',puestoTrabajo:''};this.modalTrabajadorAbierto.set(true);
  }
  async guardarTrabajador():Promise<void> {
    try {
      if(!this.formTrabajador.tipoDocumento.trim())throw new Error('Ingrese el tipo de documento del trabajador.');
      if(!this.formTrabajador.dni.trim()||!this.formTrabajador.nombres.trim()||!this.formTrabajador.apellidoPaterno.trim())throw new Error('Complete identidad y nombre del trabajador.');
      const record=await this.guardarRegistro('/contratista/trabajador/insert',{...this.formTrabajador});
      this.trabajadores.update(rows=>this.reemplazarRegistro(rows,record));this.modalTrabajadorAbierto.set(false);
      this.notificarExito('Trabajador registrado. La acreditación y el acceso requieren evaluación de requisitos.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  abrirModalNuevoVehiculo():void {
    this.formVehiculo={contractorRefId:null as number|null,categoria:'',placaCodigo:'',marca:'',modelo:'',anioFabricacion:null};this.modalVehiculoAbierto.set(true);
  }
  async guardarVehiculo():Promise<void> {
    try {
      if(!this.formVehiculo.placaCodigo.trim())throw new Error('Complete la placa o código real de la unidad.');
      const record=await this.guardarRegistro('/contratista/vehiculo/insert',{...this.formVehiculo});
      this.vehiculos.update(rows=>this.reemplazarRegistro(rows,record));this.modalVehiculoAbierto.set(false);this.notificarExito('Unidad registrada sin autorizar automáticamente su acceso.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  async abrirModalNuevoDocumento():Promise<void> {
    this.formDocumento={expedienteId:null,fieldCode:'',nivel:'',nombreRequisito:'',sujetoReferencia:'',fechaEmision:'',fechaVencimiento:''};
    this.archivoSeleccionado=null;this.evidenciaDocumentoId=null;this.archivoSeleccionadoNombre.set('');this.archivoSeleccionadoBytes.set(0);
    this.modalDocumentoAbierto.set(true);
    try{const result=await firstValueFrom(this.workflow.list());this.expedientesDocumentales.set(result.expedientes);}
    catch(error){this.notificarError(apiErrorMessage(error));}
  }
  async guardarDocumento():Promise<void> {
    try {
      if(!isSafeId(this.formDocumento.expedienteId)||!this.formDocumento.fieldCode||!this.archivoSeleccionado||
        !this.formDocumento.fechaEmision||!this.formDocumento.fechaVencimiento)throw new Error('Seleccione expediente, requisito, archivo y fechas reales.');
      const result=await firstValueFrom(this.workflow.detail(this.formDocumento.expedienteId));
      const snapshot=result.snapshot;if(!snapshot)throw new Error('No se recuperó el expediente autorizado.');
      const requirement=snapshot.requirements.find(x=>x.requirementCode===this.formDocumento.fieldCode);
      if(!requirement)throw new Error('El requisito ya no corresponde al expediente.');
      if(!this.evidenciaDocumentoId){
        const stored=await firstValueFrom(this.evidence.upload(this.archivoSeleccionado,snapshot,requirement.requirementCode));
        this.evidenciaDocumentoId=stored.evidenceId;
      }
      const record=await this.guardarRegistro('/contratista/documento/insert',{
        evidenceId:this.evidenciaDocumentoId,expedienteId:snapshot.expedienteId,fieldCode:requirement.requirementCode,
        expectedVersion:snapshot.version,workflowVersion:snapshot.version,subjectType:snapshot.subject.subjectType,
        subjectId:snapshot.subject.subjectId,idEntidadReferencia:snapshot.subject.subjectId,
        nivel:snapshot.subject.subjectType,nombreRequisito:requirement.title,tipoDocumento:requirement.requirementCode,
        sujetoReferencia:snapshot.subject.label,fechaEmision:this.formDocumento.fechaEmision,fechaVencimiento:this.formDocumento.fechaVencimiento
      });
      this.documentos.update(rows=>this.reemplazarRegistro(rows,record));this.modalDocumentoAbierto.set(false);
      this.archivoSeleccionado=null;this.evidenciaDocumentoId=null;this.archivoSeleccionadoNombre.set('');this.archivoSeleccionadoBytes.set(0);
      this.notificarExito('Archivo y registro documental confirmados. La revisión conserva su estado independiente.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  dictaminarDocumento(_doc:Record<string,any>,_nuevoEstado:'APROBADO'|'OBSERVADO'):void {this.abrirWorkflow();}
  abrirWorkflow():void {void this.router.navigate(['/workflow']);}
  abrirModalNuevaOperacion():void {
    this.formOperacion={tipo:'',actividad:'',ubicacion:'',supervisor:'',atsId:null,projectId:null};this.modalOperacionAbierto.set(true);
  }
  async guardarOperacion():Promise<void> {
    try {
      if(!this.formOperacion.actividad.trim()||!this.formOperacion.tipo||!isSafeId(this.formOperacion.atsId)||!isSafeId(this.formOperacion.projectId))throw new Error('Complete actividad, tipo, ATS existente y proyecto.');
      const record=await this.guardarRegistro('/contratista/operacion/insert',{...this.formOperacion});
      this.operacionesCampo.update(rows=>this.reemplazarRegistro(rows,record));this.modalOperacionAbierto.set(false);
      this.notificarExito('Solicitud registrada. La autorización depende del expediente y los requisitos aplicables.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }

  async abrirModalNuevoPaseGarita():Promise<void> {
    this.formGarita={movimiento:'',identificador:'',subjectType:'',projectId:null,zoneId:null};this.decisionPendiente=null;
    this.modalGaritaAbierto.set(true);
    try {
      const raw=asObject(await firstValueFrom(this.http.get<unknown>('/sst/access/catalogs')));
      if(raw['succeeded']!==true)throw new Error('No se confirmó el catálogo de acceso.');
      const c=asObject(raw['catalogs']??raw);
      for(const key of ['projects','zones'])if(!Array.isArray(c[key])||(c[key] as unknown[]).some(v=>{const x=asObject(v);return !isSafeId(x['id'])||typeof x['label']!=='string';}))throw new Error('El catálogo de acceso no es válido.');
      for(const key of ['directions','subjectTypes'])if(!Array.isArray(c[key])||(c[key] as unknown[]).some(v=>{const x=asObject(v);return typeof x['code']!=='string'||typeof x['label']!=='string';}))throw new Error('El catálogo de acceso no es válido.');
      this.catalogoAcceso.set(c as unknown as ReturnType<typeof this.catalogoAcceso>);
    }catch(error){this.notificarError(apiErrorMessage(error));}
  }
  async guardarPaseGarita():Promise<void> {
    try {
      if(!this.formGarita.identificador.trim()||!this.formGarita.subjectType||!isSafeId(this.formGarita.projectId)||
        !isSafeId(this.formGarita.zoneId)||!this.formGarita.movimiento)throw new Error('Seleccione sujeto, proyecto, zona y movimiento.');
      const evaluation={subjectType:this.formGarita.subjectType,identifier:this.formGarita.identificador,projectId:this.formGarita.projectId,zoneId:this.formGarita.zoneId,direction:this.formGarita.movimiento};
      const fingerprint=JSON.stringify(evaluation);
      if(!this.decisionPendiente||this.decisionPendiente.fingerprint!==fingerprint){
        const result=asObject(await firstValueFrom(this.http.post<unknown>('/sst/access/evaluate',evaluation)));
        const decision=asObject(result['decision']);
        if(result['succeeded']!==true||result['code']!=='ACCESS_EVALUATED'||!isGuid(decision['decisionId'])||typeof decision['version']!=='string'||
          typeof decision['habilitado']!=='boolean'||!Array.isArray(decision['motivos']))throw new Error('No se confirmó una evaluación de acceso válida.');
        this.decisionPendiente={fingerprint,decisionId:decision['decisionId'],version:decision['version']};
        if(!decision['habilitado'])this.notificarError((decision['motivos'] as string[]).join(' '));
      }
      const data={decisionId:this.decisionPendiente.decisionId,expectedVersion:this.decisionPendiente.version};
      const key=this.intents.key('access-register',data);
      const result=asObject(await firstValueFrom(this.http.post<unknown>('/sst/access/register',{...data,idempotencyKey:key})));
      if(result['succeeded']!==true||result['code']!=='ACCESS_RECORDED'||result['requestId']!==key)throw new Error('No se confirmó el registro de acceso.');
      const record=readM03ConfirmedRecord(result,key);
      this.intents.confirmed('access-register',data,key);
      this.movimientosGarita.update(rows=>this.reemplazarRegistro(rows,record));this.decisionPendiente=null;this.modalGaritaAbierto.set(false);
      this.notificarExito(typeof result['message']==='string'?result['message']:'Evaluación de acceso registrada.');
    }catch(error){this.notificarError(apiErrorMessage(error));}
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
