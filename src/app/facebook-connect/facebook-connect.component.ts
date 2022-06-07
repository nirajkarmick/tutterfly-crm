import { Component, OnInit } from '@angular/core';
import { FormService } from '../service/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-facebook-connect',
  templateUrl: './facebook-connect.component.html',
  styleUrls: ['./facebook-connect.component.css']
})
export class FacebookConnectComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    public dialog: MatDialog) {

    this.renderTenant();
    this.checkFBStatus();
  }
  tenantDetails: any;
  userDetails: any;
  tenantEmail = "";
  tenantDB = "";
  tenantDomain = "";
  tenantFbToken = "";
  tenantId = "";
  isFbConneted = false;
  fb_leads = [];
  selectAll = false;
  fb_leads_total = 0;
  random_hash = window.btoa('567657575uytutuERFTGbvRANDOMSTRINGbnbvnvbnsdfdfgdftytyr');
  popUpMsg: string;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {


  }
  pull_leads() {
    this.formService.pull_leads().subscribe((data: any) => {
      console.log(data);
      this.fb_leads = data.leads;
      if (this.fb_leads && this.fb_leads.length > 0) {
        let j = 0;
        for (let ld of this.fb_leads) {
          this.fb_leads[j].checked = false;
          j++;
        }
      }
      this.fb_leads_total = data.total_leads;

    });

  }
  save_leads() {
    var slected_leads = [];
    var is_checked = false;
    if (this.fb_leads && this.fb_leads.length > 0) {
      let j = 0;
      for (let ld of this.fb_leads) {
        if (this.fb_leads[j].checked == true) {
          slected_leads.push(ld.id);
          is_checked = true;
        }
        j++;
      }
    } else {
      this.popUpMsg = JSON.stringify('Please select lead(s) to save!');
      this.openDialog();
    }
    console.log(slected_leads);
    if (slected_leads && slected_leads.length == 0) {
      this.popUpMsg = JSON.stringify('Please select lead(s) to save!');
      this.openDialog();

    } else {
      this.formService.save_fb_leads(slected_leads).subscribe((data: any) => {
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.renderTenant();
        this.pull_leads();
      });
    }
  }
  deleteLeads(id, name) {
    name = name ? name : '';
    var conf = confirm("Are you sure to delete " + name + " ?");
    if (conf) {
      this.formService.delete_fb_leads(id).subscribe((data: any) => {
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.pull_leads();

      });
    }
  }
  checkAllLeads(evnt) {
    console.log(this.selectAll);
    if (this.selectAll == true) {
      var change_val = true;
    } else {
      var change_val = false;
    }
    if (this.fb_leads && this.fb_leads.length > 0) {
      let j = 0;
      for (let ld of this.fb_leads) {
        this.fb_leads[j].checked = change_val;
        j++;
      }
    }
  }
  renderTenant() {
    this.fb_leads = [];
    this.fb_leads_total = 0;
    this.selectAll = false;
    //this.fbPageName=[];
    this.formService.getTenantDetails().subscribe((data: any) => {
      console.log(data);
      this.tenantDetails = data.tenant;
      this.userDetails = data.user;
      if (this.tenantDetails != undefined) {
        this.tenantEmail = this.userDetails.email;;
        this.tenantDB = this.tenantDetails.db_uuid;
        this.tenantDomain = this.tenantDetails.subdomain;
        this.tenantId = this.tenantDetails.tenant_id;

      }

    });
  }
  // showButton = true;
  fbPageName = []; 
  fbPageLeads = []; 
  checkFBStatus() {
    this.fbPageName = [];
    this.formService.chekFbStatus().subscribe((data: any) => {
      console.log(data, 'hdjsksbskjcbsjcbjscbbscsbc');
      this.isFbConneted = data.fb_status;
      // if (this.isFbConneted == true) {
      //   this.showButton = false
      // }
      this.fbPageName = data.page_names;
      this.fbPageLeads = data.page_leads;
      this.tenantFbToken = data.fb_data.access_token;
      this.getFbPageDetails();

    });
  }
  allPages = [];
  getFbPageDetails() {
    this.allPages = [];
    if (this.fbPageName && this.fbPageName.length > 0) {
      let j = 0;
      for (let ld of this.fbPageName) {
        this.formService.getFBpageDetails(ld.p_id, this.tenantFbToken).subscribe((data: any) => {
          console.log(data);
          this.allPages.push(data);

        });
      }
    }
  }


}
