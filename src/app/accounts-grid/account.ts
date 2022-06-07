export class Account {
        id:string;
        name: string;
        account_owner: string;
        acc_type_id: number;
        acc_parent_id: number;
        acc_parent_name:any;
        website: string;
        gstin: number;
        phone: number;
        franchisor_id: number;
        email:string;
        industry_id: number;
        rating_id: number;
        description:any;
        billing_street: string;
        billing_city: string;
        billing_state: string;
        billing_zip: any;
        billing_country: string;
        custom_fields :any[];  
        documents:any;
        owner_id:any;
  acc_whatsapp_no:any;
  acc_whatsapp_no_exist:any;
  tenant_whatsapp_exist:any; 
  whatsapp_no:any;
  whatsapp_activites:any[];
  whatsapp_thread_exist:any;
       public clear(){
        this.id=undefined;
        this.name=undefined;
        this.acc_type_id=undefined;
        this.acc_parent_id=undefined;
        this.website=undefined;
        this.gstin=undefined;
        this.phone=undefined;
        this.franchisor_id=undefined;
        this.email=undefined;
        this.industry_id=undefined;
        this.rating_id=undefined;
        this.billing_street=undefined;
        this.billing_city=undefined;
        this.billing_state=undefined;
        this.billing_zip=undefined;
        this.billing_country=undefined;
      //  this.documents=[];
       

        }
    
}
