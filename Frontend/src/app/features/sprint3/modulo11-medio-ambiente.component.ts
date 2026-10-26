import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { WorkflowChooserComponent } from '../../core/components/workflow-chooser.component';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface ResiduoSolidoItem {
  id: number;
  codigo: string | null;
  tipo: 'RESIDUO' | 'MANIFIESTO' | null;
  nombre: string | null;
  clasificacion: 'PELIGROSO' | 'NO_PELIGROSO' | 'RAEE' | null;
  cantidad: number | null;
  unidad: 'KG' | 'TON' | null;
  operadorEoRs: string | null;
  certificadoDisposicion: string | null;
  fechaDisposicion: string | null;
  estado: 'DISPOSICION_CERTIFICADA' | 'ALMACEN_CENTRAL' | null;
}

export interface FichaQuimicaMatpelItem {
  id: number;
  codigo: string | null;
  productoQuimico: string | null;
  clasificacionSga: string | null;
  nfpaSalud: number | null;
  nfpaInflamabilidad: number | null;
  nfpaReactividad: number | null;
  nfpaEspecifico: string | null;
  cantidadAlmacenada: number | null;
  unidad: string | null;
  areaUso: string | null;
  fichaPdfUrl: string | null;
  estado: 'HOMOLOGADO_MSDS' | 'EN_EVALUACION' | null;
}

export interface HuellaCarbonoGeiItem {
  id: number;
  codigo: string | null;
  alcanceGei: 'ALCANCE_1' | 'ALCANCE_2' | 'ALCANCE_3' | 'MITIGACION' | null;
  fuenteEmision: string | null;
  emisionesTco2e: number | null;
  metaReduccionPorc: number | null;
  periodoReporte: string | null;
  estadoVerificacion: 'VERIFICADO_ISO_14064' | 'EN_CALCULO' | null;
}

@Component({
  selector: 'msst-modulo11-ambiente',
  standalone: true,
  imports: [QueryPagesComponent,WorkflowChooserComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}
<msst-workflow-chooser [open]="workflowSelectionOpen()" (closed)="workflowSelectionOpen.set(false)"></msst-workflow-chooser>

    <div class="container-fluid" style="padding: 15px;">

      <!-- Cabecera Corporativa Módulo 11 -->
      <div class="panel panel-primary" style="margin-bottom: 18px; border-color: #004B87;">
        <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 class="panel-title" style="font-size: 16px; font-weight: bold;">
              <i class="fa fa-leaf"></i>  Gestión Ambiental ISO 14001 — Residuos Sólidos EO-RS, MATPEL (MSDS / NFPA 704) y Huella de Carbono
            </h4>
            <div style="font-size: 11px; color: #d0e4ff; margin-top: 3px;">
              OneSST Enterprise &bull; Gestión Corporativa en Tiempo Real
            </div>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-xs btn-success" (click)="mostrarModalResiduo.set(true)">
              <i class="fa fa-plus-circle"></i> + Registrar Residuo / EO-RS
            </button>
            <button class="btn btn-xs btn-warning" (click)="mostrarModalFichaQuimica.set(true)">
              <i class="fa fa-flask"></i> + Nueva Ficha MSDS
            </button>
            <button class="btn btn-xs btn-info" (click)="mostrarModalHuella.set(true)">
              <i class="fa fa-cloud"></i> + Registrar Emisión GEI
            </button>
          </div>
        </div>

        <!-- KPIs Superiores -->
        <div class="panel-body" style="background: #f6f9fc; padding: 12px 15px;">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #28a745; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">RESIDUOS Y MANIFIESTOS EO-RS</div>
                <div style="font-size: 20px; font-weight: bold; color: #28a745;">{{ residuos().length }} Registros</div>
                <div style="font-size: 11px; color: #888;">D.L. N° 1278 / Trazabilidad MINAM</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #dc3545; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">INVENTARIO MATPEL / HOJAS MSDS</div>
                <div style="font-size: 20px; font-weight: bold; color: #dc3545;">{{ fichasQuimicas().length }} Sustancias</div>
                <div style="font-size: 11px; color: #888;">Rombo NFPA 704 y Sistema SGA</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #004B87; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">EMISIONES GEI NETAS (ISO 14064)</div>
                <div style="font-size: 20px; font-weight: bold; color: #004B87;">{{ totalEmisionesNetas() }} tCO2e</div>
                <div style="font-size: 11px; color: #888;">Alcances 1, 2, 3 y Mitigación</div>
              </div>
            </div>
            <div class="col-sm-3">
              <div style="background: #fff; padding: 12px; border-radius: 5px; border-left: 4px solid #17a2b8; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size: 11px; color: #666;">CONTROL DE HUELLA DE CARBONO</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">Consulte los registros</div>
                <div style="font-size: 11px; color: #888;">La verificación corresponde al expediente</div>
              </div>
            </div>
          </div>

          <!-- Navegación 3 Pestañas -->
          <div class="btn-group" style="display: flex; flex-wrap: wrap; gap: 4px;">
            <button class="btn btn-sm" [ngClass]="pestana() === 'RESIDUOS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('RESIDUOS')">
              <i class="fa fa-recycle"></i> 1. Residuos Sólidos y Manifiestos EO-RS
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'FICHAS_QUIMICAS' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('FICHAS_QUIMICAS')">
              <i class="fa fa-flask"></i> 2. Materiales Peligrosos MATPEL / MSDS y NFPA 704
            </button>
            <button class="btn btn-sm" [ngClass]="pestana() === 'HUELLA_CARBONO' ? 'btn-primary' : 'btn-default'" (click)="pestana.set('HUELLA_CARBONO')">
              <i class="fa fa-cloud"></i> 3. Calculadora de Huella de Carbono ISO 14064
            </button>
          </div>
        </div>
      </div>

      @if (notificacion()) {
        <div class="alert alert-success" style="padding: 10px 15px; margin-bottom: 15px;">
          <i class="fa fa-check-circle"></i> {{ notificacion() }}
        </div>
      }

      <!-- PESTAÑA 1: GESTIÓN INTEGRAL DE RESIDUOS SÓLIDOS Y MANIFIESTOS EO-RS -->
      @if (pestana() === 'RESIDUOS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-recycle"></i> Control de Residuos Sólidos Peligrosos / No Peligrosos y Manifiestos EO-RS D.L. N° 1278</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvResiduos()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalResiduo.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Residuo / Manifiesto EO-RS
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por código, descripción del residuo o empresa EO-RS..." [(ngModel)]="filtroResiduo">
              </div>
              <div class="col-md-3">
                <select class="form-control input-sm" [(ngModel)]="filtroClasificacionResiduo">
                  <option value="TODOS">Todas las Clasificaciones</option>
                  <option value="PELIGROSO">PELIGROSO</option>
                  <option value="NO_PELIGROSO">NO_PELIGROSO</option>
                  <option value="RAEE">RAEE (Eléctricos/Electrónicos)</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Descripción del Residuo Sólido</th>
                    <th>Clasificación</th>
                    <th style="text-align:right;">Cantidad</th>
                    <th>Empresa Operadora EO-RS (MINAM)</th>
                    <th>Certificado Disposición Final</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of residuosFiltrados(); track r.id) {
                    <tr>
                      <td><strong>#{{ r.id }}</strong></td>
                      <td><code>{{ r.codigo }}</code></td>
                      <td><span class="label label-primary">{{ r.tipo }}</span></td>
                      <td><strong>{{ r.nombre }}</strong></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': r.clasificacion === 'PELIGROSO',
                          'label-success': r.clasificacion === 'NO_PELIGROSO',
                          'label-warning': r.clasificacion === 'RAEE'
                        }">{{ r.clasificacion }}</span>
                      </td>
                      <td style="text-align:right;"><strong>{{ r.cantidad }} {{ r.unidad }}</strong></td>
                      <td>{{ r.operadorEoRs }}</td>
                      <td><code>{{ r.certificadoDisposicion }}</code> ({{ r.fechaDisposicion }})</td>
                      <td>
                        <span class="label" [ngClass]="r.estado === 'DISPOSICION_CERTIFICADA' ? 'label-success' : 'label-info'">
                          {{ r.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarResiduo(r)" title="Certificar Disposición Final">
                            <i class="fa fa-check"></i> Certificar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarResiduo(r)" title="Eliminar">
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

      <!-- PESTAÑA 2: INVENTARIO DE MATERIALES PELIGROSOS (MATPEL) Y HOJAS MSDS CON ROMBO NFPA 704 -->
      @if (pestana() === 'FICHAS_QUIMICAS') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-flask"></i> Inventario de Sustancias Químicas MATPEL, Hojas de Datos MSDS / FDS y Rombo NFPA 704</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvFichasQuimicas()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalFichaQuimica.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Sustancia MATPEL
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por código, sustancia química, clasificación SGA o área de uso..." [(ngModel)]="filtroFichaQuimica">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código MSDS</th>
                    <th>Producto / Sustancia Química Peligrosa</th>
                    <th>Clasificación SGA</th>
                    <th style="text-align:center;">Rombo NFPA 704 (S-I-R-E)</th>
                    <th style="text-align:right;">Stock Almacenado</th>
                    <th>Área de Uso</th>
                    <th>Hoja MSDS</th>
                    <th>Estado</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (f of fichasQuimicasFiltradas(); track f.id) {
                    <tr>
                      <td><strong>#{{ f.id }}</strong></td>
                      <td><code>{{ f.codigo }}</code></td>
                      <td><strong>{{ f.productoQuimico }}</strong></td>
                      <td><span class="label label-warning">{{ f.clasificacionSga }}</span></td>
                      <td style="text-align:center;">
                        <span class="badge" style="background:#0062cc; margin-right:3px;" title="Salud (Azul)">S:{{ f.nfpaSalud }}</span>
                        <span class="badge" style="background:#dc3545; margin-right:3px;" title="Inflamabilidad (Rojo)">I:{{ f.nfpaInflamabilidad }}</span>
                        <span class="badge" style="background:#ffc107; color:#111; margin-right:3px;" title="Reactividad (Amarillo)">R:{{ f.nfpaReactividad }}</span>
                        <span class="badge" style="background:#fff; color:#111; border:1px solid #999;" title="Riesgo Específico (Blanco)">{{ f.nfpaEspecifico }}</span>
                      </td>
                      <td style="text-align:right;"><strong>{{ f.cantidadAlmacenada }} {{ f.unidad }}</strong></td>
                      <td>{{ f.areaUso }}</td>
                      <td>
                        <a class="btn btn-xs btn-default" [href]="f.fichaPdfUrl" target="_blank">
                          <i class="fa fa-file-pdf-o"></i> FDS PDF
                        </a>
                      </td>
                      <td>
                        <span class="label" [ngClass]="f.estado === 'HOMOLOGADO_MSDS' ? 'label-success' : 'label-warning'">
                          {{ f.estado }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarFichaQuimica(f)" title="Homologar MSDS">
                            <i class="fa fa-check"></i> Homologar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarFichaQuimica(f)" title="Eliminar">
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

      <!-- PESTAÑA 3: CALCULADORA Y MONITOREO DE HUELLA DE CARBONO ISO 14064 -->
      @if (pestana() === 'HUELLA_CARBONO') {
        <div class="panel panel-primary">
          <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h4 class="panel-title"><i class="fa fa-cloud"></i> Inventario Corporativo de Gases de Efecto Invernadero (GEI) ISO 14064</h4>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-xs btn-info" (click)="exportarCsvHuellaCarbono()">
                <i class="fa fa-download"></i> Exportar CSV
              </button>
              <button class="btn btn-xs btn-success" (click)="mostrarModalHuella.set(true)">
                <i class="fa fa-plus-circle"></i> Registrar Fuente de Emisión GEI
              </button>
            </div>
          </div>
          <div class="panel-body">
            <div class="row" style="margin-bottom: 12px;">
              <div class="col-md-5">
                <input type="text" class="form-control input-sm" placeholder="Buscar por fuente de emisión, código o alcance GEI..." [(ngModel)]="filtroHuella">
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr style="background: #f0f4f8;">
                    <th>ID</th>
                    <th>Código GEI</th>
                    <th>Alcance ISO 14064</th>
                    <th>Fuente de Emisión / Proyecto de Mitigación</th>
                    <th style="text-align:right;">Emisiones (tCO2e)</th>
                    <th style="text-align:center;">Meta Reducción</th>
                    <th>Periodo</th>
                    <th>Estado Verificación</th>
                    <th style="width: 155px;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (h of huellaCarbonoFiltrada(); track h.id) {
                    <tr>
                      <td><strong>#{{ h.id }}</strong></td>
                      <td><code>{{ h.codigo }}</code></td>
                      <td>
                        <span class="label" [ngClass]="{
                          'label-danger': h.alcanceGei === 'ALCANCE_1',
                          'label-warning': h.alcanceGei === 'ALCANCE_2',
                          'label-info': h.alcanceGei === 'ALCANCE_3',
                          'label-success': h.alcanceGei === 'MITIGACION'
                        }">{{ h.alcanceGei }}</span>
                      </td>
                      <td><strong>{{ h.fuenteEmision }}</strong></td>
                      <td style="text-align:right;">
                        <strong [style.color]="h.alcanceGei === 'MITIGACION' ? '#28a745' : '#004B87'">
                          {{ h.alcanceGei === 'MITIGACION' ? '-' : '' }}{{ h.emisionesTco2e }} tCO2e
                        </strong>
                      </td>
                      <td style="text-align:center;"><span class="badge">{{ h.metaReduccionPorc }}%</span></td>
                      <td>{{ h.periodoReporte }}</td>
                      <td>
                        <span class="label" [ngClass]="h.estadoVerificacion === 'VERIFICADO_ISO_14064' ? 'label-success' : 'label-warning'">
                          {{ h.estadoVerificacion }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-xs btn-success" (click)="aprobarHuella(h)" title="Verificar ISO 14064">
                            <i class="fa fa-check"></i> Verificar
                          </button>
                          <button class="btn btn-xs btn-danger" (click)="eliminarHuella(h)" title="Eliminar">
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

      <!-- MODAL NUEVO RESIDUO / MANIFIESTO EO-RS -->
      @if (mostrarModalResiduo()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 600px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-recycle"></i> Registrar Residuo Sólido o Manifiesto EO-RS</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalResiduo.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código Registro:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoResiduo.codigo">
                </div>
                <div class="col-md-4 form-group">
                  <label>Tipo:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoResiduo.tipo">
                    <option value="RESIDUO">RESIDUO</option>
                    <option value="MANIFIESTO">MANIFIESTO EO-RS</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label>Clasificación:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoResiduo.clasificacion">
                    <option value="PELIGROSO">PELIGROSO</option>
                    <option value="NO_PELIGROSO">NO_PELIGROSO</option>
                    <option value="RAEE">RAEE</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descripción del Residuo Sólido:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevoResiduo.nombre" placeholder="Ej. Aceites Dieléctricos y Lubricantes Usados de Molienda">
              </div>
              <div class="row">
                <div class="col-md-3 form-group">
                  <label>Cantidad:</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevoResiduo.cantidad">
                </div>
                <div class="col-md-3 form-group">
                  <label>Unidad:</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevoResiduo.unidad">
                    <option value="KG">KG</option>
                    <option value="TON">TON</option>
                  </select>
                </div>
                <div class="col-md-6 form-group">
                  <label>Empresa Operadora EO-RS (MINAM):</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevoResiduo.operadorEoRs">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalResiduo.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevoResiduo()">
                <i class="fa fa-save"></i> Guardar Registro
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA FICHA QUÍMICA MATPEL -->
      @if (mostrarModalFichaQuimica()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 620px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-flask"></i> Registrar Sustancia Química MATPEL y Rombo NFPA 704</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalFichaQuimica.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Código MSDS:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.codigo">
                </div>
                <div class="col-md-8 form-group">
                  <label>Nombre del Producto Químico MATPEL:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.productoQuimico">
                </div>
              </div>
              <div class="row">
                <div class="col-md-3 form-group">
                  <label>NFPA Salud (0-4):</label>
                  <input type="number" min="0" max="4" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.nfpaSalud">
                </div>
                <div class="col-md-3 form-group">
                  <label>NFPA Inflamab. (0-4):</label>
                  <input type="number" min="0" max="4" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.nfpaInflamabilidad">
                </div>
                <div class="col-md-3 form-group">
                  <label>NFPA Reactiv. (0-4):</label>
                  <input type="number" min="0" max="4" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.nfpaReactividad">
                </div>
                <div class="col-md-3 form-group">
                  <label>Riesgo Específico:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.nfpaEspecifico">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Cantidad Almacenada:</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.cantidadAlmacenada">
                </div>
                <div class="col-md-3 form-group">
                  <label>Unidad:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.unidad">
                </div>
                <div class="col-md-5 form-group">
                  <label>Área Operativa de Uso:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaFichaQuimica.areaUso">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalFichaQuimica.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaFichaQuimica()">
                <i class="fa fa-save"></i> Guardar Ficha MSDS
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL NUEVA FUENTE HUELLA DE CARBONO -->
      @if (mostrarModalHuella()) {
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="panel panel-primary" style="width: 100%; max-width: 580px; margin: 0;">
            <div class="panel-heading" style="background-color: #004B87; display: flex; justify-content: space-between; align-items: center;">
              <h4 class="panel-title"><i class="fa fa-cloud"></i> Registrar Fuente de Emisión GEI ISO 14064</h4>
              <button title="Cerrar" class="btn btn-xs btn-danger" (click)="mostrarModalHuella.set(false)"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-5 form-group">
                  <label>Código GEI:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaHuella.codigo">
                </div>
                <div class="col-md-7 form-group">
                  <label>Alcance GEI (ISO 14064-1):</label>
                  <select class="form-control input-sm" [(ngModel)]="nuevaHuella.alcanceGei">
                    <option value="ALCANCE_1">ALCANCE_1 (Emisiones Directas Combustión/Clinker)</option>
                    <option value="ALCANCE_2">ALCANCE_2 (Energía Eléctrica Red SEIN)</option>
                    <option value="ALCANCE_3">ALCANCE_3 (Transporte y Cadena de Suministro)</option>
                    <option value="MITIGACION">MITIGACION (Coprocesamiento / Reducción)</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Fuente de Emisión o Iniciativa de Descarbonización:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="nuevaHuella.fuenteEmision">
              </div>
              <div class="row">
                <div class="col-md-4 form-group">
                  <label>Emisiones (tCO2e):</label>
                  <input type="number" min="1" class="form-control input-sm" [(ngModel)]="nuevaHuella.emisionesTco2e">
                </div>
                <div class="col-md-4 form-group">
                  <label>Meta Reducción (%):</label>
                  <input type="number" min="1" max="100" class="form-control input-sm" [(ngModel)]="nuevaHuella.metaReduccionPorc">
                </div>
                <div class="col-md-4 form-group">
                  <label>Periodo:</label>
                  <input type="text" class="form-control input-sm" [(ngModel)]="nuevaHuella.periodoReporte">
                </div>
              </div>
            </div>
            <div class="panel-footer" style="text-align: right;">
              <button class="btn btn-sm btn-default" (click)="mostrarModalHuella.set(false)" style="margin-right: 8px;">Cancelar</button>
              <button class="btn btn-sm btn-primary" (click)="guardarNuevaHuella()">
                <i class="fa fa-save"></i> Guardar Registro GEI
              </button>
            </div>
          </div>
        </div>
      }

    </div>

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo11MedioAmbienteComponent implements OnInit {
  readonly mensajeOperacion=signal('');
  readonly workflowSelectionOpen=signal(false);

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly pestana = signal<'RESIDUOS' | 'FICHAS_QUIMICAS' | 'HUELLA_CARBONO'>('RESIDUOS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly notificacion = signal<string>('');

  readonly mostrarModalResiduo = signal<boolean>(false);
  readonly mostrarModalFichaQuimica = signal<boolean>(false);
  readonly mostrarModalHuella = signal<boolean>(false);

  filtroResiduo = '';
  filtroClasificacionResiduo = 'TODOS';
  filtroFichaQuimica = '';
  filtroHuella = '';

  readonly residuos = signal<ResiduoSolidoItem[]>([]);

  readonly fichasQuimicas = signal<FichaQuimicaMatpelItem[]>([]);

  readonly huellaCarbono = signal<HuellaCarbonoGeiItem[]>([]);

  nuevoResiduo = {
    codigo: '',
    tipo: '' as ResiduoSolidoItem['tipo'],
    nombre: '',
    clasificacion: '' as ResiduoSolidoItem['clasificacion'],
    cantidad: 0,
    unidad: '' as ResiduoSolidoItem['unidad'],
    operadorEoRs: ''
  };

  nuevaFichaQuimica = {
    codigo: '',
    productoQuimico: '',
    clasificacionSga: '',
    nfpaSalud: 0,
    nfpaInflamabilidad: 0,
    nfpaReactividad: 0,
    nfpaEspecifico: '',
    cantidadAlmacenada: 0,
    unidad: '',
    areaUso: ''
  };

  nuevaHuella = {
    codigo: '',
    alcanceGei: '' as HuellaCarbonoGeiItem['alcanceGei'],
    fuenteEmision: '',
    emisionesTco2e: 0,
    metaReduccionPorc: 0,
    periodoReporte: ''
  };

  readonly totalEmisionesNetas = computed(() => {
    return this.huellaCarbono().reduce((acc, h) => {
      const val = Number(h.emisionesTco2e) || 0;
      return h.alcanceGei === 'MITIGACION' ? acc - val : acc + val;
    }, 0);
  });


  readonly pageRoutes=['/fichaquimica/lista', '/huella-carbono/lista', '/residuo/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/residuo/lista', { ...{} }).subscribe({next:(response)=>{try{this.residuos.set(confirmedList<ResiduoSolidoItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"tipo","kind":"string","optional":false,"nullable":true},{"name":"nombre","kind":"string","optional":false,"nullable":true},{"name":"clasificacion","kind":"string","optional":false,"nullable":true},{"name":"cantidad","kind":"number","optional":false,"nullable":true},{"name":"unidad","kind":"string","optional":false,"nullable":true},{"name":"operadorEoRs","kind":"string","optional":false,"nullable":true},{"name":"certificadoDisposicion","kind":"string","optional":false,"nullable":true},{"name":"fechaDisposicion","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});

    this.api.callAjaxPost('/fichaquimica/lista', { ...{} }).subscribe({next:(response)=>{try{this.fichasQuimicas.set(confirmedList<FichaQuimicaMatpelItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"productoQuimico","kind":"string","optional":false,"nullable":true},{"name":"clasificacionSga","kind":"string","optional":false,"nullable":true},{"name":"nfpaSalud","kind":"number","optional":false,"nullable":true},{"name":"nfpaInflamabilidad","kind":"number","optional":false,"nullable":true},{"name":"nfpaReactividad","kind":"number","optional":false,"nullable":true},{"name":"nfpaEspecifico","kind":"string","optional":false,"nullable":true},{"name":"cantidadAlmacenada","kind":"number","optional":false,"nullable":true},{"name":"unidad","kind":"string","optional":false,"nullable":true},{"name":"areaUso","kind":"string","optional":false,"nullable":true},{"name":"fichaPdfUrl","kind":"string","optional":false,"nullable":true},{"name":"estado","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
    this.api.callAjaxPost('/huella-carbono/lista', { ...{} }).subscribe({next:(response)=>{try{this.huellaCarbono.set(confirmedList<HuellaCarbonoGeiItem>(response,[{"name":"id","kind":"number","optional":false},{"name":"codigo","kind":"string","optional":false,"nullable":true},{"name":"alcanceGei","kind":"string","optional":false,"nullable":true},{"name":"fuenteEmision","kind":"string","optional":false,"nullable":true},{"name":"emisionesTco2e","kind":"number","optional":false,"nullable":true},{"name":"metaReduccionPorc","kind":"number","optional":false,"nullable":true},{"name":"periodoReporte","kind":"string","optional":false,"nullable":true},{"name":"estadoVerificacion","kind":"string","optional":false,"nullable":true}]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  residuosFiltrados(): ResiduoSolidoItem[] {
    const q = this.filtroResiduo.trim().toLowerCase();
    return this.residuos().filter(r => {
      const okClas = this.filtroClasificacionResiduo === 'TODOS' || r.clasificacion === this.filtroClasificacionResiduo;
      const okTexto = !q || (r.codigo??'').toLowerCase().includes(q) || (r.nombre??'').toLowerCase().includes(q) || (r.operadorEoRs??'').toLowerCase().includes(q);
      return okClas && okTexto;
    });
  }

  fichasQuimicasFiltradas(): FichaQuimicaMatpelItem[] {
    const q = this.filtroFichaQuimica.trim().toLowerCase();
    if (!q) return this.fichasQuimicas();
    return this.fichasQuimicas().filter(f =>
      (f.codigo??'').toLowerCase().includes(q) || (f.productoQuimico??'').toLowerCase().includes(q) || (f.areaUso??'').toLowerCase().includes(q)
    );
  }

  huellaCarbonoFiltrada(): HuellaCarbonoGeiItem[] {
    const q = this.filtroHuella.trim().toLowerCase();
    if (!q) return this.huellaCarbono();
    return this.huellaCarbono().filter(h =>
      (h.codigo??'').toLowerCase().includes(q) || (h.fuenteEmision??'').toLowerCase().includes(q) || (h.alcanceGei??'').toLowerCase().includes(q)
    );
  }

  guardarNuevoResiduo(): void {
    if (!this.nuevoResiduo.nombre.trim()) return;
    this.api.callAjaxPost('/residuo/insert', { ...this.nuevoResiduo, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalResiduo.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarResiduo(item: ResiduoSolidoItem): void {this.workflowSelectionOpen.set(true);}

  eliminarResiduo(item: ResiduoSolidoItem): void {
    this.api.callAjaxPost('/residuo/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevaFichaQuimica(): void {
    if (!this.nuevaFichaQuimica.productoQuimico.trim()) return;
    this.api.callAjaxPost('/fichaquimica/insert', { ...this.nuevaFichaQuimica, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalFichaQuimica.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarFichaQuimica(item: FichaQuimicaMatpelItem): void {this.workflowSelectionOpen.set(true);}

  eliminarFichaQuimica(item: FichaQuimicaMatpelItem): void {
    this.api.callAjaxPost('/fichaquimica/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  guardarNuevaHuella(): void {
    if (!this.nuevaHuella.fuenteEmision.trim()) return;
    this.api.callAjaxPost('/huella-carbono/insert', { ...this.nuevaHuella, ...{} }).subscribe({next:()=>{this.ngOnInit();this.mostrarModalHuella.set(false);this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }



  aprobarHuella(item: HuellaCarbonoGeiItem): void {this.workflowSelectionOpen.set(true);}

  eliminarHuella(item: HuellaCarbonoGeiItem): void {
    this.api.callAjaxPost('/huella-carbono/delete', { id: item.id, expectedVersion: (item as unknown as {version?:string}).version }).subscribe({next:()=>{this.ngOnInit();;this.mensajeOperacion.set('Operación confirmada por el servidor.');},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  exportarCsvResiduos(): void {
    const rows = this.residuos().map(r =>
      `${r.id};"${r.codigo}";"${r.tipo}";"${r.nombre}";"${r.clasificacion}";${r.cantidad};"${r.unidad}";"${r.operadorEoRs}";"${r.certificadoDisposicion}"`
    );
    this.descargarArchivoCsv('MSST_Modulo11_ResiduosEORS.csv', 'ID;Codigo;Tipo;Residuo;Clasificacion;Cantidad;Unidad;EORS;Certificado\n' + rows.join('\n'));
  }

  exportarCsvFichasQuimicas(): void {
    const rows = this.fichasQuimicas().map(f =>
      `${f.id};"${f.codigo}";"${f.productoQuimico}";"${f.clasificacionSga}";"${f.nfpaSalud}-${f.nfpaInflamabilidad}-${f.nfpaReactividad}-${f.nfpaEspecifico}";${f.cantidadAlmacenada};"${f.areaUso}"`
    );
    this.descargarArchivoCsv('MSST_Modulo11_FichasQuimicasMATPEL.csv', 'ID;Codigo;Producto;SGA;NFPA704;Stock;Area\n' + rows.join('\n'));
  }

  exportarCsvHuellaCarbono(): void {
    const rows = this.huellaCarbono().map(h =>
      `${h.id};"${h.codigo}";"${h.alcanceGei}";"${h.fuenteEmision}";${h.emisionesTco2e};${h.metaReduccionPorc};"${h.periodoReporte}"`
    );
    this.descargarArchivoCsv('MSST_Modulo11_HuellaCarbonoISO14064.csv', 'ID;Codigo;Alcance;Fuente;tCO2e;MetaReduccion;Periodo\n' + rows.join('\n'));
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
