
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Opportunity } from '../oppurtunity-grid/opportunity';
import { isDate } from 'rxjs/internal/util/isDate';


@Injectable({
  providedIn: 'root'
})
export class PersonelService {

  constructor(private http:HttpClient) { }

  public getAllClients(){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    let result  = this.http.get(environment.ip+'/rest_personal_accounts').pipe(map((response: Response) => response));
    return result;
  }
   public pinned_view(viewId:any){
      let data={'pa_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_pin_views_pa',data).pipe(map((response: Response) => response));
      return result;
    }
    public unpinned_view(viewId:any){
      let data={'pa_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_unpin_views_pa',data).pipe(map((response: Response) => response));
      return result;
    }
  public moreClients(curr_page){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    let result  = this.http.get(environment.ip+'/rest_personal_accounts?page='+curr_page).pipe(map((response: Response) => response));
    return result;
  }
  public setUpAccountsMap(){
    let result = this.http.get(environment.ip+'/rest_personal_accounts/create').pipe(map((response: Response) => response));
    return result;
  }
  public createClient(account:any){
    let result = this.http.post(environment.ip+'/rest_personal_accounts',account).pipe(map((response: Response) => response));
    return result;
  }
  public getClientDetails(clientId:number){
    let result = this.http.get(environment.ip+'/rest_personal_accounts/'+clientId).pipe(map((response: Response) => response));
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
    let result = this.http.get(environment.ip+'/rest_personal_accounts_columns').pipe(map((response: Response) => response));
    return result;
  }
  public createView(name:string,visi:number){
    let result = this.http.post(environment.ip+'/rest_personal_accounts_views',{"name":name,"public_view":visi}).pipe(map((response: Response) => response));
    return result;
  }
  public updateView(viewId:number,column:number[]){
    let result = this.http.post(environment.ip+'/rest_personal_accounts_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
    return result;
  }
    public updateAdditionalView(viewId:number,column:number[]){
    var cors=""; 
      if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
           cors="https://cors-anywhere.herokuapp.com/";   
      } 
      let result = this.http.post(cors+environment.ip+'/rest_personal_accounts_additional_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
      return result;
    }
  public fetchView(viewId:number,page:number){
     var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
    let result = this.http.get(environment.ip+'/rest_personal_accounts_views/'+viewId+page_s).pipe(map((response: Response) => response));
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
    let result = this.http.post(environment.ip+'/rest_personal_accounts/single_column',updateV).pipe(map((response: Response) => response));
    return result;
  }
  public saveFilter(filterArr:any[]){
    let result = this.http.post(environment.ip+'/rest_personal_accounts_filters',filterArr).pipe(map((response: Response) => response));
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
  public updateClient(account:any){
    let result = this.http.put(environment.ip+'/rest_personal_accounts/'+account.id,account).pipe(map((response: Response) => response));
    return result;
  }

  public reportsToList(){
   let result = this.http.get(environment.ip+'/rest_personal_accounts/create').pipe(map((response: Response) => response));
   return result;
 }
 public createEvent(event:any){
  let result = this.http.post(environment.ip+'/rest_events',event).pipe(map((response: Response) => response));
  return result;
 }
 public renameView(viewId:number,name:string){
  let result = this.http.patch(environment.ip+'/rest_personal_accounts_views/'+viewId,{"name":name}).pipe(map((response: Response) => response));
  return result;
}
public viewType(viewId:number,type:number){
  let result = this.http.patch(environment.ip+'/rest_personal_accounts_views/'+viewId,{"public_view":type}).pipe(map((response: Response) => response));
  return result;
}
public delete(id:number){
  let result = this.http.delete(environment.ip+'/rest_personal_accounts/'+id).pipe(map((response: Response) => response));
  return result;
 }
    public refreshEmail(){ 
      let result = this.http.get(environment.ip+'/rest_conversations').pipe(map((response: Response) => response));
      return result; 
    }
 public getStandardFileds(){  
   let result = this.http.get(environment.ip+'/rest_standard_fields_personal_account').pipe(map((response: Response) => response));
   return result;
 }
}
