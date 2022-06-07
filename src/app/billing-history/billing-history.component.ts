import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.css']
})
export class BillingHistoryComponent implements OnInit {

  constructor(private service: AdminServiceService,private route: ActivatedRoute) { }

billing_estimate:any;
billing_history:any;
billing_user:any;
billing_contact:any;
billing_history_count=0;
userImage="";
  ngOnInit() {
        this.userImage = localStorage.getItem('userImage');

    this.service.getBillingDetails().subscribe((data: any) => {
      this.billing_estimate=data.billing_estimate;
      this.billing_history=data.billing_history.data;
      this.billing_history_count=this.billing_history.length; 

      this.billing_contact=data.billing_contacts;
      console.log(data);
    });
 

  }
 
 

}
