import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {Observable,map} from 'rxjs';
import {IntentKeys,WorkflowContractError,asObject,isGuid,isSafeId} from './workflow-api.service';

export interface CommitteeMember{userId:number;nombre:string;roleCode:string;}
export interface CommitteeSessionType{typeCode:string;ruleVersion:number;label:string;minimumQuorum:number;requiredSignatures:number;workflowCaseCode:string;workflowSubtipo:string;workflowDefinitionVersion:number;signatureFieldCode:string;}
export interface CommitteeActa{idActa:number;numeroActa:string;tipoSesion:string;ruleVersion:number;fechaReunion:string;agendaPrincipal:string;acuerdoTomado:string;responsableUsuarioId:number;responsableNombre:string;quorumAsistentes:number;quorumRequerido:number;estado:string;version:string;asistentesUsuarioIds:number[];workflowExpedienteId?:number|null;createdAtUtc:string;documentUrl:string;signatureIds:string[];}
export interface CommitteeElection{idProceso:number;titulo:string;fechaInicio:string;fechaFin:string;estado:string;version:string;yaVotoUsuarioActual:boolean;candidatos:{idCandidato:number;usuarioId:number;nombre:string}[];totalVotos:number;}
export interface CommitteeEnvelope{succeeded:boolean;code:string;message:string;correlationId:string;requestId?:string|null;httpStatus:number;replayed:boolean;actas:CommitteeActa[];procesos:CommitteeElection[];members:CommitteeMember[];sessionTypes:CommitteeSessionType[];acta?:CommitteeActa|null;receipt?:{requestId:string;idProceso:number;acceptedAtUtc:string;alreadyRecorded:boolean}|null;evidenceIds:string[];}
function text(v:unknown):v is string{return typeof v==='string'&&!!v.trim();}
function array(raw:unknown,test:(v:Record<string,unknown>)=>boolean):void{if(!Array.isArray(raw)||raw.some(item=>{try{return !test(asObject(item));}catch{return true;}}))throw new WorkflowContractError('La lista del comité no coincide con el contrato.');}
function validActa(v:Record<string,unknown>):boolean{return isSafeId(v['idActa'])&&text(v['numeroActa'])&&text(v['tipoSesion'])&&isSafeId(v['ruleVersion'])&&text(v['fechaReunion'])&&text(v['agendaPrincipal'])&&text(v['acuerdoTomado'])&&isSafeId(v['responsableUsuarioId'])&&text(v['responsableNombre'])&&isSafeId(v['quorumAsistentes'])&&isSafeId(v['quorumRequerido'])&&text(v['estado'])&&text(v['version'])&&Array.isArray(v['asistentesUsuarioIds'])&&v['asistentesUsuarioIds'].every(isSafeId)&&(v['workflowExpedienteId']===null||v['workflowExpedienteId']===undefined||isSafeId(v['workflowExpedienteId']))&&text(v['createdAtUtc'])&&text(v['documentUrl'])&&Array.isArray(v['signatureIds'])&&v['signatureIds'].every(isGuid)&&new Set(v['signatureIds']).size===v['signatureIds'].length;}
function validElection(v:Record<string,unknown>):boolean{
 if(!isSafeId(v['idProceso'])||!text(v['titulo'])||!text(v['fechaInicio'])||!text(v['fechaFin'])||!text(v['estado'])||!text(v['version'])||typeof v['yaVotoUsuarioActual']!=='boolean'||typeof v['totalVotos']!=='number'||!Number.isSafeInteger(v['totalVotos'])||v['totalVotos']<0)return false;
 try{array(v['candidatos'],c=>isSafeId(c['idCandidato'])&&isSafeId(c['usuarioId'])&&text(c['nombre']));return true;}catch{return false;}
}
export function readCommitteeEnvelope(raw:unknown,code:string,requestId?:string):CommitteeEnvelope{
 const v=asObject(raw);
 if(v['succeeded']!==true||v['code']!==code||!text(v['message'])||!text(v['correlationId'])||typeof v['httpStatus']!=='number'||v['httpStatus']<200||v['httpStatus']>=300||typeof v['replayed']!=='boolean')
   throw new WorkflowContractError('El comité no confirmó la operación.');
 if(requestId&&(!isGuid(v['requestId'])||v['requestId'].toLowerCase()!==requestId.toLowerCase()))throw new WorkflowContractError('El recibo del comité corresponde a otra solicitud.');
 array(v['actas'],validActa);array(v['procesos'],validElection);
 array(v['members'],m=>isSafeId(m['userId'])&&text(m['nombre'])&&text(m['roleCode']));
 array(v['sessionTypes'],t=>text(t['typeCode'])&&isSafeId(t['ruleVersion'])&&text(t['label'])&&isSafeId(t['minimumQuorum'])&&typeof t['requiredSignatures']==='number'&&Number.isSafeInteger(t['requiredSignatures'])&&t['requiredSignatures']>=0&&text(t['workflowCaseCode'])&&text(t['workflowSubtipo'])&&isSafeId(t['workflowDefinitionVersion'])&&text(t['signatureFieldCode']));
 if(['ACTA_CREATED','ACTA_APPROVED'].includes(code)&&!validActa(asObject(v['acta'])))throw new WorkflowContractError('Falta el acta persistida.');
 if(code==='VOTE_RECORDED'){
  const r=asObject(v['receipt']);if(!isGuid(r['requestId'])||r['requestId'].toLowerCase()!==requestId?.toLowerCase()||!isSafeId(r['idProceso'])||!text(r['acceptedAtUtc'])||typeof r['alreadyRecorded']!=='boolean')throw new WorkflowContractError('No se confirmó el recibo del voto.');
 }
 if(!Array.isArray(v['evidenceIds'])||v['evidenceIds'].some(id=>!isGuid(id)))throw new WorkflowContractError('Referencias de evidencia inválidas.');
 return structuredClone(v) as unknown as CommitteeEnvelope;
}
@Injectable({providedIn:'root'})
export class CommitteeApiService{
 private readonly http=inject(HttpClient);private readonly intents=new IntentKeys();private readonly base='/sst/committee';
 actas():Observable<CommitteeEnvelope>{return this.get('/actas','ACTAS_READY');}
 elections():Observable<CommitteeEnvelope>{return this.get('/elections','ELECTIONS_READY');}
 members():Observable<CommitteeEnvelope>{return this.get('/members','COMMITTEE_MEMBERS_READY');}
 types():Observable<CommitteeEnvelope>{return this.get('/session-types','COMMITTEE_TYPES_READY');}
 document(id:number):Observable<Blob>{return this.http.get(this.base+'/actas/'+id+'/document',{responseType:'blob'});}
 createActa(data:Record<string,unknown>):Observable<CommitteeEnvelope>{return this.post('/actas',data,'ACTA_CREATED');}
 approve(acta:CommitteeActa,signatureIds:string[]):Observable<CommitteeEnvelope>{return this.post('/actas/'+acta.idActa+'/approve',{expectedVersion:acta.version,workflowExpedienteId:acta.workflowExpedienteId,signatureIds:[...signatureIds].sort()},'ACTA_APPROVED');}
 createElection(data:Record<string,unknown>):Observable<CommitteeEnvelope>{return this.post('/elections',data,'ELECTION_CREATED');}
 vote(process:CommitteeElection,candidateId:number):Observable<CommitteeEnvelope>{return this.post('/elections/'+process.idProceso+'/votes',{expectedVersion:process.version,idCandidato:candidateId},'VOTE_RECORDED');}
 saveMember(data:Record<string,unknown>):Observable<CommitteeEnvelope>{return this.post('/members',data,'COMMITTEE_MEMBER_SAVED');}
 saveType(data:Record<string,unknown>):Observable<CommitteeEnvelope>{return this.post('/session-types',data,'COMMITTEE_TYPE_SAVED');}
 private get(path:string,code:string):Observable<CommitteeEnvelope>{return this.http.get<unknown>(this.base+path).pipe(map(raw=>readCommitteeEnvelope(raw,code)));}
 private post(path:string,data:Record<string,unknown>,code:string):Observable<CommitteeEnvelope>{
  const idempotencyKey=this.intents.key(path,data);
  return this.http.post<unknown>(this.base+path,{...structuredClone(data),idempotencyKey}).pipe(map(raw=>{const result=readCommitteeEnvelope(raw,code,idempotencyKey);this.intents.confirmed(path,data,idempotencyKey);return result;}));
 }
}
