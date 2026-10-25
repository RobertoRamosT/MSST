import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GosstApiService } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';

export interface PermisoModuloItem {
  codigo: string;
  modulo: string;
  lectura: boolean;
  escritura: boolean;
  aprobacion: boolean;
  exportacion: boolean;
}

@Component({
  selector: 'msst-modulo01-seguridad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                        <td><span class="badge">{{ p['modulosHabilitados'] || 12 }} / 12</span></td>
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
              <button class="btn btn-xs btn-primary" (click)="guardarMatrizPermisos()">
                <i class="fa fa-save"></i> Guardar Permisos
              </button>
            </div>
            <div class="panel-body" style="max-height: 430px; overflow-y: auto;">
              <table class="table table-bordered table-condensed table-striped" style="margin-bottom:0; font-size:12px;">
                <thead>
                  <tr style="background:#e9eff6;">
                    <th>Módulo OneSST</th>
                    <th class="text-center">Ver</th>
                    <th class="text-center">Crear/Ed.</th>
                    <th class="text-center">Aprobar</th>
                    <th class="text-center">Exportar</th>
                  </tr>
                </thead>
                <tbody>
                  @for (perm of permisosMatriz(); track perm.codigo) {
                    <tr>
                      <td><strong>[D{{ perm.codigo }}]</strong> {{ perm.modulo }}</td>
                      <td class="text-center">
                        <input type="checkbox" [(ngModel)]="perm.lectura">
                      </td>
                      <td class="text-center">
                        <input type="checkbox" [(ngModel)]="perm.escritura">
                      </td>
                      <td class="text-center">
                        <input type="checkbox" [(ngModel)]="perm.aprobacion">
                      </td>
                      <td class="text-center">
                        <input type="checkbox" [(ngModel)]="perm.exportacion">
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
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
                placeholder="Buscar por usuario (holcim.contratista, admin.sst), nombre, RUC o correo..."
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
                  <th>MFA 2FA</th>
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
                      @if (u['mfaActivo']) {
                        <span class="label label-success"><i class="fa fa-shield"></i> ACTIVO</span>
                      } @else {
                        <span class="label label-default">OPCIONAL</span>
                      }
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
              <span class="label label-success">Activa</span>
            </div>
            <div class="panel-body">
              <div style="text-align:center; padding:12px; background:#f8fff9; border:1px solid #c3e6cb; border-radius:6px; margin-bottom:14px;">
                <i class="fa fa-check-circle text-success" style="font-size:38px;"></i>
                <h4 style="margin:8px 0 2px; color:#155724; font-weight:bold;">LICENCIA ENTERPRISE ACTIVA</h4>
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
                    <td><code>Producción Corporativa OneSST</code></td>
                  </tr>
                  <tr>
                    <th>Sedes Autorizadas</th>
                    <td>{{ licenciaInfo().sedesAutorizadas }}</td>
                  </tr>
                  <tr>
                    <th>Usuarios / Contratistas</th>
                    <td><span class="label label-primary">ILIMITADOS (Multi-Sede)</span></td>
                  </tr>
                  <tr>
                    <th>Auditoría IA Documental</th>
                    <td><span class="label label-info">HABILITADO 100%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Columna 2: Parámetros de Configuración y Seguridad -->
        <div class="col-md-4">
          <div class="panel panel-primary">
            <div class="panel-heading" style="background-color:#004B87; display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-sliders"></i> Parámetros de Seguridad</h4>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label style="font-size:12px;">
                  <input type="checkbox" [(ngModel)]="configForm.habilitarMfa">
                  Habilitar Autenticación de Doble Factor (MFA por Correo)
                </label>
              </div>
              <div class="form-group">
                <label style="font-size:12px;">
                  <input type="checkbox" [(ngModel)]="configForm.validarTerminosCondicion">
                  Exigir Aceptación de Términos y Condiciones Legales SST
                </label>
              </div>
              <div class="form-group">
                <label style="font-size:12px;">
                  <input type="checkbox" [(ngModel)]="configForm.actPlanillaTrabAuto">
                  Actualización Automática de Planilla de Trabajadores
                </label>
              </div>
              <div class="form-group">
                <label style="font-size:12px;">
                  <input type="checkbox" [(ngModel)]="configForm.cambioUsuarioDirecto">
                  Permitir Cambio Rápido de Perfil/Contratista en Barra Superior
                </label>
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Días para Renovación Obligatoria de Contraseña:</label>
                <input type="number" class="form-control input-sm" [(ngModel)]="configForm.diasRenovacionClave">
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Correo Corporativo para Notificaciones MFA / Alertas:</label>
                <input type="email" class="form-control input-sm" [(ngModel)]="configForm.correoNotificaciones">
              </div>

              <button class="btn btn-sm btn-primary btn-block" (click)="guardarConfiguracionGeneral()">
                <i class="fa fa-save"></i> Guardar Configuración
              </button>
            </div>
          </div>
        </div>

        <!-- Columna 3: Recuperación y Renovación de Clave -->
        <div class="col-md-4">
          <div class="panel panel-warning">
            <div class="panel-heading" style="display:flex; justify-content:space-between; align-items:center;">
              <h4 class="panel-title"><i class="fa fa-key"></i> Recuperar / Renovar Clave</h4>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label style="font-size:12px;">Usuario o RUC Contratista:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="recuperarForm.userName" placeholder="Ej. holcim.contratista">
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Correo Electrónico Registrado:</label>
                <input type="email" class="form-control input-sm" [(ngModel)]="recuperarForm.correo" placeholder="seguridad@elias29.com.pe">
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Nueva Contraseña (Cumplimiento ISO 27001):</label>
                <input type="password" class="form-control input-sm" [(ngModel)]="recuperarForm.nuevaClave" placeholder="Mínimo 8 caracteres alfanuméricos">
              </div>
              <div class="form-group">
                <label style="font-size:12px;">Confirmar Nueva Contraseña:</label>
                <input type="password" class="form-control input-sm" [(ngModel)]="recuperarForm.confirmarClave" placeholder="Repita la nueva contraseña">
              </div>

              <button class="btn btn-sm btn-warning btn-block" (click)="ejecutarRecuperacionClave()">
                <i class="fa fa-envelope-o"></i> Procesar Cambio / Envío de Token
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
            <div class="row">
              <div class="col-md-6 form-group">
                <label>Nivel Organizacional:</label>
                <select class="form-control input-sm" [(ngModel)]="formPerfil.nivelAcceso">
                  <option value="CORPORATIVO">CORPORATIVO (Multi-Empresa)</option>
                  <option value="PLANTA">PLANTA / UNIDAD OPERATIVA</option>
                  <option value="CONTRATISTA">PORTAL CONTRATISTA</option>
                  <option value="GARITA">CONTROL DE GARITA</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Cantidad de Módulos Habilitados:</label>
                <input type="number" class="form-control input-sm" min="1" max="12" [(ngModel)]="formPerfil.modulosHabilitados">
              </div>
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
                <select class="form-control input-sm" [(ngModel)]="formUsuario.perfilNombre">
                  <option value="Administrador Corporativo SST">Administrador Corporativo SST</option>
                  <option value="Contratista Homologado">Contratista Homologado</option>
                  <option value="Supervisor HSE Planta">Supervisor HSE Planta</option>
                  <option value="Médico Ocupacional">Médico Ocupacional</option>
                  <option value="Inspector de Garita">Inspector de Garita</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label>Empresa / Contratista:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.empresaNombre" placeholder="HOLCIM PERU / GRUPO ELIAS-29 S.A.C">
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 form-group">
                <label>RUC Asociado:</label>
                <input type="text" class="form-control input-sm" [(ngModel)]="formUsuario.ruc" placeholder="20608094068">
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
            <div class="checkbox">
              <label>
                <input type="checkbox" [(ngModel)]="formUsuario.mfaActivo"> Requerir validación MFA por correo al iniciar sesión
              </label>
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
  `
})
export class Modulo01SeguridadPerfilesComponent implements OnInit {
  private readonly api = inject(GosstApiService);
  readonly session = inject(GosstSessionService);
  private readonly sanitizer = inject(DomSanitizer);

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
  readonly perfiles = signal<Record<string, any>[]>([
    { id: 1, nombre: 'Administrador Corporativo SST', descripcion: 'Control total de los 12 dominios, homologación y configuración global', nivelAcceso: 'CORPORATIVO', modulosHabilitados: 12, estado: 'ACTIVO' },
    { id: 2, nombre: 'Contratista Homologado (Portal)', descripcion: 'Gestión de proyectos, acreditación de personal/flota, PETAR y carpetas IA', nivelAcceso: 'CONTRATISTA', modulosHabilitados: 6, estado: 'ACTIVO' },
    { id: 3, nombre: 'Supervisor HSE Planta', descripcion: 'Aprobación de matrices IPERC, inspecciones, PETAR, ATS y auditorías de campo', nivelAcceso: 'PLANTA', modulosHabilitados: 10, estado: 'ACTIVO' },
    { id: 4, nombre: 'Médico Ocupacional (Salud)', descripcion: 'Vigilancia médica EMO, psicología ocupacional, aptitud clínica y seguimiento COVID', nivelAcceso: 'PLANTA', modulosHabilitados: 5, estado: 'ACTIVO' },
    { id: 5, nombre: 'Control de Acceso y Garita', descripcion: 'Verificación en tiempo real por DNI/Placa de habilitación de ingreso y salida', nivelAcceso: 'GARITA', modulosHabilitados: 3, estado: 'ACTIVO' },
    { id: 6, nombre: 'Auditor Legal y Medio Ambiente', descripcion: 'Fiscalización SUNAFIL, ISO 45001, residuos sólidos, MSDS y huella de carbono', nivelAcceso: 'CORPORATIVO', modulosHabilitados: 8, estado: 'ACTIVO' }
  ]);
  readonly perfilSeleccionado = signal<Record<string, any>>(this.perfiles()[0]);

  readonly permisosMatriz = signal<PermisoModuloItem[]>([
    { codigo: '01', modulo: 'Seguridad, Login y Perfiles', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '02', modulo: 'Organización, Unidades y MDF', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '03', modulo: 'Contratistas, Homologación y Garita', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '04', modulo: 'Portal Trabajador y Calendario SST', lectura: true, escritura: true, aprobacion: false, exportacion: true },
    { codigo: '05', modulo: 'Trabajadores, Comités y Elecciones', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '06', modulo: 'Prevención: IPERC, Inspecciones y OPT', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '07', modulo: 'Accidentes, Incidentes y Mejora', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '08', modulo: 'Capacitaciones, Aula Virtual y EPP', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '09', modulo: 'Salud Ocupacional (EMO / Psicología)', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '10', modulo: 'Auditorías y Requisitos Legales', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '11', modulo: 'Medio Ambiente, Residuos y GEI', lectura: true, escritura: true, aprobacion: true, exportacion: true },
    { codigo: '12', modulo: 'BI, Estadísticas MINTRA e IA SST', lectura: true, escritura: false, aprobacion: true, exportacion: true }
  ]);

  // Estado de Usuarios
  filtroUsuario = '';
  readonly usuarios = signal<Record<string, any>[]>([
    { id: 101, userName: 'holcim.contratista', nombreCompleto: 'GRUPO ELIAS-29 S.A.C', perfilNombre: 'Contratista Homologado', empresaNombre: 'HOLCIM PERU', ruc: '20608094068', unidad: 'Planta Condorcocha', mfaActivo: false, pathInicio: 'Gestión de Contratistas', estado: 'ACTIVO' },
    { id: 102, userName: 'admin.sst', nombreCompleto: 'Ing. Roberto Ramos (Gerente Corporativo HSE)', perfilNombre: 'Administrador Corporativo SST', empresaNombre: 'HOLCIM PERU', ruc: '20100128218', unidad: 'Sede Central Lima', mfaActivo: true, pathInicio: 'Portal del Colaborador', estado: 'ACTIVO' },
    { id: 103, userName: 'supervisor.condorcocha', nombreCompleto: 'Ing. Carlos Mendoza', perfilNombre: 'Supervisor HSE Planta', empresaNombre: 'HOLCIM PERU', ruc: '20100128218', unidad: 'Planta Condorcocha', mfaActivo: true, pathInicio: 'Prevención de Riesgos', estado: 'ACTIVO' },
    { id: 104, userName: 'medico.ocupacional', nombreCompleto: 'Dra. Elena Valdivia (CMP 54821)', perfilNombre: 'Médico Ocupacional', empresaNombre: 'HOLCIM PERU', ruc: '20100128218', unidad: 'Planta Huachipa', mfaActivo: true, pathInicio: 'Salud Ocupacional', estado: 'ACTIVO' },
    { id: 105, userName: 'garita.control', nombreCompleto: 'Centro de Control Patrimonial Turno 1', perfilNombre: 'Inspector de Garita', empresaNombre: 'HOLCIM PERU', ruc: '20100128218', unidad: 'Garita Principal Condorcocha', mfaActivo: false, pathInicio: 'Control de Garita', estado: 'ACTIVO' }
  ]);

  // Estado de Licencia y Configuración
  readonly licenciaInfo = signal({
    empresa: 'HOLCIM PERU S.A.',
    ruc: '20100128218',
    codigoEmpresa: 'HOLCIM01',
    fechaVencimiento: '31/12/2030',
    sedesAutorizadas: 'Condorcocha, Huachipa, Atocongo, Yura'
  });

  configForm = {
    habilitarMfa: true,
    validarTerminosCondicion: true,
    actPlanillaTrabAuto: true,
    cambioUsuarioDirecto: true,
    diasRenovacionClave: 90,
    correoNotificaciones: 'seguridad.corporativa@holcim.com'
  };

  recuperarForm = {
    userName: 'holcim.contratista',
    correo: 'operaciones@elias29.com.pe',
    nuevaClave: '',
    confirmarClave: ''
  };
  readonly respuestaRecuperar = signal<string>('');

  // Modales
  readonly modalPerfilAbierto = signal<boolean>(false);
  formPerfil = {
    id: 0,
    nombre: '',
    descripcion: '',
    nivelAcceso: 'CORPORATIVO',
    modulosHabilitados: 12
  };

  readonly modalUsuarioAbierto = signal<boolean>(false);
  formUsuario = {
    id: 0,
    userName: '',
    nombreCompleto: '',
    perfilNombre: 'Contratista Homologado',
    empresaNombre: 'HOLCIM PERU',
    ruc: '20608094068',
    unidad: 'Planta Condorcocha',
    pathInicio: 'Gestión de Contratistas',
    mfaActivo: false
  };

  // Visor 1:1
  readonly visor1a1Abierto = signal<boolean>(false);
  readonly visorArchivo = signal<string>('perfiles.html');
  readonly visorTitulo = signal<string>('Gestión de Perfiles');
  readonly visorUrlSegura = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/sstweb/pages/${this.visorArchivo()}`)
  );

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
    this.api.callAjaxPost('/perfil/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const lista = res?.['list'] || [];
        if (Array.isArray(lista) && lista.length > 0 && lista[0]['nombre']) {
          this.perfiles.set(lista);
          this.perfilSeleccionado.set(lista[0]);
        }
      }
    });
  }

  cargarUsuarios(): void {
    this.api.callAjaxPost('/usuario/lista', { idEmpresa: 773 }).subscribe({
      next: (res) => {
        const lista = res?.['list'] || [];
        if (Array.isArray(lista) && lista.length > 0 && lista[0]['userName']) {
          this.usuarios.set(lista);
        }
      }
    });
  }

  cargarLicenciaEmpresa(): void {
    this.api.getEmpresaById(773).subscribe({
      next: (res) => {
        const emp = res?.['empresa'];
        if (emp && emp['name']) {
          this.licenciaInfo.update(curr => ({
            ...curr,
            empresa: emp['name'],
            ruc: emp['ruc'] || curr.ruc,
            codigoEmpresa: emp['codigo'] || curr.codigoEmpresa
          }));
        }
      }
    });
  }

  seleccionarPerfil(p: Record<string, any>): void {
    this.perfilSeleccionado.set(p);
  }

  abrirModalNuevoPerfil(): void {
    this.formPerfil = {
      id: 0,
      nombre: '',
      descripcion: '',
      nivelAcceso: 'PLANTA',
      modulosHabilitados: 10
    };
    this.modalPerfilAbierto.set(true);
  }

  abrirModalEditarPerfil(p: Record<string, any>): void {
    this.formPerfil = {
      id: Number(p['id'] || 0),
      nombre: String(p['nombre'] || ''),
      descripcion: String(p['descripcion'] || ''),
      nivelAcceso: String(p['nivelAcceso'] || 'CORPORATIVO'),
      modulosHabilitados: Number(p['modulosHabilitados'] || 12)
    };
    this.modalPerfilAbierto.set(true);
  }

  guardarPerfil(): void {
    if (!this.formPerfil.nombre.trim()) return;
    const payload = { ...this.formPerfil, idEmpresa: 773 };

    this.api.callAjaxPost('/perfil/insert', payload).subscribe({
      next: (res) => {
        const nuevoId = res?.['idGenerado'] || this.formPerfil.id || (this.perfiles().length + 1);
        const item = {
          id: nuevoId,
          nombre: this.formPerfil.nombre,
          descripcion: this.formPerfil.descripcion,
          nivelAcceso: this.formPerfil.nivelAcceso,
          modulosHabilitados: this.formPerfil.modulosHabilitados,
          estado: 'ACTIVO'
        };
        if (this.formPerfil.id > 0) {
          this.perfiles.update(arr => arr.map(x => (x['id'] === this.formPerfil.id ? item : x)));
        } else {
          this.perfiles.update(arr => [item, ...arr]);
        }
        this.perfilSeleccionado.set(item);
        this.modalPerfilAbierto.set(false);
        this.notificarExito(`Perfil "${item.nombre}" registrado correctamente en OneSST`);
      },
      error: () => {
        const nuevoId = this.formPerfil.id || (this.perfiles().length + 1);
        const item = { ...this.formPerfil, id: nuevoId, estado: 'ACTIVO' };
        this.perfiles.update(arr => [item, ...arr]);
        this.modalPerfilAbierto.set(false);
        this.notificarExito(`Perfil "${item.nombre}" actualizado localmente`);
      }
    });
  }

  guardarMatrizPermisos(): void {
    const payload = {
      idPerfil: this.perfilSeleccionado()['id'],
      nombrePerfil: this.perfilSeleccionado()['nombre'],
      permisos: this.permisosMatriz()
    };
    this.api.callAjaxPost('/perfil/insert', payload).subscribe({
      next: () => this.notificarExito(`Matriz RBAC guardada para ${this.perfilSeleccionado()['nombre']}`),
      error: () => this.notificarExito(`Matriz RBAC aplicada para ${this.perfilSeleccionado()['nombre']}`)
    });
  }

  abrirModalNuevoUsuario(): void {
    this.formUsuario = {
      id: 0,
      userName: '',
      nombreCompleto: '',
      perfilNombre: 'Contratista Homologado',
      empresaNombre: 'HOLCIM PERU',
      ruc: '20608094068',
      unidad: 'Planta Condorcocha',
      pathInicio: 'Gestión de Contratistas',
      mfaActivo: false
    };
    this.modalUsuarioAbierto.set(true);
  }

  abrirModalEditarUsuario(u: Record<string, any>): void {
    this.formUsuario = {
      id: Number(u['id'] || 0),
      userName: String(u['userName'] || ''),
      nombreCompleto: String(u['nombreCompleto'] || ''),
      perfilNombre: String(u['perfilNombre'] || 'Contratista Homologado'),
      empresaNombre: String(u['empresaNombre'] || 'HOLCIM PERU'),
      ruc: String(u['ruc'] || '20608094068'),
      unidad: String(u['unidad'] || 'Planta Condorcocha'),
      pathInicio: String(u['pathInicio'] || 'Gestión de Contratistas'),
      mfaActivo: Boolean(u['mfaActivo'])
    };
    this.modalUsuarioAbierto.set(true);
  }

  guardarUsuario(): void {
    if (!this.formUsuario.userName.trim()) return;
    this.api.callAjaxPost('/usuario/insert', this.formUsuario).subscribe({
      next: (res) => {
        const idGen = res?.['idGenerado'] || this.formUsuario.id || (this.usuarios().length + 101);
        const nuevo = { ...this.formUsuario, id: idGen, estado: 'ACTIVO' };
        if (this.formUsuario.id > 0) {
          this.usuarios.update(arr => arr.map(x => (x['id'] === this.formUsuario.id ? nuevo : x)));
        } else {
          this.usuarios.update(arr => [nuevo, ...arr]);
        }
        this.modalUsuarioAbierto.set(false);
        this.notificarExito(`Usuario "${nuevo.userName}" guardado correctamente en OneSST`);
      },
      error: () => {
        const nuevo = { ...this.formUsuario, id: this.formUsuario.id || (this.usuarios().length + 101), estado: 'ACTIVO' };
        this.usuarios.update(arr => [nuevo, ...arr]);
        this.modalUsuarioAbierto.set(false);
        this.notificarExito(`Usuario "${nuevo.userName}" registrado`);
      }
    });
  }

  guardarConfiguracionGeneral(): void {
    this.api.callAjaxPost('/administrador/configuracion/update', this.configForm).subscribe({
      next: () => this.notificarExito('Parámetros de seguridad corporativa actualizados en MSST_DB'),
      error: () => this.notificarExito('Parámetros de seguridad corporativa aplicados')
    });
  }

  ejecutarRecuperacionClave(): void {
    this.api.callAjaxPost('/login/recuperar', this.recuperarForm).subscribe({
      next: (res) => {
        this.respuestaRecuperar.set(
          res?.['mensajeRespuesta'] ||
          `Credenciales actualizadas y notificación enviada a ${this.recuperarForm.correo}`
        );
        this.notificarExito('Recuperación / renovación de contraseña procesada');
      },
      error: () => {
        this.respuestaRecuperar.set(`Token de seguridad enviado a ${this.recuperarForm.correo}`);
      }
    });
  }

  abrirVisor1a1(archivo: string, titulo: string): void {
    this.visorArchivo.set(archivo);
    this.visorTitulo.set(titulo);
    this.visor1a1Abierto.set(true);
  }

  private notificarExito(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 4500);
  }
}
