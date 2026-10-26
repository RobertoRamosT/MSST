import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GosstSessionService } from './core/services/gosst-session.service';
const authenticated:CanActivateFn=()=>inject(GosstSessionService).autenticado()||inject(Router).createUrlTree(['/login']);
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'contratista', loadComponent: () => import('./features/contratista/contratista-portal.component').then(module => module.ContratistaPortalComponent), canActivate:[authenticated] },
  { path: 'workflow', loadComponent: () => import('./features/workflow/workflow-interactivo.component').then(module => module.WorkflowInteractivoComponent), canActivate:[authenticated] },
  { path: 'modulo01', loadComponent: () => import('./features/sprint1/modulo01-seguridad-perfiles.component').then(module => module.Modulo01SeguridadPerfilesComponent), canActivate:[authenticated] },
  { path: 'modulo02', loadComponent: () => import('./features/sprint1/modulo02-organizacion-mdf.component').then(module => module.Modulo02OrganizacionMdfComponent), canActivate:[authenticated] },
  { path: 'modulo03', loadComponent: () => import('./features/sprint1/modulo03-contratistas-integral.component').then(module => module.Modulo03ContratistasIntegralComponent), canActivate:[authenticated] },
  { path: 'modulo04', loadComponent: () => import('./features/sprint2/modulo04-portal-trabajador.component').then(module => module.Modulo04PortalTrabajadorComponent), canActivate:[authenticated] },
  { path: 'modulo05', loadComponent: () => import('./features/sprint2/modulo05-trabajadores-comites.component').then(module => module.Modulo05TrabajadoresComitesComponent), canActivate:[authenticated] },
  { path: 'modulo06', loadComponent: () => import('./features/sprint2/modulo06-prevencion-iperc-inspecciones.component').then(module => module.Modulo06PrevencionIpercInspeccionesComponent), canActivate:[authenticated] },
  { path: 'modulo07', loadComponent: () => import('./features/sprint2/modulo07-accidentes-mejora.component').then(module => module.Modulo07AccidentesMejoraComponent), canActivate:[authenticated] },
  { path: 'modulo08', loadComponent: () => import('./features/sprint2/modulo08-capacitacion-epp-procedimientos.component').then(module => module.Modulo08CapacitacionEppProcedimientosComponent), canActivate:[authenticated] },
  { path: 'modulo09', loadComponent: () => import('./features/sprint3/modulo09-salud-ocupacional.component').then(module => module.Modulo09SaludOcupacionalComponent), canActivate:[authenticated] },
  { path: 'modulo10', loadComponent: () => import('./features/sprint3/modulo10-auditorias-requisitos.component').then(module => module.Modulo10AuditoriasRequisitosComponent), canActivate:[authenticated] },
  { path: 'modulo11', loadComponent: () => import('./features/sprint3/modulo11-medio-ambiente.component').then(module => module.Modulo11MedioAmbienteComponent), canActivate:[authenticated] },
  { path: 'modulo12', loadComponent: () => import('./features/sprint3/modulo12-bi-estadisticas-ia-visitantes.component').then(module => module.Modulo12BiEstadisticasIaVisitantesComponent), canActivate:[authenticated] },
  { path: '**', redirectTo: 'login' }
];
