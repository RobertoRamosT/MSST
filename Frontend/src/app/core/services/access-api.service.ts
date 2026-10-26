import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {Observable,map} from 'rxjs';
import {IntentKeys,WorkflowContractError,asObject,isGuid,isSafeId} from './workflow-api.service';
export interface AccessCode{code:string;label:string;workflowSubjectType?:string;}
export interface AccessItem{id:number;label:string;}
export interface AccessFactDefinition{subjectType:string;code:string;label:string;operators:AccessCode[];values:AccessCode[];}
export interface AccessCatalog{projects:AccessItem[];zones:AccessItem[];directions:AccessCode[];subjectTypes:(AccessCode&{workflowSubjectType:string})[];facts:AccessFactDefinition[];}
export interface AccessFactRule{subjectType:string;factCode:string;operator:string;expectedValues:string[];message:string;}
export interface AccessWorkflowRule{subjectType:string;codigoCaso:string;subtipo:string;requiredState:string;message:string;}
export interface AccessZone{zoneId:number|null;label:string;enabled:boolean;}
export interface AccessPolicy{enabled:boolean;ttlSeconds:number;requireProject:boolean;requireZone:boolean;version:string;rules:AccessFactRule[];workflowRules:AccessWorkflowRule[];zones:AccessZone[];}
export type AccessPolicyDraft=Omit<AccessPolicy,'version'>;
export interface AccessDecision{decisionId:string;habilitado:boolean;motivos:string[];expiresAt:string;version:string;subjectLabel:string;empresaNombre:string;subjectType:string;subjectId:number;projectId?:number|null;zoneId?:number|null;direction:string;}
function text(v:unknown):v is string{return typeof v==='string'&&!!v.trim();}
function version(v:unknown):v is string{try{return typeof v==='string'&&atob(v).length===8&&btoa(atob(v))===v;}catch{return false;}}
function list<T>(v:unknown,valid:(item:Record<string,unknown>)=>boolean):T[]{if(!Array.isArray(v)||v.some(item=>!valid(asObject(item))))throw new WorkflowContractError('El catálogo de accesos contiene datos inválidos.');return structuredClone(v) as T[];}
function item(v:Record<string,unknown>):boolean{return isSafeId(v['id'])&&text(v['label']);}
function code(v:Record<string,unknown>):boolean{return text(v['code'])&&text(v['label']);}
function confirmed(raw:unknown,expectedCode:string,requestId?:string):Record<string,unknown>{
 const v=asObject(raw);if(v['succeeded']!==true||v['code']!==expectedCode||!text(v['message'])||!text(v['correlationId']))throw new WorkflowContractError('El servidor no confirmó la operación de acceso.');
 if(requestId&&(!isGuid(v['requestId'])||v['requestId'].toLowerCase()!==requestId.toLowerCase()))throw new WorkflowContractError('El recibo de acceso corresponde a otra solicitud.');return v;
}
export function readAccessPolicy(raw:unknown,expectedCode:string,requestId?:string):AccessPolicy|null{
 const v=confirmed(raw,expectedCode,requestId);if(v['policy']===null&&expectedCode==='ACCESS_POLICY')return null;
 const p=asObject(v['policy']);
 if(typeof p['enabled']!=='boolean'||!Number.isInteger(p['ttlSeconds'])||Number(p['ttlSeconds'])<1||typeof p['requireProject']!=='boolean'||typeof p['requireZone']!=='boolean'||!version(p['version']))throw new WorkflowContractError('No se confirmó la política persistida.');
 list<AccessFactRule>(p['rules'],r=>text(r['subjectType'])&&text(r['factCode'])&&text(r['operator'])&&text(r['message'])&&Array.isArray(r['expectedValues'])&&r['expectedValues'].length>0&&r['expectedValues'].every(text));
 list<AccessWorkflowRule>(p['workflowRules'],r=>text(r['subjectType'])&&text(r['codigoCaso'])&&text(r['subtipo'])&&text(r['requiredState'])&&text(r['message']));
 list<AccessZone>(p['zones'],z=>isSafeId(z['zoneId'])&&text(z['label'])&&typeof z['enabled']==='boolean');
 return structuredClone(p) as unknown as AccessPolicy;
}
@Injectable({providedIn:'root'})
export class AccessApiService{
 private readonly http=inject(HttpClient);private readonly intents=new IntentKeys();
 catalogs():Observable<AccessCatalog>{return this.http.get<unknown>('/sst/access/catalogs').pipe(map(raw=>{
  const v=confirmed(raw,'ACCESS_CATALOG');const facts=list<AccessFactDefinition>(v['facts'],f=>{
   if(!text(f['subjectType'])||!text(f['code'])||!text(f['label']))return false;list(f['operators'],code);list(f['values'],code);return true;
  });return{projects:list(v['projects'],item),zones:list(v['zones'],item),directions:list(v['directions'],code),subjectTypes:list(v['subjectTypes'],t=>code(t)&&text(t['workflowSubjectType'])),facts};
 }));}
 policy():Observable<AccessPolicy|null>{return this.http.get<unknown>('/sst/access/policy').pipe(map(raw=>readAccessPolicy(raw,'ACCESS_POLICY')));}
 savePolicy(data:AccessPolicyDraft,expectedVersion:string|null):Observable<AccessPolicy>{
  const payload={...structuredClone(data),expectedVersion};const idempotencyKey=this.intents.key('access-policy',payload);
  return this.http.put<unknown>('/sst/access/policy',{...payload,idempotencyKey}).pipe(map(raw=>{
   const policy=readAccessPolicy(raw,'ACCESS_POLICY_SAVED',idempotencyKey);if(!policy)throw new WorkflowContractError('Falta la política guardada.');return policy;
  }));
 }
 evaluate(subjectType:string,identifier:string,direction:string,projectId:number|null=null,zoneId:number|null=null):Observable<AccessDecision>{
  if(!text(subjectType)||!text(direction)||!identifier.trim()||(projectId!==null&&!isSafeId(projectId))||(zoneId!==null&&!isSafeId(zoneId)))throw new WorkflowContractError('Indique tipo, identificador exacto y sentido del movimiento.');
  return this.http.post<unknown>('/sst/access/evaluate',{subjectType,identifier:identifier.trim(),direction,projectId,zoneId}).pipe(map(raw=>{
   const v=confirmed(raw,'ACCESS_EVALUATED'),d=asObject(v['decision']);
   if(!isGuid(d['decisionId'])||typeof d['habilitado']!=='boolean'||!Array.isArray(d['motivos'])||d['motivos'].some(x=>!text(x))
    ||!text(d['expiresAt'])||!Number.isFinite(Date.parse(d['expiresAt']))||!version(d['version'])||!text(d['subjectLabel'])||typeof d['empresaNombre']!=='string'
    ||d['subjectType']!==subjectType||!isSafeId(d['subjectId'])||d['direction']!==direction||d['projectId']!==projectId||d['zoneId']!==zoneId)
    throw new WorkflowContractError('El servidor no confirmó una decisión de acceso válida.');
   if(d['habilitado']===(d['motivos'].length>0))throw new WorkflowContractError('La decisión y sus motivos son incoherentes.');
   return structuredClone(d) as unknown as AccessDecision;
  }));
 }
 register(decision:AccessDecision):Observable<Record<string,unknown>>{
  const data={decisionId:decision.decisionId,expectedVersion:decision.version};const idempotencyKey=this.intents.key('access-register',data);
  return this.http.post<unknown>('/sst/access/register',{...data,idempotencyKey}).pipe(map(raw=>{
   const v=confirmed(raw,'ACCESS_RECORDED',idempotencyKey),s=asObject(v['snapshot']),r=asObject(s['record']);
   if(!version(s['version'])||r['version']!==s['version']||!isSafeId(r['id'])||typeof r['autorizado']!=='boolean'||r['autorizado']!==decision.habilitado
    ||r['movimiento']!==decision.direction||!text(r['documentoOPlaca'])||!text(r['nombre'])||!text(r['garita'])||!text(r['vigilante'])
    ||!text(r['fechaRegistro'])||!Number.isFinite(Date.parse(r['fechaRegistro'])))throw new WorkflowContractError('No se confirmó el movimiento persistido.');
   return structuredClone(s);
  }));
 }
}
