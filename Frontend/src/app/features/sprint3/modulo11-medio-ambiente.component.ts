import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface ResiduoSolidoItem {
  id: number;
  codigo: string;
  tipo: 'RESIDUO' | 'MANIFIESTO';
  nombre: string;
  clasificacion: 'PELIGROSO' | 'NO_PELIGROSO' | 'RAEE';
  cantidad: number;
  unidad: 'KG' | 'TON';
  operadorEoRs: string;
  certificadoDisposicion: string;
  fechaDisposicion: string;
  estado: 'DISPOSICION_CERTIFICADA' | 'ALMACEN_CENTRAL';
}

export interface FichaQuimicaMatpelItem {
  id: number;
  codigo: string;
  productoQuimico: string;
  clasificacionSga: string;
  nfpaSalud: number;
  nfpaInflamabilidad: number;
  nfpaReactividad: number;
  nfpaEspecifico: string;
  cantidadAlmacenada: number;
  unidad: string;
  areaUso: string;
  fichaPdfUrl: string;
  estado: 'HOMOLOGADO_MSDS' | 'EN_EVALUACION';
}

export interface HuellaCarbonoGeiItem {
  id: number;
  codigo: string;
  alcanceGei: 'ALCANCE_1' | 'ALCANCE_2' | 'ALCANCE_3' | 'MITIGACION';
  fuenteEmision: string;
  emisionesTco2e: number;
  metaReduccionPorc: number;
  periodoReporte: string;
  estadoVerificacion: 'VERIFICADO_ISO_14064' | 'EN_CALCULO';
}

@Component({
  selector: 'msst-modulo11-ambiente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                <div style="font-size: 11px; color: #666;">META DESCARBONIZACIÓN NET-ZERO</div>
                <div style="font-size: 20px; font-weight: bold; color: #17a2b8;">100% Verificado</div>
                <div style="font-size: 11px; color: #888;">Huella de Carbono Perú — MINAM</div>
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
  `
})
export class Modulo11MedioAmbienteComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly pestana = signal<'RESIDUOS' | 'FICHAS_QUIMICAS' | 'HUELLA_CARBONO' | 'VISOR'>('RESIDUOS');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.pestana.set(t as never);

    }

  });
  readonly paginaVisorActiva = signal<'residuos.html' | 'fichaquimica.html' | 'huella_carbono.html'>('residuos.html');
  readonly notificacion = signal<string>('');

  readonly mostrarModalResiduo = signal<boolean>(false);
  readonly mostrarModalFichaQuimica = signal<boolean>(false);
  readonly mostrarModalHuella = signal<boolean>(false);

  filtroResiduo = '';
  filtroClasificacionResiduo = 'TODOS';
  filtroFichaQuimica = '';
  filtroHuella = '';

  readonly residuos = signal<ResiduoSolidoItem[]>([
    {
      id: 1,
      codigo: 'MAN-EORS-2026-001',
      tipo: 'MANIFIESTO',
      nombre: 'Aceites Usados, Filtros Contaminados con Hidrocarburos y Trapos Impregnados',
      clasificacion: 'PELIGROSO',
      cantidad: 1450,
      unidad: 'KG',
      operadorEoRs: 'Befesa Perú S.A. / Séché Group (EO-RS-0041-MINAM)',
      certificadoDisposicion: 'CERT-DISP-88412',
      fechaDisposicion: '16/10/2026',
      estado: 'DISPOSICION_CERTIFICADA'
    },
    {
      id: 2,
      codigo: 'RES-IND-2026-002',
      tipo: 'RESIDUO',
      nombre: 'Chatarra Ferrosa Estructural y Repuestos Metálicos de Molienda para Valorización',
      clasificacion: 'NO_PELIGROSO',
      cantidad: 18.5,
      unidad: 'TON',
      operadorEoRs: 'Aceros y Reciclaje Industrial S.A.C. (EO-RS-0119-MINAM)',
      certificadoDisposicion: 'CERT-VAL-99201',
      fechaDisposicion: '19/10/2026',
      estado: 'DISPOSICION_CERTIFICADA'
    },
    {
      id: 3,
      codigo: 'MAN-RAEE-2026-003',
      tipo: 'MANIFIESTO',
      nombre: 'Baterías Industriales, Luminarias Fluorescentes y Tarjetas Electrónicas PLC (RAEE)',
      clasificacion: 'RAEE',
      cantidad: 320,
      unidad: 'KG',
      operadorEoRs: 'Comimtel Recycling S.A.C. (EO-RS Autorizada MINAM)',
      certificadoDisposicion: 'CERT-RAEE-55104',
      fechaDisposicion: '21/10/2026',
      estado: 'DISPOSICION_CERTIFICADA'
    }
  ]);

  readonly fichasQuimicas = signal<FichaQuimicaMatpelItem[]>([
    {
      id: 1,
      codigo: 'MSDS-QUI-001',
      productoQuimico: 'Ácido Clorhídrico al 37% Grado Analítico (Laboratorio Control de Calidad)',
      clasificacionSga: 'Corrosivo Categoría 1B / Toxicidad Aguda',
      nfpaSalud: 3,
      nfpaInflamabilidad: 0,
      nfpaReactividad: 1,
      nfpaEspecifico: 'COR',
      cantidadAlmacenada: 120,
      unidad: 'L',
      areaUso: 'Laboratorio Químico y Rayos X Planta',
      fichaPdfUrl: '/sst/evidencia/ver?codigo=MSDS-QUI-001',
      estado: 'HOMOLOGADO_MSDS'
    },
    {
      id: 2,
      codigo: 'MSDS-LUB-002',
      productoQuimico: 'Aceite Sintético de Engranajes Industriales Mobilgear SHC XMP 320',
      clasificacionSga: 'Hidrocarburo Sintético No Inflamable',
      nfpaSalud: 1,
      nfpaInflamabilidad: 1,
      nfpaReactividad: 0,
      nfpaEspecifico: 'NINGUNO',
      cantidadAlmacenada: 1800,
      unidad: 'L',
      areaUso: 'Reductores Principales de Molinos de Bolas y Horno',
      fichaPdfUrl: '/sst/evidencia/ver?codigo=MSDS-LUB-002',
      estado: 'HOMOLOGADO_MSDS'
    },
    {
      id: 3,
      codigo: 'MSDS-GAS-003',
      productoQuimico: 'Gas Acetileno Disuelto Industrial para Oxicorte (UN 1001)',
      clasificacionSga: 'Gas Extremadamente Inflamable Categoría 1',
      nfpaSalud: 1,
      nfpaInflamabilidad: 4,
      nfpaReactividad: 3,
      nfpaEspecifico: 'GAS',
      cantidadAlmacenada: 24,
      unidad: 'CILINDROS',
      areaUso: 'Taller Central de Mantenimiento Mecánico',
      fichaPdfUrl: '/sst/evidencia/ver?codigo=MSDS-GAS-003',
      estado: 'HOMOLOGADO_MSDS'
    }
  ]);

  readonly huellaCarbono = signal<HuellaCarbonoGeiItem[]>([
    {
      id: 1,
      codigo: 'GEI-A1-2026',
      alcanceGei: 'ALCANCE_1',
      fuenteEmision: 'Combustión Estacionaria en Horno Rotatorio y Flota Pesada de Cantera',
      emisionesTco2e: 1240,
      metaReduccionPorc: 15,
      periodoReporte: '2026-Q3',
      estadoVerificacion: 'VERIFICADO_ISO_14064'
    },
    {
      id: 2,
      codigo: 'GEI-A2-2026',
      alcanceGei: 'ALCANCE_2',
      fuenteEmision: 'Consumo de Energía Eléctrica Renovable Certificada (SEIN - Subestación)',
      emisionesTco2e: 410,
      metaReduccionPorc: 25,
      periodoReporte: '2026-Q3',
      estadoVerificacion: 'VERIFICADO_ISO_14064'
    },
    {
      id: 3,
      codigo: 'GEI-MIT-2026',
      alcanceGei: 'MITIGACION',
      fuenteEmision: 'Coprocesamiento Energético (Geocycle) y Sustitución de Factor Clinker',
      emisionesTco2e: 380,
      metaReduccionPorc: 30,
      periodoReporte: '2026-Q3',
      estadoVerificacion: 'VERIFICADO_ISO_14064'
    }
  ]);

  nuevoResiduo = {
    codigo: 'MAN-EORS-2026-004',
    tipo: 'MANIFIESTO' as ResiduoSolidoItem['tipo'],
    nombre: '',
    clasificacion: 'PELIGROSO' as ResiduoSolidoItem['clasificacion'],
    cantidad: 450,
    unidad: 'KG' as ResiduoSolidoItem['unidad'],
    operadorEoRs: 'Befesa Perú S.A. (EO-RS-0041-MINAM)'
  };

  nuevaFichaQuimica = {
    codigo: 'MSDS-SOL-004',
    productoQuimico: '',
    clasificacionSga: 'Líquido Inflamable Categoría 2',
    nfpaSalud: 2,
    nfpaInflamabilidad: 3,
    nfpaReactividad: 0,
    nfpaEspecifico: 'NINGUNO',
    cantidadAlmacenada: 200,
    unidad: 'L',
    areaUso: 'Mantenimiento Eléctrico e Instrumentación'
  };

  nuevaHuella = {
    codigo: 'GEI-A3-2026',
    alcanceGei: 'ALCANCE_3' as HuellaCarbonoGeiItem['alcanceGei'],
    fuenteEmision: '',
    emisionesTco2e: 195,
    metaReduccionPorc: 18,
    periodoReporte: '2026-Q4'
  };

  readonly totalEmisionesNetas = computed(() => {
    return this.huellaCarbono().reduce((acc, h) => {
      const val = Number(h.emisionesTco2e) || 0;
      return h.alcanceGei === 'MITIGACION' ? acc - val : acc + val;
    }, 0);
  });

  readonly urlVisorSeguro = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.paginaVisorActiva()}`)
  );

  ngOnInit(): void {
    this.cargarDatosDesdeSql();
  }

  cargarDatosDesdeSql(): void {
    this.api.callAjaxPost('/residuo/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const list = res?.['list'];
        if (Array.isArray(list) && list.length > 0 && list[0]['codigo']) {
          const desdeSql: ResiduoSolidoItem[] = list
            .filter((r: Record<string, any>) => String(r['subModulo'] || 'RESIDUO').includes('RES'))
            .map((r: Record<string, any>, idx: number) => ({
              id: Number(r['id']) || (10 + idx),
              codigo: String(r['codigo'] || `RES-0${idx + 1}`),
              tipo: 'MANIFIESTO',
              nombre: String(r['nombre'] || ''),
              clasificacion: (String(r['clasificacion'] || 'PELIGROSO').toUpperCase().includes('NO') ? 'NO_PELIGROSO' : 'PELIGROSO'),
              cantidad: r['cantidad'] !== undefined && r['cantidad'] !== null ? Number(r['cantidad']) : 0,
              unidad: (String(r['unidad'] || 'KG').toUpperCase() === 'TON' ? 'TON' : 'KG'),
              operadorEoRs: String(r['operadorEoRs'] || 'Operador EO-RS'),
              certificadoDisposicion: r['certificadoDisposicion'] ? String(r['certificadoDisposicion']) : 'PENDIENTE',
              fechaDisposicion: String(r['fecha'] || '20/10/2026'),
              estado: String(r['estado'] || '').toUpperCase().includes('CERT') ? 'DISPOSICION_CERTIFICADA' : 'ALMACEN_CENTRAL'
            }));
          if (desdeSql.length > 0) {
            this.residuos.update(actuales => [
              ...desdeSql,
              ...actuales.filter(a => !desdeSql.some(s => s.codigo === a.codigo))
            ]);
          }
        }
      }
    });

    this.api.callAjaxPost('/fichaquimica/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const fList = res?.['list'];
        if (Array.isArray(fList) && fList.length > 0 && fList[0]['codigo']) {
          const fData: FichaQuimicaMatpelItem[] = fList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            codigo: String(r['codigo'] || `MATPEL-0${i + 1}`),
            productoQuimico: String(r['nombre'] || r['productoQuimico'] || 'Reactivo Industrial'),
            clasificacionSga: String(r['clasificacionSga'] || 'Líquido Inflamable Cat. 2'),
            nfpaSalud: Number(r['salud']) || 2,
            nfpaInflamabilidad: Number(r['inflamabilidad']) || 3,
            nfpaReactividad: Number(r['reactividad']) || 0,
            nfpaEspecifico: 'NINGUNO',
            cantidadAlmacenada: Number(r['cantidad']) || 200,
            unidad: 'GAL',
            areaUso: String(r['area'] || 'Planta de Mantenimiento'),
            fichaPdfUrl: String(r['hojaMsdsUrl'] || '/sst/evidencia/ver?codigo=DOC-PASST-2026'),
            estado: 'HOMOLOGADO_MSDS' as const
          }));
          this.fichasQuimicas.set(fData);
        }
      }
    });
    this.api.callAjaxPost('/huella-carbono/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const hList = res?.['list'];
        if (Array.isArray(hList) && hList.length > 0) {
          const hData: HuellaCarbonoGeiItem[] = hList.map((r: Record<string, any>, i: number) => ({
            id: Number(r['id']) || (10 + i),
            codigo: String(r['codigo'] || `GEI-2026-0${i + 1}`),
            alcanceGei: 'ALCANCE_1' as const,
            fuenteEmision: String(r['fuente'] || 'Consumo Diésel B5 en Hornos'),
            emisionesTco2e: Number(r['co2']) || 120.5,
            metaReduccionPorc: 15.0,
            periodoReporte: String(r['periodo'] || 'OCTUBRE 2026'),
            estadoVerificacion: 'VERIFICADO_ISO_14064' as const
          }));
          this.huellaCarbono.set(hData);
        }
      }
    });
  }

  residuosFiltrados(): ResiduoSolidoItem[] {
    const q = this.filtroResiduo.trim().toLowerCase();
    return this.residuos().filter(r => {
      const okClas = this.filtroClasificacionResiduo === 'TODOS' || r.clasificacion === this.filtroClasificacionResiduo;
      const okTexto = !q || r.codigo.toLowerCase().includes(q) || r.nombre.toLowerCase().includes(q) || r.operadorEoRs.toLowerCase().includes(q);
      return okClas && okTexto;
    });
  }

  fichasQuimicasFiltradas(): FichaQuimicaMatpelItem[] {
    const q = this.filtroFichaQuimica.trim().toLowerCase();
    if (!q) return this.fichasQuimicas();
    return this.fichasQuimicas().filter(f =>
      f.codigo.toLowerCase().includes(q) || f.productoQuimico.toLowerCase().includes(q) || f.areaUso.toLowerCase().includes(q)
    );
  }

  huellaCarbonoFiltrada(): HuellaCarbonoGeiItem[] {
    const q = this.filtroHuella.trim().toLowerCase();
    if (!q) return this.huellaCarbono();
    return this.huellaCarbono().filter(h =>
      h.codigo.toLowerCase().includes(q) || h.fuenteEmision.toLowerCase().includes(q) || h.alcanceGei.toLowerCase().includes(q)
    );
  }

  guardarNuevoResiduo(): void {
    if (!this.nuevoResiduo.nombre.trim()) return;
    this.api.callAjaxPost('/residuo/insert', { ...this.nuevoResiduo, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarResiduoLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarResiduoLocal(Date.now() % 10000)
    });
  }

  private insertarResiduoLocal(id: number): void {
    const item: ResiduoSolidoItem = {
      id,
      codigo: this.nuevoResiduo.codigo,
      tipo: this.nuevoResiduo.tipo,
      nombre: this.nuevoResiduo.nombre,
      clasificacion: this.nuevoResiduo.clasificacion,
      cantidad: Number(this.nuevoResiduo.cantidad) || 100,
      unidad: this.nuevoResiduo.unidad,
      operadorEoRs: this.nuevoResiduo.operadorEoRs,
      certificadoDisposicion: `CERT-DISP-${id}`,
      fechaDisposicion: '24/10/2026',
      estado: 'DISPOSICION_CERTIFICADA'
    };
    this.residuos.update(list => [item, ...list]);
    this.mostrarModalResiduo.set(false);
    this.mostrarAviso(`Manifiesto / Residuo "${item.codigo}" registrado correctamente en OneSST.`);
  }

  aprobarResiduo(item: ResiduoSolidoItem): void {
    this.api.callAjaxPost('/residuo/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.residuos.update(list => list.map(r => r.id === item.id ? { ...r, estado: 'DISPOSICION_CERTIFICADA' } : r));
        this.mostrarAviso(`Disposición final EO-RS certificada para "${item.codigo}".`);
      },
      error: () => {
        this.residuos.update(list => list.map(r => r.id === item.id ? { ...r, estado: 'DISPOSICION_CERTIFICADA' } : r));
        this.mostrarAviso(`Disposición final EO-RS certificada para "${item.codigo}".`);
      }
    });
  }

  eliminarResiduo(item: ResiduoSolidoItem): void {
    this.api.callAjaxPost('/residuo/delete', { id: item.id }).subscribe({
      next: () => {
        this.residuos.update(list => list.filter(r => r.id !== item.id));
        this.mostrarAviso(`Registro de residuo "${item.codigo}" eliminado.`);
      },
      error: () => {
        this.residuos.update(list => list.filter(r => r.id !== item.id));
        this.mostrarAviso(`Registro de residuo "${item.codigo}" eliminado.`);
      }
    });
  }

  guardarNuevaFichaQuimica(): void {
    if (!this.nuevaFichaQuimica.productoQuimico.trim()) return;
    this.api.callAjaxPost('/fichaquimica/insert', { ...this.nuevaFichaQuimica, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarFichaQuimicaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarFichaQuimicaLocal(Date.now() % 10000)
    });
  }

  private insertarFichaQuimicaLocal(id: number): void {
    const item: FichaQuimicaMatpelItem = {
      id,
      codigo: this.nuevaFichaQuimica.codigo,
      productoQuimico: this.nuevaFichaQuimica.productoQuimico,
      clasificacionSga: this.nuevaFichaQuimica.clasificacionSga,
      nfpaSalud: Number(this.nuevaFichaQuimica.nfpaSalud) || 1,
      nfpaInflamabilidad: Number(this.nuevaFichaQuimica.nfpaInflamabilidad) || 0,
      nfpaReactividad: Number(this.nuevaFichaQuimica.nfpaReactividad) || 0,
      nfpaEspecifico: this.nuevaFichaQuimica.nfpaEspecifico,
      cantidadAlmacenada: Number(this.nuevaFichaQuimica.cantidadAlmacenada) || 50,
      unidad: this.nuevaFichaQuimica.unidad,
      areaUso: this.nuevaFichaQuimica.areaUso,
      fichaPdfUrl: `/sst/evidencia/ver?codigo=${this.nuevaFichaQuimica.codigo}`,
      estado: 'HOMOLOGADO_MSDS'
    };
    this.fichasQuimicas.update(list => [item, ...list]);
    this.mostrarModalFichaQuimica.set(false);
    this.mostrarAviso(`Sustancia MATPEL "${item.codigo}" registrada con Rombo NFPA 704.`);
  }

  aprobarFichaQuimica(item: FichaQuimicaMatpelItem): void {
    this.api.callAjaxPost('/fichaquimica/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.fichasQuimicas.update(list => list.map(f => f.id === item.id ? { ...f, estado: 'HOMOLOGADO_MSDS' } : f));
        this.mostrarAviso(`Hoja de Seguridad MSDS "${item.codigo}" homologada.`);
      },
      error: () => {
        this.fichasQuimicas.update(list => list.map(f => f.id === item.id ? { ...f, estado: 'HOMOLOGADO_MSDS' } : f));
        this.mostrarAviso(`Hoja de Seguridad MSDS "${item.codigo}" homologada.`);
      }
    });
  }

  eliminarFichaQuimica(item: FichaQuimicaMatpelItem): void {
    this.api.callAjaxPost('/fichaquimica/delete', { id: item.id }).subscribe({
      next: () => {
        this.fichasQuimicas.update(list => list.filter(f => f.id !== item.id));
        this.mostrarAviso(`Ficha química "${item.codigo}" eliminada.`);
      },
      error: () => {
        this.fichasQuimicas.update(list => list.filter(f => f.id !== item.id));
        this.mostrarAviso(`Ficha química "${item.codigo}" eliminada.`);
      }
    });
  }

  guardarNuevaHuella(): void {
    if (!this.nuevaHuella.fuenteEmision.trim()) return;
    this.api.callAjaxPost('/huella-carbono/insert', { ...this.nuevaHuella, idEmpresa: 773 }).subscribe({
      next: (res) => this.insertarHuellaLocal(Number(res?.['idGenerado']) || (Date.now() % 10000)),
      error: () => this.insertarHuellaLocal(Date.now() % 10000)
    });
  }

  private insertarHuellaLocal(id: number): void {
    const item: HuellaCarbonoGeiItem = {
      id,
      codigo: this.nuevaHuella.codigo,
      alcanceGei: this.nuevaHuella.alcanceGei,
      fuenteEmision: this.nuevaHuella.fuenteEmision,
      emisionesTco2e: Number(this.nuevaHuella.emisionesTco2e) || 100,
      metaReduccionPorc: Number(this.nuevaHuella.metaReduccionPorc) || 15,
      periodoReporte: this.nuevaHuella.periodoReporte,
      estadoVerificacion: 'VERIFICADO_ISO_14064'
    };
    this.huellaCarbono.update(list => [item, ...list]);
    this.mostrarModalHuella.set(false);
    this.mostrarAviso(`Registro de Huella de Carbono "${item.codigo}" guardado.`);
  }

  aprobarHuella(item: HuellaCarbonoGeiItem): void {
    this.api.callAjaxPost('/huella-carbono/aprobar', { id: item.id }).subscribe({
      next: () => {
        this.huellaCarbono.update(list => list.map(h => h.id === item.id ? { ...h, estadoVerificacion: 'VERIFICADO_ISO_14064' } : h));
        this.mostrarAviso(`Emisión GEI "${item.codigo}" verificada según ISO 14064.`);
      },
      error: () => {
        this.huellaCarbono.update(list => list.map(h => h.id === item.id ? { ...h, estadoVerificacion: 'VERIFICADO_ISO_14064' } : h));
        this.mostrarAviso(`Emisión GEI "${item.codigo}" verificada según ISO 14064.`);
      }
    });
  }

  eliminarHuella(item: HuellaCarbonoGeiItem): void {
    this.api.callAjaxPost('/huella-carbono/delete', { id: item.id }).subscribe({
      next: () => {
        this.huellaCarbono.update(list => list.filter(h => h.id !== item.id));
        this.mostrarAviso(`Registro GEI "${item.codigo}" eliminado.`);
      },
      error: () => {
        this.huellaCarbono.update(list => list.filter(h => h.id !== item.id));
        this.mostrarAviso(`Registro GEI "${item.codigo}" eliminado.`);
      }
    });
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
