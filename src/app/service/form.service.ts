
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpBackend} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root'
})
export class FormService {

private customHttpClient: HttpClient; 
  constructor(private http:HttpClient,private backend: HttpBackend) {
    this.customHttpClient = new HttpClient(backend);
  }
  public getAllfields(cat){
     if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/rest_addfield_o_a').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Account'){
        let result  = this.http.get(environment.ip+'/rest_addfield_accounts_active').pipe(map((response: Response) => response));
        return result;
       } 
       if(cat=='Contact'){
        let result  = this.http.get(environment.ip+'/rest_addfield_contacts_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Personal Account'){
        let result  = this.http.get(environment.ip+'/rest_addfield_pa_a').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Leads'){
        let result  = this.http.get(environment.ip+'/rest_addfield_leads_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='suppliers'){
        let result  = this.http.get(environment.ip+'/rest_addfield_suppliers_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='supplier'){
        let result  = this.http.get(environment.ip+'/rest_addfield_suppliers_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Supplier'){
        let result  = this.http.get(environment.ip+'/rest_addfield_suppliers_active').pipe(map((response: Response) => response));
        return result;
       }
  }

load_picklist(pick_name:any){
      let result = this.http.get(environment.ip+'/rest_'+pick_name).pipe(map((response: Response) => response));
      return result;
}
  public sort_all_fileds(data,cat){
    var cors=""; 
    if (location.hostname.search("192.168")>=0   ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 
       if(cat=='Account'){
        let result  = this.http.post(cors+environment.ip+'/sort_accounts_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Contact'){
        let result  = this.http.post(cors+environment.ip+'/sort_contacts_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Leads'){
        let result  = this.http.post(cors+environment.ip+'/sort_leads_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Personal Account'){
        let result  = this.http.post(cors+environment.ip+'/sort_personal_accounts_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Opportunity'){
        let result  = this.http.post(cors+environment.ip+'/sort_opportunities_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Supplier'){
        let result  = this.http.post(cors+environment.ip+'/sort_suppliers_fields',data).pipe(map((response: Response) => response));
        return result;
       }

  }
    public getAllfields_admin(cat){
     if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/admin_addfield_o_a').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Account'){
        let result  = this.http.get(environment.ip+'/admin_addfield_accounts_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Contact'){
        let result  = this.http.get(environment.ip+'/admin_addfield_contacts_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Personal Account'){
        let result  = this.http.get(environment.ip+'/admin_addfield_pa_a').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Leads'){
        let result  = this.http.get(environment.ip+'/admin_addfield_leads_active').pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Supplier'){
        let result  = this.http.get(environment.ip+'/admin_addfield_suppliers_active').pipe(map((response: Response) => response));
        return result;
       }
  }
    public getAllstandard_admin(cat){
        var result=[];
      if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_opp_admin').pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Account'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_account_admin').pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Contact'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_contact_admin').pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Personal Account'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_personal_account_admin').pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Leads'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_lead_admin').pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Supplier'){
        let result  = this.http.get(environment.ip+'/admin/rest_standard_fields_suppliers_admin').pipe(map((response: Response) => response));
        return result;
       }
      
  }

 public update_standard_fields_status(id,val,cat){
     if(cat=='Opportunity'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_opp_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Account'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_account_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Contact'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_contact_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Personal Account'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_personal_account_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Leads'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_lead_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Supplier'){
        var data={'status':val}
       let result = this.http.post(environment.ip+'/admin/update_supplier_standard_fields_status/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
 }
  public sort_st_fileds(data,cat){
    var cors=""; 
    if (location.hostname.search("192.168")>=0   ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    }  
       if(cat=='Opportunity'){
        let result  = this.http.post(cors+environment.ip+'/sort_opportunities_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Account'){
        let result  = this.http.post(cors+environment.ip+'/sort_accounts_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Contact'){
        let result  = this.http.post(cors+environment.ip+'/sort_contacts_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Personal Account'){
        let result  = this.http.post(cors+environment.ip+'/sort_personal_accounts_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Leads'){
        let result  = this.http.post(cors+environment.ip+'/sort_leads_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Supplier'){
        let result  = this.http.post(cors+environment.ip+'/sort_suppliers_st_fields',data).pipe(map((response: Response) => response));
        return result;
       }

  }
 public update_standard_fields_mandatory(id,val,cat){
     if(cat=='Opportunity'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_opp_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Account'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_account_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Contact'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_contact_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Personal Account'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_personal_account_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Leads'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_lead_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
     if(cat=='Supplier'){
        var data={'mandatory':val}
       let result = this.http.post(environment.ip+'/admin/update_supplier_standard_fields_mandatory/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
 }
  public getStForm(id,cat){
     if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/admin/edit_opp_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       } 
      if(cat=='Account'){
        let result  = this.http.get(environment.ip+'/admin/edit_account_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Contact'){
        let result  = this.http.get(environment.ip+'/admin/edit_contact_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Personal Account'){
        let result  = this.http.get(environment.ip+'/admin/edit_personal_account_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Leads'){
        let result  = this.http.get(environment.ip+'/admin/edit_lead_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       }
      if(cat=='Supplier'){
        let result  = this.http.get(environment.ip+'/admin/edit_supplier_standard_fields/'+id).pipe(map((response: Response) => response));
        return result;
       }
      
   }
  public getForm(id,cat){
     if(cat=='Opportunity'){
        let result  = this.http.get(environment.ip+'/rest_addfield_opportunities/'+id).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Account'){
        let result  = this.http.get(environment.ip+'/rest_addfield_accounts/'+id).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Contact'){
        let result  = this.http.get(environment.ip+'/rest_addfield_contacts/'+id).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Personal Account'){
        let result  = this.http.get(environment.ip+'/rest_addfield_personal_accounts/'+id).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Leads'){
        let result  = this.http.get(environment.ip+'/rest_addfield_leads/'+id).pipe(map((response: Response) => response));
        return result;
       }
       if(cat=='Supplier'){
        let result  = this.http.get(environment.ip+'/rest_addfield_suppliers/'+id).pipe(map((response: Response) => response));
        return result;
       }
  }
  public createform(data:any,cat:any){
    if(cat=='Opportunity'){
        let result = this.http.post(environment.ip+'/rest_addfield_opportunities',data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Account'){
        let result = this.http.post(environment.ip+'/rest_addfield_accounts',data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Contact'){
        let result = this.http.post(environment.ip+'/rest_addfield_contacts',data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Personal Account'){
        let result = this.http.post(environment.ip+'/rest_addfield_personal_accounts',data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Leads'){
        let result = this.http.post(environment.ip+'/rest_addfield_leads',data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Supplier'){
        let result = this.http.post(environment.ip+'/rest_addfield_suppliers',data).pipe(map((response: Response) => response));
        return result;
    }
  }
  public updatestform(data:any,id:any,cat:any){
    if(cat=='Opportunity'){
        let result = this.http.post(environment.ip+'/admin/update_opp_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Account'){
        let result = this.http.post(environment.ip+'/admin/update_account_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Contact'){
        let result = this.http.post(environment.ip+'/admin/update_contact_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Personal Account'){
        let result = this.http.post(environment.ip+'/admin/update_personal_account_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Leads'){
        let result = this.http.post(environment.ip+'/admin/update_lead_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Supplier'){
        let result = this.http.post(environment.ip+'/admin/update_supplier_standard_fields/'+id,data).pipe(map((response: Response) => response));
        return result;
    }


  }
  public updateform(data:any,id:any,cat:any){
    if(cat=='Opportunity'){
        let result = this.http.patch(environment.ip+'/rest_addfield_opportunities/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Account'){
        let result = this.http.patch(environment.ip+'/rest_addfield_accounts/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Contact'){
        let result = this.http.patch(environment.ip+'/rest_addfield_contacts/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Personal Account'){
        let result = this.http.patch(environment.ip+'/rest_addfield_personal_accounts/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Leads'){
        let result = this.http.patch(environment.ip+'/rest_addfield_leads/'+id,data).pipe(map((response: Response) => response));
        return result;
    }
    if(cat=='Supplier'){
        let result = this.http.patch(environment.ip+'/rest_addfield_suppliers/'+id,data).pipe(map((response: Response) => response));
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
public getAllUsers(){
  let result = this.http.get(environment.ip+'/rest_users').pipe(map((response: Response) => response));
  return result;
 }
 public delete_view(id:number,type:any){
  var view_data={"id":id};
  if(type=='lead'){
     let result = this.http.delete(environment.ip+'/rest_leads_views/'+id).pipe(map((response: Response) => response));
     return result;
  }
  if(type=='account'){
     let result = this.http.delete(environment.ip+'/rest_accounts_views/'+id).pipe(map((response: Response) => response));
     return result;
  }
  if(type=='contact'){
     let result = this.http.delete(environment.ip+'/rest_contacts_views/'+id).pipe(map((response: Response) => response));
     return result;
  }
  if(type=='opportunities'){
     let result = this.http.delete(environment.ip+'/rest_opportunities_views/'+id).pipe(map((response: Response) => response));
     return result;
  }
  if(type=='personalaccounts'){
     let result = this.http.delete(environment.ip+'/rest_personal_accounts_views/'+id).pipe(map((response: Response) => response));
     return result;
  }
  if(type=='task'){   
     let result = this.http.delete(environment.ip+'/rest_tasks_views/'+id).pipe(map((response: Response) => response));
     return result; 
  }
  if(type=='supplier'){   
     let result = this.http.delete(environment.ip+'/rest_suppliers_views/'+id).pipe(map((response: Response) => response));
     return result; 
  }
   
 }
  public changeOwner(changeOwn:any,type:any){
    if(type=='account'){
      let result = this.http.post(environment.ip+'/rest_accounts_change_owner',changeOwn).pipe(map((response: Response) => response));
      return result;
    }
    if(type=='contact'){
      let result = this.http.post(environment.ip+'/rest_contacts_change_owner',changeOwn).pipe(map((response: Response) => response));
      return result;
    }
    if(type=='lead'){
      let result = this.http.post(environment.ip+'/rest_leads_change_owner',changeOwn).pipe(map((response: Response) => response));
     return result;
    }
    if(type=='per_acc'){
      let result = this.http.post(environment.ip+'/rest_personal_accounts_change_owner',changeOwn).pipe(map((response: Response) => response));
      return result;
    }
    if(type=='supplier'){
      let result = this.http.post(environment.ip+'/rest_suppliers_change_owner',changeOwn).pipe(map((response: Response) => response));
      return result;
    }

 
 }
  public changeOwnerMultiple(changeOwn:any,type:any){
     
    if(type=='lead'){
      let result = this.http.post(environment.ip+'/rest_leads_change_owner_multiple',changeOwn).pipe(map((response: Response) => response));
     return result;
    }  

 
 }
  public searh_email(key:any,type:any){
    if(type=='accounts'){
      let result = this.http.get(environment.ip+'/rest_accounts_s_emails?s='+key).pipe(map((response: Response) => response));
       return result;
    }
    if(type=='contacts'){
      let result = this.http.get(environment.ip+'/rest_contacts_s_emails?s='+key).pipe(map((response: Response) => response));
       return result;
    }
    if(type=='personalaccounts'){
      let result = this.http.get(environment.ip+'/rest_personal_accounts_s_emails?s='+key).pipe(map((response: Response) => response));
       return result;
    }
    if(type=='leads'){
      let result = this.http.get(environment.ip+'/rest_leads_s_emails?s='+key).pipe(map((response: Response) => response));
       return result;
    }
    if(type=='opportuntities'){
      let result = this.http.get(environment.ip+'/rest_oppportunities_s_emails?s='+key+'&t=personalaccount').pipe(map((response: Response) => response));
       return result;
    } 

  }
  public search_email_opp(key:any,type:any){    
      let result = this.http.get(environment.ip+'/rest_oppportunities_s_emails?s='+key+'&t='+type).pipe(map((response: Response) => response));
       return result;
    }
    geocodeAddress(address:any){
     var cors=""; 
        if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0  ||  location.hostname.search("localh")>=0){ 
            // cors="https://cors-anywhere.herokuapp.com/";   
        } 
        let result  = this.customHttpClient.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyBpny7f4norxynsPJphb9x5miXPCMETyN8').pipe(map((response: Response) => response));
        console.log(result); 
        return result;
  
 }

   getGeoAddress(lat:any,lon:any){
    var cors=""; 
        if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0  ||  location.hostname.search("localh")>=0){ 
            // cors="https://cors-anywhere.herokuapp.com/";   
        } 
     var g_url=cors+"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key=AIzaSyBpny7f4norxynsPJphb9x5miXPCMETyN8";
       let result  = this.customHttpClient.get(g_url).pipe(map((response: Response) => response));
        console.log(result);
        return result;
  
 }

   custom_getGeoAddress(lat:any,lon:any){

//     let headers = new Headers();
// headers.append('Content-Type','application/json');
// headers.append('Authorization', 'Basic cvcbcvbcb' );
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};
//post data missing(here you pass email and password)
var data= {
"email":'email',
"password":'password'
}
 var g_url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key=AIzaSyBpny7f4norxynsPJphb9x5miXPCMETyN8";
return this.http.post('http://g_url.com',data,httpOptions).pipe(map((response: Response) => response));
  
 }


 sendWatapp(data:any){
     let result = this.http.post(environment.ip+'/send-whatsapp-message',data).pipe(map((response: Response) => response));
      return result;
 }

 sendWatappMedia(data:any){
     let result = this.http.post(environment.ip+'/send-whatsapp-media',data).pipe(map((response: Response) => response));
      return result;
 }
sendWhatsappTemplate(data:any){

     let result = this.http.post(environment.ip+'/send-whatsapp-template',data).pipe(map((response: Response) => response));
      return result;
}
  public getAllCountry(){

    
      let result = this.http.get(environment.ip+'/countries').pipe(map((response: Response) => response));
      
    //let result = this.http.get(environment.pullit+'allcountry').pipe(map((response: Response) => response));
    return result;
  }
    getTenantDetails(){

         let result = this.http.get(environment.ip+'/get_tenant_user_details').pipe(map((response: Response) => response));
          return result;
    }
 chekFbStatus(){

     let result = this.http.get(environment.ip+'/check_tenant_fb').pipe(map((response: Response) => response));
      return result;
 }

 pull_leads(){

     let result = this.http.get(environment.ip+'/pull_leads_fb').pipe(map((response: Response) => response));
      return result;
 }
save_fb_leads(data:any){ 
     var fb_data={"ids":data}; 
     let result = this.http.post(environment.ip+'/save_fb_leads',fb_data).pipe(map((response: Response) => response));
      return result;
}

delete_fb_leads(id:any){ 
     let result = this.http.get(environment.ip+'/delete_external_lead/'+id).pipe(map((response: Response) => response));
     return result;
}
getFBpageDetails(page_id:any,access_token:any){

     let result = this.http.get('https://graph.facebook.com/'+page_id+'?fields=name,about,attire,bio,location,parking,hours,emails,website,picture&access_token='+access_token).pipe(map((response: Response) => response));
     return result;

}

 update_add_fields_status(id,val,cat){
        var data={'type':cat,'id':id,'value':val};

       let result = this.http.post(environment.ip+'/status_update_additional_field',data).pipe(map((response: Response) => response));
        return result; 
 }

 set_mandotaory_add_field(id,val,cat){
        var data={'type':cat,'id':id,'value':val}; 
       let result = this.http.post(environment.ip+'/mandatory_update_additional_field',data).pipe(map((response: Response) => response));
        return result; 
 }

 getWatappMedia(id:any){
    var data={"id":id};
     let result = this.http.post(environment.ip+'/get-media',data).pipe(map((response: Response) => response));
      return result;
 }
}
