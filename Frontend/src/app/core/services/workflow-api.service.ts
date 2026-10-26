import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';

export interface WorkflowSubject {subjectType:string;subjectId:number;label:string;idContratista?:number|null;idProyecto?:number|null;}
export interface WorkflowRequirement {requirementCode:string;title:string;stageCode:string;mandatory:boolean;verificationKind:string;evidenceRequired:boolean;verifierRoles:string[];status:string;message:string;evidenceIds:string[];declaredValue?:string|null;requiresValidityEnd:boolean;maxValidityHours?:number|null;requiresClinicalReview?:boolean;}
export interface WorkflowStage {stageCode:string;order:number;title:string;roleCode:string;deadlineHours?:number|null;allowNoRequirements:boolean;requirements:WorkflowRequirement[];}
export interface WorkflowTransition {actionCode:string;label:string;fromStageCode:string;fromStateCode:string;toStageCode:string;toStateCode:string;requiredRoles:string[];requiresVerifiedRequirements:boolean;requiresComment:boolean;isFinal:boolean;effectCode?:string|null;effectValue?:string|null;}
export interface WorkflowDefinition {definitionId:number;codigoCaso:string;subtipo:string;definitionVersion:number;nombre:string;subjectType:string;status:string;initialStageCode:string;initialStateCode:string;stages:WorkflowStage[];transitions:WorkflowTransition[];validationMessages:string[];}
export interface WorkflowCase {codigoCaso:string;nombre:string;descripcion:string;definitions:WorkflowDefinition[];}
export interface WorkflowEvent {eventId:number;requestId:string;actionCode:string;actorDisplayName:string;occurredAtUtc:string;fromStageCode:string;fromStateCode:string;toStageCode:string;toStateCode:string;comment?:string|null;}
export interface WorkflowSnapshot {expedienteId:number;codigoExpediente:string;codigoCaso:string;subtipo:string;definitionVersion:number;titulo:string;subject:WorkflowSubject;stageCode:string;etapaActual:number;totalEtapas:number;estadoGeneral:string;cumplimientoPorc:number;version:string;fechaUltimoMovimiento:string;allowedActions:string[];actions:WorkflowTransition[];requirements:WorkflowRequirement[];history:WorkflowEvent[];}
export interface WorkflowViolation {requirementCode:string;code:string;message:string;}
export interface WorkflowEnvelope {succeeded:boolean;code:string;message:string;correlationId:string;requestId?:string|null;replayed:boolean;httpStatus:number;snapshot?:WorkflowSnapshot|null;cases:WorkflowCase[];expedientes:WorkflowSnapshot[];subjects:WorkflowSubject[];definition?:WorkflowDefinition|null;validationErrors:WorkflowViolation[];total:number;}
export interface WorkflowAction {expectedVersion:string;definitionVersion:number;actionCode:string;values:{requirementCode:string;value:string}[];evidenceIds:string[];comment:string|null;}
export interface EvidenceReceipt {evidenceId:string;sha256:string;fileName:string;size:number;contentType:string;stateCode:string;}
export class WorkflowContractError extends Error {constructor(message:string){super(message);this.name='WorkflowContractError';}}
export class WorkflowDomainError extends WorkflowContractError{constructor(message:string,readonly violations:WorkflowViolation[]){super(message);}}
export const isSafeId=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>0;
export const isGuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)&&v!=='00000000-0000-0000-0000-000000000000';
export function asObject(raw:unknown):Record<string,unknown>{if(raw===null||typeof raw!=='object'||Array.isArray(raw))throw new WorkflowContractError('Respuesta del servidor inválida.');return raw as Record<string,unknown>;}
type Schema=Record<string,unknown>;
const subjectSchema:Schema={subjectType:'text',subjectId:'id',label:'text',idContratista:'id?',idProyecto:'id?'};
const requirementSchema:Schema={requirementCode:'text',title:'text',stageCode:'text',mandatory:'bool',verificationKind:'text',evidenceRequired:'bool',verifierRoles:['text'],status:'text',message:'string',evidenceIds:['guid'],declaredValue:'string?',requiresValidityEnd:'bool',maxValidityHours:'id?',requiresClinicalReview:'bool?'};
const transitionSchema:Schema={actionCode:'text',label:'text',fromStageCode:'text',fromStateCode:'text',toStageCode:'text',toStateCode:'text',requiredRoles:['text'],requiresVerifiedRequirements:'bool',requiresComment:'bool',isFinal:'bool',effectCode:'text?',effectValue:'text?'};
const stageSchema:Schema={stageCode:'text',order:'id',title:'text',roleCode:'text',deadlineHours:'id?',allowNoRequirements:'bool',requirements:[requirementSchema]};
const definitionSchema:Schema={definitionId:'id',codigoCaso:'text',subtipo:'text',definitionVersion:'id',nombre:'text',subjectType:'text',status:'text',initialStageCode:'text',initialStateCode:'text',stages:[stageSchema],transitions:[transitionSchema],validationMessages:['string']};
const eventSchema:Schema={eventId:'id',requestId:'guid',actionCode:'text',actorDisplayName:'text',occurredAtUtc:'date',fromStageCode:'string',fromStateCode:'string',toStageCode:'text',toStateCode:'text',comment:'string?'};
const snapshotSchema:Schema={expedienteId:'id',codigoExpediente:'text',codigoCaso:'text',subtipo:'text',definitionVersion:'id',titulo:'text',subject:subjectSchema,stageCode:'text',etapaActual:'id',totalEtapas:'id',estadoGeneral:'text',cumplimientoPorc:'percent',version:'version',fechaUltimoMovimiento:'date',allowedActions:['text'],actions:[transitionSchema],requirements:[requirementSchema],history:[eventSchema]};
const caseSchema:Schema={codigoCaso:'text',nombre:'text',descripcion:'string',definitions:[definitionSchema]};
const violationSchema:Schema={requirementCode:'string',code:'text',message:'text'};
function check(raw:unknown,schema:unknown,path='respuesta'):void{
  if(Array.isArray(schema)){if(!Array.isArray(raw))throw new WorkflowContractError(path+': lista inválida.');raw.forEach(v=>check(v,schema[0],path));return;}
  if(schema!==null&&typeof schema==='object'){
    const v=asObject(raw);for(const [key,rule]of Object.entries(schema))check(v[key],rule,path+'.'+key);return;
  }
  if(typeof schema!=='string')throw new WorkflowContractError('Esquema inválido.');
  if(schema.endsWith('?')&&(raw===null||raw===undefined))return;
  const rule=schema.replace(/\?$/,'');let valid=false;
  switch(rule){
    case 'id':valid=isSafeId(raw);break;
    case 'string':valid=typeof raw==='string';break;
    case 'text':valid=typeof raw==='string'&&!!raw.trim();break;
    case 'bool':valid=typeof raw==='boolean';break;
    case 'guid':valid=isGuid(raw);break;
    case 'percent':valid=typeof raw==='number'&&Number.isFinite(raw)&&raw>=0&&raw<=100;break;
    case 'date':valid=typeof raw==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(raw)&&Number.isFinite(Date.parse(raw));break;
    case 'version':try{valid=typeof raw==='string'&&/^[A-Za-z0-9+/]{11}=$/.test(raw)&&atob(raw).length===8&&btoa(atob(raw))===raw;}catch{valid=false;}break;
  }
  if(!valid)throw new WorkflowContractError(path+': valor inválido. No se modificó el expediente.');
}
export function readWorkflowSnapshot(raw:unknown):WorkflowSnapshot{
  check(raw,snapshotSchema);const s=raw as WorkflowSnapshot;
  if(s.etapaActual>s.totalEtapas||new Set(s.allowedActions).size!==s.allowedActions.length
    ||s.actions.some(a=>!s.allowedActions.includes(a.actionCode))||new Set(s.requirements.map(r=>r.requirementCode)).size!==s.requirements.length)
    throw new WorkflowContractError('El expediente contiene datos incoherentes.');
  return structuredClone(s);
}
export function readWorkflowEnvelope(raw:unknown,code:string,requestId?:string,expedienteId?:number):WorkflowEnvelope{
  const v=asObject(raw);
  if(v['succeeded']===false&&typeof v['code']==='string'&&v['code']!==code&&typeof v['message']==='string'&&v['message'].trim()){
    check(v['validationErrors'],[violationSchema]);
    throw new WorkflowDomainError(v['message'],structuredClone(v['validationErrors']) as WorkflowViolation[]);
  }
  if(v['succeeded']!==true||v['code']!==code||typeof v['message']!=='string'||!v['message'].trim()
    ||typeof v['correlationId']!=='string'||!v['correlationId'].trim()||typeof v['replayed']!=='boolean'
    ||typeof v['httpStatus']!=='number'||v['httpStatus']<200||v['httpStatus']>=300
    ||typeof v['total']!=='number'||!Number.isSafeInteger(v['total'])||v['total']<0)
    throw new WorkflowContractError('La respuesta no confirmó la operación solicitada.');
  if(requestId&&(!isGuid(v['requestId'])||v['requestId'].toLowerCase()!==requestId.toLowerCase()))
    throw new WorkflowContractError('La respuesta corresponde a otra operación.');
  check(v['cases'],[caseSchema]);check(v['expedientes'],[snapshotSchema]);check(v['subjects'],[subjectSchema]);check(v['validationErrors'],[violationSchema]);
  if(v['snapshot']!==null&&v['snapshot']!==undefined){
    const snapshot=readWorkflowSnapshot(v['snapshot']);
    if(expedienteId!==undefined&&snapshot.expedienteId!==expedienteId)throw new WorkflowContractError('El servidor devolvió otro expediente.');
  }else if(['WF_CREATED','WF_ACTION_CONFIRMED','WF_PROOF_RECORDED','WF_DETAIL_READY'].includes(code))throw new WorkflowContractError('Falta el estado persistido.');
  if(v['definition']!==null&&v['definition']!==undefined)check(v['definition'],definitionSchema);
  else if(['WF_DEFINITION_SAVED','WF_DEFINITION_PUBLISHED'].includes(code))throw new WorkflowContractError('Falta la definición persistida.');
  return structuredClone(v) as unknown as WorkflowEnvelope;
}
export function workflowFailure(error:unknown):{message:string;violations:WorkflowViolation[]}{
  if(error instanceof WorkflowDomainError)return{message:error.message,violations:error.violations};
  if(error instanceof HttpErrorResponse&&error.error!==null&&typeof error.error==='object'&&!Array.isArray(error.error)){
    const v=error.error as Record<string,unknown>;let violations:WorkflowViolation[]=[];
    try{check(v['validationErrors'],[violationSchema]);violations=structuredClone(v['validationErrors']) as WorkflowViolation[];}catch{}
    const coherent=v['succeeded']===false&&typeof v['code']==='string'&&!['WF_ACTION_CONFIRMED','WF_CREATED','WF_PROOF_RECORDED'].includes(v['code']);
    const message=coherent&&typeof v['message']==='string'&&v['message'].trim()?v['message']:'No se confirmó la operación. Sus datos se conservan.';
    return{message:message+(coherent&&typeof v['correlationId']==='string'?' Referencia: '+v['correlationId']:''),violations};
  }
  return{message:error instanceof Error?error.message:'No se confirmó la operación. Sus datos se conservan.',violations:[]};
}
function stable(value:unknown):unknown{
  if(Array.isArray(value))return value.map(stable);
  if(value!==null&&typeof value==='object')return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,stable(v)]));
  return value;
}
export class IntentKeys{
  private readonly keys=new Map<string,string>();
  key(operation:string,data:unknown):string{const fingerprint=operation+JSON.stringify(stable(data));let key=this.keys.get(fingerprint);if(!key){key=crypto.randomUUID();this.keys.set(fingerprint,key);}return key;}
  confirmed(operation:string,data:unknown,key:string):void{
    const fingerprint=operation+JSON.stringify(stable(data));
    if(this.keys.get(fingerprint)===key)this.keys.delete(fingerprint);
  }
}
@Injectable({providedIn:'root'})
export class WorkflowApiService{
  private readonly http=inject(HttpClient);private readonly intents=new IntentKeys();
  private readonly base='/sst/workflow/v2';
  catalog():Observable<WorkflowEnvelope>{return this.http.get<unknown>(this.base+'/casos').pipe(map(raw=>readWorkflowEnvelope(raw,'WF_CATALOG_READY')));}
  list(codigoCaso?:string,subtipo?:string):Observable<WorkflowEnvelope>{
    let params=new HttpParams();if(codigoCaso)params=params.set('codigoCaso',codigoCaso);if(subtipo)params=params.set('subtipo',subtipo);
    return this.http.get<unknown>(this.base+'/expedientes',{params}).pipe(map(raw=>readWorkflowEnvelope(raw,'WF_LIST_READY')));
  }
  detail(id:number):Observable<WorkflowEnvelope>{if(!isSafeId(id))throw new WorkflowContractError('Seleccione un expediente válido.');return this.http.get<unknown>(this.base+'/expedientes/'+id).pipe(map(raw=>readWorkflowEnvelope(raw,'WF_DETAIL_READY',undefined,id)));}
  subjects(subjectType:string,search:string):Observable<WorkflowEnvelope>{return this.http.get<unknown>(this.base+'/subjects',{params:{subjectType,search}}).pipe(map(raw=>readWorkflowEnvelope(raw,'WF_SUBJECTS_READY')));}
  create(data:{codigoCaso:string;subtipo:string;definitionVersion:number;titulo:string;subjectType:string;subjectId:number}):Observable<WorkflowEnvelope>{
    if(!isSafeId(data.subjectId))throw new WorkflowContractError('Seleccione un sujeto existente.');
    return this.mutate('/expedientes',data,'WF_CREATED');
  }
  action(snapshot:WorkflowSnapshot,data:WorkflowAction):Observable<WorkflowEnvelope>{
    readWorkflowSnapshot(snapshot);
    if(data.expectedVersion!==snapshot.version||data.definitionVersion!==snapshot.definitionVersion||!snapshot.allowedActions.includes(data.actionCode))
      throw new WorkflowContractError('La acción no está disponible en la versión consultada.');
    if(data.evidenceIds.some(id=>!isGuid(id))||new Set(data.evidenceIds).size!==data.evidenceIds.length
      ||data.values.some(v=>!v.requirementCode||typeof v.value!=='string')||new Set(data.values.map(v=>v.requirementCode)).size!==data.values.length)
      throw new WorkflowContractError('Revise los requisitos y las evidencias.');
    const canonical={...data,values:[...data.values].sort((a,b)=>a.requirementCode.localeCompare(b.requirementCode)),evidenceIds:[...data.evidenceIds].sort()};
    return this.mutate('/expedientes/'+snapshot.expedienteId+'/actions',canonical,'WF_ACTION_CONFIRMED',snapshot.expedienteId,snapshot.definitionVersion);
  }
  proof(snapshot:WorkflowSnapshot,data:{requirementCode:string;decision:string;evidenceIds:string[];validUntilUtc:string|null;comment:string|null;signatureId?:string|null;clinicalRecordId?:number|null;clinicalRecordVersion?:string|null}):Observable<WorkflowEnvelope>{
    return this.mutate('/expedientes/'+snapshot.expedienteId+'/proofs',{...data,expectedVersion:snapshot.version},'WF_PROOF_RECORDED',snapshot.expedienteId,snapshot.definitionVersion);
  }
  saveDefinition(data:Record<string,unknown>):Observable<WorkflowEnvelope>{return this.mutate('/definitions',data,'WF_DEFINITION_SAVED');}
  publishDefinition(id:number):Observable<WorkflowEnvelope>{return this.mutate('/definitions/'+id+'/publish',{},'WF_DEFINITION_PUBLISHED');}
  grantRole(data:{userId:number;roleCode:string;enabled:boolean;validUntilUtc:string|null;reason:string}):Observable<WorkflowEnvelope>{return this.mutate('/role-grants',data,'WF_ROLE_GRANTED');}
  private mutate(path:string,data:object,code:string,id?:number,definitionVersion?:number):Observable<WorkflowEnvelope>{
    const idempotencyKey=this.intents.key(path,data);const payload=structuredClone({...data,idempotencyKey});
    return this.http.post<unknown>(this.base+path,payload).pipe(map(raw=>{
      const result=readWorkflowEnvelope(raw,code,idempotencyKey,id);
      if(definitionVersion!==undefined&&result.snapshot?.definitionVersion!==definitionVersion)throw new WorkflowContractError('La definición de la respuesta no coincide con la solicitud.');
      this.intents.confirmed(path,data,idempotencyKey);
      return result;
    }));
  }
}
@Injectable({providedIn:'root'})
export class EvidenceApiService{
  private readonly http=inject(HttpClient);private readonly intents=new IntentKeys();
  upload(file:File,snapshot:WorkflowSnapshot,fieldCode:string):Observable<EvidenceReceipt>{
    return from(file.arrayBuffer().then(async bytes=>{
      const digest=await crypto.subtle.digest('SHA-256',bytes);
      return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
    })).pipe(switchMap(sha256=>{
      const identity={sha256,fileName:file.name,size:file.size,expedienteId:snapshot.expedienteId,expectedVersion:snapshot.version,fieldCode};
      const idempotencyKey=this.intents.key('upload',identity);
      const body=new FormData();body.append('file',file,file.name);body.append('expedienteId',String(snapshot.expedienteId));
      body.append('fieldCode',fieldCode);body.append('expectedVersion',snapshot.version);body.append('idempotencyKey',idempotencyKey);
      return this.http.post<unknown>('/sst/evidence',body).pipe(map(raw=>{
        const v=asObject(raw),e=asObject(v['evidence']);
        if(v['succeeded']!==true||v['code']!=='EVIDENCE_STORED'||typeof v['requestId']!=='string'||v['requestId'].toLowerCase()!==idempotencyKey.toLowerCase()
          ||!isGuid(e['evidenceId'])||typeof e['sha256']!=='string'||e['sha256'].toLowerCase()!==sha256
          ||typeof e['fileName']!=='string'||!e['fileName']||e['size']!==file.size
          ||typeof e['contentType']!=='string'||!e['contentType']||e['stateCode']!=='UPLOADED')
          throw new WorkflowContractError('No se confirmó la evidencia persistida. Conserve el archivo y reintente.');
        this.intents.confirmed('upload',identity,idempotencyKey);
        return structuredClone(e) as unknown as EvidenceReceipt;
      }));
    }));
  }
  sign(signature:File,evidenceId:string,expectedVersion:string):Observable<string>{
    if(!isGuid(evidenceId))throw new WorkflowContractError('Seleccione una evidencia persistida.');
    return from(signature.arrayBuffer().then(async bytes=>{
      const digest=await crypto.subtle.digest('SHA-256',bytes);
      return Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
    })).pipe(switchMap(sha256=>{
      const identity={sha256,evidenceId,expectedVersion};
      const idempotencyKey=this.intents.key('signature',identity);
      const body=new FormData();body.append('signature',signature,signature.name);
      body.append('expectedVersion',expectedVersion);body.append('idempotencyKey',idempotencyKey);
      return this.http.post<unknown>('/sst/evidence/'+encodeURIComponent(evidenceId)+'/signatures',body).pipe(map(raw=>{
        const v=asObject(raw);
        if(v['succeeded']!==true||v['code']!=='SIGNATURE_VERIFIED'||typeof v['requestId']!=='string'
          ||v['requestId'].toLowerCase()!==idempotencyKey.toLowerCase()||!isGuid(v['signatureId']))
          throw new WorkflowContractError('El servidor no confirmó la firma del documento.');
        this.intents.confirmed('signature',identity,idempotencyKey);
        return v['signatureId'];
      }));
    }));
  }
  contentUrl(evidenceId:string):string{if(!isGuid(evidenceId))throw new WorkflowContractError('Evidencia inválida.');return'/sst/evidence/'+encodeURIComponent(evidenceId)+'/content';}
}
