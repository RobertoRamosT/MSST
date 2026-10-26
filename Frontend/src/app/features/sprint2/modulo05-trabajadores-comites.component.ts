import {Component,OnInit,computed,inject,input,effect,signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {CommitteeApiService,CommitteeActa,CommitteeElection,CommitteeMember,CommitteeSessionType} from '../../core/services/committee-api.service';
import {GosstApiService,apiErrorMessage,confirmedList} from '../../core/services/gosst-api.service';
import {GosstSessionService} from '../../core/services/gosst-session.service';
import {EvidenceApiService,EvidenceReceipt,WorkflowApiService,WorkflowDefinition,WorkflowSnapshot} from '../../core/services/workflow-api.service';
import {WorkflowInteractivoComponent} from '../workflow/workflow-interactivo.component';
@Component({selector:'msst-modulo05-trabajadores',standalone:true,imports:[CommonModule,FormsModule,WorkflowInteractivoComponent],template:"<main class=\"committee\">\n<header><h2>Trabajadores, comité SST y elecciones</h2><button (click)=\"reload()\" [disabled]=\"busy()\">Actualizar</button></header>\n@if(message()){<p role=\"status\">{{message()}}</p>}\n<nav>@for(name of ['Trabajadores','Actas','Elecciones','Configuración'];track name){<button (click)=\"tab.set(name)\">{{name}}</button>}</nav>\n@if(tab()==='Trabajadores'){\n<section><h3>Trabajadores registrados</h3><table><thead><tr><th>Documento</th><th>Nombre</th><th>Puesto</th><th>Aptitud registrada</th><th>Estado</th></tr></thead><tbody>\n@for(w of workers();track w['id']){<tr><td>{{w['dni']}}</td><td>{{w['nombreCompleto']}}</td><td>{{w['puestoTrabajo']}}</td><td>{{w['aptitudMedica']}}</td><td>{{w['estado']}}</td></tr>}\n@empty{<tr><td colspan=\"5\">Sin registros confirmados.</td></tr>}</tbody></table></section>\n<section><h3>Registrar trabajador</h3><fieldset [disabled]=\"busy()\"><div class=\"grid\">\n@for(f of workerFields;track f.code){<label>{{f.label}}<input [(ngModel)]=\"workerForm[f.code]\"></label>}</div>\n<button (click)=\"saveWorker()\">Registrar</button></fieldset></section>\n}\n@if(tab()==='Actas'){\n<section><h3>Actas confirmadas</h3><table><thead><tr><th>Número y reunión</th><th>Acuerdo</th><th>Asistencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>\n@for(a of actas();track a.idActa){<tr><td>{{a.numeroActa}}<br>{{a.fechaReunion | date:'medium'}}</td><td>{{a.acuerdoTomado}}<br>{{a.responsableNombre}}</td>\n<td>{{a.quorumAsistentes}} / {{a.quorumRequerido}}</td><td>{{a.estado}}</td><td><button (click)=\"openActa(a)\">Abrir documento y proceso</button></td></tr>}\n@empty{<tr><td colspan=\"5\">No se recibieron actas.</td></tr>}</tbody></table></section>\n<section><h3>Nueva acta</h3><fieldset [disabled]=\"busy()\"><div class=\"grid\">\n<label>Número de acta<input [(ngModel)]=\"actaForm.numeroActa\"></label><label>Tipo de sesión<select [(ngModel)]=\"actaForm.tipoSesion\"><option value=\"\">Seleccione tipo configurado</option>\n@for(t of types();track t.typeCode+t.ruleVersion){<option [value]=\"t.typeCode\">{{t.label}} · Regla {{t.ruleVersion}}</option>}</select></label>\n<label>Fecha de reunión<input type=\"datetime-local\" [(ngModel)]=\"actaForm.fechaReunion\"></label>\n<label>Responsable<select [(ngModel)]=\"actaForm.responsableUsuarioId\"><option [ngValue]=\"0\">Seleccione miembro</option>@for(m of members();track m.userId){<option [ngValue]=\"m.userId\">{{m.nombre}} · {{m.roleCode}}</option>}</select></label>\n<label>Agenda<textarea [(ngModel)]=\"actaForm.agendaPrincipal\"></textarea></label><label>Acuerdo<textarea [(ngModel)]=\"actaForm.acuerdoTomado\"></textarea></label>\n<label>Asistentes<select multiple [(ngModel)]=\"actaForm.asistentesUsuarioIds\">@for(m of members();track m.userId){<option [ngValue]=\"m.userId\">{{m.nombre}}</option>}</select></label>\n</div><p>Quórum requerido por el tipo: {{selectedType()?.minimumQuorum}}. El servidor comprueba miembros y asistencia real.</p>\n<button (click)=\"createActa()\">Guardar borrador y crear expediente</button></fieldset></section>\n@if(selectedActa();as a){\n<section><h3>{{a.numeroActa}} · Documento y firma</h3><p>La aprobación exige el proceso cerrado y firmas verificadas del documento canónico del acta.</p>\n<div class=\"actions\"><button (click)=\"download(a)\" [disabled]=\"busy()\">Descargar documento JSON para firma externa</button>\n<button (click)=\"prepareCanonical(a)\" [disabled]=\"busy()\">Preparar documento persistido para firmas</button></div>\n@if(canonicalEvidence()){<p>Documento guardado: {{canonicalEvidence()!.fileName}}</p><label>Firma del documento (.p7s)<input type=\"file\" accept=\".p7s\" [disabled]=\"busy()\" (change)=\"selectSignature($event)\"></label>\n<button (click)=\"verifySignature()\" [disabled]=\"busy()||!signatureFile\">Verificar y registrar firma</button>}\n<p>Firmas verificadas del documento: {{verifiedSignatures().length}}</p>\n<button (click)=\"approve(a)\" [disabled]=\"busy()||requiredSignatures(a)===null||verifiedSignatures().length<(requiredSignatures(a)??0)\">Solicitar aprobación del acta</button>\n@if(a.workflowExpedienteId){<msst-workflow-interactivo [expedienteId]=\"a.workflowExpedienteId!\"></msst-workflow-interactivo>}\n</section>}\n}\n@if(tab()==='Elecciones'){\n<section><h3>Procesos electorales</h3>@for(e of elections();track e.idProceso){<article><h4>{{e.titulo}}</h4>\n<p>{{e.fechaInicio|date:'medium'}} – {{e.fechaFin|date:'medium'}} · {{e.estado}} · Votos registrados: {{e.totalVotos}}</p>\n@if(e.yaVotoUsuarioActual){<p>Su voto ya está registrado.</p>}@else{<div class=\"actions\">@for(c of e.candidatos;track c.idCandidato){<button [disabled]=\"busy()\" (click)=\"vote(e,c.idCandidato)\">Votar por {{c.nombre}}</button>}</div>}</article>}\n@empty{<p>No hay procesos electorales confirmados.</p>}</section>\n<section><h3>Crear convocatoria</h3><fieldset [disabled]=\"busy()\"><div class=\"grid\"><label>Título<input [(ngModel)]=\"electionForm.titulo\"></label>\n<label>Inicio<input type=\"datetime-local\" [(ngModel)]=\"electionForm.fechaInicio\"></label><label>Fin<input type=\"datetime-local\" [(ngModel)]=\"electionForm.fechaFin\"></label>\n<label>Candidatos<select multiple [(ngModel)]=\"electionForm.candidateUserIds\">@for(u of users();track u['id']){<option [ngValue]=\"u['id']\">{{u['nombreCompleto']}} · {{u['userName']}}</option>}</select></label>\n<label>Padrón<select multiple [(ngModel)]=\"electionForm.voterUserIds\">@for(u of users();track u['id']){<option [ngValue]=\"u['id']\">{{u['nombreCompleto']}} · {{u['userName']}}</option>}</select></label>\n</div><button (click)=\"createElection()\">Registrar convocatoria</button></fieldset></section>\n}\n@if(tab()==='Configuración'){\n<section><h3>Miembros del comité</h3><p>La configuración requiere un usuario con autorización administrativa.</p>\n<table><tbody>@for(m of members();track m.userId){<tr><td>{{m.nombre}}</td><td>{{m.roleCode}}</td></tr>}</tbody></table>\n<fieldset [disabled]=\"busy()\"><div class=\"grid\">\n<label>Usuario<select [(ngModel)]=\"memberForm.userId\"><option [ngValue]=\"0\">Seleccione</option>@for(u of users();track u['id']){<option [ngValue]=\"u['id']\">{{u['nombreCompleto']}} · {{u['userName']}}</option>}</select></label>\n<label>Rol en el comité<input [(ngModel)]=\"memberForm.roleCode\"></label><label>Vigente desde<input type=\"datetime-local\" [(ngModel)]=\"memberForm.validFromUtc\"></label>\n<label>Vigente hasta (opcional)<input type=\"datetime-local\" [(ngModel)]=\"memberForm.validUntilUtc\"></label><label><input type=\"checkbox\" [(ngModel)]=\"memberForm.enabled\">Miembro vigente</label>\n<label>Motivo<textarea [(ngModel)]=\"memberForm.reason\"></textarea></label></div><button (click)=\"saveMember()\">Guardar miembro</button></fieldset></section>\n<section><h3>Tipos de sesión y requisitos</h3><fieldset [disabled]=\"busy()\"><div class=\"grid\">\n<label>Código<input [(ngModel)]=\"typeForm.typeCode\"></label><label>Nombre<input [(ngModel)]=\"typeForm.label\"></label><label>Quórum mínimo<input type=\"number\" [(ngModel)]=\"typeForm.minimumQuorum\"></label>\n<label>Firmas requeridas<input type=\"number\" [(ngModel)]=\"typeForm.requiredSignatures\"></label>\n<label>Proceso publicado<select [(ngModel)]=\"typeDefinitionId\"><option [ngValue]=\"0\">Seleccione</option>@for(d of definitions();track d.definitionId){<option [ngValue]=\"d.definitionId\">{{d.nombre}} · {{d.subtipo}} · v{{d.definitionVersion}}</option>}</select></label>\n<label>Código de requisito de firma<input [(ngModel)]=\"typeForm.signatureFieldCode\"></label>\n</div><button (click)=\"saveType()\">Guardar regla de sesión</button></fieldset></section>\n}\n</main>",
styles:['.committee{padding:18px;color:#18334a}header,.actions,nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap}section{background:white;border:1px solid #d7e3ec;border-radius:8px;padding:18px;margin:15px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}label{display:grid;gap:5px}input,select,textarea,button{padding:8px;border:1px solid #a9bdcc;border-radius:4px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #dce6ee}fieldset{border:0}article{border-bottom:1px solid #dce6ee;padding:12px}']})
export class Modulo05TrabajadoresComitesComponent implements OnInit{
 private readonly api=inject(CommitteeApiService);private readonly legacy=inject(GosstApiService);readonly session=inject(GosstSessionService);
 private readonly workflow=inject(WorkflowApiService);private readonly evidence=inject(EvidenceApiService);
 readonly tab=signal('Trabajadores');readonly message=signal('');readonly busy=signal(false);
 readonly workers=signal<Record<string,any>[]>([]);readonly users=signal<Record<string,any>[]>([]);
 readonly actas=signal<CommitteeActa[]>([]);readonly elections=signal<CommitteeElection[]>([]);readonly members=signal<CommitteeMember[]>([]);
 readonly types=signal<CommitteeSessionType[]>([]);readonly definitions=signal<WorkflowDefinition[]>([]);readonly selectedActa=signal<CommitteeActa|null>(null);
 readonly canonicalEvidence=signal<EvidenceReceipt|null>(null);readonly verifiedSignatures=signal<string[]>([]);
 private signingSnapshot:WorkflowSnapshot|null=null;signatureFile:File|null=null;
 readonly tabRequested=input<string|null>(null,{alias:'tab'});
 private readonly sync=effect(()=>{const value=this.tabRequested();if(value)this.tab.set(value==='COMITE'?'Actas':value==='ELECCIONES'?'Elecciones':'Trabajadores');});
 readonly workerFields=[{code:'dni',label:'Documento'},{code:'nombreCompleto',label:'Nombre completo'},{code:'unidad',label:'Unidad'},{code:'area',label:'Área'},{code:'puestoTrabajo',label:'Puesto'},{code:'grupoSeguridad',label:'Grupo de seguridad'},{code:'tallaCasco',label:'Talla de casco'},{code:'tallaCalzado',label:'Talla de calzado'},{code:'tallaUniforme',label:'Talla de uniforme'}];
 workerForm:Record<string,string>={};
 actaForm={numeroActa:'',tipoSesion:'',fechaReunion:'',agendaPrincipal:'',acuerdoTomado:'',responsableUsuarioId:0,asistentesUsuarioIds:[] as number[]};
 electionForm={titulo:'',fechaInicio:'',fechaFin:'',candidateUserIds:[] as number[],voterUserIds:[] as number[]};
 memberForm={userId:0,roleCode:'',validFromUtc:'',validUntilUtc:'',enabled:false,reason:''};
 typeForm={typeCode:'',label:'',minimumQuorum:0,requiredSignatures:0,signatureFieldCode:''};typeDefinitionId=0;
 selectedType():CommitteeSessionType|null{return this.types().find(t=>t.typeCode===this.actaForm.tipoSesion)??null;}
 ngOnInit():void{this.reload();}
 reload():void{
  this.api.actas().subscribe({next:r=>{this.actas.set(r.actas);const current=this.selectedActa();if(current){const persisted=r.actas.find(a=>a.idActa===current.idActa);if(persisted){this.selectedActa.set(persisted);this.verifiedSignatures.set(persisted.signatureIds);}}},error:e=>this.fail(e)});
  this.api.elections().subscribe({next:r=>this.elections.set(r.procesos),error:e=>this.fail(e)});
  this.api.members().subscribe({next:r=>this.members.set(r.members),error:e=>this.fail(e)});
  this.api.types().subscribe({next:r=>this.types.set(r.sessionTypes),error:e=>this.fail(e)});
  this.legacy.callAjaxPost('/trabajador/lista',{}).subscribe({next:r=>{try{this.workers.set(confirmedList(r));}catch(e){this.fail(e);}},error:e=>this.fail(e)});
  this.legacy.callAjaxPost('/usuario/lista',{}).subscribe({next:r=>{try{this.users.set(confirmedList(r));}catch(e){this.fail(e);}},error:e=>this.fail(e)});
  this.workflow.catalog().subscribe({next:r=>this.definitions.set(r.cases.flatMap(c=>c.definitions).filter(d=>d.status==='PUBLISHED'&&d.subjectType==='ACTA_COMITE')),error:e=>this.fail(e)});
 }
 private fail(e:unknown):void{this.busy.set(false);this.message.set(apiErrorMessage(e));}
 private iso(value:string):string{const date=new Date(value);if(!value||!Number.isFinite(date.getTime()))throw new Error('Ingrese una fecha válida.');return date.toISOString();}
 private async command(task:()=>Promise<string>):Promise<void>{if(this.busy())return;this.busy.set(true);try{this.message.set(await task());}catch(e){this.fail(e);}finally{this.busy.set(false);}}
 async saveWorker():Promise<void>{await this.command(async()=>{
  if(!this.workerForm['dni']?.trim()||!this.workerForm['nombreCompleto']?.trim())throw new Error('Complete documento y nombre.');
  await firstValueFrom(this.legacy.callAjaxPost('/trabajador/insert',{...this.workerForm}));this.reload();return'Trabajador confirmado por el servidor.';
 });}
 async createActa():Promise<void>{await this.command(async()=>{
  const type=this.types().find(t=>t.typeCode===this.actaForm.tipoSesion);if(!type)throw new Error('Seleccione un tipo de sesión configurado.');
  const response=await firstValueFrom(this.api.createActa({...structuredClone(this.actaForm),fechaReunion:this.iso(this.actaForm.fechaReunion),
   quorumAsistentes:this.actaForm.asistentesUsuarioIds.length,quorumRequerido:type.minimumQuorum}));
  if(response.acta)this.openActa(response.acta);this.reload();return response.message;
 });}
 openActa(acta:CommitteeActa):void{this.selectedActa.set(acta);this.canonicalEvidence.set(null);this.verifiedSignatures.set([...acta.signatureIds]);this.signatureFile=null;this.signingSnapshot=null;}
 async download(acta:CommitteeActa):Promise<void>{await this.command(async()=>{const blob=await firstValueFrom(this.api.document(acta.idActa));this.downloadBlob(blob,acta.numeroActa);return'Documento canónico recuperado del servidor.';});}
 private downloadBlob(blob:Blob,name:string):void{const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name.replace(/[^A-Za-z0-9_-]/g,'_')+'.json';link.click();URL.revokeObjectURL(url);}
 async prepareCanonical(acta:CommitteeActa):Promise<void>{await this.command(async()=>{
  const type=this.types().find(t=>t.typeCode===acta.tipoSesion&&t.ruleVersion===acta.ruleVersion);
  if(!type||!acta.workflowExpedienteId)throw new Error('No se confirmó la regla y el expediente asociado al acta.');
  const blob=await firstValueFrom(this.api.document(acta.idActa)),detail=await firstValueFrom(this.workflow.detail(acta.workflowExpedienteId));
  if(!detail.snapshot||detail.snapshot.subject.subjectType!=='ACTA_COMITE'||detail.snapshot.subject.subjectId!==acta.idActa)throw new Error('El expediente no corresponde al acta.');
  const file=new File([blob],acta.numeroActa.replace(/[^A-Za-z0-9_-]/g,'_')+'.json',{type:'application/json'});
  const receipt=await firstValueFrom(this.evidence.upload(file,detail.snapshot,type.signatureFieldCode));
  this.signingSnapshot=detail.snapshot;this.canonicalEvidence.set(receipt);return'Documento canónico persistido. Adjunte una firma externa del mismo archivo.';
 });}
 selectSignature(event:Event):void{this.signatureFile=(event.target as HTMLInputElement).files?.[0]??null;}
 async verifySignature():Promise<void>{await this.command(async()=>{
  const receipt=this.canonicalEvidence(),snapshot=this.signingSnapshot;if(!receipt||!snapshot||!this.signatureFile)throw new Error('Prepare el documento y seleccione su firma.');
  const id=await firstValueFrom(this.evidence.sign(this.signatureFile,receipt.evidenceId,snapshot.version));
  this.verifiedSignatures.update(ids=>[...new Set([...ids,id])]);this.reload();return'Firma del documento verificada por el servidor.';
 });}
 requiredSignatures(acta:CommitteeActa):number|null{return this.types().find(t=>t.typeCode===acta.tipoSesion&&t.ruleVersion===acta.ruleVersion)?.requiredSignatures??null;}
 async approve(acta:CommitteeActa):Promise<void>{await this.command(async()=>{
  const required=this.requiredSignatures(acta);if(required===null||this.verifiedSignatures().length<required)throw new Error('Complete las firmas verificadas requeridas por la regla de sesión.');
  const response=await firstValueFrom(this.api.approve(acta,this.verifiedSignatures()));if(response.acta)this.selectedActa.set(response.acta);this.reload();return response.message;
 });}
 async vote(process:CommitteeElection,candidateId:number):Promise<void>{await this.command(async()=>{
  const response=await firstValueFrom(this.api.vote(process,candidateId));this.reload();return response.message;
 });}
 async createElection():Promise<void>{await this.command(async()=>{
  const response=await firstValueFrom(this.api.createElection({...structuredClone(this.electionForm),fechaInicio:this.iso(this.electionForm.fechaInicio),fechaFin:this.iso(this.electionForm.fechaFin)}));
  this.reload();return response.message;
 });}
 async saveMember():Promise<void>{await this.command(async()=>{
  const response=await firstValueFrom(this.api.saveMember({...this.memberForm,validFromUtc:this.iso(this.memberForm.validFromUtc),validUntilUtc:this.memberForm.validUntilUtc?this.iso(this.memberForm.validUntilUtc):null}));
  this.reload();return response.message;
 });}
 async saveType():Promise<void>{await this.command(async()=>{
  const definition=this.definitions().find(d=>d.definitionId===this.typeDefinitionId);if(!definition)throw new Error('Seleccione una definición publicada para actas.');
  const response=await firstValueFrom(this.api.saveType({...this.typeForm,workflowCaseCode:definition.codigoCaso,workflowSubtipo:definition.subtipo,workflowDefinitionVersion:definition.definitionVersion}));
  this.reload();return response.message;
 });}
}
