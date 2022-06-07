
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient) {}
  public getAllClients(){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    let result  = this.http.get(environment.ip+'/rest_tasks').pipe(map((response: Response) => response));
    return result;
  }
  public getTaskDetails(id){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    let result  = this.http.get(environment.ip+'/rest_tasks/'+id).pipe(map((response: Response) => response));
    return result;
  }
   public moreTask(curr_page){  
     let result  = this.http.get(environment.ip+'/rest_tasks?page='+curr_page).pipe(map((response: Response) => response));
      return result;
    }
  public setUpAccountsMap(){
    let result = this.http.get(environment.ip+'/rest_tasks/create').pipe(map((response: Response) => response));
    return result;
  }
  public createClient(task:any){
    let result = this.http.post(environment.ip+'/rest_tasks',task).pipe(map((response: Response) => response));
    return result;
  }
  public getContactFromAccount(accId:number){
    let result = this.http.post(environment.ip+'/rest_tasks_contacts',{"account_id":accId}).pipe(map((response: Response) => response));
    return result;
  }

  public getAllColumnList(){
    let result = this.http.get(environment.ip+'/rest_tasks_columns').pipe(map((response: Response) => response));
    return result;
  }
  public createView(name:string,visi:number){
    let result = this.http.post(environment.ip+'/rest_tasks_views',{"name":name,"public_view":visi}).pipe(map((response: Response) => response));
    return result;
  }
  public updateView(viewId:number,column:number[]){
    let result = this.http.post(environment.ip+'/rest_tasks_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
    return result;
  }
  public fetchView(viewId:number,page=1){
    var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
    let result = this.http.get(environment.ip+'/rest_tasks_views/'+viewId+page_s).pipe(map((response: Response) => response));
    return result;
  }
   public fetchView2(viewId:number,page:number){
      var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
      let result = this.http.get(environment.ip+'/rest_accounts_views/'+viewId+page_s).pipe(map((response: Response) => response));
      return result;
    }
  public getAllOperators(){
    let result = this.http.get(environment.ip+'/operators').pipe(map((response: Response) => response));
    return result;
  }
  public updateSingleColumn (updateV:any){
   let validateDate = Date.parse(updateV.column_data);   
   try {
     if(isDate(updateV.column_data)){
       let date = new Date(updateV.column_data);
       let year = date.getFullYear();
       let month = date.getMonth()+1;
       let day = date.getDate();
       updateV.column_data=day + '/' + month + '/' + year;
     }  
   } catch (error) {
     
   }

   
    let result = this.http.post(environment.ip+'/rest_tasks/single_column',updateV).pipe(map((response: Response) => response));
    return result;
  }
  public saveFilter(filterArr:any[]){
    let result = this.http.post(environment.ip+'/rest_tasks_filters',filterArr).pipe(map((response: Response) => response));
    return result;
  }
  public updateClient(task:any){
    let result = this.http.patch(environment.ip+'/rest_tasks/'+task.id,task).pipe(map((response: Response) => response));
    return result;
  }
 
 public viewVisibilityUpdate(viewId:any,type:number){
   let result = this.http.patch(environment.ip+'/rest_tasks_views/'+viewId,{ "public_view":type}).pipe(map((response: Response) => response));
   return result;
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
