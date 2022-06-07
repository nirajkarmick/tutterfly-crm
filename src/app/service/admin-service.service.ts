
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http:HttpClient ) { }

  // public getState(){
  //   let result = this.http.post(environment.ip+'/admin/dashboard').map((response: Response) => response);
  //   return result;
  // }
  // public getCity(){
  //   let result = this.http.get(environment.ip+'/admin/dashboard').map((response: Response) => response);
  //   return result;
  // }
  public getIndexCall(){
    let result = this.http.get(environment.ip+'/admin/dashboard').pipe(map((response: Response) => response));
    return result;
  }
 
    public getCountryList(){
      let result = this.http.get(environment.ip+'/countries').pipe(map((response: Response) => response));
      return result;
    }
  public getAllUserIndex(){
    let result = this.http.get(environment.ip+'/admin/rest_users').pipe(map((response: Response) => response));
    return result;
  }
  public getAllUserCreateGet(){
    let result = this.http.get(environment.ip+'/admin/rest_users/create').pipe(map((response: Response) => response));
    return result;
  }
  public showUserDetails(id:number){
    let result = this.http.get(environment.ip+'/admin/rest_users/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public getUser(id:number){
    let result = this.http.get(environment.ip+'/admin/rest_users/'+id+'/edit').pipe(map((response: Response) => response));
    return result;
  }
  public saveUser(name:any){
    let result = this.http.post(environment.ip+'/admin/rest_users',name).pipe(map((response: Response) => response));
    return result;
  }
  public updateUser(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_users/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
  public getAllIndustries(){
    let result = this.http.get(environment.ip+'/admin/rest_industries').pipe(map((response: Response) => response));
    return result;
  }
  public saveIndustry(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_industries',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateIndustry(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_industries/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public deleteStage(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_sales_stages/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public getSaleStages(){
    let result = this.http.get(environment.ip+'/admin/rest_sales_stages').pipe(map((response: Response) => response));
    return result;
  }
  public createSalesStage(element:any){
    let result = this.http.post(environment.ip+'/admin/rest_sales_stages',element).pipe(map((response: Response) => response));
    return result;
  }
  public editSalesStageMeta(id:number){
    let result = this.http.get(environment.ip+'/admin/rest_sales_stages/'+id+'/edit').pipe(map((response: Response) => response));
    return result;
  }
  public updateSalesStage(id:number,element:any){
    let result = this.http.patch(environment.ip+'/admin/rest_sales_stages/'+id,element).pipe(map((response: Response) => response));
    return result;
  }
  public getEmailTemplate(){
    let result = this.http.get(environment.ip+'/admin/rest_email_templates').pipe(map((response: Response) => response));
    return result;
  }
  public saveEmailTemplate(name:any){
    let result = this.http.post(environment.ip+'/admin/rest_email_templates',name).pipe(map((response: Response) => response));
    return result;
  }
  public updateEmailTemplate(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_email_templates/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
  public getSalutations(){
    let result = this.http.get(environment.ip+'/admin/rest_salutations').pipe(map((response: Response) => response));
    return result;
  }
  public saveSalutation(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_salutations',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateSalutation(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_salutations/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public getLeadRating(){
    let result = this.http.get(environment.ip+'/admin/rest_ratings').pipe(map((response: Response) => response));
    return result;
  }
  public saveLeadRating(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_ratings',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateLeadRating(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_ratings/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public getLeadStatus(){
    let result = this.http.get(environment.ip+'/admin/rest_lead_statuses').pipe(map((response: Response) => response));
    return result;
  }
  public saveLeadStatus(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_lead_statuses',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateLeadStatus(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_lead_statuses/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public getTaskStatus(){
    let result = this.http.get(environment.ip+'/admin/rest_task_statuses').pipe(map((response: Response) => response));
    return result;
  }
  public saveTasktatus(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_task_statuses',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateTasktatus(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_task_statuses/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public getTaskPriorities(){
    let result = this.http.get(environment.ip+'/admin/rest_task_priorities').pipe(map((response: Response) => response));
    return result;
  }
  public saveTaskPriority(name:string){
    let result = this.http.post(environment.ip+'/admin/rest_task_priorities',{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public updateTaskPriority(id:number,name:string){
    let result = this.http.patch(environment.ip+'/admin/rest_task_priorities/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
  }
  public getInclusions(){
    let result = this.http.get(environment.ip+'/admin/rest_inclusions').pipe(map((response: Response) => response));
    return result;
  }
  public getOppTags(){
    let result = this.http.get(environment.ip+'/admin/rest_opportunity_tags').pipe(map((response: Response) => response));
    return result;
  }


  public saveInclusion(name:string,aliasName:string){
    let result = this.http.post(environment.ip+'/admin/rest_inclusions',{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }
  public updateInclusion(id:number,name:string,aliasName:string){
    let result = this.http.patch(environment.ip+'/admin/rest_inclusions/'+id,{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }

  public saveOppTags(name:string,aliasName:string){
    let result = this.http.post(environment.ip+'/admin/rest_opportunity_tags',{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }
  public updateOppTags(id:number,name:string,aliasName:string){
    let result = this.http.patch(environment.ip+'/admin/rest_opportunity_tags/'+id,{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }
  public getOpDestinations(){
    let result = this.http.get(environment.ip+'/admin/rest_destinations').pipe(map((response: Response) => response));
    return result;
  }
  public createOpDestinations(){
    //let result = this.http.get(environment.ip+'/admin/rest_destinations/create').map((response: Response) => response);
    let result = this.http.get(environment.pullit+'allcountry').pipe(map((response: Response) => response));
    return result;
  }


  public getdestinations(id:any){
    let result = this.http.get(environment.pullit+'/getdestinations?iso_3='+id).pipe(map((response: Response) => response));
    return result;
  }

  public getStates(id:number){
    let result = this.http.post(environment.ip+'/states',{"country_id":id}).pipe(map((response: Response) => response));
    return result;
  }
  public getCity(id:number){
    let result = this.http.post(environment.ip+'/cities',{"state_id":id}).pipe(map((response: Response) => response));
    return result;
  }
  public saveOpDestinations(dest:any){
    let result = this.http.post(environment.ip+'/admin/rest_destinations',dest).pipe(map((response: Response) => response));
    return result; 
  }
  public updateOpDestinations(dest:any,id:any){
    let result = this.http.patch(environment.ip+'/admin/rest_destinations/'+id,dest).pipe(map((response: Response) => response));
    return result; 
  }
  public getDestination(id:number){
    let result = this.http.get(environment.ip+'/admin/rest_destinations/'+id+'/edit').pipe(map((response: Response) => response));
    return result;
  }
  public getExps(){
    let result = this.http.get(environment.ip+'/admin/rest_experiences').pipe(map((response: Response) => response));
    return result;
  }
  public saveExp(name:string,aliasName:string){
    let result = this.http.post(environment.ip+'/admin/rest_experiences',{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }
  public updateExp(id:number,name:string,aliasName:string){
    let result = this.http.patch(environment.ip+'/admin/rest_experiences/'+id,{'name':name,'alias_name':aliasName}).pipe(map((response: Response) => response));
    return result;
  }
  public getCompany(){
    let result = this.http.get(environment.ip+'/admin/rest_company_settings').pipe(map((response: Response) => response));
    return result;
  }
  public getCompanyEdit(id:number){
    let result = this.http.get(environment.ip+'/admin/rest_company_settings/'+id+'/edit').pipe(map((response: Response) => response));
    return result;
  }
  public updateCompany(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_company_settings/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
public updateCompanyBank(id:number,name:any){
    //let result = this.http.post('https://cors-anywhere.herokuapp.com/'+environment.ip+'/admin/bank_update',name).pipe(map((response: Response) => response));
    let result = this.http.post(environment.ip+'/admin/bank_update',name).pipe(map((response: Response) => response));
    
    return result;
  }
public updateLogo(name:any){
    let result = this.http.post(environment.ip+'/admin/logo_update',name).pipe(map((response: Response) => response));
    return result;
  }
  public getFooters(){
    let result = this.http.get(environment.ip+'/admin/rest_email_footers').pipe(map((response: Response) => response));
    return result;
  }
  public getDocHeaderFooters(){
    let result = this.http.get(environment.ip+'/rest_header_footers').pipe(map((response: Response) => response));
    return result;
  }
  public saveHeaderFooter(name:any){
    let result = this.http.post(environment.ip+'/rest_header_footers',name).pipe(map((response: Response) => response));
    return result;
  }
  public updateHeaderFooter(id:number,name:any){
    let result = this.http.patch(environment.ip+'/rest_header_footers/'+id,name).pipe(map((response: Response) => response));
    return result;
  }

  public getItinInclusion(){
    let result = this.http.get(environment.ip+'/admin/rest_itinerary_inclusions').pipe(map((response: Response) => response));
    return result;
  }
  public saveItinInclusion(name:any){
    let result = this.http.post(environment.ip+'/admin/rest_itinerary_inclusions',name).pipe(map((response: Response) => response));
    return result;
  }
  public updateItinInclusion(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_itinerary_inclusions/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
 
  public active_inactive_user(email:string,active_flag:string){
    if(active_flag=='A'){
         let result = this.http.post(environment.ip+'/admin/rest_users_reactivate',{'email':email}).pipe(map((response: Response) => response));
         return result;
    }else{
         let result = this.http.post(environment.ip+'/admin/rest_users_deactivate',{'email':email}).pipe(map((response: Response) => response));
         return result;
    }
    
  }

  public saveFooter(name:any){
    let result = this.http.post(environment.ip+'/admin/rest_email_footers',name).pipe(map((response: Response) => response));
    return result;
  }
  public updateFooter(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_email_footers/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
  public getUserProfile(){
    let result = this.http.get(environment.ip+'/admin/rest_roles').pipe(map((response: Response) => response));
    return result;
  }
  public getUserUnderProfile(id){
    let result = this.http.get(environment.ip+'/admin/rest_roles/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public updateUserProfile(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_roles/'+id,name).pipe(map((response: Response) => response));
    return result;
  }
  public saveUserProfile(name:any){
    let result = this.http.post(environment.ip+'/admin/rest_roles',{"name":name}).pipe(map((response: Response) => response));
    return result;
  }
  public deleteUserProfile(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_roles/'+id).pipe(map((response: Response) => response));
    return result;
  }

public deleteUserRole(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_role_hierarchies/'+id).pipe(map((response: Response) => response));
    return result;
  }

  
public deleteLeadStatus(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_lead_statuses/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public deleteEmailTemp(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_email_templates/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public deleteEmailFooter(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_email_footers/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteTaskPr(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_task_priorities/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteTaskStatus(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_task_status/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteLeadRating(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_ratings/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteIndustries(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_industries/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteOppTag(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_opportunity_tags/'+id).pipe(map((response: Response) => response));
    return result;
  }

  
  // public deleteUsers(id:number){
  //   let result = this.http.delete(environment.ip+'/admin/rest_users/'+id).pipe(map((response: Response) => response));
  //   return result;
  // }
public deleteInclu(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_inclusions/'+id).pipe(map((response: Response) => response));
    return result;
  }
public deleteExperience(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_experiences/'+id).pipe(map((response: Response) => response));
    return result;
  }

public deleteItinInc(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_itinerary_inclusions/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public deleteSalutation(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_salutations/'+id).pipe(map((response: Response) => response));
    return result;
  }
 public deleteDestin(id:number){
    let result = this.http.delete(environment.ip+'/admin/rest_destinations/'+id).pipe(map((response: Response) => response));
    return result;
  }
  
  public getUserRole(id:any){
    if(id){
      id='/'+id;  
    }
    let result = this.http.get(environment.ip+'/admin/rest_role_hierarchies'+id).pipe(map((response: Response) => response));
    return result;
  }

  public getAllUser(id:any){
    let result = this.http.get(environment.ip+'/admin/rest_role_hierarchies_assign/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public saveUserRole(name:any,id:any){
    let result = this.http.post(environment.ip+'/admin/rest_role_hierarchies',{"name":name,"parent_id":id}).pipe(map((response: Response) => response));
    return result;
  }
  public assignUserRole(assign_users:any,role_hierarchy_id:any,role_hierachy_name:any){
    
    let result = this.http.post(environment.ip+'/admin/rest_role_hierarchies_assign',{"role_hierachy_name":role_hierachy_name,"role_hierarchy_id":role_hierarchy_id,"assign_users":assign_users}).pipe(map((response: Response) => response));
    return result;
  }
  public updateUserRole(id:number,name:any){
    let result = this.http.patch(environment.ip+'/admin/rest_role_hierarchies/'+id,{"name":name}).pipe(map((response: Response) => response));
    return result; 
  }


  public sort_industry_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_industry_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_experiences_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_experiences_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_inclusions_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_inclusions_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_opp_tags_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_opportunity_tags_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_salutations_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_salutations_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_task_priorities_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_task_priorities_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_task_statuses_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_task_statuses_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_lead_statuses_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_lead_statuses_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_ratings_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_ratings_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }
  public sort_sales_stages_fields(p_data:any){    
    let result = this.http.post(environment.ip+'/admin/sort_sales_stages_fields',p_data).pipe(map((response: Response) => response));
    return result;
  }  
  public getBillingDetails(){
    let result = this.http.get(environment.ip+'/admin/billing').pipe(map((response: Response) => response));
    return result;
  }

  public get_supplier_picklist(type:any){
    if(type=='ratings'){
      let result = this.http.get(environment.ip+'/admin/supplier_rest_ratings').pipe(map((response: Response) => response));
      return result;
    }else if(type=='types'){
      let result = this.http.get(environment.ip+'/admin/supplier_rest_types').pipe(map((response: Response) => response));
      return result;      
    }else if(type=='services'){
      let result = this.http.get(environment.ip+'/admin/supplier_rest_services').pipe(map((response: Response) => response));
      return result;      
    }
    
  }
  public sort_supplier_fields(p_data:any,type:any){    
    if(type=='ratings'){
          let result = this.http.post(environment.ip+'/admin/sort_supplier_rating_fields',p_data).pipe(map((response: Response) => response));
          return result;
    }else if(type=='types'){
          let result = this.http.post(environment.ip+'/admin/sort_supplier_type_fields',p_data).pipe(map((response: Response) => response));
          return result;      
    }else if(type=='services'){
          let result = this.http.post(environment.ip+'/admin/sort_supplier_service_fields',p_data).pipe(map((response: Response) => response));
          return result;      
    } 
  }
  public saveSupplierPick(name:string,type:any){ 
    if(type=='ratings'){
      let result = this.http.post(environment.ip+'/admin/supplier_rest_ratings',{'name':name}).pipe(map((response: Response) => response));
      return result;
    }else if(type=='types'){
      let result = this.http.post(environment.ip+'/admin/supplier_rest_types',{'name':name}).pipe(map((response: Response) => response));
      return result;   
    }else if(type=='services'){
      let result = this.http.post(environment.ip+'/admin/supplier_rest_services',{'name':name}).pipe(map((response: Response) => response));
      return result;    
    } 
  }
  public updateSupplierPick(id:number,name:string,type:any){ 
    if(type=='ratings'){
    let result = this.http.patch(environment.ip+'/admin/supplier_rest_ratings/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
    }else if(type=='types'){
    let result = this.http.patch(environment.ip+'/admin/supplier_rest_types/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;
    }else if(type=='services'){
    let result = this.http.patch(environment.ip+'/admin/supplier_rest_services/'+id,{'name':name}).pipe(map((response: Response) => response));
    return result;   
    } 
  }
public deleteSupplierPick(id:number,type:any){
    if(type=='ratings'){
      let result = this.http.delete(environment.ip+'/admin/supplier_rest_ratings/'+id).pipe(map((response: Response) => response));
      return result;
    }else if(type=='types'){
      let result = this.http.delete(environment.ip+'/admin/supplier_rest_types/'+id).pipe(map((response: Response) => response));
      return result;
    }else if(type=='services'){
      let result = this.http.delete(environment.ip+'/admin/supplier_rest_services/'+id).pipe(map((response: Response) => response));
      return result;   
    }  
  }
  public saveSupplierTemplate(data:any){  
      let result = this.http.post(environment.ip+'/admin/rest_supplier_template',data).pipe(map((response: Response) => response));
      return result;
    }
  public updateSupplierTemplate(data:any){  
      let result = this.http.post(environment.ip+'/admin/rest_supplier_template_update',data).pipe(map((response: Response) => response));
      return result;
    }
  public getSupplieEmailTemplate(){
    let result = this.http.get(environment.ip+'/admin/get_supplier_template').pipe(map((response: Response) => response));
    return result;
  }
  public deleteSuppEmailTemp(data:any){
    let result = this.http.post(environment.ip+'/admin/rest_supplier_template_delete',data).pipe(map((response: Response) => response));
    return result;
  }

 public getTemplateAllColumnList(type:any){
          var data={'type':type};
          let result = this.http.post(environment.ip+'/rest_dynamic_email_template_column',data).pipe(map((response: Response) => response));
          return result;

 }
    public getAllColumnList(type:any){
      
      if(type=='Account'){
          let result = this.http.get(environment.ip+'/rest_accounts_columns').pipe(map((response: Response) => response));
          return result;
      }
      if(type=='Contact'){
          let result = this.http.get(environment.ip+'/rest_contacts_columns').pipe(map((response: Response) => response));
          return result;
      }
      if(type=='Lead'){
          let result = this.http.get(environment.ip+'/rest_leads_columns').pipe(map((response: Response) => response));
          return result;
      }
      if(type=='Supplier'){
          let result = this.http.get(environment.ip+'/rest_suppliers_columns').pipe(map((response: Response) => response));
          return result;
      }

      if(type=='Opportunity'){
          let result = this.http.get(environment.ip+'/rest_opportunities_columns').pipe(map((response: Response) => response));
          return result;
      }

      if(type=='PersonalAccount'){
          let result = this.http.get(environment.ip+'/rest_personal_accounts_columns').pipe(map((response: Response) => response));
          return result;
      }

    } 
 public send_reset_pswd(email:any){
          var data={'email':email};
          let result = this.http.post(environment.ip+'/admin/send_reset_pswd',data).pipe(map((response: Response) => response));
          return result;

 }
} 
 