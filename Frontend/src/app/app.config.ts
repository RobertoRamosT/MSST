import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { GosstSessionService } from './core/services/gosst-session.service';
import { routes } from './app.routes';
import { gosstAuthInterceptor } from './core/interceptors/gosst-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAppInitializer(()=>inject(GosstSessionService).refresh()),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch(), withInterceptors([gosstAuthInterceptor]))
  ]
};
