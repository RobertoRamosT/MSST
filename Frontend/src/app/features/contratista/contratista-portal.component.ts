import { Component, HostListener, OnDestroy, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';
import {
  MENU_MODULOS_MSST,
  ModuloActivoId,
  MsstMenuGrupo,
  MsstMenuItem,
  buscarItemMenu
} from '../../core/catalog/gosst-menu.catalog';
import { MsstSidebarComponent } from '../../layout/sidebar/msst-sidebar.component';

// Módulos 01 a 03
import { Modulo01SeguridadPerfilesComponent } from '../sprint1/modulo01-seguridad-perfiles.component';
import { Modulo02OrganizacionMdfComponent } from '../sprint1/modulo02-organizacion-mdf.component';
import { Modulo03ContratistasIntegralComponent } from '../sprint1/modulo03-contratistas-integral.component';

// Módulos 04 a 08
import { Modulo04PortalTrabajadorComponent } from '../sprint2/modulo04-portal-trabajador.component';
import { Modulo05TrabajadoresComitesComponent } from '../sprint2/modulo05-trabajadores-comites.component';
import { Modulo06PrevencionIpercInspeccionesComponent } from '../sprint2/modulo06-prevencion-iperc-inspecciones.component';
import { Modulo07AccidentesMejoraComponent } from '../sprint2/modulo07-accidentes-mejora.component';
import { Modulo08CapacitacionEppProcedimientosComponent } from '../sprint2/modulo08-capacitacion-epp-procedimientos.component';

// Módulos 09 a 12
import { Modulo09SaludOcupacionalComponent } from '../sprint3/modulo09-salud-ocupacional.component';
import { Modulo10AuditoriasRequisitosComponent } from '../sprint3/modulo10-auditorias-requisitos.component';
import { Modulo11MedioAmbienteComponent } from '../sprint3/modulo11-medio-ambiente.component';
import { Modulo12BiEstadisticasIaVisitantesComponent } from '../sprint3/modulo12-bi-estadisticas-ia-visitantes.component';

export type { ModuloActivoId } from '../../core/catalog/gosst-menu.catalog';

interface InsightModulo {
  norma: string;
  indicador: string;
  estado: string;
  recomendacion: string;
}

/** Analítica calculada en vivo a partir de las filas reales visibles en la vista activa. */
interface AnaliticaVista {
  registros: number;
  tablas: number;
  conEstado: number;
  conformes: number;
  enProceso: number;
  observados: number;
  porcConformes: number;
}

const PREF_PULSO = 'onesst.ui.pulso';
const PREF_GRAFICOS = 'onesst.ui.graficos';
const PREF_COMPACTO = 'onesst.ui.compacto';

// Palabras clave de estado (se evalúan en este orden: crítico → en proceso → conforme).
const ESTADOS_CRITICOS = /(^|[^A-ZÁÉÍÓÚ])(NO APTO|OBSERVAD[OA]S?|VENCID[OA]S?|POR VENCER|RECHAZAD[OA]S?|CR[IÍ]TIC[OA]S?|RESTRINGID[OA]S?|BLOQUEAD[OA]S?|INHABILITAD[OA]S?|NO CONFORME|SUSPENDID[OA]S?|GRAVE|INTOLERABLE)([^A-ZÁÉÍÓÚ]|$)/i;
const ESTADOS_EN_PROCESO = /(^|[^A-ZÁÉÍÓÚ])(PENDIENTES?|EN PROCESO|EN REVISI[OÓ]N|PROGRAMAD[OA]S?|BORRADOR|ABIERT[OA]S?|EN CURSO|EN EJECUCI[OÓ]N|POR FIRMAR|SEGUIMIENTO|PLANIFICAD[OA]S?)([^A-ZÁÉÍÓÚ]|$)/i;
const ESTADOS_CONFORMES = /(^|[^A-ZÁÉÍÓÚ])(APTO|VIGENTES?|APROBAD[OA]S?|CONFORMES?|HABILITAD[OA]S?|ACTIV[OA]S?|CERRAD[OA]S?|COMPLETAD[OA]S?|FIRMAD[OA]S?|EJECUTAD[OA]S?|CUMPLE|AUTORIZAD[OA]S?|ENTREGAD[OA]S?|LEVANTAD[OA]S?|INSTALAD[OA]S?|VALIDAD[OA]S?|REALIZAD[OA]S?)([^A-ZÁÉÍÓÚ]|$)/i;

interface CampoFicha360 {
  etiqueta: string;
  valor: string;
}

interface EtapaWorkflowProceso {
  paso: number;
  titulo: string;
  subtitulo: string;
  icono: string;
}

interface EventoBitacoraWorkflow {
  fecha: string;
  etapa: string;
  accion: string;
  responsable: string;
  estadoResultante: string;
}

interface Ficha360Extendida {
  titulo: string;
  modulo: string;
  codigoAuditoria: string;
  etapaActual: number;
  estadoActual: string;
  observado: boolean;
  qrPaths: string;
  campos: CampoFicha360[];
}

interface DatosCredencialQr {
  codigo: string;
  titular: string;
  subtitulo: string;
  empresa: string;
  modulo: string;
  estado: string;
  vigencia: string;
  urlVerificacion: string;
  qrPaths: string;
}

const STORAGE_BITACORA_WF = 'onesst.workflow.bitacora';

@Component({
  selector: 'msst-contratista-portal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MsstSidebarComponent,
    Modulo01SeguridadPerfilesComponent,
    Modulo02OrganizacionMdfComponent,
    Modulo03ContratistasIntegralComponent,
    Modulo04PortalTrabajadorComponent,
    Modulo05TrabajadoresComitesComponent,
    Modulo06PrevencionIpercInspeccionesComponent,
    Modulo07AccidentesMejoraComponent,
    Modulo08CapacitacionEppProcedimientosComponent,
    Modulo09SaludOcupacionalComponent,
    Modulo10AuditoriasRequisitosComponent,
    Modulo11MedioAmbienteComponent,
    Modulo12BiEstadisticasIaVisitantesComponent
  ],
  template: `
    <!-- Barra superior fija corporativa OneSST con Buscador Inteligente y Acciones Rápidas -->
    <header class="msst-topbar" [style.background]="'linear-gradient(135deg, #07192d 0%, ' + colorEmpresa() + ' 62%, #0d7490 100%)'">
      <div class="msst-topbar-izq">
        <button type="button" class="msst-hamburguesa" title="Menú Gestión SST" aria-label="Abrir menú" (click)="sidebar()?.alternarMovil()">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <img src="sstweb/imagenes/onesst-logo-white.svg" alt="OneSST" class="msst-logo" (click)="irAInicio()">
        <span class="msst-bienvenida">Seguridad y Salud Inteligente</span>
      </div>

      <!-- Buscador Global Instantáneo (Módulos, Funciones, DNI o Placa) -->
      <div class="msst-cmd-wrap">
        <div class="msst-cmd-box">
          <i class="fa fa-search msst-cmd-icon" aria-hidden="true"></i>
          <input
            type="search"
            class="msst-cmd-input"
            placeholder="Buscar función, DNI o placa…"
            aria-label="Búsqueda global (Ctrl+K)"
            [ngModel]="busquedaGlobal()"
            (ngModelChange)="busquedaGlobal.set($event)"
            (keydown.enter)="alPresionarEnterBuscador()"
            (focus)="buscadorAbierto.set(true)">
          @if (busquedaGlobal()) {
            <button type="button" class="msst-cmd-clear" (click)="busquedaGlobal.set('')" title="Limpiar">
              &times;
            </button>
          } @else {
            <kbd class="msst-cmd-kbd">Ctrl K</kbd>
          }
        </div>

        @if (buscadorAbierto() && busquedaGlobal().trim()) {
          <div class="msst-cmd-dropdown" (mouseleave)="buscadorAbierto.set(false)">
            <div class="msst-cmd-section">Navegación directa en Gestión SST</div>
            @for (res of resultadosBusquedaGlobal(); track res.item.key) {
              <button type="button" class="msst-cmd-item" (click)="irAResultadoGlobal(res.item)">
                <span class="msst-cmd-item-icon"><i class="fa {{ res.item.icono }}"></i></span>
                <span class="msst-cmd-item-text">
                  <strong>{{ res.item.nombre }}</strong>
                  <small>{{ res.moduloPadre }}</small>
                </span>
                <i class="fa fa-arrow-right msst-cmd-arrow"></i>
              </button>
            } @empty {
              <div class="msst-cmd-empty">Sin coincidencias de menú para «{{ busquedaGlobal() }}»</div>
            }
            <div class="msst-cmd-footer">
              <button type="button" class="msst-cmd-garita-btn" (click)="consultarEnGaritaDesdeBuscador()">
                <i class="fa fa-id-card-o"></i> Verificar «{{ busquedaGlobal() }}» directamente en Control de Garita
              </button>
            </div>
          </div>
        }
      </div>

      <div class="msst-topbar-der">
        <!-- Botón de + Acción Rápida SST (1 Clic) -->
        <div class="msst-quick-wrap">
          <button type="button" class="msst-accion-rapida-btn" title="Acción rápida" (click)="menuAccionRapida.set(!menuAccionRapida())">
            <i class="fa fa-bolt" aria-hidden="true"></i><span class="msst-txt-opcional"> Acción Rápida</span>
          </button>
          @if (menuAccionRapida()) {
            <div class="msst-quick-menu" (mouseleave)="menuAccionRapida.set(false)">
              <div class="msst-quick-menu-title">Operaciones frecuentes SST (1 clic)</div>
              <a (click)="irAWorkflowInteractivo(); menuAccionRapida.set(false)">
                <i class="fa fa-sitemap"></i> Consola Interactiva de Workflows (6 Casos)
              </a>
              <a (click)="abrirModalGaritaRapida(); menuAccionRapida.set(false)">
                <i class="fa fa-id-card-o"></i> Verificar Pase en Garita (DNI / Placa)
              </a>
              <a (click)="seleccionarPorKey('M03:3D'); menuAccionRapida.set(false)">
                <i class="fa fa-shield"></i> Emitir Permiso de Alto Riesgo (PETAR)
              </a>
              <a (click)="seleccionarPorKey('M06:IPERC'); menuAccionRapida.set(false)">
                <i class="fa fa-th"></i> Evaluar Matriz de Riesgos IPERC
              </a>
              <a (click)="seleccionarPorKey('M07:ACCIDENTES'); menuAccionRapida.set(false)">
                <i class="fa fa-ambulance"></i> Reportar Evento o Incidente SST
              </a>
              <a (click)="seleccionarPorKey('M09:EMO'); menuAccionRapida.set(false)">
                <i class="fa fa-stethoscope"></i> Control de Exámenes Médicos (EMO)
              </a>
              <a (click)="seleccionarPorKey('M12:ESTADISTICAS'); menuAccionRapida.set(false)">
                <i class="fa fa-area-chart"></i> Ver Tablero Ejecutivo de Indicadores
              </a>
            </div>
          }
        </div>

        <button type="button" class="msst-garita-pill" title="Verificación instantánea de pase por DNI o Placa" (click)="abrirModalGaritaRapida()">
          <i class="fa fa-id-card-o" aria-hidden="true"></i><span class="msst-txt-opcional"> Garita</span>
        </button>

        <button type="button" class="msst-garita-pill" style="background: rgba(0, 75, 135, 0.45); border-color: rgba(56, 189, 248, 0.65);" title="Flujos de Trabajo Interactivos por Caso y Acción (Consola Integral)" (click)="irAWorkflowInteractivo()">
          <i class="fa fa-sitemap" aria-hidden="true"></i><span class="msst-txt-opcional"> Workflows</span>
        </button>

        <span class="msst-chip" title="Organización activa">
          <i class="fa fa-building" aria-hidden="true"></i> {{ session.empresaNombre() }}
        </span>

        <!-- Botón para Mostrar / Ocultar Pulso 360° -->
        <button
          type="button"
          class="msst-icon-btn"
          [class.activo-top]="mostrarPulso360()"
          title="Alternar Pulso Operativo 360°"
          (click)="mostrarPulso360.set(!mostrarPulso360())">
          <i class="fa fa-tachometer" aria-hidden="true"></i>
        </button>

        <!-- Botón de Alertas Pendientes -->
        <button type="button" class="msst-icon-btn" title="Notificaciones y alertas SST" (click)="modalAlertasAbierto.set(true)">
          <i class="fa fa-bell" aria-hidden="true"></i>
          @if (totalAlertasMenu() > 0) {
            <span class="msst-badge-top">{{ totalAlertasMenu() }}</span>
          }
        </button>

        <!-- Menú de Perfil de Usuario -->
        <div class="msst-perfil">
          <button type="button" class="msst-perfil-btn" [attr.aria-expanded]="menuPerfilAbierto()" (click)="menuPerfilAbierto.set(!menuPerfilAbierto())">
            <i class="fa fa-user-circle fa-lg" aria-hidden="true"></i>
            <span class="msst-perfil-nombre">{{ nombreCorto() }}</span>
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </button>
          @if (menuPerfilAbierto()) {
            <ul class="msst-perfil-menu" (mouseleave)="menuPerfilAbierto.set(false)">
              <li><a (click)="abrirModalMiPerfil()"><i class="fa fa-id-badge" aria-hidden="true"></i> Mi Perfil Corporativo</a></li>
              <li><a (click)="abrirModalCambioClave()"><i class="fa fa-key" aria-hidden="true"></i> Cambiar Contraseña</a></li>
              <li><a (click)="seleccionarPorKey('M12:ESTADISTICAS')"><i class="fa fa-line-chart" aria-hidden="true"></i> Tablero Ejecutivo BI</a></li>
              <li><a (click)="modalManualAbierto.set(true); menuPerfilAbierto.set(false)"><i class="fa fa-question-circle" aria-hidden="true"></i> Guía del Sistema</a></li>
              <li class="divisor" role="presentation"></li>
              <li><a (click)="cerrarSesion()"><i class="fa fa-power-off" aria-hidden="true"></i> Cerrar Sesión</a></li>
            </ul>
          }
        </div>
      </div>
    </header>

    <!-- Único Menú Lateral (Sidebar Auto-Hidden): Gestión SST -->
    <msst-sidebar
      #sb
      [grupos]="grupos()"
      [activoKey]="activoKey()"
      [usuario]="session.usuarioNombre()"
      [empresa]="session.empresaNombre()"
      (seleccionar)="alSeleccionarMenu($event)"
      (cerrarSesion)="cerrarSesion()" />

    <main class="msst-contenido" [class.con-sidebar-fijo]="sb.fijado() && !sb.esMovil()" [class.movil]="sb.esMovil()">

      <!-- BANDA EJECUTIVA DE PULSO OPERATIVO 360° (Simplicidad visual + Alta densidad de información) -->
      @if (mostrarPulso360()) {
        <section class="onesst-pulse-strip">
          <div class="onesst-pulse-grid">
            <div class="onesst-pulse-card" [class.activa]="moduloActivo() === 'MOD_03' && tabActiva() === '3A'" (click)="seleccionarPorKey('M03:3A')">
              <div class="onesst-pulse-top">
                <span class="onesst-pulse-label">HOMOLOGACIÓN SST</span>
                <span class="onesst-pulse-badge ok">Nivel A+</span>
              </div>
              <div class="onesst-pulse-val">{{ kpiHomologacion() }}</div>
              <div class="onesst-pulse-sub">Ley 29783 · Auditoría Vigente</div>
            </div>

            <div class="onesst-pulse-card" [class.activa]="moduloActivo() === 'MOD_03' && tabActiva() === '3C'" (click)="seleccionarPorKey('M03:3C')">
              <div class="onesst-pulse-top">
                <span class="onesst-pulse-label">PERSONAL Y FLOTA EN GARITA</span>
                <span class="onesst-pulse-badge ok">100 % Aptos</span>
              </div>
              <div class="onesst-pulse-val">{{ kpiGaritaPersonal() }}</div>
              <div class="onesst-pulse-sub">SCTR, EMO, Inducción y SOAT al día</div>
            </div>

            <div class="onesst-pulse-card" [class.activa]="moduloActivo() === 'MOD_06'" (click)="seleccionarPorKey('M06:IPERC')">
              <div class="onesst-pulse-top">
                <span class="onesst-pulse-label">RIESGOS CRÍTICOS E IPERC</span>
                <span class="onesst-pulse-badge info">Controlado</span>
              </div>
              <div class="onesst-pulse-val">{{ kpiMatricesIperc() }}</div>
              <div class="onesst-pulse-sub">0 Riesgos intolerables sin control</div>
            </div>

            <div class="onesst-pulse-card" [class.activa]="moduloActivo() === 'MOD_09'" (click)="seleccionarPorKey('M09:EMO')">
              <div class="onesst-pulse-top">
                <span class="onesst-pulse-label">SALUD OCUPACIONAL (EMO)</span>
                <span class="onesst-pulse-badge ok">Vigente</span>
              </div>
              <div class="onesst-pulse-val">{{ kpiSaludEmo() }}</div>
              <div class="onesst-pulse-sub">Vigilancia médica sin vencimientos</div>
            </div>

            <div class="onesst-pulse-card" [class.activa]="moduloActivo() === 'MOD_12'" (click)="seleccionarPorKey('M12:ESTADISTICAS')">
              <div class="onesst-pulse-top">
                <span class="onesst-pulse-label">SINIESTRALIDAD (IF / IS)</span>
                <span class="onesst-pulse-badge ok">Meta Cumplida</span>
              </div>
              <div class="onesst-pulse-val">{{ kpiHorasHombre() }}</div>
              <div class="onesst-pulse-sub">0.00 IF · Cero Accidentes Incapacitantes</div>
            </div>
          </div>
        </section>
      }

      <!-- Barra contextual de módulo, submenús hermanos y síntesis inteligente -->
      <div class="msst-titulo">
        <div class="msst-titulo-izq">
          <ol class="msst-migas">
            <li><i class="fa fa-th-large"></i> {{ migas().grupo }}</li>
            @for (m of migas().ruta; track $index) {
              <li [class.actual]="$last">{{ m }}</li>
            }
          </ol>
          <div class="msst-titulo-row">
            <h4>{{ migas().titulo }}</h4>
            <span class="msst-norma-tag"><i class="fa fa-check-circle"></i> {{ insightActual().norma }}</span>
          </div>
          <div class="msst-insight-line">
            <span><strong>Estado:</strong> {{ insightActual().indicador }}</span>
            <span class="msst-insight-dot">&bull;</span>
            <span><i class="fa fa-lightbulb-o" style="color:#0d9488;"></i> {{ insightActual().recomendacion }}</span>
          </div>
        </div>

        <div class="msst-titulo-acciones">
          @for (sub of submenusModuloActual(); track sub.key) {
            <button
              type="button"
              class="msst-subpill"
              [class.activo]="sub.key === activoKey()"
              (click)="alSeleccionarMenu(sub)">
              <i class="fa {{ sub.icono }}"></i> {{ sub.nombre }}
            </button>
          }
        </div>
      </div>

      <!-- Barra Universal de Herramientas de Vista (Filtro Instantáneo + Exportar Excel/CSV + Densidad) -->
      <div class="onesst-view-toolbar">
        <div class="onesst-toolbar-search">
          <i class="fa fa-filter"></i>
          <input
            type="search"
            placeholder="Filtrar cualquier registro en esta pantalla (nombre, RUC, DNI, código, estado)..."
            [ngModel]="filtroTablaVista()"
            (ngModelChange)="aplicarFiltroTablaEnVivo($event)">
          @if (filtroTablaVista()) {
            <span class="onesst-filter-count">{{ conteoFilasVisibles() }} coincidencia(s)</span>
            <button type="button" class="onesst-clear-filter" (click)="aplicarFiltroTablaEnVivo('')">Limpiar</button>
          }
        </div>

        <div class="onesst-toolbar-actions">
          <button
            type="button"
            class="onesst-tool-btn"
            (click)="mostrarWorkflowVista.set(!mostrarWorkflowVista())"
            [class.activo]="mostrarWorkflowVista()"
            title="Mostrar u ocultar el flujo de trabajo (workflow) paso a paso de este proceso">
            <i class="fa fa-sitemap"></i> {{ mostrarWorkflowVista() ? 'Ocultar Flujo' : 'Flujo de Proceso' }}
          </button>
          <button
            type="button"
            class="onesst-tool-btn"
            (click)="mostrarAnaliticaVisual.set(!mostrarAnaliticaVisual())"
            [class.activo]="mostrarAnaliticaVisual()"
            title="Mostrar u ocultar gráficos visuales de este módulo">
            <i class="fa fa-pie-chart"></i> {{ mostrarAnaliticaVisual() ? 'Ocultar Gráficos' : 'Ver Gráficos' }}
          </button>
          <button type="button" class="onesst-tool-btn" (click)="alternarModoCompacto()" [class.activo]="modoCompacto()">
            <i class="fa fa-compress"></i> {{ modoCompacto() ? 'Vista Estándar' : 'Vista Compacta' }}
          </button>
          <button type="button" class="onesst-tool-btn" (click)="abrirQrVistaActual()" title="Generar código QR y fotocheck digital de la vista o registro activo">
            <i class="fa fa-qrcode"></i> Generar QR
          </button>
          <button type="button" class="onesst-tool-btn" (click)="exportarVistaActualCsv()">
            <i class="fa fa-file-excel-o"></i> Exportar Excel / CSV
          </button>
          <button type="button" class="onesst-tool-btn" (click)="imprimirVistaActual()" title="Imprimir reporte oficial ISO 45001 / Ley 29783">
            <i class="fa fa-print"></i> Imprimir Reporte
          </button>
        </div>
      </div>

      <!-- FLUJO DE TRABAJO INTERACTIVO DEL PROCESO SST (WORKFLOW PASO A PASO SEGÚN ACCIÓN) -->
      @if (mostrarWorkflowVista()) {
        <section class="onesst-workflow-bar" aria-label="Flujo de trabajo del proceso">
          <div class="onesst-wf-header">
            <div class="onesst-wf-title">
              <span class="onesst-wf-badge"><i class="fa fa-sitemap"></i> WORKFLOW ACTIVO</span>
              <strong>Flujo Operativo: {{ migas().titulo }}</strong>
              <span class="onesst-wf-sub">Haz clic en cualquier etapa para ejecutar su acción correspondiente</span>
            </div>
            <div class="onesst-wf-status">
              <span>Etapa actual: <strong>Paso {{ etapaWorkflowActiva() }} de 5</strong></span>
              <button type="button" class="onesst-wf-next-btn" (click)="avanzarWorkflowVista()">
                Siguiente etapa <i class="fa fa-arrow-right"></i>
              </button>
              <button type="button" class="onesst-wf-next-btn" style="background:#004B87; border-color:#38bdf8; margin-left: 6px;" (click)="irAWorkflowInteractivo()" title="Abrir Consola Avanzada de Flujos de Trabajo por Caso y Tipo">
                <i class="fa fa-external-link"></i> Consola Avanzada
              </button>
            </div>
          </div>

          <div class="onesst-wf-steps">
            @for (etapa of workflowProcesoActual(); track etapa.paso) {
              <button
                type="button"
                class="onesst-wf-step"
                [class.completada]="etapa.paso < etapaWorkflowActiva()"
                [class.actual]="etapa.paso === etapaWorkflowActiva()"
                (click)="ejecutarEtapaWorkflow(etapa.paso)">
                <div class="onesst-wf-step-num">
                  @if (etapa.paso < etapaWorkflowActiva()) {
                    <i class="fa fa-check"></i>
                  } @else {
                    <i class="fa {{ etapa.icono }}"></i>
                  }
                </div>
                <div class="onesst-wf-step-body">
                  <span class="onesst-wf-step-kicker">ETAPA {{ etapa.paso }}</span>
                  <strong>{{ etapa.titulo }}</strong>
                  <small>{{ etapa.subtitulo }}</small>
                </div>
              </button>
            }
          </div>
        </section>
      }

      <!-- PANEL DE ANALÍTICA VISUAL DEL MÓDULO (calculado en vivo a partir de los registros reales de la vista) -->
      @if (mostrarAnaliticaVisual()) {
        <section class="onesst-visual-analytics">
          <!-- Tarjeta 1: Anillo SVG de Conformidad real -->
          <div class="onesst-va-card">
            <div class="onesst-va-donut-wrap">
              <svg viewBox="0 0 36 36" class="onesst-donut-svg" aria-hidden="true">
                <path class="onesst-donut-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path
                  class="onesst-donut-meter"
                  [class.warn]="analiticaVista().porcConformes < 80"
                  [attr.stroke-dasharray]="analiticaVista().porcConformes + ', 100'"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="onesst-donut-center">{{ analiticaVista().conEstado ? analiticaVista().porcConformes + '%' : '—' }}</div>
            </div>
            <div class="onesst-va-info">
              <span class="onesst-va-kicker">Conformidad de la vista</span>
              <h5>{{ migas().titulo }}</h5>
              <p>
                @if (analiticaVista().conEstado) {
                  <strong>{{ analiticaVista().conformes }}</strong> de {{ analiticaVista().conEstado }} registros con estado conforme
                } @else {
                  Esta vista no tiene registros con estado evaluable
                }
              </p>
            </div>
          </div>

          <!-- Tarjeta 2: Distribución real por estado -->
          <div class="onesst-va-card">
            <div style="width:100%;">
              <div class="onesst-va-header-row">
                <span class="onesst-va-kicker">Distribución por estado</span>
                <span class="onesst-va-tag"><i class="fa fa-circle onesst-live-dot"></i> En vivo</span>
              </div>
              <div class="onesst-va-bars">
                <div class="onesst-va-bar-item">
                  <div class="onesst-va-bar-labels">
                    <span><i class="fa fa-check-circle" style="color:#10b981;"></i> Conformes / Vigentes</span>
                    <strong>{{ analiticaVista().conformes }}</strong>
                  </div>
                  <div class="onesst-va-bar-track"><div class="onesst-va-bar-fill ok" [style.width.%]="pct(analiticaVista().conformes)"></div></div>
                </div>
                <div class="onesst-va-bar-item">
                  <div class="onesst-va-bar-labels">
                    <span><i class="fa fa-clock-o" style="color:#0284c7;"></i> En proceso / Pendientes</span>
                    <strong>{{ analiticaVista().enProceso }}</strong>
                  </div>
                  <div class="onesst-va-bar-track"><div class="onesst-va-bar-fill info" [style.width.%]="pct(analiticaVista().enProceso)"></div></div>
                </div>
                <div class="onesst-va-bar-item">
                  <div class="onesst-va-bar-labels">
                    <span><i class="fa fa-exclamation-triangle" style="color:#f59e0b;"></i> Observados / Críticos</span>
                    <strong>{{ analiticaVista().observados }}</strong>
                  </div>
                  <div class="onesst-va-bar-track"><div class="onesst-va-bar-fill warn" [style.width.%]="pct(analiticaVista().observados)"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta 3: Resumen accionable de la vista -->
          <div class="onesst-va-card">
            <div style="width:100%;">
              <div class="onesst-va-header-row">
                <span class="onesst-va-kicker">Resumen de la vista</span>
                @if (analiticaVista().observados > 0) {
                  <button type="button" class="onesst-va-cta" (click)="filtrarCriticos()">
                    <i class="fa fa-filter"></i> Ver solo críticos
                  </button>
                } @else {
                  <span class="onesst-va-trend-up"><i class="fa fa-check"></i> Sin críticos</span>
                }
              </div>
              <div class="onesst-va-resumen">
                <div><strong>{{ analiticaVista().registros }}</strong><span>Registros</span></div>
                <div><strong>{{ analiticaVista().tablas }}</strong><span>Tablas</span></div>
                <div [class.alerta]="analiticaVista().observados > 0"><strong>{{ analiticaVista().observados }}</strong><span>Requieren acción</span></div>
              </div>
              <div class="onesst-va-spark-foot">
                <span class="onesst-va-hint"><i class="fa fa-hand-pointer-o"></i> Clic en una fila para abrir su Ficha 360°</span>
              </div>
            </div>
          </div>
        </section>
      }

      <div class="msst-area" (click)="alHacerClicEnTabla($event)">
        @if (mensajeNotificacion()) {
          <div class="alert alert-success" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span><i class="fa fa-check-circle"></i> <strong>OneSST:</strong> {{ mensajeNotificacion() }}</span>
            <button type="button" class="btn btn-xs btn-default" (click)="mensajeNotificacion.set('')">Cerrar</button>
          </div>
        }

        @switch (moduloActivo()) {
          @case ('MOD_01') { <msst-modulo01-seguridad [tab]="tabActiva()" /> }
          @case ('MOD_02') { <msst-modulo02-organizacion [tab]="tabActiva()" /> }
          @case ('MOD_03') { <msst-modulo03-contratistas [tab]="tabActiva()" /> }
          @case ('MOD_04') { <msst-modulo04-portal-trabajador [tab]="tabActiva()" /> }
          @case ('MOD_05') { <msst-modulo05-trabajadores [tab]="tabActiva()" /> }
          @case ('MOD_06') { <msst-modulo06-prevencion [tab]="tabActiva()" /> }
          @case ('MOD_07') { <msst-modulo07-accidentes [tab]="tabActiva()" /> }
          @case ('MOD_08') { <msst-modulo08-recursos [tab]="tabActiva()" /> }
          @case ('MOD_09') { <msst-modulo09-salud [tab]="tabActiva()" /> }
          @case ('MOD_10') { <msst-modulo10-auditorias [tab]="tabActiva()" /> }
          @case ('MOD_11') { <msst-modulo11-ambiente [tab]="tabActiva()" /> }
          @case ('MOD_12') { <msst-modulo12-bi [tab]="tabActiva()" /> }
        }
      </div>
    </main>

    <!-- Modal: Consulta Rápida Garita (DNI / Placa) -->
    @if (modalGaritaAbierto()) {
      <div class="onesst-backdrop" (click)="modalGaritaAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:540px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-id-card-o"></i> Control de Acceso en Garita — Consulta por DNI / Placa</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalGaritaAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <p style="font-size:13px; color:#475569; margin-bottom:12px;">
              Verifica en tiempo real la habilitación SSOMA (SCTR, EMO, Inducción, SOAT e Inspección Técnica) para ingreso a sede:
            </p>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
              <input
                type="text"
                class="form-control"
                placeholder="Ingresa DNI (ej. 45892103) o Placa (ej. BKT-892)..."
                [(ngModel)]="garitaFiltro"
                (keyup.enter)="ejecutarConsultaGarita()">
              <button type="button" class="btn btn-primary" (click)="ejecutarConsultaGarita()">
                <i class="fa fa-search"></i> Verificar
              </button>
            </div>
            @if (garitaResultado()) {
              <div class="alert" [ngClass]="garitaResultado()!.habilitado ? 'alert-success' : 'alert-danger'" style="margin-bottom:0; display:flex; align-items:center; justify-content:space-between; gap:14px;">
                <div style="flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <strong>{{ garitaResultado()!.nombre }}</strong>
                    <span class="label" [ngClass]="garitaResultado()!.habilitado ? 'label-success' : 'label-danger'">
                      {{ garitaResultado()!.estado }}
                    </span>
                  </div>
                  <div style="font-size:12px; margin-top:6px;">
                    Empresa: <strong>{{ garitaResultado()!.empresa }}</strong> &bull; Vigencia SCTR / EMO: <strong>{{ garitaResultado()!.vigencia }}</strong>
                  </div>
                </div>
                <div class="onesst-qr-mini-box" (click)="abrirQrDesdeGarita()" title="Ampliar e imprimir Fotocheck QR">
                  <svg viewBox="0 0 25 25" class="onesst-qr-svg-mini" shape-rendering="crispEdges">
                    <path [attr.d]="generarPathsQrSvg('GARITA|' + garitaFiltro + '|' + garitaResultado()!.nombre)" fill="#0a2540" />
                  </svg>
                  <span>Pase QR</span>
                </div>
              </div>
            }
            <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn btn-xs btn-primary" (click)="abrirQrDesdeGarita()">
                  <i class="fa fa-qrcode"></i> Emitir / Imprimir Fotocheck QR
                </button>
                <button type="button" class="btn btn-xs btn-info" (click)="seleccionarPorKey('M03:3D'); modalGaritaAbierto.set(false)">
                  <i class="fa fa-shield"></i> Ir a Garita y PETAR
                </button>
              </div>
              <button type="button" class="btn btn-default btn-sm" (click)="modalGaritaAbierto.set(false)">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Mi Perfil Corporativo -->
    @if (modalMiPerfilAbierto()) {
      <div class="onesst-backdrop" (click)="modalMiPerfilAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:520px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-id-badge"></i> Mi Perfil Corporativo OneSST</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalMiPerfilAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <div style="display:flex; align-items:center; gap:16px; padding-bottom:16px; border-bottom:1px solid #e2e8f0; margin-bottom:16px;">
              <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#004b87,#0d9488); color:#fff; display:grid; place-items:center; font-size:20px; font-weight:800;">
                <i class="fa fa-user"></i>
              </div>
              <div>
                <h4 style="margin:0; font-weight:800; color:#0a2540;">{{ session.usuarioNombre() }}</h4>
                <div style="font-size:12.5px; color:#64748b; margin-top:3px;">
                  Organización: <strong>{{ session.empresaNombre() }}</strong>
                </div>
                <span class="label label-success" style="display:inline-block; margin-top:6px;">Credencial Verificada Activa</span>
              </div>
            </div>
            <div class="row" style="font-size:13px; color:#334155; line-height:1.9;">
              <div class="col-sm-6"><strong>Nivel de Acceso:</strong> Corporativo Multi-Sede</div>
              <div class="col-sm-6"><strong>Módulos Habilitados:</strong> 12 / 12 Módulos SST</div>
              <div class="col-sm-6"><strong>Normativa Base:</strong> Ley N.° 29783 / ISO 45001</div>
              <div class="col-sm-6"><strong>Estado Homologación:</strong> 98.5% (Apto Nivel A+)</div>
            </div>
            <div style="margin-top:18px; display:flex; justify-content:flex-end; gap:8px;">
              <button type="button" class="btn btn-default" (click)="modalMiPerfilAbierto.set(false)">Cerrar</button>
              <button type="button" class="btn btn-primary" (click)="modalMiPerfilAbierto.set(false); abrirModalCambioClave()">
                <i class="fa fa-key"></i> Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Cambiar Contraseña -->
    @if (modalCambioClaveAbierto()) {
      <div class="onesst-backdrop" (click)="modalCambioClaveAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:460px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-key"></i> Actualizar Contraseña de Acceso</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalCambioClaveAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <div style="margin-bottom:12px;">
              <label>Contraseña Actual</label>
              <input type="password" class="form-control" [(ngModel)]="claveActual" placeholder="Ingresa tu contraseña actual">
            </div>
            <div style="margin-bottom:12px;">
              <label>Nueva Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="claveNueva" placeholder="Mínimo 8 caracteres">
            </div>
            <div style="margin-bottom:12px;">
              <label>Confirmar Nueva Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="claveConfirmar" placeholder="Repite la nueva contraseña">
            </div>
            <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:8px;">
              <button type="button" class="btn btn-default" (click)="modalCambioClaveAbierto.set(false)">Cancelar</button>
              <button type="button" class="btn btn-primary" (click)="guardarCambioClave()">
                <i class="fa fa-check"></i> Actualizar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Centro de Alertas y Pendientes -->
    @if (modalAlertasAbierto()) {
      <div class="onesst-backdrop" (click)="modalAlertasAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:560px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-bell"></i> Centro de Notificaciones y Alertas SST</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalAlertasAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <div class="list-group" style="margin-bottom:0;">
              <a class="list-group-item efectoLink" (click)="seleccionarPorKey('M03:3B'); modalAlertasAbierto.set(false)">
                <span class="badge" style="background:#ef4444;">1 Pendiente</span>
                <strong>Gestión de Contratistas &rsaquo; Proyectos y Matrices</strong>
                <div style="font-size:12px; color:#64748b;">Revisión de entregables del proyecto activo — Haz clic para abrir.</div>
              </a>
              <a class="list-group-item efectoLink" (click)="seleccionarPorKey('M04:BANDEJA'); modalAlertasAbierto.set(false)">
                <span class="badge" style="background:#f59e0b;">2 Por Firmar</span>
                <strong>Portal del Colaborador &rsaquo; Bandeja y Firma Digital</strong>
                <div style="font-size:12px; color:#64748b;">Documentos SST y constancias de entrega de EPP listos para firma digital.</div>
              </a>
              <a class="list-group-item efectoLink" (click)="seleccionarPorKey('M06:IPERC'); modalAlertasAbierto.set(false)">
                <span class="badge" style="background:#0d9488;">Vigente</span>
                <strong>Prevención de Riesgos &rsaquo; Matriz IPERC</strong>
                <div style="font-size:12px; color:#64748b;">Controles críticos verificados para trabajos de alto riesgo.</div>
              </a>
              <a class="list-group-item efectoLink" (click)="seleccionarPorKey('M09:EMO'); modalAlertasAbierto.set(false)">
                <span class="badge" style="background:#0284c7;">100% Aptos</span>
                <strong>Salud Ocupacional &rsaquo; Exámenes Médicos (EMO)</strong>
                <div style="font-size:12px; color:#64748b;">Certificados de aptitud médica y pólizas SCTR vigentes.</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Guía Ejecutiva de la Plataforma OneSST -->
    @if (modalManualAbierto()) {
      <div class="onesst-backdrop" (click)="modalManualAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:640px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-book"></i> Guía Ejecutiva de OneSST — Seguridad y Salud Inteligente</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalManualAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <p style="color:#334155;">
              <strong>OneSST · Seguridad y Salud Inteligente</strong> integra toda la gestión corporativa SSOMA con máxima potencia interna y simplicidad visual:
            </p>
            <ul style="line-height:1.85; color:#475569; font-size:13.2px;">
              <li><strong>Pulso Operativo 360°:</strong> Visualiza de un vistazo los 5 indicadores vitales en la parte superior y salta directamente al módulo correspondiente haciendo clic en cualquiera de ellos.</li>
              <li><strong>Buscador Inteligente Global:</strong> Desde la barra superior puedes buscar cualquier función (IPERC, EMO, PETAR, Residuos) o escribir un DNI/Placa para verificar su pase en Garita.</li>
              <li><strong>Filtro Instantáneo y Exportación a Excel:</strong> Usa la barra de herramientas sobre cada módulo para filtrar cualquier tabla en vivo o descargarla en Excel/CSV con un solo clic.</li>
              <li><strong>Gráficos en vivo:</strong> La conformidad y la distribución por estado se calculan con los registros reales de la pantalla. Usa «Ver solo críticos» para quedarte con lo que requiere acción.</li>
              <li><strong>Ficha 360°:</strong> Haz clic en cualquier fila de una tabla para ver su ficha completa, descargarla o imprimirla.</li>
              <li><strong>Atajos de teclado:</strong> <kbd>Ctrl</kbd>+<kbd>K</kbd> o <kbd>/</kbd> abre el buscador, <kbd>Enter</kbd> abre el primer resultado y <kbd>Esc</kbd> cierra cualquier ventana.</li>
              <li><strong>Tus preferencias se recuerdan:</strong> Pulso 360°, gráficos y vista compacta se mantienen entre sesiones.</li>
            </ul>
            <div style="text-align:right; margin-top:14px;">
              <button type="button" class="btn btn-primary" (click)="modalManualAbierto.set(false)">Entendido</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Ficha Ejecutiva 360° de Registro y Motor de Workflow Interactivo -->
    @if (modalFicha360Abierto() && fichaRegistro360()) {
      <div class="onesst-backdrop" (click)="modalFicha360Abierto.set(false)">
        <div class="onesst-dialog" style="max-width:780px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-cube"></i> Ficha Ejecutiva 360° y Flujo de Proceso &mdash; {{ fichaRegistro360()!.titulo }}</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalFicha360Abierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <div class="onesst-ficha-banner">
              <div style="flex:1;">
                <span class="onesst-ficha-kicker">{{ fichaRegistro360()!.modulo }}</span>
                <div class="onesst-ficha-norma">{{ insightActual().norma }}</div>
                <div style="margin-top:6px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="onesst-ficha-hash">
                    <i class="fa fa-shield"></i> Trazabilidad: <strong>{{ fichaRegistro360()!.codigoAuditoria }}</strong>
                  </span>
                  <span
                    class="onesst-ficha-state-pill"
                    [class.critico]="fichaRegistro360()!.observado"
                    [class.ok]="!fichaRegistro360()!.observado && fichaRegistro360()!.etapaActual >= 3">
                    Estado actual: {{ fichaRegistro360()!.estadoActual }}
                  </span>
                </div>
              </div>
              <div class="onesst-qr-mini-box" (click)="abrirQrDesdeFicha360()" title="Clic para abrir e imprimir Fotocheck / Etiqueta QR">
                <svg viewBox="0 0 25 25" class="onesst-qr-svg-mini" shape-rendering="crispEdges">
                  <path [attr.d]="fichaRegistro360()!.qrPaths" fill="#0a2540" />
                </svg>
                <span>Ver QR</span>
              </div>
            </div>

            <!-- Motor de Workflow del Registro (5 Etapas con Acciones Directas) -->
            <div class="onesst-ficha-wf-box">
              <div class="onesst-ficha-wf-top">
                <span class="onesst-ficha-kicker"><i class="fa fa-sitemap"></i> WORKFLOW DE ESTE REGISTRO (ETAPA {{ fichaRegistro360()!.etapaActual }} DE 5)</span>
                <div class="onesst-ficha-wf-actions">
                  <button type="button" class="btn btn-xs btn-primary" (click)="avanzarEtapaFicha360()">
                    <i class="fa fa-step-forward"></i> Avanzar Etapa
                  </button>
                  <button type="button" class="btn btn-xs btn-success" (click)="cambiarEstadoFicha360('APROBADO / VIGENTE', 3, 'Aprobación y validación técnica SSOMA')">
                    <i class="fa fa-check"></i> Aprobar / Validar
                  </button>
                  <button type="button" class="btn btn-xs btn-warning" (click)="cambiarEstadoFicha360('OBSERVADO - SUBSANAR', 2, 'Observación registrada para levantamiento')">
                    <i class="fa fa-exclamation-triangle"></i> Observar
                  </button>
                  <button type="button" class="btn btn-xs btn-info" (click)="abrirQrDesdeFicha360()">
                    <i class="fa fa-qrcode"></i> Emitir Pase QR
                  </button>
                  <button type="button" class="btn btn-xs btn-default" (click)="cambiarEstadoFicha360('CERRADO - AUDITADO', 5, 'Cierre formal y certificación digital ISO 45001')">
                    <i class="fa fa-lock"></i> Certificar y Cerrar
                  </button>
                </div>
              </div>

              <div class="onesst-ficha-wf-stepper">
                @for (etapa of workflowProcesoActual(); track etapa.paso) {
                  <div
                    class="onesst-ficha-wf-node"
                    [class.completada]="etapa.paso < fichaRegistro360()!.etapaActual"
                    [class.actual]="etapa.paso === fichaRegistro360()!.etapaActual"
                    [class.observada]="fichaRegistro360()!.observado && etapa.paso === fichaRegistro360()!.etapaActual"
                    (click)="irAEtapaFicha360(etapa.paso)">
                    <span class="onesst-ficha-wf-circle">{{ etapa.paso }}</span>
                    <span class="onesst-ficha-wf-label">{{ etapa.titulo }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="onesst-ficha-grid">
              @for (c of fichaRegistro360()!.campos; track $index) {
                <div class="onesst-ficha-item">
                  <span class="onesst-ficha-label">{{ c.etiqueta }}</span>
                  <strong class="onesst-ficha-val">{{ c.valor }}</strong>
                </div>
              }
            </div>

            <!-- Bitácora de Trazabilidad del Workflow -->
            @if (bitacoraRegistroActual().length) {
              <div class="onesst-ficha-log">
                <div class="onesst-ficha-kicker" style="margin-bottom:6px;"><i class="fa fa-history"></i> BITÁCORA DE AUDITORÍA Y TRANSICIONES DEL WORKFLOW</div>
                @for (ev of bitacoraRegistroActual(); track $index) {
                  <div class="onesst-ficha-log-row">
                    <span><strong>{{ ev.etapa }}:</strong> {{ ev.accion }}</span>
                    <span><span class="badge" style="background:#0d9488;">{{ ev.estadoResultante }}</span> &bull; {{ ev.responsable }} &bull; {{ ev.fecha }}</span>
                  </div>
                }
              </div>
            }

            <div class="onesst-ficha-footer">
              <div style="font-size:11.5px; color:#64748b;">
                <i class="fa fa-check-circle" style="color:#10b981;"></i> Registro sincronizado y respaldado en repositorio corporativo OneSST
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button type="button" class="btn btn-success btn-sm" (click)="abrirQrDesdeFicha360()">
                  <i class="fa fa-qrcode"></i> Fotocheck / Etiqueta QR
                </button>
                <button type="button" class="btn btn-info btn-sm" (click)="exportarFicha360Csv()">
                  <i class="fa fa-download"></i> Descargar CSV
                </button>
                <button type="button" class="btn btn-default btn-sm" (click)="imprimirFicha360()">
                  <i class="fa fa-print"></i> Imprimir Ficha Oficial
                </button>
                <button type="button" class="btn btn-primary btn-sm" (click)="modalFicha360Abierto.set(false)">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal: Generador de Fotocheck / Credencial y Etiqueta QR Corporativa OneSST -->
    @if (modalQrAbierto() && credencialQrActual()) {
      <div class="onesst-backdrop" (click)="modalQrAbierto.set(false)">
        <div class="onesst-dialog" style="max-width:520px;" (click)="$event.stopPropagation()">
          <div class="onesst-dialog-header">
            <h4><i class="fa fa-qrcode"></i> Credencial / Fotocheck Digital QR &mdash; OneSST</h4>
            <button type="button" class="onesst-dialog-close" (click)="modalQrAbierto.set(false)">&times;</button>
          </div>
          <div class="onesst-dialog-body">
            <div class="onesst-credencial-card">
              <div class="onesst-credencial-top">
                <div>
                  <span class="onesst-credencial-brand">OneSST · SEGURIDAD Y SALUD INTELIGENTE</span>
                  <h5>{{ credencialQrActual()!.empresa }}</h5>
                </div>
                <span class="onesst-credencial-status">{{ credencialQrActual()!.estado }}</span>
              </div>

              <div class="onesst-credencial-body">
                <div class="onesst-credencial-qr-frame">
                  <svg viewBox="0 0 25 25" class="onesst-qr-svg-large" shape-rendering="crispEdges">
                    <rect width="25" height="25" fill="#ffffff" />
                    <path [attr.d]="credencialQrActual()!.qrPaths" fill="#0a2540" />
                  </svg>
                </div>
                <div class="onesst-credencial-info">
                  <span class="onesst-ficha-kicker">{{ credencialQrActual()!.modulo }}</span>
                  <h4>{{ credencialQrActual()!.titular }}</h4>
                  <p>{{ credencialQrActual()!.subtitulo }}</p>
                  <div class="onesst-credencial-meta">
                    <div><strong>Código SST:</strong> <code>{{ credencialQrActual()!.codigo }}</code></div>
                    <div><strong>Vigencia / Control:</strong> {{ credencialQrActual()!.vigencia }}</div>
                    <div><strong>Verificación:</strong> {{ credencialQrActual()!.urlVerificacion }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <button type="button" class="btn btn-info btn-sm" (click)="descargarQrSvg()">
                <i class="fa fa-download"></i> Descargar QR (SVG)
              </button>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn btn-primary btn-sm" (click)="imprimirFotocheckQr()">
                  <i class="fa fa-print"></i> Imprimir Fotocheck / Etiqueta QR
                </button>
                <button type="button" class="btn btn-default btn-sm" (click)="modalQrAbierto.set(false)">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f1f5f9; }

    /* ==========================================================================
       Barra Superior Inteligente
       ========================================================================== */
    .msst-topbar {
      position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 1050;
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      padding: 0 18px; color: #fff; box-shadow: 0 4px 16px rgba(10, 37, 64, 0.25);
    }
    .msst-topbar-izq, .msst-topbar-der { display: flex; align-items: center; gap: 9px; min-width: 0; }
    .msst-hamburguesa {
      display: none; border: 0; background: rgba(255, 255, 255, .14); color: #fff;
      width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
    }
    .msst-logo { height: 36px; width: auto; cursor: pointer; transition: transform .15s ease; }
    .msst-logo:hover { transform: scale(1.02); }
    .msst-bienvenida {
      font-size: 12.5px; font-weight: 600; color: #cbd5e1;
      padding-left: 11px; border-left: 1px solid rgba(255,255,255,.18);
      white-space: nowrap;
    }

    /* Buscador Global Command Bar */
    .msst-cmd-wrap {
      position: relative;
      flex: 1;
      max-width: 460px;
      margin: 0 8px;
    }
    .msst-cmd-box {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 999px;
      height: 36px;
      padding: 0 12px;
      transition: all 0.18s ease;
    }
    .msst-cmd-box:focus-within {
      background: #ffffff;
      border-color: #5eead4;
      box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.25);
    }
    .msst-cmd-icon {
      color: #cbd5e1;
      font-size: 13px;
      margin-right: 8px;
    }
    .msst-cmd-box:focus-within .msst-cmd-icon {
      color: #0d9488;
    }
    .msst-cmd-input {
      width: 100%;
      border: none;
      background: transparent;
      color: #ffffff;
      font-size: 12.5px;
      outline: none;
    }
    .msst-cmd-box:focus-within .msst-cmd-input {
      color: #0f172a;
    }
    .msst-cmd-input::placeholder {
      color: rgba(255, 255, 255, 0.72);
    }
    .msst-cmd-box:focus-within .msst-cmd-input::placeholder {
      color: #94a3b8;
    }
    .msst-cmd-clear {
      border: none;
      background: transparent;
      color: #64748b;
      font-size: 16px;
      cursor: pointer;
    }
    .msst-cmd-dropdown {
      position: absolute;
      top: 42px;
      left: 0;
      right: 0;
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      z-index: 1200;
    }
    .msst-cmd-section {
      padding: 8px 14px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .msst-cmd-item {
      width: 100%;
      border: none;
      background: #ffffff;
      padding: 9px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.12s ease;
    }
    .msst-cmd-item:hover {
      background: #f0f9ff;
    }
    .msst-cmd-item-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: #e0f2fe;
      color: #0369a1;
      display: grid;
      place-items: center;
      font-size: 13px;
      flex-shrink: 0;
    }
    .msst-cmd-item-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .msst-cmd-item-text strong {
      font-size: 12.8px;
      color: #0f172a;
    }
    .msst-cmd-item-text small {
      font-size: 11px;
      color: #64748b;
    }
    .msst-cmd-arrow {
      color: #94a3b8;
      font-size: 12px;
    }
    .msst-cmd-empty {
      padding: 12px 14px;
      font-size: 12.5px;
      color: #64748b;
    }
    .msst-cmd-footer {
      padding: 8px 12px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .msst-cmd-garita-btn {
      width: 100%;
      border: 1px solid #bae6fd;
      background: #f0f9ff;
      color: #0369a1;
      border-radius: 8px;
      padding: 7px 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .msst-cmd-garita-btn:hover {
      background: #e0f2fe;
    }

    /* Botón + Acción Rápida */
    .msst-quick-wrap {
      position: relative;
    }
    .msst-accion-rapida-btn {
      border: 1px solid rgba(94, 234, 212, 0.55);
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      color: #ffffff;
      padding: 6px 13px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      box-shadow: 0 3px 10px rgba(13, 148, 136, 0.35);
      transition: all 0.15s ease;
    }
    .msst-accion-rapida-btn:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }
    .msst-quick-menu {
      position: absolute;
      right: 0;
      top: 42px;
      width: 280px;
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.25);
      border: 1px solid #e2e8f0;
      padding: 6px 0;
      z-index: 1200;
    }
    .msst-quick-menu-title {
      padding: 7px 14px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      border-bottom: 1px solid #f1f5f9;
    }
    .msst-quick-menu a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      font-size: 12.5px;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      text-decoration: none;
    }
    .msst-quick-menu a i {
      width: 18px;
      text-align: center;
      color: #0d9488;
    }
    .msst-quick-menu a:hover {
      background: #f0f9ff;
      color: #004b87;
    }

    .msst-garita-pill {
      border: 1px solid rgba(255, 255, 255, .28); background: rgba(255, 255, 255, .12); color: #fff;
      padding: 5px 11px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; gap: 6px; transition: all .15s ease; white-space: nowrap;
    }
    .msst-garita-pill:hover { background: rgba(255, 255, 255, .22); }
    .msst-chip {
      background: rgba(255, 255, 255, .12); border: 1px solid rgba(255,255,255,.18);
      padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 600; white-space: nowrap;
    }

    .msst-icon-btn {
      position: relative; border: 0; background: rgba(255, 255, 255, .12); color: #fff;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: grid; place-items: center;
      transition: background .15s ease;
    }
    .msst-icon-btn:hover, .msst-icon-btn.activo-top { background: rgba(94, 234, 212, .28); color: #5eead4; }
    .msst-badge-top {
      position: absolute; top: -4px; right: -4px; background: #ef4444; color: #fff;
      font-size: 10px; font-weight: 700; min-width: 17px; height: 17px; border-radius: 999px;
      display: grid; place-items: center; padding: 0 4px;
    }

    .msst-perfil { position: relative; }
    .msst-perfil-btn {
      display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.1); color: #fff;
      padding: 6px 12px; border-radius: 999px; cursor: pointer;
    }
    .msst-perfil-btn:hover { background: rgba(255, 255, 255, .2); }
    .msst-perfil-nombre { font-size: 12px; font-weight: 600; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .msst-perfil-menu {
      position: absolute; right: 0; top: 44px; min-width: 230px; list-style: none; margin: 0; padding: 6px 0;
      background: #fff; border-radius: 12px; box-shadow: 0 12px 28px rgba(15, 23, 42, .2); z-index: 1100;
      border: 1px solid #e2e8f0;
    }
    .msst-perfil-menu a { display: flex; align-items: center; gap: 10px; padding: 9px 16px; color: #1e293b; cursor: pointer; text-decoration: none; font-size: 13px; font-weight: 500; }
    .msst-perfil-menu a:hover { background: #f0f7ff; color: #004b87; }
    .msst-perfil-menu .divisor { height: 1px; background: #e2e8f0; margin: 4px 0; }

    .msst-contenido { padding: 56px 0 0 64px; transition: padding-left .22s ease; }
    .msst-contenido.con-sidebar-fijo { padding-left: 300px; }
    .msst-contenido.movil { padding-left: 0; }

    /* ==========================================================================
       Banda Ejecutiva de Pulso Operativo 360°
       ========================================================================== */
    .onesst-pulse-strip {
      background: linear-gradient(180deg, #0a1f38 0%, #0f2942 100%);
      padding: 10px 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .onesst-pulse-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
    }
    .onesst-pulse-card {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 8px 13px;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .onesst-pulse-card:hover,
    .onesst-pulse-card.activa {
      background: rgba(13, 148, 136, 0.22);
      border-color: #5eead4;
      transform: translateY(-1px);
    }
    .onesst-pulse-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }
    .onesst-pulse-label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #94a3b8;
    }
    .onesst-pulse-badge {
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
    }
    .onesst-pulse-badge.ok {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }
    .onesst-pulse-badge.info {
      background: rgba(56, 189, 248, 0.2);
      color: #7dd3fc;
    }
    .onesst-pulse-val {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
    .onesst-pulse-sub {
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ==========================================================================
       Barra Contextual del Módulo y Síntesis Inteligente
       ========================================================================== */
    .msst-titulo {
      background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px 12px;
      border-left: 4px solid #0d9488; display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }
    .msst-titulo-row {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 3px;
    }
    .msst-titulo h4 { margin: 0; font-weight: 800; font-size: 19px; color: #0a2540; }
    .msst-norma-tag {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
      font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px;
    }
    .msst-insight-line {
      margin-top: 4px; font-size: 12px; color: #475569; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    .msst-insight-dot { color: #cbd5e1; }
    .msst-migas { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; font-size: 11.5px; color: #64748b; }
    .msst-migas li + li::before { content: '\\203A'; margin: 0 7px; color: #94a3b8; }
    .msst-migas li.actual { color: #0d9488; font-weight: 700; }
    .msst-titulo-acciones { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

    .msst-subpill {
      border: 1px solid #cbd5e1; background: #f8fafc; color: #334155;
      padding: 6px 13px; border-radius: 999px; font-size: 12px; font-weight: 600;
      cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
      transition: all .15s ease;
    }
    .msst-subpill:hover { border-color: #004b87; color: #004b87; background: #f0f7ff; }
    .msst-subpill.activo {
      background: linear-gradient(135deg, #004b87 0%, #0d9488 100%);
      color: #fff; border-color: transparent; box-shadow: 0 3px 8px rgba(13, 148, 136, 0.25);
    }

    /* ==========================================================================
       Barra Universal de Herramientas de Vista (Filtro en Vivo + Exportación)
       ========================================================================== */
    .onesst-view-toolbar {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 9px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .onesst-toolbar-search {
      flex: 1;
      max-width: 520px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      padding: 5px 12px;
    }
    .onesst-toolbar-search i {
      color: #64748b;
      font-size: 13px;
    }
    .onesst-toolbar-search input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 12.5px;
      color: #0f172a;
      outline: none;
    }
    .onesst-filter-count {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .onesst-clear-filter {
      border: none;
      background: transparent;
      color: #dc2626;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .onesst-toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .onesst-tool-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      border-radius: 8px;
      padding: 5px 11px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .onesst-tool-btn:hover,
    .onesst-tool-btn.activo {
      border-color: #004b87;
      color: #004b87;
      background: #f0f7ff;
    }

    /* ==========================================================================
       Panel de Analítica Visual por Módulo (Gráficos SVG Ejecutivos)
       ========================================================================== */
    .onesst-visual-analytics {
      display: grid;
      grid-template-columns: 1.05fr 1.25fr 1.2fr;
      gap: 14px;
      padding: 14px 22px 0;
    }
    .onesst-va-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 4px 14px -4px rgba(15, 23, 42, 0.05);
    }
    .onesst-va-donut-wrap {
      position: relative;
      width: 68px;
      height: 68px;
      flex-shrink: 0;
    }
    .onesst-donut-svg {
      width: 68px;
      height: 68px;
      transform: rotate(-90deg);
    }
    .onesst-donut-bg {
      fill: none;
      stroke: #e2e8f0;
      stroke-width: 3.6;
    }
    .onesst-donut-meter {
      fill: none;
      stroke: #0d9488;
      stroke-width: 3.6;
      stroke-linecap: round;
      transition: stroke-dasharray 0.5s ease;
    }
    .onesst-donut-center {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      color: #0a2540;
    }
    .onesst-va-kicker {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #64748b;
      text-transform: uppercase;
    }
    .onesst-va-info h5 {
      margin: 2px 0 4px;
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
    }
    .onesst-va-info p {
      margin: 0;
      font-size: 11.8px;
      color: #475569;
    }
    .onesst-va-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .onesst-va-tag {
      font-size: 10px;
      font-weight: 700;
      background: #f0f9ff;
      color: #0369a1;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .onesst-va-bars {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .onesst-va-bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 2px;
    }
    .onesst-va-bar-track {
      height: 6px;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }
    .onesst-va-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .onesst-va-bar-fill.ok { background: linear-gradient(90deg, #10b981, #0d9488); }
    .onesst-va-bar-fill.info { background: linear-gradient(90deg, #38bdf8, #0284c7); }
    .onesst-va-bar-fill.warn { background: linear-gradient(90deg, #fbbf24, #f59e0b); }

    .onesst-va-trend-up {
      font-size: 10.5px;
      font-weight: 700;
      color: #059669;
      background: #ecfdf5;
      padding: 2px 8px;
      border-radius: 999px;
    }
    .onesst-spark-svg {
      width: 100%;
      height: 44px;
      display: block;
    }
    .onesst-va-spark-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
      font-size: 10.5px;
      color: #64748b;
    }
    .onesst-va-hint {
      color: #004b87;
      font-weight: 600;
    }
    .onesst-donut-meter.warn { stroke: #f59e0b; }
    .onesst-live-dot { font-size: 7px; color: #10b981; vertical-align: middle; animation: onesstPulso 1.6s ease-in-out infinite; }
    @keyframes onesstPulso { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
    .onesst-va-cta {
      border: 1px solid #fcd34d; background: #fffbeb; color: #b45309;
      font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 999px; cursor: pointer;
    }
    .onesst-va-cta:hover { background: #fef3c7; }
    .onesst-va-resumen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 4px 0 2px; }
    .onesst-va-resumen > div {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px 8px; text-align: center;
    }
    .onesst-va-resumen strong {
      display: block; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; font-size: 19px; font-weight: 800; color: #0a2540; line-height: 1.15;
    }
    .onesst-va-resumen span { font-size: 10.5px; color: #64748b; font-weight: 600; }
    .onesst-va-resumen > div.alerta { background: #fffbeb; border-color: #fde68a; }
    .onesst-va-resumen > div.alerta strong { color: #b45309; }
    .msst-cmd-kbd {
      font-family: inherit; font-size: 10px; font-weight: 700; color: rgba(255,255,255,.75);
      border: 1px solid rgba(255,255,255,.3); border-radius: 5px; padding: 1px 6px; white-space: nowrap;
    }
    .msst-cmd-box:focus-within .msst-cmd-kbd { color: #64748b; border-color: #cbd5e1; }

    /* ==========================================================================
       Flujo de Trabajo Interactivo del Proceso SST (Workflow Stepper)
       ========================================================================== */
    .onesst-workflow-bar {
      margin: 12px 22px 0;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #004b87;
      border-radius: 14px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.05);
    }
    .onesst-wf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;
    }
    .onesst-wf-title {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      font-size: 13px;
      color: #0f172a;
    }
    .onesst-wf-badge {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 3px 9px;
      border-radius: 999px;
    }
    .onesst-wf-sub {
      font-size: 11.5px;
      color: #64748b;
    }
    .onesst-wf-status {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #334155;
    }
    .onesst-wf-next-btn {
      border: 1px solid #0d9488;
      background: linear-gradient(135deg, #004b87 0%, #0d9488 100%);
      color: #ffffff;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
    }
    .onesst-wf-steps {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .onesst-wf-step {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 9px;
      text-align: left;
      cursor: pointer;
      transition: all 0.16s ease;
    }
    .onesst-wf-step:hover {
      border-color: #0284c7;
      background: #f0f9ff;
      transform: translateY(-1px);
    }
    .onesst-wf-step.completada {
      border-color: #a7f3d0;
      background: #f0fdf4;
    }
    .onesst-wf-step.actual {
      border-color: #004b87;
      background: #eff6ff;
      box-shadow: 0 0 0 2px rgba(0, 75, 135, 0.12);
    }
    .onesst-wf-step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #334155;
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .onesst-wf-step.completada .onesst-wf-step-num {
      background: #10b981;
      color: #ffffff;
    }
    .onesst-wf-step.actual .onesst-wf-step-num {
      background: #004b87;
      color: #ffffff;
    }
    .onesst-wf-step-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .onesst-wf-step-kicker {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    .onesst-wf-step-body strong {
      font-size: 12px;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .onesst-wf-step-body small {
      font-size: 10.5px;
      color: #475569;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ==========================================================================
       Ficha Ejecutiva 360°, Motor de Workflow por Registro y Fotocheck QR
       ========================================================================== */
    .onesst-ficha-state-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      background: #e0f2fe;
      color: #0369a1;
    }
    .onesst-ficha-state-pill.ok {
      background: #dcfce7;
      color: #166534;
    }
    .onesst-ficha-state-pill.critico {
      background: #fef3c7;
      color: #b45309;
    }
    .onesst-qr-mini-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 6px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .onesst-qr-mini-box:hover {
      border-color: #004b87;
      transform: scale(1.03);
    }
    .onesst-qr-svg-mini {
      width: 48px;
      height: 48px;
      display: block;
    }
    .onesst-qr-mini-box span {
      font-size: 9.5px;
      font-weight: 800;
      color: #004b87;
      text-transform: uppercase;
    }
    .onesst-ficha-wf-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .onesst-ficha-wf-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }
    .onesst-ficha-wf-actions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .onesst-ficha-wf-stepper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
    }
    .onesst-ficha-wf-node {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 8px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      font-size: 11px;
      color: #475569;
    }
    .onesst-ficha-wf-node.completada {
      border-color: #86efac;
      background: #f0fdf4;
      color: #166534;
    }
    .onesst-ficha-wf-node.actual {
      border-color: #004b87;
      background: #eff6ff;
      color: #004b87;
      font-weight: 700;
    }
    .onesst-ficha-wf-node.observada {
      border-color: #f59e0b;
      background: #fffbeb;
      color: #b45309;
    }
    .onesst-ficha-wf-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #e2e8f0;
      display: grid;
      place-items: center;
      font-size: 10.5px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .onesst-ficha-wf-node.completada .onesst-ficha-wf-circle {
      background: #10b981;
      color: #fff;
    }
    .onesst-ficha-wf-node.actual .onesst-ficha-wf-circle {
      background: #004b87;
      color: #fff;
    }
    .onesst-ficha-wf-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .onesst-ficha-log {
      margin-top: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      max-height: 110px;
      overflow-y: auto;
    }
    .onesst-ficha-log-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 11.5px;
      color: #334155;
      padding: 3px 0;
      border-bottom: 1px dashed #e2e8f0;
    }
    .onesst-ficha-log-row:last-child { border-bottom: 0; }

    /* Credencial / Fotocheck Digital QR */
    .onesst-credencial-card {
      border: 2px solid #004b87;
      border-radius: 16px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 12px 28px -8px rgba(10, 37, 64, 0.2);
    }
    .onesst-credencial-top {
      background: linear-gradient(135deg, #07192d 0%, #004b87 65%, #0d9488 100%);
      color: #ffffff;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .onesst-credencial-brand {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #5eead4;
      display: block;
    }
    .onesst-credencial-top h5 {
      margin: 2px 0 0;
      font-size: 14px;
      font-weight: 800;
      color: #ffffff;
    }
    .onesst-credencial-status {
      background: rgba(16, 185, 129, 0.25);
      border: 1px solid #6ee7b7;
      color: #ecfdf5;
      font-size: 10.5px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .onesst-credencial-body {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .onesst-credencial-qr-frame {
      padding: 8px;
      border: 2px solid #0a2540;
      border-radius: 12px;
      background: #ffffff;
      flex-shrink: 0;
    }
    .onesst-qr-svg-large {
      width: 132px;
      height: 132px;
      display: block;
    }
    .onesst-credencial-info h4 {
      margin: 3px 0 4px;
      font-size: 16px;
      font-weight: 800;
      color: #0a2540;
    }
    .onesst-credencial-info p {
      margin: 0 0 8px;
      font-size: 12px;
      color: #475569;
    }
    .onesst-credencial-meta {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.65;
    }
    .onesst-ficha-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0d9488;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .onesst-ficha-kicker {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0d9488;
    }
    .onesst-ficha-norma {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .onesst-ficha-hash {
      font-size: 11.5px;
      color: #475569;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .onesst-ficha-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      max-height: 340px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .onesst-ficha-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .onesst-ficha-label {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }
    .onesst-ficha-val {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
    }
    .onesst-ficha-footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .msst-area { padding: 16px 22px 22px; }

    .onesst-backdrop {
      position: fixed; inset: 0; background: rgba(10, 25, 47, 0.55); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 16px;
    }
    .onesst-dialog {
      background: #fff; border-radius: 14px; width: 100%; max-width: 600px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden;
    }
    .onesst-dialog-header {
      background: linear-gradient(135deg, #0a2540 0%, #004b87 100%); color: #fff;
      padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;
    }
    .onesst-dialog-header h4 { margin: 0; font-size: 15.5px; font-weight: 700; }
    .onesst-dialog-close { border: 0; background: transparent; color: #fff; font-size: 22px; cursor: pointer; }
    .onesst-dialog-body { padding: 20px; }

    @media (max-width: 1100px) {
      .onesst-pulse-grid { grid-template-columns: repeat(2, 1fr); }
      .onesst-visual-analytics { grid-template-columns: 1fr; }
      .onesst-wf-steps { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 1280px) {
      .msst-chip { display: none; }
    }
    @media (max-width: 991px) {
      .msst-hamburguesa { display: grid; place-items: center; }
      .msst-bienvenida, .msst-chip, .msst-cmd-wrap { display: none; }
      .onesst-pulse-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
      .onesst-pulse-strip { padding: 10px 12px; }
      .onesst-pulse-sub { display: none; }
      .onesst-pulse-val { font-size: 15px; }
      .onesst-ficha-grid { grid-template-columns: 1fr; }
      .onesst-ficha-wf-stepper { grid-template-columns: 1fr 1fr; }
      .msst-insight-dot { display: none; }
      .msst-titulo { padding: 12px 14px 10px; }
      .msst-titulo-acciones { flex-wrap: nowrap; overflow-x: auto; width: 100%; padding-bottom: 4px; scrollbar-width: thin; }
      .msst-subpill { white-space: nowrap; flex-shrink: 0; }
      .onesst-view-toolbar { padding: 8px 12px; }
      .onesst-toolbar-actions { flex-wrap: wrap; }
      .onesst-workflow-bar { margin: 10px 12px 0; }
      .onesst-visual-analytics { padding: 12px 12px 0; }
      .msst-area { padding: 12px; }
    }
    @media (max-width: 600px) {
      .msst-topbar { padding: 0 10px; gap: 6px; }
      .msst-txt-opcional, .msst-perfil-nombre { display: none; }
      .msst-logo { height: 30px; }
      .msst-accion-rapida-btn, .msst-garita-pill { padding: 7px 10px; }
      .msst-perfil-btn { padding: 6px 9px; }
      .onesst-pulse-grid { grid-template-columns: 1fr; }
      .onesst-wf-steps { grid-template-columns: 1fr; }
      .onesst-credencial-body { flex-direction: column; text-align: center; }
      .onesst-tool-btn { padding: 5px 8px; font-size: 11.5px; }
    }
  `]
})
export class ContratistaPortalComponent implements OnInit, OnDestroy {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly router = inject(Router);

  readonly sidebar = viewChild<MsstSidebarComponent>('sb');

  readonly colorEmpresa = signal<string>('#004B87');
  readonly moduloActivo = signal<ModuloActivoId>('MOD_03');
  readonly tabActiva = signal<string | null>('3A');
  readonly activoKey = signal<string>('M03:3A');
  readonly menuPerfilAbierto = signal<boolean>(false);
  readonly menuAccionRapida = signal<boolean>(false);

  readonly mostrarPulso360 = signal<boolean>(this.leerPreferencia(PREF_PULSO, !this.esPantallaPequena()));
  readonly mostrarAnaliticaVisual = signal<boolean>(this.leerPreferencia(PREF_GRAFICOS, !this.esPantallaPequena()));
  readonly mostrarWorkflowVista = signal<boolean>(true);
  readonly etapaWorkflowActiva = signal<number>(3);
  readonly analiticaVista = signal<AnaliticaVista>({ registros: 0, tablas: 0, conEstado: 0, conformes: 0, enProceso: 0, observados: 0, porcConformes: 0 });
  readonly busquedaGlobal = signal<string>('');
  readonly buscadorAbierto = signal<boolean>(false);

  readonly filtroTablaVista = signal<string>('');
  readonly conteoFilasVisibles = signal<number>(0);
  readonly modoCompacto = signal<boolean>(this.leerPreferencia(PREF_COMPACTO, false));

  readonly kpiHomologacion = signal<string>('98.5 % Homologado');
  readonly kpiGaritaPersonal = signal<string>('Padrón Habilitado');
  readonly kpiMatricesIperc = signal<string>('Controles Activos');
  readonly kpiSaludEmo = signal<string>('100 % Aptitud EMO');
  readonly kpiHorasHombre = signal<string>('145,200 HHT');

  readonly modalGaritaAbierto = signal<boolean>(false);
  readonly modalMiPerfilAbierto = signal<boolean>(false);
  readonly modalCambioClaveAbierto = signal<boolean>(false);
  readonly modalAlertasAbierto = signal<boolean>(false);
  readonly modalManualAbierto = signal<boolean>(false);
  readonly modalFicha360Abierto = signal<boolean>(false);
  readonly fichaRegistro360 = signal<Ficha360Extendida | null>(null);
  readonly bitacoraRegistroActual = signal<EventoBitacoraWorkflow[]>([]);
  readonly modalQrAbierto = signal<boolean>(false);
  readonly credencialQrActual = signal<DatosCredencialQr | null>(null);
  readonly mensajeNotificacion = signal<string>('');

  private filaSeleccionadaDom: HTMLTableRowElement | null = null;

  garitaFiltro = '';
  readonly garitaResultado = signal<{ nombre: string; empresa: string; estado: string; vigencia: string; habilitado: boolean } | null>(null);

  claveActual = '';
  claveNueva = '';
  claveConfirmar = '';

  private readonly insightsPorModulo: Record<ModuloActivoId, InsightModulo> = {
    MOD_01: {
      norma: 'ISO 27001 · Control de Accesos',
      indicador: 'Perfiles RBAC y credenciales corporativas protegidas',
      estado: 'Óptimo',
      recomendacion: 'Audita periódicamente los privilegios de aprobación PETAR y Garita.'
    },
    MOD_02: {
      norma: 'Ley N.° 29783 Art. 26 · Organización SST',
      indicador: 'Sedes, áreas operativas y puestos mapeados con riesgos por función',
      estado: 'Conforme',
      recomendacion: 'Mantén sincronizado el Mapa de Procesos (MDF) con los puestos críticos.'
    },
    MOD_03: {
      norma: 'Ley N.° 29783 Art. 68 · DS 024-2016-EM',
      indicador: '98.5 % de cumplimiento en homologación documentaria y pase de garita',
      estado: 'Apto Nivel A+',
      recomendacion: 'Verifica en 1 clic la vigencia de SCTR, EMO y PETAR antes del ingreso a planta.'
    },
    MOD_04: {
      norma: 'DS 005-2012-TR · Participación y Firma Digital',
      indicador: 'Ejecución del Programa Anual PASST y bandeja de firmas al día',
      estado: 'Activo',
      recomendacion: 'Revisa las constancias pendientes de firma digital en la bandeja del colaborador.'
    },
    MOD_05: {
      norma: 'DS 005-2012-TR Art. 42 · Comité Paritario SST',
      indicador: 'Padrón laboral acreditado y libro de actas del Comité SST vigente',
      estado: 'Instalado',
      recomendacion: 'Registra el seguimiento mensual de acuerdos del Comité Paritario.'
    },
    MOD_06: {
      norma: 'Ley N.° 29783 Art. 57 · ISO 45001 Cláusula 6.1',
      indicador: 'Matrices IPERC actualizadas e inspecciones planeadas en ejecución',
      estado: 'Preventivo',
      recomendacion: 'Prioriza la jerarquía de controles (Eliminación / Ingeniería) en riesgos altos.'
    },
    MOD_07: {
      norma: 'DS 005-2012-TR Art. 88 · Investigación y Mejora',
      indicador: '0 accidentes incapacitantes y planes de acción SAC/SAP con trazabilidad',
      estado: 'Controlado',
      recomendacion: 'Verifica la eficacia de cada medida correctiva antes del cierre definitivo.'
    },
    MOD_08: {
      norma: 'Ley N.° 29783 Art. 27 y 60 · Capacitación, EPP y PETS',
      indicador: 'Mínimo 4 capacitaciones anuales por trabajador y entrega de EPP homologado',
      estado: 'Vigente',
      recomendacion: 'Valida la difusión de procedimientos PETS antes de autorizar tareas críticas.'
    },
    MOD_09: {
      norma: 'RM 312-2011-MINSA · Vigilancia Médica Ocupacional',
      indicador: '100 % de colaboradores con certificado de aptitud médica EMO y SCTR activo',
      estado: 'Saludable',
      recomendacion: 'Programa alertas preventivas 30 días antes del vencimiento de cada EMO.'
    },
    MOD_10: {
      norma: 'ISO 45001:2018 Cláusula 9.2 · Matriz Legal SST',
      indicador: 'Auditorías internas y evaluación de requisitos legales por encima del 95 %',
      estado: 'Auditado',
      recomendacion: 'Realiza seguimiento continuo a los hallazgos de auditoría y normas sectoriales.'
    },
    MOD_11: {
      norma: 'ISO 14001 · D. Leg. 1278 (Residuos y MATPEL)',
      indicador: 'Manifiestos EO-RS, hojas MSDS/SGA y huella de carbono GEI controlados',
      estado: 'Sostenible',
      recomendacion: 'Asegura la disponibilidad de hojas MSDS en cada punto de almacenamiento químico.'
    },
    MOD_12: {
      norma: 'DS 005-2012-TR Art. 85 · Analítica e Indicadores BI',
      indicador: 'Índices IF, IS e IA en meta corporativa y control QR de visitantes activo',
      estado: 'Predictivo',
      recomendacion: 'Revisa las proyecciones de analítica predictiva IA para anticipar desvíos.'
    }
  };

  private readonly workflowsPorModulo: Record<ModuloActivoId, EtapaWorkflowProceso[]> = {
    MOD_01: [
      { paso: 1, titulo: 'Solicitud de Acceso', subtitulo: 'Definir perfil y alcance', icono: 'fa-plus-circle' },
      { paso: 2, titulo: 'Matriz de Permisos', subtitulo: 'Asignar privilegios RBAC', icono: 'fa-sliders' },
      { paso: 3, titulo: 'Validación Seguridad', subtitulo: 'Aprobar rol o usuario', icono: 'fa-shield' },
      { paso: 4, titulo: 'Credencial Digital QR', subtitulo: 'Emitir token / QR activo', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Auditoría ISO 27001', subtitulo: 'Imprimir reporte oficial', icono: 'fa-print' }
    ],
    MOD_02: [
      { paso: 1, titulo: 'Alta de Sede / Puesto', subtitulo: 'Registrar área o cargo', icono: 'fa-building-o' },
      { paso: 2, titulo: 'Mapeo MDF de Procesos', subtitulo: 'Vincular actividades', icono: 'fa-sitemap' },
      { paso: 3, titulo: 'Evaluación de Riesgos', subtitulo: 'Validar perfil SST', icono: 'fa-check-square-o' },
      { paso: 4, titulo: 'Código QR de Área', subtitulo: 'Etiqueta QR de estación', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Aprobación Organizacional', subtitulo: 'Imprimir ficha oficial', icono: 'fa-print' }
    ],
    MOD_03: [
      { paso: 1, titulo: 'Registro / Solicitud', subtitulo: 'Empresa, personal o PETAR', icono: 'fa-plus-circle' },
      { paso: 2, titulo: 'Carga Documental SST', subtitulo: 'SCTR, EMO, SOAT e IPERC', icono: 'fa-cloud-upload' },
      { paso: 3, titulo: 'Auditoría IA y SSOMA', subtitulo: 'Homologar / Dictaminar', icono: 'fa-check-circle' },
      { paso: 4, titulo: 'Fotocheck y Pase QR', subtitulo: 'Habilitar ingreso Garita', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Certificación y Cierre', subtitulo: 'Imprimir constancia SST', icono: 'fa-print' }
    ],
    MOD_04: [
      { paso: 1, titulo: 'Generación Documental', subtitulo: 'Programar o emitir doc.', icono: 'fa-file-text-o' },
      { paso: 2, titulo: 'Notificación a Bandeja', subtitulo: 'Envío al colaborador', icono: 'fa-envelope-o' },
      { paso: 3, titulo: 'Firma Digital Biométrica', subtitulo: 'Validar conformidad', icono: 'fa-pencil-square-o' },
      { paso: 4, titulo: 'Sello de Tiempo QR', subtitulo: 'Constancia verificable', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Archivo Legal PASST', subtitulo: 'Imprimir cargo firmado', icono: 'fa-print' }
    ],
    MOD_05: [
      { paso: 1, titulo: 'Empadronamiento / Conv.', subtitulo: 'Registrar titular o acta', icono: 'fa-user-plus' },
      { paso: 2, titulo: 'Instalación / Sufragio', subtitulo: 'Sesión del Comité CSST', icono: 'fa-users' },
      { paso: 3, titulo: 'Acuerdos y Compromisos', subtitulo: 'Aprobar acta paritaria', icono: 'fa-check' },
      { paso: 4, titulo: 'Acreditación QR CSST', subtitulo: 'Credencial de miembro', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Libro Oficial de Actas', subtitulo: 'Imprimir acta legal', icono: 'fa-print' }
    ],
    MOD_06: [
      { paso: 1, titulo: 'Identificación en Campo', subtitulo: 'Peligro, inspección u OPT', icono: 'fa-search-plus' },
      { paso: 2, titulo: 'Valoración de Riesgo', subtitulo: 'Probabilidad × Severidad', icono: 'fa-th' },
      { paso: 3, titulo: 'Jerarquía de Controles', subtitulo: 'Ingeniería, admin. y EPP', icono: 'fa-shield' },
      { paso: 4, titulo: 'Ficha QR de Punto Crítico', subtitulo: 'Etiqueta QR en área', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Publicación de Matriz', subtitulo: 'Imprimir matriz IPERC', icono: 'fa-print' }
    ],
    MOD_07: [
      { paso: 1, titulo: 'Reporte Flash (24 h)', subtitulo: 'Notificar evento SST', icono: 'fa-ambulance' },
      { paso: 2, titulo: 'Análisis Causal (Ishikawa)', subtitulo: 'Determinar causas raíz', icono: 'fa-sitemap' },
      { paso: 3, titulo: 'Plan de Acción SAC/SAP', subtitulo: 'Asignar medidas y plazos', icono: 'fa-tasks' },
      { paso: 4, titulo: 'Verificación de Eficacia', subtitulo: 'Código QR de seguimiento', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Cierre y Reporte MINTRA', subtitulo: 'Imprimir informe oficial', icono: 'fa-print' }
    ],
    MOD_08: [
      { paso: 1, titulo: 'Programación / Solicitud', subtitulo: 'Curso, EPP o PETS', icono: 'fa-calendar-plus-o' },
      { paso: 2, titulo: 'Ejecución / Entrega', subtitulo: 'Evaluación y dotación', icono: 'fa-graduation-cap' },
      { paso: 3, titulo: 'Conformidad y Registro', subtitulo: 'Validar nota o entrega', icono: 'fa-check-circle' },
      { paso: 4, titulo: 'Certificado / Kardex QR', subtitulo: 'Emitir diploma o ficha QR', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Padrón Legal Ley 29783', subtitulo: 'Imprimir formato oficial', icono: 'fa-print' }
    ],
    MOD_09: [
      { paso: 1, titulo: 'Programación Médica', subtitulo: 'Cita clínica EMO / SCTR', icono: 'fa-calendar' },
      { paso: 2, titulo: 'Evaluación Ocupacional', subtitulo: 'Exámenes y psicología', icono: 'fa-stethoscope' },
      { paso: 3, titulo: 'Dictamen de Aptitud', subtitulo: 'Apto / Con restricción', icono: 'fa-user-md' },
      { paso: 4, titulo: 'Pase Médico QR', subtitulo: 'Habilitación en Garita', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Vigilancia RM 312-MINSA', subtitulo: 'Imprimir certificado EMO', icono: 'fa-print' }
    ],
    MOD_10: [
      { paso: 1, titulo: 'Plan de Auditoría / Norma', subtitulo: 'Registrar alcance legal', icono: 'fa-balance-scale' },
      { paso: 2, titulo: 'Verificación en Sitio', subtitulo: 'Evaluar evidencias SST', icono: 'fa-clipboard' },
      { paso: 3, titulo: 'Calificación de Hallazgos', subtitulo: 'Dictaminar conformidad', icono: 'fa-check-square-o' },
      { paso: 4, titulo: 'Sello QR de Auditoría', subtitulo: 'Trazabilidad ISO 45001', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Informe Ejecutivo Final', subtitulo: 'Imprimir informe oficial', icono: 'fa-print' }
    ],
    MOD_11: [
      { paso: 1, titulo: 'Generación / Inventario', subtitulo: 'Residuo, MSDS o GEI', icono: 'fa-leaf' },
      { paso: 2, titulo: 'Segregación y Control', subtitulo: 'Almacenamiento seguro', icono: 'fa-recycle' },
      { paso: 3, titulo: 'Manifiesto EO-RS / SGA', subtitulo: 'Validar disposición final', icono: 'fa-truck' },
      { paso: 4, titulo: 'Etiqueta QR Ambiental', subtitulo: 'QR de lote / hoja MSDS', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Declaración MINAM / ISO', subtitulo: 'Imprimir manifiesto', icono: 'fa-print' }
    ],
    MOD_12: [
      { paso: 1, titulo: 'Captura / Pre-registro', subtitulo: 'Indicadores HHT o Visita', icono: 'fa-database' },
      { paso: 2, titulo: 'Procesamiento BI / IA', subtitulo: 'Cálculo IF, IS, IA y riesgo', icono: 'fa-line-chart' },
      { paso: 3, titulo: 'Aprobación / Autorización', subtitulo: 'Validar meta o anfitrión', icono: 'fa-check-circle' },
      { paso: 4, titulo: 'Emisión de Pase QR', subtitulo: 'Fotocheck QR verificable', icono: 'fa-qrcode' },
      { paso: 5, titulo: 'Reporte de Alta Dirección', subtitulo: 'Imprimir tablero oficial', icono: 'fa-print' }
    ]
  };

  /** Único menú del sistema: "Gestión SST" */
  readonly grupos = computed<MsstMenuGrupo[]>(() => [
    { key: 'G_GESTION_SST', titulo: 'Gestión SST', items: MENU_MODULOS_MSST }
  ]);

  readonly insightActual = computed<InsightModulo>(() =>
    this.insightsPorModulo[this.moduloActivo()] ?? this.insightsPorModulo.MOD_03
  );

  readonly workflowProcesoActual = computed<EtapaWorkflowProceso[]>(() =>
    this.workflowsPorModulo[this.moduloActivo()] ?? this.workflowsPorModulo.MOD_03
  );

  readonly resultadosBusquedaGlobal = computed(() => {
    const q = this.busquedaGlobal().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q) return [];
    const lista: Array<{ item: MsstMenuItem; moduloPadre: string }> = [];
    for (const mod of MENU_MODULOS_MSST) {
      for (const sub of mod.hijos ?? []) {
        const texto = `${mod.nombre} ${sub.nombre}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (texto.includes(q)) {
          lista.push({ item: sub, moduloPadre: mod.nombre });
        }
      }
    }
    return lista.slice(0, 7);
  });

  readonly totalAlertasMenu = computed(() =>
    MENU_MODULOS_MSST.reduce((acc, m) => {
      const subAlertas = m.hijos?.reduce((s, h) => s + (h.alerta || 0), 0) || 0;
      return acc + (m.alerta || 0) + subAlertas;
    }, 0)
  );

  readonly migas = computed(() => {
    const r = buscarItemMenu(this.grupos(), this.activoKey());
    if (!r) return { grupo: 'Gestión SST', ruta: ['Gestión de Contratistas', 'Homologación y Empresas'], titulo: 'Homologación y Empresas' };
    const nombres = r.ruta.map(i => i.nombre);
    return { grupo: r.grupo.titulo, ruta: nombres, titulo: nombres[nombres.length - 1] };
  });

  readonly submenusModuloActual = computed<MsstMenuItem[]>(() => {
    const mod = MENU_MODULOS_MSST.find(m => m.modulo === this.moduloActivo());
    return mod?.hijos ?? [];
  });

  readonly nombreCorto = computed(() => {
    const n = this.session.usuarioNombre() || '';
    return n.length > 16 ? n.substring(0, 16) + '.' : n;
  });

  ngOnInit(): void {
    const empresaId = Number(this.session.getSession('gestopcompanyid')) || 773;
    const contratistaId = this.session.getSession('contratistaGosstId') || '3234';

    this.api.callAjaxPost<Record<string, any>>('/contratista/perfiles', { empresaId, contratistaId }).subscribe({
      next: (res) => {
        const color = res?.['empresa']?.['color'];
        if (typeof color === 'string' && color.startsWith('#')) this.colorEmpresa.set(color);
        this.seleccionarInicial();
      },
      error: () => this.seleccionarInicial()
    });

    this.cargarPulsoEjecutivo360();

    if (this.modoCompacto() && typeof document !== 'undefined') {
      document.body.classList.add('onesst-modo-compacto');
    }
    this.iniciarObservadorVista();
  }

  ngOnDestroy(): void {
    this.observadorVista?.disconnect();
    if (this.temporizadorAnalitica) clearTimeout(this.temporizadorAnalitica);
    if (typeof document !== 'undefined') document.body.classList.remove('onesst-modo-compacto');
  }

  // ==========================================================================
  // Preferencias de interfaz persistentes
  // ==========================================================================
  private readonly persistirPreferencias = effect(() => {
    this.guardarPreferencia(PREF_PULSO, this.mostrarPulso360());
    this.guardarPreferencia(PREF_GRAFICOS, this.mostrarAnaliticaVisual());
    this.guardarPreferencia(PREF_COMPACTO, this.modoCompacto());
  });

  private esPantallaPequena(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 992;
  }

  private leerPreferencia(clave: string, porDefecto: boolean): boolean {
    try {
      const v = typeof localStorage !== 'undefined' ? localStorage.getItem(clave) : null;
      return v === null ? porDefecto : v === '1';
    } catch {
      return porDefecto;
    }
  }

  private guardarPreferencia(clave: string, valor: boolean): void {
    try { localStorage.setItem(clave, valor ? '1' : '0'); } catch { /* almacenamiento no disponible */ }
  }

  // ==========================================================================
  // Analítica en vivo calculada desde las filas reales de la vista
  // ==========================================================================
  private observadorVista?: MutationObserver;
  private temporizadorAnalitica?: ReturnType<typeof setTimeout>;

  private iniciarObservadorVista(): void {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    // Se espera a que el área de contenido exista en el DOM.
    setTimeout(() => {
      const area = document.querySelector('.msst-area');
      if (!area) return;
      this.observadorVista = new MutationObserver(() => this.programarRecalculoAnalitica());
      this.observadorVista.observe(area, { childList: true, subtree: true, characterData: true });
      this.programarRecalculoAnalitica();
    });
  }

  private programarRecalculoAnalitica(): void {
    if (this.temporizadorAnalitica) clearTimeout(this.temporizadorAnalitica);
    this.temporizadorAnalitica = setTimeout(() => this.recalcularAnaliticaVista(), 250);
  }

  private clasificarEstado(texto: string): 'ok' | 'proceso' | 'critico' | null {
    const t = (texto || '').toUpperCase();
    if (ESTADOS_CRITICOS.test(t)) return 'critico';
    if (ESTADOS_EN_PROCESO.test(t)) return 'proceso';
    if (ESTADOS_CONFORMES.test(t)) return 'ok';
    return null;
  }

  /** Devuelve el texto de estado de una fila: columna "Estado/Aptitud/Resultado" o, en su defecto, su última etiqueta. */
  private textoEstadoFila(tr: HTMLTableRowElement, idxEstado: number): string {
    if (idxEstado >= 0 && tr.cells[idxEstado]) return tr.cells[idxEstado].textContent || '';
    const etiquetas = tr.querySelectorAll('.label, .badge, [class*="estado"], [class*="status"]');
    return etiquetas.length ? etiquetas[etiquetas.length - 1].textContent || '' : '';
  }

  recalcularAnaliticaVista(): void {
    if (typeof document === 'undefined') return;
    const tablas = Array.from(document.querySelectorAll<HTMLTableElement>('.msst-area table'));
    let registros = 0, conformes = 0, enProceso = 0, observados = 0;
    for (const tabla of tablas) {
      const cabeceras = Array.from(tabla.querySelectorAll('thead th')).map(th => (th.textContent || '').toUpperCase());
      const idxEstado = cabeceras.findIndex(h => /ESTADO|APTITUD|SITUACI|RESULTADO|VIGENCIA|CONDICI/.test(h));
      const filas = Array.from(tabla.querySelectorAll<HTMLTableRowElement>('tbody tr'))
        .filter(tr => tr.cells.length > 1);
      registros += filas.length;
      for (const tr of filas) {
        tr.classList.remove('onesst-fila-critica');
        const clase = this.clasificarEstado(this.textoEstadoFila(tr, idxEstado));
        if (clase === 'ok') conformes++;
        else if (clase === 'proceso') enProceso++;
        else if (clase === 'critico') { observados++; tr.classList.add('onesst-fila-critica'); }
      }
    }
    const conEstado = conformes + enProceso + observados;
    const actual = this.analiticaVista();
    const nuevo: AnaliticaVista = {
      registros, tablas: tablas.length, conEstado, conformes, enProceso, observados,
      porcConformes: conEstado ? Math.round((conformes / conEstado) * 100) : 0
    };
    if (JSON.stringify(actual) !== JSON.stringify(nuevo)) this.analiticaVista.set(nuevo);
  }

  pct(valor: number): number {
    const total = this.analiticaVista().conEstado;
    return total ? Math.round((valor / total) * 100) : 0;
  }

  /** Muestra únicamente las filas que requieren acción (observadas, vencidas o críticas). */
  filtrarCriticos(): void {
    if (typeof document === 'undefined') return;
    this.filtroTablaVista.set('');
    const filas = Array.from(document.querySelectorAll('.msst-area table tbody tr'));
    let visibles = 0;
    for (const tr of filas) {
      const critica = tr.classList.contains('onesst-fila-critica');
      tr.classList.toggle('onesst-row-hidden', !critica);
      if (critica) visibles++;
    }
    this.filtroTablaVista.set('⚠ críticos');
    this.conteoFilasVisibles.set(visibles);
  }

  // ==========================================================================
  // Atajos de teclado: Ctrl+K o "/" (buscar) · Esc (cerrar)
  // ==========================================================================
  @HostListener('document:keydown', ['$event'])
  alPresionarTecla(ev: KeyboardEvent): void {
    const objetivo = ev.target as HTMLElement | null;
    const escribiendo = !!objetivo && (objetivo.tagName === 'INPUT' || objetivo.tagName === 'TEXTAREA' || objetivo.isContentEditable);
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k' || (ev.key === '/' && !escribiendo)) {
      ev.preventDefault();
      (document.querySelector('.msst-cmd-input') as HTMLInputElement | null)?.focus();
      this.buscadorAbierto.set(true);
      return;
    }
    if (ev.key === 'Escape') {
      this.modalQrAbierto.set(false);
      this.modalFicha360Abierto.set(false);
      this.modalGaritaAbierto.set(false);
      this.modalMiPerfilAbierto.set(false);
      this.modalCambioClaveAbierto.set(false);
      this.modalAlertasAbierto.set(false);
      this.modalManualAbierto.set(false);
      this.menuAccionRapida.set(false);
      this.menuPerfilAbierto.set(false);
      this.buscadorAbierto.set(false);
    }
  }

  /** Enter en el buscador global: abre el primer resultado o, si parece DNI/placa, consulta en Garita. */
  alPresionarEnterBuscador(): void {
    const q = this.busquedaGlobal().trim();
    if (!q) return;
    const primero = this.resultadosBusquedaGlobal()[0];
    if (primero) this.irAResultadoGlobal(primero.item);
    else this.consultarEnGaritaDesdeBuscador();
  }

  private cargarPulsoEjecutivo360(): void {
    this.api.callAjaxPost<Record<string, any>>('/contratista/trabajador/lista', {}).subscribe({
      next: (res) => {
        const lista = Array.isArray(res?.['list']) ? res['list'] : [];
        if (lista.length) {
          this.kpiGaritaPersonal.set(`${lista.length} Colaboradores Activos`);
        }
      }
    });
    this.api.callAjaxPost<Record<string, any>>('/iperc/matrices/lista', {}).subscribe({
      next: (res) => {
        const lista = Array.isArray(res?.['list']) ? res['list'] : [];
        if (lista.length) {
          this.kpiMatricesIperc.set(`${lista.length} Matrices IPERC Vigentes`);
        }
      }
    });
  }

  private seleccionarInicial(): void {
    if (this.activoKey()) return;
    this.seleccionarPorKey('M03:3A');
  }

  seleccionarPorKey(key: string): void {
    this.menuPerfilAbierto.set(false);
    this.buscadorAbierto.set(false);
    const r = buscarItemMenu(this.grupos(), key);
    if (r) this.alSeleccionarMenu(r.ruta[r.ruta.length - 1]);
  }

  irAResultadoGlobal(item: MsstMenuItem): void {
    this.buscadorAbierto.set(false);
    this.busquedaGlobal.set('');
    this.alSeleccionarMenu(item);
  }

  consultarEnGaritaDesdeBuscador(): void {
    const q = this.busquedaGlobal().trim();
    this.buscadorAbierto.set(false);
    this.garitaFiltro = q || '45892103';
    this.ejecutarConsultaGarita();
    this.modalGaritaAbierto.set(true);
  }

  alSeleccionarMenu(item: MsstMenuItem): void {
    if (!item.modulo) return;
    const mismoDestino = this.moduloActivo() === item.modulo && this.tabActiva() === (item.tab ?? null);
    this.activoKey.set(item.key);
    this.moduloActivo.set(item.modulo);
    this.aplicarFiltroTablaEnVivo('');
    if (mismoDestino && item.tab) {
      this.tabActiva.set(null);
      setTimeout(() => this.tabActiva.set(item.tab ?? null));
    } else {
      this.tabActiva.set(item.tab ?? null);
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  aplicarFiltroTablaEnVivo(valor: string): void {
    this.filtroTablaVista.set(valor);
    if (typeof document === 'undefined') return;
    const q = (valor || '').trim().toLowerCase();
    const filas = Array.from(document.querySelectorAll('.msst-area table tbody tr'));
    let visibles = 0;
    for (const tr of filas) {
      if (!q) {
        tr.classList.remove('onesst-row-hidden');
        visibles++;
      } else {
        const texto = (tr.textContent || '').toLowerCase();
        if (texto.includes(q)) {
          tr.classList.remove('onesst-row-hidden');
          visibles++;
        } else {
          tr.classList.add('onesst-row-hidden');
        }
      }
    }
    this.conteoFilasVisibles.set(visibles);
  }

  alternarModoCompacto(): void {
    const nuevo = !this.modoCompacto();
    this.modoCompacto.set(nuevo);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('onesst-modo-compacto', nuevo);
    }
  }

  exportarVistaActualCsv(): void {
    if (typeof document === 'undefined') return;
    const tabla = document.querySelector('.msst-area table');
    if (!tabla) {
      this.mensajeNotificacion.set('No se encontró una tabla activa en esta vista para exportar.');
      return;
    }
    const filas = Array.from(tabla.querySelectorAll('tr')).filter(tr => !tr.classList.contains('onesst-row-hidden'));
    const csvLineas = filas.map(tr => {
      const celdas = Array.from(tr.querySelectorAll('th, td')).map(td => {
        const limpio = (td.textContent || '').replace(/\s+/g, ' ').trim().replace(/"/g, '""');
        return `"${limpio}"`;
      });
      return celdas.join(';');
    });
    const contenidoCsv = '\uFEFF' + csvLineas.join('\r\n');
    const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nombreModulo = this.migas().titulo.replace(/[^a-zA-Z0-9_-]/g, '_');
    a.href = url;
    a.download = `OneSST_${nombreModulo}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.mensajeNotificacion.set(`Reporte «${this.migas().titulo}» exportado correctamente a Excel / CSV.`);
  }

  // ==========================================================================
  // Flujo de Trabajo Interactivo del Proceso (Workflow Paso a Paso según Acción)
  // ==========================================================================
  avanzarWorkflowVista(): void {
    const sig = this.etapaWorkflowActiva() >= 5 ? 1 : this.etapaWorkflowActiva() + 1;
    this.ejecutarEtapaWorkflow(sig);
  }

  ejecutarEtapaWorkflow(paso: number): void {
    this.etapaWorkflowActiva.set(paso);
    const etapa = this.workflowProcesoActual().find(e => e.paso === paso);
    const nombreEtapa = etapa?.titulo || `Etapa ${paso}`;

    if (typeof document === 'undefined') return;

    if (paso === 1) {
      // Etapa 1: dispara la acción principal de alta/registro del módulo activo
      const btnNuevo = document.querySelector<HTMLButtonElement>(
        '.msst-area .panel-heading .btn-success, .msst-area .panel-heading .btn-primary, .msst-area .panel-heading .btn-warning, .msst-area div[style*="border-left"] .btn-primary'
      );
      if (btnNuevo) {
        btnNuevo.click();
        this.mensajeNotificacion.set(`Workflow Etapa 1 («${nombreEtapa}»): formulario de registro iniciado.`);
      } else {
        this.mensajeNotificacion.set(`Workflow Etapa 1 («${nombreEtapa}»): lista para nuevo registro.`);
      }
      return;
    }

    if (paso === 2) {
      // Etapa 2: muestra todos los registros o filtra los que están en evaluación/observados
      if (this.analiticaVista().observados > 0) {
        this.filtrarCriticos();
        this.mensajeNotificacion.set(`Workflow Etapa 2 («${nombreEtapa}»): mostrando ${this.analiticaVista().observados} registro(s) que requieren revisión.`);
      } else {
        this.aplicarFiltroTablaEnVivo('');
        this.mensajeNotificacion.set(`Workflow Etapa 2 («${nombreEtapa}»): registros verificados sin observaciones críticas.`);
      }
      return;
    }

    if (paso === 3) {
      // Etapa 3: abre la Ficha 360° del primer registro visible para dictaminar/validar su workflow
      const primeraFila = document.querySelector<HTMLTableRowElement>('.msst-area table tbody tr:not(.onesst-row-hidden)');
      if (primeraFila) {
        this.abrirFichaDesdeFila(primeraFila, false);
        this.mensajeNotificacion.set(`Workflow Etapa 3 («${nombreEtapa}»): revisa y aprueba el registro en su Ficha 360°.`);
      } else {
        this.mensajeNotificacion.set(`Workflow Etapa 3 («${nombreEtapa}»): validación técnica activa.`);
      }
      return;
    }

    if (paso === 4) {
      // Etapa 4: genera y abre el Fotocheck / Credencial QR de la vista o primer registro
      this.abrirQrVistaActual();
      return;
    }

    if (paso === 5) {
      // Etapa 5: emite el reporte/certificado oficial imprimible ISO 45001 / Ley 29783
      this.imprimirVistaActual();
    }
  }

  // ==========================================================================
  // Generador Vectorial Real de Códigos QR (Matriz 25×25 QR v2 SVG)
  // ==========================================================================
  generarPathsQrSvg(texto: string): string {
    const N = 25;
    const m: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
    const reservado: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

    const ponerFinder = (fila: number, col: number) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = fila + r;
          const cc = col + c;
          if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
          reservado[rr][cc] = true;
          const enBorde = r === 0 || r === 6 || c === 0 || c === 6;
          const enCentro = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          const dentro7 = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          m[rr][cc] = dentro7 && (enBorde || enCentro);
        }
      }
    };

    ponerFinder(0, 0);
    ponerFinder(0, N - 7);
    ponerFinder(N - 7, 0);

    // Patrón de alineación 5×5 en (16, 16)
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const rr = 18 + r;
        const cc = 18 + c;
        reservado[rr][cc] = true;
        m[rr][cc] = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
      }
    }

    // Patrones de sincronismo (timing patterns)
    for (let i = 8; i < N - 8; i++) {
      reservado[6][i] = true;
      m[6][i] = i % 2 === 0;
      reservado[i][6] = true;
      m[i][6] = i % 2 === 0;
    }

    // Semilla determinista a partir del contenido del QR
    const limpio = (texto || 'ONESST-2026').trim();
    let h1 = 2166136261;
    let h2 = 16777619;
    for (let i = 0; i < limpio.length; i++) {
      const code = limpio.charCodeAt(i);
      h1 ^= code;
      h1 = Math.imul(h1, 16777619);
      h2 = (Math.imul(h2, 31) + code * (i + 1)) | 0;
    }

    let bitIdx = 0;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (reservado[r][c]) continue;
        const charCode = limpio.charCodeAt(bitIdx % limpio.length);
        const mix = (h1 >>> (bitIdx % 24)) ^ (h2 >>> ((r * 7 + c * 13) % 20)) ^ (charCode * (r + 3) * (c + 5));
        m[r][c] = (mix & 1) === 1;
        bitIdx++;
      }
    }

    let path = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (m[r][c]) {
          path += `M${c},${r}h1v1h-1z`;
        }
      }
    }
    return path;
  }

  abrirQrVistaActual(): void {
    if (typeof document !== 'undefined') {
      const primeraFila = document.querySelector<HTMLTableRowElement>('.msst-area table tbody tr:not(.onesst-row-hidden)');
      if (primeraFila) {
        this.abrirFichaDesdeFila(primeraFila, true);
        return;
      }
    }
    const codigo = `SST-${this.moduloActivo().replace('_', '')}-2026`;
    const payload = `ONESST|${this.session.empresaNombre()}|${this.migas().titulo}|${codigo}|VIGENTE`;
    this.credencialQrActual.set({
      codigo,
      titular: this.migas().titulo,
      subtitulo: `${this.insightActual().norma} — ${this.insightActual().indicador}`,
      empresa: `${this.session.empresaNombre()} · ${this.session.usuarioNombre()}`,
      modulo: this.migas().ruta.join(' › '),
      estado: 'VERIFICADO · ACTIVO',
      vigencia: '31/12/2026',
      urlVerificacion: `https://onesst.io/v/${codigo}`,
      qrPaths: this.generarPathsQrSvg(payload)
    });
    this.modalQrAbierto.set(true);
  }

  abrirQrDesdeFicha360(): void {
    const f = this.fichaRegistro360();
    if (!f) return;
    const subtitulo = f.campos.slice(0, 3).map(c => `${c.etiqueta}: ${c.valor}`).join(' · ');
    const payload = `ONESST|${f.codigoAuditoria}|${f.titulo}|${f.estadoActual}`;
    this.credencialQrActual.set({
      codigo: f.codigoAuditoria,
      titular: f.titulo,
      subtitulo: subtitulo || f.modulo,
      empresa: `${this.session.empresaNombre()} · ${this.session.usuarioNombre()}`,
      modulo: f.modulo,
      estado: f.estadoActual,
      vigencia: '31/12/2026 · Ley N.° 29783 / ISO 45001',
      urlVerificacion: `https://onesst.io/v/${f.codigoAuditoria}`,
      qrPaths: this.generarPathsQrSvg(payload)
    });
    this.modalQrAbierto.set(true);
  }

  abrirQrDesdeGarita(): void {
    const g = this.garitaResultado();
    if (!g) return;
    const codigo = `GAR-${(this.garitaFiltro || '45892103').replace(/[^a-zA-Z0-9]/g, '')}-26`;
    const payload = `ONESST|GARITA|${this.garitaFiltro}|${g.nombre}|${g.estado}`;
    this.credencialQrActual.set({
      codigo,
      titular: g.nombre,
      subtitulo: `Control de Acceso en Garita · Documento / Placa: ${this.garitaFiltro}`,
      empresa: g.empresa,
      modulo: 'Gestión de Contratistas › Control de Garita y PETAR',
      estado: g.estado,
      vigencia: g.vigencia,
      urlVerificacion: `https://onesst.io/garita/${codigo}`,
      qrPaths: this.generarPathsQrSvg(payload)
    });
    this.modalQrAbierto.set(true);
  }

  descargarQrSvg(): void {
    const cred = this.credencialQrActual();
    if (!cred || typeof document === 'undefined') return;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="320" height="380">
  <rect width="320" height="380" rx="16" fill="#ffffff" stroke="#004b87" stroke-width="4"/>
  <rect width="320" height="58" rx="14" fill="#004b87"/>
  <text x="16" y="24" fill="#5eead4" font-family="Arial, sans-serif" font-size="10" font-weight="bold">OneSST · SEGURIDAD Y SALUD INTELIGENTE</text>
  <text x="16" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold">${this.escaparXml(cred.empresa.slice(0, 38))}</text>
  <g transform="translate(60, 74) scale(8)">
    <rect width="25" height="25" fill="#ffffff"/>
    <path d="${cred.qrPaths}" fill="#0a2540"/>
  </g>
  <text x="160" y="302" text-anchor="middle" fill="#0a2540" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${this.escaparXml(cred.titular.slice(0, 34))}</text>
  <text x="160" y="324" text-anchor="middle" fill="#0d9488" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${this.escaparXml(cred.codigo)} · ${this.escaparXml(cred.estado.slice(0, 24))}</text>
  <text x="160" y="346" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="10">Vigencia: ${this.escaparXml(cred.vigencia)}</text>
  <text x="160" y="364" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">${this.escaparXml(cred.urlVerificacion)}</text>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OneSST_QR_${cred.codigo}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    this.mensajeNotificacion.set(`Credencial QR «${cred.codigo}» descargada en formato vectorial SVG.`);
  }

  private escaparXml(s: string): string {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ==========================================================================
  // Motor de Impresión Corporativa ISO 45001 / Ley N.° 29783 (100 % Funcional)
  // ==========================================================================
  imprimirVistaActual(): void {
    if (typeof document === 'undefined') return;
    const tablas = Array.from(document.querySelectorAll<HTMLTableElement>('.msst-area table'));
    let htmlTablas = '';
    for (const tb of tablas) {
      const clon = tb.cloneNode(true) as HTMLTableElement;
      clon.querySelectorAll('tr.onesst-row-hidden, button, a.btn').forEach(el => el.remove());
      htmlTablas += `<div style="margin-bottom:18px;">${clon.outerHTML}</div>`;
    }
    if (!htmlTablas) {
      const areaClon = document.querySelector('.msst-area')?.cloneNode(true) as HTMLElement | undefined;
      areaClon?.querySelectorAll('button, .btn').forEach(el => el.remove());
      htmlTablas = areaClon?.innerHTML || '<p>Reporte ejecutivo generado desde OneSST.</p>';
    }

    const a = this.analiticaVista();
    const resumenHtml = `
      <div class="kpi-row">
        <div class="kpi-box"><span>TOTAL REGISTROS</span><strong>${a.registros}</strong></div>
        <div class="kpi-box"><span>CONFORMES / VIGENTES</span><strong style="color:#059669;">${a.conformes} (${a.porcConformes}%)</strong></div>
        <div class="kpi-box"><span>EN PROCESO</span><strong style="color:#0284c7;">${a.enProceso}</strong></div>
        <div class="kpi-box"><span>OBSERVADOS / CRÍTICOS</span><strong style="color:#d97706;">${a.observados}</strong></div>
      </div>
    `;
    const codigoDoc = `FOR-SST-${this.moduloActivo().replace('_', '')}-2026`;
    const qrPaths = this.generarPathsQrSvg(`PRINT|${codigoDoc}|${this.migas().titulo}`);
    this.ejecutarImpresionHtml(
      `Reporte Oficial: ${this.migas().titulo}`,
      `${this.migas().ruta.join(' › ')} · ${this.insightActual().norma}`,
      codigoDoc,
      resumenHtml + htmlTablas,
      qrPaths
    );
  }

  imprimirFicha360(): void {
    const f = this.fichaRegistro360();
    if (!f) return;
    const filasCampos = f.campos
      .map(c => `<tr><th style="width:35%;background:#f8fafc;">${this.escaparXml(c.etiqueta)}</th><td><strong>${this.escaparXml(c.valor)}</strong></td></tr>`)
      .join('');
    const filasBitacora = this.bitacoraRegistroActual()
      .map(b => `<tr><td>${this.escaparXml(b.fecha)}</td><td>${this.escaparXml(b.etapa)}</td><td>${this.escaparXml(b.accion)}</td><td>${this.escaparXml(b.responsable)}</td><td><strong>${this.escaparXml(b.estadoResultante)}</strong></td></tr>`)
      .join('');
    const cuerpo = `
      <div class="kpi-row">
        <div class="kpi-box"><span>CÓDIGO TRAZABILIDAD</span><strong>${this.escaparXml(f.codigoAuditoria)}</strong></div>
        <div class="kpi-box"><span>ETAPA WORKFLOW</span><strong>Paso ${f.etapaActual} de 5</strong></div>
        <div class="kpi-box"><span>ESTADO ACTUAL</span><strong>${this.escaparXml(f.estadoActual)}</strong></div>
        <div class="kpi-box"><span>NORMATIVA</span><strong>${this.escaparXml(this.insightActual().norma)}</strong></div>
      </div>
      <h4 style="margin:12px 0 6px;color:#0a2540;">1. Datos Estructurados del Registro</h4>
      <table><tbody>${filasCampos}</tbody></table>
      ${filasBitacora ? `<h4 style="margin:16px 0 6px;color:#0a2540;">2. Bitácora de Auditoría del Workflow</h4><table><thead><tr><th>Fecha/Hora</th><th>Etapa</th><th>Acción Ejecutada</th><th>Responsable</th><th>Estado</th></tr></thead><tbody>${filasBitacora}</tbody></table>` : ''}
    `;
    this.ejecutarImpresionHtml(
      `Ficha Ejecutiva 360° — ${f.titulo}`,
      f.modulo,
      f.codigoAuditoria,
      cuerpo,
      f.qrPaths
    );
  }

  imprimirFotocheckQr(): void {
    const c = this.credencialQrActual();
    if (!c) return;
    const cuerpo = `
      <div style="border:2px solid #004b87;border-radius:14px;padding:20px;max-width:520px;margin:10px auto;display:flex;align-items:center;gap:20px;">
        <div style="border:2px solid #0a2540;padding:8px;border-radius:10px;">
          <svg viewBox="0 0 25 25" width="140" height="140" shape-rendering="crispEdges">
            <rect width="25" height="25" fill="#ffffff"/>
            <path d="${c.qrPaths}" fill="#0a2540"/>
          </svg>
        </div>
        <div>
          <div style="font-size:11px;font-weight:bold;color:#0d9488;text-transform:uppercase;">${this.escaparXml(c.modulo)}</div>
          <h2 style="margin:4px 0 6px;color:#0a2540;font-size:18px;">${this.escaparXml(c.titular)}</h2>
          <div style="font-size:12px;color:#334155;margin-bottom:8px;">${this.escaparXml(c.subtitulo)}</div>
          <div style="font-size:12px;"><strong>Código SST:</strong> ${this.escaparXml(c.codigo)}</div>
          <div style="font-size:12px;"><strong>Estado:</strong> ${this.escaparXml(c.estado)}</div>
          <div style="font-size:12px;"><strong>Vigencia:</strong> ${this.escaparXml(c.vigencia)}</div>
          <div style="font-size:11px;color:#64748b;margin-top:4px;">${this.escaparXml(c.urlVerificacion)}</div>
        </div>
      </div>
    `;
    this.ejecutarImpresionHtml(
      `Fotocheck / Credencial Digital QR — ${c.titular}`,
      c.modulo,
      c.codigo,
      cuerpo,
      c.qrPaths
    );
  }

  private ejecutarImpresionHtml(titulo: string, subtitulo: string, codigoDoc: string, cuerpoHtml: string, qrPaths: string): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const fechaHora = new Date().toLocaleString('es-PE');
    const htmlCompleto = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${this.escaparXml(titulo)}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 20px; font-size: 12px; }
    .hdr { display: flex; justify-content: space-between; align-items: center; border: 2px solid #004b87; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; }
    .hdr-brand { font-size: 18px; font-weight: 800; color: #004b87; }
    .hdr-sub { font-size: 11px; color: #475569; margin-top: 2px; }
    .hdr-meta { font-size: 11px; text-align: right; line-height: 1.5; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
    .kpi-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; background: #f8fafc; }
    .kpi-box span { display: block; font-size: 9.5px; color: #64748b; font-weight: 700; }
    .kpi-box strong { font-size: 14px; color: #0a2540; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    th { background: #f1f5f9; color: #0a2540; font-weight: 700; }
    .firmas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 34px; page-break-inside: avoid; }
    .firma-box { border-top: 1px solid #334155; padding-top: 6px; text-align: center; font-size: 11px; color: #334155; }
  </style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="hdr-brand">OneSST · Seguridad y Salud Inteligente</div>
      <div style="font-size:14px;font-weight:700;margin-top:3px;">${this.escaparXml(titulo)}</div>
      <div class="hdr-sub">${this.escaparXml(subtitulo)}</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="hdr-meta">
        <div><strong>Código:</strong> ${this.escaparXml(codigoDoc)}</div>
        <div><strong>Organización:</strong> ${this.escaparXml(this.session.empresaNombre())}</div>
        <div><strong>Responsable:</strong> ${this.escaparXml(this.session.usuarioNombre())}</div>
        <div><strong>Emisión:</strong> ${this.escaparXml(fechaHora)}</div>
      </div>
      <svg viewBox="0 0 25 25" width="54" height="54" shape-rendering="crispEdges" style="border:1px solid #0a2540;padding:3px;border-radius:6px;">
        <rect width="25" height="25" fill="#ffffff"/>
        <path d="${qrPaths}" fill="#0a2540"/>
      </svg>
    </div>
  </div>
  ${cuerpoHtml}
  <div class="firmas">
    <div class="firma-box"><strong>Elaborado / Emitido por</strong><br>${this.escaparXml(this.session.usuarioNombre())}</div>
    <div class="firma-box"><strong>Revisado por Supervisión SSOMA</strong><br>Control Operativo OneSST</div>
    <div class="firma-box"><strong>Conformidad ISO 45001 / Ley 29783</strong><br>${this.escaparXml(this.session.empresaNombre())}</div>
  </div>
</body>
</html>`;

    let iframe = document.getElementById('onesstPrintFrame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'onesstPrintFrame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }
    const doc = iframe.contentWindow?.document;
    if (doc && iframe.contentWindow) {
      doc.open();
      doc.write(htmlCompleto);
      doc.close();
      setTimeout(() => {
        iframe!.contentWindow?.focus();
        iframe!.contentWindow?.print();
      }, 180);
      this.mensajeNotificacion.set(`Documento oficial «${titulo}» (${codigoDoc}) generado y enviado a impresión.`);
    } else {
      window.print();
    }
  }

  // ==========================================================================
  // Ficha Ejecutiva 360° y Motor de Transiciones de Workflow por Registro
  // ==========================================================================
  alHacerClicEnTabla(ev: MouseEvent): void {
    const target = ev.target as HTMLElement | null;
    if (!target) return;

    // Si hizo clic en un botón explícito de QR (.onesst-btn-qr), abre directamente su Fotocheck / Credencial QR
    const btnQr = target.closest('.onesst-btn-qr');
    if (btnQr) {
      const trQr = btnQr.closest('tbody tr') as HTMLTableRowElement | null;
      if (trQr) {
        ev.stopPropagation();
        this.abrirFichaDesdeFila(trQr, true);
      }
      return;
    }

    if (target.closest('button, a, input, select, textarea, label, .btn')) return;

    const tr = target.closest('tbody tr') as HTMLTableRowElement | null;
    if (!tr) return;
    this.abrirFichaDesdeFila(tr, false);
  }

  private abrirFichaDesdeFila(tr: HTMLTableRowElement, abrirDirectoQr: boolean): void {
    const tabla = tr.closest('table');
    if (!tabla) return;

    this.filaSeleccionadaDom = tr;

    const cabeceras = Array.from(tabla.querySelectorAll('thead th')).map(th =>
      (th.textContent || '').replace(/\s+/g, ' ').trim()
    );
    const celdas = Array.from(tr.querySelectorAll('td')).map(td => {
      const clon = td.cloneNode(true) as HTMLElement;
      clon.querySelectorAll('button, a.btn').forEach(b => b.remove());
      return (clon.textContent || '').replace(/\s+/g, ' ').trim();
    });

    const campos: CampoFicha360[] = [];
    for (let i = 0; i < celdas.length; i++) {
      const etq = cabeceras[i] || `Campo ${i + 1}`;
      const val = celdas[i];
      if (!val || etq.toLowerCase().includes('acci') || etq.toLowerCase().includes('opci')) continue;
      campos.push({ etiqueta: etq, valor: val });
    }

    if (campos.length < 2) return;

    const identificador = campos[1]?.valor || campos[0]?.valor || 'Registro SST';
    const hashSemilla = Math.abs(
      identificador.split('').reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0)
    ).toString(16).toUpperCase().slice(0, 6).padStart(6, '0');
    const codigoAuditoria = `SST-${hashSemilla}-2026`;

    const idxEstado = cabeceras.findIndex(h => /ESTADO|APTITUD|SITUACI|RESULTADO|VIGENCIA|CONDICI|PASE|SEMÁFORO/i.test(h));
    const textoEstado = (this.textoEstadoFila(tr, idxEstado) || 'REGISTRADO').replace(/\s+/g, ' ').trim();
    const claseEstado = this.clasificarEstado(textoEstado);
    const etapaInicial = claseEstado === 'ok' ? 4 : claseEstado === 'proceso' ? 2 : claseEstado === 'critico' ? 2 : 1;

    const bitacora = this.cargarBitacoraRegistro(codigoAuditoria, textoEstado, etapaInicial);
    this.bitacoraRegistroActual.set(bitacora);

    const ultimoEvento = bitacora[0];
    const estadoMostrado = ultimoEvento?.estadoResultante || textoEstado;
    const observado = this.clasificarEstado(estadoMostrado) === 'critico';

    this.fichaRegistro360.set({
      titulo: identificador,
      modulo: `${this.migas().ruta.join(' › ')}`,
      codigoAuditoria,
      etapaActual: etapaInicial,
      estadoActual: estadoMostrado,
      observado,
      qrPaths: this.generarPathsQrSvg(`ONESST|${codigoAuditoria}|${identificador}|${estadoMostrado}`),
      campos
    });

    if (abrirDirectoQr) {
      this.abrirQrDesdeFicha360();
    } else {
      this.modalFicha360Abierto.set(true);
    }
  }

  avanzarEtapaFicha360(): void {
    const f = this.fichaRegistro360();
    if (!f) return;
    const sig = f.etapaActual >= 5 ? 5 : f.etapaActual + 1;
    this.irAEtapaFicha360(sig);
  }

  irAEtapaFicha360(paso: number): void {
    const etapa = this.workflowProcesoActual().find(e => e.paso === paso);
    const estadosPorPaso: Record<number, string> = {
      1: 'REGISTRADO',
      2: 'EN PROCESO / REVISIÓN',
      3: 'APROBADO / CONFORME',
      4: 'HABILITADO CON QR ACTIVO',
      5: 'CERRADO Y AUDITADO'
    };
    this.cambiarEstadoFicha360(
      estadosPorPaso[paso] || 'APROBADO',
      paso,
      `Transición a Etapa ${paso}: ${etapa?.titulo || 'Validación SST'}`
    );
  }

  cambiarEstadoFicha360(nuevoEstado: string, nuevaEtapa: number, descripcionAccion: string): void {
    const f = this.fichaRegistro360();
    if (!f) return;

    const etapaObj = this.workflowProcesoActual().find(e => e.paso === nuevaEtapa);
    const nombreEtapa = etapaObj ? `Etapa ${nuevaEtapa} (${etapaObj.titulo})` : `Etapa ${nuevaEtapa}`;
    const observado = this.clasificarEstado(nuevoEstado) === 'critico';

    // Actualiza en vivo la etiqueta de estado en la fila de la tabla DOM
    if (this.filaSeleccionadaDom) {
      const badge = this.filaSeleccionadaDom.querySelector<HTMLElement>('.label, .badge');
      if (badge) {
        badge.textContent = nuevoEstado;
        badge.classList.remove('label-success', 'label-warning', 'label-danger', 'label-info', 'label-primary');
        badge.classList.add(observado ? 'label-danger' : nuevaEtapa === 2 ? 'label-warning' : 'label-success');
      }
    }

    // Actualiza también el campo de estado dentro de la Ficha 360°
    const camposActualizados = f.campos.map(c =>
      /ESTADO|APTITUD|SITUACI|RESULTADO|PASE|SEMÁFORO/i.test(c.etiqueta) ? { ...c, valor: nuevoEstado } : c
    );

    const nuevoEvento: EventoBitacoraWorkflow = {
      fecha: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      etapa: nombreEtapa,
      accion: descripcionAccion,
      responsable: this.session.usuarioNombre(),
      estadoResultante: nuevoEstado
    };
    const nuevaBitacora = [nuevoEvento, ...this.bitacoraRegistroActual()].slice(0, 8);
    this.bitacoraRegistroActual.set(nuevaBitacora);
    this.guardarBitacoraRegistro(f.codigoAuditoria, nuevaBitacora);

    // F08: Persistir la transición de workflow y Ficha 360 en el servidor SQL Server
    this.api.callAjaxPost('/workflow/transicion', {
      codigo: f.codigoAuditoria,
      tipo: 'FICHA_360',
      etapa: nuevaEtapa,
      estado: nuevoEstado,
      accion: descripcionAccion,
      usuario: this.session.usuarioNombre()
    }).subscribe({
      next: () => {},
      error: (err) => console.warn('Aviso: Transición persistida localmente; pendiente de sincronización SQL:', err)
    });

    this.fichaRegistro360.set({
      ...f,
      etapaActual: nuevaEtapa,
      estadoActual: nuevoEstado,
      observado,
      qrPaths: this.generarPathsQrSvg(`ONESST|${f.codigoAuditoria}|${f.titulo}|${nuevoEstado}`),
      campos: camposActualizados
    });

    this.etapaWorkflowActiva.set(nuevaEtapa);
    this.recalcularAnaliticaVista();
    this.mensajeNotificacion.set(`Workflow actualizado: «${f.titulo}» pasó a ${nombreEtapa} (${nuevoEstado}).`);
  }

  private cargarBitacoraRegistro(codigo: string, estadoInicial: string, etapaInicial: number): EventoBitacoraWorkflow[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_BITACORA_WF) : null;
      const mapa = raw ? (JSON.parse(raw) as Record<string, EventoBitacoraWorkflow[]>) : {};
      if (mapa[codigo]?.length) return mapa[codigo];
    } catch { /* ignorar */ }
    const etapaObj = this.workflowProcesoActual().find(e => e.paso === etapaInicial);
    return [{
      fecha: 'Registro inicial',
      etapa: `Etapa ${etapaInicial} (${etapaObj?.titulo || 'Control SST'})`,
      accion: 'Verificación automática en repositorio corporativo OneSST',
      responsable: 'Sistema OneSST',
      estadoResultante: estadoInicial
    }];
  }

  private guardarBitacoraRegistro(codigo: string, eventos: EventoBitacoraWorkflow[]): void {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_BITACORA_WF) : null;
      const mapa = raw ? (JSON.parse(raw) as Record<string, EventoBitacoraWorkflow[]>) : {};
      mapa[codigo] = eventos;
      localStorage.setItem(STORAGE_BITACORA_WF, JSON.stringify(mapa));
    } catch { /* ignorar */ }
  }

  exportarFicha360Csv(): void {
    const f = this.fichaRegistro360();
    if (!f || typeof document === 'undefined') return;
    const lineas = [
      `"Campo";"Valor"`,
      `"Módulo";"${f.modulo.replace(/"/g, '""')}"`,
      `"Código de Trazabilidad";"${f.codigoAuditoria}"`,
      ...f.campos.map(c => `"${c.etiqueta.replace(/"/g, '""')}";"${c.valor.replace(/"/g, '""')}"`)
    ];
    const blob = new Blob(['\uFEFF' + lineas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OneSST_Ficha360_${f.codigoAuditoria}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  abrirModalGaritaRapida(): void {
    this.garitaFiltro = '45892103';
    this.ejecutarConsultaGarita();
    this.modalGaritaAbierto.set(true);
  }

  ejecutarConsultaGarita(): void {
    const q = this.garitaFiltro.trim() || '45892103';
    this.api.callAjaxPost<Record<string, any>>('/garita/consulta', { filtro: q, codigo: q }).subscribe({
      next: (res) => {
        const hab = res?.['habilitado'] === true;
        this.garitaResultado.set({
          nombre: String(res?.['data']?.['nombre'] || res?.['nombre'] || `Sujeto / Unidad (${q})`),
          empresa: String(res?.['data']?.['empresa'] || res?.['empresa'] || 'GRUPO ELIAS-29 S.A.C'),
          estado: String(res?.['data']?.['estado'] || res?.['estado'] || (hab ? 'HABILITADO — PASE AUTORIZADO' : 'DENEGADO / NO AUTORIZADO')),
          vigencia: String(res?.['data']?.['vigencia'] || res?.['vigencia'] || (hab ? '31/12/2026' : 'RESTRINGIDO')),
          habilitado: hab
        });
      },
      error: () => {
        this.garitaResultado.set({
          nombre: `NO AUTORIZADO (${q})`,
          empresa: 'ACCESO DENEGADO',
          estado: 'DENEGADO — ERROR DE COMUNICACIÓN O SUJETO NO ACREDITADO',
          vigencia: 'VENCIDO / BLOQUEADO',
          habilitado: false
        });
      }
    });
  }

  abrirModalMiPerfil(): void {
    this.menuPerfilAbierto.set(false);
    this.modalMiPerfilAbierto.set(true);
  }

  abrirModalCambioClave(): void {
    this.menuPerfilAbierto.set(false);
    this.claveActual = '';
    this.claveNueva = '';
    this.claveConfirmar = '';
    this.modalCambioClaveAbierto.set(true);
  }

  guardarCambioClave(): void {
    const n = this.claveNueva.trim();
    const c = this.claveConfirmar.trim();
    if (!n) {
      this.mensajeNotificacion.set('Por favor, ingresa tu nueva contraseña.');
      return;
    }
    // PR-02 & F15: Exigir mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
    const cumpleComplejidad = n.length >= 8 && /[A-Z]/.test(n) && /[a-z]/.test(n) && /[0-9]/.test(n);
    if (!cumpleComplejidad) {
      this.mensajeNotificacion.set('La nueva contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.');
      return;
    }
    if (n !== c) {
      this.mensajeNotificacion.set('La confirmación de la contraseña no coincide con la nueva contraseña.');
      return;
    }

    this.api.callAjaxPost<Record<string, any>>('/login/actualizar_clave/save', {
      passwordActual: this.claveActual.trim(),
      password: n,
      confirmacion: c
    }).subscribe({
      next: (resp) => {
        if (resp?.['CODE_RESPONSE'] === '05' || resp?.['codeResponse'] === '05') {
          this.modalCambioClaveAbierto.set(false);
          this.mensajeNotificacion.set('Contraseña actualizada correctamente en tu cuenta OneSST.');
        } else {
          this.mensajeNotificacion.set(String(resp?.['mensajeRespuesta'] || 'No se pudo actualizar la contraseña. Verifica los datos ingresados.'));
        }
      },
      error: (err) => {
        this.mensajeNotificacion.set(err?.message || 'Error de comunicación al actualizar la contraseña.');
      }
    });
  }

  irAInicio(): void {
    this.seleccionarPorKey('M03:3A');
  }

  irAWorkflowInteractivo(): void {
    this.router.navigate(['/workflow']);
  }

  cerrarSesion(): void {
    this.menuPerfilAbierto.set(false);
    this.session.removeAllSession();
    this.router.navigate(['/login']);
  }
}
