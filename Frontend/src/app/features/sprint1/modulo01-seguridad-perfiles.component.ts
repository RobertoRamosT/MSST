import {QueryPagesComponent} from '../../core/components/query-pages.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { confirmedList, apiErrorMessage } from '../../core/services/gosst-api.service';
import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { Router } from '@angular/router';
import { ProfilePermission, SecurityProfilesService } from '../../core/services/security-profiles.service';
import { CredentialAccount, GosstSessionService } from '../../core/services/gosst-session.service';

export type PermisoModuloItem=ProfilePermission;

@Component({
  selector: 'msst-modulo01-seguridad',
  standalone: true,
  imports: [QueryPagesComponent,CommonModule, FormsModule],
  template: `
@if(mensajeOperacion()){<p role="status">{{mensajeOperacion()}}</p>}

    <!-- Encabezado del Módulo 01 -->
    <div class="panel panel-primary" style="margin-bottom: 16px; border-color: #004B87;">
      <div class="panel-heading" style="background-color: #004B87; color: #fff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 class="panel-title" style="font-size: 16px; font-weight: bold;">
            <i class="fa fa-lock"></i> Seguridad, Perfiles, Accesos y Licencia Corporativa
          </h3>
          <div style="font-size: 11.5px; color: #cce0ff; margin-top: 3px;">
            OneSST Enterprise &bull; Control de Accesos Basado en Roles (RBAC), Credenciales Corporativas y Parámetros de Seguridad
          </div>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-xs btn-success" (click)="abrirModalNuevoPerfil()">
            <i class="fa fa-plus-circle"></i> + Nuevo Perfil
          </button>
          <button class="btn btn-xs btn-info" (click)="abrirModalNuevoUsuario()">
            <i class="fa fa-user-plus"></i> + Nuevo Usuario
          </button>
          <button class="btn btn-xs btn-default" (click)="cargarPerfiles(); cargarUsuarios()">
            <i class="fa fa-refresh"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Barra de Sub-pestañas del Módulo 01 -->
      <div class="panel-body" style="background: #f4f7fa; padding: 10px 15px; border-bottom: 1px solid #dce4ec; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'PERFILES' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('PERFILES')">
            <i class="fa fa-shield"></i> 1. Gestión de Perfiles y Roles
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'USUARIOS' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('USUARIOS')">
            <i class="fa fa-users"></i> 2. Administración de Usuarios y Accesos
          </button>
          <button
            type="button"
            class="btn btn-sm"
            [ngClass]="tabActiva() === 'CONFIGURACION' ? 'btn-primary' : 'btn-default'"
            (click)="tabActiva.set('CONFIGURACION')">
            <i class="fa fa-cogs"></i> 3. Configuración, Recuperación y Licencia
          </button>
        </div>

        <div style="font-size: 12px; color: #004B87;">
          <i class="fa fa-shield"></i> Plataforma: <strong>OneSST Enterprise</strong>
          @if (mensajeExito()) {
            <span class="label label-success" style="margin-left: 8px; font-size: 11px;">
              <i class="fa fa-check"></i> {{ mensajeExito() }}
            </span>
          }
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PESTAÑA 1: GESTIÓN DE PERFILES Y ROLES                    -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'PERFILES') {
      <div class="row" style="margin-bottom: 15px;">
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #004B87; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">PERFILES CORPORATIVOS ACTIVOS</div>
            <div style="font-size:22px; font-weight:bold; color:#004B87;">{{ perfiles().length }} Perfiles</div>
            <div style="font-size:11px; color:#28a745;"><i class="fa fa-check-circle"></i> Control de Accesos Activo</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #28a745; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">ALCANCE FUNCIONAL RBAC</div>
            <div style="font-size:22px; font-weight:bold; color:#28a745;">12 Módulos SST</div>
            <div style="font-size:11px; color:#666;">Control granular por operación</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #17a2b8; box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <div style="font-size:11px; color:#666;">SEGURIDAD DE SESIÓN</div>
            <div style="font-size:15px; font-weight:bold; color:#17a2b8; margin-top:4px;">Cifrado Corporativo RS256</div>
            <div style="font-size:11px; color:#666;">Empresa: {{ session.empresaNombre() }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div style="background:#fff; padding:14px; border-radius:4px; border-left:4px solid #ffc107; box-shadow:0 1px 3px rgba(0,0,0,.08); display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:11px; color:#666;">ACCIONES DE PERFIL</div>
            <button class="btn btn-sm btn-primary" style="margin-top:6px;" (click)="abrirModalNuevoPerfil()">
              <i class="fa fa-plus-circle"></i> Nuevo Perfil / Rol SST
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Tabla de Perfiles -->
        <div class="col-md-7">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-id-badge"></i> Catálogo de Perfiles y Roles Corporativos</h4>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-xs btn-default" (click)="cargarPerfiles()">
                  <i class="fa fa-refresh"></i> Refrescar
                </button>
                <button class="btn btn-xs btn-success" (click)="abrirModalNuevoPerfil()">
                  <i class="fa fa-plus"></i> Crear Perfil
                </button>
              </div>
            </div>
            <div class="panel-body">
              <div style="margin-bottom: 10px; display:flex; gap:10px;">
                <input
                  type="text"
                  class="form-control input-sm"
                  placeholder="Filtrar perfil por nombre, descripción o alcance..."
                  [(ngModel)]="filtroPerfil">
              </div>

              <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover">
                  <thead>
                    <tr style="background:#f0f4f8;">
                      <th>ID</th>
                      <th>Nombre del Perfil</th>
                      <th>Descripción / Alcance</th>
                      <th>Nivel Acceso</th>
                      <th>Módulos</th>
                      <th>Estado</th>
                      <th style="width:120px;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of perfilesFiltrados(); track p['id']) {
                      <tr [ngClass]="{ 'info': perfilSeleccionado()['id'] === p['id'] }">
                        <td><strong>#{{ p['id'] }}</strong></td>
                        <td><strong>{{ p['nombre'] }}</strong></td>
                        <td>{{ p['descripcion'] }}</td>
                        <td>
                          <span class="label" [ngClass]="p['nivelAcceso'] === 'CORPORATIVO' ? 'label-danger' : (p['nivelAcceso'] === 'PLANTA' ? 'label-primary' : 'label-info')">
                            {{ p['nivelAcceso'] || 'CORPORATIVO' }}
                          </span>
                        </td>
                        <td><span class="badge">{{ p['modulosHabilitados'] ?? 0 }} / 12</span></td>
                        <td><span class="label label-success">{{ p['estado'] || 'ACTIVO' }}</span></td>
                        <td>
                          <button class="btn btn-xs btn-info" title="Ver/Configurar Matriz" (click)="seleccionarPerfil(p)">
                            <i class="fa fa-sliders"></i>
                          </button>
                          <button class="btn btn-xs btn-primary" style="margin-left:4px;" title="Editar Perfil" (click)="abrirModalEditarPerfil(p)">
                            <i class="fa fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Matriz de Permisos por Módulo del Perfil Seleccionado -->
        <div class="col-md-5">
          <div class="panel panel-info">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title">
                <i class="fa fa-check-square-o"></i> Matriz RBAC: <strong>{{ perfilSeleccionado()['nombre'] }}</strong>
              </h4>
              <button class="btn btn-xs btn-primary" [disabled]="savingPermissions()||!permissionVersion()" (click)="guardarMatrizPermisos()">
                <i class="fa fa-save"></i> Guardar Permisos
              </button>
            </div>
            <div class="panel-body" style="max-height: 430px; overflow-y: auto;">
              <table class="table table-bordered table-condensed">
<thead><tr><th>Permiso</th><th>Descripción</th><th>Habilitado</th></tr></thead><tbody>
@for(perm of permisosMatriz();track perm.code){<tr><td><code>{{perm.code}}</code></td><td>{{perm.label}}</td><td><input type="checkbox" [(ngModel)]="perm.enabled" [disabled]="savingPermissions()"></td></tr>}
@empty{<tr><td colspan="3">Seleccione un perfil para consultar su catálogo de permisos.</td></tr>}
</tbody></table>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- PESTAÑA 2: ADMINISTRACIÓN DE USUARIOS Y POLÍTICAS DE ACCESO               -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'USUARIOS') {
      <div class="row" style="margin-bottom: 15px;">
        <div class="col-md-3">
          <div class="panel panel-default" style="margin-bottom:0; border-top: 3px solid #004B87;">
            <div class="panel-body" style="padding: 12px;">
              <strong style="color:#004B87;"><i class="fa fa-sign-in"></i> 1. Acceso Estándar Corporativo</strong>
              <p style="font-size:11.5px; color:#666; margin:4px 0 0;">Autenticación centralizada para colaboradores, supervisores y gerencia SST.</p>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel panel-default" style="margin-bottom:0; border-top: 3px solid #28a745;">
            <div class="panel-body" style="padding: 12px;">
              <strong style="color:#28a745;"><i class="fa fa-id-card-o"></i> 2. Acceso Colaborador Multi-Sede</strong>
              <p style="font-size:11.5px; color:#666; margin:4px 0 0;">Validación por sede operativa para firma digital de documentos y EPP.</p>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel panel-default" style="margin-bottom:0; border-top: 3px solid #17a2b8;">
            <div class="panel-body" style="padding: 12px;">
              <strong style="color:#17a2b8;"><i class="fa fa-building-o"></i> 3. Acceso Contratista Homologado</strong>
              <p style="font-size:11.5px; color:#666; margin:4px 0 0;">Credenciales empresariales vinculadas a RUC, proyectos y legajo SSOMA.</p>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel panel-default" style="margin-bottom:0; border-top: 3px solid #f0ad4e;">
            <div class="panel-body" style="padding: 12px;">
              <strong style="color:#d58512;"><i class="fa fa-street-view"></i> 4. Control Garita y Visitantes</strong>
              <p style="font-size:11.5px; color:#666; margin:4px 0 0;">Consulta instantánea de habilitación por DNI/Placa y emisión de pases QR.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios Corporativos y Contratistas -->
      <div class="panel panel-primary">
        <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
          <h4 class="panel-title"><i class="fa fa-users"></i> Maestro de Usuarios y Credenciales Corporativas</h4>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-xs btn-default" (click)="cargarUsuarios()">
              <i class="fa fa-refresh"></i> Actualizar Lista
            </button>
            <button class="btn btn-xs btn-success" (click)="abrirModalNuevoUsuario()">
              <i class="fa fa-user-plus"></i> Nuevo Usuario
            </button>
          </div>
        </div>
        <div class="panel-body">
          <div class="row" style="margin-bottom: 10px;">
            <div class="col-md-6">
              <input
                type="text"
                class="form-control input-sm"
                placeholder="Buscar por usuario, nombre o RUC"
                [(ngModel)]="filtroUsuario">
            </div>
            <div class="col-md-6 text-right" style="font-size:12px; padding-top:5px;">
              Total Usuarios Habilitados: <strong>{{ usuariosFiltrados().length }}</strong>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover">
              <thead>
                <tr style="background:#f0f4f8;">
                  <th>ID</th>
                  <th>Usuario (Login)</th>
                  <th>Nombre / Razón Social</th>
                  <th>Perfil Asignado</th>
                  <th>Empresa / RUC</th>
                  <th>Sede / Unidad</th>
                  <th>Credencial</th>
                  <th>Vista Inicial (PATH)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (u of usuariosFiltrados(); track u['id']) {
                  <tr>
                    <td>{{ u['id'] }}</td>
                    <td><code>{{ u['userName'] }}</code></td>
                    <td><strong>{{ u['nombreCompleto'] }}</strong></td>
                    <td><span class="label label-primary">{{ u['perfilNombre'] }}</span></td>
                    <td>{{ u['empresaNombre'] }} <small class="text-muted">({{ u['ruc'] }})</small></td>
                    <td>{{ u['unidad'] }}</td>
                    <td>
                      <span class="label label-default">{{u['credentialState']}}</span>
                    </td>
                    <td><code>{{ u['pathInicio'] }}</code></td>
                    <td><span class="label label-success">{{ u['estado'] }}</span></td>
                    <td>
                      <button class="btn btn-xs btn-primary" title="Editar Usuario" (click)="abrirModalEditarUsuario(u)">
                        <i class="fa fa-pencil"></i> Editar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- PESTAÑA 3: CONFIGURACIÓN GENERAL, RECUPERACIÓN DE CLAVE Y LICENCIA        -->
    <!-- ========================================================================= -->
    @if (tabActiva() === 'CONFIGURACION') {
      <div class="row">
        <!-- Columna 1: Estado de Licencia Corporativa -->
        <div class="col-md-4">
          <div class="panel panel-success">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-certificate"></i> Licencia Corporativa</h4>
              <span class="label label-default">Datos de licencia</span>
            </div>
            <div class="panel-body">
              <div style="text-align:center; padding:12px; background:#f8fff9; border:1px solid #c3e6cb; border-radius:6px; margin-bottom:14px;">
                <i class="fa fa-check-circle text-success" style="font-size:38px;"></i>
                <h4 style="margin:8px 0 2px; color:#155724; font-weight:bold;">Información de licencia recibida</h4>
                <div style="font-size:13px; color:#004B87; font-weight:bold;">{{ licenciaInfo().empresa }} (RUC: {{ licenciaInfo().ruc }})</div>
                <span class="label label-success" style="display:inline-block; margin-top:6px; font-size:12px;">
                  VIGENTE HASTA: {{ licenciaInfo().fechaVencimiento }}
                </span>
              </div>

              <table class="table table-bordered table-condensed" style="font-size:12px;">
                <tbody>
                  <tr>
                    <th>Código Corporativo</th>
                    <td><strong>{{ licenciaInfo().codigoEmpresa }}</strong></td>
                  </tr>
                  <tr>
                    <th>Edición del Motor</th>
                    <td>OneSST Enterprise — Plataforma Corporativa de Seguridad y Salud en el Trabajo</td>
                  </tr>
                  <tr>
                    <th>Entorno Corporativo</th>
                    <td><code>Entorno de este despliegue</code></td>
                  </tr>
                  <tr>
                    <th>Sedes Autorizadas</th>
                    <td>{{ licenciaInfo().sedesAutorizadas }}</td>
                  </tr>
                  <tr>
                    <th>Usuarios / Contratistas</th>
                    <td><span class="label label-primary">Consultar condiciones registradas</span></td>
                  </tr>
                  <tr>
                    <th>Auditoría IA Documental</th>
                    <td><span class="label label-info">Consultar configuración vigente</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-md-4"><div class="panel panel-primary"><div class="panel-heading"><h4 class="panel-title">Contexto de seguridad</h4></div><div class="panel-body"><p>La sesión y sus permisos se consultan en el servidor. Use la matriz de perfiles para administrar autorizaciones y el formulario de credenciales para activar una cuenta existente.</p><p>Usuario: {{session.snapshot()?.userName}}</p><p>Perfil: {{session.snapshot()?.perfilNombre}}</p></div></div></div>

        <!-- Columna 3: Recuperación y Renovación de Clave -->
        <div class="col-md-4">
          <div class="panel panel-warning">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-key"></i> Recuperar / Renovar Clave</h4>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label style="font-size:12px;">Cuenta existente:</label><select class="form-control" [(ngModel)]="provisionUserId" (ngModelChange)="seleccionarCuentaCredencial(+$event)"><option [ngValue]="0">Seleccione usuario</option>@for(u of usuarios();track u['id']){<option [ngValue]="u['id']">{{u['userName']}} · {{u['nombreCompleto']}}</option>}</select>
                <input type="text" class="form-control input-sm" [(ngModel)]="recuperarForm.userName" readonly>
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Nueva contraseña:</label>
                <input type="password" class="form-control input-sm" [(ngModel)]="recuperarForm.nuevaClave" placeholder="El servidor validará la política de contraseña">
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Confirmar Nueva Contraseña:</label>
                <input type="password" class="form-control input-sm" [(ngModel)]="recuperarForm.confirmarClave" placeholder="Repita la nueva contraseña">
              </div>

              <button class="btn btn-sm btn-warning btn-block" [disabled]="!credentialAccount() || !session.snapshot()?.permissions?.includes('security:provision')" (click)="ejecutarRecuperacionClave()">
                <i class="fa fa-envelope-o"></i> Establecer credencial
              </button>

              @if (respuestaRecuperar()) {
                <div class="alert alert-success" style="margin-top:10px; margin-bottom:0; padding:8px; font-size:12px;">
                  <i class="fa fa-check-circle"></i> {{ respuestaRecuperar() }}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL INTERACTIVO: CREAR / EDITAR PERFIL                 -->
    <!-- ========================================================================= -->
    @if (modalPerfilAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:580px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title">
              <i class="fa fa-shield"></i> {{ formPerfil.id ? 'Editar Perfil #' + formPerfil.id : 'Registrar Nuevo Perfil / Rol Corporativo' }}
            </h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalPerfilAbierto.set(false)">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <div class="panel-body">
            <div class="form-group">
              <label>Nombre del Perfil / Rol SST:</label>
              <input type="text" class="form-control input-sm" [(ngModel)]="formPerfil.nombre" placeholder="Ej. Supervisor HSE Contratistas">
            </div>
            <div class="form-group">
              <label>Descripción y Alcance Funcional:</label>
              <textarea class="form-control input-sm" rows="2" [(ngModel)]="formPerfil.descripcion" placeholder="Detalle las atribuciones del perfil..."></textarea>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalPerfilAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarPerfil()">
              <i class="fa fa-save"></i> Guardar Perfil
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ========================================================================= -->
    <!-- MODAL INTERACTIVO: CREAR / EDITAR USUARIO                                 -->
    <!-- ========================================================================= -->
    @if (modalUsuarioAbierto()) {
      <div style="position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; display:flex; align-items:center; justify-content:center; padding:15px;">
        <div class="panel panel-primary" style="width:100%; max-width:640px; margin:0; box-shadow:0 8px 25px rgba(0,0,0,.35);">
          <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
            <h4 class="panel-title">
              <i class="fa fa-user-plus"></i> {{ formUsuario.id ? 'Actualizar Usuario #' + formUsuario.id : 'Crear Nuevo Usuario OneSST' }}
            </h4>
            <button title="Cerrar" class="btn btn-xs btn-danger" (click)="modalUsuarioAbierto.set(false)">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Usuario (Login):</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.userName" placeholder="Ej. supervisor.huachipa">
              </div>
              <div class="col-md-6 form-group">
                <label>Nombre Completo / Razón Social:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.nombreCompleto" placeholder="Nombre completo">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Perfil Asignado:</label>
                <select class="form-control input-sm" [(ngModel)]="formUsuario.perfilId"><option [ngValue]="0">Seleccione un perfil existente</option>@for(p of perfiles();track p['id']){<option [ngValue]="p['id']">{{p['nombre']}}</option>}





                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Empresa / Contratista:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.empresaNombre" placeholder="Nombre de la empresa">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>RUC Asociado:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.ruc" placeholder="RUC de la empresa">
              </div>
              <div class="col-md-4 form-group">
                <label>Sede / Unidad:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.unidad" placeholder="Planta Condorcocha">
              </div>
              <div class="col-md-4 form-group">
                <label>Módulo Inicial:</label>
                <select class="form-control input-sm" [(ngModel)]="formUsuario.pathInicio">
                  <option value="Gestión de Contratistas">Gestión de Contratistas</option>
                  <option value="Portal del Colaborador">Portal del Colaborador</option>
                  <option value="Prevención de Riesgos">Prevención de Riesgos</option>
                  <option value="Control de Garita">Control de Garita</option>
                </select>
              </div>
            </div>
          </div>
          <div class="panel-footer" style="display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn btn-sm btn-default" (click)="modalUsuarioAbierto.set(false)">Cancelar</button>
            <button class="btn btn-sm btn-primary" (click)="guardarUsuario()">
              <i class="fa fa-save"></i> Guardar Usuario
            </button>
          </div>
        </div>
      </div>
    }

<msst-query-pages [routes]="pageRoutes" />
`
})
export class Modulo01SeguridadPerfilesComponent implements OnInit {
  readonly mensajeOperacion=signal('');

  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);

  readonly tabActiva = signal<'PERFILES' | 'USUARIOS' | 'CONFIGURACION'>('PERFILES');

  /** Pestaña solicitada desde el submenú del sidebar (menú lateral 1:1 con GOSST). */

  readonly tab = input<string | null>(null);

  private readonly sincronizarTabDesdeMenu = effect(() => {

    const t = this.tab();

    if (t) {

      this.tabActiva.set(t as never);

    }

  });
  readonly mensajeExito = signal<string>('');

  // Estado de Perfiles
  filtroPerfil = '';
  readonly perfiles = signal<Record<string, any>[]>([]);
  readonly perfilSeleccionado = signal<Record<string, any>>({});

  readonly permisosMatriz = signal<ProfilePermission[]>([]);
  private readonly profilesApi=inject(SecurityProfilesService);
  private readonly permissionsRouter=inject(Router);
  readonly permissionVersion=signal('');
  readonly savingPermissions=signal(false);

  // Estado de Usuarios
  filtroUsuario = '';
  readonly usuarios = signal<Record<string, any>[]>([]);

  // Estado de Licencia y Configuración
  readonly licenciaInfo=signal({empresa:'',ruc:'',codigoEmpresa:'',fechaVencimiento:'',sedesAutorizadas:''});


  recuperarForm = {
    userName: '',
    correo: '',
    nuevaClave: '',
    confirmarClave: ''
  };
  readonly respuestaRecuperar = signal<string>('');
  readonly credentialAccount=signal<CredentialAccount|null>(null);
  provisionUserId=0;

  // Modales
  readonly modalPerfilAbierto = signal<boolean>(false);
  formPerfil={id:0,nombre:'',descripcion:'',nivelAcceso:'',modulosHabilitados:0,version:''};

  readonly modalUsuarioAbierto = signal<boolean>(false);
  formUsuario={id:0,userName:'',nombreCompleto:'',perfilId:0,perfilNombre:'',empresaNombre:'',ruc:'',unidad:'',pathInicio:'',version:''};

  // Visor 1:1

  readonly pageRoutes=['/perfil/lista', '/usuario/lista'];
  private readonly pageReload=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.ngOnInit();});
  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarUsuarios();
    this.cargarLicenciaEmpresa();
  }

  perfilesFiltrados(): Record<string, any>[] {
    const q = this.filtroPerfil.trim().toLowerCase();
    if (!q) return this.perfiles();
    return this.perfiles().filter(
      p =>
        String(p['nombre'] || '').toLowerCase().includes(q) ||
        String(p['descripcion'] || '').toLowerCase().includes(q) ||
        String(p['nivelAcceso'] || '').toLowerCase().includes(q)
    );
  }

  usuariosFiltrados(): Record<string, any>[] {
    const q = this.filtroUsuario.trim().toLowerCase();
    if (!q) return this.usuarios();
    return this.usuarios().filter(
      u =>
        String(u['userName'] || '').toLowerCase().includes(q) ||
        String(u['nombreCompleto'] || '').toLowerCase().includes(q) ||
        String(u['ruc'] || '').toLowerCase().includes(q) ||
        String(u['perfilNombre'] || '').toLowerCase().includes(q)
    );
  }

  cargarPerfiles(): void {
    this.api.callAjaxPost('/perfil/lista', { ...{} }).subscribe({next:(response)=>{try{this.perfiles.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  cargarUsuarios(): void {
    this.api.callAjaxPost('/usuario/lista', { ...{} }).subscribe({next:(response)=>{try{this.usuarios.set(confirmedList<Record<string, any>>(response,[]));}catch(error){this.mensajeOperacion.set(apiErrorMessage(error));}},error:(error:unknown)=>this.mensajeOperacion.set(apiErrorMessage(error))});
  }

  cargarLicenciaEmpresa():void{this.api.getEmpresaById().subscribe({next:res=>{const emp=res['empresa'];if(!emp||typeof emp['name']!=='string'){this.mensajeOperacion.set('No se confirmó la información de la empresa.');return;}this.licenciaInfo.set({empresa:emp['name'],ruc:typeof emp['ruc']==='string'?emp['ruc']:'',codigoEmpresa:typeof emp['codigo']==='string'?emp['codigo']:'',fechaVencimiento:typeof emp['fechaVencimiento']==='string'?emp['fechaVencimiento']:'',sedesAutorizadas:typeof emp['sedesAutorizadas']==='string'?emp['sedesAutorizadas']:''});},error:e=>this.mensajeOperacion.set(apiErrorMessage(e))});}

  seleccionarPerfil(p:Record<string,any>):void{
 if(this.savingPermissions())return;
 this.perfilSeleccionado.set(p);this.permissionVersion.set('');this.permisosMatriz.set([]);
 try{this.profilesApi.load(Number(p['id'])).subscribe({next:result=>{
  if(this.perfilSeleccionado()['id']!==result.profileId)return;
  this.permissionVersion.set(result.version);this.permisosMatriz.set(result.permissions);
 },error:e=>this.mensajeOperacion.set(apiErrorMessage(e))});}catch(e){this.mensajeOperacion.set(apiErrorMessage(e));}
}

  abrirModalNuevoPerfil():void{this.formPerfil={id:0,nombre:'',descripcion:'',nivelAcceso:'',modulosHabilitados:0,version:''};this.modalPerfilAbierto.set(true);}

  abrirModalEditarPerfil(p:Record<string,any>):void{this.formPerfil={id:Number(p['id']),nombre:String(p['nombre']??''),descripcion:String(p['descripcion']??''),nivelAcceso:String(p['nivelAcceso']??''),modulosHabilitados:Number(p['modulosHabilitados']??0),version:String(p['version']??'')};this.modalPerfilAbierto.set(true);}

  guardarPerfil():void{if(!this.formPerfil.nombre.trim())return;this.api.callAjaxPost(this.formPerfil.id>0?'/perfil/update':'/perfil/insert',{id:this.formPerfil.id,nombre:this.formPerfil.nombre,descripcion:this.formPerfil.descripcion,expectedVersion:this.formPerfil.version||undefined}).subscribe({next:()=>{this.cargarPerfiles();this.modalPerfilAbierto.set(false);this.mensajeOperacion.set('Perfil confirmado. Configure sus permisos en la matriz del servidor.');},error:e=>this.mensajeOperacion.set(apiErrorMessage(e))});}

  guardarMatrizPermisos():void{
 const id=Number(this.perfilSeleccionado()['id']),version=this.permissionVersion();if(this.savingPermissions()||!version)return;
 this.savingPermissions.set(true);this.profilesApi.save(id,version,this.permisosMatriz()).subscribe({
 next:result=>{this.permissionVersion.set(result.version);this.permisosMatriz.set(result.permissions);this.savingPermissions.set(false);
  this.mensajeOperacion.set('Permisos confirmados. Se actualizará la sesión con los permisos vigentes.');
  void this.session.refresh().then(()=>{if(!this.session.autenticado())void this.permissionsRouter.navigate(['/login']);});},
 error:e=>{this.savingPermissions.set(false);this.mensajeOperacion.set(apiErrorMessage(e));}
 });
}

  abrirModalNuevoUsuario():void{this.formUsuario={id:0,userName:'',nombreCompleto:'',perfilId:0,perfilNombre:'',empresaNombre:'',ruc:'',unidad:'',pathInicio:'',version:''};this.modalUsuarioAbierto.set(true);}

  abrirModalEditarUsuario(u:Record<string,any>):void{this.formUsuario={id:Number(u['id']),userName:String(u['userName']??''),nombreCompleto:String(u['nombreCompleto']??''),perfilId:Number(u['perfilId']??0),perfilNombre:String(u['perfilNombre']??''),empresaNombre:String(u['empresaNombre']??''),ruc:String(u['ruc']??''),unidad:String(u['unidad']??''),pathInicio:String(u['pathInicio']??''),version:String(u['version']??'')};this.modalUsuarioAbierto.set(true);}

  guardarUsuario():void{
 if(!this.formUsuario.userName.trim()||!this.perfiles().some(p=>p['id']===this.formUsuario.perfilId)){this.mensajeOperacion.set('Seleccione usuario y perfil existentes válidos.');return;}
 const payload={id:this.formUsuario.id,userName:this.formUsuario.userName,nombreCompleto:this.formUsuario.nombreCompleto,perfilId:this.formUsuario.perfilId,unidad:this.formUsuario.unidad,pathInicio:this.formUsuario.pathInicio,expectedVersion:this.formUsuario.version||undefined};
 this.api.callAjaxPost(this.formUsuario.id>0?'/usuario/update':'/usuario/insert',payload).subscribe({next:()=>{this.cargarUsuarios();this.modalUsuarioAbierto.set(false);this.mensajeOperacion.set('Usuario confirmado. La credencial debe provisionarse por un administrador autorizado.');},error:e=>this.mensajeOperacion.set(apiErrorMessage(e))});
}


  ejecutarRecuperacionClave():void{
 const account=this.credentialAccount();if(!account||!this.recuperarForm.nuevaClave||this.recuperarForm.nuevaClave!==this.recuperarForm.confirmarClave){this.respuestaRecuperar.set('Seleccione una cuenta y confirme la nueva contraseña.');return;}
 this.session.provision(account,this.recuperarForm.nuevaClave,this.recuperarForm.confirmarClave).subscribe({
 next:updated=>{this.credentialAccount.set(updated);this.recuperarForm.nuevaClave='';this.recuperarForm.confirmarClave='';this.respuestaRecuperar.set('Credencial provisionada y confirmada por el servidor.');},
 error:e=>this.respuestaRecuperar.set(apiErrorMessage(e))});
}
seleccionarCuentaCredencial(userId:number):void{
 this.credentialAccount.set(null);
 if(!Number.isSafeInteger(userId)||userId<=0)return;
 this.session.account(userId).subscribe({next:account=>{this.credentialAccount.set(account);this.recuperarForm.userName=account.userName;this.respuestaRecuperar.set('Cuenta confirmada: '+account.credentialState);},error:e=>this.respuestaRecuperar.set(apiErrorMessage(e))});
}


  private notificarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
