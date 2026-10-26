import {ClinicalWorkflowService,ClinicalRecord,ClinicalOption} from '../../core/services/clinical-workflow.service';
import { Component, EventEmitter, Input, Output, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { GosstApiService, confirmedList } from '../../core/services/gosst-api.service';
import { GosstSessionService } from '../../core/services/gosst-session.service';
import { EvidenceApiService, EvidenceReceipt, WorkflowApiService, WorkflowCase, WorkflowDefinition, WorkflowRequirement,
  WorkflowSnapshot, WorkflowSubject, WorkflowTransition, WorkflowViolation, workflowFailure } from '../../core/services/workflow-api.service';

@Component({
  selector:'msst-workflow-interactivo',standalone:true,imports:[CommonModule,FormsModule],
  styles:[`
    :host{display:block;background:#f8fafc;min-height:100vh;color:#162c43}.console{max-width:1400px;margin:auto;padding:22px}
    header,.tools,.stepper,.actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}header{justify-content:space-between}
    .card{background:white;border:1px solid #dbe4ed;border-radius:10px;padding:18px;margin:16px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    label{display:grid;gap:5px;font-weight:600}input,select,textarea{padding:8px;border:1px solid #b7c7d6;border-radius:5px;width:100%;color:#162c43}
    button{padding:8px 13px;border:1px solid #9aafc1;background:white;border-radius:5px;cursor:pointer}button.primary{background:#075c90;color:white}button:disabled{opacity:.55}
    .current{border-color:#075c90;background:#e9f6ff}.muted{color:#63788a}.error{color:#982424;background:#fff0ee;padding:12px}.ok{color:#106343}
    table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:10px;border-bottom:1px solid #dde5ed}
    .backdrop{position:fixed;inset:0;background:#10233399;z-index:2000;overflow:auto;padding:5vh 15px}.dialog{background:white;max-width:850px;margin:auto;padding:24px;border-radius:12px}
    .requirement{border-top:1px solid #dde5ed;padding:14px 0}.history{padding:8px;border-bottom:1px solid #dde5ed}
    @media print{.no-print,.backdrop{display:none!important}.console{padding:0}.card{break-inside:avoid}}
  `],
  template:`
    <main class="console">
      <header><div><h1>Procesos y expedientes SST</h1><p>Estado, requisitos y trazabilidad confirmados por el servidor.</p></div>
        <div class="tools no-print"><button (click)="portal()">Volver al portal</button><button (click)="reload()" [disabled]="busy()">Actualizar</button>
        <button class="primary" (click)="openCreate()" [disabled]="busy()">Nuevo expediente</button><button (click)="openDefinition()" [disabled]="busy()">Configurar proceso</button></div>
      </header>
      @if(message()){<p role="status" [class.error]="failed()" [class.ok]="!failed()">{{message()}}</p>}
      @for(v of violations();track $index){<p class="error">{{v.requirementCode}}: {{v.message}}</p>}
      <section class="card no-print grid">
        <label>Caso <select [disabled]="busy()" [ngModel]="caseCode()" (ngModelChange)="selectCase($event)"><option value="">Seleccione un caso</option>
          @for(c of cases();track c.codigoCaso){<option [value]="c.codigoCaso">{{c.nombre}}</option>}</select></label>
        <label>Subtipo y versión <select [disabled]="busy()" [ngModel]="definitionId()" (ngModelChange)="selectDefinition(+$event)"><option [ngValue]="0">Seleccione una definición</option>
          @for(d of definitions();track d.definitionId){<option [ngValue]="d.definitionId">{{d.nombre}} · {{d.subtipo}} · v{{d.definitionVersion}} · {{d.status}}</option>}</select></label>
        <label>Buscar expediente <input [(ngModel)]="search" placeholder="Código, título o sujeto"></label>
      </section>
      @if(definition();as d){@for(w of d.validationMessages;track $index){<p class="error">{{w}}</p>}}
      <section class="card"><h2>Expedientes</h2>
        <table><thead><tr><th>Código</th><th>Título y sujeto</th><th>Estado</th><th>Etapa</th><th>Cumplimiento</th><th class="no-print">Detalle</th></tr></thead>
          <tbody>@for(e of filtered();track e.expedienteId){<tr [class.current]="current()?.expedienteId===e.expedienteId">
            <td>{{e.codigoExpediente}}</td><td>{{e.titulo}}<br><span class="muted">{{e.subject.label}}</span></td><td>{{e.estadoGeneral}}</td>
            <td>{{e.etapaActual}} / {{e.totalEtapas}}</td><td>{{e.cumplimientoPorc}}%</td><td class="no-print"><button (click)="load(e.expedienteId)" [disabled]="busy()">Abrir</button></td>
          </tr>}@empty{<tr><td colspan="6">No hay expedientes confirmados para la selección.</td></tr>}</tbody>
        </table>
      </section>
      @if(current();as s){
        <section class="card">
          <header><div><h2>{{s.codigoExpediente}} · {{s.titulo}}</h2><p>{{s.subject.label}} · {{s.codigoCaso}} / {{s.subtipo}} · Definición v{{s.definitionVersion}}</p>
          <p>Estado: <strong>{{s.estadoGeneral}}</strong> · Cumplimiento: {{s.cumplimientoPorc}}% · Último movimiento: {{s.fechaUltimoMovimiento | date:'medium'}}</p></div>
          <div class="tools no-print"><button (click)="exportCurrent()">Descargar expediente</button><button (click)="print()">Imprimir</button></div></header>
          <div class="stepper no-print">@for(stage of currentDefinition()?.stages??[];track stage.stageCode){
            <button [class.current]="stage.stageCode===s.stageCode" (click)="viewStage.set(stage.stageCode)">
              {{stage.order}}. {{stage.title}} @if(stage.stageCode===s.stageCode){<span>· Actual</span>}
            </button>
          }</div>
          @if(currentStage();as stage){<p>{{stage.title}} · Rol de revisión: {{stage.roleCode}}
            @if(stage.deadlineHours!==null&&stage.deadlineHours!==undefined){<span> · Plazo configurado: {{stage.deadlineHours}} h</span>}</p>}
          <div class="actions no-print">@for(a of s.actions;track a.actionCode){<button class="primary" [disabled]="busy()" (click)="openAction(a)">{{a.label}}</button>}
            @empty{<p class="muted">El servidor no habilitó acciones en el estado y ámbito actuales.</p>}</div>
          @for(r of visibleRequirements();track r.requirementCode){
            <article class="requirement"><h3>{{r.title}} @if(r.mandatory){<small>· Obligatorio</small>}</h3>
              <p>{{r.status}} · {{r.message}}</p><p class="muted">Verificación: {{r.verificationKind}} · {{r.verifierRoles.join(', ')}}</p>
              @for(id of r.evidenceIds;track id){<a [href]="evidence.contentUrl(id)" target="_blank" rel="noopener">Abrir evidencia registrada</a><br>}
              <div class="grid no-print">
                <label>Adjuntar evidencia <input type="file" [disabled]="busy()" (change)="chooseFile(r,$event)"></label>
                <div>@if(files[r.requirementCode]){<button [disabled]="busy()" (click)="upload(r)">Guardar archivo</button>}</div>
                @if(receipts()[r.requirementCode];as receipt){<p class="ok">Archivo persistido: {{receipt.fileName}}. Pendiente de revisión del requisito.</p>}
                <button [disabled]="busy()" (click)="openProof(r)">Registrar revisión</button>
              </div>
            </article>
          }@empty{<p>No se recibieron requisitos para la etapa consultada. La disponibilidad de acciones la decide el servidor.</p>}
          <h3>Trazabilidad persistida</h3>@for(e of s.history;track e.eventId){<div class="history">
            <strong>{{e.actionCode}}</strong> · {{e.actorDisplayName}} · {{e.occurredAtUtc | date:'medium'}}<br>
            {{e.fromStageCode}} / {{e.fromStateCode}} → {{e.toStageCode}} / {{e.toStateCode}}<p>{{e.comment}}</p>
          </div>}@empty{<p>No se recibieron movimientos registrados.</p>}
          @if(qrPath()){<figure><svg [attr.viewBox]="'0 0 '+qrSize()+' '+qrSize()" width="140" height="140"><rect width="100%" height="100%" fill="white"/><path [attr.d]="qrPath()" fill="#112b42"/></svg><figcaption>Consulta autenticada de este expediente.</figcaption></figure>}
        </section>
      }
      @if(createOpen()){
        <div class="backdrop"><section class="dialog" role="dialog" aria-modal="true"><h2>Nuevo expediente</h2>
          <p>{{definition()?.nombre}} · {{definition()?.subtipo}}</p>
          <label>Título <input [(ngModel)]="newTitle" [disabled]="busy()"></label>
          <div class="grid"><label>Buscar sujeto existente <input [(ngModel)]="subjectSearch" [disabled]="busy()"></label>
            <button (click)="searchSubjects()" [disabled]="busy()">Buscar</button></div>
          <label>Sujeto <select [(ngModel)]="subjectId" [disabled]="busy()"><option [ngValue]="0">Seleccione</option>
            @for(s of subjects();track s.subjectId){<option [ngValue]="s.subjectId">{{s.label}}</option>}</select></label>
          <p role="alert">{{dialogError()}}</p>
          <div class="tools"><button class="primary" (click)="create()" [disabled]="busy()">Registrar</button><button (click)="createOpen.set(false)" [disabled]="busy()">Cerrar</button></div>
        </section></div>
      }
      @if(actionOpen()&&action();as a){
        <div class="backdrop"><section class="dialog" role="dialog" aria-modal="true"><h2>{{a.label}}</h2>
          <p>Se solicitará la acción sobre la versión consultada. El servidor verifica los requisitos y permisos.</p>
          @for(r of current()?.requirements??[];track r.requirementCode){
            <label>{{r.title}} <input [(ngModel)]="values[r.requirementCode]" [disabled]="busy()"></label>
          }
          <label>Comentario <textarea [(ngModel)]="comment" [disabled]="busy()" [required]="a.requiresComment"></textarea></label>
          <p role="alert">{{dialogError()}}</p><div class="tools"><button class="primary" (click)="execute()" [disabled]="busy()">Confirmar acción</button>
          <button (click)="actionOpen.set(false)" [disabled]="busy()">Cerrar</button></div>
        </section></div>
      }
      @if(proofOpen()&&proofRequirement();as r){
        <div class="backdrop"><section class="dialog" role="dialog" aria-modal="true"><h2>Revisar {{r.title}}</h2>
          <label>Decisión <select [(ngModel)]="proofDecision" [disabled]="busy()"><option value="">Seleccione</option><option value="APPROVED">Aprobado</option>
            <option value="OBSERVED">Observado</option><option value="REJECTED">Rechazado</option></select></label>
          <label>Vigente hasta @if(r.requiresValidityEnd){<strong>· Obligatorio</strong>}<input type="datetime-local" [(ngModel)]="validUntil" [required]="r.requiresValidityEnd" [disabled]="busy()"></label>
          @if(r.requiresClinicalReview){
           <p>La aprobación debe vincular una evaluación médica vigente de este trabajador. Su vigencia no puede superar la del registro clínico.</p>
           <label>Evaluación clínica confirmada <select [(ngModel)]="clinicalRecordId" [disabled]="busy()||clinicalLoading"><option [ngValue]="0">Seleccione evaluación</option>
            @for(m of clinicalRecords();track m.clinicalRecordId){<option [ngValue]="m.clinicalRecordId">{{m.outcomeLabel}} · {{m.clinic}} · {{m.examinedOn}} – {{m.expiresOn}}</option>}
           </select></label><button (click)="loadClinicalRecords(true)" [disabled]="busy()||clinicalLoading">Consultar más evaluaciones</button>
          }
          <label>Comentario <textarea [(ngModel)]="proofComment" [disabled]="busy()"></textarea></label>
          <label>Evidencia para firma <select [(ngModel)]="signatureEvidenceId" [disabled]="busy()"><option value="">Seleccione documento</option>
            @for(id of requirementEvidenceIds(r);track id){<option [value]="id">{{id}}</option>}</select></label>
          <label>Firma del documento (.p7s) <input type="file" accept=".p7s" [disabled]="busy()" (change)="chooseSignature($event)"></label>
          <button [disabled]="busy()||!signatureFile||!signatureEvidenceId" (click)="verifySignature()">Verificar firma</button>
          @if(signatureId){<p class="ok">Firma verificada por el servidor: {{signatureId}}</p>}
          <p role="alert">{{dialogError()}}</p><div class="tools"><button class="primary" (click)="recordProof()" [disabled]="busy()">Guardar revisión</button>
            <button (click)="proofOpen.set(false)" [disabled]="busy()">Cerrar</button></div>
        </section></div>
      }
      @if(definitionOpen()){
        <div class="backdrop"><section class="dialog" role="dialog" aria-modal="true"><h2>Configurar proceso</h2><p>La configuración se guarda como borrador. Publicar exige que el servidor valide el proceso completo.</p>
          <div class="grid"><label>Código de caso <input [(ngModel)]="draft.codigoCaso"></label><label>Subtipo <input [(ngModel)]="draft.subtipo"></label>
            <label>Nombre <input [(ngModel)]="draft.nombre"></label><label>Tipo de sujeto <input [(ngModel)]="draft.subjectType"></label></div>
          <details><summary>Asignar un rol de proceso a un usuario</summary>
<div class="grid"><label>Usuario<select [(ngModel)]="roleGrantUserId"><option [ngValue]="0">Seleccione usuario</option>@for(u of roleUsers();track u['id']){<option [ngValue]="u['id']">{{u['nombreCompleto']}} · {{u['userName']}}</option>}</select></label>
<label>Rol definido<select [(ngModel)]="roleGrantRole"><option value="">Seleccione rol</option>@for(role of roleCodes();track role){<option [value]="role">{{role}}</option>}</select></label>
<label><input type="checkbox" [(ngModel)]="roleGrantEnabled">Concesión vigente</label><label>Vigente hasta (opcional)<input type="datetime-local" [(ngModel)]="roleGrantUntil"></label>
<label>Motivo<textarea [(ngModel)]="roleGrantReason"></textarea></label></div><button [disabled]="busy()" (click)="saveRoleGrant()">Guardar asignación de rol</button>
</details><h3>Etapas</h3>@for(stage of draft.stages;track $index;let si=$index){
            <section class="card"><div class="grid"><label>Código <input [(ngModel)]="stage.stageCode"></label><label>Nombre <input [(ngModel)]="stage.title"></label>
              <label>Orden <input type="number" [(ngModel)]="stage.order"></label><label>Rol <input [(ngModel)]="stage.roleCode"></label>
              <label>Plazo en horas (opcional) <input type="number" [(ngModel)]="stage.deadlineHours"></label>
              <label><input type="checkbox" [(ngModel)]="stage.allowNoRequirements">Permitir etapa sin requisitos</label></div>
              @for(r of stage.requirements;track $index){<div class="grid requirement">
                <label>Código requisito <input [(ngModel)]="r.requirementCode"></label><label>Nombre <input [(ngModel)]="r.title"></label>
                <label>Tipo de verificación <input [(ngModel)]="r.verificationKind"></label><label>Roles (separados por coma) <input [(ngModel)]="r.rolesText"></label>
                <label><input type="checkbox" [(ngModel)]="r.requiresValidityEnd">Exige fecha de vencimiento</label><label>Vigencia máxima en horas (opcional)<input type="number" [(ngModel)]="r.maxValidityHours"></label><label><input type="checkbox" [(ngModel)]="r.mandatory">Obligatorio</label><label><input type="checkbox" [(ngModel)]="r.evidenceRequired">Requiere archivo</label>
              </div>}<button (click)="addRequirement(si)">Añadir requisito</button><button (click)="draft.stages.splice(si,1)">Quitar etapa</button>
            </section>
          }<button (click)="addStage()">Añadir etapa</button>
          <div class="grid"><label>Etapa inicial <select [(ngModel)]="draft.initialStageCode"><option value="">Seleccione</option>@for(s of draft.stages;track $index){<option [value]="s.stageCode">{{s.title}}</option>}</select></label>
            <label>Estado inicial <input [(ngModel)]="draft.initialStateCode"></label></div>
          <h3>Acciones</h3>@for(t of draft.transitions;track $index;let ti=$index){<section class="card grid">
            <label>Código acción <input [(ngModel)]="t.actionCode"></label><label>Nombre <input [(ngModel)]="t.label"></label>
            <label>Etapa de origen <select [(ngModel)]="t.fromStageCode">@for(s of draft.stages;track $index){<option [value]="s.stageCode">{{s.title}}</option>}</select></label>
            <label>Estado de origen <input [(ngModel)]="t.fromStateCode"></label>
            <label>Etapa de destino <select [(ngModel)]="t.toStageCode">@for(s of draft.stages;track $index){<option [value]="s.stageCode">{{s.title}}</option>}</select></label>
            <label>Estado de destino <input [(ngModel)]="t.toStateCode"></label><label>Roles (separados por coma) <input [(ngModel)]="t.rolesText"></label>
            <label><input type="checkbox" [(ngModel)]="t.requiresVerifiedRequirements">Exige requisitos verificados</label>
            <label><input type="checkbox" [(ngModel)]="t.requiresComment">Exige comentario</label><label><input type="checkbox" [(ngModel)]="t.isFinal">Acción final</label>
            <label>Efecto operativo (opcional) <input [(ngModel)]="t.effectCode"></label><label>Valor del efecto (opcional) @if(t.effectCode==='WORKER_APTITUDE'){
<select [(ngModel)]="t.effectValue"><option value="">Seleccione dictamen vigente</option>@for(o of clinicalOptions();track o.code){<option [value]="o.code">{{o.label}}</option>}</select>
}@else{<input [(ngModel)]="t.effectValue">}</label>
            <button (click)="draft.transitions.splice(ti,1)">Quitar acción</button>
          </section>}<button (click)="addTransition()">Añadir acción</button>
          <p role="alert">{{dialogError()}}</p>
          <div class="tools"><button class="primary" [disabled]="busy()" (click)="saveDefinition()">Guardar borrador</button>
            @if(savedDefinition();as d){<button [disabled]="busy()" (click)="publish(d)">Publicar versión {{d.definitionVersion}}</button>}
            <button [disabled]="busy()" (click)="definitionOpen.set(false)">Cerrar</button></div>
        </section></div>
      }
    </main>
  `
})
export class WorkflowInteractivoComponent implements OnInit{
  private readonly api=inject(WorkflowApiService);private readonly legacy=inject(GosstApiService);readonly evidence=inject(EvidenceApiService);
  readonly session=inject(GosstSessionService);private readonly router=inject(Router);private readonly route=inject(ActivatedRoute);
  readonly cases=signal<WorkflowCase[]>([]);readonly rows=signal<WorkflowSnapshot[]>([]);readonly current=signal<WorkflowSnapshot|null>(null);
  readonly caseCode=signal('');readonly definitionId=signal(0);readonly viewStage=signal('');
  readonly message=signal('');readonly dialogError=signal('');readonly failed=signal(false);readonly busy=signal(false);readonly violations=signal<WorkflowViolation[]>([]);
  readonly createOpen=signal(false);readonly actionOpen=signal(false);readonly proofOpen=signal(false);readonly definitionOpen=signal(false);
  readonly action=signal<WorkflowTransition|null>(null);readonly proofRequirement=signal<WorkflowRequirement|null>(null);
  readonly subjects=signal<WorkflowSubject[]>([]);readonly receipts=signal<Record<string,EvidenceReceipt>>({});readonly savedDefinition=signal<WorkflowDefinition|null>(null);
  readonly roleUsers=signal<Record<string,unknown>[]>([]);
  roleGrantUserId=0;roleGrantRole='';roleGrantEnabled=false;roleGrantUntil='';roleGrantReason='';
  readonly roleCodes=computed(()=>[...new Set(this.cases().flatMap(c=>c.definitions).flatMap(d=>[...d.stages.map(s=>s.roleCode),...d.transitions.flatMap(t=>t.requiredRoles)]))].sort());
  readonly qrPath=signal('');readonly qrSize=signal(1);
  readonly definitions=computed(()=>this.cases().find(c=>c.codigoCaso===this.caseCode())?.definitions??[]);
  readonly definition=computed(()=>this.definitions().find(d=>d.definitionId===this.definitionId())??null);
  readonly currentDefinition=computed(()=>{const s=this.current();return s?this.cases().flatMap(c=>c.definitions).find(d=>d.codigoCaso===s.codigoCaso&&d.subtipo===s.subtipo&&d.definitionVersion===s.definitionVersion)??null:null;});
  readonly currentStage=computed(()=>this.currentDefinition()?.stages.find(s=>s.stageCode===this.viewStage())??null);
  readonly visibleRequirements=computed(()=>this.current()?.requirements.filter(r=>r.stageCode===this.viewStage())??[]);
  search='';newTitle='';subjectSearch='';subjectId=0;comment='';values:Record<string,string>={};files:Record<string,File>={};
  readonly clinical=inject(ClinicalWorkflowService);readonly clinicalRecords=signal<ClinicalRecord[]>([]);readonly clinicalOptions=signal<ClinicalOption[]>([]);clinicalRecordId=0;clinicalLoading=false;clinicalAfter=0;
  proofDecision='';proofComment='';validUntil='';signatureId='';signatureEvidenceId='';signatureFile:File|null=null;
  draft:{codigoCaso:string;subtipo:string;nombre:string;subjectType:string;initialStageCode:string;initialStateCode:string;stages:any[];transitions:any[]}={codigoCaso:'',subtipo:'',nombre:'',subjectType:'',initialStageCode:'',initialStateCode:'',stages:[],transitions:[]};
  @Output() readonly loaded=new EventEmitter<WorkflowSnapshot>();
  @Input() set expedienteId(id:number){if(Number.isSafeInteger(id)&&id>0)this.load(id);}
  ngOnInit():void{this.reload();const id=Number(this.route.snapshot.queryParamMap.get('expedienteId'));if(Number.isSafeInteger(id)&&id>0)this.load(id);}
  portal():void{void this.router.navigate(['/contratista']);}
  reload():void{this.api.catalog().subscribe({next:r=>{this.cases.set(r.cases);if(!this.caseCode()&&r.cases[0]){this.caseCode.set(this.current()?.codigoCaso??r.cases[0].codigoCaso);this.loadList();}},error:e=>this.fail(e)});this.loadList();}
  selectCase(code:string):void{if(this.busy())return;this.cancelDetail();this.caseCode.set(code);this.definitionId.set(0);this.current.set(null);this.loadList();}
  selectDefinition(id:number):void{if(this.busy())return;this.cancelDetail();this.definitionId.set(id);this.current.set(null);this.loadList();}
  private listRequest:{unsubscribe():void}|null=null;
  private listSequence=0;
  loadList():void{const sequence=++this.listSequence;this.listRequest?.unsubscribe();this.listRequest=this.api.list(this.caseCode()||undefined,this.definition()?.subtipo).subscribe({next:r=>{if(sequence===this.listSequence)this.rows.set(r.expedientes);},error:e=>{if(sequence===this.listSequence)this.fail(e);}});}
  filtered():WorkflowSnapshot[]{const q=this.search.trim().toLowerCase();return this.rows().filter(e=>(!this.caseCode()||e.codigoCaso===this.caseCode())&&(!this.definition()||e.subtipo===this.definition()?.subtipo)&&(!q||(e.codigoExpediente+' '+e.titulo+' '+e.subject.label).toLowerCase().includes(q)));}
  private detailRequest:{unsubscribe():void}|null=null;
  private detailSequence=0;
  private clinicalSequence=0;
  load(id:number):void{
    if(this.busy()||!Number.isSafeInteger(id)||id<=0)return;
    const sequence=++this.detailSequence;
    this.detailRequest?.unsubscribe();
    this.detailRequest=this.api.detail(id).subscribe({
      next:r=>{if(sequence===this.detailSequence&&r.snapshot)this.apply(r.snapshot);},
      error:e=>{if(sequence===this.detailSequence)this.fail(e);}
    });
  }
  private cancelDetail():void{this.detailSequence++;this.detailRequest?.unsubscribe();this.detailRequest=null;}
  ngOnDestroy():void{this.cancelDetail();this.clinicalSequence++;this.listSequence++;this.listRequest?.unsubscribe();}
  private apply(snapshot:WorkflowSnapshot):void{
    this.current.set(snapshot);this.loaded.emit(snapshot);this.viewStage.set(snapshot.stageCode);this.rows.update(rows=>{const exists=rows.some(r=>r.expedienteId===snapshot.expedienteId);return exists?rows.map(r=>r.expedienteId===snapshot.expedienteId?snapshot:r):[snapshot,...rows];});
    this.receipts.set({});this.files={};this.values=Object.fromEntries(snapshot.requirements.map(r=>[r.requirementCode,r.declaredValue??'']));
    const url=new URL(location.href);url.hash='/workflow?expedienteId='+snapshot.expedienteId;
    const qr=QRCode.create(url.href,{errorCorrectionLevel:'M'}),size=qr.modules.size;let path='';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(qr.modules.get(r,c))path+='M'+(c+4)+','+(r+4)+'h1v1h-1z';
    this.qrSize.set(size+8);this.qrPath.set(path);
  }
  private fail(error:unknown):void{const f=workflowFailure(error);this.busy.set(false);this.failed.set(true);this.message.set(f.message);this.dialogError.set(f.message);this.violations.set(f.violations);}
  private success(message:string):void{this.busy.set(false);this.failed.set(false);this.message.set(message);this.dialogError.set('');this.violations.set([]);}
  openCreate():void{if(this.busy())return;if(!this.definition()||this.definition()?.status!=='PUBLISHED'){this.fail(new Error('Seleccione una definición publicada y válida para crear el expediente.'));return;}this.cancelDetail();this.createOpen.set(true);this.dialogError.set('');this.subjects.set([]);this.subjectId=0;}
  searchSubjects():void{const d=this.definition();if(!d)return;this.api.subjects(d.subjectType,this.subjectSearch).subscribe({next:r=>this.subjects.set(r.subjects),error:e=>this.fail(e)});}
  create():void{
    const d=this.definition(),subject=this.subjects().find(s=>s.subjectId===this.subjectId);
    if(this.busy()||!d||!subject||!this.newTitle.trim())return;
    this.cancelDetail();this.busy.set(true);this.api.create({codigoCaso:d.codigoCaso,subtipo:d.subtipo,definitionVersion:d.definitionVersion,titulo:this.newTitle.trim(),subjectType:subject.subjectType,subjectId:subject.subjectId}).subscribe({
      next:r=>{if(r.snapshot)this.apply(r.snapshot);this.createOpen.set(false);this.success(r.message);},error:e=>this.fail(e)});
  }
  openAction(action:WorkflowTransition):void{if(this.busy())return;this.cancelDetail();this.action.set(action);this.actionOpen.set(true);this.dialogError.set('');}
  execute():void{
    const s=this.current(),a=this.action();if(this.busy()||!s||!a)return;
    if(a.requiresComment&&!this.comment.trim()){this.dialogError.set('Ingrese el comentario requerido para esta acción.');return;}
    try{const request=this.api.action(s,{expectedVersion:s.version,definitionVersion:s.definitionVersion,actionCode:a.actionCode,
      values:s.requirements.map(r=>({requirementCode:r.requirementCode,value:this.values[r.requirementCode]??''})),evidenceIds:[...new Set(s.requirements.flatMap(r=>this.requirementEvidenceIds(r)))],comment:this.comment||null});
      this.cancelDetail();this.busy.set(true);request.subscribe({next:r=>{if(r.snapshot)this.apply(r.snapshot);this.actionOpen.set(false);this.success(r.message);if(r.replayed&&r.snapshot)this.load(r.snapshot.expedienteId);},error:e=>this.fail(e)});
    }catch(e){this.fail(e);}
  }
  chooseFile(r:WorkflowRequirement,event:Event):void{const file=(event.target as HTMLInputElement).files?.[0];if(file)this.files[r.requirementCode]=file;}
  upload(r:WorkflowRequirement):void{const s=this.current(),file=this.files[r.requirementCode];if(this.busy()||!s||!file)return;this.cancelDetail();this.busy.set(true);
    this.evidence.upload(file,s,r.requirementCode).subscribe({next:receipt=>{this.receipts.update(all=>({...all,[r.requirementCode]:receipt}));this.success('El archivo se persistió. Registre la revisión del requisito para confirmar su cumplimiento.');},error:e=>this.fail(e)});}
  requirementEvidenceIds(r:WorkflowRequirement):string[]{const receipt=this.receipts()[r.requirementCode];return [...new Set([...r.evidenceIds,...(receipt?[receipt.evidenceId]:[])])];}
  openProof(r:WorkflowRequirement):void{if(this.busy())return;this.cancelDetail();this.clinicalSequence++;this.clinicalLoading=false;this.proofRequirement.set(r);this.proofOpen.set(true);this.dialogError.set('');this.proofDecision='';this.proofComment='';this.validUntil='';this.signatureId='';this.signatureFile=null;this.signatureEvidenceId='';this.clinicalRecordId=0;this.clinicalAfter=0;this.clinicalRecords.set([]);if(r.requiresClinicalReview)this.loadClinicalRecords();}
  loadClinicalRecords(more=false):void{
   const s=this.current(),r=this.proofRequirement();if(!s||!r||this.clinicalLoading)return;
   const id=s.expedienteId,requirement=r.requirementCode,sequence=++this.clinicalSequence;this.clinicalLoading=true;
   this.clinical.records(id,more?this.clinicalAfter:0).subscribe({next:rows=>{
    if(sequence!==this.clinicalSequence)return;this.clinicalLoading=false;if(this.current()?.expedienteId!==id||this.proofRequirement()?.requirementCode!==requirement||!this.proofOpen())return;
    this.clinicalRecords.update(before=>more?[...before,...rows]:rows);this.clinicalAfter=rows.at(-1)?.clinicalRecordId??this.clinicalAfter;
    if(!rows.length)this.dialogError.set('No hay más evaluaciones vigentes para este trabajador y su autorización profesional.');
   },error:e=>{if(sequence!==this.clinicalSequence)return;this.clinicalLoading=false;if(this.current()?.expedienteId===id)this.dialogError.set(workflowFailure(e).message);}});
  }
  chooseSignature(event:Event):void{this.signatureFile=(event.target as HTMLInputElement).files?.[0]??null;this.signatureId='';}
  verifySignature():void{const s=this.current();if(this.busy()||!s||!this.signatureFile||!this.signatureEvidenceId)return;this.cancelDetail();this.busy.set(true);
    this.evidence.sign(this.signatureFile,this.signatureEvidenceId,s.version).subscribe({next:id=>{this.signatureId=id;this.success('Firma del documento verificada por el servidor.');},error:e=>this.fail(e)});}
  recordProof():void{const s=this.current(),r=this.proofRequirement();if(this.busy()||!s||!r||!this.proofDecision)return;
    let date:string|null=null;if(this.validUntil){const parsed=new Date(this.validUntil);if(!Number.isFinite(parsed.getTime())){this.dialogError.set('La vigencia es inválida.');return;}date=parsed.toISOString();}
    const medical=r.requiresClinicalReview&&this.proofDecision==='APPROVED'?this.clinicalRecords().find(m=>m.clinicalRecordId===this.clinicalRecordId):undefined;
    if(r.requiresClinicalReview&&this.proofDecision==='APPROVED'&&!medical){this.dialogError.set('Seleccione la evaluación médica confirmada de este trabajador.');return;}
    this.cancelDetail();this.busy.set(true);this.api.proof(s,{requirementCode:r.requirementCode,decision:this.proofDecision,evidenceIds:this.requirementEvidenceIds(r),validUntilUtc:date,comment:this.proofComment||null,signatureId:this.signatureId||null,...(medical?{clinicalRecordId:medical.clinicalRecordId,clinicalRecordVersion:medical.version}:{})}).subscribe({
      next:result=>{if(result.snapshot)this.apply(result.snapshot);this.proofOpen.set(false);this.success(result.message);if(result.replayed&&result.snapshot)this.load(result.snapshot.expedienteId);},error:e=>this.fail(e)});
  }
  openDefinition():void{if(this.busy())return;this.clinical.options().subscribe({next:o=>this.clinicalOptions.set(o),error:e=>this.dialogError.set(workflowFailure(e).message)});this.legacy.callAjaxPost('/usuario/lista',{}).subscribe({next:r=>{try{this.roleUsers.set(confirmedList<Record<string,unknown>>(r));}catch(e){this.fail(e);}},error:e=>this.fail(e)});this.definitionOpen.set(true);this.dialogError.set('');const d=this.definition();if(d){this.draft={codigoCaso:d.codigoCaso,subtipo:d.subtipo,nombre:d.nombre,subjectType:d.subjectType,initialStageCode:d.initialStageCode,initialStateCode:d.initialStateCode,
    stages:d.stages.map(s=>({...structuredClone(s),requirements:s.requirements.map(r=>({...r,rolesText:r.verifierRoles.join(', ')}))})),transitions:d.transitions.map(t=>({...structuredClone(t),rolesText:t.requiredRoles.join(', ')}))};this.savedDefinition.set(d);}else this.savedDefinition.set(null);}
  addStage():void{this.draft.stages.push({stageCode:'',order:this.draft.stages.length+1,title:'',roleCode:'',deadlineHours:null,allowNoRequirements:false,requirements:[]});}
  addRequirement(index:number):void{this.draft.stages[index].requirements.push({requirementCode:'',title:'',verificationKind:'',mandatory:false,evidenceRequired:false,requiresValidityEnd:false,maxValidityHours:null,rolesText:''});}
  addTransition():void{this.draft.transitions.push({actionCode:'',label:'',fromStageCode:'',fromStateCode:'',toStageCode:'',toStateCode:'',rolesText:'',requiresVerifiedRequirements:false,requiresComment:false,isFinal:false,effectCode:null,effectValue:null});}
  saveDefinition():void{if(this.busy())return;
    const data={...this.draft,stages:this.draft.stages.map(s=>({stageCode:s.stageCode,order:s.order,title:s.title,roleCode:s.roleCode,deadlineHours:s.deadlineHours||null,allowNoRequirements:s.allowNoRequirements,
      requirements:s.requirements.map((r:any)=>({requirementCode:r.requirementCode,title:r.title,verificationKind:r.verificationKind,mandatory:r.mandatory,evidenceRequired:r.evidenceRequired,requiresValidityEnd:r.requiresValidityEnd,maxValidityHours:r.maxValidityHours??null,verifierRoles:String(r.rolesText).split(',').map(x=>x.trim()).filter(Boolean)}))})),
      transitions:this.draft.transitions.map(t=>({actionCode:t.actionCode,label:t.label,fromStageCode:t.fromStageCode,fromStateCode:t.fromStateCode,toStageCode:t.toStageCode,toStateCode:t.toStateCode,
      requiredRoles:String(t.rolesText).split(',').map(x=>x.trim()).filter(Boolean),requiresVerifiedRequirements:t.requiresVerifiedRequirements,requiresComment:t.requiresComment,isFinal:t.isFinal,effectCode:t.effectCode||null,effectValue:t.effectValue||null}))};
    this.cancelDetail();this.busy.set(true);this.api.saveDefinition(data).subscribe({next:r=>{this.savedDefinition.set(r.definition??null);this.success(r.message);this.reload();},error:e=>this.fail(e)});
  }
  publish(d:WorkflowDefinition):void{if(this.busy())return;this.cancelDetail();this.busy.set(true);this.api.publishDefinition(d.definitionId).subscribe({next:r=>{this.savedDefinition.set(r.definition??null);this.success(r.message);this.reload();},error:e=>this.fail(e)});}
  exportCurrent():void{const s=this.current();if(!s)return;const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=s.codigoExpediente+'.json';a.click();URL.revokeObjectURL(url);}
  saveRoleGrant():void{
 if(this.busy()||!this.roleUsers().some(u=>u['id']===this.roleGrantUserId)||!this.roleCodes().includes(this.roleGrantRole)||!this.roleGrantReason.trim()){
  this.dialogError.set('Seleccione usuario, rol y motivo de la asignación.');return;
 }
 let validUntilUtc:string|null=null;if(this.roleGrantUntil){const date=new Date(this.roleGrantUntil);if(!Number.isFinite(date.getTime())){this.dialogError.set('La fecha de vigencia es inválida.');return;}validUntilUtc=date.toISOString();}
 this.cancelDetail();this.busy.set(true);this.api.grantRole({userId:this.roleGrantUserId,roleCode:this.roleGrantRole,enabled:this.roleGrantEnabled,validUntilUtc,reason:this.roleGrantReason}).subscribe({
 next:r=>{this.success(r.message);this.dialogError.set(r.message);},error:e=>this.fail(e)});
}
print():void{window.print();}
}
