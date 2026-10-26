import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {Observable,map} from 'rxjs';
import {IntentKeys,WorkflowContractError,asObject,isGuid,isSafeId} from './workflow-api.service';
export interface ProfilePermission{code:string;label:string;enabled:boolean;}
export interface ProfilePermissionSnapshot{profileId:number;version:string;permissions:ProfilePermission[];}
export function readProfilePermissions(raw:unknown,profileId:number,code:string,requestId?:string):ProfilePermissionSnapshot{
 const v=asObject(raw);
 if(v['succeeded']!==true||v['code']!==code||v['profileId']!==profileId||typeof v['version']!=='string'||!v['version']
   ||!Array.isArray(v['permissions']))throw new WorkflowContractError('No se confirmó la matriz del perfil seleccionado.');
 if(requestId&&(!isGuid(v['requestId'])||v['requestId'].toLowerCase()!==requestId.toLowerCase()))throw new WorkflowContractError('El recibo de permisos pertenece a otra solicitud.');
 const permissions=v['permissions'].map(rawPermission=>{
  const p=asObject(rawPermission);if(typeof p['code']!=='string'||!p['code'].trim()||typeof p['label']!=='string'||!p['label'].trim()||typeof p['enabled']!=='boolean')throw new WorkflowContractError('El catálogo de permisos contiene datos inválidos.');
  return{code:p['code'],label:p['label'],enabled:p['enabled']};
 });
 if(new Set(permissions.map(p=>p.code)).size!==permissions.length)throw new WorkflowContractError('El catálogo contiene permisos duplicados.');
 return{profileId,version:v['version'],permissions};
}
@Injectable({providedIn:'root'})
export class SecurityProfilesService{
 private readonly http=inject(HttpClient);private readonly intents=new IntentKeys();
 load(profileId:number):Observable<ProfilePermissionSnapshot>{
  if(!isSafeId(profileId))throw new WorkflowContractError('Seleccione un perfil válido.');
  return this.http.get<unknown>('/sst/security/profiles/'+profileId+'/permissions').pipe(map(raw=>readProfilePermissions(raw,profileId,'PROFILE_PERMISSIONS_READY')));
 }
 save(profileId:number,expectedVersion:string,permissions:readonly ProfilePermission[]):Observable<ProfilePermissionSnapshot>{
  const values=permissions.map(p=>({code:p.code,enabled:p.enabled})).sort((a,b)=>a.code.localeCompare(b.code));
  const data={expectedVersion,permissions:values},idempotencyKey=this.intents.key('profile-permissions:'+profileId,data);
  return this.http.put<unknown>('/sst/security/profiles/'+profileId+'/permissions',{...data,idempotencyKey}).pipe(map(raw=>{const result=readProfilePermissions(raw,profileId,'PROFILE_PERMISSIONS_SAVED',idempotencyKey);this.intents.confirmed('profile-permissions:'+profileId,data,idempotencyKey);return result;}));
 }
}
