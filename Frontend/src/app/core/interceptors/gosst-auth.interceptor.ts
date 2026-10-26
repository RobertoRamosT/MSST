import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { GosstSessionService } from '../services/gosst-session.service';

export const gosstAuthInterceptor:HttpInterceptorFn=(req,next)=>{
  // API de este despliegue: nunca transmitir cookie/token a destinos externos.
  const api=req.url.startsWith('/sst/');
  if(!api)return next(req);
  const session=inject(GosstSessionService),router=inject(Router);
  const multipart=typeof FormData!=='undefined'&&req.body instanceof FormData;
  let headers=multipart?req.headers.delete('Content-Type'):req.headers;
  const mutating=!['GET','HEAD','OPTIONS'].includes(req.method);
  const csrf=session.csrfToken();
  if(mutating&&csrf)headers=headers.set('X-CSRF-TOKEN',csrf);
  return next(req.clone({withCredentials:true,headers})).pipe(tap({
    next:event=>{
      if(event instanceof HttpResponse&&event.body!==null&&typeof event.body==='object'&&!Array.isArray(event.body)){
        const code=(event.body as Record<string,unknown>)['CODE_RESPONSE'];
        if(code==='06'||code==='07'){session.removeAllSession();void router.navigate(['/login']);}
      }
    },
    error:(error:unknown)=>{
      if(error instanceof HttpErrorResponse&&error.status===401&&!req.url.startsWith('/sst/security/')){
        session.removeAllSession();void router.navigate(['/login']);
      }
      // HTTP403 conserva identidad y llega al componente. No existe empresa de respaldo.
    }
  }));
};
