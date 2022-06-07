import { Component, OnInit, AfterViewChecked, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../service/supplier.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { EmailClass } from './email-class';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Account } from '../supplier/account';
import { MatDialog } from '@angular/material';
import { Alert } from 'selenium-webdriver';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { ViewAllComponent } from '../view-all/view-all.component';
import { MessageService } from '../message.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Quill from 'quill';
import { FormService } from '../service/form.service';
import { FileService } from '../file.service';
import { OppurtunityService } from '../service/opportunity.service';

declare var google;
@Component({ 
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css'],
  providers: [SupplierService]
})
export class SupplierDetailsComponent implements OnInit {
  description_html = '';
  popUpMsg: any = "";
  id: number;
  clientData: any;
  clientDetails: Account;
  accType: any;
  accParent: any;
  rating: any;
  industries: any;
  opportunities: any = [];
  contact: any = [];
  rContact: any = [];
  logContact: any;
  countryList: any[];
  isAttachment=true;  

  module_attachment: any = [];
  module_attachment_urls: any = [];
  documentData: any = [];
  attachModalOpen=false;
  openAttachModeal(){
    this.attachModalOpen=true;
  }
  closeAttachModeal(){
    this.attachModalOpen=false;
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
  public todayDate:any = new Date();
  stateList: any[];
  cityList: any[];

  ccBlock: boolean = false;
  bccBlock: boolean = false;
  ccBlockShow() {
    this.ccBlock = true;
  }
  bccBlockShow() {
    this.bccBlock = true;
  }

  public options: Object = {
    placeholderText: 'Enter Text',
    charCounterCount: false
  }
  emailTemplate: any;
  call: any = {
    "subject": undefined,
    "due_date": new Date(),
    "contact_id": undefined,
    "taskable_type": "App\\Supplier",
    "taskable_id": undefined,
    "status": "completed"

  }

  task: any = {
    "assigned_user_id": undefined,

    "subject": undefined,
    "due_date": undefined,
    "contact_id": undefined,
    "taskable_type": "App\\Supplier",
    "taskable_id": undefined,
    "status": "open"
  }

  EditAccPop: boolean = false;

  newAccount: Account = new Account();
  assignedUserList: any[] = [];
  myControl: FormControl = new FormControl();
  myControl2: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  assignedUserOptions: Observable<string[]>;
  date = new FormControl(new Date().toLocaleDateString());
  mail: EmailClass = new EmailClass();
  @ViewChild("search_add")
  public searchElementRef: ElementRef;
  public searchControl: FormControl;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city = '';
  public zip_code: string;
  public country_name: string;
  isSetupMail: any = 0;
  sup_services:any=[];
  supplier_types:any=[];
  allDestinations: any = [];
  allServices: any = [];
  public destOptions: Select2Options;

  constructor(private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private accountServiceService: SupplierService,
    private acMap: AccountsMapService,
    public dialog: MatDialog,
    private msg: MessageService,
    private formService: FormService,private opportunitieservice: OppurtunityService
    ,private fileService: FileService) {

    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 
      ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0){ 
          this.isStandard=true;
         this.isWhatsappEnabled=true;
    } 
    this.router.events.subscribe((val) => {
        
        
    });
  
    this.msg.sendMessage("supp");
     this.destOptions = {
            width: '100%',
            multiple: true,
            // tags: true
        };

    this.renderData();
    this.getAllUser();

    this.isSetupMail = localStorage.getItem('setup_mail');
    if(this.isStandard){
      this.accountServiceService.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
    }

    setTimeout(() => {
            this.load_form_data(); 
    }, 1400); 
  }
  
price_link=[{'link':''}]; 
addMorePrice(){
  var p_length=this.price_link.length;
  this.price_link.push({'link':''}); 
}
get_supplier_services(id){
  var services="";
    if(this.sup_services.length>0){
      for(let ser of this.sup_services){
        if(id==ser.id){
          services=ser.name;
        }
      }
    }
    return services;
}
get_supplier_type(id){
  var types="";
    if(this.supplier_types.length>0){
      for(let ser of this.supplier_types){
        if(id==ser.id){
          types=ser.name;
        }
      }
    }
    return types;
}

get_destination_name(id){
  var dest="";
    if(this.allDestinations.length>0){
      for(let des of this.allDestinations){
        if(id==des.id){
          dest=des.text;
        }
      }
    }
    return dest;
}
open_pull_it(dest_name,id){
 localStorage.setItem('opp_dest',dest_name);
 localStorage.setItem('opp_dest_id',id);
setTimeout(()=>{        
               let elem = document.getElementById('pullit_m_icon');
               let evt = new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      view: window
                  });
                elem.dispatchEvent(evt);
  },300); 
 

}
removePrice(i){ 
    console.log(this.price_link);  
    this.price_link.splice(i, 1);
}
  selectedDestin(dest_idd:any){
    this.newAccount.destination=dest_idd;
    console.log(this.newAccount.destination);
  }
  selectedServices(serv_idd:any){
    this.newAccount.supplier_services_id=serv_idd;
    console.log(this.newAccount); 
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
  openViewAllDialog(): void {
    let dialogRef = this.dialog.open(ViewAllComponent, {
      data: this.viewAll
      // data: { name: "this.name", animal: "this.animal" }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  allAccounts: any;
  openEditAccountPop() {
    this.EditAccPop = true;
    this.autoAccList = [];
    this.account_nameSearch = this.newAccount.acc_parent_name;
    // this.accountServiceService.rest_accounts_list().subscribe((data: any) => {
    //   console.log(data);
    //   this.allAccounts=data.accounts;
    // });
    this.searchControl = new FormControl();
    setTimeout(() => {
      this.loadAddressAutocomplete();
    }, 500);

    setTimeout(() => {
      $('#street_add').val(this.fulladdr);
    }, 1000);
    //this.loadAddressAutocomplete();

  }
  loadAddressAutocomplete() {


    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.country_name = '';
        this.state_name = '';
        this.city = '';
        this.zip_code = '';
        this.ngZone.run(() => {
          let place = autocomplete.getPlace();
          let that = this;
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } else {

            that.latitude = place.geometry.location.lat();
            that.longitude = place.geometry.location.lng();
            that.zoom = 12;
            that.fulladdr = place.formatted_address;
            var street_address="";
            var street_number="";
            var street_route=""; 
            for (var i = 0; i < (place.address_components).length; i++) {
              if (place.address_components[i].types[0] == 'street_number') {
                street_number  = place.address_components[i].long_name; 
              }
              if (place.address_components[i].types[0] == 'route') { 
                street_route  = place.address_components[i].long_name; 
              }
              if (place.address_components[i].types[0] == 'country') {
                that.country_name = place.address_components[i].long_name;
                that.country_code = place.address_components[i].short_name;
              }
              if (place.address_components[i].types[0] == "administrative_area_level_1") {
                that.state_name = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "locality") {
                that.city = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "postal_code") {
                that.zip_code = place.address_components[i].long_name;
              }
            }
          }
          var street_add=street_number?street_number+' ':'';
          street_address=street_add+street_route; 
          this.newAccount.billing_country = this.country_name;
          this.newAccount.billing_state = this.state_name;
          this.newAccount.billing_city = this.city;
          this.newAccount.billing_zip = this.zip_code;
          this.newAccount.billing_street = street_address;
        });
      });
    });
  }
  viewAll: any;
  contactViewAll() {
    this.viewAll = {
      "rContact": this.rContact,
      "new_id": this.id,
      "grid_name": "contactGrid",
      "link_name": "contactDetails",
      "type": "a"
    };
    this.openViewAllDialog();
  }

  oppoViewAll() {
    this.viewAll = {
      "opportunities": this.opportunities,
      "new_id": this.id,
      "grid_name": "OpportunityGrid",
      "link_name": "oppoDetails",
      "type": "a",
      "ref_id": 0
    };
    this.openViewAllDialog();
  }

  autoAccList = [];
  account_nameSearch: any;
  search_acc(evnt) {

    this.autoAccList = [];
    var val = evnt.target.value;
    
    console.log(val.length);
     if(val.length>2){
    this.accountServiceService.searh_account(val).subscribe((data: any) => {
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
  hash_chage(){
      let rand_char = Math.random().toString(36).substring(7);
    // window.location.hash=rand_char;
  }
  fetch_acc(id, name) {
    this.autoAccList = [];
    this.newAccount.acc_parent_id = id;
    this.account_nameSearch = name;
    console.log(this.newAccount);
  }

  selectt_dest=[];
  selectt_serv=[];
  all_fileds_val=[];
no_email_temp_modules=['[Account.','[Lead.','[Opportunity','[PersonalAccount.','[Contact.'];
  
watsapp:any={'recipient_no':'','recipient':'','message':'','whatsapp_type':'','whatsapp_id':''};
isWhatsappEnabled=false;
whatsapp_thread_exist=false;
  renderData() {
  this.email_templates_err='';
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove();

  this.selectt_dest=[];
  this.selectt_serv=[];

    this.accountServiceService.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
    });

    if (this.accParent == undefined) {
      this.accountServiceService.setUpAccountsMap().subscribe((data:any) => {
        this.acMap.setUpMaps(data);
        this.accParent = this.acMap.accParentMapData;
        this.accType = this.acMap.accTypeMapData;
        this.rating = this.acMap.ratingsMapData;
        this.industries = this.acMap.industriesMapData;
        this.sup_services = data.supplier_services;
        this.supplier_types = data.supplier_types;
        this.allDestinations=[];
        this.allServices=[];
        if(data && data.destinations!=undefined){ 
          for(let destin of data.destinations){ 
             this.allDestinations.push({ "id": destin.id, "text": destin.name+ ', ' +destin.country_name });
          }
        }  
        if(data && data.supplier_services!=undefined){ 
          for(let serv of data.supplier_services){ 
             this.allServices.push({ "id": serv.id, "text": serv.name });
          }
        } 
      });

    } else {
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;

    }
    this.id = this.route.snapshot.queryParams['id'];
    this.accountServiceService.getClientDetails(this.id).subscribe((data: any) => {
      this.clientData = data;
      console.log(this.clientData);
      if (this.clientData.past_activities_emails) {
        this.clientData.past_activities_emails.sort(function (a, b) {
          // console.log(a);
          if (b.created_at != null || a.created_at != null) {
            return <any>new Date(b.created_at) - <any>new Date(a.created_at);
          }
        });
      }

      if (data.next_steps && data.next_steps.length) {
        for (let i = 0; i < data.next_steps.length; i++) {
          var tsk_type = data.next_steps[i].taskable_type;
          console.log(tsk_type[1]);

          tsk_type = tsk_type.split('\\');
          if (tsk_type[1] != "Supplier") {
            var link = this.createUserActivityLink(tsk_type[1]);
            data.next_steps[i].taskable_link = link;
          } else {
            //data.next_steps[i].taskable_link='';
          } 
        }
        this.clientData.next_steps = data.next_steps;
      }
      // if (data.past_activities && data.past_activities.length > 0) {
      //   for (let i = 0; i < data.past_activities.length; i++) {
      //     var tsk_type = data.past_activities[i].taskable_type;
      //     tsk_type = tsk_type.split('\\');
      //     if (tsk_type[1] != "Supplier") {
      //       var link = this.createUserActivityLink(tsk_type[1]);
      //       data.next_steps[i].taskable_link = link;
      //     } else {
      //       //data.next_steps[i].taskable_link='';
      //     }
      //   }
      //   this.clientData.past_activities = data.past_activities;
      // }
      //this.contact = this.clientData.contacts;
      //this.rContact = this.clientData.related_contacts;
      this.clientDetails = this.clientData.account;
      if(this.clientDetails.tenant_whatsapp_exist){
        this.isWhatsappEnabled=true;
        this.watsapp.recipient_no=this.clientDetails.whatsapp_no;
        this.watsapp.whatsapp_id = this.clientDetails.id;
        this.watsapp.whatsapp_type = "App\\Supplier"; 
        this.whatsapp_thread_exist=this.clientDetails.whatsapp_thread_exist
      }
      this.mail.to_address = this.clientDetails.email;
      let temp = JSON.stringify(data.account);
      this.newAccount = JSON.parse(temp);
      this.newAccount.supplier_owner = localStorage.getItem('user');
      this.fulladdr = this.newAccount.billing_street;
 
        this.documentData=this.clientDetails.documents;  
        this.module_attachment=[]; 
        if(this.documentData && this.documentData.length>0){ 
              for(let doc of this.documentData){
                this.module_attachment.push(doc.title); 
              }
        }
     // this.account_nameSearch = this.newAccount.acc_parent_name;
      //this.opportunities = this.clientData.related_opportunities;
      this.assignedUserList = this.clientData.users;
      this.selectt_dest=[];
      this.selectedDestinationArray=[];

      if(this.clientDetails.destinations.length!=0){ 
          let i=0;
          for(let a of this.clientDetails.destinations){ 
            this.selectedDestinationArray.push({'id':a.id,'name':a.name,'geonameid':a.city_id,'dest_region_id':a.state_id,'country_iso_3':a.country_id})
           
            this.selectt_dest.push("" +a.id); 
            if(i==0){            
             localStorage.setItem('opp_dest',a.name);
             localStorage.setItem('opp_dest_id',a.city_id);
            }
            i++;
          } 
          this.newAccount.destination=this.selectt_dest;  
          this.newAccount.destinations=this.selectedDestinationArray;  
          console.log(this.selectt_dest);

      }
       this.newAccount.countries=[];
       this.selectedCountryinationArray=[];
      if(this.clientDetails.countries.length!=0){ 
          let i=0;
          for(let a of this.clientDetails.countries){ 
            this.selectedCountryinationArray.push({'id':a.id,'name':a.name,'iso_3':a.country_code});
            
          }  
        
          this.newAccount.countries=this.selectedCountryinationArray;

      }
       this.newAccount.states=[];
       this.selectedStateArray=[];
      if(this.clientDetails.states.length!=0){ 
          let i=0;
          for(let a of this.clientDetails.states){ 
            this.selectedStateArray.push({'id':a.id,'name':a.name,'country_code':a.country_code});
            
          }  
        
          this.newAccount.countries=this.selectedStateArray;

      }
      if(this.clientDetails.supplier_services_id && this.clientDetails.supplier_services_id.length!=0){  
          for(let a of this.clientDetails.supplier_services_id){ 
            this.selectt_serv.push("" +a.service_id);  
          } 
          this.newAccount.supplier_services_id=this.selectt_serv;  
          console.log(this.selectt_serv);

      }
      if(this.clientDetails.rate_list_links.length!=0){ 
          this.price_link=[];
          for(let a of this.clientDetails.rate_list_links){ 
            this.price_link.push({"link":a.links}); 
          }  

      }

      this.all_fileds_val=[];
      for (var key in this.clientDetails) {
          if (this.clientDetails.hasOwnProperty(key)) {
            var val = this.clientDetails[key]; 
            this.all_fileds_val['Supplier.'+key]=val; 
          }
      }
      this.get_additional_fields();
   },error=>{
      this.popUpMsg=error.error.message;
      this.openDialog(); 
    });
    // this.openDialog();
  }
  set_draft(){
      localStorage.setItem('account_email_desc', this.mail.description_html);
      localStorage.setItem('account_email_subject', this.mail.subject);  
      localStorage.setItem('account_email_to', this.mail.to_address);  
      localStorage.setItem('account_email_template', this.emailTemplate);
      console.log(localStorage.getItem('account_email_desc')); 
  }
  
  ngOnInit() {
   this.mail.description_html = localStorage.getItem('account_email_desc')=== null?'':localStorage.getItem('account_email_desc'); 
   this.mail.subject = localStorage.getItem('account_email_subject')=== null?'':localStorage.getItem('account_email_subject'); 
   this.emailTemplate = localStorage.getItem('account_email_template')=== null?'':localStorage.getItem('account_email_template');
   //this.mail.to_address = localStorage.getItem('account_email_to')=== null?'':localStorage.getItem('account_email_to');   

    //this.task.due_date=new Date();
    //        let Font = Quill.import('formats/font'); 
    //         Quill.register(Font, true); 

    //           // configure Quill to use inline styles so the email's format properly
    //         var DirectionAttribute = Quill.import('attributors/attribute/direction');
    //         Quill.register(DirectionAttribute,true);

    //         var AlignClass = Quill.import('attributors/class/align');
    //         Quill.register(AlignClass,true);

    //         var BackgroundClass = Quill.import('attributors/class/background');
    //         Quill.register(BackgroundClass,true);

    //         var ColorClass = Quill.import('attributors/class/color');
    //         Quill.register(ColorClass,true);

    //         var DirectionClass = Quill.import('attributors/class/direction');
    //         Quill.register(DirectionClass,true);

    //         // var FontClass = Quill.import('attributors/class/font');
    //         // Quill.register(FontClass,true);

    //         var SizeClass = Quill.import('attributors/class/size');
    //         Quill.register(SizeClass,true);

    //         var AlignStyle = Quill.import('attributors/style/align');
    //         Quill.register(AlignStyle,true);

    //         var BackgroundStyle = Quill.import('attributors/style/background');
    //         Quill.register(BackgroundStyle,true);

    //         var ColorStyle = Quill.import('attributors/style/color');
    //         Quill.register(ColorStyle,true);

    //         var DirectionStyle = Quill.import('attributors/style/direction');
    //         Quill.register(DirectionStyle,true);

    //         var FontStyle = Quill.import('attributors/style/font');
    //         FontStyle.whitelist =  ['sans-serif','serif','monospace','comic-sans-ms','arial',
    //         'times-new-roman','georgia','tahoma','trebuchet-ms','garamond','verdana'];
    //         Quill.register(FontStyle,true);


    //         var SizeStyle = Quill.import('attributors/style/size');
    //         Quill.register(SizeStyle,true);


    //     let toolbarOptions = [

    //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //     ['blockquote', 'code-block'],

    //     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //     [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    //     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    //     [{ 'direction': 'rtl' }],                         // text direction

    //     [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    //     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    //   //  [{ 'font': ['sans-serif','serif','monospace','comic-sans-ms','arial',
    //    // 'times-new-roman','georgia','tahoma','trebuchet-ms','garamond','verdana'] }],
    //      [{ 'font': [] }],
    //     [{ 'align': [] }],

    //     ['clean']                                         // remove formatting button
    // ];
    // var quill = new Quill('#editor-container', {
    //   modules: {
    //     toolbar: '#toolbar-container'
    //   },
    //   placeholder: 'Compose an epic...',
    //   theme: 'snow'
    // });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
    this.assignedUserOptions = this.myControl2.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterAssisnedUser(val))
      );
    this.loadPermissionSet();
  }
  view_account = false;
  create_account = false;
  download_account = false;
  edit_account = false;
  delete_account = false;
  upload_account = false;
  create_opportunity = false;
  create_contact = false;

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Account) {
        console.log(permissionArray.Account);
        permissionArray.Account.forEach(permissions => {
          if (permissions.name == 'view_account') {
            this.view_account = true;
          }
          if (permissions.name == 'create_account') {
            this.create_account = true;
          }
          if (permissions.name == 'edit_account') {
            this.edit_account = true;
          }
          if (permissions.name == 'delete_account') {
            this.delete_account = true;
          }
          if (permissions.name == 'upload_account') {
            this.upload_account = true;
          }
          if (permissions.name == 'download_account') {
            this.download_account = true;
          }
        });
      }
      if (permissionArray.Contact) {
        console.log(permissionArray.Contact);
        permissionArray.Contact.forEach(permissions => {
          if (permissions.name == 'create_contact') {
            this.create_contact = true;
          }
        });
      }
      if (permissionArray.Opportunity) {
        console.log(permissionArray.Opportunity);
        permissionArray.Opportunity.forEach(permissions => {
          if (permissions.name == 'create_opportunity') {
            this.create_opportunity = true;
          }
        });
      }

    }
          if (localStorage.getItem('modulesArray') != null) {
          var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
          console.log(modulesArray); 
            modulesArray.forEach(module => { 
            if(module.email_template==true){
             this.show_email_temp=true;
            } 
            });
          }
    if (this.view_account == false) {
      //alert('You are not Authorized to view this page!';);
      this.popUpMsg = 'You are not Authorized to view this page!';
      this.openDialog();
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }


  }

show_email_temp=false;
  filter(val: string): any[] {
    return this.rContact.filter(option => {
      if (val != null && val != undefined) {
        let arr = (option.first_name + " " + option.middle_name + " " + option.last_name).split(null);
        for (let a of arr) {
          if (a.toLowerCase().includes(val.toString().toLowerCase())) {
            return true;
          }
        }
      }
    });

  }
  filterAssisnedUser(val: string): any[] {
    if (val != null && val != undefined) {
      return this.assignedUserList.filter((s) => new RegExp(val, 'gi').test(s.name));
      // return this.assignedUserList.filter(option => {
      //   for (let a of option.name) {
      //     if (a.toLowerCase().includes(val.toString().toLowerCase())) {
      //       return true;
      //     }
      //   }
      // });
    }
  }
all_attachment: any = [];
all_attachment_urls: any = [];
attachFiles(files: FileList){   
    const file = files[0];   
    let form = new FormData();
    form.set("email_image",file);
    let that1=this;  
    this.fileService.uploadFileTos3(form).subscribe((data:any) => {
          if(data.image_url){            
              this.all_attachment.push(data.name);
              this.all_attachment_urls.push(data.image_url);
              this.mail.documents=this.all_attachment_urls;
          }          
          console.log(this.all_attachment); 
          console.log(this.mail);  
            
             
    },(error)=>{
       this.popUpMsg= 'File unable to upload!';
            this.openDialog(); 
    });    
            
          
}
removeAttachment(index){
  this.all_attachment.splice(index, 1);
  this.all_attachment_urls.splice(index, 1);
  this.mail.documents=this.all_attachment_urls;
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
    this.mail.from_address = this.clientData.auth_email;
    this.mail.emailable_id = this.clientDetails.id;
    this.mail.emailable_type = "App\\Supplier";

    this.accountServiceService.sendMail(this.mail).subscribe(data => {
      this.popUpMsg = data;
      this.openDialog();
      this.myControl.reset();
      this.myControl2.reset();
      this.date.reset();
      this.clear_con_list();
      this.mail = new EmailClass();
      this.emailTemplate = undefined;
      this.renderData();
      this.all_attachment=[];
      this.all_attachment_urls=[];
      this.mail.documents=[];
    }, error => {
      console.log(error, 'error report');
      this.popUpMsg = error.error.message;
      this.openDialog();
    });
  }

  logCall() {
    this.call.taskable_id = this.clientDetails.id;
    this.accountServiceService.callLog(this.call).subscribe(data => {
      this.call = {
        "subject": undefined,
        "due_date": undefined,
        "contact_id": undefined,
        "taskable_type": "App\\Supplier",
        "taskable_id": undefined,
        "status": "completed"
      }

      this.renderData();
      this.popUpMsg = data;
      this.openDialog();

      this.myControl.reset();
      this.myControl2.reset();
      this.date.reset();

    }, error => {
      console.log(error, 'error report');
     // this.popUpMsg = error.error.message;
     // this.openDialog();
    });
  }


    due_error=false;
  createTask() {
    this.task.taskable_id = this.clientDetails.id;
    //this.task.due_date = this.date.value; 

    if (this.task.due_date != undefined) {
      this.task.due_date = new Date(this.task.due_date);
      var dd = (this.task.due_date.getDate() < 10 ? '0' : '') + this.task.due_date.getDate();
      var MM = ((this.task.due_date.getMonth() + 1) < 10 ? '0' : '') + (this.task.due_date.getMonth() + 1);
      var yyyy = this.task.due_date.getFullYear();
      var hh = this.task.due_date.getHours();
      var min = this.task.due_date.getMinutes();
      this.task.due_date = yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + min;
    }else{
            this.due_error = true;
            this.popUpMsg = "Please fill due date";
            this.openDialog();
            return;
         }
    console.log(this.task.due_date);
    // return false;
    this.accountServiceService.callLog(this.task).subscribe(data => {
      // alert("JSON " + JSON.stringify(data));
      this.task = {
        "assigned_user_id": undefined,
        "subject": undefined,
        "due_date": undefined,
        "contact_id": undefined,
        "taskable_type": "App\\Supplier",
        "taskable_id": undefined,
        "status": "open"
      }
      this.renderData();
      this.popUpMsg = data;
      this.openDialog();
      this.myControl = new FormControl;
      this.myControl2 = new FormControl;
 
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filter(val))
        );
      this.assignedUserOptions = this.myControl2.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filterAssisnedUser(val))
        );
      // this.myControl.reset();
      // this.myControl2.reset();
      this.date.reset();
    }, error => {
       this.renderData();
     // console.log(error, 'error report');
     // this.popUpMsg = error.error.message;
     // this.openDialog();
    });
  }

  getASelectedVal(selected) {
    this.call.contact_id = selected.id;
    this.task.contact_id = selected.id;
  }

  getASelectedValUser(selected) {
    this.task.assigned_user_id = selected.id;
  }
  displayFn(obj) {
    if (obj != null && obj != undefined) {
      let name = obj.salutation + " " + obj.first_name + " " + obj.middle_name + " " + obj.last_name;
      while (name.includes(null)) {
        name = name.replace(null, "").replace("  ", " ").trim();
      }
      return obj ? name : undefined;
    }
    return "";
  }
  displayAssignedUserFn(obj) {

    if (obj != null && obj != undefined) {
      console.log("obj.name " + JSON.stringify(obj));
      let name = obj.name;
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

email_templates_err='';
 checkForDynamicTemplate(template){
  this.email_templates_err='';
 // if(template.published=='d'){
          let no_mod=false; 
          for(let mod of this.no_email_temp_modules){
           var no_mod_index= template.body.indexOf(mod); 
            if(no_mod_index > -1){
              no_mod=true;
            }
          }
          if(no_mod){
             this.email_templates_err='Some template value(s) may not available in this module!';
          }
 // } 

 } 
setTemplatePlaceHolder(template){
 // if(template.published=='d'){
      for(let mod in this.all_fileds_val){
          console.log('['+mod+']',this.all_fileds_val[mod]);
          console.log( this.mail.description_html.indexOf('['+mod+']'));
          setTimeout(()=>{
             var repl= this.mail.description_html.replace('['+mod+']',this.all_fileds_val[mod]);
              this.mail.description_html=repl;
              console.log(this.mail.description_html);
             },50);
      }
 //  }
}
  // setUpEmailValue() {
  //   this.emailTemplate = JSON.parse(this.emailTemplate);
  //   this.mail.from_address = this.clientData.auth_email;
  //   this.mail.subject = this.emailTemplate.subject;
  //   this.mail.description_html = this.emailTemplate.body;

  //   console.log(this.emailTemplate);
  // }
  ngOnDestroy() {

  }
  ngAfterViewChecked() {

  }
  getKeys(map) {
    let arr: any[] = [];
    for (let k in map) arr.push(k);
    return arr;
  }
  fetchState() {
    this.accountServiceService.getStateList(Number(JSON.parse(this.newAccount.billing_country).id)).subscribe((data: any) => {
      this.stateList = data.states;
    });
  }

  fetchCity() {
    this.accountServiceService.getCityList(Number(JSON.parse(this.newAccount.billing_state).id)).subscribe((data: any) => {
      this.cityList = data.cities;
    });
  }
  name_error = false;
  accType_error = false;

 updateAccountSt(){
  if(this.checkStandardFiledValidation()==false){
      console.log('ff')
      return false;
    } 
    
    console.log(this.newAccount);
    //return false;

    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newAccount.custom_fields = [];
      this.updateAccount();
    }
  }
  checkStandardFiledValidation(){
    var standard_error=false; 
    for (let st_fld of this.standardFields) {
       if(st_fld.mandatory==1 && (this.newAccount[st_fld.name]==undefined || this.newAccount[st_fld.name]=='')){
            

      console.log(this.newAccount[st_fld.name],st_fld.name+'--MAN--'+st_fld.mandatory);
      this.popUpMsg = 'Please fill '+st_fld.label;
      this.openDialog();
      standard_error=true;
      return false;
    } 
    }
    if(standard_error==false){
      //return false; 
    }

  }


  updateAccount() {
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newAccount.custom_fields = [];
      this.submit_account();
    }

  }
  supp_type_err=false;
  submit_account() {
    console.log(this.newAccount);
    if (!this.newAccount.name) {
      this.name_error = true;
      this.popUpMsg = JSON.stringify('Please fill Supplier Name');
      this.openDialog();
      return;
    }
if (!this.newAccount.supplier_type_id) {
      this.supp_type_err = true; 
      this.popUpMsg = JSON.stringify('Please select supplier type');
      this.openDialog();
      return;
    }

if (!this.newAccount.email) {
      this.email_error = true; 
      this.popUpMsg = JSON.stringify('Please fill valid email');
      this.openDialog();
      return;
    }
    if (this.email_error) {
      this.popUpMsg = 'Please fill valid email id!';
      this.openDialog();
      return;
    }
    this.newAccount.rate_list_links=this.price_link;
    this.newAccount.countries=this.selectedCountryinationArray;
     this.newAccount.states=this.selectedStateArray;
    this.newAccount.destinations=this.selectedDestinationArray;
    this.newAccount.documents=this.documentData;
    this.accountServiceService.updateClient(this.newAccount).subscribe(data => {
      // alert(JSON.stringify(data));
      this.EditAccPop = false;
      this.renderData();
      this.popUpMsg = data;
      this.openDialog();
      this.closeRightpanel();
      this.newStAccPop=false;
    });
  }
  getOwnerName(id: number) {
    for (let obj of this.assignData) {
      if (obj.id == id) {
        return obj.text;
      }
    }
  }
  returnAccountName(id: number) {
    for (let obj of this.clientData.related_contacts) {
      if (obj.id == id) {
        return obj.name;
      }
    }
  }

  createUserActivityLink(feed_type) {
    var link = '';
    console.log(feed_type);
    if (feed_type == "Account") {
      return link = "clientDetails";
    }
    if (feed_type == "PersonalAccount") {
      return link = "personelDetails";
    }
    if (feed_type == "Contact") {
      return link = "contactDetails";
    }
    if (feed_type == "Task") {
      return link = "tasks";
    }
    if (feed_type == "Opportunity") {
      return link = "oppoDetails";
    }
    if (feed_type == "Lead") {
      return link = "leaderDetails";
    }
    if (feed_type == "FileManagement") {
      console.log('adsa');
      return link = "fileDetails";
    }
    if (feed_type == "Supplier") {
      return link = "supplierDetails";
    }

  }
  delete() {
    this.accountServiceService.delete(this.id).subscribe(
      (obj: any) => { 
        this.popUpMsg = obj;
        this.router.navigate(['/maindashboard', { outlets: { bodySection: ['supplier'] } }]);
        this.openDialog();
      }
    );
  }
  refreshEmail() {
    this.accountServiceService.refreshEmail().subscribe(data => {
      this.renderData();
    });
  }
  trimEmail(email) {
    var name = email.substring(0, email.lastIndexOf("@"));
    name = name.replace(/[\. _ ,:-]+/g, " ");
    return name;
  }
  showCopy(evnt) {
    //console.log(evnt);
    var cls = $(evnt.target).attr('class');
    $('.' + cls + ' .copy-hvr').css('display', 'inline-block');
    //$('.'+cls+' .copy-hvr').hide(1000);

  }
  hideCopy(evnt) {
    //console.log('mout');
    var cls = $(evnt.target).attr('class');
    $('.' + cls + ' .copy-hvr').css('display', 'none');
    //$('.'+cls+' .copy-hvr').show(1000);
  }
  copyText(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    //  alert('Copied Successfuly');
    this.popUpMsg = 'Copied Successfuly';
    this.openDialog();
  }
  autocontList = [];
  contact_nameSearch: any;
  per_acc_nameSearch: any;
  search_contacts(evnt) {
    this.autocontList = [];
    var val = evnt.target.value;
    if (val.length > 2) {
      console.log(val);
      this.accountServiceService.searh_contacts(val).subscribe((data: any) => {
        console.log(data);
        if (data && data.contacts) {
          this.autocontList = data.contacts;
        } else {
          this.autocontList = [];
        }


      });
    } else {
      this.autocontList = [];
    }
  }
  selectContId(cont) {
    this.contact_nameSearch = cont.first_name + ' ' + cont.last_name;
    this.autocontList = [];
    this.call.contact_id = cont.id;
    this.task.contact_id = cont.id;

  }
  to_address_list = [];
  cc_address_list = [];
  bcc_address_list = [];
  search_email(evnt, type) {
    this.to_address_list = [];
    this.cc_address_list = [];
    this.bcc_address_list = [];
    var val = evnt.target.value;

    if (val.length > 2) {
      this.formService.searh_email(val, 'contacts').subscribe((data: any) => {
        console.log(data);
        if (type == 'to_address') {
          this.to_address_list = data.contacts;
        }
        if (type == 'cc_address') {
          this.cc_address_list = data.contacts;
        }
        if (type == 'bcc_address') {
          this.bcc_address_list = data.contacts;
        }

      });
    } else {
      this.to_address_list = [];
      this.cc_address_list = [];
      this.bcc_address_list = [];

    }
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
  clear_con_list() {
    this.autocontList = [];
    this.contact_nameSearch = '';
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
        "supplier_id": this.id,
        "supplier_additional_field_id": field_obj.id,
        "field_value": value ? value : '',
        "type": field_obj.type,
        "name": field_obj.name,
        "type_value": field_obj.type_value ? field_obj.type_value.toString() : ''
      };
      // console.log(value); 

      this.customFields.push(vJson);
      //this.customFields[i][key]=value;
      i++;
    }
    console.log(this.customFields);
    this.newAccount.custom_fields = this.customFields;
    console.log(this.newAccount.custom_fields);
    this.submit_account();
  }
  get_additional_fields() {
this.extraFields=[];
    this.formService.getAllfields('Supplier').subscribe((data: any) => {
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

          if (custom.supplier_additional_field_id == this.extraformModel[i]['id']) {
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
    if (this.extraFields) {
      for (let fld of this.extraFields) {
        if (fld.id == id) {
          return fld.label;
        }
      }
    }
  }
  get_custom_value(val_id,id){
    var val_name="pick val";


   if(id){ 
       if (this.extraFields) {
        for (let fld of this.extraFields) {
          if (fld.id == id) {
            this.formService.load_picklist(fld.name).subscribe((data: any) => {
            console.log('pick data'); 
            var allPickVal=this.setPickDropdown(data,fld.name);
            for(let vl of allPickVal){
              if(vl.id==val_id){
                val_name=vl.name;
              }
            }
        }); 
          }
        }
      } 
    }
    return val_name;

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
       if(picklist_selected=='inclusions'){
        picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='task_priorities'){
        picklistAllValue=data.task_priorities;
       }
       if(picklist_selected=='experiences'){
        picklistAllValue=data.experiences;
       }
       if(picklist_selected=='destinations'){
        picklistAllValue=data.destinations;
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistAllValue=data.itinerary_inclusions;
       }
       if(picklist_selected=='sales_stages'){
        picklistAllValue=data.sales_stages;
       }
     return picklistAllValue;

  }
  ownerShipEdit = false;
  account_new_owner_id: any;
  public ownerOptions: Select2Options;
  assignData: any = [];
  openOwnership() {
    this.ownerShipEdit = true;
    this.account_new_owner_id = this.clientDetails.owner_id;
  }
  changeOwner() {

    var changeOwn = { "account_id": this.id, "account_new_owner_id": this.account_new_owner_id };
    this.formService.changeOwner(changeOwn, 'supplier').subscribe((data: any) => {
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
    this.account_new_owner_id = value;
  }
  selectBox() {
    $('.select2-container').css('z-index', 5000);
  }
  getAllUser() {
    this.formService.getAllUsers().subscribe((data: any) => {
      console.log(data);
      if (data.users != undefined) {
        let i = 0;
        for (let e of data.users) {
          //console.log(e.id);
          this.assignData.push({ "id": e.id, "text": e.name });
          i++;
        }
      }
    });
  }


  email_error = false;
  email_error_msg = '';
  validateEmail(emailField) {
    this.email_error_msg = '';
    //console.log(emailField);
    emailField = emailField.target;
   // if(emailField.value){
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (emailField.value && reg.test(emailField.value) == false) {
          //alert('Invalid Email Address');
          this.email_error_msg = "Invalid Email Address";
          this.email_error = true;
          return false;
        } else {
          this.email_error_msg = '';
          this.email_error = false;
        }
  // }else{
  //     this.email_error_msg = '';
  //     this.email_error = false;
    
  // }
    return true;
  }

  validate_phone(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }
  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
  }
  show_acc_led(id){
    $(".acc_led").css("display","none");
    $("#acc_led_"+id).css("display","block");
  }
  hide_acc_led(){
    $(".acc_led").css("display","none");
  }

  isStandard=false;
  standardFields=[];
  newStAccPop=false;
  formTitle="Edit Supplier(standard)";
  st_formType="Supplier";
  openStandard_f=false;
    @ViewChild("search_st")
    public searchElementRef_st: ElementRef;  
    public searchControl_st:FormControl;


  openEditAccountPopSt(){
   this.openStandard_f=true;
   this.newStAccPop=true;
     this.searchControl_st = new FormControl();
     setTimeout(()=>{
            this.loadAddressAutocomplete_st();
         },500);
  }

 loadAddressAutocomplete_st(){
       
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        this.mapsAPILoader.load().then(() => {  
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef_st.nativeElement, {
            types: ["address"]
          }); 
          autocomplete.addListener("place_changed", () => {
            this.country_name ='';
                this.state_name ='';
                this.city = '';
                this.zip_code = ''; 
            this.ngZone.run(() => {
               let place = autocomplete.getPlace();
               let that=this;
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }else{            

                        that.latitude = place.geometry.location.lat();
                        that.longitude = place.geometry.location.lng();
                        that.zoom = 12;
                        that.fulladdr = place.formatted_address;
                        var street_address="";
                        var street_number="";
                        var street_route=""; 
                        for (var i = 0; i < (place.address_components).length; i++) {
                          if (place.address_components[i].types[0] == 'street_number') {
                            street_number  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'route') { 
                            street_route  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'country') {
                            that.country_name = place.address_components[i].long_name;
                            that.country_code = place.address_components[i].short_name;
                          }
                          if (place.address_components[i].types[0] == "administrative_area_level_1") {
                            that.state_name = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "locality") {
                            that.city = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "postal_code") {
                            that.zip_code = place.address_components[i].long_name;
                          }
                        }
              }
                var street_add=street_number?street_number+' ':'';
                street_address=street_add+street_route;  
                this.newAccount.billing_country = this.country_name;
                this.newAccount.billing_state = this.state_name;
                this.newAccount.billing_city = this.city;
                this.newAccount.billing_zip = this.zip_code;
                this.newAccount.billing_street = street_address;
            }); 
          });
        });
    }
  picklistValues=[];
  standard_address=false;
  load_form_data(){
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k=0; k < this.standardFields.length;k++) { 

        if(this.standardFields[k].type=='address'){
           this.standard_address=true;
        }
        this.picklistValues.push({'type_value':[{'id':1,"name":"nammmm"}]});
        if(this.standardFields[k].type=='picklist'){      
          let that=this;
          var pick_name=this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k); 
              //this.picklistValues[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              this.standardFields[k].type_value=this.setPickDropdown2(data,this.standardFields[k].name);
              console.log(that.standardFields[k]);  
             
              });  
        }
      }  
    }
  } 
  get_picklist_name(picklist_selected){
    var picklistName='';
     
       if(picklist_selected=='industry_id'){
        picklistName='industries';
       }
       if(picklist_selected=='salutation'){
        picklistName='salutations';
       }
       if(picklist_selected=='rating_id'){
        picklistName='ratings';
       }
       if(picklist_selected=='lead_status_id'){
        picklistName='lead_statuses';
       }
     return picklistName;

  }
  setPickDropdown2(data,picklist_selected){ 
    var picklistAllValue=[];
     
       if(picklist_selected=='industry_id'){
        picklistAllValue=data.industries;
       }
       if(picklist_selected=='salutation'){
        picklistAllValue=data.salutations;
       }
       if(picklist_selected=='rating_id'){
        picklistAllValue=data.ratings;
       }
       if(picklist_selected=='lead_status_id'){
        picklistAllValue=data.lead_statuses;
       }
     return picklistAllValue;

  }

 
  goToLink(url){
    window.open(url, "_blank");
  }
rfqData=[];

rfq_details(data){
  this.rfqData=data;
}
close_rfq(){
  this.rfqData=[];
}

autoCountryList=[];
countries_nameSearch="";
selectedCountryinationArray=[];
search_country() {
    this.autoCountryList = [];
    var val = this.countries_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchCountry(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.countries) {
            this.autoCountryList = data.countries;
          } else {
            this.autoCountryList = [];
          }
        });
    }else{
        this.autoCountryList = [];
    }

  }

  selectCountId(dest_id){
     var d_avail=false;
    for(let des of this.autoCountryList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedCountryinationArray.length>0){
            console.log('1');

              for(let avail of this.selectedCountryinationArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedCountryinationArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedCountryinationArray.push(des);
          }
      }
    }
   this.autoCountryList=[];
   this.countries_nameSearch="";
   console.log(this.selectedCountryinationArray); 
   this.newAccount.countries=this.selectedCountryinationArray;
   this.dest_error=false;
  }

dest_error=false;
  autoDestList=[];
  destination_nameSearch="";
  selectedDestinationArray=[];
search_dest() {
    this.autoDestList = [];
    var val = this.destination_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchDestinations(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.destination) {
            this.autoDestList = data.destination;
          } else {
            this.autoDestList = [];
          }
        });
    }else{
        this.autoDestList = [];
    }

  }

  selectDestId(dest_id){
     var d_avail=false;
    for(let des of this.autoDestList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedDestinationArray.length>0){
            console.log('1');

              for(let avail of this.selectedDestinationArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedDestinationArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedDestinationArray.push(des);
          }
      }
    }
   this.autoDestList=[];
   this.destination_nameSearch="";
      console.log(this.selectedDestinationArray); 
      this.newAccount.destinations=this.selectedDestinationArray;
      this.dest_error=false;
  }
  removeDestin(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedDestinationArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedDestinationArray.splice(index, 1);

      }
      this.newAccount.destinations=this.selectedDestinationArray;
  }
 removeCount(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedCountryinationArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedCountryinationArray.splice(index, 1);

      }
      this.newAccount.countries=this.selectedCountryinationArray;
  }


autoStateList=[];
states_nameSearch="";
selectedStateArray=[];
search_state() {
    this.autoStateList = [];
    var val = this.states_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchState(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.states) {
            this.autoStateList = data.states;
          } else {
            this.autoStateList = [];
          }
        });
    }else{
        this.autoStateList = [];
    }

  }

  selectStateId(dest_id){
     var d_avail=false;
    for(let des of this.autoStateList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedStateArray.length>0){
            console.log('1');

              for(let avail of this.selectedStateArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedStateArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedStateArray.push(des);
          }
      }
    }
   this.autoStateList=[];
   this.states_nameSearch="";
   console.log(this.selectedStateArray); 
   this.newAccount.states=this.selectedStateArray;
   this.dest_error=false;
  }
 removeState(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedStateArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedStateArray.splice(index, 1);

      }
      this.newAccount.states=this.selectedStateArray;
  }

}