
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {Account } from "../accounts-grid/account";

import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable()
export class SupplierService {
constructor(private http:HttpClient) {}
   public getAllAccounts(){
      // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
      let result  = this.http.get(environment.ip+'/rest_supplier').pipe(map((response: Response) => response));
      return result; 
    }

   public moreAccounts(curr_page){  
     let result  = this.http.get(environment.ip+'/rest_supplier?page='+curr_page).pipe(map((response: Response) => response));
      return result;
    }
    public setUpAccountsMap(){
      let result = this.http.get(environment.ip+'/rest_supplier/create').pipe(map((response: Response) => response));
      return result;
    }
    public createClient(account:Account){
      let result = this.http.post(environment.ip+'/rest_supplier',account).pipe(map((response: Response) => response));
      return result;
    }
    public getClientDetails(clientId:number){
      let result = this.http.get(environment.ip+'/rest_supplier/'+clientId).pipe(map((response: Response) => response));
      return result;
    }
    public sendMail(mail:any){
      let result = this.http.post(environment.ip+'/rest_emails',mail).pipe(map((response: Response) => response));
      return result;
    }
    
    public pinned_view(viewId:any){
      let data={'account_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_pin_views_supplier',data).pipe(map((response: Response) => response));
      return result;
    }
    public unpinned_view(viewId:any){
      let data={'account_view_id':viewId};
      let result = this.http.post(environment.ip+'/rest_unpin_views_supplier',data).pipe(map((response: Response) => response));
      return result;
    }

    public callLog(call:any){
      let result = this.http.post(environment.ip+'/rest_tasks',call).pipe(map((response: Response) => response));
      return result;
    }
    public getAllColumnList(){
      let result = this.http.get(environment.ip+'/rest_supplier_columns').pipe(map((response: Response) => response));
      return result;
    }
    public createView(name:string,visi:number){
      let result = this.http.post(environment.ip+'/rest_supplier_views',{"name":name,"public_view":visi}).pipe(map((response: Response) => response));
      return result;
    }
    public updateView(viewId:number,column:number[]){
      let result = this.http.post(environment.ip+'/rest_supplier_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
      return result;
    }
    public updateAdditionalView(viewId:number,column:number[]){
    var cors=""; 
      if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
           cors="https://cors-anywhere.herokuapp.com/";   
      } 
      let result = this.http.post(cors+environment.ip+'/rest_supplier_additional_columns',{"view_id":viewId,"column_id":column}).pipe(map((response: Response) => response));
      return result;
    }


    public fetchView(viewId:number,page:number){
      var page_s='';
      if(page > 0){
        page_s='?page='+page;
      }
    var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 
      let result = this.http.get(cors+environment.ip+'/rest_supplier_views/'+viewId+page_s).pipe(map((response: Response) => response));
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
  
      let result = this.http.post(environment.ip+'/rest_supplier/single_column',updateV).pipe(map((response: Response) => response));
      return result;
    }
    public saveFilter(filterArr:any[]){
      let result = this.http.post(environment.ip+'/rest_supplier_filters',filterArr).pipe(map((response: Response) => response));
      return result;
    }
    public getCountryList(){
      let result = this.http.get(environment.ip+'/countries').pipe(map((response: Response) => response));
      return result;
    }

    public rest_accounts_list(){
      let result = this.http.get(environment.ip+'/rest_suppliers_list').pipe(map((response: Response) => response));
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
    public updateClient(account:Account){
      let result = this.http.put(environment.ip+'/rest_supplier/'+account.id,account).pipe(map((response: Response) => response));
      return result;
    }
    public  rename(viewId :number,name:string){
      let result = this.http.patch(environment.ip+'/rest_suppliers_views/'+viewId,{      "name":name  }  ).pipe(map((response: Response) => response));
      return result;
    }
    public viewVisibilityUpdate(viewId:any,type:number){
      let result = this.http.patch(environment.ip+'/rest_suppliers_views/'+viewId,{ "public_view":type}).pipe(map((response: Response) => response));
      return result;
     }
     public delete(id:number){
      let result = this.http.delete(environment.ip+'/rest_supplier/'+id).pipe(map((response: Response) => response));
      return result;
     }
    public searchMergeAcc(key){
      let result = this.http.get(environment.ip+'/rest_merge_accounts_search?search='+key).pipe(map((response: Response) => response));
      return result;
    }
    public compareAcc(account_id){
      let result = this.http.post(environment.ip+'/rest_merge_accounts_compare',{"account_id" : account_id}).pipe(map((response: Response) => response));
      return result;
    }
    public mergeAcc(mergeData){
      let result = this.http.post(environment.ip+'/rest_merge_accounts',mergeData).pipe(map((response: Response) => response));
      return result;
    }
    public refreshEmail(){
      let result = this.http.get(environment.ip+'/rest_conversations').pipe(map((response: Response) => response));
      return result;
    }
    
    public searh_account(key){
      let result = this.http.get(environment.ip+'/rest_supplier_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
     public searh_contacts(key){
      let result = this.http.get(environment.ip+'/rest_contacts_search?s='+key).pipe(map((response: Response) => response));
      return result;
    }
 public getStandardFileds(){  
   let result = this.http.get(environment.ip+'/rest_standard_fields_supplier').pipe(map((response: Response) => response));
   return result;
 }
   
}
