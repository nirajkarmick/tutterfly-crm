import {Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsMapService} from '../service/accounts-map.service';
import {EmailClass} from '../client-details/email-class';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Alert} from 'selenium-webdriver';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {OppurtunityService} from '../service/opportunity.service';
import {Opportunity} from '../oppurtunity-grid/opportunity';
import {EventClass} from '../contact-details/event-class';
import {ViewAllComponent} from '../view-all/view-all.component';
import {MessageService} from '../message.service';
import {FormService} from '../service/form.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
// import html2canvas from 'html2canvas';
import {ItineraryService} from '../itinerary.service'; 
import {FileService} from '../file.service'; 

// import {PullitServiceService} from '../service/pullit-service.service';
@Component({
  selector: 'app-oppo-details',
  templateUrl: './oppo-details.component.html',
  styleUrls: ['./oppo-details.component.css']
})
export class OppoDetailsComponent implements OnInit {
  event: EventClass = new EventClass();
  popUpMsg: any = "";
  id: number;
  clientData: any;
  clientDetails: Opportunity;
  accountObject: any;
  createData: any;
  opportunities: any = [];
  Opportunity: any = [];
  rOpportunity: any = [];
  logOpportunity: any;
  countryList: any[];
  public todayDate: any = new Date();
  stateList: any[];
  cityList: any[];
  current_stage: any;
  public options: Object = {
    placeholderText: 'Enter Text',
    charCounterCount: false
  }
  public destOptions: Select2Options;
  public incOptions: Select2Options;
  public tagOptions: Select2Options;
  AccountCont: boolean = true;
  PerAccountCont: boolean = false;
  update_stage_flag = false;


  isAttachment = true;

  module_attachment: any = [];
  module_attachment_urls: any = [];
  documentData: any = [];
  attachModalOpen = false;

  openAttachModeal() {
    this.attachModalOpen = true;
  }

  closeAttachModeal() {
    this.attachModalOpen = false;
  }

  emailAttachModalOpen=false;
  openEmailAttachModeal(){
    this.emailAttachModalOpen=true;
  }
  closeEmailAttachModeal(){
    this.emailAttachModalOpen=false;
  }
  removeModAttachment(index) {
    this.module_attachment.splice(index, 1);
    this.documentData.splice(index, 1);
  }

  updateEventHander($event: any) {
    this.renderData();
  }

  AccountContShow() {
    this.AccountCont = true;
    this.PerAccountCont = false;
  }

  PerAccountContShow() {
    this.AccountCont = false;
    this.PerAccountCont = true;
  }

  /*Convert lead*/
  ConvertLeadPop: boolean = false;

  ConvertLeadPopShow() {
    this.ConvertLeadPop = true;
  }

  ConvertLeadPopHide() {
    this.ConvertLeadPop = false;
  }

  NewAccCont: boolean = true
  ExtCont: boolean = false;

  CreateNewAcc() {
    this.NewAccCont = true;
    this.ExtCont = false;
  }

  ChooseExistAcc() {
    this.NewAccCont = false;
    this.ExtCont = true;
  }

  emailTemplate: any;
  supplier_email_temp: any;
  call: any = {
    "subject": undefined,
    "due_date": undefined,
    "Opportunity_id": undefined,
    "taskable_type": "App\\Opportunity",
    "taskable_id": undefined,
    "status": "completed"

  }

  task: any = {
    "assigned_user_id": undefined,

    "subject": undefined,
    "due_date": undefined,
    "Opportunity_id": undefined,
    "taskable_type": "App\\Opportunity",
    "taskable_id": undefined,
    "status": "open"
  }

  EditAccPop: boolean = false;
  EditStAccPop: boolean = false;
  openStandard_f = false;
  isStandard = false;
  standardFields = [];
  formTitle = "Edit Opportunity(standard)";
  st_formType = "Opportunity";

  openEditOpportunityPop() {
    this.EditAccPop = true;
    this.AccountPersonalShow();
    if (this.newOpportunity.travel_date == '1970-01-01') {
      this.newOpportunity.travel_date = '';
    }
    if (this.newOpportunity.close_date == '1970-01-01') {
      this.newOpportunity.close_date = '';
    }
  }

  openEditStOpportunityPop() {
    this.EditStAccPop = true;
    if (this.PerAccountCont) {
      console.log('ff');
    }
    this.AccountPersonalShow();
    if (this.newOpportunity.travel_date == '1970-01-01') {
      this.newOpportunity.travel_date = '';
    }
    if (this.newOpportunity.close_date == '1970-01-01') {
      this.newOpportunity.close_date = '';
    }
  }

  AccountPersonalShow() {
    if (this.accountObject.contact == undefined) {
      this.PerAccountCont = true;
      this.AccountCont = false;
    } else {
      this.PerAccountCont = false;
      this.AccountCont = true;
    }
  }

  EvtstartDate = new FormControl(new Date().toLocaleDateString());
  EvtEndDate = new FormControl(new Date().toLocaleDateString());

  newOpportunity: Opportunity = new Opportunity();
  assignedUserList: any[] = [];
  myControl3: FormControl = new FormControl();
  myControl2: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  assignedUserOptions: Observable<string[]>;
  assignedUserOptionsPA: Observable<string[]>;
  date = new FormControl(new Date().toLocaleDateString());
  mail: EmailClass = new EmailClass();
  reportToLst: any = [];
  accountList: any = [];
  allDestinations: any = [];
  allTags: any = [];
  allInclusions: any = [];
  ccBlock: boolean = false;
  bccBlock: boolean = false;
  assignData: any = [];

  selectedDestin(dest_idd: any) {
    console.log(dest_idd);
    this.newOpportunity.destination_id = dest_idd;
    console.log(this.newOpportunity.destination_id);
  }

  selectedIncl(incl_id: any) {
    this.newOpportunity.inclusion_id = incl_id;
    //alert('in');
    console.log(this.newOpportunity.inclusion_id);
  }

  selectedTags(tag_id: any) {
    this.newOpportunity.tag_id = tag_id;
    console.log(this.newOpportunity.tag_id);
  }

  ccBlockShow() {
    this.ccBlock = true;
  }

  bccBlockShow() {
    this.bccBlock = true;
  }

  account_owner: string;


  opp_has_scheduler = false;
  show_schedule = false;
  payment_schedule_list = [{'s_date': new Date(), 'date': '', 'type': 'p', 'amount': 0, 'percentage': 0}];
  schedule_p_type = 'f';
  totalScheduleAmount: number;

  setScheduleAmount() {
    this.schedule_form = false;
    // this.totalScheduleAmount=parseInt(this.newOpportunity.amount);

    if (this.ledger_account_list) {
      this.totalScheduleAmount = this.ledger_account_list.balance_amount;
    } else {
      this.totalScheduleAmount = parseInt(this.newOpportunity.amount);
    }
    if (this.newOpportunity.amount) {

    } else {
      this.popUpMsg = "Please update opportunity amount first"
      this.openDialog();
    }
  }

  addMoreSched() {
    this.payment_schedule_list.push({'s_date': new Date(), 'date': '', 'type': 'p', 'amount': 0, 'percentage': 0});
  }

  removeSched(i) {
    this.payment_schedule_list.splice(i, 1);
    this.ScheduleAmount();

  }

  schedule_err = "";

  changeSchedPaymentType() {
    // this.totalScheduleAmount=parseInt(this.newOpportunity.amount);
    if (this.ledger_account_list) {
      this.totalScheduleAmount = this.ledger_account_list.balance_amount;
    } else {
      this.totalScheduleAmount = parseInt(this.newOpportunity.amount);
    }
    var k = 0;
    console.log(this.payment_schedule_list);
    this.payment_schedule_list = [{'s_date': new Date(), 'date': '', 'type': this.schedule_p_type, 'amount': 0,'percentage':0}];
  }

calculate_schedule(evnt,a_type,count) { 
      console.log(evnt.target.value);
      var app_amnt=evnt.target.value;
      var f_amount=parseInt(this.newOpportunity.amount);
          if(a_type=='a'){
              var deducted_amnt=app_amnt/f_amount * 100;
              if(deducted_amnt>100){
                this.popUpMsg = "Please check amount!"
                this.openDialog();
                return;
              }
            this.payment_schedule_list[count].percentage=deducted_amnt;
          }else{
              if(app_amnt>100){
                this.popUpMsg = "Please check amount!"
                this.openDialog();
                return;
              }
            var deducted_amnt=f_amount*app_amnt/100;
            this.payment_schedule_list[count].amount=deducted_amnt;
          }
       this.ScheduleAmount();

  }

  ScheduleAmount(){


    if (this.ledger_account_list) {
      this.totalScheduleAmount = this.ledger_account_list.balance_amount; 
      var final_amount = this.ledger_account_list.balance_amount;
    } else {
      this.totalScheduleAmount = parseInt(this.newOpportunity.amount);
      var final_amount = this.newOpportunity.amount; 
    }
      this.totalScheduleAmount = parseInt(this.newOpportunity.amount);
      var final_amount = this.newOpportunity.amount;   
    var j = 0;
    for (let p of this.payment_schedule_list) { 
        this.totalScheduleAmount = this.totalScheduleAmount - this.payment_schedule_list[j].amount;
        j++;
    } 
    console.log(this.totalScheduleAmount);
    if (this.totalScheduleAmount < 0) {
      this.schedule_err = "Please Check Amount";
    }
  }
  calculate_schedule_old() {
    //   this.totalScheduleAmount=parseInt(this.newOpportunity.amount);
    if (this.ledger_account_list) {
      this.totalScheduleAmount = this.ledger_account_list.balance_amount;
      var percentageAmount = this.ledger_account_list.balance_amount;
      var final_amount = this.ledger_account_list.balance_amount;
    } else {
      this.totalScheduleAmount = parseInt(this.newOpportunity.amount);
      var final_amount = this.newOpportunity.amount;
      var percentageAmount = this.newOpportunity.amount;
    }

    console.log(this.schedule_p_type);
    var j = 0;
    for (let p of this.payment_schedule_list) {
      if (this.schedule_p_type == 'f') {
        this.totalScheduleAmount = this.totalScheduleAmount - this.payment_schedule_list[j].amount;
      } else { 
        final_amount -= (percentageAmount) * (this.payment_schedule_list[j].amount / 100);

      }
      j++;
    }
    if (this.schedule_p_type == 'p') {
      this.totalScheduleAmount = final_amount;
    }
    if (this.totalScheduleAmount < 0) {
      this.schedule_err = "Please Check Amount";
    }

  }

  schedule_form = false;

  scheduleForm() {
    this.schedule_form = true;
  }

  editSchedule() {
    this.opp_has_scheduler = false;
    this.schedule_form = true;
    this.payment_schedule_list = [];
    for (let dt of this.newOpportunity.schedule_payments) {
      this.payment_schedule_list.push(
        {
          'date': '',
          's_date': new Date(dt.date),
          'type': dt.type,
          'amount': dt.amount,
          'percentage': dt.percentage
        })
     // this.schedule_p_type = dt.type;
    }
    this.ScheduleAmount();
  }

  save_opp_schedule() {
    if (parseInt(this.newOpportunity.amount)) {

    } else {
      this.popUpMsg = "Please update opportunity amount first"
      this.openDialog();
      return false;
    }

    if (this.totalScheduleAmount < 0 || this.totalScheduleAmount > 0) {
      // this.schedule_err="Please Check Amount";
      this.popUpMsg = "Please Check Amount!";
      this.openDialog();
      return;
    }
    var k = 0;
    for (let sc_data of this.payment_schedule_list) {
      if (sc_data.s_date != undefined) {
        sc_data.s_date = new Date(sc_data.s_date);
        var dd = (sc_data.s_date.getDate() < 10 ? '0' : '') + sc_data.s_date.getDate();
        var MM = ((sc_data.s_date.getMonth() + 1) < 10 ? '0' : '') + (sc_data.s_date.getMonth() + 1);
        var yyyy = sc_data.s_date.getFullYear();
        this.payment_schedule_list[k].date = yyyy + '-' + MM + '-' + dd;
      }
      k++;
    }
    var data = {"pay_type": this.schedule_p_type, "schedules": this.payment_schedule_list, "opportunity_id": this.id};
    this.oppoService.saveOppSchedule(data).subscribe((res: any) => {
      this.popUpMsg = res.message;
      this.openDialog();
      this.payment_schedule_list = [{'date': '', 's_date': new Date(), 'type': this.schedule_p_type, 'amount': 0, 'percentage': 0}];
      this.renderData();
    });

  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private oppoService: OppurtunityService,
              public dialog: MatDialog,
              private chk: ChangeDetectorRef,
              private msg: MessageService,
              private formService: FormService,
              // private pullit_service:PullitServiceService,
              private itineraryService: ItineraryService, private fileService: FileService
  ) {
    this.account_owner = localStorage.getItem('user');
    this.msg.sendMessage("oppo");
    this.destOptions = {
      width: '100%',
      multiple: true,
      // tags: true
    };
    this.incOptions = {
      width: '100%',
      multiple: true,
      // tags: true
    };
    this.tagOptions = {
      width: '100%',
      multiple: true,
      // tags: true
    };
    if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0
      || location.hostname.search("tnt1") >= 0 || location.hostname.search("tfc8") >= 0
      ||  location.hostname.search("adrenotravel")>=0
      ||  location.hostname.search("prashtest.")>=0) {

      this.isStandard = true;
      this.show_schedule = true;
      //this.isWhatsappEnabled=true;
    }

    this.oppoService.reportsToList().subscribe((data: any) => {
      this.reportToLst = data.opportunity;
      this.accountList = data.accounts;
    });
    this.renderData();


    this.get_invoice();
    this.isSetupMail = localStorage.getItem('setup_mail');

    if (this.isStandard) {
      this.oppoService.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
      setTimeout(() => {
        this.load_form_data();
      }, 1400);
    }

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  related_itineraries = [];
  ledger_account_list: any;
  ledger_particulars = [];
  ledger_account = {
    "opportunity_id": this.id,
    "amount": undefined,
    "balance_amount": undefined,
    "date": undefined,
    "particulars": undefined,
    "mode": undefined
  };
  itin_selected = [];

  selected_itin() {
    var x = 0;
    var sel_dest = [];
    setTimeout(() => {

      for (let dd of this.related_itineraries) {
        sel_dest.push("" + dd.id);
        x++;
        console.log(sel_dest);
      }
      this.itin_selected = sel_dest;
      console.log(this.itin_selected);
      this.selectedItin = this.itin_selected;
    }, 1000);
  }

  show_itin(id) {
    //this.router.navigate(['/itineraryMain', { outlets: { itinerarySection: ['builder'] } }]);
    // this.router.navigate(['/itineraryMain',{ outlets: { itinerarySection: ['itinerary-builder'] }}]
    //,{queryParams:{ 'id': id}});
    var link = 'itineraryMain/(itinerarySection:itinerary-details)?id=' + id;
    this.router.navigate([]).then(result => {
      window.open(link, '_blank');
    });
  }

  opp_related_tags = [];
  supplier_list = [];
  allSupplier = [];
  selectedSup = [];
  all_fileds_val = [];
  no_email_temp_modules = ['[Account.', '[Lead.', '[Supplier', '[PersonalAccount.', '[Contact.'];

watsapp:any={'recipient_no':'','recipient':'','message':'','whatsapp_type':'','whatsapp_id':''};
 
isWhatsappEnabled=false;
whatsapp_thread_exist=false;  
  renderData() {
    this.email_templates_err = '';
    this.autoItinList = [];
    this.selectedItin = [];
    this.selectedItinData = [];
    this.schedule_err = "";
    this.schedule_form = false;
    $('body').removeClass('modal-open');
    $('body').css('padding-right',0);  
    $('.modal-backdrop').remove(); 
    this.itinOptions = {
      //width: '100%',
      multiple: true,
      // tags: true
    };
    this.oppoService.setUpAccountsMap().subscribe(data => {
      this.createData = data;
    });
    this.id = this.route.snapshot.queryParams['id'];
    this.oppoService.getClientDetails(this.id).subscribe((data: any) => {
      this.clientData = data;
      this.clientData.sales_stages = data.sales_stages;
      this.related_itineraries = data.itineraries;
      this.ledger_account_list = data.ledger_account;
      if (this.ledger_account_list) {
        this.ledger_particulars = this.ledger_account_list.ledger_particulars;
      } else {
        this.ledger_particulars = [];
      }
      console.log(this.ledger_account_list, 'itinnnnnnn');
      if (this.related_itineraries.length > 0) {
        this.selected_itin();
      }
      this.clientData.opportunity = data.opportunity;
      this.documentData = data.opportunity.documents;
      this.module_attachment = [];
      if (this.documentData && this.documentData.length > 0) {
        for (let doc of this.documentData) {
          this.module_attachment.push(doc.title);
        }
      }

      this.current_stage = this.clientData.opportunity.sales_stage_id.position;
      console.log(this.clientData.opportunity);
      this.clientDetails = JSON.parse(JSON.stringify(data.opportunity));
      if (this.clientDetails.opp_whatsapp_no_exist) {
        //this.isWhatsappEnabled=true;
      }
      if (this.clientDetails.tenant_whatsapp_exist) {
        this.isWhatsappEnabled = true;
      }
      if(this.clientDetails.tenant_whatsapp_exist){
        this.isWhatsappEnabled=true;
        this.watsapp.recipient_no=this.clientDetails.whatsapp_no;
        this.watsapp.whatsapp_id = this.clientDetails.id;
        this.watsapp.whatsapp_type = "App\\Opportunity"; 
        this.whatsapp_thread_exist=this.clientDetails.whatsapp_thread_exist
      }
      // let temp = JSON.stringify(data.opportunity);
      if (this.clientData.opportunity.account_id != undefined) {
        this.accountObject = this.clientData.opportunity.account_id;
        this.accountObject.contact = this.clientData.opportunity.contact_id;
        this.mail.to_address = data.opportunity.contact_id.email;
        this.accountObject.contact.name = this.clientData.opportunity.contact_id.first_name != null ? this.clientData.opportunity.contact_id.first_name : "" + " " + this.clientData.opportunity.contact_id.last_name;
      } else {
        this.accountObject = data.opportunity.personal_account_id;
        this.mail.to_address = data.opportunity.personal_account_id.email;
        this.accountObject.name = this.accountObject.salutation + " " + this.accountObject.first_name != null ? this.accountObject.first_name : "" + " " + this.accountObject.last_name;
      }
      this.newOpportunity = this.clientData.opportunity;

      this.newOpportunity.experience_id = this.newOpportunity.experience_id?this.newOpportunity.experience_id.id:'';
      if (this.newOpportunity.account_id != undefined) {
        this.newOpportunity.account_id = this.newOpportunity.account_id.id;
        // alert(this.newOpportunity.account_id);
        this.selectAccId(this.newOpportunity.account_id);
        this.newOpportunity.contact_id = this.newOpportunity.contact_id.id;
      } else {
        this.newOpportunity.personal_account_id = this.newOpportunity.personal_account_id.id;
        this.selectPerAccId(this.newOpportunity.personal_account_id);
      }
      let o_tags = [];
      this.opp_related_tags = this.newOpportunity.tag_id;
      console.log(this.newOpportunity);
      console.log(this.newOpportunity.tag_id);
      // alert(this.newOpportunity.tag_id.length);
      if (this.newOpportunity.tag_id.length > 0) {
        for (let a of this.newOpportunity.tag_id) {
          console.log('tagggggg')
          if (a.id == undefined) {
            o_tags.push(a);
          } else {
            o_tags.push(a.id);

          }
          //o_tags.push(a);
        }
        this.newOpportunity.tag_id = o_tags;
      }
      let inclusion = [];
      if (this.newOpportunity.inclusion_id.length != 0) {
        for (let a of this.newOpportunity.inclusion_id) {
          inclusion.push(a.id);
        }
        this.newOpportunity.inclusion_id = inclusion;
      }
      if (this.newOpportunity.schedule_payments && this.newOpportunity.schedule_payments.length > 0) {

        this.opp_has_scheduler = true;
      }
      this.supplier_list = data.supplier_list == undefined ? [] : data.supplier_list;
      console.log(this.newOpportunity.tag_id);
      console.log(this.newOpportunity.inclusion_id);
      let destination = [];
      this.allDestinations = [];
      setTimeout(() => {
        if (this.createData && this.createData.destinations) {
          for (let destin of this.createData.destinations) {
            this.allDestinations.push({"id": destin.id, "text": destin.name + ', ' + destin.country_name});
          }
        }
        this.allSupplier = [];
        if (this.supplier_list && this.supplier_list.length > 0) {
          for (let sup of this.supplier_list) {
            console.log(sup);
            this.allSupplier.push({"id": sup.id, "text": sup.name+' ('+sup.email+')'});
          }
        }
        this.allInclusions = [];
        if (this.createData && this.createData.inclusions) {
          for (let tag of this.createData.inclusions) {
            this.allInclusions.push({"id": tag.id, "text": tag.name});
          }
        }
        this.allTags = [];
        if (this.createData && this.createData.opportunity_tags) {
          for (let tag of this.createData.opportunity_tags) {
            this.allTags.push({"id": tag.id, "text": tag.name});
          }
        }
      }, 100);
      setTimeout(() => {
        this.selectt_dest = [];
        this.selectedDestinationArray = [];
        if (this.newOpportunity.destination_id.length != 0) {
          let i = 0;
          for (let a of this.newOpportunity.destination_id) {
            this.selectedDestinationArray.push({
              'id': a.id,
              'name': a.name,
              'geonameid': a.city_id,
              'dest_region_id': a.state_id,
              'country_iso_3': a.country_id
            })
            destination.push(a.id);
            this.selectt_dest.push("" + a.id);
            if (i == 0) {
              localStorage.setItem('opp_dest', a.name);
              localStorage.setItem('opp_dest_id', a.city_id);
            }
            i++;
          }
          this.newOpportunity.destination_id = this.selectt_dest;
          this.newOpportunity.destinations = this.selectedDestinationArray;
          console.log(destination, 'ssss');
          console.log(this.selectedDestinationArray, 'ssss');


        } else {
          localStorage.setItem('opp_dest', '');
        }
        let inclusion = [];
        let o_tags = [];
        this.selectt_tags = [];
        if (this.newOpportunity.tag_id.length != 0) {
          let i = 0;
          for (let a of this.newOpportunity.tag_id) {
            console.log(a);
            o_tags.push(a);
            this.selectt_tags.push("" + a);
            i++;
          }
          this.newOpportunity.tag_id = this.selectt_tags;
          console.log(o_tags, 'tagg');


        }
        //alert('d');
        this.selectt_incl = [];
        if (this.newOpportunity.inclusion_id.length != 0) {
          let i = 0;
          for (let a of this.newOpportunity.inclusion_id) {
            inclusion.push(a);
            this.selectt_incl.push("" + a);
            i++;
          }
          this.newOpportunity.inclusion_id = this.selectt_incl;
          console.log(inclusion, 'innn');

        }
      }, 1600);

      // this.newOpportunity.inclusion_id=this.newOpportunity.inclusion_id.id;
      // this.newOpportunity.destination_id=this.newOpportunity.destination_id.id;
      this.opportunities = this.clientData.related_opportunities;
      this.assignedUserList = this.clientData.users;

      if (data.users != undefined) {
        let i = 0;
        for (let e of data.users) {
          //console.log(e.id);
          this.assignData.push({"id": e.id, "text": e.name});
          i++;
        }
      }
      this.chk.detectChanges();
      this.AccountPersonalShow();

      this.all_fileds_val = [];
      for (var key in this.newOpportunity) {
        if (this.newOpportunity.hasOwnProperty(key)) {
          var val = this.newOpportunity[key];
          this.all_fileds_val['Opportunity.' + key] = val;
        }
      }

      this.get_additional_fields();
    }, error => {
      this.popUpMsg = error.error.message;
      this.openDialog();
      console.log(error);
      if (error.error.redirect) {
        this.router.navigate(['/maindashboard', {outlets: {bodySection: ['OpportunityGrid']}}]);
      }

    });
    // this.openDialog();

    this.itineraryService.getAllItinerary().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.allItinerary = data.itineraries;
        if (this.allItinerary != undefined) {
          let i = 0;
          for (let e of this.allItinerary) {
            this.itinData.push({'id': e.id, 'text': e.name});
            i++;
          }
          console.log(this.itinData);

        }
      }
    });
  }

  selectt_dest = [];
  selectt_tags = [];
  selectt_incl = [];
  itinData: any = [];
  public itinOptions: Select2Options;
  allItinerary: any;
  selectedItin: any = [];

  attach_itin() {
    if (this.selectedItin.length == 0) {
      //alert('Please select itineraries!');
      this.popUpMsg = 'Please select itineraries!';
      this.openDialog();
      return false;
    }
    var pData = {"opportunity_id": this.id, "itinerary_id": this.selectedItin}
    this.itineraryService.attachItinerary(pData).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.popUpMsg = data.message;
        this.openDialog();
        this.renderData();
      }
    });
  }

  send_rfq() {
    if (this.selectedSup.length == 0) {
      this.popUpMsg = 'Please select Supplier!';
      this.openDialog();
      return false;
    }
    if (this.suppMail.body_html == '') {
      this.popUpMsg = 'Please add RFQ description';
      this.openDialog();
      return false;
    }
    if (this.suppMail.subject == '') {
      this.popUpMsg = 'Please add RFQ subject';
      this.openDialog();
      return false;
    }
    var pData = {
      "opportunity_id": this.id, "supplier_id": this.selectedSup,
      'subject': this.suppMail.subject, 'body_html': this.suppMail.body_html
    };
    console.log(pData);
    this.oppoService.send_rfq(pData).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.popUpMsg = data.message;
        this.openDialog();
        this.renderData();
      }
      this.suppMail = {'supplier_ids': [], 'subject': '', 'body_html': ''};
      this.selectedSup = [];
    });
  }

  attach_single_itin(id) {
    var itin_id = [];
    //this.selectedItin.push('"'+id+'"');
    this.selectedItin.push(id.toString());
    console.log(this.selectedItin);
    var pData = {"opportunity_id": this.id, "itinerary_id": this.selectedItin};
    this.itineraryService.attachItinerary(pData).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.popUpMsg = data.message;
        this.openDialog();
        this.renderData();
      }
    });
  }

  set_draft() {
    localStorage.setItem('opp_email_desc', this.mail.description_html);
    localStorage.setItem('opp_email_subject', this.mail.subject);
    localStorage.setItem('opp_email_to', this.mail.to_address);
    localStorage.setItem('opp_email_template', this.emailTemplate);
    console.log(localStorage.getItem('opp_email_desc'));
  }

  ngOnInit() {
    // this.mail.description_html = localStorage.getItem('opp_email_desc')=== null?'':localStorage.getItem('opp_email_desc');
    // this.mail.subject = localStorage.getItem('opp_email_subject')=== null?'':localStorage.getItem('opp_email_subject');
    // this.emailTemplate = localStorage.getItem('opp_email_template');


    // this.mail.to_address = localStorage.getItem('opp_email_to')=== null?'':localStorage.getItem('opp_email_to');

    // this.assignedUserOptions = this.myControl2.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(val => this.filterAssisnedUser(val))
    //   );
    // this.assignedUserOptionsPA = this.myControl2.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(val => this.filterAssisnedUserPA(val))
    // );
    this.filteredOptions = this.myControl3.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
      console.log(this.filteredOptions);
    this.loadPermissionSet();
  }

  view_opportunity = false;
  create_opportunity = false;
  download_opportunity = false;
  edit_opportunity = false;
  delete_opportunity = false;
  upload_opportunity = false;

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Opportunity) {
        console.log(permissionArray.Opportunity);
        permissionArray.Opportunity.forEach(permissions => {
          if (permissions.name == 'view_opportunity') {
            this.view_opportunity = true;
          }
          if (permissions.name == 'create_opportunity') {
            this.create_opportunity = true;
          }
          if (permissions.name == 'edit_opportunity') {
            this.edit_opportunity = true;
          }
          if (permissions.name == 'delete_opportunity') {
            this.delete_opportunity = true;
          }
          if (permissions.name == 'upload_opportunity') {
            this.upload_opportunity = true;
          }
          if (permissions.name == 'download_opportunity') {
            this.download_opportunity = true;
          }
        });
      }

    }
    if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray);
      modulesArray.forEach(module => {
        if (module.acc_recievable == true) {
          this.show_receivable = true;
        }
        if (module.performa == true) {
          this.show_performa = true;
        }
        if (module.email_template == true) {
          this.show_email_temp = true;
        }
      });
    }
    if (this.view_opportunity == false) {
      //alert('You are not Authorized to view this page!';);
      this.popUpMsg = 'You are not Authorized to view this page!';
      ;
      this.openDialog();
      this.router.navigate(['/maindashboard', {outlets: {bodySection: ['Dashboard']}}]);

    }
  }

  show_receivable = false;
  show_performa = false;
  show_email_temp = false;

  filter(val: string): any[] {
    if (val == undefined) {
      val = "";
    }
    return this.clientData.users.filter((s) => new RegExp(val, 'gi').test(s.name));
    // return this.clientData.users.filter(option => {
    //   for (let a of option.name) {
    //     console.log(a,val); 
    //     if (a.toLowerCase().includes(val.toString().toLowerCase())) {
    //       return true;
    //     }
    //   }
    // });
  }

  // filterAssisnedUser(val: string): any[] {
  //   if(val==undefined){
  //     val="";
  //   }
  //   return this.clientData.contacts.filter(option => {
  //     let arr = (option.first_name + " " + option.middle_name + " " + option.last_name).split(null);
  //     for (let a of arr) {
  //       if (a.toLowerCase().includes(val.toString().toLowerCase())) {
  //         // alert(a);
  //         return true;
  //       }
  //     }
  //   });

  // }

  // filterAssisnedUserPA(val: string): any[] {
  //   if(val==undefined){
  //     val="";
  //   }
  //   return this.createData.personal_accounts.filter(option => {
  //     let arr = (option.first_name + " " + option.middle_name + " " + option.last_name).split(null);
  //     for (let a of arr) {
  //       if (a.toLowerCase().includes(val.toString().toLowerCase())) {
  //         // alert(a);
  //         return true;
  //       }
  //     }
  //   });

  // }
  loadEmailTemplate = 0;
  isSetupMail: any = 0;
  all_attachment: any = [];
  all_attachment_urls: any = [];

  attachFiles(files: FileList) {
    const file = files[0];
    let form = new FormData();
    form.set("email_image", file);
    let that1 = this;
    this.fileService.uploadFileTos3(form).subscribe((data: any) => {
      if (data.image_url) {
        this.all_attachment.push(data.name);
        this.all_attachment_urls.push(data.image_url);
        this.mail.documents = this.all_attachment_urls;
      }
      console.log(this.all_attachment);
      console.log(this.mail);


    }, (error) => {
      this.popUpMsg = 'File unable to upload!';
      this.openDialog();
    });


  }

  removeAttachment(index) {
    this.all_attachment.splice(index, 1);
    this.all_attachment_urls.splice(index, 1);
    this.mail.documents = this.all_attachment_urls;
  }

  sendEmail() {
    this.isSetupMail = localStorage.getItem('setup_mail');
    if (this.isSetupMail == 0) {
      $('#email_set').trigger('click');
      return false;
    }
    if (this.mail.to_address == undefined || this.mail.to_address == '') {
      this.popUpMsg = 'Please fill receiver email address!';
      this.openDialog();
      return false;
    }
    if (this.mail.subject == undefined || this.mail.subject == '') {
      this.popUpMsg = 'Please add subject!';
      this.openDialog();
      return false;
    }
    if (this.mail.description_html == undefined || this.mail.description_html == '') {
      this.popUpMsg = 'The email body field is mandatory!';
      this.openDialog();
      return false;
    }
    this.mail.from_address = this.clientData.auth_user.email;
    this.mail.emailable_id = this.clientDetails.id + "";
    ;
    this.mail.emailable_type = "App\\Opportunity";
    this.oppoService.sendMail(this.mail).subscribe((data: any) => {
      // this.popUpMsg=JSON.stringify(data.message);
      this.popUpMsg = data.message;
      this.openDialog();
      this.mail = new EmailClass();
      this.loadEmailTemplate = 0;
      this.emailTemplateSelected = undefined;
      this.renderData();
      this.all_attachment = [];
      this.all_attachment_urls = [];
      this.mail.documents = [];
    });
  }

  logCall() {
    this.contact_nameSearch = '';
    this.call.taskable_id = this.clientDetails.id;
    ;
    this.oppoService.callLog(this.call).subscribe(data => {
      // alert("JSON " + JSON.stringify(data));
      this.renderData();
      this.popUpMsg = data;
      this.openDialog();
    })
  }

  due_error = false;

  createTask() {
    if (this.accountObject != undefined && this.accountObject.contact != undefined) {
      this.task.contact_id = this.newOpportunity.contact_id.id;
    }
    this.task.taskable_id = this.clientDetails.id;
    //Not Sure assigned user

    // alert('To '+ JSON.stringify(this.date.value));
    //this.task.due_date = this.date.value;

    // console.log("JSON " + JSON.stringify(this.task));
    if (this.task.due_date != undefined) {
      this.task.due_date = new Date(this.task.due_date);
      var dd = (this.task.due_date.getDate() < 10 ? '0' : '') + this.task.due_date.getDate();
      var MM = ((this.task.due_date.getMonth() + 1) < 10 ? '0' : '') + (this.task.due_date.getMonth() + 1);
      var yyyy = this.task.due_date.getFullYear();
      var hh = this.task.due_date.getHours();
      var min = this.task.due_date.getMinutes();
      this.task.due_date = yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + min;
    } else {
      this.due_error = true;
      this.popUpMsg = "Please fill due date";
      this.openDialog();
      return;
    }

    this.oppoService.callLog(this.task).subscribe(data => {
      // alert("JSON " + JSON.stringify(data));
      this.renderData();
      this.popUpMsg = data;
      this.openDialog();
      this.task = {
        "assigned_user_id": undefined,
        "subject": undefined,
        "due_date": undefined,
        "Opportunity_id": undefined,
        "taskable_type": "App\\Opportunity",
        "taskable_id": undefined,
        "status": "open"
      };
    }, error => {
      console.log(error, 'error report');
      this.popUpMsg = error.error.message;
      this.openDialog();
    });
  }

  getASelectedVal(selected) {
    this.task.assigned_user_id = selected.id;
  }

  getASelectedValUser(selected) {
    this.call.Opportunity_id = selected.id;
    this.task.Opportunity_id = selected.id;
  }

  displayAssignedUserFn(obj) {
    // alert(JSON.stringify(obj));
    if (obj != null && obj != undefined) {
      let name = "";
      name = obj.name;

      if (name == undefined) {
        name = (obj.first_name + " " + obj.middle_name + " " + obj.last_name);
      }

      while (name.includes(null)) {
        name = name.replace(null, "").replace("  ", " ").trim();
      }
      return obj ? name : undefined;
    }
    return "";
  }

  setUpEmailValue() {
    for (let i = 0; i < this.clientData.email_templates.length; i++) {
      //console.log(this.clientData.email_templates[i]);
      if (this.clientData.email_templates[i].id == this.emailTemplate) {
        this.checkForDynamicTemplate(this.clientData.email_templates[i]);
        this.mail.subject = this.clientData.email_templates[i].subject;
        this.mail.description_html = this.clientData.email_templates[i].body;
        this.setTemplatePlaceHolder(this.clientData.email_templates[i]);
      }
    }
    this.mail.from_address = this.clientData.auth_email;

  }

  email_templates_err = '';

  checkForDynamicTemplate(template) {
    this.email_templates_err = '';
   // if (template.published == 'd') {
      let no_mod = false;
      for (let mod of this.no_email_temp_modules) {
        var no_mod_index = template.body.indexOf(mod);
        if (no_mod_index > -1) {
          no_mod = true;
        }
      }
      if (no_mod) {
        this.email_templates_err = 'Some template value(s) may not available in this module!';
      }
   // }

  }

  setTemplatePlaceHolder(template) {
    //if (template.published == 'd') {
      for (let mod in this.all_fileds_val) {
        console.log('[' + mod + ']', this.all_fileds_val[mod]);
        console.log(this.mail.description_html.indexOf('[' + mod + ']'));
        setTimeout(() => {
          var repl = this.mail.description_html.replace('[' + mod + ']', this.all_fileds_val[mod]);
          this.mail.description_html = repl;
          console.log(this.mail.description_html);
        }, 50);
      }
  //  }
  }

  setUpSuppEmailValue() {
    for (let i = 0; i < this.clientData.email_templates.length; i++) {
      if (this.clientData.email_templates[i].id == this.supplier_email_temp) {
        this.checkForDynamicTemplate(this.clientData.email_templates[i]);
        this.suppMail.subject = this.clientData.email_templates[i].subject;
        this.suppMail.body_html = this.clientData.email_templates[i].body;
        this.setTemplatePlaceHolder(this.clientData.email_templates[i]);
      }
    }

    //  for (let i = 0; i < this.clientData.supplier_templates.length; i++) {
    //   if (this.clientData.supplier_templates[i].id == this.supplier_email_temp) {
    //     this.suppMail.subject = this.clientData.supplier_templates[i].subject;
    //     this.suppMail.body_html = this.clientData.supplier_templates[i].body_html;
    //   }
    // }


  }

  emailTemplateSelected: any;

  loadEmailTemplates() {
    var i = 0;
    for (let em_temp of this.clientData.email_templates) {
      if (em_temp.id == this.emailTemplateSelected) {
        this.mail.from_address = this.clientData.email_templates[i].auth_email;
        this.mail.subject = this.clientData.email_templates[i].subject;
        this.mail.description_html = this.clientData.email_templates[i].body;
      }
      i++;
    }
  }

  getKeys(map) {
    let arr: any[] = [];
    for (let k in map) arr.push(k);
    return arr;
  }

  name_error = false;
  acct_error = false;
  cont_error = false;
  per_error = false;
  err_show = false;

  UpdateStOpportunity() {
    if (this.checkStandardFiledValidation() == false) {
      console.log('ff')
      return false;
    }

    console.log(this.newOpportunity);
    //return false;

    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newOpportunity.custom_fields = [];
      this.submit_opp();
    }
  }

  checkStandardFiledValidation() {
    var standard_error = false;
    if (this.AccountCont) {
      this.newOpportunity.opportunitable_type = "App\\Account";
    } else {
      this.newOpportunity.opportunitable_type = "App\\PersonalAccount";
    }
    for (let st_fld of this.standardFields) {
      if (st_fld.mandatory == 1 && (this.newOpportunity[st_fld.name] == undefined || this.newOpportunity[st_fld.name] == "")) {
        if ((st_fld.name == 'account_id' || st_fld.name == 'contact_id') && this.AccountCont == false) {
          continue;
        } else if (st_fld.name == 'personal_account_id' && this.AccountCont) {
          continue;
        } else {

        }

        console.log(this.newOpportunity[st_fld.name], st_fld.name + '--MAN--' + st_fld.mandatory);
        this.popUpMsg = 'Please fill ' + st_fld.label;
        this.openDialog();
        standard_error = true;
        return false;
      }
    }
    if (standard_error == false) {
      //return false;
    }

  }

  updateOpportunity() {
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newOpportunity.custom_fields = [];
      this.submit_opp();
    }

  }

  dest_error = false;
  exp_error=false;
  submit_opp() {

    this.err_show = false;
    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    this.dest_error = false;
    this.exp_error=false;
    if (this.newOpportunity.destinations == undefined || this.newOpportunity.destinations.length == 0) {
      this.dest_error = true;
      this.err_show = true;
      this.popUpMsg = 'Please Select Destination(s)';
      this.openDialog();
    }
     if (this.newOpportunity.experience_id == '') {  
      this.popUpMsg = 'Please Select experience';
      this.exp_error=true;
      this.err_show = true;
      this.openDialog();
    }
    if (this.newOpportunity.name == undefined || this.newOpportunity.name == '') {
      this.name_error = true;
      this.err_show = true;
      this.popUpMsg = 'Please fill name';
      this.openDialog();
      // return ;
    }


    if (this.AccountCont && (this.newOpportunity.account_id == undefined || this.newOpportunity.contact_id == undefined)) {
      this.popUpMsg = "Please select an account and Contact";
      this.acct_error = true;
      this.cont_error = true;
      this.err_show = true;
      this.openDialog();
      // return;
    }
    if (!this.AccountCont && this.newOpportunity.personal_account_id == undefined) {
      this.popUpMsg = "Please select a personel account";
      this.per_error = true;
      this.err_show = true;
      this.openDialog();

    }
    if (this.newOpportunity.travel_date != undefined) {
      this.newOpportunity.travel_date = new Date(this.newOpportunity.travel_date);
      var dd = (this.newOpportunity.travel_date.getDate() < 10 ? '0' : '') + this.newOpportunity.travel_date.getDate();
      var MM = ((this.newOpportunity.travel_date.getMonth() + 1) < 10 ? '0' : '') + (this.newOpportunity.travel_date.getMonth() + 1);
      var yyyy = this.newOpportunity.travel_date.getFullYear();
      this.newOpportunity.travel_date = yyyy + '-' + MM + '-' + dd;
    }
    if (this.newOpportunity.close_date != undefined) {
      this.newOpportunity.close_date = new Date(this.newOpportunity.close_date);
      var dd = (this.newOpportunity.close_date.getDate() < 10 ? '0' : '') + this.newOpportunity.close_date.getDate();
      var MM = ((this.newOpportunity.close_date.getMonth() + 1) < 10 ? '0' : '') + (this.newOpportunity.close_date.getMonth() + 1);
      var yyyy = this.newOpportunity.close_date.getFullYear();
      this.newOpportunity.close_date = yyyy + '-' + MM + '-' + dd;
    }
    if (this.err_show) {
      return;
    }

    if (this.newOpportunity.amount) {
      this.newOpportunity.expected_revenue = (parseInt(this.newOpportunity.probability) * parseInt(this.newOpportunity.amount) / 100).toFixed(2);
    }

    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    this.newOpportunity.documents = this.documentData;
    this.oppoService.updateClient(this.newOpportunity).subscribe(data => {
      // alert(JSON.stringify(data));
      this.selectt_incl = [];
      this.selectt_tags = [];
      this.renderData();
      this.popUpMsg = data;
      this.openDialog();

      this.EditAccPop = false;
      this.EditStAccPop = false;
      this.closeRightpanel();
      console.log(this.clientData.opportunity)
      var opport = this.clientData.opportunity;
      var stage = this.clientData.sales_stages;
      // this.clientData.sales_stages =[];
      // this.clientData.opportunity = [];
      // setTimeout(()=>{
      //        this.clientData.sales_stages=stage;
      //        this.clientData.opportunity =opport;
      //        this.current_stage=this.clientData.opportunity.sales_stage_id.position;
      //     },2000);
    });
  }

  getOwnerName(id: number) {
    for (let obj of this.clientData.users) {
      if (obj.id == id) {
        return obj.name;
      }
    }
  }

  resetForm() {
    this.myControl3.reset();
    this.myControl2.reset();
    this.ngOnInit();
    this.autocontList = [];
    this.contact_nameSearch = '';
  }

  createEvent() {
    this.event.eventable_id = this.clientDetails.id + "";
    ;
    this.event.start_date = this.EvtstartDate.value;
    this.event.end_date = this.EvtEndDate.value;
    this.oppoService.createEvent(this.event).subscribe(obj => {
      this.renderData();
      this.popUpMsg = obj;
      this.openDialog();
    });
  }

  getAccountName(id: number) {
    if (this.createData != undefined && this.createData.accounts != undefined && id != undefined && this.createData.accounts.length != 0) {
      for (let obj of this.createData.accounts) {
        if (obj.id == id) {
          return obj.name;
        }
      }
    }
    return "NA";
  }

  openViewAllDialog(): void {
    let dialogRef = this.dialog.open(ViewAllComponent, {
      data: this.viewAll
      // data: { name: "this.name", animal: "this.animal" }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  viewAll: any;


  stageView() {
    this.viewAll = {"history": this.clientData.opportunity_histories};
    this.openViewAllDialog();
  }

  selectAccId(val: number) {
//alert(val);

    this.autoAccList = [];
    this.fetch_acc_det(val);
    this.newOpportunity.account_id = val;
    if (this.newOpportunity.account_id != undefined && this.newOpportunity.account_id != null) {
      this.oppoService.fetchContactList(this.newOpportunity.account_id).subscribe((data: any) => {
        this.createData.accounts_client = data.contacts;
      });
    }
  }

  selectStage(val: string) {
    for (let a of this.createData.sales_stages) {
      if (val == a.id) {
        this.newOpportunity.probability = a.probability;
        break;
      }
    }

  }

  refreshEmail() {
    this.oppoService.refreshEmail().subscribe(data => {
      this.renderData();
    });
  }

  deleteOppo() {
    this.oppoService.deleteOppo(this.clientDetails.id).subscribe(
      (obj) => {
        //this.popUpMsg=obj;
        this.popUpMsg = JSON.parse(JSON.stringify('opportunity deleted successfully'));
        this.openDialog();
        this.router.navigate(['/maindashboard', {outlets: {bodySection: ['OpportunityGrid']}}]);

      }
    );
  }

  ownerShipEdit = false;
  opp_new_owner_id: any;
  public ownerOptions: Select2Options;

  openOwnership() {
    this.ownerShipEdit = true;
    this.opp_new_owner_id = this.clientDetails.owner_id;
  }

  changeOwner() {

    var changeOwn = {"opportunity_id": this.id, "opp_new_owner_id": this.opp_new_owner_id};
    this.oppoService.changeOwner(changeOwn).subscribe((data: any) => {
      this.closeOwner();
      this.popUpMsg = data.message;
      this.openDialog();
      this.renderData();
    });

  }

  closeOwner() {
    this.ownerShipEdit = false;
  }

  renderNewView(value) {
    this.opp_new_owner_id = value;
  }

  renderitinView(value) {
    this.selectedItin = value;
    console.log(this.selectedItin);
  }

  renderSupView(value) {
    this.selectedSup = value;
    this.suppMail.supplier_ids = value;
    console.log(this.selectedSup);
  }

  suppMail = {'supplier_ids': [], 'subject': '', 'body_html': ''};

  selectBox() {
    $('.select2-container').css('z-index', 5000);
  }

  selectBoxItin() {
    //  $('.select2-container').css('z-index',5000);
    $('#opp_iti_search .select2-selection__choice').css('border-radius', 0);
  }

  autoAccList = [];
  autoPerAccList = [];
  account_nameSearch: any;
  per_account_nameSearch: any;

  search_acc(evnt) {
    this.autoAccList = [];
    var val = evnt.target.value;

    console.log(val);
    if(val && val.length>2){
        this.oppoService.searh_account(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.accounts) {
            this.autoAccList = data.accounts;
          } else {
            this.autoAccList = [];
          }

        });
    }else{
          this.autoAccList = [];
        }
  }

  autocontList = [];
  contact_nameSearch: any;
  per_acc_nameSearch: any;

  search_contacts(evnt) {
    this.autocontList = [];
    var val = evnt.target.value;

    console.log(val);
    this.oppoService.searh_contacts(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.contacts) {
        this.autocontList = data.contacts;
      } else {
        this.autocontList = [];
      }


    });

  }

  autoDestList = [];
  destination_nameSearch = "";
  selectedDestinationArray = [];

  search_dest() {
    this.autoDestList = [];
    var val = this.destination_nameSearch;
    if (val && val.length > 2) {
      this.oppoService.SearchDestinations(val).subscribe((data: any) => {
        console.log(data);
        if (data && data.destination) {
          this.autoDestList = data.destination;
        } else {
          this.autoDestList = [];
        }
      });
    } else {
      this.autoDestList = [];
    }

  }

  selectDestId(dest_id) {
    var d_avail = false;
    for (let des of this.autoDestList) {
      console.log(des);
      if (des.id == dest_id) {
        if (this.selectedDestinationArray.length > 0) {
          console.log('1');

          for (let avail of this.selectedDestinationArray) {
            if (avail.id == dest_id) {
              d_avail = true;
            }

          }
          if (d_avail == false) {

            this.selectedDestinationArray.push(des);
          }
        } else {
          console.log('0');
          this.selectedDestinationArray.push(des);
        }
      }
    }
    this.autoDestList = [];
    this.destination_nameSearch = "";
    console.log(this.selectedDestinationArray);
    this.newOpportunity.destinations = this.selectedDestinationArray;
    this.dest_error = false;
  }

  removeDestin(dest_id) {
    var i = -1;
    var index = i;

    for (let avail of this.selectedDestinationArray) {
      i++;
      if (avail.id == dest_id) {
        index = i;
      }
    }
    if (index > -1) {
      this.selectedDestinationArray.splice(index, 1);

    }
    this.newOpportunity.destinations = this.selectedDestinationArray;
  }

  selectContId(cont) {
    this.contact_nameSearch = cont.first_name + ' ' + cont.last_name;
    this.autocontList = [];
    this.call.contact_id = cont.id;
    this.task.contact_id = cont.id;
    this.task.Opportunity_id = cont.id;

  }

  selectPAId(pAccount) {
    this.autoPerAccList = [];
    this.per_acc_nameSearch = pAccount.first_name + ' ' + pAccount.last_name;
    this.call.Opportunity_id = pAccount.id;
    this.task.Opportunity_id = pAccount.id;
  }

  search_per_acc(evnt) {
    this.autoPerAccList = [];
    var val = evnt.target.value;

    console.log(val);
    if(val && val.length>2){
    this.oppoService.searh_p_account(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_accounts) {
        this.autoPerAccList = data.personal_accounts;
      } else {
        this.autoPerAccList = [];
      }


    });
  }else{
      this.autoPerAccList = [];
    }

  }

  fetch_acc_det(id) {
    this.autoPerAccList = [];
    this.oppoService.fetch_acc_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.account) {
        this.account_nameSearch = data.account.name;
      }

    });
  }

  selectPerAccId(id) {
    this.newOpportunity.personal_account_id = id;
    this.autoPerAccList = [];
    this.oppoService.fetch_p_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_account) {
        this.per_account_nameSearch = data.personal_account.first_name + ' ' + data.personal_account.last_name;
      }

    });
  }

  public extraformModel: any = {};
  customFields: any = [];
  extraFields: any;
  fr_options: any;

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

      if (field_obj.type == 'multiselect') {
        console.log(value);
        if (value) {
          var mult_val = [];
          for (let vl of value) {
            console.log(vl);
            var vl_arr = vl.split(":");
            mult_val.push(vl_arr[1].replace(/'/g, "").trim());
            console.log(mult_val);
          }
          value = mult_val;
        }
      }
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
      // alert(field_obj.mandatory);
      if (field_obj.mandatory == 1 && value == '') {
        $("#" + field_obj.name).addClass('frm-danger');
        $("#" + field_obj.name + "_err_sp").html('This field is Mandatory!');
        this.popUpMsg = 'Please fill all mandatory fields';
        this.openDialog();
        return false;
      }
      var vJson = {
        "opportunity_id": this.id,
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
    this.newOpportunity.custom_fields = this.customFields;
    console.log(this.newOpportunity.custom_fields);
    this.submit_opp();
  }

  get_additional_fields() {

    this.formService.getAllfields('Opportunity').subscribe((data: any) => {
      console.log(data);
      this.extraFields = data.additional_fields;

      for (var i = 0; i <= data.additional_fields.length - 1; i++) {
        this.extraformModel[i] = [];
        this.extraformModel[i][data.additional_fields[i].name] = data.additional_fields[i].name;
        this.extraformModel[i]['id'] = data.additional_fields[i].id;
        this.extraformModel[i]['type'] = data.additional_fields[i].type;
        this.extraformModel[i]['type_value'] = data.additional_fields[i].type_value;
        this.extraformModel[i]['name'] = data.additional_fields[i].name;
        this.extraformModel[i]['mandatory'] = data.additional_fields[i].mandatory;

        for (let custom of this.clientDetails.custom_fields) {

          if (custom.opp_additional_field_id == this.extraformModel[i]['id']) {
            if (this.extraFields[i]['type'] == 'multiselect') {
              this.extraFields[i]['value'] = custom.field_value;
              this.extraformModel[i]['type_value'] = custom.type_value;
              console.log(this.extraFields[i]['value']);
            } else {
              this.extraFields[i]['value'] = custom.field_value;
            }
            if (this.extraFields[i]['type'] == 'checkbox') {
              this.extraFields[i]['value'] = custom.field_value ? custom.field_value.split(",") : [];
              console.log(this.extraFields[i]['value']);
            }
          }
        }

        if (data.additional_fields[i].type_value) {
          this.fr_options = [];
          for (var j = 0; j <= data.additional_fields[i].type_value.length - 1; j++) {

            this.fr_options.push({
              id: j + 1,
              value: data.additional_fields[i].type_value[j]
            });

          }
          this.extraFields[i]['options'] = this.fr_options;
        } else {
          this.extraFields[i]['options'] = [];
        }
        console.log(this.extraFields);
      }
    });

  }

  get_label_name(id) {

    // if(this.extraFields){
    for (let fld of this.extraFields) {
      if (fld.id == id) {
        return fld.label;
      }

    }
    //}

  }

  allInvoice: any;
  emailable_invoice_id: any;
  invoiceEmail = false;
  invoiceEmailId: any;
  invoiceNote: any;

  get_invoice() {
    this.oppoService.get_invoice(this.id).subscribe((data: any) => {
      console.log(data);
      if (data && data.proforma_invoices) {
        this.allInvoice = data.proforma_invoices;
      }

    });
  }

  open_invoice_email(id) {
    this.emailable_invoice_id = id;
    this.invoiceEmail = true;
  }

  pdfHtmlData: any;

  download_invoice6(id) {
    $('#inv_dt').css('display', 'block');
    this.oppoService.download_invoice(id).subscribe((dt: any) => {
      var invc = dt.proforma_invoice;
      this.pdfHtmlData = invc;
      var element = document.getElementById("inv_dt");
      html2canvas(element, {
        logging: false
      }).then(function (canvas) {
        var pdf = new jsPDF('p', 'mm', 'a4');//A4 paper, portrait
        var ctx = canvas.getContext('2d'),
          // a4w = 190, a4h = 257,//A4 size, 210mm x 297mm, 10 mm margin on each side, display area 190x277
          a4w = 210, a4h = 307,
          imgHeight = Math.floor(a4h * canvas.width / a4w),//Convert pixel height of one page image to A4 display scale
          renderedHeight = 0;

        var logo = document.getElementById("inv_logo_set");//Icon placed in header
        //  while(renderedHeight < canvas.height) {
        var page = document.createElement("canvas");
        page.width = canvas.width;
        page.height = Math.min(imgHeight, canvas.height - renderedHeight);//Maybe less than one page

        //Trim the specified area with getImageData and draw it into the canvas object created earlier
        // page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
        page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, 50, 50), 0, 0);
        //Add an image to the page with a 10 mm / 20 mm margin
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 20, a4w, Math.min(a4h, a4w * page.height / page.width));
        //Add header logo
        pdf.addImage(logo, 'PNG', 5, 3);

        renderedHeight += imgHeight;
        if (renderedHeight < canvas.height)
          pdf.addPage();//Add an empty page if there is more to follow

        //delete page;
        //}

        $('#inv_dt').css('display', 'none');
        pdf.save('content.pdf');
      });
    });

  }

  download_invoice(id) {
    this.oppoService.download_invoice(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.proforma_invoice) {
        var invc = data.proforma_invoice;
        $('#inv_dt').css('display', 'block');
        this.pdfHtmlData = invc;
        var pdf_htm = '';
        // var doc = new jsPDF();
        //  doc.text(20, 20, 'Invoice No: '+invc.invoice_number);
        //  doc.text(20, 30, 'Company: '+invc.company_info);
        //  doc.text(20, 40, 'Amount: '+invc.amount);
        //  doc.text(20, 50, 'Name: '+invc.opportunity_id.name);
        var data: any;
        data = document.getElementById('inv_dt');
        setTimeout(() => {

          html2canvas(data).then(canvas => {
            var imgWidth = 208;
            var pageHeight = 295;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            const contentDataURL = canvas.toDataURL('image/png')
            let pdf = new jspdf('p', 'mm', 'a4');
            var position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('invoice_' + invc.invoice_number + '.pdf');
            $('#inv_dt').css('display', 'none');
          });
        }, 200);
      }

    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57 || charCode == 110)) {
      return false;
    }
    return true;

  }

  numberOnlyMinus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    //character, not with ctrl, alt key
    if (charCode >= 65 && charCode <= 90 && !event.ctrlKey && !event.altKey) {
      return false;
    }

    // number with shift
    if (charCode >= 48 && charCode <= 57 && !!event.shiftKey) {
      return false;
    }

    // ` ~ - _ = + \ | [ { ] } ' " ; : / ? , < . >
    var otherKeys = [186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222];
    if (otherKeys.indexOf(charCode) !== -1) {

      // allow minus sign
      if (charCode === 189 && !event.shiftKey) {
        return true;
      }

      return false;
    }

    // if you want to block "ctrl + v"(paste), comment the below code out
    if (charCode === 86 && !!event.ctrlKey) {
      return false;
    }

    return true;

  }

  save_acc_ledger() {
    this.ledger_account.opportunity_id = this.id;
    if (this.ledger_account.date != undefined) {
      this.ledger_account.date = new Date(this.ledger_account.date);
      var dd = (this.ledger_account.date.getDate() < 10 ? '0' : '') + this.ledger_account.date.getDate();
      var MM = ((this.ledger_account.date.getMonth() + 1) < 10 ? '0' : '') + (this.ledger_account.date.getMonth() + 1);
      var yyyy = this.ledger_account.date.getFullYear();
      var hh = this.ledger_account.date.getHours();
      var min = this.ledger_account.date.getMinutes();
      this.ledger_account.date = yyyy + '-' + MM + '-' + dd;//+' '+hh+':'+min;
      //this.ledger_account.date=dd+'/'+MM+'/'+yyyy;
    }
    this.oppoService.ledger_account(this.ledger_account).subscribe((data: any) => {
      console.log(data);
      this.close_ledger();
      this.popUpMsg = data.message;
      this.openDialog();
      this.renderData();

    }, error => {
      // console.log(error);
      // this.popUpMsg=data.message;
      //this.openDialog();
      this.close_ledger();
    });
  }

  generate_invoice() {
    this.oppoService.generate_invoice(this.id, this.invoiceNote).subscribe((data: any) => {
      console.log(data);
      this.close_gen_invoice();
      this.popUpMsg = data.message;
      this.openDialog();
      this.get_invoice();

    }, error => {
      // console.log(error);
      // this.popUpMsg=data.message;
      //this.openDialog();
      this.close_gen_invoice();
    });
  }

  send_invoice() {
    this.oppoService.send_invoice(this.invoiceEmailId, this.emailable_invoice_id).subscribe((data: any) => {
      console.log(data);
      this.get_invoice();
      this.popUpMsg = data.message;
      this.openDialog();
      this.close_em_invoice();

    });
  }

  close_em_invoice() {
    this.invoiceEmail = false;
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();
  }

  invoiceGen = false;

  close_gen_invoice() {
    this.invoiceGen = false;
    this.invoiceNote = '';
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();

  }

  ledModal = false;

  close_ledger() {
    this.ledModal = false;
    this.ledger_account = {
      "opportunity_id": this.id,
      "amount": undefined,
      "balance_amount": undefined,
      "date": undefined,
      "particulars": undefined,
      "mode": undefined
    };
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();

  }

  gen_open() {
    this.invoiceGen = true;
    this.invoiceNote = '';
  }

  led_open() {
    this.ledModal = true;
  }

  invoiceDetails: any;
  invoiceDet = false;

  open_invoice_details(id) {
    this.invoiceDet = true;
    for (let inv of this.allInvoice) {

      if (inv.id == id) {
        this.invoiceDetails = inv;
        this.pdfHtmlData = inv;
        setTimeout(() => {
          $('#inv_dt').css('display', 'block');
          var invHTML = $('#inv_dt').html();
          $('#fetchInv').html(invHTML);
          $('#inv_dt').css('display', 'none');
        }, 200);


      }
      console.log(this.invoiceDetails);

    }

  }

  open_pull_it(dest_name, id) {
    localStorage.setItem('opp_dest', dest_name);
    localStorage.setItem('opp_dest_id', id);
    setTimeout(() => {
      let elem = document.getElementById('pullit_m_icon');
      let evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      elem.dispatchEvent(evt);
    }, 300);


  }

  to_address_list = [];
  cc_address_list = [];
  bcc_address_list = [];

  search_email_opp(evnt, type) {
    this.to_address_list = [];
    this.cc_address_list = [];
    this.bcc_address_list = [];
    var val = evnt.target.value;
    console.log(this.AccountCont);
    var opp_type = '';
    if (this.AccountCont) {
      opp_type = 'account';
    } else {
      opp_type = 'personalaccount';
    }
    if (val.length > 2) {


      this.formService.search_email_opp(val, opp_type).subscribe((data: any) => {
        console.log(data);
        if (this.AccountCont) {
          if (type == 'to_address') {
            this.to_address_list = data.contacts;
          }
          if (type == 'cc_address') {
            this.cc_address_list = data.contacts;
          }
          if (type == 'bcc_address') {
            this.bcc_address_list = data.contacts;
          }
        } else {
          if (type == 'to_address') {
            this.to_address_list = data.personal_accounts;
          }
          if (type == 'cc_address') {
            this.cc_address_list = data.personal_accounts;
          }
          if (type == 'bcc_address') {
            this.bcc_address_list = data.personal_accounts;
          }

        }


      });
    } else {
      this.to_address_list = [];
      this.cc_address_list = [];
      this.bcc_address_list = [];
    }

  }

  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();
  }

  selectEmailId(acc, type) {
    if (type == 'to_address') {
      this.mail.to_address = acc.email;
    }
    if (type == 'cc_address') {
      this.mail.cc_address = acc.email;
    }
    if (type == 'bcc_address') {
      this.mail.bcc_address = acc.email;
    }
    this.to_address_list = [];
    this.cc_address_list = [];
    this.bcc_address_list = [];
  }

  autoItinList = [];
  itin_nameSearch: any;

  search_itin(evnt) {
    this.autoItinList = [];
    var val = evnt.target.value;

    console.log(val.length);
    if (val.length > 2) {
      this.oppoService.search_itin(val).subscribe((data: any) => {
        console.log(data);
        if (data && data.itineraries) {
          this.autoItinList = data.itineraries;
        } else {
          this.autoItinList = [];
        }


      });
    } else {
      this.autoItinList = [];
    }


  }

  selectedItinData: any = [];

  fetch_itin(itin) {
    console.log(this.checkItinExist(itin.id), 'check exist!!');

    if (this.checkItinExist(itin.id) != false) {
      setTimeout(() => {
        this.selectedItin.push(itin.id);
        this.selectedItinData.push(itin);

      }, 100);
    }
    this.autoItinList = [];
    this.itin_nameSearch = '';

  }

  checkItinExist(itin_id) {
    var exist = 1;
    this.selectedItin.forEach(id => {
      console.log(id, '===>' + itin_id);
      if (itin_id == parseInt(id)) {
        exist = 0;
        this.popUpMsg = 'Alredy added !';
        this.openDialog();
        return false;
      }
    });
    if (exist == 0) {
      return false;
    } else {
      return true;
    }
    //return true
  }

  remove_itin(index) {
    this.selectedItin.splice(index, 1);
    this.selectedItinData.splice(index, 1);
  }

  picklistValues = [];

  load_form_data() {
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k = 0; k < this.standardFields.length; k++) {
        this.picklistValues.push({'type_value': [{'id': 1, "name": "nammmm"}]});
        if (this.standardFields[k].type == 'picklist' || this.standardFields[k].type == 'select2') {
          let that = this;
          var pick_name = this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k);
            this.picklistValues[k].type_value = this.setPickDropdown(data, this.standardFields[k].name);
            this.standardFields[k].type_value = this.setPickDropdown(data, this.standardFields[k].name);
            console.log(that.picklistValues[k]);

          });
        }
      }
    }
  }

  get_picklist_name(picklist_selected) {
    var picklistName = '';

    if (picklist_selected == 'industries') {
      picklistName = 'industries';
    }
    if (picklist_selected == 'salutations') {
      picklistName = 'salutations';
    }
    if (picklist_selected == 'ratings') {
      picklistName = 'ratings';
    }
    if (picklist_selected == 'lead_statuses') {
      picklistName = 'lead_statuses';
    }
    if (picklist_selected == 'inclusion_id') {
      picklistName = 'inclusions';
    }
    if (picklist_selected == 'task_priorities') {
      picklistName = 'task_priorities';
    }
    if (picklist_selected == 'experience_id') {
      picklistName = 'experiences';
    }
    if (picklist_selected == 'destination_id') {
      picklistName = 'destinations';
    }
    if (picklist_selected == 'itinerary_inclusions') {
      picklistName = 'itinerary_inclusions';
    }
    if (picklist_selected == 'sales_stage_id') {
      picklistName = 'sales_stages';
    }
    if (picklist_selected == 'tag_id') {
      picklistName = 'opportunity_tags';
    }
    return picklistName;

  }

  setPickDropdown(data, picklist_selected) {
    var picklistAllValue = [];

    if (picklist_selected == 'industries') {
      picklistAllValue = data.industries;
    }
    if (picklist_selected == 'salutations') {
      picklistAllValue = data.salutations;
    }
    if (picklist_selected == 'ratings') {
      picklistAllValue = data.ratings;
    }
    if (picklist_selected == 'lead_statuses') {
      picklistAllValue = data.lead_statuses;
    }
    if (picklist_selected == 'inclusion_id') {
      picklistAllValue = data.inclusions;
    }
    if (picklist_selected == 'task_priorities') {
      picklistAllValue = data.task_priorities;
    }
    if (picklist_selected == 'experience_id') {
      picklistAllValue = data.experiences;
    }
    if (picklist_selected == 'destination_id') {
      picklistAllValue = data.destinations;
    }
    if (picklist_selected == 'itinerary_inclusions') {
      picklistAllValue = data.itinerary_inclusions;
    }
    if (picklist_selected == 'sales_stage_id') {
      picklistAllValue = data.sales_stages;
    }
    if (picklist_selected == 'tag_id') {
      console.log(data);
      picklistAllValue = data.opportunity_tags;
    }
    return picklistAllValue;

  }

reset_whatsappForm(){

  this.watsapp={'recipient_no':this.clientDetails.opp_whastapp_no,'recipient':this.clientDetails.opp_whastapp_no,'message':'','whatsapp_type':'','whatsapp_id':''};
      
}
  sendWhatsappTemplate() {
    this.watsapp.whatsapp_id = this.clientDetails.id;
    this.watsapp.whatsapp_type = "App\\Opportunity";
    if (this.watsapp.recipient_no == undefined) {
      this.popUpMsg = 'Please fill recipient number!';
      this.openDialog();
      return false;
    }
    this.watsapp.recipient = this.selectedPhoneCode + this.watsapp.recipient_no;
    // this.watsapp.message="hi";
    this.formService.sendWhatsappTemplate(this.watsapp).subscribe((data:any) => { 
      console.log(data);
      if(data && data.error){
       console.log('err');
      }else{
        this.renderData(); 
        this.reset_whatsappForm();
      }
      this.popUpMsg = data;
      this.openDialog(); 
      },  error => { 
       this.reset_whatsappForm();
    }); 
  }

 // watsapp: any = {'recipient': '', 'message': '', 'whatsapp_type': '', 'whatsapp_id': ''};

  sendWatsapp() {

    this.watsapp.whatsapp_id = this.clientDetails.id;
    this.watsapp.whatsapp_type = "App\\Opportunity";
    if (this.watsapp.recipient_no ==  '') {
      this.popUpMsg = 'Please fill recipient number!';
      this.openDialog();
      return false;
    }
     if (this.watsapp.message == '') {
      this.popUpMsg = 'Please fill messages!';
      this.openDialog();
      return false; 
    }
    this.watsapp.recipient = this.selectedPhoneCode + this.watsapp.recipient_no;
    // this.watsapp.message="hi";
    this.formService.sendWatapp(this.watsapp).subscribe((data:any) => {
      console.log(data);
      if(data && data.error){
       console.log('err');
      }else{
        this.renderData();
        setTimeout(() => {
          this.scroll_watsapp();
        }, 2400);
        this.reset_whatsappForm();
      }
      this.popUpMsg = data;
      this.openDialog(); 
    }, error => {
       this.reset_whatsappForm();
    });

  }

  allCountry = [];
  countryLoaded = false;
  //isWhatsappEnabled = false;
  countryData: any = [];
  public countryOptions: Select2Options;
  selectedPhoneCode = "";
  country_error = "";
  select_country = "";

  getAllCountry() {
    if ($("#wats_bdy").length > 0) {
      setTimeout(() => {
        this.scroll_watsapp();
      }, 400);

    }
    this.country_error = '';
    if (this.countryLoaded == false) {
      this.watsapp.recipient_no = this.clientDetails.opp_whastapp_no;
      this.formService.getAllCountry().subscribe((data: any) => {

        if (data.countries != undefined) {
          let i = 0;
          this.countryData.push({
            "id": '',
            "text": 'Select Country'
          });
          for (let e of data.countries) {
            var cnt_name = e.phonecode ? e.name + ' ( +' + e.phonecode + ')' : '';
            if (cnt_name != '') {
              this.countryData.push({
                "id": e.name,
                "text": cnt_name
              });
              i++;
            }
          }

          this.allCountry = data.countries;
          this.countryLoaded = true;
          this.select_country = 'India';
          if (this.select_country) {
            this.getPhoneCode(this.select_country);
          }


          setTimeout(() => {
            this.scroll_watsapp();
          }, 500);
        }
        console.log(this.countryData);
        console.log(this.select_country);


      });

    }
  }

  getPhoneCode(event) {
    console.log(event)
    if (event) {
      for (let count of this.allCountry) {
        if (count.name == event) {
          console.log(count.phonecode);
          this.selectedPhoneCode =  count.phonecode;
        }
      }
    } else {
      this.selectedPhoneCode = '';
      this.country_error = 'Country Required';
    }

  }

  scroll_watsapp() {
    var objDiv = document.getElementById("wats_bdy");
    objDiv.scrollTop = objDiv.scrollHeight;
    //$( "#wats_bdy" ).scrollTop( 0 );
  }

  rfqData = [];

  rfq_details(data) {
    this.rfqData = data;
  }

  close_rfq() {
    this.rfqData = [];
  }
}
