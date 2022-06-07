
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Opportunity } from '../oppurtunity-grid/opportunity';
import { isDate } from 'rxjs/internal/util/isDate';


@Injectable({
  providedIn: 'root'
})
export class OppurtunityService {

  constructor(private http:HttpClient) { }

  public getAllClients(){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    let result  = this.http.get(environment.ip+'/rest_opportunities').pipe(map((response: Response) => response));
    return result;
  }
   public get_pipeline_view(page=1){
     let result = this.http.get(environment.ip+'/rest_opps_mypipeline?page='+page).pipe(map((response: Response) => response));
     return result;
   }
    public pinned_view(viewId:any){
      let data={'opportunity_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_pin_views_opp',data).pipe(map((response: Response) => response));
      return result;
    }
    public unpinned_view(viewId:any){
      let data={'opportunity_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_unpin_views_opp',data).pipe(map((response: Response) => response));
      return result;
    }
  public moreClients(curr_page){
    let result  = this.http.get(environment.ip+'/rest_opportunities?page='+curr_page).pipe(map((response: Response) => response));
    return result;
  }
  public setUpAccountsMap(){
    let result = this.http.get(environment.ip+'/rest_opportunities/create').pipe(map((response: Response) => response));
    return result;
  }

  public ledger_account(account_led:any){
    let result = this.http.post(environment.ip+'/rest_ledger_account',account_led).pipe(map((response: Response) => response));
    return result;
  }
public search_itin(key:any){
    let result = this.http.get(environment.ip+'/search_itinerary?search='+key).pipe(map((response: Response) => response));
    return result;
  }   

  public createClient(account:Opportunity){
    let result = this.http.post(environment.ip+'/rest_opportunities',account).pipe(map((response: Response) => response));
    return result;
  }
  public getClientDetails(clientId:number){
    let result = this.http.get(environment.ip+'/rest_opportunities/'+clientId).pipe(map((response: Response) => response));
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
    let result = this.http.get(environment.ip+'/rest_opportunities_columns').pipe(map((response: Response) => response));
    return result;
  }
  public createView(name:string,visi:number){
    let result = this.http.post(environment.ip+'/rest_opportunities_views',{"name":name,"public_view":visi}).pipe(map((response: Response) => response));
    return result;
  }
  public updateView(viewId:number,column:number[]){
    let result = this.http.post(environment.ip+'/rest_opportunities_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
    return result;
  }
    public updateAdditionalView(viewId:number,column:number[]){
    var cors=""; 
      if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
           cors="https://cors-anywhere.herokuapp.com/";   
      } 
      let result = this.http.post(cors+environment.ip+'/rest_oppo_additional_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
      return result;
    }
  public fetchView(viewId:number,page:number){
     var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
    let result = this.http.get(environment.ip+'/rest_opportunities_views/'+viewId+page_s).pipe(map((response: Response) => response));
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
    let result = this.http.post(environment.ip+'/rest_opportunities/single_column',updateV).pipe(map((response: Response) => response));
    return result;
  }
  public saveFilter(filterArr:any[]){
    let result = this.http.post(environment.ip+'/rest_opportunities_filters',filterArr).pipe(map((response: Response) => response));
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
  public updateClient(account:Opportunity){
    let result = this.http.put(environment.ip+'/rest_opportunities/'+account.id,account).pipe(map((response: Response) => response));
    return result;
  }

  public reportsToList(){
   let result = this.http.get(environment.ip+'/rest_opportunities/create').pipe(map((response: Response) => response));
   return result;
 }
 public getStandardFileds(){  
   let result = this.http.get(environment.ip+'/rest_standard_fields_opp').pipe(map((response: Response) => response));
   return result;
 }
 public createEvent(event:any){
  let result = this.http.post(environment.ip+'/rest_events',event).pipe(map((response: Response) => response));
  return result;
 }
 public renameView(viewId:any,name:string){
  let result = this.http.patch(environment.ip+'/rest_opportunities_views/'+viewId,{ "name":name}).pipe(map((response: Response) => response));
  return result;
 }
 public viewVisibilityUpdate(viewId:any,type:number){
  let result = this.http.patch(environment.ip+'/rest_opportunities_views/'+viewId,{ "public_view":type}).pipe(map((response: Response) => response));
  return result;
 }
 public fetchContactList(accId:any){
  let result = this.http.post(environment.ip+'/rest_opportunities_contacts',{ "account_id":accId}).pipe(map((response: Response) => response));
  return result;
 }
  public fetchOppDetails(id:number){
    let result = this.http.get(environment.ip+'/show_opp_det/'+id).pipe(map((response: Response) => response));
    return result;
  }
 public updateStage(stageInfo:any){
  let result = this.http.post(environment.ip+'/rest_opportunities_sales_stages',stageInfo).pipe(map((response: Response) => response));
  return result;
 }
 public deleteOppo(id:number){
  let result = this.http.delete(environment.ip+'/rest_opportunities/'+id).pipe(map((response: Response) => response));
  return result;
 }
    public refreshEmail(){
      let result = this.http.get(environment.ip+'/rest_conversations').pipe(map((response: Response) => response));
      return result;
    }
 public changeOwner(changeOwn:any){
  let result = this.http.post(environment.ip+'/rest_opportunities_change_owner',changeOwn).pipe(map((response: Response) => response));
  return result;
 }
  public searh_account(key){
      let result = this.http.get(environment.ip+'/rest_accounts_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
     public searh_contacts(key){
      let result = this.http.get(environment.ip+'/rest_contacts_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
     public fetch_acc_det(acc_id){
      let result = this.http.get(environment.ip+'/rest_accounts_address/'+acc_id).pipe(map((response: Response) => response));
      return result;
    }
    public searh_p_account(key){
      let result = this.http.get(environment.ip+'/rest_personal_accounts_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
    public searh_opportunity(key){
      let result = this.http.get(environment.ip+'/rest_oppo_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
     public fetch_p_det(acc_id){
      let result = this.http.get(environment.ip+'/rest_personal_accounts_dynamic/'+acc_id).pipe(map((response: Response) => response));
      return result; 
    }
     public get_invoice(id){
      let result = this.http.get(environment.ip+'/rest_proforma_invoices?opportunity_id='+id).pipe(map((response: Response) => response));
      return result; 
    }
     public download_invoice(id){
      let result = this.http.get(environment.ip+'/rest_profinvoice_download?invoice_id='+id).pipe(map((response: Response) => response));
      return result; 
    }
     public generate_invoice(id,note){
      var opp={'opportunity_id':id,'note':note}
      let result = this.http.post(environment.ip+'/rest_proforma_invoices',opp).pipe(map((response: Response) => response));
      return result; 
    }
     public send_invoice(email,id){
      var invemail={'email':email,'invoice_id':id};
      let result = this.http.post(environment.ip+'/rest_profinvoice_email',invemail).pipe(map((response: Response) => response));
      return result; 
    }
public send_rfq(datas:any){
    
  let result = this.http.post(environment.ip+'/send_rfq',datas).pipe(map((response: Response) => response));
  return result;

 }

    public SearchDestinations(keyword:any){
      let result = this.http.get(environment.pullit+'destination_search?key='+keyword).pipe(map((response: Response) => response));
      return result; 
    }
      public SearchCountry(keyword:any){
      let result = this.http.get(environment.ip+'/search_country?key='+keyword).pipe(map((response: Response) => response));
      return result; 
    }
 
      public SearchState(keyword:any){
      let result = this.http.get(environment.pullit+'search_state?key='+keyword).pipe(map((response: Response) => response));
      return result; 
    }
    public saveOppSchedule(data:any){
    
        let result = this.http.post(environment.ip+'/save_opp_schedule',data).pipe(map((response: Response) => response));
        return result;

    }
}
