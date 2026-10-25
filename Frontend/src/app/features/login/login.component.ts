import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

interface PerfilDemo {
  etiqueta: string;
  rol: string;
  user: string;
  pass: string;
  icono: string;
}

@Component({
  selector: 'msst-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="onesst-viewport">
      <!-- Veladura cinematográfica que resalta a los ingenieros SST en planta -->
      <div class="onesst-backdrop-scrim" aria-hidden="true"></div>

      <main class="onesst-layout">

        <!-- Lado Izquierdo: Escena Industrial SST Abierta + Mensaje Comercial -->
        <aside class="onesst-hero">
          <div class="onesst-hero-top">
            <img src="sstweb/imagenes/onesst-logo-white.svg" alt="OneSST" class="onesst-hero-logo">
          </div>

          <div class="onesst-hero-center">
            <span class="onesst-pill-tag">
              <span class="onesst-dot"></span> OneSST Cloud · Seguridad y Salud Inteligente
            </span>
            <h1>
              Tu operación segura,<br>
              <span class="onesst-gradient-text">en un solo lugar.</span>
            </h1>
            <p>
              Homologación de contratistas, control de acceso en garita
              y prevención de riesgos en tiempo real.
            </p>

            <div class="onesst-kpis">
              <div class="onesst-kpi">
                <strong>24/7</strong>
                <span>Control en Garita</span>
              </div>
              <div class="onesst-kpi">
                <strong>100 %</strong>
                <span>Cero Papel</span>
              </div>
              <div class="onesst-kpi">
                <strong>ISO 45001</strong>
                <span>Cumplimiento</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Lado Derecho: Tarjeta Flotante de Acceso de Primer Nivel -->
        <section class="onesst-auth-card">
          <div class="onesst-auth-header">
            <div id="logoVistaLogin" class="onesst-logo-wrap">
              <img src="sstweb/imagenes/onesst-logo.svg" alt="OneSST" class="onesst-auth-logo">
            </div>
            <div id="tituloLogin" class="onesst-tagline">Seguridad y Salud Inteligente</div>
            <h2 class="onesst-title">Ingresa al Sistema</h2>
            <p class="onesst-subtitle-text">Accede con tus credenciales corporativas</p>
          </div>

          <form class="onesst-form" (ngSubmit)="ingresar()">
            <div class="onesst-field">
              <label for="inputUser">Usuario</label>
              <div class="onesst-input-wrap">
                <i class="fa fa-user-o onesst-icon" aria-hidden="true"></i>
                <input
                  id="inputUser"
                  name="userName"
                  type="text"
                  class="onesst-input"
                  placeholder="Ingresa tu usuario"
                  [(ngModel)]="userName"
                  required
                  autofocus>
              </div>
            </div>

            <div class="onesst-field">
              <div class="onesst-label-row">
                <label for="inputPassword">Contraseña</label>
                <button type="button" class="onesst-link-muted" (click)="modalRecuperar.set(true)">
                  ¿Olvidaste tu clave?
                </button>
              </div>
              <div class="onesst-input-wrap">
                <i class="fa fa-lock onesst-icon" aria-hidden="true"></i>
                <input
                  id="inputPassword"
                  name="password"
                  [type]="mostrarClave() ? 'text' : 'password'"
                  class="onesst-input"
                  placeholder="Ingresa tu contraseña"
                  [(ngModel)]="password"
                  required>
                <button
                  type="button"
                  class="onesst-eye"
                  (click)="toggleClave()"
                  [title]="mostrarClave() ? 'Ocultar contraseña' : 'Ver contraseña'">
                  <i class="fa" [ngClass]="mostrarClave() ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <button
              id="btnLogin"
              class="onesst-submit-btn"
              type="submit"
              [disabled]="cargando()">
              @if (cargando()) {
                <i class="fa fa-spinner fa-spin"></i>
                <span>Ingresando...</span>
              } @else {
                <span>Ingresar</span>
                <i class="fa fa-arrow-right onesst-arrow"></i>
              }
            </button>

            @if (mensajeError()) {
              <div id="msj" class="onesst-error">
                <i class="fa fa-exclamation-circle"></i>
                <span>{{ mensajeError() }}</span>
              </div>
            }

            <!-- Accesos rápidos limpios y discretos -->
            <div class="onesst-quick-bar">
              <button type="button" class="onesst-quick-action" (click)="abrirModalGarita()">
                <i class="fa fa-id-card-o"></i> Consulta Garita
              </button>
              <span class="onesst-sep">·</span>
              <button type="button" class="onesst-quick-action" (click)="abrirModalVisitante()">
                <i class="fa fa-user-plus"></i> Pase de Visita
              </button>
              <span class="onesst-sep">·</span>
              <button type="button" class="onesst-quick-action" (click)="mostrarPerfiles.set(!mostrarPerfiles())">
                <i class="fa fa-sliders"></i> Perfiles
              </button>
            </div>

            @if (mostrarPerfiles()) {
              <div class="onesst-profiles-drawer">
                @for (p of perfilesDisponibles; track p.user) {
                  <button
                    type="button"
                    class="onesst-role-chip"
                    [class.activo]="userName === p.user"
                    (click)="seleccionarPerfil(p)">
                    <i class="fa {{ p.icono }}"></i> {{ p.etiqueta }}
                  </button>
                }
              </div>
            }
          </form>
        </section>

      </main>

      <!-- Modal 1: Consulta Rápida de Habilitación en Garita -->
      @if (modalGarita()) {
        <div class="onesst-modal-backdrop" (click)="modalGarita.set(false)">
          <div class="onesst-modal" (click)="$event.stopPropagation()">
            <div class="onesst-modal-header">
              <h4><i class="fa fa-shield"></i> Consulta de Habilitación en Garita (DNI / Placa)</h4>
              <button type="button" class="onesst-close" (click)="modalGarita.set(false)">&times;</button>
            </div>
            <div class="onesst-modal-body">
              <div style="display:flex; gap:10px; margin-bottom:14px;">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar por DNI (ej. 45892103), Nombre o Placa (ej. BKM-842)..."
                  [(ngModel)]="filtroGarita">
                <button type="button" class="btn btn-primary" (click)="filtroGarita = ''">
                  <i class="fa fa-refresh"></i> Todos
                </button>
              </div>
              <div class="table-responsive" style="max-height: 320px; overflow-y: auto;">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>DNI / Placa</th>
                      <th>Colaborador / Unidad</th>
                      <th>SCTR / SOAT</th>
                      <th>Estado Garita</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of resultadosGaritaFiltrados(); track item.codigo) {
                      <tr>
                        <td><span class="label" [ngClass]="item.tipo === 'TRABAJADOR' ? 'label-info' : 'label-primary'">{{ item.tipo }}</span></td>
                        <td><strong>{{ item.codigo }}</strong></td>
                        <td>{{ item.nombre }}</td>
                        <td><span class="label label-success">VIGENTE</span></td>
                        <td>
                          <span class="label" [ngClass]="item.habilitado ? 'label-success' : 'label-danger'">
                            {{ item.habilitado ? 'HABILITADO' : 'OBSERVADO' }}
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

      <!-- Modal 2: Pase de Visita / Personal Externo -->
      @if (modalVisitante()) {
        <div class="onesst-modal-backdrop" (click)="modalVisitante.set(false)">
          <div class="onesst-modal" (click)="$event.stopPropagation()">
            <div class="onesst-modal-header">
              <h4><i class="fa fa-id-card-o"></i> Pase de Ingreso — Personal Externo y Visitantes</h4>
              <button type="button" class="onesst-close" (click)="modalVisitante.set(false)">&times;</button>
            </div>
            <div class="onesst-modal-body">
              <div class="row">
                <div class="col-sm-4">
                  <label>DNI / Documento</label>
                  <input type="text" class="form-control" [(ngModel)]="nuevoVisitanteDni" placeholder="Ej. 43219876">
                </div>
                <div class="col-sm-8">
                  <label>Nombres y Apellidos / Empresa</label>
                  <input type="text" class="form-control" [(ngModel)]="nuevoVisitanteNombre" placeholder="Ej. Ing. Carlos Mendoza — Auditor">
                </div>
              </div>
              <div style="margin-top: 14px; display:flex; justify-content:space-between; align-items:center;">
                <button type="button" class="btn btn-default btn-sm" (click)="modalVisitante.set(false)">
                  Cancelar
                </button>
                <button type="button" class="btn btn-success" (click)="registrarPaseVisitante()">
                  <i class="fa fa-check"></i> Generar Pase
                </button>
              </div>
              @if (mensajeVisitante()) {
                <div class="alert alert-success" style="margin-top:12px; padding:10px 14px;">
                  <i class="fa fa-check-circle"></i> {{ mensajeVisitante() }}
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Modal 3: Recuperar Contraseña -->
      @if (modalRecuperar()) {
        <div class="onesst-modal-backdrop" (click)="modalRecuperar.set(false)">
          <div class="onesst-modal" style="max-width:440px;" (click)="$event.stopPropagation()">
            <div class="onesst-modal-header">
              <h4><i class="fa fa-key"></i> Recuperar Contraseña</h4>
              <button type="button" class="onesst-close" (click)="modalRecuperar.set(false)">&times;</button>
            </div>
            <div class="onesst-modal-body">
              <p style="color:#475569; margin-bottom:12px;">
                Ingresa tu usuario o correo corporativo para enviarte el enlace de recuperación:
              </p>
              <input type="text" class="form-control" [(ngModel)]="usuarioRecuperar" placeholder="Ej. holcim.contratista">
              <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:8px;">
                <button type="button" class="btn btn-default" (click)="modalRecuperar.set(false)">Cancelar</button>
                <button type="button" class="btn btn-primary" (click)="solicitarRecuperacion()">
                  <i class="fa fa-paper-plane"></i> Enviar
                </button>
              </div>
              @if (mensajeRecuperar()) {
                <div class="alert alert-info" style="margin-top:12px; padding:10px 14px;">
                  <i class="fa fa-info-circle"></i> {{ mensajeRecuperar() }}
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* ==========================================================================
       Fondo Fotográfico Industrial SST a Pantalla Completa
       ========================================================================== */
    .onesst-viewport {
      position: relative;
      min-height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #040d1a;
      background-image: url('/sstweb/imagenes/onesst-bg-hero.jpg');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      padding: 32px 48px;
    }

    /* Veladura cinematográfica calibrada: deja nítidos a los ingenieros SST en el centro-izquierda
       y asegura lectura perfecta del texto inferior izquierdo y la tarjeta derecha */
    .onesst-backdrop-scrim {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(4, 13, 26, 0.55) 0%, rgba(4, 13, 26, 0.12) 38%, rgba(4, 13, 26, 0.86) 100%),
        linear-gradient(90deg, rgba(4, 13, 26, 0.72) 0%, rgba(4, 13, 26, 0.15) 50%, rgba(4, 13, 26, 0.65) 100%);
      pointer-events: none;
    }

    /* ==========================================================================
       Contenedor Principal Flotante
       ========================================================================== */
    .onesst-layout {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1280px;
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 40px;
    }

    /* ==========================================================================
       Lado Izquierdo: Escena Abierta + Mensaje Comercial en la Base
       ========================================================================== */
    .onesst-hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px 0;
      color: #ffffff;
      max-width: 580px;
    }

    .onesst-hero-logo {
      height: 56px;
      width: auto;
      display: block;
      filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.45));
    }

    .onesst-hero-center {
      margin-top: auto;
      padding-bottom: 8px;
    }

    .onesst-pill-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(6, 22, 45, 0.68);
      border: 1px solid rgba(94, 234, 212, 0.35);
      backdrop-filter: blur(10px);
      color: #5eead4;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.03em;
      margin-bottom: 16px;
    }

    .onesst-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.28);
    }

    .onesst-hero-center h1 {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 44px;
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      margin: 0 0 14px;
      color: #ffffff;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
    }

    .onesst-gradient-text {
      background: linear-gradient(90deg, #5eead4 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .onesst-hero-center p {
      font-size: 16px;
      line-height: 1.55;
      color: #e2e8f0;
      margin: 0 0 24px;
      max-width: 480px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.65);
    }

    .onesst-kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 480px;
    }

    .onesst-kpi {
      background: rgba(8, 25, 48, 0.68);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 16px;
      padding: 13px 15px;
      backdrop-filter: blur(12px);
    }

    .onesst-kpi strong {
      display: block;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #5eead4;
      margin-bottom: 2px;
    }

    .onesst-kpi span {
      font-size: 11.5px;
      color: #cbd5e1;
      font-weight: 600;
    }

    /* ==========================================================================
       Lado Derecho: Tarjeta Flotante de Autenticación
       ========================================================================== */
    .onesst-auth-card {
      width: 100%;
      max-width: 430px;
      align-self: center;
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(20px);
      border-radius: 26px;
      padding: 42px 40px;
      box-shadow:
        0 30px 70px -12px rgba(2, 8, 20, 0.75),
        0 0 0 1px rgba(255, 255, 255, 0.4);
    }

    .onesst-auth-header {
      margin-bottom: 24px;
    }

    .onesst-logo-wrap {
      margin-bottom: 8px;
    }

    .onesst-auth-logo {
      height: 48px;
      width: auto;
      display: block;
    }

    .onesst-tagline {
      display: none;
    }

    .onesst-title {
      margin: 6px 0 4px;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 25px;
      font-weight: 800;
      color: #0a2540;
      letter-spacing: -0.02em;
    }

    .onesst-subtitle-text {
      margin: 0;
      font-size: 13.2px;
      color: #64748b;
    }

    .onesst-field {
      margin-bottom: 16px;
    }

    .onesst-field label {
      display: inline-block;
      font-size: 12.8px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }

    .onesst-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .onesst-label-row label {
      margin-bottom: 0;
    }

    .onesst-link-muted {
      border: none;
      background: transparent;
      padding: 0;
      font-size: 12px;
      font-weight: 600;
      color: #0284c7;
      cursor: pointer;
    }

    .onesst-link-muted:hover {
      color: #004b87;
      text-decoration: underline;
    }

    .onesst-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      border: 1.5px solid #cbd5e1;
      border-radius: 13px;
      background: #f8fafc;
      transition: all 0.18s ease;
    }

    .onesst-input-wrap:focus-within {
      background: #ffffff;
      border-color: #0d9488;
      box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.12);
    }

    .onesst-icon {
      width: 42px;
      text-align: center;
      color: #64748b;
      font-size: 15px;
      flex-shrink: 0;
    }

    .onesst-input-wrap:focus-within .onesst-icon {
      color: #0d9488;
    }

    .onesst-input {
      width: 100%;
      height: 46px;
      border: none;
      background: transparent;
      padding: 0 14px 0 0;
      font-size: 14px;
      font-weight: 500;
      color: #0f172a;
      outline: none;
    }

    .onesst-input::placeholder {
      color: #94a3b8;
      font-weight: 400;
    }

    .onesst-eye {
      border: none;
      background: transparent;
      color: #64748b;
      padding: 0 14px;
      height: 46px;
      cursor: pointer;
      font-size: 15px;
    }

    .onesst-eye:hover {
      color: #0f172a;
    }

    .onesst-submit-btn {
      width: 100%;
      height: 48px;
      margin-top: 8px;
      border: none;
      border-radius: 13px;
      background: linear-gradient(135deg, #0a2540 0%, #004b87 55%, #0d9488 100%);
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      box-shadow: 0 14px 28px -8px rgba(0, 75, 135, 0.5);
      transition: all 0.2s ease;
    }

    .onesst-submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 18px 34px -8px rgba(13, 148, 136, 0.55);
      filter: brightness(1.05);
    }

    .onesst-arrow {
      transition: transform 0.2s ease;
    }

    .onesst-submit-btn:hover .onesst-arrow {
      transform: translateX(4px);
    }

    .onesst-error {
      margin-top: 14px;
      padding: 11px 14px;
      border-radius: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Barra inferior minimalista */
    .onesst-quick-bar {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .onesst-quick-action {
      border: none;
      background: transparent;
      color: #475569;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 7px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .onesst-quick-action:hover {
      color: #004b87;
      background: #f0f9ff;
    }

    .onesst-sep {
      color: #cbd5e1;
      font-weight: 700;
    }

    .onesst-profiles-drawer {
      margin-top: 10px;
      padding: 10px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
    }

    .onesst-role-chip {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .onesst-role-chip.activo {
      background: #004b87;
      border-color: #004b87;
      color: #ffffff;
    }

    /* Modales */
    .onesst-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(3, 10, 24, 0.68);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 16px;
    }

    .onesst-modal {
      background: #ffffff;
      color: #0f172a;
      border-radius: 18px;
      width: 100%;
      max-width: 700px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
      overflow: hidden;
    }

    .onesst-modal-header {
      background: linear-gradient(135deg, #0a2540 0%, #004b87 100%);
      color: #ffffff;
      padding: 15px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .onesst-modal-header h4 {
      margin: 0;
      font-size: 15.5px;
      font-weight: 700;
    }

    .onesst-close {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
    }

    .onesst-modal-body {
      padding: 20px 22px;
    }

    @media (max-width: 920px) {
      .onesst-viewport {
        padding: 20px;
      }
      .onesst-layout {
        flex-direction: column;
        justify-content: center;
      }
      .onesst-hero {
        display: none;
      }
      .onesst-auth-card {
        max-width: 440px;
        padding: 34px 28px;
      }
    }
  `]
})
export class LoginComponent {
  private readonly api = inject(GosstApiService);
  private readonly session = inject(GosstSessionService);
  private readonly router = inject(Router);

  userName = 'holcim.contratista';
  password = '20608094068';

  readonly mostrarClave = signal(false);
  readonly mostrarPerfiles = signal(false);
  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly modalGarita = signal(false);
  readonly modalVisitante = signal(false);
  readonly modalRecuperar = signal(false);

  filtroGarita = '';
  readonly itemsGarita = signal<Array<{ tipo: string; codigo: string; nombre: string; habilitado: boolean }>>([
    { tipo: 'TRABAJADOR', codigo: '45892103', nombre: 'JUAN CARLOS QUISPE MENDOZA — Supervisor SSOMA', habilitado: true },
    { tipo: 'TRABAJADOR', codigo: '71204958', nombre: 'MIGUEL ANGEL ROJAS HUAMAN — Soldador Homologado 6G', habilitado: true },
    { tipo: 'TRABAJADOR', codigo: '46781239', nombre: 'LUIS ALBERTO GUTIERREZ PALOMINO — Montajista Altura', habilitado: true },
    { tipo: 'VEHICULO', codigo: 'BKM-842', nombre: 'CAMIONETA TOYOTA HILUX 4X4 — GRUPO ELIAS-29 S.A.C', habilitado: true },
    { tipo: 'VEHICULO', codigo: 'GRU-50T-01', nombre: 'GRÚA TELESCÓPICA LIEBHERR 50T — Izaje Crítico', habilitado: true }
  ]);

  nuevoVisitanteDni = '';
  nuevoVisitanteNombre = '';
  readonly mensajeVisitante = signal('');

  usuarioRecuperar = '';
  readonly mensajeRecuperar = signal('');

  readonly perfilesDisponibles: PerfilDemo[] = [
    { etiqueta: 'Contratista Holcim', rol: 'Empresa Contratista SSOMA', user: 'holcim.contratista', pass: '20608094068', icono: 'fa-building-o' },
    { etiqueta: 'Admin SST', rol: 'Administrador Corporativo SST', user: 'admin.sst', pass: 'Admin2026', icono: 'fa-shield' },
    { etiqueta: 'Jefe SST', rol: 'Jefe Corporativo SST', user: 'roberto.ramos', pass: 'Holcim2026', icono: 'fa-user-secret' },
    { etiqueta: 'Médico Ocup.', rol: 'Médico Ocupacional', user: 'medico.ocupacional', pass: 'Salud2026', icono: 'fa-user-md' },
    { etiqueta: 'Garita', rol: 'Control de Acceso Garita', user: 'garita.condorcocha', pass: 'Garita2026', icono: 'fa-id-badge' }
  ];

  toggleClave(): void {
    this.mostrarClave.update(v => !v);
  }

  seleccionarPerfil(p: PerfilDemo): void {
    this.userName = p.user;
    this.password = p.pass;
    this.mensajeError.set('');
  }

  abrirModalGarita(): void {
    this.modalGarita.set(true);
    this.api.callAjaxPost('/contratista/trabajador/lista', {}).subscribe({
      next: (res) => {
        const lista = Array.isArray(res?.['list']) ? res['list'] : [];
        if (lista.length) {
          const mapeados = lista.map((r: Record<string, any>) => ({
            tipo: 'TRABAJADOR',
            codigo: String(r['numeroDocumento'] || r['dni'] || ''),
            nombre: `${r['nombreCompleto'] || r['nombre'] || ''} — ${r['puestoTrabajo'] || 'Operaciones'}`,
            habilitado: Boolean(r['habilitadoIngreso'] ?? true)
          }));
          this.itemsGarita.set(mapeados);
        }
      }
    });
  }

  resultadosGaritaFiltrados() {
    const q = this.filtroGarita.trim().toLowerCase();
    if (!q) return this.itemsGarita();
    return this.itemsGarita().filter(
      i => i.codigo.toLowerCase().includes(q) || i.nombre.toLowerCase().includes(q) || i.tipo.toLowerCase().includes(q)
    );
  }

  abrirModalVisitante(): void {
    this.mensajeVisitante.set('');
    this.modalVisitante.set(true);
  }

  registrarPaseVisitante(): void {
    if (!this.nuevoVisitanteDni.trim() || !this.nuevoVisitanteNombre.trim()) return;
    const nombreCompleto = `${this.nuevoVisitanteDni.trim()} - ${this.nuevoVisitanteNombre.trim()}`;
    this.api.callAjaxPost('/visitante/insert', {
      periodo: new Date().toISOString().slice(0, 10),
      nombre: nombreCompleto
    }).subscribe({
      next: () => {
        this.mensajeVisitante.set(`Pase de ingreso registrado y habilitado en garita para: ${nombreCompleto}`);
        this.nuevoVisitanteDni = '';
        this.nuevoVisitanteNombre = '';
      }
    });
  }

  solicitarRecuperacion(): void {
    const u = this.usuarioRecuperar.trim() || this.userName;
    this.api.callAjaxPost('/public/solicitud_cambiar_clave', { userName: u }).subscribe({
      next: () => {
        this.mensajeRecuperar.set(`Se ha enviado el enlace de restablecimiento para el usuario "${u}".`);
      }
    });
  }

  ingresar(): void {
    if (!this.userName.trim() || !this.password.trim()) {
      this.mensajeError.set('Debe completar todos los campos activos.');
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.api.login({ userName: this.userName.trim(), password: this.password.trim() }).subscribe({
      next: (data) => {
        this.cargando.set(false);
        const code = data['CODE_RESPONSE'];
        if (code === '01') {
          this.session.guardarSesionLogin(data);
          this.router.navigate(['/contratista']);
        } else if (code === '02') {
          this.mensajeError.set('Usuario y/o contraseña incorrectos.');
        } else if (code === '03') {
          this.mensajeError.set('El usuario está bloqueado temporalmente; inténtelo en 2 minutos.');
        } else if (code === '11') {
          this.mensajeError.set('El usuario ingresado no existe.');
        } else {
          this.mensajeError.set(data['mensajeRespuesta'] || 'Credenciales inválidas.');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.mensajeError.set('No fue posible conectar con el servicio de autenticación OneSST.');
      }
    });
  }
}
