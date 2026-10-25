import { Injectable, signal } from '@angular/core';

/**
 * Servicio reactivo de Sesión compatible 1:1 con createSession(), getSession() y removeAllSession()
 * de js/generic/util.js.
 */
@Injectable({ providedIn: 'root' })
export class GosstSessionService {
  readonly empresaNombre = signal<string>(this.getSession('gestopcompanyname') || 'HOLCIM PERU');
  readonly usuarioNombre = signal<string>(this.getSession('gestopusername') || 'GRUPO ELIAS-29 S.A.C');
  readonly perfilNombre = signal<string>(this.getSession('perfilNombre') || 'SUPERVISOR SSOMA ISO 45001');
  readonly nombrePerfil = signal<string>(this.getSession('perfilNombre') || 'SUPERVISOR SSOMA ISO 45001');
  readonly autenticado = signal<boolean>(!!this.getSession('gestopcompanyid'));

  createSession(key: string, value: unknown): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, String(value ?? ''));
    }
  }

  getSession(key: string): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
    return null;
  }

  removeAllSession(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.clear();
    }
    this.autenticado.set(false);
  }

  guardarSesionLogin(data: Record<string, any>): void {
    this.createSession('moduloGosstId', data['moduloId']);
    this.createSession('gestopcompanyid', data['empresaId']);
    this.createSession('actPlanillaTrabAuto', data['actPlanillaTrabAuto']);
    this.createSession('gestopcompanyname', data['empresaNombre']);
    this.createSession('gestopusername', data['usuarioNombre']);
    this.createSession('habilitarValidacion', data['habilitarValidacion']);
    this.createSession('cambioUsuarioDirecto', data['cambioUsuarioDirecto']);
    this.createSession('clasifs', JSON.stringify(data['listaClasificaciones'] ?? []));
    this.createSession('peligros', JSON.stringify(data['mapPeligros'] ?? {}));
    this.createSession('riesgos', JSON.stringify(data['mapRiesgos'] ?? {}));
    this.createSession('numEmpresas', data['numEmpresas']);
    this.createSession('numUnidades', data['numUnidades']);
    this.createSession('trabajadorGosstId', data['trabajadorId']);
    this.createSession('contratistaGosstId', data['contratistaId']);
    this.createSession('tipoContratistaGosstId', data['tipoContratistaId']);
    this.createSession('perfilContratistaGosstId', data['perfilContratistaId']);
    this.createSession('unidadGosstId', data['trabajadorUnidadId']);
    this.createSession('areaGosstId', data['trabajadorAreaId']);
    this.createSession('puestoGosstId', data['trabajadorPuestoId']);
    this.createSession('fechaActualizacionPuesto', data['trabajadorFechaPuesto']);
    this.createSession('accesoGerencia', data['accesoGerencia']);
    this.createSession('contratistaGosstRuc', data['contratistaRuc']);
    this.createSession('fechaHoyTexto', data['fechaHoyTexto']);
    this.createSession('fechaHoyOrdenInversoTexto', data['fechaHoyOrdenInversoTexto']);
    this.createSession('trabajadorSiteId', data['trabajadorSiteId']);
    this.createSession('accesoUsuarios', data['accesoUsuarios']);
    this.createSession('hasTutorialCap', data['hasTutorialCap']);
    this.createSession('gestopInicio', 0);
    this.createSession('modulo', 'Modulos');

    this.empresaNombre.set(data['empresaNombre'] || 'HOLCIM PERU');
    this.usuarioNombre.set(data['usuarioNombre'] || 'GRUPO ELIAS-29 S.A.C');
    this.autenticado.set(true);
  }
}
