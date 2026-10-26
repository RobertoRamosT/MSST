import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GosstSessionService } from './core/services/gosst-session.service';
const authenticated:CanActivateFn=()=>inject(GosstSessionService).autenticado()||inject(Router).createUrlTree(['/login']);
import { LoginComponent } from './features/login/login.component';
import { ContratistaPortalComponent } from './features/contratista/contratista-portal.component';
import { Modulo01SeguridadPerfilesComponent } from './features/sprint1/modulo01-seguridad-perfiles.component';
import { Modulo02OrganizacionMdfComponent } from './features/sprint1/modulo02-organizacion-mdf.component';
import { Modulo03ContratistasIntegralComponent } from './features/sprint1/modulo03-contratistas-integral.component';
import { Modulo04PortalTrabajadorComponent } from './features/sprint2/modulo04-portal-trabajador.component';
import { Modulo05TrabajadoresComitesComponent } from './features/sprint2/modulo05-trabajadores-comites.component';
import { Modulo06PrevencionIpercInspeccionesComponent } from './features/sprint2/modulo06-prevencion-iperc-inspecciones.component';
import { Modulo07AccidentesMejoraComponent } from './features/sprint2/modulo07-accidentes-mejora.component';
import { Modulo08CapacitacionEppProcedimientosComponent } from './features/sprint2/modulo08-capacitacion-epp-procedimientos.component';
import { Modulo09SaludOcupacionalComponent } from './features/sprint3/modulo09-salud-ocupacional.component';
import { Modulo10AuditoriasRequisitosComponent } from './features/sprint3/modulo10-auditorias-requisitos.component';
import { Modulo11MedioAmbienteComponent } from './features/sprint3/modulo11-medio-ambiente.component';
import { Modulo12BiEstadisticasIaVisitantesComponent } from './features/sprint3/modulo12-bi-estadisticas-ia-visitantes.component';
import { WorkflowInteractivoComponent } from './features/workflow/workflow-interactivo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'contratista', component: ContratistaPortalComponent, canActivate:[authenticated] },
  { path: 'workflow', component: WorkflowInteractivoComponent, canActivate:[authenticated] },
  { path: 'modulo01', component: Modulo01SeguridadPerfilesComponent, canActivate:[authenticated] },
  { path: 'modulo02', component: Modulo02OrganizacionMdfComponent, canActivate:[authenticated] },
  { path: 'modulo03', component: Modulo03ContratistasIntegralComponent, canActivate:[authenticated] },
  { path: 'modulo04', component: Modulo04PortalTrabajadorComponent, canActivate:[authenticated] },
  { path: 'modulo05', component: Modulo05TrabajadoresComitesComponent, canActivate:[authenticated] },
  { path: 'modulo06', component: Modulo06PrevencionIpercInspeccionesComponent, canActivate:[authenticated] },
  { path: 'modulo07', component: Modulo07AccidentesMejoraComponent, canActivate:[authenticated] },
  { path: 'modulo08', component: Modulo08CapacitacionEppProcedimientosComponent, canActivate:[authenticated] },
  { path: 'modulo09', component: Modulo09SaludOcupacionalComponent, canActivate:[authenticated] },
  { path: 'modulo10', component: Modulo10AuditoriasRequisitosComponent, canActivate:[authenticated] },
  { path: 'modulo11', component: Modulo11MedioAmbienteComponent, canActivate:[authenticated] },
  { path: 'modulo12', component: Modulo12BiEstadisticasIaVisitantesComponent, canActivate:[authenticated] },
  { path: '**', redirectTo: 'login' }
];
