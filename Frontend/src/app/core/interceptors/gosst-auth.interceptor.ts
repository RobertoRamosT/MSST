import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { GosstSessionService } from '../services/gosst-session.service';

/**
 * Interceptor funcional que replica el comportamiento de callAjaxPost() en util.js:
 * - Incluye credenciales (withCredentials: true) para la cookie JWT CGESTOP_HEADER_DS.
 * - Verifica CODE_RESPONSE == '06' o '07' para expiración de sesión.
 */
export const gosstAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(GosstSessionService);
  const router = inject(Router);

  const clonedReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'Content-Type': 'application/json'
    }
  });

  return next(clonedReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object') {
        const body = event.body as Record<string, any>;
        if (body['CODE_RESPONSE'] === '06' || body['CODE_RESPONSE'] === '07') {
          sessionService.removeAllSession();
          router.navigate(['/login']);
        }
      }
    })
  );
};
