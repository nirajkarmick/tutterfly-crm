import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormService } from '../service/form.service';
import { OppurtunityService } from '../service/opportunity.service';
import { Opportunity } from '../oppurtunity-grid/opportunity'; 
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-add-standard',
  templateUrl: './add-standard.component.html',
  styleUrls: ['./add-standard.component.css']
})
export class AddStandardComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private formService: FormService,private opportunitieservice: OppurtunityService) { }
  @Input() standardFields: any;
  @Input() newStAccPop:any;
  @Input() formTitle:any;
  @Input() extraFields: any;
  @Input() st_formType:any;
  @Input() createData:any;
  newopportunity: Opportunity = new Opportunity();
  //@Output() description_htmlChange = new EventEmitter<any>();
  calender_data = [];
  accounts_client:any;
  AccountCont: boolean = true;
  PerAccountCont: boolean = false;
  popUpMsg: string;
  
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  AccountContShow() {
    this.AccountCont = true;
    this.PerAccountCont = false;
  }
  PerAccountContShow() {
    this.AccountCont = false;
    this.PerAccountCont = true;
  }
  ngOnInit() {
        setTimeout(() => {
            this.load_form_data(); 
        }, 1400); 
    
  }
  picklistValues=[];
  load_form_data(){
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k=0; k < this.standardFields.length;k++) { 
        this.picklistValues.push({'type_value':[{'id':1,"name":"nammmm"}]});
        if(this.standardFields[k].type=='picklist' || this.standardFields[k].type=='select2'){      
          let that=this;
          var pick_name=this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k); 
              this.picklistValues[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              this.standardFields[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              console.log(that.picklistValues[k]);  
             
              }); 
        }
      } 
    }
  } 
  get_picklist_name(picklist_selected){
    var picklistName='';
     
       if(picklist_selected=='industries'){
        picklistName='industries';
       }
       if(picklist_selected=='salutations'){
        picklistName='salutations';
       }
       if(picklist_selected=='ratings'){
        picklistName='ratings';
       }
       if(picklist_selected=='lead_statuses'){
        picklistName='lead_statuses';
       }
       if(picklist_selected=='inclusion_id'){
        picklistName='inclusions';
       }
       if(picklist_selected=='task_priorities'){
        picklistName='task_priorities';
       }
       if(picklist_selected=='experience_id'){
        picklistName='experiences';
       }
       if(picklist_selected=='destination_id'){
        picklistName='destinations';
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistName='itinerary_inclusions';
       }
       if(picklist_selected=='sales_stage_id'){
        picklistName='sales_stages';
       }
       if(picklist_selected=='tag_id'){ 
        picklistName='opportunity_tags';
       }
     return picklistName;

  }
  setPickDropdown(data,picklist_selected){ 
    var picklistAllValue=[];
     
       if(picklist_selected=='industries'){
        picklistAllValue=data.industries;
       }
       if(picklist_selected=='salutations'){
        picklistAllValue=data.salutations;
       }
       if(picklist_selected=='ratings'){
        picklistAllValue=data.ratings;
       }
       if(picklist_selected=='lead_statuses'){
        picklistAllValue=data.lead_statuses;
       }
       if(picklist_selected=='inclusion_id'){
        picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='task_priorities'){
        picklistAllValue=data.task_priorities;
       }
       if(picklist_selected=='experience_id'){
        picklistAllValue=data.experiences;
       }
       if(picklist_selected=='destination_id'){
        picklistAllValue=data.destinations;
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistAllValue=data.itinerary_inclusions;
       }
       if(picklist_selected=='sales_stage_id'){
        picklistAllValue=data.sales_stages;
       }
       if(picklist_selected=='tag_id'){
        console.log(data);
        picklistAllValue=data.opportunity_tags;
       }
     return picklistAllValue;

  }
  validate_date(evnt){
    evnt.target.value='';
    return '';
  }
  selectAccId(val: number) {
    this.autoAccList = [];
    this.fetch_acc_det(val);
    this.newopportunity.account_id = val;
    if (this.newopportunity.account_id != undefined && this.newopportunity.account_id != null) {
     // alert(this.newopportunity.account_id);
      this.opportunitieservice.fetchContactList(this.newopportunity.account_id).subscribe((data: any) => {
       // this.createData.accounts_client = data.contacts;
        this.accounts_client = data.contacts;
        console.log(this.accounts_client); 
      });
    }
  }
    autoAccList = [];
  autoPerAccList = [];
  account_nameSearch: any;
  per_account_nameSearch: any;
  search_acc(evnt) {
    this.autoAccList = [];
    var val = evnt.target.value;

    console.log(val);
    this.opportunitieservice.searh_account(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.accounts) {
        this.autoAccList = data.accounts;
      } else {
        this.autoAccList = [];
      }


    });

  }
  search_per_acc(evnt) {
    this.autoPerAccList = [];
    var val = evnt.target.value;

    console.log(val);
    this.opportunitieservice.searh_p_account(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_accounts) {
        this.autoPerAccList = data.personal_accounts;
      } else {
        this.autoPerAccList = [];
      }


    });

  }
  fetch_acc_det(id) {
    this.autoPerAccList = [];
    this.opportunitieservice.fetch_acc_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.account) {
        this.account_nameSearch = data.account.name;
      }

    });
  }
  selectPerAccId(id) {
    this.newopportunity.personal_account_id = id;
    this.autoPerAccList = [];
    this.opportunitieservice.fetch_p_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_account) {
        this.per_account_nameSearch = data.personal_account.first_name + ' ' + data.personal_account.last_name;
      }

    });
  }

  name_error = false;
  acct_error = false;
  cont_error = false;
  per_error = false;
  err_show = false;
  dest_error = false;

  public extraformModel: any = {};
  customFields: any = [];
  set_extra_field_request() {
    this.customFields = [];
    $('.cust_err_frm').html('');
    //console.log(this.extraformModel);
    var i = 0;
    for (let obj in this.extraformModel) {
      //this.customFields[i]=[];
      console.log(this.extraformModel[obj]);
      var field_obj = this.extraformModel[obj];
      var value = $("#" + field_obj.name).val();
      var chk_av = $("#" + field_obj.name + "_check").length > 0 ? true : false;
      var chk_value = [];
      if (chk_av) {
        $("#" + field_obj.name + "_check input:checked").each(function () {
          chk_value.push($(this).val());
        });
        console.log(chk_value);
        value = chk_value.toString();
      }
      var radio_av = $("#" + field_obj.name + "_radio").length > 0 ? true : false;

      if (radio_av) {
        value = '';
        $("#" + field_obj.name + "_radio input:checked").each(function () {
          value = $(this).val();
        });
      }
      $("#" + field_obj.name).removeClass('frm-danger');
      if (field_obj.mandatory == 1 && value == '') {
        $("#" + field_obj.name).addClass('frm-danger');
        $("#" + field_obj.name + "_err_sp").html('This field is Mandatory!');
        this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
        this.openDialog();
        return false;
      }
      var vJson = {
        "opportunity_id": "",
        "opp_additional_field_id": field_obj.id,
        "field_value": value ? value : '',
        "type": field_obj.type,
        "type_value": field_obj.type_value ? field_obj.type_value.toString() : ''
      };
      // console.log(value); 

      this.customFields.push(vJson);
      //this.customFields[i][key]=value;
      i++;
    }
    console.log(this.customFields);
    this.newopportunity.custom_fields = this.customFields;
    this.submit_opp();

  }
  createnewStOpportunity() {

    console.log(this.newopportunity);
    return false;
    
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newopportunity.custom_fields = [];
      this.submit_opp();
    }
  }
  submit_opp() {
    this.err_show = false;
    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    this.dest_error = false;
    if (this.newopportunity.name == undefined) {
      this.name_error = true;
      this.err_show = true;
      this.popUpMsg = JSON.stringify('Please fill name');
      this.openDialog();
    }
     if (this.newopportunity.destination_id == undefined) {
      this.dest_error = true;
      this.err_show = true;
      this.popUpMsg = JSON.stringify('Please Select Destination(s)');
      this.openDialog();
    }
    if (this.AccountCont && (this.newopportunity.account_id == undefined || this.newopportunity.contact_id == undefined)) {
      this.popUpMsg = JSON.stringify("Please select an account and Contact");
      this.acct_error = true;
      this.cont_error = true;
      this.err_show = true;
      this.openDialog();
    }
    if (!this.AccountCont && this.newopportunity.personal_account_id == undefined) {
      this.popUpMsg = JSON.stringify("Please select a personel account");
      this.per_error = true;
      this.err_show = true;
      this.openDialog();

    }
    if (this.err_show) {
      return;
    }

    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    if (this.AccountCont) {
      this.newopportunity.personal_account_id = undefined;
      this.newopportunity.opportunitable_type = "App\\Account";
    } else {
      this.newopportunity.account_id = undefined;
      this.newopportunity.contact_id = undefined;
      this.newopportunity.opportunitable_type = "App\\PersonalAccount";
    }
    if (this.newopportunity.amount) {
      this.newopportunity.expected_revenue = this.newopportunity.probability * this.newopportunity.amount / 100;
    }
    this.newopportunity.close_date = new Date(this.newopportunity.close_date).toLocaleDateString();
    this.newopportunity.travel_date = new Date(this.newopportunity.travel_date).toLocaleDateString();
    console.log('ready to submit');
    this.opportunitieservice.createClient(this.newopportunity).subscribe(data => {
      this.name_error = false;
      this.acct_error = false;
      this.cont_error = false;
      this.per_error = false; 
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();
      this.newopportunity = new Opportunity(); 
    }, (err) => {
      this.popUpMsg = JSON.stringify(err);
    });

  }
  selectStage(val: string) {
    for (let a of this.createData.sales_stages) {
      if (val == a.id) {
        this.newopportunity.probability = a.probability;
        break;
      }
    }

  }
}
