import {
  Component,
  HostListener,
  OnDestroy,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MsstMenuGrupo, MsstMenuItem } from '../../core/catalog/gosst-menu.catalog';

const STORAGE_FIJADO = 'onesst.sidebar.fijado';
const STORAGE_ABIERTOS = 'onesst.sidebar.abiertos';
const BREAKPOINT_MOVIL = '(max-width: 991px)';

/**
 * Menú Lateral Único "Gestión SST" de OneSST (Sidebar Auto-Hidden).
 *
 * - Escritorio: riel compacto de 64 px que se despliega suavemente al pasar el cursor (300 px)
 *   y se repliega automáticamente al salir. Incluye botón de fijación (chincheta).
 * - Móvil / tablet (< 992 px): panel deslizable con fondo difuminado.
 * - Submenús en acordeón con buscador instantáneo, insignias de alerta y persistencia de estado.
 */
@Component({
  selector: 'msst-sidebar',
  standalone: true,
  imports: [NgTemplateOutlet],
  host: {
    '[class.sb-expandido]': 'expandido()',
    '[class.sb-fijado]': 'fijado() && !esMovil()',
    '[class.sb-movil]': 'esMovil()',
    '[class.sb-movil-abierto]': 'movilAbierto()'
  },
  template: `
    @if (esMovil() && movilAbierto()) {
      <div class="sb-fondo" (click)="cerrarMovil()" aria-hidden="true"></div>
    }

    <nav
      class="sb-panel"
      role="navigation"
      aria-label="Menú Gestión SST"
      (mouseenter)="alEntrar()"
      (mouseleave)="alSalir()">

      <div class="sb-cabecera">
        <div class="sb-marca" [title]="'OneSST — ' + empresa()">
          <span class="sb-marca-icono">
            <img src="sstweb/imagenes/onesst-icon.svg" alt="OneSST" style="width:26px; height:26px; display:block;">
          </span>
          <span class="sb-texto sb-marca-texto">
            <strong>One<span style="color:#5eead4;">SST</span></strong>
            <small>{{ empresa() }}</small>
          </span>
        </div>
        @if (!esMovil()) {
          <button
            type="button"
            class="sb-btn-icono sb-texto"
            [class.activo]="fijado()"
            [title]="fijado() ? 'Activar ocultamiento automático (Auto-Hidden)' : 'Fijar menú lateral abierto'"
            [attr.aria-pressed]="fijado()"
            (click)="alternarFijado()">
            <i class="fa fa-thumb-tack" aria-hidden="true"></i>
          </button>
        } @else {
          <button type="button" class="sb-btn-icono" title="Cerrar menú" (click)="cerrarMovil()">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        }
      </div>

      <div class="sb-buscador sb-texto">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input
          type="search"
          placeholder="Buscar módulo o función..."
          aria-label="Buscar en Gestión SST"
          [value]="filtro()"
          (input)="filtro.set($any($event.target).value)">
      </div>

      <div class="sb-cuerpo">
        @for (grupo of gruposFiltrados(); track grupo.key) {
          <div class="sb-grupo">
            <div class="sb-grupo-titulo sb-texto">
              <i class="fa fa-th-large" style="margin-right:6px; color:#5eead4;"></i>{{ grupo.titulo }}
            </div>
            <div class="sb-grupo-separador" aria-hidden="true"></div>
            <ul class="sb-lista" role="tree">
              @for (item of grupo.items; track item.key) {
                <ng-container *ngTemplateOutlet="nodo; context: { $implicit: item, nivel: 0 }" />
              }
            </ul>
          </div>
        } @empty {
          <div class="sb-vacio sb-texto">Sin resultados para «{{ filtro() }}»</div>
        }
      </div>

      <div class="sb-pie">
        <div class="sb-usuario" [title]="usuario()">
          <span class="sb-avatar">{{ iniciales() }}</span>
          <span class="sb-texto sb-usuario-texto">
            <strong>{{ usuario() }}</strong>
            <small>Sesión Corporativa Activa</small>
          </span>
        </div>
        <button type="button" class="sb-btn-icono sb-texto" title="Cerrar sesión" (click)="cerrarSesion.emit()">
          <i class="fa fa-power-off" aria-hidden="true"></i>
        </button>
      </div>
    </nav>

    <ng-template #nodo let-item let-nivel="nivel">
      <li role="treeitem" [attr.aria-expanded]="item.hijos?.length ? estaAbierto(item) : null">
        <a
          class="sb-item"
          tabindex="0"
          [class.sb-nivel-1]="nivel > 0"
          [class.activo]="item.key === activoKey()"
          [class.contiene-activo]="contieneActivo(item)"
          [class.destacado]="item.destacado"
          [title]="item.nombre"
          (click)="alSeleccionar(item)"
          (keydown.enter)="alSeleccionar(item)"
          (keydown.space)="$event.preventDefault(); alSeleccionar(item)">
          <span class="sb-item-icono">
            <i class="fa {{ item.icono }}" aria-hidden="true"></i>
            @if (alertaTotalItem(item) > 0 && !expandido()) {
              <span class="sb-punto-alerta" aria-hidden="true"></span>
            }
          </span>
          <span class="sb-texto sb-item-texto">{{ item.nombre }}</span>
          @if (alertaTotalItem(item) > 0) {
            <span class="sb-texto sb-insignia" [title]="alertaTotalItem(item) + ' pendiente(s)'">{{ alertaTotalItem(item) }}</span>
          }
          @if (item.hijos?.length) {
            <i class="sb-texto fa fa-angle-right sb-chevron" [class.girado]="estaAbierto(item)" aria-hidden="true"></i>
          }
        </a>
        @if (item.hijos?.length) {
          <ul class="sb-sublista" role="group" [class.abierta]="estaAbierto(item) && expandido()">
            @for (hijo of item.hijos; track hijo.key) {
              <ng-container *ngTemplateOutlet="nodo; context: { $implicit: hijo, nivel: nivel + 1 }" />
            }
          </ul>
        }
      </li>
    </ng-template>
  `,
  styles: [`
    :host {
      --sb-ancho-riel: 64px;
      --sb-ancho: 300px;
      --sb-top: 54px;
      --sb-fondo: #0a192f;
      --sb-fondo-2: #0f2942;
      --sb-texto: #cbd5e1;
      --sb-texto-tenue: #7f97ad;
      --sb-acento: #004B87;
      --sb-activo: #0d9488;
      display: contents;
      font-family: 'Inter', 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
    }

    .sb-panel {
      position: fixed;
      top: var(--sb-top);
      left: 0;
      bottom: 0;
      width: var(--sb-ancho-riel);
      background: linear-gradient(180deg, var(--sb-fondo) 0%, var(--sb-fondo-2) 100%);
      color: var(--sb-texto);
      display: flex;
      flex-direction: column;
      z-index: 1040;
      overflow: hidden;
      transition: width .22s cubic-bezier(0.4, 0, 0.2, 1), transform .25s ease, box-shadow .22s ease;
      box-shadow: 2px 0 10px rgba(10, 25, 47, .18);
      border-right: 1px solid rgba(255, 255, 255, .06);
    }
    :host(.sb-expandido) .sb-panel { width: var(--sb-ancho); }
    :host(.sb-expandido:not(.sb-fijado):not(.sb-movil)) .sb-panel { box-shadow: 10px 0 30px rgba(10, 25, 47, .42); }

    /* Móvil: panel deslizable */
    :host(.sb-movil) .sb-panel { width: var(--sb-ancho); transform: translateX(-105%); top: 0; z-index: 1060; }
    :host(.sb-movil-abierto) .sb-panel { transform: translateX(0); box-shadow: 10px 0 30px rgba(0, 0, 0, .5); }
    .sb-fondo { position: fixed; inset: 0; background: rgba(10, 20, 30, .55); backdrop-filter: blur(2px); z-index: 1055; animation: sbFade .2s ease; }
    @keyframes sbFade { from { opacity: 0; } to { opacity: 1; } }

    .sb-texto { opacity: 0; visibility: hidden; transition: opacity .15s ease; white-space: nowrap; }
    :host(.sb-expandido) .sb-texto { opacity: 1; visibility: visible; transition-delay: .05s; }

    .sb-cabecera {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 12px 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, .07); min-height: 58px;
    }
    .sb-marca { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .sb-marca-icono {
      flex: 0 0 36px; height: 36px; border-radius: 10px; display: grid; place-items: center;
      background: rgba(13, 148, 136, .2); border: 1px solid rgba(94, 234, 212, .25); color: #fff;
    }
    .sb-marca-texto { display: flex; flex-direction: column; line-height: 1.18; min-width: 0; }
    .sb-marca-texto strong { color: #fff; font-size: 15.5px; letter-spacing: .3px; font-weight: 800; }
    .sb-marca-texto small { color: var(--sb-texto-tenue); font-size: 11px; overflow: hidden; text-overflow: ellipsis; max-width: 190px; }

    .sb-btn-icono {
      border: 0; background: transparent; color: var(--sb-texto-tenue); width: 32px; height: 32px;
      border-radius: 8px; cursor: pointer; flex: 0 0 32px; display: grid; place-items: center;
      transition: all .15s ease;
    }
    .sb-btn-icono:hover { background: rgba(255, 255, 255, .1); color: #fff; }
    .sb-btn-icono.activo { color: #5eead4; background: rgba(13, 148, 136, .28); }
    .sb-btn-icono.activo i { transform: rotate(-45deg); }
    .sb-btn-icono i { transition: transform .2s ease; }

    .sb-buscador { position: relative; margin: 10px 12px 4px; }
    .sb-buscador i { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--sb-texto-tenue); font-size: 12px; }
    .sb-buscador input {
      width: 100%; height: 35px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, .1);
      background: rgba(255, 255, 255, .06); color: #fff; padding: 0 10px 0 32px; font-size: 12.8px; outline: none;
      transition: all .15s ease;
    }
    .sb-buscador input::placeholder { color: var(--sb-texto-tenue); }
    .sb-buscador input:focus { border-color: #5eead4; background: rgba(255, 255, 255, .1); }

    .sb-cuerpo { flex: 1 1 auto; overflow-y: auto; overflow-x: hidden; padding: 6px 0 12px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.2) transparent; }
    .sb-cuerpo::-webkit-scrollbar { width: 5px; }
    .sb-cuerpo::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, .18); border-radius: 3px; }

    .sb-grupo { margin-top: 4px; }
    .sb-grupo-titulo {
      padding: 10px 18px 6px; font-size: 11px; font-weight: 800; letter-spacing: 1.2px;
      text-transform: uppercase; color: #94a3b8; display: flex; align-items: center;
    }
    .sb-grupo-separador { height: 1px; margin: 4px 16px; background: rgba(255, 255, 255, .08); }
    :host(.sb-expandido) .sb-grupo-separador { display: none; }

    .sb-lista, .sb-sublista { list-style: none; margin: 0; padding: 0; }
    .sb-sublista { max-height: 0; overflow: hidden; transition: max-height .25s ease; }
    .sb-sublista.abierta { max-height: 1200px; }

    .sb-item {
      position: relative; display: flex; align-items: center; gap: 12px; min-height: 41px;
      margin: 2px 8px; padding: 8px 10px 8px 14px; border-radius: 9px; color: var(--sb-texto);
      cursor: pointer; text-decoration: none; font-size: 13.2px; font-weight: 500; line-height: 1.3; user-select: none;
      transition: background .15s ease, color .15s ease;
    }
    .sb-item:hover, .sb-item:focus-visible { background: rgba(255, 255, 255, .08); color: #fff; text-decoration: none; outline: none; }
    .sb-item-icono { position: relative; flex: 0 0 20px; text-align: center; font-size: 15px; color: inherit; }
    .sb-item-texto { flex: 1 1 auto; white-space: normal; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

    .sb-nivel-1 { min-height: 35px; padding-left: 42px; font-size: 12.6px; color: #94a3b8; font-weight: 500; }
    .sb-nivel-1 .sb-item-icono { font-size: 12.5px; flex-basis: 16px; }
    .sb-nivel-1::before {
      content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 1px; background: rgba(255, 255, 255, .1);
    }

    .sb-item.activo {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      color: #fff; font-weight: 700; box-shadow: 0 4px 12px rgba(13, 148, 136, .35);
    }
    .sb-item.activo::after { content: ''; position: absolute; left: -8px; top: 8px; bottom: 8px; width: 4px; border-radius: 0 4px 4px 0; background: #5eead4; }
    .sb-item.contiene-activo:not(.activo) { color: #fff; font-weight: 700; background: rgba(255, 255, 255, .05); }
    .sb-item.contiene-activo:not(.activo) .sb-item-icono { color: #5eead4; }

    .sb-item.destacado:not(.activo):not(.contiene-activo) .sb-item-icono { color: #38bdf8; }

    .sb-chevron { flex: 0 0 auto; font-size: 15px; color: var(--sb-texto-tenue); transition: transform .2s ease; }
    .sb-chevron.girado { transform: rotate(90deg); color: #5eead4; }

    .sb-insignia {
      flex: 0 0 auto; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px;
      background: #ef4444; color: #fff; font-size: 10.5px; font-weight: 700; display: grid; place-items: center;
    }
    .sb-punto-alerta { position: absolute; top: -3px; right: -5px; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 0 2px var(--sb-fondo); }

    .sb-vacio { padding: 18px 20px; color: var(--sb-texto-tenue); font-size: 13px; }

    .sb-pie {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 10px 12px 12px 14px; border-top: 1px solid rgba(255, 255, 255, .07);
      background: rgba(0, 0, 0, .15);
    }
    .sb-usuario { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .sb-avatar {
      flex: 0 0 36px; height: 36px; border-radius: 50%; display: grid; place-items: center;
      background: linear-gradient(135deg, #004b87 0%, #0d9488 100%); color: #fff; font-weight: 700; font-size: 13px;
    }
    .sb-usuario-texto { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
    .sb-usuario-texto strong { color: #fff; font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
    .sb-usuario-texto small { color: #5eead4; font-size: 10.5px; }

    @media (prefers-reduced-motion: reduce) {
      .sb-panel, .sb-sublista, .sb-texto, .sb-chevron { transition: none !important; }
    }
  `]
})
export class MsstSidebarComponent implements OnDestroy {
  readonly grupos = input.required<MsstMenuGrupo[]>();
  readonly activoKey = input<string>('');
  readonly usuario = input<string>('');
  readonly empresa = input<string>('');

  readonly seleccionar = output<MsstMenuItem>();
  readonly cerrarSesion = output<void>();

  readonly fijado = signal<boolean>(this.leer(STORAGE_FIJADO) === '1');
  readonly hover = signal<boolean>(false);
  readonly movilAbierto = signal<boolean>(false);
  readonly esMovil = signal<boolean>(false);
  readonly filtro = signal<string>('');
  readonly abiertos = signal<Set<string>>(new Set(JSON.parse(this.leer(STORAGE_ABIERTOS) || '["M03"]') as string[]));

  readonly expandido = computed(() =>
    this.esMovil() ? this.movilAbierto() : this.fijado() || this.hover()
  );

  readonly iniciales = computed(() => {
    const partes = (this.usuario() || 'OS').replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, ' ').trim().split(/\s+/);
    return ((partes[0]?.[0] ?? 'O') + (partes[1]?.[0] ?? 'S')).toUpperCase();
  });

  readonly gruposFiltrados = computed<MsstMenuGrupo[]>(() => {
    const q = this.normalizar(this.filtro());
    if (!q) return this.grupos();
    const filtrar = (items: MsstMenuItem[]): MsstMenuItem[] =>
      items.flatMap(it => {
        const hijos = it.hijos ? filtrar(it.hijos) : [];
        if (this.normalizar(it.nombre).includes(q)) return [{ ...it }];
        return hijos.length ? [{ ...it, hijos }] : [];
      });
    return this.grupos()
      .map(g => ({ ...g, items: filtrar(g.items) }))
      .filter(g => g.items.length > 0);
  });

  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private readonly mql: MediaQueryList | null =
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(BREAKPOINT_MOVIL) : null;
  private readonly alCambiarMedia = (e: MediaQueryListEvent) => {
    this.esMovil.set(e.matches);
    if (!e.matches) this.movilAbierto.set(false);
  };

  private readonly abrirRamaActiva = effect(() => {
    const key = this.activoKey();
    if (!key) return;
    const padres: string[] = [];
    const buscar = (items: MsstMenuItem[], ruta: string[]): boolean => {
      for (const it of items) {
        if (it.key === key) { padres.push(...ruta); return true; }
        if (it.hijos && buscar(it.hijos, [...ruta, it.key])) return true;
      }
      return false;
    };
    this.grupos().some(g => buscar(g.items, []));
    if (padres.length) {
      this.abiertos.update(s => {
        const n = new Set(s);
        padres.forEach(p => n.add(p));
        return n;
      });
    }
  });

  constructor() {
    if (this.mql) {
      this.esMovil.set(this.mql.matches);
      this.mql.addEventListener('change', this.alCambiarMedia);
    }
  }

  ngOnDestroy(): void {
    this.mql?.removeEventListener('change', this.alCambiarMedia);
    if (this.temporizador) clearTimeout(this.temporizador);
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    if (this.movilAbierto()) this.cerrarMovil();
    else if (!this.fijado()) this.hover.set(false);
  }

  @HostListener('document:click', ['$event'])
  alHacerClicFuera(ev: MouseEvent): void {
    if (this.fijado() || !this.hover()) return;
    const t = ev.target as HTMLElement | null;
    if (t && !t.closest('msst-sidebar, .msst-hamburguesa')) {
      this.hover.set(false);
    }
  }

  alEntrar(): void {
    if (this.esMovil()) return;
    this.programar(() => this.hover.set(true), 100);
  }

  alSalir(): void {
    if (this.esMovil()) return;
    this.programar(() => this.hover.set(false), 260);
  }

  alternarFijado(): void {
    const v = !this.fijado();
    this.fijado.set(v);
    this.guardar(STORAGE_FIJADO, v ? '1' : '0');
  }

  alternarMovil(): void {
    this.movilAbierto.update(v => !v);
  }

  cerrarMovil(): void {
    this.movilAbierto.set(false);
  }

  estaAbierto(item: MsstMenuItem): boolean {
    return !!this.filtro() || this.abiertos().has(item.key);
  }

  contieneActivo(item: MsstMenuItem): boolean {
    const key = this.activoKey();
    const buscar = (it: MsstMenuItem): boolean => !!it.hijos?.some(h => h.key === key || buscar(h));
    return buscar(item);
  }

  alertaTotalItem(item: MsstMenuItem): number {
    const propia = item.alerta ?? 0;
    const deHijos = item.hijos?.reduce((acc, h) => acc + this.alertaTotalItem(h), 0) ?? 0;
    return propia + deHijos;
  }

  alSeleccionar(item: MsstMenuItem): void {
    if (item.hijos?.length) {
      if (!this.expandido()) {
        this.hover.set(true);
      }
      if (!this.contieneActivo(item)) {
        this.abrir(item.key, true);
        if (item.hijos[0]) {
          this.seleccionar.emit(item.hijos[0]);
        }
        return;
      }
      const nuevoEstado = !this.abiertos().has(item.key);
      this.abrir(item.key, nuevoEstado);
      return;
    }
    this.seleccionar.emit(item);
    if (this.esMovil()) this.cerrarMovil();
    else if (!this.fijado()) this.programar(() => this.hover.set(false), 150);
  }

  private abrir(key: string, abrir: boolean): void {
    this.abiertos.update(s => {
      const n = new Set(s);
      if (abrir) n.add(key); else n.delete(key);
      this.guardar(STORAGE_ABIERTOS, JSON.stringify([...n]));
      return n;
    });
  }

  private programar(fn: () => void, ms: number): void {
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(fn, ms);
  }

  private normalizar(t: string): string {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private leer(k: string): string | null {
    try { return typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null; } catch { return null; }
  }

  private guardar(k: string, v: string): void {
    try { localStorage.setItem(k, v); } catch { /* almacenamiento no disponible */ }
  }
}
