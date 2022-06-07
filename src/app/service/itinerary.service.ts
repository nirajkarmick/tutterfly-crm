import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  constructor(private http:HttpClient) {}
  public getAllItinerary(cat){
     if(cat=='Opportunity'){
        // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
        let result  = this.http.get(environment.ip+'/rest_itineraries').pipe(map((response: Response) => response));
        return result;
       }
  }
  public getForm(id,cat){
     if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/rest_addfield_opportunities/'+id).pipe(map((response: Response) => response));
        return result;
       }
  }
  public createform(data:any,cat:any){
    if(cat=='Opportunity'){
        let result = this.http.post(environment.ip+'/rest_addfield_opportunities',data).pipe(map((response: Response) => response));
        return result;
    }
  }
  public updateform(data:any,id:any,cat:any){
    if(cat=='Opportunity'){
        let result = this.http.patch(environment.ip+'/rest_addfield_opportunities/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
  }
  

  public  rename(viewId :number,name:string){
   let result = this.http.patch(environment.ip+'/rest_tasks_views/'+viewId,{      "name":name  }  ).pipe(map((response: Response) => response));
   return result;
 }
 public delete(id:number){
  let result = this.http.delete(environment.ip+'/rest_tasks/'+id).pipe(map((response: Response) => response));
  return result;
 }

}
