import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { IntentKeys, isGuid, isSafeId, asObject } from './workflow-api.service';
import { GosstSessionService } from './gosst-session.service';

function isRowVersion(value:unknown):value is string{try{return typeof value==='string'&&atob(value).length===8&&btoa(atob(value))===value;}catch{return false;}}
export class FunctionalApiError extends Error {
  constructor(readonly code:string,message:string){super(message);this.name='FunctionalApiError';}
}
export function apiErrorMessage(error:unknown):string {
  if(error instanceof FunctionalApiError)return error.message;
  if(error instanceof HttpErrorResponse&&error.error!==null&&typeof error.error==='object'&&!Array.isArray(error.error)){
    const v=error.error as Record<string,unknown>;
    for(const key of ['message','mensajeRespuesta'])if(typeof v[key]==='string'&&v[key].trim())return v[key];
  }
  return error instanceof Error?error.message:'No se confirmó el resultado. Sus datos se conservan.';
}
export function validateLegacyResponse(raw:unknown):Record<string,any> {
  if(raw===null||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length===0)
    throw new FunctionalApiError('RESPONSE_INVALID','El servidor no confirmó una respuesta válida.');
  const v=raw as Record<string,unknown>;
  if('CodeResponse'in v||'codeResponse'in v||'MensajeRespuesta'in v)throw new FunctionalApiError('RESPONSE_INVALID','La respuesta no respeta los nombres del contrato.');
  if('succeeded'in v&&v['succeeded']!==true)throw new FunctionalApiError(String(v['code']??'OPERATION_REJECTED'),String(v['message']??'La operación fue rechazada.'));
  if(!('CODE_RESPONSE'in v))throw new FunctionalApiError('RESPONSE_INVALID','La respuesta no contiene el resultado de la operación.');
  if('CODE_RESPONSE'in v){
    if(typeof v['CODE_RESPONSE']!=='string'||!['01','05'].includes(v['CODE_RESPONSE'])
      ||('STATUS_CODE'in v&&v['STATUS_CODE']!=='01'))
      throw new FunctionalApiError(String(v['CODE_RESPONSE']??'RESPONSE_INVALID'),typeof v['mensajeRespuesta']==='string'?v['mensajeRespuesta']:'La operación no se confirmó.');
  }
  return v;
}
@Injectable({providedIn:'root'})
export class GosstApiService {
  private readonly http=inject(HttpClient);
  private readonly session=inject(GosstSessionService);
  private readonly intents=new IntentKeys();
  login(payload:{userName:string;password:string}):Observable<void>{return this.session.login(payload.userName,payload.password);}
  getEmpresaById(idCompany?:number):Observable<Record<string,any>>{return this.callAjaxPost('/empresa/id',idCompany?{idCompany}:{});}
  getEmpresaMensaje(idCompany?:number):Observable<Record<string,any>>{return this.callAjaxPost('/empresa/mensaje',idCompany?{idCompany}:{});}
  callAjaxPost<T=Record<string,any>>(relativeRoute:string,dataParam:Record<string,any>={}):Observable<T>{
    const route=relativeRoute.startsWith('/')?relativeRoute:'/'+relativeRoute;
    // El ámbito/actor lo resuelve el servidor autenticado; no reenviar las constantes legadas.
    const payload={...dataParam};
    for(const name of ['idEmpresa','empresaId','idCompany','idContratista','contratistaId','usuario','rolAprobador'])delete payload[name];
    const mutating=/(?:^|\/)(?:insert|save|update|delete|remove|votar|register|registrar|enviar)/i.test(route);
    if(mutating){
      if(payload['idempotencyKey']!==undefined&&!isGuid(payload['idempotencyKey']))throw new FunctionalApiError('REQUEST_INVALID','Identificador de solicitud no valido.');
      payload['idempotencyKey']??=this.intents.key(route,payload);
      if(!payload['expectedVersion']&&typeof payload['version']==='string')payload['expectedVersion']=payload['version'];
      delete payload['version'];
      if(/(?:^|\/)(?:update|delete|remove)/i.test(route)&&!isRowVersion(payload['expectedVersion']))return throwError(()=>new FunctionalApiError('VERSION_REQUIRED','Consulte nuevamente el registro antes de modificarlo o eliminarlo.'));
    }
    return this.http.post<unknown>('/sst'+route,payload,{withCredentials:true}).pipe(map(raw=>{
      const confirmed=validateLegacyResponse(raw);
      if(mutating){
        if(confirmed['CODE_RESPONSE']!=='05'||confirmed['STATUS_CODE']!=='01')throw new FunctionalApiError('RECEIPT_INVALID','La escritura no se confirmó en la base de datos.');
        if(typeof confirmed['requestId']!=='string'||confirmed['requestId'].toLowerCase()!==String(payload['idempotencyKey']).toLowerCase())throw new FunctionalApiError('RECEIPT_INVALID','El recibo corresponde a otra solicitud.');
        const snapshot=asObject(confirmed['snapshot']);
        if(!isRowVersion(snapshot['version']))throw new FunctionalApiError('RECEIPT_INVALID','Falta la versión persistida de la operación.');
        const record=asObject(snapshot['record']);
        if(!isSafeId(record['id'])||record['version']!==snapshot['version'])throw new FunctionalApiError('RECEIPT_INVALID','Falta el identificador persistido.');
      }
      return confirmed as T;
    }));
  }
}

export interface RowField {name:string;kind:'string'|'number'|'boolean'|'array';optional?:boolean;nullable?:boolean;}
export function confirmedList<T>(raw:unknown,fields:readonly RowField[]=[]):T[]{
  const response=validateLegacyResponse(raw),list=response['list'];
  if(!Array.isArray(list))throw new FunctionalApiError('LIST_INVALID','No se confirmó la lista del servidor.');
  return list.map(item=>{
    const row=asObject(item);
    if(!isSafeId(row['id'])||!isRowVersion(row['version']))throw new FunctionalApiError('ROW_INVALID','La lista contiene un identificador inválido.');
    for(const field of fields){
      const value=row[field.name];if((field.optional&&value===undefined)||(field.nullable&&value===null))continue;
      if(field.kind==='array'?!Array.isArray(value):typeof value!==field.kind)
        throw new FunctionalApiError('ROW_INVALID','El servidor no confirmó el campo '+field.name+'.');
      if(field.kind==='number'&&!Number.isFinite(value))throw new FunctionalApiError('ROW_INVALID','Valor numérico inválido.');
    }
    return structuredClone(row) as T;
  });
}
export function confirmedRecord(raw:unknown):Record<string,unknown>{
  return asObject(asObject(validateLegacyResponse(raw)['snapshot'])['record']);
}
