import {Component,computed,effect,inject,input,output,signal,untracked} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {AccessApiService,AccessCatalog,AccessFactDefinition,AccessFactRule,AccessPolicy,AccessWorkflowRule} from '../services/access-api.service';
import {WorkflowApiService,WorkflowDefinition,workflowFailure} from '../services/workflow-api.service';
@Component({selector:'msst-access-policy',standalone:true,imports:[CommonModule,FormsModule],template:`
@if(open()){
 <div class="overlay"><section role="dialog" aria-modal="true" aria-label="Política de accesos">
 <header><h2>Política de accesos</h2><button (click)="closed.emit()" [disabled]="busy()">Cerrar</button></header>
 <p>Configure condiciones, expedientes requeridos y puntos de control. La evaluación y el registro se realizan en el servidor con los datos vigentes.</p>
 @if(message()){<p role="status">{{message()}}</p>}
 @if(loaded()){
 <div class="grid"><label><input type="checkbox" [(ngModel)]="enabled">Política habilitada</label>
 <label>Vigencia de cada decisión (segundos)<input type="number" min="1" max="86400" [(ngModel)]="ttlSeconds"></label>
 <label><input type="checkbox" [(ngModel)]="requireProject">Exigir proyecto</label><label><input type="checkbox" [(ngModel)]="requireZone">Exigir punto de control</label></div>
 <h3>Condiciones operativas</h3>
 @for(r of rules;track $index;let i=$index){
 <div class="row"><label>Tipo<select [ngModel]="r.subjectType" (ngModelChange)="changeType(r,$event)"><option value="">Seleccione</option>@for(t of catalog()?.subjectTypes;track t.code){<option [value]="t.code">{{t.label}}</option>}</select></label>
 <label>Dato<select [ngModel]="r.factCode" (ngModelChange)="changeFact(r,$event)"><option value="">Seleccione</option>@for(f of facts(r.subjectType);track f.code){<option [value]="f.code">{{f.label}}</option>}</select></label>
 <label>Operador<select [(ngModel)]="r.operator"><option value="">Seleccione</option>@for(o of fact(r)?.operators;track o.code){<option [value]="o.code">{{o.label}}</option>}</select></label>
 <label>Valores admitidos<select multiple [(ngModel)]="r.expectedValues">@for(v of fact(r)?.values;track v.code){<option [value]="v.code">{{v.label}}</option>}</select></label>
 <label>Mensaje al incumplir<input [(ngModel)]="r.message"></label><button (click)="rules.splice(i,1)">Quitar condición</button></div>
 }
 <button (click)="addRule()">Agregar condición</button>
 <h3>Expedientes obligatorios</h3>
 @for(r of workflowRules;track $index;let i=$index){
 <div class="row"><label>Tipo<select [(ngModel)]="r.subjectType"><option value="">Seleccione</option>@for(t of catalog()?.subjectTypes;track t.code){<option [value]="t.code">{{t.label}}</option>}</select></label>
 <label>Caso, subtipo y estado final<select [ngModel]="workflowKey(r)" (ngModelChange)="chooseWorkflow(r,$event)"><option value="">Seleccione una definición publicada</option>@for(f of finalStates(r.subjectType);track f.key){<option [value]="f.key">{{f.label}}</option>}</select></label>
 <label>Mensaje al incumplir<input [(ngModel)]="r.message"></label><button (click)="workflowRules.splice(i,1)">Quitar expediente</button></div>
 }
 <button (click)="workflowRules.push({subjectType:'',codigoCaso:'',subtipo:'',requiredState:'',message:''})">Agregar expediente obligatorio</button>
 <h3>Puntos de control</h3>
 @for(z of zones;track $index;let i=$index){<div class="row"><label>Nombre<input [(ngModel)]="z.label"></label><label><input type="checkbox" [(ngModel)]="z.enabled">Habilitado</label><button (click)="zones.splice(i,1)">Quitar</button></div>}
 <button (click)="zones.push({zoneId:null,label:'',enabled:false})">Agregar punto de control</button>
 <footer><button [disabled]="busy()" (click)="save()">{{busy()?'Guardando…':'Guardar política'}}</button><button [disabled]="busy()" (click)="load()">Volver a consultar</button></footer>
 }@else{<p>{{busy()?'Consultando configuración…':'La configuración no se confirmó. Puede volver a consultar.'}}</p><button [disabled]="busy()" (click)="load()">Consultar</button>}
 </section></div>
}`,styles:[`.overlay{position:fixed;inset:0;background:#0b1f3b99;display:grid;place-items:center;z-index:4000}section{background:white;color:#172b46;width:min(1100px,95vw);max-height:94vh;overflow:auto;padding:24px;border-radius:12px}header,footer,.row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin:14px 0}header{justify-content:space-between}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}label{display:grid;gap:6px}input,select,button{padding:8px;border:1px solid #a6b5c8;border-radius:5px}button{background:#edf5fc;cursor:pointer}.row{border-bottom:1px solid #ddd;padding-bottom:14px}`]})
export class AccessPolicyComponent{
 readonly open=input(false);readonly closed=output<void>();private readonly api=inject(AccessApiService);private readonly workflow=inject(WorkflowApiService);
 readonly catalog=signal<AccessCatalog|null>(null);readonly definitions=signal<WorkflowDefinition[]>([]);readonly busy=signal(false);readonly loaded=signal(false);readonly message=signal('');
 enabled=false;ttlSeconds:number|null=null;requireProject=false;requireZone=false;expectedVersion:string|null=null;
 rules:AccessFactRule[]=[];workflowRules:AccessWorkflowRule[]=[];zones:{zoneId:number|null;label:string;enabled:boolean}[]=[];
 constructor(){effect(()=>{if(this.open())untracked(()=>this.load());});}
 load():void{if(this.busy())return;this.busy.set(true);this.loaded.set(false);this.message.set('');forkJoin({catalog:this.api.catalogs(),policy:this.api.policy(),workflow:this.workflow.catalog()}).subscribe({
 next:r=>{this.catalog.set(r.catalog);this.definitions.set(r.workflow.cases.flatMap(c=>c.definitions));this.apply(r.policy);this.loaded.set(true);this.busy.set(false);},
 error:e=>{this.busy.set(false);this.message.set(workflowFailure(e).message);}
 });}
 private apply(p:AccessPolicy|null):void{this.expectedVersion=p?.version??null;this.enabled=p?.enabled??false;this.ttlSeconds=p?.ttlSeconds??null;this.requireProject=p?.requireProject??false;this.requireZone=p?.requireZone??false;
 this.rules=structuredClone(p?.rules??[]);this.workflowRules=structuredClone(p?.workflowRules??[]);this.zones=structuredClone(p?.zones??[]);}
 facts(type:string):AccessFactDefinition[]{return this.catalog()?.facts.filter(f=>f.subjectType===type)??[];}
 fact(r:AccessFactRule):AccessFactDefinition|undefined{return this.facts(r.subjectType).find(f=>f.code===r.factCode);}
 addRule():void{this.rules.push({subjectType:'',factCode:'',operator:'',expectedValues:[],message:''});}
 changeType(r:AccessFactRule,type:string):void{r.subjectType=type;this.changeFact(r,'');}
 changeFact(r:AccessFactRule,code:string):void{r.factCode=code;r.operator='';r.expectedValues=[];}
 workflowKey(r:AccessWorkflowRule):string{return r.codigoCaso&&r.subtipo&&r.requiredState?JSON.stringify([r.codigoCaso,r.subtipo,r.requiredState]):'';}
 finalStates(type:string):{key:string;label:string}[]{
  const subject=this.catalog()?.subjectTypes.find(t=>t.code===type)?.workflowSubjectType;
  if(!subject)return [];
  return this.definitions().filter(d=>d.status==='PUBLISHED'&&d.subjectType===subject).flatMap(d=>d.transitions.filter(t=>t.isFinal).map(t=>({key:JSON.stringify([d.codigoCaso,d.subtipo,t.toStateCode]),label:d.nombre+' / '+d.subtipo+' / '+t.toStateCode}))).filter((v,i,a)=>a.findIndex(x=>x.key===v.key)===i);
 }
 chooseWorkflow(r:AccessWorkflowRule,key:string):void{const selected=this.finalStates(r.subjectType).find(f=>f.key===key);if(!selected){r.codigoCaso='';r.subtipo='';r.requiredState='';return;}[r.codigoCaso,r.subtipo,r.requiredState]=JSON.parse(selected.key) as string[];}
 save():void{if(this.busy()||!this.loaded())return;
 if(!Number.isInteger(this.ttlSeconds)||Number(this.ttlSeconds)<1||Number(this.ttlSeconds)>86400){this.message.set('Indique una vigencia válida para la decisión.');return;}
 if(this.rules.some(r=>!this.fact(r)||!r.operator||!r.expectedValues.length||!r.message.trim())||this.workflowRules.some(r=>!r.subjectType||!this.finalStates(r.subjectType).some(f=>f.key===this.workflowKey(r))||!r.message.trim())||this.zones.some(z=>!z.label.trim())){this.message.set('Complete las condiciones, los expedientes y sus mensajes de validación.');return;}
 const data={enabled:this.enabled,ttlSeconds:Number(this.ttlSeconds),requireProject:this.requireProject,requireZone:this.requireZone,rules:this.rules,workflowRules:this.workflowRules,zones:this.zones};
 this.busy.set(true);this.api.savePolicy(data,this.expectedVersion).subscribe({next:p=>{this.apply(p);this.busy.set(false);this.message.set('Política guardada y confirmada por el servidor.');},error:e=>{this.busy.set(false);this.message.set(workflowFailure(e).message);}});
 }
}
