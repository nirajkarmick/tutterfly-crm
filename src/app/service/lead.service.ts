
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {Account } from "../accounts-grid/account";
import {Contact } from "../contact-grid/contact";

import {environment} from "../../environments/environment";
import { EventClass } from '../contact-details/event-class';
import { isDate } from 'rxjs/internal/util/isDate'; 
// import ResponseContentType; 

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  constructor(private http:HttpClient) {}
  public getAllClients(){
     // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
     let result  = this.http.get(environment.ip+'/rest_leads').pipe(map((response: Response) => response));
     return result;
   }
  public moreClients(curr_page){
     // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
     let result  = this.http.get(environment.ip+'/rest_leads?page='+curr_page).pipe(map((response: Response) => response));
     return result;
   }
   public setUpAccountsMap(){
     let result = this.http.get(environment.ip+'/rest_leads/create').pipe(map((response: Response) => response));
     return result;
   }
   public get_pipeline_view(){
     let result = this.http.get(environment.ip+'/rest_leads/create').pipe(map((response: Response) => response));
     return result;
   }
    public pinned_view(viewId:any){
      let data={'lead_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_pin_views_lead',data).pipe(map((response: Response) => response));
      return result;
    }
    public unpinned_view(viewId:any){
      let data={'lead_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_unpin_views_lead',data).pipe(map((response: Response) => response));
      return result;
    }
   public createClient(account:Contact){
     let result = this.http.post(environment.ip+'/rest_leads',account).pipe(map((response: Response) => response));
     return result;
   }
   public getClientDetails(clientId:number){
     let result = this.http.get(environment.ip+'/rest_leads/'+clientId).pipe(map((response: Response) => response));
     return result;
   }
   public sendMail(mail:any){
     let result = this.http.post(environment.ip+'/rest_emails',mail).pipe(map((response: Response) => response));
     return result;
   }
   
   public callLog(call:any){
     let result = this.http.post(environment.ip+'/rest_tasks',call).pipe(map((response: Response) => response));
     return result;
   }
   public getAllColumnList(){
     let result = this.http.get(environment.ip+'/rest_leads_columns').pipe(map((response: Response) => response));
     return result;
   }
   public createView(name:string,visi:number){
     let result = this.http.post(environment.ip+'/rest_leads_views',{"name":name,"public_view":visi}).pipe(map((response: Response) => response));
     return result;
   }
   public updateView(viewId:number,column:number[]){
     let result = this.http.post(environment.ip+'/rest_leads_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
     return result;
   }
    public updateAdditionalView(viewId:number,column:number[]){
    var cors=""; 
      if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
           cors="https://cors-anywhere.herokuapp.com/";   
      } 
      let result = this.http.post(cors+environment.ip+'/rest_leads_additional_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
      return result;
    }
   public fetchView(viewId:number,page:number){
     var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
     let result = this.http.get(environment.ip+'/rest_leads_views/'+viewId+page_s).pipe(map((response: Response) => response));
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

    
     let result = this.http.post(environment.ip+'/rest_leads/single_column',updateV).pipe(map((response: Response) => response));
     return result;
   }
   public saveFilter(filterArr:any[]){
     let result = this.http.post(environment.ip+'/rest_leads_filters',filterArr).pipe(map((response: Response) => response));
     return result;
   }
   public getCountryList(){
     let result = this.http.get(environment.ip+'/countries').pipe(map((response: Response) => response));
     return result;
   }
   public getStateList(countryId:number){
     let result = this.http.post(environment.ip+'/states',{        "country_id" : countryId     }).pipe(map((response: Response) => response));
     return result;
   }
   public getCityList(stateId:number){
     let result = this.http.post(environment.ip+'/cities', {        "state_id" : stateId        } ).pipe(map((response: Response) => response));
     return result;
   }
   public updateClient(contact:Contact){
     let result = this.http.patch(environment.ip+'/rest_leads/'+contact.id,contact).pipe(map((response: Response) => response));
     return result;
   }

   public reportsToList(){
    let result = this.http.get(environment.ip+'/rest_leads/create').pipe(map((response: Response) => response));
    return result;
  }
  public createEvent(event:EventClass){
    let result = this.http.post(environment.ip+'/rest_events',event).pipe(map((response: Response) => response));
    return result;
  }
  
  public fetchDetailsForCovertion(id:number){
    let result = this.http.get(environment.ip+'/rest_leads/convert/'+id).pipe(map((response: Response) => response));
    return result;
  }

  public convert(convert:any,id:number){
    let result = this.http.post(environment.ip+'/rest_leads/convert',convert).pipe(map((response: Response) => response));
    return result;
  }
  public viewVisibilityUpdate(viewId:any,type:number){
    let result = this.http.patch(environment.ip+'/rest_leads_views/'+viewId,{ "public_view":type}).pipe(map((response: Response) => response));
    return result;
   }
   public  rename(viewId :number,name:string){
    let result = this.http.patch(environment.ip+'/rest_leads_views/'+viewId,{      "name":name  }  ).pipe(map((response: Response) => response));
    return result;
  }
  public delete(id:number){
    let result = this.http.delete(environment.ip+'/rest_leads/'+id).pipe(map((response: Response) => response));
    return result;
   }
   public getMassMailMeta(id:number){
    let result = this.http.get(environment.ip+'/leads-massmail/create?view_id='+id).pipe(map((response: Response) => response));
    return result;
  } 
  public sendMassMail(convert:any){
    let result = this.http.post(environment.ip+'/leads-massmail',convert).pipe(map((response: Response) => response));
    return result;
  }
  public exportData(){


     return this.http.get(environment.ip+'/rest_leads_export/xls', 
      { responseType: 'blob' }).pipe(
       map(
         (res:any) => {
          return res;            
       }));
   
  }
  public importData(data:any){ 
     console.log(data);
    let result = this.http.post(environment.ip+'/rest_leads_import',data).pipe(map((response: Response) => response));
    return result;
  }
    public refreshEmail(){
      let result = this.http.get(environment.ip+'/rest_conversations').pipe(map((response: Response) => response));
      return result;
    }
    public downLoadFile(data: any, type: string) {
        alert('download');
        let blob = new Blob([data], { type: type});
        let url = window.URL.createObjectURL(blob);
        console.log(url);
        let pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }
    }
 public getStandardFileds(){  
   let result = this.http.get(environment.ip+'/rest_standard_fields_lead').pipe(map((response: Response) => response));
   return result;
 }
 public getFBLeads(){  
   let result = this.http.get(environment.ip+'/get_fb_leads').pipe(map((response: Response) => response));
   return result;
 }
}
