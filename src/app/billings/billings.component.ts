import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-billings',
  templateUrl: './billings.component.html',
  styleUrls: ['./billings.component.css']
})
export class BillingsComponent implements OnInit {

constructor(private service: AdminServiceService,private route: ActivatedRoute) { }

billing_estimate:any;
billing_history=[];
billing_user:any;
billing_contact:any;
billing_history_count=0;
userImage="";
UpgradePlanStatus = true
  ngOnInit() {
        this.userImage = localStorage.getItem('userImage');

    this.service.getBillingDetails().subscribe((data: any) => {
      console.log(data, "dhsjbjsbwjbfiuwb")
      //this.billing_estimate=data.billing_estimate;
      this.billing_estimate=data.billing_estimate==undefined?{}:data.billing_estimate;
      if(this.billing_estimate.product_name === "First Class") {
        this.UpgradePlanStatus = false;
      }
      this.billing_history=data.billing_history.data==undefined?[]:data.billing_history.data;
      this.billing_history_count=this.billing_history.length;
      if(this.billing_history_count>4){
          this.billing_history = this.billing_history.slice(0, 4);
      }

      this.billing_contact=data.billing_contacts;
      this.billing_user=data.billing_user; 
      console.log(data);
    }); 

  }

}
