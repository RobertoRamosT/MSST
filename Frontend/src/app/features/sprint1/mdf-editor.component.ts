import {Component,OnInit,OnDestroy,inject,signal} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GosstApiService,confirmedList,apiErrorMessage} from '../../core/services/gosst-api.service';
import {QueryPagesComponent} from '../../core/components/query-pages.component';
interface MdfNode {id:number;version:string;nombre:string;tipo:string;idPadre:number|null;idArea:number|null;area:string|null;}
interface NodeType {id:number;version:string;code:string;label:string;parentCode:string|null;}
@Component({selector:'msst-mdf-editor',standalone:true,imports:[FormsModule,QueryPagesComponent],template:`
<section aria-label="Jerarquía MDF">
 <h3>Procesos, actividades, tareas y pasos</h3>
 <p>Cada nodo conserva su identidad y relación con el nivel superior.</p>
 @if(message()){<p role="status">{{message()}}</p>}
 <button (click)="create()" [disabled]="busy()||!types().length">Agregar nodo</button>
 <table class="table table-bordered"><thead><tr><th>Nombre</th><th>Tipo</th><th>Nodo padre</th><th>Área</th><th>Acciones</th></tr></thead>
 <tbody>@for(node of nodes();track node.id){<tr><td>{{node.nombre}}</td><td>{{typeLabel(node.tipo)}}</td><td>{{parentLabel(node.idPadre)}}</td><td>{{node.area}}</td><td><button (click)="edit(node)" [disabled]="busy()">Editar</button> <button (click)="remove(node)" [disabled]="busy()">Eliminar nodo</button></td></tr>}</tbody></table>
 @if(!busy()){<msst-query-pages [routes]="pageRoutes"/>}
 @if(open()){
 <form (ngSubmit)="save()" aria-label="Registro MDF" class="panel panel-default"><div class="panel-body">
 <h4>{{editing()?'Editar nodo':'Agregar nodo'}}</h4>
 <label>Nombre <input name="nombre" [(ngModel)]="draft.nombre" required [disabled]="busy()"></label>
 <label>Tipo <select name="tipo" [(ngModel)]="draft.tipo" (ngModelChange)="draft.idPadre=null" required [disabled]="busy()"><option value="">Seleccione</option>@for(t of types();track t.code){<option [value]="t.code">{{t.label}}</option>}</select></label>
 @if(parentType()){
 <label>Nodo padre ({{typeLabel(parentType()!)}}) <select name="parent" [(ngModel)]="draft.idPadre" required [disabled]="busy()"><option [ngValue]="null">Seleccione</option>@if(draft.idPadre && !parentOptions().some(parentIsSelected)){<option [ngValue]="draft.idPadre">{{parentLabel(draft.idPadre)}}</option>}@for(p of parentOptions();track p.id){<option [ngValue]="p.id">{{p.nombre}}</option>}</select></label>
 <p>Use la búsqueda y las páginas del listado para encontrar el nodo padre. El servidor valida su relación al guardar.</p>
 }
 <label>Área <select name="area" [(ngModel)]="draft.idArea" [disabled]="busy()"><option [ngValue]="null">Sin área</option>@if(draft.idArea && !areas().some(areaIsSelected)){<option [ngValue]="draft.idArea">Área {{draft.idArea}} (otra página)</option>}@for(a of areas();track a['id']){<option [ngValue]="a['id']">{{a['nombre']}}</option>}</select></label>
 <button type="submit" [disabled]="busy()">Guardar nodo</button><button type="button" (click)="open.set(false)" [disabled]="busy()">Cancelar</button>
 </div></form>}
</section>`,styles:[`label{display:block;margin:1rem}input,select{margin-left:.5rem;max-width:100%}button{margin:.25rem}table{width:100%}`]})
export class MdfEditorComponent implements OnInit,OnDestroy{
 private readonly api=inject(GosstApiService);
 private reads=new Subscription();
 ngOnDestroy():void{this.reads.unsubscribe();}
 readonly nodes=signal<MdfNode[]>([]);readonly types=signal<NodeType[]>([]);readonly areas=signal<Record<string,any>[]>([]);
 readonly message=signal('');readonly busy=signal(false);readonly open=signal(false);readonly editing=signal<MdfNode|null>(null);
 readonly pageRoutes=['/mdf/lista','/mdf/areas'];
 draft={nombre:'',tipo:'',idPadre:null as number|null,idArea:null as number|null};
 private readonly changes=this.api.pageChanges.pipe(takeUntilDestroyed()).subscribe(route=>{if(this.pageRoutes.includes(route))this.load();});
 ngOnInit():void{
  this.api.callAjaxPost('/mdf/tipos',{}).subscribe({next:r=>{try{this.types.set(confirmedList<NodeType>(r,[{name:'code',kind:'string'},{name:'label',kind:'string'},{name:'parentCode',kind:'string',nullable:true}]));}catch(e){this.fail(e);}},error:e=>this.fail(e)});this.load();
 }
 load():void{
  this.reads.unsubscribe();this.reads=new Subscription();
  this.reads.add(this.api.callAjaxPost('/mdf/lista',{}).subscribe({next:r=>{try{this.nodes.set(confirmedList<MdfNode>(r,[{name:'nombre',kind:'string'},{name:'tipo',kind:'string'},{name:'idPadre',kind:'number',nullable:true}]));}catch(e){this.fail(e);}},error:e=>this.fail(e)}));
  this.reads.add(this.api.callAjaxPost('/mdf/areas',{}).subscribe({next:r=>{try{this.areas.set(confirmedList<Record<string,any>>(r,[{name:'nombre',kind:'string'}]));}catch(e){this.fail(e);}},error:e=>this.fail(e)}));
 }
 typeLabel(code:string):string{return this.types().find(t=>t.code===code)?.label??code;}
 parentType():string|null{return this.types().find(t=>t.code===this.draft.tipo)?.parentCode??null;}
 parentLabel(id:number|null):string{return id===null?'Sin padre':this.nodes().find(n=>n.id===id)?.nombre??'Nodo '+id+' (otra página)';}
 readonly areaIsSelected=(area:Record<string,any>)=>area['id']===this.draft.idArea;
 readonly parentIsSelected=(node:MdfNode)=>node.id===this.draft.idPadre;
 parentOptions():MdfNode[]{return this.nodes().filter(n=>n.tipo===this.parentType()&&n.id!==this.editing()?.id);}
 create():void{if(this.busy())return;this.editing.set(null);this.draft={nombre:'',tipo:'',idPadre:null,idArea:null};this.message.set('');this.open.set(true);}
 edit(n:MdfNode):void{if(this.busy())return;this.editing.set({...n});this.draft={nombre:n.nombre,tipo:n.tipo,idPadre:n.idPadre,idArea:n.idArea};this.message.set('');this.open.set(true);}
 save():void{
  if(this.busy())return;
  if(!this.draft.nombre.trim()||!this.types().some(t=>t.code===this.draft.tipo)||(this.parentType()&&!this.draft.idPadre)){this.message.set('Complete nombre, tipo y nodo padre correspondiente.');return;}
  const existing=this.editing(),payload={...this.draft,...(existing?{id:existing.id,expectedVersion:existing.version}:{})};
  this.reads.unsubscribe();this.busy.set(true);this.api.callAjaxPost(existing?'/mdf/update':'/mdf/insert',payload).subscribe({next:()=>{this.busy.set(false);this.open.set(false);this.message.set('Nodo confirmado en la base de datos.');this.load();},error:e=>this.fail(e)});
 }
 remove(n:MdfNode):void{
  if(this.busy())return;this.reads.unsubscribe();this.busy.set(true);
  this.api.callAjaxPost('/mdf/delete',{id:n.id,expectedVersion:n.version}).subscribe({next:()=>{this.busy.set(false);if(this.editing()?.id===n.id)this.open.set(false);this.message.set('Nodo eliminado.');this.load();},error:e=>this.fail(e)});
 }
 private fail(e:unknown):void{this.busy.set(false);this.message.set(apiErrorMessage(e));}
}
