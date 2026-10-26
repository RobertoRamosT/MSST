import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError, Subject, finalize } from 'rxjs';
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
export interface QueryPageState{
 route:string;label:string;pageSize:number;maximumPageSize:number;returned:number;hasMore:boolean;nextCursor:string|null;
 cursor:string|null;history:(string|null)[];index:number;search:string;loading:boolean;
}
@Injectable({providedIn:'root'})
export class GosstApiService {
  private readonly http=inject(HttpClient);
  private readonly session=inject(GosstSessionService);
  private readonly intents=new IntentKeys();
  readonly pages=signal<Record<string,QueryPageState>>({});
  readonly pageChanges=new Subject<string>();
  private querySequence=new Map<string,number>();
  private pagingIdentity='';
  private queryCounter=0;
  pageEntries(routes:readonly string[]):QueryPageState[]{return routes.flatMap(route=>this.pages()[route]?[this.pages()[route]]:[]);}
  private changePage(route:string,update:(state:QueryPageState)=>QueryPageState):void{
    const state=this.pages()[route];if(!state||state.loading)return;
    this.pages.update(all=>({...all,[route]:update(state)}));this.pageChanges.next(route);
  }
  nextPage(route:string):void{this.changePage(route,s=>s.hasMore&&s.nextCursor?{...s,cursor:s.nextCursor,history:[...s.history,s.cursor],index:s.index+1}:s);}
  previousPage(route:string):void{this.changePage(route,s=>s.history.length?{...s,cursor:s.history.at(-1)??null,history:s.history.slice(0,-1),index:s.index-1}:s);}
  searchPage(route:string,search:string):void{this.changePage(route,s=>({...s,search:search.trim(),cursor:null,history:[],index:1}));}
  resizePage(route:string,size:number):void{const s=this.pages()[route];if(!s||!Number.isSafeInteger(size)||size<1||size>s.maximumPageSize)return;this.changePage(route,s=>({...s,pageSize:size,cursor:null,history:[],index:1}));}
  private prepareQuery(route:string,payload:Record<string,any>):number{
    const actor=this.session.snapshot();const identity=String(actor?.userId??'')+'/'+String(actor?.empresaId??'')+'/'+String(actor?.contratistaId??'');
    if(identity!==this.pagingIdentity){this.pages.set({});this.querySequence.clear();this.pagingIdentity=identity;}
    const state=this.pages()[route];
    if(state){payload['pageSize']=state.pageSize;payload['cursor']=state.cursor;payload['search']=state.search;this.pages.update(all=>({...all,[route]:{...state,loading:true}}));}
    const sequence=++this.queryCounter;this.querySequence.set(route,sequence);return sequence;
  }
  private acceptQuery(route:string,response:Record<string,any>,sequence:number):void{
    if(this.querySequence.get(route)!==sequence)throw new FunctionalApiError('QUERY_REPLACED','La consulta fue reemplazada por una selección más reciente.');
    if(response['page']===undefined||response['page']===null)return;
    const p=asObject(response['page']);
    if(response['contractVersion']!==3||!Number.isSafeInteger(p['pageSize'])||Number(p['pageSize'])<1
      ||!Number.isSafeInteger(p['maximumPageSize'])||Number(p['maximumPageSize'])<Number(p['pageSize'])
      ||!Number.isSafeInteger(p['returned'])||Number(p['returned'])<0||Number(p['returned'])>Number(p['pageSize'])
      ||typeof p['hasMore']!=='boolean'||!(p['nextCursor']===null||typeof p['nextCursor']==='string')
      ||p['hasMore']!==(typeof p['nextCursor']==='string'&&!!p['nextCursor'])
      ||p['sort']!=='id:asc'||typeof p['label']!=='string'||!p['label']
      ||!Array.isArray(response['list'])||response['list'].length!==p['returned'])
      throw new FunctionalApiError('PAGE_INVALID','El servidor no confirmó una página válida.');
    const before=this.pages()[route];
    this.pages.update(all=>({...all,[route]:{route,label:p['label'] as string,pageSize:Number(p['pageSize']),maximumPageSize:Number(p['maximumPageSize']),
     returned:Number(p['returned']),hasMore:p['hasMore'] as boolean,nextCursor:p['nextCursor'] as string|null,
     cursor:before?.cursor??null,history:before?.history??[],index:before?.index??1,search:before?.search??'',loading:false}}));
  }

  login(payload:{userName:string;password:string}):Observable<void>{return this.session.login(payload.userName,payload.password);}
  getEmpresaById(idCompany?:number):Observable<Record<string,any>>{return this.callAjaxPost('/empresa/id',idCompany?{idCompany}:{});}
  getEmpresaMensaje(idCompany?:number):Observable<Record<string,any>>{return this.callAjaxPost('/empresa/mensaje',idCompany?{idCompany}:{});}
  callAjaxPost<T=Record<string,any>>(relativeRoute:string,dataParam:Record<string,any>={}):Observable<T>{
    const route=relativeRoute.startsWith('/')?relativeRoute:'/'+relativeRoute;
    // El ámbito/actor lo resuelve el servidor autenticado; no reenviar las constantes legadas.
    const payload={...dataParam};
    for(const name of ['idEmpresa','empresaId','idCompany','idContratista','contratistaId','usuario','rolAprobador'])delete payload[name];
    const mutating=/(?:^|\/)(?:insert|save|update|delete|remove|votar|register|registrar|enviar)/i.test(route);
    let intentData:Record<string,unknown>={};
    if(mutating){
      if(payload['idempotencyKey']!==undefined&&!isGuid(payload['idempotencyKey']))throw new FunctionalApiError('REQUEST_INVALID','Identificador de solicitud no valido.');
      if(!payload['expectedVersion']&&typeof payload['version']==='string')payload['expectedVersion']=payload['version'];
      delete payload['version'];
      intentData={...payload};delete intentData['idempotencyKey'];
      payload['idempotencyKey']??=this.intents.key(route,intentData);
      if(/(?:^|\/)(?:update|delete|remove)/i.test(route)&&!isRowVersion(payload['expectedVersion']))return throwError(()=>new FunctionalApiError('VERSION_REQUIRED','Consulte nuevamente el registro antes de modificarlo o eliminarlo.'));
    }
    const sequence=mutating?0:this.prepareQuery(route,payload);
    return this.http.post<unknown>('/sst'+route,payload,{withCredentials:true,headers:mutating?{}:{'X-Msst-List-Contract':'3'}}).pipe(map(raw=>{
      const confirmed=validateLegacyResponse(raw);
      if(mutating){
        if(confirmed['CODE_RESPONSE']!=='05'||confirmed['STATUS_CODE']!=='01')throw new FunctionalApiError('RECEIPT_INVALID','La escritura no se confirmó en la base de datos.');
        if(typeof confirmed['requestId']!=='string'||confirmed['requestId'].toLowerCase()!==String(payload['idempotencyKey']).toLowerCase())throw new FunctionalApiError('RECEIPT_INVALID','El recibo corresponde a otra solicitud.');
        const snapshot=asObject(confirmed['snapshot']);
        if(!isRowVersion(snapshot['version']))throw new FunctionalApiError('RECEIPT_INVALID','Falta la versión persistida de la operación.');
        const record=asObject(snapshot['record']);
        if(!isSafeId(record['id'])||record['version']!==snapshot['version'])throw new FunctionalApiError('RECEIPT_INVALID','Falta el identificador persistido.');
        this.intents.confirmed(route,intentData,String(payload['idempotencyKey']));
      }
      if(!mutating)this.acceptQuery(route,confirmed,sequence);
      return confirmed as T;
    }),finalize(()=>{const page=this.pages()[route];if(page&&!mutating&&this.querySequence.get(route)===sequence)this.pages.update(all=>({...all,[route]:{...page,loading:false}}));}));
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
