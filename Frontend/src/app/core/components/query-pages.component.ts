import {Component,Input,inject} from '@angular/core';
import {GosstApiService} from '../services/gosst-api.service';
@Component({
 selector:'msst-query-pages',standalone:true,
 template:`
 @if(api.pageEntries(routes).length){
 <section class="query-pages" aria-label="Páginas de los listados">
  <h3>Consultar más registros</h3>
  <p>La búsqueda de este panel consulta todos los registros autorizados en el servidor. Los filtros de cada tabla se aplican a su página actual.</p>
  @for(page of api.pageEntries(routes);track page.route){
   <div class="query-page">
    <strong>{{page.label}}</strong>
    <span aria-live="polite">Página {{page.index}} · {{page.returned}} registros</span>
    <label>Buscar en el listado <input [value]="searches[page.route]??page.search" (input)="searches[page.route]=value($event)" (keydown.enter)="search(page.route)" [disabled]="page.loading"></label>
    <button (click)="search(page.route)" [disabled]="page.loading">Buscar</button>
    <label>Por página <input type="number" min="1" [max]="page.maximumPageSize" [value]="page.pageSize" (change)="api.resizePage(page.route,number($event))" [disabled]="page.loading"></label>
    <button (click)="api.previousPage(page.route)" [disabled]="page.loading||!page.history.length">Anterior</button>
    <button (click)="api.nextPage(page.route)" [disabled]="page.loading||!page.hasMore">Siguiente</button>
   </div>
  }
 </section>
 }`,
 styles:[`.query-pages{margin:1rem 0;padding:1rem;border:1px solid #ccd6df;background:#f7fafc}.query-page{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin:.7rem 0}.query-page label{display:flex;gap:.4rem;align-items:center}.query-page input[type=number]{width:5rem}`]
})
export class QueryPagesComponent{
 readonly api=inject(GosstApiService);@Input()routes:readonly string[]=[];searches:Record<string,string|undefined>={};
 value(event:Event):string{return(event.target as HTMLInputElement).value;}
 number(event:Event):number{return Number(this.value(event));}
 search(route:string):void{this.api.searchPage(route,this.searches[route]??this.api.pages()[route]?.search??'');}
}
