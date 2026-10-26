import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, map, of, tap, from, switchMap } from 'rxjs';

export interface CredentialAccount {readonly userId:number;readonly userName:string;readonly version:string;readonly credentialState:string;}
export interface AuthenticatedSession {
  readonly userId:number; readonly empresaId:number; readonly contratistaId:number|null;
  readonly userName:string; readonly usuarioNombre:string|null; readonly empresaNombre:string|null;
  readonly perfilNombre:string|null; readonly version:string; readonly permissions:readonly string[];
}
function record(value:unknown):Record<string,unknown> {
  if(value===null||typeof value!=='object'||Array.isArray(value)) throw new Error('Respuesta de sesión inválida.');
  return value as Record<string,unknown>;
}
function nullableText(value:unknown):value is string|null {return value===null||typeof value==='string';}
function parseSession(raw:unknown):AuthenticatedSession {
  const s=record(raw);
  if(!Number.isSafeInteger(s['userId'])||Number(s['userId'])<=0||!Number.isSafeInteger(s['empresaId'])||Number(s['empresaId'])<=0
    || !(s['contratistaId']===null||(Number.isSafeInteger(s['contratistaId'])&&Number(s['contratistaId'])>0))
    ||typeof s['userName']!=='string'||!s['userName'].trim()||typeof s['version']!=='string'||!s['version']
    ||!nullableText(s['usuarioNombre'])||!nullableText(s['empresaNombre'])||!nullableText(s['perfilNombre'])
    ||!Array.isArray(s['permissions'])||s['permissions'].some(v=>typeof v!=='string'))
    throw new Error('El servidor no confirmó un contexto autorizado válido.');
  return Object.freeze({userId:Number(s['userId']),empresaId:Number(s['empresaId']),contratistaId:s['contratistaId']===null?null:Number(s['contratistaId']),
    userName:s['userName'],usuarioNombre:s['usuarioNombre'],empresaNombre:s['empresaNombre'],perfilNombre:s['perfilNombre'],
    version:s['version'],permissions:Object.freeze([...s['permissions']] as string[])});
}
@Injectable({providedIn:'root'})
export class GosstSessionService {
  private readonly http=inject(HttpClient);
  readonly snapshot=signal<AuthenticatedSession|null>(null);
  readonly empresaNombre=signal('');
  readonly usuarioNombre=signal('');
  readonly perfilNombre=signal('');
  readonly nombrePerfil=signal('');
  readonly autenticado=signal(false);
  readonly csrfToken=signal<string|null>(null);
  readonly errorContexto=signal('');
  private apply(raw:unknown,codes:readonly string[],requireCsrf=true):void {
    const v=record(raw);
    if(v['succeeded']!==true||typeof v['code']!=='string'||!codes.includes(v['code'])||(requireCsrf&&(typeof v['csrfToken']!=='string'||!v['csrfToken'])))
      throw new Error(typeof v['message']==='string'?v['message']:'No se confirmó la sesión.');
    this.csrfToken.set(typeof v['csrfToken']==='string'?v['csrfToken']:null);
    const session=v['session']===null?null:parseSession(v['session']);
    if(v['code']==='SESSION_ANONYMOUS'&&session!==null) throw new Error('Sesión incoherente.');
    if(v['code']!=='SESSION_ANONYMOUS'&&session===null) throw new Error('Falta el contexto autorizado.');
    this.snapshot.set(session);this.autenticado.set(session!==null);
    this.empresaNombre.set(session?.empresaNombre??'');this.usuarioNombre.set(session?.usuarioNombre??session?.userName??'');
    this.perfilNombre.set(session?.perfilNombre??'');this.nombrePerfil.set(session?.perfilNombre??'');this.errorContexto.set('');
  }
  refresh():Promise<void> {
    return firstValueFrom(this.http.get<unknown>('/sst/security/session',{withCredentials:true}).pipe(
      map(raw=>this.apply(raw,['SESSION_CONFIRMED','SESSION_ANONYMOUS'])),
      catchError((error:unknown)=>{this.removeAllSession();this.errorContexto.set('No se pudo recuperar una sesión autorizada.');return of(undefined);})
    ));
  }
  login(userName:string,password:string):Observable<void> {
    return (this.csrfToken()?of(undefined):from(this.refresh())).pipe(
      switchMap(()=>{if(!this.csrfToken())throw new Error('No se pudo iniciar una sesion protegida.');return this.http.post<unknown>('/sst/security/login',{userName,password},{withCredentials:true});}),
      map(raw=>this.apply(raw,['LOGIN_SUCCEEDED'],false)),
      switchMap(()=>from(this.refresh())),
      map(()=>{if(!this.snapshot()||!this.csrfToken())throw new Error('No se confirmó el contexto de sesión.');})
    );
  }
  changePassword(currentPassword:string,newPassword:string,confirmation:string):Observable<void> {
    const session=this.snapshot();if(!session) throw new Error('Inicie sesión para continuar.');
    return this.http.post<unknown>('/sst/security/password',{currentPassword,newPassword,confirmation,expectedVersion:session.version},{withCredentials:true}).pipe(
      map(raw=>{const v=record(raw);if(v['succeeded']!==true||v['code']!=='PASSWORD_CHANGED') throw new Error(typeof v['message']==='string'?v['message']:'No se confirmó el cambio de contraseña.');}),
      tap(()=>{this.removeAllSession();this.csrfToken.set(null);})
    );
  }
  logout():Observable<void> {
    return this.http.post<unknown>('/sst/security/logout',{}, {withCredentials:true}).pipe(map(raw=>{
      const v=record(raw);if(v['succeeded']!==true||v['code']!=='LOGGED_OUT') throw new Error('No se confirmó el cierre de sesión.');
      this.removeAllSession();
    }));
  }
  account(userId:number):Observable<CredentialAccount>{
    return this.http.get<unknown>('/sst/security/accounts/'+userId).pipe(map(raw=>this.readAccount(raw,'ACCOUNT_CONFIRMED',userId)));
  }
  provision(account:CredentialAccount,password:string,confirmation:string):Observable<CredentialAccount>{
    return this.http.post<unknown>('/sst/security/provision',{userId:account.userId,expectedVersion:account.version,password,confirmation}).pipe(
      map(raw=>this.readAccount(raw,'CREDENTIAL_PROVISIONED',account.userId))
    );
  }
  private readAccount(raw:unknown,code:string,userId:number):CredentialAccount{
    const v=record(raw),account=record(v['account']);
    if(v['succeeded']!==true||v['code']!==code||account['userId']!==userId||typeof account['userName']!=='string'
      ||!account['userName']||typeof account['version']!=='string'||!account['version']||typeof account['credentialState']!=='string')
      throw new Error('El servidor no confirmó la cuenta seleccionada.');
    return{userId,userName:account['userName'],version:account['version'],credentialState:account['credentialState']};
  }
  // Compatibilidad de lectura: solo contexto devuelto por servidor; sessionStorage no es autoridad.
  getSession(key:string):string|null {
    const s=this.snapshot();if(!s)return null;
    const values:Record<string,string|null>={gestopcompanyid:String(s.empresaId),gestopcompanyname:s.empresaNombre,
      gestopusername:s.usuarioNombre??s.userName,perfilNombre:s.perfilNombre,contratistaGosstId:s.contratistaId===null?null:String(s.contratistaId)};
    return values[key]??null;
  }
  createSession(_key:string,_value:unknown):void {throw new Error('El contexto de sesión solo puede actualizarse desde una respuesta autenticada.');}
  guardarSesionLogin(raw:Record<string,unknown>):void {this.apply(raw,['LOGIN_SUCCEEDED']);}
  removeAllSession():void {
    this.snapshot.set(null);this.csrfToken.set(null);this.autenticado.set(false);this.empresaNombre.set('');this.usuarioNombre.set('');
    this.perfilNombre.set('');this.nombrePerfil.set('');
  }
}
