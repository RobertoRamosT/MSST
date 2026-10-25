import { Routes } from '@angular/router';
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
  { path: 'contratista', component: ContratistaPortalComponent },
  { path: 'workflow', component: WorkflowInteractivoComponent },
  { path: 'modulo01', component: Modulo01SeguridadPerfilesComponent },
  { path: 'modulo02', component: Modulo02OrganizacionMdfComponent },
  { path: 'modulo03', component: Modulo03ContratistasIntegralComponent },
  { path: 'modulo04', component: Modulo04PortalTrabajadorComponent },
  { path: 'modulo05', component: Modulo05TrabajadoresComitesComponent },
  { path: 'modulo06', component: Modulo06PrevencionIpercInspeccionesComponent },
  { path: 'modulo07', component: Modulo07AccidentesMejoraComponent },
  { path: 'modulo08', component: Modulo08CapacitacionEppProcedimientosComponent },
  { path: 'modulo09', component: Modulo09SaludOcupacionalComponent },
  { path: 'modulo10', component: Modulo10AuditoriasRequisitosComponent },
  { path: 'modulo11', component: Modulo11MedioAmbienteComponent },
  { path: 'modulo12', component: Modulo12BiEstadisticasIaVisitantesComponent },
  { path: '**', redirectTo: 'login' }
];
