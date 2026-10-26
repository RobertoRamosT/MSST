import '@angular/compiler';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createEnvironmentInjector,runInInjectionContext} from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpHeaders,HttpRequest,HttpResponse} from '@angular/common/http';
import {ActivatedRoute,Router} from '@angular/router';
import {firstValueFrom,of,throwError,Subject,Observable} from 'rxjs';
import {WorkflowApiService,EvidenceApiService,WorkflowSnapshot,WorkflowTransition,WorkflowContractError,
 readWorkflowEnvelope,readWorkflowSnapshot,workflowFailure} from './workflow-api.service';
import {GosstApiService,validateLegacyResponse,confirmedList} from './gosst-api.service';
import {readProfilePermissions} from './security-profiles.service';
import {readCommitteeEnvelope,CommitteeApiService} from './committee-api.service';
import {GosstSessionService} from './gosst-session.service';
import {AccessApiService,readAccessPolicy,AccessPolicyDraft} from './access-api.service';
import {gosstAuthInterceptor} from '../interceptors/gosst-auth.interceptor';
import {WorkflowInteractivoComponent} from '../../features/workflow/workflow-interactivo.component';

const action:WorkflowTransition={actionCode:'NEXT_TEST',label:'Continuar',fromStageCode:'STAGE_A',fromStateCode:'STATE_A',
 toStageCode:'STAGE_B',toStateCode:'STATE_B',requiredRoles:['ROLE_TEST'],requiresVerifiedRequirements:true,requiresComment:true,isFinal:false,effectCode:null,effectValue:null};
const initial:WorkflowSnapshot={expedienteId:42,codigoExpediente:'QA-42',codigoCaso:'CASE_TEST',subtipo:'TYPE_TEST',
 definitionVersion:3,titulo:'Fixture sintético',subject:{subjectType:'PERSONA',subjectId:8,label:'Sujeto de prueba'},
 stageCode:'STAGE_A',etapaActual:1,totalEtapas:2,estadoGeneral:'STATE_A',cumplimientoPorc:0,version:'AAAAAAAAAAE=',
 fechaUltimoMovimiento:'2026-10-25T08:00:00+00:00',allowedActions:['NEXT_TEST'],actions:[action],
 requirements:[{requirementCode:'REQ_TEST',title:'Requisito',stageCode:'STAGE_A',mandatory:true,verificationKind:'DOCUMENT',
 evidenceRequired:true,verifierRoles:['ROLE_TEST'],status:'PENDING',message:'Pendiente',evidenceIds:[],declaredValue:null,requiresValidityEnd:true,maxValidityHours:24}],history:[]};
const updated:WorkflowSnapshot={...structuredClone(initial),version:'AAAAAAAAAAI=',etapaActual:2,stageCode:'STAGE_B',
 estadoGeneral:'STATE_B',cumplimientoPorc:100,requirements:[{...initial.requirements[0],status:'APPROVED',declaredValue:'dato persistido'}]};
function envelope(code:string,snapshot?:WorkflowSnapshot,requestId?:string){
 return{succeeded:true,code,message:'Confirmado.',correlationId:'qa-only',requestId:requestId??null,replayed:false,httpStatus:200,
 snapshot:snapshot??null,cases:[],expedientes:[],subjects:[],definition:null,validationErrors:[],total:0};
}
type Plan=(url:string,body:Record<string,unknown>)=>Observable<unknown>;
function screen(plan:Plan){
 const captured:{url:string;body:Record<string,unknown>}[]=[];
 const http={post:(url:string,body:Record<string,unknown>)=>{captured.push({url,body});return plan(url,body);},
 get:()=>of(envelope('WF_DETAIL_READY',updated))};
 const injector=createEnvironmentInjector([{provide:HttpClient,useValue:http},{provide:WorkflowApiService,useFactory:()=>new WorkflowApiService()},
 {provide:EvidenceApiService,useFactory:()=>new EvidenceApiService()},{provide:GosstApiService,useValue:{}},{provide:GosstSessionService,useValue:{}},
 {provide:Router,useValue:{navigate:()=>Promise.resolve(true)}},{provide:ActivatedRoute,useValue:{snapshot:{queryParamMap:{get:()=>null}}}}],null as never);
 Object.defineProperty(globalThis,'location',{value:new URL('https://qa.invalid/#/workflow'),configurable:true});
 const component=runInInjectionContext(injector,()=>new WorkflowInteractivoComponent());
 component.current.set(structuredClone(initial));component.action.set(action);component.actionOpen.set(true);
 component.comment='comentario conservado';component.values={REQ_TEST:'valor conservado'};
 return{component,captured,destroy:()=>injector.destroy()};
}
function preserved(s:ReturnType<typeof screen>){
 assert.equal(s.component.actionOpen(),true);assert.equal(s.component.busy(),false);
 assert.equal(s.component.current()?.version,initial.version);assert.equal(s.component.comment,'comentario conservado');
 assert.equal(s.component.values['REQ_TEST'],'valor conservado');
}
test('legado: HTTP200 vacío y casing PascalCase no confirman',()=>{
 assert.throws(()=>validateLegacyResponse({}));assert.throws(()=>validateLegacyResponse({CodeResponse:'25',MensajeRespuesta:'Pendiente'}));
});
test('legado: CODE_RESPONSE25 conserva el mensaje funcional',()=>{
 assert.throws(()=>validateLegacyResponse({CODE_RESPONSE:'25',STATUS_CODE:'00',mensajeRespuesta:'Documento pendiente.'}),/Documento pendiente/);
});
test('legado: una lista vacía real se acepta, un ID fabricado o inseguro no',()=>{
 assert.deepEqual(confirmedList({CODE_RESPONSE:'05',STATUS_CODE:'01',list:[]}),[]);
 assert.throws(()=>confirmedList({list:[{id:Number.MAX_SAFE_INTEGER+1}]}));
});
test('snapshot: IDs seguros, códigos exactos y tipos reales',()=>{
 assert.equal(readWorkflowSnapshot(initial).expedienteId,42);
 assert.throws(()=>readWorkflowSnapshot({...initial,expedienteId:Number.MAX_SAFE_INTEGER+1}));
 assert.throws(()=>readWorkflowSnapshot({...initial,cumplimientoPorc:101}));
 assert.throws(()=>readWorkflowSnapshot({...initial,version:'falsa'}));
});
test('respuesta: requestId, expediente y código de éxito deben coincidir',()=>{
 const key='11111111-1111-4111-8111-111111111111';
 assert.throws(()=>readWorkflowEnvelope(envelope('WF_ACTION_CONFIRMED',updated,'22222222-2222-4222-8222-222222222222'),'WF_ACTION_CONFIRMED',key,42));
 assert.throws(()=>readWorkflowEnvelope(envelope('WF_ACTION_CONFIRMED',{...updated,expedienteId:43},key),'WF_ACTION_CONFIRMED',key,42));
 assert.throws(()=>readWorkflowEnvelope(envelope('WF_REQUIREMENTS_PENDING',updated,key),'WF_ACTION_CONFIRMED',key,42));
});
test('acción: vacío no cambia UI ni cierra modal',()=>{
 const s=screen(()=>of({}));s.component.execute();preserved(s);s.destroy();
});
test('acción: rechazo funcional HTTP200 conserva mensaje y formulario',()=>{
 const s=screen(()=>of({...envelope('WF_REQUIREMENTS_PENDING'),succeeded:false,message:'Complete el requisito.',
 validationErrors:[{requirementCode:'REQ_TEST',code:'PENDING',message:'Falta evidencia vigente.'}]}));
 s.component.execute();preserved(s);assert.match(s.component.dialogError(),/Complete el requisito/);assert.equal(s.component.violations().length,1);s.destroy();
});
test('acción: HTTP422 real conserva validaciones y formulario',()=>{
 const s=screen(()=>throwError(()=>new HttpErrorResponse({status:422,error:{succeeded:false,code:'WF_VALIDITY_REQUIRED',
 message:'Indique vigencia.',correlationId:'qa-422',validationErrors:[{requirementCode:'REQ_TEST',code:'VALIDITY_REQUIRED',message:'Indique vigencia.'}]}})));
 s.component.execute();preserved(s);assert.match(s.component.dialogError(),/Indique vigencia/);s.destroy();
});
test('acción: succeeded=true con código de error no confirma',()=>{
 const s=screen((_url,body)=>of(envelope('WF_REQUIREMENTS_PENDING',updated,String(body['idempotencyKey']))));
 s.component.execute();preserved(s);s.destroy();
});
test('acción: solo snapshot confirmado actualiza y recupera declaredValue',()=>{
 const s=screen((_url,body)=>of(envelope('WF_ACTION_CONFIRMED',updated,String(body['idempotencyKey']))));
 s.component.execute();assert.equal(s.component.actionOpen(),false);assert.equal(s.component.current()?.version,updated.version);
 assert.equal(s.component.values['REQ_TEST'],'dato persistido');s.destroy();
});
test('acción: reintento idéntico después de503 retiene clave',()=>{
 const s=screen(()=>throwError(()=>new HttpErrorResponse({status:503})));
 s.component.execute();s.component.execute();preserved(s);
 assert.equal(s.captured.length,2);assert.equal(s.captured[0].body['idempotencyKey'],s.captured[1].body['idempotencyKey']);s.destroy();
});
test('acción: edición del contenido crea una intención distinta',()=>{
 const s=screen(()=>throwError(()=>new HttpErrorResponse({status:503})));
 s.component.execute();s.component.comment='comentario editado';s.component.execute();
 assert.notEqual(s.captured[0].body['idempotencyKey'],s.captured[1].body['idempotencyKey']);s.destroy();
});
test('acción: doble clic durante solicitud no duplica POST',()=>{
 const pending=new Subject<unknown>();const s=screen(()=>pending as never);
 s.component.execute();s.component.execute();assert.equal(s.captured.length,1);
 pending.error(new HttpErrorResponse({status:503}));preserved(s);s.destroy();
});
test('acción: no envía autoridad, estado, etapa ni porcentaje',()=>{
 const s=screen(()=>throwError(()=>new HttpErrorResponse({status:503})));s.component.execute();
 const keys=Object.keys(s.captured[0].body).sort();
 assert.deepEqual(keys,['idempotencyKey','expectedVersion','definitionVersion','actionCode','values','evidenceIds','comment'].sort());s.destroy();
});
test('acción: evidencia GUID y allowedActions son obligatorios',()=>{
 const s=screen(()=>of({}));s.component.current.set({...initial,allowedActions:[],actions:[]});
 s.component.execute();assert.equal(s.captured.length,0);preserved(s);s.destroy();
});
test('mensaje: HTTP422 malformado o con código de éxito no muestra éxito',()=>{
 const failure=workflowFailure(new HttpErrorResponse({status:422,error:{succeeded:true,code:'WF_ACTION_CONFIRMED',message:'Aprobado'}}));
 assert.doesNotMatch(failure.message,/Aprobado/);
});
test('archivo: se envían bytes, versión, campo estable y GUID de intención',async()=>{
 let form:FormData|undefined;let calls=0;const file=new File(['contenido real'],'evidencia.txt',{type:'text/plain'});
 const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(v=>v.toString(16).padStart(2,'0')).join('');
 const injector=createEnvironmentInjector([{provide:HttpClient,useValue:{post:(_url:string,body:FormData)=>{form=body;calls++;return of({succeeded:true,code:'EVIDENCE_STORED',requestId:body.get('idempotencyKey'),
 evidence:{evidenceId:'11111111-1111-4111-8111-111111111111',sha256:sha,fileName:file.name,size:file.size,contentType:file.type,stateCode:'UPLOADED'}});}}}],null as never);
 const service=runInInjectionContext(injector,()=>new EvidenceApiService());
 const receipt=await firstValueFrom(service.upload(file,initial,'REQ_TEST'));
 assert.equal(calls,1);assert.equal((form!.get('file') as File).size,file.size);assert.equal(form!.get('expectedVersion'),initial.version);
 assert.equal(form!.get('fieldCode'),'REQ_TEST');assert.equal(receipt.evidenceId,'11111111-1111-4111-8111-111111111111');injector.destroy();
});
test('interceptor: FormData sin Content-Type manual y con CSRF',async()=>{
 let request:HttpRequest<unknown>|undefined;const session={csrfToken:()=> 'token-qa',removeAllSession:()=>{}};
 const injector=createEnvironmentInjector([{provide:GosstSessionService,useValue:session},{provide:Router,useValue:{navigate:()=>Promise.resolve(true)}}],null as never);
 const body=new FormData();body.append('file',new File(['bytes'],'file.txt'));
 const response=runInInjectionContext(injector,()=>gosstAuthInterceptor(new HttpRequest('POST','/sst/evidence',body,{headers:new HttpHeaders({'Content-Type':'application/json'})}),req=>{request=req;return of(new HttpResponse({body:{}}));}));
 await firstValueFrom(response);assert.equal(request!.headers.has('Content-Type'),false);assert.equal(request!.headers.get('X-CSRF-TOKEN'),'token-qa');
 assert.equal(request!.withCredentials,true);injector.destroy();
});
test('interceptor: HTTP403 no invalida identidad ni selecciona otra empresa',async()=>{
 let invalidated=0;const injector=createEnvironmentInjector([{provide:GosstSessionService,useValue:{csrfToken:()=>null,removeAllSession:()=>invalidated++}},
 {provide:Router,useValue:{navigate:()=>Promise.resolve(true)}}],null as never);
 const response=runInInjectionContext(injector,()=>gosstAuthInterceptor(new HttpRequest('POST','/sst/test',{}),()=>throwError(()=>new HttpErrorResponse({status:403}))));
 await assert.rejects(firstValueFrom(response));assert.equal(invalidated,0);injector.destroy();
});
test('interceptor: destinos externos no reciben cookie ni CSRF',async()=>{
 let request:HttpRequest<unknown>|undefined;
 const response=gosstAuthInterceptor(new HttpRequest('POST','https://external.invalid/test',{}),req=>{request=req;return of(new HttpResponse());});
 await firstValueFrom(response);assert.equal(request!.withCredentials,false);assert.equal(request!.headers.has('X-CSRF-TOKEN'),false);
});
test('garita: habilitado string no se interpreta como autorización',async()=>{
 const injector=createEnvironmentInjector([{provide:HttpClient,useValue:{post:()=>of({succeeded:true,code:'ACCESS_EVALUATED',decision:{habilitado:'true'}})}}],null as never);
 const api=runInInjectionContext(injector,()=>new AccessApiService());
 await assert.rejects(firstValueFrom(api.evaluate('PERSONA','QA-ID','INGRESO')));injector.destroy();
});


const keyA='11111111-1111-4111-8111-111111111111',keyB='22222222-2222-4222-8222-222222222222';
const accessBase={succeeded:true,code:'ACCESS_EVALUATED',message:'Evaluación confirmada.',correlationId:'fixture-access',httpStatus:200};
const accessDecision={decisionId:keyA,habilitado:true,motivos:[],expiresAt:'2026-10-26T10:00:00Z',version:'AAAAAAAAAAE=',subjectLabel:'Sujeto fixture',empresaNombre:'Empresa fixture',subjectType:'PERSONA',subjectId:8,projectId:10,zoneId:12,direction:'INGRESO'};
const accessPolicy={enabled:true,ttlSeconds:60,requireProject:true,requireZone:true,version:'AAAAAAAAAAE=',rules:[{subjectType:'PERSONA',factCode:'FACT_FIXTURE',operator:'EQ',expectedValues:['VALUE_FIXTURE'],message:'Falta condición configurada.'}],workflowRules:[{subjectType:'PERSONA',codigoCaso:'CASE_TEST',subtipo:'TYPE_TEST',requiredState:'STATE_B',message:'Falta proceso.'}],zones:[{zoneId:12,label:'Punto fixture',enabled:true}]};
function service<T>(type:new()=>T,http:object){const injector=createEnvironmentInjector([{provide:HttpClient,useValue:http},{provide:GosstSessionService,useValue:{}}],null as never);return{api:runInInjectionContext(injector,()=>new type()),destroy:()=>injector.destroy()};}
test('legado: contenido arbitrario no confirma una respuesta',()=>{assert.throws(()=>validateLegacyResponse({otro:true}));});
test('legado: fila sin versión no admite modificaciones posteriores',()=>{assert.throws(()=>confirmedList({CODE_RESPONSE:'05',STATUS_CODE:'01',list:[{id:8}]}));});
test('legado: actualización sin versión se rechaza antes de enviar',async()=>{
 let sent=false;const s=service(GosstApiService,{post:()=>{sent=true;return of({});}});
 await assert.rejects(firstValueFrom(s.api.callAjaxPost('/perfil/update',{id:8,nombre:'Nombre fixture'})),/Consulte nuevamente/);assert.equal(sent,false);s.destroy();
});
test('legado: escritura exige recibo de la misma intención y estado persistido',async()=>{
 const s=service(GosstApiService,{post:(_u:string,b:Record<string,unknown>)=>of({CODE_RESPONSE:'05',STATUS_CODE:'01',requestId:b['idempotencyKey'],snapshot:{version:'AAAAAAAAAAI=',record:{id:8,version:'AAAAAAAAAAE='}}})});
 await assert.rejects(firstValueFrom(s.api.callAjaxPost('/perfil/update',{id:8,nombre:'Nombre',expectedVersion:'AAAAAAAAAAE='})));s.destroy();
});
test('perfiles: IDs, permisos duplicados y recibo ajeno no confirman matriz',()=>{
 const v={succeeded:true,code:'PROFILE_PERMISSIONS_SAVED',profileId:8,version:'AAAAAAAAAAE=',requestId:keyA,permissions:[{code:'fixture:read',label:'Lectura fixture',enabled:true}]};
 assert.equal(readProfilePermissions(v,8,'PROFILE_PERMISSIONS_SAVED',keyA).permissions.length,1);
 assert.throws(()=>readProfilePermissions(v,9,'PROFILE_PERMISSIONS_SAVED',keyA));assert.throws(()=>readProfilePermissions(v,8,'PROFILE_PERMISSIONS_SAVED',keyB));
 assert.throws(()=>readProfilePermissions({...v,permissions:[...v.permissions,...v.permissions]},8,'PROFILE_PERMISSIONS_SAVED',keyA));
});
test('acceso: ausencia explícita de política es válida; respuesta vacía no',()=>{
 assert.equal(readAccessPolicy({...accessBase,code:'ACCESS_POLICY',policy:null},'ACCESS_POLICY'),null);
 assert.throws(()=>readAccessPolicy({},'ACCESS_POLICY'));
});
test('acceso: política requiere versión de base de datos y recibo exacto',()=>{
 assert.equal(readAccessPolicy({...accessBase,code:'ACCESS_POLICY_SAVED',requestId:keyA,policy:accessPolicy},'ACCESS_POLICY_SAVED',keyA)?.zones.length,1);
 assert.throws(()=>readAccessPolicy({...accessBase,code:'ACCESS_POLICY_SAVED',requestId:keyB,policy:accessPolicy},'ACCESS_POLICY_SAVED',keyA));
 assert.throws(()=>readAccessPolicy({...accessBase,code:'ACCESS_POLICY',policy:{...accessPolicy,version:'falsa'}},'ACCESS_POLICY'));
});
test('acceso: decisión envía contexto seleccionado sin autoridad del cliente',async()=>{
 let body:Record<string,unknown>|undefined;const s=service(AccessApiService,{post:(_u:string,b:Record<string,unknown>)=>{body=b;return of({...accessBase,decision:accessDecision});}});
 const decision=await firstValueFrom(s.api.evaluate('PERSONA','QA-DOC','INGRESO',10,12));assert.equal(decision.habilitado,true);
 assert.deepEqual(Object.keys(body!).sort(),['subjectType','identifier','direction','projectId','zoneId'].sort());assert.equal(body!['zoneId'],12);s.destroy();
});
test('acceso: decisión para otro proyecto o punto se rechaza',async()=>{
 const s=service(AccessApiService,{post:()=>of({...accessBase,decision:{...accessDecision,zoneId:99}})});
 await assert.rejects(firstValueFrom(s.api.evaluate('PERSONA','QA-DOC','INGRESO',10,12)));s.destroy();
});
test('acceso: habilitado con motivos de denegación es incoherente',async()=>{
 const s=service(AccessApiService,{post:()=>of({...accessBase,decision:{...accessDecision,motivos:['Documento pendiente']}})});
 await assert.rejects(firstValueFrom(s.api.evaluate('PERSONA','QA-DOC','INGRESO',10,12)));s.destroy();
});
test('acceso: denegación real conserva motivos sin convertirla en pase',async()=>{
 const s=service(AccessApiService,{post:()=>of({...accessBase,decision:{...accessDecision,habilitado:false,motivos:['Falta el proceso vigente']}})});
 const d=await firstValueFrom(s.api.evaluate('PERSONA','QA-DOC','INGRESO',10,12));assert.equal(d.habilitado,false);assert.equal(d.motivos.length,1);s.destroy();
});
test('acceso: registro sin snapshot persistido no muestra éxito',async()=>{
 const s=service(AccessApiService,{post:(_u:string,b:Record<string,unknown>)=>of({...accessBase,code:'ACCESS_RECORDED',requestId:b['idempotencyKey']})});
 await assert.rejects(firstValueFrom(s.api.register(accessDecision)));s.destroy();
});
test('acceso: registro confirmado conserva sentido y resultado decidido',async()=>{
 let sent:Record<string,unknown>|undefined;const s=service(AccessApiService,{post:(_u:string,b:Record<string,unknown>)=>{sent=b;return of({...accessBase,code:'ACCESS_RECORDED',requestId:b['idempotencyKey'],snapshot:{version:'AAAAAAAAAAI=',record:{id:51,version:'AAAAAAAAAAI=',documentoOPlaca:'QA-DOC',nombre:'Sujeto fixture',garita:'Punto fixture',movimiento:'INGRESO',autorizado:true,vigilante:'Vigilante fixture',fechaRegistro:'2026-10-25T09:00:00Z'}}});}});
 const r=await firstValueFrom(s.api.register(accessDecision));assert.equal((r['record'] as Record<string,unknown>)['id'],51);
 assert.deepEqual(Object.keys(sent!).sort(),['decisionId','expectedVersion','idempotencyKey'].sort());s.destroy();
});
test('acceso: reintento de política luego de503 usa misma intención y no pierde valores',async()=>{
 const sent:Record<string,unknown>[]=[];const s=service(AccessApiService,{put:(_u:string,b:Record<string,unknown>)=>{sent.push(b);return throwError(()=>new HttpErrorResponse({status:503}));}});
 const {version,...data}=accessPolicy;await assert.rejects(firstValueFrom(s.api.savePolicy(data,version)));await assert.rejects(firstValueFrom(s.api.savePolicy(data,version)));
 assert.equal(sent[0]['idempotencyKey'],sent[1]['idempotencyKey']);assert.deepEqual(sent[0]['rules'],accessPolicy.rules);s.destroy();
});
const committeeBase={succeeded:true,code:'ACTAS_READY',message:'Consulta fixture.',correlationId:'fixture-committee',httpStatus:200,replayed:false,actas:[],procesos:[],members:[],sessionTypes:[],evidenceIds:[]};
const actaFixture={idActa:9,numeroActa:'QA-9',tipoSesion:'TIPO_FIXTURE',ruleVersion:1,fechaReunion:'2026-10-25T09:00:00Z',agendaPrincipal:'Agenda fixture',acuerdoTomado:'Acuerdo fixture',responsableUsuarioId:8,responsableNombre:'Miembro fixture',quorumAsistentes:1,quorumRequerido:1,estado:'DRAFT',version:'AAAAAAAAAAE=',asistentesUsuarioIds:[8],workflowExpedienteId:42,createdAtUtc:'2026-10-25T09:00:00Z',documentUrl:'/sst/committee/actas/9/document',signatureIds:[keyA]};
test('comité: recupera firmas verificadas persistidas de miembros',()=>{
 const r=readCommitteeEnvelope({...committeeBase,actas:[actaFixture]},'ACTAS_READY');assert.deepEqual(r.actas[0].signatureIds,[keyA]);
 assert.throws(()=>readCommitteeEnvelope({...committeeBase,actas:[{...actaFixture,signatureIds:['firma local']} ]},'ACTAS_READY'));
});
test('comité: acta y voto exigen recibo de la operación correcta',()=>{
 assert.throws(()=>readCommitteeEnvelope({...committeeBase,code:'ACTA_CREATED',requestId:keyB,acta:actaFixture},'ACTA_CREATED',keyA));
 assert.throws(()=>readCommitteeEnvelope({...committeeBase,code:'VOTE_RECORDED',requestId:keyA,receipt:{requestId:keyB,idProceso:8,acceptedAtUtc:'2026-10-25T09:00:00Z',alreadyRecorded:false}},'VOTE_RECORDED',keyA));
});

test('legado: NULL opcional se conserva; propiedad ausente o tipo falso se rechazan',()=>{
 const response={CODE_RESPONSE:'05',STATUS_CODE:'01',list:[{id:8,version:'AAAAAAAAAAE=',campo:null}]};
 const rows=confirmedList<{campo:string|null}>(response,[{name:'campo',kind:'string',nullable:true}]);assert.equal(rows[0].campo,null);
 assert.throws(()=>confirmedList({...response,list:[{id:8,version:'AAAAAAAAAAE='}]},[{name:'campo',kind:'string',nullable:true}]));
 assert.throws(()=>confirmedList({...response,list:[{id:8,version:'AAAAAAAAAAE=',campo:100}]},[{name:'campo',kind:'string',nullable:true}]));
});
