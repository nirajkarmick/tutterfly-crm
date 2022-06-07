
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root' 
})
export class ImportService {

  constructor(private http:HttpClient) {}
  public getAllColumn(){
    let result  = this.http.get(environment.ip+'/rest_field_lists').pipe(map((response: Response) => response));
    return result;
  }
   public importData(data:any,type:any){ 
       var url='';
       if(type=='leads'){
            url='rest_leads_import';
          }  
          if(type=='accounts'){
            url='rest_accounts_import';
          }   
          if(type=='contacts'){
            url='rest_contacts_import';
          }    
          if(type=='person_accounts'){
            url='rest_personal_accounts_import';    
          }   
          if(type=='opportunities'){
            url='rest_opportunities_import';    
          }  
           
          if(type=='opportunity_histories'){
            url='rest_opportunity_histories_import';    
          }  
    let result = this.http.post(environment.ip+'/'+url,data).pipe(map((response: Response) => response));
    return result;
  }
  // public createClient(task:any){
  //   let result = this.http.post(environment.ip+'/rest_tasks',task).map((response: Response) => response);
  //   return result;
  // }
  
public downloadSample(type:any){
   // var targetUrl=environment.ip+'/rest_files_public_url/eyJpdiI6IjZhbWh1cXlxV0p5VzNtMzV1UDZ2aWc9PSIsInZhbHVlIjoiWFBiZWRZR0kwcVJHMEk3Rmo4TDJXUT09IiwibWFjIjoiMDcyYTZmZTE0NDQ0ODAxMzAxODQ5NzJlYzBkNjAxNDlmZGVmNzU3MmFjMjBjNGU2MGE5YWM4MGE5NjlmODdlMyJ9';
   // var targetUrl='https://s3.us-west-2.amazonaws.com/s3-bucket-crm-oregon/csv/1580881811.csv';
   
   // return this.http.get(targetUrl,{responseType:'blob'}).map((res:any)=>{
   //       return res;
   //      });
 //  type='accounts';
     return this.http.get(environment.ip+'/rest_sample_download/'+type, 
      { responseType: 'blob' }).pipe(
       map(  
         (res:any) => {
          return res;            
       }));
   
   }
   public downloadstageSample(type:any){
  
     return this.http.get(environment.ip+'/rest_sample_download/'+type, 
      { responseType: 'blob' }).pipe(
       map(  
         (res:any) => {
          return res;            
       }));
   
   }
}
