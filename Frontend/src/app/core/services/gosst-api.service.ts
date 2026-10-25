import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GOSST_CONFIG } from '../config/gosst.constants';

export interface LoginPayload {
  userName: string;
  password: string;
  ruc?: string;
  passCorreo?: string;
}

/**
 * Servicio central de comunicación con el Backend .NET 10 Native AOT (/sst/*).
 * Reemplaza todas las variantes de callAjaxPost / callAjaxPostSimple de util.js
 * y soporta las 1,344 rutas REST registradas en MSST_DB (DESKTOP-LOCAL).
 */
@Injectable({ providedIn: 'root' })
export class GosstApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = GOSST_CONFIG.apiUrl;

  login(payload: LoginPayload): Observable<Record<string, any>> {
    return this.http.post<Record<string, any>>(`${this.baseUrl}/login/validated`, payload);
  }

  getHealthAot(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/health`);
  }

  getEmpresaById(idCompany = 773): Observable<Record<string, any>> {
    return this.http.post<Record<string, any>>(`${this.baseUrl}/empresa/id`, { idCompany });
  }

  getEmpresaMensaje(idCompany = 773): Observable<Record<string, any>> {
    return this.http.post<Record<string, any>>(`${this.baseUrl}/empresa/mensaje`, { idCompany });
  }

  /**
   * Invoca cualquiera de los 1,344 endpoints del catálogo (/sst/contratista/*, /sst/iperc/*, etc.)
   */
  callAjaxPost<T = Record<string, any>>(relativeRoute: string, dataParam: Record<string, any> = {}): Observable<T> {
    const cleanRoute = relativeRoute.startsWith('/') ? relativeRoute : `/${relativeRoute}`;
    return this.http.post<T>(`${this.baseUrl}${cleanRoute}`, dataParam);
  }
}
