import {Injectable,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import {asObject,isSafeId,WorkflowContractError} from './workflow-api.service';
export interface ClinicalRecord{clinicalRecordId:number;version:string;outcomeCode:string;outcomeLabel:string;examinedOn:string;expiresOn:string;clinic:string;validUntilUtc:string;}
export interface ClinicalOption{code:string;label:string;}
@Injectable({providedIn:'root'})
export class ClinicalWorkflowService{
 private readonly http=inject(HttpClient);
 options(){return this.http.get<unknown>('/sst/workflow/v2/effect-options').pipe(map(raw=>{
  const r=asObject(raw);if(r['succeeded']!==true||r['code']!=='CLINICAL_OPTIONS_CONFIRMED'||!Array.isArray(r['options']))throw new WorkflowContractError('No se confirmó el catálogo de dictámenes.');
  return r['options'].map(v=>{const o=asObject(v);if(typeof o['code']!=='string'||!o['code']||typeof o['label']!=='string'||!o['label'])throw new WorkflowContractError('Dictamen inválido.');return o as unknown as ClinicalOption;});
 }));}
 records(id:number,afterId=0){if(!isSafeId(id)||!Number.isSafeInteger(afterId)||afterId<0)throw new WorkflowContractError('Seleccione un expediente válido.');
  return this.http.get<unknown>('/sst/workflow/v2/expedientes/'+id+'/clinical-records',{params:{afterId}}).pipe(map(raw=>{
   const r=asObject(raw);if(r['succeeded']!==true||r['code']!=='CLINICAL_RECORDS_CONFIRMED'||!Array.isArray(r['records']))throw new WorkflowContractError('No se confirmaron las evaluaciones clínicas.');
   return r['records'].map(v=>{const m=asObject(v);let version=false;try{version=typeof m['version']==='string'&&atob(m['version']).length===8&&btoa(atob(m['version']))===m['version'];}catch{}
    if(!isSafeId(m['clinicalRecordId'])||!version||['outcomeCode','outcomeLabel','examinedOn','expiresOn','clinic','validUntilUtc'].some(k=>typeof m[k]!=='string'||!m[k]))throw new WorkflowContractError('Evaluación clínica inválida.');
    return m as unknown as ClinicalRecord;
   });
  }));
 }
}
